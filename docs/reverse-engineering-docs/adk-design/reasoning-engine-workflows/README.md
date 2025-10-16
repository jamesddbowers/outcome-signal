# BMad Reasoning Engine Workflows

This directory contains Google ADK Reasoning Engine implementations for BMad's complex multi-step task workflows.

## Overview

These workflows implement BMad's core operational logic using **Google's Vertex AI Reasoning Engine**, providing:
- State persistence and resumability (via Firestore)
- Intelligent decision logic
- Multi-step orchestration
- Integration with other GCP services

## About Google ADK

Google's Agent Development Kit (google-adk) is the official open-source framework for building AI agents with Google Cloud. Install via:

```bash
pip install google-adk
```

All workflows in this directory use google-adk's WorkflowAgent pattern with Vertex AI Reasoning Engine.

## Workflow Catalog

### 1. create-next-story.py
**Purpose**: 6-step sequential workflow for story creation
**Agent**: SM (Scrum Master)
**Complexity**: High
**Steps**:
0. Load core configuration
1. Identify next story (with epic completion detection)
2. Gather requirements from epic + previous story insights
3. Gather architecture context (story-type-aware reading)
4. Verify project structure alignment
5. Populate story template with complete context
6. Execute draft checklist validation

**Key Features**:
- Story-type classification (backend/frontend/fullstack)
- Selective architecture reading (only relevant docs)
- Epic completion handling (requires user approval)
- Incomplete story alerts
- Previous story insights extraction

**Resumability**: Yes (via Firestore state persistence)
**Analysis Ref**: [analysis/tasks/create-next-story.md](../../analysis/tasks/create-next-story.md)

---

### 2. review-story.py
**Purpose**: Comprehensive QA review with quality gate decision
**Agent**: QA (Test Architect)
**Complexity**: High
**Steps**:
1. Risk assessment (auto-escalate to deep review)
2. Comprehensive analysis (6 parallel dimensions)
   - Requirements traceability
   - Code quality review
   - Test architecture assessment
   - NFR assessment (4 core NFRs)
   - Testability evaluation
   - Technical debt identification
3. Active refactoring (unique QA authority)
4. Standards compliance check
5. Acceptance criteria validation
6. Gate decision + documentation

**Key Features**:
- Adaptive workflow (standard vs deep review)
- Active code refactoring capability
- Deterministic gate algorithm (PASS/CONCERNS/FAIL/WAIVED)
- Dual outputs (story update + gate YAML file)
- NFR assessment framework

**Analysis Ref**: [analysis/tasks/review-story.md](../../analysis/tasks/review-story.md)

---

### 3. risk-profile.py
**Purpose**: Risk assessment with probability × impact scoring
**Agent**: QA (Test Architect)
**Complexity**: Medium
**Steps**:
1. Load story and implementation context
2. Identify risk categories (7 standard categories)
3. Score each risk (probability 1-3, impact 1-3, total 1-9)
4. Prioritize risks by score
5. Generate mitigation strategies
6. Calculate gate impact
7. Output risk assessment document

**Key Features**:
- 7 risk categories: Security, Data Loss, Performance, Compliance, Integration, UX, Technical Debt
- Probability × Impact scoring matrix (1-9 scale)
- Risk score thresholds: 9 → FAIL, 6-8 → CONCERNS, 1-5 → informational
- Automated mitigation strategy generation
- Gate impact calculation

**Analysis Ref**: [analysis/tasks/risk-profile.md](../../analysis/tasks/risk-profile.md)

---

### 4. test-design.py
**Purpose**: Test scenario generation with dual framework application
**Agent**: QA (Test Architect)
**Complexity**: Medium-High
**Steps**:
1. Load story and risk profile
2. Generate test scenarios from ACs
3. Apply test levels framework (unit/integration/E2E)
4. Apply test priorities framework (P0/P1/P2)
5. Add test data requirements
6. Recommend CI/CD integration
7. Output test design document

**Key Features**:
- Dual framework application (levels + priorities)
- Test Levels Framework: Unit (fast, isolated) → Integration (realistic) → E2E (full stack)
- Test Priorities Framework: P0 (must pass) → P1 (should pass) → P2 (nice to have)
- Risk-based test scenario prioritization
- Test data strategy recommendations

**Analysis Ref**: [analysis/tasks/test-design.md](../../analysis/tasks/test-design.md)

---

### 5. apply-qa-fixes.py
**Purpose**: Deterministic application of QA-identified fixes
**Agent**: Dev (Implementation Agent)
**Complexity**: Medium
**Steps**:
1. Load QA Results and gate file
2. Extract unchecked improvement items
3. Prioritize fixes by severity
4. Apply fixes sequentially
5. Run tests after each fix
6. Update story with fixes applied
7. Mark items as complete

**Key Features**:
- Deterministic fix application (no interpretation)
- Sequential execution with test validation
- Rollback on test failure
- Progress tracking (checkboxes)
- Dev Agent Record updates

**Analysis Ref**: [analysis/tasks/apply-qa-fixes.md](../../analysis/tasks/apply-qa-fixes.md)

---

### 6. validate-next-story.py
**Purpose**: Pre-implementation story validation by PO
**Agent**: PO (Product Owner)
**Complexity**: Low-Medium
**Steps**:
1. Load story draft
2. Validate story completeness
3. Check technical context adequacy
4. Verify architecture citations
5. Review previous insights
6. Approve or request changes

**Key Features**:
- Comprehensive validation checklist
- Story approval workflow
- Change request generation
- Status transition (Draft → Approved)

**Analysis Ref**: [analysis/tasks/validate-next-story.md](../../analysis/tasks/validate-next-story.md)

---

### 7. execute-checklist.py
**Purpose**: Systematic checklist validation workflow
**Agent**: Multiple (depends on checklist)
**Complexity**: Medium
**Steps**:
1. Load checklist definition
2. Load target artifact (story/PRD/architecture)
3. Execute each checklist item
4. Collect validation results
5. Determine pass/fail status
6. Generate recommendations
7. Output checklist results

**Key Features**:
- Generic checklist execution engine
- Multiple checklist types (story-draft, story-dod, po-master, etc.)
- LLM-powered validation
- Structured output format
- Integration with workflows

**Analysis Ref**: [analysis/tasks/execute-checklist.md](../../analysis/tasks/execute-checklist.md)

---

### 8. shard-doc.py
**Purpose**: Document sharding (monolithic → sharded structure)
**Agent**: PM, PO, Architect (depends on document type)
**Complexity**: High
**Steps**:
1. Load monolithic document
2. Analyze document structure
3. Determine sharding strategy by type
4. Extract sections into separate files
5. Generate index file with navigation
6. Preserve cross-references
7. Validate shard integrity

**Key Features**:
- Document-type-aware sharding (PRD, Architecture)
- PRD sharding: Epic-based separation
- Architecture sharding: Concern-based separation
- Index file generation
- Cross-reference preservation
- Transition from v3 → v4

**Analysis Ref**: [analysis/tasks/shard-doc.md](../../analysis/tasks/shard-doc.md)

---

## Common Patterns

### State Management
All workflows use Firestore for state persistence:
```python
# Save state for resumability
state_ref = db.collection('workflow_states').document(workflow_id)
state_ref.set(state.to_dict())

# Load state for resumption
state_doc = state_ref.get()
state = WorkflowState.from_dict(state_doc.to_dict())
```

### Configuration Loading
```python
config_ref = db.collection('projects').document(project_id)
config = config_ref.get().to_dict().get('config', {})
```

### Document Storage
- **Structured data** → Firestore collections
- **Documents/Artifacts** → Cloud Storage buckets
- **Templates** → Cloud Storage with caching

### Error Handling
All workflows implement:
- Try-catch with error state preservation
- Partial progress tracking
- Resumability from failure point
- Error logging to Cloud Logging

## Deployment

### Prerequisites
```bash
# Install dependencies
pip install google-adk google-cloud-firestore google-cloud-storage google-cloud-aiplatform

# Set up GCP authentication
gcloud auth application-default login
```

### Deploy to Vertex AI
```python
from google.cloud import aiplatform
from create_next_story import CreateNextStoryWorkflow

aiplatform.init(
    project='your-gcp-project',
    location='us-central1',
    staging_bucket='gs://your-staging-bucket'
)

# Create Reasoning Engine application
reasoning_app = aiplatform.ReasoningEngine(
    requirements=['google-adk', 'google-cloud-firestore', 'google-cloud-storage'],
    reasoning_engine=CreateNextStoryWorkflow,
)

# Deploy
reasoning_app.deploy(
    display_name='bmad-create-next-story-workflow',
    service_account='bmad-workflows@your-project.iam.gserviceaccount.com',
)
```

### Invoke Workflows
```python
# Direct invocation (testing)
workflow = CreateNextStoryWorkflow(project_id='your-gcp-project')
result = workflow.execute(bmad_project_id='my-project', story_override=None)

# Via Cloud Run API (production)
import requests
response = requests.post(
    'https://your-api.run.app/v1/workflows/create-next-story/execute',
    json={'bmad_project_id': 'my-project'},
    headers={'Authorization': f'Bearer {token}'}
)
```

## Testing

Each workflow includes unit tests and integration tests:

```bash
# Run unit tests
pytest workflows/test_create_next_story.py

# Run integration tests (requires GCP resources)
pytest workflows/integration/test_create_next_story_integration.py
```

## Monitoring

Workflows emit structured logs and metrics:
- Cloud Logging: Execution traces, errors, warnings
- Cloud Monitoring: Execution duration, success rate, error rate
- Cloud Trace: Distributed tracing across services

## Performance Considerations

| Workflow | Avg Duration | Firestore Reads | Firestore Writes | Storage Reads |
|----------|-------------|-----------------|------------------|---------------|
| create-next-story | 30-60s | 10-20 | 5-10 | 8-12 files |
| review-story | 60-120s | 15-30 | 8-15 | 10-20 files |
| risk-profile | 20-40s | 5-10 | 3-5 | 3-5 files |
| test-design | 30-60s | 8-15 | 4-8 | 5-8 files |
| apply-qa-fixes | 60-180s | 10-20 | 10-20 | Variable |
| validate-next-story | 15-30s | 5-10 | 2-4 | 2-3 files |
| execute-checklist | 20-40s | 8-12 | 3-5 | 3-6 files |
| shard-doc | 40-80s | 5-10 | 15-30 | 1 file |

## Cost Estimates

Monthly costs (assuming 100 workflow executions/month):

| Workflow | Reasoning Engine | Firestore | Storage | Total/month |
|----------|-----------------|-----------|---------|-------------|
| create-next-story | $15 | $2 | $1 | $18 |
| review-story | $25 | $3 | $2 | $30 |
| risk-profile | $10 | $1 | $1 | $12 |
| test-design | $15 | $2 | $1 | $18 |
| apply-qa-fixes | $20 | $3 | $1 | $24 |
| validate-next-story | $8 | $1 | $1 | $10 |
| execute-checklist | $12 | $2 | $1 | $15 |
| shard-doc | $15 | $3 | $1 | $19 |
| **TOTAL** | | | | **$146/month** |

*Costs scale linearly with usage*

## Architecture References

- [Architecture Design Document](../architecture-design.md) - Overall system architecture
- [Agent Configurations](../agent-configurations/) - Agent-specific configurations
- [Storage Schema](../storage-schema.md) - Data storage patterns
- [API Specifications](../api-specifications.md) - API endpoints

## Analysis References

All workflows are based on comprehensive task analysis documents:
- [Task Analysis Directory](../../analysis/tasks/) - 23 task analyses
- [Agent Analysis Directory](../../analysis/agents/) - 10 agent analyses
- [Workflow Analysis Directory](../../analysis/workflows/) - 6 workflow patterns

## Contributing

When creating new workflows:
1. Follow the WorkflowAgent pattern
2. Implement state persistence for resumability
3. Add comprehensive error handling
4. Document steps with @WorkflowStep decorator
5. Include deployment configuration
6. Add unit and integration tests
7. Update this README

## Support

For questions or issues:
- Review analysis documentation in `analysis/tasks/`
- Check agent configurations in `agent-configurations/`
- Consult architecture design document
- Open GitHub issue for bugs or feature requests

---

**Document Version**: 1.0
**Created**: 2025-10-15
**Last Updated**: 2025-10-15
**Framework**: BMad Core v4 → Google ADK + Vertex AI Reasoning Engine
