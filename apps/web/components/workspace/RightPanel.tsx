'use client';

import React from 'react';
import { AgentChat } from '@/components/chat/AgentChat';

interface RightPanelProps {
  initiativeId: string;
  epicId?: string;
}

export default function RightPanel({ initiativeId }: RightPanelProps): JSX.Element {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 pl-14 border-b flex-shrink-0 bg-background">
        <h2 className="text-lg font-semibold">Agent Chat</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <AgentChat initiativeId={initiativeId} />
      </div>
    </div>
  );
}
