import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '../ChatMessage';
import type { ChatMessage as ChatMessageType } from '@/lib/types';

describe('ChatMessage', () => {
  const baseMessage: ChatMessageType = {
    id: 'msg-1',
    role: 'user',
    content: 'Test message',
    timestamp: '2025-01-01T00:00:00Z',
  };

  it('renders user message with correct styling', () => {
    render(<ChatMessage message={baseMessage} />);

    const messageText = screen.getByText('Test message');
    expect(messageText).toBeInTheDocument();

    // Check parent container has user message styling
    const messageContainer = messageText.closest('div.flex');
    expect(messageContainer).toHaveClass('justify-end');

    // Check card has blue background
    const card = messageText.closest('div[class*="bg-blue-500"]');
    expect(card).toBeInTheDocument();
  });

  it('renders agent message with correct styling', () => {
    const agentMessage: ChatMessageType = {
      ...baseMessage,
      role: 'agent',
      content: 'Agent response',
    };

    render(<ChatMessage message={agentMessage} />);

    const messageText = screen.getByText('Agent response');
    expect(messageText).toBeInTheDocument();

    // Check parent container has agent message styling
    const messageContainer = messageText.closest('div.flex');
    expect(messageContainer).toHaveClass('justify-start');

    // Check card has gray background
    const card = messageText.closest('div[class*="bg-gray-100"]');
    expect(card).toBeInTheDocument();
  });

  it('renders system message with centered italic styling', () => {
    const systemMessage: ChatMessageType = {
      ...baseMessage,
      role: 'system',
      content: 'Phase transition',
    };

    render(<ChatMessage message={systemMessage} />);

    const messageText = screen.getByText('Phase transition');
    expect(messageText).toBeInTheDocument();
    expect(messageText).toHaveClass('italic');
    expect(messageText).toHaveClass('text-gray-500');

    // Check parent container is centered
    const container = messageText.closest('div.flex');
    expect(container).toHaveClass('justify-center');
  });

  it('hides timestamp by default', () => {
    render(<ChatMessage message={baseMessage} />);

    // Timestamp should not be visible
    expect(screen.queryByText(/ago/)).not.toBeInTheDocument();
  });

  it('shows timestamp when showTimestamp is true', () => {
    render(<ChatMessage message={baseMessage} showTimestamp={true} />);

    // Should show relative time (e.g., "X years ago" for 2025 date)
    const timestampElement = screen.getByText(/ago/);
    expect(timestampElement).toBeInTheDocument();
    expect(timestampElement).toHaveClass('text-xs');
  });

  it('preserves newlines in message content', () => {
    const multilineMessage: ChatMessageType = {
      ...baseMessage,
      content: 'Line 1\nLine 2\nLine 3',
    };

    render(<ChatMessage message={multilineMessage} />);

    const messageText = screen.getByText(/Line 1/);
    expect(messageText).toHaveClass('whitespace-pre-wrap');
  });

  it('breaks long words correctly', () => {
    const longWordMessage: ChatMessageType = {
      ...baseMessage,
      content: 'verylongwordwithoutspacesinitthatshouldbreakintheui',
    };

    render(<ChatMessage message={longWordMessage} />);

    const messageText = screen.getByText(/verylongword/);
    expect(messageText).toHaveClass('break-words');
  });
});
