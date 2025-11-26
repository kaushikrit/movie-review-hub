const TMDB_API_KEY = "4d12f08de7f602152e7edd5ec6c830d5";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
}

export const tmdb = {
  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results || [];
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );
    return response.json();
  },

  getPosterUrl: (path: string | null, size: "w185" | "w500" | "original" = "w500") => {
    if (!path) return "https://via.placeholder.com/500x750?text=No+Poster";
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  },
};
