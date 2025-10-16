# BMad Framework Component Inventory

**Document Version**: 1.0
**Last Updated**: 2025-10-13
**Status**: Complete

## Table of Contents

1. [Overview](#overview)
2. [Agents (10)](#agents)
3. [Tasks (23)](#tasks)
4. [Templates (13)](#templates)
5. [Workflows (6)](#workflows)
6. [Checklists (6)](#checklists)
7. [Agent Teams (4)](#agent-teams)
8. [Data Files](#data-files)
9. [Utility Files](#utility-files)
10. [Configuration Files](#configuration-files)
11. [Component Statistics](#component-statistics)

---

## Overview

This document provides a comprehensive inventory of all components within the BMad framework. Each component is cataloged with its purpose, location, and role in the overall system.

**Total Component Count**: 70+

---

## Agents

**Location**: `.bmad-core/agents/`
**Count**: 10
**File Format**: Markdown (.md) with embedded YAML configuration

### Planning Phase Agents (Web UI)

| # | File | Agent Name | Icon | Role | Primary Capabilities |
|---|------|------------|------|------|---------------------|
| 1 | `analyst.md` | Mary | 📊 | Business Analyst & Research Lead | Brainstorming, market research, competitive analysis, project documentation |
| 2 | `pm.md` | John | 📋 | Product Manager | PRD creation (greenfield & brownfield), document sharding, course correction |
| 3 | `ux-expert.md` | Sally | 🎨 | UX Expert | UI/UX specifications, front-end architecture, AI UI prompt generation |
| 4 | `architect.md` | Winston | 🏛️ | System Architect | System architecture, tech stack selection, infrastructure planning |
| 5 | `po.md` | Sarah | 📝 | Product Owner | Master checklist validation, artifact cohesion, document sharding orchestration |

### Development Phase Agents (IDE)

| # | File | Agent Name | Icon | Role | Primary Capabilities |
|---|------|------------|------|------|---------------------|
| 6 | `sm.md` | Bob | 📖 | Scrum Master | Story creation from epics, architecture context extraction, developer handoff |
| 7 | `dev.md` | James | 👨‍💻 | Developer | Story implementation, TDD, regression validation, Definition of Done execution |
| 8 | `qa.md` | Quinn | 🧪 | QA Engineer | Risk profiling, test design, requirements tracing, NFR assessment, quality gates |

### Universal Agents (Both Phases)

| # | File | Agent Name | Icon | Role | Primary Capabilities |
|---|------|------------|------|------|---------------------|
| 9 | `bmad-master.md` | BMad Master | 🎯 | Universal Executor | Task execution without persona, KB mode, method guidance |
| 10 | `bmad-orchestrator.md` | BMad Orchestrator | 🎭 | Orchestrator | Agent morphing, team coordination, web platform orchestration |

---

## Tasks

**Location**: `.bmad-core/tasks/`
**Count**: 23
**File Format**: Markdown (.md)

### Complex Multi-Step Tasks (8)

| # | File | Purpose | Complexity | Primary Agent(s) |
|---|------|---------|------------|-----------------|
| 1 | `create-next-story.md` | 6-step sequential story creation workflow | High | SM |
| 2 | `review-story.md` | Comprehensive story review with active refactoring | High | QA |
| 3 | `risk-profile.md` | Risk assessment with probability × impact scoring | Medium | QA |
| 4 | `test-design.md` | Test strategy with P0/P1/P2 prioritization | Medium | QA |
| 5 | `trace-requirements.md` | Requirements-to-test traceability mapping | Medium | QA |
| 6 | `nfr-assess.md` | Non-functional requirements assessment | Medium | QA |
| 7 | `create-doc.md` | Template-driven document generation | Medium | PM, Analyst, UX, Architect |
| 8 | `shard-doc.md` | Document sharding (PRD, Architecture) | Medium | PO, PM |

### Supporting Tasks (15)

| # | File | Purpose | Primary Agent(s) |
|---|------|---------|-----------------|
| 9 | `advanced-elicitation.md` | Structured user data gathering | Analyst |
| 10 | `apply-qa-fixes.md` | Apply QA-identified improvements | Dev |
| 11 | `brownfield-create-epic.md` | Generate epics from existing code | PM |
| 12 | `brownfield-create-story.md` | Generate stories from existing code | PM |
| 13 | `correct-course.md` | Realign planning artifacts | PM, PO |
| 14 | `create-brownfield-story.md` | Brownfield story creation variant | SM |
| 15 | `create-deep-research-prompt.md` | Generate research prompts for external tools | Analyst, Architect |
| 16 | `document-project.md` | Document existing project structure | Analyst, Architect |
| 17 | `execute-checklist.md` | Run validation checklists | All agents |
| 18 | `facilitate-brainstorming-session.md` | Guided brainstorming workflow | Analyst |
| 19 | `generate-ai-frontend-prompt.md` | Generate prompts for v0/Lovable | UX Expert |
| 20 | `index-docs.md` | Create navigation index for docs | PO |
| 21 | `kb-mode-interaction.md` | Knowledge base query handling | BMad Master |
| 22 | `qa-gate.md` | Quality gate decision creation | QA |
| 23 | `validate-next-story.md` | Pre-development story validation | PO |

---

## Templates

**Location**: `.bmad-core/templates/`
**Count**: 13
**File Format**: YAML (.yaml)

### Core Planning Templates (6)

| # | File | Template Name | Output Artifact | Primary Agent(s) | Version |
|---|------|---------------|----------------|-----------------|---------|
| 1 | `project-brief-tmpl.yaml` | Project Brief | `project-brief.md` | Analyst | v2 |
| 2 | `prd-tmpl.yaml` | Product Requirements Document | `prd.md` | PM | v4 |
| 3 | `brownfield-prd-tmpl.yaml` | Brownfield PRD | `prd.md` | PM | v2 |
| 4 | `market-research-tmpl.yaml` | Market Research | `market-research.md` | Analyst | v1 |
| 5 | `competitor-analysis-tmpl.yaml` | Competitor Analysis | `competitor-analysis.md` | Analyst | v1 |
| 6 | `brainstorming-output-tmpl.yaml` | Brainstorming Session Output | `brainstorming-output.md` | Analyst | v1 |

### Architecture Templates (5)

| # | File | Template Name | Output Artifact | Primary Agent(s) | Version |
|---|------|---------------|----------------|-----------------|---------|
| 7 | `architecture-tmpl.yaml` | System Architecture (Generic) | `architecture.md` | Architect | v4 |
| 8 | `fullstack-architecture-tmpl.yaml` | Fullstack Architecture | `fullstack-architecture.md` | Architect | v4 |
| 9 | `brownfield-architecture-tmpl.yaml` | Brownfield Architecture | `architecture.md` | Architect | v2 |
| 10 | `front-end-architecture-tmpl.yaml` | Front-End Architecture | `front-end-architecture.md` | UX Expert | v1 |
| 11 | `front-end-spec-tmpl.yaml` | Front-End Component Spec | `front-end-spec.md` | UX Expert | v1 |

### Development Templates (2)

| # | File | Template Name | Output Artifact | Primary Agent(s) | Version |
|---|------|---------------|----------------|-----------------|---------|
| 12 | `story-tmpl.yaml` | User Story | `{epic}.{story}.{title}.md` | SM | v2 |
| 13 | `qa-gate-tmpl.yaml` | QA Quality Gate | `{epic}.{story}-{slug}.yml` | QA | v1 |

---

## Workflows

**Location**: `.bmad-core/workflows/`
**Count**: 6
**File Format**: YAML (.yaml)

### Greenfield Workflows (3)

| # | File | Workflow Type | Agents Involved | Description |
|---|------|---------------|----------------|-------------|
| 1 | `greenfield-fullstack.yaml` | Fullstack New Project | Analyst → PM → UX → Architect → PO | Complete planning for new fullstack app |
| 2 | `greenfield-service.yaml` | Backend Service New Project | Analyst → PM → Architect → PO | Backend/API service planning |
| 3 | `greenfield-ui.yaml` | Frontend UI New Project | Analyst → PM → UX → PO | Frontend-only application planning |

### Brownfield Workflows (3)

| # | File | Workflow Type | Agents Involved | Description |
|---|------|---------------|----------------|-------------|
| 4 | `brownfield-fullstack.yaml` | Fullstack Existing Project | Analyst → PM → Architect → PO | Document existing fullstack app |
| 5 | `brownfield-service.yaml` | Backend Service Existing Project | Analyst → PM → Architect → PO | Document existing backend service |
| 6 | `brownfield-ui.yaml` | Frontend UI Existing Project | Analyst → PM → UX → PO | Document existing frontend app |

---

## Checklists

**Location**: `.bmad-core/checklists/`
**Count**: 6
**File Format**: Markdown (.md)

| # | File | Checklist Name | Purpose | Primary Agent(s) |
|---|------|----------------|---------|-----------------|
| 1 | `architect-checklist.md` | Architecture Validation | Validate architecture completeness and quality | Architect |
| 2 | `change-checklist.md` | Change Impact Assessment | Assess impact of proposed changes | PM, PO |
| 3 | `pm-checklist.md` | PRD Validation | Validate PRD completeness and quality | PM |
| 4 | `po-master-checklist.md` | Master Artifact Validation | Validate cohesion across all planning artifacts | PO |
| 5 | `story-dod-checklist.md` | Story Definition of Done | Validate story implementation completeness | Dev |
| 6 | `story-draft-checklist.md` | Story Draft Quality | Validate story draft before development | SM |

---

## Agent Teams

**Location**: `.bmad-core/agent-teams/`
**Count**: 4
**File Format**: YAML (.yaml)

| # | File | Team Name | Agents Included | Use Case |
|---|------|-----------|----------------|----------|
| 1 | `team-all.yaml` | Complete Team | All 10 agents | Full workflow support (web UI) |
| 2 | `team-fullstack.yaml` | Fullstack Team | Analyst, PM, UX, Architect, PO, SM, Dev, QA | Fullstack development projects |
| 3 | `team-ide-minimal.yaml` | IDE Minimal Team | SM, Dev, QA | Development phase only (IDE) |
| 4 | `team-no-ui.yaml` | Backend-Only Team | Analyst, PM, Architect, PO, SM, Dev, QA (no UX) | Backend/API projects |

---

## Data Files

**Location**: `.bmad-core/data/`
**Count**: 6
**File Format**: Markdown (.md)

| # | File | Purpose | Used By |
|---|------|---------|---------|
| 1 | `technical-preferences.md` | Technical stack preferences and biases | Analyst, PM, UX, Architect, QA |
| 2 | `bmad-kb.md` | Knowledge base (methodology documentation) | BMad Master (KB mode) |
| 3 | `project-types.md` | Project type definitions and characteristics | Analyst, PM |
| 4 | `template-versions.md` | Template version compatibility matrix | All agents |
| 5 | `nfr-categories.md` | Non-functional requirement categories | QA |
| 6 | `risk-scoring-guide.md` | Risk assessment scoring guidelines | QA |

---

## Utility Files

**Location**: `.bmad-core/utils/`
**Count**: 2
**File Format**: Markdown (.md)

| # | File | Purpose | Used By |
|---|------|---------|---------|
| 1 | `markdown-formatting-guide.md` | Markdown formatting standards | All agents |
| 2 | `elicitation-patterns.md` | User interaction patterns | Agents with elicitation tasks |

---

## Configuration Files

**Location**: `.bmad-core/` (root)
**Count**: 4
**File Format**: YAML (.yaml) and Markdown (.md)

| # | File | Purpose | Description |
|---|------|---------|-------------|
| 1 | `core-config.yaml` | Project Configuration | Default/template configuration for projects |
| 2 | `install-manifest.yaml` | Installation Manifest | Framework installation metadata and IDE integration |
| 3 | `user-guide.md` | User Documentation | Complete user guide for BMad framework |
| 4 | `enhanced-ide-development-workflow.md` | IDE Workflow Guide | Development phase workflow documentation |
| 5 | `working-in-the-brownfield.md` | Brownfield Guide | Guide for working with existing codebases |

---

## Component Statistics

### By Type

| Component Type | Count | Percentage |
|---------------|-------|------------|
| **Agents** | 10 | 14.3% |
| **Tasks** | 23 | 32.9% |
| **Templates** | 13 | 18.6% |
| **Workflows** | 6 | 8.6% |
| **Checklists** | 6 | 8.6% |
| **Agent Teams** | 4 | 5.7% |
| **Data Files** | 6 | 8.6% |
| **Utility Files** | 2 | 2.9% |
| **Total** | **70** | **100%** |

### By Phase

| Phase | Components | Description |
|-------|-----------|-------------|
| **Planning Phase (Web UI)** | ~40 | Agents: Analyst, PM, UX, Architect, PO, Orchestrator<br>Focus: Requirements, architecture, planning artifacts |
| **Development Phase (IDE)** | ~45 | Agents: SM, Dev, QA, Master<br>Focus: Story creation, implementation, quality assurance |
| **Universal** | ~15 | Used across both phases (templates, tasks, data) |

### By Complexity

| Complexity Level | Count | Examples |
|-----------------|-------|----------|
| **High Complexity** | 10 | Agents (10), complex multi-step tasks |
| **Medium Complexity** | 30 | Tasks (23), templates (13), workflows (6) |
| **Low Complexity** | 30 | Checklists (6), data files (6), configs, utils |

### File Format Distribution

| Format | Count | Usage |
|--------|-------|-------|
| **Markdown (.md)** | 43 | Agents, tasks, checklists, data, utils, guides |
| **YAML (.yaml)** | 27 | Templates, workflows, agent teams, configs |
| **Total** | **70** | |

---

## Component Dependencies

### Most Referenced Components

| Component | Referenced By | Usage Count |
|-----------|--------------|-------------|
| `core-config.yaml` | All agents | 10+ |
| `technical-preferences.md` | Analyst, PM, UX, Architect, QA | 5+ |
| `execute-checklist.md` | SM, Dev, QA, PO | 4+ |
| `create-doc.md` | Analyst, PM, UX, Architect | 4+ |
| `shard-doc.md` | PM, PO | 2+ |

### Inter-Component Relationships

```
Agents
  ├── Execute → Tasks
  ├── Use → Templates
  ├── Validate → Checklists
  ├── Reference → Data Files
  └── Read → Configuration

Tasks
  ├── Load → Templates
  ├── Execute → Other Tasks
  ├── Run → Checklists
  └── Reference → Data Files

Workflows
  ├── Sequence → Agents
  └── Generate → Artifacts

Templates
  └── Define → Artifacts

Checklists
  └── Validate → Artifacts
```

---

## Version Compatibility

### Template Versions

| Version | Templates | Status | Features |
|---------|-----------|--------|----------|
| **v4** | PRD, Architecture, Fullstack Architecture | Current | Sharding support, enhanced structure |
| **v2** | Story, Project Brief, Brownfield variants | Current | Stable, widely used |
| **v1** | Market Research, Competitor Analysis, QA Gate | Current | Initial release |

### Framework Versions

| Version | Release | Status | Notes |
|---------|---------|--------|-------|
| **3.x** | Current | Active | Current production version |
| **2.x** | Legacy | Deprecated | Migration path available |
| **1.x** | Original | Unsupported | Not compatible |

---

## Component Maturity

| Component | Maturity Level | Change Frequency |
|-----------|---------------|-----------------|
| **Core Agents (8)** | Stable | Low |
| **Universal Agents (2)** | Evolving | Medium |
| **Core Tasks (15)** | Stable | Low |
| **QA Tasks (6)** | Mature | Very Low |
| **Templates v4** | Stable | Low |
| **Templates v1-v2** | Mature | Very Low |
| **Workflows** | Stable | Very Low |
| **Checklists** | Mature | Very Low |

---

## Notes

- All components are version-controlled in `.bmad-core/` directory
- Components are read-only for agents (no self-modification)
- Project-specific customizations via `core-config.yaml` at project root
- Components follow consistent naming conventions: `{name}-{type}.{ext}`
- All agents are self-contained (no inter-agent dependencies at activation)
- Tasks can chain (tasks can call other tasks)
- Templates are version-aware (multiple versions can coexist)

---

**Next Steps**:
- Deep dive analysis of each agent (Phase 2)
- Task workflow analysis (Phase 3)
- Template schema documentation (Phase 4)

**Status**: Complete
