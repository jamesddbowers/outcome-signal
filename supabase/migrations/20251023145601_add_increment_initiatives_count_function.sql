-- Add function to safely increment initiatives_count in usage_tracking
-- Story 3.3: Enforce Trial Limits

/**
 * Function to increment initiatives_count for a user's monthly usage tracking
 * Creates the usage_tracking record if it doesn't exist for the month
 *
 * @param p_user_id - The user's Supabase UUID
 * @param p_month - The month in YYYY-MM format
 */
CREATE OR REPLACE FUNCTION increment_initiatives_count(
    p_user_id UUID,
    p_month TEXT
) RETURNS VOID AS $$
DECLARE
    v_initiatives_limit INTEGER;
BEGIN
    -- Get the user's subscription tier limit
    SELECT
        CASE
            WHEN s.tier = 'trial' THEN 1
            WHEN s.tier = 'starter' THEN 3
            WHEN s.tier = 'professional' THEN -1  -- Unlimited
            WHEN s.tier = 'enterprise' THEN -1    -- Unlimited
            ELSE 1  -- Default to trial limit
        END INTO v_initiatives_limit
    FROM subscriptions s
    WHERE s.user_id = p_user_id
    AND s.status = 'active'
    LIMIT 1;

    -- If no subscription found, use trial default
    IF v_initiatives_limit IS NULL THEN
        v_initiatives_limit := 1;
    END IF;

    -- Insert or update usage_tracking record
    INSERT INTO usage_tracking (
        user_id,
        month,
        initiatives_count,
        initiatives_limit,
        credits_used,
        credits_limit
    ) VALUES (
        p_user_id,
        p_month,
        1,  -- First initiative for this month
        v_initiatives_limit,
        0,  -- No credits used yet
        CASE
            WHEN v_initiatives_limit = 1 THEN 0      -- Trial
            WHEN v_initiatives_limit = 3 THEN 25     -- Starter
            WHEN v_initiatives_limit = -1 THEN 100   -- Professional (or unlimited for Enterprise)
            ELSE 0
        END
    )
    ON CONFLICT (user_id, month)
    DO UPDATE SET
        initiatives_count = usage_tracking.initiatives_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION increment_initiatives_count IS 'Safely increments initiatives_count in usage_tracking, creating record if needed (Story 3.3)';
