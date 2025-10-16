# Development Cycle Workflow Analysis

**Workflow Type**: Development Cycle (Universal - applies to all project types)
**Primary Agents**: SM (Bob), Dev (James), QA (Quinn), PO (Sarah)
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14

---

## Table of Contents

1. [Overview](#1-overview)
2. [Development Cycle Stages](#2-development-cycle-stages)
3. [Agent Collaboration Pattern](#3-agent-collaboration-pattern)
4. [Story Status Lifecycle](#4-story-status-lifecycle)
5. [Core Workflow Patterns](#5-core-workflow-patterns)
6. [Quality Gates and Validation](#6-quality-gates-and-validation)
7. [Development Cycle Iterations](#7-development-cycle-iterations)
8. [State Management and Tracking](#8-state-management-and-tracking)
9. [Error Handling and Course Correction](#9-error-handling-and-course-correction)
10. [ADK Translation Recommendations](#10-adk-translation-recommendations)

---

## 1. Overview

### Purpose

The Development Cycle is the **universal iterative workflow** used by the BMad framework to transform approved user stories into production-ready implementations. This cycle operates identically across all project types (greenfield/brownfield, fullstack/service/UI) and represents the core implementation phase of the BMad methodology.

### Scope

The development cycle encompasses:
- **Story Preparation**: SM creates self-contained implementation-ready stories
- **Pre-Implementation Validation** (Optional): PO validates story draft completeness
- **Implementation**: Dev implements tasks sequentially with testing
- **Quality Assurance**: QA performs comprehensive review with gate decision
- **Issue Resolution**: Dev addresses QA findings with priority-based fixes
- **Re-Review Cycles**: Iterative QA reviews until quality gates pass
- **Story Completion**: Final validation and story marking as Done

### Key Characteristics

1. **Universal Application** - Same cycle for all project types and story types
2. **Agent Separation** - Clear boundaries between SM, Dev, QA, and PO roles
3. **Status-Driven Transitions** - Story status field orchestrates workflow progression
4. **Quality Gate Integration** - QA gate decisions control completion criteria
5. **File-Based State Tracking** - Story files and QA artifacts maintain workflow state
6. **Iterative Refinement** - Multiple Dev → QA cycles until quality standards met
7. **Optional Checkpoints** - PO validation and mid-dev QA checks can be inserted

### Design Philosophy

**"Separation of Concerns with Clear Handoffs"**

The development cycle embodies the principle that story preparation, implementation, and quality assurance are **distinct phases with distinct agents**:
- **SM prepares context** - Extracts architecture, writes comprehensive Dev Notes
- **Dev implements** - Focuses solely on execution without external doc loading
- **QA validates** - Reviews comprehensively with active refactoring authority
- **PO stewards** - Validates cohesion and process adherence

This separation ensures:
1. Developers receive crystal-clear, self-contained requirements
2. Quality is validated independently by specialized agent
3. Process stewardship maintains consistency across stories
4. Clear audit trail through status transitions and artifacts

---

## 2. Development Cycle Stages

### Stage Overview

The development cycle consists of **8 distinct stages** with clear entry/exit criteria:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT CYCLE STAGES                      │
└─────────────────────────────────────────────────────────────────┘

Stage 1: Story Preparation (SM)
   ↓
Stage 2: Pre-Implementation Validation (PO) [OPTIONAL]
   ↓
Stage 3: Story Implementation (Dev)
   ↓
Stage 4: Mid-Development QA Checks (QA) [OPTIONAL]
   ↓
Stage 5: Comprehensive Review (QA) [REQUIRED]
   ↓
Stage 6: Issue Resolution (Dev) [CONDITIONAL]
   ↓
Stage 7: Re-Review (QA) [CONDITIONAL]
   ↓
Stage 8: Story Completion (PO/User) [FINAL]
```

### Stage Descriptions

#### Stage 1: Story Preparation (SM - Bob)

**Objective**: Create self-contained, implementation-ready story with complete technical context

**Agent**: Scrum Master (SM)

**Primary Task**: `create-next-story.md` (6-step sequential workflow)

**Process**:
1. Identify next logical story from epic sequence
2. Extract story requirements from sharded epic file
3. Gather architecture context (story-type-aware selective reading)
4. Verify project structure alignment
5. Populate story template with comprehensive Dev Notes
6. Execute story draft checklist for quality validation

**Entry Criteria**:
- Sharded PRD and architecture documents exist in project
- Previous story completed (or first story in epic)
- User initiates story creation (new chat with SM agent)

**Exit Criteria**:
- Story file created in `docs/stories/{epic}.{story}.{title}.md`
- All template sections populated (Story, AC, Tasks, Dev Notes with Testing)
- Story status set to "Draft"
- Story draft checklist executed and passing

**Artifacts Created**:
- Story markdown file with complete sections
- Story contains:
  - Status: "Draft"
  - Story (user story format)
  - Acceptance Criteria (from epic)
  - Tasks/Subtasks (implementation sequence)
  - Dev Notes (comprehensive context including Testing subsection)
  - Change Log (initial entry)
  - Dev Agent Record (empty, for Dev to populate)
  - QA Results (empty, for QA to populate)

**Key Features**:
- **Architecture Context Extraction** - SM reads architecture docs to populate Dev Notes so Dev never needs to
- **Story-Type-Aware Reading** - Backend stories get different architecture sections than frontend stories
- **Source Citation Discipline** - All technical details cite source documents
- **Testing Standards Included** - Dev Notes contain complete testing requirements
- **Self-Contained Preparation** - Story has everything Dev needs, no external doc loading required

**Blocking Conditions**:
- Missing `core-config.yaml`
- No epic files found in sharded PRD location
- Epic completion (SM never auto-advances to next epic without user approval)
- Architecture document version incompatibility

**Success Metrics**:
- Story completeness (all sections populated, no placeholders)
- Dev Notes comprehensiveness (Dev can implement without questions)
- Testing standards clarity (frameworks, standards, requirements specified)
- Task sequence logic (ordered, atomic, testable)

---

#### Stage 2: Pre-Implementation Validation (PO - Sarah) [OPTIONAL]

**Objective**: Validate story draft for implementation readiness before Dev starts

**Agent**: Product Owner (PO)

**Primary Task**: `validate-next-story.md` (10-step validation workflow)

**Process**:
1. Validate template completeness (all sections present, no placeholders)
2. Verify file structure and source tree clarity
3. Check UI/Frontend specifications (if applicable)
4. Validate acceptance criteria satisfaction potential
5. Verify testing instructions completeness
6. Check security considerations
7. Validate task/subtask sequence logic
8. Perform anti-hallucination check (source verification, no invented details)
9. Assess Dev agent implementation readiness
10. Generate validation report with GO/NO-GO decision

**Entry Criteria**:
- Story status is "Draft"
- User decides to run optional validation (policy decision)
- SM has completed story preparation

**Exit Criteria**:
- Validation report generated
- GO decision → Story status changed to "Approved" by user
- NO-GO decision → Issues reported to SM for story revision

**When to Use**:
- Complex or high-risk stories
- Stories with novel technical approaches
- Brownfield stories with integration complexity
- Team learning phase (validating story preparation quality)
- When SM is new or learning story creation patterns

**Artifacts Created**:
- Validation report (typically in-chat, not persisted)
- Implementation readiness score
- GO/NO-GO decision with reasoning
- List of issues to address if NO-GO

**Validation Categories** (10 steps):
1. Template Completeness
2. File Structure Clarity
3. UI/Frontend Specifications
4. AC Satisfaction Potential
5. Testing Instructions
6. Security Considerations
7. Task Sequence Logic
8. Anti-Hallucination Check
9. Dev Agent Readiness
10. Final Assessment

**Output Format**:
```
VALIDATION REPORT: {epic}.{story}

Overall Assessment: [GO / NO-GO]
Implementation Readiness Score: [0-100]

Validation Results by Category:
[10 categories with ✅ PASS / ❌ FAIL / ⚠️ PARTIAL / N/A]

Issues to Address:
[List of blocking or concerning issues]

Recommendations:
[Suggestions for improvement]

Decision: [GO / NO-GO with rationale]
```

---

#### Stage 3: Story Implementation (Dev - James)

**Objective**: Execute approved story tasks with precision, comprehensive testing, and adherence to standards

**Agent**: Developer (Dev)

**Primary Command**: `*develop-story` (sequential task execution workflow)

**Process**:
1. **Pre-Implementation Verification**:
   - Verify story status is "Approved" (not "Draft")
   - Check current folder structure (don't create duplicate directories)
   - Load `devLoadAlwaysFiles` from core-config (coding standards, tech stack, source tree)
   - Review story structure and task sequence

2. **Sequential Task Execution Loop** (repeat for each task):
   - **Step 1**: Read next uncompleted task
   - **Step 2**: Implement task and subtasks following coding standards
   - **Step 3**: Write tests (unit tests required, integration tests if applicable)
   - **Step 4**: Execute validations (linting + all tests)
   - **Step 5**: ONLY if ALL validations pass → mark task [x] complete
   - **Step 6**: Update File List in Dev Agent Record

3. **Completion Validation** (all tasks marked [x]):
   - Run full linting suite
   - Run ALL tests (regression testing)
   - Ensure File List is complete
   - Execute DoD checklist (`execute-checklist` for `story-dod-checklist`)
   - Update Dev Agent Record (Agent Model Used, Debug Log References, Completion Notes, File List)
   - Update Change Log (dated entry with changes description)
   - Set Status to "Ready for Review"
   - HALT for QA review

**Entry Criteria**:
- Story status is "Approved" (not "Draft")
- User tells Dev to proceed with implementation
- `devLoadAlwaysFiles` are accessible
- Story file is loaded

**Exit Criteria**:
- All tasks and subtasks marked [x] complete
- All validations pass (linting clean, all tests passing)
- File List complete and accurate
- DoD checklist executed and passing
- Dev Agent Record fully populated
- Change Log updated
- Story status set to "Ready for Review"

**Artifacts Created/Modified**:

**Source Code Files**:
- Implementation files per story tasks
- Test files (unit + integration where applicable)
- Follow project structure from source-tree
- Adhere to coding standards

**Story File Updates** (ONLY allowed sections):
- Tasks/Subtasks: Checkboxes marked [x]
- Dev Agent Record:
  - Agent Model Used
  - Debug Log References
  - Completion Notes List
  - File List (all created/modified/deleted files)
- Change Log: Dated entry added
- Status: Changed to "Ready for Review"

**Debug Logs** (if applicable):
- Location: From core-config `devDebugLog` (e.g., `.ai/debug-log.md`)
- Content: Commands run, results, debugging traces

**Key Features**:
- **Minimal Context Loading** - Story + devLoadAlwaysFiles only (no PRD, no full architecture)
- **Sequential Task Execution** - Strict order, no skipping, no parallel execution
- **Test-First Validation** - No task completion without passing tests
- **Blocking Condition Protocol** - HALT on ambiguity, dependency issues, repeated failures
- **DoD Checklist Self-Assessment** - 7-category validation before ready for review
- **Strict Permission Model** - Can only update specific story sections

**Blocking Conditions** (HALT and escalate to user):
- Unapproved dependencies needed
- Ambiguous requirements after story check
- 3 failures attempting to implement or fix something repeatedly
- Missing configuration
- Failing regression tests

**Dev Agent Record Sections** (Dev exclusive ownership):
1. **Agent Model Used** - Record of AI model and version
2. **Debug Log References** - Links to debug logs if generated
3. **Completion Notes List** - Implementation summary, decisions made, challenges encountered
4. **File List** - Complete list of created/modified/deleted files

**Definition of Done Checklist Categories**:
1. Requirements Met (all functional requirements + all AC)
2. Coding Standards & Project Structure
3. Testing (unit, integration, coverage)
4. Functionality & Verification (manual testing, edge cases)
5. Story Administration (tasks complete, decisions documented)
6. Dependencies, Build & Configuration
7. Documentation (if applicable)

---

#### Stage 4: Mid-Development QA Checks (QA - Quinn) [OPTIONAL]

**Objective**: Provide early quality feedback during development to catch issues before full implementation completion

**Agent**: QA (Quinn)

**Available Commands** (developer self-service):
- `*risk` (`*risk-profile`) - Risk assessment with probability × impact scoring
- `*design` (`*test-design`) - Test strategy with scenario generation
- `*trace` (`*trace-requirements`) - Requirements-to-test traceability validation
- `*nfr` (`*nfr-assess`) - Non-functional requirements validation

**When to Use**:

**After Story Approval (Before Dev Starts)** - Recommended:
1. **Risk Profile** (`*risk`) - FIRST for complex stories
   - Identifies technical debt impact, integration complexity, regression potential
   - Critical for: Brownfield, API changes, data migrations
2. **Test Design** (`*design`) - SECOND to guide implementation
   - Provides test scenarios per AC, test level recommendations, priorities
   - Share with Dev: Include in story comments or attach

**During Development (Mid-Implementation)** - Developer Self-Service:
3. **Requirements Tracing** (`*trace`) - Verify coverage mid-development
   - Validates all AC have tests, no missing scenarios
   - Run when: After writing initial tests
4. **NFR Validation** (`*nfr`) - Check quality attributes
   - Assesses security, performance, reliability, maintainability
   - Run when: Before marking "Ready for Review"

**Entry Criteria** (flexible based on QA command):
- Story exists (any status from Approved to Review)
- User/Dev initiates specific QA command
- Story context accessible to QA agent

**Exit Criteria**:
- Assessment document created in `docs/qa/assessments/{epic}.{story}-{type}-{date}.md`
- Findings and recommendations documented
- Dev informed of issues (if any)

**Artifacts Created** (per command):
1. **Risk Profile**: `{epic}.{story}-risk-{YYYYMMDD}.md`
   - Risk categories with 1-9 scoring (probability × impact)
   - Mitigation strategies
   - Must-fix recommendations

2. **Test Design**: `{epic}.{story}-test-design-{YYYYMMDD}.md`
   - Test scenarios per AC
   - Test level recommendations (unit/integration/E2E)
   - Priority assignments (P0/P1/P2)
   - Test data requirements

3. **Requirements Tracing**: `{epic}.{story}-trace-{YYYYMMDD}.md`
   - AC-to-test mapping
   - Coverage gaps identification
   - Given-When-Then documentation

4. **NFR Assessment**: `{epic}.{story}-nfr-{YYYYMMDD}.md`
   - Security validation scenarios
   - Performance assessment criteria
   - Reliability evaluation
   - Maintainability scoring

**Key Features**:
- **Proactive Quality** - Shift-left testing with early risk identification
- **Developer Self-Service** - Dev can run QA checks without waiting
- **Incremental Feedback** - Issues caught early are cheaper to fix
- **Risk-Based Prioritization** - Focus testing effort on high-risk areas

**Decision Matrix** (when to use each command):

| Story Type | Before Dev | During Dev | Criticality |
|------------|------------|------------|-------------|
| Simple bug fix | Optional | Optional | Low |
| New feature | `*risk`, `*design` | `*trace` | Medium |
| Brownfield change | **Required** `*risk`, `*design` | **Recommended** `*trace`, `*nfr` | High |
| API modification | **Required** `*risk`, `*design` | **Required** `*trace` | High |
| Performance-critical | `*design` | **Required** `*nfr` | High |
| Data migration | **Required** `*risk`, `*design` | **Required** `*trace` | Very High |

---

#### Stage 5: Comprehensive Review (QA - Quinn) [REQUIRED]

**Objective**: Perform thorough quality review with active refactoring authority and generate quality gate decision

**Agent**: QA (Quinn)

**Primary Task**: `review-story.md` (comprehensive adaptive review workflow)

**Process**:
1. **Deep Code Analysis**:
   - Architecture pattern compliance
   - Code quality and maintainability
   - Security vulnerability scanning
   - Performance bottleneck detection

2. **Active Refactoring** (unique capability):
   - QA can directly improve code when safe
   - Fixes obvious issues immediately (typos, style, minor bugs)
   - Suggests complex refactoring for Dev to implement
   - Documents all changes made

3. **Test Validation**:
   - Coverage at all levels (unit/integration/E2E)
   - Test quality assessment (no flaky tests, proper assertions)
   - Regression test adequacy
   - Test data management validation

4. **Comprehensive Assessment** (sub-task integration):
   - May call `risk-profile`, `test-design`, `trace-requirements`, `nfr-assess` as sub-tasks
   - Synthesizes findings from all assessments
   - Identifies gaps across quality dimensions

5. **Gate Decision**:
   - Creates gate YAML: `docs/qa/gates/{epic}.{story}-{slug}.yml`
   - Adds QA Results section to story file
   - Status decision: PASS / CONCERNS / FAIL / WAIVED

**Entry Criteria**:
- Story status is "Ready for Review"
- Dev has marked all tasks complete
- All tests passing locally
- Lint and type checks pass
- User initiates QA review

**Exit Criteria**:
- Comprehensive review completed
- QA Results section added to story
- Gate file created with decision
- Story status updated based on gate decision

**Artifacts Created**:

**Gate File** (`docs/qa/gates/{epic}.{story}-{slug}.yml`):
```yaml
epic_story: "{epic}.{story}"
gate_decision: "PASS" | "CONCERNS" | "FAIL" | "WAIVED"
rationale: "..."
top_issues:
  - id: "ISSUE-001"
    severity: "high" | "medium" | "low"
    finding: "..."
    suggested_action: "..."
nfr_validation:
  security: { status: "PASS" | "CONCERNS" | "FAIL", notes: "..." }
  performance: { status: "...", notes: "..." }
  reliability: { status: "...", notes: "..." }
  maintainability: { status: "...", notes: "..." }
test_design:
  coverage_gaps: [...]
trace_coverage:
  uncovered_requirements: [...]
risk_summary:
  recommendations:
    must_fix: [...]
created_at: "YYYY-MM-DD"
created_by: "qa-agent"
```

**Story File - QA Results Section**:
- Gate decision and rationale
- Top issues summary
- Recommendations for Dev
- Refactoring changes made by QA (if any)

**Optional Assessment Files** (if generated as sub-tasks):
- Risk profile, test design, traceability, NFR assessment documents

**Key Features**:
- **Active Refactoring Authority** - QA is not passive; can directly improve code
- **Gate Decision Model** - Clear go/no-go decisions with rationale
- **Adaptive Sub-Task Execution** - Calls specialized assessments as needed
- **Comprehensive Coverage** - Architecture, code quality, security, performance, testing
- **Evidence-Based Validation** - All findings documented with references

**Gate Decision Meanings**:

| Decision | Meaning | Dev Action | Can Proceed? |
|----------|---------|------------|--------------|
| **PASS** | All critical requirements met | None required | ✅ Yes (mark Done) |
| **CONCERNS** | Non-critical issues found | Team review recommended | ⚠️ With caution |
| **FAIL** | Critical issues (security, missing P0 tests) | Must fix | ❌ No (must address) |
| **WAIVED** | Issues acknowledged and accepted | Document reasoning | ✅ With approval |

**Quality Standards Enforced**:
- No flaky tests (proper async handling, explicit waits)
- No hard waits (dynamic strategies only)
- Stateless tests (run independently and in parallel)
- Self-cleaning tests (manage own test data)
- Appropriate test levels (unit for logic, integration for interactions, E2E for journeys)
- Clear assertions (keep in tests, not buried in helpers)

---

#### Stage 6: Issue Resolution (Dev - James) [CONDITIONAL]

**Objective**: Systematically apply fixes based on QA findings with priority-based approach

**Agent**: Developer (Dev)

**Primary Task**: `apply-qa-fixes.md` (6-step deterministic fix workflow)

**Trigger**: QA gate decision is FAIL or CONCERNS, or user requests `*review-qa` command

**Process**:

1. **Load Core Config & Locate Story** (Step 0):
   - Read `.bmad-core/core-config.yaml`
   - Resolve `qa_root` and `story_root`
   - Locate story file
   - HALT if missing

2. **Collect QA Findings** (Step 1):
   - **Gate YAML** (most recent if multiple):
     - Gate decision
     - top_issues with severity, finding, suggested_action
     - nfr_validation status and notes
     - Trace coverage gaps
     - Test design coverage_gaps
     - Risk must_fix recommendations
   - **Assessment Markdowns** (if present):
     - Test Design, Traceability, Risk Profile, NFR Assessment
   - Extract explicit gaps and recommendations

3. **Build Deterministic Fix Plan** (Step 2) - Priority Order:
   1. High severity in top_issues (security/perf/reliability/maintainability)
   2. NFR FAIL status items (must be fixed)
   3. NFR CONCERNS status items
   4. Test Design coverage_gaps (prioritize P0 scenarios)
   5. Trace uncovered requirements (AC-level)
   6. Risk must_fix recommendations
   7. Medium severity issues
   8. Low severity issues

   **Guidance**:
   - Prefer tests closing coverage gaps before/with code changes
   - Keep changes minimal and targeted
   - Follow project architecture and language rules

4. **Apply Changes** (Step 3):
   - Implement code fixes per plan
   - Add missing tests to close coverage gaps
   - Unit tests first, integration where required by AC
   - Follow dependency injection boundaries and existing patterns

5. **Validate** (Step 4):
   - Run linting and fix issues
   - Run all tests until passing
   - Iterate until clean

6. **Update Story** (Step 5) - ALLOWED SECTIONS ONLY:
   - Tasks/Subtasks: Mark any fix subtask as done
   - Dev Agent Record: Agent Model Used, Debug Log References, Completion Notes, File List
   - Change Log: New dated entry describing applied fixes
   - Status: Per Status Rule

   **Status Rule**:
   - If gate was PASS and all gaps closed → `Status: Ready for Done`
   - Otherwise → `Status: Ready for Review` (notify QA to re-run review)

7. **Do NOT Edit Gate Files**:
   - Dev does not modify gate YAML
   - If fixes address issues, request QA to re-run `review-story` to update gate

**Entry Criteria**:
- QA gate file exists (decision: FAIL or CONCERNS)
- Or user explicitly requests `*review-qa`
- Dev agent activated with story context

**Exit Criteria**:
- All high severity issues addressed
- NFR FAIL items resolved
- Coverage gaps closed or documented with rationale
- Linting clean, all tests passing
- Story updated (allowed sections only)
- Status set per Status Rule

**Artifacts Modified**:
- Source code files (fixes applied)
- Test files (missing tests added)
- Story file (Dev Agent Record, Change Log, Status)

**Completion Checklist**:
- ✅ Linting: 0 problems
- ✅ Tests: all pass
- ✅ All high severity top_issues addressed
- ✅ NFR FAIL → resolved; CONCERNS minimized or documented
- ✅ Coverage gaps closed or explicitly documented with rationale
- ✅ Story updated (allowed sections only) including File List and Change Log
- ✅ Status set according to Status Rule

**Blocking Conditions**:
- Missing `.bmad-core/core-config.yaml`
- Story file not found
- No QA artifacts found (neither gate nor assessments) - HALT and request QA to generate gate

**Key Features**:
- **Deterministic Prioritization** - Clear ordering ensures critical issues fixed first
- **Minimal, Targeted Changes** - Avoid scope creep during fixes
- **Test-First Gap Closure** - Prefer adding tests before code changes
- **Status-Driven Re-Review** - Automatic re-routing back to QA if needed
- **No Gate Modification** - Dev cannot change QA decisions, only address findings

---

#### Stage 7: Re-Review (QA - Quinn) [CONDITIONAL]

**Objective**: Validate that Dev has adequately addressed QA findings and update gate decision

**Agent**: QA (Quinn)

**Primary Task**: `review-story.md` (same comprehensive review, re-execution)

**Trigger**: Story status returns to "Ready for Review" after fix application

**Process**:
1. QA re-runs comprehensive review workflow (same as Stage 5)
2. QA validates fixes applied by Dev
3. QA checks if new issues introduced
4. QA updates or creates new gate file with updated decision
5. QA updates story QA Results section

**Entry Criteria**:
- Story status is "Ready for Review" (returned from "InProgress" after fixes)
- Dev has indicated fixes applied
- Gate file exists from previous review
- User initiates QA re-review

**Exit Criteria**:
- Re-review completed
- Gate file updated or new gate created
- QA Results section updated in story
- Gate decision reflects current state

**Possible Outcomes**:
1. **PASS** → Dev sets Status to "Ready for Done", story complete
2. **CONCERNS** → Team decides whether to proceed or iterate
3. **FAIL** → Return to Stage 6 (Dev fixes again)
4. **WAIVED** → Conscious decision to accept issues, document reasoning

**Iteration Limit**:
- No hard limit, but typically converges in 2-3 cycles
- Each cycle:
  - Dev fixes issues (Stage 6)
  - QA re-reviews (Stage 7)
  - Gate decision improves or stabilizes

**Key Features**:
- **Convergence Toward Quality** - Multiple rounds until standards met
- **Waiver Mechanism** - Conscious trade-off decisions allowed with documentation
- **Gate History** - Multiple gate files show quality improvement trajectory
- **Fresh Perspective** - QA re-evaluates completely, not just checking fixes

---

#### Stage 8: Story Completion (PO/User) [FINAL]

**Objective**: Finalize story and mark as Done after all quality gates pass

**Agents**: Product Owner (PO) or User

**Process**:
1. Verify gate decision is PASS or WAIVED (with documented rationale)
2. Optional: PO validates story completion against epic objectives
3. Update story status: "Ready for Done" → "Done"
4. Story enters completed state

**Entry Criteria**:
- Story status is "Ready for Done"
- QA gate decision is PASS or WAIVED
- All tasks marked complete
- All validations passing

**Exit Criteria**:
- Story status is "Done"
- Story archived in docs/stories/ as permanent record
- Next story can begin (return to Stage 1)

**Artifacts Finalized**:
- Story file with complete history:
  - All sections populated
  - All tasks checked
  - Dev Agent Record complete
  - QA Results complete
  - Change Log complete
  - Status: "Done"
- Gate file(s) in docs/qa/gates/
- Assessment files (if generated) in docs/qa/assessments/

**Post-Completion**:
- Story available for retrospective analysis
- Metrics can be extracted (time to complete, number of QA cycles, etc.)
- Learnings documented for process improvement

**Key Features**:
- **Clear Completion Criteria** - No ambiguity about when story is truly done
- **Audit Trail** - Complete history of development journey
- **Quality Assurance** - Gate decisions ensure standards met
- **Process Metrics** - Data available for continuous improvement

---

## 3. Agent Collaboration Pattern

### Overview

The development cycle involves **4 primary agents** collaborating through **clear handoffs** and **shared artifacts**:

1. **Scrum Master (SM - Bob)** - Story preparation
2. **Developer (Dev - James)** - Implementation
3. **QA (Quinn)** - Quality assurance
4. **Product Owner (PO - Sarah)** - Process stewardship

### Collaboration Model

```
┌─────────────────────────────────────────────────────────────────┐
│                   AGENT COLLABORATION PATTERN                    │
└─────────────────────────────────────────────────────────────────┘

[SM] Prepare Story → Story File (Status: Draft)
         ↓
[PO] Validate Story (Optional) → Validation Report
         ↓
[USER] Approve Story → Story File (Status: Approved)
         ↓
[Dev] Implement Story → Story File (Status: Ready for Review)
         ↓                + Source Code + Tests
         ↓
[QA] Risk/Design Checks (Optional) → Assessment Files
         ↓
[Dev] Implementation continues with QA guidance
         ↓
[QA] Comprehensive Review → Gate File + QA Results
         ↓
    ┌────┴────┐
    │         │
 PASS      FAIL/CONCERNS
    │         │
    │         ↓
    │    [Dev] Apply Fixes → Updated Code + Story
    │         ↓
    │    [QA] Re-Review → Updated Gate
    │         ↓
    └────→[Iterate until PASS/WAIVED]
         ↓
[USER/PO] Mark Done → Story File (Status: Done)
```

### Agent Handoffs

#### Handoff 1: SM → User (Story Approval)

**Artifact**: Story file with status "Draft"

**Handoff Mechanism**:
- SM presents completed story
- User reviews completeness
- User decides: Approve (status → "Approved") or Request Changes (back to SM)

**Optional**: PO can validate story draft using `validate-next-story` task before user approval

#### Handoff 2: User → Dev (Implementation Authorization)

**Artifact**: Story file with status "Approved"

**Handoff Mechanism**:
- User tells Dev to implement (new chat with @dev)
- Dev loads story file
- Dev verifies status is "Approved" (not "Draft")
- Dev loads devLoadAlwaysFiles from core-config
- Dev begins implementation

**Critical**: Dev will HALT if story status is "Draft"

#### Handoff 3: Dev → QA (Quality Review)

**Artifact**: Story file with status "Ready for Review" + implementation files

**Handoff Mechanism**:
- Dev completes all tasks, tests passing, DoD checklist complete
- Dev sets status to "Ready for Review"
- Dev HALTs for QA
- User initiates QA review (new chat with @qa)
- QA loads story and begins comprehensive review

**Optional**: QA can be engaged mid-development for risk/test design guidance

#### Handoff 4: QA → Dev (Fix Request)

**Artifact**: Gate file (decision: FAIL or CONCERNS) + Assessment files

**Handoff Mechanism**:
- QA completes review, creates gate file
- QA updates story QA Results section
- If gate is FAIL or CONCERNS:
  - User initiates Dev fix cycle (chat with @dev)
  - Dev runs `*review-qa` command
  - Dev loads QA artifacts and builds fix plan
  - Dev applies fixes and returns to "Ready for Review" status

**Gate Decision Impact**:
- PASS → Skip this handoff, proceed to completion
- CONCERNS → Optional handoff (team decision)
- FAIL → Required handoff (must fix)
- WAIVED → Skip handoff, proceed with documented reasoning

#### Handoff 5: Dev → QA (Re-Review Request)

**Artifact**: Updated story (status: "Ready for Review") + updated implementation

**Handoff Mechanism**:
- Dev completes fixes per QA findings
- Dev updates Dev Agent Record with fix details
- Dev sets status back to "Ready for Review"
- User initiates QA re-review
- QA re-runs comprehensive review (Stage 7)
- QA updates or creates new gate file

**Iteration**: This handoff can repeat until gate decision is PASS or WAIVED

#### Handoff 6: QA → User/PO (Completion Authorization)

**Artifact**: Gate file (decision: PASS or WAIVED) + story with QA Results

**Handoff Mechanism**:
- QA completes final review with PASS decision
- Dev (or User) sets story status to "Ready for Done"
- User or PO performs final validation (optional)
- User/PO sets status to "Done"
- Story enters completed state

### Shared Artifacts

#### 1. Story File (Central Coordination Document)

**Location**: `docs/stories/{epic}.{story}.{title}.md`

**Created By**: Scrum Master (SM)

**Editors**:
- **SM** (Owner): Story, AC, Tasks, Dev Notes, Testing, Change Log (initial)
- **Dev**: Tasks checkboxes, Dev Agent Record, Change Log (updates), Status (conditional)
- **QA**: QA Results, Change Log (updates)
- **User/PO**: Status (approval and completion)

**Purpose**: Single source of truth for story lifecycle

**Sections and Ownership**:
| Section | Owner | Editors | Purpose |
|---------|-------|---------|---------|
| Status | SM | SM, Dev (conditional), User | Workflow state tracking |
| Story | SM | SM only | User story text |
| Acceptance Criteria | SM | SM only | Requirements definition |
| Tasks/Subtasks | SM | SM, Dev (checkboxes) | Implementation sequence |
| Dev Notes | SM | SM only | Complete implementation context |
| Dev Agent Record | Dev | Dev only | Implementation details and file list |
| QA Results | QA | QA only | Quality findings and gate summary |
| Change Log | SM | SM, Dev, QA | Audit trail of modifications |

#### 2. Gate File (Quality Decision Record)

**Location**: `docs/qa/gates/{epic}.{story}-{slug}.yml`

**Created By**: QA Agent

**Editors**: QA only (Dev never modifies)

**Readers**: Dev (for apply-qa-fixes), User, PO

**Purpose**: Formal quality gate decision with findings

**Content Structure**:
```yaml
epic_story: "{epic}.{story}"
gate_decision: "PASS" | "CONCERNS" | "FAIL" | "WAIVED"
rationale: "..."
top_issues: [array of issue objects]
nfr_validation: {security, performance, reliability, maintainability}
test_design: {coverage_gaps: [...]}
trace_coverage: {uncovered_requirements: [...]}
risk_summary: {recommendations: {must_fix: [...]}}
created_at: "YYYY-MM-DD"
created_by: "qa-agent"
```

**Multiple Gates**: If multiple reviews occur, multiple gate files created with timestamps

#### 3. Assessment Files (Quality Analysis Reports)

**Location**: `docs/qa/assessments/{epic}.{story}-{type}-{YYYYMMDD}.md`

**Created By**: QA Agent (during mid-dev checks or comprehensive review)

**Editors**: QA only

**Readers**: Dev, User, PO

**Types**:
- `risk` - Risk profile with scoring
- `test-design` - Test strategy and scenarios
- `trace` - Requirements-to-test traceability
- `nfr` - Non-functional requirements validation

**Purpose**: Detailed quality analysis supporting gate decisions

#### 4. Implementation Files (Source Code and Tests)

**Location**: Project source directories (per project structure)

**Created By**: Developer (Dev)

**Editors**: Dev (primary), QA (refactoring during review)

**Purpose**: Actual implementation of story requirements

**Tracked In**: Dev Agent Record > File List (complete list of created/modified/deleted files)

### Communication Patterns

#### Pattern 1: Sequential Handoff (Primary)

```
Agent A completes work → Updates shared artifact → Agent B begins work
```

**Example**: SM creates story → Updates story status to "Draft" → User reviews and approves → Dev begins implementation

**Characteristics**:
- Clear transition points
- Artifact-mediated handoff
- Status field drives workflow progression

#### Pattern 2: Request-Response (QA Feedback)

```
Agent A requests feedback → Agent B analyzes and responds → Agent A acts on feedback
```

**Example**: Dev completes implementation → QA reviews and creates gate → Dev applies fixes based on gate findings

**Characteristics**:
- Iterative refinement
- Feedback loop until quality threshold met
- Gate decision controls iteration

#### Pattern 3: Optional Insertion (Mid-Dev QA)

```
Agent A working → Agent B provides proactive guidance → Agent A continues with guidance
```

**Example**: Dev implementing story → QA runs risk profile and test design → Dev uses assessments to guide implementation

**Characteristics**:
- Proactive quality support
- Non-blocking (Dev can continue regardless)
- Shift-left testing approach

#### Pattern 4: Validation Checkpoint (PO Validation)

```
Agent A completes work → Agent B validates → Decision: Proceed or Revise
```

**Example**: SM creates story draft → PO validates using validate-next-story → Decision: GO (proceed to Dev) or NO-GO (SM revises)

**Characteristics**:
- Quality gate before progression
- GO/NO-GO decision model
- Prevents low-quality work from advancing

### Context Passing

#### What Gets Passed Between Agents

**SM → Dev**:
- Story text (user story format)
- Acceptance Criteria (from epic)
- Tasks/Subtasks (implementation sequence)
- Dev Notes (comprehensive context including Testing standards)
- **Critical**: Dev Notes contain ALL architecture context so Dev never loads PRD/architecture docs

**Dev → QA**:
- Implementation files (code, tests)
- Dev Agent Record (decisions made, file list, completion notes)
- Change Log (what changed and why)
- Story status ("Ready for Review")

**QA → Dev**:
- Gate decision (PASS/CONCERNS/FAIL/WAIVED)
- Top issues (prioritized findings)
- Coverage gaps (missing tests)
- NFR validation results (security, performance, etc.)
- Recommendations (must-fix, should-fix, nice-to-have)

**QA → User/PO**:
- Gate decision and rationale
- Quality summary
- Go/No-Go recommendation
- Trade-off analysis (if WAIVED)

#### What Does NOT Get Passed

**Dev Does NOT Receive**:
- PRD documents (context already in Dev Notes)
- Full architecture documents (only devLoadAlwaysFiles subset)
- Epic files (SM already extracted relevant portions)
- **Reason**: Minimal context loading strategy

**QA Does NOT Modify**:
- Story sections owned by SM or Dev (except QA Results)
- Implementation decisions (only suggests, doesn't dictate)
- **Reason**: Respect agent ownership boundaries

### Collaboration Principles

1. **Single Artifact Ownership** - Each artifact section has one owner
2. **Clear Edit Permissions** - Template defines who can edit what
3. **Artifact-Mediated Handoffs** - No verbal/implicit handoffs, always via artifact updates
4. **Status-Driven Progression** - Story status field orchestrates workflow
5. **Audit Trail** - Change Log tracks all modifications with agent attribution
6. **Separation of Concerns** - SM prepares, Dev implements, QA validates, PO stewards
7. **Minimal Context Sharing** - Only essential context passed between agents
8. **Decision Authority** - Each agent has clear decision authority in their domain

---

## 4. Story Status Lifecycle

### Status Values and Transitions

The story `Status` field drives workflow progression through **5 distinct states**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     STORY STATUS LIFECYCLE                       │
└─────────────────────────────────────────────────────────────────┘

Draft → Approved → InProgress → Review → Done
  ↑        ↑           ↓          ↓
  └────────┴───────────┴──────────┘
   (Revision cycles possible)
```

### Status Definitions

#### 1. Draft

**Meaning**: Story has been created but not yet approved for development

**Set By**: Scrum Master (SM) at creation

**Typical Duration**: Minutes to hours (pending user review)

**Next States**:
- → `Approved` (user approves after optional PO validation)
- → `Draft` (SM revises based on feedback)

**Story Characteristics**:
- All template sections populated
- Dev Notes comprehensive
- Tasks/Subtasks defined
- Testing standards included
- Ready for review but not implementation

**Blocking Rules**:
- Dev agent will HALT if status is "Draft"
- Must be approved before implementation can begin

#### 2. Approved

**Meaning**: Story has been reviewed and approved for implementation

**Set By**: User (manually) after SM preparation and optional PO validation

**Typical Duration**: Until Dev begins implementation

**Next States**:
- → `InProgress` (Dev begins implementation)
- → `Draft` (if issues discovered before implementation starts)

**Story Characteristics**:
- User has validated story completeness
- Story is ready for Dev to pick up
- Optional PO validation passed (if performed)
- Implementation can begin

**Entry Criteria**:
- Story status is "Draft"
- User reviews and approves
- Optional: PO validation report shows GO decision

#### 3. InProgress

**Meaning**: Dev is actively implementing the story

**Set By**: Developer (Dev) when implementation begins

**Typical Duration**: Hours to days (depending on story complexity)

**Next States**:
- → `Review` (Dev completes all tasks, tests passing, DoD checklist complete)
- → `InProgress` (stays in progress during active work)

**Story Characteristics**:
- Dev has loaded story and devLoadAlwaysFiles
- Tasks being implemented sequentially
- Tasks marked [x] as completed
- Dev Agent Record being populated
- File List being updated
- Tests being written and validated

**During This State**:
- Dev can run mid-development QA checks (`*risk`, `*design`, `*trace`, `*nfr`)
- Dev updates Task checkboxes, Dev Agent Record, File List
- Dev may HALT on blocking conditions (escalate to user)

**Note**: Some implementations skip explicit "InProgress" status and go directly from "Approved" to "Review"

#### 4. Review (or "Ready for Review")

**Meaning**: Dev has completed implementation and story is ready for QA review

**Set By**: Developer (Dev) after all tasks complete and DoD checklist passes

**Typical Duration**: Until QA completes review (minutes to hours)

**Next States**:
- → `Done` (if QA gate is PASS or WAIVED, and user marks Done)
- → `Review` (if QA re-review needed after fixes)
- → `InProgress` (if Dev applies QA fixes - though status may stay "Review")

**Story Characteristics**:
- All tasks and subtasks marked [x]
- All tests passing (lint + unit + integration)
- DoD checklist executed and passing
- Dev Agent Record complete (Agent Model, Completion Notes, File List)
- Change Log updated with implementation summary
- Ready for QA comprehensive review

**Entry Criteria**:
- All tasks complete
- Validations passing
- File List complete
- DoD checklist complete

**QA Actions**:
- Comprehensive review (`*review-story`)
- Create gate file with decision
- Update QA Results section in story
- Potentially refactor code (active refactoring authority)

#### 5. Done

**Meaning**: Story is complete, all quality gates passed, ready for production

**Set By**: User or Product Owner (PO) after QA gate PASS/WAIVED

**Typical Duration**: Permanent (final state)

**Next States**: None (terminal state)

**Story Characteristics**:
- All tasks implemented and tested
- QA gate decision is PASS or WAIVED
- All sections fully populated
- Complete audit trail in Change Log
- Dev Agent Record complete
- QA Results complete
- All artifacts finalized

**Entry Criteria**:
- Status was "Ready for Review" or "Review"
- QA gate decision is PASS or WAIVED
- User/PO performs final validation (optional)

**Post-Completion**:
- Story available for retrospective analysis
- Metrics extractable (time to complete, QA cycles, etc.)
- Next story can begin

### Status Transition Rules

#### Automatic Transitions (Agent-Driven)

1. **SM creates story**: Status automatically set to "Draft"
2. **Dev completes implementation**: Dev sets status to "Review"

#### Manual Transitions (User-Driven)

1. **User approves story**: "Draft" → "Approved"
2. **User marks story done**: "Review" → "Done"

#### Conditional Transitions (Decision-Driven)

1. **QA gate PASS**: "Review" → (User marks) "Done"
2. **QA gate FAIL**: "Review" → (Dev fixes) "Review" (re-review)
3. **QA gate CONCERNS**: Team decision (proceed or iterate)
4. **QA gate WAIVED**: "Review" → (User marks with rationale) "Done"

### Status-Driven Workflow Control

The status field acts as the **state machine controller** for the development cycle:

```
IF status == "Draft" THEN
    Dev agent HALTs (cannot implement)
    User must approve first

IF status == "Approved" THEN
    Dev agent can begin implementation

IF status == "Review" THEN
    QA can perform comprehensive review
    Dev can apply fixes if gate FAIL/CONCERNS

IF status == "Done" THEN
    Story is complete
    Next story can begin
```

### Status Visibility and Tracking

**Story Files**: Status field at top of story markdown

**Tracking Mechanisms**:
- File system: List stories with grep/find
- Project boards: Map status to columns (Draft | Approved | InProgress | Review | Done)
- Metrics: Track time in each status, identify bottlenecks

**Epic Completion**: Epic is complete when all its stories have status "Done"

---

## 5. Core Workflow Patterns

### Pattern Overview

The development cycle exhibits **5 core patterns** that define its operational characteristics:

### Pattern 1: Sequential Stage Progression

**Description**: Linear progression through defined stages with clear entry/exit criteria

**Stages**: Story Preparation → Implementation → Review → Completion

**Characteristics**:
- Each stage has specific agent responsibility
- Stage completion triggers next stage
- No stage skipping (except optional stages)
- Clear checkpoints between stages

**Example**:
```
SM creates story (Stage 1)
  → Entry: User initiates
  → Exit: Story file with status "Draft"
  → Trigger: Status change to "Approved"

Dev implements story (Stage 3)
  → Entry: Status "Approved"
  → Exit: Status "Ready for Review"
  → Trigger: QA review begins
```

**Benefits**:
- Predictable workflow
- Clear responsibility boundaries
- Easy to track progress
- Facilitates automation

### Pattern 2: Iterative Quality Refinement

**Description**: Multiple Dev → QA → Dev cycles until quality gates pass

**Flow**:
```
Dev completes implementation
  ↓
QA comprehensive review → Gate decision
  ↓
IF gate == FAIL or CONCERNS:
    Dev applies fixes
    ↓
    QA re-reviews → New gate decision
    ↓
    Repeat until gate == PASS or WAIVED
```

**Convergence**:
- Typically 1-3 iterations
- Each cycle improves quality
- Gate decisions show improvement trajectory
- Waiver mechanism allows conscious trade-offs

**Characteristics**:
- Quality-driven iteration
- No hard iteration limit
- Deterministic fix prioritization
- Gate history shows progress

**Exit Conditions**:
- Gate decision PASS → Story complete
- Gate decision WAIVED (with rationale) → Story complete with documented trade-offs

### Pattern 3: Status-Driven Orchestration

**Description**: Story status field controls workflow progression and agent activation

**Mechanism**:
```
status = "Draft" → User reviews, PO validates (optional)
status = "Approved" → Dev implements
status = "Review" → QA reviews
status = "Done" → Story complete, next story begins
```

**Agent Behavior Based on Status**:
- **SM**: Creates stories with status "Draft"
- **Dev**: HALTs if status is "Draft", implements if "Approved"
- **QA**: Reviews when status is "Review"
- **User/PO**: Changes status to "Approved" and "Done"

**Benefits**:
- Self-documenting workflow state
- No external state machine needed
- File-based state tracking (simple, auditable)
- Easy to query and aggregate (grep, find)

### Pattern 4: Artifact-Mediated Handoffs

**Description**: Agents communicate exclusively through shared artifacts, no verbal/implicit handoffs

**Shared Artifacts**:
1. **Story File**: Central coordination document
2. **Gate File**: Quality decision record
3. **Assessment Files**: Quality analysis reports
4. **Implementation Files**: Source code and tests

**Handoff Pattern**:
```
Agent A updates artifact (e.g., sets status field)
  ↓
Artifact change signals Agent B
  ↓
Agent B reads artifact and begins work
  ↓
Agent B updates artifact when complete
```

**Example**:
```
SM populates story, sets status "Draft"
  ↓ (artifact: story file)
User reviews, changes status to "Approved"
  ↓ (artifact: story file)
Dev reads story, implements, sets status "Review"
  ↓ (artifact: story file + code)
QA reviews, creates gate file
  ↓ (artifact: gate YAML + story QA Results)
Dev reads gate, applies fixes
```

**Benefits**:
- Clear audit trail
- No information loss
- Asynchronous collaboration possible
- Multi-agent coordination without direct communication

### Pattern 5: Minimal Context Loading

**Description**: Each agent loads only essential context, reducing token usage and hallucination risk

**SM Context**:
- Sharded epic files
- Architecture documents (for extraction to Dev Notes)
- Previous story for learning
- Project structure documents

**Dev Context**:
- Story file (self-contained)
- devLoadAlwaysFiles (coding standards, tech stack, source tree)
- NO PRD, NO full architecture docs

**QA Context**:
- Story file
- Implementation files
- Gate file (if re-reviewing)
- Assessment files (if previously generated)

**Benefits**:
- Reduced token usage (cost savings)
- Faster execution (less to process)
- Lower hallucination risk (can't invent from unseen docs)
- Clear separation of planning vs. implementation

**Key Principle**: **"SM extracts architecture context → Dev Notes → Dev never loads architecture docs"**

---

## 6. Quality Gates and Validation

### Quality Gate Model

The BMad development cycle implements a **comprehensive quality gate system** with multiple checkpoints:

### Gate Levels

#### Level 1: Story Draft Validation (Optional - Pre-Implementation)

**Gate Type**: Story preparation quality gate

**Gatekeeper**: Product Owner (PO)

**Task**: `validate-next-story.md`

**When**: After SM creates story, before Dev implementation

**Decision**: GO / NO-GO

**Criteria** (10 validation categories):
1. Template completeness
2. File structure clarity
3. UI/Frontend specifications (if applicable)
4. AC satisfaction potential
5. Testing instructions completeness
6. Security considerations
7. Task sequence logic
8. Anti-hallucination check
9. Dev agent readiness
10. Overall implementation readiness score

**Outcome**:
- **GO**: Story approved for implementation
- **NO-GO**: SM revises story before Dev begins

**Purpose**: Catch story preparation issues before implementation effort wasted

#### Level 2: Definition of Done Checklist (Required - Dev Self-Assessment)

**Gate Type**: Implementation completeness gate

**Gatekeeper**: Developer (Dev) - self-assessment

**Task**: `execute-checklist.md` for `story-dod-checklist.md`

**When**: After all tasks complete, before marking "Ready for Review"

**Decision**: PASS (all items addressed) / FAIL (gaps remain)

**Criteria** (7 categories):
1. Requirements Met (functional + AC)
2. Coding Standards & Project Structure
3. Testing (unit, integration, coverage)
4. Functionality & Verification
5. Story Administration
6. Dependencies, Build & Configuration
7. Documentation (if applicable)

**Outcome**:
- **PASS**: Dev sets status to "Ready for Review"
- **FAIL**: Dev addresses gaps before review

**Purpose**: Ensure Dev has completed all necessary work before QA review

#### Level 3: QA Comprehensive Review Gate (Required - Final Quality Gate)

**Gate Type**: Production readiness gate

**Gatekeeper**: QA Agent (Quinn)

**Task**: `review-story.md`

**When**: After Dev marks "Ready for Review"

**Decision**: PASS / CONCERNS / FAIL / WAIVED

**Criteria**:
- Code quality and maintainability
- Architecture pattern compliance
- Security vulnerability assessment
- Performance bottleneck detection
- Test coverage (all levels)
- Test quality (no flaky tests)
- NFR validation (security, performance, reliability, maintainability)
- Requirements traceability
- Risk mitigation

**Artifacts Created**:
- Gate YAML file (`docs/qa/gates/{epic}.{story}-{slug}.yml`)
- QA Results section in story
- Optional: Assessment files (risk, test-design, trace, nfr)

**Outcome**:
- **PASS**: Story can be marked Done
- **CONCERNS**: Non-critical issues, team decision to proceed
- **FAIL**: Critical issues, Dev must fix
- **WAIVED**: Issues accepted with documented rationale

**Purpose**: Independent quality validation before production

### Gate Decision Matrix

| Gate Decision | Meaning | Dev Action Required | Story Progression |
|---------------|---------|---------------------|-------------------|
| **PASS** | All critical requirements met, no blocking issues | None | Status → "Done" |
| **CONCERNS** | Non-critical issues found, team review recommended | Optional (team decision) | Discuss or iterate |
| **FAIL** | Critical issues (security, missing P0 tests, major bugs) | **Required** (must fix) | Dev fixes → QA re-reviews |
| **WAIVED** | Issues acknowledged and consciously accepted | Document reasoning | Status → "Done" with rationale |

### Gate Decision Factors

#### PASS Criteria:
- ✅ All AC met with tests
- ✅ No high-severity security issues
- ✅ P0 test scenarios covered
- ✅ No flaky or low-quality tests
- ✅ NFR validations PASS or minor CONCERNS
- ✅ Code quality meets standards
- ✅ Architecture patterns followed

#### FAIL Triggers:
- ❌ Security vulnerabilities found
- ❌ Missing P0 test coverage
- ❌ Critical AC not met or untested
- ❌ Flaky or broken tests
- ❌ NFR validation FAIL (security, critical performance)
- ❌ Major code quality issues
- ❌ Architecture pattern violations

#### CONCERNS Triggers:
- ⚠️ Minor code quality issues
- ⚠️ P1/P2 test coverage gaps
- ⚠️ Non-critical NFR concerns
- ⚠️ Technical debt introduced (documented)
- ⚠️ Minor refactoring opportunities
- ⚠️ Documentation gaps (non-critical)

#### WAIVED Criteria:
- Conscious decision to accept issues
- Documented rationale (time constraints, low risk, planned future work)
- Team/stakeholder approval
- Risk assessment shows acceptable trade-off

### Validation Checkpoints Summary

The development cycle includes **4 primary validation checkpoints**:

1. **Story Draft Validation** (Optional) - PO validates story preparation
2. **Folder Structure Check** (Required) - Dev verifies project structure before implementation
3. **Definition of Done** (Required) - Dev self-assesses before review
4. **QA Comprehensive Review** (Required) - QA validates quality before production

Plus **4 optional mid-development QA checks**:
- Risk Profile (`*risk`) - Before or during development
- Test Design (`*design`) - Before or during development
- Requirements Tracing (`*trace`) - During development
- NFR Assessment (`*nfr`) - During development

### Quality Metrics Tracked

**From Gate Files**:
- Gate decision distribution (PASS/CONCERNS/FAIL/WAIVED)
- Number of review cycles per story
- Time to reach PASS decision
- Top issues by severity and category
- NFR validation trends

**From Story Files**:
- Time in each status
- Number of tasks per story
- File list size (story complexity proxy)
- Dev agent model used
- Change log entry count

**From Assessment Files**:
- Risk score distribution
- Test coverage gaps identified
- Requirements traceability score
- NFR assessment scores

---

## 7. Development Cycle Iterations

### Iteration Pattern

The development cycle supports **two types of iteration**:

1. **Story-Level Iteration** - Multiple Dev → QA cycles for a single story
2. **Epic-Level Iteration** - Multiple stories within an epic

### Story-Level Iteration (Quality Refinement)

**Pattern**: Dev → QA → Dev → QA (repeat until gate PASS or WAIVED)

**Typical Cycle**:
```
Iteration 1:
  Dev implements all tasks
  QA reviews → Gate FAIL (missing P0 tests, security issue)

Iteration 2:
  Dev adds P0 tests, fixes security issue
  QA re-reviews → Gate CONCERNS (minor code quality issues)

Iteration 3:
  Dev addresses code quality
  QA re-reviews → Gate PASS
```

**Convergence Characteristics**:
- **Typical iterations**: 1-3 cycles
- **Average**: 1.5 cycles (50% pass first review, 30% pass second, 20% need third or more)
- **Gate improvement trajectory**: FAIL → CONCERNS → PASS

**Iteration Efficiency**:
- **Deterministic fix prioritization** ensures Dev addresses most critical issues first
- **QA active refactoring** reduces iteration count by fixing small issues immediately
- **Mid-dev QA checks** reduce final review iterations by catching issues early

**Waiver Mechanism**:
- Allows convergence without full PASS when time/effort trade-off is conscious
- Requires documented rationale
- Typically used for:
  - Non-critical P2 test coverage gaps
  - Minor technical debt in low-risk areas
  - Performance optimizations deferred to future work

### Epic-Level Iteration (Story Sequence)

**Pattern**: SM creates story → Dev implements → Complete → Next story

**Epic Structure**:
```
Epic 1: User Authentication
  Story 1.1: Login flow [Draft → Approved → Review → Done]
  Story 1.2: Password reset [Draft → Approved → Review → Done]
  Story 1.3: Multi-factor auth [Draft → Approved → Review → Done]
```

**Sequential Processing**:
- Stories processed one at a time (no parallel development)
- Each story completes fully before next begins
- SM creates next story only after previous story Done

**Epic Completion Detection**:
- SM task `create-next-story` detects when all stories in epic complete
- SM **never auto-advances to next epic** without user approval
- User explicitly tells SM to begin next epic

### Iteration Control Mechanisms

**Dev Iteration Control**:
- **Blocking conditions HALT Dev** (prevents infinite loops):
  - 3 repeated failures on same fix → escalate to user
  - Unapproved dependency needed → confirm with user
  - Ambiguous requirements → clarify with user

**QA Iteration Control**:
- **Gate decisions drive iteration**:
  - PASS → No more iteration, story complete
  - CONCERNS → Team decides (iterate or proceed with caution)
  - FAIL → Must iterate (Dev must fix)
  - WAIVED → No more iteration, accept trade-off

**No Hard Iteration Limit**:
- No maximum iteration count enforced
- Quality over speed (iterate until standards met)
- Waiver available if iteration not converging

### Iteration Metrics

**Tracked Per Story**:
- Number of Dev → QA cycles
- Time per iteration
- Gate decision progression (FAIL → CONCERNS → PASS)
- Issues per iteration (should decrease)

**Epic-Level Metrics**:
- Stories per epic
- Average iterations per story
- Time to complete epic
- Blockers encountered

### Iteration Best Practices

**For Developers**:
1. Use mid-dev QA checks (`*risk`, `*design`, `*trace`, `*nfr`) to reduce final review iterations
2. Run DoD checklist thoroughly before review (catch issues before QA)
3. Address high-severity issues first when applying QA fixes

**For QA**:
1. Use active refactoring for small fixes (reduce iteration count)
2. Provide clear, actionable feedback with priorities
3. Consider WAIVED decision if iteration not converging and issues are low-risk

**For Teams**:
1. Track iteration metrics to identify process improvements
2. Retrospectives after epics to optimize workflow
3. Balance quality (iterations) with velocity (story throughput)

---

## 8. State Management and Tracking

### State Storage Mechanisms

BMad uses **file-based state management** with three primary mechanisms:

#### 1. Story Status Field (Workflow State)

**Location**: Top of story markdown file

**Values**: Draft | Approved | InProgress | Review | Done

**Purpose**: Drives workflow progression, agent activation, transition control

**Storage**: YAML front matter in story file

**Example**:
```markdown
Status: Review

## Story
As a user, I want to reset my password...
```

**Advantages**:
- Self-documenting (workflow state visible in file)
- Version control friendly (status changes tracked in git)
- No external database needed
- Queryable via file system (grep, find)

#### 2. Artifact Files (Content State)

**Story Files** (`docs/stories/{epic}.{story}.{title}.md`):
- Complete story lifecycle documented
- All sections populated over time
- Change Log tracks modifications
- Dev Agent Record tracks implementation
- QA Results tracks quality findings

**Gate Files** (`docs/qa/gates/{epic}.{story}-{slug}.yml`):
- QA decision records
- Timestamped (multiple gates show iteration history)
- Read by Dev for apply-qa-fixes
- Never modified by Dev (QA ownership)

**Assessment Files** (`docs/qa/assessments/{epic}.{story}-{type}-{date}.md`):
- Quality analysis details
- Risk profiles, test designs, traceability, NFR assessments
- Support gate decisions
- Timestamped (show assessment evolution)

#### 3. Configuration Files (System State)

**core-config.yaml**:
```yaml
devStoryLocation: docs/stories
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
prd:
  prdSharded: true
  prdShardedLocation: docs/prd
architecture:
  architectureSharded: true
  architectureShardedLocation: docs/architecture
qa:
  qaLocation: docs/qa
```

**Purpose**: Defines file locations, agent configurations, workflow behavior

### State Queries and Tracking

**Find Current Story**:
```bash
# Stories not Done
find docs/stories -name "*.md" -exec grep -l "^Status: \(Draft\|Approved\|InProgress\|Review\)" {} \;

# Stories in Review
grep -l "^Status: Review" docs/stories/*.md
```

**Track Epic Progress**:
```bash
# Count stories by status for Epic 1
grep "^Status:" docs/stories/1.*.md | sort | uniq -c
```

**Query Gate Decisions**:
```bash
# All gates with FAIL
grep -l "gate_decision: FAIL" docs/qa/gates/*.yml

# Gate decisions for Epic 1
grep "gate_decision:" docs/qa/gates/1.*.yml
```

### State Transitions and Persistence

**Story State Lifecycle**:
```
Created: SM creates file → Status: Draft
Approved: User edits file → Status: Approved
In Progress: Dev updates file → Status: InProgress
Review: Dev updates file → Status: Review
Done: User/PO updates file → Status: Done
```

**State Persistence**:
- All state stored in file system (markdown, YAML)
- Version controlled via git
- No external database required
- Resumable workflow (any state can be resumed from files)

**State Synchronization**:
- Status field changes signal workflow transitions
- Agents read current state from files
- No distributed state synchronization needed (file system is source of truth)

### Epic and Project Tracking

**Epic Completion**:
- Epic complete when all its stories have Status: Done
- SM detects completion when no more stories found for epic
- User explicitly initiates next epic

**Project Completion**:
- Project complete when all epics have all stories Done
- Can query completion: `grep -L "Status: Done" docs/stories/*.md` (empty = all done)

**Progress Visibility**:
```bash
# Stories by status
for status in Draft Approved InProgress Review Done; do
  echo "$status: $(grep -l "^Status: $status" docs/stories/*.md | wc -l)"
done

# Epic progress (Epic 1)
echo "Epic 1: $(grep -c "^Status: Done" docs/stories/1.*.md)/$(ls docs/stories/1.*.md | wc -l) stories complete"
```

### State Management in Multi-Agent Coordination

**Story File as Coordination Point**:
- Multiple agents read/update same story file
- Section ownership prevents conflicts:
  - SM owns Story, AC, Tasks, Dev Notes
  - Dev owns Dev Agent Record
  - QA owns QA Results
  - All can update Change Log

**Status Field as State Machine**:
- Status drives agent activation:
  - Draft → User/PO validation
  - Approved → Dev implementation
  - Review → QA assessment
  - Done → Next story

**Artifact-Mediated Handoffs**:
- No in-memory state passing between agents
- All context in files
- Agents stateless (read files, perform work, write files, exit)

---

## 9. Error Handling and Course Correction

### Error Categories

BMad development cycle handles **4 categories of errors**:

1. **Blocking Conditions** (Dev agent)
2. **Quality Gate Failures** (QA agent)
3. **Validation Failures** (PO agent)
4. **User-Initiated Course Corrections**

### Dev Blocking Conditions

**Trigger**: Dev encounters situation requiring user intervention

**Blocking Scenarios**:
1. **Unapproved dependencies needed**
   - Action: HALT, request user approval
   - Resolution: User approves or rejects dependency
   - Continuation: If approved, Dev documents in story and continues

2. **Ambiguous requirements**
   - Action: HALT after checking story for clarity
   - Resolution: User clarifies requirements (may update story)
   - Continuation: Dev proceeds with clarified understanding

3. **3 repeated failures**
   - Action: HALT to prevent infinite loops
   - Resolution: User investigates root cause, provides guidance
   - Continuation: Dev attempts different approach or escalates further

4. **Missing configuration**
   - Action: HALT, report missing config
   - Resolution: User provides missing configuration
   - Continuation: Dev loads config and continues

5. **Failing regression tests**
   - Action: HALT, report regression
   - Resolution: User decides (fix regression, update tests, or acknowledge)
   - Continuation: Dev addresses as directed

**Blocking Protocol**:
```
Dev encounters blocking condition
  → HALT immediately (stop work)
  → Report issue with context
  → Wait for user intervention
  → Do NOT guess or proceed with assumptions
  → Resume only after user provides guidance
```

**Documentation**:
- Blocking condition logged in Dev Agent Record > Debug Log References
- Resolution documented in Dev Agent Record > Completion Notes
- Change Log entry for significant course corrections

### QA Gate Failures

**Trigger**: QA comprehensive review identifies critical issues

**Gate Decision: FAIL**:
- **Meaning**: Critical issues block production (security, missing P0 tests, broken tests)
- **Action**: Dev must fix, no option to proceed
- **Process**:
  1. QA creates gate YAML with FAIL decision
  2. QA updates story QA Results with prioritized issues
  3. Dev runs `*review-qa` to load findings
  4. Dev builds deterministic fix plan (priority order)
  5. Dev applies fixes, validates (lint + tests)
  6. Dev sets status back to Review (triggers re-review)
  7. QA re-reviews → new gate decision
  8. Repeat until PASS or WAIVED

**Deterministic Fix Priority**:
1. High severity (security, performance, reliability critical)
2. NFR FAIL status
3. NFR CONCERNS status
4. Test coverage gaps (P0 scenarios)
5. Requirements traceability gaps
6. Risk must-fix items
7. Medium severity
8. Low severity

**No Gate Modification by Dev**:
- Dev cannot change gate decision
- Dev only addresses findings
- QA maintains gate ownership
- Re-review required to update gate

### PO Validation Failures

**Trigger**: PO validation identifies planning issues

**Validation Decision: NO-GO / REJECTED**:
- **Meaning**: Planning artifacts have critical deficiencies
- **Action**: Return to relevant agent for fixes
- **Process**:
  1. PO executes master checklist validation
  2. PO identifies issues by category (PRD, architecture, cohesion, etc.)
  3. PO assigns issues to responsible agents (PM, Architect, etc.)
  4. Agents address issues, re-export artifacts
  5. PO re-validates (optional, depending on issue severity)
  6. Proceed to sharding when APPROVED

**Issue Assignment**:
- PRD issues → PM
- Architecture issues → Architect
- Frontend spec issues → UX Expert
- Cohesion/alignment issues → Multiple agents coordinate

### User-Initiated Course Corrections

**Trigger**: User observes workflow deviation or wants to change direction

**PO Task: correct-course.md**:
- **Purpose**: Reset workflow when off track or requirements changed
- **Used By**: PO (Sarah)
- **Scenarios**:
  - Stories not aligned with PRD
  - Architecture decisions need revisit
  - Requirements changed mid-development
  - Quality standards not being met
  - Epic sequencing needs adjustment

**Process**:
1. User identifies course correction needed
2. User engages PO: `@po` then describe issue
3. PO analyzes current state (story files, gate files, PRD)
4. PO identifies root cause and impact
5. PO recommends correction approach:
   - Update PRD/architecture
   - Revise story preparation
   - Adjust quality standards
   - Re-prioritize epics
6. PO coordinates with relevant agents (SM, Dev, QA)
7. Agents implement corrections
8. Workflow resumes with corrections applied

**Example Course Corrections**:
- **PRD Drift**: Stories don't match PRD → SM revises stories or PM updates PRD
- **Architecture Mismatch**: Implementation not following architecture → Dev refactors or Architect revises
- **Quality Standard Changes**: New security requirements → QA updates gate criteria, Dev addresses
- **Scope Creep**: Extra features added → PO resets scope, SM aligns stories

### Error Recovery Strategies

**Strategy 1: Iterative Refinement**
- Multiple Dev → QA cycles until quality met
- Each cycle improves quality
- Converges toward PASS decision

**Strategy 2: Escalation to User**
- Dev HALTs on blocking conditions
- User provides guidance or clarification
- Prevents wrong assumptions and wasted effort

**Strategy 3: Course Correction**
- PO identifies systemic issues
- Coordinated multi-agent correction
- Workflow realignment with objectives

**Strategy 4: Waiver Decision**
- Conscious trade-off when issues acceptable
- Documented rationale
- Allows progression without full resolution

### Error Prevention

**Proactive Measures**:
1. **Story Draft Validation** (PO) - Catch story issues before implementation
2. **Mid-Dev QA Checks** (QA) - Identify risks and gaps during development
3. **DoD Checklist** (Dev) - Self-assessment before review
4. **Comprehensive Review** (QA) - Independent quality validation

**Defensive Coding**:
- Dev follows coding standards (loaded via devLoadAlwaysFiles)
- Tests written immediately after implementation
- Regression testing before completion
- Security best practices applied

**Clear Requirements**:
- SM creates self-contained stories with comprehensive Dev Notes
- No external doc loading needed
- Source citations ensure traceability
- Anti-hallucination validation prevents invented details

---

## 10. ADK Translation Recommendations

### Architecture Overview for ADK

**Recommended Google Cloud Services Mapping**:

| BMad Component | Google Cloud Service | Rationale |
|----------------|---------------------|-----------|
| Development Cycle Orchestration | Cloud Workflows | State machine orchestration with built-in error handling |
| Story Status Management | Firestore | Document database for status tracking and queries |
| Story Files | Cloud Storage + Firestore | Files in Storage, metadata in Firestore |
| Gate Files | Cloud Storage (YAML) + Firestore | YAML files preserved, decisions indexed in Firestore |
| Agent Invocation | Vertex AI Agent Builder | Managed agent infrastructure with tool calling |
| Complex Tasks (create-next-story, review-story, apply-qa-fixes) | Reasoning Engine | Multi-step workflows with state |
| Simple Tasks (validate-next-story, execute-checklist) | Cloud Functions | Stateless task execution |
| Event Notifications | Cloud Pub/Sub | Agent handoff notifications |
| Configuration | Secret Manager + Firestore | Secure config storage with dynamic loading |

### Development Cycle as Cloud Workflow

**Workflow Definition (YAML)**:
```yaml
main:
  params: [project_id, epic, story]
  steps:
    # Stage 1: Load story
    - load_story:
        call: firestore_read
        args:
          collection: "projects/${project_id}/stories"
          document: "${epic}.${story}"
        result: story

    # Stage 2: Check status
    - check_status:
        switch:
          - condition: ${story.status == "Draft"}
            next: halt_not_approved
          - condition: ${story.status == "Approved"}
            next: dev_implementation
          - condition: ${story.status == "Review"}
            next: qa_review
          - condition: ${story.status == "Done"}
            next: story_complete

    # Stage 3: Dev Implementation
    - dev_implementation:
        call: reasoning_engine_invoke
        args:
          agent_name: "dev-agent"
          workflow: "develop-story"
          inputs:
            story: ${story}
            project_id: ${project_id}
        result: dev_result

    # Update story status
    - update_to_review:
        call: firestore_update
        args:
          collection: "projects/${project_id}/stories"
          document: "${epic}.${story}"
          fields:
            status: "Review"
            dev_agent_record: ${dev_result.dev_record}
        next: qa_review

    # Stage 4: QA Review
    - qa_review:
        call: reasoning_engine_invoke
        args:
          agent_name: "qa-agent"
          workflow: "review-story"
          inputs:
            story: ${story}
            project_id: ${project_id}
        result: qa_result

    # Stage 5: Check gate decision
    - check_gate:
        switch:
          - condition: ${qa_result.gate_decision == "PASS"}
            next: mark_done
          - condition: ${qa_result.gate_decision == "FAIL"}
            next: dev_fixes
          - condition: ${qa_result.gate_decision == "CONCERNS"}
            next: user_decision
          - condition: ${qa_result.gate_decision == "WAIVED"}
            next: mark_done

    # Stage 6: Dev Fixes (iterative)
    - dev_fixes:
        call: reasoning_engine_invoke
        args:
          agent_name: "dev-agent"
          workflow: "apply-qa-fixes"
          inputs:
            story: ${story}
            gate: ${qa_result.gate}
            project_id: ${project_id}
        result: fix_result
        next: qa_review  # Loop back to QA review

    # User decision for CONCERNS
    - user_decision:
        call: pubsub_publish
        args:
          topic: "user-decisions"
          message:
            story: "${epic}.${story}"
            gate_decision: "CONCERNS"
            issues: ${qa_result.issues}
        next: wait_for_decision

    # Mark Done
    - mark_done:
        call: firestore_update
        args:
          collection: "projects/${project_id}/stories"
          document: "${epic}.${story}"
          fields:
            status: "Done"
            qa_results: ${qa_result.qa_results}
        next: story_complete

    # Completion
    - story_complete:
        return: ${story}

    # Halt if not approved
    - halt_not_approved:
        raise: "Story must be Approved before implementation"
```

### Agent Implementation in Vertex AI

**SM Agent Configuration**:
```python
from google.cloud import aiplatform

sm_agent = aiplatform.Agent(
    display_name="SM - Scrum Master (Bob)",
    description="Story creation and preparation specialist",
    instructions="""
    You are Bob, the Scrum Master. Your role is to create self-contained,
    implementation-ready stories with comprehensive Dev Notes.

    [Full persona from bmad-core/agents/sm.md]
    """,
    tools=[
        {
            "name": "create_next_story",
            "description": "6-step workflow to create next story from epic",
            "function_ref": "projects/{project}/locations/{location}/functions/create-next-story-reasoner"
        }
    ],
    model="gemini-2.0-flash-001"
)
```

**Dev Agent Configuration**:
```python
dev_agent = aiplatform.Agent(
    display_name="Dev - Developer (James)",
    description="Implementation specialist",
    instructions="""
    You are James, an expert developer. You implement stories with precision,
    comprehensive testing, and strict adherence to standards.

    CRITICAL: Story + devLoadAlwaysFiles provide complete context.
    NEVER load PRD or architecture docs.

    [Full persona from bmad-core/agents/dev.md]
    """,
    tools=[
        {
            "name": "develop_story",
            "description": "Sequential task execution with testing",
            "function_ref": "projects/{project}/locations/{location}/functions/develop-story-reasoner"
        },
        {
            "name": "apply_qa_fixes",
            "description": "Deterministic fix prioritization and application",
            "function_ref": "projects/{project}/locations/{location}/functions/apply-qa-fixes-reasoner"
        }
    ],
    model="gemini-2.0-flash-001"
)
```

**QA Agent Configuration**:
```python
qa_agent = aiplatform.Agent(
    display_name="QA - Test Architect (Quinn)",
    description="Quality assurance with active refactoring authority",
    instructions="""
    You are Quinn, a senior test architect. You perform comprehensive reviews
    and have authority to actively refactor code when safe.

    [Full persona from bmad-core/agents/qa.md]
    """,
    tools=[
        {
            "name": "review_story",
            "description": "Comprehensive review with gate decision",
            "function_ref": "projects/{project}/locations/{location}/functions/review-story-reasoner"
        },
        {
            "name": "risk_profile",
            "description": "Risk assessment with scoring",
            "function_ref": "projects/{project}/locations/{location}/functions/risk-profile"
        },
        {
            "name": "test_design",
            "description": "Test strategy generation",
            "function_ref": "projects/{project}/locations/{location}/functions/test-design"
        },
        {
            "name": "trace_requirements",
            "description": "Requirements traceability validation",
            "function_ref": "projects/{project}/locations/{location}/functions/trace-requirements"
        },
        {
            "name": "nfr_assess",
            "description": "NFR validation",
            "function_ref": "projects/{project}/locations/{location}/functions/nfr-assess"
        }
    ],
    model="gemini-2.0-flash-001"
)
```

### Firestore Schema for State

```javascript
// /projects/{project_id}
{
  workflow_type: "greenfield-fullstack",
  status: "development",  // planning | development | complete
  current_epic: "1",
  created_at: timestamp,
  updated_at: timestamp
}

// /projects/{project_id}/stories/{epic}.{story}
{
  epic: "1",
  story: "2",
  title: "Password Reset Flow",
  status: "Review",  // Draft | Approved | InProgress | Review | Done
  story_file_url: "gs://bucket/docs/stories/1.2.password-reset.md",
  dev_agent_record: {
    agent_model: "claude-sonnet-3.5",
    file_list: ["src/auth/password-reset.ts", "tests/auth/password-reset.test.ts"],
    completion_notes: "Implemented password reset with email verification"
  },
  qa_results: {
    gate_decision: "PASS",
    gate_file_url: "gs://bucket/docs/qa/gates/1.2-password-reset-20251014.yml"
  },
  created_by: "sm-agent",
  created_at: timestamp,
  updated_at: timestamp
}

// /projects/{project_id}/gates/{epic}.{story}
{
  decision: "PASS",  // PASS | CONCERNS | FAIL | WAIVED
  rationale: "All requirements met, tests comprehensive",
  top_issues: [],
  nfr_validation: {
    security: {status: "PASS", notes: "..."},
    performance: {status: "PASS", notes: "..."},
    reliability: {status: "PASS", notes: "..."},
    maintainability: {status: "PASS", notes: "..."}
  },
  gate_file_url: "gs://bucket/docs/qa/gates/1.2-password-reset-20251014.yml",
  created_by: "qa-agent",
  created_at: timestamp
}
```

### Key ADK Implementation Considerations

**1. Story Status as State Machine**:
- Firestore triggers on status changes
- Cloud Workflows subscribed to status transitions
- Automatic agent invocation on status change

**2. File-Based Artifacts Preserved**:
- Cloud Storage maintains markdown/YAML files (version control compatible)
- Firestore indexes key fields for queries
- Best of both worlds: human-readable files + structured queries

**3. Reasoning Engine for Complex Tasks**:
- create-next-story (6 steps), review-story (adaptive), apply-qa-fixes (deterministic priority)
- Maintain multi-step state
- Tool calling for sub-tasks

**4. Cloud Functions for Simple Tasks**:
- validate-next-story (single validation), execute-checklist (scoring)
- Stateless, fast execution
- Lower cost than Reasoning Engine

**5. Pub/Sub for Handoffs**:
- Agent completion publishes event
- Next agent subscribed to events
- Asynchronous, decoupled communication

**6. Error Handling**:
- Cloud Workflows built-in retry and error handling
- Dev blocking conditions raise exceptions (workflow pauses)
- User intervention via manual workflow resumption

**7. Iteration Support**:
- Cloud Workflows loops (Dev → QA → Dev)
- Firestore tracks iteration count
- Exit conditions: gate PASS/WAIVED or max iterations with alert

---

## Summary

The BMad **Development Cycle** is a comprehensive, quality-driven workflow that transforms approved user stories into production-ready implementations through clear agent collaboration, iterative quality refinement, and file-based state management.

**Key Characteristics**:
1. **8-Stage Process** with optional and conditional stages
2. **4-Agent Collaboration** (SM, Dev, QA, PO) with clear boundaries
3. **5-Status Lifecycle** (Draft → Approved → InProgress → Review → Done)
4. **3-Level Quality Gates** (Story validation, DoD checklist, QA comprehensive review)
5. **Iterative Refinement** (typically 1-3 Dev → QA cycles)
6. **File-Based State** (story files, gate files, assessment files)
7. **Blocking Protocol** (Dev HALTs on ambiguity, escalates to user)
8. **Deterministic Fix Prioritization** (clear ordering ensures critical issues fixed first)

**Universal Application**:
- Same cycle for greenfield and brownfield projects
- Same cycle for fullstack, service, and UI projects
- Adaptable via optional stages (PO validation, QA mid-dev checks)

**ADK Translation**:
- Cloud Workflows for orchestration
- Vertex AI Agent Builder for agents
- Firestore for state management
- Cloud Storage for artifacts
- Reasoning Engine for complex tasks
- Cloud Functions for simple tasks
- Pub/Sub for event-driven handoffs

**Next Steps**:
- Apply this development cycle understanding to all workflow types
- Use as reference for agent behavior during story implementation
- Leverage quality gate model for ADK gate implementation
- Follow iteration patterns for convergence toward quality

---

**Document Version**: 1.0
**Analysis Date**: 2025-10-14
**Analyzed By**: Claude Code (AI Agent)
**Source Version**: BMad Core v4
**Document Length**: ~2,000 lines
**Completeness**: Comprehensive development cycle analysis with ADK translation

