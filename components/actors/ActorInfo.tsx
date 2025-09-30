import Image from "next/image";
import { getProfileUrl } from "@/app/lib/tmdb";
import { ActorInfoSkeleton } from "@/components/skeletons/ActorDetailsSkeleton";
import { useActorDetails } from "@/app/hooks/useActorQueries";
import { formatDate, calculateAge } from "./utils";

export function ActorInfo({ id }: { id: number }) {
  const { data: person, isLoading, error } = useActorDetails(id);

  if (isLoading) {
    return <ActorInfoSkeleton />;
  }

  if (error || !person) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-purple-500">Error loading actor details</p>
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
                  <dd className="text-white">{person.known_for_department}</dd>

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

                  {person.also_known_as && person.also_known_as.length > 0 && (
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
