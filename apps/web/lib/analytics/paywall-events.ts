/**
 * Paywall Analytics Event Tracking
 * Story 3.5: Build Paywall Modal with Tier Comparison
 *
 * Tracks user interactions with the paywall modal for analytics and monitoring.
 * Currently uses console.log for MVP; will be replaced with actual analytics
 * service integration in future stories.
 */

import type { SubscriptionTier } from '@/lib/constants/subscription-tiers';

/**
 * Reasons why the paywall modal is triggered
 */
export type PaywallTriggerReason =
  | 'trial_expired'
  | 'initiative_limit'
  | 'document_limit'
  | 'export_limit';

/**
 * Tracks when the paywall modal is shown to the user
 *
 * @param trigger_reason - The reason why the paywall was triggered
 *
 * @example
 * ```typescript
 * trackPaywallShown('initiative_limit');
 * ```
 */
export function trackPaywallShown(trigger_reason: PaywallTriggerReason): void {
  console.log('[Analytics] Paywall Shown', {
    trigger_reason,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Tracks when the paywall modal is dismissed by the user
 *
 * @param trigger_reason - The reason why the paywall was originally triggered
 *
 * @example
 * ```typescript
 * trackPaywallDismissed('initiative_limit');
 * ```
 */
export function trackPaywallDismissed(trigger_reason: PaywallTriggerReason): void {
  console.log('[Analytics] Paywall Dismissed', {
    trigger_reason,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Tracks when a user selects a subscription plan from the paywall
 *
 * @param tier - The subscription tier that was selected
 * @param trigger_reason - The reason why the paywall was originally triggered
 *
 * @example
 * ```typescript
 * trackPlanSelected('professional', 'initiative_limit');
 * ```
 */
export function trackPlanSelected(
  tier: SubscriptionTier,
  trigger_reason: PaywallTriggerReason
): void {
  console.log('[Analytics] Plan Selected', {
    tier,
    trigger_reason,
    timestamp: new Date().toISOString(),
  });
}
