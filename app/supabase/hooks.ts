import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/authStore";
import {
  getWatchlist,
  isMovieInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getMovieReviews,
  getUserReview,
  createReview,
  updateReview,
  deleteReview,
} from "./api";
import { ReviewFormData } from "./types";

// Watchlist hooks
export const useWatchlist = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: () => (user ? getWatchlist(user.id) : Promise.resolve([])),
    enabled: !!user,
  });
};

export const useIsInWatchlist = (movieId: number) => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ["watchlist", user?.id, movieId],
    queryFn: () => (user ? isMovieInWatchlist(user.id, movieId) : Promise.resolve(false)),
    enabled: !!user,
  });
};

export const useWatchlistMutations = (movieId: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const addMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error("User not authenticated");
      return addToWatchlist(user.id, movieId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
  
  const removeMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error("User not authenticated");
      return removeFromWatchlist(user.id, movieId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
  
  return {
    addToWatchlist: addMutation.mutate,
    removeFromWatchlist: removeMutation.mutate,
    isAddingToWatchlist: addMutation.isPending,
    isRemovingFromWatchlist: removeMutation.isPending,
  };
};

// Reviews hooks
export const useMovieReviews = (movieId: number) => {
  return useQuery({
    queryKey: ["reviews", movieId],
    queryFn: () => getMovieReviews(movieId),
  });
};

export const useUserReview = (movieId: number) => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ["userReview", user?.id, movieId],
    queryFn: () => (user ? getUserReview(user.id, movieId) : Promise.resolve(null)),
    enabled: !!user,
  });
};

export const useReviewMutations = (movieId: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const createMutation = useMutation({
    mutationFn: (reviewData: ReviewFormData) => {
      if (!user) throw new Error("User not authenticated");
      return createReview(user.id, movieId, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReview"] });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ reviewId, reviewData }: { reviewId: string; reviewData: ReviewFormData }) => {
      return updateReview(reviewId, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReview"] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => {
      return deleteReview(reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReview"] });
    },
  });
  
  return {
    createReview: createMutation.mutate,
    updateReview: updateMutation.mutate,
    deleteReview: deleteMutation.mutate,
    isCreatingReview: createMutation.isPending,
    isUpdatingReview: updateMutation.isPending,
    isDeletingReview: deleteMutation.isPending,
  };
};
