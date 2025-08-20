-- CORE DATABASE SETUP - ESSENTIAL TABLES ONLY
-- Run this first to get basic functionality working

-- Step 1: Create enums (if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'customer', 'warehouse', 'delivery_partner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_category AS ENUM ('grains', 'vegetables', 'fruits', 'pulses', 'spices', 'dairy', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create missing tables (only if they don't exist)

-- Product Images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL NOT NULL CHECK (total_amount > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  contact_phone TEXT,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'upi', 'net_banking')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  delivery_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL NOT NULL CHECK (unit_price > 0),
  total_price DECIMAL NOT NULL CHECK (total_price > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crops table
CREATE TABLE IF NOT EXISTS crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT,
  planted_area DECIMAL CHECK (planted_area > 0),
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  expected_yield DECIMAL,
  actual_yield DECIMAL,
  crop_status TEXT DEFAULT 'planted' CHECK (crop_status IN ('planned', 'planted', 'growing', 'harvested', 'sold')),
  season TEXT CHECK (season IN ('kharif', 'rabi', 'zaid')),
  irrigation_method TEXT,
  fertilizer_used TEXT[],
  pesticide_used TEXT[],
  organic_certified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity_in_stock DECIMAL NOT NULL DEFAULT 0,
  reserved_quantity DECIMAL DEFAULT 0,
  reorder_level DECIMAL DEFAULT 10,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  location TEXT,
  batch_number TEXT,
  expiry_date DATE,
  quality_grade TEXT CHECK (quality_grade IN ('A', 'B', 'C')),
  storage_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Enable RLS for new tables
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
CREATE POLICY "Anyone can view product images" ON product_images FOR SELECT USING (true);

CREATE POLICY "Farmers can manage own product images" ON product_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products 
    JOIN farmer_profiles ON farmer_profiles.id = products.farmer_id
    JOIN profiles ON profiles.id = farmer_profiles.profile_id 
    WHERE products.id = product_images.product_id AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = orders.customer_id AND profiles.user_id = auth.uid())
);

CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = orders.customer_id AND profiles.user_id = auth.uid())
);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    JOIN profiles ON profiles.id = orders.customer_id 
    WHERE orders.id = order_items.order_id AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Farmers can view own crops" ON crops FOR ALL USING (
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    JOIN profiles ON profiles.id = farmer_profiles.profile_id 
    WHERE farmer_profiles.id = crops.farmer_id AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Farmers can view own inventory" ON inventory FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products 
    JOIN farmer_profiles ON farmer_profiles.id = products.farmer_id
    JOIN profiles ON profiles.id = farmer_profiles.profile_id 
    WHERE products.id = inventory.product_id AND profiles.user_id = auth.uid()
  )
);

-- Step 5: Insert sample data
DO $$
DECLARE
    test_profile_id UUID := gen_random_uuid();
    test_farmer_id UUID := gen_random_uuid();
    product_ids UUID[];
BEGIN
    -- Temporarily disable RLS for initial data seeding
    ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
    ALTER TABLE farmer_profiles DISABLE ROW LEVEL SECURITY;
    ALTER TABLE products DISABLE ROW LEVEL SECURITY;
    ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
    ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
    
    -- Insert test profile (without user_id since no auth user exists)
    INSERT INTO profiles (id, role, verification_status) 
    VALUES (test_profile_id, 'farmer', 'verified')
    ON CONFLICT DO NOTHING;
    
    -- Insert farmer profile
    INSERT INTO farmer_profiles (id, profile_id, full_name, farm_location, land_area_acres, farming_experience_years, crops_grown, organic_certified)
    VALUES (test_farmer_id, test_profile_id, 'Demo Farmer', 'Maharashtra, India', 5.5, 10, ARRAY['Rice', 'Wheat', 'Tomatoes'], true)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample products and collect IDs
    INSERT INTO products (farmer_id, name, description, category, price, unit, available_quantity, location, organic, featured, harvest_date, expiry_date) 
    VALUES
    (test_farmer_id, 'Organic Basmati Rice', 'Premium quality organic basmati rice grown without pesticides', 'grains', 120, 'kg', 500, 'Maharashtra, India', true, true, '2025-08-15', '2026-08-15'),
    (test_farmer_id, 'Fresh Tomatoes', 'Vine-ripened fresh tomatoes, perfect for cooking', 'vegetables', 40, 'kg', 200, 'Maharashtra, India', false, true, '2025-08-18', '2025-08-25'),
    (test_farmer_id, 'Organic Wheat Flour', 'Stone-ground organic wheat flour, rich in nutrients', 'grains', 60, 'kg', 300, 'Maharashtra, India', true, false, '2025-08-10', '2026-02-10'),
    (test_farmer_id, 'Fresh Carrots', 'Organic carrots grown in rich soil', 'vegetables', 35, 'kg', 150, 'Maharashtra, India', true, false, '2025-08-19', '2025-09-19'),
    (test_farmer_id, 'Premium Honey', 'Pure wildflower honey from organic farms', 'dairy', 200, 'bottle', 50, 'Maharashtra, India', true, true, '2025-08-01', '2027-08-01')
    ON CONFLICT DO NOTHING;
    
    -- Get product IDs and insert images/inventory
    SELECT array_agg(id) INTO product_ids FROM products WHERE farmer_id = test_farmer_id;
    
    -- Insert product images
    INSERT INTO product_images (product_id, image_url, is_primary) 
    SELECT unnest(product_ids), '/placeholder.svg', true
    ON CONFLICT DO NOTHING;
    
    -- Insert inventory records
    INSERT INTO inventory (product_id, quantity_in_stock, reorder_level, quality_grade, storage_conditions)
    SELECT unnest(product_ids), 100, 10, 'A', 'Cool and dry place'
    ON CONFLICT DO NOTHING;
    
    -- Re-enable RLS
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
    ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'Database setup completed successfully!';
END $$;
