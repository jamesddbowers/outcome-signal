-- Seed usage tracking data for existing test users
-- Story 3.1: Create Subscription Tier Data Model

-- Get current month in YYYY-MM format
DO $$
DECLARE
  current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
  test_user_id UUID := '550e8400-e29b-41d4-a716-446655440001';
  real_user_id UUID := '335ed84b-2483-4d4e-a011-5fef50db7f82';
BEGIN
  -- Seed usage tracking for test user (professional tier)
  -- Professional tier: unlimited initiatives (-1), 100 credits/month
  INSERT INTO usage_tracking (user_id, month, credits_used, credits_limit, initiatives_count, initiatives_limit)
  VALUES (
    test_user_id,
    current_month,
    15,  -- Used 15 credits so far
    100, -- Professional tier gets 100 credits/month
    1,   -- Created 1 initiative so far
    -1   -- Unlimited initiatives
  )
  ON CONFLICT (user_id, month) DO UPDATE SET
    credits_used = EXCLUDED.credits_used,
    credits_limit = EXCLUDED.credits_limit,
    initiatives_count = EXCLUDED.initiatives_count,
    initiatives_limit = EXCLUDED.initiatives_limit,
    updated_at = NOW();

  -- Seed usage tracking for real user if they have a subscription
  -- Check if real user exists and insert accordingly
  IF EXISTS (SELECT 1 FROM users WHERE id = real_user_id) THEN
    -- Assuming real user is on trial tier initially
    -- Trial tier: 1 initiative, 0 credits (brief only)
    INSERT INTO usage_tracking (user_id, month, credits_used, credits_limit, initiatives_count, initiatives_limit)
    VALUES (
      real_user_id,
      current_month,
      0,   -- No credits used yet
      0,   -- Trial tier has no credits (brief doesn't consume credits)
      1,   -- Created 1 initiative
      1    -- Trial tier limited to 1 initiative
    )
    ON CONFLICT (user_id, month) DO UPDATE SET
      credits_used = EXCLUDED.credits_used,
      credits_limit = EXCLUDED.credits_limit,
      initiatives_count = EXCLUDED.initiatives_count,
      initiatives_limit = EXCLUDED.initiatives_limit,
      updated_at = NOW();
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE usage_tracking IS 'Tracks monthly subscription usage limits per user. Records reset monthly.';
