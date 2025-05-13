
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Upload } from "lucide-react";
import { Testimonial } from "./types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, field: string, value: string) => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>, testimonialId: string) => void;
  avatarFile?: File | null;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  index,
  onRemove,
  onChange,
  onAvatarChange,
  avatarFile,
}) => {
  return (
    <Card>
      <CardContent className="pt-6 relative">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          onClick={() => onRemove(index)}
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
              onChange={(e) => onChange(index, 'quote', e.target.value)}
              placeholder="What did they say about your services?"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`name-${testimonial.id}`}>Name</Label>
              <Input 
                id={`name-${testimonial.id}`} 
                value={testimonial.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                placeholder="Client name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`role-${testimonial.id}`}>Role/Company</Label>
              <Input 
                id={`role-${testimonial.id}`} 
                value={testimonial.role}
                onChange={(e) => onChange(index, 'role', e.target.value)}
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
                      onChange={(e) => onAvatarChange(e, testimonial.id)}
                    />
                  </label>
                </Button>
                {avatarFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
