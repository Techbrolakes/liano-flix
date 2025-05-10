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
      <div className="text-center py-16 bg-gradient-to-br from-card/50 to-card rounded-xl border border-border shadow-sm">
        <div className="mb-6 bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-3">No Reviews Yet</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">You haven&apos;t reviewed any movies yet. Start exploring movies and share your thoughts!</p>
        <Button asChild size="lg" className="px-8">
          <Link href="/movies/popular">Explore Movies</Link>
        </Button>
      </div>
    );
  }

  // Limit the number of reviews to display if limit is provided
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;
  const hasMoreReviews = limit && reviews.length > limit;

  return (
    <div className="space-y-8">
      {!showViewAllLink && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Reviews ({reviews.length})</h2>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} total
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {displayedReviews.map((review) => {
          const movie = moviesData[review.movie_id];
          if (!movie) return null;
          
          return (
            <div key={review.id} className="bg-gradient-to-br from-card/50 to-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 group">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 lg:w-1/5 relative">
                  <Link href={`/movies/${movie.id}`} className="block relative aspect-[2/3] w-full">
                    <Image
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/placeholder-poster.png'}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/movies/${movie.id}`} className="text-white hover:text-primary transition-colors text-sm font-medium">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <Link href={`/movies/${movie.id}`} className="text-xl font-bold hover:text-primary transition-colors">
                        {movie.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 mb-3">
                        <span className="text-sm bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown year'}
                        </span>
                        {movie.vote_average && (
                          <span className="text-sm bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                            {movie.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg">
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
                      <span className="text-lg font-medium ml-2 text-primary">{review.rating}/5</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-muted/50 p-4 rounded-lg border border-border/50 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 absolute -top-3 -left-2 text-primary/20 transform -rotate-6">
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                    </svg>
                    <p className="text-base text-foreground/90 italic">{review.comment}</p>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-border flex justify-between items-center">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                      {review.updated_at !== review.created_at && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">edited</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-full">
                        <Link href={`/movies/${movie.id}`} className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-2.625-2.625c0 .621-.504 1.125-1.125 1.125h-1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h1.5m-1.5-3.75C12 8.754 12.504 8.25 13.125 8.25h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C15.496 8.25 16 7.746 16 7.125v-1.5m0 0h-1.5M16 7.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5m1.5-3.75C15.496 5.004 16 4.5 16.625 4.5h1.5m0 0h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                          </svg>
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
        <div className="mt-8 text-center">
          <Button asChild variant="default" size="lg" className="gap-2 px-8">
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
