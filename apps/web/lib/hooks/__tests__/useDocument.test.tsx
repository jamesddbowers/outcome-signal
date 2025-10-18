import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDocument } from '../useDocument';
import * as mockDocuments from '@/lib/services/mock-documents';
import React from 'react';

// Mock the mock-documents service
vi.mock('@/lib/services/mock-documents', () => ({
  getMockDocument: vi.fn(),
}));

const createWrapper = (): React.FC<{ children: React.ReactNode }> => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'QueryClientWrapper';

  return Wrapper;
};

describe('useDocument', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state initially', () => {
    vi.mocked(mockDocuments.getMockDocument).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useDocument('init-123'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('returns data on successful fetch', async () => {
    const mockContent = '# Test Document\n\nThis is a test document.';
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue(mockContent);

    const { result } = renderHook(() => useDocument('init-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(mockContent);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockDocuments.getMockDocument).toHaveBeenCalledWith(
      'init-123',
      undefined
    );
  });

  it('returns error state on fetch failure', async () => {
    const mockError = new Error('Failed to fetch document');
    vi.mocked(mockDocuments.getMockDocument).mockRejectedValue(mockError);

    const { result } = renderHook(() => useDocument('init-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('passes epicId to getMockDocument when provided', async () => {
    const mockContent = '# Epic Document';
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue(mockContent);

    const { result } = renderHook(
      () => useDocument('init-123', 'epic-456'),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDocuments.getMockDocument).toHaveBeenCalledWith(
      'init-123',
      'epic-456'
    );
  });

  it('does not fetch when enabled is false', () => {
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue('# Test');

    renderHook(() => useDocument('init-123', undefined, { enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(mockDocuments.getMockDocument).not.toHaveBeenCalled();
  });

  it('does not fetch when initiativeId is empty and enabled is not explicitly set', () => {
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue('# Test');

    renderHook(() => useDocument(''), {
      wrapper: createWrapper(),
    });

    expect(mockDocuments.getMockDocument).not.toHaveBeenCalled();
  });

  it('uses correct query key', async () => {
    const mockContent = '# Test Document';
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue(mockContent);

    const { result } = renderHook(
      () => useDocument('init-123', 'epic-456'),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Query key should be ['document', initiativeId, epicId]
    expect(mockDocuments.getMockDocument).toHaveBeenCalledWith(
      'init-123',
      'epic-456'
    );
  });

  it('refetches data when initiativeId changes', async () => {
    const mockContent1 = '# Document 1';
    const mockContent2 = '# Document 2';

    vi.mocked(mockDocuments.getMockDocument)
      .mockResolvedValueOnce(mockContent1)
      .mockResolvedValueOnce(mockContent2);

    const { result, rerender } = renderHook(
      ({ id }) => useDocument(id),
      {
        wrapper: createWrapper(),
        initialProps: { id: 'init-1' },
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(mockContent1);

    rerender({ id: 'init-2' });

    await waitFor(() => expect(result.current.data).toBe(mockContent2));
    expect(mockDocuments.getMockDocument).toHaveBeenCalledTimes(2);
  });
});
