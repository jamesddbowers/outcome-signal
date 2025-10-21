/**
 * Unit Tests for Subscription Tier Limits
 * Story 3.1: Create Subscription Tier Data Model
 */

import { describe, it, expect } from 'vitest';
import {
  getTierLimits,
  TIER_LIMITS,
  isDocumentTypeAllowed,
  isUnlimited,
  type SubscriptionTier,
  type DocumentType,
} from '../subscription-tiers';

describe('Subscription Tier Limits', () => {
  describe('getTierLimits', () => {
    it('should return correct limits for trial tier', () => {
      const limits = getTierLimits('trial');
      
      expect(limits.tier).toBe('trial');
      expect(limits.initiativesLimit).toBe(1);
      expect(limits.creditsLimit).toBe(0);
      expect(limits.allowedDocumentTypes).toEqual(['brief']);
      expect(limits.trialDurationDays).toBe(7);
      expect(limits.exportEnabled).toBe(false);
    });

    it('should return correct limits for starter tier', () => {
      const limits = getTierLimits('starter');
      
      expect(limits.tier).toBe('starter');
      expect(limits.initiativesLimit).toBe(3);
      expect(limits.creditsLimit).toBe(25);
      expect(limits.allowedDocumentTypes).toHaveLength(8);
      expect(limits.allowedDocumentTypes).toContain('brief');
      expect(limits.allowedDocumentTypes).toContain('prd');
      expect(limits.allowedDocumentTypes).toContain('architecture');
      expect(limits.trialDurationDays).toBeNull();
      expect(limits.exportEnabled).toBe(true);
    });

    it('should return correct limits for professional tier', () => {
      const limits = getTierLimits('professional');
      
      expect(limits.tier).toBe('professional');
      expect(limits.initiativesLimit).toBe(-1); // Unlimited
      expect(limits.creditsLimit).toBe(100);
      expect(limits.allowedDocumentTypes).toHaveLength(8);
      expect(limits.trialDurationDays).toBeNull();
      expect(limits.exportEnabled).toBe(true);
    });

    it('should return correct limits for enterprise tier', () => {
      const limits = getTierLimits('enterprise');
      
      expect(limits.tier).toBe('enterprise');
      expect(limits.initiativesLimit).toBe(-1); // Unlimited
      expect(limits.creditsLimit).toBe(-1); // Unlimited
      expect(limits.allowedDocumentTypes).toHaveLength(8);
      expect(limits.trialDurationDays).toBeNull();
      expect(limits.exportEnabled).toBe(true);
    });
  });

  describe('Document Type Restrictions', () => {
    it('trial tier should only allow brief document type', () => {
      const limits = getTierLimits('trial');
      
      expect(limits.allowedDocumentTypes).toHaveLength(1);
      expect(limits.allowedDocumentTypes).toEqual(['brief']);
    });

    it('starter tier should allow all 8 document types', () => {
      const limits = getTierLimits('starter');
      
      expect(limits.allowedDocumentTypes).toHaveLength(8);
      expect(limits.allowedDocumentTypes).toContain('brief');
      expect(limits.allowedDocumentTypes).toContain('market_research');
      expect(limits.allowedDocumentTypes).toContain('competitive_analysis');
      expect(limits.allowedDocumentTypes).toContain('prd');
      expect(limits.allowedDocumentTypes).toContain('architecture');
      expect(limits.allowedDocumentTypes).toContain('ux_overview');
      expect(limits.allowedDocumentTypes).toContain('security_review');
      expect(limits.allowedDocumentTypes).toContain('qa_strategy');
    });

    it('professional tier should allow all 8 document types', () => {
      const limits = getTierLimits('professional');
      expect(limits.allowedDocumentTypes).toHaveLength(8);
    });

    it('enterprise tier should allow all 8 document types', () => {
      const limits = getTierLimits('enterprise');
      expect(limits.allowedDocumentTypes).toHaveLength(8);
    });
  });

  describe('Unlimited Resources', () => {
    it('professional tier should have unlimited initiatives', () => {
      const limits = getTierLimits('professional');
      expect(limits.initiativesLimit).toBe(-1);
    });

    it('professional tier should have limited credits', () => {
      const limits = getTierLimits('professional');
      expect(limits.creditsLimit).toBe(100);
      expect(limits.creditsLimit).not.toBe(-1);
    });

    it('enterprise tier should have unlimited initiatives', () => {
      const limits = getTierLimits('enterprise');
      expect(limits.initiativesLimit).toBe(-1);
    });

    it('enterprise tier should have unlimited credits', () => {
      const limits = getTierLimits('enterprise');
      expect(limits.creditsLimit).toBe(-1);
    });

    it('trial and starter tiers should have limited initiatives', () => {
      expect(getTierLimits('trial').initiativesLimit).toBeGreaterThan(0);
      expect(getTierLimits('starter').initiativesLimit).toBeGreaterThan(0);
    });
  });

  describe('Export Permissions', () => {
    it('trial tier should not have export enabled', () => {
      const limits = getTierLimits('trial');
      expect(limits.exportEnabled).toBe(false);
    });

    it('starter tier should have export enabled', () => {
      const limits = getTierLimits('starter');
      expect(limits.exportEnabled).toBe(true);
    });

    it('professional tier should have export enabled', () => {
      const limits = getTierLimits('professional');
      expect(limits.exportEnabled).toBe(true);
    });

    it('enterprise tier should have export enabled', () => {
      const limits = getTierLimits('enterprise');
      expect(limits.exportEnabled).toBe(true);
    });
  });

  describe('Trial Duration', () => {
    it('trial tier should have 7-day trial duration', () => {
      const limits = getTierLimits('trial');
      expect(limits.trialDurationDays).toBe(7);
    });

    it('paid tiers should have no trial duration', () => {
      expect(getTierLimits('starter').trialDurationDays).toBeNull();
      expect(getTierLimits('professional').trialDurationDays).toBeNull();
      expect(getTierLimits('enterprise').trialDurationDays).toBeNull();
    });
  });

  describe('TIER_LIMITS constant', () => {
    it('should have all four tiers defined', () => {
      expect(TIER_LIMITS).toHaveProperty('trial');
      expect(TIER_LIMITS).toHaveProperty('starter');
      expect(TIER_LIMITS).toHaveProperty('professional');
      expect(TIER_LIMITS).toHaveProperty('enterprise');
    });

    it('should allow direct access to tier limits', () => {
      const trialLimits = TIER_LIMITS.trial;
      expect(trialLimits.tier).toBe('trial');
      expect(trialLimits.initiativesLimit).toBe(1);
    });
  });

  describe('isDocumentTypeAllowed', () => {
    it('should return true for brief on trial tier', () => {
      expect(isDocumentTypeAllowed('trial', 'brief')).toBe(true);
    });

    it('should return false for prd on trial tier', () => {
      expect(isDocumentTypeAllowed('trial', 'prd')).toBe(false);
    });

    it('should return true for all document types on starter tier', () => {
      const documentTypes: DocumentType[] = [
        'brief',
        'market_research',
        'competitive_analysis',
        'prd',
        'architecture',
        'ux_overview',
        'security_review',
        'qa_strategy',
      ];

      documentTypes.forEach((docType) => {
        expect(isDocumentTypeAllowed('starter', docType)).toBe(true);
      });
    });

    it('should return true for all document types on professional tier', () => {
      expect(isDocumentTypeAllowed('professional', 'prd')).toBe(true);
      expect(isDocumentTypeAllowed('professional', 'architecture')).toBe(true);
    });

    it('should return true for all document types on enterprise tier', () => {
      expect(isDocumentTypeAllowed('enterprise', 'security_review')).toBe(true);
      expect(isDocumentTypeAllowed('enterprise', 'qa_strategy')).toBe(true);
    });
  });

  describe('isUnlimited', () => {
    it('should return false for both resources on trial tier', () => {
      const unlimited = isUnlimited('trial');
      expect(unlimited.initiatives).toBe(false);
      expect(unlimited.credits).toBe(false);
    });

    it('should return false for both resources on starter tier', () => {
      const unlimited = isUnlimited('starter');
      expect(unlimited.initiatives).toBe(false);
      expect(unlimited.credits).toBe(false);
    });

    it('should return true for initiatives, false for credits on professional tier', () => {
      const unlimited = isUnlimited('professional');
      expect(unlimited.initiatives).toBe(true);
      expect(unlimited.credits).toBe(false);
    });

    it('should return true for both resources on enterprise tier', () => {
      const unlimited = isUnlimited('enterprise');
      expect(unlimited.initiatives).toBe(true);
      expect(unlimited.credits).toBe(true);
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should have consistent tier naming across objects', () => {
      const tiers: SubscriptionTier[] = ['trial', 'starter', 'professional', 'enterprise'];
      
      tiers.forEach((tier) => {
        const limits = getTierLimits(tier);
        expect(limits.tier).toBe(tier);
      });
    });

    it('should have non-negative limits for all tiers (except -1 for unlimited)', () => {
      Object.values(TIER_LIMITS).forEach((limits) => {
        if (limits.initiativesLimit !== -1) {
          expect(limits.initiativesLimit).toBeGreaterThanOrEqual(0);
        }
        if (limits.creditsLimit !== -1) {
          expect(limits.creditsLimit).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it('should have at least one allowed document type per tier', () => {
      Object.values(TIER_LIMITS).forEach((limits) => {
        expect(limits.allowedDocumentTypes.length).toBeGreaterThan(0);
      });
    });
  });
});

