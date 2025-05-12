
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-heading font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            Grow with Beza
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-base font-medium hover-underline transition-colors ${
                isActive(link.path) ? "text-brand-600" : "text-gray-700 hover:text-brand-500"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/book">
            <Button variant="default" className="bg-brand-500 hover:bg-brand-600">
              Book Appointment
            </Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t p-4">
          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium px-4 py-2 rounded-md transition-colors ${
                  isActive(link.path) 
                    ? "bg-brand-50 text-brand-600" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/book" onClick={() => setIsMenuOpen(false)}>
              <Button variant="default" className="w-full bg-brand-500 hover:bg-brand-600">
                Book Appointment
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
