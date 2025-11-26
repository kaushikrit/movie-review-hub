import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewFormProps {
  movieId: string;
  movieTitle: string;
  movieYear: string;
  moviePoster: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm = ({
  movieId,
  movieTitle,
  movieYear,
  moviePoster,
  onReviewSubmitted,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      const userIdentifier = localStorage.getItem("user_identifier") || crypto.randomUUID();
      localStorage.setItem("user_identifier", userIdentifier);

      const { error } = await supabase.from("reviews").insert({
        movie_id: movieId,
        movie_title: movieTitle,
        movie_year: movieYear,
        movie_poster: moviePoster,
        rating,
        review_text: reviewText,
        user_identifier: userIdentifier,
        user_name: userName,
      });

      if (error) throw error;

      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 text-foreground">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="userName" className="text-foreground">Your Name</Label>
          <Input
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="mt-1"
            maxLength={100}
          />
        </div>

        <div>
          <Label className="text-foreground">Your Rating</Label>
          <div className="mt-2">
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="reviewText" className="text-foreground">Your Review</Label>
          <Textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            className="mt-1 min-h-[120px]"
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {reviewText.length}/1000 characters
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Card>
  );
};
