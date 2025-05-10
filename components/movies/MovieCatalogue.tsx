"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Movie } from "@/app/types";
import { moviesAPI } from "@/app/lib/api";
import Link from "next/link";
import Image from "next/image";
import { getPosterUrl } from "@/app/lib/tmdb";
import { Button } from "@/components/ui/button";

interface MovieCatalogueProps {
  initialMovies: Movie[];
  fetchType: "popular" | "trending" | "top-rated" | "upcoming" | "genre";
  genreId?: number;
  totalPages?: number; // Made optional since we don't use it directly
}

export function MovieCatalogue({
  initialMovies,
  fetchType,
  genreId,
}: MovieCatalogueProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const { ref, inView } = useInView();

  // Setup the correct API call based on fetchType
  const fetchMovies = async ({ pageParam = 1 }) => {
    switch (fetchType) {
      case "popular":
        return moviesAPI.getPopular(pageParam);
      case "trending":
        return moviesAPI.getTrending("week", pageParam);
      case "top-rated":
        return moviesAPI.getTopRated(pageParam);
      case "upcoming":
        return moviesAPI.getUpcoming(pageParam);
      case "genre":
        if (!genreId) throw new Error("Genre ID is required for genre fetching");
        return moviesAPI.getMoviesByGenre(genreId, pageParam);
      default:
        return moviesAPI.getPopular(pageParam);
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["movies", fetchType, genreId],
    queryFn: fetchMovies,
    initialPageParam: 2, // Start from page 2 since we already have page 1
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (data) {
      const newMovies = data.pages.flatMap((page) => page.results);
      setMovies([...initialMovies, ...newMovies]);
    }
  }, [data, initialMovies]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="transition-transform duration-300 hover:scale-105"
          >
            <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-2">
              <Image
                src={getPosterUrl(movie.poster_path, "medium")}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 160px, (max-width: 1200px) 180px, 200px"
                className="object-cover"
              />
            </div>
            <h3 className="text-sm font-medium truncate">{movie.title}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(movie.release_date).getFullYear() || "N/A"}
            </p>
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div
          ref={ref}
          className="flex justify-center mt-8 mb-4"
        >
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more movies"}
          </Button>
        </div>
      )}
    </div>
  );
}
