import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LeftPanel from '../LeftPanel';

describe('LeftPanel', () => {
  const testInitiativeId = '550e8400-e29b-41d4-a716-446655440000';

  it('renders with initiativeId prop', () => {
    render(<LeftPanel initiativeId={testInitiativeId} />);

    expect(screen.getAllByText(/Hierarchy Tree/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(`Initiative ID: ${testInitiativeId}`)[0]).toBeInTheDocument();
  });

  it('displays placeholder content', () => {
    render(<LeftPanel initiativeId={testInitiativeId} />);

    expect(
      screen.getAllByText(/Placeholder for hierarchy tree navigation \(Story 2.2\)/i)[0]
    ).toBeInTheDocument();
  });

  it('renders with proper heading structure', () => {
    render(<LeftPanel initiativeId={testInitiativeId} />);

    const heading = screen.getAllByText(/Hierarchy Tree/i)[0];
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('uses Card component for layout', () => {
    const { container } = render(<LeftPanel initiativeId={testInitiativeId} />);

    // Card component should add specific classes
    const card = container.querySelector('.flex.flex-col');
    expect(card).toBeInTheDocument();
  });
});
