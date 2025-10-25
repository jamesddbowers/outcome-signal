/**
 * CreateInitiativeButton Component
 * Story 3.3: Enforce Trial Limits
 *
 * Button component that checks subscription limits before allowing initiative creation
 * Disables button and shows tooltip when user is at their initiative limit
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { checkCanCreateInitiative } from '@/lib/actions/initiatives';
import { Plus } from 'lucide-react';

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

        if (!result.allowed) {
          // Set tooltip message based on tier
          if (result.tier === 'trial') {
            setTooltipMessage('Upgrade to Starter to create up to 3 Initiatives/month');
          } else if (result.tier === 'starter') {
            setTooltipMessage('Upgrade to Professional for unlimited Initiatives');
          } else {
            setTooltipMessage("You've reached your initiative limit");
          }
          console.log('[CreateInitiativeButton] Button disabled. Tooltip:', tooltipMessage);
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
      onClick();
    }
  };

  // If button is disabled, wrap in tooltip
  if (!canCreate) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={handleClick}
                disabled={!canCreate || isChecking}
                className={className}
                variant={variant}
                size={size}
                aria-label="Create Initiative - Limit Reached"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Initiative
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
