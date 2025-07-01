
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomePage from "@/components/website/HomePage";
import TestimonialsSection from "@/components/website/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HomePage />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
