
import React from "react";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  name, 
  role, 
  avatarUrl = "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png" 
}) => {
  const initials = name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 pb-4 flex-grow">
        <div className="mb-4 text-brand-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" />
            <path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" />
          </svg>
        </div>
        <CardDescription className="text-gray-700 text-base italic">
          {quote}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-brand-100 text-brand-700">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
