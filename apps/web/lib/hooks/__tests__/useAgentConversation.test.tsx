/**
 * Tests for useAgentConversation Hook
 *
 * Verifies that the useAgentConversation hook correctly fetches conversation data
 * using React Query, with proper loading, success, and error states.
 */

import React, { type ReactNode } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAgentConversation } from '../useAgentConversation';

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({
              data: null,
              error: { code: 'PGRST116' }, // No rows found
            })
          ),
        })),
      })),
    })),
  })),
}));

describe('useAgentConversation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test to ensure isolation
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for tests
        },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useAgentConversation('init-123'), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should return null when no conversation exists', async () => {
    const { result } = renderHook(() => useAgentConversation('init-123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  it('should not fetch if initiativeId is empty', () => {
    const { result } = renderHook(() => useAgentConversation(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('should use correct query key', () => {
    const initiativeId = 'init-123';
    renderHook(() => useAgentConversation(initiativeId), { wrapper });

    // Query key should include initiative ID
    const queries = queryClient.getQueryCache().getAll();
    expect(queries.length).toBeGreaterThan(0);
    expect(queries[0].queryKey).toEqual(['agent-conversation', initiativeId]);
  });

  it('should refetch when initiativeId changes', async () => {
    const { result, rerender } = renderHook(
      ({ id }) => useAgentConversation(id),
      {
        wrapper,
        initialProps: { id: 'init-123' },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Change initiative ID
    rerender({ id: 'init-456' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });
});
