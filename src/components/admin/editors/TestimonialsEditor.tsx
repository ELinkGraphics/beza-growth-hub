
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import TestimonialCard from "./testimonials/TestimonialCard";
import TestimonialsSectionHeader from "./testimonials/TestimonialsSectionHeader";
import TestimonialsPreview from "./testimonials/TestimonialsPreview";
import { useTestimonials } from "./testimonials/useTestimonials";

interface TestimonialsEditorProps {
  onSave: (data: any) => void;
}

const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ onSave }) => {
  const {
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
  } = useTestimonials(onSave);

  if (previewMode) {
    return (
      <TestimonialsPreview
        content={content}
        onExitPreview={() => setPreviewMode(false)}
        onSave={handleSubmit}
        loading={loading}
      />
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
      <TestimonialsSectionHeader
        title={content.title}
        subtitle={content.subtitle}
        onTitleChange={handleTitleChange}
      />

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
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
            onRemove={handleRemoveTestimonial}
            onChange={handleTestimonialChange}
            onAvatarChange={handleAvatarChange}
            avatarFile={avatarFiles[testimonial.id]}
          />
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
