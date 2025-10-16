# Core Planning Templates Analysis - Section 4: Story & Project Brief Templates

[← Back to Section 3: Frontend Spec](core-planning-templates-section3.md) | [→ Continue to Section 5: Brainstorming Template](core-planning-templates-section5.md)

---

## Section 4: Story & Project Brief Templates Analysis

This section covers two critical templates:
1. **story-tmpl.yaml** (v2.0) - Individual development story structure
2. **project-brief-tmpl.yaml** (v2.0) - Project foundation document

---

## Template 1: Story Template

### Template Identity

```yaml
template:
  id: story-template-v2
  name: Story Document
  version: 2.0
  output:
    format: markdown
    filename: docs/stories/{{epic_num}}.{{story_num}}.{{story_title_short}}.md
    title: "Story {{epic_num}}.{{story_num}}: {{story_title_short}}"
```

**Key Characteristics**:
- **Lines**: 139
- **Owner**: SM Agent (Bob) - Scrum Master
- **Mode**: Interactive with advanced-elicitation
- **Purpose**: Define individual development stories with tasks, acceptance criteria, and implementation details
- **Output**: Individual markdown file per story in docs/stories/ directory
- **Filename Pattern**: `{epic}.{story}.{title-slug}.md` (e.g., `1.2.user-authentication.md`)

---

### Critical Innovation: Agent Ownership Model (v2.0)

The story template introduces **section-level ownership and edit permissions**—a critical innovation enabling safe multi-agent collaboration.

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

**Key Concepts**:
- **editable_sections**: Global list of which sections can be edited after creation
- **owner**: Agent responsible for initially creating the section
- **editors**: Agents allowed to modify the section (may include owner)

**Design Insight**: This model prevents conflicts when multiple agents work on the same story document. For example, Dev Agent can add to "Dev Agent Record" section, but cannot modify SM's "Story" or "Acceptance Criteria" sections.

---

### Workflow Configuration

```yaml
workflow:
  mode: interactive
  elicitation: advanced-elicitation
```

**Interaction Pattern**:
- SM Agent creates story from PRD epic/story definitions
- Populates sections through conversation with user (if needed)
- Dev Agent later adds to designated sections during implementation
- QA Agent adds to QA Results section after review

---

### Section Structure & Ownership Model

#### Section 1: Status

```yaml
- id: status
  title: Status
  type: choice
  choices: [Draft, Approved, InProgress, Review, Done]
  instruction: Select the current status of the story
  owner: scrum-master
  editors: [scrum-master, dev-agent]
```

**Status Lifecycle**:
1. **Draft** - SM creates story, not yet approved
2. **Approved** - PO validates story (optional workflow step)
3. **InProgress** - Dev Agent begins implementation
4. **Review** - Dev Agent completes work, QA reviews
5. **Done** - QA approves, story complete

**Ownership**:
- **Owner**: scrum-master (SM Agent creates initial status)
- **Editors**: [scrum-master, dev-agent] - Both can update status

**Design Insight**: Dev Agent can update status to InProgress and Review, but cannot approve stories (remains SM/PO responsibility).

---

#### Section 2: Story

```yaml
- id: story
  title: Story
  type: template-text
  template: |
    **As a** {{role}},
    **I want** {{action}},
    **so that** {{benefit}}
  instruction: Define the user story using the standard format with role, action, and benefit
  elicit: true
  owner: scrum-master
  editors: [scrum-master]
```

**Type**: `template-text` - Structured text with variable placeholders

**Variables**:
- `{{role}}` - User type (e.g., "registered user", "administrator")
- `{{action}}` - What user wants to do
- `{{benefit}}` - Value or outcome user achieves

**Ownership**:
- **Owner**: scrum-master
- **Editors**: [scrum-master] - **Exclusive** - Only SM can edit

**Design Insight**: Story definition is immutable once created—Dev Agent cannot change requirements mid-implementation. Changes require SM to update story and potentially re-approve.

---

#### Section 3: Acceptance Criteria

```yaml
- id: acceptance-criteria
  title: Acceptance Criteria
  type: numbered-list
  instruction: Copy the acceptance criteria numbered list from the epic file
  elicit: true
  owner: scrum-master
  editors: [scrum-master]
```

**Type**: `numbered-list` - Ordered list of criteria

**Instruction**: "Copy the acceptance criteria numbered list from the epic file"

**Ownership**:
- **Owner**: scrum-master
- **Editors**: [scrum-master] - **Exclusive** - Only SM can edit

**Design Insight**: Acceptance criteria copied from PRD epic—ensures consistency. Like story, criteria are immutable during implementation.

---

#### Section 4: Tasks / Subtasks

```yaml
- id: tasks-subtasks
  title: Tasks / Subtasks
  type: bullet-list
  instruction: |
    Break down the story into specific tasks and subtasks needed for implementation.
    Reference applicable acceptance criteria numbers where relevant.
  template: |
    - [ ] Task 1 (AC: # if applicable)
      - [ ] Subtask1.1...
    - [ ] Task 2 (AC: # if applicable)
      - [ ] Subtask 2.1...
    - [ ] Task 3 (AC: # if applicable)
      - [ ] Subtask 3.1...
  elicit: true
  owner: scrum-master
  editors: [scrum-master, dev-agent]
```

**Type**: `bullet-list` - Markdown checklist format

**Template**: Checkbox format with AC references

**Ownership**:
- **Owner**: scrum-master (creates initial task breakdown)
- **Editors**: [scrum-master, dev-agent] - **Collaborative** - Dev can refine tasks

**Design Insight**: SM creates initial task breakdown, but Dev Agent can add subtasks or clarify during implementation. This flexibility acknowledges that detailed implementation steps may only become clear during development.

---

#### Section 5: Dev Notes

```yaml
- id: dev-notes
  title: Dev Notes
  instruction: |
    Populate relevant information, only what was pulled from actual artifacts from docs folder, relevant to this story:
    - Do not invent information
    - If known add Relevant Source Tree info that relates to this story
    - If there were important notes from previous story that are relevant to this one, include them here
    - Put enough information in this section so that the dev agent should NEVER need to read the architecture documents, these notes along with the tasks and subtasks must give the Dev Agent the complete context it needs to comprehend with the least amount of overhead the information to complete the story, meeting all AC and completing all tasks+subtasks
  elicit: true
  owner: scrum-master
  editors: [scrum-master]
```

**Critical Principle** (from instruction):

> "Put enough information in this section so that the dev agent should NEVER need to read the architecture documents, these notes along with the tasks and subtasks must give the Dev Agent the complete context it needs to comprehend with the least amount of overhead the information to complete the story"

**Content Sources**:
- Architecture documents (extracted sections)
- Source tree information (relevant files/directories)
- Previous story notes (if relevant)
- Technical decisions (from PRD or architecture)

**Ownership**:
- **Owner**: scrum-master
- **Editors**: [scrum-master] - **Exclusive** - SM curates context

**Design Insight**: SM acts as "context curator"—extracting and synthesizing relevant information from architecture so Dev Agent has everything needed without reading full architecture docs. This is **critical for AI agent execution** where context windows are limited.

---

**Sub-section: Testing**

```yaml
- id: testing-standards
  title: Testing
  instruction: |
    List Relevant Testing Standards from Architecture the Developer needs to conform to:
    - Test file location
    - Test standards
    - Testing frameworks and patterns to use
    - Any specific testing requirements for this story
  elicit: true
  owner: scrum-master
  editors: [scrum-master]
```

**Purpose**: Extract testing requirements from architecture so Dev Agent knows exactly what testing is expected.

**Content**:
- Test file location (e.g., `__tests__/` or `*.test.ts`)
- Test standards (e.g., "All functions must have unit tests")
- Testing frameworks (e.g., "Jest with React Testing Library")
- Story-specific testing requirements (e.g., "Must include integration test for payment flow")

**Design Insight**: Testing standards extracted to story level—Dev Agent doesn't need to search architecture docs.

---

#### Section 6: Change Log

```yaml
- id: change-log
  title: Change Log
  type: table
  columns: [Date, Version, Description, Author]
  instruction: Track changes made to this story document
  owner: scrum-master
  editors: [scrum-master, dev-agent, qa-agent]
```

**Type**: `table` - Structured change tracking

**Columns**: Date, Version, Description, Author

**Ownership**:
- **Owner**: scrum-master
- **Editors**: [scrum-master, dev-agent, qa-agent] - **Multi-agent** - All three can log changes

**Design Insight**: Change log is collaborative—any agent modifying story must log the change. Provides audit trail.

---

#### Section 7: Dev Agent Record

```yaml
- id: dev-agent-record
  title: Dev Agent Record
  instruction: This section is populated by the development agent during implementation
  owner: dev-agent
  editors: [dev-agent]
```

**Ownership**:
- **Owner**: dev-agent - **Only Dev Agent creates this**
- **Editors**: [dev-agent] - **Exclusive** - Only Dev can edit

**Design Insight**: This section belongs entirely to Dev Agent—SM and QA cannot modify. Dev Agent has complete autonomy over implementation notes.

---

**Sub-section: Agent Model Used**

```yaml
- id: agent-model
  title: Agent Model Used
  template: "{{agent_model_name_version}}"
  instruction: Record the specific AI agent model and version used for development
  owner: dev-agent
  editors: [dev-agent]
```

**Purpose**: Traceability of which AI model implemented the story.

**Example**: `claude-sonnet-4-20250514` or `gpt-4-turbo-2024-04-09`

**Design Insight**: Important for debugging and quality analysis—know which model generated which code.

---

**Sub-section: Debug Log References**

```yaml
- id: debug-log-references
  title: Debug Log References
  instruction: Reference any debug logs or traces generated during development
  owner: dev-agent
  editors: [dev-agent]
```

**Purpose**: Link to external logs for troubleshooting.

**Example**: "See debug trace in `.bmad-logs/story-1.2-debug.log`"

---

**Sub-section: Completion Notes**

```yaml
- id: completion-notes
  title: Completion Notes List
  instruction: Notes about the completion of tasks and any issues encountered
  owner: dev-agent
  editors: [dev-agent]
```

**Purpose**: Dev Agent documents implementation decisions, challenges, and resolutions.

**Example**:
```markdown
- Implemented user authentication using JWT tokens
- Encountered CORS issue with API—resolved by configuring express cors middleware
- Added additional validation for email format beyond AC requirements to prevent XSS
- All tests passing, code coverage 95%
```

**Design Insight**: Completion notes provide context for QA and future developers.

---

**Sub-section: File List**

```yaml
- id: file-list
  title: File List
  instruction: List all files created, modified, or affected during story implementation
  owner: dev-agent
  editors: [dev-agent]
```

**Purpose**: Track code changes for this story.

**Example**:
```markdown
**Created**:
- src/auth/login.ts
- src/auth/__tests__/login.test.ts

**Modified**:
- src/app.ts (added auth routes)
- src/middleware/index.ts (added auth middleware)

**Affected**:
- package.json (added jsonwebtoken dependency)
```

**Design Insight**: File list enables impact analysis and helps QA know what to review.

---

#### Section 8: QA Results

```yaml
- id: qa-results
  title: QA Results
  instruction: Results from QA Agent QA review of the completed story implementation
  owner: qa-agent
  editors: [qa-agent]
```

**Ownership**:
- **Owner**: qa-agent - **Only QA Agent creates this**
- **Editors**: [qa-agent] - **Exclusive** - Only QA can edit

**Content** (populated by QA Agent during review-story task):
- Requirements traceability results
- Test execution results
- Risk assessment
- NFR validation
- Gate decision (PASS/CONCERNS/FAIL/WAIVED)
- Issues found and required fixes

**Design Insight**: QA results section belongs entirely to QA Agent—Dev cannot modify. Maintains independence of quality review.

---

### Section Ownership Summary Table

| Section | Owner | Editors | Access Level | Can Dev Edit? | Can QA Edit? |
|---------|-------|---------|--------------|---------------|--------------|
| Status | scrum-master | [scrum-master, dev-agent] | Collaborative | ✅ Yes | ❌ No |
| Story | scrum-master | [scrum-master] | Exclusive | ❌ No | ❌ No |
| Acceptance Criteria | scrum-master | [scrum-master] | Exclusive | ❌ No | ❌ No |
| Tasks / Subtasks | scrum-master | [scrum-master, dev-agent] | Collaborative | ✅ Yes | ❌ No |
| Dev Notes | scrum-master | [scrum-master] | Exclusive | ❌ No | ❌ No |
| Testing Standards | scrum-master | [scrum-master] | Exclusive | ❌ No | ❌ No |
| Change Log | scrum-master | [scrum-master, dev-agent, qa-agent] | Multi-agent | ✅ Yes | ✅ Yes |
| Dev Agent Record | dev-agent | [dev-agent] | Exclusive | ✅ Yes | ❌ No |
| QA Results | qa-agent | [qa-agent] | Exclusive | ❌ No | ✅ Yes |

**Key Patterns**:
- **Exclusive Sections** (1 agent): Story, AC, Dev Notes, Testing, Dev Agent Record, QA Results
- **Collaborative Sections** (2 agents): Status, Tasks/Subtasks
- **Multi-agent Sections** (3+ agents): Change Log

---

### Data Flow & Dependencies

**Input Dependencies**:
- (Required) PRD epic/story definitions
- (Required) Architecture documents (for Dev Notes extraction)
- (Optional) Previous story in epic (for relevant notes)

**Output Artifact**:
- docs/stories/{epic}.{story}.{title}.md - Individual story document

**Downstream Consumers**:
- Dev Agent (James) - Implements story
- QA Agent (Quinn) - Reviews implementation
- PO Agent (Sarah) - Validates story (optional)

**Workflow Integration**:
- Created by: create-next-story.md task (SM Agent)
- Used by: execute-checklist.md task with story-dod-checklist (Dev Agent)
- Reviewed by: review-story.md task (QA Agent)
- Validated by: validate-next-story.md task (PO Agent, optional)

---

### Template Variables & Interpolation

**Story Identification**:
- `{{epic_num}}` - Epic number (e.g., "1", "2")
- `{{story_num}}` - Story number within epic (e.g., "1", "2")
- `{{story_title_short}}` - URL-friendly story title slug (e.g., "user-authentication")

**Story Content**:
- `{{role}}` - User role in story ("As a...")
- `{{action}}` - User action in story ("I want...")
- `{{benefit}}` - User benefit in story ("so that...")

**Dev Agent Record**:
- `{{agent_model_name_version}}` - AI model used for implementation

---

### ADK Translation Considerations for Story Template

**1. Section Permission Enforcement**
- Firestore security rules enforce owner/editors permissions
- API validates agent identity before allowing edits
- UI shows/hides sections based on current agent

**Example Firestore Security Rule**:
```javascript
match /projects/{project}/stories/{story} {
  allow read: if true; // All agents can read

  allow update: if request.auth.uid != null && (
    // Status: SM or Dev can edit
    (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status']) &&
     request.auth.token.agent in ['scrum-master', 'dev-agent']) ||

    // Story & AC: Only SM can edit
    (request.resource.data.diff(resource.data).affectedKeys().hasAny(['story', 'acceptanceCriteria']) &&
     request.auth.token.agent == 'scrum-master') ||

    // Tasks: SM or Dev can edit
    (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['tasks']) &&
     request.auth.token.agent in ['scrum-master', 'dev-agent']) ||

    // Dev Agent Record: Only Dev can edit
    (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['devAgentRecord']) &&
     request.auth.token.agent == 'dev-agent') ||

    // QA Results: Only QA can edit
    (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['qaResults']) &&
     request.auth.token.agent == 'qa-agent') ||

    // Change Log: SM, Dev, QA can edit
    (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['changeLog']) &&
     request.auth.token.agent in ['scrum-master', 'dev-agent', 'qa-agent'])
  );
}
```

**2. Story Status Lifecycle Management**
- Workflow engine enforces state transitions
- Only valid transitions allowed (Draft → Approved → InProgress → Review → Done)
- Notifications on status changes

**3. Context Extraction for Dev Notes**
- Cloud Function extracts relevant architecture sections
- Uses semantic search to find related content
- SM Agent reviews and curates extractions
- Ensures Dev Agent has complete context without reading full docs

**4. File List Tracking**
- Git integration tracks files changed during story implementation
- Auto-populate file list from git diff
- Link files to story in Firestore

**5. AI Model Traceability**
- Record model version in Dev Agent Record
- Analytics dashboard shows which models implemented which stories
- Quality correlation analysis (model vs. bug rate)

**6. Change Log Automation**
- Auto-add change log entry when sections modified
- Include agent identity, timestamp, change description
- Prevent manual tampering with audit trail

**7. Multi-agent Collaboration UI**
- Show which sections current agent can edit
- Lock/unlock indicators on sections
- Real-time collaboration (multiple agents in same story)
- Conflict prevention through permissions

---

## Template 2: Project Brief Template

### Template Identity

```yaml
template:
  id: project-brief-template-v2
  name: Project Brief
  version: 2.0
  output:
    format: markdown
    filename: docs/brief.md
    title: "Project Brief: {{project_name}}"
```

**Key Characteristics**:
- **Lines**: 223
- **Owner**: Analyst Agent (Mary)
- **Mode**: Interactive with advanced-elicitation AND custom elicitation actions
- **Purpose**: Establish project foundation—problem, solution, scope, goals
- **Output**: Single markdown file at docs/brief.md

---

### Purpose & Role

The Project Brief is the **foundational document** for all BMad projects:
- **First document created** in greenfield projects
- **Input to PRD** - Informs requirements gathering
- **Scope definition** - Establishes MVP boundaries
- **Problem validation** - Ensures team understands "why"

**BMad Methodology Principle**: "Start with Why" - Brief defines problem before solution is designed.

---

### Workflow Configuration

```yaml
workflow:
  mode: interactive
  elicitation: advanced-elicitation
  custom_elicitation:
    title: "Project Brief Elicitation Actions"
    options:
      - "Expand section with more specific details"
      - "Validate against similar successful products"
      - "Stress test assumptions with edge cases"
      - "Explore alternative solution approaches"
      - "Analyze resource/constraint trade-offs"
      - "Generate risk mitigation strategies"
      - "Challenge scope from MVP minimalist view"
      - "Brainstorm creative feature possibilities"
      - "If only we had [resource/capability/time]..."
      - "Proceed to next section"
```

**Unique Feature**: Custom elicitation actions

**Standard Elicitation** (advanced-elicitation):
- Agent asks questions to gather information
- User provides answers
- Agent confirms understanding

**Custom Elicitation Actions** (project-brief specific):
- User can request specific types of analysis
- Agent performs requested action
- Examples:
  - "Validate against similar successful products" - Agent researches comparable projects
  - "Challenge scope from MVP minimalist view" - Agent questions what's truly essential
  - "If only we had [resource/capability/time]..." - Exploratory "what if" analysis

**Design Insight**: Custom actions enable flexible, creative exploration during brief creation—not just rigid question-answer.

---

### Section Structure

#### Section 0: Introduction (Meta-section)

**Instruction** (for agent):
> "This template guides creation of a comprehensive Project Brief that serves as the foundational input for product development.
>
> Start by asking the user which mode they prefer:
> 1. **Interactive Mode** - Work through each section collaboratively
> 2. **YOLO Mode** - Generate complete draft for review and refinement
>
> Before beginning, understand what inputs are available (brainstorming results, market research, competitive analysis, initial ideas) and gather project context."

**Two Modes**:
1. **Interactive Mode** - Standard section-by-section elicitation
2. **YOLO Mode** - Agent generates complete draft based on minimal input, user refines

**Design Insight**: YOLO mode accelerates brief creation when user has clear vision—agent drafts entire brief for review rather than asking 50+ questions.

---

#### Section 1: Executive Summary

**Purpose**: Concise overview capturing project essence.

**Instruction** (key points):
- Product concept in 1-2 sentences
- Primary problem being solved
- Target market identification
- Key value proposition

**Template**: `"{{executive_summary_content}}"`

**Example**:
"TaskMaster is an AI-powered task management application that helps remote teams coordinate work across time zones. It solves the problem of async communication breakdown by intelligently routing tasks to available team members based on timezone, workload, and skill set. Targeting distributed engineering teams of 10-50 people, TaskMaster reduces coordination overhead by 40% compared to traditional project management tools."

---

#### Section 2: Problem Statement

**Purpose**: Articulate the problem with clarity and evidence.

**Instruction** (key points):
- Current state and pain points
- Impact of the problem (quantify if possible)
- Why existing solutions fall short
- Urgency and importance of solving this now

**Template**: `"{{detailed_problem_description}}"`

**Design Insight**: Template emphasizes quantification ("reduce by 40%") and urgency ("why now")—prevents vague problem statements.

---

#### Section 3: Proposed Solution

**Purpose**: Describe solution approach at high level.

**Instruction** (key points):
- Core concept and approach
- Key differentiators from existing solutions
- Why this solution will succeed where others haven't
- High-level vision for the product

**Template**: `"{{solution_description}}"`

**Design Insight**: Focus on "what" and "why", not "how"—technical implementation comes later in architecture phase.

---

#### Section 4: Target Users

**Purpose**: Define intended users with specificity.

**Structure**: Repeatable sections for primary and secondary user segments.

**Sub-section: Primary User Segment**

**Title Pattern**: "Primary User Segment: {{segment_name}}"

**Instruction** (for each segment):
- Demographic/firmographic profile
- Current behaviors and workflows
- Specific needs and pain points
- Goals they're trying to achieve

**Template**: `"{{primary_user_description}}"`

**Example**:
"**Primary User Segment: Remote Engineering Manager**

Demographics: Engineering managers at tech companies with distributed teams of 10-50 developers across multiple time zones. Typically have 5-10 years of management experience.

Current Behaviors: Uses Jira for task tracking, Slack for communication, and manual spreadsheets for workload balancing. Spends 10+ hours per week on task assignment and coordination.

Pain Points: Difficulty knowing team availability across time zones. Tasks assigned to unavailable developers sit idle. No visibility into actual workload vs. capacity. Context switching between multiple tools.

Goals: Reduce time spent on task coordination. Ensure even workload distribution. Maximize team velocity. Improve async communication."

---

**Sub-section: Secondary User Segment** (conditional)

**Condition**: "Has secondary user segment"

Similar structure to primary segment.

**Design Insight**: Template supports multiple user segments but focuses on primary—prevents trying to be everything to everyone.

---

#### Section 5: Goals & Success Metrics

**Purpose**: Establish clear objectives and how to measure success.

**Instruction**: "Make goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound)"

**Sub-sections**:

1. **Business Objectives** (bullet-list)
   - Template: `"- {{objective_with_metric}}"`
   - Examples:
     - "Acquire 100 paying customers within 6 months of launch"
     - "Achieve $50K MRR by end of Year 1"
     - "Maintain 90%+ customer retention rate"

2. **User Success Metrics** (bullet-list)
   - Template: `"- {{user_metric}}"`
   - Examples:
     - "Users reduce coordination time by 40%"
     - "95% of tasks assigned within user's working hours"
     - "Team velocity increases by 25%"

3. **Key Performance Indicators (KPIs)** (bullet-list)
   - Template: `"- {{kpi}}: {{definition_and_target}}"`
   - Examples:
     - "Daily Active Users (DAU): Target 80% of total users"
     - "Time to Task Assignment: Target < 2 hours"
     - "Net Promoter Score (NPS): Target 50+"

**Design Insight**: Three categories (Business, User, KPIs) ensure balanced metrics—not just revenue, not just usage, but holistic success.

---

#### Section 6: MVP Scope

**Purpose**: Define minimum viable product clearly.

**Instruction**: "Be specific about what's in and what's out. Help user distinguish must-haves from nice-to-haves."

**Sub-sections**:

1. **Core Features (Must Have)** (bullet-list)
   - Template: `"- **{{feature}}:** {{description_and_rationale}}"`
   - Examples:
     - "**Task Creation:** Simple form to create tasks with title, description, priority. Essential for basic workflow."
     - "**Auto-Assignment:** AI-powered assignment based on timezone and availability. Core differentiator."
     - "**Team Dashboard:** Real-time view of team workload and availability. Critical for managers."

2. **Out of Scope for MVP** (bullet-list)
   - Template: `"- {{feature_or_capability}}"`
   - Examples:
     - "Advanced reporting and analytics"
     - "Integration with GitHub/GitLab"
     - "Mobile native apps (web-first)"
     - "Multi-language support (English only for MVP)"

3. **MVP Success Criteria**
   - Template: `"{{mvp_success_definition}}"`
   - Example: "MVP is successful if 20 engineering managers adopt the tool, use it daily for 30 days, and report 30%+ time savings on coordination tasks."

**Design Insight**: Explicit "Out of Scope" section prevents feature creep—forces hard decisions about what's truly essential.

---

#### Section 7: Post-MVP Vision

**Purpose**: Outline longer-term product direction without overcommitting.

**Instruction**: "Outline the longer-term product direction without overcommitting to specifics"

**Sub-sections**:

1. **Phase 2 Features**
   - Template: `"{{next_priority_features}}"`
   - Near-term features after MVP

2. **Long-term Vision**
   - Template: `"{{one_two_year_vision}}"`
   - 1-2 year product vision

3. **Expansion Opportunities**
   - Template: `"{{potential_expansions}}"`
   - Possible future directions

**Design Insight**: Vision section provides direction without locking in commitments—keeps options open.

---

#### Section 8: Technical Considerations

**Purpose**: Document known technical constraints and preferences.

**Instruction**: "Note these are initial thoughts, not final decisions."

**Sub-sections**:

1. **Platform Requirements**
   - Template:
     ```markdown
     - **Target Platforms:** {{platforms}}
     - **Browser/OS Support:** {{specific_requirements}}
     - **Performance Requirements:** {{performance_specs}}
     ```

2. **Technology Preferences**
   - Template:
     ```markdown
     - **Frontend:** {{frontend_preferences}}
     - **Backend:** {{backend_preferences}}
     - **Database:** {{database_preferences}}
     - **Hosting/Infrastructure:** {{infrastructure_preferences}}
     ```

3. **Architecture Considerations**
   - Template:
     ```markdown
     - **Repository Structure:** {{repo_thoughts}}
     - **Service Architecture:** {{service_thoughts}}
     - **Integration Requirements:** {{integration_needs}}
     - **Security/Compliance:** {{security_requirements}}
     ```

**Design Insight**: Technical considerations at brief stage are preferences, not decisions—Architect makes final calls during architecture phase.

---

#### Section 9: Constraints & Assumptions

**Purpose**: Clearly state limitations and assumptions to set realistic expectations.

**Sub-sections**:

1. **Constraints**
   - Template:
     ```markdown
     - **Budget:** {{budget_info}}
     - **Timeline:** {{timeline_info}}
     - **Resources:** {{resource_info}}
     - **Technical:** {{technical_constraints}}
     ```

2. **Key Assumptions** (bullet-list)
   - Template: `"- {{assumption}}"`
   - Examples:
     - "Users have reliable internet connectivity"
     - "Target users are comfortable with SaaS tools"
     - "Team will grow to 3 developers by Month 3"

**Design Insight**: Explicit constraints prevent unrealistic expectations—"6-month timeline" shapes scope decisions.

---

#### Section 10: Risks & Open Questions

**Purpose**: Identify unknowns and potential challenges proactively.

**Sub-sections**:

1. **Key Risks** (bullet-list)
   - Template: `"- **{{risk}}:** {{description_and_impact}}"`
   - Examples:
     - "**Market Risk:** Competitors (Asana, Monday.com) may add similar features before launch. High impact if occurs."
     - "**Technical Risk:** AI assignment algorithm may not provide sufficient accuracy initially. Moderate impact, can fall back to manual."

2. **Open Questions** (bullet-list)
   - Template: `"- {{question}}"`
   - Examples:
     - "What is willingness to pay for this solution?"
     - "Do users trust AI to assign their tasks?"
     - "What integrations are absolutely necessary for adoption?"

3. **Areas Needing Further Research** (bullet-list)
   - Template: `"- {{research_topic}}"`
   - Examples:
     - "User research on task assignment preferences"
     - "Competitive analysis of AI-powered PM tools"
     - "Technical feasibility of real-time availability tracking"

**Design Insight**: Risks and questions documented up-front—prevents surprises later. Research areas guide next steps.

---

#### Section 11: Appendices (Conditional)

**Purpose**: Reference supporting research and inputs.

**Sub-sections**:

1. **Research Summary** (conditional: "Has research findings")
   - Summarize key findings from:
     - Market research
     - Competitive analysis
     - User interviews
     - Technical feasibility studies

2. **Stakeholder Input** (conditional: "Has stakeholder feedback")
   - Template: `"{{stakeholder_feedback}}"`

3. **References**
   - Template: `"{{relevant_links_and_docs}}"`
   - Links to external resources

**Design Insight**: Appendices keep brief concise while providing traceability to supporting materials.

---

#### Section 12: Next Steps

**Purpose**: Guide transition to PRD phase.

**Sub-sections**:

1. **Immediate Actions** (numbered-list)
   - Template: `"{{action_item}}"`
   - Examples:
     1. "Validate problem with 10 potential users"
     2. "Create competitive analysis document"
     3. "Draft initial MVP feature priorities"
     4. "Schedule PRD kickoff with PM"

2. **PM Handoff**
   - Fixed content:
     > "This Project Brief provides the full context for {{project_name}}. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements."

**Design Insight**: PM Handoff section includes explicit instructions for PM Agent—ensures smooth transition.

---

### Data Flow & Dependencies

**Input Dependencies**:
- (Optional) brainstorming-session-results.md - Ideation output
- (Optional) Market research documents
- (Optional) Competitive analysis documents
- (Optional) User interview notes
- User's vision and initial ideas

**Output Artifact**:
- docs/brief.md - Complete project brief

**Downstream Consumers**:
- PM Agent (John) - Creates PRD based on brief
- Analyst Agent (Mary) - May conduct additional research based on open questions
- All agents - Reference brief for project context

**Workflow Integration**:
- Created by: create-doc.md task (Analyst Agent)
- May follow: facilitate-brainstorming-session.md task
- Informs: PRD creation by PM Agent

---

### Template Variables & Interpolation

**Project Variables**:
- `{{project_name}}` - Project identifier

**Content Variables** (extensive—40+ variables):
- `{{executive_summary_content}}` - Summary paragraph
- `{{detailed_problem_description}}` - Problem statement
- `{{solution_description}}` - Solution approach
- `{{segment_name}}` - User segment name
- `{{primary_user_description}}` - Primary user details
- `{{secondary_user_description}}` - Secondary user details
- `{{objective_with_metric}}` - Business objective
- `{{user_metric}}` - User success metric
- `{{kpi}}`, `{{definition_and_target}}` - KPI details
- `{{feature}}`, `{{description_and_rationale}}` - Feature details
- `{{feature_or_capability}}` - Out-of-scope item
- `{{mvp_success_definition}}` - MVP success criteria
- `{{next_priority_features}}` - Phase 2 features
- `{{one_two_year_vision}}` - Long-term vision
- `{{potential_expansions}}` - Expansion opportunities
- `{{platforms}}` - Target platforms
- `{{specific_requirements}}` - Browser/OS support
- `{{performance_specs}}` - Performance requirements
- `{{frontend_preferences}}` - Frontend tech preferences
- `{{backend_preferences}}` - Backend tech preferences
- `{{database_preferences}}` - Database preferences
- `{{infrastructure_preferences}}` - Hosting preferences
- `{{repo_thoughts}}` - Repository structure thoughts
- `{{service_thoughts}}` - Service architecture thoughts
- `{{integration_needs}}` - Integration requirements
- `{{security_requirements}}` - Security/compliance needs
- `{{budget_info}}` - Budget constraints
- `{{timeline_info}}` - Timeline constraints
- `{{resource_info}}` - Resource constraints
- `{{technical_constraints}}` - Technical limitations
- `{{assumption}}` - Key assumption
- `{{risk}}`, `{{description_and_impact}}` - Risk details
- `{{question}}` - Open question
- `{{research_topic}}` - Research area
- `{{stakeholder_feedback}}` - Stakeholder input
- `{{relevant_links_and_docs}}` - References
- `{{action_item}}` - Next step action

---

### ADK Translation Considerations for Project Brief Template

**1. YOLO Mode Implementation**
- Agent generates complete draft from minimal input
- Uses GPT-4 or Claude Opus for high-quality generation
- User reviews and refines draft iteratively
- Much faster than section-by-section elicitation

**2. Custom Elicitation Actions**
- Action menu presented to user at each section
- Each action triggers specialized agent behavior
- Examples:
  - "Validate against similar products" → Web search + analysis
  - "Challenge scope" → Critical analysis of must-haves
  - "Brainstorm features" → Creative ideation session

**3. Research Integration**
- Link to market research documents
- Competitive analysis integration
- User interview summaries
- Auto-populate from research outputs

**4. MVP Scope Decision Support**
- Feature prioritization matrix (impact vs. effort)
- MVP size calculator (estimate timeline)
- Scope validation against constraints

**5. Risk Assessment Tool**
- Risk matrix (likelihood × impact)
- Mitigation strategy templates
- Risk monitoring dashboard

**6. Brief → PRD Transition**
- Auto-populate PRD sections from brief
- Mapping: Brief goals → PRD requirements
- Reduce redundant elicitation

**7. Stakeholder Collaboration**
- Multi-stakeholder review workflow
- Comment threads on sections
- Approval tracking

---

### Key Insights: Story & Project Brief Templates

**Story Template Insights**:

1. **Section Ownership Model Is Game-Changer**
   - Enables safe multi-agent collaboration
   - Prevents conflicts and overwrites
   - Clear responsibility boundaries
   - Critical for agent-based development

2. **SM as Context Curator**
   - Dev Notes section extracts relevant architecture
   - Dev Agent shouldn't need to read full architecture
   - Context window optimization for AI agents
   - Quality of curation impacts implementation quality

3. **Three-Agent Collaboration**
   - SM creates and owns requirements
   - Dev implements and owns dev record
   - QA reviews and owns QA results
   - Clean separation of concerns

4. **Immutable Requirements**
   - Story and AC cannot be changed by Dev during implementation
   - Prevents requirement drift
   - Changes require SM update and re-approval
   - Enforces agile discipline

5. **Traceability Throughout**
   - Status lifecycle tracked
   - File changes tracked
   - AI model version tracked
   - Complete audit trail

**Project Brief Template Insights**:

1. **Foundation for Everything**
   - First document in greenfield projects
   - Informs all subsequent documents (PRD, architecture)
   - Establishes "why" before "what" and "how"

2. **YOLO Mode Innovation**
   - Alternative to lengthy elicitation
   - Agent generates draft for refinement
   - Much faster when user has clear vision
   - Still maintains quality through review

3. **Custom Elicitation Actions**
   - Flexible interaction beyond questions
   - Enables creative exploration
   - "What if" scenarios
   - Validation against similar products

4. **MVP Scope Discipline**
   - Explicit "Out of Scope" section
   - Forces hard decisions
   - Prevents feature creep
   - Defines MVP success criteria

5. **Risk Identification Up-Front**
   - Risks, open questions, research areas documented
   - Prevents surprises later
   - Guides research and validation activities

6. **Seamless PM Handoff**
   - Explicit handoff instructions
   - Brief informs PRD creation
   - Reduces redundant elicitation

---

**End of Section 4**

[← Back to Section 3: Frontend Spec](core-planning-templates-section3.md) | [→ Continue to Section 5: Brainstorming Template](core-planning-templates-section5.md)
