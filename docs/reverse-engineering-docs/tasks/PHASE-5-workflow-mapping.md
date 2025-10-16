# Phase 5: Workflow Orchestration Mapping

**Status**: ✅ Complete
**Target Completion**: Day 21
**Actual Completion**: 2025-10-14
**Progress**: 100% (4 of 4 tasks complete)

[← Previous Phase: Template Analysis](PHASE-4-template-analysis.md) | [Back to Task Tracker](../01-TASK-TRACKER.md) | [Next Phase: ADK Translation →](PHASE-6-adk-translation.md)

---

## Phase Overview

Phase 5 focuses on mapping the high-level workflow orchestration patterns in the BMad framework. This includes greenfield and brownfield workflows, development cycles, and state management patterns.

## Objectives

- Map all 6 workflow definitions (greenfield + brownfield)
- Document workflow orchestration patterns
- Analyze multi-agent collaboration flows
- Document state management and context passing
- Create comprehensive workflow documentation
- Establish workflow orchestration patterns for ADK

---

## Workflow Mapping Tasks

### Task 5.1: Greenfield Workflows (3 workflows)
- **Status**: ✅ Complete
- **Completed**: 2025-10-14
- **Estimated Time**: 1 day
- **Workflows to Analyze**:
  1. `greenfield-fullstack.yaml` - Full-stack application from scratch ✅
  2. `greenfield-service.yaml` - Backend service from scratch ✅
  3. `greenfield-ui.yaml` - Frontend UI from scratch ✅
- **Deliverable**: `analysis/workflows/greenfield-workflows.md` ✅
- **Key Analysis Points**:
  - Stage definitions and transitions ✅
  - Agent collaboration patterns ✅
  - Artifact creation sequence ✅
  - Decision points and gates ✅
  - Context passing between stages ✅
  - State management ✅
  - Success criteria per stage ✅
  - Validation checkpoints ✅
- **Analysis Highlights**:
  - Analyzed all 3 greenfield workflow types with comprehensive step-by-step breakdown
  - Full-stack: 23 steps with 7 decision points, planning + development phases
  - Service: 18 steps with 5 decision points, simplified planning (no UX)
  - UI: 20 steps with 6 decision points, AI UI generation support
  - Documented universal planning phase (Analyst → PM → UX → Architect → PO)
  - Documented universal development phase (SM → Dev → QA with iterative cycles)
  - Mapped file-based collaboration model and context passing mechanisms
  - Provided comprehensive ADK translation recommendations
  - Document length: ~1,880 lines with full workflow orchestration analysis

### Task 5.2: Brownfield Workflows (3 workflows)
- **Status**: ✅ Complete
- **Completed**: 2025-10-14
- **Estimated Time**: 1 day
- **Workflows to Analyze**:
  1. `brownfield-fullstack.yaml` - Enhance existing full-stack application ✅
  2. `brownfield-service.yaml` - Enhance existing backend service ✅
  3. `brownfield-ui.yaml` - Enhance existing frontend UI ✅
- **Deliverable**: `analysis/workflows/brownfield-workflows.md` ✅
- **Key Analysis Points**:
  - Discovery and documentation phase ✅
  - Risk assessment and mitigation ✅
  - Existing system analysis patterns ✅
  - Integration planning ✅
  - Rollback procedures ✅
  - Legacy compatibility considerations ✅
  - Technical debt identification ✅
  - Incremental enhancement strategy ✅
- **Analysis Highlights**:
  - Identified 3 distinct brownfield workflow types with different routing strategies
  - Brownfield-fullstack has adaptive routing (3 paths), service/UI have linear flow
  - Documented conditional architecture creation pattern
  - Mapped cross-workflow patterns and divergences
  - Provided comprehensive ADK translation recommendations
  - Document length: ~2,000 lines with full orchestration analysis

### Task 5.3: Development Cycle Workflow
- **Status**: ✅ Complete
- **Completed**: 2025-10-14
- **Estimated Time**: 0.5 days
- **Deliverable**: `analysis/workflows/development-cycle.md` ✅
- **Key Analysis Points**:
  - SM → Dev → QA → PO cycle ✅
  - Story preparation and validation ✅
  - Implementation and testing ✅
  - Quality gate integration ✅
  - Course correction triggers ✅
  - Story completion criteria ✅
  - Multi-round iteration patterns ✅
  - Status transitions ✅
- **Analysis Highlights**:
  - Comprehensive 8-stage development cycle with entry/exit criteria
  - Detailed 5-status lifecycle (Draft → Approved → InProgress → Review → Done)
  - 3-level quality gate model (story validation, DoD checklist, QA comprehensive review)
  - Iterative refinement pattern analysis (typically 1-3 Dev → QA cycles)
  - Complete agent collaboration patterns with 6 handoff types
  - File-based state management with story/gate/assessment artifacts
  - Error handling categories (4 types) and course correction strategies
  - Full ADK translation with Cloud Workflows, Vertex AI Agent Builder, Firestore schemas
  - Document length: ~2,460 lines with complete development cycle analysis

### Task 5.4: State Management Documentation
- **Status**: ✅ Complete
- **Completed**: 2025-10-14
- **Estimated Time**: 0.5 days
- **Deliverable**: `analysis/state-management.md` ✅
- **Key Analysis Points**:
  - File-based state tracking ✅
  - Artifact versioning ✅
  - Context preservation between agents ✅
  - Session management ✅
  - Workflow position tracking ✅
  - Artifact metadata (creator, timestamp, status) ✅
  - Decision history tracking ✅
  - Resumption capability ✅
- **Analysis Highlights**:
  - Comprehensive 8-section analysis of BMad's file-based state management
  - Documented file system as database principle (no external DB needed)
  - Status-driven orchestration with 5-status lifecycle
  - Stateless agent design with file-based resumability
  - Artifact-mediated communication patterns
  - Section ownership model preventing conflicts
  - Configuration-driven context loading (devLoadAlwaysFiles)
  - Complete lifecycle analysis for stories, gates, assessments, planning artifacts
  - Versioning strategies: Git (implicit), Change Log (explicit), Timestamped files
  - Context preservation mechanisms between agents (SM→Dev, Dev→QA, QA→Dev)
  - Session management: ephemeral sessions, new chat per invocation, file-based resumption
  - Workflow position tracking via status field, file existence, epic completion detection
  - Comprehensive ADK translation recommendations (Firestore + Cloud Storage hybrid model)
  - Document length: ~2,000 lines with full state management analysis

---

## Workflow Categories

### Greenfield Workflows
**Purpose**: Start new projects from scratch

**Common Stages**:
1. **Discovery** - Analyst elicitation and research
2. **Planning** - PM creates PRD, UX creates spec, Architect creates architecture
3. **Validation** - PO validates planning artifacts
4. **Preparation** - SM shards documents, creates stories
5. **Development** - Dev implements, QA reviews, iterative cycles
6. **Completion** - Final validation and delivery

**Agent Sequence**: Analyst → PM → UX Expert → Architect → PO → SM → Dev → QA → PO

### Brownfield Workflows
**Purpose**: Enhance existing projects

**Common Stages**:
1. **Discovery** - Document existing system (Analyst + Architect)
2. **Assessment** - Analyze scope, risks, technical debt
3. **Planning** - Create brownfield PRD and enhancement architecture
4. **Validation** - Validate planning with extra scrutiny
5. **Epic/Story Creation** - PM creates epics/stories directly
6. **Development** - Same as greenfield (SM → Dev → QA → PO)

**Agent Sequence**: Analyst → Architect → PM → Architect → PO → PM (epics/stories) → SM → Dev → QA → PO

### Development Cycle (Universal)
**Purpose**: Implement individual stories

**Stages**:
1. **Story Preparation** - SM creates story with complete Dev Notes
2. **Pre-Implementation Validation** - PO validates story draft
3. **Implementation** - Dev implements all tasks sequentially
4. **Quality Review** - QA comprehensive review (may call sub-tasks)
5. **Fix Application** - Dev applies QA fixes if needed
6. **Re-Review** - QA re-reviews if fixes applied
7. **Final Validation** - PO validates completed story
8. **Done** - Story marked complete

**Agent Cycle**: SM → PO → Dev → QA → (Dev → QA)* → PO

---

## Workflow Orchestration Patterns

### Pattern 1: Sequential Stage Progression
- Linear progression through defined stages
- Gate validation before stage transition
- No backtracking (except for fixes)
- Clear completion criteria per stage

### Pattern 2: Multi-Path Decision Points
- Conditional logic based on project type (greenfield/brownfield, fullstack/service/UI)
- Clarifying questions at decision points
- Path adaptation based on answers
- Different agent sequences per path

### Pattern 3: Iterative Review Cycles
- Dev → QA → Dev loops until gate PASS
- Quality improvement through multiple rounds
- Convergence toward quality standards
- Waiver mechanism for conscious trade-offs

### Pattern 4: Context Passing
- Previous stage artifacts passed to next stage
- Expected outputs defined per stage
- Constraints and requirements flow forward
- Decision history preserved

### Pattern 5: State Persistence
- Workflow position tracked
- Artifacts tagged with creator/timestamp/status
- Resumption capability after interruption
- Audit trail of all changes

---

## Key Analysis Questions

### Orchestration Mechanics
- How are workflows initiated?
- How are stage transitions triggered?
- Who decides when to move to next stage?
- How are decision points evaluated?
- How is workflow state persisted?

### Agent Coordination
- How do agents know when it's their turn?
- How is context passed between agents?
- What artifacts does each agent need?
- What artifacts does each agent produce?
- How are conflicts resolved?

### Error Handling
- What happens if validation fails?
- How are blocking conditions resolved?
- How is work rolled back?
- How are errors escalated?
- How is work resumed after fixes?

### ADK Translation
- How should workflows be implemented in Cloud Workflows?
- How should agent coordination be orchestrated?
- How should state be managed in Firestore?
- What APIs are needed for workflow operations?
- How should context passing be implemented?

---

## Progress Summary

### Completed Tasks (4/4)
- ✅ Task 5.1: Greenfield Workflows (3 workflows) - 2025-10-14
- ✅ Task 5.2: Brownfield Workflows (3 workflows) - 2025-10-14
- ✅ Task 5.3: Development Cycle Workflow - 2025-10-14
- ✅ Task 5.4: State Management Documentation - 2025-10-14

### In Progress (0/4)
None currently.

### Pending (0/4)
None - Phase 5 Complete!

---

## Expected Deliverables

1. `analysis/workflows/greenfield-workflows.md` - Greenfield workflow documentation ✅ (Complete - ~1,880 lines)
2. `analysis/workflows/brownfield-workflows.md` - Brownfield workflow documentation ✅ (Complete - ~2,000 lines)
3. `analysis/workflows/development-cycle.md` - Development cycle documentation ✅ (Complete - ~2,460 lines)
4. `analysis/state-management.md` - State management documentation ✅ (Complete - ~2,000 lines)

---

## Notes

- Phase 5 will begin after Phase 4 (Template Analysis) is complete
- Workflow orchestration is key to understanding multi-agent collaboration
- BMad-Orchestrator has special workflow management capabilities
- Workflows support resumption and multi-path navigation
- State management is file-based in current implementation
- ADK translation will likely use Cloud Workflows + Firestore for orchestration
- Understanding workflows is critical for Phase 6 (ADK Translation Design)

---

[← Previous Phase: Template Analysis](PHASE-4-template-analysis.md) | [Back to Task Tracker](../01-TASK-TRACKER.md) | [Next Phase: ADK Translation →](PHASE-6-adk-translation.md)
