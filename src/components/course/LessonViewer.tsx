
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play, CheckCircle, Clock, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LessonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  enrollmentId: string;
}

interface CourseLesson {
  id: string;
  lesson_id: number;
  title: string;
  video_url: string;
  duration: string;
  description: string;
  order_index: number;
  is_active: boolean;
}

interface LessonProgress {
  lesson_id: number;
  completed_at: string | null;
}

export const LessonViewer = ({ isOpen, onClose, studentName, enrollmentId }: LessonViewerProps) => {
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && enrollmentId) {
      fetchLessons();
      fetchProgress();
      
      // Set up real-time subscription for course content changes
      const courseContentChannel = supabase
        .channel('lesson-viewer-course-content')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'course_content' 
        }, (payload) => {
          console.log('Course content changed in lesson viewer:', payload);
          fetchLessons();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(courseContentChannel);
      };
    }
  }, [isOpen, enrollmentId]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching lessons:', error);
        throw error;
      }

      console.log('Fetched lessons for viewer:', data);
      setLessons(data || []);
      
      if (data && data.length > 0 && !currentLesson) {
        setCurrentLesson(data[0]);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load course content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed_at')
        .eq('enrollment_id', enrollmentId);

      if (error) {
        console.error('Error fetching progress:', error);
        throw error;
      }

      console.log('Fetched progress:', data);
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const markLessonComplete = async (lessonId: number, lessonTitle: string) => {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          enrollment_id: enrollmentId,
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'enrollment_id,lesson_id'
        })
        .select();

      if (error) {
        console.error('Error marking lesson complete:', error);
        throw error;
      }

      console.log('Marked lesson complete:', data);
      await fetchProgress();
      
      toast({
        title: "Lesson Completed!",
        description: `Great job completing "${lessonTitle}"!`,
      });
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete.",
        variant: "destructive",
      });
    }
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.some(p => p.lesson_id === lessonId && p.completed_at);
  };

  const getCompletedLessonsCount = () => {
    return progress.filter(p => p.completed_at).length;
  };

  const getProgressPercentage = () => {
    if (lessons.length === 0) return 0;
    return Math.round((getCompletedLessonsCount() / lessons.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Personal Branding Fundamentals Course</span>
            <Badge variant="outline" className="ml-4">
              Welcome, {studentName}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p>Loading course content...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Video Player */}
            <div className="lg:col-span-3 space-y-4">
              {currentLesson ? (
                <>
                  <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={currentLesson.video_url}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </AspectRatio>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">{currentLesson.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{currentLesson.duration}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600">{currentLesson.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Progress: {getCompletedLessonsCount()} of {lessons.length} lessons completed
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-brand-500 h-2 rounded-full transition-all"
                            style={{ width: `${getProgressPercentage()}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{getProgressPercentage()}%</span>
                      </div>
                      
                      {!isLessonCompleted(currentLesson.lesson_id) && (
                        <Button
                          onClick={() => markLessonComplete(currentLesson.lesson_id, currentLesson.title)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                      
                      {isLessonCompleted(currentLesson.lesson_id) && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">No lessons available at the moment.</p>
                    <p className="text-sm text-gray-400">New lessons will appear here when they are added.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Course Sidebar */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-brand-50 to-brand-100 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-800 mb-2">Course Progress</h4>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-brand-600" />
                  <span className="text-sm text-brand-700">
                    {getProgressPercentage()}% Complete
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Course Lessons</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {lessons.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No lessons available
                    </p>
                  ) : (
                    lessons.map((lesson, index) => (
                      <Card
                        key={lesson.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          currentLesson?.id === lesson.id 
                            ? 'ring-2 ring-brand-500 bg-brand-50' 
                            : ''
                        }`}
                        onClick={() => setCurrentLesson(lesson)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {isLessonCompleted(lesson.lesson_id) ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Play className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {index + 1}. {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
