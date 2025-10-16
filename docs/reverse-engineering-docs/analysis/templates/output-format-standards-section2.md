# BMad Framework Output Format Standards - Section 2: File Naming & Directory Structure

**Analysis Date**: 2025-10-14
**Analyzer**: Claude Code (AI Agent)
**Phase**: Phase 4, Task 4.4
**Document Version**: 1.0

---

## Table of Contents

- [Section 1: Introduction & Core Patterns](output-format-standards-section1.md)
- [Section 2: File Naming & Directory Structure Standards](#section-2-file-naming--directory-structure-standards) (This document)
- [Section 3: Markdown Formatting Conventions](output-format-standards-section3.md)
- [Section 4: Metadata, Versioning & Status Standards](output-format-standards-section4.md)
- [Section 5: ADK Translation & Summary](output-format-standards-section5.md)

---

## Section 2: File Naming & Directory Structure Standards

### 2.1 File Naming Conventions

BMad uses consistent, predictable file naming patterns that enable:
- **Discoverability**: Files can be found by name pattern
- **Sorting**: Files naturally sort in logical order
- **Identification**: File purpose is clear from name
- **Automation**: Scripts can process files by name pattern

#### 2.1.1 Core Document Naming

**Pattern**: `{document-type}.md`

**Examples**:
- `prd.md` - Product Requirements Document
- `architecture.md` - System Architecture
- `front-end-spec.md` - Frontend Specification
- `brief.md` - Project Brief

**Rules**:
- Lowercase with hyphens (kebab-case)
- Descriptive but concise
- No version numbers in filename (version tracked internally)
- Located in `docs/` directory

#### 2.1.2 Story File Naming

**Pattern**: `{epic_num}.{story_num}.{story_title_short}.md`

**Examples**:
- `01.01.project-setup.md`
- `01.02.authentication-setup.md`
- `02.01.user-registration.md`
- `02.02.user-profile-management.md`

**Rules**:
- **Epic Number**: Two-digit zero-padded (01, 02, 03, ... 10, 11, 12...)
- **Story Number**: Two-digit zero-padded (01, 02, 03, ... 10, 11, 12...)
- **Story Title Short**: Lowercase kebab-case, slugified from story title
  - Remove articles (a, an, the)
  - Remove special characters
  - Replace spaces with hyphens
  - Maximum ~50 characters recommended
- Located in `docs/stories/` directory

**Title Slugification Examples**:
- "Project Setup and Configuration" → `project-setup-configuration`
- "User Authentication System" → `user-authentication-system`
- "Implement the OAuth2 Flow" → `implement-oauth2-flow`
- "Create User Profile Dashboard" → `create-user-profile-dashboard`

**Sorting Behavior**:
Stories naturally sort in execution order:
```
01.01.project-setup.md
01.02.authentication-setup.md
01.03.database-configuration.md
02.01.user-registration.md
02.02.user-profile-management.md
```

#### 2.1.3 QA Gate File Naming

**Pattern**: `{epic_num}.{story_num}-{story_title_slug}.yaml`

**Examples**:
- `01.01-project-setup.yaml`
- `01.02-authentication-setup.yaml`
- `02.01-user-registration.yaml`

**Rules**:
- Same numbering as story files
- Uses hyphen separator (not dot) before title slug
- Shorter title slug than story files (typically 2-3 words)
- Pure YAML format (not markdown)
- Located in `docs/qa/` directory

**Configuration**:
```yaml
# core-config.yaml
qa:
  qaLocation: docs/qa
```

#### 2.1.4 Sharded Document Naming

When documents are sharded (split into multiple files), the following patterns apply:

**Epic Shard Pattern**: `epic-{n}{optional-suffix}.md`

**Examples**:
- `epic-01-foundation-core-infrastructure.md`
- `epic-02-user-management.md`
- `epic-03-reporting-analytics.md`

**Rules**:
- **Epic Number**: One or two digits with leading zero for single digits (1-9)
- **Epic Title**: Lowercase kebab-case
- Pattern defined in `core-config.yaml`: `epicFilePattern: epic-{n}*.md`

**Architecture Shard Naming**:

BMad doesn't enforce strict naming for architecture shards, but common patterns include:

- `tech-stack.md` - Technology stack decisions
- `coding-standards.md` - Code style and conventions
- `source-tree.md` - Directory structure and organization
- `database-schema.md` - Data model
- `api-design.md` - API specifications
- `infrastructure.md` - Deployment and hosting
- `security.md` - Security architecture
- `testing-strategy.md` - Test approach

**Index File Pattern**: `_index.md`

**Purpose**: Navigation and overview file for sharded document collections

**Examples**:
- `docs/prd/_index.md` - PRD shard navigation
- `docs/architecture/_index.md` - Architecture shard navigation

#### 2.1.5 Template File Naming

**Pattern**: `{document-type}-tmpl.yaml`

**Examples**:
- `prd-tmpl.yaml`
- `brownfield-prd-tmpl.yaml`
- `architecture-tmpl.yaml`
- `fullstack-architecture-tmpl.yaml`
- `front-end-spec-tmpl.yaml`
- `story-tmpl.yaml`
- `qa-gate-tmpl.yaml`
- `project-brief-tmpl.yaml`

**Rules**:
- Suffix: `-tmpl.yaml` (consistent marker)
- Lowercase kebab-case
- Descriptive of output document type
- Located in `.bmad-core/templates/` directory

#### 2.1.6 Task File Naming

**Pattern**: `{task-name}.md`

**Examples**:
- `create-next-story.md`
- `review-story.md`
- `risk-profile.md`
- `test-design.md`
- `execute-checklist.md`
- `create-doc.md`
- `shard-doc.md`

**Rules**:
- Lowercase kebab-case
- Verb-based names (action-oriented)
- Descriptive of task purpose
- Located in `.bmad-core/tasks/` directory

#### 2.1.7 Checklist File Naming

**Pattern**: `{agent-or-purpose}-checklist.md`

**Examples**:
- `po-master-checklist.md`
- `story-draft-checklist.md`
- `story-dod-checklist.md` (Definition of Done)

**Rules**:
- Lowercase kebab-case
- Suffix: `-checklist.md`
- Named by agent or purpose
- Located in `.bmad-core/checklists/` directory

#### 2.1.8 Data File Naming

**Pattern**: `{data-type}.md` or `{data-type}.yaml`

**Examples**:
- `technical-preferences.md`
- `test-levels-framework.md`
- `test-priorities-matrix.md`
- `elicitation-methods.md`
- `brainstorming-techniques.md`
- `bmad-kb.md` (Knowledge Base)

**Rules**:
- Lowercase kebab-case
- Descriptive of content type
- Markdown for human-readable content
- YAML for structured configuration
- Located in `.bmad-core/data/` directory

#### 2.1.9 Workflow File Naming

**Pattern**: `{project-type}-{architecture-type}.yaml`

**Examples**:
- `greenfield-fullstack.yaml`
- `greenfield-service.yaml`
- `greenfield-ui.yaml`
- `brownfield-fullstack.yaml`
- `brownfield-service.yaml`
- `brownfield-ui.yaml`

**Rules**:
- Lowercase kebab-case
- Format: `{greenfield|brownfield}-{fullstack|service|ui}`
- Pure YAML format
- Located in `.bmad-core/workflows/` directory

#### 2.1.10 Operational File Naming

**Debug Log**: `.ai/debug-log.md`
- Hidden directory (`.ai/`)
- Fixed filename
- Configurable in `core-config.yaml`: `devDebugLog: .ai/debug-log.md`

**Sprint Change Proposal**: `sprint-change-proposal.md`
- Generated by change checklist workflow
- Located in project root or docs directory

---

### 2.2 Directory Structure Standards

BMad follows a consistent directory structure across all projects, with configuration-driven paths for flexibility.

#### 2.2.1 Core Directory Structure

```
project-root/
├── .bmad-core/                    # BMad framework files (agents, tasks, templates)
│   ├── agents/                    # Agent definition files
│   ├── tasks/                     # Task workflow files
│   ├── templates/                 # Document templates
│   ├── checklists/                # Validation checklists
│   ├── data/                      # Reference data and knowledge
│   ├── workflows/                 # Workflow orchestration files
│   ├── agent-teams/               # Team bundle configurations
│   ├── utils/                     # Utility scripts and helpers
│   ├── core-config.yaml           # Core framework configuration
│   ├── install-manifest.yaml      # Installation manifest
│   ├── user-guide.md              # User documentation
│   └── ...
├── .ai/                           # AI agent operational files
│   └── debug-log.md               # Dev agent debug log
├── docs/                          # Project documentation
│   ├── prd.md                     # Product Requirements Document
│   ├── prd/                       # (If sharded)
│   │   ├── _index.md              # PRD navigation
│   │   ├── epic-01-foundation.md
│   │   ├── epic-02-user-mgmt.md
│   │   └── ...
│   ├── architecture.md            # System Architecture
│   ├── architecture/              # (If sharded)
│   │   ├── _index.md              # Architecture navigation
│   │   ├── tech-stack.md
│   │   ├── coding-standards.md
│   │   ├── source-tree.md
│   │   └── ...
│   ├── front-end-spec.md          # Frontend Specification
│   ├── brief.md                   # Project Brief
│   ├── stories/                   # Development stories
│   │   ├── 01.01.project-setup.md
│   │   ├── 01.02.auth-setup.md
│   │   └── ...
│   └── qa/                        # QA gates and reports
│       ├── 01.01-project-setup.yaml
│       ├── 01.02-auth-setup.yaml
│       └── ...
├── src/                           # Source code
├── tests/                         # Test files
├── package.json                   # Dependencies (if Node.js)
├── README.md                      # Project README
└── ...
```

#### 2.2.2 Configurable Paths

BMad paths are configurable via `core-config.yaml`:

```yaml
# core-config.yaml
markdownExploder: true           # Enable document sharding

qa:
  qaLocation: docs/qa             # QA gate file location

prd:
  prdFile: docs/prd.md            # PRD file path
  prdVersion: v4                  # PRD version (affects sharding)
  prdSharded: true                # Enable PRD sharding
  prdShardedLocation: docs/prd    # PRD shard directory
  epicFilePattern: epic-{n}*.md   # Epic file naming pattern

architecture:
  architectureFile: docs/architecture.md
  architectureVersion: v4
  architectureSharded: true
  architectureShardedLocation: docs/architecture

customTechnicalDocuments: null    # Additional doc paths (optional)

devLoadAlwaysFiles:               # Files loaded for every Dev story
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md

devDebugLog: .ai/debug-log.md     # Dev agent debug log path
devStoryLocation: docs/stories    # Story file directory

slashPrefix: BMad                 # Command prefix for slash commands
```

**Key Configurable Paths**:
- `qa.qaLocation`: Where QA gate files are stored
- `prd.prdFile`: Monolithic PRD file location
- `prd.prdShardedLocation`: Sharded PRD directory
- `architecture.architectureFile`: Monolithic architecture file
- `architecture.architectureShardedLocation`: Sharded architecture directory
- `devStoryLocation`: Story file directory
- `devDebugLog`: Debug log file path
- `devLoadAlwaysFiles`: Files automatically loaded for Dev agent

#### 2.2.3 Sharded vs Monolithic Structure

**Monolithic Structure** (v3 and earlier, or non-sharded v4):
```
docs/
├── prd.md                    # Single file with all epics and stories
├── architecture.md           # Single file with all architecture
└── ...
```

**Sharded Structure** (v4+):
```
docs/
├── prd/
│   ├── _index.md             # Navigation and overview
│   ├── epic-01-foundation-core-infrastructure.md
│   ├── epic-02-user-management.md
│   ├── epic-03-reporting-analytics.md
│   └── ...
├── architecture/
│   ├── _index.md             # Navigation and overview
│   ├── tech-stack.md         # Technology decisions
│   ├── coding-standards.md   # Code conventions
│   ├── source-tree.md        # Directory structure
│   ├── database-schema.md    # Data model
│   ├── api-design.md         # API specifications
│   └── ...
└── ...
```

**Sharding Decision**:
- Controlled by `prdSharded` and `architectureSharded` flags
- Enabled by setting `prdVersion: v4` or `architectureVersion: v4`
- Improves agent context window efficiency
- Enables parallel agent work on different epics
- Reduces token consumption by loading only relevant shards

#### 2.2.4 Hidden Directories

**`.bmad-core/`**:
- Core framework files
- Not typically modified by users
- Version controlled
- Copied/installed during BMad setup

**`.ai/`**:
- Operational AI agent files
- Debug logs and traces
- Not committed to version control (typically in `.gitignore`)
- Ephemeral; can be deleted and recreated

#### 2.2.5 Standard Project Directories

BMad expects standard project structure outside of its own directories:

**Source Code**: `src/` (or language-specific conventions)
- Actual implementation code
- Organized by feature, layer, or module
- Defined in architecture documents

**Tests**: `tests/` or `src/**/*.test.ts` (language-specific)
- Test files
- Mirrors source structure
- Defined in architecture `source-tree.md`

**Documentation**: `docs/`
- BMad-generated documentation
- User-facing documentation
- API documentation

**Configuration**: Project root
- `package.json`, `tsconfig.json`, etc.
- Build configuration
- Deployment configuration

---

### 2.3 Path Resolution & References

#### 2.3.1 Relative Path Conventions

**Within Documents**: Use relative paths from document location

**Examples**:
- From `docs/prd.md` to `docs/architecture.md`: `./architecture.md`
- From `docs/stories/01.01.setup.md` to `docs/architecture.md`: `../architecture.md`
- From `docs/prd/_index.md` to `docs/prd/epic-01-foundation.md`: `./epic-01-foundation.md`

#### 2.3.2 Section References (Anchors)

**Pattern**: `#section-title-kebab-case`

**Examples**:
- `docs/architecture.md#tech-stack`
- `docs/architecture.md#coding-standards`
- `docs/prd.md#epic-1-foundation--core-infrastructure`

**Anchor Generation Rules**:
1. Convert heading text to lowercase
2. Replace spaces with hyphens
3. Remove special characters except hyphens
4. Remove leading/trailing hyphens

**Example Conversions**:
- "Tech Stack" → `#tech-stack`
- "Epic 1: Foundation & Core Infrastructure" → `#epic-1-foundation--core-infrastructure`
- "API Design (RESTful)" → `#api-design-restful`

#### 2.3.3 Citation Format

BMad uses inline citations to reference source material:

**Pattern**: `[Source: {file_path}#{section}]`

**Examples**:
```markdown
[Source: architecture/tech-stack.md#authentication]
- Using Passport.js for authentication
- JWT tokens for session management

[Source: architecture/coding-standards.md#testing]
- Use Jest for unit tests
- Minimum 80% code coverage
```

**Rules**:
- Citation appears before referenced content
- File path relative to `docs/` directory
- Section anchor included for precision
- Used heavily in story Dev Notes sections

#### 2.3.4 Sharded Document References

**Index File Role**:
Index files (`_index.md`) provide navigation to shards:

```markdown
# Product Requirements Document (PRD)

## Epics

1. [Epic 1: Foundation & Core Infrastructure](./epic-01-foundation-core-infrastructure.md)
2. [Epic 2: User Management](./epic-02-user-management.md)
3. [Epic 3: Reporting & Analytics](./epic-03-reporting-analytics.md)

## Overview
This document is sharded for efficient agent processing...
```

**Agent Resolution Strategy**:
1. Check if document is sharded (`prdSharded: true`)
2. If sharded, load index file first
3. Identify relevant shard based on story context
4. Load only the necessary shard(s)
5. Reference shards in citations

**Example** (Story loading sharded PRD):
```markdown
## Dev Notes

[Source: prd/epic-01-foundation-core-infrastructure.md#story-11-project-setup]

### Story Requirements
- Set up project repository
- Initialize npm project
- Configure TypeScript
```

---

### 2.4 File Organization Best Practices

#### 2.4.1 Separation of Concerns

**Framework Files** (`.bmad-core/`):
- Agent definitions
- Task workflows
- Templates
- Checklists
- Reference data

**Project Files** (`docs/`, `src/`, etc.):
- Generated documentation
- Source code
- Tests
- Configuration

**Operational Files** (`.ai/`):
- Debug logs
- Temporary files
- Agent operational data

#### 2.4.2 Version Control Strategy

**Committed Files**:
- All generated documentation (`docs/`)
- Project source code (`src/`, `tests/`)
- Configuration files
- `.bmad-core/` (framework files)

**Ignored Files** (`.gitignore`):
- `.ai/` directory (debug logs are ephemeral)
- Node modules and build artifacts
- Environment files

#### 2.4.3 Naming Consistency

**Key Principles**:
1. **Predictable Patterns**: Files follow consistent naming conventions
2. **Alphabetical Sorting**: Names sort logically (e.g., zero-padded numbers)
3. **Descriptive Names**: File purpose clear from name
4. **No Abbreviations**: Use full words (except common acronyms like PRD, QA)
5. **Lowercase Kebab-Case**: Consistent casing across all files

#### 2.4.4 Scalability Considerations

**Story Files**:
- Zero-padded numbering supports up to 99 epics and 99 stories per epic
- Total capacity: 9,801 stories (99 × 99)
- If more needed, adjust to three-digit padding (001-999)

**Shard Files**:
- Epic shards scale naturally with epic count
- Architecture shards organized by logical domain
- No hard limits on shard count

---

## Section Summary

Section 2 has established the file naming and directory structure standards used throughout BMad:

1. **File Naming Conventions**: Consistent patterns for all artifact types (stories, gates, templates, tasks, etc.)
2. **Directory Structure**: Standardized organization with configurable paths via `core-config.yaml`
3. **Sharding Strategy**: Support for both monolithic and sharded document structures
4. **Path Resolution**: Relative paths, section anchors, and citation formats for cross-references

These standards enable predictable file organization, automated processing, and efficient agent navigation of project artifacts.

---

[← Section 1: Introduction & Core Patterns](output-format-standards-section1.md) | **[Section 3: Markdown Formatting Conventions →](output-format-standards-section3.md)**
