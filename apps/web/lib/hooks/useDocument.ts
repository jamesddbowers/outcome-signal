import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMockDocument } from '@/lib/services/mock-documents';

export interface UseDocumentOptions {
  enabled?: boolean;
}

/**
 * React Query hook for fetching document content
 * @param initiativeId - The initiative ID
 * @param epicId - Optional epic ID
 * @param options - Additional options for the query
 * @returns React Query result with document content
 */
export function useDocument(
  initiativeId: string,
  epicId?: string,
  options?: UseDocumentOptions
): UseQueryResult<string, Error> {
  return useQuery({
    queryKey: ['document', initiativeId, epicId],
    queryFn: () => getMockDocument(initiativeId, epicId),
    enabled: options?.enabled ?? !!initiativeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}
