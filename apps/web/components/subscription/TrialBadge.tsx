/**
 * Trial Badge Component
 * Story 3.2: Implement Trial Signup Flow
 *
 * Displays trial status badge in dashboard header for users on trial tier.
 */

'use client';

import React from 'react';
import {
  calculateTrialDaysRemaining,
  formatTrialStatus,
} from '@/lib/utils/subscription-helpers';
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/lib/supabase/database.types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface TrialBadgeProps {
  subscription: Subscription | null;
}

/**
 * Client component that displays trial subscription status
 *
 * @param subscription - The user's subscription object
 * @returns Trial status badge or null if user is not on trial tier
 *
 * @example
 * ```tsx
 * <TrialBadge subscription={subscription} />
 * // Renders: <Badge>Trial: 6 days remaining</Badge>
 * ```
 */
export default function TrialBadge({ subscription }: TrialBadgeProps): JSX.Element | null {
  // Don't render badge if no subscription or not on trial tier
  if (!subscription || subscription.tier !== 'trial') {
    return null;
  }

  // Check if trial is expired
  if (subscription.status === 'expired') {
    return (
      <Badge variant="destructive" className="bg-red-600 text-white">
        Trial Expired - Upgrade Required
      </Badge>
    );
  }

  // Calculate days remaining
  const daysRemaining = calculateTrialDaysRemaining(subscription.trial_ends_at);

  // Handle null case (shouldn't happen for trial tier, but safety check)
  if (daysRemaining === null) {
    return null;
  }

  // Format status text
  const statusText = formatTrialStatus(daysRemaining);

  // Use warning variant when less than 2 days remaining
  const variant = daysRemaining < 2 ? 'destructive' : 'outline';

  return <Badge variant={variant}>{statusText}</Badge>;
}
