-- =====================================================
-- CODEKID FIX: Parents & Students RLS Policies
-- Allows signup to create parent and student profiles
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "parents_insert_own" ON public.parents;
DROP POLICY IF EXISTS "parents_select_own" ON public.parents;
DROP POLICY IF EXISTS "parents_update_own" ON public.parents;
DROP POLICY IF EXISTS "students_insert_by_parent" ON public.students;
DROP POLICY IF EXISTS "students_select_own" ON public.students;
DROP POLICY IF EXISTS "students_update_own" ON public.students;
DROP POLICY IF EXISTS "students_select_by_parent" ON public.students;

-- PARENTS TABLE: Allow users to create and manage their own parent profile
CREATE POLICY "parents_insert_own" ON public.parents
  FOR INSERT
  WITH CHECK (auth_id = auth.uid());  -- Users can create their own parent record

CREATE POLICY "parents_select_own" ON public.parents
  FOR SELECT
  USING (auth_id = auth.uid());  -- Parents can read their own data

CREATE POLICY "parents_update_own" ON public.parents
  FOR UPDATE
  USING (auth_id = auth.uid())  -- Parents can update their own data
  WITH CHECK (auth_id = auth.uid());

-- STUDENTS TABLE: Allow parents to create and manage their students
CREATE POLICY "students_insert_by_parent" ON public.students
  FOR INSERT
  WITH CHECK (
    parent_id IN (
      SELECT id FROM public.parents
      WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "students_select_own" ON public.students
  FOR SELECT
  USING (
    user_id = auth.uid()  -- Students can read their own data
  );

CREATE POLICY "students_select_by_parent" ON public.students
  FOR SELECT
  USING (
    parent_id IN (
      SELECT id FROM public.parents
      WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "students_update_own" ON public.students
  FOR UPDATE
  USING (
    user_id = auth.uid() OR  -- Students can update their own data
    parent_id IN (
      SELECT id FROM public.parents
      WHERE auth_id = auth.uid()
    )  -- Parents can update their students' data
  )
  WITH CHECK (
    user_id = auth.uid() OR
    parent_id IN (
      SELECT id FROM public.parents
      WHERE auth_id = auth.uid()
    )
  );

-- Admins can do everything
DROP POLICY IF EXISTS "parents_admin_full" ON public.parents;
CREATE POLICY "parents_admin_full" ON public.parents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "students_admin_full" ON public.students;
CREATE POLICY "students_admin_full" ON public.students
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Parents & Students RLS policies fixed! Signup should work now!';
END $$;

