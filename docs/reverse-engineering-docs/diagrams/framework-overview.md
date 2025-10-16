# BMad Framework Overview Diagram

**Document Version**: 1.0
**Last Updated**: 2025-10-13
**Status**: Complete

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Component Layer Diagram](#component-layer-diagram)
3. [Agent Ecosystem](#agent-ecosystem)
4. [Execution Flow Diagram](#execution-flow-diagram)
5. [Phase Transition Diagram](#phase-transition-diagram)
6. [Dependency Resolution Diagram](#dependency-resolution-diagram)
7. [Artifact Generation Flow](#artifact-generation-flow)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BMad Framework Architecture                        │
│                      AI-Driven Agile Development Methodology                 │
└─────────────────────────────────────────────────────────────────────────────┘

                                  User Layer
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│         PLANNING PHASE                           DEVELOPMENT PHASE           │
│         (Web UI Mode)                            (IDE Mode)                  │
│                                                                               │
│   ┌────────────────────────┐              ┌────────────────────────┐       │
│   │  Web Platforms         │              │  IDE Platforms         │       │
│   │  • Claude Web          │              │  • Claude Code         │       │
│   │  • Gemini Gems         │              │  • Cursor              │       │
│   │  • ChatGPT Custom GPTs │              │  • Windsurf            │       │
│   │  • Codex               │              │  • Codex CLI           │       │
│   └────────────────────────┘              └────────────────────────┘       │
│                                                                               │
└────────────────────────────────┬─────────────────────────────────────────────┘
                                 │
                                 │  User Commands (* prefix)
                                 │  Natural Language Requests
                                 │
┌────────────────────────────────┴─────────────────────────────────────────────┐
│                              Agent Layer                                      │
│                          (10 Specialized Agents)                              │
│                                                                               │
│  PLANNING AGENTS                                   DEVELOPMENT AGENTS         │
│  ┌────────────────┐                               ┌────────────────┐         │
│  │ 📊 Analyst     │                               │ 📖 SM (Bob)    │         │
│  │    (Mary)      │                               │                │         │
│  └────────────────┘                               └────────────────┘         │
│  ┌────────────────┐                               ┌────────────────┐         │
│  │ 📋 PM (John)   │                               │ 👨‍💻 Dev (James)│         │
│  │                │                               │                │         │
│  └────────────────┘                               └────────────────┘         │
│  ┌────────────────┐                               ┌────────────────┐         │
│  │ 🎨 UX Expert   │                               │ 🧪 QA (Quinn)  │         │
│  │    (Sally)     │                               │                │         │
│  └────────────────┘                               └────────────────┘         │
│  ┌────────────────┐                                                          │
│  │ 🏛️ Architect   │      UNIVERSAL AGENTS                                    │
│  │   (Winston)    │      ┌────────────────┐                                 │
│  └────────────────┘      │ 🎯 BMad Master │                                 │
│  ┌────────────────┐      │                │                                 │
│  │ 📝 PO (Sarah)  │      └────────────────┘                                 │
│  │                │      ┌────────────────┐                                 │
│  └────────────────┘      │ 🎭 BMad        │                                 │
│                          │  Orchestrator  │                                 │
│                          └────────────────┘                                 │
└────────────────────────────────┬─────────────────────────────────────────────┘
                                 │
                                 │  Command Execution
                                 │  Dependency Loading
                                 │
┌────────────────────────────────┴─────────────────────────────────────────────┐
│                            Execution Layer                                    │
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Task Engine    │  │ Template Engine │  │ Workflow Engine │             │
│  │                 │  │                 │  │                 │             │
│  │  • 23 Tasks     │  │  • 13 Templates │  │  • 6 Workflows  │             │
│  │  • Sequential   │  │  • YAML Parsing │  │  • Agent Chain  │             │
│  │  • Conditional  │  │  • Elicitation  │  │  • Orchestration│             │
│  │  • Chaining     │  │  • Validation   │  │  • State Mgmt   │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐                                   │
│  │Checklist Engine │  │  Elicitation    │                                   │
│  │                 │  │    Engine       │                                   │
│  │  • 6 Checklists │  │                 │                                   │
│  │  • Validation   │  │  • User Prompts │                                   │
│  │  • Quality Gates│  │  • Data Gather  │                                   │
│  └─────────────────┘  └─────────────────┘                                   │
└────────────────────────────────┬─────────────────────────────────────────────┘
                                 │
                                 │  File I/O
                                 │  Configuration
                                 │
┌────────────────────────────────┴─────────────────────────────────────────────┐
│                            Resource Layer                                     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    .bmad-core/ (Framework Core)                      │   │
│  │                                                                       │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │   │
│  │  │  agents/  │  │  tasks/   │  │ templates/│  │ workflows/│       │   │
│  │  │  (10)     │  │  (23)     │  │  (13)     │  │   (6)     │       │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘       │   │
│  │                                                                       │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │   │
│  │  │checklists/│  │   data/   │  │   utils/  │  │agent-teams│       │   │
│  │  │   (6)     │  │   (6+)    │  │   (2+)    │  │   (4)     │       │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘       │   │
│  │                                                                       │   │
│  │  core-config.yaml (default configuration)                            │   │
│  │  install-manifest.yaml (installation metadata)                       │   │
│  │  user-guide.md (documentation)                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌────────────────────────┐           ┌────────────────────────┐            │
│  │  Project Configuration │           │  Generated Artifacts   │            │
│  │                        │           │                        │            │
│  │  core-config.yaml      │           │  docs/                 │            │
│  │  (project root)        │           │  ├── prd.md or prd/    │            │
│  │                        │           │  ├── architecture.md   │            │
│  │  Project-specific:     │           │  │   or architecture/  │            │
│  │  • File locations      │           │  ├── stories/          │            │
│  │  • Sharding strategy   │           │  └── qa/               │            │
│  │  • Template versions   │           │                        │            │
│  │  • Dev preferences     │           │  Version controlled    │            │
│  └────────────────────────┘           └────────────────────────┘            │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Layer Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Component Interaction Model                           │
└─────────────────────────────────────────────────────────────────────────────┘

        USER
         │
         │  *command or natural language
         │
         ▼
    ┌─────────┐
    │  AGENT  │  ←── Self-contained definition (.md with YAML)
    └─────────┘
         │
         │  1. Parse command
         │  2. Resolve to task/template
         │  3. Load dependencies
         │
         ▼
    ┌─────────┐
    │  TASK   │  ←── Sequential workflow instructions
    └─────────┘
         │
         │  IF requires template
         │
         ▼
    ┌─────────┐
    │TEMPLATE │  ←── YAML schema with sections
    └─────────┘
         │
         │  IF interactive mode
         │
         ▼
    ┌─────────┐
    │ ELICIT  │  ←── Prompt user for data
    └─────────┘
         │
         │  Populate with data
         │
         ▼
    ┌─────────┐
    │ARTIFACT │  ←── Generated markdown document
    └─────────┘
         │
         │  IF validation needed
         │
         ▼
    ┌─────────┐
    │CHECKLIST│  ←── Quality validation rules
    └─────────┘
         │
         │  Pass/Fail + feedback
         │
         ▼
    ┌─────────┐
    │ OUTPUT  │  ←── Written to docs/
    └─────────┘
         │
         │  Next agent or user
         │
         ▼
      SUCCESS
```

---

## Agent Ecosystem

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Agent Relationships & Flow                          │
└─────────────────────────────────────────────────────────────────────────────┘

                            PLANNING PHASE (Web UI)
                            ─────────────────────────

                                  ┌──────────┐
                                  │ 📊 ANALYST│
                                  │  (Mary)  │
                                  └────┬─────┘
                                       │
                         Brainstorming │ Market Research
                         Project Brief │ Competitor Analysis
                                       │
                                       ▼
                                  ┌──────────┐
                              ┌───│ 📋 PM    │───┐
                              │   │ (John)   │   │
                              │   └──────────┘   │
                              │                  │
                   Create PRD │                  │ Brownfield
                              │                  │ Epic/Story Gen
                              │                  │
                              ▼                  ▼
                       ┌──────────┐         ┌──────────┐
                       │ 🎨 UX    │         │🏛️ ARCHITECT│
                       │  Expert  │         │ (Winston)│
                       │ (Sally)  │         └────┬─────┘
                       └────┬─────┘              │
                            │                    │
                  UI/UX Spec│         Architecture│
                  Frontend  │         Tech Stack  │
                            │                    │
                            └─────────┬──────────┘
                                      │
                                      ▼
                                 ┌──────────┐
                                 │ 📝 PO    │
                                 │ (Sarah)  │
                                 └────┬─────┘
                                      │
                          Validation  │ Master Checklist
                          Sharding    │ Cohesion Check
                                      │
                                      ▼
                            ┌───────────────────┐
                            │ Transition to IDE │
                            │ Sharded Documents │
                            └───────────────────┘


                          DEVELOPMENT PHASE (IDE)
                          ────────────────────────

                                 ┌──────────┐
                                 │ 📖 SM    │
                                 │  (Bob)   │
                                 └────┬─────┘
                                      │
                         Story Draft  │ Extract Context
                         From Epics   │ Architecture
                                      │
                                      ▼
                              ┌──────────────┐
                              │ 👨‍💻 DEV      │
                              │  (James)     │
                              └───────┬──────┘
                                      │
                         Implement    │ TDD
                         Code + Tests │ Regression
                                      │
                                      ▼
                                 ┌──────────┐
                                 │ 🧪 QA    │
                                 │ (Quinn)  │
                                 └────┬─────┘
                                      │
                         Risk Profile │ Test Design
                         Requirements │ NFR Assessment
                         Tracing      │ Quality Gate
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    │ PASS/CONCERNS   │ FAIL           │
                    ▼                 ▼                 ▼
              Next Story      Apply Fixes (Dev)   Iteration
                                      │
                                      └──────► Retry QA


                            UNIVERSAL AGENTS
                            ─────────────────

                     ┌──────────┐          ┌──────────┐
                     │ 🎯 BMAD  │          │ 🎭 BMAD  │
                     │  MASTER  │          │ORCHESTRATOR│
                     └────┬─────┘          └────┬─────┘
                          │                     │
                   No Persona                   │ Web UI
                   Task Execution               │ Agent Morphing
                   KB Mode                      │ Team Coordination
                          │                     │
                          └─────────┬───────────┘
                                    │
                            Universal Access
                            Any Phase, Any Task
```

---

## Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Command Execution Flow                                │
└─────────────────────────────────────────────────────────────────────────────┘

START
  │
  │  User Input
  ▼
┌────────────────────┐
│  Command Parser    │  ◄─── Natural language or *command
└──────┬─────────────┘
       │
       │  Resolve to command definition
       ▼
┌────────────────────┐
│ Dependency Loader  │
│                    │
│ 1. Load task file  │  ◄─── .bmad-core/tasks/{task}.md
│ 2. Load templates  │  ◄─── .bmad-core/templates/{template}.yaml
│ 3. Load checklists │  ◄─── .bmad-core/checklists/{checklist}.md
│ 4. Load data files │  ◄─── .bmad-core/data/{data}.md
└──────┬─────────────┘
       │
       │  All dependencies loaded
       ▼
┌────────────────────┐
│  Task Executor     │
│                    │
│ FOR each step:     │
│   • Read instruction│
│   • Execute action │
│   • Check condition│
│   • Branch if needed│
└──────┬─────────────┘
       │
       │  IF elicit=true in section
       ▼
┌────────────────────┐
│ Elicitation Engine │  ◄─── Interactive: prompt user
│                    │       YOLO: auto-populate
│ • Prompt user      │
│ • Gather data      │
│ • Validate input   │
└──────┬─────────────┘
       │
       │  Data gathered
       ▼
┌────────────────────┐
│ Template Processor │
│                    │
│ • Parse sections   │
│ • Apply data       │
│ • Format markdown  │
│ • Apply permissions│
└──────┬─────────────┘
       │
       │  Document generated
       ▼
┌────────────────────┐
│ Validation Engine  │  ◄─── IF checklist specified
│                    │
│ • Load checklist   │
│ • Check criteria   │
│ • Generate report  │
└──────┬─────────────┘
       │
       │  Validated
       ▼
┌────────────────────┐
│  File Writer       │
│                    │
│ • Resolve path from│  ◄─── core-config.yaml
│   core-config      │
│ • Create/update    │
│   artifact         │
│ • Set permissions  │
└──────┬─────────────┘
       │
       │  Artifact saved
       ▼
┌────────────────────┐
│  Output Handler    │
│                    │
│ • Display results  │
│ • Show file path   │
│ • Suggest next step│
└──────┬─────────────┘
       │
       ▼
     END


                              ERROR HANDLING
                              ──────────────

                         ANY STEP ABOVE
                               │
                               │  Error occurs
                               ▼
                         ┌──────────┐
                         │  ERROR   │
                         │ HANDLER  │
                         └────┬─────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              │               │               │
        Blocking        Non-blocking      Retry
        Error           Warning           Possible
              │               │               │
              ▼               ▼               ▼
         HALT &          Log &           Retry
         Escalate        Continue        (3 max)
         to User         with Note       Then HALT
```

---

## Phase Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Project Lifecycle Phase Transitions                      │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌────────────────────┐
                         │   PROJECT START    │
                         └──────────┬─────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
            ┌────────▼────────┐         ┌─────────▼─────────┐
            │   GREENFIELD    │         │   BROWNFIELD      │
            │   (New Project) │         │ (Existing Project)│
            └────────┬────────┘         └─────────┬─────────┘
                     │                            │
                     └──────────────┬─────────────┘
                                    │
                                    │
                    ┌───────────────▼──────────────┐
                    │     PLANNING PHASE           │
                    │     (Web UI Mode)            │
                    │                              │
                    │  Agents: Analyst, PM, UX,    │
                    │          Architect, PO        │
                    │                              │
                    │  Artifacts Generated:         │
                    │  ✓ Project Brief             │
                    │  ✓ Market Research           │
                    │  ✓ PRD                       │
                    │  ✓ Architecture              │
                    │  ✓ UI/UX Specs               │
                    └───────────────┬──────────────┘
                                    │
                                    │  PO validates
                                    │  artifacts
                                    │
                    ┌───────────────▼──────────────┐
                    │   DOCUMENT SHARDING          │
                    │                              │
                    │  PRD → Epics + Stories       │
                    │  Architecture → Sections     │
                    │                              │
                    │  Artifacts:                  │
                    │  • docs/prd/                 │
                    │  • docs/architecture/        │
                    └───────────────┬──────────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │     TRANSITION TO IDE             │
                  │                                   │
                  │  1. Copy docs/ to project         │
                  │  2. Open in IDE (Claude Code,     │
                  │     Cursor, Windsurf)             │
                  │  3. Activate development agents   │
                  └─────────────────┬─────────────────┘
                                    │
                    ┌───────────────▼──────────────┐
                    │   DEVELOPMENT PHASE           │
                    │   (IDE Mode)                  │
                    │                              │
                    │  Agents: SM, Dev, QA         │
                    │                              │
                    │  Cycle per Story:            │
                    │  1. SM drafts story          │
                    │  2. Dev implements           │
                    │  3. QA reviews               │
                    │  4. Gate decision            │
                    └───────────────┬──────────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                   ┌────▼─────┐           ┌────▼─────┐
                   │   PASS   │           │   FAIL   │
                   │ CONCERNS │           │          │
                   └────┬─────┘           └────┬─────┘
                        │                      │
                        │              ┌───────▼───────┐
                        │              │   Apply Fixes  │
                        │              │   (Dev)        │
                        │              └───────┬───────┘
                        │                      │
                        └──────────┬───────────┘
                                   │
                                   │  All stories
                                   │  complete
                                   │
                        ┌──────────▼──────────┐
                        │   PROJECT COMPLETE   │
                        │                      │
                        │  ✓ All stories done  │
                        │  ✓ All gates passed  │
                        │  ✓ Code complete     │
                        └──────────────────────┘


                            STATE TRACKING
                            ──────────────

    Story Status Flow:
    draft → approved → in_progress → review → done

    Gate Status:
    PASS | CONCERNS | FAIL | WAIVED
```

---

## Dependency Resolution Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Dependency Loading Strategy                           │
└─────────────────────────────────────────────────────────────────────────────┘

                            AGENT ACTIVATION
                            ────────────────
                                    │
                      ┌─────────────┴─────────────┐
                      │  Load agent definition    │
                      │  (.bmad-core/agents/      │
                      │   {agent-id}.md)          │
                      └─────────────┬─────────────┘
                                    │
                                    │  Read YAML config
                                    │  Adopt persona
                                    │
                      ┌─────────────▼─────────────┐
                      │  Load core-config.yaml    │
                      │  (from project root)      │
                      └─────────────┬─────────────┘
                                    │
                                    │  Configuration loaded
                                    │
                      ┌─────────────▼─────────────┐
                      │  Display help (*help)     │
                      │  HALT - await user input  │
                      └─────────────┬─────────────┘
                                    │
                                    │  NO DEPENDENCIES
                                    │  LOADED YET!
                                    │
                                    ▼
                              Agent Ready


                          COMMAND EXECUTION
                          ─────────────────
                                    │
                        User issues command
                                    │
                      ┌─────────────▼─────────────┐
                      │  Resolve command          │
                      │  Identify dependencies    │
                      └─────────────┬─────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌─────────────┐       ┌─────────────┐     ┌─────────────┐
      │ Load Tasks  │       │  Load       │     │  Load       │
      │             │       │  Templates  │     │  Checklists │
      │ .bmad-core/ │       │             │     │             │
      │ tasks/      │       │ .bmad-core/ │     │ .bmad-core/ │
      │ {task}.md   │       │ templates/  │     │ checklists/ │
      │             │       │ {tmpl}.yaml │     │ {check}.md  │
      └──────┬──────┘       └──────┬──────┘     └──────┬──────┘
             │                     │                    │
             └─────────────────────┼────────────────────┘
                                   │
                     ┌─────────────▼─────────────┐
                     │  Load Data Files          │
                     │  (if referenced)          │
                     │                           │
                     │  .bmad-core/data/         │
                     │  {data}.md                │
                     └─────────────┬─────────────┘
                                   │
                                   │  All deps loaded
                                   │
                     ┌─────────────▼─────────────┐
                     │  Execute Task             │
                     └─────────────┬─────────────┘
                                   │
                                   │  Task may load
                                   │  additional tasks
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
      ┌─────────────┐      ┌─────────────┐    ┌─────────────┐
      │  Subtask 1  │      │  Subtask 2  │    │  Subtask N  │
      │             │      │             │    │             │
      │ Loaded      │      │ Loaded      │    │ Loaded      │
      │ On-Demand   │      │ On-Demand   │    │ On-Demand   │
      └─────────────┘      └─────────────┘    └─────────────┘


                          DEPENDENCY CHAIN
                          ────────────────

    Example: *create-prd command (PM agent)

    1. PM Agent activated (already in memory)
    2. User: "*create-prd"
    3. Load: .bmad-core/tasks/create-doc.md
    4. Task references: prd-tmpl.yaml
    5. Load: .bmad-core/templates/prd-tmpl.yaml
    6. Template has sections with elicitation
    7. Execute elicitation (gather data from user)
    8. Task may reference checklist
    9. Load: .bmad-core/checklists/pm-checklist.md
    10. Validate generated PRD
    11. Write to docs/prd.md
    12. Release dependencies from context (optional)


                      SHARED DEPENDENCIES
                      ───────────────────

                  technical-preferences.md
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    Analyst             PM              Architect
    (reads)         (reads)             (reads)

    • Loaded independently by each agent
    • Same file, loaded when needed
    • Ensures consistency across agents
```

---

## Artifact Generation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Artifact Lifecycle                                  │
└─────────────────────────────────────────────────────────────────────────────┘

                          TEMPLATE-DRIVEN GENERATION
                          ──────────────────────────

                         ┌───────────────────┐
                         │  YAML Template    │
                         │  Definition       │
                         │                   │
                         │  • Metadata       │
                         │  • Sections       │
                         │  • Field Schema   │
                         │  • Validation     │
                         └─────────┬─────────┘
                                   │
                      ┌────────────▼────────────┐
                      │  Template Parser        │
                      │                         │
                      │  • Load YAML            │
                      │  • Extract sections     │
                      │  • Identify elicit      │
                      │    sections             │
                      └────────────┬────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              │                    │                    │
    ┌─────────▼─────────┐  ┌──────▼──────┐  ┌─────────▼─────────┐
    │  Interactive Mode │  │ YOLO Mode   │  │  Hybrid Mode      │
    │                   │  │             │  │                   │
    │  • Prompt user    │  │ • Auto-     │  │  • Prompt critical│
    │  • Gather each    │  │   populate  │  │    sections only  │
    │    section        │  │ • Make      │  │  • Auto-fill rest │
    │  • Validate       │  │   reasonable│  │                   │
    │  • Confirm        │  │   assumptions│  │                   │
    └─────────┬─────────┘  └──────┬──────┘  └─────────┬─────────┘
              │                   │                    │
              └───────────────────┼────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │  Data Aggregator          │
                    │                           │
                    │  • Collect all section    │
                    │    data                   │
                    │  • Apply business rules   │
                    │  • Format per schema      │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │  Markdown Generator       │
                    │                           │
                    │  • Apply markdown format  │
                    │  • Add section markers    │
                    │  • Set edit permissions   │
                    │  • Include metadata       │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │  Validation Engine        │
                    │  (Optional)               │
                    │                           │
                    │  • Check completeness     │
                    │  • Verify structure       │
                    │  • Run checklist          │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │  File Writer              │
                    │                           │
                    │  • Resolve path from      │
                    │    core-config.yaml       │
                    │  • Create directories     │
                    │  • Write artifact         │
                    │  • Set file permissions   │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                          ┌───────────────┐
                          │   ARTIFACT    │
                          │   CREATED     │
                          └───────────────┘


                          ARTIFACT OWNERSHIP & UPDATES
                          ────────────────────────────

        ┌────────────┐
        │  ARTIFACT  │  ← Created by Agent A
        │   (v1)     │
        └──────┬─────┘
               │
               │  Agent A has full edit rights
               │  Other agents: read-only
               │
               ▼
        ┌────────────┐
        │  ARTIFACT  │  ← Agent B updates specific section
        │   (v1.1)   │    (if section permissions allow)
        └──────┬─────┘
               │
               │  Version control tracks changes
               │  Section markers enforce boundaries
               │
               ▼
        ┌────────────┐
        │  ARTIFACT  │  ← Agent C reads for context
        │   (v1.1)   │    (read-only)
        └────────────┘


                          SHARDED ARTIFACTS
                          ─────────────────

            Monolithic PRD (prd.md)
                      │
                      │  PO runs *shard-prd
                      │
          ┌───────────▼───────────┐
          │   Sharding Process    │
          │                       │
          │  • Parse document     │
          │  • Extract epics      │
          │  • Split stories      │
          │  • Create index       │
          └───────────┬───────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
    docs/prd/index.md      docs/prd/epic-*.md
          │
          │  Multiple files
          ├─ epic-1-overview.md
          ├─ epic-1-stories.md
          ├─ epic-2-overview.md
          └─ epic-2-stories.md

    SM Agent reads sharded files to draft stories
```

---

## Summary

The BMad framework employs a sophisticated multi-layer architecture that enables:

1. **Dual-phase operation** (Planning in Web UI, Development in IDE)
2. **Self-contained agents** with lazy dependency loading
3. **Configuration-driven behavior** for project flexibility
4. **Template-driven artifact generation** for consistency
5. **File-based collaboration** with clear ownership boundaries
6. **Quality gates** for advisory guidance without blocking

This architecture supports scalable, maintainable, and user-friendly AI-driven agile development workflows.

---

**Status**: Complete
**Next**: Data flow analysis and artifact lifecycle documentation
