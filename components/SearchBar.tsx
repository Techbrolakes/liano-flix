"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/app/store/uiStore";
import { useSearchMovies } from "@/app/hooks/useMovies";
import { getPosterUrl } from "@/app/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useUIStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useSearchMovies(localQuery);
  const searchResults = data?.results.slice(0, 5) || [];

  // Handle outside click to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="text"
            value={localQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLocalQuery(e.target.value);
              setShowResults(!!e.target.value);
            }}
            onFocus={() => setShowResults(!!localQuery)}
            placeholder="Search movies, actors..."
            className="pl-9"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </form>

      {showResults && localQuery.length > 2 && (
        <div className="absolute z-50 mt-2 w-full bg-card rounded-md shadow-lg overflow-hidden border ">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-muted">
                {searchResults.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 p-3 hover:bg-muted transition"
                  >
                    <div className="h-16 w-12 flex-shrink-0 relative overflow-hidden rounded-sm">
                      <Image
                        src={getPosterUrl(movie.poster_path, "small")}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground text-sm font-medium truncate">
                        {movie.title}
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {new Date(movie.release_date).getFullYear() || "N/A"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-3 border-t ">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(localQuery)}`);
                    setShowResults(false);
                  }}
                  className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium"
                >
                  See all results
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for &quot;{localQuery}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
