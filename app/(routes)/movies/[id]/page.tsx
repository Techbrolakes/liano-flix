"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MovieInfo } from "@/components/movies/MovieInfo";
import {
  MovieCastSkeleton,
  MovieInfoSkeleton,
  SimilarMoviesSkeleton,
} from "@/components/skeletons";
import { MovieCastSection, SimilarMoviesSection } from "@/components/movies";

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [movieId, setMovieId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMovieId = async () => {
      const id = parseInt((await params).id, 10);
      if (isNaN(id)) {
        router.push("/not-found");
        return;
      }
      setMovieId(id);
    };
    fetchMovieId();
  }, [params, router]);

  if (!movieId) {
    return (
      <div className="pb-10 pt-16">
        <MovieInfoSkeleton />
        <MovieCastSkeleton />
        <SimilarMoviesSkeleton />
      </div>
    );
  }

  return (
    <div className="pb-10 pt-16">
      <MovieInfo id={movieId} />
      <MovieCastSection id={movieId} />
      <SimilarMoviesSection id={movieId} />
    </div>
  );
}
