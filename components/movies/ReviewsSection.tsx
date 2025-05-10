"use client";

import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";
import { useMovieReviews } from "@/app/supabase/hooks";

interface ReviewsSectionProps {
  movieId: number;
}

export function ReviewsSection({ movieId }: ReviewsSectionProps) {
  const { data: reviews } = useMovieReviews(movieId);
  
  return (
    <div className="bg-black/30 backdrop-blur-sm py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">
            Reviews & Ratings
            {reviews && reviews.length > 0 && (
              <span className="text-lg font-normal text-neutral-400 ml-3">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            )}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ReviewForm movieId={movieId} />
          </div>
          <div className="lg:col-span-2">
            <ReviewsList movieId={movieId} />
          </div>
        </div>
      </div>
    </div>
  );
}
