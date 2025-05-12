
// Follow this setup guide to integrate the Deno standard library:
// https://docs.deno.com/runtime/manual/

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const { type, id } = await req.json();
    
    if (type === "appointment") {
      // Get appointment details
      const { data: appointment, error: appointmentError } = await supabaseClient
        .from("appointments")
        .select("*")
        .eq("id", id)
        .single();
      
      if (appointmentError) {
        throw appointmentError;
      }
      
      // Send confirmation email
      // This is where you'd integrate with your email provider
      // For now, we'll just log the information
      console.log("Sending appointment confirmation email:", {
        to: appointment.email,
        name: appointment.name,
        date: appointment.date,
        time: appointment.time,
        service: appointment.service_type,
      });
      
      // In a real implementation, you would call your email service here
      // Example with a service like Resend or SendGrid:
      // await emailClient.send({
      //   from: 'appointments@growwithbeza.com',
      //   to: appointment.email,
      //   subject: 'Your appointment has been confirmed!',
      //   html: `<p>Hello ${appointment.name}!</p><p>Your appointment on ${appointment.date} at ${appointment.time} has been confirmed.</p>`
      // });
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } 
    else if (type === "contact") {
      // Get contact message details
      const { data: contact, error: contactError } = await supabaseClient
        .from("contacts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (contactError) {
        throw contactError;
      }
      
      // Send email notification about new contact message
      // This is where you'd integrate with your email provider
      console.log("Sending new contact notification email:", {
        subject: contact.subject,
        from: contact.email,
        name: contact.name,
        message: contact.message,
      });
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } 
    else {
      throw new Error("Invalid notification type");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/send-notification' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"type":"appointment","id":"your-appointment-id"}'
