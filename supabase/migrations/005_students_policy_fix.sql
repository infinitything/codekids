-- =====================================================
-- FIX STUDENT POLICIES TO AVOID SELECT ON PARENTS IN POLICY CONTEXT
-- =====================================================

-- Helper: check if given parent_id belongs to current auth user
CREATE OR REPLACE FUNCTION public.parent_belongs_to_current_user(p_parent_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.parents p
    WHERE p.id = p_parent_id
      AND p.auth_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.parent_belongs_to_current_user(uuid) TO anon, authenticated;

-- Replace student policies to use the helper
DROP POLICY IF EXISTS "Parents can view their own students" ON public.students;
DROP POLICY IF EXISTS "Parents can insert their own students" ON public.students;
DROP POLICY IF EXISTS "Parents can update their own students" ON public.students;

CREATE POLICY "Parents select students"
  ON public.students FOR SELECT
  USING (public.parent_belongs_to_current_user(parent_id));

CREATE POLICY "Parents insert students"
  ON public.students FOR INSERT
  WITH CHECK (public.parent_belongs_to_current_user(parent_id));

CREATE POLICY "Parents update students"
  ON public.students FOR UPDATE
  USING (public.parent_belongs_to_current_user(parent_id));


