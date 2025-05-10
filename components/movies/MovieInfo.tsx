import Image from "next/image";
import Link from "next/link";
import { getBackdropUrl, getPosterUrl } from "@/app/lib/tmdb";
import { MovieInfoSkeleton } from "@/components/skeletons/MovieDetailsSkeleton";
import { TrailerButton } from "@/components/common/TrailerButton";
import { WatchlistButton } from "@/components/movies/WatchlistButton";
import { useMovieDetails } from "@/app/hooks/useMovieQueries";
import { Genre } from "@/app/types";
import { formatCurrency, formatRuntime, formatReleaseDate } from "./utils";

export function MovieInfo({ id }: { id: number }) {
  const { data: movie, isLoading, error } = useMovieDetails(id);

  if (isLoading) {
    return <MovieInfoSkeleton />;
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error loading movie details</p>
      </div>
    );
  }

  const formattedRuntime = formatRuntime(movie.runtime);
  const releaseDate = formatReleaseDate(movie.release_date);

  return (
    <div className="relative">
      {/* Backdrop with gradient overlay */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <Image
          src={getBackdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie poster */}
          <div className="w-full max-w-[300px] mx-auto md:mx-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-xl">
              <Image
                src={getPosterUrl(movie.poster_path, "large")}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Movie details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-neutral-400 italic mb-4">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre: Genre) => (
                <Link
                  key={genre.id}
                  href={`/movies/genre/${genre.id}`}
                  className="text-xs font-medium bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full hover:bg-neutral-700 transition"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-300 mb-6">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <span>|</span>
              <div>{formattedRuntime}</div>
              <span>|</span>
              <div>{releaseDate}</div>
              <span>|</span>
              <div>{movie.original_language.toUpperCase()}</div>
            </div>

            {/* Trailer Button and Watchlist Button */}
            <div className="flex items-center flex-wrap gap-3 mb-6">
              <TrailerButton videos={movie.videos} />
              <WatchlistButton movieId={movie.id} />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-medium text-white mb-2">Overview</h2>
              <p className="text-neutral-300">{movie.overview}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Details</h2>
                <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                  <dt className="text-neutral-400">Status</dt>
                  <dd className="text-white">{movie.status}</dd>

                  <dt className="text-neutral-400">Budget</dt>
                  <dd className="text-white">{formatCurrency(movie.budget)}</dd>

                  <dt className="text-neutral-400">Revenue</dt>
                  <dd className="text-white">
                    {formatCurrency(movie.revenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
