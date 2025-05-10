import { useQuery } from '@tanstack/react-query';
import { peopleAPI } from '@/app/lib/api';
import { Person, PersonDetails, PersonMovieCredits } from '@/app/types';
import { APIResponse } from '@/app/types';

// Hook for fetching popular actors/people
export function usePopularActors(page = 1) {
  return useQuery<APIResponse<Person>>({
    queryKey: ['popularActors', page],
    queryFn: () => peopleAPI.getPopular(page),
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
}

// Alias for usePopularActors to maintain compatibility
export const usePopularPeople = usePopularActors;

// Hook for searching actors/people
export function useSearchActors(query: string, page = 1) {
  return useQuery<APIResponse<Person>>({
    queryKey: ['searchActors', query, page],
    queryFn: () => peopleAPI.searchPeople(query, page),
    enabled: !!query && query.length > 2, // Only run the query if there's a search term with at least 3 characters
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Alias for useSearchActors to maintain compatibility
export const useSearchPeople = useSearchActors;

// Hook for fetching actor/person details
export function useActorDetails(actorId: number) {
  return useQuery<PersonDetails>({
    queryKey: ['actorDetails', actorId],
    queryFn: () => peopleAPI.getPersonDetails(actorId),
    enabled: !!actorId && !isNaN(actorId),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Alias for useActorDetails to maintain compatibility
export const usePersonDetails = useActorDetails;

// Hook for fetching actor/person movie credits
export function useActorMovieCredits(actorId: number) {
  return useQuery<PersonMovieCredits>({
    queryKey: ['actorMovieCredits', actorId],
    queryFn: () => peopleAPI.getPersonMovieCredits(actorId),
    enabled: !!actorId && !isNaN(actorId),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Alias for useActorMovieCredits to maintain compatibility
export const usePersonMovieCredits = useActorMovieCredits;

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
