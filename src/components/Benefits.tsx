import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Leaf, TrendingUp, Heart, Shield, Clock } from "lucide-react";
import freshProduceImage from "@/assets/fresh-produce.jpg";
import warehouseImage from "@/assets/warehouse.jpg";
import farmerSuccessImage from "@/assets/farmer-success.jpg";

const Benefits = () => {
  const benefits = [
    {
      icon: Leaf,
      title: "100% Farm Fresh",
      description: "Direct from farm to your table, ensuring maximum freshness and quality"
    },
    {
      icon: TrendingUp,
      title: "Better Profits for Farmers",
      description: "Eliminate middlemen and get fair prices for your hard work"
    },
    {
      icon: Heart,
      title: "Healthier Communities",
      description: "Access to nutritious, organic produce for healthier lifestyles"
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Verified farmers and rigorous quality checks ensure the best products"
    },
    {
      icon: Clock,
      title: "Time Efficient",
      description: "Streamlined processes save time for both farmers and customers"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-accent/30 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            The
            <span className="text-primary ml-3">KrishiBondhu</span>
            Difference
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the transformation of agriculture through technology, community, and sustainable practices
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Benefits List */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-foreground mb-8">
              Why Choose KrishiBondhu?
            </h3>
            
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-fresh">
              <img
                src={freshProduceImage}
                alt="Fresh colorful vegetables and fruits showcasing farm-to-table quality"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <Card className="absolute -bottom-6 -left-6 bg-card/95 backdrop-blur-sm shadow-fresh border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </CardContent>
            </Card>
            
            <Card className="absolute -top-6 -right-6 bg-card/95 backdrop-blur-sm shadow-fresh border-secondary/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">24hrs</div>
                <div className="text-sm text-muted-foreground">Farm to Table</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Process Flow */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            From Farm to Your Table
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <img
                  src={farmerSuccessImage}
                  alt="Happy farmer with fresh harvest"
                  className="w-48 h-48 rounded-full object-cover mx-auto shadow-fresh group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-fresh">
                  <span className="text-white font-bold">1</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Farm Fresh Harvest</h4>
              <p className="text-muted-foreground">Farmers harvest premium quality produce using sustainable farming practices</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <img
                  src={warehouseImage}
                  alt="Modern warehouse with quality storage"
                  className="w-48 h-48 rounded-full object-cover mx-auto shadow-fresh group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-warm">
                  <span className="text-white font-bold">2</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Quality Processing</h4>
              <p className="text-muted-foreground">Advanced storage and quality checks ensure freshness and safety standards</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-48 h-48 rounded-full bg-fresh/10 flex items-center justify-center mx-auto shadow-fresh group-hover:scale-105 transition-transform">
                  <Heart className="w-24 h-24 text-fresh" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-fresh rounded-full flex items-center justify-center shadow-fresh">
                  <span className="text-white font-bold">3</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Happy Customers</h4>
              <p className="text-muted-foreground">Fresh, nutritious produce delivered directly to customers' homes</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Join the Agricultural Revolution Today</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;