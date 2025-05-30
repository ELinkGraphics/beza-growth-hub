
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play, Clock, Users, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseModal } from "@/components/course/CourseModal";
import { EnrollmentForm } from "@/components/course/EnrollmentForm";
import { LessonViewer } from "@/components/course/LessonViewer";

const Learn = () => {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEnrollmentFormOpen, setIsEnrollmentFormOpen] = useState(false);
  const [isLessonViewerOpen, setIsLessonViewerOpen] = useState(false);
  const [studentData, setStudentData] = useState<{ fullName: string; email: string; phone: string } | null>(null);

  const handleLearnMore = () => {
    setIsCourseModalOpen(true);
  };

  const handleEnrollFromModal = () => {
    setIsCourseModalOpen(false);
    setIsEnrollmentFormOpen(true);
  };

  const handleDirectEnroll = () => {
    setIsEnrollmentFormOpen(true);
  };

  const handleEnrollmentSubmit = (data: { fullName: string; email: string; phone: string }) => {
    setStudentData(data);
    setIsEnrollmentFormOpen(false);
    setIsLessonViewerOpen(true);
  };

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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Course</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master the art of personal branding and stand out in your professional journey
            </p>
          </div>
          
          {/* Premium Course Card */}
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50">
              <div className="relative">
                {/* Premium Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-semibold">Premium Course</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  {/* Course Image */}
                  <div className="lg:col-span-2 relative">
                    <AspectRatio ratio={16 / 12}>
                      <img 
                        src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80" 
                        alt="Fundamentals of Personal Branding" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <span className="bg-brand-500/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                        Most Popular
                      </span>
                    </div>
                  </div>
                  
                  {/* Course Details */}
                  <CardContent className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
                            Fundamentals of Personal Branding
                          </h3>
                          <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Learn how to build a powerful personal brand that opens doors to new opportunities. 
                            This comprehensive course covers everything from defining your unique value proposition 
                            to building an authentic online presence.
                          </p>
                        </div>
                      </div>
                      
                      {/* Course Stats */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-center mb-3">
                            <div className="p-2 bg-brand-100 rounded-lg">
                              <Clock className="h-6 w-6 text-brand-600" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-800">8</p>
                          <p className="text-sm text-gray-500">Hours</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-center mb-3">
                            <div className="p-2 bg-brand-100 rounded-lg">
                              <Users className="h-6 w-6 text-brand-600" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-800">1,200+</p>
                          <p className="text-sm text-gray-500">Students</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-center mb-3">
                            <div className="p-2 bg-brand-100 rounded-lg">
                              <Star className="h-6 w-6 text-brand-600" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-800">4.9</p>
                          <p className="text-sm text-gray-500">Rating</p>
                        </div>
                      </div>
                      
                      {/* What You'll Learn */}
                      <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">What You'll Learn:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">Define your unique value proposition</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">Create compelling content</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">Build authentic relationships</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">Leverage social media effectively</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Course Actions */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div>
                          <span className="text-4xl font-bold text-green-600">FREE</span>
                          <p className="text-green-700 font-medium">Limited Time Offer</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500 line-through text-lg">$297</span>
                          <p className="text-sm text-green-600 font-medium">Save $297</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={handleDirectEnroll}
                          className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg flex-1 h-12 text-lg font-semibold"
                        >
                          Enroll Now - FREE
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleLearnMore}
                          className="border-2 border-brand-500 text-brand-600 hover:bg-brand-50 h-12 px-8"
                        >
                          Learn More
                        </Button>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                          <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                          </span>
                          30-day money-back guarantee
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </div>
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

      {/* Modals */}
      <CourseModal 
        isOpen={isCourseModalOpen} 
        onClose={() => setIsCourseModalOpen(false)}
        onEnroll={handleEnrollFromModal}
      />
      
      <EnrollmentForm 
        isOpen={isEnrollmentFormOpen}
        onClose={() => setIsEnrollmentFormOpen(false)}
        onSubmit={handleEnrollmentSubmit}
      />
      
      {studentData && (
        <LessonViewer 
          isOpen={isLessonViewerOpen}
          onClose={() => setIsLessonViewerOpen(false)}
          studentName={studentData.fullName}
        />
      )}
    </div>
  );
};

export default Learn;
