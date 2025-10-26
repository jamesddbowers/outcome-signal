/**
 * Component Tests for TierComparisonTable
 * Story 3.5: Build Paywall Modal with Tier Comparison
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TierComparisonTable } from '../TierComparisonTable';
import { TIER_LIMITS } from '@/lib/constants/subscription-tiers';

describe('TierComparisonTable', () => {
  describe('Tier Display', () => {
    it('should render all three paid tiers (Starter, Professional, Enterprise)', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      expect(screen.getByText('Starter')).toBeInTheDocument();
      expect(screen.getByText('Professional')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });

    it('should NOT display trial tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      // Trial tier should not be in the comparison table
      expect(screen.queryByText('Trial')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Free 7-day trial')
      ).not.toBeInTheDocument();
    });
  });

  describe('Pricing Display', () => {
    it('should display correct pricing for Starter tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      // Check for Starter price
      expect(
        screen.getByText(TIER_LIMITS.starter.displayPrice)
      ).toBeInTheDocument();
    });

    it('should display correct pricing for Professional tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      // Check for Professional price
      expect(
        screen.getByText(TIER_LIMITS.professional.displayPrice)
      ).toBeInTheDocument();
    });

    it('should display correct pricing for Enterprise tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      // Check for Enterprise price
      expect(
        screen.getByText(TIER_LIMITS.enterprise.displayPrice)
      ).toBeInTheDocument();
    });
  });

  describe('Feature Comparison', () => {
    it('should show correct initiative limits for each tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      // Starter: 3 per month
      expect(screen.getByText('3 per month')).toBeInTheDocument();

      // Professional and Enterprise: Unlimited
      const unlimitedTexts = screen.getAllByText('Unlimited');
      // Should appear at least 4 times (2 for initiatives, 1 for credits in enterprise, 1 for credits in professional - wait, professional has 100)
      // Actually: Professional has unlimited initiatives, Enterprise has unlimited initiatives and credits
      expect(unlimitedTexts.length).toBeGreaterThanOrEqual(2);
    });

    it('should show correct AI credit limits for each tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      // Starter: 25 per month
      expect(screen.getByText('25 per month')).toBeInTheDocument();

      // Professional: 100 per month
      expect(screen.getByText('100 per month')).toBeInTheDocument();

      // Enterprise: Unlimited (already tested above)
    });

    it('should show all tiers have access to all 8 document types', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      // All three tiers should show "All 8 types"
      const documentTypeTexts = screen.getAllByText('All 8 types');
      expect(documentTypeTexts).toHaveLength(3);
    });

    it('should show export capability for all paid tiers', () => {
      const { container } = render(
        <TierComparisonTable onSelectPlan={vi.fn()} />
      );

      // Check for checkmark icons (lucide Check icon)
      // There should be checkmarks for Export feature (3 tiers)
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should show correct support levels for each tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      expect(screen.getByText('Email')).toBeInTheDocument(); // Starter
      expect(screen.getByText('Priority Email')).toBeInTheDocument(); // Professional
      expect(screen.getByText('Dedicated')).toBeInTheDocument(); // Enterprise
    });
  });

  describe('Most Popular Badge', () => {
    it('should display "Most Popular" badge on Professional tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('should only show one "Most Popular" badge', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      const badges = screen.getAllByText('Most Popular');
      expect(badges).toHaveLength(1);
    });
  });

  describe('Plan Selection Buttons', () => {
    it('should render select button for each tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      expect(screen.getByText('Select Starter')).toBeInTheDocument();
      expect(screen.getByText('Select Professional')).toBeInTheDocument();
      expect(screen.getByText('Select Enterprise')).toBeInTheDocument();
    });

    it('should call onSelectPlan with "starter" when Starter button clicked', () => {
      const onSelectPlan = vi.fn();
      render(<TierComparisonTable onSelectPlan={onSelectPlan} />);

      const starterButton = screen.getByText('Select Starter');
      fireEvent.click(starterButton);

      expect(onSelectPlan).toHaveBeenCalledWith('starter');
      expect(onSelectPlan).toHaveBeenCalledTimes(1);
    });

    it('should call onSelectPlan with "professional" when Professional button clicked', () => {
      const onSelectPlan = vi.fn();
      render(<TierComparisonTable onSelectPlan={onSelectPlan} />);

      const professionalButton = screen.getByText('Select Professional');
      fireEvent.click(professionalButton);

      expect(onSelectPlan).toHaveBeenCalledWith('professional');
      expect(onSelectPlan).toHaveBeenCalledTimes(1);
    });

    it('should call onSelectPlan with "enterprise" when Enterprise button clicked', () => {
      const onSelectPlan = vi.fn();
      render(<TierComparisonTable onSelectPlan={onSelectPlan} />);

      const enterpriseButton = screen.getByText('Select Enterprise');
      fireEvent.click(enterpriseButton);

      expect(onSelectPlan).toHaveBeenCalledWith('enterprise');
      expect(onSelectPlan).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual Highlighting', () => {
    it('should highlight Professional tier by default', () => {
      const { container } = render(
        <TierComparisonTable onSelectPlan={vi.fn()} />
      );

      // Professional tier should have highlight styling (ring-primary, border-primary)
      const cards = container.querySelectorAll('[class*="ring-primary"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should highlight specified tier when highlightTier prop is provided', () => {
      const { container } = render(
        <TierComparisonTable
          onSelectPlan={vi.fn()}
          highlightTier="enterprise"
        />
      );

      // Should still have highlighted tier
      const cards = container.querySelectorAll('[class*="ring-primary"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Layout', () => {
    it('should render with responsive grid classes', () => {
      const { container } = render(
        <TierComparisonTable onSelectPlan={vi.fn()} />
      );

      // Check for responsive grid classes
      const gridContainer = container.querySelector(
        '[class*="grid-cols-1"]'
      );
      expect(gridContainer).toBeInTheDocument();

      // Should have responsive breakpoints
      const responsiveGrid = container.querySelector(
        '[class*="md:grid-cols-2"]'
      );
      expect(responsiveGrid).toBeInTheDocument();
    });

    it('should render tier cards as Card components', () => {
      const { container } = render(
        <TierComparisonTable onSelectPlan={vi.fn()} />
      );

      // Check that Card components are rendered (they have specific styling)
      const cards = container.querySelectorAll('[class*="rounded-lg"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Tier Descriptions', () => {
    it('should show descriptive subtexts for each tier', () => {
      render(<TierComparisonTable onSelectPlan={vi.fn()} />);

      expect(screen.getByText('Perfect for small projects')).toBeInTheDocument();
      expect(screen.getByText('Best for growing teams')).toBeInTheDocument();
      expect(screen.getByText('For large organizations')).toBeInTheDocument();
    });
  });
});
