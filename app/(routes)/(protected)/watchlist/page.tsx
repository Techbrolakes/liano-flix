"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { useAuthStore } from "@/app/store/authStore";
import { SpinnerIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Movie } from "@/app/lib/types";
import { moviesAPI } from "@/app/lib/api";
import { WatchlistItem } from "@/app/supabase/types";

export default function WatchlistPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user's watchlist from the database
        const { data, error } = await supabase
          .from("watchlist")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        if (data) {
          const moviePromises = data.map(async (item: WatchlistItem) => {
            try {
              const movieDetails = await moviesAPI.getMovieDetails(
                item.movie_id
              );
              return movieDetails as unknown as Movie;
            } catch (err) {
              console.error(`Error fetching movie ${item.movie_id}:`, err);
              return null;
            }
          });

          const moviesData = await Promise.all(moviePromises);
          // Filter out any null values (failed fetches)
          setWatchlist(
            moviesData.filter((movie): movie is Movie => movie !== null)
          );
        }
      } catch (error: unknown) {
        console.error("Error fetching watchlist:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load watchlist"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movieId);

      if (error) {
        throw error;
      }

      // Update local state
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (error: unknown) {
      console.error("Error removing from watchlist:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove movie from watchlist"
      );
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <SpinnerIcon className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header with count */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/30 flex items-center gap-2 pr-4 pl-3 h-9"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Watchlist</h1>
              <p className="text-muted-foreground mt-1">
                {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved to watch later
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/movies/popular">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Movies
            </Link>
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Empty state */}
        {watchlist.length === 0 ? (
          <div className="bg-gradient-to-br from-card/50 to-card rounded-xl p-10 border border-border text-center shadow-sm">
            <div className="mb-6 bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-3">
              Your watchlist is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding movies to your watchlist to keep track of what you want
              to watch. Your saved movies will appear here.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link href="/movies/popular">Browse Popular Movies</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((movie) => (
              <div
                key={movie.id}
                className="bg-card rounded-xl overflow-hidden border border-border group hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:shadow-primary/5"
              >
                <div className="relative aspect-[2/3]">
                  <Link href={`/movies/${movie.id}`}>
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                        <span className="text-neutral-400">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => removeFromWatchlist(movie.id)}
                      className="bg-black/70 hover:bg-destructive text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                      title="Remove from watchlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/movies/${movie.id}`} className="text-white hover:text-primary transition-colors">
                      <span className="font-medium">View Details</span>
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <Link
                    href={`/movies/${movie.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    <h3 className="font-semibold mb-1 line-clamp-1">
                      {movie.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "N/A"}
                    </span>
                    <div className="flex items-center bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 mr-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
