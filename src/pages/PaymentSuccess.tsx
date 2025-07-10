
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);
  const { toast } = useToast();
  
  const courseId = searchParams.get('course_id');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (courseId) {
      handlePaymentSuccess();
    }
  }, [courseId]);

  const handlePaymentSuccess = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.email) {
        throw new Error("User not authenticated");
      }

      const { data: existingEnrollment } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('email', user.user.email)
        .single();

      if (!existingEnrollment) {
        const { error } = await supabase
          .from('course_enrollments')
          .insert({
            course_id: courseId,
            student_name: user.user.user_metadata?.full_name || user.user.email.split('@')[0],
            email: user.user.email,
            phone: ''
          });

        if (error) throw error;
      }

      setEnrollmentComplete(true);
      toast({
        title: "Payment Successful! 🎉",
        description: "You've been enrolled in the course. Welcome aboard!",
      });
    } catch (error) {
      console.error('Error completing enrollment:', error);
      toast({
        title: "Enrollment Error",
        description: "Payment succeeded but there was an issue with enrollment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const goToCourse = () => {
    navigate(`/course-viewer/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Processing your payment...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  Thank you for your purchase! You've been successfully enrolled in the course.
                </p>
                {paymentId && (
                  <p className="text-xs text-muted-foreground">
                    Payment ID: {paymentId}
                  </p>
                )}
              </div>

              {enrollmentComplete && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-green-800">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">Enrollment Complete</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      You now have full access to all course materials.
                    </p>
                  </div>

                  <Button onClick={goToCourse} className="w-full" size="lg">
                    Start Learning
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/learn')}
                  className="w-full"
                >
                  Browse More Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
