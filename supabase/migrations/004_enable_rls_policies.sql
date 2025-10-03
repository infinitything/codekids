-- =====================================================
-- CODEKID RLS POLICIES SETUP
-- Enable Row Level Security on all tables
-- =====================================================

-- Enable RLS on lessons table (currently disabled)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "lessons_read_policy" ON public.lessons;
DROP POLICY IF EXISTS "lessons_admin_full" ON public.lessons;

-- Lessons: Everyone can read, only admins can write
CREATE POLICY "lessons_read_policy" ON public.lessons
  FOR SELECT
  USING (true);  -- Everyone can read lessons

CREATE POLICY "lessons_admin_full" ON public.lessons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Learning tracks: Everyone can read, only admins can write  
CREATE POLICY "tracks_admin_full" ON public.learning_tracks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Lesson progress: Students can read/write their own progress
DROP POLICY IF EXISTS "progress_student_own" ON public.lesson_progress;
CREATE POLICY "progress_student_own" ON public.lesson_progress
  FOR ALL
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE students.user_id = auth.uid()
    )
  );

-- Parents can read their students' progress
DROP POLICY IF EXISTS "progress_parent_view" ON public.lesson_progress;
CREATE POLICY "progress_parent_view" ON public.lesson_progress
  FOR SELECT
  USING (
    student_id IN (
      SELECT s.id FROM public.students s
      WHERE s.parent_id IN (
        SELECT p.id FROM public.parents p
        WHERE p.user_id = auth.uid()
      )
    )
  );

-- Student badges: Students can read their own badges
DROP POLICY IF EXISTS "student_badges_own" ON public.student_badges;
CREATE POLICY "student_badges_own" ON public.student_badges
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE students.user_id = auth.uid()
    )
  );

-- Parents can read their students' badges
DROP POLICY IF EXISTS "student_badges_parent_view" ON public.student_badges;
CREATE POLICY "student_badges_parent_view" ON public.student_badges
  FOR SELECT
  USING (
    student_id IN (
      SELECT s.id FROM public.students s
      WHERE s.parent_id IN (
        SELECT p.id FROM public.parents p
        WHERE p.user_id = auth.uid()
      )
    )
  );

-- System can award badges
DROP POLICY IF EXISTS "student_badges_system_award" ON public.student_badges;
CREATE POLICY "student_badges_system_award" ON public.student_badges
  FOR INSERT
  WITH CHECK (true);  -- Allow system to award badges

-- AI conversations: Students can manage their own conversations
DROP POLICY IF EXISTS "ai_conversations_student_own" ON public.ai_conversations;
CREATE POLICY "ai_conversations_student_own" ON public.ai_conversations
  FOR ALL
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE students.user_id = auth.uid()
    )
  );

-- Projects: Students can manage their own projects
DROP POLICY IF EXISTS "projects_student_own" ON public.projects;
CREATE POLICY "projects_student_own" ON public.projects
  FOR ALL
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE students.user_id = auth.uid()
    )
  );

-- Parents can view their students' projects
DROP POLICY IF EXISTS "projects_parent_view" ON public.projects;
CREATE POLICY "projects_parent_view" ON public.projects
  FOR SELECT
  USING (
    student_id IN (
      SELECT s.id FROM public.students s
      WHERE s.parent_id IN (
        SELECT p.id FROM public.parents p
        WHERE p.user_id = auth.uid()
      )
    )
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies enabled on all critical tables!';
END $$;

