
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, TrendingUp, Clock, Star, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  averageProgress: number;
  topCourses: Array<{
    id: string;
    title: string;
    enrollments: number;
    completion_rate: number;
  }>;
  recentEnrollments: Array<{
    student_name: string;
    course_title: string;
    enrolled_at: string;
  }>;
  monthlyRevenue: number;
}

export const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    averageProgress: 0,
    topCourses: [],
    recentEnrollments: [],
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("30");
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get total unique students
      const { data: studentsData, error: studentsError } = await supabase
        .from('course_enrollments')
        .select('email')
        .limit(1000);

      if (studentsError) throw studentsError;

      const uniqueStudents = new Set(studentsData?.map(s => s.email) || []).size;

      // Get total courses
      const { count: totalCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Get total enrollments
      const { count: totalEnrollments } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true });

      // Get top courses by enrollment
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          price,
          is_free
        `);

      if (coursesError) throw coursesError;

      const topCourses = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count: enrollmentCount } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            id: course.id,
            title: course.title,
            enrollments: enrollmentCount || 0,
            completion_rate: Math.floor(Math.random() * 100) // Simulated completion rate
          };
        })
      );

      // Sort by enrollments and take top 5
      topCourses.sort((a, b) => b.enrollments - a.enrollments);

      // Get recent enrollments
      const { data: recentEnrollmentsData, error: recentError } = await supabase
        .from('course_enrollments')
        .select(`
          student_name,
          enrolled_at,
          courses(title)
        `)
        .order('enrolled_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      const recentEnrollments = (recentEnrollmentsData || []).map(enrollment => ({
        student_name: enrollment.student_name,
        course_title: enrollment.courses?.title || 'Unknown Course',
        enrolled_at: enrollment.enrolled_at
      }));

      // Calculate monthly revenue (simulated)
      const monthlyRevenue = topCourses.reduce((total, course) => {
        const courseRevenue = coursesData?.find(c => c.id === course.id);
        if (courseRevenue && !courseRevenue.is_free) {
          return total + (course.enrollments * (courseRevenue.price || 0));
        }
        return total;
      }, 0);

      setAnalyticsData({
        totalStudents: uniqueStudents,
        totalCourses: totalCourses || 0,
        totalEnrollments: totalEnrollments || 0,
        averageProgress: 75, // Simulated average progress
        topCourses: topCourses.slice(0, 5),
        recentEnrollments,
        monthlyRevenue
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-3xl font-bold">{analyticsData.totalStudents}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-3xl font-bold">{analyticsData.totalCourses}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-3xl font-bold">{analyticsData.totalEnrollments}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-3xl font-bold">${analyticsData.monthlyRevenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.enrollments} enrollments</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <p className="text-sm text-gray-500 mt-1">{course.completion_rate}% completion</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentEnrollments.map((enrollment, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{enrollment.student_name}</p>
                    <p className="text-sm text-gray-500">{enrollment.course_title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
