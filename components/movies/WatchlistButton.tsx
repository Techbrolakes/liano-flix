"use client";

import { useState } from "react";
import { useIsInWatchlist, useWatchlistMutations } from "@/app/supabase/hooks";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface WatchlistButtonProps {
  movieId: number;
}

export function WatchlistButton({ movieId }: WatchlistButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: isInWatchlist, isLoading } = useIsInWatchlist(movieId);
  const { addToWatchlist, removeFromWatchlist, isAddingToWatchlist, isRemovingFromWatchlist } = useWatchlistMutations(movieId);
  const [optimisticInWatchlist, setOptimisticInWatchlist] = useState<boolean | null>(null);

  const inWatchlist = optimisticInWatchlist !== null ? optimisticInWatchlist : isInWatchlist;
  const isProcessing = isLoading || isAddingToWatchlist || isRemovingFromWatchlist;

  const handleWatchlistClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (inWatchlist) {
      setOptimisticInWatchlist(false);
      removeFromWatchlist();
    } else {
      setOptimisticInWatchlist(true);
      addToWatchlist();
    }
  };

  if (!isAuthenticated) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleWatchlistClick}
              className="flex items-center gap-2"
            >
              <BookmarkIcon className="w-4 h-4" />
              <span>Add to Watchlist</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to add this movie to your watchlist</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={inWatchlist ? "default" : "outline"}
      size="sm"
      onClick={handleWatchlistClick}
      disabled={isProcessing}
      className="flex items-center gap-2"
    >
      {inWatchlist ? (
        <>
          <BookmarkFilledIcon className="w-4 h-4" />
          <span>In Watchlist</span>
        </>
      ) : (
        <>
          <BookmarkIcon className="w-4 h-4" />
          <span>Add to Watchlist</span>
        </>
      )}
    </Button>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
      />
    </svg>
  );
}

function BookmarkFilledIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
        clipRule="evenodd"
      />
    </svg>
  );
}
