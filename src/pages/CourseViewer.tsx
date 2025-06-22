
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LessonViewer } from "@/components/course/LessonViewer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CourseViewer = () => {
  const { courseId } = useParams();
  const [enrollmentId, setEnrollmentId] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkEnrollment();
  }, [courseId]);

  const checkEnrollment = async () => {
    try {
      // In a real app, you'd get the current user's email from auth
      const userEmail = "user@example.com"; // Placeholder
      
      const { data: enrollment, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('course_id', courseId)
        .eq('email', userEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (enrollment) {
        setEnrollmentId(enrollment.id);
        setStudentName(enrollment.student_name);
        setHasAccess(true);
      } else {
        setHasAccess(false);
        toast({
          title: "Access Denied",
          description: "You need to enroll in this course to access the content.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to verify course access.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <p>Loading course...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to enroll in this course to access the content.</p>
          <a href="/learn" className="text-blue-600 hover:underline">
            Browse available courses
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LessonViewer
        isOpen={true}
        onClose={() => window.history.back()}
        studentName={studentName}
        enrollmentId={enrollmentId}
      />
      <Footer />
    </div>
  );
};

export default CourseViewer;
