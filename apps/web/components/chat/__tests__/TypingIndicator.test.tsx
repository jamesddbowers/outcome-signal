import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypingIndicator } from '../TypingIndicator';

describe('TypingIndicator', () => {
  it('renders typing indicator', () => {
    render(<TypingIndicator />);

    // Check for aria-label for accessibility
    const indicator = screen.getByLabelText('Agent is typing');
    expect(indicator).toBeInTheDocument();
  });

  it('displays three animated dots', () => {
    const { container } = render(<TypingIndicator />);

    // Check for three dot elements
    const dots = container.querySelectorAll('span.animate-bounce');
    expect(dots).toHaveLength(3);
  });

  it('applies agent message styling', () => {
    const { container } = render(<TypingIndicator />);

    // Check for gray background (agent message styling)
    const card = container.querySelector('div[class*="bg-gray-100"]');
    expect(card).toBeInTheDocument();
  });

  it('is left-aligned like agent messages', () => {
    const { container } = render(<TypingIndicator />);

    // Check parent container has justify-start (left-aligned)
    const messageContainer = container.querySelector('div.justify-start');
    expect(messageContainer).toBeInTheDocument();
  });

  it('renders within a Card component', () => {
    const { container } = render(<TypingIndicator />);

    // Card component should be present
    const card = container.querySelector('div[class*="max-w-"]');
    expect(card).toBeInTheDocument();
  });
});
