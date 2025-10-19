import React, { type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RightPanel from '../RightPanel';

// Mock the hooks and Supabase client
vi.mock('@/lib/hooks/useAgentConversation');
vi.mock('@/lib/hooks/useSendMessage');
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
    }),
    removeChannel: () => {},
  }),
}));

import { useAgentConversation } from '@/lib/hooks/useAgentConversation';
import { useSendMessage } from '@/lib/hooks/useSendMessage';

describe('RightPanel', () => {
  const testInitiativeId = '550e8400-e29b-41d4-a716-446655440000';
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Default mock implementations
    vi.mocked(useAgentConversation).mockReturnValue({
      data: null,
      isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    vi.mocked(useSendMessage).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it('renders with initiativeId prop', () => {
    render(<RightPanel initiativeId={testInitiativeId} />, { wrapper });

    expect(screen.getAllByText(/Agent Chat/i)[0]).toBeInTheDocument();
  });

  it('renders AgentChat component', () => {
    render(<RightPanel initiativeId={testInitiativeId} />, { wrapper });

    // AgentChat component includes chat input
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('renders with proper heading structure', () => {
    render(<RightPanel initiativeId={testInitiativeId} />, { wrapper });

    const heading = screen.getAllByText(/Agent Chat/i)[0];
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('uses Card component for layout', () => {
    const { container } = render(<RightPanel initiativeId={testInitiativeId} />, { wrapper });

    // Card component should add specific classes
    const card = container.querySelector('.flex.flex-col');
    expect(card).toBeInTheDocument();
  });

  it('displays empty state in AgentChat when no messages', () => {
    render(<RightPanel initiativeId={testInitiativeId} />, { wrapper });

    expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument();
  });
});
