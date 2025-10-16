# Task Analysis: validate-next-story

**Task ID**: `validate-next-story`
**Task File**: `.bmad-core/tasks/validate-next-story.md`
**Primary Agents**: PO (Sarah), Dev (James)
**Task Type**: Quality Assurance Workflow - Story Validation
**Version Analyzed**: BMad Core v4

---

## 1. Purpose & Scope

### Overview
The `validate-next-story` task performs **comprehensive pre-implementation validation** of drafted stories to ensure they are complete, accurate, and ready for development. This is a critical quality gate that prevents hallucinations, missing information, and implementation failures by catching issues before code is written.

### Key Characteristics
- **10-step validation framework** - Systematic examination across multiple quality dimensions
- **Template compliance verification** - Ensures structural completeness against story-tmpl.yaml
- **Anti-hallucination focus** - Verifies all technical claims are traceable to source documents
- **Implementation readiness assessment** - Evaluates whether Dev agent can succeed without external references
- **GO/NO-GO decision** - Clear binary recommendation with readiness scoring
- **Multi-tier issue categorization** - Critical/Should-Fix/Nice-to-Have prioritization

### Scope
This task encompasses:
- Template structure and completeness validation
- File structure and source tree accuracy verification
- UI/frontend specification assessment (when applicable)
- Acceptance criteria coverage and testability validation
- Testing instructions clarity review
- Security considerations assessment (when applicable)
- Task sequence and dependency validation
- Anti-hallucination verification (source traceability)
- Dev agent implementation readiness evaluation
- Structured validation report generation with GO/NO-GO recommendation

### When to Use
- **After SM creates story draft** - Primary use case: validate before Dev begins implementation
- **Before story approval** - PO validates story before marking as "Approved"
- **After story corrections** - Re-validate after addressing previous validation issues
- **Optional quality gate** - Can be skipped for simple stories or trusted workflows
- **Learning/improvement** - Use validation feedback to improve story creation process

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - story_file: 'path/to/story.md'     # The drafted story file to validate

optional:
  - explicit_story_path: 'path'         # User-provided story path
  - story_id: '{epic}.{story}'          # For auto-discovery in devStoryLocation
```

### Input Sources
- **story_file**: Provided by user command (e.g., `*validate-story-draft {story}`)
- **Discovered story**: If not provided, agent may discover latest story in `devStoryLocation`
- **Parent epic**: Referenced in story metadata, loaded from PRD location
- **Architecture docs**: Referenced via core-config.yaml architecture paths
- **Story template**: `.bmad-core/templates/story-tmpl.yaml` for structure validation

### Configuration Dependencies
From `core-config.yaml`:
- `devStoryLocation` - Location of story files for auto-discovery
- `prd.baseLocation` - Location of PRD and epic files
- `prd.shardedLocation` - Location of sharded epics (if v4+ architecture)
- `prd.docFilePath` - Monolithic PRD path (if v3 architecture)
- `architecture.baseLocation` - Location of architecture documents
- `architecture.shardedLocation` - Location of sharded architecture sections (if v4+)
- `architecture.docFilePath` - Monolithic architecture path (if v3)
- `templatesLocation` - Location of `.bmad-core/templates/` directory

### Template Dependency
- `.bmad-core/templates/story-tmpl.yaml` - Required for completeness validation (section structure)

---

## 3. Execution Flow

The validate-next-story task follows a systematic 11-step process (0-10):

### Step 0: Load Core Configuration and Inputs

**Purpose**: Initialize validation context by loading all required configuration and identifying input files.

**Actions**:
1. **Load core-config.yaml**:
   ```yaml
   .bmad-core/core-config.yaml
   ```
   - If file does not exist: **HALT** with error message
   - Error: "core-config.yaml not found. This file is required for story validation."

2. **Extract key configurations**:
   - `devStoryLocation` - For story file location
   - `prd.baseLocation` or `prd.shardedLocation` - For parent epic location
   - `architecture.baseLocation` or `architecture.shardedLocation` - For architecture context
   - `templatesLocation` - For story template

3. **Identify input files**:
   - **Story file**: Provided by user or discovered in `devStoryLocation`
   - **Parent epic**: Extract epic number from story, load from PRD location
   - **Architecture documents**: Based on configuration (sharded v4+ or monolithic v3)
   - **Story template**: `.bmad-core/templates/story-tmpl.yaml`

4. **Load all identified files** into memory for validation

**Error Handling**:
- If core-config.yaml missing: HALT with error
- If story file not found: Request user to provide path
- If parent epic not found: Flag as validation issue (affects source verification)
- If architecture docs not found: Flag as validation issue (affects anti-hallucination check)
- If story template not found: HALT with error (cannot validate structure)

---

### Step 1: Template Completeness Validation

**Purpose**: Verify story structure matches template requirements and all required sections are present.

**Actions**:

1. **Load story template**:
   ```yaml
   .bmad-core/templates/story-tmpl.yaml
   ```

2. **Extract template section headings**:
   - Parse template YAML structure
   - Identify all required sections (where `required: true`)
   - Identify all optional sections
   - Build checklist of expected sections

3. **Missing sections check**:
   - Parse story markdown file
   - Extract all H2-level headings (`## Section Name`)
   - Compare story sections against template sections
   - Flag any missing required sections
   - Note missing optional sections (lower severity)

4. **Placeholder validation**:
   - Search story content for template variables:
     - `{{EpicNum}}` - Epic number placeholder
     - `{{role}}` - User role placeholder
     - `{{action}}` - Action placeholder
     - `_TBD_` - To-be-determined marker
     - `[TODO]` - TODO marker
     - `???` - Unknown/unclear marker
   - Flag any unfilled placeholders as critical issues

5. **Agent section verification**:
   - Verify sections for agent use are present:
     - **Dev Notes** section (Dev agent reads this)
     - **QA Results** section (QA agent writes this)
     - **File List** section (Dev agent writes this)
     - **Dev Agent Record** section (Dev agent writes this)
   - Flag missing agent sections as critical issues

6. **Structure compliance**:
   - Verify story has proper H1 heading (title)
   - Verify frontmatter/metadata (if required)
   - Verify section ordering matches template
   - Check for extraneous sections not in template

**Validation Output**:
```
Template Compliance Issues:
- Missing sections: [list]
- Unfilled placeholders: [list with locations]
- Missing agent sections: [list]
- Structural issues: [list]
```

---

### Step 2: File Structure and Source Tree Validation

**Purpose**: Ensure file paths, directory structures, and project organization are accurate and implementable.

**Actions**:

1. **File paths clarity check**:
   - Review **Tasks/Subtasks** section
   - Identify tasks that create or modify files
   - Verify file paths are explicit (not vague like "update the component")
   - Check for absolute vs relative path consistency
   - Example good path: `src/components/auth/LoginForm.tsx`
   - Example bad path: "update the login component somewhere"

2. **Source tree relevance check**:
   - Review **Dev Notes** section for "Project Structure" or similar
   - Verify relevant directory structure is included
   - Check if source tree shows context for new files
   - Verify source tree reflects architecture document structure
   - Example:
     ```
     src/
       components/
         auth/
           LoginForm.tsx  # <-- New file goes here
           index.ts
     ```

3. **Directory structure validation**:
   - For each new file/component mentioned in tasks:
     - Verify parent directory exists in source tree or will be created
     - Check directory location matches project conventions
     - Verify directory structure aligns with architecture docs
   - Flag files that would be created in unclear/incorrect locations

4. **File creation sequence check**:
   - Review task order
   - Verify files are created in logical dependency order
   - Check that directory creation precedes file creation
   - Verify imports/dependencies are created before dependent files
   - Example: Create types file before components that use those types

5. **Path accuracy verification**:
   - Cross-reference file paths with:
     - Architecture document project structure sections
     - Existing project conventions (from architecture)
     - Framework/technology standards (e.g., Next.js conventions)
   - Flag paths that contradict architecture specifications

**Validation Output**:
```
File Structure Issues:
- Unclear file paths: [list with task references]
- Missing source tree context: [issues]
- Incorrect directory locations: [list]
- File creation sequence problems: [list]
- Path inconsistencies with architecture: [list]
```

---

### Step 3: UI/Frontend Completeness Validation (if applicable)

**Purpose**: For frontend stories, verify UI specifications are detailed enough for implementation.

**Detection**: Story is frontend-related if:
- Story title contains "UI", "Frontend", "Component", "Page", "Form"
- Tasks mention React, Vue, Angular, or other frontend frameworks
- Story type field (if present) indicates "frontend" or "fullstack"

**Actions** (only if frontend story):

1. **Component specifications check**:
   - Are component names and purposes clear?
   - Are component props/inputs specified?
   - Are component states identified?
   - Are component behaviors described?
   - Is component composition/hierarchy clear?

2. **Styling/design guidance check**:
   - Are visual requirements specified (colors, spacing, layout)?
   - Is responsive behavior described?
   - Are design system references included?
   - Are CSS/styling approaches specified?
   - Is visual hierarchy clear?

3. **User interaction flows check**:
   - Are user actions (clicks, inputs, navigation) described?
   - Are interaction feedback mechanisms specified (loading, errors, success)?
   - Are form validation behaviors clear?
   - Are keyboard/accessibility interactions mentioned?

4. **Responsive/accessibility check**:
   - Are breakpoints or responsive requirements mentioned?
   - Are ARIA labels or accessibility considerations included?
   - Are keyboard navigation requirements specified?
   - Is screen reader compatibility mentioned (if required)?

5. **Integration points check**:
   - Are API endpoints or data sources identified?
   - Is data flow (props, state, context) clear?
   - Are backend integration points specified?
   - Is error handling for API calls described?

**Validation Output** (if applicable):
```
UI/Frontend Completeness Issues:
- Insufficient component specifications: [list]
- Missing styling/design guidance: [list]
- Unclear interaction flows: [list]
- Missing responsive/accessibility considerations: [list]
- Unclear integration points: [list]
```

**Validation Output** (if not frontend story):
```
UI/Frontend Validation: Not applicable (backend/infrastructure story)
```

---

### Step 4: Acceptance Criteria Satisfaction Assessment

**Purpose**: Verify that planned tasks will fully satisfy all acceptance criteria and that ACs are testable.

**Actions**:

1. **AC coverage analysis**:
   - Extract all acceptance criteria from **Acceptance Criteria** section
   - For each AC:
     - Identify which tasks/subtasks address it
     - Verify tasks are sufficient to satisfy the AC
     - Flag ACs with no corresponding tasks (coverage gaps)
   - Create traceability matrix: AC → Tasks

2. **AC testability check**:
   - For each acceptance criterion:
     - Is it measurable? (Can you verify success/failure?)
     - Is it specific? (No vague terms like "good", "fast", "user-friendly")
     - Does it have clear pass/fail criteria?
     - Are test conditions identifiable?
   - Flag vague or untestable ACs

3. **Missing scenarios check**:
   - Review acceptance criteria for completeness:
     - Are happy path scenarios covered?
     - Are error conditions covered?
     - Are edge cases mentioned?
     - Are boundary conditions addressed?
   - Flag missing critical scenarios

4. **Success definition clarity**:
   - For each AC, verify "done" is well-defined:
     - What observable behavior indicates success?
     - What data/state changes indicate completion?
     - Are success metrics quantifiable?
   - Flag ACs with ambiguous success criteria

5. **Task-AC mapping verification**:
   - Verify tasks explicitly reference their corresponding ACs
   - Check for tasks that don't map to any AC (scope creep?)
   - Verify AC ordering aligns with task sequencing
   - Create bidirectional traceability: Tasks ↔ ACs

**Validation Output**:
```
Acceptance Criteria Issues:
- ACs with no task coverage: [list with AC numbers]
- Untestable ACs (vague/unmeasurable): [list]
- Missing scenarios (errors, edge cases): [list]
- ACs with unclear success definition: [list]
- Task-AC mapping problems: [list]
```

---

### Step 5: Validation and Testing Instructions Review

**Purpose**: Ensure testing approach and validation steps are clear and actionable for Dev agent.

**Actions**:

1. **Test approach clarity check**:
   - Review **Validation & Testing** section (or similar)
   - Verify testing methodology is specified:
     - Unit testing approach
     - Integration testing approach
     - E2E testing approach (if applicable)
   - Check if test types are appropriate for story complexity
   - Verify testing strategy aligns with acceptance criteria

2. **Test scenarios identification**:
   - Are key test cases explicitly listed?
   - Are positive/negative test cases mentioned?
   - Are edge cases included in test scenarios?
   - Is test data mentioned or specified?
   - Example good test scenario:
     ```
     Test: User login with valid credentials
     - Given: User has registered account
     - When: User enters correct email/password
     - Then: User is logged in and redirected to dashboard
     ```

3. **Validation steps clarity**:
   - For each acceptance criterion:
     - Are validation steps specified?
     - Are verification methods clear?
     - Is expected behavior described?
   - Can Dev agent validate AC satisfaction from provided instructions?

4. **Testing tools/frameworks check**:
   - Are testing frameworks mentioned? (e.g., Jest, Vitest, Playwright)
   - Are testing utilities specified? (e.g., React Testing Library)
   - Is test tooling consistent with architecture docs?
   - Are any special testing tools/libraries needed?

5. **Test data requirements check**:
   - Are test data needs identified?
   - Are mock data specifications provided?
   - Are test fixtures or seeds mentioned?
   - Is test data setup approach clear?

**Validation Output**:
```
Testing Instructions Issues:
- Unclear test approach: [issues]
- Missing test scenarios: [gaps]
- Unclear validation steps for ACs: [list]
- Missing testing tools/frameworks: [issues]
- Unclear test data requirements: [gaps]
```

---

### Step 6: Security Considerations Assessment (if applicable)

**Purpose**: For stories involving security-sensitive areas, verify security requirements are identified and addressed.

**Detection**: Story is security-sensitive if:
- Story involves authentication, authorization, or access control
- Story handles sensitive data (PII, credentials, payment info)
- Story involves API endpoints or external integrations
- Tasks mention security-related files (auth, security, middleware)

**Actions** (only if security-sensitive):

1. **Security requirements identification**:
   - Are security requirements explicitly stated?
   - Are threat considerations mentioned?
   - Is security context from architecture referenced?
   - Are security standards/regulations referenced?

2. **Authentication/authorization check**:
   - Are access control requirements specified?
   - Are permission checks mentioned in tasks?
   - Is role-based access control (RBAC) addressed?
   - Are authentication flows described?
   - Example: "Verify user has 'admin' role before allowing delete operation"

3. **Data protection check**:
   - Are sensitive data handling requirements clear?
   - Is data encryption mentioned (at rest, in transit)?
   - Are data sanitization requirements specified?
   - Is PII handling addressed?
   - Are secrets management practices mentioned?

4. **Vulnerability prevention check**:
   - Are common vulnerabilities addressed?
     - SQL injection (if database queries)
     - XSS (if rendering user input)
     - CSRF (if state-changing endpoints)
     - Authentication bypass (if auth changes)
   - Are input validation requirements specified?
   - Is output encoding/escaping mentioned?

5. **Compliance requirements check**:
   - Are regulatory requirements mentioned? (GDPR, HIPAA, etc.)
   - Are audit logging requirements specified?
   - Are data retention policies addressed?
   - Is compliance documentation referenced?

**Validation Output** (if applicable):
```
Security Considerations Issues:
- Missing security requirements: [gaps]
- Unclear authentication/authorization: [issues]
- Insufficient data protection guidance: [gaps]
- Unaddressed vulnerabilities: [risks]
- Missing compliance requirements: [gaps]
```

**Validation Output** (if not security-sensitive):
```
Security Assessment: Not applicable (story does not involve security-sensitive areas)
```

---

### Step 7: Tasks/Subtasks Sequence Validation

**Purpose**: Verify task ordering is logical, dependencies are clear, and tasks are appropriately granular.

**Actions**:

1. **Logical order verification**:
   - Review **Tasks/Subtasks** section
   - Verify tasks follow implementation sequence:
     - Infrastructure/setup tasks first
     - Dependencies before dependents
     - Backend before frontend (for fullstack)
     - Core logic before edge cases
     - Implementation before testing
   - Flag tasks that appear out of order

2. **Dependencies identification**:
   - For each task:
     - Identify prerequisites (what must exist first?)
     - Identify dependents (what depends on this task?)
   - Verify dependencies are satisfied by prior tasks
   - Check for circular dependencies
   - Flag missing dependency statements

3. **Granularity assessment**:
   - Evaluate task sizing:
     - Too large? (Should be broken down)
     - Too small? (Could be combined)
     - Too vague? (Needs more specificity)
     - Too prescriptive? (Over-engineering)
   - Ideal granularity: Each task is a single, testable unit of work
   - Flag tasks that are poorly sized

4. **Completeness verification**:
   - Do tasks cover all requirements?
   - Do tasks cover all acceptance criteria?
   - Are setup/teardown tasks included?
   - Are testing tasks included?
   - Are documentation tasks included (if required)?
   - Flag missing necessary tasks

5. **Blocking issues identification**:
   - Identify tasks that would block others if they fail
   - Verify critical path tasks are clearly marked
   - Check for unnecessary blocking relationships
   - Verify parallel work opportunities are identified

**Validation Output**:
```
Task Sequence Issues:
- Tasks out of logical order: [list with suggested reordering]
- Unclear dependencies: [list]
- Poorly sized tasks (too large/small/vague): [list]
- Missing tasks for complete implementation: [gaps]
- Blocking issues: [list]
```

---

### Step 8: Anti-Hallucination Verification

**Purpose**: **Critical validation** - Ensure all technical claims are traceable to source documents and prevent invented details.

**Philosophy**: This is the most important validation step. Hallucinated details cause implementation failures, wasted time, and incorrect system architecture.

**Actions**:

1. **Source verification**:
   - For every technical claim in **Dev Notes**:
     - Identify the claim (technology, pattern, library, standard, etc.)
     - Verify claim appears in source documents:
       - Parent epic (requirements)
       - Architecture documents (technical decisions)
       - Technical preferences (standards, conventions)
     - Flag claims with no source reference

   **Example claims to verify**:
   - "Use React Query for data fetching" → Must appear in architecture
   - "Follow existing pattern in auth/LoginForm.tsx" → File must exist or be mentioned
   - "API endpoint: POST /api/users" → Must be defined in architecture or epic
   - "Use Zod for validation" → Must be specified in technical preferences

2. **Architecture alignment check**:
   - For each Dev Notes statement about architecture:
     - Cross-reference with architecture documents
     - Verify claimed patterns actually exist
     - Verify claimed libraries are actually used
     - Verify claimed structures actually exist
   - Flag any architectural claims that contradict source docs

3. **No invented details check**:
   - Watch for specificity that exceeds source material:
     - Specific function names not mentioned in sources
     - Specific data structures not defined in sources
     - Specific API shapes not specified in sources
     - Specific implementation approaches not chosen in sources
   - Flag details that appear to be invented by story creator

4. **Reference accuracy verification**:
   - For all source references in story:
     - Verify file paths are correct
     - Verify section references are accurate
     - Verify quoted content matches source
     - Verify links/references are accessible
   - Flag broken or inaccurate references

5. **Fact checking**:
   - Cross-reference key claims:
     - Epic → Story requirements alignment
     - Architecture → Dev Notes alignment
     - Technical Preferences → Implementation approach alignment
   - Verify consistency across documents
   - Flag contradictions or inconsistencies

**Validation Output**:
```
Anti-Hallucination Findings:
- Unverifiable technical claims: [list with specific claims and missing sources]
- Missing source references for: [list of claims needing sources]
- Inconsistencies with architecture documents: [list with details]
- Invented libraries/patterns/standards: [list]
- Broken or inaccurate references: [list]
- Contradictions between documents: [list]
```

**Severity**: All anti-hallucination findings are **CRITICAL** issues that block implementation.

---

### Step 9: Dev Agent Implementation Readiness

**Purpose**: Final assessment - Can a Dev agent successfully implement this story without reading external documents?

**Philosophy**: The story should be **self-contained**. The Dev agent should not need to consult epics, architecture docs, or other references during implementation.

**Actions**:

1. **Self-contained context check**:
   - Does **Dev Notes** contain all necessary technical context?
   - Are all required patterns/examples included?
   - Are all API contracts/interfaces specified?
   - Are all external dependencies documented?
   - Can Dev agent implement without reading epic/architecture?

   **Test**: Remove all external documents. Is story still implementable?

2. **Clear instructions verification**:
   - Are implementation steps unambiguous?
   - Are edge cases and error handling described?
   - Are integration points clearly specified?
   - Is success criteria clear for each task?
   - Are no steps left to "figure out"?

3. **Complete technical context check**:
   - Are all required technical details in **Dev Notes**?
     - File paths and structure
     - Function signatures and interfaces
     - Data models and schemas
     - API endpoints and contracts
     - Libraries and utilities to use
     - Patterns and conventions to follow
   - Flag any missing technical context

4. **Missing information identification**:
   - What questions would Dev agent have?
   - What decisions are left unmade?
   - What information gaps exist?
   - What would cause Dev agent to ask for clarification?
   - List all critical missing information

5. **Actionability assessment**:
   - For each task in **Tasks/Subtasks**:
     - Is it immediately actionable?
     - Does Dev agent know exactly what to do?
     - Are success criteria clear?
     - Can task be completed without questions?
   - Flag tasks that require clarification or external research

**Validation Output**:
```
Implementation Readiness Issues:
- Missing technical context in Dev Notes: [list]
- Ambiguous instructions: [list with task references]
- Information gaps that would block Dev agent: [list]
- Tasks requiring external research/clarification: [list]
- Unclear success criteria: [list]
```

**Readiness Assessment**:
```
Implementation Readiness Score: [1-10]
- 9-10: Excellent - Dev agent can implement immediately
- 7-8: Good - Minor clarifications needed
- 5-6: Fair - Moderate information gaps exist
- 3-4: Poor - Significant missing information
- 1-2: Blocked - Cannot implement without major rework

Confidence Level for Successful Implementation: [High/Medium/Low]
```

---

### Step 10: Generate Validation Report

**Purpose**: Synthesize all validation findings into a structured, actionable report with clear prioritization.

**Report Structure**:

```markdown
# Story Validation Report

**Story**: {epic}.{story} - {title}
**Validation Date**: {date}
**Validator**: PO Agent (Sarah) or Dev Agent (James)

---

## Executive Summary

{1-2 paragraph summary of overall story quality and key issues}

---

## Template Compliance Issues

### Missing Sections from story-tmpl.yaml
{List all missing required/optional sections}

### Unfilled Placeholders or Template Variables
{List all unfilled placeholders with locations}

### Structural Formatting Issues
{List any structure/formatting problems}

---

## Critical Issues (Must Fix - Story Blocked)

**Definition**: Issues that prevent implementation or cause incorrect implementation.

{Numbered list of critical issues with details:}
1. **Issue**: {description}
   - **Location**: {section/line}
   - **Impact**: {why this blocks implementation}
   - **Fix**: {what needs to be done}

**Critical Issue Count**: {count}
**Implementation Status**: ❌ BLOCKED (if any critical issues exist)

---

## Should-Fix Issues (Important Quality Improvements)

**Definition**: Issues that would improve implementation quality, reduce risk, or improve efficiency.

{Numbered list of should-fix issues with details:}
1. **Issue**: {description}
   - **Location**: {section/line}
   - **Impact**: {why this matters}
   - **Fix**: {what should be done}

**Should-Fix Issue Count**: {count}

---

## Nice-to-Have Improvements (Optional Enhancements)

**Definition**: Issues that would be good to fix but don't significantly impact implementation.

{Numbered list of nice-to-have improvements with details:}
1. **Improvement**: {description}
   - **Benefit**: {how this would help}

**Nice-to-Have Count**: {count}

---

## Anti-Hallucination Findings

**Definition**: Technical claims not traceable to source documents (CRITICAL).

{Detailed list of hallucination findings:}
1. **Claim**: {the specific claim made in story}
   - **Location**: {section/line in story}
   - **Source Check**: {whether found in epic/architecture/tech-prefs}
   - **Verdict**: {Verified / Unverifiable / Contradicts Source}
   - **Action**: {what needs to be done}

**Hallucination Issues**: {count}
**Source Traceability**: {percentage of claims verified}%

---

## Validation Dimension Scores

| Dimension | Score | Status |
|-----------|-------|--------|
| Template Compliance | {1-10} | {✅ Pass / ⚠️ Issues / ❌ Fail} |
| File Structure Accuracy | {1-10} | {✅ Pass / ⚠️ Issues / ❌ Fail} |
| UI/Frontend Completeness | {1-10 or N/A} | {✅ Pass / ⚠️ Issues / ❌ Fail / N/A} |
| Acceptance Criteria Coverage | {1-10} | {✅ Pass / ⚠️ Issues / ❌ Fail} |
| Testing Instructions Clarity | {1-10} | {✅ Pass / ⚠️ Issues / ❌ Fail} |
| Security Considerations | {1-10 or N/A} | {✅ Pass / ⚠️ Issues / ❌ Fail / N/A} |
| Task Sequence Logic | {1-10} | {✅ Pass / ⚠️ Issues / ❌ Fail} |
| Anti-Hallucination (Source Traceability) | {1-10} | {✅ Pass / ⚠️ Issues / ❌ Fail} |
| Implementation Readiness | {1-10} | {✅ Pass / ⚠️ Issues / ❌ Fail} |

**Overall Quality Score**: {weighted average} / 10

---

## Final Assessment

### Implementation Readiness Score
**{score}/10** - {Excellent / Good / Fair / Poor / Blocked}

### Confidence Level
**{High / Medium / Low}** confidence for successful implementation

{Explanation of confidence level based on findings}

### GO / NO-GO Decision

**Decision**: {🟢 GO / 🔴 NO-GO}

**Rationale**:
{Clear explanation of decision based on:}
- Critical issues blocking implementation (if any)
- Anti-hallucination findings (if any)
- Overall story quality and completeness
- Risk assessment for proceeding

**Conditions for GO** (if currently NO-GO):
1. {Specific fixes required}
2. {Specific fixes required}
...

---

## Recommended Actions

### Immediate Actions (Before Implementation)
1. {Action item}
2. {Action item}
...

### Before Next Story (Process Improvements)
1. {Process improvement suggestion}
2. {Process improvement suggestion}
...

---

## Validation Metadata

- **Validation Method**: Automated task execution (validate-next-story)
- **Validator Agent**: {PO/Dev agent}
- **Total Issues Found**: {count}
  - Critical: {count}
  - Should-Fix: {count}
  - Nice-to-Have: {count}
- **Validation Duration**: {estimated time}
- **Re-validation Required**: {Yes/No - if story is fixed}

---

**Report Generated**: {timestamp}
**BMad Framework Version**: v4
```

---

## 4. Output Specifications

### Output Format
**Primary Output**: Markdown validation report (displayed to user, not written to file by default)

### Output Location
**Default**: Report is displayed in console/chat (ephemeral)
**Optional**: Can be written to file if PO agent chooses to preserve it
**Suggested location** (if written):
```
{devStoryLocation}/{epic}.{story}.{slug}.validation-report.md
```
Or:
```
{qa.qaLocation}/validations/{epic}.{story}.{slug}.validation.md
```

### Report Artifacts

1. **Validation Report** (markdown):
   - Template compliance findings
   - Critical/Should-Fix/Nice-to-Have issues
   - Anti-hallucination findings
   - Dimension scores
   - GO/NO-GO decision
   - Recommended actions

2. **No persistent file by default** - Report is interactive/ephemeral
3. **PO may choose to write report** for documentation purposes

### Report Sections (in order)

1. **Executive Summary** - 1-2 paragraphs
2. **Template Compliance Issues** - Missing sections, placeholders, structure
3. **Critical Issues** - Must-fix blockers
4. **Should-Fix Issues** - Important improvements
5. **Nice-to-Have Improvements** - Optional enhancements
6. **Anti-Hallucination Findings** - Source traceability issues
7. **Validation Dimension Scores** - Table with scores
8. **Final Assessment** - Readiness score, confidence, GO/NO-GO
9. **Recommended Actions** - Immediate and process improvements
10. **Validation Metadata** - Report details

---

## 5. Decision Points & Branching Logic

### Decision Point 1: core-config.yaml Exists?

```
IF core-config.yaml NOT found:
  HALT with error: "core-config.yaml not found. This file is required for story validation."
ELSE:
  CONTINUE to configuration loading
```

### Decision Point 2: Story File Found?

```
IF story_file provided by user:
  Load story_file
ELSE IF story_id provided:
  Discover story in devStoryLocation
ELSE:
  Request user to provide story path

IF story_file cannot be loaded:
  HALT with error: "Story file not found at {path}"
```

### Decision Point 3: Frontend Story Detection

```
IF story contains frontend indicators:
  - Title contains: "UI", "Frontend", "Component", "Page", "Form"
  - Tasks mention: React, Vue, Angular, etc.
  - Story type: "frontend" or "fullstack"
THEN:
  Execute Step 3 (UI/Frontend Completeness Validation)
ELSE:
  Skip Step 3, report "Not applicable (backend/infrastructure story)"
```

### Decision Point 4: Security-Sensitive Story Detection

```
IF story involves security areas:
  - Authentication, authorization, access control
  - Sensitive data handling (PII, credentials, payment)
  - Security-related files (auth, security, middleware)
  - API endpoints or external integrations
THEN:
  Execute Step 6 (Security Considerations Assessment)
ELSE:
  Skip Step 6, report "Not applicable (no security-sensitive areas)"
```

### Decision Point 5: Critical Issues Found?

```
IF critical_issues_count > 0:
  recommendation = "NO-GO"
  rationale = "Story has {count} critical issues that block implementation"
ELSE IF hallucination_issues_count > 0:
  recommendation = "NO-GO"
  rationale = "Story contains {count} unverifiable technical claims (hallucinations)"
ELSE IF implementation_readiness_score < 5:
  recommendation = "NO-GO"
  rationale = "Implementation readiness score too low ({score}/10)"
ELSE IF should_fix_issues_count > 5:
  recommendation = "GO WITH CAUTION"
  rationale = "Story passable but has {count} quality issues"
ELSE:
  recommendation = "GO"
  rationale = "Story meets quality standards for implementation"
```

### Decision Point 6: Dimension Scoring

```
FOR each validation dimension:
  IF no issues found:
    score = 10
    status = "✅ Pass"
  ELSE IF only nice-to-have issues:
    score = 8-9
    status = "✅ Pass"
  ELSE IF should-fix issues exist:
    score = 6-7
    status = "⚠️ Issues"
  ELSE IF critical issues exist:
    score = 1-5
    status = "❌ Fail"
```

### Decision Point 7: Write Report to File?

```
IF PO agent decides to preserve validation report:
  Write report to {qa.qaLocation}/validations/{epic}.{story}.{slug}.validation.md
ELSE:
  Display report in console only (default behavior)
```

---

## 6. User Interaction Points

### Interaction Pattern: Command Execution

**Primary Interaction**: User (or PO agent) invokes validation task

```bash
# PO Agent command:
*validate-story-draft {story_path}

# Or with story ID:
*validate-story-draft 1.3

# Or without argument (validate latest story):
*validate-story-draft
```

### Minimal User Interaction

**Philosophy**: This task is designed to be **fully automated** with **no user interaction** during execution.

**No elicitation steps** - Task runs end-to-end without pausing for user input.

### User Input Required (Pre-Execution)

1. **Story to validate**:
   - **Prompt**: "Which story should I validate?"
   - **Options**:
     - Provide specific path: `path/to/story.md`
     - Provide story ID: `1.3`
     - Auto-discover latest story (if clear)

### User Feedback (Post-Execution)

**After validation completes**:

1. **Present validation report** (full markdown report)

2. **Ask user for next action** (if NO-GO):
   - **Prompt**: "Story validation found {count} critical issues. Would you like me to:"
   - **Options**:
     - Fix issues and re-validate
     - Review critical issues with you
     - Write validation report to file for review
     - Cancel validation and return to story editing

3. **Ask user for next action** (if GO):
   - **Prompt**: "Story validation passed! Would you like me to:"
   - **Options**:
     - Proceed to implementation (Dev agent)
     - Write validation report to file
     - Review should-fix issues for improvements
     - Return to story management

---

## 7. Error Handling & Validation

### Error Handling Strategy: Fail Gracefully with Clear Messages

### Error Scenario 1: Missing core-config.yaml

**Trigger**: File `.bmad-core/core-config.yaml` not found

**Response**:
```
❌ ERROR: core-config.yaml not found

Story validation requires core-config.yaml to locate:
- Story files (devStoryLocation)
- Epic files (prd.*)
- Architecture documents (architecture.*)
- Story template (templatesLocation)

Please ensure .bmad-core/core-config.yaml exists and is properly configured.
```

**Recovery**: HALT - User must provide core-config.yaml

---

### Error Scenario 2: Story File Not Found

**Trigger**: Provided story path does not exist or cannot be read

**Response**:
```
❌ ERROR: Story file not found

Attempted to load: {provided_path}

Please provide:
- Full path to story file, OR
- Story ID (e.g., 1.3) to search in devStoryLocation

Available stories in {devStoryLocation}:
- 1.1-user-authentication.md
- 1.2-user-profile.md
- 1.3-password-reset.md
```

**Recovery**: Request correct story path from user

---

### Error Scenario 3: Story Template Not Found

**Trigger**: File `.bmad-core/templates/story-tmpl.yaml` not found

**Response**:
```
❌ ERROR: Story template not found

Cannot validate story structure without template file.

Expected location: .bmad-core/templates/story-tmpl.yaml

Please ensure story-tmpl.yaml exists in the templates directory.
```

**Recovery**: HALT - Template is required for validation

---

### Error Scenario 4: Parent Epic Not Found

**Trigger**: Epic file referenced in story cannot be located

**Response**:
```
⚠️ WARNING: Parent epic not found

Story references epic {epic_num}, but epic file not found at:
- {prd.shardedLocation}/epic-{epic_num}.md (if v4)
- {prd.docFilePath} (if v3)

Impact: Cannot perform anti-hallucination verification against epic requirements.

Validation will continue but anti-hallucination findings may be incomplete.
```

**Recovery**: CONTINUE - Flag as validation issue but don't halt

---

### Error Scenario 5: Architecture Documents Not Found

**Trigger**: Architecture files referenced in core-config.yaml cannot be located

**Response**:
```
⚠️ WARNING: Architecture documents not found

Story validation expects architecture docs at:
- {architecture.shardedLocation}/*.md (if v4)
- {architecture.docFilePath} (if v3)

Impact: Cannot verify Dev Notes claims against architecture specifications.

Validation will continue but anti-hallucination findings may be incomplete.
```

**Recovery**: CONTINUE - Flag as validation issue but don't halt

---

### Error Scenario 6: Malformed Story File

**Trigger**: Story markdown file cannot be parsed (invalid format, corrupted)

**Response**:
```
❌ ERROR: Story file is malformed

File: {story_path}

Parsing error: {error_details}

Common issues:
- Invalid YAML frontmatter
- Malformed markdown structure
- Corrupted file encoding

Please verify story file is valid markdown.
```

**Recovery**: HALT - Cannot validate malformed file

---

### Error Scenario 7: Story Template Malformed

**Trigger**: Story template YAML cannot be parsed

**Response**:
```
❌ ERROR: Story template is malformed

File: .bmad-core/templates/story-tmpl.yaml

Parsing error: {error_details}

Cannot validate story structure without valid template.

Please verify story-tmpl.yaml is valid YAML.
```

**Recovery**: HALT - Template is required for validation

---

### Validation Rules

1. **Required file validation**:
   - core-config.yaml: REQUIRED (halt if missing)
   - story-tmpl.yaml: REQUIRED (halt if missing)
   - Story file: REQUIRED (halt if missing)
   - Epic file: OPTIONAL (warn if missing, continue)
   - Architecture docs: OPTIONAL (warn if missing, continue)

2. **File format validation**:
   - All markdown files must be parseable
   - All YAML files must be valid YAML
   - Story must have H1 heading
   - Story must have section structure

3. **Content validation**:
   - No empty required sections
   - No unfilled placeholders
   - All source references must be verifiable
   - All file paths must follow conventions

4. **Traceability validation**:
   - Every technical claim should have source
   - Source references should be accurate
   - No contradictions between story and sources

---

## 8. Integration Points

### Integration with Other Tasks

#### Upstream Tasks (Provide Inputs)

1. **create-next-story.md** (SM Agent):
   - **Output**: Drafted story file
   - **Input to validation**: Story file to validate
   - **Relationship**: Primary story creator → validator

2. **execute-checklist.md** (SM Agent with story-draft-checklist):
   - **Output**: Checklist results indicating story draft quality
   - **Input to validation**: Indication that story draft is ready for validation
   - **Relationship**: Self-check → formal validation

#### Downstream Tasks (Consume Outputs)

1. **Story Implementation** (Dev Agent):
   - **Input**: GO/NO-GO validation decision
   - **Dependency**: Story should pass validation before implementation begins
   - **Relationship**: Validation gates implementation

2. **Story Correction** (SM Agent):
   - **Input**: Validation report with critical issues
   - **Action**: SM fixes identified issues and re-runs validation
   - **Relationship**: Validation findings → story improvement → re-validation

#### Parallel Tasks (No Direct Dependency)

1. **review-story.md** (QA Agent):
   - **Timing**: Occurs AFTER implementation (post-implementation review)
   - **Contrast**: validate-next-story is PRE-implementation validation
   - **Relationship**: Complementary quality gates (before/after implementation)

---

### Integration with Agents

#### PO Agent (Sarah) - Primary User

**Commands**:
```
*validate-story-draft {story}
```

**Usage Context**:
- PO validates story drafts before approving for implementation
- PO runs validation after SM creates story
- PO may re-validate after SM fixes validation issues
- PO decides whether to accept GO/NO-GO recommendation

**PO Responsibilities**:
- Interpret validation findings
- Decide whether to require fixes or accept risks
- Communicate issues to SM for correction
- Gate story approval based on validation results

---

#### Dev Agent (James) - Secondary User

**Commands**:
```
*validate-next-story (implicitly through task loading)
```

**Usage Context**:
- Dev may self-validate story before beginning implementation
- Dev uses validation to identify missing information proactively
- Dev may request PO validation if story seems incomplete

**Dev Responsibilities**:
- Review validation report if self-validating
- Flag validation concerns to PO if story seems problematic
- Proceed with implementation only if validation passes

---

#### SM Agent (Bob) - Story Creator (Indirect User)

**Usage Context**:
- SM creates story drafts that will be validated
- SM receives validation findings and fixes issues
- SM may run story-draft-checklist (self-validation) before PO validation

**SM Responsibilities**:
- Address validation issues found by PO
- Improve story quality to pass validation
- Learn from validation patterns to improve future stories

---

### Integration with Workflows

#### Greenfield Development Workflow

**Story Creation → Validation → Implementation Sequence**:

```
1. SM Agent: create-next-story
   ↓ (produces story draft)

2. SM Agent: execute-checklist (story-draft-checklist)
   ↓ (self-validation)

3. PO Agent: validate-next-story  ← THIS TASK
   ↓ (formal validation)

   IF validation = NO-GO:
     → SM Agent: Fix issues
     → PO Agent: validate-next-story (re-validate)
     → Loop until GO

4. PO Agent: Approve story
   ↓

5. Dev Agent: Implement story
   ↓

6. QA Agent: review-story (post-implementation validation)
```

**Integration Points**:
- **After**: create-next-story, execute-checklist (story-draft-checklist)
- **Before**: Story approval, Dev implementation
- **Parallel**: None (validation is sequential gate)

---

#### Brownfield Development Workflow

**Similar to greenfield**, but story creation may use:
- brownfield-create-story.md
- brownfield-create-epic.md

**Validation task remains the same** - validates any story regardless of creation method.

---

### Integration with Configuration

#### core-config.yaml Dependencies

**Required Configuration Paths**:
```yaml
devStoryLocation: 'stories/dev'
prd:
  baseLocation: 'docs/prd'
  shardedLocation: 'docs/prd/epics'
  docFilePath: 'docs/prd/PRD.md'
architecture:
  baseLocation: 'docs/architecture'
  shardedLocation: 'docs/architecture/sections'
  docFilePath: 'docs/architecture/Architecture.md'
templatesLocation: '.bmad-core/templates'
qa:
  qaLocation: 'docs/qa'
technicalPreferences: 'docs/technical-preferences.md'
```

**Validation Task Uses**:
- `devStoryLocation`: Locate story files
- `prd.*`: Locate parent epic for anti-hallucination verification
- `architecture.*`: Locate architecture docs for anti-hallucination verification
- `templatesLocation`: Locate story-tmpl.yaml for structure validation
- `qa.qaLocation`: Optional location for writing validation reports
- `technicalPreferences`: Verify technical decisions against preferences

---

## 9. Template & Data Dependencies

### Template Dependencies

#### Primary Template: story-tmpl.yaml

**Location**: `.bmad-core/templates/story-tmpl.yaml`

**Purpose**: Defines expected structure and sections for story validation

**Usage in Task**:
- **Step 1**: Load template to extract section definitions
- **Step 1**: Compare story sections against template sections
- **Step 1**: Identify missing required/optional sections
- **Step 1**: Validate story structure matches template

**Critical for**:
- Template completeness validation
- Missing section detection
- Structure compliance verification

**Template Structure Expected** (example):
```yaml
metadata:
  template_id: story-tmpl
  version: 4.0

sections:
  - id: title
    heading: "Story Title"
    type: text
    required: true

  - id: overview
    heading: "## Overview"
    type: text
    required: true

  - id: epic-context
    heading: "## Epic Context"
    type: text
    required: true

  - id: acceptance-criteria
    heading: "## Acceptance Criteria"
    type: list
    required: true

  - id: tasks
    heading: "## Tasks/Subtasks"
    type: list
    required: true

  - id: dev-notes
    heading: "## Dev Notes"
    type: text
    required: true
    agent_section: dev

  - id: validation-testing
    heading: "## Validation & Testing"
    type: text
    required: true

  - id: qa-results
    heading: "## QA Results"
    type: text
    required: false
    agent_section: qa

  - id: file-list
    heading: "## File List"
    type: list
    required: false
    agent_section: dev

  - id: dev-agent-record
    heading: "## Dev Agent Record"
    type: text
    required: false
    agent_section: dev
```

---

### Data Dependencies

#### Story File (Primary Input)

**Format**: Markdown with frontmatter (optional)

**Required Structure**:
```markdown
# Story Title

## Overview
{Story description}

## Epic Context
{Parent epic reference and requirements}

## Acceptance Criteria
1. AC 1
2. AC 2
...

## Tasks/Subtasks
1. Task 1
2. Task 2
...

## Dev Notes
{Technical context for implementation}

## Validation & Testing
{Testing approach and validation steps}

## QA Results
{Placeholder for QA agent - initially empty}

## File List
{Placeholder for Dev agent - initially empty}

## Dev Agent Record
{Placeholder for Dev agent - initially empty}
```

---

#### Parent Epic File (Optional Input)

**Purpose**: Verify story requirements trace to epic

**Location** (v4 sharded):
```
{prd.shardedLocation}/epic-{epic_num}.md
```

**Location** (v3 monolithic):
```
{prd.docFilePath}
```
(Extract epic section from monolithic PRD)

**Usage in Task**:
- **Step 8**: Anti-hallucination verification (verify requirements match epic)
- **Step 4**: AC coverage validation (ensure ACs satisfy epic requirements)

**Optional Dependency**: If not found, validation continues with warning

---

#### Architecture Documents (Optional Input)

**Purpose**: Verify technical claims in Dev Notes match architecture decisions

**Location** (v4 sharded):
```
{architecture.shardedLocation}/*.md
```

**Location** (v3 monolithic):
```
{architecture.docFilePath}
```

**Usage in Task**:
- **Step 8**: Anti-hallucination verification (verify technical decisions match architecture)
- **Step 2**: File structure validation (verify paths match architecture structure)

**Optional Dependency**: If not found, validation continues with warning

---

#### Technical Preferences File (Optional Input)

**Location**: `{technicalPreferences}` from core-config.yaml

**Purpose**: Verify implementation approach matches technical standards

**Usage in Task**:
- **Step 8**: Anti-hallucination verification (verify libraries/patterns match preferences)

**Optional Dependency**: If not found, validation continues without this check

---

### No Output Files by Default

**Validation report is ephemeral** (displayed in console only)

**Optional Output** (if PO chooses):
- Write validation report to file for documentation
- Suggested location: `{qa.qaLocation}/validations/{epic}.{story}.{slug}.validation.md`

---

## 10. Configuration References

### Configuration Schema (from core-config.yaml)

```yaml
# Story Location Configuration
devStoryLocation: 'stories/dev'         # REQUIRED for validation

# PRD Configuration (for epic lookup)
prd:
  baseLocation: 'docs/prd'
  shardedLocation: 'docs/prd/epics'     # v4+ architecture
  docFilePath: 'docs/prd/PRD.md'        # v3 architecture

# Architecture Configuration (for anti-hallucination verification)
architecture:
  baseLocation: 'docs/architecture'
  shardedLocation: 'docs/architecture/sections'  # v4+ architecture
  docFilePath: 'docs/architecture/Architecture.md'  # v3 architecture

# Templates Configuration (for story template)
templatesLocation: '.bmad-core/templates'  # REQUIRED for validation

# QA Configuration (for optional report writing)
qa:
  qaLocation: 'docs/qa'

# Technical Preferences (for standards verification)
technicalPreferences: 'docs/technical-preferences.md'
```

### Configuration Usage in Task

**Step 0: Configuration Loading**
- Load entire core-config.yaml
- Extract all paths above
- Validate required paths exist

**Step 1: Template Loading**
```yaml
Template Path: {templatesLocation}/story-tmpl.yaml
```

**Step 2: Story Loading**
```yaml
Story Path Options:
  1. User-provided path (direct)
  2. {devStoryLocation}/{epic}.{story}.*.md (auto-discovery)
```

**Step 8: Source Document Loading**
```yaml
Epic Path (v4): {prd.shardedLocation}/epic-{epic_num}.md
Epic Path (v3): {prd.docFilePath} (extract section)

Architecture Path (v4): {architecture.shardedLocation}/*.md
Architecture Path (v3): {architecture.docFilePath}

Tech Prefs Path: {technicalPreferences}
```

**Step 10: Optional Report Writing**
```yaml
Report Path: {qa.qaLocation}/validations/{epic}.{story}.{slug}.validation.md
```

---

### Configuration Validation

**Required Paths** (task halts if missing):
- `devStoryLocation`
- `templatesLocation`

**Optional Paths** (task warns if missing, continues):
- `prd.shardedLocation` or `prd.docFilePath`
- `architecture.shardedLocation` or `architecture.docFilePath`
- `technicalPreferences`
- `qa.qaLocation`

**Path Resolution**:
- All paths are relative to project root
- Paths support both relative and absolute formats
- Task resolves paths from working directory

---

## 11. Edge Cases & Considerations

### Edge Case 1: Story Created Without SM Agent

**Scenario**: Human manually creates story file without using create-next-story task

**Impact**:
- Story may not follow template structure
- Story may have different section names/ordering
- Anti-hallucination verification may be impossible (no source citations)

**Handling**:
- Template compliance validation will flag missing sections
- Anti-hallucination check will flag unverifiable claims
- Validation likely results in NO-GO with critical issues

**Recommendation**: Use create-next-story for all stories to ensure template compliance

---

### Edge Case 2: V3 vs V4 Architecture Format

**Scenario**: Project uses v3 (monolithic) architecture instead of v4 (sharded)

**Impact**:
- Configuration paths differ (docFilePath vs shardedLocation)
- Document parsing logic differs (extract sections vs read files)

**Handling**:
- Task checks both v4 and v3 paths
- If `shardedLocation` exists, use v4 path
- If `docFilePath` exists, use v3 path (extract sections)
- Task adapts to project architecture version

**Configuration Detection**:
```yaml
IF architecture.shardedLocation exists:
  Use v4 path: {shardedLocation}/*.md
ELSE IF architecture.docFilePath exists:
  Use v3 path: {docFilePath} (extract sections)
ELSE:
  Warn: Architecture documents not found
```

---

### Edge Case 3: Story Has No Parent Epic

**Scenario**: Story is created for new feature with no existing epic (rare)

**Impact**:
- Anti-hallucination verification cannot check requirements against epic
- AC coverage validation cannot verify against epic requirements

**Handling**:
- Validation continues with warning
- Anti-hallucination findings note: "No parent epic available for verification"
- Validation score may be lower due to missing traceability

**Recommendation**: Create epic first, then stories from epic

---

### Edge Case 4: Story References External APIs Not in Architecture

**Scenario**: Story implements integration with external service not documented in architecture

**Impact**:
- Anti-hallucination check flags API endpoints/contracts as unverifiable
- Dev Notes contain integration details with no source

**Handling**:
- Flag as anti-hallucination issue: "External API integration not found in architecture docs"
- Suggest: "Update architecture to document external integration before implementing"
- Validation likely results in NO-GO

**Recommendation**: Update architecture documents first to document external integrations

---

### Edge Case 5: Story Fixes Bug (No Epic)

**Scenario**: Story addresses bug fix with no corresponding epic requirement

**Impact**:
- No parent epic to validate against
- AC coverage validation has no epic requirements to check

**Handling**:
- Validation adapts: Skip epic traceability checks
- Focus on: Task completeness, testing, implementation readiness
- Anti-hallucination check focuses on architecture alignment only

**Configuration**: Story metadata may indicate `type: bugfix` to skip epic checks

---

### Edge Case 6: Security-Sensitive Story with No Security Section

**Scenario**: Story involves authentication/authorization but has no security considerations documented

**Impact**:
- Security assessment finds missing requirements
- Critical issue: "Security-sensitive story missing security requirements"

**Handling**:
- Flag as critical issue (blocks implementation)
- Recommend: "Add security requirements section with auth/access control details"
- Validation results in NO-GO

**Prevention**: create-next-story should prompt for security considerations when auth/security keywords detected

---

### Edge Case 7: Frontend Story with No UI Specifications

**Scenario**: Story involves UI changes but Dev Notes lack component/design details

**Impact**:
- UI/frontend completeness validation finds gaps
- Critical issue: "Frontend story missing component specifications"

**Handling**:
- Flag as critical issue (blocks implementation)
- List specific missing details: component structure, styling, interactions
- Validation results in NO-GO

**Recommendation**: Use UX Expert agent for frontend specifications before SM creates story

---

### Edge Case 8: Story Tasks Reference Files That Don't Exist Yet

**Scenario**: Tasks say "Update existing UserService.ts" but file doesn't exist in project

**Impact**:
- File structure validation cannot verify file existence
- Anti-hallucination check flags claim as unverifiable

**Handling**:
- If architecture shows file WILL be created by prior story: Flag as warning (verify dependency)
- If architecture doesn't mention file: Flag as critical issue (hallucinated file)
- Recommend: "Verify UserService.ts exists or will be created by prior story"

**Prevention**: Dev Notes should clarify file creation sequence and dependencies

---

### Edge Case 9: Story Template Has Been Updated

**Scenario**: story-tmpl.yaml version is newer than story was created with

**Impact**:
- Template may have new required sections
- Story may be missing newly required sections

**Handling**:
- Validation uses CURRENT template version
- Story may fail validation due to missing new sections
- Recommend: "Story needs updating to match current template v{version}"

**Prevention**: Re-validate old stories when template is updated

---

### Edge Case 10: Validation Run Multiple Times on Same Story

**Scenario**: PO validates, SM fixes issues, PO re-validates (iteration loop)

**Impact**:
- No special handling needed (validation is idempotent)
- Each validation run produces new report

**Handling**:
- Validation report shows iteration: "Validation #{count} for story {id}"
- Report compares against previous validation (if available):
  - "Previous validation: {count} critical issues"
  - "Current validation: {count} critical issues"
  - "Improvement: {delta} issues resolved"

**Optimization**: Track validation history to show improvement trends

---

### Edge Case 11: Story Passes Validation but Fails Implementation

**Scenario**: Story validated as GO, but Dev agent encounters issues during implementation

**Impact**:
- Validation doesn't guarantee implementation success
- Story may have unforeseen gaps validation didn't catch

**Handling**:
- Dev agent escalates issues to PO
- PO may invalidate story (change status back to draft)
- SM updates story to address implementation gaps
- Re-validation before continuing

**Learning**: Analyze why validation didn't catch issue, improve validation logic

---

### Edge Case 12: Validation Disagreement Between PO and Dev

**Scenario**: PO validates as GO, but Dev agent finds story incomplete

**Impact**:
- Validation decision conflict
- Story may need additional review

**Handling**:
- Dev agent escalates concerns to PO with specifics
- PO re-reviews story with Dev's feedback
- Consensus decision: Either fix story or proceed with acknowledged risks

**Prevention**: Dev agent can self-validate before beginning implementation

---

## 12. Performance Considerations

### Execution Time

**Estimated Duration**: 2-5 minutes per story validation

**Time Breakdown**:
- Step 0 (Configuration loading): 5-10 seconds
- Step 1 (Template compliance): 10-20 seconds
- Step 2 (File structure): 10-20 seconds
- Step 3 (UI completeness): 15-30 seconds (if applicable)
- Step 4 (AC satisfaction): 15-30 seconds
- Step 5 (Testing instructions): 10-20 seconds
- Step 6 (Security considerations): 15-30 seconds (if applicable)
- Step 7 (Task sequence): 10-20 seconds
- Step 8 (Anti-hallucination): 30-60 seconds (most time-intensive)
- Step 9 (Implementation readiness): 20-40 seconds
- Step 10 (Report generation): 10-20 seconds

**Factors Affecting Duration**:
- Story size (larger stories take longer)
- Number of source documents to verify (anti-hallucination step)
- Complexity of validation findings (more issues = longer reporting)
- Architecture format (v4 sharded = faster, v3 monolithic = slower parsing)

---

### Optimization Strategies

#### 1. Parallel Validation Dimensions

**Strategy**: Execute independent validation steps in parallel

**Implementation**:
```
Steps 1-7 can run in parallel (no dependencies):
- Template compliance (Step 1)
- File structure (Step 2)
- UI completeness (Step 3)
- AC satisfaction (Step 4)
- Testing instructions (Step 5)
- Security considerations (Step 6)
- Task sequence (Step 7)

Steps 8-9 run sequentially after 1-7 (depend on findings)
```

**Benefit**: Reduce execution time from 2-5 minutes to 1-3 minutes

---

#### 2. Caching Source Documents

**Strategy**: Load and parse source documents once, reuse across validation steps

**Implementation**:
```python
# Load once in Step 0
sources = {
  'story': load_story(story_path),
  'epic': load_epic(epic_path),
  'architecture': load_architecture(arch_path),
  'template': load_template(template_path),
  'tech_prefs': load_tech_prefs(prefs_path)
}

# Reuse in Steps 1-9
validate_template_compliance(sources['story'], sources['template'])
verify_anti_hallucination(sources['story'], sources['epic'], sources['architecture'])
```

**Benefit**: Eliminate redundant file I/O (save 20-30% execution time)

---

#### 3. Incremental Validation (Future Enhancement)

**Strategy**: Only re-validate sections that changed since last validation

**Implementation**:
- Store hash/checksum of each story section after validation
- On re-validation, compare checksums
- Only re-run validation for changed sections
- Reuse previous validation results for unchanged sections

**Benefit**: Re-validation runs much faster (5-10 seconds instead of 2-5 minutes)

**Requirement**: Persist validation state between runs

---

#### 4. Smart Anti-Hallucination Verification

**Strategy**: Prioritize verification of high-risk claims, skip obvious/low-risk claims

**Implementation**:
```python
# High-priority claims (always verify):
- Library/framework names
- API endpoints
- File paths
- Technical patterns

# Low-priority claims (skip or defer):
- Common knowledge (e.g., "React uses JSX")
- Generic descriptions (e.g., "implement user authentication")
```

**Benefit**: Reduce anti-hallucination step time from 30-60 seconds to 15-30 seconds

**Tradeoff**: Slightly reduced verification coverage

---

### Resource Usage

**Memory**: Low (< 100 MB)
- Load 5-10 markdown/YAML files (typical: 50-500 KB each)
- Parse and hold in memory during validation
- No heavy processing or large data structures

**CPU**: Low (< 5% CPU utilization)
- Text parsing and pattern matching (not compute-intensive)
- No image processing, compilation, or heavy computation

**I/O**: Low (5-10 file reads)
- Read core-config.yaml
- Read story file
- Read story template
- Read epic file (optional)
- Read architecture docs (optional, may be multiple files)
- Read technical preferences (optional)
- Write validation report (optional, 1 file write)

**Network**: None
- All validation is local file operations
- No API calls or remote data fetching

---

### Scalability Considerations

**Single Story Validation**: Scales well (2-5 minutes regardless of story size up to reasonable limits)

**Batch Validation** (future enhancement):
- Validate multiple stories in parallel
- Example: Validate all stories in epic (5-10 stories)
- Parallelization factor: N stories in ~2-5 minutes (not N × 2-5 minutes)

**Large Projects**:
- V4 sharded architecture scales better than v3 monolithic
- Reason: Sharded docs are smaller, faster to parse, only load relevant sections
- V3 monolithic requires parsing large documents (potentially slow for 1000+ page docs)

---

### Performance Monitoring

**Metrics to Track**:
- Validation execution time per story
- Time per validation step (identify bottlenecks)
- Number of source documents loaded
- Number of anti-hallucination checks performed
- Validation result distribution (GO vs NO-GO)

**Performance Alerts**:
- Validation taking > 10 minutes (investigate bottleneck)
- File loading failing (check file permissions/paths)
- High anti-hallucination failure rate (improve story creation process)

---

## 13. Security & Compliance

### Security Considerations for Validation Task

#### 1. File Access Security

**Concern**: Validation task reads multiple files (story, epic, architecture, template)

**Security Measures**:
- **Path validation**: Ensure all paths are within project directory (prevent directory traversal)
- **File permissions**: Respect file system permissions (don't bypass access controls)
- **Read-only access**: Validation task only reads files, never writes (except optional report)

**Path Validation Example**:
```python
def validate_path(path, base_dir):
    """Ensure path is within base directory (prevent directory traversal)."""
    resolved = os.path.realpath(path)
    if not resolved.startswith(os.path.realpath(base_dir)):
        raise SecurityError(f"Path {path} is outside project directory")
    return resolved
```

---

#### 2. Source Document Integrity

**Concern**: Validation relies on source documents (epic, architecture) to verify story claims

**Security Measures**:
- **Source verification**: Ensure source documents haven't been tampered with
- **Checksum validation** (optional): Verify file integrity using checksums
- **Version control**: Rely on git to track source document changes

**Integrity Check** (optional enhancement):
```python
# Verify source doc is committed in git (not uncommitted/modified)
if git_status(epic_path) == "modified":
    warn("Epic file has uncommitted changes - validation may be against stale version")
```

---

#### 3. Sensitive Data Handling

**Concern**: Story may contain sensitive information (credentials, PII, internal details)

**Security Measures**:
- **No external transmission**: Validation report stays local (no network calls)
- **Access control**: Validation report respects same permissions as story file
- **No logging of sensitive content**: Don't log story content to external services

**Sensitive Content Detection** (optional):
```python
# Warn if story contains potential secrets
if detect_secrets(story_content):
    warn("Story may contain sensitive information (credentials, API keys)")
```

---

#### 4. Validation Report Security

**Concern**: Validation report may be written to file (contains story details)

**Security Measures**:
- **Default: Ephemeral report**: Report displayed in console only (not written to disk)
- **Optional file write**: Only write report if PO explicitly chooses
- **File permissions**: Written report inherits permissions from parent directory
- **Location restrictions**: Report only written to configured `qa.qaLocation` (not arbitrary paths)

---

### Compliance Considerations

#### 1. Audit Trail

**Requirement**: Track validation decisions for compliance/audit purposes

**Implementation**:
- **Validation metadata**: Include timestamp, validator, validation version in report
- **Decision rationale**: Document why GO/NO-GO decision was made
- **Issue tracking**: Link validation findings to issue tracking system (future)

**Audit Information in Report**:
```markdown
## Validation Metadata
- **Validation Date**: 2025-10-14T15:30:00Z
- **Validator**: PO Agent (Sarah)
- **Validation Task Version**: v4.0
- **Decision**: NO-GO
- **Rationale**: Story has 3 critical issues preventing implementation
```

---

#### 2. Traceability Requirements

**Requirement**: Ensure all requirements are traceable from epic → story → implementation

**Validation Support**:
- **AC coverage validation** (Step 4): Verify all epic requirements addressed in story
- **Anti-hallucination verification** (Step 8): Verify all story claims trace to source
- **Traceability matrix**: Map ACs → Tasks → Source requirements

**Compliance Output**:
```markdown
## Traceability Matrix
| Epic Requirement | Story AC | Story Tasks | Coverage |
|------------------|----------|-------------|----------|
| REQ-1: User login | AC-1 | Task 1, 2 | ✅ Covered |
| REQ-2: Password reset | AC-2 | Task 3, 4 | ✅ Covered |
```

---

#### 3. Security Requirements Validation (Regulatory Compliance)

**Requirement**: For regulated industries (healthcare, finance), security requirements must be validated

**Validation Support**:
- **Security considerations assessment** (Step 6): Verify security requirements are addressed
- **Compliance checklist** (optional): Validate against industry standards (HIPAA, PCI-DSS, SOC2)

**Compliance Check** (optional enhancement):
```markdown
## Compliance Validation
- **HIPAA**: ✅ PHI encryption specified
- **PCI-DSS**: ⚠️ Payment data handling not addressed
- **SOC2**: ✅ Access control requirements specified
```

---

#### 4. Data Privacy Compliance (GDPR, CCPA)

**Requirement**: Ensure stories involving personal data comply with privacy regulations

**Validation Support**:
- **PII detection**: Flag stories that handle personal data
- **Privacy requirements check**: Verify data protection, retention, consent requirements
- **Right to erasure**: Verify data deletion capabilities are addressed

**Privacy Check** (optional enhancement):
```markdown
## Privacy Compliance
- **PII Handling**: Story involves user email addresses
- **Data Protection**: ⚠️ Encryption requirements not specified
- **Retention Policy**: ❌ Data retention period not defined
- **User Consent**: ✅ Consent mechanism specified
```

---

### Security Best Practices

1. **Principle of Least Privilege**:
   - Validation task runs with user's permissions (no privilege escalation)
   - Only reads files necessary for validation

2. **Input Validation**:
   - Validate all file paths (prevent directory traversal)
   - Validate YAML/markdown parsing (prevent malformed input attacks)

3. **No External Dependencies**:
   - Validation runs entirely locally (no network calls)
   - No external APIs or services involved

4. **Secure Defaults**:
   - Default behavior: Ephemeral report (not written to disk)
   - Optional file writing requires explicit action

---

## 14. Extensibility & Customization

### Extension Points

#### 1. Custom Validation Rules

**Use Case**: Add project-specific validation checks beyond standard 10 steps

**Extension Mechanism**:
```yaml
# core-config.yaml
validation:
  customRules:
    - id: custom-naming-convention
      description: "Verify file names follow project naming convention"
      script: .bmad-core/validation/custom-naming-check.js
```

**Implementation**:
- Step 11 (Custom Validation): Run custom validation scripts
- Custom scripts receive story context and return pass/fail with findings
- Custom findings integrated into validation report

---

#### 2. Validation Severity Customization

**Use Case**: Adjust severity of validation findings based on project needs

**Extension Mechanism**:
```yaml
# core-config.yaml
validation:
  severity:
    missingSecurityConsiderations: critical  # Default: should-fix
    missingTestScenarios: should-fix         # Default: nice-to-have
    unfocusedAcceptanceCriteria: nice-to-have  # Default: should-fix
```

**Implementation**:
- Load severity configuration in Step 0
- Apply custom severity when generating findings
- Adjust GO/NO-GO decision based on custom severities

---

#### 3. Validation Checklist Customization

**Use Case**: Add or remove validation dimensions based on project type

**Extension Mechanism**:
```yaml
# core-config.yaml
validation:
  enabledSteps:
    - template-compliance
    - file-structure
    - ac-satisfaction
    - testing-instructions
    - task-sequence
    - anti-hallucination
    - implementation-readiness
  disabledSteps:
    - ui-frontend-completeness  # Not applicable for backend-only project
    - security-considerations   # Handled by separate security review
```

**Implementation**:
- Load enabled/disabled steps in Step 0
- Skip disabled steps during validation
- Report only includes enabled dimensions

---

#### 4. Report Format Customization

**Use Case**: Customize validation report format for different audiences

**Extension Mechanism**:
```yaml
# core-config.yaml
validation:
  reportFormat: detailed  # Options: detailed, summary, json, html
  reportTemplate: .bmad-core/validation/custom-report-template.md
```

**Implementation**:
- Load report format preference in Step 0
- Generate report using specified template
- Support multiple output formats (markdown, JSON, HTML)

**Example JSON Output**:
```json
{
  "story_id": "1.3",
  "validation_date": "2025-10-14T15:30:00Z",
  "decision": "NO-GO",
  "critical_issues": 3,
  "should_fix_issues": 5,
  "nice_to_have": 2,
  "overall_score": 6.5,
  "confidence": "medium"
}
```

---

#### 5. Auto-Fix Capabilities (Future Enhancement)

**Use Case**: Automatically fix certain validation issues instead of just reporting them

**Extension Mechanism**:
```yaml
# core-config.yaml
validation:
  autoFix:
    enabled: true
    rules:
      - fillPlaceholders: true       # Auto-fill simple placeholders
      - fixTaskOrdering: true        # Auto-reorder tasks logically
      - addMissingSections: false    # Don't auto-add sections (requires content)
```

**Implementation**:
- After validation, offer to auto-fix certain issues
- Apply fixes to story file
- Re-validate to confirm fixes resolved issues

**Example Auto-Fixes**:
- Fill `{{EpicNum}}` placeholder with actual epic number
- Reorder tasks to follow logical sequence
- Add missing required sections (with `[TODO]` placeholders)

---

#### 6. Integration with External Tools

**Use Case**: Integrate validation with issue tracking, CI/CD, or other tools

**Extension Mechanism**:
```yaml
# core-config.yaml
validation:
  integrations:
    jira:
      enabled: true
      createIssueOnNoGo: true
      projectKey: "BMAD"
    slack:
      enabled: true
      notifyOnNoGo: true
      channel: "#dev-notifications"
```

**Implementation**:
- After validation completes, trigger integrations
- Create JIRA issues for critical findings
- Send Slack notifications for NO-GO decisions

---

### Customization Examples

#### Example 1: Strict Security Validation for Financial Project

```yaml
# core-config.yaml
validation:
  severity:
    missingSecurityConsiderations: critical  # Elevate to critical
  customRules:
    - id: pci-dss-compliance
      description: "Verify PCI-DSS requirements for payment handling"
      script: .bmad-core/validation/pci-dss-check.js
```

---

#### Example 2: Lightweight Validation for Internal Tools

```yaml
# core-config.yaml
validation:
  disabledSteps:
    - ui-frontend-completeness  # Backend-only project
    - security-considerations   # Low-risk internal tool
  severity:
    missingTestScenarios: nice-to-have  # Reduce severity
```

---

#### Example 3: Auto-Fix for Rapid Prototyping

```yaml
# core-config.yaml
validation:
  autoFix:
    enabled: true
    rules:
      - fillPlaceholders: true
      - fixTaskOrdering: true
      - addMissingSections: true  # Aggressive auto-fix
```

---

## 15. Testing Strategy

### Unit Testing

**Test Coverage**: Each validation step (1-10) should have unit tests

#### Test 1.1: Template Compliance - Missing Sections

**Test Case**:
```python
def test_template_compliance_missing_sections():
    story = load_test_story("missing_sections.md")
    template = load_test_template("story-tmpl.yaml")

    findings = validate_template_compliance(story, template)

    assert len(findings) == 2
    assert "Missing section: Dev Notes" in findings
    assert "Missing section: Validation & Testing" in findings
```

---

#### Test 1.2: Template Compliance - Unfilled Placeholders

**Test Case**:
```python
def test_template_compliance_unfilled_placeholders():
    story = load_test_story("unfilled_placeholders.md")
    template = load_test_template("story-tmpl.yaml")

    findings = validate_template_compliance(story, template)

    assert len(findings) > 0
    assert "Unfilled placeholder: {{EpicNum}}" in findings
```

---

#### Test 2: File Structure Validation

**Test Case**:
```python
def test_file_structure_unclear_paths():
    story = load_test_story("unclear_file_paths.md")

    findings = validate_file_structure(story)

    assert len(findings) > 0
    assert "Unclear file path in Task 3" in findings
```

---

#### Test 3: UI Completeness Validation (Frontend Story)

**Test Case**:
```python
def test_ui_completeness_frontend_story():
    story = load_test_story("frontend_story.md")

    is_frontend = detect_frontend_story(story)
    findings = validate_ui_completeness(story)

    assert is_frontend == True
    assert "Missing component specifications" in findings
```

---

#### Test 4: AC Satisfaction Assessment

**Test Case**:
```python
def test_ac_satisfaction_coverage_gap():
    story = load_test_story("ac_coverage_gap.md")

    findings = validate_ac_satisfaction(story)

    assert len(findings) > 0
    assert "AC-3 has no corresponding tasks" in findings
```

---

#### Test 8: Anti-Hallucination Verification

**Test Case**:
```python
def test_anti_hallucination_unverifiable_claim():
    story = load_test_story("hallucinated_library.md")
    epic = load_test_epic("epic-1.md")
    architecture = load_test_architecture("architecture.md")

    findings = verify_anti_hallucination(story, epic, architecture)

    assert len(findings) > 0
    assert "Unverifiable claim: Use FakeLibrary for state management" in findings
```

---

#### Test 9: Implementation Readiness

**Test Case**:
```python
def test_implementation_readiness_missing_context():
    story = load_test_story("missing_technical_context.md")

    score, findings = assess_implementation_readiness(story)

    assert score < 7  # Low readiness score
    assert "Missing API contract specifications" in findings
```

---

#### Test 10: Report Generation

**Test Case**:
```python
def test_report_generation_go_decision():
    validation_results = {
        'critical_issues': [],
        'should_fix_issues': [{'issue': 'Minor issue'}],
        'nice_to_have': [],
        'hallucination_issues': []
    }

    report = generate_validation_report(validation_results)

    assert "Decision: 🟢 GO" in report
    assert "1 should-fix issue" in report
```

---

### Integration Testing

**Test Coverage**: Full validation workflow end-to-end

#### Integration Test 1: Valid Story (GO Decision)

**Test Case**:
```python
def test_full_validation_valid_story():
    story_path = "test_data/valid_story.md"
    config_path = "test_data/core-config.yaml"

    result = run_validation(story_path, config_path)

    assert result['decision'] == 'GO'
    assert result['critical_issues'] == 0
    assert result['overall_score'] >= 8.0
```

---

#### Integration Test 2: Invalid Story (NO-GO Decision)

**Test Case**:
```python
def test_full_validation_invalid_story():
    story_path = "test_data/invalid_story.md"
    config_path = "test_data/core-config.yaml"

    result = run_validation(story_path, config_path)

    assert result['decision'] == 'NO-GO'
    assert result['critical_issues'] > 0
```

---

#### Integration Test 3: Validation with Missing Source Docs

**Test Case**:
```python
def test_validation_missing_source_docs():
    story_path = "test_data/story_with_missing_epic.md"
    config_path = "test_data/core-config-missing-epic.yaml"

    result = run_validation(story_path, config_path)

    assert "WARNING: Parent epic not found" in result['warnings']
    # Validation should continue despite missing epic
    assert result['decision'] in ['GO', 'NO-GO']
```

---

### Acceptance Testing

**Test Coverage**: User workflows and scenarios

#### Acceptance Test 1: PO Validates Story Before Approval

**Scenario**:
```gherkin
Given SM has created a story draft
When PO runs validate-story-draft command
Then PO receives a validation report with GO/NO-GO decision
And PO can approve story if validation passes
```

---

#### Acceptance Test 2: PO Validates Story, Finds Issues, SM Fixes, Re-Validates

**Scenario**:
```gherkin
Given SM has created a story draft
When PO runs validate-story-draft command
Then Validation finds 3 critical issues
And PO sends feedback to SM
When SM fixes the issues
And PO runs validate-story-draft again
Then Validation finds 0 critical issues
And Validation decision is GO
```

---

### Test Data

**Test Story Files** (needed for testing):
1. `valid_story.md` - Perfect story passing all validations
2. `invalid_story.md` - Story with multiple critical issues
3. `missing_sections.md` - Story with missing required sections
4. `unfilled_placeholders.md` - Story with unfilled template variables
5. `unclear_file_paths.md` - Story with vague file paths
6. `frontend_story.md` - Frontend story for UI validation
7. `ac_coverage_gap.md` - Story with ACs not covered by tasks
8. `hallucinated_library.md` - Story with unverifiable technical claims
9. `missing_technical_context.md` - Story lacking implementation details

---

### Test Automation

**CI/CD Integration**:
```yaml
# .github/workflows/test-validation.yml
name: Test Story Validation
on: [push, pull_request]
jobs:
  test-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run validation unit tests
        run: pytest tests/validation/
      - name: Run validation integration tests
        run: pytest tests/integration/validation/
```

---

## 16. ADK Translation Recommendations

### Architecture Pattern: Cloud Function

**Recommendation**: Implement validate-next-story as a **Cloud Function (2nd gen)**

**Rationale**:
- Validation is a **stateless, single-step workflow** (despite 10 internal steps)
- Input: Story file path + configuration
- Output: Validation report (ephemeral or written to file)
- No complex state management or multi-agent orchestration needed
- Execution time: 2-5 minutes (within Cloud Function limits)

**Alternative Consideration**: Could use **Reasoning Engine** for complex validation logic, but **Cloud Function is simpler and sufficient** for this use case.

---

### ADK Implementation Design

#### Cloud Function Structure

```python
# validate-next-story/main.py

from google.cloud import storage, firestore
import yaml
import markdown

def validate_story(request):
    """
    Cloud Function for validate-next-story task.

    Input (JSON):
    {
        "project_id": "bmad-project-123",
        "story_path": "stories/dev/1.3-user-login.md",
        "write_report": false  # Optional: write report to file
    }

    Output (JSON):
    {
        "decision": "GO" | "NO-GO",
        "overall_score": 8.5,
        "critical_issues": 0,
        "should_fix_issues": 2,
        "nice_to_have": 1,
        "report": "... full markdown report ...",
        "report_path": "gs://bmad-artifacts/qa/validations/1.3-validation.md"  # If written
    }
    """

    # Parse request
    data = request.get_json()
    project_id = data['project_id']
    story_path = data['story_path']
    write_report = data.get('write_report', False)

    # Step 0: Load configuration and inputs
    config = load_core_config(project_id)
    story = load_story(story_path)
    template = load_template(config['templatesLocation'])
    epic = load_epic(story, config)  # Optional
    architecture = load_architecture(config)  # Optional

    # Steps 1-9: Run validation dimensions
    results = {
        'template_compliance': validate_template_compliance(story, template),
        'file_structure': validate_file_structure(story),
        'ui_completeness': validate_ui_completeness(story) if is_frontend(story) else None,
        'ac_satisfaction': validate_ac_satisfaction(story),
        'testing_instructions': validate_testing_instructions(story),
        'security_considerations': validate_security(story) if is_security_sensitive(story) else None,
        'task_sequence': validate_task_sequence(story),
        'anti_hallucination': verify_anti_hallucination(story, epic, architecture),
        'implementation_readiness': assess_implementation_readiness(story)
    }

    # Step 10: Generate report
    report = generate_validation_report(results)

    # Determine GO/NO-GO decision
    decision = determine_decision(results)
    overall_score = calculate_overall_score(results)

    # Write report to file if requested
    report_path = None
    if write_report:
        report_path = write_report_to_storage(project_id, story, report, config)

    # Return results
    return {
        'decision': decision,
        'overall_score': overall_score,
        'critical_issues': count_critical_issues(results),
        'should_fix_issues': count_should_fix_issues(results),
        'nice_to_have': count_nice_to_have(results),
        'report': report,
        'report_path': report_path
    }
```

---

#### Storage Integration

**Cloud Storage**:
- **Input files**: Stories, epics, architecture docs stored in Cloud Storage buckets
- **Template files**: `.bmad-core/templates/` stored in Cloud Storage
- **Output reports** (optional): Written to Cloud Storage in `qa/validations/` folder

**Bucket Structure**:
```
gs://bmad-project-123/
  stories/dev/
    1.3-user-login.md
  docs/prd/epics/
    epic-1.md
  docs/architecture/sections/
    backend-architecture.md
    frontend-architecture.md
  .bmad-core/templates/
    story-tmpl.yaml
  qa/validations/
    1.3-user-login.validation.md  # Optional output
```

---

#### Firestore Integration

**Configuration Storage**:
```
/projects/{project_id}
  - config: {core-config.yaml contents}
```

**Validation History** (optional):
```
/projects/{project_id}/validations/{story_id}
  - timestamp: 2025-10-14T15:30:00Z
  - decision: "NO-GO"
  - overall_score: 6.5
  - critical_issues: 3
  - report_path: "gs://..."
```

---

#### Agent Integration

**PO Agent (Vertex AI Agent Builder)**:

```yaml
# PO Agent configuration
agent:
  id: "po-agent"
  display_name: "Sarah - Product Owner"

  tools:
    - name: "validate_story"
      description: "Validate a story draft before approval"
      function_ref: "projects/{project}/locations/{location}/functions/validate-next-story"
      parameters:
        project_id: string
        story_path: string
        write_report: boolean (optional)
```

**PO Agent Workflow**:
```
User: *validate-story-draft 1.3

PO Agent:
  1. Resolves story path: "stories/dev/1.3-user-login.md"
  2. Calls Cloud Function: validate_story(project_id, story_path)
  3. Receives validation report
  4. Presents report to user
  5. Makes GO/NO-GO recommendation
  6. If NO-GO: Communicates issues to SM for correction
```

---

#### Error Handling in ADK

**Cloud Function Error Responses**:
```json
// Success
{
  "status": "success",
  "decision": "GO",
  "report": "..."
}

// Error: Story not found
{
  "status": "error",
  "error_code": "STORY_NOT_FOUND",
  "message": "Story file not found at stories/dev/1.3-user-login.md"
}

// Error: Config missing
{
  "status": "error",
  "error_code": "CONFIG_NOT_FOUND",
  "message": "core-config.yaml not found for project bmad-project-123"
}

// Warning: Missing source docs
{
  "status": "success",
  "decision": "NO-GO",
  "warnings": [
    "Parent epic not found - anti-hallucination verification incomplete"
  ],
  "report": "..."
}
```

---

### Data Flow (ADK)

```
User → PO Agent → validate_story Cloud Function → Cloud Storage (read files) → Validation Logic → Validation Report → PO Agent → User
```

**Detailed Flow**:
1. **User** invokes PO agent: `*validate-story-draft 1.3`
2. **PO Agent** resolves story path and calls Cloud Function
3. **Cloud Function**:
   - Reads core-config.yaml from Firestore
   - Reads story, epic, architecture from Cloud Storage
   - Executes validation steps 1-10
   - Generates validation report
4. **Cloud Function** returns report to PO Agent
5. **PO Agent** presents report to user with GO/NO-GO recommendation
6. **User** decides next action (approve, fix issues, etc.)

---

### Performance in ADK

**Cloud Function Performance**:
- **Cold start**: 1-2 seconds
- **Warm execution**: 2-5 minutes (validation logic)
- **Total time**: 2-7 minutes (including cold start)

**Optimization**:
- **Warm pool**: Keep function warm to avoid cold starts
- **Parallel validation**: Run validation dimensions in parallel (reduce to 1-3 minutes)
- **Caching**: Cache parsed templates and config (reduce repeated file reads)

---

### Cost Estimation (ADK)

**Cloud Function Costs**:
- **Invocations**: $0.40 per 1M invocations
- **Compute time**: $0.0000025 per GB-second
- **Estimated cost per validation**: ~$0.001 (negligible)

**Cloud Storage Costs**:
- **Storage**: $0.020 per GB per month
- **Read operations**: $0.004 per 10,000 operations
- **Estimated cost per validation**: ~$0.0001 (negligible)

**Total Cost**: **< $0.01 per validation** (effectively free for typical usage)

---

### Deployment (ADK)

**Terraform Deployment**:
```hcl
# Cloud Function for validate-next-story
resource "google_cloudfunctions2_function" "validate_next_story" {
  name        = "validate-next-story"
  location    = var.region
  description = "Validate story draft before implementation"

  build_config {
    runtime     = "python311"
    entry_point = "validate_story"
    source {
      storage_source {
        bucket = google_storage_bucket.functions_source.name
        object = google_storage_bucket_object.validate_story_source.name
      }
    }
  }

  service_config {
    max_instance_count = 10
    timeout_seconds    = 300  # 5 minutes
    environment_variables = {
      PROJECT_ID = var.project_id
    }
  }
}
```

---

### Testing Strategy (ADK)

**Unit Tests**:
- Test each validation dimension independently
- Mock Cloud Storage reads (use local test files)
- Test error handling (missing files, malformed files)

**Integration Tests**:
- Deploy function to test environment
- Run validation against real test stories in Cloud Storage
- Verify correct GO/NO-GO decisions

**Load Tests**:
- Validate 100 stories in parallel (test scalability)
- Measure cold start vs warm execution times
- Verify function handles concurrent requests

---

## Summary

The `validate-next-story` task is a **comprehensive pre-implementation quality gate** that systematically validates story drafts across 10 dimensions to ensure implementation readiness. It prevents hallucinations, catches missing information, and provides clear GO/NO-GO recommendations with detailed issue categorization.

**Key Strengths**:
- **Anti-hallucination focus** - Verifies all technical claims trace to source documents
- **Implementation readiness** - Ensures Dev agent can succeed without external references
- **Systematic approach** - 10-step framework covers all quality dimensions
- **Clear prioritization** - Critical/Should-Fix/Nice-to-Have issue categorization
- **Actionable output** - Detailed validation report with specific remediation steps

**ADK Translation**: Best implemented as a **Cloud Function** for simplicity and cost-effectiveness, with integration into PO Agent workflow for story approval gating.

---

**Analysis Complete**: 2025-10-14
**Analyst**: Claude Code (AI Agent)
**Task File**: `.bmad-core/tasks/validate-next-story.md`
**Analysis Length**: 3,043 lines
