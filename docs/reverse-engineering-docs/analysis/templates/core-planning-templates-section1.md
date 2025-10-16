# Core Planning Templates Analysis - Section 1: Introduction & Overview

**Analysis Date**: 2025-10-14
**Analyzer**: Claude Code (AI Agent)
**Phase**: Phase 4, Task 4.1
**Document Version**: 1.0

---

## Table of Contents

- [Section 1: Introduction & Overview](#section-1-introduction--overview) (This document)
- [Section 2: PRD Templates Analysis](#section-2-prd-templates-analysis)
- [Section 3: Frontend Specification Template Analysis](#section-3-frontend-specification-template-analysis)
- [Section 4: Story & Project Brief Templates Analysis](#section-4-story--project-brief-templates-analysis)
- [Section 5: Brainstorming Template & Summary](#section-5-brainstorming-template--summary)

---

## Section 1: Introduction & Overview

### Purpose

This document provides comprehensive analysis of the BMad framework's **Core Planning Templates**, which are the foundational templates used during the planning phase of software development projects. These templates drive artifact generation by specialized agents and encode the BMad methodology's structure, guidance, and quality standards.

### Scope

This analysis covers **6 core planning templates**:

1. **prd-tmpl.yaml** (v2.0) - Product Requirements Document (greenfield)
2. **brownfield-prd-tmpl.yaml** (v2.0) - Product Requirements Document (brownfield/enhancement)
3. **front-end-spec-tmpl.yaml** (v2.0) - UI/UX Specification
4. **story-tmpl.yaml** (v2.0) - Development Story Structure
5. **project-brief-tmpl.yaml** (v2.0) - Project Brief
6. **brainstorming-output-tmpl.yaml** (v2.0) - Brainstorming Session Results

### Templates Overview Table

| Template ID | Name | Version | Owner Agent | Primary Purpose | Output File | Lines |
|-------------|------|---------|-------------|-----------------|-------------|-------|
| prd-template-v2 | Product Requirements Document | 2.0 | PM (John) | Define greenfield project requirements, epics, and stories | docs/prd.md | 204 |
| brownfield-prd-template-v2 | Brownfield Enhancement PRD | 2.0 | PM (John) | Define requirements for existing project enhancements | docs/prd.md | 282 |
| frontend-spec-template-v2 | UI/UX Specification | 2.0 | UX Expert (Sally) | Define user experience, information architecture, and design | docs/front-end-spec.md | 351 |
| story-template-v2 | Story Document | 2.0 | SM (Bob) | Define individual development stories with tasks and AC | docs/stories/{epic}.{story}.{title}.md | 139 |
| project-brief-template-v2 | Project Brief | 2.0 | Analyst (Mary) | Establish project foundation, problem, solution, scope | docs/brief.md | 223 |
| brainstorming-output-template-v2 | Brainstorming Session Results | 2.0 | Analyst (Mary) | Capture and organize brainstorming ideas and insights | docs/brainstorming-session-results.md | 157 |

**Total Lines**: 1,356 lines of YAML template definitions

### Key Template Features

#### 1. **YAML-in-Markdown Pattern**

All templates follow a consistent pattern:
- YAML configuration metadata at the top
- Structured section definitions with hierarchy
- Markdown output generation
- Variable interpolation using `{{variable}}` syntax

**Example Structure**:
```yaml
template:
  id: template-id-v2
  name: Template Name
  version: 2.0
  output:
    format: markdown
    filename: docs/output.md
    title: "{{project_name}} Document Title"

workflow:
  mode: interactive | non-interactive
  elicitation: advanced-elicitation

sections:
  - id: section-id
    title: Section Title
    instruction: Instructions for the agent
    elicit: true | false
    sections: [nested sections...]
```

#### 2. **Interactive Elicitation Mode**

Most templates (5 of 6) use **interactive mode** with **advanced-elicitation**:
- Guided conversation with users to gather information
- Section-by-section population
- Validation and confirmation at each step
- Customizable elicitation actions (project-brief-tmpl)

**Exception**: brainstorming-output-tmpl uses **non-interactive** mode (automated output generation).

#### 3. **Section Hierarchy & Composition**

Templates support nested section structures:
- Top-level sections
- Sub-sections (unlimited depth)
- Repeatable sections for lists and collections
- Conditional sections based on project characteristics

**Common Section Types**:
- `text` / `paragraphs` - Free-form text content
- `bullet-list` - Bulleted lists
- `numbered-list` - Numbered lists with optional prefixes (FR, NFR, CR, AC, IV)
- `table` - Tabular data with defined columns
- `choice` - Selection from predefined options
- `template-text` - Structured text with variable placeholders
- `checklist` - Checkboxes for tracking completion
- `mermaid` - Diagrams (flowcharts, graphs)

#### 4. **Agent Ownership & Permissions (v2.0 Innovation)**

Story template (v2.0) introduces **section-level ownership and edit permissions**:

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

sections:
  - id: story
    owner: scrum-master
    editors: [scrum-master]
  - id: tasks-subtasks
    owner: scrum-master
    editors: [scrum-master, dev-agent]
  - id: dev-agent-record
    owner: dev-agent
    editors: [dev-agent]
  - id: qa-results
    owner: qa-agent
    editors: [qa-agent]
```

**Key Concepts**:
- **Owner**: The agent responsible for initially creating the section
- **Editors**: Agents allowed to modify the section after creation
- **Exclusive sections**: Some sections can only be edited by specific agents
- **Collaborative sections**: Some sections can be edited by multiple agents

This enables **safe multi-agent collaboration** on shared artifacts while maintaining clear boundaries and preventing conflicts.

#### 5. **Validation & Quality Gates**

Templates integrate with quality validation workflows:
- **Checklist Results** sections (prd-tmpl, front-end-spec-tmpl)
- **Change Log** tables for tracking modifications
- **Next Steps** sections with handoff prompts for subsequent agents
- **Version tracking** in metadata

#### 6. **Context-Driven Guidance**

Templates include extensive inline instructions for agents:
- **Instruction fields**: Guide agent behavior for each section
- **Examples**: Provide concrete samples of expected content
- **Templates**: Define structured formats with variable placeholders
- **Conditions**: Specify when sections should be included
- **Choices**: Define valid option sets for selection fields

### Template Workflow Types

| Template | Workflow Mode | Elicitation Type | User Interaction Level |
|----------|---------------|------------------|------------------------|
| prd-tmpl | interactive | advanced-elicitation | High - section-by-section review |
| brownfield-prd-tmpl | interactive | advanced-elicitation | High - with validation confirmations |
| front-end-spec-tmpl | interactive | advanced-elicitation | High - collaborative design |
| story-tmpl | interactive | advanced-elicitation | Medium - story-specific details |
| project-brief-tmpl | interactive | advanced-elicitation + custom | High - with custom actions (YOLO mode option) |
| brainstorming-output-tmpl | non-interactive | none | None - automated output |

### Template Dependencies & Flow

```
Project Initiation
        ↓
┌───────────────────────┐
│ brainstorming-output  │ (Optional: Analyst facilitates ideation)
└───────────────────────┘
        ↓
┌───────────────────────┐
│   project-brief       │ (Analyst: Foundation document)
└───────────────────────┘
        ↓
┌───────────────────────┐
│   prd / brownfield    │ (PM: Requirements, epics, stories)
│       -prd            │
└───────────────────────┘
        ↓
        ├────────────────────────────┐
        ↓                            ↓
┌───────────────────┐    ┌───────────────────┐
│ front-end-spec    │    │  architecture     │
│                   │    │  (separate tmpl)  │
└───────────────────┘    └───────────────────┘
        ↓                            ↓
        └────────────┬───────────────┘
                     ↓
        ┌───────────────────────┐
        │   story (per story)   │ (SM: Individual story documents)
        └───────────────────────┘
                     ↓
            Development Phase
```

### Version 2.0 Enhancements

All templates are **version 2.0**, indicating mature, stable specifications. Key v2.0 features:

1. **Section Ownership Model** (story-tmpl)
   - Clear agent boundaries for collaborative editing
   - Prevents conflicts in multi-agent workflows

2. **Enhanced PRD Structure** (prd-tmpl, brownfield-prd-tmpl)
   - Epic-story hierarchy with improved sequencing guidance
   - Technical assumptions section for architect handoff
   - Checklist integration for quality validation

3. **Comprehensive UI/UX Specification** (front-end-spec-tmpl)
   - Information architecture with Mermaid diagrams
   - Component library definitions
   - Accessibility and responsiveness strategies
   - Performance considerations

4. **Brownfield-Specific Adaptations** (brownfield-prd-tmpl)
   - Integration with document-project analysis
   - Compatibility requirements section (CR prefix)
   - Risk assessment incorporating existing technical debt
   - Scope assessment to prevent over-engineering

5. **Custom Elicitation Actions** (project-brief-tmpl)
   - Flexible interaction patterns
   - YOLO mode support
   - Creative exploration options

### Template Metadata Patterns

All templates follow consistent metadata structure:

```yaml
template:
  id: {name}-template-v{version}      # Unique identifier
  name: {Human-Readable Name}          # Display name
  version: {major}.{minor}             # Semantic versioning
  output:
    format: markdown                   # Output format
    filename: docs/{name}.md           # Default output path
    title: "{{var}} {Title}"           # Document title with interpolation
```

### Critical Design Principles

1. **Agent-Centric Design**
   - Templates encode agent expertise and workflow patterns
   - Instructions guide agent decision-making
   - Examples provide concrete reference points

2. **Progressive Disclosure**
   - Information gathered incrementally section-by-section
   - Complex documents built through guided conversation
   - Users not overwhelmed with all questions at once

3. **Flexibility with Structure**
   - Repeatable sections for variable-length content
   - Conditional sections based on project characteristics
   - Choice fields with predefined options

4. **Quality by Design**
   - Validation checkpoints built into templates
   - Change tracking for all modifications
   - Handoff prompts ensure continuity between agents

5. **Context Preservation**
   - Rich metadata for traceability
   - Cross-references between related documents
   - Change logs maintain history

### Template Analysis Methodology

For each template in subsequent sections, the analysis covers:

1. **Template Identity**
   - ID, version, name, output configuration

2. **Workflow Configuration**
   - Mode (interactive/non-interactive)
   - Elicitation strategy
   - User interaction patterns

3. **Section Structure**
   - Hierarchical organization
   - Section types and purposes
   - Required vs. optional sections
   - Repeatable and conditional sections

4. **Agent Configuration** (where applicable)
   - Ownership model
   - Edit permissions
   - Multi-agent collaboration patterns

5. **Field Specifications**
   - Data types and structures
   - Validation rules
   - Default values and templates
   - Variable interpolation

6. **Instructions & Guidance**
   - Agent behavior directives
   - Elicitation strategies
   - Quality standards
   - Decision frameworks

7. **Integration Points**
   - Dependencies on other templates
   - Handoffs to subsequent agents
   - Cross-references to related artifacts

8. **Example Outputs**
   - Sample populated content
   - Common variations
   - Edge cases

9. **ADK Translation Considerations**
   - Storage strategy (Cloud Storage + Firestore)
   - Template rendering approach
   - Section permission enforcement
   - Version management
   - API requirements

### Key Findings Preview

**1. Template-Driven Development Enables Consistency**

Templates encode best practices, ensuring all projects follow proven patterns for requirements gathering, design specification, and story creation.

**2. Section Ownership Model Enables Safe Multi-Agent Collaboration**

Version 2.0's ownership model (story-tmpl) is a critical innovation allowing multiple specialized agents to collaboratively work on shared artifacts without conflicts.

**3. Brownfield vs. Greenfield Requires Different Templates**

Brownfield template includes specific sections for:
- Existing project analysis integration
- Compatibility requirements
- Risk assessment with technical debt awareness
- Scope validation to prevent overwork

**4. Templates Are Executable Specifications**

Templates are not just documentation—they are **executable** by agents:
- Instructions directly guide agent behavior
- Structure enforces quality standards
- Validation checkpoints ensure completeness

**5. Interactive Elicitation Is Core to BMad Method**

Five of six templates use advanced interactive elicitation, reflecting BMad's philosophy:
- Collaborative requirements gathering
- User involvement at every step
- Validation and confirmation loops
- Adaptive questioning based on context

**6. Templates Integrate With Task Workflows**

Templates are used by task workflows (e.g., create-doc, create-next-story):
- Tasks load templates
- Tasks guide agents through section population
- Tasks execute validation checklists
- Tasks generate final markdown output

### Next Sections

The following sections provide detailed analysis of each template:

- **Section 2**: PRD Templates (prd-tmpl, brownfield-prd-tmpl)
- **Section 3**: Frontend Specification Template (front-end-spec-tmpl)
- **Section 4**: Story & Project Brief Templates (story-tmpl, project-brief-tmpl)
- **Section 5**: Brainstorming Template & Summary (brainstorming-output-tmpl)

---

**End of Section 1**

[→ Continue to Section 2: PRD Templates Analysis](core-planning-templates-section2.md)
