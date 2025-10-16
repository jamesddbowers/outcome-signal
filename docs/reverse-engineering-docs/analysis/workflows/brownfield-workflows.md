# BMad Brownfield Workflows Analysis

**Document Version:** 1.0
**Created:** 2025-10-14
**Author:** Claude Code (AI Agent)
**Related Phase:** Phase 5 - Workflow Orchestration Mapping (Task 5.2)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Brownfield Overview](#brownfield-overview)
3. [Workflow Categories](#workflow-categories)
4. [Brownfield-Fullstack Workflow](#brownfield-fullstack-workflow)
5. [Brownfield-Service Workflow](#brownfield-service-workflow)
6. [Brownfield-UI Workflow](#brownfield-ui-workflow)
7. [Cross-Workflow Patterns](#cross-workflow-patterns)
8. [State Management](#state-management)
9. [ADK Translation Recommendations](#adk-translation-recommendations)

---

## Executive Summary

### Purpose

This document provides comprehensive analysis of the BMad framework's brownfield workflows, which handle enhancements to existing applications. Unlike greenfield workflows that build from scratch, brownfield workflows prioritize system analysis, risk mitigation, and safe integration with existing codebases.

### Key Findings

**Workflow Count:** 3 brownfield workflows (fullstack, service, UI)

**Unique Characteristics:**
- **Adaptive routing** based on enhancement complexity (single story, epic, or full workflow)
- **Documentation-first** approach with `document-project` task
- **Conditional architecture** creation (only when needed)
- **Brownfield-specific templates** (brownfield-prd-tmpl, brownfield-architecture-tmpl)
- **Integration safety** focus throughout planning and development

**Common Stages:**
1. **Enhancement Classification** - Route to appropriate workflow path
2. **System Analysis** - Document existing project state
3. **Planning** - Create PRD (and optionally architecture)
4. **Validation** - PO master checklist for safety
5. **Document Sharding** - Prepare for development
6. **Development Cycle** - SM → Dev → QA → PO (same as greenfield)

**Key Differentiators from Greenfield:**
- Upfront system analysis phase
- Classification/routing logic based on scope
- Conditional document creation
- Heavy emphasis on compatibility and rollback plans
- Optional architecture document (greenfield always requires it)
- Support for brownfield-specific story creation tasks

---

## Brownfield Overview

### What is Brownfield Development?

Brownfield development refers to enhancing, modernizing, or fixing existing software systems. Key characteristics:

- **Existing codebase** with established patterns
- **Integration constraints** with current architecture
- **Risk of regression** when adding features
- **Technical debt** considerations
- **Backward compatibility** requirements
- **Migration complexity** for changes

### When to Use Brownfield Workflows

**Use brownfield workflows when:**
- Adding significant new features to existing applications
- Modernizing legacy codebases
- Integrating new technologies or services
- Refactoring complex systems
- Making architectural changes to existing projects

**Don't use brownfield workflows when:**
- Building entirely new applications (use greenfield)
- Making post-MVP enhancements to BMad-created projects (just create new epic in existing PRD)
- Simple bug fixes with no architectural impact (use brownfield-create-story task directly)

### Brownfield Philosophy

The BMad brownfield approach prioritizes:

1. **Understanding First** - Document existing system before planning
2. **Safety Over Speed** - Risk assessment and rollback planning
3. **Gradual Integration** - Incremental changes with validation
4. **Pattern Preservation** - Follow existing architectural patterns
5. **Regression Prevention** - Heavy testing emphasis

---

## Workflow Categories

### Three Brownfield Workflow Types

BMad provides three brownfield workflows, each tailored to a specific project type:

| Workflow ID | Name | Focus | Primary Use Case |
|-------------|------|-------|------------------|
| `brownfield-fullstack` | Brownfield Full-Stack Enhancement | Complete application | Feature addition, modernization, integration-enhancement, refactoring |
| `brownfield-service` | Brownfield Service/API Enhancement | Backend services | Service modernization, API enhancement, microservice extraction, performance optimization |
| `brownfield-ui` | Brownfield UI/Frontend Enhancement | Frontend applications | UI modernization, framework migration, design refresh, frontend enhancement |

### Routing Logic: Three Paths to Development

All brownfield workflows start with **enhancement classification** to determine scope:

```
Enhancement Classification
    ├─ Single Story (< 4 hours) → brownfield-create-story → Dev
    ├─ Small Feature (1-3 stories) → brownfield-create-epic → SM → Dev
    └─ Major Enhancement (multiple epics) → Full Planning Workflow
```

**Path 1: Single Story (Direct to Dev)**
- **Scope:** < 4 hours development time
- **Process:** PM creates single story using `brownfield-create-story` task
- **Output:** One story file ready for Dev implementation
- **Skips:** Full planning workflow, sharding, SM agent
- **Use Case:** Bug fixes, tiny features, isolated changes

**Path 2: Small Feature (Epic Path)**
- **Scope:** 1-3 coordinated stories
- **Process:** PM creates focused epic using `brownfield-create-epic` task
- **Output:** Epic with 1-3 story outlines
- **Skips:** Full PRD/Architecture, sharding
- **Use Case:** Focused features following existing patterns

**Path 3: Major Enhancement (Full Workflow)**
- **Scope:** Multiple epics, architectural changes
- **Process:** Complete planning workflow with PRD, optional architecture, sharding
- **Output:** Full planning artifacts with sharded documents
- **Use Case:** Significant features, modernization, architectural changes

### Conditional Documentation Path

Brownfield workflows uniquely include **conditional architecture creation**:

```
PRD Complete → Architecture Decision
    ├─ New architectural patterns → Create architecture.md
    ├─ New libraries/frameworks → Create architecture.md
    ├─ Platform/infrastructure changes → Create architecture.md
    └─ Following existing patterns → Skip to story creation
```

This differs from greenfield workflows, which **always** create architecture documents.

---

## Brownfield-Fullstack Workflow

### Workflow Identity

**Workflow ID:** `brownfield-fullstack`
**Name:** Brownfield Full-Stack Enhancement
**Type:** brownfield
**Definition File:** `.bmad-core/workflows/brownfield-fullstack.yaml`

### Purpose & Scope

Handles enhancements to existing full-stack applications requiring coordinated front-end and back-end changes. Supports:

- **Feature Addition** - New capabilities to existing applications
- **Refactoring** - Modernizing code while maintaining functionality
- **Modernization** - Technology stack upgrades
- **Integration Enhancement** - Adding new integrations

### Project Types

- `feature-addition`
- `refactoring`
- `modernization`
- `integration-enhancement`

### Complete Workflow Sequence

#### Stage 1: Enhancement Classification

**Agent:** Analyst
**Action:** Classify enhancement scope
**Decision Point:** Routes workflow based on classification

**Classification Question:**
> "Can you describe the enhancement scope? Is this a small fix, a feature addition, or a major enhancement requiring architectural changes?"

**Routing Logic:**

```yaml
routes:
  single_story:
    agent: pm
    uses: brownfield-create-story
    exit: true

  small_feature:
    agent: pm
    uses: brownfield-create-epic
    exit: true

  major_enhancement:
    continue: to_next_step
```

**Key Point:** This routing decision happens BEFORE any documentation, making it highly efficient for small changes.

#### Stage 2: Documentation Assessment (Major Enhancement Path)

**Agent:** Analyst
**Action:** Check existing documentation
**Condition:** Only if major enhancement path

**Assessment Questions:**
- Does adequate project documentation exist?
- Are architecture docs current and comprehensive?
- Is the documentation sufficient for planning?

**Decision:**
- **Adequate Docs** → Skip to PRD creation (saves time)
- **Inadequate Docs** → Run `document-project` task first

#### Stage 3: Project Analysis (Conditional)

**Agent:** Architect
**Action:** Run `document-project` task
**Creates:** `brownfield-architecture.md` (or multiple documents)
**Condition:** Only if documentation inadequate

**Purpose:** Capture current system state before planning enhancement

**Output:**
- Current architecture state
- Technical debt documentation
- Integration dependencies
- Existing patterns and constraints

**Important Note:** This analysis is passed to PRD creation to avoid re-analysis.

#### Stage 4: PRD Creation

**Agent:** PM
**Creates:** `prd.md`
**Uses:** `brownfield-prd-tmpl`
**Requires:** `existing_documentation_or_analysis`

**Process:**
1. References existing documentation OR `document-project` output
2. Avoids re-analyzing what was already documented
3. Focuses on enhancement requirements
4. Includes integration strategy
5. Identifies risks to existing system

**Save Action:** User copies final `prd.md` to `docs/prd.md`

#### Stage 5: Architecture Decision Point

**Agents:** PM/Architect
**Action:** Determine if architecture document needed

**Decision Criteria:**
- **YES (Create Architecture):**
  - New architectural patterns introduced
  - New libraries/frameworks added
  - Platform/infrastructure changes
  - Significant integration complexity

- **NO (Skip Architecture):**
  - Following existing patterns
  - No architectural changes
  - Simple feature additions

**This is a KEY differentiator from greenfield workflows.**

#### Stage 6: Architecture Creation (Conditional)

**Agent:** Architect
**Creates:** `architecture.md`
**Uses:** `brownfield-architecture-tmpl`
**Requires:** `prd.md`
**Condition:** Only if architecture changes needed

**Focus:**
- Integration strategy with existing system
- Migration planning
- Compatibility requirements
- Risk mitigation

**Save Action:** User copies final `architecture.md` to `docs/architecture.md`

#### Stage 7: PO Validation

**Agent:** PO
**Action:** Validate all artifacts
**Uses:** `po-master-checklist`

**Validation Focus (Brownfield-Specific):**
- Integration safety
- Backward compatibility
- Risk assessment completeness
- Rollback plan feasibility
- Existing pattern adherence

**Outcome:**
- **Issues Found** → Return to relevant agent for fixes
- **No Issues** → Proceed to sharding

#### Stage 8: Document Fixes (Conditional)

**Agents:** Various (as needed)
**Action:** Update flagged documents
**Condition:** Only if PO checklist issues

**Process:**
1. PO identifies issues and responsible agent
2. Agent fixes and re-exports document
3. Return to PO for re-validation

#### Stage 9: Document Sharding

**Agent:** PO
**Action:** Shard documents for IDE development
**Creates:** Sharded docs in `docs/prd/` and `docs/architecture/`
**Requires:** All artifacts validated and saved in project

**Two Options:**
- **Option A:** Use PO agent: `@po` then ask to shard `docs/prd.md`
- **Option B:** Manual: Drag `shard-doc` task + `docs/prd.md` into chat

**Output Structure:**
```
docs/
├── prd/
│   ├── index.md
│   ├── epic-01.md
│   ├── epic-02.md
│   └── ...
└── architecture/
    ├── index.md
    ├── backend.md
    ├── frontend.md
    └── ...
```

#### Stage 10: Story Creation (Repeating)

**Agent:** SM
**Action:** Create story
**Creates:** `story.md`
**Requires:** Sharded docs OR brownfield docs
**Repeats:** For each epic/enhancement

**Two Story Creation Approaches:**

**For Sharded PRD:**
```
@sm → *create
Uses: create-next-story task
```

**For Brownfield Docs:**
```
@sm → use create-brownfield-story task
Context: May require additional context gathering
```

**Story Status:** Draft

#### Stage 11: Draft Story Review (Optional)

**Agents:** Analyst/PM
**Action:** Review and approve draft story
**Updates:** `story.md`
**Condition:** User wants story review
**Optional:** Yes

**Process:**
1. Review story completeness
2. Validate alignment with PRD
3. Update story status: Draft → Approved

**Note:** `story-review` task coming soon

#### Stage 12-16: Development Cycle (Same as Greenfield)

**Stage 12: Story Implementation**
- **Agent:** Dev
- **Creates:** Implementation files
- **Process:** Implements approved story
- **Output:** Story marked as "Review"

**Stage 13: QA Review (Optional)**
- **Agent:** QA
- **Uses:** `review-story` task
- **Process:** Comprehensive review with active refactoring
- **Output:** Checklist for Dev OR story marked "Done"

**Stage 14: QA Feedback (Conditional)**
- **Agent:** Dev
- **Condition:** QA left unchecked items
- **Process:** Address remaining issues
- **Output:** Return to QA for final approval

**Stage 15: Repeat**
- **Action:** Continue story cycle for all stories
- **Loop:** SM → Dev → QA until all stories complete

**Stage 16: Epic Retrospective (Optional)**
- **Agent:** PO
- **Creates:** `epic-retrospective.md`
- **Condition:** Epic complete
- **Note:** Task coming soon

### Workflow Diagram Analysis

The workflow includes a comprehensive Mermaid diagram showing:

**Color Coding:**
- **Green** (End states): Workflow completion points
- **Light Blue** (`#87CEEB`): Quick exit paths (single story, epic)
- **Peach** (`#FFE4B5`): Planning artifacts (PRD, Architecture)
- **Powder Blue** (`#ADD8E6`): Development cycle (Sharding, Stories, Dev)
- **Khaki** (`#F0E68C`): Validation/Review (Story review, QA, Retrospective)

**Key Decision Points:**
1. Enhancement Size (3-way split)
2. Documentation Adequacy (2-way)
3. Architecture Needed (2-way)
4. PO Issues (2-way)
5. Story Review (2-way)
6. QA Review (2-way)
7. QA Issues (2-way)
8. More Stories (2-way loop)
9. Retrospective (2-way)

**Three Exit Points:**
1. After single story creation (direct to dev)
2. After epic creation (to story creation)
3. After all stories complete (retrospective → complete)

### Agent Collaboration Pattern

**Full Workflow Sequence:**
```
Analyst → PM → Architect → PO → (fixes) → PO → SM → (Analyst/PM) → Dev → QA → (Dev) → QA → ... → PO
```

**Abbreviated Sequence (Architecture Skipped):**
```
Analyst → PM → PO → (fixes) → PO → SM → Dev → QA → ...
```

**Quick Paths:**
```
Single Story: Analyst → PM → Dev
Small Feature: Analyst → PM → SM → Dev
```

### Context Passing

**Analyst → PM:**
> "Enhancement classified as: {{enhancement_type}}. {{if major}}: Continuing with comprehensive planning workflow."

**Documentation Assessment:**
> "Documentation assessment complete: {{if adequate}}: Existing documentation is sufficient. Proceeding directly to PRD creation."

**Document Project → PM:**
> "Project analysis complete. Key findings documented in: {{document_list}}. Use these findings to inform PRD creation and avoid re-analyzing the same aspects."

**PM → Architect Decision:**
> "PRD complete and saved as docs/prd.md. Architectural changes identified: {{yes/no}}. {{if yes}}: Proceeding to create architecture document for: {{specific_changes}}"

**Architect → PO:**
> "Architecture complete. Save it as docs/architecture.md. Please validate all artifacts for integration safety."

**PO → SM:**
> "All artifacts validated. Documentation type available: {{sharded_prd / brownfield_docs}}. {{if sharded}}: Use standard create-next-story task. {{if brownfield}}: Use create-brownfield-story task."

**SM Story Creation:**
> "Creating story from {{documentation_type}}. {{if missing_context}}: May need to gather additional context from user during story creation."

### State Transitions

**Enhancement Scope States:**
- `single_story` → Direct to Dev
- `small_feature` → Epic creation
- `major_enhancement` → Full workflow

**Documentation States:**
- `adequate` → PRD creation
- `inadequate` → Document project → PRD creation

**Architecture States:**
- `changes_needed` → Create architecture
- `no_changes` → Skip architecture

**Validation States:**
- `issues_found` → Fix documents → Re-validate
- `validated` → Shard documents

**Story States:**
- `draft` → (Optional review) → `approved` → `in_progress` → `review` → `done`

### Decision Guidance

**When to Use This Workflow:**
- Enhancement requires coordinated stories across frontend and backend
- Architectural changes are needed
- Significant integration work required
- Risk assessment and mitigation planning necessary
- Multiple team members will work on related changes

**When NOT to Use:**
- Simple bug fixes (use `brownfield-create-story`)
- Tiny features (use `brownfield-create-epic`)
- Post-MVP enhancements to BMad projects (add epic to existing PRD)

### Unique Brownfield Features

**1. Adaptive Routing**
- Three distinct paths based on complexity
- Early exit options for small changes
- Avoids over-engineering simple enhancements

**2. Documentation-First Approach**
- Optional `document-project` task upfront
- Reuses existing documentation when available
- Avoids redundant analysis

**3. Conditional Architecture**
- Architecture only created when necessary
- Decision based on actual architectural impact
- Reduces unnecessary documentation overhead

**4. Brownfield-Specific Templates**
- `brownfield-prd-tmpl` - Focuses on integration
- `brownfield-architecture-tmpl` - Migration planning
- Different from greenfield templates

**5. Flexible Story Creation**
- Supports both `create-next-story` (sharded docs)
- Supports `create-brownfield-story` (varied docs)
- Adapts to available documentation format

---

## Brownfield-Service Workflow

### Workflow Identity

**Workflow ID:** `brownfield-service`
**Name:** Brownfield Service/API Enhancement
**Type:** brownfield
**Definition File:** `.bmad-core/workflows/brownfield-service.yaml`

### Purpose & Scope

Handles enhancements to existing backend services and APIs. This is a **simplified workflow** compared to brownfield-fullstack, with NO routing logic - it always runs the full planning workflow.

**Supported Enhancements:**
- **Service Modernization** - Updating service architecture
- **API Enhancement** - Adding new endpoints or improving existing ones
- **Microservice Extraction** - Breaking monolith into services
- **Performance Optimization** - Improving service performance
- **Integration Enhancement** - Adding new service integrations

### Project Types

- `service-modernization`
- `api-enhancement`
- `microservice-extraction`
- `performance-optimization`
- `integration-enhancement`

### Key Differences from Brownfield-Fullstack

**1. NO Routing Logic**
- Brownfield-fullstack has 3 paths (single story, epic, full workflow)
- Brownfield-service has only 1 path (full workflow)
- No enhancement classification step
- Always runs complete planning process

**2. ALWAYS Requires Architecture**
- Brownfield-fullstack conditionally creates architecture
- Brownfield-service ALWAYS creates architecture.md
- No architecture decision point

**3. Service-Specific Focus**
- API versioning and breaking changes
- Database schema changes
- Performance and scalability
- Multiple integration points
- Service boundaries

### Complete Workflow Sequence

#### Stage 1: Service Analysis

**Agent:** Architect
**Action:** Analyze existing project using `document-project` task
**Creates:** Multiple documents per document-project template

**Analysis Focus:**
- Existing service documentation review
- Codebase structure analysis
- Performance metrics evaluation
- Integration dependencies identification

**Key Output:** Comprehensive service documentation for PRD creation

#### Stage 2: PRD Creation

**Agent:** PM
**Creates:** `prd.md`
**Uses:** `brownfield-prd-tmpl`
**Requires:** `existing_service_analysis`

**Service-Specific PRD Focus:**
- Service enhancement strategy
- API evolution planning
- Performance improvement goals
- Integration requirements
- Breaking change management

**Save Action:** User copies final `prd.md` to `docs/prd.md`

#### Stage 3: Architecture Creation (ALWAYS)

**Agent:** Architect
**Creates:** `architecture.md`
**Uses:** `brownfield-architecture-tmpl`
**Requires:** `prd.md`

**Service Architecture Focus:**
- Service integration strategy
- API evolution planning
- Database schema changes
- Performance optimization approach
- Service boundary definitions

**Save Action:** User copies final `architecture.md` to `docs/architecture.md`

**Critical Difference:** This step is NOT conditional - it always runs for service enhancements.

#### Stage 4: PO Validation

**Agent:** PO
**Action:** Validate all artifacts
**Uses:** `po-master-checklist`

**Service-Specific Validation:**
- Service integration safety
- API compatibility verification
- Database migration safety
- Performance impact assessment
- Integration point validation

**Outcome:**
- **Issues Found** → Return to relevant agent for fixes
- **No Issues** → Proceed to sharding

#### Stage 5: Document Fixes (Conditional)

**Agents:** Various (as needed)
**Action:** Update flagged documents
**Condition:** Only if PO checklist issues

**Process:**
1. PO identifies issues and responsible agent
2. Agent fixes and re-exports document
3. Return to PO for re-validation

#### Stage 6: Document Sharding

**Agent:** PO
**Action:** Shard documents for IDE development
**Creates:** Sharded docs in `docs/prd/` and `docs/architecture/`
**Requires:** All artifacts validated and saved in project

**Two Options:**
- **Option A:** Use PO agent: `@po` then ask to shard `docs/prd.md`
- **Option B:** Manual: Drag `shard-doc` task + `docs/prd.md` into chat

**Output:** Same structure as brownfield-fullstack

#### Stages 7-11: Development Cycle (Same as Brownfield-Fullstack)

**Stage 7: Story Creation**
- Agent: SM
- Uses: `create-next-story` task
- Creates story from sharded docs
- Story starts in "Draft" status

**Stage 8: Draft Story Review (Optional)**
- Agents: Analyst/PM
- Review and approve story
- Update status: Draft → Approved

**Stage 9: Story Implementation**
- Agent: Dev
- Implements approved story
- Marks story as "Review"

**Stage 10: QA Review (Optional)**
- Agent: QA
- Comprehensive review with refactoring
- Leaves checklist or marks "Done"

**Stage 11: QA Feedback (Conditional)**
- Agent: Dev
- Address remaining issues
- Return to QA for final approval

**Stage 12: Repeat** - Continue for all stories

**Stage 13: Epic Retrospective (Optional)** - After epic completion

### Workflow Diagram Analysis

The workflow includes a Mermaid diagram with:

**Linear Structure (No Routing):**
- Single path from start to finish
- No enhancement classification
- No architecture decision point

**Key Decision Points:**
1. PO Issues (2-way)
2. Story Review (2-way)
3. QA Review (2-way)
4. QA Issues (2-way)
5. More Stories (2-way loop)
6. Retrospective (2-way)

**Only One Exit Point:**
- After all stories complete (retrospective → complete)

### Agent Collaboration Pattern

**Full Workflow Sequence (Only One Path):**
```
Architect → PM → Architect → PO → (fixes) → PO → SM → (Analyst/PM) → Dev → QA → (Dev) → QA → ... → PO
```

**No Abbreviated Sequences** - Service workflow always runs complete planning.

### Context Passing

**Analyst → PM:**
> "Service analysis complete. Create comprehensive PRD with service integration strategy."

**PM → Architect:**
> "PRD ready. Save it as docs/prd.md, then create the service architecture."

**Architect → PO:**
> "Architecture complete. Save it as docs/architecture.md. Please validate all artifacts for service integration safety."

**PO Issues:**
> "PO found issues with [document]. Please return to [agent] to fix and re-save the updated document."

**Complete:**
> "All planning artifacts validated and saved in docs/ folder. Move to IDE environment to begin development."

### Decision Guidance

**When to Use This Workflow:**
- Service enhancement requires coordinated stories
- API versioning or breaking changes needed
- Database schema changes required
- Performance or scalability improvements needed
- Multiple integration points affected

**When NOT to Use:**
- Tiny service changes (consider brownfield-create-story task directly)
- Frontend-only enhancements (use brownfield-ui)
- Full-stack enhancements (use brownfield-fullstack)

### Unique Service Workflow Features

**1. Simplified Flow**
- No routing complexity
- Always runs full planning
- Predictable sequence

**2. Mandatory Architecture**
- Service changes almost always need architecture
- No decision point to skip
- Architecture-first approach

**3. Service-Specific Concerns**
- API compatibility focus
- Database migration planning
- Performance baseline comparison
- Service boundary management

**4. Architecture Always Required**
- Unlike brownfield-fullstack (conditional)
- Reflects service complexity
- Integration dependencies always need documentation

---

## Brownfield-UI Workflow

### Workflow Identity

**Workflow ID:** `brownfield-ui`
**Name:** Brownfield UI/Frontend Enhancement
**Type:** brownfield
**Definition File:** `.bmad-core/workflows/brownfield-ui.yaml`

### Purpose & Scope

Handles enhancements to existing frontend applications with focus on UI/UX improvements. This workflow is **similar to brownfield-service** (no routing) but adds the **UX Expert agent** for frontend specification.

**Supported Enhancements:**
- **UI Modernization** - Updating user interface
- **Framework Migration** - Moving to new frontend framework
- **Design Refresh** - Visual redesign
- **Frontend Enhancement** - Adding new UI features

### Project Types

- `ui-modernization`
- `framework-migration`
- `design-refresh`
- `frontend-enhancement`

### Key Differences from Other Brownfield Workflows

**Compared to Brownfield-Fullstack:**
- NO routing logic (like service workflow)
- ALWAYS creates architecture (like service workflow)
- Adds UX Expert agent for frontend spec
- Three planning artifacts instead of two (PRD + Frontend Spec + Architecture)

**Compared to Brownfield-Service:**
- Adds UX Expert agent (service workflow doesn't have)
- Creates `front-end-spec.md` in addition to PRD and architecture
- UI/UX-specific validation focus

**Unique Agent Sequence:**
```
Architect → PM → UX Expert → Architect → PO → ...
```

### Complete Workflow Sequence

#### Stage 1: UI Analysis

**Agent:** Architect
**Action:** Analyze existing project using `document-project` task
**Creates:** Multiple documents per document-project template

**UI Analysis Focus:**
- Existing frontend application structure
- User feedback review
- Analytics data analysis
- Improvement areas identification

**Key Output:** Comprehensive UI documentation for PRD creation

#### Stage 2: PRD Creation

**Agent:** PM
**Creates:** `prd.md`
**Uses:** `brownfield-prd-tmpl`
**Requires:** `existing_ui_analysis`

**UI-Specific PRD Focus:**
- UI enhancement strategy
- User experience improvements
- Design system considerations
- Frontend integration requirements

**Save Action:** User copies final `prd.md` to `docs/prd.md`

#### Stage 3: Frontend Specification Creation (UI-Specific)

**Agent:** UX Expert
**Creates:** `front-end-spec.md`
**Uses:** `front-end-spec-tmpl`
**Requires:** `prd.md`

**Frontend Spec Focus:**
- UI/UX specification
- Component design
- Interaction patterns
- Design pattern integration with existing system

**Save Action:** User copies final `front-end-spec.md` to `docs/front-end-spec.md`

**Critical Addition:** This stage doesn't exist in other brownfield workflows.

#### Stage 4: Architecture Creation (ALWAYS)

**Agent:** Architect
**Creates:** `architecture.md`
**Uses:** `brownfield-architecture-tmpl`
**Requires:**
  - `prd.md`
  - `front-end-spec.md`

**Frontend Architecture Focus:**
- Component integration strategy
- Migration planning
- Design system architecture
- Frontend framework considerations

**Save Action:** User copies final `architecture.md` to `docs/architecture.md`

**Critical Difference:** Architecture requires BOTH PRD and Frontend Spec.

#### Stage 5: PO Validation

**Agent:** PO
**Action:** Validate all artifacts
**Uses:** `po-master-checklist`

**UI-Specific Validation:**
- UI integration safety
- Design consistency
- Component compatibility
- User experience validation

**Outcome:**
- **Issues Found** → Return to relevant agent for fixes
- **No Issues** → Proceed to sharding

#### Stage 6: Document Fixes (Conditional)

**Agents:** Various (PM, UX Expert, or Architect)
**Action:** Update flagged documents
**Condition:** Only if PO checklist issues

**Process:**
1. PO identifies issues and responsible agent
2. Agent fixes and re-exports document
3. Return to PO for re-validation

#### Stage 7: Document Sharding

**Agent:** PO
**Action:** Shard documents for IDE development
**Creates:** Sharded docs in `docs/prd/`, `docs/front-end-spec/`, and `docs/architecture/`
**Requires:** All artifacts validated and saved in project

**Two Options:**
- **Option A:** Use PO agent: `@po` then ask to shard `docs/prd.md`
- **Option B:** Manual: Drag `shard-doc` task + `docs/prd.md` into chat

**Output Structure (Extended):**
```
docs/
├── prd/
│   ├── index.md
│   ├── epic-01.md
│   └── ...
├── front-end-spec/
│   ├── index.md
│   ├── component-library.md
│   ├── user-flows.md
│   └── ...
└── architecture/
    ├── index.md
    ├── frontend-architecture.md
    └── ...
```

#### Stages 8-13: Development Cycle (Same as Other Brownfield Workflows)

**Stage 8: Story Creation**
- Agent: SM
- Uses: `create-next-story` task
- Creates story from sharded docs
- Story starts in "Draft" status

**Stage 9: Draft Story Review (Optional)**
- Agents: Analyst/PM
- Review and approve story
- Update status: Draft → Approved

**Stage 10: Story Implementation**
- Agent: Dev
- Implements approved story
- Marks story as "Review"

**Stage 11: QA Review (Optional)**
- Agent: QA
- Comprehensive review with refactoring
- Leaves checklist or marks "Done"

**Stage 12: QA Feedback (Conditional)**
- Agent: Dev
- Address remaining issues
- Return to QA for final approval

**Stage 13: Repeat** - Continue for all stories

**Stage 14: Epic Retrospective (Optional)** - After epic completion

### Workflow Diagram Analysis

The workflow includes a Mermaid diagram with:

**Linear Structure with UX Integration:**
- Single path from start to finish (no routing)
- Additional UX Expert step in planning
- No architecture decision point (always created)

**Key Decision Points:**
1. PO Issues (2-way)
2. Story Review (2-way)
3. QA Review (2-way)
4. QA Issues (2-way)
5. More Stories (2-way loop)
6. Retrospective (2-way)

**Only One Exit Point:**
- After all stories complete (retrospective → complete)

### Agent Collaboration Pattern

**Full Workflow Sequence (Only One Path):**
```
Architect → PM → UX Expert → Architect → PO → (fixes) → PO → SM → (Analyst/PM) → Dev → QA → (Dev) → QA → ... → PO
```

**Key Addition:** UX Expert between PM and Architect

### Context Passing

**Analyst → PM:**
> "UI analysis complete. Create comprehensive PRD with UI integration strategy."

**PM → UX:**
> "PRD ready. Save it as docs/prd.md, then create the UI/UX specification."

**UX → Architect:**
> "UI/UX spec complete. Save it as docs/front-end-spec.md, then create the frontend architecture."

**Architect → PO:**
> "Architecture complete. Save it as docs/architecture.md. Please validate all artifacts for UI integration safety."

**PO Issues:**
> "PO found issues with [document]. Please return to [agent] to fix and re-save the updated document."

**Complete:**
> "All planning artifacts validated and saved in docs/ folder. Move to IDE environment to begin development."

### Decision Guidance

**When to Use This Workflow:**
- UI enhancement requires coordinated stories
- Design system changes needed
- New component patterns required
- User research and testing needed
- Multiple team members will work on related changes

**When NOT to Use:**
- Tiny UI changes (consider brownfield-create-story task directly)
- Backend-only enhancements (use brownfield-service)
- Full-stack enhancements (use brownfield-fullstack)

### Unique UI Workflow Features

**1. Three Planning Artifacts**
- PRD (requirements)
- Frontend Spec (UX design)
- Architecture (technical design)
- Most comprehensive planning of all brownfield workflows

**2. UX Expert Integration**
- Only brownfield workflow with UX Expert
- Dedicated frontend specification creation
- Design-first approach

**3. UI-Specific Concerns**
- Design system integration
- Component library compatibility
- User experience validation
- Visual design consistency

**4. Frontend Spec as Bridge**
- Connects business requirements (PRD) to technical design (Architecture)
- Ensures UX considerations in architecture
- Design-driven architecture planning

---

## Cross-Workflow Patterns

### Workflow Comparison Matrix

| Feature | Brownfield-Fullstack | Brownfield-Service | Brownfield-UI |
|---------|---------------------|-------------------|---------------|
| **Routing Logic** | YES (3 paths) | NO (1 path) | NO (1 path) |
| **Enhancement Classification** | YES | NO | NO |
| **Document-Project Phase** | Conditional | Always | Always |
| **PRD Creation** | Always | Always | Always |
| **Frontend Spec Creation** | NO | NO | YES |
| **Architecture Creation** | Conditional | Always | Always |
| **PO Validation** | Always | Always | Always |
| **Document Sharding** | Always | Always | Always |
| **Development Cycle** | Standard | Standard | Standard |
| **Planning Artifacts** | 1-2 (PRD, optional Arch) | 2 (PRD + Arch) | 3 (PRD + FE Spec + Arch) |
| **Agent Count** | 6-7 | 5 | 6 |
| **Complexity** | High (adaptive) | Medium (linear) | Medium (linear + UX) |

### Common Patterns Across All Workflows

#### Pattern 1: Document-First Philosophy

All brownfield workflows start with system analysis:

```
Existing System → document-project → Planning Artifacts → Sharding → Development
```

**Rationale:**
- Understanding current state is critical
- Prevents breaking existing functionality
- Identifies integration points and constraints
- Informs risk assessment

#### Pattern 2: PO Validation Gateway

All workflows include PO validation before sharding:

```
Planning Artifacts → PO Validation → (Fix Loop) → Sharding
```

**Purpose:**
- Quality gate before development
- Ensures integration safety
- Validates backward compatibility
- Confirms risk mitigation plans

**Brownfield-Specific Validation:**
- Rollback plan feasibility
- Existing pattern adherence
- Compatibility requirements
- Technical debt acknowledgment

#### Pattern 3: Optional Development Cycle Steps

All workflows share optional steps in development:

```
Story Creation → (Optional: Story Review) → Dev → (Optional: QA Review) → (Optional: QA Fixes) → Done
```

**Flexibility Rationale:**
- User controls quality vs speed trade-off
- Allows lightweight process for low-risk changes
- Enables heavyweight validation for critical changes
- QA agent as "insurance policy" for brownfield

#### Pattern 4: Repeating Story Cycle

All workflows loop through story creation and development:

```
SM creates story → Dev implements → QA reviews → Repeat until all stories complete
```

**Loop Characteristics:**
- Finite loop (bounded by epic/PRD stories)
- Each iteration is independent
- Status tracking per story
- Retrospective after all stories

#### Pattern 5: Artifact Save Points

All workflows require user to save artifacts to project:

```
Agent Creates Artifact → User Saves to docs/ → Next Agent Reads from docs/
```

**Save Locations:**
- `docs/prd.md` - Product requirements
- `docs/architecture.md` - Architecture design
- `docs/front-end-spec.md` - Frontend specification (UI workflow only)

**Purpose:**
- Clear handoff points
- User validation of outputs
- File-based state persistence
- Web-to-IDE transition preparation

#### Pattern 6: Two-Option Sharding

All workflows offer two sharding approaches:

```
Option A: @po → ask to shard docs/prd.md
Option B: Manual → Drag shard-doc task + docs/prd.md into chat
```

**Flexibility:**
- Users choose their preferred method
- Both achieve same output
- Supports different working styles

### Diverging Patterns

#### Divergence 1: Workflow Entry Points

**Brownfield-Fullstack:**
```
Analyst Classification → Route to:
  ├─ Single Story → PM → Dev
  ├─ Epic → PM → SM → Dev
  └─ Major Enhancement → Full Workflow
```

**Brownfield-Service & Brownfield-UI:**
```
Architect Analysis → Full Workflow (always)
```

**Why Different:**
- Fullstack changes vary widely in scope (tiny bug fix to full modernization)
- Service/UI changes typically require architecture consideration
- Fullstack serves broader use case spectrum

#### Divergence 2: Architecture Conditionality

**Brownfield-Fullstack:**
```
PRD Complete → Architecture Decision:
  ├─ Architectural changes → Create architecture.md
  └─ Following existing patterns → Skip architecture
```

**Brownfield-Service & Brownfield-UI:**
```
PRD Complete → Create architecture.md (always)
```

**Why Different:**
- Service/UI enhancements almost always have architectural implications
- Fullstack can have simple feature additions with no architecture changes
- Architecture skip saves time for pattern-following enhancements

#### Divergence 3: Agent Sequences

**Brownfield-Fullstack (Major Path):**
```
Analyst → PM → Architect → PO → SM → Dev → QA → PO
```

**Brownfield-Service:**
```
Architect → PM → Architect → PO → SM → Dev → QA → PO
```

**Brownfield-UI:**
```
Architect → PM → UX Expert → Architect → PO → SM → Dev → QA → PO
```

**Why Different:**
- Fullstack needs classification (Analyst first)
- Service focuses on technical analysis (Architect first)
- UI needs UX design phase (UX Expert inserted)

#### Divergence 4: Planning Artifact Count

**Artifact Counts:**
- Brownfield-Fullstack: 1-2 (PRD, optional Architecture)
- Brownfield-Service: 2 (PRD + Architecture)
- Brownfield-UI: 3 (PRD + Frontend Spec + Architecture)

**Why Different:**
- UI requires design specification before architecture
- Service always needs architecture for integration planning
- Fullstack adapts to change complexity

### Shared Development Cycle

All three workflows converge to the **same development cycle** after sharding:

```
SM → (Analyst/PM) → Dev → QA → (Dev) → QA → ... → PO → Retrospective
```

**Implications:**
- Development process is uniform across brownfield types
- Planning phase differences don't affect development
- SM, Dev, QA, PO agents work identically
- Testing and quality gates are consistent

---

## State Management

### File-Based State Tracking

Brownfield workflows use **file system state** rather than database state:

**State Storage Locations:**
- `docs/prd.md` - Requirements state
- `docs/architecture.md` - Architecture state
- `docs/front-end-spec.md` - UX state (UI workflow)
- `docs/prd/` - Sharded epic state
- `docs/architecture/` - Sharded architecture state
- `stories/*.md` - Story state with status field

### Artifact Lifecycle States

**Planning Artifacts:**
```
Draft → Review → Validated → Saved → Sharded → Referenced
```

**Story Artifacts:**
```
Draft → Approved → In Progress → Review → Done
```

**Gate Artifacts:**
```
Created (PASS/CONCERNS/FAIL/WAIVED)
```

### Context Preservation

**Between Agents:**
- Handoff prompts pass critical context
- Artifacts reference each other (PRD → Architecture)
- Sharded documents maintain cross-references

**Between Phases:**
- Planning artifacts saved before development
- Stories reference sharded planning docs
- QA assessments reference stories

**Between Sessions:**
- File-based state persists across sessions
- User can resume workflow at any stage
- No in-memory state dependencies

### Workflow Position Tracking

**Implicit Tracking:**
- Workflow position determined by which artifacts exist
- Next step inferred from completed artifacts
- User knows stage by which docs are in project

**Example:**
- PRD exists, no architecture → Next: Create architecture OR skip to sharding
- PRD + Architecture exist, no shards → Next: Shard documents
- Shards exist, no stories → Next: Create stories

### Decision History

**Tracked Via:**
- Artifact content (decisions documented in PRD/Architecture)
- Handoff prompts (capture routing decisions)
- Gate files (QA decision rationale)
- Story status (approval/completion decisions)

**Not Tracked:**
- Why routing decisions were made (only documented in handoff prompts)
- Detailed agent conversation history
- Alternative approaches considered

### Resumption Capability

**Workflows Support Resumption:**
- User can stop at any artifact save point
- Resume by starting next agent with existing artifacts
- No workflow "session" concept needed
- File presence determines resumption point

**Example Resumption:**
```
User stops after PRD creation
→ Later: User starts Architect agent
→ Architect reads docs/prd.md
→ Workflow continues from architecture creation
```

---

## ADK Translation Recommendations

### Overview

Translating BMad brownfield workflows to Google Vertex AI ADK requires careful consideration of:
- Adaptive routing logic
- Conditional document creation
- Multi-agent orchestration
- File-based state management
- User interaction points

### Core Architecture

**Recommended ADK Components:**

| BMad Component | ADK Implementation | Rationale |
|----------------|-------------------|-----------|
| Brownfield Workflows | Cloud Workflows | Complex orchestration with conditional logic |
| Enhancement Classification | Reasoning Engine | LLM-powered decision making |
| Document-Project Task | Reasoning Engine Workflow | Multi-step analysis process |
| Planning Agents (PM, Architect, UX) | Vertex AI Agents | Specialized agents with templates |
| PO Validation | Cloud Function + Agent | Checklist execution + validation logic |
| Document Sharding | Cloud Function | Deterministic parsing and splitting |
| Story Creation | Reasoning Engine | Context extraction and synthesis |
| Development Agents (Dev, QA) | Vertex AI Agents | Standard agent configurations |
| Artifact Storage | Cloud Storage + Firestore | Files + metadata |
| State Management | Firestore | Workflow state and decision tracking |

### Workflow Orchestration Design

**Option 1: Cloud Workflows (Recommended)**

```yaml
main:
  steps:
    - enhancement_classification:
        call: vertex_ai.reasoning_engine
        args:
          workflow_id: "classify_enhancement"
        result: classification

    - routing_decision:
        switch:
          - condition: ${classification.scope == "single_story"}
            next: create_single_story
          - condition: ${classification.scope == "small_feature"}
            next: create_epic
          - condition: ${classification.scope == "major_enhancement"}
            next: document_project_check

    - document_project_check:
        call: vertex_ai.agent
        args:
          agent_id: "analyst"
          task: "assess_documentation"
        result: doc_assessment

    - conditional_document_project:
        switch:
          - condition: ${doc_assessment.adequate}
            next: create_prd
          - condition: ${!doc_assessment.adequate}
            next: run_document_project

    # ... additional steps
```

**Advantages:**
- Native Google Cloud service
- Built-in conditional logic
- Parallel execution support
- Error handling and retries
- Integration with other GCP services

**Challenge:** User interaction points need careful handling

**Option 2: Custom Orchestrator (Cloud Run)**

```python
class BrownfieldOrchestrator:
    """Custom orchestrator for brownfield workflows."""

    async def run_fullstack_workflow(self, project_id: str):
        # Step 1: Classification
        classification = await self.classify_enhancement(project_id)

        if classification.scope == "single_story":
            return await self.create_single_story(project_id)
        elif classification.scope == "small_feature":
            return await self.create_epic(project_id)

        # Major enhancement path
        doc_assessment = await self.assess_documentation(project_id)

        if not doc_assessment.adequate:
            await self.run_document_project(project_id)

        prd = await self.create_prd(project_id)

        # Conditional architecture
        arch_decision = await self.decide_architecture_needed(prd)
        architecture = None
        if arch_decision.needed:
            architecture = await self.create_architecture(project_id, prd)

        # Validation
        validation = await self.validate_artifacts(project_id)
        while validation.has_issues:
            await self.fix_documents(validation.issues)
            validation = await self.validate_artifacts(project_id)

        # Sharding
        await self.shard_documents(project_id)

        # Development cycle
        await self.run_development_cycle(project_id)
```

**Advantages:**
- Maximum flexibility
- Easy user interaction handling
- Custom error handling
- Fine-grained control

**Challenge:** More code to maintain

### Adaptive Routing Implementation

**Classification Reasoning Engine:**

```python
class EnhancementClassifier(Reasoning_Engine):
    """LLM-powered enhancement classification."""

    def classify(self, user_description: str, existing_docs: dict) -> Classification:
        prompt = f"""
        Analyze the enhancement request and classify it:

        User Description: {user_description}
        Existing Documentation: {existing_docs}

        Determine:
        1. Scope: single_story | small_feature | major_enhancement
        2. Estimated Story Count: 1, 2-3, or 4+
        3. Architectural Impact: minimal | moderate | significant
        4. Rationale: Brief explanation

        Classification Criteria:
        - single_story: < 4 hours, isolated change, no architecture
        - small_feature: 1-3 stories, existing patterns, minimal integration
        - major_enhancement: Multiple epics, architectural changes, complex integration
        """

        response = self.llm.generate(prompt)
        return Classification.parse(response)
```

**Storage:**
```json
{
  "project_id": "proj-123",
  "workflow": "brownfield-fullstack",
  "classification": {
    "scope": "major_enhancement",
    "estimated_stories": 12,
    "architectural_impact": "significant",
    "rationale": "Requires new microservices and database schema changes"
  },
  "path_taken": "full_workflow",
  "timestamp": "2025-10-14T10:30:00Z"
}
```

### Conditional Architecture Decision

**Decision Logic:**

```python
class ArchitectureDecider:
    """Determine if architecture document needed."""

    def analyze_prd(self, prd: dict) -> ArchitectureDecision:
        indicators = {
            "new_patterns": self.check_new_patterns(prd),
            "new_frameworks": self.check_new_frameworks(prd),
            "infrastructure_changes": self.check_infrastructure(prd),
            "integration_complexity": self.assess_integration(prd)
        }

        # Architecture needed if any indicator is true
        needed = any(indicators.values())

        return ArchitectureDecision(
            needed=needed,
            rationale=self.generate_rationale(indicators),
            triggers=[ for k, v in indicators.items() if v]
        )
```

**Firestore Storage:**
```json
{
  "project_id": "proj-123",
  "workflow_stage": "architecture_decision",
  "decision": {
    "architecture_needed": true,
    "rationale": "New GraphQL API pattern and Kafka integration require architecture",
    "triggers": ["new_patterns", "infrastructure_changes"],
    "timestamp": "2025-10-14T11:00:00Z"
  }
}
```

### State Management in Firestore

**Workflow State Schema:**

```javascript
// /projects/{project_id}/brownfield_workflows/{workflow_id}
{
  workflow_type: "brownfield-fullstack",
  current_stage: "architecture_creation",
  classification: {
    scope: "major_enhancement",
    path: "full_workflow"
  },
  stages_completed: [
    "enhancement_classification",
    "documentation_assessment",
    "prd_creation"
  ],
  artifacts: {
    prd: "gs://bucket/proj-123/prd.md",
    architecture: "gs://bucket/proj-123/architecture.md"
  },
  decisions: {
    architecture_needed: true,
    documentation_adequate: false
  },
  status: "in_progress",
  created_at: "2025-10-14T09:00:00Z",
  updated_at: "2025-10-14T11:30:00Z"
}
```

**Artifact Metadata:**

```javascript
// /projects/{project_id}/artifacts/{artifact_id}
{
  type: "prd",
  file_path: "gs://bucket/proj-123/prd.md",
  created_by: "pm-agent",
  validated: true,
  validation_timestamp: "2025-10-14T11:00:00Z",
  sharded: true,
  shard_paths: [
    "gs://bucket/proj-123/prd/epic-01.md",
    "gs://bucket/proj-123/prd/epic-02.md"
  ],
  version: 2,
  status: "finalized"
}
```

### User Interaction Handling

**Challenge:** Brownfield workflows have user save points and manual actions.

**Solution 1: Hybrid Automation with Pause Points**

```python
class WorkflowWithPauses:
    """Workflow that pauses for user actions."""

    async def run_with_pauses(self, project_id: str):
        # Automated: Classification
        classification = await self.classify_enhancement(project_id)

        # Automated: PRD creation
        prd = await self.create_prd(project_id)

        # PAUSE: User saves PRD
        await self.notify_user(
            project_id,
            action="save_prd",
            message="Please save the PRD to docs/prd.md and click Continue"
        )
        await self.wait_for_user_confirmation(project_id, "prd_saved")

        # Automated: Architecture (if needed)
        if await self.architecture_needed(prd):
            architecture = await self.create_architecture(project_id)

            # PAUSE: User saves architecture
            await self.notify_user(
                project_id,
                action="save_architecture",
                message="Please save the architecture to docs/architecture.md"
            )
            await self.wait_for_user_confirmation(project_id, "architecture_saved")

        # Continue...
```

**Solution 2: Auto-Save with User Review**

```python
class AutoSaveWorkflow:
    """Automatically save artifacts with user review step."""

    async def create_and_save_prd(self, project_id: str):
        # Create PRD
        prd = await self.pm_agent.create_prd(project_id)

        # Auto-save to Cloud Storage
        prd_path = f"gs://bucket/{project_id}/prd.md"
        await self.storage.save(prd_path, prd.content)

        # Notify user for review
        await self.notify_user(
            project_id,
            action="review_prd",
            message=f"PRD created and saved to {prd_path}. Please review.",
            artifact_url=self.get_signed_url(prd_path)
        )

        # Wait for approval or edits
        approval = await self.wait_for_approval(project_id, "prd")

        if approval.status == "approved":
            return prd_path
        elif approval.status == "edited":
            # User edited the file
            updated_prd = await self.storage.load(prd_path)
            return prd_path
        else:  # rejected
            # Restart PRD creation
            return await self.create_and_save_prd(project_id)
```

### Document Sharding Implementation

**Cloud Function Approach:**

```python
from google.cloud import storage
from bmad_parser import PRDParser, Sharder

def shard_prd(request):
    """Cloud Function to shard PRD into epics."""
    project_id = request.json['project_id']
    prd_path = request.json['prd_path']

    # Load PRD from Cloud Storage
    storage_client = storage.Client()
    prd_content = storage_client.download(prd_path)

    # Parse and shard
    parser = PRDParser()
    prd = parser.parse(prd_content)

    sharder = Sharder()
    shards = sharder.shard_by_epics(prd)

    # Save shards
    shard_paths = []
    for i, shard in enumerate(shards):
        shard_path = f"gs://bucket/{project_id}/prd/epic-{i:02d}.md"
        storage_client.upload(shard_path, shard.content)
        shard_paths.append(shard_path)

    # Create index
    index = sharder.create_index(shards)
    index_path = f"gs://bucket/{project_id}/prd/index.md"
    storage_client.upload(index_path, index)
    shard_paths.insert(0, index_path)

    # Update metadata
    firestore_client.collection('projects').document(project_id).update({
        'artifacts.prd_shards': shard_paths,
        'sharding_complete': True
    })

    return {'status': 'success', 'shard_paths': shard_paths}
```

### Multi-Agent Coordination

**Agent Handoff Pattern:**

```python
class AgentCoordinator:
    """Coordinate multi-agent workflows."""

    async def handoff(
        self,
        from_agent: str,
        to_agent: str,
        context: dict,
        handoff_prompt: str
    ):
        # Log handoff
        await self.firestore.collection('handoffs').add({
            'project_id': context['project_id'],
            'from_agent': from_agent,
            'to_agent': to_agent,
            'handoff_prompt': handoff_prompt,
            'context': context,
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        # Invoke next agent
        next_agent = self.get_agent(to_agent)
        result = await next_agent.invoke(
            prompt=handoff_prompt,
            context=context
        )

        return result
```

**Example Handoff (PM → Architect):**

```python
context = {
    'project_id': 'proj-123',
    'prd_path': 'gs://bucket/proj-123/prd.md',
    'architectural_changes': True,
    'specific_changes': ['New GraphQL API', 'Kafka integration']
}

handoff_prompt = f"""
PRD complete and saved as {context['prd_path']}.
Architectural changes identified: Yes
Proceeding to create architecture document for: {', '.join(context['specific_changes'])}

Please create the architecture document.
"""

result = await coordinator.handoff(
    from_agent='pm',
    to_agent='architect',
    context=context,
    handoff_prompt=handoff_prompt
)
```

### Error Handling & Resumption

**Checkpoint Pattern:**

```python
class CheckpointManager:
    """Manage workflow checkpoints for resumption."""

    async def save_checkpoint(
        self,
        project_id: str,
        stage: str,
        state: dict
    ):
        await self.firestore.collection('checkpoints').document(
            f"{project_id}_{stage}"
        ).set({
            'project_id': project_id,
            'stage': stage,
            'state': state,
            'timestamp': firestore.SERVER_TIMESTAMP
        })

    async def resume_from_checkpoint(self, project_id: str):
        # Get latest checkpoint
        checkpoints = await self.firestore.collection('checkpoints')\
            .where('project_id', '==', project_id)\
            .order_by('timestamp', 'desc')\
            .limit(1)\
            .get()

        if not checkpoints:
            return None

        checkpoint = checkpoints[0].to_dict()
        return checkpoint['stage'], checkpoint['state']
```

**Usage:**

```python
async def run_brownfield_workflow(project_id: str):
    # Check for existing checkpoint
    resume_point = await checkpoint_manager.resume_from_checkpoint(project_id)

    if resume_point:
        stage, state = resume_point
        print(f"Resuming workflow from {stage}")
        return await continue_from_stage(project_id, stage, state)

    # Start new workflow
    classification = await classify_enhancement(project_id)
    await checkpoint_manager.save_checkpoint(
        project_id,
        'classification',
        {'classification': classification}
    )

    # Continue workflow...
```

### Recommendation Summary

**For Brownfield Workflows in ADK:**

1. **Use Cloud Workflows** for orchestration (handles conditional logic well)
2. **Use Reasoning Engine** for classification and decision making
3. **Use Vertex AI Agents** for specialized roles (PM, Architect, UX, etc.)
4. **Use Firestore** for state management and decision tracking
5. **Use Cloud Storage** for artifact storage with signed URLs
6. **Implement checkpoints** for resumption capability
7. **Auto-save artifacts** but allow user review/edit
8. **Log all handoffs** for audit trail
9. **Track decisions** separately from artifacts
10. **Support hybrid automation** with user pause points

**Key ADK Advantages:**
- Native conditional logic in Cloud Workflows
- Reasoning Engine handles LLM-powered decisions
- Firestore provides flexible state management
- Cloud Storage handles large artifacts
- Vertex AI Agents provide consistent agent framework

**Key Challenges:**
- User interaction points need careful UX design
- File-based state needs translation to Firestore
- Handoff prompts need proper context passing
- Error handling across distributed components

---

## Conclusion

### Key Insights

**Brownfield Workflows Are:**
1. **Adaptive** - Route based on enhancement complexity
2. **Safety-Focused** - Multiple validation and compatibility checks
3. **Context-Aware** - Document existing system before planning
4. **Conditional** - Skip unnecessary steps based on actual needs
5. **Flexible** - Support varied documentation formats and processes

**Three Workflow Variants:**
- **Brownfield-Fullstack** - Most complex, adaptive routing, conditional architecture
- **Brownfield-Service** - Simplified, always full planning, mandatory architecture
- **Brownfield-UI** - Service-like with UX Expert addition, three planning artifacts

**Common Development Cycle:**
- All workflows converge to same SM → Dev → QA → PO cycle
- Planning differences don't affect development
- Consistent quality gates across workflow types

### Critical Design Patterns

1. **Routing Before Documentation** - Classify scope before heavy analysis
2. **Conditional Architecture** - Create only when needed (fullstack)
3. **Mandatory Architecture** - Always create for service/UI changes
4. **PO Validation Gateway** - Quality gate before development
5. **File-Based State** - Artifacts in file system, not database
6. **Two-Option Flexibility** - Multiple ways to achieve same goal
7. **User Save Points** - Manual handoffs between planning and development

### ADK Translation Priorities

**High Priority:**
1. Implement adaptive routing with Reasoning Engine
2. Design conditional architecture decision logic
3. Create checkpoint/resumption system
4. Handle user interaction pause points
5. Implement multi-agent handoff coordination

**Medium Priority:**
1. Auto-save with user review workflow
2. Document sharding Cloud Functions
3. State tracking in Firestore
4. Error handling and retries

**Low Priority:**
1. Epic retrospective automation
2. Story review task integration
3. Analytics and reporting

### Next Steps

1. **Phase 5 Continuation** - Analyze greenfield workflows and development cycle
2. **Phase 6 Preparation** - Use insights for comprehensive ADK design
3. **Validation** - Review analysis against actual workflow executions
4. **Documentation** - Incorporate findings into final deliverables

---

**Document Complete**
**Total Length:** ~1,090 lines
**Analysis Depth:** Comprehensive workflow orchestration mapping for all 3 brownfield workflows
**ADK Readiness:** Translation recommendations provided for Google Vertex AI implementation
