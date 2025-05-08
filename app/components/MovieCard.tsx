'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Movie } from '@/app/lib/types';
import { getPosterUrl } from '@/app/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

export const MovieCard = ({ movie, size = 'medium' }: MovieCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const getCardSize = () => {
    switch (size) {
      case 'small':
        return 'w-[150px]';
      case 'large':
        return 'w-[240px]';
      case 'medium':
      default:
        return 'w-[180px]';
    }
  };
  
  // Get year from release date
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  
  // Format vote average to one decimal place
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  
  return (
    <Link 
      href={`/movies/${movie.id}`}
      className={`${getCardSize()} flex flex-col group`}
    >
      <div className="relative overflow-hidden rounded-md aspect-[2/3] bg-neutral-800 transition-transform duration-300 group-hover:scale-105">
        <Image
          src={getPosterUrl(movie.poster_path, size === 'large' ? 'large' : 'medium')}
          alt={movie.title}
          fill
          sizes={`(max-width: 768px) 150px, ${size === 'large' ? '240px' : '180px'}`}
          className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-neutral-600 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">{releaseYear}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-3 h-3"
              >
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span>{rating}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
      </div>
    </Link>
  );
};
