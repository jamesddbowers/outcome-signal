/**
 * Unit Tests for Subscription Helper Functions
 * Story 3.2: Implement Trial Signup Flow
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTrialDaysRemaining,
  formatTrialStatus,
} from '../subscription-helpers';

describe('calculateTrialDaysRemaining', () => {
  it('should return null for null input', () => {
    expect(calculateTrialDaysRemaining(null)).toBeNull();
  });

  it('should return 6 for trial ending in 6 days', () => {
    // Create a date exactly 6 days in the future
    const sixDaysFromNow = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateTrialDaysRemaining(sixDaysFromNow);

    // Should be 6 or 7 depending on rounding (Math.ceil)
    expect(result).toBeGreaterThanOrEqual(6);
    expect(result).toBeLessThanOrEqual(7);
  });

  it('should return 1 for trial ending in 1 day', () => {
    // Create a date exactly 1 day in the future
    const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const result = calculateTrialDaysRemaining(oneDayFromNow);

    // Should be 1 or 2 depending on rounding (Math.ceil)
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(2);
  });

  it('should return 0 for expired trial (past date)', () => {
    // Create a date 1 day in the past
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(calculateTrialDaysRemaining(yesterday)).toBe(0);
  });

  it('should return 0 for trial ending right now', () => {
    // Create a date very close to now (a few seconds ago)
    const almostNow = new Date(Date.now() - 1000).toISOString();
    expect(calculateTrialDaysRemaining(almostNow)).toBe(0);
  });

  it('should handle dates far in the future', () => {
    // 30 days from now
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateTrialDaysRemaining(thirtyDaysFromNow);

    expect(result).toBeGreaterThanOrEqual(29);
    expect(result).toBeLessThanOrEqual(31);
  });
});

describe('formatTrialStatus', () => {
  it('should return "Trial expired" for 0 days', () => {
    expect(formatTrialStatus(0)).toBe('Trial expired');
  });

  it('should return "Trial: 1 day remaining" for 1 day', () => {
    expect(formatTrialStatus(1)).toBe('Trial: 1 day remaining');
  });

  it('should return "Trial: 6 days remaining" for 6 days', () => {
    expect(formatTrialStatus(6)).toBe('Trial: 6 days remaining');
  });

  it('should return "Trial: 2 days remaining" for 2 days', () => {
    expect(formatTrialStatus(2)).toBe('Trial: 2 days remaining');
  });

  it('should use plural "days" for numbers greater than 1', () => {
    expect(formatTrialStatus(7)).toBe('Trial: 7 days remaining');
    expect(formatTrialStatus(100)).toBe('Trial: 100 days remaining');
  });

  it('should use singular "day" only for exactly 1', () => {
    expect(formatTrialStatus(1)).toContain('day remaining');
    expect(formatTrialStatus(1)).not.toContain('days remaining');
  });
});
