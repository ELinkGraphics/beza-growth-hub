
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Award } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
}

export const QuizModal = ({ isOpen, onClose, lessonTitle }: QuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Sample quiz data - in a real app, this would come from the database
  const quizQuestions: QuizQuestion[] = [
    {
      id: "1",
      question: "What is the most important element of a strong personal brand?",
      options: [
        "Having a professional headshot",
        "Authenticity and consistency",
        "Using all social media platforms",
        "Having a large following"
      ],
      correctAnswer: 1,
      explanation: "Authenticity and consistency are the foundation of any strong personal brand. They build trust and help people understand what you stand for."
    },
    {
      id: "2",
      question: "When developing your personal brand, you should focus on:",
      options: [
        "What everyone else is doing",
        "Only your professional achievements",
        "Your unique value proposition",
        "Following trends"
      ],
      correctAnswer: 2,
      explanation: "Your unique value proposition is what sets you apart from others and makes you memorable in your field."
    },
    {
      id: "3",
      question: "How often should you review and update your personal brand strategy?",
      options: [
        "Never, once it's set",
        "Every few years",
        "Regularly, at least annually",
        "Only when changing jobs"
      ],
      correctAnswer: 2,
      explanation: "Regular review ensures your brand stays relevant and aligned with your evolving goals and the changing market."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / quizQuestions.length) * 100;
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    // Here you would typically save the quiz results to the database
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const score = calculateScore();
  const passed = score >= 70;

  if (quizCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Quiz Completed!
            </DialogTitle>
            <DialogDescription>
              You've successfully completed the quiz for {lessonTitle}
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className={`text-6xl mb-4 ${passed ? 'text-green-500' : 'text-orange-500'}`}>
              {passed ? '🎉' : '📚'}
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h3>
            <p className="text-gray-600 mb-4">
              Your score: {score.toFixed(0)}%
            </p>
            <p className="text-sm text-gray-500">
              {passed 
                ? 'You\'ve demonstrated a solid understanding of the material!'
                : 'Review the lesson content and try again to improve your score.'
              }
            </p>
          </div>

          <div className="flex gap-2">
            {!passed && (
              <Button onClick={resetQuiz} variant="outline" className="flex-1">
                Retake Quiz
              </Button>
            )}
            <Button onClick={onClose} className="flex-1">
              Continue Learning
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showResults) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Results - {lessonTitle}</DialogTitle>
            <DialogDescription>
              Review your answers and see explanations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-brand-600">
                {score.toFixed(0)}%
              </div>
              <p className="text-gray-600">
                {selectedAnswers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length} out of {quizQuestions.length} correct
              </p>
            </div>

            {quizQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start mb-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{question.question}</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-600">Your answer:</span>{" "}
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {question.options[userAnswer]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="text-gray-600">Correct answer:</span>{" "}
                              <span className="text-green-600">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                        </div>
                        {question.explanation && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={resetQuiz} variant="outline" className="flex-1">
              Retake Quiz
            </Button>
            <Button onClick={handleFinishQuiz} className="flex-1">
              {passed ? 'Complete Lesson' : 'Continue Anyway'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quiz - {lessonTitle}</DialogTitle>
          <DialogDescription>
            Test your understanding of the lesson content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-brand-500 bg-brand-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
