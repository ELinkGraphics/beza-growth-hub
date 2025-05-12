
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Grow with Beza
              </span>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Empowering individuals and businesses to reach their full potential through personalized coaching and strategic guidance.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-500 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-brand-500 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-500 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Get in Touch</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <span className="block">Email:</span>
                <a href="mailto:beza@growwithbeza.com" className="text-brand-500 hover:text-brand-600">
                  beza@growwithbeza.com
                </a>
              </li>
              <li className="text-gray-600">
                <span className="block">Phone:</span>
                <a href="tel:+12345678901" className="text-brand-500 hover:text-brand-600">
                  +1 (234) 567-8901
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} Grow with Beza. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
