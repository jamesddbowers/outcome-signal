import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ExpireTrialsResponse {
  success: boolean
  expired_count: number
  errors: string[]
}

serve(async (req): Promise<Response> => {
  const errors: string[] = []

  try {
    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    )

    // Query and update expired trials in a single operation
    // Only update trials that are:
    // 1. Currently active
    // 2. On the trial tier
    // 3. Have a trial_ends_at date in the past
    const { data: expiredTrials, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('tier', 'trial')
      .eq('status', 'active')
      .lt('trial_ends_at', new Date().toISOString())
      .select('id, user_id, trial_ends_at')

    if (updateError) {
      errors.push(`Database update error: ${updateError.message}`)
      console.error('Failed to expire trials:', updateError)
    }

    const expiredCount = expiredTrials?.length ?? 0

    // Log the expiration event for analytics
    if (expiredCount > 0) {
      console.log({
        event: 'trials_expired',
        count: expiredCount,
        timestamp: new Date().toISOString(),
        trial_ids: expiredTrials?.map(t => t.id)
      })
    }

    const response: ExpireTrialsResponse = {
      success: errors.length === 0,
      expired_count: expiredCount,
      errors
    }

    return new Response(
      JSON.stringify(response),
      {
        status: errors.length > 0 ? 500 : 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    errors.push(errorMessage)
    console.error('Edge Function error:', error)

    const response: ExpireTrialsResponse = {
      success: false,
      expired_count: 0,
      errors
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
