'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export function TypingIndicator(): JSX.Element {
  return (
    <div className="flex mb-4 justify-start">
      <Card className="max-w-[80%] px-4 py-3 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <div className="flex gap-1" aria-label="Agent is typing">
          <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" />
        </div>
      </Card>
    </div>
  );
}
