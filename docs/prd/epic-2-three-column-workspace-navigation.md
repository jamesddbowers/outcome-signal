# Epic 2: Three-Column Workspace & Navigation

**Goal:** Build the core three-column UI (hierarchy tree, document preview, agent chat) with responsive design and collapsible panels.

**Priority:** P0 (Must-Have)
**Dependencies:** Epic 1 (authentication, base UI components)
**Estimated Effort:** 4-5 weeks

## Story 2.1: Create Three-Column Layout Component
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

## Story 2.2: Build Hierarchy Tree Navigation (Left Column)
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

## Story 2.3: Implement Document Preview with TipTap (Middle Column)
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

## Story 2.4: Build Agent Chat Interface (Right Column)
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

## Story 2.5: Add Phase Indicator UI in Workspace Header
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

## Story 2.6: Implement Responsive Design (Tablet & Mobile)
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

## Story 2.7: Add Collapsible Panel Animations
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

## Story 2.8: Persist Workspace Layout Preferences
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
