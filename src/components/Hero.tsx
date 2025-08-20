import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Users, ShoppingBag } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";
import { fadeInUp, staggerFadeIn, textReveal, counterAnimation } from "@/lib/animations";

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations on component mount
    const tl = {
      badge: badgeRef.current && fadeInUp(badgeRef.current, { delay: 0.2 }),
      title: titleRef.current && textReveal(titleRef.current, { delay: 0.4 }),
      subtitle: subtitleRef.current && fadeInUp(subtitleRef.current, { delay: 0.8 }),
      description: descriptionRef.current && fadeInUp(descriptionRef.current, { delay: 1.0 }),
      buttons: buttonsRef.current && staggerFadeIn(Array.from(buttonsRef.current.children), { delay: 1.2 }),
      stats: statsRef.current && staggerFadeIn(Array.from(statsRef.current.children), { delay: 1.6 }),
    };

    // Counter animations for stats
    if (statsRef.current) {
      const statNumbers = statsRef.current.querySelectorAll('.stat-number');
      statNumbers.forEach((el, index) => {
        const values = [10000, 50000, 500];
        setTimeout(() => {
          counterAnimation(el, values[index], { delay: 1.8 });
        }, index * 200);
      });
    }

    return () => {
      // Cleanup animations if needed
      Object.values(tl).forEach(animation => {
        if (animation && typeof animation.kill === 'function') {
          animation.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Lush agricultural fields representing KrishiBondhu platform"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20 backdrop-blur-sm">
            <Leaf className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Connecting Agriculture & Community</span>
          </div>

          {/* Main Heading */}
          <h1 ref={titleRef} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Empowering Farmers,
            <br />
            <span className="text-harvest bg-gradient-to-r from-harvest to-secondary bg-clip-text text-transparent">
              Connecting Communities
            </span>
          </h1>

          {/* Bengali Subtitle */}
          <p ref={subtitleRef} className="text-xl text-white/90 mb-8 font-bengali">
            কৃষকদের ক্ষমতায়ন, সম্প্রদায়ের সংযোগ
          </p>

          {/* Description */}
          <p ref={descriptionRef} className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join the agricultural revolution where farmers connect directly with consumers, 
            get expert crop guidance, and access modern warehouse solutions.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-4 text-lg shadow-fresh hover-lift group"
              asChild
            >
              <a href="/customer/dashboard">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg"
              asChild
            >
              <a href="/auth/role-selection">
                <Users className="mr-2 h-5 w-5" />
                Get Started
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="stat-number text-3xl font-bold text-white mb-2">0</div>
              <div className="text-white/70">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="stat-number text-3xl font-bold text-white mb-2">0</div>
              <div className="text-white/70">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="stat-number text-3xl font-bold text-white mb-2">0</div>
              <div className="text-white/70">Partner Warehouses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;