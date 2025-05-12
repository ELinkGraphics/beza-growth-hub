
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Mock contact data
const mockContacts = [
  {
    id: "1",
    name: "David Wilson",
    email: "david.w@example.com",
    subject: "Speaking Opportunity",
    message: "I'd like to invite you to speak at our upcoming leadership conference in September. We'd love to have you share insights on career development strategies.",
    date: "2025-05-11",
    isRead: true
  },
  {
    id: "2",
    name: "Jennifer Lee",
    email: "jlee@example.com",
    subject: "Corporate Training Inquiry",
    message: "Our company is interested in your group workshop services. We have a team of 25 people that could benefit from communication training. Please let me know available dates and pricing.",
    date: "2025-05-12",
    isRead: false
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "r.johnson@example.com",
    subject: "Coaching Package Question",
    message: "I'm interested in the transformation package but would like to know if there are payment plan options available. Looking forward to hearing from you!",
    date: "2025-05-10",
    isRead: false
  },
  {
    id: "4",
    name: "Amanda Garcia",
    email: "agarcia@example.com",
    subject: "Thank you",
    message: "I wanted to express my gratitude for our session last week. Your advice has already helped me navigate a difficult situation at work, and I'm feeling much more confident.",
    date: "2025-05-09",
    isRead: true
  }
];

export const ContactsList = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const { toast } = useToast();
  
  const handleMarkAsRead = (id: string) => {
    // Here we would update the status in Supabase
    // For now, we'll just update the local state
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, isRead: true } : contact
    ));
    
    toast({
      title: "Message Updated",
      description: "Message marked as read.",
    });
  };
  
  const handleDelete = (id: string) => {
    // Here we would delete the contact in Supabase
    // For now, we'll just update the local state
    setContacts(contacts.filter(contact => contact.id !== id));
    
    toast({
      title: "Message Deleted",
      description: "The message has been removed from the system.",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Contact Messages</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className={!contact.isRead ? "bg-gray-50" : ""}>
                <TableCell>
                  <div>
                    <p className={`font-medium ${!contact.isRead ? "font-semibold" : ""}`}>{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className={`${!contact.isRead ? "font-semibold" : ""}`}>{contact.subject}</p>
                </TableCell>
                <TableCell>
                  {new Date(contact.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={contact.isRead ? "bg-gray-100 text-gray-800" : "bg-brand-100 text-brand-800"}>
                    {contact.isRead ? "Read" : "New"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>{contact.subject}</SheetTitle>
                          <SheetDescription>
                            From: {contact.name} ({contact.email})
                            <br />
                            Date: {new Date(contact.date).toLocaleDateString()}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 border-t pt-6">
                          <p className="whitespace-pre-wrap">{contact.message}</p>
                        </div>
                        <div className="flex justify-between mt-8">
                          <SheetClose asChild>
                            <Button 
                              onClick={() => !contact.isRead && handleMarkAsRead(contact.id)}
                              className="bg-brand-500 hover:bg-brand-600"
                            >
                              {contact.isRead ? "Close" : "Mark as Read"}
                            </Button>
                          </SheetClose>
                          <Button 
                            variant="outline"
                            onClick={() => window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`}
                          >
                            Reply via Email
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                    
                    {!contact.isRead && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-brand-500 text-brand-600 hover:bg-brand-50"
                        onClick={() => handleMarkAsRead(contact.id)}
                      >
                        Mark Read
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
                          <AlertDialogTitle>Delete Message</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this message? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(contact.id)}
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
            {contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No messages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
