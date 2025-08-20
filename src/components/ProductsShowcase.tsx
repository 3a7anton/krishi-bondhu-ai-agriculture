import { useEffect, useState } from 'react';
import { ProductsAPI } from '@/services/productsApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Star, MapPin, Calendar } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  location: string;
  organic: boolean;
  available_quantity: number;
  farmer_profiles: {
    full_name: string;
    farm_location: string;
    organic_certified: boolean;
  };
  product_images?: {
    image_url: string;
    is_primary: boolean;
  }[];
}

export default function ProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await ProductsAPI.getFeaturedProducts(6);
        
        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          setError(result.error?.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading fresh products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-gray-500">
          Note: Make sure the database migrations have been applied. 
          See MIGRATION_GUIDE.md for instructions.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">No products available yet.</p>
        <p className="text-sm text-gray-500">
          Products will appear here once farmers start listing their produce.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Fresh from the Farm
        </h2>
        <p className="text-gray-600">
          Discover fresh, quality produce directly from verified farmers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              {product.product_images?.[0]?.image_url ? (
                <img
                  src={product.product_images[0].image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Calendar className="h-12 w-12" />
                </div>
              )}
              
              <div className="absolute top-2 right-2 flex gap-1">
                {product.organic && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Organic
                  </Badge>
                )}
              </div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    ₹{product.price}
                  </div>
                  <div className="text-xs text-gray-500">
                    per {product.unit}
                  </div>
                </div>
              </div>
              
              <CardDescription className="text-sm">
                {product.description?.slice(0, 100)}
                {product.description && product.description.length > 100 && '...'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.farmer_profiles.farm_location}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Farmer:</span>
                  <span className="ml-1">{product.farmer_profiles.full_name}</span>
                  {product.farmer_profiles.organic_certified && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Certified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Available:</span>
                  <span className="ml-1">{product.available_quantity} {product.unit}</span>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg">
          View All Products
        </Button>
      </div>
    </div>
  );
}
