/**
 * Tests for useInitiatives Hook
 *
 * Verifies that the useInitiatives hook correctly fetches and returns initiative data
 * using React Query, with proper loading, success, and error states.
 */

import React, { type ReactNode } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInitiatives } from '../useInitiatives';

// Mock Clerk's useSession hook
vi.mock('@clerk/nextjs', () => ({
  useSession: vi.fn(() => ({
    session: {
      getToken: vi.fn(() => Promise.resolve('mock-clerk-token')),
    },
  })),
}));

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClerkSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            data: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                title: 'Customer Portal MVP',
                description: 'Building a customer-facing portal',
                status: 'active',
                phase: 'planning',
                phase_progress: 37,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ],
            error: null,
          })),
        })),
      })),
    })),
  })),
}));

describe('useInitiatives', () => {
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
    const { result } = renderHook(() => useInitiatives(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should return data on successful fetch', async () => {
    const { result } = renderHook(() => useInitiatives(), { wrapper });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data!.length).toBeGreaterThan(0);

    // Verify data structure
    const initiative = result.current.data![0];
    expect(initiative).toHaveProperty('id');
    expect(initiative).toHaveProperty('title');
    expect(initiative).toHaveProperty('status');
    expect(initiative.status).toBe('active'); // Mock service only returns active initiatives
  });

  it('should use correct query key', () => {
    renderHook(() => useInitiatives(), { wrapper });

    // Access the query from the cache
    const queries = queryClient.getQueryCache().getAll();
    const initiativesQuery = queries.find((q) =>
      JSON.stringify(q.queryKey) === JSON.stringify(['initiatives'])
    );

    expect(initiativesQuery).toBeDefined();
  });

  it('should cache data between renders', async () => {
    const { result, rerender } = renderHook(() => useInitiatives(), { wrapper });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    // Rerender the hook
    rerender();

    // Data should be the same (cached)
    expect(result.current.data).toBe(firstData);
    expect(result.current.isLoading).toBe(false);
  });
});
