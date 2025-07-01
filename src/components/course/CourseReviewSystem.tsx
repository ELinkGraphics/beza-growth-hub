
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
  created_at: string;
  course_enrollments: {
    student_name: string;
  };
}

interface CourseReviewSystemProps {
  courseId: string;
  enrollmentId?: string;
  canReview?: boolean;
}

export const CourseReviewSystem = ({ courseId, enrollmentId, canReview = false }: CourseReviewSystemProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { toast } = useToast();

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review_text: ""
  });

  useEffect(() => {
    fetchReviews();
    if (canReview && enrollmentId) {
      checkExistingReview();
    }
  }, [courseId, enrollmentId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select(`
          *,
          course_enrollments(student_name)
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingReview = async () => {
    if (!enrollmentId) return;

    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select(`
          *,
          course_enrollments(student_name)
        `)
        .eq('course_id', courseId)
        .eq('enrollment_id', enrollmentId)
        .single();

      if (data) {
        setUserReview(data);
        setReviewForm({
          rating: data.rating,
          review_text: data.review_text || ""
        });
      }
    } catch (error) {
      // No existing review found, which is fine
      console.log('No existing review found');
    }
  };

  const handleSubmitReview = async () => {
    if (!enrollmentId || reviewForm.rating === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        course_id: courseId,
        enrollment_id: enrollmentId,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text
      };

      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('course_reviews')
          .update(reviewData)
          .eq('id', userReview.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Your review has been updated!",
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('course_reviews')
          .insert([reviewData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Thank you for your review!",
        });

        // Send notification
        await supabase.functions.invoke('send-email-notification', {
          body: {
            type: 'new_review',
            reviewId: userReview?.id
          }
        });
      }

      fetchReviews();
      checkExistingReview();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Course Reviews</span>
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Submit Review Form */}
      {canReview && (
        <Card>
          <CardHeader>
            <CardTitle>
              {userReview ? 'Update Your Review' : 'Write a Review'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating *</label>
              {renderStars(reviewForm.rating, true, (rating) => 
                setReviewForm({ ...reviewForm, rating })
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Review (Optional)</label>
              <Textarea
                value={reviewForm.review_text}
                onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                placeholder="Share your thoughts about this course..."
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={submitting || reviewForm.rating === 0}
              className="w-full"
            >
              {submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to review this course!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{review.course_enrollments.student_name}</span>
                      {review.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {review.review_text && (
                  <p className="text-gray-700 mt-3">{review.review_text}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
