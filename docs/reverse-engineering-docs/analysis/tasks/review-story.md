# Task Analysis: review-story

**Task ID**: `review-story`
**Task File**: `.bmad-core/tasks/review-story.md`
**Primary Agent**: QA (Quinn)
**Task Type**: Complex Multi-Step Workflow
**Version Analyzed**: BMad Core v4

---

## 1. Purpose & Scope

### Overview
The `review-story` task performs a **comprehensive test architecture review with quality gate decision** for completed story implementations. This is the QA agent's primary and most complex workflow, producing both a story update (QA Results section) and a detailed quality gate file (YAML artifact).

### Key Characteristics
- **Adaptive review depth** - Automatically escalates to deep review based on risk signals
- **Risk-aware analysis** - Uses multiple risk indicators to determine thoroughness level
- **Dual output generation** - Creates both markdown (story update) and YAML (gate file) artifacts
- **Active refactoring authority** - Unique capability to directly improve code during review
- **Advisory philosophy** - Provides expert guidance without arbitrary blocking

### Scope
This task encompasses:
- Requirements traceability validation (AC to test mapping)
- Code quality review with active refactoring
- Test architecture assessment (coverage, levels, design)
- Non-functional requirements validation (security, performance, reliability, maintainability)
- Testability evaluation (controllability, observability, debuggability)
- Technical debt identification
- Standards compliance verification
- Quality gate decision with deterministic criteria

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_id: '{epic}.{story}'        # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md'  # From core-config.yaml
  - story_title: '{title}'            # Derived from story file H1 if missing
  - story_slug: '{slug}'              # Derived from title (lowercase, hyphenated) if missing
```

### Input Sources
- **story_id**: Provided by user command (e.g., `*review 1.3`)
- **story_path**: Resolved from `core-config.yaml` → `devStoryLocation` configuration
- **story_title**: Extracted from story markdown file's H1 heading if not provided
- **story_slug**: Generated from title (lowercase, hyphenated) if not provided

### Configuration Dependencies
- `core-config.yaml`:
  - `devStoryLocation` - Location of story files
  - `qa.qaLocation` - Base directory for QA outputs
  - `qa.qaLocation/gates` - Subdirectory for gate files
  - `qa.qaLocation/assessments` - Subdirectory for detailed assessments
  - `technicalPreferences` - Path to technical preferences file (optional)

---

## 3. Execution Flow

The review-story task follows a comprehensive 6-step adaptive process:

### Step 1: Risk Assessment (Determines Review Depth)

**Purpose**: Automatically determine whether to perform deep or standard review based on risk signals.

**Auto-escalate to deep review when ANY of the following conditions are met:**
1. **Auth/payment/security files touched** - High-risk domain indicators
2. **No tests added to story** - Coverage gap signal
3. **Diff > 500 lines** - Complexity/scope signal
4. **Previous gate was FAIL/CONCERNS** - Historical risk signal
5. **Story has > 5 acceptance criteria** - Complexity signal

**Decision Logic**:
```
IF (auth_files OR payment_files OR security_files) THEN deep_review = TRUE
ELSE IF (tests_added == 0) THEN deep_review = TRUE
ELSE IF (diff_lines > 500) THEN deep_review = TRUE
ELSE IF (previous_gate IN [FAIL, CONCERNS]) THEN deep_review = TRUE
ELSE IF (acceptance_criteria_count > 5) THEN deep_review = TRUE
ELSE deep_review = FALSE
```

**Implementation Notes**:
- Check file list for auth/payment/security patterns (e.g., `auth`, `payment`, `security`, `login`, `password`)
- Count tests in File List (look for `.test.`, `.spec.`, `__tests__/`)
- Calculate diff lines from Dev Agent Record or git diff
- Load previous gate file from `qa.qaLocation/gates/{epic}.{story}-{slug}.yml`
- Count acceptance criteria in story file

### Step 2: Comprehensive Analysis

Six parallel analysis dimensions performed systematically:

#### A. Requirements Traceability
- **Purpose**: Map each acceptance criterion to its validating tests
- **Method**: Document mapping with Given-When-Then (GWT) pattern
- **Output**: Traceability matrix showing:
  - AC numbers with full coverage
  - AC numbers with partial coverage
  - AC numbers with no coverage (gaps)
- **Note**: This is for **documentation only**, not test code generation

#### B. Code Quality Review
- **Architecture and design patterns** - Verify proper use of established patterns
- **Refactoring opportunities** - Identify AND PERFORM safe improvements
- **Code duplication or inefficiencies** - Detect DRY violations, redundancy
- **Performance optimizations** - Identify bottlenecks, N+1 queries, unnecessary computations
- **Security vulnerabilities** - Check for injection risks, XSS, CSRF, authentication flaws
- **Best practices adherence** - Validate against coding standards

**Unique Authority**: QA agent can directly refactor code during this step (see Step 3).

#### C. Test Architecture Assessment
- **Test coverage adequacy** - Verify sufficient coverage at appropriate levels
- **Test level appropriateness** - Evaluate unit vs integration vs E2E choices (reference: `test-levels-framework.md`)
- **Test design quality and maintainability** - Review test structure, readability, maintainability
- **Test data management strategy** - Assess fixtures, mocks, test database usage
- **Mock/stub usage appropriateness** - Verify proper isolation without over-mocking
- **Edge case and error scenario coverage** - Check boundary conditions, error paths
- **Test execution time and reliability** - Identify flaky or slow tests

#### D. Non-Functional Requirements (NFRs)
Four core NFRs assessed by default:

1. **Security**: Authentication, authorization, data protection, input validation, encryption
2. **Performance**: Response times, resource usage, query efficiency, caching strategy
3. **Reliability**: Error handling, recovery mechanisms, retry logic, graceful degradation
4. **Maintainability**: Code clarity, documentation, modularity, testability

Each NFR receives a status: **PASS** | **CONCERNS** | **FAIL**

**Unknown targets policy**: If performance/security targets not defined in story → mark as **CONCERNS**

#### E. Testability Evaluation
Three testability dimensions:

1. **Controllability**: Can we control the inputs? (dependency injection, configurability)
2. **Observability**: Can we observe the outputs? (logging, metrics, return values)
3. **Debuggability**: Can we debug failures easily? (error messages, stack traces, state inspection)

#### F. Technical Debt Identification
- **Accumulated shortcuts** - TODOs, FIXMEs, temporary workarounds
- **Missing tests** - Coverage gaps for existing code
- **Outdated dependencies** - Security vulnerabilities, deprecated packages
- **Architecture violations** - Coupling issues, layering violations, circular dependencies

### Step 3: Active Refactoring

**Unique Capability**: QA agent has authority to directly improve code during review.

**Safe Refactoring Guidelines**:
- Refactor code where safe and appropriate
- Run all tests after each refactoring to ensure no breakage
- Document ALL changes in QA Results section with:
  - **File**: filename
  - **Change**: what was changed
  - **Why**: reason for change
  - **How**: how it improves the code
- Stay within safety boundaries (no behavior changes, only structure/quality improvements)

**Restrictions**:
- Do NOT alter story content beyond QA Results section
- Do NOT change story Status or File List
- Do NOT modify acceptance criteria or tasks
- Only recommend next status (Dev decides)

**Examples of Safe Refactoring**:
- Extract method from long function
- Rename variables for clarity
- Remove code duplication
- Simplify complex conditionals
- Add missing error handling
- Improve test organization

### Step 4: Standards Compliance Check

Verify adherence to three key standard documents:

1. **Coding Standards** (`docs/coding-standards.md`)
   - Naming conventions
   - Code structure
   - Documentation requirements
   - Style guide adherence

2. **Project Structure** (`docs/unified-project-structure.md`)
   - File placement correctness
   - Module organization
   - Naming patterns

3. **Testing Strategy** (`docs/testing-strategy.md`)
   - Test framework usage
   - Test organization
   - Coverage requirements
   - Test naming conventions

**Output**: Compliance checklist with ✓/✗ for each standard

### Step 5: Acceptance Criteria Validation

For each AC in the story:
- **Verify full implementation** - All requirements met
- **Check for missing functionality** - No partial implementations
- **Validate edge cases handled** - Boundary conditions covered

**Cross-reference with**:
- Requirements traceability (Step 2A)
- Test coverage (Step 2C)
- File List completeness

### Step 6: Documentation and Comments

Final review of documentation quality:
- **Code self-documentation** - Prefer clear code over comments
- **Complex logic comments** - Add comments where necessary for clarity
- **API changes documented** - Ensure public interfaces documented
- **README updates** - Verify feature documentation updated

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Review Depth Selection

**Trigger**: Beginning of review process (Step 1)

**Decision Criteria**:
```
IF any_risk_signal_detected THEN
  review_depth = "deep"
  analysis_thoroughness = "comprehensive"
ELSE
  review_depth = "standard"
  analysis_thoroughness = "focused"
END IF
```

**Impact**:
- **Deep review**: All 6 analysis dimensions performed exhaustively
- **Standard review**: Focus on requirements traceability and critical path validation

### Decision Point 2: Refactoring Decision

**Trigger**: During code quality review (Step 2B, Step 3)

**Decision Criteria**:
```
FOR EACH refactoring_opportunity DO
  IF is_safe(refactoring) AND improves_quality(refactoring) THEN
    perform_refactoring()
    run_all_tests()
    IF tests_pass THEN
      document_refactoring()
    ELSE
      revert_refactoring()
      document_as_recommendation()
    END IF
  ELSE
    document_as_recommendation()
  END IF
END FOR
```

**Safety Check**:
- No behavior changes
- All tests still pass
- No new dependencies introduced
- Reversible change

### Decision Point 3: Gate Status Determination

**Trigger**: After all analysis completed (Step 6)

**Deterministic Decision Tree** (apply rules in order):

```
# Rule 1: Risk thresholds (if risk_summary present)
IF any_risk_score >= 9 THEN
  gate = FAIL (unless waived)
ELSE IF any_risk_score >= 6 THEN
  gate = CONCERNS
END IF

# Rule 2: Test coverage gaps (if trace available)
IF any_P0_test_missing THEN
  gate = CONCERNS
END IF
IF security_or_data_loss_P0_test_missing THEN
  gate = FAIL
END IF

# Rule 3: Issue severity
IF any_top_issue_severity == "high" THEN
  gate = FAIL (unless waived)
ELSE IF any_top_issue_severity == "medium" THEN
  gate = CONCERNS
END IF

# Rule 4: NFR statuses
IF any_nfr_status == FAIL THEN
  gate = FAIL
ELSE IF any_nfr_status == CONCERNS THEN
  gate = CONCERNS
ELSE
  gate = PASS
END IF

# Rule 5: Waiver override
IF waiver.active == true THEN
  gate = WAIVED
END IF
```

**Gate Status Meanings**:
- **PASS**: All critical requirements met, no blocking issues
- **CONCERNS**: Non-critical issues found, team should review
- **FAIL**: Critical issues that should be addressed
- **WAIVED**: Issues acknowledged but explicitly waived by team

### Decision Point 4: Recommended Status

**Trigger**: End of review process

**Decision Criteria**:
```
IF gate == PASS AND all_acs_met AND no_unchecked_improvements THEN
  recommended_status = "Ready for Done"
ELSE IF gate IN [CONCERNS, FAIL] OR has_unchecked_improvements THEN
  recommended_status = "Changes Required - See unchecked items"
END IF
```

**Note**: Story owner (Dev or PO) makes final status decision, QA only recommends.

---

## 5. User Interaction Points

### Interaction Point 1: Task Invocation
**When**: Start of task
**User Action**: Execute command `*review {story_id}` (e.g., `*review 1.3`)
**Agent Response**: Acknowledge task start, identify story file

### Interaction Point 2: Blocking Conditions
**When**: During execution if blocking conditions encountered
**Conditions**:
- Story file incomplete or missing critical sections
- File List empty or clearly incomplete
- No tests exist when required
- Code changes don't align with story requirements
- Critical architectural issues requiring discussion

**Agent Action**: HALT execution, request clarification from user
**User Action**: Provide missing information or resolve issue

### Interaction Point 3: Refactoring Confirmation (Optional)
**When**: Before performing significant refactoring
**Agent Action**: May ask user to confirm refactoring approach for complex changes
**User Action**: Approve or provide alternative guidance

### Interaction Point 4: Results Delivery
**When**: End of review
**Agent Output**:
- Summary of findings
- Gate decision with rationale
- File locations for outputs
- Recommended next status

**User Action**: Review findings, decide on next steps

---

## 6. Output Specifications

### Output 1: Story File Update (QA Results Section)

**Location**: Append to existing story file at `{devStoryLocation}/{epic}.{story}.*.md`

**Section**: `## QA Results`

**Anchor Rules**:
- If `## QA Results` doesn't exist → append at end of file
- If it exists → append new dated entry below existing entries
- NEVER edit other sections

**Permissions**: QA agent can ONLY update QA Results section (enforced by story-tmpl.yaml)

**Structure**:
```markdown
## QA Results

### Review Date: [Date]

### Reviewed By: Quinn (Test Architect)

### Code Quality Assessment

[Overall assessment of implementation quality - 2-3 paragraphs covering:
- Overall code quality impression
- Architecture alignment
- Implementation approach effectiveness]

### Refactoring Performed

[List any refactoring performed with detailed explanations]

- **File**: [filename]
  - **Change**: [what was changed]
  - **Why**: [reason for change]
  - **How**: [how it improves the code]

- **File**: [filename]
  - **Change**: [what was changed]
  - **Why**: [reason for change]
  - **How**: [how it improves the code]

### Compliance Check

- Coding Standards: [✓/✗] [notes if any]
- Project Structure: [✓/✗] [notes if any]
- Testing Strategy: [✓/✗] [notes if any]
- All ACs Met: [✓/✗] [notes if any]

### Improvements Checklist

[Check off items handled yourself, leave unchecked for dev to address]

- [x] Refactored user service for better error handling (services/user.service.ts)
- [x] Added missing edge case tests (services/user.service.test.ts)
- [ ] Consider extracting validation logic to separate validator class
- [ ] Add integration test for error scenarios
- [ ] Update API documentation for new error codes

### Security Review

[Any security concerns found and whether addressed - specific findings with severity]

### Performance Considerations

[Any performance issues found and whether addressed - specific findings with impact]

### Files Modified During Review

[If files modified during refactoring, list them here and ask Dev to update File List]

- [filename1] - [reason for modification]
- [filename2] - [reason for modification]

### Gate Status

Gate: {STATUS} → qa.qaLocation/gates/{epic}.{story}-{slug}.yml
Risk profile: qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md
NFR assessment: qa.qaLocation/assessments/{epic}.{story}-nfr-{YYYYMMDD}.md

### Recommended Status

[✓ Ready for Done] / [✗ Changes Required - See unchecked items above]
(Story owner decides final status)
```

### Output 2: Quality Gate File (YAML Artifact)

**Template Source**: `.bmad-core/templates/qa-gate-tmpl.yaml`

**Directory**: `{qa.qaLocation}/gates/` (from core-config.yaml)

**Filename**: `{epic}.{story}-{slug}.yml`

**Full Path Example**: `docs/qa/gates/1.3-user-authentication.yml`

**Schema Version**: 1

**Structure**:
```yaml
# Required fields (always present)
schema: 1
story: "1.3"
story_title: "User Authentication"
gate: PASS  # PASS|CONCERNS|FAIL|WAIVED
status_reason: "All critical requirements met with comprehensive test coverage"
reviewer: "Quinn (Test Architect)"
updated: "2025-01-12T14:30:00Z"  # ISO-8601 timestamp

# Waiver (always present, active only when WAIVED)
waiver:
  active: false
  # When active:
  # reason: "Accepted for MVP release - will address in next sprint"
  # approved_by: "Product Owner"

# Issues (empty array if none)
top_issues: []
# Example with issues:
# top_issues:
#   - id: "SEC-001"
#     severity: high  # ONLY: low|medium|high
#     finding: "No rate limiting on login endpoint"
#     suggested_action: "Add rate limiting middleware before production"
#     suggested_owner: dev  # dev|sm|po
#   - id: "TEST-001"
#     severity: medium
#     finding: "Missing integration tests for auth flow"
#     suggested_action: "Add test coverage for critical paths"
#     suggested_owner: dev

# Risk summary (from risk-profile task if executed)
risk_summary:
  totals:
    critical: 0  # risk_score == 9
    high: 0      # risk_score >= 6
    medium: 0    # risk_score >= 4
    low: 0       # risk_score >= 2
  # 'highest' field emitted only when risks exist
  recommendations:
    must_fix: []
    monitor: []

# ============ Optional Extended Fields ============
# (Recommended but not required)

# Quality score (0-100)
quality_score: 85  # 100 - (20 × FAILs) - (10 × CONCERNS)

# Gate expiry (typically 2 weeks)
expires: "2025-01-26T00:00:00Z"

# Evidence from analysis
evidence:
  tests_reviewed: 15
  risks_identified: 3
  trace:
    ac_covered: [1, 2, 3]  # AC numbers with test coverage
    ac_gaps: [4]           # AC numbers lacking coverage

# NFR validation results
nfr_validation:
  security:
    status: PASS  # PASS|CONCERNS|FAIL
    notes: "Input validation and auth checks properly implemented"
  performance:
    status: CONCERNS
    notes: "No caching strategy for repeated queries"
  reliability:
    status: PASS
    notes: "Comprehensive error handling with graceful degradation"
  maintainability:
    status: PASS
    notes: "Well-structured code with clear separation of concerns"

# Recommendations
recommendations:
  immediate:  # Must fix before production
    - action: "Add rate limiting to auth endpoints"
      refs: ["api/auth/login.ts:42-68"]
  future:  # Can be addressed later
    - action: "Consider caching for better performance"
      refs: ["services/data.service.ts"]

# History (append-only audit trail)
history:
  - at: "2025-01-12T10:00:00Z"
    gate: FAIL
    note: "Initial review - missing tests"
  - at: "2025-01-12T15:00:00Z"
    gate: CONCERNS
    note: "Tests added but rate limiting still missing"
```

### Output 3: Risk Profile (Optional/Referenced)

**Location**: `{qa.qaLocation}/assessments/{epic}.{story}-risk-{YYYYMMDD}.md`

**Generated By**: `risk-profile` task (may be called during review)

**Purpose**: Detailed risk assessment matrix (probability × impact)

### Output 4: NFR Assessment (Optional/Referenced)

**Location**: `{qa.qaLocation}/assessments/{epic}.{story}-nfr-{YYYYMMDD}.md`

**Generated By**: `nfr-assess` task (may be called during review)

**Purpose**: Detailed non-functional requirements validation

---

## 7. Error Handling & Validation

### Error Condition 1: Story File Not Found
**Detection**: Story path resolution fails
**Handling**: HALT with error message, request correct story ID or path
**Recovery**: User provides corrected input

### Error Condition 2: Story Status Not "Review"
**Detection**: Check story Status field
**Handling**: HALT with message explaining prerequisites
**Recovery**: User updates story status to "Review" first

### Error Condition 3: Incomplete File List
**Detection**: File List section empty or suspiciously short
**Handling**: HALT with warning, request Dev to update File List
**Recovery**: Dev updates File List, then retry review

### Error Condition 4: No Tests When Required
**Detection**: File List contains no test files (*.test.*, *.spec.*, __tests__/)
**Handling**: Depends on story requirements:
- If story explicitly requires tests → FAIL gate with high-severity issue
- If tests genuinely not needed (docs, config) → Document in gate notes
**Recovery**: Dev adds tests or provides justification

### Error Condition 5: Tests Failing
**Detection**: Prerequisites state "all automated tests are passing"
**Handling**: HALT with message to fix failing tests first
**Recovery**: Dev fixes tests, then retry review

### Error Condition 6: Refactoring Breaks Tests
**Detection**: After refactoring, test suite fails
**Handling**: Revert refactoring changes immediately
**Documentation**: Note as recommendation instead of completed refactoring
**Recovery**: Automatic (revert and continue)

### Error Condition 7: Gate Directory Doesn't Exist
**Detection**: `{qa.qaLocation}/gates/` directory missing
**Handling**: Create directory automatically
**Recovery**: Automatic

### Error Condition 8: Critical Architectural Issues
**Detection**: During code quality review (Step 2B)
**Handling**: HALT with detailed explanation of architectural concern
**Recovery**: User/team discusses and decides approach (may involve SM, Architect, PO)

### Validation Rules

**Pre-execution Validation**:
- ✓ Story file exists and readable
- ✓ Story status is "Review"
- ✓ File List is non-empty
- ✓ All required config paths defined in core-config.yaml
- ✓ Template file (qa-gate-tmpl.yaml) exists

**During Execution Validation**:
- ✓ All refactorings pass test suite
- ✓ All ACs have corresponding implementation
- ✓ Standard compliance documents exist and accessible
- ✓ NFR targets defined or documented as unknown

**Post-execution Validation**:
- ✓ QA Results section successfully appended to story file
- ✓ Gate file successfully created in correct location
- ✓ All file references in outputs are valid paths
- ✓ Gate decision follows deterministic criteria

---

## 8. Dependencies & Prerequisites

### Task Dependencies

The review-story task orchestrates multiple sub-tasks (may be called internally):

1. **risk-profile.md** (optional)
   - When: If deep review or high-risk signals detected
   - Purpose: Generate detailed risk assessment matrix
   - Output: Risk profile document + risk_summary data for gate

2. **test-design.md** (optional)
   - When: If test strategy needs validation
   - Purpose: Validate test scenarios and level appropriateness
   - Output: Test design assessment + P0 gap identification

3. **trace-requirements.md** (optional)
   - When: Always for requirements traceability
   - Purpose: Map ACs to tests with Given-When-Then
   - Output: Traceability matrix + coverage gap list

4. **nfr-assess.md** (optional)
   - When: Always for NFR validation
   - Purpose: Validate security, performance, reliability, maintainability
   - Output: NFR assessment + status for each dimension

5. **qa-gate.md** (optional)
   - When: At end of review for gate file creation
   - Purpose: Create standalone quality gate YAML file
   - Output: Gate file in qa.qaLocation/gates/

### Template Dependencies

1. **qa-gate-tmpl.yaml** (required)
   - Location: `.bmad-core/templates/qa-gate-tmpl.yaml`
   - Purpose: Template for quality gate YAML file
   - Schema: Version 1

2. **story-tmpl.yaml** (reference)
   - Location: `.bmad-core/templates/story-tmpl.yaml`
   - Purpose: Defines section permissions (QA can only edit QA Results)
   - Schema: Version 2.0

### Data File Dependencies

1. **test-levels-framework.md** (optional)
   - Location: `.bmad-core/data/test-levels-framework.md`
   - Purpose: Unit/Integration/E2E decision criteria
   - Usage: Reference during test architecture assessment (Step 2C)

2. **test-priorities-matrix.md** (optional)
   - Location: `.bmad-core/data/test-priorities-matrix.md`
   - Purpose: P0/P1/P2/P3 classification system
   - Usage: Reference for test coverage gap severity (Step 2A)

3. **technical-preferences.md** (optional)
   - Location: `.bmad-core/data/technical-preferences.md`
   - Purpose: Custom quality score weights, risk thresholds
   - Usage: Customize gate decision criteria if defined

### Configuration Dependencies

**core-config.yaml** (required):
```yaml
devStoryLocation: "docs/stories"  # Location of story files
qa:
  qaLocation: "docs/qa"            # Base directory for QA outputs
  # Subdirectories (created if missing):
  # - qa.qaLocation/gates/         → Quality gate files
  # - qa.qaLocation/assessments/   → Detailed assessment reports
technicalPreferences: "docs/technical-preferences.md"  # Optional
```

### Document Dependencies

**Standard Documents** (should exist in project):
1. `docs/coding-standards.md` - For compliance check (Step 4)
2. `docs/unified-project-structure.md` - For compliance check (Step 4)
3. `docs/testing-strategy.md` - For compliance check (Step 4)

**Story File** (required):
- Must exist at `{devStoryLocation}/{epic}.{story}.*.md`
- Must have Status field set to "Review"
- Must have complete Acceptance Criteria section
- Must have complete File List in Dev Agent Record
- Must have complete Tasks / Subtasks section

### Prerequisites

**Before review-story can execute**:
1. ✓ Story status must be "Review"
2. ✓ Developer has completed all tasks (all checkboxes marked [x])
3. ✓ Developer has updated File List with all modified files
4. ✓ All automated tests are passing (no failing tests)
5. ✓ Code has been committed (for diff calculation)
6. ✓ core-config.yaml properly configured with all required paths

**Soft Prerequisites** (warnings if missing):
- Previous gate file exists (for FAIL/CONCERNS detection)
- Risk profile exists (for risk threshold checks)
- Standard documents exist (for compliance checks)

---

## 9. Integration Points

### Integration with Other Tasks

**Upstream Tasks** (tasks that must complete before review-story):
1. **create-next-story** (SM agent) - Creates the story file
2. **validate-next-story** (PO agent) - Validates story before implementation
3. **Story implementation** (Dev agent) - Implements all tasks and subtasks
4. **execute-checklist** (Dev agent) - Story DoD checklist self-assessment

**Downstream Tasks** (tasks that may follow review-story):
1. **apply-qa-fixes** (Dev agent) - Addresses issues found in review
2. **qa-gate** (QA agent) - Standalone gate update after fixes applied
3. **Story completion** (Dev/PO) - Final status update to "Done"

### Integration with Other Agents

**QA → Dev Workflow**:
```
QA performs review-story
  → Creates QA Results with unchecked improvements
  → Creates gate file (CONCERNS or FAIL)
  → Recommends status: "Changes Required"

Dev receives feedback
  → Executes apply-qa-fixes task
  → Addresses unchecked items from Improvements Checklist
  → Updates File List if new files modified
  → Sets story status back to "Review"

QA performs second review-story
  → Verifies fixes applied
  → Updates gate file (likely PASS)
  → Recommends status: "Ready for Done"

Dev/PO sets final status
  → Story status updated to "Done"
  → Epic progress updated
```

**QA → SM Integration**:
- If requirements clarification needed → Unchecked item with `suggested_owner: sm`
- SM may need to update story acceptance criteria
- Review repeated after clarification

**QA → PO Integration**:
- If business decision needed → Unchecked item with `suggested_owner: po`
- PO may choose to waive issues (gate becomes WAIVED)
- PO validates final "Done" status

### Shared Artifacts

**Story File** (shared with SM, Dev, PO):
- SM creates and owns Story, AC, Tasks, Dev Notes sections
- Dev owns Dev Agent Record section (all subsections)
- QA owns QA Results section (exclusive)
- All agents can read entire file

**Gate File** (created by QA):
- QA creates and owns gate file
- Dev reads gate file to understand issues
- PO may read gate file for waiver decisions
- SM may reference gate file for process insights

**Standard Documents** (shared with all agents):
- coding-standards.md (Dev creates, QA validates)
- unified-project-structure.md (Architect creates, QA validates)
- testing-strategy.md (QA creates, Dev implements)

---

## 10. Configuration References

### core-config.yaml Schema

```yaml
# Story location configuration
devStoryLocation: "docs/stories"  # Required: Location of story files

# QA configuration
qa:
  qaLocation: "docs/qa"  # Required: Base directory for QA outputs
  # Subdirectories (auto-created):
  # - gates/        → Quality gate YAML files
  # - assessments/  → Detailed assessment reports

# Technical preferences (optional)
technicalPreferences: "docs/technical-preferences.md"  # Custom weights, thresholds

# Standard documents (used for compliance checks)
codingStandards: "docs/coding-standards.md"           # Optional path override
projectStructure: "docs/unified-project-structure.md" # Optional path override
testingStrategy: "docs/testing-strategy.md"           # Optional path override
```

### Path Resolution Examples

**Story File Path Resolution**:
```
Input: story_id = "1.3"
Config: devStoryLocation = "docs/stories"
Pattern: {devStoryLocation}/{epic}.{story}.*.md
Resolved: "docs/stories/1.3.*.md"
Glob match: "docs/stories/1.3.user-authentication.md"
```

**Gate File Path Resolution**:
```
Input: story_id = "1.3", story_slug = "user-authentication"
Config: qa.qaLocation = "docs/qa"
Pattern: {qa.qaLocation}/gates/{epic}.{story}-{slug}.yml
Resolved: "docs/qa/gates/1.3-user-authentication.yml"
```

**Assessment File Path Resolution**:
```
Input: story_id = "1.3", assessment_type = "risk", date = "20250112"
Config: qa.qaLocation = "docs/qa"
Pattern: {qa.qaLocation}/assessments/{epic}.{story}-{type}-{YYYYMMDD}.md
Resolved: "docs/qa/assessments/1.3-risk-20250112.md"
```

### Configuration-Driven Behaviors

**Quality Score Calculation**:
- **Default**: `100 - (20 × FAILs) - (10 × CONCERNS)`
- **Custom**: If `technical-preferences.md` defines weights, use those instead

**Risk Thresholds**:
- **Default**: `risk_score >= 9` → FAIL, `risk_score >= 6` → CONCERNS
- **Custom**: Override via technical-preferences.md

**Review Depth Triggers**:
- **Default**: 5 auto-escalation conditions (see Step 1)
- **Custom**: Additional triggers can be defined in technical-preferences.md

**Gate Expiry**:
- **Default**: 2 weeks from review date
- **Custom**: Override via qa.expiryDays in core-config.yaml

---

## 11. Special Features & Behaviors

### Feature 1: Active Refactoring Authority

**Uniqueness**: QA agent is the ONLY agent with authority to directly modify code during review.

**Scope**:
- Refactor code where safe and appropriate
- Run tests after each change to ensure no breakage
- Document all changes in QA Results with WHY and HOW
- Stay within safety boundaries (no behavior changes)

**Examples**:
- Extract method from long function
- Rename variables for clarity
- Remove code duplication (DRY violations)
- Simplify complex conditionals
- Add missing error handling
- Improve test organization
- Add comments for complex logic

**Boundaries**:
- ❌ Do NOT change acceptance criteria
- ❌ Do NOT change story status or tasks
- ❌ Do NOT add new features
- ❌ Do NOT change behavior (only structure/quality)
- ✅ DO improve readability
- ✅ DO remove duplication
- ✅ DO add error handling
- ✅ DO improve test quality

### Feature 2: Adaptive Review Depth

**Intelligence**: Automatically adjusts thoroughness based on risk signals.

**Triggers** (any one triggers deep review):
1. Auth/payment/security files touched
2. No tests added to story
3. Diff > 500 lines
4. Previous gate was FAIL/CONCERNS
5. Story has > 5 acceptance criteria

**Impact**:
- **Deep review**: All 6 analysis dimensions performed exhaustively, may call risk-profile and test-design tasks
- **Standard review**: Focus on requirements traceability and critical path validation

**Benefit**: Efficient use of context/time while ensuring high-risk changes get thorough review.

### Feature 3: Deterministic Gate Criteria

**Transparency**: Gate decisions follow explicit, repeatable rules (not subjective).

**Rule Application Order**:
1. Risk thresholds (if risk_summary present)
2. Test coverage gaps (if trace available)
3. Issue severity (if top_issues present)
4. NFR statuses (always evaluated)
5. Waiver override (if applicable)

**Benefit**: Consistent, predictable, auditable gate decisions.

### Feature 4: Advisory (Not Blocking) Philosophy

**Principle**: QA provides expert guidance but teams choose their quality bar.

**Implementation**:
- Gate statuses are RECOMMENDATIONS, not mandates
- Story owner (Dev or PO) decides final status
- Waiver mechanism for conscious acceptance of issues
- Educational feedback focused on learning
- Clear rationale for all decisions

**Contrast with Traditional QA**:
- Traditional: QA blocks release until all issues fixed
- BMad QA: QA documents issues, team decides risk acceptance

### Feature 5: Dual Output Generation

**Efficiency**: Single review produces two artifacts with different purposes.

**Output 1: Story Update** (markdown)
- **Audience**: Development team (Dev, SM, PO)
- **Purpose**: Detailed findings, refactoring notes, improvement checklist
- **Format**: Markdown (human-readable, embedded in story)
- **Location**: Appended to story file

**Output 2: Gate File** (YAML)
- **Audience**: Process automation, dashboards, metrics
- **Purpose**: Machine-parseable quality decision
- **Format**: YAML (structured, version-controlled)
- **Location**: Standalone file in qa.qaLocation/gates/

**Benefit**: Both human and machine consumers satisfied with single review execution.

### Feature 6: Evidence-Based Assessment

**Rigor**: All findings must cite specific sections, files, or test results.

**Requirements**:
- No vague statements ("code quality is poor")
- Specific findings with file references ("Missing rate limiting in api/auth/login.ts:42-68")
- Quantifiable metrics where possible (test count, coverage %, risk scores)
- Source citations for all claims

**Example**:
- ❌ Poor: "Security issues found"
- ✅ Good: "SEC-001 (high): No rate limiting on login endpoint (api/auth/login.ts:42). Recommend adding rate-limit-middleware before production."

### Feature 7: Orchestrated Sub-Task Execution

**Complexity**: review-story can orchestrate multiple sub-tasks transparently.

**Sub-tasks that may be called**:
- `risk-profile` - For deep review or high-risk signals
- `test-design` - For test strategy validation
- `trace-requirements` - For AC-to-test mapping
- `nfr-assess` - For NFR validation
- `qa-gate` - For gate file creation

**Orchestration Logic**:
```
IF deep_review OR high_risk_signals THEN
  CALL risk-profile
  INCLUDE risk_summary in gate
END IF

IF test_strategy_validation_needed THEN
  CALL test-design
  CHECK for P0 gaps
END IF

ALWAYS CALL trace-requirements
ALWAYS CALL nfr-assess

CALL qa-gate to create gate file
```

**Transparency**: User sees single review execution, not multiple task calls.

### Feature 8: Quality Score Calculation

**Formula** (default):
```
quality_score = 100 - (20 × count(FAIL)) - (10 × count(CONCERNS))
quality_score = max(0, min(100, quality_score))  # Bounded 0-100
```

**Custom Weights** (from technical-preferences.md):
```yaml
quality_score_weights:
  fail_penalty: 25      # Instead of 20
  concerns_penalty: 12  # Instead of 10
```

**Usage**:
- Included in gate file (optional field)
- Can be used for metrics/dashboards
- Can trigger alerts if below threshold

### Feature 9: Gate History Tracking

**Audit Trail**: Gate file can include history section showing all gate decisions.

**Structure**:
```yaml
history:
  - at: "2025-01-12T10:00:00Z"
    gate: FAIL
    note: "Initial review - missing tests"
  - at: "2025-01-12T15:00:00Z"
    gate: CONCERNS
    note: "Tests added but rate limiting still missing"
  - at: "2025-01-13T09:00:00Z"
    gate: PASS
    note: "All issues addressed, comprehensive test coverage"
```

**Benefit**: Complete audit trail of quality journey for story.

---

## 12. Critical Insights

### Insight 1: Active Refactoring is Unique
QA agent is the ONLY agent with authority to directly modify code during review. This blurs the traditional boundary between QA (test/report) and Dev (implement/fix). It reflects a philosophy of **collaborative quality** where QA doesn't just find issues but actively improves code when safe to do so.

### Insight 2: Advisory vs Blocking Philosophy
Unlike traditional QA that blocks releases, BMad QA provides expert guidance while empowering teams to choose their quality bar. The waiver mechanism acknowledges that sometimes shipping with known issues is the right business decision.

### Insight 3: Adaptive Review Depth is Efficient
Auto-escalation to deep review based on risk signals prevents both:
- **Over-review**: Low-risk changes don't get unnecessary scrutiny
- **Under-review**: High-risk changes automatically get thorough analysis

### Insight 4: Deterministic Gate Criteria Ensure Consistency
The rule-based gate decision algorithm eliminates subjectivity and ensures two different QA agents (or the same agent at different times) would reach the same gate decision given identical inputs.

### Insight 5: Dual Output Serves Two Audiences
- **Story update** (markdown) serves human readers (Dev team)
- **Gate file** (YAML) serves automation (CI/CD, dashboards, metrics)

Single execution satisfies both needs efficiently.

### Insight 6: Section Permissions Prevent Accidents
Story template enforces that QA can ONLY edit QA Results section. This prevents QA from accidentally modifying acceptance criteria, tasks, or dev notes while updating review findings.

### Insight 7: Unknown Targets Policy is Pragmatic
When performance targets or security requirements are undefined in story, QA marks NFR as CONCERNS rather than guessing or failing arbitrarily. This encourages teams to define targets explicitly.

### Insight 8: Review-Story is Orchestrator, Not Monolith
While review-story appears as a single command, it intelligently orchestrates multiple sub-tasks (risk-profile, test-design, trace-requirements, nfr-assess, qa-gate) based on context and needs.

### Insight 9: Evidence-Based Assessment Maintains Rigor
Requirement for specific file references, line numbers, and examples prevents vague or subjective feedback and ensures all findings are actionable.

### Insight 10: Quality Score is Optional but Valuable
Quality score calculation is optional (can be omitted from gate file) but provides useful quantitative metric for tracking quality trends across stories.

### Insight 11: Test Levels Framework Promotes Efficiency
By referencing test-levels-framework.md, QA ensures tests are at appropriate levels (unit vs integration vs E2E), avoiding the common anti-pattern of testing business logic with slow E2E tests.

### Insight 12: Requirements Traceability is Documentation, Not Code
The trace-requirements sub-task documents requirement-to-test mappings using Given-When-Then for human understanding, NOT for generating test code. This is a documentation/audit activity, not code generation.

### Insight 13: Comprehensive Review Has 6 Dimensions
The 6-part analysis (requirements traceability, code quality, test architecture, NFRs, testability, technical debt) provides holistic quality assessment beyond just "did tests pass?"

### Insight 14: Blocking Conditions Preserve Quality
Strict blocking conditions (story not in Review status, missing File List, failing tests) ensure review only proceeds when prerequisites are met, maintaining assessment integrity.

### Insight 15: Story Owner Decides Final Status
QA recommends next status but story owner (Dev or PO) makes final decision. This respects team autonomy while providing expert guidance.

---

## 13. ADK Translation Recommendations

### High Priority

#### 1. Reasoning Engine for Complex Orchestration
**Requirement**: Multi-step workflow with state management, conditional logic, and sub-task orchestration.

**Implementation**:
```python
from google.cloud import reasoning_engine

class ReviewStoryWorkflow:
    """
    Reasoning Engine workflow for comprehensive story review.
    Implements 6-step adaptive review process.
    """

    def __init__(self, config):
        self.config = config
        self.firestore = firestore.Client()
        self.storage = storage.Client()

    def execute(self, story_id: str) -> dict:
        """Main execution flow."""

        # Step 0: Load story and config
        story = self.load_story(story_id)
        config = self.load_core_config(story.project_id)

        # Step 1: Risk assessment (determines review depth)
        risk_signals = self.assess_risk_signals(story)
        review_depth = "deep" if risk_signals else "standard"

        # Step 2: Comprehensive analysis (6 dimensions)
        analysis = {
            "requirements_traceability": self.analyze_traceability(story),
            "code_quality": self.analyze_code_quality(story),
            "test_architecture": self.analyze_test_architecture(story),
            "nfrs": self.analyze_nfrs(story),
            "testability": self.evaluate_testability(story),
            "technical_debt": self.identify_technical_debt(story)
        }

        # Step 3: Active refactoring (if appropriate)
        refactorings = self.perform_safe_refactorings(story, analysis)

        # Step 4: Standards compliance
        compliance = self.check_standards_compliance(story, config)

        # Step 5: Acceptance criteria validation
        ac_validation = self.validate_acceptance_criteria(story, analysis)

        # Step 6: Documentation review
        doc_review = self.review_documentation(story)

        # Generate outputs
        qa_results = self.generate_qa_results(
            story, analysis, refactorings, compliance, ac_validation, doc_review
        )
        gate = self.determine_gate_status(analysis, risk_signals)

        # Update story and create gate file
        self.append_qa_results_to_story(story, qa_results)
        self.create_gate_file(story, gate, config)

        return {
            "story_id": story_id,
            "gate_status": gate["gate"],
            "recommended_status": gate["recommended_status"],
            "qa_results_location": self.get_story_path(story_id),
            "gate_file_location": self.get_gate_path(story_id, config)
        }
```

#### 2. Sub-Task Orchestration Service
**Requirement**: Call risk-profile, test-design, trace-requirements, nfr-assess, qa-gate sub-tasks conditionally.

**Implementation**:
```python
class SubTaskOrchestrator:
    """Orchestrates conditional execution of QA sub-tasks."""

    def __init__(self):
        self.task_executor = CloudFunctionInvoker()

    def orchestrate(self, story, review_depth):
        results = {}

        # Conditional: risk-profile (if deep review or high-risk signals)
        if review_depth == "deep" or self.has_high_risk_signals(story):
            results["risk_profile"] = self.task_executor.invoke(
                "risk-profile", {"story_id": story.id}
            )

        # Always: trace-requirements
        results["trace"] = self.task_executor.invoke(
            "trace-requirements", {"story_id": story.id}
        )

        # Always: nfr-assess
        results["nfr"] = self.task_executor.invoke(
            "nfr-assess", {"story_id": story.id}
        )

        # Conditional: test-design (if test strategy validation needed)
        if self.needs_test_design_validation(story):
            results["test_design"] = self.task_executor.invoke(
                "test-design", {"story_id": story.id}
            )

        return results
```

#### 3. Deterministic Gate Decision Engine
**Requirement**: Rule-based gate status determination with explicit, repeatable logic.

**Implementation**:
```python
class GateDecisionEngine:
    """Deterministic gate decision algorithm."""

    def determine_gate(self, analysis, risk_summary, trace, nfr_validation, top_issues, waiver):
        """
        Apply gate decision rules in order:
        1. Risk thresholds
        2. Test coverage gaps
        3. Issue severity
        4. NFR statuses
        5. Waiver override
        """

        # Rule 1: Risk thresholds
        if risk_summary:
            if any(risk["score"] >= 9 for risk in risk_summary["risks"]):
                return "FAIL"  # Unless waived
            elif any(risk["score"] >= 6 for risk in risk_summary["risks"]):
                return "CONCERNS"

        # Rule 2: Test coverage gaps
        if trace:
            if any(test["priority"] == "P0" and not test["covered"] for test in trace["tests"]):
                if test["category"] in ["security", "data_loss"]:
                    return "FAIL"
                else:
                    return "CONCERNS"

        # Rule 3: Issue severity
        if top_issues:
            if any(issue["severity"] == "high" for issue in top_issues):
                return "FAIL"  # Unless waived
            elif any(issue["severity"] == "medium" for issue in top_issues):
                return "CONCERNS"

        # Rule 4: NFR statuses
        if nfr_validation:
            if any(nfr["status"] == "FAIL" for nfr in nfr_validation.values()):
                return "FAIL"
            elif any(nfr["status"] == "CONCERNS" for nfr in nfr_validation.values()):
                return "CONCERNS"

        # Rule 5: Waiver override
        if waiver and waiver.get("active"):
            return "WAIVED"

        # Default: PASS
        return "PASS"
```

#### 4. Section Permission Enforcement
**Requirement**: Enforce that QA can ONLY edit QA Results section of story file.

**Implementation**:
```python
class SectionPermissionGuard:
    """Enforces section-level edit permissions on story files."""

    SECTION_PERMISSIONS = {
        "qa": ["QA Results"],  # QA can ONLY edit this section
        "dev": ["Dev Agent Record", "Status", "Change Log"],
        "sm": ["Story", "Acceptance Criteria", "Tasks / Subtasks", "Dev Notes"]
    }

    def validate_edit(self, agent, section):
        """Validate agent has permission to edit section."""
        allowed_sections = self.SECTION_PERMISSIONS.get(agent, [])
        if section not in allowed_sections:
            raise PermissionError(
                f"{agent} agent cannot edit {section} section. "
                f"Allowed sections: {allowed_sections}"
            )

    def append_qa_results(self, story_content, qa_results):
        """Safely append QA Results to story file."""
        # Parse story markdown
        sections = self.parse_story_sections(story_content)

        # Validate permission
        self.validate_edit("qa", "QA Results")

        # Find or create QA Results section
        if "QA Results" in sections:
            # Append new entry below existing entries
            sections["QA Results"] += f"\n\n{qa_results}"
        else:
            # Append at end of file
            story_content += f"\n\n## QA Results\n\n{qa_results}"

        return story_content
```

#### 5. Active Refactoring with Test Validation
**Requirement**: Allow QA to directly refactor code, run tests after each change, revert if tests fail.

**Implementation**:
```python
class SafeRefactoring:
    """Manages safe refactoring with test validation."""

    def __init__(self, test_runner):
        self.test_runner = test_runner
        self.git = GitRepository()

    def perform_refactoring(self, file_path, refactoring_func, description):
        """
        Attempt refactoring, run tests, revert if tests fail.

        Returns: (success, message)
        """
        # Create checkpoint
        checkpoint = self.git.create_checkpoint()

        try:
            # Apply refactoring
            refactoring_func(file_path)

            # Run all tests
            test_result = self.test_runner.run_all_tests()

            if test_result.passed:
                # Tests pass - keep refactoring
                return (True, f"Refactoring successful: {description}")
            else:
                # Tests fail - revert
                self.git.revert_to_checkpoint(checkpoint)
                return (False, f"Refactoring reverted (tests failed): {description}")

        except Exception as e:
            # Error during refactoring - revert
            self.git.revert_to_checkpoint(checkpoint)
            return (False, f"Refactoring failed: {str(e)}")
```

#### 6. Risk Signal Detection
**Requirement**: Auto-detect 5 risk signals to determine review depth.

**Implementation**:
```python
class RiskSignalDetector:
    """Detects risk signals for adaptive review depth selection."""

    HIGH_RISK_PATTERNS = [
        r"auth", r"authentication", r"password", r"login", r"security",
        r"payment", r"billing", r"checkout", r"transaction"
    ]

    def detect_risk_signals(self, story):
        """Returns list of detected risk signals."""
        signals = []

        # Signal 1: Auth/payment/security files touched
        if self.has_high_risk_files(story.file_list):
            signals.append("high_risk_files")

        # Signal 2: No tests added
        if not self.has_tests_in_file_list(story.file_list):
            signals.append("no_tests")

        # Signal 3: Diff > 500 lines
        if self.calculate_diff_lines(story) > 500:
            signals.append("large_diff")

        # Signal 4: Previous gate was FAIL/CONCERNS
        previous_gate = self.load_previous_gate(story.id)
        if previous_gate and previous_gate["gate"] in ["FAIL", "CONCERNS"]:
            signals.append("previous_issues")

        # Signal 5: Story has > 5 acceptance criteria
        if len(story.acceptance_criteria) > 5:
            signals.append("high_complexity")

        return signals

    def has_high_risk_files(self, file_list):
        """Check if any files match high-risk patterns."""
        for file_path in file_list:
            for pattern in self.HIGH_RISK_PATTERNS:
                if re.search(pattern, file_path, re.IGNORECASE):
                    return True
        return False
```

#### 7. Quality Score Calculator
**Requirement**: Calculate quality score using default or custom weights.

**Implementation**:
```python
class QualityScoreCalculator:
    """Calculates quality score with configurable weights."""

    DEFAULT_WEIGHTS = {
        "fail_penalty": 20,
        "concerns_penalty": 10
    }

    def __init__(self, technical_preferences=None):
        if technical_preferences and "quality_score_weights" in technical_preferences:
            self.weights = technical_preferences["quality_score_weights"]
        else:
            self.weights = self.DEFAULT_WEIGHTS

    def calculate(self, fail_count, concerns_count):
        """
        Calculate quality score: 100 - (fail_penalty × FAILs) - (concerns_penalty × CONCERNS)
        Bounded between 0 and 100.
        """
        score = 100 - (self.weights["fail_penalty"] * fail_count) - (self.weights["concerns_penalty"] * concerns_count)
        return max(0, min(100, score))
```

### Medium Priority

#### 8. Compliance Checker Service
**Requirement**: Verify adherence to coding-standards.md, unified-project-structure.md, testing-strategy.md.

**Implementation**: Cloud Function that loads standard documents and validates story implementation against them.

#### 9. NFR Assessment Framework
**Requirement**: Validate 4 core NFRs (security, performance, reliability, maintainability) with PASS/CONCERNS/FAIL.

**Implementation**: Cloud Function with predefined validation rules for each NFR dimension.

#### 10. Testability Evaluator
**Requirement**: Assess controllability, observability, debuggability.

**Implementation**: Cloud Function that analyzes code structure and provides testability scores.

### Low Priority

#### 11. Gate History Tracking
**Requirement**: Append history entries to gate file showing audit trail.

**Implementation**: Firestore collection with append-only gate decision records.

#### 12. Gate Expiry Mechanism
**Requirement**: Set and track gate expiry (typically 2 weeks).

**Implementation**: Firestore timestamp + Cloud Scheduler to alert on expired gates.

#### 13. Technical Debt Identifier
**Requirement**: Detect TODOs, FIXMEs, deprecated dependencies, architecture violations.

**Implementation**: Code analysis service with pattern matching and dependency scanning.

---

## 14. Example Scenarios

### Scenario 1: Standard Review (Low Risk Story)

**Context**: Story 2.5 implements a simple data display feature, 120 lines changed, 3 ACs, 8 tests added.

**Execution**:
1. Risk assessment: No risk signals detected → standard review
2. Comprehensive analysis: Focused on requirements traceability and test coverage
3. Active refactoring: Minor variable renaming for clarity
4. Standards compliance: All ✓
5. AC validation: All 3 ACs fully implemented
6. Documentation: Adequate
7. Gate decision: PASS (no issues found)
8. Recommended status: "Ready for Done"

**Outputs**:
- QA Results: Brief assessment, minor refactoring notes, all compliance checks ✓
- Gate file: PASS with quality_score 100

**Duration**: ~10 minutes (focused review)

### Scenario 2: Deep Review (High Risk Story)

**Context**: Story 1.8 implements user authentication, 650 lines changed, 7 ACs, security-critical files touched.

**Execution**:
1. Risk assessment: 3 signals detected (security files, large diff, >5 ACs) → deep review
2. Comprehensive analysis: All 6 dimensions performed exhaustively
   - Sub-task: risk-profile called → identifies SEC-001, SEC-002, TECH-001
   - Sub-task: test-design called → verifies test levels appropriate
   - Sub-task: trace-requirements called → AC 6 has coverage gap (missing edge case)
   - Sub-task: nfr-assess called → security CONCERNS (no rate limiting), performance PASS
3. Active refactoring: Extracted password validation logic, improved error handling
4. Standards compliance: All ✓
5. AC validation: AC 6 partially implemented (edge case missing)
6. Documentation: API docs need update for new error codes
7. Gate decision: CONCERNS (security CONCERNS + AC gap + documentation gap)
8. Recommended status: "Changes Required"

**Outputs**:
- QA Results: Detailed assessment, refactoring explanations, 3 unchecked improvements
- Gate file: CONCERNS with top_issues (SEC-001, DOC-001), quality_score 80

**Duration**: ~30 minutes (thorough review)

### Scenario 3: Review with Active Refactoring

**Context**: Story 3.2 implements data processing, code quality issues detected.

**Execution**:
1. Risk assessment: No major signals → standard review
2. Code quality review: Detects code duplication, long function (80 lines)
3. Active refactoring:
   - Extract method `validateInput()` from `processData()`
   - Remove duplicate validation logic across 3 files
   - Run tests after each refactoring → all pass ✓
   - Document refactorings in QA Results with WHY and HOW
4. Gate decision: PASS
5. Files modified: Add to QA Results, ask Dev to update File List

**Outputs**:
- QA Results: Detailed refactoring notes (3 refactorings performed)
- Gate file: PASS with refactoring evidence
- Modified files: services/data-processor.ts, utils/validators.ts

**Note**: QA directly improved code quality during review (unique capability).

### Scenario 4: Review Triggers Blocking Condition

**Context**: Story 4.1 marked for review but File List is empty.

**Execution**:
1. Pre-validation: Check prerequisites
2. **HALT**: File List is empty or incomplete
3. Output error message: "Cannot perform review - File List is empty. Please ask Dev to update File List with all modified files."
4. Review not performed

**User Action**: Dev updates File List, sets status back to "Review", retry

### Scenario 5: Review Detects Critical Architectural Issue

**Context**: Story 5.3 implements database migration, code introduces circular dependency.

**Execution**:
1. Risk assessment: Large diff → deep review
2. Code quality review: Detects circular dependency between modules A and B
3. **HALT**: Critical architectural issue requiring discussion
4. Output message: "Critical architectural issue detected: Circular dependency between modules A and B. This violates project architecture principles. Recommend discussing with SM and Architect before proceeding."

**User Action**: Team discusses, decides approach (refactor, accept with waiver, etc.), retry review

### Scenario 6: Multi-Round Review (Iterative Improvement)

**Context**: Story 1.3 implements payment processing.

**Round 1**:
- Gate: FAIL (security critical: missing encryption, no rate limiting, no tests)
- Unchecked improvements: 5 items

**Dev applies fixes**:
- Adds encryption
- Adds rate limiting
- Writes 12 tests
- Updates File List
- Sets status back to "Review"

**Round 2**:
- Gate: CONCERNS (security PASS, but performance CONCERNS: no caching, tests PASS but integration tests missing)
- Unchecked improvements: 2 items

**Dev applies fixes**:
- Adds caching
- Adds integration tests
- Sets status back to "Review"

**Round 3**:
- Gate: PASS (all issues addressed)
- Recommended status: "Ready for Done"

**Audit Trail**: Gate file history section shows 3 entries (FAIL → CONCERNS → PASS).

---

## 15. Comparison with Related Tasks

### review-story vs risk-profile

| Aspect | review-story | risk-profile |
|--------|--------------|--------------|
| **Purpose** | Comprehensive review with gate decision | Risk assessment matrix only |
| **Scope** | 6 analysis dimensions + gate | Probability × impact analysis |
| **Output** | QA Results + gate file | Risk assessment report |
| **Agent** | QA (Quinn) | QA (Quinn) |
| **Duration** | 10-30 minutes | 5-10 minutes |
| **Relationship** | May call risk-profile as sub-task | Standalone or called by review-story |

### review-story vs test-design

| Aspect | review-story | test-design |
|--------|--------------|--------------|
| **Purpose** | Comprehensive review with gate decision | Test strategy design |
| **Scope** | 6 analysis dimensions + gate | Test scenarios + level recommendations |
| **Output** | QA Results + gate file | Test design document |
| **Agent** | QA (Quinn) | QA (Quinn) |
| **Timing** | After implementation (Review status) | During story drafting (Draft status) |
| **Relationship** | May validate test design | Proactive test planning |

### review-story vs trace-requirements

| Aspect | review-story | trace-requirements |
|--------|--------------|--------------|
| **Purpose** | Comprehensive review with gate decision | Requirements-to-test mapping |
| **Scope** | 6 analysis dimensions + gate | AC-to-test traceability with GWT |
| **Output** | QA Results + gate file | Traceability matrix |
| **Agent** | QA (Quinn) | QA (Quinn) |
| **Relationship** | Always calls trace-requirements | Standalone or called by review-story |

### review-story vs nfr-assess

| Aspect | review-story | nfr-assess |
|--------|--------------|--------------|
| **Purpose** | Comprehensive review with gate decision | NFR validation |
| **Scope** | 6 analysis dimensions + gate | Security, performance, reliability, maintainability |
| **Output** | QA Results + gate file | NFR assessment report |
| **Agent** | QA (Quinn) | QA (Quinn) |
| **Relationship** | Always calls nfr-assess | Standalone or called by review-story |

### review-story vs qa-gate

| Aspect | review-story | qa-gate |
|--------|--------------|--------------|
| **Purpose** | Comprehensive review with gate decision | Gate file creation/update |
| **Scope** | Full review + gate creation | Gate file only (no review) |
| **Output** | QA Results + gate file | Gate file only |
| **Agent** | QA (Quinn) | QA (Quinn) |
| **Relationship** | Calls qa-gate to create gate file | Standalone or called by review-story |

### review-story vs apply-qa-fixes

| Aspect | review-story | apply-qa-fixes |
|--------|--------------|--------------|
| **Purpose** | Quality assessment and recommendations | Fix issues found in review |
| **Scope** | Review + recommendations | Implementation of fixes |
| **Output** | QA Results + gate file | Updated code + updated File List |
| **Agent** | QA (Quinn) | Dev (James) |
| **Sequence** | First | Second (after review) |
| **Relationship** | Creates unchecked improvements | Addresses unchecked improvements |

**Typical Flow**:
```
QA: review-story → Creates unchecked improvements + gate (CONCERNS/FAIL)
Dev: apply-qa-fixes → Addresses unchecked improvements
Dev: Sets status back to "Review"
QA: review-story (again) → Verifies fixes + updates gate (likely PASS)
```

---

## 16. Version History & Changes

**Version Analyzed**: BMad Core v4

**Known Changes from Previous Versions**:
- v4: Added active refactoring authority for QA agent
- v4: Added adaptive review depth based on risk signals
- v4: Added deterministic gate decision algorithm
- v4: Added quality score calculation
- v4: Added section permission enforcement (QA can only edit QA Results)
- v3: Added NFR assessment integration
- v2: Added gate file creation
- v1: Initial review task (story update only)

**Template Version Dependencies**:
- qa-gate-tmpl.yaml: v1.0
- story-tmpl.yaml: v2.0 (section permissions added)

**Breaking Changes**:
- v3→v4: Added section permission enforcement (may break custom workflows that assumed QA could edit other sections)
- v2→v3: NFR assessment now required (may need to create nfr-assess task)

---

## 17. Future Enhancements

### Potential Enhancement 1: AI-Assisted Refactoring Suggestions
**Idea**: Use LLM to suggest refactorings beyond simple patterns (e.g., "this function could benefit from strategy pattern").

**Benefit**: More sophisticated refactoring suggestions.

**Challenge**: Ensuring suggestions are safe and appropriate.

### Potential Enhancement 2: Visual Diff Integration
**Idea**: Integrate visual diff tool to show before/after of refactorings in QA Results.

**Benefit**: Easier understanding of changes made during review.

**Challenge**: Markdown formatting for diffs.

### Potential Enhancement 3: Automated Test Generation
**Idea**: If coverage gaps identified, auto-generate test scaffolding for Dev to complete.

**Benefit**: Faster gap closure.

**Challenge**: Generated tests may not match project style or be maintainable.

### Potential Enhancement 4: Security Vulnerability Scanning
**Idea**: Integrate automated security scanning tools (e.g., Snyk, SonarQube) into security NFR assessment.

**Benefit**: Catch known vulnerabilities automatically.

**Challenge**: False positives, tool integration complexity.

### Potential Enhancement 5: Performance Profiling Integration
**Idea**: Automatically run performance profiler during review, include results in performance NFR.

**Benefit**: Data-driven performance assessment.

**Challenge**: Profiling overhead, environment setup.

### Potential Enhancement 6: Code Metrics Dashboard
**Idea**: Send quality scores, gate decisions, and trends to dashboard for visualization.

**Benefit**: Team visibility into quality trends over time.

**Challenge**: Dashboard setup, metric selection.

### Potential Enhancement 7: Custom Risk Signal Configuration
**Idea**: Allow teams to define custom risk signal patterns in technical-preferences.md.

**Benefit**: Adapt risk detection to team-specific concerns.

**Challenge**: Configuration complexity.

### Potential Enhancement 8: Parallel Sub-Task Execution
**Idea**: Execute risk-profile, test-design, trace-requirements, nfr-assess in parallel instead of sequentially.

**Benefit**: Faster review completion.

**Challenge**: Orchestration complexity, dependency management.

---

## Conclusion

The `review-story` task is the **most complex and comprehensive workflow** in the BMad QA agent's toolkit. It orchestrates multiple analysis dimensions, sub-tasks, and outputs to provide holistic quality assessment with actionable recommendations. Key distinguishing features include:

1. **Active refactoring authority** - Unique capability to improve code directly during review
2. **Adaptive review depth** - Intelligent escalation based on risk signals
3. **Deterministic gate criteria** - Transparent, repeatable decision algorithm
4. **Advisory philosophy** - Expert guidance without arbitrary blocking
5. **Dual output generation** - Both human-readable (story update) and machine-parseable (gate file) artifacts

This task exemplifies BMad's philosophy of **collaborative quality** where QA doesn't just report issues but actively improves code and empowers teams to make informed risk decisions.

**Critical Success Factors for ADK Implementation**:
- Reasoning Engine for complex orchestration logic
- Section permission enforcement for safety
- Safe refactoring with test validation
- Deterministic gate decision engine
- Sub-task orchestration service
- Risk signal detection system

By implementing these components, the Vertex AI ADK version of review-story can replicate the sophisticated quality assessment capabilities of the BMad framework while leveraging Google Cloud's scalability and infrastructure.

---

**Document Version**: 1.0
**Created**: 2025-10-14
**Author**: Claude Code (AI Agent)
**Task Analysis Project**: BMad Framework Reverse Engineering for Google Vertex AI ADK
