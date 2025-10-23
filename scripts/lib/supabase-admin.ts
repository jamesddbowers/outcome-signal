/**
 * Supabase Admin Client
 *
 * Creates a Supabase client with service role key for test data management.
 * Bypasses RLS policies to allow direct database manipulation for testing.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from apps/web/.env.local
config({ path: resolve(__dirname, '../../apps/web/.env.local') });

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_user_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: 'trial' | 'starter' | 'professional' | 'enterprise';
          status: 'active' | 'canceled' | 'expired' | 'past_due';
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          trial_ends_at: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          credits_used: number;
          credits_limit: number;
          initiatives_count: number;
          initiatives_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['usage_tracking']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      initiatives: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: 'active' | 'archived';
          phase: 'planning' | 'development' | 'testing' | 'deployed';
          phase_progress: number;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['initiatives']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          initiative_id: string;
          type: 'brief' | 'market_research' | 'competitive_analysis' | 'prd' | 'architecture' | 'ux_overview' | 'security_review' | 'qa_strategy';
          title: string;
          content: string;
          version: number;
          status: string;
          generated_by_agent: string;
          llm_model: string;
          tokens_used: number;
          generation_time_ms: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      agent_conversations: {
        Row: {
          id: string;
          initiative_id: string;
          user_id: string;
          messages: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['agent_conversations']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      workflow_executions: {
        Row: {
          id: string;
          initiative_id: string;
          user_id: string;
          workflow_type: string;
          document_type: string | null;
          status: 'running' | 'completed' | 'failed' | 'canceled';
          progress: number;
          current_step: string | null;
          vertex_ai_execution_id: string | null;
          result: any;
          error: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
      };
    };
  };
}

/**
 * Creates a Supabase admin client with service role key
 * @throws Error if environment variables are not configured
 */
export function createAdminClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL not found. Ensure apps/web/.env.local is configured.'
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY not found. Ensure apps/web/.env.local is configured.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
