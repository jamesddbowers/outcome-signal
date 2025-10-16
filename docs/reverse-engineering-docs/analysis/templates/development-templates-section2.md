# Development Templates Analysis - Section 2: QA Gate Template Analysis

**Analysis Date**: 2025-10-14
**Analyzer**: Claude Code (AI Agent)
**Phase**: Phase 4, Task 4.3
**Document Version**: 1.0

---

## Table of Contents

- [Section 1: Introduction & Overview](development-templates-section1.md)
- [Section 2: QA Gate Template Analysis](#section-2-qa-gate-template-analysis) (This document)
- [Section 3: Test Scenario Format Analysis](development-templates-section3.md)
- [Section 4: Summary & ADK Translation](development-templates-section4.md)

---

## Section 2: QA Gate Template Analysis

### Template Identity

```yaml
template:
  id: qa-gate-template-v1
  name: Quality Gate Decision
  version: 1.0
```

**File Location**: `.bmad-core/templates/qa-gate-tmpl.yaml`
**File Size**: 103 lines
**Owner Agent**: QA Agent (Quinn - Test Architect)
**Output Format**: YAML (pure, not markdown)
**Primary Task**: qa-gate.md

### Template Metadata

#### Output Configuration

```yaml
output:
  format: yaml
  filename: qa.qaLocation/gates/{{epic_num}}.{{story_num}}-{{story_slug}}.yml
  title: "Quality Gate: {{epic_num}}.{{story_num}}"
```

**Output Path Breakdown**:
- **Base directory**: `qa.qaLocation` from `core-config.yaml` (typically `qa-docs/`)
- **Subdirectory**: `gates/` (dedicated directory for gate files)
- **Filename pattern**: `{epic}.{story}-{slug}.yml`
  - Example: `1.3-user-authentication.yml` (Epic 1, Story 3)
  - Slug derived from story title (lowercase, hyphenated)
- **File extension**: `.yml` (YAML format)

**Variable Interpolation**:
- `{{epic_num}}`: Epic number (e.g., "1")
- `{{story_num}}`: Story number within epic (e.g., "3")
- `{{story_slug}}`: URL-safe story identifier (e.g., "user-authentication")

### Template Structure Overview

The template defines a **two-tier structure**:

#### Tier 1: Required Core Fields (Lines 12-18)
Minimal viable gate file - always present, always populated.

#### Tier 2: Optional Extended Fields (Lines 52-103)
Additional fields for teams wanting deeper quality tracking.

This **progressive disclosure** design enables:
- **Quick adoption**: Teams can start with minimal fields
- **Gradual enhancement**: Add complexity as needs grow
- **Tool compatibility**: Simple parsers work with minimal fields
- **Advanced analytics**: Rich parsers leverage extended fields

### Tier 1: Required Core Fields

#### Field 1: `schema`

```yaml
schema: 1
```

**Purpose**: Version identifier for gate file format
**Type**: Integer
**Value**: `1` (current schema version)
**Usage**: Enables forward/backward compatibility as schema evolves

**Design Rationale**:
- **Future-proofing**: Schema version allows breaking changes without breaking parsers
- **Validation**: Tools can validate against correct schema version
- **Migration**: Automated migration between schema versions
- **Documentation**: Clear contract for file structure

**Example Evolution**:
```yaml
# Current
schema: 1  # Original format

# Future potential
schema: 2  # Multi-reviewer support
schema: 3  # Enhanced automation fields
```

#### Field 2: `story`

```yaml
story: "{{epic_num}}.{{story_num}}"
```

**Purpose**: Story identifier (primary key)
**Type**: String
**Format**: `{epic}.{story}` (e.g., "1.3")
**Required**: Yes

**Design Rationale**:
- **Unique identifier**: Links gate to specific story
- **Traceability**: Enables queries like "show all gates for epic 1"
- **File-independent**: Identifier embedded in file, not just filename
- **Validation**: Can verify filename matches content

**Usage Patterns**:
```bash
# Query all gates for a story
yq '.story' gates/*.yml | grep "1.3"

# Validate filename matches content
filename="1.3-auth.yml"
story_id=$(yq '.story' "gates/$filename")
# Expect: "1.3"
```

#### Field 3: `story_title`

```yaml
story_title: "{{story_title}}"
```

**Purpose**: Human-readable story title
**Type**: String
**Example**: "Implement user authentication with OAuth2"
**Required**: Yes

**Design Rationale**:
- **Readability**: Humans can understand what story is about without looking up
- **Reporting**: Dashboards show meaningful titles, not just IDs
- **Search**: Full-text search on titles
- **Context**: Gate file is self-contained with story context

#### Field 4: `gate`

```yaml
gate: "{{gate_status}}" # PASS|CONCERNS|FAIL|WAIVED
```

**Purpose**: Quality gate decision (primary outcome)
**Type**: String (enumerated)
**Values**: `PASS` | `CONCERNS` | `FAIL` | `WAIVED`
**Required**: Yes

**Value Definitions**:

```yaml
PASS:
  meaning: "All quality checks passed"
  action: "Proceed to done, ready for production"
  severity: "No issues"

CONCERNS:
  meaning: "Minor issues identified"
  action: "Proceed with monitoring/tracking"
  severity: "Low-impact issues that don't block release"

FAIL:
  meaning: "Critical issues identified"
  action: "Block progress, must fix before proceeding"
  severity: "High-impact issues that must be addressed"

WAIVED:
  meaning: "Issues identified but explicitly accepted"
  action: "Proceed per waiver approval"
  severity: "Issues acknowledged, acceptance documented"
```

**Decision Flow**:
```
QA Review Complete
    ↓
Issues identified?
    ↓
    ├─ No issues → PASS
    │
    ├─ Minor issues (low/medium severity) → CONCERNS
    │      ↓
    │  Track for future resolution
    │
    ├─ Critical issues (high severity) → FAIL
    │      ↓
    │  Block story completion
    │      ↓
    │  Dev fixes issues
    │      ↓
    │  QA re-reviews
    │
    └─ Issues but business accepts risk → WAIVED
           ↓
       Document waiver reason + approver
           ↓
       Proceed with caution
```

**Design Rationale**:
- **Four states**: Captures nuance between perfect and blocked
- **Action-oriented**: Each state implies clear next action
- **Risk-visible**: WAIVED preserves issue visibility
- **Automation-friendly**: Simple string matching for CI/CD

**Usage in CI/CD**:
```yaml
# Example GitHub Actions workflow
- name: Check Quality Gate
  run: |
    gate_status=$(yq '.gate' qa-docs/gates/${STORY}.yml)
    if [[ "$gate_status" == "FAIL" ]]; then
      echo "Quality gate FAILED - blocking deployment"
      exit 1
    elif [[ "$gate_status" == "CONCERNS" ]]; then
      echo "Quality gate CONCERNS - deploying with warnings"
      # Could post to Slack, create monitoring alert, etc.
    else
      echo "Quality gate $gate_status - proceeding"
    fi
```

#### Field 5: `status_reason`

```yaml
status_reason: "{{status_reason}}" # 1-2 sentence summary of why this gate decision
```

**Purpose**: Concise rationale for gate decision
**Type**: String (free-form text, 1-2 sentences)
**Required**: Yes

**Design Rationale**:
- **Transparency**: Decision rationale always documented
- **Quick context**: Readers understand why without reading full review
- **Executive summary**: Leaders get high-level view without details
- **Audit trail**: Decision documented for future reference

**Example Status Reasons**:

```yaml
# PASS example
status_reason: "All acceptance criteria met with comprehensive test coverage. Code quality exceeds standards with zero security concerns."

# CONCERNS example
status_reason: "Implementation is solid but missing integration tests for error scenarios. These can be added in next sprint without blocking release."

# FAIL example
status_reason: "Critical security vulnerability identified: authentication endpoint lacks rate limiting. Must be fixed before production deployment."

# WAIVED example
status_reason: "Known performance issue (2s load time) accepted for MVP. Product Owner approved waiver with plan to optimize in Sprint 3."
```

**Guidelines for Writing**:
- **Be specific**: State exactly what drove the decision
- **Be concise**: 1-2 sentences maximum
- **Include impact**: What's the consequence of the finding?
- **State next action**: What happens next based on this decision?

#### Field 6: `reviewer`

```yaml
reviewer: "Quinn (Test Architect)"
```

**Purpose**: Identity of QA agent/person who made gate decision
**Type**: String
**Default**: "Quinn (Test Architect)" (QA agent persona)
**Required**: Yes

**Design Rationale**:
- **Accountability**: Clear ownership of quality decision
- **Contact point**: Know who to ask questions
- **Multi-team support**: Could differentiate QA reviewers in large orgs
- **Audit trail**: Who made the decision

**Format Convention**:
```
{Name} ({Role})
```

Examples:
- "Quinn (Test Architect)" - Standard QA agent
- "Alex Chen (Security QA)" - Specialized security review
- "Sarah Park (Performance QA)" - Specialized performance review

**Future Enhancement Potential**:
```yaml
# v2.0 could support multiple reviewers
reviewers:
  - name: "Quinn (Test Architect)"
    focus: "Functional quality"
    decision: PASS
  - name: "Alex Chen (Security QA)"
    focus: "Security"
    decision: CONCERNS
  - name: "Sarah Park (Performance QA)"
    focus: "Performance"
    decision: PASS

# Aggregate decision logic
final_gate: CONCERNS  # Worst of all reviewer decisions
```

#### Field 7: `updated`

```yaml
updated: "{{iso_timestamp}}"
```

**Purpose**: Timestamp of gate decision
**Type**: String (ISO 8601 timestamp)
**Format**: `YYYY-MM-DDTHH:MM:SSZ` (e.g., "2025-01-12T10:30:00Z")
**Required**: Yes

**Design Rationale**:
- **Temporal ordering**: Know when decisions were made
- **Freshness**: Identify stale gates that need re-review
- **History**: Track how long stories sit in various states
- **Compliance**: Audit trail with precise timing

**Usage Patterns**:

```bash
# Find stale gates (older than 7 days)
find qa-docs/gates -name "*.yml" -mtime +7 -exec yq '.story + " - " + .updated' {} \;

# Track gate decision velocity
yq '.story + "," + .updated' gates/*.yml | sort -t, -k2

# Calculate average time from FAIL to PASS
# (requires gate history field)
```

**Timestamp Hygiene**:
- **Always UTC**: Avoid timezone confusion
- **ISO 8601**: Standard format for interoperability
- **Automated**: Task generates timestamp, not manual entry
- **Immutable**: Original timestamp preserved, history tracks changes

### Tier 1: Required Structural Fields

#### Field 8: `waiver`

```yaml
waiver: { active: false }
```

**Purpose**: Waiver status and details
**Type**: Object
**Default**: `{ active: false }` (no active waiver)
**Required**: Yes (structure always present)

**Full Waiver Structure** (when active):

```yaml
waiver:
  active: true
  reason: "Accepted for MVP release - will address in next sprint"
  approved_by: "Product Owner"
```

**Fields**:
- **active** (boolean): Is there an active waiver?
- **reason** (string): Why was the waiver granted?
- **approved_by** (string): Who approved the waiver?

**Design Rationale**:
- **Explicit opt-in**: Waiver must be actively set, not assumed
- **Documented approval**: Clear accountability for accepting risk
- **Searchable**: Can query all active waivers across project
- **Reversible**: Waiver can be removed when issue is resolved

**Waiver Workflow**:

```
QA identifies issue → Severity: High → Gate decision: FAIL
    ↓
Dev assesses effort to fix
    ↓
Product Owner assesses business impact
    ↓
Decision: Accept risk for now, fix later
    ↓
QA updates gate:
  gate: WAIVED
  waiver:
    active: true
    reason: "MVP timeline critical, issue has low probability of occurrence"
    approved_by: "John Smith (Product Owner)"
```

**Waiver Queries**:

```bash
# Find all active waivers
yq 'select(.waiver.active == true) | .story + ": " + .waiver.reason' gates/*.yml

# Report waived stories to leadership
echo "Active waivers in project:"
yq 'select(.waiver.active == true) | "- " + .story_title + " (approved by " + .waiver.approved_by + ")"' gates/*.yml
```

**Waiver Resolution**:

```yaml
# Original gate
gate: WAIVED
waiver:
  active: true
  reason: "Performance issue accepted for MVP"
  approved_by: "Product Owner"

# After fix in later sprint
gate: PASS
waiver:
  active: false  # Waiver no longer needed
# Could optionally track in history field that waiver was resolved
```

#### Field 9: `top_issues`

```yaml
top_issues: []
```

**Purpose**: List of significant issues identified during review
**Type**: Array of issue objects
**Default**: `[]` (empty array, no issues)
**Required**: Yes (structure always present)

**Full Issue Structure**:

```yaml
top_issues:
  - id: "SEC-001"
    severity: high  # ONLY: low|medium|high
    finding: "No rate limiting on login endpoint"
    suggested_action: "Add rate limiting middleware before production"
  - id: "TEST-001"
    severity: medium
    finding: "Missing integration tests for auth flow"
    suggested_action: "Add test coverage for critical paths"
```

**Issue Object Fields**:

**id** (string, required):
- **Purpose**: Unique identifier for the issue
- **Format**: `{CATEGORY}-{NUMBER}` (e.g., "SEC-001", "PERF-003")
- **Categories**:
  - `SEC` - Security issues
  - `PERF` - Performance issues
  - `TEST` - Testing gaps
  - `CODE` - Code quality issues
  - `ARCH` - Architecture concerns
  - `DATA` - Data integrity issues
  - `UX` - User experience problems
  - `DOC` - Documentation gaps

**severity** (string enum, required):
- **Purpose**: Issue severity for prioritization
- **Values**: `low` | `medium` | `high`
- **Definitions**:
  - `high`: Critical, must fix before production
  - `medium`: Important, should fix soon
  - `low`: Minor, can defer or accept

**finding** (string, required):
- **Purpose**: Description of what's wrong
- **Guidelines**:
  - Be specific and factual
  - State the problem, not opinion
  - Include evidence if available
  - Keep to 1-2 sentences

**suggested_action** (string, required):
- **Purpose**: Recommended remediation
- **Guidelines**:
  - Be actionable and specific
  - Include where to make changes if known
  - Suggest priority/timeline
  - Keep to 1-2 sentences

**Issue Severity Mapping to Gate Status**:

```
Issue Severity → Gate Decision Logic:

No issues → PASS

Only low severity issues → CONCERNS or PASS
  (judgment call based on quantity)

Medium severity issues → CONCERNS
  (acceptable if not too many)

Any high severity issue → FAIL
  (unless waived with approval)
```

**Example Issue Scenarios**:

```yaml
# Security issue (high severity)
- id: "SEC-001"
  severity: high
  finding: "SQL injection vulnerability in user search endpoint due to unsanitized input"
  suggested_action: "Use parameterized queries in services/user.service.ts:142"

# Performance issue (medium severity)
- id: "PERF-002"
  severity: medium
  finding: "Dashboard loads in 3.5 seconds due to N+1 query pattern"
  suggested_action: "Add eager loading for user.posts relationship"

# Test coverage gap (low severity)
- id: "TEST-003"
  severity: low
  finding: "Missing unit tests for edge case: empty string input to formatName()"
  suggested_action: "Add test in __tests__/utils.test.ts"

# Code quality concern (medium severity)
- id: "CODE-004"
  severity: medium
  finding: "Circular dependency between UserService and AuthService"
  suggested_action: "Extract shared interfaces to separate file"
```

**Issue Tracking Integration**:

The issue ID format enables integration with external issue trackers:

```yaml
# Could link to JIRA, GitHub Issues, etc.
- id: "JIRA-1234"
  severity: high
  finding: "See JIRA-1234 for details"
  suggested_action: "Implement fix per design in JIRA ticket"
```

Or maintain simple internal tracking:

```yaml
# Internal ID for tracking in gate history
- id: "1.3-SEC-001"
  severity: high
  finding: "..."
  suggested_action: "..."
```

#### Field 10: `risk_summary`

```yaml
risk_summary:
  totals: { critical: 0, high: 0, medium: 0, low: 0 }
  recommendations:
    must_fix: []
    monitor: []
```

**Purpose**: Summary of risk profile findings (from risk-profile task)
**Type**: Object
**Required**: Yes (structure always present)
**Source**: Populated from `{story}-risk-{date}.md` if it exists

**Structure Breakdown**:

**totals** (object):
- **Purpose**: Count of risks by severity level
- **Fields**:
  - `critical`: Risk score 7-9 (high probability × high impact)
  - `high`: Risk score 5-6
  - `medium`: Risk score 3-4
  - `low`: Risk score 1-2
- **Note**: Derived from risk-profile task's probability × impact matrix (1-3 × 1-3 = 1-9)

**recommendations** (object):
- **Purpose**: Actionable risk mitigation recommendations
- **Fields**:
  - `must_fix`: Risks requiring immediate mitigation before release
  - `monitor`: Risks to track but acceptable for release

**Example with Risk Data**:

```yaml
risk_summary:
  totals:
    critical: 1  # One P=3 × I=3 = 9 risk
    high: 2      # Two P=2 × I=3 = 6 risks
    medium: 3    # Three P=2 × I=2 = 4 risks
    low: 5       # Five P=1 × I=2 = 2 risks
  recommendations:
    must_fix:
      - "RISK-SEC-001: Add rate limiting to prevent brute force attacks"
      - "RISK-DATA-002: Implement transaction rollback for payment failures"
    monitor:
      - "RISK-PERF-003: Dashboard load time may degrade with >1000 users"
      - "RISK-UX-004: Mobile layout may be suboptimal on small devices"
```

**Risk-to-Gate Mapping**:

```
Risk Profile → Gate Decision Influence:

critical > 0 → Strong indicator for FAIL
  (unless comprehensive mitigation in place)

high > 3 → Indicator for CONCERNS
  (multiple high risks increase overall project risk)

medium/low only → Likely PASS or CONCERNS
  (acceptable risk level)
```

**Integration with Test Design**:

Risk summary links to test scenarios:

```yaml
# From risk-profile task
risk_summary:
  must_fix: ["RISK-SEC-001: Rate limiting needed"]

# From test-design task
test_scenario:
  id: "1.3-INT-005"
  mitigates_risks: ["RISK-SEC-001"]
  description: "Verify rate limiting blocks >5 login attempts/minute"
  priority: P0
```

This creates **traceability**: Risk identified → Test designed → Issue tracked → Gate decides

**Empty Risk Summary** (default):

```yaml
risk_summary:
  totals: { critical: 0, high: 0, medium: 0, low: 0 }
  recommendations:
    must_fix: []
    monitor: []
```

This indicates:
- No risk-profile task was run, OR
- Risk profile was run but no risks identified (perfect scenario)

### Tier 2: Optional Extended Fields

The template includes extensive examples of optional fields that teams can add. These are **not required** but provide **enhanced tracking** for teams with mature quality processes.

#### Optional Field: `quality_score`

```yaml
quality_score: 75  # 0-100 (optional scoring)
```

**Purpose**: Numeric quality score for analytics
**Type**: Integer (0-100)
**Usage**: Aggregate quality metrics across stories

**Calculation Examples**:

```python
# Simple weighted average
quality_score = (
    (test_coverage * 0.3) +
    (code_quality_rating * 0.3) +
    (requirements_met_pct * 0.2) +
    (nfr_score * 0.2)
)

# Or simpler: issues-based
quality_score = 100 - (high_issues * 15 + medium_issues * 5 + low_issues * 1)
```

**Analytics Usage**:

```bash
# Calculate project average quality score
yq '.quality_score // 0' gates/*.yml | awk '{sum+=$1} END {print sum/NR}'

# Identify below-threshold stories
yq 'select(.quality_score < 70) | .story + ": " + (.quality_score|tostring)' gates/*.yml
```

#### Optional Field: `expires`

```yaml
expires: "2025-01-26T00:00:00Z"  # Optional gate freshness window
```

**Purpose**: Gate expiration date (for re-review trigger)
**Type**: String (ISO 8601 timestamp)
**Usage**: Long-lived branches or pre-release validation

**Use Cases**:

**Scenario 1: Long-Lived Feature Branch**
```yaml
# Story completed but branch not merged for 2 weeks
expires: "2025-02-01T00:00:00Z"  # Re-review if not merged by this date
```

**Scenario 2: Pre-Release Validation**
```yaml
# MVP release gate valid for 30 days
expires: "2025-03-15T00:00:00Z"  # Must re-validate if release delayed
```

**Automated Expiry Checking**:

```bash
#!/bin/bash
# Check for expired gates
current_date=$(date -u +%Y-%m-%dT%H:%M:%SZ)
yq 'select(.expires != null and .expires < "'$current_date'") |
    "EXPIRED: " + .story + " (expired " + .expires + ")"' gates/*.yml
```

#### Optional Field: `evidence`

```yaml
evidence:
  tests_reviewed: 15
  risks_identified: 3
  trace:
    ac_covered: [1, 2, 3]  # AC numbers with test coverage
    ac_gaps: [4]  # AC numbers lacking coverage
```

**Purpose**: Quantitative evidence supporting gate decision
**Type**: Object

**Fields**:
- **tests_reviewed**: Number of test scenarios examined
- **risks_identified**: Number of risks from risk profile
- **trace**: Requirements traceability data
  - **ac_covered**: List of AC numbers with test coverage
  - **ac_gaps**: List of AC numbers without adequate tests

**Example**:

```yaml
evidence:
  tests_reviewed: 23
  risks_identified: 7
  trace:
    ac_covered: [1, 2, 3, 4, 5, 6, 7, 8]  # All 8 ACs covered
    ac_gaps: []  # No gaps - 100% coverage
```

**Gap Reporting**:

```bash
# Find stories with AC coverage gaps
yq 'select(.evidence.trace.ac_gaps | length > 0) |
    .story + " missing AC: " + (.evidence.trace.ac_gaps|join(","))' gates/*.yml
```

#### Optional Field: `nfr_validation`

```yaml
nfr_validation:
  security: { status: CONCERNS, notes: "Rate limiting missing" }
  performance: { status: PASS, notes: "" }
  reliability: { status: PASS, notes: "" }
  maintainability: { status: PASS, notes: "" }
```

**Purpose**: Non-functional requirements assessment results
**Type**: Object (keyed by NFR category)
**Source**: Populated from nfr-assess task

**Categories**:
- **security**: Authentication, authorization, data protection, vulnerabilities
- **performance**: Response times, throughput, resource usage
- **reliability**: Error handling, fault tolerance, recovery
- **maintainability**: Code quality, documentation, test coverage

**Status Values**: `PASS` | `CONCERNS` | `FAIL` (parallels gate status)

**Example with Issues**:

```yaml
nfr_validation:
  security:
    status: CONCERNS
    notes: "Rate limiting missing on auth endpoint (SEC-001)"
  performance:
    status: PASS
    notes: "All endpoints < 200ms response time"
  reliability:
    status: CONCERNS
    notes: "No retry logic for external API calls"
  maintainability:
    status: PASS
    notes: "Code coverage 87%, well-documented"
```

**NFR-to-Gate Mapping**:

```
Any NFR FAIL → Gate FAIL
Multiple NFR CONCERNS → Gate CONCERNS
All NFR PASS → Gate likely PASS
```

#### Optional Field: `history`

```yaml
history:  # Append-only audit trail
  - at: "2025-01-12T10:00:00Z"
    gate: FAIL
    note: "Initial review - missing tests"
  - at: "2025-01-12T15:00:00Z"
    gate: CONCERNS
    note: "Tests added but rate limiting still missing"
  - at: "2025-01-13T09:00:00Z"
    gate: PASS
    note: "Rate limiting implemented, all issues resolved"
```

**Purpose**: Audit trail of gate status changes
**Type**: Array of history entries (append-only)

**History Entry Fields**:
- **at**: Timestamp of status change
- **gate**: Gate status at that time
- **note**: Brief description of what changed

**Design Rationale**:
- **Append-only**: Never delete history, only add
- **Full audit trail**: See entire quality journey of story
- **Metrics**: Calculate time-in-state (FAIL → CONCERNS → PASS)
- **Learning**: Understand common quality issues and resolution patterns

**History Analytics**:

```bash
# Calculate average time from FAIL to PASS
# (requires more complex parsing)

# Count stories that failed initially
yq 'select(.history[0].gate == "FAIL") | .story' gates/*.yml | wc -l

# Find stories with many iterations
yq 'select(.history | length > 3) | .story + " had " + (.history|length|tostring) + " reviews"' gates/*.yml
```

#### Optional Field: `recommendations`

```yaml
recommendations:
  immediate:  # Must fix before production
    - action: "Add rate limiting to auth endpoints"
      refs: ["api/auth/login.ts:42-68"]
  future:  # Can be addressed later
    - action: "Consider caching for better performance"
      refs: ["services/data.service.ts"]
```

**Purpose**: Actionable recommendations from QA review
**Type**: Object with immediate and future arrays

**Categories**:
- **immediate**: Must fix before production (blocks gate)
- **future**: Should fix in future sprints (tech debt)

**Recommendation Entry Fields**:
- **action**: What should be done
- **refs**: Code references (file paths, line numbers)

**Example**:

```yaml
recommendations:
  immediate:
    - action: "Implement input validation for email field"
      refs: ["api/users/create.ts:89", "validators/user.validator.ts"]
    - action: "Add error boundary to prevent app crash"
      refs: ["components/Dashboard.tsx"]
  future:
    - action: "Refactor UserService to remove God Object anti-pattern"
      refs: ["services/user.service.ts"]
    - action: "Add pagination to user list endpoint"
      refs: ["api/users/list.ts"]
```

**Tech Debt Tracking**:

```bash
# Extract all future recommendations as tech debt backlog
yq '.story + "|" + .recommendations.future[].action' gates/*.yml > tech-debt.csv
```

### Template Examples Section (Lines 34-50)

The template includes **inline examples** to guide usage:

#### Example 1: Gate with Issues

```yaml
examples:
  with_issues: |
    top_issues:
      - id: "SEC-001"
        severity: high  # ONLY: low|medium|high
        finding: "No rate limiting on login endpoint"
        suggested_action: "Add rate limiting middleware before production"
      - id: "TEST-001"
        severity: medium
        finding: "Missing integration tests for auth flow"
        suggested_action: "Add test coverage for critical paths"
```

**Purpose**: Show how to document issues with proper structure

#### Example 2: Waiver Activation

```yaml
when_waived: |
  waiver:
    active: true
    reason: "Accepted for MVP release - will address in next sprint"
    approved_by: "Product Owner"
```

**Purpose**: Show how to document waivers properly

### Optional Fields Examples (Lines 55-103)

The template provides **comprehensive examples** of all optional fields, demonstrating:
- Proper YAML syntax
- Expected value formats
- Usage scenarios
- Integration patterns

This **example-driven documentation** approach:
- **Reduces errors**: Copy-paste correct examples
- **Self-documenting**: No separate docs needed
- **Discoverable**: All options visible in template
- **Gradual adoption**: Teams add fields as needed

### Template Design Patterns

#### Pattern 1: **Required Field Defaults**

All required fields have default values to ensure valid files:

```yaml
schema: 1
story: "{{epic_num}}.{{story_num}}"
gate: "{{gate_status}}"
waiver: { active: false }  # ← Default to no waiver
top_issues: []             # ← Default to no issues
risk_summary:
  totals: { critical: 0, high: 0, medium: 0, low: 0 }  # ← Default to no risks
  recommendations:
    must_fix: []
    monitor: []
```

This ensures **always-valid YAML** even if task fails partway through.

#### Pattern 2: **Block Scalars for Multi-line Content**

Examples use block scalar syntax (`|`) for readability:

```yaml
examples:
  with_issues: |
    top_issues:
      - id: "SEC-001"
        severity: high
```

This is **documentation syntax**, not actual file syntax. Generated files use standard YAML.

#### Pattern 3: **Comments as Constraints**

Template uses comments to document constraints:

```yaml
gate: "{{gate_status}}" # PASS|CONCERNS|FAIL|WAIVED
severity: high  # ONLY: low|medium|high
```

These serve as:
- **Validation rules**: What values are allowed
- **Documentation**: Explain field purpose
- **Tooling hints**: Parsers can extract constraints

#### Pattern 4: **Progressive Disclosure**

Template structure:

```
Lines 12-30:  Required fields (always present)
Lines 34-50:  Basic examples (common usage)
Lines 52-103: Optional fields (advanced usage)
```

This ordering:
- **Minimizes cognitive load**: Simple first, complex later
- **Supports adoption**: Start simple, add complexity
- **Clear boundaries**: Required vs optional is obvious

### Validation Rules

#### Structural Validation

**Schema version**:
- Must be present
- Must be integer
- Current valid value: `1`

**Story identifier**:
- Must match format `{digit}+.{digit}+`
- Example valid: "1.3", "12.42"
- Example invalid: "epic1.story3", "1"

**Gate status**:
- Must be one of: `PASS`, `CONCERNS`, `FAIL`, `WAIVED`
- Case-sensitive (all caps)

**Timestamps**:
- Must be ISO 8601 format
- Must be UTC (Z suffix)
- Example: "2025-01-12T10:30:00Z"

#### Semantic Validation

**Gate-Issue Consistency**:
```yaml
# Invalid: PASS with high severity issues
gate: PASS
top_issues:
  - severity: high  # ← Should be FAIL or WAIVED

# Valid: CONCERNS with medium issues
gate: CONCERNS
top_issues:
  - severity: medium
```

**Waiver Activation**:
```yaml
# Invalid: WAIVED without active waiver
gate: WAIVED
waiver: { active: false }  # ← Should be active: true

# Valid: WAIVED with documented waiver
gate: WAIVED
waiver:
  active: true
  reason: "MVP deadline"
  approved_by: "PO"
```

**Issue Severity Vocabulary**:
```yaml
# Invalid: Non-standard severity
top_issues:
  - severity: critical  # ← Not in vocabulary

# Valid: Standard severity
top_issues:
  - severity: high  # ← One of: low|medium|high
```

### File Naming Conventions

**Pattern**: `{epic}.{story}-{slug}.yml`

**Components**:
- **epic**: Epic number (e.g., "1", "12")
- **story**: Story number within epic (e.g., "3", "42")
- **slug**: URL-safe story title (lowercase, hyphenated)

**Examples**:
```
1.3-user-authentication.yml
2.15-payment-processing.yml
3.8-admin-dashboard.yml
```

**Slug Generation**:
```python
def generate_slug(title: str) -> str:
    """Convert story title to URL-safe slug."""
    return title.lower() \
                .replace(" ", "-") \
                .replace("_", "-") \
                .replace("/", "-") \
                .replace(":", "") \
                .replace("(", "") \
                .replace(")", "")

# Example
title = "Implement User Authentication (OAuth2)"
slug = generate_slug(title)  # "implement-user-authentication-oauth2"
```

### Integration with QA Tasks

The qa-gate template is populated by the **qa-gate.md task**, which:

#### Step 1: Gather Inputs
- Load story file for story_id, story_title
- Load review-story.md assessment for findings
- Load risk-profile.md assessment for risk_summary
- Load test-design.md for test coverage evidence
- Load nfr-assess.md for NFR validation

#### Step 2: Synthesize Decision
- Analyze all findings
- Determine gate status based on severity
- Generate status_reason (1-2 sentence summary)
- Extract top 3-5 issues for top_issues array

#### Step 3: Populate Template
- Load qa-gate-tmpl.yaml
- Replace all `{{variables}}` with actual values
- Add optional fields if data available
- Validate structure

#### Step 4: Write Gate File
- Write to `qa.qaLocation/gates/{story}.yml`
- Timestamp generation (ISO 8601 UTC)
- File permissions (readable by CI/CD)

#### Step 5: Notify Stakeholders
- Update story status based on gate
- Notify Dev agent if FAIL
- Notify PM/PO with gate summary
- Trigger next workflow step

### ADK Translation Considerations

#### Schema Enforcement

**Firestore Collection**: `projects/{project}/gates/{story_id}`

**Document Schema**:
```typescript
interface QualityGate {
  schema: number;
  story: string;  // "1.3"
  story_title: string;
  gate: 'PASS' | 'CONCERNS' | 'FAIL' | 'WAIVED';
  status_reason: string;
  reviewer: string;
  updated: Timestamp;

  waiver: {
    active: boolean;
    reason?: string;
    approved_by?: string;
  };

  top_issues: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high';
    finding: string;
    suggested_action: string;
  }>;

  risk_summary: {
    totals: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    recommendations: {
      must_fix: string[];
      monitor: string[];
    };
  };

  // Optional fields
  quality_score?: number;
  expires?: Timestamp;
  evidence?: {...};
  nfr_validation?: {...};
  history?: Array<{...}>;
  recommendations?: {...};
}
```

#### Cloud Function: Generate Gate

```python
@functions_framework.http
def generate_quality_gate(request):
    """Generate quality gate from QA assessment data."""

    # Extract parameters
    project_id = request.json['project_id']
    story_id = request.json['story_id']

    # Gather assessment data
    review_doc = firestore.get(f'projects/{project_id}/assessments/{story_id}-review')
    risk_doc = firestore.get(f'projects/{project_id}/assessments/{story_id}-risk')

    # Synthesize gate decision
    gate_status = determine_gate_status(review_doc, risk_doc)

    # Populate gate document
    gate = {
        'schema': 1,
        'story': story_id,
        'story_title': review_doc['story_title'],
        'gate': gate_status,
        'status_reason': generate_status_reason(review_doc, risk_doc),
        'reviewer': 'Quinn (Test Architect)',
        'updated': datetime.now(timezone.utc),
        'waiver': {'active': False},
        'top_issues': extract_top_issues(review_doc),
        'risk_summary': extract_risk_summary(risk_doc),
    }

    # Write to Firestore
    firestore.set(f'projects/{project_id}/gates/{story_id}', gate)

    # Trigger next workflow step
    if gate_status in ['PASS', 'CONCERNS']:
        workflow.trigger('story-complete', story_id)
    else:
        workflow.trigger('apply-qa-fixes', story_id)

    return {'gate': gate, 'status': 'created'}
```

#### Cloud Build Integration

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    id: 'check-quality-gate'
    script: |
      # Fetch gate status from Firestore
      gate_status=$(gcloud firestore documents get \
        projects/$PROJECT_ID/gates/$STORY_ID \
        --format='value(gate)')

      if [ "$gate_status" == "FAIL" ]; then
        echo "Quality gate FAILED - blocking deployment"
        exit 1
      elif [ "$gate_status" == "CONCERNS" ]; then
        echo "Quality gate CONCERNS - deploying with warnings"
        # Could send alert to Slack, PagerDuty, etc.
      else
        echo "Quality gate $gate_status - proceeding with deployment"
      fi
```

#### Dashboard Queries

**Gate Status Summary**:
```javascript
// Query all gates for project
const gatesSnapshot = await firestore
  .collection(`projects/${projectId}/gates`)
  .get();

const summary = {
  total: gatesSnapshot.size,
  pass: 0,
  concerns: 0,
  fail: 0,
  waived: 0,
};

gatesSnapshot.forEach(doc => {
  const gate = doc.data();
  summary[gate.gate.toLowerCase()]++;
});

// {total: 42, pass: 35, concerns: 5, fail: 1, waived: 1}
```

**Active Waivers Report**:
```javascript
// Query all active waivers
const waiversSnapshot = await firestore
  .collection(`projects/${projectId}/gates`)
  .where('waiver.active', '==', true)
  .get();

const waivers = waiversSnapshot.docs.map(doc => {
  const gate = doc.data();
  return {
    story: gate.story,
    title: gate.story_title,
    reason: gate.waiver.reason,
    approver: gate.waiver.approved_by,
  };
});
```

**Quality Trend Analysis**:
```javascript
// Calculate quality score trend over time
const gatesSnapshot = await firestore
  .collection(`projects/${projectId}/gates`)
  .orderBy('updated', 'desc')
  .limit(30)
  .get();

const trend = gatesSnapshot.docs.map(doc => {
  const gate = doc.data();
  return {
    date: gate.updated.toDate(),
    score: gate.quality_score || calculateScore(gate),
    story: gate.story,
  };
});

// Plot trend line for executive dashboard
```

---

## Summary

The qa-gate template is a **mature, well-designed** quality gate structure that:

### Key Strengths
1. **Simple core, rich extensions**: Required fields minimal, optional fields comprehensive
2. **Four-state model**: PASS/CONCERNS/FAIL/WAIVED captures nuance
3. **Audit-ready**: Timestamps, rationale, approvals all tracked
4. **Automation-friendly**: YAML format, fixed vocabulary, predictable structure
5. **Risk-integrated**: Links to risk assessment for comprehensive view
6. **Example-driven**: Inline examples reduce errors and improve adoption

### Primary Use Cases
- **Gate decisions**: Final quality checkpoint before story completion
- **Issue tracking**: Document findings with severity and recommendations
- **Waiver management**: Explicitly accept risk with accountability
- **Quality metrics**: Aggregate data for program-level visibility
- **CI/CD integration**: Automated deployment gates based on quality

### ADK Translation Needs
- **Firestore schema**: Store gates as documents for querying
- **Cloud Function**: Automated gate generation from assessment data
- **Cloud Build integration**: Deployment gates based on gate status
- **Dashboard queries**: Real-time quality visibility
- **Alert triggers**: Notify stakeholders on FAIL or new waivers

---

**Next Section**: [Test Scenario Format Analysis →](development-templates-section3.md)
