# Task Analysis: qa-gate

**Task ID**: `qa-gate`
**Task File**: `.bmad-core/tasks/qa-gate.md`
**Primary Agent**: QA (Quinn)
**Task Type**: Final Decision Artifact Generator
**Version Analyzed**: BMad Core v4

---

## 1. Purpose & Scope

### Overview
The `qa-gate` task generates a **standalone quality gate decision file** that provides a clear, actionable quality status for a story implementation. This task produces a minimal, predictable YAML artifact that serves as an **advisory checkpoint** for teams to understand quality status without arbitrary blocking.

### Key Characteristics
- **Final decision artifact** - Creates official gate file representing quality verdict
- **Advisory philosophy** - Provides expert guidance without mandatory blocking
- **Fixed schema enforcement** - Strict YAML structure with controlled vocabulary
- **Deterministic decision logic** - Clear criteria for PASS/CONCERNS/FAIL/WAIVED statuses
- **Minimal and predictable** - Deliberately constrained to essential information only
- **Dual artifact generation** - Creates gate file AND updates story with gate reference

### Scope
This task encompasses:
- Quality gate decision determination (PASS/CONCERNS/FAIL/WAIVED)
- Gate file creation in standard YAML format
- Issue identification and prioritization (top issues only)
- Severity classification (low/medium/high)
- Waiver management (reason tracking and approval)
- Story update with gate reference link
- Configuration-driven file path resolution

### What This Task Is NOT
- **Not a full review** - Assumes review findings already exist (from `review-story` or manual review)
- **Not a blocker** - Advisory only; teams can proceed with awareness
- **Not comprehensive issue tracking** - Only top issues; full detail in review documents
- **Not a requirements validator** - Focuses on quality status, not completeness

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_id: '{epic}.{story}'        # e.g., "1.3", "2.5"
  - story_title: '{title}'            # Used to generate slug
  - gate_decision: 'PASS|CONCERNS|FAIL|WAIVED'
  - status_reason: '{1-2 sentence explanation}'
  - review_findings: {...}            # From review-story or manual review

optional:
  - top_issues: []                    # Array of top 3-5 issues
  - waiver_details: {...}             # Required if gate_decision is WAIVED
```

### Input Sources
- **story_id**: Provided by user command or calling task (e.g., `*qa-gate 1.3`)
- **story_title**: Extracted from story markdown file's H1 heading
- **gate_decision**: Derived from review findings using decision criteria
- **status_reason**: Synthesized from review findings (1-2 sentences max)
- **review_findings**: From prior `review-story` task or manual review session
- **top_issues**: Extracted from review findings (prioritized by severity)
- **waiver_details**: Provided when team explicitly accepts known issues

### Configuration Dependencies
- `core-config.yaml`:
  - `qa.qaLocation` - Base directory for QA outputs (e.g., `docs/qa`)
  - `qa.qaLocation/gates` - Subdirectory for gate files (e.g., `docs/qa/gates`)
  - `devStoryLocation` - Location of story files for updates (e.g., `docs/dev-stories`)

### Prerequisite Validation
Before executing qa-gate task:
1. **Story must exist** at `devStoryLocation/{epic}.{story}.*.md`
2. **Review findings must be available** (from `review-story` or manual review)
3. **Story title must be extractable** from H1 heading
4. **Gate decision must be determinable** from findings

---

## 3. Execution Flow

The qa-gate task follows a deterministic 6-step process:

### Step 1: Load Configuration and Locate Story

**Purpose**: Resolve file paths and load story context.

**Actions**:
1. Load `core-config.yaml` to get:
   - `qa.qaLocation` → base directory for gate files
   - `qa.qaLocation/gates` → gate file subdirectory
   - `devStoryLocation` → story file directory
2. Locate story file: `devStoryLocation/{epic}.{story}.*.md`
3. Extract story title from H1 heading
4. Generate slug from title using slug rules

**Slug Generation Rules**:
```
1. Convert to lowercase
2. Replace spaces with hyphens
3. Strip punctuation (except hyphens)
4. Example: "User Auth - Login!" → "user-auth-login"
```

**Implementation Notes**:
- If `qa.qaLocation/gates` directory doesn't exist, create it
- Story file pattern matches: `{epic}.{story}.*` (supports story IDs like "1.3.backend-api.md")
- Fail gracefully if story not found (report to user)

---

### Step 2: Analyze Review Findings and Determine Gate Decision

**Purpose**: Evaluate review findings and select appropriate gate status.

**Decision Criteria**:

#### PASS
Apply when **ALL** of the following conditions are met:
- All acceptance criteria met
- No high-severity issues found
- Test coverage meets project standards
- All NFRs in acceptable state
- No blocking defects

#### CONCERNS
Apply when **ANY** of the following conditions are met:
- Non-blocking issues present (medium/low severity)
- Minor test coverage gaps
- Technical debt identified but manageable
- NFR targets undefined (unknown performance/security targets)
- Issues should be tracked and scheduled but don't block release

#### FAIL
Apply when **ANY** of the following conditions are met:
- Acceptance criteria not met
- High-severity issues present
- Critical test coverage gaps
- Security vulnerabilities identified
- Recommend return to InProgress status

#### WAIVED
Apply when **ALL** of the following conditions are met:
- Issues explicitly accepted by Product Owner or authorized party
- Requires approval and reason documentation
- Proceed despite known issues
- Waiver details must include: reason, approved_by

**Decision Logic**:
```
IF (high_severity_issues > 0) THEN gate = FAIL
ELSE IF (acceptance_criteria_unmet > 0) THEN gate = FAIL
ELSE IF (waiver_requested AND approved) THEN gate = WAIVED
ELSE IF (medium_severity_issues > 0 OR low_severity_issues > 0) THEN gate = CONCERNS
ELSE IF (all_criteria_met AND no_issues) THEN gate = PASS
ELSE gate = CONCERNS  # Default to safe position
```

**Implementation Notes**:
- High-severity issues are automatic FAIL
- WAIVED requires explicit approval (not automatic)
- CONCERNS is the "safe default" when uncertain
- status_reason must explain the decision in 1-2 sentences

---

### Step 3: Identify and Prioritize Top Issues

**Purpose**: Extract top 3-5 issues from review findings for gate file.

**Prioritization Logic**:
1. **By severity**: high > medium > low
2. **By category** (within same severity):
   - Security (SEC-) → highest priority
   - Requirements (REQ-) → requirements gaps
   - Architecture (ARCH-) → design issues
   - Reliability (REL-) → stability concerns
   - Performance (PERF-) → performance issues
   - Testing (TEST-) → test gaps
   - Maintainability (MNT-) → code quality
   - Documentation (DOC-) → documentation gaps

**Issue Structure**:
```yaml
- id: '{PREFIX}-{NUMBER}'           # e.g., "SEC-001"
  severity: 'low|medium|high'       # FIXED VALUES ONLY
  finding: '{brief description}'
  suggested_action: '{recommended fix}'
```

**Issue ID Prefixes**:
- `SEC-`: Security issues (highest priority)
- `REQ-`: Requirements issues
- `ARCH-`: Architecture issues
- `REL-`: Reliability issues
- `PERF-`: Performance issues
- `TEST-`: Testing gaps
- `MNT-`: Maintainability concerns
- `DOC-`: Documentation gaps

**Constraints**:
- Maximum 5 issues in gate file (top issues only)
- Must use exact severity values: `low`, `medium`, `high`
- Finding should be concise (1 sentence)
- Suggested action should be actionable (1 sentence)

**Empty Issues Array**:
If no issues found:
```yaml
top_issues: []  # Empty array if no issues
```

---

### Step 4: Generate Gate File (YAML)

**Purpose**: Create standardized YAML gate file with minimal required schema.

**File Location**:
```
{qa.qaLocation}/gates/{epic}.{story}-{slug}.yml
```

Example path: `docs/qa/gates/1.3-user-auth-login.yml`

**Minimal Required Schema** (No Issues):
```yaml
schema: 1
story: '{epic}.{story}'
gate: PASS|CONCERNS|FAIL|WAIVED
status_reason: '1-2 sentence explanation of gate decision'
reviewer: 'Quinn'
updated: '{ISO-8601 timestamp}'
top_issues: []
waiver: { active: false }
```

**Schema with Issues**:
```yaml
schema: 1
story: '1.3'
gate: CONCERNS
status_reason: 'Missing rate limiting on auth endpoints poses security risk.'
reviewer: 'Quinn'
updated: '2025-01-12T10:15:00Z'
top_issues:
  - id: 'SEC-001'
    severity: high
    finding: 'No rate limiting on login endpoint'
    suggested_action: 'Add rate limiting middleware before production'
  - id: 'TEST-001'
    severity: medium
    finding: 'No integration tests for auth flow'
    suggested_action: 'Add integration test coverage'
waiver: { active: false }
```

**Schema when Waived**:
```yaml
schema: 1
story: '1.3'
gate: WAIVED
status_reason: 'Known issues accepted for MVP release.'
reviewer: 'Quinn'
updated: '2025-01-12T10:15:00Z'
top_issues:
  - id: 'PERF-001'
    severity: low
    finding: 'Dashboard loads slowly with 1000+ items'
    suggested_action: 'Implement pagination in next sprint'
waiver:
  active: true
  reason: 'MVP release - performance optimization deferred'
  approved_by: 'Product Owner'
```

**Field Specifications**:
- `schema`: Always `1` (version number for future compatibility)
- `story`: Story ID in format `{epic}.{story}` (e.g., "1.3")
- `gate`: One of four fixed values: `PASS`, `CONCERNS`, `FAIL`, `WAIVED`
- `status_reason`: 1-2 sentences maximum explaining decision
- `reviewer`: Always "Quinn" (QA agent persona)
- `updated`: ISO-8601 timestamp (e.g., "2025-01-12T10:15:00Z")
- `top_issues`: Array (empty if no issues, max 5 if issues present)
- `waiver.active`: Boolean (false unless gate is WAIVED)
- `waiver.reason`: String (required if active: true)
- `waiver.approved_by`: String (required if active: true)

**Implementation Notes**:
- Always create/overwrite gate file at standard path
- Use ISO-8601 format for timestamp: `YYYY-MM-DDTHH:MM:SSZ`
- Ensure proper YAML formatting (spaces, not tabs)
- Validate schema before writing
- Create parent directory if it doesn't exist

---

### Step 5: Update Story with Gate Reference

**Purpose**: Append gate status to story's QA Results section.

**Target Section**: `## QA Results` in story file

**Append Format** (exact format required):
```markdown
### Gate Status

Gate: {STATUS} → {qa.qaLocation}/gates/{epic}.{story}-{slug}.yml
```

**Example Story Update**:
```markdown
## QA Results

### Review Date: 2025-01-12

### Reviewed By: Quinn (Test Architect)

[... existing review content ...]

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.3-user-auth-login.yml
```

**Insertion Logic**:
1. Locate `## QA Results` section in story file
2. If section doesn't exist, create it before `## Dev Agent Record`
3. Append `### Gate Status` subsection at end of QA Results
4. If `### Gate Status` already exists, replace it (update scenario)

**Implementation Notes**:
- Use relative path from project root for gate file reference
- Preserve existing QA Results content
- Do NOT modify other story sections (Status, File List, Tasks, etc.)
- Validate story file structure before updating

---

### Step 6: Validate and Confirm

**Purpose**: Ensure gate file and story update are correctly created.

**Validation Checks**:
1. **Gate file exists** at `{qa.qaLocation}/gates/{epic}.{story}-{slug}.yml`
2. **Gate file is valid YAML** (parse without errors)
3. **Schema is correct** (all required fields present)
4. **Severity values are valid** (`low`, `medium`, `high` only)
5. **Story file updated** with gate reference
6. **Gate Status section present** in story's QA Results

**Confirmation Output** (to user):
```
✓ Gate file created: {qa.qaLocation}/gates/{epic}.{story}-{slug}.yml
✓ Gate decision: {STATUS}
✓ Story updated with gate reference
✓ Top issues: {count} issues documented
```

**Error Handling**:
- If gate file write fails → report error to user
- If story update fails → report warning (gate file still valid)
- If validation fails → report issues and recommend correction

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Gate Status Determination

**Trigger**: After analyzing review findings (Step 2)

**Decision Tree**:
```
START
  ├─ High-severity issues present?
  │    YES → gate = FAIL
  │    NO → Continue
  │
  ├─ Acceptance criteria unmet?
  │    YES → gate = FAIL
  │    NO → Continue
  │
  ├─ Waiver requested AND approved?
  │    YES → gate = WAIVED
  │    NO → Continue
  │
  ├─ Medium/low severity issues present?
  │    YES → gate = CONCERNS
  │    NO → Continue
  │
  ├─ All criteria met AND no issues?
  │    YES → gate = PASS
  │    NO → gate = CONCERNS (safe default)
END
```

**Implementation**:
```python
def determine_gate_status(findings):
    if findings.high_severity_issues > 0:
        return 'FAIL'

    if findings.acceptance_criteria_unmet > 0:
        return 'FAIL'

    if findings.waiver_requested and findings.waiver_approved:
        return 'WAIVED'

    if findings.medium_severity_issues > 0 or findings.low_severity_issues > 0:
        return 'CONCERNS'

    if findings.all_criteria_met and findings.total_issues == 0:
        return 'PASS'

    # Safe default
    return 'CONCERNS'
```

---

### Decision Point 2: Issue Inclusion Logic

**Trigger**: When populating top_issues array (Step 3)

**Decision Logic**:
```
IF total_issues == 0 THEN
  top_issues = []
ELSE IF total_issues <= 5 THEN
  top_issues = all_issues (sorted by priority)
ELSE
  top_issues = top_5_issues (sorted by priority)
END IF
```

**Priority Sorting**:
1. Sort by severity: high → medium → low
2. Within same severity, sort by category prefix:
   - SEC- (security) → highest
   - REQ- (requirements)
   - ARCH- (architecture)
   - REL- (reliability)
   - PERF- (performance)
   - TEST- (testing)
   - MNT- (maintainability)
   - DOC- (documentation) → lowest

**Implementation**:
```python
def prioritize_issues(all_issues):
    # Severity weights
    severity_weight = {'high': 3, 'medium': 2, 'low': 1}

    # Category weights (within same severity)
    category_weight = {
        'SEC': 8, 'REQ': 7, 'ARCH': 6, 'REL': 5,
        'PERF': 4, 'TEST': 3, 'MNT': 2, 'DOC': 1
    }

    def priority_score(issue):
        sev_score = severity_weight[issue.severity] * 10
        cat_prefix = issue.id.split('-')[0]
        cat_score = category_weight.get(cat_prefix, 0)
        return sev_score + cat_score

    sorted_issues = sorted(all_issues, key=priority_score, reverse=True)
    return sorted_issues[:5]  # Top 5 only
```

---

### Decision Point 3: Waiver Activation

**Trigger**: When gate_decision is WAIVED (Step 4)

**Decision Logic**:
```
IF gate_decision == 'WAIVED' THEN
  waiver.active = true
  waiver.reason = '{required}'
  waiver.approved_by = '{required}'
ELSE
  waiver.active = false
  # No reason or approved_by needed
END IF
```

**Validation**:
- If gate is WAIVED, waiver.reason MUST be provided
- If gate is WAIVED, waiver.approved_by MUST be provided
- If gate is not WAIVED, waiver.active MUST be false

**Error Handling**:
```python
if gate_decision == 'WAIVED':
    if not waiver_reason or not approved_by:
        raise ValueError("WAIVED gate requires waiver.reason and waiver.approved_by")
```

---

### Decision Point 4: Story Update Strategy

**Trigger**: When updating story with gate reference (Step 5)

**Decision Logic**:
```
Locate "## QA Results" section
  ├─ Section exists?
  │    YES → Continue
  │    NO → Create before "## Dev Agent Record"
  │
  └─ Locate "### Gate Status" subsection
       ├─ Subsection exists?
       │    YES → Replace existing content (update scenario)
       │    NO → Append new subsection at end of QA Results
```

**Implementation Notes**:
- First-time gate creation: Append new `### Gate Status` subsection
- Subsequent gate updates: Replace existing `### Gate Status` content
- Preserve all other QA Results content
- Do not modify story Status, File List, Tasks, or other sections

---

## 5. User Interaction Points

### Interaction Mode: Minimal User Input

The qa-gate task is designed for **minimal user interaction** and is typically invoked:

1. **Automatically** by `review-story` task after comprehensive review
2. **Manually** by user command after standalone review
3. **Programmatically** by orchestration workflows

---

### User Interaction Pattern 1: Automatic Invocation (from review-story)

**Scenario**: User runs `*review 1.3`, which calls `qa-gate` internally.

**User Experience**:
```
User: *review 1.3

QA Agent (Quinn):
  Step 1: Loading story 1.3...
  Step 2: Performing comprehensive review...
  [... review process ...]
  Step 6: Creating quality gate...

  ✓ Gate file created: docs/qa/gates/1.3-user-auth-login.yml
  ✓ Gate decision: CONCERNS
  ✓ Story updated with gate reference
  ✓ Top issues: 2 issues documented

  Gate Status: CONCERNS
  See docs/qa/gates/1.3-user-auth-login.yml for details.
```

**No explicit user input required** - gate decision derived from review findings.

---

### User Interaction Pattern 2: Manual Invocation (standalone)

**Scenario**: User runs `*qa-gate 1.3` after manual review.

**User Experience**:
```
User: *qa-gate 1.3

QA Agent (Quinn):
  Loading story 1.3...

  I've reviewed the story and need to create a quality gate.

  Based on my analysis:
  - 2 medium-severity issues found
  - All acceptance criteria met
  - Test coverage adequate

  Recommended gate: CONCERNS

  Proceed with CONCERNS gate? (yes/no)

User: yes

QA Agent (Quinn):
  ✓ Gate file created: docs/qa/gates/1.3-user-auth-login.yml
  ✓ Gate decision: CONCERNS
  ✓ Story updated with gate reference
```

**Optional confirmation** - agent may ask user to confirm gate decision if not obvious.

---

### User Interaction Pattern 3: Waiver Scenario

**Scenario**: Team wants to proceed despite known issues.

**User Experience**:
```
User: *qa-gate 1.3 --waive

QA Agent (Quinn):
  Loading story 1.3...

  I found the following issues:
  - PERF-001 (low): Dashboard loads slowly with 1000+ items

  You've requested a WAIVED gate. This means proceeding despite known issues.

  Please provide:
  1. Waiver reason:

User: MVP release - performance optimization deferred

QA Agent (Quinn):
  2. Approved by (name or role):

User: Product Owner

QA Agent (Quinn):
  ✓ Gate file created: docs/qa/gates/1.3-user-dashboard.yml
  ✓ Gate decision: WAIVED
  ✓ Waiver documented with approval
  ✓ Story updated with gate reference

  Note: Issue will be tracked for future sprint.
```

**Explicit waiver input required** - reason and approval must be provided.

---

### Non-Interactive Mode (YOLO)

**Scenario**: Fully automated gate creation without user input.

**Usage**: `*qa-gate 1.3 --yolo` or called programmatically

**Behavior**:
- No user confirmation prompts
- Gate decision determined automatically from review findings
- Default to CONCERNS if uncertain
- No waiver support in YOLO mode (requires explicit approval)

---

## 6. Output Specifications

### Output 1: Quality Gate File (YAML)

**Format**: YAML
**Location**: `{qa.qaLocation}/gates/{epic}.{story}-{slug}.yml`
**Schema Version**: 1

**Complete Schema**:
```yaml
schema: 1                                    # Schema version (integer)
story: '{epic}.{story}'                      # Story ID (string)
gate: 'PASS|CONCERNS|FAIL|WAIVED'            # Gate decision (string, fixed values)
status_reason: '{1-2 sentence explanation}'  # Reason (string, max 2 sentences)
reviewer: 'Quinn'                            # Reviewer name (string, always "Quinn")
updated: '{ISO-8601 timestamp}'              # Timestamp (string, ISO-8601 format)
top_issues:                                  # Issues array (array, max 5 items)
  - id: '{PREFIX}-{NUMBER}'                  # Issue ID (string, e.g., "SEC-001")
    severity: 'low|medium|high'              # Severity (string, fixed values)
    finding: '{brief description}'           # Finding (string, 1 sentence)
    suggested_action: '{recommended fix}'    # Action (string, 1 sentence)
waiver:                                      # Waiver object
  active: false                              # Active flag (boolean)
  reason: '{waiver reason}'                  # Reason (string, if active: true)
  approved_by: '{approver name}'             # Approver (string, if active: true)
```

**Filename Pattern**:
```
{epic}.{story}-{slug}.yml

Examples:
- 1.3-user-auth-login.yml
- 2.5-payment-processing.yml
- 3.1-admin-dashboard.yml
```

**Field Constraints**:
- `schema`: Must be integer `1`
- `gate`: Must be one of: `PASS`, `CONCERNS`, `FAIL`, `WAIVED`
- `severity`: Must be one of: `low`, `medium`, `high`
- `status_reason`: Maximum 2 sentences (approximately 200 characters)
- `top_issues`: Maximum 5 items
- `waiver.active`: Must be `true` only if gate is `WAIVED`

---

### Output 2: Story Update (Markdown)

**Format**: Markdown
**Location**: `{devStoryLocation}/{epic}.{story}.*.md`
**Section**: `## QA Results`

**Update Pattern**:
```markdown
### Gate Status

Gate: {STATUS} → {qa.qaLocation}/gates/{epic}.{story}-{slug}.yml
```

**Complete Example**:
```markdown
## QA Results

### Review Date: 2025-01-12

### Reviewed By: Quinn (Test Architect)

### Summary

Comprehensive review completed. Story meets functional requirements with minor concerns.

### Requirements Traceability

- AC 1-5: Full coverage via unit and integration tests
- AC 6: Partial coverage (missing edge case test)

### Code Quality

- Architecture follows established patterns
- Minor refactoring opportunities identified
- No critical security issues

### Test Architecture

- Unit test coverage: 85%
- Integration test coverage: 70%
- E2E tests: Basic happy path covered

### Issues Found

1. **TEST-001** (medium): Missing edge case test for AC 6
   - Suggested action: Add test for null input handling

2. **PERF-001** (low): Dashboard query not optimized for large datasets
   - Suggested action: Add pagination in future sprint

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.3-user-dashboard.yml
```

**Insertion Rules**:
- Append at end of `## QA Results` section
- If `### Gate Status` exists, replace it (don't duplicate)
- Use relative path from project root for gate file link
- Preserve all other QA Results content

---

### Output 3: Console Confirmation (User Feedback)

**Format**: Text (console output)
**Audience**: User invoking task

**Standard Success Output**:
```
✓ Gate file created: docs/qa/gates/1.3-user-auth-login.yml
✓ Gate decision: CONCERNS
✓ Story updated with gate reference
✓ Top issues: 2 issues documented

Gate Status: CONCERNS
See docs/qa/gates/1.3-user-auth-login.yml for details.
```

**PASS Output**:
```
✓ Gate file created: docs/qa/gates/1.5-user-profile.yml
✓ Gate decision: PASS
✓ Story updated with gate reference
✓ No issues found

Gate Status: PASS
Story ready for release.
```

**FAIL Output**:
```
✓ Gate file created: docs/qa/gates/1.3-user-auth-login.yml
✓ Gate decision: FAIL
✓ Story updated with gate reference
✓ Top issues: 3 high-severity issues documented

Gate Status: FAIL
Recommend returning story to InProgress.
See docs/qa/gates/1.3-user-auth-login.yml for details.
```

**WAIVED Output**:
```
✓ Gate file created: docs/qa/gates/1.3-user-dashboard.yml
✓ Gate decision: WAIVED
✓ Waiver documented with approval: Product Owner
✓ Story updated with gate reference
✓ Top issues: 1 issue documented (accepted)

Gate Status: WAIVED
Proceeding despite known issues per Product Owner approval.
See docs/qa/gates/1.3-user-dashboard.yml for details.
```

---

## 7. Error Handling & Validation

### Error Category 1: Configuration Errors

**Error**: Missing or invalid `core-config.yaml`

**Detection**:
```python
if not os.path.exists('.bmad-core/core-config.yaml'):
    raise ConfigurationError("core-config.yaml not found")
```

**User Message**:
```
❌ Error: Configuration file not found
   Location: .bmad-core/core-config.yaml
   Action: Ensure core-config.yaml exists and is properly formatted.
```

**Recovery**: Halt execution, prompt user to fix configuration.

---

**Error**: Missing `qa.qaLocation` in configuration

**Detection**:
```python
config = load_config()
if 'qa' not in config or 'qaLocation' not in config['qa']:
    raise ConfigurationError("qa.qaLocation not defined")
```

**User Message**:
```
❌ Error: qa.qaLocation not configured
   File: .bmad-core/core-config.yaml
   Action: Add qa.qaLocation path (e.g., "docs/qa")
```

**Recovery**: Halt execution, prompt user to add qa.qaLocation.

---

### Error Category 2: Story Not Found

**Error**: Story file doesn't exist

**Detection**:
```python
story_pattern = f"{dev_story_location}/{epic}.{story}.*.md"
story_files = glob.glob(story_pattern)
if not story_files:
    raise StoryNotFoundError(f"Story {epic}.{story} not found")
```

**User Message**:
```
❌ Error: Story not found
   Story ID: 1.3
   Expected location: docs/dev-stories/1.3.*.md
   Action: Verify story ID and location.
```

**Recovery**: Halt execution, prompt user to verify story ID.

---

### Error Category 3: Invalid Input Data

**Error**: Invalid gate decision value

**Detection**:
```python
valid_gates = ['PASS', 'CONCERNS', 'FAIL', 'WAIVED']
if gate_decision not in valid_gates:
    raise ValueError(f"Invalid gate: {gate_decision}")
```

**User Message**:
```
❌ Error: Invalid gate decision
   Value: "{invalid_value}"
   Valid values: PASS, CONCERNS, FAIL, WAIVED
   Action: Use one of the valid gate values.
```

**Recovery**: Prompt user to correct gate value.

---

**Error**: Invalid severity value

**Detection**:
```python
valid_severities = ['low', 'medium', 'high']
for issue in top_issues:
    if issue['severity'] not in valid_severities:
        raise ValueError(f"Invalid severity: {issue['severity']}")
```

**User Message**:
```
❌ Error: Invalid severity value
   Issue ID: SEC-001
   Value: "critical"
   Valid values: low, medium, high
   Action: Use one of the valid severity values.
```

**Recovery**: Prompt user to correct severity value.

---

### Error Category 4: Missing Required Fields

**Error**: WAIVED gate without waiver details

**Detection**:
```python
if gate_decision == 'WAIVED':
    if not waiver_reason or not approved_by:
        raise ValidationError("WAIVED gate requires waiver.reason and waiver.approved_by")
```

**User Message**:
```
❌ Error: Incomplete waiver information
   Gate: WAIVED
   Missing: waiver.reason and/or waiver.approved_by
   Action: Provide waiver reason and approver name.
```

**Recovery**: Prompt user to provide missing waiver details.

---

**Error**: Empty status_reason

**Detection**:
```python
if not status_reason or status_reason.strip() == '':
    raise ValidationError("status_reason is required")
```

**User Message**:
```
❌ Error: Missing status_reason
   Action: Provide 1-2 sentence explanation of gate decision.
```

**Recovery**: Prompt user to provide status_reason.

---

### Error Category 5: File System Errors

**Error**: Cannot write gate file

**Detection**:
```python
try:
    with open(gate_file_path, 'w') as f:
        yaml.dump(gate_data, f)
except IOError as e:
    raise FileSystemError(f"Cannot write gate file: {e}")
```

**User Message**:
```
❌ Error: Cannot write gate file
   Path: docs/qa/gates/1.3-user-auth-login.yml
   Reason: Permission denied
   Action: Check file permissions and directory access.
```

**Recovery**: Report error, suggest permission fix.

---

**Error**: Cannot update story file

**Detection**:
```python
try:
    with open(story_file_path, 'a') as f:
        f.write(gate_reference)
except IOError as e:
    raise FileSystemError(f"Cannot update story: {e}")
```

**User Message**:
```
⚠️  Warning: Gate file created but cannot update story
   Gate file: docs/qa/gates/1.3-user-auth-login.yml (✓ created)
   Story file: docs/dev-stories/1.3.user-auth.md (✗ not updated)
   Reason: Permission denied
   Action: Manually add gate reference to story's QA Results section.
```

**Recovery**: Gate file is valid; warn user to manually update story.

---

### Error Category 6: YAML Validation Errors

**Error**: Malformed YAML output

**Detection**:
```python
import yaml

# After generating gate data
try:
    yaml.safe_load(yaml.dump(gate_data))
except yaml.YAMLError as e:
    raise ValidationError(f"Generated invalid YAML: {e}")
```

**User Message**:
```
❌ Error: Invalid YAML generated
   Reason: {error details}
   Action: Review gate data structure and regenerate.
```

**Recovery**: Debug gate data structure, regenerate.

---

### Validation Checklist (Before Writing Gate File)

**Pre-write validation**:
```python
def validate_gate_data(gate_data):
    # Required fields
    assert 'schema' in gate_data and gate_data['schema'] == 1
    assert 'story' in gate_data
    assert 'gate' in gate_data
    assert 'status_reason' in gate_data
    assert 'reviewer' in gate_data
    assert 'updated' in gate_data
    assert 'top_issues' in gate_data
    assert 'waiver' in gate_data

    # Gate value
    assert gate_data['gate'] in ['PASS', 'CONCERNS', 'FAIL', 'WAIVED']

    # Severity values
    for issue in gate_data['top_issues']:
        assert 'severity' in issue
        assert issue['severity'] in ['low', 'medium', 'high']

    # Waiver consistency
    if gate_data['gate'] == 'WAIVED':
        assert gate_data['waiver']['active'] == True
        assert 'reason' in gate_data['waiver']
        assert 'approved_by' in gate_data['waiver']
    else:
        assert gate_data['waiver']['active'] == False

    # Top issues limit
    assert len(gate_data['top_issues']) <= 5

    return True
```

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**Prerequisite Tasks** (typically run before qa-gate):
1. **review-story** (recommended) - Comprehensive review that generates findings
   - Provides: Requirements traceability, code quality assessment, test evaluation, NFR validation
   - qa-gate consumes review findings to determine gate decision

**Optional Prerequisite Tasks**:
- **risk-profile** - Risk assessment (may inform gate decision severity)
- **test-design** - Test strategy (may inform TEST- issues)
- **trace-requirements** - Requirements traceability (may inform REQ- issues)
- **nfr-assess** - NFR validation (may inform SEC-, PERF-, REL-, MNT- issues)

**Typical Task Sequence**:
```
1. review-story (comprehensive review)
   ├─ risk-profile (risk assessment)
   ├─ test-design (test strategy)
   ├─ trace-requirements (requirements traceability)
   ├─ nfr-assess (NFR validation)
   └─ qa-gate (THIS TASK - final decision artifact)
```

**Inverse Dependencies** (tasks that depend on qa-gate):
- **apply-qa-fixes** - Uses gate file to prioritize fixes
- Workflow orchestration - Uses gate status to determine next steps

---

### File Dependencies

**Input Files**:
1. `.bmad-core/core-config.yaml` - Configuration file (REQUIRED)
   - Provides: `qa.qaLocation`, `qa.qaLocation/gates`, `devStoryLocation`
   - Format: YAML

2. `{devStoryLocation}/{epic}.{story}.*.md` - Story file (REQUIRED)
   - Provides: Story title (H1), QA Results section
   - Format: Markdown

3. Review findings - From `review-story` or manual review (REQUIRED)
   - Provides: Issues, acceptance criteria status, test coverage, NFR status
   - Format: Data structure (from review-story task) or manual notes

**Output Files**:
1. `{qa.qaLocation}/gates/{epic}.{story}-{slug}.yml` - Gate file (CREATED)
   - Format: YAML
   - Schema: Version 1

2. `{devStoryLocation}/{epic}.{story}.*.md` - Story file (UPDATED)
   - Format: Markdown
   - Section: `## QA Results` → `### Gate Status`

---

### Configuration Dependencies

**core-config.yaml Structure**:
```yaml
qa:
  qaLocation: 'docs/qa'                    # Base directory for QA outputs
  qaLocation/gates: 'docs/qa/gates'        # Subdirectory for gate files (derived)

devStoryLocation: 'docs/dev-stories'       # Location of story files

# Optional
technicalPreferences: '.bmad-core/data/technical-preferences.md'  # Not used by qa-gate
```

**Required Configuration Keys**:
- `qa.qaLocation` - Must exist, must be writable
- `devStoryLocation` - Must exist, must contain story files

**Optional Configuration Keys**:
- None (qa-gate uses minimal configuration)

---

### Agent Dependencies

**Primary Agent**: QA (Quinn)
- **Role**: Test Architect
- **Permissions**: Create gate files, update QA Results section in stories
- **Capabilities**: Quality assessment, issue prioritization, gate decision-making

**Secondary Agents** (may invoke qa-gate):
- **BMad-Orchestrator** - May call qa-gate as part of workflow orchestration
- **BMad-Master** - May call qa-gate in KB mode or standalone execution

---

### Data Dependencies

**Required Data**:
1. **Review findings** (from review-story or manual review):
   - Issues list (with severity, finding, suggested action)
   - Acceptance criteria status (met/unmet)
   - Test coverage metrics
   - NFR validation results
   - Code quality assessment

2. **Story context**:
   - Story ID (epic.story)
   - Story title (for slug generation)
   - Story status (for validation)

**Optional Data**:
- Previous gate file (for update scenario)
- Waiver request (for WAIVED scenario)
- Team preferences (for gate decision thresholds)

---

### External Tool Dependencies

**None** - qa-gate is self-contained and does not require external tools.

**File System Requirements**:
- Read access to `.bmad-core/core-config.yaml`
- Read access to story files in `devStoryLocation`
- Write access to `qa.qaLocation/gates` directory
- Write access to story files (for QA Results update)

---

### Template Dependencies

**None** - qa-gate does not use template files.

**Schema Definition** (embedded in task):
- Gate file schema is defined inline (schema version 1)
- No external template file required

---

### Checklist Dependencies

**None** - qa-gate does not use checklist files.

**Decision Logic** (embedded in task):
- Gate decision criteria are defined inline
- No external checklist required

---

## 9. Integration Points

### Integration Point 1: review-story Task (Primary Integration)

**Relationship**: qa-gate is typically invoked by review-story as final step.

**Integration Pattern**:
```
review-story workflow:
  Step 1: Risk assessment
  Step 2: Comprehensive analysis (6 dimensions)
  Step 3: Active refactoring
  Step 4: Standards compliance
  Step 5: Quality assessment
  Step 6: Create gate (calls qa-gate task) ← INTEGRATION POINT
```

**Data Flow**:
```
review-story → qa-gate
  - Issues list (prioritized)
  - Acceptance criteria status
  - Test coverage metrics
  - NFR validation results
  - Code quality findings
  - Recommended gate decision

qa-gate → outputs
  - Gate file (YAML)
  - Story update (markdown)
```

**Invocation Method**:
```python
# From review-story task
review_findings = perform_comprehensive_review(story_id)
gate_decision = determine_gate_decision(review_findings)

# Call qa-gate task
qa_gate_result = execute_task('qa-gate', {
    'story_id': story_id,
    'story_title': story_title,
    'gate_decision': gate_decision,
    'status_reason': synthesize_reason(review_findings),
    'top_issues': prioritize_issues(review_findings.issues),
    'waiver_details': None  # Not applicable for standard review
})
```

**Autonomy**: qa-gate can be called independently or as part of review-story workflow.

---

### Integration Point 2: apply-qa-fixes Task (Downstream Integration)

**Relationship**: apply-qa-fixes consumes gate file to prioritize fixes.

**Integration Pattern**:
```
qa-gate → gate file → apply-qa-fixes
  - Reads gate file to understand quality status
  - Uses top_issues array for fix prioritization
  - Uses severity values to sequence work
```

**Data Flow**:
```
apply-qa-fixes reads:
  - gate file: docs/qa/gates/{epic}.{story}-{slug}.yml
  - Extracts: top_issues, severity, suggested_action
  - Prioritizes: high → medium → low
```

**Dependency**:
- apply-qa-fixes requires gate file to exist
- Gate file provides deterministic priority order
- Severity values drive fix sequencing

---

### Integration Point 3: Workflow Orchestration (State-Driven Integration)

**Relationship**: Workflow orchestrator uses gate status to determine next steps.

**Integration Pattern**:
```
Workflow decision logic:
  IF gate == PASS THEN
    → Proceed to deployment
  ELSE IF gate == CONCERNS THEN
    → Notify team, track issues, proceed with caution
  ELSE IF gate == FAIL THEN
    → Return to Dev agent, apply fixes
  ELSE IF gate == WAIVED THEN
    → Proceed with documented acceptance
```

**State Transition**:
```
Story Status Lifecycle:
  InProgress → Review → [qa-gate] → Decision Point
    ├─ PASS → Done
    ├─ CONCERNS → Done (with tracking)
    ├─ FAIL → InProgress (apply-qa-fixes)
    └─ WAIVED → Done (with waiver)
```

**Workflow Integration**:
- Gate status is advisory, not blocking
- Workflow respects team decisions
- Waiver mechanism allows override

---

### Integration Point 4: Story File (Bidirectional Integration)

**Relationship**: qa-gate reads story file and updates it with gate reference.

**Read Operations**:
- Extract story title from H1 heading
- Read QA Results section for context
- Check for existing Gate Status subsection (update scenario)

**Write Operations**:
- Append/update Gate Status subsection in QA Results
- Add gate file reference link

**Integration Challenges**:
- Story file may have multiple QA reviews (versioning)
- Gate Status subsection may need to be replaced (not duplicated)
- Must preserve existing QA Results content

**Solution**:
```python
def update_story_with_gate(story_file, gate_reference):
    # Read story content
    content = read_file(story_file)

    # Locate QA Results section
    qa_results_section = extract_section(content, '## QA Results')

    # Check for existing Gate Status
    if '### Gate Status' in qa_results_section:
        # Replace existing Gate Status
        qa_results_section = replace_subsection(
            qa_results_section,
            '### Gate Status',
            gate_reference
        )
    else:
        # Append new Gate Status
        qa_results_section += f"\n\n{gate_reference}"

    # Write updated content
    write_file(story_file, content)
```

---

### Integration Point 5: Configuration System (Configuration-Driven Integration)

**Relationship**: qa-gate reads configuration to resolve file paths.

**Configuration Keys Used**:
- `qa.qaLocation` → Base directory for gate files
- `devStoryLocation` → Location of story files

**Integration Pattern**:
```python
# Load configuration
config = load_yaml('.bmad-core/core-config.yaml')

# Resolve paths
gate_dir = config['qa']['qaLocation'] + '/gates'
story_dir = config['devStoryLocation']

# Construct file paths
gate_file = f"{gate_dir}/{epic}.{story}-{slug}.yml"
story_file = f"{story_dir}/{epic}.{story}.*.md"
```

**Configuration Validation**:
- Validate qa.qaLocation exists and is writable
- Validate devStoryLocation exists and contains story files
- Create gate directory if it doesn't exist

---

### Integration Point 6: Manual QA Review (Human-in-the-Loop Integration)

**Relationship**: qa-gate can be invoked manually after human review.

**Integration Pattern**:
```
Human QA Reviewer:
  1. Manually reviews story implementation
  2. Documents findings in notes
  3. Invokes qa-gate task: *qa-gate 1.3
  4. Provides gate decision and issues interactively
```

**Interactive Flow**:
```
User: *qa-gate 1.3

QA Agent: Based on your review, what gate decision do you recommend?
  1. PASS - All criteria met, no issues
  2. CONCERNS - Non-blocking issues present
  3. FAIL - Critical issues, return to Dev
  4. WAIVED - Proceed despite known issues

User: 2 (CONCERNS)

QA Agent: Please provide 1-2 sentence explanation:

User: Missing rate limiting on auth endpoints poses security risk.

QA Agent: How many issues to document? (0-5)

User: 2

QA Agent: Issue 1:
  - ID: SEC-001
  - Severity (low/medium/high): high
  - Finding: No rate limiting on login endpoint
  - Suggested action: Add rate limiting middleware before production

[... continues for all issues ...]

QA Agent:
  ✓ Gate file created: docs/qa/gates/1.3-user-auth-login.yml
  ✓ Gate decision: CONCERNS
```

**Autonomy**: Human provides findings, agent generates gate file.

---

### Integration Point 7: Previous Gate File (Version Tracking Integration)

**Relationship**: qa-gate may read previous gate file for update scenarios.

**Integration Pattern**:
```
Update Scenario:
  1. Story returns to InProgress after FAIL/CONCERNS gate
  2. Dev applies fixes
  3. QA re-reviews story
  4. qa-gate creates NEW gate file (overwrites previous)
```

**Previous Gate Usage**:
- Read previous gate decision for comparison
- Track gate history (FAIL → CONCERNS → PASS progression)
- Inform risk assessment in review-story

**Implementation**:
```python
def check_previous_gate(story_id, slug):
    gate_file = f"{gate_dir}/{story_id}-{slug}.yml"

    if os.path.exists(gate_file):
        previous_gate = load_yaml(gate_file)
        return previous_gate['gate']  # FAIL, CONCERNS, etc.
    else:
        return None  # First-time gate
```

**Note**: BMad does not maintain gate version history by default. Each story has one current gate file, which is overwritten on updates.

---

## 10. Configuration References

### Primary Configuration File: core-config.yaml

**Location**: `.bmad-core/core-config.yaml`
**Format**: YAML
**Purpose**: Central configuration for BMad framework

---

### Configuration Section: qa

**Structure**:
```yaml
qa:
  qaLocation: 'docs/qa'                    # Base directory for QA outputs
  qaLocation/gates: 'docs/qa/gates'        # Derived subdirectory for gate files
  qaLocation/assessments: 'docs/qa/assessments'  # Derived subdirectory for assessments
```

**Used By qa-gate**:
- `qa.qaLocation` - Base directory for QA outputs (REQUIRED)
  - Purpose: Root directory for all QA artifacts
  - Example: `docs/qa`, `qa-artifacts`, `quality`
  - Validation: Must exist, must be writable

**Derived Paths** (constructed by qa-gate):
- `{qa.qaLocation}/gates` - Gate files subdirectory
  - Created if doesn't exist
  - Contains all gate YAML files

**Not Used By qa-gate**:
- `qa.qaLocation/assessments` - Used by other QA tasks (risk-profile, test-design, etc.)

---

### Configuration Section: devStoryLocation

**Structure**:
```yaml
devStoryLocation: 'docs/dev-stories'       # Location of story files
```

**Used By qa-gate**:
- `devStoryLocation` - Story file directory (REQUIRED)
  - Purpose: Location of story markdown files
  - Example: `docs/dev-stories`, `stories`, `dev/stories`
  - Validation: Must exist, must contain story files

**File Pattern**:
```
{devStoryLocation}/{epic}.{story}.*.md

Examples:
- docs/dev-stories/1.3.user-auth.md
- docs/dev-stories/2.5.payment-processing.backend.md
```

---

### Configuration Section: technicalPreferences (Not Used)

**Structure**:
```yaml
technicalPreferences: '.bmad-core/data/technical-preferences.md'
```

**Not Used By qa-gate**:
- qa-gate does not reference technical preferences
- Used by other tasks (create-next-story, review-story)

---

### Configuration Validation Logic

**At task start**:
```python
def validate_configuration():
    # Load configuration
    if not os.path.exists('.bmad-core/core-config.yaml'):
        raise ConfigurationError("core-config.yaml not found")

    config = load_yaml('.bmad-core/core-config.yaml')

    # Validate qa.qaLocation
    if 'qa' not in config or 'qaLocation' not in config['qa']:
        raise ConfigurationError("qa.qaLocation not configured")

    qa_location = config['qa']['qaLocation']
    if not os.path.exists(qa_location):
        raise ConfigurationError(f"qa.qaLocation directory not found: {qa_location}")

    # Validate devStoryLocation
    if 'devStoryLocation' not in config:
        raise ConfigurationError("devStoryLocation not configured")

    dev_story_location = config['devStoryLocation']
    if not os.path.exists(dev_story_location):
        raise ConfigurationError(f"devStoryLocation directory not found: {dev_story_location}")

    return config
```

---

### Configuration Defaults

**No Defaults** - qa-gate requires explicit configuration.

**Rationale**:
- File paths are project-specific
- No universal defaults that work across projects
- Explicit configuration prevents accidental file creation in wrong locations

---

### Configuration Examples

**Minimal Configuration**:
```yaml
qa:
  qaLocation: 'qa'
devStoryLocation: 'stories'
```

**Standard Configuration**:
```yaml
qa:
  qaLocation: 'docs/qa'
devStoryLocation: 'docs/dev-stories'
```

**Multi-Project Configuration**:
```yaml
qa:
  qaLocation: 'projects/alpha/qa'
devStoryLocation: 'projects/alpha/stories'
```

---

## 11. Best Practices & Patterns

### Best Practice 1: Gate File Naming Consistency

**Pattern**: Always use slug derived from story title.

**Slug Generation Rules** (strict):
```
1. Convert to lowercase
2. Replace spaces with hyphens
3. Strip punctuation (except hyphens)
4. Keep numbers and letters only
```

**Examples**:
```
Story Title: "User Authentication - Login"
Slug: "user-authentication-login"
Gate File: 1.3-user-authentication-login.yml

Story Title: "Payment Processing (Stripe)"
Slug: "payment-processing-stripe"
Gate File: 2.5-payment-processing-stripe.yml

Story Title: "Admin Dashboard: User Management"
Slug: "admin-dashboard-user-management"
Gate File: 3.1-admin-dashboard-user-management.yml
```

**Rationale**:
- Consistent naming enables predictable file lookups
- Slug uniqueness prevents file collisions
- Human-readable names aid debugging and navigation

---

### Best Practice 2: Status Reason Brevity

**Pattern**: Keep status_reason to 1-2 sentences maximum.

**Good Examples**:
```yaml
status_reason: 'All acceptance criteria met with comprehensive test coverage.'

status_reason: 'Missing rate limiting on auth endpoints poses security risk.'

status_reason: 'Critical bug in payment processing logic requires immediate fix.'

status_reason: 'Performance optimization deferred per Product Owner approval.'
```

**Bad Examples** (too verbose):
```yaml
# Too long - should be in review document, not gate file
status_reason: 'The implementation meets all functional requirements and the code quality is excellent. However, there are some minor concerns regarding the test coverage for edge cases, particularly around error handling. The team should consider adding more tests in the next sprint to address these gaps. Overall, the story is ready to proceed.'

# Too vague - not actionable
status_reason: 'Some issues found.'

# Too technical - should be in issues list
status_reason: 'Line 42 in auth.js has a SQL injection vulnerability due to unsanitized user input.'
```

**Rationale**:
- Gate file is summary artifact, not detailed documentation
- Brevity ensures quick understanding of gate decision
- Details belong in review document and issues list

---

### Best Practice 3: Issue Prioritization Discipline

**Pattern**: Only include top 3-5 issues in gate file.

**Prioritization Logic** (strict):
1. **By severity**: high > medium > low
2. **By category** (within same severity):
   - SEC- (security) → highest
   - REQ- (requirements)
   - ARCH- (architecture)
   - REL- (reliability)
   - PERF- (performance)
   - TEST- (testing)
   - MNT- (maintainability)
   - DOC- (documentation) → lowest

**Example**:
```
All Issues (10 total):
1. SEC-001 (high) - No rate limiting
2. ARCH-001 (high) - Circular dependency
3. TEST-001 (high) - Missing integration tests
4. REQ-001 (medium) - AC 6 partially met
5. PERF-001 (medium) - Slow query
6. MNT-001 (medium) - Code duplication
7. DOC-001 (low) - Missing comments
8. PERF-002 (low) - Unused index
9. MNT-002 (low) - Magic numbers
10. DOC-002 (low) - Outdated README

Top 5 for Gate File (prioritized):
1. SEC-001 (high) - Security > Architecture > Testing
2. ARCH-001 (high)
3. TEST-001 (high)
4. REQ-001 (medium) - Requirements > Performance > Maintainability
5. PERF-001 (medium)
```

**Rationale**:
- Gate file is decision artifact, not issue tracker
- Focus on most critical issues only
- Full issue list belongs in review document

---

### Best Practice 4: Waiver Documentation Discipline

**Pattern**: WAIVED gates require explicit approval and reason.

**Required Fields**:
```yaml
gate: WAIVED
waiver:
  active: true
  reason: '{specific reason for accepting issues}'
  approved_by: '{name or role of approver}'
```

**Good Examples**:
```yaml
waiver:
  active: true
  reason: 'MVP release - performance optimization deferred to v1.1'
  approved_by: 'Product Owner'

waiver:
  active: true
  reason: 'Known limitation documented in user guide, acceptable per stakeholder review'
  approved_by: 'Engineering Manager'
```

**Bad Examples**:
```yaml
# Missing approver
waiver:
  active: true
  reason: 'Deferring fixes'
  approved_by: ''

# Vague reason
waiver:
  active: true
  reason: 'Need to ship'
  approved_by: 'PM'
```

**Rationale**:
- Waivers create accountability for accepting issues
- Explicit approval prevents unauthorized risk acceptance
- Documentation enables future review and lessons learned

---

### Best Practice 5: Gate File Immutability (After Story Complete)

**Pattern**: Once story is Done, gate file should not be modified.

**Lifecycle**:
```
Story Status: Draft
  └─ No gate file yet

Story Status: InProgress
  └─ No gate file yet

Story Status: Review
  └─ Gate file created (first time)

Story Status: InProgress (after FAIL/CONCERNS)
  └─ Gate file overwritten (update)

Story Status: Done
  └─ Gate file is FINAL (do not modify)
```

**Rationale**:
- Gate file is quality record for completed story
- Modifying historical gates obscures quality trends
- Create new story for future changes, not modify old gates

---

### Best Practice 6: Severity Calibration Consistency

**Pattern**: Use severity values consistently across all stories.

**Severity Definitions** (strict):
```yaml
low:
  - Minor issues
  - Cosmetic problems
  - Documentation gaps
  - Code style violations
  - Examples:
      - Typo in comment
      - Unused variable
      - Missing docstring

medium:
  - Should fix soon
  - Not blocking release
  - Technical debt
  - Non-critical bugs
  - Examples:
      - Code duplication
      - Missing edge case test
      - Slow but functional query
      - Minor refactoring opportunity

high:
  - Critical issues
  - Should block release
  - Security vulnerabilities
  - Data loss risks
  - Examples:
      - SQL injection vulnerability
      - Unhandled error causing crash
      - Missing authentication check
      - Data corruption bug
```

**Calibration Across Team**:
- All QA reviewers use same severity definitions
- Regular calibration sessions to align on severity
- Examples library for reference

**Rationale**:
- Consistent severity enables reliable prioritization
- Prevents severity inflation (everything marked "high")
- Enables cross-story quality comparisons

---

### Best Practice 7: Gate Status as Advisory, Not Blocking

**Pattern**: Gate status guides decisions but doesn't enforce them.

**Advisory Philosophy**:
- PASS → Recommended to proceed
- CONCERNS → Proceed with awareness and tracking
- FAIL → Recommended to fix, but team can override with waiver
- WAIVED → Proceeding despite issues with approval

**Anti-Pattern**: Automated blocking based on gate status
```python
# WRONG - automated blocking
if gate_status == 'FAIL':
    prevent_deployment()
    block_story_completion()
```

**Correct Pattern**: Advisory guidance with team decision
```python
# CORRECT - advisory guidance
if gate_status == 'FAIL':
    notify_team("QA recommends returning story to InProgress")
    notify_team(f"See gate file for details: {gate_file_path}")
    # Team decides next action
```

**Rationale**:
- QA provides expert guidance, not arbitrary gatekeeping
- Teams own their quality decisions
- Context-aware decisions better than rigid rules

---

### Best Practice 8: Linking Gate Files in Story

**Pattern**: Always include relative path from project root.

**Good Examples**:
```markdown
Gate: PASS → docs/qa/gates/1.3-user-auth-login.yml

Gate: CONCERNS → qa/gates/2.5-payment-processing.yml
```

**Bad Examples**:
```markdown
# Absolute path - breaks portability
Gate: PASS → /Users/dev/project/docs/qa/gates/1.3-user-auth-login.yml

# No path - not clickable
Gate: PASS → 1.3-user-auth-login.yml

# Missing file extension
Gate: PASS → docs/qa/gates/1.3-user-auth-login
```

**Rationale**:
- Relative paths enable portability across environments
- Clickable links in IDE/editor for quick navigation
- Standard convention enables automated tooling

---

## 12. Anti-Patterns & Common Mistakes

### Anti-Pattern 1: Gate File as Comprehensive Issue Tracker

**Mistake**: Including all issues found in review.

**Example** (WRONG):
```yaml
top_issues:
  - id: 'SEC-001'
    severity: high
    finding: 'No rate limiting on login endpoint'
  - id: 'SEC-002'
    severity: medium
    finding: 'Missing HTTPS enforcement'
  - id: 'TEST-001'
    severity: high
    finding: 'No integration tests'
  - id: 'TEST-002'
    severity: medium
    finding: 'No edge case tests for AC 6'
  - id: 'TEST-003'
    severity: low
    finding: 'No E2E test for happy path'
  - id: 'PERF-001'
    severity: medium
    finding: 'Slow dashboard query'
  - id: 'PERF-002'
    severity: low
    finding: 'Unused database index'
  - id: 'MNT-001'
    severity: low
    finding: 'Code duplication in auth module'
  - id: 'MNT-002'
    severity: low
    finding: 'Magic numbers in config'
  - id: 'DOC-001'
    severity: low
    finding: 'Missing API documentation'
  # ... 15 more issues
```

**Why Wrong**:
- Gate file becomes unreadable
- Loses focus on top priorities
- Duplicates full review document

**Correct Approach**:
```yaml
top_issues:
  - id: 'SEC-001'
    severity: high
    finding: 'No rate limiting on login endpoint'
  - id: 'TEST-001'
    severity: high
    finding: 'No integration tests'
  - id: 'SEC-002'
    severity: medium
    finding: 'Missing HTTPS enforcement'
  - id: 'PERF-001'
    severity: medium
    finding: 'Slow dashboard query'
  - id: 'TEST-002'
    severity: medium
    finding: 'No edge case tests for AC 6'
# Full issue list in review document: docs/qa/reviews/1.3-comprehensive-review.md
```

**Fix**: Limit to top 5 issues, reference full review document for complete list.

---

### Anti-Pattern 2: Custom Severity Values

**Mistake**: Using severity values other than low/medium/high.

**Example** (WRONG):
```yaml
top_issues:
  - id: 'SEC-001'
    severity: critical      # WRONG - not in controlled vocabulary
  - id: 'TEST-001'
    severity: blocker       # WRONG
  - id: 'PERF-001'
    severity: minor         # WRONG
  - id: 'DOC-001'
    severity: trivial       # WRONG
```

**Why Wrong**:
- Breaks schema consistency
- Downstream tools expect fixed values (low/medium/high)
- Prevents automated severity-based prioritization

**Correct Approach**:
```yaml
top_issues:
  - id: 'SEC-001'
    severity: high          # CORRECT - critical → high
  - id: 'TEST-001'
    severity: high          # CORRECT - blocker → high
  - id: 'PERF-001'
    severity: low           # CORRECT - minor → low
  - id: 'DOC-001'
    severity: low           # CORRECT - trivial → low
```

**Fix**: Always use low/medium/high. Map other severity systems to these three values.

---

### Anti-Pattern 3: Verbose Status Reason

**Mistake**: Writing paragraph-length status_reason.

**Example** (WRONG):
```yaml
status_reason: 'The story implementation demonstrates good adherence to coding standards and the overall architecture is sound. However, during the comprehensive review, several areas of concern were identified that require attention. First, the authentication endpoints lack proper rate limiting, which could expose the system to brute-force attacks. Second, the integration test coverage is insufficient, particularly for error scenarios and edge cases. Third, there are some performance considerations around the dashboard query that should be addressed before scaling to production. Despite these issues, the core functionality works as expected and the acceptance criteria are generally met. The team should prioritize the security and testing concerns in the next iteration.'
```

**Why Wrong**:
- Gate file is for quick decision-making, not detailed analysis
- Verbose text reduces scanability
- Details belong in review document

**Correct Approach**:
```yaml
status_reason: 'Missing rate limiting on auth endpoints and insufficient integration test coverage pose quality risks.'
```

**Fix**: Limit to 1-2 sentences (approximately 200 characters). Details in review document.

---

### Anti-Pattern 4: WAIVED Without Approval

**Mistake**: Setting gate to WAIVED without waiver.approved_by.

**Example** (WRONG):
```yaml
gate: WAIVED
waiver:
  active: true
  reason: 'Need to ship MVP'
  approved_by: ''           # WRONG - missing approver
```

**Why Wrong**:
- No accountability for accepting issues
- Violates waiver governance
- Risks accumulating technical debt without oversight

**Correct Approach**:
```yaml
gate: WAIVED
waiver:
  active: true
  reason: 'MVP release - performance optimization deferred to v1.1'
  approved_by: 'Product Owner'
```

**Fix**: Always require explicit approval with name/role. Reject WAIVED gates without approver.

---

### Anti-Pattern 5: Duplicate Gate Status in Story

**Mistake**: Appending new Gate Status instead of replacing existing.

**Example** (WRONG):
```markdown
## QA Results

### Review Date: 2025-01-10
[... first review ...]

### Gate Status
Gate: FAIL → docs/qa/gates/1.3-user-auth-login.yml

### Review Date: 2025-01-12
[... second review ...]

### Gate Status
Gate: CONCERNS → docs/qa/gates/1.3-user-auth-login.yml

### Review Date: 2025-01-14
[... third review ...]

### Gate Status
Gate: PASS → docs/qa/gates/1.3-user-auth-login.yml
```

**Why Wrong**:
- Multiple gate references confusing (which is current?)
- Story file becomes cluttered with historical gates
- Violates "one current gate" principle

**Correct Approach**:
```markdown
## QA Results

### Review Date: 2025-01-10
[... first review ...]

### Review Date: 2025-01-12
[... second review ...]

### Review Date: 2025-01-14
[... third review ...]

### Gate Status
Gate: PASS → docs/qa/gates/1.3-user-auth-login.yml
```

**Fix**: Replace existing Gate Status subsection on update, don't append.

---

### Anti-Pattern 6: Using Gate for Requirements Validation

**Mistake**: Using qa-gate to validate if story meets requirements.

**Example** (WRONG):
```
User: *qa-gate 1.3

QA Agent: Reviewing acceptance criteria...
  - AC 1: User can log in → NOT MET (form doesn't exist)
  - AC 2: Password validation → NOT MET (not implemented)
  - AC 3: Session management → NOT MET (not implemented)

Gate: FAIL
Reason: Story incomplete - acceptance criteria not met
```

**Why Wrong**:
- qa-gate assumes review already performed
- qa-gate is not a requirements validation tool
- Use validate-next-story for requirements checking

**Correct Approach**:
```
User: *validate 1.3  (FIRST - requirements validation)

PO Agent: Story validation results:
  - AC 1-3: NOT MET
  - Story not ready for development
  Decision: NO-GO

[... Dev completes implementation ...]

User: *review 1.3  (SECOND - comprehensive review)

QA Agent: Review complete. All ACs met. Creating gate...

[... qa-gate called automatically ...]

Gate: PASS
```

**Fix**: Use qa-gate only after story implementation is complete and reviewed.

---

### Anti-Pattern 7: Inconsistent Issue ID Prefixes

**Mistake**: Using non-standard or inconsistent issue ID prefixes.

**Example** (WRONG):
```yaml
top_issues:
  - id: 'SECURITY-001'      # WRONG - should be SEC-001
  - id: 'BUG-001'           # WRONG - should be REQ-001 or ARCH-001
  - id: 'TESTGAP-001'       # WRONG - should be TEST-001
  - id: '001'               # WRONG - missing prefix entirely
  - id: 'P1-PERF-001'       # WRONG - extra priority prefix
```

**Why Wrong**:
- Breaks automated categorization
- Inconsistent naming prevents pattern matching
- Reduces scanability and organization

**Correct Approach**:
```yaml
top_issues:
  - id: 'SEC-001'           # CORRECT
  - id: 'REQ-001'           # CORRECT
  - id: 'TEST-001'          # CORRECT
  - id: 'PERF-001'          # CORRECT
  - id: 'ARCH-001'          # CORRECT
```

**Standard Prefixes**:
- SEC- (security)
- REQ- (requirements)
- ARCH- (architecture)
- REL- (reliability)
- PERF- (performance)
- TEST- (testing)
- MNT- (maintainability)
- DOC- (documentation)

**Fix**: Always use standard prefixes. No variations allowed.

---

### Anti-Pattern 8: Gate File in Wrong Location

**Mistake**: Creating gate file outside of configured qa.qaLocation/gates directory.

**Example** (WRONG):
```python
# Hardcoded path - ignores configuration
gate_file = f"qa-gates/{story_id}-{slug}.yml"

# Relative to story file - wrong location
gate_file = f"{story_dir}/gates/{story_id}-{slug}.yml"

# User home directory - completely wrong
gate_file = f"~/gates/{story_id}-{slug}.yml"
```

**Why Wrong**:
- Violates configuration-driven design
- Creates gate files in unpredictable locations
- Breaks downstream tools expecting standard path

**Correct Approach**:
```python
# Load configuration
config = load_yaml('.bmad-core/core-config.yaml')

# Resolve path from configuration
gate_dir = config['qa']['qaLocation'] + '/gates'
gate_file = f"{gate_dir}/{story_id}-{slug}.yml"
```

**Fix**: Always read qa.qaLocation from core-config.yaml. Never hardcode paths.

---

## 13. Performance Considerations

### Performance Factor 1: Task Execution Time

**Expected Execution Time**: < 5 seconds for typical gate creation

**Breakdown**:
- Configuration loading: < 100ms
- Story file reading: < 200ms
- Slug generation: < 10ms
- Gate decision logic: < 100ms
- YAML generation: < 50ms
- File writing (gate file): < 100ms
- Story file update: < 200ms
- Validation: < 100ms
- **Total**: ~860ms

**Factors Affecting Performance**:
- Story file size (larger files take longer to read/update)
- Number of issues (more issues = more prioritization computation)
- File system I/O speed
- YAML parsing/generation speed

**Optimization Strategies**:
- Cache configuration (don't reload for every task)
- Use efficient YAML parser (e.g., ruamel.yaml, PyYAML with C bindings)
- Minimize file system calls (batch operations)
- Stream story file updates (don't load entire file if appending)

---

### Performance Factor 2: Concurrent Gate Creation

**Scenario**: Multiple qa-gate tasks running in parallel.

**Potential Issues**:
- File system contention (multiple writes to same directory)
- Race conditions (two tasks updating same story file)
- Directory creation conflicts

**Mitigation Strategies**:
1. **File Locking** (for story updates):
   ```python
   import fcntl

   with open(story_file, 'a') as f:
       fcntl.flock(f, fcntl.LOCK_EX)  # Exclusive lock
       f.write(gate_reference)
       fcntl.flock(f, fcntl.LOCK_UN)  # Release lock
   ```

2. **Atomic Directory Creation**:
   ```python
   os.makedirs(gate_dir, exist_ok=True)  # No error if already exists
   ```

3. **Unique Filenames** (prevent collisions):
   - Each story has unique ID → unique gate file
   - No risk of filename collisions

**Scalability**: qa-gate scales well horizontally (independent story gates).

---

### Performance Factor 3: Large Issue Lists

**Scenario**: Review findings contain 50+ issues.

**Performance Impact**:
- Issue prioritization: O(n log n) sorting
- For 50 issues: ~300 comparisons
- For 100 issues: ~700 comparisons
- **Impact**: Minimal (< 10ms even for 100 issues)

**Optimization**:
- Use efficient sorting algorithm (Python's Timsort is O(n log n))
- Early termination (stop after top 5 selected)

```python
def prioritize_issues_optimized(all_issues):
    # Partial sort - only find top 5
    import heapq
    top_5 = heapq.nlargest(5, all_issues, key=priority_score)
    return top_5
```

**Improvement**: O(n log k) where k=5, faster than full sort for large n.

---

### Performance Factor 4: Story File Size

**Scenario**: Large story files (10,000+ lines) with extensive QA Results.

**Performance Impact**:
- Reading entire file: ~500ms for 10,000 lines
- Locating QA Results section: ~100ms
- Appending Gate Status: ~200ms
- Writing updated file: ~500ms
- **Total**: ~1,300ms

**Optimization**:
- Use streaming updates (append-only, don't rewrite entire file)
- Index QA Results section location (cache for multiple updates)
- Compress historical review content (move to separate files)

**Alternative Approach**:
```python
# Append-only update (faster than full file rewrite)
with open(story_file, 'a') as f:
    # Assumes QA Results section already exists
    f.write(f"\n\n### Gate Status\n\nGate: {status} → {gate_file}\n")
```

**Trade-off**: Append-only is faster but doesn't replace existing Gate Status (may duplicate).

---

### Performance Factor 5: YAML Generation and Validation

**Scenario**: Complex gate data with many issues.

**Performance Impact**:
- YAML serialization: ~50ms
- YAML validation (parse roundtrip): ~50ms
- **Total**: ~100ms

**Optimization**:
- Use fast YAML library (ruamel.yaml with C extensions)
- Skip validation in production (validate in dev/test only)
- Pre-compile schema validators

**Benchmark** (Python):
```python
import yaml
import time

gate_data = {...}  # Full gate structure

# Benchmark serialization
start = time.time()
yaml_output = yaml.dump(gate_data)
serialization_time = time.time() - start
# Result: ~50ms

# Benchmark validation
start = time.time()
validated = yaml.safe_load(yaml_output)
validation_time = time.time() - start
# Result: ~50ms
```

---

### Performance Factor 6: Configuration Loading

**Scenario**: core-config.yaml loaded for every qa-gate task.

**Performance Impact**:
- File read: ~50ms
- YAML parsing: ~50ms
- **Total**: ~100ms

**Optimization**:
- Cache configuration in memory (singleton pattern)
- Reload only on file modification (watch file mtime)

```python
_config_cache = None
_config_mtime = None

def load_config_cached():
    global _config_cache, _config_mtime

    config_path = '.bmad-core/core-config.yaml'
    current_mtime = os.path.getmtime(config_path)

    if _config_cache is None or current_mtime != _config_mtime:
        # Load and cache
        _config_cache = load_yaml(config_path)
        _config_mtime = current_mtime

    return _config_cache
```

**Improvement**: ~100ms → ~1ms for subsequent calls (99% reduction).

---

### Performance Factor 7: Network File Systems

**Scenario**: qa-gate running on network-mounted file systems (NFS, SMB).

**Performance Impact**:
- File I/O latency: 10-100x slower than local disk
- Gate file write: ~100ms → ~1-10 seconds
- Story file update: ~200ms → ~2-20 seconds

**Mitigation Strategies**:
1. **Use local temp files, then copy**:
   ```python
   # Write to local temp file
   temp_gate = '/tmp/gate-temp.yml'
   write_yaml(temp_gate, gate_data)

   # Copy to network location
   shutil.copy(temp_gate, gate_file_path)
   ```

2. **Batch operations** (reduce round-trips)
3. **Async writes** (non-blocking)

---

### Performance Recommendations

1. **Cache configuration** - Avoid reloading core-config.yaml for every task
2. **Use append-only updates** - For story file updates, when safe
3. **Optimize YAML library** - Use C-based YAML parsers
4. **File locking** - Prevent race conditions in concurrent scenarios
5. **Partial sorting** - Use heapq.nlargest for top-K selection
6. **Network awareness** - Detect network file systems and use local temp files

**Target Performance**: < 1 second for 95% of gate creations.

---

## 14. Security Considerations

### Security Consideration 1: File Path Injection

**Risk**: Malicious story_id or slug could escape directory boundaries.

**Attack Vector**:
```python
# Malicious input
story_id = "../../etc/passwd"
slug = "../../../sensitive-data"

# Vulnerable code
gate_file = f"{gate_dir}/{story_id}-{slug}.yml"
# Result: /docs/qa/gates/../../etc/passwd-../../../sensitive-data.yml
# Resolves to: /etc/passwd-../../../sensitive-data.yml (path traversal!)
```

**Mitigation**:
```python
import os

def sanitize_path_component(component):
    # Remove directory traversal characters
    component = component.replace('..', '')
    component = component.replace('/', '')
    component = component.replace('\\', '')

    # Remove null bytes
    component = component.replace('\x00', '')

    return component

# Safe code
story_id = sanitize_path_component(story_id)
slug = sanitize_path_component(slug)
gate_file = f"{gate_dir}/{story_id}-{slug}.yml"

# Validate final path is within gate directory
gate_file_abs = os.path.abspath(gate_file)
gate_dir_abs = os.path.abspath(gate_dir)

if not gate_file_abs.startswith(gate_dir_abs):
    raise SecurityError("Invalid file path (directory traversal attempted)")
```

**Best Practice**: Always sanitize user-provided path components.

---

### Security Consideration 2: YAML Injection

**Risk**: Malicious content in status_reason or findings could execute code.

**Attack Vector**:
```yaml
# Malicious input
status_reason: '!!python/object/apply:os.system ["rm -rf /"]'

# Vulnerable YAML parsing
gate_data = yaml.load(malicious_yaml)  # DANGEROUS - executes code!
```

**Mitigation**:
```python
# Always use safe_load (not load)
gate_data = yaml.safe_load(yaml_content)  # SAFE - no code execution

# Or use safe_dump for output
yaml_output = yaml.safe_dump(gate_data)  # SAFE - no executable tags
```

**Best Practice**: Use yaml.safe_load and yaml.safe_dump exclusively. Never use yaml.load.

---

### Security Consideration 3: Sensitive Data in Gate Files

**Risk**: Gate files may contain sensitive information (e.g., security vulnerabilities).

**Exposure**:
- Gate files are plain text YAML
- May be committed to version control
- May be shared with stakeholders
- May contain details of security vulnerabilities

**Mitigation Strategies**:

1. **Avoid detailed vulnerability descriptions**:
   ```yaml
   # WRONG - reveals exploit details
   finding: 'SQL injection in auth endpoint at /api/login via username parameter using quote bypass'

   # CORRECT - high-level description
   finding: 'SQL injection vulnerability in auth endpoint'
   suggested_action: 'Sanitize user inputs and use parameterized queries'
   ```

2. **Use separate private security tracking**:
   - Gate file: High-level issue reference
   - Private security tracker: Detailed vulnerability information

3. **Restrict gate file access**:
   - Use file permissions (chmod 640)
   - Encrypt sensitive gate files
   - Use .gitignore for sensitive gates

---

### Security Consideration 4: Configuration File Tampering

**Risk**: Malicious modification of core-config.yaml could redirect gate files.

**Attack Vector**:
```yaml
# Attacker modifies core-config.yaml
qa:
  qaLocation: '/attacker-controlled/directory'  # Exfiltration target
```

**Mitigation**:

1. **File permissions** (restrict write access):
   ```bash
   chmod 644 .bmad-core/core-config.yaml  # Read-only for non-owners
   ```

2. **Configuration validation**:
   ```python
   def validate_config_path(path):
       # Ensure path is within project directory
       project_root = os.path.abspath('.')
       config_path = os.path.abspath(path)

       if not config_path.startswith(project_root):
           raise SecurityError("Configuration path outside project directory")
   ```

3. **Configuration signing** (advanced):
   - Sign core-config.yaml with hash
   - Validate hash before use
   - Detect tampering

---

### Security Consideration 5: Story File Injection

**Risk**: Malicious content in story file could be executed when updated.

**Attack Vector**:
```markdown
## QA Results

<script>alert('XSS')</script>

### Gate Status
Gate: PASS → docs/qa/gates/1.3-user-auth-login.yml
```

**Mitigation**:

1. **qa-gate only appends text** (no script execution):
   - Markdown is rendered, not executed
   - No dynamic content generation

2. **Sanitize gate reference output**:
   ```python
   def sanitize_markdown(text):
       # Escape HTML/script tags
       text = text.replace('<', '&lt;')
       text = text.replace('>', '&gt;')
       return text
   ```

3. **Trust story file source**:
   - Story files should be version-controlled
   - Code review before merge

---

### Security Consideration 6: Waiver Approval Spoofing

**Risk**: Unauthorized user claims Product Owner approval for waiver.

**Attack Vector**:
```yaml
gate: WAIVED
waiver:
  active: true
  reason: 'Deferring security fixes'
  approved_by: 'Product Owner'  # SPOOFED - not actually approved
```

**Mitigation**:

1. **Require digital signature** (advanced):
   ```yaml
   waiver:
     active: true
     reason: 'MVP release - deferred fixes'
     approved_by: 'Product Owner'
     signature: 'SHA256:abc123...'  # Digital signature of approval
   ```

2. **Audit trail**:
   - Log all waiver creations
   - Include timestamp and creating agent
   - Periodic waiver review

3. **Approval workflow**:
   - Separate approval step (not in qa-gate)
   - Email confirmation from approver
   - Approval token validation

---

### Security Consideration 7: Race Conditions in Concurrent Updates

**Risk**: Two qa-gate tasks updating same story file simultaneously.

**Attack Vector**:
```
Task A: Read story file
Task B: Read story file
Task A: Append Gate Status
Task B: Append Gate Status (overwrites Task A's update)
```

**Mitigation**:

1. **File locking**:
   ```python
   import fcntl

   with open(story_file, 'a') as f:
       fcntl.flock(f, fcntl.LOCK_EX)  # Exclusive lock
       f.write(gate_reference)
       fcntl.flock(f, fcntl.LOCK_UN)  # Release lock
   ```

2. **Atomic file operations**:
   ```python
   # Write to temp file
   temp_file = f"{story_file}.tmp"
   write_file(temp_file, updated_content)

   # Atomic rename (POSIX guarantee)
   os.rename(temp_file, story_file)
   ```

---

### Security Best Practices Summary

1. **Sanitize all user inputs** (story_id, slug, status_reason)
2. **Use yaml.safe_load and yaml.safe_dump** (prevent code execution)
3. **Validate file paths** (prevent directory traversal)
4. **Restrict gate file access** (file permissions, encryption)
5. **Use file locking** (prevent race conditions)
6. **Audit waivers** (prevent approval spoofing)
7. **Minimize sensitive data in gates** (high-level descriptions only)

---

## 15. Testing & Validation

### Testing Strategy 1: Unit Tests for Core Logic

**Test Categories**:
1. Gate decision logic
2. Issue prioritization
3. Slug generation
4. YAML generation
5. File path resolution

**Example Unit Tests**:

```python
import unittest

class TestGateDecision(unittest.TestCase):

    def test_gate_pass_when_no_issues(self):
        findings = {
            'high_severity_issues': 0,
            'medium_severity_issues': 0,
            'low_severity_issues': 0,
            'acceptance_criteria_unmet': 0,
            'all_criteria_met': True
        }
        gate = determine_gate_status(findings)
        self.assertEqual(gate, 'PASS')

    def test_gate_fail_when_high_severity_issues(self):
        findings = {
            'high_severity_issues': 1,
            'medium_severity_issues': 0,
            'low_severity_issues': 0,
            'acceptance_criteria_unmet': 0,
            'all_criteria_met': True
        }
        gate = determine_gate_status(findings)
        self.assertEqual(gate, 'FAIL')

    def test_gate_concerns_when_medium_severity_issues(self):
        findings = {
            'high_severity_issues': 0,
            'medium_severity_issues': 2,
            'low_severity_issues': 1,
            'acceptance_criteria_unmet': 0,
            'all_criteria_met': True
        }
        gate = determine_gate_status(findings)
        self.assertEqual(gate, 'CONCERNS')

    def test_gate_waived_when_approved(self):
        findings = {
            'high_severity_issues': 1,
            'waiver_requested': True,
            'waiver_approved': True
        }
        gate = determine_gate_status(findings)
        self.assertEqual(gate, 'WAIVED')


class TestIssuePrioritization(unittest.TestCase):

    def test_prioritize_by_severity(self):
        issues = [
            {'id': 'TEST-001', 'severity': 'low'},
            {'id': 'SEC-001', 'severity': 'high'},
            {'id': 'PERF-001', 'severity': 'medium'}
        ]
        top_issues = prioritize_issues(issues)
        self.assertEqual(top_issues[0]['id'], 'SEC-001')  # high first

    def test_prioritize_by_category_within_severity(self):
        issues = [
            {'id': 'PERF-001', 'severity': 'high'},
            {'id': 'SEC-001', 'severity': 'high'},
            {'id': 'TEST-001', 'severity': 'high'}
        ]
        top_issues = prioritize_issues(issues)
        self.assertEqual(top_issues[0]['id'], 'SEC-001')  # SEC- before PERF-

    def test_limit_top_5_issues(self):
        issues = [{'id': f'TEST-{i:03d}', 'severity': 'medium'} for i in range(10)]
        top_issues = prioritize_issues(issues)
        self.assertEqual(len(top_issues), 5)


class TestSlugGeneration(unittest.TestCase):

    def test_slug_lowercase(self):
        title = "User Authentication"
        slug = generate_slug(title)
        self.assertEqual(slug, "user-authentication")

    def test_slug_spaces_to_hyphens(self):
        title = "User   Auth   Login"
        slug = generate_slug(title)
        self.assertEqual(slug, "user-auth-login")

    def test_slug_strip_punctuation(self):
        title = "User Auth - Login!"
        slug = generate_slug(title)
        self.assertEqual(slug, "user-auth-login")

    def test_slug_keep_numbers(self):
        title = "User Auth v2.0"
        slug = generate_slug(title)
        self.assertEqual(slug, "user-auth-v20")


class TestYAMLGeneration(unittest.TestCase):

    def test_minimal_schema(self):
        gate_data = {
            'schema': 1,
            'story': '1.3',
            'gate': 'PASS',
            'status_reason': 'All criteria met.',
            'reviewer': 'Quinn',
            'updated': '2025-01-12T10:00:00Z',
            'top_issues': [],
            'waiver': {'active': False}
        }
        yaml_output = yaml.safe_dump(gate_data)
        self.assertIn('schema: 1', yaml_output)
        self.assertIn('gate: PASS', yaml_output)

    def test_schema_with_issues(self):
        gate_data = {
            'schema': 1,
            'story': '1.3',
            'gate': 'CONCERNS',
            'status_reason': 'Some issues found.',
            'reviewer': 'Quinn',
            'updated': '2025-01-12T10:00:00Z',
            'top_issues': [
                {
                    'id': 'SEC-001',
                    'severity': 'high',
                    'finding': 'No rate limiting',
                    'suggested_action': 'Add rate limiting'
                }
            ],
            'waiver': {'active': False}
        }
        yaml_output = yaml.safe_dump(gate_data)
        self.assertIn('top_issues:', yaml_output)
        self.assertIn('SEC-001', yaml_output)
```

---

### Testing Strategy 2: Integration Tests

**Test Scenarios**:
1. End-to-end gate creation (config → gate file → story update)
2. Gate file update scenario (overwrite existing gate)
3. Waiver scenario (WAIVED gate with approval)
4. Error scenarios (missing config, invalid input)

**Example Integration Tests**:

```python
import os
import tempfile
import shutil

class TestGateCreationIntegration(unittest.TestCase):

    def setUp(self):
        # Create temporary project directory
        self.project_dir = tempfile.mkdtemp()
        self.config_path = os.path.join(self.project_dir, '.bmad-core', 'core-config.yaml')
        self.gate_dir = os.path.join(self.project_dir, 'docs', 'qa', 'gates')
        self.story_dir = os.path.join(self.project_dir, 'docs', 'dev-stories')

        # Create directories
        os.makedirs(os.path.dirname(self.config_path))
        os.makedirs(self.gate_dir)
        os.makedirs(self.story_dir)

        # Create config file
        config = {
            'qa': {'qaLocation': 'docs/qa'},
            'devStoryLocation': 'docs/dev-stories'
        }
        with open(self.config_path, 'w') as f:
            yaml.dump(config, f)

        # Create story file
        self.story_file = os.path.join(self.story_dir, '1.3.user-auth.md')
        with open(self.story_file, 'w') as f:
            f.write("# User Authentication\n\n## QA Results\n\n")

    def tearDown(self):
        # Clean up temp directory
        shutil.rmtree(self.project_dir)

    def test_create_gate_pass(self):
        # Execute qa-gate task
        result = execute_qa_gate(
            story_id='1.3',
            story_title='User Authentication',
            gate_decision='PASS',
            status_reason='All criteria met.',
            top_issues=[],
            project_dir=self.project_dir
        )

        # Verify gate file created
        gate_file = os.path.join(self.gate_dir, '1.3-user-authentication.yml')
        self.assertTrue(os.path.exists(gate_file))

        # Verify gate content
        with open(gate_file) as f:
            gate_data = yaml.safe_load(f)
        self.assertEqual(gate_data['gate'], 'PASS')
        self.assertEqual(gate_data['story'], '1.3')

        # Verify story updated
        with open(self.story_file) as f:
            story_content = f.read()
        self.assertIn('### Gate Status', story_content)
        self.assertIn('Gate: PASS', story_content)

    def test_create_gate_with_issues(self):
        top_issues = [
            {
                'id': 'SEC-001',
                'severity': 'high',
                'finding': 'No rate limiting',
                'suggested_action': 'Add rate limiting'
            }
        ]

        result = execute_qa_gate(
            story_id='1.3',
            story_title='User Authentication',
            gate_decision='FAIL',
            status_reason='Critical security issue found.',
            top_issues=top_issues,
            project_dir=self.project_dir
        )

        # Verify gate file content
        gate_file = os.path.join(self.gate_dir, '1.3-user-authentication.yml')
        with open(gate_file) as f:
            gate_data = yaml.safe_load(f)

        self.assertEqual(gate_data['gate'], 'FAIL')
        self.assertEqual(len(gate_data['top_issues']), 1)
        self.assertEqual(gate_data['top_issues'][0]['id'], 'SEC-001')

    def test_update_existing_gate(self):
        # Create initial gate (FAIL)
        execute_qa_gate(
            story_id='1.3',
            story_title='User Authentication',
            gate_decision='FAIL',
            status_reason='Critical issues found.',
            top_issues=[],
            project_dir=self.project_dir
        )

        # Update gate (PASS after fixes)
        execute_qa_gate(
            story_id='1.3',
            story_title='User Authentication',
            gate_decision='PASS',
            status_reason='All issues resolved.',
            top_issues=[],
            project_dir=self.project_dir
        )

        # Verify gate file updated
        gate_file = os.path.join(self.gate_dir, '1.3-user-authentication.yml')
        with open(gate_file) as f:
            gate_data = yaml.safe_load(f)
        self.assertEqual(gate_data['gate'], 'PASS')

        # Verify story has only one Gate Status
        with open(self.story_file) as f:
            story_content = f.read()
        gate_count = story_content.count('### Gate Status')
        self.assertEqual(gate_count, 1)
```

---

### Testing Strategy 3: Validation Tests

**Test Scenarios**:
1. Schema validation (required fields present)
2. Value validation (gate, severity in controlled vocabulary)
3. Waiver consistency (active=true when gate=WAIVED)
4. File path security (no directory traversal)

**Example Validation Tests**:

```python
class TestSchemaValidation(unittest.TestCase):

    def test_validate_minimal_schema(self):
        gate_data = {
            'schema': 1,
            'story': '1.3',
            'gate': 'PASS',
            'status_reason': 'All criteria met.',
            'reviewer': 'Quinn',
            'updated': '2025-01-12T10:00:00Z',
            'top_issues': [],
            'waiver': {'active': False}
        }
        is_valid = validate_gate_data(gate_data)
        self.assertTrue(is_valid)

    def test_validate_missing_required_field(self):
        gate_data = {
            'schema': 1,
            'story': '1.3',
            # Missing 'gate' field
            'status_reason': 'All criteria met.',
            'reviewer': 'Quinn',
            'updated': '2025-01-12T10:00:00Z',
            'top_issues': [],
            'waiver': {'active': False}
        }
        with self.assertRaises(ValidationError):
            validate_gate_data(gate_data)

    def test_validate_invalid_gate_value(self):
        gate_data = {
            'schema': 1,
            'story': '1.3',
            'gate': 'MAYBE',  # Invalid value
            'status_reason': 'Uncertain.',
            'reviewer': 'Quinn',
            'updated': '2025-01-12T10:00:00Z',
            'top_issues': [],
            'waiver': {'active': False}
        }
        with self.assertRaises(ValidationError):
            validate_gate_data(gate_data)

    def test_validate_invalid_severity(self):
        gate_data = {
            'schema': 1,
            'story': '1.3',
            'gate': 'CONCERNS',
            'status_reason': 'Some issues.',
            'reviewer': 'Quinn',
            'updated': '2025-01-12T10:00:00Z',
            'top_issues': [
                {
                    'id': 'SEC-001',
                    'severity': 'critical',  # Invalid severity
                    'finding': 'Issue',
                    'suggested_action': 'Fix it'
                }
            ],
            'waiver': {'active': False}
        }
        with self.assertRaises(ValidationError):
            validate_gate_data(gate_data)

    def test_validate_waiver_consistency(self):
        # WAIVED gate with active=false should fail
        gate_data = {
            'schema': 1,
            'story': '1.3',
            'gate': 'WAIVED',
            'status_reason': 'Accepted.',
            'reviewer': 'Quinn',
            'updated': '2025-01-12T10:00:00Z',
            'top_issues': [],
            'waiver': {'active': False}  # Inconsistent!
        }
        with self.assertRaises(ValidationError):
            validate_gate_data(gate_data)
```

---

### Testing Strategy 4: Error Handling Tests

**Test Scenarios**:
1. Missing configuration file
2. Missing story file
3. Invalid file permissions
4. YAML parsing errors
5. File system errors

**Example Error Handling Tests**:

```python
class TestErrorHandling(unittest.TestCase):

    def test_missing_config_file(self):
        # No core-config.yaml
        with self.assertRaises(ConfigurationError):
            execute_qa_gate(
                story_id='1.3',
                story_title='Test',
                gate_decision='PASS',
                status_reason='Test',
                top_issues=[],
                project_dir='/nonexistent'
            )

    def test_missing_story_file(self):
        # Config exists but story file doesn't
        with self.assertRaises(StoryNotFoundError):
            execute_qa_gate(
                story_id='9.99',  # Nonexistent story
                story_title='Test',
                gate_decision='PASS',
                status_reason='Test',
                top_issues=[],
                project_dir=self.project_dir
            )

    def test_file_permission_error(self):
        # Make gate directory read-only
        os.chmod(self.gate_dir, 0o444)

        with self.assertRaises(FileSystemError):
            execute_qa_gate(
                story_id='1.3',
                story_title='Test',
                gate_decision='PASS',
                status_reason='Test',
                top_issues=[],
                project_dir=self.project_dir
            )

        # Restore permissions
        os.chmod(self.gate_dir, 0o755)
```

---

### Testing Strategy 5: Security Tests

**Test Scenarios**:
1. Path traversal prevention
2. YAML injection prevention
3. Input sanitization

**Example Security Tests**:

```python
class TestSecurity(unittest.TestCase):

    def test_prevent_path_traversal(self):
        # Attempt directory traversal in story_id
        with self.assertRaises(SecurityError):
            execute_qa_gate(
                story_id='../../etc/passwd',
                story_title='Test',
                gate_decision='PASS',
                status_reason='Test',
                top_issues=[],
                project_dir=self.project_dir
            )

    def test_sanitize_slug(self):
        # Malicious slug with path traversal
        slug = sanitize_path_component('../../../sensitive')
        self.assertNotIn('..', slug)
        self.assertNotIn('/', slug)

    def test_yaml_safe_load(self):
        # Attempt YAML injection
        malicious_yaml = "!!python/object/apply:os.system ['echo pwned']"

        with self.assertRaises(yaml.YAMLError):
            yaml.safe_load(malicious_yaml)
```

---

### Test Coverage Goals

**Target Coverage**: 90%+ for qa-gate task

**Coverage by Component**:
- Gate decision logic: 100%
- Issue prioritization: 100%
- Slug generation: 100%
- YAML generation: 95%
- File operations: 85%
- Error handling: 90%
- Security validation: 100%

**Coverage Gaps** (acceptable):
- File system edge cases (network failures)
- Rare error conditions (disk full)
- Platform-specific behaviors

---

## 16. ADK Translation Recommendations

### ADK Service Mapping

**Recommended GCP Service**: **Cloud Functions (2nd gen)**

**Rationale**:
- qa-gate is a simple, stateless task (not complex multi-step workflow)
- Execution time < 5 seconds (well within Cloud Functions limits)
- No multi-step reasoning required
- No state management across steps
- Clear input → output pattern

**Alternative**: Cloud Run (if need for custom container environment)

---

### ADK Agent Integration

**Agent**: QA (Quinn)
**Tool Registration**:

```python
from vertexai.preview import reasoning_engines

# Register qa-gate as QA agent tool
qa_agent = reasoning_engines.LangchainAgent(
    model="gemini-2.0-flash-001",
    tools=[
        {
            "name": "qa_gate",
            "description": "Create or update quality gate decision file for a story",
            "parameters": {
                "type": "object",
                "properties": {
                    "story_id": {
                        "type": "string",
                        "description": "Story ID in format epic.story (e.g., '1.3')"
                    },
                    "story_title": {
                        "type": "string",
                        "description": "Story title for slug generation"
                    },
                    "gate_decision": {
                        "type": "string",
                        "enum": ["PASS", "CONCERNS", "FAIL", "WAIVED"],
                        "description": "Quality gate decision"
                    },
                    "status_reason": {
                        "type": "string",
                        "description": "1-2 sentence explanation of gate decision"
                    },
                    "top_issues": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "severity": {"type": "string", "enum": ["low", "medium", "high"]},
                                "finding": {"type": "string"},
                                "suggested_action": {"type": "string"}
                            }
                        },
                        "description": "Top 3-5 issues (optional)"
                    },
                    "waiver_details": {
                        "type": "object",
                        "properties": {
                            "reason": {"type": "string"},
                            "approved_by": {"type": "string"}
                        },
                        "description": "Waiver details (required if gate_decision is WAIVED)"
                    }
                },
                "required": ["story_id", "story_title", "gate_decision", "status_reason"]
            },
            "function_declarations": [
                {
                    "name": "execute_qa_gate",
                    "description": "Execute qa-gate task",
                    "parameters": {...}  # Same as above
                }
            ]
        }
    ]
)
```

---

### Cloud Function Implementation

**Function Structure**:

```python
import functions_framework
from google.cloud import firestore, storage
import yaml
from datetime import datetime
import os

@functions_framework.http
def qa_gate(request):
    """
    Cloud Function for qa-gate task.

    HTTP POST with JSON body:
    {
        "story_id": "1.3",
        "story_title": "User Authentication",
        "gate_decision": "PASS",
        "status_reason": "All criteria met.",
        "top_issues": [],
        "waiver_details": null,
        "project_id": "project-123"
    }
    """
    # Parse request
    request_json = request.get_json(silent=True)

    story_id = request_json['story_id']
    story_title = request_json['story_title']
    gate_decision = request_json['gate_decision']
    status_reason = request_json['status_reason']
    top_issues = request_json.get('top_issues', [])
    waiver_details = request_json.get('waiver_details')
    project_id = request_json['project_id']

    # Load configuration from Firestore
    db = firestore.Client()
    config_doc = db.collection('projects').document(project_id).get()
    config = config_doc.to_dict()['config']

    qa_location = config['qa']['qaLocation']
    dev_story_location = config['devStoryLocation']

    # Generate slug
    slug = generate_slug(story_title)

    # Create gate data
    gate_data = {
        'schema': 1,
        'story': story_id,
        'gate': gate_decision,
        'status_reason': status_reason,
        'reviewer': 'Quinn',
        'updated': datetime.utcnow().isoformat() + 'Z',
        'top_issues': top_issues,
        'waiver': {
            'active': gate_decision == 'WAIVED',
            'reason': waiver_details['reason'] if waiver_details else '',
            'approved_by': waiver_details['approved_by'] if waiver_details else ''
        }
    }

    # Validate gate data
    validate_gate_data(gate_data)

    # Write gate file to Cloud Storage
    storage_client = storage.Client()
    bucket = storage_client.bucket(config['storage_bucket'])

    gate_file_path = f"{qa_location}/gates/{story_id}-{slug}.yml"
    blob = bucket.blob(gate_file_path)
    blob.upload_from_string(yaml.safe_dump(gate_data), content_type='text/yaml')

    # Update story file (also in Cloud Storage)
    story_file_pattern = f"{dev_story_location}/{story_id}.*.md"
    story_blobs = list(bucket.list_blobs(prefix=story_file_pattern.replace('*', '')))

    if story_blobs:
        story_blob = story_blobs[0]
        story_content = story_blob.download_as_text()

        # Append gate reference
        gate_reference = f"\n\n### Gate Status\n\nGate: {gate_decision} → {gate_file_path}\n"
        updated_story = append_or_replace_gate_status(story_content, gate_reference)

        story_blob.upload_from_string(updated_story, content_type='text/markdown')

    # Return success
    return {
        'status': 'success',
        'gate_file': gate_file_path,
        'gate_decision': gate_decision,
        'story_updated': len(story_blobs) > 0
    }, 200


def generate_slug(title):
    """Generate slug from title."""
    import re
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)  # Remove punctuation
    slug = re.sub(r'[\s_]+', '-', slug)   # Replace spaces with hyphens
    slug = slug.strip('-')
    return slug


def validate_gate_data(gate_data):
    """Validate gate data schema."""
    required_fields = ['schema', 'story', 'gate', 'status_reason', 'reviewer', 'updated', 'top_issues', 'waiver']
    for field in required_fields:
        if field not in gate_data:
            raise ValueError(f"Missing required field: {field}")

    valid_gates = ['PASS', 'CONCERNS', 'FAIL', 'WAIVED']
    if gate_data['gate'] not in valid_gates:
        raise ValueError(f"Invalid gate: {gate_data['gate']}")

    valid_severities = ['low', 'medium', 'high']
    for issue in gate_data['top_issues']:
        if issue['severity'] not in valid_severities:
            raise ValueError(f"Invalid severity: {issue['severity']}")

    if gate_data['gate'] == 'WAIVED' and not gate_data['waiver']['active']:
        raise ValueError("WAIVED gate must have waiver.active = true")


def append_or_replace_gate_status(story_content, gate_reference):
    """Append or replace Gate Status in story."""
    if '### Gate Status' in story_content:
        # Replace existing Gate Status
        import re
        pattern = r'### Gate Status\n\nGate: .*?\n'
        updated_content = re.sub(pattern, gate_reference.strip() + '\n', story_content)
        return updated_content
    else:
        # Append new Gate Status
        return story_content + gate_reference
```

---

### Firestore Schema (State Management)

**Collection**: `projects/{project_id}/gates/{gate_id}`

**Document Structure**:
```javascript
{
  "gate_id": "1.3-user-authentication",
  "story_id": "1.3",
  "gate": "PASS",
  "status_reason": "All criteria met.",
  "reviewer": "Quinn",
  "updated": "2025-01-12T10:00:00Z",
  "top_issues": [],
  "waiver": {
    "active": false
  },
  "created_at": "2025-01-12T10:00:00Z",
  "created_by": "qa-agent"
}
```

**Indexing**:
- Index on `story_id` (for lookups)
- Index on `gate` (for filtering by status)
- Index on `updated` (for sorting by recency)

---

### Cloud Storage Organization

**Bucket Structure**:
```
bmad-artifacts/
├── projects/
│   └── {project_id}/
│       ├── docs/
│       │   ├── qa/
│       │   │   └── gates/
│       │   │       ├── 1.3-user-authentication.yml
│       │   │       ├── 2.5-payment-processing.yml
│       │   │       └── ...
│       │   └── dev-stories/
│       │       ├── 1.3.user-auth.md
│       │       ├── 2.5.payment.backend.md
│       │       └── ...
│       └── config/
│           └── core-config.yaml
```

---

### Deployment Configuration

**Terraform Configuration**:

```hcl
# Cloud Function for qa-gate
resource "google_cloudfunctions2_function" "qa_gate" {
  name        = "qa-gate"
  location    = var.region
  description = "Quality gate decision file generator"

  build_config {
    runtime     = "python311"
    entry_point = "qa_gate"
    source {
      storage_source {
        bucket = google_storage_bucket.functions_source.name
        object = google_storage_bucket_object.qa_gate_source.name
      }
    }
  }

  service_config {
    max_instance_count = 10
    available_memory   = "256M"
    timeout_seconds    = 60
    environment_variables = {
      FIRESTORE_PROJECT = var.project_id
    }
  }
}

# IAM binding for QA agent
resource "google_cloudfunctions2_function_iam_member" "qa_gate_invoker" {
  cloud_function = google_cloudfunctions2_function.qa_gate.name
  role           = "roles/cloudfunctions.invoker"
  member         = "serviceAccount:qa-agent@${var.project_id}.iam.gserviceaccount.com"
}

# Firestore index for gates
resource "google_firestore_index" "gates_story_id" {
  collection = "gates"

  fields {
    field_path = "story_id"
    order      = "ASCENDING"
  }

  fields {
    field_path = "__name__"
    order      = "ASCENDING"
  }
}
```

---

### ADK Implementation Summary

**Components**:
1. **Cloud Function**: qa-gate task logic (Python)
2. **Firestore**: Gate metadata storage and indexing
3. **Cloud Storage**: Gate files (YAML) and story files (markdown)
4. **QA Agent**: Vertex AI agent with qa-gate tool registered
5. **IAM**: Service account permissions for function invocation

**Integration**:
- QA agent calls Cloud Function via HTTP POST
- Cloud Function reads/writes Firestore and Cloud Storage
- Gate files stored in Cloud Storage for version control
- Gate metadata in Firestore for querying and indexing

**Estimated ADK Implementation Effort**: 1-2 days
- Cloud Function development: 4-6 hours
- Firestore schema setup: 1-2 hours
- Cloud Storage organization: 1 hour
- Agent tool registration: 1 hour
- Testing and deployment: 2-3 hours

---

**End of qa-gate Task Analysis** (Sections 1-16 Complete)
