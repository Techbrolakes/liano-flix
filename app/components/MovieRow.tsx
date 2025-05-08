'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Movie } from '@/app/lib/types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllHref?: string;
  loading?: boolean;
  error?: boolean;
}

export const MovieRow = ({ title, movies, viewAllHref, loading = false, error = false }: MovieRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-medium text-white mb-4">{title}</h2>
        <div className="p-4 bg-neutral-800/50 rounded-md">
          <p className="text-neutral-400 text-center">Failed to load movies</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-white">{title}</h2>
        {viewAllHref && (
          <Link 
            href={viewAllHref}
            className="text-sm font-medium text-neutral-400 hover:text-white transition"
          >
            View All
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index} 
              className="w-full aspect-[2/3] rounded-md bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div 
            className="relative overflow-hidden"
            onMouseEnter={() => scrollContainerRef.current?.classList.add('scrollbar-visible')}
            onMouseLeave={() => scrollContainerRef.current?.classList.remove('scrollbar-visible')}
          >
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {/* Scroll buttons - only show on larger screens and when hovering */}
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 p-2 rounded-full hidden lg:group-hover:block disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={movies.length <= 5}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 p-2 rounded-full hidden lg:group-hover:block disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={movies.length <= 5}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
