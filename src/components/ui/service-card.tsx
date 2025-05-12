
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: "brand" | "accent"; 
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  color = "brand",
  link,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
      <CardHeader className={`pb-2 ${color === "brand" ? "bg-brand-50" : "bg-accent-50"}`}>
        {icon && (
          <div className="w-12 h-12 flex items-center justify-center rounded-full mb-3 bg-white shadow-sm">
            {icon}
          </div>
        )}
        <CardTitle className="text-xl font-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <CardDescription className="text-base text-gray-600 min-h-[80px]">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link to={link} className="w-full">
          <Button 
            variant="outline" 
            className={`w-full ${
              color === "brand" 
                ? "border-brand-400 text-brand-600 hover:bg-brand-50" 
                : "border-accent-400 text-accent-600 hover:bg-accent-50"
            }`}
          >
            Learn More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
