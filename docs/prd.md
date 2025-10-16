# Product Requirements Document (PRD)
# OutcomeSignal - AI Planning Platform

**Version**: 1.0
**Created**: 2025-10-15
**Last Updated**: 2025-10-15
**Created By**: John (PM Agent) in collaboration with User
**Status**: Approved

---

## Table of Contents

1. [Goals and Background Context](#goals-and-background-context)
2. [Requirements](#requirements)
3. [User Interface Design Goals](#user-interface-design-goals)
4. [Technical Assumptions](#technical-assumptions)
5. [Epic List](#epic-list)
6. [Epic 1: Foundation & Authentication](#epic-1-foundation--authentication)
7. [Epic 2: Three-Column Workspace & Navigation](#epic-2-three-column-workspace--navigation)
8. [Epic 3: Trial Management & Subscription Infrastructure](#epic-3-trial-management--subscription-infrastructure)
9. [Epic 4: BMAD Framework Adaptation & Rebranding](#epic-4-bmad-framework-adaptation--rebranding)
10. [Epic 5: AI Agent Orchestration (Planning Phase)](#epic-5-ai-agent-orchestration-planning-phase)
11. [Epic 6: Document Management & Export](#epic-6-document-management--export)
12. [Epic 7: Hierarchy Display & Initiative Management](#epic-7-hierarchy-display--initiative-management)
13. [Epic 8: LLM A/B Testing & Optimization](#epic-8-llm-ab-testing--optimization)
14. [Epic 9: Monitoring, Analytics & Launch Prep](#epic-9-monitoring-analytics--launch-prep)
15. [Conclusion & Next Steps](#conclusion--next-steps)

---

## Goals and Background Context

### Goals

- Deliver an intelligent SDLC orchestration platform that guides users from ideation through production-ready specifications
- Enable solo developers and small teams to create professional-grade planning documentation without dedicated PMs/architects
- Reduce planning time from 30+ days to 7 days or less through AI agent orchestration
- Achieve 80%+ document approval rate (agent drafts require minimal revisions)
- Establish OutcomeSignal as system-of-record for planning artifacts while integrating with Linear, Jira, Notion, and Azure Boards
- Reach $60K MRR ($720K ARR) by end of Year 1 with 500 paying customers
- Maintain unit economics with 80%+ gross margins and <$500 Customer Acquisition Cost
- Build natural learning through opinionated workflows that teach SDLC best practices conversationally

### Background Context

Software teams struggle to maintain comprehensive, consistent documentation across the SDLC. Analysis artifacts (briefs, research) don't properly cascade into planning documents (PRDs, architecture), creating gaps that lead to miscommunication, scope creep, and failed projects. Studies show 70% of software projects fail due to poor requirements (see [Project Brief: Problem Statement](brief.md#problem-statement)), with teams spending 8-12 hours weekly searching for context across documentation silos.

Current tools are either too rigid (Jira, Linear—great for execution, poor for upfront planning) or too freeform (Notion, Confluence—flexible but provide no guidance or structure). OutcomeSignal bridges this gap by providing a single AI agent that orchestrates 6 specialized sub-agents across Planning phase (see [Project Brief: Proposed Solution](brief.md#proposed-solution)) to create all upstream project documentation. The three-column workspace (hierarchy navigation, live document preview, agent chat) provides visual hierarchy and unified context, while the system-of-record architecture enables platform migration safety and multi-platform support.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-15 | 1.0 | Initial PRD creation from Project Brief | John (PM Agent) |

---

## Requirements

### Functional Requirements

**Authentication & User Management**
- FR1: System shall support email/password authentication via Clerk
- FR2: System shall support social OAuth (Google, GitHub) via Clerk
- FR3: System shall enforce 7-day free trial with hard limits (1 Initiative, 1 document: Brief only)
- FR4: System shall track trial expiration and trigger paywall modal at trial end or limit breach (attempting to create 2nd Initiative or 2nd document of any type)
- FR5: System shall integrate with Stripe for subscription management (Starter $49/mo, Professional $149/mo, Enterprise $499/mo)

**Three-Column Workspace UI**
- FR6: System shall display Initiative/Epic hierarchy tree in left column with navigation
- FR7: System shall render live markdown document preview in middle column using TipTap (read-only in MVP)
- FR8: System shall provide single AI agent chat interface in right column
- FR9: System shall display phase indicators ("📋 Planning Phase [X%]") in UI header
- FR10: System shall show sub-agent transparency messages (e.g., "Working with Architecture Agent on tech stack...")

**AI Agent Orchestration**
- FR11: System shall provide single Primary Agent that orchestrates 6 specialized sub-agents (Discovery, Requirements, Design, Architecture, Quality, Validation) behind the scenes
- FR12: System shall support Planning workflow: Project Brief, Market Research, Competitive Analysis, PRD, Architecture Overview, UX Overview, Security Review, QA Strategy
- FR13: System shall enable explicit phase transitions with UI indicators when progressing through planning
- FR14: System shall implement human approval gates with "Approve" / "Need Changes" buttons for each document
- FR15: System shall interpret natural language approvals ("Looks good", "Perfect, proceed", etc.)

**Document Generation (8 Core Types)**
- FR16: System shall generate Project Brief documents at Initiative level
- FR17: System shall generate Market Research documents (optional, user-triggered)
- FR18: System shall generate Competitive Analysis documents (optional, user-triggered)
- FR19: System shall generate PRD documents
- FR20: System shall generate Architecture Overview documents
- FR21: System shall generate UX Overview documents (optional, user-triggered)
- FR22: System shall generate Security Review documents
- FR23: System shall generate QA Strategy documents
- FR24: System shall implement intelligent backfilling (if user jumps ahead, agent recognizes missing prerequisite documents and backfills)

**Hierarchy Management**
- FR25: System shall display PRD-generated epics in hierarchy tree (read-only, sourced from PRD)
- FR26: System shall enable Initiative-level CRUD operations (create, rename, archive, delete)
- FR27: System shall support navigation via click to view Initiative details or documents
- FR28: System shall implement soft delete with history preservation (no hard deletes in MVP)
- FR29: System shall associate documents at Initiative level
- FR30: System shall enforce Initiative limits based on tier (Trial: 1, Starter: 3/mo, Professional/Enterprise: unlimited)

**Export Capabilities**
- FR31: System shall enable per-document markdown export (download individual `.md` files)
- FR32: System shall enable bulk export as ZIP archive of entire Initiative with all documents
- FR33: System shall restrict export capabilities to paid tiers only (blocked for trial users)

**Usage Tracking & Billing**
- FR34: System shall track usage credits (1 credit = 1 document generation OR 1 major revision)
- FR35: System shall enforce tier-based credit limits (Starter: 25/mo, Professional: 100/mo, Enterprise: unlimited)
- FR36: System shall enable credit top-off purchases via Stripe
- FR37: System shall track Initiative count and enforce tier limits (Trial: 1, Starter: 3/mo, Pro/Enterprise: unlimited)
- FR38: System shall provide Stripe Customer Portal for subscription management

### Non-Functional Requirements

**Performance**
- NFR1: Agent response time shall be <3s for simple queries, <30s for document generation
- NFR2: UI interaction feedback shall be <100ms (button clicks, navigation)
- NFR3: Document preview rendering shall be <500ms for markdown documents up to 100 pages
- NFR4: Real-time updates via Supabase Realtime shall have <1s latency

**Scalability**
- NFR5: System shall support 100-500 concurrent users in MVP phase without performance degradation
- NFR6: Supabase Realtime shall handle 1,000+ concurrent agent conversations

**Reliability & Availability**
- NFR7: System shall maintain 99% uptime during MVP phase (Month 1-6)
- NFR8: System shall maintain 99.9% uptime for Enterprise tier (Month 12+)
- NFR9: Supabase database shall perform daily automated backups

**Security & Compliance**
- NFR10: All data at rest shall be encrypted using AES-256 (Supabase default)
- NFR11: All data in transit shall use HTTPS with TLS 1.3
- NFR12: Integration credentials (Linear, Jira, Notion API tokens) shall be encrypted in database
- NFR13: System shall support GDPR data export on request
- NFR14: System shall implement soft delete → hard delete after 30 days for account deletion

**Cost Optimization**
- NFR15: LLM API costs shall remain <$0.10 per document generation to maintain 80%+ gross margins
- NFR16: Infrastructure costs shall stay within $285-335/mo for MVP phase (<100 users)
- NFR17: System shall A/B test Gemini 2.5 Pro vs Claude Sonnet 4.5 in Month 1-2 (design partner phase) before selecting primary LLM; selection criteria: approval rate (target 80%+), cost per document (target <$0.10), response time (target <30s for document generation)

**Usability**
- NFR18: New users shall complete first document approval within 30 minutes (time to first value)
- NFR19: System shall maintain 80%+ document approval rate (first drafts acceptable with minor edits)
- NFR20: Trial signup flow shall require no credit card (reduce friction)

**Maintainability**
- NFR21: Codebase shall use TypeScript (Next.js frontend, type safety)
- NFR22: API backend shall use FastAPI (Python) with OpenAPI spec auto-generation
- NFR23: Repository shall use Turborepo monorepo structure for code sharing
- NFR24: All public APIs shall have OpenAPI documentation

---

## User Interface Design Goals

### Overall UX Vision

OutcomeSignal embodies **"Executive Delegation"** as the core interaction paradigm—users act as executives directing a capable AI planning team. The interface should feel like a conversation with a smart PM who manages specialists behind the scenes, not like wrestling with a complex tool. Visual hierarchy (three-column workspace) provides spatial awareness of project structure, current document context, and agent conversation simultaneously, reducing cognitive load and context switching.

The UX prioritizes **clarity over cleverness**: no hidden features, no ambiguous states, no "magic" that users can't understand. Every agent action should have visible status, every document version should be traceable, and every transition should be explicit. This transparency builds trust in AI-generated content while maintaining the delightful simplicity of chat-based interaction.

### Key Interaction Paradigms

**1. Conversational Workflow with Spatial Context**
- Users converse naturally with the primary agent in the right column
- Middle column provides live preview of what's being discussed/generated
- Left column maintains "you are here" orientation within project hierarchy
- No mode switching—users stay in one workspace from idea to backlog

**2. Progressive Disclosure**
- Trial users see simplified experience (1 Initiative, Brief-only document)
- Paid users unlock full capabilities (unlimited Initiatives for Pro/Enterprise, all 8 document types)
- Agent reveals complexity gradually ("Now that we have the Brief, let's move to PRD creation...")
- Advanced features (integrations, exports) appear contextually when unlocked

**3. Approval Gates as Decision Points**
- Every document generation ends with human approval gate
- "Approve" / "Need Changes" buttons + natural language interpretation
- Approval advances workflow; rejection loops back for refinement
- Visual phase indicators show progress (Planning 33% → 66% → 100%)

**4. Intelligent Backfilling**
- Users can jump ahead ("I want to create a PRD")
- Agent detects missing prerequisites ("I notice we don't have a Brief yet—let me help you create that first")
- Backwards navigation to fill gaps, then forward to original intent
- Non-linear planning that self-corrects to maintain structure

### Core Screens and Views

**1. Dashboard / Initiative List**
- Primary landing page after login
- Card-based grid of Initiatives with title, status, last updated
- Trial users: "1 of 1 Initiative" badge + upgrade CTA
- Paid users: "Create New Initiative" prominent action

**2. Three-Column Workspace (Main Application View)**
- **Left Column:** Collapsible hierarchy tree with Initiative → Epics (from PRD) navigation
- **Middle Column:** Live document preview with TipTap rendering, scroll-synced to conversation
- **Right Column:** Agent chat interface with phase indicators, sub-agent status, approval buttons

**3. Paywall / Upgrade Modal**
- Triggered at trial end (7 days) OR limit breach (2nd Initiative, 2nd document, export attempt)
- Shows current plan, feature comparison table, tier selection
- Stripe checkout embedded or redirect
- Dismissible only if trial still valid

**4. Account Settings**
- Subscription management (Stripe Customer Portal link)
- Usage dashboard (credits used/remaining, Initiative count)
- Integrations panel (Linear, Jira, Notion connection settings)—Phase 2.0+
- Export history (Phase 2.0+)

**5. Document Export View**
- Per-document: Download button → `.md` file
- Bulk export: "Export All as ZIP" → compressed archive
- Export history/log for audit trail (Phase 2.0+)

### Accessibility: WCAG AA

OutcomeSignal targets **WCAG 2.1 Level AA** compliance to ensure usability for developers with visual, motor, or cognitive disabilities. Key considerations:

- **Keyboard Navigation:** Full workspace navigable via keyboard (Tab, Arrow keys, Enter for selection)
- **Screen Reader Support:** Semantic HTML, ARIA labels for dynamic content (agent messages, document updates)
- **Color Contrast:** 4.5:1 minimum for text, 3:1 for UI components (leveraging shadcn/ui's accessible defaults)
- **Focus Indicators:** Visible focus states for all interactive elements
- **Text Resizing:** UI remains functional at 200% zoom without horizontal scroll
- **Error Identification:** Clear error messages for form validation, API failures

**Deferred to Phase 3+:** WCAG AAA (higher contrast, sign language, extended audio descriptions)

### Branding

**Visual Identity:**
- **Style:** Clean, professional, developer-focused aesthetic (not playful/consumer)
- **Color Palette:** Leveraging shadcn/ui defaults (neutral grays, subtle blues for primary actions)
- **Typography:** System fonts (SF Pro on macOS, Segoe UI on Windows, Roboto on Linux) for performance and native feel
- **Iconography:** Lucide React icons (consistent with shadcn/ui ecosystem)

**Personality in Copy:**
- Agent messages: Professional but approachable ("Let's get started on your Project Brief")
- Status indicators: Occasionally playful for long-running tasks ("Architecture Agent: Evaluating tech stacks...")
- Error messages: Helpful and actionable ("We couldn't connect to Linear. Check your API token in Settings")

**No Custom Branding Required:** OutcomeSignal IS the brand (not white-label/multi-tenant in MVP)

### Target Device and Platforms: Web Responsive

**Primary Platform:** Web application (desktop-first, mobile-responsive)

**Supported Devices:**
- **Desktop (Primary):** 1280px+ width, optimized for 1920×1080 and 2560×1440 displays
- **Laptop:** 1024px+ width, three-column layout adapts (narrower columns)
- **Tablet (iPad):** 768px+ width, two-column layout (hierarchy collapses to drawer, preview + chat side-by-side)
- **Mobile (Progressive Degradation):** 375px+ width, single-column layout (tabs for hierarchy, preview, chat)

**Browser Support:**
- Chrome/Edge (Chromium) 100+
- Firefox 100+
- Safari 15.4+
- No IE11 support (end-of-life)

**Future Platforms (Post-MVP):**
- Phase 1.0: ChatGPT Apps SDK (native ChatGPT interface)
- Phase 1.5: Claude Desktop MCP (native Claude Desktop interface)
- Phase 4+: Native mobile apps (iOS, Android)

---

## Technical Assumptions

### Monorepo Structure

**Turborepo Configuration:**
- Root workspace with shared TypeScript configs, ESLint, Prettier
- Apps: `web` (Next.js), `api` (FastAPI Python)
- Packages: `ui` (shadcn/ui components), `types` (shared TypeScript types), `config` (shared configs)

### Service Architecture

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

### Testing Requirements

**Frontend:**
- Jest + React Testing Library for unit tests
- Playwright for E2E tests (critical user flows)
- Storybook for component development/documentation

**Backend:**
- pytest for API endpoint tests
- pytest-asyncio for async workflow tests
- Mock LLM responses for deterministic testing

**Target Coverage:** 80%+ for critical paths (auth, billing, document generation)

### Frontend Stack

- **Framework:** Next.js 14 (App Router, React Server Components)
- **Language:** TypeScript 5.0+ (strict mode)
- **Styling:** Tailwind CSS 3.3+ with shadcn/ui
- **State Management:** Zustand for client state, React Query for server state
- **Forms:** React Hook Form + Zod validation
- **Rich Text:** TipTap (Prosemirror-based editor for markdown preview)
- **Icons:** Lucide React

### Backend Stack

- **Framework:** FastAPI 0.104+ (Python 3.11+)
- **Task Queue:** Celery 5.3+ with Redis backend
- **AI Orchestration:** Google Vertex AI Agent Builder + LangChain
- **LLM Providers:** Gemini 2.5 Pro (Google AI Studio), Claude Sonnet 4.5 (Anthropic)
- **Vector Store:** Supabase pgvector (for document embeddings if needed)

### Database & Storage

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

### AI & Machine Learning

- **Primary LLM (TBD via A/B test):** Gemini 2.5 Pro OR Claude Sonnet 4.5
- **Agent Framework:** Google Vertex AI Agent Builder
- **Orchestration Pattern:** Single Primary Agent → 6 specialized sub-agents (Discovery, Requirements, Design, Architecture, Quality, Validation)
- **Context Management:** RAG with document sharding (PRD epics, Architecture sections)
- **Prompt Engineering:** System prompts per agent with persona definitions (see Epic 4)

### Payment & Billing

- **Payment Processor:** Stripe
- **Subscription Model:** Monthly SaaS (Starter $49, Professional $149, Enterprise $499)
- **Webhook Handling:** Stripe webhooks → FastAPI endpoints → Supabase updates
- **Customer Portal:** Stripe Customer Portal (hosted billing management)
- **Usage Tracking:** Credit-based system (1 credit = 1 document generation or 1 major revision)

### Monitoring & Logging

- **Application Monitoring:** Vercel Analytics (frontend performance)
- **Error Tracking:** Sentry (frontend + backend)
- **Logging:** Vercel logs (frontend), Google Cloud Logging (backend/agents)
- **Metrics:** Custom dashboards in Supabase (usage, conversion, approval rates)

### Development Tools

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

### Security Assumptions

- **Authentication:** Clerk handles all auth (email/password, OAuth)
- **Authorization:** Row-level security (RLS) in Supabase (users can only access their data)
- **API Security:** API keys for backend ↔ agent communication (stored in environment variables)
- **Data Encryption:** AES-256 at rest (Supabase default), TLS 1.3 in transit
- **Secrets Management:** Environment variables in Vercel + Google Cloud Secret Manager

### Deployment Strategy

**Phase 1 (Months 1-3): MVP Launch**
- Single region (us-central1 for GCP, us-east-1 for Vercel)
- No CDN (Vercel handles edge caching)
- Manual database migrations (Supabase migrations via CLI)

**Phase 2 (Months 4-12): Scale**
- Multi-region support for Enterprise tier
- CDN for static assets (Cloudflare or Vercel Edge Network)
- Automated database migrations in CI/CD

### Infrastructure Cost Assumptions

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

## Epic List

This PRD defines 9 epics for the OutcomeSignal MVP, spanning Months 1-6. Each epic represents a major feature area with detailed user stories.

### Epic 1: Foundation & Authentication
**Goal:** Establish core project infrastructure, monorepo setup, and user authentication.
**Stories:** 7
**Priority:** P0 (Must-Have)
**Dependencies:** None (foundational work)

### Epic 2: Three-Column Workspace & Navigation
**Goal:** Build the core three-column UI (hierarchy, document preview, agent chat) with responsive design.
**Stories:** 8
**Priority:** P0 (Must-Have)
**Dependencies:** Epic 1 (requires auth, base UI components)

### Epic 3: Trial Management & Subscription Infrastructure
**Goal:** Implement 7-day trial with hard limits (Brief-only), paywall modal, Stripe subscription flow, and usage tracking.
**Stories:** 8
**Priority:** P0 (Must-Have)
**Dependencies:** Epic 1 (auth), Epic 2 (workspace UI for paywall modal)

### Epic 4: BMAD Framework Adaptation & Rebranding
**Goal:** Systematically rebrand BMAD agents to OutcomeSignal agents with functional names (Discovery Agent, Requirements Agent, etc.) while retaining BMAD personalities, adapt templates, and update workflows.
**Stories:** 8
**Priority:** P0 (Must-Have)
**Dependencies:** None (parallel work with technical setup)

### Epic 5: AI Agent Orchestration (Planning Phase)
**Goal:** Deploy Primary Agent with 6 Planning Phase sub-agents, implement document generation workflows (Brief, PRD, Architecture, UX, Security, QA), add approval gates, and enable intelligent backfilling.
**Stories:** 8
**Priority:** P0 (Must-Have)
**Dependencies:** Epic 2 (UI for agent chat), Epic 4 (rebranded agents)

### Epic 6: Document Management & Export
**Goal:** Enable document lifecycle (create, view, revise), markdown export (per-doc and bulk ZIP), version history, and export restrictions for trial users.
**Stories:** 7
**Priority:** P0 (Must-Have)
**Dependencies:** Epic 5 (document generation), Epic 3 (export tier restrictions)

### Epic 7: Hierarchy Display & Initiative Management
**Goal:** Display read-only Initiative → Epic hierarchy tree (epics sourced from PRD), enable Initiative CRUD, navigation, and enforce tier-based Initiative limits.
**Stories:** 5
**Priority:** P1 (Should-Have)
**Dependencies:** Epic 5 (PRD generation for epic extraction), Epic 6 (document sharding)

### Epic 8: LLM A/B Testing & Optimization
**Goal:** Implement A/B testing framework for Gemini 2.5 Pro vs Claude Sonnet 4.5, track quality/cost/performance metrics, and select primary LLM based on decision matrix.
**Stories:** 6
**Priority:** P1 (Should-Have)
**Dependencies:** Epic 5 (agent orchestration to test)

### Epic 9: Monitoring, Analytics & Launch Prep
**Goal:** Set up error tracking, logging, usage analytics, conversion funnels, and launch readiness checklist.
**Stories:** 7
**Priority:** P1 (Should-Have)
**Dependencies:** All prior epics (monitors entire system)

---

## Epic 1: Foundation & Authentication

**Goal:** Establish core project infrastructure, monorepo setup, and user authentication via Clerk.

**Priority:** P0 (Must-Have)
**Dependencies:** None (foundational work)
**Estimated Effort:** 3-4 weeks

### Story 1.1: Initialize Turborepo Monorepo Structure
**As a** developer
**I want** a Turborepo monorepo with shared configs
**So that** we can share code between frontend and backend efficiently

**Acceptance Criteria:**
- Root `package.json` with Turborepo configuration
- Apps: `apps/web` (Next.js), `apps/api` (FastAPI placeholder)
- Packages: `packages/ui`, `packages/types`, `packages/config`
- Shared TypeScript config (`tsconfig.json` base)
- Shared ESLint and Prettier configs
- Turbo pipeline defined for `dev`, `build`, `lint`, `test`

**Technical Notes:**
- Use `pnpm` as package manager (faster than npm/yarn)
- Configure path aliases (`@/` for internal imports)

---

### Story 1.2: Set Up Next.js 14 App Router Frontend
**As a** developer
**I want** a Next.js 14 app with App Router and TypeScript
**So that** we have a modern, performant frontend foundation

**Acceptance Criteria:**
- Next.js 14 installed with App Router enabled
- TypeScript strict mode enabled
- Tailwind CSS configured with shadcn/ui setup
- Basic app layout (`app/layout.tsx`) with metadata
- Homepage (`app/page.tsx`) renders successfully
- Development server runs on `localhost:3000`

**Technical Notes:**
- Use `create-next-app` with TypeScript template
- Install shadcn/ui via CLI: `npx shadcn-ui@latest init`

---

### Story 1.3: Integrate Clerk for Authentication
**As a** user
**I want** to sign up and log in with email/password or OAuth
**So that** I can access my account securely

**Acceptance Criteria:**
- Clerk project created and API keys configured
- Clerk SDK installed in Next.js (`@clerk/nextjs`)
- Sign-up page (`/sign-up`) with email/password + Google/GitHub OAuth
- Sign-in page (`/sign-in`) with same options
- Protected routes redirect unauthenticated users to `/sign-in`
- User profile accessible via `useUser()` hook

**Technical Notes:**
- Clerk middleware in `middleware.ts` for route protection
- Sync Clerk user ID to Supabase `users` table via webhook (Story 1.5)

---

### Story 1.4: Set Up Supabase Project and Database Schema
**As a** developer
**I want** a Supabase project with initial database schema
**So that** we can store user data, initiatives, and documents

**Acceptance Criteria:**
- Supabase project created (free tier for development)
- PostgreSQL database accessible via connection string
- Initial schema migration with tables:
  - `users` (id, clerk_user_id, email, created_at, updated_at)
  - `initiatives` (id, user_id, title, status, created_at, updated_at)
  - `documents` (id, initiative_id, type, content, version, created_at)
  - `agent_conversations` (id, initiative_id, user_id, messages, created_at)
- Row-level security (RLS) policies enabled (users can only access their own data)

**Technical Notes:**
- Use Supabase migrations CLI: `supabase migration new init_schema`
- RLS policies: `user_id = auth.uid()` for all tables

---

### Story 1.5: Sync Clerk Users to Supabase via Webhook
**As a** system
**I want** to automatically create Supabase user records when users sign up in Clerk
**So that** user data is synced between auth and database

**Acceptance Criteria:**
- Clerk webhook endpoint created in Next.js API route (`/api/webhooks/clerk`)
- Webhook listens for `user.created` event
- On user creation, insert record into Supabase `users` table
- Webhook verifies Clerk signature for security
- Handle duplicate user creation gracefully (idempotent)

**Technical Notes:**
- Use `svix` library for webhook signature verification
- Store Clerk webhook secret in environment variable

---

### Story 1.6: Install and Configure shadcn/ui Components
**As a** developer
**I want** shadcn/ui components installed and themed
**So that** we have consistent, accessible UI primitives

**Acceptance Criteria:**
- shadcn/ui initialized with Tailwind config
- Core components installed: Button, Card, Dialog, Input, Label, Tabs, Separator
- Custom theme defined in `tailwind.config.ts` (neutral color palette)
- Components accessible in `@/components/ui/` directory
- Storybook configured for component development (optional, can defer)

**Technical Notes:**
- shadcn/ui uses Radix UI primitives (WCAG AA accessible by default)
- Install components individually: `npx shadcn-ui@latest add button card dialog`

---

### Story 1.7: Create Dashboard Layout with Protected Route
**As a** user
**I want** to see a dashboard after logging in
**So that** I can access the main application workspace

**Acceptance Criteria:**
- Dashboard route (`/dashboard`) created with layout
- Route protected via Clerk middleware (redirects if unauthenticated)
- Dashboard displays user's name from Clerk (`user.firstName`)
- Placeholder for Initiative list (to be built in Epic 2)
- Logout button in header (calls `signOut()` from Clerk)

**Technical Notes:**
- Use Next.js App Router layout for shared UI (header, sidebar)
- Dashboard is the primary landing page post-authentication

---

## Epic 2: Three-Column Workspace & Navigation

**Goal:** Build the core three-column UI (hierarchy tree, document preview, agent chat) with responsive design and collapsible panels.

**Priority:** P0 (Must-Have)
**Dependencies:** Epic 1 (authentication, base UI components)
**Estimated Effort:** 4-5 weeks

### Story 2.1: Create Three-Column Layout Component
**As a** user
**I want** a three-column workspace layout
**So that** I can navigate hierarchy, view documents, and chat with agents simultaneously

**Acceptance Criteria:**
- Main workspace component with three resizable columns:
  - **Left:** Hierarchy tree (240px default, collapsible)
  - **Middle:** Document preview (flex-grow, min 400px)
  - **Right:** Agent chat (360px default, collapsible)
- Columns use CSS Grid or Flexbox with `resize` handles
- Collapse buttons for left/right columns (maximize document preview)
- Responsive: On tablet (<1024px), left column becomes drawer; on mobile (<768px), tabs for column switching

**Technical Notes:**
- Use `react-resizable-panels` library for resize functionality
- Persist column widths to localStorage

---

### Story 2.2: Build Hierarchy Tree Navigation (Left Column)
**As a** user
**I want** to see my Initiatives and Epics in a tree structure
**So that** I can navigate my project hierarchy easily

**Acceptance Criteria:**
- Tree component displays:
  - Initiative nodes (expandable)
  - Epic nodes nested under Initiatives (read-only in MVP, sourced from PRD)
- Clicking Initiative navigates to Initiative overview
- Clicking Epic navigates to Epic detail (shows related documents)
- Active node highlighted with background color
- Tree supports keyboard navigation (Arrow keys, Enter to select)

**Technical Notes:**
- Use `react-aria` TreeView or custom implementation with shadcn/ui Collapsible
- Fetch Initiatives from Supabase via React Query
- Epics fetched from PRD document (parse markdown headings, see Epic 6/7)

---

### Story 2.3: Implement Document Preview with TipTap (Middle Column)
**As a** user
**I want** to see live markdown document preview
**So that** I can read generated documents while chatting with agents

**Acceptance Criteria:**
- TipTap editor initialized in read-only mode
- Renders markdown content with rich formatting (headings, lists, bold, italic, code blocks)
- Scroll position syncs with conversation context (e.g., if agent references Section 3, scroll to it)
- Supports documents up to 100 pages without performance degradation (<500ms render)
- Loading skeleton shown while document loads

**Technical Notes:**
- Use TipTap with `StarterKit` + `Markdown` extensions
- Set `editable: false` for read-only mode
- Consider virtualization for very long documents (defer if performance is acceptable)

---

### Story 2.4: Build Agent Chat Interface (Right Column)
**As a** user
**I want** to chat with the AI agent in the right column
**So that** I can create and refine documents conversationally

**Acceptance Criteria:**
- Chat UI with message list (scrollable, auto-scroll to bottom on new message)
- Input field at bottom with "Send" button (Enter to send, Shift+Enter for newline)
- Messages display:
  - User messages (right-aligned, blue background)
  - Agent messages (left-aligned, gray background)
  - System messages (centered, italic, for phase transitions)
- Typing indicator when agent is responding
- Timestamps for messages (optional, can hide by default)

**Technical Notes:**
- Use shadcn/ui components (Card, Input, Button)
- Store messages in Supabase `agent_conversations` table
- Use Supabase Realtime for live message updates (multi-device sync)

---

### Story 2.5: Add Phase Indicator UI in Workspace Header
**As a** user
**I want** to see the current planning phase and progress
**So that** I understand where I am in the workflow

**Acceptance Criteria:**
- Header above three-column workspace shows:
  - Current phase: "📋 Planning Phase"
  - Progress percentage: "[33%]" (calculated based on approved documents)
  - Active sub-agent indicator: "Working with Architecture Agent..." (shown during generation)
- Progress bar visualizes percentage (0-100%)
- Clicking phase indicator shows tooltip with phase breakdown:
  - Planning (8 documents): Brief, Market Research, Competitive Analysis, PRD, Architecture, UX, Security, QA

**Technical Notes:**
- Calculate progress: (approved_documents / total_documents) * 100
- Show sub-agent name during document generation (streamed from backend)

---

### Story 2.6: Implement Responsive Design (Tablet & Mobile)
**As a** user on tablet or mobile
**I want** the workspace to adapt to smaller screens
**So that** I can use OutcomeSignal on any device

**Acceptance Criteria:**
- **Tablet (768px-1024px):**
  - Left column becomes slide-out drawer (hamburger menu to open)
  - Middle + Right columns side-by-side (narrower)
- **Mobile (<768px):**
  - Single-column layout with tabs: "Hierarchy" / "Document" / "Chat"
  - Active tab fills viewport
  - Bottom nav bar for tab switching
- All interactive elements have 44px+ touch targets (WCAG AA)

**Technical Notes:**
- Use Tailwind responsive utilities (`md:`, `lg:`)
- Test on real devices (iPhone, iPad, Android)

---

### Story 2.7: Add Collapsible Panel Animations
**As a** user
**I want** smooth animations when collapsing/expanding columns
**So that** the UI feels polished and responsive

**Acceptance Criteria:**
- Collapse/expand transitions use 200ms ease-in-out animation
- Document preview reflows smoothly when columns resize
- No layout shift or jank during animations
- Animations respect `prefers-reduced-motion` for accessibility

**Technical Notes:**
- Use CSS transitions or Framer Motion for animations
- Test performance on lower-end devices

---

### Story 2.8: Persist Workspace Layout Preferences
**As a** user
**I want** my column widths and collapse state to persist
**So that** I don't have to reconfigure the layout every session

**Acceptance Criteria:**
- Column widths saved to localStorage on resize
- Collapse state (left/right panels) saved to localStorage
- Layout restored on page reload
- Reset button in settings to restore default layout

**Technical Notes:**
- Store as JSON: `{leftWidth: 240, rightWidth: 360, leftCollapsed: false, rightCollapsed: false}`
- Debounce saves during resize (every 500ms)

---

## Epic 3: Trial Management & Subscription Infrastructure

**Goal:** Implement 7-day trial with Brief-only limit, paywall modal, Stripe subscription flow, and usage tracking.

**Priority:** P0 (Must-Have)
**Dependencies:** Epic 1 (auth), Epic 2 (workspace UI for paywall modal)
**Estimated Effort:** 3-4 weeks

### Story 3.1: Create Subscription Tier Data Model
**As a** developer
**I want** a clear data model for subscription tiers
**So that** we can enforce tier-based limits consistently

**Acceptance Criteria:**
- Add `subscriptions` table to Supabase:
  - `id`, `user_id`, `tier` (enum: 'trial', 'starter', 'professional', 'enterprise'), `stripe_subscription_id`, `status` (active/canceled/expired), `trial_ends_at`, `current_period_end`, `created_at`, `updated_at`
- Add `usage_tracking` table:
  - `id`, `user_id`, `month` (YYYY-MM), `credits_used`, `credits_limit`, `initiatives_count`, `initiatives_limit`, `created_at`
- Seed default tier limits as constants:
  - Trial: 1 Initiative, Brief-only document, 7-day expiration, no export
  - Starter: 3 Initiatives/mo, 25 credits/mo, all 8 document types, export enabled
  - Professional: Unlimited Initiatives, 100 credits/mo, all features
  - Enterprise: Unlimited everything

**Technical Notes:**
- Use PostgreSQL enums for `tier` and `status` fields
- Index on `user_id` for fast lookups

---

### Story 3.2: Implement Trial Signup Flow (No Credit Card)
**As a** new user
**I want** to start a 7-day trial without entering payment info
**So that** I can evaluate OutcomeSignal risk-free

**Acceptance Criteria:**
- On first sign-up via Clerk, automatically create `subscriptions` record:
  - `tier: 'trial'`, `status: 'active'`, `trial_ends_at: now() + 7 days`
- Create `usage_tracking` record with trial limits
- Redirect to onboarding flow (optional, can be inline tutorial)
- Dashboard shows trial badge: "Trial: 6 days remaining"

**Technical Notes:**
- Trigger subscription creation in Clerk webhook (Story 1.5)
- Calculate days remaining: `trial_ends_at - now()`

---

### Story 3.3: Enforce Trial Limits (1 Initiative, Brief-Only)
**As a** system
**I want** to block trial users from exceeding limits
**So that** we can drive conversions to paid tiers

**Acceptance Criteria:**
- **Initiative Limit:**
  - Trial users can create max 1 Initiative
  - "Create Initiative" button disabled if limit reached
  - Hover tooltip: "Upgrade to Starter to create up to 3 Initiatives/month"
- **Document Limit:**
  - Trial users can only generate Brief document (first document in Planning phase)
  - Agent blocks PRD creation: "You've reached the trial limit. Upgrade to continue with PRD creation."
  - Shows paywall modal (Story 3.5)
- **Export Restriction:**
  - Export buttons hidden/disabled for trial users
  - Tooltip: "Export available on paid plans"

**Technical Notes:**
- Check limits before creation (frontend validation + backend enforcement)
- Query `usage_tracking` table for current counts

---

### Story 3.4: Track Trial Expiration and Auto-Expire
**As a** system
**I want** to automatically expire trials after 7 days
**So that** we enforce time-based limits

**Acceptance Criteria:**
- Daily cron job (or Supabase Edge Function) checks for expired trials
- Update `subscriptions.status` to 'expired' if `trial_ends_at < now()`
- Expired trial users:
  - Can view existing Initiatives (read-only)
  - Cannot create new Initiatives or documents
  - See paywall modal on login
- Email notification sent 1 day before expiration (optional, can defer)

**Technical Notes:**
- Use Supabase Edge Function with `cron` trigger: `0 0 * * *` (daily at midnight)
- Consider adding grace period (e.g., 24 hours post-expiration)

---

### Story 3.5: Build Paywall Modal with Tier Comparison
**As a** trial user who hit limits
**I want** to see pricing options in a modal
**So that** I can upgrade to continue using OutcomeSignal

**Acceptance Criteria:**
- Modal displays when:
  - Trial expires (on login)
  - User attempts to create 2nd Initiative
  - User attempts to generate 2nd document (non-Brief)
  - User attempts to export
- Modal content:
  - "Upgrade to Continue" headline
  - Tier comparison table (Starter $49/mo, Professional $149/mo, Enterprise $499/mo)
  - Feature highlights (Initiatives, credits, documents, export)
  - "Select Plan" buttons → Stripe Checkout
- Modal dismissible only if trial still valid (not expired)

**Technical Notes:**
- Use shadcn/ui Dialog component
- Pass `trigger_reason` to modal for analytics (e.g., "initiative_limit")

---

### Story 3.6: Integrate Stripe Checkout for Subscriptions
**As a** user
**I want** to purchase a subscription via Stripe
**So that** I can unlock paid features

**Acceptance Criteria:**
- "Select Plan" button redirects to Stripe Checkout (hosted page)
- Stripe Checkout configured with:
  - Monthly subscription products (Starter $49, Pro $149, Enterprise $499)
  - User email pre-filled from Clerk
  - Success URL: `/dashboard?checkout=success`
  - Cancel URL: `/dashboard?checkout=canceled`
- On successful payment, Stripe webhook updates Supabase `subscriptions` table:
  - `tier`, `stripe_subscription_id`, `status: 'active'`, `current_period_end`
- User redirected to dashboard with success message

**Technical Notes:**
- Create Stripe products and prices in Stripe Dashboard
- Store Stripe price IDs in environment variables
- Use Next.js API route for Checkout session creation: `/api/stripe/create-checkout-session`

---

### Story 3.7: Handle Stripe Webhooks for Subscription Events
**As a** system
**I want** to listen to Stripe webhooks for subscription changes
**So that** we can keep subscription status in sync

**Acceptance Criteria:**
- Stripe webhook endpoint: `/api/webhooks/stripe`
- Listen for events:
  - `checkout.session.completed` → Activate subscription
  - `invoice.payment_succeeded` → Extend `current_period_end`
  - `customer.subscription.deleted` → Cancel subscription (set `status: 'canceled'`)
  - `invoice.payment_failed` → Mark subscription `status: 'past_due'`
- Verify Stripe webhook signature for security
- Log all webhook events to Supabase for audit trail

**Technical Notes:**
- Use `stripe` Node.js library for webhook verification
- Store Stripe webhook secret in environment variable
- Idempotent processing (handle duplicate events gracefully)

---

### Story 3.8: Implement Usage Tracking (Credits and Initiatives)
**As a** system
**I want** to track monthly usage (credits, Initiatives)
**So that** we can enforce tier-based limits

**Acceptance Criteria:**
- Increment `usage_tracking.credits_used` on:
  - Document generation (1 credit)
  - Major document revision (1 credit)
- Increment `usage_tracking.initiatives_count` on Initiative creation
- Block actions if limits exceeded:
  - `credits_used >= credits_limit` → Show "Out of credits" modal with top-off option
  - `initiatives_count >= initiatives_limit` → Block Initiative creation
- Reset `usage_tracking` monthly (1st of month via cron job)

**Technical Notes:**
- Use PostgreSQL `ON CONFLICT` for upsert pattern
- Display usage in dashboard: "Credits: 12 / 25 used this month"

---

## Epic 4: BMAD Framework Adaptation & Rebranding

**Goal:** Systematically rebrand BMAD agents to OutcomeSignal agents with functional names (Discovery Agent, Requirements Agent, etc.) while retaining BMAD personalities, adapt templates, and update workflows.

**Priority:** P0 (Must-Have)
**Dependencies:** None (parallel work with technical setup)
**Estimated Effort:** 2-3 weeks

### Story 4.1: Audit BMAD Framework for Rebranding Scope
**As a** developer
**I want** a complete inventory of BMAD references
**So that** we know exactly what needs rebranding

**Acceptance Criteria:**
- Audit report document listing:
  - 10 agent YAML configs (7 to keep: Analyst, PM, UX, Architect, QA, PO, SM; 3 to exclude: Dev, BMad-Master, BMad-Orchestrator)
  - 8 reasoning engine workflows (Python files)
  - 23 task analysis documents
  - 30+ templates (Brief, PRD, Architecture, etc.)
  - Infrastructure references (Firestore collections, Cloud Storage bucket names)
- Categorize by rebranding complexity (simple find-replace vs. logic changes)
- Estimate effort per category

**Technical Notes:**
- Use `grep -r "BMAD\|BMad\|bmad" reverse-engineering-docs/` to find references
- Create checklist in Linear or Notion for tracking

---

### Story 4.2: Define OutcomeSignal Agent Personas (Functional Names + BMAD Personalities)
**As a** PM
**I want** clear persona definitions for 7 OutcomeSignal agents
**So that** we maintain personality consistency while using functional names

**Acceptance Criteria:**
- Persona document defining:
  - **Discovery Agent** (BMAD Mary): Analytical, curious, enthusiastic researcher
  - **Requirements Agent** (BMAD John): Structured, pragmatic, collaborative PM
  - **Design Agent** (BMAD Sarah): Creative, empathetic, user-focused UX designer
  - **Architecture Agent** (BMAD Mike): Systematic, detail-oriented, scalability-focused architect
  - **Quality Agent** (BMAD Donna): Meticulous, proactive, quality-obsessed QA lead
  - **Validation Agent** (BMAD Karen): Strategic, decisive, business-focused PO
  - **Planning Agent** (BMAD Sam): Organized, practical, delivery-focused Scrum Master
- Each persona includes:
  - Functional name (for UI display)
  - Personality traits (from BMAD)
  - Communication style
  - Emoji icon (e.g., Discovery Agent 🔍)

**Technical Notes:**
- Store persona definitions in `docs/agent-personas.md`
- Reference in system prompts (Story 4.4)

---

### Story 4.3: Rebrand Agent YAML Configurations (7 Agents)
**As a** developer
**I want** BMAD agent YAMLs rebranded to OutcomeSignal naming
**So that** our agent configs match the new brand

**Acceptance Criteria:**
- Rename YAML files:
  - `analyst.yaml` → `discovery-agent.yaml`
  - `pm.yaml` → `requirements-agent.yaml`
  - `ux-expert.yaml` → `design-agent.yaml`
  - `architect.yaml` → `architecture-agent.yaml`
  - `qa.yaml` → `quality-agent.yaml`
  - `po.yaml` → `validation-agent.yaml`
  - `sm.yaml` → `planning-agent.yaml`
- Update `display_name` fields in YAMLs (e.g., "Discovery Agent")
- Update `description` fields to remove BMAD branding
- Retain personality traits in `system_prompt` fields (Story 4.4)

**Technical Notes:**
- Exclude `dev.yaml`, `bmad-master.yaml`, `bmad-orchestrator.yaml` (not needed for MVP)
- Move rebranded YAMLs to `apps/api/config/agents/`

---

### Story 4.4: Update Agent System Prompts with OutcomeSignal Branding
**As a** developer
**I want** agent system prompts to reflect OutcomeSignal brand and personas
**So that** agents introduce themselves correctly

**Acceptance Criteria:**
- Update system prompts in each YAML:
  - Replace "BMAD" with "OutcomeSignal"
  - Update agent introduction (e.g., "I'm the Discovery Agent 🔍, your analytical researcher...")
  - Retain personality traits from BMAD (see Story 4.2)
  - Reference OutcomeSignal workspace context (three-column UI, Planning phase)
- Test prompts with LLM to verify tone matches persona

**Technical Notes:**
- System prompt template:
  ```
  You are the [Agent Name] for OutcomeSignal, an AI planning platform.
  Personality: [traits from Story 4.2]
  Your role: [functional description]
  Context: You're working within the Planning phase to create [document types].
  ```

---

### Story 4.5: Rebrand Document Templates (Brief, PRD, Architecture, etc.)
**As a** developer
**I want** BMAD document templates rebranded to OutcomeSignal
**So that** generated documents reflect the new brand

**Acceptance Criteria:**
- Update template headers (e.g., "OutcomeSignal Project Brief")
- Replace BMAD references in template instructions
- Update footer attribution: "Generated by OutcomeSignal"
- Templates to rebrand (8 core types):
  - Project Brief
  - Market Research
  - Competitive Analysis
  - PRD
  - Architecture Overview
  - UX Overview
  - Security Review
  - QA Strategy
- Templates stored in `apps/api/templates/`

**Technical Notes:**
- Use Jinja2 templates for variable substitution
- Keep template structure identical (only branding changes)

---

### Story 4.6: Adapt BMAD Reasoning Engine Workflows to OutcomeSignal
**As a** developer
**I want** BMAD workflows adapted to OutcomeSignal workflows
**So that** our backend orchestration matches the new agent structure

**Acceptance Criteria:**
- Rebrand workflow file names:
  - `create-next-story.py` → `create-story.py` (Planning Agent workflow, deferred to Phase 2+)
  - `review-story.py` → keep as-is (Quality Agent workflow, deferred)
  - `execute-checklist.py` → `validate-document.py` (Validation Agent workflow)
  - `shard-doc.py` → keep as-is (Requirements/Validation Agent workflow)
- Update workflow references to use OutcomeSignal agent names (Discovery Agent, etc.)
- Update Firestore collection names:
  - `bmad_projects` → `initiatives`
  - `bmad_stories` → `stories` (Phase 2+)
  - `bmad_documents` → `documents`
- Test workflows with new agent configs

**Technical Notes:**
- Deploy workflows to Vertex AI Reasoning Engine (see architecture-design.md)
- Update workflow triggers in Cloud Scheduler

---

### Story 4.7: Consolidate Discovery Agent Capabilities (Market Research + Competitive Analysis)
**As a** developer
**I want** Discovery Agent to handle both Market Research and Competitive Analysis
**So that** we have 7 agents (not 8) as per final design

**Acceptance Criteria:**
- Update Discovery Agent YAML to include:
  - Market Research workflow (optional, user-triggered)
  - Competitive Analysis workflow (optional, user-triggered)
- Discovery Agent prompts understand both research types:
  - Market Research: TAM/SAM/SOM, trends, user segments
  - Competitive Analysis: Competitor features, pricing, positioning
- Remove separate "Market Research Agent" and "Competitive Analysis Agent" YAMLs (if they existed in BMAD)

**Technical Notes:**
- Discovery Agent system prompt includes:
  ```
  You can conduct two types of research:
  1. Market Research: Analyze TAM, trends, user needs
  2. Competitive Analysis: Compare competitors' features, pricing, positioning
  ```

---

### Story 4.8: Update Infrastructure Naming (Firestore, Cloud Storage, GCP Services)
**As a** developer
**I want** GCP infrastructure to use OutcomeSignal naming
**So that** our cloud resources reflect the brand

**Acceptance Criteria:**
- Rename Firestore collections:
  - `bmad_projects` → `initiatives`
  - `bmad_documents` → `documents`
  - `bmad_agent_conversations` → `agent_conversations`
  - `bmad_workflow_states` → `workflow_states`
- Rename Cloud Storage buckets:
  - `bmad-templates` → `outcomesignal-templates`
  - `bmad-exports` → `outcomesignal-exports`
- Update GCP project name (if BMAD-specific): `bmad-prod` → `outcomesignal-prod`
- Update API endpoint paths: `/api/v1/bmad/...` → `/api/v1/...`

**Technical Notes:**
- Create migration script for Firestore collection renaming
- Set up redirects for old API paths (backward compatibility during transition)

---

## Epic 5: AI Agent Orchestration (Planning Phase)

**Goal:** Deploy Primary Agent with 6 Planning Phase sub-agents, implement document generation workflows (Brief, PRD, Architecture, UX, Security, QA), add approval gates, and enable intelligent backfilling.

**Priority:** P0 (Must-Have)
**Dependencies:** Epic 2 (UI for agent chat), Epic 4 (rebranded agents)
**Estimated Effort:** 5-6 weeks

### Story 5.1: Deploy Primary Agent with Sub-Agent Orchestration
**As a** user
**I want** a single AI agent that orchestrates specialists behind the scenes
**So that** I have a unified conversational interface

**Acceptance Criteria:**
- Primary Agent deployed to Vertex AI Agent Builder
- Primary Agent delegates to 6 sub-agents based on context:
  - Discovery Agent (Brief, Market Research, Competitive Analysis)
  - Requirements Agent (PRD)
  - Design Agent (UX Overview)
  - Architecture Agent (Architecture Overview)
  - Quality Agent (Security Review, QA Strategy)
  - Validation Agent (document approval, sharding)
- User sees only Primary Agent in chat interface
- Sub-agent activity visible via status indicators ("Working with Architecture Agent...")
- Primary Agent handles conversation routing and context management

**Technical Notes:**
- Use Vertex AI Agent Builder's multi-agent orchestration
- Primary Agent system prompt includes delegation logic
- Store conversation context in Supabase for continuity

---

### Story 5.2: Implement Project Brief Generation Workflow
**As a** user
**I want** to create a Project Brief through conversation
**So that** I can define my project vision and scope

**Acceptance Criteria:**
- User initiates: "I want to create a new project" or "Create a Brief"
- Primary Agent delegates to Discovery Agent
- Discovery Agent asks questions:
  - What problem are you solving?
  - Who are your target users?
  - What are the key features?
  - What's your timeline and budget?
- Agent drafts Brief using template (Story 4.5)
- Document preview updates live in middle column
- Approval gate: "Approve" / "Need Changes" buttons + natural language interpretation

**Technical Notes:**
- Brief template includes: Problem Statement, Proposed Solution, Target Users, MVP Scope, Timeline, Budget
- Store Brief in Supabase `documents` table with `type: 'brief'`
- First document in Planning phase (0% → 12.5% progress)

---

### Story 5.3: Implement PRD Generation Workflow
**As a** user
**I want** to generate a PRD from my approved Brief
**So that** I can define detailed requirements

**Acceptance Criteria:**
- Triggered after Brief approval or user request: "Create a PRD"
- Primary Agent delegates to Requirements Agent
- Requirements Agent:
  - Reads approved Brief for context
  - Asks clarifying questions (features, user stories, success metrics)
  - Drafts PRD using template (functional reqs, non-functional reqs, epic list)
- Document preview updates live
- Approval gate at completion

**Technical Notes:**
- PRD template includes: Goals, Functional Requirements, Non-Functional Requirements, Epic List, User Stories
- Store PRD in `documents` table with `type: 'prd'`
- Second document in Planning phase (12.5% → 25% progress)

---

### Story 5.4: Implement Architecture Overview Generation Workflow
**As a** user
**I want** to generate an Architecture Overview from my PRD
**So that** I can define the technical approach

**Acceptance Criteria:**
- Triggered after PRD approval or user request: "Create Architecture Overview"
- Primary Agent delegates to Architecture Agent
- Architecture Agent:
  - Reads PRD for functional requirements
  - Asks about tech stack preferences, scalability needs, existing infrastructure
  - Drafts Architecture Overview (system design, data models, API specs, deployment strategy)
- Document preview updates live
- Approval gate at completion

**Technical Notes:**
- Architecture template includes: System Architecture, Technology Stack, Data Models, API Design, Security Architecture, Deployment Strategy
- Store in `documents` table with `type: 'architecture'`
- Third document in Planning phase (25% → 37.5% progress)

---

### Story 5.5: Implement UX Overview, Security Review, and QA Strategy Workflows
**As a** user
**I want** to generate UX, Security, and QA documents
**So that** I have comprehensive planning coverage

**Acceptance Criteria:**
- **UX Overview (Design Agent):**
  - User flows, wireframes (text descriptions in MVP), design system, accessibility (WCAG AA)
  - Optional document (user-triggered)
  - Progress: 37.5% → 50%
- **Security Review (Quality Agent):**
  - Threat model, security requirements, compliance checklist (GDPR, SOC2)
  - Mandatory for sensitive data projects
  - Progress: 50% → 62.5%
- **QA Strategy (Quality Agent):**
  - Test plan, test levels (unit/integration/E2E), test priorities (P0/P1/P2), CI/CD integration
  - Mandatory document
  - Progress: 62.5% → 75%
- Each workflow follows same pattern: context loading → questions → drafting → approval

**Technical Notes:**
- Store in `documents` table with respective types
- Templates for each document type in `apps/api/templates/`

---

### Story 5.6: Implement Market Research and Competitive Analysis Workflows (Optional)
**As a** user
**I want** to optionally generate Market Research and Competitive Analysis
**So that** I can validate my idea before building

**Acceptance Criteria:**
- Both workflows handled by Discovery Agent
- **Market Research:**
  - TAM/SAM/SOM calculation
  - Market trends, user segments, pricing analysis
  - Optional (user-triggered before or after Brief)
- **Competitive Analysis:**
  - Competitor feature matrix
  - Pricing comparison, positioning map
  - Optional (user-triggered before or after Brief)
- Documents stored separately, not required for phase progression

**Technical Notes:**
- Store with `type: 'market_research'` and `type: 'competitive_analysis'`
- Don't count toward Planning phase progress (optional research)

---

### Story 5.7: Implement Human Approval Gates with Natural Language Interpretation
**As a** user
**I want** to approve documents via button or natural language
**So that** I can control progression flexibly

**Acceptance Criteria:**
- After each document generation, show approval UI:
  - "Approve" button (green)
  - "Need Changes" button (red)
  - Chat input active for natural language feedback
- Natural language approval phrases recognized:
  - "Looks good", "Perfect", "Approved", "Ship it", "LGTM" → Approve
  - "Needs work", "Change X to Y", "I don't like...", "Fix..." → Need Changes
- On approval:
  - Update document `status: 'approved'` in database
  - Increment Planning phase progress
  - Agent offers next document: "Great! Should I create the PRD next?"
- On rejection:
  - Agent asks for specifics: "What would you like me to change?"
  - User provides feedback
  - Agent revises document (uses 1 credit for major revision)
  - Re-presents for approval

**Technical Notes:**
- Use LLM to classify user message as approval/rejection/feedback
- Store approval history in `document_versions` table (audit trail)

---

### Story 5.8: Implement Intelligent Backfilling for Missing Documents
**As a** user
**I want** the agent to detect missing documents and offer to create them
**So that** I can jump ahead without breaking the workflow

**Acceptance Criteria:**
- User jumps ahead: "I want to create an Architecture Overview" (but no PRD exists)
- Primary Agent detects missing prerequisite (PRD)
- Agent responds: "I notice we don't have a PRD yet. I recommend creating that first so the Architecture Overview has proper context. Should I start with the PRD?"
- User can:
  - Accept recommendation → Agent creates PRD, then Architecture
  - Override → Agent creates Architecture without PRD (warns about limited context)
- Dependency chain: Brief → PRD → Architecture, UX, Security, QA

**Technical Notes:**
- Check `documents` table for prerequisite documents before generation
- Use business logic to define dependencies (configurable in `apps/api/config/dependencies.json`)

---

## Epic 6: Document Management & Export

**Goal:** Enable document lifecycle (create, view, revise), markdown export (per-doc and bulk ZIP), version history, and export restrictions for trial users.

**Priority:** P0 (Must-Have)
**Dependencies:** Epic 5 (document generation), Epic 3 (export tier restrictions)
**Estimated Effort:** 3-4 weeks

### Story 6.1: Implement Document Versioning
**As a** user
**I want** to see version history for documents
**So that** I can track changes and revert if needed

**Acceptance Criteria:**
- Add `document_versions` table:
  - `id`, `document_id`, `version`, `content`, `created_by` (user or agent), `created_at`, `change_summary`
- On document creation or revision, increment version (v1, v2, v3...)
- Document detail view shows version dropdown:
  - Current version (default)
  - Previous versions (read-only)
- Version comparison view (diff) shows changes between versions (defer to Phase 2+ if complex)

**Technical Notes:**
- Use PostgreSQL JSONB for `content` storage
- Consider storage optimization (store diffs instead of full copies for large documents)

---

### Story 6.2: Enable Document Revision via Agent Chat
**As a** user
**I want** to revise approved documents through conversation
**So that** I can refine requirements over time

**Acceptance Criteria:**
- User requests revision: "Update the PRD to add X feature" or "Change the architecture to use Y database"
- Agent loads current approved document
- Agent asks clarifying questions
- Agent generates new version (increments version number)
- Document preview updates with changes highlighted (optional, can show new version directly)
- Approval gate for new version
- Major revisions cost 1 credit (minor edits free)

**Technical Notes:**
- Define "major revision" as >20% content change (measured by edit distance or LLM classification)
- Store revision in `document_versions` with `change_summary` (e.g., "Added credit system to PRD")

---

### Story 6.3: Build Document Export (Single Markdown File)
**As a** user
**I want** to export individual documents as `.md` files
**So that** I can use them in other tools (Notion, GitHub, etc.)

**Acceptance Criteria:**
- Each document detail view has "Export" button (top-right)
- Clicking "Export" downloads `.md` file:
  - Filename: `{document_type}_{initiative_title}_{version}.md` (e.g., `PRD_OutcomeSignal_v2.md`)
  - Content: Markdown-formatted document with frontmatter (title, version, created_at)
- Export button disabled for trial users (tooltip: "Upgrade to export")
- Track export events for analytics

**Technical Notes:**
- Use Next.js API route: `/api/documents/[id]/export`
- Generate `.md` file server-side, return as blob download
- Add frontmatter:
  ```markdown
  ---
  title: OutcomeSignal PRD
  version: 2
  created_at: 2025-10-15
  ---
  ```

---

### Story 6.4: Build Bulk Export (ZIP Archive)
**As a** user
**I want** to export all Initiative documents as a ZIP archive
**So that** I can share the complete project with stakeholders

**Acceptance Criteria:**
- Initiative detail view has "Export All as ZIP" button
- Clicking button generates ZIP archive:
  - Contains all documents for Initiative (Brief, PRD, Architecture, etc.)
  - Each document as separate `.md` file
  - Folder structure: `{initiative_title}/documents/{document_type}.md`
  - Includes README.md with Initiative overview
- Download filename: `{initiative_title}_export_{date}.zip`
- Disabled for trial users

**Technical Notes:**
- Use `jszip` library (frontend) or `archiver` (backend) to create ZIP
- Consider server-side generation for large Initiatives (avoid browser memory limits)

---

### Story 6.5: Implement Document Search (Within Initiative)
**As a** user
**I want** to search across all Initiative documents
**So that** I can quickly find specific information

**Acceptance Criteria:**
- Search bar in workspace header (above three-column layout)
- Search queries return:
  - Documents containing query (ranked by relevance)
  - Specific sections within documents (with snippet preview)
- Clicking result navigates to document and scrolls to matching section
- Search scope: Current Initiative only (not cross-Initiative in MVP)

**Technical Notes:**
- Use PostgreSQL full-text search (`tsvector`, `tsquery`)
- Create GIN index on `documents.content` for performance
- Defer to Elasticsearch/Algolia if search becomes performance bottleneck

---

### Story 6.6: Add Document Sharing (Public Links, Read-Only)
**As a** user
**I want** to share document links with stakeholders
**So that** they can review without needing an account

**Acceptance Criteria:**
- Document detail view has "Share" button
- Clicking button generates public link: `outcomesignal.com/shared/{shareable_id}`
- Public link shows:
  - Document title, version, last updated
  - Read-only document preview (no editing, no export)
  - "Powered by OutcomeSignal" footer with CTA to sign up
- Link expires after 7 days (configurable)
- User can revoke link anytime

**Technical Notes:**
- Add `shareable_links` table: `id`, `document_id`, `shareable_id` (UUID), `expires_at`, `created_by`
- Public route doesn't require authentication
- Disable sharing for trial users (optional restriction)

---

### Story 6.7: Implement Document Sharding (PRD Epics, Architecture Sections)
**As a** developer
**I want** to shard large documents into smaller files
**So that** agents can efficiently retrieve context

**Acceptance Criteria:**
- After PRD approval, Validation Agent shards PRD into:
  - `prd_overview.md` (goals, background)
  - `prd_epic_1.md`, `prd_epic_2.md`, ... (one file per epic)
  - `prd_index.md` (navigation links to all shards)
- After Architecture approval, Architecture Agent shards Architecture into:
  - `architecture_overview.md`
  - `architecture_data_models.md`
  - `architecture_api_design.md`
  - `architecture_deployment.md`
  - `architecture_index.md`
- Shards stored in Cloud Storage (GCS bucket: `outcomesignal-documents/{initiative_id}/shards/`)
- UI still displays full document (shards are for agent context retrieval only)

**Technical Notes:**
- Use `shard-doc.py` workflow from BMAD (adapted in Story 4.6)
- Sharding triggered automatically on approval (background job)
- Agents read shards via RAG (LangChain document loaders)

---

## Epic 7: Hierarchy Display & Initiative Management

**Goal:** Display read-only Initiative → Epic hierarchy tree (epics sourced from PRD), enable Initiative CRUD, navigation, and enforce tier-based Initiative limits.

**Priority:** P1 (Should-Have)
**Dependencies:** Epic 5 (PRD generation for epic extraction), Epic 6 (document sharding)
**Estimated Effort:** 2-3 weeks

### Story 7.1: Extract Epics from PRD and Display in Hierarchy Tree
**As a** user
**I want** to see PRD epics in the hierarchy tree
**So that** I can navigate project structure visually

**Acceptance Criteria:**
- After PRD approval, extract epic titles from PRD markdown (headings level 2: `## Epic 1: ...`)
- Create `epics` table records:
  - `id`, `initiative_id`, `title`, `description` (first paragraph under epic heading), `source_document_id` (PRD), `created_at`
- Display epics in left column hierarchy tree under Initiative node
- Clicking epic navigates to epic detail view (shows epic description + related documents)
- Epics are read-only (no user editing in MVP)

**Technical Notes:**
- Use markdown parser (e.g., `remark`, `unified`) to extract headings
- Epics automatically update if PRD is revised and re-approved

---

### Story 7.2: Implement Initiative CRUD Operations
**As a** user
**I want** to create, rename, and archive Initiatives
**So that** I can organize my projects

**Acceptance Criteria:**
- **Create Initiative:**
  - "Create Initiative" button on dashboard
  - Modal prompts for title (required), description (optional)
  - On creation, redirect to new Initiative workspace
  - Enforce tier limits (Trial: 1, Starter: 3/mo, Pro/Enterprise: unlimited)
- **Rename Initiative:**
  - Rename button in Initiative header
  - Inline edit or modal
- **Archive Initiative:**
  - Archive button in Initiative settings
  - Soft delete (set `status: 'archived'`, `archived_at: now()`)
  - Archived Initiatives hidden from dashboard by default (show with "Show Archived" toggle)
- **Delete Initiative (Hard Delete):**
  - Deferred to Phase 2+ (no hard delete in MVP for data safety)

**Technical Notes:**
- Check `usage_tracking.initiatives_count` before allowing creation
- Archiving doesn't free up Initiative limit (only new month reset does)

---

### Story 7.3: Build Initiative Dashboard (Card Grid View)
**As a** user
**I want** to see all my Initiatives on the dashboard
**So that** I can quickly access projects

**Acceptance Criteria:**
- Dashboard displays Initiatives as card grid (3 columns on desktop, responsive)
- Each card shows:
  - Initiative title
  - Status badge (Active, Archived)
  - Progress indicator (Planning X%)
  - Last updated timestamp
  - Thumbnail/icon (default to Initiative initial letter)
- Clicking card navigates to Initiative workspace
- Empty state for new users: "Create your first Initiative to get started"

**Technical Notes:**
- Use shadcn/ui Card component
- Fetch Initiatives via React Query (cache for performance)

---

### Story 7.4: Add Initiative Settings Page
**As a** user
**I want** to configure Initiative settings
**So that** I can manage metadata and preferences

**Acceptance Criteria:**
- Settings page accessible via Initiative menu (three-dot menu in header)
- Settings include:
  - Title, description (editable)
  - Created date, last updated (read-only)
  - Document count, epics count (read-only stats)
  - Archive button
  - Danger zone: Delete Initiative (deferred to Phase 2+)
- Settings saved to `initiatives` table

**Technical Notes:**
- Use form with Zod validation
- Debounce auto-save for title/description

---

### Story 7.5: Enforce Initiative Limits by Tier
**As a** system
**I want** to enforce Initiative creation limits
**So that** we drive upgrades to higher tiers

**Acceptance Criteria:**
- Before Initiative creation, check:
  - `usage_tracking.initiatives_count < usage_tracking.initiatives_limit`
- If limit exceeded:
  - Show error message: "You've reached your Initiative limit. Upgrade to Starter for 3 Initiatives/month or Professional for unlimited."
  - Disable "Create Initiative" button
  - Show upgrade CTA
- Monthly reset (1st of month):
  - Reset `initiatives_count` to 0 for Starter tier (allows 3 new Initiatives)
  - Pro/Enterprise have no limit (unlimited)

**Technical Notes:**
- Starter tier limit is 3 NEW Initiatives per month (existing Initiatives persist)
- Consider archiving Initiatives to allow creating new ones (optional UX improvement)

---

## Epic 8: LLM A/B Testing & Optimization

**Goal:** Implement A/B testing framework for Gemini 2.5 Pro vs Claude Sonnet 4.5, track quality/cost/performance metrics, and select primary LLM based on decision matrix.

**Priority:** P1 (Should-Have)
**Dependencies:** Epic 5 (agent orchestration to test)
**Estimated Effort:** 2-3 weeks

### Story 8.1: Implement LLM Provider Abstraction Layer
**As a** developer
**I want** a unified interface for multiple LLM providers
**So that** we can easily swap between Gemini and Claude

**Acceptance Criteria:**
- Create `LLMProvider` abstract class with methods:
  - `generate(prompt, system_prompt, temperature, max_tokens)` → returns completion
  - `stream(prompt, system_prompt)` → returns streaming iterator
- Implement concrete classes:
  - `GeminiProvider` (uses Google AI Studio SDK)
  - `ClaudeProvider` (uses Anthropic SDK)
- Configuration via environment variable: `PRIMARY_LLM_PROVIDER=gemini|claude`
- Agents use LLMProvider interface (no direct SDK calls)

**Technical Notes:**
- Use factory pattern for provider instantiation
- Store API keys in environment variables (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`)

---

### Story 8.2: Implement A/B Testing Assignment Logic
**As a** system
**I want** to randomly assign users to LLM variants
**So that** we can compare performance with statistical significance

**Acceptance Criteria:**
- On first document generation, assign user to variant:
  - 50% Gemini 2.5 Pro
  - 50% Claude Sonnet 4.5
- Store assignment in `users` table: `ab_test_variant` (gemini|claude)
- Assignment persists for user's lifetime (no mid-test switching)
- Admin override available for testing: `FORCE_LLM_VARIANT=gemini|claude`

**Technical Notes:**
- Use deterministic hashing (user_id % 2) for reproducibility
- Design partners (first 10-20 users) can opt into specific variant for feedback

---

### Story 8.3: Track Quality Metrics (Approval Rate)
**As a** system
**I want** to track document approval rate by LLM variant
**So that** we can measure quality

**Acceptance Criteria:**
- Add `llm_metrics` table:
  - `id`, `user_id`, `variant` (gemini|claude), `document_id`, `document_type`, `approved` (boolean), `revision_count`, `approval_time_seconds`, `created_at`
- On document approval/rejection, log metrics:
  - Approval: `approved: true`, `revision_count: N`, `approval_time_seconds: X`
  - Rejection: `approved: false`, `revision_count: N+1`
- Calculate approval rate: `(approved_count / total_count) * 100%` per variant
- Target: 80%+ approval rate

**Technical Notes:**
- Approval rate = first draft approved without major revisions
- Track `revision_count` to measure iteration needed

---

### Story 8.4: Track Cost Metrics (LLM API Costs)
**As a** system
**I want** to track LLM API costs per document
**So that** we can measure unit economics

**Acceptance Criteria:**
- Add `cost_per_document` field to `llm_metrics` table
- Calculate cost per document:
  - Gemini 2.5 Pro: (input_tokens * $0.00125 / 1K) + (output_tokens * $0.005 / 1K)
  - Claude Sonnet 4.5: (input_tokens * $0.003 / 1K) + (output_tokens * $0.015 / 1K)
- Track token usage via LLM provider API response (`usage.input_tokens`, `usage.output_tokens`)
- Calculate average cost per variant
- Target: <$0.10 per document

**Technical Notes:**
- Token counts returned by both Gemini and Claude APIs
- Store pricing as constants (update if providers change pricing)

---

### Story 8.5: Track Performance Metrics (Response Time)
**As a** system
**I want** to track LLM response time per document
**So that** we can measure user experience

**Acceptance Criteria:**
- Add `response_time_ms` field to `llm_metrics` table
- Measure time from API request to completion (excluding network latency)
- Track percentiles:
  - p50 (median)
  - p95 (95th percentile)
  - p99 (99th percentile)
- Target: <30s for p95 response time

**Technical Notes:**
- Use high-resolution timer (`performance.now()` in Node.js)
- Exclude streaming time (measure full completion time)

---

### Story 8.6: Build A/B Test Decision Dashboard and Select Primary LLM
**As a** PM
**I want** a dashboard comparing LLM variants
**So that** I can make data-driven decision on primary LLM

**Acceptance Criteria:**
- Admin dashboard (internal only) shows:
  - Approval rate by variant (Gemini vs Claude)
  - Average cost per document by variant
  - p95 response time by variant
  - Sample size (documents generated per variant)
- Decision matrix (weighted scoring):
  - Quality: 40% (approval rate)
  - Cost: 40% (cost per document)
  - Performance: 20% (p95 response time)
- After 100+ documents per variant (minimum for statistical significance):
  - Calculate weighted scores
  - Select winner
  - Update `PRIMARY_LLM_PROVIDER` environment variable
- Document decision in PRD change log

**Technical Notes:**
- Use SQL queries to aggregate metrics from `llm_metrics` table
- Dashboard can be simple (Next.js admin page, protected route)
- Target completion: End of Month 2 (design partner phase)

---

## Epic 9: Monitoring, Analytics & Launch Prep

**Goal:** Set up error tracking, logging, usage analytics, conversion funnels, and launch readiness checklist.

**Priority:** P1 (Should-Have)
**Dependencies:** All prior epics (monitors entire system)
**Estimated Effort:** 2-3 weeks

### Story 9.1: Integrate Sentry for Error Tracking
**As a** developer
**I want** to track frontend and backend errors
**So that** we can fix bugs quickly

**Acceptance Criteria:**
- Sentry project created for OutcomeSignal
- Frontend integration:
  - Sentry SDK initialized in Next.js (`_app.tsx`)
  - Captures unhandled errors, promise rejections, React errors
  - Source maps uploaded for readable stack traces
- Backend integration:
  - Sentry SDK initialized in FastAPI (via middleware)
  - Captures API errors, agent workflow failures
- Alerts configured for high-error-rate (>10 errors/hour)

**Technical Notes:**
- Use Sentry's Next.js SDK: `@sentry/nextjs`
- Store Sentry DSN in environment variable
- Tag errors with `environment` (dev/staging/prod)

---

### Story 9.2: Set Up Application Logging (Cloud Logging)
**As a** developer
**I want** structured logging for all services
**So that** we can debug issues and monitor system health

**Acceptance Criteria:**
- Frontend: Log critical user actions (signup, subscription, document approval) to Vercel logs
- Backend: Log all API requests, agent invocations, workflow steps to Google Cloud Logging
- Logging levels: DEBUG, INFO, WARN, ERROR
- Structured logs with metadata:
  - `user_id`, `initiative_id`, `document_id`, `timestamp`, `message`, `level`
- Log retention: 30 days (configurable)

**Technical Notes:**
- Use `winston` or `pino` for structured logging (Node.js)
- Use `logging` library for Python (FastAPI)
- Search logs via GCP Logs Explorer

---

### Story 9.3: Implement Usage Analytics (Posthog or Mixpanel)
**As a** PM
**I want** to track user behavior and engagement
**So that** I can optimize conversion and retention

**Acceptance Criteria:**
- Analytics tool selected (Posthog or Mixpanel)
- Track key events:
  - **Signup funnel:** Page view → Signup click → Account created
  - **Onboarding:** First Initiative created → First Brief generated → First Brief approved
  - **Conversion funnel:** Trial started → Paywall shown → Checkout initiated → Subscription active
  - **Engagement:** Documents generated/month, credits used, Initiatives created
- Dashboards for:
  - Signup → Trial → Paid conversion rate
  - Time to first value (signup → first approved document)
  - Retention (DAU, WAU, MAU)

**Technical Notes:**
- Use Posthog (open-source, self-hosted option) or Mixpanel (SaaS)
- Install SDK in frontend and backend
- Define events in `events.ts` constants file for consistency

---

### Story 9.4: Build Conversion Funnel Dashboard
**As a** PM
**I want** to visualize the trial-to-paid conversion funnel
**So that** I can identify drop-off points

**Acceptance Criteria:**
- Dashboard shows:
  - Step 1: Signups (100%)
  - Step 2: First Initiative created (X%)
  - Step 3: First Brief approved (X%)
  - Step 4: Paywall shown (X%)
  - Step 5: Checkout initiated (X%)
  - Step 6: Subscription active (X%)
- Identify biggest drop-off (e.g., Brief approved → Paywall shown)
- Track conversion rate by source (organic, referral, paid ads)

**Technical Notes:**
- Use analytics tool's funnel feature (Posthog/Mixpanel built-in)
- Target overall conversion: 20-30% trial → paid (industry benchmark for SaaS)

---

### Story 9.5: Set Up Uptime Monitoring (Vercel Analytics + UptimeRobot)
**As a** operations
**I want** to monitor uptime and performance
**So that** we can detect outages quickly

**Acceptance Criteria:**
- UptimeRobot (or similar) pings:
  - Frontend: `https://outcomesignal.com` (every 5 minutes)
  - Backend API: `https://api.outcomesignal.com/health` (every 5 minutes)
- Vercel Analytics enabled for:
  - Core Web Vitals (LCP, FID, CLS)
  - Page load times
  - Edge function performance
- Alerts configured:
  - Downtime > 5 minutes → PagerDuty/Slack
  - Error rate > 5% → Slack

**Technical Notes:**
- Create `/health` endpoint in FastAPI (returns 200 OK with system status)
- UptimeRobot free tier supports 50 monitors

---

### Story 9.6: Create Launch Readiness Checklist
**As a** PM
**I want** a comprehensive pre-launch checklist
**So that** we ensure quality and readiness

**Acceptance Criteria:**
- Checklist document (Notion or GitHub) covering:
  - **Functionality:** All P0 stories completed and tested
  - **Performance:** NFR1-4 validated (response times, render times)
  - **Security:** Clerk auth tested, Supabase RLS enabled, HTTPS enforced
  - **Billing:** Stripe webhooks tested, subscription flows validated
  - **Compliance:** Terms of Service, Privacy Policy published
  - **Monitoring:** Sentry, logging, analytics verified
  - **Documentation:** User onboarding guide, help center articles
  - **Marketing:** Landing page live, signup flow tested
  - **Support:** Support email configured (support@outcomesignal.com)
- Go/No-Go meeting before launch (all checklist items complete)

**Technical Notes:**
- Use Linear or Notion for checklist tracking
- Assign owners for each checklist category

---

### Story 9.7: Conduct End-to-End Launch Simulation
**As a** QA
**I want** to simulate a full user journey in production-like environment
**So that** we validate the entire system works end-to-end

**Acceptance Criteria:**
- Staging environment configured (mirrors production)
- Test scenario:
  1. Signup (email/password + Google OAuth)
  2. Create Initiative
  3. Generate Brief (trial user, first document)
  4. Approve Brief
  5. Attempt to generate PRD → Paywall triggers
  6. Complete Stripe Checkout (test mode)
  7. Generate PRD, Architecture, Security, QA (paid user)
  8. Export documents (single and bulk ZIP)
  9. Revise PRD (credit deduction)
  10. Create 2nd Initiative (Starter tier limit: 3/mo)
- All steps logged, monitored, and succeed without errors

**Technical Notes:**
- Use Stripe test mode for payment simulation
- Record session with screen recording for documentation
- Invite 3-5 design partners for beta testing (collect feedback)

---

## Conclusion & Next Steps

### MVP Scope Summary

This PRD defines **9 epics with 64 user stories** for the OutcomeSignal MVP, targeting a **6-month development timeline** (Months 1-6). The MVP delivers:

1. **Core Infrastructure:** Turborepo monorepo, Next.js frontend, FastAPI backend, Supabase database, Clerk auth, Stripe billing
2. **Three-Column Workspace:** Hierarchy tree, document preview, agent chat with responsive design
3. **Trial Management:** 7-day trial with Brief-only limit, paywall modal, subscription tiers (Starter $49, Pro $149, Enterprise $499)
4. **OutcomeSignal Agents:** 7 specialized agents (Discovery, Requirements, Design, Architecture, Quality, Validation, Planning) with functional names and BMAD personalities
5. **Planning Phase:** 8 document types (Brief, PRD, Architecture, UX, Security, QA, Market Research, Competitive Analysis) with approval gates and intelligent backfilling
6. **Document Management:** Versioning, export (markdown and ZIP), search, sharing, sharding for context retrieval
7. **Hierarchy Display:** Read-only Initiative → Epic tree (epics from PRD), Initiative CRUD with tier limits
8. **LLM A/B Testing:** Gemini 2.5 Pro vs Claude Sonnet 4.5 comparison with quality/cost/performance metrics
9. **Monitoring & Analytics:** Sentry, Cloud Logging, usage analytics, conversion funnels, uptime monitoring

### Success Criteria (Month 6 MVP Launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to First Value** | <30 minutes (signup → first Brief approved) | Analytics funnel |
| **Document Approval Rate** | 80%+ (first drafts approved with minor edits) | `llm_metrics` table |
| **Trial → Paid Conversion** | 20-30% | Analytics funnel |
| **System Uptime** | 99%+ | UptimeRobot |
| **LLM Cost per Document** | <$0.10 | `llm_metrics.cost_per_document` |
| **p95 Response Time** | <30s for document generation | `llm_metrics.response_time_ms` |
| **Monthly Active Users** | 100+ (design partners + early adopters) | Analytics |
| **MRR** | $2,000+ (20 paid users @ avg $100/mo) | Stripe dashboard |

### Post-MVP Roadmap (Phase 2.0+)

**Month 7-12: Execution Phase & Integrations**
- **Planning Agent Story Creation:** Full vertical slice user stories from sharded PRD + Architecture + UX (see BMAD `create-next-story.py` workflow)
- **Editable Hierarchy:** User-created epics, features, stories (beyond PRD-generated epics)
- **Execution Phase Integration:** Linear, Jira, Azure Boards sync for story export
- **Team Collaboration:** Multi-user workspaces, role-based permissions (Owner, Editor, Viewer)
- **Advanced Exports:** Notion sync, GitHub markdown commits, Confluence integration
- **Design System Evolution:** Custom themes, white-label for Enterprise tier

**Phase 3.0: Scale & Intelligence**
- **AI Enhancements:** Auto-detect requirements gaps, suggest test cases, predict risks
- **Multi-Initiative Planning:** Cross-Initiative dependencies, portfolio view
- **Advanced Analytics:** Predictive delivery timelines, team velocity tracking
- **Mobile Apps:** Native iOS/Android apps
- **ChatGPT/Claude Desktop Integration:** Native interfaces via Apps SDK and MCP

### Out of Scope for MVP

To maintain focus and hit the 6-month timeline, the following are explicitly **deferred**:
- Hard delete for Initiatives (soft delete only)
- Real-time collaboration (multi-user editing)
- Custom agent training (using BMAD personalities as-is)
- Third-party integrations (Linear, Jira, Notion)—Phase 2+
- Story creation and task breakout (Planning Agent)—Phase 2+
- Advanced document diffing and merge tools
- Email notifications for approvals, updates
- Inline document editing (TipTap is read-only in MVP)
- Custom branding/white-label (Enterprise feature)

### Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| **LLM costs exceed $0.10/doc** | High (margin compression) | A/B test Gemini vs Claude, optimize prompts, implement caching |
| **Approval rate below 80%** | High (poor UX, low retention) | Design partner feedback loop, prompt refinement, fallback to simpler templates |
| **Trial conversion below 20%** | Medium (revenue miss) | Paywall optimization, value demonstration in trial (Brief quality), upgrade CTAs |
| **Vertex AI agent orchestration complexity** | Medium (dev timeline slip) | Spike Epic 5.1 in Month 1, fallback to simpler LangChain orchestration if needed |
| **Stripe webhook failures** | Medium (billing issues) | Idempotent webhook processing, manual fallback for failed syncs, alerting |
| **Supabase RLS misconfiguration** | High (data leak) | Security audit pre-launch, automated tests for RLS policies, penetration testing |

### Stakeholder Alignment

**For Engineering Team:**
- Epic 1-2 (Foundation, Workspace) are critical path—prioritize for Month 1-2
- Epic 4 (BMAD rebranding) can run in parallel with infrastructure work
- Epic 8 (LLM A/B testing) requires design partner feedback—plan for Month 2-3

**For Design/UX:**
- Three-column workspace is novel UX—invest in responsive design testing (Story 2.6)
- Approval gate UX (buttons + natural language) needs user testing
- Agent personality copy (prompts) requires collaboration with PM on tone

**For Product/Business:**
- Trial limits (Brief-only) are aggressive for conversion—monitor closely in design partner phase
- Starter tier ($49/mo, 3 Initiatives) pricing validated against Notion AI ($10/mo, limited) and Jasper ($49/mo, content generation)
- LLM decision (Epic 8) must complete by Month 2 to lock in infrastructure costs

### Go-to-Market Alignment

**Design Partner Phase (Month 1-3):**
- Recruit 10-20 solo developers, indie hackers, small dev teams
- Goals: Validate approval rate, trial conversion, LLM selection
- Deliverable: Product-market fit confirmation, testimonials

**Private Beta (Month 4-5):**
- Expand to 50-100 users via waitlist
- Goals: Stress test infrastructure, refine onboarding, optimize conversion funnel
- Deliverable: <5% error rate, 99%+ uptime, 25%+ trial conversion

**Public Launch (Month 6):**
- Open signups, marketing launch (Product Hunt, Hacker News, Twitter)
- Goals: 500+ signups in Month 6, $2K+ MRR
- Deliverable: Stable product, support infrastructure, growth loop

---

**Document Status:** ✅ **Approved for Development**
**Next Steps:**
1. Engineering kickoff (Epic 1.1: Initialize monorepo)
2. PM to update [brief.md](brief.md) for Brief-only trial (pending task from conversation)
3. Schedule design partner recruitment (PM + Marketing)
4. Create Linear workspace and import stories from this PRD

**Questions or Clarifications?** Contact John (PM Agent) at outcomesignal-pm@example.com

---

*End of Product Requirements Document*
