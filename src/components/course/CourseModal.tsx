
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, Award, Play } from "lucide-react";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: () => void;
}

export const CourseModal = ({ isOpen, onClose, onEnroll }: CourseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-800 mb-4">
            Fundamentals of Personal Branding
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Course Hero Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80" 
              alt="Fundamentals of Personal Branding" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-brand-500/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20">
                Most Popular
              </span>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 bg-brand-100 rounded-lg">
                  <Clock className="h-6 w-6 text-brand-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">8</p>
              <p className="text-sm text-gray-500">Hours</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 bg-brand-100 rounded-lg">
                  <Users className="h-6 w-6 text-brand-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">1,200+</p>
              <p className="text-sm text-gray-500">Students</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 bg-brand-100 rounded-lg">
                  <Star className="h-6 w-6 text-brand-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">4.9</p>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">About This Course</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Learn how to build a powerful personal brand that opens doors to new opportunities. 
              This comprehensive course covers everything from defining your unique value proposition 
              to building an authentic online presence that resonates with your target audience.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Through practical exercises and real-world examples, you'll develop the skills needed to 
              stand out in your industry and attract the right opportunities.
            </p>
          </div>

          {/* What You'll Learn */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What You'll Learn:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Define your unique value proposition</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Create compelling content</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Build authentic relationships</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Leverage social media effectively</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Measure your brand impact</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Network strategically</span>
              </div>
            </div>
          </div>

          {/* Course Curriculum */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Curriculum:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Play className="h-5 w-5 text-brand-600" />
                <span className="text-gray-700">Module 1: Understanding Personal Branding</span>
                <span className="text-sm text-gray-500 ml-auto">45 min</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Play className="h-5 w-5 text-brand-600" />
                <span className="text-gray-700">Module 2: Defining Your Brand Identity</span>
                <span className="text-sm text-gray-500 ml-auto">60 min</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Play className="h-5 w-5 text-brand-600" />
                <span className="text-gray-700">Module 3: Content Creation Strategies</span>
                <span className="text-sm text-gray-500 ml-auto">90 min</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Play className="h-5 w-5 text-brand-600" />
                <span className="text-gray-700">Module 4: Building Your Online Presence</span>
                <span className="text-sm text-gray-500 ml-auto">75 min</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-4xl font-bold text-green-600">FREE</span>
                <p className="text-green-700 font-medium">Limited Time Offer</p>
              </div>
              <div className="text-right">
                <span className="text-gray-500 line-through text-lg">$297</span>
                <p className="text-sm text-green-600 font-medium">Save $297</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onEnroll}
                className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg flex-1 h-12 text-lg font-semibold"
              >
                <Award className="h-5 w-5 mr-2" />
                Enroll Now - FREE
              </Button>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
                Certificate included • Lifetime access
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
