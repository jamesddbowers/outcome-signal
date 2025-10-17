import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Separator } from '@/components/ui/separator';

describe('Separator Component', () => {
  it('renders separator with horizontal orientation', () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('[data-orientation="horizontal"]');
    expect(separator).toBeInTheDocument();
  });

  it('renders separator with vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.querySelector('[data-orientation="vertical"]');
    expect(separator).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('is decorative by default', () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('[role="none"]');
    expect(separator).toBeInTheDocument();
  });
});
