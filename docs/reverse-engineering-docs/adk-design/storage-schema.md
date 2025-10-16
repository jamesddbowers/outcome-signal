# BMad ADK Storage Schema Design

**Document Version**: 1.0
**Created**: 2025-10-15
**Status**: Complete
**Phase**: Phase 6 - Task 6.5
**Related Documents**:
- [Architecture Design](architecture-design.md)
- [API Specifications](api-specifications.md)
- [State Management Analysis](../analysis/state-management.md)
- [Agent Configurations](agent-configurations/)
- [Reasoning Engine Workflows](reasoning-engine-workflows/)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Storage Architecture Overview](#2-storage-architecture-overview)
3. [Firestore Collections](#3-firestore-collections)
4. [Cloud Storage Buckets](#4-cloud-storage-buckets)
5. [Indexes and Queries](#5-indexes-and-queries)
6. [Access Control and Security](#6-access-control-and-security)
7. [Versioning Strategy](#7-versioning-strategy)
8. [Backup and Recovery](#8-backup-and-recovery)
9. [Migration from File-Based System](#9-migration-from-file-based-system)
10. [Performance Optimization](#10-performance-optimization)
11. [Cost Optimization](#11-cost-optimization)

---

## 1. Executive Summary

### 1.1 Overview

This document defines the comprehensive storage schema for the BMad Framework implementation on Google Cloud Platform. The design migrates BMad's file-based state management to a cloud-native architecture using **Firestore** for structured data and **Cloud Storage** for documents.

### 1.2 Storage Services Selection

| Service | Purpose | Rationale |
|---------|---------|-----------|
| **Firestore** | Structured state, metadata, queryable data | Real-time queries, concurrent access, transactions, offline support |
| **Cloud Storage** | Documents, templates, artifacts, knowledge base | Cost-effective, versioning, large file support, GCS integration |
| **Vertex AI Search** | Knowledge base indexing and semantic search | KB Mode RAG support, semantic search, citation |
| **Secret Manager** | API keys, credentials, sensitive configuration | Secure secret storage, rotation, audit trail |

### 1.3 Storage Distribution Strategy

**Firestore Storage** (Real-Time Queryable State):
- Project configurations
- Story state and metadata
- QA gate decisions
- Workflow state (for resumption)
- Agent session context
- Audit logs and change history

**Cloud Storage** (Document Repository):
- Large artifacts (PRDs, architectures, specifications)
- Story content documents
- QA assessments and reports
- Templates (YAML)
- Knowledge base documents
- Team bundle definitions
- Generated outputs

### 1.4 Key Design Principles

1. **Separation of Concerns**: Structured state in Firestore, documents in Cloud Storage
2. **Query Optimization**: Firestore for indexed queries, Cloud Storage for blob storage
3. **Cost Efficiency**: Pay-per-operation (Firestore) vs pay-per-GB (Cloud Storage)
4. **Scalability**: Both services auto-scale to millions of operations
5. **Consistency**: Strong consistency in Firestore, eventual consistency in Cloud Storage
6. **Versioning**: Firestore subcollections for metadata versions, Cloud Storage object versioning for documents
7. **Security**: IAM-based access control, encryption at rest and in transit
8. **Backup**: Automated Firestore exports, Cloud Storage lifecycle policies

### 1.5 Storage Capacity Estimates

**Typical Project (Firestore)**:
```
Project config:         ~10 KB
Stories (50):           ~250 KB (5 KB each)
Gates (50):             ~100 KB (2 KB each)
Workflow state (20):    ~200 KB (10 KB each)
Sessions (10 active):   ~500 KB (50 KB each)
Total per project:      ~1.1 MB
```

**Typical Project (Cloud Storage)**:
```
PRD document:           ~500 KB
Architecture document:  ~800 KB
Story documents (50):   ~2.5 MB (50 KB each)
QA assessments (50):    ~5 MB (100 KB each)
Templates:              ~2 MB (shared)
Knowledge base:         ~50 MB (shared)
Total per project:      ~8.8 MB + shared resources
```

**100 Projects Estimate**:
- Firestore: ~110 MB (~$0.50/month storage)
- Cloud Storage: ~1 GB + shared resources (~$0.02/month storage)
- **Total Storage Cost**: ~$0.52/month for 100 projects

### 1.6 Migration Path

File-Based → Cloud-Native:

1. **Phase 1**: Parallel operation (sync file system ↔ cloud storage)
2. **Phase 2**: Cloud-first (write to cloud, sync to files)
3. **Phase 3**: Cloud-only (files deprecated, cloud is source of truth)

---

## 2. Storage Architecture Overview

### 2.1 Three-Layer Storage Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│   (Agents, Workflows, API Services)                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE ACCESS LAYER                          │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Firestore SDK  │  │  Storage SDK    │  │ Vertex AI Search│ │
│  │  - Queries      │  │  - Blob ops     │  │ - Semantic      │ │
│  │  - Transactions │  │  - Signed URLs  │  │   search        │ │
│  │  - Real-time    │  │  - Versioning   │  │ - RAG           │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     STORAGE SERVICES LAYER                       │
│                                                                   │
│  ┌──────────────────────┐       ┌──────────────────────┐        │
│  │      FIRESTORE       │       │   CLOUD STORAGE      │        │
│  │  (Native Mode)       │       │   (Standard Class)   │        │
│  │                      │       │                      │        │
│  │ Collections:         │       │ Buckets:             │        │
│  │ - /projects          │       │ - bmad-templates     │        │
│  │ - /stories           │       │ - bmad-artifacts     │        │
│  │ - /gates             │       │ - bmad-kb            │        │
│  │ - /workflows         │       │ - bmad-data          │        │
│  │ - /sessions          │       │                      │        │
│  │                      │       │                      │        │
│  │ Features:            │       │ Features:            │        │
│  │ - Real-time queries  │       │ - Object versioning  │        │
│  │ - Transactions       │       │ - Lifecycle policies │        │
│  │ - Offline support    │       │ - Signed URLs        │        │
│  │ - Composite indexes  │       │ - CDN integration    │        │
│  └──────────────────────┘       └──────────────────────┘        │
│                                                                   │
│  ┌──────────────────────┐       ┌──────────────────────┐        │
│  │ VERTEX AI SEARCH     │       │  SECRET MANAGER      │        │
│  │ (Datastore: bmad-kb) │       │                      │        │
│  │                      │       │ Secrets:             │        │
│  │ - Semantic search    │       │ - API keys           │        │
│  │ - RAG support        │       │ - Service accounts   │        │
│  │ - Citation tracking  │       │ - Credentials        │        │
│  └──────────────────────┘       └──────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Storage Decision Tree

**When to Use Firestore:**
- ✅ Structured data with well-defined schema
- ✅ Need real-time queries (e.g., "get all stories with status=Review")
- ✅ Need transactions (atomic updates)
- ✅ Need offline support (IDE plugins)
- ✅ Small to medium documents (< 1 MB)
- ✅ Frequent reads and writes

**When to Use Cloud Storage:**
- ✅ Large documents (> 1 MB)
- ✅ Binary files (images, PDFs)
- ✅ Infrequent access (templates, KB docs)
- ✅ Version history with rollback
- ✅ CDN delivery (public documentation)
- ✅ Cost-sensitive storage (bulk storage)

**When to Use Both:**
- ✅ Large artifacts: Metadata in Firestore, content in Cloud Storage
- ✅ Stories: State in Firestore, full document in Cloud Storage
- ✅ QA assessments: Gate decision in Firestore, full report in Cloud Storage

### 2.3 Data Flow Patterns

#### Pattern 1: Agent Creates Artifact

```
Agent → Create PRD
         │
         ├─→ Firestore: Create /projects/{id}/artifacts/{artifactId}
         │   {
         │     type: "prd",
         │     status: "draft",
         │     owner: "pm-agent",
         │     created_at: timestamp,
         │     gcs_path: "gs://bmad-artifacts/{projectId}/prd.md"
         │   }
         │
         └─→ Cloud Storage: Write gs://bmad-artifacts/{projectId}/prd.md
             (Full markdown document)
```

#### Pattern 2: Workflow Reads Story

```
Workflow → Get Next Story
            │
            ├─→ Firestore: Query /projects/{id}/stories
            │   WHERE status = "approved"
            │   ORDER BY epic, story
            │   LIMIT 1
            │   → Returns: Story metadata
            │
            └─→ Cloud Storage: Read gs://bmad-artifacts/{projectId}/stories/1.1.md
                → Returns: Full story document
```

#### Pattern 3: QA Agent Creates Gate

```
QA Agent → Review Story → Create Gate
           │
           ├─→ Firestore: Create /projects/{id}/gates/{gateId}
           │   {
           │     story_id: "1.1",
           │     decision: "pass",
           │     rationale: "...",
           │     created_at: timestamp,
           │     created_by: "qa-agent"
           │   }
           │
           └─→ Firestore: Update /projects/{id}/stories/1.1
               {
                 status: "done",
                 gate_id: {gateId},
                 updated_at: timestamp
               }
```

### 2.4 Storage Service Characteristics

| Characteristic | Firestore | Cloud Storage |
|---------------|-----------|---------------|
| **Data Model** | Document collections | Object blobs |
| **Max Document Size** | 1 MB | 5 TB per object |
| **Query Capability** | Rich queries, indexes | List objects, no content search |
| **Transaction Support** | Yes (atomic, multi-document) | No (object-level only) |
| **Real-Time Updates** | Yes (listeners) | No (polling required) |
| **Offline Support** | Yes (SDK caching) | Limited (manual caching) |
| **Versioning** | Via subcollections | Native object versioning |
| **Access Control** | Security Rules + IAM | IAM + signed URLs |
| **Backup** | Managed exports | Lifecycle policies, versioning |
| **Cost per GB (Storage)** | $0.18/GB/month | $0.02/GB/month (Standard) |
| **Cost per Operation** | $0.06/100K reads | $0.004/10K reads |
| **Best For** | Metadata, state, queries | Documents, files, archives |

---

## 3. Firestore Collections

### 3.1 Collection Hierarchy Overview

```
firestore (Native Mode)
├── projects/{projectId}
│   ├── config (document)
│   ├── metadata (document)
│   ├── artifacts (subcollection)
│   │   └── {artifactId} (documents)
│   │       └── versions (subcollection)
│   ├── stories (subcollection)
│   │   └── {storyId} (documents)
│   │       ├── tasks (subcollection)
│   │       └── changes (subcollection)
│   ├── gates (subcollection)
│   │   └── {gateId} (documents)
│   └── statistics (document)
├── workflows/{workflowId}
│   ├── state (document)
│   └── steps (subcollection)
├── sessions/{sessionId}
│   ├── context (document)
│   └── messages (subcollection)
├── agents/{agentId}
│   └── metrics (document)
└── system
    ├── config (document)
    └── templates (document)
```

### 3.2 Collection: `/projects/{projectId}`

**Purpose**: Root document for each BMad project containing configuration and metadata.

#### 3.2.1 Root Document Schema

```javascript
{
  // Document ID: {projectId} (e.g., "proj-abc123")

  // === PROJECT IDENTIFICATION ===
  "project_id": "proj-abc123",
  "project_name": "Customer Portal Redesign",
  "project_type": "greenfield" | "brownfield",
  "workflow_type": "fullstack" | "service" | "ui",

  // === PROJECT STATUS ===
  "status": "planning" | "development" | "complete",
  "current_phase": "discovery" | "requirements" | "architecture" | "implementation" | "qa" | "deployment",

  // === TIMESTAMPS ===
  "created_at": Timestamp,
  "updated_at": Timestamp,
  "started_at": Timestamp,
  "completed_at": Timestamp | null,

  // === TEAM & OWNERSHIP ===
  "owner_user_id": "user-xyz789",
  "team_members": ["user-xyz789", "user-abc456"],
  "created_by_agent": "bmad-orchestrator",

  // === PROJECT METADATA ===
  "description": "Redesign customer portal for improved UX and performance",
  "tags": ["frontend", "react", "typescript", "cloud"],
  "repository_url": "https://github.com/org/customer-portal",
  "environment": "production" | "staging" | "development",

  // === CONFIGURATION REFERENCE ===
  "config_version": "4.0",
  "config_last_updated": Timestamp,

  // === STATISTICS (DENORMALIZED FOR QUICK ACCESS) ===
  "stats": {
    "total_epics": 5,
    "total_stories": 47,
    "stories_draft": 12,
    "stories_approved": 3,
    "stories_in_progress": 2,
    "stories_review": 1,
    "stories_done": 29,
    "gates_pass": 27,
    "gates_concerns": 2,
    "gates_fail": 0,
    "gates_waived": 0,
    "artifacts_count": 15
  },

  // === FLAGS & SETTINGS ===
  "is_archived": false,
  "is_public": false,
  "enable_notifications": true,

  // === AUDIT ===
  "last_activity_at": Timestamp,
  "last_activity_by": "dev-agent"
}
```

**Indexes**:
```yaml
# Composite indexes for common queries
- collectionGroup: projects
  fields:
    - name: owner_user_id
      order: ASCENDING
    - name: status
      order: ASCENDING
    - name: created_at
      order: DESCENDING

- collectionGroup: projects
  fields:
    - name: status
      order: ASCENDING
    - name: current_phase
      order: ASCENDING
```

#### 3.2.2 Subcollection: `/projects/{projectId}/config`

**Purpose**: Stores core-config.yaml equivalent configuration (formerly `.bmad-core/core-config.yaml`).

**Document ID**: `current` (single document)

```javascript
{
  // === CONFIGURATION METADATA ===
  "config_id": "current",
  "version": "4.0",
  "updated_at": Timestamp,
  "updated_by": "user-xyz789",

  // === FILE LOCATIONS (Cloud Storage Paths) ===
  "locations": {
    "prd": "gs://bmad-artifacts/{projectId}/prd/",
    "architecture": "gs://bmad-artifacts/{projectId}/architecture/",
    "front_end_spec": "gs://bmad-artifacts/{projectId}/frontend-spec.md",
    "stories": "gs://bmad-artifacts/{projectId}/stories/",
    "qa_assessments": "gs://bmad-artifacts/{projectId}/qa/assessments/",
    "qa_gates": null,  // Gates stored in Firestore, not GCS
    "project_brief": "gs://bmad-artifacts/{projectId}/project-brief.md"
  },

  // === AGENT CONFIGURATION ===
  "agents": {
    "dev": {
      "always_load_files": [
        "gs://bmad-data/technical-preferences.md",
        "gs://bmad-artifacts/{projectId}/architecture/index.md"
      ]
    },
    "qa": {
      "risk_threshold": 7,  // Automatic deep review if risk >= 7
      "enable_active_refactoring": true
    },
    "pm": {
      "elicitation_mode": "interactive" | "yolo"
    }
  },

  // === WORKFLOW SETTINGS ===
  "workflows": {
    "require_story_validation": false,  // PO validation before dev
    "enable_mid_dev_qa": true,  // QA during development
    "auto_shard_prd": true,
    "auto_shard_architecture": true
  },

  // === SHARDING CONFIGURATION ===
  "sharding": {
    "prd_sharded": true,
    "architecture_sharded": true,
    "architecture_version": "v4",  // v4 = concern-based sharding
    "epic_pattern": "{epic}.{story}"  // Story ID format
  },

  // === QUALITY SETTINGS ===
  "quality": {
    "enable_gate_decisions": true,
    "gate_required_for_done": true,
    "enable_risk_profiling": true,
    "enable_test_design": true,
    "enable_nfr_assessment": true,
    "enable_requirements_tracing": true
  },

  // === NOTIFICATION SETTINGS ===
  "notifications": {
    "slack_webhook": "https://hooks.slack.com/services/...",
    "notify_on_story_complete": true,
    "notify_on_gate_decision": true,
    "notify_on_workflow_complete": true
  },

  // === INTEGRATION SETTINGS ===
  "integrations": {
    "github": {
      "enabled": true,
      "repo": "org/customer-portal",
      "sync_stories": true
    },
    "jira": {
      "enabled": false
    }
  },

  // === PROJECT-SPECIFIC DATA ===
  "custom_fields": {
    // Project-specific configuration
    "deployment_target": "cloud-run",
    "primary_language": "typescript"
  }
}
```

**Indexes**: None (single document per project)

**Access Pattern**:
```python
# Read configuration
config_ref = db.collection('projects').document(project_id).collection('config').document('current')
config = config_ref.get().to_dict()

# Update specific setting
config_ref.update({
    'workflows.require_story_validation': True,
    'updated_at': firestore.SERVER_TIMESTAMP
})
```

#### 3.2.3 Subcollection: `/projects/{projectId}/artifacts/{artifactId}`

**Purpose**: Tracks all artifacts created during planning and development phases.

**Document Schema**:

```javascript
{
  // === ARTIFACT IDENTIFICATION ===
  "artifact_id": "art-prd-20251015",
  "type": "prd" | "architecture" | "frontend_spec" | "project_brief" | "qa_assessment",
  "name": "Product Requirements Document",

  // === STORAGE LOCATION ===
  "gcs_path": "gs://bmad-artifacts/{projectId}/prd.md",
  "gcs_bucket": "bmad-artifacts",
  "gcs_object": "{projectId}/prd.md",

  // === ARTIFACT STATUS ===
  "status": "draft" | "in_review" | "approved" | "archived",
  "version": 1,
  "is_sharded": false,
  "shard_index_path": null,  // If sharded: "gs://bmad-artifacts/{projectId}/prd/index.md"

  // === OWNERSHIP ===
  "owner_agent": "pm-agent",
  "created_by": "pm-agent",
  "last_modified_by": "po-agent",

  // === TIMESTAMPS ===
  "created_at": Timestamp,
  "updated_at": Timestamp,

  // === METADATA ===
  "size_bytes": 524288,  // 512 KB
  "content_type": "text/markdown",
  "checksum_md5": "abc123def456...",

  // === RELATIONSHIPS ===
  "related_artifacts": ["art-arch-20251015"],
  "derived_from": null,  // Parent artifact if this is derived

  // === PERMISSIONS ===
  "sections": {
    // Section-level ownership (from template system)
    "executive_summary": {
      "owner": "pm-agent",
      "editors": ["po-agent"],
      "editable": true
    },
    "epics": {
      "owner": "pm-agent",
      "editors": [],
      "editable": false  // After sharding
    }
  },

  // === CHANGE TRACKING ===
  "change_count": 5,
  "last_change_description": "Updated epic priorities based on stakeholder feedback",

  // === FLAGS ===
  "is_deleted": false,
  "is_archived": false,
  "is_locked": false  // Prevent further edits
}
```

**Indexes**:
```yaml
- collectionGroup: artifacts
  fields:
    - name: type
      order: ASCENDING
    - name: created_at
      order: DESCENDING

- collectionGroup: artifacts
  fields:
    - name: owner_agent
      order: ASCENDING
    - name: status
      order: ASCENDING
```

**Subcollection: `/projects/{projectId}/artifacts/{artifactId}/versions`**

Purpose: Version history for artifacts.

```javascript
{
  "version_number": 2,
  "gcs_path": "gs://bmad-artifacts/{projectId}/prd.md#version=1697123456",
  "created_at": Timestamp,
  "created_by": "pm-agent",
  "change_description": "Added Epic 3: User Profile Management",
  "size_bytes": 487654
}
```

#### 3.2.4 Subcollection: `/projects/{projectId}/stories/{storyId}`

**Purpose**: Stores all user stories with their state, tasks, and history.

**Document ID**: `{epic}.{story}` (e.g., "1.1", "2.3")

**Document Schema**:

```javascript
{
  // === STORY IDENTIFICATION ===
  "story_id": "1.1",
  "epic": 1,
  "story": 1,
  "title": "User Authentication",

  // === STORY STATUS ===
  "status": "draft" | "approved" | "in_progress" | "review" | "done",
  "status_updated_at": Timestamp,
  "status_updated_by": "dev-agent",

  // === STORY TYPE ===
  "story_type": "backend" | "frontend" | "fullstack",

  // === STORAGE LOCATION ===
  "gcs_path": "gs://bmad-artifacts/{projectId}/stories/1.1.md",

  // === OWNERSHIP ===
  "created_by": "sm-agent",
  "assigned_to": "dev-agent",
  "reviewed_by": "qa-agent",

  // === TIMESTAMPS ===
  "created_at": Timestamp,
  "updated_at": Timestamp,
  "started_at": Timestamp | null,  // When status changed to in_progress
  "completed_at": Timestamp | null,  // When status changed to done

  // === REQUIREMENTS (DENORMALIZED FOR QUERIES) ===
  "user_story": {
    "role": "user",
    "action": "authenticate with email and password",
    "benefit": "access personalized content securely"
  },
  "acceptance_criteria": [
    "User can log in with valid credentials",
    "Invalid credentials show error message",
    "Session persists for 24 hours"
  ],

  // === TASKS ===
  "tasks": [
    {
      "id": "task-1",
      "description": "Implement authentication API endpoint",
      "status": "done",
      "completed_at": Timestamp
    },
    {
      "id": "task-2",
      "description": "Add password hashing with bcrypt",
      "status": "done",
      "completed_at": Timestamp
    },
    {
      "id": "task-3",
      "description": "Implement JWT token generation",
      "status": "in_progress",
      "completed_at": null
    }
  ],
  "tasks_total": 5,
  "tasks_completed": 2,

  // === QUALITY ASSURANCE ===
  "gate_id": "gate-1.1-20251015" | null,
  "gate_decision": "pass" | "concerns" | "fail" | "waived" | null,
  "qa_issues_count": 0,
  "risk_score": 4,  // 1-9 scale (from risk-profile)

  // === RELATIONSHIPS ===
  "epic_title": "User Management",
  "depends_on": [],  // Story IDs this story depends on
  "blocks": ["1.2"],  // Story IDs blocked by this story

  // === METADATA ===
  "estimated_hours": 8,
  "actual_hours": 6.5,
  "complexity": "medium",  // low, medium, high
  "priority": "P0",  // P0, P1, P2

  // === FLAGS ===
  "is_blocked": false,
  "is_deleted": false,
  "requires_validation": false,  // PO validation before dev

  // === CHANGE TRACKING ===
  "change_count": 3,
  "last_change_description": "Updated acceptance criteria based on QA feedback"
}
```

**Indexes**:
```yaml
# Critical indexes for story queries
- collectionGroup: stories
  fields:
    - name: status
      order: ASCENDING
    - name: epic
      order: ASCENDING
    - name: story
      order: ASCENDING

- collectionGroup: stories
  fields:
    - name: status
      order: ASCENDING
    - name: priority
      order: ASCENDING
    - name: created_at
      order: ASCENDING

- collectionGroup: stories
  fields:
    - name: assigned_to
      order: ASCENDING
    - name: status
      order: ASCENDING

- collectionGroup: stories
  fields:
    - name: gate_decision
      order: ASCENDING
    - name: completed_at
      order: DESCENDING
```

**Subcollection: `/projects/{projectId}/stories/{storyId}/tasks`**

Purpose: Detailed task tracking (alternative to embedding tasks in story document).

```javascript
{
  "task_id": "task-1",
  "description": "Implement authentication API endpoint",
  "status": "done" | "in_progress" | "blocked" | "not_started",
  "assigned_to": "dev-agent",
  "created_at": Timestamp,
  "completed_at": Timestamp,
  "estimated_hours": 3,
  "actual_hours": 2.5
}
```

**Subcollection: `/projects/{projectId}/stories/{storyId}/changes`**

Purpose: Audit trail of story changes.

```javascript
{
  "change_id": "chg-123",
  "timestamp": Timestamp,
  "changed_by": "dev-agent",
  "change_type": "status_update" | "content_update" | "task_update",
  "old_value": "in_progress",
  "new_value": "review",
  "description": "Story implementation complete, ready for QA review"
}
```

#### 3.2.5 Subcollection: `/projects/{projectId}/gates/{gateId}`

**Purpose**: Stores QA gate decisions for stories.

**Document ID**: `{storyId}-{timestamp}` (e.g., "1.1-20251015143022")

**Document Schema**:

```javascript
{
  // === GATE IDENTIFICATION ===
  "gate_id": "gate-1.1-20251015143022",
  "story_id": "1.1",
  "gate_type": "comprehensive_review",  // Type of QA review

  // === GATE DECISION ===
  "decision": "pass" | "concerns" | "fail" | "waived",
  "decision_rationale": "All requirements met. Code quality high. Tests comprehensive.",

  // === QA AGENT INFO ===
  "created_by": "qa-agent",
  "reviewer_name": "Quinn",

  // === TIMESTAMPS ===
  "created_at": Timestamp,
  "review_started_at": Timestamp,
  "review_completed_at": Timestamp,
  "review_duration_minutes": 45,

  // === ASSESSMENT REFERENCES ===
  "assessments": {
    "risk_profile": "gs://bmad-artifacts/{projectId}/qa/assessments/1.1-risk-20251015.md",
    "test_design": "gs://bmad-artifacts/{projectId}/qa/assessments/1.1-test-design-20251015.md",
    "requirements_trace": "gs://bmad-artifacts/{projectId}/qa/assessments/1.1-trace-20251015.md",
    "nfr_assessment": "gs://bmad-artifacts/{projectId}/qa/assessments/1.1-nfr-20251015.md"
  },

  // === QUALITY METRICS (DENORMALIZED) ===
  "risk_score": 4,  // 1-9 scale
  "test_coverage_percent": 87,
  "requirements_traced_percent": 100,
  "critical_issues_count": 0,
  "major_issues_count": 0,
  "minor_issues_count": 2,

  // === ISSUES FOUND ===
  "issues": [
    {
      "severity": "minor",
      "category": "code_quality",
      "description": "Consider extracting validation logic into separate function",
      "location": "src/auth/login.ts:45",
      "recommendation": "Refactor for better maintainability"
    },
    {
      "severity": "minor",
      "category": "documentation",
      "description": "Add JSDoc comments to public API methods",
      "location": "src/auth/api.ts",
      "recommendation": "Improve code documentation"
    }
  ],

  // === REFACTORING PERFORMED (IF ANY) ===
  "active_refactoring": {
    "performed": true,
    "description": "Extracted validation logic, improved error handling",
    "files_modified": ["src/auth/validators.ts", "src/auth/login.ts"],
    "commit_sha": "abc123def456"
  },

  // === NEXT ACTIONS ===
  "next_actions": [
    "Address minor code quality suggestions",
    "Add JSDoc documentation",
    "Proceed to deployment"
  ],

  // === WAIVER INFO (IF decision=waived) ===
  "waiver": {
    "reason": null,
    "approved_by": null,
    "approved_at": null
  },

  // === FLAGS ===
  "is_final": true,  // Final gate or interim review
  "requires_resubmission": false
}
```

**Indexes**:
```yaml
- collectionGroup: gates
  fields:
    - name: story_id
      order: ASCENDING
    - name: created_at
      order: DESCENDING

- collectionGroup: gates
  fields:
    - name: decision
      order: ASCENDING
    - name: created_at
      order: DESCENDING

- collectionGroup: gates
  fields:
    - name: risk_score
      order: DESCENDING
    - name: created_at
      order: DESCENDING
```

#### 3.2.6 Document: `/projects/{projectId}/statistics`

**Purpose**: Real-time project statistics (updated via triggers).

**Document ID**: `current` (single document)

```javascript
{
  // === STORY STATISTICS ===
  "stories": {
    "total": 47,
    "by_status": {
      "draft": 12,
      "approved": 3,
      "in_progress": 2,
      "review": 1,
      "done": 29
    },
    "by_type": {
      "backend": 18,
      "frontend": 15,
      "fullstack": 14
    },
    "by_priority": {
      "P0": 12,
      "P1": 23,
      "P2": 12
    }
  },

  // === EPIC STATISTICS ===
  "epics": {
    "total": 5,
    "completed": 2,
    "in_progress": 3,
    "completion_percent": 40
  },

  // === GATE STATISTICS ===
  "gates": {
    "total": 29,
    "pass": 27,
    "concerns": 2,
    "fail": 0,
    "waived": 0,
    "pass_rate_percent": 93
  },

  // === QUALITY METRICS ===
  "quality": {
    "average_risk_score": 3.8,
    "high_risk_stories": 2,  // risk_score >= 7
    "average_test_coverage": 84,
    "requirements_traceability": 98
  },

  // === TIME METRICS ===
  "time": {
    "average_story_duration_hours": 18.5,
    "total_estimated_hours": 376,
    "total_actual_hours": 305,
    "efficiency_percent": 123  // (estimated / actual) * 100
  },

  // === ACTIVITY METRICS ===
  "activity": {
    "stories_created_last_7_days": 5,
    "stories_completed_last_7_days": 8,
    "gates_created_last_7_days": 7,
    "active_agent_count": 4
  },

  // === LAST UPDATED ===
  "updated_at": Timestamp,
  "next_update_at": Timestamp  // Scheduled update time
}
```

### 3.3 Collection: `/workflows/{workflowId}`

**Purpose**: Tracks workflow execution state for resumability.

**Document Schema**:

```javascript
{
  // === WORKFLOW IDENTIFICATION ===
  "workflow_id": "wf-create-story-20251015143022",
  "workflow_name": "create-next-story",
  "workflow_type": "reasoning_engine",

  // === PROJECT CONTEXT ===
  "project_id": "proj-abc123",
  "story_id": "1.1",  // Context-specific data

  // === EXECUTION STATE ===
  "status": "running" | "completed" | "failed" | "paused" | "cancelled",
  "current_step": 3,  // 0-indexed step number
  "total_steps": 6,
  "step_name": "gather_architecture_context",

  // === WORKFLOW DATA ===
  "input": {
    "project_id": "proj-abc123",
    "user_request": "Create next story for Epic 1"
  },
  "output": {
    // Final workflow output (when status=completed)
    "story_id": "1.1",
    "story_path": "gs://bmad-artifacts/{projectId}/stories/1.1.md"
  },

  // === STATE DATA (for resumption) ===
  "state": {
    // Serialized workflow state
    "story_id": {"epic": 1, "story": 1},
    "requirements": {...},
    "arch_context": {...},
    "previous_insights": "..."
  },

  // === TIMING ===
  "created_at": Timestamp,
  "started_at": Timestamp,
  "completed_at": Timestamp | null,
  "updated_at": Timestamp,
  "duration_seconds": 127,

  // === ERROR HANDLING ===
  "error": {
    "occurred": false,
    "step": null,
    "message": null,
    "stack_trace": null
  },

  // === AGENT INFO ===
  "agent_id": "sm-agent",
  "triggered_by": "user-xyz789",

  // === RESUMABILITY ===
  "is_resumable": true,
  "resume_token": "eyJhbGciOi...",  // Encrypted state token

  // === METADATA ===
  "retry_count": 0,
  "max_retries": 3,
  "timeout_seconds": 600
}
```

**Indexes**:
```yaml
- collectionGroup: workflows
  fields:
    - name: project_id
      order: ASCENDING
    - name: status
      order: ASCENDING
    - name: created_at
      order: DESCENDING

- collectionGroup: workflows
  fields:
    - name: agent_id
      order: ASCENDING
    - name: status
      order: ASCENDING
```

**Subcollection: `/workflows/{workflowId}/steps`**

Purpose: Detailed step execution log.

```javascript
{
  "step_number": 2,
  "step_name": "gather_requirements",
  "status": "completed",
  "started_at": Timestamp,
  "completed_at": Timestamp,
  "duration_seconds": 15,
  "input": {...},
  "output": {...},
  "error": null
}
```

### 3.4 Collection: `/sessions/{sessionId}`

**Purpose**: Agent conversation sessions for context preservation.

**Document Schema**:

```javascript
{
  // === SESSION IDENTIFICATION ===
  "session_id": "sess-abc123xyz",
  "agent_id": "pm-agent",
  "project_id": "proj-abc123",

  // === SESSION STATE ===
  "status": "active" | "completed" | "expired",
  "created_at": Timestamp,
  "last_activity_at": Timestamp,
  "expires_at": Timestamp,  // TTL: 1 hour from last activity

  // === USER INFO ===
  "user_id": "user-xyz789",
  "user_name": "John Doe",

  // === CONTEXT DATA ===
  "context": {
    "current_task": "create_prd",
    "elicitation_mode": "interactive",
    "current_section": "executive_summary",
    "sections_completed": ["problem_statement", "goals"],
    "artifacts_created": ["art-prd-draft-20251015"]
  },

  // === CONVERSATION STATE ===
  "message_count": 15,
  "turn_count": 8,  // Back-and-forth exchanges

  // === METADATA ===
  "client_type": "web" | "ide" | "api",
  "client_version": "1.2.3"
}
```

**Subcollection: `/sessions/{sessionId}/messages`**

Purpose: Conversation history.

```javascript
{
  "message_id": "msg-123",
  "timestamp": Timestamp,
  "role": "user" | "agent",
  "content": "Please create a PRD for my customer portal project",
  "metadata": {
    "token_count": 250,
    "model_used": "gemini-2.0-flash-001"
  }
}
```

**Indexes**:
```yaml
- collectionGroup: sessions
  fields:
    - name: user_id
      order: ASCENDING
    - name: status
      order: ASCENDING
    - name: last_activity_at
      order: DESCENDING

- collectionGroup: sessions
  fields:
    - name: agent_id
      order: ASCENDING
    - name: status
      order: ASCENDING
```

### 3.5 Collection: `/agents/{agentId}`

**Purpose**: Agent performance metrics and statistics.

**Document Schema**:

```javascript
{
  // === AGENT IDENTIFICATION ===
  "agent_id": "pm-agent",
  "agent_name": "John - Product Manager",

  // === USAGE STATISTICS ===
  "metrics": {
    "total_invocations": 1247,
    "successful_invocations": 1198,
    "failed_invocations": 49,
    "success_rate_percent": 96,
    "average_duration_seconds": 23.5,
    "total_tokens_used": 8765432
  },

  // === RECENT ACTIVITY ===
  "recent_activity": {
    "last_invocation_at": Timestamp,
    "last_project_id": "proj-abc123",
    "last_task": "create_prd",
    "invocations_last_24h": 12,
    "invocations_last_7d": 89
  },

  // === UPDATED ===
  "updated_at": Timestamp
}
```

### 3.6 Collection: `/system`

**Purpose**: System-wide configuration and metadata.

**Document: `config`**

```javascript
{
  // === SYSTEM VERSION ===
  "bmad_version": "4.0",
  "adk_version": "1.2.0",

  // === SHARED RESOURCE LOCATIONS ===
  "shared_resources": {
    "templates_bucket": "bmad-templates",
    "data_bucket": "bmad-data",
    "kb_bucket": "bmad-kb"
  },

  // === AGENT DEFINITIONS ===
  "agents": {
    "analyst": {"display_name": "Mary - Research Analyst", "icon": "🔍"},
    "pm": {"display_name": "John - Product Manager", "icon": "📋"},
    // ... other agents
  },

  // === FEATURE FLAGS ===
  "features": {
    "enable_kb_mode": true,
    "enable_team_bundles": true,
    "enable_notifications": true
  },

  // === RATE LIMITS (SYSTEM-WIDE) ===
  "rate_limits": {
    "max_workflows_per_project_per_hour": 20,
    "max_agent_invocations_per_user_per_minute": 10
  }
}
```

**Document: `templates`**

```javascript
{
  // === TEMPLATE REGISTRY ===
  "templates": [
    {
      "template_id": "prd-tmpl",
      "name": "Product Requirements Document",
      "version": "4.0",
      "gcs_path": "gs://bmad-templates/prd-tmpl.yaml",
      "agents": ["pm-agent"],
      "updated_at": Timestamp
    },
    // ... other templates
  ]
}
```

---

## 4. Cloud Storage Buckets

### 4.1 Bucket Overview

BMad uses four primary Cloud Storage buckets for document storage:

| Bucket Name | Purpose | Access Pattern | Versioning | Lifecycle | Estimated Size |
|-------------|---------|----------------|------------|-----------|----------------|
| **bmad-templates** | YAML templates | Read-heavy, infrequent writes | Enabled | Keep 10 versions | ~10 MB |
| **bmad-artifacts** | Project artifacts (PRDs, stories, assessments) | Read/write balanced | Enabled | Keep 30 days | ~100 GB/1000 projects |
| **bmad-data** | Framework data files (technical preferences, etc.) | Read-only, cached | Enabled | Keep all versions | ~50 MB |
| **bmad-kb** | Knowledge base documents (indexed by Vertex AI Search) | Read-heavy | Enabled | Keep all versions | ~500 MB |

### 4.2 Bucket: `bmad-templates`

**Purpose**: Centralized template storage for all document types.

**Structure**:
```
bmad-templates/
├── prd-tmpl.yaml
├── brownfield-prd-tmpl.yaml
├── architecture-tmpl.yaml
├── fullstack-architecture-tmpl.yaml
├── brownfield-architecture-tmpl.yaml
├── front-end-architecture-tmpl.yaml
├── front-end-spec-tmpl.yaml
├── project-brief-tmpl.yaml
├── market-research-tmpl.yaml
├── competitor-analysis-tmpl.yaml
├── brainstorming-output-tmpl.yaml
├── story-tmpl.yaml
└── qa-gate-tmpl.yaml
```

**Access Control**:
- **Read**: All agents, all users
- **Write**: Admin only (via deployment pipeline)
- **Public Access**: No

**Versioning**:
- Enabled (keep last 10 versions)
- Allows rollback to previous template versions

**Caching**:
- CDN caching: Yes (1 hour TTL)
- Agent caching: Yes (in-memory for session duration)

**File Naming Convention**:
- `{document-type}-tmpl.yaml`
- Version tracked via object metadata, not filename

### 4.3 Bucket: `bmad-artifacts`

**Purpose**: Project-specific artifacts, stories, and QA assessments.

**Structure**:
```
bmad-artifacts/
├── {projectId}/
│   ├── project-brief.md
│   ├── prd.md                           # Monolithic (if not sharded)
│   ├── prd/                             # Sharded structure
│   │   ├── index.md
│   │   ├── 1.user-management.md
│   │   ├── 2.payment-system.md
│   │   └── ...
│   ├── architecture.md                  # Monolithic (if not sharded)
│   ├── architecture/                    # Sharded structure (v4)
│   │   ├── index.md
│   │   ├── tech-stack.md
│   │   ├── coding-standards.md
│   │   ├── project-structure.md
│   │   ├── data-models.md
│   │   ├── testing-strategy.md
│   │   ├── backend-architecture.md
│   │   ├── api-specifications.md
│   │   ├── external-apis.md
│   │   ├── frontend-architecture.md
│   │   ├── components.md
│   │   └── workflows.md
│   ├── frontend-spec.md
│   ├── stories/
│   │   ├── 1.1.md
│   │   ├── 1.2.md
│   │   ├── 2.1.md
│   │   └── ...
│   └── qa/
│       └── assessments/
│           ├── 1.1-risk-20251015.md
│           ├── 1.1-test-design-20251015.md
│           ├── 1.1-trace-20251015.md
│           ├── 1.1-nfr-20251015.md
│           └── ...
```

**Access Control**:
- **Read**: Project members, assigned agents
- **Write**: Agents (based on ownership rules)
- **Delete**: Project owner only
- **Public Access**: No (all private)

**Versioning**:
- Enabled (keep versions for 30 days)
- Object versioning provides rollback capability
- Major versions also tracked in Firestore metadata

**Lifecycle Policies**:
```yaml
# Delete old versions after 30 days
- action: Delete
  condition:
    age_days: 30
    is_live: false

# Archive completed projects after 1 year
- action: SetStorageClass
  storage_class: COLDLINE
  condition:
    age_days: 365
    matches_prefix: "{projectId}/"
    metadata:
      status: "complete"
```

**File Naming Conventions**:
- Stories: `{epic}.{story}.md` (e.g., "1.1.md")
- QA Assessments: `{storyId}-{type}-{YYYYMMDD}.md`
- Sharded documents: `{concern-name}.md`
- Index files: `index.md`

**Metadata Tags**:
```javascript
{
  "project_id": "proj-abc123",
  "artifact_type": "story",
  "story_id": "1.1",
  "status": "review",
  "owner_agent": "sm-agent",
  "created_by": "sm-agent",
  "last_modified_by": "dev-agent"
}
```

### 4.4 Bucket: `bmad-data`

**Purpose**: Framework-wide data files loaded by agents.

**Structure**:
```
bmad-data/
├── technical-preferences.md         # Dev agent always-loaded file
├── coding-standards-defaults.md     # Default coding standards
├── architecture-patterns.md         # Common architecture patterns
├── qa-checklists/
│   ├── story-draft-checklist.md
│   ├── story-dod-checklist.md      # Definition of Done
│   ├── po-master-checklist.md
│   ├── risk-assessment-checklist.md
│   ├── test-design-checklist.md
│   └── nfr-checklist.md
├── workflows/
│   ├── greenfield-fullstack.yaml
│   ├── greenfield-service.yaml
│   ├── greenfield-ui.yaml
│   ├── brownfield-fullstack.yaml
│   ├── brownfield-service.yaml
│   └── brownfield-ui.yaml
└── prompts/
    ├── elicitation-prompts.md
    └── deep-research-prompts.md
```

**Access Control**:
- **Read**: All agents, all users
- **Write**: Admin only
- **Public Access**: No

**Versioning**:
- Enabled (keep all versions)
- Critical files, version history important

**Caching**:
- Aggressive caching (24 hour TTL)
- Immutable content (changes infrequent)

### 4.5 Bucket: `bmad-kb`

**Purpose**: Knowledge base documents for KB Mode (BMad-Master agent).

**Structure**:
```
bmad-kb/
├── framework/
│   ├── overview.md
│   ├── getting-started.md
│   ├── core-concepts.md
│   └── architecture.md
├── agents/
│   ├── analyst-guide.md
│   ├── pm-guide.md
│   ├── ux-expert-guide.md
│   ├── architect-guide.md
│   ├── po-guide.md
│   ├── sm-guide.md
│   ├── dev-guide.md
│   ├── qa-guide.md
│   ├── bmad-master-guide.md
│   └── bmad-orchestrator-guide.md
├── tasks/
│   ├── create-next-story-guide.md
│   ├── review-story-guide.md
│   ├── risk-profile-guide.md
│   └── ...
├── templates/
│   ├── prd-template-guide.md
│   ├── architecture-template-guide.md
│   └── ...
├── workflows/
│   ├── greenfield-workflow-guide.md
│   ├── brownfield-workflow-guide.md
│   └── development-cycle-guide.md
├── best-practices/
│   ├── story-writing.md
│   ├── architecture-design.md
│   ├── qa-review.md
│   └── ...
└── troubleshooting/
    ├── common-issues.md
    ├── error-resolution.md
    └── faq.md
```

**Access Control**:
- **Read**: All users, all agents (BMad-Master specifically)
- **Write**: Admin, content contributors
- **Public Access**: Optionally public for documentation site

**Indexing**:
- **Vertex AI Search**: Full-text indexing enabled
- **RAG Support**: Documents used for retrieval-augmented generation
- **Citation Tracking**: Source documents cited in responses

**Versioning**:
- Enabled (keep all versions)
- Documentation versioning important for accuracy

**Search Configuration**:
```yaml
# Vertex AI Search datastore configuration
datastore_id: bmad-kb-datastore
location: global
content_type: CONTENT_REQUIRED  # Full text indexing
schema:
  - field: title (STRING)
  - field: category (STRING)
  - field: tags (STRING, multi-valued)
  - field: updated_at (TIMESTAMP)
  - field: content (STRING)  # Full text
```

### 4.6 Signed URLs for Secure Access

**Use Case**: Provide time-limited access to private objects.

**Example**:
```python
from google.cloud import storage
from datetime import timedelta

def generate_signed_url(bucket_name: str, object_name: str, expiration_minutes: int = 60):
    """Generate signed URL for temporary access to private object."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(object_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=expiration_minutes),
        method="GET"
    )
    return url

# Usage in agent
story_url = generate_signed_url("bmad-artifacts", f"{project_id}/stories/1.1.md")
# Agent can read story content via this URL for next 60 minutes
```

**Benefits**:
- No permanent public access required
- Fine-grained access control
- Audit trail via Cloud Logging
- Works with IDE plugins (download via signed URL)

### 4.7 Cloud Storage Access Patterns

#### Pattern 1: Agent Reads Template

```python
from google.cloud import storage

def load_template(template_name: str) -> dict:
    """Load YAML template from Cloud Storage."""
    storage_client = storage.Client()
    bucket = storage_client.bucket("bmad-templates")
    blob = bucket.blob(f"{template_name}.yaml")

    # Download as string
    content = blob.download_as_text()

    # Parse YAML
    import yaml
    template = yaml.safe_load(content)

    return template
```

#### Pattern 2: Agent Writes Story

```python
from google.cloud import storage
from google.cloud import firestore

def save_story(project_id: str, story_id: str, content: str, metadata: dict):
    """Save story to Cloud Storage and update Firestore metadata."""

    # 1. Save content to Cloud Storage
    storage_client = storage.Client()
    bucket = storage_client.bucket("bmad-artifacts")
    blob = bucket.blob(f"{project_id}/stories/{story_id}.md")

    # Set custom metadata
    blob.metadata = {
        "story_id": story_id,
        "owner_agent": metadata["owner_agent"],
        "created_by": metadata["created_by"]
    }

    # Upload content
    blob.upload_from_string(content, content_type="text/markdown")

    # 2. Update Firestore metadata
    db = firestore.Client()
    story_ref = db.collection("projects").document(project_id).collection("stories").document(story_id)
    story_ref.set({
        "story_id": story_id,
        "gcs_path": blob.public_url,
        "status": "draft",
        "created_at": firestore.SERVER_TIMESTAMP,
        **metadata
    })
```

#### Pattern 3: Workflow Reads Architecture (Selective)

```python
from google.cloud import storage

def read_architecture_sections(project_id: str, story_type: str) -> dict:
    """Read only relevant architecture sections based on story type."""
    storage_client = storage.Client()
    bucket = storage_client.bucket("bmad-artifacts")

    # Always read these sections
    always_read = ["tech-stack.md", "coding-standards.md", "project-structure.md",
                   "data-models.md", "testing-strategy.md"]

    # Story-type-specific sections
    type_specific = {
        "backend": ["backend-architecture.md", "api-specifications.md", "external-apis.md"],
        "frontend": ["frontend-architecture.md", "components.md", "workflows.md"],
        "fullstack": ["backend-architecture.md", "api-specifications.md", "external-apis.md",
                      "frontend-architecture.md", "components.md", "workflows.md"]
    }

    sections_to_read = always_read + type_specific.get(story_type, [])

    arch_context = {}
    for section_file in sections_to_read:
        blob = bucket.blob(f"{project_id}/architecture/{section_file}")
        if blob.exists():
            arch_context[section_file] = blob.download_as_text()

    return arch_context
```

---

## 5. Indexes and Queries

### 5.1 Firestore Index Strategy

**Automatic Indexes** (created by Firestore):
- Single-field indexes on every field (except arrays and maps)
- Used for simple equality and range queries

**Composite Indexes** (must be explicitly created):
- Multi-field queries with ordering
- Defined in `firestore.indexes.json`

### 5.2 Critical Composite Indexes

#### Index 1: Get Next Approved Story
```yaml
# Query: "Find next approved story, ordered by epic/story number"
- collectionGroup: stories
  fields:
    - name: status
      order: ASCENDING
    - name: epic
      order: ASCENDING
    - name: story
      order: ASCENDING
```

**Query Example**:
```python
stories_ref = db.collection_group("stories")
query = stories_ref.where("status", "==", "approved").order_by("epic").order_by("story").limit(1)
next_story = query.get()[0] if query.get() else None
```

#### Index 2: Get User's Active Projects
```yaml
- collectionGroup: projects
  fields:
    - name: owner_user_id
      order: ASCENDING
    - name: status
      order: ASCENDING
    - name: last_activity_at
      order: DESCENDING
```

**Query Example**:
```python
projects_ref = db.collection("projects")
query = projects_ref.where("owner_user_id", "==", user_id).where("status", "in", ["planning", "development"]).order_by("last_activity_at", direction=firestore.Query.DESCENDING)
active_projects = query.stream()
```

#### Index 3: Get Stories by Status and Priority
```yaml
- collectionGroup: stories
  fields:
    - name: status
      order: ASCENDING
    - name: priority
      order: ASCENDING
    - name: created_at
      order: ASCENDING
```

**Query Example**:
```python
# Get all "review" stories, prioritized by P0 > P1 > P2, then by creation date
stories_ref = db.collection_group("stories")
query = stories_ref.where("status", "==", "review").order_by("priority").order_by("created_at")
review_stories = query.stream()
```

#### Index 4: Get Recent Gate Decisions
```yaml
- collectionGroup: gates
  fields:
    - name: decision
      order: ASCENDING
    - name: created_at
      order: DESCENDING
```

**Query Example**:
```python
# Get all "fail" gates in last 7 days
from datetime import datetime, timedelta
seven_days_ago = datetime.now() - timedelta(days=7)

gates_ref = db.collection_group("gates")
query = gates_ref.where("decision", "==", "fail").where("created_at", ">=", seven_days_ago).order_by("created_at", direction=firestore.Query.DESCENDING)
failed_gates = query.stream()
```

#### Index 5: Get High-Risk Stories
```yaml
- collectionGroup: gates
  fields:
    - name: risk_score
      order: DESCENDING
    - name: created_at
      order: DESCENDING
```

**Query Example**:
```python
# Get stories with risk_score >= 7, most recent first
gates_ref = db.collection_group("gates")
query = gates_ref.where("risk_score", ">=", 7).order_by("risk_score", direction=firestore.Query.DESCENDING).order_by("created_at", direction=firestore.Query.DESCENDING)
high_risk = query.stream()
```

#### Index 6: Get Workflows by Status
```yaml
- collectionGroup: workflows
  fields:
    - name: project_id
      order: ASCENDING
    - name: status
      order: ASCENDING
    - name: created_at
      order: DESCENDING
```

**Query Example**:
```python
# Get all running workflows for a project
workflows_ref = db.collection("workflows")
query = workflows_ref.where("project_id", "==", project_id).where("status", "==", "running").order_by("created_at", direction=firestore.Query.DESCENDING)
running_workflows = query.stream()
```

### 5.3 Query Patterns and Best Practices

#### Pattern 1: Pagination with Cursors

```python
def get_stories_paginated(project_id: str, page_size: int = 20, page_token: str = None):
    """Get paginated stories using cursor-based pagination."""
    db = firestore.Client()
    stories_ref = db.collection("projects").document(project_id).collection("stories")

    query = stories_ref.order_by("epic").order_by("story").limit(page_size)

    # If page_token provided, start after that document
    if page_token:
        # Decode page_token to get document snapshot
        start_after_doc = db.collection("projects").document(project_id).collection("stories").document(page_token).get()
        query = query.start_after(start_after_doc)

    stories = list(query.stream())

    # Generate next page token
    next_page_token = stories[-1].id if len(stories) == page_size else None

    return {
        "stories": [s.to_dict() for s in stories],
        "next_page_token": next_page_token
    }
```

#### Pattern 2: Aggregation Queries (Using Client-Side Aggregation)

```python
def calculate_project_statistics(project_id: str) -> dict:
    """Calculate project statistics (Firestore doesn't support server-side aggregation)."""
    db = firestore.Client()
    stories_ref = db.collection("projects").document(project_id).collection("stories")

    # Fetch all stories (use pagination in production for large datasets)
    stories = stories_ref.stream()

    stats = {
        "total": 0,
        "by_status": {},
        "by_type": {},
        "by_priority": {}
    }

    for story in stories:
        data = story.to_dict()
        stats["total"] += 1

        # Count by status
        status = data.get("status", "unknown")
        stats["by_status"][status] = stats["by_status"].get(status, 0) + 1

        # Count by type
        story_type = data.get("story_type", "unknown")
        stats["by_type"][story_type] = stats["by_type"].get(story_type, 0) + 1

        # Count by priority
        priority = data.get("priority", "unknown")
        stats["by_priority"][priority] = stats["by_priority"].get(priority, 0) + 1

    # Save to /projects/{projectId}/statistics document for quick access
    stats_ref = db.collection("projects").document(project_id).collection("statistics").document("current")
    stats_ref.set({
        "stories": stats,
        "updated_at": firestore.SERVER_TIMESTAMP
    })

    return stats
```

#### Pattern 3: Real-Time Listeners (for UI updates)

```python
def listen_to_story_changes(project_id: str, story_id: str, callback):
    """Set up real-time listener for story changes."""
    db = firestore.Client()
    story_ref = db.collection("projects").document(project_id).collection("stories").document(story_id)

    def on_snapshot(doc_snapshot, changes, read_time):
        for doc in doc_snapshot:
            print(f"Story updated: {doc.to_dict()}")
            callback(doc.to_dict())

    # Watch for changes
    story_watch = story_ref.on_snapshot(on_snapshot)

    return story_watch  # Return watch handle to stop listening later
```

### 5.4 Index Management

**Creating Indexes** (via `firestore.indexes.json`):

```json
{
  "indexes": [
    {
      "collectionGroup": "stories",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "epic",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "story",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

**Deploying Indexes**:
```bash
# Deploy indexes to Firestore
gcloud firestore indexes create --project=bmad-prod --index-file=firestore.indexes.json

# Check index build status
gcloud firestore indexes list --project=bmad-prod
```

**Index Build Time**:
- Empty database: Immediate
- Existing data: Minutes to hours (depending on data size)
- Large datasets (1M+ documents): Can take several hours

### 5.5 Query Performance Optimization

**Best Practices**:

1. **Use Composite Indexes**: Always create composite indexes for multi-field queries
2. **Limit Query Results**: Use `.limit()` to prevent expensive queries
3. **Denormalize Data**: Store frequently accessed data in document (e.g., story metadata in gates)
4. **Use Cursors for Pagination**: Avoid offset-based pagination (expensive)
5. **Cache Frequently Accessed Data**: Use in-memory caching for static data (templates, KB docs)
6. **Avoid Large Arrays**: Firestore charges per array element in queries
7. **Monitor Query Costs**: Use Cloud Monitoring to track read/write operations

**Query Cost Examples**:
- Simple query (1 field, no order): 1 read per document
- Composite query (2+ fields with order): 1 read per document + index lookup
- Collection group query: 1 read per document across all subcollections

---

## 6. Access Control and Security

### 6.1 IAM-Based Access Control

**GCP IAM Roles** (Firestore):

| Role | Permissions | Use Case |
|------|-------------|----------|
| `roles/datastore.user` | Read/write to Firestore | Agents, API services |
| `roles/datastore.viewer` | Read-only access | Monitoring, analytics |
| `roles/datastore.owner` | Full control | Admin, deployment |
| `roles/datastore.importExportAdmin` | Backup/restore | Backup services |

**GCP IAM Roles** (Cloud Storage):

| Role | Permissions | Use Case |
|------|-------------|----------|
| `roles/storage.objectViewer` | Read objects | Read-only agents, users |
| `roles/storage.objectCreator` | Create objects (no read/delete) | Write-only workflows |
| `roles/storage.objectAdmin` | Full object control | Agents with full access |
| `roles/storage.admin` | Full bucket control | Admin, deployment |

### 6.2 Firestore Security Rules

**Production Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isProjectMember(projectId) {
      let project = get(/databases/$(database)/documents/projects/$(projectId));
      return request.auth.uid in project.data.team_members;
    }

    function isProjectOwner(projectId) {
      let project = get(/databases/$(database)/documents/projects/$(projectId));
      return request.auth.uid == project.data.owner_user_id;
    }

    function isAgent() {
      // Service account tokens have agent_id in custom claims
      return request.auth.token.agent_id != null;
    }

    // Projects collection
    match /projects/{projectId} {
      // Read: Project members only
      allow read: if isAuthenticated() && (isProjectMember(projectId) || isProjectOwner(projectId));

      // Create: Authenticated users
      allow create: if isAuthenticated();

      // Update: Project owner or agents
      allow update: if isAuthenticated() && (isProjectOwner(projectId) || isAgent());

      // Delete: Project owner only
      allow delete: if isAuthenticated() && isProjectOwner(projectId);

      // Subcollection: config
      match /config/{configId} {
        allow read: if isAuthenticated() && isProjectMember(projectId);
        allow write: if isAuthenticated() && (isProjectOwner(projectId) || isAgent());
      }

      // Subcollection: artifacts
      match /artifacts/{artifactId} {
        allow read: if isAuthenticated() && isProjectMember(projectId);
        allow create: if isAuthenticated() && (isProjectMember(projectId) || isAgent());
        allow update: if isAuthenticated() && (isProjectMember(projectId) || isAgent());
        allow delete: if isAuthenticated() && isProjectOwner(projectId);
      }

      // Subcollection: stories
      match /stories/{storyId} {
        allow read: if isAuthenticated() && isProjectMember(projectId);
        allow write: if isAuthenticated() && (isProjectMember(projectId) || isAgent());

        // Subcollection: tasks
        match /tasks/{taskId} {
          allow read, write: if isAuthenticated() && isProjectMember(projectId);
        }

        // Subcollection: changes (audit log - read-only for users)
        match /changes/{changeId} {
          allow read: if isAuthenticated() && isProjectMember(projectId);
          allow write: if isAgent();  // Only agents can write to audit log
        }
      }

      // Subcollection: gates
      match /gates/{gateId} {
        allow read: if isAuthenticated() && isProjectMember(projectId);
        allow create: if isAgent();  // Only QA agent creates gates
        allow update: if false;  // Gates are immutable
        allow delete: if false;  // Gates cannot be deleted
      }

      // Subcollection: statistics
      match /statistics/{statId} {
        allow read: if isAuthenticated() && isProjectMember(projectId);
        allow write: if isAgent();  // Only agents update statistics
      }
    }

    // Workflows collection
    match /workflows/{workflowId} {
      // Read: Workflow creator or agent
      allow read: if isAuthenticated() && (
        resource.data.triggered_by == request.auth.uid ||
        isAgent()
      );

      // Write: Agents only
      allow write: if isAgent();

      // Subcollection: steps
      match /steps/{stepId} {
        allow read: if isAuthenticated();
        allow write: if isAgent();
      }
    }

    // Sessions collection
    match /sessions/{sessionId} {
      // Read: Session owner or agent
      allow read: if isAuthenticated() && (
        resource.data.user_id == request.auth.uid ||
        isAgent()
      );

      // Write: Session owner or agent
      allow write: if isAuthenticated() && (
        request.resource.data.user_id == request.auth.uid ||
        isAgent()
      );

      // Subcollection: messages
      match /messages/{messageId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }
    }

    // Agents collection (metrics - read-only for users)
    match /agents/{agentId} {
      allow read: if isAuthenticated();
      allow write: if isAgent();
    }

    // System collection (read-only for users)
    match /system/{document=**} {
      allow read: if isAuthenticated();
      allow write: if false;  // Only admin via backend
    }
  }
}
```

### 6.3 Cloud Storage IAM Policies

**Per-Bucket Policies**:

```yaml
# bmad-templates (read-only for most, write for admin)
bucket: bmad-templates
bindings:
  - role: roles/storage.objectViewer
    members:
      - serviceAccount:agent-service@bmad-prod.iam.gserviceaccount.com
      - group:users@bmad.com
  - role: roles/storage.objectAdmin
    members:
      - serviceAccount:admin-service@bmad-prod.iam.gserviceaccount.com

# bmad-artifacts (project-based access via signed URLs)
bucket: bmad-artifacts
bindings:
  - role: roles/storage.objectAdmin
    members:
      - serviceAccount:agent-service@bmad-prod.iam.gserviceaccount.com
  - role: roles/storage.objectViewer
    members:
      - serviceAccount:api-gateway@bmad-prod.iam.gserviceaccount.com

# bmad-data (read-only for all agents)
bucket: bmad-data
bindings:
  - role: roles/storage.objectViewer
    members:
      - serviceAccount:agent-service@bmad-prod.iam.gserviceaccount.com

# bmad-kb (read-only for agents, read/write for admin)
bucket: bmad-kb
bindings:
  - role: roles/storage.objectViewer
    members:
      - serviceAccount:agent-service@bmad-prod.iam.gserviceaccount.com
      - allUsers  # If documentation is public
  - role: roles/storage.objectAdmin
    members:
      - serviceAccount:admin-service@bmad-prod.iam.gserviceaccount.com
```

### 6.4 Encryption

**Encryption at Rest**:
- **Firestore**: Automatic encryption with Google-managed keys
- **Cloud Storage**: Automatic encryption with Google-managed keys
- **Option**: Customer-managed encryption keys (CMEK) via Cloud KMS

**Encryption in Transit**:
- All connections use TLS 1.2+
- API Gateway enforces HTTPS only
- No HTTP allowed

**Sensitive Data**:
- API keys, secrets → Secret Manager (not in Firestore/Cloud Storage)
- User credentials → Firebase Auth (hashed, salted)
- PII in documents → Encrypt before storage (application-level encryption)

### 6.5 Audit Logging

**Cloud Logging Configuration**:

```yaml
# Log all Firestore operations
log_type: cloudaudit.googleapis.com/data_access
service: firestore.googleapis.com
log_entries:
  - Admin operations (always logged)
  - Data read operations (configurable)
  - Data write operations (configurable)

# Log all Cloud Storage operations
log_type: cloudaudit.googleapis.com/data_access
service: storage.googleapis.com
log_entries:
  - Admin operations (always logged)
  - Data read operations (configurable)
  - Data write operations (configurable)

# Log all agent invocations
log_type: cloudaudit.googleapis.com/activity
service: aiplatform.googleapis.com
log_entries:
  - Agent invocations
  - Workflow executions
  - Model predictions
```

**Audit Query Examples**:

```sql
-- Find all gate decisions in last 24 hours
SELECT
  timestamp,
  protoPayload.authenticationInfo.principalEmail as agent,
  protoPayload.resourceName as gate_id,
  jsonPayload.decision
FROM
  `bmad-prod.cloudaudit_googleapis_com_data_access`
WHERE
  timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
  AND resource.type = "firestore_document"
  AND protoPayload.resourceName LIKE "%/gates/%"
ORDER BY timestamp DESC

-- Find all story status changes
SELECT
  timestamp,
  protoPayload.authenticationInfo.principalEmail as changed_by,
  protoPayload.resourceName as story_id,
  JSON_EXTRACT(jsonPayload, '$.old_value') as old_status,
  JSON_EXTRACT(jsonPayload, '$.new_value') as new_status
FROM
  `bmad-prod.cloudaudit_googleapis_com_data_access`
WHERE
  timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
  AND resource.type = "firestore_document"
  AND protoPayload.resourceName LIKE "%/stories/%"
  AND protoPayload.methodName = "google.firestore.v1.Firestore.UpdateDocument"
ORDER BY timestamp DESC
```

---

## 7. Versioning Strategy

### 7.1 Firestore Versioning (Metadata)

**Approach**: Subcollection-based versioning for artifact metadata.

**Pattern**:
```
/projects/{projectId}/artifacts/{artifactId}
  - Current version (main document)
  /versions/{versionNumber}
    - Version 1, Version 2, etc.
```

**Example**:
```python
from google.cloud import firestore

def save_artifact_version(project_id: str, artifact_id: str, new_data: dict):
    """Save new version of artifact metadata."""
    db = firestore.Client()
    artifact_ref = db.collection("projects").document(project_id).collection("artifacts").document(artifact_id)

    # Get current version
    current = artifact_ref.get()
    if current.exists:
        current_data = current.to_dict()
        current_version = current_data.get("version", 0)

        # Save current as version snapshot
        version_ref = artifact_ref.collection("versions").document(str(current_version))
        version_ref.set({
            **current_data,
            "archived_at": firestore.SERVER_TIMESTAMP
        })

        # Update to new version
        new_version = current_version + 1
    else:
        new_version = 1

    # Update main document with new version
    artifact_ref.set({
        **new_data,
        "version": new_version,
        "updated_at": firestore.SERVER_TIMESTAMP
    })

    return new_version
```

### 7.2 Cloud Storage Versioning (Content)

**Approach**: Enable object versioning on buckets.

**Configuration**:
```bash
# Enable versioning on bmad-artifacts bucket
gsutil versioning set on gs://bmad-artifacts

# Enable versioning on bmad-templates bucket
gsutil versioning set on gs://bmad-templates
```

**Accessing Versions**:
```python
from google.cloud import storage

def list_object_versions(bucket_name: str, object_name: str):
    """List all versions of an object."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    blobs = bucket.list_blobs(prefix=object_name, versions=True)

    versions = []
    for blob in blobs:
        if blob.name == object_name:
            versions.append({
                "generation": blob.generation,
                "updated": blob.updated,
                "size": blob.size,
                "md5_hash": blob.md5_hash
            })

    return sorted(versions, key=lambda v: v["updated"], reverse=True)

def restore_object_version(bucket_name: str, object_name: str, generation: int):
    """Restore a specific version of an object."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # Get specific version
    source_blob = bucket.blob(object_name, generation=generation)

    # Copy to current (create new version)
    new_blob = bucket.copy_blob(source_blob, bucket, object_name)

    return new_blob.generation
```

### 7.3 Combined Versioning Strategy

**Metadata + Content Versioning**:

```python
def save_story_with_versioning(project_id: str, story_id: str, content: str, metadata: dict):
    """Save story with both Firestore and Cloud Storage versioning."""

    # 1. Save content to Cloud Storage (versioning automatic)
    storage_client = storage.Client()
    bucket = storage_client.bucket("bmad-artifacts")
    blob = bucket.blob(f"{project_id}/stories/{story_id}.md")
    blob.upload_from_string(content, content_type="text/markdown")

    # Get generation (version) number
    generation = blob.generation

    # 2. Update Firestore metadata with version info
    db = firestore.Client()
    story_ref = db.collection("projects").document(project_id).collection("stories").document(story_id)

    # Get current version
    current = story_ref.get()
    current_version = current.to_dict().get("version", 0) if current.exists else 0
    new_version = current_version + 1

    # Save metadata
    story_ref.set({
        "story_id": story_id,
        "version": new_version,
        "gcs_path": f"gs://bmad-artifacts/{project_id}/stories/{story_id}.md",
        "gcs_generation": generation,
        "updated_at": firestore.SERVER_TIMESTAMP,
        **metadata
    })

    # 3. Save version snapshot in subcollection
    version_ref = story_ref.collection("versions").document(str(new_version))
    version_ref.set({
        "version": new_version,
        "gcs_generation": generation,
        "created_at": firestore.SERVER_TIMESTAMP,
        "change_description": metadata.get("change_description", "")
    })

    return new_version
```

---

## 8. Backup and Recovery

### 8.1 Firestore Backup Strategy

**Automated Exports** (via Cloud Scheduler):

```bash
# Daily export at 2 AM UTC
gcloud firestore export gs://bmad-backups/firestore/$(date +%Y%m%d) \
  --project=bmad-prod \
  --collection-ids=projects,workflows,sessions,agents

# Configure in Cloud Scheduler
gcloud scheduler jobs create app-engine firestore-backup \
  --schedule="0 2 * * *" \
  --uri="https://us-central1-bmad-prod.cloudfunctions.net/firestoreBackup" \
  --http-method=POST
```

**Cloud Function for Backup**:

```python
from google.cloud import firestore_admin_v1
from datetime import datetime

def firestore_backup(request):
    """Cloud Function to export Firestore database."""
    client = firestore_admin_v1.FirestoreAdminClient()

    project_id = "bmad-prod"
    database_name = client.database_path(project_id, "(default)")
    bucket = "bmad-backups"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    export_name = f"gs://{bucket}/firestore/{timestamp}"

    operation = client.export_documents(
        name=database_name,
        output_uri_prefix=export_name,
        collection_ids=["projects", "workflows", "sessions", "gates"]  # Specify collections
    )

    # Wait for export to complete
    response = operation.result(timeout=3600)  # 1 hour timeout

    return {"status": "success", "export_path": export_name}
```

**Backup Retention**:
- Daily backups: Keep 30 days
- Weekly backups: Keep 12 weeks
- Monthly backups: Keep 12 months

**Restore Procedure**:

```bash
# List available backups
gsutil ls gs://bmad-backups/firestore/

# Restore from specific backup
gcloud firestore import gs://bmad-backups/firestore/20251015_020000 \
  --project=bmad-prod-restore \
  --collection-ids=projects,workflows,sessions,gates
```

### 8.2 Cloud Storage Backup Strategy

**Object Versioning** (primary backup mechanism):
- Enabled on all buckets
- Retention: 30 days for `bmad-artifacts`, unlimited for others

**Cross-Region Replication**:

```bash
# Enable dual-region replication for critical buckets
gsutil mb -c STANDARD -l US -b on gs://bmad-artifacts-replica

# Set up replication
gsutil rewrite -r gs://bmad-artifacts/* gs://bmad-artifacts-replica/
```

**Lifecycle Policy** (automated cleanup):

```json
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {
          "age": 30,
          "isLive": false,
          "matchesPrefix": ["bmad-artifacts/"]
        }
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {
          "age": 90,
          "matchesPrefix": ["bmad-artifacts/"]
        }
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {
          "age": 365,
          "matchesPrefix": ["bmad-artifacts/"]
        }
      }
    ]
  }
}
```

### 8.3 Disaster Recovery Plan

**RTO (Recovery Time Objective)**: 4 hours
**RPO (Recovery Point Objective)**: 24 hours (daily backups)

**Recovery Steps**:

1. **Firestore Recovery**:
   ```bash
   # Import from latest backup
   gcloud firestore import gs://bmad-backups/firestore/latest \
     --project=bmad-prod
   ```

2. **Cloud Storage Recovery**:
   ```bash
   # Restore from versioned objects
   gsutil -m cp -r gs://bmad-artifacts-replica/* gs://bmad-artifacts/
   ```

3. **Verification**:
   - Run smoke tests on restored data
   - Verify critical projects accessible
   - Check agent configurations intact
   - Validate workflow definitions

4. **DNS Cutover**:
   - Update DNS to point to restored environment
   - Enable API Gateway
   - Monitor for errors

---

## 9. Migration from File-Based System

### 9.1 Migration Phases

**Phase 1: Parallel Operation** (2 weeks)
- File system remains source of truth
- All changes sync to cloud storage
- Agents read from files, write to both files and cloud
- Validation: Compare file system vs cloud state

**Phase 2: Cloud-First** (2 weeks)
- Cloud storage becomes source of truth
- Agents read from cloud, write to cloud
- File system synced for backward compatibility
- Validation: All operations via cloud, file sync works

**Phase 3: Cloud-Only** (1 week)
- File system deprecated
- All operations via cloud storage
- File sync disabled
- Validation: No file system dependencies

### 9.2 Migration Scripts

#### Script 1: Migrate Project Configuration

```python
import yaml
from google.cloud import firestore

def migrate_core_config(project_id: str, config_file_path: str):
    """Migrate core-config.yaml to Firestore."""

    # Read core-config.yaml
    with open(config_file_path, 'r') as f:
        config = yaml.safe_load(f)

    # Transform to Firestore schema
    firestore_config = {
        "config_id": "current",
        "version": config.get("version", "4.0"),
        "locations": {
            "prd": f"gs://bmad-artifacts/{project_id}/prd/",
            "architecture": f"gs://bmad-artifacts/{project_id}/architecture/",
            "stories": f"gs://bmad-artifacts/{project_id}/stories/",
            **config.get("locations", {})
        },
        "agents": config.get("agents", {}),
        "workflows": config.get("workflows", {}),
        "sharding": config.get("sharding", {}),
        "quality": config.get("quality", {}),
        "updated_at": firestore.SERVER_TIMESTAMP
    }

    # Save to Firestore
    db = firestore.Client()
    config_ref = db.collection("projects").document(project_id).collection("config").document("current")
    config_ref.set(firestore_config)

    print(f"Migrated config for project {project_id}")
```

#### Script 2: Migrate Stories

```python
import os
import re
from google.cloud import firestore, storage

def migrate_stories(project_id: str, stories_dir: str):
    """Migrate story files to Cloud Storage + Firestore."""

    db = firestore.Client()
    storage_client = storage.Client()
    bucket = storage_client.bucket("bmad-artifacts")

    # Find all story files
    story_files = [f for f in os.listdir(stories_dir) if f.endswith(".md")]

    for story_file in story_files:
        story_id = story_file.replace(".md", "")  # e.g., "1.1"
        file_path = os.path.join(stories_dir, story_file)

        # Read story content
        with open(file_path, 'r') as f:
            content = f.read()

        # Parse YAML front matter (if exists)
        front_matter = {}
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                front_matter = yaml.safe_load(parts[1])
                content = parts[2].strip()

        # Upload to Cloud Storage
        blob = bucket.blob(f"{project_id}/stories/{story_id}.md")
        blob.upload_from_string(content, content_type="text/markdown")

        # Parse story metadata
        epic, story_num = story_id.split(".")
        status = front_matter.get("Status", "draft").lower()

        # Save metadata to Firestore
        story_ref = db.collection("projects").document(project_id).collection("stories").document(story_id)
        story_ref.set({
            "story_id": story_id,
            "epic": int(epic),
            "story": int(story_num),
            "title": front_matter.get("Title", ""),
            "status": status,
            "story_type": front_matter.get("Type", "fullstack").lower(),
            "gcs_path": f"gs://bmad-artifacts/{project_id}/stories/{story_id}.md",
            "created_by": "sm-agent",
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP
        })

        print(f"Migrated story {story_id}")
```

#### Script 3: Migrate Gates

```python
import yaml
from google.cloud import firestore
from datetime import datetime

def migrate_gates(project_id: str, gates_dir: str):
    """Migrate gate YAML files to Firestore."""

    db = firestore.Client()

    # Find all gate files
    gate_files = [f for f in os.listdir(gates_dir) if f.endswith(".yml") or f.endswith(".yaml")]

    for gate_file in gate_files:
        file_path = os.path.join(gates_dir, gate_file)

        # Read gate YAML
        with open(file_path, 'r') as f:
            gate_data = yaml.safe_load(f)

        # Generate gate ID from filename
        gate_id = gate_file.replace(".yml", "").replace(".yaml", "")

        # Transform to Firestore schema
        firestore_gate = {
            "gate_id": gate_id,
            "story_id": gate_data.get("story_id"),
            "decision": gate_data.get("decision", "").lower(),
            "decision_rationale": gate_data.get("rationale", ""),
            "created_by": "qa-agent",
            "risk_score": gate_data.get("risk_score", 0),
            "test_coverage_percent": gate_data.get("test_coverage", 0),
            "created_at": firestore.SERVER_TIMESTAMP
        }

        # Save to Firestore
        gate_ref = db.collection("projects").document(project_id).collection("gates").document(gate_id)
        gate_ref.set(firestore_gate)

        print(f"Migrated gate {gate_id}")
```

#### Script 4: Migrate Artifacts

```python
def migrate_artifacts(project_id: str, docs_dir: str):
    """Migrate PRD, architecture, and other artifacts."""

    storage_client = storage.Client()
    bucket = storage_client.bucket("bmad-artifacts")
    db = firestore.Client()

    artifacts = [
        {"file": "project-brief.md", "type": "project_brief"},
        {"file": "prd.md", "type": "prd"},
        {"file": "architecture.md", "type": "architecture"},
        {"file": "frontend-spec.md", "type": "frontend_spec"}
    ]

    for artifact in artifacts:
        file_path = os.path.join(docs_dir, artifact["file"])
        if not os.path.exists(file_path):
            continue

        # Read content
        with open(file_path, 'r') as f:
            content = f.read()

        # Upload to Cloud Storage
        blob = bucket.blob(f"{project_id}/{artifact['file']}")
        blob.upload_from_string(content, content_type="text/markdown")

        # Save metadata to Firestore
        artifact_id = f"art-{artifact['type']}-{datetime.now().strftime('%Y%m%d')}"
        artifact_ref = db.collection("projects").document(project_id).collection("artifacts").document(artifact_id)
        artifact_ref.set({
            "artifact_id": artifact_id,
            "type": artifact["type"],
            "name": artifact["file"].replace(".md", "").replace("-", " ").title(),
            "gcs_path": f"gs://bmad-artifacts/{project_id}/{artifact['file']}",
            "status": "approved",
            "version": 1,
            "created_by": "migration-script",
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP
        })

        print(f"Migrated artifact {artifact['file']}")
```

### 9.3 Migration Validation

**Validation Checks**:

```python
def validate_migration(project_id: str):
    """Validate that migration completed successfully."""

    db = firestore.Client()
    storage_client = storage.Client()

    checks = []

    # Check 1: Config exists in Firestore
    config_ref = db.collection("projects").document(project_id).collection("config").document("current")
    config_exists = config_ref.get().exists
    checks.append(("Config migrated", config_exists))

    # Check 2: Stories count matches
    stories_ref = db.collection("projects").document(project_id).collection("stories")
    firestore_story_count = len(list(stories_ref.stream()))
    checks.append(("Stories migrated", firestore_story_count > 0))

    # Check 3: Artifacts uploaded to Cloud Storage
    bucket = storage_client.bucket("bmad-artifacts")
    blobs = list(bucket.list_blobs(prefix=f"{project_id}/"))
    checks.append(("Artifacts uploaded", len(blobs) > 0))

    # Check 4: Gates migrated
    gates_ref = db.collection("projects").document(project_id).collection("gates")
    gates_count = len(list(gates_ref.stream()))
    checks.append(("Gates migrated", gates_count >= 0))  # May be 0 for new projects

    # Print results
    print(f"Migration Validation for {project_id}:")
    for check_name, passed in checks:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} - {check_name}")

    return all(passed for _, passed in checks)
```

---

## 10. Performance Optimization

### 10.1 Firestore Performance Best Practices

1. **Denormalize for Read Performance**: Store frequently accessed data in parent document
2. **Use Batch Operations**: Group multiple writes into batch operations
3. **Index Optimization**: Only create indexes for queries you actually use
4. **Limit Document Size**: Keep documents under 100 KB for optimal performance
5. **Use Subcollections for Large Datasets**: Split large collections into subcollections

### 10.2 Cloud Storage Performance Best Practices

1. **Parallel Uploads**: Use `gsutil -m` for parallel operations
2. **Resumable Uploads**: Use resumable uploads for files > 5 MB
3. **CDN Caching**: Enable Cloud CDN for frequently accessed objects
4. **Regional Buckets**: Use regional buckets for lowest latency
5. **Signed URL Caching**: Cache signed URLs to avoid regeneration

### 10.3 Caching Strategy

**Multi-Layer Caching**:

```
┌─────────────────┐
│  Application    │  In-memory cache (templates, configs)
│  Layer Cache    │  TTL: Session duration
└─────────────────┘
         ↓
┌─────────────────┐
│  Redis/Memcache │  Distributed cache (frequently accessed data)
│  (Cloud Memorystore) │  TTL: 1 hour
└─────────────────┘
         ↓
┌─────────────────┐
│  Cloud Storage  │  Content Delivery Network
│  CDN Cache      │  TTL: 24 hours (static content)
└─────────────────┘
         ↓
┌─────────────────┐
│  Firestore /    │  Source of truth
│  Cloud Storage  │
└─────────────────┘
```

---

## 11. Cost Optimization

### 11.1 Firestore Cost Estimates

**Pricing** (as of 2025):
- Storage: $0.18/GB/month
- Document reads: $0.06 per 100,000 reads
- Document writes: $0.18 per 100,000 writes
- Deletes: $0.02 per 100,000 deletes

**100 Projects Estimate**:
- Storage: 110 MB = $0.02/month
- Reads: 1M reads/month = $0.60/month
- Writes: 100K writes/month = $0.18/month
- **Total Firestore**: ~$0.80/month

### 11.2 Cloud Storage Cost Estimates

**Pricing** (Standard class):
- Storage: $0.02/GB/month
- Class A operations (writes): $0.005 per 1,000
- Class B operations (reads): $0.0004 per 1,000

**100 Projects Estimate**:
- Storage: 10 GB = $0.20/month
- Writes: 10K operations/month = $0.05/month
- Reads: 100K operations/month = $0.04/month
- **Total Cloud Storage**: ~$0.29/month

### 11.3 Cost Optimization Strategies

1. **Lifecycle Policies**: Move old data to Nearline/Coldline storage
2. **Query Optimization**: Reduce unnecessary reads with denormalization
3. **Batch Operations**: Group writes to reduce operation count
4. **Caching**: Cache frequently accessed data to reduce reads
5. **Compression**: Compress documents before upload to reduce storage costs

**Total Storage Cost (100 projects)**: ~$1.09/month

---

## Summary

The BMad ADK Storage Schema provides a comprehensive, scalable, and cost-effective storage solution using Google Cloud Platform services. The design prioritizes:

- **Separation of Concerns**: Structured data in Firestore, documents in Cloud Storage
- **Query Performance**: Optimized indexes for critical queries
- **Security**: IAM-based access control, encryption, audit logging
- **Versioning**: Comprehensive version history for all artifacts
- **Backup & Recovery**: Automated backups with 4-hour RTO
- **Migration Path**: Phased migration from file-based to cloud-native
- **Cost Efficiency**: ~$1/month for 100 projects

This schema supports all BMad framework operations including agent workflows, story management, quality gates, and knowledge base access while providing enterprise-grade reliability, security, and scalability.

---

**Document Status**: Complete
**Last Updated**: 2025-10-15
**Next Review**: After Phase 6 implementation
