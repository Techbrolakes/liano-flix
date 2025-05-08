import { 
  TMDB_API_KEY, 
  TMDB_BASE_URL 
} from './tmdb';
import { 
  APIResponse, 
  Movie, 
  MovieCredits, 
  MovieDetails, 
  Person, 
  PersonDetails, 
  PersonMovieCredits,
  Genre
} from '../types';

// Helper function to build URLs with API key
const buildUrl = (endpoint: string, queryParams: Record<string, string> = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
};

// Generic fetch function
async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}

// Movies API
export const moviesAPI = {
  // Get trending movies
  getTrending: (timeWindow: 'day' | 'week' = 'week', page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl(`/trending/movie/${timeWindow}`, { page: page.toString() })
    ),
  
  // Get popular movies
  getPopular: (page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl('/movie/popular', { page: page.toString() })
    ),
    
  // Get now playing movies
  getNowPlaying: (page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl('/movie/now_playing', { page: page.toString() })
    ),
    
  // Get top rated movies
  getTopRated: (page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl('/movie/top_rated', { page: page.toString() })
    ),
    
  // Get upcoming movies
  getUpcoming: (page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl('/movie/upcoming', { page: page.toString() })
    ),
    
  // Get movie details
  getMovieDetails: (movieId: number) => 
    fetcher<MovieDetails>(
      buildUrl(`/movie/${movieId}`)
    ),
    
  // Get movie credits
  getMovieCredits: (movieId: number) => 
    fetcher<MovieCredits>(
      buildUrl(`/movie/${movieId}/credits`)
    ),
    
  // Get similar movies
  getSimilarMovies: (movieId: number, page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl(`/movie/${movieId}/similar`, { page: page.toString() })
    ),
    
  // Get recommended movies
  getRecommendedMovies: (movieId: number, page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl(`/movie/${movieId}/recommendations`, { page: page.toString() })
    ),
    
  // Search movies
  searchMovies: (query: string, page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl('/search/movie', { query, page: page.toString() })
    ),
    
    // Get movies by genre
  getMoviesByGenre: (genreId: number, page = 1) => 
    fetcher<APIResponse<Movie>>(
      buildUrl('/discover/movie', { with_genres: genreId.toString(), page: page.toString() })
    ),
    
  // Get all genres
  getGenres: () => 
    fetcher<{genres: Genre[]}>(
      buildUrl('/genre/movie/list')
    ),
};

// People (Actors) API
export const peopleAPI = {
  // Get popular people
  getPopular: (page = 1) => 
    fetcher<APIResponse<Person>>(
      buildUrl('/person/popular', { page: page.toString() })
    ),
    
  // Get person details
  getPersonDetails: (personId: number) => 
    fetcher<PersonDetails>(
      buildUrl(`/person/${personId}`)
    ),
    
  // Get person movie credits
  getPersonMovieCredits: (personId: number) => 
    fetcher<PersonMovieCredits>(
      buildUrl(`/person/${personId}/movie_credits`)
    ),
    
  // Search people
  searchPeople: (query: string, page = 1) => 
    fetcher<APIResponse<Person>>(
      buildUrl('/search/person', { query, page: page.toString() })
    ),
};

// Genres API
export const genresAPI = {
  // Get movie genres
  getMovieGenres: () => 
    fetcher<{ genres: { id: number; name: string }[] }>(
      buildUrl('/genre/movie/list')
    ),
};
