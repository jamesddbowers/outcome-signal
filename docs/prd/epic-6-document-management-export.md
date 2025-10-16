# Epic 6: Document Management & Export

**Goal:** Enable document lifecycle (create, view, revise), markdown export (per-doc and bulk ZIP), version history, and export restrictions for trial users.

**Priority:** P0 (Must-Have)
**Dependencies:** Epic 5 (document generation), Epic 3 (export tier restrictions)
**Estimated Effort:** 3-4 weeks

## Story 6.1: Implement Document Versioning
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

## Story 6.2: Enable Document Revision via Agent Chat
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

## Story 6.3: Build Document Export (Single Markdown File)
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

## Story 6.4: Build Bulk Export (ZIP Archive)
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

## Story 6.5: Implement Document Search (Within Initiative)
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

## Story 6.6: Add Document Sharing (Public Links, Read-Only)
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

## Story 6.7: Implement Document Sharding (PRD Epics, Architecture Sections)
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
