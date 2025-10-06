-- =====================================================
-- ADMIN DASHBOARD RPCs (SECURITY DEFINER)
-- =====================================================

-- Returns platform stats for admin overview
CREATE OR REPLACE FUNCTION public.admin_get_platform_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_students int;
  v_parents int;
  v_courses int;
  v_lessons int;
  v_badges int;
  v_completed int;
BEGIN
  PERFORM public.admin_assert_is_admin();

  SELECT count(*) INTO v_students FROM public.students;
  SELECT count(*) INTO v_parents FROM public.parents;
  -- If there is a 'courses' table use it, else set zero
  BEGIN
    EXECUTE 'SELECT count(*) FROM public.courses' INTO v_courses;
  EXCEPTION WHEN undefined_table THEN
    v_courses := 0;
  END;

  SELECT count(*) INTO v_lessons FROM public.lessons;
  SELECT count(*) INTO v_badges FROM public.badges;
  SELECT count(*) INTO v_completed FROM public.lesson_progress WHERE status = 'completed';

  RETURN jsonb_build_object(
    'students', v_students,
    'parents', v_parents,
    'courses', v_courses,
    'lessons', v_lessons,
    'badges', v_badges,
    'completedLessons', v_completed
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_platform_stats() TO authenticated;

-- List parents for admin
CREATE OR REPLACE FUNCTION public.admin_list_parents(p_limit integer DEFAULT 50)
RETURNS SETOF public.parents
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_assert_is_admin();
  RETURN QUERY
    SELECT * FROM public.parents ORDER BY created_at DESC LIMIT COALESCE(p_limit, 50);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_parents(integer) TO authenticated;

-- Delete parent (cascades to students via FK)
CREATE OR REPLACE FUNCTION public.admin_delete_parent(p_parent_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_assert_is_admin();
  DELETE FROM public.parents WHERE id = p_parent_id;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_parent(uuid) TO authenticated;


