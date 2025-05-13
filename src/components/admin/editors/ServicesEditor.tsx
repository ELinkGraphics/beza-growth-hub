
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Plus, Minus, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServicesEditorProps {
  onSave: (data: any) => void;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  formats: string;
  color: "brand" | "accent";
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  popular: boolean;
}

interface ServicesContent {
  intro: {
    title: string;
    description: string;
  };
  services: Service[];
  pricing: {
    title: string;
    plans: PricingPlan[];
  };
  cta: {
    title: string;
    description: string;
  };
}

const defaultContent: ServicesContent = {
  intro: {
    title: "Services Designed for Your Growth",
    description: "Explore the ways we can work together to help you achieve your personal and professional goals."
  },
  services: [
    {
      id: "1",
      title: "Personal Coaching",
      description: "One-on-one sessions tailored to your personal growth goals and challenges.",
      icon: "User",
      benefits: [
        "Personalized strategies tailored to your specific needs",
        "Accountability and consistent support",
        "Deeper self-awareness and clarity",
        "Tools to overcome limiting beliefs and patterns"
      ],
      formats: "Individual sessions (60-90 minutes), 3-month packages, 6-month intensive programs",
      color: "brand"
    },
    {
      id: "2",
      title: "Career Development",
      description: "Strategic guidance to help you advance your career and reach new professional heights.",
      icon: "Book",
      benefits: [
        "Career path clarification and planning",
        "Enhanced leadership and communication skills",
        "Strategies for navigating workplace challenges",
        "Work-life balance optimization"
      ],
      formats: "Executive coaching programs, career transition support, leadership development plans",
      color: "accent"
    },
    {
      id: "3",
      title: "Group Workshops",
      description: "Interactive sessions designed to foster growth in a collaborative environment.",
      icon: "Users",
      benefits: [
        "Enhanced team cohesion and collaboration",
        "Shared language and tools for ongoing development",
        "Cost-effective growth opportunity for organizations",
        "Customized content for specific team challenges"
      ],
      formats: "Effective Communication, Conflict Resolution, Building Resilience, Strategic Goal Setting",
      color: "brand"
    }
  ],
  pricing: {
    title: "Investment",
    plans: [
      {
        id: "1",
        name: "Starter",
        price: "$199",
        duration: "Single Session",
        features: [
          "90-minute coaching session",
          "Goal-setting worksheet",
          "Action plan development"
        ],
        popular: false
      },
      {
        id: "2",
        name: "Growth Package",
        price: "$899",
        duration: "3-Month Package",
        features: [
          "6 bi-weekly coaching sessions",
          "Email support between sessions",
          "Personalized growth plan",
          "Progress tracking tools"
        ],
        popular: true
      },
      {
        id: "3",
        name: "Transformation",
        price: "$1,699",
        duration: "6-Month Package",
        features: [
          "12 bi-weekly coaching sessions",
          "Priority email & text support",
          "Comprehensive assessment",
          "Monthly progress reviews"
        ],
        popular: false
      }
    ]
  },
  cta: {
    title: "Ready to Begin Your Transformation?",
    description: "Take the first step by booking a session or reaching out to discuss your specific needs."
  }
};

const ServicesEditor: React.FC<ServicesEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState<ServicesContent>(defaultContent);
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
          .eq('section', 'services')
          .single();
          
        if (error) throw error;
        
        if (data && data.content) {
          setContent(data.content as ServicesContent);
        }
      } catch (error) {
        console.error("Error fetching services content:", error);
        // Fallback to default content if there's an error
      }
    };
    
    fetchContent();
  }, []);

  const handleIntroChange = (field: string, value: string) => {
    setContent({
      ...content,
      intro: {
        ...content.intro,
        [field]: value
      }
    });
  };

  const handleCtaChange = (field: string, value: string) => {
    setContent({
      ...content,
      cta: {
        ...content.cta,
        [field]: value
      }
    });
  };

  const handleServiceChange = (index: number, field: string, value: string | string[]) => {
    const updatedServices = [...content.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setContent({
      ...content,
      services: updatedServices
    });
  };

  const handleServiceBenefitChange = (serviceIndex: number, benefitIndex: number, value: string) => {
    const updatedServices = [...content.services];
    const updatedBenefits = [...updatedServices[serviceIndex].benefits];
    updatedBenefits[benefitIndex] = value;
    
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      benefits: updatedBenefits
    };
    
    setContent({
      ...content,
      services: updatedServices
    });
  };

  const handleAddServiceBenefit = (serviceIndex: number) => {
    const updatedServices = [...content.services];
    updatedServices[serviceIndex].benefits.push("");
    setContent({
      ...content,
      services: updatedServices
    });
  };

  const handleRemoveServiceBenefit = (serviceIndex: number, benefitIndex: number) => {
    const updatedServices = [...content.services];
    const updatedBenefits = [...updatedServices[serviceIndex].benefits];
    updatedBenefits.splice(benefitIndex, 1);
    
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      benefits: updatedBenefits
    };
    
    setContent({
      ...content,
      services: updatedServices
    });
  };

  const handleAddService = () => {
    const newId = `${content.services.length + 1}`;
    const newService: Service = {
      id: newId,
      title: "New Service",
      description: "Description of the new service.",
      icon: "User",
      benefits: ["Benefit 1"],
      formats: "Format details here",
      color: "brand"
    };
    
    setContent({
      ...content,
      services: [...content.services, newService]
    });
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...content.services];
    updatedServices.splice(index, 1);
    
    setContent({
      ...content,
      services: updatedServices
    });
  };

  const handlePlanChange = (planIndex: number, field: string, value: string | string[] | boolean) => {
    const updatedPlans = [...content.pricing.plans];
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      [field]: value
    };
    
    setContent({
      ...content,
      pricing: {
        ...content.pricing,
        plans: updatedPlans
      }
    });
  };

  const handlePlanFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
    const updatedPlans = [...content.pricing.plans];
    const updatedFeatures = [...updatedPlans[planIndex].features];
    updatedFeatures[featureIndex] = value;
    
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      features: updatedFeatures
    };
    
    setContent({
      ...content,
      pricing: {
        ...content.pricing,
        plans: updatedPlans
      }
    });
  };

  const handleAddPlanFeature = (planIndex: number) => {
    const updatedPlans = [...content.pricing.plans];
    updatedPlans[planIndex].features.push("");
    
    setContent({
      ...content,
      pricing: {
        ...content.pricing,
        plans: updatedPlans
      }
    });
  };

  const handleRemovePlanFeature = (planIndex: number, featureIndex: number) => {
    const updatedPlans = [...content.pricing.plans];
    const updatedFeatures = [...updatedPlans[planIndex].features];
    updatedFeatures.splice(featureIndex, 1);
    
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      features: updatedFeatures
    };
    
    setContent({
      ...content,
      pricing: {
        ...content.pricing,
        plans: updatedPlans
      }
    });
  };

  const handleAddPlan = () => {
    const newId = `${content.pricing.plans.length + 1}`;
    const newPlan: PricingPlan = {
      id: newId,
      name: "New Plan",
      price: "$0",
      duration: "Duration",
      features: ["Feature 1"],
      popular: false
    };
    
    setContent({
      ...content,
      pricing: {
        ...content.pricing,
        plans: [...content.pricing.plans, newPlan]
      }
    });
  };

  const handleRemovePlan = (index: number) => {
    const updatedPlans = [...content.pricing.plans];
    updatedPlans.splice(index, 1);
    
    setContent({
      ...content,
      pricing: {
        ...content.pricing,
        plans: updatedPlans
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // In a real implementation, we would save the content to Supabase here
      const { error } = await supabase
        .from('website_content')
        .upsert({ 
          section: 'services',
          content: content
        }, { onConflict: 'section' });
        
      if (error) throw error;
      
      onSave(content);
      toast({
        title: "Changes saved",
        description: "Your services page content has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving services content:", error);
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
          <h2 className="text-2xl font-bold">Services Page Preview</h2>
          <Button 
            variant="outline"
            onClick={() => setPreviewMode(false)}
          >
            Exit Preview
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 space-y-8 bg-white">
          {/* Preview content here */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{content.intro.title}</h2>
            <p className="text-gray-700">{content.intro.description}</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.services.map((service) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium">{service.title}</h4>
                  <p className="text-gray-700 text-sm mt-1">{service.description}</p>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium">Benefits:</h5>
                    <ul className="list-disc list-inside text-sm">
                      {service.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{content.pricing.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.pricing.plans.map((plan) => (
                <div key={plan.id} className={`border rounded-lg p-4 relative ${plan.popular ? 'border-brand-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs px-2 py-1">
                      Popular
                    </div>
                  )}
                  <h4 className="text-lg font-medium">{plan.name}</h4>
                  <div className="text-2xl font-bold mt-2">{plan.price}</div>
                  <p className="text-sm text-gray-500">{plan.duration}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-brand-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-brand-500 text-white p-6 rounded-lg">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">{content.cta.title}</h2>
              <p>{content.cta.description}</p>
              <div className="flex justify-center gap-4">
                <Button variant="default" className="bg-white text-brand-700">Book a Session</Button>
                <Button variant="outline" className="border-white text-white">Contact Me</Button>
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
        <h2 className="text-2xl font-bold">Edit Services Page</h2>
        <Button 
          variant="outline" 
          onClick={() => setPreviewMode(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> Preview
        </Button>
      </div>

      {/* Intro Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Introduction Section</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="introTitle">Title</Label>
              <Input 
                id="introTitle" 
                value={content.intro.title}
                onChange={(e) => handleIntroChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="introDescription">Description</Label>
              <Textarea 
                id="introDescription" 
                rows={3}
                value={content.intro.description}
                onChange={(e) => handleIntroChange('description', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Services</h3>
            <Button
              type="button"
              size="sm"
              onClick={handleAddService}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          </div>
          
          <div className="space-y-8">
            {content.services.map((service, serviceIndex) => (
              <div key={service.id} className="border rounded-lg p-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveService(serviceIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <h4 className="text-md font-medium mb-4">Service {serviceIndex + 1}</h4>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`serviceTitle-${serviceIndex}`}>Title</Label>
                    <Input 
                      id={`serviceTitle-${serviceIndex}`} 
                      value={service.title}
                      onChange={(e) => handleServiceChange(serviceIndex, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`serviceDescription-${serviceIndex}`}>Description</Label>
                    <Textarea 
                      id={`serviceDescription-${serviceIndex}`} 
                      rows={2}
                      value={service.description}
                      onChange={(e) => handleServiceChange(serviceIndex, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`serviceIcon-${serviceIndex}`}>Icon</Label>
                    <Select 
                      value={service.icon}
                      onValueChange={(value) => handleServiceChange(serviceIndex, 'icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User">User (Person)</SelectItem>
                        <SelectItem value="Book">Book</SelectItem>
                        <SelectItem value="Users">Users (Group)</SelectItem>
                        <SelectItem value="Calendar">Calendar</SelectItem>
                        <SelectItem value="Settings">Settings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`serviceColor-${serviceIndex}`}>Color Theme</Label>
                    <Select 
                      value={service.color}
                      onValueChange={(value) => handleServiceChange(serviceIndex, 'color', value as "brand" | "accent")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand">Brand</SelectItem>
                        <SelectItem value="accent">Accent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Benefits</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleAddServiceBenefit(serviceIndex)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Benefit
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2">
                          <Input 
                            value={benefit}
                            onChange={(e) => handleServiceBenefitChange(serviceIndex, benefitIndex, e.target.value)}
                            placeholder={`Benefit ${benefitIndex + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-500 flex-shrink-0"
                            onClick={() => handleRemoveServiceBenefit(serviceIndex, benefitIndex)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`serviceFormats-${serviceIndex}`}>Formats</Label>
                    <Textarea 
                      id={`serviceFormats-${serviceIndex}`} 
                      value={service.formats}
                      onChange={(e) => handleServiceChange(serviceIndex, 'formats', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Pricing Plans</h3>
            <Button
              type="button"
              size="sm"
              onClick={handleAddPlan}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Plan
            </Button>
          </div>
          
          <div className="grid gap-2 mb-4">
            <Label htmlFor="pricingTitle">Section Title</Label>
            <Input 
              id="pricingTitle" 
              value={content.pricing.title}
              onChange={(e) => setContent({
                ...content, 
                pricing: {
                  ...content.pricing,
                  title: e.target.value
                }
              })}
            />
          </div>
          
          <div className="space-y-6">
            {content.pricing.plans.map((plan, planIndex) => (
              <div key={plan.id} className="border rounded-lg p-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemovePlan(planIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <h4 className="text-md font-medium mb-4">Plan {planIndex + 1}</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`planName-${planIndex}`}>Name</Label>
                      <Input 
                        id={`planName-${planIndex}`} 
                        value={plan.name}
                        onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor={`planPrice-${planIndex}`}>Price</Label>
                      <Input 
                        id={`planPrice-${planIndex}`} 
                        value={plan.price}
                        onChange={(e) => handlePlanChange(planIndex, 'price', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`planDuration-${planIndex}`}>Duration</Label>
                    <Input 
                      id={`planDuration-${planIndex}`} 
                      value={plan.duration}
                      onChange={(e) => handlePlanChange(planIndex, 'duration', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`planPopular-${planIndex}`}
                      checked={plan.popular}
                      onChange={(e) => handlePlanChange(planIndex, 'popular', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`planPopular-${planIndex}`} className="text-sm">
                      Mark as popular (highlighted)
                    </Label>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Features</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleAddPlanFeature(planIndex)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Feature
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <Input 
                            value={feature}
                            onChange={(e) => handlePlanFeatureChange(planIndex, featureIndex, e.target.value)}
                            placeholder={`Feature ${featureIndex + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-500 flex-shrink-0"
                            onClick={() => handleRemovePlanFeature(planIndex, featureIndex)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                onChange={(e) => handleCtaChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ctaDescription">Description</Label>
              <Textarea 
                id="ctaDescription" 
                rows={2}
                value={content.cta.description}
                onChange={(e) => handleCtaChange('description', e.target.value)}
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

export default ServicesEditor;
