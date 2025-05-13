
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Plus, Minus, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormsEditorProps {
  onSave: (data: any) => void;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface FormsContent {
  contact: {
    title: string;
    description: string;
    submitButtonText: string;
    thankYouMessage: string;
    notificationEmail: string;
    fields: FormField[];
  };
  booking: {
    title: string;
    description: string;
    submitButtonText: string;
    thankYouMessage: string;
    notificationEmail: string;
    services: string[];
    timeSlots: string[];
    fields: FormField[];
  };
}

const defaultContent: FormsContent = {
  contact: {
    title: "Get in Touch",
    description: "Have questions or ready to start your coaching journey? Reach out using the form below.",
    submitButtonText: "Send Message",
    thankYouMessage: "Thank you for your message! We'll get back to you soon.",
    notificationEmail: "notifications@example.com",
    fields: [
      {
        id: "1",
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Your name",
        required: true
      },
      {
        id: "2",
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Your email address",
        required: true
      },
      {
        id: "3",
        name: "subject",
        label: "Subject",
        type: "text",
        placeholder: "What is this regarding?",
        required: true
      },
      {
        id: "4",
        name: "message",
        label: "Message",
        type: "textarea",
        placeholder: "Your message",
        required: true
      }
    ]
  },
  booking: {
    title: "Book a Session",
    description: "Select your preferred service, date, and time to schedule your coaching session.",
    submitButtonText: "Book Appointment",
    thankYouMessage: "Thank you for booking! We'll confirm your appointment shortly.",
    notificationEmail: "appointments@example.com",
    services: [
      "Personal Coaching",
      "Career Development",
      "Group Workshop"
    ],
    timeSlots: [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM"
    ],
    fields: [
      {
        id: "1",
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Your name",
        required: true
      },
      {
        id: "2",
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Your email address",
        required: true
      },
      {
        id: "3",
        name: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "Your phone number",
        required: true
      },
      {
        id: "4",
        name: "message",
        label: "Additional Information",
        type: "textarea",
        placeholder: "Tell us anything that might help prepare for our session",
        required: false
      }
    ]
  }
};

const FormsEditor: React.FC<FormsEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState<FormsContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "booking">("contact");
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Using any to bypass TypeScript's type checking since we know the structure is valid
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', 'forms')
          .single();
          
        if (error) throw error;
        
        if (data && data.content) {
          setContent(data.content as FormsContent);
        }
      } catch (error) {
        console.error("Error fetching forms content:", error);
        // Fallback to default content if there's an error
      }
    };
    
    fetchContent();
  }, []);

  // Contact Form Handlers
  const handleContactChange = (field: string, value: string) => {
    setContent({
      ...content,
      contact: {
        ...content.contact,
        [field]: value
      }
    });
  };

  const handleContactFieldChange = (index: number, field: string, value: string | boolean) => {
    const updatedFields = [...content.contact.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value
    };
    
    setContent({
      ...content,
      contact: {
        ...content.contact,
        fields: updatedFields
      }
    });
  };

  const handleAddContactField = () => {
    const newId = `contact_${Date.now()}`;
    const newField: FormField = {
      id: newId,
      name: `field_${newId}`,
      label: "New Field",
      type: "text",
      placeholder: "Enter value",
      required: false
    };
    
    setContent({
      ...content,
      contact: {
        ...content.contact,
        fields: [...content.contact.fields, newField]
      }
    });
  };

  const handleRemoveContactField = (index: number) => {
    const updatedFields = [...content.contact.fields];
    updatedFields.splice(index, 1);
    
    setContent({
      ...content,
      contact: {
        ...content.contact,
        fields: updatedFields
      }
    });
  };

  // Booking Form Handlers
  const handleBookingChange = (field: string, value: string | string[]) => {
    setContent({
      ...content,
      booking: {
        ...content.booking,
        [field]: value
      }
    });
  };

  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...content.booking.services];
    updatedServices[index] = value;
    
    setContent({
      ...content,
      booking: {
        ...content.booking,
        services: updatedServices
      }
    });
  };

  const handleAddService = () => {
    setContent({
      ...content,
      booking: {
        ...content.booking,
        services: [...content.booking.services, "New Service"]
      }
    });
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...content.booking.services];
    updatedServices.splice(index, 1);
    
    setContent({
      ...content,
      booking: {
        ...content.booking,
        services: updatedServices
      }
    });
  };

  const handleTimeSlotChange = (index: number, value: string) => {
    const updatedTimeSlots = [...content.booking.timeSlots];
    updatedTimeSlots[index] = value;
    
    setContent({
      ...content,
      booking: {
        ...content.booking,
        timeSlots: updatedTimeSlots
      }
    });
  };

  const handleAddTimeSlot = () => {
    setContent({
      ...content,
      booking: {
        ...content.booking,
        timeSlots: [...content.booking.timeSlots, "0:00 AM"]
      }
    });
  };

  const handleRemoveTimeSlot = (index: number) => {
    const updatedTimeSlots = [...content.booking.timeSlots];
    updatedTimeSlots.splice(index, 1);
    
    setContent({
      ...content,
      booking: {
        ...content.booking,
        timeSlots: updatedTimeSlots
      }
    });
  };

  const handleBookingFieldChange = (index: number, field: string, value: string | boolean) => {
    const updatedFields = [...content.booking.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value
    };
    
    setContent({
      ...content,
      booking: {
        ...content.booking,
        fields: updatedFields
      }
    });
  };

  const handleAddBookingField = () => {
    const newId = `booking_${Date.now()}`;
    const newField: FormField = {
      id: newId,
      name: `field_${newId}`,
      label: "New Field",
      type: "text",
      placeholder: "Enter value",
      required: false
    };
    
    setContent({
      ...content,
      booking: {
        ...content.booking,
        fields: [...content.booking.fields, newField]
      }
    });
  };

  const handleRemoveBookingField = (index: number) => {
    const updatedFields = [...content.booking.fields];
    updatedFields.splice(index, 1);
    
    setContent({
      ...content,
      booking: {
        ...content.booking,
        fields: updatedFields
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Using any to bypass TypeScript's type checking for the website_content table
      const { error } = await supabase
        .from('website_content')
        .upsert({ 
          section: 'forms',
          content: content
        } as any, { onConflict: 'section' });
        
      if (error) throw error;
      
      onSave(content);
      toast({
        title: "Changes saved",
        description: "Your form settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving form settings:", error);
      toast({
        title: "Error saving changes",
        description: "There was a problem updating your form settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Forms Preview</h2>
          <Button 
            variant="outline"
            onClick={() => setPreviewMode(false)}
          >
            Exit Preview
          </Button>
        </div>
        
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={(value) => setActiveTab(value as "contact" | "booking")}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="contact">Contact Form</TabsTrigger>
            <TabsTrigger value="booking">Booking Form</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact">
            <div className="border rounded-lg p-6 bg-white">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{content.contact.title}</h2>
                <p className="text-gray-600 mt-1">{content.contact.description}</p>
              </div>
              
              <div className="space-y-4">
                {content.contact.fields.map((field) => (
                  <div key={field.id} className="grid gap-1.5">
                    <Label htmlFor={`preview_${field.id}`}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea 
                        id={`preview_${field.id}`}
                        placeholder={field.placeholder}
                        disabled
                      />
                    ) : (
                      <Input 
                        id={`preview_${field.id}`}
                        type={field.type}
                        placeholder={field.placeholder}
                        disabled
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button className="w-full sm:w-auto">{content.contact.submitButtonText}</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="booking">
            <div className="border rounded-lg p-6 bg-white">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{content.booking.title}</h2>
                <p className="text-gray-600 mt-1">{content.booking.description}</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid gap-1.5">
                  <Label htmlFor="preview_service">Service Type</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {content.booking.services.map((service, index) => (
                        <SelectItem key={index} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="preview_date">Date</Label>
                    <Input type="date" id="preview_date" disabled />
                  </div>
                  
                  <div className="grid gap-1.5">
                    <Label htmlFor="preview_time">Time</Label>
                    <Select disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {content.booking.timeSlots.map((timeSlot, index) => (
                          <SelectItem key={index} value={timeSlot}>{timeSlot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {content.booking.fields.map((field) => (
                  <div key={field.id} className="grid gap-1.5">
                    <Label htmlFor={`preview_booking_${field.id}`}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea 
                        id={`preview_booking_${field.id}`}
                        placeholder={field.placeholder}
                        disabled
                      />
                    ) : (
                      <Input 
                        id={`preview_booking_${field.id}`}
                        type={field.type}
                        placeholder={field.placeholder}
                        disabled
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button className="w-full md:w-auto">{content.booking.submitButtonText}</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configure Forms</h2>
        <Button 
          variant="outline" 
          onClick={() => setPreviewMode(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> Preview
        </Button>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        onValueChange={(value) => setActiveTab(value as "contact" | "booking")}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="contact">Contact Form</TabsTrigger>
          <TabsTrigger value="booking">Booking Form</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Contact Form Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactTitle">Form Title</Label>
                  <Input 
                    id="contactTitle" 
                    value={content.contact.title}
                    onChange={(e) => handleContactChange('title', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactDescription">Form Description</Label>
                  <Textarea 
                    id="contactDescription" 
                    rows={3}
                    value={content.contact.description}
                    onChange={(e) => handleContactChange('description', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactButton">Submit Button Text</Label>
                  <Input 
                    id="contactButton" 
                    value={content.contact.submitButtonText}
                    onChange={(e) => handleContactChange('submitButtonText', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactThankYou">Thank You Message</Label>
                  <Textarea 
                    id="contactThankYou" 
                    rows={2}
                    value={content.contact.thankYouMessage}
                    onChange={(e) => handleContactChange('thankYouMessage', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Notification Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={content.contact.notificationEmail}
                    onChange={(e) => handleContactChange('notificationEmail', e.target.value)}
                    placeholder="Where to send form submissions"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Form Fields</h3>
              <Button
                type="button"
                size="sm"
                onClick={handleAddContactField}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </div>
            
            <div className="space-y-4">
              {content.contact.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveContactField(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid gap-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`fieldLabel-${field.id}`}>Label</Label>
                          <Input 
                            id={`fieldLabel-${field.id}`} 
                            value={field.label}
                            onChange={(e) => handleContactFieldChange(index, 'label', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor={`fieldName-${field.id}`}>Field Name</Label>
                          <Input 
                            id={`fieldName-${field.id}`} 
                            value={field.name}
                            onChange={(e) => handleContactFieldChange(index, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor={`fieldType-${field.id}`}>Field Type</Label>
                          <Select 
                            value={field.type}
                            onValueChange={(value) => handleContactFieldChange(index, 'type', value)}
                          >
                            <SelectTrigger id={`fieldType-${field.id}`}>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="textarea">Text Area</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor={`fieldPlaceholder-${field.id}`}>Placeholder Text</Label>
                        <Input 
                          id={`fieldPlaceholder-${field.id}`} 
                          value={field.placeholder}
                          onChange={(e) => handleContactFieldChange(index, 'placeholder', e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`fieldRequired-${field.id}`}
                          checked={field.required}
                          onCheckedChange={(checked) => handleContactFieldChange(index, 'required', checked)}
                        />
                        <Label htmlFor={`fieldRequired-${field.id}`}>Required field</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Booking Form Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="bookingTitle">Form Title</Label>
                  <Input 
                    id="bookingTitle" 
                    value={content.booking.title}
                    onChange={(e) => handleBookingChange('title', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="bookingDescription">Form Description</Label>
                  <Textarea 
                    id="bookingDescription" 
                    rows={3}
                    value={content.booking.description}
                    onChange={(e) => handleBookingChange('description', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="bookingButton">Submit Button Text</Label>
                  <Input 
                    id="bookingButton" 
                    value={content.booking.submitButtonText}
                    onChange={(e) => handleBookingChange('submitButtonText', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="bookingThankYou">Thank You Message</Label>
                  <Textarea 
                    id="bookingThankYou" 
                    rows={2}
                    value={content.booking.thankYouMessage}
                    onChange={(e) => handleBookingChange('thankYouMessage', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="bookingEmail">Notification Email</Label>
                  <Input 
                    id="bookingEmail" 
                    type="email"
                    value={content.booking.notificationEmail}
                    onChange={(e) => handleBookingChange('notificationEmail', e.target.value)}
                    placeholder="Where to send booking notifications"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Available Services</h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddService}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Service
                </Button>
              </div>
              
              <div className="space-y-2">
                {content.booking.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={service}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      placeholder={`Service ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                      onClick={() => handleRemoveService(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Available Time Slots</h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddTimeSlot}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Time Slot
                </Button>
              </div>
              
              <div className="space-y-2">
                {content.booking.timeSlots.map((timeSlot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={timeSlot}
                      onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                      placeholder={`Time ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                      onClick={() => handleRemoveTimeSlot(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Additional Form Fields</h3>
              <Button
                type="button"
                size="sm"
                onClick={handleAddBookingField}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </div>
            
            <div className="space-y-4">
              {content.booking.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveBookingField(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid gap-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`bookingFieldLabel-${field.id}`}>Label</Label>
                          <Input 
                            id={`bookingFieldLabel-${field.id}`} 
                            value={field.label}
                            onChange={(e) => handleBookingFieldChange(index, 'label', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor={`bookingFieldName-${field.id}`}>Field Name</Label>
                          <Input 
                            id={`bookingFieldName-${field.id}`} 
                            value={field.name}
                            onChange={(e) => handleBookingFieldChange(index, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor={`bookingFieldType-${field.id}`}>Field Type</Label>
                          <Select 
                            value={field.type}
                            onValueChange={(value) => handleBookingFieldChange(index, 'type', value)}
                          >
                            <SelectTrigger id={`bookingFieldType-${field.id}`}>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="textarea">Text Area</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor={`bookingFieldPlaceholder-${field.id}`}>Placeholder Text</Label>
                        <Input 
                          id={`bookingFieldPlaceholder-${field.id}`} 
                          value={field.placeholder}
                          onChange={(e) => handleBookingFieldChange(index, 'placeholder', e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`bookingFieldRequired-${field.id}`}
                          checked={field.required}
                          onCheckedChange={(checked) => handleBookingFieldChange(index, 'required', checked)}
                        />
                        <Label htmlFor={`bookingFieldRequired-${field.id}`}>Required field</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default FormsEditor;
