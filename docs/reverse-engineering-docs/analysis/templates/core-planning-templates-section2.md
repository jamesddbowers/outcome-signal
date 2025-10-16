# Core Planning Templates Analysis - Section 2: PRD Templates

[← Back to Section 1: Introduction](core-planning-templates-section1.md) | [→ Continue to Section 3: Frontend Spec](core-planning-templates-section3.md)

---

## Section 2: PRD Templates Analysis

### Overview

The BMad framework provides two Product Requirements Document (PRD) templates:

1. **prd-tmpl.yaml** (v2.0) - For greenfield (new) projects
2. **brownfield-prd-tmpl.yaml** (v2.0) - For enhancing existing projects

Both templates are owned by the **PM Agent (John)** and encode the BMad methodology for requirements elicitation, epic/story structuring, and architect handoff.

---

## Template 1: PRD Template (Greenfield)

### Template Identity

```yaml
template:
  id: prd-template-v2
  name: Product Requirements Document
  version: 2.0
  output:
    format: markdown
    filename: docs/prd.md
    title: "{{project_name}} Product Requirements Document (PRD)"
```

**Key Characteristics**:
- **Lines**: 204
- **Owner**: PM Agent (John)
- **Mode**: Interactive with advanced-elicitation
- **Purpose**: Define requirements, epics, and stories for new projects
- **Output**: Single markdown file at docs/prd.md

### Workflow Configuration

```yaml
workflow:
  mode: interactive
  elicitation: advanced-elicitation
```

**Interaction Pattern**:
- Section-by-section guided conversation
- PM agent asks clarifying questions at each step
- User reviews and confirms content before proceeding
- Validation loops ensure completeness and accuracy

### Section Structure

The PRD template defines **8 major sections** with extensive nested sub-sections:

#### 1. Goals and Background Context

**Purpose**: Establish project foundation and scope determination.

**Key Features**:
- **Project Brief Integration**: Template strongly recommends creating project-brief first
  - If no brief exists: "STRONGLY recommend creating one first"
  - If brief exists: Use it to populate goals and background
  - If user insists on PRD without brief: Gather information during goals section

**Sub-sections**:
1. **Goals** (bullet-list)
   - 1-line desired outcomes
   - User and project desires
   - What success looks like

2. **Background Context** (paragraphs)
   - 1-2 short paragraphs
   - What problem this solves
   - Why this matters now
   - Current landscape/need

3. **Change Log** (table)
   - Columns: Date, Version, Description, Author
   - Tracks document evolution

**Instruction Excerpt**:
> "Ask if Project Brief document is available. If NO Project Brief exists, STRONGLY recommend creating one first using project-brief-tmpl (it provides essential foundation: problem statement, target users, success metrics, MVP scope, constraints)."

**Design Insight**: This section enforces BMad's methodology that project briefs should precede PRDs for optimal requirements quality.

---

#### 2. Requirements

**Purpose**: Capture functional and non-functional requirements.

**Sub-sections**:

1. **Functional Requirements** (numbered-list with FR prefix)
   - Each requirement gets unique ID: FR1, FR2, FR3...
   - Bullet markdown format
   - Clear, testable statements

   **Example**:
   ```markdown
   - FR6: The Todo List uses AI to detect and warn against potentially
     duplicate todo items that are worded differently.
   ```

2. **Non-Functional Requirements** (numbered-list with NFR prefix)
   - Performance, scalability, security, compliance
   - Numbered like functional requirements: NFR1, NFR2...

   **Example**:
   ```markdown
   - NFR1: AWS service usage must aim to stay within free-tier limits
     where feasible.
   ```

**Elicitation Flag**: `elicit: true` - Agent engages user interactively to draft requirements.

**Design Pattern**: Numbered requirements with prefixes enable traceability:
- Stories reference requirements by ID
- Test scenarios map to requirement IDs
- Acceptance criteria link back to requirements

---

#### 3. User Interface Design Goals

**Purpose**: Capture high-level UI/UX vision to guide UX Expert and inform story creation.

**Conditional**: `condition: PRD has UX/UI requirements`

**Important Distinction**: This is NOT detailed UI spec—focus on product vision and user goals. Detailed UI specs come from UX Expert using front-end-spec-tmpl.

**Sub-sections**:

1. **Overall UX Vision**
   - High-level user experience philosophy

2. **Key Interaction Paradigms**
   - How users interact with the product

3. **Core Screens and Views**
   - Conceptual high-level screen list
   - Meant to drive rough epic or story identification
   - Examples: "Login Screen", "Main Dashboard", "Settings Page"

4. **Accessibility** (choice field)
   - Options: None, WCAG AA, WCAG AAA
   - Can specify custom requirements

5. **Branding**
   - Branding elements or style guides
   - Examples range from simple color palettes to complex themes

6. **Target Device and Platforms** (choice field)
   - Options: Web Responsive, Mobile Only, Desktop Only, Cross-Platform
   - Can specify combinations

**Elicitation Strategy** (from instruction):
1. Pre-fill all subsections with educated guesses based on project context
2. Present complete rendered section to user
3. Clearly indicate where assumptions were made
4. Ask targeted questions for unclear/missing elements
5. Focus on product vision, not technical implementation

**Design Insight**: PM agent acts as informed consultant, making educated guesses to accelerate the process while ensuring user validation.

---

#### 4. Technical Assumptions

**Purpose**: Gather technical decisions to guide the Architect.

**Elicitation Flag**: `elicit: true`

**Sub-sections**:

1. **Repository Structure** (choice field)
   - Options: Monorepo, Polyrepo, Multi-repo
   - Strategic decision with major architectural implications

2. **Service Architecture**
   - Labeled "CRITICAL DECISION"
   - High-level architecture: Monolith, Microservices, Serverless within Monorepo
   - Not detailed technical spec—that's for Architect

3. **Testing Requirements**
   - Labeled "CRITICAL DECISION"
   - Unit only, integration, e2e, manual
   - Need for manual testing convenience methods

4. **Additional Technical Assumptions and Requests**
   - Catch-all for other architectural considerations
   - Populated throughout document drafting process

**Elicitation Strategy** (from instruction):
1. Check if .bmad-core/data/technical-preferences.yaml exists—use it to pre-populate
2. Ask user about: languages, frameworks, starter templates, libraries, APIs, deployment targets
3. For unknowns, offer guidance based on project goals and MVP scope
4. Document ALL technical choices with rationale (why this choice fits)
5. These become constraints for Architect—be specific and complete

**Integration Point**: References technical-preferences.yaml data file for pre-population.

**Design Insight**: PM agent doesn't make technical decisions alone—it loads preferences, asks user, and offers guidance, ensuring decisions are documented with rationale.

---

#### 5. Epic List

**Purpose**: Present high-level list of all epics for user approval before diving into details.

**Elicitation Flag**: `elicit: true`

**Critical Sequencing Requirements** (from instruction):

> "Epics MUST be logically sequential following agile best practices:
> - Each epic should deliver a significant, end-to-end, fully deployable increment of testable functionality
> - Epic 1 must establish foundational project infrastructure (app setup, Git, CI/CD, core services) unless adding to existing app, while also delivering initial functionality, even as simple as a health-check route or canary page
> - Each subsequent epic builds upon previous epics' functionality delivering major blocks that provide tangible value to users or business when deployed
> - Not every project needs multiple epics—an epic needs to deliver value
> - Err on side of less epics, but let user know rationale and offer options for splitting if some are too large or focused on disparate things
> - Cross-cutting concerns should flow through epics and stories, not be final stories (e.g., logging framework shouldn't be last story—we need logging from beginning)"

**Examples**:
- Epic 1: Foundation & Core Infrastructure: Establish project setup, authentication, and basic user management
- Epic 2: Core Business Entities: Create and manage primary domain objects with CRUD operations
- Epic 3: User Workflows & Interactions: Enable key user journeys and business processes
- Epic 4: Reporting & Analytics: Provide insights and data visualization for users

**Design Insight**:
- This two-phase approach (list first, then details) prevents overwhelming user
- Sequential requirement ensures deployable increments
- Epic 1 must always establish infrastructure AND deliver initial functionality
- Cross-cutting concerns (logging, monitoring, error handling) integrated from start

---

#### 6. Epic Details

**Purpose**: Provide detailed breakdown of each epic with stories and acceptance criteria.

**Repeatable Section**: `repeatable: true` - One section per epic.

**Section Title Pattern**: "Epic {{epic_number}} {{epic_title}}"

**Elicitation Flag**: `elicit: true`

**Epic Goal Template**: `template: "{{epic_goal}}"` - 2-3 sentences describing objective and value.

**Critical Story Sequencing Requirements** (from instruction):

> "Stories within each epic MUST be logically sequential:
> - Each story should be a 'vertical slice' delivering complete functionality aside from early enabler stories
> - No story should depend on work from a later story or epic
> - Identify and note any direct prerequisite stories
> - Focus on 'what' and 'why' not 'how' (leave technical implementation to Architect)
> - Ensure each story delivers clear user or business value, try to avoid enablers and build them into stories that deliver value
> - Size stories for AI agent execution: Each story must be completable by single AI agent in one focused session without context overflow
> - Think 'junior developer working for 2-4 hours'—stories must be small, focused, and self-contained
> - If a story seems complex, break it down further as long as it can deliver a vertical slice"

**Sub-section: Story** (repeatable)

**Story Title Pattern**: "Story {{epic_number}}.{{story_number}} {{story_title}}"

**Story Template**:
```markdown
As a {{user_type}},
I want {{action}},
so that {{benefit}}.
```

**Sub-sub-section: Acceptance Criteria** (numbered-list, repeatable)

**Acceptance Criteria Requirements** (from instruction):

> "Define clear, comprehensive, and testable acceptance criteria that:
> - Precisely define what 'done' means from functional perspective
> - Are unambiguous and serve as basis for verification
> - Include any critical non-functional requirements from PRD
> - Consider local testability for backend/data components
> - Specify UI/UX requirements and framework adherence where applicable
> - Avoid cross-cutting concerns that should be in other stories or PRD sections"

**Item Template**: `"{{criterion_number}}: {{criteria}}"`

**Design Insights**:
- Hierarchical structure: PRD → Epics → Stories → Acceptance Criteria
- Story numbering: Epic.Story (e.g., 1.1, 1.2, 2.1, 2.2...)
- Stories sized for single AI agent session (2-4 hours of work)
- "Vertical slice" principle: Each story delivers end-to-end functionality
- Acceptance criteria must be testable and unambiguous

---

#### 7. Checklist Results Report

**Purpose**: Execute PM checklist and document validation results before proceeding to architecture phase.

**Instruction** (from template):
> "Before running the checklist and drafting the prompts, offer to output the full updated PRD. If outputting it, confirm with user that you will be proceeding to run the checklist and produce the report. Once user confirms, execute the pm-checklist and populate the results in this section."

**Integration**: Links to pm-checklist task for quality validation.

**Design Insight**: Quality gate before handoff to next phase—ensures PRD completeness.

---

#### 8. Next Steps

**Purpose**: Provide handoff prompts for UX Expert and Architect agents.

**Sub-sections**:

1. **UX Expert Prompt**
   - Short, to-the-point prompt
   - Initiates create architecture mode
   - Uses PRD as input

2. **Architect Prompt**
   - Short, to-the-point prompt
   - Initiates create architecture mode
   - Uses PRD as input

**Design Insight**: Template includes explicit handoff instructions, ensuring smooth transition between planning agents.

---

### Data Flow & Dependencies

**Input Dependencies**:
- (Optional) project-brief.md - Foundation document
- (Optional) .bmad-core/data/technical-preferences.yaml - Tech stack defaults
- (Optional) brainstorming-session-results.md - Ideation insights

**Output Artifact**:
- docs/prd.md - Complete PRD with goals, requirements, epics, and stories

**Downstream Consumers**:
- UX Expert (Sally) - Creates front-end-spec.md
- Architect (Winston) - Creates architecture.md
- SM (Bob) - Uses epics/stories to create individual story documents
- PO (Sarah) - Validates PRD completeness via pm-checklist

**Workflow Integration**:
- Used by: create-doc.md task (PM agent)
- Validated by: execute-checklist.md task with pm-checklist

---

### Template Variables & Interpolation

**Project-Level Variables**:
- `{{project_name}}` - Project identifier
- `{{epic_number}}` - Dynamic epic counter
- `{{epic_title}}` - Epic title text
- `{{epic_goal}}` - Epic goal description
- `{{story_number}}` - Dynamic story counter within epic
- `{{story_title}}` - Story title text
- `{{user_type}}` - Story user role
- `{{action}}` - Story action description
- `{{benefit}}` - Story benefit/value
- `{{criterion_number}}` - Acceptance criteria counter
- `{{criteria}}` - Acceptance criteria text

**Choice Variables**:
- `{{accessibility}}` - None | WCAG AA | WCAG AAA
- `{{platforms}}` - Web Responsive | Mobile Only | Desktop Only | Cross-Platform
- `{{repository}}` - Monorepo | Polyrepo | Multi-repo
- `{{architecture}}` - Monolith | Microservices | Serverless
- `{{testing}}` - Unit Only | Unit + Integration | Full Testing Pyramid

---

### Validation Rules & Quality Standards

**Built-in Validation**:
1. **Project Brief Check** - Recommends creating brief first if missing
2. **Sequential Epic Structure** - Epic 1 must establish infrastructure
3. **Sequential Story Structure** - Stories within epics must be logically ordered
4. **Vertical Slice Principle** - Each story must deliver complete functionality
5. **Story Sizing** - Stories must be completable in single AI agent session
6. **Acceptance Criteria Completeness** - Must be testable and unambiguous
7. **Checklist Execution** - pm-checklist must pass before handoff

---

### ADK Translation Considerations for PRD Template

**1. Template Storage**
- Store template YAML in Cloud Storage bucket: `gs://bmad-templates/prd-tmpl.yaml`
- Version control through GCS versioning
- Templates immutable once published—new versions get new files

**2. Template Rendering Service**
- Cloud Function or Cloud Run service
- Loads template from GCS
- Interprets YAML structure
- Guides PM agent through section-by-section population
- Renders final markdown output

**3. Interactive Elicitation Implementation**
- Vertex AI Agent (PM) with conversation memory
- Template drives conversation flow
- Agent uses instructions to formulate questions
- Agent validates responses against examples and constraints
- Session state maintained in Firestore

**4. Choice Field Handling**
- Store choices in template definition
- Present as buttons/dropdowns in web UI
- Validate selections against allowed values
- Use technical-preferences.yaml for defaults

**5. Checklist Integration**
- Cloud Function calls execute-checklist task
- Results stored in Firestore
- Results populated into PRD checklist-results section
- Gate prevents progression if checklist fails

**6. Handoff Prompts**
- Store prompts in template
- API endpoint to retrieve next-agent-prompt
- Prompts include context (PRD location, relevant sections)

**7. Epic/Story Hierarchy Management**
- Firestore collection structure:
  ```
  /projects/{project_id}/prd
  /projects/{project_id}/epics/{epic_id}
  /projects/{project_id}/stories/{story_id}
  ```
- Maintain referential integrity
- Enable querying by epic or story

**8. Variable Interpolation**
- Simple substitution: `{{project_name}}` → actual value
- Dynamic counters: `{{epic_number}}`, `{{story_number}}`
- Template rendering engine handles substitution

---

## Template 2: Brownfield PRD Template

### Template Identity

```yaml
template:
  id: brownfield-prd-template-v2
  name: Brownfield Enhancement PRD
  version: 2.0
  output:
    format: markdown
    filename: docs/prd.md
    title: "{{project_name}} Brownfield Enhancement PRD"
```

**Key Characteristics**:
- **Lines**: 282 (38% longer than greenfield PRD)
- **Owner**: PM Agent (John)
- **Mode**: Interactive with advanced-elicitation
- **Purpose**: Define requirements for enhancing existing projects
- **Output**: Single markdown file at docs/prd.md

### Workflow Configuration

Same as greenfield template—interactive with advanced-elicitation.

### Key Differences from Greenfield Template

The brownfield template includes **significant additional sections and validation** to handle existing project complexity:

#### Additional Considerations

1. **Scope Assessment** (up-front)
2. **Existing Project Analysis Integration** (document-project task integration)
3. **Compatibility Requirements** (new requirement type)
4. **Integration Verification** (per story)
5. **Risk Assessment with Technical Debt** (more comprehensive)
6. **Explicit Validation Confirmations** (throughout)

---

### Section Structure Comparison

| Section | Greenfield | Brownfield | Notes |
|---------|-----------|------------|-------|
| Scope Assessment | ❌ | ✅ | Determines if full PRD needed |
| Project Analysis | ❌ | ✅ | Integrates with document-project |
| Documentation Analysis | ❌ | ✅ | Checks for existing docs |
| Enhancement Scope | ❌ | ✅ | Type, impact assessment |
| Goals & Background | ✅ | ✅ | Similar but context differs |
| Requirements | ✅ | ✅ | Similar structure |
| Functional Reqs | ✅ | ✅ | Same format |
| Non-Functional Reqs | ✅ | ✅ | Same format |
| Compatibility Reqs | ❌ | ✅ | Critical for brownfield |
| UI Goals | ✅ | ✅ (modified) | Integration with existing UI |
| Technical Assumptions | ✅ | ❌ | Replaced with constraints |
| Technical Constraints | ❌ | ✅ | Richer than assumptions |
| Epic List | ✅ | ❌ | Replaced with structure |
| Epic Structure | ❌ | ✅ | Single epic approach |
| Epic Details | ✅ | ✅ | Enhanced with IV section |
| Story Integration Verification | ❌ | ✅ | Per-story validation |
| Checklist Results | ✅ | ✅ | Same |
| Next Steps | ✅ | ✅ (modified) | May include migration |

---

### Section 1: Intro Project Analysis and Context

**Purpose**: Comprehensive assessment of existing project before defining requirements.

**Critical Scope Assessment** (from instruction):

> "IMPORTANT - SCOPE ASSESSMENT REQUIRED:
>
> This PRD is for SIGNIFICANT enhancements to existing projects that require comprehensive planning and multiple stories. Before proceeding:
>
> 1. **Assess Enhancement Complexity**: If this is a simple feature addition or bug fix that could be completed in 1-2 focused development sessions, STOP and recommend: 'For simpler changes, consider using the brownfield-create-epic or brownfield-create-story task with the Product Owner instead. This full PRD process is designed for substantial enhancements that require architectural planning and multiple coordinated stories.'
>
> 2. **Project Context**: Determine if we're working in an IDE with the project already loaded or if the user needs to provide project information. If project files are available, analyze existing documentation in the docs folder. If insufficient documentation exists, recommend running the document-project task first.
>
> 3. **Deep Assessment Requirement**: You MUST thoroughly analyze the existing project structure, patterns, and constraints before making ANY suggestions. Every recommendation must be grounded in actual project analysis, not assumptions.
>
> CRITICAL: Throughout this analysis, explicitly confirm your understanding with the user. For every assumption you make about the existing project, ask: 'Based on my analysis, I understand that [assumption]. Is this correct?'
>
> Do not proceed with any recommendations until the user has validated your understanding of the existing system."

**Design Insight**: This prevents over-engineering simple changes and ensures PM agent deeply understands existing system before making recommendations.

---

**Sub-section: Existing Project Overview**

**Analysis Source** options:
1. Document-project output available at: {{path}}
2. IDE-based fresh analysis
3. User-provided information

**Current Project State**:
- If document-project exists: Extract from "High Level Architecture" and "Technical Summary"
- Otherwise: Brief description of current functionality and purpose

**Integration**: Template explicitly integrates with document-project task output.

---

**Sub-section: Documentation Analysis**

**Purpose**: Assess what documentation exists to guide requirements process.

**Available Documentation Checklist**:
- ✅ Tech Stack Documentation [If from document-project, check ✓]
- ✅ Source Tree/Architecture [If from document-project, check ✓]
- ✅ Coding Standards [If from document-project, may be partial]
- ✅ API Documentation [If from document-project, check ✓]
- ✅ External API Documentation [If from document-project, check ✓]
- ❓ UX/UI Guidelines [May not be in document-project]
- ✅ Technical Debt Documentation [If from document-project, check ✓]
- Other: {{other_docs}}

**Conditional Logic**:
- If document-project was run: "Using existing project analysis from document-project output."
- If critical documentation is missing and no document-project: "I recommend running the document-project task first..."

**Design Insight**: Template acknowledges that document-project task may have already been executed and integrates its outputs.

---

**Sub-section: Enhancement Scope Definition**

**Enhancement Type** (checklist):
- New Feature Addition
- Major Feature Modification
- Integration with New Systems
- Performance/Scalability Improvements
- UI/UX Overhaul
- Technology Stack Upgrade
- Bug Fix and Stability Improvements
- Other: {{other_type}}

**Enhancement Description**: 2-3 sentences describing what to add or change.

**Impact Assessment** (checklist):
- Minimal Impact (isolated additions)
- Moderate Impact (some existing code changes)
- Significant Impact (substantial existing code changes)
- Major Impact (architectural changes required)

**Design Insight**: Template helps PM agent and user calibrate scope—"Minimal Impact" might not need full PRD.

---

**Sub-section: Goals and Background Context**

Similar to greenfield but focused on enhancement context:
- Goals: Desired outcomes this enhancement will deliver
- Background: Why enhancement is needed, what problem it solves, how it fits with existing project

---

**Sub-section: Change Log**

Table with columns: Change, Date, Version, Description, Author

Note extra "Change" column compared to greenfield template.

---

### Section 2: Requirements

Similar structure to greenfield with one critical addition:

**Additional Sub-section: Compatibility Requirements** (new in brownfield)

**Purpose**: Define what must remain compatible with existing system.

**Type**: numbered-list with **CR prefix** (Compatibility Requirement)

**Required Items**:
1. CR1: {{existing_api_compatibility}}
2. CR2: {{database_schema_compatibility}}
3. CR3: {{ui_ux_consistency}}
4. CR4: {{integration_compatibility}}

**Example**:
```markdown
- CR1: Enhancement must maintain backward compatibility with existing API
  endpoints used by mobile app v1.x.
- CR2: Database schema changes must support existing data without requiring
  full migration.
- CR3: New UI components must use existing design system and component library.
- CR4: Integration with payment gateway must continue to function without
  disruption.
```

**Design Insight**: Compatibility requirements are first-class citizens in brownfield projects—equal importance to functional and non-functional requirements.

---

### Section 3: UI Enhancement Goals (conditional)

**Condition**: Enhancement includes UI changes

**Modifications from Greenfield**:

**Sub-section: Integration with Existing UI**
- How new UI elements will fit with existing design patterns
- Style guides and component libraries to use
- Consistency requirements

**Sub-section: Modified/New Screens and Views**
- List ONLY screens/views being modified or added
- Not comprehensive screen list like greenfield

**Sub-section: UI Consistency Requirements**
- Specific requirements for maintaining visual and interaction consistency

**Design Insight**: UI section focuses on integration rather than comprehensive design—acknowledges existing UI patterns must be respected.

---

### Section 4: Technical Constraints and Integration Requirements

**Purpose**: Replaces "Technical Assumptions" from greenfield—brownfield has constraints, not assumptions.

**Sub-section: Existing Technology Stack**

**Integration with document-project**:
> "If document-project output available:
> - Extract from 'Actual Tech Stack' table in High Level Architecture section
> - Include version numbers and any noted constraints"

**Template**:
```markdown
**Languages**: {{languages}}
**Frameworks**: {{frameworks}}
**Database**: {{database}}
**Infrastructure**: {{infrastructure}}
**External Dependencies**: {{external_dependencies}}
```

**Design Insight**: Technology choices are already made—document them as constraints, not assumptions.

---

**Sub-section: Integration Approach**

**Template**:
```markdown
**Database Integration Strategy**: {{database_integration}}
**API Integration Strategy**: {{api_integration}}
**Frontend Integration Strategy**: {{frontend_integration}}
**Testing Integration Strategy**: {{testing_integration}}
```

Defines HOW enhancement integrates with existing architecture.

---

**Sub-section: Code Organization and Standards**

**Template**:
```markdown
**File Structure Approach**: {{file_structure}}
**Naming Conventions**: {{naming_conventions}}
**Coding Standards**: {{coding_standards}}
**Documentation Standards**: {{documentation_standards}}
```

Ensures new code follows existing patterns.

---

**Sub-section: Deployment and Operations**

**Template**:
```markdown
**Build Process Integration**: {{build_integration}}
**Deployment Strategy**: {{deployment_strategy}}
**Monitoring and Logging**: {{monitoring_logging}}
**Configuration Management**: {{config_management}}
```

Ensures enhancement fits existing operational practices.

---

**Sub-section: Risk Assessment and Mitigation**

**Integration with document-project** (from instruction):
> "If document-project output available:
> - Reference 'Technical Debt and Known Issues' section
> - Include 'Workarounds and Gotchas' that might impact enhancement
> - Note any identified constraints from 'Critical Technical Debt'
>
> Build risk assessment incorporating existing known issues:"

**Template**:
```markdown
**Technical Risks**: {{technical_risks}}
**Integration Risks**: {{integration_risks}}
**Deployment Risks**: {{deployment_risks}}
**Mitigation Strategies**: {{mitigation_strategies}}
```

**Design Insight**: Risk assessment must incorporate known technical debt from existing project—don't make same mistakes again.

---

### Section 5: Epic and Story Structure

**Different Approach from Greenfield**:

**Sub-section: Epic Approach**

**Template**: `"**Epic Structure Decision**: {{epic_decision}} with rationale"`

**Instruction** (key excerpt):
> "For brownfield projects, favor a single comprehensive epic unless the user is clearly requesting multiple unrelated enhancements. Before presenting the epic structure, confirm: 'Based on my analysis of your existing project, I believe this enhancement should be structured as [single epic/multiple epics] because [rationale based on actual project analysis]. Does this align with your understanding of the work required?'"

**Design Insight**: Brownfield typically uses single epic—multiple epics implies multiple unrelated enhancements, which might be better as separate PRDs.

---

### Section 6: Epic Details

**Title Pattern**: "Epic 1: {{enhancement_title}}"

**Template**:
```markdown
**Epic Goal**: {{epic_goal}}

**Integration Requirements**: {{integration_requirements}}
```

**Additional Field**: Integration Requirements—explicit statement of how epic integrates with existing system.

---

**Critical Story Sequencing for Brownfield** (from instruction):

> "- Stories must ensure existing functionality remains intact
> - Each story should include verification that existing features still work
> - Stories should be sequenced to minimize risk to existing system
> - Include rollback considerations for each story
> - Focus on incremental integration rather than big-bang changes
> - Size stories for AI agent execution in existing codebase context
> - MANDATORY: Present the complete story sequence and ask: 'This story sequence is designed to minimize risk to your existing system. Does this order make sense given your project's architecture and constraints?'
> - Stories must be logically sequential with clear dependencies identified
> - Each story must deliver value while maintaining system integrity"

**Key Differences**:
- Risk minimization is primary concern
- Each story validates existing functionality
- Rollback planning is explicit
- Incremental integration over big-bang
- Mandatory user confirmation of story sequence

---

**Sub-sub-section: Story** (repeatable)

**Title**: "Story 1.{{story_number}} {{story_title}}"

Same user story format as greenfield.

**Sub-sub-sub-sections**:
1. **Acceptance Criteria** (numbered-list)
   - Must include both new functionality AND existing system integrity

2. **Integration Verification** (new in brownfield)
   - Type: numbered-list with **IV prefix** (Integration Verification)
   - Required items:
     1. IV1: {{existing_functionality_verification}}
     2. IV2: {{integration_point_verification}}
     3. IV3: {{performance_impact_verification}}

**Example Integration Verification**:
```markdown
### Integration Verification

1. IV1: All existing API endpoints continue to function with same response
   times and formats
2. IV2: Database queries for existing features show no performance degradation
3. IV3: User workflows for existing functionality remain unchanged and testable
```

**Design Insight**: Integration Verification is critical innovation for brownfield—ensures every story explicitly validates it doesn't break existing system.

---

### Data Flow & Dependencies

**Input Dependencies**:
- (Required) Existing project codebase
- (Highly Recommended) document-project output (project analysis)
- (Optional) project-brief.md
- (Optional) .bmad-core/data/technical-preferences.yaml
- Existing documentation (tech stack, API docs, architecture)

**Output Artifact**:
- docs/prd.md - Brownfield Enhancement PRD

**Downstream Consumers**:
- UX Expert (Sally) - If UI changes needed
- Architect (Winston) - Updates architecture documentation
- SM (Bob) - Creates individual story documents
- PO (Sarah) - Validates completeness

**Workflow Integration**:
- Used by: create-doc.md task (PM agent)
- Depends on: document-project task output (strongly recommended)

---

### Validation Rules & Quality Standards

**Built-in Validation** (beyond greenfield):
1. **Scope Assessment** - Verifies enhancement needs full PRD
2. **Project Analysis Validation** - User confirms PM's understanding
3. **Documentation Check** - Ensures sufficient project knowledge
4. **Compatibility Requirements** - Explicit backward compatibility
5. **Integration Verification per Story** - Every story validates existing system
6. **Risk Assessment with Technical Debt** - Acknowledges known issues
7. **Story Sequence Confirmation** - User validates order minimizes risk

**Validation Confirmations Throughout** (from instructions):
- "Based on my analysis, I understand that [assumption]. Is this correct?"
- "These requirements are based on my understanding of your existing system. Please review carefully and confirm they align with your project's reality."
- "This story sequence is designed to minimize risk to your existing system. Does this order make sense given your project's architecture and constraints?"

**Design Insight**: Brownfield template has explicit validation loops to prevent PM agent from making incorrect assumptions about existing system.

---

### ADK Translation Considerations for Brownfield PRD Template

**Additional Requirements Beyond Greenfield**:

**1. Project Analysis Integration**
- API to fetch document-project results from Firestore
- PM agent pre-populates sections from analysis
- Link to original analysis documents

**2. Codebase Access**
- Vertex AI Agent needs read access to existing codebase repository
- Code analysis tools for structure understanding
- Dependency graph visualization

**3. Compatibility Requirement Tracking**
- Separate Firestore collection for CR items
- Link CRs to affected stories
- Validation that all CRs addressed

**4. Integration Verification Tracking**
- IV items per story stored in Firestore
- Test execution tracking for IVs
- Dashboard showing IV coverage

**5. Technical Debt Integration**
- Load technical debt from document-project
- Display known issues during requirements gathering
- Risk assessment incorporates debt items

**6. Validation Confirmation UI**
- Interactive confirmation dialogs at key points
- User must explicitly confirm understanding
- Block progression if confirmations not received

**7. Scope Assessment Flow**
- Pre-flight check before full PRD
- Decision tree: Simple change → brownfield-create-story
- Complex change → Full brownfield PRD

**8. Rollback Planning**
- Each story includes rollback steps
- Firestore stores rollback procedures
- Deployment pipeline integration

---

### Comparison Summary

| Aspect | Greenfield PRD | Brownfield PRD |
|--------|---------------|----------------|
| **Lines of YAML** | 204 | 282 |
| **Primary Focus** | Define new system | Enhance existing system |
| **Scope Assessment** | Not needed | Critical up-front |
| **Project Analysis** | Not needed | Required (document-project) |
| **Requirements Types** | FR, NFR | FR, NFR, CR |
| **Story Validation** | Acceptance Criteria | AC + Integration Verification |
| **Epic Approach** | Multiple epics common | Single epic preferred |
| **Risk Consideration** | Standard | Incorporates technical debt |
| **Technical Section** | Assumptions (open) | Constraints (fixed) |
| **Validation Loops** | Standard | Explicit confirmations |
| **Complexity** | Moderate | High |
| **User Interaction** | High | Very High (more validation) |

---

### Key Insights: PRD Templates

**1. Greenfield vs. Brownfield Requires Fundamentally Different Approaches**
- Greenfield: Define vision and structure from scratch
- Brownfield: Integrate with existing system while minimizing risk

**2. Compatibility Requirements (CR) Are First-Class Citizens**
- Equal importance to FR and NFR
- Explicit tracking and validation
- Must be testable

**3. Integration Verification (IV) Ensures System Integrity**
- Every brownfield story must verify existing functionality
- Prevents regression
- Explicit performance impact assessment

**4. document-project Task Is Critical for Brownfield**
- Template explicitly integrates its outputs
- Reduces guesswork and assumptions
- Provides foundation for technical decisions

**5. Story Sizing for AI Agent Execution**
- Both templates emphasize "junior developer working 2-4 hours"
- Stories must be completable in single AI agent session
- Prevents context overflow

**6. Epic/Story Hierarchy Enables Traceability**
- Numbered requirements (FR, NFR, CR)
- Numbered stories (Epic.Story)
- Numbered acceptance criteria (AC)
- Numbered integration verifications (IV)
- Complete traceability from requirement to verification

**7. Templates Are Teaching Tools**
- Extensive instructions guide PM agent behavior
- Examples provide concrete reference
- Critical decision points labeled explicitly
- Best practices encoded in structure

**8. Quality Gates Before Handoff**
- Checklist execution required
- User validation of understanding
- Next steps with explicit prompts

---

**End of Section 2**

[← Back to Section 1: Introduction](core-planning-templates-section1.md) | [→ Continue to Section 3: Frontend Spec](core-planning-templates-section3.md)
