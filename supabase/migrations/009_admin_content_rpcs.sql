-- =====================================================
-- ADMIN CONTENT RPCs (SECURITY DEFINER)
-- Bypass RLS safely while enforcing admin check
-- =====================================================

-- Helper: assert current user is admin
CREATE OR REPLACE FUNCTION public.admin_assert_is_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden_not_admin' USING ERRCODE = '42501';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_assert_is_admin() TO authenticated;

-- List learning tracks for admin
CREATE OR REPLACE FUNCTION public.admin_list_learning_tracks()
RETURNS SETOF public.learning_tracks
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_assert_is_admin();
  RETURN QUERY
    SELECT * FROM public.learning_tracks ORDER BY sequence_order NULLS LAST, created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_learning_tracks() TO authenticated;

-- List lessons for admin
CREATE OR REPLACE FUNCTION public.admin_list_lessons(p_limit integer DEFAULT 50)
RETURNS SETOF public.lessons
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_assert_is_admin();
  RETURN QUERY
    SELECT * FROM public.lessons ORDER BY created_at DESC LIMIT COALESCE(p_limit, 50);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_lessons(integer) TO authenticated;

-- Create lesson (minimal fields)
CREATE OR REPLACE FUNCTION public.admin_create_lesson(
  p_track_id uuid,
  p_title text,
  p_description text,
  p_lesson_type lesson_type,
  p_difficulty difficulty_level,
  p_sequence_order integer,
  p_estimated_minutes integer,
  p_content_blocks jsonb,
  p_video_url text,
  p_xp_reward integer,
  p_active boolean DEFAULT true
)
RETURNS public.lessons
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.lessons;
BEGIN
  PERFORM public.admin_assert_is_admin();

  INSERT INTO public.lessons (
    track_id, title, description, lesson_type, difficulty_level,
    sequence_order, estimated_minutes, content_blocks, video_url,
    xp_reward, active, created_at, updated_at
  ) VALUES (
    p_track_id, p_title, p_description, p_lesson_type, p_difficulty,
    p_sequence_order, p_estimated_minutes, p_content_blocks, p_video_url,
    COALESCE(p_xp_reward, 100), COALESCE(p_active, true), NOW(), NOW()
  ) RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_create_lesson(uuid, text, text, lesson_type, difficulty_level, integer, integer, jsonb, text, integer, boolean) TO authenticated;

-- Update lesson
CREATE OR REPLACE FUNCTION public.admin_update_lesson(
  p_id uuid,
  p_track_id uuid,
  p_title text,
  p_description text,
  p_lesson_type lesson_type,
  p_difficulty difficulty_level,
  p_sequence_order integer,
  p_estimated_minutes integer,
  p_content_blocks jsonb,
  p_video_url text,
  p_xp_reward integer,
  p_active boolean
)
RETURNS public.lessons
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.lessons;
BEGIN
  PERFORM public.admin_assert_is_admin();

  UPDATE public.lessons SET
    track_id = COALESCE(p_track_id, track_id),
    title = COALESCE(p_title, title),
    description = COALESCE(p_description, description),
    lesson_type = COALESCE(p_lesson_type, lesson_type),
    difficulty_level = COALESCE(p_difficulty, difficulty_level),
    sequence_order = COALESCE(p_sequence_order, sequence_order),
    estimated_minutes = COALESCE(p_estimated_minutes, estimated_minutes),
    content_blocks = COALESCE(p_content_blocks, content_blocks),
    video_url = COALESCE(p_video_url, video_url),
    xp_reward = COALESCE(p_xp_reward, xp_reward),
    active = COALESCE(p_active, active),
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_lesson(uuid, uuid, text, text, lesson_type, difficulty_level, integer, integer, jsonb, text, integer, boolean) TO authenticated;

-- Toggle lesson active
CREATE OR REPLACE FUNCTION public.admin_toggle_lesson_active(p_lesson_id uuid, p_active boolean)
RETURNS public.lessons
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.lessons;
BEGIN
  PERFORM public.admin_assert_is_admin();
  UPDATE public.lessons SET active = COALESCE(p_active, NOT active), updated_at = NOW()
  WHERE id = p_lesson_id
  RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_toggle_lesson_active(uuid, boolean) TO authenticated;


