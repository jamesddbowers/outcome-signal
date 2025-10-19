-- Seed data for development and testing
-- This creates a test user, initiative, and sample documents

-- Insert test user
INSERT INTO users (id, clerk_user_id, email, first_name, last_name, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'user_test123', 'test@example.com', 'Test', 'User', NOW(), NOW())
ON CONFLICT (clerk_user_id) DO NOTHING;

-- Insert subscription for test user
INSERT INTO subscriptions (user_id, tier, status, trial_ends_at, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'professional', 'active', NOW() + INTERVAL '30 days', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert test initiative
INSERT INTO initiatives (id, user_id, title, description, status, phase, phase_progress, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000',
   '550e8400-e29b-41d4-a716-446655440001',
   'AI-Powered Task Management System',
   'Build a modern task management application with AI-powered features for automatic task prioritization, smart scheduling, and natural language task creation.',
   'active',
   'development',
   35,
   NOW(),
   NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample documents
INSERT INTO documents (initiative_id, type, title, content, version, status, generated_by_agent, llm_model, tokens_used, generation_time_ms, created_at, updated_at)
VALUES
  -- Product Brief
  ('550e8400-e29b-41d4-a716-446655440000',
   'brief',
   'Product Brief: AI-Powered Task Management',
   '# Product Brief: AI-Powered Task Management System

## Executive Summary
This document outlines the vision and key features for an AI-powered task management system designed to revolutionize how teams organize and prioritize their work.

## Problem Statement
Traditional task management tools require significant manual effort to organize, prioritize, and schedule tasks. Users spend too much time managing their tools instead of doing actual work.

## Solution
Our AI-powered system will automatically:
- Prioritize tasks based on deadlines, dependencies, and user behavior
- Schedule tasks intelligently across team members
- Parse natural language to create structured tasks
- Suggest optimal task breakdowns for complex projects

## Key Features
1. Natural Language Task Creation
2. Intelligent Auto-Prioritization
3. Smart Scheduling Assistant
4. Team Collaboration Tools
5. Analytics & Insights Dashboard

## Success Metrics
- 50% reduction in time spent organizing tasks
- 30% increase in on-time task completion
- 90% user satisfaction score',
   1,
   'published',
   'claude-agent',
   'claude-3-5-sonnet-20241022',
   1250,
   3400,
   NOW(),
   NOW()),

  -- PRD
  ('550e8400-e29b-41d4-a716-446655440000',
   'prd',
   'Product Requirements Document',
   '# Product Requirements Document

## 1. Introduction
This PRD defines the functional and technical requirements for the AI-Powered Task Management System.

## 2. User Stories

### US-1: Natural Language Task Creation
**As a** team member
**I want to** create tasks using natural language
**So that** I can quickly capture tasks without filling out forms

**Acceptance Criteria:**
- System parses text like "Schedule meeting with John next Tuesday at 2pm"
- Extracts task title, assignee, due date, and time
- Confirms parsed details before creating task

### US-2: Auto-Prioritization
**As a** project manager
**I want** tasks to be automatically prioritized
**So that** my team focuses on the most important work

**Acceptance Criteria:**
- System assigns priority scores based on multiple factors
- Priority updates dynamically as deadlines approach
- Manual priority overrides are supported

## 3. Technical Requirements

### 3.1 Frontend
- React with TypeScript
- Real-time updates using WebSockets
- Responsive design (mobile, tablet, desktop)

### 3.2 Backend
- Node.js REST API
- PostgreSQL database
- Redis for caching

### 3.3 AI/ML
- LLM integration for NLP task parsing
- Priority scoring algorithm
- Recommendation engine',
   1,
   'published',
   'claude-agent',
   'claude-3-5-sonnet-20241022',
   2100,
   5200,
   NOW(),
   NOW()),

  -- Architecture Document
  ('550e8400-e29b-41d4-a716-446655440000',
   'architecture',
   'System Architecture Overview',
   '# System Architecture

## High-Level Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js App │────▶│  Supabase   │
│   Client    │◀────│   (SSR/API)  │◀────│  Database   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   AI Service │
                    │  (Claude AI) │
                    └──────────────┘
```

## Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Query for server state
- **Real-time**: Supabase Realtime subscriptions

## Backend Architecture
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Clerk
- **AI Integration**: Anthropic Claude API

## Data Flow
1. User creates task via natural language input
2. Frontend sends request to API route
3. API route calls Claude AI for parsing
4. Parsed data stored in Supabase
5. Supabase Realtime pushes update to clients',
   1,
   'draft',
   'claude-agent',
   'claude-3-5-sonnet-20241022',
   1800,
   4100,
   NOW(),
   NOW())
ON CONFLICT DO NOTHING;

-- Insert sample agent conversation
INSERT INTO agent_conversations (initiative_id, user_id, messages, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000',
   '550e8400-e29b-41d4-a716-446655440001',
   '[
     {
       "id": "msg-1",
       "role": "system",
       "content": "Welcome to the AI Agent Chat! I can help you refine your initiative documents and answer questions.",
       "timestamp": "2025-10-19T10:00:00.000Z"
     },
     {
       "id": "msg-2",
       "role": "user",
       "content": "Can you help me understand the key features in the product brief?",
       "timestamp": "2025-10-19T10:01:00.000Z"
     },
     {
       "id": "msg-3",
       "role": "agent",
       "content": "Based on the product brief, the key features are:\n\n1. **Natural Language Task Creation** - Allows users to create tasks using everyday language\n2. **Intelligent Auto-Prioritization** - Automatically ranks tasks by importance\n3. **Smart Scheduling Assistant** - Optimizes task scheduling across the team\n4. **Team Collaboration Tools** - Enables seamless teamwork\n5. **Analytics & Insights Dashboard** - Provides data-driven insights\n\nWould you like me to elaborate on any of these features?",
       "timestamp": "2025-10-19T10:01:15.000Z"
     }
   ]'::jsonb,
   NOW(),
   NOW())
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT 'Seed data inserted successfully!' as message;
SELECT 'Test User ID: 550e8400-e29b-41d4-a716-446655440001' as user_info;
SELECT 'Test Initiative ID: 550e8400-e29b-41d4-a716-446655440000' as initiative_info;
SELECT 'Navigate to: http://localhost:3001/dashboard/initiatives/550e8400-e29b-41d4-a716-446655440000' as url;
