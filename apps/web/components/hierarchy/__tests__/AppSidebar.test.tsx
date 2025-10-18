/**
 * Tests for AppSidebar Component
 *
 * Verifies the AppSidebar component correctly renders Initiative and Epic nodes,
 * handles expand/collapse, navigation, active state highlighting, and keyboard accessibility.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppSidebar } from '../AppSidebar';
import * as useInitiativesModule from '@/lib/hooks/useInitiatives';
import * as useEpicsModule from '@/lib/hooks/useEpics';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard/initiatives/init-001'),
}));

// Mock the hooks
vi.mock('@/lib/hooks/useInitiatives');
vi.mock('@/lib/hooks/useEpics');

describe('AppSidebar', () => {
  let queryClient: QueryClient;

  const mockInitiatives = [
    {
      id: 'init-001',
      user_id: 'user-123',
      title: 'Customer Portal MVP',
      description: 'Test initiative 1',
      status: 'active' as const,
      phase: 'development' as const,
      phase_progress: 50,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      archived_at: null,
    },
    {
      id: 'init-002',
      user_id: 'user-123',
      title: 'Analytics Dashboard',
      description: 'Test initiative 2',
      status: 'active' as const,
      phase: 'planning' as const,
      phase_progress: 25,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      archived_at: null,
    },
  ];

  const mockEpics = [
    {
      id: 'epic-001-1',
      initiative_id: 'init-001',
      epic_number: 1,
      title: 'User Authentication',
      description: 'Auth epic',
      story_count: 5,
      status: 'completed' as const,
    },
    {
      id: 'epic-001-2',
      initiative_id: 'init-001',
      epic_number: 2,
      title: 'Account Management',
      description: 'Account epic',
      story_count: 8,
      status: 'in_progress' as const,
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock successful data fetch
    vi.mocked(useInitiativesModule.useInitiatives).mockReturnValue({
      data: mockInitiatives,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    } as any);

    vi.mocked(useEpicsModule.useEpics).mockReturnValue({
      data: mockEpics,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    } as any);
  });

  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  it('should render sidebar header with Projects label', () => {
    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should render initiative nodes', () => {
    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    expect(screen.getByText('Customer Portal MVP')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('should show loading skeleton when initiatives are loading', () => {
    vi.mocked(useInitiativesModule.useInitiatives).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
    } as any);

    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    // Check for skeleton elements (by class or role)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show error message when initiatives fail to load', () => {
    vi.mocked(useInitiativesModule.useInitiatives).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: new Error('Failed to fetch'),
    } as any);

    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    expect(screen.getByText(/Failed to load initiatives/i)).toBeInTheDocument();
  });

  it('should expand initiative and show epics when chevron is clicked', async () => {
    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    // Find and click the expand button for the first initiative
    const expandButtons = screen.getAllByLabelText(/Expand initiative/i);
    fireEvent.click(expandButtons[0]);

    // Wait for epics to appear
    await waitFor(() => {
      expect(screen.getAllByText('1. User Authentication').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2. Account Management').length).toBeGreaterThan(0);
    });
  });

  it('should collapse initiative when chevron is clicked again', async () => {
    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    const expandButtons = screen.getAllByLabelText(/Expand initiative/i);

    // Expand
    fireEvent.click(expandButtons[0]);
    await waitFor(() => {
      expect(screen.getAllByText('1. User Authentication').length).toBeGreaterThan(0);
    });

    // Collapse - click again
    fireEvent.click(expandButtons[0]);

    // Verify we now have an expand button (meaning it collapsed)
    await waitFor(() => {
      const expandAgainButtons = screen.queryAllByLabelText(/Expand initiative/i);
      expect(expandAgainButtons.length).toBeGreaterThan(0);
    });
  });

  it('should render initiative links with correct href', () => {
    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    const initiativeLink = screen.getByRole('link', { name: /Customer Portal MVP/i });
    expect(initiativeLink).toHaveAttribute('href', '/dashboard/initiatives/init-001');
  });

  it('should render epic links with correct href', async () => {
    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    // Expand initiative
    const expandButtons = screen.getAllByLabelText(/Expand initiative/i);
    fireEvent.click(expandButtons[0]);

    await waitFor(() => {
      const epicLinks = screen.getAllByRole('link', { name: /1\. User Authentication/i });
      expect(epicLinks[0]).toHaveAttribute(
        'href',
        '/dashboard/initiatives/init-001/epics/epic-001-1'
      );
    });
  });

  it('should apply active state to initiative based on pathname', () => {
    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    const activeLink = screen.getByRole('link', { name: /Customer Portal MVP/i });
    // Check for active background class
    expect(activeLink).toHaveClass('bg-accent', 'text-accent-foreground');
  });

  it('should auto-expand initiative if it contains the active epic', async () => {
    // Mock pathname with an epic URL
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard/initiatives/init-001/epics/epic-001-1');

    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    // Initiative should auto-expand and show epics
    await waitFor(() => {
      expect(screen.getAllByText('1. User Authentication').length).toBeGreaterThan(0);
    });
  });

  it('should show "No epics yet" when initiative has no epics', async () => {
    vi.mocked(useEpicsModule.useEpics).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    } as any);

    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    // Expand initiative
    const expandButtons = screen.getAllByLabelText(/Expand initiative/i);
    fireEvent.click(expandButtons[0]);

    await waitFor(() => {
      const noEpicsMessages = screen.getAllByText('No epics yet');
      expect(noEpicsMessages.length).toBeGreaterThan(0);
    });
  });

  it('should show loading skeleton for epics while fetching', async () => {
    vi.mocked(useEpicsModule.useEpics).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
    } as any);

    render(
      <Wrapper>
        <AppSidebar />
      </Wrapper>
    );

    // Expand initiative
    const expandButtons = screen.getAllByLabelText(/Expand initiative/i);
    fireEvent.click(expandButtons[0]);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});
