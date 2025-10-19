import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { SendMessageRequest, SendMessageResponse, AgentConversation, ChatMessage } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Sends a message to the chat API
 */
async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await fetch('/api/chat/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }

  return response.json();
}

/**
 * React Query mutation hook for sending messages with optimistic updates
 */
export function useSendMessage(initiativeId: string): UseMutationResult<SendMessageResponse, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      sendMessage({ initiativeId, content }),

    // Optimistically update the UI before the server responds
    onMutate: async (content: string) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: ['agent-conversation', initiativeId],
      });

      // Snapshot the previous value
      const previousConversation = queryClient.getQueryData<AgentConversation | null>([
        'agent-conversation',
        initiativeId,
      ]);

      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      // Optimistically update the conversation
      queryClient.setQueryData<AgentConversation | null>(
        ['agent-conversation', initiativeId],
        (old) => {
          if (!old) {
            // If no conversation exists, create a minimal one for optimistic display
            return {
              id: 'temp-id',
              initiative_id: initiativeId,
              user_id: 'temp-user-id',
              messages: [optimisticMessage],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as AgentConversation;
          }

          return {
            ...old,
            messages: [...old.messages, optimisticMessage],
            updated_at: new Date().toISOString(),
          };
        }
      );

      // Return context with previous conversation for rollback
      return { previousConversation };
    },

    // On error, roll back to the previous value
    onError: (_err, _content, context) => {
      if (context?.previousConversation !== undefined) {
        queryClient.setQueryData(
          ['agent-conversation', initiativeId],
          context.previousConversation
        );
      }
    },

    // Always refetch after error or success to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['agent-conversation', initiativeId],
      });
    },
  });
}
