
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Award, RotateCcw } from "lucide-react";

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
        "Having a professional hea
",
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
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Quiz Completed!
            </DialogTitle>
            <DialogDescription className="text-sm">
              You've successfully completed the quiz for {lessonTitle}
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className={`text-4xl sm:text-6xl mb-4 ${passed ? 'text-green-500' : 'text-orange-500'}`}>
              {passed ? '🎉' : '📚'}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h3>
            <p className="text-gray-600 mb-4 text-lg sm:text-xl">
              Your score: {score.toFixed(0)}%
            </p>
            <p className="text-sm text-gray-500">
              {passed 
                ? 'You\'ve demonstrated a solid understanding of the material!'
                : 'Review the lesson content and try again to improve your score.'
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {!passed && (
              <Button 
                onClick={resetQuiz} 
                variant="outline" 
                className="flex-1 w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            )}
            <Button onClick={onClose} className="flex-1 w-full">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Quiz Results - {lessonTitle}</DialogTitle>
            <DialogDescription className="text-sm">
              Review your answers and see explanations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center p-4 bg-gradient-to-r from-brand-50 to-brand-100 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold mb-2 text-brand-600">
                {score.toFixed(0)}%
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
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
                      <div className="flex-shrink-0 mr-3 mt-1">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-2 text-sm sm:text-base">{question.question}</h4>
                        <div className="space-y-1 text-xs sm:text-sm">
                          <p>
                            <span className="text-gray-600">Your answer:</span>{" "}
                            <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {question.options[userAnswer]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="text-gray-600">Correct answer:</span>{" "}
                              <span className="text-green-600 font-medium">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                        </div>
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs sm:text-sm">
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

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button 
              onClick={resetQuiz} 
              variant="outline" 
              className="flex-1 w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={handleFinishQuiz} className="flex-1 w-full">
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
      <DialogContent className="max-w-2xl mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Quiz - {lessonTitle}</DialogTitle>
          <DialogDescription className="text-sm">
            Test your understanding of the lesson content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-medium mb-4 leading-relaxed">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-colors text-sm sm:text-base ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 mt-0.5 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-brand-500 bg-brand-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="leading-relaxed">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="w-full sm:w-auto"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
