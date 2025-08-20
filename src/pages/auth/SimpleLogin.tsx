import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Mail, Lock, Eye, EyeOff, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SimpleLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔐 Attempting login for:', formData.email);
      
      // Direct Supabase auth call
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        console.error('❌ Login error:', error);
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('✅ Login successful:', data.user.email);
        
        toast({
          title: "Welcome back!",
          description: "Login successful. Redirecting...",
        });

        // Immediate routing based on email pattern - don't wait for profile
        const email = formData.email.toLowerCase();
        
        // Route immediately without waiting
        if (email.includes('farmer')) {
          console.log('🚜 Redirecting to farmer dashboard');
          navigate('/farmer/dashboard');
        } else if (email.includes('customer')) {
          console.log('🛒 Redirecting to customer dashboard');
          navigate('/customer/dashboard');
        } else if (email.includes('delivery')) {
          console.log('🚚 Redirecting to delivery dashboard');
          navigate('/delivery/dashboard');
        } else if (email.includes('warehouse')) {
          console.log('🏪 Redirecting to warehouse dashboard');
          navigate('/warehouse/dashboard');
        } else if (email.includes('admin')) {
          console.log('👤 Redirecting to admin dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('📊 Redirecting to general dashboard');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('💥 Unexpected error:', err);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 to-primary/5 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div className="flex items-center">
                <Leaf className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl font-bold text-foreground">KrishiBondhu</h1>
                <span className="ml-2 text-sm text-muted-foreground font-bengali">কৃষিবন্ধু</span>
              </div>
              <div className="w-20"></div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Simple Login (Debug Mode)
            </h2>
            <p className="text-muted-foreground">
              Direct authentication bypass for testing
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-fresh">
            <CardHeader>
              <CardTitle className="text-center">Debug Sign In</CardTitle>
              <CardDescription className="text-center">
                Simplified login for troubleshooting
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="farmer@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="admin1234"
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Test Buttons */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground text-center mb-2">Quick Test Credentials:</div>
                  
                  {/* Farmers */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'farmer@example.com', password: 'admin1234' })}
                    >
                      🚜 Farmer 1
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'farmer2@example.com', password: 'admin1234' })}
                    >
                      🌾 Farmer 2
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'farmer3@example.com', password: 'admin1234' })}
                    >
                      🌽 Farmer 3
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'farmer4@example.com', password: 'admin1234' })}
                    >
                      🥕 Farmer 4
                    </Button>
                  </div>

                  {/* Customers */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'customer@example.com', password: 'admin1234' })}
                    >
                      🛒 Customer 1
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'customer2@example.com', password: 'admin1234' })}
                    >
                      🛍️ Customer 2
                    </Button>
                  </div>

                  {/* Other Roles */}
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'delivery@example.com', password: 'admin1234' })}
                    >
                      🚚 Delivery
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'warehouse@example.com', password: 'admin1234' })}
                    >
                      🏭 Warehouse
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setFormData({ email: 'admin@example.com', password: 'admin1234' })}
                    >
                      👑 Admin
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Debug Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Debug Info */}
          <div className="mt-6 text-center">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Debug Mode: Bypasses AuthContext</p>
              <p>Check browser console for detailed logs</p>
              <p>All test users use password: admin1234</p>
              <p className="text-xs text-primary mt-2">
                Available: 4 Farmers • 2 Customers • 1 Delivery • 1 Warehouse • 1 Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
