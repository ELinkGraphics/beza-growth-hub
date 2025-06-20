
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { EnhancedStudentDashboard } from "@/components/student/EnhancedStudentDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const StudentDashboard = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <EnhancedStudentDashboard />
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default StudentDashboard;
