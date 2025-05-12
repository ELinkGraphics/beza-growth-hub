
import React from "react";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-brand-50 py-20">
        <div className="container mx-auto section-padding text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Beza</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Learn about my journey, philosophy, and approach to personal and professional development.
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="section-padding py-16">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-full bg-accent-200 opacity-20"></div>
                <img
                  src="/placeholder.svg"
                  alt="Beza"
                  className="relative z-10 w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold mb-4">My Story</h2>
              <p className="text-lg text-gray-700">
                With over a decade of experience in coaching and mentoring, I've helped hundreds of individuals and organizations unlock their full potential and achieve remarkable results.
              </p>
              <p className="text-lg text-gray-700">
                My journey began when I discovered the transformative power of personal development and strategic coaching. Since then, I've dedicated my career to empowering others to overcome obstacles, discover their strengths, and create meaningful change in their lives and careers.
              </p>
              <p className="text-lg text-gray-700">
                I believe that everyone has untapped potential waiting to be discovered. My approach combines evidence-based strategies with intuitive guidance to create personalized pathways to success for each client.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Philosophy Section */}
      <section className="section-padding py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">My Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
              <p className="text-gray-700">
                True growth begins with embracing who you truly are. I create a safe space for clients to explore their authentic selves and build from that foundation.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Holistic Approach</h3>
              <p className="text-gray-700">
                Success isn't just about career achievements. I help clients create harmony between personal wellbeing, relationships, and professional goals.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Continuous Growth</h3>
              <p className="text-gray-700">
                Growth is a journey, not a destination. I equip clients with tools and mindsets that support lifelong development and adaptation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Credentials Section */}
      <section className="section-padding py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Credentials & Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Education</h3>
              <ul className="space-y-4">
                <li className="border-l-2 border-brand-400 pl-4 py-2">
                  <p className="font-medium">Master's in Organizational Psychology</p>
                  <p className="text-gray-600">Stanford University, 2012</p>
                </li>
                <li className="border-l-2 border-brand-400 pl-4 py-2">
                  <p className="font-medium">Certified Professional Coach</p>
                  <p className="text-gray-600">International Coach Federation, 2013</p>
                </li>
                <li className="border-l-2 border-brand-400 pl-4 py-2">
                  <p className="font-medium">Bachelor's in Psychology</p>
                  <p className="text-gray-600">University of California, Berkeley, 2010</p>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Professional Experience</h3>
              <ul className="space-y-4">
                <li className="border-l-2 border-accent-400 pl-4 py-2">
                  <p className="font-medium">Executive Coach</p>
                  <p className="text-gray-600">Fortune 500 Companies, 2015-Present</p>
                </li>
                <li className="border-l-2 border-accent-400 pl-4 py-2">
                  <p className="font-medium">Leadership Development Specialist</p>
                  <p className="text-gray-600">Global Coaching Institute, 2013-2015</p>
                </li>
                <li className="border-l-2 border-accent-400 pl-4 py-2">
                  <p className="font-medium">Organizational Development Consultant</p>
                  <p className="text-gray-600">McKinsey & Company, 2012-2013</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
