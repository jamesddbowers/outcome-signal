'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessageType;
  showTimestamp?: boolean;
}

export function ChatMessage({ message, showTimestamp = false }: ChatMessageProps): JSX.Element {
  const { role, content, timestamp } = message;

  // Format timestamp as relative time
  const formattedTime = showTimestamp
    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    : null;

  // Style based on message role
  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <p className="text-sm italic text-gray-500 dark:text-gray-400">
          {content}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card
        className={`max-w-[80%] px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        {showTimestamp && formattedTime && (
          <p
            className={`text-xs mt-1 ${
              isUser
                ? 'text-blue-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {formattedTime}
          </p>
        )}
      </Card>
    </div>
  );
}
