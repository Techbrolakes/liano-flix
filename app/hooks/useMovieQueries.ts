import { useQuery } from '@tanstack/react-query';
import { moviesAPI } from '@/app/lib/api';
import { Movie, MovieDetails, MovieCredits } from '@/app/types';
import { APIResponse } from '@/app/types';

// Hook for fetching trending movies
export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week', page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['trendingMovies', timeWindow, page],
    queryFn: () => moviesAPI.getTrending(timeWindow, page),
  });
}

// Hook for fetching popular movies
export function usePopularMovies(page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['popularMovies', page],
    queryFn: () => moviesAPI.getPopular(page),
  });
}

// Hook for fetching now playing movies
export function useNowPlayingMovies(page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['nowPlayingMovies', page],
    queryFn: () => moviesAPI.getNowPlaying(page),
  });
}

// Hook for fetching top rated movies
export function useTopRatedMovies(page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['topRatedMovies', page],
    queryFn: () => moviesAPI.getTopRated(page),
  });
}

// Hook for fetching upcoming movies
export function useUpcomingMovies(page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['upcomingMovies', page],
    queryFn: () => moviesAPI.getUpcoming(page),
  });
}

// Hook for fetching movie details
export function useMovieDetails(movieId: number) {
  return useQuery<MovieDetails>({
    queryKey: ['movieDetails', movieId],
    queryFn: () => moviesAPI.getMovieDetails(movieId),
    enabled: !!movieId && !isNaN(movieId),
  });
}

// Hook for fetching movie credits
export function useMovieCredits(movieId: number) {
  return useQuery<MovieCredits>({
    queryKey: ['movieCredits', movieId],
    queryFn: () => moviesAPI.getMovieCredits(movieId),
    enabled: !!movieId && !isNaN(movieId),
  });
}

// Hook for fetching similar movies
export function useSimilarMovies(movieId: number, page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['similarMovies', movieId, page],
    queryFn: () => moviesAPI.getSimilarMovies(movieId, page),
    enabled: !!movieId && !isNaN(movieId),
  });
}

// Hook for fetching recommended movies
export function useRecommendedMovies(movieId: number, page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['recommendedMovies', movieId, page],
    queryFn: () => moviesAPI.getRecommendedMovies(movieId, page),
    enabled: !!movieId && !isNaN(movieId),
  });
}

// Hook for searching movies
export function useSearchMovies(query: string, page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['searchMovies', query, page],
    queryFn: () => moviesAPI.searchMovies(query, page),
    enabled: !!query, // Only run the query if there's a search term
  });
}

// Hook for fetching movies by genre
export function useMoviesByGenre(genreId: number, page = 1) {
  return useQuery<APIResponse<Movie>>({
    queryKey: ['moviesByGenre', genreId, page],
    queryFn: () => moviesAPI.getMoviesByGenre(genreId, page),
    enabled: !!genreId && !isNaN(genreId),
  });
}

// Hook for fetching all genres
export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => moviesAPI.getGenres(),
  });
}
