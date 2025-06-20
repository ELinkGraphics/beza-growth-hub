
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CourseListingPage } from "@/components/course/CourseListingPage";

const Learn = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CourseListingPage />
      <Footer />
    </div>
  );
};

export default Learn;
