
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Award, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  completionDate: string;
}

export const CertificateModal = ({ 
  isOpen, 
  onClose, 
  studentName, 
  courseName, 
  completionDate 
}: CertificateModalProps) => {
  const { toast } = useToast();

  const downloadCertificate = () => {
    // Create a certificate content
    const certificateContent = `
      Certificate of Completion
      
      This is to certify that
      ${studentName}
      
      has successfully completed the course
      ${courseName}
      
      Date of Completion: ${completionDate}
      
      Congratulations on your achievement!
    `;

    // Create a blob and download link
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${studentName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded!",
      description: "Your certificate has been downloaded successfully.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            Congratulations! Course Completed
          </DialogTitle>
          <DialogDescription>
            You have successfully completed all lessons in the course. Download your certificate below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Certificate Preview */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-gold">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Award className="h-16 w-16 text-yellow-500" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800">
                  Certificate of Completion
                </h2>
                
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg text-gray-600">This is to certify that</p>
                  <p className="text-2xl font-bold text-brand-600">{studentName}</p>
                  <p className="text-lg text-gray-600">has successfully completed the course</p>
                  <p className="text-xl font-semibold text-gray-800">{courseName}</p>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-gray-500">Date of Completion</p>
                  <p className="text-lg font-medium text-gray-700">{completionDate}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 italic">
                    Congratulations on your achievement!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={downloadCertificate}
              className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              Close
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Share your achievement on social media and showcase your new skills!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
