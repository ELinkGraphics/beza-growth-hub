
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Plus, Edit, Trash2, Users, Award, Clock, Download, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CourseContent {
  id: string;
  lesson_id: number;
  title: string;
  video_url: string;
  duration: string;
  description: string;
  order_index: number;
  is_active: boolean;
}

interface Enrollment {
  id: string;
  student_name: string;
  email: string;
  phone: string;
  enrolled_at: string;
  completed_at: string | null;
  certificate_generated: boolean;
}

export const CourseManagement = () => {
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [editingLesson, setEditingLesson] = useState<CourseContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    completedCourses: 0,
    activeLessons: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCourseContent();
    fetchEnrollments();
    fetchStats();

    // Set up real-time subscriptions
    const courseContentChannel = supabase
      .channel('course-content-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_content' }, () => {
        fetchCourseContent();
        fetchStats();
      })
      .subscribe();

    const enrollmentsChannel = supabase
      .channel('enrollments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_enrollments' }, () => {
        fetchEnrollments();
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(courseContentChannel);
      supabase.removeChannel(enrollmentsChannel);
    };
  }, []);

  const fetchCourseContent = async () => {
    try {
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setCourseContent(data || []);
    } catch (error) {
      console.error('Error fetching course content:', error);
      toast({
        title: "Error",
        description: "Failed to load course content.",
        variant: "destructive",
      });
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [enrollmentsRes, completedRes, lessonsRes] = await Promise.all([
        supabase.from('course_enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('course_enrollments').select('*', { count: 'exact', head: true }).not('completed_at', 'is', null),
        supabase.from('course_content').select('*', { count: 'exact', head: true }).eq('is_active', true)
      ]);

      setStats({
        totalEnrollments: enrollmentsRes.count || 0,
        completedCourses: completedRes.count || 0,
        activeLessons: lessonsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSaveLesson = async (lessonData: Partial<CourseContent>) => {
    try {
      if (editingLesson) {
        // Update existing lesson
        const { error } = await supabase
          .from('course_content')
          .update({
            title: lessonData.title,
            video_url: lessonData.video_url,
            duration: lessonData.duration,
            description: lessonData.description,
            is_active: lessonData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingLesson.id);

        if (error) throw error;
        toast({ title: "Success", description: "Lesson updated successfully." });
      } else {
        // Create new lesson
        const maxOrderIndex = Math.max(...courseContent.map(c => c.order_index), 0);
        const { error } = await supabase
          .from('course_content')
          .insert({
            lesson_id: maxOrderIndex + 1,
            title: lessonData.title!,
            video_url: lessonData.video_url!,
            duration: lessonData.duration!,
            description: lessonData.description,
            order_index: maxOrderIndex + 1,
            is_active: lessonData.is_active ?? true
          });

        if (error) throw error;
        toast({ title: "Success", description: "Lesson created successfully." });
      }

      setIsDialogOpen(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: "Error",
        description: "Failed to save lesson.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      
      toast({ title: "Success", description: "Lesson deleted successfully." });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Error",
        description: "Failed to delete lesson.",
        variant: "destructive",
      });
    }
  };

  const generateCertificate = (enrollment: Enrollment) => {
    // Simple certificate generation - creates a downloadable text file
    const certificateContent = `
CERTIFICATE OF COMPLETION

This is to certify that

${enrollment.student_name}

has successfully completed the

Personal Branding Fundamentals Course

Date of Completion: ${enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : new Date().toLocaleDateString()}

Email: ${enrollment.email}
Phone: ${enrollment.phone}

Congratulations on your achievement!

---
Grow with Beza
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${enrollment.student_name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewCertificate = (enrollment: Enrollment) => {
    const certificateContent = `
CERTIFICATE OF COMPLETION

This is to certify that ${enrollment.student_name} has successfully completed the Personal Branding Fundamentals Course.

Date of Completion: ${enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : new Date().toLocaleDateString()}
Email: ${enrollment.email}
Phone: ${enrollment.phone}

Congratulations on your achievement!

---
Grow with Beza
    `;

    alert(certificateContent);
  };

  const markAsCompleted = async (enrollmentId: string) => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({
          completed_at: new Date().toISOString(),
          certificate_generated: true
        })
        .eq('id', enrollmentId);

      if (error) throw error;
      
      toast({ title: "Success", description: "Student marked as completed." });
    } catch (error) {
      console.error('Error marking as completed:', error);
      toast({
        title: "Error",
        description: "Failed to mark as completed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-brand-500 mr-2" />
              <span className="text-3xl font-bold">{stats.totalEnrollments}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-3xl font-bold">{stats.completedCourses}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-brand-500 mr-2" />
              <span className="text-3xl font-bold">{stats.activeLessons}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="enrollments">Student Enrollments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Course Content Management</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingLesson(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </DialogTrigger>
              <LessonDialog
                lesson={editingLesson}
                onSave={handleSaveLesson}
                onClose={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {courseContent.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Play className="h-8 w-8 text-brand-500" />
                      <div>
                        <h3 className="text-lg font-semibold">{lesson.title}</h3>
                        <p className="text-gray-600">{lesson.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">Duration: {lesson.duration}</span>
                          <Badge variant={lesson.is_active ? "default" : "secondary"}>
                            {lesson.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingLesson(lesson);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="enrollments" className="space-y-4">
          <h2 className="text-2xl font-bold">Student Enrollments</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">{enrollment.student_name}</TableCell>
                    <TableCell>{enrollment.email}</TableCell>
                    <TableCell>{enrollment.phone}</TableCell>
                    <TableCell>{new Date(enrollment.enrolled_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={enrollment.completed_at ? "default" : "secondary"}>
                        {enrollment.completed_at ? "Completed" : "In Progress"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!enrollment.completed_at && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsCompleted(enrollment.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                        {enrollment.completed_at && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewCertificate(enrollment)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateCertificate(enrollment)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface LessonDialogProps {
  lesson: CourseContent | null;
  onSave: (lesson: Partial<CourseContent>) => void;
  onClose: () => void;
}

const LessonDialog = ({ lesson, onSave, onClose }: LessonDialogProps) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    video_url: lesson?.video_url || '',
    duration: lesson?.duration || '',
    description: lesson?.description || '',
    is_active: lesson?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{lesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="video_url">Video URL</Label>
          <Input
            id="video_url"
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            placeholder="https://www.youtube.com/embed/..."
            required
          />
        </div>
        
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 45 min"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {lesson ? 'Update' : 'Create'} Lesson
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
