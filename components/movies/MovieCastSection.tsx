import { CastCarousel } from "@/components/CastCarousel";
import { MovieCastSkeleton } from "@/components/skeletons/MovieDetailsSkeleton";
import { useMovieCredits } from "@/app/hooks/useMovieQueries";

export function MovieCastSection({ id }: { id: number }) {
  const { data: credits, isLoading, error } = useMovieCredits(id);

  if (isLoading) {
    return <MovieCastSkeleton />;
  }

  if (error || !credits || credits.cast.length === 0) {
    return null;
  }

  const cast = credits.cast.slice(0, 20); // Get more cast members for the carousel

  return (
    <div className="container mx-auto">
      <CastCarousel title="Cast" cast={cast} />
    </div>
  );
}
