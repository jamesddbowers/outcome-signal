# Technical Assumptions

## Monorepo Structure

**Turborepo Configuration:**
- Root workspace with shared TypeScript configs, ESLint, Prettier
- Apps: `web` (Next.js), `api` (FastAPI Python)
- Packages: `ui` (shadcn/ui components), `types` (shared TypeScript types), `config` (shared configs)

## Service Architecture

**Frontend (Next.js 14 App Router):**
- TypeScript strict mode with Zod validation
- React Server Components for initial render performance
- Client Components for interactive UI (chat, real-time updates)
- TipTap editor for markdown preview rendering
- shadcn/ui component library (Radix UI primitives)
- Tailwind CSS for styling

**Backend (FastAPI Python):**
- Python 3.11+ with type hints (Pydantic models)
- OpenAPI auto-generation via FastAPI decorators
- Background tasks for long-running agent workflows
- Celery + Redis for task queue (document generation)

**AI Agent Layer:**
- Google Vertex AI Agent Builder for agent orchestration
- LangChain or LlamaIndex for RAG (document context retrieval)
- A/B testing framework for Gemini 2.5 Pro vs Claude Sonnet 4.5
- Agent state management via Supabase Realtime

## Testing Requirements

**Frontend:**
- Jest + React Testing Library for unit tests
- Playwright for E2E tests (critical user flows)
- Storybook for component development/documentation

**Backend:**
- pytest for API endpoint tests
- pytest-asyncio for async workflow tests
- Mock LLM responses for deterministic testing

**Target Coverage:** 80%+ for critical paths (auth, billing, document generation)

## Frontend Stack

- **Framework:** Next.js 14 (App Router, React Server Components)
- **Language:** TypeScript 5.0+ (strict mode)
- **Styling:** Tailwind CSS 3.3+ with shadcn/ui
- **State Management:** Zustand for client state, React Query for server state
- **Forms:** React Hook Form + Zod validation
- **Rich Text:** TipTap (Prosemirror-based editor for markdown preview)
- **Icons:** Lucide React

## Backend Stack

- **Framework:** FastAPI 0.104+ (Python 3.11+)
- **Task Queue:** Celery 5.3+ with Redis backend
- **AI Orchestration:** Google Vertex AI Agent Builder + LangChain
- **LLM Providers:** Gemini 2.5 Pro (Google AI Studio), Claude Sonnet 4.5 (Anthropic)
- **Vector Store:** Supabase pgvector (for document embeddings if needed)

## Database & Storage

- **Primary Database:** Supabase (PostgreSQL 15+)
- **Realtime:** Supabase Realtime (WebSocket-based pub/sub for agent messages)
- **File Storage:** Supabase Storage (for document exports, user uploads)
- **Schema:**
  - `users` (auth via Clerk, synced to Supabase)
  - `initiatives` (projects/initiatives)
  - `documents` (Brief, PRD, Architecture, etc.)
  - `agent_conversations` (chat history)
  - `usage_tracking` (credits, billing events)
  - `subscriptions` (Stripe sync)

## AI & Machine Learning

- **Primary LLM (TBD via A/B test):** Gemini 2.5 Pro OR Claude Sonnet 4.5
- **Agent Framework:** Google Vertex AI Agent Builder
- **Orchestration Pattern:** Single Primary Agent → 6 specialized sub-agents (Discovery, Requirements, Design, Architecture, Quality, Validation)
- **Context Management:** RAG with document sharding (PRD epics, Architecture sections)
- **Prompt Engineering:** System prompts per agent with persona definitions (see Epic 4)

## Payment & Billing

- **Payment Processor:** Stripe
- **Subscription Model:** Monthly SaaS (Starter $49, Professional $149, Enterprise $499)
- **Webhook Handling:** Stripe webhooks → FastAPI endpoints → Supabase updates
- **Customer Portal:** Stripe Customer Portal (hosted billing management)
- **Usage Tracking:** Credit-based system (1 credit = 1 document generation or 1 major revision)

## Monitoring & Logging

- **Application Monitoring:** Vercel Analytics (frontend performance)
- **Error Tracking:** Sentry (frontend + backend)
- **Logging:** Vercel logs (frontend), Google Cloud Logging (backend/agents)
- **Metrics:** Custom dashboards in Supabase (usage, conversion, approval rates)

## Development Tools

- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions (lint, test, deploy)
- **Deployment:**
  - Frontend → Vercel (auto-deploy from `main` branch)
  - Backend → Google Cloud Run (containerized FastAPI)
  - Agents → Vertex AI Agent Builder (deployed via ADK)
- **Environments:**
  - Development (local)
  - Staging (preview branches on Vercel)
  - Production (main branch)

## Security Assumptions

- **Authentication:** Clerk handles all auth (email/password, OAuth)
- **Authorization:** Row-level security (RLS) in Supabase (users can only access their data)
- **API Security:** API keys for backend ↔ agent communication (stored in environment variables)
- **Data Encryption:** AES-256 at rest (Supabase default), TLS 1.3 in transit
- **Secrets Management:** Environment variables in Vercel + Google Cloud Secret Manager

## Deployment Strategy

**Phase 1 (Months 1-3): MVP Launch**
- Single region (us-central1 for GCP, us-east-1 for Vercel)
- No CDN (Vercel handles edge caching)
- Manual database migrations (Supabase migrations via CLI)

**Phase 2 (Months 4-12): Scale**
- Multi-region support for Enterprise tier
- CDN for static assets (Cloudflare or Vercel Edge Network)
- Automated database migrations in CI/CD

## Infrastructure Cost Assumptions

**MVP Phase (<100 users, Month 1-6):**
- Vercel Pro: $20/mo (frontend hosting)
- Supabase Pro: $25/mo (database + realtime + storage)
- Google Cloud (Vertex AI + Cloud Run): $150-200/mo (agent orchestration, API backend)
- Stripe: 2.9% + $0.30 per transaction (~$50/mo at $2K MRR)
- Clerk: $25/mo (auth, up to 1,000 MAUs)
- Misc (Sentry, monitoring): $15/mo
- **Total:** $285-335/mo

**Scale Phase (500 users, Month 12):**
- Vercel Enterprise: $200/mo (SLA, support)
- Supabase Pro: $125/mo (higher limits)
- Google Cloud: $1,200-1,500/mo (scaling agent usage)
- Stripe: ~$300/mo (at $60K MRR)
- Clerk: $99/mo (up to 10,000 MAUs)
- Misc: $75/mo
- **Total:** $2,000-2,300/mo

---
