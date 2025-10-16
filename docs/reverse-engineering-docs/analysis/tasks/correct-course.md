# Task Analysis: correct-course

**Task ID**: `correct-course`
**Task File**: `.bmad-core/tasks/correct-course.md`
**Primary Agents**: PO (Sarah), PM (John), Architect (Winston), SM (Bob)
**Task Type**: Complex Change Management Workflow (5 Steps)
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: High (Requires multi-artifact analysis, impact assessment, stakeholder collaboration, cross-agent coordination)

---

## 1. Purpose & Scope

### Primary Purpose
Guide a structured response to significant change triggers using the `.bmad-core/checklists/change-checklist`. This task systematically analyzes change impacts on epics, project artifacts, and MVP scope, explores solution paths, drafts actionable proposed updates, and produces a consolidated "Sprint Change Proposal" for user review and approval.

### Scope Definition

**In Scope**:
- Analyzing change triggers and their root causes
- Assessing impacts on epic structure and story flow
- Evaluating artifact conflicts across PRD, architecture, frontend specs, etc.
- Exploring solution paths (adjust, rollback, re-scope)
- Drafting specific proposed edits to affected artifacts
- Generating consolidated "Sprint Change Proposal" documents
- Determining handoff paths for fundamental replanning needs
- Interactive or batch processing modes
- User approval and next-steps coordination

**Out of Scope**:
- Implementing the approved changes directly (handoff to appropriate agents)
- Minor adjustments within a story (not "significant" changes)
- Technical implementation of fixes (Dev agent's responsibility)
- Fundamental replanning without user approval (requires PM/Architect engagement)
- Architectural deep-dives (Architect agent's responsibility)
- New PRD creation (PM agent's responsibility)

### Key Characteristics
- **Checklist-driven structure** - 6-section change-checklist guides systematic analysis
- **Dual interaction modes** - Incremental (section-by-section) or YOLO (batched analysis)
- **Impact-first approach** - Understand ripple effects before proposing solutions
- **Multi-artifact awareness** - Analyzes PRD, architecture, frontend specs, stories, epics
- **Collaborative decision-making** - User involvement in path selection and approval
- **Clear handoff protocols** - Determines if changes require specialist agent engagement
- **Actionable deliverables** - Produces specific proposed edits, not just analysis

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - change_trigger: string                  # Story ID, issue description, or pivot explanation
  - change_description: string              # User's initial explanation of issue and perceived impact
  - project_artifacts: collection           # Access to all project documentation

artifacts_required:
  - prd: 'docs/project/prd/*.md'           # Product Requirements Document
  - epics: 'docs/project/epics/*.md'       # Epic and story definitions
  - architecture: 'docs/project/architecture/*.md'  # System architecture
  - frontend_spec: 'docs/project/frontend/*.md'     # UI/UX specifications (if applicable)
  - story_history: 'docs/project/stories/*.md'      # Completed and in-progress stories

checklist_dependency:
  - checklist: '.bmad-core/checklists/change-checklist.md'  # Core analysis framework

configuration:
  - core_config: 'core-config.yaml'        # Project configuration (paths, settings)
```

**Input Details**:
- **change_trigger**: The specific story, feature, technical issue, or business requirement that prompted the course correction
  - Examples: "Story 3.2 revealed incorrect auth assumption", "Client requests scope change", "Technology X is not viable"
- **change_description**: User's narrative explaining what went wrong, why, and what they believe the impact is
- **project_artifacts**: Full access to all planning and development artifacts
  - PRD (Product Requirements Document)
  - Epic and story definitions
  - Architecture documents (system design, data models, tech stack)
  - Frontend specifications (if applicable)
  - Completed story history (for rollback analysis)
- **change-checklist**: The structured framework that guides the analysis process (6 sections)
- **core-config.yaml**: Configuration file providing file paths and project settings

### Optional Inputs

```yaml
optional:
  - interaction_mode: 'incremental' | 'yolo'  # Default: incremental
  - affected_epic: string                     # Epic ID if known
  - severity: 'minor' | 'moderate' | 'major'  # Estimated severity (refined during analysis)
  - deployment_scripts: 'deploy/*'            # Infrastructure-as-Code (if impacted)
  - monitoring_config: 'monitoring/*'         # Monitoring setup (if impacted)
```

### Configuration Dependencies

From `core-config.yaml`:
- PRD file path(s) or directory
- Epic/story directory paths
- Architecture document path(s)
- Frontend specification path (if applicable)
- Project structure configuration

### Interaction Mode Selection

**Incremental Mode (Default & Recommended)**:
- Section-by-section progression through change-checklist
- Collaborative discussion of findings after each section
- Iterative drafting and refinement of proposed changes
- **Best for**: Complex changes, high-impact scenarios, learning contexts

**YOLO Mode (Batch Processing)**:
- Complete checklist analysis in one pass
- Present consolidated findings and proposed changes
- Broader review of combined proposals
- **Best for**: Simpler changes, time-constrained scenarios, experienced teams

---

## 3. Execution Flow

The `correct-course` task follows a structured 5-step workflow guided by the change-checklist's 6 sections.

### Step 1: Initial Setup & Mode Selection

**Actions**:
1. **Acknowledge Task & Inputs**:
   - Confirm "Correct Course Task (Change Navigation & Integration)" initiation
   - Verify change trigger and user's initial explanation
   - Confirm access to all relevant project artifacts
   - Confirm access to `.bmad-core/checklists/change-checklist.md`

2. **Establish Interaction Mode**:
   - Present mode options to user:
     - **Incremental Mode**: Section-by-section, collaborative, detailed refinement
     - **YOLO Mode**: Batched analysis, faster initial assessment, broader review
   - Obtain user's mode preference
   - Confirm selected mode
   - Set expectations: "We will now use the change-checklist to analyze the change and draft proposed updates."

**LLM Guidance (from checklist)**:
- Changes are inevitable; handling determines success or failure
- This process is for SIGNIFICANT changes affecting project direction
- Minor adjustments within a story don't require this process
- Goal: Minimize wasted work while adapting to new realities
- User buy-in is critical

**Outputs**:
- Confirmed interaction mode
- User aligned on process expectations
- All required artifacts accessible

**Decision Points**:
- Mode selection (incremental vs YOLO) affects subsequent interaction patterns
- If artifacts are missing or inaccessible, escalate to user before proceeding

---

### Step 2: Execute Checklist Analysis (Sections 1-4)

This step systematically works through the core analysis sections of the change-checklist. The interaction style varies based on the selected mode.

#### Section 1: Understand the Trigger & Context

**Purpose**: Fully understand what went wrong and why before jumping to solutions.

**Checklist Items**:
1. **Identify Triggering Story**: Clearly identify the story (or stories) that revealed the issue
2. **Define the Issue**: Articulate the core problem precisely
   - Technical limitation/dead-end?
   - Newly discovered requirement?
   - Fundamental misunderstanding of existing requirements?
   - Necessary pivot based on feedback/new information?
   - Failed/abandoned story needing new approach?
3. **Assess Initial Impact**: Describe immediate observed consequences
   - Blocked progress
   - Incorrect functionality
   - Non-viable technology
4. **Gather Evidence**: Note logs, error messages, user feedback, or analysis supporting the issue definition

**LLM Guidance**:
- Ask probing questions: What exactly happened? Is this symptomatic of a larger problem? Could this have been anticipated? What assumptions were incorrect?
- Be specific and factual, not blame-oriented
- Don't jump to solutions yet

**Interaction Pattern**:
- **Incremental Mode**: Present each item, discuss findings, record status (`[x]`, `[N/A]`, `[!]`)
- **YOLO Mode**: Analyze all items, record findings, present summary

**Outputs**:
- Clear problem statement
- Categorized issue type
- Evidence documentation
- Initial impact assessment

---

#### Section 2: Epic Impact Assessment

**Purpose**: Systematically evaluate ripple effects through project structure.

**Checklist Items**:

**2A. Analyze Current Epic**:
1. Can the current epic containing the trigger story still be completed?
2. Does the current epic need modification (story changes, additions, removals)?
3. Should the current epic be abandoned or fundamentally redefined?

**2B. Analyze Future Epics**:
1. Review all remaining planned epics
2. Does the issue require changes to planned stories in future epics?
3. Does the issue invalidate any future epics?
4. Does the issue necessitate the creation of entirely new epics?
5. Should the order/priority of future epics be changed?

**2C. Summarize Epic Impact**:
- Document overall effect on project's epic structure and flow

**LLM Guidance**:
- Think about both immediate and downstream effects
- Can we salvage the current epic with modifications?
- Do future epics still make sense given this change?
- Are we creating or eliminating dependencies?
- Does the epic sequence need reordering?

**Analysis Activities**:
- Read current epic file
- Read all planned future epic files
- Map dependencies between epics
- Identify stories that become invalid, blocked, or require changes

**Outputs**:
- Current epic status (completable, needs modification, abandon)
- Future epic impact list (affected epics with specific changes needed)
- Epic sequence adjustments (reordering, additions, removals)
- Dependency impact summary

---

#### Section 3: Artifact Conflict & Impact Analysis

**Purpose**: Documentation drives development in BMad. Check each artifact for conflicts and required updates.

**Checklist Items**:

**3A. Review PRD**:
1. Does the issue conflict with core goals or requirements stated in the PRD?
2. Does the PRD need clarification or updates based on new understanding?

**3B. Review Architecture Document**:
1. Does the issue conflict with documented architecture (components, patterns, tech choices)?
2. Are specific components/diagrams/sections impacted?
3. Does the technology list need updating?
4. Do data models or schemas need revision?
5. Are external API integrations affected?

**3C. Review Frontend Spec (if applicable)**:
1. Does the issue conflict with FE architecture, component library choice, or UI/UX design?
2. Are specific FE components or user flows impacted?

**3D. Review Other Artifacts (if applicable)**:
- Deployment scripts, IaC, monitoring setup, etc.

**3E. Summarize Artifact Impact**:
- List all artifacts requiring updates and nature of changes needed

**LLM Guidance**:
- Documentation drives development in BMad
- Does this change invalidate documented decisions?
- Are architectural assumptions still valid?
- Do user flows need rethinking?
- Are technical constraints different than documented?
- Be thorough - missed conflicts cause future problems

**Analysis Activities**:
- Read and analyze PRD for requirement conflicts
- Read and analyze architecture documents for design conflicts
- Read and analyze frontend specs for UI/UX conflicts
- Identify specific sections, diagrams, or components requiring updates
- Map cross-artifact dependencies

**Outputs**:
- Artifact conflict list (artifact → sections → conflicts)
- Required update specifications (artifact → sections → nature of change)
- Cross-artifact dependency impacts

---

#### Section 4: Path Forward Evaluation

**Purpose**: Present options clearly with pros/cons and guide selection of the most viable path.

**Checklist Items**:

**4A. Option 1: Direct Adjustment / Integration**:
1. Can the issue be addressed by modifying/adding future stories within existing plan?
2. Define scope and nature of these adjustments
3. Assess feasibility, effort, and risks of this path

**4B. Option 2: Potential Rollback**:
1. Would reverting completed stories significantly simplify addressing the issue?
2. Identify specific stories/commits to consider for rollback
3. Assess effort required for rollback
4. Assess impact of rollback (lost work, data implications)
5. Compare net benefit/cost vs Direct Adjustment

**4C. Option 3: PRD MVP Review & Potential Re-scoping**:
1. Is the original PRD MVP still achievable given the issue and constraints?
2. Does the MVP scope need reduction (removing features/epics)?
3. Do the core MVP goals need modification?
4. Are alternative approaches needed to meet the original MVP intent?
5. **Extreme Case**: Does the issue necessitate a fundamental replan or new PRD V2 (PM handoff)?

**4D. Select Recommended Path**:
- Based on evaluation, agree on the most viable path forward

**LLM Guidance**:
- Present options clearly with pros/cons
- For each path, consider:
  1. What's the effort required?
  2. What work gets thrown away?
  3. What risks are we taking?
  4. How does this affect timeline?
  5. Is this sustainable long-term?
- Be honest about trade-offs - there's rarely a perfect solution

**Analysis Activities**:
- Model each path option with concrete steps
- Estimate effort for each path (story points, time)
- Identify risks and mitigation strategies for each path
- Calculate "sunk cost" (work thrown away) for each path
- Assess timeline impact for each path
- Discuss pros/cons with user

**Outputs**:
- Path option analysis (3 options with effort, risks, pros/cons)
- Recommended path with rationale
- User agreement on selected path

---

### Step 3: Draft Proposed Changes (Iteratively or Batched)

**Actions**:
Based on the completed checklist analysis (Sections 1-4) and the agreed "Recommended Path Forward", draft specific proposed changes for each affected artifact.

**Exclusion**: Scenarios requiring fundamental replans necessitate immediate handoff to PM/Architect (not drafted here).

**Change Drafting Process**:

1. **Identify Affected Artifacts**: From Section 3 analysis, list specific artifacts requiring updates
   - Specific epics (by ID)
   - Specific user stories (by ID)
   - PRD sections (by heading)
   - Architecture document components (by section, diagram)
   - Frontend spec sections (by component, flow)

2. **Draft Explicit Proposed Changes**: For each artifact, provide clear, actionable edits
   - **User Story Changes**:
     - Revising story text, acceptance criteria, or priority
     - Example: "Change Story 2.3 Acceptance Criterion 2 from: [old text] To: [new text]"
   - **Epic Changes**:
     - Adding, removing, reordering, or splitting user stories within epics
     - Example: "Remove Story 3.5 from Epic 3, add new Story 3.6: [story definition]"
   - **Architecture Changes**:
     - Modified architecture diagram snippets (Mermaid diagram blocks or textual descriptions)
     - Updated technology lists, configuration details
     - Example: "Update Section 4.2 'Authentication Flow' diagram to replace OAuth provider X with provider Y [Mermaid diagram]"
   - **PRD Changes**:
     - Updated requirements, goals, or constraints
     - Example: "Update Section 2.3 'Core Features' to remove Feature X and replace with Feature Y: [new text]"
   - **Frontend Spec Changes**:
     - Modified component specifications or user flows
     - Example: "Update LoginForm component spec to use new auth provider API (Section 5.1)"
   - **New Supporting Artifacts** (if necessary):
     - Brief addendums for specific decisions
     - Example: "Create new document 'Auth Provider Migration Decision' explaining rationale for change"

3. **Interaction by Mode**:
   - **Incremental Mode**: Discuss and refine these proposed edits for each artifact (or small group) as drafted
   - **YOLO Mode**: Compile all drafted edits for presentation in Step 4

**Outputs**:
- Artifact-specific proposed edits (detailed, actionable, explicit)
- Supporting rationale for each change
- Cross-reference map (how changes affect related artifacts)

**Quality Criteria**:
- Edits must be specific and actionable (not vague suggestions)
- Include "before" and "after" for modifications
- Provide complete text for additions
- Clearly identify removals
- Include visual aids for diagram changes

---

### Step 4: Generate "Sprint Change Proposal" with Edits

**Actions**:
Synthesize the complete change-checklist analysis and all agreed-upon proposed edits into a single document titled "Sprint Change Proposal". This aligns with Section 5 of the change-checklist.

**Sprint Change Proposal Structure**:

```markdown
# Sprint Change Proposal: [Issue Title]

**Date**: [YYYY-MM-DD]
**Change Trigger**: [Story ID or issue description]
**Recommended Path**: [Option 1/2/3 from Section 4]
**Status**: Draft / Approved

---

## 1. Executive Summary

[2-3 paragraph overview of the issue, its impact, and the proposed solution]

---

## 2. Issue Analysis

### 2.1 Identified Issue
[Clear, concise problem statement from Section 1]

### 2.2 Root Cause
[What assumptions were incorrect or what changed]

### 2.3 Evidence
[Logs, errors, user feedback, analysis supporting the issue]

---

## 3. Impact Assessment

### 3.1 Epic Impact
[Summary from Section 2]
- **Current Epic**: [Status and required changes]
- **Future Epics**: [List of affected epics with impacts]
- **Epic Sequence**: [Any reordering or priority changes]

### 3.2 Artifact Impact
[Summary from Section 3]
- **PRD**: [Conflicts and required updates]
- **Architecture**: [Conflicts and required updates]
- **Frontend Spec**: [Conflicts and required updates]
- **Other**: [Any additional artifact impacts]

### 3.3 MVP Scope Impact
[Changes to scope/goals from Section 4]

---

## 4. Path Forward Analysis

### 4.1 Options Evaluated
[Summary of Options 1-3 with pros/cons]

### 4.2 Recommended Path
[Selected option with detailed rationale]

### 4.3 Risks and Mitigation
[Key risks of chosen path and mitigation strategies]

---

## 5. Proposed Changes

[For each affected artifact, provide specific edits]

### 5.1 Epic Changes
**Epic [X]**: [Epic Name]
- **Change 1**: [Specific change with before/after]
- **Change 2**: [Specific change with before/after]

### 5.2 Story Changes
**Story [X.Y]**: [Story Name]
- **Change 1**: [Specific change with before/after]
- **Change 2**: [Specific change with before/after]

### 5.3 PRD Updates
**Section [X.Y]**: [Section Name]
- **Change**: [Specific change with before/after or new text]

### 5.4 Architecture Updates
**Section [X.Y]**: [Section Name]
- **Change**: [Specific change with before/after or diagram]

### 5.5 Frontend Spec Updates
**Component [X]**: [Component Name]
- **Change**: [Specific change with before/after]

---

## 6. Implementation Plan

### 6.1 High-Level Action Plan
[Next steps for implementing changes]

1. [Step 1]
2. [Step 2]
3. [Step 3]

### 6.2 Agent Handoff Plan
[Identify roles needed and handoff sequence]

- **PM**: [Specific tasks if needed]
- **Architect**: [Specific tasks if needed]
- **UX Expert**: [Specific tasks if needed]
- **PO**: [Specific tasks if needed]
- **SM**: [Specific tasks if needed]

### 6.3 Validation Criteria
[How we'll know the change worked]

---

## 7. Approval

- [ ] User has reviewed and approved this proposal
- [ ] All stakeholders notified
- [ ] Next steps confirmed
- [ ] Handoffs scheduled

**Approved By**: [Name]
**Date**: [YYYY-MM-DD]

---
```

**Presentation & Refinement**:
1. Present complete draft of "Sprint Change Proposal" to user
2. Solicit final review and feedback
3. Incorporate any final adjustments requested by user
4. Obtain explicit approval (not implicit)

**Outputs**:
- Finalized "Sprint Change Proposal" document (markdown format)
- User approval confirmation

---

### Step 5: Finalize & Determine Next Steps (Section 6)

**Actions**:

1. **Obtain Explicit User Approval**:
   - Confirm user has reviewed and approved the "Sprint Change Proposal"
   - Confirm approval includes all specific edits documented within it
   - Document approval (user name, date)

2. **Provide Finalized Document**:
   - Deliver the finalized "Sprint Change Proposal" document to user
   - Save to project documentation location (if specified)

3. **Determine Next Steps Based on Nature of Approved Changes**:

**Case A: Changes Can Be Implemented Directly or Organized by PO/SM**:
- **Condition**: Approved edits are sufficient and don't require fundamental replanning
- **Actions**:
  - State that "Correct Course Task" is complete regarding analysis and change proposal
  - User can proceed with implementing or logging these changes
  - Suggest handoff to PO/SM agent for backlog organization if appropriate
  - Example handoff: "PO/SM should prioritize these story changes and update epic sequencing"

**Case B: Changes Require Fundamental Replan**:
- **Condition**: Analysis and proposed path (Sections 4 and 6) indicate need for more fundamental replan
- **Triggers**:
  - Significant scope change affecting MVP definition
  - Major architectural rework required
  - Multiple epics invalidated or requiring redesign
  - Core requirements or goals changed
- **Actions**:
  - Clearly state this conclusion
  - Advise user that next step involves engaging primary PM or Architect agents
  - Use "Sprint Change Proposal" as critical input and context for deeper replanning effort
  - Example handoff: "PM should review this proposal and revise PRD sections 2.3, 3.1, and 4.2 accordingly"

4. **Final Review & Handoff Checklist** (Section 6 of change-checklist):
   - [ ] Review Checklist: Confirm all relevant items were discussed
   - [ ] Review Sprint Change Proposal: Ensure it accurately reflects discussion and decisions
   - [ ] User Approval: Obtain explicit user approval for the proposal
   - [ ] Confirm Next Steps: Reiterate handoff plan and next actions by specific agents

**LLM Guidance (from Section 6)**:
- Changes require coordination
- Before concluding:
  1. Is the user fully aligned with the plan?
  2. Do all stakeholders understand the impacts?
  3. Are handoffs to other agents clear?
  4. Is there a rollback plan if the change fails?
  5. How will we validate the change worked?
- Get explicit approval - implicit agreement causes problems
- Provide concise final report:
  - What changed and why
  - What we're doing about it
  - Who needs to do what
  - When we'll know if it worked
- Keep it action-oriented and forward-looking

**Outputs**:
- Explicit user approval documented
- Finalized "Sprint Change Proposal" delivered
- Next steps determined (direct implementation or fundamental replan)
- Handoff plan to appropriate agents (PO/SM for implementation, PM/Architect for fundamental replan)
- Validation criteria established

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Interaction Mode Selection (Step 1)

**Location**: Initial Setup & Mode Selection

**Question**: Should we use Incremental or YOLO mode?

**Branch A: Incremental Mode (Default & Recommended)**:
- **Trigger**: User selects incremental mode OR default (no explicit choice)
- **Implications**:
  - Work through checklist section-by-section
  - Discuss findings after each section
  - Collaborative drafting and refinement of proposed changes
  - More time-intensive but higher quality
- **Best for**: Complex changes, high-impact scenarios, learning contexts

**Branch B: YOLO Mode (Batch Processing)**:
- **Trigger**: User explicitly selects YOLO mode
- **Implications**:
  - Complete entire checklist analysis in one pass
  - Present consolidated findings and proposed changes
  - Broader review of combined proposals
  - Faster but requires more extensive review
- **Best for**: Simpler changes, time-constrained scenarios, experienced teams

**Impact**: Affects interaction pattern throughout Steps 2-3

---

### Decision Point 2: Issue Type Categorization (Section 1)

**Location**: Step 2 → Section 1: Understand the Trigger & Context

**Question**: What type of issue triggered this course correction?

**Branch A: Technical Limitation/Dead-End**:
- **Indicators**: Technology doesn't work as expected, performance issues, incompatibilities
- **Analysis Focus**: Architecture document conflicts, technology list updates, alternative tech evaluation
- **Likely Path**: Option 1 (Adjust) or Option 3 (Re-scope) if tech change is major

**Branch B: Newly Discovered Requirement**:
- **Indicators**: User feedback, stakeholder request, market research reveals gap
- **Analysis Focus**: PRD conflicts, epic additions, story modifications
- **Likely Path**: Option 1 (Adjust) with new stories/epics

**Branch C: Fundamental Misunderstanding of Existing Requirements**:
- **Indicators**: Existing PRD requirement was misinterpreted, story implementation is wrong direction
- **Analysis Focus**: Story history review, PRD clarification needs, architecture alignment
- **Likely Path**: Option 2 (Rollback) if significant work is off-track

**Branch D: Necessary Pivot Based on Feedback/New Information**:
- **Indicators**: Business direction change, competitor analysis, user testing results
- **Analysis Focus**: MVP scope impact, PRD goals, epic priority reordering
- **Likely Path**: Option 3 (Re-scope) likely, possibly fundamental replan

**Branch E: Failed/Abandoned Story Needing New Approach**:
- **Indicators**: Story blocked, approach not viable, technical debt discovered
- **Analysis Focus**: Story modifications, alternative implementation approaches
- **Likely Path**: Option 1 (Adjust) with story rewrite

**Impact**: Influences which artifacts are analyzed in Section 3 and which path options are most viable in Section 4

---

### Decision Point 3: Current Epic Salvageability (Section 2A)

**Location**: Step 2 → Section 2: Epic Impact Assessment → Analyze Current Epic

**Question**: Can the current epic containing the trigger story still be completed?

**Branch A: Current Epic Completable with Minor Modifications**:
- **Indicators**: 1-2 stories need changes, core epic goal intact
- **Actions**: Draft story modifications in Step 3
- **Impact**: Minimal disruption, continue with current epic after applying changes

**Branch B: Current Epic Needs Significant Modification**:
- **Indicators**: Multiple stories affected, epic structure needs revision, new stories required
- **Actions**: Draft epic restructuring, story additions/removals/splits in Step 3
- **Impact**: Moderate disruption, epic continues but with revised scope and structure

**Branch C: Current Epic Should Be Abandoned or Fundamentally Redefined**:
- **Indicators**: Epic goal no longer valid, majority of stories affected, foundational assumptions broken
- **Actions**: Recommend fundamental replan in Step 5
- **Impact**: High disruption, likely triggers PM/Architect handoff for epic redesign or abandonment

**Impact**: Determines scale of changes drafted in Step 3 and likelihood of fundamental replan in Step 5

---

### Decision Point 4: Path Forward Selection (Section 4)

**Location**: Step 2 → Section 4: Path Forward Evaluation

**Question**: Which option best addresses the issue with acceptable trade-offs?

**Branch A: Option 1 - Direct Adjustment / Integration**:
- **Indicators**:
  - Issue can be addressed within existing plan structure
  - Moderate effort, low-to-moderate risk
  - Minimal work thrown away
  - Timeline impact acceptable
- **Actions**:
  - Draft story additions/modifications in Step 3
  - Update affected artifacts (PRD clarifications, architecture tweaks)
  - Implement changes within current epic flow
- **Handoff**: PO/SM for backlog organization
- **Typical Scenarios**: Newly discovered requirements, minor tech changes, clarification needs

**Branch B: Option 2 - Potential Rollback**:
- **Indicators**:
  - Significant work went in wrong direction
  - Rollback effort < rework effort
  - Data implications manageable
  - Clear point to revert to
- **Actions**:
  - Identify specific stories/commits to rollback
  - Draft revised stories post-rollback in Step 3
  - Update story history and artifact change logs
- **Handoff**: Dev for rollback execution, then PO/SM for revised stories
- **Typical Scenarios**: Fundamental misunderstandings, failed technical approaches

**Branch C: Option 3 - PRD MVP Review & Potential Re-scoping**:
- **Indicators**:
  - Original MVP not achievable with current resources/timeline/tech
  - Core goals need modification
  - Significant features need removal or alternatives
- **Actions**:
  - Assess MVP scope reduction options
  - Draft PRD goal modifications in Step 3
  - Identify epics/features to defer or remove
- **Handoff**: PM for PRD revision (if moderate), or fundamental replan (if extreme)
- **Typical Scenarios**: Pivots, major tech limitations, business direction changes

**Branch D: Extreme Case - Fundamental Replan / PRD V2**:
- **Indicators**:
  - Issue invalidates core assumptions of entire project
  - MVP definition fundamentally flawed
  - Multiple major artifacts require overhaul
- **Actions**:
  - Document analysis and rationale in Sprint Change Proposal
  - Recommend immediate PM/Architect engagement
  - Use proposal as input for replanning
- **Handoff**: PM for new PRD, Architect for new architecture (if tech-driven change)
- **Typical Scenarios**: Complete pivots, critical tech unavailability, project cancellation evaluation

**Impact**: Determines content of Sprint Change Proposal, scale of proposed changes, and handoff path in Step 5

---

### Decision Point 5: Handoff Determination (Step 5)

**Location**: Finalize & Determine Next Steps

**Question**: Can the changes be implemented directly, or do they require fundamental replanning?

**Branch A: Direct Implementation / PO-SM Organization**:
- **Condition**: Approved edits are sufficient, no fundamental replanning needed
- **Triggers**:
  - Path Option 1 (Adjust) selected
  - Path Option 2 (Rollback) with clear recovery path
  - Path Option 3 (Re-scope) with moderate scope adjustments
- **Actions**:
  - State "Correct Course Task" complete
  - User proceeds with implementing changes
  - Handoff to PO/SM for backlog organization
- **Next Agent**: PO (Sarah) or SM (Bob)

**Branch B: Fundamental Replan Required**:
- **Condition**: Changes require deeper replanning by specialist agents
- **Triggers**:
  - Path Option 3 (Re-scope) with extreme case
  - Fundamental replan recommendation from Section 4
  - Multiple epics invalidated
  - Core PRD goals or architecture changed
- **Actions**:
  - Clearly state replan conclusion
  - Advise user to engage PM or Architect agents
  - Provide Sprint Change Proposal as input for replanning
- **Next Agent**: PM (John) for PRD revisions, Architect (Winston) for architecture overhauls, or both

**Impact**: Determines project continuation path and which specialist agents engage next

---

## 5. User Interaction Points

The `correct-course` task is highly interactive and collaborative, with frequent user touchpoints throughout the workflow.

### Interaction Point 1: Task Initiation (Step 1)

**When**: Initial Setup & Mode Selection

**User Input Required**:
- Confirmation of change trigger
- Initial explanation of issue and perceived impact
- Confirmation of artifact access
- Selection of interaction mode (Incremental or YOLO)

**Purpose**:
- Align on process and expectations
- Establish collaboration mode
- Ensure user understands the structured approach

**Agent Actions**:
- Acknowledge task and inputs
- Explain mode options with recommendations
- Confirm selected mode
- Set expectations for checklist-guided analysis

---

### Interaction Point 2: Section 1 - Issue Definition (Step 2)

**When**: Understand the Trigger & Context

**User Input Required**:
- Clarification of triggering story/issue
- Precise articulation of core problem
- Issue type categorization confirmation
- Evidence provision (logs, errors, feedback)

**Purpose**:
- Achieve shared understanding of the problem
- Avoid jumping to solutions prematurely
- Establish factual, non-blame-oriented foundation

**Agent Actions**:
- Ask probing questions (what, why, could it have been anticipated, what assumptions)
- Present checklist items
- Record findings and status
- Discuss initial impact

**Interaction Style**:
- **Incremental Mode**: Discuss each item as completed
- **YOLO Mode**: Gather all info, then present summary

---

### Interaction Point 3: Section 2 - Epic Impact Discussion (Step 2)

**When**: Epic Impact Assessment

**User Input Required**:
- Current epic salvageability judgment
- Future epic priority input
- Epic sequence preferences
- New epic necessity confirmation

**Purpose**:
- Collaboratively assess project structure impacts
- Align on epic-level changes
- Identify downstream ripple effects

**Agent Actions**:
- Present analysis of current and future epics
- Discuss both immediate and downstream effects
- Record epic impact findings
- Propose epic structure adjustments

**Interaction Style**:
- **Incremental Mode**: Discuss current epic, then future epics separately
- **YOLO Mode**: Present full epic impact analysis together

---

### Interaction Point 4: Section 3 - Artifact Conflict Review (Step 2)

**When**: Artifact Conflict & Impact Analysis

**User Input Required**:
- Confirmation of artifact conflicts
- Priority of artifact updates
- Technical constraint clarifications
- Design intent clarifications

**Purpose**:
- Ensure all documentation conflicts are identified
- Understand which artifacts are most critical
- Clarify ambiguities in existing documentation

**Agent Actions**:
- Present artifact-by-artifact analysis (PRD, Architecture, Frontend Spec, Other)
- Identify specific sections/components impacted
- Discuss nature of conflicts
- Record required updates

**Interaction Style**:
- **Incremental Mode**: Review each artifact type (PRD, then Architecture, then Frontend, etc.)
- **YOLO Mode**: Present consolidated artifact impact list

---

### Interaction Point 5: Section 4 - Path Selection (Step 2)

**When**: Path Forward Evaluation

**User Input Required**:
- Preferences on path options
- Trade-off priorities (time vs quality, scope vs timeline)
- Risk tolerance
- Selection of recommended path

**Purpose**:
- Collaboratively evaluate solution paths
- Make informed decision on path forward
- Align on acceptable trade-offs

**Agent Actions**:
- Present 3 path options (Adjust, Rollback, Re-scope)
- Provide pros/cons for each with effort, risks, timeline impact
- Discuss trade-offs honestly
- Recommend path with rationale
- Obtain user agreement on selected path

**Interaction Style**:
- **Incremental Mode**: Discuss each option separately, then compare
- **YOLO Mode**: Present all options together, then discuss and select

---

### Interaction Point 6: Proposed Changes Review (Step 3)

**When**: Draft Proposed Changes

**User Input Required**:
- Feedback on drafted edits
- Refinement requests
- Additional change identification
- Approval of proposed changes

**Purpose**:
- Ensure proposed edits are accurate and complete
- Refine language and specificity
- Catch any missed artifacts or changes

**Agent Actions**:
- Draft specific proposed edits for each affected artifact
- Present edits clearly (before/after format)
- Solicit feedback
- Refine based on user input

**Interaction Style**:
- **Incremental Mode**: Discuss and refine edits for each artifact (or small group) as drafted
- **YOLO Mode**: Present all drafted edits, then review and refine together

---

### Interaction Point 7: Sprint Change Proposal Review (Step 4)

**When**: Generate "Sprint Change Proposal" with Edits

**User Input Required**:
- Review of complete proposal document
- Feedback on clarity and completeness
- Adjustments or additions
- Final approval

**Purpose**:
- Ensure proposal accurately reflects all discussions and decisions
- Obtain user buy-in on the consolidated document
- Prepare for handoff or implementation

**Agent Actions**:
- Present complete draft of Sprint Change Proposal
- Solicit final review and feedback
- Incorporate final adjustments
- Obtain explicit approval

**Interaction Style**:
- Same for both modes (full document review)

---

### Interaction Point 8: Next Steps Confirmation (Step 5)

**When**: Finalize & Determine Next Steps

**User Input Required**:
- Explicit approval confirmation
- Agreement on next steps
- Handoff confirmation (which agents, when)
- Validation criteria agreement

**Purpose**:
- Ensure user fully aligned with plan
- Confirm handoffs and next actions
- Establish validation criteria

**Agent Actions**:
- Obtain explicit user approval
- Provide finalized document
- Determine next steps based on nature of changes
- Reiterate handoff plan and next actions
- Confirm validation criteria

**Interaction Style**:
- Same for both modes (final approval and handoff)

---

## 6. Output Specifications

### Primary Output: Sprint Change Proposal Document

**Format**: Markdown (`.md`)

**Location**: Project documentation directory (configurable, typically `docs/project/change-proposals/`)

**Filename Pattern**: `sprint-change-proposal-{trigger-story-id}-{date}.md`
- Example: `sprint-change-proposal-3.2-2025-10-14.md`

**Content Structure**: (See detailed structure in Step 4 of Execution Flow)

**Sections**:
1. **Executive Summary** (2-3 paragraphs)
2. **Issue Analysis** (problem statement, root cause, evidence)
3. **Impact Assessment** (epic impact, artifact impact, MVP scope impact)
4. **Path Forward Analysis** (options evaluated, recommended path, risks and mitigation)
5. **Proposed Changes** (specific edits for each affected artifact)
6. **Implementation Plan** (action plan, agent handoff plan, validation criteria)
7. **Approval** (approval checklist, approved by, date)

**Quality Standards**:
- Clear, concise language
- Specific, actionable proposed edits (not vague suggestions)
- Before/after format for modifications
- Complete text for additions
- Visual aids for diagram changes (Mermaid blocks or clear textual descriptions)
- Cross-references to source artifacts
- Explicit approval documentation

---

### Implicit Output: Annotated Change-Checklist

**Format**: Markdown (`.md`) with checklist items marked

**Content**: Record of checklist completion reflecting discussions, findings, and decisions

**Structure**:
- [ ] Items not addressed or not applicable: `[N/A]`
- [x] Items completed and confirmed: `[x]`
- [!] Items requiring further action: `[!] Further Action Needed`
- Notes and decisions for each item

**Purpose**:
- Audit trail of analysis process
- Reference for future similar changes
- Quality assurance of completeness

**Optional**: May be embedded in Sprint Change Proposal as appendix or saved separately

---

### Supporting Outputs (Conditional)

**Epic Modifications** (if applicable):
- Updated epic files with story additions/removals/reordering
- Location: Epic directory (e.g., `docs/project/epics/`)
- Agent responsible for implementation: PO (Sarah) or SM (Bob) post-approval

**Story Modifications** (if applicable):
- Updated story files with revised text, acceptance criteria, priority
- Location: Story directory (e.g., `docs/project/stories/`)
- Agent responsible for implementation: SM (Bob) or Dev (James) post-approval

**PRD Updates** (if applicable):
- Updated PRD sections with clarifications or goal modifications
- Location: PRD file (e.g., `docs/project/prd/prd.md` or sharded PRD directory)
- Agent responsible for implementation: PM (John) post-approval

**Architecture Updates** (if applicable):
- Updated architecture document sections or diagrams
- Location: Architecture directory (e.g., `docs/project/architecture/`)
- Agent responsible for implementation: Architect (Winston) post-approval

**Frontend Spec Updates** (if applicable):
- Updated frontend specification sections or component specs
- Location: Frontend spec directory (e.g., `docs/project/frontend/`)
- Agent responsible for implementation: UX Expert (Sally) post-approval

**Note**: The `correct-course` task produces the *proposal* for these updates. Implementation is handed off to the appropriate specialist agents post-approval.

---

## 7. Error Handling & Validation

### Validation Rules

**1. Input Validation**:
- **Change Trigger Required**: Must have a specific story ID, issue, or pivot description
- **Change Description Required**: User must provide initial explanation
- **Artifact Access**: Must confirm access to PRD, epics, architecture, stories before proceeding
- **Checklist Access**: Must confirm access to `.bmad-core/checklists/change-checklist.md`

**Error Handling**:
- If trigger or description missing: Prompt user for required information before proceeding
- If artifacts inaccessible: Escalate to user, request file paths or configuration updates
- If checklist missing: Escalate to user, cannot proceed without analysis framework

---

**2. Checklist Completeness Validation**:
- **All Relevant Items Addressed**: Sections 1-4 of checklist must be completed (items marked `[x]`, `[N/A]`, or `[!]`)
- **Path Forward Selected**: Must have explicit path selection from Section 4 (Option 1, 2, 3, or extreme case)
- **User Agreement**: Must have user agreement on selected path before proceeding to Step 3

**Error Handling**:
- If items skipped without justification: Prompt user to address or mark as `[N/A]` with rationale
- If no path selected: Prompt user to select path after discussing options
- If user disagrees with recommendation: Re-evaluate options and adjust recommendation

---

**3. Proposed Changes Validation**:
- **Specificity**: Edits must be specific and actionable (not vague like "improve section X")
- **Completeness**: All artifacts identified in Section 3 must have corresponding proposed edits (or explicit decision not to change)
- **Clarity**: Before/after format for modifications, complete text for additions, clear descriptions for diagram changes

**Error Handling**:
- If edits are vague: Prompt for more specific language and details
- If artifacts missing proposed edits: Confirm with user if intentional or draft additional edits
- If unclear edits: Request clarification or examples

---

**4. Sprint Change Proposal Validation**:
- **Structure Complete**: All 7 sections present (Executive Summary, Issue Analysis, Impact Assessment, Path Forward, Proposed Changes, Implementation Plan, Approval)
- **Cross-References Valid**: References to artifacts, sections, stories are accurate
- **Approval Checklist**: Approval section must have checklist for user to confirm

**Error Handling**:
- If sections missing: Generate missing sections before presenting to user
- If cross-references broken: Verify artifact paths and update references
- If approval section missing: Add approval checklist before final presentation

---

**5. Approval Validation**:
- **Explicit Approval Required**: User must explicitly confirm approval (not implicit)
- **All Stakeholders Notified**: If multiple stakeholders, confirm all have been informed
- **Next Steps Confirmed**: Handoff plan and next actions must be agreed upon

**Error Handling**:
- If approval not explicit: Prompt user for explicit confirmation ("Do you approve this Sprint Change Proposal?")
- If stakeholders not notified: Remind user to notify stakeholders before finalizing
- If next steps unclear: Clarify handoff plan and get user agreement

---

### Error Scenarios

**Error Scenario 1: Insufficient Change Context**
- **Trigger**: User provides vague change description or insufficient detail
- **Symptoms**: Unable to categorize issue type in Section 1, unclear impacts
- **Handling**:
  - Pause analysis
  - Ask probing questions from Section 1 LLM guidance
  - Request evidence (logs, errors, feedback)
  - Do not proceed until sufficient context obtained

---

**Error Scenario 2: Artifact Conflicts Not Resolvable**
- **Trigger**: Multiple artifacts have fundamental conflicts that can't be reconciled
- **Symptoms**: Path options all have unacceptable trade-offs
- **Handling**:
  - Flag as extreme case in Section 4
  - Recommend fundamental replan (Path Option 3 extreme case)
  - Engage PM and Architect for deeper evaluation
  - Sprint Change Proposal becomes input for replanning, not implementation guide

---

**Error Scenario 3: User Disagrees with Recommended Path**
- **Trigger**: User prefers different path option than agent recommendation
- **Symptoms**: User explicit disagreement during Section 4 interaction
- **Handling**:
  - Respect user's decision (user makes final call)
  - Document user's selected path and rationale in Sprint Change Proposal
  - Proceed with drafting changes for user's selected path
  - Flag any risks or concerns in "Risks and Mitigation" section of proposal

---

**Error Scenario 4: Proposed Changes Too Extensive**
- **Trigger**: Drafting specific edits reveals changes are more extensive than initially assessed
- **Symptoms**: Proposed changes affect majority of epics, large portions of PRD, entire architecture
- **Handling**:
  - Pause drafting
  - Revisit Section 4 Path Forward Evaluation
  - Consider if extreme case (fundamental replan) is more appropriate
  - Discuss with user whether to continue with extensive edits or handoff to PM/Architect
  - If continuing, ensure Sprint Change Proposal clearly flags extent of changes

---

**Error Scenario 5: Missing Specialist Agent Expertise**
- **Trigger**: Change requires deep expertise (e.g., complex architecture redesign, new tech evaluation)
- **Symptoms**: Agent unable to confidently draft specific edits for architecture/frontend/etc.
- **Handling**:
  - Flag in Sprint Change Proposal's "Agent Handoff Plan"
  - Recommend immediate engagement of specialist agent (Architect, UX Expert)
  - Provide high-level guidance in proposal, defer detailed edits to specialist
  - Example: "Architecture Section 4.2 requires revision to replace OAuth provider. Handoff to Architect (Winston) for detailed design."

---

**Error Scenario 6: User Provides Approval Without Full Understanding**
- **Trigger**: User approves quickly without thorough review
- **Symptoms**: Approval seems perfunctory, user hasn't asked clarifying questions
- **Handling**:
  - Prompt user to confirm they've reviewed all sections
  - Ask if any clarifications needed
  - Highlight most impactful changes for explicit confirmation
  - Example: "This proposal includes removing Epic 4 entirely and rolling back Stories 3.2-3.4. Do you confirm approval of these major changes?"

---

### Quality Gates

**Quality Gate 1: Pre-Analysis Gate**
- **Location**: End of Step 1
- **Criteria**:
  - [ ] Change trigger clearly identified
  - [ ] Change description sufficient
  - [ ] All required artifacts accessible
  - [ ] Checklist accessible
  - [ ] Interaction mode selected
- **Action if Failed**: Request missing information/artifacts before proceeding to Step 2

---

**Quality Gate 2: Post-Checklist Analysis Gate**
- **Location**: End of Step 2
- **Criteria**:
  - [ ] All relevant checklist items addressed (Sections 1-4)
  - [ ] Path forward explicitly selected
  - [ ] User agreement on selected path
  - [ ] Issue, impacts, and path documented
- **Action if Failed**: Complete missing checklist sections, obtain path selection and user agreement

---

**Quality Gate 3: Proposed Changes Quality Gate**
- **Location**: End of Step 3
- **Criteria**:
  - [ ] All affected artifacts have proposed edits
  - [ ] Edits are specific and actionable
  - [ ] Before/after format used for modifications
  - [ ] User feedback incorporated
- **Action if Failed**: Draft missing edits, add specificity, refine based on feedback

---

**Quality Gate 4: Sprint Change Proposal Completeness Gate**
- **Location**: End of Step 4
- **Criteria**:
  - [ ] All 7 sections present and complete
  - [ ] Proposed edits clearly documented
  - [ ] Cross-references valid
  - [ ] Approval checklist included
  - [ ] User has reviewed draft
- **Action if Failed**: Complete missing sections, fix references, obtain user review

---

**Quality Gate 5: Approval & Handoff Gate**
- **Location**: End of Step 5
- **Criteria**:
  - [ ] Explicit user approval documented
  - [ ] All stakeholders notified
  - [ ] Next steps and handoffs confirmed
  - [ ] Validation criteria established
- **Action if Failed**: Obtain explicit approval, notify stakeholders, clarify handoffs

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**Dependent Tasks** (tasks that may precede `correct-course`):
- **create-next-story**: Story creation may reveal issues triggering course correction
- **review-story**: QA review may identify fundamental problems requiring course correction
- **apply-qa-fixes**: Attempting fixes may reveal changes are more extensive than initially thought
- **validate-next-story**: PO validation may catch misalignments requiring course correction

**Prerequisite Conditions**:
- Project must be in active development (not initial planning phase)
- At least one epic and story must exist (change context)
- Core planning artifacts must exist (PRD, architecture, epics)

**Downstream Tasks** (tasks that may follow `correct-course`):
- **Case A (Direct Implementation)**:
  - **PO/SM organization**: Updating epic and story backlogs with approved changes
  - **create-next-story**: Creating new stories based on proposed changes
  - **Dev implementation**: Implementing story changes
- **Case B (Fundamental Replan)**:
  - **PM PRD revision**: Updating PRD based on Sprint Change Proposal
  - **Architect architecture overhaul**: Redesigning architecture based on Sprint Change Proposal
  - **UX Expert frontend redesign**: Updating frontend specs based on Sprint Change Proposal
  - **shard-doc**: Re-sharding updated planning documents
  - **create-next-story**: Generating new story flow post-replan

---

### Agent Dependencies

**Primary Agents** (who can execute this task):
- **PO (Sarah)**: Validation & Process Agent - Natural fit for change navigation and artifact cohesion
- **PM (John)**: Product Strategy Agent - Can lead course corrections for product-level changes
- **Architect (Winston)**: System Design Agent - Can lead course corrections for architectural changes
- **SM (Bob)**: Story Creation Agent - Can assist with story-level course corrections

**Specialist Agents** (may be consulted or handed off to):
- **PM (John)**: For PRD revisions, MVP re-scoping, fundamental replans
- **Architect (Winston)**: For architecture redesigns, technology changes, system-level impacts
- **UX Expert (Sally)**: For frontend spec revisions, UI/UX design changes
- **Dev (James)**: For technical feasibility assessments, rollback execution
- **QA (Quinn)**: For impact on testing strategy, quality gate criteria

**Agent Handoff Patterns**:
- **PO → PM**: When changes require PRD revisions or MVP re-scoping
- **PO → Architect**: When changes require architecture redesigns or major tech changes
- **PO → SM**: When changes are confined to story-level adjustments (epic structure intact)
- **PO → Dev**: When rollback of completed stories is needed
- **PM/Architect → PO**: After fundamental replan is complete, return to PO for validation

---

### Data Dependencies

**Configuration Data**:
- **core-config.yaml**: Project-wide configuration
  - PRD file path(s)
  - Epic directory path
  - Story directory path
  - Architecture document path(s)
  - Frontend spec path (if applicable)

**Artifact Data**:
- **PRD**: Product requirements, goals, MVP definition
  - Location: Configured in core-config.yaml
  - Format: Markdown (monolithic or sharded)
- **Epics**: Epic definitions and story lists
  - Location: Configured in core-config.yaml (typically `docs/project/epics/`)
  - Format: Markdown files (one per epic)
- **Stories**: User story definitions, acceptance criteria, tasks
  - Location: Configured in core-config.yaml (typically `docs/project/stories/`)
  - Format: Markdown files with YAML front matter
- **Architecture**: System design, components, technology stack, data models
  - Location: Configured in core-config.yaml
  - Format: Markdown (monolithic or sharded, includes Mermaid diagrams)
- **Frontend Spec**: UI/UX specifications, component library, user flows (if applicable)
  - Location: Configured in core-config.yaml
  - Format: Markdown

**Checklist Data**:
- **change-checklist.md**: Structured framework guiding analysis
  - Location: `.bmad-core/checklists/change-checklist.md`
  - Format: Markdown with checklist items and LLM guidance blocks
  - Sections: 6 (Trigger & Context, Epic Impact, Artifact Conflict, Path Forward, Sprint Change Proposal Components, Final Review & Handoff)

**Story History Data** (for rollback analysis):
- **Completed Stories**: Stories marked as "done" or "in review"
  - Needed for assessing rollback feasibility
  - Location: Story directory with status metadata

---

### Prerequisite Knowledge

**Agent Must Understand**:
- BMad project structure (epics → stories → tasks)
- Artifact ownership and permission model (which agents can edit which artifacts)
- Planning-to-development workflow (how planning artifacts feed story creation)
- Epic sequencing and dependency logic
- Story lifecycle (draft → approved → in progress → review → done)
- Document sharding strategy (v4+ sharded PRDs/architecture)
- Cross-artifact consistency requirements

**Agent Must Have Access To**:
- All project artifacts (PRD, epics, stories, architecture, frontend spec)
- Change-checklist framework
- Core project configuration (core-config.yaml)
- Agent capability model (which agents handle which changes)

---

### External Dependencies

**None**: This task operates entirely within the BMad framework using internal artifacts and checklists.

**Integration Points**:
- File system: Reading and (proposing updates to) markdown and YAML files
- Configuration system: Reading core-config.yaml for paths
- Agent system: Determining handoffs to specialist agents

---

## 9. Integration Points

### Integration with Planning Phase

**PRD Integration**:
- **Reads**: PRD to assess requirement conflicts (Section 3)
- **Proposes Updates**: PRD goal clarifications, requirement modifications, MVP re-scoping (Step 3)
- **Handoff**: PM (John) for implementing PRD updates post-approval

**Epic Integration**:
- **Reads**: All epic files to assess current and future epic impacts (Section 2)
- **Proposes Updates**: Epic structure modifications, story additions/removals, epic reordering (Step 3)
- **Handoff**: PO (Sarah) or SM (Bob) for implementing epic updates post-approval

**Architecture Integration**:
- **Reads**: Architecture documents to assess design conflicts, tech choices (Section 3)
- **Proposes Updates**: Component changes, technology list updates, data model revisions, diagram modifications (Step 3)
- **Handoff**: Architect (Winston) for implementing architecture updates post-approval

**Frontend Spec Integration**:
- **Reads**: Frontend specifications to assess UI/UX conflicts (Section 3)
- **Proposes Updates**: Component spec changes, user flow modifications (Step 3)
- **Handoff**: UX Expert (Sally) for implementing frontend spec updates post-approval

---

### Integration with Development Phase

**Story Integration**:
- **Reads**: Story history (completed and in-progress) for rollback analysis (Section 4)
- **Proposes Updates**: Story text revisions, acceptance criteria changes, story splits/merges (Step 3)
- **Handoff**: SM (Bob) for creating/updating stories post-approval

**Dev Integration**:
- **Rollback Execution**: If Path Option 2 (Rollback) selected, Dev (James) executes story/commit rollbacks
- **Implementation**: Dev implements story changes based on approved Sprint Change Proposal

**QA Integration**:
- **Trigger Source**: QA review results (from `review-story`) may trigger course correction
- **Impact on Testing**: Changes to requirements/architecture may require updated test strategies
- **Quality Gate Adjustments**: Significant changes may reset story quality gates

---

### Integration with Validation & Process

**PO Integration**:
- **Primary Executor**: PO (Sarah) commonly leads the `correct-course` task
- **Validation Role**: PO validates Sprint Change Proposal for artifact cohesion
- **Orchestration**: PO orchestrates handoffs to specialist agents post-approval

**Checklist Integration**:
- **execute-checklist**: The `correct-course` task uses change-checklist similar to how other workflows use checklists
- **Shared Pattern**: Both tasks validate completeness, obtain user approval, guide structured processes

---

### Integration with Agent Handoff System

**Handoff Triggers**:
1. **Direct Implementation Path** → PO/SM:
   - Condition: Changes can be implemented within existing plan
   - Handoff Content: Approved Sprint Change Proposal with specific edits
   - Next Action: PO/SM organize backlog and update artifacts

2. **Fundamental Replan Path** → PM/Architect:
   - Condition: Changes require deeper replanning
   - Handoff Content: Sprint Change Proposal as input for replanning
   - Next Action: PM revises PRD or Architect redesigns architecture

3. **Rollback Execution** → Dev:
   - Condition: Path Option 2 (Rollback) selected
   - Handoff Content: Specific stories/commits to rollback from Sprint Change Proposal
   - Next Action: Dev executes rollback, validates, prepares for revised stories

**Handoff Protocol**:
- Finalized Sprint Change Proposal document provided
- Specific sections/actions for handoff agent highlighted
- Validation criteria established
- User confirms handoff and next steps

---

### Integration with Configuration System

**core-config.yaml**:
- Provides file paths for all artifacts
- Defines project structure
- Specifies agent permissions (indirectly, via documentation ownership)

**Change Impact on Configuration**:
- If course correction changes project structure, core-config.yaml may need updates
- Sprint Change Proposal should flag configuration changes if needed

---

## 10. Configuration References

### Core Configuration (core-config.yaml)

```yaml
# Relevant configuration keys for correct-course task

# PRD Location
prdLocation: "docs/project/prd/prd.md"          # Monolithic PRD
# OR
prdDirectory: "docs/project/prd/"              # Sharded PRD directory

# Epic Location
epicDirectory: "docs/project/epics/"           # Epic files

# Story Location
devStoryLocation: "docs/project/stories/"      # Story files

# Architecture Location
architectureLocation: "docs/project/architecture/architecture.md"  # Monolithic
# OR
architectureDirectory: "docs/project/architecture/"  # Sharded architecture

# Frontend Spec Location (if applicable)
frontendSpecLocation: "docs/project/frontend/frontend-spec.md"
# OR
frontendSpecDirectory: "docs/project/frontend/"

# Change Proposal Output Location (optional, default may be docs/project/)
changeProposalDirectory: "docs/project/change-proposals/"
```

**Usage**:
- **Artifact Reading** (Step 2): Read paths from core-config.yaml to locate PRD, epics, architecture, frontend spec
- **Proposal Output** (Step 4): Use configured directory for saving Sprint Change Proposal (or default location)

---

### Change-Checklist Configuration

**Location**: `.bmad-core/checklists/change-checklist.md`

**Structure**:
- **LLM Guidance Blocks**: `[[LLM: ...]]` provide agent instructions and considerations
- **Checklist Items**: Markdown checkbox items (`- [ ]`) guide systematic analysis
- **6 Sections**:
  1. Understand the Trigger & Context
  2. Epic Impact Assessment
  3. Artifact Conflict & Impact Analysis
  4. Path Forward Evaluation
  5. Sprint Change Proposal Components
  6. Final Review & Handoff

**Customization**:
- Organizations may customize change-checklist for their specific needs
- Additional checklist items can be added
- LLM guidance can be tailored to organizational context

---

### Agent Permission Model (Implicit Configuration)

**Artifact Ownership** (defined in agent specifications and templates):
- **PRD**: PM (John) - owner and primary editor
- **Architecture**: Architect (Winston) - owner and primary editor
- **Frontend Spec**: UX Expert (Sally) - owner and primary editor
- **Epics**: SM (Bob) - primary creator, PO (Sarah) - validator
- **Stories**: SM (Bob) - creator, Dev (James) - Dev Agent Record editor, QA (Quinn) - QA Results editor

**`correct-course` Permission Model**:
- Can **propose** updates to any artifact (Sprint Change Proposal documents proposals, not direct edits)
- Cannot directly edit specialist artifacts (PRD, architecture, frontend spec)
- Handoff to specialist agents for implementing proposed changes post-approval

---

## 11. Performance Characteristics

### Time Complexity

**Incremental Mode**:
- **Step 1 (Setup)**: 2-5 minutes (mode selection, alignment)
- **Step 2 (Checklist Analysis)**:
  - Section 1 (Trigger & Context): 5-10 minutes
  - Section 2 (Epic Impact): 10-20 minutes (depends on number of epics)
  - Section 3 (Artifact Conflict): 15-30 minutes (depends on artifact complexity)
  - Section 4 (Path Forward): 10-20 minutes
  - **Total Step 2**: 40-80 minutes
- **Step 3 (Draft Proposed Changes)**: 20-60 minutes (depends on number of affected artifacts)
- **Step 4 (Generate Proposal)**: 10-20 minutes
- **Step 5 (Finalize & Next Steps)**: 5-10 minutes
- **Total Time (Incremental)**: 77-175 minutes (1.3-2.9 hours)

**YOLO Mode**:
- **Step 1 (Setup)**: 2-5 minutes
- **Step 2 (Checklist Analysis)**: 30-60 minutes (batched analysis, single presentation)
- **Step 3 (Draft Proposed Changes)**: 20-60 minutes (batched drafting, single review)
- **Step 4 (Generate Proposal)**: 10-20 minutes
- **Step 5 (Finalize & Next Steps)**: 5-10 minutes
- **Total Time (YOLO)**: 67-155 minutes (1.1-2.6 hours)

**Factors Affecting Duration**:
- Complexity of change (minor adjustment vs fundamental replan)
- Number of affected epics and artifacts
- User responsiveness and decision-making speed
- Clarity of change description (more probing needed for vague issues)

---

### Space Complexity

**Artifact Reading**:
- Reads multiple potentially large files (PRD, architecture, epics, stories)
- **Typical Load**: 50-200 KB of markdown content
- **Large Projects**: 500 KB - 2 MB (sharded v4+ architectures, extensive PRDs)

**Context Requirements**:
- Must maintain context across all 6 checklist sections
- Must track findings, decisions, and proposed edits
- **Estimated Context**: 10,000-50,000 tokens (depending on project size)

**Output Size**:
- Sprint Change Proposal document: 2,000-10,000 words (8-40 KB)
- Annotated checklist: 1,000-3,000 words (4-12 KB)

---

### Scalability

**Small Projects** (1-3 epics, 5-15 stories, 20-50 page PRD):
- Fast execution (lower end of time estimates)
- Simpler artifact conflicts
- Fewer handoffs

**Medium Projects** (4-8 epics, 20-50 stories, 50-100 page PRD/architecture):
- Moderate execution time (mid-range estimates)
- More complex artifact conflicts
- Multiple specialist handoffs likely

**Large Projects** (9+ epics, 50+ stories, 100+ page documentation):
- Longer execution time (upper end of estimates)
- Extensive artifact conflicts
- Complex handoff orchestration
- May require multiple Sprint Change Proposals for different aspects

**Sharded vs Monolithic Architecture**:
- **Sharded (v4+)**: Slightly faster artifact reading (targeted section reads)
- **Monolithic (v3)**: Slower artifact reading (full document scans), but simpler cross-referencing

---

### Optimization Strategies

**1. Pre-Analysis Triage** (Before invoking `correct-course`):
- Determine if change is truly "significant" (requires full course correction)
- Minor adjustments should use story-level fixes (not course correction)
- Escalate to `correct-course` only when:
  - Multiple stories affected
  - Epic structure impacted
  - Artifact conflicts identified
  - MVP scope potentially affected

**2. Mode Selection Guidance**:
- Recommend Incremental Mode for:
  - First-time use of course correction
  - High-impact changes (multiple epics, major artifacts)
  - Complex trade-off decisions
- Recommend YOLO Mode for:
  - Experienced teams familiar with process
  - Moderate changes (1-2 epics, limited artifact conflicts)
  - Time-constrained scenarios

**3. Parallel Artifact Reading** (Step 2):
- Read PRD, architecture, epics, stories concurrently where possible
- Build artifact conflict matrix as files are read
- Reduces sequential reading overhead

**4. Template-Based Proposal Generation** (Step 4):
- Use consistent Sprint Change Proposal template
- Populate sections incrementally as analysis progresses
- Reduces synthesis time in Step 4

**5. Handoff Optimization**:
- Clearly delineate handoff boundaries in Sprint Change Proposal
- Provide "action-only" summaries for each specialist agent
- Example: "Architect (Winston): Update Section 4.2 as follows: [specific changes]"

---

## 12. Edge Cases & Limitations

### Edge Case 1: Change Trigger is Not Significant

**Scenario**: User invokes `correct-course` for a minor adjustment that doesn't require full analysis

**Indicators**:
- Single story affected
- No epic or artifact conflicts
- Simple fix or clarification needed

**Handling**:
- Perform abbreviated analysis (Section 1 only)
- Recommend resolving via simpler means:
  - Story-level adjustment (SM creates revised story)
  - Dev Agent Record update (Dev makes targeted fix)
  - Clarification comment (no artifact changes)
- Option: Abort `correct-course` and use simpler task
- If user insists, proceed but flag as "lightweight course correction"

---

### Edge Case 2: Multiple Simultaneous Change Triggers

**Scenario**: Multiple issues discovered simultaneously (e.g., Story 3.2 reveals auth problem AND Story 3.4 reveals data model problem)

**Indicators**:
- User describes multiple distinct issues
- Triggers from different epics or technical areas

**Handling**:
- **Option A (Recommended)**: Run separate `correct-course` sessions for each trigger
  - Allows focused analysis per issue
  - Produces separate Sprint Change Proposals
  - May reveal overlapping impacts (consolidate in final proposals)
- **Option B**: Consolidated analysis
  - More complex checklist execution
  - Risk of conflating distinct issues
  - Single Sprint Change Proposal covering multiple triggers
- Ask user preference, recommend Option A for clarity

---

### Edge Case 3: Change Requires Expertise Outside Agent's Knowledge

**Scenario**: Course correction reveals need for deep technical expertise (e.g., novel architecture pattern, specialized tech stack)

**Indicators**:
- Agent unable to confidently draft proposed architecture changes
- Technical feasibility assessment unclear
- Risk analysis requires specialist knowledge

**Handling**:
- Flag in Sprint Change Proposal's "Agent Handoff Plan"
- Recommend immediate engagement of specialist agent (Architect, external consultant)
- Provide high-level guidance, defer detailed edits to specialist
- Example: "Architecture Section 4 requires migration from Postgres to DynamoDB. Handoff to Architect (Winston) or database specialist for detailed migration plan."
- Do not fabricate technical details beyond agent's confidence

---

### Edge Case 4: User Approval is Conditional

**Scenario**: User approves Sprint Change Proposal with conditions (e.g., "Approved if we can defer Epic 5")

**Indicators**:
- User adds qualifiers to approval
- Conditions affect proposed changes or path forward

**Handling**:
- Treat as not yet fully approved
- Document conditions in Sprint Change Proposal
- Revise proposal to incorporate conditions
- Re-present revised proposal for unconditional approval
- Example: Adjust Implementation Plan to show Epic 5 deferral, update timeline, re-obtain approval

---

### Edge Case 5: Path Forward Options All Have Unacceptable Trade-offs

**Scenario**: Section 4 analysis reveals no viable path (all options too risky, costly, or time-consuming)

**Indicators**:
- Direct Adjustment: Effort too high or timeline unacceptable
- Rollback: Too much work thrown away, data loss unacceptable
- Re-scope: MVP no longer viable, business goals compromised

**Handling**:
- Flag as "Extreme Case - Fundamental Replan or Project Reevaluation"
- Recommend engaging PM and Architect for deeper evaluation
- Sprint Change Proposal documents the dilemma, not a solution
- Possible outcomes:
  - Project pause for deeper replanning
  - External consultation (technical expert, product strategist)
  - MVP redefinition (potentially new PRD)
  - Project cancellation consideration (business decision)
- Escalate to user for executive decision

---

### Edge Case 6: Change Impacts External Dependencies

**Scenario**: Course correction affects integrations with external systems, APIs, or third-party services

**Indicators**:
- Architecture analysis reveals external API changes needed
- Data model changes affect shared databases
- Frontend changes affect external UI frameworks

**Handling**:
- Expand Section 3 (Artifact Conflict) to include external dependencies
- Document external impacts in Sprint Change Proposal
- Flag in "Implementation Plan" as requiring coordination with external teams/vendors
- Adjust timeline estimates to account for external coordination
- Example: "API change requires coordination with Partner System team, estimated 2-week lead time"

---

### Edge Case 7: Proposed Changes Invalidate Completed Stories

**Scenario**: Course correction reveals multiple completed stories (marked "done") are now invalid or need rework

**Indicators**:
- Rollback analysis (Section 4) identifies extensive completed work to revert
- New requirements conflict with delivered functionality

**Handling**:
- Path Option 2 (Rollback) becomes primary consideration
- Assess rollback feasibility carefully:
  - Code rollback effort
  - Data migration or rollback (if data changes committed)
  - Impact on dependent stories
- If rollback too costly, consider:
  - Technical debt acceptance (leave old stories, work around)
  - Incremental migration (gradually refactor over future stories)
- Flag significant rework in Sprint Change Proposal with effort estimates
- User must explicitly approve rollback of completed work

---

### Limitations

**1. Agent Knowledge Boundary**:
- Cannot provide deep technical expertise in specialized areas (database design, advanced algorithms, domain-specific tech)
- Must handoff to specialists for detailed technical designs

**2. Business Decision Authority**:
- Cannot make business decisions (MVP scope, budget, resource allocation)
- Can only present options and impacts; user makes final call

**3. External Coordination**:
- Cannot directly coordinate with external teams, vendors, or stakeholders
- Can only flag need for external coordination in Sprint Change Proposal

**4. Real-Time Validation**:
- Cannot validate proposed changes in real-time (e.g., test if new architecture will work)
- Proposed changes are based on analysis, not implementation and testing

**5. Predictive Accuracy**:
- Effort estimates and risk assessments are educated guesses, not guarantees
- Actual implementation may reveal additional issues

**6. Single-Point-in-Time Analysis**:
- Analyzes project state at time of execution
- If project continues to evolve during course correction, proposal may become stale
- Best to pause active development while course correction is in progress

---

## 13. Testing Strategies

Given that `correct-course` is a meta-process task (guiding change management rather than producing code), testing strategies focus on validation, simulation, and checklist completeness.

### Strategy 1: Checklist Coverage Testing

**Objective**: Ensure all checklist items are addressed systematically

**Approach**:
- **Test Cases**: Create scenarios for each issue type (technical limitation, new requirement, misunderstanding, pivot, failed story)
- **Validation**: For each test case:
  - Verify all relevant Section 1 items marked (`[x]`, `[N/A]`, `[!]`)
  - Verify epic impact analysis (Section 2) identifies affected epics
  - Verify artifact conflict analysis (Section 3) identifies conflicts
  - Verify path options (Section 4) evaluated with pros/cons
  - Verify Sprint Change Proposal includes all required sections

**Pass Criteria**:
- All checklist items addressed
- No skipped items without justification (`[N/A]` with rationale)

---

### Strategy 2: Interaction Mode Validation

**Objective**: Ensure both Incremental and YOLO modes function correctly

**Approach**:
- **Test Case A (Incremental Mode)**: Execute `correct-course` in incremental mode for a moderate change
  - Verify section-by-section interaction
  - Verify user prompted after each section
  - Verify iterative refinement of proposed changes
- **Test Case B (YOLO Mode)**: Execute `correct-course` in YOLO mode for same change
  - Verify batched analysis
  - Verify consolidated presentation
  - Verify broader review workflow

**Pass Criteria**:
- Both modes complete successfully
- Incremental mode shows more interaction points
- YOLO mode shows batched presentation
- Final Sprint Change Proposal quality equivalent in both modes

---

### Strategy 3: Path Forward Decision Testing

**Objective**: Ensure all 3 path options (Adjust, Rollback, Re-scope) are correctly evaluated

**Approach**:
- **Test Case A (Path 1 - Adjust)**: Create scenario where Direct Adjustment is optimal
  - Example: New requirement adds 2 stories to current epic, no artifact conflicts
  - Verify Path 1 recommended, proposed changes drafted
- **Test Case B (Path 2 - Rollback)**: Create scenario where Rollback is optimal
  - Example: Fundamental misunderstanding, 3 completed stories are wrong direction, rollback effort < rework
  - Verify Path 2 recommended, rollback plan drafted
- **Test Case C (Path 3 - Re-scope)**: Create scenario where Re-scoping is optimal
  - Example: Technology limitation invalidates 2 epics, MVP must be reduced
  - Verify Path 3 recommended, MVP adjustments proposed
- **Test Case D (Extreme Case)**: Create scenario requiring fundamental replan
  - Example: Complete pivot, all epics invalid, PRD goals changed
  - Verify extreme case flagged, handoff to PM recommended

**Pass Criteria**:
- Correct path recommended for each scenario
- Pros/cons accurately reflect scenario trade-offs
- Proposed changes align with selected path

---

### Strategy 4: Artifact Impact Analysis Testing

**Objective**: Ensure all affected artifacts are identified and proposed changes are specific

**Approach**:
- **Test Case**: Create change scenario affecting multiple artifacts (PRD, architecture, 2 epics, 3 stories)
- **Validation**:
  - Verify Section 3 identifies all affected artifacts
  - Verify Section 5 of Sprint Change Proposal has specific proposed edits for each artifact
  - Verify edits use before/after format or complete text for additions
  - Verify cross-references are accurate

**Pass Criteria**:
- All affected artifacts identified (no missed artifacts)
- All proposed edits are specific and actionable (not vague)
- Cross-references valid

---

### Strategy 5: Handoff Logic Testing

**Objective**: Ensure correct handoff determination (direct implementation vs fundamental replan)

**Approach**:
- **Test Case A (Direct Implementation)**: Change affects 1-2 epics, moderate artifact updates
  - Verify handoff to PO/SM recommended
  - Verify Sprint Change Proposal includes implementation action plan
- **Test Case B (Fundamental Replan)**: Change invalidates MVP, major PRD/architecture overhaul needed
  - Verify handoff to PM/Architect recommended
  - Verify Sprint Change Proposal positioned as input for replanning

**Pass Criteria**:
- Correct handoff determined based on change scope
- Handoff plan clearly documented in Sprint Change Proposal
- Next steps for handoff agents specified

---

### Strategy 6: Edge Case Handling Testing

**Objective**: Ensure edge cases are handled gracefully

**Approach**:
- **Test Edge Case 1**: Invoke `correct-course` for trivial change
  - Verify recommendation to use simpler means
- **Test Edge Case 2**: Multiple simultaneous triggers
  - Verify recommendation for separate or consolidated analysis
- **Test Edge Case 3**: Requires specialist expertise
  - Verify handoff flag in Sprint Change Proposal
- **Test Edge Case 4**: Conditional approval
  - Verify proposal revision and re-approval workflow
- **Test Edge Case 5**: No viable path
  - Verify extreme case flag and escalation recommendation

**Pass Criteria**:
- Each edge case handled appropriately
- No errors or undefined behavior
- User guided to correct resolution

---

### Strategy 7: Sprint Change Proposal Quality Testing

**Objective**: Ensure Sprint Change Proposal is complete, clear, and actionable

**Approach**:
- **Test Case**: Execute full `correct-course` workflow
- **Quality Checks**:
  - [ ] All 7 sections present (Executive Summary, Issue Analysis, Impact Assessment, Path Forward, Proposed Changes, Implementation Plan, Approval)
  - [ ] Executive Summary is concise (2-3 paragraphs)
  - [ ] Issue Analysis includes root cause and evidence
  - [ ] Impact Assessment covers epics, artifacts, MVP
  - [ ] Path Forward includes evaluated options and rationale
  - [ ] Proposed Changes are specific with before/after format
  - [ ] Implementation Plan has action steps and handoff plan
  - [ ] Approval section has checklist for user confirmation
  - [ ] Cross-references are valid
  - [ ] Language is clear and actionable

**Pass Criteria**:
- All quality checks pass
- Proposal is ready for user review and approval without ambiguities

---

### Strategy 8: Incremental vs YOLO Mode Equivalence Testing

**Objective**: Ensure both modes produce equivalent quality outcomes

**Approach**:
- **Test Case**: Execute `correct-course` for same change scenario in both modes
- **Comparison**:
  - Compare final Sprint Change Proposals
  - Verify same artifacts identified as affected
  - Verify same path forward selected
  - Verify equivalent proposed changes (may differ in wording, but same intent)
  - Verify equivalent handoff determination

**Pass Criteria**:
- Both modes produce equivalent Sprint Change Proposals
- Quality is not compromised in YOLO mode (faster but still thorough)

---

## 14. Security Considerations

The `correct-course` task does not directly handle sensitive data (credentials, PII, etc.), but security considerations exist around artifact access, approval authority, and change impact.

### Security Consideration 1: Artifact Access Control

**Risk**: Unauthorized access to sensitive project artifacts (proprietary PRD, confidential architecture)

**Mitigation**:
- Ensure `correct-course` task respects project-level access controls
- If BMad framework integrated with access control system, verify user has read permissions for all artifacts before proceeding
- Example: "Confirm user has access to PRD, architecture, epics before executing checklist analysis"

---

### Security Consideration 2: Approval Authority

**Risk**: Course corrections approved by unauthorized users

**Mitigation**:
- Verify user invoking `correct-course` has authority to approve significant project changes
- For high-impact changes (MVP re-scope, fundamental replan), escalate for stakeholder approval
- Document approver identity in Sprint Change Proposal (name, role, date)
- Example: "Approval by: Jane Doe (Product Owner), 2025-10-14"

---

### Security Consideration 3: Rollback Data Implications

**Risk**: Path Option 2 (Rollback) may cause data loss or security vulnerabilities if not executed carefully

**Mitigation**:
- Analyze data implications of rollback in Section 4 (Path Forward Evaluation)
- Flag if rollback affects:
  - User data (PII, transaction history)
  - Security configurations (auth, permissions)
  - Audit logs (compliance requirements)
- Recommend data backup before rollback execution
- Involve Dev and QA in rollback plan validation

---

### Security Consideration 4: External Dependency Changes

**Risk**: Course corrections affecting external integrations may introduce security vulnerabilities (e.g., changing auth provider, exposing APIs)

**Mitigation**:
- In Section 3 (Artifact Conflict Analysis), flag security-relevant changes
- If architecture changes affect:
  - Authentication/authorization mechanisms
  - API endpoints (exposure, permissions)
  - Data storage or transmission
  - Third-party integrations
- Recommend security review as part of Implementation Plan
- Example: "Architecture change to replace OAuth provider requires security review by InfoSec team"

---

### Security Consideration 5: Sprint Change Proposal Distribution

**Risk**: Sprint Change Proposal contains sensitive project information (strategy, tech stack, business goals)

**Mitigation**:
- Store Sprint Change Proposal in secure project documentation location (same access controls as PRD/architecture)
- If distributing to stakeholders, ensure they have appropriate clearance
- Avoid including sensitive implementation details (passwords, keys, proprietary algorithms) in proposal

---

### Security Consideration 6: Change Tracking and Audit Trail

**Risk**: Without proper tracking, unauthorized or unreviewed changes may slip through

**Mitigation**:
- Sprint Change Proposal serves as audit trail for significant project changes
- Document approver, date, and rationale for all changes
- Retain annotated change-checklist as evidence of analysis completeness
- Integrate with version control (e.g., commit Sprint Change Proposal to Git) for tamper-proof history

---

## 15. Monitoring & Observability

Since `correct-course` is a collaborative, interactive task (not a long-running system process), traditional monitoring (metrics, logs, alerts) is less applicable. However, observability for task quality and effectiveness is valuable.

### Monitoring Metric 1: Checklist Completion Rate

**Definition**: Percentage of checklist items marked `[x]` or `[N/A]` (vs skipped)

**Target**: 100% of relevant items addressed

**Purpose**: Ensure systematic, thorough analysis

**Collection**:
- At end of Step 2, count marked items vs total items
- Flag if < 100% completion

**Action if Below Target**:
- Prompt user to address or justify skipped items

---

### Monitoring Metric 2: Path Forward Decision Time

**Definition**: Time elapsed in Section 4 (Path Forward Evaluation) before user selects path

**Target**: < 20 minutes for simple changes, < 60 minutes for complex changes

**Purpose**: Identify if decision-making is stalled or options are unclear

**Collection**:
- Timestamp start of Section 4
- Timestamp user path selection
- Calculate delta

**Action if Above Target**:
- Offer to clarify options, add pros/cons detail
- Check if user needs additional consultation (PM, Architect)

---

### Monitoring Metric 3: Sprint Change Proposal Approval Cycle Count

**Definition**: Number of revision cycles before user approval (ideal: 1, acceptable: 2-3)

**Target**: ≤ 2 cycles

**Purpose**: Assess quality of initial proposal, clarity of communication

**Collection**:
- Count iterations of Step 4 (present proposal → feedback → revise → re-present)

**Action if Above Target**:
- Review common feedback themes, improve proposal generation quality
- Check if user expectations were unclear initially

---

### Monitoring Metric 4: Handoff Success Rate

**Definition**: Percentage of handoffs where receiving agent successfully proceeds with Sprint Change Proposal

**Target**: > 90%

**Purpose**: Ensure Sprint Change Proposal is clear and actionable for downstream agents

**Collection**:
- After handoff (Step 5), track if receiving agent (PM, Architect, PO, SM) accepts and proceeds
- Flag if receiving agent requests clarification or rejects proposal

**Action if Below Target**:
- Review Sprint Change Proposal for clarity, specificity
- Check if handoff plan was clear (which agent, what actions)

---

### Observability: Sprint Change Proposal Artifact

The Sprint Change Proposal document itself serves as the primary observability artifact:

**Key Sections for Observability**:
1. **Issue Analysis**: Provides root cause and evidence (what went wrong)
2. **Impact Assessment**: Quantifies scale of change (epics, artifacts, MVP)
3. **Path Forward Analysis**: Documents decision-making (options, rationale)
4. **Proposed Changes**: Shows specificity and actionability of solution
5. **Implementation Plan**: Reveals coordination complexity (handoffs, timeline)
6. **Approval**: Confirms user buy-in and authority

**Observability Use Cases**:
- **Post-mortem analysis**: If project struggles, review Sprint Change Proposals to identify when/why pivots occurred
- **Process improvement**: Analyze common issue types, frequent path selections, approval cycle times
- **Training**: Use Sprint Change Proposals as case studies for teaching change management

---

### Quality Indicators (Observable in Sprint Change Proposal)

**High-Quality Indicators**:
- ✅ Clear, specific issue definition (not vague)
- ✅ Quantified impacts (e.g., "3 epics affected", "5 stories require changes")
- ✅ Specific proposed edits with before/after format
- ✅ Single approval cycle (user approves draft without extensive revisions)
- ✅ Clear handoff plan (agent, actions, timeline)

**Low-Quality Indicators (Red Flags)**:
- ❌ Vague issue definition ("things aren't working")
- ❌ Unquantified impacts ("some epics may be affected")
- ❌ Generic proposed changes ("improve architecture", no specifics)
- ❌ Multiple approval cycles (extensive revisions needed)
- ❌ Unclear handoffs (no specific agent or actions)

---

## 16. ADK Translation Recommendations

### Recommended ADK Component: **Cloud Workflows + Vertex AI Agents + Firestore**

**Rationale**:
- **Cloud Workflows**: Orchestrates the 5-step `correct-course` workflow with built-in state management
- **Vertex AI Agents**: Handles interactive analysis (Sections 1-4 of checklist) and proposal generation (Step 4)
- **Firestore**: Stores Sprint Change Proposal, annotated checklist, and workflow state

**Architecture**:

```
User Request
    ↓
Cloud Workflows (correct-course Workflow)
    ↓
Step 1: Setup & Mode Selection
    → Vertex AI Agent: Acknowledge, explain modes, obtain selection
    ↓
Step 2: Checklist Analysis (4 Sub-Workflows)
    → Vertex AI Agent: Section 1 (Trigger & Context)
    → Vertex AI Agent: Section 2 (Epic Impact)
    → Vertex AI Agent: Section 3 (Artifact Conflict)
    → Vertex AI Agent: Section 4 (Path Forward)
    → Read artifacts from Firestore/Cloud Storage
    ↓
Step 3: Draft Proposed Changes
    → Vertex AI Agent: Generate specific edits per artifact
    → Iterative or batched based on mode
    ↓
Step 4: Generate Sprint Change Proposal
    → Cloud Function: Populate proposal template
    → Vertex AI Agent: Present to user, refine, obtain approval
    ↓
Step 5: Finalize & Determine Next Steps
    → Cloud Workflows: Determine handoff (PO/SM vs PM/Architect)
    → Save Sprint Change Proposal to Firestore
    → Trigger handoff workflow (if applicable)
```

---

### GCP Service Mapping

| BMad Component | GCP Service | Implementation Details |
|----------------|-------------|------------------------|
| `correct-course` workflow | Cloud Workflows | 5-step workflow definition with conditional branching (mode, path selection, handoff) |
| Checklist analysis (Sections 1-4) | Vertex AI Agent | Agent with change-checklist context, interactive elicitation capabilities |
| Sprint Change Proposal generation | Cloud Function (Node.js/Python) | Template population, markdown generation |
| Artifact reading (PRD, architecture, epics) | Cloud Storage + Firestore | Artifacts stored in Cloud Storage, metadata in Firestore for fast access |
| Change-checklist framework | Cloud Storage | `.bmad-core/checklists/change-checklist.md` stored as template |
| Interaction mode (incremental vs YOLO) | Workflow Variables | Mode selection passed as workflow variable, affects branching |
| User interaction | Vertex AI Agent + Cloud Workflows Callbacks | Agent handles conversational interaction, callbacks for user input |
| Approval tracking | Firestore | Approval status, approver identity, timestamp stored in Firestore |
| Handoff orchestration | Cloud Workflows + Pub/Sub | Trigger downstream workflows for PM/Architect/PO/SM via Pub/Sub messages |

---

### Vertex AI Agent Configuration

```yaml
agent:
  id: "correct-course-agent"
  display_name: "Change Navigator"
  description: "Guides structured response to significant project changes"
  model: "gemini-2.0-flash-001"
  instructions: |
    You are a Change Navigator guiding systematic project course corrections.

    Your role:
    1. Work through change-checklist (6 sections) with user
    2. Analyze impacts on epics, artifacts, MVP
    3. Evaluate solution paths (Adjust, Rollback, Re-scope)
    4. Draft specific proposed changes for affected artifacts
    5. Generate Sprint Change Proposal document
    6. Determine handoff to appropriate specialist agents

    Core principles:
    - Changes are inevitable; handling determines success
    - User buy-in is critical - collaborative decision-making
    - Be specific and actionable (not vague suggestions)
    - Be honest about trade-offs (no perfect solutions)
    - Respect artifact ownership (propose, don't directly edit)
    - Get explicit approval (not implicit)

    Interaction modes:
    - Incremental: Section-by-section, collaborative, detailed refinement
    - YOLO: Batched analysis, faster, broader review

  tools:
    - name: "read_artifact"
      description: "Read project artifact (PRD, architecture, epic, story)"
      function_ref: "projects/{project}/locations/{location}/functions/read-artifact"
    - name: "populate_proposal_template"
      description: "Generate Sprint Change Proposal from analysis"
      function_ref: "projects/{project}/locations/{location}/functions/populate-proposal-template"
    - name: "save_proposal"
      description: "Save Sprint Change Proposal to Firestore"
      function_ref: "projects/{project}/locations/{location}/functions/save-proposal"

  context:
    always_load:
      - "gs://bmad-core/checklists/change-checklist.md"  # Checklist framework
    templates:
      - "gs://bmad-core/templates/sprint-change-proposal-tmpl.md"  # Proposal template

  memory:
    session_ttl: 7200  # 2 hours (course correction can be lengthy)
    max_messages: 100  # Extensive back-and-forth expected
```

---

### Cloud Workflows Definition

```yaml
main:
  params: [project_id, change_trigger, change_description, interaction_mode]
  steps:
    # Step 1: Initial Setup & Mode Selection
    - step_1_setup:
        call: vertex_ai_agent_invoke
        args:
          agent_id: "correct-course-agent"
          prompt: |
            Acknowledge "Correct Course Task" initiation.
            Change Trigger: ${change_trigger}
            Change Description: ${change_description}
            Confirm artifact access and explain interaction modes.
            User selected mode: ${interaction_mode}
        result: setup_result

    # Step 2: Execute Checklist Analysis (Sections 1-4)
    - step_2_checklist:
        switch:
          - condition: ${interaction_mode == "incremental"}
            steps:
              - section_1:
                  call: vertex_ai_agent_invoke
                  args:
                    agent_id: "correct-course-agent"
                    prompt: "Section 1: Understand Trigger & Context. Work through checklist items interactively."
                  result: section_1_result
              - section_2:
                  call: vertex_ai_agent_invoke
                  args:
                    agent_id: "correct-course-agent"
                    prompt: "Section 2: Epic Impact Assessment. Analyze current and future epics."
                  result: section_2_result
              - section_3:
                  call: vertex_ai_agent_invoke
                  args:
                    agent_id: "correct-course-agent"
                    prompt: "Section 3: Artifact Conflict & Impact Analysis. Review PRD, architecture, frontend."
                  result: section_3_result
              - section_4:
                  call: vertex_ai_agent_invoke
                  args:
                    agent_id: "correct-course-agent"
                    prompt: "Section 4: Path Forward Evaluation. Present options, obtain user selection."
                  result: section_4_result
          - condition: ${interaction_mode == "yolo"}
            steps:
              - all_sections_batched:
                  call: vertex_ai_agent_invoke
                  args:
                    agent_id: "correct-course-agent"
                    prompt: "Sections 1-4: Complete checklist analysis in batched mode. Present consolidated findings."
                  result: checklist_result

    # Step 3: Draft Proposed Changes
    - step_3_draft_changes:
        call: vertex_ai_agent_invoke
        args:
          agent_id: "correct-course-agent"
          prompt: "Draft specific proposed changes for all affected artifacts based on selected path. Use before/after format."
        result: proposed_changes

    # Step 4: Generate Sprint Change Proposal
    - step_4_generate_proposal:
        call: cloud_function_invoke
        args:
          function: "populate-proposal-template"
          params:
            checklist_analysis: ${checklist_result}
            proposed_changes: ${proposed_changes}
        result: proposal_draft

    - step_4_review_proposal:
        call: vertex_ai_agent_invoke
        args:
          agent_id: "correct-course-agent"
          prompt: |
            Present Sprint Change Proposal draft to user.
            Draft: ${proposal_draft}
            Obtain feedback, refine, and obtain explicit approval.
        result: proposal_final

    # Step 5: Finalize & Determine Next Steps
    - step_5_determine_handoff:
        switch:
          - condition: ${proposal_final.requires_fundamental_replan == true}
            steps:
              - handoff_to_pm_architect:
                  call: cloud_workflows_invoke
                  args:
                    workflow: "handoff-to-pm-architect"
                    params:
                      proposal: ${proposal_final}
          - condition: ${proposal_final.requires_fundamental_replan == false}
            steps:
              - handoff_to_po_sm:
                  call: cloud_workflows_invoke
                  args:
                    workflow: "handoff-to-po-sm"
                    params:
                      proposal: ${proposal_final}

    - save_proposal:
        call: cloud_function_invoke
        args:
          function: "save-proposal"
          params:
            project_id: ${project_id}
            proposal: ${proposal_final}
        result: saved_proposal

    - return_result:
        return:
          status: "complete"
          proposal_id: ${saved_proposal.id}
          handoff: ${proposal_final.handoff_agent}
```

---

### Firestore Schema

```
/projects/{project_id}/change-proposals/{proposal_id}
  - change_trigger: string                  # Story ID or issue description
  - change_description: string              # User's explanation
  - interaction_mode: "incremental" | "yolo"
  - issue_type: string                      # technical | requirement | misunderstanding | pivot | failed_story
  - selected_path: "adjust" | "rollback" | "re-scope" | "fundamental_replan"
  - affected_epics: string[]                # Epic IDs
  - affected_artifacts: string[]            # Artifact paths
  - proposed_changes: object                # Artifact-specific proposed edits
  - proposal_document: string               # Full Sprint Change Proposal markdown
  - approval_status: "draft" | "approved" | "rejected"
  - approved_by: string                     # User name
  - approved_at: timestamp
  - handoff_agent: "po" | "sm" | "pm" | "architect"
  - created_at: timestamp
  - updated_at: timestamp

/projects/{project_id}/change-proposals/{proposal_id}/checklist-state
  - section_1_status: object                # Checklist items and statuses
  - section_2_status: object
  - section_3_status: object
  - section_4_status: object
  - section_5_status: object
  - section_6_status: object
```

---

### Cloud Functions

**Function 1: `read-artifact`**
- **Purpose**: Read project artifact (PRD, architecture, epic, story) from Cloud Storage
- **Input**: `artifact_path` (e.g., `docs/project/prd/prd.md`)
- **Output**: Artifact content (markdown text)

**Function 2: `populate-proposal-template`**
- **Purpose**: Populate Sprint Change Proposal template with analysis and proposed changes
- **Input**: `checklist_analysis` (from Step 2), `proposed_changes` (from Step 3)
- **Output**: Complete Sprint Change Proposal markdown document

**Function 3: `save-proposal`**
- **Purpose**: Save Sprint Change Proposal to Firestore
- **Input**: `project_id`, `proposal` (document)
- **Output**: `proposal_id` (saved document ID)

---

### Integration with Other ADK Workflows

**Upstream Workflows** (trigger `correct-course`):
- **`review-story`**: QA review may identify issues requiring course correction
- **`create-next-story`**: Story creation may reveal epic-level problems
- **`apply-qa-fixes`**: Attempting fixes may reveal changes are more extensive than thought

**Downstream Workflows** (triggered by `correct-course`):
- **Handoff to PO/SM**: For direct implementation of approved changes
  - **Workflow**: `handoff-to-po-sm`
  - **Inputs**: Sprint Change Proposal with specific artifact edits
  - **Actions**: PO/SM update epic backlog, create/modify stories
- **Handoff to PM/Architect**: For fundamental replanning
  - **Workflow**: `handoff-to-pm-architect`
  - **Inputs**: Sprint Change Proposal as replanning context
  - **Actions**: PM revises PRD, Architect redesigns architecture

---

### Cost & Performance Considerations

**Cloud Workflows Cost**:
- Workflow executions: ~$0.01 per 1,000 steps
- Estimated steps: 10-20 per `correct-course` execution
- **Cost**: ~$0.0001-0.0002 per execution (negligible)

**Vertex AI Agent Cost**:
- Model: Gemini 2.0 Flash (~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens)
- Estimated tokens per execution: 30,000-100,000 input, 10,000-30,000 output (extensive interaction)
- **Cost**: ~$2.25-7.50 input + $3.00-9.00 output = **$5.25-16.50 per execution**

**Cloud Function Cost**:
- Invocations: ~$0.40 per 1M invocations
- Estimated invocations: 5-10 per execution (read artifacts, populate template, save proposal)
- **Cost**: ~$0.000002-0.000004 per execution (negligible)

**Firestore Cost**:
- Writes: ~$0.18 per 100K writes
- Reads: ~$0.06 per 100K reads
- Estimated operations: 20-50 reads (artifacts), 5-10 writes (proposal, checklist state)
- **Cost**: ~$0.00001-0.00002 per execution (negligible)

**Total Estimated Cost per Execution**: **$5.25-16.50** (dominated by Vertex AI Agent usage)

**Performance**:
- Latency: 1-3 hours (user interaction time, not system latency)
- System processing time: 2-10 minutes (agent inference, template population)
- Bottleneck: User decision-making speed (Sections 4 and approval)

---

### Optimization Recommendations for ADK Implementation

**1. Artifact Caching**:
- Cache frequently accessed artifacts (PRD, architecture) in Firestore with TTL
- Reduces Cloud Storage reads and improves latency

**2. Checklist State Persistence**:
- Save checklist progress after each section (Firestore)
- Enables resumption if workflow pauses or errors

**3. Proposal Template Reuse**:
- Store Sprint Change Proposal template in Cloud Storage
- Populate via Cloud Function (faster than agent generating from scratch)

**4. Parallel Artifact Reading**:
- In Step 2, Section 3 (Artifact Conflict), read PRD, architecture, frontend spec in parallel
- Use Cloud Workflows parallel branches

**5. Agent Context Optimization**:
- Load change-checklist into agent context once (not per section)
- Reduces token usage and latency

---

## Summary

The `correct-course` task is a **sophisticated change management workflow** that guides systematic responses to significant project changes. It leverages the structured change-checklist framework to analyze impacts, evaluate solution paths, draft specific proposed changes, and produce actionable Sprint Change Proposals.

**Key Strengths**:
- **Systematic analysis**: 6-section checklist ensures thorough evaluation
- **Collaborative decision-making**: User involvement at every stage
- **Actionable outputs**: Specific proposed edits (not vague suggestions)
- **Clear handoff protocols**: Determines if changes need implementation or fundamental replanning
- **Dual interaction modes**: Incremental for depth, YOLO for speed

**ADK Translation**: Best implemented as **Cloud Workflows** (orchestration) + **Vertex AI Agents** (interactive analysis) + **Firestore** (state and proposal storage), with estimated cost of $5-17 per execution.

**Estimated Analysis Length**: 3,800+ lines (comprehensive, matching other high-complexity task analyses like `create-next-story` and `create-doc`).
