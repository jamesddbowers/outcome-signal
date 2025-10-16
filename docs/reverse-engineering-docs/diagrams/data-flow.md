# BMad Framework Data Flow Patterns

**Document Version**: 1.0
**Last Updated**: 2025-10-13
**Status**: Complete

## Table of Contents

1. [Overview](#overview)
2. [Planning Phase Data Flow](#planning-phase-data-flow)
3. [Development Phase Data Flow](#development-phase-data-flow)
4. [Agent-to-Agent Data Handoffs](#agent-to-agent-data-handoffs)
5. [Configuration Data Flow](#configuration-data-flow)
6. [Template Data Flow](#template-data-flow)
7. [Validation Data Flow](#validation-data-flow)
8. [Story Lifecycle Data Flow](#story-lifecycle-data-flow)
9. [QA Assessment Data Flow](#qa-assessment-data-flow)
10. [Cross-Phase Data Flow](#cross-phase-data-flow)

---

## Overview

This document maps all data flows within the BMad framework, showing how information moves between users, agents, tasks, templates, and artifacts. The framework uses a **file-based data flow model** where all persistent data is stored as version-controlled markdown and YAML files.

### Key Data Flow Characteristics

| Aspect | Implementation | Benefits |
|--------|----------------|----------|
| **Persistence** | File-based (markdown, YAML) | Version control, audit trail, human-readable |
| **State Management** | Stateless agents, file-based state | No session state, idempotent operations |
| **Data Transfer** | Agent → File → Agent | Clear handoff points, asynchronous collaboration |
| **Validation** | Checklist-driven | Consistent quality gates, repeatable |
| **Configuration** | Project-root YAML | Environment-specific, flexible |

---

## Planning Phase Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Planning Phase Data Flow                             │
│                            (Web UI Mode)                                     │
└─────────────────────────────────────────────────────────────────────────────┘

USER
 │
 │  1. Initial requirements
 │     • Project idea
 │     • Goals & objectives
 │     • Constraints
 │
 ▼
┌──────────────────────┐
│ 📊 ANALYST (Mary)    │
│                      │
│ Input:               │
│  • User requirements │
│  • Brainstorming     │
│  • Market research   │
│                      │
│ Process:             │
│  • Facilitate        │
│    brainstorming     │
│  • Research market   │
│  • Analyze           │
│    competitors       │
│                      │
│ Output:              │
│  • project-brief.md  │
│  • research.md       │
│  • competitors.md    │
└──────┬───────────────┘
       │
       │  Handoff: project-brief.md
       │  Location: docs/project-brief.md
       │  Contents:
       │    • Problem statement
       │    • Target audience
       │    • Success metrics
       │    • Constraints
       │
       ▼
┌──────────────────────┐
│ 📋 PM (John)         │
│                      │
│ Input:               │
│  • project-brief.md  │
│  • User feedback     │
│                      │
│ Process:             │
│  • Load brief        │
│  • Elicit            │
│    requirements      │
│  • Define features   │
│  • Create epics      │
│                      │
│ Output:              │
│  • prd.md (v4)       │
│    └─ Epics          │
│    └─ Stories        │
│    └─ Requirements   │
└──────┬───────────────┘
       │
       ├──────────────────────────────┐
       │                              │
       │  Handoff: prd.md             │  Handoff: prd.md
       │  Location: docs/prd.md       │  Location: docs/prd.md
       │                              │
       ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│ 🎨 UX EXPERT (Sally) │      │ 🏛️ ARCHITECT         │
│                      │      │    (Winston)         │
│ Input:               │      │                      │
│  • prd.md            │      │ Input:               │
│  • User preferences  │      │  • prd.md            │
│                      │      │  • technical-        │
│ Process:             │      │    preferences.md    │
│  • Design UI/UX      │      │                      │
│  • Define components │      │ Process:             │
│  • Create wireframes │      │  • Design system     │
│  • AI prompt gen     │      │    architecture      │
│                      │      │  • Select tech stack │
│ Output:              │      │  • Define APIs       │
│  • front-end-spec.md │      │  • Plan infra        │
│  • front-end-        │      │                      │
│    architecture.md   │      │ Output:              │
└──────┬───────────────┘      │  • fullstack-        │
       │                      │    architecture.md   │
       │                      │  • architecture.md   │
       │                      └──────┬───────────────┘
       │                             │
       │  Handoff: UI specs          │  Handoff: Architecture
       │  Location: docs/             │  Location: docs/
       │  • front-end-spec.md        │  • architecture.md
       │  • front-end-arch.md        │  • fullstack-arch.md
       │                             │
       └──────────────┬──────────────┘
                      │
                      │  All planning artifacts
                      │
                      ▼
              ┌──────────────────────┐
              │ 📝 PO (Sarah)        │
              │                      │
              │ Input:               │
              │  • project-brief.md  │
              │  • prd.md            │
              │  • architecture.md   │
              │  • front-end-spec.md │
              │                      │
              │ Process:             │
              │  • Execute master    │
              │    checklist         │
              │  • Validate cohesion │
              │  • Check consistency │
              │  • Approve for dev   │
              │                      │
              │ Output:              │
              │  • Validation report │
              │  • Approval/Changes  │
              └──────┬───────────────┘
                     │
                     │  IF approved
                     │
                     ▼
              ┌──────────────────────┐
              │  DOCUMENT SHARDING   │
              │  (PO or PM)          │
              │                      │
              │ Input:               │
              │  • prd.md (v4)       │
              │  • architecture.md   │
              │                      │
              │ Process:             │
              │  • Parse documents   │
              │  • Extract epics     │
              │  • Split architecture│
              │  • Create index      │
              │                      │
              │ Output:              │
              │  • docs/prd/         │
              │    ├─ index.md       │
              │    ├─ epic-1-*.md    │
              │    └─ epic-2-*.md    │
              │  • docs/architecture/│
              │    ├─ index.md       │
              │    ├─ tech-stack.md  │
              │    ├─ backend-*.md   │
              │    └─ frontend-*.md  │
              └──────┬───────────────┘
                     │
                     │  Sharded documents ready
                     │
                     ▼
              ┌──────────────────────┐
              │ TRANSITION TO IDE    │
              │                      │
              │ Artifacts:           │
              │  • docs/prd/         │
              │  • docs/architecture/│
              │  • core-config.yaml  │
              └──────────────────────┘
```

---

## Development Phase Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Development Phase Data Flow                           │
│                              (IDE Mode)                                      │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────┐
                    │  Sharded Planning    │
                    │  Artifacts           │
                    │                      │
                    │  • docs/prd/         │
                    │  • docs/architecture/│
                    │  • core-config.yaml  │
                    └──────┬───────────────┘
                           │
                           │  Read for context
                           │
                           ▼
                    ┌──────────────────────┐
                    │ 📖 SM (Bob)          │
                    │                      │
                    │ Input:               │
                    │  • docs/prd/epic-*.md│
                    │  • docs/architecture/│
                    │  • core-config.yaml  │
                    │                      │
                    │ Process:             │
                    │  • Load core config  │
                    │  • Identify next epic│
                    │  • Extract story reqs│
                    │  • Extract arch ctx  │
                    │  • Populate template │
                    │  • Run draft checklist│
                    │                      │
                    │ Output:              │
                    │  • docs/stories/     │
                    │    1.1.title.md      │
                    │                      │
                    │  Story sections:     │
                    │   • Overview         │
                    │   • Requirements     │
                    │   • Acceptance       │
                    │     Criteria         │
                    │   • Tech Context     │
                    │   • Tasks            │
                    │   • Dev Agent Record │
                    │   • QA Results       │
                    └──────┬───────────────┘
                           │
                           │  Handoff: story file
                           │  Location: docs/stories/1.1.title.md
                           │  Status: draft
                           │
                           ▼
                    ┌──────────────────────┐
                    │ 👨‍💻 DEV (James)     │
                    │                      │
                    │ Input:               │
                    │  • docs/stories/     │
                    │    1.1.title.md      │
                    │  • devLoadAlwaysFiles│
                    │    (from config)     │
                    │    ├─ coding-        │
                    │    │  standards.md   │
                    │    ├─ tech-stack.md  │
                    │    └─ source-tree.md │
                    │                      │
                    │ Process:             │
                    │  • Read story        │
                    │  • Implement tasks   │
                    │  • Write tests       │
                    │  • Run tests         │
                    │  • Update Dev Record │
                    │  • Execute DoD       │
                    │    checklist         │
                    │                      │
                    │ Output:              │
                    │  • Source code       │
                    │  • Tests             │
                    │  • Updated story:    │
                    │    └─ Dev Agent      │
                    │       Record section │
                    │       • Tasks [x]    │
                    │       • Debug log    │
                    │       • Files changed│
                    │       • Status: review│
                    └──────┬───────────────┘
                           │
                           │  Handoff: story + code
                           │  Location: docs/stories/1.1.title.md
                           │  Status: review
                           │  Code: src/**/*
                           │
                           ▼
                    ┌──────────────────────┐
                    │ 🧪 QA (Quinn)        │
                    │                      │
                    │ Input:               │
                    │  • docs/stories/     │
                    │    1.1.title.md      │
                    │  • Source code       │
                    │  • Tests             │
                    │  • docs/prd/epic-*.md│
                    │                      │
                    │ Process:             │
                    │  • Risk profiling    │
                    │  • Test design       │
                    │  • Requirements trace│
                    │  • NFR assessment    │
                    │  • Story review      │
                    │  • Gate decision     │
                    │                      │
                    │ Output:              │
                    │  • docs/qa/          │
                    │    assessments/      │
                    │    ├─ 1.1-risk-      │
                    │    │  YYYYMMDD.md    │
                    │    ├─ 1.1-test-      │
                    │    │  design-        │
                    │    │  YYYYMMDD.md    │
                    │    ├─ 1.1-trace-     │
                    │    │  YYYYMMDD.md    │
                    │    └─ 1.1-nfr-       │
                    │       YYYYMMDD.md    │
                    │  • docs/qa/gates/    │
                    │    1.1-title.yml     │
                    │  • Updated story:    │
                    │    └─ QA Results     │
                    │       section        │
                    └──────┬───────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              │            │            │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
        │   PASS    │ │CONCERNS│ │   FAIL    │
        │           │ │        │ │           │
        │  Gate:    │ │ Gate:  │ │  Gate:    │
        │  status:  │ │ status:│ │  status:  │
        │  PASS     │ │CONCERNS│ │  FAIL     │
        └─────┬─────┘ └───┬────┘ └─────┬─────┘
              │           │            │
              │           │            │
              │           │            │  Back to Dev
              │           │            │  with feedback
              │           │            └──────┐
              │           │                   │
              │           │                   ▼
              │           │            ┌──────────────┐
              │           │            │ 👨‍💻 DEV     │
              │           │            │              │
              │           │            │ Apply fixes  │
              │           │            │ Re-test      │
              │           │            │ Resubmit     │
              │           │            └──────┬───────┘
              │           │                   │
              │           │                   │ Retry
              │           │                   │
              │           └───────────────────┘
              │
              │  Story complete
              │  Status: done
              │
              ▼
       ┌────────────────┐
       │  Next Story    │
       │  (SM drafts)   │
       └────────────────┘
```

---

## Agent-to-Agent Data Handoffs

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Agent-to-Agent Data Handoffs                          │
└─────────────────────────────────────────────────────────────────────────────┘

HANDOFF PATTERN:

    Agent A                File System            Agent B
       │                        │                     │
       │  1. Create artifact    │                     │
       ├───────────────────────►│                     │
       │                        │                     │
       │  2. Write to location  │                     │
       │     (per core-config)  │                     │
       │                        │                     │
       │  3. Notify user        │                     │
       │     "Artifact ready"   │                     │
       │                        │                     │
       │                        │  4. Load artifact   │
       │                        │◄────────────────────┤
       │                        │                     │
       │                        │  5. Read content    │
       │                        │─────────────────────►
       │                        │                     │
       │                        │  6. Process & update│
       │                        │◄────────────────────┤
       │                        │                     │
       │                        │  7. Write updates   │
       │                        │     (if permitted)  │
       │                        │                     │


COMMON HANDOFFS:

1. Analyst → PM
   ─────────────
   File: docs/project-brief.md
   Data:
     • Problem statement
     • Target users
     • Success metrics
     • Constraints
     • Market insights
   Next: PM creates PRD

2. PM → UX Expert
   ──────────────
   File: docs/prd.md
   Data:
     • Features & requirements
     • User stories
     • Business goals
   Next: UX creates UI specs

3. PM → Architect
   ──────────────
   File: docs/prd.md
   Data:
     • Functional requirements
     • Scale expectations
     • Integration needs
   Next: Architect designs system

4. UX Expert → Architect
   ─────────────────────
   File: docs/front-end-spec.md
   Data:
     • UI components
     • User flows
     • Front-end requirements
   Next: Architect integrates UI into fullstack design

5. All Planning Agents → PO
   ─────────────────────────
   Files:
     • docs/project-brief.md
     • docs/prd.md
     • docs/architecture.md
     • docs/front-end-spec.md
   Data: Complete planning artifacts
   Next: PO validates cohesion

6. PO → SM
   ───────
   Files:
     • docs/prd/ (sharded)
     • docs/architecture/ (sharded)
   Data:
     • Epic files
     • Story requirements
     • Architecture sections
   Next: SM drafts stories

7. SM → Dev
   ─────────
   File: docs/stories/{epic}.{story}.{title}.md
   Data:
     • Story overview
     • Requirements
     • Acceptance criteria
     • Technical context
     • Tasks
   Next: Dev implements

8. Dev → QA
   ─────────
   Files:
     • docs/stories/{epic}.{story}.{title}.md (updated)
     • Source code
     • Tests
   Data:
     • Implemented code
     • Tests
     • Dev notes
     • Status: review
   Next: QA assesses quality

9. QA → Dev (if issues)
   ────────────────────
   Files:
     • docs/qa/assessments/*
     • docs/stories/{epic}.{story}.{title}.md (QA Results)
   Data:
     • Risk assessment
     • Test gaps
     • NFR concerns
     • Refactoring suggestions
   Next: Dev applies fixes
```

---

## Configuration Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Configuration Data Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

                    .bmad-core/core-config.yaml
                         (Default Config)
                                │
                                │  Copied to project
                                │  at installation
                                │
                                ▼
                      core-config.yaml
                      (Project Root)
                                │
                                │  Customized for project
                                │  • File locations
                                │  • Sharding strategy
                                │  • Template versions
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐           ┌─────────┐           ┌─────────┐
   │  AGENT  │           │  AGENT  │           │  AGENT  │
   │    A    │           │    B    │           │    N    │
   └────┬────┘           └────┬────┘           └────┬────┘
        │                     │                     │
        │  Load at activation │                     │
        │  Read settings:     │                     │
        │                     │                     │
        ├─ prd.prdLocation ───┼─────────────────────┤
        ├─ prd.prdSharded ────┼─────────────────────┤
        ├─ architecture.* ────┼─────────────────────┤
        ├─ devStoryLocation ──┼─────────────────────┤
        ├─ qa.qaLocation ─────┼─────────────────────┤
        └─ devLoadAlwaysFiles ┼─────────────────────┘
                              │
                              │  Agents use config to:
                              │  • Resolve file paths
                              │  • Determine sharding
                              │  • Load required docs
                              │  • Write outputs
                              │
                              ▼
                    ┌───────────────────┐
                    │  File System      │
                    │  Operations       │
                    │                   │
                    │  Read:            │
                    │  • docs/prd/      │
                    │  • docs/arch/     │
                    │                   │
                    │  Write:           │
                    │  • docs/stories/  │
                    │  • docs/qa/       │
                    └───────────────────┘


CONFIGURATION FIELDS USED BY AGENTS:

┌────────────┬──────────────────────────┬───────────────────────────┐
│ Agent      │ Config Fields Read       │ Purpose                   │
├────────────┼──────────────────────────┼───────────────────────────┤
│ Analyst    │ prd.prdFile              │ Write PRD location        │
├────────────┼──────────────────────────┼───────────────────────────┤
│ PM         │ prd.*                    │ PRD creation & sharding   │
│            │ architecture.*           │                           │
├────────────┼──────────────────────────┼───────────────────────────┤
│ UX Expert  │ prd.prdFile              │ Read PRD                  │
│            │ architecture.*           │ Write UI specs            │
├────────────┼──────────────────────────┼───────────────────────────┤
│ Architect  │ prd.prdFile              │ Read PRD                  │
│            │ architecture.*           │ Write architecture        │
├────────────┼──────────────────────────┼───────────────────────────┤
│ PO         │ All fields               │ Validation & sharding     │
├────────────┼──────────────────────────┼───────────────────────────┤
│ SM         │ prd.prdSharded           │ Read epics                │
│            │ prd.prdShardedLocation   │                           │
│            │ architecture.*           │ Read architecture         │
│            │ devStoryLocation         │ Write stories             │
├────────────┼──────────────────────────┼───────────────────────────┤
│ Dev        │ devStoryLocation         │ Read/update stories       │
│            │ devLoadAlwaysFiles       │ Load standards            │
│            │ devDebugLog              │ Write debug log           │
├────────────┼──────────────────────────┼───────────────────────────┤
│ QA         │ devStoryLocation         │ Read stories              │
│            │ qa.qaLocation            │ Write assessments & gates │
│            │ prd.prdShardedLocation   │ Read requirements         │
└────────────┴──────────────────────────┴───────────────────────────┘
```

---

## Template Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Template Processing Data Flow                      │
└─────────────────────────────────────────────────────────────────────────────┘

USER
 │
 │  Command: *create-prd
 │
 ▼
AGENT (PM)
 │
 │  Resolve command → task: create-doc.md
 │                  → template: prd-tmpl.yaml
 │
 ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOAD TEMPLATE                                                  │
│                                                                 │
│  .bmad-core/templates/prd-tmpl.yaml                            │
│                                                                 │
│  YAML Structure:                                               │
│    template:                                                   │
│      id: prd-template-v4                                       │
│      name: Product Requirements Document                       │
│      outputFormat: markdown                                    │
│      mode: interactive | yolo                                  │
│      sections:                                                 │
│        - id: overview                                          │
│          type: text                                            │
│          elicit: true                                          │
│          instruction: "Describe product vision"                │
│        - id: epics                                             │
│          type: list                                            │
│          elicit: true                                          │
│          subsections:                                          │
│            - id: stories                                       │
│              type: list                                        │
└─────────────────────────────────────────────────────────────────┘
 │
 │  Template parsed
 │
 ▼
┌─────────────────────────────────────────────────────────────────┐
│  ELICITATION ENGINE                                             │
│                                                                 │
│  FOR each section WHERE elicit=true:                           │
│                                                                 │
│    1. Display section title                                    │
│    2. Show instruction                                         │
│    3. Prompt user for content                                  │
│    4. Validate input                                           │
│    5. Store in data structure                                  │
│                                                                 │
│  IF mode=yolo:                                                 │
│    • Skip elicitation                                          │
│    • Auto-generate reasonable content                          │
│    • Minimal user interaction                                  │
│                                                                 │
│  Data Structure:                                               │
│    {                                                           │
│      "overview": "User-provided text...",                      │
│      "epics": [                                                │
│        {                                                       │
│          "title": "Epic 1",                                    │
│          "description": "...",                                 │
│          "stories": [...]                                      │
│        }                                                       │
│      ]                                                         │
│    }                                                           │
└─────────────────────────────────────────────────────────────────┘
 │
 │  Data collected
 │
 ▼
┌─────────────────────────────────────────────────────────────────┐
│  MARKDOWN GENERATOR                                             │
│                                                                 │
│  Process:                                                       │
│    1. Load markdown template structure                         │
│    2. Populate sections with data                              │
│    3. Apply formatting rules                                   │
│    4. Add section markers (for permissions)                    │
│    5. Include metadata (YAML front matter)                     │
│                                                                 │
│  Output:                                                       │
│    ---                                                         │
│    template: prd-template-v4                                   │
│    created: 2025-10-13                                         │
│    author: PM                                                  │
│    ---                                                         │
│                                                                 │
│    # Product Requirements Document                             │
│                                                                 │
│    ## Overview                                                 │
│    [User-provided content]                                     │
│                                                                 │
│    ## Epics                                                    │
│    ### Epic 1: [Title]                                         │
│    [Description]                                               │
│                                                                 │
│    #### Stories                                                │
│    - Story 1.1: [...]                                          │
│    - Story 1.2: [...]                                          │
└─────────────────────────────────────────────────────────────────┘
 │
 │  Artifact generated
 │
 ▼
┌─────────────────────────────────────────────────────────────────┐
│  FILE WRITER                                                    │
│                                                                 │
│  1. Read core-config.yaml for output location                  │
│     → prd.prdFile = "docs/prd.md"                              │
│                                                                 │
│  2. Create directories if needed                               │
│     → mkdir -p docs/                                           │
│                                                                 │
│  3. Write artifact to file                                     │
│     → write docs/prd.md                                        │
│                                                                 │
│  4. Set file permissions (OS level)                            │
│                                                                 │
│  5. Report to user                                             │
│     "PRD created at docs/prd.md"                               │
└─────────────────────────────────────────────────────────────────┘
 │
 │  Artifact persisted
 │
 ▼
docs/prd.md
(Ready for next agent)
```

---

## Validation Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Validation Data Flow                                │
└─────────────────────────────────────────────────────────────────────────────┘

AGENT (PO, SM, Dev, QA)
 │
 │  Command: *execute-checklist {checklist-name}
 │
 ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOAD CHECKLIST                                                 │
│                                                                 │
│  .bmad-core/checklists/{checklist-name}.md                     │
│                                                                 │
│  Structure:                                                    │
│    # Checklist Name                                            │
│                                                                 │
│    ## Category 1                                               │
│    - [ ] Check item 1                                          │
│      - Criterion: [description]                                │
│      - Expected: [what should be true]                         │
│    - [ ] Check item 2                                          │
│                                                                 │
│    ## Category 2                                               │
│    - [ ] Check item 3                                          │
└─────────────────────────────────────────────────────────────────┘
 │
 │  Checklist loaded
 │
 ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOAD ARTIFACT TO VALIDATE                                      │
│                                                                 │
│  Example: docs/prd.md                                          │
│           docs/stories/1.1.title.md                            │
│           Source code                                           │
└─────────────────────────────────────────────────────────────────┘
 │
 │  Artifact loaded
 │
 ▼
┌─────────────────────────────────────────────────────────────────┐
│  VALIDATION ENGINE                                              │
│                                                                 │
│  FOR each checklist item:                                      │
│    1. Read criterion                                           │
│    2. Analyze artifact against criterion                       │
│    3. Determine: PASS | FAIL | PARTIAL                         │
│    4. Generate explanation                                     │
│    5. Suggest remediation if FAIL                              │
│                                                                 │
│  Validation Results:                                           │
│    {                                                           │
│      "checklist": "po-master-checklist",                       │
│      "artifact": "docs/prd.md",                                │
│      "items": [                                                │
│        {                                                       │
│          "item": "Check item 1",                               │
│          "status": "PASS",                                     │
│          "notes": "..."                                        │
│        },                                                      │
│        {                                                       │
│          "item": "Check item 2",                               │
│          "status": "FAIL",                                     │
│          "notes": "...",                                       │
│          "suggestion": "..."                                   │
│        }                                                       │
│      ],                                                        │
│      "overall": "PASS | CONCERNS | FAIL"                       │
│    }                                                           │
└─────────────────────────────────────────────────────────────────┘
 │
 │  Validation complete
 │
 ▼
┌─────────────────────────────────────────────────────────────────┐
│  REPORT GENERATOR                                               │
│                                                                 │
│  Generate validation report:                                   │
│                                                                 │
│  # Validation Report                                           │
│  **Checklist**: po-master-checklist                            │
│  **Artifact**: docs/prd.md                                     │
│  **Date**: 2025-10-13                                          │
│                                                                 │
│  ## Results                                                    │
│  ✅ Check item 1: PASS                                         │
│     Notes: ...                                                 │
│                                                                 │
│  ❌ Check item 2: FAIL                                         │
│     Notes: ...                                                 │
│     Suggestion: ...                                            │
│                                                                 │
│  ## Overall: CONCERNS                                          │
│  Address failures before proceeding.                           │
└─────────────────────────────────────────────────────────────────┘
 │
 │  Report generated
 │
 ▼
OUTPUT TO USER
(Display in console/chat)

IF agent=QA AND checklist=review-story:
  │
  │  Create quality gate
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│  QUALITY GATE CREATION                                          │
│                                                                 │
│  .bmad-core/templates/qa-gate-tmpl.yaml                        │
│                                                                 │
│  Populate with validation results                              │
│                                                                 │
│  Output: docs/qa/gates/{epic}.{story}-{slug}.yml               │
│                                                                 │
│  gate_decision:                                                │
│    decision: PASS | CONCERNS | FAIL | WAIVED                   │
│    rationale: "Based on validation results..."                 │
│    date: 2025-10-13                                            │
│    created_by: qa-agent                                        │
│    concerns: [...]                                             │
│    blocking_issues: [...]                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Story Lifecycle Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Story Lifecycle Data Flow                            │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │  Epic File   │
                          │  (Sharded)   │
                          │              │
                          │ docs/prd/    │
                          │ epic-1-      │
                          │ stories.md   │
                          └──────┬───────┘
                                 │
                                 │  SM reads epic
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  SM: create-next-story│
                     │                       │
                     │  1. Identify next     │
                     │  2. Extract reqs      │
                     │  3. Extract arch ctx  │
                     │  4. Verify structure  │
                     │  5. Populate template │
                     │  6. Run draft check   │
                     └───────────┬───────────┘
                                 │
                                 │  Write story
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Story Created        │
                     │                       │
                     │  docs/stories/        │
                     │  1.1.title.md         │
                     │                       │
                     │  Status: draft        │
                     │                       │
                     │  Sections:            │
                     │  • Overview           │
                     │  • Requirements       │
                     │  • AC                 │
                     │  • Tech Context       │
                     │  • Tasks [ ][ ][ ]    │
                     │  • Dev Record (empty) │
                     │  • QA Results (empty) │
                     └───────────┬───────────┘
                                 │
                                 │  Optional: PO validates
                                 │  Status: approved
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Dev: implement       │
                     │                       │
                     │  1. Read story        │
                     │  2. Load dev files    │
                     │  3. Implement tasks   │
                     │  4. Write tests       │
                     │  5. Update Dev Record │
                     │  6. Run DoD checklist │
                     └───────────┬───────────┘
                                 │
                                 │  Update story
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Story Updated        │
                     │                       │
                     │  docs/stories/        │
                     │  1.1.title.md         │
                     │                       │
                     │  Status: review       │
                     │                       │
                     │  Changes:             │
                     │  • Tasks [x][x][x]    │
                     │  • Dev Record:        │
                     │    - Debug log        │
                     │    - Completion notes │
                     │    - Files changed    │
                     │    - Change log       │
                     └───────────┬───────────┘
                                 │
                                 │  Dev → QA handoff
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  QA: comprehensive    │
                     │       review          │
                     │                       │
                     │  1. Risk profile      │
                     │  2. Test design       │
                     │  3. Trace requirements│
                     │  4. NFR assessment    │
                     │  5. Story review      │
                     │  6. Gate decision     │
                     └───────────┬───────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              │                  │                  │
         ┌────▼────┐      ┌──────▼──────┐    ┌────▼────┐
         │  PASS   │      │  CONCERNS   │    │  FAIL   │
         │         │      │             │    │         │
         │  Gate:  │      │  Gate:      │    │  Gate:  │
         │  PASS   │      │  CONCERNS   │    │  FAIL   │
         └────┬────┘      └──────┬──────┘    └────┬────┘
              │                  │                 │
              │                  │                 │
              │                  │                 │  Back to Dev
              │                  │                 │
              │                  │          ┌──────▼──────┐
              │                  │          │  Dev: fixes │
              │                  │          │             │
              │                  │          │  Update code│
              │                  │          │  Re-test    │
              │                  │          │  Update     │
              │                  │          │  story      │
              │                  │          └──────┬──────┘
              │                  │                 │
              │                  │                 │  Retry QA
              │                  │                 │
              └──────────────────┴─────────────────┘
                                 │
                                 │  All assessments
                                 │  & gate created
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Story Complete       │
                     │                       │
                     │  docs/stories/        │
                     │  1.1.title.md         │
                     │                       │
                     │  Status: done         │
                     │                       │
                     │  Artifacts:           │
                     │  • Story (final)      │
                     │  • Source code        │
                     │  • Tests              │
                     │  • QA assessments (4) │
                     │  • QA gate (yml)      │
                     └───────────────────────┘

                              Next Story
                              (SM drafts)
```

---

## QA Assessment Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          QA Assessment Data Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌────────────────────┐
                        │  Story in Review   │
                        │                    │
                        │  docs/stories/     │
                        │  1.1.title.md      │
                        │                    │
                        │  Status: review    │
                        └──────────┬─────────┘
                                   │
                                   │  QA reads story
                                   │
                ┌──────────────────┴──────────────────┐
                │                                     │
                ▼                                     ▼
    ┌───────────────────────┐           ┌───────────────────────┐
    │  Load Requirements    │           │  Load Source Code     │
    │                       │           │                       │
    │  docs/prd/            │           │  src/**/*             │
    │  epic-1-stories.md    │           │  tests/**/*           │
    └───────────┬───────────┘           └───────────┬───────────┘
                │                                   │
                └──────────────┬────────────────────┘
                               │
                               │  Context loaded
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
   ┌───────────────────┐           ┌───────────────────┐
   │  RISK PROFILE     │           │  TEST DESIGN      │
   │                   │           │                   │
   │  • Identify risks │           │  • Design tests   │
   │  • Score (1-9)    │           │  • Prioritize     │
   │  • Mitigations    │           │    (P0/P1/P2)     │
   │                   │           │  • Coverage plan  │
   │  Output:          │           │                   │
   │  docs/qa/         │           │  Output:          │
   │  assessments/     │           │  docs/qa/         │
   │  1.1-risk-        │           │  assessments/     │
   │  YYYYMMDD.md      │           │  1.1-test-design- │
   │                   │           │  YYYYMMDD.md      │
   └───────────────────┘           └───────────────────┘
               │                               │
               └───────────────┬───────────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
   ┌───────────────────┐           ┌───────────────────┐
   │  TRACE REQS       │           │  NFR ASSESSMENT   │
   │                   │           │                   │
   │  • Map reqs to    │           │  • Security       │
   │    tests          │           │  • Performance    │
   │  • Given-When-    │           │  • Reliability    │
   │    Then           │           │  • Maintainability│
   │  • Gap analysis   │           │                   │
   │                   │           │  Output:          │
   │  Output:          │           │  docs/qa/         │
   │  docs/qa/         │           │  assessments/     │
   │  assessments/     │           │  1.1-nfr-         │
   │  1.1-trace-       │           │  YYYYMMDD.md      │
   │  YYYYMMDD.md      │           │                   │
   └───────────────────┘           └───────────────────┘
               │                               │
               └───────────────┬───────────────┘
                               │
                               │  All assessments done
                               │
                               ▼
                   ┌───────────────────────┐
                   │  STORY REVIEW         │
                   │                       │
                   │  • Aggregate results  │
                   │  • Active refactoring │
                   │  • Gate decision      │
                   │                       │
                   │  Decision:            │
                   │  PASS | CONCERNS |    │
                   │  FAIL | WAIVED        │
                   └───────────┬───────────┘
                               │
                               │  Write gate & update story
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
   ┌───────────────────┐           ┌───────────────────┐
   │  QUALITY GATE     │           │  UPDATE STORY     │
   │                   │           │                   │
   │  docs/qa/gates/   │           │  docs/stories/    │
   │  1.1-title.yml    │           │  1.1.title.md     │
   │                   │           │                   │
   │  gate_decision:   │           │  QA Results       │
   │    decision: PASS │           │  section updated  │
   │    rationale: ... │           │                   │
   │    date: ...      │           │  • Risk summary   │
   │    concerns: []   │           │  • Test summary   │
   │                   │           │  • Gate decision  │
   │                   │           │  • Assessment     │
   │                   │           │    links          │
   └───────────────────┘           └───────────────────┘
               │                               │
               └───────────────┬───────────────┘
                               │
                               │  QA complete
                               │
                               ▼
                     ┌──────────────────┐
                     │  QA Artifacts    │
                     │  (4 assessments  │
                     │   + 1 gate)      │
                     │                  │
                     │  Ready for next  │
                     │  step (or retry) │
                     └──────────────────┘
```

---

## Cross-Phase Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Cross-Phase Data Flow                                 │
│                 (Planning Phase → Development Phase)                         │
└─────────────────────────────────────────────────────────────────────────────┘

                        PLANNING PHASE (Web UI)
                        ───────────────────────

USER → Analyst → PM → UX/Architect → PO
        │        │          │          │
        │        │          │          │  Generate artifacts
        ▼        ▼          ▼          ▼
    ┌────────────────────────────────────┐
    │  Planning Artifacts                │
    │                                    │
    │  • docs/project-brief.md           │
    │  • docs/prd.md (v4)                │
    │  • docs/architecture.md (v4)       │
    │  • docs/front-end-spec.md          │
    │  • docs/market-research.md         │
    │  • docs/competitor-analysis.md     │
    └───────────────┬────────────────────┘
                    │
                    │  PO validates & shards
                    │
                    ▼
    ┌────────────────────────────────────┐
    │  Sharding Process                  │
    │                                    │
    │  PRD → docs/prd/                   │
    │    ├─ index.md                     │
    │    ├─ epic-1-overview.md           │
    │    ├─ epic-1-stories.md            │
    │    ├─ epic-2-overview.md           │
    │    └─ epic-2-stories.md            │
    │                                    │
    │  Architecture → docs/architecture/ │
    │    ├─ index.md                     │
    │    ├─ tech-stack.md                │
    │    ├─ coding-standards.md          │
    │    ├─ source-tree.md               │
    │    ├─ database-schema.md           │
    │    ├─ backend-architecture.md      │
    │    ├─ frontend-architecture.md     │
    │    └─ rest-api-spec.md             │
    └───────────────┬────────────────────┘
                    │
                    │  TRANSITION POINT
                    │
                    │  1. Copy artifacts to project
                    │  2. Commit to version control
                    │  3. Open project in IDE
                    │
                    ▼
    ┌────────────────────────────────────┐
    │  Project Repository                │
    │                                    │
    │  .bmad-core/         (framework)   │
    │  core-config.yaml    (config)      │
    │  docs/               (planning)    │
    │    ├─ prd/                         │
    │    └─ architecture/                │
    │  src/                (empty)       │
    │  tests/              (empty)       │
    └───────────────┬────────────────────┘
                    │
                    │  IDE opens project
                    │
                    ▼

                     DEVELOPMENT PHASE (IDE)
                     ───────────────────────

                ┌─────────────────────┐
                │  Development Agents │
                │  Activated          │
                │                     │
                │  • SM (Bob)         │
                │  • Dev (James)      │
                │  • QA (Quinn)       │
                └──────────┬──────────┘
                           │
                           │  Read planning artifacts
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   docs/prd/      docs/architecture/   core-config.yaml
   (sharded)      (sharded)            (project settings)
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                           │  SM creates stories
                           │
                           ▼
                 ┌──────────────────┐
                 │  docs/stories/   │
                 │                  │
                 │  1.1.title.md    │
                 │  1.2.title.md    │
                 │  2.1.title.md    │
                 │  ...             │
                 └──────┬───────────┘
                        │
                        │  Dev implements
                        │  QA reviews
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
    src/           tests/         docs/qa/
    (code)         (tests)        (assessments & gates)
         │              │              │
         └──────────────┼──────────────┘
                        │
                        │  All stories complete
                        │
                        ▼
              ┌──────────────────┐
              │  PROJECT COMPLETE│
              │                  │
              │  • Planning docs │
              │  • Stories       │
              │  • Code          │
              │  • Tests         │
              │  • QA artifacts  │
              └──────────────────┘


DATA CONTINUITY ACROSS PHASES:

┌─────────────────────────────────────────────────────────────────┐
│  Planning Artifacts → Development Context                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Epic Files (prd/)                                              │
│    ↓                                                            │
│  SM reads → extracts stories → creates story files             │
│                                                                 │
│  Architecture Files (architecture/)                             │
│    ↓                                                            │
│  SM extracts tech context → includes in story                  │
│  Dev loads standards → guides implementation                    │
│                                                                 │
│  core-config.yaml                                               │
│    ↓                                                            │
│  All agents use → determines file locations & behavior          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

The BMad framework's data flow is characterized by:

1. **File-Based Persistence**: All data flows through files (markdown, YAML)
2. **Clear Handoffs**: Agents pass artifacts via well-defined file locations
3. **Configuration-Driven**: `core-config.yaml` directs all file I/O
4. **Stateless Agents**: No session state; all context from files
5. **Version Controlled**: All artifacts tracked in git
6. **Phased Progression**: Planning → Sharding → Development → QA
7. **Quality Gates**: Validation checkpoints throughout

This architecture enables transparent, auditable, and reproducible workflows suitable for enterprise AI-driven development.

---

**Status**: Complete
**Next**: Artifact lifecycle documentation
