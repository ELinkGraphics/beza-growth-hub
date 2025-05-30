
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Play, Lock, Award } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  duration: string;
  completed: boolean;
}

interface LessonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export const LessonViewer = ({ isOpen, onClose, studentName }: LessonViewerProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Module 1: Understanding Personal Branding",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual YouTube URL
      duration: "45 min",
      completed: false
    },
    {
      id: 2,
      title: "Module 2: Defining Your Brand Identity",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual YouTube URL
      duration: "60 min",
      completed: false
    },
    {
      id: 3,
      title: "Module 3: Content Creation Strategies",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual YouTube URL
      duration: "90 min",
      completed: false
    },
    {
      id: 4,
      title: "Module 4: Building Your Online Presence",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual YouTube URL
      duration: "75 min",
      completed: false
    }
  ]);

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progress = (completedLessons / lessons.length) * 100;
  const allCompleted = completedLessons === lessons.length;

  const markLessonComplete = (lessonId: number) => {
    setLessons(prev => 
      prev.map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      )
    );
    setCurrentLesson(null);
    
    // Check if all lessons are completed
    const updatedLessons = lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, completed: true } : lesson
    );
    
    if (updatedLessons.every(lesson => lesson.completed)) {
      setTimeout(() => setShowCertificate(true), 1000);
    }
  };

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  if (showCertificate) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <Award className="h-20 w-20 text-yellow-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800">
              🎉 Congratulations!
            </h2>
            
            <div className="bg-gradient-to-r from-brand-50 to-blue-50 p-8 rounded-lg border-2 border-brand-200">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Certificate of Completion</h3>
                <div className="border-b-2 border-gray-300 pb-4">
                  <p className="text-lg text-gray-600">This certifies that</p>
                  <p className="text-3xl font-bold text-brand-600 my-2">{studentName}</p>
                  <p className="text-lg text-gray-600">has successfully completed</p>
                </div>
                <div className="py-4">
                  <h4 className="text-xl font-semibold text-gray-800">
                    Fundamentals of Personal Branding
                  </h4>
                  <p className="text-gray-600 mt-2">
                    A comprehensive course covering brand identity, content creation,
                    and online presence building
                  </p>
                </div>
                <div className="border-t-2 border-gray-300 pt-4">
                  <p className="text-sm text-gray-500">
                    Completed on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => window.print()}
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3"
              >
                Download Certificate
              </Button>
              <br />
              <Button
                variant="outline"
                onClick={onClose}
                className="px-8 py-3"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (currentLesson) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentLesson.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={currentLesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Duration: {currentLesson.duration}</span>
              <Button
                onClick={() => markLessonComplete(currentLesson.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Mark as Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Fundamentals of Personal Branding
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">Welcome, {studentName}!</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Course Progress</span>
                <span>{completedLessons}/{lessons.length} lessons completed</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Course Lessons</h3>
            
            {lessons.map((lesson, index) => {
              const isAvailable = index === 0 || lessons[index - 1]?.completed;
              
              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    lesson.completed
                      ? 'bg-green-50 border-green-200'
                      : isAvailable
                      ? 'bg-white border-gray-200 hover:border-brand-300'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        lesson.completed
                          ? 'bg-green-500 text-white'
                          : isAvailable
                          ? 'bg-brand-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isAvailable ? (
                          <Play className="h-5 w-5" />
                        ) : (
                          <Lock className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${
                          isAvailable ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                    
                    {isAvailable && !lesson.completed && (
                      <Button
                        onClick={() => startLesson(lesson)}
                        className="bg-brand-500 hover:bg-brand-600 text-white"
                      >
                        Start Lesson
                      </Button>
                    )}
                    
                    {lesson.completed && (
                      <span className="text-green-600 font-medium">Completed ✓</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {allCompleted && (
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Course Completed! 🎉
              </h3>
              <p className="text-green-700">
                Congratulations on completing all lessons. Your certificate is ready!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
