# Task Analysis: brownfield-create-epic

**Task ID**: `brownfield-create-epic`
**Task File**: `.bmad-core/tasks/brownfield-create-epic.md`
**Primary Agent**: PM (John)
**Task Type**: Brownfield Epic Creation Workflow (Lightweight Alternative to Full PRD)
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: Medium (Requires project analysis, scope assessment, story breakdown, risk evaluation)

---

## 1. Purpose & Scope

### Primary Purpose
Create a focused epic for small-to-medium brownfield enhancements that bypass the full PRD/Architecture documentation process. This task enables rapid development of isolated features or modifications (1-3 stories) that integrate with existing systems while maintaining system integrity.

### Scope Definition

**In Scope**:
- Creating single epics for focused brownfield enhancements (1-3 stories maximum)
- Analyzing existing project context (purpose, tech stack, architecture patterns, integration points)
- Defining enhancement scope with clear boundaries
- Breaking down epic into 1-3 stories
- Establishing compatibility requirements and risk mitigation strategies
- Creating rollback plans
- Providing SM (Story Manager) handoff documentation

**Out of Scope**:
- Creating full PRD documentation (use full brownfield PRD process instead)
- Creating architecture documentation (use full brownfield Architecture process instead)
- Large-scale features requiring 4+ stories
- Significant architectural changes or redesigns
- High-risk modifications to core system functionality
- Complex multi-system integration work
- Features requiring extensive risk assessment and mitigation planning

### Key Characteristics
- **Lightweight alternative** - Bypasses full PRD/Architecture process for small enhancements
- **Scope-limited** - Strictly enforced 1-3 story maximum
- **Integration-aware** - Requires explicit integration point identification
- **Pattern-following** - Must follow existing project patterns
- **Risk-conscious** - Includes risk assessment and mitigation despite lightweight approach
- **Rollback-ready** - Must have feasible rollback plan before proceeding
- **Validation-gated** - Multiple validation checkpoints before handoff to SM

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - enhancement_description: string     # Clear description of what's being added/changed
  - enhancement_name: string            # Short name for the epic
  - existing_system_context: object     # Project context information
      project_purpose: string           # What the existing project does
      technology_stack: array[string]   # Current tech stack
      architecture_patterns: array[string] # Existing patterns to follow
      integration_points: array[string] # Where enhancement connects to existing system

optional:
  - story_count_estimate: number        # Estimated number of stories (1-3)
  - success_criteria: array[string]     # Measurable outcomes
  - primary_risk: string                # Main risk to existing system
  - mitigation_approach: string         # How risk will be addressed
```

**Input Details**:
- **enhancement_description**: What's being added/changed and why it adds value (1-2 sentences)
- **enhancement_name**: Short, descriptive name for the epic (e.g., "User Profile Enhancement")
- **existing_system_context**: Essential information about current system
  - **project_purpose**: Current relevant functionality of existing system
  - **technology_stack**: Technologies used in relevant areas (e.g., React, Node.js, PostgreSQL)
  - **architecture_patterns**: Existing patterns to follow (e.g., REST API patterns, component structures)
  - **integration_points**: Where new work connects to existing system (e.g., user service API, profile UI component)
- **story_count_estimate**: How many stories needed (MUST be 1-3; if more, escalate to full PRD)
- **success_criteria**: Measurable outcomes (e.g., "Users can update profile photo", "Response time < 200ms")
- **primary_risk**: Main risk to existing system (e.g., "Breaking existing user authentication")
- **mitigation_approach**: How risk will be addressed (e.g., "Feature flag + comprehensive integration testing")

### Interactive Inputs (Elicited During Execution)

The task uses checklist-driven elicitation to gather context:

**Project Analysis Checklist** (Section 1):
- Project purpose and current functionality understood (yes/no)
- Existing technology stack identified (yes/no)
- Current architecture patterns noted (yes/no)
- Integration points with existing system identified (yes/no)

**Enhancement Scope Checklist** (Section 1):
- Enhancement clearly defined and scoped (yes/no)
- Impact on existing functionality assessed (yes/no)
- Required integration points identified (yes/no)
- Success criteria established (yes/no)

### Prerequisites

**Minimum Context Requirements**:
- Access to existing project codebase
- Understanding of existing system functionality
- Ability to identify integration points
- Knowledge of existing architecture patterns

**Scope Validation Requirements**:
- Enhancement can be completed in 1-3 stories maximum
- No significant architectural changes required
- Enhancement follows existing patterns
- Integration complexity is minimal
- Risk to existing system is low

**When to Escalate to Full Brownfield PRD/Architecture Process**:
- Enhancement requires 4+ coordinated stories
- Architectural planning is needed
- Significant integration work is required
- Risk assessment and mitigation planning is necessary
- Multiple systems or services are affected

---

## 3. Execution Flow

### High-Level Process (4 Sequential Sections)

```
Section 1: Project Analysis (Required)
  ↓
Section 2: Epic Creation
  ↓
Section 3: Validation Checklist
  ↓
Section 4: Handoff to Story Manager
```

**Critical Rule**: Complete all sections sequentially. Each section builds context for the next.

---

### Section 1: Project Analysis (Required)

**Purpose**: Gather essential information about existing project and enhancement scope.

**Process**:

#### 1A. Existing Project Context Analysis

**Elicit from User or Codebase**:
1. **Project purpose and current functionality**
   - What does the existing system do?
   - What are the relevant features/components?
   - Example: "User management system with authentication and profile features"

2. **Existing technology stack**
   - What technologies are used?
   - What frameworks/libraries are in place?
   - Example: "React frontend, Node.js/Express backend, PostgreSQL database"

3. **Current architecture patterns**
   - What patterns does the codebase follow?
   - What conventions should be maintained?
   - Example: "RESTful API with controller-service-repository pattern, React hooks with context API"

4. **Integration points with existing system**
   - Where will the enhancement connect?
   - What existing APIs/components will be used?
   - Example: "User profile API endpoint, ProfileCard React component, user table in database"

**Validation**:
- [ ] All four context elements identified and documented
- [ ] Integration points are specific and concrete
- [ ] Technology stack is sufficient for implementation guidance

#### 1B. Enhancement Scope Assessment

**Elicit from User**:
1. **Enhancement clearly defined and scoped**
   - What exactly is being added/changed?
   - What are the boundaries of the change?
   - Example: "Add ability for users to upload and display profile photos"

2. **Impact on existing functionality assessed**
   - What existing features will be affected?
   - Are there any breaking changes?
   - Example: "Profile display component will need to handle image URLs; no breaking changes"

3. **Required integration points identified**
   - What existing code will be modified?
   - What new connections are needed?
   - Example: "New S3 bucket for images, user profile API update, ProfileCard component update"

4. **Success criteria established**
   - How will success be measured?
   - What are the acceptance criteria?
   - Example: "Users can upload JPG/PNG up to 5MB, images display in profile, previous behavior unchanged"

**Validation**:
- [ ] Enhancement scope is clear and bounded
- [ ] Impact assessment completed
- [ ] Integration points are specific
- [ ] Success criteria are measurable

**Blocking Conditions**:
- **Scope too large**: If enhancement requires 4+ stories, HALT and recommend full brownfield PRD process
- **Architectural changes needed**: If significant architecture changes required, HALT and recommend full brownfield Architecture process
- **High complexity integration**: If integration is complex or affects multiple systems, HALT and recommend full brownfield PRD/Architecture process
- **High risk to existing system**: If risk assessment indicates high risk, HALT and recommend full brownfield PRD/Architecture process

**Decision Point**: Should this continue as lightweight epic or escalate to full PRD?

```
IF story_count > 3 THEN
  ESCALATE to full brownfield PRD process
  HALT with message: "This enhancement requires 4+ stories. Please use the full brownfield PRD/Architecture process."

ELSE IF architectural_changes_required THEN
  ESCALATE to full brownfield Architecture process
  HALT with message: "This enhancement requires architectural planning. Please use the full brownfield PRD/Architecture process."

ELSE IF integration_complexity == HIGH THEN
  ESCALATE to full brownfield PRD process
  HALT with message: "This enhancement has high integration complexity. Please use the full brownfield PRD/Architecture process."

ELSE IF risk_level == HIGH THEN
  ESCALATE to full brownfield PRD process
  HALT with message: "This enhancement has high risk to existing system. Please use the full brownfield PRD/Architecture process."

ELSE
  PROCEED to Section 2: Epic Creation
```

---

### Section 2: Epic Creation

**Purpose**: Create structured epic documentation with all essential elements.

**Process**:

#### 2A. Epic Title

**Format**: `{{Enhancement Name}} - Brownfield Enhancement`

**Example**: "User Profile Photo Upload - Brownfield Enhancement"

**Guidelines**:
- Keep title concise (5-10 words)
- Include "Brownfield Enhancement" suffix for clarity
- Use title case

#### 2B. Epic Goal

**Format**: 1-2 sentences describing:
- What the epic will accomplish
- Why it adds value

**Template**:
```
Enable {{user capability}} by {{technical approach}}, providing {{business value}}.
```

**Example**:
```
Enable users to upload and display custom profile photos by integrating S3 storage with the existing user profile system, providing personalization and improved user engagement.
```

**Guidelines**:
- Focus on user value first
- Keep under 50 words
- Be specific about what's being added

#### 2C. Epic Description

**Structure**:
```markdown
**Existing System Context:**

- Current relevant functionality: {{brief description}}
- Technology stack: {{relevant existing technologies}}
- Integration points: {{where new work connects to existing system}}

**Enhancement Details:**

- What's being added/changed: {{clear description}}
- How it integrates: {{integration approach}}
- Success criteria: {{measurable outcomes}}
```

**Example**:
```markdown
**Existing System Context:**

- Current relevant functionality: User profile system displays name, email, bio, and default avatar image
- Technology stack: React frontend, Node.js/Express backend, PostgreSQL database, S3 for file storage
- Integration points: User profile API (`/api/users/:id`), ProfileCard component, user database table

**Enhancement Details:**

- What's being added/changed: Profile photo upload feature with image preview, storage in S3, and display in profile UI
- How it integrates: New upload endpoint added to user profile API, ProfileCard component updated to fetch/display custom photos, user table adds `profile_photo_url` field
- Success criteria: Users can upload JPG/PNG images up to 5MB, images display correctly in all profile views, existing profile functionality remains unchanged
```

**Guidelines**:
- Keep existing system context brief but specific
- Clearly separate existing vs. new functionality
- Success criteria must be testable

#### 2D. Stories Breakdown (1-3 Stories)

**Structure**:
```markdown
1. **Story 1:** {{Story title and brief description}}
2. **Story 2:** {{Story title and brief description}}
3. **Story 3:** {{Story title and brief description}}
```

**Story Breakdown Guidelines**:
- Break work into logical, implementable chunks
- Each story should be independently testable
- Sequence stories for safe incremental delivery
- Each story should take 4-16 hours of development work

**Example**:
```markdown
1. **Story 1:** S3 Integration and Upload API - Add S3 bucket configuration and create backend endpoint for secure photo uploads with validation (format, size, authentication)

2. **Story 2:** Profile Photo Display - Update ProfileCard component and user profile views to fetch and display custom photos with fallback to default avatar

3. **Story 3:** Upload UI Component - Create photo upload UI with image preview, validation feedback, and integration with profile settings page
```

**Validation**:
- [ ] Story count is between 1-3 (enforced)
- [ ] Each story has clear title and description
- [ ] Stories are logically sequenced
- [ ] Each story is independently testable
- [ ] Stories build on each other safely

#### 2E. Compatibility Requirements

**Purpose**: Define constraints to ensure existing system remains functional.

**Checklist Format**:
```markdown
- [ ] Existing APIs remain unchanged (or changes are backward compatible)
- [ ] Database schema changes are backward compatible (additive only)
- [ ] UI changes follow existing patterns
- [ ] Performance impact is minimal
```

**Guidelines**:
- Be specific about what must remain unchanged
- Call out any acceptable breaking changes explicitly
- Define "minimal performance impact" quantitatively if possible
- Add additional compatibility requirements as needed

**Example**:
```markdown
- [ ] Existing user profile API endpoints remain unchanged
- [ ] Database schema changes are additive only (new `profile_photo_url` field, nullable)
- [ ] UI changes follow existing React component patterns and design system
- [ ] Performance impact: Image upload < 5 seconds for 5MB files, profile load time increase < 100ms
- [ ] Mobile responsive design maintained
```

#### 2F. Risk Mitigation

**Purpose**: Identify primary risk and define mitigation/rollback strategies.

**Structure**:
```markdown
- **Primary Risk:** {{main risk to existing system}}
- **Mitigation:** {{how risk will be addressed}}
- **Rollback Plan:** {{how to undo changes if needed}}
```

**Risk Identification Guidelines**:
- Focus on risk to **existing system** (not general project risk)
- Be specific about what could break
- Consider: data integrity, API compatibility, UI/UX disruption, performance degradation, security vulnerabilities

**Mitigation Guidelines**:
- Define concrete actions to reduce risk
- Consider: feature flags, comprehensive testing, gradual rollout, monitoring/alerting

**Rollback Guidelines**:
- Must be feasible and tested
- Should be executable without data loss
- Consider: feature flag toggle, database migration reversal, code revert

**Example**:
```markdown
- **Primary Risk:** Photo upload service disruption could block all profile updates if not properly isolated
- **Mitigation:** Implement feature flag to disable upload feature independently, comprehensive integration testing including failure scenarios, upload service isolated from core profile update logic
- **Rollback Plan:** Toggle feature flag off, revert code changes via git, drop `profile_photo_url` column if needed (nullable so no data loss)
```

#### 2G. Definition of Done

**Checklist Format**:
```markdown
- [ ] All stories completed with acceptance criteria met
- [ ] Existing functionality verified through testing
- [ ] Integration points working correctly
- [ ] Documentation updated appropriately
- [ ] No regression in existing features
```

**Guidelines**:
- Keep high-level (story-level DoD will be more detailed)
- Focus on epic-level completion criteria
- Include regression testing explicitly
- Add additional criteria as needed

**Example**:
```markdown
- [ ] All 3 stories completed with acceptance criteria met
- [ ] Existing profile functionality verified through manual and automated testing
- [ ] S3 integration working correctly with proper security and error handling
- [ ] User documentation updated with photo upload instructions
- [ ] No regression in existing profile features (verified via regression test suite)
- [ ] Performance benchmarks met (upload < 5s, profile load increase < 100ms)
```

---

### Section 3: Validation Checklist

**Purpose**: Final validation before handoff to Story Manager to ensure epic is ready for story development.

**Process**:

#### 3A. Scope Validation

**Checklist**:
```markdown
- [ ] Epic can be completed in 1-3 stories maximum
- [ ] No architectural documentation is required
- [ ] Enhancement follows existing patterns
- [ ] Integration complexity is manageable
```

**Blocking Conditions**:
- **Scope too large**: If epic requires 4+ stories, HALT and recommend full brownfield PRD
- **Architecture needed**: If architectural documentation required, HALT and recommend full brownfield Architecture
- **Pattern mismatch**: If enhancement doesn't follow existing patterns, HALT and assess whether patterns should change (requires architecture work)
- **Complex integration**: If integration complexity is high, HALT and recommend full brownfield PRD/Architecture

**Decision Point**: Proceed or escalate?

```
IF any_scope_validation_fails THEN
  HALT and recommend appropriate escalation path
ELSE
  PROCEED to Risk Assessment
```

#### 3B. Risk Assessment

**Checklist**:
```markdown
- [ ] Risk to existing system is low
- [ ] Rollback plan is feasible
- [ ] Testing approach covers existing functionality
- [ ] Team has sufficient knowledge of integration points
```

**Risk Level Guidelines**:
- **Low Risk**: Isolated changes, minimal integration, established patterns, feasible rollback
- **Medium Risk**: Some integration complexity, some unknowns, rollback requires coordination
- **High Risk**: Core system changes, complex integration, uncertain rollback, high blast radius

**Decision Point**: Is risk acceptable for lightweight epic process?

```
IF risk_level > LOW THEN
  HALT with message: "Risk level is too high for lightweight epic process. Please use full brownfield PRD/Architecture process with comprehensive risk assessment."
ELSE
  PROCEED to Completeness Check
```

#### 3C. Completeness Check

**Checklist**:
```markdown
- [ ] Epic goal is clear and achievable
- [ ] Stories are properly scoped
- [ ] Success criteria are measurable
- [ ] Dependencies are identified
```

**Validation Rules**:
- **Epic goal**: Should be understandable to both technical and non-technical stakeholders
- **Stories**: Each story should be independently testable and deliverable
- **Success criteria**: Must be objectively verifiable (not subjective like "looks good")
- **Dependencies**: All dependencies (systems, services, libraries, knowledge) identified

**Blocking Conditions**:
- **Unclear epic goal**: If goal is ambiguous, HALT and refine with user
- **Poorly scoped stories**: If stories are too large/small or unclear, HALT and re-scope
- **Unmeasurable success criteria**: If criteria are subjective, HALT and define measurable criteria
- **Missing dependencies**: If critical dependencies are missing, HALT and identify

**Decision Point**: Is epic complete and ready for SM handoff?

```
IF any_completeness_check_fails THEN
  HALT and address gaps before proceeding
ELSE
  PROCEED to Section 4: Handoff to Story Manager
```

---

### Section 4: Handoff to Story Manager

**Purpose**: Provide Story Manager (SM) with all context needed to develop detailed user stories.

**Process**:

#### 4A. Generate Handoff Message

**Template**:
```
Story Manager Handoff:

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running {{technology stack}}
- Integration points: {{list key integration points}}
- Existing patterns to follow: {{relevant existing patterns}}
- Critical compatibility requirements: {{key requirements}}
- Each story must include verification that existing functionality remains intact

The epic should maintain system integrity while delivering {{epic goal}}."
```

**Handoff Components**:
1. **Technology Stack**: Specific technologies SM needs to understand (e.g., "React 18, Node.js 16, PostgreSQL 14, S3")
2. **Integration Points**: Specific areas where enhancement connects to existing system (e.g., "User profile API endpoint /api/users/:id, ProfileCard React component, user database table")
3. **Existing Patterns**: Patterns to follow (e.g., "RESTful API with controller-service-repository pattern, React hooks with context API, Material-UI component library")
4. **Critical Compatibility Requirements**: Non-negotiable requirements (e.g., "No breaking changes to existing user profile API, database changes must be additive only")
5. **Epic Goal**: Reiterate the epic goal for context

**Example**:
```
Story Manager Handoff:

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running React 18, Node.js 16 with Express, PostgreSQL 14, and S3 for file storage
- Integration points: User profile API endpoint /api/users/:id, ProfileCard React component, user database table (users), S3 bucket for file storage
- Existing patterns to follow: RESTful API with controller-service-repository pattern, React hooks with context API for state management, Material-UI component library for UI
- Critical compatibility requirements: No breaking changes to existing user profile API, database changes must be additive only (nullable columns), UI must follow existing design system
- Each story must include verification that existing functionality remains intact (regression testing)

The epic should maintain system integrity while delivering the ability for users to upload and display custom profile photos, providing personalization and improved user engagement."
```

#### 4B. Handoff Checklist

**Validate Handoff Quality**:
- [ ] Technology stack is specific and accurate
- [ ] Integration points are clearly identified
- [ ] Existing patterns are documented
- [ ] Compatibility requirements are explicit
- [ ] Epic goal is reiterated
- [ ] Regression testing requirement is included

#### 4C. Handoff Execution

**Delivery Method**:
1. **Option 1**: Direct SM agent invocation (if in multi-agent environment)
   - Invoke SM agent with epic context
   - Pass handoff message as initial context

2. **Option 2**: Document handoff (if single-agent or manual workflow)
   - Create handoff document in appropriate location (e.g., `docs/epics/{{epic-id}}-handoff.md`)
   - Notify user that epic is ready for SM to develop stories

**Post-Handoff**:
- Epic creation task is complete
- SM agent (Bob) will use epic to create detailed stories via `create-next-story` task
- PM agent can exit or await next request

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Scope Size Assessment (Section 1)

**Location**: After completing Section 1 project analysis

**Decision Logic**:
```
IF estimated_story_count > 3 THEN
  ESCALATE to full brownfield PRD process
  HALT
ELSE IF architectural_changes_required THEN
  ESCALATE to full brownfield Architecture process
  HALT
ELSE IF integration_complexity == HIGH THEN
  ESCALATE to full brownfield PRD/Architecture process
  HALT
ELSE IF risk_level == HIGH THEN
  ESCALATE to full brownfield PRD/Architecture process
  HALT
ELSE
  PROCEED to Section 2: Epic Creation
```

**Inputs**:
- `estimated_story_count`: Number of stories needed (from user input or PM analysis)
- `architectural_changes_required`: Boolean (does enhancement require architecture work?)
- `integration_complexity`: LOW | MEDIUM | HIGH (based on integration point analysis)
- `risk_level`: LOW | MEDIUM | HIGH (based on risk assessment)

**Outputs**:
- `proceed_to_epic_creation`: Boolean (true if all checks pass, false if escalation needed)
- `escalation_reason`: String (why escalation is recommended, if applicable)

**Escalation Paths**:
- **Scope too large**: "This enhancement requires 4+ stories. Please use the full brownfield PRD/Architecture process for comprehensive planning."
- **Architecture needed**: "This enhancement requires architectural planning. Please use the full brownfield PRD/Architecture process."
- **Complex integration**: "This enhancement has high integration complexity affecting multiple systems. Please use the full brownfield PRD/Architecture process."
- **High risk**: "This enhancement has high risk to existing system. Please use the full brownfield PRD/Architecture process with comprehensive risk assessment and mitigation planning."

### Decision Point 2: Scope Validation (Section 3A)

**Location**: Section 3 Validation Checklist - Scope Validation

**Decision Logic**:
```
scope_checks = [
  epic_completable_in_1_to_3_stories,
  no_architectural_documentation_required,
  enhancement_follows_existing_patterns,
  integration_complexity_manageable
]

IF all(scope_checks) THEN
  PROCEED to Risk Assessment (Section 3B)
ELSE
  HALT and recommend escalation to full brownfield PRD/Architecture process
```

**Blocking Conditions**:
- [ ] Epic cannot be completed in 1-3 stories
- [ ] Architectural documentation is required
- [ ] Enhancement does not follow existing patterns (new patterns needed)
- [ ] Integration complexity is not manageable

**Outputs**:
- `scope_validation_passed`: Boolean
- `escalation_recommendation`: String (if validation fails)

### Decision Point 3: Risk Level Assessment (Section 3B)

**Location**: Section 3 Validation Checklist - Risk Assessment

**Decision Logic**:
```
risk_checks = [
  risk_to_existing_system_is_low,
  rollback_plan_is_feasible,
  testing_covers_existing_functionality,
  team_has_sufficient_knowledge
]

IF all(risk_checks) THEN
  PROCEED to Completeness Check (Section 3C)
ELSE
  HALT and recommend escalation to full brownfield PRD/Architecture process
```

**Risk Level Determination**:
```
risk_score = 0

IF risk_to_existing_system > LOW THEN risk_score += 3
IF rollback_plan_is_not_feasible THEN risk_score += 2
IF testing_does_not_cover_existing_functionality THEN risk_score += 2
IF team_lacks_knowledge THEN risk_score += 1

IF risk_score >= 3 THEN
  risk_level = HIGH
  ESCALATE to full brownfield PRD/Architecture process
ELSE IF risk_score == 1-2 THEN
  risk_level = MEDIUM
  PROCEED with caution (additional risk mitigation may be needed)
ELSE
  risk_level = LOW
  PROCEED to Completeness Check
```

**Blocking Conditions**:
- [ ] Risk to existing system is medium or high
- [ ] Rollback plan is not feasible or requires significant coordination
- [ ] Testing approach does not adequately cover existing functionality
- [ ] Team lacks sufficient knowledge of integration points (training/knowledge transfer needed first)

**Outputs**:
- `risk_level`: LOW | MEDIUM | HIGH
- `risk_validation_passed`: Boolean
- `risk_mitigation_notes`: String (additional mitigation if risk_level == MEDIUM)

### Decision Point 4: Completeness Check (Section 3C)

**Location**: Section 3 Validation Checklist - Completeness Check

**Decision Logic**:
```
completeness_checks = [
  epic_goal_is_clear_and_achievable,
  stories_are_properly_scoped,
  success_criteria_are_measurable,
  dependencies_are_identified
]

IF all(completeness_checks) THEN
  PROCEED to Section 4: Handoff to Story Manager
ELSE
  HALT and address gaps before proceeding
```

**Validation Rules**:
- **Epic goal**: Must be clear, achievable, and understandable to both technical and non-technical stakeholders
- **Stories**: Each story must be independently testable, deliverable, and appropriately sized (4-16 hours dev work)
- **Success criteria**: Must be objectively verifiable (not subjective)
- **Dependencies**: All dependencies must be identified (systems, services, libraries, knowledge, approvals)

**Gap Resolution**:
```
FOR EACH failed_check IN completeness_checks:
  IF epic_goal_is_not_clear THEN
    ELICIT refined epic goal from user

  IF stories_are_not_properly_scoped THEN
    RE-SCOPE stories with user (break down or combine)

  IF success_criteria_are_not_measurable THEN
    ELICIT measurable criteria from user

  IF dependencies_are_not_identified THEN
    IDENTIFY dependencies with user (systems, knowledge, approvals)
```

**Outputs**:
- `completeness_validation_passed`: Boolean
- `gaps_addressed`: Array[string] (list of gaps that were addressed)
- `ready_for_handoff`: Boolean

---

## 5. User Interaction Points

### Interaction Point 1: Initial Context Gathering (Section 1)

**Purpose**: Gather existing project context and enhancement scope.

**Interaction Type**: Structured elicitation (checklist-driven)

**Questions to Elicit**:

**Existing Project Context**:
1. "What does your existing project do? What is its purpose?" → `project_purpose`
2. "What technology stack does your project use?" → `technology_stack[]`
3. "What architecture patterns does your codebase follow?" → `architecture_patterns[]`
4. "Where will this enhancement integrate with your existing system?" → `integration_points[]`

**Enhancement Scope**:
5. "What specifically is being added or changed?" → `enhancement_description`
6. "How will this enhancement affect existing functionality?" → `impact_on_existing_functionality`
7. "What are the required integration points?" → `required_integration_points[]`
8. "How will you measure success for this enhancement?" → `success_criteria[]`

**Elicitation Format**:
```
I'll need to gather some context about your existing project and the enhancement you want to make.

**Existing Project Context:**

1. What does your existing project do? What is its purpose?

[Wait for response]

2. What technology stack does your project use? (e.g., frameworks, languages, databases)

[Wait for response]

3. What architecture patterns does your codebase follow? (e.g., MVC, microservices, component patterns)

[Wait for response]

4. Where will this enhancement integrate with your existing system? (e.g., specific APIs, components, services)

[Wait for response]

**Enhancement Scope:**

5. What specifically is being added or changed?

[Wait for response]

6. How will this enhancement affect existing functionality?

[Wait for response]

7. What are the required integration points? (Be specific about what existing code will be touched)

[Wait for response]

8. How will you measure success for this enhancement? What are the acceptance criteria?

[Wait for response]
```

**Validation After Gathering**:
- Confirm understanding by summarizing back to user
- Assess scope size (1-3 stories?) and recommend escalation if needed

### Interaction Point 2: Story Breakdown Collaboration (Section 2D)

**Purpose**: Break down epic into 1-3 logical stories with user input.

**Interaction Type**: Collaborative brainstorming

**Approach**:
1. PM proposes initial story breakdown based on technical analysis
2. User reviews and provides feedback
3. PM refines stories based on feedback
4. Iterate until user confirms stories are appropriately scoped

**Example Dialogue**:
```
Based on the enhancement description, I propose breaking this into 3 stories:

1. **Story 1:** Backend API for photo upload
   - Create S3 integration
   - Add upload endpoint with validation
   - Update user model with photo URL field

2. **Story 2:** Profile photo display
   - Update ProfileCard component to display custom photos
   - Add fallback to default avatar
   - Update all profile views

3. **Story 3:** Upload UI
   - Create photo upload component with preview
   - Add to profile settings page
   - Implement client-side validation

Does this breakdown make sense? Would you like to adjust the scope or sequencing of these stories?

[Wait for user feedback and iterate]
```

### Interaction Point 3: Risk and Mitigation Review (Section 2F)

**Purpose**: Validate risk assessment and mitigation strategy with user.

**Interaction Type**: Risk discussion

**Approach**:
1. PM identifies primary risk based on technical analysis
2. PM proposes mitigation strategy
3. User reviews and confirms or provides additional concerns
4. PM refines risk mitigation plan

**Example Dialogue**:
```
Let me identify the primary risk for this enhancement:

**Primary Risk:** Photo upload service disruption could block all profile updates if not properly isolated.

**Proposed Mitigation:**
- Implement feature flag to disable upload feature independently
- Comprehensive integration testing including failure scenarios
- Upload service isolated from core profile update logic

**Proposed Rollback Plan:**
- Toggle feature flag off to disable feature
- Revert code changes via git
- Drop `profile_photo_url` column if needed (nullable so no data loss)

Does this risk assessment capture your main concerns? Are there additional risks I should consider?

[Wait for user feedback and iterate]
```

### Interaction Point 4: Validation Checkpoint (Section 3)

**Purpose**: Final validation before handoff to ensure user agreement on scope, risk, and completeness.

**Interaction Type**: Review and confirmation

**Approach**:
1. PM summarizes epic (goal, stories, risks, compatibility requirements)
2. PM walks through validation checklist
3. User confirms or raises concerns
4. PM addresses any concerns before proceeding to handoff

**Example Dialogue**:
```
Before I hand this off to the Story Manager, let me validate that everything is in order:

**Epic Summary:**
- Goal: Enable users to upload and display custom profile photos
- Stories: 3 stories (backend API, display, upload UI)
- Risk Level: Low (feature flag isolation, feasible rollback)
- Compatibility: No breaking changes, additive database schema

**Validation Checklist:**
✓ Epic can be completed in 1-3 stories
✓ No architectural documentation required
✓ Enhancement follows existing patterns
✓ Integration complexity is manageable
✓ Risk to existing system is low
✓ Rollback plan is feasible
✓ Testing covers existing functionality
✓ Epic goal is clear and achievable
✓ Stories are properly scoped
✓ Success criteria are measurable
✓ Dependencies are identified

Does this look correct? Any concerns before I hand this off to the Story Manager to develop detailed user stories?

[Wait for user confirmation]
```

---

## 6. Output Specifications

### Primary Output: Epic Document

**File Location**:
- **Option 1**: `docs/epics/{{epic-id}}-{{epic-slug}}.md` (if using file-based storage)
- **Option 2**: In-memory or database (if using system-based storage)
- **Option 3**: Directly passed to SM agent (if in multi-agent environment)

**Filename Pattern**: `{{epic-id}}-{{epic-slug}}.md`
- **epic-id**: Numeric identifier (e.g., "1", "2", "3")
- **epic-slug**: URL-safe version of epic name (e.g., "user-profile-photo-upload")

**File Format**: Markdown with YAML front matter (optional)

**Output Structure**:

```markdown
---
epic_id: {{epic-id}}
epic_name: {{enhancement-name}}
epic_type: brownfield
story_count: {{1-3}}
status: draft
created_date: {{YYYY-MM-DD}}
created_by: pm-agent
---

# {{Enhancement Name}} - Brownfield Enhancement

## Epic Goal

{{1-2 sentences describing what the epic will accomplish and why it adds value}}

## Epic Description

**Existing System Context:**

- Current relevant functionality: {{brief description}}
- Technology stack: {{relevant existing technologies}}
- Integration points: {{where new work connects to existing system}}

**Enhancement Details:**

- What's being added/changed: {{clear description}}
- How it integrates: {{integration approach}}
- Success criteria: {{measurable outcomes}}

## Stories

1. **Story 1:** {{Story title and brief description}}
2. **Story 2:** {{Story title and brief description}}
3. **Story 3:** {{Story title and brief description}}

## Compatibility Requirements

- [ ] Existing APIs remain unchanged (or changes are backward compatible)
- [ ] Database schema changes are backward compatible (additive only)
- [ ] UI changes follow existing patterns
- [ ] Performance impact is minimal

## Risk Mitigation

- **Primary Risk:** {{main risk to existing system}}
- **Mitigation:** {{how risk will be addressed}}
- **Rollback Plan:** {{how to undo changes if needed}}

## Definition of Done

- [ ] All stories completed with acceptance criteria met
- [ ] Existing functionality verified through testing
- [ ] Integration points working correctly
- [ ] Documentation updated appropriately
- [ ] No regression in existing features

## Story Manager Handoff

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running {{technology stack}}
- Integration points: {{list key integration points}}
- Existing patterns to follow: {{relevant existing patterns}}
- Critical compatibility requirements: {{key requirements}}
- Each story must include verification that existing functionality remains intact

The epic should maintain system integrity while delivering {{epic goal}}."
```

**File Permissions**:
- **Owner**: PM agent (creator)
- **Editors**: PM agent, PO agent (for validation/corrections)
- **Readers**: SM agent (for story development), Dev agent (for context), QA agent (for test planning)

### Secondary Output: Handoff Message to Story Manager

**Delivery Method**:
- **Option 1**: Direct agent invocation (if in multi-agent environment)
- **Option 2**: File-based handoff (create handoff document)
- **Option 3**: User notification (if manual workflow)

**Handoff Content**:
```
Story Manager Handoff:

Epic ID: {{epic-id}}
Epic Name: {{enhancement-name}}

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running {{technology stack}}
- Integration points: {{list key integration points}}
- Existing patterns to follow: {{relevant existing patterns}}
- Critical compatibility requirements: {{key requirements}}
- Each story must include verification that existing functionality remains intact

The epic should maintain system integrity while delivering {{epic goal}}."

Epic document location: {{epic-file-path}}
```

### Output Validation

**Pre-Output Validation**:
- [ ] Epic goal is clear and concise (1-2 sentences)
- [ ] Epic description includes both existing system context and enhancement details
- [ ] Story count is 1-3 (enforced)
- [ ] Each story has title and brief description
- [ ] Compatibility requirements checklist is present
- [ ] Risk mitigation includes primary risk, mitigation, and rollback plan
- [ ] Definition of Done checklist is present
- [ ] Handoff message includes all required elements

**Post-Output Validation**:
- [ ] File created successfully (if file-based)
- [ ] File is readable by downstream agents
- [ ] Handoff message delivered successfully (if direct invocation)
- [ ] User notified of completion

---

## 7. Error Handling & Validation

### Error Condition 1: Scope Too Large (Escalation Required)

**Detection Point**: Section 1 (Project Analysis) - After scope assessment

**Error Condition**:
```
IF estimated_story_count > 3 THEN
  ERROR: Scope too large for lightweight epic process
```

**Error Message**:
```
⚠️ Scope Assessment: This enhancement appears to require 4+ stories.

This exceeds the 1-3 story limit for lightweight brownfield epics. For enhancements of this size, I recommend using the full brownfield PRD/Architecture process to ensure comprehensive planning.

Would you like to:
1. Use the full brownfield PRD process (*create-brownfield-prd command)
2. Reduce the scope to fit within 3 stories
3. Cancel this epic creation
```

**Recovery Options**:
1. **Escalate to full PRD**: User chooses option 1, PM exits this task and invokes `create-brownfield-prd` command
2. **Reduce scope**: User chooses option 2, PM returns to Section 1 to re-scope with user
3. **Cancel**: User chooses option 3, PM exits task

**Prevention**:
- Early scope assessment in Section 1
- Clear "When to Use This Task" guidance in task instructions

### Error Condition 2: High Risk to Existing System (Escalation Required)

**Detection Point**: Section 3B (Risk Assessment)

**Error Condition**:
```
IF risk_level > LOW THEN
  ERROR: Risk too high for lightweight epic process
```

**Error Message**:
```
⚠️ Risk Assessment: This enhancement poses medium to high risk to the existing system.

For high-risk enhancements, I recommend using the full brownfield PRD/Architecture process to ensure comprehensive risk assessment and mitigation planning.

Identified Risks:
- {{list of identified risks}}

Would you like to:
1. Use the full brownfield PRD/Architecture process
2. Revise the enhancement to reduce risk
3. Proceed with caution (not recommended)
4. Cancel this epic creation
```

**Recovery Options**:
1. **Escalate to full PRD**: User chooses option 1, PM exits and invokes `create-brownfield-prd` command
2. **Reduce risk**: User chooses option 2, PM returns to Section 2F to refine risk mitigation with user
3. **Proceed with caution**: User chooses option 3 (not recommended), PM documents risk acceptance and proceeds
4. **Cancel**: User chooses option 4, PM exits task

**Prevention**:
- Early risk assessment in Section 1 (informal)
- Formal risk assessment in Section 3B with clear escalation criteria

### Error Condition 3: Architectural Changes Required (Escalation Required)

**Detection Point**: Section 1 (Project Analysis) - During architecture patterns analysis

**Error Condition**:
```
IF architectural_changes_required == TRUE THEN
  ERROR: Architectural planning required
```

**Error Message**:
```
⚠️ Architecture Assessment: This enhancement requires architectural planning.

The enhancement appears to require changes to existing architecture patterns or introduction of new patterns. For enhancements requiring architectural work, I recommend using the full brownfield Architecture process.

Architectural Considerations:
- {{list of architectural changes needed}}

Would you like to:
1. Use the full brownfield Architecture process
2. Revise the enhancement to fit within existing patterns
3. Cancel this epic creation
```

**Recovery Options**:
1. **Escalate to Architecture**: User chooses option 1, PM exits and recommends creating brownfield architecture document
2. **Fit within patterns**: User chooses option 2, PM returns to Section 1 to re-scope with user
3. **Cancel**: User chooses option 3, PM exits task

### Error Condition 4: Missing Critical Information

**Detection Point**: Throughout execution (Sections 1-3)

**Error Condition**:
```
IF any_required_field_is_missing THEN
  ERROR: Missing critical information
```

**Error Scenarios**:
- Project purpose not provided
- Technology stack not identified
- Integration points not specified
- Enhancement description unclear
- Success criteria missing or unmeasurable

**Error Message**:
```
⚠️ Missing Information: I need additional information to proceed.

Missing:
- {{list of missing required fields}}

Please provide the following information:
{{specific questions to elicit missing information}}
```

**Recovery Options**:
- Re-elicit missing information from user
- If user cannot provide information, suggest pausing until information is available

### Error Condition 5: Story Breakdown Validation Failure

**Detection Point**: Section 2D (Stories) - After story breakdown

**Error Condition**:
```
IF any_story_is_improperly_scoped THEN
  ERROR: Story breakdown validation failure
```

**Error Scenarios**:
- Story is too large (estimated >16 hours of dev work)
- Story is too small (estimated <2 hours of dev work)
- Stories are not logically sequenced
- Stories have unclear deliverables

**Error Message**:
```
⚠️ Story Breakdown Issue: One or more stories appear to be improperly scoped.

Issues Identified:
- {{list of story scoping issues}}

Would you like to:
1. Re-scope the problematic stories
2. Break down large stories further
3. Combine small stories
4. Adjust the story sequence
```

**Recovery Options**:
- Re-scope stories with user input
- Break down large stories into smaller chunks
- Combine small stories into single deliverable
- Adjust story sequence for safer incremental delivery

### Error Condition 6: Completeness Check Failure

**Detection Point**: Section 3C (Completeness Check)

**Error Condition**:
```
IF any_completeness_check_fails THEN
  ERROR: Epic incomplete
```

**Error Scenarios**:
- Epic goal is unclear or not achievable
- Stories are not properly scoped
- Success criteria are not measurable
- Dependencies are not identified

**Error Message**:
```
⚠️ Completeness Check: The epic is not yet complete.

Issues:
- {{list of completeness issues}}

I need to address these issues before handing off to the Story Manager. Let's work through them:

{{specific questions to address each issue}}
```

**Recovery Options**:
- Address each completeness issue iteratively with user
- Refine epic goal if unclear
- Re-scope stories if needed
- Define measurable success criteria
- Identify missing dependencies

### Validation Rules Summary

**Scope Validation Rules**:
- Story count MUST be 1-3 (hard limit)
- Estimated dev time per story MUST be 4-16 hours
- Total epic dev time SHOULD be <48 hours
- No architectural changes allowed
- Integration complexity MUST be low-to-medium

**Risk Validation Rules**:
- Risk level MUST be LOW
- Rollback plan MUST be feasible (executable without data loss)
- Testing MUST cover existing functionality (regression testing required)
- Team MUST have sufficient knowledge of integration points

**Completeness Validation Rules**:
- Epic goal MUST be clear and achievable
- Stories MUST be independently testable and deliverable
- Success criteria MUST be measurable (objective)
- Dependencies MUST be identified (systems, services, libraries, knowledge, approvals)

**Output Validation Rules**:
- Epic document MUST include all required sections
- Handoff message MUST include all required elements
- File MUST be created successfully (if file-based output)
- Downstream agents MUST be able to read epic document

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**Upstream Tasks** (Execute Before This Task):
- None (this is an entry point task for brownfield enhancements)

**Downstream Tasks** (Execute After This Task):
- `create-next-story.md` (SM agent uses epic to create detailed stories)
- `validate-next-story.md` (PO agent may validate stories before development)
- Story implementation workflow (Dev agent implements stories)

### Agent Dependencies

**Primary Agent**: PM (John)

**Secondary Agents** (Handoff Targets):
- **SM (Story Manager - Bob)**: Receives epic handoff, develops detailed user stories
- **PO (Product Owner - Sarah)**: May validate epic before SM story development (optional)
- **Dev (Developer - James)**: May review epic for technical feasibility (optional)

**Collaboration Pattern**:
```
PM (create epic) → SM (create stories) → Dev (implement stories) → QA (review stories)
```

### File Dependencies

**Required Files**:
- `.bmad-core/core-config.yaml`: Project configuration (used for path resolution if outputting to file)

**Optional Files**:
- Existing codebase (for understanding architecture patterns and integration points)
- Existing documentation (for understanding project purpose and tech stack)

**Output Files**:
- `docs/epics/{{epic-id}}-{{epic-slug}}.md`: Epic document (if file-based output)
- `docs/epics/{{epic-id}}-handoff.md`: Handoff document (if file-based handoff)

### Data Dependencies

**Configuration Data** (from `core-config.yaml`):
- `epics_location` (optional): Base directory for epic documents (e.g., "docs/epics")
- `project_name` (optional): Project name for context
- `technology_stack` (optional): Technology stack (if pre-configured)

**Runtime Data** (Gathered During Execution):
- Project purpose and current functionality
- Technology stack
- Architecture patterns
- Integration points
- Enhancement description
- Success criteria
- Risk assessment
- Story breakdown

### Knowledge Dependencies

**PM Agent Knowledge**:
- Understanding of brownfield development practices
- Ability to assess scope and complexity
- Knowledge of risk assessment principles
- Understanding of story breakdown best practices
- Familiarity with various technology stacks (for context understanding)

**User Knowledge**:
- Understanding of existing project (purpose, tech stack, architecture)
- Clear vision for enhancement
- Ability to identify integration points
- Understanding of existing system risks

### Tool/System Dependencies

**Optional Tools**:
- File system access (if outputting epic document to file)
- Multi-agent orchestration system (if directly invoking SM agent)
- Git repository (for code context and history)

**Runtime Environment**:
- PM agent must be active and in persona
- User must be available for interactive elicitation

---

## 9. Integration Points

### Integration Point 1: SM Agent (Story Manager) Handoff

**Integration Type**: Agent-to-Agent Handoff

**Handoff Trigger**: Completion of Section 4 (Handoff to Story Manager)

**Handoff Method**:
- **Option 1**: Direct agent invocation (multi-agent environment)
  - PM invokes SM agent with epic context
  - SM agent receives epic document and handoff message
  - SM executes `create-next-story` task using epic context

- **Option 2**: File-based handoff (file-based workflow)
  - PM creates epic document at `docs/epics/{{epic-id}}-{{epic-slug}}.md`
  - PM notifies user that epic is ready for SM
  - User manually invokes SM agent or system automatically triggers SM

- **Option 3**: Manual handoff (single-agent environment)
  - PM outputs epic document and handoff message
  - User manually provides epic to SM agent when ready

**Data Passed to SM**:
```yaml
epic_context:
  epic_id: {{epic-id}}
  epic_name: {{enhancement-name}}
  epic_goal: {{epic-goal}}
  technology_stack: {{array of technologies}}
  integration_points: {{array of integration points}}
  existing_patterns: {{array of patterns to follow}}
  compatibility_requirements: {{array of requirements}}
  stories_breakdown:
    - story_id: 1
      title: {{story-1-title}}
      description: {{story-1-description}}
    - story_id: 2
      title: {{story-2-title}}
      description: {{story-2-description}}
    - story_id: 3
      title: {{story-3-title}}
      description: {{story-3-description}}
  risk_mitigation:
    primary_risk: {{risk}}
    mitigation: {{mitigation}}
    rollback_plan: {{rollback}}
  epic_document_path: {{path-to-epic-file}}
```

**SM Agent Expectations**:
- SM will use epic context to create detailed user stories via `create-next-story` task
- SM will follow existing patterns specified in epic
- SM will ensure stories maintain system integrity
- SM will include regression testing in story acceptance criteria

**Error Handling**:
- If handoff fails, PM notifies user and suggests manual handoff
- If SM is unavailable, epic document is saved for later processing

### Integration Point 2: PO Agent (Product Owner) Validation (Optional)

**Integration Type**: Optional Validation Checkpoint

**Validation Trigger**: User request or workflow configuration

**Validation Method**:
- **Option 1**: Direct PO agent invocation for epic validation
  - PM invokes PO agent with epic document
  - PO executes validation checklist (e.g., `execute-checklist.md` with `pm-checklist`)
  - PO provides feedback to PM
  - PM refines epic based on PO feedback

- **Option 2**: User manually requests PO validation
  - PM outputs epic document
  - User invokes PO agent for validation
  - User provides PO feedback to PM for refinement

**Data Passed to PO**:
```yaml
validation_request:
  artifact_type: brownfield-epic
  epic_id: {{epic-id}}
  epic_document_path: {{path-to-epic-file}}
  validation_checklist: pm-checklist
```

**PO Validation Focus**:
- Epic goal is clear and aligned with product strategy
- Success criteria are measurable and business-focused
- Stories are appropriately scoped and sequenced
- Compatibility requirements are sufficient
- Risk mitigation is adequate

**Error Handling**:
- If PO validation fails, PM refines epic based on feedback and re-submits
- If PO is unavailable, PM proceeds with handoff to SM (validation optional)

### Integration Point 3: Dev Agent (Developer) Feasibility Review (Optional)

**Integration Type**: Optional Technical Feasibility Check

**Feasibility Trigger**: High integration complexity or user request

**Feasibility Method**:
- PM requests Dev agent review of epic for technical feasibility
- Dev reviews integration points, architecture patterns, and compatibility requirements
- Dev provides feedback on feasibility and potential technical challenges
- PM refines epic based on Dev feedback

**Data Passed to Dev**:
```yaml
feasibility_request:
  epic_id: {{epic-id}}
  epic_document_path: {{path-to-epic-file}}
  focus_areas:
    - integration_points: {{array of integration points}}
    - architecture_patterns: {{array of patterns}}
    - compatibility_requirements: {{array of requirements}}
    - estimated_dev_time: {{hours}}
```

**Dev Feasibility Focus**:
- Integration points are realistic and well-defined
- Architecture patterns are consistent with existing codebase
- Compatibility requirements are achievable
- Estimated dev time is reasonable
- No hidden technical challenges

**Error Handling**:
- If Dev identifies feasibility issues, PM refines epic or escalates to full PRD
- If Dev is unavailable, PM proceeds with handoff to SM (feasibility check optional)

### Integration Point 4: Configuration System (core-config.yaml)

**Integration Type**: Configuration Data Read

**Configuration Usage**:
- PM reads `core-config.yaml` for path resolution (if outputting epic document to file)
- PM may read project metadata (project name, tech stack) if available

**Configuration Keys Used**:
```yaml
# Optional configuration keys
epics_location: "docs/epics"  # Base directory for epic documents
project_name: "MyProject"     # Project name for context
technology_stack:             # Pre-configured tech stack (if available)
  - "React 18"
  - "Node.js 16"
  - "PostgreSQL 14"
```

**Error Handling**:
- If `core-config.yaml` missing, PM assumes default paths or prompts user
- If optional keys missing, PM proceeds without them (not required)

### Integration Point 5: File System (Epic Document Output)

**Integration Type**: File Write

**File Write Trigger**: Completion of epic creation (before handoff)

**File Write Location**: `{{epics_location}}/{{epic-id}}-{{epic-slug}}.md`

**File Write Process**:
1. Resolve epic output path from configuration or user input
2. Generate epic document content (markdown with optional YAML front matter)
3. Write file to file system
4. Validate file write success
5. Notify user of file location

**Error Handling**:
- If file write fails (permissions, disk space, etc.), PM notifies user and suggests alternate output method
- If output path is invalid, PM prompts user for correct path

---

## 10. Configuration References

### Core Configuration (core-config.yaml)

**Configuration Schema**:

```yaml
# Optional configuration for brownfield-create-epic task
epics_location: string  # Base directory for epic documents (default: "docs/epics")
project_name: string    # Project name for context (default: null)
technology_stack:       # Pre-configured tech stack (default: null)
  - string              # Technology name (e.g., "React 18", "Node.js 16")
```

**Configuration Usage**:

#### epics_location (Optional)
- **Type**: String (path)
- **Default**: "docs/epics"
- **Purpose**: Specifies base directory for epic document output
- **Usage**: If configured, PM writes epic document to `{{epics_location}}/{{epic-id}}-{{epic-slug}}.md`
- **Example**: `epics_location: "docs/project/epics"`

#### project_name (Optional)
- **Type**: String
- **Default**: null
- **Purpose**: Pre-configured project name for context
- **Usage**: If configured, PM includes project name in epic document metadata
- **Example**: `project_name: "MyAwesomeProject"`

#### technology_stack (Optional)
- **Type**: Array of strings
- **Default**: null
- **Purpose**: Pre-configured technology stack for project
- **Usage**: If configured, PM can use as default when gathering project context (user can override)
- **Example**:
  ```yaml
  technology_stack:
    - "React 18"
    - "Node.js 16 with Express"
    - "PostgreSQL 14"
    - "S3 for file storage"
  ```

### Task-Specific Configuration

**No task-specific configuration required**. This task is designed to be lightweight and flexible, gathering all necessary context through user elicitation.

### Environment Variables

**No environment variables required** for basic operation.

**Optional Environment Variables** (for advanced use cases):
- `BMAD_EPICS_PATH`: Override default epics location (alternative to core-config.yaml)
- `BMAD_AUTO_HANDOFF`: Enable automatic SM agent invocation after epic creation (true/false)

---

## 11. Performance Characteristics

### Execution Time

**Typical Execution Time**:
- **Section 1 (Project Analysis)**: 5-10 minutes (interactive elicitation)
- **Section 2 (Epic Creation)**: 5-15 minutes (structured documentation)
- **Section 3 (Validation Checklist)**: 2-5 minutes (validation and review)
- **Section 4 (Handoff)**: 1-2 minutes (handoff message generation)
- **Total**: 13-32 minutes (depends on user interaction speed and complexity)

**Fast-Track Execution** (experienced users with pre-gathered context):
- **Total**: 8-15 minutes (minimal back-and-forth)

**Complex Execution** (high integration complexity, multiple refinement iterations):
- **Total**: 30-60 minutes (includes multiple validation cycles)

### Task Complexity Factors

**Factors That Increase Execution Time**:
- Unclear enhancement scope (requires multiple clarification rounds)
- Complex integration points (requires deeper analysis)
- Unfamiliar technology stack (requires more context gathering)
- Multiple story breakdown iterations (requires refinement)
- Risk mitigation complexity (requires detailed planning)

**Factors That Decrease Execution Time**:
- Clear, well-scoped enhancement description
- Simple integration points
- Familiar technology stack
- Straightforward story breakdown
- Low risk to existing system

### Scalability

**Single Epic**: 13-32 minutes

**Multiple Epics** (sequential):
- 2 epics: 26-64 minutes
- 3 epics: 39-96 minutes
- 5 epics: 65-160 minutes

**Optimization Strategies**:
- Pre-gather project context (reuse for multiple epics)
- Use configuration file to store common project metadata
- Streamline elicitation for experienced users (skip verbose explanations)
- Batch similar epics (e.g., multiple UI enhancements)

### Resource Utilization

**Memory**: Minimal (text processing only)

**Disk I/O**:
- 1 read operation (`core-config.yaml`, if used)
- 1 write operation (epic document output)
- File size: ~2-5 KB per epic document

**Network**: None (unless using remote file storage or multi-agent invocation)

**LLM Token Usage** (Approximate):
- **Input Tokens**: 1,500-2,500 per epic (task instructions + user context)
- **Output Tokens**: 800-1,500 per epic (epic document generation)
- **Total**: 2,300-4,000 tokens per epic

---

## 12. Security Considerations

### Input Validation

**User Input Validation**:
- **Enhancement description**: Sanitize for markdown injection (escape special characters)
- **Project context**: Validate that provided information is reasonable (no code injection)
- **File paths**: Validate file paths to prevent directory traversal attacks
  - Ensure paths are within project directory
  - Reject paths with `..` or absolute paths outside project

**Example Validation**:
```javascript
// Pseudo-code for file path validation
function validateEpicPath(epicPath, projectRoot) {
  const resolvedPath = path.resolve(epicPath);
  const projectPath = path.resolve(projectRoot);

  if (!resolvedPath.startsWith(projectPath)) {
    throw new Error("Epic path must be within project directory");
  }

  return resolvedPath;
}
```

### File System Security

**File Write Security**:
- **Permission Check**: Verify write permissions before file creation
- **Overwrite Protection**: Warn if epic document already exists, confirm overwrite
- **Path Validation**: Ensure output path is within project directory
- **Content Sanitization**: Escape user-provided content in markdown to prevent injection

**Example Protection**:
```javascript
// Pseudo-code for file write protection
function writeEpicFile(epicPath, content, overwrite = false) {
  // Check if file exists
  if (fs.existsSync(epicPath) && !overwrite) {
    throw new Error("Epic file already exists. Use overwrite flag to replace.");
  }

  // Validate path
  validateEpicPath(epicPath, projectRoot);

  // Sanitize content
  const sanitizedContent = sanitizeMarkdown(content);

  // Write file
  fs.writeFileSync(epicPath, sanitizedContent, { mode: 0o644 });
}
```

### Data Privacy

**Sensitive Information Handling**:
- **Project Context**: User may provide sensitive project information (tech stack, architecture details)
- **Storage**: If using cloud LLM, be aware that project context is sent to LLM provider
- **File Storage**: Epic documents are stored locally (user's file system)
- **Recommendation**: Do not include sensitive credentials, API keys, or PII in epic descriptions

**Best Practices**:
- Remind user to avoid including sensitive information in epic descriptions
- If using cloud storage for epic documents, ensure proper access controls
- Consider using environment variables or configuration files for sensitive project metadata

### Access Control

**File Access Control**:
- Epic documents should be readable by all team members (developers, QA, PO, SM)
- Epic documents should be writable only by PM and PO agents (for corrections/updates)
- Recommended file permissions: `644` (rw-r--r--)

**Agent Access Control**:
- **PM Agent**: Full access (create, read, update epic documents)
- **PO Agent**: Read and update access (for validation and corrections)
- **SM Agent**: Read access (for story development)
- **Dev Agent**: Read access (for implementation context)
- **QA Agent**: Read access (for test planning context)

### Audit Trail

**Change Tracking**:
- If using file-based storage, leverage git for version control
- Track who created epic, when, and any subsequent modifications
- Consider adding metadata to epic document for audit trail

**Example Metadata**:
```yaml
---
epic_id: {{epic-id}}
created_by: pm-agent
created_date: {{YYYY-MM-DD}}
last_modified_by: po-agent
last_modified_date: {{YYYY-MM-DD}}
version: 1.2
---
```

---

## 13. Testing Approach

### Unit Testing

**Testable Components**:

#### 1. Scope Validation Logic
**Test Cases**:
- Test that story count > 3 triggers escalation
- Test that architectural changes trigger escalation
- Test that high integration complexity triggers escalation
- Test that high risk level triggers escalation
- Test that valid scope proceeds to epic creation

**Example Test**:
```javascript
describe('Scope Validation', () => {
  it('should escalate when story count > 3', () => {
    const scopeData = { story_count: 4, architecture_changes: false, integration_complexity: 'LOW', risk_level: 'LOW' };
    const result = validateScope(scopeData);
    expect(result.should_escalate).toBe(true);
    expect(result.escalation_reason).toContain('4+ stories');
  });

  it('should proceed when story count <= 3 and all checks pass', () => {
    const scopeData = { story_count: 3, architecture_changes: false, integration_complexity: 'LOW', risk_level: 'LOW' };
    const result = validateScope(scopeData);
    expect(result.should_escalate).toBe(false);
  });
});
```

#### 2. Epic Document Generation
**Test Cases**:
- Test that epic document includes all required sections
- Test that markdown formatting is correct
- Test that YAML front matter is valid
- Test that user-provided content is properly escaped

**Example Test**:
```javascript
describe('Epic Document Generation', () => {
  it('should generate valid epic document with all sections', () => {
    const epicData = {
      epic_id: 1,
      epic_name: 'Test Enhancement',
      epic_goal: 'Enable feature X',
      // ... other fields
    };
    const document = generateEpicDocument(epicData);
    expect(document).toContain('# Test Enhancement - Brownfield Enhancement');
    expect(document).toContain('## Epic Goal');
    expect(document).toContain('## Epic Description');
    expect(document).toContain('## Stories');
    expect(document).toContain('## Compatibility Requirements');
    expect(document).toContain('## Risk Mitigation');
    expect(document).toContain('## Definition of Done');
  });
});
```

#### 3. Risk Level Calculation
**Test Cases**:
- Test risk score calculation based on multiple factors
- Test risk level determination (LOW/MEDIUM/HIGH)
- Test escalation trigger when risk_level > LOW

**Example Test**:
```javascript
describe('Risk Level Calculation', () => {
  it('should calculate HIGH risk when multiple risk factors present', () => {
    const riskData = {
      risk_to_existing_system: 'MEDIUM',
      rollback_plan_feasible: false,
      testing_covers_existing: true,
      team_has_knowledge: true
    };
    const result = calculateRiskLevel(riskData);
    expect(result.risk_score).toBe(5);
    expect(result.risk_level).toBe('HIGH');
    expect(result.should_escalate).toBe(true);
  });

  it('should calculate LOW risk when all checks pass', () => {
    const riskData = {
      risk_to_existing_system: 'LOW',
      rollback_plan_feasible: true,
      testing_covers_existing: true,
      team_has_knowledge: true
    };
    const result = calculateRiskLevel(riskData);
    expect(result.risk_score).toBe(0);
    expect(result.risk_level).toBe('LOW');
    expect(result.should_escalate).toBe(false);
  });
});
```

#### 4. File Path Validation
**Test Cases**:
- Test that valid paths are accepted
- Test that paths with `..` are rejected (directory traversal prevention)
- Test that absolute paths outside project are rejected
- Test that relative paths within project are accepted

**Example Test**:
```javascript
describe('File Path Validation', () => {
  it('should accept valid relative path within project', () => {
    const epicPath = 'docs/epics/1-test-epic.md';
    const projectRoot = '/home/user/project';
    expect(() => validateEpicPath(epicPath, projectRoot)).not.toThrow();
  });

  it('should reject path with directory traversal', () => {
    const epicPath = '../../../etc/passwd';
    const projectRoot = '/home/user/project';
    expect(() => validateEpicPath(epicPath, projectRoot)).toThrow('must be within project directory');
  });
});
```

### Integration Testing

**Integration Test Scenarios**:

#### 1. End-to-End Epic Creation Flow
**Test Scenario**: User provides context, PM creates epic, epic is written to file system, SM receives handoff

**Test Steps**:
1. Simulate user providing project context and enhancement description
2. PM executes brownfield-create-epic task
3. Verify epic document is created at correct file path
4. Verify epic document contains all required sections
5. Verify handoff message is generated correctly
6. Simulate SM agent receiving handoff and reading epic document

**Expected Results**:
- Epic document created successfully
- All sections present and properly formatted
- SM agent can read and parse epic document

#### 2. Escalation to Full PRD Process
**Test Scenario**: User provides scope that requires 4+ stories, PM escalates to full PRD

**Test Steps**:
1. Simulate user providing large-scope enhancement requiring 4+ stories
2. PM executes brownfield-create-epic task
3. PM detects scope is too large in Section 1
4. PM halts and recommends full brownfield PRD process

**Expected Results**:
- PM correctly identifies scope is too large
- PM halts execution before creating epic
- PM provides clear escalation message to user

#### 3. Risk Escalation
**Test Scenario**: User provides high-risk enhancement, PM escalates to full PRD

**Test Steps**:
1. Simulate user providing high-risk enhancement
2. PM executes brownfield-create-epic task through Section 2
3. PM detects high risk in Section 3B
4. PM halts and recommends full brownfield PRD/Architecture process

**Expected Results**:
- PM correctly identifies high risk level
- PM halts execution before handoff
- PM provides clear escalation message with risk details

### System Testing

**System Test Scenarios**:

#### 1. Multi-Agent Workflow
**Test Scenario**: Complete workflow from PM creating epic to SM developing stories to Dev implementing

**Test Steps**:
1. PM creates epic using brownfield-create-epic task
2. PM hands off to SM
3. SM creates detailed stories using create-next-story task
4. Dev implements first story
5. QA reviews first story

**Expected Results**:
- Epic flows smoothly from PM → SM → Dev → QA
- Each agent has necessary context from previous steps
- No information loss during handoffs

#### 2. Configuration Integration
**Test Scenario**: PM uses core-config.yaml for path resolution and project metadata

**Test Steps**:
1. Configure `epics_location`, `project_name`, and `technology_stack` in core-config.yaml
2. PM executes brownfield-create-epic task
3. PM reads configuration and uses for path resolution and defaults

**Expected Results**:
- PM correctly reads configuration
- Epic document written to configured location
- Project metadata used as defaults (user can override)

### Acceptance Testing

**User Acceptance Criteria**:

#### 1. Epic Creation Success
- [ ] User can provide project context and enhancement description
- [ ] PM creates epic document with all required sections
- [ ] Epic document is readable and well-formatted
- [ ] Epic document is written to correct location
- [ ] SM receives handoff with sufficient context to develop stories

#### 2. Escalation Behavior
- [ ] PM correctly identifies when scope is too large
- [ ] PM correctly identifies when architectural changes are needed
- [ ] PM correctly identifies when risk is too high
- [ ] PM provides clear escalation messages with reasoning
- [ ] User can choose to reduce scope, escalate, or cancel

#### 3. Validation and Error Handling
- [ ] PM validates all required information is provided
- [ ] PM handles missing information gracefully (prompts user)
- [ ] PM validates story breakdown is appropriate
- [ ] PM validates risk mitigation is adequate
- [ ] PM prevents file write errors (permissions, path validation)

---

## 14. Monitoring & Observability

### Key Metrics

**Task Execution Metrics**:
- **Epic Creation Time**: Average time to complete epic creation (target: <20 minutes)
- **Escalation Rate**: Percentage of epics that escalate to full PRD (target: <30%)
- **Success Rate**: Percentage of epics that complete successfully (target: >90%)
- **Validation Failure Rate**: Percentage of epics that fail validation checkpoints (target: <10%)

**Quality Metrics**:
- **Story Breakdown Quality**: Average number of story refinement iterations (target: <2)
- **Risk Identification Rate**: Percentage of epics with identified risks (target: 100%)
- **Handoff Success Rate**: Percentage of successful SM handoffs (target: 100%)

**User Experience Metrics**:
- **User Satisfaction**: User rating of epic creation experience (target: >4/5)
- **Context Gathering Efficiency**: Number of back-and-forth interactions for context (target: <8)
- **Clarity of Output**: User rating of epic document clarity (target: >4/5)

### Logging

**Log Events**:

#### Task Start
```
[INFO] brownfield-create-epic task started
  user_id: {{user-id}}
  timestamp: {{ISO-8601-timestamp}}
```

#### Section Completion
```
[INFO] Section completed
  section: {{section-name}}
  duration: {{seconds}}
  timestamp: {{ISO-8601-timestamp}}
```

#### Escalation Triggered
```
[WARN] Escalation triggered
  reason: {{escalation-reason}}
  section: {{section-name}}
  recommended_action: {{action}}
  timestamp: {{ISO-8601-timestamp}}
```

#### Validation Failure
```
[WARN] Validation failed
  validation_type: {{scope|risk|completeness}}
  failed_checks: [{{array-of-failed-checks}}]
  timestamp: {{ISO-8601-timestamp}}
```

#### Epic Document Created
```
[INFO] Epic document created
  epic_id: {{epic-id}}
  epic_name: {{epic-name}}
  file_path: {{path-to-epic-file}}
  story_count: {{1-3}}
  timestamp: {{ISO-8601-timestamp}}
```

#### Handoff Completed
```
[INFO] SM handoff completed
  epic_id: {{epic-id}}
  handoff_method: {{direct-invocation|file-based|manual}}
  timestamp: {{ISO-8601-timestamp}}
```

#### Task Completion
```
[INFO] brownfield-create-epic task completed
  epic_id: {{epic-id}}
  total_duration: {{seconds}}
  success: {{true|false}}
  timestamp: {{ISO-8601-timestamp}}
```

### Error Tracking

**Error Event Types**:

#### File Write Error
```
[ERROR] Failed to write epic document
  epic_id: {{epic-id}}
  file_path: {{attempted-path}}
  error: {{error-message}}
  timestamp: {{ISO-8601-timestamp}}
```

#### Configuration Error
```
[ERROR] Configuration read failed
  config_file: .bmad-core/core-config.yaml
  error: {{error-message}}
  timestamp: {{ISO-8601-timestamp}}
```

#### Validation Error
```
[ERROR] Critical validation error
  validation_type: {{type}}
  error: {{error-message}}
  timestamp: {{ISO-8601-timestamp}}
```

### Alerts

**Alert Conditions**:

#### High Escalation Rate
```
IF escalation_rate > 50% OVER last_10_epics THEN
  ALERT: "High escalation rate detected. Review task guidance or user training."
```

#### Low Success Rate
```
IF success_rate < 80% OVER last_10_epics THEN
  ALERT: "Low success rate detected. Investigate validation failures and user experience issues."
```

#### File Write Failures
```
IF file_write_failures > 2 OVER last_hour THEN
  ALERT: "Multiple file write failures. Check file system permissions and disk space."
```

---

## 15. Troubleshooting Guide

### Common Issues

#### Issue 1: Scope Keeps Getting Identified as Too Large

**Symptoms**:
- PM keeps recommending escalation to full PRD
- User believes scope is small enough for lightweight epic

**Root Causes**:
- User is underestimating complexity
- User is describing too many features in one epic
- PM is being overly conservative in scope assessment

**Resolution Steps**:
1. **Review story breakdown**: Ask user to break down epic into specific stories
2. **Estimate dev time**: Ask user to estimate dev time for each story (should be 4-16 hours each)
3. **Identify integration points**: If integration points are complex or numerous, scope may be too large
4. **Consider splitting**: Suggest splitting into multiple smaller epics
5. **If truly small**: User can override PM recommendation and proceed (with caution)

**Prevention**:
- Provide clear examples of appropriate scope in task instructions
- Train users on estimating story complexity
- Refine PM's scope assessment logic based on historical data

#### Issue 2: Risk Assessment Keeps Triggering Escalation

**Symptoms**:
- PM keeps identifying risk as too high for lightweight epic
- User believes risk is manageable

**Root Causes**:
- User is underestimating risk to existing system
- PM is being overly conservative in risk assessment
- Insufficient risk mitigation strategy provided

**Resolution Steps**:
1. **Review risk factors**: Identify specific risk factors PM is concerned about
2. **Enhance mitigation strategy**: Develop more comprehensive risk mitigation (feature flags, testing, rollback)
3. **Demonstrate feasibility**: Provide evidence that risk is manageable (similar past changes, team experience)
4. **Consider escalation**: If risk is genuinely high, accept escalation recommendation
5. **If truly low risk**: User can override PM recommendation and proceed (with caution and documented risk acceptance)

**Prevention**:
- Provide clear risk level definitions in task instructions
- Train users on identifying and mitigating risks
- Refine PM's risk assessment logic based on historical data

#### Issue 3: Epic Document Not Created or Unreadable

**Symptoms**:
- Epic document file not found after task completion
- Epic document file is empty or corrupted
- Epic document file has formatting issues

**Root Causes**:
- File write permissions insufficient
- File path misconfigured or invalid
- Disk space exhausted
- Markdown generation error

**Resolution Steps**:
1. **Check file permissions**: Ensure PM has write permissions to epic output directory
2. **Verify file path**: Confirm `epics_location` in core-config.yaml is correct
3. **Check disk space**: Ensure sufficient disk space available
4. **Review logs**: Check error logs for file write failures
5. **Manual creation**: As fallback, manually create epic document using PM's generated content

**Prevention**:
- Validate file path before attempting write
- Check disk space before attempting write
- Implement robust error handling for file operations
- Provide clear error messages to user

#### Issue 4: SM Agent Cannot Parse Epic Document

**Symptoms**:
- SM agent fails to create stories after receiving epic handoff
- SM agent reports missing information from epic
- SM agent reports formatting issues

**Root Causes**:
- Epic document missing required sections
- Epic document has markdown formatting errors
- SM agent expecting different epic format

**Resolution Steps**:
1. **Validate epic document**: Ensure all required sections are present
2. **Check markdown formatting**: Validate markdown syntax
3. **Review SM expectations**: Ensure epic format matches SM's expected input format
4. **Manual handoff**: As fallback, manually provide epic context to SM agent

**Prevention**:
- Validate epic document structure before handoff
- Standardize epic format across PM and SM agents
- Implement schema validation for epic documents

#### Issue 5: Story Breakdown Unclear or Too Vague

**Symptoms**:
- SM agent struggles to create detailed stories from epic
- Dev agent finds stories lack implementation guidance
- User finds story breakdown confusing

**Root Causes**:
- Epic story breakdown too high-level
- Insufficient technical details in story descriptions
- Story breakdown not logically sequenced

**Resolution Steps**:
1. **Enhance story descriptions**: Add more technical details to each story
2. **Clarify integration points**: Specify exactly where each story integrates with existing system
3. **Refine story sequence**: Ensure stories build on each other logically
4. **Provide acceptance criteria**: Add high-level acceptance criteria to each story in epic
5. **Iterate with user**: Collaborate with user to refine story breakdown

**Prevention**:
- Provide story breakdown examples in task instructions
- Train PM to include sufficient technical detail
- Review story breakdown with user before finalizing epic

---

## 16. ADK Translation Recommendations

### Recommended ADK Implementation: Cloud Function (2nd Gen)

**Rationale**:
- **Lightweight workflow**: This task is focused and straightforward (no complex multi-step reasoning required)
- **Structured inputs/outputs**: Clear input requirements and output format
- **Stateless execution**: No need to maintain state between steps (user interaction handled by orchestrator)
- **Fast execution**: Typical execution time <30 minutes, suitable for synchronous invocation
- **User interaction**: Interactive elicitation handled by orchestrator (not task itself)

**Alternative Consideration**: Reasoning Engine if interactive elicitation is complex and requires multi-turn conversations with decision logic.

---

### ADK Architecture Design

#### Component 1: Cloud Function - brownfield_create_epic

**Function Signature**:
```python
from google.cloud import functions_v2
from typing import Dict, List, Optional

@functions_v2.http
def brownfield_create_epic(request: functions_v2.Request) -> functions_v2.Response:
    """
    Create a brownfield epic for small enhancements (1-3 stories).

    Args:
        request: HTTP request containing epic context

    Returns:
        HTTP response with epic document and handoff message
    """
    pass
```

**Input Schema**:
```json
{
  "enhancement_name": "User Profile Photo Upload",
  "enhancement_description": "Enable users to upload and display custom profile photos",
  "existing_system_context": {
    "project_purpose": "User management system with authentication and profile features",
    "technology_stack": ["React 18", "Node.js 16", "PostgreSQL 14", "S3"],
    "architecture_patterns": ["RESTful API", "Controller-service-repository", "React hooks"],
    "integration_points": ["User profile API /api/users/:id", "ProfileCard component", "user table"]
  },
  "success_criteria": [
    "Users can upload JPG/PNG images up to 5MB",
    "Images display correctly in all profile views",
    "Existing profile functionality remains unchanged"
  ],
  "estimated_story_count": 3,
  "primary_risk": "Photo upload service disruption could block all profile updates",
  "mitigation_approach": "Feature flag isolation, comprehensive testing",
  "rollback_plan": "Toggle feature flag off, revert code, drop nullable column"
}
```

**Output Schema**:
```json
{
  "success": true,
  "epic_id": "1",
  "epic_document": {
    "epic_id": "1",
    "epic_name": "User Profile Photo Upload",
    "epic_goal": "Enable users to upload and display custom profile photos...",
    "epic_description": {
      "existing_system_context": { /* ... */ },
      "enhancement_details": { /* ... */ }
    },
    "stories": [
      { "story_id": 1, "title": "S3 Integration and Upload API", "description": "..." },
      { "story_id": 2, "title": "Profile Photo Display", "description": "..." },
      { "story_id": 3, "title": "Upload UI Component", "description": "..." }
    ],
    "compatibility_requirements": [ /* ... */ ],
    "risk_mitigation": { /* ... */ },
    "definition_of_done": [ /* ... */ ]
  },
  "handoff_message": "Story Manager Handoff: Please develop detailed user stories...",
  "validation": {
    "scope_validation_passed": true,
    "risk_validation_passed": true,
    "completeness_validation_passed": true
  },
  "escalation": null
}
```

**Error Response Schema**:
```json
{
  "success": false,
  "error": "Scope too large for lightweight epic",
  "escalation": {
    "reason": "Enhancement requires 4+ stories",
    "recommended_action": "Use full brownfield PRD/Architecture process",
    "escalation_type": "scope_too_large"
  }
}
```

**Implementation Outline**:
```python
def brownfield_create_epic(request: functions_v2.Request) -> functions_v2.Response:
    # 1. Parse input
    input_data = request.get_json()

    # 2. Validate scope (Section 1 validation)
    scope_validation = validate_scope(input_data)
    if scope_validation['should_escalate']:
        return Response(json.dumps({
            'success': False,
            'escalation': scope_validation['escalation']
        }), status=200, mimetype='application/json')

    # 3. Generate epic document (Section 2)
    epic_document = generate_epic_document(input_data)

    # 4. Validate risk (Section 3B)
    risk_validation = validate_risk(epic_document, input_data)
    if risk_validation['should_escalate']:
        return Response(json.dumps({
            'success': False,
            'escalation': risk_validation['escalation']
        }), status=200, mimetype='application/json')

    # 5. Validate completeness (Section 3C)
    completeness_validation = validate_completeness(epic_document)
    if not completeness_validation['passed']:
        return Response(json.dumps({
            'success': False,
            'error': 'Epic incomplete',
            'gaps': completeness_validation['gaps']
        }), status=400, mimetype='application/json')

    # 6. Generate handoff message (Section 4)
    handoff_message = generate_handoff_message(epic_document, input_data)

    # 7. Store epic document (Firestore)
    epic_id = store_epic_document(epic_document)

    # 8. Return response
    return Response(json.dumps({
        'success': True,
        'epic_id': epic_id,
        'epic_document': epic_document,
        'handoff_message': handoff_message,
        'validation': {
            'scope_validation_passed': True,
            'risk_validation_passed': True,
            'completeness_validation_passed': True
        }
    }), status=200, mimetype='application/json')
```

#### Component 2: Firestore Collection - epics

**Collection Schema**:
```
/projects/{project_id}/epics/{epic_id}
  - epic_id: string
  - epic_name: string
  - epic_type: "brownfield"
  - epic_goal: string
  - epic_description: object
      existing_system_context: object
      enhancement_details: object
  - stories: array[object]
  - compatibility_requirements: array[string]
  - risk_mitigation: object
  - definition_of_done: array[string]
  - status: "draft" | "validated" | "in_progress" | "completed"
  - created_by: "pm-agent"
  - created_at: timestamp
  - updated_at: timestamp
```

**Firestore Operations**:
- **Create Epic**: Store epic document after validation
- **Read Epic**: SM agent reads epic for story development
- **Update Epic**: PO agent updates epic for corrections (optional)
- **List Epics**: Query all epics for project dashboard

#### Component 3: Orchestrator Integration

**PM Agent Tool Registration**:
```python
from vertexai.preview import agent_builder

pm_agent = agent_builder.Agent(
    display_name="John - Product Manager",
    model="gemini-2.0-flash-001",
    tools=[
        agent_builder.Tool(
            name="brownfield_create_epic",
            description="Create a brownfield epic for small enhancements (1-3 stories)",
            function_declaration={
                "name": "brownfield_create_epic",
                "description": "Create a focused epic for small-to-medium brownfield enhancements that bypass full PRD process",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "enhancement_name": {"type": "string"},
                        "enhancement_description": {"type": "string"},
                        "existing_system_context": {"type": "object"},
                        "success_criteria": {"type": "array"},
                        "estimated_story_count": {"type": "number"},
                        "primary_risk": {"type": "string"},
                        "mitigation_approach": {"type": "string"},
                        "rollback_plan": {"type": "string"}
                    },
                    "required": ["enhancement_name", "enhancement_description", "existing_system_context"]
                }
            },
            function_url="https://us-central1-<project-id>.cloudfunctions.net/brownfield-create-epic"
        )
    ]
)
```

**Orchestrator Workflow**:
```
User Request: "Create a brownfield epic for profile photo upload"
  ↓
Orchestrator invokes PM Agent
  ↓
PM Agent elicits context from user (enhancement details, project context, etc.)
  ↓
PM Agent calls brownfield_create_epic Cloud Function with gathered context
  ↓
Cloud Function validates scope, generates epic, validates risk/completeness
  ↓
Cloud Function stores epic in Firestore
  ↓
Cloud Function returns epic document and handoff message
  ↓
PM Agent presents epic to user for confirmation
  ↓
PM Agent triggers SM Agent handoff (passes epic_id)
  ↓
SM Agent reads epic from Firestore
  ↓
SM Agent creates detailed stories using create-next-story workflow
```

---

### Integration with Other ADK Components

#### Integration 1: SM Agent (Story Manager) Handoff

**Handoff Trigger**: PM agent completes epic creation and validation

**Handoff Method**: Orchestrator invokes SM agent with epic context

**Data Passed**:
```json
{
  "agent": "sm-agent",
  "command": "create_next_story",
  "context": {
    "epic_id": "1",
    "epic_type": "brownfield",
    "project_id": "{{project-id}}"
  }
}
```

**SM Agent Behavior**:
- Read epic from Firestore using `epic_id`
- Use epic context to create first detailed story via `create-next-story` workflow
- Follow existing patterns specified in epic
- Include regression testing in story acceptance criteria

#### Integration 2: PO Agent (Product Owner) Validation (Optional)

**Validation Trigger**: User requests PO validation or workflow requires it

**Validation Method**: Orchestrator invokes PO agent with epic context

**Data Passed**:
```json
{
  "agent": "po-agent",
  "command": "validate_epic",
  "context": {
    "epic_id": "1",
    "project_id": "{{project-id}}",
    "validation_checklist": "pm-checklist"
  }
}
```

**PO Agent Behavior**:
- Read epic from Firestore
- Execute validation checklist (pm-checklist)
- Provide feedback to PM agent or user
- Update epic status in Firestore if validation passes

#### Integration 3: Configuration Service

**Configuration Read**: Cloud Function reads project configuration from Firestore

**Configuration Schema**:
```
/projects/{project_id}/config
  - epics_location: string (default: "docs/epics")
  - project_name: string
  - technology_stack: array[string]
```

**Configuration Usage**:
- If `epics_location` configured, use for file-based output (optional)
- If `technology_stack` configured, use as default (user can override)

---

### Deployment Configuration

**Cloud Function Deployment** (Terraform):
```hcl
resource "google_cloudfunctions2_function" "brownfield_create_epic" {
  name        = "brownfield-create-epic"
  location    = var.region
  description = "Create brownfield epic for small enhancements"

  build_config {
    runtime     = "python311"
    entry_point = "brownfield_create_epic"
    source {
      storage_source {
        bucket = google_storage_bucket.functions_source.name
        object = google_storage_bucket_object.brownfield_create_epic_source.name
      }
    }
  }

  service_config {
    max_instance_count = 10
    available_memory   = "512Mi"
    timeout_seconds    = 300
    environment_variables = {
      FIRESTORE_PROJECT_ID = var.project_id
      FIRESTORE_DATABASE   = "(default)"
    }
    service_account_email = google_service_account.function_sa.email
  }
}

# IAM permissions for function
resource "google_project_iam_member" "function_firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.function_sa.email}"
}
```

**Firestore Indexes** (if needed for querying):
```yaml
indexes:
  - collectionGroup: epics
    queryScope: COLLECTION
    fields:
      - fieldPath: project_id
        order: ASCENDING
      - fieldPath: status
        order: ASCENDING
      - fieldPath: created_at
        order: DESCENDING
```

---

### Cost Estimation

**Cloud Function Invocations**:
- **Frequency**: 50 epic creations per day
- **Duration**: 2 seconds per invocation (fast execution)
- **Memory**: 512 MB
- **Cost**: ~$0.05 per day (~$1.50/month)

**Firestore Operations**:
- **Writes**: 50 epic creations per day = 50 writes/day
- **Reads**: 50 epic reads (by SM agent) + 20 epic reads (by users/other agents) = 70 reads/day
- **Cost**: ~$0.01 per day (~$0.30/month)

**Total Estimated Cost**: ~$1.80/month (for 50 epic creations per day)

**Cost Scaling**:
- 100 epics/day: ~$3.60/month
- 500 epics/day: ~$18/month
- 1000 epics/day: ~$36/month

---

## 17. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-14 | Claude Code (AI Agent) | Initial comprehensive analysis of brownfield-create-epic task |

---

## 18. Related Documentation

### Related Tasks
- [create-next-story.md](create-next-story.md) - SM agent uses epic to create detailed stories
- [brownfield-create-story.md](brownfield-create-story.md) - Alternative lightweight task for single-story brownfield enhancements
- [create-doc.md](create-doc.md) - Full PRD creation (escalation path if scope too large)
- [shard-doc.md](shard-doc.md) - Document sharding (if full PRD created)
- [validate-next-story.md](validate-next-story.md) - PO agent validates stories before development

### Related Agents
- [PM Agent (John)](../agents/02-pm.md) - Primary agent for this task
- [SM Agent (Bob)](../agents/06-sm.md) - Downstream agent (story development)
- [PO Agent (Sarah)](../agents/05-po.md) - Optional validation agent

### Related Templates
- No templates used (this task generates epic documents directly)

### Related Workflows
- Brownfield Planning Workflow (epic creation → story development → implementation)

---

**Analysis Complete**: This comprehensive analysis provides a complete understanding of the brownfield-create-epic task, including execution flow, decision points, validation logic, ADK translation recommendations, and integration patterns. Ready for ADK implementation planning.
