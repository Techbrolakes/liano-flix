"use client";
import { MovieCatalogue } from "@/app/components/MovieCatalogue";
import { usePopularMovies } from "@/app/hooks/useMovieQueries";

function PopularMoviesContent() {
  const { data, isLoading } = usePopularMovies(1);

  if (isLoading || !data) {
    return <MovieCatalogueSkeleton />;
  }

  return (
    <MovieCatalogue
      initialMovies={data.results}
      totalPages={data.total_pages}
      fetchType="popular"
    />
  );
}

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Popular Movies</h1>
      <PopularMoviesContent />
    </div>
  );
}

function MovieCatalogueSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[2/3] bg-muted rounded-md mb-2" />
          <div className="h-4 bg-muted rounded mb-1 w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
