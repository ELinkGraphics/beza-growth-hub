
import React, { useState } from "react";
import { useWebsiteContent } from "@/hooks/use-website-content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const BookAppointment = () => {
  const { content, loading } = useWebsiteContent("forms");
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    time: "",
    service_type: "",
    message: ""
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      // Also clear date error
      if (formErrors.date) {
        setFormErrors(prev => ({ ...prev, date: "" }));
      }
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    
    if (!date) {
      errors.date = "Date is required";
    }
    
    if (!formData.time) {
      errors.time = "Time is required";
    }
    
    if (!formData.service_type) {
      errors.service_type = "Service type is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !date) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Format date to YYYY-MM-DD for database
      const formattedDate = format(date, "yyyy-MM-dd");
      
      const { error } = await supabase
        .from("appointments")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formattedDate,
          time: formData.time,
          service_type: formData.service_type,
          message: formData.message,
        });
        
      if (error) {
        throw error;
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        time: "",
        service_type: "",
        message: ""
      });
      setDate(undefined);
      
      setSubmitted(true);
      toast({
        title: "Appointment requested successfully!",
        description: "Thank you for booking. You'll receive a confirmation soon.",
      });
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: "Error booking appointment",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }
  
  const bookingInfo = content?.bookingInfo || {
    title: "Book an Appointment",
    subtitle: "Schedule a session that works for your calendar and goals.",
    services: [
      { id: "personal", name: "Personal Coaching" },
      { id: "career", name: "Career Development" },
      { id: "group", name: "Group Workshop" },
      { id: "consultation", name: "Free Consultation" }
    ],
    timeSlots: [
      "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
      "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
    ]
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">{bookingInfo.title}</h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          {bookingInfo.subtitle}
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6 md:p-8">
              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-medium mb-2">Thank You!</h3>
                  <p>Your appointment request has been submitted successfully. You'll receive a confirmation soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={formErrors.name ? "border-red-500" : ""}
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-sm">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={formErrors.email ? "border-red-500" : ""}
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={formErrors.phone ? "border-red-500" : ""}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Service Selection */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Service Type</h2>
                    <RadioGroup 
                      value={formData.service_type}
                      onValueChange={(value) => handleSelectChange("service_type", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {bookingInfo.services.map((service) => (
                        <div key={service.id} className="space-x-2">
                          <RadioGroupItem value={service.id} id={service.id} />
                          <Label htmlFor={service.id}>{service.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {formErrors.service_type && (
                      <p className="text-red-500 text-sm mt-2">{formErrors.service_type}</p>
                    )}
                  </div>
                  
                  {/* Schedule */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Schedule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                                formErrors.date && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={handleDateChange}
                              initialFocus
                              disabled={(date) => {
                                // Disable dates in the past
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {formErrors.date && (
                          <p className="text-red-500 text-sm">{formErrors.date}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Select
                          value={formData.time}
                          onValueChange={(value) => handleSelectChange("time", value)}
                        >
                          <SelectTrigger className={cn(
                            formErrors.time && "border-red-500"
                          )}>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {bookingInfo.timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.time && (
                          <p className="text-red-500 text-sm">{formErrors.time}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information (Optional)</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please share any specific concerns or goals you'd like to address in our session."
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Book Appointment"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
