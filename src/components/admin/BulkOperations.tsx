
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Download, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'inactive';
  progress: number;
}

export const BulkOperations = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      // Transform data to match our Student interface
      const studentsData: Student[] = enrollments?.map(enrollment => ({
        id: enrollment.id,
        name: enrollment.student_name,
        email: enrollment.email,
        phone: enrollment.phone,
        enrolledAt: enrollment.enrolled_at,
        status: enrollment.completed_at ? 'completed' : 'active',
        progress: enrollment.completed_at ? 100 : Math.floor(Math.random() * 80) // Mock progress
      })) || [];

      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedStudents.length === 0) {
      toast({
        title: "Error",
        description: "Please select students and an action.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      switch (bulkAction) {
        case 'send-email':
          await sendBulkEmail();
          break;
        case 'export-data':
          await exportStudentData();
          break;
        case 'mark-completed':
          await markAsCompleted();
          break;
        case 'send-certificates':
          await sendCertificates();
          break;
        case 'deactivate':
          await deactivateStudents();
          break;
        default:
          throw new Error('Invalid action');
      }

      toast({
        title: "Success",
        description: `Bulk action completed for ${selectedStudents.length} students.`,
      });

      setSelectedStudents([]);
      setBulkAction("");
      await fetchStudents(); // Refresh data
    } catch (error) {
      console.error('Error executing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to execute bulk action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendBulkEmail = async () => {
    // Mock implementation - in real app, this would send emails via an API
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Sending email to ${selectedStudents.length} students`);
  };

  const exportStudentData = async () => {
    const selectedStudentData = students.filter(s => selectedStudents.includes(s.id));
    
    const csvContent = [
      'Name,Email,Phone,Enrolled Date,Status,Progress',
      ...selectedStudentData.map(s => 
        `"${s.name}","${s.email}","${s.phone}","${new Date(s.enrolledAt).toLocaleDateString()}","${s.status}","${s.progress}%"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const markAsCompleted = async () => {
    const { error } = await supabase
      .from('course_enrollments')
      .update({ 
        completed_at: new Date().toISOString(),
        certificate_generated: true 
      })
      .in('id', selectedStudents);

    if (error) throw error;
  };

  const sendCertificates = async () => {
    // Mock implementation - in real app, this would generate and send certificates
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Sending certificates to ${selectedStudents.length} students`);
  };

  const deactivateStudents = async () => {
    // In a real implementation, you might have a status column to update
    // For now, we'll just simulate the action
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Deactivating ${selectedStudents.length} students`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-blue-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-orange-500 text-white">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Actions Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Selected: {selectedStudents.length} student(s)
              </label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose bulk action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send-email">Send Email Notification</SelectItem>
                  <SelectItem value="export-data">Export Student Data</SelectItem>
                  <SelectItem value="mark-completed">Mark as Completed</SelectItem>
                  <SelectItem value="send-certificates">Send Certificates</SelectItem>
                  <SelectItem value="deactivate">Deactivate Students</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={executeBulkAction}
              disabled={loading || selectedStudents.length === 0 || !bulkAction}
              className="w-full sm:w-auto"
            >
              {loading ? 'Processing...' : 'Execute Action'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table with Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Students Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => 
                            handleSelectStudent(student.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {getStatusBadge(student.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(student.enrolledAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setBulkAction('send-email')}>
          <CardContent className="p-4 flex items-center space-x-3">
            <Mail className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">Send Email</p>
              <p className="text-sm text-gray-500">Notify students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setBulkAction('export-data')}>
          <CardContent className="p-4 flex items-center space-x-3">
            <Download className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-gray-500">Download CSV</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setBulkAction('mark-completed')}>
          <CardContent className="p-4 flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-purple-500" />
            <div>
              <p className="font-medium">Mark Complete</p>
              <p className="text-sm text-gray-500">Bulk completion</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setBulkAction('send-certificates')}>
          <CardContent className="p-4 flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <div>
              <p className="font-medium">Certificates</p>
              <p className="text-sm text-gray-500">Send certificates</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
