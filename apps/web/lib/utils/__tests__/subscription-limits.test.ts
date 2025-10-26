/**
 * Unit Tests for Subscription Limit Utilities
 * Story 3.3: Enforce Trial Limits
 *
 * Tests the subscription limit checking functions:
 * - checkInitiativeLimit
 * - checkDocumentGenerationLimit
 * - checkExportLimit
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkInitiativeLimit, checkDocumentGenerationLimit, checkExportLimit } from '../subscription-limits';
import { createAdminClient } from '@/lib/supabase/server';

// Mock the Supabase admin client
vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: vi.fn(),
}));

const mockCreateAdminClient = vi.mocked(createAdminClient);

describe('Subscription Limit Utilities', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('checkInitiativeLimit', () => {
    it('should allow initiative creation when under limit', async () => {
      // Create mock client with chained methods
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      // Setup mock responses for each query
      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null }) // User lookup
        .mockResolvedValueOnce({ data: { tier: 'trial' }, error: null }) // Subscription lookup
        .mockResolvedValueOnce({ data: { initiatives_count: 0, initiatives_limit: 1 }, error: null }); // Usage lookup

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkInitiativeLimit('clerk-user-123');

      expect(result.allowed).toBe(true);
      expect(result.currentCount).toBe(0);
      expect(result.limit).toBe(1);
      expect(result.tier).toBe('trial');
    });

    it('should block initiative creation when at limit', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      // Setup mock responses - user has reached limit
      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'trial' }, error: null })
        .mockResolvedValueOnce({ data: { initiatives_count: 1, initiatives_limit: 1 }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkInitiativeLimit('clerk-user-123');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('limit_reached');
      expect(result.currentCount).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.tier).toBe('trial');
    });

    it('should allow unlimited initiatives for Professional tier', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      // Setup mock responses - Professional tier has unlimited
      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'professional' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkInitiativeLimit('clerk-user-123');

      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('professional');
      expect(result.currentCount).toBeUndefined();
      expect(result.limit).toBeUndefined();
    });

    it('should allow creation when user not found (temporary fail-open for development)', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      // User lookup fails
      mockClient.single.mockResolvedValueOnce({ data: null, error: { message: 'User not found' } });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkInitiativeLimit('clerk-user-invalid');

      // TEMPORARY: Currently fails open for development (see subscription-limits.ts:81-92)
      // This test should be updated to expect false/unauthorized once that temporary code is removed
      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('trial');
    });

    it('should block initiative creation when trial is expired', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      // Setup mock responses - trial subscription is expired
      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null }) // User lookup
        .mockResolvedValueOnce({ data: { tier: 'trial', status: 'expired' }, error: null }); // Subscription lookup with expired status

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkInitiativeLimit('clerk-user-123');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('trial_expired');
      expect(result.tier).toBe('trial');
    });

    it('should block expired trials even if under usage limit', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      // Setup mock responses - trial is expired but user has 0 initiatives (under limit)
      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null }) // User lookup
        .mockResolvedValueOnce({ data: { tier: 'trial', status: 'expired' }, error: null }); // Expired subscription

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkInitiativeLimit('clerk-user-123');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('trial_expired');
      expect(result.tier).toBe('trial');
      // Should not even check usage when expired
      expect(result.currentCount).toBeUndefined();
      expect(result.limit).toBeUndefined();
    });

    it('should allow active trials with valid trial_ends_at date', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      // Setup mock responses - active trial
      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null }) // User lookup
        .mockResolvedValueOnce({ data: { tier: 'trial', status: 'active' }, error: null }) // Active subscription
        .mockResolvedValueOnce({ data: { initiatives_count: 0, initiatives_limit: 1 }, error: null }); // Usage lookup

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkInitiativeLimit('clerk-user-123');

      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('trial');
      expect(result.currentCount).toBe(0);
      expect(result.limit).toBe(1);
    });
  });

  describe('checkDocumentGenerationLimit', () => {
    it('should allow Brief document for trial users', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'trial' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkDocumentGenerationLimit('clerk-user-123', 'brief');

      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('trial');
    });

    it('should block PRD document for trial users', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'trial' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkDocumentGenerationLimit('clerk-user-123', 'prd');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('document_type_restricted');
      expect(result.tier).toBe('trial');
    });

    it('should allow all document types for Starter tier', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'starter' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkDocumentGenerationLimit('clerk-user-123', 'prd');

      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('starter');
    });

    it('should allow all document types for Professional tier', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'professional' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkDocumentGenerationLimit('clerk-user-123', 'architecture');

      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('professional');
    });
  });

  describe('checkExportLimit', () => {
    it('should block export for trial users', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'trial' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkExportLimit('clerk-user-123');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('export_restricted');
      expect(result.tier).toBe('trial');
    });

    it('should allow export for Starter tier', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'starter' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkExportLimit('clerk-user-123');

      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('starter');
    });

    it('should allow export for Professional tier', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'professional' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkExportLimit('clerk-user-123');

      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('professional');
    });

    it('should allow export for Enterprise tier', async () => {
      // Create mock client
      const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockClient.single
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: { tier: 'enterprise' }, error: null });

      mockCreateAdminClient.mockReturnValue(mockClient as any);

      const result = await checkExportLimit('clerk-user-123');

      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('enterprise');
    });
  });
});
