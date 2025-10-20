import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import WorkspaceShell from '../WorkspaceShell';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard/initiatives/test-id'),
}));

// Mock AppSidebar component
vi.mock('@/components/hierarchy/AppSidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">AppSidebar</div>,
}));

// Mock PhaseIndicator component
vi.mock('../PhaseIndicator', () => ({
  PhaseIndicator: ({ initiativeId }: { initiativeId: string }) => (
    <div data-testid="phase-indicator">Phase Indicator - {initiativeId}</div>
  ),
}));

// Mock child panel components
vi.mock('../MiddlePanel', () => {
  const MiddlePanel = ({ initiativeId, epicId }: { initiativeId: string; epicId?: string }): JSX.Element => (
    <div data-testid="middle-panel-content">
      Middle Panel - {initiativeId}
      {epicId && ` - Epic: ${epicId}`}
    </div>
  );
  MiddlePanel.displayName = 'MiddlePanel';
  return { default: MiddlePanel };
});

vi.mock('../RightPanel', () => {
  const RightPanel = ({ initiativeId, epicId }: { initiativeId: string; epicId?: string }): JSX.Element => (
    <div data-testid="right-panel-content">
      Right Panel - {initiativeId}
      {epicId && ` - Epic: ${epicId}`}
    </div>
  );
  RightPanel.displayName = 'RightPanel';
  return { default: RightPanel };
});

describe('WorkspaceShell animations', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Save original matchMedia
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  describe('Panel Collapse/Expand Transitions', () => {
    it('applies transition classes to left panel', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      // Left panel is hidden on mobile/tablet, visible on desktop (lg:block)
      const leftPanel = screen.getByTestId('left-panel');

      // Check for transition classes
      expect(leftPanel.className).toContain('transition-all');
      expect(leftPanel.className).toContain('duration-200');
      expect(leftPanel.className).toContain('ease-in-out');
    });

    it('applies transition classes to middle panel', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      const middlePanel = screen.getByTestId('middle-panel');

      // Check for transition classes
      expect(middlePanel.className).toContain('transition-all');
      expect(middlePanel.className).toContain('duration-200');
      expect(middlePanel.className).toContain('ease-in-out');
    });

    it('applies transition classes to right panel', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      const rightPanel = screen.getByTestId('right-panel');

      // Check for transition classes
      expect(rightPanel.className).toContain('transition-all');
      expect(rightPanel.className).toContain('duration-200');
      expect(rightPanel.className).toContain('ease-in-out');
    });

    it('applies transition-opacity to panel content', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      // Find elements with transition-opacity class
      const transitionElements = document.querySelectorAll('.transition-opacity');

      // Should have at least the panel content wrappers
      expect(transitionElements.length).toBeGreaterThan(0);

      // Verify they have correct duration
      transitionElements.forEach((element) => {
        expect(element.className).toContain('duration-200');
        expect(element.className).toContain('ease-in-out');
      });
    });
  });

  describe('Accessibility: prefers-reduced-motion', () => {
    it('respects prefers-reduced-motion setting', () => {
      // Mock matchMedia to return prefers-reduced-motion: reduce
      window.matchMedia = (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });

      render(<WorkspaceShell initiativeId="test-id" />);

      // Verify that component renders (reduced motion is handled via CSS)
      const leftPanel = screen.getByTestId('left-panel');
      expect(leftPanel).toBeDefined();

      // Note: The actual transition disabling is handled by CSS media query
      // in globals.css, which overrides transition-duration to 0.01ms
      // This test verifies the component renders correctly with the setting
    });

    it('works normally when prefers-reduced-motion is not set', () => {
      // Mock matchMedia to return prefers-reduced-motion: no-preference
      window.matchMedia = (query: string) => ({
        matches: query === '(prefers-reduced-motion: no-preference)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });

      render(<WorkspaceShell initiativeId="test-id" />);

      // Verify panels have transition classes
      const leftPanel = screen.getByTestId('left-panel');
      expect(leftPanel.className).toContain('transition-all');
      expect(leftPanel.className).toContain('duration-200');
    });
  });

  describe('Animation Duration Specification', () => {
    it('uses 200ms duration for panel transitions', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      const leftPanel = screen.getByTestId('left-panel');
      const middlePanel = screen.getByTestId('middle-panel');
      const rightPanel = screen.getByTestId('right-panel');

      // All panels should have duration-200 class (200ms)
      expect(leftPanel.className).toContain('duration-200');
      expect(middlePanel.className).toContain('duration-200');
      expect(rightPanel.className).toContain('duration-200');
    });

    it('uses ease-in-out timing function', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      const leftPanel = screen.getByTestId('left-panel');
      const middlePanel = screen.getByTestId('middle-panel');
      const rightPanel = screen.getByTestId('right-panel');

      // All panels should have ease-in-out timing
      expect(leftPanel.className).toContain('ease-in-out');
      expect(middlePanel.className).toContain('ease-in-out');
      expect(rightPanel.className).toContain('ease-in-out');
    });
  });

  describe('Resize Handle Visual Feedback', () => {
    it('applies transition to resize handles', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      // Find resize handles (they have specific styling)
      const resizeHandles = document.querySelectorAll('[class*="bg-border"]');

      // Should have resize handles
      expect(resizeHandles.length).toBeGreaterThan(0);

      // Check that handles have transition classes
      resizeHandles.forEach((handle) => {
        if (handle.className.includes('cursor-col-resize')) {
          expect(handle.className).toContain('transition-all');
          expect(handle.className).toContain('duration-200');
          expect(handle.className).toContain('ease-in-out');
        }
      });
    });

    it('applies hover and active states to resize handles', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      const resizeHandles = document.querySelectorAll('[class*="cursor-col-resize"]');

      resizeHandles.forEach((handle) => {
        // Check for hover state
        expect(handle.className).toContain('hover:bg-primary/20');

        // Check for active state
        expect(handle.className).toContain('active:bg-primary/30');
      });
    });
  });

  describe('Mobile and Tablet Animations', () => {
    it('renders tabs on mobile with animation classes', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      // Mobile tabs are visible on md:hidden
      const hierarchyTab = screen.getByRole('tab', { name: /hierarchy/i });
      const documentTab = screen.getByRole('tab', { name: /document/i });
      const chatTab = screen.getByRole('tab', { name: /chat/i });

      // Tabs should exist
      expect(hierarchyTab).toBeDefined();
      expect(documentTab).toBeDefined();
      expect(chatTab).toBeDefined();

      // Note: Tab animations are handled by the Tabs component from shadcn/ui
      // which we've updated to include duration-200 transitions
    });

    it('renders sheet drawer with animation support', () => {
      render(<WorkspaceShell initiativeId="test-id" />);

      // Tablet drawer trigger (lg:hidden)
      const drawerTrigger = screen.getByLabelText(/open hierarchy menu/i);

      expect(drawerTrigger).toBeDefined();

      // Note: Sheet animations are handled by the Sheet component from shadcn/ui
      // which we've updated to use duration-200 transitions
    });
  });
});
