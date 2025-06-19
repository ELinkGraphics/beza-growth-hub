
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Plus, Minus, Upload } from "lucide-react";

// Since we're using TypeScript inference, we're not explicitly annotating the response types
// This allows the code to work with our extended types

interface AboutEditorProps {
  onSave: (data: any) => void;
}

interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
  };
  story: {
    title: string;
    paragraphs: string[];
    image: string | null;
  };
  philosophy: {
    title: string;
    values: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  credentials: {
    title: string;
    education: Array<{
      id: string;
      degree: string;
      institution: string;
      year: string;
    }>;
    experience: Array<{
      id: string;
      position: string;
      company: string;
      period: string;
    }>;
  };
}

const defaultContent: AboutContent = {
  hero: {
    title: "About Bezawit Zerefa",
    subtitle: "Dynamic and results-driven social media marketing manager with 3+ years of experience in digital marketing, content creation, and branding. Passionate about data-driven marketing, influencer partnerships, and innovative digital storytelling."
  },
  story: {
    title: "My Story",
    paragraphs: [
      "As a dynamic and results-driven social media marketing manager with over 3 years of experience, I specialize in digital marketing, content creation, and branding. My journey in the digital marketing world has been marked by a passion for crafting compelling content and executing high-impact campaigns.",
      "I'm adept at optimizing engagement strategies to drive audience growth and brand awareness. My expertise spans across multi-platform social media strategies that yield measurable results, with proven success in managing campaigns that increase engagement and conversions.",
      "What sets me apart is my data-driven approach to marketing, combined with creative storytelling and strategic influencer partnerships. I believe in the power of authentic connections and innovative digital strategies to transform brands and drive meaningful engagement."
    ],
    image: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
  },
  philosophy: {
    title: "My Approach",
    values: [
      {
        id: "1",
        title: "Data-Driven Strategy",
        description: "Every campaign I create is backed by thorough analytics and performance metrics. I believe in making decisions based on solid data to ensure optimal results and ROI.",
        icon: "📊"
      },
      {
        id: "2",
        title: "Creative Storytelling",
        description: "I craft compelling narratives that resonate with audiences and build authentic brand connections. Content creation is at the heart of effective digital marketing.",
        icon: "✨"
      },
      {
        id: "3",
        title: "Multi-Platform Excellence",
        description: "From Instagram to LinkedIn, I develop tailored strategies for each platform to maximize reach and engagement across diverse digital landscapes.",
        icon: "🚀"
      }
    ]
  },
  credentials: {
    title: "Professional Background & Expertise",
    education: [
      {
        id: "1",
        degree: "High School Diploma",
        institution: "Magic Carpet",
        year: "2018-2020"
      },
      {
        id: "2",
        degree: "Digital and Social Media Marketing Certification",
        institution: "Professional Development",
        year: "2022"
      },
      {
        id: "3",
        degree: "Social Media Marketing Certification",
        institution: "Industry Training",
        year: "2023"
      },
      {
        id: "4",
        degree: "Creating Social Media Ad Campaigns with Canva",
        institution: "Canva Education",
        year: "2023"
      },
      {
        id: "5",
        degree: "How to Set Up a Facebook Ads Campaign",
        institution: "Facebook Blueprint",
        year: "2023"
      }
    ],
    experience: [
      {
        id: "1",
        position: "Digital Marketing Manager | Brand Manager",
        company: "Little Tigers Kids (Remote)",
        period: "November 2024 - Present"
      },
      {
        id: "2",
        position: "Digital Marketer | Social Media & Event Manager",
        company: "Droga Consulting (Full-time)",
        period: "August 2024 - Present"
      },
      {
        id: "3",
        position: "Social Media Manager & Content Creator",
        company: "Yonile Digital (Hybrid)",
        period: "March 2024 - November 2024"
      },
      {
        id: "4",
        position: "Social Media Marketing Manager",
        company: "Khilx (Hybrid)",
        period: "March 2024 - November 2024"
      },
      {
        id: "5",
        position: "Digital Marketing Manager",
        company: "Start Easy App (Hybrid)",
        period: "January 2022 - September 2024"
      },
      {
        id: "6",
        position: "Social Media Manager",
        company: "DINK Multimedia (Full-Time)",
        period: "October 2023 - February 2024"
      }
    ]
  }
};

const AboutEditor: React.FC<AboutEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [storyImage, setStoryImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Using any to bypass TypeScript's type checking since we know the structure is valid
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', 'about')
          .single();
          
        if (error) throw error;
        
        if (data && data.content) {
          setContent(data.content as AboutContent);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
        // Fallback to default content if there's an error
      }
    };
    
    fetchContent();
  }, []);

  const handleHeroChange = (field: string, value: string) => {
    setContent({
      ...content,
      hero: {
        ...content.hero,
        [field]: value
      }
    });
  };

  const handleStoryChange = (field: string, value: string | string[]) => {
    setContent({
      ...content,
      story: {
        ...content.story,
        [field]: value
      }
    });
  };

  const handleStoryParagraphChange = (index: number, value: string) => {
    const updatedParagraphs = [...content.story.paragraphs];
    updatedParagraphs[index] = value;
    
    setContent({
      ...content,
      story: {
        ...content.story,
        paragraphs: updatedParagraphs
      }
    });
  };

  const handleAddStoryParagraph = () => {
    const updatedParagraphs = [...content.story.paragraphs, ""];
    
    setContent({
      ...content,
      story: {
        ...content.story,
        paragraphs: updatedParagraphs
      }
    });
  };

  const handleRemoveStoryParagraph = (index: number) => {
    const updatedParagraphs = [...content.story.paragraphs];
    updatedParagraphs.splice(index, 1);
    
    setContent({
      ...content,
      story: {
        ...content.story,
        paragraphs: updatedParagraphs
      }
    });
  };

  const handleStoryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setStoryImage(event.target.files[0]);
    }
  };

  const handlePhilosophyChange = (field: string, value: string) => {
    setContent({
      ...content,
      philosophy: {
        ...content.philosophy,
        [field]: value
      }
    });
  };

  const handleValueChange = (index: number, field: string, value: string) => {
    const updatedValues = [...content.philosophy.values];
    updatedValues[index] = {
      ...updatedValues[index],
      [field]: value
    };
    
    setContent({
      ...content,
      philosophy: {
        ...content.philosophy,
        values: updatedValues
      }
    });
  };

  const handleAddValue = () => {
    const newId = `${Date.now()}`;
    const newValue = {
      id: newId,
      title: "New Value",
      description: "Description of this core value.",
      icon: "star"
    };
    
    setContent({
      ...content,
      philosophy: {
        ...content.philosophy,
        values: [...content.philosophy.values, newValue]
      }
    });
  };

  const handleRemoveValue = (index: number) => {
    const updatedValues = [...content.philosophy.values];
    updatedValues.splice(index, 1);
    
    setContent({
      ...content,
      philosophy: {
        ...content.philosophy,
        values: updatedValues
      }
    });
  };

  const handleCredentialsChange = (field: string, value: string) => {
    setContent({
      ...content,
      credentials: {
        ...content.credentials,
        [field]: value
      }
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...content.credentials.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setContent({
      ...content,
      credentials: {
        ...content.credentials,
        education: updatedEducation
      }
    });
  };

  const handleAddEducation = () => {
    const newId = `${Date.now()}_edu`;
    const newEducation = {
      id: newId,
      degree: "New Degree/Certification",
      institution: "Institution Name",
      year: "Year"
    };
    
    setContent({
      ...content,
      credentials: {
        ...content.credentials,
        education: [...content.credentials.education, newEducation]
      }
    });
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...content.credentials.education];
    updatedEducation.splice(index, 1);
    
    setContent({
      ...content,
      credentials: {
        ...content.credentials,
        education: updatedEducation
      }
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...content.credentials.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    
    setContent({
      ...content,
      credentials: {
        ...content.credentials,
        experience: updatedExperience
      }
    });
  };

  const handleAddExperience = () => {
    const newId = `${Date.now()}_exp`;
    const newExperience = {
      id: newId,
      position: "New Position",
      company: "Company Name",
      period: "Period"
    };
    
    setContent({
      ...content,
      credentials: {
        ...content.credentials,
        experience: [...content.credentials.experience, newExperience]
      }
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperience = [...content.credentials.experience];
    updatedExperience.splice(index, 1);
    
    setContent({
      ...content,
      credentials: {
        ...content.credentials,
        experience: updatedExperience
      }
    });
  };

  const uploadImage = async (file: File, path: string) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // This is a placeholder for the actual Supabase storage upload
    // In a real implementation, we would use Supabase storage here
    const { data, error } = await supabase.storage
      .from('website-images')
      .upload(path + '/' + fileName, file);
      
    if (error) throw error;
    
    const fileUrl = supabase.storage
      .from('website-images')
      .getPublicUrl(path + '/' + fileName).data.publicUrl;
      
    return fileUrl;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      let updatedContent = { ...content };
      
      // Upload story image if it exists
      if (storyImage) {
        const storyImageUrl = await uploadImage(storyImage, 'about/story');
        updatedContent.story.image = storyImageUrl;
      }

      // Using any to bypass TypeScript's type checking for the website_content table
      const { error } = await supabase
        .from('website_content')
        .upsert({ 
          section: 'about',
          content: updatedContent
        } as any, { onConflict: 'section' });
        
      if (error) throw error;
      
      onSave(updatedContent);
      toast({
        title: "Changes saved",
        description: "Your about page content has been updated successfully.",
      });
      
      // Clear the image file after successful upload
      setStoryImage(null);
    } catch (error) {
      console.error("Error saving about content:", error);
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
          <h2 className="text-2xl font-bold">About Page Preview</h2>
          <Button 
            variant="outline"
            onClick={() => setPreviewMode(false)}
          >
            Exit Preview
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 space-y-8 bg-white">
          {/* Hero Preview */}
          <div className="text-center py-4">
            <h1 className="text-3xl font-bold">{content.hero.title}</h1>
            <p className="text-gray-600 mt-2">{content.hero.subtitle}</p>
          </div>
          
          {/* Story Preview */}
          <div className="py-4">
            <h2 className="text-2xl font-semibold mb-4">{content.story.title}</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-4">
                {content.story.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-700">{paragraph}</p>
                ))}
              </div>
              <div className="md:w-1/2">
                <img 
                  src={content.story.image || "/placeholder.svg"}
                  alt="About Story"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
          
          {/* Philosophy Preview */}
          <div className="py-4 bg-gray-50 rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">{content.philosophy.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {content.philosophy.values.map((value) => (
                <div key={value.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
                    {/* Icon placeholder */}
                    <span>{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Credentials Preview */}
          <div className="py-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">{content.credentials.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Education</h3>
                <ul className="space-y-4">
                  {content.credentials.education.map((item) => (
                    <li key={item.id} className="border-l-2 border-brand-400 pl-4 py-2">
                      <p className="font-medium">{item.degree}</p>
                      <p className="text-gray-600">{item.institution}, {item.year}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Professional Experience</h3>
                <ul className="space-y-4">
                  {content.credentials.experience.map((item) => (
                    <li key={item.id} className="border-l-2 border-accent-400 pl-4 py-2">
                      <p className="font-medium">{item.position}</p>
                      <p className="text-gray-600">{item.company}, {item.period}</p>
                    </li>
                  ))}
                </ul>
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
        <h2 className="text-2xl font-bold">Edit About Page</h2>
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
                onChange={(e) => handleHeroChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Textarea 
                id="heroSubtitle" 
                rows={2}
                value={content.hero.subtitle}
                onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">My Story Section</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="storyTitle">Section Title</Label>
              <Input 
                id="storyTitle" 
                value={content.story.title}
                onChange={(e) => handleStoryChange('title', e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Paragraphs</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={handleAddStoryParagraph}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Paragraph
                </Button>
              </div>
              
              <div className="space-y-3">
                {content.story.paragraphs.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea 
                      rows={3}
                      value={paragraph}
                      onChange={(e) => handleStoryParagraphChange(index, e.target.value)}
                      placeholder={`Paragraph ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 h-fit mt-1"
                      onClick={() => handleRemoveStoryParagraph(index)}
                      disabled={content.story.paragraphs.length <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="storyImage">Profile Image</Label>
              <div className="flex items-center gap-4">
                {content.story.image && (
                  <div className="w-24 h-24 relative">
                    <img 
                      src={content.story.image} 
                      alt="Profile" 
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
                        id="storyImage"
                        className="hidden"
                        accept="image/*"
                        onChange={handleStoryImageChange}
                      />
                    </label>
                  </Button>
                  {storyImage && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {storyImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Philosophy Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Philosophy & Values</h3>
            <Button
              type="button"
              size="sm"
              onClick={handleAddValue}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Value
            </Button>
          </div>
          
          <div className="grid gap-4 mb-6">
            <Label htmlFor="philosophyTitle">Section Title</Label>
            <Input 
              id="philosophyTitle" 
              value={content.philosophy.title}
              onChange={(e) => handlePhilosophyChange('title', e.target.value)}
            />
          </div>
          
          <div className="space-y-6">
            {content.philosophy.values.map((value, index) => (
              <div key={value.id} className="border rounded-lg p-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveValue(index)}
                  disabled={content.philosophy.values.length <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <h4 className="text-md font-medium mb-4">Value {index + 1}</h4>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`valueTitle-${value.id}`}>Title</Label>
                    <Input 
                      id={`valueTitle-${value.id}`} 
                      value={value.title}
                      onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`valueDesc-${value.id}`}>Description</Label>
                    <Textarea 
                      id={`valueDesc-${value.id}`} 
                      rows={3}
                      value={value.description}
                      onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`valueIcon-${value.id}`}>Icon</Label>
                    <Input 
                      id={`valueIcon-${value.id}`} 
                      value={value.icon}
                      onChange={(e) => handleValueChange(index, 'icon', e.target.value)}
                      placeholder="Icon name (e.g., heart, star, smile)"
                    />
                    <p className="text-xs text-gray-500">
                      Enter a simple icon name like: heart, star, smile, expand, etc.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credentials Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Credentials & Experience</h3>
          
          <div className="grid gap-4 mb-6">
            <Label htmlFor="credentialsTitle">Section Title</Label>
            <Input 
              id="credentialsTitle" 
              value={content.credentials.title}
              onChange={(e) => handleCredentialsChange('title', e.target.value)}
            />
          </div>
          
          {/* Education */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Education</h4>
              <Button
                type="button"
                size="sm"
                onClick={handleAddEducation}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Education
              </Button>
            </div>
            
            <div className="space-y-4">
              {content.credentials.education.map((edu, index) => (
                <div key={edu.id} className="border rounded-lg p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveEducation(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`eduDegree-${edu.id}`}>Degree/Certification</Label>
                      <Input 
                        id={`eduDegree-${edu.id}`} 
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`eduInstitution-${edu.id}`}>Institution</Label>
                        <Input 
                          id={`eduInstitution-${edu.id}`} 
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor={`eduYear-${edu.id}`}>Year</Label>
                        <Input 
                          id={`eduYear-${edu.id}`} 
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Experience */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Professional Experience</h4>
              <Button
                type="button"
                size="sm"
                onClick={handleAddExperience}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Experience
              </Button>
            </div>
            
            <div className="space-y-4">
              {content.credentials.experience.map((exp, index) => (
                <div key={exp.id} className="border rounded-lg p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`expPosition-${exp.id}`}>Position</Label>
                      <Input 
                        id={`expPosition-${exp.id}`} 
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`expCompany-${exp.id}`}>Company</Label>
                        <Input 
                          id={`expCompany-${exp.id}`} 
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor={`expPeriod-${exp.id}`}>Period</Label>
                        <Input 
                          id={`expPeriod-${exp.id}`} 
                          value={exp.period}
                          onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

export default AboutEditor;
