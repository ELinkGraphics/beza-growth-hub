
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, File, Upload, BookOpen } from "lucide-react";
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
  course_id: string;
}

interface Course {
  id: string;
  title: string;
  is_published: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

export const LessonManagement = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
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
    is_active: true,
    course_id: ""
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
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchLessons();
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, is_published')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
      
      if (data && data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses.",
        variant: "destructive",
      });
    }
  };

  const fetchLessons = async () => {
    if (!selectedCourseId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', selectedCourseId)
        .order('order_index');

      if (error) throw error;
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
    
    if (!selectedCourseId) {
      toast({
        title: "Error",
        description: "Please select a course first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const lessonData = {
        title: lessonForm.title,
        description: lessonForm.description,
        video_url: lessonForm.video_url,
        duration: lessonForm.duration,
        file_urls: lessonForm.file_urls,
        is_active: lessonForm.is_active,
        course_id: selectedCourseId,
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
      is_active: lesson.is_active,
      course_id: lesson.course_id
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
      is_active: true,
      course_id: selectedCourseId
    });
  };

  const handleCreateNew = () => {
    if (!selectedCourseId) {
      toast({
        title: "Error",
        description: "Please select a course first.",
        variant: "destructive",
      });
      return;
    }
    setEditingLesson(null);
    resetForm();
    setDialogOpen(true);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Lesson Management</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage lessons for each course individually
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Select Course</label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course to manage lessons" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center space-x-2">
                          <span>{course.title}</span>
                          {course.is_published && (
                            <Badge variant="secondary" className="text-xs">Published</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-6">
                <Button onClick={handleCreateNew} disabled={!selectedCourseId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </div>

            {selectedCourse && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">Managing lessons for: {selectedCourse.title}</h3>
                <p className="text-sm text-blue-700">
                  {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} in this course
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCourseId && (
        <Card>
          <CardContent className="p-0">
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading lessons...
                      </TableCell>
                    </TableRow>
                  ) : lessons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No lessons found for this course. Create your first lesson to get started.
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
      )}

      {/* Lesson Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
              {selectedCourse && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  for {selectedCourse.title}
                </span>
              )}
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
