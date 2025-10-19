import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { PhaseIndicator } from '../PhaseIndicator';
import { useInitiativeProgress } from '@/lib/hooks/useInitiativeProgress';

// Mock the hook
vi.mock('@/lib/hooks/useInitiativeProgress');

describe('PhaseIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useInitiativeProgress).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PhaseIndicator initiativeId="test-id" />
      </QueryClientProvider>
    );

    // Check for skeleton elements
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state', () => {
    vi.mocked(useInitiativeProgress).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PhaseIndicator initiativeId="test-id" />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Unable to load phase information/i)).toBeInTheDocument();
  });

  it('renders phase name and progress percentage', () => {
    vi.mocked(useInitiativeProgress).mockReturnValue({
      data: {
        phase: 'planning',
        progress: 33,
        documents: [
          { type: 'brief', name: 'Brief', status: 'completed' },
          { type: 'prd', name: 'PRD', status: 'in_progress' },
          { type: 'architecture', name: 'Architecture', status: 'pending' },
          { type: 'market_research', name: 'Market Research', status: 'pending' },
          { type: 'competitive_analysis', name: 'Competitive Analysis', status: 'pending' },
          { type: 'ux_overview', name: 'UX', status: 'pending' },
          { type: 'security_review', name: 'Security', status: 'pending' },
          { type: 'qa_strategy', name: 'QA', status: 'pending' },
        ],
      },
      isLoading: false,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PhaseIndicator initiativeId="test-id" />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Planning Phase/i)).toBeInTheDocument();
    expect(screen.getByText('[33%]')).toBeInTheDocument();
  });

  it('shows active sub-agent indicator when provided', () => {
    vi.mocked(useInitiativeProgress).mockReturnValue({
      data: {
        phase: 'planning',
        progress: 33,
        documents: [],
      },
      isLoading: false,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PhaseIndicator initiativeId="test-id" activeAgent="Architecture Agent" />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Working with Architecture Agent/i)).toBeInTheDocument();
  });

  it('displays phase breakdown tooltip on hover', async () => {
    const user = userEvent.setup();

    vi.mocked(useInitiativeProgress).mockReturnValue({
      data: {
        phase: 'planning',
        progress: 33,
        documents: [
          { type: 'brief', name: 'Brief', status: 'completed' },
          { type: 'prd', name: 'PRD', status: 'in_progress' },
          { type: 'architecture', name: 'Architecture', status: 'pending' },
          { type: 'market_research', name: 'Market Research', status: 'pending' },
          { type: 'competitive_analysis', name: 'Competitive Analysis', status: 'pending' },
          { type: 'ux_overview', name: 'UX', status: 'pending' },
          { type: 'security_review', name: 'Security', status: 'pending' },
          { type: 'qa_strategy', name: 'QA', status: 'pending' },
        ],
      },
      isLoading: false,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PhaseIndicator initiativeId="test-id" />
      </QueryClientProvider>
    );

    const button = screen.getByTestId('phase-indicator');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText(/Planning \(8 documents\)/i)).toBeInTheDocument();
    });
  });

  it('has proper ARIA labels for accessibility', () => {
    vi.mocked(useInitiativeProgress).mockReturnValue({
      data: {
        phase: 'planning',
        progress: 33,
        documents: [],
      },
      isLoading: false,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PhaseIndicator initiativeId="test-id" />
      </QueryClientProvider>
    );

    const button = screen.getByTestId('phase-indicator');
    expect(button).toHaveAttribute('aria-label', 'Planning Phase - 33% complete');

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '33');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('displays correct document status icons', async () => {
    const user = userEvent.setup();

    vi.mocked(useInitiativeProgress).mockReturnValue({
      data: {
        phase: 'planning',
        progress: 33,
        documents: [
          { type: 'brief', name: 'Brief', status: 'completed' },
          { type: 'prd', name: 'PRD', status: 'in_progress' },
          { type: 'architecture', name: 'Architecture', status: 'pending' },
          { type: 'market_research', name: 'Market Research', status: 'pending' },
          { type: 'competitive_analysis', name: 'Competitive Analysis', status: 'pending' },
          { type: 'ux_overview', name: 'UX', status: 'pending' },
          { type: 'security_review', name: 'Security', status: 'pending' },
          { type: 'qa_strategy', name: 'QA', status: 'pending' },
        ],
      },
      isLoading: false,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PhaseIndicator initiativeId="test-id" />
      </QueryClientProvider>
    );

    const button = screen.getByTestId('phase-indicator');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText('Brief')).toBeInTheDocument();
    });

    // Check for status text indicators
    const inProgressElements = screen.getAllByText('(in progress)');
    expect(inProgressElements.length).toBeGreaterThan(0);

    const pendingElements = screen.getAllByText('(pending)');
    expect(pendingElements.length).toBeGreaterThan(0);
  });
});
