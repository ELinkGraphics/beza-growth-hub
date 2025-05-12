
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Mock appointment data
const mockAppointments = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(123) 456-7890",
    date: "2025-05-20",
    time: "10:00 AM",
    serviceType: "Personal Coaching",
    message: "Looking forward to discussing career transition strategies.",
    status: "confirmed"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(234) 567-8901",
    date: "2025-05-21",
    time: "2:00 PM",
    serviceType: "Career Development",
    message: "Need help with leadership skills for a new role.",
    status: "pending"
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "(345) 678-9012",
    date: "2025-05-22",
    time: "11:00 AM",
    serviceType: "Group Workshop",
    message: "Interested in team-building strategies for my department.",
    status: "pending"
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "(456) 789-0123",
    date: "2025-05-18",
    time: "9:00 AM",
    serviceType: "Initial Consultation",
    message: "Exploring options for personal development coaching.",
    status: "confirmed"
  }
];

export const AppointmentsList = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const { toast } = useToast();
  
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
  
  const handleStatusChange = (id: string, newStatus: string) => {
    // Here we would update the status in Supabase
    // For now, we'll just update the local state
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: newStatus } : appointment
    ));
    
    toast({
      title: "Status Updated",
      description: `Appointment status changed to ${newStatus}.`,
    });
  };
  
  const handleDelete = (id: string) => {
    // Here we would delete the appointment in Supabase
    // For now, we'll just update the local state
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    
    toast({
      title: "Appointment Deleted",
      description: "The appointment has been removed from the system.",
    });
  };

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
                    <p>{appointment.serviceType}</p>
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
