"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPosterUrl } from "@/app/lib/tmdb";
import { Movie } from "@/app/types";

interface MovieGridProps {
  movies: Movie[];
}

export const MovieGrid = ({ movies }: MovieGridProps) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => (
        <div key={movie.id} className="transition-transform duration-300 hover:scale-105">
          <Link href={`/movies/${movie.id}`} className="block">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
              {movie.poster_path ? (
                <Image
                  src={getPosterUrl(movie.poster_path, "medium")}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium line-clamp-1">{movie.title}</h3>
            {movie.release_date && (
              <p className="text-xs text-gray-400">
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
};
