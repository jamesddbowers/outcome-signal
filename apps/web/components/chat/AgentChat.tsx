'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useAgentConversation } from '@/lib/hooks/useAgentConversation';
import { useSendMessage } from '@/lib/hooks/useSendMessage';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AgentChatProps {
  initiativeId: string;
}

export function AgentChat({ initiativeId }: AgentChatProps): JSX.Element {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch conversation data
  const { data: conversation, isLoading } = useAgentConversation(initiativeId);

  // Send message mutation
  const { mutate: sendMessage, isPending: isSending } = useSendMessage(initiativeId);

  const messages = useMemo(() => conversation?.messages || [], [conversation?.messages]);

  // Set up Supabase Realtime subscription for live updates
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`agent_conversations:${initiativeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_conversations',
          filter: `initiative_id=eq.${initiativeId}`,
        },
        () => {
          // Invalidate query to refetch conversation data
          queryClient.invalidateQueries({
            queryKey: ['agent-conversation', initiativeId],
          });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [initiativeId, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (message: string): void => {
    sendMessage(message);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Screen reader announcements for new messages */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {messages.length > 0 && `${messages.length} messages in conversation`}
      </div>

      <ScrollArea className="flex-1 overflow-auto px-4 py-4" ref={scrollAreaRef}>
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-2" role="log" aria-label="Chat messages">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="flex-shrink-0">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading || isSending}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
