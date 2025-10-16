# Epic 5: AI Agent Orchestration (Planning Phase)

**Goal:** Deploy Primary Agent with 6 Planning Phase sub-agents, implement document generation workflows (Brief, PRD, Architecture, UX, Security, QA), add approval gates, and enable intelligent backfilling.

**Priority:** P0 (Must-Have)
**Dependencies:** Epic 2 (UI for agent chat), Epic 4 (rebranded agents)
**Estimated Effort:** 5-6 weeks

## Story 5.1: Deploy Primary Agent with Sub-Agent Orchestration
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

## Story 5.2: Implement Project Brief Generation Workflow
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

## Story 5.3: Implement PRD Generation Workflow
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

## Story 5.4: Implement Architecture Overview Generation Workflow
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

## Story 5.5: Implement UX Overview, Security Review, and QA Strategy Workflows
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

## Story 5.6: Implement Market Research and Competitive Analysis Workflows (Optional)
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

## Story 5.7: Implement Human Approval Gates with Natural Language Interpretation
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

## Story 5.8: Implement Intelligent Backfilling for Missing Documents
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
