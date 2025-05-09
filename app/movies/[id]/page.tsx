import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MovieRow } from "@/app/components/MovieRow";
import { CastCarousel } from "@/app/components/CastCarousel";
import { MovieCredits, MovieDetails } from "@/app/types";
import { getBackdropUrl, getPosterUrl } from "@/app/lib/tmdb";
import { moviesAPI } from "@/app/lib/api";
import { MovieInfoSkeleton, MovieCastSkeleton, SimilarMoviesSkeleton } from "@/app/components/skeletons/MovieDetailsSkeleton";
import { TrailerButton } from "@/app/components/TrailerButton";

async function getMovieDetails(id: number): Promise<MovieDetails> {
  try {
    return await moviesAPI.getMovieDetails(id);
  } catch (error) {
    console.error(`Error fetching movie details for id ${id}:`, error);
    throw error;
  }
}

async function getMovieCredits(id: number): Promise<MovieCredits> {
  try {
    return await moviesAPI.getMovieCredits(id);
  } catch (error) {
    console.error(`Error fetching movie credits for id ${id}:`, error);
    throw error;
  }
}

async function getSimilarMovies(id: number) {
  try {
    const data = await moviesAPI.getSimilarMovies(id);
    return data.results;
  } catch (error) {
    console.error(`Error fetching similar movies for id ${id}:`, error);
    return [];
  }
}

async function MovieInfo({ id }: { id: number }) {
  try {
    const movie = await getMovieDetails(id);

    // Format runtime to hours and minutes
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    const formattedRuntime = `${hours}h ${minutes}m`;

    // Format release date
    const releaseDate = new Date(movie.release_date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

    // Format budget and revenue
    const formatCurrency = (amount: number) => {
      if (amount === 0) return "N/A";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount);
    };

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
                {movie.genres.map((genre) => (
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
                    className="w-4 h-4 text-amber-400"
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
              
              {/* Trailer Button */}
              <div className="mb-6">
                <TrailerButton videos={movie.videos} />
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-medium text-white mb-2">
                  Overview
                </h2>
                <p className="text-neutral-300">{movie.overview}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-medium text-white mb-2">
                    Details
                  </h2>
                  <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                    <dt className="text-neutral-400">Status</dt>
                    <dd className="text-white">{movie.status}</dd>

                    <dt className="text-neutral-400">Budget</dt>
                    <dd className="text-white">
                      {formatCurrency(movie.budget)}
                    </dd>

                    <dt className="text-neutral-400">Revenue</dt>
                    <dd className="text-white">
                      {formatCurrency(movie.revenue)}
                    </dd>

                    {/* Studios section removed as production_companies property is not available in the current MovieDetails type */}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error rendering MovieInfo for id ${id}:`, error);
    notFound();
  }
}

async function MovieCastSection({ id }: { id: number }) {
  try {
    const credits = await getMovieCredits(id);
    const cast = credits.cast.slice(0, 20); // Get more cast members for the carousel

    if (cast.length === 0) {
      return null;
    }

    return (
      <div className="container mx-auto">
        <CastCarousel title="Cast" cast={cast} />
      </div>
    );
  } catch (error) {
    console.error(`Error rendering MovieCastSection for id ${id}:`, error);
    return null;
  }
}

async function SimilarMoviesSection({ id }: { id: number }) {
  const similarMovies = await getSimilarMovies(id);

  if (similarMovies.length === 0) {
    return null;
  }

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

export default async function MoviePage({ params }: { params: { id: string } }) {
  // We need to await params in dynamic routes
  const id = await params.id;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) {
    notFound();
  }

  return (
    <div className="pb-10 pt-16">
      <Suspense
        fallback={<MovieInfoSkeleton />}
      >
        <MovieInfo id={movieId} />
      </Suspense>

      <Suspense
        fallback={<MovieCastSkeleton />}
      >
        <MovieCastSection id={movieId} />
      </Suspense>

      <Suspense
        fallback={<SimilarMoviesSkeleton />}
      >
        <SimilarMoviesSection id={movieId} />
      </Suspense>
    </div>
  );
}
