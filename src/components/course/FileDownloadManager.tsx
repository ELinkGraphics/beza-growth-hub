import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Image, Film, Archive, ExternalLink } from "lucide-react";

interface CourseFile {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

interface FileDownloadManagerProps {
  courseId: string;
  lessonId?: number;
  enrollmentId: string;
}

export const FileDownloadManager = ({ courseId, lessonId, enrollmentId }: FileDownloadManagerProps) => {
  const [courseFiles, setCourseFiles] = useState<CourseFile[]>([]);
  const [lessonFiles, setLessonFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourseFiles();
    if (lessonId) {
      fetchLessonFiles();
    }
  }, [courseId, lessonId]);

  const fetchCourseFiles = async () => {
    try {
      // Fetch files from the course-materials storage bucket
      const { data: files, error } = await supabase.storage
        .from('course-materials')
        .list(`${courseId}/`, {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;

      const fileData = await Promise.all(
        (files || []).map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from('course-materials')
            .createSignedUrl(`${courseId}/${file.name}`, 3600);

          return {
            name: file.name,
            url: urlData?.signedUrl || '',
            size: file.metadata?.size,
            type: file.metadata?.mimetype
          };
        })
      );

      setCourseFiles(fileData.filter(file => file.url));
    } catch (error) {
      console.error('Error fetching course files:', error);
    }
  };

  const fetchLessonFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('course_content')
        .select('file_urls')
        .eq('lesson_id', lessonId)
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setLessonFiles(data?.file_urls || []);
    } catch (error) {
      console.error('Error fetching lesson files:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      // For storage files, we already have signed URLs
      if (fileUrl.includes('supabase')) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For external URLs, open in new tab
        window.open(fileUrl, '_blank');
      }

      toast({
        title: "Download Started",
        description: `Downloading ${fileName}...`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the file.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (filename: string, fileType?: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const type = fileType?.toLowerCase();

    if (type?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    if (type?.startsWith('video/') || ['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(extension || '')) {
      return <Film className="h-4 w-4" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <Archive className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeLabel = (filename: string, fileType?: string) => {
    const extension = filename.split('.').pop()?.toUpperCase();
    if (fileType?.startsWith('image/')) return 'Image';
    if (fileType?.startsWith('video/')) return 'Video';
    if (fileType?.startsWith('audio/')) return 'Audio';
    if (fileType?.includes('pdf')) return 'PDF';
    if (fileType?.includes('document') || fileType?.includes('word')) return 'Document';
    if (fileType?.includes('spreadsheet') || fileType?.includes('excel')) return 'Spreadsheet';
    if (fileType?.includes('presentation') || fileType?.includes('powerpoint')) return 'Presentation';
    return extension || 'File';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading files...</div>;
  }

  const hasFiles = courseFiles.length > 0 || lessonFiles.length > 0;

  if (!hasFiles) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No downloadable files available for this lesson.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Files */}
      {courseFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Course Materials</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courseFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.name, file.type)}
                    <div className="flex flex-col">
                      <span className="font-medium">{file.name}</span>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {getFileTypeLabel(file.name, file.type)}
                        </Badge>
                        {file.size && (
                          <span>{formatFileSize(file.size)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(file.url, file.name)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lesson Files */}
      {lessonFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Lesson Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lessonFiles.map((fileUrl, index) => {
                const fileName = fileUrl.split('/').pop() || `Resource ${index + 1}`;
                const isExternalUrl = !fileUrl.includes(window.location.hostname);
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {isExternalUrl ? (
                        <ExternalLink className="h-4 w-4" />
                      ) : (
                        getFileIcon(fileName)
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{fileName}</span>
                        <span className="text-sm text-muted-foreground">
                          {isExternalUrl ? 'External Resource' : 'Course File'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(fileUrl, fileName)}
                    >
                      {isExternalUrl ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};