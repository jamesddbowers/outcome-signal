# BMad Framework - Migration Strategy from File-Based to Google ADK

**Document Version**: 1.0
**Created**: 2025-10-15
**Status**: Complete
**Phase**: Phase 6 - Task 6.7
**Related Documents**:
- [Architecture Design](architecture-design.md)
- [Storage Schema](storage-schema.md)
- [Deployment Guide](deployment-guide.md)
- [API Specifications](api-specifications.md)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Migration Overview](#2-migration-overview)
3. [Pre-Migration Assessment](#3-pre-migration-assessment)
4. [Migration Phases](#4-migration-phases)
5. [Data Migration Strategy](#5-data-migration-strategy)
6. [Agent Migration](#6-agent-migration)
7. [Workflow Migration](#7-workflow-migration)
8. [User Migration and Training](#8-user-migration-and-training)
9. [Rollback Procedures](#9-rollback-procedures)
10. [Success Criteria and Validation](#10-success-criteria-and-validation)
11. [Risk Management](#11-risk-management)
12. [Timeline and Resources](#12-timeline-and-resources)

---

## 1. Executive Summary

### 1.1 Migration Purpose

This document outlines the comprehensive strategy for migrating the BMad (Business Methodology for Agile Development) framework from its current **file-based, IDE-integrated architecture** to a **cloud-native, API-driven platform** built on **Google's Agent Development Kit (google-adk)** and Google Cloud Platform services.

**What is Google ADK?** Google's Agent Development Kit (google-adk) is Google's official open-source framework for building and deploying AI agents (`pip install google-adk`). See [architecture-design.md](architecture-design.md#231-understanding-googles-agent-development-kit-google-adk) for detailed explanation.

### 1.2 Migration Approach

**Strategy**: **Phased, low-risk migration** with parallel operation, incremental cutover, and comprehensive rollback capability.

**Core Principles**:
1. **Zero Downtime**: Current file-based system remains operational throughout migration
2. **Incremental Adoption**: Users transition gradually, project-by-project or team-by-team
3. **Data Integrity**: No data loss, complete audit trail, validated migration
4. **Reversibility**: Full rollback capability at each phase
5. **Risk Mitigation**: Comprehensive testing, staged rollout, continuous validation

### 1.3 Migration Timeline

**Total Duration**: **10-14 weeks** (2.5 to 3.5 months)

| Phase | Duration | Description | Key Milestones |
|-------|----------|-------------|----------------|
| **Phase 0: Pre-Migration** | 1-2 weeks | Assessment, planning, infrastructure preparation | Infrastructure ready, team trained |
| **Phase 1: Parallel Infrastructure** | 2 weeks | Deploy cloud infrastructure, sync tooling | Cloud platform operational, bidirectional sync working |
| **Phase 2: Shadow Mode** | 2-3 weeks | Cloud mirrors file operations, no user impact | Cloud validated against files, metrics collected |
| **Phase 3: Pilot Program** | 2-3 weeks | Selected projects/teams use cloud-first | Pilot successful, feedback incorporated |
| **Phase 4: Gradual Rollout** | 2-3 weeks | Phased migration of all projects | 80%+ projects migrated, performance validated |
| **Phase 5: Cloud-Primary** | 1 week | Cloud is primary, files as backup | All active projects on cloud, files deprecated |
| **Phase 6: Decommissioning** | 1-2 weeks | Archive file-based system, cleanup | File system archived, cloud is sole source of truth |

### 1.4 Migration Phases Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MIGRATION PHASES                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Phase 0: Pre-Migration Assessment (1-2 weeks)
┌────────────────────────────────────────────────────────────────┐
│ • Infrastructure Assessment                                     │
│ • Data Inventory                                                │
│ • Team Training                                                 │
│ • Risk Analysis                                                 │
└────────────────────────────────────────────────────────────────┘
                          ↓
Phase 1: Parallel Infrastructure (2 weeks)
┌────────────────────────────────────────────────────────────────┐
│ • Deploy GCP Infrastructure                                     │
│ • Setup Bidirectional Sync                                      │
│ • Validate Data Parity                                          │
│ File System (Primary) ←→ Cloud (Secondary)                      │
└────────────────────────────────────────────────────────────────┘
                          ↓
Phase 2: Shadow Mode (2-3 weeks)
┌────────────────────────────────────────────────────────────────┐
│ • Cloud Mirrors All Operations                                  │
│ • Automated Consistency Checks                                  │
│ • Performance Benchmarking                                      │
│ File System (Primary) → Cloud (Shadow, Validation Only)         │
└────────────────────────────────────────────────────────────────┘
                          ↓
Phase 3: Pilot Program (2-3 weeks)
┌────────────────────────────────────────────────────────────────┐
│ • Select 2-3 Pilot Projects                                     │
│ • Cloud-First Operation                                         │
│ • Collect Feedback, Monitor Issues                              │
│ Pilot Projects: Cloud (Primary) → File System (Backup)          │
│ Other Projects: File System (Primary)                           │
└────────────────────────────────────────────────────────────────┘
                          ↓
Phase 4: Gradual Rollout (2-3 weeks)
┌────────────────────────────────────────────────────────────────┐
│ • Project-by-Project Migration                                  │
│ • Team-by-Team Onboarding                                       │
│ • Continuous Monitoring                                         │
│ Week 1: 25% projects migrated                                   │
│ Week 2: 50% projects migrated                                   │
│ Week 3: 80%+ projects migrated                                  │
└────────────────────────────────────────────────────────────────┘
                          ↓
Phase 5: Cloud-Primary (1 week)
┌────────────────────────────────────────────────────────────────┐
│ • All Active Projects on Cloud                                  │
│ • File System in Read-Only Mode                                 │
│ • Performance Optimization                                      │
│ Cloud (Primary) → File System (Archive Only)                    │
└────────────────────────────────────────────────────────────────┘
                          ↓
Phase 6: Decommissioning (1-2 weeks)
┌────────────────────────────────────────────────────────────────┐
│ • Archive File-Based System                                     │
│ • Update Documentation                                          │
│ • Final Cleanup                                                 │
│ Cloud (Sole Source of Truth)                                    │
│ File System (Archived, Historical Reference Only)               │
└────────────────────────────────────────────────────────────────┘
```

### 1.5 Key Success Metrics

**Migration Success Criteria**:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Data Integrity** | 100% accuracy | Automated validation scripts, zero data loss |
| **User Adoption** | 90%+ users on cloud | User telemetry, login metrics |
| **Project Migration** | 95%+ projects migrated | Project count in Firestore vs file system |
| **Performance** | ≤ 10% latency increase | P50/P95/P99 response times |
| **Availability** | 99.9% uptime | Cloud monitoring SLA |
| **Cost** | Within 20% of projections | Monthly GCP billing analysis |
| **User Satisfaction** | 80%+ positive feedback | User surveys, support ticket volume |
| **Rollback Rate** | < 5% of projects | Rollback requests vs total migrations |

### 1.6 Risk Summary

**Top Migration Risks and Mitigations**:

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Data Loss During Migration** | Low | Critical | Bidirectional sync, automated validation, backups |
| **Performance Degradation** | Medium | High | Shadow mode testing, performance benchmarking, optimization |
| **User Resistance** | Medium | Medium | Training, pilot program, incremental adoption |
| **Cost Overruns** | Low | Medium | Budget monitoring, cost alerts, optimization tuning |
| **Integration Failures** | Low | High | Comprehensive testing, staged rollout, rollback plans |
| **Cloud Service Outages** | Low | High | Multi-region deployment, file system fallback |

### 1.7 Required Resources

**Team Composition**:
- **Migration Lead**: 1 FTE (full 10-14 weeks)
- **Cloud Architects**: 1-2 FTE (weeks 1-6, then 0.5 FTE)
- **DevOps Engineers**: 2 FTE (weeks 1-8, then 0.5 FTE)
- **Application Developers**: 1-2 FTE (for integration fixes, weeks 3-10)
- **QA/Testing**: 1 FTE (weeks 2-10)
- **Training/Support**: 1 FTE (weeks 4-14)
- **Product Manager**: 0.5 FTE (stakeholder communication, full duration)

**Budget**:
- **GCP Infrastructure**: $500-$1,000 (one-time setup)
- **GCP Monthly Costs**: $200-$500 during migration (testing, staging)
- **Tooling/Software**: $500-$1,000 (migration scripts, monitoring)
- **Training Materials**: $1,000-$2,000 (documentation, videos, workshops)
- **Contingency**: 20% ($1,000-$2,000)
- **Total Estimated Cost**: $5,000-$10,000

---

## 2. Migration Overview

### 2.1 Current State: File-Based BMad Architecture

**System Characteristics**:

```
Current BMad Architecture (File-Based)
┌────────────────────────────────────────────────────────────┐
│                      IDE Integration                        │
│   (Claude Code, Cursor, Windsurf, etc.)                    │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│                   Agent Activation                          │
│   YAML-in-Markdown agent definitions                        │
│   Loaded on-demand from .bmad-core/                        │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│               File-Based State Management                   │
│                                                              │
│  docs/                                                       │
│  ├── project-brief.md                                       │
│  ├── prd/                                                   │
│  │   ├── 1-overview.md                                     │
│  │   ├── 2-user-stories.md                                 │
│  │   └── ...                                               │
│  ├── architecture/                                          │
│  ├── stories/                                               │
│  │   ├── 1.1-user-auth.md                                  │
│  │   └── ...                                               │
│  └── qa-gates/                                             │
│      ├── 1.1-gate-pass.md                                  │
│      └── ...                                               │
│                                                              │
│  core-config.yaml (project configuration)                   │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│                    Git Version Control                      │
│   All changes tracked via git commits                       │
│   History preserved in git log                              │
└────────────────────────────────────────────────────────────┘
```

**Key Characteristics**:
- **Agent Storage**: YAML-in-markdown files in `.bmad-core/agents/`
- **Task Storage**: Markdown files in `.bmad-core/tasks/`
- **Template Storage**: YAML files in `.bmad-core/templates/`
- **Project Config**: `core-config.yaml` per project
- **Artifacts**: Markdown files in `docs/` directory
- **State Management**: File existence, file content, YAML frontmatter
- **Version Control**: Git-based (commits, branches, history)
- **Collaboration**: File-based handoffs, git push/pull
- **IDE Integration**: Native file operations, no API layer

**Strengths**:
- ✅ Simple, transparent (files are human-readable)
- ✅ Git-native version control and audit trail
- ✅ IDE-integrated (works with any text editor)
- ✅ Offline-capable
- ✅ No cloud dependencies or costs

**Limitations**:
- ❌ Not scalable across teams/projects
- ❌ No concurrent multi-agent collaboration
- ❌ Limited querying (grep/find only)
- ❌ No API access for integrations
- ❌ Manual conflict resolution required
- ❌ Performance degrades with large projects

### 2.2 Target State: Cloud-Native Google ADK Architecture

**System Characteristics**:

```
Target BMad Architecture (Google ADK + GCP)
┌────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│   Web UI / IDE Plugins / REST API Clients / CLI            │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                         │
│   Cloud Run + Load Balancer                                 │
│   • Authentication (OAuth 2.0, API keys)                    │
│   • Authorization (RBAC, IAM)                               │
│   • Rate Limiting                                           │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│                   EXECUTION LAYER                           │
│   ┌─────────────────┐  ┌─────────────────┐                │
│   │  Vertex AI      │  │  Reasoning      │                │
│   │  Agent Builder  │  │  Engine         │                │
│   │  (10 Agents)    │  │  (8 Workflows)  │                │
│   └─────────────────┘  └─────────────────┘                │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│                   STORAGE LAYER                             │
│   ┌─────────────────┐  ┌─────────────────┐                │
│   │  Firestore      │  │  Cloud Storage  │                │
│   │  (Metadata &    │  │  (Artifacts &   │                │
│   │   State)        │  │   Templates)    │                │
│   └─────────────────┘  └─────────────────┘                │
│   ┌─────────────────┐                                      │
│   │  Vertex AI      │                                      │
│   │  Search         │                                      │
│   │  (KB Mode/RAG)  │                                      │
│   └─────────────────┘                                      │
└────────────────────────────────────────────────────────────┘
```

**Key Characteristics**:
- **Agent Storage**: Vertex AI Agent Builder configurations
- **Task Storage**: Cloud Functions (simple) + Reasoning Engine (complex)
- **Template Storage**: Cloud Storage bucket (`bmad-templates`)
- **Project Config**: Firestore document (`/projects/{projectId}/config`)
- **Artifacts**: Firestore (metadata) + Cloud Storage (content)
- **State Management**: Firestore collections (queryable, transactional)
- **Version Control**: Firestore versioning + Cloud Storage object versioning
- **Collaboration**: Event-driven, real-time, multi-agent coordination
- **API Integration**: RESTful API, webhooks, programmatic access

**Benefits**:
- ✅ Scalable (concurrent projects, teams)
- ✅ Collaborative (real-time multi-agent)
- ✅ Queryable (SQL-like queries on Firestore)
- ✅ API-driven (integrate with CI/CD, ticketing)
- ✅ Managed infrastructure (no ops burden)
- ✅ Advanced features (RAG, semantic search)
- ✅ Enterprise-ready (monitoring, logging, SLA)

**Trade-offs**:
- ⚠️ Cloud dependency (requires internet)
- ⚠️ Monthly costs ($500-$1,200/month at scale)
- ⚠️ Learning curve (new tools, APIs)
- ⚠️ Migration effort (10-14 weeks)

### 2.3 Transformation Mapping

**Component-by-Component Migration**:

| Current (File-Based) | Target (Google ADK) | Migration Strategy |
|---------------------|-------------------|-------------------|
| **`.bmad-core/agents/*.md`** | Vertex AI Agent Builder configs | Convert YAML-in-markdown → Agent API format |
| **`.bmad-core/tasks/*.md`** | Reasoning Engine workflows | Rewrite task logic in Python using google-adk |
| **`.bmad-core/templates/*.yaml`** | Cloud Storage `bmad-templates/` | Direct upload with validation |
| **`core-config.yaml`** | Firestore `/projects/{id}/config` | Parse and upload with schema validation |
| **`docs/project-brief.md`** | Firestore + Cloud Storage | Metadata → Firestore, content → GCS |
| **`docs/prd/*.md`** | Firestore + Cloud Storage | Sharded PRD → indexed in Firestore |
| **`docs/architecture/*.md`** | Firestore + Cloud Storage | Sharded architecture → indexed |
| **`docs/stories/*.md`** | Firestore + Cloud Storage | Story metadata → Firestore, content → GCS |
| **`docs/qa-gates/*.md`** | Firestore `/gates/{gateId}` | Parse gate decision, store in Firestore |
| **Git history** | Firestore versions + Cloud Logging | Audit trail preserved in versioning |
| **IDE operations** | REST API calls | IDE plugin calls API endpoints |

### 2.4 Migration Constraints

**Technical Constraints**:
- Must maintain data integrity (zero data loss acceptable)
- Must preserve all git history and audit trail
- Must support both systems during transition (parallel operation)
- Must handle ongoing development (no freeze required)
- Must be reversible at each phase (rollback capability)

**Business Constraints**:
- Minimize user disruption (no downtime tolerated)
- Complete within 10-14 weeks (Q1 2026 target)
- Stay within budget ($5,000-$10,000)
- Maintain productivity (no significant slowdown)
- Ensure team buy-in (training and support critical)

**Operational Constraints**:
- Limited engineering resources (2-3 FTE for core team)
- Ongoing development continues (no code freeze)
- Must support existing IDE workflows during transition
- Cannot break existing integrations (CI/CD, etc.)

---

## 3. Pre-Migration Assessment

### 3.1 Infrastructure Assessment

**Objective**: Evaluate current infrastructure and identify migration requirements.

#### 3.1.1 Current Infrastructure Inventory

**Data Collection**:
```bash
# Count projects using BMad
find . -name "core-config.yaml" | wc -l

# Measure total artifact size
du -sh docs/

# Count agent definitions
find .bmad-core/agents -name "*.md" | wc -l

# Count task workflows
find .bmad-core/tasks -name "*.md" | wc -l

# Count templates
find .bmad-core/templates -name "*.yaml" | wc -l

# Count stories across all projects
find . -path "*/docs/stories/*.md" | wc -l

# Count QA gates
find . -path "*/docs/qa-gates/*.md" | wc -l
```

**Expected Output**:
```
Projects: 10-50 (varies by organization)
Total artifact size: 50-500 MB
Agents: 10
Tasks: 23
Templates: 13
Stories: 100-1000 (depends on project maturity)
QA Gates: 50-500
```

#### 3.1.2 Data Quality Assessment

**Quality Checks**:
```bash
# Validate all core-config.yaml files
for config in $(find . -name "core-config.yaml"); do
  echo "Validating $config"
  python3 scripts/validate-config.py "$config"
done

# Check for orphaned artifacts (no project association)
python3 scripts/check-orphaned-artifacts.py

# Validate story frontmatter
python3 scripts/validate-story-frontmatter.py

# Check for duplicate story IDs
python3 scripts/check-duplicate-stories.py

# Validate QA gate format
python3 scripts/validate-gates.py
```

**Quality Metrics**:
- **Config Validity**: 100% of `core-config.yaml` files must be valid YAML
- **Story Completeness**: 95%+ stories have required frontmatter fields
- **Gate Consistency**: 100% of gates have decision (PASS/FAIL/CONCERNS/WAIVED)
- **No Orphans**: Zero orphaned artifacts without project association

#### 3.1.3 Dependency Assessment

**External Dependencies**:
```bash
# Check IDE integration usage
git log --all --grep="bmad-agent" --oneline | wc -l

# Check CI/CD integration
find . -name ".github/workflows/*.yml" -o -name ".gitlab-ci.yml" | \
  xargs grep -l "bmad" | wc -l

# Check custom scripts/tools
find . -name "*.sh" -o -name "*.py" | xargs grep -l "bmad" | wc -l
```

**Integration Points to Migrate**:
- IDE plugins (VSCode extensions, Cursor integrations)
- CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins)
- Custom scripts (deployment, reporting, analytics)
- Third-party tools (Jira sync, Slack notifications)

### 3.2 User Readiness Assessment

#### 3.2.1 User Personas

**Identify User Groups**:

| Persona | Count | Current Usage | Migration Priority | Training Needs |
|---------|-------|---------------|-------------------|----------------|
| **Product Managers** | 5-10 | Heavy (PRD creation, story validation) | High | Web UI, API basics |
| **Architects** | 3-5 | Medium (architecture docs) | High | API integration, cloud concepts |
| **Developers** | 20-50 | Heavy (story implementation, Dev Agent) | Critical | IDE plugin, API workflows |
| **QA Engineers** | 5-15 | Heavy (QA reviews, gates) | Critical | QA workflows, gate API |
| **Scrum Masters** | 3-8 | Medium (story creation) | Medium | Story management API |
| **Analysts** | 2-5 | Light (research, brainstorming) | Low | Web UI basics |
| **Admins/DevOps** | 2-3 | System management | Critical | Cloud admin, deployment |

#### 3.2.2 User Surveys

**Pre-Migration Survey** (send 4 weeks before Phase 1):

```
BMad Migration Survey

1. How frequently do you use BMad?
   [ ] Daily  [ ] Weekly  [ ] Monthly  [ ] Rarely

2. Which agents do you use most? (select all that apply)
   [ ] Analyst  [ ] PM  [ ] UX Expert  [ ] Architect
   [ ] PO  [ ] SM  [ ] Dev  [ ] QA
   [ ] BMad-Master  [ ] BMad-Orchestrator

3. What is your primary use case?
   [ ] Planning (PRD, architecture)
   [ ] Development (story implementation)
   [ ] Quality Assurance (reviews, gates)
   [ ] Project management (tracking, coordination)

4. How comfortable are you with cloud-based tools?
   [ ] Very comfortable  [ ] Comfortable  [ ] Neutral
   [ ] Uncomfortable  [ ] Very uncomfortable

5. What concerns do you have about migrating to a cloud-based system?
   [Open text]

6. What training format would you prefer?
   [ ] Live workshops  [ ] Video tutorials  [ ] Written docs
   [ ] Hands-on labs  [ ] 1-on-1 sessions

7. Would you be interested in participating in the pilot program?
   [ ] Yes  [ ] No  [ ] Maybe
```

**Success Criteria**:
- 70%+ response rate
- 60%+ "comfortable" or better with cloud tools
- < 30% critical concerns (performance, data loss)
- 20%+ willing to participate in pilot

### 3.3 Risk Assessment

#### 3.3.1 Risk Identification Matrix

| Risk Category | Specific Risk | Likelihood (1-5) | Impact (1-5) | Risk Score | Mitigation |
|--------------|---------------|-----------------|-------------|-----------|------------|
| **Data** | Data loss during migration | 1 | 5 | 5 | Bidirectional sync, automated validation, backups |
| **Data** | Data corruption | 1 | 5 | 5 | Schema validation, checksums, rollback capability |
| **Data** | Inconsistency between systems | 2 | 4 | 8 | Real-time sync monitoring, automated reconciliation |
| **Performance** | Increased latency | 3 | 3 | 9 | Shadow mode testing, caching, optimization |
| **Performance** | Reduced throughput | 2 | 3 | 6 | Load testing, auto-scaling, performance tuning |
| **Performance** | Cloud service outages | 2 | 4 | 8 | Multi-region deployment, file fallback |
| **User** | User resistance/low adoption | 3 | 3 | 9 | Training, pilot program, incremental adoption |
| **User** | Productivity loss | 3 | 3 | 9 | Parallel operation, comprehensive training |
| **User** | Learning curve too steep | 2 | 3 | 6 | Simplified UI, extensive docs, support team |
| **Technical** | Integration failures | 2 | 4 | 8 | Comprehensive testing, staged rollout |
| **Technical** | API compatibility issues | 2 | 3 | 6 | Backward compatibility layer, versioned APIs |
| **Technical** | Infrastructure deployment fails | 1 | 4 | 4 | IaC testing, dry runs, rollback procedures |
| **Cost** | Cost overruns | 2 | 2 | 4 | Budget monitoring, cost alerts, optimization |
| **Cost** | Unexpected usage spikes | 2 | 2 | 4 | Rate limiting, quotas, budget caps |
| **Timeline** | Migration delays | 3 | 3 | 9 | Buffer time, agile approach, priority management |
| **Timeline** | Scope creep | 3 | 2 | 6 | Strict scope control, change management |

**Risk Scoring**: Likelihood × Impact = Risk Score (higher score = higher priority)

#### 3.3.2 Top Risks and Detailed Mitigations

**Risk 1: Data Inconsistency Between Systems (Risk Score: 8)**

*Description*: During parallel operation, file system and cloud storage may diverge due to sync failures, race conditions, or bugs.

*Mitigation Strategy*:
- **Real-Time Sync Monitoring**: Dashboard showing sync lag, failure rate
- **Automated Reconciliation**: Hourly jobs compare file system vs cloud, alert on discrepancies
- **Conflict Resolution**: Automated rules (e.g., "cloud wins" or "newest timestamp wins")
- **Manual Override**: UI for admins to manually resolve conflicts
- **Audit Trail**: All sync operations logged for forensic analysis

*Contingency*: If inconsistencies exceed 1%, pause migration, investigate root cause, re-sync affected projects.

**Risk 2: User Resistance/Low Adoption (Risk Score: 9)**

*Description*: Users may resist change, continue using file-based system, or abandon BMad entirely.

*Mitigation Strategy*:
- **Early Communication**: Announce migration 8 weeks in advance, explain benefits
- **Pilot Champions**: Recruit enthusiastic early adopters to demonstrate success
- **Training Program**: 3-tier training (basic, intermediate, advanced) with hands-on labs
- **Support Team**: Dedicated support during migration (Slack channel, office hours)
- **Feedback Loop**: Weekly surveys, rapid response to issues, visible improvements

*Contingency*: If adoption < 50% after Phase 3, pause rollout, address concerns, improve UX/training.

**Risk 3: Performance Degradation (Risk Score: 9)**

*Description*: Cloud-based system may have higher latency or lower throughput than file-based system.

*Mitigation Strategy*:
- **Shadow Mode Testing**: 2-3 weeks of performance benchmarking before pilot
- **Performance Baselines**: Measure file-based system performance (P50/P95/P99 latency)
- **Optimization**: Caching (Redis), CDN for templates, connection pooling
- **Auto-Scaling**: Ensure services auto-scale under load
- **Load Testing**: Simulate 2x, 5x, 10x normal load

*Contingency*: If P95 latency > 2x file-based system, investigate bottlenecks (Firestore indexes, Cloud Run concurrency, network), optimize, re-test.

**Risk 4: Migration Timeline Delays (Risk Score: 9)**

*Description*: Technical issues, scope creep, or resource constraints delay migration beyond 14 weeks.

*Mitigation Strategy*:
- **Agile Approach**: 2-week sprints, adjust scope based on progress
- **Buffer Time**: 2-week buffer built into 14-week timeline
- **Priority Management**: Core features first, nice-to-haves deferred
- **Resource Flexibility**: Ability to add contractors/consultants if needed
- **Weekly Reviews**: Track progress, identify blockers, adjust plan

*Contingency*: If > 2 weeks behind schedule, evaluate: (1) reduce scope, (2) add resources, or (3) extend timeline with stakeholder approval.

### 3.4 Success Criteria Definition

**Migration Success Defined**:

The migration is considered successful when **ALL** of the following criteria are met:

#### 3.4.1 Data Integrity Criteria
- ✅ **100% Data Accuracy**: All projects, stories, gates, artifacts migrated without data loss
- ✅ **Schema Validation**: 100% of migrated data passes schema validation
- ✅ **Checksum Verification**: All document checksums match between file system and cloud
- ✅ **Relationship Integrity**: All relationships (story → gate, story → epic, etc.) preserved
- ✅ **Historical Data**: All git history and audit trail accessible via version API

#### 3.4.2 Performance Criteria
- ✅ **Latency**: P95 latency ≤ 1.5x file-based system (acceptable degradation)
- ✅ **Throughput**: Support ≥ 100 concurrent agent operations
- ✅ **Availability**: 99.9% uptime (< 43 minutes downtime/month)
- ✅ **Error Rate**: < 0.1% API error rate

#### 3.4.3 User Adoption Criteria
- ✅ **Migration Rate**: 95%+ of active projects migrated to cloud
- ✅ **User Adoption**: 90%+ of active users using cloud platform
- ✅ **Satisfaction**: 80%+ positive feedback on post-migration survey
- ✅ **Support Tickets**: < 5 critical support tickets/week after migration

#### 3.4.4 Technical Criteria
- ✅ **API Coverage**: 100% of file-based operations supported via API
- ✅ **Integration Testing**: All integrations (CI/CD, IDE plugins) tested and working
- ✅ **Rollback Capability**: Successful rollback test completed
- ✅ **Documentation**: Complete API docs, user guides, troubleshooting docs published

#### 3.4.5 Cost Criteria
- ✅ **Budget Compliance**: Actual costs within 20% of projected costs
- ✅ **Monitoring**: Cost monitoring dashboard operational, budget alerts configured
- ✅ **Optimization**: Cost optimization recommendations implemented

---

## 4. Migration Phases

### 4.1 Phase 0: Pre-Migration Assessment (Weeks -2 to 0)

**Objective**: Prepare infrastructure, assess readiness, and establish baselines.

**Duration**: 1-2 weeks

**Key Activities**:

#### 4.1.1 Infrastructure Assessment
```bash
# Run assessment scripts
./scripts/assess-infrastructure.sh

# Output: infrastructure-assessment-report.json
```

**Deliverables**:
- Infrastructure inventory (projects, artifacts, sizes)
- Data quality report (validation results)
- Dependency map (integrations, custom scripts)

#### 4.1.2 User Readiness Survey
- Send user survey (4 weeks before Phase 1)
- Analyze results, identify training needs
- Recruit pilot program participants

#### 4.1.3 Risk Analysis
- Complete risk identification matrix
- Document mitigation strategies
- Establish monitoring and alerting

#### 4.1.4 Team Training
- Train migration team on Google ADK, GCP services
- Review architecture design, deployment guide
- Conduct dry-run of deployment procedures

**Exit Criteria**:
- ✅ Infrastructure assessment complete, no blockers identified
- ✅ User survey complete, ≥ 70% response rate
- ✅ Risk register complete, all high-risk items have mitigation plans
- ✅ Migration team trained, deployment procedures validated

---

### 4.2 Phase 1: Parallel Infrastructure Deployment (Weeks 1-2)

**Objective**: Deploy cloud infrastructure in parallel with file-based system. Establish bidirectional sync.

**Duration**: 2 weeks

**Key Activities**:

#### 4.2.1 GCP Infrastructure Deployment

**Week 1: Core Infrastructure**
```bash
# Deploy via Terraform (recommended)
cd terraform/
terraform init
terraform plan -out=bmad-infra.tfplan
terraform apply bmad-infra.tfplan

# Or deploy manually (see deployment-guide.md)
./scripts/deploy-infrastructure.sh
```

**Components Deployed**:
- GCP project creation
- Firestore database (Native mode)
- Cloud Storage buckets (templates, artifacts, data, KB)
- Service accounts and IAM roles
- Vertex AI API enablement
- Cloud Run base services
- Monitoring and logging

**Week 2: Sync Infrastructure**
```bash
# Deploy sync service (bidirectional)
./scripts/deploy-sync-service.sh

# Configure sync rules
./scripts/configure-sync-rules.sh
```

**Sync Service Components**:
- File watcher (monitors local file system changes)
- Cloud listener (monitors Firestore/Cloud Storage changes)
- Sync engine (bidirectional synchronization logic)
- Conflict resolver (handles concurrent modifications)
- Sync dashboard (monitoring UI)

#### 4.2.2 Bidirectional Sync Setup

**Sync Architecture**:
```
┌─────────────────────────────────────────────────────────────┐
│                     SYNC SERVICE                             │
│                                                               │
│  ┌─────────────────┐         ┌─────────────────┐            │
│  │  File Watcher   │         │ Cloud Listener  │            │
│  │  (Local FS)     │         │ (Firestore +    │            │
│  │                 │         │  Cloud Storage) │            │
│  └────────┬────────┘         └────────┬────────┘            │
│           │                           │                      │
│           └───────────┬───────────────┘                      │
│                       ▼                                      │
│              ┌─────────────────┐                             │
│              │  Sync Engine    │                             │
│              │  • Detect       │                             │
│              │    changes      │                             │
│              │  • Apply        │                             │
│              │    changes      │                             │
│              │  • Resolve      │                             │
│              │    conflicts    │                             │
│              └─────────────────┘                             │
└───────────────────────────────────────────────────────────────┘
         │                                │
         ▼                                ▼
┌──────────────────┐            ┌──────────────────┐
│  File System     │            │  Cloud Storage   │
│  docs/           │  ←────→    │  Firestore +     │
│  core-config.yaml│            │  Cloud Storage   │
└──────────────────┘            └──────────────────┘
```

**Sync Rules**:
1. **File → Cloud**: Any file change triggers cloud write
2. **Cloud → File**: Any cloud change triggers file write
3. **Conflict Resolution**:
   - If both changed simultaneously: newest timestamp wins
   - If timestamp tie: cloud wins (cloud is source of truth during migration)
4. **Sync Frequency**: Real-time (< 1 second latency)

#### 4.2.3 Initial Data Migration

**Migrate System-Level Data**:
```bash
# Upload templates to Cloud Storage
./scripts/migrate-templates.sh

# Upload framework data (checklists, workflows)
./scripts/migrate-framework-data.sh

# Upload KB documents for KB Mode
./scripts/migrate-kb-documents.sh

# Verify uploads
./scripts/verify-system-data.sh
```

**Migrate Test Project** (validation):
```bash
# Migrate one test project
./scripts/migrate-project.sh --project-id test-project-001 --mode test

# Verify migration
./scripts/verify-project-migration.sh --project-id test-project-001

# Run comparison (file vs cloud)
./scripts/compare-file-vs-cloud.sh --project-id test-project-001
```

**Exit Criteria**:
- ✅ All GCP infrastructure deployed and operational
- ✅ Sync service deployed and running
- ✅ Bidirectional sync working (file ↔ cloud)
- ✅ System-level data uploaded and verified
- ✅ Test project migrated successfully
- ✅ Sync latency < 2 seconds
- ✅ Zero sync errors in 24-hour test period

---

### 4.3 Phase 2: Shadow Mode Testing (Weeks 3-5)

**Objective**: Cloud system mirrors all file-based operations. Validate parity and performance.

**Duration**: 2-3 weeks

**Key Activities**:

#### 4.3.1 Shadow Mode Configuration

**Enable Shadow Mode**:
```bash
# Configure sync service for shadow mode
./scripts/configure-shadow-mode.sh

# Shadow mode characteristics:
# - All writes go to file system (primary)
# - All writes also go to cloud (shadow)
# - Reads come from file system only
# - Cloud is validation-only (not user-facing)
```

**Shadow Mode Dashboard**:
```
Shadow Mode Metrics Dashboard
┌────────────────────────────────────────────────────┐
│ Sync Status                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Sync Success Rate:     99.97% ✅                    │
│ Avg Sync Latency:      0.8s   ✅                    │
│ P95 Sync Latency:      1.5s   ✅                    │
│ Sync Failures (24h):   2      ⚠️                    │
│                                                      │
│ Data Consistency                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Projects in Sync:      48/50  ⚠️                    │
│ Stories in Sync:       987/995 ⚠️                   │
│ Gates in Sync:         455/455 ✅                    │
│ Artifacts in Sync:     123/125 ⚠️                   │
│                                                      │
│ Performance (Cloud)                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ API P50 Latency:       120ms  ✅                     │
│ API P95 Latency:       350ms  ✅                     │
│ API P99 Latency:       680ms  ⚠️                    │
│ Error Rate:            0.05%  ✅                     │
└────────────────────────────────────────────────────┘
```

#### 4.3.2 Consistency Validation

**Automated Validation** (runs hourly):
```bash
# Compare all projects
./scripts/validate-consistency.sh --all-projects

# Output: consistency-report.json
{
  "timestamp": "2026-01-15T10:00:00Z",
  "projects_total": 50,
  "projects_in_sync": 48,
  "projects_out_of_sync": 2,
  "stories_total": 995,
  "stories_in_sync": 987,
  "stories_out_of_sync": 8,
  "discrepancies": [
    {
      "project_id": "proj-042",
      "type": "story",
      "story_id": "3.2",
      "issue": "Status mismatch: file=Review, cloud=InProgress",
      "timestamp": "2026-01-15T09:45:00Z",
      "resolution": "Cloud updated to match file (file is source of truth)"
    }
  ]
}
```

**Manual Spot Checks** (weekly):
- Select 5 random projects
- Deep comparison (content, metadata, checksums)
- User acceptance (do migrated artifacts look correct?)

#### 4.3.3 Performance Benchmarking

**File-Based Baseline** (measured before migration):
```
File-Based System Performance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Operation             P50    P95    P99
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Load agent            50ms   80ms   120ms
Execute task          200ms  400ms  650ms
Create artifact       100ms  180ms  280ms
Update story          80ms   150ms  230ms
Create gate           90ms   160ms  250ms
Query stories         30ms   60ms   100ms
```

**Cloud System Performance** (measured in shadow mode):
```
Cloud-Based System Performance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Operation             P50    P95    P99    vs File
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Load agent            120ms  250ms  450ms  +2.4x ⚠️
Execute task          280ms  550ms  900ms  +1.4x ✅
Create artifact       150ms  280ms  480ms  +1.5x ✅
Update story          110ms  220ms  380ms  +1.4x ✅
Create gate           100ms  190ms  320ms  +1.1x ✅
Query stories         45ms   90ms   150ms  +1.5x ✅
```

**Performance Analysis**:
- Agent loading is 2.4x slower (⚠️ needs optimization)
- Other operations are 1.1-1.5x slower (✅ acceptable)
- **Action**: Optimize agent loading (caching, connection pooling)

#### 4.3.4 Load Testing

**Simulate Production Load**:
```bash
# Run load test (100 concurrent users)
./scripts/load-test.sh --users 100 --duration 60m

# Test scenarios:
# - Create 10 PRDs/min
# - Create 50 stories/min
# - Execute 100 QA reviews/min
# - Query operations: 500/min
```

**Load Test Results**:
```
Load Test Summary (100 concurrent users, 60 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Requests:     180,000
Successful:         179,850 (99.92%)
Failed:             150 (0.08%)
Avg Response Time:  220ms
P95 Response Time:  480ms
P99 Response Time:  850ms
Errors:             Rate limit exceeded (50), Timeout (100)
```

**Optimization Actions**:
- Increase Cloud Run concurrency (50 → 100)
- Add Redis cache for agent configs
- Increase Firestore connection pool
- Re-test until error rate < 0.1%

#### 4.3.5 Issue Tracking and Resolution

**Shadow Mode Issue Log**:
```markdown
## Shadow Mode Issues (Week 3-5)

### Week 3
- **Issue #1**: Story status sync lag (2-5 seconds)
  - Root Cause: Firestore listener delay
  - Resolution: Switch to Firestore real-time listeners
  - Status: ✅ Resolved

- **Issue #2**: Large artifact upload failures (> 5 MB)
  - Root Cause: Cloud Storage timeout (30s)
  - Resolution: Increase timeout to 120s, implement chunked upload
  - Status: ✅ Resolved

### Week 4
- **Issue #3**: Agent loading 2.4x slower than file-based
  - Root Cause: Vertex AI cold start, no caching
  - Resolution: Implement Redis cache for agent configs
  - Status: ✅ Resolved (reduced to 1.5x)

- **Issue #4**: Query performance degradation during load test
  - Root Cause: Missing Firestore composite indexes
  - Resolution: Add indexes for common queries
  - Status: ✅ Resolved

### Week 5
- **Issue #5**: Occasional sync conflicts (2-3/day)
  - Root Cause: Concurrent modifications, timestamp resolution
  - Resolution: Implement optimistic locking with version numbers
  - Status: ✅ Resolved
```

**Exit Criteria**:
- ✅ Shadow mode operational for 2+ weeks
- ✅ Consistency validation: ≥ 99.9% of data in sync
- ✅ Performance: Cloud P95 latency ≤ 2x file-based system
- ✅ Load test: Error rate < 0.1% at 100 concurrent users
- ✅ All critical issues resolved
- ✅ Zero data loss incidents

---

### 4.4 Phase 3: Pilot Program (Weeks 6-8)

**Objective**: Select 2-3 pilot projects to use cloud-first. Collect feedback, refine UX.

**Duration**: 2-3 weeks

**Key Activities**:

#### 4.4.1 Pilot Project Selection

**Selection Criteria**:
- **Project Maturity**: Mid-stage (not greenfield, not legacy)
- **Team Size**: 3-5 people (manageable for support)
- **Agent Usage**: Uses 4+ different agents (good coverage)
- **Risk Tolerance**: Team willing to experiment, provide feedback
- **Availability**: Team has time for training, feedback sessions

**Pilot Projects**:
1. **Project Alpha** (e-commerce checkout feature)
   - Team: 4 developers, 1 PM, 1 QA
   - Agents used: PM, Architect, SM, Dev, QA
   - Status: Mid-development (15/30 stories complete)

2. **Project Beta** (mobile app backend)
   - Team: 3 developers, 1 PM
   - Agents used: PM, Architect, Dev, QA
   - Status: Planning phase (PRD complete, architecture in progress)

3. **Project Gamma** (data pipeline refactoring)
   - Team: 5 developers, 1 QA
   - Agents used: Architect, SM, Dev, QA
   - Status: Brownfield (analyzing existing codebase)

#### 4.4.2 Pilot Onboarding

**Week 6: Training and Onboarding**
```bash
# Provision pilot projects in cloud
./scripts/provision-pilot-project.sh --project-id project-alpha
./scripts/provision-pilot-project.sh --project-id project-beta
./scripts/provision-pilot-project.sh --project-id project-gamma

# Migrate existing data
./scripts/migrate-project.sh --project-id project-alpha --mode pilot
./scripts/migrate-project.sh --project-id project-beta --mode pilot
./scripts/migrate-project.sh --project-id project-gamma --mode pilot

# Verify migrations
./scripts/verify-project-migration.sh --all-pilots
```

**Onboarding Sessions** (2-hour workshops per team):
1. **Session 1: Cloud Platform Overview**
   - Architecture walkthrough
   - Web UI tour
   - API basics
   - IDE plugin setup

2. **Session 2: Agent Workflows**
   - How to invoke agents via API
   - Story creation and management
   - QA review and gate workflows
   - Troubleshooting and support

**Onboarding Materials**:
- Quick start guide (1-pager)
- Video tutorials (5-10 minutes each)
- Cheat sheet (common commands, API endpoints)
- Support Slack channel (#bmad-pilot)

#### 4.4.3 Cloud-First Operation

**Pilot Mode Configuration**:
```bash
# Configure pilot projects for cloud-first
./scripts/configure-cloud-first.sh --project-id project-alpha

# Sync behavior in pilot mode:
# - Writes go to cloud (primary)
# - Writes also sync to file system (backup)
# - Reads come from cloud
# - File system is read-only backup
```

**Pilot Monitoring Dashboard**:
```
Pilot Program Dashboard (Week 6-8)
┌────────────────────────────────────────────────────────────┐
│ Project Alpha (e-commerce checkout)                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Status:          Active (cloud-first)                       │
│ Stories Created: 12 (via cloud API)                         │
│ Agent Calls:     156 (last 7 days)                          │
│ Errors:          3 (1.9%)                                   │
│ User Feedback:   8/10 positive                              │
│                                                              │
│ Project Beta (mobile backend)                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Status:          Active (cloud-first)                       │
│ Stories Created: 8 (via cloud API)                          │
│ Agent Calls:     98 (last 7 days)                           │
│ Errors:          2 (2.0%)                                   │
│ User Feedback:   7/10 positive                              │
│                                                              │
│ Project Gamma (data pipeline)                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Status:          Active (cloud-first)                       │
│ Stories Created: 15 (via cloud API)                         │
│ Agent Calls:     203 (last 7 days)                          │
│ Errors:          5 (2.5%)                                   │
│ User Feedback:   6/10 positive                              │
└────────────────────────────────────────────────────────────┘
```

#### 4.4.4 Feedback Collection

**Weekly Feedback Sessions** (30 minutes per team):
- What's working well?
- What's frustrating/confusing?
- What features are missing?
- Performance issues?
- Support needs?

**Feedback Tracking**:
```markdown
## Pilot Feedback Log

### Week 6
**Project Alpha**
- ✅ Web UI is intuitive, easy to navigate
- ⚠️ IDE plugin auth flow is confusing
- ❌ Story query API is slow (P95 = 800ms)
- Feature Request: Bulk story status update

**Project Beta**
- ✅ Agent responses are consistent with file-based system
- ⚠️ No keyboard shortcuts in Web UI
- Feature Request: Export artifacts as PDF

**Project Gamma**
- ✅ Cloud-based collaboration is game-changer (real-time updates)
- ❌ Brownfield epic generation is buggy
- Feature Request: Better search across all artifacts

### Week 7
**Improvements Implemented**:
- IDE plugin auth flow redesigned (1-click OAuth)
- Story query API optimized (P95 = 350ms) ✅
- Web UI keyboard shortcuts added ✅
- Brownfield epic generation bug fixed ✅

**Outstanding Requests**:
- Bulk story status update (in progress)
- PDF export (prioritized for Phase 4)
- Enhanced search (prioritized for Phase 5)

### Week 8
**Project Alpha**: 9/10 positive feedback ✅
**Project Beta**: 8/10 positive feedback ✅
**Project Gamma**: 7/10 positive feedback (brownfield issues) ⚠️
```

#### 4.4.5 Go/No-Go Decision

**End of Week 8: Pilot Review Meeting**

**Go Criteria** (must meet ALL):
- ✅ Pilot projects successfully migrated (no rollbacks)
- ✅ Error rate < 2%
- ✅ Average user feedback ≥ 7/10
- ✅ No critical bugs or data loss incidents
- ✅ Performance within acceptable range (P95 ≤ 2x file-based)
- ✅ Support burden manageable (< 10 tickets/week)

**If GO**: Proceed to Phase 4 (Gradual Rollout)
**If NO-GO**: Pause, address issues, extend pilot by 1-2 weeks

**Exit Criteria**:
- ✅ Pilot program complete (2-3 weeks)
- ✅ 2-3 pilot projects successfully using cloud-first
- ✅ Average user feedback ≥ 7/10
- ✅ Error rate < 2%
- ✅ All critical feedback items addressed
- ✅ Go/No-Go decision: GO ✅

---

### 4.5 Phase 4: Gradual Rollout (Weeks 9-11)

**Objective**: Migrate all projects to cloud-first, team by team, with continuous monitoring.

**Duration**: 2-3 weeks

**Key Activities**:

#### 4.5.1 Rollout Plan

**Rollout Strategy**: **Project-by-Project, Risk-Tiered**

**Project Risk Tiers**:
- **Tier 1 (Low Risk)**: New projects, small teams, low business impact
- **Tier 2 (Medium Risk)**: Active development, medium teams, moderate impact
- **Tier 3 (High Risk)**: Critical projects, large teams, high business impact

**Rollout Schedule**:

**Week 9: Tier 1 Projects (Low Risk)**
```
Monday:    Migrate 5 Tier 1 projects (25% of Tier 1)
Wednesday: Migrate 5 Tier 1 projects (50% of Tier 1)
Friday:    Migrate 10 Tier 1 projects (100% of Tier 1)
           → 20 projects total, 40% of all projects
```

**Week 10: Tier 2 Projects (Medium Risk)**
```
Monday:    Migrate 5 Tier 2 projects (25% of Tier 2)
Wednesday: Migrate 5 Tier 2 projects (50% of Tier 2)
Friday:    Migrate 10 Tier 2 projects (100% of Tier 2)
           → 40 projects total, 80% of all projects
```

**Week 11: Tier 3 Projects (High Risk)**
```
Monday:    Migrate 2 Tier 3 projects (20% of Tier 3)
Wednesday: Migrate 3 Tier 3 projects (50% of Tier 3)
Friday:    Migrate 5 Tier 3 projects (100% of Tier 3)
           → 50 projects total, 100% of all projects ✅
```

#### 4.5.2 Migration Automation

**Automated Migration Script**:
```bash
#!/bin/bash
# migrate-project-to-cloud.sh

PROJECT_ID=$1
TIER=$2  # tier1, tier2, tier3

echo "Migrating project: $PROJECT_ID (Tier: $TIER)"

# Step 1: Pre-migration validation
echo "Step 1: Validating project..."
./scripts/validate-project.sh --project-id $PROJECT_ID
if [ $? -ne 0 ]; then
  echo "❌ Validation failed. Aborting migration."
  exit 1
fi

# Step 2: Backup file-based project
echo "Step 2: Creating backup..."
./scripts/backup-project.sh --project-id $PROJECT_ID
if [ $? -ne 0 ]; then
  echo "❌ Backup failed. Aborting migration."
  exit 1
fi

# Step 3: Migrate data to cloud
echo "Step 3: Migrating data to cloud..."
./scripts/migrate-project-data.sh --project-id $PROJECT_ID
if [ $? -ne 0 ]; then
  echo "❌ Data migration failed. Aborting migration."
  exit 1
fi

# Step 4: Verify data integrity
echo "Step 4: Verifying data integrity..."
./scripts/verify-project-migration.sh --project-id $PROJECT_ID
if [ $? -ne 0 ]; then
  echo "❌ Verification failed. Aborting migration."
  exit 1
fi

# Step 5: Switch to cloud-first mode
echo "Step 5: Switching to cloud-first mode..."
./scripts/configure-cloud-first.sh --project-id $PROJECT_ID
if [ $? -ne 0 ]; then
  echo "❌ Cloud-first configuration failed. Rolling back..."
  ./scripts/rollback-project.sh --project-id $PROJECT_ID
  exit 1
fi

# Step 6: Notify team
echo "Step 6: Notifying team..."
./scripts/notify-team.sh --project-id $PROJECT_ID --message "Project migrated to cloud-first mode"

echo "✅ Project $PROJECT_ID migrated successfully!"
```

**Batch Migration** (for multiple projects):
```bash
# Migrate batch of Tier 1 projects
./scripts/batch-migrate.sh --tier tier1 --batch-size 5

# Output:
# Migrating 5 Tier 1 projects...
# ✅ project-001 migrated (2.5 minutes)
# ✅ project-007 migrated (1.8 minutes)
# ✅ project-012 migrated (3.1 minutes)
# ✅ project-019 migrated (2.2 minutes)
# ✅ project-023 migrated (2.7 minutes)
#
# Summary:
# - Successful: 5/5 (100%)
# - Failed: 0/5 (0%)
# - Total time: 12.3 minutes
# - Avg time per project: 2.5 minutes
```

#### 4.5.3 Rollout Monitoring

**Rollout Dashboard**:
```
Gradual Rollout Dashboard (Week 9-11)
┌─────────────────────────────────────────────────────────────────┐
│ Migration Progress                                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Total Projects:        50                                        │
│ Migrated:              40 (80%) ███████████████████░░░           │
│ In Progress:           5 (10%)                                   │
│ Pending:               5 (10%)                                   │
│                                                                   │
│ Success Rate:          39/40 (97.5%) ✅                          │
│ Rollback Rate:         1/40 (2.5%)   ✅                          │
│                                                                   │
│ By Tier                                                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Tier 1 (Low Risk):     20/20 (100%) ✅                           │
│ Tier 2 (Medium Risk):  18/20 (90%)  🔄                           │
│ Tier 3 (High Risk):    2/10 (20%)   ⏳                           │
│                                                                   │
│ System Health                                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ API Success Rate:      99.8% ✅                                   │
│ Avg API Latency (P95): 420ms ✅                                  │
│ Error Rate:            0.2%  ✅                                   │
│ Support Tickets:       12/week ⚠️                                │
└─────────────────────────────────────────────────────────────────┘
```

**Real-Time Alerts**:
```
Alert Thresholds (Slack/PagerDuty)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Critical Alerts (Immediate Response Required)
- Migration failure rate > 10%
- Data loss incident detected
- API error rate > 1%
- System outage (Firestore, Vertex AI down)

Warning Alerts (Monitor Closely)
- Migration failure rate > 5%
- API latency P95 > 1000ms
- Support ticket spike (> 20/week)
- Cost spike (> 150% of budget)
```

#### 4.5.4 User Support During Rollout

**Support Structure**:

**Tier 1: Self-Service**
- Documentation hub (searchable, indexed)
- Video tutorials
- FAQs
- Troubleshooting guides

**Tier 2: Async Support**
- Slack channel (#bmad-migration-support)
- Email support (support@bmad.example.com)
- Response SLA: 4 hours

**Tier 3: Synchronous Support**
- Daily office hours (10am-12pm, 2pm-4pm)
- 1-on-1 screen sharing sessions
- Emergency hotline (for critical issues)

**Support Metrics** (Week 9-11):
```
Support Ticket Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tickets:       47
By Severity:
  - Critical:        2 (4%)   → Avg resolution: 2 hours
  - High:            8 (17%)  → Avg resolution: 6 hours
  - Medium:          22 (47%) → Avg resolution: 24 hours
  - Low:             15 (32%) → Avg resolution: 48 hours

By Category:
  - Authentication:  12 (26%)
  - Performance:     8 (17%)
  - Data sync:       7 (15%)
  - UI/UX:           10 (21%)
  - API usage:       10 (21%)

Resolution Rate:     45/47 (96%) ✅
Open Tickets:        2 (both low severity)
```

#### 4.5.5 Rollback Handling

**Rollback Triggers**:
- Migration failure (data corruption, validation failure)
- User request (team not ready, blocking issues)
- System issues (cloud service outage, critical bugs)

**Rollback Procedure**:
```bash
# Rollback project to file-based mode
./scripts/rollback-project.sh --project-id project-042

# Steps:
# 1. Switch sync mode to file-first
# 2. Sync cloud → file (ensure file system has latest data)
# 3. Verify data integrity
# 4. Disable cloud-first mode
# 5. Notify team
# 6. Log rollback reason

# Output:
# ✅ Project project-042 rolled back to file-based mode
# Reason: User request (team needs more training)
# Downtime: 0 seconds (seamless rollback)
```

**Rollback Example**:
```
Rollback: Project 042 (Week 10, Day 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project:        project-042 (inventory management)
Trigger:        User request
Reason:         Team needs more IDE plugin training
Rollback Time:  2026-02-05 14:30:00 UTC
Duration:       8 minutes (migration) + 5 minutes (rollback) = 13 min
Data Loss:      None (all changes synced)
Impact:         None (team continued working in file-based mode)
Follow-Up:      Scheduled additional training session (Feb 10)
Retry:          Planned for Feb 17 (after training)
```

**Exit Criteria**:
- ✅ 95%+ of projects migrated to cloud-first
- ✅ Rollback rate < 5%
- ✅ API success rate ≥ 99.5%
- ✅ User feedback ≥ 7/10 average
- ✅ Support burden manageable (< 15 critical tickets/week)

---

### 4.6 Phase 5: Cloud-Primary Mode (Week 12)

**Objective**: Make cloud the primary source of truth. File system becomes read-only archive.

**Duration**: 1 week

**Key Activities**:

#### 4.6.1 Cloud-Primary Configuration

**Switch to Cloud-Primary**:
```bash
# Configure all projects for cloud-primary mode
./scripts/configure-cloud-primary.sh --all-projects

# Cloud-primary characteristics:
# - Cloud is source of truth (all reads/writes)
# - File system is read-only (archive/backup)
# - Sync is one-way: cloud → file
# - File changes are blocked (error if attempted)
```

**User Communication**:
```
Subject: BMad Migration Complete - Cloud is Now Primary

Hello BMad Users,

We've successfully migrated BMad to the cloud! 🎉

What's Changing (effective immediately):
✅ All BMad operations now use the cloud platform
✅ Your local file system is now a read-only archive
✅ To make changes, use the Web UI, IDE plugin, or API

What Stays the Same:
✅ All your data is preserved (no data loss)
✅ Agent behaviors and workflows are unchanged
✅ File system backup is still synced (one-way: cloud → file)

Need Help?
- Documentation: https://docs.bmad.example.com
- Support Slack: #bmad-support
- Office Hours: Daily 10am-12pm, 2pm-4pm

Thank you for your patience during the migration!

- BMad Migration Team
```

#### 4.6.2 File System Lockdown

**Read-Only Enforcement**:
```bash
# Configure file watchers to block writes
./scripts/configure-file-lockdown.sh

# If user attempts to edit files:
echo "Error: BMad file system is now read-only."
echo "Please use the cloud platform for all changes:"
echo "  - Web UI: https://bmad.example.com"
echo "  - IDE Plugin: Install from marketplace"
echo "  - API: https://api.bmad.example.com/docs"
echo ""
echo "Your local files are synced from cloud (read-only backup)."
```

**Backup Sync** (one-way: cloud → file):
```bash
# Cloud-to-file sync (every 15 minutes)
./scripts/sync-cloud-to-file.sh --all-projects

# Purpose: Keep local files up-to-date as read-only reference
# Users can still read files, view in text editors, grep, etc.
# But all modifications must go through cloud
```

#### 4.6.3 Performance Optimization

**Optimization Focus** (now that all users are on cloud):

**Caching Layer**:
```bash
# Deploy Redis cache for hot data
./scripts/deploy-redis-cache.sh

# Cache strategy:
# - Agent configs: 1 hour TTL
# - Templates: 1 hour TTL
# - Project configs: 15 minutes TTL
# - Story metadata: 5 minutes TTL
# - QA gates: 5 minutes TTL
```

**Firestore Optimization**:
```bash
# Add composite indexes for common queries
./scripts/add-firestore-indexes.sh

# Indexes:
# - /stories: (projectId, status, epic, story)
# - /gates: (projectId, decision, created_at)
# - /artifacts: (projectId, type, created_at)
```

**Cloud Run Scaling**:
```bash
# Increase Cloud Run instances (now at full load)
gcloud run services update bmad-agent-gateway \
  --min-instances=2 \
  --max-instances=20 \
  --concurrency=100

gcloud run services update bmad-workflow-gateway \
  --min-instances=2 \
  --max-instances=15 \
  --concurrency=80
```

**Performance Results** (after optimization):
```
Optimized Performance (Week 12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Operation             P50    P95    P99    vs Baseline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Load agent            80ms   150ms  250ms  +1.6x ✅
Execute task          250ms  450ms  750ms  +1.3x ✅
Create artifact       120ms  220ms  380ms  +1.2x ✅
Update story          90ms   170ms  290ms  +1.1x ✅
Create gate           85ms   155ms  260ms  +0.9x ✅✅
Query stories         40ms   75ms   120ms  +1.3x ✅
```

**Note**: Gate creation is now **faster** than file-based system! (✅✅)

#### 4.6.4 Cost Optimization

**Cost Review** (first full month on cloud):
```
Cloud Cost Breakdown (Month 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service                   Actual    Projected   Variance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vertex AI Agents          $420      $400        +5%  ✅
Reasoning Engine          $180      $150        +20% ⚠️
Cloud Functions           $35       $30         +17% ✅
Cloud Run                 $120      $100        +20% ⚠️
Firestore                 $65       $60         +8%  ✅
Cloud Storage             $25       $20         +25% ⚠️
Vertex AI Search          $90       $80         +13% ✅
Networking & Misc         $55       $50         +10% ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL                     $990      $890        +11% ✅
```

**Cost Optimization Actions**:
- Reasoning Engine: Optimize workflow step count, reduce redundant calls
- Cloud Run: Right-size min instances (2 → 1), tune concurrency
- Cloud Storage: Enable lifecycle policies (delete old versions > 90 days)
- **Target**: Reduce to $850-$900/month (within projection)

**Exit Criteria**:
- ✅ Cloud is primary source of truth for all projects
- ✅ File system is read-only (lockdown enforced)
- ✅ Performance optimized (P95 ≤ 1.5x file-based baseline)
- ✅ Costs within 20% of projections
- ✅ Zero critical incidents in Week 12

---

### 4.7 Phase 6: Decommissioning (Weeks 13-14)

**Objective**: Archive file-based system, finalize documentation, declare migration complete.

**Duration**: 1-2 weeks

**Key Activities**:

#### 4.7.1 File System Archival

**Archive Strategy**:
```bash
# Create final archive of file-based system
./scripts/create-final-archive.sh

# Archive contents:
# - All project files (docs/, core-config.yaml)
# - All .bmad-core files (agents, tasks, templates)
# - Git history (full clone)
# - Migration logs and reports
# - User feedback and surveys

# Output: bmad-file-based-archive-2026-02-20.tar.gz (compressed)
# Storage: Cloud Storage (bmad-archives bucket)
```

**Archive Verification**:
```bash
# Verify archive integrity
./scripts/verify-archive.sh bmad-file-based-archive-2026-02-20.tar.gz

# Output:
# ✅ Archive size: 1.2 GB (compressed)
# ✅ Checksum verified: SHA256 match
# ✅ All projects present: 50/50
# ✅ Git history intact: 10,523 commits
# ✅ File count: 12,847 files
# ✅ Archive uploaded to: gs://bmad-archives/2026-02-20/
```

**Archive Retention Policy**:
- **Primary Archive**: Cloud Storage (bmad-archives bucket) - Retained indefinitely
- **Secondary Archive**: Offline backup (external drive) - Retained for 7 years
- **Access**: Admins only (IAM policy, access logging)

#### 4.7.2 Cleanup and Decommissioning

**Remove File Sync Infrastructure**:
```bash
# Stop sync services
./scripts/stop-sync-services.sh

# Remove file watchers
./scripts/remove-file-watchers.sh

# Uninstall file-based CLI tools
./scripts/uninstall-file-based-tools.sh

# Update documentation (remove file-based references)
./scripts/update-docs-for-cloud-only.sh
```

**Decommission File-Based Agents**:
```bash
# Archive .bmad-core directory
mv .bmad-core .bmad-core-archived

# Update IDE plugins (remove file-based mode)
./scripts/update-ide-plugins-cloud-only.sh
```

#### 4.7.3 Final Documentation

**Update All Documentation**:
```markdown
## Documentation Updates (Week 13-14)

1. **User Guides** ✅
   - Remove file-based workflow sections
   - Update all screenshots (cloud UI)
   - Add cloud-only examples

2. **API Documentation** ✅
   - Complete API reference (OpenAPI 3.0)
   - Code examples (Python, JavaScript, curl)
   - Authentication guide

3. **Admin Guides** ✅
   - Cloud deployment procedures
   - Backup and recovery
   - Cost management
   - Troubleshooting

4. **Migration Guide** ✅
   - Historical reference (for future migrations)
   - Lessons learned
   - Best practices

5. **Release Notes** ✅
   - Cloud platform launch announcement
   - New features vs file-based system
   - Known issues and workarounds
```

#### 4.7.4 Post-Migration Review

**Migration Retrospective** (Week 14):

**What Went Well**:
- ✅ Zero data loss throughout migration
- ✅ Seamless parallel operation (file + cloud)
- ✅ Pilot program provided valuable feedback
- ✅ Automated migration scripts were reliable
- ✅ User training was effective

**What Could Be Improved**:
- ⚠️ Performance optimization took longer than expected
- ⚠️ Some users had difficulty with OAuth authentication
- ⚠️ Cost projections were 11% lower than actuals
- ⚠️ Support burden was higher than anticipated (15 tickets/week vs 10 projected)

**Lessons Learned**:
1. **Shadow mode is critical**: 2-3 weeks of validation prevented major issues
2. **Pilot program accelerated adoption**: Early feedback drove UX improvements
3. **Automated migration is essential**: Manual migration would have taken 2x longer
4. **Training investment pays off**: Well-trained users had 50% fewer support tickets
5. **Budget for contingency**: 20% buffer was adequate but necessary

**Final Metrics**:
```
Migration Success Metrics (Final)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Metric                   Target      Actual     Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data Integrity           100%        100%       ✅✅
User Adoption            90%         94%        ✅✅
Project Migration        95%         98%        ✅✅
Performance (P95)        ≤2x         1.5x       ✅✅
Availability             99.9%       99.95%     ✅✅
Cost Compliance          ±20%        +11%       ✅
User Satisfaction        80%         85%        ✅✅
Rollback Rate            <5%         2.5%       ✅✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**All success criteria exceeded!** ✅✅✅

#### 4.7.5 Migration Complete Announcement

**Email to All Users**:
```
Subject: 🎉 BMad Cloud Migration Complete!

Hello BMad Community,

We're thrilled to announce that the BMad cloud migration is officially complete!

📊 Migration by the Numbers:
- 98% of projects migrated (49/50)
- 94% user adoption
- 100% data integrity (zero data loss)
- 85% user satisfaction
- 99.95% uptime

🚀 What's New:
- Cloud-native platform with real-time collaboration
- RESTful API for integrations
- Enhanced performance (1.5x vs file-based at P95)
- Advanced features: semantic search, RAG-powered KB Mode
- Comprehensive monitoring and observability

📚 Resources:
- Documentation: https://docs.bmad.example.com
- API Reference: https://api.bmad.example.com/docs
- Support: #bmad-support Slack channel
- Training: https://bmad.example.com/training

🙏 Thank You:
A huge thank you to everyone who participated in the pilot program, provided feedback, and supported this migration. Your contributions made this a success!

Questions? Reach out to the BMad team anytime.

Happy building! 🏗️

- BMad Team
```

**Exit Criteria**:
- ✅ File-based system archived and retained
- ✅ Sync infrastructure decommissioned
- ✅ Documentation updated (cloud-only)
- ✅ Post-migration review complete
- ✅ Migration declared complete ✅

---

## 5. Data Migration Strategy

### 5.1 Data Migration Architecture

**Migration Flow**:
```
File-Based System                       Cloud-Native System
┌──────────────────────┐                ┌──────────────────────┐
│ .bmad-core/          │                │ Cloud Storage        │
│ ├── agents/          │   ──────────>  │ └── bmad-templates/  │
│ ├── tasks/           │   Conversion   │                      │
│ └── templates/       │                │                      │
└──────────────────────┘                └──────────────────────┘

┌──────────────────────┐                ┌──────────────────────┐
│ core-config.yaml     │                │ Firestore            │
│                      │   ──────────>  │ /projects/{id}/      │
│                      │   Parse+Store  │   config (doc)       │
└──────────────────────┘                └──────────────────────┘

┌──────────────────────┐                ┌──────────────────────┐
│ docs/                │                │ Firestore +          │
│ ├── prd/             │                │ Cloud Storage        │
│ ├── architecture/    │   ──────────>  │                      │
│ ├── stories/         │   Dual Storage │ Metadata → Firestore │
│ └── qa-gates/        │                │ Content  → GCS       │
└──────────────────────┘                └──────────────────────┘
```

### 5.2 Component-by-Component Migration

#### 5.2.1 Templates Migration

**Source**: `.bmad-core/templates/*.yaml`
**Target**: Cloud Storage `gs://bmad-templates/`

**Migration Script**:
```python
#!/usr/bin/env python3
# migrate-templates.py

from google.cloud import storage
import yaml
import os

def migrate_templates():
    """Upload all templates to Cloud Storage."""
    
    storage_client = storage.Client()
    bucket = storage_client.bucket('bmad-templates')
    
    template_dir = '.bmad-core/templates'
    templates_migrated = 0
    
    for filename in os.listdir(template_dir):
        if not filename.endswith('.yaml'):
            continue
        
        filepath = os.path.join(template_dir, filename)
        
        # Read and validate template
        with open(filepath, 'r') as f:
            template_data = yaml.safe_load(f)
        
        # Validate schema
        if not validate_template(template_data):
            print(f"❌ Template {filename} failed validation")
            continue
        
        # Upload to Cloud Storage
        blob = bucket.blob(f'templates/{filename}')
        blob.upload_from_filename(filepath)
        blob.metadata = {
            'template_id': template_data.get('id'),
            'version': template_data.get('version', '1.0'),
            'migrated_at': datetime.utcnow().isoformat()
        }
        blob.patch()
        
        templates_migrated += 1
        print(f"✅ Migrated template: {filename}")
    
    print(f"\nTotal templates migrated: {templates_migrated}")

if __name__ == '__main__':
    migrate_templates()
```

#### 5.2.2 Project Configuration Migration

**Source**: `core-config.yaml` (per project)
**Target**: Firestore `/projects/{projectId}/config`

**Migration Script**:
```python
#!/usr/bin/env python3
# migrate-project-config.py

from google.cloud import firestore
import yaml

def migrate_project_config(project_id, config_path='core-config.yaml'):
    """Migrate project configuration to Firestore."""
    
    db = firestore.Client()
    
    # Read config file
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    # Transform config to Firestore schema
    firestore_config = {
        'project_id': project_id,
        'project_name': config.get('project', {}).get('name'),
        'project_type': config.get('project', {}).get('type'),  # greenfield/brownfield
        'paths': {
            'docs': config.get('paths', {}).get('docs', 'docs/'),
            'stories': config.get('paths', {}).get('stories', 'docs/stories/'),
            'gates': config.get('paths', {}).get('gates', 'docs/qa-gates/')
        },
        'options': {
            'interactive_mode': config.get('options', {}).get('interactiveMode', True),
            'auto_shard': config.get('options', {}).get('autoShard', True),
            'story_validation': config.get('options', {}).get('storyValidation', False)
        },
        'metadata': {
            'migrated_at': firestore.SERVER_TIMESTAMP,
            'migrated_from': 'file-based',
            'original_config_path': config_path
        }
    }
    
    # Write to Firestore
    project_ref = db.collection('projects').document(project_id)
    project_ref.set({
        'config': firestore_config,
        'created_at': firestore.SERVER_TIMESTAMP,
        'status': 'active'
    })
    
    print(f"✅ Migrated config for project: {project_id}")
```

#### 5.2.3 Story Migration

**Source**: `docs/stories/*.md`
**Target**: Firestore `/projects/{id}/stories/` + Cloud Storage `gs://bmad-artifacts/{projectId}/stories/`

**Migration Script**:
```python
#!/usr/bin/env python3
# migrate-stories.py

from google.cloud import firestore, storage
import os
import re
import yaml

def parse_story_frontmatter(content):
    """Extract YAML frontmatter from story markdown."""
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if match:
        frontmatter_str = match.group(1)
        body = match.group(2)
        frontmatter = yaml.safe_load(frontmatter_str)
        return frontmatter, body
    return {}, content

def migrate_story(project_id, story_path):
    """Migrate a single story to Firestore + Cloud Storage."""
    
    db = firestore.Client()
    storage_client = storage.Client()
    bucket = storage_client.bucket('bmad-artifacts')
    
    # Read story file
    with open(story_path, 'r') as f:
        content = f.read()
    
    frontmatter, body = parse_story_frontmatter(content)
    
    story_id = frontmatter.get('id')  # e.g., "1.1"
    if not story_id:
        print(f"❌ Story {story_path} has no ID")
        return False
    
    # Store metadata in Firestore
    story_ref = db.collection('projects').document(project_id).collection('stories').document(story_id)
    story_ref.set({
        'story_id': story_id,
        'epic': story_id.split('.')[0] if '.' in story_id else story_id,
        'title': frontmatter.get('title', ''),
        'status': frontmatter.get('status', 'draft'),  # draft/approved/in_progress/review/done
        'type': frontmatter.get('type', 'fullstack'),  # backend/frontend/fullstack
        'owner': frontmatter.get('owner', 'sm-agent'),
        'created_at': frontmatter.get('createdAt'),
        'updated_at': firestore.SERVER_TIMESTAMP,
        'gcs_path': f'gs://bmad-artifacts/{project_id}/stories/{story_id}.md',
        'metadata': {
            'migrated_at': firestore.SERVER_TIMESTAMP,
            'original_path': story_path
        }
    })
    
    # Store full content in Cloud Storage
    blob = bucket.blob(f'{project_id}/stories/{story_id}.md')
    blob.upload_from_string(content, content_type='text/markdown')
    
    print(f"✅ Migrated story: {story_id}")
    return True

def migrate_all_stories(project_id, stories_dir='docs/stories'):
    """Migrate all stories for a project."""
    
    migrated_count = 0
    failed_count = 0
    
    for filename in os.listdir(stories_dir):
        if not filename.endswith('.md'):
            continue
        
        story_path = os.path.join(stories_dir, filename)
        if migrate_story(project_id, story_path):
            migrated_count += 1
        else:
            failed_count += 1
    
    print(f"\n✅ Stories migrated: {migrated_count}")
    print(f"❌ Stories failed: {failed_count}")
```

#### 5.2.4 QA Gate Migration

**Source**: `docs/qa-gates/*.md`
**Target**: Firestore `/projects/{id}/gates/`

**Migration Script**:
```python
#!/usr/bin/env python3
# migrate-gates.py

from google.cloud import firestore
import os
import re

def parse_gate_file(content):
    """Parse gate decision from markdown file."""
    
    # Extract decision (PASS/FAIL/CONCERNS/WAIVED)
    decision_match = re.search(r'Decision:\s*\*\*(\w+)\*\*', content)
    decision = decision_match.group(1) if decision_match else 'UNKNOWN'
    
    # Extract rationale
    rationale_match = re.search(r'Rationale:\s*\n(.+?)(?:\n\n|\Z)', content, re.DOTALL)
    rationale = rationale_match.group(1).strip() if rationale_match else ''
    
    # Extract story ID
    story_match = re.search(r'Story:\s*(\d+\.\d+)', content)
    story_id = story_match.group(1) if story_match else None
    
    return {
        'decision': decision,
        'rationale': rationale,
        'story_id': story_id
    }

def migrate_gate(project_id, gate_path):
    """Migrate a single QA gate to Firestore."""
    
    db = firestore.Client()
    
    # Read gate file
    with open(gate_path, 'r') as f:
        content = f.read()
    
    gate_data = parse_gate_file(content)
    
    if not gate_data['story_id']:
        print(f"❌ Gate {gate_path} has no story ID")
        return False
    
    # Generate gate ID: {story_id}-{slug}
    filename = os.path.basename(gate_path)
    gate_id = filename.replace('.md', '')
    
    # Store in Firestore
    gate_ref = db.collection('projects').document(project_id).collection('gates').document(gate_id)
    gate_ref.set({
        'gate_id': gate_id,
        'story_id': gate_data['story_id'],
        'decision': gate_data['decision'].lower(),  # pass/fail/concerns/waived
        'rationale': gate_data['rationale'],
        'created_by': 'qa-agent',
        'created_at': firestore.SERVER_TIMESTAMP,
        'metadata': {
            'migrated_at': firestore.SERVER_TIMESTAMP,
            'original_path': gate_path
        }
    })
    
    # Update story with gate reference
    story_ref = db.collection('projects').document(project_id).collection('stories').document(gate_data['story_id'])
    story_ref.update({
        'gate_id': gate_id,
        'gate_decision': gate_data['decision'].lower(),
        'updated_at': firestore.SERVER_TIMESTAMP
    })
    
    print(f"✅ Migrated gate: {gate_id}")
    return True
```

### 5.3 Data Validation

**Validation Checklist**:
```python
#!/usr/bin/env python3
# validate-migration.py

from google.cloud import firestore, storage
import os

def validate_project_migration(project_id, source_dir='docs/'):
    """Validate that all project data was migrated correctly."""
    
    db = firestore.Client()
    storage_client = storage.Client()
    
    validation_results = {
        'project_config': False,
        'stories_count': 0,
        'gates_count': 0,
        'data_integrity': False
    }
    
    # 1. Validate project config exists
    project_ref = db.collection('projects').document(project_id)
    project_doc = project_ref.get()
    if project_doc.exists:
        validation_results['project_config'] = True
        print("✅ Project config found in Firestore")
    else:
        print("❌ Project config NOT found in Firestore")
        return validation_results
    
    # 2. Validate story count
    stories_dir = os.path.join(source_dir, 'stories')
    file_story_count = len([f for f in os.listdir(stories_dir) if f.endswith('.md')])
    
    firestore_stories = project_ref.collection('stories').stream()
    firestore_story_count = sum(1 for _ in firestore_stories)
    
    if file_story_count == firestore_story_count:
        validation_results['stories_count'] = firestore_story_count
        print(f"✅ Story count matches: {firestore_story_count}")
    else:
        print(f"❌ Story count mismatch: file={file_story_count}, firestore={firestore_story_count}")
        return validation_results
    
    # 3. Validate gate count
    gates_dir = os.path.join(source_dir, 'qa-gates')
    if os.path.exists(gates_dir):
        file_gate_count = len([f for f in os.listdir(gates_dir) if f.endswith('.md')])
        
        firestore_gates = project_ref.collection('gates').stream()
        firestore_gate_count = sum(1 for _ in firestore_gates)
        
        if file_gate_count == firestore_gate_count:
            validation_results['gates_count'] = firestore_gate_count
            print(f"✅ Gate count matches: {firestore_gate_count}")
        else:
            print(f"❌ Gate count mismatch: file={file_gate_count}, firestore={firestore_gate_count}")
            return validation_results
    
    # 4. Validate data integrity (checksums)
    integrity_passed = validate_content_checksums(project_id, source_dir)
    validation_results['data_integrity'] = integrity_passed
    
    if integrity_passed:
        print("✅ Data integrity validated (checksums match)")
    else:
        print("❌ Data integrity failed (checksums DO NOT match)")
    
    return validation_results
```

---

## 6. Agent Migration

### 6.1 Agent Migration Strategy

**Agents to Migrate**: 10 (Analyst, PM, UX Expert, Architect, PO, SM, Dev, QA, BMad-Master, BMad-Orchestrator)

**Migration Approach**:
1. Convert agent YAML configs to Vertex AI Agent Builder format
2. Deploy agents to Vertex AI
3. Test agent invocation via API
4. Validate agent outputs match file-based system

**Agent Deployment Order** (by priority):
1. **PM** (most used for planning)
2. **SM** (story creation)
3. **Dev** (implementation)
4. **QA** (reviews and gates)
5. **Architect** (architecture docs)
6. **PO** (validation)
7. **Analyst** (research)
8. **UX Expert** (front-end)
9. **BMad-Master** (universal executor)
10. **BMad-Orchestrator** (web platform)

### 6.2 Agent Deployment Procedures

See [agent-configurations/](agent-configurations/) for complete agent configs.

**Deployment Script**:
```bash
#!/bin/bash
# deploy-agent.sh

AGENT_ID=$1  # e.g., "pm", "sm", "dev"
CONFIG_FILE="agent-configurations/${AGENT_ID}.yaml"

echo "Deploying agent: $AGENT_ID"

# 1. Validate agent config
python3 scripts/validate-agent-config.py --config $CONFIG_FILE
if [ $? -ne 0 ]; then
  echo "❌ Agent config validation failed"
  exit 1
fi

# 2. Deploy to Vertex AI Agent Builder
gcloud alpha ai agents create $AGENT_ID \
  --region=us-central1 \
  --display-name="${AGENT_ID}-agent" \
  --config=$CONFIG_FILE

# 3. Store agent endpoint in Firestore
python3 scripts/store-agent-endpoint.py --agent-id $AGENT_ID

# 4. Test agent invocation
python3 scripts/test-agent.py --agent-id $AGENT_ID

echo "✅ Agent $AGENT_ID deployed successfully"
```

---

## 7. Workflow Migration

### 7.1 Workflow Migration Strategy

**Workflows to Migrate**: 8 complex workflows (create-next-story, review-story, risk-profile, test-design, apply-qa-fixes, validate-next-story, execute-checklist, shard-doc)

**Migration Approach**:
1. Rewrite workflow logic in Python using Google ADK WorkflowAgent pattern
2. Deploy to Vertex AI Reasoning Engine
3. Test workflow execution end-to-end
4. Validate outputs match file-based system

See [reasoning-engine-workflows/](reasoning-engine-workflows/) for complete workflow implementations.

### 7.2 Workflow Deployment Procedures

**Deployment Script**:
```bash
#!/bin/bash
# deploy-workflow.sh

WORKFLOW_NAME=$1  # e.g., "create-next-story"
WORKFLOW_FILE="reasoning-engine-workflows/${WORKFLOW_NAME}.py"

echo "Deploying workflow: $WORKFLOW_NAME"

# 1. Deploy to Reasoning Engine
gcloud ai reasoning-engines deploy $WORKFLOW_FILE \
  --region=us-central1 \
  --staging-bucket=gs://bmad-reasoning-engine-staging

# 2. Store workflow endpoint in Firestore
python3 scripts/store-workflow-endpoint.py --workflow-name $WORKFLOW_NAME

# 3. Test workflow execution
python3 scripts/test-workflow.py --workflow-name $WORKFLOW_NAME

echo "✅ Workflow $WORKFLOW_NAME deployed successfully"
```

---

## 8. User Migration and Training

### 8.1 Training Program

**Training Tiers**:

**Tier 1: Basic Training** (all users, 1 hour)
- Cloud platform overview
- Web UI navigation
- Basic agent invocation
- Where to get help

**Tier 2: Intermediate Training** (power users, 2 hours)
- API usage basics
- IDE plugin setup and configuration
- Advanced agent workflows
- Troubleshooting common issues

**Tier 3: Advanced Training** (admins/DevOps, 4 hours)
- Cloud administration
- Deployment procedures
- Monitoring and observability
- Cost management
- Backup and recovery

### 8.2 Training Materials

**Documentation**:
- User guides (cloud-first workflows)
- API reference documentation
- Video tutorials (5-10 min each)
- Quick start guides (1-pagers)
- FAQs and troubleshooting

**Training Schedule**:
- **Week 4** (before pilot): Train pilot teams (Tier 1 + Tier 2)
- **Week 8** (before rollout): Train all users (Tier 1)
- **Week 9-11** (during rollout): Just-in-time training per team
- **Week 12** (post-migration): Advanced training for admins (Tier 3)

---

## 9. Rollback Procedures

### 9.1 Rollback Triggers

**When to Rollback**:
- Data loss detected (missing stories, gates, artifacts)
- Data corruption (invalid state, broken references)
- Critical cloud service outage (Firestore, Vertex AI down > 1 hour)
- Migration failure rate > 10%
- User request (team unable to continue work)

### 9.2 Rollback Procedures

#### 9.2.1 Project-Level Rollback

**Rollback Single Project**:
```bash
#!/bin/bash
# rollback-project.sh

PROJECT_ID=$1
REASON=$2

echo "Rolling back project: $PROJECT_ID"
echo "Reason: $REASON"

# 1. Switch sync mode to file-first
./scripts/configure-file-first.sh --project-id $PROJECT_ID

# 2. Sync cloud → file (ensure file system has latest data)
./scripts/sync-cloud-to-file.sh --project-id $PROJECT_ID --force

# 3. Verify file system integrity
./scripts/verify-file-integrity.sh --project-id $PROJECT_ID
if [ $? -ne 0 ]; then
  echo "❌ File integrity verification failed"
  echo "Manual intervention required"
  exit 1
fi

# 4. Disable cloud-first mode
./scripts/disable-cloud-first.sh --project-id $PROJECT_ID

# 5. Notify team
./scripts/notify-team.sh --project-id $PROJECT_ID \
  --message "Project rolled back to file-based mode. Reason: $REASON"

# 6. Log rollback
./scripts/log-rollback.sh --project-id $PROJECT_ID --reason "$REASON"

echo "✅ Project $PROJECT_ID rolled back to file-based mode"
echo "Downtime: 0 seconds (seamless rollback)"
```

#### 9.2.2 System-Wide Rollback

**Rollback All Projects** (emergency only):
```bash
#!/bin/bash
# rollback-all-projects.sh

REASON=$1

echo "⚠️ SYSTEM-WIDE ROLLBACK INITIATED"
echo "Reason: $REASON"

# 1. Pause all ongoing migrations
./scripts/pause-migrations.sh

# 2. Switch all projects to file-first
./scripts/configure-file-first.sh --all-projects

# 3. Sync all cloud data to files
./scripts/sync-cloud-to-file.sh --all-projects --force

# 4. Verify all file systems
./scripts/verify-all-files.sh

# 5. Disable cloud-first for all projects
./scripts/disable-cloud-first.sh --all-projects

# 6. Notify all users
./scripts/notify-all-users.sh --message "System rolled back to file-based mode. Reason: $REASON"

# 7. Generate rollback report
./scripts/generate-rollback-report.sh --reason "$REASON"

echo "✅ All projects rolled back to file-based mode"
```

### 9.3 Rollback Recovery

**Post-Rollback Actions**:
1. Investigate root cause
2. Fix identified issues
3. Test fixes in staging
4. Plan re-migration (if applicable)
5. Communicate updated timeline

---

## 10. Success Criteria and Validation

### 10.1 Success Metrics

See [Section 3.4: Success Criteria Definition](#34-success-criteria-definition) for complete criteria.

**Summary**:
- ✅ 100% data integrity
- ✅ 95%+ project migration rate
- ✅ 90%+ user adoption
- ✅ Performance within 2x of file-based baseline
- ✅ 99.9%+ uptime
- ✅ Costs within 20% of projections
- ✅ 80%+ user satisfaction
- ✅ < 5% rollback rate

### 10.2 Validation Procedures

**Automated Validation** (runs continuously):
```python
#!/usr/bin/env python3
# continuous-validation.py

def run_continuous_validation():
    """Run validation checks every hour during migration."""
    
    while migration_in_progress():
        # 1. Data integrity check
        integrity_ok = check_data_integrity()
        
        # 2. Performance check
        performance_ok = check_performance_metrics()
        
        # 3. Availability check
        availability_ok = check_system_availability()
        
        # 4. Cost check
        cost_ok = check_cost_projections()
        
        # 5. User feedback check
        feedback_ok = check_user_feedback()
        
        # Alert if any check fails
        if not all([integrity_ok, performance_ok, availability_ok, cost_ok, feedback_ok]):
            send_alert("Validation check failed")
        
        # Wait 1 hour
        time.sleep(3600)
```

---

## 11. Risk Management

### 11.1 Risk Register

See [Section 3.3: Risk Assessment](#33-risk-assessment) for complete risk matrix.

**Top 5 Risks** (by risk score):
1. User Resistance/Low Adoption (Risk Score: 9)
2. Performance Degradation (Risk Score: 9)
3. Migration Timeline Delays (Risk Score: 9)
4. Data Inconsistency Between Systems (Risk Score: 8)
5. Integration Failures (Risk Score: 8)

### 11.2 Risk Mitigation

**Active Mitigation** (during migration):
- Real-time sync monitoring and automated reconciliation
- Performance dashboards with alerting
- User feedback collection and rapid response
- Comprehensive training and support
- Buffer time in schedule

**Contingency Plans**:
- Rollback procedures tested and ready
- Support team on standby during critical phases
- Budget contingency (20% buffer)
- Timeline contingency (2-week buffer)

---

## 12. Timeline and Resources

### 12.1 Detailed Timeline

**Total Duration**: 10-14 weeks (70-98 days)

| Phase | Start | End | Duration | Key Milestones |
|-------|-------|-----|----------|----------------|
| **Phase 0: Pre-Migration** | Week -2 | Week 0 | 2 weeks | Assessment complete, team trained |
| **Phase 1: Parallel Infrastructure** | Week 1 | Week 2 | 2 weeks | Cloud deployed, sync operational |
| **Phase 2: Shadow Mode** | Week 3 | Week 5 | 3 weeks | Data validated, performance benchmarked |
| **Phase 3: Pilot Program** | Week 6 | Week 8 | 3 weeks | Pilot successful, feedback incorporated |
| **Phase 4: Gradual Rollout** | Week 9 | Week 11 | 3 weeks | 95%+ projects migrated |
| **Phase 5: Cloud-Primary** | Week 12 | Week 12 | 1 week | Cloud is source of truth |
| **Phase 6: Decommissioning** | Week 13 | Week 14 | 2 weeks | File system archived, migration complete |

### 12.2 Resource Requirements

**Team Composition**:
- **Migration Lead**: 1 FTE (full duration)
- **Cloud Architects**: 1-2 FTE (weeks 1-6, then 0.5 FTE)
- **DevOps Engineers**: 2 FTE (weeks 1-8, then 0.5 FTE)
- **Application Developers**: 1-2 FTE (weeks 3-10)
- **QA/Testing**: 1 FTE (weeks 2-10)
- **Training/Support**: 1 FTE (weeks 4-14)
- **Product Manager**: 0.5 FTE (full duration)

**Total Effort**: ~60-80 person-weeks (15-20 person-months)

### 12.3 Budget

| Category | Estimated Cost |
|----------|----------------|
| GCP Infrastructure (one-time) | $500-$1,000 |
| GCP Monthly Costs (during migration) | $1,000-$2,000 (4 months) |
| Tooling/Software | $500-$1,000 |
| Training Materials | $1,000-$2,000 |
| Contingency (20%) | $1,000-$2,000 |
| **TOTAL** | **$5,000-$10,000** |

**Note**: Does not include personnel costs (salaries).

---

## 13. Appendices

### Appendix A: Migration Checklist

**Phase 0: Pre-Migration**
- [ ] Infrastructure assessment complete
- [ ] User survey sent and analyzed
- [ ] Risk register complete
- [ ] Migration team trained
- [ ] Go/No-Go decision: GO

**Phase 1: Parallel Infrastructure**
- [ ] GCP project created
- [ ] Firestore and Cloud Storage configured
- [ ] Sync service deployed
- [ ] Bidirectional sync working
- [ ] Test project migrated successfully

**Phase 2: Shadow Mode**
- [ ] Shadow mode operational for 2+ weeks
- [ ] Consistency ≥ 99.9%
- [ ] Performance ≤ 2x file-based baseline
- [ ] Load test passed (< 0.1% error rate)
- [ ] All critical issues resolved

**Phase 3: Pilot Program**
- [ ] 2-3 pilot projects selected
- [ ] Pilot teams trained
- [ ] Pilot projects migrated to cloud-first
- [ ] User feedback ≥ 7/10
- [ ] Go/No-Go decision: GO

**Phase 4: Gradual Rollout**
- [ ] 95%+ projects migrated
- [ ] Rollback rate < 5%
- [ ] API success rate ≥ 99.5%
- [ ] Support burden manageable

**Phase 5: Cloud-Primary**
- [ ] Cloud is primary for all projects
- [ ] File system is read-only
- [ ] Performance optimized
- [ ] Costs within 20% of projections

**Phase 6: Decommissioning**
- [ ] File system archived
- [ ] Sync infrastructure decommissioned
- [ ] Documentation updated
- [ ] Post-migration review complete
- [ ] Migration declared complete ✅

### Appendix B: Key Contacts

**Migration Team**:
- **Migration Lead**: [Name] - [Email] - [Phone]
- **Cloud Architect**: [Name] - [Email] - [Phone]
- **DevOps Lead**: [Name] - [Email] - [Phone]
- **Training Lead**: [Name] - [Email] - [Phone]
- **Product Manager**: [Name] - [Email] - [Phone]

**Support Channels**:
- **Slack**: #bmad-migration-support
- **Email**: support@bmad.example.com
- **Emergency Hotline**: [Phone Number]
- **Office Hours**: Daily 10am-12pm, 2pm-4pm

### Appendix C: References

**Related Documents**:
- [Architecture Design](architecture-design.md)
- [Storage Schema](storage-schema.md)
- [Deployment Guide](deployment-guide.md)
- [API Specifications](api-specifications.md)
- [Agent Configurations](agent-configurations/)
- [Reasoning Engine Workflows](reasoning-engine-workflows/)

**External Resources**:
- Google ADK Documentation: https://google.github.io/adk-docs/
- Vertex AI Documentation: https://cloud.google.com/vertex-ai/docs
- Firestore Documentation: https://cloud.google.com/firestore/docs
- Cloud Storage Documentation: https://cloud.google.com/storage/docs

---

**Document Version**: 1.0
**Created**: 2025-10-15
**Status**: Complete
**Phase**: Phase 6 - Task 6.7
**Authors**: BMad Migration Team
**Last Updated**: 2025-10-15

---

**END OF MIGRATION STRATEGY DOCUMENT**

