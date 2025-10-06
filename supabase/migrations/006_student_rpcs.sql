-- =====================================================
-- RPCs for safe student operations under RLS
-- =====================================================

-- Check if a username is available (global)
CREATE OR REPLACE FUNCTION public.is_username_available(p_username text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.students s WHERE s.username = p_username
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO anon, authenticated;

-- Create student for the current parent
CREATE OR REPLACE FUNCTION public.create_student_for_current_parent(
  p_username text,
  p_display_name text,
  p_age integer,
  p_date_of_birth date,
  p_interests text[],
  p_preferred_learning_style text,
  p_coppa_consent boolean
)
RETURNS public.students
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent_id uuid;
  v_age_group age_group;
  v_student public.students;
BEGIN
  SELECT id INTO v_parent_id FROM public.parents WHERE auth_id = auth.uid();
  IF v_parent_id IS NULL THEN
    RAISE EXCEPTION 'parent_not_found';
  END IF;

  IF p_age <= 8 THEN
    v_age_group := '5-8';
  ELSIF p_age <= 12 THEN
    v_age_group := '8-12';
  ELSE
    v_age_group := '12-16';
  END IF;

  INSERT INTO public.students (
    parent_id,
    username,
    display_name,
    age,
    age_group,
    date_of_birth,
    interests,
    preferred_learning_style,
    coppa_consent,
    active
  ) VALUES (
    v_parent_id,
    p_username,
    p_display_name,
    p_age,
    v_age_group,
    p_date_of_birth,
    p_interests,
    p_preferred_learning_style,
    p_coppa_consent,
    true
  ) RETURNING * INTO v_student;

  RETURN v_student;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_student_for_current_parent(text, text, integer, date, text[], text, boolean) TO authenticated;


