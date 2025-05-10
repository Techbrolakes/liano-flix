import { User } from "@/app/lib/types";

export interface Review {
  id: string;
  user_id: string;
  movie_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id: number;
  created_at: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}
