'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface LeftPanelProps {
  initiativeId: string;
}

export default function LeftPanel({ initiativeId }: LeftPanelProps): JSX.Element {
  return (
    <Card className="h-full w-full rounded-none border-0 flex flex-col">
      <div className="p-4 pr-14 border-b">
        <h2 className="text-lg font-semibold">Hierarchy Tree</h2>
      </div>
      <div className="p-4 flex-1">
        <p className="text-sm text-muted-foreground">
          Initiative ID: {initiativeId}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Placeholder for hierarchy tree navigation (Story 2.2)
        </p>
      </div>
    </Card>
  );
}
