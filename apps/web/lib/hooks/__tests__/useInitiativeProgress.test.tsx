import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInitiativeProgress } from '../useInitiativeProgress';
import { createClerkSupabaseClient } from '@/lib/supabase/client';

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
  createClerkSupabaseClient: vi.fn(),
}));

const createWrapper = (): React.ComponentType<{ children: React.ReactNode }> => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';

  return Wrapper;
};

describe('useInitiativeProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches initiative progress successfully', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          phase: 'planning',
          phase_progress: 33,
        },
        error: null,
      }),
    };

    // Mock documents query
    mockSupabase.from = vi.fn((table) => {
      if (table === 'initiatives') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: {
              phase: 'planning',
              phase_progress: 33,
            },
            error: null,
          }),
        };
      } else if (table === 'documents') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [
              { type: 'brief', status: 'approved' },
              { type: 'prd', status: 'draft' },
            ],
            error: null,
          }),
        };
      }
      return mockSupabase;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClerkSupabaseClient).mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useInitiativeProgress('test-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.phase).toBe('planning');
    expect(result.current.data?.progress).toBe(33);
    expect(result.current.data?.documents).toHaveLength(8);
  });

  it('calculates document breakdown correctly', async () => {
    const mockSupabase = {
      from: vi.fn((table) => {
        if (table === 'initiatives') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                phase: 'planning',
                phase_progress: 25,
              },
              error: null,
            }),
          };
        } else if (table === 'documents') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              data: [
                { type: 'brief', status: 'approved' },
                { type: 'prd', status: 'draft' },
              ],
              error: null,
            }),
          };
        }
      }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClerkSupabaseClient).mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useInitiativeProgress('test-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const documents = result.current.data?.documents || [];
    expect(documents).toHaveLength(8);

    const brief = documents.find((d) => d.type === 'brief');
    expect(brief?.status).toBe('completed');

    const prd = documents.find((d) => d.type === 'prd');
    expect(prd?.status).toBe('in_progress');

    const marketResearch = documents.find((d) => d.type === 'market_research');
    expect(marketResearch?.status).toBe('pending');
  });

  it('handles loading state', () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(() => new Promise(() => {})), // Never resolves
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClerkSupabaseClient).mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useInitiativeProgress('test-id'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('handles initiative fetch error', async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClerkSupabaseClient).mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useInitiativeProgress('test-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('handles documents fetch error', async () => {
    const mockSupabase = {
      from: vi.fn((table) => {
        if (table === 'initiatives') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                phase: 'planning',
                phase_progress: 33,
              },
              error: null,
            }),
          };
        } else if (table === 'documents') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Documents not found' },
            }),
          };
        }
      }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClerkSupabaseClient).mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useInitiativeProgress('test-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
