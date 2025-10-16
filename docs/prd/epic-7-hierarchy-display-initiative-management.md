# Epic 7: Hierarchy Display & Initiative Management

**Goal:** Display read-only Initiative → Epic hierarchy tree (epics sourced from PRD), enable Initiative CRUD, navigation, and enforce tier-based Initiative limits.

**Priority:** P1 (Should-Have)
**Dependencies:** Epic 5 (PRD generation for epic extraction), Epic 6 (document sharding)
**Estimated Effort:** 2-3 weeks

## Story 7.1: Extract Epics from PRD and Display in Hierarchy Tree
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

## Story 7.2: Implement Initiative CRUD Operations
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

## Story 7.3: Build Initiative Dashboard (Card Grid View)
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

## Story 7.4: Add Initiative Settings Page
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

## Story 7.5: Enforce Initiative Limits by Tier
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
