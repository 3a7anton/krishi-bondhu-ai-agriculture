import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Truck, Shield, ArrowRight } from "lucide-react";

const CustomerAccess = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              🛒 Ready to Shop Fresh?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Access our e-commerce platform and browse fresh produce directly from verified farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover-lift shadow-fresh">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Browse Products</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Explore fresh produce from verified farmers with quality guarantees
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift shadow-fresh">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get your fresh produce delivered to your doorstep with real-time tracking
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift shadow-fresh">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Quality Assured</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All products are verified and quality-checked before delivery
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-fresh hover-lift group"
              asChild
            >
              <a href="/customer/dashboard">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Access Customer Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              No registration required to browse products
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerAccess; 