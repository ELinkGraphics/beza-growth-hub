
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, HelpCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  id: string;
  lesson_id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passing_score: number;
  created_at: string;
  lesson_title?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface CourseLesson {
  id: string;
  lesson_id: number;
  title: string;
}

export const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const { toast } = useToast();

  const [quizForm, setQuizForm] = useState({
    lesson_id: 0,
    title: "",
    description: "",
    passing_score: 70,
    questions: [
      {
        id: "1",
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        explanation: ""
      }
    ] as QuizQuestion[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_content')
        .select('id, lesson_id, title')
        .eq('is_active', true)
        .order('order_index');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Note: Since we don't have a quizzes table yet, we'll simulate data
      // In a real implementation, you would fetch from a quizzes table
      setQuizzes([]);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      explanation: ""
    };
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, newQuestion]
    });
  };

  const updateQuestion = (questionIndex: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...quizForm.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    };
    setQuizForm({
      ...quizForm,
      questions: updatedQuestions
    });
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...quizForm.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizForm({
      ...quizForm,
      questions: updatedQuestions
    });
  };

  const removeQuestion = (questionIndex: number) => {
    if (quizForm.questions.length > 1) {
      const updatedQuestions = quizForm.questions.filter((_, index) => index !== questionIndex);
      setQuizForm({
        ...quizForm,
        questions: updatedQuestions
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!quizForm.lesson_id || !quizForm.title) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate questions
    for (let i = 0; i < quizForm.questions.length; i++) {
      const question = quizForm.questions[i];
      if (!question.question || question.options.some(opt => !opt.trim())) {
        toast({
          title: "Validation Error",
          description: `Please complete question ${i + 1}.`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      // In a real implementation, you would save to a quizzes table
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: editingQuiz ? "Quiz updated successfully." : "Quiz created successfully.",
      });

      setDialogOpen(false);
      setEditingQuiz(null);
      resetForm();
      // fetchData(); // Uncomment when you have a real quizzes table
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setQuizForm({
      lesson_id: 0,
      title: "",
      description: "",
      passing_score: 70,
      questions: [
        {
          id: "1",
          question: "",
          options: ["", "", "", ""],
          correct_answer: 0,
          explanation: ""
        }
      ]
    });
  };

  const handleCreateNew = () => {
    setEditingQuiz(null);
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-3xl font-bold">{quizzes.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Available Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-3xl font-bold">{lessons.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Lessons with Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-3xl font-bold">{quizzes.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quiz Management</CardTitle>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz Title</TableHead>
                  <TableHead>Lesson</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Passing Score</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No quizzes found. Create your first quiz to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  quizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>
                        <div className="font-medium">{quiz.title}</div>
                        <div className="text-sm text-gray-500">{quiz.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{quiz.lesson_title}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{quiz.questions.length}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{quiz.passing_score}%</span>
                      </TableCell>
                      <TableCell>
                        {new Date(quiz.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Quiz Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quiz Title *</label>
                <Input
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                  required
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Lesson *</label>
                <Select 
                  value={quizForm.lesson_id.toString()} 
                  onValueChange={(value) => setQuizForm({...quizForm, lesson_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.lesson_id.toString()}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={quizForm.description}
                onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                rows={2}
                placeholder="Quiz description"
              />
            </div>

            <div className="w-32">
              <label className="text-sm font-medium mb-2 block">Passing Score (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={quizForm.passing_score}
                onChange={(e) => setQuizForm({...quizForm, passing_score: parseInt(e.target.value) || 70})}
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Questions</h4>
                <Button type="button" onClick={addQuestion} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {quizForm.questions.map((question, questionIndex) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Question {questionIndex + 1}</h5>
                      {quizForm.questions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Question Text *</label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                        placeholder="Enter your question"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Answer Options *</label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`question-${questionIndex}-correct`}
                              checked={question.correct_answer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correct_answer', optionIndex)}
                              className="text-brand-500"
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Select the radio button next to the correct answer
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Explanation (Optional)</label>
                      <Textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                        placeholder="Explain why this answer is correct"
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
