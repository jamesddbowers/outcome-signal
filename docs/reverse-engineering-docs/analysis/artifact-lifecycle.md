# BMad Framework Artifact Lifecycle

**Document Version**: 1.0
**Last Updated**: 2025-10-13
**Status**: Complete

## Table of Contents

1. [Overview](#overview)
2. [Artifact Types](#artifact-types)
3. [Lifecycle Phases](#lifecycle-phases)
4. [Artifact State Transitions](#artifact-state-transitions)
5. [Creation Workflows](#creation-workflows)
6. [Update Workflows](#update-workflows)
7. [Validation & Quality Gates](#validation--quality-gates)
8. [Sharding & Transformation](#sharding--transformation)
9. [Version Control Integration](#version-control-integration)
10. [Artifact Relationships](#artifact-relationships)

---

## Overview

This document describes the complete lifecycle of artifacts within the BMad framework, from initial creation through validation, updates, and eventual completion. All artifacts are file-based (markdown or YAML) and version-controlled.

### Key Lifecycle Principles

| Principle | Implementation | Benefits |
|-----------|----------------|----------|
| **Immutable Creation** | Once created, ownership is established | Clear responsibility |
| **Section Permissions** | Only specific agents can edit specific sections | Prevents conflicts |
| **State Tracking** | Status field in artifacts | Progress visibility |
| **Version Control** | All changes tracked in git | Full audit trail |
| **Template-Driven** | Generated from YAML schemas | Consistency |
| **Validation Gates** | Checklist validation at key points | Quality assurance |

---

## Artifact Types

### Planning Phase Artifacts

| Artifact Type | File Pattern | Creator | Lifespan | Mutability |
|--------------|--------------|---------|----------|------------|
| **Project Brief** | `project-brief.md` | Analyst | Planning phase | Editable by Analyst |
| **Market Research** | `market-research.md` | Analyst | Planning phase | Editable by Analyst |
| **Competitor Analysis** | `competitor-analysis.md` | Analyst | Planning phase | Editable by Analyst |
| **PRD (monolithic)** | `prd.md` | PM | Until sharding | Editable by PM |
| **PRD (sharded)** | `prd/epic-*.md` | PM/PO | Development phase | Read-only |
| **Architecture (monolithic)** | `architecture.md` | Architect | Until sharding | Editable by Architect |
| **Architecture (sharded)** | `architecture/*.md` | Architect/PO | Development phase | Read-only |
| **Front-End Spec** | `front-end-spec.md` | UX Expert | Planning phase | Editable by UX |

### Development Phase Artifacts

| Artifact Type | File Pattern | Creator | Lifespan | Mutability |
|--------------|--------------|---------|----------|------------|
| **Story** | `{epic}.{story}.{title}.md` | SM | Per story | Section-specific permissions |
| **Risk Assessment** | `qa/assessments/{epic}.{story}-risk-{date}.md` | QA | Per story | Read-only after creation |
| **Test Design** | `qa/assessments/{epic}.{story}-test-design-{date}.md` | QA | Per story | Read-only after creation |
| **Requirements Trace** | `qa/assessments/{epic}.{story}-trace-{date}.md` | QA | Per story | Read-only after creation |
| **NFR Assessment** | `qa/assessments/{epic}.{story}-nfr-{date}.md` | QA | Per story | Read-only after creation |
| **Quality Gate** | `qa/gates/{epic}.{story}-{slug}.yml` | QA | Per story | Immutable |

### Meta Artifacts

| Artifact Type | File Pattern | Creator | Lifespan | Mutability |
|--------------|--------------|---------|----------|------------|
| **Configuration** | `core-config.yaml` | User/PO | Project lifetime | Editable by user |
| **Debug Log** | `.ai/debug-log.md` | Dev | Development phase | Append-only |

---

## Lifecycle Phases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Artifact Lifecycle Overview                            │
└─────────────────────────────────────────────────────────────────────────────┘

1. CONCEPTION
   │
   │  Agent receives command
   │  User provides requirements
   │
   ▼

2. TEMPLATE SELECTION
   │
   │  Agent identifies appropriate template
   │  Loads from .bmad-core/templates/
   │
   ▼

3. DATA GATHERING
   │
   │  Interactive: elicit from user
   │  YOLO: auto-generate
   │  Context: read existing artifacts
   │
   ▼

4. GENERATION
   │
   │  Populate template with data
   │  Apply formatting rules
   │  Set section permissions
   │  Add metadata
   │
   ▼

5. VALIDATION (Optional)
   │
   │  Run relevant checklist
   │  Verify completeness
   │  Check cohesion with other artifacts
   │
   ▼

6. PERSISTENCE
   │
   │  Write to configured location
   │  Create directories if needed
   │  Report location to user
   │
   ▼

7. VERSION CONTROL
   │
   │  Git add
   │  Git commit
   │  Track in repository
   │
   ▼

8. HANDOFF
   │
   │  Artifact available to next agent
   │  Status indicates readiness
   │
   ▼

9. UPDATES (Iterative)
   │
   │  Agents update permitted sections
   │  Maintain audit trail
   │  Re-validate if needed
   │
   ▼

10. TRANSFORMATION (Some artifacts)
    │
    │  Sharding: monolithic → multiple files
    │  Aggregation: multiple → summary
    │
    ▼

11. COMPLETION
    │
    │  Status set to "done" or "complete"
    │  No further modifications
    │  Archived state
    │
    ▼

12. REFERENCE
    │
    │  Used as read-only reference
    │  Informs future artifacts
    │  Historical record
```

---

## Artifact State Transitions

### Story Artifact States

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Story State Transitions                              │
└─────────────────────────────────────────────────────────────────────────────┘

      START
        │
        │  SM executes *draft
        │
        ▼
   ┌─────────┐
   │  DRAFT  │  ← Created by SM
   │         │    Populated from epic
   │ Sections│    All sections filled
   │ complete│    Tasks defined
   └────┬────┘
        │
        │  Optional: PO validates
        │  (If validation enabled)
        │
        ▼
  ┌──────────┐
  │ APPROVED │  ← PO has validated
  │          │    Story ready for dev
  │ (Optional│    Meets standards
  │  state)  │
  └────┬─────┘
       │
       │  Dev activates story
       │  Begins implementation
       │
       ▼
 ┌──────────────┐
 │  IN_PROGRESS │  ← Dev is working
 │              │    Tasks being completed
 │  Dev Record  │    Code being written
 │  updated     │    Tests being created
 └──────┬───────┘
        │
        │  Dev completes all tasks
        │  Runs DoD checklist
        │  Sets status to review
        │
        ▼
  ┌───────────┐
  │  REVIEW   │  ← Ready for QA
  │           │    All tasks complete
  │  Dev done │    Tests passing
  │  QA next  │    DoD satisfied
  └─────┬─────┘
        │
        │  QA performs assessments
        │  Creates gate decision
        │
        ├───────────────────┬───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌────────┐          ┌────────┐         ┌────────┐
   │  PASS  │          │CONCERNS│         │  FAIL  │
   │        │          │        │         │        │
   │ Gate:  │          │ Gate:  │         │ Gate:  │
   │ PASS   │          │CONCERNS│         │ FAIL   │
   └───┬────┘          └───┬────┘         └───┬────┘
       │                   │                  │
       │                   │                  │  Back to IN_PROGRESS
       │                   │                  │  Dev applies fixes
       │                   │                  │
       │                   │                  └───────┐
       │                   │                          │
       │                   │  May proceed             │
       │                   │  with concerns           │
       │                   │  documented              │
       └───────────────────┼──────────────────────────┘
                           │
                           │  Story complete
                           │  Gate recorded
                           │
                           ▼
                      ┌─────────┐
                      │  DONE   │  ← Story complete
                      │         │    Code merged
                      │ Final   │    Gate satisfied
                      │ state   │    No more changes
                      └─────────┘
                           │
                           │  Immutable
                           │  Historical record
                           │
                           ▼
                      ARCHIVED


STATE CHANGE TRIGGERS:

  draft → approved:      PO validation (optional)
  draft → in_progress:   Dev starts work (if no validation)
  approved → in_progress: Dev starts work
  in_progress → review:  Dev completes all tasks + DoD
  review → pass:         QA gate decision: PASS
  review → concerns:     QA gate decision: CONCERNS
  review → fail:         QA gate decision: FAIL
  fail → in_progress:    Dev applies fixes
  pass → done:           Gate accepted, story closed
  concerns → done:       Concerns accepted, story closed
```

### Planning Artifact States

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Planning Artifact State Transitions                       │
└─────────────────────────────────────────────────────────────────────────────┘

PRD Lifecycle:
──────────────

      START
        │
        │  PM executes *create-prd
        │
        ▼
   ┌─────────┐
   │  DRAFT  │  ← Initial creation
   │         │    Sections populated
   │ PRD v4  │    Epics & stories defined
   └────┬────┘
        │
        │  PM reviews & refines
        │  May re-elicit sections
        │
        ▼
 ┌──────────────┐
 │  IN_REVIEW   │  ← Handed to PO
 │              │    Validation pending
 │ PO validates │
 └──────┬───────┘
        │
        ├────────────────┬────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌────────┐       ┌────────┐      ┌────────┐
   │  PASS  │       │ CHANGES│      │REJECTED│
   │        │       │ NEEDED │      │        │
   └───┬────┘       └───┬────┘      └───┬────┘
       │                │               │
       │                │  Back to PM   │  Major issues
       │                │  for updates  │  Start over
       │                │               │
       │                └───────┐       │
       │                        │       │
       │                        ▼       ▼
       │                   ┌─────────────┐
       │                   │   DRAFT     │
       │                   │  (revised)  │
       │                   └──────┬──────┘
       │                          │
       │                          │  Re-review
       │                          │
       │                          ▼
       │                   (Loop until pass)
       │                          │
       └──────────────────────────┘
       │
       │  Approved for development
       │
       ▼
 ┌──────────────┐
 │   APPROVED   │  ← Ready for sharding
 │              │    PO can shard
 │ Monolithic   │    Or proceed to dev
 └──────┬───────┘
        │
        │  PO executes *shard-prd
        │
        ▼
 ┌──────────────┐
 │   SHARDED    │  ← PRD split into files
 │              │    docs/prd/index.md
 │ Multiple     │    docs/prd/epic-*.md
 │ files        │    Read-only from now
 └──────┬───────┘
        │
        │  Development phase begins
        │
        ▼
 ┌──────────────┐
 │   ACTIVE     │  ← Used by SM for stories
 │              │    Reference for Dev
 │ Reference    │    Context for QA
 │ material     │    No modifications
 └──────────────┘


Architecture Lifecycle:
────────────────────────

Similar to PRD:
  draft → in_review → approved → sharded → active

Sharded output:
  docs/architecture/
    ├─ index.md
    ├─ tech-stack.md
    ├─ coding-standards.md
    ├─ source-tree.md
    ├─ database-schema.md
    ├─ backend-architecture.md
    ├─ frontend-architecture.md
    └─ rest-api-spec.md
```

---

## Creation Workflows

### Planning Artifact Creation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Planning Artifact Creation                              │
└─────────────────────────────────────────────────────────────────────────────┘

USER: "*create-prd"
  │
  ▼
PM AGENT
  │
  │  1. Load task: create-doc.md
  │  2. Load template: prd-tmpl.yaml
  │  3. Load core-config.yaml
  │
  ▼
┌────────────────────────────────────┐
│  Template: prd-tmpl.yaml           │
│                                    │
│  Sections:                         │
│    • Overview (elicit=true)        │
│    • Goals (elicit=true)           │
│    • Target Users (elicit=true)    │
│    • Epics (elicit=true)           │
│      └─ Stories (elicit=true)      │
│    • Success Metrics (elicit=true) │
│    • Constraints (elicit=true)     │
│    • Risks (elicit=true)           │
└────────────────────────────────────┘
  │
  │  FOR each section WITH elicit=true
  │
  ▼
┌────────────────────────────────────┐
│  Elicitation Process               │
│                                    │
│  PM: "Let's define the overview.   │
│       What problem does this       │
│       product solve?"              │
│                                    │
│  USER: [provides answer]           │
│                                    │
│  PM: [validates, stores]           │
│                                    │
│  [Repeat for each section]         │
└────────────────────────────────────┘
  │
  │  All data gathered
  │
  ▼
┌────────────────────────────────────┐
│  Generate Markdown                 │
│                                    │
│  ---                               │
│  template: prd-template-v4         │
│  created: 2025-10-13               │
│  author: PM                        │
│  status: draft                     │
│  ---                               │
│                                    │
│  # Product Requirements Document   │
│                                    │
│  ## Overview                       │
│  [User content]                    │
│                                    │
│  ## Epics                          │
│  ### Epic 1: [Title]               │
│  [Description]                     │
│                                    │
│  #### Stories                      │
│  - 1.1: [Story]                    │
│  - 1.2: [Story]                    │
└────────────────────────────────────┘
  │
  │  Write to file system
  │
  ▼
┌────────────────────────────────────┐
│  File Writer                       │
│                                    │
│  1. Read core-config.yaml          │
│     prd.prdFile = "docs/prd.md"    │
│                                    │
│  2. Create directory               │
│     mkdir -p docs/                 │
│                                    │
│  3. Write file                     │
│     write docs/prd.md              │
│                                    │
│  4. Report to user                 │
│     "PRD created at docs/prd.md"   │
└────────────────────────────────────┘
  │
  ▼
ARTIFACT CREATED
docs/prd.md
Status: draft
```

### Story Artifact Creation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Story Artifact Creation                              │
└─────────────────────────────────────────────────────────────────────────────┘

USER: "*draft" (SM agent active)
  │
  ▼
SM AGENT
  │
  │  1. Load task: create-next-story.md
  │  2. Load template: story-tmpl.yaml
  │  3. Load core-config.yaml
  │
  ▼
┌────────────────────────────────────┐
│  Step 0: Load Core Config          │
│                                    │
│  Read:                             │
│  • devStoryLocation                │
│  • prd.prdSharded                  │
│  • prd.prdShardedLocation          │
│  • architecture.*                  │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Step 1: Identify Next Story       │
│                                    │
│  Read: docs/prd/epic-*.md          │
│  Find: First story without file    │
│                                    │
│  Result: Epic 1, Story 1           │
│  Title: "User Authentication"      │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Step 2: Gather Requirements       │
│                                    │
│  Read: docs/prd/epic-1-stories.md  │
│  Extract:                          │
│  • Story description               │
│  • Acceptance criteria             │
│  • Dependencies                    │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Step 3: Gather Architecture       │
│           Context                  │
│                                    │
│  Determine story type: backend     │
│  Read: docs/architecture/          │
│    backend-architecture.md         │
│    database-schema.md              │
│    rest-api-spec.md                │
│  Extract relevant sections         │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Step 4: Verify Project Structure  │
│                                    │
│  Check if src/ structure matches   │
│  architecture/source-tree.md       │
│  Note any discrepancies            │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Step 5: Populate Story Template   │
│                                    │
│  Template: story-tmpl.yaml         │
│  Fill sections:                    │
│  • Overview                        │
│  • Requirements                    │
│  • Acceptance Criteria             │
│  • Technical Context               │
│  • Tasks (break down work)         │
│  • Dev Agent Record (empty)        │
│  • QA Results (empty)              │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Step 6: Execute Draft Checklist   │
│                                    │
│  Load: story-draft-checklist.md    │
│  Validate:                         │
│  • AC are clear & testable         │
│  • Tasks are specific              │
│  • Tech context is complete        │
│  • No ambiguities                  │
│                                    │
│  Result: PASS                      │
└────────────────────────────────────┘
  │
  │  Write story file
  │
  ▼
┌────────────────────────────────────┐
│  File Writer                       │
│                                    │
│  Filename:                         │
│    {epic}.{story}.{title-slug}.md  │
│    1.1.user-authentication.md      │
│                                    │
│  Location:                         │
│    docs/stories/                   │
│    (from devStoryLocation)         │
│                                    │
│  Status: draft                     │
└────────────────────────────────────┘
  │
  ▼
ARTIFACT CREATED
docs/stories/1.1.user-authentication.md
Status: draft
```

### QA Assessment Creation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       QA Assessment Creation                                 │
└─────────────────────────────────────────────────────────────────────────────┘

USER: "*review {story}" (QA agent active)
  │
  ▼
QA AGENT
  │
  │  Load story: docs/stories/1.1.user-authentication.md
  │  Status must be: review
  │
  ▼
┌────────────────────────────────────┐
│  Assessment 1: Risk Profile        │
│                                    │
│  Task: risk-profile.md             │
│                                    │
│  Process:                          │
│  • Identify risk categories        │
│  • Assess probability (1-3)        │
│  • Assess impact (1-3)             │
│  • Calculate score (P × I)         │
│  • Define mitigations              │
│                                    │
│  Output:                           │
│    docs/qa/assessments/            │
│    1.1-risk-20251013.md            │
│                                    │
│  Content:                          │
│    # Risk Assessment               │
│    Story: 1.1 User Authentication  │
│                                    │
│    ## Risks                        │
│    1. Security: Score 6 (P:2,I:3)  │
│       Mitigation: [...]            │
│                                    │
│    ## Overall Risk: Medium         │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Assessment 2: Test Design         │
│                                    │
│  Task: test-design.md              │
│                                    │
│  Process:                          │
│  • Design test scenarios           │
│  • Prioritize (P0/P1/P2)           │
│  • Specify test levels             │
│  • Define test data needs          │
│                                    │
│  Output:                           │
│    docs/qa/assessments/            │
│    1.1-test-design-20251013.md     │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Assessment 3: Requirements Trace  │
│                                    │
│  Task: trace-requirements.md       │
│                                    │
│  Process:                          │
│  • Map AC to tests                 │
│  • Given-When-Then format          │
│  • Identify coverage gaps          │
│                                    │
│  Output:                           │
│    docs/qa/assessments/            │
│    1.1-trace-20251013.md           │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Assessment 4: NFR Assessment      │
│                                    │
│  Task: nfr-assess.md               │
│                                    │
│  Process:                          │
│  • Security validation             │
│  • Performance assessment          │
│  • Reliability evaluation          │
│  • Maintainability scoring         │
│                                    │
│  Output:                           │
│    docs/qa/assessments/            │
│    1.1-nfr-20251013.md             │
└────────────────────────────────────┘
  │
  │  All assessments complete
  │
  ▼
┌────────────────────────────────────┐
│  Task: review-story.md             │
│                                    │
│  Aggregate all assessments         │
│  Perform active refactoring        │
│  Make gate decision                │
│                                    │
│  Decision: PASS                    │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Create Quality Gate               │
│                                    │
│  Template: qa-gate-tmpl.yaml       │
│                                    │
│  File:                             │
│    docs/qa/gates/                  │
│    1.1-user-authentication.yml     │
│                                    │
│  Content:                          │
│    gate_decision:                  │
│      decision: PASS                │
│      rationale: "All assessments   │
│        passed. Code quality high." │
│      date: 2025-10-13              │
│      created_by: qa-agent          │
│      concerns: []                  │
│      blocking_issues: []           │
└────────────────────────────────────┘
  │
  │  Update story QA Results section
  │
  ▼
┌────────────────────────────────────┐
│  Update Story File                 │
│                                    │
│  docs/stories/                     │
│  1.1.user-authentication.md        │
│                                    │
│  Section: QA Results               │
│  (QA has permission to edit)       │
│                                    │
│  Add:                              │
│  • Risk summary                    │
│  • Test summary                    │
│  • Gate decision                   │
│  • Links to assessments            │
└────────────────────────────────────┘
  │
  ▼
ARTIFACTS CREATED
• 4 assessment files
• 1 gate file
• Story updated
```

---

## Update Workflows

### Story Updates by Dev

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Story Updates by Dev                                │
└─────────────────────────────────────────────────────────────────────────────┘

DEV AGENT
  │
  │  Implements story tasks
  │
  ▼
┌────────────────────────────────────┐
│  Dev Agent Permitted Updates       │
│                                    │
│  Can ONLY edit:                    │
│  • Dev Agent Record section        │
│                                    │
│  Within Dev Agent Record:          │
│  ├─ Tasks checkboxes               │
│  │   - [ ] Task 1                  │
│  │   - [x] Task 2                  │
│  │   - [ ] Task 3                  │
│  │                                 │
│  ├─ Debug Log                      │
│  │   Notes on challenges,          │
│  │   decisions, workarounds        │
│  │                                 │
│  ├─ Completion Notes               │
│  │   How tasks were accomplished   │
│  │                                 │
│  ├─ Files Changed                  │
│  │   List of modified/created files│
│  │                                 │
│  ├─ Change Log                     │
│  │   Brief changelog of work       │
│  │                                 │
│  └─ Status                         │
│      Update from in_progress to    │
│      review when done              │
└────────────────────────────────────┘
  │
  │  FORBIDDEN: Dev cannot edit
  │  • Overview
  │  • Requirements
  │  • Acceptance Criteria
  │  • Technical Context
  │  • QA Results
  │
  ▼
┌────────────────────────────────────┐
│  Update Process                    │
│                                    │
│  1. Read current story file        │
│  2. Locate Dev Agent Record section│
│  3. Update permitted fields        │
│  4. Preserve all other sections    │
│  5. Write updated story            │
│  6. Commit to version control      │
└────────────────────────────────────┘
  │
  ▼
STORY UPDATED
Dev Agent Record reflects progress
Other sections unchanged
```

### Story Updates by QA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Story Updates by QA                                 │
└─────────────────────────────────────────────────────────────────────────────┘

QA AGENT
  │
  │  Completes review & assessments
  │
  ▼
┌────────────────────────────────────┐
│  QA Agent Permitted Updates        │
│                                    │
│  Can ONLY edit:                    │
│  • QA Results section              │
│                                    │
│  Within QA Results:                │
│  ├─ Risk Assessment Summary        │
│  │   Link + brief summary          │
│  │                                 │
│  ├─ Test Design Summary            │
│  │   Link + brief summary          │
│  │                                 │
│  ├─ Requirements Traceability      │
│  │   Link + coverage %             │
│  │                                 │
│  ├─ NFR Assessment Summary         │
│  │   Link + pass/fail              │
│  │                                 │
│  └─ Quality Gate Decision          │
│      Link to gate file             │
│      Decision: PASS/CONCERNS/FAIL  │
└────────────────────────────────────┘
  │
  │  FORBIDDEN: QA cannot edit
  │  • Overview
  │  • Requirements
  │  • Acceptance Criteria
  │  • Technical Context
  │  • Tasks
  │  • Dev Agent Record
  │
  ▼
┌────────────────────────────────────┐
│  Update Process                    │
│                                    │
│  1. Read current story file        │
│  2. Locate QA Results section      │
│  3. Populate with assessment links │
│  4. Add gate decision              │
│  5. Preserve all other sections    │
│  6. Write updated story            │
│  7. Commit to version control      │
└────────────────────────────────────┘
  │
  ▼
STORY UPDATED
QA Results section populated
Other sections unchanged
```

---

## Validation & Quality Gates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Validation & Quality Gate Process                         │
└─────────────────────────────────────────────────────────────────────────────┘

                      VALIDATION CHECKPOINTS
                      ─────────────────────

1. DRAFT VALIDATION (SM)
   │
   │  After story draft creation
   │  Checklist: story-draft-checklist.md
   │
   │  Validates:
   │  • AC are clear & testable
   │  • Tasks are specific & complete
   │  • Tech context is sufficient
   │  • No ambiguities present
   │
   │  Outcome: PASS | FAIL
   │  If FAIL: SM revises story
   │
   ▼

2. PRD VALIDATION (PO)
   │
   │  After PRD creation
   │  Checklist: pm-checklist.md
   │
   │  Validates:
   │  • Requirements are complete
   │  • Epics are well-defined
   │  • Stories are actionable
   │  • Success metrics defined
   │
   │  Outcome: PASS | CHANGES_NEEDED | REJECTED
   │
   ▼

3. ARCHITECTURE VALIDATION (PO)
   │
   │  After architecture creation
   │  Checklist: architect-checklist.md
   │
   │  Validates:
   │  • Tech stack justified
   │  • Scalability addressed
   │  • Security considered
   │  • APIs well-defined
   │
   │  Outcome: PASS | CHANGES_NEEDED | REJECTED
   │
   ▼

4. MASTER VALIDATION (PO)
   │
   │  After all planning artifacts complete
   │  Checklist: po-master-checklist.md
   │
   │  Validates:
   │  • Cohesion across artifacts
   │  • PRD ↔ Architecture alignment
   │  • Completeness of planning
   │  • Ready for development
   │
   │  Outcome: PASS | CHANGES_NEEDED
   │  If PASS: Approve for sharding & dev
   │
   ▼

5. DEFINITION OF DONE (Dev)
   │
   │  After story implementation
   │  Checklist: story-dod-checklist.md
   │
   │  Validates:
   │  • All tasks complete
   │  • Tests written & passing
   │  • Code meets standards
   │  • Documentation updated
   │  • No regressions
   │
   │  Outcome: PASS | FAIL
   │  If PASS: Set status to review
   │
   ▼

6. QUALITY GATE (QA)
   │
   │  After comprehensive QA review
   │  Multiple assessments
   │
   │  Inputs:
   │  • Risk assessment
   │  • Test design
   │  • Requirements trace
   │  • NFR assessment
   │  • Code review
   │
   │  Gate Decision: PASS | CONCERNS | FAIL | WAIVED
   │
   │  • PASS: Story meets all quality standards
   │  • CONCERNS: Issues noted but not blocking
   │  • FAIL: Must address issues before proceeding
   │  • WAIVED: Issues acknowledged, proceed anyway
   │
   │  Output: Quality gate YAML file
   │
   ▼

END OF VALIDATION CHAIN
Story complete or needs rework
```

---

## Sharding & Transformation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Document Sharding Process                              │
└─────────────────────────────────────────────────────────────────────────────┘

INPUT: Monolithic PRD
File: docs/prd.md
Size: ~500-2000 lines
Structure:
  • Overview
  • Goals
  • Target Users
  • Epic 1
    └─ Stories 1.1, 1.2, 1.3
  • Epic 2
    └─ Stories 2.1, 2.2
  • Epic 3
    └─ Stories 3.1, 3.2, 3.3
  • Success Metrics
  • Constraints
  • Risks

AGENT: PO (or PM)
TASK: shard-doc.md
COMMAND: *shard-prd

PROCESS:
  │
  │  1. Parse monolithic document
  │     Identify structure
  │     Extract metadata
  │
  ▼
┌────────────────────────────────────┐
│  Parsing Strategy                  │
│                                    │
│  Identify:                         │
│  • Epic markers (## Epic N)        │
│  • Story markers (### Story N.M)   │
│  • Section boundaries              │
│  • Cross-references                │
└────────────────────────────────────┘
  │
  │  2. Extract global sections
  │     (Overview, Goals, etc.)
  │
  ▼
┌────────────────────────────────────┐
│  Create Index File                 │
│                                    │
│  File: docs/prd/index.md           │
│                                    │
│  Content:                          │
│    # Product Requirements Document │
│                                    │
│    ## Overview                     │
│    [Global overview]               │
│                                    │
│    ## Goals                        │
│    [Global goals]                  │
│                                    │
│    ## Epics                        │
│    1. [Epic 1 - Link to epic-1-*]  │
│    2. [Epic 2 - Link to epic-2-*]  │
│    3. [Epic 3 - Link to epic-3-*]  │
│                                    │
│    ## Success Metrics              │
│    [Metrics]                       │
└────────────────────────────────────┘
  │
  │  3. For each epic
  │
  ▼
┌────────────────────────────────────┐
│  Create Epic Overview File         │
│                                    │
│  File: docs/prd/epic-1-overview.md │
│                                    │
│  Content:                          │
│    # Epic 1: [Title]               │
│                                    │
│    ## Description                  │
│    [Epic description]              │
│                                    │
│    ## Goals                        │
│    [Epic-specific goals]           │
│                                    │
│    ## Dependencies                 │
│    [Other epics this depends on]   │
│                                    │
│    ## Stories                      │
│    Link to: epic-1-stories.md      │
└────────────────────────────────────┘
  │
  ▼
┌────────────────────────────────────┐
│  Create Epic Stories File          │
│                                    │
│  File: docs/prd/epic-1-stories.md  │
│                                    │
│  Content:                          │
│    # Epic 1: Stories               │
│                                    │
│    ## Story 1.1: [Title]           │
│    ### Description                 │
│    [Story description]             │
│                                    │
│    ### Acceptance Criteria         │
│    - AC 1                          │
│    - AC 2                          │
│                                    │
│    ## Story 1.2: [Title]           │
│    [...]                           │
└────────────────────────────────────┘
  │
  │  Repeat for all epics
  │
  ▼
┌────────────────────────────────────┐
│  Update core-config.yaml           │
│                                    │
│  prd:                              │
│    prdFile: docs/prd.md            │
│    prdVersion: v4                  │
│    prdSharded: true          ← Set │
│    prdShardedLocation: docs/prd/ ←Set│
│    epicFilePattern: epic-{n}*.md   │
└────────────────────────────────────┘
  │
  ▼
OUTPUT: Sharded PRD
Directory: docs/prd/
Files:
  ├─ index.md (navigation & overview)
  ├─ epic-1-overview.md
  ├─ epic-1-stories.md
  ├─ epic-2-overview.md
  ├─ epic-2-stories.md
  ├─ epic-3-overview.md
  └─ epic-3-stories.md

BENEFITS:
• Smaller, more manageable files
• Easier for SM to extract story context
• Better version control (granular changes)
• Parallel work possible (multiple stories)
• Reduced context window usage


ARCHITECTURE SHARDING:
Similar process for architecture.md → docs/architecture/
Output files:
  ├─ index.md
  ├─ tech-stack.md
  ├─ coding-standards.md
  ├─ source-tree.md
  ├─ data-models.md
  ├─ database-schema.md
  ├─ backend-architecture.md
  ├─ frontend-architecture.md
  ├─ rest-api-spec.md
  └─ core-workflows.md
```

---

## Version Control Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Version Control Integration                             │
└─────────────────────────────────────────────────────────────────────────────┘

ARTIFACT CREATION:

┌────────────────────────────────────┐
│  Agent creates artifact            │
│  File: docs/prd.md                 │
└───────────────┬────────────────────┘
                │
                │  Artifact written
                │
                ▼
┌────────────────────────────────────┐
│  Git Add                           │
│                                    │
│  $ git add docs/prd.md             │
└───────────────┬────────────────────┘
                │
                │  File staged
                │
                ▼
┌────────────────────────────────────┐
│  Git Commit                        │
│                                    │
│  $ git commit -m "Add PRD v4"      │
│                                    │
│  Commit message:                   │
│  • Action (Add/Update/etc.)        │
│  • Artifact type (PRD/Story/etc.)  │
│  • Version/ID                      │
└───────────────┬────────────────────┘
                │
                │  Committed
                │
                ▼
         Git History


ARTIFACT UPDATE:

┌────────────────────────────────────┐
│  Agent updates artifact            │
│  File: docs/stories/1.1.auth.md    │
│  Section: Dev Agent Record         │
└───────────────┬────────────────────┘
                │
                │  Section updated
                │
                ▼
┌────────────────────────────────────┐
│  Git Diff                          │
│                                    │
│  $ git diff docs/stories/1.1.*.md  │
│                                    │
│  Shows:                            │
│  • Which section changed           │
│  • Exact changes made              │
│  • Who made them (agent)           │
└───────────────┬────────────────────┘
                │
                │  Changes visible
                │
                ▼
┌────────────────────────────────────┐
│  Git Commit                        │
│                                    │
│  $ git commit -m "Update story 1.1 │
│     Dev Record - tasks complete"   │
└───────────────┬────────────────────┘
                │
                │  Committed
                │
                ▼
         Git History


BENEFITS:

• Full audit trail of all changes
• Blame: see which agent modified what
• History: track artifact evolution
• Revert: undo problematic changes
• Branch: parallel development
• Merge: integrate changes
• Diff: compare versions
```

---

## Artifact Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Artifact Relationship Graph                         │
└─────────────────────────────────────────────────────────────────────────────┘

PROJECT BRIEF
      │
      │  Informs
      │
      ▼
     PRD ────────────────────────────────┐
      │                                  │
      │  Drives                          │  Informs
      │                                  │
      ├──────────────────┐               │
      │                  │               │
      ▼                  ▼               ▼
ARCHITECTURE      FRONT-END SPEC    MARKET RESEARCH
      │                  │
      │  Defines         │  Specifies
      │  Tech Stack      │  UI Components
      │                  │
      └──────────┬───────┘
                 │
                 │  Both inform
                 │
                 ▼
            EPIC FILES ← (Sharded from PRD)
                 │
                 │  SM extracts
                 │
                 ▼
            STORY FILES
                 │
                 ├────────────────┬────────────────┐
                 │                │                │
                 │  Read by       │  Updated by    │  Reviewed by
                 │                │                │
                 ▼                ▼                ▼
            SOURCE CODE      TESTS         QA ASSESSMENTS
                 │                              │
                 │                              │
                 └──────────────┬───────────────┘
                                │
                                │  Inform
                                │
                                ▼
                          QUALITY GATE


DEPENDENCY RELATIONSHIPS:

project-brief.md
  └─ REQUIRED BY: prd.md

prd.md
  ├─ REQUIRED BY: architecture.md
  ├─ REQUIRED BY: front-end-spec.md
  └─ TRANSFORMS TO: prd/*.md (sharded)

architecture.md
  ├─ REQUIRED BY: stories/*.md (tech context)
  └─ TRANSFORMS TO: architecture/*.md (sharded)

prd/*.md (sharded)
  └─ REQUIRED BY: stories/*.md (requirements)

story file (1.1.*.md)
  ├─ REQUIRED BY: source code implementation
  ├─ REQUIRED BY: tests
  ├─ REQUIRED BY: qa assessments
  └─ UPDATED BY: Dev (Dev Record), QA (QA Results)

qa assessments (*-risk-*.md, *-test-*.md, etc.)
  └─ AGGREGATED INTO: qa gate (*.yml)

qa gate (*.yml)
  └─ REFERENCED BY: story QA Results section


CROSS-REFERENCE PATTERNS:

Story → Epic:
  "This story implements Epic 1, Story 1"
  Link: [Epic 1](../prd/epic-1-stories.md#story-11)

Story → Architecture:
  "Technical context from:"
  Links:
    - [Backend Architecture](../architecture/backend-architecture.md#auth)
    - [Database Schema](../architecture/database-schema.md#users)

Story → QA Assessments:
  "QA Results:"
  Links:
    - [Risk Assessment](../qa/assessments/1.1-risk-20251013.md)
    - [Test Design](../qa/assessments/1.1-test-design-20251013.md)
    - [Requirements Trace](../qa/assessments/1.1-trace-20251013.md)
    - [NFR Assessment](../qa/assessments/1.1-nfr-20251013.md)
    - [Quality Gate](../qa/gates/1.1-user-authentication.yml)
```

---

## Summary

The BMad artifact lifecycle is characterized by:

1. **Template-Driven Creation**: Consistent structure from YAML schemas
2. **Section-Based Permissions**: Fine-grained edit control
3. **State Tracking**: Clear status indicators throughout lifecycle
4. **Validation Gates**: Quality checkpoints at key transitions
5. **File-Based Persistence**: Version-controlled, human-readable
6. **Agent Handoffs**: Clear ownership and responsibility boundaries
7. **Transformation Support**: Sharding for scalability
8. **Immutable History**: Full audit trail in version control

This lifecycle model ensures artifact quality, traceability, and collaborative workflows suitable for AI-driven development processes.

---

**Status**: Complete
**Phase 1 Tasks**: All complete
**Next Phase**: Phase 2 - Agent-by-Agent Deep Dive
