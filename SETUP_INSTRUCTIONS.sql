-- =====================================================
-- CODEKID SUPABASE SETUP INSTRUCTIONS
-- =====================================================
-- Run this in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste this entire file > Run
-- =====================================================

-- This will execute the full schema migration
\i supabase/migrations/001_initial_schema.sql

-- =====================================================
-- VERIFY INSTALLATION
-- =====================================================

-- Check tables created
SELECT 
  schemaname,
  tablename
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
ORDER BY tablename;

-- Check functions exist
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- =====================================================
-- NEXT STEPS
-- =====================================================
-- 1. Set up your .env file with Supabase credentials
-- 2. Configure OAuth providers (optional)
-- 3. Set up Stripe webhooks (if using payments)
-- 4. Test signup and authentication
-- 5. Deploy to production!
-- =====================================================

