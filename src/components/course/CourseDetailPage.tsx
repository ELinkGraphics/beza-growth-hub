
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play, Clock, Users, Star, CheckCircle, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  is_free: boolean;
  cover_image_url?: string;
  preview_video_url?: string;
  category_name?: string;
  instructor_name?: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Array<{
    id: string;
    title: string;
    duration: string;
  }>;
}

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchCourseModules();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories(name),
          instructors(name)
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;

      setCourse({
        ...data,
        category_name: data.course_categories?.name,
        instructor_name: data.instructors?.name
      });
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast({
        title: "Error",
        description: "Failed to load course details.",
        variant: "destructive",
      });
    }
  };

  const fetchCourseModules = async () => {
    try {
      // Fetch sample modules and lessons
      const sampleModules = [
        {
          id: "1",
          title: "Introduction to Personal Branding",
          description: "Learn the fundamentals of building your personal brand",
          lessons: [
            { id: "1", title: "What is Personal Branding?", duration: "8 minutes" },
            { id: "2", title: "Why Personal Branding Matters", duration: "12 minutes" },
            { id: "3", title: "Common Branding Mistakes", duration: "10 minutes" }
          ]
        },
        {
          id: "2",
          title: "Building Your Brand Identity",
          description: "Develop your unique brand voice and visual identity",
          lessons: [
            { id: "4", title: "Defining Your Brand Values", duration: "15 minutes" },
            { id: "5", title: "Creating Your Brand Voice", duration: "20 minutes" },
            { id: "6", title: "Visual Branding Basics", duration: "18 minutes" }
          ]
        },
        {
          id: "3",
          title: "Digital Presence & Social Media",
          description: "Establish and grow your online presence effectively",
          lessons: [
            { id: "7", title: "LinkedIn Optimization", duration: "25 minutes" },
            { id: "8", title: "Content Strategy", duration: "30 minutes" },
            { id: "9", title: "Engagement Best Practices", duration: "22 minutes" }
          ]
        }
      ];
      
      setModules(sampleModules);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful enrollment
      const enrollmentData = {
        course_id: courseId,
        student_name: "Current User", // In real app, get from auth
        email: "user@example.com", // In real app, get from auth
        phone: "123-456-7890", // In real app, get from form
        enrolled_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('course_enrollments')
        .insert([enrollmentData]);

      if (error) throw error;

      toast({
        title: "Payment Successful!",
        description: "You have been enrolled in the course. Redirecting to lessons...",
      });

      // Redirect to lesson viewer
      setTimeout(() => {
        navigate(`/course-viewer/${courseId}`);
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleFreeEnrollment = async () => {
    try {
      const enrollmentData = {
        course_id: courseId,
        student_name: "Current User", // In real app, get from auth
        email: "user@example.com", // In real app, get from auth
        phone: "123-456-7890", // In real app, get from form
        enrolled_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('course_enrollments')
        .insert([enrollmentData]);

      if (error) throw error;

      toast({
        title: "Enrollment Successful!",
        description: "You have been enrolled in the course. Redirecting to lessons...",
      });

      // Redirect to lesson viewer
      setTimeout(() => {
        navigate(`/course-viewer/${courseId}`);
      }, 1500);

    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: "There was an issue with your enrollment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="outline">{course.category_name}</Badge>
                {course.is_free ? (
                  <Badge variant="secondary">Free</Badge>
                ) : (
                  <Badge variant="default">${course.price}</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{course.short_description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">1,234 students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">4.8 (256 reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">3.5 hours total</span>
                </div>
              </div>
              
              {course.instructor_name && (
                <p className="text-sm text-gray-600">
                  Instructor: <span className="font-medium">{course.instructor_name}</span>
                </p>
              )}
            </div>

            {/* Preview Video */}
            {course.preview_video_url && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Course Preview</h3>
                <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={course.preview_video_url}
                    title="Course Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </AspectRatio>
              </div>
            )}
            
            {/* Course Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">About This Course</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
          </div>
          
          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounde-lg shadow-sm p-6 sticky top-6">
              {course.cover_image_url && (
                <AspectRatio ratio={16 / 9} className="mb-4">
                  <img
                    src={course.cover_image_url}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </AspectRatio>
              )}
              
              <div className="text-center mb-6">
                {course.is_free ? (
                  <div>
                    <p className="text-3xl font-bold text-green-600 mb-2">Free</p>
                    <p className="text-sm text-gray-600">Full lifetime access</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl font-bold mb-2">${course.price}</p>
                    <p className="text-sm text-gray-600">One-time payment</p>
                  </div>
                )}
              </div>
              
              <Button
                className="w-full mb-4"
                size="lg"
                onClick={course.is_free ? handleFreeEnrollment : handlePayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  "Processing..."
                ) : course.is_free ? (
                  "Enroll for Free"
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Access on mobile and desktop</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Downloadable resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Modules */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Course Content</h3>
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Module {moduleIndex + 1}: {module.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <Play className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{lessonIndex + 1}. {lesson.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
