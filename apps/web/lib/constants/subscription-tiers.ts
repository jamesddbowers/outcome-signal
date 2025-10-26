/**
 * Subscription Tier Limits Configuration
 * Story 3.1: Create Subscription Tier Data Model
 *
 * Defines the limits and capabilities for each subscription tier.
 * These constants are used throughout the application to enforce tier-based restrictions.
 */

/**
 * Subscription tier levels available in the platform
 */
export type SubscriptionTier = 'trial' | 'starter' | 'professional' | 'enterprise';

/**
 * Document types available in the platform
 */
export type DocumentType =
  | 'brief'
  | 'market_research'
  | 'competitive_analysis'
  | 'prd'
  | 'architecture'
  | 'ux_overview'
  | 'security_review'
  | 'qa_strategy';

/**
 * Complete configuration for a subscription tier's limits and capabilities
 */
export interface SubscriptionTierLimits {
  /** The tier identifier */
  tier: SubscriptionTier;
  /** Maximum number of initiatives per month (-1 = unlimited) */
  initiativesLimit: number;
  /** Maximum AI credits per month (-1 = unlimited) */
  creditsLimit: number;
  /** Document types available for this tier */
  allowedDocumentTypes: DocumentType[];
  /** Trial duration in days (null for paid tiers) */
  trialDurationDays: number | null;
  /** Whether document export is enabled */
  exportEnabled: boolean;
  /** Monthly price in dollars (null for trial) */
  priceMonthly: number | null;
  /** Display-friendly price string */
  displayPrice: string;
}

/**
 * All available document types in the platform
 */
const ALL_DOCUMENT_TYPES: DocumentType[] = [
  'brief',
  'market_research',
  'competitive_analysis',
  'prd',
  'architecture',
  'ux_overview',
  'security_review',
  'qa_strategy',
];

/**
 * Tier-based limits and capabilities configuration
 *
 * @constant
 * @example
 * ```typescript
 * const trialLimits = TIER_LIMITS.trial;
 * console.log(trialLimits.initiativesLimit); // 1
 * ```
 */
export const TIER_LIMITS: Record<SubscriptionTier, SubscriptionTierLimits> = {
  /**
   * Trial Tier (Free)
   * - Limited to 1 Initiative
   * - Only Brief document available
   * - 7-day trial period
   * - No export capabilities
   * - No AI credits (Brief generation doesn't consume credits)
   */
  trial: {
    tier: 'trial',
    initiativesLimit: 1,
    creditsLimit: 0, // No credits for trial (Brief doesn't consume credits)
    allowedDocumentTypes: ['brief'],
    trialDurationDays: 7,
    exportEnabled: false,
    priceMonthly: null,
    displayPrice: 'Free 7-day trial',
  },

  /**
   * Starter Tier ($49/month)
   * - Up to 3 Initiatives per month
   * - 25 AI credits per month
   * - All 8 document types available
   * - Export enabled
   */
  starter: {
    tier: 'starter',
    initiativesLimit: 3,
    creditsLimit: 25,
    allowedDocumentTypes: ALL_DOCUMENT_TYPES,
    trialDurationDays: null,
    exportEnabled: true,
    priceMonthly: 49,
    displayPrice: '$49/mo',
  },

  /**
   * Professional Tier ($149/month)
   * - Unlimited Initiatives
   * - 100 AI credits per month
   * - All 8 document types available
   * - Export enabled
   */
  professional: {
    tier: 'professional',
    initiativesLimit: -1, // Unlimited
    creditsLimit: 100,
    allowedDocumentTypes: ALL_DOCUMENT_TYPES,
    trialDurationDays: null,
    exportEnabled: true,
    priceMonthly: 149,
    displayPrice: '$149/mo',
  },

  /**
   * Enterprise Tier ($499/month)
   * - Unlimited Initiatives
   * - Unlimited AI credits
   * - All 8 document types available
   * - Export enabled
   * - Dedicated support
   */
  enterprise: {
    tier: 'enterprise',
    initiativesLimit: -1, // Unlimited
    creditsLimit: -1, // Unlimited
    allowedDocumentTypes: ALL_DOCUMENT_TYPES,
    trialDurationDays: null,
    exportEnabled: true,
    priceMonthly: 499,
    displayPrice: '$499/mo',
  },
};

/**
 * Helper function to retrieve tier limits by tier identifier
 *
 * @param tier - The subscription tier to get limits for
 * @returns The complete limits configuration for the specified tier
 *
 * @example
 * ```typescript
 * const limits = getTierLimits('professional');
 * if (limits.initiativesLimit === -1) {
 *   console.log('Unlimited initiatives!');
 * }
 * ```
 */
export function getTierLimits(tier: SubscriptionTier): SubscriptionTierLimits {
  return TIER_LIMITS[tier];
}

/**
 * Helper function to check if a document type is allowed for a tier
 *
 * @param tier - The subscription tier to check
 * @param documentType - The document type to check availability for
 * @returns true if the document type is allowed for the tier
 *
 * @example
 * ```typescript
 * if (isDocumentTypeAllowed('trial', 'prd')) {
 *   // This will be false for trial tier
 * }
 * ```
 */
export function isDocumentTypeAllowed(
  tier: SubscriptionTier,
  documentType: DocumentType
): boolean {
  const limits = getTierLimits(tier);
  return limits.allowedDocumentTypes.includes(documentType);
}

/**
 * Helper function to check if a tier has unlimited resources
 *
 * @param tier - The subscription tier to check
 * @returns Object indicating which resources are unlimited
 *
 * @example
 * ```typescript
 * const unlimited = isUnlimited('enterprise');
 * console.log(unlimited.initiatives); // true
 * console.log(unlimited.credits); // true
 * ```
 */
export function isUnlimited(tier: SubscriptionTier): {
  initiatives: boolean;
  credits: boolean;
} {
  const limits = getTierLimits(tier);
  return {
    initiatives: limits.initiativesLimit === -1,
    credits: limits.creditsLimit === -1,
  };
}

/**
 * Helper function to get the display price for a tier
 *
 * @param tier - The subscription tier to get the display price for
 * @returns The display-friendly price string (e.g., "$49/mo" or "Free 7-day trial")
 *
 * @example
 * ```typescript
 * const price = getTierDisplayPrice('professional');
 * console.log(price); // "$149/mo"
 * ```
 */
export function getTierDisplayPrice(tier: SubscriptionTier): string {
  const limits = getTierLimits(tier);
  return limits.displayPrice;
}

