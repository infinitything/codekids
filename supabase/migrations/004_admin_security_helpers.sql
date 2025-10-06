-- =====================================================
-- SECURE ADMIN CHECK FUNCTION + POLICY FIXES
-- =====================================================

-- Create a SECURITY DEFINER function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(p_uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.auth_id = p_uid
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;

-- Replace policies that referenced admins table directly

-- Parents table admin policy
DROP POLICY IF EXISTS "Admins have full access to all tables" ON public.parents;
CREATE POLICY "Admins manage parents"
  ON public.parents FOR ALL
  USING (public.is_admin(auth.uid()));

-- Students table admin policy
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;
CREATE POLICY "Admins manage students"
  ON public.students FOR ALL
  USING (public.is_admin(auth.uid()));


