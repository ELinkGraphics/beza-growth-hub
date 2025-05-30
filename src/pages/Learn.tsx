
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Learn = () => {
  return (
    <div className="min-h-screen">
      {/* Full Page Welcome Video Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 overflow-hidden">
        {/* Background Video Placeholder */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000&q=80" 
            alt="Welcome background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to Your Growth Journey
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in delay-200">
            Discover the power of personal branding and unlock your potential with our comprehensive learning platform
          </p>
          
          {/* Video Play Button */}
          <div className="mb-12 animate-fade-in delay-300">
            <button className="group relative inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110">
              <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
            </button>
            <p className="mt-4 text-white/80">Watch Welcome Video</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-500">
            <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3">
              Start Learning
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3">
              Explore Courses
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Course Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Course</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master the art of personal branding and stand out in your professional journey
            </p>
          </div>
          
          {/* Course Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Course Image */}
                <div className="relative">
                  <AspectRatio ratio={16 / 12}>
                    <img 
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80" 
                      alt="Fundamentals of Personal Branding" 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="bg-brand-500 px-3 py-1 rounded-full text-sm font-medium">
                      Featured Course
                    </span>
                  </div>
                </div>
                
                {/* Course Details */}
                <CardContent className="p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">
                      Fundamentals of Personal Branding
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Learn how to build a powerful personal brand that opens doors to new opportunities. 
                      This comprehensive course covers everything from defining your unique value proposition 
                      to building an authentic online presence that resonates with your target audience.
                    </p>
                    
                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Clock className="h-5 w-5 text-brand-500" />
                        </div>
                        <p className="text-sm text-gray-500">8 Hours</p>
                        <p className="font-semibold">Duration</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Users className="h-5 w-5 text-brand-500" />
                        </div>
                        <p className="text-sm text-gray-500">1,200+</p>
                        <p className="font-semibold">Students</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Star className="h-5 w-5 text-brand-500" />
                        </div>
                        <p className="text-sm text-gray-500">4.9/5</p>
                        <p className="font-semibold">Rating</p>
                      </div>
                    </div>
                    
                    {/* What You'll Learn */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">What You'll Learn:</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Define your unique value proposition and brand identity
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Create compelling content that showcases your expertise
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Build authentic relationships and network effectively
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Leverage social media for professional growth
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Course Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-brand-600">$297</span>
                      <span className="text-gray-500 line-through">$497</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="bg-brand-500 hover:bg-brand-600 flex-1">
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50">
                        Learn More
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      30-day money-back guarantee
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already transformed their careers through personal branding
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-brand-600 hover:bg-gray-100">
              Start Your Journey
            </Button>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Get Personal Guidance
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;
