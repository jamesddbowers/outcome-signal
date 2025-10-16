# Development Templates Analysis - Section 1: Introduction & Overview

**Analysis Date**: 2025-10-14
**Analyzer**: Claude Code (AI Agent)
**Phase**: Phase 4, Task 4.3
**Document Version**: 1.0

---

## Table of Contents

- [Section 1: Introduction & Overview](#section-1-introduction--overview) (This document)
- [Section 2: QA Gate Template Analysis](development-templates-section2.md)
- [Section 3: Test Scenario Format Analysis](development-templates-section3.md)
- [Section 4: Summary & ADK Translation](development-templates-section4.md)

---

## Section 1: Introduction & Overview

### Purpose

This document provides comprehensive analysis of the BMad framework's **Development Templates**, which are the specialized templates used during the development and quality assurance phases of software projects. These templates encode quality gates, test scenarios, and validation structures that ensure consistent quality standards across all development work.

### Scope

This analysis covers **2 development templates and 1 embedded format**:

1. **qa-gate-tmpl.yaml** (v1.0) - Quality Gate Decision Structure
2. **Test Scenario Format** - Embedded in test-design task (not a standalone template file)
3. **Supporting Data Files**:
   - test-levels-framework.md - Unit/Integration/E2E decision criteria
   - test-priorities-matrix.md - P0/P1/P2/P3 classification system

### Templates Overview Table

| Template ID | Name | Version | Owner Agent | Primary Purpose | Output File | Lines |
|-------------|------|---------|-------------|-----------------|-------------|-------|
| qa-gate-template-v1 | Quality Gate Decision | 1.0 | QA (Quinn) | Record quality gate decisions (PASS/CONCERNS/FAIL/WAIVED) | qa.qaLocation/gates/{epic}.{story}-{slug}.yml | 103 |
| test-scenario-format | Test Scenario Structure | (embedded) | QA (Quinn) | Define individual test scenarios with level, priority, justification | Used in test-design task output | ~10 |

**Total Lines**: 103 lines (qa-gate template) + embedded format definitions

### Key Template Characteristics

#### 1. **Output-Focused Templates**

Unlike planning templates (which support interactive elicitation), development templates are **output-focused**:
- No interactive workflow configuration
- No elicitation directives
- Designed to be populated programmatically by QA tasks
- Focus on structured data capture for automation and reporting

#### 2. **YAML-First Format**

Development templates generate **pure YAML** output (not markdown with YAML front matter):
- Structured, machine-readable format
- Ideal for CI/CD pipeline integration
- Easy to parse and query programmatically
- Supports automated quality checks and reporting

**Example Structure**:
```yaml
template:
  id: qa-gate-template-v1
  name: Quality Gate Decision
  version: 1.0
  output:
    format: yaml  # ← Pure YAML, not markdown
    filename: qa.qaLocation/gates/{{epic_num}}.{{story_num}}-{{story_slug}}.yml
```

#### 3. **Gate-Driven Quality Management**

The qa-gate template implements a **four-state quality gate model**:

```
┌──────────────────────────────────────────────────────────┐
│                    Gate Statuses                         │
├──────────────────────────────────────────────────────────┤
│  PASS      → All quality checks passed, ready for prod   │
│  CONCERNS  → Minor issues, can proceed with monitoring   │
│  FAIL      → Critical issues, cannot proceed             │
│  WAIVED    → Issues acknowledged, proceed per approval   │
└──────────────────────────────────────────────────────────┘
```

This simple yet powerful model enables:
- **Clear decision points**: Binary gate outcomes with nuance
- **Risk visibility**: Issues tracked even when waived
- **Process flexibility**: Waiver mechanism for pragmatic decisions
- **Audit trail**: Gate history and decision rationale preserved

#### 4. **Severity-Based Issue Classification**

Issues use a **fixed 3-level severity scale**:
- **high**: Critical issues that must be addressed immediately
- **medium**: Important issues that should be addressed soon
- **low**: Minor issues that can be deferred

**Design Rationale**:
- Simple, unambiguous scale (no "critical" vs "high" confusion)
- Aligns with standard industry practices
- Easy to map to CI/CD pipeline actions (fail builds on "high")
- Sufficient granularity for most projects

#### 5. **Risk Integration**

The qa-gate template integrates with the **risk-profile task**:

```yaml
risk_summary:
  totals: { critical: 0, high: 0, medium: 0, low: 0 }
  recommendations:
    must_fix: []
    monitor: []
```

This enables:
- **Risk-aware quality decisions**: Gate decisions informed by risk assessment
- **Traceability**: Link test coverage to identified risks
- **Proactive risk mitigation**: Address high-risk areas before they become issues
- **Executive visibility**: Risk metrics rolled up to program level

#### 6. **Test Scenario Structure**

Test scenarios follow a **disciplined structure**:

```yaml
test_scenario:
  id: '{epic}.{story}-{LEVEL}-{SEQ}'      # e.g., "1.3-UNIT-001"
  requirement: 'AC reference'              # Traceability to acceptance criteria
  priority: P0|P1|P2|P3                    # Test priority (must/should/nice/optional)
  level: unit|integration|e2e              # Test level (shift-left principle)
  description: 'What is being tested'      # Clear test intent
  justification: 'Why this level was chosen'  # Decision rationale
  mitigates_risks: ['RISK-001']            # Link to risk profile (optional)
```

**Key Design Principles**:
- **Traceability**: Every test maps to a requirement (AC)
- **Priority-driven**: Focus effort on high-value tests (P0/P1)
- **Level justification**: Force thoughtful test level selection
- **Risk-based**: Link tests to identified risks for comprehensive coverage
- **Unique IDs**: Enable tracking, reporting, and automation

### Template Workflow Types

| Template | Workflow Mode | Generation Method | User Interaction Level |
|----------|---------------|-------------------|------------------------|
| qa-gate-tmpl | (none - output only) | Programmatic (QA tasks) | None - automated generation |
| test-scenario-format | (none - embedded) | Structured within test-design.md task | None - task-driven generation |

### Template Dependencies & Flow

```
Story Development
        ↓
┌─────────────────────────┐
│  story-tmpl.yaml        │ (SM creates story from epic)
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│  Dev implements         │ (Dev agent executes story)
└─────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│              QA Quality Assessment                      │
├─────────────────────────────────────────────────────────┤
│  risk-profile.md task → Identifies risks                │
│       ↓                                                  │
│  test-design.md task → Creates test scenarios           │
│       ↓                 (uses test-scenario format)      │
│  trace-requirements.md → Maps tests to requirements     │
│       ↓                                                  │
│  nfr-assess.md → Validates non-functional requirements  │
│       ↓                                                  │
│  review-story.md → Comprehensive review + refactoring   │
│       ↓                                                  │
│  qa-gate.md task → Makes final gate decision            │
│       ↓                 (generates qa-gate-tmpl.yaml)    │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────┐
│  Quality Gate File      │
│  gates/{story}.yml      │ (PASS/CONCERNS/FAIL/WAIVED)
└─────────────────────────┘
        ↓
    Gate Decision
        ↓
    ┌────────┴────────┐
    ↓                 ↓
  PASS/CONCERNS     FAIL
    ↓                 ↓
  Story Done    apply-qa-fixes.md
                    ↓
                Re-review
```

### Development Phase Template Ecosystem

The development templates are part of a larger QA ecosystem:

#### **Assessment Documents** (Markdown)
Generated by QA tasks, stored in `qa.qaLocation/assessments/`:
- `{epic}.{story}-risk-{YYYYMMDD}.md` - Risk assessment (from risk-profile task)
- `{epic}.{story}-test-design-{YYYYMMDD}.md` - Test scenarios (from test-design task)
- `{epic}.{story}-trace-{YYYYMMDD}.md` - Requirements traceability (from trace-requirements task)
- `{epic}.{story}-nfr-{YYYYMMDD}.md` - NFR validation (from nfr-assess task)
- `{epic}.{story}-review-{YYYYMMDD}.md` - Comprehensive review (from review-story task)

#### **Gate Files** (YAML)
Generated by qa-gate task, stored in `qa.qaLocation/gates/`:
- `{epic}.{story}-{slug}.yml` - Quality gate decision (from qa-gate-tmpl.yaml)

#### **Supporting Data Files** (Markdown)
Framework guidance, stored in `.bmad-core/data/`:
- `test-levels-framework.md` - Unit/Integration/E2E decision criteria
- `test-priorities-matrix.md` - P0/P1/P2/P3 classification rules

### Version Evolution

#### Current State: v1.0
- **qa-gate-tmpl.yaml**: Version 1.0
  - Simple, focused gate structure
  - Fixed severity scale (low/medium/high)
  - Optional extended fields via examples
  - Clean separation of required vs optional data

- **test-scenario-format**: (embedded, unversioned)
  - Defined inline within test-design.md task
  - Stable format (no version history needed)
  - Tightly coupled to task logic

#### Future Considerations
Based on planning template evolution (v2.0 introduced section permissions):

**Potential v2.0 Features for qa-gate-tmpl**:
- **Multi-reviewer support**: Track multiple reviewers (QA + Security + Performance)
- **Section permissions**: Different agents update different sections
- **Gate transitions**: Formal state machine (FAIL → CONCERNS → PASS)
- **Automated checks**: CI/CD integration fields (build status, coverage %)
- **Enhanced traceability**: Direct links to test execution results

**Potential Enhancements for test-scenario-format**:
- **Standalone template file**: Extract from task, enable reuse
- **Test execution tracking**: Link to actual test results
- **Coverage metrics**: Automated coverage calculation
- **Test dependencies**: Model test execution order constraints

### Template Design Philosophy

#### 1. **Simplicity First**
- Minimal required fields
- Clear, unambiguous choices
- Self-documenting structure
- No unnecessary complexity

#### 2. **Machine-Readable**
- YAML format for automation
- Consistent field names and types
- Predictable file naming conventions
- Easy to parse and query

#### 3. **Human-Friendly**
- Clear field names (status_reason, not sr)
- Examples embedded in template
- Block scalar support for multi-line content
- Commented guidance

#### 4. **Extensible**
- Optional extended fields section
- Examples show extension patterns
- Backward-compatible additions
- Teams can customize per needs

#### 5. **Audit-Ready**
- Timestamps for all decisions
- Decision rationale required
- Change history (optional field)
- Waiver approval tracking

### Key Innovations

#### Innovation 1: **Four-State Gate Model**

Traditional quality gates often use binary PASS/FAIL, but BMad introduces nuance:

```
PASS     → Zero-risk proceed (ideal state)
CONCERNS → Low-risk proceed (acceptable with monitoring)
FAIL     → High-risk block (must fix)
WAIVED   → Known-risk proceed (explicit acceptance)
```

**Benefits**:
- **Pragmatic**: Acknowledges reality that perfect is enemy of shipped
- **Visible**: Issues tracked even when waived (not swept under rug)
- **Flexible**: Supports different risk tolerances per project
- **Auditable**: Waiver mechanism creates explicit decision record

#### Innovation 2: **Risk-Integrated Testing**

Test scenarios can link to risk profile findings:

```yaml
test_scenario:
  id: '1.3-INT-001'
  mitigates_risks: ['RISK-SEC-001', 'RISK-DATA-003']
```

**Benefits**:
- **Comprehensive coverage**: Ensure high risks are tested
- **Gap visibility**: Identify untested risks
- **Prioritization**: Focus on risk mitigation
- **Compliance**: Demonstrate risk-based testing approach

#### Innovation 3: **Test Level Justification**

Every test scenario requires justification for level choice:

```yaml
test_scenario:
  level: integration
  justification: 'Multi-component flow requires DB interaction testing'
```

**Benefits**:
- **Shift-left awareness**: Forces consideration of lower-level tests
- **Avoid over-testing**: Prevents E2E test bloat
- **Knowledge transfer**: Documents testing rationale for team
- **Test efficiency**: Right level = faster feedback + lower maintenance

#### Innovation 4: **Severity Constraints**

Template enforces fixed severity vocabulary:

```yaml
top_issues:
  - severity: high  # ONLY: low|medium|high
```

**Benefits**:
- **Consistency**: No "critical" vs "blocker" vs "high" confusion
- **Automation-friendly**: Simple mapping to CI/CD actions
- **Clear escalation**: High = immediate attention required
- **Reduced bikeshedding**: No debates over 5-level scales

### Template Usage Patterns

#### Pattern 1: **Gate as Final Checkpoint**

Quality gate is the **last step** before story completion:

```
Dev completes → QA reviews → QA runs all assessment tasks →
QA generates gate → Gate decision determines next action
```

The gate aggregates all QA findings into a single decision point.

#### Pattern 2: **Progressive Assessment**

QA tasks build on each other:

```
Risk Profile (identifies what could go wrong)
    ↓
Test Design (plans mitigation via tests)
    ↓
Trace Requirements (ensures full AC coverage)
    ↓
NFR Assessment (validates non-functional aspects)
    ↓
Review Story (comprehensive code + design review)
    ↓
Gate Decision (synthesizes all findings)
```

Each step informs the next, building confidence progressively.

#### Pattern 3: **Test Scenario as Contract**

Test scenarios serve as a **contract between QA and Dev**:

```
QA designs test → Dev implements tests per design →
QA validates tests match design → Tests become regression suite
```

The structured format enables verification that tests were implemented as designed.

#### Pattern 4: **Gate as Documentation**

Gate files serve as **historical quality records**:

```
gates/
  1.1-user-auth.yml      (PASS - no issues)
  1.2-api-gateway.yml    (CONCERNS - minor perf issue)
  1.3-data-layer.yml     (WAIVED - accepted tech debt)
```

This creates an **auditable quality trail** for the entire project.

### Template Lifecycle

#### 1. **Gate File Creation**
```
review-story.md task completes
    ↓
qa-gate.md task invoked
    ↓
Loads qa-gate-tmpl.yaml
    ↓
Populates with review findings
    ↓
Writes gates/{story}.yml
```

#### 2. **Gate File Usage**
```
Dev agent checks gate status before marking story done
PM/PO queries gates for sprint quality metrics
CI/CD pipeline reads gate for deployment decisions
Stakeholders review gates for release confidence
```

#### 3. **Gate File Updates**
```
If FAIL → Dev fixes → QA re-reviews → Gate updated (new timestamp)
If WAIVED → Periodically revisit → Gate updated if resolved
```

**Note**: Gate files use **append-only history** (optional field) to preserve decision trail.

### Integration with BMad Framework

#### Agent Interactions

**QA Agent (Quinn)**:
- **Primary owner**: Creates all QA assessment documents and gate files
- **Risk profiling**: Identifies and scores risks (probability × impact)
- **Test design**: Creates test scenarios with levels and priorities
- **Requirements tracing**: Maps tests to acceptance criteria
- **NFR assessment**: Validates security, performance, reliability, maintainability
- **Comprehensive review**: Active code review with refactoring authority
- **Gate decision**: Synthesizes all findings into final gate decision

**Dev Agent (James)**:
- **Gate consumer**: Checks gate status before story completion
- **Issue resolver**: Implements fixes for issues identified in gate
- **Test implementer**: Implements tests per test design scenarios
- **Regression validator**: Ensures existing tests still pass

**PO Agent (Sarah)**:
- **Gate reviewer**: Reviews gate decisions for sprint planning
- **Waiver approver**: Approves waivers for accepted technical debt
- **Metrics tracker**: Monitors gate pass/fail rates across sprint

**PM Agent (John)**:
- **Quality reporter**: Aggregates gate metrics for stakeholders
- **Risk escalator**: Escalates FAIL gates to leadership

#### Configuration Integration

Gate template uses configuration from `core-config.yaml`:

```yaml
qa:
  qaLocation: 'qa-docs'  # Base directory for QA outputs
```

File paths resolved:
- `qa-docs/assessments/{story}-*.md` - Assessment documents
- `qa-docs/gates/{story}.yml` - Gate files

#### Workflow Integration

Development templates integrate into the **development workflow**:

```yaml
workflow: greenfield-fullstack
steps:
  - agent: sm
    task: create-next-story
  - agent: dev
    task: story-dod-checklist  # Implements story
  - agent: qa
    tasks:
      - risk-profile
      - test-design
      - trace-requirements
      - nfr-assess
      - review-story
      - qa-gate  # ← Generates gate using qa-gate-tmpl.yaml
  - decision: gate-check
    if: PASS or CONCERNS → proceed
    else: apply-qa-fixes → re-review
```

---

## Summary

The development templates represent a **matured, output-focused approach** to quality management:

### Key Characteristics
- **Output-focused**: No interactive elicitation, programmatic generation
- **YAML-first**: Machine-readable format for automation
- **Gate-driven**: Clear quality checkpoints with four-state model
- **Risk-integrated**: Test scenarios link to risk assessment
- **Severity-constrained**: Fixed low/medium/high scale
- **Audit-ready**: Decision rationale and timestamps required

### Primary Value
- **Consistency**: Standardized quality gates across all stories
- **Automation**: Machine-readable format enables CI/CD integration
- **Visibility**: Quality status clear to all stakeholders
- **Flexibility**: Waiver mechanism supports pragmatic decisions
- **Traceability**: Tests map to requirements and risks

### ADK Translation Considerations
- **Schema enforcement**: Use JSON Schema or similar to validate gate files
- **Database storage**: Store gates in Firestore for querying and reporting
- **Automated generation**: Cloud Functions or Reasoning Engine to populate templates
- **CI/CD integration**: Cloud Build triggers read gate status for deployment decisions
- **Metrics dashboard**: Aggregate gate data for program-level quality visibility

---

**Next Section**: [QA Gate Template Analysis →](development-templates-section2.md)
