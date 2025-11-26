import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdb, MovieDetails as MovieDetailsType } from "@/lib/tmdb";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const fetchMovieAndReviews = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const movieData = await tmdb.getMovieDetails(Number(id));
      setMovie(movieData);

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("movie_id", id)
        .order("created_at", { ascending: false });

      setReviews(reviewsData || []);

      const userIdentifier = localStorage.getItem("user_identifier");
      if (userIdentifier) {
        const hasReviewed = reviewsData?.some(
          (r) => r.user_identifier === userIdentifier
        );
        setUserHasReviewed(hasReviewed || false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieAndReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <Skeleton className="aspect-[2/3] rounded-lg" />
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  const year = movie.release_date?.split("-")[0] || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <img
              src={tmdb.getPosterUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {movie.title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {year}
                </span>
                {movie.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {movie.runtime} min
                  </span>
                )}
              </div>
              {movie.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-4 mb-2">
                <StarRating rating={Math.round(averageRating)} size="lg" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Overview</h2>
              <p className="text-foreground leading-relaxed">{movie.overview}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">User Reviews</h2>
            <ReviewList reviews={reviews} />
          </div>

          <div>
            {!userHasReviewed ? (
              <ReviewForm
                movieId={id!}
                movieTitle={movie.title}
                movieYear={year}
                moviePoster={tmdb.getPosterUrl(movie.poster_path)}
                onReviewSubmitted={fetchMovieAndReviews}
              />
            ) : (
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-muted-foreground text-center">
                  You've already reviewed this movie!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
