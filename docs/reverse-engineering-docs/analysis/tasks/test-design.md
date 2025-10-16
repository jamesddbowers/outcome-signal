# Task Analysis: test-design

**Task ID**: `test-design`
**Task File**: `.bmad-core/tasks/test-design.md`
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: High (Multi-step, requires framework application, YAML generation)

---

## 1. Purpose & Scope

### Primary Purpose
Create comprehensive test scenarios with appropriate test level recommendations (unit/integration/E2E) for story implementation. The task ensures efficient test coverage without redundancy while maintaining appropriate test boundaries through systematic application of testing frameworks.

### Scope Definition
- **In Scope**:
  - Breaking down acceptance criteria into testable scenarios
  - Applying test level framework to determine unit/integration/E2E classification
  - Assigning test priorities (P0/P1/P2/P3) based on risk and business impact
  - Designing complete test scenarios with justifications
  - Validating coverage completeness and identifying gaps
  - Mapping tests to identified risks (if risk profile exists)
  - Generating structured outputs (markdown report + YAML gate block)

- **Out of Scope**:
  - Writing actual test code or test implementation
  - Running or executing tests
  - Test data generation or fixture creation
  - Test automation framework selection
  - CI/CD pipeline configuration (though execution order recommendations provided)

### Key Deliverables
1. **Test Design Document** (markdown) - Comprehensive test strategy with scenarios by AC
2. **Gate YAML Block** - Structured summary for quality gate file
3. **Trace References** - Output for use by trace-requirements task

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md' # Path from core-config.yaml
  - story_title: '{title}' # If missing, derive from story file H1
  - story_slug: '{slug}' # If missing, derive from title (lowercase, hyphenated)
```

**Input Details**:
- **story_id**: Numeric identifier in format `{epic}.{story}` (e.g., "1.3" = Epic 1, Story 3)
- **story_path**: Full file path to story markdown file, resolved from `core-config.yaml` → `devStoryLocation`
- **story_title**: Human-readable story title (fallback: extract from story file's H1 heading)
- **story_slug**: URL-safe identifier (fallback: derive from title by lowercasing and hyphenating)

### Optional/Contextual Inputs
- **Risk Profile**: If `qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md` exists, map test scenarios to identified risks
- **Story Acceptance Criteria**: From story file, used to determine test scenarios
- **Story Tasks/Subtasks**: Additional testable requirements beyond ACs
- **Previous Story Context**: If previous stories exist, understand test patterns

### Configuration Dependencies

From `core-config.yaml`:
- `devStoryLocation`: Path to story files (required)
- `qa.qaLocation`: Path to QA assessments directory (required)

### Data File Dependencies

**test-levels-framework.md** - Required for test level decisions:
- Unit test criteria and characteristics
- Integration test criteria and characteristics
- E2E test criteria and characteristics
- Test level selection rules
- Anti-patterns to avoid
- Duplicate coverage guard rules
- Test naming conventions
- Test ID format specifications

**test-priorities-matrix.md** - Required for priority classification:
- P0 (Critical) - Must test criteria
- P1 (High) - Should test criteria
- P2 (Medium) - Nice to test criteria
- P3 (Low) - Test if time permits criteria
- Risk-based priority adjustments
- Coverage targets by priority
- Priority decision tree
- Test execution order

---

## 3. Execution Flow

### High-Level Process (5 Sequential Steps)

```
Step 1: Analyze Story Requirements
  ↓
Step 2: Apply Test Level Framework
  ↓
Step 3: Assign Priorities
  ↓
Step 4: Design Test Scenarios
  ↓
Step 5: Validate Coverage
  ↓
Outputs: Markdown Report + YAML Gate Block + Trace References
```

### Detailed Step-by-Step Flow

#### Step 1: Analyze Story Requirements

**Action**: Break down each acceptance criterion into testable scenarios.

**Process**:
1. Read story file from `story_path`
2. Extract all acceptance criteria (typically in "## Acceptance Criteria" section)
3. For each AC, identify:
   - **Core functionality to test** - Primary behavior or outcome
   - **Data variations needed** - Different input types, edge values, boundary conditions
   - **Error conditions** - Invalid inputs, system failures, constraint violations
   - **Edge cases** - Unusual but valid scenarios, boundary conditions, rare combinations

**Example Analysis**:
```yaml
acceptance_criterion:
  id: AC1
  description: "User can reset password using email link"
  testable_scenarios:
    - core: "Valid reset link generates password change form"
    - data_variations:
        - "Fresh link (<15 min old)"
        - "Expired link (>15 min old)"
        - "Already-used link"
    - error_conditions:
        - "Invalid token format"
        - "User account doesn't exist"
        - "User account locked"
    - edge_cases:
        - "Multiple concurrent reset requests"
        - "Reset during active session"
        - "Reset for unverified email"
```

**Output**: List of all testable scenarios extracted from ACs, organized by type (core/variations/errors/edges).

---

#### Step 2: Apply Test Level Framework

**Action**: Determine appropriate test level (unit/integration/E2E) for each scenario using test-levels-framework.md.

**Framework Reference**: Load `.bmad-core/data/test-levels-framework.md`

**Quick Decision Rules**:

**Unit Tests** - Use when:
- Testing pure functions and business logic
- Algorithm correctness validation
- Input validation and data transformation
- Error handling in isolated components
- Complex calculations or state machines
- **Characteristics**: Fast, no external dependencies, highly maintainable, easy debugging

**Integration Tests** - Use when:
- Component interaction verification
- Database operations and transactions
- API endpoint contracts
- Service-to-service communication
- Middleware and interceptor behavior
- **Characteristics**: Moderate speed, tests component boundaries, may use test DBs/containers

**E2E Tests** - Use when:
- Critical user journeys
- Cross-system workflows
- Visual regression testing
- Compliance and regulatory requirements
- Final validation before release
- **Characteristics**: Slower execution, tests complete workflows, requires full environment

**Application Process**:
1. For each testable scenario from Step 1:
2. Evaluate scenario against unit test criteria → If match, classify as `unit`
3. Else evaluate against integration test criteria → If match, classify as `integration`
4. Else evaluate against E2E test criteria → If match, classify as `e2e`
4. Apply **duplicate coverage guard**: Check if scenario already covered at lower level
5. Document justification for test level choice

**Duplicate Coverage Guard**:
- Before classifying at higher level, verify not already tested at lower level
- Coverage overlap only acceptable when:
  - Testing different aspects (unit: logic, integration: interaction, e2e: UX)
  - Critical paths requiring defense in depth
  - Regression prevention for previously broken functionality

**Example Application**:
```yaml
scenario: "Validate password strength requirements"
evaluation:
  unit_criteria_match: YES # Pure validation logic, no dependencies
  classification: unit
  justification: "Pure validation logic with multiple branches, no external dependencies"

scenario: "Store new password hash in database"
evaluation:
  unit_criteria_match: NO # Requires database
  integration_criteria_match: YES # DB operation with transaction
  classification: integration
  justification: "Critical data flow between service and persistence layer"

scenario: "User completes password reset journey"
evaluation:
  unit_criteria_match: NO
  integration_criteria_match: NO # Cross-system workflow
  e2e_criteria_match: YES # Critical user journey
  classification: e2e
  justification: "Security-critical user journey requiring full validation"
```

**Output**: Each testable scenario classified with test level (unit/integration/e2e) and justification.

---

#### Step 3: Assign Priorities

**Action**: Assign test priority (P0/P1/P2/P3) based on risk, criticality, and business impact using test-priorities-matrix.md.

**Framework Reference**: Load `.bmad-core/data/test-priorities-matrix.md`

**Quick Priority Assignment Rules**:

**P0 - Critical (Must Test)**:
- Revenue-impacting functionality
- Security-critical paths
- Data integrity operations
- Regulatory compliance requirements
- Previously broken functionality (regression prevention)
- **Coverage Requirements**: >90% unit, >80% integration, all critical E2E paths
- **Examples**: Payment processing, authentication, user data operations, financial calculations, GDPR compliance

**P1 - High (Should Test)**:
- Core user journeys
- Frequently used features
- Features with complex logic
- Integration points between systems
- Features affecting user experience
- **Coverage Requirements**: >80% unit, >60% integration, main happy paths E2E
- **Examples**: User registration, search, import/export, notifications, dashboards

**P2 - Medium (Nice to Test)**:
- Secondary features
- Admin functionality
- Reporting features
- Configuration options
- UI polish and aesthetics
- **Coverage Requirements**: >60% unit, >40% integration, smoke tests E2E
- **Examples**: Admin settings, report generation, theme customization, help docs, analytics

**P3 - Low (Test if Time Permits)**:
- Rarely used features
- Nice-to-have functionality
- Cosmetic issues
- Non-critical optimizations
- **Coverage Requirements**: Best effort, can rely on manual testing
- **Examples**: Advanced preferences, legacy features, experimental features, debug utilities

**Priority Decision Tree**:
```
Is it revenue-critical?
├─ YES → P0
└─ NO → Does it affect core user journey?
    ├─ YES → Is it high-risk?
    │   ├─ YES → P0
    │   └─ NO → P1
    └─ NO → Is it frequently used?
        ├─ YES → P1
        └─ NO → Is it customer-facing?
            ├─ YES → P2
            └─ NO → P3
```

**Risk-Based Adjustments**:

*Increase Priority When*:
- High user impact (>50% of users)
- High financial impact (>$10K potential loss)
- Security vulnerability potential
- Compliance/legal requirements
- Customer-reported issues
- Complex implementation (>500 LOC)
- Multiple system dependencies

*Decrease Priority When*:
- Feature flag protected
- Gradual rollout planned
- Strong monitoring in place
- Easy rollback capability
- Low usage metrics
- Simple implementation
- Well-isolated component

**Application Process**:
1. For each classified test scenario from Step 2:
2. Apply priority decision tree to determine initial priority
3. Check for risk-based adjustments (increase/decrease)
4. If risk profile exists, cross-reference scenario with identified risks:
   - If scenario mitigates Critical risk (score 9) → P0
   - If scenario mitigates High risk (score 6) → P0 or P1
   - If scenario mitigates Medium risk (score 4) → P1 or P2
5. Document priority with rationale

**Example Application**:
```yaml
scenario: "Validate password strength requirements"
level: unit
priority_evaluation:
  revenue_critical: NO
  core_journey: YES # Part of registration/password reset
  high_risk: YES # Security-critical validation
  decision: P0
  rationale: "Security-critical validation for authentication system"
  mitigates_risks: ['SEC-001: Weak password acceptance']

scenario: "Display password strength indicator"
level: integration
priority_evaluation:
  revenue_critical: NO
  core_journey: YES
  high_risk: NO
  frequently_used: YES
  decision: P1
  rationale: "Core UX feature for registration, non-security-critical"

scenario: "Customize password strength message text"
level: unit
priority_evaluation:
  revenue_critical: NO
  core_journey: NO
  frequently_used: NO
  customer_facing: YES
  admin_functionality: YES
  decision: P2
  rationale: "Admin configuration feature with low user impact"
```

**Output**: Each test scenario assigned priority (P0/P1/P2/P3) with rationale and risk linkage (if applicable).

---

#### Step 4: Design Test Scenarios

**Action**: Create complete, structured test scenario specifications for each identified test need.

**Test Scenario Schema**:
```yaml
test_scenario:
  id: '{epic}.{story}-{LEVEL}-{SEQ}'  # e.g., "1.3-UNIT-001"
  requirement: 'AC reference'           # Which AC this tests
  priority: P0|P1|P2|P3                # From Step 3
  level: unit|integration|e2e          # From Step 2
  description: 'What is being tested'   # Clear, specific test description
  justification: 'Why this level was chosen' # From Step 2 analysis
  mitigates_risks: ['RISK-001']        # If risk profile exists
```

**Test ID Format**:
- Pattern: `{EPIC}.{STORY}-{LEVEL}-{SEQ}`
- Components:
  - `{EPIC}.{STORY}`: Story identifier (e.g., "1.3")
  - `{LEVEL}`: UNIT | INT | E2E
  - `{SEQ}`: Zero-padded sequence number (001, 002, ...)
- Examples:
  - `1.3-UNIT-001` - First unit test for story 1.3
  - `1.3-INT-002` - Second integration test for story 1.3
  - `1.3-E2E-001` - First E2E test for story 1.3

**Sequence Numbering**:
- Separate sequences per level (UNIT: 001+, INT: 001+, E2E: 001+)
- Ordered by priority (P0 first, then P1, P2, P3)
- Within same priority, ordered by AC sequence

**Description Guidelines**:
- Be specific and actionable
- Start with verb (Validate, Verify, Test, Ensure)
- Include key parameters or conditions
- Avoid ambiguity
- Examples:
  - Good: "Validate password strength rejects passwords <8 characters"
  - Bad: "Test password validation"

**Justification Guidelines**:
- Explain why this test level is appropriate
- Reference framework criteria (pure logic, component interaction, user journey)
- Note any duplicate coverage considerations
- Examples:
  - "Pure validation logic with multiple branches, no external dependencies"
  - "Critical data flow between service and persistence layer"
  - "Security-critical user journey requiring full validation"

**Risk Linkage** (If risk profile exists):
- Cross-reference with `qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md`
- Map test scenarios to risk IDs
- Ensure high-priority risks have corresponding test coverage
- Document in `mitigates_risks` array

**Design Process**:
1. For each prioritized/classified scenario from Step 3:
2. Generate unique test ID using format above
3. Map to specific acceptance criterion
4. Write clear, specific test description
5. Include justification from Step 2
6. If risk profile exists, link to relevant risk IDs
7. Ensure scenarios are atomic and independent

**Example Test Scenarios**:
```yaml
# From AC1: User can reset password using email link

- test_scenario:
    id: "1.3-UNIT-001"
    requirement: "AC1"
    priority: P0
    level: unit
    description: "Validate password strength rejects passwords <8 characters"
    justification: "Pure validation logic with multiple branches, no external dependencies"
    mitigates_risks: ['SEC-001']

- test_scenario:
    id: "1.3-UNIT-002"
    requirement: "AC1"
    priority: P0
    level: unit
    description: "Validate password strength requires at least one special character"
    justification: "Isolated business rule validation, testable without dependencies"
    mitigates_risks: ['SEC-001']

- test_scenario:
    id: "1.3-INT-001"
    requirement: "AC1"
    priority: P0
    level: integration
    description: "Password reset service stores new password hash in database"
    justification: "Critical data flow between service and persistence layer"
    mitigates_risks: ['SEC-002', 'DATA-001']

- test_scenario:
    id: "1.3-INT-002"
    requirement: "AC1"
    priority: P0
    level: integration
    description: "Expired reset token (>15 min) is rejected with error message"
    justification: "Token validation requires timestamp comparison and database lookup"
    mitigates_risks: ['SEC-003']

- test_scenario:
    id: "1.3-E2E-001"
    requirement: "AC1"
    priority: P1
    level: e2e
    description: "User completes full password reset journey from email to login"
    justification: "Security-critical user journey requiring full validation"
    mitigates_risks: ['SEC-001', 'SEC-002', 'SEC-003']
```

**Output**: Complete set of structured test scenarios with IDs, classifications, priorities, and justifications.

---

#### Step 5: Validate Coverage

**Action**: Ensure test design is complete, efficient, and properly covers all requirements.

**Validation Checklist**:

**1. Every AC has at least one test**:
- Review all acceptance criteria from story
- Confirm each AC has at least one mapped test scenario
- Identify any ACs without test coverage → Document as coverage gap

**2. No duplicate coverage across levels**:
- Review all test scenarios
- Identify scenarios that test same functionality at multiple levels
- Evaluate if duplicate coverage is justified:
  - ✓ Justified: Testing different aspects (unit: logic, integration: interaction, e2e: UX)
  - ✓ Justified: Critical path requiring defense in depth
  - ✓ Justified: Regression prevention for previously broken functionality
  - ✗ Unjustified: Same aspect tested at multiple levels without clear rationale
- Remove or consolidate unjustified duplicates

**3. Critical paths have multiple levels**:
- Identify critical paths (revenue, security, compliance)
- Verify critical paths have coverage at multiple levels:
  - Unit: Logic validation
  - Integration: Component interaction validation
  - E2E: End-to-end user journey validation
- Add missing test levels if gaps found

**4. Risk mitigations are addressed**:
- If risk profile exists, load risk assessment
- For each identified risk (especially score ≥ 6):
  - Verify at least one test scenario mitigates the risk
  - Ensure test priority aligns with risk severity (Critical/High risks → P0/P1 tests)
- Document any unmitigated risks as coverage gaps

**Validation Process**:
1. Create AC coverage matrix: Map each AC to its test scenarios
2. Identify ACs with zero test coverage → Add to `coverage_gaps`
3. Create test level distribution analysis:
   - Count scenarios by level (unit, integration, e2e)
   - Calculate percentages
   - Verify shift-left principle (unit > integration > e2e)
4. Create priority distribution analysis:
   - Count scenarios by priority (P0, P1, P2, P3)
   - Verify P0 tests cover critical/security/revenue paths
5. If risk profile exists:
   - Create risk coverage matrix: Map each risk to mitigating tests
   - Identify unmitigated risks → Add to `coverage_gaps`
6. Review duplicate coverage:
   - Identify scenarios testing same functionality
   - Evaluate justification
   - Remove unjustified duplicates
7. Finalize coverage validation results

**Coverage Gap Documentation**:
```yaml
coverage_gaps:
  - type: "missing_ac_coverage"
    ac: "AC4"
    description: "No test found for password history validation"
    severity: "high"
    recommendation: "Add integration test for password history check against last 5 passwords"

  - type: "missing_risk_coverage"
    risk: "SEC-005"
    description: "No test for account lockout after failed reset attempts"
    severity: "high"
    recommendation: "Add integration test for failed reset attempt lockout logic"

  - type: "duplicate_coverage"
    tests: ["1.3-UNIT-005", "1.3-INT-003"]
    description: "Both test password format validation"
    severity: "low"
    recommendation: "Remove integration test, unit test sufficient for format validation"
```

**Output**: Validated test design with coverage gaps documented, ready for report generation.

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Test Level Selection (Step 2)

**Decision**: Which test level (unit/integration/e2e) is appropriate for this scenario?

**Branching Logic**:
```
Evaluate scenario against unit criteria
├─ Pure logic, no dependencies? → UNIT
├─ Algorithm, calculation, validation? → UNIT
└─ NO → Continue to integration evaluation
    │
    Evaluate scenario against integration criteria
    ├─ Component interaction? → INTEGRATION
    ├─ Database operation? → INTEGRATION
    ├─ API endpoint? → INTEGRATION
    └─ NO → Continue to E2E evaluation
        │
        Evaluate scenario against E2E criteria
        ├─ Critical user journey? → E2E
        ├─ Cross-system workflow? → E2E
        ├─ Compliance requirement? → E2E
        └─ NO → Default to INTEGRATION (if unsure)
```

**Guidance**:
- **Favor lower levels** (shift left): Unit > Integration > E2E
- **When uncertain**, prefer integration over E2E (faster execution, easier debugging)
- **Apply duplicate coverage guard**: If already tested at lower level, don't duplicate at higher level unless justified

---

### Decision Point 2: Priority Assignment (Step 3)

**Decision**: What priority (P0/P1/P2/P3) should be assigned to this test?

**Branching Logic**:
```
Is scenario revenue-critical?
├─ YES → P0
└─ NO → Continue evaluation
    │
    Does scenario affect core user journey?
    ├─ YES → Is it high-risk (security, data loss)?
    │   ├─ YES → P0
    │   └─ NO → P1
    └─ NO → Continue evaluation
        │
        Is scenario frequently used?
        ├─ YES → P1
        └─ NO → Continue evaluation
            │
            Is scenario customer-facing?
            ├─ YES → P2
            └─ NO → P3
```

**Risk-Based Adjustments**:
```
Check risk profile (if exists)
│
Does scenario mitigate risk with score ≥ 9 (Critical)?
├─ YES → Increase to P0 (override decision tree)
└─ NO → Continue
    │
    Does scenario mitigate risk with score ≥ 6 (High)?
    ├─ YES → Increase to P0 or P1 (if not already)
    └─ NO → Use priority from decision tree
```

---

### Decision Point 3: Coverage Gap Severity (Step 5)

**Decision**: How severe is this coverage gap?

**Branching Logic**:
```
Evaluate gap type and impact
│
Is gap for P0 test (revenue/security/compliance)?
├─ YES → Severity: HIGH
└─ NO → Continue evaluation
    │
    Is gap for P1 test (core journey)?
    ├─ YES → Severity: MEDIUM
    └─ NO → Severity: LOW
```

**Recommendation Generation**:
```
Based on severity
│
Severity: HIGH
├─ Recommendation: "MUST add before story completion"
│
Severity: MEDIUM
├─ Recommendation: "Should add, or accept risk with justification"
│
Severity: LOW
├─ Recommendation: "Consider adding if time permits"
```

---

### Decision Point 4: Duplicate Coverage Justification (Step 5)

**Decision**: Is duplicate coverage across test levels justified?

**Branching Logic**:
```
Identify tests at different levels testing same functionality
│
Are they testing DIFFERENT ASPECTS?
├─ YES (Unit: logic, Integration: interaction, E2E: UX) → Justified
└─ NO → Continue evaluation
    │
    Is this a CRITICAL PATH (revenue/security/compliance)?
    ├─ YES (defense in depth) → Justified
    └─ NO → Continue evaluation
        │
        Is this REGRESSION PREVENTION (previously broken)?
        ├─ YES → Justified
        └─ NO → NOT JUSTIFIED → Recommend removal
```

**Action Based on Justification**:
- **Justified**: Keep both tests, document justification clearly
- **Not Justified**: Remove higher-level test (keep unit over integration, integration over E2E)

---

### Decision Point 5: Risk Coverage Completeness (Step 5)

**Decision**: Are all identified risks adequately mitigated by test scenarios?

**Branching Logic**:
```
Load risk profile (if exists)
│
For each risk with score ≥ 6 (High or Critical)
│
Does at least one test scenario mitigate this risk?
├─ YES → Risk covered, continue to next risk
└─ NO → Coverage gap detected
    │
    Add to coverage_gaps
    severity: HIGH (if risk score ≥ 9)
    severity: MEDIUM (if risk score ≥ 6)
    recommendation: "Add test to mitigate [RISK-ID]"
```

---

## 5. User Interaction Points

### Interaction Point 1: Confirm Story Context (Before Step 1)

**When**: Before analyzing requirements

**Purpose**: Verify correct story and gather any additional context

**Interaction**:
```
Agent: "I'll design the test strategy for Story {story_id}: {story_title}.

        Story file: {story_path}

        I'll analyze the acceptance criteria and create comprehensive test scenarios
        with appropriate test levels (unit/integration/E2E) and priorities (P0-P3).

        {If risk profile exists: I found an existing risk profile - I'll map tests to identified risks.}

        Shall I proceed?"

User: [Confirms or provides corrections]
```

**Branching**:
- User confirms → Proceed to Step 1
- User provides corrections → Update inputs, then proceed to Step 1
- User requests changes → Adjust approach, then proceed

---

### Interaction Point 2: Clarify Ambiguous Requirements (During Step 1)

**When**: Acceptance criteria are unclear or incomplete

**Purpose**: Resolve ambiguity before designing tests

**Interaction**:
```
Agent: "I found some ambiguity in the acceptance criteria:

        AC3: 'User receives notification'

        Questions:
        1. What type of notification? (Email, SMS, push, in-app?)
        2. When is notification sent? (Immediately, async, scheduled?)
        3. What happens if notification fails?

        Can you clarify these points, or shall I make reasonable assumptions
        and document them in the test design?"

User: [Provides clarification or approves assumptions]
```

**Branching**:
- User provides clarification → Use clarified requirements in test design
- User approves assumptions → Document assumptions in test design
- User requests story update → HALT, recommend updating story first

---

### Interaction Point 3: Risk Profile Integration (During Step 3/4)

**When**: Risk profile exists for this story

**Purpose**: Confirm risk linkage approach

**Interaction**:
```
Agent: "I found an existing risk profile with {X} identified risks:
        - {Y} Critical risks (score 9)
        - {Z} High risks (score 6)

        I'll ensure test scenarios mitigate these risks and map each test
        to the risks it addresses. Shall I proceed with risk-based prioritization?"

User: [Confirms or requests modifications]
```

**Branching**:
- User confirms → Apply risk-based priority adjustments, create risk linkage
- User requests focus on specific risks → Prioritize those risks in test design
- User says ignore risk profile → Design tests based on ACs only

---

### Interaction Point 4: Coverage Gap Review (After Step 5)

**When**: Coverage gaps identified during validation

**Purpose**: Decide how to handle gaps before finalizing

**Interaction**:
```
Agent: "Test design validation found {X} coverage gaps:

        HIGH SEVERITY:
        - AC4: No test for password history validation
        - RISK SEC-005: No test for account lockout

        MEDIUM SEVERITY:
        - AC7: Partial coverage for notification retry logic

        Options:
        1. Add tests to close gaps now (recommended for HIGH severity)
        2. Document gaps for future work
        3. Accept gaps with justification

        How would you like to proceed?"

User: [Selects option]
```

**Branching**:
- User selects Option 1 → Return to Step 4, design additional tests, re-validate
- User selects Option 2 → Document gaps in output, proceed to output generation
- User selects Option 3 → Document acceptance in output, proceed to output generation

---

### Interaction Point 5: Output Confirmation (After All Steps)

**When**: Test design complete, before writing outputs

**Purpose**: Final review and approval

**Interaction**:
```
Agent: "Test design complete:

        Total scenarios: {X}
        - Unit tests: {Y} ({A}%)
        - Integration tests: {Z} ({B}%)
        - E2E tests: {W} ({C}%)

        Priority distribution:
        - P0: {count} ({percent}%)
        - P1: {count} ({percent}%)
        - P2: {count} ({percent}%)
        - P3: {count} ({percent}%)

        Coverage: {Y} ACs covered, {Z} gaps documented

        Shall I generate the test design document and gate YAML block?"

User: [Confirms or requests modifications]
```

**Branching**:
- User confirms → Generate all outputs
- User requests modifications → Return to appropriate step, make changes, re-present
- User requests specific changes → Apply changes, regenerate outputs

---

## 6. Output Specifications

### Output 1: Test Design Document (Markdown)

**File Location**: `qa.qaLocation/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md`

**Path Resolution**:
- `qa.qaLocation` from `core-config.yaml`
- Create `assessments/` subdirectory if doesn't exist
- Filename format: `{epic}.{story}-test-design-{YYYYMMDD}.md`
  - Example: `1.3-test-design-20251014.md`

**Document Structure**:

```markdown
# Test Design: Story {epic}.{story}

Date: {YYYY-MM-DD}
Designer: Quinn (Test Architect)
Story: {story_title}

## Test Strategy Overview

- **Total test scenarios**: {X}
- **Unit tests**: {Y} ({A}%)
- **Integration tests**: {Z} ({B}%)
- **E2E tests**: {W} ({C}%)
- **Priority distribution**: P0: {count}, P1: {count}, P2: {count}, P3: {count}

### Test Level Distribution

The test distribution follows the "shift left" principle, favoring faster, more maintainable tests:

- Unit tests provide fast feedback on business logic
- Integration tests validate component interactions
- E2E tests verify critical user journeys

### Priority Distribution

Priority assignments are based on risk, business impact, and user criticality:

- **P0 (Critical)**: Revenue, security, compliance - must test
- **P1 (High)**: Core journeys, frequent use - should test
- **P2 (Medium)**: Secondary features - nice to test
- **P3 (Low)**: Rarely used - test if time permits

## Test Scenarios by Acceptance Criteria

### AC1: {description}

#### Test Scenarios

| ID           | Level       | Priority | Test Description              | Justification                |
| ------------ | ----------- | -------- | ----------------------------- | ---------------------------- |
| 1.3-UNIT-001 | Unit        | P0       | Validate input format         | Pure validation logic        |
| 1.3-INT-001  | Integration | P0       | Service processes request     | Multi-component flow         |
| 1.3-E2E-001  | E2E         | P1       | User completes journey        | Critical path validation     |

#### Risk Coverage

{If risk profile exists}
- **SEC-001** (Score 9, Critical): Mitigated by 1.3-UNIT-001, 1.3-INT-001, 1.3-E2E-001
- **DATA-001** (Score 6, High): Mitigated by 1.3-INT-001

---

### AC2: {description}

{Continue for all ACs...}

---

## Risk Coverage Matrix

{Only if risk profile exists}

This section maps test scenarios to identified risks from the risk profile.

| Risk ID  | Severity | Description                  | Mitigating Tests              | Coverage |
| -------- | -------- | ---------------------------- | ----------------------------- | -------- |
| SEC-001  | Critical | XSS on profile form          | 1.3-UNIT-001, 1.3-INT-002     | Full     |
| SEC-002  | High     | Password storage weakness    | 1.3-INT-003                   | Full     |
| DATA-001 | High     | Data loss on error           | 1.3-INT-001, 1.3-E2E-001      | Full     |
| PERF-001 | Medium   | Slow query performance       | 1.3-INT-004                   | Partial  |
| SEC-003  | High     | Token expiration not checked | {NONE}                        | **GAP**  |

### Unmitigated Risks

- **SEC-003** (High): Token expiration not checked → Recommendation: Add integration test for expired token rejection

## Coverage Gaps

{If gaps identified}

### High Severity Gaps

1. **AC4 - Password History Validation**: No test coverage
   - **Severity**: High (P0 requirement)
   - **Recommendation**: Add integration test: "1.3-INT-005: Reject password if matches any of last 5 passwords"
   - **Risk**: Data integrity failure, compliance violation

2. **RISK SEC-003 - Token Expiration**: No test coverage
   - **Severity**: High (Score 6)
   - **Recommendation**: Add integration test: "1.3-INT-006: Reject expired reset tokens"
   - **Risk**: Security vulnerability

### Medium Severity Gaps

1. **AC7 - Notification Retry Logic**: Partial coverage
   - **Severity**: Medium (P1 requirement)
   - **Recommendation**: Add integration test for retry exhaustion scenario

### Low Severity Gaps

{If any}

## Recommended Execution Order

Optimized for fast feedback and fail-fast principle:

### Phase 1: P0 Unit Tests (Immediate Feedback)
```
1.3-UNIT-001: Validate password strength rejects passwords <8 characters
1.3-UNIT-002: Validate password strength requires special character
1.3-UNIT-003: Validate token format structure
```

### Phase 2: P0 Integration Tests (Component Verification)
```
1.3-INT-001: Password reset service stores new hash in database
1.3-INT-002: Expired reset token (>15 min) is rejected
1.3-INT-003: Already-used token is rejected
```

### Phase 3: P0 E2E Tests (Critical Paths)
```
1.3-E2E-001: User completes full password reset journey
```

### Phase 4: P1 Tests (Core Functionality)
```
{P1 unit tests}
{P1 integration tests}
{P1 E2E tests}
```

### Phase 5: P2/P3 Tests (Time Permitting)
```
{P2 and P3 tests if time allows}
```

## Test Design Principles Applied

This test design follows BMad testing principles:

1. **Shift Left**: {X}% unit tests provide fastest feedback
2. **Risk-Based**: All Critical/High risks have test coverage
3. **Efficient Coverage**: No duplicate coverage across levels (justified exceptions noted)
4. **Maintainability**: Test levels chosen for long-term maintainability
5. **Fast Feedback**: P0 unit tests execute first for immediate failure detection

## Quality Checklist

- [x] Every AC has at least one test
- [x] Test levels are appropriate (not over-testing)
- [x] No duplicate coverage across levels (or justified)
- [x] Priorities align with business risk
- [x] Test IDs follow naming convention ({epic}.{story}-{LEVEL}-{SEQ})
- [x] Scenarios are atomic and independent
- [x] Risk mitigations addressed (if risk profile exists)
- [x] Coverage gaps documented with severity and recommendations

## Next Steps

1. Review and approve test design
2. Address high-severity coverage gaps (if any)
3. Implement tests following recommended execution order
4. Map requirements to tests using *trace command
5. Execute P0 tests first for fast failure detection

---

**References**:
- Story: {devStoryLocation}/{epic}.{story}.*.md
- Risk Profile: qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md {if exists}
- Test Levels Framework: .bmad-core/data/test-levels-framework.md
- Test Priorities Matrix: .bmad-core/data/test-priorities-matrix.md
```

**Document Generation Notes**:
- Use markdown tables for scenario listings (readable and structured)
- Include risk coverage matrix only if risk profile exists
- Document all coverage gaps with severity and recommendations
- Provide actionable execution order based on priorities
- Include quality checklist as validation proof
- Reference all source documents for traceability

---

### Output 2: Gate YAML Block

**Purpose**: Structured summary for inclusion in quality gate file

**Format**: YAML block for copy-paste into gate file

**Structure**:

```yaml
test_design:
  scenarios_total: {X}
  by_level:
    unit: {Y}
    integration: {Z}
    e2e: {W}
  by_priority:
    p0: {A}
    p1: {B}
    p2: {C}
    p3: {D}
  coverage_gaps: [] # Empty if no gaps, or list of gap descriptions

  # Extended fields (optional but recommended)
  shift_left_ratio: {Y/X} # Percentage of unit tests
  risk_coverage: # Only if risk profile exists
    critical_risks: {count}
    critical_covered: {count}
    high_risks: {count}
    high_covered: {count}

  planning_ref: 'qa.qaLocation/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md'
```

**Field Definitions**:
- `scenarios_total`: Total number of test scenarios designed
- `by_level`: Count of scenarios by test level (unit, integration, e2e)
- `by_priority`: Count of scenarios by priority (p0, p1, p2, p3)
- `coverage_gaps`: Array of gap descriptions (empty array if no gaps)
  - If gaps exist: `['AC4: No test for password history', 'RISK SEC-003: No token expiration test']`
- `shift_left_ratio`: Percentage of unit tests (measures adherence to shift-left principle)
- `risk_coverage`: Risk mitigation coverage (only if risk profile exists)
- `planning_ref`: File path to full test design document

**Example**:

```yaml
test_design:
  scenarios_total: 12
  by_level:
    unit: 5
    integration: 5
    e2e: 2
  by_priority:
    p0: 8
    p1: 3
    p2: 1
    p3: 0
  coverage_gaps:
    - 'AC4: No test for password history validation'
    - 'RISK SEC-003: No test for token expiration check'
  shift_left_ratio: 0.42 # 42% unit tests
  risk_coverage:
    critical_risks: 2
    critical_covered: 2
    high_risks: 3
    high_covered: 2
  planning_ref: 'qa/assessments/1.3-test-design-20251014.md'
```

**Usage**:
- Agent prints this block to output
- QA agent (*review or *gate commands) copies block into quality gate file
- Used by gate decision logic to evaluate test coverage adequacy

---

### Output 3: Trace References

**Purpose**: Provide summary information for use by trace-requirements task

**Format**: Plain text output (not saved to file)

**Content**:

```text
==========================================
Test Design Complete - Trace References
==========================================

Test design matrix: qa.qaLocation/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md

Test Scenarios Summary:
- Total scenarios: {X}
- P0 tests identified: {count}
- P1 tests identified: {count}
- P2 tests identified: {count}
- P3 tests identified: {count}

Acceptance Criteria Coverage:
- Total ACs: {X}
- ACs with test coverage: {Y}
- ACs without coverage: {Z}

Next Step: Run *trace {story} to map requirements to test cases using Given-When-Then patterns.
```

**Usage**:
- Displayed in agent output after test design completion
- Provides file path for trace-requirements task to load
- Summarizes P0 test count (critical for trace task to verify)
- Guides user to next task in QA workflow

---

## 7. Error Handling & Validation

### Error Condition 1: Story File Not Found

**Trigger**: `story_path` does not exist

**Detection**: File read operation fails

**Handling**:
```
HALT execution
Display error:
  "Story file not found: {story_path}

   Please verify:
   1. Story ID is correct ({story_id})
   2. core-config.yaml has correct devStoryLocation
   3. Story file exists at expected location

   Expected location: {devStoryLocation}/{epic}.{story}.*.md"

Request correction from user
```

**Resolution**: User provides correct story path or fixes configuration

---

### Error Condition 2: No Acceptance Criteria Found

**Trigger**: Story file contains no acceptance criteria section or ACs are empty

**Detection**: After parsing story file, AC list is empty

**Handling**:
```
HALT execution
Display warning:
  "No acceptance criteria found in story file.

   A story must have acceptance criteria to design tests.

   Options:
   1. Add acceptance criteria to story and re-run
   2. Proceed with task-based testing (tests derived from tasks/subtasks)
   3. Cancel test design

   What would you like to do?"

Wait for user decision
```

**Resolution**:
- Option 1: User updates story, task re-runs
- Option 2: Proceed using tasks/subtasks as requirements source
- Option 3: Exit task

---

### Error Condition 3: Missing Configuration (core-config.yaml)

**Trigger**: Required configuration keys missing from `core-config.yaml`

**Detection**: Configuration load fails or required keys not present

**Required Keys**:
- `devStoryLocation`: Path to story files
- `qa.qaLocation`: Path to QA assessment outputs

**Handling**:
```
HALT execution
Display error:
  "Required configuration missing from core-config.yaml:

   Missing: {list of missing keys}

   Please update core-config.yaml with:

   qa:
     qaLocation: 'path/to/qa/assessments'

   devStoryLocation: 'path/to/stories'"

Request configuration fix
```

**Resolution**: User updates `core-config.yaml` with required keys

---

### Error Condition 4: Data File Not Found

**Trigger**: Required data file (test-levels-framework.md or test-priorities-matrix.md) not found

**Detection**: File read operation fails for data dependency

**Handling**:
```
HALT execution
Display error:
  "Required data file not found: {filename}

   Expected location: .bmad-core/data/{filename}

   This file is required for test level/priority classification.

   Please ensure BMad core files are properly installed."

Request file installation or path correction
```

**Resolution**: User installs missing data files or corrects file paths

---

### Error Condition 5: Invalid Test Level Classification

**Trigger**: Cannot determine appropriate test level for scenario

**Detection**: Scenario doesn't match unit, integration, or E2E criteria clearly

**Handling**:
```
Display warning:
  "Ambiguous test level classification for scenario:

   Scenario: {description}

   Could be classified as:
   - Integration: {reason}
   - E2E: {reason}

   Recommendation: {integration | e2e}
   Justification: {reason}

   Proceeding with recommendation. Review classification in test design document."

Log ambiguous classification
Continue with recommended level
```

**Resolution**: Continue with best-guess classification, document ambiguity for human review

---

### Error Condition 6: Cannot Determine Priority

**Trigger**: Scenario doesn't fit clearly into P0/P1/P2/P3 classification

**Detection**: Priority decision tree doesn't provide clear answer

**Handling**:
```
Display prompt:
  "Unclear priority assignment for scenario:

   Scenario: {description}
   Level: {unit|integration|e2e}

   Priority could be P1 or P2:
   - P1 if: Core user journey
   - P2 if: Secondary feature

   Which classification is more accurate?"

Options:
  1. P1 (Core journey)
  2. P2 (Secondary feature)
  3. Let me decide (provide rationale)

Wait for user input
```

**Resolution**: User provides priority or rationale, task continues

---

### Error Condition 7: Output Directory Creation Fails

**Trigger**: Cannot create output directory (`qa.qaLocation/assessments/`)

**Detection**: Directory creation operation fails (permissions, disk space)

**Handling**:
```
HALT execution
Display error:
  "Cannot create output directory: {path}

   Error: {system error message}

   Possible causes:
   - Insufficient permissions
   - Disk space full
   - Invalid path in core-config.yaml

   Please resolve the issue and re-run test design."

Request issue resolution
```

**Resolution**: User fixes permissions, disk space, or path configuration

---

### Error Condition 8: Risk Profile Load Failure

**Trigger**: Risk profile file exists but cannot be loaded or parsed

**Detection**: File read or YAML parse fails for risk profile

**Handling**:
```
Display warning:
  "Found risk profile but cannot load it:

   File: {risk_profile_path}
   Error: {error message}

   Proceeding without risk linkage.
   Test priorities will be based on AC analysis only."

Log warning
Continue without risk linkage
```

**Resolution**: Continue without risk integration, document issue in output

---

### Validation 1: Test ID Uniqueness

**Trigger**: After generating test IDs, check for duplicates

**Detection**: Duplicate test IDs in generated scenarios

**Handling**:
```
INTERNAL ERROR (should not happen with proper sequencing)

If detected:
  Re-sequence test IDs to ensure uniqueness
  Log warning for debugging
  Continue with corrected IDs
```

**Prevention**: Proper sequence counter management in Step 4

---

### Validation 2: Scenario Completeness

**Trigger**: After designing scenarios, verify all required fields present

**Detection**: Scenario missing required fields (id, level, priority, description, justification)

**Handling**:
```
INTERNAL ERROR (should not happen with proper schema enforcement)

If detected:
  Log error with scenario details
  Fill missing fields with placeholders
  Mark scenario for human review in output
  Continue with remaining scenarios
```

**Prevention**: Strict schema enforcement in Step 4

---

### Validation 3: Output File Write Failure

**Trigger**: Cannot write test design document to file

**Detection**: File write operation fails

**Handling**:
```
PARTIAL FAILURE

Display error:
  "Test design complete but cannot save to file:

   File: {output_path}
   Error: {error message}

   Test design is complete in memory.

   Options:
   1. Save to alternate location
   2. Display full output (you can copy manually)
   3. Retry save

   What would you like to do?"

Wait for user decision
```

**Resolution**: User selects alternate save location or copies output manually

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**No Direct Task Dependencies**:
- `test-design` is a standalone task that doesn't invoke other tasks
- However, it's typically invoked as part of larger workflows:
  - `review-story.md` invokes `test-design` as part of comprehensive review
  - `qa-gate.md` may use test-design output for gate decisions

### Data File Dependencies

**Required Data Files**:

1. **test-levels-framework.md**
   - **Path**: `.bmad-core/data/test-levels-framework.md`
   - **Purpose**: Provides criteria for classifying tests as unit/integration/E2E
   - **Usage**: Referenced in Step 2 (Apply Test Level Framework)
   - **Contents**:
     - Unit test criteria and characteristics
     - Integration test criteria and characteristics
     - E2E test criteria and characteristics
     - Test level selection rules
     - Anti-patterns to avoid
     - Duplicate coverage guard
     - Test naming conventions
     - Test ID format specifications
   - **Failure Impact**: Cannot classify test levels → HALT execution

2. **test-priorities-matrix.md**
   - **Path**: `.bmad-core/data/test-priorities-matrix.md`
   - **Purpose**: Provides criteria for prioritizing tests as P0/P1/P2/P3
   - **Usage**: Referenced in Step 3 (Assign Priorities)
   - **Contents**:
     - P0-P3 priority level definitions
     - Priority criteria and examples
     - Risk-based priority adjustments
     - Coverage targets by priority
     - Priority decision tree
     - Test execution order recommendations
   - **Failure Impact**: Cannot assign priorities → HALT execution

### Template Dependencies

**No Template Dependencies**:
- Test design output is generated programmatically, not from templates
- However, output format must be compatible with:
  - `qa-gate-tmpl.yaml` (gate YAML block must match schema)
  - Markdown conventions for assessment documents

### Configuration Dependencies

**core-config.yaml Required Keys**:

```yaml
# Story location
devStoryLocation: 'path/to/stories'

# QA output location
qa:
  qaLocation: 'path/to/qa/assessments'
```

**Configuration Usage**:
- `devStoryLocation`: Resolve story file path
- `qa.qaLocation`: Determine output directory for test design document

### Optional Dependencies

**Risk Profile** (Optional but recommended):
- **Path**: `qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md`
- **Purpose**: If exists, link test scenarios to identified risks
- **Usage**: Referenced in Steps 3 and 4 for risk-based prioritization
- **Failure Impact**: If missing, proceed without risk linkage (not an error)

**Story Context** (Implicit):
- Story file must contain:
  - Acceptance Criteria section (required)
  - Tasks/Subtasks (optional, additional test sources)
  - NFR requirements (optional, for NFR-related test scenarios)
- Missing ACs → Error (cannot design tests without requirements)

### Agent Dependencies

**Typically Invoked By**:
- **QA Agent (Quinn)**: Uses `*test-design {story}` command
- **Direct Invocation**: Can be run standalone by any agent via task execution

**Invokes No Other Agents**:
- Self-contained task execution
- No agent-to-agent handoffs

### Prerequisite State

**Story State Requirements**:
- Story file must exist
- Story must have acceptance criteria
- No specific story status required (can be Draft, Approved, InProgress, or Review)
- Ideally story is complete enough to have clear, testable requirements

**Quality Gate Requirements**:
- No gate prerequisites
- Test design can run before any other QA tasks
- However, typically follows or runs concurrently with:
  - `risk-profile.md` (provides risk linkage)
  - Story implementation (to understand what's being tested)

### Output Dependencies

**test-design Outputs Used By**:

1. **trace-requirements.md**:
   - Loads test design document
   - Maps requirements to test scenarios using Given-When-Then
   - Validates test coverage completeness
   - **Dependency**: Test design must complete before trace can run

2. **qa-gate.md**:
   - Uses test_design YAML block in gate decision
   - Evaluates coverage gaps
   - Checks P0 test completeness
   - **Dependency**: Test design should complete before gate (though not strictly required)

3. **review-story.md**:
   - Orchestrates test design as part of comprehensive review
   - Uses test design output in review results
   - **Dependency**: Review invokes test design, not vice versa

---

## 9. Integration Points

### Integration Point 1: QA Agent Commands

**Command**: `*test-design {story}`

**Integration**:
- QA agent loads `test-design.md` task
- Executes task with story parameter
- Returns test design outputs to user
- May be invoked standalone or as part of `*review` workflow

**Data Flow**:
```
User: *test-design 1.3
  ↓
QA Agent loads test-design.md
  ↓
Task executes (5 steps)
  ↓
Outputs generated:
  - Test design document (saved to file)
  - Gate YAML block (displayed to user)
  - Trace references (displayed to user)
  ↓
Agent displays completion message with file paths
```

---

### Integration Point 2: review-story.md Task

**Integration**: test-design is invoked as part of comprehensive story review

**Workflow**:
```
QA Agent: *review 1.3
  ↓
review-story.md executes
  ↓
Step X: Invoke test-design.md
  ↓
Test design completes
  ↓
Review continues with test design results
  ↓
Gate decision incorporates test_design YAML block
```

**Data Exchange**:
- Review passes story context to test-design
- Test-design returns:
  - File path to test design document
  - Gate YAML block for inclusion in gate file
  - Coverage gap information for review results

---

### Integration Point 3: trace-requirements.md Task

**Integration**: Trace task loads test-design output for requirements mapping

**Workflow**:
```
QA Agent: *trace 1.3
  ↓
trace-requirements.md executes
  ↓
Step 1: Load test design document
  Path: qa.qaLocation/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md
  ↓
Step 2: Map requirements to tests using Given-When-Then
  ↓
Step 3: Cross-reference with actual test code
  ↓
Output: Requirements traceability matrix
```

**Data Exchange**:
- Test-design provides: Test scenarios with requirements mappings
- Trace uses: Test IDs, requirements references, test descriptions
- Trace validates: All tests from design are implemented in code

---

### Integration Point 4: qa-gate.md Task

**Integration**: Gate task uses test_design YAML block for coverage evaluation

**Workflow**:
```
QA Agent: *gate 1.3
  ↓
qa-gate.md executes
  ↓
Step 1: Load previous QA outputs (including test design)
  ↓
Step 2: Evaluate test coverage
  - Check coverage_gaps from test_design block
  - Verify P0 test completeness
  - Assess shift-left ratio
  ↓
Step 3: Make gate decision
  - coverage_gaps → CONCERNS or FAIL
  - No gaps → PASS contribution
  ↓
Output: Quality gate file with test_design block
```

**Data Exchange**:
- Test-design provides: Gate YAML block with coverage summary
- Gate uses: coverage_gaps, p0 test count, shift_left_ratio
- Gate decision influenced by: Presence/absence of coverage gaps

---

### Integration Point 5: Risk Profile Integration

**Integration**: If risk profile exists, test-design links tests to risks

**Workflow**:
```
test-design executes
  ↓
Step 0: Check for risk profile
  Path: qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md
  ↓
If exists:
  Load risk assessment
  ↓
  Step 3: Apply risk-based priority adjustments
  - Critical risk (score 9) → P0 tests
  - High risk (score 6) → P0/P1 tests
  ↓
  Step 4: Link test scenarios to risk IDs
  - Add mitigates_risks array to scenarios
  ↓
  Step 5: Validate risk coverage
  - Ensure all high-priority risks have test coverage
  - Document unmitigated risks as gaps
```

**Data Exchange**:
- Risk profile provides: Risk IDs, scores, descriptions
- Test-design uses: Risk severity for priority adjustments
- Test-design outputs: Risk coverage matrix, unmitigated risk gaps

---

### Integration Point 6: Story File Integration

**Integration**: Test-design reads story file for requirements

**Workflow**:
```
test-design executes
  ↓
Step 1: Load story file
  Path: {devStoryLocation}/{epic}.{story}.*.md
  ↓
Extract:
  - Acceptance Criteria (primary test source)
  - Tasks/Subtasks (additional test sources)
  - NFR requirements (NFR test scenarios)
  - Story title (for output naming)
  ↓
Use extracted data in test scenario design
```

**Story File Expected Structure**:
```markdown
# Story Title

## User Story
{user story description}

## Acceptance Criteria

1. AC1: {testable requirement}
2. AC2: {testable requirement}
3. AC3: {testable requirement}

## Tasks

- [ ] Task 1
  - [ ] Subtask 1.1
  - [ ] Subtask 1.2
- [ ] Task 2

## Non-Functional Requirements

- Performance: {requirement}
- Security: {requirement}
```

**Data Extraction**:
- Parse markdown sections
- Extract numbered/bulleted acceptance criteria
- Extract tasks/subtasks for additional test scenarios
- Extract NFRs for quality attribute testing

---

### Integration Point 7: Configuration Integration

**Integration**: Test-design uses core-config.yaml for path resolution

**Configuration Schema**:
```yaml
# core-config.yaml
devStoryLocation: 'stories'
qa:
  qaLocation: 'qa'
```

**Path Resolution**:
- Input: `story_path` = `{devStoryLocation}/{epic}.{story}.*.md`
- Output: `test_design_path` = `{qa.qaLocation}/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md`

**Configuration Loading**:
```
test-design executes
  ↓
Load core-config.yaml
  ↓
Resolve paths:
  - Story file: devStoryLocation + story ID
  - Output directory: qa.qaLocation + 'assessments/'
  ↓
Use resolved paths for file operations
```

---

### Integration Point 8: Quality Gate File Integration

**Integration**: Gate YAML block is copy-pasted into quality gate file

**Gate File Structure**:
```yaml
# qa/gates/{epic}.{story}-{slug}.yml
schema: 1
story: '{epic}.{story}'
gate: PASS|CONCERNS|FAIL|WAIVED

# Test design block (from test-design output)
test_design:
  scenarios_total: 12
  by_level: { unit: 5, integration: 5, e2e: 2 }
  by_priority: { p0: 8, p1: 3, p2: 1, p3: 0 }
  coverage_gaps: []
  planning_ref: 'qa/assessments/1.3-test-design-20251014.md'

# Other gate sections
risk_summary: {...}
trace: {...}
nfr_validation: {...}
```

**Integration Process**:
1. test-design generates gate YAML block
2. Agent displays block to user or includes in review output
3. qa-gate.md or review-story.md copies block into gate file
4. Gate decision logic uses test_design data

---

## 10. Configuration References

### core-config.yaml Keys Used

**devStoryLocation** (Required):
```yaml
devStoryLocation: 'stories'
```
- **Purpose**: Locates story files for input
- **Usage**: Construct story file path: `{devStoryLocation}/{epic}.{story}.*.md`
- **Example**: `devStoryLocation: 'stories'` → `stories/1.3-password-reset.md`

**qa.qaLocation** (Required):
```yaml
qa:
  qaLocation: 'qa'
```
- **Purpose**: Determines output directory for QA assessments
- **Usage**: Construct output path: `{qa.qaLocation}/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md`
- **Example**: `qa.qaLocation: 'qa'` → `qa/assessments/1.3-test-design-20251014.md`

### Configuration Loading Strategy

**Lazy Loading**:
- Configuration loaded at task execution start
- No pre-loading required
- Cached for duration of task execution

**Error Handling**:
- If `core-config.yaml` not found → HALT with error
- If required keys missing → HALT with error
- If paths invalid → HALT with error

**Path Resolution Priority**:
1. Explicit path provided by user → Use as-is
2. Relative path from config → Resolve relative to project root
3. Absolute path from config → Use as-is

---

## 11. Special Considerations

### Consideration 1: Shift-Left Testing Philosophy

**Principle**: Favor lower-level tests (unit > integration > E2E)

**Implementation**:
- Step 2 applies shift-left during test level selection
- Prefer unit tests when scenario can be isolated
- Only escalate to higher levels when necessary
- Monitor shift-left ratio: Target 40-60% unit tests

**Quality Metric**:
```
shift_left_ratio = unit_tests / total_tests
Target: 0.4-0.6 (40-60% unit tests)
```

**Rationale**:
- Unit tests: Fast feedback, easy debugging, low maintenance
- Integration tests: Moderate speed, component verification
- E2E tests: Slow, brittle, high maintenance

---

### Consideration 2: Risk-Based Testing Priority

**Principle**: Align test priorities with identified risks

**Implementation**:
- If risk profile exists, use risk scores to adjust priorities
- Critical risks (score 9) → P0 tests mandatory
- High risks (score 6) → P0 or P1 tests
- Medium risks (score 4) → P1 or P2 tests
- Low risks (score 1-3) → P2 or P3 tests

**Integration with Risk Profile**:
```
Load risk profile
  ↓
For each test scenario:
  Identify which risks it mitigates
  ↓
  Adjust priority based on highest risk score
  ↓
  Document risk linkage in scenario
```

---

### Consideration 3: Duplicate Coverage Prevention

**Principle**: Test once at the right level, avoid redundant testing

**Implementation**:
- Step 5 validates no duplicate coverage across levels
- Use duplicate coverage guard from test-levels-framework.md
- Only allow duplicates when justified:
  - Testing different aspects (unit: logic, integration: interaction, e2e: UX)
  - Critical paths requiring defense in depth
  - Regression prevention

**Detection**:
```
For each test scenario:
  Check if same functionality tested at different level
  ↓
  If duplicate detected:
    Evaluate justification
    ↓
    If NOT justified:
      Remove higher-level test
      Document rationale
```

---

### Consideration 4: Test Scenario Independence

**Principle**: Each test scenario should be atomic and independent

**Implementation**:
- Design scenarios that can run in any order
- Avoid dependencies between test scenarios
- Each scenario should set up its own preconditions
- Each scenario should clean up after itself

**Validation**:
- Review scenarios for dependencies
- Ensure test descriptions are specific and isolated
- Check that scenarios don't assume prior test execution

---

### Consideration 5: P0 Test Coverage Requirements

**Principle**: All P0 (critical) requirements must have comprehensive test coverage

**Implementation**:
- Step 5 validates P0 requirements have tests at all appropriate levels
- Critical paths (revenue, security, compliance) require:
  - Unit tests for business logic
  - Integration tests for component interaction
  - E2E tests for user journeys
- Any P0 requirement without test coverage → High severity gap

**Quality Gate Impact**:
- Missing P0 test → Gate decision = CONCERNS or FAIL
- Incomplete P0 coverage → Gate decision = CONCERNS

---

### Consideration 6: Test Execution Order Optimization

**Principle**: Fast tests run first (fail fast), critical tests prioritized

**Implementation**:
- Output includes recommended execution order:
  1. P0 unit tests (immediate feedback)
  2. P0 integration tests (component verification)
  3. P0 E2E tests (critical path validation)
  4. P1 tests (in level order)
  5. P2/P3 tests (as time permits)

**Rationale**:
- P0 unit tests catch logic errors immediately
- Early failure saves time (don't run slow tests if fast tests fail)
- Critical paths verified before secondary features

---

### Consideration 7: Test ID Naming Convention Enforcement

**Principle**: Consistent, predictable test IDs for traceability

**Implementation**:
- Strict format: `{EPIC}.{STORY}-{LEVEL}-{SEQ}`
- Level codes: UNIT, INT, E2E (not full words)
- Sequence: Zero-padded 3 digits (001, 002, ...)
- Separate sequences per level

**Examples**:
- ✓ Correct: `1.3-UNIT-001`, `1.3-INT-005`, `1.3-E2E-002`
- ✗ Incorrect: `1.3-unit-1`, `1.3-integration-test-5`, `Story1.3-E2E-2`

**Rationale**:
- Enables automatic test discovery
- Facilitates requirements traceability
- Supports tooling integration

---

### Consideration 8: Coverage Gap Severity Classification

**Principle**: Not all coverage gaps are equal—prioritize by risk and impact

**Implementation**:
- High severity: P0 requirements, security/data loss risks
- Medium severity: P1 requirements, core journeys
- Low severity: P2/P3 requirements, secondary features

**Quality Gate Impact**:
- High severity gaps → Gate = CONCERNS or FAIL
- Medium severity gaps → Gate = CONCERNS
- Low severity gaps → Gate = PASS (documented for future work)

---

### Consideration 9: Test Maintainability Considerations

**Principle**: Design tests for long-term maintainability, not just coverage

**Implementation**:
- Prefer unit tests (more stable) over E2E tests (more brittle)
- Design scenarios that are resilient to UI changes
- Avoid over-specification (test behavior, not implementation)
- Consider test execution time (slow tests are often skipped)

**Evaluation Criteria**:
- Will this test break when implementation changes (but behavior doesn't)?
- Is this test fast enough to run frequently?
- Will this test be easy to debug when it fails?

---

### Consideration 10: Continuous Test Design Evolution

**Principle**: Test design is not one-time—evolve with story changes

**Implementation**:
- Document in output: "Review and update test design if story changes"
- If story significantly changes, re-run test-design task
- Update test design document version (new YYYYMMDD date)
- Maintain history of test design evolution

**Triggers for Re-design**:
- New acceptance criteria added
- Existing ACs significantly changed
- Risk profile updated with new critical risks
- Previous test design had major coverage gaps
- Implementation revealed missing requirements

---

## 12. ADK Translation Recommendations

### Recommendation 1: Reasoning Engine for Multi-Step Workflow (High Priority)

**Current Implementation**:
- Sequential 5-step process with decision points
- State maintained across steps
- Complex branching logic based on test level and priority classification

**ADK Translation**:
Use **Vertex AI Reasoning Engine** to implement the multi-step workflow:

```python
from google.cloud import reasoning_engine

class TestDesignWorkflow:
    """
    Reasoning Engine workflow for test-design task.
    Implements 5-step sequential process with state management.
    """

    def __init__(self, config):
        self.config = config
        self.firestore = firestore.Client()
        self.storage = storage.Client()

        # Load framework data files
        self.test_levels_framework = self.load_framework('test-levels-framework.md')
        self.test_priorities_matrix = self.load_framework('test-priorities-matrix.md')

    def execute(self, story_id: str, story_path: str) -> dict:
        """Main execution flow for test design."""

        # Step 1: Analyze Story Requirements
        testable_scenarios = self.analyze_requirements(story_path)

        # Step 2: Apply Test Level Framework
        classified_scenarios = self.apply_test_levels(testable_scenarios)

        # Step 3: Assign Priorities
        prioritized_scenarios = self.assign_priorities(classified_scenarios)

        # Step 4: Design Test Scenarios
        test_scenarios = self.design_scenarios(prioritized_scenarios)

        # Step 5: Validate Coverage
        validation_results = self.validate_coverage(test_scenarios)

        # Generate outputs
        markdown_doc = self.generate_markdown_report(test_scenarios, validation_results)
        gate_yaml = self.generate_gate_block(test_scenarios, validation_results)
        trace_refs = self.generate_trace_references(test_scenarios)

        return {
            'test_design_doc': markdown_doc,
            'gate_yaml': gate_yaml,
            'trace_refs': trace_refs,
            'status': 'complete'
        }

    def analyze_requirements(self, story_path: str) -> list:
        """Step 1: Extract testable scenarios from story."""
        story_content = self.storage.Client().bucket('bmad-stories').blob(story_path).download_as_text()

        # Parse acceptance criteria
        acs = self.extract_acceptance_criteria(story_content)

        # Break down into testable scenarios
        scenarios = []
        for ac in acs:
            scenarios.extend([
                {'type': 'core', 'ac': ac['id'], 'description': ac['core_functionality']},
                *[{'type': 'variation', 'ac': ac['id'], 'description': v} for v in ac['data_variations']],
                *[{'type': 'error', 'ac': ac['id'], 'description': e} for e in ac['error_conditions']],
                *[{'type': 'edge', 'ac': ac['id'], 'description': e} for e in ac['edge_cases']]
            ])

        return scenarios

    def apply_test_levels(self, scenarios: list) -> list:
        """Step 2: Classify each scenario as unit/integration/e2e."""
        classified = []

        for scenario in scenarios:
            # Apply test level framework criteria
            level = self.classify_test_level(scenario, self.test_levels_framework)
            justification = self.generate_level_justification(scenario, level)

            classified.append({
                **scenario,
                'level': level,
                'justification': justification
            })

        return classified

    def assign_priorities(self, scenarios: list) -> list:
        """Step 3: Assign P0-P3 priorities based on risk and impact."""
        prioritized = []

        # Load risk profile if exists
        risk_profile = self.load_risk_profile_if_exists()

        for scenario in scenarios:
            # Apply priority decision tree
            priority = self.apply_priority_decision_tree(scenario, self.test_priorities_matrix)

            # Risk-based adjustments
            if risk_profile:
                priority = self.adjust_priority_for_risk(scenario, risk_profile, priority)
                mitigates_risks = self.link_to_risks(scenario, risk_profile)
            else:
                mitigates_risks = []

            prioritized.append({
                **scenario,
                'priority': priority,
                'mitigates_risks': mitigates_risks
            })

        return prioritized

    def design_scenarios(self, scenarios: list) -> list:
        """Step 4: Generate complete test scenario specifications."""
        test_scenarios = []
        sequence_counters = {'unit': 0, 'integration': 0, 'e2e': 0}

        # Sort by priority then AC
        sorted_scenarios = sorted(scenarios, key=lambda s: (s['priority'], s['ac']))

        for scenario in sorted_scenarios:
            level_code = {'unit': 'UNIT', 'integration': 'INT', 'e2e': 'E2E'}[scenario['level']]
            sequence_counters[scenario['level']] += 1
            seq = f"{sequence_counters[scenario['level']]:03d}"

            test_id = f"{scenario['story_id']}-{level_code}-{seq}"

            test_scenarios.append({
                'id': test_id,
                'requirement': scenario['ac'],
                'priority': scenario['priority'],
                'level': scenario['level'],
                'description': scenario['description'],
                'justification': scenario['justification'],
                'mitigates_risks': scenario['mitigates_risks']
            })

        return test_scenarios

    def validate_coverage(self, test_scenarios: list) -> dict:
        """Step 5: Validate test coverage completeness."""
        validation = {
            'all_acs_covered': self.check_ac_coverage(test_scenarios),
            'no_duplicate_coverage': self.check_duplicate_coverage(test_scenarios),
            'critical_paths_multilevel': self.check_critical_path_coverage(test_scenarios),
            'risks_mitigated': self.check_risk_coverage(test_scenarios),
            'coverage_gaps': []
        }

        # Identify gaps
        if not validation['all_acs_covered']:
            validation['coverage_gaps'].extend(self.identify_ac_gaps(test_scenarios))

        if not validation['risks_mitigated']:
            validation['coverage_gaps'].extend(self.identify_risk_gaps(test_scenarios))

        # Check duplicate coverage
        duplicates = self.identify_duplicates(test_scenarios)
        if duplicates:
            validation['coverage_gaps'].extend([{
                'type': 'duplicate_coverage',
                'tests': d['test_ids'],
                'severity': 'low',
                'recommendation': d['recommendation']
            } for d in duplicates])

        return validation
```

**Benefits**:
- State management across steps
- Complex decision logic handling
- Error recovery and retry capability
- Integration with Firestore for configuration and Cloud Storage for data files

---

### Recommendation 2: Cloud Function for Framework Application (High Priority)

**Current Implementation**:
- Load test-levels-framework.md and test-priorities-matrix.md
- Apply decision rules to classify tests
- Generate justifications

**ADK Translation**:
Use **Cloud Functions** for framework application logic:

```python
from google.cloud import storage
import yaml

@functions_framework.http
def apply_test_level_framework(request):
    """
    Cloud Function to classify test level using framework criteria.
    """
    request_json = request.get_json()
    scenario = request_json['scenario']

    # Load framework from Cloud Storage
    framework = load_framework('test-levels-framework.md')

    # Apply classification logic
    if matches_unit_criteria(scenario, framework):
        return {
            'level': 'unit',
            'justification': generate_unit_justification(scenario, framework)
        }
    elif matches_integration_criteria(scenario, framework):
        return {
            'level': 'integration',
            'justification': generate_integration_justification(scenario, framework)
        }
    else:
        return {
            'level': 'e2e',
            'justification': generate_e2e_justification(scenario, framework)
        }

def matches_unit_criteria(scenario, framework):
    """Check if scenario matches unit test criteria."""
    unit_keywords = framework['unit']['keywords']

    # Check for pure logic indicators
    if any(kw in scenario['description'].lower() for kw in ['validate', 'calculate', 'transform']):
        if 'no dependencies' in scenario or 'pure function' in scenario:
            return True

    return False

def matches_integration_criteria(scenario, framework):
    """Check if scenario matches integration test criteria."""
    integration_keywords = framework['integration']['keywords']

    # Check for component interaction indicators
    if any(kw in scenario['description'].lower() for kw in ['database', 'api', 'service', 'repository']):
        return True

    return False

@functions_framework.http
def apply_priority_matrix(request):
    """
    Cloud Function to assign test priority using matrix criteria.
    """
    request_json = request.get_json()
    scenario = request_json['scenario']
    risk_profile = request_json.get('risk_profile')

    # Load priority matrix from Cloud Storage
    matrix = load_framework('test-priorities-matrix.md')

    # Apply priority decision tree
    priority = apply_decision_tree(scenario, matrix)

    # Risk-based adjustments
    if risk_profile:
        priority = adjust_for_risk(scenario, risk_profile, priority)

    return {
        'priority': priority,
        'rationale': generate_priority_rationale(scenario, priority)
    }
```

**Benefits**:
- Stateless, scalable classification logic
- Reusable across multiple workflows
- Easy to test and validate
- Can be invoked by Reasoning Engine or standalone

---

### Recommendation 3: Firestore for Test Scenario Storage (High Priority)

**Current Implementation**:
- Generate test scenarios in memory
- Save to markdown file
- Generate YAML gate block

**ADK Translation**:
Use **Firestore** to store test scenarios for querying and traceability:

```javascript
// Firestore schema for test scenarios

/projects/{project_id}/stories/{story_id}/test_design/{design_id}
  - created_at: timestamp
  - created_by: 'qa-agent'
  - story_id: '1.3'
  - story_title: 'Password Reset'
  - scenarios: [
      {
        id: '1.3-UNIT-001',
        requirement: 'AC1',
        priority: 'P0',
        level: 'unit',
        description: 'Validate password strength rejects <8 chars',
        justification: 'Pure validation logic, no dependencies',
        mitigates_risks: ['SEC-001']
      },
      ...
    ]
  - summary: {
      scenarios_total: 12,
      by_level: { unit: 5, integration: 5, e2e: 2 },
      by_priority: { p0: 8, p1: 3, p2: 1, p3: 0 }
    }
  - coverage_gaps: []
  - validation: {
      all_acs_covered: true,
      no_duplicate_coverage: true,
      critical_paths_multilevel: true,
      risks_mitigated: true
    }
```

**Query Examples**:
```python
# Find all P0 tests for a story
firestore.collection('projects/proj-1/stories/1.3/test_design').where('scenarios.priority', '==', 'P0').get()

# Find all tests mitigating a specific risk
firestore.collection('projects/proj-1/stories/1.3/test_design').where('scenarios.mitigates_risks', 'array_contains', 'SEC-001').get()

# Get test design summary for gate decision
firestore.document('projects/proj-1/stories/1.3/test_design/latest').get()
```

**Benefits**:
- Structured data for querying
- Version history (multiple design_id documents)
- Integration with other QA tasks (trace, gate)
- Real-time updates and collaboration

---

### Recommendation 4: Cloud Storage for Framework Data Files (Medium Priority)

**Current Implementation**:
- Load test-levels-framework.md and test-priorities-matrix.md from `.bmad-core/data/`
- Parse markdown files

**ADK Translation**:
Use **Cloud Storage** with caching for framework data:

```python
from google.cloud import storage
from functools import lru_cache
import markdown

@lru_cache(maxsize=10)
def load_framework(filename: str) -> dict:
    """
    Load and cache framework data from Cloud Storage.
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket('bmad-frameworks')
    blob = bucket.blob(f'data/{filename}')

    # Download and parse markdown
    content = blob.download_as_text()
    parsed = parse_framework_markdown(content)

    return parsed

def parse_framework_markdown(content: str) -> dict:
    """
    Parse framework markdown into structured data.
    """
    # Extract sections, criteria, examples
    # Return structured dict for easy application
    return {
        'unit': {
            'criteria': [...],
            'characteristics': [...],
            'examples': [...]
        },
        'integration': {...},
        'e2e': {...}
    }
```

**Benefits**:
- Centralized framework storage
- Versioning support
- Caching for performance
- Easy updates without redeployment

---

### Recommendation 5: Structured Output Generation (Medium Priority)

**Current Implementation**:
- Generate markdown report as formatted string
- Generate YAML gate block as formatted string
- Manual copy-paste for integration

**ADK Translation**:
Use **Jinja2 templates** or structured generation:

```python
from jinja2 import Environment, FileSystemLoader

class TestDesignOutputGenerator:
    """Generate structured outputs from test scenarios."""

    def __init__(self):
        self.env = Environment(loader=FileSystemLoader('templates'))

    def generate_markdown_report(self, test_scenarios: list, validation: dict) -> str:
        """Generate test design markdown document."""
        template = self.env.get_template('test-design-report.md.j2')

        return template.render(
            story_id=test_scenarios[0]['story_id'],
            story_title=test_scenarios[0]['story_title'],
            scenarios=test_scenarios,
            summary=self.calculate_summary(test_scenarios),
            validation=validation,
            date=datetime.now().strftime('%Y-%m-%d')
        )

    def generate_gate_yaml(self, test_scenarios: list, validation: dict) -> dict:
        """Generate gate YAML block as structured data."""
        summary = self.calculate_summary(test_scenarios)

        return {
            'test_design': {
                'scenarios_total': summary['total'],
                'by_level': summary['by_level'],
                'by_priority': summary['by_priority'],
                'coverage_gaps': validation['coverage_gaps'],
                'shift_left_ratio': summary['shift_left_ratio'],
                'planning_ref': f"qa/assessments/{test_scenarios[0]['story_id']}-test-design-{datetime.now().strftime('%Y%m%d')}.md"
            }
        }

    def calculate_summary(self, test_scenarios: list) -> dict:
        """Calculate test scenario summary statistics."""
        total = len(test_scenarios)
        by_level = {
            'unit': len([s for s in test_scenarios if s['level'] == 'unit']),
            'integration': len([s for s in test_scenarios if s['level'] == 'integration']),
            'e2e': len([s for s in test_scenarios if s['level'] == 'e2e'])
        }
        by_priority = {
            'p0': len([s for s in test_scenarios if s['priority'] == 'P0']),
            'p1': len([s for s in test_scenarios if s['priority'] == 'P1']),
            'p2': len([s for s in test_scenarios if s['priority'] == 'P2']),
            'p3': len([s for s in test_scenarios if s['priority'] == 'P3'])
        }

        return {
            'total': total,
            'by_level': by_level,
            'by_priority': by_priority,
            'shift_left_ratio': by_level['unit'] / total if total > 0 else 0
        }
```

**Template Example** (`test-design-report.md.j2`):
```jinja2
# Test Design: Story {{ story_id }}

Date: {{ date }}
Designer: Quinn (Test Architect)
Story: {{ story_title }}

## Test Strategy Overview

- **Total test scenarios**: {{ summary.total }}
- **Unit tests**: {{ summary.by_level.unit }} ({{ (summary.by_level.unit / summary.total * 100)|round(1) }}%)
- **Integration tests**: {{ summary.by_level.integration }} ({{ (summary.by_level.integration / summary.total * 100)|round(1) }}%)
- **E2E tests**: {{ summary.by_level.e2e }} ({{ (summary.by_level.e2e / summary.total * 100)|round(1) }}%)

...

## Test Scenarios by Acceptance Criteria

{% for ac in scenarios|groupby('requirement') %}
### {{ ac.grouper }}: {{ ac.list[0].ac_description }}

#### Test Scenarios

| ID | Level | Priority | Test Description | Justification |
|----|-------|----------|------------------|---------------|
{% for scenario in ac.list %}
| {{ scenario.id }} | {{ scenario.level }} | {{ scenario.priority }} | {{ scenario.description }} | {{ scenario.justification }} |
{% endfor %}

{% endfor %}
```

**Benefits**:
- Consistent output formatting
- Easy template updates
- Structured data (YAML as dict, not string)
- Testable generation logic

---

### Recommendation 6: Integration with QA Workflow Orchestrator (Medium Priority)

**Current Implementation**:
- test-design runs standalone or as part of review-story
- Manual invocation and coordination

**ADK Translation**:
Use **Cloud Workflows** to orchestrate QA task sequence:

```yaml
# qa-workflow.yaml
main:
  params: [story_id]
  steps:
    - risk_profile:
        call: execute_risk_profile
        args:
          story_id: ${story_id}
        result: risk_result

    - test_design:
        call: execute_test_design
        args:
          story_id: ${story_id}
          risk_profile: ${risk_result}
        result: test_design_result

    - trace_requirements:
        call: execute_trace_requirements
        args:
          story_id: ${story_id}
          test_design: ${test_design_result}
        result: trace_result

    - nfr_assessment:
        call: execute_nfr_assessment
        args:
          story_id: ${story_id}
        result: nfr_result

    - qa_gate:
        call: execute_qa_gate
        args:
          story_id: ${story_id}
          risk_profile: ${risk_result}
          test_design: ${test_design_result}
          trace: ${trace_result}
          nfr: ${nfr_result}
        result: gate_result

    - return_result:
        return: ${gate_result}
```

**Benefits**:
- Automated task orchestration
- Parallel execution where possible
- State passing between tasks
- Error handling and retry logic

---

### Recommendation 7: AI-Assisted Test Scenario Generation (Low Priority)

**Current Implementation**:
- Rules-based extraction of testable scenarios from ACs
- Manual breakdown of core/variation/error/edge cases

**ADK Translation**:
Use **Vertex AI Gemini** to assist with scenario generation:

```python
from vertexai.preview.generative_models import GenerativeModel

class AIAssistedScenarioGenerator:
    """Use Gemini to generate comprehensive test scenarios from ACs."""

    def __init__(self):
        self.model = GenerativeModel('gemini-2.0-flash-001')

    def generate_scenarios(self, acceptance_criterion: str) -> list:
        """Generate testable scenarios from an AC using AI."""

        prompt = f"""
        You are a test architect analyzing acceptance criteria.

        Acceptance Criterion: "{acceptance_criterion}"

        Generate a comprehensive list of testable scenarios covering:
        1. Core functionality (primary behavior)
        2. Data variations (different inputs, boundary conditions)
        3. Error conditions (invalid inputs, failures, constraints)
        4. Edge cases (unusual but valid scenarios)

        Format as JSON:
        {{
          "core": "...",
          "data_variations": ["...", "..."],
          "error_conditions": ["...", "..."],
          "edge_cases": ["...", "..."]
        }}
        """

        response = self.model.generate_content(prompt)
        scenarios = json.loads(response.text)

        return scenarios
```

**Benefits**:
- More comprehensive scenario coverage
- Identifies edge cases humans might miss
- Faster scenario generation
- Learns from patterns in historical test designs

---

### Recommendation 8: Coverage Gap Analysis Dashboard (Low Priority)

**Current Implementation**:
- Coverage gaps documented in markdown report
- Manual review required

**ADK Translation**:
Use **Looker** or **Data Studio** to visualize coverage gaps:

```python
# Export to BigQuery for visualization
from google.cloud import bigquery

def export_test_design_to_bigquery(test_design: dict):
    """Export test design data to BigQuery for analytics."""

    bq_client = bigquery.Client()
    table_id = 'bmad-analytics.qa.test_designs'

    rows_to_insert = [{
        'story_id': test_design['story_id'],
        'created_at': test_design['created_at'],
        'scenarios_total': test_design['summary']['scenarios_total'],
        'unit_tests': test_design['summary']['by_level']['unit'],
        'integration_tests': test_design['summary']['by_level']['integration'],
        'e2e_tests': test_design['summary']['by_level']['e2e'],
        'p0_tests': test_design['summary']['by_priority']['p0'],
        'coverage_gaps': len(test_design['coverage_gaps']),
        'high_severity_gaps': len([g for g in test_design['coverage_gaps'] if g['severity'] == 'high'])
    }]

    bq_client.insert_rows_json(table_id, rows_to_insert)
```

**Dashboard Metrics**:
- Average shift-left ratio across stories
- Coverage gap trends over time
- P0 test completeness rate
- Test design cycle time

**Benefits**:
- Proactive identification of quality issues
- Trend analysis for process improvement
- Team performance metrics

---

### Recommendation 9: Test ID Registry Service (Low Priority)

**Current Implementation**:
- Test IDs generated sequentially during test design
- No central registry or collision detection

**ADK Translation**:
Use **Firestore** as test ID registry:

```python
from google.cloud import firestore

class TestIDRegistry:
    """Central registry for test ID generation and collision prevention."""

    def __init__(self):
        self.db = firestore.Client()

    def generate_test_id(self, story_id: str, level: str) -> str:
        """Generate next sequential test ID for story and level."""

        doc_ref = self.db.collection('test_id_sequences').document(f'{story_id}-{level}')

        # Atomic increment using transaction
        @firestore.transactional
        def increment_sequence(transaction):
            snapshot = doc_ref.get(transaction=transaction)
            if snapshot.exists:
                current_seq = snapshot.get('sequence')
            else:
                current_seq = 0

            new_seq = current_seq + 1
            transaction.set(doc_ref, {'sequence': new_seq})
            return new_seq

        transaction = self.db.transaction()
        seq = increment_sequence(transaction)

        level_code = {'unit': 'UNIT', 'integration': 'INT', 'e2e': 'E2E'}[level]
        return f"{story_id}-{level_code}-{seq:03d}"

    def register_test_id(self, test_id: str, test_data: dict):
        """Register test ID with metadata for traceability."""

        self.db.collection('test_ids').document(test_id).set({
            'test_id': test_id,
            'story_id': test_data['story_id'],
            'level': test_data['level'],
            'priority': test_data['priority'],
            'created_at': firestore.SERVER_TIMESTAMP,
            'description': test_data['description']
        })
```

**Benefits**:
- Prevents ID collisions
- Central test ID lookup
- Test metadata storage
- Audit trail for test creation

---

### Recommendation 10: Framework Version Management (Low Priority)

**Current Implementation**:
- test-levels-framework.md and test-priorities-matrix.md are static files
- No versioning or change tracking

**ADK Translation**:
Use **Cloud Storage versioning** + **Firestore for metadata**:

```python
class FrameworkVersionManager:
    """Manage framework versions and track changes."""

    def __init__(self):
        self.storage = storage.Client()
        self.firestore = firestore.Client()

    def get_framework(self, name: str, version: str = 'latest') -> dict:
        """Load specific version of framework."""

        if version == 'latest':
            # Get latest version from metadata
            doc = self.firestore.collection('framework_versions').document(name).get()
            version = doc.get('latest_version')

        # Load from Cloud Storage with version
        bucket = self.storage.bucket('bmad-frameworks')
        blob = bucket.blob(f'{name}/{version}.md')
        content = blob.download_as_text()

        return parse_framework(content)

    def publish_framework_version(self, name: str, content: str, changelog: str):
        """Publish new framework version."""

        # Get next version number
        doc_ref = self.firestore.collection('framework_versions').document(name)
        doc = doc_ref.get()
        if doc.exists:
            current_version = doc.get('latest_version')
            next_version = f"v{int(current_version[1:]) + 1}"
        else:
            next_version = 'v1'

        # Save to Cloud Storage
        bucket = self.storage.bucket('bmad-frameworks')
        blob = bucket.blob(f'{name}/{next_version}.md')
        blob.upload_from_string(content)

        # Update metadata
        doc_ref.set({
            'name': name,
            'latest_version': next_version,
            'updated_at': firestore.SERVER_TIMESTAMP,
            'changelog': changelog
        })
```

**Benefits**:
- Framework evolution tracking
- Reproducible test designs (use specific framework version)
- Change impact analysis
- Rollback capability

---

## 13. Summary

### Task Complexity: High

**Factors Contributing to Complexity**:
1. **Multi-step sequential process** (5 steps with dependencies)
2. **Complex decision logic** (test level classification, priority assignment)
3. **Multiple integration points** (risk profile, story file, configuration, frameworks)
4. **Structured output generation** (markdown report + YAML gate block + trace refs)
5. **Coverage validation** (AC coverage, duplicate detection, risk mitigation)

### Key Characteristics

**Strengths**:
- Systematic, framework-driven approach
- Clear separation of concerns (5 distinct steps)
- Comprehensive validation and quality checks
- Multiple output formats for different consumers
- Risk-based prioritization integration
- Shift-left testing philosophy enforcement

**Challenges**:
- Requires deep understanding of test-levels-framework and test-priorities-matrix
- Complex decision logic for classification and prioritization
- Manual coordination with other QA tasks (though outputs facilitate integration)
- Coverage gap identification requires careful analysis

### Primary Use Cases

1. **Story Test Planning**: Design comprehensive test strategy before implementation
2. **QA Review Preparation**: Generate test expectations for story review
3. **Requirements Traceability**: Provide test scenarios for trace-requirements task
4. **Risk Mitigation Planning**: Link test scenarios to identified risks
5. **Test Execution Planning**: Provide optimized test execution order

### Critical Success Factors

1. **Complete acceptance criteria**: Story must have clear, testable requirements
2. **Framework adherence**: Strict application of test levels and priorities frameworks
3. **Coverage completeness**: All ACs and risks must have test coverage
4. **Duplicate prevention**: No redundant testing across levels (unless justified)
5. **Output quality**: Clear, actionable test scenarios with justifications

### Integration with BMad Ecosystem

**Upstream Dependencies**:
- Story file (acceptance criteria)
- Risk profile (optional but recommended)
- Configuration (core-config.yaml)
- Frameworks (test-levels-framework.md, test-priorities-matrix.md)

**Downstream Consumers**:
- trace-requirements.md (maps tests to requirements)
- qa-gate.md (uses test_design block for gate decisions)
- review-story.md (orchestrates test design as part of review)
- Development team (implements tests based on design)

**Position in Workflow**:
```
Story Implementation (Dev)
  ↓
Risk Profiling (QA) ← Optional but recommended
  ↓
TEST DESIGN (QA) ← This task
  ↓
Trace Requirements (QA)
  ↓
NFR Assessment (QA)
  ↓
QA Gate Decision (QA)
```

### ADK Translation Priority

**High Priority**:
1. Reasoning Engine for multi-step workflow
2. Cloud Function for framework application
3. Firestore for test scenario storage

**Medium Priority**:
4. Cloud Storage for framework data files
5. Structured output generation
6. QA workflow orchestrator integration

**Low Priority**:
7. AI-assisted scenario generation
8. Coverage gap analysis dashboard
9. Test ID registry service
10. Framework version management

---

**End of Analysis**
