
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseReviewSystem } from "./CourseReviewSystem";
import { LessonViewer } from "./LessonViewer";
import { QuizModal } from "./QuizModal";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name?: string;
  category_name?: string;
}

interface Enrollment {
  id: string;
  email: string;
  student_name: string;
  completed_at?: string;
}

interface EnhancedCourseViewerProps {
  courseId: string;
  userEmail?: string;
}

export const EnhancedCourseViewer = ({ courseId, userEmail }: EnhancedCourseViewerProps) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId, userEmail]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories(name),
          instructors(name)
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      setCourse({
        ...courseData,
        instructor_name: courseData.instructors?.name,
        category_name: courseData.course_categories?.name
      });

      // Fetch enrollment if user is logged in
      if (userEmail) {
        const { data: enrollmentData } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('email', userEmail)
          .single();

        setEnrollment(enrollmentData);
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Course not found.</p>
      </div>
    );
  }

  const isEnrolled = !!enrollment;
  const isCompleted = !!enrollment?.completed_at;
  const canReview = isEnrolled && isCompleted;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {course.instructor_name && (
              <span>Instructor: {course.instructor_name}</span>
            )}
            {course.category_name && (
              <span>Category: {course.category_name}</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{course.description}</p>
        </CardContent>
      </Card>

      {/* Course Content Tabs */}
      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-6">
          {isEnrolled ? (
            <LessonViewer 
              isOpen={true}
              onClose={() => {}}
              studentName={enrollment?.student_name || "Student"}
              enrollmentId={enrollment?.id || ""}
              courseId={courseId}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Enroll to Access Lessons</h3>
                <p className="text-gray-600 mb-4">
                  You need to enroll in this course to access the lessons.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
          {isEnrolled ? (
            <QuizModal 
              isOpen={true}
              onClose={() => {}}
              lessonTitle="Course Quizzes"
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Enroll to Access Quizzes</h3>
                <p className="text-gray-600 mb-4">
                  You need to enroll in this course to take quizzes.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <CourseReviewSystem
            courseId={courseId}
            enrollmentId={enrollment?.id}
            canReview={canReview}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
