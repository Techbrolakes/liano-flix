"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { moviesAPI } from "@/app/lib/api";
import { Movie } from "@/app/types";
import { MovieGrid } from "../../../components/movies/MovieGrid";
import { PageHeader } from "../../../components/ui/page-header";
import { Loader2 } from "lucide-react";

export default function GenrePage() {
  const params = useParams();
  const genreId = Number(params.id);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        setLoading(true);

        // Get genre name
        const genresResponse = await moviesAPI.getGenres();
        const genre = genresResponse.genres.find((g) => g.id === genreId);

        if (genre) {
          setGenreName(genre.name);

          // Get movies for this genre
          const moviesResponse = await moviesAPI.getMoviesByGenre(genreId, 1);
          setMovies(moviesResponse.results);
          setTotalPages(moviesResponse.total_pages);
        }
      } catch (error) {
        console.error("Error fetching genre movies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (genreId) {
      fetchGenreMovies();
    }
  }, [genreId]);

  const loadMoreMovies = async () => {
    if (loadingMore || page >= totalPages) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await moviesAPI.getMoviesByGenre(genreId, nextPage);

      setMovies((prev) => [...prev, ...response.results]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <PageHeader
        title={genreName}
        subtitle={`Explore all ${genreName} movies`}
      />

      <MovieGrid movies={movies} />

      {page < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreMovies}
            disabled={loadingMore}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 hover:bg-primary/90 text-white rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
