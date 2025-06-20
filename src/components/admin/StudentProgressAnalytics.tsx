
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudentProgress {
  enrollmentId: string;
  studentName: string;
  email: string;
  enrolledAt: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  lastActivity: string;
  timeSpent: string;
  status: 'active' | 'completed' | 'inactive';
}

interface DetailedProgress {
  lessonId: number;
  lessonTitle: string;
  completedAt: string | null;
  timeSpent: number;
  status: 'completed' | 'in-progress' | 'not-started';
}

export const StudentProgressAnalytics = () => {
  const [studentsProgress, setStudentsProgress] = useState<StudentProgress[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [detailedProgress, setDetailedProgress] = useState<DetailedProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentsProgress();
  }, []);

  const fetchStudentsProgress = async () => {
    try {
      setLoading(true);
      
      // Fetch enrollments with progress data
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('*')
        .order('enrolled_at', { ascending: false });

      if (enrollmentError) throw enrollmentError;

      // Fetch total lessons count
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_content')
        .select('id')
        .eq('is_active', true);

      if (lessonsError) throw lessonsError;

      const totalLessons = lessonsData?.length || 0;

      // Fetch progress for each enrollment
      const progressPromises = enrollments?.map(async (enrollment) => {
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('enrollment_id', enrollment.id);

        const completedLessons = progressData?.filter(p => p.completed_at)?.length || 0;
        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        // Get last activity
        const lastActivity = progressData?.length > 0 
          ? progressData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : enrollment.enrolled_at;

        // Determine status
        let status: 'active' | 'completed' | 'inactive' = 'active';
        if (enrollment.completed_at) {
          status = 'completed';
        } else if (new Date().getTime() - new Date(lastActivity).getTime() > 7 * 24 * 60 * 60 * 1000) {
          status = 'inactive';
        }

        return {
          enrollmentId: enrollment.id,
          studentName: enrollment.student_name,
          email: enrollment.email,
          enrolledAt: enrollment.enrolled_at,
          completedLessons,
          totalLessons,
          progressPercentage,
          lastActivity,
          timeSpent: "N/A", // Would need tracking implementation
          status
        };
      }) || [];

      const progressResults = await Promise.all(progressPromises);
      setStudentsProgress(progressResults);
    } catch (error) {
      console.error('Error fetching students progress:', error);
      toast({
        title: "Error",
        description: "Failed to load student progress data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedProgress = async (enrollmentId: string) => {
    try {
      // Fetch all lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from('course_content')
        .select('lesson_id, title')
        .eq('is_active', true)
        .order('order_index');

      if (lessonsError) throw lessonsError;

      // Fetch progress for this student
      const { data: progress, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('enrollment_id', enrollmentId);

      if (progressError) throw progressError;

      const detailedData = lessons?.map(lesson => {
        const lessonProgress = progress?.find(p => p.lesson_id === lesson.lesson_id);
        
        return {
          lessonId: lesson.lesson_id,
          lessonTitle: lesson.title,
          completedAt: lessonProgress?.completed_at || null,
          timeSpent: 0, // Would need tracking implementation
          status: lessonProgress?.completed_at ? 'completed' : 'not-started'
        };
      }) || [];

      setDetailedProgress(detailedData);
    } catch (error) {
      console.error('Error fetching detailed progress:', error);
      toast({
        title: "Error",
        description: "Failed to load detailed progress.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = async (student: StudentProgress) => {
    setSelectedStudent(student);
    await fetchDetailedProgress(student.enrollmentId);
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-blue-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-orange-500 text-white">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Loading student progress...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">
                {studentsProgress.filter(s => s.status === 'active').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                {studentsProgress.filter(s => s.status === 'completed').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-2xl font-bold">
                {studentsProgress.filter(s => s.status === 'inactive').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">
                {studentsProgress.length > 0 
                  ? Math.round(studentsProgress.reduce((acc, s) => acc + s.progressPercentage, 0) / studentsProgress.length)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsProgress.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No student progress data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  studentsProgress.map((student) => (
                    <TableRow key={student.enrollmentId}>
                      <TableCell className="font-medium">{student.studentName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={student.progressPercentage} className="w-20" />
                          <span className="text-sm font-medium">{student.progressPercentage}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {student.completedLessons}/{student.totalLessons} lessons
                        </p>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(student.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(student.lastActivity).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(student)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Detailed Progress - {selectedStudent?.studentName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedStudent?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Overall Progress</p>
                <p className="font-medium">{selectedStudent?.progressPercentage}%</p>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedProgress.map((lesson) => (
                    <TableRow key={lesson.lessonId}>
                      <TableCell className="font-medium">
                        Lesson {lesson.lessonId}: {lesson.lessonTitle}
                      </TableCell>
                      <TableCell>
                        {lesson.status === 'completed' ? (
                          <Badge variant="default" className="bg-green-500">Completed</Badge>
                        ) : (
                          <Badge variant="secondary">Not Started</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {lesson.completedAt 
                          ? new Date(lesson.completedAt).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
