
import { useState, useEffect } from 'react';

interface GuestProgress {
  email: string;
  completedLessons: number[];
  currentLesson: number;
  timeSpent: number;
  startedAt: string;
}

export const useGuestLearning = () => {
  const [guestProgress, setGuestProgress] = useState<GuestProgress | null>(null);
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);

  useEffect(() => {
    // Load guest progress from localStorage
    const saved = localStorage.getItem('guestLearningProgress');
    if (saved) {
      try {
        setGuestProgress(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading guest progress:', error);
      }
    }
  }, []);

  const saveGuestProgress = (progress: Partial<GuestProgress>) => {
    const updated = { ...guestProgress, ...progress } as GuestProgress;
    setGuestProgress(updated);
    localStorage.setItem('guestLearningProgress', JSON.stringify(updated));
  };

  const initializeGuestLearning = (email: string) => {
    const progress: GuestProgress = {
      email,
      completedLessons: [],
      currentLesson: 1,
      timeSpent: 0,
      startedAt: new Date().toISOString()
    };
    saveGuestProgress(progress);
  };

  const markLessonComplete = (lessonId: number) => {
    if (!guestProgress) return;
    
    const completedLessons = [...guestProgress.completedLessons];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }
    
    saveGuestProgress({ completedLessons });
    
    // Show registration prompt after 3 completed lessons
    if (completedLessons.length >= 3) {
      setShowRegistrationPrompt(true);
    }
  };

  const updateTimeSpent = (minutes: number) => {
    if (!guestProgress) return;
    
    const newTimeSpent = guestProgress.timeSpent + minutes;
    saveGuestProgress({ timeSpent: newTimeSpent });
    
    // Show registration prompt after 30 minutes
    if (newTimeSpent >= 30) {
      setShowRegistrationPrompt(true);
    }
  };

  const convertGuestToUser = async (userId: string) => {
    if (!guestProgress) return null;
    
    // Return progress data to be saved to database
    const progressData = {
      userId,
      email: guestProgress.email,
      completedLessons: guestProgress.completedLessons,
      timeSpent: guestProgress.timeSpent,
      startedAt: guestProgress.startedAt
    };
    
    // Clear localStorage
    localStorage.removeItem('guestLearningProgress');
    setGuestProgress(null);
    
    return progressData;
  };

  return {
    guestProgress,
    showRegistrationPrompt,
    setShowRegistrationPrompt,
    initializeGuestLearning,
    markLessonComplete,
    updateTimeSpent,
    convertGuestToUser
  };
};
