
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import HomeEditor from "./editors/HomeEditor";
import ServicesEditor from "./editors/ServicesEditor";
import TestimonialsEditor from "./editors/TestimonialsEditor";
import AboutEditor from "./editors/AboutEditor";
import FormsEditor from "./editors/FormsEditor";

interface WebsiteCustomizerProps {
  onSave?: () => void;
}

const WebsiteCustomizer: React.FC<WebsiteCustomizerProps> = ({ onSave }) => {
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState("home");

  const handleSaveChanges = async (section: string, data: any) => {
    try {
      // We'll implement the actual save functionality later
      console.log(`Saving ${section} data:`, data);
      
      setSaveStatus({
        success: true,
        message: `${section.charAt(0).toUpperCase() + section.slice(1)} content updated successfully!`
      });
      
      // Clear the status message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
      
      if (onSave) onSave();
    } catch (error) {
      console.error(`Error saving ${section} data:`, error);
      setSaveStatus({
        success: false,
        message: `Error updating ${section} content. Please try again.`
      });
    }
  };

  return (
    <div className="space-y-4">
      {saveStatus && (
        <Alert className={saveStatus.success ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}>
          <AlertDescription className="flex items-center">
            {saveStatus.success && <Check className="mr-2 h-4 w-4 text-green-500" />}
            {saveStatus.message}
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs 
        defaultValue="home"
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <Card>
          <CardContent className="pt-6">
            <TabsList className="mb-6 grid grid-cols-5 gap-2">
              <TabsTrigger value="home" className="text-sm">Home</TabsTrigger>
              <TabsTrigger value="services" className="text-sm">Services</TabsTrigger>
              <TabsTrigger value="testimonials" className="text-sm">Testimonials</TabsTrigger>
              <TabsTrigger value="about" className="text-sm">About</TabsTrigger>
              <TabsTrigger value="forms" className="text-sm">Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="home">
              <HomeEditor onSave={(data) => handleSaveChanges("home", data)} />
            </TabsContent>
            
            <TabsContent value="services">
              <ServicesEditor onSave={(data) => handleSaveChanges("services", data)} />
            </TabsContent>
            
            <TabsContent value="testimonials">
              <TestimonialsEditor onSave={(data) => handleSaveChanges("testimonials", data)} />
            </TabsContent>
            
            <TabsContent value="about">
              <AboutEditor onSave={(data) => handleSaveChanges("about", data)} />
            </TabsContent>
            
            <TabsContent value="forms">
              <FormsEditor onSave={(data) => handleSaveChanges("forms", data)} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default WebsiteCustomizer;
