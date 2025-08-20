-- Alternative User Creation Script for Supabase
-- Use this if the automated user creation is failing with 400 errors

-- Step 1: Create users manually in Supabase Dashboard
-- Go to: Authentication → Users → Invite User
-- Or use this SQL in Supabase SQL Editor with RLS disabled temporarily

-- WARNING: Only run this in development/testing environments
-- This bypasses normal authentication flows

-- First, disable RLS temporarily (only in development)
-- ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Manual user insertion (use only if auth.signUp is failing)
-- Note: This should be done through Supabase Dashboard instead

/*
Manual User Creation Steps:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Invite user" or "Create user"
3. Enter email and password for each user:

USERS TO CREATE:
- farmer@example.com (password: admin1234)
- farmer2@example.com (password: admin1234)
- farmer3@example.com (password: admin1234)
- farmer4@example.com (password: admin1234)
- customer@example.com (password: admin1234)
- customer2@example.com (password: admin1234)
- delivery@example.com (password: admin1234)
- warehouse@example.com (password: admin1234)
- admin@example.com (password: admin1234)

4. After creating each user, note their UUID from the users table
5. Run the profile creation SQL below
*/

-- Step 2: Create profiles for the manually created users
-- Replace the UUIDs with actual user IDs from auth.users table

-- Function to get user ID by email and create profile
CREATE OR REPLACE FUNCTION create_user_profile(user_email TEXT, user_role TEXT)
RETURNS void AS $$
DECLARE
  user_uuid UUID;
  mapped_role TEXT;
BEGIN
  -- Get user UUID
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RAISE NOTICE 'User not found: %', user_email;
    RETURN;
  END IF;
  
  -- Map roles
  mapped_role := CASE 
    WHEN user_role = 'farmer' THEN 'farmer'
    WHEN user_role = 'customer' THEN 'customer'
    WHEN user_role = 'delivery' THEN 'delivery_partner'
    WHEN user_role = 'warehouse' THEN 'warehouse'
    WHEN user_role = 'admin' THEN 'customer'
    ELSE 'customer'
  END;
  
  -- Insert or update profile
  INSERT INTO public.profiles (user_id, role, phone, verification_status)
  VALUES (user_uuid, mapped_role::user_role, '', 'verified'::verification_status)
  ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    verification_status = EXCLUDED.verification_status,
    updated_at = NOW();
    
  RAISE NOTICE 'Profile created for %: % (role: %)', user_email, user_uuid, mapped_role;
END;
$$ LANGUAGE plpgsql;

-- Create profiles for all standard users
-- Run these after manually creating the users in Supabase Dashboard

SELECT create_user_profile('farmer@example.com', 'farmer');
SELECT create_user_profile('farmer2@example.com', 'farmer');
SELECT create_user_profile('farmer3@example.com', 'farmer');
SELECT create_user_profile('farmer4@example.com', 'farmer');
SELECT create_user_profile('customer@example.com', 'customer');
SELECT create_user_profile('customer2@example.com', 'customer');
SELECT create_user_profile('delivery@example.com', 'delivery');
SELECT create_user_profile('warehouse@example.com', 'warehouse');
SELECT create_user_profile('admin@example.com', 'admin');

-- Verification query
SELECT 
  u.email,
  u.id as user_id,
  p.role,
  p.verification_status,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email LIKE '%@example.com'
ORDER BY u.email;

-- Alternative: Bulk profile creation if you have the user IDs
/*
INSERT INTO public.profiles (user_id, role, phone, verification_status)
VALUES 
  ('USER_ID_1', 'farmer', '', 'verified'),
  ('USER_ID_2', 'farmer', '', 'verified'),
  ('USER_ID_3', 'farmer', '', 'verified'),
  ('USER_ID_4', 'farmer', '', 'verified'),
  ('USER_ID_5', 'customer', '', 'verified'),
  ('USER_ID_6', 'customer', '', 'verified'),
  ('USER_ID_7', 'delivery_partner', '', 'verified'),
  ('USER_ID_8', 'warehouse', '', 'verified'),
  ('USER_ID_9', 'customer', '', 'verified') -- admin using customer role
ON CONFLICT (user_id) DO NOTHING;
*/

-- Clean up function
DROP FUNCTION IF EXISTS create_user_profile(TEXT, TEXT);

-- Re-enable RLS if it was disabled
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
