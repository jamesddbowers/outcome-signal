import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WorkspaceShell from '../WorkspaceShell';

// Mock child panel components
vi.mock('../LeftPanel', () => {
  const LeftPanel = ({ initiativeId }: { initiativeId: string }): JSX.Element => (
    <div data-testid="left-panel">Left Panel - {initiativeId}</div>
  );
  LeftPanel.displayName = 'LeftPanel';
  return { default: LeftPanel };
});

vi.mock('../MiddlePanel', () => {
  const MiddlePanel = ({ initiativeId }: { initiativeId: string }): JSX.Element => (
    <div data-testid="middle-panel">Middle Panel - {initiativeId}</div>
  );
  MiddlePanel.displayName = 'MiddlePanel';
  return { default: MiddlePanel };
});

vi.mock('../RightPanel', () => {
  const RightPanel = ({ initiativeId }: { initiativeId: string }): JSX.Element => (
    <div data-testid="right-panel">Right Panel - {initiativeId}</div>
  );
  RightPanel.displayName = 'RightPanel';
  return { default: RightPanel };
});

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

  // Use forwardRef to support refs and add mock methods
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

describe('WorkspaceShell', () => {
  const testInitiativeId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset window size to desktop
    global.innerWidth = 1440;
  });

  it('renders with initiative ID', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    // Check that panels receive the initiative ID
    // Text appears multiple times (desktop, tablet, mobile layouts)
    const leftPanelText = screen.getAllByText(`Left Panel - ${testInitiativeId}`);
    const middlePanelText = screen.getAllByText(`Middle Panel - ${testInitiativeId}`);
    const rightPanelText = screen.getAllByText(`Right Panel - ${testInitiativeId}`);

    expect(leftPanelText.length).toBeGreaterThan(0);
    expect(middlePanelText.length).toBeGreaterThan(0);
    expect(rightPanelText.length).toBeGreaterThan(0);
  });

  it('renders desktop layout with all three panels', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    // Desktop layout should be visible (hidden on smaller screens)
    // Note: panels appear multiple times (desktop, tablet, mobile layouts)
    const leftPanels = screen.getAllByTestId('left-panel');
    const middlePanels = screen.getAllByTestId('middle-panel');
    const rightPanels = screen.getAllByTestId('right-panel');

    expect(leftPanels.length).toBeGreaterThan(0);
    expect(middlePanels.length).toBeGreaterThan(0);
    expect(rightPanels.length).toBeGreaterThan(0);
  });

  it('renders collapse buttons for left and right panels', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    const buttons = screen.getAllByRole('button');

    // Should have at least 2 collapse buttons (left and right panels)
    // Plus potentially hamburger menu and tab triggers depending on viewport
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    // Check for specific aria labels (panels start expanded)
    const leftToggle = screen.getByLabelText('Collapse left panel');
    const rightToggle = screen.getByLabelText('Collapse right panel');

    expect(leftToggle).toBeInTheDocument();
    expect(rightToggle).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    // Collapse buttons should have aria-labels (expanded state)
    expect(screen.getByLabelText('Collapse left panel')).toBeInTheDocument();
    expect(screen.getByLabelText('Collapse right panel')).toBeInTheDocument();
  });

  it('uses autoSaveId for localStorage persistence', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    const panelGroup = screen.getAllByTestId('panel-group')[0];
    expect(panelGroup).toHaveAttribute('data-autosaveid', 'workspace-layout-v1');
  });

  it('renders tablet layout with hamburger menu', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    // Check for hamburger menu button (tablet layout)
    const hamburgerButton = screen.queryByLabelText('Open hierarchy menu');

    // On desktop, this might not be visible (hidden by CSS)
    // The component still renders it, just hidden
    expect(hamburgerButton).toBeInTheDocument();
  });

  it('renders mobile layout with tabs', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    // Check for tab triggers (mobile layout)
    const hierarchyTab = screen.getByRole('tab', { name: 'Hierarchy' });
    const documentTab = screen.getByRole('tab', { name: 'Document' });
    const chatTab = screen.getByRole('tab', { name: 'Chat' });

    expect(hierarchyTab).toBeInTheDocument();
    expect(documentTab).toBeInTheDocument();
    expect(chatTab).toBeInTheDocument();
  });

  it('allows tab navigation in mobile view', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    const hierarchyTab = screen.getByRole('tab', { name: 'Hierarchy' });
    const documentTab = screen.getByRole('tab', { name: 'Document' });
    const chatTab = screen.getByRole('tab', { name: 'Chat' });

    // Document tab should be active by default (as set in WorkspaceShell)
    expect(documentTab).toHaveAttribute('data-state', 'active');

    // Tabs should be interactive (have proper role)
    expect(hierarchyTab).toHaveAttribute('role', 'tab');
    expect(documentTab).toHaveAttribute('role', 'tab');
    expect(chatTab).toHaveAttribute('role', 'tab');
  });

  it('touch targets meet WCAG AA standards (44px minimum)', () => {
    render(<WorkspaceShell initiativeId={testInitiativeId} />);

    // Check collapse button size classes (expanded state)
    const leftToggle = screen.getByLabelText('Collapse left panel');
    const rightToggle = screen.getByLabelText('Collapse right panel');

    // h-11 w-11 = 44px x 44px (meets WCAG AA)
    expect(leftToggle).toHaveClass('h-11', 'w-11');
    expect(rightToggle).toHaveClass('h-11', 'w-11');
  });
});
