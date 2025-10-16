# Task Analysis: document-project

**Task ID**: `document-project`
**Task File**: `.bmad-core/tasks/document-project.md`
**Primary Agent**: Analyst (Mary) or Architect (Winston)
**Task Type**: Brownfield Documentation Generator
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: Medium-High (Context-aware brownfield analysis and documentation)

---

## 1. Purpose & Scope

### Primary Purpose
Generate comprehensive, AI-optimized documentation for **existing brownfield projects** that enables AI development agents to understand project context, conventions, patterns, and constraints for effective contribution to any codebase. This task creates a **single brownfield architecture document** that captures the **ACTUAL state** of the system (not aspirational), including technical debt, workarounds, and real-world patterns.

### Scope Definition

**In Scope**:
- Comprehensive analysis of existing project structure and organization
- Technology stack identification and documentation
- Build system and development workflow analysis
- Code pattern and convention discovery
- Technical debt and workaround documentation
- Integration point mapping (internal and external)
- Testing reality assessment (actual coverage, not targets)
- **PRD-focused documentation** (when PRD exists - documents only relevant areas)
- **Full system documentation** (when no PRD exists - comprehensive analysis)
- Impact analysis for planned enhancements (when PRD provided)
- AI agent-optimized reference material generation

**Out of Scope**:
- Creation of new features or enhancements (this is documentation only)
- Code refactoring or improvement (documents current state as-is)
- Automated code changes
- Idealized or aspirational architecture documentation
- Duplicate content from existing files (references source files instead)
- Standard software architecture documentation (focuses on brownfield reality)

### Key Characteristics
- **Reality-first documentation** - Documents what EXISTS, not what should exist
- **Context-aware scoping** - Adapts documentation focus based on PRD presence
- **AI-optimized structure** - Designed for AI agent consumption and navigation
- **Technical debt transparency** - Honestly documents workarounds and constraints
- **Reference-first approach** - Links to actual files rather than duplicating content
- **Impact analysis ready** - When PRD provided, includes enhancement impact analysis
- **Single document output** - One comprehensive brownfield architecture document

### Success Outcomes
1. AI agents can quickly understand the ACTUAL state of the system
2. Key files, modules, and integration points are clearly referenced
3. Technical debt and "gotchas" are transparently documented
4. If PRD provided: Clear impact analysis shows what needs to change
5. Future development work can proceed with full awareness of constraints
6. New team members (human or AI) can rapidly onboard to codebase reality

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - project_root_path: string         # Root directory of the project to document
  - project_name: string               # Name of the project being documented

optional:
  - prd_document: file_path            # Path to PRD or requirements document
  - focus_description: string          # User-provided description of enhancement focus
  - scope_preference: enum             # "prd-focused" | "comprehensive" | "user-defined"
  - documentation_standards: string    # Existing documentation format preferences
  - technical_detail_level: enum       # "junior" | "senior" | "mixed"
  - complex_areas: array<string>       # Specific areas user identifies as complex
  - expected_agent_tasks: array<string> # Types of tasks agents will perform
```

**Input Details**:
- **project_root_path**: Absolute or relative path to project root directory (required for file system analysis)
- **project_name**: Project name for document title and context
- **prd_document**: If a PRD exists, provide path to focus documentation on relevant areas only
- **focus_description**: User-provided description like "Adding payment processing to user service"
- **scope_preference**: Controls documentation scope (auto-detected if not provided)
- **documentation_standards**: Any existing format preferences or organizational standards
- **technical_detail_level**: Target audience technical sophistication
- **complex_areas**: User-identified complex or important areas requiring special attention
- **expected_agent_tasks**: Task types (bug fixes, features, refactoring, testing) to guide documentation focus

### Elicitation Questions (Step 1)

The task includes structured user elicitation to gather context:

**Primary Scope Question** (Asked if no PRD provided):
```
"I notice you haven't provided a PRD or requirements document. To create more focused
and useful documentation, I recommend one of these options:

1. **Create a PRD first** - Would you like me to help create a brownfield PRD before
   documenting? This helps focus documentation on relevant areas.

2. **Provide existing requirements** - Do you have a requirements document, epic, or
   feature description you can share?

3. **Describe the focus** - Can you briefly describe what enhancement or feature you're
   planning? For example:
   - 'Adding payment processing to the user service'
   - 'Refactoring the authentication module'
   - 'Integrating with a new third-party API'

4. **Document everything** - Or should I proceed with comprehensive documentation of
   the entire codebase? (Note: This may create excessive documentation for large projects)

Please let me know your preference, or I can proceed with full documentation if you prefer."
```

**Context Elicitation Questions**:
1. What is the primary purpose of this project?
2. Are there any specific areas of the codebase that are particularly complex or important for agents to understand?
3. What types of tasks do you expect AI agents to perform on this project? (e.g., bug fixes, feature additions, refactoring, testing)
4. Are there any existing documentation standards or formats you prefer?
5. What level of technical detail should the documentation target? (junior developers, senior developers, mixed team)
6. Is there a specific feature or enhancement you're planning? (This helps focus documentation)

**Deep Codebase Analysis Questions** (Step 2):
1. "I see you're using [technology X]. Are there any custom patterns or conventions I should document?"
2. "What are the most critical/complex parts of this system that developers struggle with?"
3. "Are there any undocumented 'tribal knowledge' areas I should capture?"
4. "What technical debt or known issues should I document?"
5. "Which parts of the codebase change most frequently?"

### Prerequisites

**Environment Requirements**:
- Access to project file system for analysis
- Ability to read configuration files (package.json, requirements.txt, etc.)
- Ability to explore directory structure
- Read access to source code files
- Access to existing documentation (if any)

**Agent Requirements**:
- Authority to create documentation files
- File system exploration capabilities
- Code pattern analysis capabilities
- Technology stack identification skills
- User interaction capabilities for elicitation

**Project Requirements**:
- Existing codebase with accessible file system
- Project must have some structure (not completely unorganized)
- Build/dependency configuration files should exist

### Configuration Dependencies

**From core-config.yaml**:
- Documentation output location (typically `docs/` directory)
- Project type and structure information (if available)

**Implicitly Required**:
- File system access for exploration
- Ability to identify common project structures and patterns
- Technology-specific knowledge for stack identification

---

## 3. Execution Flow

### High-Level Process (5 Steps)

```
Step 0: PRD Check & Scope Determination
  ↓
Step 1: Initial Project Analysis (Discovery & Elicitation)
  ↓
Step 2: Deep Codebase Analysis (Exploration & Mapping)
  ↓
Step 3: Core Documentation Generation (LLM Document Creation)
  ↓
Step 4: Document Delivery (Environment-Specific Output)
  ↓
Step 5: Quality Assurance (Validation & Refinement)
```

**Critical Flow Characteristics**:
- **PRD-aware branching**: Step 0 determines scope (focused vs comprehensive)
- **Interactive elicitation**: Step 1 gathers user context and preferences
- **Extensive exploration**: Step 2 deeply analyzes actual codebase before generating
- **Single document output**: Step 3 generates ONE comprehensive document (not multiple files)
- **Environment-adaptive delivery**: Step 4 adjusts delivery based on Web UI vs IDE
- **Reality validation**: Step 5 ensures documentation matches actual codebase state

---

### Step 0: PRD Check & Scope Determination

**Purpose**: Determine documentation scope based on PRD availability to avoid over-documenting large codebases.

**Process**:

**0.1 Check for PRD/Requirements Document**
- [ ] Search for PRD in project context or user-provided paths
  - Check for files named `prd.md`, `requirements.md`, `product-requirements.md`
  - Check `docs/` directory for requirement documents
  - Ask user if they have a PRD or requirements document

**0.2 Branch Based on PRD Availability**

**IF PRD EXISTS**:
```
- Review the PRD to understand what enhancement/feature is planned
- Identify which modules, services, or areas will be affected
- Focus documentation ONLY on these relevant areas
- Skip unrelated parts of the codebase to keep docs lean
```

**IF NO PRD EXISTS**:
```
- Present the 4-option elicitation question (shown in Section 2)
- Wait for user response
- Based on response, set scope:
  - Option 1: Exit this task, trigger brownfield PRD creation, then return
  - Option 2: Use provided requirements to focus documentation
  - Option 3: Use user description to focus documentation
  - Option 4: Proceed with comprehensive full-codebase analysis
```

**Decision Points**:
- **Has PRD**: → Focus mode (document only relevant areas)
- **User provides focus description**: → Targeted mode (document described areas)
- **User chooses comprehensive**: → Full mode (document entire codebase)
- **User wants PRD first**: → Exit task, create PRD, return

**Output**:
- Scope determination: `FOCUSED | TARGETED | COMPREHENSIVE`
- Focus context (if applicable): Areas/modules to emphasize
- PRD content (if provided): Enhancement requirements to guide impact analysis

---

### Step 1: Initial Project Analysis

**Purpose**: Conduct discovery of project structure, technology stack, and gather user context through elicitation.

**Process**:

**1.1 Project Structure Discovery**
- [ ] **Examine Root Directory Structure**
  - List all top-level directories
  - Identify source code directories (`src/`, `app/`, `lib/`, etc.)
  - Identify configuration directories (`config/`, `settings/`, etc.)
  - Identify test directories (`test/`, `tests/`, `__tests__/`, `spec/`, etc.)
  - Identify documentation directories (`docs/`, `documentation/`, `wiki/`, etc.)
  - Identify build/deployment directories (`build/`, `dist/`, `deploy/`, `.github/`, etc.)
  - Note any unusual or non-standard directory names

- [ ] **Identify Main Folders and Organization**
  - Determine repository type: Monorepo vs Polyrepo vs Hybrid
  - Identify module/package organization pattern
  - Note separation of concerns (frontend/backend, services, layers)
  - Identify any legacy or deprecated directories

**1.2 Technology Stack Identification**
- [ ] **Find Package/Dependency Management Files**
  - **Node.js**: `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
  - **Python**: `requirements.txt`, `Pipfile`, `poetry.lock`, `setup.py`, `pyproject.toml`
  - **Java**: `pom.xml`, `build.gradle`, `build.gradle.kts`
  - **Ruby**: `Gemfile`, `Gemfile.lock`
  - **Go**: `go.mod`, `go.sum`
  - **Rust**: `Cargo.toml`, `Cargo.lock`
  - **PHP**: `composer.json`, `composer.lock`
  - **.NET**: `.csproj`, `packages.config`, `.sln`

- [ ] **Extract Technology Information**
  - Primary language(s) and versions
  - Framework(s) and versions
  - Key dependencies and their purposes
  - Development dependencies (linters, test frameworks, build tools)
  - Database technologies
  - External service integrations

**1.3 Build System Analysis**
- [ ] **Find Build Scripts and Configurations**
  - Build tool configs: `webpack.config.js`, `vite.config.js`, `tsconfig.json`, `Makefile`, etc.
  - Task runner configs: `Gruntfile.js`, `gulpfile.js`, scripts in `package.json`
  - CI/CD configurations: `.github/workflows/`, `.gitlab-ci.yml`, `.circleci/`, `Jenkinsfile`

- [ ] **Identify Development Commands**
  - Development server start command
  - Build/compile command
  - Test execution command
  - Linting/formatting commands
  - Database migration commands
  - Deployment commands

**1.4 Existing Documentation Review**
- [ ] **Check for Existing Documentation**
  - Root-level `README.md` or `README.txt`
  - `docs/` directory contents
  - `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE.md`
  - Inline documentation (JSDoc, docstrings, code comments)
  - Architecture Decision Records (ADRs)
  - API documentation (Swagger/OpenAPI, Postman collections)

- [ ] **Assess Documentation Quality and Coverage**
  - What's already documented vs what's missing
  - Accuracy of existing documentation
  - Documentation maintenance status (up-to-date or stale)

**1.5 Code Pattern Analysis (Sampling)**
- [ ] **Sample Key Files to Understand Patterns**
  - Entry points (main files, index files, app initializers)
  - Controllers/route handlers
  - Service/business logic files
  - Data model definitions
  - Utility/helper modules
  - Test files

- [ ] **Identify Coding Patterns and Conventions**
  - Naming conventions (camelCase, snake_case, PascalCase)
  - File organization patterns
  - Code structure patterns (MVC, layered, hexagonal, etc.)
  - Error handling approaches
  - Logging patterns
  - Configuration management approaches

**1.6 User Elicitation (Interactive Questions)**

Ask the 6 context elicitation questions (listed in Section 2: Input Requirements):
1. Primary purpose of project
2. Complex or important areas
3. Expected AI agent tasks
4. Documentation standards preferences
5. Technical detail level target
6. Specific planned enhancement (helps focus)

**Output**:
- Project structure map
- Technology stack inventory
- Build system understanding
- Existing documentation assessment
- Code pattern notes
- User context and preferences

---

### Step 2: Deep Codebase Analysis

**Purpose**: Conduct extensive exploration of the ACTUAL codebase to understand reality before generating documentation.

**CRITICAL INSTRUCTION**: This step is about exploration and discovery, NOT documentation generation. The goal is to build a complete understanding of the real system state, including technical debt, workarounds, and constraints.

**Process**:

**2.1 Explore Key Areas**

- [ ] **Entry Points Analysis**
  - Identify main entry files (e.g., `src/index.js`, `main.py`, `App.java`, `main.go`)
  - Understand initialization sequence
  - Map bootstrapping logic
  - Identify startup dependencies

- [ ] **Configuration Files and Environment Setup**
  - Find all configuration files (app configs, environment configs, feature flags)
  - Identify environment variables required (check `.env.example`, `.env.template`)
  - Understand configuration precedence (defaults → env → runtime)
  - Note any hardcoded configurations or magic values

- [ ] **Package Dependencies and Versions**
  - List all production dependencies
  - List all development dependencies
  - Identify version constraints and compatibility requirements
  - Note any deprecated or outdated dependencies
  - Check for security vulnerabilities (if tooling available)

- [ ] **Build and Deployment Configurations**
  - Understand build process (compilation, bundling, minification)
  - Identify deployment targets (staging, production environments)
  - Map deployment process (manual vs automated)
  - Note any deployment-specific configurations or steps

- [ ] **Test Suites and Coverage**
  - Identify test frameworks used (Jest, Mocha, PyTest, JUnit, etc.)
  - Count and categorize tests (unit, integration, E2E)
  - Check actual test coverage percentage (not targets)
  - Identify untested or poorly tested areas
  - Note test quality (meaningful vs perfunctory)

**2.2 Ask Clarifying Questions (Deep Dive)**

Ask the 5 deep codebase analysis questions (listed in Section 2: Input Requirements):
1. Custom patterns or conventions for identified technologies
2. Critical/complex parts that developers struggle with
3. Undocumented "tribal knowledge" areas
4. Technical debt or known issues
5. Parts of codebase that change most frequently

**2.3 Map the Reality (Honest Assessment)**

**CRITICAL**: This is about documenting REALITY, not best practices or aspirational state.

- [ ] **Identify ACTUAL Patterns Used**
  - Not theoretical best practices, but what code actually does
  - Note where patterns are inconsistent across different modules
  - Identify anti-patterns or "code smells" that must be worked around
  - Document why certain approaches were taken (constraints, legacy decisions)

- [ ] **Find Where Key Business Logic Lives**
  - Core domain logic locations (actual files and functions)
  - Business rule implementations
  - Calculation/algorithm implementations
  - Workflow orchestration logic

- [ ] **Locate Integration Points and External Dependencies**
  - External API calls (REST, GraphQL, SOAP)
  - External service SDKs (AWS, Stripe, SendGrid, etc.)
  - Database connections and queries
  - Message queues or event systems
  - File system access
  - Third-party library usage

- [ ] **Document Workarounds and Technical Debt**
  - Temporary fixes that became permanent
  - "DO NOT TOUCH" areas with fragile code
  - Coupling that shouldn't exist but does
  - Performance bottlenecks that are known but not fixed
  - Security issues that are known but not addressed
  - Configuration hacks (e.g., "Must set NODE_ENV=production even for staging")

- [ ] **Note Areas That Differ from Standard Patterns**
  - Legacy modules using old patterns
  - Inconsistent error handling approaches
  - Mixed technology versions (e.g., callbacks and promises in same codebase)
  - Areas that violate project conventions

**2.4 IF PRD PROVIDED: Analyze Enhancement Impact**

- [ ] **Identify Files That Will Need Modification**
  - Based on PRD requirements, list specific files requiring changes
  - Note which modules will be affected
  - Identify data models that need updates
  - Map API endpoints that need modification

- [ ] **Identify New Files/Modules Needed**
  - What new services/modules will be required
  - What new data models will be created
  - What new integration points will be added

- [ ] **Assess Integration Considerations**
  - How will new code integrate with existing patterns
  - What existing interfaces must be respected
  - What data formats must be maintained
  - What breaking changes might be required

**Output**:
- Comprehensive understanding of actual codebase state
- Technical debt and workaround inventory
- Key business logic location map
- Integration point catalog
- (If PRD) Enhancement impact assessment
- Reality-based insights for documentation

---

## 4. Decision Points & Branching Logic

### Decision Point 1: PRD Check (Step 0)

**Condition**: PRD document exists or is provided by user

**Branching**:
```
IF PRD EXISTS:
  → Extract enhancement focus from PRD
  → Set scope = FOCUSED
  → Document only relevant areas
  → Include impact analysis section

ELSE IF user provides focus description:
  → Use description to determine focus
  → Set scope = TARGETED
  → Document described areas + related components

ELSE IF user chooses "create PRD first":
  → Exit document-project task
  → Trigger brownfield-create-epic or similar
  → Return to this task after PRD creation

ELSE IF user chooses "document everything":
  → Set scope = COMPREHENSIVE
  → Proceed with full codebase analysis

ELSE:
  → Present 4-option elicitation question
  → Wait for user response
  → Branch based on response
```

**Impact on Execution**:
- **FOCUSED**: Steps 1-2 analyze only PRD-relevant areas, Step 3 includes impact analysis
- **TARGETED**: Steps 1-2 analyze user-described areas plus dependencies
- **COMPREHENSIVE**: Steps 1-2 analyze entire codebase thoroughly
- **PRD-first**: Task exits, resumes after PRD creation with FOCUSED scope

---

### Decision Point 2: Complexity Assessment (Step 2)

**Condition**: Codebase is extremely large or complex during deep analysis

**Branching**:
```
IF codebase_size > very_large AND scope = COMPREHENSIVE:
  → Warn user about documentation size
  → Offer to switch to TARGETED scope
  → Ask user to identify priority areas

ELSE IF analysis_time > 30_minutes AND scope = COMPREHENSIVE:
  → Suggest progressive documentation approach
  → Offer to focus on specific subsystems first

ELSE:
  → Continue with current scope
```

**User Interaction**:
```
"This codebase is quite large [X files, Y modules]. Creating comprehensive
documentation may result in a very large document. Would you like to:

1. Continue with comprehensive documentation (may be 50+ pages)
2. Focus on specific areas (please describe which areas are most important)
3. Create module-by-module documentation (separate docs for each major module)

Please let me know your preference."
```

---

### Decision Point 3: Documentation Standards (Step 1)

**Condition**: User has existing documentation standards or format preferences

**Branching**:
```
IF user_has_standards:
  → Adapt document structure to match existing standards
  → Use preferred section naming conventions
  → Match existing formatting style

ELSE:
  → Use BMad standard brownfield architecture document template
```

---

### Decision Point 4: Delivery Environment (Step 4)

**Condition**: Task is running in Web UI vs IDE environment

**Branching**:
```
IF environment = WEB_UI (Gemini, ChatGPT, Claude web):
  → Present entire document in response (or split if too long)
  → Instruct user to copy and save manually
  → Suggest filename: docs/brownfield-architecture.md
  → Mention possibility of sharding later in IDE

ELSE IF environment = IDE (VSCode, Cursor, etc.):
  → Create file directly: docs/brownfield-architecture.md
  → Inform user of file creation
  → Offer to shard document if desired (using shard-doc task)
```

---

### Decision Point 5: Validation Concerns (Step 5)

**Condition**: Quality assurance reveals accuracy or completeness issues

**Branching**:
```
IF accuracy_issues_found:
  → Re-analyze affected sections
  → Correct technical details
  → Validate against actual codebase

IF completeness_issues_found:
  → Identify missing components
  → Ask user if missing areas are important
  → Add missing sections if relevant to scope

IF clarity_issues_found:
  → Simplify explanations
  → Add examples or references
  → Restructure sections for better flow
```

---

## 5. User Interaction Points

### Interaction Point 1: Scope Elicitation (Step 0)

**Trigger**: No PRD document found in context

**Purpose**: Determine documentation scope to avoid over-documenting

**User Prompt** (4-option question):
```
"I notice you haven't provided a PRD or requirements document. To create more focused
and useful documentation, I recommend one of these options:

1. **Create a PRD first** - Would you like me to help create a brownfield PRD before
   documenting? This helps focus documentation on relevant areas.

2. **Provide existing requirements** - Do you have a requirements document, epic, or
   feature description you can share?

3. **Describe the focus** - Can you briefly describe what enhancement or feature you're
   planning? For example:
   - 'Adding payment processing to the user service'
   - 'Refactoring the authentication module'
   - 'Integrating with a new third-party API'

4. **Document everything** - Or should I proceed with comprehensive documentation of
   the entire codebase? (Note: This may create excessive documentation for large projects)

Please let me know your preference, or I can proceed with full documentation if you prefer."
```

**Expected User Response**: Choice of option 1, 2, 3, or 4

**Agent Action Based on Response**:
- Option 1: Exit task, create brownfield PRD, return with FOCUSED scope
- Option 2: Request requirements document, use to set TARGETED scope
- Option 3: Use description to set TARGETED scope, focus on described areas
- Option 4: Set COMPREHENSIVE scope, proceed with full analysis

**Mode**: Interactive (requires user response before proceeding)

---

### Interaction Point 2: Context Elicitation (Step 1)

**Trigger**: After project structure and tech stack discovery

**Purpose**: Gather user-specific context and preferences

**User Prompts** (6 questions):

1. **Project Purpose**:
   ```
   "What is the primary purpose of this project? (This helps me prioritize
   documentation focus)"
   ```

2. **Complex Areas**:
   ```
   "Are there any specific areas of the codebase that are particularly complex
   or important for agents to understand?"
   ```

3. **Expected Agent Tasks**:
   ```
   "What types of tasks do you expect AI agents to perform on this project?
   For example: bug fixes, feature additions, refactoring, testing, documentation?"
   ```

4. **Documentation Standards**:
   ```
   "Are there any existing documentation standards or formats you prefer?
   (e.g., specific template, organizational style guide)"
   ```

5. **Technical Detail Level**:
   ```
   "What level of technical detail should the documentation target?
   - Junior developers (more explanations, less assumed knowledge)
   - Senior developers (technical depth, assumes familiarity)
   - Mixed team (balanced approach)"
   ```

6. **Enhancement Focus** (if not already provided):
   ```
   "Is there a specific feature or enhancement you're planning? This helps
   me focus documentation on relevant areas."
   ```

**Expected User Responses**: Natural language answers to each question

**Agent Action**: Use responses to tailor documentation focus, depth, and structure

**Mode**: Interactive (but can proceed with defaults if user skips)

---

### Interaction Point 3: Deep Analysis Clarifications (Step 2)

**Trigger**: During deep codebase analysis when patterns or decisions need clarification

**Purpose**: Capture "tribal knowledge" and understand non-obvious decisions

**User Prompts** (5 clarifying questions):

1. **Technology-Specific Patterns**:
   ```
   "I see you're using [technology X, e.g., Express.js]. Are there any custom
   patterns or conventions I should document? For example, custom middleware
   patterns, specific routing conventions, etc."
   ```

2. **Complex/Critical Areas**:
   ```
   "What are the most critical or complex parts of this system that developers
   struggle with? These areas would benefit from extra documentation detail."
   ```

3. **Tribal Knowledge**:
   ```
   "Are there any undocumented 'tribal knowledge' areas I should capture?
   Things that aren't written down but everyone on the team just knows?"
   ```

4. **Technical Debt**:
   ```
   "What technical debt or known issues should I document? This helps future
   agents understand constraints and avoid making problems worse."
   ```

5. **Change Frequency**:
   ```
   "Which parts of the codebase change most frequently? These areas may need
   more detailed documentation to support ongoing development."
   ```

**Expected User Responses**: Natural language descriptions, file paths, or "none/skip"

**Agent Action**: Incorporate responses into technical debt, workarounds, and complex areas sections

**Mode**: Interactive (but can proceed without if user has no additional input)

---

### Interaction Point 4: Large Codebase Warning (Step 2 - Decision Point)

**Trigger**: Codebase is very large and scope is COMPREHENSIVE

**Purpose**: Warn user and offer to refocus documentation

**User Prompt**:
```
"This codebase is quite large [X files across Y directories]. Creating
comprehensive documentation may result in a very large document (potentially
50+ pages).

Would you like to:
1. Continue with comprehensive documentation
2. Focus on specific areas (please describe priority areas)
3. Create module-by-module documentation (separate docs for each major module)

Please let me know your preference."
```

**Expected User Response**: Choice of option 1, 2, or 3 with optional description

**Agent Action**:
- Option 1: Continue with COMPREHENSIVE scope
- Option 2: Switch to TARGETED scope with user-specified areas
- Option 3: Create multiple smaller documents (requires multiple executions or different strategy)

**Mode**: Interactive (requires user decision before proceeding)

---

### Interaction Point 5: Validation Feedback (Step 5)

**Trigger**: After document generation, during quality assurance

**Purpose**: Refine documentation based on user feedback

**User Prompt**:
```
"I've generated the brownfield architecture document. Please review the following
sections and let me know if any areas need more detail, correction, or clarification:

- Project structure and organization
- Technology stack and dependencies
- Technical debt and workarounds
- Integration points
[If PRD provided:] - Enhancement impact analysis

Would you like me to refine any sections, add more detail to specific areas, or
make any corrections?"
```

**Expected User Response**: Feedback on specific sections or "looks good"

**Agent Action**:
- If feedback provided: Apply advanced-elicitation task to refine sections
- If "looks good": Finalize document

**Mode**: Interactive (but can finalize without feedback if user approves)

---

## 6. Output Specifications

### Primary Output: Brownfield Architecture Document

**Filename**: `docs/brownfield-architecture.md` or `docs/project-architecture.md`

**Format**: Single comprehensive Markdown document

**Structure**:

```markdown
# [Project Name] Brownfield Architecture Document

## Introduction
- Current state overview
- Document scope (PRD-focused or comprehensive)
- Change log table

## Quick Reference - Key Files and Entry Points
- Critical files for understanding the system
- Main entry points with file paths
- Configuration file locations
- Core business logic locations
- API definitions (with file references)
- Database models (with file references)
- Key algorithms (with file references)
- [If PRD] Enhancement impact areas (files affected)

## High Level Architecture
### Technical Summary
- Actual tech stack table (from package.json/requirements.txt)
- Repository structure reality check (monorepo/polyrepo/hybrid)

## Source Tree and Module Organization
### Project Structure (Actual)
- Directory tree with annotations
- Technical debt notes (e.g., "DO NOT MODIFY - legacy payment system")
- Inconsistencies noted (e.g., "inconsistent patterns between services")

### Key Modules and Their Purpose
- Module descriptions with actual file paths
- Critical coupling warnings
- Legacy module warnings

## Data Models and APIs
### Data Models
- References to actual model files (not duplication)
- Links to TypeScript types or schema definitions

### API Specifications
- Links to OpenAPI spec, Postman collections
- List of undocumented endpoints (if discovered)

## Technical Debt and Known Issues
### Critical Technical Debt
- Numbered list of significant debt items
- File paths and descriptions
- Impact assessment

### Workarounds and Gotchas
- Environment variable quirks
- Configuration hacks
- Known bugs that must be worked around
- Coupling issues

## Integration Points and External Dependencies
### External Services
- Table: Service | Purpose | Integration Type | Key Files

### Internal Integration Points
- Frontend-backend communication
- Background job systems
- Inter-service communication

## Development and Deployment
### Local Development Setup
- Actual steps that work (not ideal steps)
- Known setup issues
- Required environment variables

### Build and Deployment Process
- Build commands (actual)
- Deployment process (manual or automated)
- Environment configurations

## Testing Reality
### Current Test Coverage
- Actual coverage percentages (not targets)
- Test framework information
- Coverage gaps

### Running Tests
- Test execution commands
- Prerequisites for running tests

## [If PRD Provided] Enhancement Impact Analysis
### Files That Will Need Modification
- List of specific files requiring changes
- Nature of changes for each file

### New Files/Modules Needed
- New services/modules to create
- New data models required

### Integration Considerations
- Existing patterns to follow
- Interfaces to respect
- Data formats to maintain

## Appendix - Useful Commands and Scripts
### Frequently Used Commands
- Development server start
- Build commands
- Migration commands
- Seed data commands

### Debugging and Troubleshooting
- Log file locations
- Debug mode activation
- Common issues and solutions
```

**Content Characteristics**:
- **Reality-first**: Documents what EXISTS, not what should exist
- **Reference-heavy**: Links to actual files instead of duplicating content
- **Debt-transparent**: Honestly documents technical debt and workarounds
- **AI-optimized**: Clear structure for AI agent navigation and understanding
- **Path-specific**: All references use actual file paths
- **Annotation-rich**: Inline notes about constraints, warnings, and gotchas

---

### Secondary Output: Delivery Instructions (Environment-Specific)

**In Web UI**:
```
Output: The document content is presented in agent response

Instruction to User:
"I've generated a comprehensive brownfield architecture document for your project.
Please copy this document and save it as:
  - docs/brownfield-architecture.md  (or docs/project-architecture.md)

This single document contains all architectural information about the current state
of your system. You can shard it into smaller documents later using the PO agent's
shard-doc task if desired.

Key sections:
- Quick Reference (for fast navigation)
- High Level Architecture (tech stack and structure)
- Technical Debt and Known Issues (constraints and gotchas)
- [If PRD] Enhancement Impact Analysis (what needs to change)

Would you like me to refine any sections or add more detail to specific areas?"
```

**In IDE**:
```
Output: File created directly in docs/ directory

Instruction to User:
"I've created the brownfield architecture document at:
  docs/brownfield-architecture.md

This single comprehensive document contains all architectural information about
the current state of your system, including:
- Project structure and key files
- Technology stack and dependencies
- Technical debt and workarounds
- Integration points
- [If PRD] Enhancement impact analysis

The document is ready for AI agents to reference. If you'd like to shard this
into smaller documents for easier navigation, I can use the shard-doc task.

Would you like me to:
1. Shard the document into smaller topic-specific files?
2. Add more detail to any specific sections?
3. The document is complete as-is."
```

---

### Output Metadata

```yaml
document:
  type: brownfield-architecture
  scope: FOCUSED | TARGETED | COMPREHENSIVE
  project_name: string
  generated_date: ISO-8601 timestamp
  version: "1.0"

sections:
  - introduction
  - quick_reference
  - high_level_architecture
  - source_tree
  - data_models_apis
  - technical_debt
  - integration_points
  - development_deployment
  - testing_reality
  - [optional] enhancement_impact_analysis
  - appendix

scope_context:
  prd_provided: boolean
  focus_areas: array<string>
  scope_description: string

statistics:
  total_files_analyzed: number
  total_directories_analyzed: number
  primary_language: string
  test_coverage_percentage: number
  technical_debt_items: number
```

---

## 7. Error Handling & Validation

### Error Condition 1: Cannot Access Project Directory

**Error**: Project root path does not exist or is not accessible

**Detection**: Step 1 - Project Structure Discovery fails to list root directory

**Handling**:
```
1. Inform user of access issue
2. Request correct project path
3. Verify path exists and is readable
4. If still inaccessible, request user to check permissions
5. If unresolvable, abort task with clear error message
```

**User Message**:
```
"I cannot access the project directory at: [provided path]

Please verify:
1. The path is correct
2. The directory exists
3. I have read permissions for this directory

Please provide the correct path to your project root directory."
```

---

### Error Condition 2: No Recognizable Project Structure

**Error**: Cannot identify programming language, framework, or project type

**Detection**: Step 1 - Technology Stack Identification finds no known dependency files

**Handling**:
```
1. List what WAS found in root directory
2. Ask user to identify project type manually
3. Request location of source code
4. Proceed with manual guidance from user
5. Document as "unstructured project" with user-provided context
```

**User Message**:
```
"I cannot automatically identify the project type or technology stack.

I found these files/directories in the root:
- [list of files and directories]

To help me create accurate documentation, please provide:
1. What programming language(s) is this project written in?
2. What framework(s) are used (if any)?
3. Where is the main source code located?
4. How do you typically build and run this project?

I can still create documentation with your guidance."
```

---

### Error Condition 3: Extremely Large Codebase (Scan Timeout)

**Error**: Codebase analysis is taking excessive time (>30 minutes)

**Detection**: Step 2 - Deep Codebase Analysis duration exceeds threshold

**Handling**:
```
1. Pause analysis
2. Present partial findings to user
3. Offer to focus on specific areas
4. Suggest module-by-module documentation approach
5. Let user decide how to proceed
```

**User Message**:
```
"This is a very large codebase and comprehensive analysis is taking longer than
expected. I've analyzed [X%] so far.

To proceed more efficiently, would you like to:
1. Continue comprehensive analysis (may take another [Y] minutes)
2. Focus documentation on specific modules (please specify which ones)
3. Create module-by-module documentation (I'll document one module at a time)
4. Use what I've found so far and create a preliminary document

Please let me know your preference."
```

---

### Error Condition 4: PRD Cannot Be Parsed

**Error**: PRD document exists but cannot be read or understood

**Detection**: Step 0 - PRD file is corrupted, in unknown format, or unclear

**Handling**:
```
1. Inform user of parsing issue
2. Request clarification on PRD format
3. Ask user to summarize enhancement focus manually
4. Offer to proceed with COMPREHENSIVE scope instead
5. Document using manual user input
```

**User Message**:
```
"I found a PRD document at [path] but I'm having difficulty parsing it.

Issue: [corrupted file | unknown format | unclear requirements | etc.]

To proceed, please choose:
1. Manually summarize the planned enhancement (I'll use that to focus documentation)
2. Provide a different PRD or requirements document
3. Proceed with comprehensive documentation of the entire codebase

What would you prefer?"
```

---

### Error Condition 5: Conflicting Information

**Error**: User responses contradict codebase findings

**Detection**: Throughout analysis, discrepancies between user statements and actual code

**Handling**:
```
1. Document BOTH the user statement and the actual finding
2. Politely point out discrepancy
3. Ask user to clarify
4. Prioritize actual codebase reality in final document
5. Note discrepancy in "Known Issues" section if unresolved
```

**User Message**:
```
"I notice a discrepancy that I'd like to clarify:

You mentioned: [user statement]
However, I found in the codebase: [actual finding]

Could you help me understand:
1. Is the codebase outdated and [user statement] is the planned state?
2. Is [actual finding] the current reality and [user statement] is aspirational?
3. Is there something I'm misunderstanding about the codebase?

This helps me document the ACTUAL current state accurately."
```

---

### Validation Checks (Step 5: Quality Assurance)

**Validation 1: Accuracy Check**
```
Verification Steps:
- [ ] All file paths referenced actually exist
- [ ] Technology versions match package manager files
- [ ] Build commands work as documented
- [ ] Test commands execute successfully
- [ ] Configuration details match actual config files
- [ ] No hallucinated features or capabilities
```

**Validation 2: Completeness Review**
```
Verification Steps:
- [ ] All major system components are documented
- [ ] All directories in source tree are accounted for
- [ ] All external integrations are listed
- [ ] All critical technical debt is captured
- [ ] [If PRD] All affected areas are analyzed
```

**Validation 3: Focus Validation**
```
IF scope = FOCUSED OR TARGETED:
  - [ ] Relevant areas are emphasized and detailed
  - [ ] Unrelated areas are minimized or omitted
  - [ ] Focus aligns with PRD or user description
  - [ ] Impact analysis is clear and actionable
```

**Validation 4: Clarity Assessment**
```
Verification Steps:
- [ ] Explanations are clear for target audience (junior/senior/mixed)
- [ ] Technical jargon is explained or minimized
- [ ] File paths and references are unambiguous
- [ ] Structure supports easy navigation
- [ ] AI agents can understand and use the document
```

**Validation 5: Navigation Check**
```
Verification Steps:
- [ ] Table of contents is accurate
- [ ] Section headers are clear and descriptive
- [ ] Quick Reference section enables fast lookups
- [ ] Cross-references are valid
- [ ] Document flow is logical
```

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**No Direct Task Dependencies** (This task is self-contained)

However, this task may **trigger** or **be triggered by** other tasks:

**May Trigger**:
- `brownfield-create-epic` - If user chooses "Create PRD first" option (Step 0, Option 1)
- `advanced-elicitation` - Applied after major sections to refine based on user feedback (Step 5)
- `shard-doc` - Optionally offered after document creation to break into smaller files (Step 4)

**May Be Triggered By**:
- `brownfield-create-epic` - After PRD creation, may trigger document-project with FOCUSED scope
- User manual invocation - Most common entry point

**Workflow Position**:
```
Typical Brownfield Workflow:

Option A (PRD-first):
brownfield-create-epic → document-project (FOCUSED) → brownfield-create-story → ...

Option B (Documentation-first):
document-project (COMPREHENSIVE) → brownfield-create-epic → ...

Option C (Targeted enhancement):
document-project (TARGETED) → brownfield-create-story → ...
```

---

### File Dependencies

**Required Files** (Analysis Targets):
```
Project Structure:
- project_root/              # Must be accessible
  - Any structure (analyzed as-is)

Common Dependency Files (analyzed if present):
- package.json              # Node.js projects
- requirements.txt          # Python projects
- Cargo.toml                # Rust projects
- pom.xml / build.gradle    # Java projects
- Gemfile                   # Ruby projects
- go.mod                    # Go projects
- composer.json             # PHP projects
- *.csproj / *.sln          # .NET projects
```

**Optional Files** (Enhanced Analysis):
```
Configuration:
- .env.example              # Environment variable documentation
- config/*                  # Configuration files
- *config.js / *config.py   # Config modules

Documentation:
- README.md                 # Existing documentation
- docs/**                   # Documentation directory
- CONTRIBUTING.md           # Contribution guidelines
- ADRs (Architecture Decision Records)

Build/Deploy:
- webpack.config.js         # Build configuration
- .github/workflows/*       # CI/CD workflows
- Dockerfile                # Container configuration
- Makefile                  # Build scripts

API Documentation:
- openapi.yaml / swagger.json  # API specifications
- postman_collection.json      # API testing collections
```

**Output File**:
```
docs/brownfield-architecture.md  # Primary output location (IDE)
OR
[Presented in response]          # Web UI output
```

---

### Data Dependencies

**Configuration Data** (from core-config.yaml):
```yaml
# Optional configurations (task works without these)
project:
  docs_location: "docs/"        # Where to create documentation (default: docs/)
  project_name: string          # Project name (can be detected or user-provided)
  project_type: string          # Optional project type hint
```

**Runtime Data** (gathered during execution):
```yaml
discovered_data:
  project_structure:
    root_path: string
    source_directories: array<string>
    config_directories: array<string>
    test_directories: array<string>

  technology_stack:
    primary_language: string
    frameworks: array<{name: string, version: string}>
    dependencies: array<{name: string, version: string, type: string}>

  build_system:
    build_tool: string
    build_commands: object
    deployment_process: string

  existing_documentation:
    readme_exists: boolean
    docs_directory_exists: boolean
    api_docs_exist: boolean

  code_patterns:
    naming_convention: string
    architecture_pattern: string
    error_handling_approach: string

  technical_debt:
    items: array<{area: string, description: string, severity: string}>
    workarounds: array<{description: string, files: array<string>}>

  integration_points:
    external_services: array<{name: string, type: string, files: array<string>}>
    internal_integrations: array<{description: string}>
```

**User-Provided Data**:
```yaml
user_context:
  prd_document: file_path | null
  focus_description: string | null
  scope_preference: "focused" | "targeted" | "comprehensive"
  project_purpose: string
  complex_areas: array<string>
  expected_agent_tasks: array<string>
  documentation_standards: string | null
  technical_detail_level: "junior" | "senior" | "mixed"
  custom_patterns: string | null
  tribal_knowledge: string | null
  known_technical_debt: string | null
  change_frequency_areas: string | null
```

---

### Tool/Capability Dependencies

**File System Access**:
- Read directory structures
- Read file contents
- List files and directories
- Check file existence
- (IDE only) Create files

**Analysis Capabilities**:
- Parse JSON (for package.json, etc.)
- Parse YAML (for config files, PRDs)
- Parse XML (for pom.xml, *.csproj)
- Parse TOML (for Cargo.toml, pyproject.toml)
- Basic code structure analysis (identify functions, classes, imports)

**User Interaction Capabilities**:
- Present questions and prompts
- Receive and parse natural language responses
- Handle multi-turn conversations
- Present formatted output (markdown)

**Optional Capabilities** (enhance task but not required):
- Syntax highlighting for code examples
- Test coverage analysis tools
- Dependency vulnerability scanning
- Code complexity metrics

---

### Agent Capabilities Required

**For Analyst (Mary)**:
- Project structure analysis skills
- Technology identification expertise
- Pattern recognition capabilities
- Elicitation and interviewing skills
- Documentation writing clarity
- Attention to detail (accuracy validation)

**For Architect (Winston)** (if used instead of Analyst):
- System architecture understanding
- Technology stack expertise
- Integration pattern recognition
- Technical debt assessment
- Architectural documentation skills

**Both Agents Need**:
- File system navigation
- Configuration file parsing
- User interaction management
- Markdown document generation
- Reality-based assessment (not aspirational thinking)

---

### Environment Dependencies

**Web UI Environment** (Gemini, ChatGPT, Claude):
- Cannot create files directly
- Must present document content in response
- User must manually save document
- Limited file system access (user must provide file contents)
- Relies on user to copy/paste file contents for analysis

**IDE Environment** (VSCode, Cursor, etc.):
- Can create files directly
- Can read project files automatically
- Can explore file system freely
- Can validate file paths
- Can offer to shard document after creation

**Task Adapts** to environment automatically (Step 4: Document Delivery)

---

## 9. Integration Points

### Integration with Other Tasks

**Upstream Tasks** (Tasks that may trigger this task):
1. **brownfield-create-epic** → After creating a brownfield PRD, may suggest running `document-project` with FOCUSED scope to document affected areas
2. **Manual user invocation** → User directly requests project documentation

**Downstream Tasks** (Tasks this task may trigger):
1. **brownfield-create-epic** → If user chooses "Create PRD first" option (Step 0, Option 1)
2. **advanced-elicitation** → Applied during Step 5 to refine sections based on user feedback
3. **shard-doc** → Optionally offered after document creation to break large document into smaller files

**Parallel Tasks** (Tasks that work with same artifacts):
- None (this task creates new documentation, doesn't modify existing artifacts)

---

### Integration with Agents

**Primary Agents**:
1. **Analyst (Mary)** - Primary agent for this task
   - Uses research and discovery skills
   - Applies elicitation techniques
   - Creates comprehensive documentation

2. **Architect (Winston)** - Alternative agent for this task
   - Uses system design expertise
   - Focuses on architectural patterns
   - Documents technical architecture

**Agent Selection Logic**:
```
IF focus = architectural_patterns AND technical_depth = high:
  → Architect (Winston) is better suited

ELSE IF focus = project_discovery AND user_interaction = high:
  → Analyst (Mary) is better suited

ELSE:
  → Either agent can perform task effectively
```

**Agent Collaboration** (Not typical for this task):
- This is typically a single-agent task
- No handoffs to other agents during execution
- May pass document to other agents (PM, SM, Dev) for their use in subsequent tasks

---

### Integration with Templates

**No Template Dependencies** (This task does NOT use template files from `.bmad-core/templates/`)

**Template-Like Structure** (Embedded in task):
The task instructions contain an embedded document structure (shown in Section 6: Output Specifications) that serves as a template for the generated brownfield architecture document.

**Template Characteristics**:
```yaml
template_type: embedded_structure
format: markdown_outline
sections:
  - Introduction
  - Quick Reference
  - High Level Architecture
  - Source Tree and Module Organization
  - Data Models and APIs
  - Technical Debt and Known Issues
  - Integration Points
  - Development and Deployment
  - Testing Reality
  - [Optional] Enhancement Impact Analysis
  - Appendix

customization: high  # Adapts to actual project structure
rigidity: low        # Structure is guideline, not strict requirement
```

**Why No External Template**:
- Document structure varies significantly based on project type
- Real-world brownfield projects are too diverse for rigid templates
- Embedded outline provides guidance while allowing flexibility
- Agent adapts structure based on actual codebase findings

---

### Integration with Workflows

**Greenfield Workflows**: Not applicable (this is a brownfield-specific task)

**Brownfield Workflows**:

**Workflow 1: PRD-First Brownfield**
```
1. brownfield-create-epic (creates brownfield PRD)
   ↓
2. document-project (FOCUSED scope, documents PRD-relevant areas)
   ↓
3. brownfield-create-story (uses documentation to create stories)
   ↓
4. [Development cycle begins]
```

**Workflow 2: Documentation-First Brownfield**
```
1. document-project (COMPREHENSIVE scope, full codebase documentation)
   ↓
2. brownfield-create-epic (uses documentation to create PRD)
   ↓
3. brownfield-create-story (uses both PRD and documentation)
   ↓
4. [Development cycle begins]
```

**Workflow 3: Targeted Enhancement**
```
1. User provides enhancement description
   ↓
2. document-project (TARGETED scope, focused on described areas)
   ↓
3. brownfield-create-story (simplified story creation for small change)
   ↓
4. [Development begins]
```

**Workflow 4: Existing Codebase Onboarding**
```
1. document-project (COMPREHENSIVE scope, no specific enhancement planned)
   ↓
2. [Documentation used for team onboarding, AI agent familiarization]
   ↓
3. [Future enhancement work begins with existing documentation]
```

---

### Integration with Artifacts

**Input Artifacts** (Read/Analyzed):
```
Existing Codebase:
- Source files (all)
- Configuration files (package.json, etc.)
- Build files (webpack.config.js, etc.)
- Test files
- Documentation files (README.md, docs/*)
- CI/CD configurations

PRD (if provided):
- Brownfield PRD document
- Epic descriptions
- Feature requirements
```

**Output Artifacts** (Created):
```
Primary:
- docs/brownfield-architecture.md (comprehensive brownfield documentation)

Secondary (if offered and accepted):
- docs/architecture/*.md (sharded smaller documents if shard-doc applied)
```

**Artifact Relationships**:
```
document-project creates:
  → docs/brownfield-architecture.md

brownfield-create-epic may use:
  → docs/brownfield-architecture.md (to inform PRD creation)

brownfield-create-story may use:
  → docs/brownfield-architecture.md (to understand existing patterns)

create-next-story may use:
  → docs/brownfield-architecture.md (to gather architecture context - Step 3)

Dev agent may use:
  → docs/brownfield-architecture.md (to understand codebase constraints)
```

---

### State Management

**Task State** (Internal execution state):
```yaml
task_state:
  current_step: 0 | 1 | 2 | 3 | 4 | 5
  scope: null | "FOCUSED" | "TARGETED" | "COMPREHENSIVE"
  prd_provided: boolean
  focus_context: string | null
  analysis_progress: percentage
  user_responses_collected: object

  # Step-specific state
  step_1_discoveries:
    project_structure: object
    tech_stack: object
    build_system: object
    existing_docs: object
    code_patterns: object

  step_2_analysis:
    key_areas: object
    technical_debt: array
    integration_points: array
    user_clarifications: object

  step_3_generation:
    document_sections: array
    content_generated: boolean

  step_5_validation:
    accuracy_validated: boolean
    completeness_validated: boolean
    user_feedback: object
```

**No Persistent State** (Task does not maintain state across sessions):
- Each execution is independent
- No workflow state tracking required
- Output is the state (brownfield architecture document exists or doesn't)

---

## 10. Configuration References

### core-config.yaml Dependencies

**Optional Configuration** (Task works without these):

```yaml
# From core-config.yaml (if present)
project:
  name: string                    # Project name (can be detected from package.json or user-provided)
  type: "greenfield" | "brownfield"  # Project type hint (not critical for this task)

paths:
  docs: "docs/"                   # Documentation output directory (default: "docs/")
  root: "./"                      # Project root path (default: current directory)

documentation:
  standards: string               # Documentation format preferences (optional)
  technical_level: "junior" | "senior" | "mixed"  # Target audience (optional)
```

**Default Behavior** (if config not present):
- Uses current working directory as project root
- Creates documentation in `docs/` directory (creates if doesn't exist)
- Auto-detects project name from package.json or directory name
- Uses balanced technical detail level (mixed)

---

### Environment Variable Dependencies

**No Direct Environment Variables Required**

**Optional Environment Variables** (for enhanced functionality):
```bash
# Not required by task, but may be referenced in generated documentation
NODE_ENV=development|production     # Node.js environment
PYTHONPATH=/path/to/modules          # Python module paths
DATABASE_URL=postgresql://...        # Database connection (documented, not used by task)
API_KEY=...                          # External service keys (documented, not used by task)
```

**Task Behavior**:
- Documents environment variables found in `.env.example` or `.env.template`
- Does NOT require environment variables to execute
- Warns if `.env.example` is missing (good practice to document)

---

### File Location Conventions

**Expected Locations** (Standard conventions, adaptable):

```
project-root/
├── src/                      # Source code (common: src/, app/, lib/)
├── tests/                    # Tests (common: tests/, test/, __tests__/, spec/)
├── docs/                     # Documentation (OUTPUT LOCATION)
│   └── brownfield-architecture.md  # This task's output
├── config/                   # Configurations (common: config/, settings/)
├── package.json              # Node.js dependencies
├── requirements.txt          # Python dependencies
├── README.md                 # Existing documentation
└── .env.example              # Environment variable documentation
```

**Output Location Determination**:
```
IF core-config.yaml exists AND paths.docs defined:
  output_path = paths.docs + "/brownfield-architecture.md"

ELSE IF docs/ directory exists:
  output_path = "docs/brownfield-architecture.md"

ELSE:
  create docs/ directory
  output_path = "docs/brownfield-architecture.md"
```

**File Naming Convention**:
- Primary: `brownfield-architecture.md`
- Alternative: `project-architecture.md` (if user prefers)
- User can override filename if desired

---

### Configuration Precedence

**Priority Order** (Highest to Lowest):

1. **User-provided parameters** (during elicitation)
   - Overrides all other sources
   - Example: User specifies docs should go in `documentation/`

2. **core-config.yaml** (project-specific configuration)
   - Overrides defaults
   - Example: `paths.docs = "technical-docs/"`

3. **Detected conventions** (from codebase exploration)
   - Overrides defaults if confident
   - Example: Existing `docs/` directory found

4. **BMad defaults** (fallback values)
   - Used when no other source available
   - Example: Default to `docs/` directory

---

## 11. Advanced Features & Patterns

### Feature 1: PRD-Focused Adaptive Scoping

**Description**: Dynamically adjusts documentation scope based on PRD availability to avoid over-documenting large codebases.

**Implementation Pattern**:
```
Step 0: PRD Check
  ↓
IF PRD exists:
  Extract affected areas from PRD
  Set scope = FOCUSED
  Analysis focuses ONLY on:
    - Modules mentioned in PRD
    - Integration points for those modules
    - Dependencies of affected modules
    - Technical debt in affected areas

ELSE:
  Present 4-option elicitation
  User chooses scope
  Analysis adapts accordingly
```

**Benefits**:
- Prevents 100+ page documents for large codebases
- Focuses AI agent attention on relevant areas
- Reduces analysis time significantly
- Maintains high quality for relevant content

**ADK Translation Consideration**:
- Reasoning Engine workflow can implement branching logic
- Vertex AI Search can focus document retrieval on relevant sections
- Firestore can store scope metadata for future reference

---

### Feature 2: Reality-First Documentation Philosophy

**Description**: Documents ACTUAL state (including technical debt) rather than aspirational or idealized architecture.

**Key Principles**:
1. **Technical Debt Transparency**
   - Documents workarounds and hacks honestly
   - Explains WHY decisions were made (constraints, legacy reasons)
   - Warns about "DO NOT TOUCH" areas

2. **Pattern Inconsistency Documentation**
   - Notes where different modules use different patterns
   - Documents historical evolution of codebase
   - Identifies areas that violate project conventions

3. **Constraint Documentation**
   - Environment variable hacks (e.g., "Must set X even in staging")
   - Coupling that shouldn't exist but does
   - Performance bottlenecks that are known but unfixed

**Example Documentation Style**:
```markdown
## Payment Service (LEGACY - DO NOT MODIFY)

**File**: `src/legacy/payment.js`
**Pattern**: Callback-based (NOT promises like rest of codebase)
**Status**: Technical debt, tightly coupled to old database schema

**WARNING**: This service is fragile and heavily coupled. Any changes require
extensive manual testing. The team has attempted refactoring 3 times but
backed out due to risk.

**Workaround**: New payment features should use `src/services/paymentV2.js`
and bridge to legacy service only for existing customer migrations.
```

**ADK Translation**:
- Vertex AI agents can be trained to respect documented constraints
- Documentation can include severity levels for constraints
- Constraints can be stored as structured data (Firestore) for rule-based validation

---

### Feature 3: Reference-First Content Strategy

**Description**: Links to actual source files rather than duplicating content in documentation.

**Pattern**:
```markdown
## Data Models

Instead of duplicating model definitions here, see:

- **User Model**: `src/models/User.js` (lines 15-89)
  - Sequelize model with validation rules
  - Includes password hashing pre-hook
  - Relations: hasMany Orders, belongsTo Organization

- **Order Model**: `src/models/Order.js` (lines 22-134)
  - Complex model with status workflow
  - See state machine diagram in comments (lines 30-45)

- **Type Definitions**: `src/types/models.ts`
  - TypeScript interfaces for all models
  - Exported types used throughout application
```

**Benefits**:
- Reduces documentation maintenance burden (source of truth is code)
- Ensures documentation doesn't drift from reality
- Guides AI agents to actual implementation
- Smaller documentation size

**ADK Translation**:
- Cloud Storage can store source files with indexed metadata
- Vertex AI Search can retrieve code snippets on demand
- Documentation provides structured index/roadmap to code

---

### Feature 4: Impact Analysis Integration (PRD-Aware)

**Description**: When PRD is provided, includes dedicated section analyzing what must change for the enhancement.

**Structure**:
```markdown
## Enhancement Impact Analysis

### Planned Enhancement
[Summary from PRD]

### Files That Will Need Modification

1. **User Service** (`src/services/userService.js`)
   - Add new method: `updateUserPreferences(userId, preferences)`
   - Modify: `getUserProfile()` to include preferences
   - Integration: Must call new PreferencesService

2. **User Model** (`src/models/User.js`)
   - Add column: `preferences` (JSONB type)
   - Add validation: preferences schema validation
   - Migration: Create migration file in `migrations/`

### New Files/Modules Needed

1. **PreferencesService** (`src/services/preferencesService.js`)
   - Purpose: Manage user preference logic
   - Pattern to follow: Existing service pattern (see PaymentService)
   - Dependencies: User model, Validator utility

### Integration Considerations

- **Authentication**: New preferences endpoint requires auth middleware
- **Response Format**: Must use existing `responseFormatter.js` pattern
- **Database**: Preferences stored in user table (no new table needed)
- **Caching**: Invalidate user cache when preferences updated
```

**Benefits**:
- Provides clear implementation roadmap
- Identifies all affected areas upfront
- Guides story creation (brownfield-create-story task)
- Helps estimate effort accurately

**ADK Translation**:
- Reasoning Engine can generate this analysis programmatically
- Cloud Functions can validate proposed changes against impact analysis
- Firestore can store impact analysis for tracking

---

### Feature 5: Environment-Adaptive Delivery

**Description**: Automatically adjusts document delivery method based on execution environment (Web UI vs IDE).

**Pattern**:
```python
# Pseudocode for environment detection and delivery

def deliver_document(document_content, environment):
    if environment == "WEB_UI":
        # Cannot create files directly
        response = f"""
        I've generated the brownfield architecture document.
        Please copy and save as: docs/brownfield-architecture.md

        {document_content}

        [Offer to shard if desired]
        """
        return response

    elif environment == "IDE":
        # Can create files directly
        create_file("docs/brownfield-architecture.md", document_content)
        response = f"""
        I've created: docs/brownfield-architecture.md

        [Offer to shard if desired]
        [Offer to add more detail if needed]
        """
        return response
```

**Benefits**:
- Seamless user experience in any environment
- No manual file creation needed in IDE
- Web UI users get clear instructions
- Same task works everywhere

**ADK Translation**:
- Cloud Run service can detect client type (API call vs web UI)
- Different response formats based on client capabilities
- IDE integration via VSCode extension or API

---

### Feature 6: Elicitation-Driven Context Gathering

**Description**: Uses structured elicitation questions to gather user context and preferences, adapting documentation to user needs.

**Elicitation Framework**:
```
Phase 1: Scope Determination (Step 0)
  - 4-option question if no PRD
  - Determines FOCUSED | TARGETED | COMPREHENSIVE

Phase 2: Context Gathering (Step 1)
  - 6 structured questions
  - Gathers purpose, complex areas, expected tasks, standards, detail level, focus

Phase 3: Deep Dive Clarifications (Step 2)
  - 5 clarifying questions
  - Captures custom patterns, critical areas, tribal knowledge, tech debt, change frequency

Phase 4: Validation Refinement (Step 5)
  - Open-ended feedback request
  - Iterative improvement based on user response
```

**Question Design Principles**:
- **Open-ended** where possible (avoid yes/no)
- **Purpose-stated** (explain why asking)
- **Skippable** (provide defaults if user doesn't respond)
- **Contextual** (based on prior discoveries)

**ADK Translation**:
- Vertex AI agents can implement conversational elicitation
- Firestore stores user responses for context
- Reasoning Engine workflow orchestrates multi-turn conversation

---

### Feature 7: Quality Assurance Validation Loop

**Description**: Built-in validation step ensures documentation accuracy, completeness, and clarity before delivery.

**Validation Framework** (5 checks):

1. **Accuracy Check**
   - Verify all file paths exist
   - Confirm technology versions
   - Test build commands
   - Validate configuration details

2. **Completeness Review**
   - All major components documented
   - All directories accounted for
   - All integrations listed
   - Critical tech debt captured

3. **Focus Validation** (if scoped)
   - Relevant areas emphasized
   - Unrelated areas minimized
   - Alignment with PRD/description
   - Impact analysis clarity

4. **Clarity Assessment**
   - Explanations clear for target audience
   - Jargon explained or minimized
   - References unambiguous
   - Navigation structure logical

5. **Navigation Check**
   - TOC accurate
   - Section headers clear
   - Quick Reference usable
   - Cross-references valid

**Implementation**:
```
Step 5: Quality Assurance
  FOR EACH validation_check:
    IF check fails:
      Log issue
      Attempt auto-correction
      IF cannot auto-correct:
        Add to user feedback request

  Present validation results to user
  Offer to refine based on feedback
  Apply advanced-elicitation for refinement
```

**ADK Translation**:
- Cloud Functions can validate file paths and configurations
- Reasoning Engine can assess completeness and clarity
- Automated validation reduces manual review burden

---

## 12. Performance & Scalability Considerations

### Performance Characteristics

**Task Execution Time Estimates**:

```yaml
Small Project (< 100 files, < 5 modules):
  scope_FOCUSED: 3-5 minutes
  scope_TARGETED: 5-8 minutes
  scope_COMPREHENSIVE: 10-15 minutes

Medium Project (100-1000 files, 5-20 modules):
  scope_FOCUSED: 5-10 minutes
  scope_TARGETED: 10-20 minutes
  scope_COMPREHENSIVE: 20-30 minutes

Large Project (1000-10000 files, 20+ modules):
  scope_FOCUSED: 10-20 minutes
  scope_TARGETED: 20-40 minutes
  scope_COMPREHENSIVE: 40-90 minutes (WARNING: May timeout)

Very Large Project (> 10000 files):
  scope_FOCUSED: 20-40 minutes
  scope_TARGETED: 40-90 minutes
  scope_COMPREHENSIVE: 90+ minutes (RECOMMEND: Module-by-module approach)
```

**Time Breakdown**:
```
Step 0: PRD Check & Scope (1-2 min)
Step 1: Initial Analysis (10-20% of total time)
Step 2: Deep Analysis (40-50% of total time)  ← Longest step
Step 3: Document Generation (20-30% of total time)
Step 4: Delivery (< 1 min)
Step 5: Validation (10-20% of total time)
```

---

### Scalability Strategies

**Strategy 1: Scope-Based Pruning (Built-in)**
```
IF scope = FOCUSED:
  - Only analyze PRD-relevant areas
  - Skip unrelated modules entirely
  - Reduce analysis time by 60-80%

IF scope = TARGETED:
  - Analyze described areas + dependencies
  - Skip clearly unrelated areas
  - Reduce analysis time by 40-60%

IF scope = COMPREHENSIVE:
  - Analyze entire codebase
  - WARNING: May be slow for large projects
  - Recommend switching to FOCUSED/TARGETED if > 30 min
```

**Strategy 2: Progressive Analysis (Future Enhancement)**
```
FOR very_large_codebases:
  1. Quick high-level scan (5 min)
  2. Present findings to user
  3. Ask user to identify priority areas
  4. Deep dive only priority areas
  5. Shallow analysis for remaining areas
```

**Strategy 3: Module-by-Module Documentation (Alternative Approach)**
```
FOR extremely_large_codebases:
  - Recommend creating separate docs per module
  - Each module doc < 20 pages
  - Index document links to all module docs
  - Enables parallel documentation if needed
```

**Strategy 4: Intelligent Sampling (Future Enhancement)**
```
FOR large_codebases:
  - Sample representative files instead of all files
  - Identify patterns from samples
  - Document patterns rather than exhaustively listing all files
  - Note areas requiring deep dive vs areas with consistent patterns
```

---

### Resource Utilization

**Memory Considerations**:
```
File System Exploration:
  - Low memory usage (streaming file reads)
  - No large data structures held in memory
  - File paths and metadata only

Document Generation:
  - Medium memory usage
  - Complete document held in memory before writing
  - Typical document size: 50-500 KB

Very Large Projects:
  - May need chunked processing
  - Generate sections sequentially
  - Write to file incrementally if needed
```

**File System Access Patterns**:
```
Read-Heavy:
  - Many small file reads (configs, package files)
  - Directory listings (recursive exploration)
  - Sampling reads (pattern identification)

Write-Light:
  - Single file write (final document)
  - No intermediate file creation
  - No caching to disk

Optimization:
  - Batch file existence checks
  - Cache directory listings
  - Parallel file reads where possible
```

---

### Timeout Handling

**Timeout Thresholds**:
```
WARNING_THRESHOLD = 30 minutes
  → Warn user analysis is taking longer than expected
  → Offer to refocus scope

HARD_TIMEOUT = 60 minutes
  → Stop analysis
  → Present partial findings
  → Recommend module-by-module approach
```

**Timeout Recovery**:
```
IF timeout approaching:
  1. Save partial analysis state
  2. Present what has been found so far
  3. Offer to continue with reduced scope
  4. OR Offer to complete high-priority areas only
  5. OR Recommend rescheduling for smaller chunks
```

---

### Caching Opportunities (Future Enhancement)

**Potential Caching Strategies**:

```yaml
project_structure_cache:
  key: project_root_path + last_modified_timestamp
  value: directory_tree + file_inventory
  ttl: 24_hours
  benefit: Skip Step 1 if codebase unchanged

tech_stack_cache:
  key: hash(package.json) + hash(requirements.txt) + ...
  value: parsed_dependencies
  ttl: 7_days
  benefit: Skip dependency parsing

pattern_analysis_cache:
  key: project_root_path + hash(sample_files)
  value: identified_patterns + conventions
  ttl: 7_days
  benefit: Skip pattern analysis if consistent
```

**Cache Invalidation**:
```
Invalidate when:
  - Dependency files modified (package.json, etc.)
  - Project structure changes (new directories)
  - User requests fresh analysis (force flag)
```

---

## 13. Security & Privacy Considerations

### Sensitive Information Handling

**CRITICAL RULE**: Document structure and patterns, NOT secrets or credentials.

**Sensitive Data Categories**:

```yaml
NEVER_DOCUMENT:
  - API keys, tokens, passwords
  - Database credentials
  - Private keys, certificates
  - Personal user data (emails, names, etc.)
  - Proprietary business logic (if requested)
  - Trade secrets

DOCUMENT_WITH_CARE:
  - Configuration patterns (but not actual values)
  - Authentication mechanisms (architecture, not secrets)
  - Database schema (structure, not data)
  - Third-party service names (but not keys)
  - File paths (may reveal organizational structure)

SAFE_TO_DOCUMENT:
  - Technology stack (languages, frameworks)
  - Project structure (directories, modules)
  - Code patterns and conventions
  - Build and deployment processes
  - Technical debt and workarounds
  - Integration architecture (types, not credentials)
```

---

### Sensitive File Detection

**Files to Avoid Documenting Content From**:
```
.env                    # Environment variables (may contain secrets)
.env.local              # Local overrides (may contain secrets)
secrets.json            # Obvious secrets file
credentials.json        # Credentials
*.pem, *.key            # Private keys
config/production.yml   # Production configs (may have credentials)
*.p12, *.pfx            # Certificates
```

**Safe to Document**:
```
.env.example            # Template (no actual secrets)
.env.template           # Template (no actual secrets)
config/app.config.js    # Application config structure (not values)
```

**Detection Pattern**:
```
IF file matches sensitive_pattern:
  - Note file EXISTS and its purpose
  - Note file is REQUIRED for configuration
  - Do NOT include actual content
  - Do NOT include example values if they might be real

EXAMPLE:
  ✅ "Configuration requires .env file with DATABASE_URL, API_KEY, and SECRET_TOKEN"
  ❌ "DATABASE_URL=postgresql://admin:password@localhost/db"
```

---

### Code Security Analysis

**What to Document**:
```
Security Architecture:
  - Authentication mechanism type (JWT, OAuth, sessions)
  - Authorization pattern (RBAC, ABAC, etc.)
  - Encryption approach (at rest, in transit)
  - Security middleware (rate limiting, CORS, etc.)

Security Issues (Technical Debt):
  - Known vulnerabilities in dependencies
  - Missing security features (e.g., "No rate limiting")
  - Insecure patterns (e.g., "SQL injection risk in legacy module")
  - Unpatched security issues
```

**Security Documentation Example**:
```markdown
## Security Architecture

### Authentication
- **Mechanism**: JWT-based authentication
- **Implementation**: `src/middleware/auth.js`
- **Token Storage**: HTTP-only cookies
- **Refresh Strategy**: Refresh tokens in database

### Known Security Issues (Technical Debt)
1. **SQL Injection Risk** - Legacy payment module uses string concatenation
   - **File**: `src/legacy/payment.js` (lines 45-67)
   - **Severity**: HIGH
   - **Mitigation**: Input validation added, but full refactor needed
   - **Status**: On security backlog

2. **Missing Rate Limiting** - Public API endpoints lack rate limiting
   - **Affected**: `/api/public/*`
   - **Severity**: MEDIUM
   - **Mitigation**: None currently
   - **Status**: Planned for Q2
```

---

### Privacy Considerations

**User Data Documentation**:
```
DO:
  - Document what types of data are collected (e.g., "user emails and names")
  - Document data models and schemas (structure only)
  - Document retention policies if documented in code

DON'T:
  - Include actual user data in documentation
  - Include sample data that looks real
  - Document internal user IDs or identifiers
```

**Compliance References**:
```
IF project handles:
  - PII (Personally Identifiable Information): Note GDPR/CCPA considerations
  - Health data: Note HIPAA considerations
  - Financial data: Note PCI-DSS considerations
  - Children's data: Note COPPA considerations

DOCUMENT:
  - What compliance frameworks apply
  - Where compliance logic lives
  - Data retention policies
  - Anonymization/encryption approaches
```

---

### Access Control Documentation

**Safe Documentation Practice**:
```markdown
## Access Control

### Role-Based Permissions
- **Implementation**: `src/middleware/rbac.js`
- **Roles**: Admin, Manager, User, Guest (defined in `src/config/roles.js`)
- **Permission System**: Action-based (read, write, delete) per resource type

### Authentication Flow
1. User submits credentials to `/auth/login`
2. Server validates against database
3. JWT token issued with role claims
4. Subsequent requests include token in Authorization header
5. Middleware validates token and checks role permissions

### Known Issues
- **Privilege Escalation Risk**: Legacy admin panel lacks role checks
  - **File**: `src/admin/legacy-panel.js`
  - **Status**: Access restricted at network level (temp mitigation)
```

---

### Proprietary Information Protection

**Handling Proprietary Code**:
```
IF user indicates code is proprietary:
  - Document architecture and patterns (generic)
  - Avoid documenting specific business logic
  - Focus on technical structure, not domain logic
  - Use generic names for proprietary algorithms

EXAMPLE:
  ✅ "Proprietary pricing algorithm implemented in PricingEngine.calculate()"
  ❌ "Pricing algorithm: price = base * (1 + margin) * locationMultiplier * ..."
```

**User Consent**:
```
IF documenting code that may be proprietary:
  ASK: "This appears to be proprietary business logic. Should I:
        1. Document the architecture but not the specific algorithm
        2. Document generically (e.g., 'custom pricing logic')
        3. Skip this section entirely
        Please let me know your preference."
```

---

## 14. Testing & Validation Strategy

### Quality Validation Framework

**Validation occurs in Step 5: Quality Assurance**

**Five-Part Validation Process**:

1. **Accuracy Check** → Ensures technical details match reality
2. **Completeness Review** → Ensures all major components documented
3. **Focus Validation** → Ensures scope adherence (if focused/targeted)
4. **Clarity Assessment** → Ensures AI agent comprehension
5. **Navigation Check** → Ensures usable structure

---

### Validation 1: Accuracy Check

**Objective**: Verify all documented technical details match the actual codebase.

**Automated Checks** (where possible):
```yaml
file_path_validation:
  - FOR EACH referenced file path in document:
      - Verify file exists at specified location
      - If file missing: Flag for correction or note as deleted

technology_version_validation:
  - FOR EACH technology with version (e.g., "Node.js 16.x"):
      - Cross-reference with package.json, .nvmrc, etc.
      - If mismatch: Correct version in document

build_command_validation:
  - FOR EACH documented build command:
      - Verify command exists in package.json scripts or Makefile
      - If command missing: Note as potentially outdated

configuration_validation:
  - FOR EACH configuration detail:
      - Verify against actual config files
      - If mismatch: Correct or flag for user confirmation
```

**Manual Checks** (require judgment):
```yaml
pattern_accuracy:
  - Sample code to verify documented patterns are actually used
  - Check if anti-patterns are accurately described
  - Validate architectural descriptions match code structure

technical_debt_accuracy:
  - Cross-reference technical debt claims with actual code
  - Verify workarounds still exist
  - Check if "DO NOT MODIFY" warnings are still relevant
```

**Validation Output**:
```
Accuracy Issues Found: [count]
  - Missing file paths: [list]
  - Version mismatches: [list]
  - Invalid commands: [list]
  - Pattern inaccuracies: [list]

Action: Correct issues before finalizing document
```

---

### Validation 2: Completeness Review

**Objective**: Ensure all major system components are documented (within scope).

**Component Checklist**:
```yaml
IF scope = COMPREHENSIVE:
  components_to_check:
    - [ ] All source directories documented
    - [ ] All configuration files mentioned
    - [ ] All build/deployment processes described
    - [ ] All external integrations listed
    - [ ] All major modules/services documented
    - [ ] Test framework and coverage noted
    - [ ] Development setup instructions included
    - [ ] Critical technical debt captured

IF scope = FOCUSED OR TARGETED:
  components_to_check:
    - [ ] All PRD-mentioned areas documented
    - [ ] All integration points for affected areas listed
    - [ ] All dependencies of affected modules noted
    - [ ] Impact analysis complete (if PRD provided)
    - [ ] Related technical debt captured
```

**Coverage Assessment**:
```
Expected Coverage (based on scope):
  COMPREHENSIVE: 100% of codebase
  FOCUSED: 100% of PRD-relevant areas
  TARGETED: 100% of user-described areas + dependencies

Actual Coverage: [percentage]

Missing Coverage:
  - [list of areas not documented that should be]

Action:
  IF critical areas missing:
    → Add sections for missing areas
  ELSE IF minor gaps:
    → Note gaps, ask user if important
```

---

### Validation 3: Focus Validation (Scoped Documentation)

**Objective**: Ensure scoped documentation stays focused and emphasizes relevant areas.

**Only Applied If**: scope = FOCUSED OR TARGETED

**Validation Criteria**:
```yaml
focus_adherence:
  - [ ] Relevant areas have detailed documentation (not just mentioned)
  - [ ] Unrelated areas are minimized or omitted
  - [ ] Document structure prioritizes focus areas (Quick Reference, etc.)
  - [ ] Impact analysis (if PRD) clearly maps to focus areas

emphasis_check:
  - PRD-mentioned modules: Should have detailed sections
  - Related modules: Should have moderate detail
  - Unrelated modules: Should be minimal or omitted

content_ratio:
  - Focused areas: 70-80% of document content
  - Related areas: 15-25% of document content
  - General info: 5-10% of document content
```

**Validation Output**:
```
IF focus drift detected:
  WARNING: Document includes excessive detail on unrelated areas
  Suggestion: Reduce detail in [list of sections] to maintain focus

IF focus insufficient:
  WARNING: Focused areas lack depth
  Suggestion: Expand detail in [list of sections] to meet needs
```

---

### Validation 4: Clarity Assessment

**Objective**: Ensure documentation is clear and comprehensible for AI agents (and humans).

**Clarity Criteria**:
```yaml
language_clarity:
  - [ ] Explanations are concise and direct
  - [ ] Technical jargon is explained or minimized
  - [ ] Acronyms are defined on first use
  - [ ] Sentences are clear and unambiguous

reference_clarity:
  - [ ] File paths are absolute or clearly relative
  - [ ] Code references include line numbers where helpful
  - [ ] Links to external resources are valid
  - [ ] Cross-references within document are clear

structural_clarity:
  - [ ] Section headers clearly describe content
  - [ ] Logical flow from high-level to detailed
  - [ ] Related information is grouped together
  - [ ] Quick Reference enables fast navigation

ai_comprehension:
  - [ ] AI agent can understand system architecture
  - [ ] AI agent can locate key files
  - [ ] AI agent can identify constraints
  - [ ] AI agent can understand technical debt implications
```

**Target Audience Adaptation**:
```
IF technical_detail_level = "junior":
  - More explanations of concepts
  - Simpler language
  - More examples
  - Less assumed knowledge

IF technical_detail_level = "senior":
  - Technical depth prioritized
  - Less explanation of common concepts
  - More architectural insight
  - Assumes familiarity with patterns

IF technical_detail_level = "mixed":
  - Balanced approach
  - Explain complex concepts
  - Provide depth where needed
```

---

### Validation 5: Navigation Check

**Objective**: Ensure document structure supports efficient navigation and lookup.

**Navigation Elements**:
```yaml
table_of_contents:
  - [ ] TOC is complete and accurate
  - [ ] Section numbering is consistent
  - [ ] Nesting levels are appropriate (not too deep)
  - [ ] TOC links work (if in web format)

quick_reference_section:
  - [ ] Lists critical files with paths
  - [ ] Lists key entry points
  - [ ] Lists important commands
  - [ ] Enables fast lookup without reading entire doc

section_headers:
  - [ ] Descriptive and unique
  - [ ] Follow consistent naming pattern
  - [ ] Easy to scan visually
  - [ ] Numbered for easy reference

cross_references:
  - [ ] Internal links are valid
  - [ ] "See [Section X]" references are accurate
  - [ ] External links work
  - [ ] File path references are correct
```

**Usability Testing**:
```
Scenario 1: "Find the main entry point"
  - Can AI agent locate main file from Quick Reference? YES/NO
  - Time to find: [expected < 10 seconds]

Scenario 2: "Understand authentication mechanism"
  - Can AI agent find authentication section? YES/NO
  - Can AI agent understand how auth works? YES/NO

Scenario 3: "Identify technical debt in payment module"
  - Can AI agent locate Technical Debt section? YES/NO
  - Can AI agent find payment-specific debt? YES/NO

Scenario 4: "Determine files to modify for enhancement"
  - Can AI agent locate Impact Analysis section? YES/NO
  - Can AI agent list all files requiring changes? YES/NO
```

---

### User Validation (Step 5: Interaction Point 5)

**User Feedback Loop**:
```
After completing automated validation:

1. Present document to user
2. Highlight key sections for review:
   - Project structure and organization
   - Technology stack and dependencies
   - Technical debt and workarounds
   - Integration points
   - [If PRD] Enhancement impact analysis

3. Request feedback:
   - "Does this accurately reflect your codebase?"
   - "Are there any areas needing more detail?"
   - "Are there any inaccuracies or corrections?"
   - "Would you like me to expand any sections?"

4. Iterate based on feedback:
   - IF user requests changes: Apply advanced-elicitation for refinement
   - IF user approves: Finalize document
   - IF user identifies gaps: Add missing sections
```

---

### Validation Success Criteria

**Document is considered validated when**:
```
✅ All file paths verified as existing
✅ All technology versions match source files
✅ All build commands verified in package.json/Makefile
✅ All major components documented (within scope)
✅ Focused areas emphasized appropriately (if scoped)
✅ Language is clear for target audience
✅ Navigation structure supports efficient lookup
✅ User review complete with feedback incorporated
✅ No critical gaps or inaccuracies remain
```

---

## 15. Common Patterns & Anti-Patterns

### Pattern 1: Progressive Detail Gathering

**Description**: Start with high-level discovery, progressively gather details based on scope and user feedback.

**Implementation**:
```
Step 1: High-Level Discovery (10-20% time)
  - Quick scan of project structure
  - Identify major technologies
  - Understand overall organization

Step 2: Deep Analysis (40-50% time)
  - Focus on prioritized areas
  - Gather technical details
  - Explore integration points

User Feedback Points:
  - After Step 1: Confirm direction, adjust scope if needed
  - After Step 2: Validate findings, identify missing areas
  - After Step 3: Review generated doc, request refinements
```

**Benefits**:
- Avoids over-analyzing irrelevant areas
- Allows course correction mid-task
- User involvement improves accuracy

**Anti-Pattern**: ❌ Deep-dive everything upfront before understanding scope
- Wastes time on irrelevant areas
- May timeout on large projects
- User can't provide input until too late

---

### Pattern 2: Reality-First, Aspiration-Second

**Description**: Document ACTUAL state first, note aspirational future state separately (if at all).

**Implementation**:
```markdown
## Module Organization (ACTUAL STATE)

Current structure uses mixed patterns:
- User module: Service pattern with dependency injection
- Payment module: Legacy callback pattern (technical debt)
- Admin module: MVC pattern (oldest code)

### Future State (Planned Refactoring)
Team plans to standardize on service pattern, but legacy payment
module will remain as-is due to tight coupling and risk.
```

**Benefits**:
- AI agents understand what they'll actually encounter
- Prevents confusion between current and planned state
- Highlights technical debt honestly

**Anti-Pattern**: ❌ Document aspirational architecture as if it's current state
- AI agents expect code patterns that don't exist
- Confusion when reality doesn't match documentation
- Misleading for new team members

---

### Pattern 3: Reference-First, Duplication-Last

**Description**: Link to source files rather than duplicating content.

**Implementation**:
```markdown
## Data Models

See actual model definitions:
- User Model: `src/models/User.js` (Sequelize with validation)
- Order Model: `src/models/Order.js` (Complex status workflow)
- Product Model: `src/models/Product.js`

For TypeScript type definitions: `src/types/models.ts`

### Key Model Characteristics
- All models use Sequelize ORM
- Validation hooks defined at model level
- Relationships defined in `src/models/index.js`
```

**Benefits**:
- Keeps documentation concise
- Source code is single source of truth
- Less maintenance burden (no drift)

**Anti-Pattern**: ❌ Duplicate entire model definitions in documentation
- Creates drift when models change
- Bloats documentation size
- Maintenance nightmare

---

### Pattern 4: Scope-Adaptive Analysis

**Description**: Adjust depth of analysis based on scope (FOCUSED/TARGETED/COMPREHENSIVE).

**Implementation**:
```
IF scope = COMPREHENSIVE:
  analyze_depth = FULL
  modules_to_analyze = ALL

IF scope = FOCUSED (PRD provided):
  analyze_depth = FULL for PRD areas, MINIMAL for others
  modules_to_analyze = PRD-mentioned + dependencies

IF scope = TARGETED (user-described):
  analyze_depth = FULL for described areas, MODERATE for related
  modules_to_analyze = User-described + integration points
```

**Benefits**:
- Efficient use of time
- Avoids over-documenting large codebases
- Focuses effort where it matters

**Anti-Pattern**: ❌ Always analyze everything exhaustively
- Wastes time on irrelevant areas
- May timeout on large projects
- Creates excessively large documents

---

### Pattern 5: Constraint-Aware Documentation

**Description**: Explicitly document constraints, gotchas, and "DO NOT TOUCH" areas.

**Implementation**:
```markdown
## Payment Service ⚠️ FRAGILE - DO NOT MODIFY

**File**: `src/legacy/payment.js`
**Created**: 2018 (legacy code, pre-dates current architecture)
**Pattern**: Callback-based (inconsistent with rest of codebase)

### CRITICAL CONSTRAINTS
1. **Tightly Coupled**: Direct database queries, bypasses ORM
2. **No Tests**: Zero test coverage, manual testing required
3. **Production Dependencies**: 10,000+ active customers use this code
4. **Failed Refactoring**: 3 previous attempts backed out due to risk

### Workaround for New Features
New payment features should use `PaymentServiceV2` (src/services/paymentV2.js)
and bridge to legacy service only for existing customer data migrations.

### Technical Debt Status
- Priority: P1 (high business risk)
- Effort Estimate: 6-8 weeks
- Status: On backlog, no timeline set
```

**Benefits**:
- AI agents respect constraints
- Prevents accidental breaking of fragile code
- Guides safe enhancement approaches

**Anti-Pattern**: ❌ Document only "clean" parts, hide technical debt
- AI agents unknowingly break fragile code
- Repeats past mistakes
- Surprises new team members

---

### Pattern 6: Impact-First for PRD-Focused Docs

**Description**: When PRD is provided, lead with impact analysis in Quick Reference.

**Implementation**:
```markdown
## Quick Reference

### Enhancement: Add User Preferences (from PRD)

**Files to Modify**:
1. `src/services/userService.js` - Add preference methods
2. `src/models/User.js` - Add preferences column
3. `src/routes/userRoutes.js` - Add preference endpoints

**New Files Needed**:
1. `src/services/preferencesService.js` - New service
2. `migrations/YYYYMMDD-add-user-preferences.js` - DB migration

**Integration Points**:
- Authentication middleware (existing)
- Response formatter (src/utils/responseFormatter.js)
- User cache invalidation (src/utils/cache.js)

[Rest of documentation follows...]
```

**Benefits**:
- Developers immediately see what needs to change
- Quick understanding of scope
- Story creation is easier

**Anti-Pattern**: ❌ Bury impact analysis at end of 50-page document
- Developers have to hunt for actionable info
- Reduced utility for enhancement work

---

### Pattern 7: Environment-Adaptive Delivery

**Description**: Adjust delivery method based on environment capabilities.

**Implementation**:
```python
# Pseudocode
def deliver_document(content, environment):
    if environment.can_create_files:
        # IDE environment
        create_file("docs/brownfield-architecture.md", content)
        notify_user("Created: docs/brownfield-architecture.md")
        offer_to_shard()
    else:
        # Web UI environment
        present_content(content)
        instruct_user("Please save as: docs/brownfield-architecture.md")
        mention_sharding_option()
```

**Benefits**:
- Seamless experience in any environment
- No manual file creation in IDE
- Clear instructions in Web UI

**Anti-Pattern**: ❌ Always dump content in response and ask user to save
- Poor UX in IDE (manual copy-paste unnecessary)
- Inconsistent with other BMad tasks

---

### Anti-Pattern 1: Hallucinating Features ❌

**Problem**: Documenting features, capabilities, or patterns that don't actually exist.

**Example**:
```
❌ BAD:
"This project uses comprehensive error handling with try-catch blocks
and centralized error logging."

Reality: Only 30% of code has error handling, no centralized logging.

✅ GOOD:
"Error handling is inconsistent across the codebase:
- User module: Try-catch with centralized logging
- Payment module (legacy): No error handling (relies on callbacks)
- Admin module: Basic try-catch, logs to console

Technical Debt: Standardize error handling across all modules."
```

**Prevention**:
- Always verify claims against actual code
- Sample files to confirm patterns
- Document inconsistencies honestly

---

### Anti-Pattern 2: Aspirational Documentation ❌

**Problem**: Documenting planned/desired state instead of actual current state.

**Example**:
```
❌ BAD:
"All services follow RESTful API design with consistent response formats."

Reality: Legacy services use different formats, only new services are RESTful.

✅ GOOD:
"API design is evolving:
- New services (UserServiceV2, ProductService): RESTful with standard response format
- Legacy services (PaymentService, AdminService): Custom formats, non-RESTful
- Response Format Standard: See src/utils/responseFormatter.js (new services only)

Migration to standard format is planned but no timeline set."
```

**Prevention**:
- Step 2 explicitly maps "REALITY"
- Validation step checks against actual code
- Separate "Current State" from "Future Plans" if needed

---

### Anti-Pattern 3: Scope Creep ❌

**Problem**: In FOCUSED mode, analyzing and documenting unrelated areas.

**Example**:
```
❌ BAD (FOCUSED on user preferences enhancement):
Document includes:
- Complete database schema (all 50 tables)
- Full API reference (200+ endpoints)
- Entire frontend architecture
- All microservices in ecosystem

✅ GOOD (FOCUSED on user preferences enhancement):
Document includes:
- User service (affected)
- User model and preferences schema
- User-related API endpoints
- Integration with auth and caching
- Brief mention of unaffected areas ("See existing docs")
```

**Prevention**:
- Step 0 sets scope clearly
- Step 2 focuses analysis on relevant areas only
- Validation 3 checks focus adherence

---

### Anti-Pattern 4: Secret Exposure ❌

**Problem**: Including API keys, passwords, or sensitive configuration values in documentation.

**Example**:
```
❌ BAD:
"Set DATABASE_URL=postgresql://admin:SecretPass123@prod.db.com/mydb"

✅ GOOD:
"Configuration requires DATABASE_URL environment variable.
See .env.example for required format. Actual credentials in secure vault."
```

**Prevention**:
- Sensitive file detection (Section 13)
- Document structure, not values
- Validation check for potential secrets

---

## 16. ADK Translation & Implementation Recommendations

### ADK Architecture for document-project Task

**Recommended Implementation**: Reasoning Engine Workflow + Cloud Functions

**Justification**:
- **Medium-High Complexity**: Multi-step process with branching logic
- **User Interaction Required**: Elicitation questions throughout execution
- **File System Analysis**: Extensive codebase exploration needed
- **LLM-Heavy**: Requires pattern recognition and natural language generation
- **State Management**: Needs to track analysis progress and user responses

---

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Vertex AI Agent: Analyst                     │
│                                                                  │
│  Tools:                                                          │
│  - execute_document_project (→ Reasoning Engine Workflow)        │
│  - explore_file_system (→ Cloud Function)                        │
│  - analyze_dependencies (→ Cloud Function)                       │
│  - generate_documentation (→ Cloud Function w/ LLM)              │
│  - validate_documentation (→ Cloud Function)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Reasoning Engine: DocumentProjectWorkflow          │
│                                                                  │
│  Orchestrates 5-step process:                                   │
│  Step 0: PRD Check & Scope Determination                        │
│  Step 1: Initial Project Analysis (calls Cloud Functions)       │
│  Step 2: Deep Codebase Analysis (calls Cloud Functions)         │
│  Step 3: Documentation Generation (calls LLM Function)          │
│  Step 4: Environment-Adaptive Delivery                          │
│  Step 5: Quality Validation (calls Validation Function)         │
│                                                                  │
│  Manages state, branching, user interactions                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
    ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
    │ Cloud        │ │ Cloud       │ │ Cloud        │
    │ Function:    │ │ Function:   │ │ Function:    │
    │ FileSystem   │ │ Dependency  │ │ DocGen       │
    │ Explorer     │ │ Analyzer    │ │ (LLM-based)  │
    └──────────────┘ └─────────────┘ └──────────────┘
                ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer (GCP Services)                     │
│                                                                  │
│  ┌──────────────────┐  ┌───────────────────┐  ┌──────────────┐ │
│  │ Cloud Storage    │  │ Firestore         │  │ Vertex AI    │ │
│  │ - Source code    │  │ - Analysis state  │  │ LLM          │ │
│  │ - PRD docs       │  │ - User responses  │  │ (Gemini)     │ │
│  │ - Output docs    │  │ - Scope metadata  │  │              │ │
│  └──────────────────┘  └───────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

### Reasoning Engine Workflow Implementation

**File**: `reasoning_engine/workflows/document_project_workflow.py`

```python
from google.cloud import aiplatform
from vertexai.preview import reasoning_engines
import os

class DocumentProjectWorkflow:
    """
    Reasoning Engine workflow for document-project task.
    Implements the 5-step brownfield documentation process.
    """

    def __init__(self, config):
        self.config = config
        self.firestore = firestore.Client()
        self.storage = storage.Client()
        self.llm = aiplatform.gapic.PredictionServiceClient()

    def execute(
        self,
        project_path: str,
        project_name: str,
        prd_path: str = None,
        user_context: dict = None
    ) -> dict:
        """Main execution flow for brownfield documentation."""

        # Initialize workflow state
        state = self._initialize_state(project_path, project_name)

        # Step 0: PRD Check & Scope Determination
        state = self._step0_scope_determination(state, prd_path)

        # User interaction: Elicit scope if needed
        if state['scope'] is None:
            state = self._elicit_scope(state)

        # Step 1: Initial Project Analysis
        state = self._step1_initial_analysis(state)

        # User interaction: Gather context
        state = self._elicit_context(state, user_context)

        # Step 2: Deep Codebase Analysis
        state = self._step2_deep_analysis(state)

        # User interaction: Clarifying questions
        state = self._elicit_clarifications(state)

        # Step 3: Core Documentation Generation
        state = self._step3_generate_documentation(state)

        # Step 4: Document Delivery
        output = self._step4_deliver_document(state)

        # Step 5: Quality Assurance
        validation_results = self._step5_validate(state, output)

        # User interaction: Validation feedback
        if not validation_results['approved']:
            state = self._elicit_refinements(state, validation_results)
            state = self._step3_generate_documentation(state)  # Regenerate
            output = self._step4_deliver_document(state)

        return {
            "document": output['document_content'],
            "filepath": output['filepath'],
            "scope": state['scope'],
            "validation": validation_results,
            "metadata": state['metadata']
        }

    def _initialize_state(self, project_path, project_name):
        """Initialize workflow state."""
        return {
            'project_path': project_path,
            'project_name': project_name,
            'scope': None,  # Will be set in step 0
            'prd_content': None,
            'focus_areas': [],
            'discoveries': {},
            'user_context': {},
            'metadata': {
                'started_at': datetime.utcnow(),
                'step': 0
            }
        }

    def _step0_scope_determination(self, state, prd_path):
        """Step 0: Check for PRD and determine scope."""
        state['metadata']['step'] = 0

        # Check for PRD
        if prd_path and os.path.exists(prd_path):
            # Load and parse PRD
            state['prd_content'] = self._load_prd(prd_path)
            state['focus_areas'] = self._extract_focus_from_prd(state['prd_content'])
            state['scope'] = 'FOCUSED'
        else:
            # No PRD - will elicit scope from user
            state['scope'] = None  # Triggers elicitation

        self._persist_state(state)
        return state

    def _step1_initial_analysis(self, state):
        """Step 1: Initial project analysis."""
        state['metadata']['step'] = 1

        # Call Cloud Functions for discovery
        project_structure = self._discover_project_structure(state['project_path'])
        tech_stack = self._identify_tech_stack(state['project_path'])
        build_system = self._analyze_build_system(state['project_path'])
        existing_docs = self._review_existing_docs(state['project_path'])

        state['discoveries']['structure'] = project_structure
        state['discoveries']['tech_stack'] = tech_stack
        state['discoveries']['build_system'] = build_system
        state['discoveries']['existing_docs'] = existing_docs

        self._persist_state(state)
        return state

    def _step2_deep_analysis(self, state):
        """Step 2: Deep codebase analysis."""
        state['metadata']['step'] = 2

        # Scope-aware analysis
        if state['scope'] == 'FOCUSED':
            analysis_targets = state['focus_areas']
        elif state['scope'] == 'TARGETED':
            analysis_targets = state['user_context'].get('target_areas', [])
        else:  # COMPREHENSIVE
            analysis_targets = state['discoveries']['structure']['all_modules']

        # Deep exploration
        technical_debt = self._identify_technical_debt(
            state['project_path'],
            analysis_targets
        )
        integration_points = self._map_integration_points(
            state['project_path'],
            analysis_targets
        )
        code_patterns = self._analyze_code_patterns(
            state['project_path'],
            analysis_targets
        )

        state['discoveries']['technical_debt'] = technical_debt
        state['discoveries']['integration_points'] = integration_points
        state['discoveries']['code_patterns'] = code_patterns

        self._persist_state(state)
        return state

    def _step3_generate_documentation(self, state):
        """Step 3: Generate brownfield architecture document using LLM."""
        state['metadata']['step'] = 3

        # Prepare prompt for LLM
        prompt = self._build_documentation_prompt(state)

        # Call Vertex AI LLM (Gemini) to generate document
        response = self.llm.predict(
            endpoint=self.config['llm_endpoint'],
            instances=[{"prompt": prompt}],
            parameters={
                "temperature": 0.3,  # Lower for factual documentation
                "max_output_tokens": 8000,  # Long document
                "top_p": 0.95
            }
        )

        state['generated_document'] = response.predictions[0]['content']

        self._persist_state(state)
        return state

    def _step4_deliver_document(self, state):
        """Step 4: Deliver document based on environment."""
        state['metadata']['step'] = 4

        document_content = state['generated_document']

        # Determine environment (from request context)
        environment = self._detect_environment()

        if environment == 'IDE':
            # Create file directly
            filepath = os.path.join(
                state['project_path'],
                'docs',
                'brownfield-architecture.md'
            )
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'w') as f:
                f.write(document_content)

            output = {
                'delivery_mode': 'file_created',
                'filepath': filepath,
                'document_content': document_content,
                'message': f"Created: {filepath}"
            }
        else:  # WEB_UI
            # Return content for user to save
            output = {
                'delivery_mode': 'content_provided',
                'filepath': 'docs/brownfield-architecture.md',
                'document_content': document_content,
                'message': "Please save this document as: docs/brownfield-architecture.md"
            }

        return output

    def _step5_validate(self, state, output):
        """Step 5: Quality assurance validation."""
        state['metadata']['step'] = 5

        # Call validation Cloud Function
        validation_results = self._validate_documentation(
            state['project_path'],
            output['document_content'],
            state['scope']
        )

        # Check validation results
        all_passed = all([
            validation_results['accuracy_check']['passed'],
            validation_results['completeness_check']['passed'],
            validation_results['clarity_check']['passed'],
            validation_results['navigation_check']['passed']
        ])

        return {
            'approved': all_passed,
            'results': validation_results
        }

    # Elicitation methods (user interaction)
    def _elicit_scope(self, state):
        """Elicit scope preference from user (4-option question)."""
        # This would trigger user interaction in the agent
        # Return value would come from user response
        pass

    def _elicit_context(self, state, user_context):
        """Elicit context via 6 structured questions."""
        # Would trigger conversational elicitation
        pass

    def _elicit_clarifications(self, state):
        """Elicit clarifications via 5 deep dive questions."""
        # Would trigger follow-up questions based on findings
        pass

    def _elicit_refinements(self, state, validation_results):
        """Elicit refinement requests based on validation."""
        # Would ask user to review and provide feedback
        pass

    # Helper methods for Cloud Function calls
    def _discover_project_structure(self, project_path):
        """Call FileSystemExplorer Cloud Function."""
        # HTTP POST to Cloud Function
        pass

    def _identify_tech_stack(self, project_path):
        """Call DependencyAnalyzer Cloud Function."""
        pass

    def _validate_documentation(self, project_path, document, scope):
        """Call DocumentValidator Cloud Function."""
        pass

    # State persistence
    def _persist_state(self, state):
        """Save workflow state to Firestore."""
        doc_ref = self.firestore.collection('workflows').document(state['workflow_id'])
        doc_ref.set(state)
```

---

### Cloud Function: FileSystemExplorer

**Purpose**: Explore project file system and extract structure information.

**File**: `cloud_functions/filesystem_explorer/main.py`

```python
import os
import json
from pathlib import Path

def explore_project_structure(request):
    """
    Cloud Function to explore project directory structure.

    Request body:
    {
        "project_path": "/path/to/project",
        "scope": "FOCUSED" | "TARGETED" | "COMPREHENSIVE",
        "focus_areas": ["module1", "module2"]  # optional
    }

    Response:
    {
        "source_directories": [...],
        "config_directories": [...],
        "test_directories": [...],
        "all_modules": [...],
        "file_count": 1234,
        "directory_count": 56
    }
    """
    request_json = request.get_json()
    project_path = request_json['project_path']
    scope = request_json.get('scope', 'COMPREHENSIVE')
    focus_areas = request_json.get('focus_areas', [])

    # Explore file system
    structure = {
        'source_directories': [],
        'config_directories': [],
        'test_directories': [],
        'all_modules': [],
        'file_count': 0,
        'directory_count': 0
    }

    # Walk directory tree
    for root, dirs, files in os.walk(project_path):
        # Skip common ignore patterns
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', 'venv', '__pycache__']]

        structure['directory_count'] += len(dirs)
        structure['file_count'] += len(files)

        # Categorize directories
        rel_path = os.path.relpath(root, project_path)
        if any(src in rel_path for src in ['src', 'app', 'lib']):
            structure['source_directories'].append(rel_path)
        elif any(cfg in rel_path for cfg in ['config', 'settings']):
            structure['config_directories'].append(rel_path)
        elif any(tst in rel_path for tst in ['test', 'tests', '__tests__', 'spec']):
            structure['test_directories'].append(rel_path)

    return json.dumps(structure)
```

---

### Cloud Function: DependencyAnalyzer

**Purpose**: Parse dependency files and extract technology stack information.

**File**: `cloud_functions/dependency_analyzer/main.py`

```python
import json
import os

def analyze_dependencies(request):
    """
    Cloud Function to analyze project dependencies.

    Request body:
    {
        "project_path": "/path/to/project"
    }

    Response:
    {
        "primary_language": "JavaScript",
        "frameworks": [...],
        "dependencies": [...],
        "dev_dependencies": [...]
    }
    """
    request_json = request.get_json()
    project_path = request_json['project_path']

    tech_stack = {
        'primary_language': None,
        'frameworks': [],
        'dependencies': [],
        'dev_dependencies': []
    }

    # Check for Node.js project
    package_json_path = os.path.join(project_path, 'package.json')
    if os.path.exists(package_json_path):
        with open(package_json_path) as f:
            package_data = json.load(f)
            tech_stack['primary_language'] = 'JavaScript'
            tech_stack['dependencies'] = list(package_data.get('dependencies', {}).keys())
            tech_stack['dev_dependencies'] = list(package_data.get('devDependencies', {}).keys())

            # Identify frameworks
            if 'express' in tech_stack['dependencies']:
                tech_stack['frameworks'].append('Express.js')
            if 'react' in tech_stack['dependencies']:
                tech_stack['frameworks'].append('React')
            # ... more framework detection

    # Check for Python project
    requirements_path = os.path.join(project_path, 'requirements.txt')
    if os.path.exists(requirements_path):
        tech_stack['primary_language'] = 'Python'
        with open(requirements_path) as f:
            tech_stack['dependencies'] = [line.strip() for line in f if line.strip()]

    # ... more language/framework detection

    return json.dumps(tech_stack)
```

---

### Cloud Function: DocumentGenerator (LLM-based)

**Purpose**: Generate brownfield architecture document using Vertex AI LLM.

**File**: `cloud_functions/document_generator/main.py`

```python
from google.cloud import aiplatform
import json

def generate_documentation(request):
    """
    Cloud Function to generate brownfield architecture document using LLM.

    Request body:
    {
        "project_name": "My Project",
        "scope": "FOCUSED",
        "discoveries": {...},  # All analysis results
        "user_context": {...}
    }

    Response:
    {
        "document_content": "# Brownfield Architecture...",
        "metadata": {...}
    }
    """
    request_json = request.get_json()

    # Build prompt for LLM
    prompt = build_documentation_prompt(request_json)

    # Call Vertex AI LLM
    client = aiplatform.gapic.PredictionServiceClient()
    response = client.predict(
        endpoint=os.environ['LLM_ENDPOINT'],
        instances=[{"prompt": prompt}],
        parameters={
            "temperature": 0.3,
            "max_output_tokens": 8000
        }
    )

    document_content = response.predictions[0]['content']

    return json.dumps({
        "document_content": document_content,
        "metadata": {
            "generated_at": datetime.utcnow().isoformat(),
            "tokens_used": len(document_content.split())
        }
    })

def build_documentation_prompt(request_data):
    """Build comprehensive prompt for LLM based on analysis results."""
    prompt = f"""
    Generate a comprehensive brownfield architecture document for: {request_data['project_name']}

    Scope: {request_data['scope']}

    Project Analysis Results:
    {json.dumps(request_data['discoveries'], indent=2)}

    User Context:
    {json.dumps(request_data['user_context'], indent=2)}

    Follow this structure:
    [embedded document structure from Section 6]

    CRITICAL REQUIREMENTS:
    - Document ACTUAL state, not aspirational
    - Include technical debt and workarounds honestly
    - Reference source files rather than duplicating content
    - Include file paths for all references
    - If PRD provided: Include enhancement impact analysis

    Generate the complete markdown document:
    """
    return prompt
```

---

### Firestore Schema for State Management

```javascript
// Collection: workflows/document_project/{workflow_id}
{
  workflow_id: "uuid",
  task_type: "document-project",
  project_path: "/path/to/project",
  project_name: "My Project",
  scope: "FOCUSED" | "TARGETED" | "COMPREHENSIVE",
  prd_content: {...},
  focus_areas: ["module1", "module2"],

  discoveries: {
    structure: {...},
    tech_stack: {...},
    build_system: {...},
    existing_docs: {...},
    technical_debt: [...],
    integration_points: [...],
    code_patterns: {...}
  },

  user_context: {
    project_purpose: "string",
    complex_areas: [...],
    expected_tasks: [...],
    technical_level: "junior|senior|mixed"
  },

  generated_document: "markdown content",

  metadata: {
    started_at: timestamp,
    completed_at: timestamp,
    current_step: 0-5,
    environment: "IDE" | "WEB_UI"
  },

  validation_results: {
    accuracy_check: {...},
    completeness_check: {...},
    focus_check: {...},
    clarity_check: {...},
    navigation_check: {...}
  }
}
```

---

### API Endpoint Specification

```yaml
POST /v1/projects/{project_id}/tasks/document-project/execute

Request Body:
{
  "project_path": "string",
  "project_name": "string",
  "prd_path": "string (optional)",
  "user_context": {
    "scope_preference": "focused|targeted|comprehensive",
    "focus_description": "string (optional)",
    "technical_level": "junior|senior|mixed"
  }
}

Response:
{
  "workflow_id": "uuid",
  "status": "completed",
  "document": {
    "filepath": "docs/brownfield-architecture.md",
    "content": "markdown string",
    "scope": "FOCUSED",
    "metadata": {
      "generated_at": "ISO-8601",
      "file_count_analyzed": 1234,
      "analysis_duration_seconds": 456
    }
  },
  "validation": {
    "approved": true,
    "results": {...}
  }
}
```

---

### Deployment Recommendations

**Infrastructure**:
```hcl
# Terraform configuration

# Reasoning Engine Workflow
resource "google_vertex_ai_reasoning_engine" "document_project" {
  display_name = "document-project-workflow"
  workflow_file = "workflows/document_project_workflow.py"
  region = "us-central1"
}

# Cloud Functions
resource "google_cloudfunctions2_function" "filesystem_explorer" {
  name = "filesystem-explorer"
  runtime = "python311"
  entry_point = "explore_project_structure"
  # ... configuration
}

resource "google_cloudfunctions2_function" "dependency_analyzer" {
  name = "dependency-analyzer"
  runtime = "python311"
  entry_point = "analyze_dependencies"
}

resource "google_cloudfunctions2_function" "document_generator" {
  name = "document-generator"
  runtime = "python311"
  entry_point = "generate_documentation"
  # Requires Vertex AI access
}

# Firestore Database
resource "google_firestore_database" "bmad_state" {
  name = "bmad-state"
  type = "FIRESTORE_NATIVE"
}

# Cloud Storage
resource "google_storage_bucket" "project_artifacts" {
  name = "bmad-project-artifacts"
  location = "US"
}
```

---

**Cost Estimate** (per execution):
- Reasoning Engine: ~$0.10 - $0.50 (depending on complexity)
- Cloud Functions: ~$0.01 - $0.05 (filesystem + dependency analysis)
- Vertex AI LLM (Gemini): ~$0.50 - $2.00 (8K tokens output)
- Firestore: ~$0.01 (state storage)
- **Total per execution**: ~$0.62 - $2.56

---

### Migration Path from BMad to ADK

**Phase 1: MVP Implementation**
1. Implement Step 0-3 in Reasoning Engine (core documentation generation)
2. Implement FileSystemExplorer and DependencyAnalyzer Cloud Functions
3. Implement DocumentGenerator Cloud Function with LLM
4. Basic Firestore state management
5. Web UI delivery only (no IDE integration yet)

**Phase 2: Enhanced Functionality**
1. Add Step 5 validation (DocumentValidator Cloud Function)
2. Implement user elicitation (conversational agent)
3. Add IDE delivery mode
4. Implement shard-doc integration

**Phase 3: Optimization**
1. Add caching for filesystem and dependency analysis
2. Optimize LLM prompts for faster generation
3. Implement progressive analysis for very large projects
4. Add parallel analysis where possible

---

**End of Analysis**

---

**Summary**: Task 3.15 (document-project) analysis complete with 16 comprehensive sections covering purpose, execution flow, integration patterns, ADK translation recommendations, and implementation guidance.

