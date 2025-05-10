'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type AspectRatio = 'poster' | 'backdrop' | 'profile' | 'square';

interface OptimizedImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: AspectRatio;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio = 'poster',
  className,
  fill = false,
  priority = false,
  sizes,
  quality = 80,
  fallbackSrc = '/images/placeholder.svg',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Define aspect ratio classes
  const aspectRatioClasses = {
    poster: 'aspect-[2/3]', // Movie poster (2:3)
    backdrop: 'aspect-[16/9]', // Movie backdrop (16:9)
    profile: 'aspect-square', // Actor profile (1:1)
    square: 'aspect-square', // Square (1:1)
  };
  
  // If src is null or empty, use fallback
  const imageSrc = src && src.trim() !== '' ? src : fallbackSrc;
  
  return (
    <div className={cn(
      'relative overflow-hidden bg-neutral-900',
      aspectRatioClasses[aspectRatio],
      className
    )}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
      )}
      
      {/* Image */}
      <Image
        src={hasError ? fallbackSrc : imageSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        quality={quality}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

// Specialized components for different use cases
export function PosterImage(props: Omit<OptimizedImageProps, 'aspectRatio'>) {
  return <OptimizedImage {...props} aspectRatio="poster" fill />;
}

export function BackdropImage(props: Omit<OptimizedImageProps, 'aspectRatio'>) {
  return <OptimizedImage {...props} aspectRatio="backdrop" fill />;
}

export function ProfileImage(props: Omit<OptimizedImageProps, 'aspectRatio'>) {
  return <OptimizedImage {...props} aspectRatio="profile" fill />;
}
