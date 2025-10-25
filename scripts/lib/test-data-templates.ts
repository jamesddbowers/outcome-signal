/**
 * Test Data Templates
 *
 * Defines data templates for various E2E testing scenarios.
 * Used by test-setup.ts to create realistic test data.
 */

import type { Database } from './supabase-admin';

export type TestScenario =
  | 'new-trial'
  | 'trial-with-initiative'
  | 'trial-at-initiative-limit'
  | 'trial-expiring-soon'
  | 'trial-expired'
  | 'paid-starter'
  | 'paid-professional';

export interface ScenarioConfig {
  name: string;
  description: string;
  includeInitiative: boolean;
  includeDocuments: boolean;
  includeConversation: boolean;
}

export const SCENARIOS: Record<TestScenario, ScenarioConfig> = {
  'new-trial': {
    name: 'New Trial User',
    description: 'Fresh trial user with no initiatives (Story 3.2 - AC 1, 2, 4)',
    includeInitiative: false,
    includeDocuments: false,
    includeConversation: false,
  },
  'trial-with-initiative': {
    name: 'Trial User with Sample Initiative',
    description: 'Trial user with 1 initiative, documents, and agent chat',
    includeInitiative: true,
    includeDocuments: true,
    includeConversation: true,
  },
  'trial-at-initiative-limit': {
    name: 'Trial User at Initiative Limit',
    description: 'Trial user with 1 initiative already created - tests disabled Create Initiative button (Story 3.3 - AC 1)',
    includeInitiative: true,
    includeDocuments: false,
    includeConversation: false,
  },
  'trial-expiring-soon': {
    name: 'Trial User Expiring Soon (1 day)',
    description: 'Trial ending tomorrow - tests warning badge (Story 3.2 - AC 4)',
    includeInitiative: false,
    includeDocuments: false,
    includeConversation: false,
  },
  'trial-expired': {
    name: 'Expired Trial User',
    description: 'Trial ended yesterday - tests expired badge (Story 3.2 - AC 4)',
    includeInitiative: false,
    includeDocuments: false,
    includeConversation: false,
  },
  'paid-starter': {
    name: 'Paid User (Starter)',
    description: 'Starter tier user with 0 initiatives - can create up to 3/month (Story 3.3 - AC 1)',
    includeInitiative: false,
    includeDocuments: false,
    includeConversation: false,
  },
  'paid-professional': {
    name: 'Paid User (Professional)',
    description: 'Professional tier with sample data',
    includeInitiative: true,
    includeDocuments: true,
    includeConversation: true,
  },
};

/**
 * Generates subscription data based on scenario
 */
export function generateSubscription(
  userId: string,
  scenario: TestScenario
): Database['public']['Tables']['subscriptions']['Insert'] {
  const now = new Date();
  const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const oneDay = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  switch (scenario) {
    case 'new-trial':
    case 'trial-with-initiative':
    case 'trial-at-initiative-limit':
      return {
        user_id: userId,
        tier: 'trial',
        status: 'active',
        trial_ends_at: sevenDays.toISOString(),
        current_period_start: now.toISOString(),
        current_period_end: sevenDays.toISOString(),
        stripe_subscription_id: null,
        stripe_customer_id: null,
      };

    case 'trial-expiring-soon':
      return {
        user_id: userId,
        tier: 'trial',
        status: 'active',
        trial_ends_at: oneDay.toISOString(),
        current_period_start: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        current_period_end: oneDay.toISOString(),
        stripe_subscription_id: null,
        stripe_customer_id: null,
      };

    case 'trial-expired':
      return {
        user_id: userId,
        tier: 'trial',
        status: 'expired',
        trial_ends_at: yesterday.toISOString(),
        current_period_start: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        current_period_end: yesterday.toISOString(),
        stripe_subscription_id: null,
        stripe_customer_id: null,
      };

    case 'paid-starter':
      return {
        user_id: userId,
        tier: 'starter',
        status: 'active',
        trial_ends_at: null,
        current_period_start: now.toISOString(),
        current_period_end: thirtyDays.toISOString(),
        stripe_subscription_id: 'sub_test_starter_123',
        stripe_customer_id: 'cus_test_starter_123',
      };

    case 'paid-professional':
      return {
        user_id: userId,
        tier: 'professional',
        status: 'active',
        trial_ends_at: null,
        current_period_start: now.toISOString(),
        current_period_end: thirtyDays.toISOString(),
        stripe_subscription_id: 'sub_test_professional_123',
        stripe_customer_id: 'cus_test_professional_123',
      };
  }
}

/**
 * Generates usage tracking data based on scenario
 */
export function generateUsageTracking(
  userId: string,
  scenario: TestScenario
): Database['public']['Tables']['usage_tracking']['Insert'] {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  switch (scenario) {
    case 'new-trial':
    case 'trial-expiring-soon':
    case 'trial-expired':
      return {
        user_id: userId,
        month: currentMonth,
        credits_used: 0,
        credits_limit: 0, // Trial has 0 credits (Brief doesn't consume credits)
        initiatives_count: 0,
        initiatives_limit: 1, // Trial limited to 1 initiative
      };

    case 'trial-with-initiative':
      return {
        user_id: userId,
        month: currentMonth,
        credits_used: 0,
        credits_limit: 0,
        initiatives_count: 0, // Will be incremented when initiative is created
        initiatives_limit: 1,
      };

    case 'trial-at-initiative-limit':
      return {
        user_id: userId,
        month: currentMonth,
        credits_used: 0,
        credits_limit: 0,
        initiatives_count: 1, // Already at limit! This tests the disabled button state
        initiatives_limit: 1,
      };

    case 'paid-starter':
      return {
        user_id: userId,
        month: currentMonth,
        credits_used: 0,
        credits_limit: 25, // Starter tier has 25 credits
        initiatives_count: 0, // No initiatives yet - can create up to 3
        initiatives_limit: 3, // Starter limited to 3 initiatives/month
      };

    case 'paid-professional':
      return {
        user_id: userId,
        month: currentMonth,
        credits_used: 15,
        credits_limit: 100, // Professional tier has 100 credits
        initiatives_count: 1,
        initiatives_limit: -1, // Unlimited initiatives
      };
  }
}

/**
 * Generates sample initiative data
 */
export function generateInitiative(
  userId: string
): Database['public']['Tables']['initiatives']['Insert'] {
  return {
    user_id: userId,
    title: 'AI-Powered Task Management System',
    description:
      'Build a modern task management application with AI-powered features for automatic task prioritization, smart scheduling, and natural language task creation.',
    status: 'active',
    phase: 'development',
    phase_progress: 35,
    archived_at: null,
  };
}

/**
 * Generates sample document data
 */
export function generateDocuments(
  initiativeId: string
): Database['public']['Tables']['documents']['Insert'][] {
  return [
    {
      initiative_id: initiativeId,
      type: 'brief',
      title: 'Product Brief: AI-Powered Task Management',
      content: `# Product Brief: AI-Powered Task Management System

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
- 90% user satisfaction score`,
      version: 1,
      status: 'published',
      generated_by_agent: 'claude-agent',
      llm_model: 'claude-3-5-sonnet-20241022',
      tokens_used: 1250,
      generation_time_ms: 3400,
    },
    {
      initiative_id: initiativeId,
      type: 'prd',
      title: 'Product Requirements Document',
      content: `# Product Requirements Document

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
- Recommendation engine`,
      version: 1,
      status: 'published',
      generated_by_agent: 'claude-agent',
      llm_model: 'claude-3-5-sonnet-20241022',
      tokens_used: 2100,
      generation_time_ms: 5200,
    },
    {
      initiative_id: initiativeId,
      type: 'architecture',
      title: 'System Architecture Overview',
      content: `# System Architecture

## High-Level Architecture

\`\`\`
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
\`\`\`

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
5. Supabase Realtime pushes update to clients`,
      version: 1,
      status: 'draft',
      generated_by_agent: 'claude-agent',
      llm_model: 'claude-3-5-sonnet-20241022',
      tokens_used: 1800,
      generation_time_ms: 4100,
    },
  ];
}

/**
 * Generates sample agent conversation
 */
export function generateConversation(
  initiativeId: string,
  userId: string
): Database['public']['Tables']['agent_conversations']['Insert'] {
  return {
    initiative_id: initiativeId,
    user_id: userId,
    messages: [
      {
        id: 'msg-1',
        role: 'system',
        content:
          'Welcome to the AI Agent Chat! I can help you refine your initiative documents and answer questions.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'msg-2',
        role: 'user',
        content: 'Can you help me understand the key features in the product brief?',
        timestamp: new Date(Date.now() + 60000).toISOString(),
      },
      {
        id: 'msg-3',
        role: 'agent',
        content: `Based on the product brief, the key features are:

1. **Natural Language Task Creation** - Allows users to create tasks using everyday language
2. **Intelligent Auto-Prioritization** - Automatically ranks tasks by importance
3. **Smart Scheduling Assistant** - Optimizes task scheduling across the team
4. **Team Collaboration Tools** - Enables seamless teamwork
5. **Analytics & Insights Dashboard** - Provides data-driven insights

Would you like me to elaborate on any of these features?`,
        timestamp: new Date(Date.now() + 75000).toISOString(),
      },
    ],
  };
}
