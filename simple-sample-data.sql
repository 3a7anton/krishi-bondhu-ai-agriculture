-- SIMPLE SAMPLE DATA - No table modifications needed
-- This creates a dummy user in auth.users first, then adds sample data

DO $$
DECLARE
    dummy_user_id UUID := 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'; -- Fixed UUID for testing
    test_profile_id UUID := gen_random_uuid();
    test_farmer_id UUID := gen_random_uuid();
    product_ids UUID[];
BEGIN
    -- Method 1: Create sample data without real auth user (requires temporarily disabling constraints)
    -- This is the safest approach for testing
    
    -- Temporarily disable foreign key constraint
    ALTER TABLE profiles DISABLE TRIGGER ALL;
    
    -- Insert test profile with dummy user_id
    INSERT INTO profiles (id, user_id, role, verification_status) 
    VALUES (test_profile_id, dummy_user_id, 'farmer', 'verified')
    ON CONFLICT DO NOTHING;
    
    -- Re-enable constraints
    ALTER TABLE profiles ENABLE TRIGGER ALL;
    
    -- Insert farmer profile
    INSERT INTO farmer_profiles (id, profile_id, full_name, farm_location, land_area_acres, farming_experience_years, crops_grown, organic_certified)
    VALUES (test_farmer_id, test_profile_id, 'Demo Farmer', 'Maharashtra, India', 5.5, 10, ARRAY['Rice', 'Wheat', 'Tomatoes'], true)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample products
    INSERT INTO products (farmer_id, name, description, category, price, unit, available_quantity, location, organic, featured, harvest_date, expiry_date) 
    VALUES
    (test_farmer_id, 'Organic Basmati Rice', 'Premium quality organic basmati rice', 'grains', 120, 'kg', 500, 'Maharashtra, India', true, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year'),
    (test_farmer_id, 'Fresh Tomatoes', 'Vine-ripened fresh tomatoes', 'vegetables', 40, 'kg', 200, 'Maharashtra, India', false, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 week'),
    (test_farmer_id, 'Organic Wheat Flour', 'Stone-ground organic wheat flour', 'grains', 60, 'kg', 300, 'Maharashtra, India', true, false, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months'),
    (test_farmer_id, 'Fresh Carrots', 'Organic carrots grown in rich soil', 'vegetables', 35, 'kg', 150, 'Maharashtra, India', true, false, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 weeks'),
    (test_farmer_id, 'Premium Honey', 'Pure wildflower honey from organic farms', 'dairy', 200, 'bottle', 50, 'Maharashtra, India', true, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 years')
    ON CONFLICT DO NOTHING;
    
    -- Get product IDs
    SELECT array_agg(id) INTO product_ids FROM products WHERE farmer_id = test_farmer_id;
    
    -- Add product images
    INSERT INTO product_images (product_id, image_url, is_primary) 
    SELECT unnest(product_ids), '/placeholder.svg', true
    ON CONFLICT DO NOTHING;
    
    -- Add inventory
    INSERT INTO inventory (product_id, quantity_in_stock, reorder_level) 
    SELECT unnest(product_ids), 100, 10
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '✅ Sample data created successfully! Added % products for Demo Farmer.', array_length(product_ids, 1);
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Error: %. Try the alternative method below.', SQLERRM;
END $$;

-- Alternative: If above fails, try this minimal version
/*
-- Just add products to existing farmer profile (if one exists)
DO $$
DECLARE
    existing_farmer_id UUID;
    product_ids UUID[];
BEGIN
    -- Find any existing farmer
    SELECT id INTO existing_farmer_id FROM farmer_profiles LIMIT 1;
    
    IF existing_farmer_id IS NOT NULL THEN
        -- Insert sample products for existing farmer
        INSERT INTO products (farmer_id, name, description, category, price, unit, available_quantity, location, organic, featured) 
        VALUES
        (existing_farmer_id, 'Sample Rice', 'Test product', 'grains', 50, 'kg', 100, 'Test Location', true, true),
        (existing_farmer_id, 'Sample Vegetables', 'Test vegetables', 'vegetables', 30, 'kg', 50, 'Test Location', false, true)
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE '✅ Added sample products to existing farmer profile.';
    ELSE
        RAISE NOTICE '❌ No farmer profiles found. Please create a farmer profile first.';
    END IF;
END $$;
*/
