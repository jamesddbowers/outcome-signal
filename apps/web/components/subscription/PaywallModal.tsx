/**
 * Paywall Modal Component
 * Story 3.5: Build Paywall Modal with Tier Comparison
 *
 * Displays upgrade prompt with full tier comparison when users hit subscription
 * limits or trial expires. Includes analytics tracking and plan selection.
 */

'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { TierComparisonTable } from './TierComparisonTable';
import type { SubscriptionTier } from '@/lib/constants/subscription-tiers';
import {
  trackPaywallShown,
  trackPaywallDismissed,
  trackPlanSelected,
  type PaywallTriggerReason,
} from '@/lib/analytics/paywall-events';

// Re-export PaywallTriggerReason from analytics module for convenience
export type { PaywallTriggerReason };

export interface PaywallModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close (if dismissible) */
  onClose: () => void;
  /** Why the paywall is being shown */
  trigger_reason: PaywallTriggerReason;
  /** Whether user can dismiss the modal (false for expired trials) */
  canDismiss?: boolean;
  /** Optional callback when a plan is selected */
  onSelectPlan?: (tier: SubscriptionTier) => void;
}

/**
 * Enhanced Paywall Modal with Full Tier Comparison
 *
 * Displays upgrade prompt with complete tier comparison table.
 * Includes analytics tracking and plan selection handling.
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback for closing modal (only called if canDismiss is true)
 * @param trigger_reason - Why the paywall is being shown
 * @param canDismiss - Whether modal can be dismissed (default: true, false for trial_expired)
 * @param onSelectPlan - Optional callback when a plan is selected (defaults to console.log)
 *
 * @example
 * ```tsx
 * <PaywallModal
 *   isOpen={showPaywall}
 *   onClose={() => setShowPaywall(false)}
 *   trigger_reason="trial_expired"
 *   canDismiss={false}
 *   onSelectPlan={(tier) => router.push(`/checkout?tier=${tier}`)}
 * />
 * ```
 */
export function PaywallModal({
  isOpen,
  onClose,
  trigger_reason,
  canDismiss = true,
  onSelectPlan,
}: PaywallModalProps): JSX.Element {
  // Track when paywall is shown
  useEffect(() => {
    if (isOpen) {
      trackPaywallShown(trigger_reason);
    }
  }, [isOpen, trigger_reason]);
  // Determine modal content based on trigger reason
  const getModalContent = (): { title: string; description: string } => {
    switch (trigger_reason) {
      case 'trial_expired':
        return {
          title: 'Your Trial Has Expired',
          description:
            'Your 7-day free trial has ended. Upgrade to a paid plan to continue using OutcomeSignal and access all your initiatives.',
        };
      case 'initiative_limit':
        return {
          title: 'Initiative Limit Reached',
          description:
            "You've reached your initiative limit for your current plan. Upgrade to create more initiatives.",
        };
      case 'document_limit':
        return {
          title: 'Document Generation Limit Reached',
          description:
            "You've reached your document generation limit. Upgrade to continue generating documents.",
        };
      case 'export_limit':
        return {
          title: 'Export Not Available',
          description: 'Document export is not available on your current plan. Upgrade to enable export.',
        };
      default:
        return {
          title: 'Upgrade Required',
          description: 'Upgrade your plan to access this feature.',
        };
    }
  };

  const { title, description } = getModalContent();

  // For expired trials, modal cannot be dismissed
  const handleOpenChange = (open: boolean): void => {
    if (canDismiss && !open) {
      trackPaywallDismissed(trigger_reason);
      onClose();
    }
  };

  // Handle plan selection
  const handleSelectPlan = (tier: SubscriptionTier): void => {
    trackPlanSelected(tier, trigger_reason);

    if (onSelectPlan) {
      onSelectPlan(tier);
    } else {
      // Default behavior: Log to console (Story 3.6 will add Stripe integration)
      console.log('Navigate to Stripe Checkout for tier:', tier);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[900px] lg:max-w-[1100px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={canDismiss ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={canDismiss ? undefined : (e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Tier Comparison Table */}
          <TierComparisonTable
            onSelectPlan={handleSelectPlan}
            highlightTier="professional"
          />

          {/* Optional dismiss button for active trials */}
          {canDismiss && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
