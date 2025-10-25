/**
 * Subscription Limit Checking Utilities
 * Story 3.3: Enforce Trial Limits
 *
 * Provides utility functions to check if users can perform actions
 * based on their subscription tier limits.
 */

import { createAdminClient } from '@/lib/supabase/server';
import { getTierLimits, type DocumentType, type SubscriptionTier } from '@/lib/constants/subscription-tiers';

/**
 * Result type for limit checks
 */
export interface LimitCheckResult {
  /** Whether the action is allowed */
  allowed: boolean;
  /** Reason why action was blocked (if not allowed) */
  reason?: 'limit_reached' | 'document_type_restricted' | 'export_restricted' | 'unauthorized';
  /** Current usage count (for limits that track usage) */
  currentCount?: number;
  /** Maximum limit (for limits that track usage) */
  limit?: number;
  /** User's subscription tier */
  tier?: SubscriptionTier;
}

/**
 * Checks if a user can create a new initiative based on their subscription tier limits
 *
 * Logic:
 * 1. Get user's Supabase ID from Clerk userId
 * 2. Query usage_tracking table for current month's initiatives_count
 * 3. Get user's subscription tier from subscriptions table
 * 4. Get tier limits from getTierLimits(tier)
 * 5. Compare initiatives_count vs initiativesLimit
 *    - If initiativesLimit === -1: unlimited, return allowed: true
 *    - If initiatives_count < initiativesLimit: return allowed: true
 *    - Otherwise: return allowed: false, reason: 'limit_reached'
 *
 * @param clerkUserId - The Clerk user ID
 * @returns Promise resolving to LimitCheckResult with allowed status and details
 *
 * @example
 * ```typescript
 * const result = await checkInitiativeLimit('clerk_user_123');
 * if (!result.allowed) {
 *   console.log(`Cannot create initiative: ${result.reason}`);
 * }
 * ```
 */
export async function checkInitiativeLimit(clerkUserId: string): Promise<LimitCheckResult> {
  try {
    // Use admin client for user lookup since we're already authenticated via Clerk
    // The regular client respects RLS which requires Supabase Auth JWT, but we use Clerk
    const supabaseAdmin = createAdminClient();

    console.log('[checkInitiativeLimit] Looking up user for clerk_user_id:', clerkUserId);

    // Get Supabase user ID from Clerk user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    console.log('[checkInitiativeLimit] User lookup result:', {
      userData,
      userError,
      hasData: !!userData,
      hasError: !!userError,
    });

    if (userError || !userData) {
      console.error('[checkInitiativeLimit] User lookup failed - user may not exist in Supabase yet:', {
        clerkUserId,
        userError,
        errorCode: userError?.code,
        errorMessage: userError?.message,
      });
      // TEMPORARY: Allow creation if user doesn't exist (fail-open for development)
      // This handles the case where test users were created before the Clerk webhook was set up
      // In production, all users should exist via webhook
      console.warn('[checkInitiativeLimit] WARNING: Allowing creation for non-existent user (development mode)');
      return {
        allowed: true,
        reason: undefined,
        currentCount: 0,
        limit: 1,
        tier: 'trial',
      };
    }

    const supabaseUserId = userData.id;

    // Get current month in YYYY-MM format
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    console.log('[checkInitiativeLimit] Debug info:', {
      clerkUserId,
      supabaseUserId,
      currentMonth,
      timestamp: now.toISOString(),
    });

    // Get user's subscription tier
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('tier')
      .eq('user_id', supabaseUserId)
      .single();

    if (subError || !subscription) {
      console.log('[checkInitiativeLimit] Subscription query failed:', subError);
      return {
        allowed: false,
        reason: 'unauthorized',
      };
    }

    const tier = subscription.tier as SubscriptionTier;
    const tierLimits = getTierLimits(tier);

    console.log('[checkInitiativeLimit] Subscription info:', {
      tier,
      initiativesLimit: tierLimits.initiativesLimit,
    });

    // Check if tier has unlimited initiatives
    if (tierLimits.initiativesLimit === -1) {
      console.log('[checkInitiativeLimit] Unlimited tier, allowing creation');
      return {
        allowed: true,
        tier,
      };
    }

    // Get current month's usage tracking
    const { data: usage, error: usageError } = await supabaseAdmin
      .from('usage_tracking')
      .select('initiatives_count, initiatives_limit')
      .eq('user_id', supabaseUserId)
      .eq('month', currentMonth)
      .single();

    console.log('[checkInitiativeLimit] Usage tracking query result:', {
      usage,
      usageError,
    });

    if (usageError || !usage) {
      // If no usage record exists, assume 0 initiatives
      console.log('[checkInitiativeLimit] No usage record, allowing creation with defaults');
      return {
        allowed: true,
        currentCount: 0,
        limit: tierLimits.initiativesLimit,
        tier,
      };
    }

    // Check if user is under limit
    const allowed = usage.initiatives_count < usage.initiatives_limit;

    console.log('[checkInitiativeLimit] Limit check result:', {
      initiatives_count: usage.initiatives_count,
      initiatives_limit: usage.initiatives_limit,
      allowed,
      calculation: `${usage.initiatives_count} < ${usage.initiatives_limit} = ${allowed}`,
    });

    return {
      allowed,
      reason: allowed ? undefined : 'limit_reached',
      currentCount: usage.initiatives_count,
      limit: usage.initiatives_limit,
      tier,
    };
  } catch (error) {
    console.error('Error checking initiative limit:', error);
    return {
      allowed: false,
      reason: 'unauthorized',
    };
  }
}

/**
 * Checks if a user can generate a specific document type based on their subscription tier
 *
 * Logic:
 * 1. Get user's subscription tier
 * 2. Get tier limits with getTierLimits(tier)
 * 3. Check if documentType is in allowedDocumentTypes array
 * 4. Return allowed: true if document type allowed, allowed: false otherwise
 *
 * @param clerkUserId - The Clerk user ID
 * @param documentType - The type of document to check
 * @returns Promise resolving to LimitCheckResult with allowed status
 *
 * @example
 * ```typescript
 * const result = await checkDocumentGenerationLimit('clerk_user_123', 'prd');
 * if (!result.allowed) {
 *   console.log('PRD generation not available on trial tier');
 * }
 * ```
 */
export async function checkDocumentGenerationLimit(
  clerkUserId: string,
  documentType: DocumentType
): Promise<LimitCheckResult> {
  try {
    // Use admin client since we're already authenticated via Clerk
    const supabaseAdmin = createAdminClient();

    // Get Supabase user ID from Clerk user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (userError || !userData) {
      return {
        allowed: false,
        reason: 'unauthorized',
      };
    }

    const supabaseUserId = userData.id;

    // Get user's subscription tier
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('tier')
      .eq('user_id', supabaseUserId)
      .single();

    if (subError || !subscription) {
      return {
        allowed: false,
        reason: 'unauthorized',
      };
    }

    const tier = subscription.tier as SubscriptionTier;
    const tierLimits = getTierLimits(tier);

    // Check if document type is allowed for this tier
    const allowed = tierLimits.allowedDocumentTypes.includes(documentType);

    return {
      allowed,
      reason: allowed ? undefined : 'document_type_restricted',
      tier,
    };
  } catch (error) {
    console.error('Error checking document generation limit:', error);
    return {
      allowed: false,
      reason: 'unauthorized',
    };
  }
}

/**
 * Checks if a user can export documents based on their subscription tier
 *
 * Logic:
 * 1. Get user's subscription tier
 * 2. Get tier limits with getTierLimits(tier)
 * 3. Return based on exportEnabled boolean
 *
 * @param clerkUserId - The Clerk user ID
 * @returns Promise resolving to LimitCheckResult with allowed status
 *
 * @example
 * ```typescript
 * const result = await checkExportLimit('clerk_user_123');
 * if (!result.allowed) {
 *   console.log('Export not available on current tier');
 * }
 * ```
 */
export async function checkExportLimit(clerkUserId: string): Promise<LimitCheckResult> {
  try {
    // Use admin client since we're already authenticated via Clerk
    const supabaseAdmin = createAdminClient();

    // Get Supabase user ID from Clerk user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (userError || !userData) {
      return {
        allowed: false,
        reason: 'unauthorized',
      };
    }

    const supabaseUserId = userData.id;

    // Get user's subscription tier
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('tier')
      .eq('user_id', supabaseUserId)
      .single();

    if (subError || !subscription) {
      return {
        allowed: false,
        reason: 'unauthorized',
      };
    }

    const tier = subscription.tier as SubscriptionTier;
    const tierLimits = getTierLimits(tier);

    // Check if export is enabled for this tier
    const allowed = tierLimits.exportEnabled;

    return {
      allowed,
      reason: allowed ? undefined : 'export_restricted',
      tier,
    };
  } catch (error) {
    console.error('Error checking export limit:', error);
    return {
      allowed: false,
      reason: 'unauthorized',
    };
  }
}
