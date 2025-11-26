import { Movie } from "@/lib/tmdb";
import { tmdb } from "@/lib/tmdb";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  const year = movie.release_date?.split("-")[0] || "N/A";

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-muted">
        <img
          src={tmdb.getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{year}</p>
      </div>
    </Card>
  );
};
