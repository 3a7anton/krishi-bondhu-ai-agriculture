import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tractor, ShoppingBag, Building2, Truck, ArrowRight, Leaf } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const userTypes = [
    {
      id: 'farmer',
      value: 'farmer',
      icon: Tractor,
      title: "Farmer",
      bengali: "কৃষক",
      description: "Grow smarter with AI-powered insights, direct market access, and community support",
      benefits: ["Smart crop suggestions", "Direct sales platform", "Weather alerts", "Expert guidance"],
      color: "bg-fresh/10 hover:bg-fresh/20 border-fresh/30"
    },
    {
      id: 'customer',
      value: 'customer',
      icon: ShoppingBag,
      title: "Customer",
      bengali: "ক্রেতা",
      description: "Get fresh, quality produce directly from verified farmers at fair prices",
      benefits: ["Farm-fresh produce", "Verified farmers", "Quality guarantee", "Home delivery"],
      color: "bg-primary/10 hover:bg-primary/20 border-primary/30"
    },
    {
      id: 'warehouse',
      value: 'warehouse',
      icon: Building2,
      title: "Warehouse",
      bengali: "গুদাম",
      description: "Optimize storage and inventory management with modern agricultural technology",
      benefits: ["Inventory tracking", "Quality monitoring", "Storage optimization", "Partner network"],
      color: "bg-earth/10 hover:bg-earth/20 border-earth/30"
    },
    {
      id: 'delivery_partner',
      value: 'delivery_partner',
      icon: Truck,
      title: "Delivery Partner",
      bengali: "ডেলিভারি পার্টনার",
      description: "Be part of the fresh food supply chain and earn while serving the community",
      benefits: ["Flexible schedules", "Fair compensation", "Route optimization", "Support system"],
      color: "bg-secondary/10 hover:bg-secondary/20 border-secondary/30"
    }
  ];

  const selectedUser = userTypes.find(type => type.id === selectedRole);

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/auth/register?role=${selectedRole}`);
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 to-primary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">KrishiBondhu</h1>
            <span className="ml-2 text-sm text-muted-foreground font-bengali">কৃষিবন্ধু</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Choose Your Role
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the option that best describes you to get started with KrishiBondhu
          </p>
        </div>

        {/* Role Selection Dropdown */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-card border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground mb-4">
                Choose Your Role
              </CardTitle>
              <CardDescription className="text-lg">
                Select how you want to use KrishiBondhu to get started
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  I am a...
                </label>
                <Select value={selectedRole || ""} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full h-14 text-lg">
                    <SelectValue placeholder="Select your role to continue" />
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

              {/* Selected Role Details */}
              {selectedUser && (
                <div className={`p-6 rounded-lg border transition-all duration-300 ${selectedUser.color}`}>
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
                      {selectedUser.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    size="lg"
                    onClick={handleContinue}
                    className="w-full shadow-fresh"
                  >
                    Continue as {selectedUser.title}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {!selectedUser && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select your role above to see personalized features and continue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" onClick={() => navigate('/auth/login')} className="p-0 h-auto text-primary">
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;