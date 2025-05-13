import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Plus, Minus, Upload } from "lucide-react";
import { updateWebsiteContent } from "@/hooks/use-website-content";

interface TestimonialsEditorProps {
  onSave: (data: any) => void;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
}

interface TestimonialsContent {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

const defaultContent: TestimonialsContent = {
  title: "Client Success Stories",
  subtitle: "Hear from clients who have transformed their lives and careers with our guidance.",
  testimonials: [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Marketing Director",
      quote: "Working with Beza has been transformative. I've gained clarity on my career goals and the confidence to pursue them.",
      avatarUrl: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Entrepreneur",
      quote: "The personalized coaching sessions helped me overcome obstacles I'd been struggling with for years. I can't recommend Beza enough.",
      avatarUrl: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "HR Manager",
      quote: "Beza's workshops provided our team with valuable insights and practical strategies that improved our collaboration and productivity.",
      avatarUrl: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
    }
  ]
};

const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState<TestimonialsContent>(defaultContent);
  const [avatarFiles, setAvatarFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // In a real implementation, we would fetch the content from Supabase here
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', 'testimonials')
          .single();
          
        if (error) throw error;
        
        if (data && data.content) {
          setContent(data.content as TestimonialsContent);
        }
      } catch (error) {
        console.error("Error fetching testimonials content:", error);
        // Fallback to default content if there's an error
      }
    };
    
    fetchContent();
  }, []);

  const handleTitleChange = (field: string, value: string) => {
    setContent({
      ...content,
      [field]: value
    });
  };

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    const updatedTestimonials = [...content.testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value
    };
    setContent({
      ...content,
      testimonials: updatedTestimonials
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>, testimonialId: string) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFiles({
        ...avatarFiles,
        [testimonialId]: event.target.files[0]
      });
    }
  };

  const handleAddTestimonial = () => {
    const newId = `${Date.now()}`;
    const newTestimonial: Testimonial = {
      id: newId,
      name: "New Testimonial",
      role: "Role/Company",
      quote: "What the client said about your services.",
      avatarUrl: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
    };
    
    setContent({
      ...content,
      testimonials: [...content.testimonials, newTestimonial]
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    const updatedTestimonials = [...content.testimonials];
    const removedId = updatedTestimonials[index].id;
    
    // Remove the testimonial from the list
    updatedTestimonials.splice(index, 1);
    
    // Remove any avatar file for this testimonial
    if (avatarFiles[removedId]) {
      const updatedAvatarFiles = { ...avatarFiles };
      delete updatedAvatarFiles[removedId];
      setAvatarFiles(updatedAvatarFiles);
    }
    
    setContent({
      ...content,
      testimonials: updatedTestimonials
    });
  };

  const uploadImage = async (file: File, path: string) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    try {
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('website-images')
        .upload(path + '/' + fileName, file);
        
      if (error) throw error;
      
      const fileUrl = supabase.storage
        .from('website-images')
        .getPublicUrl(path + '/' + fileName).data.publicUrl;
        
      return fileUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      let updatedContent = { ...content };
      
      // Upload avatar images if they exist
      for (const testimonialId in avatarFiles) {
        if (avatarFiles[testimonialId]) {
          const testimonialIndex = updatedContent.testimonials.findIndex(t => t.id === testimonialId);
          if (testimonialIndex !== -1) {
            const avatarUrl = await uploadImage(avatarFiles[testimonialId]!, 'testimonials/avatars');
            updatedContent.testimonials[testimonialIndex].avatarUrl = avatarUrl;
          }
        }
      }

      // Update content using our new helper function
      const success = await updateWebsiteContent('testimonials', updatedContent);
      
      if (success) {
        onSave(updatedContent);
        // Clear the avatar files after successful upload
        setAvatarFiles({});
      }
    } catch (error) {
      console.error("Error saving testimonials:", error);
      toast({
        title: "Error saving changes",
        description: "There was a problem updating your testimonials. Please try again.",
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
          <h2 className="text-2xl font-bold">Testimonials Preview</h2>
          <Button 
            variant="outline"
            onClick={() => setPreviewMode(false)}
          >
            Exit Preview
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 space-y-8 bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{content.title}</h2>
            <p className="text-gray-700">{content.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <p className="italic text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  {testimonial.avatarUrl ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={testimonial.avatarUrl} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
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
        <h2 className="text-2xl font-bold">Edit Testimonials</h2>
        <Button 
          variant="outline" 
          onClick={() => setPreviewMode(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> Preview
        </Button>
      </div>

      {/* Section Title */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Testimonials Section</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Section Title</Label>
              <Input 
                id="title" 
                value={content.title}
                onChange={(e) => handleTitleChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea 
                id="subtitle" 
                rows={2}
                value={content.subtitle}
                onChange={(e) => handleTitleChange('subtitle', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Testimonials</h3>
        <Button
          type="button"
          onClick={handleAddTestimonial}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>
      
      <div className="space-y-6">
        {content.testimonials.map((testimonial, index) => (
          <Card key={testimonial.id}>
            <CardContent className="pt-6 relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                onClick={() => handleRemoveTestimonial(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <h4 className="text-md font-medium mb-4">Testimonial {index + 1}</h4>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor={`quote-${testimonial.id}`}>Testimonial Quote</Label>
                  <Textarea 
                    id={`quote-${testimonial.id}`} 
                    rows={3}
                    value={testimonial.quote}
                    onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                    placeholder="What did they say about your services?"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`name-${testimonial.id}`}>Name</Label>
                    <Input 
                      id={`name-${testimonial.id}`} 
                      value={testimonial.name}
                      onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                      placeholder="Client name"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`role-${testimonial.id}`}>Role/Company</Label>
                    <Input 
                      id={`role-${testimonial.id}`} 
                      value={testimonial.role}
                      onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                      placeholder="Their position or company"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor={`avatar-${testimonial.id}`}>Avatar Image</Label>
                  <div className="flex items-center gap-4">
                    {testimonial.avatarUrl && (
                      <div className="w-12 h-12 relative rounded-full overflow-hidden">
                        <img 
                          src={testimonial.avatarUrl} 
                          alt={`${testimonial.name} avatar`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex gap-2 items-center justify-center"
                        asChild
                      >
                        <label>
                          <Upload className="h-4 w-4" /> Upload Avatar
                          <input
                            type="file"
                            id={`avatar-${testimonial.id}`}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleAvatarChange(e, testimonial.id)}
                          />
                        </label>
                      </Button>
                      {avatarFiles[testimonial.id] && (
                        <p className="text-sm text-gray-500 mt-1">
                          Selected: {avatarFiles[testimonial.id]?.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsEditor;
