
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Reply, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudentQuestion {
  id: string;
  studentName: string;
  email: string;
  lessonTitle: string;
  question: string;
  status: 'pending' | 'answered' | 'resolved';
  createdAt: string;
  adminResponse?: string;
  respondedAt?: string;
}

export const StudentQuestions = () => {
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<StudentQuestion | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    // In a real implementation, you would set up real-time subscription for new questions
    // For now, we'll just fetch questions periodically
    const interval = setInterval(fetchQuestions, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - in real implementation, this would come from a student_questions table
      const mockQuestions: StudentQuestion[] = [
        {
          id: "1",
          studentName: "Behailu Teketel",
          email: "elinkgraphics@gmail.com",
          lessonTitle: "Understanding Personal Branding",
          question: "Could you provide more examples of successful personal branding strategies for entrepreneurs?",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          studentName: "Yohannes Tsegaye",
          email: "yohannest@gmail.com",
          lessonTitle: "Building Your Brand Identity",
          question: "How do I choose the right colors for my personal brand? Are there any psychological aspects to consider?",
          status: "answered",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          adminResponse: "Great question! Color psychology plays a crucial role in personal branding. Blue conveys trust and professionalism, red shows energy and passion, while green represents growth and harmony. Choose colors that align with your personality and industry standards.",
          respondedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: "3",
          studentName: "Sarah Johnson",
          email: "sarah.j@example.com",
          lessonTitle: "Social Media Strategy",
          question: "What's the best posting frequency for LinkedIn to build personal brand without being overwhelming?",
          status: "pending",
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        }
      ];

      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load student questions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!selectedQuestion || !response.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response.",
        variant: "destructive",
      });
      return;
    }

    setIsResponding(true);
    try {
      // In real implementation, you would update the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Update the question with response
      setQuestions(prev => 
        prev.map(q => 
          q.id === selectedQuestion.id 
            ? {
                ...q,
                status: 'answered' as const,
                adminResponse: response,
                respondedAt: new Date().toISOString()
              }
            : q
        )
      );

      toast({
        title: "Response Sent!",
        description: "Your response has been sent to the student.",
      });

      setResponse("");
      setDialogOpen(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResponding(false);
    }
  };

  const markAsResolved = async (questionId: string) => {
    try {
      // In real implementation, you would update the database
      setQuestions(prev => 
        prev.map(q => 
          q.id === questionId 
            ? { ...q, status: 'resolved' as const }
            : q
        )
      );

      toast({
        title: "Marked as Resolved",
        description: "Question has been marked as resolved.",
      });
    } catch (error) {
      console.error('Error marking as resolved:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'answered':
        return <Badge variant="default" className="bg-blue-500"><Reply className="h-3 w-3 mr-1" />Answered</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const pendingCount = questions.filter(q => q.status === 'pending').length;
  const answeredCount = questions.filter(q => q.status === 'answered').length;
  const resolvedCount = questions.filter(q => q.status === 'resolved').length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Loading student questions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-3xl font-bold">{pendingCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Answered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Reply className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-3xl font-bold">{answeredCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-3xl font-bold">{resolvedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Student Questions & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Lesson</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No student questions yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{question.studentName}</div>
                          <div className="text-sm text-gray-500">{question.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{question.lessonTitle}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={question.question}>
                          {question.question}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(question.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(question.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedQuestion(question);
                                  setResponse(question.adminResponse || "");
                                }}
                              >
                                <Reply className="h-4 w-4 mr-1" />
                                {question.status === 'pending' ? 'Respond' : 'View'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  {question.status === 'pending' ? 'Respond to Question' : 'Question & Response'}
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">Student:</Label>
                                  <p className="text-sm">{selectedQuestion?.studentName} ({selectedQuestion?.email})</p>
                                </div>
                                
                                <div>
                                  <Label className="text-sm font-medium">Lesson:</Label>
                                  <p className="text-sm">{selectedQuestion?.lessonTitle}</p>
                                </div>
                                
                                <div>
                                  <Label className="text-sm font-medium">Question:</Label>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedQuestion?.question}</p>
                                </div>
                                
                                <div>
                                  <Label htmlFor="response">Your Response:</Label>
                                  <Textarea
                                    id="response"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    rows={4}
                                    placeholder="Type your response here..."
                                    disabled={selectedQuestion?.status === 'resolved'}
                                  />
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  {selectedQuestion?.status !== 'resolved' && (
                                    <Button
                                      onClick={handleRespond}
                                      disabled={isResponding}
                                    >
                                      {isResponding ? 'Sending...' : 'Send Response'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {question.status === 'answered' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsResolved(question.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
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
    </div>
  );
};
