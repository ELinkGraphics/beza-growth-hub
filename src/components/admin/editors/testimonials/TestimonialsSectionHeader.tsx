
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TestimonialsSectionHeaderProps {
  title: string;
  subtitle: string;
  onTitleChange: (field: string, value: string) => void;
}

const TestimonialsSectionHeader: React.FC<TestimonialsSectionHeaderProps> = ({
  title,
  subtitle,
  onTitleChange,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Testimonials Section</h3>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Section Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => onTitleChange('title', e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea 
              id="subtitle" 
              rows={2}
              value={subtitle}
              onChange={(e) => onTitleChange('subtitle', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsSectionHeader;
