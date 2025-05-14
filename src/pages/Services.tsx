
import React from "react";
import { useWebsiteContent } from "@/hooks/use-website-content";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const { content, loading, error } = useWebsiteContent("services");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Services</h1>
        <p className="text-center text-gray-600">
          We're currently updating our services. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{content.intro.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          {content.intro.description}
        </p>
      </div>

      {/* Services List */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.map((service: any) => (
            <div 
              key={service.id}
              className={`rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl bg-white border ${
                service.color === "brand" ? "border-brand-200" : "border-accent-200"
              }`}
            >
              <div 
                className={`p-6 ${
                  service.color === "brand" ? "bg-brand-50" : "bg-accent-50"
                }`}
              >
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle 
                          className={`h-5 w-5 mr-2 flex-shrink-0 ${
                            service.color === "brand" ? "text-brand-500" : "text-accent-500"
                          }`}
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Available Formats:</h4>
                  <p className="text-gray-600">{service.formats}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-16 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{content.pricing.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.pricing.plans.map((plan: any) => (
              <div 
                key={plan.id} 
                className={`rounded-xl shadow-md overflow-hidden bg-white transition-all duration-300 hover:shadow-xl relative ${
                  plan.popular ? "border-2 border-brand-500" : "border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-1">/{plan.duration}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-brand-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={plan.popular ? "bg-brand-500 hover:bg-brand-600 w-full" : "bg-gray-700 hover:bg-gray-800 w-full"}
                    asChild
                  >
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="bg-brand-500 text-white rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{content.cta.title}</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
            {content.cta.description}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              variant="secondary" 
              size="lg" 
              asChild
            >
              <Link to="/book">Book a Session</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
