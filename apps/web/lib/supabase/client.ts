import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Creates a Supabase client for client-side usage (browser/React components)
 * Uses the anon key which respects Row Level Security policies
 */
export function createClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Creates a Supabase client with Clerk authentication using native third-party integration
 * This uses Clerk's session token directly via the accessToken callback
 *
 * @param getToken - Function that returns the Clerk session token
 * @returns Supabase client configured with Clerk authentication
 *
 * @example
 * ```tsx
 * import { useSession } from '@clerk/nextjs'
 *
 * const { session } = useSession()
 * const supabase = createClerkSupabaseClient(() => session?.getToken())
 * ```
 */
export function createClerkSupabaseClient(
  getToken: () => Promise<string | null> | string | null
): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'X-Client-Info': 'clerk-supabase-integration',
      },
    },
    auth: {
      persistSession: false,
    },
    accessToken: async () => {
      const token = await getToken()
      return token || ''
    },
  })
}
