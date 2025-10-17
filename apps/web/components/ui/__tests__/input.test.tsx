import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;

    await user.type(input, 'Hello World');
    expect(input.value).toBe('Hello World');
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />);
    let input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
