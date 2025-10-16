# Development Templates Analysis - Section 3: Test Scenario Format Analysis

**Analysis Date**: 2025-10-14
**Analyzer**: Claude Code (AI Agent)
**Phase**: Phase 4, Task 4.3
**Document Version**: 1.0

---

## Table of Contents

- [Section 1: Introduction & Overview](development-templates-section1.md)
- [Section 2: QA Gate Template Analysis](development-templates-section2.md)
- [Section 3: Test Scenario Format Analysis](#section-3-test-scenario-format-analysis) (This document)
- [Section 4: Summary & ADK Translation](development-templates-section4.md)

---

## Section 3: Test Scenario Format Analysis

### Format Identity

**Format Name**: Test Scenario Structure
**Definition Location**: `.bmad-core/tasks/test-design.md` (lines 65-74)
**Format Type**: Embedded YAML structure (not a standalone template file)
**Owner Agent**: QA Agent (Quinn - Test Architect)
**Primary Task**: test-design.md
**Output Context**: Used within test design documents

### Why Embedded Instead of Standalone Template?

Unlike qa-gate-tmpl.yaml, the test scenario format is **embedded in the task definition** rather than being a separate template file. This design choice reflects:

#### Rationale 1: **Tight Coupling to Task Logic**
The test scenario format is intimately tied to the test-design task's decision-making process:
- Test level selection requires applying test-levels-framework.md
- Priority assignment requires applying test-priorities-matrix.md
- Scenario generation requires parsing acceptance criteria
- Coverage validation requires gap analysis

Embedding the format keeps the **task logic and data structure together**.

#### Rationale 2: **Single Source of Truth**
By defining the format in the task that generates it, there's **no possibility of drift** between:
- Task expectations (what format does task generate?)
- Template definition (what format should output follow?)

#### Rationale 3: **Format Simplicity**
Test scenarios are **simple structured objects**, not complex multi-section documents like PRDs or architecture docs. The format is:
- Only 7 fields
- No nested sections
- No conditional logic
- No interactive elicitation

This simplicity doesn't warrant a separate template file.

#### Rationale 4: **Usage Pattern**
Test scenarios are **never created standalone**. They are always:
- Generated as part of test-design.md task execution
- Embedded within test design documents (markdown tables)
- Referenced by trace-requirements task
- Linked in quality gate files

There's no use case for "create a test scenario from template in isolation."

### Format Structure

#### Complete Format Definition

From `.bmad-core/tasks/test-design.md` lines 65-74:

```yaml
test_scenario:
  id: '{epic}.{story}-{LEVEL}-{SEQ}'
  requirement: 'AC reference'
  priority: P0|P1|P2|P3
  level: unit|integration|e2e
  description: 'What is being tested'
  justification: 'Why this level was chosen'
  mitigates_risks: ['RISK-001'] # If risk profile exists
```

This is a **prescriptive format** - all test scenarios must follow this structure.

### Field-by-Field Analysis

#### Field 1: `id`

```yaml
id: '{epic}.{story}-{LEVEL}-{SEQ}'
```

**Purpose**: Unique identifier for the test scenario
**Type**: String
**Format**: `{epic}.{story}-{LEVEL}-{SEQ}`
**Required**: Yes

**Component Breakdown**:

**{epic}**: Epic number (e.g., "1")
- Source: Story identifier first component
- Format: Integer as string

**{story}**: Story number within epic (e.g., "3")
- Source: Story identifier second component
- Format: Integer as string

**{LEVEL}**: Test level abbreviation
- Values: `UNIT` | `INT` | `E2E`
- Case: UPPERCASE
- Abbreviations:
  - `UNIT` = Unit test
  - `INT` = Integration test
  - `E2E` = End-to-end test

**{SEQ}**: Sequence number within level
- Format: 3-digit zero-padded (e.g., "001", "023", "142")
- Scope: Unique within story + level combination
- Ordering: Sequential allocation as scenarios created

**Example IDs**:
```
1.3-UNIT-001    # First unit test for story 1.3
1.3-UNIT-002    # Second unit test for story 1.3
1.3-INT-001     # First integration test for story 1.3
1.3-E2E-001     # First E2E test for story 1.3
2.5-UNIT-023    # 23rd unit test for story 2.5
```

**Design Rationale**:

**Story Prefix**: Links test to story for traceability
```bash
# Find all tests for story 1.3
grep "1.3-" test-design-{date}.md
```

**Level Infix**: Groups tests by level for execution planning
```bash
# Find all unit tests for story 1.3
grep "1.3-UNIT-" test-design-{date}.md
```

**Sequential Suffix**: Provides unique identity
```bash
# Reference specific test
grep "1.3-UNIT-001" test-design-{date}.md
```

**Uppercase Level**: Visual distinction from story ID
```
1.3-UNIT-001  # Clear: story ID is numeric, level is alpha
```

**Zero-Padding**: Consistent sorting and alignment
```
1.3-UNIT-001
1.3-UNIT-002
1.3-UNIT-010
1.3-UNIT-100
# Sorts correctly alphabetically and numerically
```

**Collision Prevention**: Story + Level + Seq guarantees uniqueness
```
Different stories: 1.3-UNIT-001 vs 1.4-UNIT-001
Different levels: 1.3-UNIT-001 vs 1.3-INT-001
Different sequence: 1.3-UNIT-001 vs 1.3-UNIT-002
```

**Usage Patterns**:

```python
# Parse test ID
def parse_test_id(test_id: str) -> dict:
    """Parse test ID into components."""
    match = re.match(r'(\d+)\.(\d+)-(UNIT|INT|E2E)-(\d+)', test_id)
    return {
        'epic': int(match.group(1)),
        'story': int(match.group(2)),
        'level': match.group(3),
        'sequence': int(match.group(4)),
    }

# Generate test ID
def generate_test_id(epic: int, story: int, level: str, seq: int) -> str:
    """Generate test ID from components."""
    return f"{epic}.{story}-{level.upper()}-{seq:03d}"
```

**Integration with Test Implementation**:

Test IDs can map directly to test file organization:

```
tests/
  story-1.3/
    unit/
      001-validate-input-format.test.ts
      002-calculate-discount.test.ts
    integration/
      001-create-user-with-role.test.ts
    e2e/
      001-complete-checkout.test.ts
```

Or to test names/descriptions:

```typescript
// tests/story-1.3/unit/validation.test.ts
describe('Story 1.3: User Authentication', () => {
  it('[1.3-UNIT-001] validates email format', () => {
    // Test ID in test name for traceability
  });

  it('[1.3-UNIT-002] validates password strength', () => {
    // ...
  });
});
```

#### Field 2: `requirement`

```yaml
requirement: 'AC reference'
```

**Purpose**: Link test scenario to acceptance criteria
**Type**: String
**Format**: Free-form reference to AC
**Required**: Yes

**Common Formats**:

**AC Number Reference**:
```yaml
requirement: 'AC1'  # First acceptance criterion
requirement: 'AC3'  # Third acceptance criterion
```

**AC Description Excerpt**:
```yaml
requirement: 'AC1: User can login with email and password'
```

**AC Full Text**:
```yaml
requirement: 'As a user, I can login with email and password so that I can access my account'
```

**Multiple ACs** (if test covers multiple):
```yaml
requirement: 'AC1, AC2'
requirement: 'AC1 (login) + AC3 (session)'
```

**Task Reference** (if not AC-based):
```yaml
requirement: 'Task 2: Implement OAuth2 integration'
```

**Design Rationale**:

**Traceability**: Every test links back to a requirement
```
AC1 → Tests: 1.3-UNIT-001, 1.3-INT-003, 1.3-E2E-001
```

**Coverage Analysis**: Identify untested requirements
```python
# Find ACs without tests
all_acs = ['AC1', 'AC2', 'AC3', 'AC4']
tested_acs = set([scenario['requirement'] for scenario in scenarios])
gaps = [ac for ac in all_acs if ac not in tested_acs]
# gaps = ['AC4']  # AC4 has no test coverage
```

**Impact Analysis**: If AC changes, find affected tests
```bash
# AC2 changed - find all tests for AC2
grep "requirement: 'AC2" test-design-{date}.md
```

**Compliance**: Demonstrate test coverage for requirements
```
Audit: "Show me all tests for AC1"
Response: "AC1 has 3 tests: 1.3-UNIT-001, 1.3-INT-003, 1.3-E2E-001"
```

**Example Mapping**:

```yaml
# Story 1.3 Acceptance Criteria:
# AC1: User can login with email and password
# AC2: Invalid credentials show error message
# AC3: Successful login redirects to dashboard
# AC4: Login session persists for 24 hours

# Test Scenarios:
- id: '1.3-UNIT-001'
  requirement: 'AC1'
  description: 'Validate email format'

- id: '1.3-UNIT-002'
  requirement: 'AC1'
  description: 'Validate password meets requirements'

- id: '1.3-INT-001'
  requirement: 'AC1, AC2'
  description: 'Verify authentication service validates credentials'

- id: '1.3-E2E-001'
  requirement: 'AC1, AC3'
  description: 'User completes login flow and reaches dashboard'

- id: '1.3-INT-002'
  requirement: 'AC4'
  description: 'Session token has 24-hour expiry'
```

#### Field 3: `priority`

```yaml
priority: P0|P1|P2|P3
```

**Purpose**: Test execution priority for effort allocation
**Type**: String (enumerated)
**Values**: `P0` | `P1` | `P2` | `P3`
**Required**: Yes

**Priority Definitions** (from test-priorities-matrix.md):

**P0 - Critical (Must Test)**:
- **Criteria**: Revenue-impacting, security-critical, data integrity, regulatory compliance, regression prevention
- **Examples**: Payment processing, authentication, user data operations, financial calculations, GDPR compliance
- **Testing Requirements**: Comprehensive coverage at all levels, happy and unhappy paths, edge cases, performance under load
- **Execution**: Run first, failures block all progress

**P1 - High (Should Test)**:
- **Criteria**: Core user journeys, frequently used features, complex logic, system integration points, UX-critical features
- **Examples**: User registration, search, data import/export, notifications, dashboard displays
- **Testing Requirements**: Primary happy paths, key error scenarios, critical edge cases, basic performance validation
- **Execution**: Run after P0, failures block sprint completion

**P2 - Medium (Nice to Test)**:
- **Criteria**: Secondary features, admin functionality, reporting, configuration options, UI polish
- **Examples**: Admin settings, report generation, theme customization, help docs, analytics tracking
- **Testing Requirements**: Happy path coverage, basic error handling, edge cases can be deferred
- **Execution**: Run after P1, failures can be triaged for next sprint

**P3 - Low (Test if Time Permits)**:
- **Criteria**: Rarely used features, nice-to-have functionality, cosmetic issues, non-critical optimizations
- **Examples**: Advanced preferences, legacy feature support, experimental features, debug utilities
- **Testing Requirements**: Smoke testing only, extensive testing optional
- **Execution**: Run last if time permits, failures can be deferred indefinitely

**Priority Assignment Logic**:

```python
def assign_test_priority(scenario: dict, story: dict) -> str:
    """Assign test priority based on multiple factors."""

    # Factor 1: Requirement criticality
    ac = scenario['requirement']
    if ac in story['critical_acs']:
        base_priority = 'P0'
    elif ac in story['core_acs']:
        base_priority = 'P1'
    else:
        base_priority = 'P2'

    # Factor 2: Test level (E2E is expensive, prefer P0/P1)
    if scenario['level'] == 'e2e' and base_priority == 'P2':
        # Avoid low-priority E2E tests
        return 'P3'

    # Factor 3: Risk mitigation
    if scenario.get('mitigates_risks'):
        risks = load_risks(story['id'])
        max_risk_severity = max([risk['severity'] for risk in risks
                                  if risk['id'] in scenario['mitigates_risks']])
        if max_risk_severity in ['critical', 'high']:
            base_priority = 'P0'

    # Factor 4: Regression history
    if scenario['requirement'] in story['previously_broken']:
        # Prioritize regression prevention
        if base_priority == 'P2':
            base_priority = 'P1'

    return base_priority
```

**Priority Distribution Patterns**:

**Typical healthy distribution**:
```
P0: 20-30%  # Critical tests, run always
P1: 40-50%  # Core tests, run frequently
P2: 20-30%  # Secondary tests, run nightly
P3: 0-10%   # Optional tests, run weekly
```

**Red flags**:
```
P0: 60%+    # Over-prioritizing, treat everything as critical
P0: 5%      # Under-prioritizing, missing critical coverage
P3: 30%+    # Too many low-value tests, wasting effort
```

**Example Scenarios with Priorities**:

```yaml
# P0 Examples (Critical)
- id: '1.3-INT-001'
  requirement: 'AC1'
  priority: P0  # Authentication is security-critical
  description: 'Verify password hashing uses bcrypt'

- id: '1.5-UNIT-003'
  requirement: 'AC2'
  priority: P0  # Payment calculation is revenue-critical
  description: 'Calculate tax correctly for all jurisdictions'

# P1 Examples (High)
- id: '1.3-E2E-001'
  requirement: 'AC1'
  priority: P1  # Core user journey
  description: 'User completes login flow'

- id: '2.1-INT-002'
  requirement: 'AC3'
  priority: P1  # Frequently used feature
  description: 'Search returns relevant results'

# P2 Examples (Medium)
- id: '3.2-UNIT-005'
  requirement: 'AC4'
  priority: P2  # Admin feature
  description: 'Validate CSV export format'

- id: '4.1-INT-003'
  requirement: 'AC2'
  priority: P2  # Reporting feature
  description: 'Report generation completes in <5s'

# P3 Examples (Low)
- id: '5.1-UNIT-008'
  requirement: 'AC5'
  priority: P3  # Cosmetic feature
  description: 'Theme customization saves correctly'

- id: '6.2-E2E-002'
  requirement: 'AC3'
  priority: P3  # Experimental feature
  description: 'Beta AI assistant responds to query'
```

**CI/CD Integration**:

```yaml
# .github/workflows/test.yml
jobs:
  test-p0:
    name: 'P0 Critical Tests'
    runs-on: ubuntu-latest
    steps:
      - run: npm test -- --testNamePattern='\[.*-P0-.*\]'
      - if: failure()
        run: exit 1  # Block all progress

  test-p1:
    name: 'P1 High Priority Tests'
    needs: test-p0
    runs-on: ubuntu-latest
    steps:
      - run: npm test -- --testNamePattern='\[.*-P1-.*\]'
      - if: failure()
        run: exit 1  # Block sprint completion

  test-p2:
    name: 'P2 Medium Priority Tests'
    needs: test-p1
    runs-on: ubuntu-latest
    steps:
      - run: npm test -- --testNamePattern='\[.*-P2-.*\]'
      - if: failure()
        run: echo "P2 failures - triage for next sprint"

  test-p3:
    name: 'P3 Low Priority Tests'
    needs: test-p2
    runs-on: ubuntu-latest
    steps:
      - run: npm test -- --testNamePattern='\[.*-P3-.*\]' || true
      - if: failure()
        run: echo "P3 failures - can defer indefinitely"
```

#### Field 4: `level`

```yaml
level: unit|integration|e2e
```

**Purpose**: Test level classification for appropriate test type selection
**Type**: String (enumerated)
**Values**: `unit` | `integration` | `e2e`
**Required**: Yes

**Level Definitions** (from test-levels-framework.md):

**unit** (Unit Tests):
- **When to use**: Pure functions, business logic, algorithms, calculations, input validation, data transformation, error handling in isolated components, complex state machines
- **Characteristics**: Fast execution (immediate feedback), no external dependencies (DB/API/file system), highly maintainable and stable, easy to debug failures
- **Mock requirements**: None for pure functions, mock external dependencies if needed
- **Example**: "Test password validation rejects weak passwords"

**integration** (Integration Tests):
- **When to use**: Component interaction, database operations and transactions, API endpoint contracts, service-to-service communication, middleware and interceptor behavior
- **Characteristics**: Moderate execution time, tests component boundaries, may use test databases or containers, validates system integration points
- **Mock requirements**: May use in-memory database, mock external services
- **Example**: "Test user registration saves to database with hashed password"

**e2e** (End-to-End Tests):
- **When to use**: Critical user journeys, cross-system workflows, visual regression testing, compliance and regulatory requirements, final validation before release
- **Characteristics**: Slower execution, tests complete workflows, requires full environment setup, most realistic but most brittle
- **Mock requirements**: Minimal mocking, use real services where possible, mock only external 3rd party services
- **Example**: "Test user completes checkout from cart to confirmation"

**Test Level Selection Rules** (from framework):

**Favor Unit Tests When**:
- Logic can be isolated
- No side effects involved
- Fast feedback needed
- High cyclomatic complexity (many code paths to test)

**Favor Integration Tests When**:
- Multiple components interact
- Database transactions required
- API contracts need validation
- Service boundaries must be tested

**Favor E2E Tests When**:
- User journey crosses multiple systems
- Visual validation required
- Compliance mandates end-to-end testing
- No other level can adequately test the scenario

**Anti-Patterns to Avoid**:

```yaml
# ANTI-PATTERN: E2E test for pure logic
- id: '1.3-E2E-005'
  level: e2e  # ❌ Wrong level
  description: 'Test discount calculation logic'
  # Should be: level: unit

# ANTI-PATTERN: Unit test for database interaction
- id: '1.3-UNIT-007'
  level: unit  # ❌ Wrong level
  description: 'Test user saved to database'
  # Should be: level: integration

# ANTI-PATTERN: Integration test for complete user journey
- id: '1.3-INT-012'
  level: integration  # ❌ Wrong level
  description: 'Test user signs up, verifies email, and logs in'
  # Should be: level: e2e
```

**Test Pyramid Principle**:

```
       /\      E2E (few, slow, brittle)
      /  \
     /────\    Integration (some, moderate speed)
    /      \
   /────────\  Unit (many, fast, stable)
  /          \
```

**Ideal Distribution**:
```
Unit:        70%
Integration: 20%
E2E:         10%
```

**Example Test Level Decisions**:

```yaml
# Scenario 1: Input Validation
- id: '1.3-UNIT-001'
  level: unit
  description: 'Validate email format'
  justification: 'Pure validation logic with no dependencies'

# Scenario 2: Database Operation
- id: '1.3-INT-001'
  level: integration
  description: 'Create user with role assignment'
  justification: 'Tests UserService + AuthRepository + database transaction'

# Scenario 3: Complete User Journey
- id: '1.3-E2E-001'
  level: e2e
  description: 'User registers, verifies email, and logs in'
  justification: 'Critical onboarding journey crosses multiple systems (email service, auth, DB)'

# Scenario 4: Multi-Level Coverage (same AC)
requirement: 'AC1: User can login with email and password'

- id: '1.3-UNIT-001'
  level: unit
  justification: 'Test password validation logic in isolation'

- id: '1.3-INT-001'
  level: integration
  justification: 'Test authentication service calls database correctly'

- id: '1.3-E2E-001'
  level: e2e
  justification: 'Test complete login UX from form to dashboard'
```

**Duplicate Coverage Prevention**:

The framework explicitly warns against testing the same thing at multiple levels:

```yaml
# ❌ DUPLICATE COVERAGE - Testing same logic at all levels
- id: '1.3-UNIT-001'
  level: unit
  description: 'Test discount calculation: 10% off $100 = $90'

- id: '1.3-INT-001'
  level: integration
  description: 'Test discount calculation works in checkout service'
  # ❌ Just testing same calculation at different level

- id: '1.3-E2E-001'
  level: e2e
  description: 'Test discount shows correctly in UI'
  # ❌ Still just testing same calculation

# ✅ CORRECT - Each level tests different aspect
- id: '1.3-UNIT-001'
  level: unit
  description: 'Test discount calculation algorithm (various inputs)'
  justification: 'Pure logic testing with edge cases'

- id: '1.3-INT-001'
  level: integration
  description: 'Test discount persists correctly in database'
  justification: 'Tests data integrity, not calculation'

- id: '1.3-E2E-001'
  level: e2e
  description: 'Test complete checkout with discount applied'
  justification: 'Tests end-to-end flow, not calculation'
```

#### Field 5: `description`

```yaml
description: 'What is being tested'
```

**Purpose**: Clear statement of test intent
**Type**: String (free-form text)
**Required**: Yes

**Writing Guidelines**:

**Be Specific**:
```yaml
# ❌ Vague
description: 'Test login'

# ✅ Specific
description: 'Verify authentication service validates email/password credentials against database'
```

**State Expected Behavior**:
```yaml
# ❌ Unclear outcome
description: 'Check discount'

# ✅ Clear expectation
description: 'Verify 10% discount applies to orders over $100'
```

**Use Action Verbs**:
```yaml
# Good verbs: Verify, Validate, Ensure, Confirm, Test that, Check that
description: 'Verify password hashing uses bcrypt'
description: 'Validate email format matches RFC 5322'
description: 'Ensure session expires after 24 hours'
```

**Include Test Data Context** (when relevant):
```yaml
description: 'Verify tax calculation for California (9.5% rate)'
description: 'Validate pagination with 1000+ records'
description: 'Test concurrent user creation (100 simultaneous requests)'
```

**Cover Error Scenarios**:
```yaml
# Happy path
description: 'Verify successful login redirects to dashboard'

# Error scenarios
description: 'Verify invalid password shows error message'
description: 'Verify locked account prevents login'
description: 'Verify expired token returns 401 Unauthorized'
```

**Example Descriptions by Level**:

```yaml
# Unit Test Descriptions (isolated logic)
description: 'Validate email format rejects addresses without @ symbol'
description: 'Calculate shipping cost correctly for international orders'
description: 'Format currency displays two decimal places'
description: 'Parse ISO 8601 timestamps correctly'

# Integration Test Descriptions (component interaction)
description: 'Verify user creation triggers welcome email via EmailService'
description: 'Ensure order processing updates inventory in database'
description: 'Confirm API endpoint returns 404 for non-existent resource'
description: 'Validate transaction rollback on payment failure'

# E2E Test Descriptions (user journeys)
description: 'User completes checkout from cart to order confirmation'
description: 'Admin creates new user, assigns role, and verifies permissions'
description: 'User resets password via email link and logs in with new password'
description: 'Customer searches products, filters results, and adds item to cart'
```

**Description Length**:
- **Minimum**: One clear sentence
- **Maximum**: 2-3 sentences if complexity warrants
- **Average**: 10-20 words

**Description as Test Name**:

Test descriptions often map directly to test names in code:

```typescript
// Description: 'Verify email format rejects addresses without @ symbol'
it('should reject email addresses without @ symbol', () => {
  expect(validateEmail('userexample.com')).toBe(false);
});

// Description: 'User completes checkout from cart to order confirmation'
it('should allow user to complete checkout from cart to confirmation', async () => {
  await page.goto('/cart');
  await page.click('[data-testid="checkout-button"]');
  // ... rest of E2E test
});
```

#### Field 6: `justification`

```yaml
justification: 'Why this level was chosen'
```

**Purpose**: Document rationale for test level selection
**Type**: String (free-form text)
**Required**: Yes

**This is a BMad Innovation**: Requiring justification for test level choice forces deliberate test design and prevents common anti-patterns.

**Justification Guidelines**:

**Reference Test Levels Framework**:
```yaml
level: unit
justification: 'Pure calculation logic with no external dependencies'
# References framework: "Favor unit tests when logic can be isolated"

level: integration
justification: 'Tests interaction between UserService and AuthRepository with database transaction'
# References framework: "Favor integration when multiple components interact"

level: e2e
justification: 'Critical revenue-generating user journey requiring full-stack validation'
# References framework: "Favor E2E for critical user journeys"
```

**Explain Why Not Lower Level**:
```yaml
level: integration
justification: 'Cannot unit test - requires real database to validate foreign key constraints'

level: e2e
justification: 'Cannot integration test - requires browser to validate responsive layout'
```

**State What Makes This Level Appropriate**:
```yaml
level: unit
justification: 'High cyclomatic complexity (15 branches) requires exhaustive unit testing'

level: integration
justification: 'Multi-component data flow from API through service to database must be validated end-to-end'

level: e2e
justification: 'Compliance requirement mandates testing complete audit trail workflow'
```

**Example Justifications by Level**:

**Unit Test Justifications**:
```yaml
# Pure logic
justification: 'Pure function with no side effects, ideal for unit testing'

# Algorithm complexity
justification: 'Complex algorithm with 20+ edge cases requires fast unit test feedback'

# Calculation correctness
justification: 'Financial calculation must be verified in isolation before integration'

# Validation rules
justification: 'Input validation logic is self-contained with no dependencies'
```

**Integration Test Justifications**:
```yaml
# Component interaction
justification: 'Tests critical handoff between authentication service and user repository'

# Database operations
justification: 'Requires real database to validate transaction isolation and rollback'

# API contracts
justification: 'Validates API endpoint contract including status codes and error handling'

# Service boundaries
justification: 'Tests integration point between payment service and order service'

# Middleware behavior
justification: 'Authentication middleware must be tested with real JWT tokens and database'
```

**E2E Test Justifications**:
```yaml
# User journeys
justification: 'Critical onboarding journey must be validated across UI, API, email service, and database'

# Cross-system workflows
justification: 'Payment processing involves UI, API, payment gateway, and notification service'

# Visual validation
justification: 'Responsive layout must be tested in real browser at various viewport sizes'

# Compliance requirements
justification: 'GDPR compliance requires demonstrating complete data deletion workflow'

# Final validation
justification: 'Release-blocking test for most critical revenue-generating user path'
```

**Anti-Pattern Justifications** (what not to write):

```yaml
# ❌ No justification
justification: 'This is an E2E test'  # Circular reasoning

# ❌ No reasoning
justification: 'Because we need to test it'  # Not helpful

# ❌ Wrong reasoning
level: e2e
justification: 'Unit tests are too much work'  # Laziness, not architecture

# ❌ Insufficient detail
justification: 'Integration needed'  # Why? What integration?
```

**Justification Review**:

During test design review (PO or QA), justifications are evaluated:

```yaml
# Reviewer checks:
# 1. Does justification align with test-levels-framework?
# 2. Is this the right level, or could it shift left?
# 3. Are we over-testing or under-testing?

# Example review findings:
- id: '1.3-E2E-007'
  level: e2e
  description: 'Test discount calculation'
  justification: 'Need to test calculation'
  # ❌ REVIEW: This should be unit test - pure calculation logic

- id: '1.3-UNIT-023'
  level: unit
  description: 'Test email sent after registration'
  justification: 'Lightweight test for email sending'
  # ❌ REVIEW: This should be integration test - tests service interaction
```

#### Field 7: `mitigates_risks`

```yaml
mitigates_risks: ['RISK-001'] # If risk profile exists
```

**Purpose**: Link test scenarios to identified risks from risk-profile task
**Type**: Array of strings (risk IDs)
**Required**: No (only if risk profile exists)
**Default**: Empty array or omitted

**Risk ID Format**: Matches risk IDs from risk-profile task output

**Common Risk ID Patterns**:
```yaml
'RISK-SEC-001'   # Security risk #1
'RISK-PERF-002'  # Performance risk #2
'RISK-DATA-003'  # Data integrity risk #3
'RISK-UX-004'    # User experience risk #4
'RISK-SCALE-005' # Scalability risk #5
```

**Purpose of Risk Linkage**:

**1. Risk Coverage Validation**: Ensure all identified risks have test mitigation
```python
# From risk profile
risks = ['RISK-SEC-001', 'RISK-SEC-002', 'RISK-DATA-003']

# From test scenarios
tested_risks = set([risk_id for scenario in scenarios
                    for risk_id in scenario.get('mitigates_risks', [])])

# Gap analysis
untested_risks = set(risks) - tested_risks
# untested_risks = {'RISK-SEC-002'}  # Missing test coverage
```

**2. Risk-Based Test Prioritization**: High-risk areas get comprehensive testing
```yaml
# High probability × high impact risk
risk:
  id: 'RISK-SEC-001'
  category: 'Security'
  probability: 3
  impact: 3
  score: 9  # Critical
  finding: 'No rate limiting on auth endpoint'

# Multiple tests at different levels to mitigate
- id: '1.3-UNIT-001'
  mitigates_risks: ['RISK-SEC-001']
  priority: P0
  level: unit
  description: 'Verify rate limiter correctly tracks request counts'

- id: '1.3-INT-001'
  mitigates_risks: ['RISK-SEC-001']
  priority: P0
  level: integration
  description: 'Verify rate limiter blocks >5 requests per minute'

- id: '1.3-E2E-001'
  mitigates_risks: ['RISK-SEC-001']
  priority: P0
  level: e2e
  description: 'Verify brute force attack is blocked after 5 failed attempts'
```

**3. Test-to-Risk Traceability**: Demonstrate comprehensive risk mitigation
```
Risk Profile → Test Design → Test Implementation → Gate Decision

RISK-SEC-001 identified
    ↓
3 test scenarios created to mitigate (unit + integration + E2E)
    ↓
All 3 tests implemented and passing
    ↓
Gate decision: PASS (risk mitigated)
```

**4. Impact Analysis**: If test fails, understand risk exposure
```yaml
# Test failure notification
Test Failed: 1.3-INT-001
  Description: Verify rate limiter blocks >5 requests per minute
  Mitigates Risks: RISK-SEC-001 (Critical Security Risk - Brute Force Attack)
  Impact: System vulnerable to brute force attacks
  Action: IMMEDIATE FIX REQUIRED - Critical security risk exposed
```

**Example Risk Mitigation Mapping**:

```yaml
# From risk-profile task
risks:
  - id: 'RISK-SEC-001'
    finding: 'No rate limiting on authentication endpoint'
    probability: 3  # High
    impact: 3       # High
    score: 9        # Critical

  - id: 'RISK-DATA-002'
    finding: 'Concurrent user creation may cause duplicate emails'
    probability: 2  # Medium
    impact: 3       # High
    score: 6        # High

  - id: 'RISK-PERF-003'
    finding: 'Dashboard query not optimized for >1000 users'
    probability: 2  # Medium
    impact: 2       # Medium
    score: 4        # Medium

# From test-design task
test_scenarios:
  # Mitigate RISK-SEC-001
  - id: '1.3-UNIT-001'
    requirement: 'AC1'
    priority: P0
    level: unit
    description: 'Verify RateLimiter.check() returns false after limit exceeded'
    justification: 'Pure logic test for rate limiting algorithm'
    mitigates_risks: ['RISK-SEC-001']

  - id: '1.3-INT-001'
    requirement: 'AC1'
    priority: P0
    level: integration
    description: 'Verify auth endpoint returns 429 after 5 failed attempts'
    justification: 'Integration test for rate limiter middleware + auth service'
    mitigates_risks: ['RISK-SEC-001']

  # Mitigate RISK-DATA-002
  - id: '1.3-INT-002'
    requirement: 'AC2'
    priority: P0
    level: integration
    description: 'Verify unique constraint prevents duplicate email registration'
    justification: 'Requires real database to test constraint enforcement'
    mitigates_risks: ['RISK-DATA-002']

  - id: '1.3-INT-003'
    requirement: 'AC2'
    priority: P1
    level: integration
    description: 'Verify concurrent user creation with same email fails gracefully'
    justification: 'Requires transaction testing for race condition'
    mitigates_risks: ['RISK-DATA-002']

  # Mitigate RISK-PERF-003
  - id: '1.3-INT-004'
    requirement: 'AC3'
    priority: P1
    level: integration
    description: 'Verify dashboard query completes in <500ms with 2000 users'
    justification: 'Performance test requires realistic data volume'
    mitigates_risks: ['RISK-PERF-003']
```

**Risk Coverage Report** (generated by trace-requirements task):

```markdown
## Risk Coverage Analysis

### RISK-SEC-001: No rate limiting (Critical - Score 9)
**Status**: ✅ Mitigated
**Tests**: 2 scenarios (all P0)
- 1.3-UNIT-001 (PASS)
- 1.3-INT-001 (PASS)

### RISK-DATA-002: Duplicate user emails (High - Score 6)
**Status**: ✅ Mitigated
**Tests**: 2 scenarios (1 P0, 1 P1)
- 1.3-INT-002 (PASS)
- 1.3-INT-003 (PASS)

### RISK-PERF-003: Dashboard performance (Medium - Score 4)
**Status**: ⚠️ Partially Mitigated
**Tests**: 1 scenario (P1)
- 1.3-INT-004 (PENDING - not yet implemented)
**Action**: Complete test implementation before release
```

**Omitting Risk Linkage**:

If no risk-profile task was run, or if test doesn't specifically mitigate a risk, this field is omitted:

```yaml
# No risk profile exists for this story
- id: '1.3-UNIT-001'
  requirement: 'AC1'
  priority: P1
  level: unit
  description: 'Validate email format'
  justification: 'Pure validation logic'
  # mitigates_risks omitted - no risk profile
```

### Format Usage in Test Design Document

Test scenarios are not stored as standalone YAML files. Instead, they are **embedded in markdown tables** within the test design document.

#### Output Location

```
qa.qaLocation/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md
```

Example: `qa-docs/assessments/1.3-test-design-20250114.md`

#### Document Structure

From test-design.md task (lines 91-130):

```markdown
# Test Design: Story 1.3

Date: 2025-01-14
Designer: Quinn (Test Architect)

## Test Strategy Overview

- Total test scenarios: 12
- Unit tests: 7 (58%)
- Integration tests: 4 (33%)
- E2E tests: 1 (8%)
- Priority distribution: P0: 4, P1: 6, P2: 2

## Test Scenarios by Acceptance Criteria

### AC1: User can login with email and password

#### Scenarios

| ID           | Level       | Priority | Test                      | Justification            |
| ------------ | ----------- | -------- | ------------------------- | ------------------------ |
| 1.3-UNIT-001 | Unit        | P0       | Validate input format     | Pure validation logic    |
| 1.3-INT-001  | Integration | P0       | Service processes request | Multi-component flow     |
| 1.3-E2E-001  | E2E         | P1       | User completes journey    | Critical path validation |

[Continue for all ACs...]

## Risk Coverage

| Risk ID       | Severity | Mitigating Tests                    |
| ------------- | -------- | ----------------------------------- |
| RISK-SEC-001  | Critical | 1.3-UNIT-001, 1.3-INT-001           |
| RISK-DATA-002 | High     | 1.3-INT-002, 1.3-INT-003            |
| RISK-PERF-003 | Medium   | 1.3-INT-004                         |

## Recommended Execution Order

1. P0 Unit tests (fail fast)
2. P0 Integration tests
3. P0 E2E tests
4. P1 tests in order
5. P2+ as time permits
```

#### Test Scenario Table Format

Scenarios are presented in **markdown tables** for readability:

```markdown
| ID           | Level       | Priority | Test                      | Justification            |
| ------------ | ----------- | -------- | ------------------------- | ------------------------ |
| 1.3-UNIT-001 | Unit        | P0       | Validate input format     | Pure validation logic    |
```

This maps to the YAML format:
```yaml
id: '1.3-UNIT-001'
level: unit
priority: P0
description: 'Validate input format'
justification: 'Pure validation logic'
```

**Note**: `requirement` field is implicit in the section heading (AC1), and `mitigates_risks` is shown in separate Risk Coverage section.

### Format Generation Process

The test-design.md task generates test scenarios through a systematic process:

#### Step 1: Analyze Story Requirements
- Read story file to extract acceptance criteria
- Identify testable behaviors
- Consider data variations, error conditions, edge cases

#### Step 2: Apply Test Level Framework
- Load `test-levels-framework.md`
- For each testable behavior, determine appropriate level:
  - Pure logic → unit
  - Component interaction → integration
  - User journey → e2e

#### Step 3: Assign Priorities
- Load `test-priorities-matrix.md`
- For each scenario, determine priority based on:
  - Revenue impact
  - Security criticality
  - User frequency
  - Compliance requirements
  - Regression risk

#### Step 4: Design Test Scenarios
- For each testable behavior, create scenario object:
  - Generate unique ID (story + level + sequence)
  - Link to requirement (AC)
  - Assign priority
  - Write clear description
  - Justify level choice
  - Link to risks (if applicable)

#### Step 5: Validate Coverage
- Ensure every AC has at least one test
- Check for duplicate coverage across levels
- Verify critical paths have multi-level coverage
- Confirm all identified risks have mitigation tests

#### Step 6: Generate Output
- Write markdown document with scenarios in tables
- Include test strategy summary statistics
- Add risk coverage matrix
- Provide execution order recommendations

### Format Validation

Although not a standalone template file, the format can still be validated:

#### Structural Validation

```python
def validate_test_scenario(scenario: dict) -> list[str]:
    """Validate test scenario structure and values."""
    errors = []

    # Required fields
    required = ['id', 'requirement', 'priority', 'level', 'description', 'justification']
    for field in required:
        if field not in scenario:
            errors.append(f"Missing required field: {field}")

    # ID format
    if not re.match(r'\d+\.\d+-(UNIT|INT|E2E)-\d{3}', scenario.get('id', '')):
        errors.append(f"Invalid ID format: {scenario.get('id')}")

    # Priority values
    if scenario.get('priority') not in ['P0', 'P1', 'P2', 'P3']:
        errors.append(f"Invalid priority: {scenario.get('priority')}")

    # Level values
    if scenario.get('level') not in ['unit', 'integration', 'e2e']:
        errors.append(f"Invalid level: {scenario.get('level')}")

    # Description length
    if len(scenario.get('description', '')) < 10:
        errors.append("Description too short (minimum 10 characters)")

    # Justification length
    if len(scenario.get('justification', '')) < 10:
        errors.append("Justification too short (minimum 10 characters)")

    return errors
```

#### Semantic Validation

```python
def validate_test_design(scenarios: list[dict], story: dict) -> list[str]:
    """Validate test design comprehensiveness."""
    warnings = []

    # Check AC coverage
    all_acs = extract_acceptance_criteria(story)
    tested_acs = set([s['requirement'] for s in scenarios])
    untested = set(all_acs) - tested_acs
    if untested:
        warnings.append(f"Untested ACs: {', '.join(untested)}")

    # Check test distribution (should follow pyramid)
    total = len(scenarios)
    unit_pct = len([s for s in scenarios if s['level'] == 'unit']) / total
    int_pct = len([s for s in scenarios if s['level'] == 'integration']) / total
    e2e_pct = len([s for s in scenarios if s['level'] == 'e2e']) / total

    if unit_pct < 0.5:
        warnings.append(f"Unit test ratio too low: {unit_pct:.0%} (target: 50-70%)")
    if e2e_pct > 0.2:
        warnings.append(f"E2E test ratio too high: {e2e_pct:.0%} (target: <20%)")

    # Check priority distribution
    p0_count = len([s for s in scenarios if s['priority'] == 'P0'])
    if p0_count == 0:
        warnings.append("No P0 tests - consider if any tests are critical")
    if p0_count > total * 0.4:
        warnings.append(f"Too many P0 tests: {p0_count}/{total} (target: 20-30%)")

    # Check risk coverage (if risk profile exists)
    if story.get('risks'):
        risk_ids = set([r['id'] for r in story['risks']])
        tested_risks = set([risk_id for s in scenarios
                            for risk_id in s.get('mitigates_risks', [])])
        untested = risk_ids - tested_risks
        if untested:
            warnings.append(f"Untested risks: {', '.join(untested)}")

    return warnings
```

### Format Evolution Considerations

If the test scenario format were to become a standalone template (future enhancement):

#### Potential v2.0 Structure

```yaml
template:
  id: test-scenario-template-v2
  name: Test Scenario
  version: 2.0
  output:
    format: yaml
    filename: qa.qaLocation/scenarios/{{epic}}.{{story}}-{{level}}-{{seq}}.yml

# Core fields (unchanged from embedded format)
id: '{{epic}}.{{story}}-{{level}}-{{seq}}'
requirement: '{{requirement}}'
priority: '{{priority}}'  # P0|P1|P2|P3
level: '{{level}}'  # unit|integration|e2e
description: '{{description}}'
justification: '{{justification}}'
mitigates_risks: []  # Array of risk IDs

# v2.0 enhancements
implementation:
  status: not_started|in_progress|implemented|passing|failing
  test_file: '{{test_file_path}}'
  test_name: '{{test_name}}'
  last_run: '{{iso_timestamp}}'
  last_result: '{{pass|fail}}'

coverage:
  lines_covered: 0
  branches_covered: 0
  total_lines: 0
  total_branches: 0

dependencies:
  requires: []  # Test IDs that must pass first
  blocks: []    # Test IDs that depend on this one

metadata:
  created: '{{iso_timestamp}}'
  created_by: 'Quinn (Test Architect)'
  updated: '{{iso_timestamp}}'
  tags: []  # smoke, regression, security, performance, etc.
```

This would enable:
- **Test execution tracking**: Link scenarios to actual test runs
- **Coverage metrics**: Measure code coverage per scenario
- **Test dependencies**: Model execution order constraints
- **Test discovery**: Tools can find tests by scenario ID
- **Status dashboards**: Real-time test status visibility

---

## Summary

The test scenario format is a **compact, focused structure** that encodes BMad's disciplined approach to test design:

### Key Characteristics
- **Embedded format**: Defined within test-design task, not standalone template
- **Seven fields**: id, requirement, priority, level, description, justification, mitigates_risks
- **Framework-driven**: Level and priority determined by applying frameworks
- **Traceability-focused**: Every test links to requirement and optionally to risks
- **Justification-required**: Forces thoughtful test level selection

### Primary Value
- **Shift-left testing**: Framework guides appropriate test level choice
- **Risk-based prioritization**: Tests focus on high-risk, high-impact areas
- **Comprehensive coverage**: Ensures all requirements and risks are tested
- **Knowledge capture**: Justifications document testing decisions
- **Automation support**: Structured format enables tooling integration

### ADK Translation Considerations
- **Firestore collection**: Store scenarios for tracking and reporting
- **Reasoning Engine**: Automate scenario generation using frameworks
- **Coverage tracking**: Link scenarios to test execution results
- **Dashboard visualization**: Test pyramid, priority distribution, risk coverage
- **CI/CD integration**: Execute tests by priority level (P0 first, P3 last)

---

**Next Section**: [Summary & ADK Translation →](development-templates-section4.md)
