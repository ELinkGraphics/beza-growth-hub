
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LessonCommentsProps {
  lessonId: number;
  lessonTitle: string;
}

export const LessonComments = ({ lessonId, lessonTitle }: LessonCommentsProps) => {
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter your question.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would normally save the question to your database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Question Submitted!",
        description: "Your question has been submitted successfully. You'll receive a response soon.",
      });
      
      setQuestion("");
      setIsQuestionDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          Questions & Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 sm:py-8">
          <div className="mb-4">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Have a question about this lesson? We're here to help!
            </p>
          </div>
          <Button 
            onClick={() => setIsQuestionDialogOpen(true)}
            className="bg-brand-500 hover:bg-brand-600 w-full sm:w-auto"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask a Question
          </Button>
        </div>

        <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
          <DialogContent className="max-w-md mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Ask a Question</DialogTitle>
              <DialogDescription className="text-sm">
                Submit your question about this lesson and get help from our instructors.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">
                  Lesson: <span className="font-normal">{lessonTitle}</span>
                </p>
              </div>
              <div>
                <Textarea
                  placeholder="Type your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsQuestionDialogOpen(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitQuestion}
                  disabled={isSubmitting}
                  className="bg-brand-500 hover:bg-brand-600 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Question
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
