"use client";

import {
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  POSTER_SIZES,
  BACKDROP_SIZES,
  PROFILE_SIZES,
} from "@/app/lib/tmdb";
import { PosterImage, BackdropImage, ProfileImage } from "./optimized-image";

// Base TMDB Image component
interface TMDBImageProps {
  path: string | null;
  alt: string;
  size?:
    | keyof typeof POSTER_SIZES
    | keyof typeof BACKDROP_SIZES
    | keyof typeof PROFILE_SIZES;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

// Movie Poster component
export function MoviePoster({
  path,
  alt,
  size = "medium",
  className,
  priority = false,
  quality = 80,
  sizes,
}: TMDBImageProps) {
  // Get the poster URL from the TMDB helper
  const posterUrl = path
    ? getPosterUrl(path, size as keyof typeof POSTER_SIZES)
    : null;

  return (
    <PosterImage
      src={posterUrl}
      alt={alt}
      className={className}
      priority={priority}
      quality={quality}
      sizes={
        sizes ||
        (size === "small"
          ? "(max-width: 640px) 185px, 185px"
          : size === "medium"
          ? "(max-width: 640px) 100vw, (max-width: 1024px) 342px, 342px"
          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px")
      }
    />
  );
}

// Movie Backdrop component
export function MovieBackdrop({
  path,
  alt,
  size = "medium",
  className,
  priority = false,
  quality = 80,
  sizes,
}: TMDBImageProps) {
  // Get the backdrop URL from the TMDB helper
  const backdropUrl = path
    ? getBackdropUrl(path, size as keyof typeof BACKDROP_SIZES)
    : null;

  return (
    <BackdropImage
      src={backdropUrl}
      alt={alt}
      className={className}
      priority={priority}
      quality={quality}
      sizes={
        sizes ||
        (size === "small"
          ? "(max-width: 640px) 300px, 300px"
          : size === "medium"
          ? "(max-width: 640px) 100vw, (max-width: 1024px) 780px, 780px"
          : "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px")
      }
    />
  );
}

// Actor Profile component
export function ActorProfile({
  path,
  alt,
  size = "medium",
  className,
  priority = false,
  quality = 80,
  sizes,
}: TMDBImageProps) {
  // Get the profile URL from the TMDB helper
  const profileUrl = path
    ? getProfileUrl(path, size as keyof typeof PROFILE_SIZES)
    : null;

  return (
    <ProfileImage
      src={profileUrl}
      alt={alt}
      className={className}
      priority={priority}
      quality={quality}
      sizes={
        sizes ||
        (size === "small"
          ? "45px"
          : size === "medium"
          ? "(max-width: 640px) 185px, 185px"
          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw")
      }
    />
  );
}
