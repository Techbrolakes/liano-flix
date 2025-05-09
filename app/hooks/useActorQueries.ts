import { useQuery } from '@tanstack/react-query';
import { peopleAPI } from '@/app/lib/api';
import { Person, PersonDetails, PersonMovieCredits } from '@/app/types';
import { APIResponse } from '@/app/types';

// Hook for fetching popular actors
export function usePopularActors(page = 1) {
  return useQuery<APIResponse<Person>>({
    queryKey: ['popularActors', page],
    queryFn: () => peopleAPI.getPopular(page),
  });
}

// Hook for searching actors
export function useSearchActors(query: string, page = 1) {
  return useQuery<APIResponse<Person>>({
    queryKey: ['searchActors', query, page],
    queryFn: () => peopleAPI.searchPeople(query, page),
    enabled: !!query, // Only run the query if there's a search term
  });
}

// Hook for fetching actor details
export function useActorDetails(actorId: number) {
  return useQuery<PersonDetails>({
    queryKey: ['actorDetails', actorId],
    queryFn: () => peopleAPI.getPersonDetails(actorId),
    enabled: !!actorId && !isNaN(actorId),
  });
}

// Hook for fetching actor movie credits
export function useActorMovieCredits(actorId: number) {
  return useQuery<PersonMovieCredits>({
    queryKey: ['actorMovieCredits', actorId],
    queryFn: () => peopleAPI.getPersonMovieCredits(actorId),
    enabled: !!actorId && !isNaN(actorId),
  });
}

// Utility function to get sorted actor movie credits
export function useSortedActorMovieCredits(actorId: number) {
  const { data, ...rest } = useActorMovieCredits(actorId);
  
  const sortedMovies = data?.cast
    ?.filter(movie => movie.release_date)
    .sort((a, b) => {
      // Sort by release date (newest first)
      return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
    }) || [];

  return {
    ...rest,
    data: sortedMovies,
  };
}
