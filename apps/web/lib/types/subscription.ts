/**
 * Subscription and Usage Tracking Types
 * Story 3.1: Create Subscription Tier Data Model
 *
 * Type definitions for subscription management and usage tracking.
 */

import type { SubscriptionTier } from '../constants/subscription-tiers';

/**
 * Subscription status values
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due';

/**
 * Subscription record from database
 * Represents a user's current subscription tier and billing status
 */
export interface Subscription {
  /** Unique identifier */
  id: string;
  /** User ID (foreign key to users table) */
  user_id: string;
  /** Current subscription tier */
  tier: SubscriptionTier;
  /** Current subscription status */
  status: SubscriptionStatus;
  /** Stripe subscription ID (for paid tiers) */
  stripe_subscription_id: string | null;
  /** Stripe customer ID */
  stripe_customer_id: string | null;
  /** Trial expiration timestamp (for trial tier) */
  trial_ends_at: string | null;
  /** Current billing period start */
  current_period_start: string;
  /** Current billing period end */
  current_period_end: string;
  /** Record creation timestamp */
  created_at: string;
  /** Record last update timestamp */
  updated_at: string;
}

/**
 * Usage tracking record from database
 * Tracks monthly resource consumption against tier limits
 */
export interface UsageTracking {
  /** Unique identifier */
  id: string;
  /** User ID (foreign key to users table) */
  user_id: string;
  /** Month in YYYY-MM format (e.g., '2025-10') */
  month: string;
  /** Number of AI credits used this month */
  credits_used: number;
  /** Maximum AI credits allowed for this month */
  credits_limit: number;
  /** Number of initiatives created this month */
  initiatives_count: number;
  /** Maximum initiatives allowed for this month */
  initiatives_limit: number;
  /** Record creation timestamp */
  created_at: string;
  /** Record last update timestamp */
  updated_at: string;
}

/**
 * Input type for inserting new usage tracking records
 * Omits auto-generated fields
 */
export interface UsageTrackingInsert {
  /** User ID */
  user_id: string;
  /** Month in YYYY-MM format */
  month: string;
  /** Initial credits used (defaults to 0) */
  credits_used?: number;
  /** Credits limit for the month */
  credits_limit: number;
  /** Initial initiatives count (defaults to 0) */
  initiatives_count?: number;
  /** Initiatives limit for the month */
  initiatives_limit: number;
}

/**
 * Input type for updating existing usage tracking records
 * All fields optional except where business logic requires
 */
export interface UsageTrackingUpdate {
  /** Updated credits used */
  credits_used?: number;
  /** Updated credits limit (if tier changed mid-month) */
  credits_limit?: number;
  /** Updated initiatives count */
  initiatives_count?: number;
  /** Updated initiatives limit (if tier changed mid-month) */
  initiatives_limit?: number;
}

/**
 * Monthly usage summary with calculated fields
 * Useful for displaying usage status to users
 */
export interface UsageSummary {
  /** Month in YYYY-MM format */
  month: string;
  /** Credits usage information */
  credits: {
    used: number;
    limit: number;
    remaining: number;
    percentUsed: number;
    isUnlimited: boolean;
  };
  /** Initiatives usage information */
  initiatives: {
    count: number;
    limit: number;
    remaining: number;
    percentUsed: number;
    isUnlimited: boolean;
  };
  /** Whether user has exceeded any limits */
  isOverLimit: boolean;
}

/**
 * Helper function to convert UsageTracking to UsageSummary
 *
 * @param usage - Raw usage tracking record from database
 * @returns Formatted usage summary with calculated fields
 *
 * @example
 * ```typescript
 * const summary = toUsageSummary(usageRecord);
 * console.log(`Credits: ${summary.credits.percentUsed}% used`);
 * ```
 */
export function toUsageSummary(usage: UsageTracking): UsageSummary {
  const creditsIsUnlimited = usage.credits_limit === -1;
  const initiativesIsUnlimited = usage.initiatives_limit === -1;

  const creditsRemaining = creditsIsUnlimited
    ? Infinity
    : Math.max(0, usage.credits_limit - usage.credits_used);

  const initiativesRemaining = initiativesIsUnlimited
    ? Infinity
    : Math.max(0, usage.initiatives_limit - usage.initiatives_count);

  const creditsPercentUsed = creditsIsUnlimited
    ? 0
    : Math.min(100, (usage.credits_used / usage.credits_limit) * 100);

  const initiativesPercentUsed = initiativesIsUnlimited
    ? 0
    : Math.min(100, (usage.initiatives_count / usage.initiatives_limit) * 100);

  const isOverLimit =
    (!creditsIsUnlimited && usage.credits_used > usage.credits_limit) ||
    (!initiativesIsUnlimited && usage.initiatives_count > usage.initiatives_limit);

  return {
    month: usage.month,
    credits: {
      used: usage.credits_used,
      limit: usage.credits_limit,
      remaining: creditsRemaining === Infinity ? -1 : creditsRemaining,
      percentUsed: Math.round(creditsPercentUsed),
      isUnlimited: creditsIsUnlimited,
    },
    initiatives: {
      count: usage.initiatives_count,
      limit: usage.initiatives_limit,
      remaining: initiativesRemaining === Infinity ? -1 : initiativesRemaining,
      percentUsed: Math.round(initiativesPercentUsed),
      isUnlimited: initiativesIsUnlimited,
    },
    isOverLimit,
  };
}

/**
 * Helper function to get current month in YYYY-MM format
 *
 * @returns Current month string in format YYYY-MM
 *
 * @example
 * ```typescript
 * const currentMonth = getCurrentMonth(); // '2025-10'
 * ```
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

