"use client";

import Link from "next/link";
import { Movie } from "@/app/lib/types";
import { MoviePoster } from "@/components/ui/tmdb-image";

interface MovieCardProps {
  movie: Movie;
  size?: "small" | "medium" | "large";
}

export const MovieCard = ({ movie, size = "medium" }: MovieCardProps) => {
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
      <div className="overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
        <MoviePoster
          path={movie.poster_path}
          alt={movie.title}
          size={size === "large" ? "large" : "medium"}
          priority={false}
          className="w-full h-full"
          sizes={`(max-width: 768px) 150px, ${size === "large" ? "240px" : "180px"}`}
        />
      </div>
    </Link>
  );
};
