import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">KrishiBondhu</span>
            <span className="ml-2 text-sm text-muted-foreground hidden sm:inline">
              কৃষিবন্ধু
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#users" className="text-foreground hover:text-primary transition-colors">
              For Users
            </a>
            <a href="#benefits" className="text-foreground hover:text-primary transition-colors">
              Benefits
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <a href="/setup">Setup</a>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <a href="/customer/dashboard">Shop Now</a>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <a href="/auth/login">Login</a>
            </Button>
            <Button variant="agricultural" className="shadow-fresh" asChild>
              <a href="/auth/role-selection">Get Started</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4 px-4 py-6">
              <a 
                href="#features" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a 
                href="#users" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                For Users
              </a>
              <a 
                href="#benefits" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                Benefits
              </a>
              <a 
                href="#contact" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="/setup">Setup</a>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="/customer/dashboard">Shop Now</a>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="/auth/login">Login</a>
                </Button>
                <Button variant="agricultural" className="justify-start shadow-fresh" asChild>
                  <a href="/auth/role-selection">Get Started</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;