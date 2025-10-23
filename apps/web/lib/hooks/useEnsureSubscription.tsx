/**
 * useEnsureSubscription Hook
 * Story 3.2: Implement Trial Signup Flow
 *
 * Ensures that the current user has a subscription record.
 * If no subscription exists, creates a trial subscription automatically.
 * This is a fallback for local development where Clerk webhooks don't fire.
 */

'use client';

import { useEffect, useState } from 'react';
import { getUserSubscription, createTrialSubscriptionIfNeeded } from '@/lib/actions/subscription';
import type { Database } from '@/lib/supabase/database.types';

interface UseEnsureSubscriptionResult {
  isLoading: boolean;
  subscription: Database['public']['Tables']['subscriptions']['Row'] | null;
  error: string | null;
}

/**
 * Hook that ensures user has a subscription, creating one if needed
 *
 * @returns Loading state, subscription object, and any errors
 *
 * @example
 * ```tsx
 * const { isLoading, subscription, error } = useEnsureSubscription();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <Error message={error} />;
 * if (!subscription) return <ErrorState />;
 *
 * return <Dashboard subscription={subscription} />;
 * ```
 */
export function useEnsureSubscription(): UseEnsureSubscriptionResult {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Database['public']['Tables']['subscriptions']['Row'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function ensureSubscription(): Promise<void> {
      try {
        // Check if subscription already exists
        const existingSubscription = await getUserSubscription();

        if (existingSubscription) {
          if (isMounted) {
            setSubscription(existingSubscription);
            setIsLoading(false);
          }
          return;
        }

        // No subscription found - create trial subscription
        console.log('[useEnsureSubscription] No subscription found, creating trial...');
        const newSubscription = await createTrialSubscriptionIfNeeded();

        if (newSubscription) {
          if (isMounted) {
            setSubscription(newSubscription);
            setIsLoading(false);
          }
        } else {
          if (isMounted) {
            setError('Failed to create subscription');
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('[useEnsureSubscription] Error:', err);
        if (isMounted) {
          setError('An error occurred while setting up your subscription');
          setIsLoading(false);
        }
      }
    }

    void ensureSubscription();

    return () => {
      isMounted = false;
    };
  }, []); // Run once on mount

  return { isLoading, subscription, error };
}
