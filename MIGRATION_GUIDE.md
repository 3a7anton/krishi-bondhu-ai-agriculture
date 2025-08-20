# Krishi Bondhu Database Migration Guide

## Phase 1: Database Schema Setup

Since the Supabase CLI requires local Docker setup which isn't available, we need to apply the database migrations manually through the Supabase Dashboard.

### Steps to Apply Migrations:

1. **Login to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login with your credentials
   - Select your project: `xbwscvdrghtvsfwnaqoo`

2. **Open SQL Editor**
   - Navigate to: SQL Editor tab in the left sidebar
   - Click "New Query"

3. **Apply Extended Schema Migration**
   - Copy the contents of: `supabase/migrations/20250820101501_extended_schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute the migration
   - This will create all the new tables, functions, and policies

4. **Apply Seed Data Migration**
   - Copy the contents of: `supabase/migrations/20250820101502_seed_data.sql`
   - Paste into a new SQL Editor query
   - Click "Run" to execute the seed data
   - This will populate the database with sample data

### Verification Steps:

After applying both migrations, verify the setup:

1. **Check Tables Created**
   - Go to: Database > Tables
   - Verify these tables exist:
     - crops
     - products
     - orders
     - order_items
     - inventory
     - delivery_tracking
     - delivery_routes
     - delivery_partner_profiles
     - warehouse_profiles
     - customer_profiles
     - farmer_profiles
     - product_images
     - reviews
     - notifications
     - messages
     - storage_transactions
     - market_prices
     - weather_data
     - verification_documents

2. **Check Row Level Security (RLS)**
   - Each table should have RLS enabled
   - Policies should be created for each user role

3. **Check Functions**
   - `calculate_farmer_rating(farmer_profile_id)`
   - `generate_order_number()`

4. **Test API Connection**
   - Use the test page: http://localhost:8081/test-connection
   - Click "Test Database Connection & Migrations"
   - Check browser console for results

### Database Schema Overview:

#### Core Tables:
- **profiles**: User profiles with roles (farmer, customer, warehouse, delivery_partner)
- **farmer_profiles**: Extended farmer information
- **customer_profiles**: Customer delivery and preference data
- **warehouse_profiles**: Warehouse facility information
- **delivery_partner_profiles**: Delivery partner vehicle/route data

#### Business Logic Tables:
- **products**: Products listed by farmers
- **orders**: Customer orders with status tracking
- **order_items**: Individual items within orders
- **inventory**: Products stored in warehouses
- **delivery_tracking**: Real-time delivery status and location

#### Supporting Tables:
- **crops**: Crop information and growing recommendations
- **market_prices**: Real-time market price data
- **weather_data**: Weather information for farming decisions
- **reviews**: Product and farmer reviews
- **notifications**: System notifications for users
- **messages**: Inter-user messaging system

#### Security Features:
- Row Level Security (RLS) on all tables
- User-specific data isolation
- Role-based access control
- Secure API endpoints

### Next Steps After Migration:

1. **Test API Connectivity**
   - Verify all API services work correctly
   - Check data retrieval and insertion

2. **Update Frontend Components**
   - Replace mock data with real API calls
   - Implement proper error handling

3. **User Authentication Flow**
   - Test signup/login with role creation
   - Verify profile creation for each user type

4. **Data Integration**
   - Replace all dummy data components
   - Implement real-time features

### Troubleshooting:

If migration fails:
1. Check for syntax errors in SQL
2. Ensure proper permissions on database
3. Verify tables don't already exist
4. Check Supabase project quotas

If API calls fail:
1. Verify environment variables are set correctly
2. Check RLS policies allow access
3. Ensure user is authenticated
4. Check network connectivity

### Files Updated:
- `src/integrations/supabase/types.ts` - Updated with new schema types
- `src/services/productsApi.ts` - Product CRUD operations
- `src/services/ordersApi.ts` - Order management
- `src/services/farmerApi.ts` - Farmer-specific operations
- `src/contexts/AuthContext.tsx` - Updated with profile management

### Migration Files:
- `supabase/migrations/20250820101501_extended_schema.sql` - Complete database schema
- `supabase/migrations/20250820101502_seed_data.sql` - Sample data for testing
