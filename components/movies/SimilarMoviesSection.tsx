import { SimilarMoviesSkeleton } from "@/components/skeletons/MovieDetailsSkeleton";
import { useSimilarMovies } from "@/app/hooks/useMovieQueries";
import { MovieRow } from "./MovieRow";

export function SimilarMoviesSection({ id }: { id: number }) {
  const { data, isLoading, error } = useSimilarMovies(id);

  if (isLoading) {
    return <SimilarMoviesSkeleton />;
  }

  if (error || !data || data.results.length === 0) {
    return null;
  }

  const similarMovies = data.results;

  return (
    <div className="container mx-auto px-4 py-8">
      <MovieRow
        title="Similar Movies"
        movies={similarMovies}
        viewAllHref={`/movies/${id}/similar`}
      />
    </div>
  );
}
