"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPosterUrl } from "@/app/lib/tmdb";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/app/types";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  viewAllHref?: string;
}

export const MovieCarousel = ({
  title,
  movies,
  viewAllHref,
}: MovieCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{title}</h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-full transition-all ml-2 flex items-center"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={scrollPrev}
            size="icon"
            variant="outline"
            className="rounded-full h-8 w-8"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={scrollNext}
            size="icon"
            variant="outline"
            className="rounded-full h-8 w-8"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pl-4 md:pl-6 lg:pl-8">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[160px] md:w-[150px] lg:w-[180px] transition-transform duration-300 hover:scale-105"
            >
              <Link href={`/movies/${movie.id}`} className="block">
                <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-2">
                  <Image
                    src={getPosterUrl(movie.poster_path, "medium")}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 160px, (max-width: 1200px) 180px, 200px"
                    className="object-cover"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
