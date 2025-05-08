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
  searchQuery = ""
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
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
            <Link
              key={actor.id}
              href={`/actors/${actor.id}`}
              className="transition-transform duration-300 hover:scale-105"
            >
              <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-2">
                <Image
                  src={getProfileUrl(actor.profile_path, "medium")}
                  alt={actor.name}
                  fill
                  sizes="(max-width: 768px) 160px, (max-width: 1200px) 180px, 200px"
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-medium truncate">{actor.name}</h3>
              <p className="text-xs text-muted-foreground">
                {actor.known_for_department}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        !isLoading && query && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No actors found matching &quot;{query}&quot;</p>
          </div>
        )
      )}

      {!isLoading && hasNextPage && (
        <div
          ref={ref}
          className="flex justify-center mt-8 mb-4"
        >
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more actors"}
          </Button>
        </div>
      )}
    </div>
  );
}
