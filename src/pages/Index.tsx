import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CustomerAccess from "@/components/CustomerAccess";
import Features from "@/components/Features";
import UserTypes from "@/components/UserTypes";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";
import ProductsShowcase from "@/components/ProductsShowcase";
import { DatabaseTestComponent } from "@/components/DatabaseTestComponent";

const Index = () => {
  const isDevelopment = import.meta.env.VITE_DEV_MODE === 'true';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProductsShowcase />
        <CustomerAccess />
        <Features />
        <UserTypes />
        <Benefits />
        {isDevelopment && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Development Tools
              </h2>
              <DatabaseTestComponent />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
