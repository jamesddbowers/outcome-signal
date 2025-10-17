import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('renders button with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });

  it('renders button with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button', { name: 'Outline' });
    expect(button).toBeInTheDocument();
  });

  it('renders button with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button', { name: 'Ghost' });
    expect(button).toBeInTheDocument();
  });

  it('renders button with link variant', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByRole('button', { name: 'Link' });
    expect(button).toBeInTheDocument();
  });

  it('renders button with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button', { name: 'Small' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-9');
  });

  it('renders button with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: 'Large' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-11');
  });

  it('renders button with icon size', () => {
    render(<Button size="icon" aria-label="Icon button" />);
    const button = screen.getByRole('button', { name: 'Icon button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
    expect(button).toHaveClass('disabled:opacity-50');
  });
});
