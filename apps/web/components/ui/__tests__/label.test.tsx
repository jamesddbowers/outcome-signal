import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from '@/components/ui/label';

describe('Label Component', () => {
  it('renders label correctly', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLLabelElement | null };
    render(<Label ref={ref}>Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Label</Label>);
    const label = screen.getByText('Label');
    expect(label).toHaveClass('custom-class');
  });
});
