import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RightPanel from '../RightPanel';

describe('RightPanel', () => {
  const testInitiativeId = '550e8400-e29b-41d4-a716-446655440000';

  it('renders with initiativeId prop', () => {
    render(<RightPanel initiativeId={testInitiativeId} />);

    expect(screen.getAllByText(/Agent Chat/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(`Initiative ID: ${testInitiativeId}`)[0]).toBeInTheDocument();
  });

  it('displays placeholder content', () => {
    render(<RightPanel initiativeId={testInitiativeId} />);

    expect(
      screen.getAllByText(/Placeholder for agent chat interface \(Story 2.4\)/i)[0]
    ).toBeInTheDocument();
  });

  it('renders with proper heading structure', () => {
    render(<RightPanel initiativeId={testInitiativeId} />);

    const heading = screen.getAllByText(/Agent Chat/i)[0];
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('uses Card component for layout', () => {
    const { container } = render(<RightPanel initiativeId={testInitiativeId} />);

    // Card component should add specific classes
    const card = container.querySelector('.flex.flex-col');
    expect(card).toBeInTheDocument();
  });
});
