import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProfileUrl } from "@/app/lib/tmdb";
import { peopleAPI } from "@/app/lib/api";
import { MovieCarousel } from "@/app/components/MovieCarousel";
import {
  ActorInfoSkeleton,
  ActorFilmographySkeleton,
} from "@/app/components/skeletons/ActorDetailsSkeleton";
import { Movie, PersonDetails } from "@/app/types";

async function getPersonDetails(id: number): Promise<PersonDetails> {
  try {
    return await peopleAPI.getPersonDetails(id);
  } catch (error) {
    console.error(`Error fetching person details for id ${id}:`, error);
    throw error;
  }
}

async function getPersonMovieCredits(id: number) {
  try {
    const data = await peopleAPI.getPersonMovieCredits(id);
    // Filter out movies without release dates and sort by release date (newest first)
    return data.cast
      .filter((movie) => movie.release_date)
      .sort((a, b) => {
        // Sort by release date (newest first)
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      });
  } catch (error) {
    console.error(`Error fetching person movie credits for id ${id}:`, error);
    return [];
  }
}

async function ActorInfo({ id }: { id: number }) {
  try {
    const person = await getPersonDetails(id);

    // Format birthday
    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return "Unknown";

      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    // Calculate age
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
  } catch (error) {
    console.error(`Error rendering ActorInfo for id ${id}:`, error);
    notFound();
  }
}

async function ActorFilmography({ id }: { id: number }) {
  try {
    const movies = await getPersonMovieCredits(id);

    if (movies.length === 0) {
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
  } catch (error) {
    console.error(`Error rendering ActorFilmography for id ${id}:`, error);
    return null;
  }
}

export default async function ActorPage({
  params,
}: {
  params: { id: string };
}) {
  const id = await params.id;
  const personId = parseInt(id, 10);

  if (isNaN(personId)) {
    notFound();
  }

  return (
    <div className="pb-10 pt-24">
      <Suspense fallback={<ActorInfoSkeleton />}>
        <ActorInfo id={personId} />
      </Suspense>

      <Suspense fallback={<ActorFilmographySkeleton />}>
        <ActorFilmography id={personId} />
      </Suspense>
    </div>
  );
}
