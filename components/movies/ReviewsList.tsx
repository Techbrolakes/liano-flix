"use client";

import { useMovieReviews } from "@/app/supabase/hooks";
import { StarRating } from "./StarRating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ReviewsListProps {
  movieId: number;
}

export function ReviewsList({ movieId }: ReviewsListProps) {
  const { data: reviews, isLoading, error } = useMovieReviews(movieId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-neutral-900/60 p-6 rounded-lg animate-pulse border border-neutral-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-neutral-800" />
              <div className="flex-1">
                <div className="h-5 bg-neutral-800 rounded w-1/4 mb-2" />
                <div className="h-4 bg-neutral-800 rounded w-1/5" />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-6 h-6 rounded-full bg-neutral-800"
                  />
                ))}
                <div className="w-10 h-6 bg-neutral-800 rounded ml-2" />
              </div>
              <div className="h-2 bg-neutral-800 rounded-full w-1/3 mt-2" />
            </div>
            <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
              <div className="h-4 bg-neutral-800 rounded w-full mb-3" />
              <div className="h-4 bg-neutral-800 rounded w-4/5 mb-3" />
              <div className="h-4 bg-neutral-800 rounded w-3/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 p-5 rounded-lg">
        <div className="flex items-center gap-3 text-purple-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="font-medium">
            Error loading reviews. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-neutral-900/60 p-6 rounded-lg border border-neutral-800 text-center">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-neutral-800/50 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h4 className="text-lg font-medium text-white mb-2">No Reviews Yet</h4>
        <p className="text-neutral-400 max-w-md mx-auto">
          Be the first to share your thoughts about this movie!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-white mb-2">
        {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
      </h3>
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-gradient-to-b from-neutral-800/60 to-neutral-900/60 p-6 rounded-lg border border-neutral-700 backdrop-blur-sm shadow-md"
        >
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-12 w-12 border-2 border-neutral-700 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-lg font-medium">
                {review.user_id.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-white text-lg">
                User {review.user_id.substring(0, 6)}
              </div>
              <div className="text-sm text-neutral-400 flex items-center gap-1 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                })}
                {review.updated_at !== review.created_at && (
                  <span className="inline-flex items-center ml-2 text-xs bg-neutral-800 px-2 py-0.5 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    edited
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <StarRating
                rating={review.rating}
                onChange={() => {}}
                readOnly
                size="md"
              />
              <span className="text-lg font-bold text-yellow-500 ml-1">
                {review.rating}/5
              </span>
            </div>
            <div className="h-1 w-full bg-neutral-700 rounded-full mb-4">
              <div
                className="h-1 bg-yellow-500 rounded-full"
                style={{ width: `${(review.rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-neutral-800/40 p-4 rounded-lg border border-neutral-700">
            <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
