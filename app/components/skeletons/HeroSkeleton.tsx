'use client';

import React from 'react';

export const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[75vh] max-h-[800px] overflow-hidden">
      {/* Backdrop skeleton with shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent" />
      </div>

      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
        <div className="max-w-2xl">
          {/* Title skeleton */}
          <div className="h-10 md:h-12 lg:h-14 w-3/4 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md mb-3"></div>
          
          {/* Info row skeleton */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-5 w-32 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            <div className="flex items-center gap-1">
              <div className="h-5 w-20 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            </div>
          </div>

          {/* Overview skeleton - hidden on mobile */}
          <div className="hidden md:block space-y-2 mb-6">
            <div className="h-5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            <div className="h-5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            <div className="h-5 w-2/3 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex flex-wrap gap-3">
            <div className="h-12 w-36 rounded-md bg-gradient-to-r from-red-700 to-red-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent skeleton-shine"></div>
            </div>
            <div className="h-12 w-36 rounded-md bg-gradient-to-r from-neutral-800 to-neutral-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-600/20 to-transparent skeleton-shine"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
