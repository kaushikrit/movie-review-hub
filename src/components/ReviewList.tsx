import { Card } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review this movie!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-foreground">{review.user_name}</h4>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </p>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-foreground leading-relaxed">{review.review_text}</p>
        </Card>
      ))}
    </div>
  );
};
