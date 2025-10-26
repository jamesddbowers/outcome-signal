'use client';

/**
 * Tier Comparison Table Component
 * Story 3.5: Build Paywall Modal with Tier Comparison
 *
 * Displays a comparison of subscription tiers with pricing and features.
 * Responsive design: Grid layout on desktop, stacked cards on mobile.
 */

import React from 'react';
import { Check } from 'lucide-react';
import {
  TIER_LIMITS,
  type SubscriptionTier,
} from '@/lib/constants/subscription-tiers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Props for the TierComparisonTable component
 */
export interface TierComparisonTableProps {
  /** Callback function when a plan is selected */
  onSelectPlan: (tier: SubscriptionTier) => void;
  /** Optional tier to highlight (defaults to 'professional') */
  highlightTier?: SubscriptionTier;
}

/**
 * Tier card data structure for rendering
 */
interface TierCardData {
  tier: SubscriptionTier;
  name: string;
  price: string;
  priceSubtext: string;
  features: Array<{
    label: string;
    value: string | JSX.Element;
  }>;
  isPopular?: boolean;
  buttonVariant: 'default' | 'secondary';
}

/**
 * TierComparisonTable Component
 *
 * Displays subscription tiers with pricing and feature comparison.
 * Only shows paid tiers (Starter, Professional, Enterprise) - excludes Trial.
 *
 * @param props - Component props
 * @returns The rendered tier comparison table
 */
export function TierComparisonTable({
  onSelectPlan,
  highlightTier = 'professional',
}: TierComparisonTableProps): JSX.Element {
  const starterLimits = TIER_LIMITS.starter;
  const professionalLimits = TIER_LIMITS.professional;
  const enterpriseLimits = TIER_LIMITS.enterprise;

  // Build tier card data
  const tiers: TierCardData[] = [
    {
      tier: 'starter',
      name: 'Starter',
      price: starterLimits.displayPrice,
      priceSubtext: 'Perfect for small projects',
      features: [
        {
          label: 'Initiatives',
          value: `${starterLimits.initiativesLimit} per month`,
        },
        {
          label: 'AI Credits',
          value: `${starterLimits.creditsLimit} per month`,
        },
        {
          label: 'Document Types',
          value: 'All 8 types',
        },
        {
          label: 'Export',
          value: <Check className="h-5 w-5 text-green-600" />,
        },
        {
          label: 'Support',
          value: 'Email',
        },
      ],
      buttonVariant: 'secondary',
    },
    {
      tier: 'professional',
      name: 'Professional',
      price: professionalLimits.displayPrice,
      priceSubtext: 'Best for growing teams',
      features: [
        {
          label: 'Initiatives',
          value: 'Unlimited',
        },
        {
          label: 'AI Credits',
          value: `${professionalLimits.creditsLimit} per month`,
        },
        {
          label: 'Document Types',
          value: 'All 8 types',
        },
        {
          label: 'Export',
          value: <Check className="h-5 w-5 text-green-600" />,
        },
        {
          label: 'Support',
          value: 'Priority Email',
        },
      ],
      isPopular: true,
      buttonVariant: 'default',
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      price: enterpriseLimits.displayPrice,
      priceSubtext: 'For large organizations',
      features: [
        {
          label: 'Initiatives',
          value: 'Unlimited',
        },
        {
          label: 'AI Credits',
          value: 'Unlimited',
        },
        {
          label: 'Document Types',
          value: 'All 8 types',
        },
        {
          label: 'Export',
          value: <Check className="h-5 w-5 text-green-600" />,
        },
        {
          label: 'Support',
          value: 'Dedicated',
        },
      ],
      buttonVariant: 'secondary',
    },
  ];

  return (
    <div className="w-full">
      {/* Desktop/Tablet: Grid layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tierData) => {
          const isHighlighted = tierData.tier === highlightTier;

          return (
            <Card
              key={tierData.tier}
              className={cn(
                'relative flex flex-col',
                isHighlighted && 'border-primary shadow-lg ring-2 ring-primary'
              )}
            >
              {/* "Most Popular" Badge */}
              {tierData.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tierData.name}</CardTitle>
                <div className="mt-4">
                  <div className="text-4xl font-bold">{tierData.price}</div>
                  <CardDescription className="mt-2">
                    {tierData.priceSubtext}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {tierData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {feature.label}:
                    </span>
                    <span className="font-medium">{feature.value}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  variant={tierData.buttonVariant}
                  size="lg"
                  className="w-full"
                  onClick={() => onSelectPlan(tierData.tier)}
                >
                  Select {tierData.name}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
