# 2. High Level Architecture

## 2.1 Technical Summary

OutcomeSignal employs a **unified Next.js fullstack architecture** designed for rapid AI-driven document generation with real-time collaboration. The system combines:

- **Frontend:** Next.js 14 (TypeScript, Turborepo `/apps/web`) with React Server Components, Client Components for interactive UI (chat, real-time updates), and shadcn/ui Scaled theme with Tailwind CSS
- **Backend API:** **Next.js API Routes** (TypeScript, App Router `/app/api/*`) providing RESTful endpoints for document generation, agent invocation, and workflow orchestration
- **AI Orchestration:** **Google Vertex AI Agent Development Kit (ADK)** for building 7 specialized agents (deployed separately to Vertex AI Agent Engine), with **Vertex AI Reasoning Engine** for complex multi-step document generation workflows
- **Long-Running Workflows:** **Vertex AI Reasoning Engine** handles document generation (10-30s workflows) with state persistence in Supabase, invoked asynchronously from Next.js API Routes via `@google-cloud/aiplatform` Node.js SDK
- **Data & Real-time:** Supabase (PostgreSQL 15 + pgvector) with Realtime WebSocket pub/sub for live agent message streaming, Row-Level Security for multi-tenancy, Supabase Storage for user files
- **Deployment:** Vercel for unified deployment (Next.js frontend + API Routes as serverless functions), Google Vertex AI for agent execution, single region (us-central1 GCP, us-east-1 Vercel/Supabase) for MVP

This architecture achieves the PRD goals of <30s document generation (p95) via Reasoning Engine workflows, 80%+ approval rate through context-aware ADK agents, and <$0.10 LLM cost per document via A/B testing (Gemini 2.5 Pro vs Claude Sonnet 4.5).

## 2.2 Platform and Infrastructure Choice

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

## 2.3 Repository Structure

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

## 2.4 High Level Architecture Diagram

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

## 2.5 Architectural Patterns

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
