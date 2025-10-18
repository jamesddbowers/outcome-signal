/**
 * React Query Hook: useEpics
 *
 * Fetches epics for a specific initiative using React Query.
 * Only executes the query when initiativeId is provided (enabled option).
 *
 * @param initiativeId - The ID of the initiative to fetch epics for
 * @returns React Query result object with epics data, loading, and error states
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMockEpics, type Epic } from '@/lib/services/mock-data';

export function useEpics(initiativeId: string): UseQueryResult<Epic[], Error> {
  return useQuery<Epic[], Error>({
    queryKey: ['epics', initiativeId],
    queryFn: () => getMockEpics(initiativeId),
    enabled: !!initiativeId, // Only fetch if initiativeId exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });
}
