# BMad Framework Output Format Standards - Section 1: Introduction & Core Patterns

**Analysis Date**: 2025-10-14
**Analyzer**: Claude Code (AI Agent)
**Phase**: Phase 4, Task 4.4
**Document Version**: 1.0

---

## Table of Contents

- [Section 1: Introduction & Core Patterns](#section-1-introduction--core-patterns) (This document)
- [Section 2: File Naming & Directory Structure Standards](output-format-standards-section2.md)
- [Section 3: Markdown Formatting Conventions](output-format-standards-section3.md)
- [Section 4: Metadata, Versioning & Status Standards](output-format-standards-section4.md)
- [Section 5: ADK Translation & Summary](output-format-standards-section5.md)

---

## Executive Summary

This document provides a comprehensive analysis of the BMad framework's output format standards, conventions, and patterns used across all generated artifacts. Understanding these standards is critical for:

1. **Consistency**: Ensuring all artifacts follow predictable patterns
2. **Interoperability**: Enabling agents to read, parse, and update artifacts created by other agents
3. **Maintainability**: Supporting human developers who work with AI-generated artifacts
4. **Traceability**: Tracking artifact evolution through versions and changes
5. **ADK Translation**: Designing equivalent output generation in Google Vertex AI ADK

---

## Purpose & Scope

### Purpose

Output format standards define the conventions, patterns, and structures that BMad agents use when generating artifacts (documents, templates, reports, gates, etc.). These standards ensure:

- **Consistency**: All artifacts follow common patterns regardless of which agent created them
- **Parsability**: Artifacts can be programmatically parsed, validated, and updated
- **Human-Readability**: Artifacts remain accessible to human developers and stakeholders
- **Version Control Friendliness**: Artifacts work well with git and text-based diff tools
- **Multi-Agent Collaboration**: Agents can safely update sections they own without conflicts

### Scope

This analysis covers output format standards across **all BMad artifact types**:

1. **Template-Generated Documents**: PRDs, architectures, stories, specifications
2. **Programmatic Outputs**: QA gates, test scenarios, risk profiles
3. **Operational Documents**: Checklists, debug logs, change proposals
4. **Meta-Documents**: Indexes, navigation files, sharding indexes

### Key Finding: The YAML-in-Markdown Pattern

The most fundamental pattern in BMad is the **YAML-in-Markdown** pattern, which combines:

- **YAML front matter**: Machine-readable metadata and configuration
- **Markdown body**: Human-readable content with structure
- **Section markers**: Clear boundaries for agent ownership and editing

This pattern enables both human readability and programmatic processing, making it ideal for AI-agent collaboration.

---

## Section 1: Core Output Format Patterns

### 1.1 The YAML-in-Markdown Pattern

#### Overview

BMad uses a hybrid format that embeds YAML configuration within markdown documents. This pattern appears in:

- **Templates** (`.yaml` files that define structure)
- **Generated artifacts** (`.md` files with embedded YAML metadata)
- **Checklists** (`.md` files with embedded execution instructions)

#### Pattern Structure

```markdown
<!-- Powered by BMAD™ Core -->

# [Document Title]

[Optional YAML Front Matter Block]

## Section 1
Content...

## Section 2
Content...
```

#### Components

##### 1. **Header Comment** (Optional but Common)

```html
<!-- Powered by BMAD™ Core -->
```

- Indicates the document is managed by BMad
- Appears at the very top of most generated artifacts
- Acts as a marker for BMad-aware tools
- Not present in all documents (notably absent in story files)

##### 2. **YAML Front Matter** (In Templates)

Templates use YAML format exclusively:

```yaml
# <!-- Powered by BMAD™ Core -->
template:
  id: template-id-v2
  name: Template Name
  version: 2.0
  output:
    format: markdown
    filename: docs/output.md
    title: "{{project_name}} Document Title"

workflow:
  mode: interactive
  elicitation: advanced-elicitation

sections:
  - id: section-id
    title: Section Title
    instruction: Instructions for the agent
    elicit: true
    sections: [...]
```

**Key Elements**:
- **template**: Core template metadata (id, name, version, output config)
- **workflow**: Elicitation and interaction mode configuration
- **agent_config**: Section ownership and permissions (v2.0)
- **sections**: Hierarchical section definitions with instructions

##### 3. **Markdown Body** (In Generated Artifacts)

Generated artifacts use pure markdown:

```markdown
# Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Goal 1
- Goal 2

### Background Context
This project aims to...

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-14 | 1.0 | Initial draft | PM Agent |
```

**Key Elements**:
- Hierarchical heading structure (H1, H2, H3, etc.)
- Standard markdown formatting (lists, tables, code blocks, links)
- Section-based organization matching template structure
- Change logs for tracking modifications

#### Why This Pattern?

The YAML-in-Markdown pattern provides several critical advantages:

1. **Machine-Readable**: YAML sections can be parsed programmatically
2. **Human-Readable**: Markdown content is accessible to developers
3. **Version Control Friendly**: Text-based format works well with git
4. **Agent-Parsable**: AI agents can understand both structure and content
5. **Extensible**: New sections and metadata can be added without breaking existing tools
6. **Dual Purpose**: Templates define structure; outputs contain content

#### Pattern Variations

**Template Files (`.yaml`)**:
- Pure YAML format
- Define document structure and elicitation logic
- Located in `.bmad-core/templates/`
- Examples: `prd-tmpl.yaml`, `story-tmpl.yaml`, `qa-gate-tmpl.yaml`

**Generated Documents (`.md`)**:
- Pure Markdown format
- Follow structure defined by templates
- Located in project `docs/` directory
- Examples: `prd.md`, `architecture.md`, `01.01.setup-auth.md`

**Hybrid Documents (`.md` with YAML blocks)**:
- QA gate files use pure YAML with `.yaml` extension but stored as gates
- Checklists use markdown with embedded YAML instructions
- Example: `.bmad-core/checklists/po-master-checklist.md`

---

### 1.2 Section-Based Organization

#### Overview

BMad artifacts are organized into hierarchical sections that map directly to template definitions. This enables:

- **Structured Content**: Clear organization and navigation
- **Agent Ownership**: Specific agents own specific sections
- **Selective Updates**: Agents can update only their sections
- **Validation**: Checklists can validate specific sections
- **Traceability**: Changes can be tracked at section level

#### Section Hierarchy Levels

```markdown
# Document Title (H1 - Document Root)

## Top-Level Section (H2)
Content...

### Sub-Section (H3)
Content...

#### Sub-Sub-Section (H4)
Content...

##### Detailed Item (H5)
Content...

###### Implementation Detail (H6)
Content...
```

**Heading Level Guidelines**:

- **H1**: Document title only (one per document)
- **H2**: Primary sections matching template top-level sections
- **H3**: Sub-sections defined in template or logical breakdowns
- **H4**: Detailed breakdowns, specific items, or story-level sections
- **H5**: Fine-grained details, acceptance criteria, or implementation notes
- **H6**: Rarely used; reserved for deep nesting if needed

#### Section ID Mapping

Templates define section IDs that map to markdown headings:

**Template Definition**:
```yaml
sections:
  - id: goals-context
    title: Goals and Background Context
    sections:
      - id: goals
        title: Goals
      - id: background
        title: Background Context
```

**Generated Output**:
```markdown
## Goals and Background Context

### Goals
- Goal 1
- Goal 2

### Background Context
This project aims to...
```

**Mapping Rules**:
1. Section `title` becomes markdown heading text
2. Section `id` is used for programmatic reference (not visible in output)
3. Nesting depth determines heading level (H2 for top-level, H3 for sub-sections, etc.)
4. Section order in template determines order in output

#### Special Section Types

##### Repeatable Sections

Templates can define repeatable sections for lists (epics, stories, acceptance criteria):

**Template**:
```yaml
sections:
  - id: epic-details
    title: Epic {{epic_number}} {{epic_title}}
    repeatable: true
    sections:
      - id: story
        title: Story {{epic_number}}.{{story_number}} {{story_title}}
        repeatable: true
```

**Output**:
```markdown
## Epic 1: Foundation & Core Infrastructure

### Story 1.1: Project Setup
As a developer...

### Story 1.2: Database Configuration
As a developer...

## Epic 2: User Management

### Story 2.1: User Registration
As a user...
```

##### Conditional Sections

Templates can define sections that only appear under certain conditions:

**Template**:
```yaml
sections:
  - id: ui-goals
    title: User Interface Design Goals
    condition: PRD has UX/UI requirements
```

**Output**: Section only appears if project includes UI/UX requirements.

##### Agent-Specific Sections

Templates can define sections owned by specific agents (v2.0 feature):

**Template**:
```yaml
sections:
  - id: dev-agent-record
    title: Dev Agent Record
    owner: dev-agent
    editors: [dev-agent]
```

**Output**: Section that only Dev agent can create and edit.

---

### 1.3 Variable Interpolation

#### Overview

BMad uses **Mustache-style variable interpolation** (`{{variable_name}}`) to insert dynamic content into templates and generated artifacts.

#### Interpolation Syntax

**Basic Variable**:
```yaml
template: "Story {{epic_num}}.{{story_num}}: {{story_title}}"
```

**Output**:
```markdown
Story 1.2: User Authentication
```

#### Variable Scopes

Variables can come from multiple sources:

1. **User Input**: Gathered during elicitation
   - `{{project_name}}`
   - `{{user_type}}`
   - `{{action}}`
   - `{{benefit}}`

2. **Configuration**: From `core-config.yaml`
   - `{{prdFile}}`
   - `{{architectureFile}}`
   - `{{devStoryLocation}}`

3. **System-Generated**: Created by agents
   - `{{epic_num}}`
   - `{{story_num}}`
   - `{{story_title_short}}`
   - `{{agent_model_name_version}}`

4. **Template Context**: Passed between sections
   - `{{epic_number}}`
   - `{{epic_title}}`
   - `{{story_number}}`
   - `{{story_title}}`

#### Common Variables by Template

**PRD Template**:
- `{{project_name}}`: Project name
- `{{epic_number}}`: Sequential epic number (1, 2, 3...)
- `{{epic_title}}`: Epic title
- `{{story_number}}`: Sequential story number within epic (1, 2, 3...)
- `{{story_title}}`: Story title
- `{{user_type}}`: User role (user, admin, developer, etc.)
- `{{action}}`: What the user wants to do
- `{{benefit}}`: Why the user wants to do it

**Story Template**:
- `{{epic_num}}`: Epic number (e.g., "1")
- `{{story_num}}`: Story number (e.g., "2")
- `{{story_title_short}}`: Slugified story title (e.g., "setup-auth")
- `{{role}}`: User role
- `{{action}}`: User action
- `{{benefit}}`: User benefit
- `{{agent_model_name_version}}`: AI model used (e.g., "claude-sonnet-4-5")

**Frontend Spec Template** (70+ variables):
- Design system variables: `{{color_primary}}`, `{{font_heading}}`, `{{spacing_unit}}`
- Component variables: `{{component_name}}`, `{{component_type}}`
- Page variables: `{{page_name}}`, `{{page_route}}`
- Interaction variables: `{{animation_duration}}`, `{{transition_type}}`

**Architecture Template**:
- `{{tech_stack_item}}`: Technology choice
- `{{framework_name}}`: Framework name
- `{{library_name}}`: Library name
- `{{service_name}}`: Microservice name

#### Interpolation in Instructions

Variables can be used in agent instructions:

```yaml
sections:
  - id: story
    instruction: Define the story for {{epic_title}} using the user story format
```

This provides context-aware guidance to agents during elicitation.

#### Interpolation in Filenames

File paths use interpolation for dynamic naming:

```yaml
output:
  filename: docs/stories/{{epic_num}}.{{story_num}}.{{story_title_short}}.md
```

**Example Output**: `docs/stories/01.02.user-authentication.md`

#### Interpolation Processing

**Template Processing Flow**:
1. Agent loads template from `.bmad-core/templates/`
2. Agent gathers variable values through elicitation or context
3. Agent replaces `{{variable}}` placeholders with actual values
4. Agent generates final markdown output
5. Agent writes output to configured location

**Example**:

**Template**:
```yaml
template: |
  **As a** {{role}},
  **I want** {{action}},
  **so that** {{benefit}}
```

**Variable Values**:
- `role`: "developer"
- `action`: "set up authentication"
- `benefit`: "users can securely access the application"

**Generated Output**:
```markdown
**As a** developer,
**I want** set up authentication,
**so that** users can securely access the application
```

---

### 1.4 Document Type Classification

BMad generates several distinct types of artifacts, each with specific format conventions.

#### 1. **Specification Documents**

**Purpose**: Define requirements, architecture, design, and plans.

**Templates**:
- `prd-tmpl.yaml` → `docs/prd.md`
- `brownfield-prd-tmpl.yaml` → `docs/prd.md`
- `architecture-tmpl.yaml` → `docs/architecture.md`
- `fullstack-architecture-tmpl.yaml` → `docs/architecture.md`
- `front-end-spec-tmpl.yaml` → `docs/front-end-spec.md`
- `project-brief-tmpl.yaml` → `docs/brief.md`

**Format Characteristics**:
- Pure markdown with hierarchical sections
- Change log tables for version tracking
- Heavy use of lists (bullet, numbered) for requirements
- Tables for structured data
- Mermaid diagrams for visualizations
- Next Steps sections with handoff prompts

**Example Structure** (PRD):
```markdown
# Product Requirements Document (PRD)

## Goals and Background Context
### Goals
- Goal 1
- Goal 2
### Background Context
...
### Change Log
| Date | Version | Description | Author |

## Requirements
### Functional
1. FR1: Requirement text
2. FR2: Requirement text
### Non Functional
1. NFR1: Requirement text

## User Interface Design Goals
### Overall UX Vision
...

## Technical Assumptions
### Repository Structure: Monorepo
### Service Architecture
...

## Epic List
- Epic 1: Title - Goal statement
- Epic 2: Title - Goal statement

## Epic 1: Foundation & Core Infrastructure
### Story 1.1: Project Setup
**As a** developer,
**I want** to set up the project,
**so that** I can begin development

#### Acceptance Criteria
1. AC1: Criterion text
2. AC2: Criterion text

### Story 1.2: Database Configuration
...

## Checklist Results Report
...

## Next Steps
### UX Expert Prompt
### Architect Prompt
```

#### 2. **Story Documents**

**Purpose**: Define individual development tasks with acceptance criteria, tasks, and implementation notes.

**Template**: `story-tmpl.yaml` → `docs/stories/{epic}.{story}.{title}.md`

**Format Characteristics**:
- Structured sections with agent ownership
- User story format ("As a... I want... so that...")
- Numbered acceptance criteria
- Checkbox task lists
- Dev Notes with curated context
- Dev Agent Record section (populated during development)
- QA Results section (populated during review)
- Change log table

**Example Structure**:
```markdown
# Story 1.2: User Authentication

## Status
InProgress

## Story
**As a** developer,
**I want** to implement user authentication,
**so that** users can securely access the application

## Acceptance Criteria
1. Users can register with email and password
2. Users can log in with credentials
3. Sessions are maintained securely

## Tasks / Subtasks
- [ ] Task 1: Set up authentication library (AC: 1)
  - [ ] Install dependencies
  - [ ] Configure authentication provider
- [ ] Task 2: Implement registration (AC: 1)
  - [ ] Create registration endpoint
  - [ ] Validate user input
- [ ] Task 3: Implement login (AC: 2)
  - [ ] Create login endpoint
  - [ ] Generate session tokens

## Dev Notes
### Testing
- Test file location: `tests/auth.test.ts`
- Use Jest for unit tests
- Test all edge cases (invalid input, duplicate users, etc.)

### Relevant Architecture Context
[Source: architecture/tech-stack.md#authentication]
- Using Passport.js for authentication
- JWT tokens for session management
- bcrypt for password hashing

## Change Log
| Date | Version | Description | Author |
| 2025-10-14 | 1.0 | Initial draft | SM Agent |

## Dev Agent Record
### Agent Model Used
claude-sonnet-4-5-20250929

### Debug Log References
See .ai/debug-log.md lines 45-89

### Completion Notes List
- Implemented all acceptance criteria
- Added additional validation for email format
- Created helper function for token generation

### File List
- src/auth/register.ts (created)
- src/auth/login.ts (created)
- src/auth/middleware.ts (created)
- tests/auth.test.ts (created)

## QA Results
[Populated by QA Agent after review]
```

#### 3. **Programmatic Outputs** (Gates, Assessments, Reports)

**Purpose**: Machine-readable outputs for quality gates, risk assessments, and test scenarios.

**Types**:
- QA Gate files (`.yaml` format)
- Risk profile sections (markdown sections)
- Test scenarios (markdown sections with structured fields)
- NFR assessment sections (markdown sections)
- Requirements traceability (markdown tables)

**Format Characteristics**:
- Pure YAML (for gates) or structured markdown (for assessments)
- Fixed vocabulary (severity levels, decision types, priority levels)
- Consistent field structures
- Timestamps and agent attribution
- Rationale and evidence fields

**Example** (QA Gate):
```yaml
decision: pass
rationale: |
  All acceptance criteria met. Code quality is high with comprehensive test coverage.
  Minor concerns around error handling have been addressed.

severity: low

concerns:
  - category: code-quality
    description: Error messages could be more specific
    recommendation: Add context to error responses
    severity: low

test_results:
  unit_tests:
    passed: 45
    failed: 0
    coverage: 92%
  integration_tests:
    passed: 12
    failed: 0

timestamp: 2025-10-14T15:30:00Z
qa_agent: claude-sonnet-4-5-20250929
```

**Example** (Risk Profile Section):
```markdown
### Risk 3: Authentication Token Expiry Handling

**Category**: Security
**Probability**: 3/5 (Moderate)
**Impact**: 4/5 (High)
**Risk Score**: 12 (High Priority)

**Description**:
Token expiry handling may not gracefully manage edge cases where tokens expire during active user sessions.

**Mitigation Strategy**:
1. Implement token refresh mechanism
2. Add client-side expiry detection
3. Provide clear user feedback on session timeout
4. Test with various expiry scenarios

**Gate Impact**: If unmitigated, this risk should BLOCK deployment to production.
```

#### 4. **Operational Documents** (Checklists, Logs)

**Purpose**: Guide agent execution, track changes, and support debugging.

**Types**:
- Checklists (`.bmad-core/checklists/*.md`)
- Debug logs (`.ai/debug-log.md`)
- Change proposals (`sprint-change-proposal.md`)
- Sharding indexes (`_index.md`)

**Format Characteristics**:
- Markdown with embedded execution instructions
- Checkbox lists for tracking completion
- Timestamped entries (logs)
- Embedded YAML blocks for agent instructions (checklists)
- Section markers for agent-specific content

**Example** (Checklist):
```markdown
# Product Owner (PO) Master Validation Checklist

[[LLM: INITIALIZATION INSTRUCTIONS - PO MASTER CHECKLIST
PROJECT TYPE DETECTION:
...
]]

## 1. PROJECT SETUP & INITIALIZATION

### 1.1 Project Scaffolding [[GREENFIELD ONLY]]
- [ ] Epic 1 includes explicit steps for project creation
- [ ] Starter template setup steps are included
- [ ] Initial README setup is included

### 1.2 Existing System Integration [[BROWNFIELD ONLY]]
- [ ] Existing project analysis has been completed
- [ ] Integration points identified

## 2. INFRASTRUCTURE & DEPLOYMENT
...
```

**Example** (Debug Log):
```markdown
# Dev Agent Debug Log

## 2025-10-14 15:30:00 - Story 1.2: User Authentication

### Task: Set up authentication library

**Action**: Installed passport and passport-local packages
**Result**: Success
**Files Modified**: package.json, package-lock.json

### Task: Configure authentication provider

**Action**: Created passport configuration
**Result**: Success
**Files Created**: src/config/passport.ts
**Notes**: Using local strategy with bcrypt for password hashing
```

---

## Section Summary

Section 1 has established the foundational output format patterns used throughout BMad:

1. **YAML-in-Markdown Pattern**: The core hybrid format combining machine-readable metadata with human-readable content
2. **Section-Based Organization**: Hierarchical structure with clear ownership and boundaries
3. **Variable Interpolation**: Dynamic content generation using `{{variable}}` syntax
4. **Document Type Classification**: Four primary artifact types with distinct format conventions

These patterns enable consistent, parsable, and maintainable outputs across all BMad agents and workflows.

---

**Next**: [Section 2: File Naming & Directory Structure Standards →](output-format-standards-section2.md)
