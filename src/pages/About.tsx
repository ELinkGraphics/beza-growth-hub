
import React from "react";
import { useWebsiteContent } from "@/hooks/use-website-content";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const { content, loading, error } = useWebsiteContent("about");

  console.log("About page - loading:", loading, "error:", error, "content:", content);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !content) {
    console.error("About page error:", error);
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">About</h1>
        <p className="text-center text-gray-600">
          We're currently updating our about page. Please check back later.
        </p>
        <p className="text-center text-gray-500 text-sm mt-4">
          Error: {error || "Content not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {content.hero?.title || "About Bezawit Zerefa"}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {content.hero?.subtitle || "Dynamic and results-driven social media marketing manager with 3+ years of experience in digital marketing, content creation, and branding."}
        </p>
      </div>

      {/* Story Section */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold mb-6">
              {content.story?.title || "My Story"}
            </h2>
            {content.story?.paragraphs?.map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-600">
                {paragraph}
              </p>
            )) || (
              <p className="text-gray-600">
                As a dynamic and results-driven social media marketing manager with over 3 years of experience, I specialize in digital marketing, content creation, and branding.
              </p>
            )}
          </div>
          
          <div className="md:w-1/2">
            {content.story?.image ? (
              <img 
                src={content.story.image} 
                alt="About Story" 
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
            ) : (
              <div className="bg-gray-200 rounded-xl w-full aspect-[4/3] flex items-center justify-center">
                <p className="text-gray-500">Image not available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-gray-50 py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {content.philosophy?.title || "My Approach"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.philosophy?.values?.map((value: any) => (
              <div 
                key={value.id} 
                className="bg-white rounded-xl shadow-md p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <span className="text-xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            )) || (
              <div className="col-span-3 text-center text-gray-600">
                <p>Philosophy section is being updated...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {content.credentials?.title || "Professional Background & Expertise"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Education</h3>
            <div className="space-y-6">
              {content.credentials?.education?.map((item: any) => (
                <div key={item.id} className="border-l-4 border-brand-500 pl-4 py-2">
                  <h4 className="text-lg font-medium">{item.degree}</h4>
                  <p className="text-gray-600">{item.institution}</p>
                  <p className="text-gray-500 text-sm">{item.year}</p>
                </div>
              )) || (
                <div className="border-l-4 border-brand-500 pl-4 py-2">
                  <p className="text-gray-600">Education information is being updated...</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Experience */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Professional Experience</h3>
            <div className="space-y-6">
              {content.credentials?.experience?.map((item: any) => (
                <div key={item.id} className="border-l-4 border-accent-500 pl-4 py-2">
                  <h4 className="text-lg font-medium">{item.position}</h4>
                  <p className="text-gray-600">{item.company}</p>
                  <p className="text-gray-500 text-sm">{item.period}</p>
                </div>
              )) || (
                <div className="border-l-4 border-accent-500 pl-4 py-2">
                  <p className="text-gray-600">Experience information is being updated...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Work Together?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            I'd love to hear about your goals and discuss how we can achieve them together.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              size="lg" 
              asChild
            >
              <Link to="/book">Book a Session</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
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

export default About;
