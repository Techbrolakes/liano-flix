"use client";

import { Suspense } from "react";
import { MovieInfoSkeleton } from "@/components/skeletons";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchMovies } from "@/app/hooks/useMovies";
import { useSearchPeople } from "@/app/hooks/usePeople";
import Link from "next/link";
import Image from "next/image";
import { getProfileUrl } from "@/app/lib/tmdb";
import { MovieCard } from "@/components/movies/MovieCard";

export default function SearchPage() {
  return (
    <Suspense fallback={<MovieInfoSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState<"movies" | "people">("movies");

  const {
    data: moviesData,
    isLoading: isLoadingMovies,
    error: moviesError,
  } = useSearchMovies(query);

  const {
    data: peopleData,
    isLoading: isLoadingPeople,
    error: peopleError,
  } = useSearchPeople(query);

  const movies = moviesData?.results || [];
  const people = peopleData?.results || [];

  useEffect(() => {
    document.title = `Search: ${query} - LianoFlix`;
  }, [query]);

  if (!query) {
    return (
      <Suspense fallback={<MovieInfoSkeleton />}>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-white mb-4">
              Search LianoFlix
            </h1>
            <p className="text-neutral-400">
              Enter a search term to find movies and actors.
            </p>
          </div>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<MovieInfoSkeleton />}>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-white mb-6">
          Search results for:{" "}
          <span className="text-red-600">&quot;{query}&quot;</span>
        </h1>

        {/* Tabs */}
        <div className="border-b border-neutral-800 mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("movies")}
              className={`py-2 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === "movies"
                  ? "border-red-600 text-white"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              Movies {movies.length > 0 && `(${movies.length})`}
            </button>
            <button
              onClick={() => setActiveTab("people")}
              className={`py-2 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === "people"
                  ? "border-red-600 text-white"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              People {people.length > 0 && `(${people.length})`}
            </button>
          </div>
        </div>

        {/* Results */}
        {activeTab === "movies" && (
          <div>
            {isLoadingMovies ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[2/3] bg-neutral-800 rounded-md animate-pulse"
                  />
                ))}
              </div>
            ) : moviesError ? (
              <div className="text-center py-12">
                <p className="text-neutral-400">
                  An error occurred while searching for movies.
                </p>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-400">
                  No movies found matching &quot;{query}&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "people" && (
          <div>
            {isLoadingPeople ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-neutral-800 rounded-md animate-pulse"
                  />
                ))}
              </div>
            ) : peopleError ? (
              <div className="text-center py-12">
                <p className="text-neutral-400">
                  An error occurred while searching for people.
                </p>
              </div>
            ) : people.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-400">
                  No people found matching &quot;{query}&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {people.map((person) => (
                  <Link
                    key={person.id}
                    href={`/actors/${person.id}`}
                    className="group"
                  >
                    <div className="aspect-square relative overflow-hidden rounded-md bg-neutral-800 mb-3">
                      <Image
                        src={getProfileUrl(person.profile_path, "medium")}
                        alt={person.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-white group-hover:text-red-500 transition line-clamp-1">
                      {person.name}
                    </h3>
                    {person.known_for_department && (
                      <p className="text-xs text-neutral-400">
                        {person.known_for_department}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
}
