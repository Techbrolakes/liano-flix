export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  homepage: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Cast {
  id: number;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number | null;
  name: string;
  order: number;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  credit_id: string;
  department: string;
  gender: number | null;
  job: string;
  name: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
}

export interface PersonDetails extends Person {
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string;
  place_of_birth: string | null;
}

export interface PersonMovieCredits {
  id: number;
  cast: MovieCast[];
  crew: MovieCrew[];
}

export interface MovieCast {
  id: number;
  character: string;
  credit_id: string;
  release_date: string;
  vote_count: number;
  video: boolean;
  adult: boolean;
  vote_average: number;
  title: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  backdrop_path: string | null;
  overview: string;
  poster_path: string | null;
}

export interface MovieCrew {
  id: number;
  department: string;
  original_language: string;
  original_title: string;
  job: string;
  overview: string;
  vote_count: number;
  video: boolean;
  poster_path: string | null;
  backdrop_path: string | null;
  title: string;
  popularity: number;
  genre_ids: number[];
  vote_average: number;
  adult: boolean;
  release_date: string;
  credit_id: string;
}

export interface APIResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}
