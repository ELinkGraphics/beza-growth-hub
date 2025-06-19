
import React from "react";
import { Button } from "@/components/ui/button";
import { useWebsiteContent } from "@/hooks/use-website-content";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const HomePage = () => {
  const { content, loading } = useWebsiteContent("home");
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>
    </div>;
  }

  // Default content if none is found
  const defaultContent = {
    hero: {
      title: "Transform Your Brand with Expert Digital Marketing",
      subtitle: "Professional social media marketing and brand development services with 3+ years of proven results in digital marketing, content creation, and audience engagement.",
      ctaText: "Book a Consultation",
      heroImage: "/placeholder.svg"
    },
    about: {
      title: "About Bezawit",
      paragraph1: "With over 3 years of experience in digital marketing and social media management, I specialize in creating data-driven campaigns that deliver measurable results. My expertise spans content creation, brand development, and multi-platform social media strategies.",
      paragraph2: "I'm passionate about helping businesses grow their online presence through innovative digital storytelling, strategic influencer partnerships, and compelling content that drives audience engagement and brand awareness.",
      aboutImage: "/placeholder.svg"
    },
    cta: {
      title: "Ready to Grow Your Brand?",
      description: "Let's work together to create a digital marketing strategy that delivers real results for your business."
    },
    features: [
      "Social Media Strategy & Management",
      "Content Creation & Copywriting", 
      "Brand Development & Consistency",
      "Paid Ad Campaigns & Analytics",
      "Influencer Partnership Marketing",
      "Community Growth & Engagement"
    ]
  };

  // Use content from Supabase, or fall back to default
  const homeContent = content || defaultContent;

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-white py-20">
        <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-heading leading-tight">
                {homeContent.hero.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                {homeContent.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                  <Link to="/book" className="flex items-center gap-2">
                    {homeContent.hero.ctaText} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-brand-500 text-brand-500 hover:bg-brand-50 font-medium px-8 py-3 rounded-full">
                  <Link to="/services">Our Services</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 animate-slide-up delay-300">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={homeContent.hero.heroImage || "/placeholder.svg"} 
                    alt="Professional coaching" 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Coaching Services</h2>
            <p className="text-lg text-gray-600">Our unique approach focuses on sustainable growth and measurable results for your personal and professional development.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeContent.features?.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100">
                <div className="text-brand-500 mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-brand-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">{homeContent.about.title}</h2>
              <p className="text-gray-700 leading-relaxed">{homeContent.about.paragraph1}</p>
              <p className="text-gray-700 leading-relaxed">{homeContent.about.paragraph2}</p>
              <Button variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-3xl overflow-hidden shadow-lg transform hover:rotate-1 transition-transform duration-300">
                <AspectRatio ratio={4 / 3}>
                  <img 
                    src={homeContent.about.aboutImage || "/placeholder.svg"} 
                    alt="About Us" 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-400 text-white py-16 rounded-2xl mx-4 md:mx-8 lg:mx-16 shadow-xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{homeContent.cta.title}</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">{homeContent.cta.description}</p>
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white text-brand-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Link to="/book" className="flex items-center gap-2">
              Book a Session <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
