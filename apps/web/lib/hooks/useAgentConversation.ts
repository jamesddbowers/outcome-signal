import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { AgentConversation } from '@/lib/types';

/**
 * Fetches agent conversation for a specific initiative
 */
async function fetchAgentConversation(initiativeId: string): Promise<AgentConversation | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agent_conversations')
    .select('*')
    .eq('initiative_id', initiativeId)
    .single();

  if (error) {
    // If no conversation exists yet, return null instead of throwing
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data as unknown as AgentConversation;
}

/**
 * React Query hook for fetching agent conversation
 */
export function useAgentConversation(initiativeId: string): UseQueryResult<AgentConversation | null> {
  return useQuery({
    queryKey: ['agent-conversation', initiativeId],
    queryFn: () => fetchAgentConversation(initiativeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!initiativeId,
  });
}
