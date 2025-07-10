import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StickyNote, Plus, Clock, Trash2, Edit2, Save, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Note {
  id: string;
  note_content: string;
  timestamp_seconds?: number;
  created_at: string;
  updated_at: string;
  lesson_id: number;
}

interface Bookmark {
  id: string;
  lesson_id: number;
  timestamp_seconds?: number;
  created_at: string;
}

interface StudentNotesProps {
  enrollmentId: string;
  currentLessonId: number;
  videoCurrentTime?: number;
}

export const StudentNotes = ({ enrollmentId, currentLessonId, videoCurrentTime }: StudentNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
    fetchBookmarks();
  }, [enrollmentId, currentLessonId]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('student_notes')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .eq('lesson_id', currentLessonId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_bookmarks')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .eq('lesson_id', currentLessonId)
        .order('timestamp_seconds', { ascending: true });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const createNote = async () => {
    if (!newNoteContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter note content.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('student_notes')
        .insert({
          enrollment_id: enrollmentId,
          lesson_id: currentLessonId,
          note_content: newNoteContent,
          timestamp_seconds: videoCurrentTime ? Math.floor(videoCurrentTime) : null
        });

      if (error) throw error;

      setNewNoteContent("");
      setShowNewNoteForm(false);
      fetchNotes();

      toast({
        title: "Success",
        description: "Note saved successfully!",
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to save note.",
        variant: "destructive",
      });
    }
  };

  const updateNote = async (noteId: string) => {
    if (!editingContent.trim()) return;

    try {
      const { error } = await supabase
        .from('student_notes')
        .update({ note_content: editingContent })
        .eq('id', noteId);

      if (error) throw error;

      setEditingNoteId(null);
      setEditingContent("");
      fetchNotes();

      toast({
        title: "Success",
        description: "Note updated successfully!",
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note.",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('student_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      fetchNotes();
      toast({
        title: "Success",
        description: "Note deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive",
      });
    }
  };

  const createBookmark = async () => {
    if (!videoCurrentTime) {
      toast({
        title: "Error",
        description: "Cannot create bookmark without video timestamp.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('lesson_bookmarks')
        .insert({
          enrollment_id: enrollmentId,
          lesson_id: currentLessonId,
          timestamp_seconds: Math.floor(videoCurrentTime)
        });

      if (error) throw error;

      fetchBookmarks();
      toast({
        title: "Success",
        description: "Bookmark created successfully!",
      });
    } catch (error) {
      console.error('Error creating bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to create bookmark.",
        variant: "destructive",
      });
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('lesson_bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      fetchBookmarks();
      toast({
        title: "Success",
        description: "Bookmark deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to delete bookmark.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.note_content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading notes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Notes Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <StickyNote className="h-5 w-5" />
              <span>My Notes</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewNoteForm(!showNewNoteForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New Note Form */}
          {showNewNoteForm && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Textarea
                  placeholder="Write your note here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                />
                {videoCurrentTime && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Current time: {formatTime(Math.floor(videoCurrentTime))}</span>
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button onClick={createNote}>Save Note</Button>
                  <Button variant="outline" onClick={() => setShowNewNoteForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes yet. Start taking notes to enhance your learning!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    {editingNoteId === note.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => updateNote(note.id)}>
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {note.timestamp_seconds && (
                              <Badge variant="secondary" className="text-xs">
                                {formatTime(note.timestamp_seconds)}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(note)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNote(note.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{note.note_content}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookmarks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Video Bookmarks</span>
            </CardTitle>
            {videoCurrentTime && (
              <Button variant="outline" size="sm" onClick={createBookmark}>
                <Plus className="h-4 w-4 mr-2" />
                Bookmark Current Time
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookmarks yet. Save important moments in the video!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">
                      {bookmark.timestamp_seconds ? formatTime(bookmark.timestamp_seconds) : 'No time'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteBookmark(bookmark.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};