import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Plus, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Discussion {
  id: string;
  title: string;
  content: string;
  created_at: string;
  enrollment_id: string;
  lesson_id?: number;
  student_name?: string;
  replies_count?: number;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  enrollment_id: string;
  student_name?: string;
}

interface DiscussionForumProps {
  courseId: string;
  enrollmentId: string;
  lessonId?: number;
}

export const DiscussionForum = ({ courseId, enrollmentId, lessonId }: DiscussionForumProps) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const [newReplyContent, setNewReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDiscussions();
  }, [courseId, lessonId]);

  useEffect(() => {
    if (selectedDiscussion) {
      fetchReplies(selectedDiscussion.id);
    }
  }, [selectedDiscussion]);

  const fetchDiscussions = async () => {
    try {
      let query = supabase
        .from('course_discussions')
        .select(`
          *,
          course_enrollments!inner(student_name)
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const discussionsWithNames = data?.map(discussion => ({
        ...discussion,
        student_name: discussion.course_enrollments?.student_name || 'Anonymous'
      })) || [];

      setDiscussions(discussionsWithNames);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load discussions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (discussionId: string) => {
    try {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select(`
          *,
          course_enrollments!inner(student_name)
        `)
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const repliesWithNames = data?.map(reply => ({
        ...reply,
        student_name: reply.course_enrollments?.student_name || 'Anonymous'
      })) || [];

      setReplies(repliesWithNames);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const createDiscussion = async () => {
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('course_discussions')
        .insert({
          course_id: courseId,
          enrollment_id: enrollmentId,
          lesson_id: lessonId,
          title: newDiscussionTitle,
          content: newDiscussionContent
        });

      if (error) throw error;

      setNewDiscussionTitle("");
      setNewDiscussionContent("");
      setShowNewDiscussion(false);
      fetchDiscussions();

      toast({
        title: "Success",
        description: "Discussion created successfully!",
      });
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: "Error",
        description: "Failed to create discussion.",
        variant: "destructive",
      });
    }
  };

  const createReply = async () => {
    if (!newReplyContent.trim() || !selectedDiscussion) {
      return;
    }

    try {
      const { error } = await supabase
        .from('discussion_replies')
        .insert({
          discussion_id: selectedDiscussion.id,
          enrollment_id: enrollmentId,
          content: newReplyContent
        });

      if (error) throw error;

      setNewReplyContent("");
      fetchReplies(selectedDiscussion.id);

      toast({
        title: "Success",
        description: "Reply posted successfully!",
      });
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading discussions...</div>;
  }

  if (selectedDiscussion) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>{selectedDiscussion.title}</span>
            </CardTitle>
            <Button variant="outline" onClick={() => setSelectedDiscussion(null)}>
              Back to Discussions
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Original Discussion */}
          <div className="border-b pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {selectedDiscussion.student_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{selectedDiscussion.student_name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(selectedDiscussion.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedDiscussion.content}</p>
          </div>

          {/* Replies */}
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {reply.student_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{reply.student_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.content}</p>
              </div>
            ))}
          </div>

          {/* New Reply Form */}
          <div className="space-y-3">
            <Textarea
              placeholder="Write your reply..."
              value={newReplyContent}
              onChange={(e) => setNewReplyContent(e.target.value)}
              rows={3}
            />
            <Button onClick={createReply} disabled={!newReplyContent.trim()}>
              Post Reply
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Course Discussions</span>
          </CardTitle>
          <Button onClick={() => setShowNewDiscussion(!showNewDiscussion)}>
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Discussion Form */}
        {showNewDiscussion && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Input
                placeholder="Discussion title..."
                value={newDiscussionTitle}
                onChange={(e) => setNewDiscussionTitle(e.target.value)}
              />
              <Textarea
                placeholder="What would you like to discuss?"
                value={newDiscussionContent}
                onChange={(e) => setNewDiscussionContent(e.target.value)}
                rows={4}
              />
              <div className="flex space-x-2">
                <Button onClick={createDiscussion}>Create Discussion</Button>
                <Button variant="outline" onClick={() => setShowNewDiscussion(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discussions List */}
        {discussions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No discussions yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {discussions.map((discussion) => (
              <Card 
                key={discussion.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedDiscussion(discussion)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{discussion.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {discussion.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{discussion.student_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};