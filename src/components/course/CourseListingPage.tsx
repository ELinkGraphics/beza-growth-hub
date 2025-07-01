
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Play, Star, Clock, Users, DollarSign, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { EnrollmentForm } from "./EnrollmentForm";
import { GuestLearningModal } from "@/components/learning/GuestLearningModal";

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
  enrollment_count?: number;
  lesson_count?: number;
  is_enrolled?: boolean;
}

interface Category {
  id: string;
  name: string;
}

export const CourseListingPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, priceFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch published courses with related data
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories(name),
          instructors(name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Enhance courses with additional data
      const enhancedCourses = await Promise.all(
        (coursesData || []).map(async (course) => {
          // Get enrollment count using UUID course ID
          const { count: enrollmentCount } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          // Get lesson count from course_content using UUID course ID
          const { count: lessonCount } = await supabase
            .from('course_content')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
            .eq('is_active', true);

          // Check if user is enrolled (if authenticated)
          let isEnrolled = false;
          if (user?.email) {
            const { data: enrollmentData } = await supabase
              .from('course_enrollments')
              .select('id')
              .eq('course_id', course.id)
              .eq('email', user.email)
              .maybeSingle();
            
            isEnrolled = !!enrollmentData;
          }

          return {
            ...course,
            category_name: course.course_categories?.name,
            instructor_name: course.instructors?.name,
            enrollment_count: enrollmentCount || 0,
            lesson_count: lessonCount || 0,
            is_enrolled: isEnrolled
          };
        })
      );

      setCourses(enhancedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category_name === selectedCategory);
    }

    // Price filter
    if (priceFilter === "free") {
      filtered = filtered.filter(course => course.is_free);
    } else if (priceFilter === "paid") {
      filtered = filtered.filter(course => !course.is_free);
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (course: Course) => {
    if (!user) {
      // Show guest learning modal for non-authenticated users
      setSelectedCourse(course);
      setShowEnrollment(true);
      return;
    }

    if (course.is_enrolled) {
      // Navigate to course dashboard
      window.location.href = '/student-dashboard';
      return;
    }

    // For authenticated users, enroll directly without modal
    if (course.is_free) {
      await enrollUserDirectly(course);
    } else {
      // Handle paid course enrollment
      handlePaidEnrollment(course);
    }
  };

  const enrollUserDirectly = async (course: Course) => {
    try {
      // Get user info from auth
      const userEmail = user?.email;
      const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
      
      if (!userEmail) {
        toast({
          title: "Error",
          description: "Unable to get user information. Please try signing in again.",
          variant: "destructive",
        });
        return;
      }

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', course.id)
        .eq('email', userEmail)
        .maybeSingle();

      if (existingEnrollment) {
        toast({
          title: "Already Enrolled",
          description: "You are already enrolled in this course!",
          variant: "destructive",
        });
        return;
      }

      // Insert enrollment with proper UUID course ID
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          student_name: userName,
          email: userEmail,
          phone: '', // We can make this optional or get from user profile
          course_id: course.id // Using UUID course ID
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Enrollment Successful!",
        description: `Welcome to ${course.title}. Let's start learning!`,
      });

      // Refresh courses to show enrollment status
      fetchCourses();
    } catch (error) {
      console.error('Error enrolling user:', error);
      toast({
        title: "Enrollment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handlePaidEnrollment = async (course: Course) => {
    try {
      // Create purchase record and redirect to payment
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          course_id: course.id,
          amount: course.price,
          course_title: course.title
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {course.cover_image_url ? (
          <img
            src={course.cover_image_url}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-blue-500" />
          </div>
        )}
        {course.preview_video_url && (
          <Button
            size="sm"
            className="absolute top-2 right-2 bg-black/70 hover:bg-black/80"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant={course.is_free ? "secondary" : "default"}>
            {course.is_free ? "Free" : `$${course.price}`}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{course.short_description}</p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {course.enrollment_count} enrolled
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.lesson_count} lessons
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <Badge variant="outline">{course.category_name}</Badge>
              {course.instructor_name && (
                <p className="text-sm text-gray-600 mt-1">
                  by {course.instructor_name}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <Button
          className="w-full"
          onClick={() => handleEnroll(course)}
          variant={course.is_enrolled ? "outline" : "default"}
        >
          {course.is_enrolled ? "Continue Learning" : "Enroll Now"}
        </Button>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover courses that will help you grow professionally and personally
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria to find more courses.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Guest Enrollment Modal (only for non-authenticated users) */}
      {selectedCourse && !user && (
        <Dialog open={showEnrollment} onOpenChange={setShowEnrollment}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Continue Learning</DialogTitle>
            </DialogHeader>
            <GuestLearningModal
              isOpen={showEnrollment}
              onClose={() => setShowEnrollment(false)}
              onGuestContinue={(email) => {
                // Handle guest enrollment with just email
                console.log('Guest enrollment:', email);
                setShowEnrollment(false);
              }}
              onCreateAccount={(email, name) => {
                // Redirect to auth page with pre-filled data
                window.location.href = '/auth';
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Traditional Enrollment Form (fallback) */}
      {selectedCourse && user && (
        <Dialog open={showEnrollment} onOpenChange={setShowEnrollment}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Enroll in {selectedCourse.title}</DialogTitle>
            </DialogHeader>
            <EnrollmentForm
              courseId={selectedCourse.id}
              courseTitle={selectedCourse.title}
              onSuccess={() => {
                setShowEnrollment(false);
                fetchCourses();
              }}
              onCancel={() => setShowEnrollment(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
