
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LessonViewer } from "@/components/course/LessonViewer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
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
      // For demo purposes, we'll check for recent enrollments
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('course_id', courseId)
        .order('enrolled_at', { ascending: false })
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (enrollments && enrollments.length > 0) {
        const enrollment = enrollments[0];
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
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-lg">Loading course...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6">You need to enroll in this course to access the content.</p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="w-full"
                >
                  View Course Details
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/learn')}
                  className="w-full"
                >
                  Browse Other Courses
                </Button>
              </div>
            </div>
          </div>
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
        onClose={() => navigate('/learn')}
        studentName={studentName}
        enrollmentId={enrollmentId}
      />
      <Footer />
    </div>
  );
};

export default CourseViewer;
