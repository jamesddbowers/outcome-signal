/**
 * CreateInitiativeButton Component
 * Story 3.3: Enforce Trial Limits
 * Story 3.5: Build Paywall Modal with Tier Comparison
 *
 * Button component that checks subscription limits before allowing initiative creation.
 * Shows paywall modal when user attempts to exceed their initiative limit.
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { checkCanCreateInitiative } from '@/lib/actions/initiatives';
import { Plus } from 'lucide-react';
import { PaywallModal } from '@/components/subscription/PaywallModal';

interface CreateInitiativeButtonProps {
  /** Optional callback when create button is clicked (and allowed) */
  onClick?: () => void;
  /** Optional className for styling */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CreateInitiativeButton({
  onClick,
  className,
  variant = 'default',
  size = 'default',
}: CreateInitiativeButtonProps): JSX.Element {
  const [canCreate, setCanCreate] = React.useState(true);
  const [tooltipMessage, setTooltipMessage] = React.useState('');
  const [isChecking, setIsChecking] = React.useState(true);
  const [showPaywall, setShowPaywall] = React.useState(false);
  const [isTrialActive, setIsTrialActive] = React.useState(true);

  // Check if user can create initiative on mount
  React.useEffect(() => {
    async function checkLimit(): Promise<void> {
      setIsChecking(true);
      console.log('[CreateInitiativeButton] Starting limit check...');
      try {
        const result = await checkCanCreateInitiative();

        console.log('[CreateInitiativeButton] Limit check result:', {
          allowed: result.allowed,
          reason: result.reason,
          currentCount: result.currentCount,
          limit: result.limit,
          tier: result.tier,
        });

        setCanCreate(result.allowed);
        setIsTrialActive(result.reason !== 'trial_expired');

        if (!result.allowed) {
          // Set tooltip message based on reason - clicking will show paywall
          let message = '';
          if (result.reason === 'trial_expired') {
            message = 'Your trial has expired. Click to upgrade.';
          } else if (result.tier === 'trial') {
            message = 'Initiative limit reached. Click to upgrade.';
          } else if (result.tier === 'starter') {
            message = 'Initiative limit reached. Click to upgrade.';
          } else {
            message = "You've reached your initiative limit. Click to upgrade.";
          }
          setTooltipMessage(message);
          console.log('[CreateInitiativeButton] Button will show paywall. Tooltip:', message);
        } else {
          console.log('[CreateInitiativeButton] Button enabled');
        }
      } catch (error) {
        console.error('[CreateInitiativeButton] Error checking initiative limit:', error);
        // Allow creation on error (fail open)
        setCanCreate(true);
      } finally {
        setIsChecking(false);
      }
    }

    void checkLimit();
  }, []);

  const handleClick = (): void => {
    if (canCreate && onClick) {
      // User is allowed to create - proceed with normal flow
      onClick();
    } else if (!canCreate) {
      // User is at limit - show paywall modal
      setShowPaywall(true);
    }
  };

  // If button is at limit, wrap in tooltip but keep it clickable
  if (!canCreate) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleClick}
                disabled={isChecking}
                className={className}
                variant={variant}
                size={size}
                aria-label="Create Initiative - Limit Reached"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Initiative
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Paywall Modal */}
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          trigger_reason="initiative_limit"
          canDismiss={isTrialActive}
        />
      </>
    );
  }

  // Button is enabled
  return (
    <Button
      onClick={handleClick}
      disabled={isChecking}
      className={className}
      variant={variant}
      size={size}
      aria-label="Create Initiative"
    >
      <Plus className="h-4 w-4 mr-2" />
      {isChecking ? 'Checking...' : 'Create Initiative'}
    </Button>
  );
}
