import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Upload } from "lucide-react";
import { updateWebsiteContent } from "@/hooks/use-website-content";

interface HomeEditorProps {
  onSave: (data: any) => void;
}

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    heroImage: string | null;
  };
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    aboutImage: string | null;
  };
  cta: {
    title: string;
    description: string;
  };
}

const defaultContent: HomeContent = {
  hero: {
    title: "Transform Your Potential with Expert Guidance",
    subtitle: "Personal and professional development coaching to help you achieve your goals and unlock your true potential.",
    ctaText: "Book a Session",
    heroImage: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
  },
  about: {
    title: "About Beza",
    paragraph1: "With over a decade of experience in personal and professional development, I'm passionate about helping individuals and organizations unlock their true potential and achieve lasting success.",
    paragraph2: "My approach combines proven strategies with personalized coaching to create a tailored experience that addresses your unique challenges and goals.",
    aboutImage: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
  },
  cta: {
    title: "Ready to Start Your Growth Journey?",
    description: "Take the first step toward unlocking your potential. Book a consultation today."
  }
};

const HomeEditor: React.FC<HomeEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState<HomeContent>(defaultContent);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', 'home')
          .single();
          
        if (error) throw error;
        
        if (data && data.content) {
          setContent(data.content as HomeContent);
        }
      } catch (error) {
        console.error("Error fetching home content:", error);
        // Fallback to default content if there's an error
      }
    };
    
    fetchContent();
  }, []);

  const handleChange = (
    section: keyof HomeContent,
    field: string,
    value: string
  ) => {
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [field]: value
      }
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, section: string) => {
    if (event.target.files && event.target.files[0]) {
      if (section === "hero") {
        setHeroImageFile(event.target.files[0]);
      } else if (section === "about") {
        setAboutImageFile(event.target.files[0]);
      }
    }
  };

  const uploadImage = async (file: File, path: string) => {
    const fileName = `${Date.now()}_${file.name}`;
    
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
      
      // Upload hero image if it exists
      if (heroImageFile) {
        const heroImageUrl = await uploadImage(heroImageFile, 'home/hero');
        updatedContent.hero.heroImage = heroImageUrl;
      }
      
      // Upload about image if it exists
      if (aboutImageFile) {
        const aboutImageUrl = await uploadImage(aboutImageFile, 'home/about');
        updatedContent.about.aboutImage = aboutImageUrl;
      }

      // Update content using our new helper function
      const success = await updateWebsiteContent('home', updatedContent);
      
      if (success) {
        onSave(updatedContent);
      }
    } catch (error) {
      console.error("Error saving home content:", error);
      toast({
        title: "Error saving changes",
        description: "There was a problem updating your content. Please try again.",
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
          <h2 className="text-2xl font-bold">Home Page Preview</h2>
          <Button 
            variant="outline"
            onClick={() => setPreviewMode(false)}
          >
            Exit Preview
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 space-y-8 bg-white">
          {/* Hero Section Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Hero Section</h3>
            <div className="bg-brand-50 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2 space-y-4">
                  <h2 className="text-3xl font-bold">{content.hero.title}</h2>
                  <p className="text-gray-700">{content.hero.subtitle}</p>
                  <Button className="mt-4">{content.hero.ctaText}</Button>
                </div>
                <div className="md:w-1/2">
                  <img
                    src={content.hero.heroImage || "/placeholder.svg"}
                    alt="Hero"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Section Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">About Section</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2 space-y-4">
                  <h2 className="text-2xl font-bold">{content.about.title}</h2>
                  <p className="text-gray-700">{content.about.paragraph1}</p>
                  <p className="text-gray-700">{content.about.paragraph2}</p>
                </div>
                <div className="md:w-1/2">
                  <img
                    src={content.about.aboutImage || "/placeholder.svg"}
                    alt="About"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Call-to-Action Section</h3>
            <div className="bg-brand-500 text-white p-6 rounded-lg">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{content.cta.title}</h2>
                <p>{content.cta.description}</p>
                <Button variant="default" className="bg-white text-brand-700">Book a Session</Button>
              </div>
            </div>
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
        <h2 className="text-2xl font-bold">Edit Home Page</h2>
        <Button 
          variant="outline" 
          onClick={() => setPreviewMode(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> Preview
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="heroTitle">Title</Label>
              <Input 
                id="heroTitle" 
                value={content.hero.title}
                onChange={(e) => handleChange('hero', 'title', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Textarea 
                id="heroSubtitle" 
                rows={3}
                value={content.hero.subtitle}
                onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ctaText">CTA Button Text</Label>
              <Input 
                id="ctaText" 
                value={content.hero.ctaText}
                onChange={(e) => handleChange('hero', 'ctaText', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heroImage">Hero Image</Label>
              <div className="flex items-center gap-4">
                {content.hero.heroImage && (
                  <div className="w-24 h-24 relative">
                    <img 
                      src={content.hero.heroImage} 
                      alt="Hero Preview" 
                      className="w-full h-full object-cover rounded-md"
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
                      <Upload className="h-4 w-4" /> Upload Image
                      <input
                        type="file"
                        id="heroImage"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'hero')}
                      />
                    </label>
                  </Button>
                  {heroImageFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {heroImageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About Section</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="aboutTitle">Title</Label>
              <Input 
                id="aboutTitle" 
                value={content.about.title}
                onChange={(e) => handleChange('about', 'title', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="aboutParagraph1">First Paragraph</Label>
              <Textarea 
                id="aboutParagraph1" 
                rows={3}
                value={content.about.paragraph1}
                onChange={(e) => handleChange('about', 'paragraph1', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="aboutParagraph2">Second Paragraph</Label>
              <Textarea 
                id="aboutParagraph2" 
                rows={3}
                value={content.about.paragraph2}
                onChange={(e) => handleChange('about', 'paragraph2', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="aboutImage">About Image</Label>
              <div className="flex items-center gap-4">
                {content.about.aboutImage && (
                  <div className="w-24 h-24 relative">
                    <img 
                      src={content.about.aboutImage} 
                      alt="About Preview" 
                      className="w-full h-full object-cover rounded-md"
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
                      <Upload className="h-4 w-4" /> Upload Image
                      <input
                        type="file"
                        id="aboutImage"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'about')}
                      />
                    </label>
                  </Button>
                  {aboutImageFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {aboutImageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Call-to-Action Section</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="ctaTitle">Title</Label>
              <Input 
                id="ctaTitle" 
                value={content.cta.title}
                onChange={(e) => handleChange('cta', 'title', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ctaDescription">Description</Label>
              <Textarea 
                id="ctaDescription" 
                rows={2}
                value={content.cta.description}
                onChange={(e) => handleChange('cta', 'description', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default HomeEditor;
