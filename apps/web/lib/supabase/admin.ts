/**
 * Supabase Admin Client
 *
 * Creates a Supabase client with service role key for admin operations.
 * Bypasses Row Level Security (RLS) policies.
 *
 * ⚠️ NEVER use this client in client-side code!
 * Only use in server actions and API routes.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let adminClientInstance: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Get or create a Supabase admin client with service role key
 *
 * @returns Supabase client with admin privileges
 */
export function getSupabaseAdmin(): ReturnType<typeof createClient<Database>> {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    );
  }

  adminClientInstance = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClientInstance;
}
