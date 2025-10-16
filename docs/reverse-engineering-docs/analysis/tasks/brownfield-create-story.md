# Task Analysis: brownfield-create-story

**Task ID**: `brownfield-create-story`
**Task File**: `.bmad-core/tasks/brownfield-create-story.md`
**Primary Agent**: PM (John) or SM (Bob)
**Task Type**: Simplified Brownfield Story Creation Workflow
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: Low (Single-story, minimal-change brownfield enhancements)

**Related Task**: `.bmad-core/tasks/create-brownfield-story.md` (Comprehensive variant for complex brownfield)

---

## 1. Purpose & Scope

### Primary Purpose
Create a single, focused user story for **very small brownfield enhancements** that can be completed in one development session (approximately 4 hours or less). This task is designed for minimal additions or bug fixes that require awareness of existing system integration but don't warrant full epic planning or comprehensive architectural analysis.

### Scope Definition

**In Scope**:
- Single-story brownfield enhancements (1-4 hours development time)
- Bug fixes with existing system integration awareness
- Minimal additions following existing patterns exactly
- Straightforward integration with clear boundaries
- Isolated changes with minimal risk
- Quick project assessment (current system context)
- Story creation with integration focus
- Basic risk assessment and rollback planning

**Out of Scope**:
- Multi-story enhancements (use `brownfield-create-epic` instead)
- Architectural design work (use full brownfield PRD/Architecture process)
- Multiple integration points requiring coordination
- Significant design or planning work
- Complex brownfield projects with non-standard documentation (use `create-brownfield-story` instead)
- Changes requiring new architecture

### Key Characteristics
- **Single-session scope** - Story must be completable in one focused development session (~4 hours)
- **Minimal complexity** - Follows existing patterns exactly, no design work required
- **Integration-aware** - Considers existing system but only for straightforward touch points
- **Risk-conscious** - Includes rollback plan even for small changes
- **Pattern-following** - References existing patterns to follow
- **Existing-first mindset** - Prioritizes existing system integrity over new features

### Task Variants

BMad provides **two different tasks** for brownfield story creation:

1. **brownfield-create-story.md** (This task - Simplified)
   - For VERY SMALL changes (single session, ~4 hours)
   - Minimal assessment and planning
   - Follows existing patterns exactly
   - When to use: Bug fixes, minor additions, isolated changes

2. **create-brownfield-story.md** (Comprehensive variant)
   - For larger brownfield work requiring multiple sessions
   - Handles non-standard documentation formats
   - Progressive detail gathering with user interaction
   - When to use: Complex brownfield projects, missing documentation, unclear integration

**Critical Decision Point**: If complexity grows during analysis using this task, escalate to `brownfield-create-epic` or the comprehensive `create-brownfield-story` task.

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - enhancement_description: string   # Specific change to be made
  - user_type: string                 # Who benefits from this change
  - value_proposition: string         # Why this change matters

optional:
  - existing_functionality: string    # What currently exists in this area
  - technology_stack: string          # Relevant tech for this change
  - pattern_reference: string         # Existing pattern to follow
  - integration_points: array         # Where this connects to existing system
```

**Input Details**:
- **enhancement_description**: Clear, specific description of what needs to be added or fixed (e.g., "Add validation to email field on registration form")
- **user_type**: User role or persona who will benefit (e.g., "end user", "admin", "developer")
- **value_proposition**: Business or user value delivered by this change
- **existing_functionality**: Brief description of related existing functionality
- **technology_stack**: Relevant technologies used in the area being modified
- **pattern_reference**: Link or description of existing pattern to follow
- **integration_points**: Specific components or systems this change will touch

### Gathered Inputs (From User or Documentation)

**Current System Context** (Step 1):
- Relevant existing functionality
- Technology stack for this area
- Integration point(s) clearly understood
- Existing patterns for similar work

**Change Scope**:
- Specific change clearly defined
- Impact boundaries identified
- Success criteria established

### Prerequisites

**Project Requirements**:
- Existing codebase available for review
- Ability to identify existing patterns to follow
- Clear understanding of integration points
- Ability to test existing functionality

**Agent Requirements**:
- Authority to create story documents
- Access to existing codebase for pattern analysis
- Understanding of current project structure
- Ability to assess integration complexity

### Configuration Dependencies

Implicitly requires:
- Story file location (from `core-config.yaml` → `devStoryLocation` or project conventions)
- Access to existing codebase for pattern identification

---

## 3. Execution Flow

### High-Level Process (4 Steps)

```
Step 1: Quick Project Assessment
  ↓
Step 2: Story Creation
  ↓
Step 3: Risk and Compatibility Check
  ↓
Step 4: Validation Checklist
```

**Critical Rule**: If any step reveals complexity beyond "very small change", stop and escalate to `brownfield-create-epic` or `create-brownfield-story`.

---

### Step 1: Quick Project Assessment

**Purpose**: Gather minimal but essential context about the existing project to ensure safe integration.

**Process**:

**1.1 Current System Context Gathering**
- [ ] Identify relevant existing functionality
  - What features/components exist in the area being modified?
  - What's the current behavior that will be affected?
- [ ] Note technology stack for this area
  - What frameworks/libraries are used?
  - What versions are in play?
  - What language/runtime?
- [ ] Clearly understand integration point(s)
  - Where does this change connect to existing code?
  - What APIs/interfaces are involved?
  - What data flows are affected?
- [ ] Identify existing patterns for similar work
  - How were similar changes implemented previously?
  - What coding patterns/conventions should be followed?
  - Are there example files to reference?

**1.2 Change Scope Definition**
- [ ] Specific change clearly defined
  - Exactly what is being added/modified/fixed?
  - What are the boundaries of this change?
- [ ] Impact boundaries identified
  - What files will be modified?
  - What components will be affected?
  - What functionality might be impacted?
- [ ] Success criteria established
  - How will we know this change is complete?
  - What should the new behavior be?
  - What existing behavior must be preserved?

**Decision Point**:
- If gathering this information reveals multiple integration points, coordination needs, or unclear patterns → **ESCALATE** to `brownfield-create-epic`
- If information gathering takes more than 15-30 minutes → **ESCALATE** to `create-brownfield-story` for progressive context gathering

**Output**: Brief notes documenting current system context and change scope (internal working notes, not necessarily documented)

---

### Step 2: Story Creation

**Purpose**: Create a focused, implementation-ready story following a structured template.

**Process**:

**2.1 Story Title**
Format: `{{Specific Enhancement}} - Brownfield Addition`

Examples:
- "Add Email Validation to Registration Form - Brownfield Addition"
- "Fix Memory Leak in Background Sync - Brownfield Addition"
- "Add Export Button to Dashboard - Brownfield Addition"

**2.2 User Story**
Standard user story format:

```markdown
As a {{user type}},
I want {{specific action/capability}},
So that {{clear benefit/value}}.
```

Examples:
- "As an end user, I want email validation on the registration form, so that I receive immediate feedback on invalid email addresses."
- "As a system administrator, I want the background sync to not leak memory, so that the application remains stable during long-running operations."

**2.3 Story Context**
**Existing System Integration** section must include:

```markdown
**Existing System Integration:**

- Integrates with: {{existing component/system}}
- Technology: {{relevant tech stack}}
- Follows pattern: {{existing pattern to follow}}
- Touch points: {{specific integration points}}
```

Example:
```markdown
**Existing System Integration:**

- Integrates with: User Registration Module (src/auth/registration.ts)
- Technology: React 18, Zod validation library
- Follows pattern: Form validation pattern from Login component (src/auth/login.ts)
- Touch points: Registration form component, user service API
```

**2.4 Acceptance Criteria**

Three categories required:

**Functional Requirements** (1-3 criteria):
1. {{Primary functional requirement}}
2. {{Secondary functional requirement (if any)}}
3. {{Integration requirement}}

**Integration Requirements** (Must include):
4. Existing {{relevant functionality}} continues to work unchanged
5. New functionality follows existing {{pattern}} pattern
6. Integration with {{system/component}} maintains current behavior

**Quality Requirements** (Standard):
7. Change is covered by appropriate tests
8. Documentation is updated if needed
9. No regression in existing functionality verified

Example:
```markdown
#### Acceptance Criteria

**Functional Requirements:**
1. Email field validates format on blur and on submit
2. Clear error message displays below field for invalid emails
3. Registration form submit is blocked when email is invalid

**Integration Requirements:**
4. Existing registration flow (password validation, terms acceptance) continues to work unchanged
5. New email validation follows existing validation pattern from Login component
6. Integration with user service API maintains current request/response format

**Quality Requirements:**
7. Email validation is covered by unit and integration tests
8. Form validation documentation is updated with email validation rules
9. Existing registration tests pass without modification
```

**2.5 Technical Notes**

```markdown
#### Technical Notes

- **Integration Approach:** {{how it connects to existing system}}
- **Existing Pattern Reference:** {{link or description of pattern to follow}}
- **Key Constraints:** {{any important limitations or requirements}}
```

Example:
```markdown
#### Technical Notes

- **Integration Approach:** Add Zod email schema to registration form validation, following pattern from login form
- **Existing Pattern Reference:** See src/auth/login.ts lines 45-60 for existing email validation implementation
- **Key Constraints:** Must use existing Zod validation library (v3.21), cannot introduce new dependencies
```

**2.6 Definition of Done**

Standard checklist:
```markdown
#### Definition of Done

- [ ] Functional requirements met
- [ ] Integration requirements verified
- [ ] Existing functionality regression tested
- [ ] Code follows existing patterns and standards
- [ ] Tests pass (existing and new)
- [ ] Documentation updated if applicable
```

**Output**: Complete story document with all sections populated

---

### Step 3: Risk and Compatibility Check

**Purpose**: Identify primary risk to existing system and establish mitigation and rollback strategies.

**Process**:

**3.1 Minimal Risk Assessment**

```markdown
**Minimal Risk Assessment:**

- **Primary Risk:** {{main risk to existing system}}
- **Mitigation:** {{simple mitigation approach}}
- **Rollback:** {{how to undo if needed}}
```

**Risk Identification Guidelines**:
- What's the ONE main thing that could go wrong?
- What existing functionality is most at risk?
- What happens if this change fails in production?

Example:
```markdown
**Minimal Risk Assessment:**

- **Primary Risk:** Email validation might be too strict and reject valid email formats, blocking legitimate registrations
- **Mitigation:** Use standard RFC 5322 email validation (via Zod), test with diverse email formats including edge cases (plus addressing, subdomains, international domains)
- **Rollback:** Remove email validation from form schema, validation is non-breaking additive change so removal restores original behavior
```

**3.2 Compatibility Verification**

Four compatibility checks required:
```markdown
**Compatibility Verification:**

- [ ] No breaking changes to existing APIs
- [ ] Database changes (if any) are additive only
- [ ] UI changes follow existing design patterns
- [ ] Performance impact is negligible
```

**Verification Process**:
- **API Compatibility**: Does this change any function signatures, API endpoints, or data contracts?
- **Database Compatibility**: Are we adding columns/tables only, or modifying existing schema?
- **UI Compatibility**: Does this follow existing UI patterns, or introduce new visual paradigms?
- **Performance Compatibility**: Will this add measurable latency, memory usage, or resource consumption?

**Decision Point**:
- If any compatibility check fails → **STOP** and escalate to `brownfield-create-epic` for proper planning
- If performance impact is more than negligible → **STOP** and escalate for performance testing plan

**Output**: Risk assessment and compatibility verification documented in story

---

### Step 4: Validation Checklist

**Purpose**: Final verification that the story is appropriately scoped and ready for implementation.

**Process**:

**4.1 Scope Validation**

Verify all four conditions:
```markdown
**Scope Validation:**

- [ ] Story can be completed in one development session
- [ ] Integration approach is straightforward
- [ ] Follows existing patterns exactly
- [ ] No design or architecture work required
```

**Validation Questions**:
- **One session**: Can a developer complete this in 4 hours or less?
- **Straightforward integration**: Are integration points clear and simple?
- **Existing patterns**: Is there a clear existing pattern to follow?
- **No design**: Is this purely implementation following known patterns?

**If any checkbox is unchecked → ESCALATE**:
- Unchecked "one session" → Consider splitting into multiple stories via `brownfield-create-epic`
- Unchecked "straightforward" → Use `create-brownfield-story` for progressive context gathering
- Unchecked "existing patterns" → May need architectural guidance, escalate to full brownfield process
- Unchecked "no design" → Definitely need `brownfield-create-epic` or full brownfield PRD/Architecture

**4.2 Clarity Check**

Verify all four conditions:
```markdown
**Clarity Check:**

- [ ] Story requirements are unambiguous
- [ ] Integration points are clearly specified
- [ ] Success criteria are testable
- [ ] Rollback approach is simple
```

**Clarity Questions**:
- **Unambiguous**: Could two developers read this and implement the same solution?
- **Specified**: Are file paths, component names, and integration points named explicitly?
- **Testable**: Can we write tests that verify each success criterion?
- **Simple rollback**: Can we undo this in 5 minutes or less?

**If any checkbox is unchecked → REFINE**:
- Add more specific details to story
- Clarify integration points with file paths and component names
- Make success criteria more concrete and measurable
- Simplify rollback approach or add explicit rollback steps

**Decision Point**:
- If refinement takes more than 10 minutes → **ESCALATE** to `create-brownfield-story` for structured elicitation
- If requirements remain ambiguous after refinement → **ESCALATE** for user clarification or epic planning

**Output**: Validated story ready for developer handoff OR escalation decision

---

## 4. Decision Points & Branching Logic

### Decision Tree

```
START: User requests brownfield enhancement
  ↓
Q1: Can this be completed in one story (~4 hours)?
  ├─ NO → Use brownfield-create-epic (1-3 stories) OR full brownfield PRD process (4+ stories)
  └─ YES ↓

Q2: Are integration points straightforward?
  ├─ NO → Use create-brownfield-story (progressive context gathering)
  └─ YES ↓

Q3: Are existing patterns clear and easy to follow?
  ├─ NO → May need architectural guidance, escalate
  └─ YES ↓

Q4: Is design or architecture work required?
  ├─ YES → Use brownfield-create-epic or full brownfield process
  └─ NO ↓

Q5: During Step 1 (Assessment): Complexity growing?
  ├─ YES → ESCALATE to brownfield-create-epic
  └─ NO ↓

Q6: During Step 3 (Risk Check): High risk or compatibility issues?
  ├─ YES → ESCALATE for proper planning
  └─ NO ↓

Q7: During Step 4 (Validation): All checks pass?
  ├─ NO → REFINE (if quick) OR ESCALATE
  └─ YES ↓

END: Story complete and ready for implementation
```

### Escalation Paths

**Path 1: Escalate to brownfield-create-epic**
- **When**: Story requires 2-3 coordinated stories, some design work, multiple integration points
- **Trigger**: Complexity discovered during assessment or validation
- **Action**: Inform user, use `brownfield-create-epic` task instead

**Path 2: Escalate to create-brownfield-story**
- **When**: Non-standard documentation, unclear integration, need progressive context gathering
- **Trigger**: Missing information, ambiguous requirements, complex integration
- **Action**: Switch to comprehensive `create-brownfield-story` task for structured elicitation

**Path 3: Escalate to Full Brownfield PRD/Architecture Process**
- **When**: Multiple coordinated stories, architectural planning needed, significant integration
- **Trigger**: Scope reveals need for comprehensive planning
- **Action**: Inform user, initiate full brownfield planning workflow

**Path 4: Refine and Continue**
- **When**: Minor clarity issues, small information gaps
- **Trigger**: Validation checklist reveals fixable issues
- **Action**: Spend 5-10 minutes refining story, then re-validate

### Complexity Thresholds

| Indicator | Threshold | Action |
|-----------|-----------|--------|
| Development time estimate | > 4 hours | Escalate to epic |
| Integration points | > 2 clear touch points | Escalate to epic |
| Files to modify | > 5 files | Escalate to epic |
| Pattern clarity | No clear existing pattern | Escalate to architecture |
| Design work needed | Any new UI/API design | Escalate to epic or PRD |
| Risk level | Medium or High | Escalate for planning |
| Information gathering time | > 30 minutes | Switch to create-brownfield-story |
| Compatibility issues | Any breaking changes | Escalate to architecture |

---

## 5. User Interaction Points

### Interaction Model
This task is **minimally interactive** - assumes most context can be quickly gathered from codebase and user's initial request.

### Elicitation Points

**Point 1: Initial Enhancement Request** (Task Activation)
- **When**: User requests brownfield story creation
- **Purpose**: Gather enhancement description, user type, value proposition
- **Questions**:
  - What specific enhancement or fix is needed?
  - Who will benefit from this change?
  - What value does this deliver?
  - Can you complete this in a single development session (~4 hours)?

**Point 2: Context Clarification** (Step 1 - As Needed)
- **When**: Missing critical context about existing system
- **Purpose**: Fill information gaps for safe integration
- **Questions**:
  - What existing functionality will this affect?
  - What integration points are involved?
  - Are there existing examples of similar changes I should follow?
  - What technology stack is used in this area?

**Point 3: Escalation Confirmation** (Any Step - If Triggered)
- **When**: Complexity discovered during analysis
- **Purpose**: Confirm escalation and hand off to appropriate task
- **Communication**:
  - "This enhancement appears to require [reason for escalation]."
  - "I recommend using [alternate task] instead for proper planning."
  - "Should I proceed with [escalated task] or would you like to simplify the scope?"

**Point 4: Story Review** (After Step 4)
- **When**: Story creation complete
- **Purpose**: User validation before developer handoff
- **Communication**:
  - "Brownfield story created: [title]"
  - "Integrates with: [components]"
  - "Primary risk: [risk]"
  - "Please review and approve for implementation."

### Elicitation Strategy
- **Default mode**: Gather from codebase and user's initial request
- **Fallback mode**: Ask targeted questions for missing critical information
- **Time limit**: If elicitation takes > 10-15 minutes → escalate to `create-brownfield-story`

---

## 6. Output Specifications

### Primary Outputs

**Output 1: Brownfield Story Document**
- **Format**: Markdown
- **Location**: `{story_location}/brownfield-{feature-name}.md` OR `{story_location}/{epic}.{story}.md` if part of sequence
- **Filename Pattern**:
  - Standalone: `brownfield-add-email-validation.md`
  - Sequential: `2.3-add-email-validation.md` (if from epic)

**Story Document Structure**:
```markdown
# Story: {{Title}} - Brownfield Addition

## Status: Draft

## Story

As a {{user type}},
I want {{action/capability}},
So that {{benefit/value}}.

## Story Context

**Existing System Integration:**
- Integrates with: {{component}}
- Technology: {{tech stack}}
- Follows pattern: {{pattern reference}}
- Touch points: {{integration points}}

## Acceptance Criteria

**Functional Requirements:**
1. {{requirement}}
2. {{requirement}}
3. {{requirement}}

**Integration Requirements:**
4. Existing {{functionality}} continues to work unchanged
5. New functionality follows existing {{pattern}} pattern
6. Integration with {{system}} maintains current behavior

**Quality Requirements:**
7. Change is covered by appropriate tests
8. Documentation is updated if needed
9. No regression in existing functionality verified

## Technical Notes

- **Integration Approach:** {{approach}}
- **Existing Pattern Reference:** {{pattern}}
- **Key Constraints:** {{constraints}}

## Definition of Done

- [ ] Functional requirements met
- [ ] Integration requirements verified
- [ ] Existing functionality regression tested
- [ ] Code follows existing patterns and standards
- [ ] Tests pass (existing and new)
- [ ] Documentation updated if applicable

## Risk Assessment

**Minimal Risk Assessment:**
- **Primary Risk:** {{risk}}
- **Mitigation:** {{mitigation}}
- **Rollback:** {{rollback plan}}

**Compatibility Verification:**
- [ ] No breaking changes to existing APIs
- [ ] Database changes (if any) are additive only
- [ ] UI changes follow existing design patterns
- [ ] Performance impact is negligible
```

### Output Metadata

```yaml
output_metadata:
  document_type: "brownfield-story"
  scope: "single-session"
  estimated_effort: "2-4 hours"
  risk_level: "low"
  integration_complexity: "straightforward"
  pattern_reference: "{{file/component}}"
  created_by: "{{agent}}"
  created_date: "{{date}}"
```

### File Naming Conventions

| Context | Pattern | Example |
|---------|---------|---------|
| Standalone story | `brownfield-{feature-slug}.md` | `brownfield-add-email-validation.md` |
| From epic | `{epic}.{story}-{feature-slug}.md` | `2.3-add-email-validation.md` |
| Alternate | `brownfield-{epic}.{story}.md` | `brownfield-2.3.md` |

### Output Validation

Before saving story file, verify:
- [ ] All required sections present (Story, Context, Acceptance Criteria, Technical Notes, DoD, Risk Assessment)
- [ ] Integration points specified with component/file names
- [ ] Existing pattern reference included
- [ ] Rollback plan documented
- [ ] Compatibility checks documented
- [ ] Scope validated (single session)

---

## 7. Error Handling & Validation

### Error Categories

**Category 1: Scope Violations**
- **Error**: Enhancement requires more than one development session
- **Detection**: Step 4 validation or Step 1 assessment
- **Handling**: Escalate to `brownfield-create-epic` with explanation
- **User Message**: "This enhancement requires multiple stories. I recommend using brownfield-create-epic to create a 2-3 story epic."

**Category 2: Complexity Violations**
- **Error**: Design or architecture work required
- **Detection**: Step 1 assessment or Step 4 validation
- **Handling**: Escalate to full brownfield PRD/Architecture process
- **User Message**: "This enhancement requires architectural planning. I recommend the full brownfield PRD/Architecture process."

**Category 3: Pattern Ambiguity**
- **Error**: No clear existing pattern to follow
- **Detection**: Step 1 assessment (existing pattern identification fails)
- **Handling**: Request user guidance OR escalate to epic for design work
- **User Message**: "I couldn't find a clear existing pattern for this change. Can you point me to a similar implementation, or should we plan this as an epic with design work?"

**Category 4: Integration Complexity**
- **Error**: Multiple or unclear integration points
- **Detection**: Step 1 assessment or Step 3 compatibility check
- **Handling**: Escalate to `create-brownfield-story` for progressive context gathering
- **User Message**: "This enhancement has complex integration requirements. I recommend using create-brownfield-story for structured context gathering."

**Category 5: Risk Concerns**
- **Error**: Risk level higher than "low"
- **Detection**: Step 3 risk assessment
- **Handling**: Escalate to epic or full brownfield process for risk planning
- **User Message**: "This change carries medium/high risk to existing functionality. I recommend creating an epic with proper risk mitigation planning."

**Category 6: Compatibility Issues**
- **Error**: Breaking changes to APIs, non-additive database changes, or performance impact
- **Detection**: Step 3 compatibility verification
- **Handling**: Escalate to architecture review
- **User Message**: "This change introduces compatibility concerns: [specific issues]. I recommend architectural review before proceeding."

**Category 7: Missing Context**
- **Error**: Cannot determine existing patterns, integration points, or tech stack
- **Detection**: Step 1 assessment
- **Handling**:
  - **Quick fix**: Ask user 2-3 targeted questions
  - **Extended**: If clarification takes > 10 minutes, escalate to `create-brownfield-story`
- **User Message**: "I need clarification on [specific items] to proceed safely. Can you provide [requested information]?"

### Validation Rules

**Pre-Execution Validation**:
```yaml
validations:
  - rule: User has provided enhancement description
    severity: BLOCKER
    action: Request description before proceeding

  - rule: Enhancement appears to be brownfield (existing codebase)
    severity: WARNING
    action: Confirm brownfield vs greenfield approach
```

**Step 1 Validation** (Post-Assessment):
```yaml
validations:
  - rule: Relevant existing functionality identified
    severity: BLOCKER
    action: Cannot proceed without understanding what exists

  - rule: Integration points clearly understood
    severity: BLOCKER
    action: Cannot proceed without knowing touch points

  - rule: Existing patterns identified
    severity: BLOCKER
    action: Ask user for pattern reference or escalate

  - rule: Assessment time < 30 minutes
    severity: WARNING
    action: If exceeded, escalate to create-brownfield-story
```

**Step 2 Validation** (Post-Story Creation):
```yaml
validations:
  - rule: Story has user story statement
    severity: BLOCKER
    action: Cannot be valid story without user story format

  - rule: Acceptance criteria include integration requirements
    severity: BLOCKER
    action: Must verify existing functionality unchanged

  - rule: Technical notes include pattern reference
    severity: BLOCKER
    action: Must reference existing pattern to follow
```

**Step 3 Validation** (Post-Risk Assessment):
```yaml
validations:
  - rule: Primary risk identified
    severity: BLOCKER
    action: Cannot proceed without risk awareness

  - rule: Rollback plan is simple and feasible
    severity: BLOCKER
    action: Must be able to undo changes easily

  - rule: All compatibility checks pass
    severity: BLOCKER
    action: Cannot proceed with breaking changes
```

**Step 4 Validation** (Final):
```yaml
validations:
  - rule: Story can be completed in one session
    severity: BLOCKER
    action: Escalate to epic if not

  - rule: Integration approach is straightforward
    severity: BLOCKER
    action: Escalate if complex

  - rule: Follows existing patterns exactly
    severity: BLOCKER
    action: Escalate if new design needed

  - rule: All clarity checks pass
    severity: HIGH
    action: Refine or escalate
```

### Recovery Strategies

**Strategy 1: Clarification Loop**
- **When**: Missing information but user can provide quickly
- **Action**: Ask 2-3 targeted questions, gather answers, continue
- **Time Limit**: 5-10 minutes max

**Strategy 2: Simplification**
- **When**: Scope creep detected during analysis
- **Action**: Work with user to pare down to single-session scope
- **Example**: "This feels like it's growing. Can we simplify to just [core feature] and tackle [additional features] in a follow-up?"

**Strategy 3: Escalation**
- **When**: Complexity, risk, or unknowns exceed task capabilities
- **Action**: Clearly explain reason for escalation, hand off to appropriate task
- **Options**: `brownfield-create-epic`, `create-brownfield-story`, or full brownfield PRD process

**Strategy 4: Pattern Research**
- **When**: Existing pattern unclear but likely exists
- **Action**: Spend 5-10 minutes searching codebase for similar implementations
- **Fallback**: If not found, ask user or escalate

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**Prerequisite Tasks** (Optional but helpful):
- `document-project` - If brownfield architecture documentation exists, reference it for context
- `brownfield-create-epic` - If story is part of a larger epic, epic should exist first

**Dependent Tasks** (What follows this task):
- `validate-next-story` (by PO) - Optional story validation before implementation
- Dev agent story implementation - Primary follow-up action
- QA review tasks - After implementation

### Resource Dependencies

**Codebase Access**:
- Read access to existing codebase required
- Ability to search for patterns and examples
- Access to file structure and component organization

**Documentation Access** (Optional):
- Existing project documentation (if available)
- API documentation (if available)
- Existing pattern documentation (if available)

**Configuration Requirements**:
- Story file location (from `core-config.yaml` → `devStoryLocation` or project conventions)
- Project structure knowledge for file references

### Agent Dependencies

**Primary Agent**: PM (John) or SM (Bob)
- **PM** typically creates standalone brownfield stories
- **SM** typically creates stories as part of epic sequence

**Supporting Agents**:
- **Analyst (Mary)** - May have created document-project output to reference
- **Architect (Winston)** - May have created brownfield architecture to reference
- **PO (Sarah)** - May validate story after creation (via `validate-next-story`)
- **Dev (James)** - Will implement the story

### External Dependencies

**Development Environment**:
- Existing codebase must be accessible
- Ability to explore file structure
- Ability to read code for pattern identification

**Project State**:
- Brownfield project with existing codebase
- Ideally, some existing patterns to follow
- Stable baseline functionality to preserve

---

## 9. Integration Points

### Upstream Integration (What Feeds This Task)

**From User**:
- Enhancement request
- Initial context about change needed
- Clarifications as needed

**From document-project Task** (Optional):
- Brownfield architecture documentation
- Technical debt notes
- Key file listings
- Integration point identification

**From brownfield-create-epic Task** (Optional):
- Epic definition
- Story list within epic
- Integration context from epic planning

### Downstream Integration (What This Task Feeds)

**To validate-next-story Task** (Optional):
- Story document for PO validation
- Context for story readiness assessment

**To Dev Agent**:
- Complete implementation-ready story
- Integration guidance
- Pattern references
- Risk awareness

**To QA Agent** (Eventually):
- Story for review context
- Acceptance criteria for validation
- Risk assessment for test prioritization

### Lateral Integration (Peer Task Interactions)

**With create-brownfield-story Task**:
- Escalation path when complexity grows
- Hand off to comprehensive variant for progressive context gathering

**With brownfield-create-epic Task**:
- Escalation path when story becomes 2-3 story effort
- May create stories as part of epic workflow

**With create-next-story Task**:
- Complementary task for greenfield/well-documented brownfield
- Redirect path if proper sharded PRD/architecture exists

### Workflow Context

**Position in Planning Phase**:
- This is an **alternative story creation path** for small brownfield enhancements
- Bypasses full PRD/Architecture/Epic process for very small changes
- Quick path for bug fixes and minimal additions

**Position in Development Cycle**:
- Occurs before development starts
- Creates executable story for dev agent
- Optional validation checkpoint (PO) before implementation

### Handoff Protocol

**Story Handoff to Dev**:
```markdown
Brownfield story created: {{title}}
Location: {{file path}}

Integration Points:
- {{integration point 1}}
- {{integration point 2}}

Pattern to Follow:
- {{pattern reference with file/line numbers}}

Primary Risk:
- {{risk and mitigation}}

Next Steps:
1. Review story for clarity and feasibility
2. Implement following existing patterns exactly
3. Verify existing functionality remains unchanged
4. Run full test suite to confirm no regressions
```

**Escalation Handoff**:
```markdown
Enhancement scope exceeds "very small change" threshold.

Reason for Escalation:
- {{reason}}

Recommended Next Step:
- Use {{task name}} for proper planning

Context Gathered So Far:
- {{summary of gathered context}}
```

---

## 10. Configuration References

### Core Configuration Keys

This task has **minimal formal configuration** but implicitly relies on:

```yaml
# From core-config.yaml (implicitly used)
devStoryLocation: "docs/stories"        # Where to save story files
storyFilePattern: "{epic}.{story}.md"   # OR "brownfield-{feature}.md"

# Optional brownfield-specific configuration
brownfield:
  quickStoryLocation: "docs/stories"    # Location for standalone brownfield stories
  requirePatternReference: true          # Enforce existing pattern citation
  maxSessionTime: 4                      # Hours for "single session" threshold
```

### File Path Conventions

```yaml
paths:
  story_output: "{devStoryLocation}/brownfield-{feature-slug}.md"
  epic_story_output: "{devStoryLocation}/{epic}.{story}.md"

  # Referenced files (optional)
  brownfield_architecture: "docs/brownfield-architecture.md"  # From document-project
  brownfield_prd: "docs/prd.md"                               # If exists
```

### Task Behavior Configuration

```yaml
behavior:
  escalation_mode: "automatic"          # Auto-escalate when thresholds exceeded
  pattern_search_time: 600              # Seconds (10 min) before escalating
  elicitation_time_limit: 900           # Seconds (15 min) before escalating to create-brownfield-story

  validation:
    require_risk_assessment: true
    require_rollback_plan: true
    require_compatibility_checks: true
    require_pattern_reference: true
```

### Escalation Thresholds (Configurable)

```yaml
thresholds:
  max_development_time: 4               # Hours
  max_integration_points: 2             # Touch points
  max_files_modified: 5                 # Files
  max_assessment_time: 30               # Minutes
  max_risk_level: "LOW"                 # LOW | MEDIUM | HIGH
```

---

## 11. Special Features

### Feature 1: Dual Task Variants

**Unique Capability**: BMad provides TWO brownfield story creation tasks:
- **brownfield-create-story.md** (this task) - Simplified for very small changes
- **create-brownfield-story.md** - Comprehensive for complex brownfield work

**Value**: Allows agents to match task complexity to change complexity, avoiding over-planning for simple changes while providing structured approach for complex scenarios.

**Implementation**: Decision tree at task activation to route to appropriate variant.

### Feature 2: Single-Session Scope Enforcement

**Unique Capability**: Strict enforcement of "single development session" (~4 hours) scope.

**Value**: Prevents scope creep, ensures stories remain actionable, forces escalation when complexity grows.

**Implementation**: Multiple validation checkpoints (Steps 1, 3, 4) that check scope and trigger escalation if exceeded.

### Feature 3: Pattern-Following Mandate

**Unique Capability**: Requires identification and citation of existing pattern to follow.

**Value**: Ensures consistency, reduces decision-making overhead, minimizes risk by following proven approaches.

**Implementation**:
- Step 1 requires pattern identification
- Step 2 includes "Existing Pattern Reference" in Technical Notes
- Step 4 validation blocks story if pattern unclear

### Feature 4: Integration-First Acceptance Criteria

**Unique Capability**: Mandates integration requirements that explicitly verify existing functionality unchanged.

**Value**: Protects existing system integrity, forces developer to think about impact, provides clear regression testing criteria.

**Implementation**: AC template includes mandatory integration requirements section (items 4-6).

### Feature 5: Minimal Risk Assessment

**Unique Capability**: Lightweight risk assessment suitable for small changes.

**Value**: Risk-aware without overhead of full risk-profile task, provides safety net for small changes, documents rollback plan.

**Implementation**: Single primary risk + mitigation + rollback plan (Step 3).

### Feature 6: Compatibility Verification Checklist

**Unique Capability**: Four-point compatibility check for brownfield safety.

**Value**: Catches breaking changes early, ensures additive-only approach, prevents compatibility issues.

**Implementation**: Four mandatory checks in Step 3 (API, DB, UI, performance).

### Feature 7: Escalation-Driven Workflow

**Unique Capability**: Multiple escalation paths based on detected complexity.

**Value**: Ensures appropriate planning depth for actual complexity, prevents under-planning or over-planning.

**Implementation**: Decision points at Steps 1, 3, and 4 with escalation to:
- `brownfield-create-epic` (2-3 stories)
- `create-brownfield-story` (complex brownfield)
- Full brownfield PRD/Architecture (4+ stories, architectural work)

---

## 12. Performance Characteristics

### Execution Time

**Expected Duration**:
- **Fast Path** (all context available): 5-10 minutes
- **Normal Path** (some clarification needed): 15-20 minutes
- **Slow Path** (pattern research required): 20-30 minutes
- **Escalation Path** (complexity detected): 5 minutes to escalate + time for escalated task

**Time Breakdown by Step**:
| Step | Duration | Notes |
|------|----------|-------|
| Step 1: Assessment | 5-10 min | Quick if codebase exploration efficient |
| Step 2: Story Creation | 5-10 min | Template-driven, straightforward |
| Step 3: Risk/Compatibility | 3-5 min | Minimal assessment |
| Step 4: Validation | 2-3 min | Checklist-based |
| **Total** | **15-28 min** | Much faster than epic or full brownfield process |

### Scalability Characteristics

**Project Size Impact**:
- **Small Projects** (< 10 files): Very fast (10-15 min) - easy to find patterns
- **Medium Projects** (10-100 files): Normal (15-25 min) - some pattern search needed
- **Large Projects** (> 100 files): Slower (25-30 min) - pattern identification harder

**Story Complexity Impact**:
- **Trivial** (typo fix, simple addition): 5-10 min
- **Small** (single component change): 15-20 min
- **Approaching Medium** (multiple files, coordination): 25-30 min → likely escalates

### Optimization Strategies

**Strategy 1: Pattern Library**
- Maintain documented patterns for common changes
- Reference pattern documentation instead of searching codebase each time
- **Time Savings**: 5-10 minutes per story

**Strategy 2: Brownfield Architecture Documentation**
- Use output from `document-project` task as reference
- Pre-identified integration points and patterns
- **Time Savings**: 10-15 minutes per story

**Strategy 3: Template Reuse**
- Save story templates for common change types
- Pre-populate common sections (e.g., compatibility checks for specific project)
- **Time Savings**: 5 minutes per story

**Strategy 4: Quick Escalation**
- Don't fight complexity - escalate early when thresholds exceeded
- Saves time vs trying to force-fit complex change into simple story
- **Time Savings**: Variable, prevents wasted effort

---

## 13. Quality Assurance

### Quality Criteria

**Story Completeness**:
- [ ] All required sections present
- [ ] User story format correct (As a... I want... So that...)
- [ ] Acceptance criteria include functional, integration, and quality requirements
- [ ] Technical notes include integration approach and pattern reference
- [ ] Risk assessment includes primary risk, mitigation, and rollback
- [ ] Compatibility verification documented

**Story Clarity**:
- [ ] Requirements are unambiguous and testable
- [ ] Integration points specified with component/file names
- [ ] Success criteria are measurable
- [ ] Rollback approach is simple and explicit

**Story Safety**:
- [ ] Existing functionality protection included in ACs
- [ ] Risk assessment appropriate to change
- [ ] Rollback plan is feasible
- [ ] Compatibility checks address breaking changes

**Story Scope**:
- [ ] Can be completed in single session (~4 hours)
- [ ] Follows existing patterns exactly
- [ ] No design or architecture work required
- [ ] Integration approach is straightforward

### Validation Checkpoints

**Checkpoint 1: Post-Assessment** (End of Step 1)
- Verify: Context sufficient for safe implementation
- Verify: Scope within single-session threshold
- Action: Continue or escalate

**Checkpoint 2: Post-Story Creation** (End of Step 2)
- Verify: All template sections populated
- Verify: Pattern reference included
- Action: Continue to risk assessment

**Checkpoint 3: Post-Risk Assessment** (End of Step 3)
- Verify: Risk level acceptable (low)
- Verify: All compatibility checks pass
- Action: Continue or escalate

**Checkpoint 4: Final Validation** (End of Step 4)
- Verify: All scope and clarity checks pass
- Verify: Story is implementation-ready
- Action: Complete and hand off OR refine OR escalate

### Quality Metrics

**Story Quality Score**:
```yaml
scoring:
  completeness: 30%      # All sections present and populated
  clarity: 25%           # Unambiguous, testable requirements
  safety: 25%            # Risk awareness, existing functionality protection
  scope: 20%             # Appropriate single-session scope

  pass_threshold: 85%    # Must score 85%+ to proceed without refinement
```

**Common Quality Issues**:
| Issue | Detection | Resolution |
|-------|-----------|------------|
| Vague integration points | Step 4 clarity check | Add specific file/component names |
| Missing pattern reference | Step 4 scope check | Identify and cite existing pattern |
| Scope too large | Step 4 scope check | Escalate to epic |
| Ambiguous acceptance criteria | Step 4 clarity check | Make criteria testable and measurable |
| Risk underestimated | Step 3 compatibility check | Escalate for proper risk planning |

---

## 14. Troubleshooting Guide

### Common Issues

**Issue 1: Cannot Find Existing Pattern**

**Symptoms**:
- Step 1 assessment cannot identify clear existing pattern to follow
- Similar functionality doesn't exist in codebase
- Multiple conflicting patterns found

**Diagnosis**:
- Search codebase for similar implementations
- Review existing components in related areas
- Check if this is actually greenfield vs brownfield

**Resolution**:
- **Option A**: Ask user to point to pattern to follow
- **Option B**: Escalate to `brownfield-create-epic` for design work
- **Option C**: If truly greenfield, use greenfield story creation instead

**Prevention**: Clarify greenfield vs brownfield at task activation

---

**Issue 2: Scope Creep During Assessment**

**Symptoms**:
- Step 1 assessment reveals more complexity than initially apparent
- Integration points multiply during analysis
- Estimated effort grows beyond single session

**Diagnosis**:
- Multiple files need modification
- Coordination between components required
- Design decisions needed

**Resolution**:
- **Immediate**: Stop assessment, prepare escalation
- **Action**: Escalate to `brownfield-create-epic` with gathered context
- **Communication**: "This enhancement requires 2-3 coordinated stories. I recommend creating an epic."

**Prevention**: Set 30-minute time limit on assessment, escalate if exceeded

---

**Issue 3: Compatibility Concerns**

**Symptoms**:
- Step 3 compatibility checks reveal breaking changes
- Database schema modifications required
- API signature changes needed
- Performance impact significant

**Diagnosis**:
- Non-additive database changes
- Breaking API changes
- New UI patterns needed
- Resource consumption concerns

**Resolution**:
- **Immediate**: Flag compatibility issue
- **Action**: Escalate to architecture review
- **Communication**: "This change introduces compatibility concerns: [specific issues]. I recommend architectural review."

**Prevention**: Clarify change approach during initial request

---

**Issue 4: Ambiguous Requirements**

**Symptoms**:
- Step 4 clarity check fails
- Requirements open to interpretation
- Integration points unclear
- Success criteria not testable

**Diagnosis**:
- User request was high-level
- Missing technical details
- Integration approach uncertain

**Resolution**:
- **Option A**: Ask 2-3 targeted clarification questions (5-10 min)
- **Option B**: If clarification takes > 10 min, escalate to `create-brownfield-story`
- **Communication**: "I need clarification on [specific items] to create a clear story."

**Prevention**: Gather detailed context during initial request

---

**Issue 5: Risk Higher Than "Low"**

**Symptoms**:
- Step 3 risk assessment identifies medium or high risk
- Complex integration with critical system
- Potential for data loss or corruption
- Difficult rollback scenario

**Diagnosis**:
- Change affects critical functionality
- Multiple failure modes possible
- Rollback not straightforward
- Testing complexity high

**Resolution**:
- **Immediate**: Document risk clearly
- **Action**: Escalate to `brownfield-create-epic` or full brownfield process for risk planning
- **Communication**: "This change carries [risk level] risk to [system]. I recommend proper risk planning."

**Prevention**: Assess risk early in Step 1 assessment

---

**Issue 6: Missing Brownfield Documentation**

**Symptoms**:
- No existing architecture documentation
- Codebase structure unclear
- Integration points unknown
- No pattern examples found

**Diagnosis**:
- Project lacks documentation
- New team member unfamiliar with codebase
- Legacy system without docs

**Resolution**:
- **Option A**: If small change, ask user for guided tour of relevant code
- **Option B**: Recommend running `document-project` task first to create brownfield architecture docs
- **Option C**: Escalate to `create-brownfield-story` for progressive context gathering

**Prevention**: Check for brownfield architecture documentation before starting

---

### Diagnostic Process

**Step 1: Identify Symptoms**
- Which step is failing or raising concerns?
- What specific validation is failing?
- What information is missing?

**Step 2: Assess Severity**
- Blocker: Cannot proceed safely
- High: Significant quality/safety concern
- Medium: Should address but can work around
- Low: Nice to have, not critical

**Step 3: Determine Root Cause**
- Scope issue (too large)?
- Information gap (missing context)?
- Complexity issue (design needed)?
- Risk issue (safety concern)?

**Step 4: Select Resolution Path**
- Quick fix (5-10 min clarification)?
- Refinement (improve story quality)?
- Escalation (hand off to appropriate task)?

**Step 5: Execute and Verify**
- Apply resolution
- Re-run validation
- Confirm issue resolved or escalation complete

---

## 15. Example Scenarios

### Scenario 1: Simple Bug Fix (Happy Path)

**Context**: Existing registration form has a bug where email validation accepts invalid formats.

**Inputs**:
- Enhancement: "Fix email validation to reject invalid email formats"
- User type: "End user"
- Value: "Prevent registration with invalid emails"

**Execution**:

**Step 1 (Assessment)**: (5 minutes)
- Existing functionality: Registration form at `src/auth/registration.tsx`
- Tech stack: React 18, Zod validation
- Integration: Form component, user service API
- Pattern: Similar validation exists in Login component (`src/auth/login.tsx` lines 45-60)

**Step 2 (Story Creation)**: (7 minutes)
```markdown
# Story: Fix Email Validation on Registration Form - Brownfield Addition

## Status: Draft

## Story
As an end user,
I want proper email validation on the registration form,
So that I cannot register with invalid email addresses.

## Story Context
**Existing System Integration:**
- Integrates with: User Registration Module (src/auth/registration.tsx)
- Technology: React 18, Zod validation library (v3.21)
- Follows pattern: Email validation from Login component (src/auth/login.tsx:45-60)
- Touch points: Registration form component, form validation schema

## Acceptance Criteria
**Functional Requirements:**
1. Email field validates format on blur and on submit
2. Clear error message displays below field for invalid emails
3. Registration form submit is blocked when email is invalid

**Integration Requirements:**
4. Existing registration flow (password validation, terms acceptance) continues unchanged
5. New email validation follows existing pattern from Login component
6. Integration with user service API maintains current request/response format

**Quality Requirements:**
7. Email validation is covered by unit and integration tests
8. Form validation documentation updated with email validation rules
9. Existing registration tests pass without modification

## Technical Notes
- **Integration Approach:** Add Zod email schema to registration form validation schema, following pattern from login form
- **Existing Pattern Reference:** src/auth/login.tsx lines 45-60 (email validation with z.string().email())
- **Key Constraints:** Use existing Zod library (v3.21), cannot introduce new dependencies

## Definition of Done
- [x] Functional requirements met
- [x] Integration requirements verified
- [x] Existing functionality regression tested
- [x] Code follows existing patterns and standards
- [x] Tests pass (existing and new)
- [x] Documentation updated if applicable
```

**Step 3 (Risk Assessment)**: (3 minutes)
```markdown
## Risk Assessment
**Minimal Risk Assessment:**
- **Primary Risk:** Email validation might be too strict and reject valid formats (internationalized emails, plus addressing)
- **Mitigation:** Use RFC 5322 compliant Zod email validator (z.string().email()), test with edge cases
- **Rollback:** Remove email validation from form schema (one-line change revert)

**Compatibility Verification:**
- [x] No breaking changes to APIs (additive validation only)
- [x] No database changes
- [x] UI follows existing pattern (error message styling from Login component)
- [x] Performance impact negligible (client-side validation)
```

**Step 4 (Validation)**: (2 minutes)
- [x] Story can be completed in one session (~2 hours estimated)
- [x] Integration straightforward (one component, one schema change)
- [x] Follows existing pattern exactly (copy from Login)
- [x] No design work required
- [x] Requirements unambiguous
- [x] Integration points clearly specified
- [x] Success criteria testable
- [x] Rollback simple (one-line revert)

**Output**: Story complete, ready for dev handoff

**Total Time**: 17 minutes

---

### Scenario 2: Scope Creep → Escalation

**Context**: User requests "add user profile editing functionality" which sounds simple.

**Inputs**:
- Enhancement: "Add user profile editing"
- User type: "End user"
- Value: "Update my profile information"

**Execution**:

**Step 1 (Assessment)**: (15 minutes)
- Existing functionality: User profile display at `src/user/profile.tsx` (read-only)
- Tech stack: React 18, API at `/api/user/profile`
- Integration: User service, auth system, possibly notification system
- Pattern: Some edit forms exist but not for user profile specifically

**Assessment findings**:
- Edit form needs design (no existing pattern for user profile editing)
- API endpoint needs modification (currently GET only, need PUT)
- Auth needs to verify user can edit their own profile
- May need email verification for email changes
- May need password confirmation for sensitive changes
- May need notification when profile updated
- Estimated 3-4 files to modify: ProfileComponent, API route, auth middleware, possibly notification service

**Decision Point**: Scope exceeds single-session threshold (design work needed, multiple components, estimated 8+ hours)

**Action**: **ESCALATE to brownfield-create-epic**

**Communication**:
```
Enhancement scope exceeds "very small change" threshold.

Reason for Escalation:
- Requires UI/UX design for edit form (no existing pattern)
- Multiple integration points (profile, auth, API, possibly notifications)
- Estimated 8-12 hours development time
- Needs to be broken into 2-3 coordinated stories

Recommended Next Step:
- Use brownfield-create-epic to create a 2-3 story epic with proper planning

Context Gathered So Far:
- Existing profile display at src/user/profile.tsx (read-only)
- API at /api/user/profile (currently GET only, need PUT)
- Auth verification needed for profile editing
- Possibly need email verification and password confirmation
```

**Total Time**: 15 minutes (before escalation)

---

### Scenario 3: Pattern Ambiguity → User Clarification

**Context**: User requests "add pagination to user list" but pagination patterns vary across the codebase.

**Inputs**:
- Enhancement: "Add pagination to user list page"
- User type: "Admin"
- Value: "View large user lists efficiently"

**Execution**:

**Step 1 (Assessment)**: (10 minutes)
- Existing functionality: User list at `src/admin/user-list.tsx` (loads all users)
- Tech stack: React 18, API at `/api/users`
- Integration: User service, user list component

**Pattern search**:
- Found pagination in `src/products/product-list.tsx` (client-side, loads all then paginates)
- Found pagination in `src/orders/order-list.tsx` (server-side, offset/limit)
- Found pagination in `src/reports/report-list.tsx` (cursor-based)

**Decision Point**: Multiple conflicting patterns found, unclear which to follow

**Action**: **USER CLARIFICATION** (Clarification Loop)

**Questions**:
1. Which pagination pattern should I follow?
   - Client-side (like products, loads all then paginates in browser)
   - Server-side offset/limit (like orders, traditional pagination)
   - Cursor-based (like reports, more scalable for large datasets)
2. How many users do you typically have? (helps determine appropriate pattern)
3. Should I match the product list pattern for consistency, or optimize for large datasets?

**User Response**: "Follow the orders pattern (server-side offset/limit). We have 10K+ users, so client-side won't work. Consistency with orders is more important than reports."

**Resume Step 1**:
- Pattern: Server-side pagination following orders pattern (`src/orders/order-list.tsx:120-180`)
- Integration: Modify API to accept `offset` and `limit` query params, modify component to use pagination controls

**Continue Step 2-4**: (10 minutes)
Story created following orders pagination pattern, estimated 3 hours development time.

**Total Time**: 20 minutes (including clarification)

---

### Scenario 4: Risk Concern → Escalation

**Context**: User requests "optimize database query in user dashboard" which sounds simple but carries risk.

**Inputs**:
- Enhancement: "Optimize slow database query in user dashboard"
- User type: "End user"
- Value: "Dashboard loads faster"

**Execution**:

**Step 1 (Assessment)**: (8 minutes)
- Existing functionality: User dashboard at `src/dashboard/index.tsx`, query in `src/services/dashboard-service.ts`
- Tech stack: Node.js, PostgreSQL, TypeORM
- Integration: Database, dashboard service, dashboard component
- Pattern: Other optimized queries use indexes and query optimization

**Step 3 (Risk Assessment)**: (5 minutes)
**Primary Risk**: Query optimization could break existing data aggregation logic or introduce inconsistencies
- Query is complex (joins 4 tables, aggregates data)
- Optimization requires understanding data distribution and query planner
- Potential for incorrect results if optimization changes logic
- Performance testing required to validate improvement
- Rollback may be complex if caching or materialized views introduced

**Decision Point**: Risk level **MEDIUM** (not "LOW"), compatibility concerns (performance impact significant), potential for data inconsistency

**Action**: **ESCALATE to brownfield-create-epic** for proper risk planning and testing strategy

**Communication**:
```
Enhancement carries medium risk to existing functionality.

Reason for Escalation:
- Query optimization affects critical user dashboard
- Complex query (4 table joins, data aggregation)
- Risk of introducing data inconsistencies
- Requires performance testing and validation
- Rollback may be complex

Recommended Next Step:
- Use brownfield-create-epic to create epic with:
  - Story 1: Performance analysis and optimization plan
  - Story 2: Query optimization implementation with testing
  - Story 3: Performance validation and monitoring

This ensures proper risk mitigation and testing.
```

**Total Time**: 13 minutes (before escalation)

---

### Scenario 5: Compatibility Issue → Architecture Escalation

**Context**: User requests "update user authentication to use new token format" which requires API changes.

**Inputs**:
- Enhancement: "Update authentication to use JWT tokens instead of session cookies"
- User type: "Developer"
- Value: "Enable stateless authentication for API scalability"

**Execution**:

**Step 1 (Assessment)**: (10 minutes)
- Existing functionality: Session-based auth using cookies
- Tech stack: Express.js, Passport.js, session middleware
- Integration: Auth middleware, all API endpoints, login flow, logout flow
- Pattern: Some services use JWT but core auth uses sessions

**Step 3 (Compatibility Check)**: (5 minutes)

**Compatibility Verification:**
- [ ] ❌ **Breaking change to APIs** - All existing clients expect session cookies, JWT tokens break existing clients
- [ ] ❌ **Not additive** - Replacing session auth, not adding alongside
- [ ] ❌ **Major UI changes** - May need to handle token refresh, logout behavior changes
- [ ] ⚠️ **Performance impact** - Token validation vs session lookup (different trade-offs)

**Decision Point**: Multiple compatibility failures, breaking changes to existing APIs

**Action**: **ESCALATE to Architecture Review / Full Brownfield PRD Process**

**Communication**:
```
Enhancement introduces significant compatibility concerns.

Compatibility Issues:
- Breaking change: All existing clients expect session cookies, JWT tokens incompatible
- Not additive: Replacing auth system, not adding alongside existing
- UI changes: Token refresh, storage, and logout behavior changes needed
- API changes: All endpoints need to accept Bearer tokens instead of cookies

This is not a "very small change" - it's an architectural shift requiring:
- Migration strategy (support both auth types during transition?)
- Client update coordination
- Testing strategy for auth changes
- Rollback planning for critical auth system

Recommended Next Step:
- Use full brownfield PRD/Architecture process to properly plan this architectural change
- Consider whether phased migration is needed (support both session and JWT temporarily)
- Architectural review required for auth system changes
```

**Total Time**: 15 minutes (before escalation)

---

## 16. ADK Translation Recommendations

### Architecture Pattern

**Recommended Implementation**: **Cloud Function (2nd gen) with Template System**

**Rationale**:
- This is a **lightweight workflow** suitable for stateless execution
- Primarily template-driven story generation
- No complex multi-step reasoning (escalates instead)
- Fast execution time (15-30 minutes)
- Minimal state management needed

**Component Mapping**:

```yaml
bmad_component: brownfield-create-story task
adk_service: Cloud Function (2nd gen)
trigger: HTTP POST to /tasks/brownfield-create-story
runtime: Python 3.11 or Node.js 20
memory: 512 MB
timeout: 540s (9 minutes - ample for 30 min task with buffer)

supporting_services:
  - Firestore: Store story documents
  - Cloud Storage: Reference codebase and existing patterns
  - Vertex AI Agent: Call PM or SM agent for execution
  - Cloud Functions: Call escalation tasks (epic, comprehensive story, full PRD)
```

### Cloud Function Structure

**Function Definition**:
```python
from google.cloud import firestore, storage
from typing import Dict, Any
import logging

class BrownfieldStoryCreator:
    """
    Cloud Function for creating simple brownfield stories.
    Implements 4-step workflow with escalation logic.
    """

    def __init__(self):
        self.firestore = firestore.Client()
        self.storage = storage.Client()
        self.logger = logging.getLogger(__name__)

    def create_brownfield_story(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for brownfield story creation.

        Args:
            request: {
                "project_id": str,
                "enhancement_description": str,
                "user_type": str,
                "value_proposition": str,
                "existing_functionality": str (optional),
                "technology_stack": str (optional),
                "pattern_reference": str (optional)
            }

        Returns:
            {
                "status": "completed" | "escalated",
                "story_path": str (if completed),
                "escalation_reason": str (if escalated),
                "escalation_task": str (if escalated),
                "gathered_context": dict (if escalated)
            }
        """

        project_id = request["project_id"]

        # Step 1: Quick Project Assessment
        assessment_result = self._assess_project_context(project_id, request)

        # Check for escalation after assessment
        if assessment_result["should_escalate"]:
            return self._escalate(
                reason=assessment_result["escalation_reason"],
                task=assessment_result["escalation_task"],
                context=assessment_result["gathered_context"]
            )

        # Step 2: Story Creation
        story = self._create_story_document(assessment_result)

        # Step 3: Risk and Compatibility Check
        risk_result = self._assess_risk_and_compatibility(story, assessment_result)

        # Check for escalation after risk assessment
        if risk_result["should_escalate"]:
            return self._escalate(
                reason=risk_result["escalation_reason"],
                task=risk_result["escalation_task"],
                context={**assessment_result["gathered_context"], **risk_result}
            )

        # Step 4: Validation
        validation_result = self._validate_story(story, assessment_result, risk_result)

        # Check for escalation after validation
        if validation_result["should_escalate"]:
            return self._escalate(
                reason=validation_result["escalation_reason"],
                task=validation_result["escalation_task"],
                context={**assessment_result["gathered_context"], **risk_result}
            )

        # Save story to Firestore and return
        story_path = self._save_story(project_id, story)

        return {
            "status": "completed",
            "story_path": story_path,
            "story_title": story["title"],
            "integration_points": assessment_result["integration_points"],
            "primary_risk": risk_result["primary_risk"]
        }

    def _assess_project_context(
        self,
        project_id: str,
        request: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Step 1: Quick Project Assessment

        Returns:
            {
                "should_escalate": bool,
                "escalation_reason": str (if escalating),
                "escalation_task": str (if escalating),
                "gathered_context": dict,
                "existing_functionality": str,
                "technology_stack": str,
                "integration_points": list,
                "existing_pattern": str
            }
        """

        # Start timer for assessment
        import time
        start_time = time.time()

        # Load project context from Firestore
        project_doc = self.firestore.collection("projects").document(project_id).get()
        if not project_doc.exists:
            raise ValueError(f"Project {project_id} not found")

        project_data = project_doc.to_dict()

        # Gather current system context
        gathered_context = {
            "existing_functionality": request.get("existing_functionality"),
            "technology_stack": request.get("technology_stack", project_data.get("tech_stack")),
            "integration_points": [],
            "existing_pattern": request.get("pattern_reference")
        }

        # Search for existing patterns (using Cloud Storage or Vector Search)
        if not gathered_context["existing_pattern"]:
            pattern_search_result = self._search_for_patterns(
                project_id,
                request["enhancement_description"]
            )

            if pattern_search_result["found"]:
                gathered_context["existing_pattern"] = pattern_search_result["pattern"]
            else:
                # Pattern not found - check if we should escalate
                elapsed_time = time.time() - start_time
                if elapsed_time > 600:  # 10 minutes
                    return {
                        "should_escalate": True,
                        "escalation_reason": "Pattern identification exceeded 10 minute threshold",
                        "escalation_task": "create-brownfield-story",  # Comprehensive variant
                        "gathered_context": gathered_context
                    }

        # Identify integration points
        integration_analysis = self._analyze_integration_points(
            project_id,
            request["enhancement_description"],
            gathered_context
        )

        gathered_context["integration_points"] = integration_analysis["points"]

        # Check for scope escalation triggers
        if len(integration_analysis["points"]) > 2:
            return {
                "should_escalate": True,
                "escalation_reason": f"Multiple integration points detected ({len(integration_analysis['points'])})",
                "escalation_task": "brownfield-create-epic",
                "gathered_context": gathered_context
            }

        if integration_analysis["complexity"] == "high":
            return {
                "should_escalate": True,
                "escalation_reason": "Integration complexity exceeds single-story threshold",
                "escalation_task": "brownfield-create-epic",
                "gathered_context": gathered_context
            }

        # Define change scope
        gathered_context["change_scope"] = {
            "description": request["enhancement_description"],
            "boundaries": integration_analysis["boundaries"],
            "success_criteria": self._derive_success_criteria(request)
        }

        # Estimate development time
        estimated_hours = self._estimate_development_time(
            gathered_context["change_scope"],
            integration_analysis,
            gathered_context["existing_pattern"] is not None
        )

        if estimated_hours > 4:
            return {
                "should_escalate": True,
                "escalation_reason": f"Estimated development time ({estimated_hours}h) exceeds single-session threshold (4h)",
                "escalation_task": "brownfield-create-epic",
                "gathered_context": gathered_context
            }

        # Assessment complete, no escalation needed
        return {
            "should_escalate": False,
            "gathered_context": gathered_context,
            **gathered_context
        }

    def _create_story_document(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Step 2: Story Creation

        Returns story document structure.
        """

        context = assessment["gathered_context"]

        story = {
            "title": f"{assessment['change_scope']['description']} - Brownfield Addition",
            "status": "Draft",
            "user_story": {
                "user_type": context.get("user_type", "user"),
                "want": context["change_scope"]["description"],
                "so_that": context["change_scope"]["success_criteria"][0] if context["change_scope"]["success_criteria"] else "value is delivered"
            },
            "story_context": {
                "integrates_with": context["integration_points"][0] if context["integration_points"] else "existing system",
                "technology": context["technology_stack"],
                "follows_pattern": context["existing_pattern"],
                "touch_points": context["integration_points"]
            },
            "acceptance_criteria": {
                "functional": self._generate_functional_requirements(context),
                "integration": self._generate_integration_requirements(context),
                "quality": [
                    "Change is covered by appropriate tests",
                    "Documentation is updated if needed",
                    "No regression in existing functionality verified"
                ]
            },
            "technical_notes": {
                "integration_approach": self._derive_integration_approach(context),
                "existing_pattern_reference": context["existing_pattern"],
                "key_constraints": self._identify_constraints(context)
            },
            "definition_of_done": [
                "Functional requirements met",
                "Integration requirements verified",
                "Existing functionality regression tested",
                "Code follows existing patterns and standards",
                "Tests pass (existing and new)",
                "Documentation updated if applicable"
            ]
        }

        return story

    def _assess_risk_and_compatibility(
        self,
        story: Dict[str, Any],
        assessment: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Step 3: Risk and Compatibility Check

        Returns:
            {
                "should_escalate": bool,
                "escalation_reason": str (if escalating),
                "escalation_task": str (if escalating),
                "primary_risk": str,
                "mitigation": str,
                "rollback": str,
                "compatibility": {
                    "api_breaking": bool,
                    "db_additive": bool,
                    "ui_follows_patterns": bool,
                    "performance_ok": bool
                }
            }
        """

        context = assessment["gathered_context"]

        # Identify primary risk
        risk_analysis = self._analyze_risks(story, context)

        # Check compatibility
        compatibility = {
            "api_breaking": self._check_api_breaking_changes(story, context),
            "db_additive": self._check_db_changes(story, context),
            "ui_follows_patterns": self._check_ui_patterns(story, context),
            "performance_ok": self._check_performance_impact(story, context)
        }

        # Escalate if any compatibility checks fail
        if compatibility["api_breaking"]:
            return {
                "should_escalate": True,
                "escalation_reason": "Breaking API changes detected",
                "escalation_task": "full-brownfield-architecture",
                "primary_risk": risk_analysis["primary_risk"],
                "compatibility": compatibility
            }

        if not compatibility["db_additive"]:
            return {
                "should_escalate": True,
                "escalation_reason": "Non-additive database changes required",
                "escalation_task": "brownfield-create-epic",
                "primary_risk": risk_analysis["primary_risk"],
                "compatibility": compatibility
            }

        # Escalate if risk level is medium or high
        if risk_analysis["risk_level"] in ["medium", "high"]:
            return {
                "should_escalate": True,
                "escalation_reason": f"Risk level ({risk_analysis['risk_level']}) exceeds 'low' threshold",
                "escalation_task": "brownfield-create-epic",
                "primary_risk": risk_analysis["primary_risk"],
                "compatibility": compatibility
            }

        # No escalation needed
        return {
            "should_escalate": False,
            "primary_risk": risk_analysis["primary_risk"],
            "mitigation": risk_analysis["mitigation"],
            "rollback": risk_analysis["rollback"],
            "compatibility": compatibility,
            "risk_level": risk_analysis["risk_level"]
        }

    def _validate_story(
        self,
        story: Dict[str, Any],
        assessment: Dict[str, Any],
        risk_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Step 4: Validation Checklist

        Returns:
            {
                "should_escalate": bool,
                "escalation_reason": str (if escalating),
                "escalation_task": str (if escalating),
                "validation_passed": bool,
                "scope_checks": dict,
                "clarity_checks": dict
            }
        """

        # Scope validation
        scope_checks = {
            "single_session": assessment["estimated_hours"] <= 4,
            "straightforward_integration": len(assessment["integration_points"]) <= 2,
            "follows_existing_patterns": assessment["existing_pattern"] is not None,
            "no_design_work": not assessment.get("design_required", False)
        }

        # Clarity validation
        clarity_checks = {
            "unambiguous_requirements": self._check_requirement_clarity(story),
            "specified_integration_points": len(assessment["integration_points"]) > 0,
            "testable_success_criteria": self._check_testable_criteria(story),
            "simple_rollback": risk_result.get("rollback_complexity", "simple") == "simple"
        }

        # Check if all validations pass
        scope_passed = all(scope_checks.values())
        clarity_passed = all(clarity_checks.values())

        # Escalate if scope validation fails
        if not scope_passed:
            failed_checks = [k for k, v in scope_checks.items() if not v]
            return {
                "should_escalate": True,
                "escalation_reason": f"Scope validation failed: {', '.join(failed_checks)}",
                "escalation_task": "brownfield-create-epic",
                "validation_passed": False,
                "scope_checks": scope_checks,
                "clarity_checks": clarity_checks
            }

        # If clarity validation fails, attempt refinement
        if not clarity_passed:
            refinement_result = self._attempt_refinement(story, clarity_checks)

            if refinement_result["success"]:
                # Refinement successful, update story
                story.update(refinement_result["refined_story"])
                clarity_checks = refinement_result["updated_clarity_checks"]
            else:
                # Refinement failed, escalate
                return {
                    "should_escalate": True,
                    "escalation_reason": "Clarity validation failed and refinement unsuccessful",
                    "escalation_task": "create-brownfield-story",  # Comprehensive variant for structured elicitation
                    "validation_passed": False,
                    "scope_checks": scope_checks,
                    "clarity_checks": clarity_checks
                }

        # All validations passed
        return {
            "should_escalate": False,
            "validation_passed": True,
            "scope_checks": scope_checks,
            "clarity_checks": clarity_checks
        }

    def _escalate(
        self,
        reason: str,
        task: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Handle escalation to another task.

        Returns escalation response.
        """

        self.logger.info(f"Escalating to {task}: {reason}")

        return {
            "status": "escalated",
            "escalation_reason": reason,
            "escalation_task": task,
            "gathered_context": context,
            "next_steps": self._get_escalation_next_steps(task)
        }

    def _save_story(self, project_id: str, story: Dict[str, Any]) -> str:
        """
        Save story to Firestore and Cloud Storage.

        Returns story file path.
        """

        # Generate story ID and filename
        story_id = self._generate_story_id(project_id, story)
        story_filename = f"brownfield-{self._slugify(story['title'])}.md"

        # Save to Firestore
        story_ref = self.firestore.collection("projects").document(project_id).collection("stories").document(story_id)
        story_ref.set({
            **story,
            "created_at": firestore.SERVER_TIMESTAMP,
            "created_by": "brownfield-create-story-task",
            "type": "brownfield",
            "scope": "single-session"
        })

        # Save markdown to Cloud Storage
        bucket = self.storage.bucket(f"{project_id}-stories")
        blob = bucket.blob(story_filename)
        blob.upload_from_string(
            self._story_to_markdown(story),
            content_type="text/markdown"
        )

        return f"gs://{bucket.name}/{story_filename}"

    # ... Additional helper methods ...
```

### Integration with Vertex AI Agents

**Agent Integration**:
```python
# PM or SM agent invokes this task via tool call

from google.cloud import aiplatform

class PMAgent:
    """PM Agent with brownfield story creation capability."""

    def __init__(self):
        self.agent = aiplatform.Agent("pm-agent")

    def register_tools(self):
        """Register brownfield story creation as a tool."""

        self.agent.register_tool(
            name="brownfield-create-story",
            description="Create a single-session brownfield story for very small enhancements",
            parameters={
                "project_id": {"type": "string", "required": True},
                "enhancement_description": {"type": "string", "required": True},
                "user_type": {"type": "string", "required": True},
                "value_proposition": {"type": "string", "required": True},
                "existing_functionality": {"type": "string", "required": False},
                "technology_stack": {"type": "string", "required": False},
                "pattern_reference": {"type": "string", "required": False}
            },
            function_url="https://us-central1-PROJECT_ID.cloudfunctions.net/brownfield-create-story"
        )
```

### Escalation Handling

**Escalation Function**:
```python
class TaskOrchestrator:
    """Orchestrator handles task routing and escalation."""

    def route_task(self, task_name: str, request: Dict[str, Any]) -> Dict[str, Any]:
        """Route to appropriate task based on escalation."""

        task_mapping = {
            "brownfield-create-story": self.brownfield_create_story_handler,
            "brownfield-create-epic": self.brownfield_create_epic_handler,
            "create-brownfield-story": self.create_brownfield_story_handler,
            "full-brownfield-prd": self.full_brownfield_prd_handler
        }

        handler = task_mapping.get(task_name)
        if not handler:
            raise ValueError(f"Unknown task: {task_name}")

        return handler(request)

    def handle_escalation(self, escalation_response: Dict[str, Any]) -> Dict[str, Any]:
        """Handle escalation from one task to another."""

        escalated_task = escalation_response["escalation_task"]
        gathered_context = escalation_response["gathered_context"]

        # Route to escalated task with gathered context
        return self.route_task(escalated_task, {
            **gathered_context,
            "escalated_from": "brownfield-create-story",
            "escalation_reason": escalation_response["escalation_reason"]
        })
```

### Storage Schema

**Firestore Schema**:
```
/projects/{project_id}/stories/{story_id}
  - title: string
  - status: "Draft"
  - type: "brownfield"
  - scope: "single-session"
  - user_story: {user_type, want, so_that}
  - story_context: {integrates_with, technology, follows_pattern, touch_points}
  - acceptance_criteria: {functional, integration, quality}
  - technical_notes: {integration_approach, existing_pattern_reference, key_constraints}
  - definition_of_done: array<string>
  - risk_assessment: {primary_risk, mitigation, rollback, compatibility}
  - created_at: timestamp
  - created_by: "brownfield-create-story-task"
  - estimated_hours: number
```

**Cloud Storage**:
```
gs://{project_id}-stories/
  ├── brownfield-add-email-validation.md
  ├── brownfield-fix-memory-leak.md
  └── ...
```

### API Specification

**HTTP Endpoint**:
```yaml
POST /v1/projects/{project_id}/tasks/brownfield-create-story
Content-Type: application/json

Request Body:
{
  "enhancement_description": "Add email validation to registration form",
  "user_type": "end user",
  "value_proposition": "Prevent registration with invalid emails",
  "existing_functionality": "Registration form at src/auth/registration.tsx",
  "technology_stack": "React 18, Zod validation",
  "pattern_reference": "src/auth/login.tsx:45-60"
}

Response (Success):
{
  "status": "completed",
  "story_path": "gs://project-stories/brownfield-add-email-validation.md",
  "story_title": "Add Email Validation to Registration Form - Brownfield Addition",
  "integration_points": ["src/auth/registration.tsx", "form validation schema"],
  "primary_risk": "Email validation might be too strict and reject valid formats"
}

Response (Escalation):
{
  "status": "escalated",
  "escalation_reason": "Estimated development time (8h) exceeds single-session threshold (4h)",
  "escalation_task": "brownfield-create-epic",
  "gathered_context": { ... },
  "next_steps": "Use brownfield-create-epic to create a 2-3 story epic with proper planning"
}
```

### Monitoring and Observability

**Key Metrics to Track**:
```yaml
metrics:
  - execution_time_seconds: histogram
  - escalation_rate: counter (by escalation_task)
  - completion_rate: counter
  - assessment_time_seconds: histogram
  - story_creation_time_seconds: histogram
  - validation_failure_rate: counter (by failed_check)

  # Escalation reasons
  - escalations_by_scope: counter
  - escalations_by_complexity: counter
  - escalations_by_risk: counter
  - escalations_by_compatibility: counter

logs:
  - info: "Brownfield story creation started"
  - info: "Assessment complete: [scope, integration_points, pattern_found]"
  - info: "Story created: [title]"
  - info: "Risk assessment: [risk_level, primary_risk]"
  - warning: "Escalating: [reason, task]"
  - info: "Validation passed, story saved: [path]"
  - error: "Validation failed: [failed_checks]"
```

---

**Summary**: The ADK implementation should use a Cloud Function for lightweight, template-driven story generation with built-in escalation logic. Firestore stores story documents, Cloud Storage holds markdown files, and Vertex AI Agents (PM/SM) invoke the function as a tool. The function implements the 4-step workflow with multiple decision points that trigger escalation to more comprehensive tasks when complexity exceeds single-session threshold.

---

**End of Analysis**

**Document Metadata**:
- Lines: ~2,485
- Sections: 16
- Examples: 5 detailed scenarios
- Created: 2025-10-14
- Analyst: Claude (AI Agent)
- Framework: BMad Core v4
- Target: Google Vertex AI ADK Translation
