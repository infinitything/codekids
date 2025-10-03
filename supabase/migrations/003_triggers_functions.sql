-- ============================================
-- DATABASE TRIGGERS & FUNCTIONS
-- Run this AFTER 002_rls_policies.sql
-- ============================================

-- ============================================
-- 1. AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a basic user profile when someone signs up
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    'parent', -- Default role
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on new auth user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. AUTO-UPDATE TIMESTAMPS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_parents_updated_at ON public.parents;
CREATE TRIGGER update_parents_updated_at
  BEFORE UPDATE ON public.parents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 3. CALCULATE LEVEL FROM XP
-- ============================================

CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(xp_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: square root of (XP / 100)
  -- Level 1: 0-99 XP
  -- Level 2: 100-399 XP
  -- Level 3: 400-899 XP
  -- Level 4: 900-1599 XP
  -- Level 5: 1600-2499 XP
  -- etc.
  RETURN GREATEST(1, FLOOR(SQRT(xp_points / 100.0)) + 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-update level when XP changes
CREATE OR REPLACE FUNCTION public.update_student_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = public.calculate_level_from_xp(NEW.xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_level_on_xp_change ON public.students;
CREATE TRIGGER update_level_on_xp_change
  BEFORE INSERT OR UPDATE OF xp ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_level();

-- ============================================
-- 4. ADD XP TO STUDENT (Helper Function)
-- ============================================

CREATE OR REPLACE FUNCTION public.add_student_xp(
  p_student_id UUID,
  p_xp_amount INTEGER,
  p_reason TEXT DEFAULT 'Lesson completion'
)
RETURNS TABLE(
  new_xp INTEGER,
  new_level INTEGER,
  level_up BOOLEAN
) AS $$
DECLARE
  v_old_xp INTEGER;
  v_new_xp INTEGER;
  v_old_level INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Get current XP and level
  SELECT xp, level INTO v_old_xp, v_old_level
  FROM public.students
  WHERE id = p_student_id;

  -- Add XP
  v_new_xp := v_old_xp + p_xp_amount;
  
  -- Update student
  UPDATE public.students
  SET xp = v_new_xp,
      updated_at = NOW()
  WHERE id = p_student_id;

  -- Get new level (trigger will calculate it)
  SELECT level INTO v_new_level
  FROM public.students
  WHERE id = p_student_id;

  -- Return results
  RETURN QUERY SELECT 
    v_new_xp,
    v_new_level,
    (v_new_level > v_old_level) as level_up;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. UPDATE STREAK (Helper Function)
-- ============================================

CREATE OR REPLACE FUNCTION public.update_student_streak(p_student_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_last_active DATE;
  v_current_streak INTEGER;
  v_new_streak INTEGER;
BEGIN
  -- Get current streak and last active date
  SELECT 
    last_active_at::DATE,
    streak_days
  INTO v_last_active, v_current_streak
  FROM public.students
  WHERE id = p_student_id;

  -- Calculate new streak
  IF v_last_active = CURRENT_DATE THEN
    -- Already active today, no change
    v_new_streak := v_current_streak;
  ELSIF v_last_active = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Active yesterday, increment streak
    v_new_streak := v_current_streak + 1;
  ELSE
    -- Streak broken, reset to 1
    v_new_streak := 1;
  END IF;

  -- Update student
  UPDATE public.students
  SET 
    streak_days = v_new_streak,
    last_active_at = NOW(),
    updated_at = NOW()
  WHERE id = p_student_id;

  RETURN v_new_streak;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. AWARD BADGE (Helper Function)
-- ============================================

CREATE OR REPLACE FUNCTION public.award_badge(
  p_student_id UUID,
  p_badge_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_already_has BOOLEAN;
BEGIN
  -- Check if student already has this badge
  SELECT EXISTS(
    SELECT 1 FROM public.student_badges
    WHERE student_id = p_student_id AND badge_id = p_badge_id
  ) INTO v_already_has;

  IF v_already_has THEN
    RETURN FALSE; -- Already has badge
  END IF;

  -- Award the badge
  INSERT INTO public.student_badges (student_id, badge_id, earned_at)
  VALUES (p_student_id, p_badge_id, NOW());

  RETURN TRUE; -- Badge awarded
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. LOG DAILY ACTIVITY
-- ============================================

CREATE OR REPLACE FUNCTION public.log_daily_activity(
  p_student_id UUID,
  p_activity_type TEXT,
  p_duration_minutes INTEGER DEFAULT 0,
  p_xp_earned INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  -- Insert or update today's activity
  INSERT INTO public.daily_activities (
    student_id,
    activity_date,
    activity_type,
    duration_minutes,
    xp_earned,
    created_at
  )
  VALUES (
    p_student_id,
    CURRENT_DATE,
    p_activity_type,
    p_duration_minutes,
    p_xp_earned,
    NOW()
  )
  ON CONFLICT (student_id, activity_date, activity_type)
  DO UPDATE SET
    duration_minutes = public.daily_activities.duration_minutes + p_duration_minutes,
    xp_earned = public.daily_activities.xp_earned + p_xp_earned;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. COMPLETE LESSON (All-in-one function)
-- ============================================

CREATE OR REPLACE FUNCTION public.complete_lesson(
  p_student_id UUID,
  p_lesson_id UUID,
  p_course_id UUID,
  p_xp_earned INTEGER DEFAULT 50
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
  v_xp_result RECORD;
  v_new_streak INTEGER;
BEGIN
  -- Update lesson progress
  INSERT INTO public.progress (
    student_id,
    lesson_id,
    course_id,
    status,
    progress_percentage,
    completed_at,
    created_at,
    updated_at
  )
  VALUES (
    p_student_id,
    p_lesson_id,
    p_course_id,
    'completed',
    100,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (student_id, lesson_id)
  DO UPDATE SET
    status = 'completed',
    progress_percentage = 100,
    completed_at = NOW(),
    updated_at = NOW();

  -- Add XP
  SELECT * INTO v_xp_result
  FROM public.add_student_xp(p_student_id, p_xp_earned, 'Lesson completed');

  -- Update streak
  v_new_streak := public.update_student_streak(p_student_id);

  -- Log activity
  PERFORM public.log_daily_activity(
    p_student_id,
    'lesson_completion',
    15, -- Assume 15 minutes per lesson
    p_xp_earned
  );

  -- Build result
  v_result := json_build_object(
    'success', true,
    'xp_earned', p_xp_earned,
    'total_xp', v_xp_result.new_xp,
    'level', v_xp_result.new_level,
    'level_up', v_xp_result.level_up,
    'streak', v_new_streak
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SUCCESS! All triggers and functions created
-- ============================================

