'use client';

import React from 'react';
import { useInitiativeProgress } from '@/lib/hooks/useInitiativeProgress';
import { phaseEmojis } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface PhaseIndicatorProps {
  initiativeId: string;
  activeAgent?: string;
}

/**
 * PhaseIndicator displays the current phase, progress, and document breakdown
 * for an initiative. Includes responsive design for desktop, tablet, and mobile.
 */
export function PhaseIndicator({ initiativeId, activeAgent }: PhaseIndicatorProps): JSX.Element {
  const { data, isLoading, error } = useInitiativeProgress(initiativeId);

  if (isLoading) {
    return (
      <div className="border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-2 flex-1" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border-b border-border bg-background px-4 py-3">
        <p className="text-sm text-muted-foreground">Unable to load phase information</p>
      </div>
    );
  }

  const { phase, progress, documents } = data;
  const phaseEmoji = phaseEmojis[phase];
  const phaseName = phase.charAt(0).toUpperCase() + phase.slice(1);

  // Calculate document counts
  const totalDocuments = documents.length;
  const completedCount = documents.filter((d) => d.status === 'completed').length;

  return (
    <div className="border-b border-border bg-background px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Phase Name and Progress (Always Visible) */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                data-testid="phase-indicator"
                aria-label={`${phaseName} Phase - ${progress}% complete`}
              >
                {/* Desktop & Tablet: Full display */}
                <span className="hidden md:inline">
                  {phaseEmoji} {phaseName} Phase
                </span>
                {/* Mobile: Icon only */}
                <span className="md:hidden text-lg">{phaseEmoji}</span>

                <span className="text-muted-foreground">[{progress}%]</span>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              className="max-w-sm"
              aria-label="Phase breakdown"
            >
              <div className="space-y-2">
                <p className="font-semibold">
                  {phaseName} ({totalDocuments} documents)
                </p>
                <ul className="space-y-1 text-sm">
                  {documents.map((doc) => (
                    <li key={doc.type} className="flex items-center gap-2">
                      <StatusIcon status={doc.status} />
                      <span>{doc.name}</span>
                      {doc.status === 'in_progress' && (
                        <span className="text-muted-foreground">(in progress)</span>
                      )}
                      {doc.status === 'pending' && (
                        <span className="text-muted-foreground">(pending)</span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  {completedCount} of {totalDocuments} completed
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Progress Bar (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 items-center gap-2">
          <Progress
            value={progress}
            className="h-2"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress: ${progress}%`}
          />
        </div>

        {/* Active Sub-Agent Indicator (Desktop Only) */}
        {activeAgent && (
          <div className="hidden lg:block text-sm text-muted-foreground">
            Working with {activeAgent}...
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * StatusIcon component to display status indicators
 */
function StatusIcon({ status }: { status: 'completed' | 'in_progress' | 'pending' }): JSX.Element | null {
  switch (status) {
    case 'completed':
      return <span className="text-green-600">✓</span>;
    case 'in_progress':
      return <span className="text-yellow-600">●</span>;
    case 'pending':
      return <span className="text-muted-foreground">○</span>;
    default:
      return null;
  }
}
