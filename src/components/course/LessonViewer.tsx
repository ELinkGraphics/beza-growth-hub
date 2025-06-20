
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, CheckCircle, Clock, Award, Star, Download, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LessonComments } from "./LessonComments";
import { LessonFiles } from "./LessonFiles";
import { EnhancedCertificateModal } from "./EnhancedCertificateModal";
import { QuizModal } from "./QuizModal";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      
      // Set current lesson based on progress (resume functionality)
      if (data && data.length > 0) {
        await setResumeLesson(data);
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

  const setResumeLesson = async (lessonsData: CourseLesson[]) => {
    if (!currentLesson) {
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed_at')
        .eq('enrollment_id', enrollmentId)
        .order('lesson_id');

      if (progressData && progressData.length > 0) {
        const completedLessons = progressData.filter(p => p.completed_at);
        const lastCompletedLessonId = completedLessons.length > 0 
          ? Math.max(...completedLessons.map(p => p.lesson_id))
          : 0;

        const nextLesson = lessonsData.find(lesson => 
          lesson.lesson_id > lastCompletedLessonId
        ) || lessonsData[0];

        setCurrentLesson(nextLesson);
      } else {
        setCurrentLesson(lessonsData[0]);
      }
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
    setIsMarkingComplete(true);
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({
          enrollment_id: enrollmentId,
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          completed_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error marking lesson complete:', error);
        throw error;
      }

      console.log('Marked lesson complete:', data);
      await fetchProgress();
      
      toast({
        title: "🎉 Lesson Completed!",
        description: `Great job completing "${lessonTitle}"!`,
      });

      // Show quiz for completed lesson
      setShowQuiz(true);

      // Auto-advance to next lesson if available
      const currentIndex = lessons.findIndex(l => l.lesson_id === lessonId);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        setTimeout(() => {
          setCurrentLesson(nextLesson);
          toast({
            title: "📚 Next Lesson Ready",
            description: `Moving to "${nextLesson.title}"`,
          });
        }, 2000);
      } else {
        // Check if all lessons are completed
        const newCompletedCount = getCompletedLessonsCount() + 1;
        if (newCompletedCount === lessons.length) {
          setTimeout(() => {
            toast({
              title: "🏆 Course Completed!",
              description: "Congratulations! You've completed all lessons. View your certificate!",
            });
            setShowCertificate(true);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete.",
        variant: "destructive",
      });
    } finally {
      setIsMarkingComplete(false);
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

  const LessonSidebar = ({ className = "", inSheet = false }) => (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-gradient-to-r from-brand-50 to-brand-100 p-4 rounded-lg">
        <h4 className="font-semibold text-brand-800 mb-2">Course Progress</h4>
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-brand-600" />
          <span className="text-sm text-brand-700">
            {getProgressPercentage()}% Complete
          </span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h4 className="font-semibold mb-3">Course Lessons</h4>
        <ScrollArea className={inSheet ? "h-[60vh]" : "flex-1"}>
          <div className="space-y-2 pr-2">
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
                  onClick={() => {
                    setCurrentLesson(lesson);
                    if (inSheet) setIsSidebarOpen(false);
                  }}
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
        </ScrollArea>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[95vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-4 flex-shrink-0">
            <DialogTitle className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-lg sm:text-xl">Personal Branding Fundamentals Course</span>
              <div className="flex items-center gap-2">
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 sm:w-96">
                    <LessonSidebar inSheet />
                  </SheetContent>
                </Sheet>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Welcome back, {studentName}
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription className="text-sm">
              Continue your learning journey and track your progress through our comprehensive course.
            </DialogDescription>
          </DialogHeader>
          
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <p>Loading course content...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-6 pb-6 flex-1 min-h-0">
              {/* Video Player and Content - Main scrollable area */}
              <div className="lg:col-span-3 flex flex-col min-h-0">
                <ScrollArea className="flex-1">
                  {currentLesson ? (
                    <div className="space-y-6 pr-4">
                      {/* Video Section */}
                      <div className="space-y-4">
                        <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden">
                          <iframe
                            src={currentLesson.video_url}
                            title={currentLesson.title}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </AspectRatio>
                        
                        {/* Video Header with Mark Complete Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">{currentLesson.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{currentLesson.duration}</span>
                            </div>
                          </div>
                          
                          {!isLessonCompleted(currentLesson.lesson_id) ? (
                            <Button
                              onClick={() => markLessonComplete(currentLesson.lesson_id, currentLesson.title)}
                              disabled={isMarkingComplete}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 w-full sm:w-auto"
                              size="lg"
                            >
                              {isMarkingComplete ? (
                                "Marking Complete..."
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Complete
                                </>
                              )}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 w-full sm:w-auto justify-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Lesson Description */}
                      <Card>
                        <CardContent className="p-4 sm:p-6">
                          <h4 className="font-semibold text-lg mb-3">About This Lesson</h4>
                          <p className="text-gray-600 leading-relaxed mb-4">{currentLesson.description}</p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-blue-800 mb-2">Key Learning Objectives:</h5>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Understanding the fundamentals covered in this module</li>
                              <li>• Practical applications you can implement immediately</li>
                              <li>• Real-world examples and case studies</li>
                              <li>• Next steps for continued learning</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Progress Section */}
                      <Card>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <h4 className="font-semibold text-lg">Your Progress</h4>
                            <div className="flex items-center space-x-2">
                              <Star className="h-5 w-5 text-yellow-500" />
                              <span className="font-medium">{getProgressPercentage()}% Complete</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600 flex-wrap gap-1">
                              <span>{getCompletedLessonsCount()} of {lessons.length} lessons completed</span>
                              <span>{lessons.length - getCompletedLessonsCount()} remaining</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-brand-500 to-brand-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${getProgressPercentage()}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Lesson Files */}
                      <LessonFiles lessonId={currentLesson.lesson_id} />
                      
                      {/* Lesson Comments */}
                      <LessonComments 
                        lessonId={currentLesson.lesson_id} 
                        lessonTitle={currentLesson.title}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <p className="text-gray-500 mb-4">No lessons available at the moment.</p>
                        <p className="text-sm text-gray-400">New lessons will appear here when they are added.</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
              
              {/* Desktop Sidebar */}
              <div className="hidden lg:block">
                <LessonSidebar className="h-full" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      <QuizModal 
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        lessonTitle={currentLesson?.title || ""}
      />

      {/* Enhanced Certificate Modal */}
      <EnhancedCertificateModal 
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        studentName={studentName}
        courseName="Personal Branding Fundamentals"
        completionDate={new Date().toLocaleDateString()}
      />
    </>
  );
};
