"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Person } from "@/app/types";
import { peopleAPI } from "@/app/lib/api";
import Link from "next/link";
import Image from "next/image";
import { getProfileUrl } from "@/app/lib/tmdb";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface ActorCatalogueProps {
  initialActors: Person[];
  searchQuery?: string;
}

export function ActorCatalogue({
  initialActors,
  searchQuery = "",
}: ActorCatalogueProps) {
  const [actors, setActors] = useState<Person[]>(initialActors);
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || searchQuery;

  const fetchActors = async ({ pageParam = 1 }) => {
    if (query) {
      return peopleAPI.searchPeople(query, pageParam);
    } else {
      return peopleAPI.getPopular(pageParam);
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["actors", query ? "search" : "popular", query],
      queryFn: fetchActors,
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
      const newActors = data.pages.flatMap((page) => page.results);
      setActors([...initialActors, ...newActors]);
    }
  }, [data, initialActors]);

  // Reset actors when query changes
  useEffect(() => {
    if (query) {
      // If we have search results already in the initialActors, use those
      setActors(initialActors);
    }
  }, [query, initialActors]);

  return (
    <div>
      {actors.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {actors.map((actor) => (
            <Link key={actor.id} href={`/actors/${actor.id}`} className="group">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-sm border border-primary/5 bg-gradient-to-b from-card/50 to-card transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={getProfileUrl(actor.profile_path, "medium")}
                    alt={actor.name}
                    fill
                    sizes="(max-width: 768px) 160px, (max-width: 1200px) 180px, 200px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 hover:bg-primary/80 text-white inline-block">
                    View Profile
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-300">
                {actor.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {actor.known_for_department}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        !isLoading &&
        query && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No actors found matching &quot;{query}&quot;
            </p>
          </div>
        )
      )}

      {!isLoading && hasNextPage && (
        <div ref={ref} className="flex justify-center mt-10 mb-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 h-auto bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 text-white rounded-full border-none shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading more...
              </>
            ) : (
              <>
                Load more actors
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
