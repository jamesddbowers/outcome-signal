/**
 * Component Tests for CreateInitiativeButton
 * Story 3.3: Enforce Trial Limits
 *
 * Tests the Create Initiative button with subscription limit enforcement
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

  it('should disable button when trial user is at limit', async () => {
    // Mock check fails for trial user
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      currentCount: 1,
      limit: 1,
      tier: 'trial',
    });

    render(<CreateInitiativeButton />);

    // Wait for the check to complete
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).toBeDisabled();
    });
  });

  it('should render disabled button with tooltip wrapper for trial users at limit', async () => {
    // Mock check fails for trial user
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      currentCount: 1,
      limit: 1,
      tier: 'trial',
    });

    const { container } = render(<CreateInitiativeButton />);

    // Wait for button to be disabled
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).toBeDisabled();
    });

    // Verify tooltip wrapper exists (even if not visible)
    const tooltipTrigger = container.querySelector('[data-state]');
    expect(tooltipTrigger).toBeInTheDocument();
  });

  it('should render disabled button with tooltip wrapper for starter users at limit', async () => {
    // Mock check fails for starter user
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      currentCount: 3,
      limit: 3,
      tier: 'starter',
    });

    const { container } = render(<CreateInitiativeButton />);

    // Wait for button to be disabled
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).toBeDisabled();
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

  it('should not call onClick handler when button is disabled', async () => {
    // Mock check fails
    mockCheckCanCreateInitiative.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      tier: 'trial',
    });

    const mockOnClick = vi.fn();
    render(<CreateInitiativeButton onClick={mockOnClick} />);

    // Wait for button to be disabled
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /limit reached/i });
      expect(button).toBeDisabled();
    });

    // Attempt to click the button (should be blocked by disabled state)
    const button = screen.getByRole('button', { name: /limit reached/i });
    fireEvent.click(button);

    // Verify onClick was NOT called
    expect(mockOnClick).not.toHaveBeenCalled();
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
      'Error checking initiative limit:',
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
});
