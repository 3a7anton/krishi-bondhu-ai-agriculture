import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ProductsAPI } from '../services/productsApi';
import { supabase } from '../integrations/supabase/client';

export const DatabaseTestComponent = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      // Test multiple things
      const [productsResult, tablesCheck] = await Promise.all([
        ProductsAPI.getProducts({ limit: 5 }),
        checkAllTables()
      ]);

      setTestResult({
        success: productsResult.success,
        productsCount: productsResult.data?.length || 0,
        error: productsResult.error?.message,
        sampleProduct: productsResult.data?.[0] || null,
        tables: tablesCheck
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAllTables = async () => {
    const tables = ['profiles', 'farmer_profiles', 'products', 'product_images', 'orders', 'order_items', 'crops', 'inventory'];
    const results: Record<string, boolean> = {};
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table as any).select('id').limit(1);
        results[table] = !error;
      } catch {
        results[table] = false;
      }
    }
    return results;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Complete Database Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button onClick={runTest} disabled={loading}>
            {loading ? 'Testing...' : 'Run Complete Test'}
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => {
              const workingSQL = `-- WORKING SAMPLE DATA FIX
ALTER TABLE profiles ALTER COLUMN user_id DROP NOT NULL;

DO $$
DECLARE
    test_profile_id UUID := gen_random_uuid();
    test_farmer_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO profiles (id, role, verification_status) 
    VALUES (test_profile_id, 'farmer', 'verified');
    
    INSERT INTO farmer_profiles (id, profile_id, full_name, farm_location, land_area_acres, farming_experience_years, crops_grown, organic_certified)
    VALUES (test_farmer_id, test_profile_id, 'Demo Farmer', 'Maharashtra, India', 5.5, 10, ARRAY['Rice', 'Wheat', 'Tomatoes'], true);
    
    INSERT INTO products (farmer_id, name, description, category, price, unit, available_quantity, location, organic, featured) 
    VALUES
    (test_farmer_id, 'Organic Basmati Rice', 'Premium quality organic basmati rice', 'grains', 120, 'kg', 500, 'Maharashtra, India', true, true),
    (test_farmer_id, 'Fresh Tomatoes', 'Vine-ripened fresh tomatoes', 'vegetables', 40, 'kg', 200, 'Maharashtra, India', false, true),
    (test_farmer_id, 'Organic Wheat Flour', 'Stone-ground organic wheat flour', 'grains', 60, 'kg', 300, 'Maharashtra, India', true, false);
    
    INSERT INTO product_images (product_id, image_url, is_primary) 
    SELECT id, '/placeholder.svg', true FROM products WHERE farmer_id = test_farmer_id;
    
    RAISE NOTICE 'SUCCESS: Sample data created!';
END $$;`;

              navigator.clipboard.writeText(workingSQL);
              alert('✅ WORKING Sample Data SQL copied!\\n\\nThis fixes the user_id constraint issue.\\nPaste in Supabase SQL Editor and run.');
            }}
          >
            🚀 Fix & Add Data
          </Button>
        </div>
        
        {testResult && (
          <div className="space-y-4">
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <strong>API Status:</strong> {testResult.success ? '✅ Success' : '❌ Failed'}
              {testResult.success && (
                <div className="mt-2">
                  <strong>Products Found:</strong> {testResult.productsCount}
                  {testResult.sampleProduct && (
                    <div className="text-sm mt-1">
                      <strong>Sample:</strong> {testResult.sampleProduct.name} - ₹{testResult.sampleProduct.price}/{testResult.sampleProduct.unit}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {testResult.tables && (
              <div className="bg-blue-50 p-4 rounded">
                <strong>📊 Table Status:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  {Object.entries(testResult.tables).map(([table, exists]) => (
                    <div key={table} className="flex justify-between">
                      <span>{table}:</span>
                      <span className={exists ? 'text-green-600' : 'text-red-600'}>
                        {exists ? '✅' : '❌'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {testResult.error && (
              <div className="bg-red-50 text-red-800 p-4 rounded">
                <strong>Error:</strong> {testResult.error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
