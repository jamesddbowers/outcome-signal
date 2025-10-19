-- Create agent_conversations table for storing chat messages between users and AI agents
CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_agent_conversations_initiative_id ON agent_conversations(initiative_id);
CREATE INDEX idx_agent_conversations_user_id ON agent_conversations(user_id);

-- Enable Row-Level Security
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read conversations for their own initiatives
CREATE POLICY "Users can read conversations for own initiatives" ON agent_conversations
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
  );

-- Policy: Users can insert conversations for their own initiatives
CREATE POLICY "Users can insert conversations for own initiatives" ON agent_conversations
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
  );

-- Policy: Users can update their own conversations
CREATE POLICY "Users can update own conversations" ON agent_conversations
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_agent_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before updates
CREATE TRIGGER trigger_update_agent_conversations_updated_at
  BEFORE UPDATE ON agent_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_conversations_updated_at();
