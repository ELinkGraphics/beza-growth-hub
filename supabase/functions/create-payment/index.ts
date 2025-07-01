
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { course_id, amount, course_title } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // Create a simulated payment record
    const paymentId = crypto.randomUUID();
    
    // Simulate payment success after 2 seconds
    setTimeout(async () => {
      try {
        // Auto-enroll user in course after payment
        await supabaseClient.from('course_enrollments').insert({
          student_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'User',
          email: userData.user.email,
          phone: '',
          course_id: course_id
        });
        
        console.log(`Payment ${paymentId} completed for course ${course_id}`);
      } catch (error) {
        console.error('Error auto-enrolling user:', error);
      }
    }, 2000);

    // Return a simulated payment URL
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const simulatedPaymentUrl = `${origin}/payment-success?payment_id=${paymentId}&course_id=${course_id}`;

    return new Response(JSON.stringify({ url: simulatedPaymentUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
