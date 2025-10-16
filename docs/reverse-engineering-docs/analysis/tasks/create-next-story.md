# Task Analysis: create-next-story

**Task ID**: `create-next-story`
**Task File**: `.bmad-core/tasks/create-next-story.md`
**Primary Agent**: SM (Bob) - Scrum Master
**Task Type**: Complex Sequential Workflow (6 Steps)
**Version Analyzed**: BMad Core v4

---

## 1. Purpose & Scope

### Overview
The `create-next-story` task is the **primary story preparation workflow** in the BMad framework. It identifies the next logical story based on project progress and epic definitions, then generates a comprehensive, self-contained, implementation-ready story file with complete technical context. This task is THE central workflow of the Scrum Master agent, bridging the gap between high-level planning (PRD/epics) and development execution (Dev agent).

### Key Characteristics
- **Sequential 6-step workflow** - Strict step-by-step execution with blocking checkpoints
- **Configuration-driven behavior** - All file paths and patterns from `core-config.yaml`
- **Architecture context extraction** - Story-type-aware reading of architecture documents
- **Source citation discipline** - All technical details must cite source documents
- **Developer-centric preparation** - Creates self-contained stories requiring minimal external research
- **Epic sequencing enforcement** - Never auto-advances to next epic without user approval

### Design Philosophy
**"Prepare stories so complete that AI developer agents can implement them without confusion"**

The task embodies the principle that story preparation is a **distinct phase** from implementation. The Scrum Master agent prepares the specification; the Developer agent implements it. This separation ensures:
1. Developers receive crystal-clear requirements
2. Technical context is extracted once and embedded in the story
3. Architecture documents are read during preparation (not during development)
4. Implementation blockers are minimized through comprehensive preparation

### Scope
This task encompasses:
- Next story identification with epic completion detection
- Previous story insights extraction (learning from history)
- Architecture context extraction (story-type-aware selective reading)
- Project structure alignment verification
- Story template population with full technical context
- Story draft validation via embedded checklist

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - project_root: 'absolute/path/to/project'  # Working directory with .bmad-core/
  - core_config: '.bmad-core/core-config.yaml'  # MUST exist before task execution

optional:
  - story_override: '{epicNum}.{storyNum}'  # Skip identification, create specific story
  - mode: 'interactive' | 'yolo'  # Elicitation style (default: interactive)
```

### Input Sources
- **project_root**: Current working directory when task is invoked
- **core_config**: Loaded from `.bmad-core/core-config.yaml` (HALT if missing)
- **story_override**: User-provided parameter (rare, typically auto-identified)
- **mode**: User preference or default from agent configuration

### Configuration Dependencies

The task requires these `core-config.yaml` fields:

```yaml
devStoryLocation: 'docs/stories'  # Where story files are created
prd:
  prdSharded: true/false
  prdShardedLocation: 'docs/prd'
  epicFilePattern: 'epic-{n}*.md'
architecture:
  architectureVersion: 'v4'
  architectureSharded: true/false
  architectureShardedLocation: 'docs/architecture'
devLoadAlwaysFiles:  # Files developers always load
  - 'docs/architecture/coding-standards.md'
  - 'docs/architecture/tech-stack.md'
  - 'docs/architecture/source-tree.md'
```

**HALT Condition**: If `core-config.yaml` does not exist, the task immediately stops with error:
```
"core-config.yaml not found. This file is required for story creation.
You can either:
1) Copy it from GITHUB bmad-core/core-config.yaml and configure it for your project OR
2) Run the BMad installer against your project to upgrade and add the file automatically.
Please add and configure core-config.yaml before proceeding."
```

### Document Dependencies

The task reads multiple document types during execution:

**Epic Files** (Step 1, 2):
- Location: `{prdShardedLocation}/{epicFilePattern}` (e.g., `docs/prd/epic-1-*.md`)
- Purpose: Extract story title, description, acceptance criteria

**Previous Story File** (Step 2):
- Location: `{devStoryLocation}/{prevEpic}.{prevStory}.*.md`
- Purpose: Extract Dev Agent Record insights (completion notes, challenges, lessons learned)

**Architecture Files** (Step 3):
- Location: `{architectureShardedLocation}/` (if v4+)
- Files read depend on story type (detailed in Section 3, Step 3)

**Project Structure Guide** (Step 4):
- Location: `docs/architecture/unified-project-structure.md` (or `source-tree.md`)
- Purpose: Verify file path alignment

**Story Template** (Step 5):
- Location: `.bmad-core/templates/story-tmpl.yaml`
- Purpose: Define story document structure

**Story Draft Checklist** (Step 6):
- Location: `.bmad-core/checklists/story-draft-checklist.md`
- Purpose: Validate story completeness

---

## 3. Execution Flow

The `create-next-story` task follows a **strict sequential workflow**. Each step MUST complete before proceeding to the next.

### Step 0: Load Core Configuration and Check Workflow

**Purpose**: Ensure project is properly configured before story creation begins.

**Actions**:
1. **Load configuration file**: Read `.bmad-core/core-config.yaml` from project root
2. **Validate existence**: If file missing, HALT with detailed error (see Section 2)
3. **Extract key configurations**:
   - `devStoryLocation` - Story file output location
   - `prd.*` - PRD version, sharding status, location, epic file pattern
   - `architecture.*` - Architecture version, sharding status, location
   - `workflow.*` - Workflow configurations (if present)
   - `devLoadAlwaysFiles` - Files developers always load

**Configuration Validation**:
- Verify required fields exist
- Validate paths are relative to project root
- Check sharding configuration consistency (if `prdSharded: true`, `prdShardedLocation` must exist)

**Output**: Loaded configuration object available to all subsequent steps

**Blocking Condition**: Missing `core-config.yaml` stops execution immediately

---

### Step 1: Identify Next Story for Preparation

**Purpose**: Determine which story to create next based on epic sequence and story completion status.

#### 1.1 Locate Epic Files and Review Existing Stories

**Epic File Location Strategy**:

```python
if core_config['prd']['prdSharded'] == True:
    epic_location = core_config['prd']['prdShardedLocation']
    epic_pattern = core_config['prd']['epicFilePattern']  # e.g., "epic-{n}*.md"
    epic_files = glob(f"{epic_location}/{epic_pattern}")
else:
    # Monolithic PRD - extract epic sections from single file
    prd_file = core_config['prd']['prdFile']
    epic_sections = parse_epic_sections(prd_file)
```

**Existing Story Discovery**:

```python
story_location = core_config['devStoryLocation']
story_files = glob(f"{story_location}/*.story.md")
# Sort by epic.story number to find highest
story_files.sort(key=lambda f: parse_epic_story_num(f))
highest_story = story_files[-1] if story_files else None
```

**Story File Naming Convention**: `{epicNum}.{storyNum}.story.md` or `{epicNum}.{storyNum}.{slug}.story.md`

Examples:
- `1.1.story.md` - First story of first epic
- `1.2.user-authentication.story.md` - Second story of first epic
- `2.1.dashboard-ui.story.md` - First story of second epic

#### 1.2 Next Story Determination Logic

**Decision Tree**:

```
IF highest_story EXISTS:
    story_status = extract_status_from_story_file(highest_story)

    IF story_status != 'Done':
        ALERT USER:
            "ALERT: Found incomplete story!
             File: {epicNum}.{storyNum}.story.md
             Status: {story_status}
             You should fix this story first, but would you like to accept
             risk & override to create the next story in draft?"

        IF user_approves_override:
            PROCEED
        ELSE:
            HALT
    END IF

    # Story is Done, determine next
    current_epic = epicNum
    current_story = storyNum

    # Check if more stories in current epic
    epic_file = load_epic_file(current_epic)
    total_stories_in_epic = count_stories(epic_file)

    IF current_story < total_stories_in_epic:
        # More stories in current epic
        next_story = (current_epic, current_story + 1)
    ELSE:
        # Epic complete
        PROMPT USER:
            "Epic {current_epic} Complete: All stories in Epic {current_epic}
             have been completed. Would you like to:
             1) Begin Epic {current_epic + 1} with story 1
             2) Select a specific story to work on
             3) Cancel story creation"

        # CRITICAL: NEVER automatically skip to another epic
        # User MUST explicitly instruct which story to create

        user_choice = get_user_input()

        IF user_choice == 1:
            next_story = (current_epic + 1, 1)
        ELSE IF user_choice == 2:
            next_story = get_user_specified_story()
        ELSE:
            HALT
    END IF

ELSE:
    # No story files exist - start at beginning
    next_story = (1, 1)
END IF

ANNOUNCE: "Identified next story for preparation: {epicNum}.{storyNum} - {Story Title}"
```

**Key Behaviors**:

1. **Epic Completion Detection**: When all stories in an epic are done, the task STOPS and prompts user
2. **Incomplete Story Handling**: Never silently skip incomplete stories - always alert user
3. **User Control**: Critical sequencing decisions require explicit user approval
4. **No Auto-Advance**: Task will NEVER automatically jump to next epic without user instruction

**Epic Completion Example**:
```
User has completed stories 1.1, 1.2, 1.3 (all marked 'Done')
Epic 1 has only 3 stories defined
Task detects completion and prompts:

"Epic 1 Complete: All stories in Epic 1 have been completed. Would you like to:
 1) Begin Epic 2 with story 1
 2) Select a specific story to work on
 3) Cancel story creation"

User must choose option 1, 2, or 3 explicitly.
```

**Incomplete Story Example**:
```
User has completed story 1.1 (status: Done)
User invokes *draft command
Task finds highest story: 1.2 (status: InProgress)
Task alerts:

"ALERT: Found incomplete story!
 File: 1.2.story.md
 Status: InProgress
 You should fix this story first, but would you like to accept risk & override
 to create the next story in draft?"

User must approve override to continue.
```

---

### Step 2: Gather Story Requirements and Previous Story Context

**Purpose**: Extract story requirements from epic file and learn from previous story implementation.

#### 2.1 Extract Story Requirements from Epic

**Epic File Structure** (Sharded PRD v4):
```markdown
# Epic 1: User Authentication

## Overview
[Epic description]

## Stories

### Story 1.1: Login Page
**As a** user
**I want** to log in with email and password
**so that** I can access my account

**Acceptance Criteria**:
1. Login form displays email and password fields
2. Submit button validates credentials
3. Successful login redirects to dashboard
4. Failed login shows error message

### Story 1.2: Password Reset
...
```

**Extraction Process**:
1. **Locate epic file**: Load `{prdShardedLocation}/epic-{epicNum}*.md`
2. **Find story section**: Search for `### Story {epicNum}.{storyNum}` heading
3. **Extract components**:
   - **Story Title**: Text after `Story {epicNum}.{storyNum}:`
   - **Story Statement**: User story format (`As a...I want...so that...`)
   - **Acceptance Criteria**: Numbered list following `**Acceptance Criteria**:`
   - **Story-specific Notes**: Any additional notes or requirements

**Parsed Structure**:
```yaml
story:
  epic: 1
  number: 1
  title: "Login Page"
  statement:
    role: "user"
    action: "log in with email and password"
    benefit: "I can access my account"
  acceptance_criteria:
    - "Login form displays email and password fields"
    - "Submit button validates credentials"
    - "Successful login redirects to dashboard"
    - "Failed login shows error message"
  notes: []  # Additional epic-specific notes if present
```

#### 2.2 Review Previous Story Context (if exists)

**Purpose**: Extract lessons learned and implementation patterns from previous story to inform current story preparation.

**Previous Story Identification**:
```python
if story_num > 1:
    # Previous story in same epic
    prev_story = (epic_num, story_num - 1)
elif epic_num > 1:
    # Last story of previous epic
    prev_epic_file = load_epic_file(epic_num - 1)
    prev_epic_story_count = count_stories(prev_epic_file)
    prev_story = (epic_num - 1, prev_epic_story_count)
else:
    # First story overall - no previous story
    prev_story = None
```

**Dev Agent Record Analysis**:

If previous story exists, examine the `Dev Agent Record` section:

```markdown
## Dev Agent Record

### Agent Model Used
claude-3-5-sonnet-20241022

### Debug Log References
- .ai/debug-log.md#login-form-validation-issue

### Completion Notes List
- Implemented email validation using regex pattern
- Used bcrypt for password hashing (10 rounds)
- Added rate limiting to prevent brute force attacks (5 attempts per 15 min)
- Discovered existing auth library supports OAuth - noted for future stories

### File List
- src/components/LoginForm.tsx (created)
- src/api/auth.ts (created)
- src/utils/validation.ts (modified - added email validator)
- tests/components/LoginForm.test.tsx (created)
```

**Extract Relevant Insights**:

From Completion Notes, identify:
1. **Implementation Decisions**: Technical choices made (e.g., "Used bcrypt for password hashing")
2. **Discovered Capabilities**: Existing code/libraries found during implementation (e.g., "auth library supports OAuth")
3. **Challenges Encountered**: Problems solved (e.g., "rate limiting to prevent brute force")
4. **Lessons Learned**: Insights for future work (e.g., "noted for future stories")

**Pattern Recognition**:
- Security patterns (hashing, validation, rate limiting)
- Library usage patterns (bcrypt, OAuth discovery)
- File organization patterns (component/api/utils structure)
- Testing patterns (test file co-location)

**Carry-Forward Information**:

These insights inform the current story's `Dev Notes` section with:
- **Previous Story Insights**: "Previous story (1.1) implemented rate limiting for login (5 attempts/15min) and discovered existing OAuth support in auth library for future use."

This ensures continuity and prevents developers from rediscovering information or making inconsistent technical choices.

---

### Step 3: Gather Architecture Context

**Purpose**: Extract story-specific technical details from architecture documents using a **story-type-aware selective reading strategy**.

This is the most complex step in the workflow, implementing intelligent architecture document reading based on story classification.

#### 3.1 Determine Architecture Reading Strategy

**Version Detection**:
```python
arch_version = core_config['architecture']['architectureVersion']
arch_sharded = core_config['architecture']['architectureSharded']

if arch_version >= 'v4' and arch_sharded == True:
    # Modern sharded architecture - structured reading
    strategy = 'sharded_structured'
    arch_base = core_config['architecture']['architectureShardedLocation']
    index_file = f"{arch_base}/index.md"
else:
    # Monolithic architecture file
    strategy = 'monolithic_sections'
    arch_file = core_config['architecture']['architectureFile']
```

**Sharded Architecture Structure** (v4+):
```
docs/architecture/
├── index.md                          # Architecture overview and index
├── tech-stack.md                     # Technology choices
├── unified-project-structure.md      # File organization and naming
├── coding-standards.md               # Code style and conventions
├── testing-strategy.md               # Test approach and requirements
├── data-models.md                    # Data structures and validation
├── database-schema.md                # Database design (backend)
├── backend-architecture.md           # Backend patterns and structure
├── rest-api-spec.md                  # API endpoint specifications
├── external-apis.md                  # Third-party integrations
├── frontend-architecture.md          # Frontend patterns and structure
├── components.md                     # UI component specifications
├── core-workflows.md                 # User flows and navigation
└── ...                               # Additional architecture docs
```

#### 3.2 Classify Story Type for Targeted Reading

**Story Type Classification**:

The task analyzes the story to determine which technical domains it touches:

```python
def classify_story_type(story, epic):
    """
    Classify story into: backend, frontend, fullstack
    Based on keywords in title, description, and acceptance criteria
    """
    story_text = f"{story.title} {story.statement} {' '.join(story.acceptance_criteria)}"

    backend_keywords = ['api', 'endpoint', 'database', 'schema', 'model',
                        'service', 'auth', 'authentication', 'authorization',
                        'query', 'migration', 'backend', 'server']

    frontend_keywords = ['ui', 'component', 'page', 'form', 'button',
                         'display', 'render', 'view', 'frontend', 'client',
                         'navigation', 'route', 'style', 'layout']

    backend_score = count_keywords(story_text, backend_keywords)
    frontend_score = count_keywords(story_text, frontend_keywords)

    if backend_score > 0 and frontend_score > 0:
        return 'fullstack'
    elif backend_score > frontend_score:
        return 'backend'
    elif frontend_score > backend_score:
        return 'frontend'
    else:
        # Ambiguous - check epic context or default to fullstack
        return classify_by_epic_context(epic) or 'fullstack'
```

**Classification Examples**:

| Story Title | Classification | Reason |
|-------------|----------------|--------|
| "Login API Endpoint" | backend | Contains 'api', 'endpoint' |
| "Login Form UI" | frontend | Contains 'form', 'ui' |
| "User Authentication" | fullstack | Implies both API and UI |
| "Database Migration" | backend | Contains 'database', 'migration' |
| "Dashboard Components" | frontend | Contains 'dashboard', 'components' |

#### 3.3 Read Architecture Documents Based on Story Type

**Universal Documents** (read for ALL story types):
```python
universal_docs = [
    'tech-stack.md',                    # Technology choices and versions
    'unified-project-structure.md',     # File paths and naming conventions
    'coding-standards.md',              # Code style requirements
    'testing-strategy.md'               # Testing approach and tools
]

for doc in universal_docs:
    content = read_file(f"{arch_base}/{doc}")
    extract_relevant_sections(content, story)
```

**Backend/API Story Documents**:
```python
if story_type in ['backend', 'fullstack']:
    backend_docs = [
        'data-models.md',           # Data structures, types, validation rules
        'database-schema.md',       # Tables, columns, relationships, indexes
        'backend-architecture.md',  # Patterns, layers, error handling
        'rest-api-spec.md',         # Endpoint specs, request/response formats
        'external-apis.md'          # Third-party API integration patterns
    ]

    for doc in backend_docs:
        content = read_file(f"{arch_base}/{doc}")
        extract_relevant_sections(content, story)
```

**Frontend/UI Story Documents**:
```python
if story_type in ['frontend', 'fullstack']:
    frontend_docs = [
        'frontend-architecture.md',  # State management, routing, patterns
        'components.md',             # Component specs, props, composition
        'core-workflows.md',         # User flows, navigation paths
        'data-models.md'             # Client-side data structures
    ]

    for doc in frontend_docs:
        content = read_file(f"{arch_base}/{doc}")
        extract_relevant_sections(content, story)
```

**Document Reading Matrix**:

| Story Type | Universal | Backend Docs | Frontend Docs | Total Docs |
|------------|-----------|--------------|---------------|------------|
| Backend    | 4         | 5            | 0             | 9          |
| Frontend   | 4         | 0            | 4             | 8          |
| Fullstack  | 4         | 5            | 4             | 13         |

**Why This Matters**:
- **Efficiency**: Read only relevant documents (not all 15+ architecture files)
- **Context Precision**: Extract only story-specific technical details
- **Token Optimization**: Minimize LLM context window usage
- **Maintenance**: Architecture changes in irrelevant files don't affect story

#### 3.4 Extract Story-Specific Technical Details

**Extraction Principle**: Extract ONLY information **directly relevant** to implementing the current story.

**Critical Rule**: **DO NOT invent** new libraries, patterns, or standards not in the source documents.

**Extraction Categories**:

**1. Data Models and Schemas**:
```markdown
From data-models.md:
Extract models/types used in story

Example (Login Page story):
```typescript
interface LoginCredentials {
  email: string;        // Valid email format
  password: string;     // Min 8 chars
}

interface LoginResponse {
  token: string;
  user: UserProfile;
  expiresAt: number;
}
```
[Source: architecture/data-models.md#authentication-models]
```

**2. API Endpoints**:
```markdown
From rest-api-spec.md:
Extract endpoints story will implement or consume

Example:
POST /api/auth/login
Request Body: LoginCredentials
Response: LoginResponse (200) | ErrorResponse (401, 400)
Auth: None (public endpoint)
Rate Limit: 5 requests per 15 minutes per IP
[Source: architecture/rest-api-spec.md#authentication-endpoints]
```

**3. Component Specifications**:
```markdown
From components.md:
Extract UI components story will create or use

Example:
<LoginForm>
  Props:
    - onSubmit: (credentials: LoginCredentials) => Promise<void>
    - loading: boolean
    - error?: string
  State: email, password, isSubmitting
  Validation: Email format, password min length
  Styling: Uses theme.components.form styling
[Source: architecture/components.md#form-components]
```

**4. File Paths and Naming Conventions**:
```markdown
From unified-project-structure.md:
Extract file locations for new code

Example:
Components: src/components/{ComponentName}.tsx
API Handlers: src/api/{domain}/{action}.ts
Tests: tests/{mirror-source-path}/{filename}.test.ts
[Source: architecture/unified-project-structure.md#file-organization]
```

**5. Testing Requirements**:
```markdown
From testing-strategy.md:
Extract test approach for story features

Example:
- Unit tests: All validation functions, error handling
- Integration tests: API endpoint with database
- E2E tests: Full login flow (form submit to redirect)
- Coverage: Minimum 80% for new code
- Framework: Vitest for unit, Playwright for E2E
[Source: architecture/testing-strategy.md#authentication-testing]
```

**6. Technical Constraints**:
```markdown
From multiple sources:
Extract version requirements, performance targets, security rules

Example:
- Node version: 18+ [Source: tech-stack.md#runtime]
- Password hashing: bcrypt, 10 rounds [Source: backend-architecture.md#security]
- API response time: <200ms p95 [Source: backend-architecture.md#performance]
- Input sanitization: All user inputs [Source: coding-standards.md#security]
```

#### 3.5 Source Citation Discipline

**CRITICAL**: Every technical detail MUST include its source reference.

**Citation Format**:
```
[Source: architecture/{filename}.md#{section}]
```

**Examples**:
- `[Source: architecture/data-models.md#authentication-models]`
- `[Source: architecture/rest-api-spec.md#authentication-endpoints]`
- `[Source: architecture/coding-standards.md#error-handling]`

**Unknown Information Handling**:

If information for a category is not found in architecture docs:

```markdown
**API Rate Limiting**: No specific guidance found in architecture docs
```

This explicit acknowledgment ensures:
1. Transparency about information availability
2. Developer knows to ask user or use best judgment
3. No invented requirements masquerading as documented standards

**Example Dev Notes Section with Citations**:

```markdown
## Dev Notes

### Previous Story Insights
Previous story (1.1) implemented rate limiting for login (5 attempts/15min)
and discovered existing OAuth support in auth library for future use.

### Data Models
```typescript
interface LoginCredentials {
  email: string;        // Valid email format
  password: string;     // Min 8 chars
}
```
[Source: architecture/data-models.md#authentication-models]

### API Specifications
POST /api/auth/login
Request: LoginCredentials
Response: LoginResponse (200) | ErrorResponse (401, 400)
Rate Limit: 5 requests per 15 minutes per IP
[Source: architecture/rest-api-spec.md#authentication-endpoints]

### Component Specifications
<LoginForm> with props: onSubmit, loading, error
Validation: Email format, password min length
[Source: architecture/components.md#form-components]

### File Locations
- Component: src/components/LoginForm.tsx
- API Handler: src/api/auth/login.ts
- Tests: tests/components/LoginForm.test.tsx
[Source: architecture/unified-project-structure.md#file-organization]

### Testing Requirements
- Unit: Validation functions, error handling
- Integration: API endpoint with database
- E2E: Full login flow (form to redirect)
- Framework: Vitest (unit), Playwright (E2E)
[Source: architecture/testing-strategy.md#authentication-testing]

### Technical Constraints
- Password hashing: bcrypt, 10 rounds
- API response time: <200ms p95
- Input sanitization required for all user inputs
[Source: backend-architecture.md#security, #performance]
```

---

### Step 4: Verify Project Structure Alignment

**Purpose**: Ensure story requirements align with defined project structure and identify any conflicts.

**Actions**:

1. **Load Project Structure Guide**:
   ```python
   structure_doc = read_file('docs/architecture/unified-project-structure.md')
   # or 'source-tree.md' in older versions
   ```

2. **Cross-Reference Requirements**:
   ```python
   # From Step 3, we extracted file locations
   extracted_paths = [
       'src/components/LoginForm.tsx',
       'src/api/auth/login.ts',
       'tests/components/LoginForm.test.tsx'
   ]

   # Verify each path against structure guide
   for path in extracted_paths:
       verify_path_compliance(path, structure_doc)
   ```

3. **Check for Structural Conflicts**:

   **Conflict Example 1** - File Location Mismatch:
   ```
   Epic says: "Create login component"
   Architecture says: Components → src/components/{Name}.tsx
   Structure guide says: Components → app/components/{Name}.tsx

   CONFLICT: Mismatch between architecture and structure guide
   ```

   **Conflict Example 2** - Naming Convention Mismatch:
   ```
   Epic says: "Story 1.3: user-profile"
   Architecture says: Component names use PascalCase
   Structure guide says: File names use kebab-case

   ALIGNMENT: UserProfile.tsx (component name) → user-profile.tsx (file name)
   ```

4. **Document Structural Notes**:

   Add findings to "Project Structure Notes" section in story:

   ```markdown
   ## Project Structure Notes

   **File Locations Verified**:
   - ✓ Components: src/components/ (matches structure guide)
   - ✓ API handlers: src/api/ (matches structure guide)
   - ✓ Tests: tests/ (matches structure guide)

   **Naming Conventions**:
   - Component: LoginForm (PascalCase)
   - File: login-form.tsx (kebab-case)
   - Test: login-form.test.tsx

   **Structural Conflicts**: None identified
   ```

   Or if conflicts exist:

   ```markdown
   ## Project Structure Notes

   **⚠️ CONFLICT IDENTIFIED**:
   Architecture document specifies component location as `src/components/`
   but project structure guide shows `app/components/`.

   **RECOMMENDATION**: Use `app/components/` per structure guide (newer).
   Note: Architecture document may need updating.

   **Developer Guidance**: Follow structure guide for file placement.
   ```

**Why This Step Matters**:
- Prevents implementation errors due to path mismatches
- Identifies documentation inconsistencies early
- Provides clear guidance to developer when conflicts exist
- Maintains project organizational consistency

---

### Step 5: Populate Story Template with Full Context

**Purpose**: Generate complete story document using story template and all gathered context.

#### 5.1 Load Story Template

```python
template = load_yaml('.bmad-core/templates/story-tmpl.yaml')
```

**Template Structure** (story-tmpl.yaml v2.0):

```yaml
template:
  id: story-template-v2
  version: 2.0
  output:
    format: markdown
    filename: docs/stories/{{epic_num}}.{{story_num}}.{{story_title_short}}.md

sections:
  - id: status
    title: Status
    type: choice
    choices: [Draft, Approved, InProgress, Review, Done]
    owner: scrum-master

  - id: story
    title: Story
    type: template-text
    template: |
      **As a** {{role}},
      **I want** {{action}},
      **so that** {{benefit}}
    owner: scrum-master

  - id: acceptance-criteria
    title: Acceptance Criteria
    type: numbered-list
    owner: scrum-master

  - id: tasks-subtasks
    title: Tasks / Subtasks
    type: bullet-list
    owner: scrum-master
    editors: [scrum-master, dev-agent]

  - id: dev-notes
    title: Dev Notes
    owner: scrum-master
    sections:
      - id: testing-standards
        title: Testing

  - id: change-log
    title: Change Log
    type: table
    columns: [Date, Version, Description, Author]

  - id: dev-agent-record
    title: Dev Agent Record
    owner: dev-agent
    editors: [dev-agent]

  - id: qa-results
    title: QA Results
    owner: qa-agent
    editors: [qa-agent]
```

#### 5.2 Create Story File

**File Path Generation**:
```python
epic_num = 1
story_num = 1
story_title = "Login Page"
story_slug = generate_slug(story_title)  # "login-page"

filename = f"{core_config['devStoryLocation']}/{epic_num}.{story_num}.{story_slug}.story.md"
# Result: "docs/stories/1.1.login-page.story.md"
```

#### 5.3 Populate Basic Story Information

**Section 1: Status**
```markdown
## Status
**Draft**
```
Initial status is always `Draft` for new stories.

**Section 2: Story Statement**
```markdown
## Story
**As a** user,
**I want** to log in with email and password,
**so that** I can access my account
```
Populated from epic file (Step 2.1).

**Section 3: Acceptance Criteria**
```markdown
## Acceptance Criteria
1. Login form displays email and password fields
2. Submit button validates credentials
3. Successful login redirects to dashboard
4. Failed login shows error message
```
Copied directly from epic file (Step 2.1).

#### 5.4 Populate Dev Notes Section (CRITICAL)

**This is the MOST IMPORTANT section** - contains all technical context for developer.

**Design Principle**: "Provide sufficient context so developers NEVER need to read architecture documents"

**Critical Rules**:
1. ✅ **ONLY include information extracted from architecture documents**
2. ❌ **NEVER invent or assume technical details**
3. ✅ **MUST cite source for every technical detail**
4. ✅ **Explicitly state when information is not found**

**Dev Notes Structure**:

```markdown
## Dev Notes

### Previous Story Insights
[Carry-forward insights from Step 2.2]

### Data Models
[Data structures from Step 3.4 with citations]

### API Specifications
[Endpoint details from Step 3.4 with citations]

### Component Specifications
[UI component specs from Step 3.4 with citations]

### File Locations
[Exact paths from Step 3.4 and Step 4 with citations]

### Testing Requirements
[Test strategies from Step 3.4 with citations]

### Technical Constraints
[Version requirements, performance targets, security rules from Step 3.4 with citations]

### Testing
[Testing standards from architecture/testing-strategy.md]
```

**Complete Example**:

```markdown
## Dev Notes

### Previous Story Insights
Previous story (1.1) implemented rate limiting for login (5 attempts/15min)
and discovered existing OAuth support in auth library for future use.

### Data Models
```typescript
interface LoginCredentials {
  email: string;        // Must match email regex pattern
  password: string;     // Minimum 8 characters
}

interface LoginResponse {
  token: string;        // JWT token
  user: UserProfile;    // User data
  expiresAt: number;    // Unix timestamp
}
```
[Source: architecture/data-models.md#authentication-models]

### API Specifications
**Endpoint**: POST /api/auth/login
**Request Body**: LoginCredentials
**Response**:
- 200: LoginResponse (successful login)
- 401: ErrorResponse (invalid credentials)
- 400: ErrorResponse (validation failure)
**Authentication**: None (public endpoint)
**Rate Limiting**: 5 requests per 15 minutes per IP address
**Notes**: Rate limiting prevents brute force attacks
[Source: architecture/rest-api-spec.md#authentication-endpoints]

### Component Specifications
**Component**: <LoginForm>
**Props**:
- onSubmit: (credentials: LoginCredentials) => Promise<void>
- loading: boolean
- error?: string
**State Management**: email, password, isSubmitting
**Validation**:
- Email: Must match regex pattern (validated client-side and server-side)
- Password: Minimum 8 characters
**Styling**: Uses theme.components.form styling system
**Error Display**: Show error message below form when error prop is set
[Source: architecture/components.md#form-components]

### File Locations
Based on project structure guide:
- **Component**: src/components/LoginForm.tsx
- **API Handler**: src/api/auth/login.ts
- **Types**: src/types/auth.ts (LoginCredentials, LoginResponse interfaces)
- **Unit Tests**: tests/components/LoginForm.test.tsx
- **Integration Tests**: tests/api/auth/login.test.ts
- **E2E Tests**: tests/e2e/auth/login.spec.ts
[Source: architecture/unified-project-structure.md#file-organization]

### Testing Requirements
**Unit Tests** (Vitest):
- Email validation function (valid/invalid formats)
- Password validation function (length requirements)
- Form submission handler (success/error cases)
- Error message display logic

**Integration Tests** (Vitest):
- API endpoint with database
- JWT token generation and validation
- Rate limiting enforcement
- Session creation

**E2E Tests** (Playwright):
- Full login flow: form render → input → submit → redirect
- Error handling: invalid credentials → error display
- Success path: valid credentials → dashboard redirect

**Coverage Target**: Minimum 80% for new code
**Test Data**: Use fixtures from tests/fixtures/auth.ts
[Source: architecture/testing-strategy.md#authentication-testing]

### Technical Constraints
- **Node Version**: 18+ required [Source: tech-stack.md#runtime]
- **Password Hashing**: bcrypt with 10 rounds [Source: backend-architecture.md#security]
- **API Response Time**: <200ms p95 target [Source: backend-architecture.md#performance]
- **Input Sanitization**: Required for all user inputs [Source: coding-standards.md#security]
- **Token Expiration**: JWT tokens expire after 24 hours [Source: backend-architecture.md#authentication]
- **HTTPS Only**: Auth endpoints must use HTTPS in production [Source: backend-architecture.md#security]

### Testing
**Framework**: Vitest for unit/integration, Playwright for E2E
**Test Location**: Mirror source path in tests/ directory
**Naming**: {filename}.test.ts or {filename}.spec.ts
**Coverage**: Run `npm run test:coverage` to verify 80% threshold
**CI Integration**: Tests run automatically on PR creation
[Source: architecture/testing-strategy.md#test-execution]
```

**What Makes This Good**:
1. ✅ **Complete Context**: Developer has everything needed
2. ✅ **Source Citations**: Every detail traceable to architecture
3. ✅ **Explicit Structure**: Clear categories for easy scanning
4. ✅ **No Invention**: No made-up requirements
5. ✅ **Actionable**: Specific file paths, validation rules, test types

#### 5.5 Generate Tasks / Subtasks Section

**Purpose**: Break down story into sequential implementation steps.

**Task Generation Principles**:
1. Tasks based ONLY on: Epic Requirements + Story AC + Architecture Information
2. Each task references relevant acceptance criteria (e.g., `AC: 1, 3`)
3. Include unit testing as explicit subtasks
4. Order tasks logically (dependencies first)
5. Link tasks to architecture documentation where relevant

**Example Tasks Generation**:

```markdown
## Tasks / Subtasks

- [ ] **Task 1: Set up data models and types** (AC: 1, 2)
  - [ ] Create `src/types/auth.ts` with LoginCredentials and LoginResponse interfaces
  - [ ] Add email validation regex pattern
  - [ ] Add password length validation (min 8 chars)
  - [ ] Write unit tests for type validation
  [Ref: Data Models section]

- [ ] **Task 2: Implement API endpoint** (AC: 2, 4)
  - [ ] Create `src/api/auth/login.ts` POST handler
  - [ ] Implement bcrypt password comparison (10 rounds)
  - [ ] Generate JWT token with 24-hour expiration
  - [ ] Add rate limiting (5 requests/15min per IP)
  - [ ] Return appropriate response codes (200, 401, 400)
  - [ ] Write integration tests for API endpoint
  - [ ] Write tests for rate limiting enforcement
  [Ref: API Specifications section]

- [ ] **Task 3: Create LoginForm component** (AC: 1, 3, 4)
  - [ ] Create `src/components/LoginForm.tsx`
  - [ ] Add email and password input fields
  - [ ] Implement client-side validation (email format, password length)
  - [ ] Add submit button with loading state
  - [ ] Implement onSubmit handler (call API)
  - [ ] Add error message display below form
  - [ ] Apply theme.components.form styling
  - [ ] Write unit tests for component
  [Ref: Component Specifications section]

- [ ] **Task 4: Implement success redirect** (AC: 3)
  - [ ] Add navigation logic after successful login
  - [ ] Redirect to /dashboard on 200 response
  - [ ] Store JWT token in secure storage
  - [ ] Update authentication context/state
  - [ ] Write E2E test for full login flow

- [ ] **Task 5: Add error handling** (AC: 4)
  - [ ] Display error message for 401 responses
  - [ ] Display validation errors for 400 responses
  - [ ] Clear error state on new submission
  - [ ] Write tests for error scenarios

- [ ] **Task 6: E2E testing** (AC: 1, 2, 3, 4)
  - [ ] Write Playwright test for successful login flow
  - [ ] Write Playwright test for invalid credentials
  - [ ] Write Playwright test for validation errors
  - [ ] Verify 80% test coverage target met
```

**Task Generation Algorithm**:

```python
def generate_tasks(story, dev_notes):
    tasks = []

    # Group related technical work
    if 'Data Models' in dev_notes:
        tasks.append(create_data_model_task(story.acceptance_criteria))

    if 'API Specifications' in dev_notes:
        tasks.append(create_api_task(story.acceptance_criteria))

    if 'Component Specifications' in dev_notes:
        tasks.append(create_component_task(story.acceptance_criteria))

    # Add integration tasks
    tasks.append(create_integration_task(story.acceptance_criteria))

    # Add error handling
    tasks.append(create_error_handling_task(story.acceptance_criteria))

    # Add E2E testing
    tasks.append(create_e2e_testing_task(story.acceptance_criteria))

    return tasks

def create_api_task(acceptance_criteria):
    # Map AC to API subtasks
    ac_refs = identify_api_related_ac(acceptance_criteria)

    task = {
        'title': 'Implement API endpoint',
        'ac_refs': ac_refs,
        'subtasks': [
            'Create API handler file',
            'Implement request validation',
            'Implement business logic',
            'Add error handling',
            'Write integration tests'
        ]
    }
    return task
```

**AC Mapping Example**:

```
Acceptance Criteria:
1. Login form displays email and password fields      → Task 3 (component)
2. Submit button validates credentials                 → Task 1 (types), Task 2 (API), Task 3 (form)
3. Successful login redirects to dashboard            → Task 4 (redirect)
4. Failed login shows error message                   → Task 5 (error handling)

Tasks reference ACs:
Task 1 (AC: 1, 2) - Data models used in form and API
Task 2 (AC: 2, 4) - API validates and returns error/success
Task 3 (AC: 1, 3, 4) - Form displays fields, submits, shows errors, redirects
Task 4 (AC: 3) - Redirect implementation
Task 5 (AC: 4) - Error handling
Task 6 (AC: 1, 2, 3, 4) - E2E tests validate all AC
```

#### 5.6 Add Project Structure Notes

```markdown
## Project Structure Notes
[Content from Step 4]
```

#### 5.7 Initialize Empty Sections

**Change Log**:
```markdown
## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2024-10-14 | 1.0 | Story created | SM Agent (Bob) |
```

**Dev Agent Record** (Empty - populated during implementation):
```markdown
## Dev Agent Record

### Agent Model Used
[To be populated by Dev agent]

### Debug Log References
[To be populated by Dev agent]

### Completion Notes List
[To be populated by Dev agent]

### File List
[To be populated by Dev agent]
```

**QA Results** (Empty - populated during review):
```markdown
## QA Results
[To be populated by QA agent during review]
```

#### 5.8 Save Story File

```python
output_path = f"{core_config['devStoryLocation']}/{epic_num}.{story_num}.{story_slug}.story.md"
write_file(output_path, story_content)
```

**Resulting File**: `docs/stories/1.1.login-page.story.md`

---

### Step 6: Story Draft Completion and Review

**Purpose**: Validate story completeness and provide summary to user.

#### 6.1 Internal Story Review

Before executing checklist, perform quick internal review:

1. **Completeness Check**:
   - ✓ Status set to "Draft"
   - ✓ Story statement present
   - ✓ All acceptance criteria copied from epic
   - ✓ Tasks/subtasks generated with AC references
   - ✓ Dev Notes populated with technical context
   - ✓ All technical details have source citations

2. **Source Citation Verification**:
   - Scan Dev Notes for `[Source: ...]` citations
   - Verify every technical detail has a citation
   - Check for invented information (missing citations)

3. **Task-AC Alignment**:
   - Verify tasks collectively address all acceptance criteria
   - Check AC reference numbers in tasks are correct

#### 6.2 Execute Story Draft Checklist

**Command**:
```python
execute_task('.bmad-core/tasks/execute-checklist',
             checklist='.bmad-core/checklists/story-draft-checklist')
```

**Checklist Categories** (from `story-draft-checklist.md`):

1. **Goal & Context Clarity**
   - Story goal/purpose is clearly stated
   - Relationship to epic goals is evident
   - How story fits into overall system flow is explained
   - Dependencies on previous stories are identified
   - Business context and value are clear

2. **Technical Implementation Guidance**
   - Key files to create/modify are identified
   - Technologies specifically needed for this story are mentioned
   - Critical APIs or interfaces are sufficiently described
   - Necessary data models or structures are referenced
   - Required environment variables are listed (if applicable)
   - Any exceptions to standard coding patterns are noted

3. **Reference Effectiveness**
   - References to external documents point to specific relevant sections
   - Critical information from previous stories is summarized
   - Context is provided for why references are relevant
   - References use consistent format

4. **Self-Containment Assessment**
   - Core information needed is included (not overly reliant on external docs)
   - Implicit assumptions are made explicit
   - Domain-specific terms or concepts are explained
   - Edge cases or error scenarios are addressed

5. **Testing Guidance**
   - Required testing approach is outlined
   - Key test scenarios are identified
   - Success criteria are defined
   - Special testing considerations are noted

**Checklist Execution Output**:

```markdown
## Validation Result

| Category                             | Status  | Issues |
| ------------------------------------ | ------- | ------ |
| 1. Goal & Context Clarity            | PASS    |        |
| 2. Technical Implementation Guidance | PASS    |        |
| 3. Reference Effectiveness           | PASS    |        |
| 4. Self-Containment Assessment       | PASS    |        |
| 5. Testing Guidance                  | PASS    |        |

**Final Assessment**: READY

**Clarity Score**: 9/10

**Developer Perspective**:
- Story is comprehensive and actionable
- All technical context is provided with source citations
- Tasks are well-organized and reference acceptance criteria
- Testing requirements are clear
- No blocking dependencies identified

**Recommendations**:
- Consider PO validation for complex stories before implementation
- Developer should review Dev Notes section thoroughly before starting
```

Or if issues found:

```markdown
## Validation Result

| Category                             | Status   | Issues |
| ------------------------------------ | -------- | ------ |
| 1. Goal & Context Clarity            | PASS     |        |
| 2. Technical Implementation Guidance | PARTIAL  | API authentication mechanism unclear |
| 3. Reference Effectiveness           | FAIL     | Reference to "existing auth library" not specific |
| 4. Self-Containment Assessment       | PARTIAL  | OAuth discovery mentioned but not explained |
| 5. Testing Guidance                  | PASS     |        |

**Final Assessment**: NEEDS REVISION

**Specific Issues**:
1. Dev Notes mentions "existing OAuth support" but doesn't specify which library or how to use it
2. API Specifications section lacks authentication header format
3. Reference to "bcrypt" without version specification

**Recommendations**:
1. Add OAuth library details with usage example
2. Specify authentication header format (e.g., `Bearer {token}`)
3. Update tech-stack.md citation to include bcrypt version
```

#### 6.3 Handle Checklist Results

**If Assessment = READY**:
- Proceed to summary generation (Step 6.4)

**If Assessment = NEEDS REVISION**:
1. Review specific issues identified
2. Update story to address issues
3. Re-run checklist
4. Repeat until READY

**If Assessment = BLOCKED**:
1. Identify blocking information
2. Alert user: "Story creation blocked - missing: [X]"
3. Provide guidance on obtaining blocking information
4. Halt story creation until blocking information available

#### 6.4 Generate Summary for User

**Summary Format**:

```markdown
## Story Creation Complete ✓

**Story Created**: docs/stories/1.1.login-page.story.md
**Status**: Draft
**Epic**: 1 - User Authentication
**Story**: 1.1 - Login Page

### Technical Components Included
- Data Models: LoginCredentials, LoginResponse interfaces
- API Endpoint: POST /api/auth/login with rate limiting
- UI Component: LoginForm with validation and error handling
- Testing: Unit, integration, and E2E test requirements

### Architecture Documents Referenced
- architecture/data-models.md (authentication models)
- architecture/rest-api-spec.md (authentication endpoints)
- architecture/components.md (form components)
- architecture/testing-strategy.md (authentication testing)
- architecture/unified-project-structure.md (file organization)

### Story Validation
✓ Goal & Context Clarity: PASS
✓ Technical Implementation Guidance: PASS
✓ Reference Effectiveness: PASS
✓ Self-Containment Assessment: PASS
✓ Testing Guidance: PASS

**Final Assessment**: READY for implementation

### Deviations and Conflicts
None identified. Story requirements align with architecture and project structure.

### Next Steps
1. **For Simple Stories**: Dev agent can proceed with implementation
2. **For Complex Stories**: Recommend PO validation first
   - Run: `.bmad-core/tasks/validate-next-story`
   - PO will review story for completeness and accuracy
3. **Developer Handoff**: Story contains complete context for implementation

---

**Recommendation**: This is a moderately complex story involving API, database, and UI work.
Consider having PO validate the story draft before assigning to Dev agent.

Would you like to:
1. Proceed with implementation (*dev agent activation)
2. Request PO validation (*po agent activation)
3. Review and edit story manually
```

#### 6.5 Story File Metadata Update

Final updates to story file:

```yaml
---
story_id: "1.1"
epic_id: "1"
title: "Login Page"
status: "Draft"
created_at: "2024-10-14T10:30:00Z"
created_by: "sm-agent"
version: "1.0"
complexity: "medium"
estimated_points: 5
tags: ["authentication", "api", "ui", "backend", "frontend"]
---
```

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Core Config Validation

**Trigger**: Step 0 - Load Core Configuration

**Decision Criteria**:
```python
if not file_exists('.bmad-core/core-config.yaml'):
    HALT with error message
    provide_remediation_options()
else:
    load_config()
    validate_required_fields()
    PROCEED
```

**Impact**: Without configuration file, task cannot proceed

---

### Decision Point 2: Epic Sequencing Control

**Trigger**: Step 1.1 - Identify Next Story

**Decision Tree**:
```
IF highest_story EXISTS:
    IF story.status != 'Done':
        PROMPT user: "Found incomplete story. Override?"
        IF user_approves:
            PROCEED with next story
        ELSE:
            HALT
        END IF
    ELSE:
        IF more_stories_in_epic:
            next_story = (epic, story + 1)
            PROCEED
        ELSE:
            PROMPT user: "Epic complete. Choose next action:"
            options = [
                "1) Begin next epic",
                "2) Select specific story",
                "3) Cancel"
            ]
            user_choice = GET_USER_INPUT()

            IF user_choice == 1:
                next_story = (epic + 1, 1)
                PROCEED
            ELSE IF user_choice == 2:
                next_story = GET_USER_SPECIFIED_STORY()
                PROCEED
            ELSE:
                HALT
            END IF
        END IF
    END IF
ELSE:
    next_story = (1, 1)  # First story
    PROCEED
END IF
```

**Rationale**:
- Prevents automatic epic skipping (user maintains control)
- Ensures no incomplete stories are skipped silently
- Supports non-linear story creation when needed

---

### Decision Point 3: Architecture Reading Strategy

**Trigger**: Step 3.1 - Determine Architecture Reading Strategy

**Decision Criteria**:
```python
arch_version = config['architecture']['architectureVersion']
arch_sharded = config['architecture']['architectureSharded']

if arch_version >= 'v4' and arch_sharded == True:
    strategy = 'sharded_structured'
    use_story_type_classification = True
elif arch_version >= 'v4':
    strategy = 'monolithic_structured'
    use_story_type_classification = True
else:
    strategy = 'monolithic_legacy'
    use_story_type_classification = False

return strategy
```

**Impact**: Determines which architecture documents to read and how

---

### Decision Point 4: Story Type Classification

**Trigger**: Step 3.2 - Classify Story Type

**Classification Logic**:
```python
def classify_story_type(story, epic):
    backend_score = count_backend_keywords(story)
    frontend_score = count_frontend_keywords(story)

    if backend_score > 0 and frontend_score > 0:
        return 'fullstack'
    elif backend_score > frontend_score:
        return 'backend'
    elif frontend_score > backend_score:
        return 'frontend'
    else:
        # Ambiguous - check epic context
        epic_type = infer_epic_type(epic)
        return epic_type if epic_type else 'fullstack'
```

**Decision Table**:

| Backend Score | Frontend Score | Classification |
|---------------|----------------|----------------|
| > 0           | > 0            | fullstack      |
| > 0           | 0              | backend        |
| 0             | > 0            | frontend       |
| 0             | 0              | (check epic) → fullstack |

**Impact**: Determines which architecture documents to read (9, 8, or 13 files)

---

### Decision Point 5: Missing Information Handling

**Trigger**: Step 3.4 - Extract Story-Specific Technical Details

**Decision Criteria**:
```python
for category in extraction_categories:
    relevant_info = search_architecture_docs(category, story)

    if relevant_info:
        add_to_dev_notes(relevant_info, with_citation=True)
    else:
        add_explicit_note(f"No specific guidance found in architecture docs for {category}")
```

**Example Outputs**:

**Information Found**:
```markdown
### API Rate Limiting
5 requests per 15 minutes per IP address
[Source: architecture/rest-api-spec.md#rate-limiting]
```

**Information Not Found**:
```markdown
### API Rate Limiting
No specific guidance found in architecture docs
```

**Rationale**:
- Transparency about information availability
- No invented requirements
- Developer knows to use judgment or ask user

---

### Decision Point 6: Checklist Validation Result

**Trigger**: Step 6.2 - Execute Story Draft Checklist

**Decision Tree**:
```
checklist_result = execute_checklist()

IF checklist_result.assessment == 'READY':
    PROCEED to summary generation
ELSE IF checklist_result.assessment == 'NEEDS_REVISION':
    issues = checklist_result.issues

    IF issues_are_fixable_by_agent:
        fix_issues(issues)
        re_run_checklist()
    ELSE:
        alert_user(issues)
        provide_recommendations()
        HALT for manual revision
    END IF
ELSE IF checklist_result.assessment == 'BLOCKED':
    blocking_info = checklist_result.blocking_dependencies
    alert_user(f"Story creation blocked - missing: {blocking_info}")
    provide_guidance_on_obtaining_info()
    HALT
END IF
```

**Assessment Criteria**:

| Assessment      | Condition | Action |
|----------------|-----------|--------|
| READY          | All categories PASS | Proceed to completion |
| NEEDS REVISION | Some categories PARTIAL/FAIL | Fix issues or alert user |
| BLOCKED        | Critical information missing | Halt until unblocked |

---

## 5. User Interaction Points

The task has multiple interactive decision points where user input is required.

### Interaction 1: Core Config Missing

**When**: Step 0 - Config file not found

**Prompt**:
```
core-config.yaml not found. This file is required for story creation.

You can either:
1) Copy it from GITHUB bmad-core/core-config.yaml and configure it for your project
2) Run the BMad installer against your project to upgrade and add the file automatically

Please add and configure core-config.yaml before proceeding.
```

**Expected User Action**:
- Copy and configure core-config.yaml OR
- Run BMad installer

**Task Behavior**: HALT until config file exists

---

### Interaction 2: Incomplete Story Found

**When**: Step 1.1 - Previous story not Done

**Prompt**:
```
ALERT: Found incomplete story!

File: docs/stories/1.2.user-registration.story.md
Status: InProgress

You should fix this story first, but would you like to accept risk & override to
create the next story in draft?

Options:
1) Fix incomplete story first (recommended)
2) Override and create next story anyway
```

**Expected User Action**: Choose 1 or 2

**Task Behavior**:
- Option 1: HALT, allow user to complete story 1.2
- Option 2: PROCEED with creating next story (risk accepted)

---

### Interaction 3: Epic Complete

**When**: Step 1.1 - All stories in current epic Done

**Prompt**:
```
Epic 1 Complete: All stories in Epic 1 have been completed.

Would you like to:
1) Begin Epic 2 with story 1
2) Select a specific story to work on
3) Cancel story creation
```

**Expected User Action**: Choose 1, 2, or 3

**Task Behavior**:
- Option 1: Create story (epic+1).1
- Option 2: Prompt for specific story number
- Option 3: HALT

**Critical Behavior**: Task NEVER auto-advances to next epic

---

### Interaction 4: Story Checklist Fails

**When**: Step 6.2 - Checklist returns NEEDS REVISION or BLOCKED

**Prompt**:
```
Story validation identified issues:

Assessment: NEEDS REVISION

Issues:
1. Technical Implementation Guidance: API authentication mechanism unclear
2. Reference Effectiveness: Reference to "existing auth library" not specific

Recommendations:
1. Add OAuth library details with usage example
2. Specify authentication header format (e.g., Bearer {token})

Would you like to:
1) Let agent attempt to fix issues automatically
2) Review and fix manually
3) Proceed anyway (not recommended)
```

**Expected User Action**: Choose 1, 2, or 3

**Task Behavior**:
- Option 1: Agent attempts fixes, re-runs checklist
- Option 2: HALT, open story file for manual editing
- Option 3: PROCEED with warnings

---

### Interaction 5: Complex Story Recommendation

**When**: Step 6.4 - Story creation complete with high complexity

**Prompt**:
```
Story Created: docs/stories/1.1.login-page.story.md
Status: Draft
Assessment: READY

This is a moderately complex story involving API, database, and UI work.
Recommendation: Have PO validate the story draft before assigning to Dev agent.

Would you like to:
1) Proceed with implementation (activate Dev agent)
2) Request PO validation first (activate PO agent)
3) Review and edit story manually
```

**Expected User Action**: Choose 1, 2, or 3

**Task Behavior**:
- Option 1: Handoff to Dev agent
- Option 2: Handoff to PO agent for validation
- Option 3: HALT, allow manual review

---

## 6. Output Specifications

### Output 1: Story File (Primary Output)

**File Path**: `{devStoryLocation}/{epicNum}.{storyNum}.{slug}.story.md`

**Example**: `docs/stories/1.1.login-page.story.md`

**Format**: Markdown with YAML frontmatter (optional)

**File Structure**:
```markdown
# Story 1.1: Login Page

## Status
Draft

## Story
**As a** user,
**I want** to log in with email and password,
**so that** I can access my account

## Acceptance Criteria
1. Login form displays email and password fields
2. Submit button validates credentials
3. Successful login redirects to dashboard
4. Failed login shows error message

## Tasks / Subtasks
- [ ] Task 1: Set up data models and types (AC: 1, 2)
  - [ ] Create src/types/auth.ts with interfaces
  - [ ] Add email validation regex
  - [ ] Write unit tests
- [ ] Task 2: Implement API endpoint (AC: 2, 4)
  ...

## Dev Notes

### Previous Story Insights
[Insights from previous story]

### Data Models
[Data structures with citations]

### API Specifications
[Endpoint details with citations]

### Component Specifications
[UI component specs with citations]

### File Locations
[File paths with citations]

### Testing Requirements
[Test approach with citations]

### Technical Constraints
[Constraints with citations]

### Testing
[Testing standards with citations]

## Project Structure Notes
[Structural alignment notes]

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2024-10-14 | 1.0 | Story created | SM Agent (Bob) |

## Dev Agent Record
[Empty - populated during implementation]

## QA Results
[Empty - populated during review]
```

**Section Ownership** (from story-tmpl.yaml):

| Section | Owner | Editors | Populated By |
|---------|-------|---------|--------------|
| Status | scrum-master | scrum-master, dev-agent | SM (Step 5) |
| Story | scrum-master | scrum-master | SM (Step 5) |
| Acceptance Criteria | scrum-master | scrum-master | SM (Step 5) |
| Tasks / Subtasks | scrum-master | scrum-master, dev-agent | SM (Step 5) |
| Dev Notes | scrum-master | scrum-master | SM (Step 5) |
| Change Log | scrum-master | scrum-master, dev-agent, qa-agent | SM (Step 6) |
| Dev Agent Record | dev-agent | dev-agent | Dev (during implementation) |
| QA Results | qa-agent | qa-agent | QA (during review) |

**Key Properties**:
- **Self-contained**: Story includes all context needed for implementation
- **Traceable**: All technical details cite source documents
- **Actionable**: Tasks are clear and sequential
- **Testable**: Testing requirements are explicit
- **Maintainable**: Change log tracks modifications

---

### Output 2: Console Summary

**Format**: Formatted text output to console/chat

**Content**:
```
## Story Creation Complete ✓

Story Created: docs/stories/1.1.login-page.story.md
Status: Draft
Epic: 1 - User Authentication
Story: 1.1 - Login Page

Technical Components Included:
- Data Models: LoginCredentials, LoginResponse interfaces
- API Endpoint: POST /api/auth/login with rate limiting
- UI Component: LoginForm with validation and error handling
- Testing: Unit, integration, and E2E test requirements

Architecture Documents Referenced:
- architecture/data-models.md (authentication models)
- architecture/rest-api-spec.md (authentication endpoints)
- architecture/components.md (form components)
- architecture/testing-strategy.md (authentication testing)
- architecture/unified-project-structure.md (file organization)

Story Validation:
✓ Goal & Context Clarity: PASS
✓ Technical Implementation Guidance: PASS
✓ Reference Effectiveness: PASS
✓ Self-Containment Assessment: PASS
✓ Testing Guidance: PASS

Final Assessment: READY for implementation

Deviations and Conflicts: None identified

Next Steps:
1. For simple stories: Dev agent can proceed
2. For complex stories: Recommend PO validation first

Recommendation: Consider PO validation before implementation
```

---

### Output 3: Checklist Validation Report (Embedded in Step 6)

**Format**: Markdown table + narrative

**Content**:
```markdown
## Validation Result

| Category                             | Status | Issues |
| ------------------------------------ | ------ | ------ |
| 1. Goal & Context Clarity            | PASS   |        |
| 2. Technical Implementation Guidance | PASS   |        |
| 3. Reference Effectiveness           | PASS   |        |
| 4. Self-Containment Assessment       | PASS   |        |
| 5. Testing Guidance                  | PASS   |        |

Final Assessment: READY
Clarity Score: 9/10

Developer Perspective:
- Story is comprehensive and actionable
- All technical context is provided with source citations
- Tasks are well-organized and reference acceptance criteria
- Testing requirements are clear
- No blocking dependencies identified
```

**Stored**: Inline in story file or separate validation artifact

---

## 7. Error Handling & Validation

### Error 1: Missing Core Configuration

**Error Type**: Configuration Error

**When**: Step 0 - Core config file not found

**Error Message**:
```
ERROR: core-config.yaml not found

This file is required for story creation.

Remediation Options:
1) Copy template from: github.com/bmad-framework/bmad-core/core-config.yaml
2) Run BMad installer: bmad install --upgrade

Task Status: HALTED
```

**Recovery**: User must create/configure core-config.yaml, then retry task

---

### Error 2: Invalid Configuration Values

**Error Type**: Configuration Validation Error

**When**: Step 0 - Config loaded but fields invalid

**Example Errors**:
```
ERROR: Invalid configuration in core-config.yaml

Issues found:
- devStoryLocation: Path 'docs/stories' does not exist
- prdShardedLocation: Required when prdSharded=true, but missing
- architectureVersion: 'v3' is not supported (requires v4+)

Remediation: Fix configuration values and retry task
```

**Validation Rules**:
- `devStoryLocation`: Must be valid directory path
- If `prdSharded=true`: `prdShardedLocation` required
- If `architectureSharded=true`: `architectureShardedLocation` required
- `architectureVersion`: Must be 'v4' or higher for sharded reading

---

### Error 3: Epic File Not Found

**Error Type**: Document Not Found Error

**When**: Step 1.1 - Cannot locate epic file

**Error Message**:
```
ERROR: Epic file not found

Attempted to locate: docs/prd/epic-1*.md
Pattern: {prdShardedLocation}/{epicFilePattern}

Possible causes:
1) Epic file naming doesn't match pattern
2) prdShardedLocation is incorrect in core-config.yaml
3) Epic hasn't been created yet

Remediation:
1) Verify epic file exists and matches pattern
2) Check core-config.yaml paths
3) Run PM agent to create epic first
```

---

### Error 4: Architecture Document Not Found

**Error Type**: Document Not Found Error

**When**: Step 3.3 - Expected architecture doc missing

**Error Message**:
```
WARNING: Architecture document not found

Expected: docs/architecture/rest-api-spec.md
Referenced by story type: backend

Impact: Story will be missing API specification context

Remediation:
1) Create missing architecture document
2) Update architectureShardedLocation in core-config.yaml
3) Proceed with partial context (add note to Dev Notes)

Action: Continue with warning? (y/n)
```

**Handling**:
- Add to Dev Notes: "No API specification found in architecture docs"
- Continue story creation
- Alert user to missing documentation

---

### Error 5: Story Template Not Found

**Error Type**: Template Error

**When**: Step 5.1 - Story template missing

**Error Message**:
```
ERROR: Story template not found

Expected: .bmad-core/templates/story-tmpl.yaml

This template is required to generate story structure.

Remediation: Reinstall BMad core files or restore template

Task Status: HALTED
```

**Recovery**: User must restore template, then retry task

---

### Error 6: Previous Story Status Ambiguous

**Error Type**: Story State Error

**When**: Step 1.1 - Previous story status unclear

**Example**:
```
WARNING: Previous story status unclear

File: docs/stories/1.2.story.md
Status Field: [missing or invalid]

Expected Status: Draft | Approved | InProgress | Review | Done
Found: [empty or "In Progress" with space]

Recommendation: Fix story status before proceeding

Continue anyway? (y/n)
```

**Handling**:
- Prompt user to fix status OR
- Assume status is not 'Done' and trigger incomplete story flow

---

### Validation 1: Story Title and AC Extraction

**Validation**: Step 2.1 - Verify epic parsing succeeded

**Checks**:
```python
if not story_title:
    raise ValueError("Could not extract story title from epic file")

if not acceptance_criteria or len(acceptance_criteria) == 0:
    raise ValueError("Could not extract acceptance criteria from epic file")

if len(acceptance_criteria) > 10:
    warn("Story has many ACs (>10). Consider splitting into multiple stories.")
```

---

### Validation 2: Source Citation Verification

**Validation**: Step 5.4 - Verify all technical details cited

**Check**:
```python
dev_notes_sections = extract_dev_notes_sections(story)

for section in dev_notes_sections:
    if contains_technical_details(section):
        if not contains_source_citation(section):
            raise ValidationError(f"Section '{section.title}' missing source citation")
```

**Error Example**:
```
ERROR: Missing source citation in Dev Notes

Section: API Specifications
Content: "POST /api/auth/login endpoint..."
Issue: Technical detail without [Source: ...] citation

Remediation: Add citation or mark as "No specific guidance found"
```

---

### Validation 3: Task-AC Coverage

**Validation**: Step 5.5 - Verify tasks cover all ACs

**Check**:
```python
all_ac_numbers = {1, 2, 3, 4}  # From acceptance criteria
referenced_ac_numbers = extract_ac_refs_from_tasks(story.tasks)

uncovered_acs = all_ac_numbers - referenced_ac_numbers

if uncovered_acs:
    warn(f"Acceptance criteria not referenced in tasks: {uncovered_acs}")
    # Continue with warning, not fatal error
```

**Warning Example**:
```
WARNING: Task coverage gap

Acceptance Criteria: 1, 2, 3, 4
Tasks reference: 1, 2, 3

AC 4 ("Failed login shows error message") not explicitly referenced in tasks.

Consider adding task or subtask for AC 4.

Continue? (y/n)
```

---

## 8. Dependencies & Prerequisites

### Prerequisites

**Before Task Execution**:

1. **BMad Core Installation**
   - `.bmad-core/` directory must exist
   - Core files installed:
     - `tasks/create-next-story.md` (this task)
     - `tasks/execute-checklist.md`
     - `templates/story-tmpl.yaml`
     - `checklists/story-draft-checklist.md`

2. **Project Configuration**
   - `core-config.yaml` MUST exist (task will HALT without it)
   - Configuration fields properly populated (see Section 2)

3. **PRD/Epic Documentation**
   - At least one epic defined
   - Epic contains story definitions with:
     - Story title
     - User story statement (As a...I want...so that...)
     - Acceptance criteria (numbered list)

4. **Architecture Documentation**
   - Architecture files created (for context extraction)
   - Minimum recommended:
     - `tech-stack.md`
     - `unified-project-structure.md`
     - `coding-standards.md`
     - `testing-strategy.md`
   - Additional docs based on story type (backend/frontend)

5. **Directory Structure**
   - `devStoryLocation` directory exists (e.g., `docs/stories/`)
   - Writable permissions for story file creation

### Runtime Dependencies

**Configuration File**:
- `.bmad-core/core-config.yaml` (MUST exist)

**Task Dependencies**:
- `.bmad-core/tasks/execute-checklist.md` (called in Step 6)

**Template Dependencies**:
- `.bmad-core/templates/story-tmpl.yaml` (loaded in Step 5)

**Checklist Dependencies**:
- `.bmad-core/checklists/story-draft-checklist.md` (executed in Step 6)

**Document Dependencies** (read if exist):
- Epic files: `{prdShardedLocation}/{epicFilePattern}`
- Previous story: `{devStoryLocation}/{epic}.{story}*.story.md`
- Architecture files: `{architectureShardedLocation}/*.md`
- Project structure: `docs/architecture/unified-project-structure.md`

**Dependency Loading Strategy**: **On-demand** (lazy loading)
- Configuration loaded in Step 0
- Epic files loaded in Step 1-2
- Architecture files loaded in Step 3 (only relevant ones)
- Templates loaded in Step 5
- Checklists executed in Step 6

### Dependency Chain

```
create-next-story.md
├── core-config.yaml (REQUIRED - HALT if missing)
├── execute-checklist.md → story-draft-checklist.md
├── story-tmpl.yaml (REQUIRED - HALT if missing)
├── epic files (REQUIRED for story content)
├── architecture files (OPTIONAL - warn if missing)
└── previous story file (OPTIONAL - skip if not exists)
```

---

## 9. Integration Points

### Integration 1: PM Agent → SM Agent Handoff

**Context**: After PRD creation and sharding

**Handoff Flow**:
```
PM Agent:
1. Creates PRD (monolithic or sharded)
2. Defines epics with stories
3. Saves epic files to {prdShardedLocation}/

→ HANDOFF POINT →

SM Agent:
1. Loads epic files from {prdShardedLocation}/
2. Extracts story definitions
3. Creates detailed story files
```

**Shared Artifacts**:
- **Epic Files**: Written by PM, read by SM
- **core-config.yaml**: Defines paths for both agents

**Coordination**:
- SM depends on PM completing epic definition
- SM respects epic sequencing (never auto-skips epics)

---

### Integration 2: Architect Agent → SM Agent Context Flow

**Context**: Architecture documentation informs story preparation

**Information Flow**:
```
Architect Agent:
1. Creates architecture documents
2. Defines data models, APIs, components
3. Saves to {architectureShardedLocation}/

→ CONTEXT EXTRACTION →

SM Agent:
1. Reads architecture files (story-type-aware)
2. Extracts relevant technical details
3. Cites sources in story Dev Notes
4. Embeds context in story file
```

**Shared Artifacts**:
- **Architecture Files**: Written by Architect, read by SM
- **Citations**: SM references Architect's documentation

**Coordination**:
- SM warns if architecture docs missing (non-fatal)
- SM never invents information missing from architecture
- SM extracts selectively (only relevant sections)

---

### Integration 3: SM Agent → Dev Agent Handoff

**Context**: Story creation → story implementation

**Handoff Flow**:
```
SM Agent:
1. Creates comprehensive story file
2. Populates Dev Notes with full context
3. Validates story with checklist
4. Sets status to "Draft"
5. Recommends PO validation for complex stories

→ HANDOFF POINT →

Dev Agent:
1. Loads story file
2. Reads Dev Notes (has full context)
3. DOES NOT need to read architecture docs
4. Implements tasks sequentially
5. Updates Dev Agent Record sections
6. Changes status: Draft → Approved → InProgress → Review → Done
```

**Shared Artifacts**:
- **Story File**: SM creates, Dev updates
- **Dev Agent Record**: Dev owns, SM initializes as empty

**Section Ownership**:
| Section | SM Role | Dev Role |
|---------|---------|----------|
| Status | Creates as "Draft" | Updates to InProgress/Review/Done |
| Story | Writes | Reads only |
| AC | Writes | Reads only |
| Tasks | Writes | Checks off, adds notes |
| Dev Notes | Writes (complete context) | Reads only |
| Dev Agent Record | Initializes empty | Owns, populates |
| QA Results | Initializes empty | Reads (after QA review) |

**Key Principle**: **"Dev agent should NEVER need to read architecture documents"**
- SM extracts all relevant context into story
- Dev reads story only (self-contained)
- Minimizes Dev agent context window usage

---

### Integration 4: PO Agent → SM Agent Validation Loop (Optional)

**Context**: PO validates complex story drafts before Dev handoff

**Validation Flow**:
```
SM Agent:
1. Creates story (status: Draft)
2. Recommends PO validation for complex stories
3. Alerts user: "Consider PO validation"

→ VALIDATION HANDOFF (optional) →

PO Agent:
1. Loads story file
2. Runs validation checklist
3. Verifies completeness, accuracy, consistency
4. Either:
   - Approves (status: Draft → Approved)
   - Requests revisions (status stays Draft, adds comments)

→ REVISION LOOP (if needed) →

SM Agent:
1. Reads PO feedback
2. Updates story based on feedback
3. Re-runs validation
4. Returns to PO or proceeds to Dev
```

**Shared Artifacts**:
- **Story File**: SM creates, PO validates
- **Validation Comments**: PO adds, SM reads

**When to Use**:
- Complex stories (fullstack, >5 ACs)
- High-risk stories (auth, payment, security)
- First few stories in new project
- Architecture-story misalignment suspected

---

### Integration 5: QA Agent → SM Agent Learning Loop

**Context**: QA insights inform future story preparation

**Learning Flow**:
```
QA Agent:
1. Reviews completed story implementation
2. Creates QA Results section
3. Identifies issues, gaps, or improvements

→ LEARNING TRANSFER →

SM Agent (next story):
1. Reads previous story's QA Results
2. Extracts lessons learned
3. Incorporates insights into new story's Dev Notes
4. Adjusts story preparation based on patterns
```

**Example Learning**:
```
Story 1.1 QA Results:
"Missing rate limiting led to security concern"

Story 1.2 Preparation:
Dev Notes includes:
"Previous story (1.1) added rate limiting for login.
Ensure similar rate limiting is applied to registration endpoint."
```

**Shared Artifacts**:
- **QA Results**: Written by QA, read by SM
- **Dev Agent Record**: Lessons learned for next story

---

### Integration 6: Story File → Execute Checklist Task

**Context**: SM calls generic checklist executor

**Integration Flow**:
```
SM Agent (Step 6):
CALL execute_task(
    '.bmad-core/tasks/execute-checklist',
    checklist='.bmad-core/checklists/story-draft-checklist',
    target=story_file_path
)

→ CHECKLIST EXECUTION →

Execute Checklist Task:
1. Loads story-draft-checklist.md
2. Reads story file
3. Evaluates checklist items
4. Returns validation report

→ RETURN TO SM →

SM Agent:
1. Receives validation report
2. Handles result (READY/NEEDS_REVISION/BLOCKED)
3. Proceeds or halts based on assessment
```

**Task Composition**:
- SM is a **consumer** of execute-checklist task
- Generic checklist executor, specialized checklist

---

## 10. Configuration References

### Configuration Schema

**File**: `.bmad-core/core-config.yaml`

**Required Fields**:
```yaml
devStoryLocation: string  # Path where story files are created

prd:
  prdSharded: boolean
  prdShardedLocation: string  # If prdSharded=true
  epicFilePattern: string     # If prdSharded=true
  prdFile: string             # If prdSharded=false

architecture:
  architectureVersion: string  # 'v4' or higher
  architectureSharded: boolean
  architectureShardedLocation: string  # If architectureSharded=true
  architectureFile: string             # If architectureSharded=false
```

**Optional Fields**:
```yaml
devLoadAlwaysFiles: list[string]  # Files Dev always loads
workflow: object                  # Workflow configurations
```

**Example Configuration**:
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

customTechnicalDocuments: null

devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md

devDebugLog: .ai/debug-log.md
devStoryLocation: docs/stories

slashPrefix: BMad
```

### Configuration Usage by Step

| Config Field | Used In Step | Purpose |
|--------------|--------------|---------|
| `devStoryLocation` | 1, 5, 6 | Story file output location |
| `prd.prdSharded` | 1 | Determines epic file location strategy |
| `prd.prdShardedLocation` | 1, 2 | Epic file directory |
| `prd.epicFilePattern` | 1, 2 | Epic file naming pattern |
| `architecture.architectureVersion` | 3 | Architecture reading strategy |
| `architecture.architectureSharded` | 3 | Sharded vs monolithic architecture |
| `architecture.architectureShardedLocation` | 3 | Architecture file directory |
| `devLoadAlwaysFiles` | 5 | Dev agent context files |

---

## 11. Performance Considerations

### Token Optimization

**Challenge**: Reading 13 architecture files can consume significant LLM context.

**Optimization Strategies**:

1. **Story-Type-Aware Reading** (Step 3.2):
   - Backend stories: 9 files (skip frontend docs)
   - Frontend stories: 8 files (skip backend docs)
   - Fullstack stories: 13 files (read all)
   - **Savings**: 30-40% token reduction for specialized stories

2. **Selective Section Extraction** (Step 3.4):
   - Extract only story-relevant sections
   - Skip boilerplate and unrelated content
   - Use document structure (headings) to navigate efficiently

3. **Lazy Loading**:
   - Load documents on-demand (not all at once)
   - Load config in Step 0, epics in Step 1-2, architecture in Step 3

4. **Citation Over Duplication**:
   - Cite source documents rather than copying full sections
   - Developer reads original docs if needed (rare with good citations)

### Execution Time

**Typical Story Creation Time**:
- **Simple Story** (backend only, 3 ACs): 30-60 seconds
- **Medium Story** (fullstack, 4-5 ACs): 60-120 seconds
- **Complex Story** (fullstack, 6+ ACs): 120-180 seconds

**Time Breakdown**:
| Step | Time (seconds) | % of Total |
|------|----------------|------------|
| 0. Load Config | 2-5 | 3% |
| 1. Identify Story | 5-10 | 10% |
| 2. Gather Requirements | 5-10 | 10% |
| 3. Architecture Context | 30-60 | 50% |
| 4. Structure Alignment | 5-10 | 8% |
| 5. Populate Template | 10-20 | 15% |
| 6. Checklist Validation | 5-10 | 8% |

**Bottleneck**: Step 3 (architecture context extraction) - most token-intensive

### Scaling Considerations

**Large Projects**:
- **100+ stories**: No performance degradation (stateless task)
- **Large architecture docs**: Selective reading mitigates impact
- **Many epics**: Epic identification is O(1) with proper file naming

**Optimization for Large Projects**:
1. Maintain architecture doc size <2000 lines per file
2. Use sharded architecture (v4+) for better modularity
3. Keep epic files focused (5-10 stories per epic)

---

## 12. Testing Strategy

### Unit Testing

**Test Coverage Areas**:

1. **Configuration Loading (Step 0)**:
   - Test: Config file exists → loads successfully
   - Test: Config file missing → HALT with error
   - Test: Invalid config values → validation error

2. **Story Identification (Step 1)**:
   - Test: No stories exist → returns (1, 1)
   - Test: Story 1.1 exists (Done) → returns (1, 2)
   - Test: Story 1.2 exists (InProgress) → prompts user
   - Test: Epic 1 complete → prompts user (no auto-advance)

3. **Story Type Classification (Step 3.2)**:
   - Test: "Login API" → backend
   - Test: "Login UI" → frontend
   - Test: "User Authentication" → fullstack
   - Test: Ambiguous title → checks epic context

4. **Architecture Reading (Step 3.3)**:
   - Test: Backend story → reads 9 files
   - Test: Frontend story → reads 8 files
   - Test: Fullstack story → reads 13 files

5. **Source Citation Validation (Step 5.4)**:
   - Test: All technical details have citations → pass
   - Test: Missing citation → validation error

6. **Task-AC Coverage (Step 5.5)**:
   - Test: All ACs referenced in tasks → pass
   - Test: AC 3 not referenced → warning

### Integration Testing

**End-to-End Scenarios**:

1. **Scenario: First Story Creation**:
   - Given: No story files exist
   - When: Execute create-next-story
   - Then: Story 1.1 created with status "Draft"

2. **Scenario: Sequential Story Creation**:
   - Given: Story 1.1 exists (Done)
   - When: Execute create-next-story
   - Then: Story 1.2 created

3. **Scenario: Epic Completion**:
   - Given: Stories 1.1, 1.2, 1.3 all Done (epic has 3 stories)
   - When: Execute create-next-story
   - Then: User prompted, no auto-advance to Epic 2

4. **Scenario: Incomplete Story Handling**:
   - Given: Story 1.2 exists (InProgress)
   - When: Execute create-next-story
   - Then: User alerted, override requested

5. **Scenario: Architecture Context Extraction**:
   - Given: Backend story identified
   - When: Step 3 executes
   - Then: Backend architecture docs read, frontend docs skipped

6. **Scenario: Missing Architecture Doc**:
   - Given: Story requires API specs, rest-api-spec.md missing
   - When: Step 3 executes
   - Then: Warning issued, note added to Dev Notes

### Validation Testing

**Checklist Validation Scenarios**:

1. **Scenario: Complete Story**:
   - Given: Story with all sections populated, citations present
   - When: Checklist executes
   - Then: Assessment = READY

2. **Scenario: Missing Citations**:
   - Given: Story with technical details but no sources
   - When: Checklist executes
   - Then: Assessment = NEEDS REVISION

3. **Scenario: Unclear Goal**:
   - Given: Story with vague acceptance criteria
   - When: Checklist executes
   - Then: Goal & Context Clarity = FAIL

### Test Data

**Sample Core Config**:
```yaml
devStoryLocation: tests/fixtures/stories
prd:
  prdSharded: true
  prdShardedLocation: tests/fixtures/prd
  epicFilePattern: epic-{n}*.md
architecture:
  architectureVersion: v4
  architectureSharded: true
  architectureShardedLocation: tests/fixtures/architecture
```

**Sample Epic File** (`tests/fixtures/prd/epic-1-auth.md`):
```markdown
# Epic 1: User Authentication

## Story 1.1: Login Page
**As a** user
**I want** to log in with email and password
**so that** I can access my account

**Acceptance Criteria**:
1. Form displays email and password fields
2. Submit validates credentials
3. Success redirects to dashboard
4. Failure shows error
```

**Sample Architecture File** (`tests/fixtures/architecture/rest-api-spec.md`):
```markdown
# REST API Specification

## Authentication Endpoints

### POST /api/auth/login
Request: LoginCredentials
Response: LoginResponse (200) | ErrorResponse (401)
Rate Limit: 5 req/15min per IP
```

---

## 13. Troubleshooting Guide

### Issue 1: "core-config.yaml not found"

**Symptoms**: Task halts immediately with config error

**Cause**: Configuration file missing from project root

**Solution**:
1. Copy template: `curl -o .bmad-core/core-config.yaml https://raw.githubusercontent.com/bmad-framework/bmad-core/main/core-config.yaml`
2. Configure paths for your project
3. Retry task

---

### Issue 2: "Epic file not found"

**Symptoms**: Task cannot locate epic file in Step 1

**Causes**:
- Epic file naming doesn't match pattern
- `prdShardedLocation` path incorrect
- Epic hasn't been created yet

**Solution**:
1. Verify epic file exists: `ls docs/prd/`
2. Check naming matches `epicFilePattern`: `epic-{n}*.md`
3. Update `core-config.yaml` if paths wrong
4. Run PM agent to create epic if missing

---

### Issue 3: "Story validation fails - missing citations"

**Symptoms**: Checklist returns NEEDS REVISION, missing source citations

**Cause**: Technical details in Dev Notes lack `[Source: ...]` citations

**Solution**:
1. Review Dev Notes section in story file
2. Add citations for all technical details:
   ```markdown
   API Endpoint: POST /api/auth/login
   [Source: architecture/rest-api-spec.md#authentication]
   ```
3. For information not from architecture, explicitly state:
   ```markdown
   Rate Limiting: No specific guidance found in architecture docs
   ```
4. Re-run checklist

---

### Issue 4: "Architecture docs not found"

**Symptoms**: Warnings about missing architecture documents

**Causes**:
- Architecture not created yet
- `architectureShardedLocation` path incorrect
- Specific architecture file missing

**Solution**:
1. Verify architecture files exist: `ls docs/architecture/`
2. Check required files present:
   - `tech-stack.md`
   - `unified-project-structure.md`
   - `coding-standards.md`
   - `testing-strategy.md`
3. Run Architect agent to create missing docs
4. Update `core-config.yaml` if path wrong
5. If docs intentionally missing, story will proceed with note in Dev Notes

---

### Issue 5: "Story classification ambiguous"

**Symptoms**: Task classifies story as fullstack when it should be backend/frontend

**Cause**: Story title/description lacks clear keywords

**Solution**:
1. Review story title in epic file
2. Add clarifying keywords:
   - Backend: "API", "endpoint", "database", "service"
   - Frontend: "UI", "component", "page", "form"
3. Or: Accept fullstack classification (safe, reads all docs)

---

### Issue 6: "Tasks don't cover all ACs"

**Symptoms**: Warning that some acceptance criteria not referenced in tasks

**Cause**: Generated tasks missed an AC reference

**Solution**:
1. Review generated tasks in story file
2. Manually add task or subtask for missing AC:
   ```markdown
   - [ ] Task 5: Error handling (AC: 4)
     - [ ] Display error message for failed login
   ```
3. Checklist warning is non-fatal - can proceed with manual fix

---

### Issue 7: "Previous story status unclear"

**Symptoms**: Task warns previous story status is ambiguous

**Cause**: Status field in previous story is missing or invalid

**Solution**:
1. Open previous story file
2. Fix Status field:
   ```markdown
   ## Status
   Done
   ```
3. Valid values: Draft | Approved | InProgress | Review | Done
4. Retry create-next-story task

---

## 14. Extensibility & Customization

### Extension Point 1: Custom Story Types

**Use Case**: Project has custom story classifications beyond backend/frontend/fullstack

**Extension**:
```python
# Add custom story type
def classify_story_type(story, epic):
    # ... existing logic ...

    # Custom: Data migration stories
    if contains_keywords(story, ['migration', 'schema', 'data']):
        return 'data_migration'

    # Custom: Infrastructure stories
    if contains_keywords(story, ['devops', 'deployment', 'ci/cd']):
        return 'infrastructure'

    return 'fullstack'  # fallback

# Map custom types to architecture docs
architecture_docs_by_type = {
    'backend': [...],
    'frontend': [...],
    'fullstack': [...],
    'data_migration': ['data-models.md', 'database-schema.md', 'migration-strategy.md'],
    'infrastructure': ['deployment-architecture.md', 'ci-cd-pipeline.md']
}
```

---

### Extension Point 2: Custom Dev Notes Sections

**Use Case**: Project needs additional Dev Notes categories

**Extension**:

Modify story template (`story-tmpl.yaml`):
```yaml
sections:
  - id: dev-notes
    title: Dev Notes
    sections:
      - id: previous-insights
        title: Previous Story Insights
      - id: data-models
        title: Data Models
      # ... existing sections ...

      # CUSTOM SECTION
      - id: deployment-notes
        title: Deployment Notes
        instruction: |
          Extract deployment-specific requirements:
          - Environment variables needed
          - Infrastructure dependencies
          - Configuration changes

      # CUSTOM SECTION
      - id: security-considerations
        title: Security Considerations
        instruction: |
          Extract security requirements:
          - Authentication/authorization needs
          - Data protection requirements
          - Input validation rules
```

Update Step 5.4 to populate custom sections from architecture.

---

### Extension Point 3: Custom Checklist Items

**Use Case**: Project has additional story validation requirements

**Extension**:

Create custom checklist (`story-draft-checklist-custom.yaml`):
```markdown
# Custom Story Draft Checklist

## [1-5: Standard checklist items]

## 6. SECURITY REQUIREMENTS VALIDATION

- [ ] Authentication requirements clearly specified
- [ ] Authorization rules defined
- [ ] Data protection measures identified
- [ ] Input validation rules documented

## 7. DEPLOYMENT READINESS

- [ ] Environment variables listed
- [ ] Configuration changes documented
- [ ] Database migrations identified (if applicable)
- [ ] Feature flags specified (if applicable)
```

Configure SM agent to use custom checklist:
```yaml
# In agent configuration
checklist_overrides:
  story_draft: '.bmad-core/checklists/story-draft-checklist-custom.md'
```

---

### Extension Point 4: Custom Task Generation Rules

**Use Case**: Project has standard task patterns (e.g., always include security review)

**Extension**:
```python
def generate_tasks(story, dev_notes):
    tasks = []

    # ... standard task generation ...

    # CUSTOM: Always add security review for auth-related stories
    if is_auth_related(story):
        tasks.append({
            'title': 'Security Review',
            'subtasks': [
                'Review authentication implementation',
                'Verify authorization checks',
                'Test for common vulnerabilities (OWASP Top 10)',
                'Document security decisions'
            ]
        })

    # CUSTOM: Add performance testing for API stories
    if story_type == 'backend':
        tasks.append({
            'title': 'Performance Testing',
            'subtasks': [
                'Load test API endpoint',
                'Verify response time <200ms p95',
                'Test database query performance',
                'Document performance metrics'
            ]
        })

    return tasks
```

---

### Extension Point 5: Custom Architecture Document Mapping

**Use Case**: Project uses different architecture document names or structure

**Extension**:
```python
# Override default architecture document mapping
custom_architecture_docs = {
    'universal': [
        'stack.md',           # Instead of tech-stack.md
        'structure.md',       # Instead of unified-project-structure.md
        'standards.md',       # Instead of coding-standards.md
        'testing.md'          # Instead of testing-strategy.md
    ],
    'backend': [
        'models.md',          # Instead of data-models.md
        'schema.md',          # Instead of database-schema.md
        'backend.md',         # Instead of backend-architecture.md
        'api.md',             # Instead of rest-api-spec.md
        'integrations.md'     # Instead of external-apis.md
    ],
    'frontend': [
        'frontend.md',        # Instead of frontend-architecture.md
        'ui-components.md',   # Instead of components.md
        'flows.md',           # Instead of core-workflows.md
        'models.md'           # Shared with backend
    ]
}

# Use custom mapping in Step 3.3
docs_to_read = custom_architecture_docs['universal']
if story_type in ['backend', 'fullstack']:
    docs_to_read += custom_architecture_docs['backend']
if story_type in ['frontend', 'fullstack']:
    docs_to_read += custom_architecture_docs['frontend']
```

---

## 15. ADK Translation Recommendations

### Recommended Service: **Google Vertex AI Reasoning Engine**

**Rationale**:
- **Complex workflow**: 6 sequential steps with state tracking
- **Multi-step reasoning**: Decision trees, classification, extraction
- **Document reading**: Multiple file reads with selective extraction
- **State persistence**: Configuration, story context across steps
- **User interaction**: Multiple decision points requiring user input
- **Error handling**: Validation, recovery, retry logic

### Alternative: Cloud Workflow + Cloud Functions

**Hybrid Approach**:
- **Cloud Workflow**: Orchestrate 6-step sequence
- **Cloud Functions**: Individual steps (classify story type, extract context, etc.)

**Comparison**:

| Aspect | Reasoning Engine | Cloud Workflow + Functions |
|--------|------------------|----------------------------|
| Complexity handling | Native multi-step reasoning | Manual orchestration |
| LLM integration | Built-in | Requires separate Vertex AI calls |
| State management | Automatic | Manual (Firestore) |
| Error handling | Integrated | Manual try-catch per function |
| Development speed | Faster (less boilerplate) | Slower (more infrastructure) |
| Cost | Higher (reasoning engine) | Lower (individual functions) |

**Recommendation**: **Reasoning Engine** for initial implementation, consider Cloud Workflow optimization for cost reduction at scale.

---

### ADK Implementation Design

**Reasoning Engine Class Structure**:

```python
from google.cloud import reasoning_engine
from google.cloud import storage
from google.cloud import firestore

class CreateNextStoryWorkflow:
    """
    Reasoning Engine workflow for create-next-story task.
    Implements the 6-step sequential process.
    """

    def __init__(self, project_id: str, config: dict):
        self.project_id = project_id
        self.config = config
        self.firestore = firestore.Client()
        self.storage = storage.Client()
        self.bucket = self.storage.bucket('bmad-project-files')

    def execute(self, user_input: dict) -> dict:
        """
        Main execution flow.

        Args:
            user_input: {
                'command': '*draft',
                'story_override': '1.2' (optional)
            }

        Returns:
            {
                'story_file': 'docs/stories/1.1.login-page.story.md',
                'status': 'Draft',
                'assessment': 'READY',
                'summary': {...}
            }
        """
        # Step 0: Load configuration
        core_config = self.load_core_config()

        # Step 1: Identify next story
        next_story_id = self.identify_next_story(
            core_config,
            user_input.get('story_override')
        )

        # Step 2: Gather requirements
        requirements = self.gather_requirements(next_story_id, core_config)

        # Step 3: Gather architecture context
        arch_context = self.gather_architecture_context(
            next_story_id,
            requirements,
            core_config
        )

        # Step 4: Verify project structure
        structure_notes = self.verify_project_structure(
            arch_context,
            core_config
        )

        # Step 5: Populate story template
        story = self.populate_story_template(
            next_story_id,
            requirements,
            arch_context,
            structure_notes,
            core_config
        )

        # Step 6: Validate and complete
        validation = self.validate_story_draft(story)

        if validation['assessment'] != 'READY':
            return {
                'status': 'NEEDS_REVISION',
                'issues': validation['issues'],
                'story_file': story['file_path']
            }

        # Save story file
        self.save_story_file(story)

        # Generate summary
        summary = self.generate_summary(story, validation)

        return {
            'status': 'SUCCESS',
            'story_file': story['file_path'],
            'assessment': validation['assessment'],
            'summary': summary
        }

    # Step 0: Configuration
    def load_core_config(self) -> dict:
        """Load and validate core-config.yaml"""
        config_path = f'{self.project_id}/.bmad-core/core-config.yaml'

        try:
            blob = self.bucket.blob(config_path)
            config_yaml = blob.download_as_text()
            config = yaml.safe_load(config_yaml)
            self.validate_config(config)
            return config
        except Exception as e:
            raise ConfigError(
                "core-config.yaml not found. "
                "This file is required for story creation. "
                "You can either: 1) Copy it from GITHUB OR "
                "2) Run the BMad installer."
            )

    def validate_config(self, config: dict):
        """Validate required configuration fields"""
        required = ['devStoryLocation', 'prd', 'architecture']
        for field in required:
            if field not in config:
                raise ConfigError(f"Missing required field: {field}")

    # Step 1: Story Identification
    def identify_next_story(
        self,
        core_config: dict,
        override: str = None
    ) -> tuple[int, int]:
        """
        Identify next story to create.

        Returns: (epic_num, story_num)
        """
        if override:
            return self.parse_story_override(override)

        # Find highest existing story
        story_location = core_config['devStoryLocation']
        story_files = self.list_story_files(story_location)

        if not story_files:
            return (1, 1)  # First story

        highest_story = self.find_highest_story(story_files)
        epic_num, story_num = self.parse_story_id(highest_story)

        # Check status
        story_status = self.get_story_status(highest_story)

        if story_status != 'Done':
            # Prompt user for override
            user_approval = self.prompt_incomplete_story_override(
                epic_num, story_num, story_status
            )
            if not user_approval:
                raise StoryIncompleteError(
                    f"Story {epic_num}.{story_num} is {story_status}. "
                    "Complete this story first."
                )

        # Determine next story
        epic_file = self.load_epic_file(epic_num, core_config)
        total_stories = self.count_stories_in_epic(epic_file)

        if story_num < total_stories:
            return (epic_num, story_num + 1)
        else:
            # Epic complete - prompt user
            user_choice = self.prompt_epic_complete(epic_num)
            if user_choice == 1:
                return (epic_num + 1, 1)
            elif user_choice == 2:
                return self.prompt_specific_story()
            else:
                raise CancelledError("Story creation cancelled by user")

    # Step 2: Requirements Gathering
    def gather_requirements(
        self,
        story_id: tuple[int, int],
        core_config: dict
    ) -> dict:
        """
        Extract story requirements from epic and previous story.

        Returns: {
            'title': str,
            'statement': dict,
            'acceptance_criteria': list[str],
            'previous_insights': str
        }
        """
        epic_num, story_num = story_id

        # Load epic file
        epic_file = self.load_epic_file(epic_num, core_config)

        # Extract story definition
        story_def = self.extract_story_from_epic(
            epic_file, epic_num, story_num
        )

        # Review previous story (if exists)
        previous_insights = ""
        if story_num > 1:
            prev_story = self.load_story_file(
                (epic_num, story_num - 1),
                core_config
            )
            previous_insights = self.extract_dev_agent_record_insights(
                prev_story
            )

        return {
            'title': story_def['title'],
            'statement': story_def['statement'],
            'acceptance_criteria': story_def['acceptance_criteria'],
            'previous_insights': previous_insights
        }

    # Step 3: Architecture Context
    def gather_architecture_context(
        self,
        story_id: tuple[int, int],
        requirements: dict,
        core_config: dict
    ) -> dict:
        """
        Extract architecture context using story-type-aware reading.

        Returns: {
            'story_type': str,
            'data_models': str,
            'api_specs': str,
            'component_specs': str,
            'file_locations': str,
            'testing_requirements': str,
            'technical_constraints': str
        }
        """
        # Classify story type
        story_type = self.classify_story_type(requirements)

        # Determine architecture documents to read
        docs_to_read = self.get_architecture_docs_by_type(
            story_type, core_config
        )

        # Read and extract context
        arch_context = {
            'story_type': story_type
        }

        for doc in docs_to_read:
            doc_content = self.read_architecture_doc(doc, core_config)
            relevant_sections = self.extract_relevant_sections(
                doc_content, requirements
            )
            arch_context.update(relevant_sections)

        return arch_context

    def classify_story_type(self, requirements: dict) -> str:
        """
        Classify story as backend, frontend, or fullstack.
        """
        story_text = f"{requirements['title']} {requirements['statement']}"

        backend_keywords = [
            'api', 'endpoint', 'database', 'schema', 'model',
            'service', 'auth', 'authentication', 'authorization'
        ]
        frontend_keywords = [
            'ui', 'component', 'page', 'form', 'button',
            'display', 'render', 'view', 'frontend', 'client'
        ]

        backend_score = self.count_keywords(story_text, backend_keywords)
        frontend_score = self.count_keywords(story_text, frontend_keywords)

        if backend_score > 0 and frontend_score > 0:
            return 'fullstack'
        elif backend_score > frontend_score:
            return 'backend'
        elif frontend_score > backend_score:
            return 'frontend'
        else:
            return 'fullstack'  # Default safe option

    # Step 4: Structure Verification
    def verify_project_structure(
        self,
        arch_context: dict,
        core_config: dict
    ) -> str:
        """
        Verify file paths align with project structure.

        Returns: Markdown notes on structural alignment/conflicts
        """
        structure_doc = self.read_architecture_doc(
            'unified-project-structure.md',
            core_config
        )

        extracted_paths = self.extract_file_paths(arch_context)
        conflicts = []

        for path in extracted_paths:
            if not self.verify_path_compliance(path, structure_doc):
                conflicts.append({
                    'path': path,
                    'expected': self.get_expected_path(path, structure_doc)
                })

        if conflicts:
            return self.format_structure_conflict_notes(conflicts)
        else:
            return self.format_structure_alignment_notes(extracted_paths)

    # Step 5: Template Population
    def populate_story_template(
        self,
        story_id: tuple[int, int],
        requirements: dict,
        arch_context: dict,
        structure_notes: str,
        core_config: dict
    ) -> dict:
        """
        Generate complete story document.

        Returns: {
            'file_path': str,
            'content': str,
            'metadata': dict
        }
        """
        # Load template
        template = self.load_story_template()

        # Generate file path
        epic_num, story_num = story_id
        story_slug = self.generate_slug(requirements['title'])
        file_path = (
            f"{core_config['devStoryLocation']}/"
            f"{epic_num}.{story_num}.{story_slug}.story.md"
        )

        # Populate sections
        story_content = self.render_story_sections(
            story_id,
            requirements,
            arch_context,
            structure_notes,
            template
        )

        return {
            'file_path': file_path,
            'content': story_content,
            'metadata': {
                'epic': epic_num,
                'story': story_num,
                'title': requirements['title'],
                'status': 'Draft',
                'story_type': arch_context['story_type']
            }
        }

    def render_story_sections(
        self,
        story_id: tuple[int, int],
        requirements: dict,
        arch_context: dict,
        structure_notes: str,
        template: dict
    ) -> str:
        """
        Render all story sections with full context.
        """
        epic_num, story_num = story_id

        sections = {
            'title': f"# Story {epic_num}.{story_num}: {requirements['title']}",
            'status': "## Status\nDraft",
            'story': self.render_story_statement(requirements['statement']),
            'acceptance_criteria': self.render_acceptance_criteria(
                requirements['acceptance_criteria']
            ),
            'tasks': self.generate_tasks(requirements, arch_context),
            'dev_notes': self.render_dev_notes(
                requirements, arch_context
            ),
            'structure_notes': structure_notes,
            'change_log': self.render_change_log(story_id),
            'dev_agent_record': self.render_empty_dev_record(),
            'qa_results': self.render_empty_qa_results()
        }

        return "\n\n".join(sections.values())

    # Step 6: Validation
    def validate_story_draft(self, story: dict) -> dict:
        """
        Execute story draft checklist validation.

        Returns: {
            'assessment': 'READY' | 'NEEDS_REVISION' | 'BLOCKED',
            'issues': list[str],
            'recommendations': list[str]
        }
        """
        # Execute checklist (separate Reasoning Engine call)
        checklist_result = self.execute_checklist(
            '.bmad-core/checklists/story-draft-checklist.md',
            story['content']
        )

        return checklist_result

    # User Interaction Methods
    def prompt_incomplete_story_override(
        self,
        epic: int,
        story: int,
        status: str
    ) -> bool:
        """
        Prompt user when previous story is incomplete.
        Returns True if user approves override.
        """
        # In ADK, this would trigger a user interaction flow
        # Return user's choice (approve/reject)
        pass

    def prompt_epic_complete(self, epic: int) -> int:
        """
        Prompt user when epic is complete.
        Returns: 1 (next epic), 2 (specific story), 3 (cancel)
        """
        # In ADK, this would trigger a user interaction flow
        pass
```

### Firestore Schema for State Management

```
/projects/{project_id}
  - core_config: {core-config.yaml contents}

/projects/{project_id}/stories/{epic}.{story}
  - status: "Draft" | "Approved" | "InProgress" | "Review" | "Done"
  - content: {full story markdown}
  - created_at: timestamp
  - created_by: "sm-agent"

/projects/{project_id}/epics/{epic}
  - content: {epic markdown}
  - story_count: int
  - completed_stories: list[int]
```

### Cloud Storage Organization

```
gs://bmad-project-files/{project_id}/
├── .bmad-core/
│   ├── core-config.yaml
│   ├── tasks/
│   ├── templates/
│   └── checklists/
├── docs/
│   ├── prd/
│   │   ├── epic-1-auth.md
│   │   └── epic-2-profile.md
│   ├── architecture/
│   │   ├── tech-stack.md
│   │   ├── rest-api-spec.md
│   │   └── ...
│   └── stories/
│       ├── 1.1.login-page.story.md
│       └── 1.2.password-reset.story.md
```

### API Endpoint Design

```yaml
POST /v1/projects/{project_id}/sm/create-story

Request:
  {
    "command": "*draft",
    "story_override": "1.3"  # optional
  }

Response (success):
  {
    "status": "SUCCESS",
    "story_file": "docs/stories/1.3.user-registration.story.md",
    "assessment": "READY",
    "summary": {
      "epic": 1,
      "story": 3,
      "title": "User Registration",
      "technical_components": [...],
      "architecture_refs": [...]
    }
  }

Response (needs revision):
  {
    "status": "NEEDS_REVISION",
    "story_file": "docs/stories/1.3.user-registration.story.md",
    "issues": [
      "Missing API rate limiting specification",
      "Component props not fully specified"
    ],
    "recommendations": [...]
  }

Response (blocked):
  {
    "status": "BLOCKED",
    "blocking_info": "Epic 1 not found. Create epic first.",
    "remediation": "Run PM agent to create epic"
  }
```

---

## 16. Summary

### Task Overview

**create-next-story** is the **primary workflow** of the Scrum Master agent, responsible for identifying and preparing comprehensive, implementation-ready user stories. It implements a **strict 6-step sequential process** that transforms high-level epic definitions into detailed, self-contained story files with complete technical context.

### Key Characteristics

1. **Sequential Workflow**: Steps must complete in order (0→1→2→3→4→5→6)
2. **Configuration-Driven**: All behavior controlled by `core-config.yaml`
3. **Story-Type-Aware**: Classifies stories (backend/frontend/fullstack) for targeted architecture reading
4. **Source Citation Discipline**: All technical details must cite source documents
5. **Epic Sequencing Enforcement**: Never auto-advances to next epic without user approval
6. **Developer-Centric**: Creates stories so complete that Dev agent never needs to read architecture

### Critical Design Principles

- **"Prepare stories so complete that AI developer agents can implement them without confusion"**
- **"Never invent technical details not present in architecture documents"**
- **"Always cite sources for traceability"**
- **"User maintains control of epic sequencing"**

### Primary Outputs

1. **Story File**: Complete markdown document with:
   - Story statement and acceptance criteria
   - Detailed tasks/subtasks
   - Comprehensive Dev Notes with full technical context
   - Source citations for all technical details
   - Project structure alignment notes
   - Empty sections for Dev Agent Record and QA Results

2. **Console Summary**: Human-readable creation summary
3. **Validation Report**: Checklist assessment (READY/NEEDS_REVISION/BLOCKED)

### Integration Role

**create-next-story** sits at the **center of the BMad workflow**:
- **Receives** epic definitions from PM agent
- **Extracts** context from Architect agent's documentation
- **Prepares** stories for Dev agent implementation
- **Enables** PO validation (optional)
- **Learns** from QA agent feedback (previous stories)

### Complexity Profile

- **Input Complexity**: Configuration-driven, multiple document types
- **Processing Complexity**: Multi-step reasoning, classification, extraction, validation
- **Output Complexity**: Structured markdown with 9 sections
- **Time Complexity**: 60-180 seconds per story (depends on story type)
- **Token Complexity**: High (reads 8-13 architecture files, generates 1000-2000 line stories)

### ADK Recommendation

**Google Vertex AI Reasoning Engine** - Best fit for complex multi-step workflow with document reading, classification, and user interaction.

---

**Document Version**: 1.0
**Created**: 2025-10-14
**Author**: Claude Code (AI Agent)
**Analysis Type**: Task Workflow Deep Dive
**BMad Version**: Core v4
