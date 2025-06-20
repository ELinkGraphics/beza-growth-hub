
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, DollarSign, Users, BookOpen, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  is_free: boolean;
  is_published: boolean;
  cover_image_url?: string;
  preview_video_url?: string;
  category_id?: string;
  instructor_id?: string;
  created_at: string;
  category_name?: string;
  instructor_name?: string;
  enrollment_count?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Instructor {
  id: string;
  name: string;
  bio: string;
  email: string;
}

export const EnhancedCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState("courses");
  const { toast } = useToast();

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    short_description: "",
    price: 0,
    is_free: true,
    category_id: "",
    instructor_id: "",
    cover_image_url: "",
    preview_video_url: "",
    is_published: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses with category and instructor names
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories(name),
          instructors(name)
        `)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch enrollment counts for each course
      const coursesWithCounts = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            ...course,
            category_name: course.course_categories?.name,
            instructor_name: course.instructors?.name,
            enrollment_count: count || 0
          };
        })
      );

      setCourses(coursesWithCounts);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch instructors
      const { data: instructorsData, error: instructorsError } = await supabase
        .from('instructors')
        .select('*')
        .order('name');

      if (instructorsError) throw instructorsError;
      setInstructors(instructorsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load course data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const courseData = {
        ...courseForm,
        price: courseForm.is_free ? 0 : courseForm.price
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course created successfully.",
        });
      }

      setDialogOpen(false);
      setEditingCourse(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "Failed to save course.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      short_description: course.short_description,
      price: course.price,
      is_free: course.is_free,
      category_id: course.category_id || "",
      instructor_id: course.instructor_id || "",
      cover_image_url: course.cover_image_url || "",
      preview_video_url: course.preview_video_url || "",
      is_published: course.is_published
    });
    setDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deleted successfully.",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Course ${!currentStatus ? 'published' : 'unpublished'} successfully.`,
      });

      fetchData();
    } catch (error) {
      console.error('Error updating course status:', error);
      toast({
        title: "Error",
        description: "Failed to update course status.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCourseForm({
      title: "",
      description: "",
      short_description: "",
      price: 0,
      is_free: true,
      category_id: "",
      instructor_id: "",
      cover_image_url: "",
      preview_video_url: "",
      is_published: false
    });
  };

  const handleCreateNew = () => {
    setEditingCourse(null);
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-3xl font-bold">{courses.length}</span>
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
              <Eye className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-3xl font-bold">
                {courses.filter(c => c.is_published).length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Paid Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-3xl font-bold">
                {courses.filter(c => !c.is_free).length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-3xl font-bold">
                {courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Management</CardTitle>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-500">{course.short_description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.category_name || 'Uncategorized'}</Badge>
                    </TableCell>
                    <TableCell>{course.instructor_name || 'No instructor'}</TableCell>
                    <TableCell>
                      {course.is_free ? (
                        <Badge variant="secondary">Free</Badge>
                      ) : (
                        <span className="font-medium">${course.price}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{course.enrollment_count}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={course.is_published}
                          onCheckedChange={() => togglePublished(course.id, course.is_published)}
                        />
                        <span className="text-sm">
                          {course.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Course Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Course Title</label>
                <Input
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select 
                  value={courseForm.category_id} 
                  onValueChange={(value) => setCourseForm({...courseForm, category_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Short Description</label>
              <Input
                value={courseForm.short_description}
                onChange={(e) => setCourseForm({...courseForm, short_description: e.target.value})}
                placeholder="Brief description for course listing"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Full Description</label>
              <Textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Instructor</label>
                <Select 
                  value={courseForm.instructor_id} 
                  onValueChange={(value) => setCourseForm({...courseForm, instructor_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cover Image URL</label>
                <Input
                  value={courseForm.cover_image_url}
                  onChange={(e) => setCourseForm({...courseForm, cover_image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Preview Video URL</label>
              <Input
                value={courseForm.preview_video_url}
                onChange={(e) => setCourseForm({...courseForm, preview_video_url: e.target.value})}
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={courseForm.is_free}
                  onCheckedChange={(checked) => setCourseForm({...courseForm, is_free: checked})}
                />
                <label className="text-sm font-medium">Free Course</label>
              </div>
              
              {!courseForm.is_free && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({...courseForm, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={courseForm.is_published}
                onCheckedChange={(checked) => setCourseForm({...courseForm, is_published: checked})}
              />
              <label className="text-sm font-medium">Publish Course</label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
