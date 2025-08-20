-- KrishiBondhu Sample Data with Standardized Users
-- Run this after database setup to populate with sample data

-- First, let's insert some profiles for different user types
-- Note: The user IDs should match the auth.users table after user registration

-- Insert farmer profiles (after users are created in auth.users)
INSERT INTO public.farmer_profiles (
  id,
  user_id,
  farm_name,
  location,
  farm_size,
  certifications,
  experience_years,
  specializations,
  rating,
  total_sales,
  created_at,
  updated_at
) VALUES 
(
  'farmer-001',
  NULL, -- This will be filled after user creation
  'Golden Rice Farm',
  'Rangpur, Rangpur Division',
  15.5,
  ARRAY['Organic Certified', 'Fair Trade'],
  12,
  ARRAY['Rice', 'Jute', 'Vegetables'],
  4.8,
  125000,
  NOW(),
  NOW()
),
(
  'farmer-002',
  NULL,
  'Dhaka Valley Organic',
  'Manikganj, Dhaka Division',
  8.2,
  ARRAY['Organic Certified'],
  8,
  ARRAY['Vegetables', 'Fruits'],
  4.6,
  85000,
  NOW(),
  NOW()
),
(
  'farmer-003',
  NULL,
  'Sylhet Tea & Grains',
  'Moulvibazar, Sylhet Division',
  25.0,
  ARRAY['Organic Certified', 'ISO 22000'],
  15,
  ARRAY['Tea', 'Rice', 'Lentils'],
  4.9,
  200000,
  NOW(),
  NOW()
),
(
  'farmer-004',
  NULL,
  'Chittagong Hill Farm',
  'Bandarban, Chittagong Division',
  12.0,
  ARRAY['GAP Certified'],
  10,
  ARRAY['Vegetables', 'Spices'],
  4.4,
  95000,
  NOW(),
  NOW()
);

-- Insert products
INSERT INTO public.products (
  id,
  farmer_id,
  name,
  description,
  category,
  price_per_unit,
  unit_type,
  available_quantity,
  harvest_date,
  expiry_date,
  organic,
  certifications,
  storage_instructions,
  nutritional_info,
  location,
  status,
  created_at,
  updated_at
) VALUES 
(
  'prod-001',
  'farmer-001',
  'Premium Chinigura Rice',
  'Aromatic short-grain rice from Rangpur. Famous for its sweet fragrance and perfect for traditional Bangladeshi dishes like polao and biryani.',
  'grains',
  85.00,
  'kg',
  500,
  '2024-01-10',
  '2024-12-15',
  true,
  ARRAY['Organic Certified', 'Fair Trade'],
  'Store in cool, dry place. Keep away from moisture.',
  '{"calories": 345, "protein": 7.1, "carbs": 78.2, "fiber": 1.3}',
  'Rangpur, Rangpur Division',
  'available',
  NOW(),
  NOW()
),
(
  'prod-002',
  'farmer-002',
  'Fresh Organic Begun (Eggplant)',
  'Purple eggplants grown organically in Manikganj. Rich in fiber and antioxidants. Perfect for traditional begun bharta and curries.',
  'vegetables',
  35.00,
  'kg',
  200,
  '2024-01-12',
  '2024-02-12',
  true,
  ARRAY['Organic Certified'],
  'Keep in cool place and use within 5 days for best quality.',
  '{"calories": 25, "protein": 1.0, "carbs": 6.0, "fiber": 3.0}',
  'Manikganj, Dhaka Division',
  'available',
  NOW(),
  NOW()
),
(
  'prod-003',
  'farmer-003',
  'Premium Sylhet Tea Leaves',
  'High-quality black tea leaves from the hills of Sylhet. Hand-picked and processed using traditional methods for authentic flavor.',
  'beverages',
  450.00,
  'kg',
  100,
  '2024-01-08',
  '2024-11-08',
  true,
  ARRAY['Organic Certified', 'ISO 22000'],
  'Store in airtight container away from direct sunlight.',
  '{"caffeine": 40, "antioxidants": "high", "theaflavins": "present"}',
  'Moulvibazar, Sylhet Division',
  'available',
  NOW(),
  NOW()
),
(
  'prod-004',
  'farmer-004',
  'Bandarban Hill Onions',
  'Small red onions grown in the hills of Chittagong Hill Tracts. Known for their strong flavor and longer shelf life.',
  'vegetables',
  45.00,
  'kg',
  300,
  '2024-01-15',
  '2024-03-15',
  false,
  ARRAY['GAP Certified'],
  'Store in well-ventilated, dry area.',
  '{"calories": 40, "protein": 1.1, "carbs": 9.3, "vitamin_c": 7.4}',
  'Bandarban, Chittagong Division',
  'available',
  NOW(),
  NOW()
),
(
  'prod-005',
  'farmer-001',
  'Rangpur Motor Sheem (Flat Beans)',
  'Fresh motor sheem (flat beans) harvested from Rangpur. Rich in protein and perfect for traditional Bengali preparations.',
  'vegetables',
  55.00,
  'kg',
  150,
  '2024-01-20',
  '2024-02-20',
  true,
  ARRAY['Organic Certified'],
  'Keep refrigerated and use within 3-4 days.',
  '{"calories": 35, "protein": 2.8, "carbs": 7.1, "fiber": 2.6}',
  'Rangpur, Rangpur Division',
  'available',
  NOW(),
  NOW()
),
(
  'prod-006',
  'farmer-002',
  'Dhaka Pui Shak (Malabar Spinach)',
  'Fresh pui shak leaves grown organically near Dhaka. Popular leafy green vegetable rich in iron and vitamins.',
  'leafy_greens',
  25.00,
  'kg',
  80,
  '2024-01-18',
  '2024-01-25',
  true,
  ARRAY['Organic Certified'],
  'Wash before use. Keep refrigerated.',
  '{"calories": 19, "protein": 1.8, "carbs": 3.4, "iron": 1.2}',
  'Manikganj, Dhaka Division',
  'available',
  NOW(),
  NOW()
);

-- Insert product images
INSERT INTO public.product_images (
  id,
  product_id,
  image_url,
  alt_text,
  is_primary,
  display_order,
  created_at
) VALUES 
('img-001', 'prod-001', '/placeholder.svg', 'Premium Basmati Rice', true, 1, NOW()),
('img-002', 'prod-002', '/placeholder.svg', 'Fresh Organic Tomatoes', true, 1, NOW()),
('img-003', 'prod-003', '/placeholder.svg', 'Organic Wheat Flour', true, 1, NOW()),
('img-004', 'prod-004', '/placeholder.svg', 'Fresh Red Onions', true, 1, NOW()),
('img-005', 'prod-005', '/placeholder.svg', 'Organic Green Peas', true, 1, NOW()),
('img-006', 'prod-006', '/placeholder.svg', 'Organic Spinach', true, 1, NOW());

-- Insert some sample orders (these will be created after customer registration)
INSERT INTO public.orders (
  id,
  customer_id,
  total_amount,
  status,
  delivery_address,
  payment_method,
  payment_status,
  estimated_delivery,
  actual_delivery,
  notes,
  created_at,
  updated_at
) VALUES 
(
  'order-001',
  NULL, -- Will be filled after customer creation
  520.00,
  'delivered',
  '25/A Dhanmondi, Dhaka-1205, Bangladesh',
  'cash_on_delivery',
  'completed',
  '2024-01-17',
  '2024-01-17',
  'Handle with care - tea leaves',
  '2024-01-15'::timestamp,
  NOW()
),
(
  'order-002',
  NULL,
  195.00,
  'in_transit',
  '15 Agrabad, Chittagong-4100, Bangladesh',
  'bkash',
  'completed',
  '2024-01-25',
  NULL,
  'Deliver to apartment building',
  '2024-01-22'::timestamp,
  NOW()
);

-- Insert order items
INSERT INTO public.order_items (
  id,
  order_id,
  product_id,
  quantity,
  unit_price,
  total_price,
  created_at
) VALUES 
('item-001', 'order-001', 'prod-001', 5, 85.00, 425.00, NOW()),
('item-002', 'order-001', 'prod-002', 2, 35.00, 70.00, NOW()),
('item-003', 'order-002', 'prod-003', 1, 450.00, 450.00, NOW()),
('item-004', 'order-002', 'prod-004', 3, 45.00, 135.00, NOW());

-- Insert crops data
INSERT INTO public.crops (
  id,
  farmer_id,
  crop_name,
  variety,
  planted_area,
  planting_date,
  expected_harvest_date,
  actual_harvest_date,
  expected_yield,
  actual_yield,
  crop_status,
  notes,
  created_at,
  updated_at
) VALUES 
(
  'crop-001',
  'farmer-001',
  'Chinigura Rice',
  'Traditional Aromatic',
  10.0,
  '2023-06-15',
  '2023-11-15',
  '2023-11-12',
  8.5,
  8.8,
  'harvested',
  'Excellent yield this season in Rangpur',
  NOW(),
  NOW()
),
(
  'crop-002',
  'farmer-002',
  'Begun (Eggplant)',
  'Local Variety',
  3.0,
  '2023-08-01',
  '2023-12-01',
  '2023-11-28',
  15.0,
  14.2,
  'harvested',
  'Good quality harvest near Dhaka',
  NOW(),
  NOW()
),
(
  'crop-003',
  'farmer-003',
  'Tea Leaves',
  'Black Tea',
  20.0,
  '2020-04-01',
  '2024-04-15',
  NULL,
  500.0,
  NULL,
  'growing',
  'Perennial crop - regular harvesting in Sylhet hills',
  NOW(),
  NOW()
);

-- Insert inventory records
INSERT INTO public.inventory (
  id,
  product_id,
  warehouse_location,
  quantity_in_stock,
  reserved_quantity,
  reorder_level,
  last_updated,
  notes
) VALUES 
('inv-001', 'prod-001', 'Dhaka Central Warehouse', 500, 50, 100, NOW(), 'Fresh Chinigura rice stock'),
('inv-002', 'prod-002', 'Chittagong Warehouse', 200, 25, 50, NOW(), 'Organic eggplant - limited shelf life'),
('inv-003', 'prod-003', 'Sylhet Tea Storage', 100, 15, 25, NOW(), 'Premium tea leaves - temperature controlled'),
('inv-004', 'prod-004', 'Chittagong Warehouse', 300, 40, 75, NOW(), 'Hill onions - good storage conditions'),
('inv-005', 'prod-005', 'Dhaka Central Warehouse', 150, 20, 30, NOW(), 'Fresh motor sheem arrival'),
('inv-006', 'prod-006', 'Dhaka Central Warehouse', 80, 10, 20, NOW(), 'Pui shak - use soon');

-- Create a function to link farmer profiles with auth users
CREATE OR REPLACE FUNCTION link_farmer_profile(user_email TEXT, farmer_profile_id TEXT)
RETURNS void AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the user UUID from auth.users
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  
  IF user_uuid IS NOT NULL THEN
    -- Update the farmer_profile with the user_id
    UPDATE public.farmer_profiles 
    SET user_id = user_uuid 
    WHERE id = farmer_profile_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Instructions for creating standardized users:
-- After running this SQL, create these users through Supabase Auth:

/*
STANDARDIZED USERS TO CREATE:

1. FARMERS:
   - Email: farmer@example.com
   - Password: admin1234
   - After creation, run: SELECT link_farmer_profile('farmer@example.com', 'farmer-001');
   
   - Email: farmer2@example.com  
   - Password: admin1234
   - After creation, run: SELECT link_farmer_profile('farmer2@example.com', 'farmer-002');
   
   - Email: farmer3@example.com
   - Password: admin1234
   - After creation, run: SELECT link_farmer_profile('farmer3@example.com', 'farmer-003');
   
   - Email: farmer4@example.com
   - Password: admin1234
   - After creation, run: SELECT link_farmer_profile('farmer4@example.com', 'farmer-004');

2. CUSTOMERS:
   - Email: customer@example.com
   - Password: admin1234
   
   - Email: customer2@example.com
   - Password: admin1234

3. DELIVERY PARTNERS:
   - Email: delivery@example.com
   - Password: admin1234
   
4. WAREHOUSE MANAGERS:
   - Email: warehouse@example.com
   - Password: admin1234
   
5. ADMIN:
   - Email: admin@example.com
   - Password: admin1234
*/

-- Sample query to verify data
-- SELECT 
--   p.name,
--   p.price_per_unit,
--   p.available_quantity,
--   fp.farm_name,
--   fp.location
-- FROM products p
-- JOIN farmer_profiles fp ON p.farmer_id = fp.id
-- WHERE p.status = 'available';
