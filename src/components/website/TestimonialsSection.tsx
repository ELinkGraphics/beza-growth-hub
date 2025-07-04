
import React from "react";
import { useWebsiteContent } from "@/hooks/use-website-content";
import TestimonialCard from "@/components/ui/testimonial-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {testimonialsContent.title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {testimonialsContent.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonialsContent.testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border border-border/50 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex-1 mb-6">
                    <div className="text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xl">★</span>
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="elegant" size="lg" className="group">
            <span className="flex items-center gap-2">
              View All Testimonials
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/4 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-10 w-60 h-60 bg-accent/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default TestimonialsSection;
