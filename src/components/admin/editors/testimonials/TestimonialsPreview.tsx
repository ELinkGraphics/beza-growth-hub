
import React from "react";
import { Button } from "@/components/ui/button";
import { TestimonialsContent } from "./types";

interface TestimonialsPreviewProps {
  content: TestimonialsContent;
  onExitPreview: () => void;
  onSave: () => void;
  loading: boolean;
}

const TestimonialsPreview: React.FC<TestimonialsPreviewProps> = ({
  content,
  onExitPreview,
  onSave,
  loading,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials Preview</h2>
        <Button 
          variant="outline"
          onClick={onExitPreview}
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
        <Button onClick={onSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsPreview;
