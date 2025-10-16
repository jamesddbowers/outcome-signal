# Architecture Templates Analysis - Section 1: Introduction & Overview

**Document Version**: 1.0
**Created**: 2025-10-14
**Author**: Claude Code (AI Agent)
**Part**: 1 of 5
**Task**: Phase 4, Task 4.2 - Architecture Templates Analysis

---

## Navigation

- **Current**: Section 1 - Introduction & Overview
- **Next**: [Section 2 - Backend Architecture Template](architecture-templates-section2.md)
- [Section 3 - Fullstack Architecture Template](architecture-templates-section3.md)
- [Section 4 - Frontend & Brownfield Architecture](architecture-templates-section4.md)
- [Section 5 - Technical Preferences & Summary](architecture-templates-section5.md)
- [Back to Phase 4 Tasks](../../tasks/PHASE-4-template-analysis.md)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Template Inventory](#template-inventory)
3. [Architecture Template Philosophy](#architecture-template-philosophy)
4. [Common Patterns Across Templates](#common-patterns-across-templates)
5. [Template Workflow Configuration](#template-workflow-configuration)
6. [Section Organization Framework](#section-organization-framework)
7. [ADK Translation Considerations](#adk-translation-considerations)

---

## Executive Summary

This document analyzes the **5 architecture template files** that drive system design and technical decision-making in the BMad framework. Architecture templates are the most complex and comprehensive templates in the system, serving as the **technical foundation** for AI-driven development.

### Key Statistics

| Metric | Value |
|--------|-------|
| **Total Templates Analyzed** | 5 templates |
| **Total Lines of Template YAML** | 2,529 lines |
| **Largest Template** | Fullstack Architecture (825 lines) |
| **Smallest Template** | Frontend Architecture (220 lines) |
| **Average Template Size** | 506 lines |
| **Section Count Range** | 12-20 major sections per template |
| **Total Unique Sections** | 150+ section definitions |
| **Conditional Sections** | 15+ conditional sections |
| **Repeatable Sections** | 20+ repeatable sections |
| **Mermaid Diagrams** | 8+ diagram types defined |
| **Code Block Sections** | 30+ code template sections |

### Template Categories

The 5 architecture templates cover distinct project scenarios:

1. **Backend-Focused Architecture** (`architecture-tmpl.yaml`) - 652 lines
   - For services, APIs, backend systems
   - No UI or minimal UI
   - Comprehensive backend patterns

2. **Fullstack Architecture** (`fullstack-architecture-tmpl.yaml`) - 825 lines
   - **Unified frontend + backend** in one document
   - For modern fullstack applications
   - Monorepo-centric approach
   - Most comprehensive template

3. **Frontend Architecture** (`front-end-architecture-tmpl.yaml`) - 220 lines
   - **Companion to backend architecture**
   - Framework-agnostic frontend design
   - AI tool integration focused
   - Minimal but complete

4. **Brownfield Architecture** (`brownfield-architecture-tmpl.yaml`) - 478 lines
   - For **enhancing existing projects**
   - Deep analysis mandate
   - Integration-focused
   - Validation checkpoints

5. **Technical Preferences** (`technical-preferences.md`) - 97 bytes (data file)
   - User-defined technology preferences
   - Referenced by architecture templates
   - Currently empty ("None Listed")

### Critical Design Patterns

#### 1. **Platform-First Architecture**
All templates emphasize **platform selection** (Vercel, AWS, Azure, GCP) as a foundational decision that influences all subsequent technology choices.

#### 2. **Tech Stack as Single Source of Truth**
The "Tech Stack" section is **definitive** - all other documents must reference these exact versions. No "latest" versions allowed.

#### 3. **Starter Template Discovery**
Every template includes a **mandatory starter template section** to identify and analyze existing project foundations before proceeding with design.

#### 4. **Coding Standards Philosophy**
Templates explicitly guide users to create **minimal, critical-only** standards focused on preventing AI mistakes, not documenting obvious best practices.

#### 5. **Interactive Elicitation**
All major sections use `elicit: true` to ensure user validation and prevent AI assumptions in critical architectural decisions.

#### 6. **Mermaid Diagram Integration**
Templates define **structured diagram types** (graph, sequence, C4) for visual architecture documentation.

---

## Template Inventory

### Complete Template List

| Template ID | Name | Version | Lines | Output File | Owner Agent |
|-------------|------|---------|-------|-------------|-------------|
| `architecture-template-v2` | Architecture Document | 2.0 | 652 | `docs/architecture.md` | Architect (Winston) |
| `fullstack-architecture-template-v2` | Fullstack Architecture Document | 2.0 | 825 | `docs/architecture.md` | Architect (Winston) |
| `frontend-architecture-template-v2` | Frontend Architecture Document | 2.0 | 220 | `docs/ui-architecture.md` | Architect (Winston) |
| `brownfield-architecture-template-v2` | Brownfield Enhancement Architecture | 2.0 | 478 | `docs/architecture.md` | Architect (Winston) |
| N/A | Technical Preferences | N/A | 97 bytes | `data/technical-preferences.md` | User-defined |

### Template Selection Decision Tree

```
Project Type?
├─ Greenfield (New Project)
│  ├─ Backend Only / API Service
│  │  └─ Use: architecture-tmpl.yaml
│  ├─ Frontend Only (with existing backend)
│  │  └─ Use: front-end-architecture-tmpl.yaml
│  └─ Fullstack Application
│     └─ Use: fullstack-architecture-tmpl.yaml
│
└─ Brownfield (Existing Project)
   └─ Significant Enhancement
      └─ Use: brownfield-architecture-tmpl.yaml
```

### Template Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                  Architecture Templates                      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │ Backend │          │Fullstack│          │Frontend │
   │  Only   │          │ Unified │          │  Only   │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                     │                     │
        │              ┌──────┴──────┐             │
        │              │             │             │
        └──────────────┤  Brownfield ├─────────────┘
                       │ Enhancement │
                       └──────┬──────┘
                              │
                    ┌─────────▼─────────┐
                    │ Technical         │
                    │ Preferences (Data)│
                    └───────────────────┘
```

---

## Architecture Template Philosophy

### Core Principles

#### 1. **AI Agent Blueprint, Not Documentation**

Architecture templates are **executable specifications** designed to guide AI agents, not just document decisions:

> "Its primary goal is to serve as the guiding architectural blueprint for **AI-driven development**, ensuring consistency and adherence to chosen patterns and technologies."
>
> — Backend Architecture Template, Line 23

This principle differentiates BMad architecture from traditional architecture documents:
- **Traditional**: Documents decisions for human readers
- **BMad**: Programs AI agent behavior with precise, actionable specifications

#### 2. **Starter Template First**

Every template mandates **starter template discovery** before architectural design:

```yaml
- id: starter-template
  title: Starter Template or Existing Project
  instruction: |
    Before proceeding further with architecture design, check if the
    project is based on a starter template or existing codebase
```

**Rationale**:
- Starter templates impose architectural constraints
- Pre-configured tech stacks and patterns must be respected
- AI agents need context of existing conventions
- Prevents architectural conflicts with starter foundations

**Process**:
1. Review PRD/brainstorming for starter mentions
2. Request access to starter documentation/repository
3. Analyze pre-configured stack, structure, patterns
4. Align architecture decisions with starter constraints
5. Document decision before proceeding

#### 3. **Tech Stack is Definitive**

The Tech Stack section is the **single source of truth**:

> "This is the DEFINITIVE technology selection section. [...] This table is the single source of truth - all other docs must reference these choices."
>
> — Backend Architecture Template, Line 128

**Key Requirements**:
- **Pin specific versions** (no "latest")
- Get **explicit user approval** for each selection
- Present **2-3 viable options** with pros/cons before recommending
- All development MUST use these exact versions

**Example Entry**:
```yaml
| **Language** | TypeScript | 5.3.3 | Primary development language |
  Strong typing, excellent tooling, team expertise |
```

#### 4. **Minimal Coding Standards**

Templates explicitly guide users to **minimize standards** to critical-only rules:

> "These standards are MANDATORY for AI agents. Work with user to define ONLY the critical rules needed to prevent bad code. Explain that:
> 1. This section directly controls AI developer behavior
> 2. Keep it minimal - assume AI knows general best practices
> 3. Focus on project-specific conventions and gotchas
> 4. Overly detailed standards bloat context and slow development"
>
> — Backend Architecture Template, Lines 444-450

**Anti-Patterns to Avoid**:
- ❌ "Use SOLID principles"
- ❌ "Write clean code"
- ❌ "Follow best practices"

**Good Examples**:
- ✅ "Never use console.log in production code - use logger"
- ✅ "All API responses must use ApiResponse wrapper type"
- ✅ "Database queries must use repository pattern, never direct ORM"

#### 5. **Platform-First Decision Making**

Fullstack template emphasizes **platform selection** as foundational:

```yaml
- id: platform-infrastructure
  title: Platform and Infrastructure Choice
  instruction: |
    Based on PRD requirements and technical assumptions, make a
    platform recommendation:

    1. Consider common patterns:
       - Vercel + Supabase: For rapid development with Next.js
       - AWS Full Stack: For enterprise scale
       - Azure: For .NET ecosystems
       - Google Cloud: For ML/AI heavy applications
```

**Impact**: Platform choice cascades to:
- Deployment strategy
- Service selection
- Authentication approach
- Database options
- Monitoring tools
- Cost structure

#### 6. **Brownfield Validation Mandate**

Brownfield template includes **continuous validation checkpoints**:

> "MANDATORY VALIDATION: Before presenting component architecture, confirm: 'The new components I'm proposing follow the existing architectural patterns I identified in your codebase: [specific patterns]. The integration interfaces respect your current component structure and communication patterns. Does this match your project's reality?'"
>
> — Brownfield Architecture Template, Line 186

**Validation Points**:
- After existing project analysis
- Before integration strategy
- Before component architecture
- Before API design
- Before deployment planning

**Rationale**: Prevents AI assumptions about existing systems, ensures evidence-based recommendations.

---

## Common Patterns Across Templates

### 1. **Section Structure Pattern**

All templates follow consistent section hierarchy:

```yaml
sections:
  - id: section-id            # Unique identifier
    title: Section Title      # Human-readable title
    instruction: |            # AI agent guidance
      Detailed instructions for this section
    elicit: true              # Request user validation
    condition: expression     # Optional: conditional rendering
    repeatable: true          # Optional: multiple instances allowed
    type: content-type        # Optional: specialized content type
    sections:                 # Optional: nested sub-sections
      - id: subsection-id
        title: Subsection Title
```

### 2. **Elicitation Pattern**

Critical sections use `elicit: true` to ensure user validation:

```yaml
- id: tech-stack
  title: Tech Stack
  instruction: |
    [...] Upon render of the table, ensure the user is aware of the
    importance of this sections choices, should also look for gaps or
    disagreements with anything, ask for any clarifications if something
    is unclear why its in the list, and also right away elicit feedback -
    this statement and the options should be rendered and then prompt
    right all before allowing user input.
  elicit: true
```

**Elicitation Sections** (Typical):
- Starter template selection
- High-level architecture
- Tech stack
- Data models
- Components
- External APIs
- Core workflows
- REST API spec
- Database schema
- Source tree
- Infrastructure & deployment
- Error handling strategy
- Coding standards
- Test strategy
- Security

### 3. **Template Variable Pattern**

Templates use `{{variable_name}}` for interpolation:

```yaml
template: |
  **Platform:** {{selected_platform}}
  **Key Services:** {{core_services_list}}
  **Deployment Host and Regions:** {{regions}}
```

**Variable Naming Conventions**:
- Use `snake_case` for multi-word variables
- Descriptive names (e.g., `{{frontend_deploy_platform}}`)
- Suffix with type hints when helpful (e.g., `{{api_docs_url}}`)

### 4. **Conditional Section Pattern**

Use `condition` field for optional sections:

```yaml
- id: external-apis
  title: External APIs
  condition: Project requires external API integrations
  instruction: |
    For each external service integration: [...]
    If no external APIs are needed, state this explicitly and skip.
```

### 5. **Repeatable Section Pattern**

Use `repeatable: true` for multiple instances:

```yaml
- id: data-models
  title: Data Models
  repeatable: true
  sections:
    - id: model
      title: "{{model_name}}"
      template: |
        **Purpose:** {{model_purpose}}
        **Key Attributes:** [...]
```

### 6. **Mermaid Diagram Pattern**

Structured diagram sections with type specification:

```yaml
- id: project-diagram
  title: High Level Project Diagram
  type: mermaid
  mermaid_type: graph        # Options: graph, sequence, flowchart
  instruction: |
    Create a Mermaid diagram that visualizes:
    - System boundaries
    - Major components/services
    - Data flow directions
```

**Diagram Types Used**:
- `graph`: System architecture, component relationships
- `sequence`: Workflows, auth flows, error handling
- `flowchart`: Decision trees, promotion flows

### 7. **Code Block Pattern**

Structured code sections with language specification:

```yaml
- id: source-tree
  title: Source Tree
  type: code
  language: plaintext
  instruction: |
    Create a project folder structure that reflects: [...]
  examples:
    - |
      project-root/
      ├── packages/
      │   ├── api/
      │   └── web/
```

**Supported Languages**:
- `plaintext`: Directory structures, text diagrams
- `yaml`: OpenAPI specs, CI/CD configs
- `typescript`: Code templates, interfaces
- `json`: Request/response schemas
- `sql`: Database schemas
- `graphql`: GraphQL schemas
- `bash`: Setup commands, scripts

### 8. **Table Pattern**

Structured table sections with column definitions:

```yaml
- id: technology-stack-table
  title: Technology Stack Table
  type: table
  columns: [Category, Technology, Version, Purpose, Rationale]
  examples:
    - "| **Language** | TypeScript | 5.3.3 | Primary development language |
       Strong typing, excellent tooling, team expertise |"
```

### 9. **Validation Rule Pattern**

Instructions include validation requirements:

```yaml
instruction: |
  Work with user to finalize all choices:
  1. Review PRD technical assumptions
  2. For each category, present 2-3 viable options with pros/cons
  3. Make a clear recommendation based on project needs
  4. Get explicit user approval for each selection
  5. Document exact versions (avoid "latest" - pin specific versions)
```

### 10. **Checklist Integration Pattern**

All templates end with checklist execution:

```yaml
- id: checklist-results
  title: Checklist Results Report
  instruction: |
    Before running the checklist, offer to output the full architecture
    document. Once user confirms, execute the architect-checklist and
    populate results here.
```

---

## Template Workflow Configuration

### Workflow Metadata

All architecture templates use consistent workflow configuration:

```yaml
workflow:
  mode: interactive
  elicitation: advanced-elicitation
```

**Mode: Interactive**
- Agent actively elicits user input throughout template population
- Contrasts with "YOLO mode" used in project-brief template
- Ensures architectural decisions are validated, not assumed

**Elicitation: Advanced**
- References the `advanced-elicitation.md` task
- Provides sophisticated elicitation strategies
- Guides agents in asking effective questions

### Advanced Elicitation Task

The `advanced-elicitation.md` task (referenced by all architecture templates) provides:

1. **Socratic Questioning** techniques
2. **Constraint Discovery** methods
3. **Assumption Validation** strategies
4. **Preference Elicitation** patterns
5. **Trade-off Discussion** frameworks

**Key Insight**: Architecture requires more sophisticated elicitation than simple templates because decisions are complex, interdependent, and have long-term consequences.

---

## Section Organization Framework

### Universal Section Pattern

All architecture templates follow this **organizational framework**:

```
1. Introduction
   ├─ Project context
   ├─ Starter template analysis
   └─ Change log

2. High-Level Architecture
   ├─ Technical summary
   ├─ Platform/infrastructure choice
   ├─ Architecture diagram
   └─ Architectural patterns

3. Tech Stack (DEFINITIVE)
   └─ Technology stack table

4. Data Models
   └─ Entity definitions with relationships

5. Components
   ├─ Component list with responsibilities
   └─ Component diagrams

6. External APIs (conditional)
   └─ Third-party integrations

7. Core Workflows
   └─ Sequence diagrams

8. API Specification (conditional)
   └─ REST/GraphQL/tRPC definitions

9. Database Schema
   └─ SQL/NoSQL schema definitions

10. Source Tree
    └─ Project folder structure

11. Infrastructure & Deployment
    ├─ IaC configuration
    ├─ Deployment strategy
    ├─ Environments
    └─ Rollback strategy

12. Error Handling Strategy
    ├─ General approach
    ├─ Logging standards
    └─ Error patterns

13. Coding Standards
    ├─ Core standards
    ├─ Naming conventions
    └─ Critical rules (minimal!)

14. Test Strategy
    ├─ Testing philosophy
    ├─ Test types & organization
    ├─ Test data management
    └─ Continuous testing

15. Security
    ├─ Input validation
    ├─ Auth/authz
    ├─ Secrets management
    ├─ API security
    ├─ Data protection
    └─ Security testing

16. Checklist Results
    └─ Architect checklist execution

17. Next Steps
    └─ Handoff prompts for other agents
```

### Section Count by Template

| Template | Major Sections | Subsections | Total Sections |
|----------|---------------|-------------|----------------|
| Backend Architecture | 13 | 45+ | 58+ |
| Fullstack Architecture | 16 | 60+ | 76+ |
| Frontend Architecture | 10 | 25+ | 35+ |
| Brownfield Architecture | 13 | 40+ | 53+ |

### Conditional Sections

Templates use conditional rendering for optional sections:

**Backend Architecture**:
- `external-apis`: "Project requires external API integrations"
- `rest-api-spec`: "Project includes REST API"
- `language-specifics`: "Critical language-specific rules needed"

**Fullstack Architecture**:
- `new-tech-additions`: "Enhancement requires new technologies"
- `rest-api`, `graphql-api`, `trpc-api`: Based on API style selection

**Brownfield Architecture**:
- `new-tech-additions`: "Enhancement requires new technologies"
- `api-design`: "Enhancement requires API changes"
- `external-api-integration`: "Enhancement requires new external APIs"
- `enhancement-standards`: "New patterns needed for enhancement"

---

## ADK Translation Considerations

### Storage Strategy

**Challenge**: Architecture templates are large (220-825 lines) and complex with nested sections, conditionals, and repeatables.

**Recommended Approach**:

1. **Cloud Storage for Templates**
   - Store YAML templates in Google Cloud Storage bucket
   - Version templates (e.g., `architecture-tmpl-v2.yaml`)
   - Use bucket versioning for change tracking

2. **Firestore for Metadata**
   - Template catalog with metadata (id, version, output format, agent ownership)
   - Template selection logic (greenfield vs brownfield, backend vs fullstack)
   - Template variable definitions

3. **Template Parser Service**
   - Cloud Function for template loading and parsing
   - YAML to JSON conversion for ADK consumption
   - Variable interpolation engine
   - Conditional section evaluation
   - Repeatable section rendering

### Rendering Engine Design

**Core Capabilities Needed**:

1. **Section Navigation**
   - Support nested section hierarchy (up to 4 levels deep)
   - Track section completion state
   - Handle section dependencies

2. **Variable Interpolation**
   - Parse `{{variable_name}}` syntax
   - Validate variable values
   - Support complex expressions

3. **Conditional Rendering**
   - Evaluate `condition` expressions
   - Skip sections when condition is false
   - Maintain document structure integrity

4. **Repeatable Sections**
   - Support `repeatable: true` sections
   - Allow multiple instances with unique data
   - Maintain instance ordering

5. **Content Type Handling**
   - `text`: Simple markdown
   - `table`: Structured table rendering
   - `code`: Syntax-highlighted code blocks
   - `mermaid`: Diagram generation
   - `bullet-list`, `numbered-list`: List rendering

### Elicitation Flow Management

**Challenge**: Architecture templates require extensive user interaction with 15+ elicitation points.

**Recommended Approach**:

1. **Session State Management**
   - Firestore document for template session
   - Track current section, completed sections, pending questions
   - Support pause/resume

2. **Question Queue**
   - Parse all `elicit: true` sections upfront
   - Build question queue with dependencies
   - Present questions in logical order

3. **Validation Integration**
   - For each elicitation point, present options
   - Capture user selection with rationale
   - Validate against PRD constraints
   - Allow revision of previous answers

### Agent Integration

**Architect Agent Configuration**:

```python
from google.cloud import aiplatform

architect_agent = aiplatform.Agent(
    display_name="Winston - Architect",
    model="gemini-2.0-flash-001",
    tools=[
        {
            "name": "select_architecture_template",
            "description": "Select appropriate architecture template",
            "parameters": {
                "project_type": "greenfield | brownfield",
                "scope": "backend | frontend | fullstack"
            }
        },
        {
            "name": "populate_template_section",
            "description": "Populate a template section with content",
            "parameters": {
                "template_id": "string",
                "section_id": "string",
                "content": "object"
            }
        },
        {
            "name": "execute_architect_checklist",
            "description": "Execute architect quality checklist",
            "parameters": {
                "architecture_doc_path": "string"
            }
        }
    ]
)
```

### Template Selection Logic

**Cloud Function: select_architecture_template**

```python
def select_architecture_template(project_type: str, scope: str,
                                  has_ui: bool, has_backend: bool) -> str:
    """
    Select appropriate architecture template based on project characteristics.

    Args:
        project_type: "greenfield" or "brownfield"
        scope: "backend", "frontend", "fullstack"
        has_ui: Whether project includes user interface
        has_backend: Whether project includes backend services

    Returns:
        Template ID to use
    """
    if project_type == "brownfield":
        return "brownfield-architecture-template-v2"

    if scope == "fullstack":
        return "fullstack-architecture-template-v2"
    elif scope == "frontend":
        return "frontend-architecture-template-v2"
    elif scope == "backend":
        return "architecture-template-v2"
    else:
        # Determine based on components
        if has_ui and has_backend:
            return "fullstack-architecture-template-v2"
        elif has_ui:
            return "frontend-architecture-template-v2"
        else:
            return "architecture-template-v2"
```

### Output Generation

**Challenge**: Generate consistent markdown output from populated templates.

**Recommended Approach**:

1. **Template Renderer Service**
   - Traverse section hierarchy
   - Render markdown for each section type
   - Apply formatting rules
   - Generate table of contents
   - Add YAML front matter

2. **Output Storage**
   - Save to Cloud Storage (`gs://bmad-artifacts/{project_id}/docs/`)
   - Create Firestore artifact record
   - Version with timestamp
   - Link to project

3. **Distribution**
   - Provide download link to user
   - Optional: Commit to user's Git repository via integration
   - Send to next agent (SM for story creation)

---

## Summary

Architecture templates are the **technical foundation** of the BMad framework, encoding complex design patterns, validation rules, and AI agent guidance into structured, executable specifications.

**Key Takeaways**:

1. **5 Templates for Different Scenarios**: Backend, Fullstack, Frontend, Brownfield, plus Technical Preferences data
2. **Platform-First Design**: Platform selection drives all technology decisions
3. **Tech Stack as Single Source of Truth**: Definitive, pinned versions required
4. **Minimal Coding Standards**: Focus on preventing AI mistakes, not documenting obvious practices
5. **Extensive Elicitation**: 15+ validation points ensure user-aligned architecture
6. **Brownfield Validation Mandate**: Continuous evidence-based validation prevents AI assumptions
7. **Complex Section Hierarchy**: Up to 4 levels deep with conditionals and repeatables
8. **Mermaid Diagram Integration**: Visual architecture documentation built-in
9. **Checklist Integration**: Quality validation before completion

**Next Section**: [Section 2 - Backend Architecture Template](architecture-templates-section2.md) provides detailed analysis of the backend-focused architecture template.

---

[← Back to Phase 4 Tasks](../../tasks/PHASE-4-template-analysis.md) | **Next**: [Section 2 - Backend Architecture Template →](architecture-templates-section2.md)
