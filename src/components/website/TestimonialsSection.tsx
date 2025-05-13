
import React from "react";
import { useWebsiteContent } from "@/hooks/use-website-content";
import TestimonialCard from "@/components/ui/testimonial-card";
import { Button } from "@/components/ui/button";

const TestimonialsSection = () => {
  const { content, loading } = useWebsiteContent("testimonials");
  
  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default content if none is found
  const defaultContent = {
    title: "Client Success Stories",
    subtitle: "Hear from clients who have transformed their lives and careers with our guidance.",
    testimonials: [
      {
        id: "1",
        name: "Sarah Johnson",
        role: "Marketing Director",
        quote: "Working with Beza has been transformative. I've gained clarity on my career goals and the confidence to pursue them.",
        avatarUrl: "/placeholder.svg"
      },
      {
        id: "2",
        name: "Michael Chen",
        role: "Startup Founder",
        quote: "The coaching sessions provided me with the structure and accountability I needed to grow my business while maintaining work-life balance.",
        avatarUrl: "/placeholder.svg"
      },
      {
        id: "3",
        name: "Priya Patel",
        role: "Healthcare Professional",
        quote: "I was struggling with burnout when I started coaching. Now I have clear boundaries and renewed passion for my work.",
        avatarUrl: "/placeholder.svg"
      }
    ]
  };

  // Use content from Supabase, or fall back to default
  const testimonialsContent = content || defaultContent;

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{testimonialsContent.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{testimonialsContent.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsContent.testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                avatarUrl={testimonial.avatarUrl}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50">
            View All Testimonials
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
