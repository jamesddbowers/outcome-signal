-- Temporarily disable RLS to insert seed data
ALTER TABLE initiatives DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations DISABLE ROW LEVEL SECURITY;

-- Insert test initiative for real user
INSERT INTO initiatives (id, user_id, title, description, status, phase, phase_progress, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000',
   '335ed84b-2483-4d4e-a011-5fef50db7f82',
   'AI-Powered Task Management System',
   'Build a modern task management application with AI-powered features for automatic task prioritization, smart scheduling, and natural language task creation.',
   'active',
   'development',
   35,
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

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

### US-2: Auto-Prioritization
**As a** project manager
**I want** tasks to be automatically prioritized
**So that** my team focuses on the most important work

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
- **AI Integration**: Anthropic Claude API',
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
   '335ed84b-2483-4d4e-a011-5fef50db7f82',
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

-- Re-enable RLS
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
