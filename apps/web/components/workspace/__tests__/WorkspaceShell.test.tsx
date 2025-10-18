import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WorkspaceShell from '../WorkspaceShell';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard/initiatives/test-id'),
}));

// Mock AppSidebar component
vi.mock('@/components/hierarchy/AppSidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">AppSidebar</div>,
}));

// Mock child panel components
vi.mock('../MiddlePanel', () => {
  const MiddlePanel = ({ initiativeId, epicId }: { initiativeId: string; epicId?: string }): JSX.Element => (
    <div data-testid="middle-panel">
      Middle Panel - {initiativeId}
      {epicId && ` - Epic: ${epicId}`}
    </div>
  );
  MiddlePanel.displayName = 'MiddlePanel';
  return { default: MiddlePanel };
});

vi.mock('../RightPanel', () => {
  const RightPanel = ({ initiativeId, epicId }: { initiativeId: string; epicId?: string }): JSX.Element => (
    <div data-testid="right-panel">
      Right Panel - {initiativeId}
      {epicId && ` - Epic: ${epicId}`}
    </div>
  );
  RightPanel.displayName = 'RightPanel';
  return { default: RightPanel };
});

// Mock React Query hooks
vi.mock('@/lib/hooks/useInitiatives', () => ({
  useInitiatives: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('@/lib/hooks/useEpics', () => ({
  useEpics: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

interface MockPanelGroupProps {
  children: React.ReactNode;
  autoSaveId?: string;
}

interface MockPanelProps {
  children: React.ReactNode;
  id?: string;
}

// Mock react-resizable-panels
vi.mock('react-resizable-panels', () => {
  const PanelGroup = ({ children, autoSaveId }: MockPanelGroupProps): JSX.Element => (
    <div data-testid="panel-group" data-autosaveid={autoSaveId}>
      {children}
    </div>
  );

  const Panel = React.forwardRef<
    { collapse: () => void; expand: () => void; isCollapsed: () => boolean },
    MockPanelProps
  >(({ children, id }, ref) => {
    React.useImperativeHandle(ref, () => ({
      collapse: vi.fn(),
      expand: vi.fn(),
      isCollapsed: vi.fn(() => false),
    }));

    return <div data-testid={`panel-${id}`}>{children}</div>;
  });
  Panel.displayName = 'Panel';

  const PanelResizeHandle = (): JSX.Element => <div data-testid="resize-handle" />;

  return {
    PanelGroup,
    Panel,
    PanelResizeHandle,
  };
});

describe('WorkspaceShell with Sidebar', () => {
  const testInitiativeId = '550e8400-e29b-41d4-a716-446655440000';
  const testEpicId = 'epic-123';
  let queryClient: QueryClient;

  beforeEach(() => {
    localStorage.clear();
    global.innerWidth = 1440;
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  it('renders with SidebarProvider and AppSidebar', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    // AppSidebar should be rendered
    const sidebars = screen.getAllByTestId('app-sidebar');
    expect(sidebars.length).toBeGreaterThan(0);
  });

  it('renders with initiative ID', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    // Check that panels receive the initiative ID
    const middlePanelText = screen.getAllByText(new RegExp(`Middle Panel - ${testInitiativeId}`));
    const rightPanelText = screen.getAllByText(new RegExp(`Right Panel - ${testInitiativeId}`));

    expect(middlePanelText.length).toBeGreaterThan(0);
    expect(rightPanelText.length).toBeGreaterThan(0);
  });

  it('renders with initiative ID and epic ID', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} epicId={testEpicId} />
      </Wrapper>
    );

    // Check that panels receive both IDs
    const middlePanelText = screen.getAllByText(
      new RegExp(`Middle Panel - ${testInitiativeId}.*Epic: ${testEpicId}`)
    );
    const rightPanelText = screen.getAllByText(
      new RegExp(`Right Panel - ${testInitiativeId}.*Epic: ${testEpicId}`)
    );

    expect(middlePanelText.length).toBeGreaterThan(0);
    expect(rightPanelText.length).toBeGreaterThan(0);
  });

  it('renders desktop layout with middle and right panels', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    const middlePanels = screen.getAllByTestId('middle-panel');
    const rightPanels = screen.getAllByTestId('right-panel');

    expect(middlePanels.length).toBeGreaterThan(0);
    expect(rightPanels.length).toBeGreaterThan(0);
  });

  it('renders three-column layout with all panels', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    // Check that all three panels are present
    const sidebar = screen.getAllByTestId('app-sidebar');
    const middlePanels = screen.getAllByTestId('middle-panel');
    const rightPanels = screen.getAllByTestId('right-panel');

    expect(sidebar.length).toBeGreaterThan(0);
    expect(middlePanels.length).toBeGreaterThan(0);
    expect(rightPanels.length).toBeGreaterThan(0);
  });

  it('renders collapse button for right panel', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    const rightToggle = screen.getByLabelText('Collapse right panel');
    expect(rightToggle).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    expect(screen.getByLabelText('Collapse right panel')).toBeInTheDocument();
  });

  it('uses autoSaveId for localStorage persistence', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    const panelGroup = screen.getAllByTestId('panel-group')[0];
    expect(panelGroup).toHaveAttribute('data-autosaveid', 'workspace-layout-v2');
  });

  it('renders mobile layout with tabs (all three tabs)', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    const hierarchyTab = screen.getByRole('tab', { name: 'Hierarchy' });
    const documentTab = screen.getByRole('tab', { name: 'Document' });
    const chatTab = screen.getByRole('tab', { name: 'Chat' });

    expect(hierarchyTab).toBeInTheDocument();
    expect(documentTab).toBeInTheDocument();
    expect(chatTab).toBeInTheDocument();
  });

  it('allows tab navigation in mobile view', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    const documentTab = screen.getByRole('tab', { name: 'Document' });
    const chatTab = screen.getByRole('tab', { name: 'Chat' });

    // Document tab should be active by default
    expect(documentTab).toHaveAttribute('data-state', 'active');

    expect(documentTab).toHaveAttribute('role', 'tab');
    expect(chatTab).toHaveAttribute('role', 'tab');
  });

  it('touch targets meet WCAG AA standards (44px minimum)', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    const rightToggle = screen.getByLabelText('Collapse right panel');

    // h-11 w-11 = 44px x 44px (meets WCAG AA)
    expect(rightToggle).toHaveClass('h-11', 'w-11');
  });

  it('renders collapse buttons for left and right panels', () => {
    render(
      <Wrapper>
        <WorkspaceShell initiativeId={testInitiativeId} />
      </Wrapper>
    );

    const leftCollapseButton = screen.getByLabelText('Collapse left panel');
    const rightCollapseButton = screen.getByLabelText('Collapse right panel');

    expect(leftCollapseButton).toBeInTheDocument();
    expect(rightCollapseButton).toBeInTheDocument();
  });
});
