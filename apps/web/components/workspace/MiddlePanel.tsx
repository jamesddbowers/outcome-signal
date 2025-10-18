'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface MiddlePanelProps {
  initiativeId: string;
}

export default function MiddlePanel({ initiativeId }: MiddlePanelProps): JSX.Element {
  return (
    <Card className="h-full w-full rounded-none border-0 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Document Preview</h2>
      </div>
      <div className="p-4 flex-1">
        <p className="text-sm text-muted-foreground">
          Initiative ID: {initiativeId}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Placeholder for document preview with TipTap editor (Story 2.3)
        </p>
      </div>
    </Card>
  );
}
