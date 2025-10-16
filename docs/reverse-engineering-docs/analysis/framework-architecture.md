# BMad Framework Architecture Analysis

**Document Version**: 1.0
**Last Updated**: 2025-10-13
**Status**: In Progress

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Agent Activation System](#agent-activation-system)
4. [Dependency Resolution System](#dependency-resolution-system)
5. [Configuration Management](#configuration-management)
6. [Command & Task Execution Flow](#command--task-execution-flow)
7. [File System Organization](#file-system-organization)
8. [Design Patterns](#design-patterns)
9. [Integration Mechanisms](#integration-mechanisms)

---

## Executive Summary

The BMad (Business Methodology for Agile Development) framework is a sophisticated AI-driven development methodology that orchestrates specialized AI agents through structured workflows. The framework employs a unique architecture that combines:

- **Self-contained agent definitions** using YAML-in-markdown format
- **Lazy-loaded dependency system** for efficient context management
- **Dual-mode operation** (Web UI for planning, IDE for development)
- **Configuration-driven behavior** through project-specific YAML files
- **Structured artifact generation** with strict permission boundaries

### Key Architectural Characteristics

| Aspect | Approach | Rationale |
|--------|----------|-----------|
| **Agent Definition** | YAML config blocks embedded in markdown | Single-file agent specifications, no external loading |
| **Dependency Loading** | Lazy/on-demand via file references | Minimize context window usage, load only what's needed |
| **Configuration** | Project-root `core-config.yaml` | Support diverse project structures and preferences |
| **Command Routing** | `*` prefix with flexible natural language mapping | User-friendly command interface |
| **Artifact Storage** | Structured `docs/` hierarchy | Clear organization, version control friendly |
| **Agent Collaboration** | File-based handoffs with clear ownership | Stateless agents, traceable workflows |

---

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                     │
│                                                                   │
│   ┌──────────────────┐              ┌──────────────────┐        │
│   │   Web UI Mode    │              │    IDE Mode      │        │
│   │  (Planning)      │              │  (Development)   │        │
│   │  - Claude Web    │              │  - Claude Code   │        │
│   │  - Gemini Gems   │              │  - Cursor        │        │
│   │  - Custom GPTs   │              │  - Windsurf      │        │
│   └──────────────────┘              └──────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Agent Layer (10 Agents)                   │
│                                                                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │ Analyst   │  │    PM     │  │ UX Expert │  │ Architect │   │
│  │  (Mary)   │  │  (John)   │  │  (Sally)  │  │ (Winston) │   │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
│                                                                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │    PO     │  │    SM     │  │    Dev    │  │    QA     │   │
│  │  (Sarah)  │  │   (Bob)   │  │  (James)  │  │  (Quinn)  │   │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
│                                                                   │
│  ┌───────────┐  ┌───────────┐                                   │
│  │  BMad     │  │   BMad    │                                   │
│  │  Master   │  │Orchestrator│                                   │
│  └───────────┘  └───────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Execution Layer                             │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │  Task Engine    │  │ Template Engine │  │ Workflow Engine│  │
│  │  (23 tasks)     │  │ (13 templates)  │  │ (6 workflows)  │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │ Checklist Engine│  │  Elicitation    │                       │
│  │ (6 checklists)  │  │  Engine         │                       │
│  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Resource Layer                              │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  .bmad-core/ │  │  Project     │  │  Generated   │          │
│  │              │  │  Config      │  │  Artifacts   │          │
│  │  - agents/   │  │              │  │              │          │
│  │  - tasks/    │  │  core-       │  │  docs/       │          │
│  │  - templates/│  │  config.yaml │  │  - prd/      │          │
│  │  - workflows/│  │              │  │  - architecture/│       │
│  │  - checklists/│ │              │  │  - stories/  │          │
│  │  - data/     │  │              │  │  - qa/       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**User Interface Layer:**
- Provides two distinct modes: Web UI (planning phase) and IDE (development phase)
- Handles user interaction and command input
- Displays agent responses and generated artifacts

**Agent Layer:**
- 10 specialized AI agents, each with distinct personas and capabilities
- Self-contained definitions in markdown files with embedded YAML configuration
- Stateless operation with file-based state persistence

**Execution Layer:**
- Task Engine: Executes 23 different task workflows
- Template Engine: Processes 13 YAML templates for document generation
- Workflow Engine: Orchestrates 6 predefined multi-agent workflows
- Checklist Engine: Validates work against 6 quality checklists
- Elicitation Engine: Handles interactive user prompts and data gathering

**Resource Layer:**
- `.bmad-core/`: Framework core components (version-controlled, read-only)
- Project Config: Project-specific configuration (`core-config.yaml`)
- Generated Artifacts: All project documentation and code

---

## Agent Activation System

### Overview

The BMad framework uses a unique agent activation pattern where each agent is defined in a single markdown file containing an embedded YAML configuration block. This approach provides:

1. **Self-contained specifications**: All agent information in one place
2. **Human-readable definitions**: Markdown format with YAML structure
3. **No external dependencies on startup**: Agents don't load other agent files
4. **Lazy dependency loading**: Resources loaded only when commands execute

### Agent File Structure

Every agent file follows this consistent structure:

```markdown
<!-- Powered by BMAD™ Core -->

# [agent-id]

ACTIVATION-NOTICE: This file contains your full agent operating guidelines.
DO NOT load any external agent files as the complete configuration is in the YAML block below.

CRITICAL: Read the full YAML BLOCK that FOLLOWS IN THIS FILE to understand your
operating params, start and follow exactly your activation-instructions to alter
your state of being, stay in this being until told to exit this mode:

## COMPLETE AGENT DEFINITION FOLLOWS - NO EXTERNAL FILES NEEDED

```yaml
IDE-FILE-RESOLUTION: [instructions for resolving file paths when executing commands]
REQUEST-RESOLUTION: [instructions for mapping user requests to commands]
activation-instructions: [step-by-step activation process]
agent: [agent metadata]
persona: [personality and behavior]
core_principles: [guiding principles]
commands: [available commands]
dependencies: [required resources by type]
```
```

### Activation Sequence

When an agent is activated, it follows this precise sequence:

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Read THIS ENTIRE FILE                               │
│         Complete persona definition is contained herein     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Adopt Persona                                       │
│         Transform into the agent defined in YAML            │
│         - Load personality traits                           │
│         - Adopt communication style                         │
│         - Internalize core principles                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Load Core Configuration                             │
│         Read `.bmad-core/core-config.yaml`                  │
│         - Extract project structure                         │
│         - Load file path mappings                           │
│         - Understand project-specific settings              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Greet & Display Help                                │
│         - Announce name and role                            │
│         - Automatically run `*help`                         │
│         - Display available commands                        │
│         - HALT and await user input                         │
└─────────────────────────────────────────────────────────────┘
```

**Critical Rules:**

1. **DO NOT** load other agent files during activation
2. **ONLY** load dependency files when user requests command execution
3. **Agent customization field ALWAYS takes precedence** over conflicting instructions
4. **Task instructions override base behavioral constraints** when executing workflows
5. **Tasks with elicit=true REQUIRE user interaction** - cannot be bypassed for efficiency
6. **Stay in character** until explicitly told to exit

### Agent YAML Configuration Schema

```yaml
# File path resolution (for runtime, not activation)
IDE-FILE-RESOLUTION:
  - FOR LATER USE ONLY - NOT FOR ACTIVATION
  - Dependencies map to .bmad-core/{type}/{name}
  - type=folder (tasks|templates|checklists|data|utils)
  - name=file-name
  - Example: create-doc.md → .bmad-core/tasks/create-doc.md

# Natural language to command mapping
REQUEST-RESOLUTION: |
  Match user requests to commands/dependencies flexibly
  Examples:
    - "draft story" → *create → create-next-story task
    - "make a new prd" → tasks/create-doc + templates/prd-tmpl.md
  ALWAYS ask for clarification if no clear match

# Activation procedure
activation-instructions:
  - STEP 1: Read THIS ENTIRE FILE
  - STEP 2: Adopt persona defined below
  - STEP 3: Load `.bmad-core/core-config.yaml`
  - STEP 4: Greet user, run `*help`, HALT
  - DO NOT: Load any other agent files
  - ONLY load dependencies when user requests execution
  - [Additional agent-specific instructions]

# Agent metadata
agent:
  name: string                    # Human-friendly name (e.g., "Mary", "John")
  id: string                      # Machine identifier (e.g., "analyst", "pm")
  title: string                   # Role title (e.g., "Business Analyst")
  icon: string                    # Emoji icon (e.g., "📊")
  whenToUse: string               # Description of when to invoke this agent
  customization: string | null    # Agent-specific overrides (takes precedence)

# Persona definition
persona:
  role: string                    # Core role description
  style: string                   # Communication style traits
  identity: string                # Agent's self-concept
  focus: string                   # Primary focus areas
  core_principles:                # List of guiding principles
    - string
    - string

# Additional persona fields (agent-specific)
story-file-permissions: [...]     # For Dev and QA agents

# Available commands (all require * prefix)
commands:
  - help: string                  # Always present: show available commands
  - [command-name]: string        # Command description
  - [command-name]:               # Or complex command definition
      - parameter: string
      - another-param: string
  - exit: string                  # Always present: exit agent mode

# Dependencies by type
dependencies:
  checklists:                     # Optional
    - filename.md
  data:                           # Optional
    - filename.md
  tasks:                          # Optional
    - filename.md
  templates:                      # Optional
    - filename.yaml
  utils:                          # Optional (rare)
    - filename.md
```

### Dependency Loading Strategy

**Key Principle**: **Lazy Loading** - Resources are loaded on-demand, not at activation.

```
Activation Time                Runtime (Command Execution)
─────────────────              ──────────────────────────

Load:                          Load (on-demand):
  ✓ Agent definition             ✓ Required tasks
  ✓ core-config.yaml             ✓ Required templates
                                 ✓ Required checklists
                                 ✓ Required data files
                                 ✓ Referenced dependencies

Do NOT load:
  ✗ Other agent files
  ✗ Task files
  ✗ Template files
  ✗ Checklist files
  ✗ Data files (except config)
```

**Rationale**: This lazy loading strategy minimizes context window usage, allowing agents to operate efficiently even in constrained environments.

### Agent-Specific Activation Variations

**Dev Agent (James):**
```yaml
activation-instructions:
  # ... standard steps ...
  - CRITICAL: Read the following full files as these are your explicit rules
    for development standards - .bmad-core/core-config.yaml devLoadAlwaysFiles list
  - CRITICAL: Do NOT load any other files during startup aside from the
    assigned story and devLoadAlwaysFiles items
  - CRITICAL: Do NOT begin development until story is not in draft mode
```

**BMad-Master:**
```yaml
activation-instructions:
  # ... standard steps ...
  - CRITICAL: Do NOT scan filesystem or load any resources during startup
  - CRITICAL: Do NOT run discovery tasks automatically
  - CRITICAL: NEVER LOAD root/data/bmad-kb.md UNLESS USER TYPES *kb
```

---

## Dependency Resolution System

### Overview

The dependency resolution system enables agents to dynamically load required resources (tasks, templates, checklists, data files) without pre-loading everything at activation time.

### Dependency Types

```
.bmad-core/
├── agents/           # Agent definition files (10 files)
│   └── [agent-id].md
├── tasks/            # Task workflow files (23 files)
│   └── [task-name].md
├── templates/        # Document templates (13 files)
│   └── [template-name].yaml
├── checklists/       # Quality checklists (6 files)
│   └── [checklist-name].md
├── data/             # Reference data and knowledge base
│   └── [data-file].md
├── utils/            # Utility scripts and helpers
│   └── [utility].md
├── workflows/        # Predefined workflows (6 files)
│   └── [workflow-type].yaml
└── agent-teams/      # Team configurations (4 files)
    └── [team-name].yaml
```

### File Path Resolution

**Rule**: Dependencies map to `.bmad-core/{type}/{name}`

**Examples**:
- Task: `create-doc.md` → `.bmad-core/tasks/create-doc.md`
- Template: `prd-tmpl.yaml` → `.bmad-core/templates/prd-tmpl.yaml`
- Checklist: `story-dod-checklist.md` → `.bmad-core/checklists/story-dod-checklist.md`
- Data: `technical-preferences.md` → `.bmad-core/data/technical-preferences.md`

### Dependency Declaration

Agents declare their potential dependencies in the YAML configuration:

```yaml
dependencies:
  tasks:
    - create-doc.md
    - shard-doc.md
  templates:
    - prd-tmpl.yaml
    - brownfield-prd-tmpl.yaml
  checklists:
    - pm-checklist.md
  data:
    - technical-preferences.md
```

**Important**: Declaring a dependency does **NOT** load it. It merely indicates that the agent **may** need these resources during execution.

### Dependency Loading Triggers

Dependencies are loaded only when:

1. **User executes a command** that requires the dependency
2. **Task workflow references** another task or template
3. **Agent explicitly requests** a resource

**Example Flow:**

```
User: "*create-prd"
  ↓
Agent (PM): Resolve command "*create-prd"
  ↓
Command Definition: "run task create-doc.md with template prd-tmpl.yaml"
  ↓
Load: .bmad-core/tasks/create-doc.md
  ↓
Task Instruction: "Load template {template-name}"
  ↓
Load: .bmad-core/templates/prd-tmpl.yaml
  ↓
Execute task with loaded template
```

### Shared Dependencies

Multiple agents can share the same dependencies:

**Example: `technical-preferences.md` is used by:**
- Analyst
- PM
- UX Expert
- Architect
- QA

This allows consistent bias across planning and architecture without duplication.

### Dependency Chains

Tasks can reference other tasks, creating dependency chains:

**Example: `create-next-story.md` task**
```markdown
## Step 6: Story Draft Completion and Review

- Execute `.bmad-core/tasks/execute-checklist` `.bmad-core/checklists/story-draft-checklist`
```

This creates a chain: `create-next-story` → `execute-checklist` → `story-draft-checklist`

---

## Configuration Management

### Core Configuration File

**Location**: `.bmad-core/core-config.yaml` (project root)

**Purpose**: Project-specific configuration that drives agent behavior and file organization.

### Configuration Schema

```yaml
# Markdown explosion for readability
markdownExploder: boolean

# QA configuration
qa:
  qaLocation: string              # Base directory for QA artifacts

# PRD configuration
prd:
  prdFile: string                 # Main PRD file path
  prdVersion: string              # PRD template version (e.g., "v4")
  prdSharded: boolean             # Whether PRD is sharded
  prdShardedLocation: string      # Directory for sharded PRD files
  epicFilePattern: string         # Pattern for epic files (e.g., "epic-{n}*.md")

# Architecture configuration
architecture:
  architectureFile: string        # Main architecture file path
  architectureVersion: string     # Architecture template version (e.g., "v4")
  architectureSharded: boolean    # Whether architecture is sharded
  architectureShardedLocation: string  # Directory for sharded arch files

# Custom technical documents
customTechnicalDocuments: array | null  # Additional doc paths

# Developer configuration
devLoadAlwaysFiles: array         # Files dev agent always loads
devDebugLog: string               # Path to debug log file
devStoryLocation: string          # Directory for story files

# Slash command prefix (IDE-specific)
slashPrefix: string               # Command prefix (e.g., "BMad")
```

### Example Configuration

```yaml
markdownExploder: true
qa:
  qaLocation: docs/qa
prd:
  prdFile: docs/prd.md
  prdVersion: v4
  prdSharded: true
  prdShardedLocation: docs/prd
  epicFilePattern: epic-{n}*.md
architecture:
  architectureFile: docs/architecture.md
  architectureVersion: v4
  architectureSharded: true
  architectureShardedLocation: docs/architecture
customTechnicalDocuments: null
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
devDebugLog: .ai/debug-log.md
devStoryLocation: docs/stories
slashPrefix: BMad
```

### Configuration Usage Patterns

**SM Agent (Story Creation):**
```markdown
### 0. Load Core Configuration

- Load `.bmad-core/core-config.yaml`
- Extract: `devStoryLocation`, `prd.*`, `architecture.*`
- Use `prdSharded` to determine if loading from sharded or monolithic PRD
- Use `architectureVersion` to determine reading strategy
```

**Dev Agent (Implementation):**
```markdown
### Activation

- Load `devLoadAlwaysFiles` from config
- These files contain coding standards, tech stack, project structure
- Dev agent MUST NOT load PRD/architecture unless explicitly directed
```

**QA Agent (Quality Assurance):**
```markdown
### Output Location

- Read `qa.qaLocation` from config
- Write assessments to `{qaLocation}/assessments/`
- Write gates to `{qaLocation}/gates/`
```

### Configuration-Driven Behavior

The configuration enables:

1. **Project structure flexibility**: Support diverse monorepo, polyrepo, and custom structures
2. **Document sharding strategies**: Monolithic vs sharded artifacts
3. **Agent context optimization**: Dev agent only loads what it needs
4. **Output organization**: Consistent artifact locations across agents
5. **Version compatibility**: Support multiple template versions

---

## Command & Task Execution Flow

### Command System Overview

BMad uses a command-based interaction model with two key features:

1. **Command Prefix**: All commands require `*` prefix (e.g., `*help`, `*draft`, `*create-prd`)
2. **Natural Language Mapping**: Agents flexibly map user intent to commands

### Command Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Input                                                │
│    - Direct command: "*create-prd"                           │
│    - Natural language: "create a PRD for me"                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Command Resolution                                        │
│    - Agent parses input                                      │
│    - Maps to registered command                              │
│    - Extracts parameters if present                          │
│    - Ask for clarification if ambiguous                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Dependency Loading                                        │
│    - Identify required resources                             │
│    - Load tasks from .bmad-core/tasks/                       │
│    - Load templates from .bmad-core/templates/               │
│    - Load checklists from .bmad-core/checklists/             │
│    - Load data from .bmad-core/data/                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Task Execution                                            │
│    - Follow task instructions sequentially                   │
│    - Execute subtasks if referenced                          │
│    - Maintain execution state                                │
│    - Handle errors and blocking conditions                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. User Interaction (if elicit=true)                         │
│    - Prompt user for required information                    │
│    - Present numbered options for choices                    │
│    - Validate input                                          │
│    - Proceed with gathered data                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Artifact Generation                                       │
│    - Process templates                                       │
│    - Generate documents                                      │
│    - Write to configured locations                           │
│    - Apply formatting and structure                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Output & Completion                                       │
│    - Display results to user                                 │
│    - Report file locations                                   │
│    - Suggest next steps                                      │
│    - Update state if applicable                              │
└─────────────────────────────────────────────────────────────┘
```

### Command Types

**1. Simple Commands** (Direct execution)
```yaml
commands:
  - help: Show numbered list of available commands
  - exit: Say goodbye and abandon persona
```

**2. Task-Mapped Commands** (Execute task workflow)
```yaml
commands:
  - draft: Execute task create-next-story.md
  - create-prd: Run task create-doc.md with template prd-tmpl.yaml
```

**3. Complex Commands** (Multi-step with parameters)
```yaml
commands:
  - develop-story:
      - order-of-execution: "Read task → Implement → Write tests → Execute validations"
      - blocking: "HALT for unapproved deps, ambiguity, repeated failures"
      - completion: "All tasks marked [x] → Run DoD checklist → Set status"
```

### Request Resolution Examples

**Natural Language → Command Mapping:**

| User Input | Agent Interpretation | Executed Command |
|------------|---------------------|------------------|
| "draft story" | SM agent, mentions "create" | `*draft` (→ create-next-story task) |
| "make a new PRD" | PM agent, "create" + "PRD" | `*create-prd` (→ create-doc + prd-tmpl) |
| "review this story" | QA agent, "review" + context | `*review {story}` (→ review-story task) |
| "shard the PRD" | PO/PM agent, "shard" + "PRD" | `*shard-prd` (→ shard-doc task) |

### Task Execution Modes

**Interactive Mode:**
- Task pauses at `elicit: true` sections
- Prompts user for input
- Validates responses
- Continues with provided data

**YOLO Mode:**
- Minimizes user interaction
- Makes reasonable assumptions
- Generates content rapidly
- Suitable for drafts and iterations

**Mode Toggle:**
```yaml
commands:
  - yolo: Toggle Yolo Mode on/off
```

### Error Handling & Blocking Conditions

**Blocking Scenarios (Agent must HALT):**

1. **Unapproved dependencies needed**: Stop and confirm with user
2. **Ambiguous after story check**: Require clarification
3. **3 repeated failures**: Escalate to user
4. **Missing configuration**: Cannot proceed without config
5. **Failing regression tests**: Must be resolved before continuing

**Error Recovery:**
- Clear error messages with context
- Suggested remediation steps
- Option to retry or abort
- State preservation for recovery

---

## File System Organization

### Project Structure

```
project-root/
├── .bmad-core/                   # Framework core (read-only)
│   ├── agents/                   # Agent definitions (10 files)
│   ├── tasks/                    # Task workflows (23 files)
│   ├── templates/                # Document templates (13 files)
│   ├── workflows/                # Predefined workflows (6 files)
│   ├── checklists/               # Quality checklists (6 files)
│   ├── data/                     # Reference data
│   ├── utils/                    # Utility scripts
│   ├── agent-teams/              # Team configurations (4 files)
│   ├── core-config.yaml          # Default configuration
│   ├── user-guide.md             # User documentation
│   ├── enhanced-ide-development-workflow.md
│   ├── working-in-the-brownfield.md
│   └── install-manifest.yaml     # Installation metadata
│
├── docs/                         # Generated artifacts (project-specific)
│   ├── prd.md                    # Product Requirements Document (monolithic)
│   ├── prd/                      # Sharded PRD (v4+)
│   │   ├── index.md              # PRD navigation
│   │   ├── epic-1-overview.md
│   │   ├── epic-1-stories.md
│   │   ├── epic-2-overview.md
│   │   └── epic-2-stories.md
│   │
│   ├── architecture.md           # System Architecture (monolithic)
│   ├── architecture/             # Sharded Architecture (v4+)
│   │   ├── index.md              # Architecture navigation
│   │   ├── tech-stack.md
│   │   ├── coding-standards.md
│   │   ├── source-tree.md
│   │   ├── data-models.md
│   │   ├── database-schema.md
│   │   ├── backend-architecture.md
│   │   ├── frontend-architecture.md
│   │   ├── rest-api-spec.md
│   │   ├── components.md
│   │   └── core-workflows.md
│   │
│   ├── stories/                  # User stories
│   │   ├── 1.1.story-title.md   # Epic 1, Story 1
│   │   ├── 1.2.story-title.md
│   │   ├── 2.1.story-title.md
│   │   └── ...
│   │
│   └── qa/                       # QA artifacts
│       ├── assessments/          # QA assessment reports
│       │   ├── 1.1-risk-20251013.md
│       │   ├── 1.1-test-design-20251013.md
│       │   ├── 1.1-trace-20251014.md
│       │   └── 1.1-nfr-20251014.md
│       └── gates/                # Quality gate decisions
│           ├── 1.1-story-slug.yml
│           └── 1.2-story-slug.yml
│
├── core-config.yaml              # Project-specific config (overrides)
│
└── [source code...]              # Actual implementation
```

### Artifact Naming Conventions

**Stories:**
```
{epic-num}.{story-num}.{story-title-slug}.md

Examples:
  1.1.user-authentication.md
  1.2.password-reset.md
  2.1.dashboard-overview.md
```

**QA Assessments:**
```
{epic}.{story}-{assessment-type}-{YYYYMMDD}.md

Examples:
  1.1-risk-20251013.md
  1.1-test-design-20251013.md
  1.2-trace-20251015.md
```

**QA Gates:**
```
{epic}.{story}-{slug}.yml

Examples:
  1.1-user-authentication.yml
  2.1-dashboard-overview.yml
```

### File Ownership & Permissions

Different agents have specific file modification permissions:

| Agent | Can Create | Can Update | Sections Editable |
|-------|-----------|------------|-------------------|
| **Analyst** | Project briefs, research | Own artifacts | All sections of own docs |
| **PM** | PRDs, epics | Own artifacts | All sections of own docs |
| **UX Expert** | UI specs, prompts | Own artifacts | All sections of own docs |
| **Architect** | Architecture docs | Own artifacts | All sections of own docs |
| **PO** | Validation reports | Stories (limited) | Change log only |
| **SM** | Stories | Stories (full) | All sections except Dev Record |
| **Dev** | Code, tests | Stories (limited) | Dev Agent Record ONLY |
| **QA** | Assessments, gates | Stories (limited) | QA Results ONLY |

**Critical Rules:**

- **Dev Agent**: Can ONLY update Dev Agent Record sections in stories (Tasks checkboxes, Debug Log, Completion Notes, File List, Change Log, Status)
- **QA Agent**: Can ONLY update QA Results section in stories
- **SM Agent**: Creates stories but cannot modify code
- **All agents**: Must respect section ownership boundaries

---

## Design Patterns

### 1. Self-Contained Agent Pattern

**Pattern**: Each agent is a complete, self-sufficient unit defined in a single markdown file with embedded YAML configuration.

**Benefits**:
- No circular dependencies
- Clear agent boundaries
- Easy to version control
- Human-readable specifications
- Simple deployment (just copy files)

**Implementation**:
```
[agent-definition].md
├── Activation Notice
├── YAML Configuration Block
│   ├── Activation Instructions
│   ├── Agent Metadata
│   ├── Persona Definition
│   ├── Commands
│   └── Dependencies (declarations only)
└── [Optional additional documentation]
```

### 2. Lazy Loading Pattern

**Pattern**: Resources are loaded on-demand when commands execute, not at activation.

**Benefits**:
- Minimal context window usage
- Faster agent activation
- Load only what's needed for current task
- Scales to large frameworks

**Implementation**:
```
Activation:
  - Load: agent definition + core-config.yaml
  - DO NOT load: tasks, templates, checklists, data

Command Execution:
  - Identify required resources
  - Load on-demand from .bmad-core/{type}/
  - Execute with loaded resources
  - Release from context after completion
```

### 3. Configuration-Driven Behavior Pattern

**Pattern**: Agent behavior adapts based on project-specific configuration.

**Benefits**:
- Support diverse project structures
- Flexible file organization
- Version compatibility
- Project-specific customization

**Implementation**:
```yaml
# core-config.yaml defines:
  - File locations (PRD, architecture, stories, QA)
  - Sharding strategies (monolithic vs sharded)
  - Template versions (v3, v4, etc.)
  - Agent-specific settings (devLoadAlwaysFiles)
```

### 4. File-Based State Management Pattern

**Pattern**: Agent collaboration through file artifacts with clear ownership boundaries.

**Benefits**:
- Stateless agents (no session state)
- Version control friendly
- Audit trail of all changes
- Clear handoff points

**Implementation**:
```
Agent A creates artifact → saves to docs/
  ↓
Agent B reads artifact from docs/
  ↓
Agent B updates specific sections → saves to docs/
  ↓
Agent C reads updated artifact → continues workflow
```

### 5. Persona Adoption Pattern

**Pattern**: Agents adopt specific personas with names, personalities, and communication styles.

**Benefits**:
- Consistent agent behavior
- Clear role boundaries
- Memorable and relatable
- User-friendly interaction

**Implementation**:
```yaml
agent:
  name: "Sarah"
  title: "Product Owner"
  icon: "📝"

persona:
  role: "Technical Product Owner & Process Steward"
  style: "Meticulous, analytical, detail-oriented, systematic"
  identity: "Product Owner who validates artifacts cohesion"
  focus: "Plan integrity, documentation quality, process adherence"
```

### 6. Task Workflow Pattern

**Pattern**: Tasks are sequential, documented workflows with clear steps, elicitation points, and outputs.

**Benefits**:
- Repeatable processes
- Clear execution logic
- Documented decision points
- User interaction gates

**Implementation**:
```markdown
# Task Name

## Purpose
[What this task accomplishes]

## SEQUENTIAL Task Execution

### 1. Step Name
- Substep 1
- Substep 2
- IF condition: branching logic

### 2. Next Step
[Continue sequential execution]

### N. Final Step
- Produce output
- Report results
```

### 7. Template-Driven Generation Pattern

**Pattern**: Documents are generated from YAML templates with defined sections, types, and elicitation strategies.

**Benefits**:
- Consistent document structure
- Enforced completeness
- Interactive data gathering
- Version-controlled schemas

**Implementation**:
```yaml
template:
  id: story-template-v2
  sections:
    - id: acceptance-criteria
      type: numbered-list
      elicit: true
      instruction: "Copy AC from epic file"
```

### 8. Quality Gate Pattern

**Pattern**: QA agent provides advisory quality decisions without blocking progress.

**Benefits**:
- Clear quality metrics
- Documented risk acceptance
- Non-blocking advisory role
- Traceability of decisions

**Implementation**:
```yaml
gate_decision:
  status: PASS | CONCERNS | FAIL | WAIVED
  rationale: "Explanation of decision"
  date: timestamp
  created_by: "qa-agent"
```

---

## Integration Mechanisms

### Agent-to-Agent Handoffs

**Pattern**: Agents collaborate through document artifacts, not direct communication.

**Workflow Example (Greenfield Fullstack):**

```
Analyst → PM:
  Handoff: project-brief.md
  Location: docs/project-brief.md
  Next: "PRD is ready. Save it as docs/prd.md in your project"

PM → UX Expert:
  Handoff: prd.md
  Location: docs/prd.md
  Next: "Create the UI/UX specification"

UX Expert → Architect:
  Handoff: front-end-spec.md
  Location: docs/front-end-spec.md
  Next: "Create the fullstack architecture"

Architect → PO:
  Handoff: fullstack-architecture.md
  Location: docs/fullstack-architecture.md
  Next: "Validate all artifacts for consistency"

PO → SM:
  Handoff: Sharded docs (prd/, architecture/)
  Location: docs/prd/, docs/architecture/
  Next: "Begin story creation"
```

### Web UI to IDE Transition

**Critical Transition Point**: After planning phase, transition from web UI to IDE.

**Steps**:
1. Complete planning in web UI (Claude, Gemini, GPT)
2. Copy final artifacts to project `docs/` folder
3. Open project in IDE (Claude Code, Cursor, Windsurf)
4. PO shards documents (PRD, Architecture)
5. Begin development cycle (SM → Dev → QA)

### IDE Integration Modes

**Claude Code / OpenCode:**
- Commands via slash commands: `/sm`, `/dev`, `/qa`
- Configuration: `opencode.jsonc` with agent definitions
- Agent activation via slash command

**Cursor / Windsurf:**
- Commands via `@` mentions: `@sm`, `@dev`, `@qa`
- Configuration: Agent rules in `.cursorrules` or similar
- Agent activation via @ mention

**Codex (CLI & Web):**
- Natural language: "As dev, implement story 1.1"
- Configuration: `AGENTS.md` with agent directory
- Agent activation via natural language

---

## Conclusion

The BMad framework architecture is characterized by:

1. **Self-contained agents** with embedded configurations
2. **Lazy-loaded dependencies** for efficient context usage
3. **Configuration-driven behavior** for project flexibility
4. **File-based state management** for collaboration
5. **Persona-based interaction** for user-friendly experience
6. **Sequential task workflows** for repeatability
7. **Template-driven generation** for consistency
8. **Quality gates** for advisory guidance

This architecture enables a scalable, maintainable, and user-friendly AI-driven development methodology that can be reproduced in Google Vertex AI Platform using the Agent Development Kit.

---

**Next Steps**:
- Complete component inventory
- Create framework overview diagrams
- Document data flow patterns
- Begin Phase 2: Agent-by-agent deep dive

**Status**: Phase 1 In Progress (Section 1-6 Complete)
