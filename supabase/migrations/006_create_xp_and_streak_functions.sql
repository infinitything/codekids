-- =====================================================
-- MIGRATION 006: Database Functions for XP and Streaks
-- =====================================================
-- Description: Create database functions for adding XP and updating streaks
-- Author: CodeKid Team
-- Date: 2024

-- Function: add_student_xp
-- Description: Adds XP to a student and automatically levels them up
CREATE OR REPLACE FUNCTION public.add_student_xp(
  student_uuid UUID,
  xp_amount INTEGER
)
RETURNS TABLE (
  new_xp INTEGER,
  new_level INTEGER,
  leveled_up BOOLEAN
) AS $$
DECLARE
  current_student RECORD;
  xp_for_next_level INTEGER;
  calculated_level INTEGER;
  old_level INTEGER;
BEGIN
  -- Get current student data
  SELECT experience_points, current_level
  INTO current_student
  FROM public.students
  WHERE id = student_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found: %', student_uuid;
  END IF;
  
  -- Calculate new XP
  new_xp := current_student.experience_points + xp_amount;
  old_level := current_student.current_level;
  
  -- Calculate level based on XP (formula: level = sqrt(xp / 100))
  -- Each level requires: level^2 * 100 XP
  calculated_level := FLOOR(SQRT(new_xp / 100.0))::INTEGER;
  IF calculated_level < 1 THEN
    calculated_level := 1;
  END IF;
  
  new_level := calculated_level;
  leveled_up := (new_level > old_level);
  
  -- Update student record
  UPDATE public.students
  SET 
    experience_points = new_xp,
    current_level = new_level,
    updated_at = NOW()
  WHERE id = student_uuid;
  
  -- If leveled up, log achievement
  IF leveled_up THEN
    INSERT INTO public.achievements (student_id, achievement_type, achievement_data, xp_earned)
    VALUES (
      student_uuid,
      'level_up',
      jsonb_build_object('old_level', old_level, 'new_level', new_level),
      0
    );
  END IF;
  
  RETURN QUERY SELECT new_xp, new_level, leveled_up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.add_student_xp(UUID, INTEGER) TO authenticated;

-- Function: update_student_streak
-- Description: Updates student's daily activity streak
CREATE OR REPLACE FUNCTION public.update_student_streak(
  student_uuid UUID
)
RETURNS INTEGER AS $$
DECLARE
  student_record RECORD;
  days_since_last_activity INTEGER;
  new_streak INTEGER;
BEGIN
  -- Get current student data
  SELECT streak_days, last_activity_date
  INTO student_record
  FROM public.students
  WHERE id = student_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found: %', student_uuid;
  END IF;
  
  -- Calculate days since last activity
  IF student_record.last_activity_date IS NULL THEN
    days_since_last_activity := 999; -- Never active
  ELSE
    days_since_last_activity := EXTRACT(DAY FROM (CURRENT_DATE - student_record.last_activity_date::DATE));
  END IF;
  
  -- Update streak logic
  IF days_since_last_activity = 0 THEN
    -- Same day activity - no change to streak
    new_streak := student_record.streak_days;
  ELSIF days_since_last_activity = 1 THEN
    -- Consecutive day - increment streak
    new_streak := student_record.streak_days + 1;
  ELSE
    -- Streak broken - reset to 1
    new_streak := 1;
  END IF;
  
  -- Update student record
  UPDATE public.students
  SET 
    streak_days = new_streak,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE id = student_uuid;
  
  -- Award badges for streak milestones
  IF new_streak = 7 THEN
    -- 7-day streak badge
    INSERT INTO public.achievements (student_id, achievement_type, achievement_data, xp_earned)
    VALUES (
      student_uuid,
      'streak_7_days',
      jsonb_build_object('streak', 7),
      50
    )
    ON CONFLICT DO NOTHING;
  ELSIF new_streak = 30 THEN
    -- 30-day streak badge
    INSERT INTO public.achievements (student_id, achievement_type, achievement_data, xp_earned)
    VALUES (
      student_uuid,
      'streak_30_days',
      jsonb_build_object('streak', 30),
      200
    )
    ON CONFLICT DO NOTHING;
  ELSIF new_streak = 100 THEN
    -- 100-day streak badge
    INSERT INTO public.achievements (student_id, achievement_type, achievement_data, xp_earned)
    VALUES (
      student_uuid,
      'streak_100_days',
      jsonb_build_object('streak', 100),
      500
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN new_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_student_streak(UUID) TO authenticated;

-- Function: get_student_rank
-- Description: Gets student's rank on leaderboard
CREATE OR REPLACE FUNCTION public.get_student_rank(
  student_uuid UUID,
  leaderboard_type_param TEXT DEFAULT 'weekly_xp'
)
RETURNS INTEGER AS $$
DECLARE
  student_rank INTEGER;
BEGIN
  WITH ranked_students AS (
    SELECT 
      student_id,
      RANK() OVER (ORDER BY score DESC) as rank
    FROM public.leaderboard_entries
    WHERE leaderboard_type = leaderboard_type_param
      AND period_start >= CURRENT_DATE - INTERVAL '7 days'
  )
  SELECT rank INTO student_rank
  FROM ranked_students
  WHERE student_id = student_uuid;
  
  RETURN COALESCE(student_rank, 9999);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_student_rank(UUID, TEXT) TO authenticated;

COMMENT ON FUNCTION public.add_student_xp IS 'Adds XP to student and handles level-ups automatically';
COMMENT ON FUNCTION public.update_student_streak IS 'Updates student daily activity streak and awards milestone badges';
COMMENT ON FUNCTION public.get_student_rank IS 'Gets student rank on specified leaderboard';

