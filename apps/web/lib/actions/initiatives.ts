/**
 * Initiative Server Actions
 * Story 3.3: Enforce Trial Limits
 *
 * Server actions for initiative management and limit checking
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { checkInitiativeLimit, type LimitCheckResult } from '@/lib/utils/subscription-limits';

/**
 * Extended result type for initiative creation check
 * Includes current count and limit for UI display
 */
export interface CheckCanCreateInitiativeResult extends LimitCheckResult {
  /** Current count of initiatives created this month */
  currentCount?: number;
  /** Maximum initiatives allowed for this tier */
  limit?: number;
}

/**
 * Server action to check if the current user can create a new initiative
 *
 * This action:
 * 1. Gets the authenticated user's ID from Clerk
 * 2. Calls checkInitiativeLimit to verify against subscription tier limits
 * 3. Returns result with current count and limit for UI display
 *
 * @returns Promise resolving to CheckCanCreateInitiativeResult
 *
 * @example
 * ```typescript
 * // In a React component
 * const result = await checkCanCreateInitiative();
 * if (!result.allowed) {
 *   setButtonDisabled(true);
 *   setTooltipMessage('Upgrade to Starter to create up to 3 Initiatives/month');
 * }
 * ```
 */
export async function checkCanCreateInitiative(): Promise<CheckCanCreateInitiativeResult> {
  console.log('[checkCanCreateInitiative] Server action called');
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();

    console.log('[checkCanCreateInitiative] Clerk userId:', userId);

    if (!userId) {
      console.log('[checkCanCreateInitiative] No userId, returning unauthorized');
      return {
        allowed: false,
        reason: 'unauthorized',
      };
    }

    // Check initiative limit
    console.log('[checkCanCreateInitiative] Calling checkInitiativeLimit...');
    const result = await checkInitiativeLimit(userId);

    console.log('[checkCanCreateInitiative] Result from checkInitiativeLimit:', result);

    return {
      allowed: result.allowed,
      reason: result.reason,
      currentCount: result.currentCount,
      limit: result.limit,
      tier: result.tier,
    };
  } catch (error) {
    console.error('[checkCanCreateInitiative] Error:', error);
    return {
      allowed: false,
      reason: 'unauthorized',
    };
  }
}
