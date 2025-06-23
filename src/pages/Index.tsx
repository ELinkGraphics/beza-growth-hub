
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-500 to-brand-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Grow with Beza
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Transform your personal brand and unlock your potential with our comprehensive courses and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-brand-600 hover:bg-gray-100">
              <Link to="/learn">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-600">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Grow with Beza?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform offers comprehensive learning experiences designed to help you build a strong personal brand.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <CardTitle>Expert-Led Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn from industry experts with proven track records in personal branding and professional development.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <CardTitle>Certified Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn certificates upon completion and showcase your achievements to potential employers and clients.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join a community of like-minded individuals and get support throughout your learning journey.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Brand?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your journey today and unlock your full potential with our comprehensive courses.
          </p>
          <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600">
            <Link to="/learn">
              Browse Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
