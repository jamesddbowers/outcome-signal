-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create ENUM types
CREATE TYPE subscription_tier AS ENUM ('trial', 'starter', 'professional', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'expired', 'past_due');
CREATE TYPE initiative_status AS ENUM ('active', 'archived');
CREATE TYPE initiative_phase AS ENUM ('planning', 'development', 'testing', 'deployed');
CREATE TYPE document_type AS ENUM ('brief', 'market_research', 'competitive_analysis', 'prd', 'architecture', 'ux_overview', 'security_review', 'qa_strategy');
CREATE TYPE workflow_status AS ENUM ('running', 'completed', 'failed', 'canceled');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'trial',
    status subscription_status NOT NULL DEFAULT 'active',
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    trial_ends_at TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initiatives table
CREATE TABLE initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status initiative_status NOT NULL DEFAULT 'active',
    phase initiative_phase NOT NULL DEFAULT 'planning',
    phase_progress INTEGER DEFAULT 0 CHECK (phase_progress >= 0 AND phase_progress <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    version INTEGER DEFAULT 1 CHECK (version >= 1),
    status TEXT DEFAULT 'draft',
    generated_by_agent TEXT NOT NULL,
    llm_model TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0 CHECK (tokens_used >= 0),
    generation_time_ms INTEGER DEFAULT 0 CHECK (generation_time_ms >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow executions table
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workflow_type TEXT NOT NULL,
    document_type TEXT,
    status workflow_status NOT NULL DEFAULT 'running',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_step TEXT,
    vertex_ai_execution_id TEXT,
    result JSONB,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_initiatives_user_id ON initiatives(user_id);
CREATE INDEX idx_initiatives_status ON initiatives(status);
CREATE INDEX idx_documents_initiative_id ON documents(initiative_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_workflow_executions_initiative_id ON workflow_executions(initiative_id);
CREATE INDEX idx_workflow_executions_user_id ON workflow_executions(user_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_initiatives_updated_at BEFORE UPDATE ON initiatives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_executions_updated_at BEFORE UPDATE ON workflow_executions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own user record" ON users
    FOR SELECT USING (
        clerk_user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can update own user record" ON users
    FOR UPDATE USING (
        clerk_user_id = auth.jwt() ->> 'sub'
    );

-- RLS Policies for subscriptions table
CREATE POLICY "Users can read own subscriptions" ON subscriptions
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

-- RLS Policies for initiatives table
CREATE POLICY "Users can read own initiatives" ON initiatives
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Users can insert own initiatives" ON initiatives
    FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Users can update own initiatives" ON initiatives
    FOR UPDATE USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Users can delete own initiatives" ON initiatives
    FOR DELETE USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

-- RLS Policies for documents table
CREATE POLICY "Users can read documents for own initiatives" ON documents
    FOR SELECT USING (
        initiative_id IN (
            SELECT id FROM initiatives
            WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can insert documents for own initiatives" ON documents
    FOR INSERT WITH CHECK (
        initiative_id IN (
            SELECT id FROM initiatives
            WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can update documents for own initiatives" ON documents
    FOR UPDATE USING (
        initiative_id IN (
            SELECT id FROM initiatives
            WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can delete documents for own initiatives" ON documents
    FOR DELETE USING (
        initiative_id IN (
            SELECT id FROM initiatives
            WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
        )
    );

-- RLS Policies for workflow_executions table
CREATE POLICY "Users can read own workflow executions" ON workflow_executions
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Users can insert own workflow executions" ON workflow_executions
    FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Users can update own workflow executions" ON workflow_executions
    FOR UPDATE USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );
