/**
 * Component Tests for Trial Badge
 * Story 3.2: Implement Trial Signup Flow
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrialBadge from '../TrialBadge';
import type { Database } from '@/lib/supabase/database.types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

describe('TrialBadge', () => {
  it('should render trial status badge for trial user with 6 days remaining', () => {
    // Mock subscription data
    const mockSubscription: Subscription = {
      id: 'sub_123',
      user_id: 'user_123',
      tier: 'trial',
      status: 'active',
      trial_ends_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      stripe_subscription_id: null,
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Render component
    render(<TrialBadge subscription={mockSubscription} />);

    // Should display trial status with days remaining
    expect(screen.getByText(/Trial: \d+ days? remaining/)).toBeInTheDocument();
  });

  it('should not render badge for non-trial users', () => {
    // Mock non-trial subscription
    const mockSubscription: Subscription = {
      id: 'sub_123',
      user_id: 'user_123',
      tier: 'starter',
      status: 'active',
      trial_ends_at: null,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      stripe_subscription_id: 'sub_stripe_123',
      stripe_customer_id: 'cus_stripe_123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Render component
    const { container } = render(<TrialBadge subscription={mockSubscription} />);

    // Should not render any badge for non-trial users
    expect(container.firstChild).toBeNull();
  });

  it('should render warning style badge when days < 2', () => {
    // Mock subscription with 1 day remaining
    const mockSubscription: Subscription = {
      id: 'sub_123',
      user_id: 'user_123',
      tier: 'trial',
      status: 'active',
      trial_ends_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      stripe_subscription_id: null,
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Render component
    const { container } = render(<TrialBadge subscription={mockSubscription} />);

    // Should display trial status
    expect(screen.getByText(/Trial: 1 day remaining/)).toBeInTheDocument();

    // Verify badge has destructive variant (warning style)
    const badge = container.querySelector('[class*="destructive"]');
    expect(badge).toBeInTheDocument();
  });

  it('should handle null subscription gracefully', () => {
    // Render component with null subscription
    const { container } = render(<TrialBadge subscription={null} />);

    // Should not render anything when no subscription
    expect(container.firstChild).toBeNull();
  });

  it('should display "Trial expired" for expired trials', () => {
    // Mock expired trial
    const mockSubscription: Subscription = {
      id: 'sub_123',
      user_id: 'user_123',
      tier: 'trial',
      status: 'active',
      trial_ends_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      stripe_subscription_id: null,
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Render component
    render(<TrialBadge subscription={mockSubscription} />);

    // Should display expired status
    expect(screen.getByText('Trial expired')).toBeInTheDocument();
  });

  it('should handle null trial_ends_at gracefully', () => {
    // Mock trial subscription with null trial_ends_at (edge case)
    const mockSubscription: Subscription = {
      id: 'sub_123',
      user_id: 'user_123',
      tier: 'trial',
      status: 'active',
      trial_ends_at: null,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      stripe_subscription_id: null,
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Render component
    const { container } = render(<TrialBadge subscription={mockSubscription} />);

    // Should not render anything when trial_ends_at is null
    expect(container.firstChild).toBeNull();
  });
});
