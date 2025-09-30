"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/app/types";
import { getBackdropUrl, getPosterUrl } from "@/app/lib/tmdb";
import { Info, Play } from "lucide-react";

interface HeroCarouselProps {
  movies: Movie[];
}

export const HeroCarousel = ({ movies }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  // Get the top 5 movies or fewer if not enough
  const carouselMovies = movies.slice(0, 5);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselMovies.length);

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition duration
  }, [carouselMovies.length, isTransitioning]);

  // goToPrev function removed as navigation arrows were removed

  // Autoplay functionality
  useEffect(() => {
    if (isAutoplayPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [goToNext, isAutoplayPaused]);

  // Pause autoplay when user interacts with carousel
  const pauseAutoplay = () => {
    setIsAutoplayPaused(true);

    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoplayPaused(false);
    }, 10000);
  };

  // Format date to show month and year
  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Different overview lengths for different screen sizes
  const getShortOverview = (overview: string) => {
    return overview.length > 80 ? `${overview.substring(0, 80)}...` : overview;
  };

  const getMediumOverview = (overview: string) => {
    return overview.length > 150
      ? `${overview.substring(0, 150)}...`
      : overview;
  };

  const getFullOverview = (overview: string) => {
    return overview.length > 240
      ? `${overview.substring(0, 240)}...`
      : overview;
  };

  if (carouselMovies.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] max-h-[800px] overflow-hidden">
      {/* Background image container */}
      <div className="absolute inset-0 bg-neutral-900">
        {/* Mobile: Poster image (hidden on larger screens) */}
        <div className="absolute inset-0 md:hidden">
          {carouselMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={getPosterUrl(movie.poster_path, "large")}
                alt={movie.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center opacity-80"
              />
              {/* Gradient overlays for mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>
          ))}
        </div>

        {/* Larger screens: Backdrop image (hidden on mobile) */}
        <div className="absolute inset-0 hidden md:block">
          {carouselMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={getBackdropUrl(movie.backdrop_path, "original")}
                alt={movie.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-[center_20%] opacity-70"
              />
              {/* Gradient overlays for larger screens */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows removed as requested */}

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {carouselMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              pauseAutoplay();
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute bottom-12 left-0 right-0 p-4 sm:p-6 md:p-10 lg:p-16 z-10">
        <div className="max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl mx-auto md:mx-0">
          {carouselMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`transition-all duration-500 ${
                index === currentIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute"
              }`}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 line-clamp-2 md:line-clamp-none">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 md:mb-4">
                <span className="text-neutral-300 text-xs sm:text-sm">
                  {formatReleaseDate(movie.release_date)}
                </span>
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-amber-400 text-xs sm:text-sm font-medium">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
              {/* Overview with responsive styling and better mobile presentation */}
              <div className="mb-4 sm:mb-6">
                {/* Mobile overview - shortest version with improved styling */}
                <div className="md:hidden">
                  <p className="text-neutral-300 text-sm leading-snug font-medium p-2 px-3 bg-black/30 backdrop-blur-sm rounded-md">
                    {getShortOverview(movie.overview)}
                  </p>
                </div>

                {/* Tablet overview */}
                <div className="hidden sm:block md:hidden">
                  <p className="text-neutral-300 text-sm leading-relaxed p-2 px-3 bg-black/20 backdrop-blur-sm rounded-md">
                    {getMediumOverview(movie.overview)}
                  </p>
                </div>

                {/* Desktop overview */}
                <div className="hidden md:block">
                  <p className="text-neutral-300 text-base max-w-xl">
                    {getFullOverview(movie.overview)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href={`/movies/${movie.id}`}
                  className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 transition text-white text-sm sm:text-base font-medium rounded-md flex items-center gap-1 sm:gap-2"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  Watch Now
                </Link>
                <Link
                  href={`/movies/${movie.id}`}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-neutral-700 hover:bg-neutral-600 transition text-white text-sm sm:text-base font-medium rounded-md flex items-center gap-1 sm:gap-2"
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                  More Info
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
