import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "@/app/lib/api";

export const usePopularMovies = (page = 1) => {
  return useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => moviesAPI.getPopular(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrendingMovies = (
  timeWindow: "day" | "week" = "week",
  page = 1
) => {
  return useQuery({
    queryKey: ["movies", "trending", timeWindow, page],
    queryFn: () => moviesAPI.getTrending(timeWindow, page),
    staleTime: timeWindow === "day" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 1 hour for daily, 24 hours for weekly
  });
};

export const useNowPlayingMovies = (page = 1) => {
  return useQuery({
    queryKey: ["movies", "nowPlaying", page],
    queryFn: () => moviesAPI.getNowPlaying(page),
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });
};

export const useTopRatedMovies = (page = 1) => {
  return useQuery({
    queryKey: ["movies", "topRated", page],
    queryFn: () => moviesAPI.getTopRated(page),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useUpcomingMovies = (page = 1) => {
  return useQuery({
    queryKey: ["movies", "upcoming", page],
    queryFn: () => moviesAPI.getUpcoming(page),
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => moviesAPI.getMovieDetails(movieId),
    enabled: !!movieId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useMovieCredits = (movieId: number) => {
  return useQuery({
    queryKey: ["movie", movieId, "credits"],
    queryFn: () => moviesAPI.getMovieCredits(movieId),
    enabled: !!movieId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useSimilarMovies = (movieId: number, page = 1) => {
  return useQuery({
    queryKey: ["movie", movieId, "similar", page],
    queryFn: () => moviesAPI.getSimilarMovies(movieId, page),
    enabled: !!movieId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useRecommendedMovies = (movieId: number, page = 1) => {
  return useQuery({
    queryKey: ["movie", movieId, "recommended", page],
    queryFn: () => moviesAPI.getRecommendedMovies(movieId, page),
    enabled: !!movieId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useMoviesByGenre = (genreId: number, page = 1) => {
  return useQuery({
    queryKey: ["movies", "genre", genreId, page],
    queryFn: () => moviesAPI.getMoviesByGenre(genreId, page),
    enabled: !!genreId,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
};

export const useSearchMovies = (query: string, page = 1) => {
  return useQuery({
    queryKey: ["movies", "search", query, page],
    queryFn: () => moviesAPI.searchMovies(query, page),
    enabled: !!query && query.length > 2,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
