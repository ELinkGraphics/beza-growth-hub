
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service_type: string;
  message: string | null;
  status: string;
  created_at: string;
};

export const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setAppointments(data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error loading appointments",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments' 
      }, (payload) => {
        console.log('Realtime appointment update:', payload);
        
        // Refresh the appointments list
        fetchAppointments();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) {
        throw error;
      }
      
      // If confirmed, send email notification
      if (newStatus === "confirmed") {
        try {
          const SUPABASE_URL = "https://zxjeierbgixwirzcfxzl.supabase.co";
          const SUPABASE_KEY = supabase.auth.getSession().then(({ data }) => data.session?.access_token);
          
          const response = await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${await SUPABASE_KEY}`,
            },
            body: JSON.stringify({ type: "appointment", id }),
          });
          
          if (!response.ok) {
            throw new Error("Failed to send notification");
          }
        } catch (notificationError) {
          console.error("Error sending notification:", notificationError);
          toast({
            title: "Status updated, but confirmation email failed",
            description: "The appointment was confirmed, but we couldn't send an email notification.",
            variant: "destructive",
          });
        }
      }
      
      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}.`,
      });
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment.id === id ? { ...appointment, status: newStatus } : appointment
      ));
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Appointment Deleted",
        description: "The appointment has been removed from the system.",
      });
      
      // Update local state
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Error deleting appointment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading appointments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Appointment Requests</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{appointment.name}</p>
                    <p className="text-sm text-gray-500">{appointment.email}</p>
                    <p className="text-sm text-gray-500">{appointment.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{new Date(appointment.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{appointment.service_type}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">
                      {appointment.message}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {appointment.status === "pending" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => handleStatusChange(appointment.id, "confirmed")}
                      >
                        Confirm
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this appointment? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(appointment.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
