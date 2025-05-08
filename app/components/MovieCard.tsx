"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Movie } from "@/app/lib/types";
import { getPosterUrl } from "@/app/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  size?: "small" | "medium" | "large";
}

export const MovieCard = ({ movie, size = "medium" }: MovieCardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const getCardSize = () => {
    switch (size) {
      case "small":
        return "w-[150px]";
      case "large":
        return "w-[240px]";
      case "medium":
      default:
        return "w-[180px]";
    }
  };

  return (
    <Link
      href={`/movies/${movie.id}`}
      className={`${getCardSize()} flex flex-col group`}
    >
      <div className="relative overflow-hidden rounded-md aspect-[2/3] bg-neutral-800 transition-transform duration-300 group-hover:scale-105">
        <Image
          src={getPosterUrl(
            movie.poster_path,
            size === "large" ? "large" : "medium"
          )}
          alt={movie.title}
          fill
          sizes={`(max-width: 768px) 150px, ${
            size === "large" ? "240px" : "180px"
          }`}
          className={`object-cover ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-neutral-600 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </Link>
  );
};
