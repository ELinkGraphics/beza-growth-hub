import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  points: number;
}

interface QuizInterfaceProps {
  courseId: string;
  enrollmentId: string;
  lessonId?: number;
}

export const QuizInterface = ({ courseId, enrollmentId, lessonId }: QuizInterfaceProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuizQuestions();
  }, [courseId, lessonId]);

  const fetchQuizQuestions = async () => {
    try {
      let query = supabase
        .from('quiz_questions')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      let score = 0;
      let totalPoints = 0;

      questions.forEach(question => {
        totalPoints += question.points;
        if (userAnswers[question.id] === question.correct_answer) {
          score += question.points;
        }
      });

      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          enrollment_id: enrollmentId,
          course_id: courseId,
          student_answers: userAnswers,
          score,
          total_points: totalPoints
        });

      if (error) throw error;

      setQuizResults({ score, totalPoints, percentage: (score / totalPoints) * 100 });
      setQuizCompleted(true);

      toast({
        title: "Quiz Completed!",
        description: `You scored ${score}/${totalPoints} (${Math.round((score / totalPoints) * 100)}%)`,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz.",
        variant: "destructive",
      });
    }
  };

  const renderQuestion = (question: QuizQuestion) => {
    const options = question.options?.options || [];
    
    if (question.question_type === 'multiple_choice') {
      return (
        <RadioGroup 
          value={userAnswers[question.id] || ""} 
          onValueChange={(value) => handleAnswerChange(question.id, value)}
        >
          {options.map((option: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}-${index}`} />
              <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    return (
      <div className="space-y-2">
        {options.map((option: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox 
              id={`${question.id}-${index}`}
              checked={userAnswers[question.id]?.includes(option)}
              onCheckedChange={(checked) => {
                const currentAnswers = userAnswers[question.id]?.split(',') || [];
                if (checked) {
                  handleAnswerChange(question.id, [...currentAnswers, option].join(','));
                } else {
                  handleAnswerChange(question.id, currentAnswers.filter(a => a !== option).join(','));
                }
              }}
            />
            <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading quiz...</div>;
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">No quiz questions available for this lesson.</p>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted && quizResults) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Quiz Completed!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            {quizResults.score}/{quizResults.totalPoints}
          </div>
          <div className="text-lg text-muted-foreground">
            {Math.round(quizResults.percentage)}% Score
          </div>
          <Progress value={quizResults.percentage} className="w-full" />
          <div className="flex justify-center space-x-2">
            {quizResults.percentage >= 80 ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Excellent work!</span>
              </>
            ) : quizResults.percentage >= 60 ? (
              <>
                <CheckCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-600 font-medium">Good job!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-600 font-medium">Keep practicing!</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{currentQuestion.points} points</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question_text}</h3>
          {renderQuestion(currentQuestion)}
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button 
              onClick={submitQuiz}
              disabled={!userAnswers[currentQuestion.id]}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
              disabled={!userAnswers[currentQuestion.id]}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};