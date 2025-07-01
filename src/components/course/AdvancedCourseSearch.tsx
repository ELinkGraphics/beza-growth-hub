import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X, Star, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SearchFilters {
  searchTerm: string;
  category: string;
  priceRange: [number, number];
  difficulty: string;
  duration: string;
  rating: number;
  instructor: string;
  sortBy: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  is_free: boolean;
  category_name?: string;
  instructor_name?: string;
  enrollment_count?: number;
  lesson_count?: number;
}

interface AdvancedCourseSearchProps {
  onFilterChange: (filteredCourses: Course[]) => void;
  allCourses: Course[];
}

export const AdvancedCourseSearch: React.FC<AdvancedCourseSearchProps> = ({
  onFilterChange,
  allCourses
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    category: "all",
    priceRange: [0, 500],
    difficulty: "all",
    duration: "all",
    rating: 0,
    instructor: "all",
    sortBy: "relevance"
  });

  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [instructors, setInstructors] = useState<Array<{id: string, name: string}>>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allCourses]);

  const fetchFilterOptions = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('course_categories')
        .select('id, name')
        .order('name');

      // Fetch instructors
      const { data: instructorsData } = await supabase
        .from('instructors')
        .select('id, name')
        .order('name');

      setCategories(categoriesData || []);
      setInstructors(instructorsData || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...allCourses];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower) ||
        course.short_description?.toLowerCase().includes(searchLower) ||
        course.category_name?.toLowerCase().includes(searchLower) ||
        course.instructor_name?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(course => course.category_name === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(course => {
      if (course.is_free) return filters.priceRange[0] === 0;
      return course.price >= filters.priceRange[0] && course.price <= filters.priceRange[1];
    });

    // Instructor filter
    if (filters.instructor !== "all") {
      filtered = filtered.filter(course => course.instructor_name === filters.instructor);
    }

    // Sort results
    switch (filters.sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        filtered.sort((a, b) => (b.enrollment_count || 0) - (a.enrollment_count || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    onFilterChange(filtered);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      category: "all",
      priceRange: [0, 500],
      difficulty: "all",
      duration: "all",
      rating: 0,
      instructor: "all",
      sortBy: "relevance"
    });
  };

  const hasActiveFilters = filters.searchTerm || 
    filters.category !== "all" || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 500 ||
    filters.instructor !== "all" ||
    filters.sortBy !== "relevance";

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search courses, instructors, topics..."
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
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

        <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value)}
                max={500}
                step={10}
                className="w-full"
              />
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium mb-2">Instructor</label>
              <Select value={filters.instructor} onValueChange={(value) => updateFilter('instructor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Instructor</SelectItem>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.name}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Level</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.searchTerm}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('searchTerm', '')}
              />
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('category', 'all')}
              />
            </Badge>
          )}
          {filters.instructor !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Instructor: {filters.instructor}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('instructor', 'all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
