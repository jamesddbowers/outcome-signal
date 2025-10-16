# Task Analysis: risk-profile

**Task ID**: `risk-profile`
**Task File**: `.bmad-core/tasks/risk-profile.md`
**Primary Agent**: QA (Quinn)
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14

---

## 1. Purpose & Scope

### Overview
The `risk-profile` task generates a comprehensive risk assessment matrix for a story implementation using **probability × impact analysis**. It systematically identifies, assesses, prioritizes, and provides mitigation strategies for risks across six distinct risk categories.

### Primary Goals
1. **Identify risks early and systematically** across all risk categories
2. **Assess and prioritize risks** using consistent probability × impact scoring (1-9 scale)
3. **Provide actionable mitigation strategies** for each identified risk
4. **Link risks to specific test requirements** for risk-based testing
5. **Track residual risk** after mitigation measures are applied
6. **Support quality gate decisions** through deterministic risk-to-gate mapping

### When to Use
- As part of comprehensive story review (`*review` workflow)
- Standalone risk assessment via `*risk-profile {story}` command
- Before implementation begins (proactive risk identification)
- When story involves high-risk areas (auth, payment, security, data)
- When architecture changes significantly
- When new integrations are added
- After security vulnerabilities are discovered

### Scope
- **Analyzes**: All aspects of story implementation across 6 risk categories
- **Produces**: Risk assessment matrix, mitigation strategies, testing focus areas
- **Outputs**: YAML block for gate file + comprehensive markdown report
- **Integrates**: With quality gate decision-making (deterministic mapping)

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: 'docs/stories/{epic}.{story}.*.md'
  - story_title: '{title}' # If missing, derive from story file H1
  - story_slug: '{slug}' # If missing, derive from title (lowercase, hyphenated)
```

### Input Details

1. **story_id** (Required)
   - Format: `{epic}.{story}` (e.g., "1.3", "2.1", "5.7")
   - Used for: File naming, identification, traceability

2. **story_path** (Required)
   - Source: `core-config.yaml` → `devStoryLocation`
   - Pattern: `docs/stories/{epic}.{story}.*.md`
   - Example: `docs/stories/1.3.user-authentication.md`
   - Contains: Story requirements, ACs, tasks, dev notes, technical context

3. **story_title** (Required or Derived)
   - Source: Story file H1 header if not provided
   - Format: Human-readable title
   - Example: "User Authentication"
   - Used for: Report headers, identification

4. **story_slug** (Required or Derived)
   - Derivation: Lowercase, hyphenated version of title
   - Example: "user-authentication"
   - Used for: File naming convention
   - Pattern: `{epic}.{story}-{slug}`

### Configuration Dependencies

From `core-config.yaml`:
- `qa.qaLocation`: Base directory for QA outputs
- `devStoryLocation`: Location of story files
- `architecture`: Architecture documentation path (for context)
- `technicalPreferences`: Technical preferences and constraints

### Contextual Inputs (Implicit)

The task analyzes these sections from the story file:
- **Acceptance Criteria**: To identify requirement-based risks
- **Tasks/Subtasks**: To identify implementation complexity risks
- **Dev Notes**: To identify technical context risks
- **File List**: To identify component/integration risks
- **Technical Constraints**: To identify technology-specific risks

---

## 3. Execution Flow

### High-Level Process

```
1. Load Story → 2. Identify Risks → 3. Assess Risks → 4. Prioritize Risks
     ↓                                                          ↓
5. Generate Mitigations ← 6. Create Outputs ← 7. Integrate with Gate
```

### Detailed Step-by-Step Flow

#### Step 1: Load Story Context
- Read story file from `story_path`
- Parse story_id, title, slug
- Extract acceptance criteria
- Review tasks and technical notes
- Identify affected components from File List
- Load relevant architecture context
- Review technical preferences/constraints

#### Step 2: Risk Identification by Category

For each of the 6 risk categories, systematically identify specific risks:

**2.1 Technical Risks (TECH)**
- Architecture complexity issues
- Integration challenges with external systems
- Technical debt accumulation
- Scalability concerns
- System dependency problems
- Technology compatibility issues
- Legacy code interaction risks

**2.2 Security Risks (SEC)**
- Authentication/authorization flaws
- Data exposure vulnerabilities
- Injection attack vectors (SQL, XSS, etc.)
- Session management issues
- Cryptographic weaknesses
- API security gaps
- Access control violations

**2.3 Performance Risks (PERF)**
- Response time degradation
- Throughput bottlenecks
- Resource exhaustion (memory, CPU, connections)
- Database query optimization needs
- Caching failures or inefficiencies
- Network latency issues
- Concurrent load handling

**2.4 Data Risks (DATA)**
- Data loss potential
- Data corruption scenarios
- Privacy violations (GDPR, CCPA, etc.)
- Compliance issues
- Backup/recovery gaps
- Data migration risks
- Data integrity constraints

**2.5 Business Risks (BUS)**
- Feature doesn't meet user needs
- Revenue impact (lost sales, churn)
- Reputation damage potential
- Regulatory non-compliance
- Market timing issues
- Competitive disadvantage
- Stakeholder dissatisfaction

**2.6 Operational Risks (OPS)**
- Deployment failures
- Monitoring gaps (observability)
- Incident response readiness
- Documentation inadequacy
- Knowledge transfer issues
- Support complexity
- Rollback procedure gaps

#### Step 3: Risk Assessment

For each identified risk, evaluate using probability × impact:

**3.1 Probability Assessment**
- **High (3)**: Likely to occur (>70% chance)
  - Based on: Similar past issues, known complexity, technology immaturity
- **Medium (2)**: Possible occurrence (30-70% chance)
  - Based on: Some uncertainty, moderate complexity, established patterns
- **Low (1)**: Unlikely to occur (<30% chance)
  - Based on: Well-understood domain, proven technology, simple implementation

**3.2 Impact Assessment**
- **High (3)**: Severe consequences
  - Examples: Data breach, system completely down, major financial loss, regulatory penalties
- **Medium (2)**: Moderate consequences
  - Examples: Degraded performance, minor data issues, user inconvenience, partial outage
- **Low (1)**: Minor consequences
  - Examples: Cosmetic issues, slight delays, minor user inconvenience

**3.3 Risk Score Calculation**
```
Risk Score = Probability × Impact

Score Meanings:
- 9: Critical Risk (Red) - Immediate attention required
- 6: High Risk (Orange) - Must address before deployment
- 4: Medium Risk (Yellow) - Should address, can deploy with mitigation
- 2-3: Low Risk (Green) - Monitor and address if time permits
- 1: Minimal Risk (Blue) - Accept and monitor
```

#### Step 4: Risk Prioritization

**4.1 Create Risk Matrix**

Organize risks by score (descending):

| Risk ID  | Description             | Probability | Impact     | Score | Priority |
| -------- | ----------------------- | ----------- | ---------- | ----- | -------- |
| SEC-001  | XSS vulnerability       | High (3)    | High (3)   | 9     | Critical |
| PERF-001 | Slow query on dashboard | Medium (2)  | Medium (2) | 4     | Medium   |
| DATA-001 | Backup failure          | Low (1)     | High (3)   | 3     | Low      |

**4.2 Categorize by Priority**
- **Critical (9)**: Address immediately, may block deployment
- **High (6)**: Must address before production
- **Medium (4)**: Should address, can deploy with compensating controls
- **Low (2-3)**: Address if time permits, monitor in production
- **Minimal (1)**: Accept and monitor

#### Step 5: Mitigation Strategy Development

For each risk, provide structured mitigation:

**5.1 Mitigation Strategy Type**
- **Preventive**: Stop the risk from occurring
- **Detective**: Detect when risk occurs
- **Corrective**: Minimize impact after occurrence

**5.2 Mitigation Components**

```yaml
mitigation:
  risk_id: 'SEC-001'
  strategy: 'preventive'
  actions:
    - 'Implement input validation library (e.g., validator.js)'
    - 'Add CSP headers to prevent XSS execution'
    - 'Sanitize all user inputs before storage'
    - 'Escape all outputs in templates'
  testing_requirements:
    - 'Security testing with OWASP ZAP'
    - 'Manual penetration testing of forms'
    - 'Unit tests for validation functions'
  residual_risk: 'Low - Some zero-day vulnerabilities may remain'
  owner: 'dev'
  timeline: 'Before deployment'
```

**5.3 Testing Requirements**

For each risk, specify:
- Required test types (unit, integration, E2E, security, load, chaos)
- Specific test scenarios to validate mitigation
- Test data requirements
- Test environment needs
- Pass/fail criteria

#### Step 6: Output Generation

**6.1 Calculate Risk Statistics**
- Total risks identified
- Count by category (TECH, SEC, PERF, DATA, BUS, OPS)
- Count by priority (Critical, High, Medium, Low, Minimal)
- Identify highest-scoring risk
- Calculate overall story risk score

**6.2 Overall Risk Score Calculation**

```
Base Score = 100

For each risk:
  - Critical (9): Deduct 20 points
  - High (6): Deduct 10 points
  - Medium (4): Deduct 5 points
  - Low (2-3): Deduct 2 points

Minimum score = 0 (extremely risky)
Maximum score = 100 (minimal risk)
```

**6.3 Generate Outputs**

Generate two outputs (see Section 7 for details):
1. **Gate YAML Block**: For pasting into gate file
2. **Markdown Report**: Comprehensive risk assessment document

#### Step 7: Integration with Quality Gate

**7.1 Deterministic Gate Mapping**

Apply these rules to determine gate contribution:

```
IF any risk score ≥ 9 (Critical):
  → Gate = FAIL (unless waived)
ELSE IF any risk score ≥ 6 (High):
  → Gate = CONCERNS
ELSE:
  → Gate = PASS (from risk perspective)
```

**7.2 Gate Recommendations**

Populate gate recommendations based on risk scores:
- **must_fix**: All Critical (9) and High (6) security/data risks
- **monitor**: Medium (4) risks with detective controls

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Risk Category Selection

**When**: Beginning of risk identification
**Question**: Which risk categories to assess?
**Options**:
- **Default**: All 6 categories (TECH, SEC, PERF, DATA, BUS, OPS)
- **Focused**: Based on story type (e.g., backend stories emphasize DATA/PERF, frontend emphasizes SEC/PERF)
**Decision Criteria**: Story complexity, affected components, technical context

### Decision Point 2: Risk Identification Depth

**When**: During risk identification
**Question**: How deep to analyze for risks?
**Options**:
- **Surface-level**: Obvious risks from requirements
- **Deep analysis**: Code review, dependency analysis, integration complexity
**Decision Criteria**:
- Story has >5 ACs → Deep analysis
- Auth/payment/security components → Deep analysis
- Diff >500 lines → Deep analysis
- Previous FAIL/CONCERNS gate → Deep analysis
- Otherwise → Surface-level

### Decision Point 3: Probability Assessment

**When**: For each identified risk
**Question**: How likely is this risk to occur?
**Options**: High (3), Medium (2), Low (1)
**Decision Criteria**:
- Past occurrences in similar stories
- Technology maturity and team familiarity
- Complexity of implementation
- External dependencies involved
- Test coverage adequacy

### Decision Point 4: Impact Assessment

**When**: For each identified risk
**Question**: What are the consequences if this risk occurs?
**Options**: High (3), Medium (2), Low (1)
**Decision Criteria**:
- Financial impact
- User impact (number affected, severity)
- Regulatory/compliance implications
- System availability impact
- Data integrity/security impact
- Reputation impact

### Decision Point 5: Mitigation Strategy Type

**When**: Developing mitigation for each risk
**Question**: What type of mitigation is most effective?
**Options**:
- **Preventive**: Stop risk from occurring (preferred for Critical/High risks)
- **Detective**: Detect when risk occurs (for risks that can't be prevented)
- **Corrective**: Minimize damage after occurrence (fallback strategy)
**Decision Criteria**: Cost-benefit analysis, feasibility, timeline constraints

### Decision Point 6: Residual Risk Acceptance

**When**: After mitigation strategies defined
**Question**: Is residual risk acceptable?
**Options**:
- **Accept**: Residual risk is Low/Minimal with mitigation
- **Escalate**: Residual risk remains High/Critical, requires stakeholder decision
**Decision Criteria**: Risk tolerance from technical-preferences, stakeholder input

### Decision Point 7: Gate Decision Contribution

**When**: Generating gate YAML block
**Question**: What gate status should risk assessment recommend?
**Options**: FAIL, CONCERNS, PASS, WAIVED
**Decision Logic** (Deterministic):
```
IF any risk score ≥ 9 AND NOT waived:
  → FAIL
ELSE IF any risk score ≥ 6:
  → CONCERNS
ELSE IF all mitigations in place:
  → PASS
ELSE:
  → CONCERNS (unmitigated risks)
```

### Decision Point 8: Waiver Consideration

**When**: Critical/High risk identified
**Question**: Should a waiver be considered?
**Conditions for Waiver**:
- Risk is understood and documented
- Compensating controls are in place
- Business justification exists
- Appropriate authority approves
- Timeline for addressing risk is defined
**Not Waived**: Security risks, data loss risks, regulatory compliance risks (unless exceptional circumstances)

---

## 5. User Interaction Points

### Interaction Pattern
The risk-profile task is typically **non-interactive** when executed as part of the `*review` workflow, but can be **interactive** when run standalone.

### Interactive Mode (Standalone Execution)

**Interaction 1: Story Confirmation**
- **When**: Task invocation
- **Prompt**: "Analyzing risk profile for Story {epic}.{story}: {title}. Confirm?"
- **User Input**: Yes/No
- **Purpose**: Ensure correct story is being analyzed

**Interaction 2: Risk Category Focus (Optional)**
- **When**: Beginning of risk identification
- **Prompt**: "Focus on specific risk categories? (Default: All 6)"
- **Options**:
  - All (default)
  - Select specific: TECH, SEC, PERF, DATA, BUS, OPS
- **Purpose**: Allow targeted risk assessment for specific concerns

**Interaction 3: Depth Confirmation**
- **When**: After initial risk scan
- **Prompt**: "Found {X} potential risk areas. Proceed with detailed analysis?"
- **User Input**: Yes/No/Adjust scope
- **Purpose**: Control analysis depth based on initial findings

**Interaction 4: Mitigation Validation**
- **When**: After mitigation strategies generated
- **Prompt**: "Review proposed mitigations for {risk_id}?"
- **User Input**: Approve/Modify/Add more
- **Purpose**: Validate mitigation strategies align with team practices

**Interaction 5: Waiver Decision**
- **When**: Critical/High risk identified
- **Prompt**: "Risk {risk_id} scored {score}. Request waiver?"
- **User Input**: Yes (requires reason + approver)/No
- **Purpose**: Allow informed risk acceptance with proper authorization

### Non-Interactive Mode (Part of *review Workflow)

When executed as part of comprehensive review:
- Automatically analyzes all 6 risk categories
- Uses defaults for all decisions
- Generates complete outputs without user prompts
- Flags critical issues in review output for user attention

### User Escalation Points

**HALT and request user input when**:
1. **Cannot access story file**: Path invalid or file missing
2. **Story context incomplete**: Missing critical sections (ACs, Dev Notes)
3. **Critical risk requires waiver**: Score ≥ 9 and no automated mitigation exists
4. **Conflicting technical constraints**: Cannot determine appropriate mitigation
5. **Ambiguous risk scope**: Cannot determine affected components

---

## 6. Output Specifications

### Output 1: Gate YAML Block

**Purpose**: Structured data for inclusion in quality gate file
**Format**: YAML
**Destination**: For pasting into `qa.qaLocation/gates/{epic}.{story}-{slug}.yml` under `risk_summary` key

#### Schema

```yaml
risk_summary:
  totals:
    critical: X    # count of risks with score 9
    high: Y        # count of risks with score 6
    medium: Z      # count of risks with score 4
    low: W         # count of risks with score 2-3
  highest:         # Only if risks exist
    id: SEC-001
    score: 9
    title: 'XSS vulnerability on profile form'
  recommendations:
    must_fix:      # Actions required before production
      - 'Add input sanitization & CSP headers'
      - 'Implement rate limiting on auth endpoints'
    monitor:       # Post-deployment monitoring needed
      - 'Track error rates on payment processing'
      - 'Monitor database query performance'
```

#### Output Rules

1. **No Placeholder Data**
   - Only include assessed risks
   - Do not emit empty placeholders or template values
   - If no risks: Set all totals to 0, omit `highest`, keep `recommendations` arrays empty

2. **Sorting**
   - Sort risks by score (descending) when displaying
   - Highest risk appears first in any tabular lists

3. **Recommendations Structure**
   - `must_fix`: Critical (9) and High (6) risks requiring immediate action
   - `monitor`: Medium (4) risks with detective controls post-deployment

4. **Completeness**
   - Every risk with score ≥ 6 must have at least one `must_fix` action
   - Every risk with score = 4 should have monitoring guidance

### Output 2: Markdown Risk Assessment Report

**Purpose**: Comprehensive risk documentation for stakeholders
**Format**: Markdown
**Destination**: `qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md`

#### Report Structure

```markdown
# Risk Profile: Story {epic}.{story} - {title}

**Date**: {YYYY-MM-DD}
**Reviewer**: Quinn (Test Architect)
**Story Path**: {story_path}

---

## Executive Summary

- **Total Risks Identified**: X
- **Critical Risks (Score 9)**: Y
- **High Risks (Score 6)**: Z
- **Medium Risks (Score 4)**: W
- **Overall Risk Score**: XX/100
- **Gate Recommendation**: PASS|CONCERNS|FAIL

**Top Risk**: [{Risk ID}] {Risk Title} (Score: {score})

---

## Critical Risks Requiring Immediate Attention

### 1. [{Risk ID}]: {Risk Title}

**Score**: 9 (Critical)
**Category**: {Security|Performance|Data|etc.}
**Probability**: High (3) - {Detailed reasoning based on evidence}
**Impact**: High (3) - {Potential consequences with specifics}

**Affected Components**:
- {Component 1}
- {Component 2}

**Detection Method**: {How this risk was identified}

**Mitigation Strategy** (Preventive):
1. {Specific action 1}
2. {Specific action 2}
3. {Specific action 3}

**Testing Focus**:
- {Test scenario 1}
- {Test scenario 2}
- Required test types: {security/load/chaos/etc.}

**Residual Risk**: {Low|Medium} - {Description of remaining risk after mitigation}

**Owner**: {dev|ops|security team}
**Timeline**: {Before deployment|Sprint X|etc.}

---

## Risk Distribution

### By Category

| Category      | Total | Critical | High | Medium | Low |
| ------------- | ----- | -------- | ---- | ------ | --- |
| Technical     | X     | Y        | Z    | W      | V   |
| Security      | X     | Y        | Z    | W      | V   |
| Performance   | X     | Y        | Z    | W      | V   |
| Data          | X     | Y        | Z    | W      | V   |
| Business      | X     | Y        | Z    | W      | V   |
| Operational   | X     | Y        | Z    | W      | V   |

### By Component

| Component       | Risks | Highest Score | Critical Issues |
| --------------- | ----- | ------------- | --------------- |
| Authentication  | 3     | 9             | 1               |
| Database Layer  | 2     | 6             | 0               |
| API Endpoints   | 4     | 6             | 0               |

---

## Detailed Risk Register

| ID       | Category | Risk Title                    | Prob | Impact | Score | Mitigation Status |
| -------- | -------- | ----------------------------- | ---- | ------ | ----- | ----------------- |
| SEC-001  | Security | XSS vulnerability             | 3    | 3      | 9     | Planned           |
| PERF-001 | Perf     | Slow dashboard query          | 2    | 2      | 4     | Mitigated         |
| DATA-001 | Data     | Backup recovery gap           | 1    | 3      | 3     | Accepted          |

### Detailed Risk Entries

#### [SEC-001] XSS Vulnerability on Profile Form

**Description**: Form inputs not properly sanitized could lead to XSS attacks allowing malicious scripts to execute in victim browsers.

**Category**: Security
**Probability**: High (3) - No input validation library currently in use, manual sanitization prone to gaps
**Impact**: High (3) - Could lead to session hijacking, data theft, malicious redirects

**Affected Components**:
- `src/components/UserProfile.tsx`
- `src/api/profile/update.ts`

**Detection Method**: Code review revealed missing validation on user-provided fields (bio, website, social links)

**Mitigation Strategy** (Preventive):
1. Implement DOMPurify library for HTML sanitization
2. Add Content Security Policy (CSP) headers to prevent inline script execution
3. Sanitize all user inputs before storage in database
4. Use context-aware output escaping in templates (React does this by default for text, but not for dangerouslySetInnerHTML)
5. Add unit tests for validation functions covering common XSS vectors

**Testing Requirements**:
- Security testing with OWASP ZAP automated scanner
- Manual penetration testing focusing on form inputs
- Unit tests for validation functions (test cases: `<script>`, `<img onerror>`, event handlers, etc.)
- Integration tests verifying CSP headers are applied

**Residual Risk**: Low - With comprehensive input validation and CSP, only sophisticated zero-day XSS vectors remain as residual risk

**Owner**: Dev Team
**Timeline**: Must be completed before deployment to production

---

## Risk-Based Testing Strategy

### Priority 1: Critical Risk Tests (Must Execute)

**[SEC-001] XSS Vulnerability**
- Test Type: Security + Unit
- Scenarios:
  1. Attempt to inject `<script>alert('XSS')</script>` in all form fields
  2. Test common XSS vectors: event handlers, SVG attacks, data URIs
  3. Verify CSP blocks inline scripts
  4. Test HTML entities are properly escaped
- Test Data: OWASP XSS payload list
- Pass Criteria: Zero XSS vectors succeed, CSP violations logged

### Priority 2: High Risk Tests (Should Execute)

**[PERF-002] Dashboard Query Performance**
- Test Type: Load + Integration
- Scenarios:
  1. Load dashboard with 10K records
  2. Measure response time under concurrent load (50 users)
  3. Verify query uses indexes
- Test Data: Large synthetic dataset
- Pass Criteria: Response time < 500ms, no table scans

### Priority 3: Medium Risk Tests (Execute if Time)

**[DATA-003] Backup Verification**
- Test Type: Integration + Chaos
- Scenarios:
  1. Trigger backup and verify file exists
  2. Restore from backup and verify data integrity
- Test Data: Production-like dataset
- Pass Criteria: 100% data integrity after restore

---

## Risk Acceptance Criteria

### Must Fix Before Production

All risks meeting these criteria MUST be addressed:
- ✓ Score ≥ 9 (Critical)
- ✓ Security risks with score ≥ 6
- ✓ Data loss risks with score ≥ 6
- ✓ Regulatory compliance gaps

**Current Status**: 1 risk requires fix ([SEC-001])

### Can Deploy with Mitigation

Risks that can proceed to production with compensating controls:
- Medium risks (score = 4) with monitoring in place
- Low security risks (score < 6) with detective controls
- Technical debt items with remediation plan

**Current Status**: 2 risks in this category

### Accepted Risks

Risks the team has decided to accept:
- **[DATA-001] Backup recovery gap**: Accepted - Manual recovery process documented, low probability, backup monitoring in place
- **Approved By**: Tech Lead
- **Date**: {date}
- **Review Date**: {date + 90 days}

---

## Monitoring Requirements

### Post-Deployment Monitoring

**For Security Risks**:
- Alert on authentication failures (threshold: >5 failures in 5 min per IP)
- Monitor for SQL injection patterns in logs
- Track CSP violation reports

**For Performance Risks**:
- Dashboard response time (alert if p95 > 500ms)
- Database query execution time (alert if slow query log entries)
- API endpoint latency (track p50, p95, p99)

**For Data Risks**:
- Backup success/failure rate (alert on 2 consecutive failures)
- Data validation error rates
- Database replication lag

**For Operational Risks**:
- Deployment success rate
- Error rates by component
- Application health checks

---

## Risk Review Triggers

Re-assess risk profile when:
- ✓ Architecture changes significantly (e.g., new database, new auth provider)
- ✓ New integrations added (e.g., third-party APIs, payment processors)
- ✓ Security vulnerabilities discovered (e.g., in dependencies, frameworks)
- ✓ Performance issues reported by users
- ✓ Regulatory requirements change (e.g., new GDPR guidance, industry standards)
- ✓ New critical business requirements added
- ✓ Major technology version upgrades (e.g., framework major versions)

---

## Appendix: Risk Assessment Methodology

### Probability × Impact Matrix

|            | Low Impact (1) | Medium Impact (2) | High Impact (3) |
| ---------- | -------------- | ----------------- | --------------- |
| High (3)   | 3 (Low)        | 6 (High)          | 9 (Critical)    |
| Medium (2) | 2 (Low)        | 4 (Medium)        | 6 (High)        |
| Low (1)    | 1 (Minimal)    | 2 (Low)           | 3 (Low)         |

### Risk Score Interpretation

- **9 (Critical)**: Red alert - Immediate action required, likely blocks deployment
- **6 (High)**: Orange alert - Must address before production deployment
- **4 (Medium)**: Yellow alert - Should address, can deploy with compensating controls and monitoring
- **2-3 (Low)**: Green alert - Monitor in production, address in future sprint if needed
- **1 (Minimal)**: Blue - Accept and track, very low priority

### Overall Story Risk Score

```
Base: 100 points
Deductions:
  - Critical risk (9): -20 points each
  - High risk (6): -10 points each
  - Medium risk (4): -5 points each
  - Low risk (2-3): -2 points each

Floor: 0 (extremely risky)
Ceiling: 100 (minimal risk)
```

**Current Story Score**: {calculated_score}/100

---

**Report Generated**: {timestamp}
**Tool**: BMad Framework - QA Agent (Quinn)
**Next Review**: {date + 14 days} (or upon trigger conditions)
```

### Output 3: Story Hook Line

**Purpose**: Reference line for review task to include in story QA Results section
**Format**: Plain text
**Content**:

```text
Risk profile: qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md
```

**Example**:
```text
Risk profile: qa/assessments/1.3-risk-20251014.md
```

This line is printed to console for the review task to quote in the story's QA Results section.

---

## 7. Error Handling & Validation

### Input Validation

**Validate story_id format**:
- Pattern: `^\d+\.\d+$`
- Error: "Invalid story_id format. Expected {epic}.{story} (e.g., '1.3')"
- Action: HALT and request correction

**Validate story file exists**:
- Check: File exists at `story_path`
- Error: "Story file not found at {story_path}"
- Action: HALT and request valid path

**Validate story file structure**:
- Check: File contains H1 header, Acceptance Criteria section
- Error: "Story file incomplete - missing {section}"
- Action: HALT and request complete story file

**Validate output directory**:
- Check: `qa.qaLocation` exists in config and is writable
- Error: "QA location not configured or not writable: {path}"
- Action: Create directory or HALT if permission denied

### Processing Errors

**Risk identification failures**:
- **Condition**: Cannot extract meaningful risks from story
- **Handling**:
  - Generate minimal risk profile with note about limited context
  - Flag for manual review
  - Do NOT block process

**Mitigation generation failures**:
- **Condition**: Cannot generate specific mitigation for identified risk
- **Handling**:
  - Provide generic mitigation template
  - Flag risk for expert review
  - Include in CONCERNS but do NOT fail gate solely for this

**File write failures**:
- **Condition**: Cannot write markdown report or gate YAML
- **Error**: "Failed to write risk assessment to {path}: {reason}"
- **Handling**:
  - Retry once with timestamp adjustment
  - If still fails, output to console and HALT
  - Request user intervention

### Data Quality Validation

**Risk score consistency**:
- Validate: Probability × Impact = Score
- Error: "Risk score mismatch for {risk_id}"
- Action: Recalculate and log warning

**Risk ID uniqueness**:
- Validate: All risk IDs are unique within assessment
- Error: "Duplicate risk ID: {risk_id}"
- Action: Auto-increment duplicate IDs (e.g., SEC-001, SEC-001a)

**Mitigation completeness**:
- Validate: Every risk with score ≥ 6 has mitigation strategy
- Warning: "High/Critical risk {risk_id} missing mitigation"
- Action: Flag in report but do NOT block output

**Residual risk reasonableness**:
- Validate: Residual risk ≤ Original risk score
- Warning: "Residual risk for {risk_id} higher than original"
- Action: Flag for review but do NOT block

### Output Validation

**YAML syntax validation**:
- Validate: Generated YAML parses correctly
- Error: "Invalid YAML syntax in gate block"
- Action: Fix syntax and retry generation

**Markdown formatting validation**:
- Validate: Generated markdown has proper headings, tables
- Warning: "Markdown formatting issue detected"
- Action: Log warning but allow output

**File naming validation**:
- Validate: Output filename follows pattern `{epic}.{story}-risk-{YYYYMMDD}.md`
- Error: "Invalid output filename: {filename}"
- Action: Correct filename and retry

### Blocking Conditions (HALT)

Task must HALT and request user input when:

1. **Missing Core Configuration**
   - `qa.qaLocation` not defined in `core-config.yaml`
   - `devStoryLocation` not defined
   - Action: Request configuration update

2. **Story Context Insufficient**
   - Story file missing critical sections (ACs, Dev Notes, Tasks)
   - Cannot determine affected components
   - Action: Request story completion before risk assessment

3. **Critical Risk Requires Decision**
   - Risk score ≥ 9 identified
   - No standard mitigation available
   - Action: Escalate to user for waiver decision or mitigation guidance

4. **Conflicting Requirements**
   - Technical constraints conflict (e.g., "use library X" vs "no dependencies")
   - Cannot determine appropriate mitigation path
   - Action: Request clarification from user

5. **File System Access Denied**
   - Cannot create output directory
   - Cannot write assessment files
   - Action: Request permission fix or alternate output location

### Non-Blocking Warnings

Log warning but continue processing when:

1. **Limited Context**: Some sections missing from story but minimum viable context exists
2. **Generic Mitigations**: Had to use generic mitigation templates for some risks
3. **Incomplete Risk Coverage**: May have missed some edge case risks due to complexity
4. **Ambiguous Probability/Impact**: Had to make educated guess on probability or impact level

### Recovery Strategies

**Graceful Degradation**:
- If full assessment impossible, provide partial assessment with clear limitations noted
- If markdown report fails, at least generate gate YAML block
- If gate YAML fails, at least output risk summary to console

**Retry Logic**:
- File writes: Retry once with slight delay
- YAML generation: Retry with simplified structure if full structure fails
- Risk identification: If automated analysis fails, prompt for manual input

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**No Direct Task Dependencies**:
- This task is self-contained
- Does NOT require other tasks to run first
- CAN be executed independently or as part of `*review` workflow

### Data File Dependencies

**From `.bmad-core/data/`**:

1. **technical-preferences.md**
   - **Purpose**: Technology constraints, risk tolerance thresholds
   - **Used For**:
     - Understanding technology stack limitations
     - Determining risk acceptance criteria
     - Identifying preferred mitigation approaches
   - **Optional**: Yes (can run without, but less context-aware)

### Template Dependencies

**No Direct Template Dependencies**:
- Risk assessment markdown report is NOT template-driven
- Output structure is procedurally generated based on identified risks
- Gate YAML block follows fixed schema (not from template)

### Configuration Dependencies

**From `core-config.yaml`**:

1. **qa.qaLocation** (Required)
   - **Purpose**: Base directory for QA assessment outputs
   - **Example**: `"qa"` or `"docs/quality-assurance"`
   - **Used For**: Determining where to save risk assessment markdown
   - **Subdirectories Created**:
     - `{qa.qaLocation}/assessments/` - Risk assessment reports
     - `{qa.qaLocation}/gates/` - Gate decision files

2. **devStoryLocation** (Required)
   - **Purpose**: Directory containing story files
   - **Example**: `"docs/stories"`
   - **Used For**: Locating story file to analyze
   - **Pattern**: `{devStoryLocation}/{epic}.{story}.*.md`

3. **architecture** (Optional)
   - **Purpose**: Path to architecture documentation
   - **Example**: `"docs/architecture"`
   - **Used For**: Loading architectural context for technical risk assessment
   - **If Missing**: Risk assessment proceeds with story context only

4. **technicalPreferences** (Optional)
   - **Purpose**: Path to technical preferences file
   - **Example**: `"docs/technical-preferences.md"`
   - **Used For**: Understanding technology constraints and risk tolerance
   - **If Missing**: Uses default risk assessment criteria

### Story File Structure Dependencies

**Required Sections in Story File**:

1. **H1 Title** (Required)
   - Used for: story_title if not provided as input
   - Example: `# Story 1.3: User Authentication`

2. **Acceptance Criteria** (Required)
   - Section header: `## Acceptance Criteria`
   - Used for: Identifying requirement-based risks
   - Format: Numbered or bulleted list

3. **Tasks/Subtasks** (Recommended)
   - Section header: `## Tasks` or `## Implementation Tasks`
   - Used for: Understanding implementation complexity
   - Format: Checkbox list with tasks

4. **Dev Notes** (Recommended)
   - Section header: `## Dev Notes` or `## Development Notes`
   - Used for: Technical context, constraints, dependencies
   - Format: Subsections with technical details

5. **File List** (Recommended)
   - Section header: `## File List` or within Dev Notes
   - Used for: Identifying affected components
   - Format: List of file paths

### External System Dependencies

**None**:
- This task operates entirely within the file system
- No external APIs or services required
- No network dependencies

### Tool Dependencies

**File System Operations**:
- Read access to story files
- Write access to QA assessment directory
- Directory creation permissions

**YAML Parser** (Implicit):
- For reading `core-config.yaml`
- For generating gate YAML block
- Standard YAML libraries

**Markdown Generator** (Implicit):
- For creating comprehensive risk report
- String formatting capabilities

### Execution Context Dependencies

**Agent Context**:
- Must be executed by QA agent (Quinn) for proper persona and expertise application
- Can be invoked by other agents but loses QA-specific risk assessment nuances

**Workflow Context**:
- **Standalone**: Can run independently via `*risk-profile {story}`
- **Part of Review**: Typically executed as subprocess of `*review` workflow
- **Timing**: Best executed after story implementation, before final review

---

## 9. Integration Points

### Integration with Quality Gate Workflow

**Primary Integration**: `*gate` task consumes risk assessment output

**Flow**:
```
*risk-profile → risk_summary (YAML) → *gate → gate decision file
```

**Data Passed**:
- `risk_summary.totals`: Counts by priority level
- `risk_summary.highest`: Top risk for gate decision
- `risk_summary.recommendations`: must_fix and monitor items

**Gate Decision Logic**:
```yaml
# In gate decision calculation
IF risk_summary.totals.critical > 0:
  → Gate = FAIL (unless waived)
ELSE IF risk_summary.totals.high > 0:
  → Gate = CONCERNS
ELSE:
  → Gate = PASS (from risk perspective)
```

### Integration with Review Story Workflow

**Primary Integration**: `*review` orchestrates risk profiling as subprocess

**Flow**:
```
*review → load story → *risk-profile (subprocess) → comprehensive review → gate decision
```

**When Executed**:
- Automatically during comprehensive review
- After code quality assessment
- Before test design and traceability analysis

**Output Integration**:
- Risk profile referenced in QA Results section
- Risk data feeds into gate decision
- Testing focus areas inform test design task

### Integration with Test Design Workflow

**Primary Integration**: Risk assessment informs test prioritization

**Flow**:
```
*risk-profile → risk priorities → *test-design → test scenarios aligned to risks
```

**Data Passed**:
- High-risk areas become P0 test scenarios
- Risk mitigations inform test types (security, load, chaos)
- Testing requirements from mitigations become test cases

**Example**:
```
SEC-001 (Critical) → P0 security test scenarios
PERF-002 (High) → P1 load test scenarios
```

### Integration with NFR Assessment Workflow

**Primary Integration**: Risk categories map to NFR dimensions

**Flow**:
```
*risk-profile (identifies risks) ← → *nfr-assess (validates NFRs)
```

**Relationship**:
- SEC risks → Security NFR assessment focus
- PERF risks → Performance NFR assessment focus
- DATA risks → Reliability NFR assessment focus
- OPS risks → Maintainability NFR assessment focus

**Bidirectional**:
- Risk profile identifies potential NFR gaps
- NFR assessment validates risk mitigations are effective

### Integration with Requirements Traceability

**Primary Integration**: Risk-based testing requirements

**Flow**:
```
*risk-profile → testing requirements → *trace → verify tests exist
```

**Data Passed**:
- Testing requirements from mitigation strategies
- Critical test scenarios for high-risk areas
- Coverage expectations based on risk levels

**Validation**:
- Trace task verifies testing requirements from risk mitigations have corresponding tests
- Coverage gaps for high-risk areas trigger CONCERNS

### Integration with Dev Agent Workflow

**Primary Integration**: Risk awareness during implementation

**Flow**:
```
*risk-profile (before dev) → dev awareness → *develop-story → risk-conscious implementation
```

**Usage**:
- Dev agent reviews risk profile before beginning implementation
- High/Critical risks inform coding approach
- Mitigation actions become implementation checklist items

**Feedback Loop**:
- Dev agent may request risk re-assessment if implementation reveals new risks
- Dev agent updates story if mitigations are implemented

### Integration with Story Validation Workflow

**Primary Integration**: Pre-implementation risk assessment

**Flow**:
```
*validate-next-story → preliminary risk scan → *risk-profile (full) → story approval
```

**Usage**:
- PO agent may request risk profile during story validation
- High-risk stories may require additional ACs or constraints
- Risk profile informs "ready for implementation" decision

### Integration with Course Correction Workflow

**Primary Integration**: Risk re-assessment after changes

**Flow**:
```
*correct-course → scope changes → *risk-profile (re-run) → updated risks
```

**Trigger**:
- Architecture changes
- New integrations added
- Scope significantly expands

**Action**:
- Re-run risk assessment with updated story context
- Update gate file with new risk summary
- Notify stakeholders of risk changes

### Integration with File System

**Read Operations**:
- `{devStoryLocation}/{epic}.{story}.*.md` - Story file (primary input)
- `{architecture}/` - Architecture docs (for technical context)
- `{technicalPreferences}` - Technical constraints
- `core-config.yaml` - Configuration

**Write Operations**:
- `{qa.qaLocation}/assessments/{epic}.{story}-risk-{YYYYMMDD}.md` - Risk report
- Console output - Gate YAML block for manual pasting (or automated by review task)

**Directory Creation**:
- Creates `{qa.qaLocation}/assessments/` if it doesn't exist

### Integration with Gate File

**Write Integration**:
- Gate YAML block output is designed to be pasted into gate file
- When executed as part of `*review`, the review task automatically includes it
- When executed standalone, user manually pastes or `*gate` task incorporates it

**Gate File Location**:
- `{qa.qaLocation}/gates/{epic}.{story}-{slug}.yml`

**Gate File Section**:
```yaml
# Gate file structure
schema: 1
story: '1.3'
gate: CONCERNS
# ... other sections ...

risk_summary:    # ← Risk profile output goes here
  totals:
    critical: 1
    high: 2
    medium: 3
    low: 1
  highest:
    id: SEC-001
    score: 9
    title: 'XSS vulnerability'
  recommendations:
    must_fix:
      - 'Add input sanitization'
    monitor:
      - 'Track security alerts'
```

---

## 10. Configuration References

### Required Configuration

**From `core-config.yaml`**:

```yaml
# Required for risk-profile task
qa:
  qaLocation: "qa"  # Base directory for QA outputs (REQUIRED)

devStoryLocation: "docs/stories"  # Story files location (REQUIRED)
```

### Optional Configuration

```yaml
# Optional for enhanced risk assessment
architecture: "docs/architecture"  # Architecture docs for technical context

technicalPreferences: "docs/technical-preferences.md"  # Risk tolerance, constraints
```

### Configuration Usage Examples

**Minimal Configuration** (Task will work):
```yaml
qa:
  qaLocation: "qa"
devStoryLocation: "docs/stories"
```

**Full Configuration** (Enhanced risk assessment):
```yaml
qa:
  qaLocation: "qa"
  gateLocation: "qa/gates"
  assessmentLocation: "qa/assessments"

devStoryLocation: "docs/stories"
architecture: "docs/architecture"
technicalPreferences: "docs/technical-preferences.md"

project:
  name: "MyProject"
  riskTolerance: "medium"  # low|medium|high
```

### Dynamic Configuration

**Risk Tolerance Thresholds** (from `technical-preferences.md`):
```markdown
## Risk Assessment

### Risk Tolerance
- **Security**: Zero tolerance for Critical (9), accept Medium (4) with monitoring
- **Performance**: Accept up to High (6) with optimization plan
- **Data**: Zero tolerance for Critical (9) data loss risks
```

**Technology Constraints** (from `technical-preferences.md`):
```markdown
## Technology Stack
- **Language**: TypeScript (strict mode)
- **Framework**: Next.js 14
- **Database**: PostgreSQL 15
- **Deployment**: Vercel

### Known Limitations
- No native cron jobs (use Vercel Cron or external scheduler)
- Max function execution time: 60s (affects long-running tasks)
```

These constraints inform risk identification (e.g., TECH-001: "Long-running import might exceed 60s function limit").

---

## 11. Key Principles & Design Philosophy

### 1. Systematic Risk Identification

**Principle**: Use structured frameworks to ensure comprehensive risk coverage

**Implementation**:
- Six distinct risk categories (TECH, SEC, PERF, DATA, BUS, OPS) ensure all dimensions covered
- Each category has predefined subcategories to guide identification
- Checklist-driven approach prevents overlooking common risk types

**Benefit**: Reduces "unknown unknowns" through systematic enumeration

### 2. Objective Risk Scoring

**Principle**: Use consistent, repeatable probability × impact calculation

**Implementation**:
- Three-level scale (1-2-3) for both probability and impact
- Clear definitions for each level with examples
- Mathematical multiplication produces score (1-9 scale)
- Score interpretation is standardized (9=Critical, 6=High, 4=Medium, 2-3=Low, 1=Minimal)

**Benefit**: Eliminates subjective "gut feel" risk assessment, enables comparison across stories

### 3. Actionable Mitigation Strategies

**Principle**: Every risk must have specific, implementable mitigation actions

**Implementation**:
- Three mitigation types: Preventive (stop), Detective (detect), Corrective (minimize damage)
- Each mitigation includes specific actions, testing requirements, timeline, owner
- Residual risk assessment after mitigation
- Link mitigations to test scenarios

**Benefit**: Turns risk assessment from documentation exercise into action plan

### 4. Risk-Based Testing

**Principle**: Align testing effort with risk levels

**Implementation**:
- Critical risks (9) → P0 tests (must execute)
- High risks (6) → P1 tests (should execute)
- Medium risks (4) → P2 tests (execute if time)
- Testing requirements explicitly stated in mitigation strategies

**Benefit**: Optimizes test coverage by focusing on high-impact areas

### 5. Deterministic Gate Integration

**Principle**: Risk assessment must directly inform quality gate decisions

**Implementation**:
- Clear mapping: Critical risk → FAIL, High risk → CONCERNS, else PASS
- No subjective interpretation required
- Gate decision is reproducible and auditable

**Benefit**: Consistent quality gates across all stories, clear deployment criteria

### 6. Residual Risk Tracking

**Principle**: Acknowledge that not all risks can be eliminated

**Implementation**:
- After mitigation, assess remaining risk level
- Document accepted residual risks with justification
- Track residual risks for monitoring in production

**Benefit**: Realistic risk management, informed risk acceptance decisions

### 7. Stakeholder Communication

**Principle**: Risk assessment must be understandable by non-technical stakeholders

**Implementation**:
- Executive summary with key metrics
- Visual prioritization (Critical/High/Medium/Low color coding)
- Plain language descriptions of risks and consequences
- Clear recommendations for must-fix vs can-accept

**Benefit**: Enables informed business decisions about risk vs schedule tradeoffs

### 8. Continuous Risk Management

**Principle**: Risk assessment is not one-time, risks evolve

**Implementation**:
- Risk review triggers defined (architecture changes, new integrations, vulnerabilities)
- Risk profile includes next review date
- Course correction workflow can trigger risk re-assessment

**Benefit**: Risk management stays current as project evolves

### 9. Evidence-Based Risk Assessment

**Principle**: Risks must be identified based on concrete evidence, not speculation

**Implementation**:
- Detection method documented for each risk
- Reference specific components, files, or requirements
- Cite previous incidents or known vulnerabilities when applicable

**Benefit**: Credible risk assessment, reduces false positives

### 10. LLM-Accelerated Systematic Analysis

**Principle**: Leverage LLM capabilities for comprehensive yet efficient risk identification

**Implementation**:
- LLM applies structured frameworks consistently
- Automated risk scoring using defined rubrics
- Generates comprehensive mitigation strategies from knowledge base
- Maintains human oversight for final decisions

**Benefit**: Thorough risk assessment in minutes vs hours, while maintaining quality

---

## 12. ADK Translation Recommendations

### High Priority Recommendations

#### 1. Reasoning Engine Implementation for Risk Workflow

**Requirement**: Multi-step risk assessment process with state management

**Vertex AI ADK Approach**:
```python
class RiskProfileWorkflow:
    """Reasoning Engine workflow for risk-profile task."""

    def execute(self, story_id: str, story_path: str) -> dict:
        # Step 1: Load and parse story
        story = self.load_story_context(story_id, story_path)

        # Step 2: Identify risks across 6 categories
        risks = self.identify_risks_by_category(story)

        # Step 3: Assess each risk (probability × impact)
        assessed_risks = self.assess_risks(risks, story)

        # Step 4: Prioritize and generate risk matrix
        risk_matrix = self.create_risk_matrix(assessed_risks)

        # Step 5: Generate mitigation strategies
        mitigations = self.generate_mitigations(assessed_risks, story)

        # Step 6: Calculate overall risk score
        overall_score = self.calculate_risk_score(assessed_risks)

        # Step 7: Generate outputs
        gate_yaml = self.generate_gate_yaml(risk_matrix, mitigations)
        markdown_report = self.generate_markdown_report(
            risk_matrix, mitigations, overall_score
        )

        # Step 8: Save outputs
        self.save_outputs(gate_yaml, markdown_report, story_id)

        return {
            "risk_summary": risk_matrix,
            "overall_score": overall_score,
            "report_path": f"qa/assessments/{story_id}-risk-{date}.md"
        }
```

**Rationale**: Risk profiling requires sequential steps with dependencies, state management, and complex decision logic—ideal for Reasoning Engine.

#### 2. Risk Category Knowledge Base

**Requirement**: Comprehensive risk identification guidance for each category

**Vertex AI ADK Approach**:
- Store risk category definitions, common risk patterns, and identification checklists in Vertex AI Search
- Use RAG to retrieve relevant risk patterns based on story context
- Example: Story mentions "authentication" → Retrieve SEC risks related to auth/authz

**Implementation**:
```python
# In Reasoning Engine workflow
def identify_risks_by_category(self, story: dict) -> list:
    risks = []

    for category in ['TECH', 'SEC', 'PERF', 'DATA', 'BUS', 'OPS']:
        # RAG retrieval of risk patterns for this category
        risk_patterns = self.retrieve_risk_patterns(
            category=category,
            story_context=story['description']
        )

        # Apply patterns to identify specific risks
        category_risks = self.apply_risk_patterns(
            patterns=risk_patterns,
            story=story
        )

        risks.extend(category_risks)

    return risks
```

**Rationale**: Risk identification benefits from knowledge base of historical patterns and domain expertise.

#### 3. Deterministic Risk Scoring Engine

**Requirement**: Consistent probability × impact calculation

**Vertex AI ADK Approach**:
- Implement as Cloud Function for fast, deterministic computation
- No LLM involved in scoring calculation (only in assessment justification)
- Ensure reproducibility and auditability

**Implementation**:
```python
@functions_framework.http
def calculate_risk_score(request):
    """Deterministic risk scoring function."""
    data = request.get_json()

    probability = data['probability']  # 1, 2, or 3
    impact = data['impact']  # 1, 2, or 3

    score = probability * impact

    # Determine priority level
    if score == 9:
        priority = "Critical"
    elif score == 6:
        priority = "High"
    elif score == 4:
        priority = "Medium"
    elif score in [2, 3]:
        priority = "Low"
    else:
        priority = "Minimal"

    return {
        "score": score,
        "priority": priority,
        "probability": probability,
        "impact": impact
    }
```

**Rationale**: Scoring must be deterministic and fast—perfect for Cloud Function.

#### 4. Gate Integration with Firestore

**Requirement**: Risk summary data must integrate with quality gate workflow

**Vertex AI ADK Approach**:
- Store risk_summary in Firestore as part of gate document
- Enable queries like "show all stories with Critical risks"
- Support gate decision calculation that includes risk data

**Firestore Schema**:
```javascript
// Collection: projects/{project_id}/gates/{story_id}
{
  schema: 1,
  story: "1.3",
  gate: "CONCERNS",
  risk_summary: {
    totals: {
      critical: 1,
      high: 2,
      medium: 3,
      low: 1
    },
    highest: {
      id: "SEC-001",
      score: 9,
      title: "XSS vulnerability"
    },
    recommendations: {
      must_fix: [
        "Add input sanitization & CSP"
      ],
      monitor: [
        "Track security alerts"
      ]
    }
  },
  updated: "2025-10-14T10:30:00Z"
}
```

**Rationale**: Structured data storage enables querying, reporting, and automated gate decision logic.

#### 5. Markdown Report Generation Service

**Requirement**: Generate comprehensive, well-formatted risk assessment reports

**Vertex AI ADK Approach**:
- Cloud Function that takes structured risk data and generates markdown
- Use Jinja2 templates for consistent formatting
- Store reports in Cloud Storage for version control and accessibility

**Implementation**:
```python
from jinja2 import Template

@functions_framework.http
def generate_risk_report(request):
    """Generate markdown risk assessment report."""
    data = request.get_json()

    # Load markdown template
    template = Template(RISK_REPORT_TEMPLATE)

    # Render with data
    markdown = template.render(
        story_id=data['story_id'],
        story_title=data['story_title'],
        date=data['date'],
        risks=data['risks'],
        risk_matrix=data['risk_matrix'],
        overall_score=data['overall_score']
    )

    # Save to Cloud Storage
    blob = bucket.blob(f"assessments/{data['story_id']}-risk-{date}.md")
    blob.upload_from_string(markdown)

    return {
        "report_url": blob.public_url,
        "report_path": blob.name
    }
```

**Rationale**: Separate service for report generation enables reusability and consistent formatting.

### Medium Priority Recommendations

#### 6. Risk Pattern Learning System

**Requirement**: Learn from past risk assessments to improve future identification

**Vertex AI ADK Approach**:
- Store all risk assessments in BigQuery
- Analyze patterns: "Stories with 'authentication' in title average 2.3 SEC risks"
- Use patterns to seed risk identification in future stories
- Enable queries like "Show most common Critical risks in this project"

**BigQuery Schema**:
```sql
CREATE TABLE risk_assessments (
  project_id STRING,
  story_id STRING,
  risk_id STRING,
  category STRING,
  score INT64,
  probability INT64,
  impact INT64,
  mitigation_type STRING,
  residual_risk STRING,
  assessment_date TIMESTAMP
);
```

#### 7. Risk Mitigation Template Library

**Requirement**: Reusable mitigation strategies for common risks

**Vertex AI ADK Approach**:
- Store mitigation templates in Firestore
- Retrieve relevant templates based on risk category and score
- Allow customization while providing proven starting point

**Example Template**:
```yaml
mitigation_template:
  risk_pattern: "SEC-XSS"
  strategy: "preventive"
  actions:
    - "Implement DOMPurify or similar sanitization library"
    - "Add Content Security Policy (CSP) headers"
    - "Use context-aware output escaping"
  testing_requirements:
    - "OWASP ZAP automated scanning"
    - "Manual penetration testing"
    - "Unit tests with XSS payload test cases"
  typical_residual_risk: "Low"
```

#### 8. Interactive Risk Assessment UI

**Requirement**: Allow users to review and adjust risk assessments

**Vertex AI ADK Approach**:
- Cloud Run web service for interactive risk assessment
- Display AI-identified risks
- Allow users to adjust probability/impact, add risks, modify mitigations
- Save final assessment back to Firestore and Cloud Storage

**UI Features**:
- Risk matrix visualization (probability × impact grid)
- Drag-and-drop risk prioritization
- Mitigation strategy editor
- Real-time gate decision preview

### Low Priority Recommendations

#### 9. Risk Trend Dashboard

**Requirement**: Track risk metrics across stories and sprints

**Vertex AI ADK Approach**:
- Looker Studio dashboard connected to BigQuery
- Metrics: Average risk score by sprint, most common risk categories, mitigation effectiveness
- Enable project-level risk management insights

#### 10. Automated Risk Re-assessment Triggers

**Requirement**: Re-run risk assessment when trigger conditions met

**Vertex AI ADK Approach**:
- Cloud Functions triggered by Firestore changes
- Example: When story file changes significantly, queue risk re-assessment
- Eventarc for event-driven architecture

**Trigger Examples**:
```python
# Firestore trigger
@functions_framework.cloud_event
def on_story_update(cloud_event):
    story_data = cloud_event.data

    # Check if update warrants risk re-assessment
    if should_reassess_risk(story_data):
        # Queue risk-profile workflow
        queue_risk_assessment(story_data['story_id'])
```

---

## 13. Critical Insights & Observations

### 1. Risk Assessment is Proactive Quality Assurance

**Insight**: Risk profiling shifts quality focus from reactive (finding bugs) to proactive (preventing issues).

**Evidence**:
- Identifies potential problems before implementation begins
- Mitigation strategies become implementation checklist
- Testing requirements inform test design upfront

**Implication for ADK**: Reasoning Engine workflow should support "pre-implementation" execution mode where story is analyzed before dev starts.

### 2. Probability × Impact Framework Enables Objectivity

**Insight**: Mathematical scoring removes subjective bias from risk prioritization.

**Evidence**:
- 3×3 matrix produces consistent scores across assessors
- Clear criteria for each probability/impact level
- Score directly maps to gate decision (deterministic)

**Implication for ADK**: Implement scoring as separate, auditable service (Cloud Function) distinct from LLM-based risk identification.

### 3. Risk Categories Provide Comprehensive Coverage

**Insight**: Six distinct categories (TECH, SEC, PERF, DATA, BUS, OPS) ensure no dimension is overlooked.

**Evidence**:
- Each category has specific subcategories and examples
- Different roles contribute expertise to different categories (Dev→TECH, QA→SEC, PM→BUS)
- Historical analysis shows most project issues fall into these six buckets

**Implication for ADK**: Organize risk identification RAG retrieval by category for focused, efficient risk enumeration.

### 4. Mitigation Strategies Must Be Actionable

**Insight**: Generic advice like "improve security" is useless; specific actions drive value.

**Evidence**:
- Each mitigation includes specific actions, tools, timeline, owner
- Testing requirements are concrete and measurable
- Residual risk assessment forces honest evaluation of mitigation effectiveness

**Implication for ADK**: Mitigation generation should retrieve specific, proven strategies from knowledge base rather than generic LLM responses.

### 5. Risk Assessment Integrates Across QA Workflow

**Insight**: Risk profile is not standalone; it feeds into gate decisions, test design, NFR assessment, and requirements traceability.

**Evidence**:
- Gate decision criteria explicitly includes risk thresholds
- Test design prioritizes scenarios based on risk levels
- NFR assessment validates risk mitigations are effective
- Traceability verifies high-risk areas have test coverage

**Implication for ADK**: Design Firestore schema to support cross-task data flow (risk_summary accessible to gate, test-design, trace, nfr-assess).

### 6. Residual Risk Tracking Enables Informed Acceptance

**Insight**: Not all risks can be eliminated; tracking residual risk enables informed decisions about deployment.

**Evidence**:
- After mitigation, residual risk is assessed and documented
- Accepted risks require justification and approval
- Monitoring requirements specified for accepted residual risks

**Implication for ADK**: Gate file schema should include `accepted_risks` section with approval tracking.

### 7. Evidence-Based Risk Identification Builds Credibility

**Insight**: Risks supported by concrete evidence (code review findings, architecture analysis) are taken seriously; speculative risks are dismissed.

**Evidence**:
- Each risk includes `detection_method` field
- References specific components, files, or requirements
- Cites previous incidents or known vulnerabilities when applicable

**Implication for ADK**: Risk identification should include citations to story sections, architecture docs, or known vulnerability databases.

### 8. Risk Score Deduction Model is Intuitive

**Insight**: Starting at 100 and deducting points for risks is more intuitive than summing risk scores.

**Evidence**:
- "100/100" clearly means "no risks"
- "60/100" clearly means "multiple high risks"
- Deduction model aligns with grading systems (A/B/C/D/F)

**Implication for ADK**: Preserve deduction-based scoring model in UI and reports for stakeholder clarity.

### 9. Risk Re-assessment Triggers Prevent Risk Drift

**Insight**: Risks evolve as stories change; defined triggers ensure risk profile stays current.

**Evidence**:
- Architecture changes can introduce new TECH risks
- New integrations can introduce SEC/DATA risks
- Security vulnerabilities discovered require immediate re-assessment

**Implication for ADK**: Implement event-driven architecture (Eventarc + Cloud Functions) to auto-trigger risk re-assessment on defined conditions.

### 10. LLM Acceleration Requires Systematic Frameworks

**Insight**: LLMs excel at risk identification when guided by structured frameworks; unstructured "find risks" prompts produce inconsistent results.

**Evidence**:
- Six risk categories with subcategories guide LLM enumeration
- Probability × impact rubrics enable consistent scoring
- Mitigation strategy templates provide starting structure

**Implication for ADK**: Reasoning Engine prompts should include risk category framework, scoring rubrics, and mitigation templates to guide LLM analysis.

### 11. Risk Assessment Supports Multiple Stakeholders

**Insight**: Same risk data serves different audiences (Dev team: mitigation actions, PM: deployment decisions, QA: testing focus).

**Evidence**:
- Executive summary for PM/stakeholders
- Detailed risk register for dev/QA
- Testing strategy for QA
- Monitoring requirements for ops

**Implication for ADK**: Design multiple report views/exports from same underlying risk data (executive dashboard, detailed report, test plan, monitoring config).

### 12. Gate Integration Must Be Deterministic

**Insight**: Automated gate decisions require clear, reproducible risk-to-gate mapping.

**Evidence**:
- Explicit rules: Critical risk → FAIL, High risk → CONCERNS, else PASS
- No ambiguity or subjective interpretation
- Waiver process is explicit (not implicit)

**Implication for ADK**: Implement gate decision engine as separate service with unit tests validating all decision paths.

---

## 14. Usage Patterns & Examples

### Pattern 1: Standalone Risk Assessment

**Scenario**: QA agent manually assesses risk before story implementation begins

**Command**: `*risk-profile 1.3`

**Execution Flow**:
1. User invokes `*risk-profile` with story ID
2. Task loads story file from `docs/stories/1.3.*.md`
3. Identifies risks across 6 categories
4. Assesses each risk (probability × impact)
5. Generates mitigations for Critical and High risks
6. Outputs gate YAML block and markdown report
7. Prints report path for reference

**Output**:
```
Risk Assessment Complete for Story 1.3

Risk Summary:
- Critical: 1 (SEC-001)
- High: 2 (PERF-001, DATA-001)
- Medium: 3
- Low: 1
- Overall Score: 65/100

Gate Recommendation: CONCERNS (1 Critical risk identified)

Outputs:
- Report: qa/assessments/1.3-risk-20251014.md
- Gate YAML: [Printed to console for manual pasting]

risk_summary:
  totals:
    critical: 1
    high: 2
    medium: 3
    low: 1
  highest:
    id: SEC-001
    score: 9
    title: 'XSS vulnerability on profile form'
  recommendations:
    must_fix:
      - 'Add input sanitization & CSP'
      - 'Implement rate limiting on auth endpoints'
    monitor:
      - 'Track query performance on dashboard'
```

**User Action**: Reviews report, addresses Critical risks before implementation begins

---

### Pattern 2: Risk Assessment as Part of Comprehensive Review

**Scenario**: QA agent executes comprehensive review which includes risk profiling

**Command**: `*review 1.3`

**Execution Flow**:
1. User invokes `*review` with story ID
2. Review task orchestrates multiple subtasks including `risk-profile`
3. Risk profile executes automatically (non-interactive)
4. Risk summary included in gate YAML generation
5. Risk report path referenced in QA Results section

**QA Results Section Output**:
```markdown
## QA Results

### Review Date: 2025-10-14

### Reviewed By: Quinn (Test Architect)

### Risk Assessment
**Overall Risk Score**: 65/100 (CONCERNS)

**Critical Risks** (1):
- [SEC-001] XSS vulnerability on profile form (Score: 9)
  - Mitigation: Add input sanitization & CSP (In Progress)

**High Risks** (2):
- [PERF-001] Dashboard query performance (Score: 6)
- [DATA-001] Backup validation gap (Score: 6)

**Risk Profile**: qa/assessments/1.3-risk-20251014.md

### Gate Status
Gate: CONCERNS → qa/gates/1.3-user-authentication.yml

Risk profile: qa/assessments/1.3-risk-20251014.md
Test design: qa/assessments/1.3-test-design-20251014.md
...
```

**User Action**: Reviews comprehensive QA results, addresses CONCERNS before deployment

---

### Pattern 3: Risk-Driven Test Design

**Scenario**: Test design task uses risk assessment to prioritize test scenarios

**Command Sequence**:
```
*risk-profile 1.3
*test-design 1.3
```

**Execution Flow**:
1. Risk profile identifies Critical risk: SEC-001 (XSS vulnerability)
2. Test design task reads risk assessment
3. Generates P0 security test scenarios aligned to SEC-001 mitigation
4. Prioritizes tests based on risk scores

**Test Design Output**:
```markdown
## Test Scenarios

### P0 Tests (Must Execute)

#### TS-001: XSS Vulnerability Validation (Aligned to SEC-001)
**Requirement**: AC1 - User can update profile bio
**Risk**: SEC-001 (Score 9 - Critical)
**Test Level**: Security + Unit
**Description**: Validate all user inputs are sanitized and CSP prevents script execution
**Test Cases**:
1. Inject `<script>alert('XSS')</script>` in bio field → Should be sanitized
2. Inject event handler `<img src=x onerror=alert(1)>` → Should be escaped
3. Verify CSP header blocks inline scripts → Should log CSP violation
4. Test HTML entities are properly escaped → Should render as text

**Priority**: P0 (Security - Critical risk mitigation)
**Risk Mitigation**: Validates SEC-001 mitigation effectiveness
```

**User Action**: Executes P0 tests first, verifies Critical risks are mitigated

---

### Pattern 4: Risk Re-assessment After Architecture Change

**Scenario**: Story scope changes to include new payment integration; risk must be re-assessed

**Command Sequence**:
```
*correct-course 1.3
  (User adds payment integration to story)
*risk-profile 1.3
```

**Execution Flow**:
1. Course correction updates story with payment integration requirements
2. Risk profile re-executed to assess new risks
3. New risks identified: SEC-002 (Payment data exposure), DATA-002 (Transaction integrity)
4. Overall risk score decreases from 65 to 40 (more critical risks)
5. Gate recommendation changes from CONCERNS to FAIL

**Updated Risk Summary**:
```yaml
risk_summary:
  totals:
    critical: 3  # Increased from 1
    high: 3      # Increased from 2
    medium: 4
    low: 1
  highest:
    id: SEC-002
    score: 9
    title: 'Payment card data exposure'
  recommendations:
    must_fix:
      - 'Implement PCI DSS compliant payment handling (use Stripe/Square SDK, never store card data)'
      - 'Add TLS 1.3 for payment API calls'
      - 'Implement transaction integrity checks'
      - 'Add input sanitization & CSP'  # Original SEC-001
    monitor:
      - 'Track payment API failures and retries'
      - 'Monitor transaction anomalies'
```

**Overall Score**: 40/100 (was 65/100)
**Gate Recommendation**: FAIL (was CONCERNS) - 3 Critical risks

**User Action**: Addresses Critical risks before proceeding, or requests waiver with executive approval

---

### Pattern 5: Risk Waiver for Accepted Technical Debt

**Scenario**: Medium risk identified (TECH-003: Legacy code refactoring), team decides to accept as technical debt

**Command**: `*risk-profile 2.5`

**Risk Assessment Finds**:
```yaml
risk:
  id: TECH-003
  category: technical
  title: 'Legacy authentication code not refactored'
  score: 4  # Medium
  probability: 2  # Medium - existing code works but is complex
  impact: 2  # Medium - harder to maintain, not a current failure
```

**User Decision**: Accept as technical debt, schedule refactoring for Sprint 8

**Gate File Entry**:
```yaml
risk_summary:
  totals:
    critical: 0
    high: 0
    medium: 1
    low: 2
  recommendations:
    must_fix: []
    monitor:
      - 'Track time spent on auth-related bugs (indicator of tech debt impact)'

accepted_risks:
  - risk_id: TECH-003
    title: 'Legacy authentication code not refactored'
    score: 4
    rationale: 'Functional and stable; refactoring scheduled for Sprint 8'
    approved_by: 'Tech Lead'
    approval_date: '2025-10-14'
    review_date: '2025-11-01'  # Sprint 8 start
```

**Gate Status**: PASS (no high/critical risks, medium risk accepted)

**User Action**: Deploys story, schedules refactoring work for Sprint 8

---

### Pattern 6: Multi-Category Risk Example (Full-Stack Story)

**Scenario**: Full-stack story (1.7) implementing user dashboard with real-time updates

**Command**: `*risk-profile 1.7`

**Risk Assessment Identifies Risks Across All 6 Categories**:

**TECH Risks**:
- TECH-001: WebSocket connection management complexity (Score: 4)
- TECH-002: State synchronization between client and server (Score: 6)

**SEC Risks**:
- SEC-001: WebSocket authentication token exposure (Score: 6)
- SEC-002: CSRF on REST endpoints (Score: 4)

**PERF Risks**:
- PERF-001: Dashboard query with 100K+ records slow (Score: 6)
- PERF-002: WebSocket message flood could overwhelm server (Score: 4)

**DATA Risks**:
- DATA-001: Race condition in concurrent updates (Score: 6)

**BUS Risks**:
- BUS-001: Real-time feature may not meet user needs if latency >2s (Score: 4)

**OPS Risks**:
- OPS-001: WebSocket connection monitoring gaps (Score: 4)
- OPS-002: Deployment requires zero-downtime strategy (Score: 6)

**Risk Summary**:
```yaml
risk_summary:
  totals:
    critical: 0
    high: 5  # TECH-002, SEC-001, PERF-001, DATA-001, OPS-002
    medium: 5
    low: 0
  highest:
    id: DATA-001
    score: 6
    title: 'Race condition in concurrent updates'
  recommendations:
    must_fix:
      - 'Implement optimistic locking for concurrent updates'
      - 'Add WebSocket authentication middleware'
      - 'Index dashboard query columns'
      - 'Add rate limiting for WebSocket messages'
      - 'Design blue-green deployment for WebSockets'
    monitor:
      - 'Track WebSocket connection counts'
      - 'Monitor dashboard query p95 latency'
      - 'Track concurrent update conflicts'
```

**Overall Score**: 50/100 (5 High risks)
**Gate Recommendation**: CONCERNS

**User Action**: Dev team addresses 5 High-priority mitigations before deployment

---

## 15. Comparison with Related Tasks

### risk-profile vs test-design

| Aspect | risk-profile | test-design |
|--------|--------------|-------------|
| **Purpose** | Identify what could go wrong | Define how to test requirements |
| **Focus** | Probability × Impact of problems | Coverage of acceptance criteria |
| **Output** | Risk matrix, mitigation strategies | Test scenarios, test levels |
| **Timing** | Before or during review | During review or before testing |
| **Drives** | Mitigation actions, risk-based testing | Test execution, coverage validation |
| **Integration** | Feeds into gate decision, informs test design | Uses risk profile to prioritize tests |

**Relationship**: Risk profile identifies high-risk areas → Test design creates specific test scenarios to validate those areas

---

### risk-profile vs nfr-assess

| Aspect | risk-profile | nfr-assess |
|--------|--------------|------------|
| **Purpose** | Identify potential risks | Validate NFRs are met |
| **Focus** | What could go wrong | What quality attributes exist |
| **Scope** | All 6 risk categories | 4-8 NFR dimensions |
| **Timing** | Proactive (before issues occur) | Reactive (after implementation) |
| **Output** | Risk matrix, mitigations | NFR status (PASS/CONCERNS/FAIL) |
| **Integration** | Identifies NFR gaps as risks | Validates risk mitigations work |

**Relationship**: Risk profile identifies potential NFR gaps (e.g., SEC-001 risk) → NFR assessment validates that security NFR is met (validates SEC-001 mitigation worked)

---

### risk-profile vs review-story

| Aspect | risk-profile | review-story |
|--------|--------------|---------------|
| **Purpose** | Assess implementation risks | Comprehensive quality review |
| **Scope** | Risk identification only | 6 quality dimensions including risks |
| **Depth** | Deep on risks | Broad across all quality attributes |
| **Output** | Risk report, gate YAML block | QA Results, gate file, multiple assessments |
| **Execution** | Subprocess or standalone | Orchestrates multiple subtasks |
| **Duration** | 5-15 minutes | 30-60 minutes |

**Relationship**: review-story orchestrates risk-profile as one of several subtasks (along with test-design, trace, nfr-assess, code quality, etc.)

---

## 16. Version History & Evolution Notes

### BMad Core v4 (Current)

**Features**:
- 6 risk categories (TECH, SEC, PERF, DATA, BUS, OPS)
- Probability × Impact scoring (3×3 matrix, 1-9 scale)
- Three mitigation types (Preventive, Detective, Corrective)
- Deterministic gate integration
- Residual risk tracking
- Risk-based testing strategy generation
- Output: Gate YAML block + Markdown report

**Key Design Decisions**:
- Mathematical scoring for objectivity
- Separate risk categories ensure comprehensive coverage
- Mitigation strategies must include testing requirements
- Risk score deduction model (100 - penalties) for intuitive interpretation

---

**Document Version**: 1.0
**Created**: 2025-10-14
**Author**: Claude Code (AI Agent)
**Task**: Phase 3, Task 3.3 - Risk Profile Task Analysis
**Project**: BMad Framework Reverse Engineering for Google Vertex AI ADK
