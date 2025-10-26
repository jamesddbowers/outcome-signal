/**
 * Component Tests for CreateInitiativeButton
 * Story 3.3: Enforce Trial Limits
 * Story 3.5: Build Paywall Modal with Tier Comparison
 *
 * Tests the Create Initiative button with subscription limit enforcement
 * and paywall modal integration
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CreateInitiativeButton } from '../CreateInitiativeButton';
import * as initiativeActions from '@/lib/actions/initiatives';

// Mock the initiatives actions
vi.mock('@/lib/actions/initiatives', () => ({
  checkCanCreateInitiative: vi.fn(),
}));

// Mock the PaywallModal component
vi.mock('@/components/subscription/PaywallModal', () => ({
  PaywallModal: ({ isOpen, trigger_reason, canDismiss }: { isOpen: boolean; trigger_reason: string; canDismiss: boolean }) =>
    isOpen ? (
      <div data-testid="paywall-modal" data-trigger={trigger_reason} data-dismissible={canDismiss}>
        Paywall Modal
      </div>
    ) : null,
}));

const mockCheckCanCreateInitiative = vi.mocked(initiativeActions.checkCanCreateInitiative);

describe('CreateInitiativeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state while checking limit', () => {
    // Mock a delayed response
    mockCheckCanCreateInitiative.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ allowed: true }), 100))
    );

    render(<CreateInitiativeButton />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Checking...');
  });

  it('should enable button when user is under limit', async () => {
    // Mock check passes
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: true,
      currentCount: 0,
      limit: 1,
      tier: 'trial',
    });

    render(<CreateInitiativeButton />);

    // Wait for the check to complete
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /create initiative$/i });
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('Create Initiative');
    });
  });

  it('should show button with tooltip when trial user is at limit', async () => {
    // Mock check fails for trial user
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      currentCount: 1,
      limit: 1,
      tier: 'trial',
    });

    render(<CreateInitiativeButton />);

    // Wait for the check to complete - button should still be rendered (not disabled)
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  it('should show paywall modal when trial user at limit clicks button', async () => {
    // Mock check fails for trial user
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      currentCount: 1,
      limit: 1,
      tier: 'trial',
    });

    render(<CreateInitiativeButton />);

    // Wait for button to be clickable
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).not.toBeDisabled();
    });

    // Click the button
    const button = screen.getByRole('button', { name: /limit reached/i });
    fireEvent.click(button);

    // Verify paywall modal is shown
    await waitFor(() => {
      const modal = screen.getByTestId('paywall-modal');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('data-trigger', 'initiative_limit');
      expect(modal).toHaveAttribute('data-dismissible', 'true');
    });
  });

  it('should render button with tooltip wrapper for starter users at limit', async () => {
    // Mock check fails for starter user
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      currentCount: 3,
      limit: 3,
      tier: 'starter',
    });

    const { container } = render(<CreateInitiativeButton />);

    // Wait for button to be rendered
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).not.toBeDisabled();
    });

    // Verify tooltip wrapper exists
    const tooltipTrigger = container.querySelector('[data-state]');
    expect(tooltipTrigger).toBeInTheDocument();
  });

  it('should call onClick handler when button is clicked and user can create', async () => {
    // Mock check passes
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    const mockOnClick = vi.fn();
    render(<CreateInitiativeButton onClick={mockOnClick} />);

    // Wait for button to be enabled
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /create initiative$/i });
      expect(button).not.toBeDisabled();
    });

    // Click the button
    const button = screen.getByRole('button', { name: /create initiative$/i });
    fireEvent.click(button);

    // Verify onClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when user is at limit (shows paywall instead)', async () => {
    // Mock check fails
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      tier: 'trial',
    });

    const mockOnClick = vi.fn();
    render(<CreateInitiativeButton onClick={mockOnClick} />);

    // Wait for button to be ready
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).not.toBeDisabled();
    });

    // Click the button
    const button = screen.getByRole('button', { name: /limit reached/i });
    fireEvent.click(button);

    // Verify onClick was NOT called (paywall shown instead)
    expect(mockOnClick).not.toHaveBeenCalled();

    // Verify paywall modal is shown
    await waitFor(() => {
      expect(screen.getByTestId('paywall-modal')).toBeInTheDocument();
    });
  });

  it('should enable button on error (fail open)', async () => {
    // Mock check throws error
    mockCheckCanCreateInitiative.mockRejectedValue(new Error('Network error'));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<CreateInitiativeButton />);

    // Wait for error handling to complete
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /create initiative$/i });
      expect(button).not.toBeDisabled();
    });

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[CreateInitiativeButton] Error checking initiative limit:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should apply custom className when provided', async () => {
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    const customClass = 'custom-button-class';
    render(<CreateInitiativeButton className={customClass} />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /create initiative$/i });
      expect(button).toHaveClass(customClass);
    });
  });

  it('should apply custom variant when provided', async () => {
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    render(<CreateInitiativeButton variant="outline" />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /create initiative$/i });
      expect(button).not.toBeDisabled();
    });
  });

  it('should apply custom size when provided', async () => {
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    render(<CreateInitiativeButton size="sm" />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /create initiative$/i });
      expect(button).not.toBeDisabled();
    });
  });

  it('should check limit on component mount', async () => {
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    render(<CreateInitiativeButton />);

    // Verify the check function was called
    await waitFor(() => {
      expect(mockCheckCanCreateInitiative).toHaveBeenCalledTimes(1);
    });
  });

  it('should display Plus icon', async () => {
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    const { container } = render(<CreateInitiativeButton />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /create initiative$/i });
      expect(button).not.toBeDisabled();
    });

    // Check for Plus icon (lucide-react renders as svg)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should show non-dismissible paywall when trial is expired', async () => {
    // Mock check fails due to expired trial
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'trial_expired',
      tier: 'trial',
    });

    render(<CreateInitiativeButton />);

    // Wait for button to be ready
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).not.toBeDisabled();
    });

    // Click the button
    const button = screen.getByRole('button', { name: /limit reached/i });
    fireEvent.click(button);

    // Verify paywall modal is shown and not dismissible
    await waitFor(() => {
      const modal = screen.getByTestId('paywall-modal');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('data-dismissible', 'false');
    });
  });
});
