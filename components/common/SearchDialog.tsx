"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/app/store/uiStore";
import { useSearchMovies } from "@/app/hooks/useMovieQueries";
import { getPosterUrl } from "@/app/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Command } from "lucide-react";

export default function SearchDialog() {
  const router = useRouter();
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchOpen, 
    closeSearch 
  } = useUIStore();
  
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useSearchMovies(localQuery);
  const searchResults = data?.results.slice(0, 8) || [];

  // Focus input when dialog opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, closeSearch]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery)}`);
      closeSearch();
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div 
        ref={dialogRef}
        className="bg-card border rounded-xl shadow-lg w-full max-w-2xl mx-4 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center px-4 border-b">
            <Command className="w-5 h-5 text-muted-foreground mr-2" />
            <Input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLocalQuery(e.target.value);
              }}
              placeholder="Search movies, actors..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6 text-lg"
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => setLocalQuery("")}
                className="p-2 rounded-full hover:bg-accent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-muted-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
              {searchResults.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  onClick={() => closeSearch()}
                  className="flex flex-col group"
                >
                  <div className="aspect-[2/3] relative rounded-md overflow-hidden mb-2 bg-muted">
                    <Image
                      src={getPosterUrl(movie.poster_path, "medium")}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h4 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h4>
                  {movie.release_date && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : localQuery.length > 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">
                No results found for &quot;{localQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">
                Start typing to search for movies
              </p>
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="p-4 border-t">
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(localQuery)}`);
                closeSearch();
              }}
              className="w-full text-center py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              See all results
            </button>
          </div>
        )}

        <div className="p-3 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>
            <span>to close</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">↵</kbd>
            <span>to search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
