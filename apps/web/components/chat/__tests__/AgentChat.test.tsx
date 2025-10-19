import React, { type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AgentChat } from '../AgentChat';
import type { ChatMessage, AgentConversation } from '@/lib/types';

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

describe('AgentChat', () => {
  const mockInitiativeId = 'init-123';
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      role: 'user',
      content: 'Hello agent',
      timestamp: '2025-01-01T00:00:00Z',
    },
    {
      id: 'msg-2',
      role: 'agent',
      content: 'Hi there! How can I help?',
      timestamp: '2025-01-01T00:00:01Z',
    },
  ];

  const mockConversation: AgentConversation = {
    id: 'conv-123',
    initiative_id: mockInitiativeId,
    user_id: 'user-123',
    messages: mockMessages,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:01Z',
  };

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

  it('renders empty state when no conversation exists', () => {
    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument();
  });

  it('renders messages when conversation exists', () => {
    vi.mocked(useAgentConversation).mockReturnValue({
      data: mockConversation,
      isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    expect(screen.getByText('Hello agent')).toBeInTheDocument();
    expect(screen.getByText('Hi there! How can I help?')).toBeInTheDocument();
  });

  it('renders ChatInput component', () => {
    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('calls sendMessage when message is sent', async () => {
    const mockSendMessage = vi.fn();
    vi.mocked(useSendMessage).mockReturnValue({
      mutate: mockSendMessage,
      isPending: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, 'Test message');
    await userEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('disables input when loading conversation', () => {
    vi.mocked(useAgentConversation).mockReturnValue({
      data: null,
      isLoading: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    expect(screen.getByTestId('chat-input')).toBeDisabled();
    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('disables input when sending message', () => {
    vi.mocked(useSendMessage).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    expect(screen.getByTestId('chat-input')).toBeDisabled();
    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('renders messages in correct order', () => {
    vi.mocked(useAgentConversation).mockReturnValue({
      data: mockConversation,
      isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { container } = render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    const messageContents = Array.from(
      container.querySelectorAll('.whitespace-pre-wrap')
    ).map((el) => el.textContent);

    expect(messageContents[0]).toBe('Hello agent');
    expect(messageContents[1]).toBe('Hi there! How can I help?');
  });

  it('hides empty state when messages exist', () => {
    vi.mocked(useAgentConversation).mockReturnValue({
      data: mockConversation,
      isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    expect(screen.queryByText('No messages yet. Start a conversation!')).not.toBeInTheDocument();
  });

  it('uses ScrollArea component for message list', () => {
    const { container } = render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    const scrollArea = container.querySelector('[data-radix-scroll-area-viewport]');
    expect(scrollArea).toBeInTheDocument();
  });

  it('fetches conversation for correct initiative ID', () => {
    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    expect(useAgentConversation).toHaveBeenCalledWith(mockInitiativeId);
  });

  it('initializes send message hook with correct initiative ID', () => {
    render(<AgentChat initiativeId={mockInitiativeId} />, { wrapper });

    expect(useSendMessage).toHaveBeenCalledWith(mockInitiativeId);
  });
});
