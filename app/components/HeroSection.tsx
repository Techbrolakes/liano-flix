'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Movie } from '@/app/lib/types';
import { getBackdropUrl } from '@/app/lib/tmdb';

interface HeroSectionProps {
  movie: Movie;
}

export const HeroSection = ({ movie }: HeroSectionProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Format date to show month and year
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  // Truncate overview if it's too long
  const truncatedOverview =
    movie.overview.length > 200
      ? `${movie.overview.substring(0, 200)}...`
      : movie.overview;

  return (
    <div className="relative w-full h-[75vh] max-h-[800px] overflow-hidden">
      {/* Backdrop image */}
      <div className="absolute inset-0 bg-neutral-900">
        <Image
          src={getBackdropUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          priority
          className={`object-cover object-center opacity-70 transition-opacity duration-700 ${
            isImageLoaded ? 'opacity-70' : 'opacity-0'
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-neutral-300 text-sm">{releaseDate}</span>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-amber-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-amber-400 font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-neutral-300 mb-6 max-w-xl hidden md:block">
            {truncatedOverview}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/movies/${movie.id}`}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 transition text-white font-medium rounded-md flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
              Watch Now
            </Link>
            <Link
              href={`/movies/${movie.id}`}
              className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 transition text-white font-medium rounded-md flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
