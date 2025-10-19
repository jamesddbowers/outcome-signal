import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../ChatInput';

describe('ChatInput', () => {
  it('renders input field and send button', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('displays custom placeholder', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} placeholder="Custom placeholder" />);

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('disables input and button when disabled prop is true', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={true} />);

    expect(screen.getByTestId('chat-input')).toBeDisabled();
    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('disables send button when input is empty', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const sendButton = screen.getByTestId('send-button');
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, 'Test message');

    expect(sendButton).not.toBeDisabled();
  });

  it('calls onSend with message when send button is clicked', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, 'Test message');
    await userEvent.click(sendButton);

    expect(onSend).toHaveBeenCalledWith('Test message');
  });

  it('clears input after sending message', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByTestId('chat-input') as HTMLTextAreaElement;
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, 'Test message');
    await userEvent.click(sendButton);

    expect(input.value).toBe('');
  });

  it('sends message when Enter key is pressed', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'Test message');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(onSend).toHaveBeenCalledWith('Test message');
  });

  it('creates newline when Shift+Enter is pressed', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByTestId('chat-input') as HTMLTextAreaElement;

    await userEvent.type(input, 'Line 1');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    await userEvent.type(input, '\nLine 2');

    expect(input.value).toContain('\n');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('trims whitespace from message before sending', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, '  Test message  ');
    await userEvent.click(sendButton);

    expect(onSend).toHaveBeenCalledWith('Test message');
  });

  it('does not send message when input contains only whitespace', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, '   ');

    // Button should still be disabled
    expect(sendButton).toBeDisabled();

    // Attempt to send should not call onSend
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('has correct aria-label on send button', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeInTheDocument();
  });
});
