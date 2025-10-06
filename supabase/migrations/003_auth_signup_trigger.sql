-- =====================================================
-- AUTH SIGNUP → AUTO-CREATE PARENT PROFILE
-- =====================================================

-- Function: when a new auth user is created, create a parent profile
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create parent row for users marked as parent or missing role
  IF (NEW.raw_user_meta_data ? 'role') IS FALSE
     OR (NEW.raw_user_meta_data->>'role') = 'parent' THEN
    INSERT INTO public.parents (auth_id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (auth_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_created();

-- Ensure roles can use public schema (defensive - usually already granted)
GRANT USAGE ON SCHEMA public TO anon, authenticated;


