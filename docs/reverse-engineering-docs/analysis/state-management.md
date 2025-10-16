# State Management Analysis

**Document Version**: 1.0
**Created**: 2025-10-14
**Status**: Complete
**Framework**: BMad Core v4

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [State Management Architecture](#2-state-management-architecture)
3. [File-Based State Tracking](#3-file-based-state-tracking)
4. [Artifact Versioning and Lifecycle](#4-artifact-versioning-and-lifecycle)
5. [Context Preservation Between Agents](#5-context-preservation-between-agents)
6. [Session Management](#6-session-management)
7. [Workflow Position Tracking](#7-workflow-position-tracking)
8. [ADK Translation Recommendations](#8-adk-translation-recommendations)

---

## 1. Executive Summary

### Overview

The BMad framework implements a **file-based state management system** that uses the file system itself as the primary state store. This approach eliminates the need for external databases, enables version control integration, and provides a clear audit trail through git history.

### Core Principles

**1. File System as Source of Truth**
- All state stored in markdown and YAML files
- No external database required for workflow state
- Git provides versioning, history, and rollback capabilities

**2. Status-Driven Orchestration**
- Story status field controls workflow progression
- Status changes trigger agent transitions
- Self-documenting workflow position

**3. Artifact-Mediated Communication**
- Agents communicate through shared files
- No in-memory state sharing
- Clear ownership and edit permissions per artifact section

**4. Stateless Agent Design**
- Agents read files, perform work, write files, exit
- No session state maintained in agent processes
- Resumable workflows from any checkpoint

### Key State Mechanisms

| State Type | Storage Mechanism | Purpose | Example |
|------------|-------------------|---------|---------|
| **Workflow Position** | Story status field | Current stage in development cycle | `Status: Review` |
| **Artifact Content** | Markdown/YAML files | Document evolution over time | Story file with all sections |
| **Quality Decisions** | Gate YAML files | QA gate history and rationale | `gate_decision: PASS` |
| **Configuration** | core-config.yaml | System behavior and file locations | `devStoryLocation: docs/stories` |
| **Agent Context** | File references in sections | What agent did and when | Dev Agent Record, QA Results |
| **Change History** | Change Log sections | Audit trail of modifications | Dated entries by agent |

### State Storage Locations

```
project-root/
├── .bmad-core/
│   └── core-config.yaml               # Configuration state
├── docs/
│   ├── project-brief.md               # Discovery phase artifact
│   ├── prd.md or prd/                 # Planning artifact (sharded)
│   ├── architecture.md or architecture/ # Architecture artifact (sharded)
│   ├── stories/                       # Story state storage
│   │   ├── 1.1.user-auth.md          # Story with status, history
│   │   ├── 1.2.password-reset.md
│   │   └── ...
│   └── qa/                            # Quality assurance state
│       ├── assessments/               # Quality analysis artifacts
│       │   ├── 1.1-risk-20251014.md
│       │   ├── 1.1-test-design-20251014.md
│       │   └── ...
│       └── gates/                     # Gate decision records
│           ├── 1.1-user-auth.yml     # Gate decisions with timestamps
│           └── ...
```

### State Lifecycle Summary

**Planning Phase State:**
1. Project brief created → marks discovery complete
2. PRD created → marks planning in progress
3. Architecture created → marks technical design complete
4. PO validation → marks planning validated
5. Sharding complete → marks ready for development

**Development Phase State:**
1. Story created (Draft) → marks story prepared
2. Story approved (Approved) → marks ready for implementation
3. Implementation in progress (InProgress) → marks dev active
4. Implementation complete (Review) → marks ready for QA
5. QA review complete → gate file created with decision
6. Story done (Done) → marks story complete

**Epic/Project State:**
- Epic complete when all stories have status "Done"
- Project complete when all epics complete
- Tracked via file system queries (grep, find)

### Key Insights

1. **No Central Database**: File system is the state database
2. **Git-Friendly**: All state changes tracked in version control
3. **Human-Readable**: State visible in plain text files
4. **Queryable**: Standard file system tools (grep, find, ls) query state
5. **Resumable**: Workflows can pause and resume from any checkpoint
6. **Stateless Agents**: Agents don't maintain session state internally
7. **Clear Ownership**: File sections have defined owner and editors
8. **Audit Trail**: Change Log and git history provide complete audit trail

---

## 2. State Management Architecture

### Architectural Overview

BMad's state management follows a **distributed file-based architecture** with three primary layers:

```
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                           │
│   (Agents: Analyst, PM, UX, Architect, PO, SM, Dev, QA)    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                STATE MANAGEMENT LAYER                        │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Workflow   │  │   Artifact   │  │Configuration │      │
│  │    State     │  │    State     │  │    State     │      │
│  │              │  │              │  │              │      │
│  │ - Story      │  │ - Content    │  │ - core-      │      │
│  │   status     │  │   sections   │  │   config.yaml│      │
│  │ - Epic       │  │ - Change Log │  │ - File       │      │
│  │   completion │  │ - Timestamps │  │   locations  │      │
│  │ - Project    │  │              │  │ - Agent      │      │
│  │   phase      │  │              │  │   config     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  STORAGE LAYER                               │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  File System │  │  Git Version │  │   Query      │      │
│  │              │  │   Control    │  │   Tools      │      │
│  │ - Markdown   │  │              │  │              │      │
│  │ - YAML       │  │ - History    │  │ - grep       │      │
│  │ - Directory  │  │ - Rollback   │  │ - find       │      │
│  │   structure  │  │ - Branches   │  │ - ls         │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### State Management Principles

#### 1. Single Source of Truth (File System)

**Principle**: The file system is the authoritative source for all state.

**Implementation**:
- Story status stored in story markdown file
- Gate decisions stored in gate YAML files
- Configuration stored in core-config.yaml
- No duplicate state in memory or external databases

**Benefits**:
- Simple architecture (no sync between state stores)
- Version control friendly (git tracks all state changes)
- Human-readable (developers can inspect state directly)
- Tool-friendly (standard CLI tools work)

**Example**:
```markdown
Status: Review

## Story
As a user, I want to reset my password...
```

This status field IS the workflow state. There's no separate state database to sync.

#### 2. Status as State Machine Controller

**Principle**: Story status field drives workflow progression and agent activation.

**State Machine**:
```
Draft → Approved → InProgress → Review → Done
  ↑        ↑           ↓          ↓
  └────────┴───────────┴──────────┘
   (Revision cycles possible)
```

**Agent Behavior Based on Status**:
- `Draft` → User/PO reviews, must approve before Dev
- `Approved` → Dev can begin implementation
- `InProgress` → Dev actively working
- `Review` → QA performs comprehensive review
- `Done` → Story complete, next story begins

**Decision Logic**:
```python
if story.status == "Draft":
    # Dev agent HALTs, cannot implement
    # User must approve first

if story.status == "Approved":
    # Dev agent can begin implementation

if story.status == "Review":
    # QA can perform comprehensive review
    # Dev can apply fixes if gate FAIL/CONCERNS

if story.status == "Done":
    # Story complete
    # Next story can begin
```

#### 3. Artifact-Mediated Handoffs

**Principle**: Agents communicate exclusively through shared file artifacts.

**Handoff Pattern**:
```
Agent A updates artifact (e.g., sets status field)
  ↓ (artifact change in file system)
Artifact change signals Agent B to act
  ↓
Agent B reads artifact and begins work
  ↓
Agent B updates artifact when complete
  ↓
(Cycle continues)
```

**No Direct Communication**:
- Agents don't pass messages to each other
- No inter-process communication needed
- No message queues or event buses (in current implementation)
- File system acts as the "message bus"

**Example**:
```
1. SM creates story, writes to docs/stories/1.1.user-auth.md
2. SM sets Status: Draft in file
3. User reviews file, changes Status: Approved
4. Dev reads file, begins implementation
5. Dev marks tasks [x], sets Status: Review
6. QA reads file, performs review
7. QA creates gate file docs/qa/gates/1.1-user-auth.yml
8. QA updates story QA Results section
9. Dev reads gate file, applies fixes if needed
```

#### 4. Stateless Agent Design

**Principle**: Agents are stateless processes that read files, perform work, write files, and exit.

**Agent Lifecycle**:
```
1. Agent invoked (new chat session or function call)
2. Agent loads required files (story, config, templates)
3. Agent performs work (create, implement, review)
4. Agent updates files (write results)
5. Agent exits (no session state preserved)
```

**No Internal State**:
- Agents don't maintain session variables
- No state passed in memory between agent invocations
- Each invocation is independent (loads state from files)

**Resumability**:
- Workflow can pause at any point
- Resume by reading current file state
- No "lost session" problems

**Example - Dev Agent**:
```
Session 1:
  - Load story (status: Approved)
  - Implement tasks 1-3
  - Mark tasks [x] in story file
  - Exit (story still in memory? No!)

Session 2 (after interruption):
  - Load story (reads from file)
  - See tasks 1-3 marked [x]
  - Continue with task 4
  - Complete remaining tasks
  - Set status: Review in file
  - Exit
```

#### 5. Section Ownership and Edit Permissions

**Principle**: Each artifact section has defined owner and editors, preventing conflicts.

**Ownership Model** (story template):
```yaml
sections:
  - id: status
    owner: scrum-master
    editors: [scrum-master, dev-agent]

  - id: story
    owner: scrum-master
    editors: [scrum-master]

  - id: dev-agent-record
    owner: dev-agent
    editors: [dev-agent]

  - id: qa-results
    owner: qa-agent
    editors: [qa-agent]

  - id: change-log
    owner: scrum-master
    editors: [scrum-master, dev-agent, qa-agent]
```

**Enforcement**:
- Agents ONLY update sections they have edit permission for
- Ownership defines creation responsibility
- Editors defines update permission
- Violations caught in validation

**Benefits**:
- No file locking needed
- Clear responsibility boundaries
- Concurrent agent work possible (different sections)
- Merge conflicts minimized

#### 6. Configuration-Driven Behavior

**Principle**: System behavior configured via core-config.yaml, not hardcoded.

**Configuration State** (.bmad-core/core-config.yaml):
```yaml
markdownExploder: true

qa:
  qaLocation: docs/qa

prd:
  prdFile: docs/prd.md
  prdVersion: v4
  prdSharded: true
  prdShardedLocation: docs/prd
  epicFilePattern: epic-{n}*.md

architecture:
  architectureFile: docs/architecture.md
  architectureVersion: v4
  architectureSharded: true
  architectureShardedLocation: docs/architecture

devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md

devDebugLog: .ai/debug-log.md
devStoryLocation: docs/stories

slashPrefix: BMad
```

**Usage**:
- Agents load config to determine file locations
- No hardcoded paths in agent logic
- Easy to adapt to different project structures
- Version-aware (prdVersion, architectureVersion)

**State Queries Use Config**:
```python
# Dev agent loads config
config = load_config('.bmad-core/core-config.yaml')

# Find story location
story_location = config['devStoryLocation']  # docs/stories

# Load story
story = read_file(f"{story_location}/{epic}.{story}.{title}.md")

# Load always-files
for file in config['devLoadAlwaysFiles']:
    context += read_file(file)
```

### State Management Patterns

#### Pattern 1: Status-Driven Transitions

**Description**: Story status field acts as workflow controller.

**Implementation**:
1. Agent completes work
2. Agent updates status field in story file
3. Status change signals next agent to act
4. Next agent reads file, sees new status, begins work

**Example Flow**:
```
SM creates story → Status: Draft
User approves → Status: Approved
Dev implements → Status: Review
QA reviews → (no status change, creates gate file)
User marks done → Status: Done
```

#### Pattern 2: Timestamped Artifacts

**Description**: Multiple versions of same artifact type tracked via timestamps.

**Implementation**:
- Gate files: `{epic}.{story}-{slug}.yml` (slug includes timestamp)
- Assessment files: `{epic}.{story}-{type}-{YYYYMMDD}.md`

**Purpose**:
- Track quality improvement over iterations
- Preserve history of gate decisions
- Compare assessments across time

**Example**:
```
docs/qa/gates/
  1.1-user-auth-20251014.yml  (iteration 1, decision: FAIL)
  1.1-user-auth-20251015.yml  (iteration 2, decision: CONCERNS)
  1.1-user-auth-20251016.yml  (iteration 3, decision: PASS)

docs/qa/assessments/
  1.1-risk-20251014.md  (initial risk assessment)
  1.1-test-design-20251014.md
  1.1-trace-20251015.md  (after tests added)
```

#### Pattern 3: Append-Only Change Log

**Description**: Change Log section in story file tracks all modifications.

**Implementation**:
```markdown
## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-14 | 1.0 | Story created | SM |
| 2025-10-15 | 1.1 | Tasks completed, tests added | Dev |
| 2025-10-15 | 1.2 | QA review - gate FAIL, issues logged | QA |
| 2025-10-16 | 1.3 | Fixes applied per QA findings | Dev |
| 2025-10-16 | 1.4 | Re-review - gate PASS | QA |
```

**Purpose**:
- Audit trail of story evolution
- Attribution (who made what changes)
- Rationale (why changes made)
- Timeline (when changes occurred)

#### Pattern 4: Reference-Based Context

**Description**: Files reference other files rather than duplicating content.

**Implementation**:
- Dev Notes cite architecture sections (source citations)
- Story file references epic file (requirements source)
- Gate file references assessment files (supporting evidence)

**Example**:
```markdown
## Dev Notes

### Database Schema
Per `docs/architecture/database-design.md`, use the following schema:
[schema details extracted from architecture]

**Source**: docs/architecture/database-design.md, section "User Authentication Schema"
```

**Benefits**:
- No content duplication (single source of truth)
- Clear provenance (where info came from)
- Anti-hallucination (can verify against source)
- Smaller files (reference vs. copy)

### State Consistency

**Consistency Model**: **Eventual Consistency**

BMad does not enforce strict transactional consistency. Instead:

**Within Single File**:
- File write is atomic (OS-level)
- Sections updated together in single file write
- No partial writes visible

**Across Multiple Files**:
- Story file and gate file updated separately
- Possible to see story updated but gate not yet created (brief window)
- Acceptable because workflow is human-paced (not millisecond-critical)

**Conflict Resolution**:
- Section ownership prevents conflicts
- Multiple agents never update same section
- Git merge conflicts rare (different sections, different files)

**Validation Checkpoints**:
- PO validation ensures planning artifacts consistent
- Story draft validation ensures story internally consistent
- DoD checklist ensures implementation complete before review

---

## 3. File-Based State Tracking

### File-Based State Philosophy

BMad uses the file system as its database, embracing the principle: **"Your project files ARE the state database."**

### Primary State Files

#### 1. Story Files (Core Workflow State)

**Location**: `docs/stories/{epic}.{story}.{title}.md`

**Purpose**: Central state document for story lifecycle

**State Information Stored**:
- **Status field**: Current workflow position (Draft/Approved/InProgress/Review/Done)
- **Tasks checkboxes**: Implementation progress tracking
- **Dev Agent Record**: Implementation details, file list, completion notes
- **QA Results**: Quality findings and gate summary
- **Change Log**: Complete modification history

**Structure**:
```markdown
Status: Review

## Story
As a user, I want to...

## Acceptance Criteria
1. Criterion 1
2. Criterion 2

## Tasks / Subtasks
- [x] Task 1
  - [x] Subtask 1.1
  - [x] Subtask 1.2
- [x] Task 2
- [ ] Task 3 (in progress)

## Dev Notes
### Architecture Context
[Context from architecture docs]

### Testing
[Testing standards]

## Dev Agent Record
### Agent Model Used
claude-sonnet-3.5-20241022

### File List
- src/auth/password-reset.ts (created)
- tests/auth/password-reset.test.ts (created)
- src/auth/index.ts (modified)

### Completion Notes
- Implemented password reset flow
- Added email verification
- All tests passing

## QA Results
Gate decision: PASS
Rationale: All requirements met, comprehensive tests
[QA detailed findings]

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-14 | 1.0 | Created | SM |
| 2025-10-15 | 1.1 | Implemented | Dev |
| 2025-10-16 | 1.2 | Reviewed | QA |
```

**State Queries**:
```bash
# Find current story (not Done)
find docs/stories -name "*.md" -exec grep -l "^Status: \(Draft\|Approved\|InProgress\|Review\)" {} \;

# Count stories by status
grep "^Status:" docs/stories/*.md | cut -d: -f3 | sort | uniq -c

# Epic 1 progress
grep "^Status: Done" docs/stories/1.*.md | wc -l
```

#### 2. Gate Files (Quality Decision State)

**Location**: `docs/qa/gates/{epic}.{story}-{slug}.yml`

**Purpose**: Record of QA gate decisions with rationale

**State Information Stored**:
- **gate_decision**: PASS | CONCERNS | FAIL | WAIVED
- **rationale**: Why this decision was made
- **top_issues**: Prioritized findings
- **nfr_validation**: Security, performance, reliability, maintainability status
- **created_at**: Timestamp
- **created_by**: Always "qa-agent"

**Structure**:
```yaml
epic_story: "1.2"
gate_decision: "PASS"
rationale: "All acceptance criteria met with comprehensive test coverage. Code quality excellent."
top_issues:
  - id: "ISSUE-001"
    severity: "low"
    finding: "Minor code style inconsistency in error handling"
    suggested_action: "Consider extracting error handler to utility function"
nfr_validation:
  security:
    status: "PASS"
    notes: "No vulnerabilities found. Input validation comprehensive."
  performance:
    status: "PASS"
    notes: "Response times within acceptable range."
  reliability:
    status: "PASS"
    notes: "Error handling robust. Edge cases covered."
  maintainability:
    status: "PASS"
    notes: "Code well-structured and documented."
test_design:
  coverage_gaps: []
trace_coverage:
  uncovered_requirements: []
risk_summary:
  recommendations:
    must_fix: []
created_at: "2025-10-16"
created_by: "qa-agent"
```

**State Queries**:
```bash
# All FAIL gates
grep -l "gate_decision: FAIL" docs/qa/gates/*.yml

# Gate decisions for epic 1
grep "gate_decision:" docs/qa/gates/1.*.yml

# Latest gate for story 1.2
ls -t docs/qa/gates/1.2-*.yml | head -1
```

**Iteration Tracking**:
Multiple gate files for same story show quality improvement:
```
1.2-password-reset-20251014.yml  (FAIL)
1.2-password-reset-20251015.yml  (CONCERNS)
1.2-password-reset-20251016.yml  (PASS)
```

#### 3. Configuration File (System State)

**Location**: `.bmad-core/core-config.yaml`

**Purpose**: Define system behavior and file locations

**State Information Stored**:
- File locations (stories, QA artifacts, architecture)
- Sharding configuration (enabled, patterns)
- Dev agent context files (devLoadAlwaysFiles)
- Debug log location
- Version information (PRD v4, architecture v4)

**Structure**:
```yaml
markdownExploder: true

qa:
  qaLocation: docs/qa

prd:
  prdFile: docs/prd.md
  prdVersion: v4
  prdSharded: true
  prdShardedLocation: docs/prd
  epicFilePattern: epic-{n}*.md

architecture:
  architectureFile: docs/architecture.md
  architectureVersion: v4
  architectureSharded: true
  architectureShardedLocation: docs/architecture

devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md

devDebugLog: .ai/debug-log.md
devStoryLocation: docs/stories

slashPrefix: BMad
```

**Usage**: Agents load this file first to determine where to find other files.

#### 4. Assessment Files (Quality Analysis State)

**Location**: `docs/qa/assessments/{epic}.{story}-{type}-{YYYYMMDD}.md`

**Purpose**: Detailed quality analysis supporting gate decisions

**Types**:
- `risk`: Risk assessment with probability × impact scoring
- `test-design`: Test strategy and scenario generation
- `trace`: Requirements-to-test traceability
- `nfr`: Non-functional requirements validation

**Structure** (example - risk assessment):
```markdown
# Risk Profile: Story 1.2 - Password Reset

**Epic**: 1
**Story**: 2
**Date**: 2025-10-14
**Analyst**: QA Agent

## Risk Categories

### 1. Security Risk
- **Probability**: 7/9 (High)
- **Impact**: 9/9 (Critical)
- **Score**: 63/81 (HIGH RISK)
- **Finding**: Password reset tokens must be time-limited and one-time-use
- **Mitigation**: Implement token expiration (15 min) and invalidate after use

### 2. Integration Risk
- **Probability**: 4/9 (Medium)
- **Impact**: 6/9 (Significant)
- **Score**: 24/81 (MEDIUM RISK)
- **Finding**: Email service dependency
- **Mitigation**: Implement retry logic and fallback notification

[... more risk categories ...]

## Summary
- Total risks identified: 8
- High risks: 2 (must address)
- Medium risks: 4 (should address)
- Low risks: 2 (nice to address)

## Recommendations
### Must Fix:
1. Token expiration and one-time-use enforcement
2. Rate limiting on reset endpoint

### Should Fix:
1. Email retry logic
2. User notification on password change
[...]
```

**State Queries**:
```bash
# All risk assessments
find docs/qa/assessments -name "*-risk-*.md"

# Latest assessment for story 1.2
ls -t docs/qa/assessments/1.2-*.md | head -1
```

### Secondary State Files

#### 5. Planning Artifacts (Planning Phase State)

**Locations**:
- `docs/project-brief.md` - Discovery phase complete
- `docs/prd.md` or `docs/prd/` - Requirements defined
- `docs/architecture.md` or `docs/architecture/` - Technical design complete
- `docs/front-end-spec.md` - UI/UX design (if applicable)

**State Information**:
- Existence indicates phase completion
- Sharded vs monolithic indicates preparation for development

**State Transition**:
```
project-brief.md exists → Discovery complete
prd.md exists → Planning complete
architecture.md exists → Technical design complete
docs/prd/ exists → Sharding complete, ready for development
```

#### 6. Debug Logs (Execution Trace State)

**Location**: Configured in `devDebugLog` (e.g., `.ai/debug-log.md`)

**Purpose**: Trace of commands executed, results, debugging information

**State Information**:
- Commands run by Dev agent
- Results of validations (linting, testing)
- Error messages and stack traces
- Debugging notes

**Structure**:
```markdown
# Debug Log

## 2025-10-15 14:23:45 - Story 1.2 Implementation

### Task 1: Create password reset endpoint
```bash
$ npm test src/auth/password-reset.test.ts
PASS  src/auth/password-reset.test.ts
  Password Reset
    ✓ should generate reset token (12 ms)
    ✓ should validate token (8 ms)
    ✓ should expire token after 15 minutes (6 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

### Task 2: Add rate limiting
[... debug output ...]
```

**Referenced From**: Dev Agent Record > Debug Log References

### File-Based State Benefits

**1. Version Control Integration**
- All state changes tracked in git
- Commit history = state change history
- Rollback possible to any previous state
- Branches enable parallel work

**2. Human-Readable**
- Developers can inspect state directly
- No special tools needed (text editor sufficient)
- Plain text enables CLI tools (grep, awk, sed)

**3. No Database Setup**
- Zero infrastructure dependencies
- Works on any system with file system
- No database migrations needed
- No database backups needed (git is the backup)

**4. Portability**
- State is self-contained in project
- No external state stores to migrate
- Easy to copy projects (cp -r)
- CI/CD friendly (all state in repo)

**5. Queryability**
- Standard CLI tools (grep, find, ls, wc)
- No SQL/query language needed
- Fast (file system optimized for these operations)
- Scriptable (bash, python, etc. can query state)

**6. Auditability**
- Git history shows who changed what when
- Change Log in files shows reasoning
- Timestamps in filenames track iterations
- Full audit trail without special logging infrastructure

### File-Based State Challenges

**1. Concurrency**
- Multiple agents updating same file → potential conflicts
- **Mitigation**: Section ownership prevents this (different sections)

**2. Atomicity**
- Multiple file updates not atomic across files
- **Mitigation**: Acceptable because workflow is human-paced, not microsecond-critical

**3. Scalability**
- Large projects → many files in directories
- **Mitigation**: Acceptable for typical project sizes (100s of stories, not millions)

**4. Search Performance**
- grep across thousands of files can be slow
- **Mitigation**: Use ripgrep (rg) for faster searching; typical projects small enough

**5. No Built-In Indexing**
- File system doesn't index content
- **Mitigation**: ADK translation can use Firestore for indexing while preserving files

---

## 4. Artifact Versioning and Lifecycle

### Artifact Types and Lifecycles

BMad manages multiple artifact types, each with distinct lifecycles:

#### 1. Story Artifact Lifecycle

**Creation** (SM Agent):
```
1. SM executes create-next-story task
2. SM loads epic file from sharded PRD
3. SM gathers architecture context
4. SM populates story template
5. SM writes story file: docs/stories/{epic}.{story}.{title}.md
6. Initial status: Draft
7. Initial Change Log entry created
```

**Approval** (User/PO):
```
1. Optional: PO validates story (validate-next-story task)
2. User reviews story completeness
3. User manually updates Status: Draft → Approved
4. Change Log entry added (if significant changes)
```

**Implementation** (Dev Agent):
```
1. Dev loads story + devLoadAlwaysFiles
2. Dev implements tasks sequentially
3. Dev marks tasks [x] as completed
4. Dev updates Dev Agent Record sections:
   - Agent Model Used
   - Debug Log References
   - Completion Notes
   - File List
5. Dev updates Change Log with completion summary
6. Dev sets Status: Review
```

**Review** (QA Agent):
```
1. QA loads story + implementation files
2. QA performs comprehensive review
3. QA may call sub-tasks (risk, test-design, trace, nfr)
4. QA creates gate file: docs/qa/gates/{epic}.{story}-{slug}.yml
5. QA updates story QA Results section with summary
6. QA updates Change Log
7. Gate decision determines next action (PASS/CONCERNS/FAIL/WAIVED)
```

**Iteration** (Dev → QA cycles):
```
1. If gate FAIL or CONCERNS:
   a. Dev loads gate file
   b. Dev applies fixes per deterministic priority
   c. Dev updates Dev Agent Record File List
   d. Dev updates Change Log with fix description
   e. Dev sets Status: Review (triggers re-review)
   f. QA re-reviews → new gate file created
   g. Repeat until gate PASS or WAIVED
```

**Completion** (User/PO):
```
1. Gate decision is PASS or WAIVED
2. User/PO performs final validation (optional)
3. User sets Status: Done
4. Story enters terminal state
```

**Archival** (Permanent):
```
1. Story file remains in docs/stories/
2. Git history preserves all changes
3. Story available for retrospectives
4. Metrics extractable from completed stories
```

**Lifecycle Timeline**:
```
Created (Draft) → Approved → InProgress → Review → Done
  Hours            Minutes    Hours-Days   Hours    Permanent
```

#### 2. Gate Artifact Lifecycle

**Creation** (QA Agent after comprehensive review):
```
1. QA completes review of story implementation
2. QA makes gate decision (PASS/CONCERNS/FAIL/WAIVED)
3. QA writes gate YAML: docs/qa/gates/{epic}.{story}-{slug}.yml
   - slug includes timestamp or unique identifier
4. QA updates story QA Results section with gate summary
```

**Consumption** (Dev Agent during fix application):
```
1. Dev loads most recent gate file for story
2. Dev extracts:
   - gate_decision
   - top_issues (prioritized by severity)
   - nfr_validation (FAIL items first)
   - test_design.coverage_gaps
   - trace_coverage.uncovered_requirements
   - risk_summary.must_fix
3. Dev builds deterministic fix plan
4. Dev applies fixes
```

**Iteration** (Multiple gates per story):
```
1. First review: 1.2-password-reset-20251014.yml (decision: FAIL)
2. Dev fixes, QA re-reviews
3. Second review: 1.2-password-reset-20251015.yml (decision: CONCERNS)
4. Dev addresses concerns, QA re-reviews
5. Third review: 1.2-password-reset-20251016.yml (decision: PASS)
```

**Archival** (All gates preserved):
```
1. All gate files for story preserved permanently
2. Show quality improvement trajectory
3. Provide historical context for retrospectives
4. Metrics: iterations to PASS, common issue categories
```

**Lifecycle Timeline**:
```
Created (after Dev Review) → Read (by Dev if not PASS) → Superseded (by new gate) → Archived
  Minutes                     Minutes-Hours             Hours                    Permanent
```

#### 3. Assessment Artifact Lifecycle

**Creation** (QA Agent - optional, mid-dev or during review):
```
1. QA executes specific assessment task:
   - *risk (risk-profile.md)
   - *design (test-design.md)
   - *trace (trace-requirements.md)
   - *nfr (nfr-assess.md)
2. QA analyzes story and implementation (if exists)
3. QA writes assessment markdown: docs/qa/assessments/{epic}.{story}-{type}-{YYYYMMDD}.md
4. Assessment includes findings, recommendations, scoring
```

**Consumption** (Multiple agents):
```
Dev Agent:
  - Reads before or during implementation for guidance
  - Uses test-design for test scenario generation
  - Uses risk profile for mitigation strategies

QA Agent:
  - References during comprehensive review
  - Synthesizes findings into gate decision
  - May re-run assessments after fixes to verify improvement

PO/User:
  - Reviews risk and NFR assessments for trade-off decisions
  - Uses for WAIVED gate rationale
```

**Updates** (Timestamped versions):
```
1. Initial assessment: 1.2-risk-20251014.md
2. After fixes: 1.2-risk-20251015.md (shows risk reduction)
3. Each version is new file (timestamps differentiate)
4. No in-place updates (preserves history)
```

**Archival**:
```
1. All assessment files preserved
2. Show quality evolution
3. Inform future risk profiling (patterns)
```

**Lifecycle Timeline**:
```
Created (optional, any time) → Read (by Dev/QA) → Superseded (new version) → Archived
  Minutes                       Hours-Days         Days                      Permanent
```

#### 4. Planning Artifact Lifecycle

**Project Brief**:
```
Created (Analyst) → Read (PM) → Archived
  Discovery phase    Planning     Permanent
```

**PRD**:
```
Created (PM) → Read (UX, Architect) → Updated (if Architect feedback) → Validated (PO) → Sharded (PO) → Archived
  Planning       Planning                Planning                       Planning          Dev phase     Permanent
```

**Architecture**:
```
Created (Architect) → Read (PM, PO, SM) → Sharded (PO) → Read (SM for story context) → Archived
  Planning              Planning            Dev prep       Ongoing development            Permanent
```

**Sharded Documents**:
```
Created (PO shard-doc task) → Read (SM for story creation) → Ongoing reference → Archived
  Transition to dev           Dev phase                      Dev phase           Permanent
```

**Lifecycle Timeline**:
```
Planning Phase (days-weeks) → Development Phase (weeks-months) → Archived (permanent)
```

### Versioning Strategy

#### Implicit Versioning (Git)

**Mechanism**: Git commit history provides versioning for all files

**Benefits**:
- Automatic (no manual version numbering needed)
- Complete history (every change tracked)
- Diff-able (see exact changes between versions)
- Rollback (revert to any previous state)

**Usage**:
```bash
# See story history
git log -- docs/stories/1.2.password-reset.md

# See changes in last commit
git diff HEAD~1 docs/stories/1.2.password-reset.md

# Revert story to previous version
git checkout HEAD~1 -- docs/stories/1.2.password-reset.md
```

#### Explicit Versioning (Change Log)

**Mechanism**: Change Log table in story file

**Structure**:
```markdown
## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-14 | 1.0 | Story created | SM |
| 2025-10-15 | 1.1 | Implemented | Dev |
| 2025-10-16 | 1.2 | QA review | QA |
| 2025-10-17 | 1.3 | Fixes applied | Dev |
| 2025-10-18 | 1.4 | Re-review PASS | QA |
```

**Benefits**:
- Human-readable version history
- Rationale for changes
- Attribution (who made change)
- Timeline (when change made)

#### Timestamped Files (Gate and Assessment Files)

**Mechanism**: Filename includes timestamp

**Examples**:
```
docs/qa/gates/1.2-password-reset-20251014.yml
docs/qa/gates/1.2-password-reset-20251015.yml
docs/qa/gates/1.2-password-reset-20251016.yml

docs/qa/assessments/1.2-risk-20251014.md
docs/qa/assessments/1.2-test-design-20251014.md
```

**Benefits**:
- Multiple versions coexist (no overwrites)
- Chronological ordering easy (ls -t)
- Quality trajectory visible
- No need for git to track versions (files themselves are versions)

### Artifact Metadata

#### Story File Metadata

**YAML Front Matter** (optional):
```yaml
---
epic: 1
story: 2
title: Password Reset Flow
status: Review
created: 2025-10-14
created_by: sm-agent
updated: 2025-10-16
---
```

**Inline Metadata**:
```markdown
Status: Review

Epic: 1
Story: 2
Title: Password Reset Flow
```

#### Gate File Metadata

```yaml
epic_story: "1.2"
gate_decision: "PASS"
created_at: "2025-10-16"
created_by: "qa-agent"
```

#### Assessment File Metadata

```markdown
# Risk Profile: Story 1.2

**Epic**: 1
**Story**: 2
**Date**: 2025-10-14
**Analyst**: QA Agent
```

### Artifact Dependencies

**Dependency Graph**:
```
project-brief.md
  ↓ (read by PM)
prd.md
  ↓ (read by UX Expert)
front-end-spec.md
  ↓ (read by Architect)
architecture.md
  ↓ (PO shards)
docs/prd/epic-*.md + docs/architecture/*.md
  ↓ (SM reads for story creation)
docs/stories/{epic}.{story}.md
  ↓ (Dev reads for implementation)
  ↓ (QA reads for review)
docs/qa/gates/{epic}.{story}.yml
  ↓ (Dev reads for fixes)
[Iteration cycle]
  ↓
Status: Done (story complete)
```

**Dependency Resolution**:
- Agents load dependencies via core-config.yaml paths
- Missing dependencies cause HALT (agent escalates to user)
- Circular dependencies not possible (linear workflow)

### Artifact Lifecycle State Queries

**Planning Phase Queries**:
```bash
# Check if planning complete
[[ -f docs/project-brief.md ]] && echo "Brief exists"
[[ -f docs/prd.md ]] && echo "PRD exists"
[[ -f docs/architecture.md ]] && echo "Architecture exists"

# Check if sharding complete
[[ -d docs/prd ]] && echo "PRD sharded"
[[ -d docs/architecture ]] && echo "Architecture sharded"
```

**Story Lifecycle Queries**:
```bash
# Stories by status
for status in Draft Approved InProgress Review Done; do
  count=$(grep -l "^Status: $status" docs/stories/*.md 2>/dev/null | wc -l)
  echo "$status: $count"
done

# Epic progress
epic=1
total=$(ls docs/stories/${epic}.*.md 2>/dev/null | wc -l)
done=$(grep -l "^Status: Done" docs/stories/${epic}.*.md 2>/dev/null | wc -l)
echo "Epic $epic: $done/$total stories complete"
```

**QA Artifact Queries**:
```bash
# Gate decisions distribution
grep "gate_decision:" docs/qa/gates/*.yml | cut -d: -f3 | tr -d ' "' | sort | uniq -c

# Stories needing attention (FAIL gates)
grep -l "gate_decision: FAIL" docs/qa/gates/*.yml | sed 's/.*\/\([0-9]\+\.[0-9]\+\).*/\1/' | sort -u

# Assessment count by type
for type in risk test-design trace nfr; do
  count=$(ls docs/qa/assessments/*-${type}-*.md 2>/dev/null | wc -l)
  echo "$type: $count"
done
```

---

## 5. Context Preservation Between Agents

### Context Passing Model

BMad preserves context between agents through **artifact-based context passing** rather than in-memory state sharing.

### Context Types

#### 1. Planning Context (SM → Dev)

**Mechanism**: SM extracts architecture context and embeds it in story Dev Notes

**What Gets Passed**:
- **Architecture context** (technology stack, patterns, coding standards)
- **Testing standards** (frameworks, test locations, coverage requirements)
- **Source tree information** (project structure, file organization)
- **Epic requirements** (user story, acceptance criteria)
- **Previous story learnings** (if relevant to current story)

**Key Principle**: Dev should NEVER need to read PRD or architecture docs directly. All context is pre-extracted by SM.

#### 2. Implementation Context (Dev → QA)

**Mechanism**: Dev Agent Record captures implementation details

**What Gets Passed**:
- **File List**: All created/modified/deleted files
- **Agent Model**: AI model used for development
- **Completion Notes**: Implementation summary, decisions made, challenges
- **Debug Log References**: Links to detailed execution traces

**Purpose**: QA knows exactly what was changed, why, and where to focus review.

#### 3. Quality Feedback Context (QA → Dev)

**Mechanism**: Gate file + QA Results section

**What Gets Passed**:
- **Gate Decision**: PASS/CONCERNS/FAIL/WAIVED
- **Top Issues**: Prioritized findings with severity
- **NFR Validation**: Security, performance, reliability, maintainability status
- **Coverage Gaps**: Missing tests identified
- **Requirements Traceability**: Uncovered AC
- **Risk Summary**: Must-fix recommendations

**Purpose**: Dev knows exactly what to fix and in what priority order.

### Context Preservation Mechanisms

#### Mechanism 1: Self-Contained Stories

**Principle**: Story file contains ALL context needed for implementation

**SM Responsibilities**:
- Read architecture docs on Dev's behalf
- Extract relevant sections for this story type (backend/frontend/fullstack)
- Cite sources (architecture document + section)
- Include complete technical context in Dev Notes
- Provide testing standards specific to story

**Dev Behavior**:
- Load story file + devLoadAlwaysFiles ONLY
- Never load PRD or full architecture documents
- Trust Dev Notes as complete context
- Escalate if context insufficient (blocking condition)

**Validation**:
- PO's validate-next-story task checks Dev Notes completeness
- Anti-hallucination validation ensures all claims traceable to sources

#### Mechanism 2: Configuration-Driven Context Loading

**Principle**: core-config.yaml defines what context Dev always loads

**devLoadAlwaysFiles Configuration**:
```yaml
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md  # Code style, patterns, best practices
  - docs/architecture/tech-stack.md        # Technologies, versions, dependencies
  - docs/architecture/source-tree.md       # Project structure, file organization
```

**Benefits**:
- Consistent context across all stories
- Minimal token usage (only essential files)
- Configurable per project
- No hardcoded context loading in agents

---

## 6. Session Management

### Session Model

BMad implements a **stateless session model** where sessions are ephemeral and state is persisted in files.

### Session Characteristics

#### 1. Ephemeral Sessions (No Persistent Sessions)

**Definition**: Each agent invocation is an independent session

**Session Lifecycle**:
```
1. User initiates agent (new chat or command)
2. Agent loads files (story, config, templates)
3. Agent performs work
4. Agent writes results to files
5. Session ends (agent context discarded)
```

**No Session State**:
- Agents don't maintain session variables between invocations
- No cookies or session tokens
- No session database
- No "logged in" state

**Key Insight**: File system is the session state store.

#### 2. New Chat Per Agent Invocation

**Principle**: Each agent invocation uses a new chat session

**Implementation**:
- User activates agent: `@sm`, `@dev`, `@qa`, `@po`
- Agent persona loaded fresh
- Agent loads context from files
- Previous chat history not available (stateless)

**Benefits**:
- No context window pollution from previous sessions
- Fresh start with current file state
- No memory leaks or session bloat
- Clear separation between agent invocations

---

## 7. Workflow Position Tracking

### Workflow Position Definition

**Workflow Position**: The current location in the workflow sequence, determining which agent should act next.

### Position Tracking Mechanisms

#### 1. Story Status Field (Primary Position Indicator)

**Status Values Map to Workflow Stages**:

| Status | Workflow Position | Next Agent | Next Action |
|--------|-------------------|------------|-------------|
| **Draft** | Story preparation complete | User/PO | Review and approve |
| **Approved** | Ready for implementation | Dev | Begin development |
| **InProgress** | Development active | Dev | Continue implementation |
| **Review** | Implementation complete | QA | Comprehensive review |
| **Done** | Story complete | SM | Create next story |

**Position Query**:
```bash
# Current workflow position for story 1.2
status=$(grep "^Status:" docs/stories/1.2.*.md | cut -d: -f2 | tr -d ' ')

case $status in
  "Draft") echo "Awaiting approval" ;;
  "Approved") echo "Ready for Dev" ;;
  "InProgress") echo "Dev working" ;;
  "Review") echo "Ready for QA" ;;
  "Done") echo "Story complete" ;;
esac
```

#### 2. Planning Phase Position Tracking

**Position Indicators** (file existence):

```bash
# Workflow position in planning phase
if [[ ! -f docs/project-brief.md ]]; then
  echo "Position: Discovery phase - Analyst needed"
elif [[ ! -f docs/prd.md ]]; then
  echo "Position: Planning phase - PM needed"
elif [[ ! -f docs/architecture.md ]]; then
  echo "Position: Architecture phase - Architect needed"
elif [[ ! -d docs/prd ]]; then
  echo "Position: Validation complete - PO sharding needed"
else
  echo "Position: Planning complete - Ready for development"
fi
```

**Artifacts as Position Markers**:
- **project-brief.md** exists → Discovery complete
- **prd.md** exists → Requirements defined
- **architecture.md** exists → Technical design complete
- **docs/prd/** directory exists → Sharding complete, dev can begin

### Position Persistence

#### File System as Position Store

**Storage**:
- Story status field → position in story lifecycle
- File existence → position in planning phase
- Epic completion detection → position in epic sequence
- Task checkboxes → position in implementation

**Persistence**:
- All position indicators in files
- Git tracks position changes over time
- No external position database needed

**Resumability**:
- Workflow can pause at any position
- Resume by reading file state
- Position immediately clear from file inspection

---

## 8. ADK Translation Recommendations

### Overview

Translating BMad's file-based state management to Google Cloud Platform using Vertex AI Agent Development Kit (ADK) requires preserving the core principles while leveraging cloud-native services.

### Core Principle Preservation

**Maintain**:
- File-based artifacts (Cloud Storage)
- Status-driven orchestration (Firestore + Cloud Workflows)
- Stateless agents (Vertex AI Agent Builder)
- Artifact-mediated handoffs (Pub/Sub events)

**Enhance**:
- Query performance (Firestore indexing)
- State consistency (Firestore transactions)
- Scalability (managed services)

### Technology Mapping

| BMad Component | GCP Service | Rationale |
|----------------|-------------|-----------|
| **Story Status Field** | Firestore document field | Fast queries, transactional updates |
| **Story Files (markdown)** | Cloud Storage + Firestore | Preserve files, index metadata |
| **Gate Files (YAML)** | Cloud Storage + Firestore | Preserve files, query decisions |
| **core-config.yaml** | Secret Manager + Firestore | Secure config, version control |
| **Workflow Position** | Firestore + Cloud Workflows state | Distributed state tracking |
| **Agent Sessions** | Vertex AI Agent runtime | Managed stateless execution |
| **Context Loading** | Cloud Storage + Vertex AI RAG | Efficient artifact retrieval |
| **State Queries** | Firestore queries | Fast, indexed queries |
| **Change History** | Cloud Storage versions + Firestore | Full audit trail |

### Architecture Design

#### Hybrid Storage Model

**Cloud Storage** (Artifact Storage):
```
gs://bmad-artifacts-{project_id}/
├── docs/
│   ├── project-brief.md
│   ├── prd/
│   ├── architecture/
│   ├── stories/
│   └── qa/
└── .bmad-core/
    └── core-config.yaml
```

**Firestore** (State Indexing):
```javascript
// /projects/{project_id}
{
  name: "E-commerce Platform",
  phase: "development",
  current_epic: "2",
  created_at: timestamp
}

// /projects/{project_id}/stories/{epic}.{story}
{
  epic: "1",
  story: "2",
  title: "Password Reset Flow",
  status: "Review",
  story_url: "gs://bucket/docs/stories/1.2.password-reset.md",
  created_at: timestamp,
  updated_at: timestamp
}
```

**Benefits**:
- **Cloud Storage**: Preserves markdown/YAML files (git-compatible if synced)
- **Firestore**: Fast queries on status, epic, decisions
- **Best of Both**: Human-readable files + structured queries

### Migration Strategy

**Phase 1: Hybrid Mode** (Files + Firestore)
- Preserve markdown/YAML files in Cloud Storage
- Sync metadata to Firestore on write
- Queries use Firestore, reads use Cloud Storage

**Phase 2: Full ADK** (Cloud-Native)
- Cloud Workflows orchestrate agent sequences
- Vertex AI agents replace chat-based agents
- Firestore provides state management
- Pub/Sub enables event-driven handoffs

**Phase 3: Enhanced Features** (Beyond BMad)
- Real-time dashboards (Firestore listeners + web UI)
- Advanced analytics (BigQuery export from Firestore)
- Multi-project management (Firestore queries across projects)

---

## Summary

BMad's state management is a **file-based, status-driven, stateless architecture** that leverages the file system as its database. This approach provides simplicity, portability, and git integration while supporting complex multi-agent workflows.

**Key Characteristics**:
1. **File System as Database** - All state in markdown/YAML files
2. **Status-Driven Orchestration** - Story status field controls workflow
3. **Stateless Agents** - Agents load state from files, no session memory
4. **Artifact-Mediated Communication** - Agents communicate via file updates
5. **Section Ownership** - Prevents conflicts through edit permissions
6. **Configuration-Driven** - Behavior configured, not hardcoded
7. **Git-Friendly** - All state changes tracked in version control
8. **Resumable Workflows** - Pause and resume from file state
9. **Auditable** - Complete audit trail via git history + Change Logs
10. **Queryable** - Standard CLI tools query state

**ADK Translation Preserves Core Principles While Enhancing**:
- Preserve file-based artifacts (Cloud Storage)
- Enhance query performance (Firestore indexing)
- Improve orchestration (Cloud Workflows)
- Enable real-time tracking (Firestore listeners)
- Provide scalability (managed services)

**Document Complete**: ~2,000 lines of comprehensive state management analysis

---

**Document Version**: 1.0
**Created**: 2025-10-14
**Status**: Complete
**Framework**: BMad Core v4
**Analyzed By**: Claude Code (AI Agent)
**Total Lines**: ~2,000

