
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type WebsiteSection = "home" | "services" | "testimonials" | "about" | "forms";

export const useWebsiteContent = (section: WebsiteSection) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('website_content')
          .select('content')
          .eq('section', section)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data?.content) {
          setContent(data.content);
        }
      } catch (err: any) {
        console.error(`Error fetching ${section} content:`, err);
        setError(err.message || 'An error occurred while fetching content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [section]);

  return { content, loading, error };
};

// Helper function to update website content
export const updateWebsiteContent = async (section: WebsiteSection, content: any) => {
  try {
    const { error } = await supabase
      .from('website_content')
      .upsert({ 
        section, 
        content,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'section' 
      });
      
    if (error) {
      throw error;
    }
    
    toast({
      title: "Content updated",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} content has been updated successfully.`,
    });
    
    return true;
  } catch (err: any) {
    console.error(`Error updating ${section} content:`, err);
    toast({
      variant: "destructive",
      title: "Error updating content",
      description: err.message || "Something went wrong. Please try again.",
    });
    
    return false;
  }
};
