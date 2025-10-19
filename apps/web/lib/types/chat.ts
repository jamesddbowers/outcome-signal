/**
 * Message role types for agent conversations
 */
export type MessageRole = 'user' | 'agent' | 'system';

/**
 * Individual chat message structure
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO 8601 format
}

/**
 * Agent conversation database record
 */
export interface AgentConversation {
  id: string;
  initiative_id: string;
  user_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

/**
 * Request payload for sending a message
 */
export interface SendMessageRequest {
  initiativeId: string;
  content: string;
}

/**
 * Response payload for message sending
 */
export interface SendMessageResponse {
  message: ChatMessage;
  conversationId: string;
}
