'use client';

import React from 'react';

interface CarouselSkeletonProps {
  itemCount?: number;
}

export const CarouselSkeleton = ({ itemCount = 6 }: CarouselSkeletonProps) => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-6 lg:px-8">
        {/* Title skeleton */}
        <div className="h-8 w-48 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
        
        {/* View All link skeleton */}
        <div className="h-8 w-24 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
      </div>
      
      <div className="flex gap-4 overflow-hidden pl-4 md:pl-6 lg:pl-8">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[160px] md:w-[180px] lg:w-[200px]">
            {/* Poster skeleton */}
            <div className="aspect-[2/3] rounded-md bg-gradient-to-br from-neutral-800 to-neutral-700 relative overflow-hidden mb-2">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
            </div>
            {/* Title skeleton */}
            <div className="h-4 w-5/6 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md mb-1"></div>
            {/* Subtitle skeleton */}
            <div className="h-3 w-3/5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
