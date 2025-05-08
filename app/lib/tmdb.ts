export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'ae5b499166e31fb991742cee179dca6a';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original'
};

export const BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original'
};

export const PROFILE_SIZES = {
  small: 'w45',
  medium: 'w185',
  large: 'h632',
  original: 'original'
};

// Helper functions to generate image URLs
export const getImageUrl = (
  path: string | null,
  size: string = POSTER_SIZES.medium
): string => {
  if (!path) return '/images/placeholder.png';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (
  path: string | null,
  size: keyof typeof POSTER_SIZES = 'medium'
): string => {
  if (!path) return '/images/poster-placeholder.png';
  return `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZES[size]}${path}`;
};

export const getBackdropUrl = (
  path: string | null,
  size: keyof typeof BACKDROP_SIZES = 'large'
): string => {
  if (!path) return '/images/backdrop-placeholder.png';
  return `${TMDB_IMAGE_BASE_URL}/${BACKDROP_SIZES[size]}${path}`;
};

export const getProfileUrl = (
  path: string | null,
  size: keyof typeof PROFILE_SIZES = 'medium'
): string => {
  if (!path) return '/images/profile-placeholder.png';
  return `${TMDB_IMAGE_BASE_URL}/${PROFILE_SIZES[size]}${path}`;
};
