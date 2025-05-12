
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Calendar, Book, User, Users } from "lucide-react";

const Services = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-brand-50 py-20">
        <div className="container mx-auto section-padding text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Services</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover how we can work together to unlock your potential and achieve your goals.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section id="personal-coaching" className="section-padding py-16">
        <div className="container mx-auto">
          <Card className="mb-16">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-brand-500">
                <div className="h-full flex items-center justify-center p-8">
                  <User className="h-24 w-24 text-white" />
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl">Personal Coaching</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <CardDescription className="text-base text-gray-700">
                    One-on-one personalized coaching sessions designed to help you overcome obstacles, clarify your vision, and create actionable steps toward your personal and professional goals.
                  </CardDescription>
                  <div className="space-y-2">
                    <h4 className="font-medium">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Personalized strategies tailored to your specific needs</li>
                      <li>Accountability and consistent support</li>
                      <li>Deeper self-awareness and clarity</li>
                      <li>Tools to overcome limiting beliefs and patterns</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Formats Available:</h4>
                    <p className="text-gray-700">
                      Individual sessions (60-90 minutes), 3-month packages, 6-month intensive programs
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link to="/book">
                      <Button className="bg-brand-500 hover:bg-brand-600">Book a Session</Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          <Card id="career-development" className="mb-16">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-accent-500">
                <div className="h-full flex items-center justify-center p-8">
                  <Book className="h-24 w-24 text-white" />
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl">Career Development</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <CardDescription className="text-base text-gray-700">
                    Strategic coaching focused on advancing your career, improving leadership skills, and navigating professional challenges with confidence and clarity.
                  </CardDescription>
                  <div className="space-y-2">
                    <h4 className="font-medium">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Career path clarification and planning</li>
                      <li>Enhanced leadership and communication skills</li>
                      <li>Strategies for navigating workplace challenges</li>
                      <li>Work-life balance optimization</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Formats Available:</h4>
                    <p className="text-gray-700">
                      Executive coaching programs, career transition support, leadership development plans
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link to="/book">
                      <Button className="bg-accent-500 hover:bg-accent-600 text-white">Schedule a Consultation</Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          <Card id="group-workshops" className="mb-16">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-brand-500">
                <div className="h-full flex items-center justify-center p-8">
                  <Users className="h-24 w-24 text-white" />
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl">Group Workshops</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <CardDescription className="text-base text-gray-700">
                    Interactive workshops for teams and organizations focused on building collaboration, communication, and collective growth in a dynamic group setting.
                  </CardDescription>
                  <div className="space-y-2">
                    <h4 className="font-medium">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Enhanced team cohesion and collaboration</li>
                      <li>Shared language and tools for ongoing development</li>
                      <li>Cost-effective growth opportunity for organizations</li>
                      <li>Customized content for specific team challenges</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Popular Workshop Topics:</h4>
                    <p className="text-gray-700">
                      Effective Communication, Conflict Resolution, Building Resilience, Strategic Goal Setting
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link to="/contact">
                      <Button className="bg-brand-500 hover:bg-brand-600">Inquire About Workshops</Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Pricing Section */}
      <section className="section-padding py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Investment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <CardHeader className="bg-brand-50 text-center pb-4">
                <CardTitle>Starter</CardTitle>
                <div className="mt-4 text-4xl font-bold">$199</div>
                <CardDescription className="mt-2">Single Session</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    90-minute coaching session
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Goal-setting worksheet
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Action plan development
                  </li>
                </ul>
                <div className="pt-6">
                  <Link to="/book" className="block">
                    <Button variant="outline" className="w-full border-brand-500 text-brand-600 hover:bg-brand-50">Book Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-brand-500">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1">
                Most Popular
              </div>
              <CardHeader className="bg-brand-100 text-center pb-4">
                <CardTitle>Growth Package</CardTitle>
                <div className="mt-4 text-4xl font-bold">$899</div>
                <CardDescription className="mt-2">3-Month Package</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    6 bi-weekly coaching sessions
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Email support between sessions
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Personalized growth plan
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Progress tracking tools
                  </li>
                </ul>
                <div className="pt-6">
                  <Link to="/book" className="block">
                    <Button className="w-full bg-brand-500 hover:bg-brand-600">Get Started</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="bg-brand-50 text-center pb-4">
                <CardTitle>Transformation</CardTitle>
                <div className="mt-4 text-4xl font-bold">$1,699</div>
                <CardDescription className="mt-2">6-Month Package</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    12 bi-weekly coaching sessions
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Priority email & text support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Comprehensive assessment
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Monthly progress reviews
                  </li>
                </ul>
                <div className="pt-6">
                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full border-brand-500 text-brand-600 hover:bg-brand-50">Contact for Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin Your Transformation?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Take the first step by booking a session or reaching out to discuss your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book">
              <Button size="lg" variant="default" className="bg-white text-brand-700 hover:bg-gray-100">
                Book a Session
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-brand-600">
                Contact Me
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
