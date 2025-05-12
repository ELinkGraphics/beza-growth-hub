
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const ContactsList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase
          .from("contacts")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setContacts(data || []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Error loading messages",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('contacts-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contacts' 
      }, (payload) => {
        console.log('Realtime contact update:', payload);
        
        // Refresh the contacts list
        fetchContacts();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .update({ is_read: true })
        .eq("id", id);
      
      if (error) {
        throw error;
      }
      
      try {
        // Notify admin about the new message
        const SUPABASE_URL = "https://zxjeierbgixwirzcfxzl.supabase.co";
        const SUPABASE_KEY = supabase.auth.getSession().then(({ data }) => data.session?.access_token);
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await SUPABASE_KEY}`,
          },
          body: JSON.stringify({ type: "contact", id }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to send notification");
        }
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError);
      }
      
      toast({
        title: "Message Updated",
        description: "Message marked as read.",
      });
      
      // Update local state
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, is_read: true } : contact
      ));
    } catch (error) {
      console.error("Error updating contact status:", error);
      toast({
        title: "Error updating message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Message Deleted",
        description: "The message has been removed from the system.",
      });
      
      // Update local state
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error deleting message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading messages...</p>
        </CardContent>
      </Card>
    );
  }

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
              <TableRow key={contact.id} className={!contact.is_read ? "bg-gray-50" : ""}>
                <TableCell>
                  <div>
                    <p className={`font-medium ${!contact.is_read ? "font-semibold" : ""}`}>{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className={`${!contact.is_read ? "font-semibold" : ""}`}>{contact.subject}</p>
                </TableCell>
                <TableCell>
                  {new Date(contact.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={contact.is_read ? "bg-gray-100 text-gray-800" : "bg-brand-100 text-brand-800"}>
                    {contact.is_read ? "Read" : "New"}
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
                            Date: {new Date(contact.created_at).toLocaleDateString()}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 border-t pt-6">
                          <p className="whitespace-pre-wrap">{contact.message}</p>
                        </div>
                        <div className="flex justify-between mt-8">
                          <SheetClose asChild>
                            <Button 
                              onClick={() => !contact.is_read && handleMarkAsRead(contact.id)}
                              className="bg-brand-500 hover:bg-brand-600"
                            >
                              {contact.is_read ? "Close" : "Mark as Read"}
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
                    
                    {!contact.is_read && (
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
