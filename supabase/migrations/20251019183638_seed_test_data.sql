-- Seed test data for PhaseIndicator testing
-- This creates a test initiative with sample documents

-- Insert a test initiative (using first user from system)
INSERT INTO initiatives (id, user_id, title, description, status, phase, phase_progress, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '335ed84b-2483-4d4e-a011-5fef50db7f82', -- Your actual user ID
  'Customer Portal MVP',
  'Building a customer-facing portal for account management',
  'active',
  'planning',
  37, -- 37% progress (3 out of 8 documents approved)
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  phase = 'planning',
  phase_progress = 37,
  updated_at = NOW();

-- Insert sample planning documents
INSERT INTO documents (id, initiative_id, type, title, content, status, generated_by_agent, llm_model, created_at, updated_at)
VALUES
  -- Approved documents (3)
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'brief', 'Project Brief', '# Project Brief\nCustomer Portal MVP...', 'approved', 'Planning Agent', 'claude-3-5-sonnet-20241022', NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'market_research', 'Market Research', '# Market Research\nAnalysis of customer portal market...', 'approved', 'Research Agent', 'claude-3-5-sonnet-20241022', NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'prd', 'Product Requirements Document', '# PRD\nCustomer Portal Requirements...', 'approved', 'Product Agent', 'claude-3-5-sonnet-20241022', NOW(), NOW()),

  -- In progress documents (2)
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'architecture', 'Architecture Document', '# Architecture\nSystem design for portal...', 'draft', 'Architecture Agent', 'claude-3-5-sonnet-20241022', NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'ux_overview', 'UX Overview', '# UX Design\nUser experience design...', 'draft', 'UX Agent', 'claude-3-5-sonnet-20241022', NOW(), NOW())

  -- Pending documents: competitive_analysis, security_review, qa_strategy (not created yet)
ON CONFLICT DO NOTHING;
