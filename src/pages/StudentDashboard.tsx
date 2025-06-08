
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, Award, User, LogOut, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

interface CourseProgress {
  course_id: string;
  course_name: string;
  progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  last_accessed: string;
}

const StudentDashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser({
        id: session.user.id,
        email: session.user.email || "",
        full_name: session.user.user_metadata?.full_name || "Student",
        avatar_url: session.user.user_metadata?.avatar_url,
        created_at: session.user.created_at
      });

      await fetchCourseProgress(session.user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseProgress = async (userId: string) => {
    try {
      // Mock data for now - would fetch from enrollments and progress tables
      const mockProgress: CourseProgress[] = [
        {
          course_id: "personal-branding-fundamentals",
          course_name: "Personal Branding Fundamentals",
          progress_percentage: 75,
          completed_lessons: 3,
          total_lessons: 4,
          last_accessed: new Date().toISOString()
        }
      ];
      setCourseProgress(mockProgress);
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>
                {user?.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.full_name}!
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courseProgress.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +1 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {courseProgress.reduce((acc, course) => acc + course.completed_lessons, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Great progress!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(courseProgress.reduce((acc, course) => acc + course.progress_percentage, 0) / courseProgress.length || 0)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keep it up!
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
              </CardHeader>
              <CardContent>
                {courseProgress.map((course) => (
                  <div key={course.course_id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{course.course_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.completed_lessons} of {course.total_lessons} lessons completed
                      </p>
                      <Progress value={course.progress_percentage} className="w-full" />
                    </div>
                    <Button className="ml-4">Continue</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courseProgress.map((course) => (
                    <Card key={course.course_id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{course.course_name}</CardTitle>
                        <Badge variant="outline">
                          {course.progress_percentage}% Complete
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <Progress value={course.progress_percentage} className="mb-4" />
                        <p className="text-sm text-gray-600 mb-4">
                          {course.completed_lessons} of {course.total_lessons} lessons completed
                        </p>
                        <Button className="w-full">Continue Learning</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <Button className="mt-4" onClick={() => navigate("/book")}>
                    Book an Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>My Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Complete a course to earn your first certificate</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
