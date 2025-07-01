
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailNotificationRequest {
  type: 'enrollment' | 'completion' | 'quiz_result' | 'new_review';
  enrollmentId?: string;
  courseId?: string;
  quizId?: string;
  reviewId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { type, enrollmentId, courseId, quizId, reviewId }: EmailNotificationRequest = await req.json();

    console.log(`Processing email notification of type: ${type}`);

    switch (type) {
      case 'enrollment':
        if (!enrollmentId) throw new Error('Enrollment ID required');
        
        // Get enrollment and course details
        const { data: enrollment, error: enrollmentError } = await supabaseClient
          .from("course_enrollments")
          .select(`
            *,
            courses(title, description)
          `)
          .eq("id", enrollmentId)
          .single();

        if (enrollmentError) throw enrollmentError;

        console.log("Sending enrollment confirmation email:", {
          to: enrollment.email,
          student: enrollment.student_name,
          course: enrollment.courses.title,
        });

        // In a real implementation, integrate with email service like Resend
        // await resend.emails.send({
        //   from: 'courses@growwithbeza.com',
        //   to: enrollment.email,
        //   subject: `Welcome to ${enrollment.courses.title}!`,
        //   html: `
        //     <h1>Welcome to ${enrollment.courses.title}!</h1>
        //     <p>Hi ${enrollment.student_name},</p>
        //     <p>You've successfully enrolled in ${enrollment.courses.title}.</p>
        //     <p>Start learning today!</p>
        //   `
        // });
        break;

      case 'completion':
        if (!enrollmentId) throw new Error('Enrollment ID required');
        
        const { data: completedEnrollment, error: completionError } = await supabaseClient
          .from("course_enrollments")
          .select(`
            *,
            courses(title)
          `)
          .eq("id", enrollmentId)
          .single();

        if (completionError) throw completionError;

        console.log("Sending course completion email:", {
          to: completedEnrollment.email,
          student: completedEnrollment.student_name,
          course: completedEnrollment.courses.title,
        });
        break;

      case 'quiz_result':
        if (!quizId || !enrollmentId) throw new Error('Quiz ID and Enrollment ID required');
        
        const { data: quizAttempt, error: quizError } = await supabaseClient
          .from("quiz_attempts")
          .select(`
            *,
            quizzes(title, pass_threshold),
            course_enrollments(email, student_name)
          `)
          .eq("quiz_id", quizId)
          .eq("enrollment_id", enrollmentId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (quizError) throw quizError;

        console.log("Sending quiz result email:", {
          to: quizAttempt.course_enrollments.email,
          student: quizAttempt.course_enrollments.student_name,
          quiz: quizAttempt.quizzes.title,
          score: quizAttempt.score,
          passed: quizAttempt.passed,
        });
        break;

      case 'new_review':
        if (!reviewId) throw new Error('Review ID required');
        
        const { data: review, error: reviewError } = await supabaseClient
          .from("course_reviews")
          .select(`
            *,
            courses(title),
            course_enrollments(student_name)
          `)
          .eq("id", reviewId)
          .single();

        if (reviewError) throw reviewError;

        console.log("New review notification:", {
          course: review.courses.title,
          student: review.course_enrollments.student_name,
          rating: review.rating,
        });
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error sending email notification:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
