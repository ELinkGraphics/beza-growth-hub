
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Award, Star, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  completionDate: string;
}

export const EnhancedCertificateModal = ({ 
  isOpen, 
  onClose, 
  studentName, 
  courseName, 
  completionDate 
}: EnhancedCertificateModalProps) => {
  const { toast } = useToast();

  const generatePDF = () => {
    // Create a more professional certificate content
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Completion</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            border: 8px solid #f8f9fa;
          }
          .header {
            margin-bottom: 40px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
          }
          .title {
            font-size: 48px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 40px;
          }
          .recipient {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin: 30px 0;
            text-decoration: underline;
          }
          .course {
            font-size: 24px;
            font-style: italic;
            color: #2d3748;
            margin: 30px 0;
          }
          .date {
            font-size: 16px;
            color: #666;
            margin: 30px 0;
          }
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
          }
          .signature {
            text-align: center;
            flex: 1;
          }
          .signature-line {
            border-top: 2px solid #333;
            margin: 20px 20px 5px 20px;
          }
          .stars {
            color: #fbbf24;
            font-size: 24px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">🌟 GROW WITH BEZA 🌟</div>
            <div class="title">Certificate of Completion</div>
            <div class="stars">★ ★ ★ ★ ★</div>
          </div>
          
          <div class="subtitle">This is to certify that</div>
          <div class="recipient">${studentName}</div>
          <div class="subtitle">has successfully completed the course</div>
          <div class="course">"${courseName}"</div>
          
          <div class="date">
            <strong>Date of Completion:</strong> ${new Date(completionDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          <div class="subtitle" style="margin-top: 40px;">
            Congratulations on your achievement in personal branding excellence!
          </div>
          
          <div class="signature-section">
            <div class="signature">
              <div class="signature-line"></div>
              <div>Beza Tewfik</div>
              <div style="font-size: 14px; color: #666;">Course Instructor</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div>Grow with Beza</div>
              <div style="font-size: 14px; color: #666;">Certification Authority</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${studentName.replace(/\s+/g, '-').toLowerCase()}-${courseName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded! 🎉",
      description: "Your certificate has been saved as an HTML file. Open it in your browser to print as PDF.",
    });
  };

  const shareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Course Completion Certificate',
        text: `I just completed "${courseName}" with Grow with Beza! 🎉`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`I just completed "${courseName}" with Grow with Beza! 🎉`);
      toast({
        title: "Copied to clipboard!",
        description: "Share your achievement on social media!",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-8 w-8 text-yellow-500" />
            🎉 Congratulations! Course Completed! 🎉
          </DialogTitle>
          <DialogDescription className="text-lg">
            You have successfully completed all lessons in "{courseName}". Download your certificate below and share your achievement!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Enhanced Certificate Preview */}
          <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-4 border-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                    <Award className="h-20 w-20 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-lg font-medium text-brand-600">🌟 GROW WITH BEZA 🌟</div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Certificate of Completion
                  </h2>
                </div>
                
                <div className="flex justify-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="space-y-4 max-w-2xl mx-auto">
                  <p className="text-xl text-gray-600">This is to certify that</p>
                  <p className="text-3xl md:text-4xl font-bold text-brand-600 border-b-4 border-brand-200 pb-2 inline-block">
                    {studentName}
                  </p>
                  <p className="text-xl text-gray-600">has successfully completed the course</p>
                  <p className="text-2xl md:text-3xl font-semibold text-gray-800 italic">
                    "{courseName}"
                  </p>
                </div>
                
                <div className="pt-6">
                  <p className="text-sm text-gray-500 mb-2">Date of Completion</p>
                  <p className="text-xl font-medium text-gray-700">
                    {new Date(completionDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="pt-6 border-t-2 border-gray-200">
                  <p className="text-lg text-gray-600 italic mb-4">
                    Congratulations on your achievement in personal branding excellence!
                  </p>
                  
                  <div className="flex justify-center space-x-12 text-center">
                    <div>
                      <div className="border-t-2 border-gray-400 w-32 mx-auto mb-2"></div>
                      <p className="font-semibold">Beza Tewfik</p>
                      <p className="text-sm text-gray-500">Course Instructor</p>
                    </div>
                    <div>
                      <div className="border-t-2 border-gray-400 w-32 mx-auto mb-2"></div>
                      <p className="font-semibold">Grow with Beza</p>
                      <p className="text-sm text-gray-500">Certification Authority</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={generatePDF}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Certificate
            </Button>
            
            <Button
              onClick={shareCertificate}
              variant="outline"
              size="lg"
              className="border-2 border-brand-500 text-brand-600 hover:bg-brand-50 px-8 py-3 text-lg font-semibold"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Achievement
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              Close
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              🎊 Share your achievement on social media and showcase your new skills! 🎊
            </p>
            <p className="text-xs text-gray-400">
              Certificate ID: CERT-{Date.now()}-{studentName.replace(/\s+/g, '').toUpperCase()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
