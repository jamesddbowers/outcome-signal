export type { MessageRole, ChatMessage, AgentConversation, SendMessageRequest, SendMessageResponse } from './chat';

import type { Database } from '../supabase/database.types';

// Re-export commonly used types
export type InitiativePhase = Database['public']['Enums']['initiative_phase'];
export type DocumentType = Database['public']['Enums']['document_type'];
export type DocumentStatus = 'draft' | 'approved' | 'archived';

// Phase Indicator Types
export interface PhaseIndicatorData {
  phase: InitiativePhase;
  progress: number; // 0-100
  activeAgent?: string; // Optional: "Working with Architecture Agent..."
  documents: DocumentBreakdown[];
}

export interface DocumentBreakdown {
  type: DocumentType;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
}

// Phase emoji mapping
export const phaseEmojis: Record<InitiativePhase, string> = {
  planning: '📋',
  development: '🛠️',
  testing: '🧪',
  deployed: '🚀',
};

// Document type display names
export const documentTypeNames: Record<DocumentType, string> = {
  brief: 'Brief',
  market_research: 'Market Research',
  competitive_analysis: 'Competitive Analysis',
  prd: 'PRD',
  architecture: 'Architecture',
  ux_overview: 'UX',
  security_review: 'Security',
  qa_strategy: 'QA',
};

/**
 * Ordered list of planning phase document types.
 * Used to display documents in the correct sequence in the UI.
 */
export const PLANNING_DOCUMENT_TYPES: readonly DocumentType[] = [
  'brief',
  'market_research',
  'competitive_analysis',
  'prd',
  'architecture',
  'ux_overview',
  'security_review',
  'qa_strategy',
] as const;
