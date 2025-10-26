/**
 * Paywall Modal Component
 * Story 3.4: Track Trial Expiration and Auto-Expire (Minimal Version)
 *
 * Displays upgrade prompt when users hit subscription limits or trial expires.
 * This is a minimal implementation for Story 3.4 - will be enhanced in Story 3.5.
 */

'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export type PaywallTriggerReason =
  | 'trial_expired'
  | 'initiative_limit'
  | 'document_limit'
  | 'export_limit';

export interface PaywallModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close (if dismissible) */
  onClose: () => void;
  /** Why the paywall is being shown */
  trigger_reason: PaywallTriggerReason;
  /** Whether user can dismiss the modal (false for expired trials) */
  canDismiss?: boolean;
}

/**
 * Minimal Paywall Modal for Story 3.4
 * Shows upgrade prompt based on trigger reason
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback for closing modal (only called if canDismiss is true)
 * @param trigger_reason - Why the paywall is being shown
 * @param canDismiss - Whether modal can be dismissed (default: true, false for trial_expired)
 *
 * @example
 * ```tsx
 * <PaywallModal
 *   isOpen={showPaywall}
 *   onClose={() => setShowPaywall(false)}
 *   trigger_reason="trial_expired"
 *   canDismiss={false}
 * />
 * ```
 */
export function PaywallModal({
  isOpen,
  onClose,
  trigger_reason,
  canDismiss = true,
}: PaywallModalProps): JSX.Element {
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
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
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

        <div className="mt-4 space-y-4">
          {/* Minimal tier display - will be enhanced in Story 3.5 */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-semibold">Upgrade to Continue</h3>
            <p className="text-sm text-muted-foreground">
              Choose a plan that fits your needs and continue using OutcomeSignal.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            {canDismiss && (
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
            )}
            <Button onClick={() => console.log('Navigate to pricing')}>View Plans</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
