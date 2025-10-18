/**
 * React Query Hook: useInitiatives
 *
 * Fetches all initiatives for the current user using React Query.
 * Provides automatic caching, background refetching, and loading states.
 *
 * @returns React Query result object with initiatives data, loading, and error states
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMockInitiatives, type Initiative } from '@/lib/services/mock-data';

export function useInitiatives(): UseQueryResult<Initiative[], Error> {
  return useQuery<Initiative[], Error>({
    queryKey: ['initiatives'],
    queryFn: getMockInitiatives,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });
}
