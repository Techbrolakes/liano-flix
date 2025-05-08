'use client';

import React from 'react';

export const ActorInfoSkeleton = () => {
  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Actor profile image skeleton */}
          <div className="w-full max-w-[300px] mx-auto md:mx-0">
            <div className="relative aspect-square rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-700 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
            </div>
          </div>
          
          {/* Actor details skeleton */}
          <div className="flex-1 space-y-6">
            {/* Name */}
            <div className="h-10 w-2/3 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            
            {/* Personal Info */}
            <div>
              <div className="h-8 w-40 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md mb-3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-[100px_1fr] gap-2">
                      <div className="h-5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
                      <div className="h-5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Biography */}
            <div>
              <div className="h-8 w-32 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md mb-3"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
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

export const ActorFilmographySkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
          <div className="h-8 w-24 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
        </div>
        <div className="flex overflow-x-hidden gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[160px] md:w-[150px] lg:w-[180px]">
              <div className="aspect-[2/3] rounded-md bg-gradient-to-br from-neutral-800 to-neutral-700 relative overflow-hidden mb-2">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent skeleton-shine"></div>
              </div>
              <div className="h-5 w-4/5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md mb-1"></div>
              <div className="h-4 w-3/5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
