
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
    <div className="space-y-0">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Transform Your
                  </span>
                  <br />
                  <span className="text-foreground">Brand Journey</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {homeContent.hero.subtitle}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="xl" variant="gradient" className="group">
                  <Link to="/book" className="flex items-center gap-3">
                    {homeContent.hero.ctaText} 
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="elegant" size="xl">
                  <Link to="/services">Explore Services</Link>
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-6 justify-center lg:justify-start pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative group">
                {/* Floating elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-primary rounded-3xl opacity-20 group-hover:rotate-12 transition-transform duration-700"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-secondary rounded-2xl opacity-30 group-hover:-rotate-12 transition-transform duration-700"></div>
                
                <div className="relative rounded-3xl overflow-hidden shadow-large group-hover:shadow-glow transition-all duration-500">
                  <AspectRatio ratio={4 / 5}>
                    <img 
                      src={homeContent.hero.heroImage || "/placeholder.svg"} 
                      alt="Professional coaching" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              <span className="text-foreground">Why Choose Our</span>
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Expert Services</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Our unique approach focuses on sustainable growth and measurable results for your personal and professional development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeContent.features?.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border border-border/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-subtle rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold font-heading mb-3 text-foreground">{feature}</h3>
                  <div className="w-12 h-1 bg-gradient-primary rounded-full group-hover:w-16 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-20">
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                  {homeContent.about.title}
                </h2>
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {homeContent.about.paragraph1}
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {homeContent.about.paragraph2}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="elegant" size="lg" className="group">
                  <Link to="/about" className="flex items-center gap-2">
                    Learn More About Us
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Available</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-primary rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-large group-hover:shadow-glow transition-all duration-500">
                  <AspectRatio ratio={4 / 3}>
                    <img 
                      src={homeContent.about.aboutImage || "/placeholder.svg"} 
                      alt="About Us" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary"></div>
        <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-foreground mb-8">
              {homeContent.cta.title}
            </h2>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 leading-relaxed">
              {homeContent.cta.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl" className="group bg-background text-primary hover:bg-background/90">
                <Link to="/book" className="flex items-center gap-3">
                  Book a Session 
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary-foreground/10 rounded-full"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary-foreground/5 rounded-full"></div>
      </section>
    </div>
  );
};

export default HomePage;
