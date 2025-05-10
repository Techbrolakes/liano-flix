"use client";

import { useState } from "react";
import { useUserReview, useReviewMutations } from "@/app/supabase/hooks";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  movieId: number;
}

export function ReviewForm({ movieId }: ReviewFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: userReview, isLoading } = useUserReview(movieId);
  const { createReview, updateReview, deleteReview, isCreatingReview, isUpdatingReview, isDeletingReview } = useReviewMutations(movieId);

  const [rating, setRating] = useState<number>(userReview?.rating || 0);
  const [comment, setComment] = useState<string>(userReview?.comment || "");
  const [isEditing, setIsEditing] = useState<boolean>(!userReview);

  // Update form when user review data is loaded
  if (userReview && !isLoading && rating !== userReview.rating && !isEditing) {
    setRating(userReview.rating);
    setComment(userReview.comment);
  }

  const isProcessing = isCreatingReview || isUpdatingReview || isDeletingReview;
  const hasReview = !!userReview;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (rating === 0) {
      return; // Don't submit if no rating
    }

    if (hasReview) {
      updateReview({
        reviewId: userReview.id,
        reviewData: { rating, comment }
      });
    } else {
      createReview({ rating, comment });
    }

    if (isEditing && hasReview) {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (hasReview) {
      deleteReview(userReview.id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-neutral-900/60 p-6 rounded-lg mb-6 border border-neutral-800 backdrop-blur-sm">
        <h3 className="text-xl font-medium mb-3 text-white">Write a Review</h3>
        <p className="text-neutral-300 mb-5">
          Sign in to share your thoughts and rating for this movie.
        </p>
        <Button 
          onClick={() => router.push("/auth/login")} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-5 py-2 rounded-md transition-all duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Sign In
        </Button>
      </div>
    );
  }

  if (hasReview && !isEditing) {
    return (
      <div className="bg-gradient-to-b from-neutral-800/80 to-neutral-900/80 p-6 rounded-lg mb-6 border border-neutral-700 backdrop-blur-sm shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-medium text-white mb-1">Your Review</h3>
            <div className="text-sm text-neutral-400">
              {new Date(userReview?.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {userReview?.updated_at !== userReview?.created_at && ' (edited)'}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              disabled={isProcessing}
              className="hover:bg-neutral-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              disabled={isProcessing}
              className="hover:bg-red-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Delete
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={rating} onChange={() => {}} readOnly size="lg" />
            <span className="text-xl font-bold text-yellow-500 ml-2">{rating}/5</span>
          </div>
          <div className="h-1 w-full bg-neutral-700 rounded-full mb-4">
            <div 
              className="h-1 bg-yellow-500 rounded-full" 
              style={{ width: `${(rating / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
          <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed">{comment}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-b from-neutral-800/80 to-neutral-900/80 p-6 rounded-lg mb-6 border border-neutral-700 backdrop-blur-sm shadow-lg">
      <h3 className="text-xl font-medium mb-4 text-white">
        {hasReview ? "Edit Your Review" : "Write a Review"}
      </h3>
      <div className="mb-5">
        <label className="block text-sm font-medium text-neutral-300 mb-2">Your Rating</label>
        <div className="flex items-center">
          <StarRating rating={rating} onChange={setRating} size="lg" />
          <span className="ml-3 text-lg font-semibold text-yellow-500">
            {rating > 0 ? `${rating}/5` : "Select rating"}
          </span>
        </div>
        {rating > 0 && (
          <div className="mt-2">
            <div className="h-1 w-full bg-neutral-700 rounded-full">
              <div 
                className="h-1 bg-yellow-500 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${(rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-5">
        <label className="block text-sm font-medium text-neutral-300 mb-2">Your Comment</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          className="bg-neutral-800 border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 min-h-[120px] text-neutral-200"
          rows={5}
        />
      </div>
      <div className="flex gap-3 mt-6">
        <Button 
          type="submit" 
          disabled={rating === 0 || isProcessing}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-5 py-2 rounded-md transition-all duration-200 flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              {hasReview ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Update Review
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Submit Review
                </>
              )}
            </>
          )}
        </Button>
        {hasReview && isEditing && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setRating(userReview.rating);
              setComment(userReview.comment);
              setIsEditing(false);
            }}
            disabled={isProcessing}
            className="border-neutral-600 hover:bg-neutral-800 transition-colors duration-200"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
