import { useState } from 'react';
import { DatabaseSetup } from '@/utils/databaseSetup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Database, Copy, ExternalLink } from 'lucide-react';

interface SetupStep {
  step: string;
  success: boolean;
  message: string;
}

interface SetupResult {
  success: boolean;
  steps: SetupStep[];
  message?: string;
  error?: string;
  manualSQL?: string;
  sampleDataSQL?: string;
}

export default function DatabaseSetupComponent() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SetupResult | null>(null);
  const [showSQL, setShowSQL] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const setupResult = await DatabaseSetup.runCompleteSetup();
      setResult(setupResult);
      
      if (!setupResult.success && setupResult.manualSQL) {
        setShowSQL(true);
      }
    } catch (error) {
      setResult({
        success: false,
        steps: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const copySQL = () => {
    if (result?.manualSQL) {
      navigator.clipboard.writeText(result.manualSQL);
    }
  };

  const copySampleDataSQL = () => {
    if (result?.sampleDataSQL) {
      navigator.clipboard.writeText(result.sampleDataSQL);
    }
  };

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/xbwscvdrghtvsfwnaqoo/sql/new', '_blank');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Automated Database Setup
        </CardTitle>
        <CardDescription>
          Set up your database tables and insert sample data automatically.
          If tables don't exist, you'll get SQL to run manually in Supabase Dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Setup Button */}
        <div className="flex gap-4">
          <Button 
            onClick={handleSetup} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Setting up...' : 'Run Database Setup'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              const sampleDataSQL = `-- Add sample data to test your database
-- OPTION 1: Quick test data (bypasses user_id constraint temporarily)
DO $$
DECLARE
    test_profile_id UUID := gen_random_uuid();
    test_farmer_id UUID := gen_random_uuid();
    product_ids UUID[];
BEGIN
    -- Temporarily make user_id nullable for testing
    ALTER TABLE profiles ALTER COLUMN user_id DROP NOT NULL;
    
    -- Insert test profile (without user_id for testing)
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
    
    -- Get inserted product IDs
    SELECT array_agg(id) INTO product_ids FROM products WHERE farmer_id = test_farmer_id;
    
    -- Add product images
    INSERT INTO product_images (product_id, image_url, is_primary) 
    SELECT unnest(product_ids), '/placeholder.svg', true
    ON CONFLICT DO NOTHING;
    
    -- Add inventory records
    INSERT INTO inventory (product_id, quantity_in_stock, reorder_level) 
    SELECT unnest(product_ids), 100, 10
    ON CONFLICT DO NOTHING;
    
    -- Optional: Restore NOT NULL constraint (comment out to keep flexible for testing)
    -- ALTER TABLE profiles ALTER COLUMN user_id SET NOT NULL;
    
    RAISE NOTICE 'Sample data inserted successfully! Created % products.', array_length(product_ids, 1);
END $$;

-- OPTION 2: If you have a real authenticated user
/*
-- First, sign up a user, then get the user ID:
-- SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 3;
-- Replace 'YOUR-USER-UUID-HERE' below with the actual UUID

DO $$
DECLARE
    real_user_id UUID := 'YOUR-USER-UUID-HERE'; -- Replace this!
    test_profile_id UUID := gen_random_uuid();
    test_farmer_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO profiles (id, user_id, role, verification_status) 
    VALUES (test_profile_id, real_user_id, 'farmer', 'verified')
    ON CONFLICT DO NOTHING;
    -- (rest of inserts same as Option 1)
END $$;
*/`;
              
              navigator.clipboard.writeText(sampleDataSQL);
              alert('✅ Fixed Sample Data SQL copied!\\n\\nOption 1: Temporarily removes user_id constraint\\nOption 2: Use real authenticated user\\n\\nRun in Supabase SQL Editor.');
            }}
            className="text-sm"
          >
            🌱 Add Sample Data
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              const quickSQL = `-- QUICK FIX: Add missing tables
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity DECIMAL NOT NULL DEFAULT 1,
  unit_price DECIMAL NOT NULL DEFAULT 0,
  total_price DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT,
  planted_area DECIMAL,
  planting_date DATE,
  crop_status TEXT DEFAULT 'planted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity_in_stock DECIMAL NOT NULL DEFAULT 0,
  reorder_level DECIMAL DEFAULT 10,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Add basic policies (open for testing)
CREATE POLICY "Allow all on product_images" ON product_images FOR ALL USING (true);
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all on order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all on crops" ON crops FOR ALL USING (true);
CREATE POLICY "Allow all on inventory" ON inventory FOR ALL USING (true);`;
              
              navigator.clipboard.writeText(quickSQL);
              alert('✅ Quick Fix SQL copied to clipboard!\\n\\nNext steps:\\n1. Go to Supabase Dashboard → SQL Editor\\n2. Paste and run the SQL\\n3. Refresh this page to test');
            }}
            className="text-sm"
          >
            📋 Quick Fix Missing Tables
          </Button>

          {result?.manualSQL && (
            <Button
              variant="outline"
              onClick={openSupabaseDashboard}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Supabase Dashboard
            </Button>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Overall Status */}
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className="font-medium">
                  {result.message || result.error}
                </AlertDescription>
              </div>
            </Alert>

            {/* Setup Steps */}
            {result.steps.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Setup Steps:</h3>
                {result.steps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {step.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{step.step}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{step.message}</span>
                      <Badge variant={step.success ? "secondary" : "destructive"}>
                        {step.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Manual SQL Instructions */}
            {result.manualSQL && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Manual Setup Required</h3>
                  <Button variant="outline" size="sm" onClick={copySQL}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy SQL
                  </Button>
                </div>
                
                <Alert>
                  <AlertDescription>
                    <strong>Step 1:</strong> Copy the SQL below<br/>
                    <strong>Step 2:</strong> Open Supabase Dashboard → SQL Editor<br/>
                    <strong>Step 3:</strong> Paste and run the SQL<br/>
                    <strong>Step 4:</strong> Come back and run setup again
                  </AlertDescription>
                </Alert>

                {showSQL && (
                  <div className="relative">
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                      <code>{result.manualSQL}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Sample Data SQL */}
            {result?.sampleDataSQL && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-yellow-700">Sample Data (Optional)</h3>
                  <Button variant="outline" size="sm" onClick={copySampleDataSQL}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Sample Data SQL
                  </Button>
                </div>
                
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">
                    <strong>Optional:</strong> Add sample data for testing<br/>
                    <strong>Step 1:</strong> Copy the SQL below<br/>
                    <strong>Step 2:</strong> Replace UUIDs with real user IDs<br/>
                    <strong>Step 3:</strong> Run in Supabase SQL Editor
                  </AlertDescription>
                </Alert>

                {showSQL && (
                  <div className="relative">
                    <pre className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                      <code>{result.sampleDataSQL}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            {result.success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>Success!</strong> Your database is now ready. 
                  You can refresh the page to see the products showcase working with real data.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">What this setup does:</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Checks if required database tables exist</li>
            <li>• Provides SQL to create tables if they're missing</li>
            <li>• Creates a sample farmer profile for testing</li>
            <li>• Inserts sample products (Rice, Tomatoes, Wheat Flour)</li>
            <li>• Enables you to test the app with real data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
