# Requirements

## Functional Requirements

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

## Non-Functional Requirements

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
