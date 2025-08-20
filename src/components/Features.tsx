import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Warehouse, ShoppingCart, Shield, BarChart3, Users, MapPin, Clock } from "lucide-react";
import { scrollTriggerAnimation, staggerFadeIn } from "@/lib/animations";

const Features = () => {
  const featuresRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      scrollTriggerAnimation(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    if (cardsRef.current) {
      staggerFadeIn(cardsRef.current.children, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });
    }
  }, []);

  const features = [
    {
      icon: Sprout,
      title: "Smart Crop Suggestions",
      description: "AI-powered recommendations based on soil type, weather conditions, and market demand",
      bengali: "স্মার্ট ফসল পরামর্শ"
    },
    {
      icon: Warehouse,
      title: "Warehouse Management",
      description: "Efficient storage solutions with real-time inventory tracking and quality monitoring",
      bengali: "গুদাম ব্যবস্থাপনা"
    },
    {
      icon: ShoppingCart,
      title: "Direct Sales Platform",
      description: "Connect directly with consumers, eliminate middlemen, and get fair prices",
      bengali: "সরাসরি বিক্রয় প্ল্যাটফর্ম"
    },
    {
      icon: Shield,
      title: "Pesticide Recommendations",
      description: "Expert guidance on safe and effective pesticide usage for healthy crops",
      bengali: "কীটনাশক সুপারিশ"
    },
    {
      icon: BarChart3,
      title: "Market Analytics",
      description: "Real-time price tracking and demand forecasting to maximize profits",
      bengali: "বাজার বিশ্লেষণ"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow farmers, share experiences, and learn together",
      bengali: "সম্প্রদায়ের সহায়তা"
    },
    {
      icon: MapPin,
      title: "Logistics Network",
      description: "Reliable delivery partners ensuring fresh produce reaches customers",
      bengali: "লজিস্টিক নেটওয়ার্ক"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance in Bengali and English for all your needs",
      bengali: "২৪/৭ সহায়তা"
    }
  ];

  return (
    <section ref={featuresRef} id="features" className="py-20 bg-accent/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Powerful Features for
            <span className="text-primary ml-3">Modern Agriculture</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools and services designed to revolutionize farming and create 
            sustainable agricultural communities
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover-lift shadow-card border-border/50 bg-card/80 backdrop-blur-sm group"
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                <p className="text-sm text-primary/70 font-bengali">{feature.bengali}</p>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sprout className="w-5 h-5 mr-2" />
            <span className="font-medium">100% Organic & Sustainable Solutions</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;