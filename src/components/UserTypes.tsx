import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tractor, ShoppingBag, Building2, Truck, ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const UserTypes = () => {
  const [selectedUserType, setSelectedUserType] = useState("");
  const userTypes = [
    {
      value: "farmers",
      icon: Tractor,
      title: "Farmers",
      bengali: "কৃষক",
      description: "Grow smarter with AI-powered insights, direct market access, and community support",
      features: ["Crop planning assistance", "Direct sales platform", "Weather alerts", "Expert guidance"],
      cta: "Start Farming Smart",
      bgColor: "bg-fresh/10",
      hoverColor: "hover:bg-fresh/20",
      link: "/auth/login"
    },
    {
      value: "customers",
      icon: ShoppingBag,
      title: "Customers",
      bengali: "ক্রেতা",
      description: "Get fresh, quality produce directly from verified farmers at fair prices",
      features: ["Farm-fresh produce", "Verified farmers", "Quality guarantee", "Home delivery"],
      cta: "Shop Fresh Now",
      bgColor: "bg-primary/10",
      hoverColor: "hover:bg-primary/20",
      link: "/auth/login"
    },
    {
      value: "warehouses",
      icon: Building2,
      title: "Warehouses",
      bengali: "গুদাম",
      description: "Optimize storage and inventory management with modern agricultural technology",
      features: ["Inventory tracking", "Quality monitoring", "Storage optimization", "Partner network"],
      cta: "Manage Warehouse",
      bgColor: "bg-earth/10",
      hoverColor: "hover:bg-earth/20",
      link: "/auth/login"
    },
    {
      value: "delivery",
      icon: Truck,
      title: "Delivery Partners",
      bengali: "ডেলিভারি পার্টনার",
      description: "Be part of the fresh food supply chain and earn while serving the community",
      features: ["Flexible schedules", "Fair compensation", "Route optimization", "Support system"],
      cta: "Start Delivering",
      bgColor: "bg-secondary/10",
      hoverColor: "hover:bg-secondary/20",
      link: "/auth/login"
    },
    {
      value: "admin",
      icon: Crown,
      title: "Admin Panel",
      bengali: "অ্যাডমিন প্যানেল",
      description: "Comprehensive platform management with advanced analytics and control features",
      features: ["User management", "Analytics dashboard", "System monitoring", "Platform control"],
      cta: "Admin Dashboard",
      bgColor: "bg-yellow-500/10",
      hoverColor: "hover:bg-yellow-500/20",
      link: "/auth/login"
    }
  ];

  const selectedUser = userTypes.find(type => type.value === selectedUserType);

  return (
    <section id="users" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Built for
            <span className="text-primary ml-3">Everyone</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            KrishiBondhu connects all stakeholders in the agricultural ecosystem, 
            creating value for farmers, customers, warehouses, and delivery partners
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          {/* User Type Selection Dropdown */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground mb-4">
                Choose Your Role
              </CardTitle>
              <CardDescription className="text-lg">
                Select how you want to use KrishiBondhu
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  I am a...
                </label>
                <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                  <SelectTrigger className="w-full h-14 text-lg">
                    <SelectValue placeholder="Select your role to get started" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="h-16">
                        <div className="flex items-center space-x-3">
                          <type.icon className="w-6 h-6 text-primary" />
                          <div className="text-left">
                            <div className="font-medium">{type.title}</div>
                            <div className="text-sm text-muted-foreground font-bengali">{type.bengali}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected User Type Details */}
              {selectedUser && (
                <div className={`p-6 rounded-lg border transition-all duration-300 ${selectedUser.bgColor}`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-fresh">
                      <selectedUser.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedUser.title}</h3>
                      <p className="text-primary font-bengali">{selectedUser.bengali}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {selectedUser.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-medium text-foreground">What you get:</h4>
                    <ul className="space-y-2">
                      {selectedUser.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to={selectedUser.link}>
                    <Button className="w-full shadow-fresh" size="lg">
                      {selectedUser.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}

              {!selectedUser && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select your role above to see personalized features and get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">Trusted by Thousands</h3>
            <p className="text-muted-foreground">Join our growing community of verified users</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-sm text-muted-foreground">Quality Verified</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-fresh/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔒</span>
              </div>
              <p className="text-sm text-muted-foreground">Secure Payments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <p className="text-sm text-muted-foreground">Fast Delivery</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-earth/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💚</span>
              </div>
              <p className="text-sm text-muted-foreground">Eco-Friendly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTypes;