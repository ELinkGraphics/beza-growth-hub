
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube, 
  BarChart3, 
  PenTool, 
  Target, 
  Users,
  TrendingUp,
  Camera
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Social Media Strategy & Management",
      description: "Comprehensive social media management across all major platforms with data-driven strategies that increase engagement and brand visibility.",
      icon: <Instagram className="h-8 w-8" />,
      features: ["Multi-platform management", "Content planning", "Audience analysis", "Growth optimization"],
      pricing: "Starting at $800/month"
    },
    {
      id: 2,
      title: "Content Creation & Copywriting",
      description: "High-quality content creation including visuals, videos, and compelling copy that tells your brand story and drives engagement.",
      icon: <PenTool className="h-8 w-8" />,
      features: ["Visual content design", "Video production", "Copywriting", "Brand storytelling"],
      pricing: "Starting at $500/project"
    },
    {
      id: 3,
      title: "Paid Advertising Campaigns",
      description: "Strategic paid ad campaigns across Facebook, Instagram, and other platforms with performance analytics and optimization.",
      icon: <Target className="h-8 w-8" />,
      features: ["Facebook & Instagram ads", "Campaign optimization", "Performance tracking", "ROI analysis"],
      pricing: "Starting at $600/month + ad spend"
    },
    {
      id: 4,
      title: "Brand Development & Consistency",
      description: "Complete brand development services to establish and maintain consistent brand identity across all digital touchpoints.",
      icon: <BarChart3 className="h-8 w-8" />,
      features: ["Brand identity design", "Style guide creation", "Brand consistency", "Visual standards"],
      pricing: "Starting at $1200/project"
    },
    {
      id: 5,
      title: "Influencer Partnership Marketing",
      description: "Strategic influencer collaborations and partnership management to expand your reach and build authentic connections.",
      icon: <Users className="h-8 w-8" />,
      features: ["Influencer outreach", "Partnership management", "Campaign coordination", "Performance tracking"],
      pricing: "Starting at $400/campaign"
    },
    {
      id: 6,
      title: "Analytics & Performance Optimization",
      description: "Comprehensive analytics and data-driven optimization to maximize your digital marketing ROI and engagement rates.",
      icon: <TrendingUp className="h-8 w-8" />,
      features: ["Performance analytics", "ROI tracking", "Strategy optimization", "Monthly reporting"],
      pricing: "Starting at $300/month"
    }
  ];

  const achievements = [
    { metric: "20%", description: "Average engagement increase" },
    { metric: "35%", description: "Boost in audience interaction" },
    { metric: "25%", description: "Improvement in viewer retention" },
    { metric: "40%", description: "Increase in CTR" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Digital Marketing Services</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Professional social media marketing and brand development services that deliver measurable results and drive business growth.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/book">Get Started Today</Link>
          </Button>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Proven Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-brand-600 mb-2">{achievement.metric}</div>
                <div className="text-gray-600">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">My Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive digital marketing solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="text-brand-600 mb-4">{service.icon}</div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-brand-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Badge variant="outline" className="mb-4">{service.pricing}</Badge>
                    <Button className="w-full" asChild>
                      <Link to="/contact">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "Social Media Strategy & Management",
              "Content Creation & Copywriting", 
              "Influencer & Partnership Marketing",
              "Community Growth & Engagement",
              "Brand Development & Consistency",
              "Paid Ad Campaigns & Performance Analytics",
              "Video Production & Graphic Design",
              "Facebook & Instagram Advertising"
            ].map((skill, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm font-medium text-gray-800">{skill}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-brand-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Grow Your Brand?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can elevate your digital presence and drive real results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/book">Book Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
