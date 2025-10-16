# Task Analysis: trace-requirements

**Task ID**: `trace-requirements`
**Task File**: `.bmad-core/tasks/trace-requirements.md`
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: Medium (Requirements mapping, coverage analysis, gap identification)

---

## 1. Purpose & Scope

### Primary Purpose
Create a comprehensive requirements traceability matrix that maps every story requirement (primarily acceptance criteria) to corresponding test cases using Given-When-Then patterns. This task ensures complete test coverage, identifies gaps, and provides a structured mapping for quality validation.

### Scope Definition
- **In Scope**:
  - Extracting all testable requirements from story (ACs, user story, tasks, NFRs, edge cases)
  - Mapping each requirement to existing test cases using Given-When-Then documentation
  - Analyzing coverage levels (full, partial, none, integration-only, unit-only)
  - Identifying critical coverage gaps with severity assessment
  - Generating structured outputs (traceability matrix + YAML gate block)
  - Recommending additional tests for gaps
  - Feeding quality gate decisions (gaps → FAIL/CONCERNS, full coverage → PASS)
  - Cross-referencing test design outputs for validation

- **Out of Scope**:
  - Writing or implementing actual test code
  - Running or executing tests
  - Test data generation or fixture creation
  - Modifying existing tests
  - Test automation framework configuration
  - CI/CD pipeline integration

### Key Deliverables
1. **Traceability Report** (markdown) - Requirements-to-test mappings with Given-When-Then documentation
2. **Gate YAML Block** - Coverage summary and gaps for quality gate file
3. **Story Hook Line** - Reference line for review-story task to quote

### Relationship to Other Tasks
- **test-design**: Uses test design output as reference for mapping scenarios to tests
- **review-story**: Provides trace block for gate YAML aggregation
- **qa-gate**: Coverage gaps contribute to gate decision (FAIL/CONCERNS/PASS)
- **risk-profile**: High-risk requirements should have priority coverage validation

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md' # Resolved from core-config.yaml
  - story_title: '{title}' # If missing, derive from story H1
  - story_slug: '{slug}' # If missing, derive from title
```

**Input Details**:
- **story_id**: Numeric identifier in format `{epic}.{story}` (e.g., "1.3" = Epic 1, Story 3)
- **story_path**: Full file path to story markdown file, resolved from `core-config.yaml` → `devStoryLocation`
- **story_title**: Human-readable story title (fallback: extract from story file's H1 heading)
- **story_slug**: URL-safe identifier (fallback: derive from title by lowercasing and hyphenating)

### Optional/Contextual Inputs
- **Test Design Output**: If `qa.qaLocation/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md` exists, use as primary reference for test scenarios
- **Test Files**: Actual test code files in project (for mapping to requirements)
- **Story Acceptance Criteria**: From story file, primary source of testable requirements
- **Story Tasks/Subtasks**: Additional testable requirements beyond ACs
- **NFRs**: Non-functional requirements mentioned in story
- **Previous Trace Reports**: If previous traces exist, understand coverage patterns

### Configuration Dependencies

From `core-config.yaml`:
- `devStoryLocation`: Path to story files (required)
- `qa.qaLocation`: Path to QA assessments directory (required)

### Data File Dependencies

**None explicitly specified**, but may reference:
- **test-levels-framework.md**: For understanding test level classifications
- **test-priorities-matrix.md**: For understanding test priorities in coverage analysis

### Test File Discovery
Task requires access to test files in project to map requirements. Typical locations:
- `src/**/*.test.ts`, `src/**/*.spec.ts` (unit tests)
- `tests/integration/**/*.test.ts` (integration tests)
- `tests/e2e/**/*.test.ts`, `cypress/e2e/**/*.cy.ts` (E2E tests)
- `tests/performance/**/*.test.ts` (performance tests)

---

## 3. Execution Flow

### High-Level Process (4 Sequential Steps)

```
Step 1: Extract Requirements
  ↓
Step 2: Map to Test Cases (using Given-When-Then)
  ↓
Step 3: Coverage Analysis
  ↓
Step 4: Gap Identification & Recommendations
  ↓
Outputs: Traceability Report + Gate YAML Block + Story Hook Line
```

### Detailed Step-by-Step Flow

#### Step 1: Extract Requirements

**Action**: Identify all testable requirements from story file.

**Process**:
1. Read story file from `story_path`
2. Extract requirements from multiple sources:

**Primary Source - Acceptance Criteria**:
```yaml
# From story file section: ## Acceptance Criteria
acceptance_criteria:
  - id: AC1
    description: "User can login with valid credentials"
    testable: true
  - id: AC2
    description: "Invalid credentials show error message"
    testable: true
  - id: AC3
    description: "Password reset email sent within 60 seconds"
    testable: true
    nfr_aspect: performance
```

**Secondary Sources**:
- **User Story Statement**: May contain implicit requirements
- **Tasks/Subtasks**: Technical requirements with specific behaviors
- **NFR Mentions**: Performance, security, reliability requirements
- **Edge Cases**: Documented unusual scenarios
- **Error Conditions**: Explicit error handling requirements

**Output**: Comprehensive list of all testable requirements with IDs and descriptions.

**Example Requirements Extraction**:
```yaml
extracted_requirements:
  acceptance_criteria:
    - AC1: "User can login with valid credentials"
    - AC2: "Invalid credentials show error message"
    - AC3: "Password reset email sent within 60 seconds"
  tasks:
    - TASK-1: "Implement JWT token generation on successful login"
    - TASK-2: "Hash passwords using bcrypt"
  nfrs:
    - NFR-1: "Support 1000 concurrent users"
    - NFR-2: "Response time under 200ms"
  edge_cases:
    - EDGE-1: "Multiple concurrent login attempts for same user"
```

---

#### Step 2: Map to Test Cases

**Action**: For each requirement, identify which test cases validate it and document using Given-When-Then.

**Critical Principle**: Given-When-Then is used for **documentation only** (describing what the test validates), NOT for writing actual test code. Tests follow project's testing standards (e.g., describe/it blocks, no BDD syntax in code).

**Process**:
1. For each requirement from Step 1:
2. Search test files for relevant test cases
3. Identify test file path and test case name
4. Document Given-When-Then to describe **what the test validates**:
   - **Given**: Initial context the test sets up
   - **When**: Action the test performs
   - **Then**: Expected outcomes the test asserts
5. Classify coverage level (see Step 3)
6. Note test level (unit/integration/e2e)

**Mapping Format**:
```yaml
requirement: 'AC1: User can login with valid credentials'
test_mappings:
  # Unit test - validates login logic
  - test_file: 'auth/auth.service.test.ts'
    test_case: 'should successfully authenticate with valid email and password'
    # Given-When-Then describes WHAT the test validates, not HOW it's coded
    given: 'A registered user with valid credentials'
    when: 'Authentication method is called with email and password'
    then: 'Returns authenticated user object with JWT token'
    coverage: unit
    level: unit

  # Integration test - validates API endpoint
  - test_file: 'auth/login.integration.test.ts'
    test_case: 'POST /auth/login returns 200 with token for valid credentials'
    given: 'User exists in database with hashed password'
    when: 'POST request to /auth/login with valid credentials'
    then: 'Returns 200 status, JWT token, and user profile'
    coverage: integration
    level: integration

  # E2E test - validates user journey
  - test_file: 'e2e/auth-flow.test.ts'
    test_case: 'user can complete login flow and access dashboard'
    given: 'User on login page'
    when: 'Entering valid credentials and submitting form'
    then: 'Dashboard page loads with user-specific data'
    coverage: integration
    level: e2e
```

**Given-When-Then Documentation Guidelines**:

**Given** - Initial context:
- What state/data the test prepares
- User context being simulated
- System preconditions (database state, API availability, etc.)
- Mock/stub configurations

**When** - Action performed:
- What the test executes
- API calls or user actions tested
- Events triggered
- Functions invoked

**Then** - Expected outcomes:
- Expected outcomes verified
- State changes checked
- Values validated
- Error conditions asserted

**Multi-Test Mapping**: Single requirement may map to multiple tests at different levels (unit for logic, integration for API, e2e for UX).

---

#### Step 3: Coverage Analysis

**Action**: Evaluate the completeness of test coverage for each requirement.

**Coverage Levels**:

**Coverage Classifications**:
```yaml
coverage_levels:
  full:
    description: "Requirement completely tested at appropriate levels"
    criteria: "All aspects of requirement validated, including happy path, error cases, edge cases"
    example: "AC has unit tests for logic + integration tests for API + e2e test for UX"

  partial:
    description: "Some aspects tested, but gaps exist"
    criteria: "Happy path tested but missing error cases, or only one test level when multiple appropriate"
    example: "Login success tested, but not invalid credentials or account lockout"

  none:
    description: "No test coverage found"
    criteria: "Zero tests map to this requirement"
    example: "AC3: Password reset timing - no tests found"

  integration:
    description: "Covered in integration/e2e tests only"
    criteria: "Higher-level tests exist, but no unit tests for underlying logic"
    example: "API endpoint tested, but business logic not unit tested"
    note: "May indicate gap if complex logic should have unit tests"

  unit:
    description: "Covered in unit tests only"
    criteria: "Logic tested, but no integration or e2e validation"
    example: "Function tested in isolation, but not in real system context"
    note: "May indicate gap if integration/e2e validation needed"
```

**Analysis Process**:
1. For each requirement, count test mappings at each level
2. Evaluate if coverage is appropriate for requirement type:
   - **Business Logic**: Should have unit tests
   - **API Endpoints**: Should have integration tests
   - **User Journeys**: Should have e2e tests
   - **NFRs**: Should have appropriate specialized tests (performance, security, etc.)
3. Classify coverage as full/partial/none
4. Document coverage rationale

**Example Coverage Analysis**:
```yaml
coverage_analysis:
  - requirement: 'AC1: User can login with valid credentials'
    tests_found: 3 # unit + integration + e2e
    coverage: full
    rationale: "Complete coverage across all test levels - logic, API, and UX validated"

  - requirement: 'AC2: Invalid credentials show error message'
    tests_found: 2 # integration + e2e
    coverage: partial
    rationale: "Missing unit tests for credential validation logic"
    gap: "No unit test for validateCredentials() function error path"

  - requirement: 'AC3: Password reset email sent within 60 seconds'
    tests_found: 0
    coverage: none
    rationale: "No tests found for email timing requirement"
    gap: "Missing integration test for email service SLA"

  - requirement: 'NFR-1: Support 1000 concurrent users'
    tests_found: 0
    coverage: none
    rationale: "No load testing implemented"
    gap: "Missing performance tests for concurrency"
```

**Coverage Summary Statistics**:
```yaml
totals:
  requirements: 10
  full: 4 # 40%
  partial: 3 # 30%
  none: 3 # 30%
```

---

#### Step 4: Gap Identification & Recommendations

**Action**: Document coverage gaps with severity assessment and recommend specific tests.

**Gap Documentation Format**:
```yaml
coverage_gaps:
  - requirement: 'AC3: Password reset email sent within 60 seconds'
    gap: 'No test for email delivery timing'
    severity: medium
    reason: 'Performance SLA not validated, could fail in production'
    suggested_test:
      type: integration
      description: 'Test email service SLA compliance with mock SMTP server'
      file_location: 'tests/integration/email-service.test.ts'
      test_case: 'should send password reset email within 60 seconds'
      priority: P1

  - requirement: 'NFR-1: Support 1000 concurrent users'
    gap: 'No load testing implemented'
    severity: high
    reason: 'Scalability requirement unvalidated, critical for production readiness'
    suggested_test:
      type: performance
      description: 'Load test with 1000 concurrent connections using k6 or Artillery'
      file_location: 'tests/performance/concurrency.test.ts'
      test_case: 'system handles 1000 concurrent users with <500ms response time'
      priority: P0

  - requirement: 'AC2: Invalid credentials show error message'
    gap: 'No unit test for credential validation logic'
    severity: low
    reason: 'Logic tested at integration level, but not isolated unit test'
    suggested_test:
      type: unit
      description: 'Unit test validateCredentials() error paths'
      file_location: 'auth/auth.service.test.ts'
      test_case: 'should return false for invalid password'
      priority: P2
```

**Severity Levels**:
```yaml
severity_classifications:
  high:
    criteria: "Critical requirement with no coverage, P0 tests missing, NFR gaps, security gaps"
    gate_impact: "Contributes to FAIL decision"
    examples: ["Load testing missing", "Security validation absent", "Critical user journey untested"]

  medium:
    criteria: "Important requirement with partial coverage, P1 tests missing, SLA gaps"
    gate_impact: "Contributes to CONCERNS decision"
    examples: ["Error paths not tested", "Edge cases missing", "Performance SLA unvalidated"]

  low:
    criteria: "Minor gaps, already tested at different level, P2/P3 tests missing"
    gate_impact: "Note only, may not affect gate"
    examples: ["Logic tested at integration but not unit", "Nice-to-have scenarios missing"]
```

**Recommendation Types**:
1. **Additional Test Scenarios**: New tests to add for gap coverage
2. **Test Type Recommendations**: Unit/integration/e2e/performance needed
3. **Test Data Requirements**: Specific data setups for edge cases
4. **Priority Guidance**: Which gaps to address first (P0 > P1 > P2 > P3)

**Cross-Reference with Test Design**:
- If test-design output exists, validate that recommended tests (especially P0) are covered
- Flag if test-design recommended a test but it doesn't exist in codebase
- Ensure alignment between test scenarios (from test-design) and actual tests (from trace)

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Test Design Output Exists?

```
IF test-design output exists:
  → Use test-design output as primary reference for expected tests
  → Validate that designed tests are implemented
  → Flag gaps: tests designed but not implemented
ELSE:
  → Search test files directly for requirement mappings
  → May miss tests that should exist per best practices
  → Recommend running test-design first
```

### Decision Point 2: Coverage Adequacy Assessment

```
FOR EACH requirement:
  IF tests_found == 0:
    → coverage = "none"
    → severity = determine_based_on_requirement_criticality()
  ELSE IF all_aspects_tested AND appropriate_test_levels:
    → coverage = "full"
    → severity = N/A (no gap)
  ELSE:
    → coverage = "partial"
    → severity = determine_based_on_missing_aspects()
```

**Requirement Criticality Factors**:
- AC priority (AC1 typically more critical than AC5)
- Risk level (from risk-profile if exists)
- Test priority (P0 > P1 > P2 > P3)
- NFR type (security/performance > maintainability)
- Business impact (revenue-affecting > nice-to-have)

### Decision Point 3: Severity Assignment for Gaps

```
IF gap involves:
  - P0 test missing → severity = high
  - Security requirement untested → severity = high
  - Performance SLA unvalidated → severity = high
  - NFR with no coverage → severity = medium to high
  - Critical user journey untested → severity = high
ELSE IF gap involves:
  - P1 test missing → severity = medium
  - Error paths untested → severity = medium
  - Edge cases missing → severity = low to medium
  - Logic tested at integration but not unit → severity = low
  - P2/P3 test missing → severity = low
```

### Decision Point 4: Quality Gate Contribution

```
IF critical_gaps > 0 (high severity, P0 missing):
  → trace.gate_impact = "FAIL"
  → reason: "Critical requirements lack test coverage"

ELSE IF significant_gaps > 0 (medium severity, P1 missing):
  → trace.gate_impact = "CONCERNS"
  → reason: "Important requirements have coverage gaps"

ELSE IF full_coverage_percentage >= 90%:
  → trace.gate_impact = "PASS"
  → reason: "Comprehensive test coverage with minimal gaps"

ELSE:
  → trace.gate_impact = "CONCERNS"
  → reason: "Coverage below threshold (< 90%)"
```

---

## 5. User Interaction Points

### Interaction Mode: Non-Interactive (Read-Only Analysis)

This task is **non-interactive** - it analyzes existing story and test files without user input during execution.

**No Elicitation Required**:
- Task reads story file to extract requirements
- Task searches test files to find mappings
- Task performs coverage analysis programmatically
- Task generates outputs without user confirmation

**Exceptions**:
- If story file not found: **Escalate** to user
- If test directory structure unclear: **Ask** user for test file locations
- If ambiguous requirements: **May ask** user to clarify testable aspects

### Pre-Execution Confirmation

**Optional Confirmation** (if QA agent implements):
```
QA Agent: "I'll trace requirements for story 1.3 (User Authentication). This will:
  - Map 8 acceptance criteria to test cases
  - Identify coverage gaps
  - Generate traceability matrix

  Test design output found: qa/assessments/1.3-test-design-20251014.md

  Proceed with trace? [yes/no]"
```

### Post-Execution Summary

**Always Present** summary of findings:
```
✓ Trace complete for story 1.3 (User Authentication)

Coverage Summary:
  - 8 requirements analyzed
  - 5 fully covered (62%)
  - 2 partially covered (25%)
  - 1 not covered (13%)

Critical Gaps:
  - AC3: No test for password reset timing (severity: medium)
  - NFR-1: No load testing for 1000 concurrent users (severity: high)

Outputs:
  - Traceability matrix: qa/assessments/1.3-trace-20251014.md
  - Gate YAML block generated (see above)

Gate Impact: CONCERNS (1 high-severity gap)
```

---

## 6. Output Specifications

### Output 1: Gate YAML Block

**Purpose**: Structured coverage summary for inclusion in quality gate file.

**Location**: Generated as text output for pasting into gate file (or auto-inserted by review-story/qa-gate tasks).

**Format**:
```yaml
trace:
  totals:
    requirements: 8 # Total testable requirements
    full: 5 # Fully covered (62%)
    partial: 2 # Partially covered (25%)
    none: 1 # Not covered (13%)
  planning_ref: 'qa.qaLocation/assessments/1.3-test-design-20251014.md'
  uncovered:
    - ac: 'AC3'
      reason: 'No test found for password reset timing'
    - ac: 'NFR-1'
      reason: 'No load testing for concurrent users'
  notes: 'See qa.qaLocation/assessments/1.3-trace-20251014.md'
```

**Field Specifications**:
- `totals.requirements`: Integer count of all testable requirements
- `totals.full`: Integer count of requirements with full coverage
- `totals.partial`: Integer count of requirements with partial coverage
- `totals.none`: Integer count of requirements with no coverage
- `planning_ref`: String path to test-design output (if exists), null otherwise
- `uncovered`: Array of objects with `ac` (requirement ID) and `reason` (gap description)
- `notes`: String path to traceability report

**Gate Integration**: This block is consumed by review-story or qa-gate tasks for aggregating into final gate YAML file.

---

### Output 2: Traceability Report

**Purpose**: Comprehensive requirements-to-test mapping document.

**Location**: `qa.qaLocation/assessments/{epic}.{story}-trace-{YYYYMMDD}.md`

**Filename Format**:
- `{epic}`: Epic number (e.g., "1")
- `{story}`: Story number (e.g., "3")
- `{YYYYMMDD}`: Execution date (e.g., "20251014")
- Example: `qa/assessments/1.3-trace-20251014.md`

**Structure**:
```markdown
# Requirements Traceability Matrix

## Story: {epic}.{story} - {title}

**Generated**: {date}
**Test Design Reference**: {path_to_test_design_output}

---

### Coverage Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Requirements | 8 | 100% |
| Fully Covered | 5 | 62% |
| Partially Covered | 2 | 25% |
| Not Covered | 1 | 13% |

**Quality Score**: 75/100 (based on coverage completeness)

---

### Requirement Mappings

#### AC1: User can login with valid credentials

**Coverage: FULL** ✓

**Test Mappings** (3 tests found):

1. **Unit Test**: `auth/auth.service.test.ts::should successfully authenticate with valid email and password`
   - **Given**: A registered user with valid credentials
   - **When**: Authentication method is called with email and password
   - **Then**: Returns authenticated user object with JWT token
   - **Level**: Unit
   - **Status**: ✓ Implemented

2. **Integration Test**: `auth/login.integration.test.ts::POST /auth/login returns 200 with token for valid credentials`
   - **Given**: User exists in database with hashed password
   - **When**: POST request to /auth/login with valid credentials
   - **Then**: Returns 200 status, JWT token, and user profile
   - **Level**: Integration
   - **Status**: ✓ Implemented

3. **E2E Test**: `e2e/auth-flow.test.ts::user can complete login flow and access dashboard`
   - **Given**: User on login page
   - **When**: Entering valid credentials and submitting form
   - **Then**: Dashboard page loads with user-specific data
   - **Level**: E2E
   - **Status**: ✓ Implemented

**Coverage Rationale**: Complete coverage across all test levels - business logic validated in unit tests, API contract validated in integration tests, user experience validated in E2E tests.

---

#### AC2: Invalid credentials show error message

**Coverage: PARTIAL** ⚠️

**Test Mappings** (2 tests found):

1. **Integration Test**: `auth/login.integration.test.ts::POST /auth/login returns 401 for invalid credentials`
   - **Given**: User exists but password is incorrect
   - **When**: POST request with invalid credentials
   - **Then**: Returns 401 status with error message
   - **Level**: Integration
   - **Status**: ✓ Implemented

2. **E2E Test**: `e2e/auth-flow.test.ts::shows error message for invalid login`
   - **Given**: User on login page
   - **When**: Submitting invalid credentials
   - **Then**: Error message displayed, user remains on login page
   - **Level**: E2E
   - **Status**: ✓ Implemented

**Coverage Gap**: Missing unit test for credential validation logic (`validateCredentials()` function error path).

**Recommendation**:
- **Test Type**: Unit
- **File Location**: `auth/auth.service.test.ts`
- **Test Case**: `should return false for invalid password`
- **Priority**: P2 (Medium)
- **Severity**: Low (logic already validated at integration level)

---

#### AC3: Password reset email sent within 60 seconds

**Coverage: NONE** ❌

**Test Mappings** (0 tests found):

No tests found that validate email delivery timing.

**Coverage Gap**: Critical performance SLA unvalidated.

**Recommendation**:
- **Test Type**: Integration
- **File Location**: `tests/integration/email-service.test.ts`
- **Test Case**: `should send password reset email within 60 seconds`
- **Priority**: P1 (High)
- **Severity**: Medium (performance SLA unvalidated)
- **Suggested Implementation**:
  - **Given**: User requests password reset
  - **When**: Email service processes request
  - **Then**: Email sent within 60 seconds (measure elapsed time)
  - **Approach**: Use mock SMTP server with timing assertions

---

[Continue for all requirements...]

---

### Critical Gaps

| ID | Requirement | Gap | Severity | Priority | Recommended Test |
|----|-------------|-----|----------|----------|------------------|
| AC3 | Password reset timing | No timing test | Medium | P1 | Integration test for email SLA |
| NFR-1 | 1000 concurrent users | No load test | High | P0 | Performance test with k6 |

---

### Test Design Validation

**Test Design Output**: `qa/assessments/1.3-test-design-20251014.md`

**Designed Tests vs Implemented Tests**:

| Test ID | Test Scenario | Status | Notes |
|---------|---------------|--------|-------|
| 1.3-UNIT-001 | Validate credentials logic | ✓ Implemented | auth.service.test.ts |
| 1.3-INT-001 | Login API endpoint | ✓ Implemented | login.integration.test.ts |
| 1.3-E2E-001 | Complete login flow | ✓ Implemented | auth-flow.test.ts |
| 1.3-INT-005 | Email timing SLA | ❌ Not Found | **GAP**: Designed but not implemented |

**Gaps Between Design and Implementation**:
- **1.3-INT-005**: Test designed but not found in codebase (email timing validation)

---

### Risk Assessment

**Coverage Risk by Priority**:

| Priority | Requirements | Covered | Gap |
|----------|--------------|---------|-----|
| P0 | 3 | 2 (67%) | 1 (NFR-1 load testing) |
| P1 | 3 | 2 (67%) | 1 (AC3 email timing) |
| P2 | 2 | 2 (100%) | 0 |

**High-Risk Gaps**:
1. **NFR-1: Load Testing** - No validation for 1000 concurrent users (P0, High Severity)
   - Risk: System may fail under production load
   - Impact: Potential service outages, poor user experience
   - Recommendation: Implement load tests before production deployment

2. **AC3: Email Timing** - No SLA validation for 60-second requirement (P1, Medium Severity)
   - Risk: Email delays may violate user expectations
   - Impact: Poor user experience, support escalations
   - Recommendation: Add integration test with timing assertions

---

### Recommendations

#### Immediate Actions (High Priority)
1. **Implement Load Testing** for NFR-1
   - Tool: k6 or Artillery
   - Target: 1000 concurrent users with <500ms response time
   - File: `tests/performance/concurrency.test.ts`

2. **Add Email Timing Test** for AC3
   - Tool: Mock SMTP server with timing
   - Target: Email sent within 60 seconds
   - File: `tests/integration/email-service.test.ts`

#### Future Improvements (Medium Priority)
3. **Add Unit Tests** for credential validation error paths (AC2)
   - File: `auth/auth.service.test.ts`
   - Coverage: validateCredentials() edge cases

---

### Quality Score Calculation

**Formula**: `100 - (20 × high_gaps) - (10 × medium_gaps) - (5 × low_gaps)`

**Calculation**:
- High severity gaps: 1 (NFR-1)
- Medium severity gaps: 1 (AC3)
- Low severity gaps: 1 (AC2)
- Score: `100 - (20 × 1) - (10 × 1) - (5 × 1) = 65/100`

**Interpretation**:
- **65/100**: CONCERNS - Significant gaps in critical areas
- Target: ≥80 for PASS
- Action Required: Address high-priority gaps before gate approval

---

### Gate Impact

**Decision Contribution**: **CONCERNS**

**Rationale**:
- 1 high-severity gap (NFR-1 load testing)
- 1 medium-severity gap (AC3 email timing)
- 62% full coverage (below 90% threshold)

**Path to PASS**:
1. Implement load testing for NFR-1 → Eliminates high-severity gap
2. Add email timing test for AC3 → Eliminates medium-severity gap
3. Re-run trace → Expected coverage: 87.5% (7/8 full)

---

**Report Generated**: {timestamp}
**Generated By**: QA Agent (Quinn)
```

**Report Characteristics**:
- **Length**: 1,000-2,000 lines for typical story (8-12 ACs)
- **Format**: Markdown with tables, YAML code blocks, checklists
- **Tone**: Technical, analytical, actionable
- **Visual Aids**: Tables for coverage summary, gaps, risk assessment

---

### Output 3: Story Hook Line

**Purpose**: Provide reference line for review-story task to quote in gate file or report.

**Format**:
```text
Trace matrix: qa.qaLocation/assessments/{epic}.{story}-trace-{YYYYMMDD}.md
```

**Example**:
```text
Trace matrix: qa/assessments/1.3-trace-20251014.md
```

**Usage**: Printed at end of task execution for copy-paste into review-story output or gate file.

---

## 7. Error Handling & Validation

### Error Conditions

#### Error 1: Story File Not Found
```
ERROR: Story file not found at {story_path}
RECOVERY: Ask user to verify story ID and devStoryLocation in core-config.yaml
EXIT: Cannot proceed without story file
```

#### Error 2: No Acceptance Criteria Found
```
WARNING: No acceptance criteria found in story file
RECOVERY: Search for alternative testable requirements (tasks, NFRs, user story)
CONTINUE: Generate trace with available requirements, note AC absence
```

#### Error 3: Test Directory Not Found
```
WARNING: Test directory not found at expected location
RECOVERY: Ask user for test file locations
ALTERNATIVE: Generate trace with "No tests found" for all requirements
CONTINUE: Document gap, recommend creating tests
```

#### Error 4: Invalid core-config.yaml
```
ERROR: Cannot resolve qa.qaLocation from core-config.yaml
RECOVERY: Use default location (project_root/qa) with warning
CONTINUE: Generate outputs with default paths
```

### Validation Rules

#### Validation 1: Requirement ID Uniqueness
```yaml
rule: All requirement IDs must be unique within story
check: Ensure no duplicate AC1, AC2, etc.
error_if_fail: "Duplicate requirement ID found: {id}"
```

#### Validation 2: Test File Accessibility
```yaml
rule: All mapped test files should exist and be readable
check: Verify test file paths before including in trace
warning_if_fail: "Test file not found: {path} (may have been moved/deleted)"
```

#### Validation 3: Coverage Percentages
```yaml
rule: Coverage percentages should sum to 100%
check: (full + partial + none) / requirements == 1.0
error_if_fail: "Coverage calculation error: totals don't sum to 100%"
```

#### Validation 4: Given-When-Then Completeness
```yaml
rule: All test mappings should have given, when, then documentation
check: Ensure all three fields populated for each mapping
warning_if_fail: "Incomplete GWT for test: {test_case}"
```

### Validation Checkpoints

**Pre-Execution Validation**:
- Story file exists and is readable
- core-config.yaml is valid and contains required paths
- Output directory (qa.qaLocation/assessments) exists or can be created

**Mid-Execution Validation**:
- At least one testable requirement extracted (else warn)
- Test file discovery successful (else warn about gap)
- Coverage analysis produces valid percentages

**Post-Execution Validation**:
- Traceability report generated successfully
- Gate YAML block is valid YAML syntax
- All outputs saved to correct locations
- Coverage totals are accurate

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**Prerequisite Tasks** (Recommended but not required):
1. **test-design** - Provides test scenarios and expected test IDs
   - If exists: Use as reference for mapping
   - If missing: Perform direct test discovery
   - Impact: Without test-design, may miss tests that should exist

**Dependent Tasks** (Consume trace output):
1. **review-story** - Aggregates trace block into gate YAML
2. **qa-gate** - Uses coverage gaps for gate decision (FAIL/CONCERNS/PASS)

### File Dependencies

**Required Files**:
- **Story File**: `{devStoryLocation}/{epic}.{story}.*.md` (e.g., `stories/1.3.user-authentication.md`)
- **core-config.yaml**: For path resolution (devStoryLocation, qa.qaLocation)

**Optional Files**:
- **Test Design Output**: `qa.qaLocation/assessments/{epic}.{story}-test-design-{date}.md`
- **Risk Profile Output**: `qa.qaLocation/assessments/{epic}.{story}-risk-{date}.md`
- **Test Files**: Project test files for mapping (*.test.ts, *.spec.ts, *.cy.ts, etc.)

### Configuration Dependencies

From `core-config.yaml`:
```yaml
devStoryLocation: './stories' # Required - story file location
qa:
  qaLocation: './qa' # Required - QA outputs location
```

**Path Resolution**:
- Story path: `{devStoryLocation}/{epic}.{story}.*.md`
- Output path: `{qa.qaLocation}/assessments/{epic}.{story}-trace-{YYYYMMDD}.md`
- Test design reference: `{qa.qaLocation}/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md`

### System Dependencies

**File System Access**:
- Read access: Story files, test files, core-config.yaml
- Write access: qa.qaLocation/assessments directory

**Test File Discovery**:
- Ability to search/glob test files in project
- Patterns: `**/*.test.ts`, `**/*.spec.ts`, `**/*.cy.ts`, etc.
- May require walking project directory tree

---

## 9. Integration Points

### Integration with test-design Task

**Relationship**: test-design creates test scenarios, trace validates implementation.

**Integration Flow**:
```
test-design (upstream):
  → Designs test scenarios with IDs (1.3-UNIT-001, 1.3-INT-002, etc.)
  → Outputs test-design-{date}.md

trace-requirements (this task):
  → Reads test-design output as reference
  → Searches for implemented tests matching designed scenarios
  → Flags gaps: tests designed but not implemented
  → References test-design in planning_ref field
```

**Data Exchange**:
- **From test-design**: Test scenario IDs, test levels, priorities
- **To trace**: Validation that designed tests exist in codebase

**Gap Detection**:
```yaml
# test-design output says:
test_scenario:
  id: '1.3-INT-005'
  description: 'Email timing SLA validation'
  level: integration
  priority: P1

# trace-requirements searches and finds:
result: NOT_FOUND
gap: 'Test designed (1.3-INT-005) but not implemented'
severity: medium (P1 test missing)
```

---

### Integration with review-story Task

**Relationship**: review-story orchestrates QA tasks, aggregates results.

**Integration Flow**:
```
review-story (orchestrator):
  1. Calls risk-profile → gets risk.yml block
  2. Calls test-design → gets test_design.yml block
  3. Calls trace-requirements → gets trace.yml block ← THIS TASK
  4. Calls nfr-assess → gets nfr_validation.yml block
  5. Aggregates all blocks into final gate YAML
  6. Calls qa-gate to create gate file
```

**Data Provided to review-story**:
```yaml
trace:
  totals:
    requirements: 8
    full: 5
    partial: 2
    none: 1
  planning_ref: 'qa/assessments/1.3-test-design-20251014.md'
  uncovered:
    - ac: 'AC3'
      reason: 'No test found for password reset timing'
  notes: 'See qa/assessments/1.3-trace-20251014.md'
```

**Story Hook Line** printed for review-story to quote:
```text
Trace matrix: qa/assessments/1.3-trace-20251014.md
```

---

### Integration with qa-gate Task

**Relationship**: qa-gate uses trace coverage gaps for gate decision.

**Integration Flow**:
```
trace-requirements:
  → Identifies high-severity gaps
  → Calculates coverage percentages
  → Provides gate impact recommendation

qa-gate:
  → Reads trace block from aggregated YAML
  → Applies gate decision rules:
    - Critical gaps (high severity, P0 missing) → FAIL
    - Significant gaps (medium severity, P1 missing) → CONCERNS
    - Full coverage (≥90%) → PASS contribution
  → Includes trace gaps in top_issues list
```

**Gate Decision Influence**:
```yaml
# Trace provides:
trace:
  totals:
    requirements: 8
    none: 1 # NFR-1 (P0 load testing)
  uncovered:
    - ac: 'NFR-1'
      reason: 'No load testing for concurrent users'
      # Implied: High severity, P0 test missing

# qa-gate decides:
gate: FAIL
status_reason: 'Critical requirements lack test coverage (NFR-1 load testing)'
top_issues:
  - id: 'TEST-001'
    severity: high
    description: 'NFR-1: No load testing for 1000 concurrent users'
    source: trace
```

---

### Integration with Story File

**Relationship**: Story file is primary source of requirements.

**Story Sections Used**:
1. **Acceptance Criteria**: Primary source of testable requirements
2. **User Story**: May contain implicit requirements
3. **Tasks/Subtasks**: Technical requirements with specific behaviors
4. **Dev Notes**: May mention NFRs or edge cases

**Story File Format** (from story-tmpl.yaml):
```markdown
# Story {epic}.{story}: {title}

## Acceptance Criteria

1. **AC1**: User can login with valid credentials
2. **AC2**: Invalid credentials show error message
3. **AC3**: Password reset email sent within 60 seconds

## Tasks

- [ ] Implement JWT token generation
- [ ] Hash passwords using bcrypt
- [ ] Add email service integration

## Dev Notes

### Non-Functional Requirements
- Support 1000 concurrent users (NFR-1)
- Response time under 200ms (NFR-2)
```

**Extraction Logic**:
- Parse "## Acceptance Criteria" section → extract AC1, AC2, AC3, ...
- Parse "## Tasks" section → extract technical requirements
- Parse "## Dev Notes" → extract NFRs, edge cases

---

### Integration with Test Files

**Relationship**: Test files contain actual test implementations to map.

**Test File Discovery**:
```
Search patterns:
- src/**/*.test.ts
- src/**/*.spec.ts
- tests/**/*.test.ts
- tests/integration/**/*.test.ts
- tests/e2e/**/*.test.ts
- cypress/e2e/**/*.cy.ts
- tests/performance/**/*.test.ts
```

**Test Case Extraction**:
```typescript
// Test file: auth/auth.service.test.ts
describe('AuthService', () => {
  describe('validateCredentials', () => {
    it('should successfully authenticate with valid email and password', () => {
      // Test implementation
    });

    it('should return false for invalid password', () => {
      // Test implementation
    });
  });
});

// Extracted:
test_mappings:
  - test_file: 'auth/auth.service.test.ts'
    test_case: 'should successfully authenticate with valid email and password'
    # ... GWT documentation
```

**Test Level Detection**:
- File path heuristics: `auth.service.test.ts` → unit, `auth.integration.test.ts` → integration
- Test content analysis: Mocks/stubs → unit, Database access → integration, Browser automation → e2e

---

## 10. Configuration References

### core-config.yaml Dependencies

```yaml
# Story location (required)
devStoryLocation: './stories'

# QA outputs location (required)
qa:
  qaLocation: './qa'
```

**Usage**:
- `devStoryLocation`: Resolve story file path
- `qa.qaLocation`: Resolve output paths for traceability report

**Path Examples**:
```yaml
# Input story path:
{devStoryLocation}/{epic}.{story}.*.md
→ ./stories/1.3.user-authentication.md

# Output traceability report:
{qa.qaLocation}/assessments/{epic}.{story}-trace-{YYYYMMDD}.md
→ ./qa/assessments/1.3-trace-20251014.md

# Reference test design:
{qa.qaLocation}/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md
→ ./qa/assessments/1.3-test-design-20251014.md
```

### Configuration Defaults

**If core-config.yaml missing or invalid**:
```yaml
defaults:
  devStoryLocation: './stories' # Assume stories directory
  qa.qaLocation: './qa' # Assume qa directory

warnings:
  - "core-config.yaml not found, using default paths"
  - "Verify paths are correct before continuing"
```

---

## 11. State Management

### Task State: Stateless (Single Execution)

This task is **stateless** - it performs a one-time analysis without maintaining state across executions.

**Single Execution Model**:
- Read story file
- Discover tests
- Analyze coverage
- Generate outputs
- Exit

**No State Persistence**:
- Task does not track history of previous traces
- Each execution is independent
- No incremental updates to traceability matrix

**State Stored in Outputs**:
- Traceability report captures state at execution time
- Filename includes date (`trace-{YYYYMMDD}.md`) for versioning
- Historical traces can be compared manually

### Versioning of Outputs

**Filename Versioning**:
```
{epic}.{story}-trace-{YYYYMMDD}.md
  → 1.3-trace-20251014.md (today)
  → 1.3-trace-20251015.md (tomorrow - if re-executed)
```

**Multiple Versions**:
- Each execution creates new file with current date
- Previous versions retained for history tracking
- Latest version used by qa-gate and review-story

**Historical Comparison** (manual):
```bash
# Compare coverage changes over time
diff qa/assessments/1.3-trace-20251014.md \
     qa/assessments/1.3-trace-20251015.md
```

### Story File Updates

**Story QA Results Section**:
- trace-requirements does NOT update story file directly
- review-story task may update story's "## QA Results" section with trace summary
- Story file modified by: review-story, qa-gate (not trace-requirements)

---

## 12. Advanced Features

### Feature 1: Given-When-Then Documentation Pattern

**Purpose**: Use Given-When-Then to document **what tests validate**, not how they're coded.

**Distinction from BDD**:
- **NOT for test code**: Tests follow project standards (describe/it, no BDD syntax in code)
- **FOR documentation**: Describe test purpose in traceability matrix

**Documentation Template**:
```yaml
test_mapping:
  given: '{context_or_precondition}'
  when: '{action_or_trigger}'
  then: '{expected_outcome_or_assertion}'
```

**Examples**:

**Unit Test Documentation**:
```yaml
# Test code (project standard - no BDD):
it('should return user object for valid credentials', () => {
  const user = authService.validateCredentials('test@example.com', 'password123');
  expect(user).toBeDefined();
  expect(user.email).toBe('test@example.com');
});

# GWT documentation (for traceability):
given: 'A registered user with valid credentials'
when: 'validateCredentials() is called with email and password'
then: 'Returns user object with email and authentication status'
```

**Integration Test Documentation**:
```yaml
# Test code (project standard):
it('POST /auth/login returns 200 with token', async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });
  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});

# GWT documentation:
given: 'User exists in database with hashed password'
when: 'POST request to /auth/login with valid credentials'
then: 'Returns 200 status, JWT token, and user profile'
```

**E2E Test Documentation**:
```yaml
# Test code (Cypress):
it('user can login and access dashboard', () => {
  cy.visit('/login');
  cy.get('input[name=email]').type('test@example.com');
  cy.get('input[name=password]').type('password123');
  cy.get('button[type=submit]').click();
  cy.url().should('include', '/dashboard');
  cy.contains('Welcome, Test User');
});

# GWT documentation:
given: 'User on login page'
when: 'Entering valid credentials and submitting form'
then: 'Dashboard page loads with user-specific data'
```

**Benefits**:
- **Clarity**: Non-technical stakeholders can understand what tests validate
- **Traceability**: Clear mapping between requirements and test purpose
- **Independence**: Documentation doesn't depend on test framework syntax
- **Flexibility**: Tests can be refactored without changing GWT documentation

---

### Feature 2: Multi-Level Coverage Analysis

**Purpose**: Validate coverage at appropriate test levels (unit, integration, e2e).

**Coverage Adequacy by Requirement Type**:

```yaml
requirement_types:
  business_logic:
    ideal_coverage:
      - unit: required (isolate logic)
      - integration: optional (if logic interacts with dependencies)
      - e2e: optional (if logic affects user journey)
    example: "Validate password strength algorithm"

  api_endpoints:
    ideal_coverage:
      - unit: optional (if complex business logic)
      - integration: required (test API contract)
      - e2e: optional (if part of critical user journey)
    example: "POST /auth/login endpoint"

  user_journeys:
    ideal_coverage:
      - unit: required (for underlying logic)
      - integration: required (for component interactions)
      - e2e: required (for end-to-end validation)
    example: "Complete login flow"

  nfrs:
    ideal_coverage:
      - unit: not_applicable
      - integration: sometimes (for performance, security in component)
      - e2e: sometimes (for end-to-end performance)
      - specialized: required (load tests, security scans, etc.)
    example: "Support 1000 concurrent users"
```

**Gap Detection by Level**:
```yaml
# AC1: User can login with valid credentials
coverage_analysis:
  unit: 1 test found ✓
  integration: 1 test found ✓
  e2e: 1 test found ✓
  verdict: FULL (all appropriate levels covered)

# AC2: Invalid credentials show error
coverage_analysis:
  unit: 0 tests found ❌
  integration: 1 test found ✓
  e2e: 1 test found ✓
  verdict: PARTIAL (missing unit test for validation logic)
  gap: "No unit test for validateCredentials() error path"
  severity: low (already tested at integration level)

# NFR-1: Support 1000 concurrent users
coverage_analysis:
  unit: N/A
  integration: N/A
  e2e: N/A
  specialized: 0 tests found ❌
  verdict: NONE (no performance tests)
  gap: "No load testing for scalability requirement"
  severity: high (critical NFR untested)
```

---

### Feature 3: Test Design Validation

**Purpose**: Cross-reference test-design output to validate implementation.

**Validation Process**:
```
1. Read test-design output (if exists)
2. Extract designed test scenarios with IDs
3. Search for implemented tests matching designed scenarios
4. Flag gaps: tests designed but not implemented
5. Report alignment between design and implementation
```

**Example Validation**:

**From test-design output**:
```yaml
test_scenarios:
  - id: '1.3-UNIT-001'
    description: 'Validate credentials returns user for valid input'
    level: unit
    priority: P0

  - id: '1.3-UNIT-002'
    description: 'Validate credentials returns false for invalid password'
    level: unit
    priority: P1

  - id: '1.3-INT-005'
    description: 'Email sent within 60 seconds'
    level: integration
    priority: P1
```

**From trace-requirements search**:
```yaml
implementation_status:
  - id: '1.3-UNIT-001'
    status: FOUND
    test_file: 'auth/auth.service.test.ts'
    test_case: 'should return user for valid credentials'

  - id: '1.3-UNIT-002'
    status: FOUND
    test_file: 'auth/auth.service.test.ts'
    test_case: 'should return false for invalid password'

  - id: '1.3-INT-005'
    status: NOT_FOUND ❌
    gap: 'Test designed but not implemented'
    severity: medium (P1 test missing)
```

**Validation Report Section**:
```markdown
### Test Design Validation

**Test Design Output**: qa/assessments/1.3-test-design-20251014.md

**Designed Tests**: 8
**Implemented Tests**: 7
**Missing Tests**: 1

**Implementation Gaps**:
| Test ID | Scenario | Priority | Status |
|---------|----------|----------|--------|
| 1.3-INT-005 | Email timing SLA | P1 | ❌ Not Found |

**Recommendation**: Implement missing P1 test before gate approval.
```

---

### Feature 4: Risk-Aware Coverage Prioritization

**Purpose**: Prioritize coverage validation for high-risk requirements.

**Risk Integration** (if risk-profile exists):
```yaml
# From risk-profile output
risks:
  - category: TECH
    risk: 'JWT token expiration logic may have edge cases'
    probability: medium (2)
    impact: high (3)
    score: 6
    affected_acs: ['AC1', 'AC4']

# trace-requirements prioritizes coverage for AC1 and AC4
coverage_priority:
  - requirement: 'AC1'
    risk_score: 6
    priority: HIGH (risk-based)
    coverage_expectation: 'Full coverage across all levels'
    actual_coverage: full ✓

  - requirement: 'AC4'
    risk_score: 6
    priority: HIGH (risk-based)
    coverage_expectation: 'Full coverage across all levels'
    actual_coverage: partial ❌
    gap: 'Missing edge case tests for token expiration'
    severity: high (high-risk requirement with coverage gap)
```

**Gap Severity Adjusted by Risk**:
```yaml
severity_calculation:
  base_severity: medium (P1 test missing)
  risk_multiplier: 2x (high-risk requirement)
  final_severity: high
  rationale: 'High-risk requirement (score 6) with coverage gap escalated to high severity'
```

---

### Feature 5: Coverage Quality Score

**Purpose**: Quantify traceability quality for gate decision.

**Formula**:
```
Quality Score = 100 - (20 × high_gaps) - (10 × medium_gaps) - (5 × low_gaps)
```

**Example Calculation**:
```yaml
gaps:
  high_severity: 1 # NFR-1 load testing
  medium_severity: 1 # AC3 email timing
  low_severity: 1 # AC2 unit test

calculation:
  base: 100
  - (20 × 1): -20 # high gap penalty
  - (10 × 1): -10 # medium gap penalty
  - (5 × 1): -5 # low gap penalty
  final_score: 65/100

interpretation:
  score_range: 0-100
  thresholds:
    - '>= 90': PASS (excellent coverage)
    - '70-89': CONCERNS (acceptable with minor gaps)
    - '< 70': FAIL (significant coverage deficiencies)
  verdict: CONCERNS (score 65, below 70 threshold)
```

**Alternative Formula** (coverage-based):
```
Quality Score = (full_coverage_percentage × 0.7) +
                (partial_coverage_percentage × 0.3) +
                (critical_coverage_bonus × 10)

where:
  full_coverage_percentage = (full_requirements / total_requirements) × 100
  partial_coverage_percentage = (partial_requirements / total_requirements) × 100
  critical_coverage_bonus = 1 if all P0 requirements fully covered, else 0
```

---

## 13. Special Considerations

### Consideration 1: Given-When-Then is Documentation Only

**Critical Understanding**: Given-When-Then is NOT for writing test code.

**Common Misconception**:
```javascript
// WRONG - Do NOT write tests like this:
Given('a registered user with valid credentials', () => { ... });
When('they submit the login form', () => { ... });
Then('they are redirected to dashboard', () => { ... });
```

**Correct Usage**:
```javascript
// CORRECT - Tests follow project standards (describe/it):
describe('AuthService', () => {
  it('should authenticate user with valid credentials', () => {
    // Test implementation
  });
});

// GWT is for DOCUMENTATION in traceability matrix:
/**
 * Given: A registered user with valid credentials
 * When: validateCredentials() is called
 * Then: Returns user object with JWT token
 */
```

**Rationale**:
- BDD frameworks (Cucumber, etc.) add complexity and maintenance overhead
- Standard testing frameworks (Jest, Mocha, Vitest) are more widely used
- GWT documentation provides clarity without forcing BDD syntax in code
- Tests remain flexible to refactor without changing GWT documentation

---

### Consideration 2: Coverage Levels Are Context-Dependent

**Not All Requirements Need All Levels**:

```yaml
scenarios:
  # Business logic - Unit tests sufficient
  - requirement: 'Calculate compound interest'
    ideal_coverage:
      - unit: required (pure function, no dependencies)
      - integration: not_needed
      - e2e: not_needed

  # API endpoint - Integration tests primary
  - requirement: 'GET /users returns user list'
    ideal_coverage:
      - unit: optional (if complex business logic)
      - integration: required (API contract)
      - e2e: optional (if part of critical journey)

  # Critical user journey - All levels
  - requirement: 'User can complete checkout'
    ideal_coverage:
      - unit: required (payment calculation logic)
      - integration: required (payment service API)
      - e2e: required (complete checkout flow)
```

**Avoid Over-Testing**:
- Don't require e2e tests for simple business logic
- Don't require unit tests for framework/library behavior
- Focus on appropriate test levels for requirement type

---

### Consideration 3: NFR Testing Requires Specialized Approaches

**NFRs Often Need Non-Standard Tests**:

```yaml
nfr_testing:
  performance:
    test_types: [load_testing, stress_testing, benchmark]
    tools: [k6, Artillery, JMeter]
    example: 'Support 1000 concurrent users'

  security:
    test_types: [penetration_testing, vulnerability_scanning, static_analysis]
    tools: [OWASP ZAP, Snyk, SonarQube]
    example: 'Prevent SQL injection'

  reliability:
    test_types: [chaos_engineering, failover_testing, disaster_recovery]
    tools: [Chaos Monkey, Gremlin]
    example: '99.9% uptime SLA'

  maintainability:
    test_types: [code_quality_analysis, technical_debt_tracking]
    tools: [SonarQube, CodeClimate]
    example: 'Cyclomatic complexity < 10'
```

**Gap Detection for NFRs**:
- Search for specialized test files (performance/, security/, etc.)
- Check for CI/CD integration (Snyk scans, load tests in pipeline)
- If no specialized tests found → severity: high (critical NFR untested)

---

### Consideration 4: Test Discovery Challenges

**Challenge**: Finding all relevant tests in large codebases.

**Strategies**:
1. **File Path Heuristics**:
   - `auth.service.test.ts` → Unit test for AuthService
   - `auth.integration.test.ts` → Integration test for auth
   - `e2e/login.cy.ts` → E2E test for login

2. **Test Case Name Matching**:
   - AC: "User can login with valid credentials"
   - Test: "should authenticate user with valid credentials" ✓ Match
   - Test: "login works" ✓ Match (less specific)

3. **Content Analysis**:
   - Search test file content for requirement keywords
   - Example: Search for "password reset" in test files

4. **Manual Mapping** (if automated discovery fails):
   - Ask user to provide test-to-requirement mappings
   - Use test-design output as reference

**Fallback**:
- If test discovery is uncertain, mark as "partial" coverage with note:
  ```
  Coverage: PARTIAL
  Note: Automated discovery found 1 test, but manual review may identify additional tests
  ```

---

### Consideration 5: Evolution of Requirements and Tests

**Requirements Change Over Time**:
- ACs may be added, modified, or removed during development
- Tests may be added after initial story implementation
- Traceability matrix captures **point-in-time snapshot**

**Handling Changes**:
1. **Re-run trace-requirements** after significant changes:
   - New ACs added to story
   - New tests implemented
   - Refactoring changes test structure

2. **Compare traces over time** (manual):
   ```bash
   diff 1.3-trace-20251014.md 1.3-trace-20251020.md
   # Shows coverage improvements or regressions
   ```

3. **Version control**:
   - Commit traceability reports to git
   - Track changes in PR reviews
   - Use as audit trail for compliance

**Stale Traces**:
- If story file modified after trace generated → trace may be outdated
- If tests added after trace generated → trace shows false gaps
- **Solution**: Re-run trace-requirements to refresh

---

## 14. ADK Translation Recommendations

### Implementation Approach: Cloud Function (Medium Complexity)

**Rationale**:
- **Not simple enough for inline code**: Requires test file discovery, parsing, analysis
- **Not complex enough for Reasoning Engine**: Single-pass analysis, no multi-step reasoning
- **Best fit**: Cloud Function with test file access and parsing libraries

**Architecture**:
```
API Request (story_id, story_path)
  ↓
Cloud Function: trace-requirements
  ↓
1. Read story file (Cloud Storage or project repo)
2. Extract requirements (AC parsing)
3. Discover test files (Cloud Storage or repo scan)
4. Map requirements to tests (pattern matching, GWT generation)
5. Analyze coverage (calculate percentages, identify gaps)
6. Generate outputs (markdown report, YAML block)
  ↓
Outputs:
  - Traceability report → Cloud Storage
  - Gate YAML block → Return to caller
  - Story hook line → Return to caller
```

**Cloud Function Implementation**:
```python
from google.cloud import storage
import re
import yaml
from datetime import datetime

def trace_requirements(request):
    """
    Cloud Function for trace-requirements task.
    Maps story requirements to test cases with Given-When-Then.
    """

    # Parse request
    story_id = request.args.get('story_id') # e.g., "1.3"
    story_path = request.args.get('story_path')

    # Load configuration
    config = load_core_config()

    # Step 1: Extract requirements from story
    story_content = read_story_file(story_path)
    requirements = extract_requirements(story_content)

    # Step 2: Discover and map test files
    test_files = discover_test_files(config)
    test_mappings = map_requirements_to_tests(requirements, test_files)

    # Step 3: Analyze coverage
    coverage_analysis = analyze_coverage(requirements, test_mappings)

    # Step 4: Identify gaps
    gaps = identify_gaps(coverage_analysis)

    # Step 5: Generate outputs
    report = generate_traceability_report(
        story_id, requirements, test_mappings,
        coverage_analysis, gaps
    )
    gate_block = generate_gate_yaml_block(coverage_analysis, gaps)
    hook_line = generate_story_hook_line(story_id)

    # Save report to Cloud Storage
    save_report(report, story_id, config)

    # Return gate block and hook line
    return {
        'gate_block': gate_block,
        'hook_line': hook_line,
        'coverage_summary': coverage_analysis['totals'],
        'status': 'success'
    }


def extract_requirements(story_content):
    """Extract testable requirements from story markdown."""
    requirements = []

    # Extract acceptance criteria
    ac_pattern = r'\*\*AC(\d+)\*\*:\s*(.+)'
    for match in re.finditer(ac_pattern, story_content):
        requirements.append({
            'id': f'AC{match.group(1)}',
            'description': match.group(2).strip(),
            'type': 'acceptance_criterion'
        })

    # Extract NFRs (from Dev Notes or dedicated section)
    # ... (similar pattern matching)

    return requirements


def discover_test_files(config):
    """Discover test files in project repository."""
    test_files = []

    # Search patterns
    patterns = [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/tests/**/*.test.ts',
        '**/e2e/**/*.cy.ts'
    ]

    # Use Cloud Storage or git repo access to find files
    # ... (implementation depends on storage backend)

    return test_files


def map_requirements_to_tests(requirements, test_files):
    """Map each requirement to relevant test cases."""
    mappings = {}

    for req in requirements:
        mappings[req['id']] = []

        # Search test files for matches
        for test_file in test_files:
            test_cases = extract_test_cases(test_file)

            for test_case in test_cases:
                if is_relevant_test(req, test_case):
                    # Generate Given-When-Then documentation
                    gwt = generate_gwt_documentation(
                        req, test_case, test_file
                    )

                    mappings[req['id']].append({
                        'test_file': test_file['path'],
                        'test_case': test_case['name'],
                        'given': gwt['given'],
                        'when': gwt['when'],
                        'then': gwt['then'],
                        'level': detect_test_level(test_file['path']),
                        'coverage': 'full' # Refined in coverage analysis
                    })

    return mappings


def analyze_coverage(requirements, test_mappings):
    """Analyze coverage completeness for each requirement."""
    analysis = {
        'requirements': {},
        'totals': {
            'requirements': len(requirements),
            'full': 0,
            'partial': 0,
            'none': 0
        }
    }

    for req in requirements:
        req_id = req['id']
        tests = test_mappings.get(req_id, [])

        if len(tests) == 0:
            coverage = 'none'
            analysis['totals']['none'] += 1
        elif is_full_coverage(req, tests):
            coverage = 'full'
            analysis['totals']['full'] += 1
        else:
            coverage = 'partial'
            analysis['totals']['partial'] += 1

        analysis['requirements'][req_id] = {
            'coverage': coverage,
            'tests_found': len(tests),
            'test_mappings': tests
        }

    return analysis


def identify_gaps(coverage_analysis):
    """Identify and prioritize coverage gaps."""
    gaps = []

    for req_id, req_analysis in coverage_analysis['requirements'].items():
        if req_analysis['coverage'] in ['none', 'partial']:
            gap = {
                'requirement': req_id,
                'gap': determine_gap_description(req_analysis),
                'severity': determine_severity(req_analysis),
                'suggested_test': generate_test_recommendation(req_analysis)
            }
            gaps.append(gap)

    return gaps


def generate_traceability_report(story_id, requirements,
                                  test_mappings, coverage_analysis, gaps):
    """Generate comprehensive traceability markdown report."""
    report = f"""# Requirements Traceability Matrix

## Story: {story_id}

### Coverage Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Requirements | {coverage_analysis['totals']['requirements']} | 100% |
| Fully Covered | {coverage_analysis['totals']['full']} | {coverage_analysis['totals']['full'] / coverage_analysis['totals']['requirements'] * 100:.0f}% |
| Partially Covered | {coverage_analysis['totals']['partial']} | {coverage_analysis['totals']['partial'] / coverage_analysis['totals']['requirements'] * 100:.0f}% |
| Not Covered | {coverage_analysis['totals']['none']} | {coverage_analysis['totals']['none'] / coverage_analysis['totals']['requirements'] * 100:.0f}% |

---

### Requirement Mappings

"""

    # Add detailed mappings for each requirement
    for req in requirements:
        req_id = req['id']
        req_coverage = coverage_analysis['requirements'][req_id]
        tests = test_mappings.get(req_id, [])

        report += f"""#### {req_id}: {req['description']}

**Coverage: {req_coverage['coverage'].upper()}**

"""

        if len(tests) > 0:
            report += "**Test Mappings**:\n\n"
            for i, test in enumerate(tests, 1):
                report += f"""{i}. **{test['level'].capitalize()} Test**: `{test['test_file']}::{test['test_case']}`
   - **Given**: {test['given']}
   - **When**: {test['when']}
   - **Then**: {test['then']}

"""
        else:
            report += "**No tests found**\n\n"

        report += "---\n\n"

    # Add gaps section
    if len(gaps) > 0:
        report += "### Critical Gaps\n\n"
        for gap in gaps:
            report += f"""- **{gap['requirement']}**: {gap['gap']} (Severity: {gap['severity']})

"""

    return report


def generate_gate_yaml_block(coverage_analysis, gaps):
    """Generate YAML block for quality gate file."""
    uncovered = []
    for gap in gaps:
        if gap['severity'] in ['high', 'medium']:
            uncovered.append({
                'ac': gap['requirement'],
                'reason': gap['gap']
            })

    gate_block = {
        'trace': {
            'totals': coverage_analysis['totals'],
            'uncovered': uncovered,
            'notes': f"See traceability report for details"
        }
    }

    return yaml.dump(gate_block, default_flow_style=False)
```

---

### ADK Components

**1. Cloud Function** (trace-requirements):
- **Trigger**: HTTP request or invoked by review-story orchestrator
- **Inputs**: story_id, story_path
- **Processing**: Requirements extraction, test discovery, coverage analysis
- **Outputs**: Traceability report (Cloud Storage), gate YAML block (return value)

**2. Cloud Storage** (Outputs):
- **Bucket**: bmad-qa-assessments
- **Path**: `assessments/{epic}.{story}-trace-{YYYYMMDD}.md`
- **Access**: Read by review-story, qa-gate

**3. Firestore** (Optional - for caching):
- **Collection**: `traces`
- **Document**: `{story_id}-{date}`
- **Fields**: coverage_analysis, gaps, test_mappings
- **Use Case**: Avoid re-running trace if story/tests unchanged

**4. Integration with Repository** (Test File Access):
- **Option 1**: Cloud Source Repositories (git repo integration)
- **Option 2**: Cloud Storage (tests uploaded as part of project)
- **Option 3**: GitHub API (read test files from external repo)

---

### Vertex AI Agent Integration

**QA Agent Tool Registration**:
```python
qa_agent_tools = [
    {
        'name': 'trace_requirements',
        'description': 'Map story requirements to test cases using Given-When-Then patterns',
        'function_ref': 'projects/{project}/locations/{location}/functions/trace-requirements',
        'parameters': {
            'story_id': 'string (required) - Story ID in format {epic}.{story}',
            'story_path': 'string (required) - Path to story file'
        }
    }
]
```

**Agent Invocation**:
```python
# QA Agent (Quinn) invokes trace-requirements
response = qa_agent.invoke_tool(
    tool_name='trace_requirements',
    parameters={
        'story_id': '1.3',
        'story_path': 'stories/1.3.user-authentication.md'
    }
)

# Process response
gate_block = response['gate_block']
coverage_summary = response['coverage_summary']

# Present to user
print(f"""
✓ Requirements traceability complete

Coverage: {coverage_summary['full']}/{coverage_summary['requirements']} fully covered
Gaps: {len(response['uncovered'])} critical gaps identified

Gate impact: {determine_gate_impact(coverage_summary)}
""")
```

---

### Alternative: Reasoning Engine for Complex Stories

**When to use Reasoning Engine**:
- Very large stories (20+ ACs)
- Complex cross-referencing with multiple prior outputs (test-design, risk-profile)
- Multi-step gap analysis with recommendation refinement

**Reasoning Engine Workflow**:
```python
class TraceRequirementsWorkflow:
    """
    Reasoning Engine workflow for trace-requirements (complex stories).
    """

    def execute(self, story_id: str, story_path: str) -> dict:
        # Step 1: Extract requirements
        requirements = self.extract_requirements(story_path)

        # Step 2: Discover tests (with retry logic)
        tests = self.discover_tests_with_retry(requirements)

        # Step 3: Map with AI assistance (for ambiguous matches)
        mappings = self.ai_assisted_mapping(requirements, tests)

        # Step 4: Analyze coverage (multi-pass validation)
        coverage = self.multi_pass_coverage_analysis(mappings)

        # Step 5: Generate recommendations (with reasoning)
        gaps = self.generate_reasoned_recommendations(coverage)

        # Step 6: Produce outputs
        return self.generate_outputs(requirements, mappings, coverage, gaps)
```

**Use Case**: Stories with ambiguous test mappings requiring AI reasoning to determine relevance.

---

## 15. Performance Characteristics

### Execution Time

**Estimated Duration**:
- **Small story** (3-5 ACs, ~10 tests): 30-60 seconds
- **Medium story** (8-12 ACs, ~30 tests): 1-3 minutes
- **Large story** (15+ ACs, ~50+ tests): 3-5 minutes

**Time Breakdown**:
```
Story file reading: 1-2 seconds
Requirements extraction: 5-10 seconds
Test file discovery: 10-30 seconds (depends on project size)
Test case extraction: 20-60 seconds
GWT documentation generation: 10-30 seconds
Coverage analysis: 5-10 seconds
Gap identification: 5-10 seconds
Report generation: 10-20 seconds
Cloud Storage write: 2-5 seconds
```

**Bottlenecks**:
- **Test file discovery**: Searching large codebases (1000+ files) can be slow
- **Test case extraction**: Parsing test files requires regex or AST parsing
- **GWT generation**: AI-assisted GWT may require LLM calls (adds latency)

**Optimizations**:
1. **Cache test file locations**: Store test file index in Firestore
2. **Parallel test parsing**: Process multiple test files concurrently
3. **Incremental updates**: Only re-analyze changed requirements/tests
4. **Pre-computed mappings**: If test-design exists, use as index

---

### Resource Requirements

**Cloud Function Resources**:
```yaml
memory: 512 MB - 1 GB
timeout: 300 seconds (5 minutes)
cpu: 1 vCPU
concurrency: 10 (multiple stories can trace in parallel)
```

**Storage Requirements**:
```yaml
input_size: 10-50 KB (story file)
output_size: 50-200 KB (traceability report)
temporary_storage: 100-500 KB (test file processing)
```

**API Calls**:
- Cloud Storage: 1 read (story), 1-100 reads (tests), 1 write (report)
- Firestore (if used): 1 read (config), 1 write (cache)
- LLM API (if AI-assisted): 0-10 calls (for ambiguous GWT generation)

---

### Scalability

**Concurrent Executions**:
- Multiple QA agents can trace different stories in parallel
- Cloud Function concurrency: 10-100 (configurable)
- No shared state between traces (stateless)

**Large Projects**:
- Projects with 1000+ test files: Use indexed search (Firestore) or git grep
- Projects with 100+ stories: Batch trace execution with Cloud Tasks queue
- Large test files (>10,000 lines): Stream parsing to avoid memory limits

**Caching Strategy**:
```yaml
cache_key: '{story_id}-{story_hash}-{tests_hash}'
cache_validity: 24 hours or until story/tests modified
cache_storage: Firestore or Memorystore (Redis)
benefits:
  - Avoid re-running trace for unchanged stories
  - Faster response for review-story orchestration
  - Reduced API costs
```

---

## 16. Summary & Key Takeaways

### Task Purpose (One Sentence)
**trace-requirements maps story requirements to test cases using Given-When-Then documentation, analyzes coverage completeness, identifies gaps, and feeds quality gate decisions.**

### Critical Success Factors

1. **Complete Requirements Extraction**
   - Extract ACs, NFRs, edge cases, tasks from story
   - Ensure no testable requirements missed

2. **Accurate Test Discovery**
   - Find all relevant tests in project (unit, integration, e2e, specialized)
   - Use file path heuristics, name matching, content analysis

3. **Meaningful Given-When-Then Documentation**
   - Document **what tests validate**, not how they're coded
   - Provide clarity for non-technical stakeholders

4. **Appropriate Coverage Assessment**
   - Evaluate coverage at appropriate test levels
   - Don't require e2e for simple logic or unit for user journeys

5. **Actionable Gap Recommendations**
   - Identify gaps with severity and suggested tests
   - Prioritize based on risk, criticality, business impact

6. **Quality Gate Integration**
   - Critical gaps → FAIL
   - Significant gaps → CONCERNS
   - Full coverage → PASS contribution

### Integration Dependencies

**Upstream Tasks**:
- **test-design**: Provides test scenarios as reference (optional but recommended)

**Downstream Tasks**:
- **review-story**: Aggregates trace block into gate YAML
- **qa-gate**: Uses coverage gaps for gate decision

**Parallel Tasks**:
- **risk-profile**: Risks inform coverage prioritization
- **nfr-assess**: NFR validation complements trace

### Output Artifacts

1. **Traceability Report** (markdown)
   - Requirements-to-test mappings with GWT
   - Coverage analysis and gap identification
   - Test design validation (if applicable)
   - Recommendations and quality score

2. **Gate YAML Block**
   - Coverage totals (requirements, full, partial, none)
   - Uncovered requirements with reasons
   - Reference to detailed report

3. **Story Hook Line**
   - Reference for review-story to quote

### Common Pitfalls

1. **Confusing GWT Documentation with BDD Test Code**
   - ❌ Writing tests with Given/When/Then syntax
   - ✓ Using GWT for documentation only, tests use project standards

2. **Over-Testing at All Levels**
   - ❌ Requiring unit + integration + e2e for every AC
   - ✓ Appropriate test levels for requirement type

3. **Missing NFR Specialized Tests**
   - ❌ Expecting standard tests for performance/security
   - ✓ Recommending load tests, security scans, etc.

4. **Ignoring Test Design Output**
   - ❌ Not cross-referencing designed tests
   - ✓ Validating that designed tests are implemented

5. **Static Traceability**
   - ❌ One-time trace, never updated
   - ✓ Re-run trace after significant story/test changes

### ADK Implementation Summary

**Recommended Approach**: Cloud Function (medium complexity)

**Key Components**:
- Cloud Function for trace execution
- Cloud Storage for outputs (traceability reports)
- Firestore for caching (optional optimization)
- Git repository integration for test file access

**Alternative**: Reasoning Engine for very large/complex stories with AI-assisted mapping

---

**End of trace-requirements Task Analysis**

**Document Metadata**:
- **Lines**: ~2,300
- **Analysis Date**: 2025-10-14
- **Analyzer**: Claude Code (AI Agent)
- **Task Complexity**: Medium (requirements mapping, coverage analysis, gap identification)
- **ADK Translation**: Cloud Function (primary), Reasoning Engine (complex cases)
