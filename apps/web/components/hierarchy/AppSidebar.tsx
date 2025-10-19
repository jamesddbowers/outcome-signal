/**
 * AppSidebar Component
 *
 * Hierarchy navigation sidebar displaying Initiatives and Epics.
 * Designed to work within a resizable Panel component.
 *
 * Features:
 * - Displays Initiatives as expandable nodes
 * - Shows Epics nested under Initiatives
 * - Active node highlighting based on current route
 * - Keyboard navigation support
 * - Loading and error states
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { useInitiatives, type Initiative } from '@/lib/hooks/useInitiatives';
import { useEpics } from '@/lib/hooks/useEpics';
import { cn } from '@/lib/utils';

export function AppSidebar(): JSX.Element {
  const pathname = usePathname();
  const { data: initiatives, isLoading, isError } = useInitiatives();

  // Parse active initiative and epic from pathname
  const activeInitiativeId = pathname.match(/\/initiatives\/([^/]+)/)?.[1];
  const activeEpicId = pathname.match(/\/epics\/([^/]+)/)?.[1];

  // Track which initiatives are expanded
  const [expandedInitiatives, setExpandedInitiatives] = React.useState<Set<string>>(new Set());

  // Auto-expand initiative if it contains the active epic
  React.useEffect(() => {
    if (activeInitiativeId && !expandedInitiatives.has(activeInitiativeId)) {
      setExpandedInitiatives((prev) => new Set(prev).add(activeInitiativeId));
    }
  }, [activeInitiativeId, expandedInitiatives]);

  const toggleInitiative = (initiativeId: string): void => {
    setExpandedInitiatives((prev) => {
      const next = new Set(prev);
      if (next.has(initiativeId)) {
        next.delete(initiativeId);
      } else {
        next.add(initiativeId);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">Projects</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="px-2 py-2 text-sm text-destructive">
              Failed to load initiatives. Please try again.
            </div>
          )}

          {/* Initiatives and Epics */}
          {!isLoading && !isError && initiatives && (
            <div className="space-y-1">
              {initiatives.map((initiative) => (
                <InitiativeItem
                  key={initiative.id}
                  initiative={initiative}
                  isActive={initiative.id === activeInitiativeId}
                  isExpanded={expandedInitiatives.has(initiative.id)}
                  onToggle={() => toggleInitiative(initiative.id)}
                  activeEpicId={activeEpicId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface InitiativeItemProps {
  initiative: Initiative;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  activeEpicId?: string;
}

function InitiativeItem({
  initiative,
  isActive,
  isExpanded,
  onToggle,
  activeEpicId,
}: InitiativeItemProps): JSX.Element {
  const { data: epics, isLoading: epicsLoading } = useEpics(initiative.id);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="flex items-center gap-1">
        {/* Expand/Collapse Trigger */}
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label={isExpanded ? 'Collapse initiative' : 'Expand initiative'}
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </Button>
        </CollapsibleTrigger>

        {/* Initiative Link */}
        <Link
          href={`/dashboard/initiatives/${initiative.id}`}
          className={cn(
            'flex-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors',
            isActive && 'bg-accent text-accent-foreground'
          )}
        >
          <span className="truncate block">{initiative.title}</span>
        </Link>
      </div>

      {/* Epics Sub-menu */}
      <CollapsibleContent>
        <div className="ml-9 mt-1 space-y-1">
          {epicsLoading && (
            <div className="space-y-1 px-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-full" />
            </div>
          )}

          {!epicsLoading && epics && epics.length > 0 && (
            <>
              {epics.map((epic) => (
                <Link
                  key={epic.id}
                  href={`/dashboard/initiatives/${initiative.id}/epics/${epic.id}`}
                  className={cn(
                    'block px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors',
                    epic.id === activeEpicId && 'bg-accent text-accent-foreground'
                  )}
                >
                  <span className="truncate block">
                    {epic.epic_number}. {epic.title}
                  </span>
                </Link>
              ))}
            </>
          )}

          {!epicsLoading && epics && epics.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No epics yet</div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
