-- Create usage_tracking table for monthly subscription usage limits
-- Story 3.1: Create Subscription Tier Data Model

CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,  -- Format: 'YYYY-MM'
  credits_used INTEGER NOT NULL DEFAULT 0 CHECK (credits_used >= 0),
  credits_limit INTEGER NOT NULL,
  initiatives_count INTEGER NOT NULL DEFAULT 0 CHECK (initiatives_count >= 0),
  initiatives_limit INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_month UNIQUE(user_id, month)  -- Prevent duplicate monthly records
);

-- Create indexes for performance
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_month ON usage_tracking(month);

-- Enable Row Level Security
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own usage tracking records
CREATE POLICY "Users can read own usage tracking" ON usage_tracking
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

-- RLS Policy: Users can insert their own usage tracking records
CREATE POLICY "Users can insert own usage tracking" ON usage_tracking
    FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

-- RLS Policy: Users can update their own usage tracking records
CREATE POLICY "Users can update own usage tracking" ON usage_tracking
    FOR UPDATE USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

-- Add updated_at trigger using existing trigger function
CREATE TRIGGER update_usage_tracking_updated_at 
    BEFORE UPDATE ON usage_tracking
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE usage_tracking IS 'Tracks monthly subscription usage limits per user';
COMMENT ON COLUMN usage_tracking.month IS 'Format: YYYY-MM (e.g., 2025-10)';
COMMENT ON COLUMN usage_tracking.credits_used IS 'Number of AI credits consumed in this month';
COMMENT ON COLUMN usage_tracking.initiatives_count IS 'Number of initiatives created in this month';

