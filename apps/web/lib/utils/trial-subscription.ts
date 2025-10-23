/**
 * Shared utilities for creating trial subscriptions
 *
 * This module contains shared logic for creating trial subscriptions and usage tracking
 * to avoid duplication between webhook handler and server actions.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { getTierLimits } from '@/lib/constants/subscription-tiers';
import type { Database } from '@/lib/supabase/database.types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export interface TrialSubscriptionResult {
  subscription: Subscription | null;
  error: string | null;
  isNew: boolean; // true if created, false if already existed
}

/**
 * Creates a trial subscription and usage tracking for a Supabase user
 *
 * This function handles:
 * - Checking for existing subscription (idempotency)
 * - Creating trial subscription with 7-day period
 * - Creating usage tracking with trial limits
 * - Proper error handling and logging
 *
 * @param supabaseUserId - The Supabase user UUID
 * @param supabaseAdmin - Admin Supabase client (with RLS bypass)
 * @param logPrefix - Optional prefix for log messages
 * @returns Result object with subscription, error, and isNew flag
 */
export async function createTrialSubscriptionForUser(
  supabaseUserId: string,
  supabaseAdmin: SupabaseClient<Database>,
  logPrefix = '[createTrialSubscription]'
): Promise<TrialSubscriptionResult> {
  try {
    // Check if subscription already exists (idempotency)
    const { data: existingSubscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', supabaseUserId)
      .single();

    if (existingSubscription) {
      console.log(`${logPrefix} Subscription already exists for user ${supabaseUserId} (idempotent)`);
      return {
        subscription: existingSubscription as Subscription,
        error: null,
        isNew: false,
      };
    }

    // Create trial subscription
    console.log(`${logPrefix} Creating trial subscription for user ${supabaseUserId}`);
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: newSubscription, error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: supabaseUserId,
        tier: 'trial',
        status: 'active',
        trial_ends_at: trialEndsAt.toISOString(),
        current_period_start: now.toISOString(),
        current_period_end: trialEndsAt.toISOString(),
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error(`${logPrefix} Error creating subscription:`, subscriptionError);
      return {
        subscription: null,
        error: `Failed to create subscription: ${subscriptionError.message}`,
        isNew: false,
      };
    }

    console.log(`${logPrefix} Trial subscription created for user ${supabaseUserId}`);

    // Create usage tracking record for trial limits
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const trialLimits = getTierLimits('trial');

    const { error: usageError } = await supabaseAdmin
      .from('usage_tracking')
      .insert({
        user_id: supabaseUserId,
        month: currentMonth,
        credits_used: 0,
        credits_limit: trialLimits.creditsLimit,
        initiatives_count: 0,
        initiatives_limit: trialLimits.initiativesLimit,
      });

    // Ignore duplicate errors (ON CONFLICT for idempotency)
    if (usageError && usageError.code !== '23505') {
      console.error(`${logPrefix} Error creating usage tracking:`, usageError);
      // Don't fail the whole operation if usage tracking fails
      // The subscription is still valid
    } else if (!usageError) {
      console.log(`${logPrefix} Usage tracking created for user ${supabaseUserId}`);
    } else {
      console.log(`${logPrefix} Usage tracking already exists for user ${supabaseUserId} (idempotent)`);
    }

    return {
      subscription: newSubscription as Subscription,
      error: null,
      isNew: true,
    };
  } catch (error) {
    console.error(`${logPrefix} Unexpected error:`, error);
    return {
      subscription: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      isNew: false,
    };
  }
}
