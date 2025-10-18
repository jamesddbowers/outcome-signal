/**
 * Tests for useEpics Hook
 *
 * Verifies that the useEpics hook correctly fetches and returns epic data
 * for a given initiative, with proper loading, success, and error states.
 * Also tests that the query is disabled when no initiativeId is provided.
 */

import React, { type ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEpics } from '../useEpics';

describe('useEpics', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return loading state initially when initiativeId is provided', () => {
    const { result } = renderHook(() => useEpics('init-001'), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should return data on successful fetch', async () => {
    const { result } = renderHook(() => useEpics('init-001'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data!.length).toBeGreaterThan(0);

    // Verify data structure
    const epic = result.current.data![0];
    expect(epic).toHaveProperty('id');
    expect(epic).toHaveProperty('title');
    expect(epic).toHaveProperty('epic_number');
    expect(epic).toHaveProperty('initiative_id');
    expect(epic.initiative_id).toBe('init-001');
  });

  it('should not fetch when initiativeId is empty', () => {
    const { result } = renderHook(() => useEpics(''), { wrapper });

    // Query should be disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('should use correct query key with initiativeId', () => {
    const initiativeId = 'init-001';
    renderHook(() => useEpics(initiativeId), { wrapper });

    const queries = queryClient.getQueryCache().getAll();
    const epicsQuery = queries.find((q) =>
      JSON.stringify(q.queryKey) === JSON.stringify(['epics', initiativeId])
    );

    expect(epicsQuery).toBeDefined();
  });

  it('should return empty array for non-existent initiative', async () => {
    const { result } = renderHook(() => useEpics('non-existent-id'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.length).toBe(0);
  });

  it('should cache data between renders', async () => {
    const { result, rerender } = renderHook(() => useEpics('init-001'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    rerender();

    expect(result.current.data).toBe(firstData);
    expect(result.current.isLoading).toBe(false);
  });

  it('should refetch when initiativeId changes', async () => {
    const { result, rerender } = renderHook(
      ({ initiativeId }) => useEpics(initiativeId),
      {
        wrapper,
        initialProps: { initiativeId: 'init-001' },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    // Change initiative ID
    rerender({ initiativeId: 'init-002' });

    await waitFor(() => {
      expect(result.current.data).not.toBe(firstData);
      expect(result.current.isSuccess).toBe(true);
    });

    // Should have different epic data for init-002
    if (result.current.data && result.current.data.length > 0) {
      expect(result.current.data[0].initiative_id).toBe('init-002');
    }
  });
});
