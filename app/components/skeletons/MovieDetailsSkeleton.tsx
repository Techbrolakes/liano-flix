'use client';

import React from 'react';

export const MovieInfoSkeleton = () => {
  return (
    <div className="w-full min-h-[50vh] bg-neutral-900/50 animate-pulse p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie poster skeleton */}
          <div className="w-full max-w-[300px] mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-700 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
            </div>
          </div>
          
          {/* Movie details skeleton */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div className="h-10 w-3/4 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            
            {/* Tagline */}
            <div className="h-6 w-1/2 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-7 w-20 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-full"></div>
              ))}
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 w-16 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
              ))}
            </div>
            
            {/* Overview */}
            <div>
              <div className="h-7 w-32 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md mb-3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
                ))}
              </div>
            </div>
            
            {/* Details */}
            <div>
              <div className="h-7 w-24 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md mb-3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MovieCastSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
          <div className="h-8 w-24 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
        </div>
        <div className="flex overflow-x-hidden gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[140px] md:w-[150px] lg:w-[160px]">
              <div className="aspect-[2/3] rounded-md bg-gradient-to-br from-neutral-800 to-neutral-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
              </div>
              <div className="h-5 w-4/5 mt-2 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
              <div className="h-4 w-3/5 mt-1 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SimilarMoviesSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
          <div className="h-8 w-24 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-md bg-gradient-to-br from-neutral-800 to-neutral-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
