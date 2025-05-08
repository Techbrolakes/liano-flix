import { useQuery } from '@tanstack/react-query';
import { peopleAPI } from '@/app/lib/api';

export const usePopularPeople = (page = 1) => {
  return useQuery({
    queryKey: ['people', 'popular', page],
    queryFn: () => peopleAPI.getPopular(page),
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
};

export const usePersonDetails = (personId: number) => {
  return useQuery({
    queryKey: ['person', personId],
    queryFn: () => peopleAPI.getPersonDetails(personId),
    enabled: !!personId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const usePersonMovieCredits = (personId: number) => {
  return useQuery({
    queryKey: ['person', personId, 'movie_credits'],
    queryFn: () => peopleAPI.getPersonMovieCredits(personId),
    enabled: !!personId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useSearchPeople = (query: string, page = 1) => {
  return useQuery({
    queryKey: ['people', 'search', query, page],
    queryFn: () => peopleAPI.searchPeople(query, page),
    enabled: !!query && query.length > 2,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
