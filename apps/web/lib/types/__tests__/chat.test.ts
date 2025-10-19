import { describe, it, expect, expectTypeOf } from 'vitest';
import type { MessageRole, ChatMessage, AgentConversation, SendMessageRequest, SendMessageResponse } from '../chat';

describe('Chat Types', () => {
  describe('MessageRole', () => {
    it('should allow valid message roles', () => {
      const userRole: MessageRole = 'user';
      const agentRole: MessageRole = 'agent';
      const systemRole: MessageRole = 'system';

      expect(userRole).toBe('user');
      expect(agentRole).toBe('agent');
      expect(systemRole).toBe('system');
    });

    it('should enforce type constraints', () => {
      expectTypeOf<MessageRole>().toEqualTypeOf<'user' | 'agent' | 'system'>();
    });
  });

  describe('ChatMessage', () => {
    it('should have correct structure', () => {
      const message: ChatMessage = {
        id: 'msg-123',
        role: 'user',
        content: 'Hello agent',
        timestamp: '2025-01-01T00:00:00Z',
      };

      expect(message.id).toBe('msg-123');
      expect(message.role).toBe('user');
      expect(message.content).toBe('Hello agent');
      expect(message.timestamp).toBe('2025-01-01T00:00:00Z');
    });

    it('should enforce required fields', () => {
      expectTypeOf<ChatMessage>().toHaveProperty('id').toBeString();
      expectTypeOf<ChatMessage>().toHaveProperty('role').toEqualTypeOf<MessageRole>();
      expectTypeOf<ChatMessage>().toHaveProperty('content').toBeString();
      expectTypeOf<ChatMessage>().toHaveProperty('timestamp').toBeString();
    });
  });

  describe('AgentConversation', () => {
    it('should have correct structure', () => {
      const conversation: AgentConversation = {
        id: 'conv-123',
        initiative_id: 'init-456',
        user_id: 'user-789',
        messages: [],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      expect(conversation.id).toBe('conv-123');
      expect(conversation.initiative_id).toBe('init-456');
      expect(conversation.user_id).toBe('user-789');
      expect(conversation.messages).toEqual([]);
    });

    it('should allow messages array', () => {
      const conversation: AgentConversation = {
        id: 'conv-123',
        initiative_id: 'init-456',
        user_id: 'user-789',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2025-01-01T00:00:00Z',
          },
        ],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      expect(conversation.messages).toHaveLength(1);
      expect(conversation.messages[0].role).toBe('user');
    });
  });

  describe('SendMessageRequest', () => {
    it('should have correct structure', () => {
      const request: SendMessageRequest = {
        initiativeId: 'init-123',
        content: 'Test message',
      };

      expect(request.initiativeId).toBe('init-123');
      expect(request.content).toBe('Test message');
    });
  });

  describe('SendMessageResponse', () => {
    it('should have correct structure', () => {
      const response: SendMessageResponse = {
        message: {
          id: 'msg-123',
          role: 'user',
          content: 'Test',
          timestamp: '2025-01-01T00:00:00Z',
        },
        conversationId: 'conv-456',
      };

      expect(response.conversationId).toBe('conv-456');
      expect(response.message.id).toBe('msg-123');
    });
  });
});
