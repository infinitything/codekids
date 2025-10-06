-- =====================================================
-- STORAGE BUCKETS + PUBLIC READ POLICIES
-- =====================================================

-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('course-videos', 'course-videos', true),
  ('course-documents', 'course-documents', true),
  ('course-images', 'course-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policies (CREATE POLICY doesn't support IF NOT EXISTS, so drop first)
DROP POLICY IF EXISTS "Public read course videos" ON storage.objects;
CREATE POLICY "Public read course videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-videos');

DROP POLICY IF EXISTS "Public read course documents" ON storage.objects;
CREATE POLICY "Public read course documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-documents');

DROP POLICY IF EXISTS "Public read course images" ON storage.objects;
CREATE POLICY "Public read course images" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-images');

-- Admin manage policies
DROP POLICY IF EXISTS "Admins manage course videos" ON storage.objects;
CREATE POLICY "Admins manage course videos" ON storage.objects
  FOR ALL USING (bucket_id = 'course-videos' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'course-videos' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage course documents" ON storage.objects;
CREATE POLICY "Admins manage course documents" ON storage.objects
  FOR ALL USING (bucket_id = 'course-documents' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'course-documents' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage course images" ON storage.objects;
CREATE POLICY "Admins manage course images" ON storage.objects
  FOR ALL USING (bucket_id = 'course-images' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'course-images' AND public.is_admin(auth.uid()));


