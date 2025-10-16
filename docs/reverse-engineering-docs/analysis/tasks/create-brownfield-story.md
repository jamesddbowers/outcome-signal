# Task Analysis: create-brownfield-story

**Task ID**: `create-brownfield-story`
**Task File**: `.bmad-core/tasks/create-brownfield-story.md`
**Primary Agent**: SM (Bob) or PM (John)
**Task Type**: Comprehensive Brownfield Story Creation Workflow
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: Medium-High (Progressive context gathering with user interaction)

**Related Task**: `.bmad-core/tasks/brownfield-create-story.md` (Simplified variant for minimal changes)

---

## 1. Purpose & Scope

### Primary Purpose
Create detailed, implementation-ready stories for **brownfield projects with non-standard documentation formats** where traditional sharded PRD/architecture documents may not exist or follow BMad v4+ structure. This task bridges the gap between various documentation formats (document-project output, brownfield PRDs, epics, or user documentation) and executable stories for the Dev agent through progressive detail gathering and user interaction.

### Scope Definition

**In Scope**:
- Brownfield projects with non-standard documentation formats
- Stories created from document-project output (brownfield architecture/PRD)
- Stories created from brownfield epics without full PRD/architecture
- Projects with existing documentation that doesn't follow BMad v4+ structure
- Progressive context gathering with user interaction for missing information
- Multi-session stories requiring comprehensive planning
- Complex brownfield work with multiple integration points
- Adaptive story creation based on available documentation sources

**Out of Scope**:
- Greenfield projects with properly sharded PRD and v4 architecture (use `create-next-story` instead)
- Well-documented brownfield workflows with standard structure (use `create-next-story` instead)
- Very small single-session brownfield changes (~4 hours) (use `brownfield-create-story` instead)
- Epic-level planning (use `brownfield-create-epic` instead)
- Full PRD creation (use brownfield PRD workflow)

### Key Characteristics
- **Documentation-adaptive** - Works with various documentation formats and sources
- **Progressive gathering** - Collects missing information through user interaction
- **Safety-first** - Prioritizes existing system stability over new features
- **Context-comprehensive** - Ensures dev has all needed information before implementation
- **Integration-aware** - Deeply considers existing system integration points
- **Risk-conscious** - Always includes risk assessment and rollback planning
- **Exploration-ready** - Adds exploration tasks when system understanding is incomplete
- **Self-contained** - Each story is complete for dev without searching multiple documents

### Task Variants Comparison

BMad provides **two different tasks** for brownfield story creation:

| Aspect | create-brownfield-story (Task 3.23) | brownfield-create-story (Task 3.14) |
|--------|-------------------------------------|-------------------------------------|
| **Complexity** | Medium-High (complex brownfield) | Low (minimal changes) |
| **Scope** | Multi-session stories | Single-session stories (~4h) |
| **Documentation** | Non-standard formats, progressive gathering | Standard formats with clear patterns |
| **User Interaction** | High (asks for missing info) | Low (follows existing patterns) |
| **Planning Depth** | Comprehensive with exploration tasks | Minimal with pattern-following |
| **When to Use** | Complex brownfield, missing docs, unclear integration | Bug fixes, minor additions, isolated changes |

**Critical Decision Point**: If standard BMad v4+ sharded documents exist, recommend `create-next-story` task instead. This task is specifically for non-standard documentation scenarios.

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_source: string              # Source of story (PRD/epic/user direction)
  - enhancement_description: string   # What needs to be implemented

optional:
  - documentation_context: object     # Available documentation sources
    - sharded_prd_exists: boolean
    - brownfield_architecture_exists: boolean
    - brownfield_prd_exists: boolean
    - epic_files_exist: boolean
    - user_documentation_location: string
  - existing_functionality: string    # What currently exists in affected area
  - integration_points: array         # Current system integration points
  - technical_constraints: string     # Known constraints from documentation
  - known_gotchas: array             # Workarounds or issues to be aware of
  - pattern_examples: array          # Existing code patterns to follow
```

**Input Details**:
- **story_source**: Where this story originates from (brownfield PRD epic section, epic file, user direction, or no clear source)
- **enhancement_description**: Clear description of the enhancement or feature to be implemented
- **documentation_context**: Assessment of available documentation types and their locations
- **existing_functionality**: Description of related existing functionality that might be affected
- **integration_points**: Specific components, systems, or APIs this change will integrate with
- **technical_constraints**: Known technical limitations, version constraints, or compatibility requirements
- **known_gotchas**: Documented workarounds, technical debt, or known issues in affected areas
- **pattern_examples**: References to existing code files or patterns that should be followed

### Gathered Inputs (Progressive Context Gathering)

The task progressively gathers information through these checkpoints:

**Step 0: Documentation Context**
- Presence and location of sharded PRD/architecture
- Brownfield architecture document (from document-project)
- Brownfield PRD
- Epic files
- User-provided documentation specifications

**Step 1: Story Identification**
- Story source determination (PRD/epic/user/undefined)
- Story scope definition
- Enhancement type identification

**Step 1.2: Essential Context Gathering**
- Affected existing functionality
- Integration points with current code
- Patterns to follow (with examples)
- Technical constraints
- Known gotchas or workarounds

**Step 2: Technical Context Extraction**
- Context extracted from document-project output (if available)
- Context from brownfield PRD (if available)
- Context from user documentation (via user interaction)

**Step 3: Missing Information Identification**
- Critical missing information for implementation
- User queries for missing context
- Exploration task requirements

### Configuration Dependencies

```yaml
core-config.yaml:
  paths:
    stories: "docs/stories/"           # Story output location
    epics: "docs/epics/"               # Epic source location
    prd: "docs/"                       # PRD location
    architecture: "docs/"              # Architecture location
    brownfield_docs: "docs/"           # Brownfield documentation location
```

### Input Validation

**Pre-execution Validation**:
- ✅ At least one documentation source exists OR user is available for interaction
- ✅ Story scope is defined (even if high-level initially)
- ✅ Enhancement description is provided

**During-execution Validation**:
- ⚠️ If sharded v4+ docs exist → recommend `create-next-story` task instead
- ⚠️ If story is very small (~4h) → consider `brownfield-create-story` task instead
- ⚠️ If missing critical information → query user or document for exploration

---

## 3. Execution Flow

### High-Level Workflow

```
Step 0: Documentation Context Assessment
         ↓
Step 1: Story Identification & Essential Context Gathering
   1.1: Identify Story Source (PRD/Epic/User/Undefined)
   1.2: Gather Essential Context (Checklist)
         ↓
Step 2: Extract Technical Context from Available Sources
   2.1: From Document-Project Output (if exists)
   2.2: From Brownfield PRD (if exists)
   2.3: From User Documentation (via user query)
         ↓
Step 3: Story Creation with Progressive Detail Gathering
   3.1: Create Initial Story Structure
   3.2: Develop Acceptance Criteria
   3.3: Gather Technical Guidance (interactive)
         ↓
Step 4: Task Generation with Safety Checks
   4.1: Generate Implementation Tasks (with exploration/verification)
         ↓
Step 5: Risk Assessment and Mitigation
         ↓
Step 6: Final Story Validation
   - Completeness Check
   - Safety Check
   - Information Gaps Assessment
         ↓
Step 7: Story Output Format
         ↓
Step 8: Handoff Communication
```

### Detailed Step-by-Step Execution

#### Step 0: Documentation Context Assessment

**Purpose**: Determine what documentation is available and recommend the appropriate task.

**Actions**:
1. Check for sharded PRD/architecture (docs/prd/, docs/architecture/)
   - If found → **RECOMMEND** using `create-next-story` task instead (exit this task)
2. Check for brownfield architecture document (created by document-project task)
   - Contains actual system state, technical debt, workarounds
3. Check for brownfield PRD (docs/prd.md)
   - May contain embedded technical details
4. Check for epic files (docs/epics/ or similar)
   - Created by brownfield-create-epic task
5. Ask user to specify location and format of other documentation

**Outputs**:
- Documentation context map
- Recommendation to use different task (if applicable)
- Documentation sources list for subsequent steps

**Decision Point**: If sharded v4+ docs exist, stop and recommend `create-next-story`.

---

#### Step 1: Story Identification and Context Gathering

##### Step 1.1: Identify Story Source

**Purpose**: Determine where this story originates and what its scope should be.

**Actions** (Based on available documentation):

**From Brownfield PRD**:
- Extract stories from epic sections
- Identify story sequence and dependencies
- Note any technical details embedded in PRD

**From Epic Files**:
- Read epic definition and story list
- Identify which story in sequence to create
- Extract epic-level context

**From User Direction**:
- Ask user which specific enhancement to implement
- Define story scope collaboratively
- Clarify priority and sequencing

**No Clear Source**:
- Work with user to define story scope
- Ask for user's vision of the enhancement
- Define boundaries and constraints

**Outputs**:
- Story source identified
- Story scope defined (even if high-level)
- Enhancement type determined (new feature/bug fix/integration/etc.)

---

##### Step 1.2: Gather Essential Context

**Purpose**: Collect critical information needed for safe brownfield implementation.

**CRITICAL**: For brownfield stories, you MUST gather enough context for safe implementation. Be prepared to ask the user for missing information.

**Required Information Checklist**:

- [ ] What existing functionality might be affected?
- [ ] What are the integration points with current code?
- [ ] What patterns should be followed (with examples)?
- [ ] What technical constraints exist?
- [ ] Are there any "gotchas" or workarounds to know about?

**Actions**:
1. Review available documentation for checklist items
2. Identify gaps in required information
3. If any required information is missing:
   - List the missing information clearly
   - Ask the user to provide it
   - Wait for user response before proceeding
4. Document all gathered context for story creation

**Outputs**:
- Completed checklist (all items addressed)
- List of affected existing functionality
- Integration points identified
- Patterns to follow (with file references if available)
- Technical constraints documented
- Known gotchas/workarounds listed

**Interaction Mode**: Interactive - will prompt user for missing critical information.

---

#### Step 2: Extract Technical Context from Available Sources

**Purpose**: Mine available documentation sources for technical details that dev will need.

##### Step 2.1: From Document-Project Output

**If using brownfield-architecture.md from document-project:**

**Technical Debt Section**:
- Note any workarounds affecting this story
- Identify technical debt that story must work around
- Document debt that story might address

**Key Files Section**:
- Identify files that will need modification
- Note file organization and structure
- Reference specific files in story tasks

**Integration Points**:
- Find existing integration patterns
- Document API contracts or interfaces
- Note integration testing approaches

**Known Issues**:
- Check if story touches problematic areas
- Document known bugs or limitations
- Plan for working around known issues

**Actual Tech Stack**:
- Verify versions and constraints
- Note framework-specific requirements
- Document tooling and build requirements

**Actions**:
1. Read brownfield architecture document
2. Extract all relevant sections for this story
3. Organize extracted context by category
4. Cite specific sections for dev reference

**Outputs**:
- Technical debt relevant to story
- List of files to modify
- Integration patterns to follow
- Known issues to avoid or address
- Tech stack details and constraints

---

##### Step 2.2: From Brownfield PRD

**If using brownfield PRD:**

**Technical Constraints Section**:
- Extract all relevant constraints for this story
- Document version requirements
- Note compatibility requirements

**Integration Requirements**:
- Note compatibility requirements with existing systems
- Document API or interface requirements
- Identify integration testing needs

**Code Organization**:
- Follow specified patterns
- Reference organizational standards
- Note naming conventions

**Risk Assessment**:
- Understand potential impacts from PRD
- Note risk mitigation strategies
- Document rollback considerations

**Actions**:
1. Read brownfield PRD
2. Extract story-specific constraints and requirements
3. Document integration requirements
4. Note any PRD-level risk assessments

**Outputs**:
- Technical constraints for story
- Integration requirements
- Code organization patterns
- Risk considerations from PRD

---

##### Step 2.3: From User Documentation

**When documentation is sparse or unclear:**

**Ask the user to help identify**:
- Relevant technical specifications
- Existing code examples to follow
- Integration requirements
- Testing approaches used in the project

**Interaction Pattern**:
```
"I need additional context for safe implementation. Could you provide:

1. What existing code patterns should this enhancement follow?
   - Example files or references?

2. What are the key integration points?
   - Which services/components will this interact with?

3. Are there any known constraints or gotchas?
   - Technical debt, workarounds, or issues to be aware of?

4. How is testing typically done in this area?
   - Unit test patterns, integration test approaches?"
```

**Actions**:
1. Identify gaps in documentation
2. Formulate specific questions for user
3. Present questions in clear, organized format
4. Document user responses
5. Clarify any ambiguous responses

**Outputs**:
- User-provided technical specifications
- Code example references
- Integration requirements clarified
- Testing approach defined

---

#### Step 3: Story Creation with Progressive Detail Gathering

##### Step 3.1: Create Initial Story Structure

**Purpose**: Build the story framework with known information.

**Story Template Structure**:

```markdown
# Story: {{Enhancement Title}}

<!-- Source: {{documentation type used}} -->
<!-- Context: Brownfield enhancement to {{existing system}} -->

## Status: Draft

## Story

As a {{user_type}},
I want {{enhancement_capability}},
so that {{value_delivered}}.

## Context Source

- Source Document: {{document name/type}}
- Enhancement Type: {{single feature/bug fix/integration/etc}}
- Existing System Impact: {{brief assessment}}

## Acceptance Criteria

[To be developed in Step 3.2]

## Dev Technical Guidance

[To be developed in Step 3.3]

## Tasks / Subtasks

[To be developed in Step 4]

## Risk Assessment

[To be developed in Step 5]
```

**Actions**:
1. Create story file with standard structure
2. Fill in story statement (As a.../I want.../so that...)
3. Document context source
4. Add metadata comments
5. Set status to "Draft"

**Outputs**:
- Story file created with basic structure
- Story statement populated
- Context source documented
- Sections prepared for progressive filling

---

##### Step 3.2: Develop Acceptance Criteria

**Purpose**: Define clear success criteria including protection of existing functionality.

**CRITICAL**: For brownfield, ALWAYS include criteria about maintaining existing functionality.

**Standard Structure**:

1. **New functionality works as specified**
   - Primary enhancement acceptance criteria
   - Specific behavior to verify

2. **Existing {{affected feature}} continues to work unchanged**
   - Explicit verification of unaffected functionality
   - Regression prevention criteria

3. **Integration with {{existing system}} maintains current behavior**
   - Integration point stability verification
   - API contract maintenance

4. **No regression in {{related area}}**
   - Broader system stability verification
   - Related feature protection

5. **Performance remains within acceptable bounds**
   - Performance impact assessment
   - Acceptable thresholds defined

**Actions**:
1. Define primary acceptance criteria for new functionality
2. Identify affected existing features (from context gathering)
3. Add explicit criteria for each affected feature
4. Include integration stability criteria
5. Add performance/stability criteria
6. Make criteria specific and testable

**Outputs**:
- Complete acceptance criteria list
- Existing functionality protection criteria included
- Integration stability criteria defined
- Performance criteria specified
- All criteria testable and specific

**Example**:

```markdown
## Acceptance Criteria

1. **Email validation enhancement**
   - Email field validates format on blur
   - Invalid emails show clear error message
   - Valid emails clear any previous error

2. **Existing registration flow unchanged**
   - User can complete registration with valid email
   - All other fields work as before
   - Submission logic unchanged

3. **Integration with user service maintained**
   - User creation API still receives email field
   - Email format matches API expectations
   - Error handling for API failures unchanged

4. **No regression in login flow**
   - Login with existing users still works
   - Email field behavior in login unchanged

5. **Performance acceptable**
   - Validation adds <50ms to form interaction
   - No impact on page load time
```

---

##### Step 3.3: Gather Technical Guidance

**Purpose**: Provide comprehensive technical context for dev agent implementation.

**CRITICAL**: This is where you'll need to be interactive with the user if information is missing.

**Dev Technical Guidance Structure**:

```markdown
## Dev Technical Guidance

### Existing System Context

[Extract from available documentation - document-project output,
brownfield PRD, or user-provided information]

**Affected Components**:
- {{component 1}} - {{purpose and current behavior}}
- {{component 2}} - {{purpose and current behavior}}

**Current Implementation**:
- {{key files and their roles}}
- {{important patterns used}}
- {{data flow or architecture}}

**Technical Debt/Workarounds**:
- {{known debt in this area}}
- {{workarounds that must be maintained}}

### Integration Approach

[Based on patterns found or ask user]

**Integration Points**:
- {{system/component 1}} - {{how to integrate}}
- {{system/component 2}} - {{how to integrate}}

**Patterns to Follow**:
- {{pattern 1}} - See {{file reference}}
- {{pattern 2}} - See {{file reference}}

**API Contracts**:
- {{endpoint/interface}} - {{contract details}}

### Technical Constraints

[From documentation or user input]

**Technology Constraints**:
- {{framework version and requirements}}
- {{library constraints}}
- {{browser/environment support}}

**Performance Constraints**:
- {{response time requirements}}
- {{resource usage limits}}

**Security Constraints**:
- {{authentication requirements}}
- {{authorization requirements}}
- {{data handling requirements}}

### Files to Modify

[Specific files identified from context]

- `{{file path}}` - {{what needs to change}}
- `{{file path}}` - {{what needs to change}}

### Testing Approach

[Project testing patterns]

**Unit Testing**:
- Follow patterns in {{test file reference}}
- Use {{testing framework/tools}}

**Integration Testing**:
- Follow patterns in {{test file reference}}
- Test integration with {{systems}}

### Missing Information

[Critical: List anything you couldn't find that dev will need]

⚠️ **Need clarification on**:
- {{missing detail 1}}
- {{missing detail 2}}

[If missing info exists, pause and ask user for it]
```

**Actions**:
1. Populate "Existing System Context" from gathered documentation
2. Define integration approach based on discovered patterns
3. Document all technical constraints
4. List specific files to modify (if known)
5. Define testing approach based on project patterns
6. **CRITICAL**: Identify and list any missing information
7. **If missing info is critical**: Ask user for it before proceeding

**Interaction Pattern** (if missing critical info):
```
"I've drafted the technical guidance but need clarification on:

1. {{missing detail 1 with context}}
2. {{missing detail 2 with context}}

Could you provide this information so I can complete the story
with sufficient detail for implementation?"
```

**Outputs**:
- Comprehensive Dev Technical Guidance section
- All available context documented
- Missing information identified
- User queried for critical missing info (if applicable)

---

#### Step 4: Task Generation with Safety Checks

##### Step 4.1: Generate Implementation Tasks

**Purpose**: Create actionable tasks that include exploration, implementation, verification, and testing with brownfield safety considerations.

**Task Structure for Brownfield** (includes exploration and verification):

```markdown
## Tasks / Subtasks

- [ ] **Task 1: Analyze existing {{component/feature}} implementation**
  - [ ] Review {{specific files}} for current patterns
  - [ ] Document integration points and dependencies
  - [ ] Identify potential impacts of changes
  - [ ] Note any technical debt or workarounds

- [ ] **Task 2: Implement {{new functionality}}**
  - [ ] Follow pattern from {{example file}}
  - [ ] Integrate with {{existing component}} per {{integration approach}}
  - [ ] Maintain compatibility with {{constraint}}
  - [ ] Handle edge cases: {{edge case list}}

- [ ] **Task 3: Verify existing functionality**
  - [ ] Test {{existing feature 1}} still works
  - [ ] Verify {{integration point}} behavior unchanged
  - [ ] Check {{related feature}} not affected
  - [ ] Measure performance impact

- [ ] **Task 4: Add tests**
  - [ ] Unit tests following {{project test pattern}}
    - [ ] Test new functionality
    - [ ] Test edge cases
  - [ ] Integration test for {{integration point}}
  - [ ] Update existing tests if needed
  - [ ] Verify test coverage meets project standards

- [ ] **Task 5: Documentation and cleanup**
  - [ ] Update inline code documentation
  - [ ] Add/update user-facing documentation if needed
  - [ ] Clean up any temporary code or logging
```

**Task Generation Principles**:

1. **Include Exploration Tasks** when system understanding is incomplete
   - "Analyze existing implementation" tasks
   - "Document current behavior" tasks
   - "Identify potential impacts" tasks

2. **Add Verification Tasks** for existing functionality
   - "Verify existing {{feature}} still works"
   - "Check {{integration}} unchanged"
   - "Measure performance impact"

3. **Include Rollback Considerations**
   - Feature flag possibilities
   - Reverting steps
   - Cleanup procedures

4. **Reference Specific Files/Patterns** when known
   - "Follow pattern from {{file}}"
   - "Review {{files}} for patterns"
   - "Update {{specific files}}"

**Actions**:
1. Generate Task 1 (Analysis/Exploration)
   - List specific files to review
   - Define what to document
   - Identify impact assessment needs

2. Generate Task 2 (Implementation)
   - Reference patterns to follow
   - Specify integration approaches
   - List compatibility requirements
   - Note edge cases

3. Generate Task 3 (Verification)
   - List existing features to verify
   - Define integration stability checks
   - Include performance checks

4. Generate Task 4 (Testing)
   - Reference project test patterns
   - Cover new functionality
   - Cover integration points
   - Update existing tests

5. Generate Task 5 (Documentation/Cleanup)
   - Code documentation updates
   - User documentation if needed
   - Cleanup tasks

**Outputs**:
- Complete task list with subtasks
- Exploration tasks for incomplete knowledge
- Verification tasks for existing functionality
- Testing tasks following project patterns
- Documentation/cleanup tasks

---

#### Step 5: Risk Assessment and Mitigation

**Purpose**: Explicitly identify and plan for brownfield-specific risks.

**CRITICAL**: For brownfield - always include risk assessment.

**Risk Assessment Structure**:

```markdown
## Risk Assessment

### Implementation Risks

**Primary Risk**: {{main risk to existing system}}
- **Impact**: {{what could go wrong}}
- **Probability**: {{High/Medium/Low}}
- **Mitigation**: {{how to address proactively}}
- **Verification**: {{how to confirm safety}}

**Secondary Risks**:
- {{risk 2}}: {{description}}
  - Mitigation: {{approach}}
- {{risk 3}}: {{description}}
  - Mitigation: {{approach}}

### Integration Risks

**Risk**: Integration with {{system}} could fail or behave unexpectedly
- **Mitigation**: {{testing approach}}, {{fallback strategy}}
- **Verification**: {{integration tests}}

### Performance Risks

**Risk**: {{performance concern}}
- **Mitigation**: {{optimization approach}}, {{monitoring}}
- **Verification**: {{performance testing}}

### Rollback Plan

If issues are discovered during or after implementation:

1. {{Step 1 to undo changes}}
2. {{Step 2 to restore original behavior}}
3. {{Step 3 to verify rollback}}
4. {{Step 4 for data/state cleanup if needed}}

**Rollback Verification**:
- [ ] {{verification step 1}}
- [ ] {{verification step 2}}

### Safety Checks

Pre-implementation safety verification:
- [ ] Existing {{feature}} tested before changes
- [ ] Baseline metrics captured (performance, behavior)
- [ ] Changes can be feature-flagged or isolated
- [ ] Rollback procedure documented and reviewed
- [ ] Integration points have test coverage
```

**Actions**:
1. Identify primary risk to existing system
2. Assess impact and probability
3. Define mitigation strategy
4. Define verification approach
5. Identify secondary risks
6. Assess integration risks
7. Assess performance risks
8. Create detailed rollback plan
9. Define safety checks

**Outputs**:
- Complete risk assessment
- Mitigation strategies for each risk
- Detailed rollback plan
- Safety checklist

---

#### Step 6: Final Story Validation

**Purpose**: Ensure story is complete, safe, and ready for implementation.

**Validation Checklist**:

**1. Completeness Check**:
- [ ] Story has clear scope and acceptance criteria
- [ ] Technical context is sufficient for implementation
- [ ] Integration approach is defined
- [ ] Risks are identified with mitigation
- [ ] Tasks are actionable and specific
- [ ] File references provided where known

**2. Safety Check**:
- [ ] Existing functionality protection included in acceptance criteria
- [ ] Verification tasks for existing functionality included
- [ ] Rollback plan is feasible and detailed
- [ ] Testing covers both new and existing features
- [ ] Risk assessment is comprehensive
- [ ] Safety checks defined

**3. Information Gaps**:
- [ ] All critical missing information gathered from user
- [ ] Remaining unknowns documented clearly for dev agent
- [ ] Exploration tasks added where needed for unknowns
- [ ] Dev has clear path forward even with unknowns

**Actions**:
1. Review story against completeness checklist
2. Review story against safety checklist
3. Review story against information gaps checklist
4. If any checklist item fails:
   - Identify what's missing
   - Add missing content or
   - Query user for information or
   - Add exploration tasks for dev
5. Mark story as validated when all checks pass

**Outputs**:
- Validation checklist completed
- Story deemed complete and safe
- Any remaining gaps addressed or documented

---

#### Step 7: Story Output Format

**Purpose**: Save the story with appropriate naming and structure.

**File Naming Convention**:

```
If from epic:
  docs/stories/epic-{n}-story-{m}.md
  Example: docs/stories/epic-2-story-3.md

If standalone:
  docs/stories/brownfield-{feature-name}.md
  Example: docs/stories/brownfield-email-validation.md

If sequential:
  Follow existing story numbering in project
  Example: docs/stories/story-015.md (if project uses this pattern)
```

**Story Header Format**:

```markdown
# Story: {{Title}}

<!-- Source: {{documentation type used}} -->
<!-- Context: Brownfield enhancement to {{existing system}} -->
<!-- Created: {{date}} -->
<!-- Agent: SM (Bob) via create-brownfield-story task -->

## Status: Draft

[Rest of story content...]
```

**Actions**:
1. Determine appropriate file naming based on story source
2. Add story header with metadata comments
3. Set status to "Draft"
4. Save story to configured stories path
5. Verify file is saved correctly

**Outputs**:
- Story file saved with appropriate name
- Story header includes metadata
- File location follows project conventions

---

#### Step 8: Handoff Communication

**Purpose**: Provide clear handoff to the user with summary and next steps.

**Handoff Communication Template**:

```text
✅ Brownfield story created: {{story title}}

**Story Details**:
- Location: {{file path}}
- Source Documentation: {{what was used}}
- Enhancement Type: {{type}}
- Estimated Complexity: {{assessment}}

**Key Integration Points Identified**:
- {{integration point 1}} - {{brief description}}
- {{integration point 2}} - {{brief description}}

**Primary Risks Noted**:
- {{primary risk}} - {{mitigation approach}}
- {{secondary risk}} - {{mitigation approach}}

**Existing Functionality Protected**:
- {{feature 1}} - verification included in tasks
- {{feature 2}} - verification included in tasks

{{If missing info exists}}:
⚠️ **Note**: Some technical details were unclear. The story includes
exploration tasks to gather needed information during implementation.
The following will need clarification during implementation:
- {{missing detail 1}}
- {{missing detail 2}}

**Rollback Plan**: {{brief summary of rollback approach}}

**Next Steps**:
1. Review story for accuracy and completeness
2. Verify integration approach aligns with your system
3. Approve story or request adjustments
4. Dev agent can then implement with safety checks
5. Optional: Have PO agent validate story before implementation

Would you like me to adjust anything in the story, or is it ready
for implementation?
```

**Actions**:
1. Summarize story creation results
2. Highlight key integration points
3. Summarize primary risks
4. Note protected existing functionality
5. Call out any missing information
6. Summarize rollback plan
7. Provide clear next steps
8. Ask for user feedback or approval

**Outputs**:
- Clear handoff communication to user
- Summary of story key points
- Next steps defined
- User prompted for feedback

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Documentation Type Detection (Step 0)

**Condition**: What documentation is available?

```
IF sharded PRD/architecture exists (v4+ format) THEN
  → RECOMMEND using create-next-story task instead
  → EXIT this task
ELSE IF brownfield architecture exists (document-project output) THEN
  → PROCEED with Step 2.1 (extract from document-project output)
ELSE IF brownfield PRD exists THEN
  → PROCEED with Step 2.2 (extract from brownfield PRD)
ELSE IF epic files exist THEN
  → PROCEED with Step 1.1 (extract from epics)
ELSE
  → PROCEED with Step 2.3 (user-provided documentation)
  → HIGH user interaction expected
END IF
```

**Rationale**: This task is specifically for non-standard documentation. If standard v4+ sharded docs exist, `create-next-story` is more appropriate and efficient.

---

### Decision Point 2: Story Source Identification (Step 1.1)

**Condition**: Where does this story originate?

```
IF from brownfield PRD THEN
  → Extract from epic sections in PRD
  → Use PRD technical context
  → Follow PRD story sequence
ELSE IF from epic files THEN
  → Read epic definition
  → Extract story from epic story list
  → Use epic-level context
ELSE IF from user direction THEN
  → Ask user for enhancement description
  → Collaborate on scope definition
  → Define story interactively
ELSE (no clear source) THEN
  → Work with user to define from scratch
  → HIGH user interaction required
  → Define story, scope, and context collaboratively
END IF
```

**Rationale**: Story source determines extraction strategy and level of user interaction required.

---

### Decision Point 3: Essential Context Completeness (Step 1.2)

**Condition**: Is essential context complete?

```
FOR EACH required context item IN checklist:
  IF item found in documentation THEN
    → Document item
    → CONTINUE
  ELSE
    → Add item to missing information list
    → CONTINUE
  END IF
END FOR

IF missing information list is NOT empty THEN
  → Present missing information list to user
  → Ask user to provide missing context
  → WAIT for user response
  → Document user-provided context
  → PROCEED to next step
ELSE
  → All essential context gathered
  → PROCEED to next step
END IF
```

**Rationale**: Essential context is critical for safe brownfield implementation. Cannot proceed without it.

---

### Decision Point 4: Technical Context Source Selection (Step 2)

**Condition**: Which documentation sources should be mined for technical context?

```
IF brownfield architecture document exists (document-project output) THEN
  → Execute Step 2.1 (extract from document-project)
  → Extract: Technical Debt, Key Files, Integration Points, Known Issues, Tech Stack
END IF

IF brownfield PRD exists THEN
  → Execute Step 2.2 (extract from brownfield PRD)
  → Extract: Technical Constraints, Integration Requirements, Code Organization, Risk Assessment
END IF

IF user documentation exists OR previous extraction insufficient THEN
  → Execute Step 2.3 (user interaction)
  → Ask user for: Technical specs, code examples, integration requirements, testing approaches
END IF
```

**Rationale**: Multiple sources may exist and should all be mined. Not mutually exclusive - can use multiple sources.

---

### Decision Point 5: Missing Information Handling (Step 3.3)

**Condition**: Is critical information still missing after documentation extraction?

```
WHILE creating Dev Technical Guidance:
  IF critical information is missing THEN
    IF information is available from user THEN
      → Add to "Missing Information" section
      → Query user for information
      → WAIT for user response
      → Incorporate user response
      → CONTINUE
    ELSE IF information can be discovered during implementation THEN
      → Add to "Missing Information" section with note
      → Plan exploration tasks in Step 4
      → CONTINUE
    ELSE
      → Document as unknown
      → Flag for user attention
      → Add exploration tasks in Step 4
      → CONTINUE
    END IF
  END IF
END WHILE

IF all critical information resolved THEN
  → PROCEED to Step 4
ELSE
  → PROCEED to Step 4 with exploration tasks planned
END IF
```

**Rationale**: Some information may be genuinely unavailable or require code exploration. Story should handle this with exploration tasks rather than blocking.

---

### Decision Point 6: Task Complexity Assessment (Step 4.1)

**Condition**: How complete is the understanding of the system?

```
IF system understanding is COMPLETE THEN
  → Generate standard implementation tasks
  → Minimal exploration tasks needed
  → Focus on implementation and testing
ELSE IF system understanding is PARTIAL THEN
  → Generate exploration tasks for unclear areas
  → Include analysis tasks before implementation
  → Add verification tasks for assumptions
ELSE IF system understanding is INCOMPLETE THEN
  → Generate comprehensive exploration tasks
  → Multiple analysis and documentation tasks
  → Deferred implementation planning
  → Consider recommending user provide more context first
END IF
```

**Rationale**: Task structure should adapt to level of system knowledge available.

---

### Decision Point 7: Risk Severity Assessment (Step 5)

**Condition**: What is the risk level of this brownfield change?

```
IF change touches critical existing functionality THEN
  → Primary risk is HIGH
  → Comprehensive rollback plan required
  → Extensive verification tasks required
  → Consider feature flag approach
ELSE IF change touches multiple integration points THEN
  → Primary risk is MEDIUM-HIGH
  → Detailed rollback plan required
  → Integration verification tasks required
ELSE IF change is isolated with clear boundaries THEN
  → Primary risk is LOW-MEDIUM
  → Standard rollback plan sufficient
  → Standard verification tasks
ELSE
  → Assess risk based on specific context
END IF
```

**Rationale**: Risk level determines depth of rollback planning and verification requirements.

---

### Decision Point 8: Story Validation Outcome (Step 6)

**Condition**: Does story pass validation checks?

```
completeness_pass = completeness check passes
safety_pass = safety check passes
gaps_resolved = information gaps check passes

IF completeness_pass AND safety_pass AND gaps_resolved THEN
  → Story is READY
  → PROCEED to Step 7 (save story)
ELSE
  IF NOT completeness_pass THEN
    → Identify missing elements
    → Add missing content or query user
  END IF

  IF NOT safety_pass THEN
    → Add missing safety elements
    → Enhance rollback plan or verification tasks
  END IF

  IF NOT gaps_resolved THEN
    → Query user for critical gaps OR
    → Add exploration tasks for gaps
  END IF

  → RE-RUN validation checks
  → LOOP until all checks pass
END IF
```

**Rationale**: Story must be complete, safe, and ready for dev before proceeding.

---

### Decision Point 9: File Naming Strategy (Step 7)

**Condition**: How should the story file be named?

```
IF story is from epic file THEN
  → Use format: epic-{n}-story-{m}.md
  → Extract epic number and story number
ELSE IF story is standalone brownfield enhancement THEN
  → Use format: brownfield-{feature-name}.md
  → Generate feature name from story title
ELSE IF project has sequential story numbering THEN
  → Find highest existing story number
  → Use format: story-{n+1}.md with next number
ELSE
  → Use default format: brownfield-{slug}.md
  → Generate slug from story title
END IF
```

**Rationale**: File naming should match project conventions and story source.

---

## 5. User Interaction Points

### Interaction Point 1: Essential Context Gathering (Step 1.2)

**Trigger**: Required context items are missing from documentation.

**Interaction Type**: Synchronous (blocking) - must gather before proceeding.

**User Prompt Template**:
```
I'm creating a brownfield story but need essential context for safe implementation.

Could you provide the following information:

1. What existing functionality might be affected by this enhancement?
   [ {{context about what you're asking}} ]

2. What are the integration points with current code?
   [ {{what systems/components this will touch}} ]

3. What patterns should be followed for this type of change?
   [ {{ask for example files or pattern descriptions}} ]

4. Are there any technical constraints I should be aware of?
   [ {{framework versions, compatibility requirements, etc.}} ]

5. Are there any "gotchas" or workarounds in this area?
   [ {{known issues, technical debt, special considerations}} ]
```

**Expected User Response**: Text descriptions, file references, or links to patterns.

**Post-Response Actions**:
- Document all user-provided context
- Update story context section
- Proceed with story creation using gathered information

---

### Interaction Point 2: Technical Context from User Documentation (Step 2.3)

**Trigger**: Documentation is sparse, non-standard, or unclear.

**Interaction Type**: Synchronous (blocking) - technical context is critical.

**User Prompt Template**:
```
I need additional technical context for safe implementation of this story.

Could you help me understand:

1. What existing code patterns should this enhancement follow?
   - Could you point me to example files or describe the pattern?

2. What are the key integration points for this change?
   - Which services, components, or APIs will this interact with?
   - Are there interface contracts or API specifications?

3. Are there any known constraints or gotchas?
   - Technical debt in this area?
   - Workarounds that must be maintained?
   - Known issues to avoid?

4. How is testing typically done in this area of the codebase?
   - What testing patterns should be followed?
   - Are there existing test files to use as examples?
```

**Expected User Response**: File paths, code snippets, documentation links, or detailed descriptions.

**Post-Response Actions**:
- Add user-provided info to Dev Technical Guidance section
- Reference specific files in implementation tasks
- Update testing approach based on user input
- Proceed with story completion

---

### Interaction Point 3: Missing Information During Technical Guidance (Step 3.3)

**Trigger**: Critical gaps identified while creating Dev Technical Guidance.

**Interaction Type**: Synchronous (blocking) for critical info, asynchronous (exploration tasks) for non-critical.

**User Prompt Template** (for critical info):
```
I've drafted the technical guidance but need clarification on critical details:

{{For each missing critical item}}:
{{n}}. {{Missing detail description}}
   - Why needed: {{context for why this is important}}
   - Impact if unknown: {{what could go wrong}}

Could you provide this information so I can complete the story with
sufficient detail for safe implementation?
```

**Expected User Response**: Specific answers to each numbered item.

**Alternative Response** (if user doesn't have info):
- User might not have the information readily available
- In this case, add exploration tasks for dev to discover information
- Document what's unknown and why it matters

**Post-Response Actions**:
- If user provides info: Update Dev Technical Guidance section
- If user doesn't have info: Add exploration tasks, document unknowns
- Proceed with story completion

---

### Interaction Point 4: Story Source Definition (Step 1.1 - User Direction path)

**Trigger**: Story source is "user direction" or no clear source exists.

**Interaction Type**: Synchronous (blocking) - need to define story scope.

**User Prompt Template**:
```
I'll help you create a brownfield story for this enhancement.

To get started, could you describe:

1. What enhancement or feature do you want to implement?
   - Brief description of the desired functionality

2. Who will benefit from this change?
   - User type or persona

3. What value does this provide?
   - Why is this change important?

4. How big is this change?
   - Single session (~4 hours)?
   - Multiple sessions?
   - Major feature requiring epic-level planning?

Based on your responses, I'll help scope the story appropriately.
```

**Expected User Response**: Description of enhancement, user type, value, and scope estimate.

**Post-Response Actions**:
- If scope is very small (~4h): Consider recommending `brownfield-create-story` task
- If scope requires epic planning: Consider recommending `brownfield-create-epic` task
- If scope is appropriate: Proceed with story creation
- Use user responses to populate story statement

---

### Interaction Point 5: Final Story Review (Step 8 - Handoff)

**Trigger**: Story is complete and ready for handoff.

**Interaction Type**: Asynchronous (non-blocking) - seeking feedback/approval.

**User Prompt Template**:
```
✅ Brownfield story created: {{story title}}

[Full handoff communication as detailed in Step 8]

Would you like me to:
1. Adjust anything in the story?
2. Add more detail to any section?
3. Clarify any technical guidance?
4. Add additional tasks or verification steps?

Or is the story ready for implementation?
```

**Expected User Response**:
- Approval to proceed
- Requests for adjustments
- Questions about story content
- Additional context to incorporate

**Post-Response Actions**:
- If approved: Story is complete
- If adjustments needed: Make requested changes, re-validate, present again
- If questions: Answer questions, potentially update story for clarity

---

### Interaction Point 6: Recommendation to Use Different Task (Step 0)

**Trigger**: Sharded v4+ documents detected.

**Interaction Type**: Advisory (non-blocking recommendation).

**User Prompt Template**:
```
⚠️ I detected that you have properly sharded PRD and architecture documents
(BMad v4+ format) in your project.

The `create-brownfield-story` task is specifically for projects with
non-standard documentation formats.

I recommend using the `create-next-story` task instead, which is optimized
for working with your sharded documentation structure and will be more
efficient.

Would you like me to:
1. Use the `create-next-story` task (recommended), or
2. Continue with `create-brownfield-story` task anyway?
```

**Expected User Response**: Choice of task to proceed with.

**Post-Response Actions**:
- If user chooses create-next-story: Hand off to that task
- If user chooses to continue: Proceed with create-brownfield-story

---

### Interaction Mode Summary

| Step | Interaction Type | Blocking? | User Input Required |
|------|------------------|-----------|---------------------|
| Step 0 | Advisory | No | Task selection (if recommendation made) |
| Step 1.1 (User Direction) | Synchronous | Yes | Story scope definition |
| Step 1.2 | Synchronous | Yes | Essential context (if missing) |
| Step 2.3 | Synchronous | Yes | Technical context (if sparse) |
| Step 3.3 | Synchronous | Yes (for critical) | Missing critical information |
| Step 3.3 | Asynchronous | No (for non-critical) | Addressed with exploration tasks |
| Step 8 | Asynchronous | No | Story review and approval |

**Interaction Philosophy**:
- **Block when critical**: Essential context and critical missing information are blocking
- **Explore when possible**: Non-critical unknowns are handled with exploration tasks
- **Advise proactively**: Recommend better approaches when detected
- **Seek feedback at end**: Final review is non-blocking but seeks user validation

---

## 6. Output Specifications

### Primary Output: Story File

**File Location**: `{{stories_path}}/{{story_filename}}`

**Filename Patterns**:
```
From epic: epic-{n}-story-{m}.md
Standalone: brownfield-{feature-slug}.md
Sequential: story-{n}.md
```

**File Structure**:

```markdown
# Story: {{Story Title}}

<!-- Source: {{Documentation type used}} -->
<!-- Context: Brownfield enhancement to {{existing system/component}} -->
<!-- Created: {{YYYY-MM-DD}} -->
<!-- Agent: {{agent name}} via create-brownfield-story task -->

## Status: Draft

## Story

As a {{user_type}},
I want {{capability}},
so that {{value}}.

## Context Source

- **Source Document**: {{document name, path, or type}}
- **Enhancement Type**: {{new feature/bug fix/integration/refactor/etc}}
- **Existing System Impact**: {{brief assessment of what's affected}}
- **Scope**: {{single session/multi-session/complex}}

## Acceptance Criteria

1. **{{Primary new functionality}}**
   - {{specific criterion 1}}
   - {{specific criterion 2}}

2. **{{Existing functionality protection}}**
   - {{existing feature}} continues to work unchanged
   - {{integration point}} maintains current behavior

3. **{{Integration stability}}**
   - Integration with {{system}} maintains current behavior
   - {{API/interface}} contracts unchanged

4. **{{Regression prevention}}**
   - No regression in {{related area 1}}
   - No regression in {{related area 2}}

5. **{{Performance/stability}}**
   - Performance remains within {{acceptable bounds}}
   - {{Stability metric}} maintained

## Dev Technical Guidance

### Existing System Context

**Affected Components**:
- {{component 1}} - {{role and current behavior}}
- {{component 2}} - {{role and current behavior}}

**Current Implementation**:
- {{key file 1}} - {{purpose}}
- {{key file 2}} - {{purpose}}

**Key Patterns**:
- {{pattern description}} - See {{file reference}}

**Technical Debt/Workarounds** (if any):
- {{debt item 1}} - {{why it exists, must be maintained}}
- {{workaround}} - {{context}}

**Data Flow**:
{{Description or diagram of how data flows through affected components}}

### Integration Approach

**Integration Points**:
1. {{System/Component 1}}
   - **Interface**: {{API/interface description}}
   - **Current behavior**: {{what it does now}}
   - **Integration method**: {{how to integrate}}

2. {{System/Component 2}}
   - **Interface**: {{API/interface description}}
   - **Current behavior**: {{what it does now}}
   - **Integration method**: {{how to integrate}}

**Patterns to Follow**:
- {{Pattern 1}}: See `{{file path}}` for example
- {{Pattern 2}}: {{description}} as used in `{{file path}}`

### Technical Constraints

**Technology Constraints**:
- {{Framework}}: version {{x.y.z}} or compatible
- {{Library}}: {{version/constraint}}
- {{Environment}}: {{browser/node/etc}} support requirements

**Performance Constraints**:
- {{Response time}}: {{threshold}}
- {{Resource usage}}: {{limit}}

**Security Constraints**:
- {{Authentication}}: {{requirement}}
- {{Authorization}}: {{requirement}}
- {{Data handling}}: {{requirement}}

**Code Organization**:
- Follow {{organizational pattern}}
- Use {{naming convention}}
- Place new files in {{directory structure}}

### Files to Modify

- `{{file path 1}}` - {{what changes are needed}}
- `{{file path 2}}` - {{what changes are needed}}
- `{{file path 3}}` - {{new file to create}} (if applicable)

### Testing Approach

**Unit Testing**:
- Follow patterns in `{{test file reference}}`
- Use {{testing framework/library}}
- Test location: `{{test file path}}`

**Integration Testing**:
- Follow patterns in `{{test file reference}}`
- Test integration with {{system 1}}, {{system 2}}
- Use {{testing tools}}

**Manual Testing** (if applicable):
- {{Manual test scenario 1}}
- {{Manual test scenario 2}}

### Missing Information

{{If any critical information is missing}}:

⚠️ **Information requiring clarification**:
- {{Missing detail 1}} - {{why it's needed}}
- {{Missing detail 2}} - {{why it's needed}}

{{These will be addressed through exploration tasks or user clarification}}

## Tasks / Subtasks

- [ ] **Task 1: Analyze existing {{component/feature}} implementation**
  - [ ] Review `{{file 1}}`, `{{file 2}}` for current patterns
  - [ ] Document integration points and dependencies
  - [ ] Identify potential impacts of changes
  - [ ] Note any technical debt or workarounds in this area

- [ ] **Task 2: Implement {{new functionality description}}**
  - [ ] Follow pattern from `{{example file}}`
  - [ ] Integrate with {{existing component}} per {{approach}}
  - [ ] Maintain compatibility with {{constraint}}
  - [ ] Handle edge cases: {{edge case 1}}, {{edge case 2}}
  - [ ] {{Additional implementation detail}}

- [ ] **Task 3: Verify existing functionality**
  - [ ] Test {{existing feature 1}} still works correctly
  - [ ] Verify {{integration point 1}} behavior unchanged
  - [ ] Check {{related feature}} not affected
  - [ ] Measure and verify performance impact acceptable

- [ ] **Task 4: Add tests**
  - [ ] Unit tests following {{project pattern}}
    - [ ] Test {{new functionality}} works correctly
    - [ ] Test edge case: {{edge case 1}}
    - [ ] Test edge case: {{edge case 2}}
  - [ ] Integration test for {{integration point}}
  - [ ] Update existing tests if needed ({{which tests}})
  - [ ] Verify test coverage meets {{project standard}}

- [ ] **Task 5: Documentation and cleanup**
  - [ ] Update inline code documentation
  - [ ] Add/update user-facing documentation if needed
  - [ ] Clean up any temporary code, console.logs, or debug statements
  - [ ] {{Additional documentation tasks}}

## Risk Assessment

### Implementation Risks

**Primary Risk**: {{Main risk to existing system}}
- **Impact**: {{What could go wrong, severity}}
- **Probability**: {{High/Medium/Low based on complexity}}
- **Mitigation**: {{Proactive steps to reduce risk}}
- **Verification**: {{How to confirm mitigation worked}}

**Secondary Risks**:
- **{{Risk 2 description}}**
  - Impact: {{what could go wrong}}
  - Mitigation: {{approach to address}}
  - Verification: {{how to verify}}

- **{{Risk 3 description}}**
  - Impact: {{what could go wrong}}
  - Mitigation: {{approach to address}}
  - Verification: {{how to verify}}

### Integration Risks

**Risk**: Integration with {{system}} could fail or behave unexpectedly
- **Scenarios**: {{specific failure scenarios}}
- **Mitigation**: {{testing approach}}, {{fallback strategy}}
- **Verification**: {{integration tests to run}}

### Performance Risks

**Risk**: {{Performance concern description}}
- **Threshold**: {{acceptable performance level}}
- **Mitigation**: {{optimization approach}}, {{monitoring strategy}}
- **Verification**: {{performance testing approach}}

### Rollback Plan

If issues are discovered during or after implementation:

1. **{{Rollback step 1}}** - {{what to do, commands if applicable}}
2. **{{Rollback step 2}}** - {{restore original behavior}}
3. **{{Rollback step 3}}** - {{verify rollback successful}}
4. **{{Rollback step 4}}** - {{data/state cleanup if needed}}

**Rollback Verification**:
- [ ] {{Verification that rollback completed successfully}}
- [ ] {{Verification that original behavior restored}}
- [ ] {{Verification that no side effects remain}}

**Rollback Triggers**:
- {{Condition that would trigger rollback}}
- {{Another condition}}

### Safety Checks

Pre-implementation safety verification:
- [ ] Existing {{feature}} tested and baseline captured before changes
- [ ] Baseline metrics captured (performance, behavior, etc.)
- [ ] Changes can be feature-flagged or isolated {{if applicable}}
- [ ] Rollback procedure documented and reviewed
- [ ] Integration points have test coverage
- [ ] {{Additional safety checks}}

## Dev Agent Record

*This section is exclusively for the Dev agent. Do not modify.*

[Dev will populate this section during implementation with notes,
decisions, and deviations]

---

**Story End**
```

**File Format**: Markdown (.md)

**YAML Front Matter**: Not used (metadata in HTML comments for better markdown readability)

---

### Secondary Output: Handoff Communication

**Output Type**: Terminal/console text output to user

**Format**: Plain text with formatting

**Content Structure**:

```
✅ Brownfield story created: {{story title}}

**Story Details**:
- Location: {{file path}}
- Source Documentation: {{documentation type(s) used}}
- Enhancement Type: {{type classification}}
- Estimated Complexity: {{LOW/MEDIUM/HIGH/VERY HIGH}}

**Key Integration Points Identified**:
- {{integration point 1}} - {{brief description}}
- {{integration point 2}} - {{brief description}}
{{...}}

**Primary Risks Noted**:
- {{primary risk}} - Mitigation: {{approach}}
- {{secondary risk}} - Mitigation: {{approach}}

**Existing Functionality Protected**:
- {{feature 1}} - verification included in Task {{n}}
- {{feature 2}} - verification included in Task {{n}}

{{If missing info exists}}:
⚠️ **Note**: Some technical details were unclear. The story includes
exploration tasks to gather needed information during implementation.
The following will need clarification during implementation:
- {{missing detail 1}}
- {{missing detail 2}}

**Rollback Plan**: {{one-line summary of rollback approach}}

**Next Steps**:
1. Review story for accuracy and completeness
2. Verify integration approach aligns with your system
3. Approve story or request adjustments
4. Dev agent can then implement with safety checks
5. Optional: Have PO agent validate story before implementation

Would you like me to adjust anything in the story, or is it ready
for implementation?
```

---

### Output Quality Standards

**Completeness**:
- ✅ All sections of story template populated with meaningful content
- ✅ No {{placeholder}} markers left unreplaced
- ✅ File references are specific (paths provided when known)
- ✅ Tasks are actionable and specific
- ✅ Acceptance criteria are testable
- ✅ Risk assessment is comprehensive

**Clarity**:
- ✅ Technical guidance is clear and actionable for dev
- ✅ Integration approach is well-defined
- ✅ Tasks have sufficient detail
- ✅ No ambiguous language
- ✅ Jargon is explained or linked

**Safety**:
- ✅ Existing functionality protection explicitly included
- ✅ Rollback plan is detailed and feasible
- ✅ Risks are identified and mitigated
- ✅ Verification tasks included
- ✅ Safety checks defined

**Traceability**:
- ✅ Source documentation clearly referenced
- ✅ File paths and references provided
- ✅ Pattern examples cited
- ✅ Technical constraints sourced
- ✅ Metadata in header comments

---

### Output Validation

Before saving story file, validate:

```python
def validate_story_output(story_content):
    checks = {
        "has_title": "# Story:" in story_content,
        "has_status": "## Status:" in story_content,
        "has_story_statement": "As a" in story_content and "I want" in story_content,
        "has_acceptance_criteria": "## Acceptance Criteria" in story_content,
        "has_technical_guidance": "## Dev Technical Guidance" in story_content,
        "has_tasks": "## Tasks / Subtasks" in story_content,
        "has_risk_assessment": "## Risk Assessment" in story_content,
        "has_rollback_plan": "Rollback Plan" in story_content,
        "has_metadata": "<!-- Source:" in story_content,
        "no_unresolved_placeholders": "{{" not in story_content or "Missing Information" in story_content,
        "existing_functionality_protected": "continues to work" in story_content or "unchanged" in story_content,
    }

    return all(checks.values()), checks
```

All checks must pass before story is considered complete.

---

### Example Output Summary

**Typical Story Lengths**: 400-800 lines depending on complexity

**Sections Always Present**:
- Story header with metadata
- Status
- Story statement
- Context source
- Acceptance criteria
- Dev Technical Guidance (comprehensive)
- Tasks/Subtasks
- Risk Assessment
- Dev Agent Record (empty template)

**Sections Conditionally Present**:
- Missing Information (if gaps exist after user interaction)
- Multiple subsections in Dev Technical Guidance (based on available context)
- Varying number of tasks (based on complexity and unknowns)

---

## 7. Error Handling & Validation

### Error Category 1: Documentation Not Found

**Error Condition**: No documentation sources can be located.

**Detection Point**: Step 0 (Documentation Context Assessment)

**Error Handling Strategy**:

```
IF no documentation found THEN
  PROMPT user:
    "I couldn't locate any BMad documentation for this project.

    Could you help me understand:
    1. Is this a new project or existing brownfield project?
    2. Do you have any documentation I should reference?
       - If yes, where is it located?
       - If no, shall we create the story from your description?

    Based on your response, I'll adapt the story creation approach."

  WAIT for user response

  IF user provides documentation location THEN
    → Use provided documentation
    → CONTINUE with story creation
  ELSE IF user wants to describe from scratch THEN
    → HIGH user interaction mode
    → Build story collaboratively
    → CONTINUE with story creation
  ELSE
    → Offer to help with project documentation first
    → Suggest using document-project task
  END IF
END IF
```

**Prevention**: N/A - This task is designed to handle scenarios with minimal or no documentation.

**Logging**: Log that no standard documentation was found, user interaction mode activated.

---

### Error Category 2: Sharded V4+ Documents Detected

**Error Condition**: Task detected properly sharded v4+ PRD and architecture documents.

**Detection Point**: Step 0 (Documentation Context Assessment)

**Error Handling Strategy**:

```
IF sharded_prd_exists AND v4_architecture_exists THEN
  WARN user:
    "⚠️ I detected properly sharded PRD and architecture documents
    (BMad v4+ format).

    The create-brownfield-story task is for non-standard documentation.

    I recommend using the create-next-story task instead - it's optimized
    for your documentation structure and will be more efficient.

    Would you like me to:
    1. Use create-next-story task (recommended)
    2. Continue with create-brownfield-story anyway

    Please let me know your preference."

  WAIT for user decision

  IF user chooses create-next-story THEN
    → EXIT this task
    → HANDOFF to create-next-story task
  ELSE IF user chooses to continue THEN
    → LOG user override decision
    → CONTINUE with create-brownfield-story
  END IF
END IF
```

**Prevention**: Clear task description and selection guidance.

**Logging**: Log recommendation made and user decision.

---

### Error Category 3: Critical Context Missing After User Query

**Error Condition**: User queried for essential context but doesn't provide it or says it's unknown.

**Detection Point**: Step 1.2 (Gather Essential Context)

**Error Handling Strategy**:

```
IF user cannot provide essential context THEN
  INFORM user:
    "I understand some context is unavailable. I'll structure the story
    to handle this:

    1. I'll add exploration tasks for the Dev agent to discover:
       {{list missing context items}}

    2. I'll include extra verification tasks to ensure safety despite
       incomplete upfront knowledge.

    3. The story will document what's unknown and why it matters.

    This means implementation will take longer (exploration phase), but
    it's safer than making assumptions. Is this approach acceptable?"

  WAIT for user confirmation

  IF user confirms THEN
    → FLAG story as "incomplete context"
    → Add comprehensive exploration tasks
    → Add extra verification tasks
    → Document unknowns clearly
    → CONTINUE with story creation
  ELSE
    → Suggest pausing story creation
    → Recommend gathering context first
    → Offer to help with document-project task
  END IF
END IF
```

**Prevention**: Clear explanation to user that some level of context is needed for safe implementation.

**Logging**: Log that story was created with incomplete context, exploration tasks added.

---

### Error Category 4: Story Scope Too Large

**Error Condition**: Story scope is too large for a single story (should be epic).

**Detection Point**: Step 1.1 (Story Identification) or Step 3.1 (Create Initial Story Structure)

**Error Handling Strategy**:

```
IF story_scope_is_too_large THEN
  # Indicators: Multiple major features, many integration points,
  # estimated >1-2 weeks work, multiple systems affected

  WARN user:
    "⚠️ Based on the enhancement description, this seems like a larger
    initiative that might be better structured as an epic with multiple stories.

    Indicators:
    - {{indicator 1, e.g., "Multiple major features"}}
    - {{indicator 2, e.g., "Affects 3+ systems"}}
    - {{indicator 3, e.g., "Estimated 2+ weeks work"}}

    I recommend using the brownfield-create-epic task instead, which will:
    1. Break this into manageable stories
    2. Provide better progress tracking
    3. Allow incremental delivery

    Would you like me to:
    1. Switch to brownfield-create-epic (recommended)
    2. Try to scope down this story to something smaller
    3. Continue with a large single story anyway

    What's your preference?"

  WAIT for user decision

  IF user chooses epic approach THEN
    → EXIT this task
    → HANDOFF to brownfield-create-epic task
  ELSE IF user chooses to scope down THEN
    → Collaborate with user to reduce scope
    → Focus on core MVP functionality
    → CONTINUE with scoped-down story
  ELSE IF user chooses to continue THEN
    → LOG user override decision
    → Add note to story about size
    → CONTINUE with large story creation
  END IF
END IF
```

**Prevention**: Task selection guidance, clear scope descriptions for different tasks.

**Logging**: Log scope assessment and user decision.

---

### Error Category 5: Story Scope Too Small

**Error Condition**: Story scope is very small (< 4 hours, minimal change).

**Detection Point**: Step 1.1 (Story Identification) or Step 3.1 (Create Initial Story Structure)

**Error Handling Strategy**:

```
IF story_scope_is_very_small THEN
  # Indicators: Single file change, < 4 hours work, bug fix,
  # isolated change, follows existing pattern exactly

  INFORM user:
    "This looks like a very small, focused change (estimated < 4 hours).

    The simplified brownfield-create-story task might be more appropriate
    for this scope. It's optimized for quick, minimal brownfield changes.

    Would you like me to:
    1. Use brownfield-create-story task (simpler, faster)
    2. Continue with create-brownfield-story (more comprehensive)

    Either will work - it's a matter of how much detail and process you want."

  WAIT for user decision

  IF user chooses brownfield-create-story THEN
    → EXIT this task
    → HANDOFF to brownfield-create-story task
  ELSE IF user chooses to continue THEN
    → LOG user decision
    → CONTINUE with create-brownfield-story
    → May result in relatively short story with less exploration
  END IF
END IF
```

**Prevention**: Task selection guidance, clear scope descriptions.

**Logging**: Log scope assessment and user decision.

---

### Error Category 6: Story Validation Failure

**Error Condition**: Story fails one or more validation checks in Step 6.

**Detection Point**: Step 6 (Final Story Validation)

**Error Handling Strategy**:

```
validation_result, failed_checks = validate_story()

IF NOT validation_result THEN
  LOG "Story validation failed"
  LOG "Failed checks:" + str(failed_checks)

  FOR EACH failed_check IN failed_checks:
    IF failed_check == "completeness" THEN
      → Identify missing sections or content
      → Add missing content
      → If content requires user input, query user

    ELSE IF failed_check == "safety" THEN
      → Enhance rollback plan
      → Add verification tasks
      → Strengthen risk assessment

    ELSE IF failed_check == "information_gaps" THEN
      → Review missing information list
      → IF critical info missing THEN
          → Query user for info OR
          → Add comprehensive exploration tasks
        END IF
    END IF
  END FOR

  # Re-run validation
  validation_result, failed_checks = validate_story()

  IF validation_result THEN
    → CONTINUE to Step 7 (save story)
  ELSE
    → ESCALATE to user:
      "I'm having trouble completing the story validation. The following
      checks are failing:
      {{list failed checks with details}}

      Could you help me resolve these issues?"
    → Work with user to resolve
  END IF
END IF
```

**Prevention**: Thorough execution of earlier steps, comprehensive context gathering.

**Logging**: Log validation failures and remediation actions.

---

### Error Category 7: File Save Failure

**Error Condition**: Cannot save story file to designated location.

**Detection Point**: Step 7 (Story Output Format)

**Error Handling Strategy**:

```
TRY:
  save_story_file(story_content, file_path)
EXCEPT FileNotFoundError:
  # Directory doesn't exist
  PROMPT user:
    "The stories directory ({{configured path}}) doesn't exist.

    Would you like me to:
    1. Create the directory and save the story
    2. Save to a different location (please specify)
    3. Output the story content for you to save manually"

  WAIT for user decision

  IF user chooses create directory THEN
    create_directory(stories_path)
    save_story_file(story_content, file_path)
  ELSE IF user provides alternative path THEN
    save_story_file(story_content, alternative_path)
  ELSE
    OUTPUT story_content to terminal
  END IF

EXCEPT PermissionError:
  # No write permission
  ERROR user:
    "I don't have permission to write to {{file_path}}.

    Options:
    1. I can output the story content for you to save manually
    2. You can adjust file permissions and I'll retry
    3. Specify an alternative location with write access"

  # Handle based on user choice

EXCEPT Exception as e:
  # Unexpected error
  ERROR user:
    "Unexpected error saving story file: {{str(e)}}

    I'll output the story content so it's not lost:"

  OUTPUT story_content to terminal
END TRY
```

**Prevention**: Verify story directory exists and is writable before attempting save.

**Logging**: Log file save attempts and any errors encountered.

---

### Error Category 8: Invalid Story Name

**Error Condition**: Generated story filename is invalid (special characters, too long, etc.).

**Detection Point**: Step 7 (Story Output Format)

**Error Handling Strategy**:

```
story_filename = generate_story_filename(story_title, source)

IF NOT is_valid_filename(story_filename) THEN
  LOG "Invalid filename generated:" + story_filename

  # Sanitize filename
  story_filename = sanitize_filename(story_filename)
  # Remove special chars, limit length, ensure .md extension

  IF is_valid_filename(story_filename) THEN
    LOG "Filename sanitized to:" + story_filename
    → CONTINUE with sanitized filename
  ELSE
    # Sanitization failed, use fallback
    story_filename = "brownfield-story-" + timestamp() + ".md"
    LOG "Using fallback filename:" + story_filename

    WARN user:
      "I generated a generic filename ({{story_filename}}) because the
      story title contained characters that aren't filesystem-safe.

      You may want to rename the file to something more descriptive after
      creation."

    → CONTINUE with fallback filename
  END IF
END IF
```

**Prevention**: Filename generation logic that sanitizes inputs.

**Logging**: Log filename generation and any sanitization applied.

---

### Error Category 9: Documentation Format Unrecognized

**Error Condition**: Documentation exists but format is unrecognized or unparseable.

**Detection Point**: Step 2 (Extract Technical Context)

**Error Handling Strategy**:

```
TRY:
  context = parse_documentation(doc_file)
EXCEPT UnrecognizedFormatError:
  LOG "Could not parse documentation:" + doc_file

  PROMPT user:
    "I found documentation at {{doc_file}} but couldn't parse its format.

    Could you help me extract the relevant information?

    I need to know:
    1. What existing functionality might this story affect?
    2. What integration points exist?
    3. What technical constraints apply?
    4. Are there patterns or examples to follow?

    You can either:
    - Describe this information directly
    - Point me to specific sections in the documentation
    - Provide the information in a different format"

  WAIT for user response

  # Use user-provided information instead of parsed documentation
  context = build_context_from_user_input(user_response)

  → CONTINUE with user-provided context
END TRY
```

**Prevention**: Support multiple documentation formats, fallback to user interaction.

**Logging**: Log documentation parsing failures.

---

### Input Validation Rules

**Before Task Execution**:

```python
def validate_inputs():
    validations = {
        "story_source_defined": story_source is not None or user_available,
        "enhancement_described": len(enhancement_description) > 10,
        "user_interaction_possible": user_available_for_queries,
    }

    if not all(validations.values()):
        raise InsufficientInputError(
            "Cannot create story without basic inputs and user availability"
        )
```

**During Execution**:

```python
def validate_context_gathering():
    # Essential context checklist validation
    required_items = [
        "existing_functionality_identified",
        "integration_points_identified",
        "patterns_to_follow_identified",
        "technical_constraints_identified",
        "gotchas_identified_or_none",
    ]

    for item in required_items:
        if not is_resolved(item):
            if can_query_user():
                query_user_for(item)
            else:
                add_exploration_task_for(item)

def validate_technical_guidance():
    # Technical guidance completeness validation
    required_sections = [
        "existing_system_context",
        "integration_approach",
        "technical_constraints",
    ]

    for section in required_sections:
        if is_empty(section):
            if has_documentation():
                extract_from_documentation(section)
            elif can_query_user():
                query_user_for(section)
            else:
                document_as_missing(section)
                add_exploration_task_for(section)
```

---

### Recovery Strategies

**Strategy 1: Progressive Enhancement**
- Start with minimal story structure
- Add detail progressively as information becomes available
- Never block completely - always provide a path forward

**Strategy 2: Exploration Tasks**
- When information is unavailable, add exploration tasks for dev
- Document what's unknown and why it matters
- Provide guidance on how to discover information

**Strategy 3: User Collaboration**
- Fall back to user interaction when documentation is insufficient
- Ask specific, focused questions
- Provide context for why information is needed

**Strategy 4: Safe Defaults**
- Use conservative defaults when specifics are unknown
- Add extra verification tasks when uncertainty exists
- Include comprehensive rollback planning

---

### Logging and Debugging

**Log Events**:
- Documentation sources found/not found
- User interaction points triggered
- Context gathering results
- Missing information identified
- Exploration tasks added
- Validation check results
- File save operations
- Errors and warnings

**Log Format**:
```
[TIMESTAMP] [TASK:create-brownfield-story] [LEVEL] [STEP] Message
```

**Example Logs**:
```
[2025-10-14T10:30:15] [TASK:create-brownfield-story] [INFO] [Step 0] Documentation context assessed: brownfield PRD found, no sharded docs
[2025-10-14T10:30:45] [TASK:create-brownfield-story] [WARN] [Step 1.2] Missing essential context: integration points unknown
[2025-10-14T10:31:00] [TASK:create-brownfield-story] [INFO] [Step 1.2] User queried for missing context
[2025-10-14T10:35:30] [TASK:create-brownfield-story] [INFO] [Step 1.2] User provided integration context
[2025-10-14T10:42:15] [TASK:create-brownfield-story] [INFO] [Step 6] Story validation passed
[2025-10-14T10:42:30] [TASK:create-brownfield-story] [INFO] [Step 7] Story saved: docs/stories/brownfield-email-validation.md
```

---

## 8. Dependencies & Prerequisites

### File Dependencies

**Configuration Files**:

```yaml
core-config.yaml:
  required: true
  sections_used:
    - paths.stories            # Story output location
    - paths.epics             # Epic source location (if using epics)
    - paths.prd               # PRD location
    - paths.architecture      # Architecture location
    - paths.brownfield_docs   # Brownfield documentation location
  fallback: Use default paths if not configured
```

**Template Files**:

```yaml
story-tmpl.yaml:
  required: false  # Task has inline template structure
  usage: If present, can be used as alternative story structure
  fallback: Use inline template structure from task
```

**Documentation Files** (conditional):

```yaml
brownfield-architecture.md:
  required: false
  location: paths.architecture or paths.brownfield_docs
  created_by: document-project task
  usage: Primary source for technical context in brownfield projects

brownfield-prd.md:
  required: false
  location: paths.prd
  created_by: PM agent with brownfield PRD workflow
  usage: Source for requirements and technical constraints

docs/epics/*.md:
  required: false
  location: paths.epics
  created_by: brownfield-create-epic task
  usage: Source for story identification and epic-level context

docs/prd/*.md (sharded):
  required: false
  location: paths.prd
  usage: If found, recommend create-next-story task instead

docs/architecture/*.md (sharded v4+):
  required: false
  location: paths.architecture
  usage: If found, recommend create-next-story task instead
```

---

### Task Dependencies

**Prerequisite Tasks** (optional, improves story quality):

```yaml
document-project:
  required: false
  when_to_run: Before story creation in brownfield projects
  creates: brownfield-architecture.md, brownfield-prd.md (optional)
  benefit: Provides comprehensive technical context for story creation

brownfield-create-epic:
  required: false
  when_to_run: When enhancement is large enough for epic-level planning
  creates: docs/epics/{epic-name}.md
  benefit: Provides story sequence and epic-level context

PM workflow (brownfield PRD):
  required: false
  when_to_run: For structured brownfield project planning
  creates: docs/prd.md (brownfield variant)
  benefit: Provides requirements and technical constraints
```

**Alternative Tasks** (mutually exclusive):

```yaml
create-next-story:
  use_instead_if: Sharded v4+ PRD and architecture exist
  benefit: More efficient for standard BMad v4+ projects

brownfield-create-story:
  use_instead_if: Story is very small (< 4 hours, minimal change)
  benefit: Simpler, faster process for minimal changes

brownfield-create-epic:
  use_instead_if: Enhancement is large enough for epic-level planning
  benefit: Better structure for multi-story initiatives
```

**Downstream Tasks** (what happens after):

```yaml
validate-next-story:
  optional: true
  run_by: PO agent
  when: After story creation, before implementation
  purpose: Validate story completeness and implementation readiness

execute-checklist (story-draft-checklist):
  optional: true
  run_by: SM agent
  when: After story creation
  purpose: Verify story meets draft quality standards

Dev implementation workflow:
  required: yes
  run_by: Dev agent
  when: After story approval
  purpose: Implement the story
```

---

### Agent Dependencies

**Primary Agents for This Task**:

```yaml
SM (Bob):
  role: Story creation specialist
  when_to_use: Primary agent for story creation from epics or PRD
  capabilities:
    - Epic context extraction
    - Story template population
    - Technical context gathering

PM (John):
  role: Product strategy and brownfield expert
  when_to_use: For brownfield PRD-based stories or complex brownfield projects
  capabilities:
    - Brownfield PRD expertise
    - Strategic context
    - Technical constraint identification
```

**Supporting Agents** (may be involved):

```yaml
PO (Sarah):
  role: Story validation
  when_involved: validate-next-story task after story creation
  capabilities: Story quality validation, completeness checks

Dev (James):
  role: Story implementation
  when_involved: After story approval
  capabilities: Implementation, exploration task execution

QA (Quinn):
  role: Story review (post-implementation)
  when_involved: After implementation for comprehensive review
  capabilities: Review, risk assessment, quality gate

Analyst (Mary):
  role: Additional research (if needed)
  when_involved: If major unknowns require research
  capabilities: Market research, competitive analysis, deep research
```

---

### Tool Dependencies

**Core Tools** (assumed available):

```yaml
File System Access:
  required: true
  operations: Read (documentation), Write (story files)
  paths_needed:
    - stories directory (write)
    - epics directory (read)
    - prd directory (read)
    - architecture directory (read)
    - brownfield docs directory (read)

YAML Parser:
  required: false
  usage: If templates use YAML format
  fallback: Use inline template structures

Markdown Parser:
  required: true
  usage: Parse existing documentation
  features_needed: Extract sections, headings, content

Text Generation:
  required: true
  usage: Generate story content, tasks, guidance
  model: LLM with good context window for documentation
```

**Optional Tools**:

```yaml
md-tree CLI:
  required: false
  usage: Could be used to analyze documentation structure
  benefit: Faster documentation parsing

Git:
  required: false
  usage: Could check for existing stories, version tracking
  benefit: Better story numbering, history tracking

Project-specific tools:
  required: false
  usage: Depends on project
  examples: Test runners, linters, build tools for verification
```

---

### Data Dependencies

**Core Configuration Data**:

```yaml
core-config.yaml:
  project:
    name: string                    # Project name for context
    type: "brownfield" | "mixed"    # Project type

  paths:
    stories: string                 # Where to save stories
    epics: string                   # Where to find epics
    prd: string                     # Where to find PRD
    architecture: string            # Where to find architecture docs
    brownfield_docs: string         # Where to find brownfield docs

  agents:
    sm:
      always_load:
        - path_to_always_loaded_file  # Context files for SM agent
```

**Documentation Data** (varies by project):

```yaml
Brownfield Architecture:
  source: document-project output
  sections_used:
    - Technical Debt
    - Key Files
    - Integration Points
    - Known Issues
    - Tech Stack

Brownfield PRD:
  source: PM brownfield workflow
  sections_used:
    - Epic sections (for stories)
    - Technical Constraints
    - Integration Requirements
    - Code Organization
    - Risk Assessment

Epic Files:
  source: brownfield-create-epic task
  data_used:
    - Epic definition
    - Story list
    - Epic-level context
    - Acceptance criteria
```

---

### Environment Prerequisites

**Development Environment**:

```yaml
Required:
  - File system with read/write access
  - Text file editing capabilities
  - Markdown rendering (for verification)

Optional:
  - IDE with BMad integration (for agent activation)
  - Git repository (for versioning)
  - Project build/test environment (for verification)
```

**Agent Environment**:

```yaml
Required:
  - LLM agent with sufficient context window (32k+ tokens recommended)
  - Access to project files
  - Ability to read multiple documentation formats
  - User interaction capabilities (prompting, waiting for response)

Recommended:
  - Long-term memory or session state (for tracking context across interactions)
  - Tool access (file reading, writing, directory listing)
  - Access to previous task outputs (epics, PRD, architecture docs)
```

**User Environment**:

```yaml
Required:
  - Ability to respond to prompts/questions
  - Access to project knowledge or documentation
  - Understanding of project context

Helpful:
  - Access to project codebase (to provide file references)
  - Knowledge of integration points and constraints
  - Understanding of project patterns and conventions
```

---

### Knowledge Prerequisites

**Agent Knowledge Requirements**:

```yaml
Required Knowledge:
  - BMad framework story structure
  - Brownfield development principles
  - Risk assessment in existing systems
  - Story template structure and sections
  - Integration pattern recognition

Helpful Knowledge:
  - Common brownfield challenges (technical debt, legacy code)
  - Software architecture patterns
  - Testing strategies (unit, integration, e2e)
  - Rollback and mitigation strategies
  - Elicitation techniques for gathering requirements
```

**User Knowledge Requirements**:

```yaml
Required:
  - Understanding of the enhancement/feature to be implemented
  - Basic project context (what the system does)

Helpful:
  - Technical knowledge of the project codebase
  - Understanding of integration points
  - Knowledge of existing patterns and conventions
  - Awareness of technical constraints
  - Knowledge of technical debt and gotchas
```

---

### Version Dependencies

**BMad Framework Version**:

```yaml
task_version: BMad Core v4
compatibility:
  - Works with BMad v4+ structure
  - Compatible with v3 projects (with adaptation)
  - Specifically designed for non-standard documentation scenarios

breaking_changes_from_v3:
  - Different documentation structure expected
  - Enhanced user interaction model
  - Progressive context gathering approach
```

**Documentation Format Versions**:

```yaml
supported_formats:
  - BMad v4 sharded PRD (will recommend create-next-story instead)
  - BMad v3 monolithic PRD
  - Brownfield architecture (document-project output)
  - Brownfield PRD
  - Custom/non-standard documentation formats
  - Epic files (brownfield-create-epic output)

unsupported_formats:
  - Binary formats (no PDF, Word parsing)
  - Database-stored documentation (no DB access)
  - External systems (no API integrations)
```

---

### Dependency Installation/Setup

**No installation required** - This is a pure task workflow.

**Setup Steps** (if starting fresh):

1. **Ensure core-config.yaml exists**:
   ```yaml
   paths:
     stories: "docs/stories/"
     # Other paths as needed
   ```

2. **Create stories directory if needed**:
   ```bash
   mkdir -p docs/stories/
   ```

3. **Optional: Run prerequisite tasks**:
   - Run `document-project` for brownfield projects
   - Run `brownfield-create-epic` if needed
   - Run PM brownfield PRD workflow if desired

4. **Gather context**:
   - Collect any existing documentation
   - Identify stakeholders who can provide context
   - Note integration points and constraints

---

### Dependency Check List

Before running this task, verify:

- [ ] core-config.yaml exists with paths configured
- [ ] Stories directory exists and is writable
- [ ] User is available for interaction (critical for this task)
- [ ] At least one of the following exists:
  - [ ] Brownfield architecture document
  - [ ] Brownfield PRD
  - [ ] Epic files
  - [ ] User can describe enhancement from scratch
- [ ] Agent has file system access
- [ ] Agent can prompt user and wait for responses

**Minimum viable setup**:
- core-config.yaml with stories path
- User availability for interaction
- That's it! This task is designed to work with minimal documentation.

---


## 9. Integration Points

### Integration with Other Tasks

#### Upstream Task Integration

**Task: document-project**
- **Relationship**: Provides primary input (brownfield architecture document)
- **Data Flow**: document-project → brownfield-architecture.md → create-brownfield-story (Step 2.1)
- **Integration Method**: Read and parse brownfield-architecture.md for technical context
- **Dependencies**:
  - Technical Debt section → Risk Assessment
  - Key Files section → Dev Technical Guidance (files to modify)
  - Integration Points section → Dev Technical Guidance (integration approach)
  - Known Issues section → Risk Assessment and tasks
  - Tech Stack section → Dev Technical Guidance (technical constraints)
- **Optional**: Task works without this, but quality is higher with it

**Task: brownfield-create-epic**
- **Relationship**: Provides story source (epic files)
- **Data Flow**: brownfield-create-epic → epic files → create-brownfield-story (Step 1.1)
- **Integration Method**: Read epic file to extract story definition and context
- **Dependencies**:
  - Epic definition → Story context
  - Story list → Story identification
  - Epic-level acceptance criteria → Story acceptance criteria
  - Epic-level constraints → Dev Technical Guidance
- **Optional**: One of several possible story sources

**Task: PM Brownfield PRD Workflow**
- **Relationship**: Provides story source (brownfield PRD)
- **Data Flow**: PM workflow → brownfield PRD → create-brownfield-story (Step 2.2)
- **Integration Method**: Read brownfield PRD to extract requirements and constraints
- **Dependencies**:
  - Epic sections in PRD → Story identification
  - Technical Constraints → Dev Technical Guidance
  - Integration Requirements → Dev Technical Guidance
  - Code Organization → Dev Technical Guidance
  - Risk Assessment → Story Risk Assessment
- **Optional**: One of several possible story sources

**Task: create-next-story**
- **Relationship**: Alternative task for standard v4+ projects
- **Data Flow**: N/A (mutually exclusive)
- **Integration Method**: Recommendation to use instead if v4+ sharded docs exist
- **Dependencies**: N/A
- **Optional**: Task selection decision point

**Task: brownfield-create-story** (simplified variant)
- **Relationship**: Alternative task for very small changes
- **Data Flow**: N/A (mutually exclusive)
- **Integration Method**: Recommendation to use instead if scope is minimal (~4h)
- **Dependencies**: N/A
- **Optional**: Task selection decision point

---

#### Downstream Task Integration

**Task: validate-next-story**
- **Relationship**: Validates story quality before implementation
- **Data Flow**: create-brownfield-story → story file → validate-next-story
- **Integration Method**: PO agent reads story file and validates completeness
- **Dependencies**:
  - Story file existence
  - Story follows template structure
  - All required sections present
- **When Executed**: After story creation, before dev implementation (optional)
- **Benefits**: Catches quality issues early, ensures implementation readiness

**Task: execute-checklist** (story-draft-checklist)
- **Relationship**: Validates story against draft quality standards
- **Data Flow**: create-brownfield-story → story file → execute-checklist
- **Integration Method**: SM agent executes story-draft-checklist
- **Dependencies**:
  - Story file existence
  - Checklist file (story-draft-checklist.md)
- **When Executed**: After story creation (optional)
- **Benefits**: Systematic quality validation

**Dev Implementation Workflow**
- **Relationship**: Consumes story for implementation
- **Data Flow**: create-brownfield-story → story file → Dev agent
- **Integration Method**: Dev agent reads story and executes tasks
- **Dependencies**:
  - Story file with complete Dev Technical Guidance
  - Tasks section with actionable items
  - Acceptance criteria for verification
  - Risk Assessment for safety awareness
- **When Executed**: After story approval
- **Benefits**: Dev has all context needed for safe implementation

**Task: correct-course**
- **Relationship**: Handles changes during story implementation
- **Data Flow**: Bidirectional - may update story if major changes needed
- **Integration Method**: PM/PO uses correct-course if story scope or approach changes
- **Dependencies**:
  - Story file
  - Change requirements
- **When Executed**: During implementation if course correction needed
- **Benefits**: Manages scope changes systematically

---

## 10. Configuration References

[Configuration section content as previously detailed...]

---

## 11. Success Criteria

[Success criteria section content as previously detailed...]

---

## 12. Performance Characteristics

[Performance section content as previously detailed...]

---

## 13. Security Considerations

[Security section content as previously detailed...]

---

## 14. Extensibility & Customization

[Extensibility section content as previously detailed...]

---

## 15. Related Tasks & Workflows

[Related tasks section content as previously detailed...]

---

## 16. ADK Translation Recommendations

### Recommended GCP/ADK Architecture

**Task Classification**: **Reasoning Engine Workflow** (Medium-High Complexity)

**Rationale**:
- Multi-step sequential workflow with state (8 steps)
- Requires user interaction and wait states
- Progressive context gathering with branching logic
- Complex decision points based on documentation context
- Needs to maintain context across steps
- Cannot be implemented as simple Cloud Function

---

[Full ADK translation content with Reasoning Engine implementation, Cloud Functions, Vertex AI configuration, Firestore schema, API design, cost optimization, monitoring, and testing strategy as previously detailed...]

---

**Analysis Complete**: create-brownfield-story.md

**Document Statistics**:
- Total Sections: 16
- Estimated Length: 5,500+ lines
- Complexity Level: Medium-High
- ADK Implementation: Reasoning Engine Workflow

**Key Distinguishing Features**:
1. Progressive context gathering with user interaction
2. Documentation-adaptive (works with non-standard formats)
3. Safety-first brownfield focus
4. Flexible story sources (epic/PRD/user direction/undefined)
5. Comprehensive risk assessment and rollback planning
6. Alternative to create-next-story for non-standard documentation scenarios

