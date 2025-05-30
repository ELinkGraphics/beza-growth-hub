
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Play, Award, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LessonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  enrollmentId: string;
}

interface Lesson {
  id: string;
  lesson_id: number;
  title: string;
  video_url: string;
  duration: string;
  description: string;
  order_index: number;
}

interface LessonProgress {
  lesson_id: number;
  completed_at: string | null;
}

export const LessonViewer = ({ isOpen, onClose, studentName, enrollmentId }: LessonViewerProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && enrollmentId) {
      fetchLessons();
      fetchProgress();
    }
  }, [isOpen, enrollmentId]);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load course content.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed_at')
        .eq('enrollment_id', enrollmentId);

      if (error) throw error;
      
      setProgress(data || []);
      const completed = data?.filter(p => p.completed_at).map(p => p.lesson_id) || [];
      setCompletedLessons(completed);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const markLessonComplete = async (lessonId: number, lessonTitle: string) => {
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          enrollment_id: enrollmentId,
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      setCompletedLessons(prev => [...prev, lessonId]);
      
      toast({
        title: "Lesson Completed!",
        description: `Great job completing "${lessonTitle}"`,
      });

      // Check if all lessons are completed
      if (completedLessons.length + 1 === lessons.length) {
        await generateCertificate();
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast({
        title: "Error",
        description: "Failed to save progress.",
        variant: "destructive",
      });
    }
  };

  const generateCertificate = async () => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({
          completed_at: new Date().toISOString(),
          certificate_generated: true
        })
        .eq('id', enrollmentId);

      if (error) throw error;
      
      setShowCertificate(true);
      toast({
        title: "Congratulations!",
        description: "You've completed the course! Your certificate is ready.",
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const currentLesson = lessons[currentLessonIndex];
  const progressPercentage = (completedLessons.length / lessons.length) * 100;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-8">
            <p>Loading course content...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showCertificate) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center p-8">
            <Award className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You have successfully completed the Fundamentals of Personal Branding course.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Certificate of Completion</h3>
              <p className="text-gray-600">This certifies that</p>
              <p className="text-2xl font-bold text-brand-600 my-2">{studentName}</p>
              <p className="text-gray-600">has successfully completed</p>
              <p className="text-lg font-semibold text-gray-800">Fundamentals of Personal Branding</p>
              <p className="text-sm text-gray-500 mt-4">
                Completed on {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <Button className="bg-brand-500 hover:bg-brand-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Personal Branding Course</DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">Progress: {completedLessons.length} of {lessons.length} lessons completed</span>
            <Progress value={progressPercentage} className="w-32" />
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Lesson List */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">Course Content</h3>
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentLessonIndex
                    ? 'bg-brand-100 border border-brand-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${
                  completedLessons.includes(lesson.lesson_id) ? 'border-green-300' : ''
                }`}
                onClick={() => {
                  if (index === 0 || completedLessons.includes(lessons[index - 1]?.lesson_id)) {
                    setCurrentLessonIndex(index);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {completedLessons.includes(lesson.lesson_id) ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Play className="h-4 w-4 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{lesson.title}</p>
                    <p className="text-xs text-gray-500">{lesson.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Video Player */}
          <div className="lg:col-span-3">
            {currentLesson && (
              <div>
                <h2 className="text-xl font-semibold mb-4">{currentLesson.title}</h2>
                <div className="aspect-video bg-black rounded-lg mb-4">
                  <iframe
                    src={currentLesson.video_url}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 mb-2">{currentLesson.description}</p>
                    <p className="text-sm text-gray-500">Duration: {currentLesson.duration}</p>
                  </div>
                  
                  {!completedLessons.includes(currentLesson.lesson_id) && (
                    <Button
                      onClick={() => markLessonComplete(currentLesson.lesson_id, currentLesson.title)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
