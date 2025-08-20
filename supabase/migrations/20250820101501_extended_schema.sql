-- =====================================================
-- KrishiBondhu Extended Database Schema Migration
-- This extends the existing basic schema with full business logic
-- =====================================================

-- Create additional enums
CREATE TYPE public.product_category AS ENUM ('grains', 'vegetables', 'fruits', 'pulses', 'spices', 'dairy', 'other');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE public.delivery_status AS ENUM ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed');

-- ===================
-- PRODUCTS SYSTEM
-- ===================

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  unit VARCHAR(20) NOT NULL DEFAULT 'kg',
  available_quantity DECIMAL(10,2) NOT NULL,
  minimum_order DECIMAL(10,2) DEFAULT 1,
  harvest_date DATE,
  expiry_date DATE,
  organic BOOLEAN DEFAULT false,
  location TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product images table
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===================
-- ORDERS SYSTEM
-- ===================

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  delivery_status delivery_status DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_date DATE,
  special_instructions TEXT,
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  delivery_partner_id UUID REFERENCES public.delivery_partner_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===================
-- WAREHOUSE SYSTEM
-- ===================

-- Inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  warehouse_id UUID NOT NULL REFERENCES public.warehouse_profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_stored DECIMAL(10,2) NOT NULL DEFAULT 0,
  reserved_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  storage_fee_per_kg DECIMAL(10,2) DEFAULT 0,
  arrival_date DATE,
  expiry_date DATE,
  quality_grade VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(warehouse_id, product_id)
);

-- Storage transactions table
CREATE TABLE public.storage_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL, -- 'arrival', 'pickup', 'adjustment'
  quantity DECIMAL(10,2) NOT NULL,
  reference_order_id UUID REFERENCES public.orders(id),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===================
-- DELIVERY SYSTEM
-- ===================

-- Delivery routes table
CREATE TABLE public.delivery_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_partner_id UUID NOT NULL REFERENCES public.delivery_partner_profiles(id) ON DELETE CASCADE,
  route_name VARCHAR(255) NOT NULL,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  estimated_duration INTEGER, -- in minutes
  estimated_distance DECIMAL(10,2), -- in km
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Delivery tracking table
CREATE TABLE public.delivery_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  delivery_partner_id UUID REFERENCES public.delivery_partner_profiles(id),
  current_status delivery_status NOT NULL,
  location_lat DECIMAL(10,6),
  location_lng DECIMAL(10,6),
  location_address TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===================
-- AGRICULTURAL DATA
-- ===================

-- Crops master data
CREATE TABLE public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  season VARCHAR(50), -- 'rabi', 'kharif', 'zaid'
  planting_season VARCHAR(100),
  harvest_season VARCHAR(100),
  water_requirement VARCHAR(50), -- 'low', 'medium', 'high'
  soil_type TEXT[],
  climate_requirements TEXT,
  growing_tips TEXT,
  common_diseases TEXT[],
  common_pests TEXT[],
  nutritional_info JSONB,
  market_price_range JSONB, -- {min: number, max: number, unit: string}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weather data table
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  wind_speed DECIMAL(5,2),
  precipitation DECIMAL(5,2),
  condition VARCHAR(100),
  forecast_data JSONB, -- 7-day forecast
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Market prices table
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID REFERENCES public.crops(id),
  market_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL DEFAULT 'kg',
  quality_grade VARCHAR(20),
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  source VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===================
-- MESSAGING SYSTEM
-- ===================

-- Messages table for farmer-customer communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===================
-- REVIEWS & RATINGS
-- ===================

-- Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===================
-- NOTIFICATIONS
-- ===================

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'order', 'delivery', 'weather', 'system'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- additional data like order_id, etc.
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===================
-- INDEXES FOR PERFORMANCE
-- ===================

-- Product indexes
CREATE INDEX idx_products_farmer_id ON public.products(farmer_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_location ON public.products(location);

-- Order indexes
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_delivery_partner ON public.orders(delivery_partner_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- Inventory indexes
CREATE INDEX idx_inventory_warehouse_id ON public.inventory(warehouse_id);
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);

-- Weather indexes
CREATE INDEX idx_weather_location ON public.weather_data(location);
CREATE INDEX idx_weather_recorded_at ON public.weather_data(recorded_at);

-- Market prices indexes
CREATE INDEX idx_market_prices_crop_id ON public.market_prices(crop_id);
CREATE INDEX idx_market_prices_location ON public.market_prices(location);
CREATE INDEX idx_market_prices_date ON public.market_prices(date_recorded);

-- Messages indexes
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_order ON public.messages(order_id);

-- Reviews indexes
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_farmer_id ON public.reviews(farmer_id);
CREATE INDEX idx_reviews_customer_id ON public.reviews(customer_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_read ON public.notifications(read_at);

-- ===================
-- ENABLE RLS ON NEW TABLES
-- ===================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ===================
-- RLS POLICIES
-- ===================

-- Products policies
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Farmers can manage their own products" ON public.products FOR ALL USING (
  farmer_id IN (SELECT id FROM public.farmer_profiles WHERE profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ))
);

-- Orders policies
CREATE POLICY "Customers can view their own orders" ON public.orders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customer_profiles WHERE profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ))
);
CREATE POLICY "Farmers can view orders for their products" ON public.orders FOR SELECT USING (
  id IN (SELECT DISTINCT order_id FROM public.order_items oi 
         JOIN public.products p ON oi.product_id = p.id 
         WHERE p.farmer_id IN (
           SELECT id FROM public.farmer_profiles WHERE profile_id IN (
             SELECT id FROM public.profiles WHERE user_id = auth.uid()
           )
         ))
);
CREATE POLICY "Delivery partners can view assigned orders" ON public.orders FOR SELECT USING (
  delivery_partner_id IN (SELECT id FROM public.delivery_partner_profiles WHERE profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ))
);

-- Inventory policies
CREATE POLICY "Warehouses can manage their own inventory" ON public.inventory FOR ALL USING (
  warehouse_id IN (SELECT id FROM public.warehouse_profiles WHERE profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ))
);

-- Messages policies
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (
  sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  receiver_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
  sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews" ON public.reviews FOR INSERT WITH CHECK (
  customer_id IN (SELECT id FROM public.customer_profiles WHERE profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ))
);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR ALL USING (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Public access policies for reference data
CREATE POLICY "Anyone can view crops data" ON public.crops FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view weather data" ON public.weather_data FOR SELECT USING (true);
CREATE POLICY "Anyone can view market prices" ON public.market_prices FOR SELECT USING (true);

-- ===================
-- FUNCTIONS
-- ===================

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Function to update product quantity after order
CREATE OR REPLACE FUNCTION public.update_product_quantity_after_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products 
  SET available_quantity = available_quantity - NEW.quantity,
      updated_at = NOW()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product quantity
CREATE TRIGGER update_product_quantity_trigger
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_quantity_after_order();

-- Function to calculate farmer rating
CREATE OR REPLACE FUNCTION public.calculate_farmer_rating(farmer_profile_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating
  FROM public.reviews 
  WHERE farmer_id = farmer_profile_id;
  
  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- ===================
-- TRIGGERS FOR UPDATED_AT
-- ===================

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
