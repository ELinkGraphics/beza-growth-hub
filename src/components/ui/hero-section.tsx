
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageUrl = "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png",
}) => {
  return (
    <section className="relative bg-gradient-to-br from-brand-50 to-white py-20 overflow-hidden">
      <div className="container mx-auto section-padding flex flex-col-reverse lg:flex-row items-center">
        <div className="lg:w-1/2 space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg">
            {subtitle}
          </p>
          <div className="flex space-x-4 pt-4">
            <Link to={ctaLink}>
              <Button size="lg" className="bg-brand-500 hover:bg-brand-600">
                {ctaText}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-brand-500 text-brand-600 hover:bg-brand-50">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 mb-10 lg:mb-0 flex justify-center animate-slide-up">
          <div className="relative w-3/4 aspect-square">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-full bg-accent-200 opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-full bg-brand-200 opacity-20"></div>
            <img
              src={imageUrl}
              alt="Beza"
              className="relative z-10 w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
