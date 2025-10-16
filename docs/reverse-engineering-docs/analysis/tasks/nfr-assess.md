# Task Analysis: nfr-assess

**Task ID**: `nfr-assess`
**Task File**: `.bmad-core/tasks/nfr-assess.md`
**Primary Agent**: QA (Quinn)
**Task Type**: Quick Assessment Workflow
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: Medium (4-step process, dual output generation, deterministic status rules)

---

## 1. Purpose & Scope

### Primary Purpose
Perform **quick non-functional requirements (NFR) validation** focused on the core four quality attributes: security, performance, reliability, and maintainability. This task generates structured outputs for quality gate integration while maintaining a pragmatic, evidence-based approach.

### Scope Definition
- **In Scope**:
  - Quick assessment (not deep analysis) of 4 core NFRs by default
  - Optional assessment of 4 additional ISO 25010 NFRs (usability, compatibility, portability, functional suitability)
  - Interactive scope elicitation (which NFRs to assess)
  - Threshold checking for NFR requirements
  - Evidence-based status determination (PASS/CONCERNS/FAIL)
  - Brief markdown assessment report generation
  - YAML gate block generation for gate file integration
  - Quality score calculation with configurable weights

- **Out of Scope**:
  - Deep NFR analysis or benchmarking
  - Performance load testing or profiling
  - Security penetration testing
  - Automated vulnerability scanning (though findings can inform assessment)
  - NFR target definition (uses existing targets from story/architecture docs)
  - Code implementation or fixes (assessment only)

### Key Deliverables
1. **Brief Assessment Report** (markdown) - Saved to `qa.qaLocation/assessments/{epic}.{story}-nfr-{YYYYMMDD}.md`
2. **Gate YAML Block** - Structured summary for inclusion in gate file
3. **Quality Score** - 0-100 score based on NFR statuses

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_id: '{epic}.{story}'  # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md'  # From core-config.yaml
```

**Input Details**:
- **story_id**: Numeric identifier in format `{epic}.{story}` (e.g., "1.3" = Epic 1, Story 3)
- **story_path**: Full file path to story markdown file, resolved from `core-config.yaml` → `devStoryLocation`

### Optional/Contextual Inputs

```yaml
optional:
  - architecture_refs: '{architecture.architectureFile}'  # From core-config.yaml
  - technical_preferences: '{technicalPreferences}'       # From core-config.yaml
  - acceptance_criteria: 'From story file'                # NFR requirements embedded in ACs
```

**Optional Input Details**:
- **architecture_refs**: Path to architecture documentation (may contain NFR targets like "API response time <200ms")
- **technical_preferences**: Path to technical preferences file (may contain custom quality score weights)
- **acceptance_criteria**: Story's acceptance criteria section (may include NFR requirements like "system handles 1000 concurrent users")

### Configuration Dependencies

From `core-config.yaml`:
- `devStoryLocation`: Path to story files (required)
- `qa.qaLocation`: Path to QA assessments directory (required)
- `architecture.architectureFile`: Path to architecture docs (optional)
- `technicalPreferences`: Path to technical preferences file (optional)

### Data File Dependencies

**None** - This task does not require separate data files. Assessment criteria are embedded in task logic.

---

## 3. Execution Flow

### High-Level Process (4 Sequential Steps + Outputs)

```
Step 0: Fail-safe for Missing Inputs
  ↓
Step 1: Elicit Scope (which NFRs to assess)
  ↓
Step 2: Check for Thresholds (define targets or mark CONCERNS)
  ↓
Step 3: Quick Assessment (evidence-based evaluation)
  ↓
Step 4: Generate Outputs (markdown + YAML + quality score)
```

### Detailed Step-by-Step Flow

#### Step 0: Fail-safe for Missing Inputs

**Purpose**: Gracefully handle scenarios where story file cannot be found or loaded.

**Process**:
```
IF story_path NOT found OR story file NOT readable THEN
  CONTINUE with assessment (don't fail)
  Create assessment file with note: "Source story not found"
  Set all selected NFRs to CONCERNS with notes: "Target unknown / evidence missing"
  Proceed to output generation with degraded data
END IF
```

**Rationale**:
- This ensures task always provides value even with missing inputs
- Unknown targets policy: If we can't verify requirements, mark as CONCERNS (not arbitrary FAIL)
- Allows assessment to be run even in edge cases (e.g., story moved, permissions issue)

**Output**: Story content (or placeholder if unavailable) loaded for assessment

---

#### Step 1: Elicit Scope

**Purpose**: Determine which NFRs should be assessed (default: core four, optional: all eight).

**Interactive Mode**:
```text
Which NFRs should I assess? (Enter numbers or press Enter for default)
[1] Security (default)
[2] Performance (default)
[3] Reliability (default)
[4] Maintainability (default)
[5] Usability
[6] Compatibility
[7] Portability
[8] Functional Suitability

> [Enter for 1-4]
```

**Non-Interactive Mode**:
- Default to core four (security, performance, reliability, maintainability)
- No user prompt
- Proceed immediately to Step 2

**Scope Selection Logic**:
```
IF interactive_mode THEN
  PROMPT user for NFR selection
  PARSE user input (numbers or comma-separated)
  IF user input empty OR just Enter THEN
    selected_nfrs = [security, performance, reliability, maintainability]  # Default
  ELSE
    selected_nfrs = [nfr for nfr in user_selection]
  END IF
ELSE
  selected_nfrs = [security, performance, reliability, maintainability]  # Default
END IF
```

**Output**: List of NFRs to assess (e.g., `[security, performance, reliability, maintainability]`)

---

#### Step 2: Check for Thresholds

**Purpose**: Look for explicit NFR requirements/targets in story and architecture docs. If not found, mark as CONCERNS with "Target unknown".

**Search Locations**:
1. **Story acceptance criteria** - Look for NFR requirements
   - Example: "AC5: API responds in <200ms for 95th percentile"
   - Example: "AC3: System handles 1000 concurrent users"
2. **Architecture files** (`docs/architecture/*.md`) - Look for NFR specifications
   - Example: "Performance target: <200ms API response time"
   - Example: "Security requirement: JWT with refresh tokens"
3. **Technical preferences** (`docs/technical-preferences.md`) - Look for project-wide NFR standards
   - Example: "All APIs must use TLS 1.3"
   - Example: "Test coverage target: 80%"

**Interactive Mode Threshold Elicitation**:
If threshold not found and interactive mode enabled, prompt for missing thresholds:

```text
No performance requirements found. What's your target response time?
> 200ms for API calls

No security requirements found. Required auth method?
> JWT with refresh tokens
```

**Non-Interactive Mode Threshold Handling**:
If threshold not found and non-interactive mode, apply **unknown targets policy**:
- Mark NFR status as CONCERNS
- Add note: "Target unknown"
- Proceed with assessment based on best practices (not specific target)

**Example**:
```yaml
performance:
  status: CONCERNS
  notes: 'Target unknown - no performance requirements defined in story or architecture'
```

**Threshold Storage**:
```
thresholds = {
  security: "JWT with refresh tokens, TLS 1.3",
  performance: "<200ms API response time (p95)",
  reliability: "99.9% uptime, automatic retry on transient failures",
  maintainability: "80% test coverage, modular architecture"
}
```

**Output**: Dictionary of NFR thresholds (may be empty or partial if targets undefined)

---

#### Step 3: Quick Assessment

**Purpose**: For each selected NFR, check for evidence of implementation and obvious gaps.

**Assessment Process**:
For each selected NFR:
```
1. Load assessment criteria for NFR (embedded in task)
2. Check for evidence in story implementation
   - Read File List from Dev Agent Record
   - Check code files for relevant patterns (auth logic, validation, error handling, etc.)
   - Review tests for NFR-related test coverage
3. Evaluate against threshold (if defined) or best practices (if undefined)
4. Determine status: PASS / CONCERNS / FAIL
5. Document notes with specific findings
```

**Assessment Criteria by NFR**:

##### Security Assessment

**PASS if**:
- Authentication implemented
- Authorization enforced
- Input validation present
- No hardcoded secrets

**CONCERNS if**:
- Missing rate limiting
- Weak encryption
- Incomplete authorization

**FAIL if**:
- No authentication
- Hardcoded credentials
- SQL injection vulnerabilities

**Evidence to Check**:
```yaml
security:
  - Authentication mechanism (JWT, OAuth, session-based)
  - Authorization checks (role-based, permission-based)
  - Input validation (sanitization, type checking)
  - Secret management (env vars, vault, not hardcoded)
  - Rate limiting (middleware, API gateway)
```

##### Performance Assessment

**PASS if**:
- Meets response time targets
- No obvious bottlenecks
- Reasonable resource usage

**CONCERNS if**:
- Close to limits
- Missing indexes
- No caching strategy

**FAIL if**:
- Exceeds response time limits
- Memory leaks
- Unoptimized queries

**Evidence to Check**:
```yaml
performance:
  - Response times (measured or estimated)
  - Database queries (N+1 detection, indexes)
  - Caching usage (Redis, in-memory, CDN)
  - Resource consumption (CPU, memory, network)
```

##### Reliability Assessment

**PASS if**:
- Error handling present
- Graceful degradation
- Retry logic where needed

**CONCERNS if**:
- Some error cases unhandled
- No circuit breakers
- Missing health checks

**FAIL if**:
- No error handling
- Crashes on errors
- No recovery mechanisms

**Evidence to Check**:
```yaml
reliability:
  - Error handling (try-catch, error boundaries)
  - Retry logic (exponential backoff, max retries)
  - Circuit breakers (fail-fast, automatic recovery)
  - Health checks (liveness, readiness probes)
  - Logging (structured logs, error tracking)
```

##### Maintainability Assessment

**PASS if**:
- Test coverage meets target
- Code well-structured
- Documentation present

**CONCERNS if**:
- Test coverage below target
- Some code duplication
- Missing documentation

**FAIL if**:
- No tests
- Highly coupled code
- No documentation

**Evidence to Check**:
```yaml
maintainability:
  - Test coverage (unit, integration, E2E percentages)
  - Code structure (modularity, separation of concerns)
  - Documentation (API docs, inline comments, README)
  - Dependencies (up-to-date, minimal, documented)
```

**Assessment Example**:
```yaml
# Story 1.3: Password Reset Implementation
# Assessment findings:

security:
  status: CONCERNS
  notes: 'Authentication and validation implemented, but no rate limiting on auth endpoints. Risk: brute force attacks possible.'

performance:
  status: PASS
  notes: 'Response times <200ms verified in tests. Database queries use indexes. Caching not needed for this feature.'

reliability:
  status: PASS
  notes: 'Comprehensive error handling with retry logic for email service. Graceful degradation if email fails.'

maintainability:
  status: CONCERNS
  notes: 'Test coverage at 65% (target 80%). Code well-structured but missing API documentation.'
```

**Output**: Dictionary of NFR assessment results with status (PASS/CONCERNS/FAIL) and evidence-based notes

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Assessment Scope Selection (Step 1)

**Decision**: Which NFRs to assess?

**Branching Logic**:
```
IF interactive_mode THEN
  PROMPT user for NFR selection
  IF user input provided THEN
    selected_nfrs = parse_user_input(input)
  ELSE
    selected_nfrs = [security, performance, reliability, maintainability]  # Default
  END IF
ELSE
  selected_nfrs = [security, performance, reliability, maintainability]  # Default
END IF
```

**Options**:
- **Core Four** (default): Security, performance, reliability, maintainability
- **All Eight** (optional): Above + usability, compatibility, portability, functional suitability
- **Custom Selection**: User picks specific NFRs (e.g., just security and performance)

---

### Decision Point 2: Threshold Handling (Step 2)

**Decision**: What to do when NFR threshold/target is undefined?

**Branching Logic**:
```
FOR EACH selected_nfr DO
  threshold = find_threshold_in_story(selected_nfr)

  IF threshold NOT found THEN
    threshold = find_threshold_in_architecture(selected_nfr)
  END IF

  IF threshold NOT found THEN
    threshold = find_threshold_in_technical_preferences(selected_nfr)
  END IF

  IF threshold NOT found THEN
    # Threshold unknown
    IF interactive_mode THEN
      PROMPT user for threshold
      threshold = user_provided_threshold
    ELSE
      # Apply unknown targets policy
      mark_nfr_as_concerns(selected_nfr, "Target unknown")
      threshold = "best practices"  # Use general guidelines
    END IF
  END IF

  thresholds[selected_nfr] = threshold
END FOR
```

**Unknown Targets Policy**:
- If target missing and not provided → mark status as **CONCERNS**
- Notes: "Target unknown"
- Proceed with best practices evaluation (not arbitrary threshold)

---

### Decision Point 3: NFR Status Determination (Step 3)

**Decision**: What status should be assigned to each NFR? (PASS/CONCERNS/FAIL)

**Branching Logic** (per NFR):
```
FOR EACH selected_nfr DO
  evidence = collect_evidence(selected_nfr, story)
  threshold = thresholds[selected_nfr]

  # Apply deterministic rules
  IF has_critical_gap(evidence, threshold) THEN
    status = FAIL
    notes = describe_critical_gap(evidence, threshold)
  ELSE IF has_concerns(evidence, threshold) THEN
    status = CONCERNS
    notes = describe_concerns(evidence, threshold)
  ELSE IF meets_requirements(evidence, threshold) THEN
    status = PASS
    notes = describe_compliance(evidence, threshold)
  ELSE
    # Default to CONCERNS if uncertain
    status = CONCERNS
    notes = "Unable to determine status with available evidence"
  END IF

  nfr_results[selected_nfr] = {status, notes}
END FOR
```

**Deterministic Status Rules**:
- **FAIL**: Any selected NFR has critical gap OR target clearly not met
- **CONCERNS**: No FAILs, but any NFR is unknown/partial/missing evidence
- **PASS**: All selected NFRs meet targets with evidence

**Example**:
```yaml
# Security NFR assessment

# Evidence:
- Authentication: JWT implemented ✓
- Authorization: Role-based checks ✓
- Input validation: Sanitization present ✓
- Secrets: Environment variables ✓
- Rate limiting: NOT found ✗

# Threshold: "JWT auth, input validation, no hardcoded secrets"
# Gap: Rate limiting missing

# Decision: CONCERNS (not FAIL because threshold didn't explicitly require rate limiting)
# Notes: "Missing rate limiting on auth endpoints - recommend adding before production"
```

---

### Decision Point 4: Quality Score Calculation (Step 4)

**Decision**: How to calculate overall quality score from NFR statuses?

**Default Formula**:
```
quality_score = 100
quality_score -= 20 for each FAIL attribute
quality_score -= 10 for each CONCERNS attribute
quality_score = max(0, min(100, quality_score))  # Bounded 0-100
```

**Custom Weights** (from technical-preferences.md):
```yaml
# technical-preferences.md
quality_score_weights:
  fail_penalty: 25      # Instead of default 20
  concerns_penalty: 12  # Instead of default 10
```

**Branching Logic**:
```
IF technical_preferences exists AND has custom weights THEN
  fail_penalty = custom_weights.fail_penalty
  concerns_penalty = custom_weights.concerns_penalty
ELSE
  fail_penalty = 20     # Default
  concerns_penalty = 10 # Default
END IF

quality_score = 100
quality_score -= (fail_penalty × count_fails)
quality_score -= (concerns_penalty × count_concerns)
quality_score = max(0, min(100, quality_score))  # Floor 0, ceiling 100
```

**Example**:
```yaml
# Assessment results:
security: CONCERNS
performance: PASS
reliability: PASS
maintainability: CONCERNS

# Calculation:
count_fails = 0
count_concerns = 2
quality_score = 100 - (20 × 0) - (10 × 2) = 80
```

---

## 5. User Interaction Points

### Interaction Point 1: Scope Elicitation (Step 1)

**When**: Beginning of assessment (if interactive mode)

**Purpose**: Allow user to customize which NFRs to assess

**Interaction**:
```
Agent: "Which NFRs should I assess? (Enter numbers or press Enter for default)
        [1] Security (default)
        [2] Performance (default)
        [3] Reliability (default)
        [4] Maintainability (default)
        [5] Usability
        [6] Compatibility
        [7] Portability
        [8] Functional Suitability

        > "

User: [Enter for default] or [1,2,3,4,5] or [1-8]
```

**Branching**:
- User presses Enter → Use core four (1-4)
- User enters numbers → Parse and use selected NFRs
- User enters invalid input → Prompt again or use default

---

### Interaction Point 2: Threshold Elicitation (Step 2)

**When**: During threshold checking (if threshold undefined and interactive mode)

**Purpose**: Gather missing NFR targets from user

**Interaction**:
```
Agent: "No performance requirements found. What's your target response time?"

User: "200ms for API calls"

Agent: "No security requirements found. Required auth method?"

User: "JWT with refresh tokens"
```

**Branching**:
- User provides threshold → Use for assessment
- User says "skip" or "unknown" → Apply unknown targets policy (CONCERNS)
- User provides multiple thresholds → Parse and store all

---

### Interaction Point 3: Results Summary (Step 4)

**When**: End of assessment, before saving outputs

**Purpose**: Inform user of assessment results and file locations

**Interaction**:
```
Agent: "NFR Assessment Complete:

        Summary:
        - Security: CONCERNS - Missing rate limiting
        - Performance: PASS - Meets <200ms requirement
        - Reliability: PASS - Proper error handling
        - Maintainability: CONCERNS - Test coverage below target

        Quality Score: 80/100

        Outputs:
        - Assessment: qa/assessments/1.3-nfr-20251014.md
        - Gate block ready → paste into qa/gates/1.3-password-reset.yml under nfr_validation

        Critical Issues:
        1. No rate limiting (Security)
        2. Test coverage 65% (Maintainability)

        Quick Wins:
        - Add rate limiting: ~2 hours
        - Increase test coverage: ~4 hours"

User: [Reviews findings]
```

**No Further Interaction Required**: Task completes, outputs saved

---

## 6. Output Specifications

### Output 1: Gate YAML Block

**Purpose**: Structured summary for inclusion in quality gate file

**Format**: YAML block for copy-paste

**Generation Rules**:
- Generate ONLY for NFRs actually assessed (no placeholders for unevaluated NFRs)
- Include `_assessed` field listing which NFRs were evaluated
- Each assessed NFR gets status and notes
- Deterministic status rules applied

**Structure**:

```yaml
# Gate YAML (copy/paste):
nfr_validation:
  _assessed: [security, performance, reliability, maintainability]
  security:
    status: CONCERNS
    notes: 'No rate limiting on auth endpoints'
  performance:
    status: PASS
    notes: 'Response times < 200ms verified'
  reliability:
    status: PASS
    notes: 'Error handling and retries implemented'
  maintainability:
    status: CONCERNS
    notes: 'Test coverage at 65%, target is 80%'
```

**Field Definitions**:
- `_assessed`: Array of NFR names that were evaluated
- `{nfr_name}.status`: PASS | CONCERNS | FAIL
- `{nfr_name}.notes`: Specific findings with evidence (not vague)

**Usage**:
- Agent prints this block to output
- User (or review-story task) copies block into gate file: `qa/gates/{epic}.{story}-{slug}.yml`
- Gate decision logic uses nfr_validation data to determine overall gate status

---

### Output 2: Brief Assessment Report (Markdown)

**File Location**: `qa.qaLocation/assessments/{epic}.{story}-nfr-{YYYYMMDD}.md`

**Path Resolution**:
- `qa.qaLocation` from `core-config.yaml`
- Create `assessments/` subdirectory if doesn't exist
- Filename format: `{epic}.{story}-nfr-{YYYYMMDD}.md`
  - Example: `1.3-nfr-20251014.md`

**Document Structure**:

```markdown
# NFR Assessment: {epic}.{story}

Date: {YYYY-MM-DD}
Reviewer: Quinn (Test Architect)

<!-- Note: Source story not found (if applicable) -->

## Summary

- Security: CONCERNS - Missing rate limiting
- Performance: PASS - Meets <200ms requirement
- Reliability: PASS - Proper error handling
- Maintainability: CONCERNS - Test coverage below target

## Critical Issues

1. **No rate limiting** (Security)
   - Risk: Brute force attacks possible
   - Fix: Add rate limiting middleware to auth endpoints

2. **Test coverage 65%** (Maintainability)
   - Risk: Untested code paths
   - Fix: Add tests for uncovered branches

## Quick Wins

- Add rate limiting: ~2 hours
- Increase test coverage: ~4 hours
- Add performance monitoring: ~1 hour
```

**Document Generation Notes**:
- **If story not found**: Include note at top: `<!-- Note: Source story not found -->`
- **Summary section**: One-line status for each assessed NFR
- **Critical Issues section**: FAIL and high-priority CONCERNS items with risk + fix
- **Quick Wins section**: Time estimates for addressing issues

---

### Output 3: Story Update Line

**Purpose**: Provide reference line for review-story task to include in QA Results

**Format**: Single line with file path

```
NFR assessment: qa.qaLocation/assessments/{epic}.{story}-nfr-{YYYYMMDD}.md
```

**Usage**:
- Printed at end of task output
- review-story task quotes this line in QA Results section of story file
- Provides traceability from story to detailed NFR assessment

---

### Output 4: Gate Integration Line

**Purpose**: Remind user (or calling task) to paste YAML block into gate file

**Format**: Instructions with file path

```
Gate NFR block ready → paste into qa.qaLocation/gates/{epic}.{story}-{slug}.yml under nfr_validation
```

**Usage**:
- Printed at end of task output
- Reminds user where to paste the generated YAML block
- If called by review-story or qa-gate tasks, they handle this automatically

---

## 7. Error Handling & Validation

### Error Condition 1: Story File Not Found

**Trigger**: `story_path` does not exist or is not readable

**Detection**: File read operation fails in Step 0

**Handling** (Fail-safe):
```
CONTINUE with assessment (don't fail)
Log warning: "Story file not found: {story_path}"
Create assessment file with note: "Source story not found"
Set all selected NFRs to CONCERNS with notes: "Target unknown / evidence missing"
Proceed to output generation
```

**Output**:
```markdown
# NFR Assessment: 1.3

Date: 2025-10-14
Reviewer: Quinn

**Note**: Source story not found at expected location. Assessment based on available information.

## Summary

- Security: CONCERNS - Target unknown / evidence missing
- Performance: CONCERNS - Target unknown / evidence missing
- Reliability: CONCERNS - Target unknown / evidence missing
- Maintainability: CONCERNS - Target unknown / evidence missing
```

**Rationale**: Always provide value, even with missing inputs (fail-safe approach)

---

### Error Condition 2: Configuration Missing (core-config.yaml)

**Trigger**: Required configuration keys missing

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

### Error Condition 3: Invalid NFR Selection (Interactive Mode)

**Trigger**: User enters invalid NFR selection

**Detection**: User input doesn't match valid NFR numbers or format

**Handling**:
```
Display error:
  "Invalid NFR selection. Please enter:
   - Numbers separated by commas (e.g., 1,2,3)
   - Range (e.g., 1-4)
   - Or press Enter for default (1-4)"

Re-prompt user
```

**Recovery**: User provides valid input or presses Enter for default

---

### Error Condition 4: Output Directory Creation Fails

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

   Please resolve the issue and re-run NFR assessment."

Request issue resolution
```

**Resolution**: User fixes permissions, disk space, or path configuration

---

### Error Condition 5: Output File Write Failure

**Trigger**: Cannot write assessment document to file

**Detection**: File write operation fails

**Handling**:
```
PARTIAL SUCCESS

Display error:
  "NFR assessment complete but cannot save to file:

   File: {output_path}
   Error: {error message}

   Assessment results are available in memory.

   Options:
   1. Save to alternate location
   2. Display full output (you can copy manually)
   3. Retry save

   What would you like to do?"

Wait for user decision
```

**Resolution**: User selects alternate save location or copies output manually

---

### Validation 1: NFR Status Consistency

**Trigger**: After assessment completion

**Detection**: Validate all assessed NFRs have status and notes

**Validation Rules**:
- Every assessed NFR must have status (PASS/CONCERNS/FAIL)
- Every assessed NFR must have notes (not empty)
- Notes must be specific and evidence-based (not vague)

**Handling if Invalid**:
```
INTERNAL ERROR (should not happen with proper logic)

If detected:
  Log error with details
  Fill missing fields with placeholders
  Mark for human review in output
  Continue with remaining assessments
```

**Prevention**: Strict schema enforcement in Step 3

---

### Validation 2: Quality Score Bounds

**Trigger**: After quality score calculation

**Detection**: Score outside 0-100 range

**Validation Rules**:
- quality_score >= 0
- quality_score <= 100

**Handling if Invalid**:
```
INTERNAL ERROR (should not happen with proper formula)

If detected:
  quality_score = max(0, min(100, quality_score))  # Clamp to bounds
  Log warning for debugging
  Continue with clamped score
```

**Prevention**: Explicit bounds checking in formula

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**No Direct Task Dependencies**:
- `nfr-assess` is a standalone task that doesn't invoke other tasks
- However, it's typically invoked as part of larger workflows:
  - `review-story.md` always invokes `nfr-assess` as part of comprehensive review
  - `qa-gate.md` may use nfr-assess output for gate decisions

### Template Dependencies

**No Template Dependencies**:
- NFR assessment output is generated programmatically, not from templates
- However, output format must be compatible with `qa-gate-tmpl.yaml` (nfr_validation section)

### Data File Dependencies

**No Data File Dependencies**:
- Assessment criteria are embedded in task logic
- No external framework files required (unlike test-design or risk-profile)

### Configuration Dependencies

**core-config.yaml Required Keys**:

```yaml
# Story location
devStoryLocation: 'path/to/stories'

# QA output location
qa:
  qaLocation: 'path/to/qa/assessments'

# Optional paths
architecture:
  architectureFile: 'path/to/architecture.md'  # For NFR thresholds
technicalPreferences: 'path/to/technical-preferences.md'  # For custom weights
```

**Configuration Usage**:
- `devStoryLocation`: Resolve story file path
- `qa.qaLocation`: Determine output directory for assessment document
- `architecture.architectureFile`: Load architecture docs to find NFR thresholds
- `technicalPreferences`: Load custom quality score weights (if defined)

### Document Dependencies

**Optional Documents** (used if available):
1. `docs/architecture/*.md` - NFR thresholds and specifications
2. `docs/technical-preferences.md` - Custom quality score weights, project-wide NFR standards

**Story File** (required):
- Must exist at `{devStoryLocation}/{epic}.{story}.*.md`
- No specific status required (can be Draft, Approved, InProgress, Review, or Done)
- Should have acceptance criteria section (may contain NFR requirements)
- Should have File List in Dev Agent Record (for evidence gathering)

### Prerequisite State

**Story State Requirements**:
- Story file should exist (but fail-safe handles missing file)
- No specific story status required
- Ideally story implementation is complete (for evidence gathering)
- But assessment can be run at any stage (proactive or reactive)

### Agent Dependencies

**Typically Invoked By**:
- **QA Agent (Quinn)**: Uses `*nfr {story}` command
- **review-story.md**: Always calls nfr-assess as part of comprehensive review
- **Direct Invocation**: Can be run standalone by any agent via task execution

**Invokes No Other Agents**:
- Self-contained task execution
- No agent-to-agent handoffs
- No sub-task orchestration

### Output Dependencies

**nfr-assess Outputs Used By**:

1. **review-story.md**:
   - Uses nfr_validation YAML block in gate file
   - References NFR assessment document in QA Results
   - Incorporates NFR statuses into gate decision
   - **Dependency**: NFR assess should complete before/during review

2. **qa-gate.md**:
   - Uses nfr_validation YAML block for gate decision
   - Checks for FAIL or CONCERNS NFRs
   - Incorporates quality score into gate file
   - **Dependency**: NFR assess should complete before gate creation

---

## 9. Integration Points

### Integration Point 1: QA Agent Commands

**Command**: `*nfr {story}` or `*nfr-assess {story}`

**Integration**:
- QA agent loads `nfr-assess.md` task
- Executes task with story parameter
- Returns NFR assessment outputs to user
- May be invoked standalone or as part of `*review` workflow

**Data Flow**:
```
User: *nfr 1.3
  ↓
QA Agent loads nfr-assess.md
  ↓
Task executes (4 steps)
  ↓
Outputs generated:
  - Assessment document (saved to file)
  - Gate YAML block (displayed to user)
  - Story update line (displayed to user)
  - Gate integration line (displayed to user)
  ↓
Agent displays completion message with file paths
```

---

### Integration Point 2: review-story.md Task

**Integration**: nfr-assess is invoked as part of comprehensive story review

**Workflow**:
```
QA Agent: *review 1.3
  ↓
review-story.md executes
  ↓
Step 2D: Invoke nfr-assess.md
  ↓
NFR assessment completes
  ↓
Review continues with NFR results
  ↓
Gate decision incorporates nfr_validation YAML block
```

**Data Exchange**:
- Review passes story context to nfr-assess
- NFR-assess returns:
  - File path to NFR assessment document
  - Gate YAML block for inclusion in gate file
  - NFR statuses for gate decision logic

**Integration Details**:
- review-story always calls nfr-assess (not optional)
- NFR statuses directly impact gate decision (FAIL NFR → FAIL gate)
- NFR assessment document referenced in QA Results section

---

### Integration Point 3: qa-gate.md Task

**Integration**: Gate task uses nfr_validation YAML block for gate decision

**Workflow**:
```
QA Agent: *gate 1.3
  ↓
qa-gate.md executes
  ↓
Step 1: Load previous QA outputs (including NFR assessment)
  ↓
Step 2: Evaluate NFR statuses
  - Check for FAIL NFRs → gate impact
  - Check for CONCERNS NFRs → gate impact
  - Include nfr_validation block in gate file
  ↓
Step 3: Make gate decision
  - Any NFR FAIL → gate = CONCERNS or FAIL
  - Any NFR CONCERNS → gate = CONCERNS (at minimum)
  ↓
Output: Quality gate file with nfr_validation block
```

**Data Exchange**:
- NFR-assess provides: Gate YAML block with statuses and notes
- Gate uses: NFR statuses for decision logic, quality score for metrics
- Gate decision influenced by: Presence/absence of FAIL or CONCERNS NFRs

---

### Integration Point 4: Story File Integration

**Integration**: NFR-assess reads story file for requirements and evidence

**Workflow**:
```
nfr-assess executes
  ↓
Step 0: Load story file
  Path: {devStoryLocation}/{epic}.{story}.*.md
  ↓
Extract:
  - Acceptance Criteria (may contain NFR requirements)
  - Dev Agent Record → File List (for evidence gathering)
  - NFR specifications (if embedded in story)
  ↓
Use extracted data in assessment
```

**Story File Expected Structure**:
```markdown
# Story Title

## User Story
{user story description}

## Acceptance Criteria

1. AC1: {functional requirement}
2. AC2: {functional requirement}
3. AC3: API responds in <200ms for 95th percentile (NFR - performance)
4. AC4: System handles 1000 concurrent users (NFR - performance)
5. AC5: All data encrypted at rest and in transit (NFR - security)

## Non-Functional Requirements

- **Security**: JWT authentication with refresh tokens, TLS 1.3
- **Performance**: <200ms API response time (p95), <1s page load
- **Reliability**: 99.9% uptime, automatic retry on transient failures
- **Maintainability**: 80% test coverage, modular architecture

## Dev Agent Record

### File List
- api/auth/login.ts
- api/auth/middleware/rate-limit.ts
- tests/auth/login.test.ts
- ...
```

**Data Extraction**:
- Parse acceptance criteria for NFR requirements
- Parse Non-Functional Requirements section (if exists)
- Extract File List for evidence gathering
- Use NFR specs as thresholds for assessment

---

### Integration Point 5: Architecture Documentation Integration

**Integration**: NFR-assess reads architecture docs for NFR specifications

**Workflow**:
```
nfr-assess executes
  ↓
Step 2: Check for thresholds
  ↓
Load architecture file(s)
  Path: {architecture.architectureFile} or docs/architecture/*.md
  ↓
Search for NFR specifications:
  - Performance targets (response times, throughput)
  - Security requirements (auth methods, encryption)
  - Reliability targets (uptime, error rates)
  - Maintainability standards (coverage, complexity)
  ↓
Use extracted thresholds in assessment
```

**Architecture File Expected Content**:
```markdown
# System Architecture

## Performance Requirements

- API response time: <200ms (p95), <500ms (p99)
- Database query time: <100ms average
- Page load time: <1s (LCP)

## Security Requirements

- Authentication: JWT with refresh tokens
- Encryption: TLS 1.3 for transport, AES-256 for data at rest
- Rate limiting: 100 requests/minute per IP
- Input validation: All user inputs sanitized

## Reliability Requirements

- Uptime: 99.9% (8.76 hours downtime/year)
- Error handling: Graceful degradation, automatic retries
- Health checks: Liveness and readiness probes

## Maintainability Requirements

- Test coverage: 80% minimum (unit + integration)
- Code complexity: Cyclomatic complexity < 10
- Documentation: API docs for all public endpoints
```

**Data Extraction**:
- Parse architecture markdown for NFR sections
- Extract specific numerical targets (response times, uptime %, coverage %)
- Use as thresholds for PASS/CONCERNS/FAIL determination

---

### Integration Point 6: Technical Preferences Integration

**Integration**: NFR-assess loads custom quality score weights from technical preferences

**Workflow**:
```
nfr-assess executes
  ↓
Step 4: Generate quality score
  ↓
Load technical-preferences.md
  Path: {technicalPreferences} from core-config.yaml
  ↓
Extract custom weights (if defined):
  quality_score_weights:
    fail_penalty: 25      # Custom (default 20)
    concerns_penalty: 12  # Custom (default 10)
  ↓
Use custom weights in quality score calculation
```

**Technical Preferences File Expected Content**:
```markdown
# Technical Preferences

## Quality Score Configuration

Custom quality score weights for NFR assessments:

```yaml
quality_score_weights:
  fail_penalty: 25      # Penalty for each FAIL NFR (default: 20)
  concerns_penalty: 12  # Penalty for each CONCERNS NFR (default: 10)
```

## NFR Standards

Project-wide NFR requirements:

- **Security**: All APIs use TLS 1.3, JWT auth required
- **Performance**: All APIs <200ms response time (p95)
- **Reliability**: 99.9% uptime SLA
- **Maintainability**: 80% test coverage minimum
```

**Data Extraction**:
- Parse YAML block for quality_score_weights
- Use custom weights if defined, otherwise use defaults
- May also extract project-wide NFR standards as thresholds

---

### Integration Point 7: Quality Gate File Integration

**Integration**: Gate YAML block is copy-pasted into quality gate file

**Gate File Structure**:
```yaml
# qa/gates/{epic}.{story}-{slug}.yml
schema: 1
story: '{epic}.{story}'
gate: PASS|CONCERNS|FAIL|WAIVED

# NFR validation block (from nfr-assess output)
nfr_validation:
  _assessed: [security, performance, reliability, maintainability]
  security:
    status: CONCERNS
    notes: 'No rate limiting on auth endpoints'
  performance:
    status: PASS
    notes: 'Response times < 200ms verified'
  reliability:
    status: PASS
    notes: 'Error handling and retries implemented'
  maintainability:
    status: CONCERNS
    notes: 'Test coverage at 65%, target is 80%'

# Other gate sections
risk_summary: {...}
trace: {...}
test_design: {...}
```

**Integration Process**:
1. nfr-assess generates gate YAML block
2. Agent displays block to user or includes in review output
3. qa-gate.md or review-story.md copies block into gate file
4. Gate decision logic uses nfr_validation data

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
- **Usage**: Construct output path: `{qa.qaLocation}/assessments/{epic}.{story}-nfr-{YYYYMMDD}.md`
- **Example**: `qa.qaLocation: 'qa'` → `qa/assessments/1.3-nfr-20251014.md`

**architecture.architectureFile** (Optional):
```yaml
architecture:
  architectureFile: 'docs/architecture.md'
```
- **Purpose**: Locates architecture documentation for NFR thresholds
- **Usage**: Load architecture file to find NFR specifications
- **Example**: `architecture.architectureFile: 'docs/architecture.md'`

**technicalPreferences** (Optional):
```yaml
technicalPreferences: 'docs/technical-preferences.md'
```
- **Purpose**: Locates technical preferences for custom quality score weights
- **Usage**: Load technical preferences to extract custom weights
- **Example**: `technicalPreferences: 'docs/technical-preferences.md'`

### Configuration Loading Strategy

**Lazy Loading**:
- Configuration loaded at task execution start
- No pre-loading required
- Cached for duration of task execution

**Error Handling**:
- If `core-config.yaml` not found → HALT with error
- If required keys missing → HALT with error
- If optional keys missing → Use defaults or skip optional features

**Path Resolution Priority**:
1. Explicit path provided by user → Use as-is
2. Relative path from config → Resolve relative to project root
3. Absolute path from config → Use as-is

---

## 11. Special Considerations

### Consideration 1: Quick Assessment Philosophy

**Principle**: NFR assessment is intentionally quick, not deep analysis.

**Implementation**:
- Focus on obvious gaps and critical issues
- Don't perform deep benchmarking or profiling
- Don't run automated security scans (though findings can inform assessment)
- Use evidence-based evaluation with available data
- Target: 5-10 minutes per story (not hours)

**Rationale**:
- Deep NFR analysis is expensive (time, resources)
- Most issues can be detected with quick review
- If deep analysis needed, use specialized tools (load testing, penetration testing)
- Quick assessment identifies where deep analysis is warranted

---

### Consideration 2: Unknown Targets Policy

**Principle**: If NFR target is undefined, mark as CONCERNS (not arbitrary FAIL).

**Implementation**:
- Search story, architecture, technical preferences for thresholds
- If not found and interactive mode: prompt user
- If not found and non-interactive mode: mark as CONCERNS with "Target unknown"
- Proceed with best practices evaluation (not arbitrary threshold)

**Rationale**:
- Arbitrary thresholds are unhelpful (e.g., "response time should be <100ms" when <500ms is acceptable)
- CONCERNS status signals to team: "Define your NFR targets"
- Encourages teams to be explicit about quality requirements
- Avoids false FAILs for stories where NFR targets genuinely don't apply

**Example**:
```yaml
# Story implements a background job (not user-facing API)
# No response time requirement in story or architecture

performance:
  status: CONCERNS
  notes: 'Target unknown - no performance requirements defined. If background processing, consider job completion time threshold.'
```

---

### Consideration 3: Core Four Default Focus

**Principle**: Default to assessing 4 core NFRs (security, performance, reliability, maintainability).

**Rationale**:
- These 4 NFRs are relevant to most stories
- Other 4 ISO 25010 NFRs (usability, compatibility, portability, functional suitability) are more specialized
- Keeps assessment scope manageable by default
- User can opt-in to additional NFRs if needed

**Implementation**:
- Default selection: `[security, performance, reliability, maintainability]`
- Interactive mode allows customization
- Documentation explains when to assess other NFRs:
  - **Usability**: UI/UX heavy stories
  - **Compatibility**: Cross-browser, cross-platform requirements
  - **Portability**: Multi-environment deployment stories
  - **Functional Suitability**: Complex business logic stories

---

### Consideration 4: Fail-Safe for Missing Inputs

**Principle**: Task should always provide value, even with missing story file.

**Implementation**:
- Step 0 handles missing story file gracefully
- Continue with assessment (don't fail)
- Create assessment file with note: "Source story not found"
- Set all selected NFRs to CONCERNS with "Target unknown / evidence missing"
- Proceed to output generation

**Rationale**:
- Prevents task failure in edge cases (permissions issue, story moved, etc.)
- Always produces output for gate integration
- CONCERNS status is appropriate when evidence is unavailable
- Allows workflow to continue (review-story can still complete)

---

### Consideration 5: Evidence-Based Assessment (No Guessing)

**Principle**: All findings must cite specific evidence (files, tests, code patterns).

**Implementation**:
- Check File List for relevant files (auth logic, validation, error handling)
- Review tests for NFR-related test coverage
- Look for specific code patterns (try-catch, rate limiting, caching)
- Document specific findings with file references

**Examples**:
- ❌ Poor: "Security is weak"
- ✅ Good: "No rate limiting on auth endpoints (api/auth/login.ts:42)"
- ❌ Poor: "Performance is okay"
- ✅ Good: "Response times <200ms verified in tests (tests/api/performance.test.ts)"

**Rationale**:
- Vague findings are not actionable
- Specific evidence enables targeted fixes
- File references allow verification
- Evidence-based assessment maintains credibility

---

### Consideration 6: Deterministic Status Rules

**Principle**: NFR status determination follows explicit, repeatable rules.

**Implementation**:
- FAIL: Critical gap OR target clearly not met
- CONCERNS: No FAILs, but unknown/partial/missing evidence
- PASS: All requirements met with evidence
- Rules applied consistently across all assessments

**Rationale**:
- Consistent, predictable status determination
- Two different QA agents (or same agent at different times) reach same status
- Eliminates subjectivity
- Enables automation and tooling integration

---

### Consideration 7: Quality Score as Optional Metric

**Principle**: Quality score is useful but optional (can be omitted if not needed).

**Implementation**:
- Calculate quality score by default
- Include in gate YAML block (optional field)
- Can be used for metrics/dashboards
- Not required for gate decision (gate uses NFR statuses, not score)

**Rationale**:
- Quality score provides useful quantitative metric
- Enables trend analysis across stories
- Can trigger alerts if below threshold
- But gate decision is based on statuses (more nuanced than single number)

---

### Consideration 8: ISO 25010 Alignment

**Principle**: NFR categories align with ISO 25010 quality model.

**Implementation**:
- Core four: Security, Performance (time behavior), Reliability, Maintainability
- Extended four: Usability, Compatibility, Portability, Functional Suitability
- Task appendix includes full ISO 25010 reference for educational purposes

**Rationale**:
- ISO 25010 is industry-standard quality model
- Provides shared vocabulary for quality attributes
- Comprehensive coverage of software quality dimensions
- Enables integration with quality management systems

---

## 12. ADK Translation Recommendations

### Recommendation 1: Cloud Function for Quick Assessment (High Priority)

**Current Implementation**:
- Quick assessment logic embedded in task
- 4-step process with evidence gathering and status determination

**ADK Translation**:
Use **Cloud Function** for stateless, scalable NFR assessment:

```python
from google.cloud import storage, firestore
import functions_framework

@functions_framework.http
def assess_nfr(request):
    """
    Cloud Function for quick NFR assessment.
    Input: story_id, selected_nfrs
    Output: NFR statuses, notes, quality score
    """
    request_json = request.get_json()
    story_id = request_json['story_id']
    selected_nfrs = request_json.get('selected_nfrs', ['security', 'performance', 'reliability', 'maintainability'])

    # Load story and configuration
    story = load_story(story_id)
    config = load_core_config(story.project_id)

    # Step 1: (Scope already selected via input parameter)

    # Step 2: Check for thresholds
    thresholds = check_for_thresholds(story, selected_nfrs, config)

    # Step 3: Quick assessment
    nfr_results = {}
    for nfr in selected_nfrs:
        evidence = collect_evidence(nfr, story)
        threshold = thresholds.get(nfr)
        status, notes = determine_nfr_status(nfr, evidence, threshold)
        nfr_results[nfr] = {'status': status, 'notes': notes}

    # Step 4: Calculate quality score
    quality_score = calculate_quality_score(nfr_results, config)

    return {
        'story_id': story_id,
        'nfr_validation': {
            '_assessed': selected_nfrs,
            **nfr_results
        },
        'quality_score': quality_score
    }

def collect_evidence(nfr, story):
    """Gather evidence for specific NFR from story implementation."""
    evidence = {
        'files': story.file_list,
        'tests': [f for f in story.file_list if '.test.' in f or '.spec.' in f],
        'patterns': []
    }

    # NFR-specific evidence gathering
    if nfr == 'security':
        evidence['patterns'] = find_security_patterns(story)
    elif nfr == 'performance':
        evidence['patterns'] = find_performance_patterns(story)
    elif nfr == 'reliability':
        evidence['patterns'] = find_reliability_patterns(story)
    elif nfr == 'maintainability':
        evidence['patterns'] = find_maintainability_patterns(story)

    return evidence

def determine_nfr_status(nfr, evidence, threshold):
    """Apply deterministic rules to determine NFR status."""

    # Unknown targets policy
    if threshold is None or threshold == 'unknown':
        return ('CONCERNS', 'Target unknown - no requirements defined')

    # NFR-specific assessment logic
    if nfr == 'security':
        return assess_security(evidence, threshold)
    elif nfr == 'performance':
        return assess_performance(evidence, threshold)
    elif nfr == 'reliability':
        return assess_reliability(evidence, threshold)
    elif nfr == 'maintainability':
        return assess_maintainability(evidence, threshold)

    # Default
    return ('CONCERNS', 'Unable to determine status with available evidence')
```

**Benefits**:
- Stateless, scalable assessment
- Can be invoked by review-story workflow or standalone
- Easy to test and validate
- Reusable across multiple workflows

---

### Recommendation 2: Firestore for NFR Assessment Storage (High Priority)

**Current Implementation**:
- Generate assessment results in memory
- Save to markdown file
- Generate YAML gate block

**ADK Translation**:
Use **Firestore** to store NFR assessments for querying and traceability:

```javascript
// Firestore schema for NFR assessments

/projects/{project_id}/stories/{story_id}/nfr_assessments/{assessment_id}
  - created_at: timestamp
  - created_by: 'qa-agent'
  - story_id: '1.3'
  - story_title: 'Password Reset'
  - assessed_nfrs: ['security', 'performance', 'reliability', 'maintainability']
  - nfr_validation: {
      security: {
        status: 'CONCERNS',
        notes: 'No rate limiting on auth endpoints'
      },
      performance: {
        status: 'PASS',
        notes: 'Response times < 200ms verified'
      },
      reliability: {
        status: 'PASS',
        notes: 'Error handling and retries implemented'
      },
      maintainability: {
        status: 'CONCERNS',
        notes: 'Test coverage at 65%, target is 80%'
      }
    }
  - quality_score: 80
  - critical_issues: [
      'No rate limiting (Security)',
      'Test coverage 65% (Maintainability)'
    ]
  - quick_wins: [
      'Add rate limiting: ~2 hours',
      'Increase test coverage: ~4 hours'
    ]
```

**Query Examples**:
```python
# Find all stories with security CONCERNS or FAIL
firestore.collection_group('nfr_assessments').where('nfr_validation.security.status', 'in', ['CONCERNS', 'FAIL']).get()

# Get latest NFR assessment for a story
firestore.collection('projects/proj-1/stories/1.3/nfr_assessments').order_by('created_at', direction=firestore.Query.DESCENDING).limit(1).get()

# Find all stories with quality score < 80
firestore.collection_group('nfr_assessments').where('quality_score', '<', 80).get()
```

**Benefits**:
- Structured data for querying
- Version history (multiple assessment_id documents)
- Integration with gate decision logic
- Trend analysis and reporting

---

### Recommendation 3: Evidence Collection Service (Medium Priority)

**Current Implementation**:
- Manual evidence gathering from story files, File List, tests

**ADK Translation**:
Use **Cloud Function** for automated evidence collection:

```python
class NFREvidenceCollector:
    """Automated evidence collection for NFR assessments."""

    def __init__(self):
        self.storage = storage.Client()
        self.code_analyzer = CodeAnalyzer()

    def collect_security_evidence(self, story):
        """Collect security-related evidence."""
        evidence = {
            'authentication': self.check_authentication(story),
            'authorization': self.check_authorization(story),
            'input_validation': self.check_input_validation(story),
            'secrets_management': self.check_secrets_management(story),
            'rate_limiting': self.check_rate_limiting(story)
        }
        return evidence

    def check_authentication(self, story):
        """Check for authentication implementation."""
        auth_patterns = ['jwt', 'oauth', 'passport', 'authenticate', 'login']
        found_patterns = []

        for file_path in story.file_list:
            if any(pattern in file_path.lower() for pattern in auth_patterns):
                found_patterns.append(file_path)

        if found_patterns:
            return {'implemented': True, 'files': found_patterns}
        else:
            return {'implemented': False, 'files': []}

    def collect_performance_evidence(self, story):
        """Collect performance-related evidence."""
        evidence = {
            'response_times': self.check_response_times(story),
            'database_queries': self.check_database_optimization(story),
            'caching': self.check_caching_strategy(story),
            'resource_usage': self.check_resource_optimization(story)
        }
        return evidence

    def collect_reliability_evidence(self, story):
        """Collect reliability-related evidence."""
        evidence = {
            'error_handling': self.check_error_handling(story),
            'retry_logic': self.check_retry_logic(story),
            'circuit_breakers': self.check_circuit_breakers(story),
            'health_checks': self.check_health_checks(story),
            'logging': self.check_logging(story)
        }
        return evidence

    def collect_maintainability_evidence(self, story):
        """Collect maintainability-related evidence."""
        evidence = {
            'test_coverage': self.check_test_coverage(story),
            'code_structure': self.check_code_structure(story),
            'documentation': self.check_documentation(story),
            'dependencies': self.check_dependencies(story)
        }
        return evidence
```

**Benefits**:
- Automated evidence gathering
- Consistent evidence collection across stories
- Reduces manual review time
- Can integrate with static analysis tools

---

### Recommendation 4: Threshold Extraction Service (Medium Priority)

**Current Implementation**:
- Manual search for NFR thresholds in story, architecture, technical preferences

**ADK Translation**:
Use **Cloud Function** with NLP for threshold extraction:

```python
from vertexai.preview.generative_models import GenerativeModel

class NFRThresholdExtractor:
    """Extract NFR thresholds from documentation using AI."""

    def __init__(self):
        self.model = GenerativeModel('gemini-2.0-flash-001')

    def extract_thresholds(self, story, architecture_docs, tech_preferences):
        """Extract NFR thresholds from all available sources."""

        combined_text = f"""
        Story Acceptance Criteria:
        {story.acceptance_criteria}

        Architecture Documentation:
        {architecture_docs}

        Technical Preferences:
        {tech_preferences}
        """

        prompt = f"""
        Extract non-functional requirements (NFRs) and their thresholds from the following text.

        Focus on these NFR categories:
        - Security (authentication, authorization, encryption, rate limiting)
        - Performance (response times, throughput, resource usage)
        - Reliability (uptime, error rates, retry logic)
        - Maintainability (test coverage, code complexity, documentation)

        Text:
        {combined_text}

        Output as JSON:
        {{
          "security": "JWT auth with refresh tokens, TLS 1.3, rate limiting 100 req/min",
          "performance": "<200ms API response (p95), <1s page load",
          "reliability": "99.9% uptime, automatic retry on failures",
          "maintainability": "80% test coverage minimum"
        }}

        If a threshold is not found, use "unknown".
        """

        response = self.model.generate_content(prompt)
        thresholds = json.loads(response.text)

        return thresholds
```

**Benefits**:
- Automated threshold extraction
- Handles various documentation formats
- Reduces manual parsing effort
- Learns from patterns in historical assessments

---

### Recommendation 5: Quality Score Dashboard (Low Priority)

**Current Implementation**:
- Quality score calculated and included in gate file
- No visualization or trend analysis

**ADK Translation**:
Use **Looker** or **Data Studio** to visualize quality scores:

```python
# Export to BigQuery for visualization
from google.cloud import bigquery

def export_nfr_assessment_to_bigquery(assessment: dict):
    """Export NFR assessment to BigQuery for analytics."""

    bq_client = bigquery.Client()
    table_id = 'bmad-analytics.qa.nfr_assessments'

    rows_to_insert = [{
        'story_id': assessment['story_id'],
        'created_at': assessment['created_at'],
        'quality_score': assessment['quality_score'],
        'security_status': assessment['nfr_validation']['security']['status'],
        'performance_status': assessment['nfr_validation']['performance']['status'],
        'reliability_status': assessment['nfr_validation']['reliability']['status'],
        'maintainability_status': assessment['nfr_validation']['maintainability']['status'],
        'fail_count': sum(1 for nfr in assessment['nfr_validation'].values() if nfr['status'] == 'FAIL'),
        'concerns_count': sum(1 for nfr in assessment['nfr_validation'].values() if nfr['status'] == 'CONCERNS')
    }]

    bq_client.insert_rows_json(table_id, rows_to_insert)
```

**Dashboard Metrics**:
- Average quality score across stories
- NFR status distribution (PASS/CONCERNS/FAIL)
- Quality score trends over time
- Most common NFR issues (security, performance, etc.)

**Benefits**:
- Proactive identification of quality trends
- Team performance insights
- Enables data-driven process improvement

---

### Recommendation 6: Interactive Threshold Elicitation UI (Low Priority)

**Current Implementation**:
- Command-line prompts for threshold elicitation (interactive mode)

**ADK Translation**:
Use **Web UI** for threshold elicitation:

```javascript
// React component for threshold elicitation

function NFRThresholdElicitation({ story, onThresholdsProvided }) {
  const [thresholds, setThresholds] = useState({
    security: '',
    performance: '',
    reliability: '',
    maintainability: ''
  });

  const handleSubmit = () => {
    onThresholdsProvided(thresholds);
  };

  return (
    <div className="threshold-elicitation">
      <h2>Define NFR Thresholds for Story {story.id}</h2>

      <p>No thresholds found in story or architecture docs. Please define:</p>

      <div className="threshold-input">
        <label>Security:</label>
        <input
          type="text"
          placeholder="e.g., JWT auth, TLS 1.3, rate limiting"
          value={thresholds.security}
          onChange={(e) => setThresholds({...thresholds, security: e.target.value})}
        />
      </div>

      <div className="threshold-input">
        <label>Performance:</label>
        <input
          type="text"
          placeholder="e.g., <200ms API response time (p95)"
          value={thresholds.performance}
          onChange={(e) => setThresholds({...thresholds, performance: e.target.value})}
        />
      </div>

      <div className="threshold-input">
        <label>Reliability:</label>
        <input
          type="text"
          placeholder="e.g., 99.9% uptime, automatic retry"
          value={thresholds.reliability}
          onChange={(e) => setThresholds({...thresholds, reliability: e.target.value})}
        />
      </div>

      <div className="threshold-input">
        <label>Maintainability:</label>
        <input
          type="text"
          placeholder="e.g., 80% test coverage"
          value={thresholds.maintainability}
          onChange={(e) => setThresholds({...thresholds, maintainability: e.target.value})}
        />
      </div>

      <button onClick={handleSubmit}>Run Assessment</button>
      <button onClick={() => onThresholdsProvided({})}>Skip (use unknown targets policy)</button>
    </div>
  );
}
```

**Benefits**:
- Better UX for threshold elicitation
- Visual validation of inputs
- Can save thresholds for future use
- Enables team collaboration on threshold definition

---

## 13. Summary

### Task Complexity: Medium

**Factors Contributing to Complexity**:
1. **4-step process** with evidence gathering and status determination
2. **Dual output generation** (markdown report + YAML gate block)
3. **Multiple NFR categories** with distinct assessment criteria
4. **Threshold checking** across multiple document sources
5. **Deterministic status rules** with quality score calculation

### Key Characteristics

**Strengths**:
- Quick, pragmatic assessment (5-10 minutes)
- Evidence-based evaluation (no vague findings)
- Deterministic status rules (consistent, repeatable)
- Fail-safe for missing inputs (always provides value)
- Unknown targets policy (encourages explicit requirements)
- ISO 25010 alignment (industry-standard quality model)

**Challenges**:
- Evidence gathering requires file access and code analysis
- Threshold extraction from documentation can be ambiguous
- Quality score is simplified metric (doesn't capture all nuance)
- Quick assessment may miss deep NFR issues

### Primary Use Cases

1. **Story Quality Gate**: Validate NFRs before story completion
2. **Comprehensive Review**: Part of review-story workflow
3. **Proactive Assessment**: Early NFR validation during development
4. **Compliance Verification**: Ensure NFR requirements met
5. **Quality Metrics**: Track quality scores across stories

### Critical Success Factors

1. **Complete File List**: Dev Agent Record must have all modified files
2. **Defined NFR Thresholds**: Story/architecture should specify targets
3. **Evidence Availability**: Implementation must be accessible for review
4. **Deterministic Rules**: Consistent status determination
5. **Output Quality**: Clear, specific, actionable findings

### Integration with BMad Ecosystem

**Upstream Dependencies**:
- Story file (acceptance criteria, File List)
- Architecture documentation (NFR thresholds)
- Technical preferences (custom weights)

**Downstream Consumers**:
- review-story.md (uses nfr_validation block for gate decision)
- qa-gate.md (uses nfr_validation block for gate file)
- Development team (addresses critical issues and quick wins)

**Position in Workflow**:
```
Story Implementation (Dev)
  ↓
Risk Profiling (QA) ← Optional
  ↓
Test Design (QA) ← Optional
  ↓
NFR ASSESSMENT (QA) ← This task
  ↓
Trace Requirements (QA)
  ↓
QA Gate Decision (QA)
```

### ADK Translation Priority

**High Priority**:
1. Cloud Function for quick assessment
2. Firestore for NFR assessment storage

**Medium Priority**:
3. Evidence collection service
4. Threshold extraction service

**Low Priority**:
5. Quality score dashboard
6. Interactive threshold elicitation UI

---

**End of Analysis**
