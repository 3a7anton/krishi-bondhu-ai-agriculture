-- Test Farmer Dashboard Data Query
-- Run this to verify that the farmer dashboard should work properly

-- Test 1: Check user authentication and profile linking
SELECT 
    'User Authentication Check' as test_name,
    u.email,
    u.id as user_id,
    p.id as profile_id,
    p.role,
    p.verification_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email LIKE 'farmer%@example.com'
ORDER BY u.email;

-- Test 2: Check farmer profile linking
SELECT 
    'Farmer Profile Check' as test_name,
    u.email,
    p.role,
    fp.id as farmer_profile_id,
    fp.full_name,
    fp.farm_location,
    fp.farming_experience_years
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
JOIN farmer_profiles fp ON p.id = fp.profile_id
WHERE u.email LIKE 'farmer%@example.com'
ORDER BY u.email;

-- Test 3: Check products for farmers
SELECT 
    'Products Check' as test_name,
    u.email,
    fp.full_name as farmer_name,
    COUNT(pr.id) as product_count,
    STRING_AGG(pr.name, ', ') as product_names
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
JOIN farmer_profiles fp ON p.id = fp.profile_id
LEFT JOIN products pr ON fp.id = pr.farmer_id
WHERE u.email LIKE 'farmer%@example.com'
GROUP BY u.email, fp.full_name
ORDER BY u.email;

-- Test 4: Check product details
SELECT 
    'Product Details' as test_name,
    u.email,
    pr.name as product_name,
    pr.category,
    pr.price,
    pr.unit,
    pr.available_quantity,
    pr.is_active,
    pr.organic,
    pr.featured
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
JOIN farmer_profiles fp ON p.id = fp.profile_id
JOIN products pr ON fp.id = pr.farmer_id
WHERE u.email LIKE 'farmer%@example.com'
ORDER BY u.email, pr.name;

-- Test 5: Debug query to understand exact structure
SELECT 
    'Database Structure Debug' as test_name,
    'farmer_profiles' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'farmer_profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 6: Check if all required tables exist
SELECT 
    'Table Existence Check' as test_name,
    table_name,
    CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'farmer_profiles', 'products', 'orders', 'order_items')
ORDER BY table_name;
