"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProfileUrl } from "@/app/lib/tmdb";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Actor } from "@/app/types";

interface CastCarouselProps {
  title: string;
  cast: Actor[];
  viewAllHref?: string;
}

export const CastCarousel = ({
  title,
  cast,
  viewAllHref,
}: CastCarouselProps) => {
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

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4 px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{title}</h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-primary hover:underline ml-2"
            >
              View All
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
          {cast.map((person) => (
            <div
              key={person.id}
              className="flex-shrink-0 w-[140px] md:w-[150px] lg:w-[160px] transition-transform duration-300 hover:scale-105"
            >
              <Link href={`/actors/${person.id}`} className="block">
                <div className="aspect-[2/3] relative overflow-hidden rounded-md bg-neutral-800 mb-2">
                  <Image
                    src={getProfileUrl(person.profile_path, "medium")}
                    alt={person.name}
                    fill
                    sizes="(max-width: 768px) 140px, (max-width: 1200px) 150px, 160px"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium text-white truncate">
                  {person.name}
                </h3>
                <p className="text-xs text-neutral-400 truncate">
                  {person.character}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
