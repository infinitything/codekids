-- =====================================================
-- ADMIN POLICIES FOR CONTENT MANAGEMENT
-- =====================================================

-- Lessons: admins full access
DROP POLICY IF EXISTS "Admins manage lessons" ON public.lessons;
CREATE POLICY "Admins manage lessons"
  ON public.lessons
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Learning tracks: admins full access
DROP POLICY IF EXISTS "Admins manage tracks" ON public.learning_tracks;
CREATE POLICY "Admins manage tracks"
  ON public.learning_tracks
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Badges: admins full access
DROP POLICY IF EXISTS "Admins manage badges" ON public.badges;
CREATE POLICY "Admins manage badges"
  ON public.badges
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


