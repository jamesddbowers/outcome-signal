# Core Planning Templates Analysis - Complete Document

**Phase**: Phase 4, Task 4.1
**Analysis Date**: 2025-10-14
**Analyzer**: Claude Code (AI Agent)
**Status**: ✅ Complete
**Version**: 1.0

---

## Overview

This comprehensive analysis covers the BMad framework's **6 core planning templates** that drive artifact generation during the planning phase of software development projects.

**Templates Analyzed**:
1. **prd-tmpl.yaml** (v2.0) - Product Requirements Document (greenfield) - 204 lines
2. **brownfield-prd-tmpl.yaml** (v2.0) - PRD for existing project enhancements - 282 lines
3. **front-end-spec-tmpl.yaml** (v2.0) - UI/UX Specification - 351 lines
4. **story-tmpl.yaml** (v2.0) - Development Story Structure - 139 lines
5. **project-brief-tmpl.yaml** (v2.0) - Project Brief - 223 lines
6. **brainstorming-output-tmpl.yaml** (v2.0) - Brainstorming Session Results - 157 lines

**Total Template Lines**: 1,356 lines analyzed across 6 templates

**Total Analysis**: ~30,000 lines across 5 comprehensive sections

---

## Document Sections

### [Section 1: Introduction & Overview](core-planning-templates-section1.md)

**Topics Covered**:
- Purpose and scope of analysis
- Templates overview table
- Key template features (YAML-in-markdown, elicitation, section hierarchy)
- Agent ownership & permissions model (v2.0 innovation)
- Validation & quality gates
- Context-driven guidance
- Template workflow types
- Template dependencies & flow
- Version 2.0 enhancements
- Template metadata patterns
- Critical design principles
- Key findings preview

**Length**: ~5,000 lines

[→ Read Section 1](core-planning-templates-section1.md)

---

### [Section 2: PRD Templates Analysis](core-planning-templates-section2.md)

**Templates Analyzed**:
- **prd-tmpl.yaml** - Greenfield PRD (204 lines)
- **brownfield-prd-tmpl.yaml** - Brownfield PRD (282 lines)

**Topics Covered**:
- Template identity, workflow, and structure
- 8 major sections of greenfield PRD
- Goals & background context
- Requirements (FR, NFR)
- UI design goals
- Technical assumptions
- Epic list and epic details
- Story structure with acceptance criteria
- Checklist results and next steps
- Brownfield-specific enhancements
- Scope assessment, project analysis, compatibility requirements
- Integration verification (IV) per story
- Greenfield vs. brownfield comparison
- Data flow, dependencies, validation rules
- ADK translation considerations

**Key Insights**:
- Greenfield vs. brownfield require fundamentally different approaches
- Compatibility Requirements (CR) are first-class citizens in brownfield
- Integration Verification (IV) ensures system integrity
- document-project task critical for brownfield
- Story sizing for AI agent execution (2-4 hours)
- Epic/story hierarchy enables traceability
- Templates are teaching tools with extensive guidance

**Length**: ~9,000 lines

[→ Read Section 2](core-planning-templates-section2.md)

---

### [Section 3: Frontend Specification Template](core-planning-templates-section3.md)

**Template Analyzed**:
- **front-end-spec-tmpl.yaml** - UI/UX Specification (351 lines, largest template)

**Topics Covered**:
- Template identity and purpose
- 12 major sections covering comprehensive UX/UI design
- Introduction with UX goals & principles
- Information architecture (site maps, navigation)
- User flows with Mermaid diagrams
- Wireframes & mockups
- Component library / design system
- Branding & style guide (colors, typography, iconography)
- Accessibility requirements (WCAG compliance)
- Responsiveness strategy (breakpoints, adaptation patterns)
- Animation & micro-interactions
- Performance considerations
- Next steps and design handoff checklist
- 70+ interpolation variables
- Data flow, dependencies, validation
- ADK translation considerations

**Key Insights**:
- Most comprehensive template (351 lines, 70+ variables)
- User-centered design process throughout
- Accessibility baked in (not optional)
- Performance-aware from start
- Mermaid diagrams enable visual documentation
- Component-driven design methodology
- Responsive design thinking up-front
- Design system integration
- External tool integration (Figma, Sketch)
- Handoff checklist ensures completeness
- Template is teaching tool for UX Expert
- Clear distinction between UX and architecture

**Length**: ~8,000 lines

[→ Read Section 3](core-planning-templates-section3.md)

---

### [Section 4: Story & Project Brief Templates](core-planning-templates-section4.md)

**Templates Analyzed**:
- **story-tmpl.yaml** - Story Document (139 lines)
- **project-brief-tmpl.yaml** - Project Brief (223 lines)

**Topics Covered**:

**Story Template**:
- Critical innovation: Agent ownership model (v2.0)
- Section-level permissions (owner, editors)
- 8 sections with ownership table
- Status lifecycle (Draft → Approved → InProgress → Review → Done)
- Story and Acceptance Criteria (immutable during development)
- Tasks/Subtasks (collaborative editing)
- Dev Notes (SM as context curator)
- Testing standards extracted to story level
- Change log (multi-agent editing)
- Dev Agent Record (exclusive to Dev)
- QA Results (exclusive to QA)
- Section ownership summary table
- ADK translation with Firestore security rules

**Project Brief Template**:
- Foundation for all BMad projects
- YOLO mode innovation (rapid drafting)
- Custom elicitation actions (10 options)
- 12 sections from executive summary to next steps
- Executive summary, problem statement, proposed solution
- Target users (primary & secondary segments)
- Goals & success metrics (SMART goals)
- MVP scope (core features, out of scope, success criteria)
- Post-MVP vision
- Technical considerations (preferences, not decisions)
- Constraints & assumptions
- Risks & open questions
- Appendices and PM handoff
- 40+ interpolation variables

**Key Insights**:

Story Template:
- Section ownership model is game-changer for multi-agent collaboration
- SM as context curator optimizes AI agent execution
- Three-agent collaboration (SM, Dev, QA)
- Immutable requirements prevent requirement drift
- Complete traceability (status, files, AI model version)

Project Brief:
- Foundation for everything (first document)
- YOLO mode innovation for rapid creation
- Custom elicitation actions enable creative exploration
- MVP scope discipline prevents feature creep
- Risk identification up-front prevents surprises
- Seamless PM handoff with explicit instructions

**Length**: ~10,000 lines

[→ Read Section 4](core-planning-templates-section4.md)

---

### [Section 5: Brainstorming Template & Summary](core-planning-templates-section5.md)

**Template Analyzed**:
- **brainstorming-output-tmpl.yaml** - Brainstorming Session Results (157 lines)

**Topics Covered**:

**Brainstorming Template**:
- Unique workflow: Non-interactive (automated output)
- 7 sections capturing session results
- Header metadata
- Executive summary with key themes
- Technique sessions (repeatable, one per technique)
- Idea categorization (immediate, future, moonshots)
- Action planning (top 3 priorities)
- Reflection & follow-up
- Footer with brand attribution
- 50+ interpolation variables
- ADK translation with automated generation

**Comprehensive Summary**:
- Template collection overview (6 templates, 1,356 lines)
- Key design patterns across templates
- Critical innovations (ownership model, brownfield enhancements, YOLO mode, custom actions, Mermaid, context curation)
- Template interdependencies flow diagram
- Template validation & quality gates table
- ADK translation requirements summary
- Future template enhancements (v3.0 features)
- Conclusion

**Key Insights**:

Brainstorming Template:
- Non-interactive mode unique (only automated template)
- Structured ideation output (categorized by timeline)
- Technique documentation enables learning
- Reflection for continuous improvement
- Feeds planning phase (brief, PRD)
- Complete session traceability

Comprehensive Summary:
- Templates form comprehensive system (1,356 lines total)
- Consistent design patterns throughout
- Six critical innovations documented
- Complete interdependency flow
- Comprehensive ADK translation requirements
- Templates are executable specifications

**Length**: ~8,000 lines

[→ Read Section 5](core-planning-templates-section5.md)

---

## Key Findings Summary

### 1. Section Ownership Model (v2.0 Innovation)
The story template introduces section-level ownership and edit permissions, enabling safe multi-agent collaboration. SM owns requirements, Dev owns implementation record, QA owns review results. This prevents conflicts and maintains clear responsibility boundaries.

### 2. Brownfield-Specific Enhancements
Brownfield PRD template includes Compatibility Requirements (CR), Integration Verification (IV) per story, risk assessment with technical debt, and scope assessment. This acknowledges that enhancing existing systems requires different approach than greenfield.

### 3. YOLO Mode & Custom Elicitation Actions
Project brief template introduces YOLO mode (agent generates complete draft for review) and custom elicitation actions (10 user-selectable actions like "validate against similar products" or "challenge scope"). This enables rapid creation and flexible exploration.

### 4. Mermaid Diagram Integration
Frontend spec template uses Mermaid diagrams for site maps and user flows, enabling visual documentation without external tools. Diagrams are version controlled with spec and rendered in markdown viewers.

### 5. Context Curation for AI Agents
Story template's Dev Notes section has SM extract relevant architecture sections, ensuring Dev Agent has complete context without reading full architecture docs. Critical for AI agent execution with limited context windows.

### 6. Templates as Executable Specifications
Templates are not documentation—they are specifications that guide agent behavior. Extensive instructions, examples, validation rules, and elicitation strategies make templates executable by agents.

---

## Statistics

- **Templates Analyzed**: 6
- **Total Template Lines**: 1,356
- **Total Analysis Lines**: ~30,000
- **Sections Created**: 5
- **Key Innovations Documented**: 6
- **Interpolation Variables**: 200+ across all templates
- **Agent Owners**: 5 (Analyst, PM, UX Expert, SM, Dev, QA)
- **Workflow Modes**: 2 (interactive, non-interactive)
- **Template Versions**: All v2.0 (mature, stable)

---

## Files Created

1. [core-planning-templates-section1.md](core-planning-templates-section1.md) - Introduction & Overview
2. [core-planning-templates-section2.md](core-planning-templates-section2.md) - PRD Templates
3. [core-planning-templates-section3.md](core-planning-templates-section3.md) - Frontend Specification
4. [core-planning-templates-section4.md](core-planning-templates-section4.md) - Story & Project Brief
5. [core-planning-templates-section5.md](core-planning-templates-section5.md) - Brainstorming & Summary
6. [core-planning-templates.md](core-planning-templates.md) - This index (master document)

---

## Navigation

- [Section 1: Introduction & Overview →](core-planning-templates-section1.md)
- [Section 2: PRD Templates →](core-planning-templates-section2.md)
- [Section 3: Frontend Specification →](core-planning-templates-section3.md)
- [Section 4: Story & Project Brief →](core-planning-templates-section4.md)
- [Section 5: Brainstorming & Summary →](core-planning-templates-section5.md)

[← Back to Phase 4 Task Tracker](../../tasks/PHASE-4-template-analysis.md)

---

## Completion Status

**Phase 4, Task 4.1**: ✅ **COMPLETE**

**Date Completed**: 2025-10-14

**Analyzer**: Claude Code (AI Agent) - claude-sonnet-4-5-20250929

---

*Analysis created as part of BMad Framework Reverse Engineering for Google Vertex AI ADK*
