
import React from "react";
import HeroSection from "@/components/ui/hero-section";
import ServiceCard from "@/components/ui/service-card";
import TestimonialCard from "@/components/ui/testimonial-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Calendar, Book, User, Users } from "lucide-react";

const Home = () => {
  return (
    <main>
      <HeroSection
        title="Transform Your Potential with Expert Guidance"
        subtitle="Personal and professional development coaching to help you achieve your goals and unlock your true potential."
        ctaText="Book a Session"
        ctaLink="/book"
      />
      
      {/* Services Section */}
      <section className="section-padding py-20 bg-white">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Services Designed for Your Growth
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the ways we can work together to help you achieve your personal and professional goals.
          </p>
        </div>
        
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            title="Personal Coaching"
            description="One-on-one sessions tailored to your personal growth goals and challenges."
            icon={<User className="h-6 w-6 text-brand-500" />}
            link="/services#personal-coaching"
          />
          <ServiceCard
            title="Career Development"
            description="Strategic guidance to help you advance your career and reach new professional heights."
            icon={<Book className="h-6 w-6 text-brand-500" />}
            color="accent"
            link="/services#career-development"
          />
          <ServiceCard
            title="Group Workshops"
            description="Interactive sessions designed to foster growth in a collaborative environment."
            icon={<Users className="h-6 w-6 text-brand-500" />}
            link="/services#group-workshops"
          />
        </div>
        
        <div className="container mx-auto text-center mt-12">
          <Link to="/services">
            <Button variant="outline" className="border-brand-500 text-brand-600 hover:bg-brand-50">
              View All Services
            </Button>
          </Link>
        </div>
      </section>
      
      <Separator />
      
      {/* About Section */}
      <section className="section-padding py-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                About Beza
              </h2>
              <p className="text-lg text-gray-700">
                With over a decade of experience in personal and professional development, 
                I'm passionate about helping individuals and organizations unlock their 
                true potential and achieve lasting success.
              </p>
              <p className="text-lg text-gray-700">
                My approach combines proven strategies with personalized coaching to 
                create a tailored experience that addresses your unique challenges 
                and goals.
              </p>
              <Link to="/about">
                <Button className="mt-4 bg-brand-500 hover:bg-brand-600">Learn More About Me</Button>
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute -bottom-4 -right-4 w-full h-full rounded-full bg-brand-200 opacity-20"></div>
                <img
                  src="/placeholder.svg"
                  alt="Beza"
                  className="relative z-10 w-full h-full object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section-padding py-20 bg-white">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Client Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from clients who have transformed their lives and careers with our guidance.
          </p>
        </div>
        
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="Working with Beza has been transformative. I've gained clarity on my career goals and the confidence to pursue them."
            name="Sarah Johnson"
            role="Marketing Director"
          />
          <TestimonialCard
            quote="The personalized coaching sessions helped me overcome obstacles I'd been struggling with for years. I can't recommend Beza enough."
            name="Michael Chen"
            role="Entrepreneur"
          />
          <TestimonialCard
            quote="Beza's workshops provided our team with valuable insights and practical strategies that improved our collaboration and productivity."
            name="Elena Rodriguez"
            role="HR Manager"
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Growth Journey?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Take the first step toward unlocking your potential. Book a consultation today.
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

export default Home;
