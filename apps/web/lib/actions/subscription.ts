/**
 * Subscription Server Actions
 * Story 3.2: Implement Trial Signup Flow
 *
 * Server-side actions for fetching user subscription data.
 */

'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createTrialSubscriptionForUser } from '@/lib/utils/trial-subscription';
import type { Database } from '@/lib/supabase/database.types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

/**
 * Fetches the current user's subscription record
 *
 * @returns The user's subscription record, or null if not found or not authenticated
 *
 * @example
 * ```typescript
 * const subscription = await getUserSubscription();
 * if (subscription?.tier === 'trial') {
 *   console.log('User is on trial');
 * }
 * ```
 */
export async function getUserSubscription(): Promise<Subscription | null> {
  try {
    // Get authenticated user ID from Clerk
    const { userId } = await auth();
    if (!userId) {
      console.log('[getUserSubscription] No authenticated user found');
      return null;
    }

    // Use admin client to bypass RLS policies
    const supabase = getSupabaseAdmin();

    // First, get the Supabase user ID from Clerk user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !user) {
      // User doesn't exist in Supabase yet
      return null;
    }

    // Now get the subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // Don't log PGRST116 (no rows) as error - it's expected for new users
      if (error.code !== 'PGRST116') {
        console.error('[getUserSubscription] Error fetching subscription:', error);
      }
      return null;
    }

    // Return subscription data
    return data as Subscription;
  } catch (error) {
    console.error('[getUserSubscription] Unexpected error:', error);
    return null;
  }
}

/**
 * Helper function to wait/sleep for a specified number of milliseconds
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Helper function to lookup or create user in Supabase
 * Uses retry logic to handle race condition with Clerk webhook
 */
async function getOrCreateSupabaseUser(
  clerkUserId: string,
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>
): Promise<Database['public']['Tables']['users']['Row'] | null> {
  const retryDelays = [500, 1000, 2000, 3000, 4000]; // Total: ~10 seconds
  let attempt = 0;

  // Try to find existing user with retries (webhook might still be processing)
  for (const delay of retryDelays) {
    attempt++;
    console.log(`[getOrCreateSupabaseUser] Attempt ${attempt}/${retryDelays.length} - Looking for user ${clerkUserId}`);

    const { data: existingUser, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (existingUser) {
      console.log(`[getOrCreateSupabaseUser] Found user: ${existingUser.email}`);
      return existingUser;
    }

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is expected during retries
      console.error(`[getOrCreateSupabaseUser] Unexpected error:`, error);
    }

    // Wait before next retry
    if (attempt < retryDelays.length) {
      console.log(`[getOrCreateSupabaseUser] User not found, waiting ${delay}ms before retry...`);
      await sleep(delay);
    }
  }

  // After all retries, user still not found - create it ourselves
  console.log(`[getOrCreateSupabaseUser] User not found after retries, creating user in Supabase`);

  try {
    // Fetch user data from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);

    if (!clerkUser) {
      console.error(`[getOrCreateSupabaseUser] Clerk user not found: ${clerkUserId}`);
      return null;
    }

    // Get primary email
    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
      console.error(`[getOrCreateSupabaseUser] No email address found for Clerk user: ${clerkUserId}`);
      return null;
    }

    // Create user in Supabase
    const userData = {
      clerk_user_id: clerkUserId,
      email: primaryEmail,
      first_name: clerkUser.firstName || null,
      last_name: clerkUser.lastName || null,
      avatar_url: clerkUser.imageUrl || null,
    };

    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (insertError) {
      // Handle race condition: webhook created user while we were fetching from Clerk
      if (insertError.code === '23505') {
        console.log(`[getOrCreateSupabaseUser] User was just created by webhook, fetching it`);
        const { data: raceUser } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('clerk_user_id', clerkUserId)
          .single();
        return raceUser;
      }

      console.error(`[getOrCreateSupabaseUser] Error creating user:`, insertError);
      return null;
    }

    console.log(`[getOrCreateSupabaseUser] Created new user in Supabase: ${newUser.email}`);
    return newUser;
  } catch (error) {
    console.error(`[getOrCreateSupabaseUser] Error fetching Clerk user or creating in Supabase:`, error);
    return null;
  }
}

/**
 * Creates a trial subscription for the current user if one doesn't exist
 * Handles race conditions with Clerk webhook by using retry logic
 * Falls back to creating user in Supabase if webhook hasn't run yet
 *
 * @returns The created or existing subscription, or null if failed
 */
export async function createTrialSubscriptionIfNeeded(): Promise<Subscription | null> {
  try {
    // Get authenticated user ID from Clerk
    const { userId } = await auth();
    if (!userId) {
      console.error('[createTrialSubscription] No authenticated user');
      return null;
    }

    console.log(`[createTrialSubscription] Starting for Clerk user: ${userId}`);

    // Create admin Supabase client (needs service role to bypass RLS)
    const supabaseAdmin = getSupabaseAdmin();

    // Get or create user in Supabase (with retry logic)
    const supabaseUser = await getOrCreateSupabaseUser(userId, supabaseAdmin);

    if (!supabaseUser) {
      console.error('[createTrialSubscription] Failed to get or create user in Supabase');
      return null;
    }

    // Create trial subscription and usage tracking using shared utility
    const result = await createTrialSubscriptionForUser(
      supabaseUser.id,
      supabaseAdmin,
      '[createTrialSubscription]'
    );

    if (result.error) {
      console.error('[createTrialSubscription] Error:', result.error);
      return null;
    }

    return result.subscription;
  } catch (error) {
    console.error('[createTrialSubscription] Unexpected error:', error);
    return null;
  }
}
