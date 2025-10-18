import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MiddlePanel from '../MiddlePanel';
import * as mockDocuments from '@/lib/services/mock-documents';

// Mock the mock-documents service
vi.mock('@/lib/services/mock-documents', () => ({
  getMockDocument: vi.fn(),
}));

// Mock TipTap components
vi.mock('@/components/preview/TipTapEditor', () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="tiptap-editor">
      <div data-testid="editor-content">{content.substring(0, 50)}...</div>
    </div>
  ),
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

describe('MiddlePanel', () => {
  const testInitiativeId = '550e8400-e29b-41d4-a716-446655440000';
  const testEpicId = 'epic-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with proper heading structure', () => {
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue('# Test');
    render(<MiddlePanel initiativeId={testInitiativeId} />, {
      wrapper: createWrapper(),
    });

    const heading = screen.getByText(/Document Preview/i);
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('displays epic ID when provided', () => {
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue('# Test');
    render(<MiddlePanel initiativeId={testInitiativeId} epicId={testEpicId} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(`Epic: ${testEpicId}`)).toBeInTheDocument();
  });

  it('renders loading skeleton initially', () => {
    vi.mocked(mockDocuments.getMockDocument).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<MiddlePanel initiativeId={testInitiativeId} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders TipTapEditor with document content after loading', async () => {
    const mockContent = '# Test Document\n\nThis is a test document.';
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue(mockContent);

    render(<MiddlePanel initiativeId={testInitiativeId} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
    });

    // Check that content starts with the expected text (whitespace handling)
    const editorContent = screen.getByTestId('editor-content');
    expect(editorContent.textContent).toContain('# Test Document');
    expect(editorContent.textContent).toContain('This is a test document');
  });

  it('handles error state gracefully', async () => {
    const mockError = new Error('Failed to fetch document');
    vi.mocked(mockDocuments.getMockDocument).mockRejectedValue(mockError);

    render(<MiddlePanel initiativeId={testInitiativeId} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    expect(screen.getByText(/Error loading document/i)).toBeInTheDocument();
    expect(screen.getByText(mockError.message)).toBeInTheDocument();
  });

  it('handles empty state when no document available', async () => {
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue('');

    render(<MiddlePanel initiativeId={testInitiativeId} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    expect(screen.getByText(/No document available/i)).toBeInTheDocument();
  });

  it('passes initiativeId and epicId to useDocument hook', async () => {
    const mockContent = '# Test';
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue(mockContent);

    render(<MiddlePanel initiativeId={testInitiativeId} epicId={testEpicId} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockDocuments.getMockDocument).toHaveBeenCalledWith(
        testInitiativeId,
        testEpicId
      );
    });
  });

  it('uses Card component for layout', () => {
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue('# Test');
    const { container } = render(
      <MiddlePanel initiativeId={testInitiativeId} />,
      {
        wrapper: createWrapper(),
      }
    );

    // Card component should add specific classes
    const card = container.querySelector('.flex.flex-col');
    expect(card).toBeInTheDocument();
  });

  it('has proper overflow handling for scrolling', () => {
    vi.mocked(mockDocuments.getMockDocument).mockResolvedValue('# Test');
    const { container } = render(
      <MiddlePanel initiativeId={testInitiativeId} />,
      {
        wrapper: createWrapper(),
      }
    );

    const card = container.querySelector('.overflow-hidden');
    expect(card).toBeInTheDocument();
  });
});
