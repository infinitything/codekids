-- =====================================================
-- CREATE ADMIN USER
-- =====================================================
-- Run this in Supabase SQL Editor to create an admin account
-- Replace the email and user_id with your actual admin account
-- =====================================================

-- STEP 1: First sign up a regular account at /auth
-- STEP 2: Check the auth.users table for your user ID
-- STEP 3: Run this query with your user ID

-- Example: Replace 'YOUR_AUTH_USER_ID_HERE' with actual UUID from auth.users
INSERT INTO admins (auth_id, email, full_name, permissions)
VALUES (
  'YOUR_AUTH_USER_ID_HERE',  -- Replace with UUID from auth.users table
  'admin@codekid.com',        -- Your admin email
  'Admin User',               -- Admin name
  ARRAY['manage_users', 'manage_content', 'view_analytics', 'manage_settings']
);

-- =====================================================
-- HOW TO GET YOUR AUTH USER ID:
-- =====================================================
-- 1. Sign up at your app /auth page
-- 2. Run this query to see all auth users:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- 3. Copy the 'id' (UUID) of your account
-- 4. Use it in the INSERT query above
-- =====================================================

-- VERIFY ADMIN WAS CREATED:
SELECT a.*, u.email 
FROM admins a 
JOIN auth.users u ON a.auth_id = u.id;

-- =====================================================
-- QUICK DEMO ADMIN (FOR TESTING ONLY)
-- =====================================================
-- This creates a demo admin that works in demo mode
-- DO NOT USE IN PRODUCTION
-- INSERT INTO admins (auth_id, email, full_name, permissions)
-- VALUES (
--   gen_random_uuid(),
--   'demo@admin.com',
--   'Demo Admin',
--   ARRAY['manage_users', 'manage_content', 'view_analytics']
-- );

