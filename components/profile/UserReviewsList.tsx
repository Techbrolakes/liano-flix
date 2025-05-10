"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useUserReviews } from "@/app/supabase/hooks";
import { SpinnerIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { moviesAPI } from "@/app/lib/api";
import { Movie } from "@/app/types";

interface UserReviewsListProps {
  limit?: number;
  showViewAllLink?: boolean;
}

export function UserReviewsList({ limit, showViewAllLink = false }: UserReviewsListProps) {
  const { data: reviews, isLoading, error } = useUserReviews();
  const [moviesData, setMoviesData] = useState<Record<number, Movie>>({});
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    const fetchMoviesData = async () => {
      if (!reviews || reviews.length === 0) {
        setLoadingMovies(false);
        return;
      }

      try {
        setLoadingMovies(true);
        const movieIds = [...new Set(reviews.map(review => review.movie_id))];
        
        const moviesPromises = movieIds.map(async (movieId) => {
          try {
            const movieDetails = await moviesAPI.getMovieDetails(movieId);
            return { id: movieId, data: movieDetails as unknown as Movie };
          } catch (err) {
            console.error(`Error fetching movie ${movieId}:`, err);
            return { id: movieId, data: null };
          }
        });

        const moviesResults = await Promise.all(moviesPromises);
        const moviesMap: Record<number, Movie> = {};
        
        moviesResults.forEach(result => {
          if (result.data) {
            moviesMap[result.id] = result.data;
          }
        });

        setMoviesData(moviesMap);
      } catch (err) {
        console.error("Error fetching movies data:", err);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMoviesData();
  }, [reviews]);

  if (isLoading || loadingMovies) {
    return (
      <div className="flex items-center justify-center py-12">
        <SpinnerIcon className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg my-4 text-sm">
        Error loading your reviews. Please try again later.
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-muted-foreground">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground mb-6">You haven&apos;t reviewed any movies yet.</p>
        <Button asChild>
          <Link href="/movies/popular">Explore Movies</Link>
        </Button>
      </div>
    );
  }

  // Limit the number of reviews to display if limit is provided
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;
  const hasMoreReviews = limit && reviews.length > limit;

  return (
    <div className="space-y-6">
      {!showViewAllLink && (
        <h2 className="text-xl font-bold mb-4">Your Reviews ({reviews.length})</h2>
      )}
      
      <div className="space-y-4">
        {displayedReviews.map((review) => {
          const movie = moviesData[review.movie_id];
          if (!movie) return null;
          
          return (
            <div key={review.id} className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-colors">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 lg:w-1/5">
                  <Link href={`/movies/${movie.id}`} className="block relative aspect-[2/3] w-full">
                    <Image
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/placeholder-poster.png'}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>
                <div className="p-4 md:p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <Link href={`/movies/${movie.id}`} className="text-xl font-bold hover:text-primary transition-colors">
                        {movie.title}
                      </Link>
                      <div className="text-sm text-muted-foreground mb-2">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown year'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={star <= review.rating ? "currentColor" : "none"}
                            stroke="currentColor"
                            className={`w-5 h-5 ${star <= review.rating ? "text-yellow-500" : "text-gray-300"}`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                        ))}
                      </div>
                      <span className="text-lg font-medium ml-2">{review.rating}/5</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-base text-foreground/90">{review.comment}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Reviewed on {format(new Date(review.created_at), 'MMM d, yyyy')}
                      {review.updated_at !== review.created_at && ' (edited)'}
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/movies/${movie.id}`}>
                          View Movie
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreReviews && showViewAllLink && (
        <div className="mt-6 text-center">
          <Button asChild>
            <Link href="/reviews" className="flex items-center justify-center gap-2 mx-auto">
              <span>View All Reviews ({reviews.length})</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
