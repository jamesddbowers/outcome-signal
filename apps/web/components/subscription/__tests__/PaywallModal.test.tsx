/**
 * Component Tests for PaywallModal
 * Story 3.5: Build Paywall Modal with Tier Comparison
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaywallModal } from '../PaywallModal';

// Mock the analytics module
vi.mock('@/lib/analytics/paywall-events', () => ({
  trackPaywallShown: vi.fn(),
  trackPaywallDismissed: vi.fn(),
  trackPlanSelected: vi.fn(),
}));

// Mock the TierComparisonTable component
vi.mock('../TierComparisonTable', () => ({
  TierComparisonTable: ({
    onSelectPlan,
  }: {
    onSelectPlan: (tier: string) => void;
  }) => (
    <div data-testid="tier-comparison-table">
      <button
        data-testid="select-starter"
        onClick={() => onSelectPlan('starter')}
      >
        Select Starter
      </button>
      <button
        data-testid="select-professional"
        onClick={() => onSelectPlan('professional')}
      >
        Select Professional
      </button>
      <button
        data-testid="select-enterprise"
        onClick={() => onSelectPlan('enterprise')}
      >
        Select Enterprise
      </button>
    </div>
  ),
}));

describe('PaywallModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Content Based on Trigger Reason', () => {
    it('should display correct title for trial_expired trigger', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="trial_expired"
          canDismiss={false}
        />
      );

      expect(screen.getByText('Your Trial Has Expired')).toBeInTheDocument();
      expect(
        screen.getByText(/Your 7-day free trial has ended/)
      ).toBeInTheDocument();
    });

    it('should display correct title for initiative_limit trigger', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      expect(screen.getByText('Initiative Limit Reached')).toBeInTheDocument();
      expect(
        screen.getByText(/reached your initiative limit/)
      ).toBeInTheDocument();
    });

    it('should display correct title for document_limit trigger', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="document_limit"
          canDismiss={true}
        />
      );

      expect(
        screen.getByText('Document Generation Limit Reached')
      ).toBeInTheDocument();
    });

    it('should display correct title for export_limit trigger', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="export_limit"
          canDismiss={true}
        />
      );

      expect(screen.getByText('Export Not Available')).toBeInTheDocument();
    });
  });

  describe('Tier Comparison Display', () => {
    it('should render tier comparison table', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      expect(screen.getByTestId('tier-comparison-table')).toBeInTheDocument();
    });

    it('should display all three paid tiers', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      // Verify tier selection buttons exist
      expect(screen.getByTestId('select-starter')).toBeInTheDocument();
      expect(screen.getByTestId('select-professional')).toBeInTheDocument();
      expect(screen.getByTestId('select-enterprise')).toBeInTheDocument();
    });
  });

  describe('Modal Dismissibility', () => {
    it('should show dismiss button when canDismiss is true', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      expect(screen.getByText('Maybe Later')).toBeInTheDocument();
    });

    it('should NOT show dismiss button when canDismiss is false', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="trial_expired"
          canDismiss={false}
        />
      );

      expect(screen.queryByText('Maybe Later')).not.toBeInTheDocument();
    });

    it('should call onClose when dismiss button is clicked', () => {
      const onClose = vi.fn();

      render(
        <PaywallModal
          isOpen={true}
          onClose={onClose}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      const dismissButton = screen.getByText('Maybe Later');
      fireEvent.click(dismissButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Plan Selection', () => {
    it('should call onSelectPlan with correct tier when plan button clicked', () => {
      const onSelectPlan = vi.fn();

      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
          onSelectPlan={onSelectPlan}
        />
      );

      const professionalButton = screen.getByTestId('select-professional');
      fireEvent.click(professionalButton);

      expect(onSelectPlan).toHaveBeenCalledWith('professional');
    });

    it('should log to console when no onSelectPlan callback provided', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      const starterButton = screen.getByTestId('select-starter');
      fireEvent.click(starterButton);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Navigate to Stripe Checkout for tier:',
        'starter'
      );

      consoleSpy.mockRestore();
    });

    it('should handle selection of all tiers correctly', () => {
      const onSelectPlan = vi.fn();

      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
          onSelectPlan={onSelectPlan}
        />
      );

      // Test Starter
      fireEvent.click(screen.getByTestId('select-starter'));
      expect(onSelectPlan).toHaveBeenCalledWith('starter');

      // Test Professional
      fireEvent.click(screen.getByTestId('select-professional'));
      expect(onSelectPlan).toHaveBeenCalledWith('professional');

      // Test Enterprise
      fireEvent.click(screen.getByTestId('select-enterprise'));
      expect(onSelectPlan).toHaveBeenCalledWith('enterprise');

      expect(onSelectPlan).toHaveBeenCalledTimes(3);
    });
  });

  describe('Analytics Tracking', () => {
    it('should track paywall shown event when modal opens', async () => {
      const { trackPaywallShown } = await import(
        '@/lib/analytics/paywall-events'
      );

      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      await waitFor(() => {
        expect(trackPaywallShown).toHaveBeenCalledWith('initiative_limit');
      });
    });

    it('should track plan selected event when plan is chosen', async () => {
      const { trackPlanSelected } = await import(
        '@/lib/analytics/paywall-events'
      );

      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="document_limit"
          canDismiss={true}
        />
      );

      const professionalButton = screen.getByTestId('select-professional');
      fireEvent.click(professionalButton);

      await waitFor(() => {
        expect(trackPlanSelected).toHaveBeenCalledWith(
          'professional',
          'document_limit'
        );
      });
    });
  });

  describe('Modal Behavior', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <PaywallModal
          isOpen={false}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      // Modal should not be visible
      expect(
        container.querySelector('[role="dialog"]')
      ).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <PaywallModal
          isOpen={true}
          onClose={vi.fn()}
          trigger_reason="initiative_limit"
          canDismiss={true}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
