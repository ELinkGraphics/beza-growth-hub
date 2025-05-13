
import React from "react";
import { useWebsiteContent } from "@/hooks/use-website-content";

const TestimonialsSection = () => {
  const { content, loading } = useWebsiteContent("testimonials");
  
  if (loading) {
    return <div className="py-12 text-center">Loading testimonials...</div>;
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
      }
    ]
  };

  // Use content from Supabase, or fall back to default
  const testimonialsContent = content || defaultContent;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{testimonialsContent.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{testimonialsContent.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsContent.testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="relative">
                <p className="italic text-gray-600 mb-6">"{testimonial.quote}"</p>
              </div>
              
              <div className="flex items-center">
                {testimonial.avatarUrl ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatarUrl} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
