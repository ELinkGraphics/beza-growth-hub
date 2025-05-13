
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { updateWebsiteContent } from "@/hooks/use-website-content";
import { TestimonialsContent, defaultTestimonialsContent, Testimonial } from "./types";

export const useTestimonials = (onSave: (data: any) => void) => {
  const [content, setContent] = useState<TestimonialsContent>(defaultTestimonialsContent);
  const [avatarFiles, setAvatarFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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

      // Update content using our helper function
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

  return {
    content,
    loading,
    previewMode,
    avatarFiles,
    setPreviewMode,
    handleTitleChange,
    handleTestimonialChange,
    handleAvatarChange,
    handleAddTestimonial,
    handleRemoveTestimonial,
    handleSubmit
  };
};
