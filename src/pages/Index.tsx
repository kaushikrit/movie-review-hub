import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { tmdb, Movie } from "@/lib/tmdb";
import { Search, Film } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a movie title");
      return;
    }

    setIsSearching(true);
    try {
      const results = await tmdb.searchMovies(searchQuery);
      setMovies(results);
      if (results.length === 0) {
        toast.info("No movies found. Try a different search term.");
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      toast.error("Failed to search movies. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">MovieReviews</h1>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <Input
              type="text"
              placeholder="Search for a movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching}>
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Discover Movies
            </h2>
            <p className="text-muted-foreground">
              Search for your favorite movies and share your reviews
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Search Results ({movies.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
