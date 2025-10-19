import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useSession } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '../supabase/client';
import type {
  PhaseIndicatorData,
  DocumentBreakdown,
  DocumentType,
} from '../types';
import { documentTypeNames, PLANNING_DOCUMENT_TYPES } from '../types';

/**
 * Hook to fetch initiative progress data including phase, progress percentage, and document breakdown
 * Uses Clerk's native third-party integration with Supabase
 * @param initiativeId - The ID of the initiative
 * @returns React Query result with PhaseIndicatorData
 */
export function useInitiativeProgress(initiativeId: string): UseQueryResult<PhaseIndicatorData> {
  const { session } = useSession();

  return useQuery({
    queryKey: ['initiative-progress', initiativeId],
    queryFn: async (): Promise<PhaseIndicatorData> => {
      const supabase = createClerkSupabaseClient(() => session?.getToken() || Promise.resolve(null));
      // Fetch Initiative for phase and phase_progress
      const { data: initiative, error: initiativeError } = await supabase
        .from('initiatives')
        .select('phase, phase_progress')
        .eq('id', initiativeId)
        .single();

      if (initiativeError) {
        throw new Error(`Failed to fetch initiative: ${initiativeError.message}`);
      }

      if (!initiative) {
        throw new Error('Initiative not found');
      }

      // Fetch Documents for breakdown
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('type, status')
        .eq('initiative_id', initiativeId);

      if (documentsError) {
        throw new Error(`Failed to fetch documents: ${documentsError.message}`);
      }

      // Map documents to breakdown format
      const documentBreakdown = mapDocumentsToBreakdown(documents || []);

      return {
        phase: initiative.phase,
        progress: initiative.phase_progress || 0,
        documents: documentBreakdown,
      };
    },
    enabled: !!initiativeId,
  });
}

/**
 * Maps raw document data to DocumentBreakdown format
 * @param documents - Array of documents from database
 * @returns Array of DocumentBreakdown with status indicators
 */
function mapDocumentsToBreakdown(
  documents: Array<{ type: DocumentType; status: string | null }>
): DocumentBreakdown[] {
  return PLANNING_DOCUMENT_TYPES.map((type) => {
    const doc = documents.find((d) => d.type === type);
    let status: 'completed' | 'in_progress' | 'pending';

    if (!doc) {
      status = 'pending';
    } else if (doc.status === 'approved') {
      status = 'completed';
    } else if (doc.status === 'draft') {
      status = 'in_progress';
    } else {
      status = 'pending';
    }

    return {
      type,
      name: documentTypeNames[type],
      status,
    };
  });
}
