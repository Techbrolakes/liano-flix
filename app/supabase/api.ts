import { supabase } from "@/app/lib/supabase";
import { Review, ReviewFormData, WatchlistItem } from "./types";

// Watchlist API functions
export const getWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  try {
    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching watchlist:", error);
      // Return empty array instead of throwing for permission errors
      if (error.code === "PGRST301" || error.code === "403") {
        console.warn("Permission denied when fetching watchlist. User may not be authenticated.");
        return [];
      }
      throw new Error(error.message);
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error in getWatchlist:", err);
    return [];
  }
};

export const isMovieInWatchlist = async (
  userId: string,
  movieId: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .single();

    if (error) {
      // PGRST116 is the error code for "no rows returned"
      if (error.code === "PGRST116") {
        return false;
      }
      
      // Handle permission errors
      if (error.code === "PGRST301" || error.code === "403") {
        console.warn("Permission denied when checking watchlist. User may not be authenticated.");
        return false;
      }
      
      console.error("Error checking watchlist:", error);
      throw new Error(error.message);
    }

    return !!data;
  } catch (err) {
    console.error("Unexpected error in isMovieInWatchlist:", err);
    return false;
  }
};

export const addToWatchlist = async (
  userId: string,
  movieId: number
): Promise<WatchlistItem> => {
  try {
    const { data, error } = await supabase
      .from("watchlist")
      .insert([{ user_id: userId, movie_id: movieId }])
      .select()
      .single();

    if (error) {
      // Handle permission errors
      if (error.code === "PGRST301" || error.code === "403") {
        console.warn("Permission denied when adding to watchlist. User may not be authenticated.");
        throw new Error("You need to be logged in to add to watchlist");
      }
      
      // Handle duplicate entry errors
      if (error.code === "23505") {
        console.warn("Movie already in watchlist");
        throw new Error("This movie is already in your watchlist");
      }
      
      console.error("Error adding to watchlist:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in addToWatchlist:", err);
    throw err;
  }
};

export const removeFromWatchlist = async (
  userId: string,
  movieId: number
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", userId)
      .eq("movie_id", movieId);

    if (error) {
      // Handle permission errors
      if (error.code === "PGRST301" || error.code === "403") {
        console.warn("Permission denied when removing from watchlist. User may not be authenticated.");
        throw new Error("You need to be logged in to remove from watchlist");
      }
      
      console.error("Error removing from watchlist:", error);
      throw new Error(error.message);
    }
  } catch (err) {
    console.error("Unexpected error in removeFromWatchlist:", err);
    throw err;
  }
};

// Reviews API functions
export const getMovieReviews = async (movieId: number): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      // Return empty array instead of throwing for permission errors
      if (error.code === "PGRST301" || error.code === "403" || error.code === "406") {
        console.warn("Permission or Accept header issue when fetching reviews:", error);
        return [];
      }
      throw new Error(error.message || 'Unknown error fetching reviews');
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error in getMovieReviews:", err);
    // Handle errors thrown by PostgreSQL or network issues
    if (err instanceof Error) {
      console.warn("Error details:", err.message);
    }
    return [];
  }
};

// Get all reviews by a specific user
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, movie_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user reviews:", error);
      // Return empty array instead of throwing for permission errors
      if (error.code === "PGRST301" || error.code === "403" || error.code === "406") {
        console.warn("Permission or Accept header issue when fetching user reviews:", error);
        return [];
      }
      throw new Error(error.message || 'Unknown error fetching user reviews');
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error in getUserReviews:", err);
    if (err instanceof Error) {
      console.warn("Error details:", err.message);
    }
    return [];
  }
};

export const getUserReview = async (
  userId: string,
  movieId: number
): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .single();

    if (error) {
      // No rows returned is expected if user hasn't reviewed
      if (error.code === "PGRST116") {
        return null;
      }
      
      // Handle Accept header issues
      if (error.code === "406") {
        console.warn("Accept header issue when fetching user review:", error);
        return null;
      }
      
      // Handle permission errors
      if (error.code === "PGRST301" || error.code === "403") {
        console.warn("Permission denied when fetching user review. User may not be authenticated.");
        return null;
      }
      
      console.error("Error fetching user review:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getUserReview:", err);
    return null;
  }
};

export const createReview = async (
  userId: string,
  movieId: number,
  reviewData: ReviewFormData
): Promise<Review> => {
  try {
    console.log('Creating review for user:', userId, 'movie:', movieId);
    
    // First check if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session || !session.session) {
      console.warn('No active session found when creating review');
      throw new Error('You need to be logged in to submit a review');
    }
    
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          user_id: userId,
          movie_id: movieId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
      ])
      .select()
      .single();

    if (error) {
      // Handle permission errors
      if (error.code === "PGRST301" || error.code === "403") {
        console.warn("Permission denied when creating review:", error);
        console.log('RLS policy might be preventing insert. Check that user_id matches auth.uid()');
        throw new Error("Permission denied. Make sure you're logged in and trying to create your own review.");
      }
      
      // Handle duplicate entry errors
      if (error.code === "23505") {
        console.warn("User already reviewed this movie");
        throw new Error("You have already reviewed this movie");
      }
      
      // Handle Accept header issues
      if (error.code === "406") {
        console.warn("Accept header issue when creating review:", error);
        throw new Error("There was a problem with the request format. Please try again.");
      }
      
      console.error("Error creating review:", error);
      throw new Error(error.message || 'Unknown error creating review');
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in createReview:", err);
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error('Unknown error occurred while creating review');
    }
  }
};

export const updateReview = async (
  reviewId: string,
  reviewData: ReviewFormData
): Promise<Review> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        rating: reviewData.rating,
        comment: reviewData.comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .select()
      .single();

    if (error) {
      // Handle permission errors
      if (error.code === "PGRST301" || error.code === "403") {
        console.warn("Permission denied when updating review. User may not be authenticated or doesn't own this review.");
        throw new Error("You can only edit your own reviews");
      }
      
      console.error("Error updating review:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in updateReview:", err);
    throw err;
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

    if (error) {
      // Handle permission errors
      if (error.code === "PGRST301" || error.code === "403") {
        console.warn("Permission denied when deleting review. User may not be authenticated or doesn't own this review.");
        throw new Error("You can only delete your own reviews");
      }
      
      console.error("Error deleting review:", error);
      throw new Error(error.message);
    }
  } catch (err) {
    console.error("Unexpected error in deleteReview:", err);
    throw err;
  }
};
