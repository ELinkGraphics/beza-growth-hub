
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EnrollmentFormProps {
  courseId: string;
  courseTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EnrollmentForm = ({ courseId, courseTitle, onSuccess, onCancel }: EnrollmentFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.phone) {
      setIsSubmitting(true);
      
      try {
        // Insert enrollment into Supabase
        const { data, error } = await supabase
          .from('course_enrollments')
          .insert({
            student_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            course_id: courseId
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        toast({
          title: "Enrollment Successful!",
          description: `Welcome to ${courseTitle}. Let's start learning!`,
        });

        onSuccess();
      } catch (error) {
        console.error('Error enrolling student:', error);
        toast({
          title: "Enrollment Failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-gray-600 mb-6">
        <p>Please provide your details to access <strong>{courseTitle}</strong> and receive your certificate upon completion.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full Name *
          </Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">This will appear on your certificate</p>
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your email"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number *
          </Label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
            disabled={!formData.fullName || !formData.email || !formData.phone || isSubmitting}
          >
            {isSubmitting ? "Enrolling..." : "Start Learning Now"}
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-gray-500">
        By enrolling, you agree to receive course updates and communications.
      </div>
    </div>
  );
};
