/**
 * Tests for useSendMessage Hook
 *
 * Verifies that the useSendMessage mutation hook correctly sends messages
 * and invalidates the query cache on success.
 */

import React, { type ReactNode } from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSendMessage } from '../useSendMessage';

describe('useSendMessage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    // Mock fetch globally
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should send message successfully', async () => {
    const mockResponse = {
      message: {
        id: 'msg-123',
        role: 'user',
        content: 'Test message',
        timestamp: '2025-01-01T00:00:00Z',
      },
      conversationId: 'conv-123',
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useSendMessage('init-123'), { wrapper });

    result.current.mutate('Test message');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initiativeId: 'init-123',
        content: 'Test message',
      }),
    });
  });

  it('should handle errors correctly', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to send message' }),
    } as Response);

    const { result } = renderHook(() => useSendMessage('init-123'), { wrapper });

    result.current.mutate('Test message');

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Failed to send message');
  });

  it('should invalidate query cache on success', async () => {
    const mockResponse = {
      message: {
        id: 'msg-123',
        role: 'user',
        content: 'Test message',
        timestamp: '2025-01-01T00:00:00Z',
      },
      conversationId: 'conv-123',
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useSendMessage('init-123'), { wrapper });

    result.current.mutate('Test message');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['agent-conversation', 'init-123'],
    });
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useSendMessage('init-123'), { wrapper });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should set loading state while sending', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolveResponse: any;
    const responsePromise = new Promise((resolve) => {
      resolveResponse = resolve;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(global.fetch).mockReturnValue(responsePromise as any);

    const { result } = renderHook(() => useSendMessage('init-123'), { wrapper });

    result.current.mutate('Test message');

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Resolve the promise
    resolveResponse({
      ok: true,
      json: async () => ({
        message: { id: 'msg-1', role: 'user', content: 'Test', timestamp: '' },
        conversationId: 'conv-1',
      }),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should optimistically update conversation on mutate', async () => {
    const mockResponse = {
      message: {
        id: 'msg-123',
        role: 'user',
        content: 'Test message',
        timestamp: '2025-01-01T00:00:00Z',
      },
      conversationId: 'conv-123',
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Set initial conversation data
    queryClient.setQueryData(['agent-conversation', 'init-123'], {
      id: 'conv-123',
      initiative_id: 'init-123',
      user_id: 'user-123',
      messages: [],
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    });

    const { result } = renderHook(() => useSendMessage('init-123'), { wrapper });

    result.current.mutate('Test message');

    // Check optimistic update happens immediately
    await waitFor(() => {
      const conversationData = queryClient.getQueryData(['agent-conversation', 'init-123']);
      expect(conversationData).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((conversationData as any).messages).toHaveLength(1);
    });
  });

  it('should rollback optimistic update on error', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error' }),
    } as Response);

    // Set initial conversation data
    const initialConversation = {
      id: 'conv-123',
      initiative_id: 'init-123',
      user_id: 'user-123',
      messages: [],
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    queryClient.setQueryData(['agent-conversation', 'init-123'], initialConversation);

    const { result } = renderHook(() => useSendMessage('init-123'), { wrapper });

    result.current.mutate('Test message');

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Check rollback happened
    const conversationData = queryClient.getQueryData(['agent-conversation', 'init-123']);
    expect(conversationData).toEqual(initialConversation);
  });
});
