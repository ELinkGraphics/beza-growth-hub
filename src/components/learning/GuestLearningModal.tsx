
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, User, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GuestLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestContinue: (email: string) => void;
  onCreateAccount: (email: string, name: string) => void;
}

export const GuestLearningModal = ({ 
  isOpen, 
  onClose, 
  onGuestContinue, 
  onCreateAccount 
}: GuestLearningModalProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showFullForm, setShowFullForm] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (showFullForm) {
      if (!name) {
        toast({
          title: "Name required",
          description: "Please enter your name to create an account",
          variant: "destructive",
        });
        return;
      }
      onCreateAccount(email, name);
    } else {
      onGuestContinue(email);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Continue Learning
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center text-gray-600">
            <p>Get the most out of your learning experience</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {showFullForm && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600"
              >
                {showFullForm ? 'Create Account & Continue' : 'Continue as Guest'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {!showFullForm && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowFullForm(true)}
                >
                  Create Free Account Instead
                </Button>
              )}
            </div>
          </form>

          <div className="text-center text-xs text-gray-500">
            <p>
              {showFullForm 
                ? "Create an account to save your progress and access exclusive content"
                : "Your progress will be saved temporarily. Create an account to keep it permanently."
              }
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
