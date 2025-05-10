import { ActorFilmographySkeleton } from "@/components/skeletons/ActorDetailsSkeleton";
import { useSortedActorMovieCredits } from "@/app/hooks/useActorQueries";
import { Movie } from "@/app/types";
import { MovieCarousel } from "../movies";

export function ActorFilmography({ id }: { id: number }) {
  const { data: movies, isLoading, error } = useSortedActorMovieCredits(id);

  if (isLoading) {
    return <ActorFilmographySkeleton />;
  }

  if (error || !movies || movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-white mb-4">Filmography</h2>
        <p className="text-neutral-400">No movies found.</p>
      </div>
    );
  }

  const mappedMovies: Movie[] = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path || "",
    backdrop_path: "",
    overview: "",
    release_date: movie.release_date,
    vote_average: 0,
    vote_count: 0,
    popularity: 0,
    genre_ids: [],
    original_language: "en",
    adult: false,
    video: false,
    original_title: movie.title,
  }));

  return (
    <div className="container mx-auto">
      <MovieCarousel title="Filmography" movies={mappedMovies} />
    </div>
  );
}
