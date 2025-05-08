"use client";

import { Movie } from "../types";
import { MovieCarousel } from "./MovieCarousel";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllHref?: string;
  loading?: boolean;
  error?: boolean;
}

export const MovieRow = ({
  title,
  movies,
  viewAllHref,
  loading = false,
  error = false,
}: MovieRowProps) => {
  if (error) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-medium text-white mb-4">{title}</h2>
        <div className="p-4 bg-neutral-800/50 rounded-md">
          <p className="text-neutral-400 text-center">Failed to load movies</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-medium text-white mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-full aspect-[2/3] rounded-md bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <MovieCarousel title={title} movies={movies} viewAllHref={viewAllHref} />
  );
};
