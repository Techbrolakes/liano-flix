"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getProfileUrl } from "@/app/lib/tmdb";
import { MovieCarousel } from "@/app/components/MovieCarousel";
import {
  ActorInfoSkeleton,
  ActorFilmographySkeleton,
} from "@/app/components/skeletons/ActorDetailsSkeleton";
import { Movie } from "@/app/types";
import { useActorDetails, useSortedActorMovieCredits } from "@/app/hooks/useActorQueries";

// Format birthday helper function
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "Unknown";

  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Calculate age helper function
const calculateAge = (birthday: string | null, deathday: string | null) => {
  if (!birthday) return null;

  const birthDate = new Date(birthday);
  const endDate = deathday ? new Date(deathday) : new Date();

  let age = endDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = endDate.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && endDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

function ActorInfo({ id }: { id: number }) {
  const { data: person, isLoading, error } = useActorDetails(id);

  if (isLoading) {
    return <ActorInfoSkeleton />;
  }

  if (error || !person) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error loading actor details</p>
      </div>
    );
  }

  const age = calculateAge(person.birthday, person.deathday);

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Actor profile image */}
          <div className="w-full max-w-[300px] mx-auto md:mx-0">
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-xl bg-neutral-800">
              <Image
                src={getProfileUrl(person.profile_path, "large")}
                alt={person.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Actor details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {person.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">
                  Personal Info
                </h2>
                <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                  <dt className="text-neutral-400">Known For</dt>
                  <dd className="text-white">
                    {person.known_for_department}
                  </dd>

                  <dt className="text-neutral-400">Born</dt>
                  <dd className="text-white">
                    {formatDate(person.birthday)}
                    {age !== null && ` (Age: ${age})`}
                  </dd>

                  {person.deathday && (
                    <>
                      <dt className="text-neutral-400">Died</dt>
                      <dd className="text-white">
                        {formatDate(person.deathday)}
                      </dd>
                    </>
                  )}

                  {person.place_of_birth && (
                    <>
                      <dt className="text-neutral-400">Birthplace</dt>
                      <dd className="text-white">{person.place_of_birth}</dd>
                    </>
                  )}

                  {person.also_known_as &&
                    person.also_known_as.length > 0 && (
                      <>
                        <dt className="text-neutral-400">Also Known As</dt>
                        <dd className="text-white">
                          {person.also_known_as.join(", ")}
                        </dd>
                      </>
                    )}
                </dl>
              </div>
            </div>

            {person.biography && (
              <div className="mb-6">
                <h2 className="text-xl font-medium text-white mb-2">
                  Biography
                </h2>
                <div className="text-neutral-300 space-y-4">
                  {person.biography.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActorFilmography({ id }: { id: number }) {
  const { data: movies, isLoading, error } = useSortedActorMovieCredits(id);

  if (isLoading) {
    return <ActorFilmographySkeleton />;
  }

  if (error || !movies || movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-white mb-4">Filmography</h2>
        <p className="text-neutral-400">No movies found.</p>
      </div>
    );
  }

  // Create Movie objects from cast data for the carousel
  // We need to add the missing properties required by the Movie interface
  const mappedMovies: Movie[] = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path || "",
    backdrop_path: "", // Not in the PersonMovieCredits type, set a default
    overview: "", // Not in the PersonMovieCredits type, set a default
    release_date: movie.release_date,
    vote_average: 0, // Not in the PersonMovieCredits type, set a default
    vote_count: 0, // Not in the PersonMovieCredits type, set a default
    popularity: 0, // Not in the PersonMovieCredits type, set a default
    genre_ids: [], // Not in the PersonMovieCredits type, set a default
    original_language: "en", // Not in the PersonMovieCredits type, set a default
    adult: false, // Not in the PersonMovieCredits type, set a default
    video: false, // Not in the PersonMovieCredits type, set a default
    original_title: movie.title, // Required for some components
  }));

  return (
    <div className="container mx-auto">
      <MovieCarousel title="Filmography" movies={mappedMovies} />
    </div>
  );
}

export default function ActorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [actorId, setActorId] = useState<number | null>(null);

  useEffect(() => {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      router.push('/not-found');
      return;
    }
    setActorId(id);
  }, [params.id, router]);

  if (!actorId) {
    return (
      <div className="pb-10 pt-24">
        <ActorInfoSkeleton />
        <ActorFilmographySkeleton />
      </div>
    );
  }

  return (
    <div className="pb-10 pt-24">
      <ActorInfo id={actorId} />
      <ActorFilmography id={actorId} />
    </div>
  );
}
