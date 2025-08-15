import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
  existingReview?: {
    id: string;
    rating: number;
    review_text: string;
  };
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmitted,
  existingReview,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        product_id: productId,
        buyer_id: user.id,
        rating,
        review_text: reviewText,
      };

      let result;
      if (existingReview) {
        // Update existing review
        result = await supabase
          .from("reviews")
          .update(reviewData)
          .eq("id", existingReview.id);
      } else {
        // Create new review
        result = await supabase
          .from("reviews")
          .insert(reviewData);
      }

      if (result.error) throw result.error;

      toast.success(existingReview ? "Review updated successfully!" : "Review submitted successfully!");
      onReviewSubmitted();
      
      if (!existingReview) {
        setRating(0);
        setReviewText("");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please log in to write a review
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <StarRating
              rating={rating}
              interactive
              onRatingChange={setRating}
              size="lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Review (Optional)
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting || rating === 0}>
            {isSubmitting 
              ? (existingReview ? "Updating..." : "Submitting...") 
              : (existingReview ? "Update Review" : "Submit Review")
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};