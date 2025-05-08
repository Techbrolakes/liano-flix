import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PersonDetails, MovieCast } from '@/app/lib/types';
import { getProfileUrl, getPosterUrl } from '@/app/lib/tmdb';
import { peopleAPI } from '@/app/lib/api';

async function getPersonDetails(id: number): Promise<PersonDetails> {
  try {
    return await peopleAPI.getPersonDetails(id);
  } catch (error) {
    console.error(`Error fetching person details for id ${id}:`, error);
    throw error;
  }
}

async function getPersonMovieCredits(id: number): Promise<MovieCast[]> {
  try {
    const data = await peopleAPI.getPersonMovieCredits(id);
    // Sort by popularity and filter out movies without release dates
    return data.cast
      .filter(movie => movie.release_date)
      .sort((a, b) => b.popularity - a.popularity);
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
      if (!dateStr) return 'Unknown';
      
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
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
                  src={getProfileUrl(person.profile_path, 'large')}
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
                  <h2 className="text-xl font-medium text-white mb-2">Personal Info</h2>
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
                        <dd className="text-white">{formatDate(person.deathday)}</dd>
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
                        <dd className="text-white">{person.also_known_as.join(', ')}</dd>
                      </>
                    )}
                  </dl>
                </div>
              </div>
              
              {person.biography && (
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-white mb-2">Biography</h2>
                  <div className="text-neutral-300 space-y-4">
                    {person.biography.split('\n\n').map((paragraph, index) => (
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
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-white mb-4">Filmography</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group"
            >
              <div className="aspect-[2/3] relative overflow-hidden rounded-md bg-neutral-800 mb-2">
                <Image
                  src={getPosterUrl(movie.poster_path, 'medium')}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="text-sm font-medium text-white group-hover:text-red-500 transition line-clamp-1">
                {movie.title}
              </h3>
              <div className="flex justify-between text-xs text-neutral-400">
                <p>{new Date(movie.release_date).getFullYear()}</p>
                <p className="text-neutral-300 italic line-clamp-1">
                  {movie.character}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error rendering ActorFilmography for id ${id}:`, error);
    return null;
  }
}

export default function ActorPage({ params }: { params: { id: string } }) {
  const personId = parseInt(params.id, 10);
  
  if (isNaN(personId)) {
    notFound();
  }
  
  return (
    <div className="pb-10 pt-24">
      <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="h-[50vh] bg-neutral-900 animate-pulse rounded-md" /></div>}>
        <ActorInfo id={personId} />
      </Suspense>
      
      <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="h-60 bg-neutral-900 animate-pulse rounded-md" /></div>}>
        <ActorFilmography id={personId} />
      </Suspense>
    </div>
  );
}
