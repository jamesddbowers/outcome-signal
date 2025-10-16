# Epic List

This PRD defines 9 epics for the OutcomeSignal MVP, spanning Months 1-6. Each epic represents a major feature area with detailed user stories.

## Epic 1: Foundation & Authentication
**Goal:** Establish core project infrastructure, monorepo setup, and user authentication.
**Stories:** 7
**Priority:** P0 (Must-Have)
**Dependencies:** None (foundational work)

## Epic 2: Three-Column Workspace & Navigation
**Goal:** Build the core three-column UI (hierarchy, document preview, agent chat) with responsive design.
**Stories:** 8
**Priority:** P0 (Must-Have)
**Dependencies:** Epic 1 (requires auth, base UI components)

## Epic 3: Trial Management & Subscription Infrastructure
**Goal:** Implement 7-day trial with hard limits (Brief-only), paywall modal, Stripe subscription flow, and usage tracking.
**Stories:** 8
**Priority:** P0 (Must-Have)
**Dependencies:** Epic 1 (auth), Epic 2 (workspace UI for paywall modal)

## Epic 4: BMAD Framework Adaptation & Rebranding
**Goal:** Systematically rebrand BMAD agents to OutcomeSignal agents with functional names (Discovery Agent, Requirements Agent, etc.) while retaining BMAD personalities, adapt templates, and update workflows.
**Stories:** 8
**Priority:** P0 (Must-Have)
**Dependencies:** None (parallel work with technical setup)

## Epic 5: AI Agent Orchestration (Planning Phase)
**Goal:** Deploy Primary Agent with 6 Planning Phase sub-agents, implement document generation workflows (Brief, PRD, Architecture, UX, Security, QA), add approval gates, and enable intelligent backfilling.
**Stories:** 8
**Priority:** P0 (Must-Have)
**Dependencies:** Epic 2 (UI for agent chat), Epic 4 (rebranded agents)

## Epic 6: Document Management & Export
**Goal:** Enable document lifecycle (create, view, revise), markdown export (per-doc and bulk ZIP), version history, and export restrictions for trial users.
**Stories:** 7
**Priority:** P0 (Must-Have)
**Dependencies:** Epic 5 (document generation), Epic 3 (export tier restrictions)

## Epic 7: Hierarchy Display & Initiative Management
**Goal:** Display read-only Initiative → Epic hierarchy tree (epics sourced from PRD), enable Initiative CRUD, navigation, and enforce tier-based Initiative limits.
**Stories:** 5
**Priority:** P1 (Should-Have)
**Dependencies:** Epic 5 (PRD generation for epic extraction), Epic 6 (document sharding)

## Epic 8: LLM A/B Testing & Optimization
**Goal:** Implement A/B testing framework for Gemini 2.5 Pro vs Claude Sonnet 4.5, track quality/cost/performance metrics, and select primary LLM based on decision matrix.
**Stories:** 6
**Priority:** P1 (Should-Have)
**Dependencies:** Epic 5 (agent orchestration to test)

## Epic 9: Monitoring, Analytics & Launch Prep
**Goal:** Set up error tracking, logging, usage analytics, conversion funnels, and launch readiness checklist.
**Stories:** 7
**Priority:** P1 (Should-Have)
**Dependencies:** All prior epics (monitors entire system)

---
