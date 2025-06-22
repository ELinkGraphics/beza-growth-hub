
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Download, 
  Play,
  Calendar,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface EnrolledCourse {
  id: string;
  course_id: string;
  course_title: string;
  course_description: string;
  cover_image_url?: string;
  progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  last_accessed?: string;
  enrollment_date: string;
  course_category: string;
  instructor_name: string;
  is_completed: boolean;
}

interface Certificate {
  id: string;
  course_title: string;
  issued_date: string;
  certificate_url: string;
}

interface QuizResult {
  id: string;
  quiz_title: string;
  course_title: string;
  score: number;
  max_score: number;
  passed: boolean;
  completed_at: string;
}

export const EnhancedStudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageScore: 0
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.email) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      // Fetch enrolled courses
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('email', user.email);

      if (enrollmentsError) throw enrollmentsError;

      // For each enrollment, fetch the course details
      const coursesWithProgress = await Promise.all(
        (enrollments || []).map(async (enrollment) => {
          // Get course details
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select(`
              *,
              course_categories(name),
              instructors(name)
            `)
            .eq('id', enrollment.course_id)
            .single();

          if (courseError) {
            console.error('Error fetching course:', courseError);
            return null;
          }

          // Get total lessons for this course
          const { count: totalLessons } = await supabase
            .from('course_content')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', enrollment.course_id)
            .eq('is_active', true);

          // Get completed lessons for this enrollment
          const { count: completedLessons } = await supabase
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('enrollment_id', enrollment.id)
            .not('completed_at', 'is', null);

          const progressPercentage = totalLessons > 0 
            ? Math.round(((completedLessons || 0) / totalLessons) * 100) 
            : 0;

          return {
            id: enrollment.id,
            course_id: enrollment.course_id,
            course_title: courseData?.title || 'Unknown Course',
            course_description: courseData?.description || '',
            cover_image_url: courseData?.cover_image_url,
            progress_percentage: progressPercentage,
            completed_lessons: completedLessons || 0,
            total_lessons: totalLessons || 0,
            last_accessed: enrollment.enrolled_at,
            enrollment_date: enrollment.enrolled_at,
            course_category: courseData?.course_categories?.name || 'Uncategorized',
            instructor_name: courseData?.instructors?.name || 'Unknown',
            is_completed: !!enrollment.completed_at
          };
        })
      );

      // Filter out any null results from failed course fetches
      const validCourses = coursesWithProgress.filter(course => course !== null) as EnrolledCourse[];
      setEnrolledCourses(validCourses);

      // Calculate stats
      const completedCount = validCourses.filter(c => c.is_completed).length;
      const totalHours = validCourses.length * 2; // Estimate 2 hours per course

      setStats({
        totalCourses: validCourses.length,
        completedCourses: completedCount,
        totalHours,
        averageScore: 0 // We'll implement this when we have quiz data
      });

      // For now, set empty arrays for certificates and quiz results
      // These can be implemented when the related tables are available
      setCertificates([]);
      setQuizResults([]);

    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const continueCourse = (courseId: string) => {
    // Navigate to course viewer
    window.location.href = `/course/${courseId}`;
  };

  const downloadCertificate = (certificateUrl: string, courseTitle: string) => {
    if (certificateUrl) {
      const link = document.createElement('a');
      link.href = certificateUrl;
      link.download = `${courseTitle}_Certificate.pdf`;
      link.click();
    } else {
      toast({
        title: "Certificate Not Available",
        description: "Certificate is being generated. Please check back later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'ST'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.user_metadata?.full_name || 'Student'}!
            </h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedCourses} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">
              Estimated time invested
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Quiz performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">
              Achievements earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz Results</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.length === 0 ? (
              <Card className="col-span-full text-center py-12">
                <CardContent>
                  <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                  <p className="text-gray-600">
                    Visit the Learn page to enroll in courses
                  </p>
                </CardContent>
              </Card>
            ) : (
              enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {course.cover_image_url ? (
                      <img
                        src={course.cover_image_url}
                        alt={course.course_title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-blue-500" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={course.is_completed ? "default" : "secondary"}>
                        {course.is_completed ? "Completed" : `${course.progress_percentage}%`}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{course.course_title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{course.course_category}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.completed_lessons}/{course.total_lessons} lessons</span>
                      </div>
                      <Progress value={course.progress_percentage} />
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => continueCourse(course.course_id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {course.progress_percentage === 0 ? 'Start Course' : 'Continue'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No enrolled courses to show progress for</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{course.course_title}</h4>
                        <Badge variant="outline">{course.course_category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Lessons: {course.completed_lessons}/{course.total_lessons}</span>
                          <span>Progress: {course.progress_percentage}%</span>
                        </div>
                        <Progress value={course.progress_percentage} />
                        <p className="text-xs text-gray-500">
                          Started: {new Date(course.enrollment_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="col-span-full text-center py-12">
              <CardContent>
                <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
                <p className="text-gray-600">
                  Complete courses to earn certificates
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No quiz attempts yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
