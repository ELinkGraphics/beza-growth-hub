
import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const courseId = searchParams.get('course_id');
  const { toast } = useToast();

  useEffect(() => {
    if (paymentId && courseId) {
      toast({
        title: "Payment Successful!",
        description: "You have been enrolled in the course. Welcome aboard!",
      });
    }
  }, [paymentId, courseId, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Your payment has been processed successfully. You are now enrolled in the course!
          </p>
          {paymentId && (
            <p className="text-sm text-gray-500">
              Payment ID: {paymentId}
            </p>
          )}
          <div className="space-y-2">
            <Link to="/student-dashboard">
              <Button className="w-full">
                Go to Student Dashboard
              </Button>
            </Link>
            <Link to="/learn">
              <Button variant="outline" className="w-full">
                Browse More Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
