# OutcomeSignal - Fullstack Architecture Document

**Document Version:** 1.0
**Created:** 2025-10-16
**Last Updated:** 2025-10-16
**Status:** Final - Ready for Implementation
**Author:** Winston (Architect Agent)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [High Level Architecture](#2-high-level-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Data Models](#4-data-models)
5. [API Specification](#5-api-specification)
6. [Components Architecture](#6-components-architecture)
7. [External APIs & Third-Party Integrations](#7-external-apis--third-party-integrations)
8. [Core Workflows](#8-core-workflows)
9. [Database Schema](#9-database-schema)
10. [Frontend Architecture Details](#10-frontend-architecture-details)
11. [Backend Architecture Details](#11-backend-architecture-details)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Security & Performance](#13-security--performance)
14. [Testing Strategy](#14-testing-strategy)
15. [Coding Standards](#15-coding-standards)
16. [Error Handling & Monitoring](#16-error-handling--monitoring)

---

## 1. Introduction

### 1.1 Starter Template

**Decision:** N/A - Greenfield project with custom tech stack

### 1.2 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-16 | 1.0 | Initial Fullstack Architecture Document created from PRD and UI/UX spec | Winston (Architect Agent) |

### 1.3 Introduction

This document outlines the complete fullstack architecture for **OutcomeSignal**, an AI planning platform that guides solo developers and small teams from ideation through production-ready specifications. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

OutcomeSignal combines a **Next.js 14 frontend** with **shadcn/ui Scaled theme**, **Next.js API Routes** (TypeScript) for the backend, **Google Vertex AI Agent Development Kit (ADK)** for AI orchestration, and **Supabase** for database and real-time functionality. The architecture emphasizes:

- **Three-column workspace UI** (hierarchy tree, live document preview, agent chat)
- **AI agent orchestration** with 7 specialized sub-agents using Google ADK
- **Subscription-based SaaS model** with Stripe billing and tier-based limits
- **Document generation workflow** covering 8 planning document types (Brief, PRD, Architecture, UX, Security, QA, Market Research, Competitive Analysis)
- **Responsive design** targeting desktop-first with mobile/tablet adaptation
- **Unified Next.js application** with TypeScript for frontend and backend API

This unified approach streamlines development by using a single language (TypeScript) for the entire application stack, with Python reserved only for separately-deployed Google ADK agents.

---

## 2. High Level Architecture

### 2.1 Technical Summary

OutcomeSignal employs a **unified Next.js fullstack architecture** designed for rapid AI-driven document generation with real-time collaboration. The system combines:

- **Frontend:** Next.js 14 (TypeScript, Turborepo `/apps/web`) with React Server Components, Client Components for interactive UI (chat, real-time updates), and shadcn/ui Scaled theme with Tailwind CSS
- **Backend API:** **Next.js API Routes** (TypeScript, App Router `/app/api/*`) providing RESTful endpoints for document generation, agent invocation, and workflow orchestration
- **AI Orchestration:** **Google Vertex AI Agent Development Kit (ADK)** for building 7 specialized agents (deployed separately to Vertex AI Agent Engine), with **Vertex AI Reasoning Engine** for complex multi-step document generation workflows
- **Long-Running Workflows:** **Vertex AI Reasoning Engine** handles document generation (10-30s workflows) with state persistence in Supabase, invoked asynchronously from Next.js API Routes via `@google-cloud/aiplatform` Node.js SDK
- **Data & Real-time:** Supabase (PostgreSQL 15 + pgvector) with Realtime WebSocket pub/sub for live agent message streaming, Row-Level Security for multi-tenancy, Supabase Storage for user files
- **Deployment:** Vercel for unified deployment (Next.js frontend + API Routes as serverless functions), Google Vertex AI for agent execution, single region (us-central1 GCP, us-east-1 Vercel/Supabase) for MVP

This architecture achieves the PRD goals of <30s document generation (p95) via Reasoning Engine workflows, 80%+ approval rate through context-aware ADK agents, and <$0.10 LLM cost per document via A/B testing (Gemini 2.5 Pro vs Claude Sonnet 4.5).

### 2.2 Platform and Infrastructure Choice

**DECISION: Vercel (Next.js Full-Stack) + Supabase + Google Vertex AI**

**Platform:** Vercel (Next.js frontend + API Routes) + Supabase (database/storage/realtime) + Google Vertex AI (AI agents)

**Key Services:**
- **Vercel:**
  - Next.js hosting (Edge Network globally)
  - Next.js API Routes (TypeScript serverless functions)
  - Automatic preview deployments
  - Analytics and monitoring
- **Google Vertex AI:**
  - Agent Development Kit (ADK) - 7 agents deployed to Agent Engine
  - Reasoning Engine (complex workflows: document generation, sharding, validation)
  - LLM access: Gemini 2.5 Pro, Claude Sonnet 4.5 (via Vertex AI Model Garden)
  - Cloud Storage (templates, document exports, sharded docs)
  - Cloud Logging
- **Supabase:**
  - PostgreSQL 15 (primary database)
  - pgvector (embeddings for semantic search - Phase 2)
  - Realtime (WebSocket pub/sub for live updates)
  - Row-Level Security (multi-tenant isolation)
  - Storage (user uploads, document exports, backups)
- **Third-party SaaS:**
  - Clerk (authentication)
  - Stripe (subscription billing)
  - Resend (transactional email)
  - Sentry (error tracking)

**Deployment Host and Regions:**
- **Frontend + API:** Vercel (primary us-east-1, Edge Network globally)
- **AI Layer:** Google Vertex AI us-central1
- **Database:** Supabase us-east-1
- **MVP Strategy:** Single region for simplicity, cross-region latency acceptable (<100ms us-central1 ↔ us-east-1)
- **Future:** Multi-region Vertex AI for Enterprise tier (Phase 2, Month 7+)

**Rationale:**
- **Next.js API Routes over FastAPI:**
  - Single language (TypeScript) eliminates type conversion overhead
  - Unified deployment (single `vercel deploy` for frontend + API)
  - Simpler development (one dev server, one test suite)
  - Node.js Vertex AI SDK (`@google-cloud/aiplatform`) is production-ready
  - Zero cold-start for TypeScript functions vs Python
- **Google ADK (Python) deployed separately:**
  - ADK agents are independent deployments to Vertex AI Agent Engine
  - Not part of Next.js application - invoked via SDK calls
  - Workflow: Next.js API → Vertex AI SDK → ADK Agent (running on GCP)
- **Supabase as single data platform:**
  - PostgreSQL + Realtime + Storage in one managed service
  - Row-Level Security simplifies multi-tenancy vs application-layer auth

### 2.3 Repository Structure

**Structure:** Turborepo Monorepo (simplified - TypeScript primary)

```
outcomesignal/
├── apps/
│   └── web/                    # Next.js 14 full-stack app (TypeScript)
│       ├── app/                # Next.js App Router
│       │   ├── (auth)/         # Auth pages (login, signup)
│       │   ├── (dashboard)/    # Dashboard pages
│       │   └── api/            # API Routes (TypeScript serverless functions)
│       │       ├── initiatives/
│       │       ├── documents/
│       │       ├── workflows/
│       │       ├── agents/
│       │       └── webhooks/
│       ├── components/         # React components
│       └── lib/                # Utilities, SDK clients
├── packages/
│   ├── ui/                     # shadcn/ui components (shared)
│   ├── types/                  # Shared TypeScript types (Supabase-generated)
│   ├── shared/                 # Constants, utilities
│   ├── google-adk/             # ADK agent definitions (Python - deployed separately)
│   │   ├── agents/             # 7 agent configurations
│   │   ├── workflows/          # Reasoning Engine workflows
│   │   ├── deploy_agents.py    # Deployment script
│   │   └── requirements.txt    # Python dependencies
│   └── config/                 # ESLint, TypeScript configs
├── infrastructure/             # Terraform for GCP
├── docs/                       # PRD, Architecture, specs
├── vercel.json                 # Vercel deployment config
├── turbo.json                  # Turborepo configuration
├── package.json                # Root workspace
└── pnpm-workspace.yaml         # pnpm workspace definition
```

### 2.4 High Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        A1[Mobile Browser]
    end

    subgraph "Vercel Platform - Unified Next.js App"
        B[Vercel Edge Network CDN]

        subgraph "Next.js App /apps/web"
            C[Next.js 14 App Router Frontend]
            C1[React Server Components]
            C2[Client Components - Three-Column Workspace]

            D[Next.js API Routes TypeScript]
            D1[/api/initiatives/* - Initiative CRUD]
            D2[/api/workflows/* - Workflow Triggers]
            D3[/api/documents/* - Document CRUD]
            D4[/api/webhooks/* - Clerk Stripe]
            D5[/api/agents/invoke - Agent Chat]
        end
    end

    subgraph "Auth & Billing SaaS"
        E[Clerk Auth]
        F[Stripe API]
        R[Resend Email]
    end

    subgraph "Supabase - Data Platform"
        K[PostgreSQL 15 + pgvector]
        K1[Realtime WebSocket]
        K2[Row-Level Security]
        K3[Supabase Storage]
    end

    subgraph "Google Vertex AI - Deployed Separately"
        G[Agent Engine - 7 ADK Agents]
        G1[Discovery Agent]
        G2[Requirements Agent]
        G3[Design Agent]
        G4[Architecture Agent]
        G5[Quality Agent]
        G6[Validation Agent]
        G7[Planning Agent]

        H[Reasoning Engine]
        H1[Document Generation Workflows Python]
        H2[create-doc workflow]
        H3[shard-doc workflow]
        H4[execute-checklist workflow]
    end

    subgraph "LLM Providers via Vertex AI"
        I[Gemini 2.5 Pro]
        J[Claude Sonnet 4.5]
    end

    subgraph "Google Cloud Storage"
        L[GCS Buckets]
        L1[Templates YAML]
        L2[Document Exports ZIP]
        L3[Sharded Documents]
    end

    subgraph "Monitoring"
        M[Sentry Error Tracking]
        N[Vercel Analytics]
        O[Google Cloud Logging]
    end

    A --> B
    A1 --> B
    B --> C
    C --> C1
    C --> C2
    C2 --> D
    D --> D1
    D --> D2
    D --> D3
    D --> D4
    D --> D5
    D2 --> G
    D5 --> G
    D2 --> H
    D --> E
    D --> F
    D --> R
    C2 --> K1
    D --> K
    G --> G1
    G --> G2
    G --> G3
    G --> G4
    G --> G5
    G --> G6
    G --> G7
    G --> I
    G --> J
    H --> H1
    H1 --> H2
    H1 --> H3
    H1 --> H4
    H --> G
    H --> L3
    H --> K
    D --> L
    D --> K3
    K --> K2
    D --> M
    C --> M
    C --> N
    H --> O
```

### 2.5 Architectural Patterns

- **Jamstack with Serverless API:** Static site generation (Next.js SSG/ISR) + Next.js API Routes for dynamic functionality - _Rationale:_ Fast initial load (<2s on 3G per NFR1), global edge caching via Vercel, zero infrastructure management

- **Component-Based UI (Atomic Design):** React components organized by shadcn/ui Scaled theme primitives - _Rationale:_ Maintainability for three-column workspace, WCAG AA accessible by default, information-dense professional UX

- **Repository Pattern:** Data access through repository classes in Next.js API Routes - _Rationale:_ Testing with mocks, clean separation between API routes and database logic

- **Backend for Frontend (BFF):** Next.js API Routes act as BFF, aggregating Supabase queries and Vertex AI calls - _Rationale:_ Reduces client bundle size, centralizes auth checks and tier-based business logic

- **Asynchronous Workflow Pattern:** API Routes trigger Vertex AI Reasoning Engine workflows, return workflow ID immediately, client subscribes to Supabase Realtime - _Rationale:_ Vercel serverless timeout (10-60s) vs document generation (10-30s p95), Reasoning Engine handles long-running workflows

- **Event-Driven Real-time Updates:** Supabase Realtime broadcasts workflow progress to connected clients - _Rationale:_ Live UI updates without polling, <1s latency per NFR4

- **Row-Level Security (RLS) Multi-Tenancy:** Supabase RLS policies enforce database-level authorization - _Rationale:_ Security requirement (NFR10-12), simpler than application-layer auth

- **Google ADK Agent Pattern:** Agents built with `google-adk`, deployed to Vertex AI Agent Engine - _Rationale:_ Official Google framework, no LangChain simplifies dependencies

- **Vertex AI Reasoning Engine for Complex Workflows:** Multi-step workflows in Python with state persistence - _Rationale:_ Handles >60s executions beyond Vercel limits, intelligent decision logic

- **Circuit Breaker with Exponential Backoff:** API calls to Vertex AI wrapped in retry logic - _Rationale:_ Graceful handling of transient failures, maintains 99% uptime (NFR7)

---

## 3. Tech Stack

### 3.1 Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Monorepo** | Turborepo | Latest | Monorepo build system | Faster builds, shared configs |
| **Package Manager** | pnpm | 8.x | Fast package manager | 3x faster than npm, single package manager for entire app |
| **Language** | TypeScript | 5.3+ | Type-safe JavaScript for full-stack | **Single language for frontend + backend API** (except separate ADK deployments) |
| **Frontend Framework** | Next.js | 14 (App Router) | React framework with SSR/SSG | App Router with React Server Components |
| **Backend Framework** | Next.js API Routes | 14 (App Router) | **TypeScript serverless API endpoints** | Unified deployment, zero cold-start |
| **API Style** | REST + WebSocket | OpenAPI 3.0 | RESTful API + Realtime WebSocket | REST for CRUD, WebSocket via Supabase Realtime |
| **UI Component Library** | shadcn/ui | Latest (Scaled theme) | Accessible React components | Radix UI primitives, Scaled theme |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first CSS | Rapid styling, JIT compiler |
| **State Management** | Zustand | 4.x | Lightweight client state | Simple API, <1KB bundle |
| **Server State** | React Query (TanStack Query) | 5.x | Server state caching | Background refetching, optimistic updates |
| **Forms** | React Hook Form | 7.x | Form validation | Minimal re-renders, Zod integration |
| **Validation** | Zod | 3.x | TypeScript-first schema validation | **Shared between frontend and API Routes** |
| **Rich Text Editor** | TipTap | 2.x | Prosemirror-based editor | Read-only markdown rendering MVP |
| **Icons** | Lucide React | Latest | Icon library | Consistent with shadcn/ui |
| **Database** | Supabase (PostgreSQL) | 15+ | Managed Postgres | pgvector, RLS, Realtime |
| **ORM/Query Builder** | Supabase JS Client | Latest | Type-safe database queries | Auto-generated from schema |
| **File Storage** | Supabase Storage | N/A | User uploads and exports | S3-compatible, CDN |
| **Authentication** | Clerk | Latest | User authentication | Pre-built UI, social OAuth |
| **Payment Processing** | Stripe | API 2024-01-01 | Subscription billing | Stripe Checkout, webhooks |
| **Email** | Resend | Latest | Transactional email | Developer-friendly API |
| **AI Orchestration** | Google Vertex AI ADK | Latest (google-adk) | **Agent development (Python - deployed separately)** | Official Google framework |
| **AI SDK (Node.js)** | @google-cloud/aiplatform | Latest | **Vertex AI SDK for Next.js API Routes** | **Invoke ADK agents from TypeScript** |
| **AI Agents** | Vertex AI Agent Engine | N/A | Managed agent execution | Hosts google-adk agents |
| **AI Workflows** | Vertex AI Reasoning Engine | N/A | Complex multi-step workflows | State persistence, resumable |
| **LLM Providers** | Gemini 2.5 Pro, Claude Sonnet 4.5 | Via Vertex AI | A/B testing | Unified API |
| **Frontend Testing** | Vitest + React Testing Library | Latest | Unit and component tests | Fast, Jest-compatible |
| **Backend Testing** | Vitest | Latest | **API Route testing** | **Same test framework** |
| **E2E Testing** | Playwright | Latest | End-to-end browser tests | Cross-browser, auto-wait |
| **Build Tool** | Turbo (Turborepo) | Latest | Incremental builds | Parallel execution |
| **CI/CD** | GitHub Actions + Vercel | N/A | Continuous deployment | GitHub Actions for tests |
| **Monitoring** | Vercel Analytics + Sentry | Latest | Web vitals and errors | Unified error tracking |
| **Logging** | Vercel logs + Google Cloud Logging | Built-in | Application logging | Structured JSON logs |

### 3.2 Package Management Strategy

**Application (TypeScript):**
- **Manager:** pnpm
- **Scope:** Entire Next.js app (`/apps/web`), shared packages
- **Root file:** `pnpm-workspace.yaml`, `package.json`

**Google ADK Agents (Python):**
- **Manager:** pip (requirements.txt)
- **Scope:** `/packages/google-adk/` only
- **Deployment:** Separate from Next.js app - deployed directly to Vertex AI via CI/CD
- **Not part of Vercel deployment**

---

## 4. Data Models

This section defines the core data models/entities shared between frontend (Next.js) and backend (Next.js API Routes).

### Model 1: User

**Purpose:** Represents authenticated users. Synced from Clerk auth to Supabase via webhook.

**TypeScript Interface:**
```typescript
interface User {
  id: string; // UUID
  clerk_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
```

**Relationships:**
- Has many `Subscription` (1:1 active)
- Has many `Initiative` (1:N)
- Has many `AgentConversation` (1:N)

### Model 2: Subscription

**Purpose:** Tracks user subscription tier, status, and Stripe integration.

**TypeScript Interface:**
```typescript
type SubscriptionTier = 'trial' | 'starter' | 'professional' | 'enterprise';
type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due';

interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}
```

### Model 3: Initiative

**Purpose:** Represents a project or product being planned/developed.

**TypeScript Interface:**
```typescript
type InitiativeStatus = 'active' | 'archived';
type InitiativePhase = 'planning' | 'development' | 'testing' | 'deployed';

interface Initiative {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: InitiativeStatus;
  phase: InitiativePhase;
  phase_progress: number; // 0-100
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}
```

### Model 4: Document

**Purpose:** Planning documents generated by AI agents.

**TypeScript Interface:**
```typescript
type DocumentType =
  | 'brief'
  | 'market_research'
  | 'competitive_analysis'
  | 'prd'
  | 'architecture'
  | 'ux_overview'
  | 'security_review'
  | 'qa_strategy';

type DocumentStatus = 'draft' | 'approved' | 'archived';

interface Document {
  id: string;
  initiative_id: string;
  type: DocumentType;
  title: string;
  content: string; // Markdown
  version: number;
  status: DocumentStatus;
  generated_by_agent: string;
  llm_model: string;
  tokens_used: number;
  generation_time_ms: number;
  created_at: string;
  updated_at: string;
}
```

### Model 5-12: Additional Models

See full architecture document for complete definitions of:
- DocumentVersion
- Epic
- Story (Phase 2)
- Task (Phase 2)
- QAGate (Phase 2)
- AgentConversation
- UsageTracking
- WorkflowExecution

**Complete Data Model Hierarchy:**
```
User
 ├── Subscription (1:1)
 │    └── UsageTracking (1:N, per month)
 │
 ├── Initiative (1:N)
 │    ├── Document (1:N)
 │    │    ├── DocumentVersion (1:N)
 │    │    └── Epic (1:N, extracted from PRD)
 │    │         └── Story (1:N) [Phase 2+]
 │    │              ├── Task (1:N)
 │    │              └── QAGate (1:1, optional)
 │    │
 │    ├── AgentConversation (1:N)
 │    └── WorkflowExecution (1:N)
```

---

## 5. API Specification

### 5.1 API Base URL

- **Production:** `https://outcomesignal.app/api`
- **Development:** `http://localhost:3000/api`
- **Staging:** `https://staging.outcomesignal.app/api`

### 5.2 Authentication

All API endpoints require Clerk JWT tokens:

```
Authorization: Bearer <clerk_jwt_token>
```

### 5.3 API Endpoint Groups

1. **Initiatives** - `/api/v1/initiatives`
2. **Documents** - `/api/v1/documents`
3. **Workflows** - `/api/v1/workflows`
4. **Agents** - `/api/v1/agents`
5. **Conversations** - `/api/v1/conversations`
6. **Subscriptions** - `/api/v1/subscriptions`
7. **Usage** - `/api/v1/usage`
8. **Webhooks** - `/api/v1/webhooks`

### 5.4 Example API Routes

**POST /api/initiatives** - Create Initiative
```typescript
// Request
{
  "title": "Customer Portal MVP",
  "description": "Internal customer portal..."
}

// Response (201 Created)
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Customer Portal MVP",
    "status": "active",
    "phase": "planning",
    ...
  }
}
```

**POST /api/workflows/generate-document** - Trigger Document Generation
```typescript
// Request
{
  "initiative_id": "550e8400...",
  "document_type": "prd",
  "user_inputs": { ... }
}

// Response (202 Accepted)
{
  "data": {
    "workflow_id": "wf_abc123",
    "status": "running",
    "progress": 0,
    "estimated_completion_seconds": 20
  }
}
```

**GET /api/workflows/{workflowId}/status** - Poll Workflow Status
```typescript
// Response (200 OK)
{
  "data": {
    "id": "wf_abc123",
    "status": "running",
    "progress": 65,
    "current_step": "Step 4: Populating PRD template"
  }
}
```

See full document for complete API specification with all endpoints, request/response formats, and error codes.

---

## 6. Components Architecture

### 6.1 Component Hierarchy

```
apps/web/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth routes
│   ├── (dashboard)/              # Authenticated routes
│   │   └── initiatives/[id]/     # Three-column workspace
│   └── api/                      # API Routes
│
├── components/
│   ├── workspace/                # Three-column workspace
│   │   ├── WorkspaceShell.tsx
│   │   ├── LeftPanel.tsx         # Hierarchy tree
│   │   ├── MiddlePanel.tsx       # Document preview
│   │   └── RightPanel.tsx        # Agent chat
│   │
│   ├── hierarchy/                # Left panel components
│   ├── preview/                  # Middle panel components
│   │   └── TipTapEditor.tsx
│   ├── chat/                     # Right panel components
│   │   └── WorkflowProgress.tsx
│   └── ui/                       # shadcn/ui primitives
```

### 6.2 Key Components

**WorkspaceShell** - Main three-column layout:
```tsx
<div className="grid grid-cols-[300px_1fr_400px] h-screen">
  <LeftPanel initiativeId={initiativeId} />
  <MiddlePanel initiativeId={initiativeId} />
  <RightPanel initiativeId={initiativeId} />
</div>
```

**Responsive Behavior:**
- Desktop (≥1440px): Three columns visible
- Tablet (768px-1439px): Middle + Right, Left collapses
- Mobile (<768px): Single column, swipe navigation

---

## 7. External APIs & Third-Party Integrations

### 7.1 Clerk - Authentication

- **Purpose:** User authentication and session management
- **Integration:** SDK + Webhooks
- **Webhooks:** `user.created`, `user.updated`, `user.deleted` → Sync to Supabase

### 7.2 Stripe - Payment Processing

- **Purpose:** Subscription billing
- **Integration:** SDK + Webhooks
- **Webhooks:** `customer.subscription.*`, `invoice.*` → Update Supabase subscriptions

**Subscription Tiers:**
| Tier | Price | Credits/Month | Initiatives |
|------|-------|---------------|-------------|
| Trial | $0 | 5 | 1 |
| Starter | $19/mo | 25 | 3 |
| Professional | $49/mo | 100 | Unlimited |
| Enterprise | Custom | Unlimited | Unlimited |

### 7.3 Google Vertex AI

- **Purpose:** AI agent deployment and LLM access
- **Integration:** `@google-cloud/aiplatform` Node.js SDK
- **Services:** Agent Engine (7 ADK agents), Reasoning Engine (workflows), Model Garden (Gemini, Claude)

### 7.4 Supabase

- **Purpose:** Database, storage, real-time subscriptions
- **Integration:** `@supabase/supabase-js` SDK
- **Features:** PostgreSQL 15, Realtime WebSocket, Row-Level Security, Storage

### 7.5 Resend - Email

- **Purpose:** Transactional email delivery
- **Email Types:** Welcome, trial expiring, subscription receipts, payment failed

### 7.6 Sentry - Error Tracking

- **Purpose:** Error tracking and performance monitoring
- **Integration:** `@sentry/nextjs` SDK
- **Features:** Error tracking, performance monitoring, session replay

### 7.7 Monthly Cost Estimate

| Service | Monthly Cost |
|---------|--------------|
| Clerk | $25-50 |
| Stripe | 2.9% + $0.30/transaction |
| Vertex AI | $300-500 |
| Supabase | $25 |
| Resend | $20 |
| Sentry | $26 |
| Vercel | $20 |
| **TOTAL** | **~$436-641/mo** |

---

## 8. Core Workflows

### 8.1 User Onboarding & First Initiative

```
User signs up → Clerk creates account → Webhook to API
→ Create user in Supabase → Create Trial subscription
→ User creates first initiative → Navigate to workspace
```

### 8.2 Generate PRD Document (Core Flow)

```
User: "Help me create a PRD"
→ API invokes Primary Agent
→ Agent asks 3-5 questions
→ User provides answers
→ API checks credits, triggers Reasoning Engine
→ Workflow executes 6 steps (15-25s)
→ Supabase Realtime broadcasts progress
→ Document saved, rendered in TipTap preview
```

**Timing:** 3-7 minutes total (including Q&A)

### 8.3 Document Approval & Next Steps

```
User reviews PRD → Clicks "Approve"
→ API updates status to "approved"
→ Initiative phase_progress updated
→ Agent suggests next documents (Architecture, UX)
```

### 8.4 Subscription Upgrade

```
User tries to create 2nd initiative (Trial limit: 1)
→ API returns 402 Payment Required
→ User clicks "Upgrade to Starter"
→ API creates Stripe Checkout Session
→ User completes payment
→ Stripe webhook updates Supabase
→ Credits and limits increased
```

### 8.5 Workflow Timing Summary

| Workflow | Time | Credits | NFR |
|----------|------|---------|-----|
| Document Generation | 15-25s (p95 <30s) | 1 credit | NFR1 |
| Document Revision | 8-15s | 0.5 credits | NFR1 |
| Chat Interaction | <2s | 0 credits | NFR4 |

---

## 9. Database Schema

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

## 10. Frontend Architecture Details

### 10.1 Next.js App Router Structure

```
apps/web/app/
├── layout.tsx                      # Root layout (providers)
├── (auth)/                         # Auth route group
│   ├── sign-in/[[...sign-in]]/
│   └── sign-up/[[...sign-up]]/
├── (dashboard)/                    # Dashboard route group
│   ├── layout.tsx                  # Dashboard layout
│   ├── initiatives/
│   │   └── [initiativeId]/
│   │       └── page.tsx            # Three-column workspace
│   └── settings/
└── api/                            # API Routes
```

### 10.2 React Server Components vs Client Components

**Server Components (default):**
- Layouts, static pages
- Data fetching shells

**Client Components (`'use client'`):**
- Three-column workspace
- Forms, interactive UI
- Real-time components

### 10.3 Data Fetching Patterns

**React Query Hooks:**
```typescript
export function useInitiative(initiativeId: string) {
  return useQuery({
    queryKey: ['initiative', initiativeId],
    queryFn: () => fetchInitiative(initiativeId),
  });
}
```

**Supabase Realtime:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel(`workflow:${workflowId}`)
    .on('postgres_changes', { ... }, (payload) => {
      queryClient.invalidateQueries(['workflow', workflowId]);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [workflowId]);
```

---

## 11. Backend Architecture Details

### 11.1 Next.js API Routes Pattern

**File Structure:**
```
app/api/
├── initiatives/
│   ├── route.ts                    # GET, POST /api/initiatives
│   └── [initiativeId]/
│       └── route.ts                # GET, PATCH /api/initiatives/:id
├── workflows/
│   ├── generate-document/
│   │   └── route.ts                # POST trigger workflow
│   └── [workflowId]/
│       └── status/
│           └── route.ts            # GET workflow status
```

### 11.2 Authentication Middleware

```typescript
import { auth } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  // Proceed with authenticated request
}
```

### 11.3 Validation with Zod

```typescript
const createInitiativeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});

const validation = createInitiativeSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json({ error: validation.error }, { status: 400 });
}
```

---

## 12. Deployment Architecture

### 12.1 Vercel Configuration

**File:** `vercel.json`
```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

### 12.2 Environment Variables

**Production:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`

### 12.3 CI/CD Pipeline

**GitHub Actions:**
```yaml
name: CI/CD
on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-args: '--prod'
```

### 12.4 Google ADK Deployment

**Separate pipeline for ADK agents:**
```yaml
name: Deploy ADK Agents
on:
  push:
    paths: ['packages/google-adk/**']

jobs:
  deploy-agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: |
          cd packages/google-adk
          pip install -r requirements.txt
          python deploy_agents.py
```

---

## 13. Security & Performance

### 13.1 Security Architecture

**Multi-Layer Security:**
1. Clerk JWT verification (Next.js Middleware)
2. API Route authorization (userId validation)
3. Supabase Row-Level Security (database enforcement)
4. Resource ownership validation (business logic)

**Content Security Policy:**
```javascript
// next.config.js
headers: [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'..."
  }
]
```

**Rate Limiting:**
```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

const { success } = await ratelimit.limit(userId);
if (!success) {
  return NextResponse.json({ error: 'rate_limit_exceeded' }, { status: 429 });
}
```

### 13.2 Performance Optimization

**Performance Budgets:**
| Metric | Target | NFR |
|--------|--------|-----|
| First Contentful Paint | <1.8s | NFR1 |
| Largest Contentful Paint | <2.5s | NFR1 |
| Time to Interactive | <3.5s | NFR1 |
| API Response (p95) | <500ms | NFR1 |
| Document Generation (p95) | <30s | NFR1 |

**Optimization Techniques:**
- React Server Components (reduce bundle size)
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Font optimization with next/font
- React Query caching (1 min stale time)

---

## 14. Testing Strategy

### 14.1 Testing Pyramid

```
     /\      E2E Tests (10 critical flows)
    /  \     Integration Tests (50+ API routes)
   /____\    Unit Tests (200+ components/utils)
```

### 14.2 Unit Testing (Vitest)

```typescript
describe('LeftPanel', () => {
  it('renders initiative hierarchy', async () => {
    render(<LeftPanel initiativeId="test-id" />, {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(screen.getByText('Customer Portal MVP')).toBeInTheDocument();
    });
  });
});
```

### 14.3 API Route Testing

```typescript
describe('POST /api/initiatives', () => {
  it('creates initiative successfully', async () => {
    vi.mocked(auth).mockReturnValue({ userId: 'user-123' });

    const request = new Request('http://localhost/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

### 14.4 E2E Testing (Playwright)

```typescript
test('user can create initiative', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('button:has-text("Create Initiative")');
  await page.fill('input[name="title"]', 'E2E Test');
  await page.click('button:has-text("Create")');
  await page.waitForURL(/\/initiatives\/.+/);
});
```

### 14.5 Coverage Targets

- Unit Tests: >80%
- Integration Tests: >70%
- E2E Tests: 10 critical flows

---

## 15. Coding Standards

### 15.1 TypeScript Standards

**tsconfig.json (Strict Mode):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Type Safety Rules:**
```typescript
// ✅ DO: Explicit return types
export function checkLimits(): Promise<{ allowed: boolean }> { }

// ❌ DON'T: Use any
const data: any = await fetch();

// ✅ DO: Use unknown and type guards
const data: unknown = await fetch();
if (isValidData(data)) { }
```

### 15.2 File Naming Conventions

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Hooks: `useHookName.ts`
- Constants: `SCREAMING_SNAKE_CASE.ts`

### 15.3 Component Structure

```tsx
// 1. Imports
// 2. Props interface
// 3. Component
// 4. Hooks (state, effects, queries)
// 5. Event handlers
// 6. Render guards
// 7. Main render
```

---

## 16. Error Handling & Monitoring

### 16.1 Error Handling

**Error Boundary:**
```tsx
export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

**API Error Classes:**
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) { }
}
```

### 16.2 Sentry Integration

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 16.3 Logging

```typescript
export function log(level: LogLevel, message: string, context?: LogContext) {
  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  console.log(JSON.stringify(logEntry));
}
```

### 16.4 Monitoring

- **Vercel Analytics:** Web Vitals, Real User Monitoring
- **Sentry:** Error tracking, performance monitoring
- **Custom Metrics:** Track document generation, subscription upgrades
- **Health Check:** `/api/health` endpoint

---

## Conclusion

This architecture document provides a comprehensive blueprint for building OutcomeSignal as a unified Next.js fullstack application with Google Vertex AI integration for intelligent document generation.

**Key Architectural Decisions:**
1. **Single Language:** TypeScript for frontend and backend API (Python only for separately-deployed ADK agents)
2. **Unified Platform:** Vercel for Next.js frontend + API Routes
3. **Managed Services:** Supabase (database/realtime), Clerk (auth), Stripe (billing)
4. **AI-First:** Google Vertex AI ADK for agent development, Reasoning Engine for complex workflows
5. **Real-time:** Supabase Realtime for live workflow progress updates

**Next Steps:**
1. Set up development environment (pnpm, Next.js, Supabase)
2. Implement database schema with migrations
3. Build core components (three-column workspace)
4. Implement API Routes for initiatives and documents
5. Deploy Google ADK agents to Vertex AI
6. Integrate Reasoning Engine workflows
7. Set up CI/CD pipeline
8. Launch MVP

---

**Document Status:** ✅ Complete and ready for implementation

🏗️ Built by Winston (Architect Agent) powered by BMAD™ Core
