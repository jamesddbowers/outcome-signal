/**
 * Subscription Helper Functions
 * Story 3.2: Implement Trial Signup Flow
 *
 * Utilities for calculating and formatting trial subscription status.
 */

/**
 * Calculate the number of days remaining in a trial period
 *
 * @param trial_ends_at - ISO 8601 timestamp string when the trial ends, or null
 * @returns Number of days remaining (rounded up), 0 if expired, or null if no trial
 *
 * @example
 * ```typescript
 * const daysLeft = calculateTrialDaysRemaining('2025-10-28T12:00:00Z');
 * console.log(daysLeft); // 6 (if called on Oct 22)
 * ```
 */
export function calculateTrialDaysRemaining(
  trial_ends_at: string | null
): number | null {
  if (!trial_ends_at) {
    return null;
  }

  const now = new Date();
  const trialEnd = new Date(trial_ends_at);
  const diffMs = trialEnd.getTime() - now.getTime();

  // If trial has expired, return 0
  if (diffMs < 0) {
    return 0;
  }

  // Calculate days remaining, rounded up
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return daysRemaining;
}

/**
 * Format trial status for display in UI
 *
 * @param daysRemaining - Number of days remaining in trial period
 * @returns Formatted status string for display
 *
 * @example
 * ```typescript
 * formatTrialStatus(6); // "Trial: 6 days remaining"
 * formatTrialStatus(1); // "Trial: 1 day remaining"
 * formatTrialStatus(0); // "Trial expired"
 * ```
 */
export function formatTrialStatus(daysRemaining: number): string {
  if (daysRemaining === 0) {
    return 'Trial expired';
  }

  const dayWord = daysRemaining === 1 ? 'day' : 'days';
  return `Trial: ${daysRemaining} ${dayWord} remaining`;
}
