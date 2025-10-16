# BMad Framework Output Format Standards - Section 4: Metadata, Versioning & Status Standards

**Analysis Date**: 2025-10-14
**Analyzer**: Claude Code (AI Agent)
**Phase**: Phase 4, Task 4.4
**Document Version**: 1.0

---

## Table of Contents

- [Section 1: Introduction & Core Patterns](output-format-standards-section1.md)
- [Section 2: File Naming & Directory Structure Standards](output-format-standards-section2.md)
- [Section 3: Markdown Formatting Conventions](output-format-standards-section3.md)
- [Section 4: Metadata, Versioning & Status Standards](#section-4-metadata-versioning--status-standards) (This document)
- [Section 5: ADK Translation & Summary](output-format-standards-section5.md)

---

## Section 4: Metadata, Versioning & Status Standards

### 4.1 Template Metadata

BMad templates include comprehensive metadata at the top of each template file.

#### 4.1.1 Core Template Metadata Block

**Structure**:
```yaml
template:
  id: template-id-v2
  name: Template Name
  version: 2.0
  output:
    format: markdown
    filename: docs/output.md
    title: "{{project_name}} Document Title"
```

**Fields**:

**`id`** (required):
- Unique identifier for the template
- Format: `{name}-template-v{version}`
- Examples: `prd-template-v2`, `story-template-v2`, `qa-gate-template-v1`
- Used for programmatic template loading

**`name`** (required):
- Human-readable template name
- Title case
- Examples: "Product Requirements Document", "Story Document", "QA Gate"

**`version`** (required):
- Semantic version number
- Format: `major.minor` (e.g., `2.0`, `1.5`)
- Major version changes indicate breaking changes
- Minor version changes indicate backward-compatible additions

**`output`** (required):
- Configuration for generated output

  **`output.format`** (required):
  - Output format type
  - Values: `markdown`, `yaml`
  - Most templates: `markdown`
  - Exception: `qa-gate-tmpl.yaml` uses `yaml`

  **`output.filename`** (required):
  - Output file path with variable interpolation
  - Relative to project root
  - Examples:
    - `docs/prd.md`
    - `docs/stories/{{epic_num}}.{{story_num}}.{{story_title_short}}.md`
    - `docs/qa/{{epic_num}}.{{story_num}}-{{story_title_slug}}.yaml`

  **`output.title`** (required):
  - Document title with variable interpolation
  - Becomes H1 heading in markdown output
  - Examples:
    - `"{{project_name}} Product Requirements Document (PRD)"`
    - `"Story {{epic_num}}.{{story_num}}: {{story_title_short}}"`

#### 4.1.2 Workflow Metadata Block

**Structure**:
```yaml
workflow:
  mode: interactive
  elicitation: advanced-elicitation
```

**Fields**:

**`mode`** (required):
- Workflow execution mode
- Values:
  - `interactive`: Agent interacts with user to gather information
  - `non-interactive`: Agent generates output without user interaction
- Most templates: `interactive`
- Exception: `brainstorming-output-tmpl.yaml` uses `non-interactive`

**`elicitation`** (optional):
- Elicitation strategy reference
- Values:
  - `advanced-elicitation`: Standard advanced elicitation task
  - Custom elicitation tasks (e.g., in `project-brief-tmpl.yaml`)
- Used by agents to determine how to gather section information

#### 4.1.3 Agent Configuration Block (v2.0)

**Structure**:
```yaml
agent_config:
  editable_sections:
    - Status
    - Story
    - Acceptance Criteria
    - Tasks / Subtasks
    - Dev Notes
    - Testing
    - Change Log
```

**Fields**:

**`editable_sections`** (optional):
- List of section titles editable by the agent
- Applies to the agent loading the template
- Used for access control in multi-agent collaboration
- Only present in templates with section ownership model (v2.0)

**Section-Level Ownership**:
```yaml
sections:
  - id: story
    title: Story
    owner: scrum-master
    editors: [scrum-master]

  - id: dev-agent-record
    title: Dev Agent Record
    owner: dev-agent
    editors: [dev-agent]
```

**Fields**:
- **`owner`**: Agent responsible for creating the section
- **`editors`**: List of agents allowed to modify the section

---

### 4.2 Document Metadata (Generated Artifacts)

Generated documents include metadata within their content structure.

#### 4.2.1 Document Header (H1 Title)

**Format**:
```markdown
# Document Title

## Change Log
| Date | Version | Description | Author |
...
```

**Rules**:
- H1 appears at top of document
- Followed immediately by change log or first major section
- Title matches template `output.title` with variables resolved

#### 4.2.2 Change Log Tables

**Purpose**: Track document evolution over time

**Standard Format**:
```markdown
## Change Log

| Date       | Version | Description                    | Author        |
|------------|---------|--------------------------------|---------------|
| 2025-10-14 | 1.0     | Initial draft                  | PM Agent      |
| 2025-10-15 | 1.1     | Updated requirements           | PM Agent      |
| 2025-10-16 | 1.2     | Added Epic 3                   | PM Agent      |
| 2025-10-17 | 2.0     | Finalized PRD                  | PO Agent      |
```

**Column Specifications**:

**Date**:
- ISO 8601 format: `YYYY-MM-DD`
- Examples: `2025-10-14`, `2025-12-25`

**Version**:
- Semantic versioning: `major.minor`
- Major version: Significant changes, breaking modifications
- Minor version: Incremental updates, additions
- Examples: `1.0`, `1.1`, `2.0`

**Description**:
- Brief summary of changes (1-3 words typically)
- Examples:
  - "Initial draft"
  - "Updated requirements"
  - "Added Epic 3"
  - "Finalized PRD"
  - "Implemented authentication"

**Author**:
- Agent or human author
- Agent names: "PM Agent", "Dev Agent", "QA Agent"
- Human names: Full name or username
- Examples: "PM Agent", "John Smith", "jsmith"

#### 4.2.3 Story-Specific Metadata

Stories include additional metadata fields:

**Status Field**:
```markdown
## Status
InProgress
```

**Values**:
- `Draft`: Story created but not approved
- `Approved`: Story validated by PO, ready for development
- `InProgress`: Dev agent actively working on story
- `Review`: Implementation complete, awaiting QA review
- `Done`: QA passed, story complete

**Agent Model Field** (Dev Agent Record):
```markdown
### Agent Model Used
claude-sonnet-4-5-20250929
```

**Format**: Model name and version identifier

**Timestamp Fields** (QA Gate):
```yaml
timestamp: 2025-10-14T15:30:00Z
```

**Format**: ISO 8601 with UTC timezone (`YYYY-MM-DDTHH:MM:SSZ`)

---

### 4.3 Version Numbering Standards

#### 4.3.1 Template Versioning

**Format**: `major.minor`

**Version Progression**:
- **1.0**: Initial stable version
- **1.1, 1.2, ...**: Minor updates, backward-compatible additions
- **2.0**: Major revision with breaking changes
- **2.1, 2.2, ...**: Minor updates to v2

**Breaking Changes** (Major Version Bump):
- Section structure changes
- Removed required sections
- Changed section ownership model
- Changed output format

**Backward-Compatible Changes** (Minor Version Bump):
- Added optional sections
- Enhanced instructions
- Added examples
- Added choices or templates

**Example Evolution**:
- `story-template-v1`: Original story template
- `story-template-v2`: Added section ownership and permissions (breaking change)
- `story-template-v2.1`: Would add optional sections (if implemented)

#### 4.3.2 Document Versioning

**Format**: `major.minor`

**Version Progression**:
- **1.0**: Initial complete draft
- **1.1, 1.2, ...**: Incremental updates, additions
- **2.0**: Major revision or finalization

**Triggers for Version Bumps**:

**Major Version (1.x → 2.0)**:
- Document finalized and approved
- Significant restructuring
- Major scope changes

**Minor Version (1.0 → 1.1)**:
- Added epics or stories
- Updated requirements
- Clarified sections
- Added details

**Example Progression** (PRD):
```markdown
| Date       | Version | Description                    |
|------------|---------|--------------------------------|
| 2025-10-14 | 1.0     | Initial draft                  |
| 2025-10-15 | 1.1     | Added Epic 3                   |
| 2025-10-16 | 1.2     | Updated technical assumptions  |
| 2025-10-17 | 2.0     | PO validated and finalized     |
```

#### 4.3.3 Configuration Version Flags

BMad uses version flags in configuration to control behavior:

```yaml
prd:
  prdVersion: v4        # Controls sharding behavior
  prdSharded: true

architecture:
  architectureVersion: v4
  architectureSharded: true
```

**Version Values**:
- `v3`: Monolithic document (no sharding)
- `v4`: Sharded document support enabled

**Purpose**: Different versions use different processing logic (sharding strategy).

---

### 4.4 Status Indicators

#### 4.4.1 Story Status Values

**Defined States**:
```yaml
choices: [Draft, Approved, InProgress, Review, Done]
```

**State Definitions**:

**Draft**:
- Story created by SM agent
- Contains user story, AC, tasks, dev notes
- Not yet validated
- Next action: PO validation (optional) or Dev start

**Approved**:
- PO has validated story (if validation workflow used)
- Ready for development
- Next action: Dev agent begins implementation

**InProgress**:
- Dev agent actively implementing story
- Tasks being completed
- Dev Agent Record being populated
- Next action: Complete implementation

**Review**:
- Implementation complete
- Dev agent marked as ready for review
- Awaiting QA review
- Next action: QA agent performs review

**Done**:
- QA gate decision: PASS
- Story complete
- Ready for deployment or next story
- Final state

**State Transition Diagram**:
```
Draft → [Optional: PO Validation] → Approved → InProgress → Review → Done
                ↓                                   ↓          ↓
              Course                              QA         QA
             Correction                         Checks      Gate
```

#### 4.4.2 QA Gate Decision Values

**Defined States**:
```yaml
decision: pass | concerns | fail | waived
```

**Decision Definitions**:

**pass**:
- All acceptance criteria met
- Code quality acceptable
- No blocking issues
- Story can proceed to Done

**concerns**:
- Implementation meets AC but has concerns
- Non-blocking issues identified
- Recommendations for improvement
- Story can proceed with caveats

**fail**:
- Acceptance criteria not met
- Blocking issues present
- Must return to Dev agent for fixes
- Cannot proceed to Done

**waived**:
- Known issues exist but consciously accepted
- Documented rationale required
- Typically business decision
- Story proceeds despite concerns

**Example**:
```yaml
decision: concerns

concerns:
  - category: code-quality
    description: Error messages could be more specific
    recommendation: Add context to error responses
    severity: low

rationale: |
  All acceptance criteria met. Code quality is high with comprehensive
  test coverage. Minor concerns around error handling do not block deployment.
```

#### 4.4.3 Severity Levels

**QA Concerns Severity**:
```yaml
severity: low | medium | high
```

**Severity Definitions**:

**low**:
- Minor improvements
- Non-urgent issues
- Can be addressed in future stories

**medium**:
- Notable issues
- Should be addressed soon
- May impact user experience

**high**:
- Significant problems
- Should be addressed before deployment
- May block production release

**Risk Profile Scoring**:
- Probability: 1-5 scale (1=very low, 5=very high)
- Impact: 1-5 scale (1=minimal, 5=critical)
- Risk Score: probability × impact (1-25)

**Risk Prioritization**:
- **High Priority** (16-25): Immediate attention required
- **Medium Priority** (8-15): Should be addressed
- **Low Priority** (1-7): Monitor and address as needed

#### 4.4.4 Test Priority Levels

**Priority Values**:
```
P0, P1, P2, P3
```

**Priority Definitions**:

**P0 (Critical)**:
- Core functionality
- Must pass before deployment
- Automated in CI/CD
- Examples: Authentication, payment processing, data integrity

**P1 (High)**:
- Important features
- Should pass before deployment
- Automated in CI/CD
- Examples: User profile, search, notifications

**P2 (Medium)**:
- Secondary features
- Nice to have before deployment
- May be manual or automated
- Examples: Analytics, reporting, admin tools

**P3 (Low)**:
- Edge cases
- Low-risk features
- Manual testing acceptable
- Examples: Rare error conditions, cosmetic issues

---

### 4.5 Checklist Formats

BMad uses checklists for validation, process guidance, and quality gates.

#### 4.5.1 Checklist Structure

**Standard Format**:
```markdown
# Checklist Title

[[LLM: INITIALIZATION INSTRUCTIONS
...
]]

## Section 1: Category

### 1.1 Sub-Category [[CONDITIONAL TAG]]

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

### 1.2 Another Sub-Category

- [ ] Item 4
- [ ] Item 5
```

**Components**:

**Header**:
- H1 with checklist title
- Describes checklist purpose

**LLM Instructions** (Optional):
- Embedded in `[[LLM: ... ]]` markers
- Initialization logic
- Conditional execution rules
- Context detection instructions

**Sections**:
- H2 for major categories
- H3 for sub-categories
- Checklist items under each section

**Conditional Tags**:
- `[[GREENFIELD ONLY]]`: Only for greenfield projects
- `[[BROWNFIELD ONLY]]`: Only for brownfield projects
- `[[UI/UX ONLY]]`: Only for projects with UI/UX components

#### 4.5.2 Checklist Item Format

**Checkbox Syntax**:
```markdown
- [ ] Checklist item text
```

**Rules**:
- Space between brackets: `[ ]`
- Checkbox items are actionable
- One concern or validation per item
- Items can reference sections or files

**Examples**:
```markdown
- [ ] Epic 1 includes explicit steps for project creation
- [ ] Starter template setup steps are included
- [ ] Initial README setup is included
- [ ] Repository setup processes are defined
```

#### 4.5.3 Embedded LLM Instructions

**Purpose**: Guide agent behavior during checklist execution

**Format**:
```markdown
[[LLM: INSTRUCTION BLOCK

INSTRUCTION CATEGORY:
Details about what to do...

ANOTHER CATEGORY:
More instructions...
]]
```

**Example** (PO Master Checklist):
```markdown
[[LLM: INITIALIZATION INSTRUCTIONS - PO MASTER CHECKLIST

PROJECT TYPE DETECTION:
First, determine the project type by checking:

1. Is this a GREENFIELD project (new from scratch)?
   - Look for: New project initialization, no existing codebase references
   - Check for: prd.md, architecture.md, new project setup stories

2. Is this a BROWNFIELD project (enhancing existing system)?
   - Look for: References to existing codebase, enhancement language
   - Check for: prd.md, architecture.md, existing system analysis

DOCUMENT REQUIREMENTS:
Based on project type, ensure you have access to:

For GREENFIELD projects:
- prd.md - The Product Requirements Document
- architecture.md - The system architecture
- frontend-architecture.md - If UI/UX is involved
- All epic and story definitions

SKIP INSTRUCTIONS:
- Skip sections marked [[BROWNFIELD ONLY]] for greenfield projects
- Skip sections marked [[GREENFIELD ONLY]] for brownfield projects
- Note all skipped sections in your final report

VALIDATION APPROACH:
1. Deep Analysis - Thoroughly analyze each item
2. Evidence-Based - Cite specific sections when validating
3. Critical Thinking - Question assumptions
4. Risk Assessment - Consider what could go wrong
]]
```

**Instruction Categories**:
- **Initialization**: Setup and context detection
- **Document Requirements**: Files needed for validation
- **Skip Instructions**: Conditional logic for sections
- **Validation Approach**: How to execute checklist
- **Execution Mode**: Interactive vs comprehensive mode

#### 4.5.4 Checklist Reporting

**Output Format**:
Agents executing checklists generate reports with:

1. **Project Type Detection**: Greenfield/Brownfield, UI/UX presence
2. **Documents Reviewed**: List of files analyzed
3. **Sections Evaluated**: Checklist sections completed
4. **Findings**: Issues, concerns, recommendations
5. **Validation Results**: Pass/Fail/Concerns for each item
6. **Overall Assessment**: Summary and recommendations

**Example Report Structure**:
```markdown
# PO Master Validation Checklist Report

## Project Type
- Type: Greenfield
- UI/UX: Yes
- Architecture: Fullstack

## Documents Reviewed
- prd.md (v2.0)
- architecture.md (v4, sharded)
- front-end-spec.md (v2.0)

## Validation Results

### 1. PROJECT SETUP & INITIALIZATION
✅ PASS - All items validated

#### 1.1 Project Scaffolding
- ✅ Epic 1 includes project creation steps
- ✅ Starter template setup defined
- ✅ Initial README included

### 2. INFRASTRUCTURE & DEPLOYMENT
⚠️ CONCERNS - 1 item needs attention

#### 2.1 Deployment Configuration
- ✅ Deployment target specified
- ⚠️ CI/CD pipeline not defined in Epic 1
- ✅ Environment variables documented

## Overall Assessment
**Status**: PASS with CONCERNS

The PRD is well-structured with clear epics and stories. Minor concern:
CI/CD pipeline setup should be addressed in Epic 1 to enable continuous
deployment from the start.

### Recommendations
1. Add CI/CD pipeline setup to Epic 1, Story 1.3
2. Consider adding deployment story before first feature story
```

---

### 4.6 Fixed Vocabulary Standards

BMad uses controlled vocabularies for consistency and parsability.

#### 4.6.1 Requirement Prefixes

**Functional Requirements**: `FR{n}`
- Format: `FR` + sequential number (1, 2, 3, ...)
- Example: `FR1: Users can register with email and password`

**Non-Functional Requirements**: `NFR{n}`
- Format: `NFR` + sequential number
- Example: `NFR1: System must handle 1000 concurrent users`

**Compatibility Requirements** (Brownfield): `CR{n}`
- Format: `CR` + sequential number
- Example: `CR1: Must integrate with existing user database schema`

**Integration Verification** (Brownfield): `IV{n}`
- Format: `IV` + sequential number
- Example: `IV1: Verify existing user sessions are preserved`

**Acceptance Criteria**: `AC{n}` (in discussions)
- Format: `AC` + sequential number
- Example: Referenced in tasks as `(AC: 1, 2)` linking tasks to criteria

#### 4.6.2 Agent Names

**Fixed Agent Identifiers**:
- `analyst` / "Analyst (Mary)"
- `pm` / "PM (John)"
- `ux-expert` / "UX Expert (Sally)"
- `architect` / "Architect (Winston)"
- `po` / "PO (Sarah)"
- `scrum-master` / "SM (Bob)"
- `dev-agent` / "Dev (James)"
- `qa-agent` / "QA (Quinn)"
- `bmad-master` / "BMad-Master"
- `bmad-orchestrator` / "BMad-Orchestrator"

**Usage**:
- Configuration: Use lowercase hyphenated form (`dev-agent`)
- Documentation: Use full name with persona ("Dev (James)")
- Change logs: Use short form ("PM Agent", "Dev Agent")

#### 4.6.3 Test Levels

**Fixed Vocabulary**:
- `Unit`: Unit tests (isolated component testing)
- `Integration`: Integration tests (component interaction testing)
- `E2E`: End-to-end tests (full user flow testing)

**Usage**: Consistent capitalization in test scenarios and test design.

#### 4.6.4 Configuration Keys

**Core Config Keys** (from `core-config.yaml`):
- `markdownExploder`: Boolean flag for sharding
- `qa.qaLocation`: QA gate file directory
- `prd.prdFile`: PRD file path
- `prd.prdVersion`: PRD version (v3, v4)
- `prd.prdSharded`: Enable PRD sharding
- `prd.prdShardedLocation`: PRD shard directory
- `prd.epicFilePattern`: Epic file naming pattern
- `architecture.architectureFile`: Architecture file path
- `architecture.architectureVersion`: Architecture version
- `architecture.architectureSharded`: Enable architecture sharding
- `architecture.architectureShardedLocation`: Architecture shard directory
- `customTechnicalDocuments`: Custom doc paths (optional)
- `devLoadAlwaysFiles`: Files loaded for every Dev story
- `devDebugLog`: Debug log file path
- `devStoryLocation`: Story file directory
- `slashPrefix`: Command prefix (default: "BMad")

---

## Section Summary

Section 4 has established the metadata, versioning, and status standards used throughout BMad:

1. **Template Metadata**: Core template metadata blocks with workflow and agent configuration
2. **Document Metadata**: Change logs, status fields, timestamps, and agent attribution
3. **Version Numbering**: Semantic versioning for templates and documents
4. **Status Indicators**: Story statuses, QA gate decisions, severity levels, test priorities
5. **Checklist Formats**: Validation checklists with embedded LLM instructions
6. **Fixed Vocabulary**: Controlled vocabularies for requirements, agents, test levels, and configuration

These standards enable consistent tracking, validation, and state management across all BMad artifacts and workflows.

---

[← Section 3: Markdown Formatting Conventions](output-format-standards-section3.md) | **[Section 5: ADK Translation & Summary →](output-format-standards-section5.md)**
