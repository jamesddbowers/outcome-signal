'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface RightPanelProps {
  initiativeId: string;
}

export default function RightPanel({ initiativeId }: RightPanelProps): JSX.Element {
  return (
    <Card className="h-full w-full rounded-none border-0 flex flex-col">
      <div className="p-4 pl-14 border-b">
        <h2 className="text-lg font-semibold">Agent Chat</h2>
      </div>
      <div className="p-4 flex-1">
        <p className="text-sm text-muted-foreground">
          Initiative ID: {initiativeId}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Placeholder for agent chat interface (Story 2.4)
        </p>
      </div>
    </Card>
  );
}
