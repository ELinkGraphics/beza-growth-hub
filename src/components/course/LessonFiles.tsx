
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, File, FileText, Image } from "lucide-react";

interface LessonFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'other';
  size: string;
  url: string;
}

interface LessonFilesProps {
  lessonId: number;
}

export const LessonFiles = ({ lessonId }: LessonFilesProps) => {
  // Mock data - in real implementation, this would come from your database
  const lessonFiles: LessonFile[] = [
    {
      id: "1",
      name: "Lesson Slides.pdf",
      type: "pdf",
      size: "2.3 MB",
      url: "#"
    },
    {
      id: "2",
      name: "Personal Brand Worksheet.pdf",
      type: "pdf",
      size: "1.1 MB",
      url: "#"
    },
    {
      id: "3",
      name: "Brand Examples.png",
      type: "image",
      size: "450 KB",
      url: "#"
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownload = (file: LessonFile) => {
    // In a real implementation, you would handle the actual download
    console.log(`Downloading file: ${file.name}`);
    // For demo purposes, we'll just show a message
    alert(`Downloading ${file.name}...`);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Lesson Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lessonFiles.length > 0 ? (
          <div className="space-y-3">
            {lessonFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(file)}
                  className="hover:bg-brand-50 hover:border-brand-300"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <File className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No additional resources for this lesson</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
