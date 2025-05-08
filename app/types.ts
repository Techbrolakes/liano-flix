export interface APIResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  video: boolean;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
}

export interface Actor extends Person {
  character?: string;
}

export interface PersonDetails extends Person {
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  also_known_as: string[];
  homepage: string | null;
  gender: number;
}

export interface PersonMovieCredits {
  cast: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    character: string;
  }[];
  crew: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    job: string;
    department: string;
  }[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieCredits {
  id: number;
  cast: Actor[];
  crew: {
    id: number;
    name: string;
    profile_path: string;
    job: string;
    department: string;
  }[];
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: Actor[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
    }[];
  };
}

export interface SearchResults {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
