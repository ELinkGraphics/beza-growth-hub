
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, Clock, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  is_free: boolean;
  is_published: boolean;
  cover_image_url?: string;
  category_id?: string;
  instructor_id?: string;
  created_at?: string;
  updated_at?: string;
  category_name?: string;
  instructor_name?: string;
  enrollment_count?: number;
  rating?: number;
}

interface Category {
  id: string;
  name: string;
}

interface Instructor {
  id: string;
  name: string;
}

interface AdvancedCourseSearchProps {
  onCourseSelect?: (course: Course) => void;
}

export const AdvancedCourseSearch = ({ onCourseSelect }: AdvancedCourseSearchProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses with related data
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories(name),
          instructors(name)
        `)
        .eq('is_published', true);

      if (coursesError) throw coursesError;

      // Add enrollment counts and ratings (simulated for now)
      const coursesWithStats = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            ...course,
            category_name: course.course_categories?.name,
            instructor_name: course.instructors?.name,
            enrollment_count: count || 0,
            rating: Math.floor(Math.random() * 2) + 4 // Simulated 4-5 star rating
          };
        })
      );

      setCourses(coursesWithStats);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');
      setCategories(categoriesData || []);

      // Fetch instructors
      const { data: instructorsData } = await supabase
        .from('instructors')
        .select('*')
        .order('name');
      setInstructors(instructorsData || []);

    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || course.category_id === selectedCategory;
      const matchesInstructor = selectedInstructor === "all" || course.instructor_id === selectedInstructor;
      
      const matchesPrice = priceFilter === "all" ||
                          (priceFilter === "free" && course.is_free) ||
                          (priceFilter === "paid" && !course.is_free);

      return matchesSearch && matchesCategory && matchesInstructor && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case "oldest":
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popular":
          return (b.enrollment_count || 0) - (a.enrollment_count || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Course Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses by title, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Instructor</label>
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger>
                  <SelectValue placeholder="All Instructors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Instructors</SelectItem>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Price</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free Only</SelectItem>
                  <SelectItem value="paid">Paid Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-sm text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedInstructor("all");
                setPriceFilter("all");
                setSortBy("newest");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-0">
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-r from-brand-500 to-brand-600 rounded-t-lg">
                {course.cover_image_url ? (
                  <img
                    src={course.cover_image_url}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <span className="text-xl font-semibold">{course.title.charAt(0)}</span>
                  </div>
                )}
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                  {course.is_free ? (
                    <Badge className="bg-green-500 text-white">Free</Badge>
                  ) : (
                    <Badge className="bg-blue-500 text-white">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {course.price}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Course Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {course.short_description || course.description}
                  </p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrollment_count} students</span>
                  </div>
                </div>

                {/* Category and Instructor */}
                <div className="flex items-center justify-between">
                  {course.category_name && (
                    <Badge variant="outline" className="text-xs">
                      {course.category_name}
                    </Badge>
                  )}
                  {course.instructor_name && (
                    <span className="text-xs text-gray-500">
                      by {course.instructor_name}
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  className="w-full mt-3"
                  onClick={() => onCourseSelect?.(course)}
                >
                  View Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedInstructor("all");
                setPriceFilter("all");
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
