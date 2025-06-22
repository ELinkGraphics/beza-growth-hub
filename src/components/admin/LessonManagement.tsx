
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Play, File, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  lesson_id: number;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  order_index: number;
  is_active: boolean;
  file_urls: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

export const LessonManagement = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedLessonForQuiz, setSelectedLessonForQuiz] = useState<Lesson | null>(null);
  const { toast } = useToast();

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    video_url: "",
    duration: "",
    file_urls: [] as string[],
    is_active: true
  });

  const [quizForm, setQuizForm] = useState({
    questions: [] as QuizQuestion[]
  });

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error fetching lessons:', error);
        throw error;
      }

      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load lessons.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const lessonData = {
        title: lessonForm.title,
        description: lessonForm.description,
        video_url: lessonForm.video_url,
        duration: lessonForm.duration,
        file_urls: lessonForm.file_urls,
        is_active: lessonForm.is_active,
        order_index: editingLesson ? editingLesson.order_index : lessons.length + 1,
        lesson_id: editingLesson ? editingLesson.lesson_id : lessons.length + 1
      };

      if (editingLesson) {
        const { error } = await supabase
          .from('course_content')
          .update(lessonData)
          .eq('id', editingLesson.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Lesson updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('course_content')
          .insert([lessonData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Lesson created successfully.",
        });
      }

      setDialogOpen(false);
      setEditingLesson(null);
      resetForm();
      fetchLessons();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: "Error",
        description: "Failed to save lesson.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || "",
      video_url: lesson.video_url,
      duration: lesson.duration,
      file_urls: lesson.file_urls || [],
      is_active: lesson.is_active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lesson deleted successfully.",
      });

      fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Error",
        description: "Failed to delete lesson.",
        variant: "destructive",
      });
    }
  };

  const addFileUrl = () => {
    setLessonForm({
      ...lessonForm,
      file_urls: [...lessonForm.file_urls, ""]
    });
  };

  const updateFileUrl = (index: number, url: string) => {
    const newFileUrls = [...lessonForm.file_urls];
    newFileUrls[index] = url;
    setLessonForm({
      ...lessonForm,
      file_urls: newFileUrls
    });
  };

  const removeFileUrl = (index: number) => {
    const newFileUrls = lessonForm.file_urls.filter((_, i) => i !== index);
    setLessonForm({
      ...lessonForm,
      file_urls: newFileUrls
    });
  };

  const addQuizQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt.trim())) {
      setQuizForm({
        questions: [...quizForm.questions, {
          id: Date.now().toString(),
          ...newQuestion
        }]
      });
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0
      });
    }
  };

  const removeQuizQuestion = (questionId: string) => {
    setQuizForm({
      questions: quizForm.questions.filter(q => q.id !== questionId)
    });
  };

  const resetForm = () => {
    setLessonForm({
      title: "",
      description: "",
      video_url: "",
      duration: "",
      file_urls: [],
      is_active: true
    });
  };

  const handleCreateNew = () => {
    setEditingLesson(null);
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lesson Management</CardTitle>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No lessons found. Create your first lesson to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <Badge variant="outline">{lesson.order_index}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {lesson.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{lesson.duration}</TableCell>
                      <TableCell>
                        <Badge variant={lesson.is_active ? "default" : "secondary"}>
                          {lesson.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <File className="h-4 w-4" />
                          <span className="text-sm">{lesson.file_urls?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(lesson)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLessonForQuiz(lesson);
                              setQuizDialogOpen(true);
                            }}
                          >
                            Quiz
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lesson.id)}
                          >
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

      {/* Lesson Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Lesson Title *</label>
                <Input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                  required
                  placeholder="Enter lesson title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration *</label>
                <Input
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                  required
                  placeholder="e.g., 15 minutes"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">YouTube Video URL *</label>
              <Input
                value={lessonForm.video_url}
                onChange={(e) => setLessonForm({...lessonForm, video_url: e.target.value})}
                required
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Lesson Description</label>
              <Textarea
                value={lessonForm.description}
                onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})}
                rows={4}
                placeholder="Detailed lesson description and learning objectives"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Downloadable Files</label>
                <Button type="button" variant="outline" size="sm" onClick={addFileUrl}>
                  <Upload className="h-4 w-4 mr-2" />
                  Add File
                </Button>
              </div>
              {lessonForm.file_urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    value={url}
                    onChange={(e) => updateFileUrl(index, e.target.value)}
                    placeholder="File URL (PDF, document, etc.)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFileUrl(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={lessonForm.is_active}
                onCheckedChange={(checked) => setLessonForm({...lessonForm, is_active: checked})}
              />
              <label className="text-sm font-medium">Active Lesson</label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingLesson ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quiz Management Dialog */}
      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Quiz for: {selectedLessonForQuiz?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Question</label>
                  <Textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    placeholder="Enter your question here"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Answer Options</label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOptions});
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={newQuestion.correct_answer === index}
                        onChange={() => setNewQuestion({...newQuestion, correct_answer: index})}
                      />
                      <label className="text-sm">Correct</label>
                    </div>
                  ))}
                </div>
                
                <Button onClick={addQuizQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Display existing questions */}
            {quizForm.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quiz Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quizForm.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuizQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mb-3">{question.question}</p>
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <span className="text-sm">{String.fromCharCode(65 + optIndex)}.</span>
                              <span className={optIndex === question.correct_answer ? "font-medium text-green-600" : ""}>
                                {option}
                              </span>
                              {optIndex === question.correct_answer && (
                                <Badge variant="default" className="text-xs">Correct</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setQuizDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Quiz Saved",
                  description: "Quiz questions have been saved successfully.",
                });
                setQuizDialogOpen(false);
              }}>
                Save Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
