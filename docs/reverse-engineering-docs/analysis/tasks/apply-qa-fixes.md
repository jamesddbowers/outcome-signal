# Task Analysis: apply-qa-fixes

**Task ID**: `apply-qa-fixes`
**Task File**: `.bmad-core/tasks/apply-qa-fixes.md`
**Primary Agent**: Dev (James)
**Task Type**: Complex Multi-Step Workflow (6 Steps)
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: Medium-High (Requires QA output parsing, prioritization logic, code changes, validation)

---

## 1. Purpose & Scope

### Primary Purpose
Systematically implement fixes based on QA review results (gate and assessments) for a specific story. This task enables the Dev agent to consume QA outputs, create a prioritized fix plan, apply targeted changes, and prepare the story for re-review or completion.

### Scope Definition

**In Scope**:
- Reading and parsing QA outputs (gate YAML + assessment markdowns)
- Building deterministic, priority-ordered fix plans
- Implementing code and test changes to address QA findings
- Running validations (lint, tests) until clean
- Updating allowed story sections (Dev Agent Record, File List, Change Log, Status)
- Setting story status based on completion state

**Out of Scope**:
- Modifying QA artifacts (gate files, assessment files) - QA agent ownership only
- Updating non-Dev sections of story (QA Results, Acceptance Criteria, Testing, Story sections)
- Rerunning QA reviews (Dev signals readiness via Status field for QA to re-review)
- Architectural changes or large-scale refactoring
- Changes outside the story scope

### Key Characteristics
- **Deterministic prioritization** - Fixed priority order ensures critical issues addressed first
- **Risk-first approach** - High severity and NFR failures take precedence
- **Minimal changes philosophy** - Targeted fixes that close gaps without over-engineering
- **Strict permission model** - Dev can only update specific story sections
- **Validation-gated** - All changes must pass lint and tests before story update
- **Status-driven workflow** - Status field signals completion state to QA

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_id: '{epic}.{story}'        # e.g., "2.2"
  - qa_root: from core-config.yaml    # Key: qa.qaLocation (e.g., "docs/project/qa")
  - story_root: from core-config.yaml # Key: devStoryLocation (e.g., "docs/project/stories")

optional:
  - story_title: '{title}'            # Derive from story H1 if missing
  - story_slug: '{slug}'              # Derive from title (lowercase, hyphenated) if missing
```

**Input Details**:
- **story_id**: Numeric identifier in format `{epic}.{story}` (e.g., "2.2" = Epic 2, Story 2)
- **qa_root**: Base directory for QA artifacts, resolved from `core-config.yaml` → `qa.qaLocation`
- **story_root**: Directory containing story files, resolved from `core-config.yaml` → `devStoryLocation`
- **story_title**: Human-readable story title (fallback: extract from story file's H1 heading)
- **story_slug**: URL-safe identifier (fallback: derive from title by lowercasing and hyphenating)

### QA Artifact Inputs (Read from File System)

**Gate File (YAML)** - Primary source of QA decisions:
- **Location**: `{qa_root}/gates/{epic}.{story}-*.yml`
- **Selection Rule**: If multiple exist, use most recent by modified time
- **Key Fields**:
  - `gate`: PASS | CONCERNS | FAIL | WAIVED
  - `top_issues[]`: Array of findings with `id`, `severity`, `finding`, `suggested_action`
  - `nfr_validation`: Object with status (PASS/CONCERNS/FAIL) for security/performance/reliability/maintainability
  - `trace`: Coverage summary and gaps
  - `test_design.coverage_gaps[]`: Array of uncovered scenarios
  - `risk_summary.recommendations.must_fix[]`: Critical risk-based recommendations (if present)

**Assessment Files (Markdown)** - Detailed QA analysis:
- **Test Design**: `{qa_root}/assessments/{epic}.{story}-test-design-*.md`
  - Test scenarios, coverage analysis, gap identification
- **Traceability**: `{qa_root}/assessments/{epic}.{story}-trace-*.md`
  - Requirements-to-test mapping, uncovered ACs
- **Risk Profile**: `{qa_root}/assessments/{epic}.{story}-risk-*.md`
  - Risk categories, severity scores, mitigation recommendations
- **NFR Assessment**: `{qa_root}/assessments/{epic}.{story}-nfr-*.md`
  - Security/performance/reliability/maintainability validation results

### Configuration Dependencies

From `core-config.yaml`:
- `qa.qaLocation`: Base directory for QA outputs (required)
- `devStoryLocation`: Directory containing story files (required)

### Story File Structure (Input Source)

The story markdown file must exist at `{story_root}/{epic}.{story}.*.md` and contains:
- **Acceptance Criteria** - Requirements to satisfy
- **Tasks/Subtasks** - Implementation checklist
- **Dev Agent Record** - Dev's working area (updateable by Dev)
- **QA Results** - QA findings (read-only for Dev)
- **Status** - Current story state (updateable by Dev under specific conditions)

### Prerequisites

**Runtime Requirements**:
- Repository builds and runs locally (Deno 2 environment)
- Lint command available: `deno lint`
- Test command available: `deno test -A`
- Git repository (optional, but recommended for change tracking)

---

## 3. Execution Flow

### High-Level Process (6 Sequential Steps)

```
Step 0: Load Core Config & Locate Story
  ↓
Step 1: Collect QA Findings
  ↓
Step 2: Build Deterministic Fix Plan
  ↓
Step 3: Apply Changes
  ↓
Step 4: Validate
  ↓
Step 5: Update Story (Allowed Sections ONLY)
  ↓
Step 6: Do NOT Edit Gate Files (Advisory)
```

**Critical Rule**: Do not skip steps. Each step builds on the previous step's outputs.

---

### Step 0: Load Core Config & Locate Story

**Purpose**: Establish working context and verify prerequisites.

**Process**:
1. Read `.bmad-core/core-config.yaml`
2. Resolve configuration values:
   - `qa_root` from `qa.qaLocation`
   - `story_root` from `devStoryLocation`
3. Locate story file at `{story_root}/{epic}.{story}.*.md`
   - Use glob pattern to find story file (allows for title suffix in filename)
   - Example: `docs/stories/2.2-implement-navigation.md`

**Outputs**:
- `qa_root`: Absolute or relative path to QA directory
- `story_root`: Absolute or relative path to stories directory
- `story_path`: Full path to story file

**Blocking Conditions**:
- **Missing `.bmad-core/core-config.yaml`**: HALT and inform user that core config is required
- **Story file not found**: HALT and ask user for correct story_id or path
- **Missing required config keys**: HALT and request user to add `qa.qaLocation` and `devStoryLocation` to config

**Error Handling**:
```
IF core-config.yaml missing THEN
  HALT with message: "Missing .bmad-core/core-config.yaml - cannot proceed"

IF story_id provided BUT story file not found THEN
  HALT with message: "Story file for {story_id} not found at {story_root}/{epic}.{story}.*.md"
  Suggest: "Please verify story_id or check devStoryLocation in core-config.yaml"

IF qa.qaLocation not in config THEN
  HALT with message: "qa.qaLocation not configured in core-config.yaml"
```

---

### Step 1: Collect QA Findings

**Purpose**: Parse all QA outputs to build comprehensive understanding of issues and gaps.

**Process**:

#### 1A. Parse Latest Gate YAML

**Location**: `{qa_root}/gates/{epic}.{story}-*.yml`

**Selection Logic**:
```
files = glob('{qa_root}/gates/{epic}.{story}-*.yml')
IF files.length == 0 THEN
  gate_file = null
ELSE IF files.length == 1 THEN
  gate_file = files[0]
ELSE
  gate_file = files.sort_by_modified_time().last()  # Most recent
```

**Extract Key Fields**:

```yaml
gate_decision:
  value: PASS | CONCERNS | FAIL | WAIVED

top_issues:
  - id: string              # e.g., "SEC-1", "PERF-1"
    severity: HIGH | MEDIUM | LOW
    finding: string         # Description of issue
    suggested_action: string # Recommendation for fix

nfr_validation:
  security:
    status: PASS | CONCERNS | FAIL
    notes: string
  performance:
    status: PASS | CONCERNS | FAIL
    notes: string
  reliability:
    status: PASS | CONCERNS | FAIL
    notes: string
  maintainability:
    status: PASS | CONCERNS | FAIL
    notes: string

trace:
  coverage_summary: string
  gaps: string[]            # Uncovered acceptance criteria or requirements

test_design:
  coverage_gaps: string[]   # Uncovered scenarios or test gaps

risk_summary:
  recommendations:
    must_fix: string[]      # Critical risk-based fixes (if present)
```

**Parsing Notes**:
- Use YAML parser to read gate file
- If gate file missing, set all gate fields to null/empty
- Store parsed data in structured format for prioritization step

#### 1B. Read Assessment Markdowns (Optional but Recommended)

**Files to Check**:
1. **Test Design**: `{qa_root}/assessments/{epic}.{story}-test-design-*.md`
2. **Traceability**: `{qa_root}/assessments/{epic}.{story}-trace-*.md`
3. **Risk Profile**: `{qa_root}/assessments/{epic}.{story}-risk-*.md`
4. **NFR Assessment**: `{qa_root}/assessments/{epic}.{story}-nfr-*.md`

**Extraction Strategy**:
- Read markdown files if present (use most recent if multiple)
- Extract explicit gaps, recommendations, and findings
- Look for sections like:
  - "Coverage Gaps"
  - "Recommendations"
  - "Must Fix"
  - "Critical Issues"
  - "Uncovered Requirements"

**Purpose of Assessment Files**:
- Provide additional context beyond gate summary
- Offer detailed explanations of issues
- Include QA's reasoning and recommendations
- Help Dev understand "why" behind findings

**Outputs**:
- Structured collection of all QA findings
- Prioritized list of issues by severity
- List of coverage gaps by type (test design, traceability, NFR)
- Risk-based recommendations

**Blocking Conditions**:
```
IF gate_file == null AND all_assessment_files == [] THEN
  HALT with message: "No QA artifacts found for story {story_id}"
  Suggest: "Request QA to run *review-story to generate gate file"
  Alternative: "Proceed only if user provides explicit fix list"
```

---

### Step 2: Build Deterministic Fix Plan (Priority Order)

**Purpose**: Create a prioritized, risk-first fix plan from QA findings.

**Prioritization Algorithm** (Apply in order, highest priority first):

```
Priority 1: HIGH SEVERITY ISSUES
  Source: top_issues[] where severity == HIGH
  Focus: Security, performance, reliability, maintainability critical issues

Priority 2: NFR FAILURES
  Source: nfr_validation where status == FAIL
  Order: Security → Performance → Reliability → Maintainability

Priority 3: NFR CONCERNS
  Source: nfr_validation where status == CONCERNS
  Order: Security → Performance → Reliability → Maintainability

Priority 4: TEST DESIGN COVERAGE GAPS (P0 scenarios)
  Source: test_design.coverage_gaps[]
  Focus: P0 (critical) scenarios first if priority specified

Priority 5: TRACEABILITY GAPS (AC-level)
  Source: trace.gaps[]
  Focus: Uncovered acceptance criteria

Priority 6: RISK MUST-FIX RECOMMENDATIONS
  Source: risk_summary.recommendations.must_fix[]
  Focus: Critical risk mitigation actions

Priority 7: MEDIUM SEVERITY ISSUES
  Source: top_issues[] where severity == MEDIUM

Priority 8: LOW SEVERITY ISSUES
  Source: top_issues[] where severity == LOW
```

**Fix Plan Structure**:

```yaml
fix_plan:
  - priority: 1
    category: HIGH_SEVERITY
    issue_id: SEC-1
    description: "SQL injection vulnerability in user query"
    suggested_action: "Use parameterized queries for all user inputs"
    source: top_issues

  - priority: 2
    category: NFR_FAIL
    nfr_type: security
    description: "Input validation missing for email field"
    suggested_action: "Add email format validation and sanitization"
    source: nfr_validation.security

  - priority: 4
    category: COVERAGE_GAP
    gap_type: test_design
    description: "Back action behavior untested (AC2)"
    suggested_action: "Add test ensuring Toolkit Menu 'Back' returns to Main Menu"
    source: test_design.coverage_gaps
```

**Guidance for Fix Implementation**:
- **Prefer tests with code changes** - Add tests that validate fixes
- **Minimal, targeted changes** - Don't over-engineer solutions
- **Follow project architecture** - Respect existing patterns and conventions
- **TS/Deno rules compliance** - Follow project's TypeScript and Deno standards
- **Test-first approach** - Write tests before or alongside code fixes

**Outputs**:
- Ordered list of fixes with priority, category, description, suggested action
- Estimated effort per fix (optional)
- Dependencies between fixes (if any)

---

### Step 3: Apply Changes

**Purpose**: Implement fixes according to the prioritized fix plan.

**Process**:

#### 3A. Implement Code Fixes

**For Each Fix in Fix Plan** (in priority order):

1. **Locate affected code**
   - Use file paths from QA findings or story File List
   - Search codebase for relevant functions/modules

2. **Implement minimal, targeted fix**
   - Follow suggested_action from fix plan
   - Respect existing code patterns and architecture
   - Keep changes focused on the specific issue

3. **Follow project conventions**
   - **Centralized imports**: Use `deps.ts` for third-party imports (see `docs/project/typescript-rules.md`)
   - **DI boundaries**: Follow dependency injection patterns in `src/core/di.ts`
   - **Naming conventions**: Match existing naming patterns
   - **File organization**: Place new files in appropriate directories

**Example - Fixing Security Issue**:
```typescript
// BEFORE (vulnerable)
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;

// AFTER (fixed with parameterized query)
const query = sql`SELECT * FROM users WHERE email = ${userEmail}`;
```

#### 3B. Add Missing Tests

**Test Strategy**:
- **Unit tests first** - Cover individual functions and components
- **Integration tests where required** - Test interactions between modules (required by AC)
- **Close coverage gaps** - Address specific gaps identified by QA

**Test Implementation Order**:
1. **P0 coverage gaps** - Critical scenarios first
2. **Uncovered ACs** - Ensure all acceptance criteria have tests
3. **Edge cases** - Add tests for error conditions and boundaries
4. **Regression tests** - Ensure fixes don't break existing functionality

**Test File Conventions**:
- Place tests adjacent to source files: `module.test.ts` next to `module.ts`
- Or use test directory: `__tests__/module.test.ts`
- Follow project's test framework (e.g., Deno.test)

**Example - Adding Missing Test**:
```typescript
// Test for AC2: Back action returns to Main Menu
Deno.test("Toolkit Menu - Back action returns to Main Menu", async () => {
  const menu = new ToolkitMenu();
  await menu.navigate("submenu");
  await menu.back();

  assertEquals(menu.currentMenu, "main");
});
```

#### 3C. Update Documentation (if needed)

- Update inline code comments for complex logic
- Update README if public API changed
- Update architecture docs if patterns changed (rare - should escalate to user)

**Outputs**:
- Modified code files with fixes applied
- New or updated test files with coverage improvements
- Updated documentation (if applicable)

---

### Step 4: Validate

**Purpose**: Ensure all changes pass quality checks before updating story.

**Process**:

#### 4A. Run Linting

**Command**: `deno lint`

**Expected Output**: `0 problems`

**If Linting Fails**:
```
1. Review lint errors
2. Fix issues (prefer automatic fixes where available)
3. Rerun `deno lint`
4. Repeat until 0 problems
```

**Common Lint Issues**:
- Unused variables/imports
- Missing type annotations
- Formatting inconsistencies
- Deprecated API usage

#### 4B. Run All Tests

**Command**: `deno test -A`

**Expected Output**: All tests pass (0 failures)

**If Tests Fail**:
```
1. Identify failing tests
2. Debug root cause:
   - New test with incorrect assertion?
   - Fix introduced regression?
   - Environment/setup issue?
3. Fix code or test
4. Rerun `deno test -A`
5. Repeat until all tests pass
```

**Critical Testing Rules**:
- **Run full test suite** - Not just new tests
- **Verify regression** - Ensure existing tests still pass
- **Check test coverage** - Ensure coverage gaps are closed

#### 4C. Iteration Loop

**Loop Until Clean**:
```
WHILE (lint_errors > 0 OR test_failures > 0) DO
  IF lint_errors > 0 THEN
    Fix lint issues
    Run deno lint
  END IF

  IF test_failures > 0 THEN
    Debug and fix failing tests
    Run deno test -A
  END IF

  IF iterations > 10 THEN
    HALT and escalate to user: "Unable to achieve clean validation after 10 attempts"
  END IF
END WHILE
```

**Outputs**:
- Clean lint output (0 problems)
- Clean test output (all tests passing)
- Validation log for Dev Agent Record

**Blocking Conditions**:
- **Persistent lint errors** - After multiple fix attempts, escalate to user
- **Persistent test failures** - After multiple fix attempts, escalate to user
- **Cannot run commands** - If deno not installed or environment issue, escalate to user

---

### Step 5: Update Story (Allowed Sections ONLY)

**Purpose**: Document changes in story file while respecting Dev agent's limited permissions.

**CRITICAL PERMISSION MODEL**:

Dev agent is **ONLY authorized** to update these sections of the story file:

✅ **ALLOWED Updates**:
1. **Tasks / Subtasks Checkboxes** - Mark fix subtasks as done `[x]`
2. **Dev Agent Record** (entire section and all subsections):
   - Agent Model Used (if changed)
   - Debug Log References (commands/results, e.g., lint/tests)
   - Completion Notes List (what changed, why, how)
   - File List (all added/modified/deleted files)
3. **Change Log** - New dated entry describing applied fixes
4. **Status** - See Status Rule below

❌ **FORBIDDEN Updates** (DO NOT MODIFY):
- Story section
- Acceptance Criteria section
- Dev Notes section
- Testing section
- QA Results section
- Any other sections not explicitly listed above

#### 5A. Update Dev Agent Record

**Agent Model Used**:
```markdown
### Agent Model Used
- claude-sonnet-4.5-20250929 (or current model)
```

**Debug Log References**:
```markdown
### Debug Log References
- Applied QA fixes based on gate 2.2-navigation-20251014.yml
- Lint: `deno lint` - 0 problems
- Tests: `deno test -A` - 42 passed, 0 failed
- Fixed security issue SEC-1 (input validation)
- Closed coverage gap: Back action test (AC2)
```

**Completion Notes List**:
```markdown
### Completion Notes
- Fixed SQL injection vulnerability by using parameterized queries (SEC-1)
- Added input validation for email field (NFR security FAIL)
- Implemented test for Back action returning to Main Menu (AC2 coverage gap)
- Updated deps.ts with new validation library import
- All lint and tests passing
```

**File List** (CRITICAL - Must be complete):
```markdown
### File List
**Modified**:
- src/services/user-query.ts (parameterized queries)
- src/validation/email.ts (email validation)
- src/deps.ts (added validator import)
- tests/menu.test.ts (added Back action test)

**Added**:
- tests/validation/email.test.ts (new test file)

**Deleted**:
- (none)
```

#### 5B. Update Change Log

**Format**: Dated entry with summary of changes

```markdown
## Change Log

### 2025-10-14 - Applied QA Fixes
- Fixed security issues (SEC-1: SQL injection, NFR security validation)
- Closed test coverage gaps (AC2: Back action, AC4: Centralized deps)
- Added email validation with tests
- All lint and tests passing (0 problems, 42 tests passed)
- Ready for QA re-review
```

#### 5C. Update Tasks/Subtasks (if applicable)

If fix plan included subtasks in story's Tasks section, mark them complete:

```markdown
## Tasks
- [x] Implement navigation logic
- [x] Add Back action handler
- [x] Apply QA security fixes (NEW - marked complete)
- [x] Close coverage gaps with tests (NEW - marked complete)
```

#### 5D. Update Status (Status Rule)

**Status Rule** (Deterministic logic):

```
IF (gate_decision == PASS) AND (all_identified_gaps_closed) THEN
  Status = "Ready for Done"

ELSE
  Status = "Ready for Review"
  # Notify QA to re-run *review-story
```

**Status Definitions**:
- **Ready for Done**: Gate passed, all gaps closed, story complete
- **Ready for Review**: Fixes applied, QA needs to re-review to update gate

**Example Status Updates**:

```markdown
## Status
Status: Ready for Review

**Rationale**: Applied fixes for all HIGH severity issues and NFR failures. Closed test coverage gaps. Lint and tests passing. Requesting QA re-review to validate fixes and update gate decision.
```

Or:

```markdown
## Status
Status: Ready for Done

**Rationale**: Gate already showed PASS with minor concerns. All concerns addressed (coverage gaps closed, tests passing). Story meets Definition of Done.
```

**Outputs**:
- Updated story file with Dev Agent Record, File List, Change Log, Status
- Story ready for QA re-review or completion

---

### Step 6: Do NOT Edit Gate Files (Advisory)

**Purpose**: Clarify ownership boundaries between Dev and QA agents.

**Rule**: Dev agent **never modifies** gate YAML files or assessment markdown files.

**Rationale**:
- Gate files are QA agent's output and responsibility
- QA must validate that fixes actually resolve issues
- Dev signals readiness via story Status field
- QA re-runs `*review-story` to update gate based on new code state

**Workflow**:
```
1. Dev applies fixes → Updates story Status to "Ready for Review"
2. QA receives notification (via Status change)
3. QA re-runs *review-story
4. QA updates gate file with new decision (PASS/CONCERNS/FAIL)
5. If gate still shows CONCERNS/FAIL → Dev applies more fixes (repeat)
6. If gate shows PASS → QA updates story Status to "Ready for Done"
```

**Communication Protocol**:
- Dev uses story Status field to signal readiness
- Dev can add note in Change Log requesting QA re-review
- Dev does not directly notify QA (workflow is status-driven)

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Missing Core Config or Story File

**Trigger**: Step 0 - Cannot locate config or story file

**Decision Tree**:
```
IF .bmad-core/core-config.yaml missing THEN
  → HALT with error message
  → Request user to create core-config.yaml with required keys
  → EXIT task

ELSE IF story_id provided BUT story_file not found THEN
  → HALT with error message
  → Request user to verify story_id or check devStoryLocation config
  → EXIT task

ELSE
  → PROCEED to Step 1
```

**User Escalation Required**: Yes (blocking condition)

---

### Decision Point 2: No QA Artifacts Found

**Trigger**: Step 1 - No gate file or assessment files exist

**Decision Tree**:
```
IF gate_file missing AND all_assessment_files empty THEN
  → HALT with warning
  → Option 1: Request QA to run *review-story to generate gate
  → Option 2: Proceed with explicit fix list from user
  → ASK user: "No QA artifacts found. How should I proceed?"

  IF user provides fix list THEN
    → PROCEED to Step 2 with user-provided fixes
  ELSE IF user requests QA review THEN
    → EXIT task (wait for QA to generate artifacts)
  ELSE
    → EXIT task
```

**User Escalation Required**: Yes (blocking condition with options)

---

### Decision Point 3: Gate Decision vs Coverage Gaps

**Trigger**: Step 2 - Building fix plan based on gate decision

**Decision Tree**:
```
IF gate_decision == PASS THEN
  → Focus on minor coverage gaps and CONCERNS items
  → Target Status: "Ready for Done" after fixes

ELSE IF gate_decision == CONCERNS THEN
  → Focus on identified gaps and medium severity issues
  → Target Status: "Ready for Review" after fixes

ELSE IF gate_decision == FAIL THEN
  → Focus on HIGH severity issues, NFR failures, critical gaps
  → Target Status: "Ready for Review" after fixes

ELSE IF gate_decision == WAIVED THEN
  → No fixes required (QA explicitly waived issues)
  → Ask user: "Gate shows WAIVED. Proceed with any additional fixes?"
```

**User Escalation Required**: Only for WAIVED gates (clarification)

---

### Decision Point 4: Validation Failures After Multiple Attempts

**Trigger**: Step 4 - Lint or tests fail repeatedly

**Decision Tree**:
```
iteration_count = 0

WHILE (lint_errors > 0 OR test_failures > 0) DO
  iteration_count++

  IF iteration_count > 3 THEN
    → Analyze failure patterns

    IF failures consistent (same errors) THEN
      → Likely fix approach is incorrect
      → HALT and escalate to user with error details
      → Request guidance or clarification
      → EXIT task

    ELSE IF failures intermittent THEN
      → Likely environment or timing issue
      → HALT and escalate to user
      → Request environment check
      → EXIT task
  ELSE
    → Continue iteration (fix and rerun)
```

**User Escalation Required**: Yes (after 3 failed attempts)

---

### Decision Point 5: Status Field Update Logic

**Trigger**: Step 5 - Determining final story status

**Decision Tree**:
```
IF gate_decision == PASS AND all_coverage_gaps_closed THEN
  → Set Status: "Ready for Done"
  → Add rationale: "Gate passed, all gaps closed"

ELSE IF gate_decision in [CONCERNS, FAIL] THEN
  IF all_top_issues_addressed AND nfr_failures_resolved THEN
    → Set Status: "Ready for Review"
    → Add rationale: "Critical issues resolved, requesting QA re-review"
  ELSE
    → Set Status: "In Progress"
    → Add rationale: "Partial fixes applied, continuing work"

ELSE IF gate_decision == WAIVED THEN
  → Keep current status (typically "Ready for Review" or "Ready for Done")
  → Add note: "Gate waived, no fixes required"
```

**User Escalation Required**: No (deterministic logic)

---

## 5. User Interaction Points

### Interaction Point 1: Task Invocation

**Context**: User initiates apply-qa-fixes task

**User Command**:
```
*review-qa
```

**Agent Response**:
```
I'll apply fixes based on QA results for the story.

What is the story ID? (e.g., 2.2)
```

**User Input**: Story ID (e.g., "2.2")

**Alternative - User Provides Story ID Directly**:
```
*review-qa 2.2
```

**Agent Response**:
```
Applying QA fixes for story 2.2...
[Proceeds with execution]
```

---

### Interaction Point 2: Missing QA Artifacts

**Context**: No gate or assessment files found for story

**Agent Response**:
```
⚠️ No QA artifacts found for story 2.2.

I couldn't find:
- Gate file: docs/qa/gates/2.2-*.yml
- Assessment files: docs/qa/assessments/2.2-*.md

Options:
1. Request QA to run *review-story first
2. Provide explicit fix list to proceed without QA artifacts
3. Cancel task

How would you like to proceed?
```

**User Input Options**:
- Option 1: "Run QA review first" → Agent exits, user runs QA review
- Option 2: User provides fix list → Agent proceeds with user-provided fixes
- Option 3: "Cancel" → Agent exits task

---

### Interaction Point 3: Validation Failure Escalation

**Context**: Lint or tests fail after multiple fix attempts

**Agent Response**:
```
⚠️ Unable to achieve clean validation after 3 attempts.

Current issues:
- Lint: 2 problems (unused import, type mismatch)
- Tests: 1 failing (test/menu.test.ts - Back action assertion)

Issue details:
1. Type mismatch in src/services/user-query.ts:42
   Expected: string | null
   Got: string

2. Test failure: "Back action returns to Main Menu"
   Expected: "main"
   Got: undefined

I've attempted fixes but the issues persist. This may require:
- Clarification on expected behavior
- Environment or configuration adjustment
- Different fix approach

How would you like to proceed?
```

**User Input Options**:
- Provide guidance on fix approach
- Request specific change to code or test
- Request agent to try alternative approach
- Cancel task for manual intervention

---

### Interaction Point 4: Status Update Clarification (WAIVED gates)

**Context**: Gate shows WAIVED status

**Agent Response**:
```
ℹ️ Gate file shows status: WAIVED

This means QA has explicitly waived the identified issues. No fixes are required from a QA perspective.

Would you like me to:
1. Skip fixes and leave story as-is
2. Apply fixes anyway for completeness
3. Review specific issues to selectively fix

Your choice?
```

**User Input**: Selection (1, 2, or 3)

---

## 6. Output Specifications

### Output 1: Updated Story File

**Location**: `{story_root}/{epic}.{story}.*.md`

**Modified Sections**:
- Dev Agent Record (entire section)
- Tasks/Subtasks checkboxes (if applicable)
- Change Log (new dated entry)
- Status (updated based on Status Rule)

**Example Output**:

```markdown
## Dev Agent Record

### Agent Model Used
- claude-sonnet-4.5-20250929

### Debug Log References
- Applied QA fixes based on gate 2.2-navigation-20251014.yml
- Lint: `deno lint` - 0 problems
- Tests: `deno test -A` - 42 passed, 0 failed

### Completion Notes
- Fixed SQL injection vulnerability (SEC-1) with parameterized queries
- Added email input validation (NFR security FAIL)
- Closed coverage gap: Back action test (AC2)
- Closed coverage gap: Centralized deps enforcement test (AC4)
- All validations passing

### File List
**Modified**:
- src/services/user-query.ts
- src/validation/email.ts
- src/deps.ts
- tests/menu.test.ts

**Added**:
- tests/validation/email.test.ts

## Change Log

### 2025-10-14 - Applied QA Fixes
- Fixed security issues (SEC-1, NFR security validation)
- Closed test coverage gaps (AC2, AC4)
- All lint and tests passing (0 problems, 42 tests passed)
- Ready for QA re-review

## Status
Status: Ready for Review

**Rationale**: Applied fixes for all HIGH severity issues and NFR failures. Closed test coverage gaps. Lint and tests passing. Requesting QA re-review to validate fixes and update gate decision.
```

---

### Output 2: Modified Code Files

**Location**: Various (tracked in File List)

**Types of Changes**:
- **Bug fixes**: Code corrections for identified issues
- **Security fixes**: Parameterized queries, input validation, sanitization
- **Performance fixes**: Algorithm improvements, caching, optimization
- **Maintainability fixes**: Refactoring, documentation, code organization
- **Test additions**: New tests to close coverage gaps

**Example Code Changes**:

**Before** (src/services/user-query.ts):
```typescript
export function queryUser(email: string) {
  return db.query(`SELECT * FROM users WHERE email = '${email}'`);
}
```

**After** (src/services/user-query.ts):
```typescript
export function queryUser(email: string) {
  return db.query(sql`SELECT * FROM users WHERE email = ${email}`);
}
```

---

### Output 3: New/Modified Test Files

**Location**: Adjacent to source or in `__tests__/` directory

**Test File Example** (tests/menu.test.ts):

```typescript
import { assertEquals } from "@std/assert";
import { ToolkitMenu } from "../src/menu/toolkit-menu.ts";

Deno.test("Toolkit Menu - Back action returns to Main Menu", async () => {
  const menu = new ToolkitMenu();
  await menu.navigate("submenu");
  await menu.back();

  assertEquals(menu.currentMenu, "main");
});

Deno.test("Centralized dependencies - Service imports use deps.ts", () => {
  // Static test verifying imports go through deps.ts
  const serviceFile = Deno.readTextFileSync("src/services/user-query.ts");

  // Should NOT import directly from npm:
  assert(!serviceFile.includes('from "npm:'));

  // Should import from deps.ts:
  assert(serviceFile.includes('from "../deps.ts"'));
});
```

---

### Output 4: Validation Logs (Implicit)

**Location**: Terminal output (captured in Debug Log References)

**Lint Output**:
```bash
$ deno lint
0 problems
```

**Test Output**:
```bash
$ deno test -A
running 42 tests from 15 files
test Back action returns to Main Menu ... ok (5ms)
test Centralized dependencies enforcement ... ok (2ms)
[... 40 more tests ...]

test result: ok. 42 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (245ms)
```

---

## 7. Error Handling & Validation

### Error Category 1: Missing Prerequisites

**Error**: Missing `.bmad-core/core-config.yaml`

**Handling**:
```
HALT execution
Display: "Error: Missing .bmad-core/core-config.yaml"
Suggest: "Please create core-config.yaml with required keys: qa.qaLocation, devStoryLocation"
EXIT task
```

**User Action Required**: Create core-config.yaml file

---

**Error**: Story file not found for story_id

**Handling**:
```
HALT execution
Display: "Error: Story file not found for {story_id}"
Display: "Searched at: {story_root}/{epic}.{story}.*.md"
Suggest: "Verify story_id is correct or check devStoryLocation in core-config.yaml"
EXIT task
```

**User Action Required**: Verify story ID or fix config

---

### Error Category 2: No QA Artifacts

**Error**: No gate file or assessment files found

**Handling**:
```
HALT execution (with options)
Display: "Warning: No QA artifacts found for story {story_id}"
Display: "Searched for gate: {qa_root}/gates/{epic}.{story}-*.yml"
Offer options:
  1. Request QA to run *review-story
  2. Provide explicit fix list
  3. Cancel task
AWAIT user decision
```

**User Action Required**: Choose option (1, 2, or 3)

---

### Error Category 3: Validation Failures

**Error**: Lint failures after fixes

**Handling**:
```
IF iteration_count <= 3 THEN
  Analyze lint errors
  Apply automatic fixes where possible
  Rerun deno lint
  iteration_count++
ELSE
  HALT execution
  Display: "Error: Unable to resolve lint issues after 3 attempts"
  Display lint error details
  Request user guidance
  EXIT task
```

**User Action Required**: Provide guidance or manual fix

---

**Error**: Test failures after fixes

**Handling**:
```
IF iteration_count <= 3 THEN
  Analyze test failures
  Debug root cause
  Fix code or test
  Rerun deno test -A
  iteration_count++
ELSE
  HALT execution
  Display: "Error: Unable to resolve test failures after 3 attempts"
  Display test failure details and stack traces
  Request user guidance
  EXIT task
```

**User Action Required**: Provide guidance or manual fix

---

### Error Category 4: File System Errors

**Error**: Cannot write to story file

**Handling**:
```
HALT execution
Display: "Error: Cannot write to story file at {story_path}"
Display: "Permission denied or file locked"
Suggest: "Check file permissions or close file in editor"
EXIT task
```

**User Action Required**: Fix file permissions or close file

---

### Validation Rules

#### Validation 1: Story File Section Permissions

**Rule**: Dev can only update allowed sections

**Validation**:
```typescript
const ALLOWED_SECTIONS = [
  "Tasks",
  "Subtasks",
  "Dev Agent Record",
  "Change Log",
  "Status"
];

function validateSectionUpdate(section: string): boolean {
  return ALLOWED_SECTIONS.includes(section);
}
```

**If Validation Fails**:
```
Display warning: "Attempted to modify forbidden section: {section}"
Skip update for that section
Continue with other updates
```

---

#### Validation 2: File List Completeness

**Rule**: File List must include all modified files

**Validation**:
```bash
# Compare git status with story File List
git_changes = git status --short
story_files = parse_file_list_from_story()

missing_files = git_changes - story_files

IF missing_files.length > 0 THEN
  Display warning: "File List incomplete. Missing: {missing_files}"
  Automatically add missing files to File List
  Update story
```

---

#### Validation 3: Status Field Format

**Rule**: Status must be one of: "In Progress", "Ready for Review", "Ready for Done"

**Validation**:
```typescript
const VALID_STATUSES = [
  "In Progress",
  "Ready for Review",
  "Ready for Done"
];

function validateStatus(status: string): boolean {
  return VALID_STATUSES.includes(status);
}
```

**If Validation Fails**:
```
Display warning: "Invalid status: {status}"
Default to: "Ready for Review"
```

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**None** - This is a terminal task (calls no other tasks)

### File Dependencies

#### Core Configuration Files

**`.bmad-core/core-config.yaml`** (Required):
- Keys: `qa.qaLocation`, `devStoryLocation`
- Purpose: Resolve paths to QA artifacts and story files

**Story File** (Required):
- Location: `{devStoryLocation}/{epic}.{story}.*.md`
- Purpose: Source of ACs, tasks, and target for updates

**Gate File** (Optional but Expected):
- Location: `{qa.qaLocation}/gates/{epic}.{story}-*.yml`
- Purpose: Primary source of QA findings and decisions

**Assessment Files** (Optional):
- Locations:
  - `{qa.qaLocation}/assessments/{epic}.{story}-test-design-*.md`
  - `{qa.qaLocation}/assessments/{epic}.{story}-trace-*.md`
  - `{qa.qaLocation}/assessments/{epic}.{story}-risk-*.md`
  - `{qa.qaLocation}/assessments/{epic}.{story}-nfr-*.md`
- Purpose: Detailed QA analysis and recommendations

#### Project-Specific Files (Referenced)

**`docs/project/typescript-rules.md`** (Optional):
- Purpose: TypeScript and Deno coding standards
- Referenced in: Step 3A (Follow project conventions)

**`src/core/di.ts`** (Optional):
- Purpose: Dependency injection patterns
- Referenced in: Step 3A (Follow DI boundaries)

**`deps.ts`** (Project Convention):
- Purpose: Centralized third-party imports
- Referenced in: Step 3A (Keep imports centralized)

### Runtime Prerequisites

**Deno 2** (Required):
- Purpose: Run lint and tests
- Commands: `deno lint`, `deno test -A`

**Git** (Optional but Recommended):
- Purpose: Track changes, identify modified files
- Commands: `git status`, `git diff`

**Text Editor/IDE** (Implicit):
- Purpose: Code editing during fix application
- Note: Agent writes files directly, but user may review in IDE

### Agent Dependencies

**QA Agent** (Upstream):
- Provides gate files and assessment files
- Task: `review-story.md`

**Dev Agent** (Self):
- Executes apply-qa-fixes.md
- Updates story file (allowed sections only)

---

## 9. Integration Points

### Integration 1: QA Agent → Dev Agent

**Flow**: QA review results feed into Dev fixes

```
QA Agent runs review-story
  ↓
Generates gate YAML + assessment markdowns
  ↓
Dev Agent runs apply-qa-fixes
  ↓
Reads QA outputs
  ↓
Applies fixes
  ↓
Updates story Status to "Ready for Review"
```

**Data Passed**:
- Gate decision (PASS/CONCERNS/FAIL/WAIVED)
- Top issues with severity and suggested actions
- NFR validation results
- Coverage gaps (test design, traceability)
- Risk recommendations

**Failure Modes**:
- QA artifacts missing → Dev halts and requests QA review
- Gate file malformed → Dev attempts to parse, escalates if fails

---

### Integration 2: Dev Agent → QA Agent (Re-review Loop)

**Flow**: Dev signals readiness for QA re-review

```
Dev Agent applies fixes
  ↓
Updates story Status to "Ready for Review"
  ↓
QA Agent detects status change (or user triggers)
  ↓
QA Agent re-runs review-story
  ↓
Updates gate file with new decision
  ↓
IF gate PASS THEN story Status → "Ready for Done"
ELSE Dev applies more fixes (repeat loop)
```

**Communication Protocol**:
- Dev uses story Status field to signal readiness
- Dev adds note in Change Log: "Ready for QA re-review"
- QA monitors story Status or user explicitly triggers re-review

---

### Integration 3: Story File (Shared Artifact)

**Shared Between**: SM, Dev, QA, PO agents

**Dev's Role**:
- **Read**: Acceptance Criteria, Tasks, Dev Notes, QA Results
- **Write**: Dev Agent Record, File List, Change Log, Status (conditionally)

**Other Agents' Roles**:
- **SM**: Creates story, defines Tasks, writes Dev Notes
- **QA**: Adds QA Results section, updates Status to "Ready for Done"
- **PO**: Reviews story, may update Status

**Conflict Prevention**:
- Strict section ownership rules
- Dev only updates allowed sections
- QA owns QA Results and gate files
- SM owns Story, ACs, Tasks structure

---

### Integration 4: Validation Tools (Deno)

**Flow**: Dev invokes Deno commands for validation

```
Dev applies code fixes
  ↓
Runs `deno lint`
  ↓
IF errors THEN fix and rerun
  ↓
Runs `deno test -A`
  ↓
IF failures THEN debug, fix, rerun
  ↓
All validations pass → Update story
```

**Tool Integration**:
- **deno lint**: Static analysis, code quality checks
- **deno test**: Test execution, coverage validation
- Both tools invoked via command line from agent

---

## 10. Configuration References

### Configuration File: `.bmad-core/core-config.yaml`

**Required Keys**:

```yaml
qa:
  qaLocation: docs/qa          # Base directory for QA artifacts

devStoryLocation: docs/stories # Directory containing story files
```

**Optional Keys** (Referenced but not required):

```yaml
devLoadAlwaysFiles:              # Files always loaded by Dev agent
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md

devDebugLog: .ai/debug-log.md    # Location for debug log (optional)
```

**Usage in Task**:
- Step 0: Load config, resolve `qa_root` and `story_root`
- Step 1: Construct paths to gate and assessment files using `qa_root`
- Step 0: Locate story file using `story_root`

---

### Project Configuration Files (Referenced)

**`docs/project/typescript-rules.md`** (Optional):
- Coding standards for TypeScript/Deno
- Import conventions (centralized via deps.ts)
- File organization rules
- Naming conventions

**Referenced in**: Step 3A (Follow project conventions)

---

## 11. Performance Characteristics

### Execution Time Estimates

**Step 0 (Load Config)**: < 1 second
- Read YAML file
- Resolve paths
- Locate story file

**Step 1 (Collect QA Findings)**: 1-5 seconds
- Parse gate YAML (1 file)
- Read assessment markdowns (0-4 files)
- Extract findings

**Step 2 (Build Fix Plan)**: 1-2 seconds
- Prioritize issues
- Build ordered fix list

**Step 3 (Apply Changes)**: 5-60 minutes (variable)
- Depends on number and complexity of fixes
- Code changes: 5-30 minutes per fix
- Test additions: 5-15 minutes per test
- Large refactors: 30-60 minutes

**Step 4 (Validate)**: 10-120 seconds (variable)
- Lint: 1-5 seconds
- Tests: 5-60 seconds (depends on test suite size)
- Iteration: Multiple runs if failures

**Step 5 (Update Story)**: 1-2 seconds
- Write story file updates

**Total Estimated Time**: 10 minutes to 2 hours (highly variable)

**Factors Affecting Performance**:
- Number of QA issues to fix
- Complexity of fixes (simple vs. architectural)
- Test suite size (affects validation time)
- Number of validation iterations needed

---

### Scalability Considerations

**Small Stories** (1-3 files, 1-2 issues):
- Execution time: 10-20 minutes
- Minimal iteration needed
- Fast validation

**Medium Stories** (4-10 files, 3-5 issues):
- Execution time: 30-60 minutes
- Some iteration expected
- Moderate validation time

**Large Stories** (10+ files, 5+ issues):
- Execution time: 1-2 hours
- Multiple iterations likely
- Longer validation time
- Consider breaking into multiple fix sessions

---

### Optimization Strategies

**Parallel Test Execution** (if supported by test framework):
```bash
deno test -A --parallel
```

**Incremental Validation** (validate as you fix):
```
FOR each fix in fix_plan DO
  Apply fix
  Run lint (quick check)
  Run affected tests only (subset)
  IF pass THEN continue to next fix
  ELSE fix issue before moving on
END FOR

# Final full validation
Run deno lint
Run deno test -A (all tests)
```

**Caching** (leverage Deno's built-in caching):
- Deno caches dependencies automatically
- First run slower, subsequent runs faster

---

## 12. Security Considerations

### Security Risk 1: Code Injection via QA Findings

**Risk**: Malicious suggested_action in gate file could execute arbitrary code

**Mitigation**:
- **Human in the loop**: Dev agent shows suggested actions to user before applying
- **Code review**: User reviews all changes before committing
- **Sandboxing**: Deno's permission system limits file system and network access
- **Validation**: All changes must pass lint and tests

**Best Practice**:
```
NEVER automatically execute code from QA findings
ALWAYS show user what changes will be made
ALWAYS require validation to pass before updating story
```

---

### Security Risk 2: File System Access

**Risk**: Task modifies files outside intended scope

**Mitigation**:
- **Strict permissions**: Dev only updates allowed story sections
- **Path validation**: Verify all file paths are within project directory
- **Git tracking**: Use git to track all changes and enable rollback

**Implementation**:
```typescript
function validateFilePath(path: string): boolean {
  const projectRoot = Deno.cwd();
  const resolvedPath = resolve(path);
  return resolvedPath.startsWith(projectRoot);
}
```

---

### Security Risk 3: Dependency Injection Vulnerabilities

**Risk**: Adding malicious dependencies during fixes

**Mitigation**:
- **Centralized imports**: All third-party imports through deps.ts
- **Dependency review**: User reviews all new dependencies
- **Deno lock file**: Use import maps and lock files for reproducibility
- **Security scanning**: Run `deno info --json` to check dependency tree

**Best Practice**:
```
ALWAYS add new imports to deps.ts
ALWAYS review dependency sources before adding
CONSIDER using Deno's built-in modules when possible
```

---

### Security Risk 4: Sensitive Data Exposure

**Risk**: Fixes might inadvertently expose secrets or credentials

**Mitigation**:
- **Secret scanning**: Check for common secret patterns before committing
- **Environment variables**: Use env vars for sensitive config, never hardcode
- **Git ignore**: Ensure .gitignore excludes sensitive files
- **Code review**: User reviews all changes before committing

**Best Practice**:
```
NEVER hardcode API keys, passwords, or tokens
ALWAYS use environment variables for sensitive config
ALWAYS review changes for accidental secret exposure
```

---

## 13. Testing Strategy

### Unit Testing for Task Logic

**Test File**: `tests/tasks/apply-qa-fixes.test.ts`

**Test Cases**:

#### Test 1: Parse Gate YAML
```typescript
Deno.test("apply-qa-fixes - Parse gate YAML correctly", () => {
  const gateContent = `
gate: CONCERNS
top_issues:
  - id: SEC-1
    severity: HIGH
    finding: "SQL injection vulnerability"
    suggested_action: "Use parameterized queries"
`;

  const parsed = parseGateYaml(gateContent);

  assertEquals(parsed.gate, "CONCERNS");
  assertEquals(parsed.top_issues.length, 1);
  assertEquals(parsed.top_issues[0].severity, "HIGH");
});
```

#### Test 2: Build Fix Plan with Correct Priority
```typescript
Deno.test("apply-qa-fixes - Prioritize HIGH severity issues first", () => {
  const findings = {
    top_issues: [
      { id: "LOW-1", severity: "LOW", finding: "Minor style issue" },
      { id: "HIGH-1", severity: "HIGH", finding: "Security vulnerability" },
      { id: "MED-1", severity: "MEDIUM", finding: "Performance issue" },
    ]
  };

  const fixPlan = buildFixPlan(findings);

  assertEquals(fixPlan[0].issue_id, "HIGH-1");
  assertEquals(fixPlan[1].issue_id, "MED-1");
  assertEquals(fixPlan[2].issue_id, "LOW-1");
});
```

#### Test 3: Validate Story Section Permissions
```typescript
Deno.test("apply-qa-fixes - Allow only permitted story sections", () => {
  assertEquals(canUpdateSection("Dev Agent Record"), true);
  assertEquals(canUpdateSection("File List"), true);
  assertEquals(canUpdateSection("Change Log"), true);
  assertEquals(canUpdateSection("Status"), true);

  assertEquals(canUpdateSection("QA Results"), false);
  assertEquals(canUpdateSection("Acceptance Criteria"), false);
  assertEquals(canUpdateSection("Story"), false);
});
```

#### Test 4: Status Rule Logic
```typescript
Deno.test("apply-qa-fixes - Set correct status based on gate", () => {
  const gate1 = { gate: "PASS", gaps_closed: true };
  assertEquals(determineStatus(gate1), "Ready for Done");

  const gate2 = { gate: "CONCERNS", gaps_closed: true };
  assertEquals(determineStatus(gate2), "Ready for Review");

  const gate3 = { gate: "FAIL", gaps_closed: false };
  assertEquals(determineStatus(gate3), "Ready for Review");
});
```

---

### Integration Testing

**Test File**: `tests/integration/apply-qa-fixes.integration.test.ts`

**Test Cases**:

#### Integration Test 1: End-to-End Fix Application
```typescript
Deno.test("apply-qa-fixes - Complete fix workflow", async () => {
  // Setup: Create test story and gate file
  const testStory = createTestStory("2.2");
  const testGate = createTestGate("2.2", "CONCERNS", [
    { id: "COV-1", severity: "HIGH", finding: "Missing test for AC2" }
  ]);

  // Execute task
  await applyQAFixes("2.2");

  // Verify: Story updated, test added, validation passed
  const updatedStory = readStoryFile("2.2");
  assert(updatedStory.includes("Applied QA Fixes"));
  assert(updatedStory.includes("Status: Ready for Review"));

  const testFile = readTestFile("tests/menu.test.ts");
  assert(testFile.includes("AC2"));

  const lintResult = await runCommand("deno lint");
  assertEquals(lintResult.code, 0);
});
```

---

### Validation Testing

**Test File**: `tests/validation/apply-qa-fixes.validation.test.ts`

**Test Cases**:

#### Validation Test 1: Missing Prerequisites
```typescript
Deno.test("apply-qa-fixes - Halt if core-config missing", async () => {
  // Remove core-config.yaml temporarily
  await Deno.remove(".bmad-core/core-config.yaml");

  const result = await applyQAFixes("2.2");

  assertEquals(result.status, "error");
  assert(result.message.includes("Missing .bmad-core/core-config.yaml"));
});
```

#### Validation Test 2: No QA Artifacts
```typescript
Deno.test("apply-qa-fixes - Halt if no gate file found", async () => {
  const result = await applyQAFixes("2.2");

  assertEquals(result.status, "error");
  assert(result.message.includes("No QA artifacts found"));
});
```

---

## 14. Example Usage

### Example 1: Simple Fix Application (HIGH Severity Issue)

**Context**: QA found a HIGH severity security issue

**Gate File** (`docs/qa/gates/2.2-navigation-20251014.yml`):
```yaml
gate: CONCERNS
top_issues:
  - id: SEC-1
    severity: HIGH
    finding: "SQL injection vulnerability in user query"
    suggested_action: "Use parameterized queries for all user inputs"
```

**User Command**:
```
*review-qa 2.2
```

**Agent Execution**:

1. **Load Config**: Read core-config.yaml, locate story 2.2
2. **Collect Findings**: Parse gate, identify SEC-1 as HIGH severity
3. **Build Fix Plan**: Priority 1 - SEC-1 (HIGH severity)
4. **Apply Changes**:
   - Modify `src/services/user-query.ts`:
   ```typescript
   // BEFORE
   const query = `SELECT * FROM users WHERE email = '${userEmail}'`;

   // AFTER
   const query = sql`SELECT * FROM users WHERE email = ${userEmail}`;
   ```
5. **Validate**: Run lint (0 problems), run tests (all pass)
6. **Update Story**:
   ```markdown
   ### Completion Notes
   - Fixed SQL injection vulnerability (SEC-1) with parameterized queries

   ### File List
   **Modified**: src/services/user-query.ts

   ## Change Log
   ### 2025-10-14 - Applied QA Fixes
   - Fixed security issue SEC-1 (SQL injection)
   - All lint and tests passing

   ## Status
   Status: Ready for Review
   ```

**Outcome**: Story updated, fix applied, ready for QA re-review

---

### Example 2: Multiple Fixes with Coverage Gaps

**Context**: QA found NFR failures and test coverage gaps

**Gate File** (`docs/qa/gates/2.2-navigation-20251014.yml`):
```yaml
gate: FAIL
top_issues:
  - id: SEC-1
    severity: HIGH
    finding: "Input validation missing"
    suggested_action: "Add email format validation"

nfr_validation:
  security:
    status: FAIL
    notes: "No input validation for user email"

test_design:
  coverage_gaps:
    - "Back action behavior untested (AC2)"
    - "Centralized dependencies enforcement untested (AC4)"
```

**User Command**:
```
*review-qa 2.2
```

**Agent Execution**:

1. **Collect Findings**: HIGH severity (SEC-1), NFR FAIL (security), 2 coverage gaps
2. **Build Fix Plan**:
   - Priority 1: SEC-1 (HIGH severity)
   - Priority 2: NFR security FAIL
   - Priority 4: Coverage gaps (AC2, AC4)
3. **Apply Changes**:
   - Add email validation: `src/validation/email.ts`
   - Add test for Back action: `tests/menu.test.ts`
   - Add test for centralized deps: `tests/deps.test.ts`
4. **Validate**: Lint passes, 3 new tests pass
5. **Update Story**:
   ```markdown
   ### Completion Notes
   - Fixed input validation (SEC-1, NFR security)
   - Added Back action test (AC2 coverage gap)
   - Added centralized deps test (AC4 coverage gap)

   ### File List
   **Modified**: tests/menu.test.ts
   **Added**: src/validation/email.ts, tests/validation/email.test.ts, tests/deps.test.ts

   ## Status
   Status: Ready for Review
   ```

**Outcome**: 3 fixes applied (1 code, 2 tests), story ready for re-review

---

### Example 3: PASS Gate with Minor Concerns

**Context**: QA passed story but noted minor coverage gap

**Gate File** (`docs/qa/gates/2.2-navigation-20251014.yml`):
```yaml
gate: PASS
top_issues: []

test_design:
  coverage_gaps:
    - "Error handling for invalid navigation untested (edge case)"
```

**User Command**:
```
*review-qa 2.2
```

**Agent Execution**:

1. **Collect Findings**: Gate PASS, 1 minor coverage gap
2. **Build Fix Plan**: Priority 4 - Coverage gap (error handling)
3. **Apply Changes**: Add test for invalid navigation error handling
4. **Validate**: Lint passes, new test passes
5. **Update Story**:
   ```markdown
   ### Completion Notes
   - Added test for invalid navigation error handling (edge case)

   ## Status
   Status: Ready for Done
   ```
   **Note**: Status set to "Ready for Done" because gate was PASS

**Outcome**: Minor fix applied, story ready for completion

---

### Example 4: Validation Failure Escalation

**Context**: QA found issue, but fix causes test failures

**Gate File**:
```yaml
gate: CONCERNS
top_issues:
  - id: PERF-1
    severity: MEDIUM
    finding: "Inefficient algorithm in search function"
    suggested_action: "Use binary search instead of linear search"
```

**User Command**:
```
*review-qa 2.2
```

**Agent Execution**:

1. **Apply Changes**: Modify search function to use binary search
2. **Validate**: Run tests → 2 tests fail (unexpected results)
3. **Iteration 1**: Debug, realize binary search requires sorted data
4. **Fix**: Add sorting step before binary search
5. **Validate**: Run tests → 1 test still fails (performance regression)
6. **Iteration 2**: Investigate, find edge case issue
7. **Fix**: Handle edge case (empty array)
8. **Validate**: Run tests → All pass
9. **Update Story**: Document changes, set Status to "Ready for Review"

**Outcome**: Fix applied with multiple iterations, all validations passing

**Alternative Outcome** (if 3+ iterations fail):
```
Agent: ⚠️ Unable to achieve clean validation after 3 attempts.

Current issue: Binary search implementation causes test failure in edge case scenarios.

I've attempted:
1. Add sorting before binary search
2. Handle empty array edge case
3. Adjust comparison logic

Test still failing: "Search with duplicate values returns incorrect index"

This may require:
- Clarification on expected behavior for duplicates
- Different algorithm approach (hybrid search)
- Review of test expectations

How would you like to proceed?
```

**User Escalation Required**: Yes (after 3 failed attempts)

---

## 15. ADK Translation Requirements

### Google Vertex AI ADK Implementation Strategy

**Recommended Approach**: **Reasoning Engine Workflow** (Medium-High Complexity)

**Rationale**:
- Multi-step sequential process (6 steps)
- Requires decision logic and branching
- Needs state management between steps
- Involves file I/O and external command execution
- Benefits from structured workflow orchestration

---

### Reasoning Engine Workflow Implementation

**Workflow Class**: `ApplyQAFixesWorkflow`

**Location**: Reasoning Engine (Google Cloud)

**Implementation Outline**:

```python
from google.cloud import reasoning_engine
from google.cloud import storage
from google.cloud import firestore
import yaml
import subprocess

class ApplyQAFixesWorkflow:
    """
    Reasoning Engine workflow for apply-qa-fixes task.
    Implements the 6-step sequential process with validation loops.
    """

    def __init__(self, config: dict):
        self.config = config
        self.firestore = firestore.Client()
        self.storage = storage.Client()

    def execute(self, story_id: str) -> dict:
        """Main execution flow for apply-qa-fixes."""

        # Step 0: Load core config & locate story
        context = self.load_context(story_id)

        # Step 1: Collect QA findings
        findings = self.collect_qa_findings(context)

        # Step 2: Build deterministic fix plan
        fix_plan = self.build_fix_plan(findings)

        # Step 3: Apply changes (delegated to Cloud Function)
        changes = self.apply_changes(fix_plan, context)

        # Step 4: Validate (with iteration loop)
        validation_result = self.validate_changes(changes, context)

        if not validation_result.success:
            return {
                "status": "error",
                "message": "Validation failed",
                "details": validation_result.errors
            }

        # Step 5: Update story (allowed sections only)
        story_update = self.update_story(
            context, fix_plan, changes, validation_result
        )

        # Step 6: Advisory - Do not edit gate files
        # (No action - just documentation in workflow)

        return {
            "status": "success",
            "story_id": story_id,
            "fixes_applied": len(fix_plan),
            "files_modified": changes.files,
            "validation": validation_result,
            "story_status": story_update.status
        }

    def load_context(self, story_id: str) -> dict:
        """Step 0: Load configuration and locate story."""
        # Read core-config.yaml from Cloud Storage
        # Resolve paths for qa_root and story_root
        # Locate story file using glob pattern
        # Return context dict with all paths
        pass

    def collect_qa_findings(self, context: dict) -> dict:
        """Step 1: Parse gate YAML and assessment markdowns."""
        # Read gate file from Cloud Storage (most recent if multiple)
        # Parse YAML with pyyaml
        # Read assessment markdown files
        # Extract findings, issues, gaps
        # Return structured findings dict
        pass

    def build_fix_plan(self, findings: dict) -> list:
        """Step 2: Create prioritized fix plan."""
        # Apply prioritization algorithm
        # Sort issues by priority (HIGH → MEDIUM → LOW)
        # Structure fix plan with suggested actions
        # Return ordered list of fixes
        pass

    def apply_changes(self, fix_plan: list, context: dict) -> dict:
        """Step 3: Delegate code changes to Cloud Function."""
        # Call Cloud Function: apply-code-fixes
        # Pass fix plan and context
        # Function performs actual file modifications
        # Return list of changed files and details
        pass

    def validate_changes(
        self, changes: dict, context: dict, max_iterations: int = 3
    ) -> dict:
        """Step 4: Run lint and tests with iteration loop."""
        iteration = 0

        while iteration < max_iterations:
            # Run lint via Cloud Function or Cloud Build
            lint_result = self.run_lint(context)

            # Run tests via Cloud Function or Cloud Build
            test_result = self.run_tests(context)

            if lint_result.success and test_result.success:
                return {
                    "success": True,
                    "lint": lint_result,
                    "tests": test_result,
                    "iterations": iteration + 1
                }

            # Attempt automatic fixes for lint/test issues
            if not lint_result.success:
                self.auto_fix_lint(lint_result.errors, context)

            if not test_result.success:
                self.auto_fix_tests(test_result.errors, context)

            iteration += 1

        # Max iterations reached - escalate to user
        return {
            "success": False,
            "lint": lint_result,
            "tests": test_result,
            "iterations": iteration,
            "error": "Max validation iterations exceeded"
        }

    def update_story(
        self, context: dict, fix_plan: list,
        changes: dict, validation: dict
    ) -> dict:
        """Step 5: Update allowed story sections."""
        # Read story file from Cloud Storage
        # Parse markdown structure
        # Update ONLY allowed sections:
        #   - Dev Agent Record
        #   - File List
        #   - Change Log
        #   - Status (based on Status Rule)
        # Write updated story back to Cloud Storage
        # Return update summary
        pass

    def run_lint(self, context: dict) -> dict:
        """Run deno lint via Cloud Build or Cloud Function."""
        # Trigger Cloud Build or invoke Cloud Function
        # Execute: deno lint
        # Parse output
        # Return: {success: bool, errors: list, output: string}
        pass

    def run_tests(self, context: dict) -> dict:
        """Run deno test via Cloud Build or Cloud Function."""
        # Trigger Cloud Build or invoke Cloud Function
        # Execute: deno test -A
        # Parse output (passed/failed counts)
        # Return: {success: bool, passed: int, failed: int, output: string}
        pass
```

---

### Cloud Function: `apply-code-fixes`

**Purpose**: Execute actual file modifications (Step 3)

**Trigger**: HTTP request from Reasoning Engine

**Input**:
```json
{
  "fix_plan": [
    {
      "priority": 1,
      "category": "HIGH_SEVERITY",
      "issue_id": "SEC-1",
      "file": "src/services/user-query.ts",
      "suggested_action": "Use parameterized queries"
    }
  ],
  "context": {
    "story_id": "2.2",
    "project_root": "gs://bmad-projects/project-x"
  }
}
```

**Process**:
1. Download project files from Cloud Storage
2. Apply fixes according to fix_plan
3. Generate/modify test files
4. Upload modified files back to Cloud Storage
5. Return list of changed files

**Output**:
```json
{
  "status": "success",
  "files_modified": [
    "src/services/user-query.ts",
    "tests/menu.test.ts"
  ],
  "files_added": [
    "tests/validation/email.test.ts"
  ],
  "changes_summary": "Fixed 3 issues, added 2 tests"
}
```

---

### Cloud Build: Validation Pipeline

**Purpose**: Execute lint and tests in isolated environment (Step 4)

**Trigger**: HTTP request from Reasoning Engine

**cloudbuild.yaml**:
```yaml
steps:
  # Step 1: Install Deno
  - name: 'denoland/deno:latest'
    id: 'install-deno'
    args: ['--version']

  # Step 2: Run lint
  - name: 'denoland/deno:latest'
    id: 'run-lint'
    args: ['lint']

  # Step 3: Run tests
  - name: 'denoland/deno:latest'
    id: 'run-tests'
    args: ['test', '-A']
```

**Integration**:
- Reasoning Engine triggers Cloud Build
- Build runs in isolated container
- Results returned to Reasoning Engine
- Workflow decides next action based on results

---

### Firestore Schema: Story State Tracking

**Collection**: `/projects/{project_id}/stories/{story_id}`

**Document Structure**:
```json
{
  "story_id": "2.2",
  "title": "Implement navigation",
  "status": "Ready for Review",
  "dev_agent_record": {
    "model_used": "claude-sonnet-4.5-20250929",
    "completion_notes": [
      "Fixed SQL injection vulnerability (SEC-1)",
      "Added email validation (NFR security)"
    ],
    "file_list": {
      "modified": [
        "src/services/user-query.ts",
        "src/validation/email.ts"
      ],
      "added": [
        "tests/validation/email.test.ts"
      ]
    }
  },
  "change_log": [
    {
      "date": "2025-10-14",
      "entry": "Applied QA fixes - security issues and coverage gaps"
    }
  ],
  "updated_at": "2025-10-14T10:30:00Z",
  "updated_by": "dev-agent"
}
```

---

### Integration with Other ADK Components

**1. QA Agent → Dev Agent Flow**:
```
QA Reasoning Engine (review-story)
  ↓
Generates gate YAML → Cloud Storage
  ↓
Dev Reasoning Engine (apply-qa-fixes)
  ↓
Reads gate YAML from Cloud Storage
  ↓
Applies fixes via Cloud Function
  ↓
Updates story in Firestore
```

**2. Dev Agent → QA Agent Re-review Loop**:
```
Dev Reasoning Engine updates story status → Firestore
  ↓
Cloud Function monitors Firestore changes (Firestore trigger)
  ↓
Detects status change to "Ready for Review"
  ↓
Triggers QA Reasoning Engine (review-story)
  ↓
QA generates new gate file → Cloud Storage
```

---

### Cost Optimization

**Reasoning Engine**:
- Use preemptible instances for non-urgent fix application
- Cache parsed gate files to avoid redundant parsing
- Batch multiple small fixes into single workflow execution

**Cloud Functions**:
- Use 2nd gen Cloud Functions for better performance
- Set appropriate memory limits (256MB-512MB for file operations)
- Use Cloud Build for compute-intensive tasks (validation)

**Cloud Storage**:
- Use Standard storage class for active projects
- Archive completed projects to Nearline/Coldline
- Enable versioning for gate files and story files

**Firestore**:
- Use indexed queries for story lookup by status
- Avoid excessive field updates (batch story updates)
- Use TTL for temporary validation state

---

### Security Considerations for ADK

**1. Service Account Permissions**:
```yaml
service_account: dev-agent@project.iam.gserviceaccount.com
permissions:
  - storage.objects.get (read gate files, story files)
  - storage.objects.create (write updated story files)
  - cloudfunctions.functions.invoke (trigger apply-code-fixes)
  - cloudbuild.builds.create (trigger validation pipeline)
  - firestore.documents.update (update story state)
```

**2. Input Validation**:
- Validate all inputs to Reasoning Engine (story_id format, paths)
- Sanitize file paths to prevent directory traversal
- Validate YAML parsing to prevent injection attacks

**3. Secrets Management**:
- Store sensitive config in Secret Manager (API keys, credentials)
- Never hardcode secrets in workflow code
- Use IAM for service-to-service authentication

**4. Audit Logging**:
- Enable Cloud Audit Logs for all Reasoning Engine executions
- Log all file modifications with timestamps and user attribution
- Monitor for unusual patterns (excessive failures, unauthorized access)

---

### Monitoring & Observability

**Metrics to Track**:
- Fix application success rate (% successful vs. failed)
- Average execution time per fix
- Validation iteration counts (track efficiency)
- User escalation rate (% requiring manual intervention)

**Logging Strategy**:
- Log each workflow step with timestamps
- Log all file modifications (what, when, why)
- Log validation results (lint output, test results)
- Log user interactions and escalations

**Alerting**:
- Alert on repeated validation failures (> 3 iterations)
- Alert on missing gate files (data integrity issue)
- Alert on workflow errors or timeouts
- Alert on high user escalation rates

---

## 16. Key Principles & Best Practices

### Principle 1: Deterministic, Risk-First Prioritization

**Guideline**: Always address issues in strict priority order

**Priority Order**:
1. HIGH severity issues (security, reliability, performance)
2. NFR failures (security → performance → reliability → maintainability)
3. NFR concerns (same order)
4. Test coverage gaps (P0 scenarios first)
5. Traceability gaps (uncovered ACs)
6. Risk must-fix recommendations
7. MEDIUM severity issues
8. LOW severity issues

**Rationale**: Critical issues must be fixed first to prevent security breaches, data loss, or system failures. This priority order ensures risk mitigation takes precedence over cosmetic improvements.

**Example**:
```
Given findings:
- LOW-1: Minor style inconsistency
- HIGH-1: SQL injection vulnerability
- MEDIUM-1: Slow query performance

Fix order:
1. HIGH-1 (security risk - critical)
2. MEDIUM-1 (performance issue - moderate)
3. LOW-1 (style issue - minor)
```

---

### Principle 2: Minimal, Targeted Changes

**Guideline**: Apply smallest possible fixes that address the specific issue

**Anti-Patterns to Avoid**:
- Over-engineering solutions
- Large refactors beyond fix scope
- Architectural changes without user approval
- Adding features not related to QA findings

**Best Practices**:
- Fix exactly what QA identified, no more
- Keep changes focused and scoped
- Avoid "while I'm here" improvements (unless trivial)
- Escalate to user if fix requires significant refactor

**Example**:
```
QA Finding: "Email validation missing"

✅ GOOD FIX:
  Add email validation function
  Use existing validation library
  Add test for email validation

❌ BAD FIX:
  Rewrite entire validation system
  Add validation for all input types (beyond email)
  Refactor form handling architecture
```

---

### Principle 3: Strict Permission Model

**Guideline**: Dev agent has limited update permissions on story file

**Allowed Sections** (Dev can update):
- Tasks/Subtasks checkboxes
- Dev Agent Record (all subsections)
- File List
- Change Log
- Status (conditional)

**Forbidden Sections** (Dev cannot update):
- Story
- Acceptance Criteria
- Dev Notes (authored by SM)
- Testing (authored by SM)
- QA Results (authored by QA)

**Rationale**: Clear ownership boundaries prevent conflicts and ensure accountability. QA owns assessment sections, Dev owns implementation sections.

**Enforcement**:
```typescript
function canUpdateSection(section: string): boolean {
  const ALLOWED = [
    "Tasks", "Subtasks", "Dev Agent Record",
    "File List", "Change Log", "Status"
  ];
  return ALLOWED.includes(section);
}
```

---

### Principle 4: Test-First Fix Approach

**Guideline**: Prioritize test additions with or before code fixes

**Strategy**:
1. **For coverage gaps**: Add test FIRST, ensure it fails, then fix code
2. **For code bugs**: Add test that reproduces bug, then fix code
3. **For NFR failures**: Add test that validates NFR, then fix code

**Benefits**:
- Ensures fix actually addresses the issue
- Prevents regression in future
- Validates that test is meaningful (not always passing)
- Aligns with TDD best practices

**Example**:
```
QA Finding: "Back action behavior untested (AC2)"

Step 1: Add test (expect it to fail or be incomplete)
  Deno.test("Back action returns to Main Menu", () => {
    // Test code
  });

Step 2: Run test - verify it fails or identifies gap

Step 3: Implement fix (add Back action handler)

Step 4: Run test - verify it now passes
```

---

### Principle 5: Validation-Gated Story Updates

**Guideline**: Never update story file until ALL validations pass

**Validation Requirements**:
- `deno lint`: 0 problems
- `deno test -A`: All tests passing (0 failures)
- Manual review (if needed): User confirms changes look correct

**Workflow**:
```
Apply fixes → Run lint → IF errors THEN fix and retry
           ↓
     Run tests → IF failures THEN debug and retry
           ↓
  All pass? → Update story
           ↓
    Status field updated based on gate decision
```

**Rationale**: Prevents incomplete or broken fixes from being marked as complete. Ensures quality gate before signaling readiness to QA.

---

### Principle 6: Status-Driven Workflow Communication

**Guideline**: Use story Status field to signal state changes, not direct agent communication

**Status Values and Meanings**:
- **"In Progress"**: Dev is actively working on fixes
- **"Ready for Review"**: Dev completed fixes, QA should re-review
- **"Ready for Done"**: Gate passed and all gaps closed, story complete

**Communication Protocol**:
```
Dev applies fixes → Updates Status to "Ready for Review"
  ↓
QA monitors Status field (or user triggers re-review)
  ↓
QA re-runs *review-story → Updates gate file
  ↓
IF gate PASS THEN QA updates Status to "Ready for Done"
ELSE Dev applies more fixes (repeat cycle)
```

**Rationale**: Decouples agents through shared artifact (story file), enabling asynchronous workflow without direct inter-agent communication.

---

### Best Practice 1: Use Project Conventions

**Guideline**: Follow existing codebase patterns and standards

**Key Conventions to Follow**:
- **Import centralization**: Use `deps.ts` for third-party imports
- **DI boundaries**: Respect dependency injection patterns in `src/core/di.ts`
- **Naming conventions**: Match existing file and function naming
- **File organization**: Place new files in appropriate directories
- **Test file placement**: Co-locate tests with source files

**Reference Files**:
- `docs/project/typescript-rules.md`: TypeScript and Deno standards
- `src/core/di.ts`: Dependency injection patterns

---

### Best Practice 2: Iterative Validation with Escape Hatch

**Guideline**: Attempt automated fixes, but escalate after 3 iterations

**Iteration Loop**:
```
iteration = 0
WHILE validation fails AND iteration < 3 DO
  Attempt automatic fix
  Rerun validation
  iteration++
END WHILE

IF iteration >= 3 THEN
  HALT and escalate to user
  Provide error details and attempted fixes
  Request guidance
```

**Rationale**: Prevents infinite loops and wasted compute. After 3 attempts, likely requires human judgment or different approach.

---

### Best Practice 3: Comprehensive Change Logging

**Guideline**: Document ALL changes in Dev Agent Record and Change Log

**Required Documentation**:
- **What changed**: File names and modification types (added/modified/deleted)
- **Why changed**: QA finding ID and description
- **How changed**: Brief description of fix approach
- **Validation results**: Lint and test outcomes

**Example**:
```markdown
### Completion Notes
- Fixed SQL injection vulnerability (SEC-1) by converting to parameterized queries
- Added email input validation (NFR security FAIL) with regex and library
- Closed coverage gap for Back action (AC2) with new test in tests/menu.test.ts
- Closed coverage gap for centralized deps (AC4) with static import test

### File List
**Modified**:
- src/services/user-query.ts (parameterized queries)
- src/validation/email.ts (added validation logic)
- src/deps.ts (added validator library import)
- tests/menu.test.ts (added Back action test)

**Added**:
- tests/validation/email.test.ts (email validation tests)
- tests/deps.test.ts (centralized deps static test)
```

---

### Best Practice 4: User Escalation for Blocking Conditions

**Guideline**: Halt and escalate to user when encountering blocking conditions

**Blocking Conditions**:
1. Missing prerequisites (core-config.yaml, story file)
2. No QA artifacts found (no gate or assessments)
3. Persistent validation failures (> 3 iterations)
4. Ambiguous fix requirements (unclear suggested actions)
5. Architectural changes needed (beyond story scope)

**Escalation Protocol**:
```
1. HALT execution immediately
2. Provide clear error message describing issue
3. Suggest possible solutions or next steps
4. Offer numbered options for user to choose
5. AWAIT user decision before proceeding
```

**Example Escalation Message**:
```
⚠️ Unable to achieve clean validation after 3 attempts.

Current issue: Type mismatch in src/services/user-query.ts:42
Expected: string | null
Got: string

Attempted fixes:
1. Added null check before query execution
2. Changed return type to string | null
3. Updated calling code to handle null

This may require:
- Clarification on expected behavior when email is null
- Different approach to query handling
- Review of type definitions in dependencies

How would you like to proceed?
1. Provide guidance on fix approach
2. Request manual review and fix
3. Skip this fix and continue with others
```

---

**End of apply-qa-fixes Task Analysis**

---

**Document Metadata**:
- **Analysis Date**: 2025-10-14
- **Analyst**: Claude Code (AI Agent)
- **BMad Version**: Core v4
- **Analysis Length**: 2,485 lines
- **Completeness**: Comprehensive (all 16 sections)

**Related Documents**:
- [Dev Agent Analysis](../agents/07-dev.md)
- [QA Agent Analysis](../agents/08-qa.md)
- [review-story Task Analysis](review-story.md)
- [execute-checklist Task Analysis](execute-checklist.md)
