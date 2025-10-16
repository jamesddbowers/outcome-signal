# BMad-Master Agent - Universal Task Executor

**Agent ID**: `bmad-master`
**Agent Name**: BMad Master
**Icon**: 🧙
**Version Analyzed**: BMad Core v4

---

## 1. Identity & Role

### Agent Name and Icon
- **Name**: BMad Master
- **ID**: `bmad-master`
- **Title**: BMad Master Task Executor
- **Icon**: 🧙

### Role Definition
The BMad-Master agent serves as the **Universal Task Executor & BMad Method Expert**, operating fundamentally differently from all other specialized agents. Unlike PM, Dev, QA, or other role-specific agents that adopt personas and transform their behavior, BMad-Master executes any BMad resource directly without persona transformation. It is the "swiss army knife" of the framework - capable of running any task, template, or checklist across all domains.

### When to Use This Agent
The BMad-Master agent should be activated for:
- **Comprehensive multi-domain expertise** - When you need capabilities across planning, architecture, development, and QA without switching agents
- **One-off task execution** - Running isolated tasks that don't require full persona immersion
- **Generic task execution** - Executing any BMad resource without adopting specialized agent roles
- **Knowledge base consultation** - Accessing BMad framework documentation and methodology guidance (via KB mode)
- **Document processing** - Creating documents, executing checklists, or sharding documentation
- **Quick operations** - When switching specialized agents would be inefficient
- **Learning the framework** - Understanding BMad methodology and resource capabilities

### Persona Characteristics

**Role**: Master Task Executor & BMad Method Expert

**Identity**: Universal executor of all BMad-Method capabilities, directly runs any resource

**Style**: Pragmatic, flexible, efficient, direct, methodology-aware

**Key Distinction**: Unlike specialized agents (PM, Dev, QA, etc.) that adopt personas and transform their behavior, BMad-Master:
- **Does NOT** transform into different personas
- **Does NOT** adopt role-specific personalities or styles
- **DOES** execute any task, template, or checklist directly
- **DOES** maintain awareness of all BMad resources and methodology
- **DOES** present all choices as numbered lists for easy selection

**Focus Areas**:
- Direct task execution without persona overhead
- Runtime resource loading (never pre-loads dependencies)
- Universal access to all BMad capabilities
- Knowledge base consultation for methodology questions
- Efficient multi-domain operations

---

## 2. Core Principles

The BMad-Master agent operates according to five fundamental guiding principles that differentiate it from specialized agents:

### 1. Execute Without Persona Transformation
- Run any task directly without adopting a specialized persona
- Maintain neutral, efficient execution style
- Focus on task completion rather than role immersion
- No behavioral transformation based on domain

### 2. Runtime Resource Loading
- **NEVER** pre-load resources during activation
- Load tasks, templates, checklists, and data files **ONLY** when commanded
- Exception: Always reads `core-config.yaml` during activation
- Lazy dependency resolution minimizes context bloat
- Efficient resource utilization

### 3. Expert Knowledge of All BMad Resources (When Using KB Mode)
- Toggle KB mode to access complete BMad methodology documentation
- Loads `.bmad-core/data/bmad-kb.md` for framework guidance
- Answers methodology questions with authoritative knowledge
- Explains resource usage, workflow patterns, and best practices
- **CRITICAL**: NEVER loads KB file unless user explicitly types `*kb`

### 4. Always Present Numbered Lists for Choices
- All task lists, template lists, checklist lists presented as numbered options
- User can type number to select or execute
- Reduces friction in command execution
- Consistent interaction pattern across all operations

### 5. Process (*) Commands Immediately
- All commands require `*` prefix (e.g., `*help`, `*create-doc`, `*kb`)
- Immediate command processing without confirmation
- Clear command syntax enables efficient execution
- No ambiguity in command invocation

### 6. Follow Task Instructions Exactly
- When executing tasks from dependencies, follow instructions exactly as written
- Tasks are executable workflows, NOT reference material
- **CRITICAL**: Tasks with `elicit=true` require user interaction using exact specified format
- **NEVER** skip elicitation for efficiency
- Task instructions override any conflicting base behavioral constraints

### 7. Stay Minimal at Activation
- On activation: Greet user, auto-run `*help`, then HALT
- Do NOT scan filesystem or load resources during startup
- Do NOT run discovery tasks automatically
- Wait for user to request assistance or give commands
- Exception: If activation includes commands in arguments, execute those

---

## 3. Commands

All BMad-Master commands require the `*` prefix when invoked (e.g., `*help`).

### Command Reference

| Command | Description | Task/Template Used |
|---------|-------------|-------------------|
| `*help` | Show these listed commands in a numbered list | N/A (built-in) |
| `*create-doc {template}` | Execute task create-doc with specified template<br>If no template specified, shows available templates | Task: `create-doc.md`<br>Templates: All 11 templates |
| `*doc-out` | Output full document to current destination file | N/A (document output utility) |
| `*document-project` | Execute the document-project task (brownfield documentation) | Task: `document-project.md` |
| `*execute-checklist {checklist}` | Run task execute-checklist with specified checklist<br>If no checklist specified, shows available checklists | Task: `execute-checklist.md`<br>Checklists: All 6 checklists |
| `*kb` | Toggle KB mode off (default) or on<br>When on, loads bmad-kb.md and answers framework questions | Data: `bmad-kb.md` |
| `*shard-doc {document} {destination}` | Run the shard-doc task against provided document to specified destination | Task: `shard-doc.md` |
| `*task {task}` | Execute specified task<br>If not found or none specified, lists available tasks | Tasks: All 13 tasks |
| `*yolo` | Toggle YOLO Mode (fast-track vs interactive) | N/A (mode toggle) |
| `*exit` | Exit agent mode (with confirmation) | N/A (exit command) |

### Command Usage Patterns

**Direct Execution Commands**:
- `*create-doc {template}` - Template-driven document creation
- `*document-project` - Brownfield project documentation
- `*execute-checklist {checklist}` - Checklist validation
- `*shard-doc {document} {destination}` - Document sharding
- `*task {task}` - Any task execution

**Discovery Commands** (no resource specified):
- `*create-doc` - Lists all 11 available templates
- `*execute-checklist` - Lists all 6 available checklists
- `*task` - Lists all 13 available tasks

**Mode Toggle Commands**:
- `*kb` - Toggle Knowledge Base mode for methodology questions
- `*yolo` - Toggle between interactive and fast-track modes

**Utility Commands**:
- `*help` - Shows all available commands
- `*doc-out` - Exports current document
- `*exit` - Terminates agent session

---

## 4. Dependencies

The BMad-Master agent has **universal access** to all BMad resources but loads them **only on demand**. This is the most comprehensive dependency list in the framework.

### Required Tasks (13)
Location: `.bmad-core/tasks/`

1. **`advanced-elicitation.md`**
   - Purpose: Provides 9 optional reflective/brainstorming methods to enhance content quality
   - Used by: create-doc workflow after drafting sections
   - Supports: Deep exploration, critique, alternative generation

2. **`brownfield-create-epic.md`**
   - Purpose: Create single epic for focused brownfield enhancements (when full PRD is overkill)
   - Used by: `*task brownfield-create-epic` or create-doc with brownfield-prd-tmpl
   - Output: Single epic file

3. **`brownfield-create-story.md`**
   - Purpose: Create individual story for small, isolated brownfield changes
   - Used by: `*task brownfield-create-story`
   - Output: Single story file

4. **`correct-course.md`**
   - Purpose: Navigate scope changes, pivots, and mid-project adjustments
   - Used by: `*task correct-course`
   - Output: Sprint Change Proposal with impact analysis

5. **`create-deep-research-prompt.md`**
   - Purpose: Generates comprehensive research prompts for various investigation types
   - Used by: `*task create-deep-research-prompt`
   - Supports: 9 research focus types

6. **`create-doc.md`**
   - Purpose: **CORE TASK** - YAML-driven template processing and document creation engine
   - Used by: `*create-doc {template}` command
   - Critical Features: Section-by-section elicitation, interactive vs YOLO modes, mandatory user interaction for elicit=true sections
   - Powers: All template-based document creation across all domains

7. **`create-next-story.md`**
   - Purpose: **COMPLEX WORKFLOW** - 6-step sequential story creation from sharded epics
   - Used by: `*task create-next-story`
   - Note: Typically used by SM agent, but available to BMad-Master
   - Warning: SM agent optimized for this workflow

8. **`document-project.md`**
   - Purpose: Generate comprehensive documentation for existing (brownfield) projects
   - Used by: `*document-project` command
   - Output: Single comprehensive brownfield architecture document
   - Key Feature: PRD-aware focused documentation

9. **`execute-checklist.md`**
   - Purpose: **VALIDATION FRAMEWORK** - Systematic checklist execution with embedded LLM prompts
   - Used by: `*execute-checklist {checklist}` command
   - Modes: Interactive (section-by-section) or YOLO (comprehensive batch)
   - Powers: All checklist-based validation across all domains

10. **`facilitate-brainstorming-session.md`**
    - Purpose: Run structured brainstorming sessions with multiple technique options
    - Used by: `*task facilitate-brainstorming-session`
    - Supports: 20 brainstorming techniques, 4 approach options

11. **`generate-ai-frontend-prompt.md`**
    - Purpose: Generate prompts for AI code generation tools (v0, Lovable, etc.)
    - Used by: `*task generate-ai-frontend-prompt`
    - Output: 4-part structured prompt for UI generation

12. **`index-docs.md`**
    - Purpose: Create index files for sharded document collections
    - Used by: `*task index-docs`
    - Output: Index markdown files with links to shards

13. **`shard-doc.md`**
    - Purpose: **CRITICAL TASK** - Split monolithic documents into manageable shards
    - Used by: `*shard-doc {document} {destination}` command
    - Modes: Automatic (md-tree explode) or manual
    - Essential: Planning→Development transition

### Required Templates (11)
Location: `.bmad-core/templates/`

**Planning Templates (6)**:

1. **`project-brief-tmpl.yaml`**
   - Output: `docs/brief.md`
   - Mode: Interactive with advanced elicitation
   - Purpose: Foundation document for new projects

2. **`prd-tmpl.yaml`**
   - Output: `docs/prd.md`
   - Mode: Interactive with mandatory elicitation
   - Purpose: Greenfield product requirements

3. **`brownfield-prd-tmpl.yaml`**
   - Output: `docs/brownfield-prd.md`
   - Mode: Interactive with mandatory elicitation
   - Purpose: Enhancement planning for existing systems

4. **`market-research-tmpl.yaml`**
   - Output: `docs/market-research.md`
   - Mode: Interactive with advanced elicitation
   - Purpose: Market analysis and opportunity assessment

5. **`competitor-analysis-tmpl.yaml`**
   - Output: `docs/competitor-analysis.md`
   - Mode: Interactive with advanced elicitation
   - Purpose: Competitive landscape analysis

6. **`brainstorming-output-tmpl.yaml`**
   - Output: `docs/brainstorming-session-results.md`
   - Mode: Non-interactive (populated by task)
   - Purpose: Brainstorming session documentation

**Architecture Templates (5)**:

7. **`architecture-tmpl.yaml`**
   - Output: `docs/architecture.md`
   - Mode: Interactive with advanced elicitation
   - Purpose: Backend-focused system architecture (652 lines, 16 sections)

8. **`fullstack-architecture-tmpl.yaml`**
   - Output: `docs/fullstack-architecture.md`
   - Mode: Interactive with advanced elicitation
   - Purpose: Unified fullstack architecture (825 lines, 20+ sections)

9. **`front-end-architecture-tmpl.yaml`**
   - Output: `docs/frontend-architecture.md`
   - Mode: Interactive with advanced elicitation
   - Purpose: Frontend-specific architecture

10. **`brownfield-architecture-tmpl.yaml`**
    - Output: `docs/brownfield-architecture.md`
    - Mode: Interactive with advanced elicitation
    - Purpose: Existing project enhancement architecture

11. **`front-end-spec-tmpl.yaml`**
    - Output: `docs/frontend-spec.md`
    - Mode: Interactive with advanced elicitation
    - Purpose: UI/UX specification with component details

**Development Templates (1)**:

12. **`story-tmpl.yaml`**
    - Output: `docs/stories/{epic}.{story}-{slug}.md`
    - Mode: Non-interactive (populated by create-next-story task)
    - Purpose: User story structure with section permissions
    - Note: Typically managed by SM/Dev agents

### Required Checklists (6)
Location: `.bmad-core/checklists/`

1. **`architect-checklist.md`**
   - Purpose: Architecture validation (199+ items, 10 sections)
   - Used by: execute-checklist for architecture review
   - Scope: Technical design, scalability, AI suitability

2. **`change-checklist.md`**
   - Purpose: Change navigation and Sprint Change Proposal generation (185 lines, 6 sections)
   - Used by: correct-course task
   - Scope: Scope changes, pivots, impact analysis

3. **`pm-checklist.md`**
   - Purpose: PRD validation (9 categories)
   - Used by: execute-checklist for PRD review
   - Scope: Requirements completeness, feasibility, clarity

4. **`po-master-checklist.md`**
   - Purpose: **MOST COMPREHENSIVE** - Planning→Development transition validation (435 lines, 10 categories, 200+ items)
   - Used by: execute-checklist for master validation
   - Scope: All artifacts, cohesion, implementation readiness
   - Conditional: Greenfield/Brownfield/UI-specific sections

5. **`story-dod-checklist.md`**
   - Purpose: Definition of Done self-assessment (7 validation categories)
   - Used by: execute-checklist during story completion
   - Scope: Requirements, testing, coding standards, documentation

6. **`story-draft-checklist.md`**
   - Purpose: Story validation (5 categories)
   - Used by: execute-checklist for pre-implementation story review
   - Scope: Goal clarity, technical guidance, self-containment, testing

### Required Data Files (4)
Location: `.bmad-core/data/`

1. **`bmad-kb.md`**
   - Purpose: **CRITICAL** - Complete BMad framework documentation and methodology knowledge base
   - Used by: KB mode (`*kb` command)
   - Content: Framework overview, agent system, workflows, best practices, troubleshooting
   - Size: 810+ lines of comprehensive documentation
   - Loading Rule: **NEVER** load unless user explicitly types `*kb`

2. **`brainstorming-techniques.md`**
   - Purpose: 20 brainstorming techniques categorized into 5 groups
   - Used by: facilitate-brainstorming-session task
   - Categories: Classic, Constraint-Based, Visual/Spatial, Analytical, Role-Based

3. **`elicitation-methods.md`**
   - Purpose: 9 advanced elicitation options for content refinement
   - Used by: advanced-elicitation task
   - Methods: Deeper questioning, critique, alternatives, scenarios, assumptions, etc.

4. **`technical-preferences.md`**
   - Purpose: User's persistent technical profile (languages, frameworks, tools, patterns)
   - Used by: All template creation workflows
   - Ensures: Consistency across projects, personalized recommendations

### Required Workflows (6)
Location: `.bmad-core/workflows/`

1. **`greenfield-fullstack.yaml`**
   - Purpose: End-to-end workflow for new fullstack projects
   - Agents: Analyst → PM → Architect → UX Expert → PO → SM → Dev → QA cycle

2. **`greenfield-service.yaml`**
   - Purpose: End-to-end workflow for new backend services
   - Agents: Analyst → PM → Architect → PO → SM → Dev → QA cycle

3. **`greenfield-ui.yaml`**
   - Purpose: End-to-end workflow for new frontend projects
   - Agents: Analyst → PM → UX Expert → PO → SM → Dev → QA cycle

4. **`brownfield-fullstack.yaml`**
   - Purpose: Enhancement workflow for existing fullstack projects
   - Agents: Analyst (document-project) → PM → Architect → UX Expert → PO → SM → Dev → QA cycle

5. **`brownfield-service.yaml`**
   - Purpose: Enhancement workflow for existing backend services
   - Agents: Analyst (document-project) → PM → Architect → PO → SM → Dev → QA cycle

6. **`brownfield-ui.yaml`**
   - Purpose: Enhancement workflow for existing frontend projects
   - Agents: Analyst (document-project) → PM → UX Expert → PO → SM → Dev → QA cycle

---

## 5. Workflows

Unlike specialized agents that have focused workflows, BMad-Master can execute **any workflow** by directly invoking the appropriate tasks and templates. Below are the primary usage patterns:

### Workflow 1: Universal Document Creation
**Command**: `*create-doc {template}`
**Process Flow**:
1. User invokes `*create-doc` with or without template name
2. If no template specified:
   - Agent lists all 11 available templates as numbered options
   - User selects template by number or name
3. Agent loads specified template YAML from `.bmad-core/templates/`
4. Agent executes `create-doc.md` task with selected template
5. Task processes template sections:
   - For sections with `elicit: true` → Interactive user dialogue
   - For sections with `elicit: false` → Direct generation
   - For sections with advanced elicitation → Offer 9 refinement options
6. Agent generates final markdown document
7. Agent saves to specified output location
8. Agent offers `*doc-out` to export full document

**Templates Available**:
- project-brief-tmpl.yaml
- prd-tmpl.yaml
- brownfield-prd-tmpl.yaml
- market-research-tmpl.yaml
- competitor-analysis-tmpl.yaml
- brainstorming-output-tmpl.yaml
- architecture-tmpl.yaml
- fullstack-architecture-tmpl.yaml
- front-end-architecture-tmpl.yaml
- brownfield-architecture-tmpl.yaml
- front-end-spec-tmpl.yaml

**YOLO Mode**: Toggle with `*yolo` to skip interactive elicitation and generate full document quickly

### Workflow 2: Universal Checklist Execution
**Command**: `*execute-checklist {checklist}`
**Process Flow**:
1. User invokes `*execute-checklist` with or without checklist name
2. If no checklist specified:
   - Agent lists all 6 available checklists as numbered options
   - User selects checklist by number or name
3. Agent loads specified checklist from `.bmad-core/checklists/`
4. Agent executes `execute-checklist.md` task with selected checklist
5. Task offers execution mode:
   - **Interactive Mode**: Section-by-section validation with user review
   - **YOLO Mode**: Comprehensive batch validation
6. Agent validates items with embedded LLM guidance:
   - Checks each item against project artifacts
   - Provides evidence-based assessment
   - Flags gaps, inconsistencies, or issues
7. Agent generates validation report:
   - Findings by category
   - PASS/FAIL/CONCERNS assessment
   - Specific recommendations for fixes
8. Agent saves assessment to appropriate location

**Checklists Available**:
- architect-checklist.md (10 sections, 199+ items)
- change-checklist.md (6 sections)
- pm-checklist.md (9 categories)
- po-master-checklist.md (10 categories, 200+ items) - **MOST COMPREHENSIVE**
- story-dod-checklist.md (7 categories)
- story-draft-checklist.md (5 categories)

### Workflow 3: Document Sharding
**Command**: `*shard-doc {document} {destination}`
**Process Flow**:
1. User provides document path and destination folder
2. Agent loads document from specified path
3. Agent executes `shard-doc.md` task
4. Task attempts automatic sharding:
   - Uses md-tree parser if available
   - Splits on Level 2 headings (`##`)
   - Preserves front matter and metadata
   - Creates slug-based filenames
5. If automatic fails, task performs manual sharding:
   - Reads document structure
   - Identifies sections
   - Creates individual files
   - Generates index file
6. Agent creates destination folder structure:
   - `{destination}/` - Sharded section files
   - `{destination}/index.md` - Index with links to shards
7. Agent reports sharding results:
   - Number of shards created
   - File naming convention used
   - Location of index file

**Typical Usage**:
- `*shard-doc docs/prd.md prd` → Creates `docs/prd/` folder with epic files
- `*shard-doc docs/architecture.md architecture` → Creates `docs/architecture/` folder with architecture sections

**Critical for**: Planning→Development transition (monolithic docs become manageable shards for Dev/SM agents)

### Workflow 4: Brownfield Project Documentation
**Command**: `*document-project`
**Process Flow**:
1. Agent executes `document-project.md` task
2. Task checks for existing PRD:
   - **If PRD exists**: Focused documentation of relevant areas only
   - **If no PRD**: Comprehensive full project documentation
3. Task offers output format options:
   - **Single document**: One comprehensive architecture file (Web UI friendly)
   - **Sharded documents**: Multiple focused files (IDE friendly)
4. Task analyzes project:
   - Scans codebase structure
   - Identifies technologies and patterns
   - Documents data models and APIs
   - Maps component relationships
   - Captures configuration and dependencies
5. Task generates documentation:
   - **For Web UI**: Single `docs/brownfield-architecture.md`
   - **For IDE**: Sharded files in `docs/architecture/`
6. Task includes:
   - What EXISTS (including technical debt)
   - Evidence-based recommendations
   - Integration points and constraints
   - Risk assessment

**Output**: Comprehensive brownfield architecture document ready for enhancement planning

### Workflow 5: Knowledge Base Consultation (KB Mode)
**Command**: `*kb`
**Process Flow**:
1. User toggles KB mode with `*kb` command
2. Agent loads `.bmad-core/data/bmad-kb.md` (810+ lines)
3. Agent switches to "Knowledge Base Expert" mode
4. User asks questions about BMad methodology:
   - How does the framework work?
   - What are the workflow phases?
   - How do I use specific agents?
   - What are best practices?
   - How do I troubleshoot issues?
5. Agent answers with authoritative guidance from KB:
   - Framework architecture and philosophy
   - Agent system and roles
   - Complete workflow explanations
   - Environment selection (Web UI vs IDE)
   - Cost-saving strategies
   - Troubleshooting and best practices
6. User toggles `*kb` again to exit KB mode
7. Agent unloads KB file and returns to normal task execution mode

**Use Cases**:
- Learning BMad methodology
- Understanding workflow transitions
- Clarifying agent roles and responsibilities
- Getting setup and configuration help
- Understanding best practices
- Troubleshooting issues

**CRITICAL**: KB file is **NEVER** loaded automatically - only when user explicitly types `*kb`

### Workflow 6: Generic Task Execution
**Command**: `*task {task}`
**Process Flow**:
1. User invokes `*task` with or without task name
2. If no task specified:
   - Agent lists all 13 available tasks as numbered options
   - User selects task by number or name
3. Agent loads specified task from `.bmad-core/tasks/`
4. Agent reads task instructions (tasks are executable workflows)
5. Agent follows task instructions exactly:
   - Performs required elicitation
   - Executes sequential steps
   - Applies validation rules
   - Generates required outputs
6. Agent completes task and reports results

**Tasks Available**:
- advanced-elicitation.md
- brownfield-create-epic.md
- brownfield-create-story.md
- correct-course.md
- create-deep-research-prompt.md
- create-doc.md
- create-next-story.md
- document-project.md
- execute-checklist.md
- facilitate-brainstorming-session.md
- generate-ai-frontend-prompt.md
- index-docs.md
- shard-doc.md

**Note**: Most tasks are also accessible via specific commands (e.g., `*create-doc` wraps `create-doc.md` task)

---

## 6. Outputs

### Artifact Types Created
BMad-Master can create **any artifact** in the framework depending on which task/template is executed:

**Planning Documents**:
- `docs/brief.md` - Project brief
- `docs/prd.md` - Product requirements (greenfield)
- `docs/brownfield-prd.md` - Product requirements (brownfield)
- `docs/market-research.md` - Market analysis
- `docs/competitor-analysis.md` - Competitive analysis
- `docs/brainstorming-session-results.md` - Brainstorming outputs

**Architecture Documents**:
- `docs/architecture.md` - Backend architecture
- `docs/fullstack-architecture.md` - Fullstack architecture
- `docs/frontend-architecture.md` - Frontend architecture
- `docs/brownfield-architecture.md` - Brownfield architecture
- `docs/frontend-spec.md` - Frontend specification

**Sharded Documents**:
- `docs/prd/` - Sharded PRD sections (epics)
- `docs/architecture/` - Sharded architecture sections
- `docs/prd/index.md` - PRD index
- `docs/architecture/index.md` - Architecture index

**Development Artifacts**:
- `docs/stories/{epic}.{story}-{slug}.md` - User stories

**Validation Reports**:
- Checklist execution results (location varies by checklist)
- Sprint Change Proposals (from correct-course task)
- Research prompts (from create-deep-research-prompt task)

### File Naming Conventions
BMad-Master follows standard BMad naming conventions:
- **Documents**: Lowercase with hyphens (e.g., `prd.md`, `frontend-spec.md`)
- **Sharded files**: Section-based slugs (e.g., `goals-and-background.md`)
- **Stories**: `{epic}.{story}-{slug}.md` (e.g., `1.1-user-authentication.md`)
- **Index files**: `index.md` in shard directories

### Output Locations
Default locations (configurable via `core-config.yaml`):
- **Planning docs**: `docs/`
- **Sharded PRD**: `docs/prd/`
- **Sharded architecture**: `docs/architecture/`
- **Stories**: `docs/stories/`
- **Brainstorming**: `docs/brainstorming-session-results.md`

### Section Update Permissions
Unlike specialized agents with restricted section permissions (e.g., Dev can only update specific story sections), **BMad-Master has no permission restrictions**. It can:
- Create any document from scratch
- Update any section of any document
- Execute any task regardless of typical agent ownership
- Modify any artifact type

**Important**: This flexibility is a feature for one-off operations, but for sustained workflows, specialized agents (SM for stories, Dev for implementation) produce better results due to their tuned personas.

---

## 7. Integration Points

### Handoffs to Other Agents
BMad-Master does NOT typically "hand off" to other agents because it doesn't follow structured multi-agent workflows. However, it can:

**Replace any agent for one-off operations**:
- Execute PM tasks without PM persona
- Execute Architect tasks without Architect persona
- Execute QA tasks without QA persona
- Execute any specialized agent's tasks

**Exception - Development Workflow**:
According to BMad KB documentation, even when using BMad-Master for planning phases:
- **ALWAYS use SM agent for story creation** - Never use bmad-master
- **ALWAYS use Dev agent for implementation** - Never use bmad-master
- **Why**: SM and Dev agents are specifically optimized for development workflow
- **No exceptions**: Story creation and implementation require specialized agents

**Typical Handoff Pattern**:
1. User uses BMad-Master for planning doc creation
2. User uses BMad-Master or PO for document sharding
3. User **MUST switch to SM agent** for story creation
4. User **MUST switch to Dev agent** for implementation
5. User may return to BMad-Master for other tasks

### Shared Artifacts
BMad-Master reads and writes all shared artifacts:
- Reads: Any document created by any agent
- Writes: Any document it creates
- Updates: Any document regardless of original author
- Validates: Any artifact via checklist execution

**No ownership boundaries** - BMad-Master is agent-agnostic

### Workflow Dependencies
BMad-Master can invoke any workflow but typically:
- Does NOT follow structured greenfield/brownfield workflow sequences
- Used for individual workflow steps, not complete multi-agent orchestrations
- User orchestrates manually by invoking specific commands/tasks
- Best for: Ad-hoc operations, document creation, validation, sharding

**For complete workflows**: Use BMad-Orchestrator (web environments) or structured agent sequences (IDE environments)

---

## 8. Special Features

### KB Mode (Knowledge Base Expert)
**Most Unique Feature**: BMad-Master is the **ONLY** agent with access to the complete BMad framework knowledge base.

**Activation**: `*kb` command
**Loading Behavior**: Loads `.bmad-core/data/bmad-kb.md` (810+ lines)
**Mode Characteristics**:
- Agent becomes "BMad Methodology Expert"
- Answers framework questions authoritatively
- Explains workflows, agents, best practices
- Provides troubleshooting guidance
- References complete documentation

**KB Content Covers**:
- Framework overview and philosophy
- Vibe CEO approach and core principles
- Two-phase workflow (Planning in Web, Development in IDE)
- Complete agent system with role descriptions
- Development loop (SM → Dev → QA cycle)
- Environment selection guide (Web UI vs IDE)
- Core configuration (core-config.yaml)
- Complete workflow explanations
- Team configurations
- Document creation best practices
- Cost-saving strategies
- Expansion pack system
- Contributing guidelines

**Exit KB Mode**: Toggle `*kb` again to exit and unload KB file

**CRITICAL RULE**: KB file is **NEVER** loaded during activation or automatically - only when user explicitly types `*kb`

### No Persona Transformation
**Key Differentiator**: BMad-Master is the only agent that:
- Does NOT adopt personas
- Does NOT transform behavior based on domain
- Maintains consistent, neutral, efficient execution style
- Executes tasks "as is" without role immersion

**Comparison**:
- **PM Agent**: Adopts "Investigative Product Strategist" persona, writes with PM voice
- **Dev Agent**: Adopts "Expert Senior Software Engineer" persona, thinks like developer
- **QA Agent**: Adopts "Pragmatic Senior QA Engineer" persona, reviews with QA mindset
- **BMad-Master**: Executes tasks directly without persona overlay

**When This Matters**:
- One-off operations where persona isn't needed
- Multi-domain work where switching personas is inefficient
- Generic task execution
- Learning/exploration mode

**When Specialized Agents Are Better**:
- Sustained work in one domain (PM for PRDs, Architect for architecture)
- When persona adds value (UX Expert for frontend design)
- **CRITICAL**: Story creation (use SM) and implementation (use Dev)

### Universal Resource Access
**Comprehensive Dependencies**: BMad-Master has access to:
- **13 tasks** - Most of any agent
- **11 templates** - All templates in framework
- **6 checklists** - All checklists in framework
- **4 data files** - Including unique KB access
- **6 workflows** - All workflow definitions

**No Other Agent Has**:
- Access to ALL templates (specialized agents have subset)
- Access to ALL checklists (specialized agents have subset)
- Access to bmad-kb.md (unique to BMad-Master)
- Universal task execution capability

### Runtime Dependency Loading
**Efficiency Feature**: BMad-Master:
- NEVER pre-loads dependencies during activation
- Loads resources ONLY when commanded
- Exception: Always reads `core-config.yaml` at activation
- Minimizes context window usage
- Enables efficient multi-domain operations

**Activation Behavior**:
1. Read complete agent definition (bmad-master.md)
2. Load `core-config.yaml` (project configuration)
3. Greet user with name/role
4. Auto-run `*help` to display available commands
5. **HALT** - Wait for user to request assistance

**DO NOT**:
- Load any other agent files during activation
- Scan filesystem or discover resources
- Run discovery tasks automatically
- Load bmad-kb.md (unless user types `*kb`)

**Resource Loading**:
- Tasks: Load when user invokes `*task {name}` or command that wraps task
- Templates: Load when user invokes `*create-doc {template}`
- Checklists: Load when user invokes `*execute-checklist {checklist}`
- Data: Load when task requires (e.g., technical-preferences during create-doc)
- KB: Load ONLY when user types `*kb`

### YOLO Mode Toggle
**Efficiency Feature**: Toggle between:
- **Interactive Mode** (default): Section-by-section elicitation, user dialogue, refinement options
- **YOLO Mode**: Fast-track document creation, minimal interaction, batch generation

**Command**: `*yolo`
**Effect**: Applies to create-doc and execute-checklist workflows
**When to Use**:
- YOLO: Quick drafts, time-sensitive, trust AI generation
- Interactive: High-quality docs, critical artifacts, want control

### Numbered Options Protocol
**Usability Feature**: All resource listings presented as numbered options:
```
Available Templates:
1. project-brief-tmpl.yaml
2. prd-tmpl.yaml
3. brownfield-prd-tmpl.yaml
4. architecture-tmpl.yaml
...

Type number to select or template name.
```

**User Experience**:
- Type `1` or `project-brief-tmpl.yaml` - both work
- Reduces friction in command execution
- Consistent across all command/task/template/checklist listings
- Makes BMad-Master highly usable for exploration and learning

---

## 9. Configuration Requirements

### core-config.yaml
BMad-Master always loads `core-config.yaml` at activation to understand project structure.

**Required Configuration Sections**:
```yaml
# PRD Configuration
prdVersion: v3 | v4
prdSharded: true | false
prdShardedLocation: docs/prd  # if sharded
epicFilePattern: epic-{n}*.md  # if sharded

# Architecture Configuration
architectureVersion: v3 | v4
architectureSharded: true | false
architectureShardedLocation: docs/architecture  # if sharded

# Developer Configuration
devStoryLocation: docs/stories
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md

# Debugging
devDebugLog: docs/stories/dev-debug.log
agentCoreDump: docs/agent-exports
```

**How BMad-Master Uses Configuration**:
- Document sharding: Reads target locations for shard output
- Story creation: Understands PRD/architecture structure (v3 vs v4)
- Task execution: Adapts to project conventions
- Validation: Checklist execution uses configuration context

### Markdown Tree Parser Integration
For automatic document sharding, BMad-Master can leverage:
- **Manual sharding**: Built-in task logic
- **Automatic sharding**: `@kayvan/markdown-tree-parser` if available
- **Graceful degradation**: Falls back to manual if parser unavailable

### File System Expectations
BMad-Master expects standard BMad project structure:
```
project/
├── .bmad-core/          # Framework resources (agents, tasks, templates)
│   ├── agents/
│   ├── tasks/
│   ├── templates/
│   ├── checklists/
│   ├── data/
│   ├── workflows/
│   └── core-config.yaml
├── docs/                # Project documentation
│   ├── brief.md
│   ├── prd.md
│   ├── architecture.md
│   ├── prd/             # Sharded PRD (if v4)
│   ├── architecture/    # Sharded architecture (if v4)
│   └── stories/         # User stories
└── [project source code]
```

---

## 10. Execution Examples

### Example 1: Create PRD Without Switching Agents
**Scenario**: User wants to create PRD but doesn't want to switch to PM agent

**User**: `@bmad-master`
**Agent**: *Loads agent, reads core-config.yaml, greets, runs *help*

**User**: `*create-doc prd`
**Agent**:
- Loads `prd-tmpl.yaml` from `.bmad-core/templates/`
- Executes `create-doc.md` task
- Processes template sections sequentially
- For sections with `elicit: true` (mandatory):
  - "Let's define the Goals and Background Context. What problem are you solving?"
  - User provides input
  - Agent drafts section
  - Offers advanced elicitation (9 options)
  - User refines or approves
- For sections with `elicit: false`:
  - Agent generates based on context
- Continues through all sections
- Saves final output to `docs/prd.md`

**Result**: Complete PRD created without PM persona, but with same template and process

### Example 2: Execute Master Checklist for Validation
**Scenario**: Ready to transition from planning to development, need validation

**User**: `@bmad-master`
**Agent**: *Active*

**User**: `*execute-checklist`
**Agent**:
```
Available Checklists:
1. architect-checklist.md
2. change-checklist.md
3. pm-checklist.md
4. po-master-checklist.md ← Most Comprehensive
5. story-dod-checklist.md
6. story-draft-checklist.md

Type number to select or checklist name.
```

**User**: `4`
**Agent**:
- Loads `po-master-checklist.md` (435 lines, 10 categories, 200+ items)
- Executes `execute-checklist.md` task
- Offers execution mode:
  - "Interactive (section-by-section) or YOLO (comprehensive batch)?"
- User selects Interactive
- Agent validates each category:
  1. PRD Structure & Completeness
  2. Architecture Document Quality
  3. Epic & Story Breakdown
  4. Technical Guidance Quality
  5. Document Cohesion & Consistency
  6. Implementation Readiness
  7. Risk Management
  8. Sharding Readiness
  9. Team Readiness
  10. Final Go/No-Go Decision
- For each item:
  - Checks against project artifacts
  - Provides evidence-based assessment (PASS/FAIL/CONCERNS)
  - Cites specific sections as evidence
- Generates validation report with findings
- Produces GO/NO-GO recommendation

**Result**: Comprehensive validation without PO persona, identifies gaps before development starts

### Example 3: Shard Documents for Development
**Scenario**: PRD and Architecture docs created in Web UI, now need to shard for IDE development

**User**: `@bmad-master`
**Agent**: *Active*

**User**: `*shard-doc docs/prd.md prd`
**Agent**:
- Loads `shard-doc.md` task
- Reads `docs/prd.md`
- Attempts automatic sharding (md-tree if available)
- Identifies Level 2 headings as section boundaries:
  - `## Goals and Background Context`
  - `## Requirements`
  - `## Epic 1: User Authentication`
  - `## Epic 2: Dashboard`
  - ...
- Creates `docs/prd/` directory
- Generates shard files:
  - `docs/prd/goals-and-background-context.md`
  - `docs/prd/requirements.md`
  - `docs/prd/epic-1-user-authentication.md`
  - `docs/prd/epic-2-dashboard.md`
  - ...
- Creates `docs/prd/index.md` with links to all shards
- Reports: "Sharded docs/prd.md into 8 sections in docs/prd/"

**User**: `*shard-doc docs/architecture.md architecture`
**Agent**: *Repeats sharding process for architecture document*

**Result**: Monolithic planning docs converted to manageable shards ready for SM/Dev workflow

### Example 4: KB Mode - Learn About Development Workflow
**Scenario**: User is new to BMad, needs to understand the development cycle

**User**: `@bmad-master`
**Agent**: *Active*

**User**: `*kb`
**Agent**:
- Loads `.bmad-core/data/bmad-kb.md` (810+ lines)
- Switches to Knowledge Base Expert mode
- "Knowledge Base mode activated. I can now answer questions about the BMad methodology, workflows, agents, and best practices. What would you like to know?"

**User**: "How does the SM → Dev → QA cycle work?"
**Agent**:
- References KB section "Complete Development Workflow → IDE Development Workflow"
- Explains:
  - **Step 1 - Story Creation**: NEW CLEAN CHAT → @sm → *create (6-step workflow, marks story as Draft)
  - **Step 2 - Story Implementation**: NEW CLEAN CHAT → @dev → Dev follows tasks/subtasks, maintains File List, marks story as Review
  - **Step 3 - Senior QA Review**: NEW CLEAN CHAT → @qa → Executes review-story, can refactor directly, creates QA gate
  - **Step 4 - Repeat**: Continue cycle until all epic stories complete
- Emphasizes: "Only 1 story in progress at a time, worked sequentially"
- Notes: "ALWAYS use fresh, clean context windows between agents"

**User**: "Why can't I use you for story creation?"
**Agent**:
- References KB section "About bmad-master and bmad-orchestrator"
- Explains:
  - "bmad-master CAN do any task without switching agents, BUT..."
  - "CRITICAL RULE: ALWAYS use SM agent for story creation - Never use bmad-master or bmad-orchestrator"
  - "ALWAYS use Dev agent for implementation - Never use bmad-master or bmad-orchestrator"
  - "Why: SM and Dev agents are specifically optimized for the development workflow"
  - "No exceptions: Even if using bmad-master for everything else, switch to SM → Dev for implementation"

**User**: `*kb` (exits KB mode)
**Agent**:
- Unloads bmad-kb.md
- Returns to normal task execution mode
- "Knowledge Base mode deactivated. Ready for task execution."

**Result**: User learned workflow from authoritative source without searching external docs

### Example 5: Quick Epic Creation for Brownfield Enhancement
**Scenario**: Existing project, small feature addition, full PRD is overkill

**User**: `@bmad-master`
**Agent**: *Active*

**User**: `*task`
**Agent**:
```
Available Tasks:
1. advanced-elicitation.md
2. brownfield-create-epic.md ← For focused enhancements
3. brownfield-create-story.md
4. correct-course.md
...

Type number to select or task name.
```

**User**: `2`
**Agent**:
- Loads `brownfield-create-epic.md` task
- Executes task instructions:
  - "What enhancement are you adding to the existing system?"
  - User describes feature
  - Agent analyzes existing codebase context
  - Agent creates single epic file with:
    - Feature overview
    - Integration points with existing system
    - Story breakdown (5-7 stories)
    - Risk assessment
    - Rollback considerations
- Saves to `docs/prd/epic-1-feature-name.md`

**Result**: Focused epic created without full brownfield PRD, ready for SM → Dev workflow

---

## 11. Comparison with Other Agents

### BMad-Master vs Specialized Agents

#### Similarities to All Agents
- Uses BMad task/template/checklist framework
- Follows YAML-driven template processing
- Executes tasks as workflows (not reference material)
- Respects mandatory elicitation (`elicit: true`)
- Loads `core-config.yaml` at activation
- Uses numbered options protocol
- Outputs standard BMad artifacts

#### Differences from All Agents

**BMad-Master Unique Characteristics**:
1. **No Persona Transformation**
   - Specialized agents: Adopt role-specific personas (PM, Dev, Architect, etc.)
   - BMad-Master: Executes tasks directly without persona overlay

2. **Universal Resource Access**
   - Specialized agents: Limited to role-relevant dependencies
   - BMad-Master: Access to ALL tasks, templates, checklists, data files

3. **KB Mode**
   - Specialized agents: No access to bmad-kb.md
   - BMad-Master: Toggle KB mode for framework documentation access

4. **Runtime Resource Loading**
   - Specialized agents: May pre-load dependencies at activation
   - BMad-Master: ONLY loads resources when commanded (except core-config.yaml)

5. **Multi-Domain Capability**
   - Specialized agents: Single domain expertise (planning, architecture, development, QA)
   - BMad-Master: Cross-domain operations without agent switching

6. **No Section Permissions**
   - Specialized agents: Restricted edit permissions (e.g., Dev can only update specific story sections)
   - BMad-Master: Can create/update any section of any document

#### When to Use BMad-Master Instead of Specialized Agent

**Use BMad-Master when**:
- One-off operations across multiple domains
- Learning/exploring framework capabilities
- Don't want to switch agents for simple task
- Need KB mode for methodology questions
- Document sharding or validation
- Generic checklist execution
- Quick brownfield epic/story creation

**Use Specialized Agent when**:
- Sustained work in single domain (multiple PRDs → use PM)
- Persona adds value (UX design → use UX Expert)
- Agent has tuned workflow (architecture → use Architect)
- **CRITICAL**: Story creation → **ALWAYS use SM**
- **CRITICAL**: Implementation → **ALWAYS use Dev**
- QA review → Use QA for comprehensive review with refactoring

### BMad-Master vs BMad-Orchestrator

**BMad-Orchestrator** (Agent 10):
- Web platform agent for heavyweight contexts
- **Agent morphing capabilities** - Can transform into any specialized agent
- **Team coordination** in web environments
- Enables multi-agent workflows in single session
- Heavyweight context management
- Web-to-IDE transition facilitation

**BMad-Master**:
- Universal task executor without persona transformation
- Does NOT morph into other agents
- Executes tasks "as is" without role adoption
- Efficient for IDE environments
- Lightweight context usage (runtime loading only)
- Single-agent operations

**Key Difference**:
- **Orchestrator**: Becomes other agents (morphing)
- **Master**: Executes other agents' tasks (without morphing)

**Environment Usage**:
- **Orchestrator**: Optimized for web UI (ChatGPT, Gemini, Claude)
- **Master**: Optimized for IDE (Cursor, VS Code, Claude Code)

---

## 12. Vertex AI ADK Translation Design

### Agent Configuration for BMad-Master

**Vertex AI Agent Builder Configuration**:

```yaml
agent:
  id: "bmad-master"
  display_name: "BMad Master - Universal Task Executor"
  description: "Universal executor of all BMad-Method capabilities without persona transformation"
  model: "gemini-2.0-flash-001"  # Efficient model for task execution
  persona:
    role: "Master Task Executor & BMad Method Expert"
    identity: "Universal executor of all BMad-Method capabilities, directly runs any resource"
    style: "Pragmatic, flexible, efficient, direct, methodology-aware"
    core_principles:
      - "Execute any resource directly without persona transformation"
      - "Load resources at runtime, never pre-load (except core-config.yaml)"
      - "Expert knowledge of all BMad resources if using KB mode"
      - "Always present numbered lists for choices"
      - "Process (*) commands immediately"
      - "Follow task instructions exactly as written"
      - "Tasks with elicit=true require user interaction"

  tools:
    # Universal Document Creation
    - name: "create_document"
      description: "Create any document from available templates"
      function_ref: "projects/{project}/locations/{location}/functions/create-doc"
      parameters:
        template_name: string  # Optional - lists templates if not provided

    # Universal Checklist Execution
    - name: "execute_checklist"
      description: "Execute any validation checklist"
      function_ref: "projects/{project}/locations/{location}/functions/execute-checklist"
      parameters:
        checklist_name: string  # Optional - lists checklists if not provided
        mode: string  # "interactive" or "yolo"

    # Document Sharding
    - name: "shard_document"
      description: "Split monolithic document into manageable shards"
      function_ref: "projects/{project}/locations/{location}/functions/shard-doc"
      parameters:
        document_path: string  # Required
        destination_folder: string  # Required

    # Brownfield Documentation
    - name: "document_project"
      description: "Generate comprehensive documentation for existing projects"
      function_ref: "projects/{project}/locations/{location}/functions/document-project"

    # Generic Task Execution
    - name: "execute_task"
      description: "Execute any available task"
      function_ref: "projects/{project}/locations/{location}/functions/execute-task"
      parameters:
        task_name: string  # Optional - lists tasks if not provided

    # Knowledge Base Mode
    - name: "toggle_kb_mode"
      description: "Toggle Knowledge Base mode for framework consultation"
      function_ref: "projects/{project}/locations/{location}/functions/kb-mode"

    # Mode Toggles
    - name: "toggle_yolo"
      description: "Toggle YOLO mode for fast-track vs interactive"
      function_ref: "projects/{project}/locations/{location}/functions/yolo-toggle"

    # Document Output
    - name: "output_document"
      description: "Output full document to current destination file"
      function_ref: "projects/{project}/locations/{location}/functions/doc-out"

    # Resource Discovery
    - name: "list_templates"
      description: "List all available templates as numbered options"
      function_ref: "projects/{project}/locations/{location}/functions/list-templates"

    - name: "list_checklists"
      description: "List all available checklists as numbered options"
      function_ref: "projects/{project}/locations/{location}/functions/list-checklists"

    - name: "list_tasks"
      description: "List all available tasks as numbered options"
      function_ref: "projects/{project}/locations/{location}/functions/list-tasks"

  context:
    always_load:
      - "gs://bmad-core/core-config.yaml"  # ONLY file loaded at activation

    load_on_demand:
      # Tasks (13)
      - "gs://bmad-core/tasks/advanced-elicitation.md"
      - "gs://bmad-core/tasks/brownfield-create-epic.md"
      - "gs://bmad-core/tasks/brownfield-create-story.md"
      - "gs://bmad-core/tasks/correct-course.md"
      - "gs://bmad-core/tasks/create-deep-research-prompt.md"
      - "gs://bmad-core/tasks/create-doc.md"
      - "gs://bmad-core/tasks/create-next-story.md"
      - "gs://bmad-core/tasks/document-project.md"
      - "gs://bmad-core/tasks/execute-checklist.md"
      - "gs://bmad-core/tasks/facilitate-brainstorming-session.md"
      - "gs://bmad-core/tasks/generate-ai-frontend-prompt.md"
      - "gs://bmad-core/tasks/index-docs.md"
      - "gs://bmad-core/tasks/shard-doc.md"

      # Templates (11)
      - "gs://bmad-core/templates/architecture-tmpl.yaml"
      - "gs://bmad-core/templates/brownfield-architecture-tmpl.yaml"
      - "gs://bmad-core/templates/brownfield-prd-tmpl.yaml"
      - "gs://bmad-core/templates/competitor-analysis-tmpl.yaml"
      - "gs://bmad-core/templates/front-end-architecture-tmpl.yaml"
      - "gs://bmad-core/templates/front-end-spec-tmpl.yaml"
      - "gs://bmad-core/templates/fullstack-architecture-tmpl.yaml"
      - "gs://bmad-core/templates/market-research-tmpl.yaml"
      - "gs://bmad-core/templates/prd-tmpl.yaml"
      - "gs://bmad-core/templates/project-brief-tmpl.yaml"
      - "gs://bmad-core/templates/story-tmpl.yaml"

      # Checklists (6)
      - "gs://bmad-core/checklists/architect-checklist.md"
      - "gs://bmad-core/checklists/change-checklist.md"
      - "gs://bmad-core/checklists/pm-checklist.md"
      - "gs://bmad-core/checklists/po-master-checklist.md"
      - "gs://bmad-core/checklists/story-dod-checklist.md"
      - "gs://bmad-core/checklists/story-draft-checklist.md"

      # Data (4)
      - "gs://bmad-core/data/bmad-kb.md"  # ONLY loaded when user types *kb
      - "gs://bmad-core/data/brainstorming-techniques.md"
      - "gs://bmad-core/data/elicitation-methods.md"
      - "gs://bmad-core/data/technical-preferences.md"

      # Workflows (6)
      - "gs://bmad-core/workflows/brownfield-fullstack.yaml"
      - "gs://bmad-core/workflows/brownfield-service.yaml"
      - "gs://bmad-core/workflows/brownfield-ui.yaml"
      - "gs://bmad-core/workflows/greenfield-fullstack.yaml"
      - "gs://bmad-core/workflows/greenfield-service.yaml"
      - "gs://bmad-core/workflows/greenfield-ui.yaml"

  memory:
    session_ttl: 3600
    max_messages: 100  # Higher than specialized agents for multi-domain ops

  behavior:
    activation:
      - "Read core-config.yaml from always_load"
      - "Greet user with name/role"
      - "Auto-run *help to display available commands"
      - "HALT and wait for user command"
      - "DO NOT load any resources except core-config.yaml"
      - "DO NOT scan filesystem or run discovery"

    runtime:
      - "Load resources ONLY when commanded"
      - "Exception: bmad-kb.md loads ONLY when user types *kb"
      - "Present all resource lists as numbered options"
      - "Execute tasks as workflows, not reference material"
      - "Respect mandatory elicitation (elicit=true)"
      - "Follow task instructions exactly"

    kb_mode:
      - "Toggle with *kb command"
      - "Load bmad-kb.md when entering KB mode"
      - "Answer methodology questions authoritatively"
      - "Unload bmad-kb.md when exiting KB mode"
```

### Implementation Architecture

**Cloud Function for Universal Task Execution**:

```python
from google.cloud import storage
from google.cloud import firestore
import yaml

class BMadMasterTaskExecutor:
    """
    Universal task executor for BMad-Master agent.
    Handles all task/template/checklist execution without persona transformation.
    """

    def __init__(self, project_id: str):
        self.project_id = project_id
        self.storage_client = storage.Client()
        self.firestore = firestore.Client()
        self.bucket_name = "bmad-core"
        self.kb_loaded = False
        self.yolo_mode = False

    def execute_command(self, command: str, params: dict) -> dict:
        """Route command to appropriate handler."""

        handlers = {
            "create-doc": self.create_document,
            "execute-checklist": self.execute_checklist,
            "shard-doc": self.shard_document,
            "document-project": self.document_project,
            "task": self.execute_task,
            "kb": self.toggle_kb_mode,
            "yolo": self.toggle_yolo_mode,
            "doc-out": self.output_document,
        }

        handler = handlers.get(command)
        if handler:
            return handler(params)
        else:
            return {"error": f"Unknown command: {command}"}

    def create_document(self, params: dict) -> dict:
        """Execute create-doc task with specified template."""

        template_name = params.get("template_name")

        # If no template specified, list available templates
        if not template_name:
            return self.list_templates()

        # Load template from Cloud Storage
        template = self.load_template(template_name)

        # Load create-doc task
        task = self.load_task("create-doc.md")

        # Execute template processing workflow
        result = self.process_template(template, task, self.yolo_mode)

        return result

    def execute_checklist(self, params: dict) -> dict:
        """Execute execute-checklist task with specified checklist."""

        checklist_name = params.get("checklist_name")
        mode = params.get("mode", "interactive")

        # If no checklist specified, list available checklists
        if not checklist_name:
            return self.list_checklists()

        # Load checklist from Cloud Storage
        checklist = self.load_checklist(checklist_name)

        # Load execute-checklist task
        task = self.load_task("execute-checklist.md")

        # Execute validation workflow
        result = self.validate_with_checklist(checklist, task, mode)

        return result

    def shard_document(self, params: dict) -> dict:
        """Execute shard-doc task."""

        document_path = params.get("document_path")
        destination_folder = params.get("destination_folder")

        if not document_path or not destination_folder:
            return {"error": "document_path and destination_folder required"}

        # Load shard-doc task
        task = self.load_task("shard-doc.md")

        # Execute sharding workflow
        result = self.shard_document_workflow(
            document_path,
            destination_folder,
            task
        )

        return result

    def document_project(self, params: dict) -> dict:
        """Execute document-project task for brownfield documentation."""

        # Load document-project task
        task = self.load_task("document-project.md")

        # Execute brownfield documentation workflow
        result = self.document_brownfield_project(task, params)

        return result

    def execute_task(self, params: dict) -> dict:
        """Execute any generic task."""

        task_name = params.get("task_name")

        # If no task specified, list available tasks
        if not task_name:
            return self.list_tasks()

        # Load task from Cloud Storage
        task = self.load_task(task_name)

        # Execute task workflow
        result = self.execute_generic_task(task, params)

        return result

    def toggle_kb_mode(self, params: dict) -> dict:
        """Toggle Knowledge Base mode."""

        if not self.kb_loaded:
            # Load bmad-kb.md
            kb_content = self.load_data_file("bmad-kb.md")
            self.kb_content = kb_content
            self.kb_loaded = True
            return {
                "status": "KB mode activated",
                "message": "I can now answer questions about the BMad methodology"
            }
        else:
            # Unload KB
            self.kb_content = None
            self.kb_loaded = False
            return {
                "status": "KB mode deactivated",
                "message": "Ready for task execution"
            }

    def toggle_yolo_mode(self, params: dict) -> dict:
        """Toggle YOLO mode."""

        self.yolo_mode = not self.yolo_mode
        return {
            "status": f"YOLO mode {'enabled' if self.yolo_mode else 'disabled'}",
            "mode": "fast-track" if self.yolo_mode else "interactive"
        }

    def list_templates(self) -> dict:
        """List all available templates as numbered options."""

        templates = [
            "project-brief-tmpl.yaml",
            "prd-tmpl.yaml",
            "brownfield-prd-tmpl.yaml",
            "market-research-tmpl.yaml",
            "competitor-analysis-tmpl.yaml",
            "brainstorming-output-tmpl.yaml",
            "architecture-tmpl.yaml",
            "fullstack-architecture-tmpl.yaml",
            "front-end-architecture-tmpl.yaml",
            "brownfield-architecture-tmpl.yaml",
            "front-end-spec-tmpl.yaml",
            "story-tmpl.yaml"
        ]

        return {
            "type": "template_list",
            "templates": [
                {"number": i+1, "name": tmpl}
                for i, tmpl in enumerate(templates)
            ],
            "message": "Type number to select or template name"
        }

    def list_checklists(self) -> dict:
        """List all available checklists as numbered options."""

        checklists = [
            "architect-checklist.md",
            "change-checklist.md",
            "pm-checklist.md",
            "po-master-checklist.md",
            "story-dod-checklist.md",
            "story-draft-checklist.md"
        ]

        return {
            "type": "checklist_list",
            "checklists": [
                {"number": i+1, "name": chk}
                for i, chk in enumerate(checklists)
            ],
            "message": "Type number to select or checklist name"
        }

    def list_tasks(self) -> dict:
        """List all available tasks as numbered options."""

        tasks = [
            "advanced-elicitation.md",
            "brownfield-create-epic.md",
            "brownfield-create-story.md",
            "correct-course.md",
            "create-deep-research-prompt.md",
            "create-doc.md",
            "create-next-story.md",
            "document-project.md",
            "execute-checklist.md",
            "facilitate-brainstorming-session.md",
            "generate-ai-frontend-prompt.md",
            "index-docs.md",
            "shard-doc.md"
        ]

        return {
            "type": "task_list",
            "tasks": [
                {"number": i+1, "name": task}
                for i, task in enumerate(tasks)
            ],
            "message": "Type number to select or task name"
        }

    def load_template(self, template_name: str) -> dict:
        """Load template YAML from Cloud Storage."""
        bucket = self.storage_client.bucket(self.bucket_name)
        blob = bucket.blob(f"templates/{template_name}")
        content = blob.download_as_text()
        return yaml.safe_load(content)

    def load_task(self, task_name: str) -> str:
        """Load task markdown from Cloud Storage."""
        bucket = self.storage_client.bucket(self.bucket_name)
        blob = bucket.blob(f"tasks/{task_name}")
        return blob.download_as_text()

    def load_checklist(self, checklist_name: str) -> str:
        """Load checklist markdown from Cloud Storage."""
        bucket = self.storage_client.bucket(self.bucket_name)
        blob = bucket.blob(f"checklists/{checklist_name}")
        return blob.download_as_text()

    def load_data_file(self, file_name: str) -> str:
        """Load data file from Cloud Storage."""
        bucket = self.storage_client.bucket(self.bucket_name)
        blob = bucket.blob(f"data/{file_name}")
        return blob.download_as_text()

    # Additional workflow implementation methods...
    # process_template(), validate_with_checklist(), etc.
```

### Key ADK Translation Considerations

**1. Runtime Resource Loading**:
- Vertex AI Agent Builder: Use `load_on_demand` context section
- Implement lazy loading via Cloud Functions
- Only load resources when tool is invoked
- Exception: `core-config.yaml` in `always_load`

**2. KB Mode Implementation**:
- Separate tool function for KB toggle
- Load bmad-kb.md into agent context when activated
- Maintain KB state in session memory
- Unload when toggled off to save context

**3. Numbered Options Pattern**:
- Return structured lists from tool functions
- Format: `{"number": 1, "name": "template.yaml"}`
- Agent renders as numbered list in response
- Accept either number or name as input

**4. Universal Tool Access**:
- BMad-Master needs more tools than specialized agents
- Generic tool functions (execute_task, create_document, execute_checklist)
- Discovery tools (list_templates, list_tasks, list_checklists)
- Mode toggle tools (kb, yolo)

**5. No Persona Constraints**:
- Vertex AI Agent Builder: Minimal persona instructions
- No role-specific behavioral constraints
- Pragmatic, efficient execution style
- Focus on task completion, not character immersion

**6. Session Management**:
- Higher `max_messages` than specialized agents (100 vs 50)
- Support multi-domain operations in single session
- Track mode states (KB on/off, YOLO on/off)
- Maintain resource load states

---

## 13. Critical Insights

### 1. BMad-Master is NOT a Replacement for Specialized Agents
Despite universal access to all resources, BMad-Master should NOT replace specialized agents for sustained workflows:

**Why Specialized Agents Are Better**:
- **Tuned Personas**: PM writes better PRDs because of PM persona, not just template access
- **Focused Context**: Architect agent loads only architecture-relevant dependencies
- **Optimized Workflows**: SM agent's 6-step story creation is optimized for that role
- **Quality Outputs**: Persona immersion produces higher quality domain-specific work

**CRITICAL RULES** (from BMad KB):
- **ALWAYS use SM agent for story creation** - Never use bmad-master
- **ALWAYS use Dev agent for implementation** - Never use bmad-master
- **No exceptions**: Even if using bmad-master for planning, switch to SM → Dev for development

### 2. BMad-Master is the "Learning" Agent
BMad-Master with KB mode is the **ONLY** way to learn BMad methodology within the framework:

**KB Mode Uniqueness**:
- Only agent with access to bmad-kb.md (810+ lines)
- Complete framework documentation at fingertips
- Authoritative answers to methodology questions
- Explains workflows, agent roles, best practices
- Troubleshooting guidance

**Use for**:
- Onboarding new users
- Understanding workflow transitions
- Clarifying agent responsibilities
- Getting setup help
- Learning best practices

### 3. Runtime Loading is Key Efficiency Feature
BMad-Master's lazy loading strategy is critical for performance:

**Why This Matters**:
- **Context Window Preservation**: Only loads what's needed for current command
- **Cost Efficiency**: Smaller context = lower API costs
- **Faster Execution**: Less to parse and process
- **Scalability**: Can access 50+ resources without bloating context

**Implementation Pattern**:
```
Activation: Load only core-config.yaml
Command: *create-doc prd
  → Load prd-tmpl.yaml (1 template)
  → Load create-doc.md (1 task)
  → Load technical-preferences.md (1 data file)
  → Execute workflow
  → Unload resources
Next Command: Fresh slate
```

### 4. Numbered Options Pattern is UX Innovation
Presenting all choices as numbered lists reduces friction:

**User Experience Impact**:
- Type `1` instead of `project-brief-tmpl.yaml`
- No memorization of exact resource names
- Reduces typos and command errors
- Makes framework more explorable
- Lowers learning curve

**Consistency**:
- All templates listed as numbers
- All checklists listed as numbers
- All tasks listed as numbers
- Uniform interaction pattern

### 5. Document Sharding is Critical Transition Point
BMad-Master's `*shard-doc` command enables Planning→Development transition:

**Why Sharding Matters**:
- **Planning Phase**: Monolithic docs (PRD, Architecture) for comprehensive vision
- **Development Phase**: Sharded docs for focused story creation and implementation
- **Context Management**: SM/Dev agents work with shards, not full docs
- **Efficiency**: Smaller documents = faster loading, lower costs

**Sharding Strategy**:
- Automatic: md-tree parser (production-quality)
- Manual: Built-in task logic (fallback)
- Output: Individual section files + index file
- Preserves: Front matter, metadata, cross-references

**Typical Flow**:
1. Create docs in Web UI (cost-effective)
2. Copy to `docs/prd.md` and `docs/architecture.md`
3. Switch to IDE
4. `@bmad-master` → `*shard-doc docs/prd.md prd`
5. `@bmad-master` → `*shard-doc docs/architecture.md architecture`
6. Now ready for SM → Dev workflow

### 6. BMad-Master vs BMad-Orchestrator Distinction
Understanding the difference is critical:

**BMad-Orchestrator**:
- **Morphs** into other agents (adopts personas)
- Web platform optimization
- Multi-agent workflows in single session
- Heavyweight context management
- "Become PM, then become Dev, then become QA"

**BMad-Master**:
- **Executes** other agents' tasks (without persona)
- IDE environment optimization
- Single-agent operations
- Lightweight context (runtime loading)
- "Run PM task, then run Dev task, then run QA task"

**Analogy**:
- **Orchestrator**: Method actor who becomes each character
- **Master**: Stage manager who directs each scene

### 7. YOLO Mode is Efficiency vs Quality Tradeoff
Toggle between interactive and fast-track modes:

**Interactive Mode** (Default):
- Section-by-section elicitation
- User dialogue for each section
- Advanced elicitation options (9 methods)
- Iterative refinement
- High quality output
- **Best for**: Critical artifacts (PRDs, architecture)

**YOLO Mode**:
- Fast-track document creation
- Minimal user interaction
- Batch generation
- Single refinement pass
- Quick draft output
- **Best for**: Quick drafts, time-sensitive, exploratory work

**Toggle**: `*yolo` command

### 8. Configuration-Driven Behavior
BMad-Master adapts to project structure via `core-config.yaml`:

**Why Configuration Matters**:
- **V3 vs V4 Projects**: Different PRD/architecture structures
- **Sharded vs Monolithic**: Determines file locations and patterns
- **Custom Locations**: Projects can use non-standard paths
- **Developer Context**: Specifies which files Dev agent always loads

**BMad-Master Uses Configuration For**:
- Document sharding (target locations)
- Story creation (PRD structure understanding)
- Validation (checklist execution context)
- Task execution (project-specific adaptations)

### 9. Universal Access Does NOT Mean Universal Execution
Having access to all resources doesn't mean BMad-Master should execute everything:

**Access vs Optimization**:
- BMad-Master CAN run create-next-story task
- SM agent SHOULD run create-next-story task
- Why: SM's persona and focused context produce better stories

**Design Philosophy**:
- Universal access = Flexibility for one-off operations
- Specialized agents = Quality for sustained workflows
- Choose based on context: One task? Master. Multiple tasks? Specialized.

### 10. BMad-Master is Bridge Between Planning and Development
While not following structured workflows itself, BMad-Master enables workflow transitions:

**Planning→Development Bridge**:
1. Planning docs created (by PM, Architect, or BMad-Master)
2. BMad-Master shards documents
3. BMad-Master validates with po-master-checklist
4. Identifies gaps and issues
5. Documents ready for SM → Dev cycle

**Brownfield→Enhancement Bridge**:
1. BMad-Master documents existing project (`*document-project`)
2. BMad-Master creates brownfield PRD or quick epic
3. BMad-Master shards if needed
4. Enhancement workflow begins

**Learning→Execution Bridge**:
1. User uses KB mode to learn workflow
2. Understands agent roles and transitions
3. Exits KB mode
4. Executes appropriate commands or switches to specialized agents

---

## 14. Recommendations for ADK Implementation

### High Priority Recommendations

**1. Implement Lazy Loading Rigorously**
- Do NOT pre-load dependencies during agent activation
- Only load when tool is invoked
- Exception: core-config.yaml (small, always needed)
- Track loaded resources and unload after tool execution
- Monitor context window usage to validate efficiency

**2. Make KB Mode Seamless**
- Separate KB toggle tool function
- Clear mode status in agent responses ("KB mode active")
- Index bmad-kb.md for fast retrieval
- Consider caching KB content (it doesn't change often)
- Ensure KB unloads cleanly when toggled off

**3. Prioritize Numbered Options UX**
- All list responses (templates, checklists, tasks) as structured data
- Format consistently: `{"number": 1, "name": "resource.ext"}`
- Agent must render as numbered list in natural language
- Accept both number and name as input to tools
- Reduce friction for resource discovery and selection

**4. Build Robust Sharding Functionality**
- Integrate with markdown-tree-parser or equivalent
- Handle edge cases: nested headings, code blocks, YAML front matter
- Preserve cross-references and links
- Generate index files automatically
- Support both automatic and manual modes

**5. Create Comprehensive Tool Functions**
- Generic tool functions (execute_task, create_document, execute_checklist)
- Discovery tools (list_templates, list_tasks, list_checklists)
- Mode toggle tools (kb, yolo)
- Utility tools (doc_out, help)
- Ensure tool descriptions are clear for agent selection

### Medium Priority Recommendations

**6. Implement Mode State Management**
- Track KB mode state in session (on/off)
- Track YOLO mode state in session (on/off)
- Persist state across tool invocations within session
- Clear state when session ends
- Expose state to user ("KB mode active, YOLO mode disabled")

**7. Support Command Prefix Pattern**
- Accept both `*command` and `command` formats
- Maintain consistency with BMad conventions (`*` prefix)
- Map commands to tool functions clearly
- Document command syntax in agent instructions

**8. Validate Task Execution Exactly**
- Tasks are executable workflows, not reference material
- Follow task instructions line-by-line
- Respect mandatory elicitation (`elicit: true`)
- Never skip user interaction for efficiency
- Task instructions override persona constraints

**9. Build Template Processing Engine**
- Parse YAML template structure
- Process sections sequentially
- Handle different section types (text, list, table, choice, template-text)
- Implement elicitation logic (interactive vs YOLO)
- Generate final markdown with proper formatting

**10. Integrate with Firestore for Configuration**
- Store core-config.yaml in Firestore for each project
- Load configuration at agent activation
- Use configuration to adapt tool behavior
- Support V3 and V4 project structures
- Enable custom project layouts

### Lower Priority (Nice-to-Have)

**11. Implement Workflow Awareness**
- BMad-Master doesn't follow workflows, but should understand them
- Provide guidance when user asks about workflows
- Reference workflow YAML files in KB mode
- Suggest appropriate specialized agents for workflow steps

**12. Build Artifact Versioning**
- Track document versions in Firestore
- Support rollback if user wants to revert
- Maintain audit trail of changes
- Useful for iterative refinement

**13. Add Telemetry and Analytics**
- Track which commands are used most
- Measure context window usage per operation
- Identify bottlenecks in task execution
- Inform optimization efforts

**14. Create Tool Function Testing Suite**
- Unit tests for each tool function
- Integration tests for complete workflows
- Edge case handling validation
- Performance benchmarks

**15. Document API Specifications**
- OpenAPI specs for all tool functions
- Request/response schemas
- Error handling documentation
- Usage examples

---

## 15. Summary

### Agent Overview
BMad-Master is the **Universal Task Executor** in the BMad framework - capable of running any task, template, or checklist across all domains without persona transformation. It serves as the "swiss army knife" agent, providing flexibility for one-off operations while maintaining efficiency through runtime resource loading.

### Key Characteristics
- **No Persona Transformation**: Executes tasks directly without adopting specialized roles
- **Universal Resource Access**: 13 tasks, 11 templates, 6 checklists, 4 data files, 6 workflows
- **Runtime Loading**: Only loads resources when commanded (except core-config.yaml)
- **KB Mode**: Unique access to complete BMad methodology documentation
- **Numbered Options**: All choices presented as numbered lists for easy selection
- **Multi-Domain Capability**: Cross-domain operations without agent switching
- **No Permission Restrictions**: Can create/update any document section

### Primary Use Cases
1. **Document Creation**: Any template without switching agents
2. **Document Sharding**: Planning→Development transition
3. **Checklist Validation**: Any validation without switching agents
4. **Brownfield Documentation**: Existing project analysis
5. **Knowledge Base Consultation**: Learning BMad methodology
6. **Generic Task Execution**: Any task ad-hoc
7. **Quick Operations**: When agent switching is inefficient

### Critical Limitations
**NEVER use BMad-Master for**:
- **Story Creation**: Always use SM agent (optimized for this workflow)
- **Implementation**: Always use Dev agent (optimized for this workflow)
- **Sustained Domain Work**: Use specialized agents (better quality outputs)

**BMad-Master is for one-off operations, not sustained workflows.**

### Vertex AI ADK Translation Priority
**High Priority**:
- Lazy loading implementation (context efficiency)
- KB mode functionality (unique feature)
- Numbered options UX (framework usability)
- Document sharding (workflow transitions)
- Generic tool functions (universal execution)

**Medium Priority**:
- Mode state management
- Command prefix pattern
- Task execution validation
- Template processing engine
- Configuration integration

**Lower Priority**:
- Workflow awareness
- Artifact versioning
- Telemetry and analytics
- Testing suite
- API documentation

### Conclusion
BMad-Master represents a unique approach in the BMad framework: universal capability without role specialization. Its lazy loading, KB mode, and cross-domain flexibility make it ideal for one-off operations and framework learning. However, for sustained high-quality work, specialized agents remain superior due to their tuned personas and focused contexts. The key to BMad-Master success in ADK translation is rigorous lazy loading implementation, seamless KB mode, and robust generic tool functions that enable efficient resource execution without context bloat.

---

**Document Version**: 1.0
**Created**: 2025-10-14
**Author**: Claude Code (AI Agent)
**Analysis Status**: Complete
**Task**: Phase 2, Task 2.9 - BMad-Master Agent Analysis
