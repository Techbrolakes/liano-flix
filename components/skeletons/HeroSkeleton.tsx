'use client';

import React from 'react';

export const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] max-h-[800px] overflow-hidden">
      {/* Mobile: Poster skeleton with shimmer effect (hidden on larger screens) */}
      <div className="absolute inset-0 md:hidden">
        {/* More vertical gradient for poster style */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
        </div>
        
        {/* Enhanced mobile gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      </div>
      
      {/* Larger screens: Backdrop skeleton with shimmer effect (hidden on mobile) */}
      <div className="absolute inset-0 hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
        </div>
        
        {/* Enhanced gradient overlays for larger screens */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 lg:p-16">
        <div className="max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl mx-auto md:mx-0">
          {/* Title skeleton */}
          <div className="h-7 sm:h-9 md:h-10 lg:h-14 w-3/4 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md mb-2 md:mb-3"></div>
          
          {/* Info row skeleton */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 md:mb-4">
            <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            <div className="flex items-center gap-1">
              <div className="h-4 sm:h-5 w-16 sm:w-20 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            </div>
          </div>

          {/* Overview skeleton with responsive styling to match actual component */}
          <div className="mb-4 sm:mb-6">
            {/* Mobile overview skeleton */}
            <div className="md:hidden">
              <div className="h-16 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md p-2 backdrop-blur-sm bg-black/30"></div>
            </div>
            
            {/* Tablet overview skeleton */}
            <div className="hidden sm:block md:hidden">
              <div className="h-20 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md p-2 backdrop-blur-sm bg-black/20"></div>
            </div>
            
            {/* Desktop overview skeleton */}
            <div className="hidden md:block space-y-2">
              <div className="h-5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
              <div className="h-5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
              <div className="h-5 w-2/3 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <div className="h-9 sm:h-10 md:h-12 w-28 sm:w-32 md:w-36 rounded-md bg-gradient-to-r from-red-700 to-red-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent skeleton-shine"></div>
            </div>
            <div className="h-9 sm:h-10 md:h-12 w-28 sm:w-32 md:w-36 rounded-md bg-gradient-to-r from-neutral-800 to-neutral-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-600/20 to-transparent skeleton-shine"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
