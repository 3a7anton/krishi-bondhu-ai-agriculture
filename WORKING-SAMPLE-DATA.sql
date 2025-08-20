-- WORKING SAMPLE DATA FIX
-- Copy and paste this entire block into Supabase SQL Editor

-- Step 1: Temporarily remove the NOT NULL constraint
ALTER TABLE profiles ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Add sample data
DO $$
DECLARE
    test_profile_id UUID := gen_random_uuid();
    test_farmer_id UUID := gen_random_uuid();
    product_ids UUID[];
BEGIN
    -- Insert test profile (now user_id can be null)
    INSERT INTO profiles (id, role, verification_status) 
    VALUES (test_profile_id, 'farmer', 'verified')
    ON CONFLICT DO NOTHING;
    
    -- Insert farmer profile
    INSERT INTO farmer_profiles (id, profile_id, full_name, farm_location, land_area_acres, farming_experience_years, crops_grown, organic_certified)
    VALUES (test_farmer_id, test_profile_id, 'Demo Farmer', 'Maharashtra, India', 5.5, 10, ARRAY['Rice', 'Wheat', 'Tomatoes'], true)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample products
    INSERT INTO products (farmer_id, name, description, category, price, unit, available_quantity, location, organic, featured, harvest_date, expiry_date) 
    VALUES
    (test_farmer_id, 'Organic Basmati Rice', 'Premium quality organic basmati rice grown without pesticides', 'grains', 120, 'kg', 500, 'Maharashtra, India', true, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year'),
    (test_farmer_id, 'Fresh Tomatoes', 'Vine-ripened fresh tomatoes, perfect for cooking', 'vegetables', 40, 'kg', 200, 'Maharashtra, India', false, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 week'),
    (test_farmer_id, 'Organic Wheat Flour', 'Stone-ground organic wheat flour, rich in nutrients', 'grains', 60, 'kg', 300, 'Maharashtra, India', true, false, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months'),
    (test_farmer_id, 'Fresh Carrots', 'Organic carrots grown in rich soil', 'vegetables', 35, 'kg', 150, 'Maharashtra, India', true, false, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 weeks'),
    (test_farmer_id, 'Premium Honey', 'Pure wildflower honey from organic farms', 'dairy', 200, 'bottle', 50, 'Maharashtra, India', true, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 years')
    ON CONFLICT DO NOTHING;
    
    -- Get product IDs
    SELECT array_agg(id) INTO product_ids FROM products WHERE farmer_id = test_farmer_id;
    
    -- Add product images
    INSERT INTO product_images (product_id, image_url, is_primary) 
    SELECT unnest(product_ids), '/placeholder.svg', true
    ON CONFLICT DO NOTHING;
    
    -- Add inventory records
    INSERT INTO inventory (product_id, quantity_in_stock, reorder_level) 
    SELECT unnest(product_ids), 100, 10
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '✅ SUCCESS: Created % products for Demo Farmer!', array_length(product_ids, 1);
END $$;

-- Step 3: (Optional) Restore the NOT NULL constraint later when you have real users
-- Uncomment the line below if you want to restore the constraint:
-- ALTER TABLE profiles ALTER COLUMN user_id SET NOT NULL;
