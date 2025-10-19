/**
 * React Query Hook: useInitiatives
 *
 * Fetches all initiatives for the current user using React Query.
 * Provides automatic caching, background refetching, and loading states.
 * Uses Clerk's native third-party integration with Supabase.
 *
 * @returns React Query result object with initiatives data, loading, and error states
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useSession } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '../supabase/client';
import type { Tables } from '../supabase/database.types';

export type Initiative = Tables<'initiatives'>;

export function useInitiatives(): UseQueryResult<Initiative[], Error> {
  const { session } = useSession();

  return useQuery<Initiative[], Error>({
    queryKey: ['initiatives'],
    queryFn: async () => {
      console.log('[useInitiatives] Fetching initiatives...');
      console.log('[useInitiatives] Session:', session ? 'Active' : 'None');

      const supabase = createClerkSupabaseClient(() => session?.getToken() || Promise.resolve(null));

      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      console.log('[useInitiatives] Response:', { data, error });

      if (error) {
        console.error('[useInitiatives] Error fetching initiatives:', error);
        throw new Error(`Failed to fetch initiatives: ${error.message}`);
      }

      console.log('[useInitiatives] Successfully fetched', data?.length || 0, 'initiatives');
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });
}
