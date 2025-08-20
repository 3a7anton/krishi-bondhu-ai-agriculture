-- Enhanced KrishiBondhu Showcase Data for Dashboards
-- This builds upon the existing sample_data.sql with more comprehensive data

-- Additional farmer profiles for better showcase
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
  'farmer-005',
  NULL,
  'Cumilla Organic Cooperative',
  'Cumilla, Chittagong Division',
  30.0,
  ARRAY['Organic Certified', 'Fair Trade', 'ISO 22000'],
  20,
  ARRAY['Rice', 'Wheat', 'Vegetables'],
  4.9,
  350000,
  NOW(),
  NOW()
),
(
  'farmer-006',
  NULL,
  'Rajshahi Mango Gardens',
  'Rajshahi, Rajshahi Division',
  18.5,
  ARRAY['GAP Certified'],
  14,
  ARRAY['Mango', 'Litchi', 'Guava'],
  4.7,
  180000,
  NOW(),
  NOW()
);

-- Enhanced products for better dashboard showcase
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
  'prod-007',
  'farmer-005',
  'Premium Cumilla Rice',
  'High-quality long-grain rice from Cumilla cooperative. Certified organic with excellent yield and taste.',
  'grains',
  95.00,
  'kg',
  800,
  '2024-01-22',
  '2024-12-22',
  true,
  ARRAY['Organic Certified', 'Fair Trade'],
  'Store in cool, dry place with good ventilation.',
  '{"calories": 350, "protein": 7.5, "carbs": 80.1, "fiber": 1.5}',
  'Cumilla, Chittagong Division',
  'available',
  NOW(),
  NOW()
),
(
  'prod-008',
  'farmer-006',
  'Rajshahi Himsagar Mango',
  'Premium Himsagar mangoes from Rajshahi. Sweet, juicy and aromatic - perfect for the summer season.',
  'fruits',
  120.00,
  'kg',
  250,
  '2024-01-20',
  '2024-02-15',
  false,
  ARRAY['GAP Certified'],
  'Keep in cool place. Refrigerate after ripening.',
  '{"calories": 60, "protein": 0.8, "carbs": 15.0, "vitamin_c": 36.4}',
  'Rajshahi, Rajshahi Division',
  'available',
  NOW(),
  NOW()
),
(
  'prod-009',
  'farmer-001',
  'Rangpur Carrots',
  'Fresh orange carrots grown in Rangpur soil. Rich in beta-carotene and perfect for cooking and juicing.',
  'vegetables',
  40.00,
  'kg',
  180,
  '2024-01-25',
  '2024-03-25',
  true,
  ARRAY['Organic Certified'],
  'Store in refrigerator in perforated plastic bags.',
  '{"calories": 41, "protein": 0.9, "carbs": 9.6, "vitamin_a": 184}',
  'Rangpur, Rangpur Division',
  'available',
  NOW(),
  NOW()
),
(
  'prod-010',
  'farmer-003',
  'Sylhet Lime',
  'Fresh green limes from Sylhet gardens. High in vitamin C and perfect for cooking and beverages.',
  'fruits',
  80.00,
  'kg',
  120,
  '2024-01-24',
  '2024-02-24',
  true,
  ARRAY['Organic Certified'],
  'Store at room temperature or refrigerate for longer freshness.',
  '{"calories": 30, "protein": 0.7, "carbs": 10.5, "vitamin_c": 29.1}',
  'Moulvibazar, Sylhet Division',
  'available',
  NOW(),
  NOW()
);

-- Enhanced orders for better analytics
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
  'order-003',
  NULL,
  850.00,
  'delivered',
  '45 Elephant Road, Dhaka-1205, Bangladesh',
  'bkash',
  'completed',
  '2024-01-20',
  '2024-01-20',
  'Premium rice order for restaurant',
  '2024-01-18'::timestamp,
  NOW()
),
(
  'order-004',
  NULL,
  450.00,
  'processing',
  '78 GEC Circle, Chittagong-4000, Bangladesh',
  'rocket',
  'completed',
  '2024-01-27',
  NULL,
  'Mixed vegetable order',
  '2024-01-24'::timestamp,
  NOW()
),
(
  'order-005',
  NULL,
  320.00,
  'in_transit',
  '12 Station Road, Sylhet-3100, Bangladesh',
  'cash_on_delivery',
  'pending',
  '2024-01-26',
  NULL,
  'Fruit delivery for family',
  '2024-01-23'::timestamp,
  NOW()
),
(
  'order-006',
  NULL,
  275.00,
  'pending',
  '33 College Road, Rajshahi-6000, Bangladesh',
  'bkash',
  'completed',
  '2024-01-28',
  NULL,
  'Organic vegetables needed urgently',
  '2024-01-25'::timestamp,
  NOW()
),
(
  'order-007',
  NULL,
  680.00,
  'delivered',
  '89 Bailey Road, Dhaka-1000, Bangladesh',
  'rocket',
  'completed',
  '2024-01-21',
  '2024-01-21',
  'Large order for grocery store',
  '2024-01-19'::timestamp,
  NOW()
);

-- Enhanced order items
INSERT INTO public.order_items (
  id,
  order_id,
  product_id,
  quantity,
  unit_price,
  total_price,
  created_at
) VALUES 
('item-005', 'order-003', 'prod-007', 8, 95.00, 760.00, NOW()),
('item-006', 'order-003', 'prod-009', 2, 40.00, 80.00, NOW()),
('item-007', 'order-004', 'prod-002', 5, 35.00, 175.00, NOW()),
('item-008', 'order-004', 'prod-005', 3, 55.00, 165.00, NOW()),
('item-009', 'order-004', 'prod-006', 4, 25.00, 100.00, NOW()),
('item-010', 'order-005', 'prod-008', 2, 120.00, 240.00, NOW()),
('item-011', 'order-005', 'prod-010', 1, 80.00, 80.00, NOW()),
('item-012', 'order-006', 'prod-009', 3, 40.00, 120.00, NOW()),
('item-013', 'order-006', 'prod-005', 2, 55.00, 110.00, NOW()),
('item-014', 'order-006', 'prod-002', 1, 35.00, 35.00, NOW()),
('item-015', 'order-007', 'prod-001', 6, 85.00, 510.00, NOW()),
('item-016', 'order-007', 'prod-004', 3, 45.00, 135.00, NOW()),
('item-017', 'order-007', 'prod-006', 1, 25.00, 25.00, NOW());

-- Enhanced crops data
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
  'crop-004',
  'farmer-005',
  'Rice',
  'BRRI Dhan 29',
  25.0,
  '2023-07-01',
  '2023-12-01',
  '2023-11-28',
  20.0,
  21.5,
  'harvested',
  'Excellent yield in Cumilla cooperative fields',
  NOW(),
  NOW()
),
(
  'crop-005',
  'farmer-006',
  'Mango',
  'Himsagar',
  15.0,
  '2020-04-01',
  '2024-05-15',
  NULL,
  300.0,
  NULL,
  'growing',
  'Perennial mango trees in Rajshahi - seasonal harvest',
  NOW(),
  NOW()
),
(
  'crop-006',
  'farmer-001',
  'Carrots',
  'Local Orange',
  2.5,
  '2023-10-15',
  '2024-01-15',
  '2024-01-12',
  8.0,
  7.8,
  'harvested',
  'Winter carrot crop in Rangpur',
  NOW(),
  NOW()
),
(
  'crop-007',
  'farmer-002',
  'Spinach',
  'Pui Shak',
  1.0,
  '2024-01-01',
  '2024-02-01',
  NULL,
  3.0,
  NULL,
  'growing',
  'Fast-growing leafy greens near Dhaka',
  NOW(),
  NOW()
);

-- Enhanced inventory records
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
('inv-007', 'prod-007', 'Cumilla Regional Warehouse', 800, 80, 150, NOW(), 'Premium cooperative rice'),
('inv-008', 'prod-008', 'Rajshahi Fruit Storage', 250, 30, 50, NOW(), 'Seasonal mango stock - temperature controlled'),
('inv-009', 'prod-009', 'Dhaka Central Warehouse', 180, 25, 40, NOW(), 'Fresh carrot delivery'),
('inv-010', 'prod-010', 'Sylhet Citrus Storage', 120, 15, 25, NOW(), 'Lime harvest - maintain humidity');

-- Warehouse data for better showcase
INSERT INTO public.warehouse_locations (
  id,
  name,
  address,
  city,
  division,
  postal_code,
  capacity_tons,
  current_stock_tons,
  temperature_controlled,
  humidity_controlled,
  manager_contact,
  operating_hours,
  services,
  created_at,
  updated_at
) VALUES 
(
  'warehouse-001',
  'Dhaka Central Agricultural Warehouse',
  '25 Tejgaon Industrial Area',
  'Dhaka',
  'Dhaka Division',
  '1208',
  500.0,
  380.5,
  true,
  true,
  '+880-1712-345678',
  '6:00 AM - 10:00 PM',
  ARRAY['Storage', 'Packaging', 'Quality Control', 'Transportation'],
  NOW(),
  NOW()
),
(
  'warehouse-002',
  'Chittagong Port Agricultural Hub',
  '45 Port Access Road',
  'Chittagong',
  'Chittagong Division',
  '4100',
  350.0,
  280.2,
  true,
  false,
  '+880-1813-456789',
  '24 Hours',
  ARRAY['Storage', 'Export Processing', 'Cold Storage'],
  NOW(),
  NOW()
),
(
  'warehouse-003',
  'Rajshahi Fruit Processing Center',
  '78 Fruit Garden Road',
  'Rajshahi',
  'Rajshahi Division',
  '6000',
  200.0,
  145.8,
  true,
  true,
  '+880-1914-567890',
  '5:00 AM - 9:00 PM',
  ARRAY['Fruit Storage', 'Processing', 'Packaging', 'Quality Testing'],
  NOW(),
  NOW()
);

-- Customer profiles for better customer dashboard
INSERT INTO public.customer_profiles (
  id,
  user_id,
  full_name,
  phone,
  delivery_address,
  city,
  postal_code,
  preferred_payment_method,
  dietary_preferences,
  order_frequency,
  total_orders,
  total_spent,
  loyalty_points,
  created_at,
  updated_at
) VALUES 
(
  'customer-001',
  NULL,
  'Ahmed Rahman',
  '+880-1712-123456',
  '25/A Dhanmondi Road 15',
  'Dhaka',
  '1209',
  'bkash',
  ARRAY['Organic', 'Fresh Vegetables'],
  'weekly',
  12,
  15000.00,
  250,
  NOW(),
  NOW()
),
(
  'customer-002',
  NULL,
  'Fatima Khatun',
  '+880-1813-234567',
  '78 Agrabad Commercial Area',
  'Chittagong',
  '4100',
  'rocket',
  ARRAY['Fruits', 'Organic Rice'],
  'bi-weekly',
  8,
  8500.00,
  170,
  NOW(),
  NOW()
);

-- Delivery partner profiles
INSERT INTO public.delivery_partner_profiles (
  id,
  user_id,
  full_name,
  phone,
  vehicle_type,
  license_number,
  coverage_areas,
  rating,
  total_deliveries,
  total_earnings,
  availability_status,
  created_at,
  updated_at
) VALUES 
(
  'delivery-001',
  NULL,
  'Karim Uddin',
  '+880-1714-345678',
  'motorcycle',
  'DHA-2024-5678',
  ARRAY['Dhaka Central', 'Dhanmondi', 'Gulshan', 'Uttara'],
  4.8,
  456,
  85000.00,
  'active',
  NOW(),
  NOW()
),
(
  'delivery-002',
  NULL,
  'Rashid Ali',
  '+880-1815-456789',
  'van',
  'CTG-2024-1234',
  ARRAY['Chittagong City', 'Agrabad', 'Panchlaish'],
  4.6,
  298,
  52000.00,
  'active',
  NOW(),
  NOW()
);

-- Delivery assignments for showcase
INSERT INTO public.delivery_assignments (
  id,
  order_id,
  delivery_partner_id,
  pickup_location,
  delivery_address,
  estimated_pickup_time,
  actual_pickup_time,
  estimated_delivery_time,
  actual_delivery_time,
  delivery_status,
  notes,
  created_at,
  updated_at
) VALUES 
(
  'delivery-001',
  'order-001',
  'delivery-001',
  'Dhaka Central Warehouse',
  '25/A Dhanmondi, Dhaka-1205, Bangladesh',
  '2024-01-17 09:00:00',
  '2024-01-17 09:15:00',
  '2024-01-17 11:00:00',
  '2024-01-17 10:45:00',
  'delivered',
  'Smooth delivery, customer satisfied',
  NOW(),
  NOW()
),
(
  'delivery-002',
  'order-005',
  'delivery-001',
  'Sylhet Citrus Storage',
  '12 Station Road, Sylhet-3100, Bangladesh',
  '2024-01-26 10:00:00',
  NULL,
  '2024-01-26 14:00:00',
  NULL,
  'in_transit',
  'Picked up from warehouse, en route to customer',
  NOW(),
  NOW()
);

-- Function to create links for all user types
CREATE OR REPLACE FUNCTION link_user_profiles()
RETURNS void AS $$
BEGIN
  -- This function will be used to link user profiles after auth users are created
  RAISE NOTICE 'User profile linking function created. Run after creating auth users.';
END;
$$ LANGUAGE plpgsql;

-- Enhanced admin analytics data
INSERT INTO public.platform_analytics (
  id,
  date,
  total_users,
  active_users,
  new_registrations,
  total_orders,
  total_revenue,
  avg_order_value,
  farmer_signups,
  customer_signups,
  delivery_partner_signups,
  warehouse_registrations,
  created_at
) VALUES 
('analytics-001', '2024-01-15', 1245, 890, 45, 123, 45000.00, 365.85, 12, 28, 3, 2, NOW()),
('analytics-002', '2024-01-16', 1267, 920, 22, 145, 52000.00, 358.62, 8, 12, 1, 1, NOW()),
('analytics-003', '2024-01-17', 1289, 945, 22, 168, 58500.00, 348.21, 7, 14, 1, 0, NOW()),
('analytics-004', '2024-01-18', 1310, 976, 21, 189, 65200.00, 345.02, 9, 11, 1, 0, NOW()),
('analytics-005', '2024-01-19', 1334, 1002, 24, 212, 72800.00, 343.40, 11, 12, 1, 0, NOW()),
('analytics-006', '2024-01-20', 1356, 1025, 22, 234, 79500.00, 339.74, 8, 13, 1, 0, NOW()),
('analytics-007', '2024-01-21', 1378, 1048, 22, 256, 86200.00, 336.72, 10, 11, 1, 0, NOW());

-- Comments for setup instructions
COMMENT ON TABLE public.farmer_profiles IS 'Enhanced farmer profiles for comprehensive dashboard showcase';
COMMENT ON TABLE public.products IS 'Diverse product catalog showcasing Bangladesh agricultural variety';
COMMENT ON TABLE public.orders IS 'Complete order lifecycle for analytics and tracking demonstrations';
COMMENT ON TABLE public.warehouse_locations IS 'Strategic warehouse network across Bangladesh';
COMMENT ON TABLE public.customer_profiles IS 'Customer profiles for personalized shopping experience';
COMMENT ON TABLE public.delivery_partner_profiles IS 'Delivery network for last-mile logistics';
COMMENT ON TABLE public.platform_analytics IS 'Historical data for admin dashboard analytics';

-- Sample queries for verification
/*
-- Verify farmer data richness
SELECT 
  fp.farm_name,
  fp.location,
  COUNT(p.id) as product_count,
  SUM(p.available_quantity) as total_inventory,
  fp.rating
FROM farmer_profiles fp
LEFT JOIN products p ON fp.id = p.farmer_id
GROUP BY fp.id, fp.farm_name, fp.location, fp.rating
ORDER BY product_count DESC;

-- Verify order distribution
SELECT 
  status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_value,
  AVG(total_amount) as avg_order_value
FROM orders
GROUP BY status;

-- Verify warehouse utilization
SELECT 
  name,
  city,
  capacity_tons,
  current_stock_tons,
  ROUND((current_stock_tons/capacity_tons)*100, 2) as utilization_percent
FROM warehouse_locations
ORDER BY utilization_percent DESC;
*/
