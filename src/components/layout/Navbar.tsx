import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/AuthButton";
import MobileNav from "@/components/ui/mobile-nav";

const Navbar = () => {
  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            Grow with Beza
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="relative font-medium text-foreground hover:text-primary transition-colors group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="relative font-medium text-foreground hover:text-primary transition-colors group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/learn" className="relative font-medium text-foreground hover:text-primary transition-colors group">
            Learn
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/services" className="relative font-medium text-foreground hover:text-primary transition-colors group">
            Services
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/blog" className="relative font-medium text-foreground hover:text-primary transition-colors group">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/faq" className="relative font-medium text-foreground hover:text-primary transition-colors group">
            FAQ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="relative font-medium text-foreground hover:text-primary transition-colors group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/book" className="relative font-medium text-foreground hover:text-primary transition-colors group">
            Book
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          <AuthButton />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
