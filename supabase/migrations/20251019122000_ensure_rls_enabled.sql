-- Ensure RLS is properly enabled on all tables
-- This migration ensures RLS wasn't left in a disabled state

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;

-- Verify RLS policies are in place (these should already exist from init_schema)
-- If they don't exist, this will error and we'll know there's a problem
DO $$
BEGIN
    -- Check that RLS policies exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'initiatives'
        AND policyname = 'Users can read own initiatives'
    ) THEN
        RAISE EXCEPTION 'RLS policies missing! Database may need to be reset.';
    END IF;
END $$;
