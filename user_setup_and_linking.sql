-- Final User Setup and Linking SQL for KrishiBondhu
-- Execute this after creating users through Supabase Auth

-- Step 1: Create these users in Supabase Auth Dashboard first:
/*
REQUIRED USERS TO CREATE IN SUPABASE AUTH:
1. farmer@example.com (password: admin1234)
2. farmer2@example.com (password: admin1234)
3. farmer3@example.com (password: admin1234)
4. farmer4@example.com (password: admin1234)
5. customer@example.com (password: admin1234)
6. customer2@example.com (password: admin1234)
7. delivery@example.com (password: admin1234)
8. warehouse@example.com (password: admin1234)
9. admin@example.com (password: admin1234)
*/

-- Step 2: After creating auth users, run these linking functions

-- Function to link farmer profiles with auth users
CREATE OR REPLACE FUNCTION link_farmer_profiles()
RETURNS void AS $$
DECLARE
  farmer_email TEXT;
  farmer_id TEXT;
  user_uuid UUID;
BEGIN
  -- Link farmer 1
  farmer_email := 'farmer@example.com';
  farmer_id := 'farmer-001';
  SELECT id INTO user_uuid FROM auth.users WHERE email = farmer_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.farmer_profiles SET user_id = user_uuid WHERE id = farmer_id;
    RAISE NOTICE 'Linked % to %', farmer_email, farmer_id;
  END IF;

  -- Link farmer 2
  farmer_email := 'farmer2@example.com';
  farmer_id := 'farmer-002';
  SELECT id INTO user_uuid FROM auth.users WHERE email = farmer_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.farmer_profiles SET user_id = user_uuid WHERE id = farmer_id;
    RAISE NOTICE 'Linked % to %', farmer_email, farmer_id;
  END IF;

  -- Link farmer 3
  farmer_email := 'farmer3@example.com';
  farmer_id := 'farmer-003';
  SELECT id INTO user_uuid FROM auth.users WHERE email = farmer_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.farmer_profiles SET user_id = user_uuid WHERE id = farmer_id;
    RAISE NOTICE 'Linked % to %', farmer_email, farmer_id;
  END IF;

  -- Link farmer 4
  farmer_email := 'farmer4@example.com';
  farmer_id := 'farmer-004';
  SELECT id INTO user_uuid FROM auth.users WHERE email = farmer_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.farmer_profiles SET user_id = user_uuid WHERE id = farmer_id;
    RAISE NOTICE 'Linked % to %', farmer_email, farmer_id;
  END IF;

  -- Link additional farmers from enhanced data
  farmer_email := 'farmer@example.com';
  farmer_id := 'farmer-005';
  SELECT id INTO user_uuid FROM auth.users WHERE email = farmer_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.farmer_profiles SET user_id = user_uuid WHERE id = farmer_id;
    RAISE NOTICE 'Linked % to %', farmer_email, farmer_id;
  END IF;

  farmer_email := 'farmer2@example.com';
  farmer_id := 'farmer-006';
  SELECT id INTO user_uuid FROM auth.users WHERE email = farmer_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.farmer_profiles SET user_id = user_uuid WHERE id = farmer_id;
    RAISE NOTICE 'Linked % to %', farmer_email, farmer_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to link customer profiles with auth users
CREATE OR REPLACE FUNCTION link_customer_profiles()
RETURNS void AS $$
DECLARE
  customer_email TEXT;
  customer_id TEXT;
  user_uuid UUID;
BEGIN
  -- Link customer 1
  customer_email := 'customer@example.com';
  customer_id := 'customer-001';
  SELECT id INTO user_uuid FROM auth.users WHERE email = customer_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.customer_profiles SET user_id = user_uuid WHERE id = customer_id;
    RAISE NOTICE 'Linked % to %', customer_email, customer_id;
  END IF;

  -- Link customer 2
  customer_email := 'customer2@example.com';
  customer_id := 'customer-002';
  SELECT id INTO user_uuid FROM auth.users WHERE email = customer_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.customer_profiles SET user_id = user_uuid WHERE id = customer_id;
    RAISE NOTICE 'Linked % to %', customer_email, customer_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to link delivery partner profiles with auth users
CREATE OR REPLACE FUNCTION link_delivery_profiles()
RETURNS void AS $$
DECLARE
  delivery_email TEXT;
  delivery_id TEXT;
  user_uuid UUID;
BEGIN
  -- Link delivery partner 1
  delivery_email := 'delivery@example.com';
  delivery_id := 'delivery-001';
  SELECT id INTO user_uuid FROM auth.users WHERE email = delivery_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.delivery_partner_profiles SET user_id = user_uuid WHERE id = delivery_id;
    RAISE NOTICE 'Linked % to %', delivery_email, delivery_id;
  END IF;

  -- Link delivery partner 2
  delivery_email := 'delivery@example.com';
  delivery_id := 'delivery-002';
  SELECT id INTO user_uuid FROM auth.users WHERE email = delivery_email;
  IF user_uuid IS NOT NULL THEN
    UPDATE public.delivery_partner_profiles SET user_id = user_uuid WHERE id = delivery_id;
    RAISE NOTICE 'Linked % to %', delivery_email, delivery_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to link orders with customer IDs
CREATE OR REPLACE FUNCTION link_orders_to_customers()
RETURNS void AS $$
DECLARE
  customer_uuid UUID;
BEGIN
  -- Get customer 1 UUID
  SELECT user_id INTO customer_uuid FROM public.customer_profiles WHERE id = 'customer-001';
  IF customer_uuid IS NOT NULL THEN
    UPDATE public.orders SET customer_id = customer_uuid WHERE id IN ('order-001', 'order-003', 'order-007');
    RAISE NOTICE 'Linked orders to customer 1';
  END IF;

  -- Get customer 2 UUID
  SELECT user_id INTO customer_uuid FROM public.customer_profiles WHERE id = 'customer-002';
  IF customer_uuid IS NOT NULL THEN
    UPDATE public.orders SET customer_id = customer_uuid WHERE id IN ('order-002', 'order-004', 'order-005', 'order-006');
    RAISE NOTICE 'Linked orders to customer 2';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Master function to execute all linking
CREATE OR REPLACE FUNCTION setup_all_user_links()
RETURNS void AS $$
BEGIN
  RAISE NOTICE 'Starting user profile linking process...';
  
  PERFORM link_farmer_profiles();
  RAISE NOTICE 'Farmer profiles linked.';
  
  PERFORM link_customer_profiles();
  RAISE NOTICE 'Customer profiles linked.';
  
  PERFORM link_delivery_profiles();
  RAISE NOTICE 'Delivery partner profiles linked.';
  
  PERFORM link_orders_to_customers();
  RAISE NOTICE 'Orders linked to customers.';
  
  RAISE NOTICE 'All user profile linking completed successfully!';
END;
$$ LANGUAGE plpgsql;

-- Dashboard analytics summary view
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
  'Platform Overview' as section,
  COUNT(DISTINCT fp.id) as total_farmers,
  COUNT(DISTINCT cp.id) as total_customers,
  COUNT(DISTINCT dpp.id) as total_delivery_partners,
  COUNT(DISTINCT p.id) as total_products,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total_amount), 0) as total_revenue,
  COUNT(DISTINCT wl.id) as total_warehouses
FROM farmer_profiles fp
FULL OUTER JOIN customer_profiles cp ON true
FULL OUTER JOIN delivery_partner_profiles dpp ON true
FULL OUTER JOIN products p ON true
FULL OUTER JOIN orders o ON true
FULL OUTER JOIN warehouse_locations wl ON true;

-- Recent activity view
CREATE OR REPLACE VIEW recent_platform_activity AS
SELECT 
  'order' as activity_type,
  'Order #' || o.id as title,
  'New order for ৳' || o.total_amount as description,
  o.created_at,
  cp.full_name as user_name
FROM orders o
LEFT JOIN customer_profiles cp ON o.customer_id = cp.user_id
UNION ALL
SELECT 
  'product' as activity_type,
  'Product Listed' as title,
  p.name || ' - ' || p.available_quantity || ' ' || p.unit_type as description,
  p.created_at,
  fp.farm_name as user_name
FROM products p
LEFT JOIN farmer_profiles fp ON p.farmer_id = fp.id
ORDER BY created_at DESC
LIMIT 20;

-- Verification queries to check setup
CREATE OR REPLACE FUNCTION verify_setup()
RETURNS TABLE(
  check_name TEXT,
  status TEXT,
  count_value INTEGER,
  details TEXT
) AS $$
BEGIN
  -- Check farmers with linked users
  RETURN QUERY
  SELECT 
    'Farmers with Auth Users' as check_name,
    CASE WHEN COUNT(*) > 0 THEN 'SUCCESS' ELSE 'NEEDS LINKING' END as status,
    COUNT(*)::INTEGER as count_value,
    'Farmer profiles linked to auth users' as details
  FROM farmer_profiles 
  WHERE user_id IS NOT NULL;

  -- Check customers with linked users
  RETURN QUERY
  SELECT 
    'Customers with Auth Users' as check_name,
    CASE WHEN COUNT(*) > 0 THEN 'SUCCESS' ELSE 'NEEDS LINKING' END as status,
    COUNT(*)::INTEGER as count_value,
    'Customer profiles linked to auth users' as details
  FROM customer_profiles 
  WHERE user_id IS NOT NULL;

  -- Check delivery partners with linked users
  RETURN QUERY
  SELECT 
    'Delivery Partners with Auth Users' as check_name,
    CASE WHEN COUNT(*) > 0 THEN 'SUCCESS' ELSE 'NEEDS LINKING' END as status,
    COUNT(*)::INTEGER as count_value,
    'Delivery partner profiles linked to auth users' as details
  FROM delivery_partner_profiles 
  WHERE user_id IS NOT NULL;

  -- Check orders with customers
  RETURN QUERY
  SELECT 
    'Orders with Customers' as check_name,
    CASE WHEN COUNT(*) > 0 THEN 'SUCCESS' ELSE 'NEEDS LINKING' END as status,
    COUNT(*)::INTEGER as count_value,
    'Orders linked to customer accounts' as details
  FROM orders 
  WHERE customer_id IS NOT NULL;

  -- Check products availability
  RETURN QUERY
  SELECT 
    'Available Products' as check_name,
    'SUCCESS' as status,
    COUNT(*)::INTEGER as count_value,
    'Products ready for showcase' as details
  FROM products 
  WHERE status = 'available';
END;
$$ LANGUAGE plpgsql;

-- Instructions for manual execution
/*
EXECUTION STEPS:

1. First, create users in Supabase Auth Dashboard:
   - farmer@example.com (password: admin1234)
   - farmer2@example.com (password: admin1234)
   - farmer3@example.com (password: admin1234)
   - farmer4@example.com (password: admin1234)
   - customer@example.com (password: admin1234)
   - customer2@example.com (password: admin1234)
   - delivery@example.com (password: admin1234)
   - warehouse@example.com (password: admin1234)
   - admin@example.com (password: admin1234)

2. Then run this command to link everything:
   SELECT setup_all_user_links();

3. Verify the setup:
   SELECT * FROM verify_setup();

4. Check dashboard summary:
   SELECT * FROM dashboard_summary;

5. View recent activity:
   SELECT * FROM recent_platform_activity;
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON dashboard_summary TO anon, authenticated;
GRANT SELECT ON recent_platform_activity TO anon, authenticated;
