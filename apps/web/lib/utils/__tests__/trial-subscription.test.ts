import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTrialSubscriptionForUser } from '../trial-subscription';

// Mock subscription tier limits
vi.mock('@/lib/constants/subscription-tiers', () => ({
  getTierLimits: vi.fn(() => ({
    creditsLimit: 0,
    initiativesLimit: 1,
  })),
}));

describe('createTrialSubscriptionForUser', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSupabaseAdmin: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock Supabase admin client
    mockSupabaseAdmin = {
      from: vi.fn(),
    };
  });

  it('should return existing subscription if one already exists (idempotent)', async () => {
    const existingSubscription = {
      id: 'sub_123',
      user_id: 'user_uuid_123',
      tier: 'trial',
      status: 'active',
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    mockSupabaseAdmin.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: existingSubscription,
            error: null,
          }),
        }),
      }),
    });

    const result = await createTrialSubscriptionForUser('user_uuid_123', mockSupabaseAdmin);

    expect(result.subscription).toEqual(existingSubscription);
    expect(result.error).toBeNull();
    expect(result.isNew).toBe(false);
  });

  it('should create new trial subscription when none exists', async () => {
    const newSubscription = {
      id: 'sub_456',
      user_id: 'user_uuid_456',
      tier: 'trial',
      status: 'active',
      trial_ends_at: expect.any(String),
      current_period_start: expect.any(String),
      current_period_end: expect.any(String),
    };

    let callCount = 0;
    mockSupabaseAdmin.from.mockImplementation((table: string) => {
      callCount++;

      // First call: check for existing subscription (not found)
      if (callCount === 1 && table === 'subscriptions') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116', message: 'No rows found' },
              }),
            }),
          }),
        };
      }

      // Second call: insert new subscription
      if (callCount === 2 && table === 'subscriptions') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: newSubscription,
                error: null,
              }),
            }),
          }),
        };
      }

      // Third call: insert usage tracking
      if (callCount === 3 && table === 'usage_tracking') {
        return {
          insert: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        };
      }

      return {};
    });

    const result = await createTrialSubscriptionForUser('user_uuid_456', mockSupabaseAdmin);

    expect(result.subscription).toBeDefined();
    expect(result.subscription?.tier).toBe('trial');
    expect(result.subscription?.status).toBe('active');
    expect(result.error).toBeNull();
    expect(result.isNew).toBe(true);
  });

  it('should return error if subscription creation fails', async () => {
    let callCount = 0;
    mockSupabaseAdmin.from.mockImplementation((table: string) => {
      callCount++;

      // First call: check for existing (not found)
      if (callCount === 1 && table === 'subscriptions') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        };
      }

      // Second call: insert fails
      if (callCount === 2 && table === 'subscriptions') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'DB_ERROR', message: 'Database error' },
              }),
            }),
          }),
        };
      }

      return {};
    });

    const result = await createTrialSubscriptionForUser('user_uuid_789', mockSupabaseAdmin);

    expect(result.subscription).toBeNull();
    expect(result.error).toContain('Failed to create subscription');
    expect(result.isNew).toBe(false);
  });

  it('should ignore duplicate usage_tracking errors (23505)', async () => {
    const newSubscription = {
      id: 'sub_999',
      user_id: 'user_uuid_999',
      tier: 'trial',
      status: 'active',
    };

    let callCount = 0;
    mockSupabaseAdmin.from.mockImplementation((table: string) => {
      callCount++;

      // First: check for existing (not found)
      if (callCount === 1 && table === 'subscriptions') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        };
      }

      // Second: insert subscription (success)
      if (callCount === 2 && table === 'subscriptions') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: newSubscription,
                error: null,
              }),
            }),
          }),
        };
      }

      // Third: insert usage_tracking (duplicate error)
      if (callCount === 3 && table === 'usage_tracking') {
        return {
          insert: vi.fn().mockResolvedValue({
            data: null,
            error: { code: '23505', message: 'duplicate key' },
          }),
        };
      }

      return {};
    });

    const result = await createTrialSubscriptionForUser('user_uuid_999', mockSupabaseAdmin);

    // Should succeed despite usage_tracking duplicate error
    expect(result.subscription).toBeDefined();
    expect(result.error).toBeNull();
    expect(result.isNew).toBe(true);
  });

  it('should use custom log prefix', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const existingSubscription = {
      id: 'sub_test',
      user_id: 'user_test',
      tier: 'trial',
    };

    mockSupabaseAdmin.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: existingSubscription,
            error: null,
          }),
        }),
      }),
    });

    await createTrialSubscriptionForUser('user_test', mockSupabaseAdmin, '[CustomPrefix]');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[CustomPrefix]')
    );

    consoleSpy.mockRestore();
  });

  it('should verify trial period is 7 days', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let insertedSubscription: any = null;

    let callCount = 0;
    mockSupabaseAdmin.from.mockImplementation((table: string) => {
      callCount++;

      if (callCount === 1 && table === 'subscriptions') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        };
      }

      if (callCount === 2 && table === 'subscriptions') {
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          insert: (data: any) => {
            insertedSubscription = data;
            return {
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { ...data, id: 'sub_new' },
                  error: null,
                }),
              }),
            };
          },
        };
      }

      if (callCount === 3 && table === 'usage_tracking') {
        return {
          insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }

      return {};
    });

    await createTrialSubscriptionForUser('user_test', mockSupabaseAdmin);

    expect(insertedSubscription).toBeDefined();
    const trialEndsAt = new Date(insertedSubscription.trial_ends_at);
    const now = new Date(insertedSubscription.current_period_start);
    const daysDiff = Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    expect(daysDiff).toBe(7);
    expect(insertedSubscription.current_period_end).toBe(insertedSubscription.trial_ends_at);
  });
});
