
import React from "react";
import { Button } from "@/components/ui/button";
import { useWebsiteContent } from "@/hooks/use-website-content";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const HomePage = () => {
  const { content, loading } = useWebsiteContent("home");
  
  if (loading) {
    return <div className="py-12 text-center">Loading content...</div>;
  }

  // Default content if none is found
  const defaultContent = {
    hero: {
      title: "Transform Your Potential with Expert Guidance",
      subtitle: "Personal and professional development coaching to help you achieve your goals and unlock your true potential.",
      ctaText: "Book a Session",
      heroImage: "/placeholder.svg"
    },
    about: {
      title: "About Beza",
      paragraph1: "With over a decade of experience in personal and professional development, I'm passionate about helping individuals and organizations unlock their true potential and achieve lasting success.",
      paragraph2: "My approach combines proven strategies with personalized coaching to create a tailored experience that addresses your unique challenges and goals.",
      aboutImage: "/placeholder.svg"
    },
    cta: {
      title: "Ready to Start Your Growth Journey?",
      description: "Take the first step toward unlocking your potential. Book a consultation today."
    }
  };

  // Use content from Supabase, or fall back to default
  const homeContent = content || defaultContent;

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">{homeContent.hero.title}</h1>
            <p className="text-lg text-gray-600">{homeContent.hero.subtitle}</p>
            <Button size="lg" className="mt-4">{homeContent.hero.ctaText}</Button>
          </div>
          <div className="md:w-1/2">
            <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={homeContent.hero.heroImage || "/placeholder.svg"} 
                alt="Hero" 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">{homeContent.about.title}</h2>
              <p className="text-gray-600">{homeContent.about.paragraph1}</p>
              <p className="text-gray-600">{homeContent.about.paragraph2}</p>
            </div>
            <div className="md:w-1/2">
              <AspectRatio ratio={4 / 3} className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={homeContent.about.aboutImage || "/placeholder.svg"} 
                  alt="About" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{homeContent.cta.title}</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">{homeContent.cta.description}</p>
          <Button variant="secondary" size="lg">Book a Session</Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
