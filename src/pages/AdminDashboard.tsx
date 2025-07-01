import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, ArrowLeft, Book, User, Settings, GraduationCap, PlayCircle, BarChart, FolderOpen, HelpCircle } from "lucide-react";
import { AppointmentsList } from "./AppointmentsList";
import { ContactsList } from "./ContactsList";
import { EnhancedCourseManagement } from "@/components/admin/EnhancedCourseManagement";
import { LessonManagement } from "@/components/admin/LessonManagement";
import { BulkOperations } from "@/components/admin/BulkOperations";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { QuizManagement } from "@/components/admin/QuizManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import WebsiteCustomizer from "@/components/admin/WebsiteCustomizer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalContacts: 0,
    newContacts: 0,
    totalEnrollments: 0,
    totalCourses: 0,
    publishedCourses: 0
  });
  const { toast } = useToast();
  
  // Check authentication and fetch stats
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/admin");
          return;
        }
        
        setIsAuthenticated(true);
        
        // Fetch comprehensive stats
        const [
          appointmentsRes, 
          pendingAppointmentsRes, 
          contactsRes, 
          newContactsRes, 
          enrollmentsRes,
          coursesRes,
          publishedCoursesRes
        ] = await Promise.all([
          supabase.from("appointments").select("*", { count: 'exact', head: true }),
          supabase.from("appointments").select("*", { count: 'exact', head: true }).eq("status", "pending"),
          supabase.from("contacts").select("*", { count: 'exact', head: true }),
          supabase.from("contacts").select("*", { count: 'exact', head: true }).eq("is_read", false),
          supabase.from("course_enrollments").select("*", { count: 'exact', head: true }),
          supabase.from("courses").select("*", { count: 'exact', head: true }),
          supabase.from("courses").select("*", { count: 'exact', head: true }).eq("is_published", true),
        ]);
        
        setStats({
          totalAppointments: appointmentsRes.count || 0,
          pendingAppointments: pendingAppointmentsRes.count || 0,
          totalContacts: contactsRes.count || 0,
          newContacts: newContactsRes.count || 0,
          totalEnrollments: enrollmentsRes.count || 0,
          totalCourses: coursesRes.count || 0,
          publishedCourses: publishedCoursesRes.count || 0
        });
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          title: "Authentication Error",
          description: "Please log in again.",
          variant: "destructive",
        });
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out.",
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Grow with Beza
              </span>
              <span className="bg-brand-100 text-brand-700 text-sm px-2 py-1 rounded">
                Admin
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Website</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-brand-500 text-brand-600 hover:bg-brand-50"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Book className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-3xl font-bold">{stats.totalCourses}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Published Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-3xl font-bold">{stats.publishedCourses}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Course Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-3xl font-bold">{stats.totalEnrollments}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-brand-500 mr-2" />
                <span className="text-3xl font-bold">{stats.totalAppointments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-accent-500 mr-2" />
                <span className="text-3xl font-bold">{stats.pendingAppointments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-5 w-5 text-brand-500 mr-2" />
                <span className="text-3xl font-bold">{stats.totalContacts}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                New Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-accent-500 mr-2" />
                <span className="text-3xl font-bold">{stats.newContacts}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs 
          defaultValue="analytics"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="mb-6 grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="analytics" className="text-xs">
              <BarChart className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-xs">
              <GraduationCap className="h-4 w-4 mr-1" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs">
              <FolderOpen className="h-4 w-4 mr-1" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="lessons" className="text-xs">
              <PlayCircle className="h-4 w-4 mr-1" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="text-xs">
              <HelpCircle className="h-4 w-4 mr-1" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="students" className="text-xs">
              <User className="h-4 w-4 mr-1" />
              Students
            </TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs">
              <Calendar className="h-4 w-4 mr-1" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs">
              <Mail className="h-4 w-4 mr-1" />
              Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="courses">
            <EnhancedCourseManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="lessons">
            <LessonManagement />
          </TabsContent>

          <TabsContent value="quizzes">
            <QuizManagement />
          </TabsContent>

          <TabsContent value="students">
            <BulkOperations />
          </TabsContent>
          
          <TabsContent value="appointments">
            <AppointmentsList />
          </TabsContent>
          
          <TabsContent value="contacts">
            <ContactsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
