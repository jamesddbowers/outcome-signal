# 9. Database Schema

Complete Supabase schema with SQL DDL:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

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
CREATE TYPE subscription_tier AS ENUM ('trial', 'starter', 'professional', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'expired', 'past_due');

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'trial',
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initiatives table
CREATE TYPE initiative_status AS ENUM ('active', 'archived');
CREATE TYPE initiative_phase AS ENUM ('planning', 'development', 'testing', 'deployed');

CREATE TABLE initiatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status initiative_status NOT NULL DEFAULT 'active',
  phase initiative_phase NOT NULL DEFAULT 'planning',
  phase_progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TYPE document_type AS ENUM (
  'brief', 'market_research', 'competitive_analysis',
  'prd', 'architecture', 'ux_overview', 'security_review', 'qa_strategy'
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  generated_by_agent TEXT NOT NULL,
  llm_model TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  generation_time_ms INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow executions table
CREATE TYPE workflow_status AS ENUM ('running', 'completed', 'failed', 'canceled');

CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workflow_type TEXT NOT NULL,
  document_type TEXT,
  status workflow_status NOT NULL DEFAULT 'running',
  progress INTEGER NOT NULL DEFAULT 0,
  current_step TEXT,
  vertex_ai_execution_id TEXT,
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Row-Level Security policies
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own initiatives" ON initiatives
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
  ));
```

See full document for complete schema including all tables, indexes, and RLS policies.

---
