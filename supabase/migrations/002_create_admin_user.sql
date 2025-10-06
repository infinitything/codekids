-- =====================================================
-- CREATE YOUR FIRST ADMIN USER
-- =====================================================
-- Run this AFTER you've signed up at your app
-- =====================================================

-- STEP 1: Sign up at your app /auth page first
-- STEP 2: Find your auth user ID by running:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- STEP 3: Copy the UUID from the result above
-- STEP 4: Replace 'YOUR_AUTH_USER_ID_HERE' below and run this:

-- EXAMPLE (Replace with your actual UUID):
-- INSERT INTO admins (auth_id, email, full_name, permissions)
-- VALUES (
--   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- Replace with your auth user ID
--   'admin@codekid.com',                      -- Your email
--   'Admin Name',                              -- Your name
--   ARRAY['manage_users', 'manage_content', 'view_analytics', 'manage_settings']
-- );

-- FOR DEMO/TESTING ONLY - Creates admin that bypasses auth check:
-- Uncomment below if you want to test in demo mode
-- INSERT INTO admins (auth_id, email, full_name, permissions)
-- VALUES (
--   gen_random_uuid(),
--   'demo@admin.com',
--   'Demo Admin',
--   ARRAY['manage_users', 'manage_content', 'view_analytics']
-- );

-- =====================================================
-- VERIFY YOUR ADMIN WAS CREATED
-- =====================================================
SELECT 
  a.id,
  a.email,
  a.full_name,
  a.permissions,
  a.created_at,
  u.email as auth_email
FROM admins a
LEFT JOIN auth.users u ON a.auth_id = u.id
ORDER BY a.created_at DESC;

-- =====================================================
-- QUICK REFERENCE
-- =====================================================
-- Admin Dashboard URL: http://localhost:5173/admin
-- Admin Login URL: http://localhost:5173/admin/login
-- =====================================================

