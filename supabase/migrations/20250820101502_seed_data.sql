-- =====================================================
-- KrishiBondhu Seed Data
-- Populates database with initial data from mock files
-- =====================================================

-- ===================
-- CROPS MASTER DATA
-- ===================

INSERT INTO public.crops (name, category, season, planting_season, harvest_season, water_requirement, soil_type, climate_requirements, growing_tips, common_diseases, common_pests, nutritional_info, market_price_range) VALUES
('Rice', 'Grains', 'kharif', 'June-July', 'November-December', 'high', '{"clay", "loamy"}', 'Warm and humid climate with abundant rainfall', 'Maintain water level 2-5cm, apply organic manure', '{"blast", "bacterial_blight", "sheath_blight"}', '{"stem_borer", "brown_planthopper", "green_leafhopper"}', '{"carbohydrates": 78, "protein": 7, "fat": 0.7, "fiber": 1.3}', '{"min": 20, "max": 35, "unit": "per_kg"}'),

('Wheat', 'Grains', 'rabi', 'November-December', 'April-May', 'medium', '{"loamy", "clay_loam"}', 'Cool and dry climate during growing season', 'Ensure proper drainage, avoid waterlogging', '{"rust", "smut", "powdery_mildew"}', '{"aphid", "termite", "cutworm"}', '{"carbohydrates": 71, "protein": 12, "fat": 1.5, "fiber": 12.2}', '{"min": 25, "max": 40, "unit": "per_kg"}'),

('Tomato', 'Vegetables', 'both', 'Year-round', 'Year-round', 'medium', '{"sandy_loam", "loamy"}', 'Warm weather with good sunlight', 'Regular watering, staking for support', '{"early_blight", "late_blight", "bacterial_wilt"}', '{"whitefly", "fruit_borer", "aphid"}', '{"carbohydrates": 3.9, "protein": 0.9, "fat": 0.2, "vitamin_c": 13.7}', '{"min": 15, "max": 30, "unit": "per_kg"}'),

('Onion', 'Vegetables', 'rabi', 'October-November', 'March-April', 'low', '{"sandy_loam", "alluvial"}', 'Cool and dry climate', 'Avoid excessive moisture, good drainage needed', '{"purple_blotch", "downy_mildew", "basal_rot"}', '{"thrips", "cutworm", "onion_maggot"}', '{"carbohydrates": 11, "protein": 1.1, "fat": 0.1, "fiber": 1.7}', '{"min": 12, "max": 25, "unit": "per_kg"}'),

('Potato', 'Vegetables', 'rabi', 'October-December', 'February-April', 'medium', '{"sandy_loam", "loamy"}', 'Cool climate with moderate rainfall', 'Earthing up is essential, avoid waterlogging', '{"late_blight", "early_blight", "black_scurf"}', '{"potato_tuber_moth", "aphid", "colorado_beetle"}', '{"carbohydrates": 17, "protein": 2, "fat": 0.1, "vitamin_c": 19.7}', '{"min": 8, "max": 20, "unit": "per_kg"}'),

('Sugarcane', 'Cash Crops', 'both', 'February-April', 'December-March', 'high', '{"deep_loamy", "alluvial"}', 'Hot and humid climate with heavy rainfall', 'Requires 12-15 months to mature', '{"red_rot", "smut", "wilt"}', '{"early_shoot_borer", "termite", "scale_insect"}', '{"carbohydrates": 13.3, "protein": 0.4, "fat": 0.4, "fiber": 0.6}', '{"min": 2.5, "max": 4, "unit": "per_kg"}'),

('Cotton', 'Cash Crops', 'kharif', 'April-June', 'October-January', 'medium', '{"black_cotton", "alluvial"}', 'Warm climate with moderate rainfall', 'Requires 180-200 frost-free days', '{"wilt", "bacterial_blight", "leaf_curl"}', '{"bollworm", "aphid", "thrips"}', '{"fiber": 90, "oil": 18, "protein": 23}', '{"min": 50, "max": 80, "unit": "per_kg"}'),

('Maize', 'Grains', 'both', 'June-July & February-March', 'September-October & May-June', 'medium', '{"sandy_loam", "clay_loam"}', 'Warm weather with adequate rainfall', 'Requires good drainage and fertile soil', '{"downy_mildew", "leaf_blight", "stalk_rot"}', '{"stem_borer", "fall_armyworm", "aphid"}', '{"carbohydrates": 74, "protein": 9, "fat": 4.7, "fiber": 2.7}', '{"min": 18, "max": 25, "unit": "per_kg"}'),

('Soybean', 'Pulses', 'kharif', 'June-July', 'October-November', 'medium', '{"well_drained_loamy", "sandy_loam"}', 'Warm and humid climate', 'Nitrogen fixing crop, avoid waterlogging', '{"rust", "bacterial_blight", "pod_blight"}', '{"stem_fly", "girdle_beetle", "semilooper"}', '{"protein": 40, "fat": 20, "carbohydrates": 30, "fiber": 5}', '{"min": 35, "max": 55, "unit": "per_kg"}'),

('Chickpea', 'Pulses', 'rabi', 'October-November', 'March-April', 'low', '{"sandy_loam", "clay_loam"}', 'Cool and dry climate', 'Drought tolerant, avoid excessive moisture', '{"wilt", "blight", "rust"}', '{"pod_borer", "aphid", "cutworm"}', '{"protein": 20, "carbohydrates": 61, "fat": 6, "fiber": 17}', '{"min": 40, "max": 70, "unit": "per_kg"}');

-- ===================
-- SAMPLE FARMER PROFILES
-- ===================

-- Note: These will be created when users register, but adding some sample data
-- We'll insert directly into auth.users table for demo, then the trigger will create profiles

-- ===================
-- SAMPLE PRODUCTS
-- ===================

-- First, let's create some sample farmer profiles (this would normally be done through registration)
-- For demo purposes, we'll create them directly

-- Create sample auth users and profiles for farmers
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data) VALUES
('11111111-1111-1111-1111-111111111111', 'ram.sharma@example.com', NOW(), NOW(), NOW(), '{"role": "farmer", "phone": "+91-9876543210"}'),
('22222222-2222-2222-2222-222222222222', 'sita.devi@example.com', NOW(), NOW(), NOW(), '{"role": "farmer", "phone": "+91-9876543211"}'),
('33333333-3333-3333-3333-333333333333', 'mohan.lal@example.com', NOW(), NOW(), NOW(), '{"role": "farmer", "phone": "+91-9876543212"}'),
('44444444-4444-4444-4444-444444444444', 'rajesh.kumar@example.com', NOW(), NOW(), NOW(), '{"role": "farmer", "phone": "+91-9876543213"}');

-- Create farmer profiles (these should be created by the trigger, but adding manually for seed data)
INSERT INTO public.farmer_profiles (id, profile_id, full_name, land_area_acres, crops_grown, farm_location, farming_experience_years, organic_certified) VALUES
('aaaa1111-1111-1111-1111-111111111111', (SELECT id FROM public.profiles WHERE user_id = '11111111-1111-1111-1111-111111111111'), 'Ram Kumar Sharma', 15.5, '{"rice", "wheat", "sugarcane"}', 'Village Rampur, Uttar Pradesh', 20, true),
('bbbb2222-2222-2222-2222-222222222222', (SELECT id FROM public.profiles WHERE user_id = '22222222-2222-2222-2222-222222222222'), 'Sita Devi', 8.0, '{"tomato", "onion", "potato"}', 'Village Sitapur, Bihar', 15, true),
('cccc3333-3333-3333-3333-333333333333', (SELECT id FROM public.profiles WHERE user_id = '33333333-3333-3333-3333-333333333333'), 'Mohan Lal', 25.0, '{"wheat", "chickpea", "maize"}', 'Village Mohanganj, Madhya Pradesh', 25, true),
('dddd4444-4444-4444-4444-444444444444', (SELECT id FROM public.profiles WHERE user_id = '44444444-4444-4444-4444-444444444444'), 'Rajesh Kumar', 12.0, '{"onion", "potato", "tomato"}', 'Village Rajpur, Uttar Pradesh', 18, false);

-- ===================
-- SAMPLE PRODUCTS
-- ===================

INSERT INTO public.products (farmer_id, name, description, category, price, original_price, unit, available_quantity, harvest_date, expiry_date, organic, location, featured) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'Premium Basmati Rice', 'High-quality aromatic basmati rice, aged for perfect taste and texture', 'grains', 75.00, 85.00, 'kg', 500, '2024-01-10', '2024-12-15', true, 'Village Rampur, UP', true),
('bbbb2222-2222-2222-2222-222222222222', 'Fresh Organic Tomatoes', 'Vine-ripened organic tomatoes, perfect for cooking and salads', 'vegetables', 25.00, 30.00, 'kg', 200, '2024-01-12', '2024-02-12', true, 'Village Sitapur, Bihar', true),
('cccc3333-3333-3333-3333-333333333333', 'Organic Wheat Flour', 'Stone-ground whole wheat flour from organic wheat', 'grains', 32.00, 35.00, 'kg', 1000, '2024-01-08', '2024-11-08', true, 'Village Mohanganj, MP', true),
('dddd4444-4444-4444-4444-444444444444', 'Fresh Onions', 'Quality red onions, perfect for cooking and storage', 'vegetables', 18.00, 22.00, 'kg', 300, '2024-01-15', '2024-03-15', false, 'Village Rajpur, UP', true),
('aaaa1111-1111-1111-1111-111111111111', 'Golden Wheat', 'Premium quality wheat grains, perfect for flour making', 'grains', 28.00, 32.00, 'kg', 800, '2024-01-05', '2024-10-05', false, 'Village Rampur, UP', false),
('bbbb2222-2222-2222-2222-222222222222', 'Organic Potatoes', 'Chemical-free potatoes with excellent taste', 'vegetables', 22.00, 25.00, 'kg', 400, '2024-01-20', '2024-04-20', true, 'Village Sitapur, Bihar', false),
('cccc3333-3333-3333-3333-333333333333', 'Premium Chickpeas', 'Large-sized chickpeas with high protein content', 'pulses', 65.00, 70.00, 'kg', 150, '2024-01-01', '2024-12-01', true, 'Village Mohanganj, MP', false),
('dddd4444-4444-4444-4444-444444444444', 'Sweet Corn', 'Fresh sweet corn, perfect for roasting and cooking', 'vegetables', 30.00, 35.00, 'kg', 100, '2024-01-25', '2024-02-25', false, 'Village Rajpur, UP', false);

-- ===================
-- SAMPLE WEATHER DATA
-- ===================

INSERT INTO public.weather_data (location, latitude, longitude, temperature, humidity, wind_speed, precipitation, condition, forecast_data) VALUES
('Rampur, UP', 28.8000, 79.0300, 28.5, 65.0, 12.0, 0.0, 'Partly Cloudy', '[
  {"day": "Today", "high": 30, "low": 22, "condition": "Sunny"},
  {"day": "Tomorrow", "high": 29, "low": 21, "condition": "Partly Cloudy"},
  {"day": "Day 3", "high": 27, "low": 20, "condition": "Rain"},
  {"day": "Day 4", "high": 28, "low": 21, "condition": "Sunny"},
  {"day": "Day 5", "high": 31, "low": 23, "condition": "Sunny"},
  {"day": "Day 6", "high": 29, "low": 22, "condition": "Cloudy"},
  {"day": "Day 7", "high": 26, "low": 19, "condition": "Rain"}
]'),
('Sitapur, Bihar', 25.6800, 85.1700, 26.0, 70.0, 8.0, 5.0, 'Light Rain', '[
  {"day": "Today", "high": 28, "low": 20, "condition": "Rain"},
  {"day": "Tomorrow", "high": 27, "low": 19, "condition": "Cloudy"},
  {"day": "Day 3", "high": 29, "low": 21, "condition": "Sunny"},
  {"day": "Day 4", "high": 30, "low": 22, "condition": "Partly Cloudy"},
  {"day": "Day 5", "high": 28, "low": 20, "condition": "Rain"},
  {"day": "Day 6", "high": 27, "low": 19, "condition": "Cloudy"},
  {"day": "Day 7", "high": 29, "low": 21, "condition": "Sunny"}
]');

-- ===================
-- SAMPLE MARKET PRICES
-- ===================

INSERT INTO public.market_prices (crop_id, market_name, location, price_per_unit, unit, quality_grade, date_recorded, source) VALUES
((SELECT id FROM public.crops WHERE name = 'Rice'), 'Rampur Mandi', 'Rampur, UP', 28.50, 'kg', 'Grade A', CURRENT_DATE, 'Local Market'),
((SELECT id FROM public.crops WHERE name = 'Rice'), 'Delhi Wholesale Market', 'Delhi', 32.00, 'kg', 'Grade A', CURRENT_DATE, 'Wholesale'),
((SELECT id FROM public.crops WHERE name = 'Wheat'), 'Mohanganj Mandi', 'Mohanganj, MP', 26.00, 'kg', 'Grade A', CURRENT_DATE, 'Local Market'),
((SELECT id FROM public.crops WHERE name = 'Tomato'), 'Sitapur Market', 'Sitapur, Bihar', 22.00, 'kg', 'Grade A', CURRENT_DATE, 'Local Market'),
((SELECT id FROM public.crops WHERE name = 'Onion'), 'Rajpur Mandi', 'Rajpur, UP', 16.00, 'kg', 'Grade A', CURRENT_DATE, 'Local Market');

-- ===================
-- SAMPLE WAREHOUSE PROFILES
-- ===================

-- Create sample warehouse users
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data) VALUES
('55555555-5555-5555-5555-555555555555', 'warehouse.a@example.com', NOW(), NOW(), NOW(), '{"role": "warehouse", "phone": "+91-9876543220"}'),
('66666666-6666-6666-6666-666666666666', 'warehouse.b@example.com', NOW(), NOW(), NOW(), '{"role": "warehouse", "phone": "+91-9876543221"}');

-- Create warehouse profiles
INSERT INTO public.warehouse_profiles (id, profile_id, business_name, capacity_tons, facilities, location, certifications, operating_hours, contact_person) VALUES
('eeee5555-5555-5555-5555-555555555555', (SELECT id FROM public.profiles WHERE user_id = '55555555-5555-5555-5555-555555555555'), 'Green Valley Storage', 1000.0, '{"cold_storage", "grain_silos", "sorting_facility"}', 'Rampur Industrial Area, UP', '{"ISO_9001", "FSSAI", "organic_certified"}', '24/7', 'Suresh Kumar'),
('ffff6666-6666-6666-6666-666666666666', (SELECT id FROM public.profiles WHERE user_id = '66666666-6666-6666-6666-666666666666'), 'Modern Agri Hub', 800.0, '{"climate_controlled", "packaging_unit", "quality_testing"}', 'Sitapur Main Road, Bihar', '{"FSSAI", "BIS_certified"}', '6:00 AM - 10:00 PM', 'Ramesh Singh');

-- ===================
-- SAMPLE CUSTOMER PROFILES
-- ===================

-- Create sample customer users
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data) VALUES
('77777777-7777-7777-7777-777777777777', 'customer1@example.com', NOW(), NOW(), NOW(), '{"role": "customer", "phone": "+91-9876543230"}'),
('88888888-8888-8888-8888-888888888888', 'customer2@example.com', NOW(), NOW(), NOW(), '{"role": "customer", "phone": "+91-9876543231"}');

-- Create customer profiles
INSERT INTO public.customer_profiles (id, profile_id, full_name, delivery_address, city, postal_code, food_preferences, dietary_restrictions) VALUES
('gggg7777-7777-7777-7777-777777777777', (SELECT id FROM public.profiles WHERE user_id = '77777777-7777-7777-7777-777777777777'), 'Priya Sharma', '123 Gandhi Road, Sector 15', 'New Delhi', '110001', '{"organic", "fresh_vegetables", "whole_grains"}', '{"gluten_free"}'),
('hhhh8888-8888-8888-8888-888888888888', (SELECT id FROM public.profiles WHERE user_id = '88888888-8888-8888-8888-888888888888'), 'Amit Patel', '456 MG Road, Bandra West', 'Mumbai', '400050', '{"local_produce", "seasonal_fruits"}', '{"vegan"}');

-- ===================
-- SAMPLE DELIVERY PARTNERS
-- ===================

-- Create sample delivery partner users
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data) VALUES
('99999999-9999-9999-9999-999999999999', 'delivery1@example.com', NOW(), NOW(), NOW(), '{"role": "delivery_partner", "phone": "+91-9876543240"}');

-- Create delivery partner profiles
INSERT INTO public.delivery_partner_profiles (id, profile_id, full_name, vehicle_type, vehicle_registration, license_number, coverage_areas, availability_hours) VALUES
('iiii9999-9999-9999-9999-999999999999', (SELECT id FROM public.profiles WHERE user_id = '99999999-9999-9999-9999-999999999999'), 'Vikash Kumar', 'Pickup Truck', 'UP-80-AB-1234', 'DL1234567890', '{"Delhi", "Noida", "Gurgaon", "Faridabad"}', '6:00 AM - 8:00 PM');

-- ===================
-- UPDATE SEQUENCES
-- ===================

-- Reset sequence if needed
SELECT setval('order_sequence', 1, false);
