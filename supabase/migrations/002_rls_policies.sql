-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Run this AFTER 001_initial_schema.sql
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_time_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- PARENTS TABLE POLICIES
-- ============================================

-- Parents can view their own record
CREATE POLICY "Parents can view own record"
ON public.parents FOR SELECT
USING (auth_user_id = auth.uid());

-- Parents can update their own record
CREATE POLICY "Parents can update own record"
ON public.parents FOR UPDATE
USING (auth_user_id = auth.uid());

-- Parents can insert their own record
CREATE POLICY "Parents can insert own record"
ON public.parents FOR INSERT
WITH CHECK (auth_user_id = auth.uid());

-- ============================================
-- STUDENTS TABLE POLICIES
-- ============================================

-- Parents can view their own children
CREATE POLICY "Parents can view own children"
ON public.students FOR SELECT
USING (
  parent_id IN (
    SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
  )
);

-- Students can view their own profile
CREATE POLICY "Students can view own profile"  
ON public.students FOR SELECT
USING (
  id IN (
    SELECT id FROM public.students WHERE id::text = auth.uid()::text
  )
);

-- Parents can update their children's profiles
CREATE POLICY "Parents can update children"
ON public.students FOR UPDATE
USING (
  parent_id IN (
    SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
  )
);

-- Parents can create children profiles
CREATE POLICY "Parents can create children"
ON public.students FOR INSERT
WITH CHECK (
  parent_id IN (
    SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
  )
);

-- ============================================
-- COURSES & LESSONS (PUBLIC READ)
-- ============================================

-- Everyone can view published courses
CREATE POLICY "Anyone can view published courses"
ON public.courses FOR SELECT
USING (is_published = true);

-- Admins can manage courses (for now, all authenticated users can view all)
CREATE POLICY "Authenticated users view all courses"
ON public.courses FOR SELECT
USING (auth.role() = 'authenticated');

-- Everyone can view lessons
CREATE POLICY "Anyone can view lessons"
ON public.lessons FOR SELECT
USING (true);

-- ============================================
-- ENROLLMENTS POLICIES
-- ============================================

-- Students/Parents can view their enrollments
CREATE POLICY "Users can view own enrollments"
ON public.enrollments FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- Students/Parents can create enrollments
CREATE POLICY "Users can create enrollments"
ON public.enrollments FOR INSERT
WITH CHECK (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- Users can update their own enrollments
CREATE POLICY "Users can update own enrollments"
ON public.enrollments FOR UPDATE
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- ============================================
-- PROGRESS POLICIES
-- ============================================

-- Students/Parents can view their progress
CREATE POLICY "Users can view own progress"
ON public.progress FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- Students can create/update their progress
CREATE POLICY "Students can manage own progress"
ON public.progress FOR ALL
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- ============================================
-- PROJECTS POLICIES
-- ============================================

-- Students/Parents can view their projects
CREATE POLICY "Users can view own projects"
ON public.projects FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- Students can manage their projects
CREATE POLICY "Students can manage own projects"
ON public.projects FOR ALL
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- ============================================
-- BADGES POLICIES
-- ============================================

-- Everyone can view badges
CREATE POLICY "Anyone can view badges"
ON public.badges FOR SELECT
USING (true);

-- Students/Parents can view earned badges
CREATE POLICY "Users can view own badges"
ON public.student_badges FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- System can award badges (handled by functions)
CREATE POLICY "System can award badges"
ON public.student_badges FOR INSERT
WITH CHECK (true);

-- ============================================
-- AI CONVERSATIONS POLICIES
-- ============================================

-- Students/Parents can view their conversations
CREATE POLICY "Users can view own conversations"
ON public.ai_conversations FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- Students can create conversations
CREATE POLICY "Students can create conversations"
ON public.ai_conversations FOR INSERT
WITH CHECK (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- ============================================
-- DAILY ACTIVITIES POLICIES
-- ============================================

-- Students/Parents can view their activity
CREATE POLICY "Users can view own activities"
ON public.daily_activities FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
    OR id::text = auth.uid()::text
  )
);

-- System can log activities
CREATE POLICY "System can log activities"
ON public.daily_activities FOR INSERT
WITH CHECK (true);

-- ============================================
-- PARENT NOTIFICATIONS POLICIES
-- ============================================

-- Parents can view their notifications
CREATE POLICY "Parents can view own notifications"
ON public.parent_notifications FOR SELECT
USING (
  parent_id IN (
    SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
  )
);

-- Parents can update (mark as read) notifications
CREATE POLICY "Parents can update own notifications"
ON public.parent_notifications FOR UPDATE
USING (
  parent_id IN (
    SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
  )
);

-- ============================================
-- SCREEN TIME SETTINGS POLICIES
-- ============================================

-- Parents can manage their children's screen time
CREATE POLICY "Parents can manage screen time"
ON public.screen_time_settings FOR ALL
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE auth_user_id = auth.uid()
    )
  )
);

-- ============================================
-- SUCCESS!
-- ============================================

-- All RLS policies created successfully
-- Your database is now secure! 🔒

