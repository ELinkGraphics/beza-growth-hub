import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/AuthButton";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="text-xl font-bold text-brand-500">
          <Link to="/">Grow with Beza</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-brand-500">
            Home
          </Link>
          <Link to="/about" className="hover:text-brand-500">
            About
          </Link>
          <Link to="/learn" className="hover:text-brand-500">
            Learn
          </Link>
          <Link to="/services" className="hover:text-brand-500">
            Services
          </Link>
          <Link to="/blog" className="hover:text-brand-500">
            Blog
          </Link>
          <Link to="/faq" className="hover:text-brand-500">
            FAQ
          </Link>
          <Link to="/contact" className="hover:text-brand-500">
            Contact
          </Link>
          <Link to="/book" className="hover:text-brand-500">
            Book
          </Link>
        </div>

        {/* Auth Section */}
        <div>
          <AuthButton />
        </div>

        {/* Mobile Menu (Hidden by default) */}
        <div className="md:hidden">
          {/* Add mobile menu icon here */}
          <Button variant="ghost">Menu</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
