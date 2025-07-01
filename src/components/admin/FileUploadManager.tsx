
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Image, Video, Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  bucket: string;
  uploaded_at: string;
}

interface FileUploadManagerProps {
  bucket: 'course-files' | 'avatars';
  allowedTypes?: string[];
  maxFileSize?: number; // in MB
  onFileUploaded?: (fileUrl: string) => void;
}

export const FileUploadManager = ({ 
  bucket, 
  allowedTypes = ['image/*', 'video/*', 'application/pdf', 'text/*'],
  maxFileSize = 10,
  onFileUploaded
}: FileUploadManagerProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(bucket).list('', {
        limit: 100,
        offset: 0,
      });

      if (error) throw error;

      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name);
          
          return {
            id: file.id || file.name,
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'unknown',
            url: urlData.publicUrl,
            bucket,
            uploaded_at: file.created_at || new Date().toISOString()
          };
        })
      );

      setFiles(filesWithUrls);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to load files.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFiles();
  }, [bucket]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(selectedFiles)) {
        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds ${maxFileSize}MB limit.`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

        toast({
          title: "Success",
          description: `${file.name} uploaded successfully.`,
        });

        // Notify parent component
        onFileUploaded?.(urlData.publicUrl);
      }

      // Refresh file list
      fetchFiles();
      
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload one or more files.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([fileName]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully.",
      });

      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>File Manager - {bucket}</span>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Max file size: {maxFileSize}MB. Allowed types: {allowedTypes.join(', ')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.type}
                        </Badge>
                        <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(file.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
