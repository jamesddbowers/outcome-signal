'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TipTapEditor from '@/components/preview/TipTapEditor';
import { useDocument } from '@/lib/hooks/useDocument';

interface MiddlePanelProps {
  initiativeId: string;
  epicId?: string;
}

export default function MiddlePanel({
  initiativeId,
  epicId,
}: MiddlePanelProps): JSX.Element {
  const { data: content, isLoading, error } = useDocument(initiativeId, epicId);

  return (
    <Card className="h-full w-full rounded-none border-0 flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Document Preview</h2>
        {epicId && (
          <p className="text-xs text-muted-foreground mt-1">
            Epic: {epicId}
          </p>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {isLoading && (
          <div className="p-6 space-y-4" data-testid="loading-skeleton">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-6 w-2/3 mt-6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}

        {error && (
          <div
            className="p-6 text-center"
            data-testid="error-state"
            role="alert"
          >
            <p className="text-sm text-destructive font-medium">
              Error loading document
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {!isLoading && !error && !content && (
          <div className="p-6 text-center" data-testid="empty-state">
            <p className="text-sm text-muted-foreground">
              No document available
            </p>
          </div>
        )}

        {!isLoading && !error && content && (
          <TipTapEditor content={content} />
        )}
      </div>
    </Card>
  );
}
