# BMad Framework - Google ADK Architecture Design

**Document Version**: 1.1
**Created**: 2025-10-14
**Last Updated**: 2025-10-15
**Status**: Complete
**Framework**: BMad Core v4 → Google Agent Development Kit (google-adk) + Vertex AI Services

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Introduction](#2-introduction)
   - 2.1 [Purpose of This Document](#21-purpose-of-this-document)
   - 2.2 [Document Scope](#22-document-scope)
   - 2.3 [Background: The BMad Framework](#23-background-the-bmad-framework)
   - **2.3.1 [Understanding Google's Agent Development Kit](#231-understanding-googles-agent-development-kit-google-adk)** ⭐ NEW
   - 2.4 [Design Principles](#24-design-principles)
   - 2.5 [Key Architectural Challenges and Solutions](#25-key-architectural-challenges-and-solutions)
   - 2.6 [Architecture Documentation Structure](#26-architecture-documentation-structure)
3. [System Architecture Overview](#3-system-architecture-overview)
4. [Component Mapping: BMad → GCP Services](#4-component-mapping-bmad--gcp-services)
5. [Agent Architecture (Google ADK + Vertex AI Agent Builder)](#5-agent-architecture-google-adk--vertex-ai-agent-builder)
6. [Workflow Orchestration](#6-workflow-orchestration)
7. [Data Storage Strategy](#7-data-storage-strategy)
8. [API Gateway Design](#8-api-gateway-design)
9. [Security and Authentication](#9-security-and-authentication)
10. [Scalability and Performance](#10-scalability-and-performance)
11. [Cost Optimization Strategies](#11-cost-optimization-strategies)
12. [Migration Approach](#12-migration-approach)
13. [Appendices](#13-appendices)

---

## 1. Executive Summary

### 1.1 Project Overview

This document presents a comprehensive architecture design for reproducing the BMad (Business Methodology for Agile Development) framework using **Google's Agent Development Kit (google-adk)** and supporting Google Cloud Platform (GCP) services.

**What is Google ADK?** Google's Agent Development Kit (google-adk) is an open-source framework developed by Google for building and deploying AI agents. It is Google's official framework for agent development, installable via `pip install google-adk`. See Section 2.3.1 for detailed explanation.

BMad is a sophisticated AI-driven development methodology that orchestrates 10 specialized AI agents through 23 task workflows to support both greenfield and brownfield software development projects. The framework currently operates through a file-based, IDE-integrated approach with agents defined as YAML-in-markdown configurations.

The proposed Google ADK architecture transforms BMad from a file-based, IDE-centric system into a cloud-native, API-driven platform while preserving all core capabilities and workflows.

### 1.2 Key Design Decisions

| Area | Current BMad Approach | Proposed ADK Approach | Rationale |
|------|----------------------|----------------------|-----------|
| **Agent Hosting** | Markdown files with YAML config | Vertex AI Agent Builder | Native agent lifecycle, managed execution, built-in tools |
| **State Management** | File-based (markdown/YAML) | Firestore + Cloud Storage | Queryable state, concurrent access, scalable persistence |
| **Workflow Execution** | Sequential task instructions | Reasoning Engine + Cloud Workflows | Intelligent decision logic, resumable workflows, monitoring |
| **Artifact Storage** | Local file system (docs/) | Cloud Storage + Firestore | Versioning, concurrent access, global availability |
| **Configuration** | core-config.yaml (per project) | Firestore collections | Dynamic updates, multi-project support, centralized management |
| **API Access** | IDE-based (file operations) | Cloud Run + Cloud Functions | RESTful API, scalable, secure, authenticated |
| **Collaboration** | File-based handoffs | Event-driven + direct API calls | Real-time updates, parallel execution, orchestration |

### 1.3 Architecture Highlights

**Cloud-Native Design**
- Fully serverless architecture leveraging managed GCP services
- Auto-scaling based on demand (agents, workflows, functions)
- Global distribution capability with regional deployments
- No infrastructure management required

**Preserved BMad Capabilities**
- All 10 agents with complete persona and instruction sets
- All 23 task workflows with decision logic intact
- All 13 templates with rendering and validation
- All 6 workflow types (3 greenfield, 3 brownfield)
- Quality gates, checklists, and validation frameworks
- Knowledge base (KB) mode with RAG integration

**Enhanced Capabilities**
- RESTful API for programmatic access
- Web UI and IDE integration support
- Concurrent multi-project execution
- Real-time collaboration across agents
- Advanced monitoring and observability
- Automated scaling and cost optimization
- Version control for all artifacts
- Audit logging for compliance

### 1.4 Target Deployment Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Web UI     │  │  IDE Plugin  │  │ REST API     │             │
│  │  (React)     │  │ (VSCode/etc) │  │  Clients     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                            │
│                       (Cloud Run + Apigee)                          │
│                                                                      │
│  • Authentication & Authorization                                   │
│  • Rate Limiting & Throttling                                       │
│  • Request Routing & Load Balancing                                 │
│  • API Versioning                                                   │
└────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Orchestration│    │  Agent       │    │  Workflow    │
│  Service     │    │  Service     │    │  Service     │
│ (Cloud Run)  │    │ (Cloud Run)  │    │ (Cloud Run)  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                      EXECUTION LAYER                                │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Vertex AI    │  │  Reasoning   │  │    Cloud     │             │
│  │ Agent Builder│  │   Engine     │  │  Functions   │             │
│  │ (10 Agents)  │  │ (Workflows)  │  │   (Tasks)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Firestore   │    │Cloud Storage │    │ Vertex AI    │
│  (Metadata)  │    │ (Artifacts)  │    │   Search     │
│              │    │              │    │  (KB/RAG)    │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 1.5 Implementation Timeline

The architecture can be implemented in **7-10 weeks** following this phased approach:

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1: Infrastructure** | 1-2 weeks | GCP project, IAM, networking, base services |
| **Phase 2: Storage & APIs** | 1 week | Firestore schema, Cloud Storage buckets, base APIs |
| **Phase 3: Agent Migration** | 2-3 weeks | Convert 10 agents to Vertex AI format, test individually |
| **Phase 4: Workflow Implementation** | 2-3 weeks | Implement 8 complex workflows in Reasoning Engine |
| **Phase 5: Integration & Testing** | 1-2 weeks | End-to-end testing, performance optimization |
| **Phase 6: Pilot & Rollout** | 1 week | Pilot projects, user training, production launch |

### 1.6 Cost Estimates

**Monthly Operational Costs (at scale)**

| Service | Estimated Usage | Cost Range |
|---------|----------------|------------|
| Vertex AI Agents | 10 agents × ~1000 requests/day | $300-$500 |
| Reasoning Engine | ~500 workflow executions/day | $100-$200 |
| Cloud Functions | ~2000 invocations/day | $20-$50 |
| Cloud Run | 3 services, auto-scaled | $50-$150 |
| Firestore | 100K reads, 50K writes/day | $30-$80 |
| Cloud Storage | 100GB storage, moderate I/O | $10-$30 |
| Vertex AI Search (KB Mode) | ~200 queries/day | $40-$100 |
| Networking & Misc | Data transfer, logging | $30-$70 |
| **TOTAL** | | **$580-$1,180/month** |

*Note: Costs scale with usage. Early adoption/pilot phase costs will be significantly lower ($100-$300/month).*

### 1.7 Key Benefits

**For Organizations:**
- Reduced time-to-market for software projects (30-50% faster)
- Standardized development methodology across teams
- Improved code quality through systematic QA gates
- Better compliance and audit trail (all decisions logged)
- Scalable across multiple concurrent projects

**For Development Teams:**
- Consistent, AI-guided workflows from planning to deployment
- Reduced context switching (AI agents handle specialized tasks)
- Comprehensive test coverage through automated test design
- Clear handoffs and accountability (agent ownership model)
- Knowledge preservation (KB mode, documented decisions)

**For Technical Leadership:**
- Cloud-native, managed infrastructure (no ops burden)
- API-first design enables custom integrations
- Comprehensive observability and monitoring
- Predictable, usage-based pricing
- Vendor-supported platform (Google Cloud)

---

## 2. Introduction

### 2.1 Purpose of This Document

This architecture design document serves as the comprehensive technical blueprint for implementing the BMad framework using **Google's Agent Development Kit (google-adk)** and Google Cloud Platform services.

**Note**: Throughout this document, "ADK" refers specifically to Google's open-source Agent Development Kit (pip install google-adk), NOT generic agent development concepts or third-party frameworks like LangChain or CrewAI.

**Target Audiences:**
- **Cloud Architects**: Understand system design, service integration, scalability
- **Engineering Leads**: Assess implementation feasibility, timeline, resource requirements
- **DevOps Engineers**: Plan deployment, infrastructure-as-code, monitoring
- **Product Managers**: Understand capabilities, limitations, cost implications
- **Decision Makers**: Evaluate strategic fit, ROI, migration path

### 2.2 Document Scope

**In Scope:**
- Complete system architecture design
- Component-by-component mapping (BMad → GCP)
- Agent configuration approach (Vertex AI Agent Builder)
- Workflow orchestration patterns (Reasoning Engine, Cloud Workflows)
- Data storage schema (Firestore, Cloud Storage)
- API design (RESTful endpoints, authentication)
- Security and compliance considerations
- Scalability and performance strategies
- Cost modeling and optimization
- Migration approach and timeline

**Out of Scope:**
- Detailed implementation code (covered in Task 6.3: Reasoning Engine Workflows)
- Specific agent configurations (covered in Task 6.2: Agent Configurations)
- API specifications (covered in Task 6.4: API Specifications)
- Storage schemas (covered in Task 6.5: Storage Schema Design)
- Deployment procedures (covered in Task 6.6: Deployment Guide)
- Infrastructure-as-code (covered in Task 6.8: Terraform)

### 2.3 Background: The BMad Framework

**What is BMad?**

BMad (Business Methodology for Agile Development) is an AI-driven framework that orchestrates specialized AI agents through structured workflows to support the complete software development lifecycle.

**Key Statistics:**
- **10 Specialized Agents**: Analyst, PM, UX Expert, Architect, PO, SM, Dev, QA, BMad-Master, BMad-Orchestrator
- **23 Task Workflows**: From brainstorming to QA gate validation
- **13 Document Templates**: Project briefs, PRDs, architectures, stories, gates
- **6 Workflow Types**: 3 greenfield (new projects) + 3 brownfield (existing codebases)
- **6 Quality Checklists**: Systematic validation at each stage

**Current Architecture:**
- File-based state management (markdown/YAML files)
- IDE-integrated execution (Claude Code, Cursor, Windsurf, etc.)
- Agent definitions as YAML-in-markdown configurations
- Lazy dependency loading (tasks, templates, checklists loaded on-demand)
- Git-based versioning and audit trail

**Why Migrate to Google ADK?**

1. **Scalability**: File-based approach doesn't scale across teams/projects
2. **Collaboration**: Real-time multi-agent collaboration requires cloud infrastructure
3. **API Access**: Programmatic access for integrations (CI/CD, ticketing systems)
4. **Managed Services**: Reduce operational burden, leverage Google's expertise
5. **Advanced Features**: Reasoning Engine, RAG, enterprise search capabilities
6. **Monitoring**: Production-grade observability and performance tracking

### 2.3.1 Understanding Google's Agent Development Kit (Google ADK)

**What is Google ADK?**

Google's Agent Development Kit (google-adk) is an open-source framework developed by Google for building and deploying AI agents. It is the official Google framework for agent development, analogous to how Vertex AI is Google's official ML platform.

**Important Distinction**: Throughout this document, "ADK" refers specifically to **Google's Agent Development Kit** - not generic agent development concepts or frameworks like LangChain, LlamaIndex, or CrewAI.

**Key Characteristics**:
- **Model-Agnostic**: Works with multiple LLM providers (not just Gemini)
- **Deployment-Agnostic**: Deploy locally, to Vertex AI, Cloud Run, or containers
- **Modular Design**: Compose agents from tools, workflows, and memory components
- **Enterprise-Ready**: Built for production use with Google Cloud

**Installation**:
```bash
# Python
pip install google-adk

# Java
# Add dependency in pom.xml or build.gradle
```

**Core Concepts**:

1. **Agent Types**:
   - **LLM Agents**: Single agents powered by language models with tools
   - **Workflow Agents**: Orchestrate multi-step processes
     - Sequential: Linear step-by-step execution
     - Parallel: Concurrent task execution
     - Loop: Iterative processes with exit conditions

2. **Tools**: Functions that agents can call
   - Built-in tools: Search, Code Execution
   - Custom tools: Implement domain-specific functionality

3. **Sessions**: Manage conversation state and context

4. **Memory**: Persistent storage for agent learning and context

5. **Callbacks**: Event hooks for monitoring and observability

**Google ADK vs Vertex AI Services**:

| Component | What It Is | Relationship to ADK |
|-----------|-----------|---------------------|
| **google-adk** | Python/Java SDK for building agents | The framework - install via pip/maven |
| **Vertex AI Agent Builder** | UI-based agent configuration tool | Can import Google ADK agent definitions |
| **Vertex AI Agent Engine** | Managed service for running agents | Deploy Google ADK agents here |
| **Vertex AI Reasoning Engine** | Service for complex workflow logic | Used alongside Google ADK for decision workflows |

**Why Google ADK for BMad?**

| Consideration | Google ADK | LangChain | CrewAI |
|--------------|------------|-----------|---------|
| **Native GCP Integration** | ✅ Built for Vertex AI | ⚠️ Third-party | ⚠️ Third-party |
| **Managed Deployment** | ✅ Vertex AI Agent Engine | ❌ Self-managed | ❌ Self-managed |
| **Enterprise Support** | ✅ Google Cloud Support | ❌ Community | ❌ Community |
| **Agent Orchestration** | ✅ Built-in workflows | ✅ Via chains | ✅ Via crews |
| **Model Flexibility** | ✅ Multiple providers | ✅ Multiple providers | ⚠️ Limited |
| **Production Readiness** | ✅ Enterprise-grade | ⚠️ Requires hardening | ⚠️ Emerging |
| **Official Google Status** | ✅ Official framework | ❌ Third-party | ❌ Third-party |

**BMad Implementation Approach**:
- **Individual Agents**: Built using Google ADK's Agent class, deployed to Vertex AI Agent Engine
- **Simple Workflows**: Google ADK WorkflowAgent (sequential/parallel/loop patterns)
- **Complex Workflows**: Vertex AI Reasoning Engine (multi-step decision logic)
- **Orchestration**: Hybrid approach leveraging both Google ADK and Vertex AI services

**Documentation**: https://google.github.io/adk-docs/

### 2.4 Design Principles

The ADK architecture design follows these core principles:

**1. Preserve BMad's Core Philosophy**
- All agent personas, capabilities, and workflows remain intact
- Quality-first approach (gates, checklists, validation) maintained
- User-centric elicitation and interaction patterns preserved
- Flexibility for both greenfield and brownfield projects

**2. Cloud-Native Best Practices**
- Serverless-first (managed services over self-managed)
- Event-driven architecture for loose coupling
- Horizontal scalability (stateless services)
- Infrastructure-as-code for reproducibility
- Security by design (least privilege, encryption)

**3. API-First Design**
- All capabilities exposed via RESTful APIs
- Versioned endpoints for backward compatibility
- Comprehensive documentation (OpenAPI/Swagger)
- Multiple client support (web, IDE plugins, programmatic)

**4. Cost-Conscious Architecture**
- Pay-per-use model (no idle costs)
- Tiered caching to reduce API calls
- Efficient data storage (right-sizing, lifecycle policies)
- Auto-scaling with configurable limits

**5. Operational Excellence**
- Comprehensive logging and monitoring
- Automated deployment pipelines
- Health checks and self-healing
- Disaster recovery and backup strategies

### 2.5 Key Architectural Challenges and Solutions

| Challenge | BMad File-Based Approach | ADK Cloud Approach | Solution Design |
|-----------|-------------------------|-------------------|-----------------|
| **Agent Morphing** | Orchestrator dynamically loads any agent persona | Vertex AI agents are statically defined | Meta-agent pattern: Orchestrator routes to appropriate static agents based on request |
| **File-Based State** | Story status, gates stored in markdown files | Need queryable, concurrent-safe state | Firestore for structured state, Cloud Storage for documents, bidirectional sync |
| **Lazy Loading** | Load tasks/templates on-demand to minimize context | Need efficient resource loading | Cloud Storage with signed URLs, Vertex AI RAG for context retrieval |
| **Sequential Workflows** | Task instructions executed step-by-step by agent | Need resumable, monitorable workflows | Reasoning Engine for complex logic, Cloud Workflows for orchestration |
| **Template Rendering** | YAML-in-markdown parsed and populated by agent | Need server-side template service | Cloud Function template engine with validation |
| **KB Mode** | Load and navigate markdown knowledge base | Need semantic search and retrieval | Vertex AI Search + RAG with document indexing |
| **Section Ownership** | Markdown section headers with metadata | Need permission enforcement | Firestore artifact schema with section-level ACLs |
| **Change Tracking** | Git commit history | Need audit trail | Firestore document versioning + Cloud Logging |

### 2.6 Architecture Documentation Structure

This document is organized as follows:

**Section 3: System Architecture Overview**
- High-level system diagram
- Layer-by-layer breakdown
- Data flow patterns
- Integration points

**Section 4: Component Mapping**
- Detailed BMad → GCP service mapping
- Service selection rationale
- Alternative options considered

**Section 5: Agent Architecture**
- Vertex AI Agent Builder design
- Agent configuration schema
- Tool and function registration
- Persona and context management

**Section 6: Workflow Orchestration**
- Reasoning Engine pattern
- Cloud Workflows pattern
- Hybrid orchestration approach
- State management in workflows

**Section 7: Data Storage Strategy**
- Firestore schema design
- Cloud Storage bucket organization
- Versioning and backup strategies
- Data migration approach

**Section 8: API Gateway Design**
- API endpoint structure
- Authentication and authorization
- Rate limiting and quotas
- Error handling

**Section 9: Security and Authentication**
- Identity and Access Management (IAM)
- API security
- Data encryption (at-rest, in-transit)
- Compliance considerations

**Section 10: Scalability and Performance**
- Auto-scaling strategies
- Performance optimization
- Caching layers
- Load testing approach

**Section 11: Cost Optimization**
- Cost model breakdown
- Optimization strategies
- Budget alerts and controls
- Cost-performance tradeoffs

**Section 12: Migration Approach**
- Migration phases
- Parallel operation strategy
- Data migration procedures
- Rollback plans

---

## 3. System Architecture Overview

### 3.1 High-Level Architecture Diagram

The BMad ADK architecture follows a layered, cloud-native design:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                     │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐               │
│  │   Web UI       │  │  IDE Plugins   │  │  CLI Tools     │               │
│  │                │  │                │  │                │               │
│  │  • Project     │  │  • VSCode Ext  │  │  • bmad-cli    │               │
│  │    Dashboard   │  │  • Cursor Int  │  │  • CI/CD       │               │
│  │  • Agent Chat  │  │  • Windsurf    │  │    Scripts     │               │
│  │  • Artifact    │  │    Support     │  │                │               │
│  │    Viewer      │  │  • File Sync   │  │                │               │
│  └────────────────┘  └────────────────┘  └────────────────┘               │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                                    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │                   Cloud Run (API Gateway)                       │        │
│  │                                                                  │        │
│  │  • Authentication (Firebase Auth / IAM)                         │        │
│  │  • Authorization (Role-based access control)                    │        │
│  │  • Rate Limiting (per-user, per-project quotas)                │        │
│  │  • Request Routing (to appropriate backend services)            │        │
│  │  • API Versioning (/v1/, /v2/)                                 │        │
│  │  • Request/Response Transformation                              │        │
│  │  • Logging & Monitoring                                         │        │
│  └────────────────────────────────────────────────────────────────┘        │
│                                                                              │
│  Optional: Apigee for advanced API management (rate limiting,               │
│            analytics, developer portal)                                     │
└────────────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Orchestration   │  │  Agent Service   │  │ Workflow Service │
│    Service       │  │                  │  │                  │
│  (Cloud Run)     │  │  (Cloud Run)     │  │  (Cloud Run)     │
│                  │  │                  │  │                  │
│  • Multi-agent   │  │  • Agent routing │  │  • Workflow mgmt │
│    coordination  │  │  • Context mgmt  │  │  • State tracking│
│  • Team bundles  │  │  • Session mgmt  │  │  • Resume logic  │
│  • Workflow      │  │  • Tool registry │  │  • Error         │
│    orchestration │  │                  │  │    handling      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                          EXECUTION LAYER                                    │
│                                                                              │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │  Vertex AI      │  │  Vertex AI       │  │  Cloud Functions │          │
│  │  Agent Builder  │  │  Reasoning       │  │                  │          │
│  │                 │  │  Engine          │  │  • Simple tasks  │          │
│  │  10 Agents:     │  │                  │  │  • Template      │          │
│  │  • analyst      │  │  8 Workflows:    │  │    rendering     │          │
│  │  • pm           │  │  • create-next-  │  │  • Validation    │          │
│  │  • ux-expert    │  │    story         │  │  • File ops      │          │
│  │  • architect    │  │  • review-story  │  │  • Utilities     │          │
│  │  • po           │  │  • risk-profile  │  │                  │          │
│  │  • sm           │  │  • test-design   │  │                  │          │
│  │  • dev          │  │  • apply-qa-     │  │                  │          │
│  │  • qa           │  │    fixes         │  │                  │          │
│  │  • bmad-master  │  │  • validate-     │  │                  │          │
│  │  • bmad-        │  │    next-story    │  │                  │          │
│  │    orchestrator │  │  • execute-      │  │                  │          │
│  │                 │  │    checklist     │  │                  │          │
│  │                 │  │  • shard-doc     │  │                  │          │
│  └─────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                              │
│  Tools/Functions registered with agents and accessible from workflows       │
└────────────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        DATA & STORAGE LAYER                                 │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │   Firestore      │  │ Cloud Storage    │  │ Vertex AI Search │         │
│  │                  │  │                  │  │                  │         │
│  │  Collections:    │  │  Buckets:        │  │  • Knowledge     │         │
│  │  • projects      │  │  • bmad-         │  │    base docs     │         │
│  │  • stories       │  │    templates     │  │  • RAG retrieval │         │
│  │  • artifacts     │  │  • bmad-         │  │  • Semantic      │         │
│  │  • gates         │  │    artifacts     │  │    search        │         │
│  │  • workflows     │  │  • bmad-data     │  │                  │         │
│  │  • sessions      │  │  • bmad-kb       │  │                  │         │
│  │  • configs       │  │                  │  │                  │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE & MONITORING LAYER                        │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  Cloud Logging   │  │  Cloud           │  │  Secret Manager  │         │
│  │                  │  │  Monitoring      │  │                  │         │
│  │  • Request logs  │  │                  │  │  • API keys      │         │
│  │  • Agent logs    │  │  • Metrics       │  │  • Credentials   │         │
│  │  • Error logs    │  │  • Dashboards    │  │  • Certificates  │         │
│  │  • Audit logs    │  │  • Alerts        │  │                  │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
└────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Layer-by-Layer Breakdown

#### 3.2.1 Client Layer

**Purpose**: Provide multiple interfaces for users to interact with the BMad framework

**Components**:

1. **Web UI (React/Next.js)**
   - Project dashboard (view all projects, status)
   - Agent chat interface (conversational interaction)
   - Artifact viewer (PRDs, architectures, stories, gates)
   - Workflow progress tracking
   - Team configuration

2. **IDE Plugins**
   - VSCode extension for in-editor BMad access
   - Cursor integration for AI-native development
   - Windsurf support for collaborative coding
   - File synchronization (local ↔ cloud)
   - Story status updates

3. **CLI Tools**
   - `bmad-cli` for command-line operations
   - CI/CD integration scripts
   - Batch operations (create multiple stories, etc.)
   - Project initialization and configuration

**Design Decisions**:
- Web UI as primary interface for planning phase (discovery, PRD, architecture)
- IDE plugins for development phase (story implementation, QA)
- CLI for automation and scripting
- All clients communicate via REST API (no direct database access)

#### 3.2.2 API Gateway Layer

**Purpose**: Secure, scalable, monitored entry point for all client requests

**Components**:

1. **Cloud Run API Gateway Service**
   - Receives all incoming HTTP requests
   - Routes to appropriate backend service
   - Handles authentication (Firebase Auth or IAM)
   - Enforces authorization (RBAC)
   - Implements rate limiting
   - Transforms requests/responses as needed

2. **Optional: Apigee**
   - Advanced API management (if needed)
   - Developer portal for API documentation
   - Analytics and usage tracking
   - Advanced rate limiting and quotas
   - API versioning and lifecycle management

**Key Functions**:
- **Authentication**: Verify user identity (JWT tokens, OAuth)
- **Authorization**: Check user permissions (project access, role)
- **Rate Limiting**: Prevent abuse (per-user, per-project quotas)
- **Request Routing**: Direct to appropriate service (agent, workflow, artifact)
- **Logging**: Record all API calls for audit and debugging

**Endpoints Structure**:
```
/v1/projects/{projectId}/agents/{agentId}/invoke
/v1/projects/{projectId}/workflows/{workflowId}/start
/v1/projects/{projectId}/artifacts/{artifactId}
/v1/projects/{projectId}/stories/{storyId}
/v1/projects/{projectId}/gates/{gateId}
```

#### 3.2.3 Service Layer (Cloud Run Services)

**Purpose**: Business logic for orchestration, agent management, and workflow execution

**Components**:

1. **Orchestration Service**
   - **Responsibility**: Multi-agent coordination, team bundle execution
   - **Functions**:
     - Load and execute team bundles (greenfield-fullstack, etc.)
     - Coordinate agent handoffs (PM → Architect → PO)
     - Manage workflow state transitions
     - Handle complex orchestration logic
   - **Technology**: Cloud Run (Node.js or Python)
   - **Scaling**: Auto-scale based on active workflows

2. **Agent Service**
   - **Responsibility**: Route requests to appropriate Vertex AI agents
   - **Functions**:
     - Maintain agent registry (10 agents)
     - Load agent context (always-loaded files, templates)
     - Manage agent sessions
     - Execute agent tools and functions
   - **Technology**: Cloud Run (Python with Vertex AI SDK)
   - **Scaling**: Auto-scale based on agent invocations

3. **Workflow Service**
   - **Responsibility**: Manage long-running workflow executions
   - **Functions**:
     - Start/resume/cancel workflows
     - Track workflow state in Firestore
     - Handle workflow errors and retries
     - Provide workflow status and history
   - **Technology**: Cloud Run (Python with Vertex AI SDK)
   - **Scaling**: Auto-scale based on active workflows

**Why Cloud Run?**
- Fully managed, serverless platform
- Auto-scales to zero (no idle costs)
- Supports HTTP/2, WebSockets for real-time updates
- Integrated with Cloud Logging and Monitoring
- Easy deployment from containers

#### 3.2.4 Execution Layer

**Purpose**: Execute agent logic, workflow steps, and utility functions

**Components**:

1. **Vertex AI Agent Builder (10 Agents)**
   - Each agent defined with persona, instructions, tools
   - Model: Gemini 2.0 Flash (or Pro for complex reasoning)
   - Context management: Session-based with TTL
   - Tool registration: Cloud Functions as tools
   - Memory: Short-term (session) + long-term (Firestore)

2. **Vertex AI Reasoning Engine (8 Complex Workflows)**
   - Native Vertex AI workflows for multi-step decision logic
   - State persistence in Firestore
   - Resumable from any checkpoint
   - Error handling and retry logic
   - Example workflows:
     - `create-next-story`: 6-step sequential workflow
     - `review-story`: Adaptive QA with refactoring authority
     - `risk-profile`: Probability × impact risk scoring
     - `test-design`: Dual-framework test planning

3. **Cloud Functions (Simple Tasks)**
   - Stateless, single-purpose functions
   - Template rendering
   - Validation logic
   - File operations
   - Utility functions

**Tool Registration Pattern**:
Agents can call Cloud Functions as tools:
```yaml
tools:
  - name: "create_prd"
    description: "Create Product Requirements Document"
    function_ref: "projects/{project}/locations/{location}/functions/create-prd"
```

#### 3.2.5 Data & Storage Layer

**Purpose**: Persist all state, artifacts, and configuration

**Components**:

1. **Firestore (Structured Data)**
   - **Collections**:
     - `projects`: Project metadata and configuration
     - `stories`: Story state (status, tasks, dev notes, QA results)
     - `artifacts`: Artifact metadata (type, version, owner, timestamps)
     - `gates`: QA gate decisions with rationale
     - `workflows`: Workflow state for resumption
     - `sessions`: Agent session context
   - **Query Patterns**:
     - Get all stories for epic
     - Get next story to implement (status = Approved)
     - Get all gates for story
     - Get workflow history
   - **Indexes**:
     - Composite index on (projectId, status)
     - Composite index on (projectId, epicId, storyId)

2. **Cloud Storage (Unstructured Data)**
   - **Buckets**:
     - `bmad-templates`: YAML templates for documents
     - `bmad-artifacts`: Generated artifacts (PRDs, architectures, stories)
     - `bmad-data`: Framework data files (checklists, KB, etc.)
     - `bmad-kb`: Knowledge base documents for RAG
   - **Organization**:
     - `{projectId}/{artifactType}/{filename}`
     - Versioning enabled for rollback
     - Lifecycle policies for cost optimization

3. **Vertex AI Search (Knowledge Base & RAG)**
   - Index all KB documents for semantic search
   - Support "KB Mode" for BMad-Master agent
   - RAG-based context retrieval for agents
   - Citation support for grounded responses

#### 3.2.6 Infrastructure & Monitoring Layer

**Purpose**: Observability, security, and operational excellence

**Components**:

1. **Cloud Logging**
   - All API requests logged
   - Agent execution logs
   - Workflow step logs
   - Error and exception logs
   - Audit logs (who did what, when)

2. **Cloud Monitoring**
   - Dashboards for key metrics:
     - Agent invocations per agent
     - Workflow success/failure rates
     - API latency (p50, p95, p99)
     - Error rates
   - Alerts:
     - High error rate
     - Slow response times
     - Budget threshold exceeded
   - SLO tracking (service level objectives)

3. **Secret Manager**
   - API keys for external services
   - Database credentials
   - Encryption keys
   - Certificates

### 3.3 Data Flow Patterns

#### 3.3.1 Agent Invocation Flow

```
User → Web UI/IDE → API Gateway → Agent Service → Vertex AI Agent
                                                          ↓
                        ← JSON Response ←  ← ← ← ← ← ← ← ┘
                                                          ↓
                                        (Agent calls tools/functions)
                                                          ↓
                                                 Cloud Functions
                                                          ↓
                                            Firestore / Cloud Storage
```

**Steps**:
1. User invokes agent via UI/IDE (e.g., "Create PRD for my project")
2. Request routed through API Gateway (auth, rate limiting)
3. Agent Service receives request
4. Agent Service loads agent context (always-loaded files)
5. Agent Service invokes Vertex AI agent
6. Agent reasons and decides to call tool (e.g., `create_prd`)
7. Tool (Cloud Function) executes:
   - Loads PRD template from Cloud Storage
   - Elicits information from user (if interactive mode)
   - Populates template with data
   - Saves artifact to Cloud Storage
   - Saves metadata to Firestore
8. Response returned to user

#### 3.3.2 Workflow Execution Flow

```
User → Workflow Service → Vertex AI Reasoning Engine
                                    ↓
                          Step 1 → Firestore (load config)
                                    ↓
                          Step 2 → Cloud Function (identify next story)
                                    ↓
                          Step 3 → Cloud Storage (load requirements)
                                    ↓
                          Step 4 → Vertex AI Agent (gather arch context)
                                    ↓
                          Step 5 → Cloud Function (verify structure)
                                    ↓
                          Step 6 → Cloud Function (populate template)
                                    ↓
                          Result → Firestore + Cloud Storage
                                    ↓
         ← ← ← ← ← ← ← ← ← ← ← ← ← ┘
```

**Steps (Example: create-next-story workflow)**:
1. User starts workflow: "Create next story for Epic 1"
2. Workflow Service creates workflow instance in Firestore
3. Reasoning Engine executes 6 steps sequentially:
   - Step 0: Load core-config.yaml from Firestore
   - Step 1: Identify next story (call Cloud Function)
   - Step 2: Gather story requirements (read from Cloud Storage)
   - Step 3: Gather architecture context (call Vertex AI Agent)
   - Step 4: Verify project structure (call Cloud Function)
   - Step 5: Populate story template (call Cloud Function)
   - Step 6: Execute draft checklist (call Vertex AI Agent)
4. Workflow saves state after each step (resumable)
5. Final result (story document) saved to Firestore + Cloud Storage
6. Response returned to user

#### 3.3.3 Orchestration Flow (Team Bundle)

```
User → "Execute greenfield-fullstack workflow" → Orchestration Service
                                                          ↓
                                    Step 1: Analyst (Project Brief)
                                                          ↓
                                    Step 2: PM (PRD)
                                                          ↓
                                    Step 3: UX Expert (Front-End Spec)
                                                          ↓
                                    Step 4: Architect (Architecture)
                                                          ↓
                                    Step 5: PO (Validate + Shard)
                                                          ↓
                                    Ready for Development!
```

**Steps**:
1. User selects workflow (e.g., greenfield-fullstack)
2. Orchestration Service loads workflow definition
3. For each step in workflow:
   - Invoke appropriate agent
   - Wait for completion
   - Validate output
   - Hand off to next agent
4. Each agent creates artifacts in sequence
5. Final step: PO validates and shards documents
6. Project marked as "Ready for Development"

### 3.4 Integration Points

#### 3.4.1 External Integrations

1. **Version Control Systems**
   - GitHub, GitLab, Bitbucket integration
   - Sync artifacts to repository
   - Create pull requests from stories
   - Webhook notifications on code changes

2. **Project Management Tools**
   - Jira, Linear, Asana integration
   - Sync stories as tickets
   - Update status bidirectionally
   - Link artifacts to tickets

3. **CI/CD Pipelines**
   - Trigger workflows from pipeline events
   - Update story status on deployment
   - Link deployment history to stories

4. **Communication Platforms**
   - Slack, Discord, Teams notifications
   - Agent activity updates
   - Gate decision notifications
   - Workflow completion alerts

#### 3.4.2 Internal Integration Patterns

1. **Event-Driven Integration**
   - Pub/Sub for asynchronous events
   - Topics: `story.created`, `gate.decided`, `workflow.completed`
   - Subscribers: Notification service, analytics, webhooks

2. **Synchronous API Calls**
   - Direct HTTP calls between services
   - Used for request-response patterns
   - Timeouts and retries configured

3. **Shared Storage**
   - Firestore for shared state
   - Cloud Storage for shared artifacts
   - Eventual consistency model

---

## 4. Component Mapping: BMad → GCP Services

### 4.1 Comprehensive Component Mapping Table

This section provides detailed mapping of every BMad component to its corresponding GCP service(s).

| BMad Component | Current Implementation | Proposed GCP Service | Rationale | Alternative Considered |
|----------------|----------------------|---------------------|-----------|------------------------|
| **Agents (10)** | YAML config in .md files | Vertex AI Agent Builder | Native agent lifecycle management, tool integration, context handling | Custom agent framework on Cloud Run (more complex, less integrated) |
| **Agent Personas** | Markdown instructions | Vertex AI system instructions | Direct persona definition in agent config | Prompt templates in Cloud Storage (less structured) |
| **Agent Tools/Commands** | Embedded task references | Vertex AI Function Calling | Native function registration, automatic parsing | Custom tool registry (more overhead) |
| **Agent Context (always-load)** | File references in YAML | Cloud Storage + Agent context | Pre-load files into agent context window | Firestore documents (less suitable for large text) |
| **Agent Sessions** | Stateless (per-invocation) | Vertex AI Conversation | Session management with TTL | Custom session store in Firestore (more complex) |
| **Tasks (Simple)** | Markdown task instructions | Cloud Functions (2nd gen) | Stateless, event-driven, auto-scaled | Cloud Run (more overhead for simple tasks) |
| **Tasks (Complex)** | Multi-step instructions | Vertex AI Reasoning Engine | Multi-step reasoning, state management, resumable | Cloud Workflows (less intelligent, no reasoning) |
| **Workflows (Orchestration)** | Team bundle YAML definitions | Cloud Workflows + Custom orchestrator | Declarative workflow definition, visual monitoring | Pure code orchestration (less visible, harder to debug) |
| **Templates (YAML)** | YAML files in `.bmad-core/templates/` | Cloud Storage + Template service | Centralized template storage, versioning | Firestore (less suitable for large YAML) |
| **Template Rendering** | Agent-side parsing | Cloud Function template engine | Server-side rendering, validation, caching | Agent-side rendering (inconsistent, no validation) |
| **Checklists** | Markdown checklist files | Cloud Storage + Checklist engine | Structured checklist execution, tracking | Hardcoded in agent instructions (inflexible) |
| **Data Files** | Markdown knowledge files | Cloud Storage + Vertex AI RAG | Semantic search, citation support | Simple file storage (no search capability) |
| **Knowledge Base (KB Mode)** | Load and read markdown docs | Vertex AI Search + RAG | Semantic search, Q&A, document navigation | Cloud Storage + text search (less intelligent) |
| **Configuration (core-config.yaml)** | YAML file at project root | Firestore `/projects/{id}/config` | Dynamic updates, queryable, multi-project | Cloud Storage (less queryable, no atomic updates) |
| **Project Metadata** | Inferred from file system | Firestore `/projects/{id}` | Explicit metadata, queryable, indexed | File system (hard to query, no structure) |
| **Artifacts (PRD, Arch, etc.)** | Markdown files in `docs/` | Cloud Storage + Firestore metadata | Full-text documents in GCS, metadata in Firestore | All in Firestore (expensive for large docs) |
| **Stories** | Markdown files in `docs/stories/` | Firestore `/projects/{id}/stories/{storyId}` | Queryable state, status tracking, concurrent updates | Cloud Storage (hard to query by status) |
| **Story Status** | YAML front matter `Status: Draft` | Firestore field `status: "draft"` | Indexed queries (get all approved stories) | Grep files (slow, not scalable) |
| **QA Gates** | YAML files in `docs/qa/gates/` | Firestore `/projects/{id}/gates/{gateId}` | Queryable gate history, decisions | Cloud Storage (less queryable) |
| **QA Assessments** | Markdown files in `docs/qa/assessments/` | Cloud Storage + Firestore metadata | Full risk/test design documents | Firestore (expensive for large docs) |
| **Change Logs** | Markdown sections in artifacts | Firestore subcollection `/artifacts/{id}/changes` | Queryable audit trail, timestamps | Cloud Logging only (less structured) |
| **Workflow State** | Implicit (file existence, status) | Firestore `/workflows/{workflowId}` | Explicit state, resumable workflows | State machine in code (less visible) |
| **Session Context** | Not persisted (stateless) | Firestore `/sessions/{sessionId}` | Resume conversations, context preservation | In-memory only (lost on restart) |
| **File System Queries** | `grep`, `find`, `ls` commands | Firestore queries | SQL-like queries, indexed, fast | BigQuery (too heavy for simple queries) |
| **Versioning** | Git commit history | Cloud Storage versioning + Firestore history | Object versioning, rollback capability | Custom versioning (complex) |
| **Audit Trail** | Git log + Change Logs | Cloud Logging + Firestore audit collections | Comprehensive audit trail, compliance-ready | Git only (requires repo access) |
| **IDE Integration** | Direct file system access | Cloud Storage FUSE + REST API | Seamless file sync, bidirectional | API only (less IDE-friendly) |
| **Web UI** | Not applicable (file-based) | Custom React app on Cloud Run | User-friendly interface for planning phase | Cloud Shell (developer-only, not user-friendly) |
| **Authentication** | None (local files) | Firebase Auth + IAM | User authentication, SSO support | Custom auth (security risk) |
| **Authorization** | File system permissions | IAM + custom RBAC | Role-based access control, project-level permissions | File permissions (not granular enough) |
| **Rate Limiting** | None | Cloud Armor + API quotas | Prevent abuse, fair usage | No rate limiting (risk of runaway costs) |
| **Monitoring** | None | Cloud Monitoring + Logging | Observability, dashboards, alerts | Custom logging (limited visibility) |
| **Secrets Management** | Environment variables | Secret Manager | Secure secret storage, rotation | Hardcoded or env vars (security risk) |
| **Dependency Loading** | On-demand file reads | Cloud Storage signed URLs + lazy loading | Efficient context usage, minimize costs | Pre-load everything (expensive, slow) |
| **Error Handling** | User escalation in tasks | Cloud Error Reporting + custom handlers | Centralized error tracking, alerting | Console logs only (hard to track) |
| **Notifications** | None | Cloud Pub/Sub + notification service | Event-driven notifications, multiple channels | Polling (inefficient) |
| **Backup & Recovery** | Git repository | Cloud Storage versioning + scheduled exports | Automated backups, point-in-time recovery | Manual backups (error-prone) |

### 4.2 Service Selection Rationale

#### 4.2.1 Vertex AI Agent Builder

**Why?**
- **Native Agent Lifecycle**: Managed agent creation, deployment, versioning
- **Built-in Tools**: Function calling, extensions, data stores
- **Context Management**: Automatic context window management
- **Model Selection**: Access to latest Gemini models (2.0 Flash, Pro)
- **Session Handling**: Conversation history and context preservation
- **Monitoring**: Built-in metrics and logging

**Alternatives Considered**:
- **Custom Agent Framework**: More control, but significantly more development and maintenance
- **Third-party Agent Frameworks**: More flexibility, but less integrated with GCP ecosystem

**Decision**: Vertex AI Agent Builder for all 10 agents. Provides best balance of capability, integration, and managed services.

#### 4.2.2 Vertex AI Reasoning Engine

**Why?**
- **Multi-Step Reasoning**: Execute complex workflows with decision logic
- **State Management**: Built-in state persistence
- **Resumability**: Pause and resume workflows from any checkpoint
- **Tool Integration**: Call agents, functions, APIs within workflow
- **Native GCP Integration**: Seamless integration with other Vertex AI services

**Alternatives Considered**:
- **Cloud Workflows**: Good for orchestration, but lacks intelligent reasoning
- **Cloud Composer (Airflow)**: Too heavy for BMad use cases
- **Custom State Machines**: More control, but significant development effort

**Decision**: Reasoning Engine for complex tasks (8 workflows). Cloud Workflows for simple orchestration (team bundles).

#### 4.2.3 Firestore

**Why?**
- **Real-Time Queries**: Index-based queries for story status, gates, etc.
- **Concurrent Access**: Multiple agents can update state concurrently
- **Transactions**: Atomic updates for consistency
- **Offline Support**: SDK supports offline mode (IDE plugins)
- **Scalability**: Auto-scales to millions of documents

**Alternatives Considered**:
- **Cloud SQL**: Relational database, but overkill for document-centric data
- **BigTable**: High-throughput, but expensive and complex for BMad scale
- **Datastore**: Predecessor to Firestore, less feature-rich

**Decision**: Firestore for all structured state (stories, gates, configurations, workflow state).

#### 4.2.4 Cloud Storage

**Why?**
- **Object Storage**: Ideal for large documents (PRDs, architectures, assessments)
- **Versioning**: Built-in object versioning for rollback
- **Access Control**: IAM-based permissions, signed URLs
- **Cost-Effective**: Cheapest storage option for infrequently accessed data
- **Integration**: Works with Vertex AI Search, Cloud Functions, Cloud Run

**Alternatives Considered**:
- **Filestore**: NFS-based file storage, but expensive and unnecessary
- **Firestore**: Can store documents, but expensive for large files

**Decision**: Cloud Storage for all large documents (templates, artifacts, KB, generated docs).

#### 4.2.5 Cloud Functions (2nd gen)

**Why?**
- **Event-Driven**: Trigger on HTTP, Pub/Sub, Storage events
- **Auto-Scaling**: Scale to zero when idle
- **Simplicity**: Single-purpose functions, easy to develop and deploy
- **Integration**: Native integration with GCP services

**Alternatives Considered**:
- **Cloud Run**: Better for stateful services, but overkill for simple tasks
- **App Engine**: Legacy platform, less flexible

**Decision**: Cloud Functions for simple, stateless tasks (template rendering, validation, file operations).

#### 4.2.6 Cloud Run

**Why?**
- **Flexibility**: Run any containerized workload
- **HTTP/2 & WebSockets**: Support real-time connections
- **Auto-Scaling**: Scale to zero, fast cold starts
- **Stateful Services**: Support session state in memory (with caveats)
- **Easy Deployment**: Deploy from containers, source code, or Artifact Registry

**Alternatives Considered**:
- **GKE (Kubernetes)**: Too complex, operational overhead
- **Compute Engine**: IaaS, requires infrastructure management

**Decision**: Cloud Run for API Gateway, Orchestration Service, Agent Service, Workflow Service.

#### 4.2.7 Vertex AI Search + RAG

**Why?**
- **Semantic Search**: Understand user intent, not just keywords
- **RAG (Retrieval Augmented Generation)**: Ground responses in knowledge base
- **Citation Support**: Provide sources for AI-generated responses
- **Document Indexing**: Automatic indexing of uploaded documents

**Alternatives Considered**:
- **Elasticsearch**: Self-managed, operational overhead
- **Algolia**: Third-party service, vendor lock-in
- **Simple Text Search**: No semantic understanding

**Decision**: Vertex AI Search + RAG for KB Mode in BMad-Master agent.

### 4.3 Component Mapping by Framework Layer

#### 4.3.1 Agent Layer

| BMad Component | GCP Service | Implementation Details |
|----------------|-------------|------------------------|
| 10 Agents | Vertex AI Agent Builder | One agent per BMad role (analyst, pm, ux-expert, architect, po, sm, dev, qa, bmad-master, bmad-orchestrator) |
| Agent Personas | System Instructions | Persona text embedded in agent config |
| Agent Tools | Function Declarations | Cloud Functions registered as tools |
| Agent Context | Conversation Context | Always-loaded files passed in initial context |
| Agent Memory | Firestore + Agent Sessions | Short-term (session), long-term (Firestore) |

#### 4.3.2 Execution Layer

| BMad Component | GCP Service | Implementation Details |
|----------------|-------------|------------------------|
| Simple Tasks | Cloud Functions | Stateless functions for single-step operations |
| Complex Workflows | Vertex AI Reasoning Engine | Native Vertex AI workflows for multi-step logic |
| Orchestration | Cloud Workflows + Custom service | Team bundles as workflow definitions |
| Template Rendering | Cloud Function | YAML parsing, validation, population |
| Checklist Execution | Vertex AI Reasoning Engine | Systematic validation with decision logic |

#### 4.3.3 Data Layer

| BMad Component | GCP Service | Implementation Details |
|----------------|-------------|------------------------|
| Project Config | Firestore `/projects/{id}/config` | core-config.yaml equivalent |
| Stories | Firestore `/projects/{id}/stories/{storyId}` | Full story document with status, tasks, notes |
| Gates | Firestore `/projects/{id}/gates/{gateId}` | QA gate decisions |
| Artifacts | Cloud Storage + Firestore metadata | Large docs in GCS, metadata in Firestore |
| Templates | Cloud Storage `bmad-templates/` | YAML templates |
| Knowledge Base | Cloud Storage `bmad-kb/` + Vertex AI Search | Indexed for RAG |
| Workflow State | Firestore `/workflows/{id}` | Resumable workflow state |
| Sessions | Firestore `/sessions/{id}` | Agent conversation context |

#### 4.3.4 API Layer

| BMad Component | GCP Service | Implementation Details |
|----------------|-------------|------------------------|
| API Gateway | Cloud Run | Authentication, routing, rate limiting |
| Authentication | Firebase Auth + IAM | User authentication, service accounts |
| Authorization | IAM + Custom RBAC | Project-level permissions |
| Rate Limiting | Cloud Armor + API quotas | Per-user, per-project limits |

#### 4.3.5 Infrastructure Layer

| BMad Component | GCP Service | Implementation Details |
|----------------|-------------|------------------------|
| Logging | Cloud Logging | Structured logs, query language |
| Monitoring | Cloud Monitoring | Metrics, dashboards, alerts |
| Secrets | Secret Manager | API keys, credentials |
| Notifications | Cloud Pub/Sub | Event-driven notifications |
| Backup | Cloud Storage lifecycle policies | Automated backups, retention |

### 4.4 Migration Considerations

**File-Based → Cloud-Based**

1. **core-config.yaml → Firestore**
   - Migrate file contents to Firestore document
   - Preserve all configuration fields
   - Add project ID and metadata
   - Enable dynamic updates (no file edits)

2. **Story Files → Firestore + Cloud Storage**
   - Story metadata → Firestore (status, timestamps, tasks)
   - Story content → Cloud Storage (markdown document)
   - Bidirectional sync for IDE plugins

3. **Gate Files → Firestore**
   - YAML gate files → Firestore documents
   - Queryable gate history
   - Decision rationale preserved

4. **Artifact Files → Cloud Storage + Firestore**
   - Large documents (PRDs, architectures) → Cloud Storage
   - Metadata (owner, version, timestamps) → Firestore
   - Full-text search via Vertex AI Search

5. **Templates → Cloud Storage**
   - Copy all YAML templates to Cloud Storage
   - Maintain directory structure
   - Version control via object versioning

---

## 5. Agent Architecture (Google ADK + Vertex AI Agent Builder)

### 5.1 Google ADK Agent Creation

BMad agents are built using **Google ADK's Agent class** and deployed to **Vertex AI Agent Engine**. Each agent can be created programmatically or configured via Vertex AI Agent Builder UI.

**Programmatic Agent Creation (Google ADK)**:

```python
# Create a BMad agent using Google ADK
from google_adk import Agent, Tool
from google_adk.tools import SearchTool

# Example: Create the PM (Product Manager) agent
pm_agent = Agent(
    name="pm-agent",
    display_name="John - Product Manager",
    description="Product strategy and PRD creation specialist",

    # Model configuration
    model="gemini-2.0-flash-001",
    temperature=0.7,
    max_output_tokens=8192,

    # System instructions (persona)
    system_instructions="""
    You are John, BMad's Product Manager agent. You embody an investigative,
    market-savvy PM who deeply understands both user needs and business strategy.

    Your primary responsibilities:
    1. Create comprehensive Product Requirements Documents (PRDs)
    2. Facilitate brownfield epic and story generation from existing codebases
    3. Guide course corrections when projects drift from vision
    4. Ensure all requirements are user-centric and business-aligned
    """,

    # Tools (custom functions + built-in)
    tools=[
        Tool(name="create_prd", function=create_prd_function),
        Tool(name="shard_prd", function=shard_prd_function),
        Tool(name="brownfield_create_epic", function=create_epic_function),
        SearchTool()  # Google ADK built-in search tool
    ],

    # Memory configuration
    memory_enabled=True,

    # Callbacks for monitoring
    callbacks=[logging_callback, monitoring_callback]
)

# Deploy to Vertex AI Agent Engine
pm_agent.deploy(
    project_id="your-gcp-project",
    region="us-central1",
    endpoint_name="pm-agent-endpoint"
)
```

**Declarative Agent Configuration (YAML for Vertex AI Agent Builder)**:

Alternatively, agents can be configured using YAML and imported into Vertex AI Agent Builder UI:

### 5.2 Agent Configuration Schema

Each of the 10 BMad agents can be configured using the following YAML schema (compatible with both Google ADK and Vertex AI Agent Builder):

```yaml
agent:
  id: "pm-agent"                          # Unique agent identifier
  display_name: "John - Product Manager"   # Human-readable name
  description: "Product strategy and PRD creation"

  # Model Configuration
  model:
    name: "gemini-2.0-flash-001"          # Gemini model version
    parameters:
      temperature: 0.7                     # Creativity level
      top_p: 0.9                           # Nucleus sampling
      top_k: 40                            # Top-k sampling
      max_output_tokens: 8192              # Response length limit

  # Persona Configuration
  persona:
    role: "Investigative Product Strategist & Market-Savvy PM"
    style: "Analytical, inquisitive, data-driven, user-focused, pragmatic"
    core_principles:
      - "Deeply understand 'Why' - uncover root causes and motivations"
      - "Champion the user - maintain relentless user-centric focus"
      - "Data-informed decisions balanced with strategic judgment"
      - "Clarity and simplicity - distill complexity into actionable plans"
      - "Holistic thinking - consider business, user, and technical angles"
    system_instructions: |
      You are John, BMad's Product Manager agent. You embody an investigative,
      market-savvy PM who deeply understands both user needs and business strategy.

      Your primary responsibilities:
      1. Create comprehensive Product Requirements Documents (PRDs)
      2. Facilitate brownfield epic and story generation from existing codebases
      3. Guide course corrections when projects drift from vision
      4. Ensure all requirements are user-centric and business-aligned

      When creating PRDs, you employ either:
      - Interactive mode: Deep elicitation with thoughtful questions
      - Fast-track mode: Rapid PRD with minimal interaction (YOLO mode)

      You have access to tools for document creation, research, and validation.
      Always cite sources and maintain traceability to user needs.

  # Tool Declarations
  tools:
    - name: "create_prd"
      description: "Create Product Requirements Document from template"
      function_declaration:
        name: "create_prd"
        description: "Generate a PRD using the BMad PRD template with interactive or YOLO mode"
        parameters:
          type: "object"
          properties:
            project_id:
              type: "string"
              description: "Project identifier"
            mode:
              type: "string"
              enum: ["interactive", "yolo"]
              description: "Elicitation mode"
            template_type:
              type: "string"
              enum: ["prd-tmpl", "brownfield-prd-tmpl"]
              description: "PRD template type"
          required: ["project_id", "mode"]
      cloud_function_url: "https://us-central1-{project}.cloudfunctions.net/create-prd"

    - name: "shard_prd"
      description: "Shard PRD into epics and stories for development"
      function_declaration:
        name: "shard_prd"
        description: "Break down PRD into structured epic and story hierarchy"
        parameters:
          type: "object"
          properties:
            project_id:
              type: "string"
              description: "Project identifier"
            prd_path:
              type: "string"
              description: "Path to PRD document in Cloud Storage"
          required: ["project_id", "prd_path"]
      cloud_function_url: "https://us-central1-{project}.cloudfunctions.net/shard-doc"

    - name: "brownfield_create_epic"
      description: "Create epic from existing codebase analysis"
      function_declaration:
        name: "brownfield_create_epic"
        description: "Analyze existing code and generate epic documentation"
        parameters:
          type: "object"
          properties:
            project_id:
              type: "string"
              description: "Project identifier"
            codebase_path:
              type: "string"
              description: "Path to codebase or analysis"
            focus_area:
              type: "string"
              description: "Specific area to document (optional)"
          required: ["project_id", "codebase_path"]
      cloud_function_url: "https://us-central1-{project}.cloudfunctions.net/brownfield-create-epic"

  # Context Configuration
  context:
    always_load_files:
      - "gs://bmad-data/technical-preferences.md"
    templates:
      - "gs://bmad-templates/prd-tmpl.yaml"
      - "gs://bmad-templates/brownfield-prd-tmpl.yaml"
    max_context_size: 32000              # Tokens

  # Memory Configuration
  memory:
    session_ttl: 3600                    # Session timeout (seconds)
    max_messages: 50                     # Max conversation history
    storage_backend: "firestore"
    collection_path: "/projects/{project_id}/sessions/{session_id}"

  # Permissions (Section Ownership)
  permissions:
    owner_sections:
      - "Requirements"                   # PM owns these sections in documents
      - "User Stories"
      - "Success Criteria"
    editor_sections:
      - "Project Overview"               # PM can edit these sections
      - "Timeline"
    read_only_sections:
      - "Architecture"                   # PM can read but not edit
      - "Technical Specifications"
```

### 5.2 Agent Design Patterns

#### 5.2.1 Static Agents with Dynamic Context

**Challenge**: BMad-Orchestrator morphs into any agent persona dynamically. Vertex AI agents are statically defined.

**Solution**: Meta-Agent Routing Pattern

```python
class BMadOrchestrator:
    """
    Meta-agent that routes requests to appropriate static agents.
    Maintains team bundle logic and multi-agent coordination.
    """

    def __init__(self):
        self.agent_registry = {
            'analyst': 'projects/{project}/locations/{location}/agents/analyst',
            'pm': 'projects/{project}/locations/{location}/agents/pm',
            'ux-expert': 'projects/{project}/locations/{location}/agents/ux-expert',
            # ... all 10 agents
        }

    def morph_to_agent(self, agent_role: str, user_request: str):
        """
        Route request to appropriate agent.
        Simulates morphing by delegating to specialized agent.
        """
        agent_id = self.agent_registry[agent_role]
        return self.invoke_agent(agent_id, user_request)

    def execute_team_bundle(self, workflow_type: str):
        """
        Execute multi-agent workflow (e.g., greenfield-fullstack).
        Coordinate agent handoffs.
        """
        workflow = self.load_workflow_definition(workflow_type)

        for step in workflow['steps']:
            agent_role = step['agent']
            task = step['task']
            result = self.morph_to_agent(agent_role, task)

            # Validate output before proceeding
            if not self.validate_output(result, step['validation']):
                raise WorkflowError(f"Step {step['name']} failed validation")

        return {"status": "complete", "artifacts": self.collect_artifacts()}
```

#### 5.2.2 Context Management Pattern

**Challenge**: Minimize context window usage while providing necessary information.

**Solution**: Lazy Loading with Caching

```python
class AgentContextManager:
    """
    Manage agent context efficiently.
    Load only necessary files, cache for reuse.
    """

    def __init__(self, agent_config):
        self.always_load = agent_config['context']['always_load_files']
        self.cache = {}

    def build_context(self, project_id, additional_files=[]):
        """
        Build context for agent invocation.
        """
        context_parts = []

        # Always-loaded files (cached)
        for file_path in self.always_load:
            content = self.get_cached_or_load(file_path)
            context_parts.append(content)

        # Additional files for this request
        for file_path in additional_files:
            content = self.load_file(file_path)
            context_parts.append(content)

        return "\n\n".join(context_parts)

    def get_cached_or_load(self, file_path):
        """Use cache to reduce Cloud Storage reads."""
        if file_path not in self.cache:
            self.cache[file_path] = self.load_file(file_path)
        return self.cache[file_path]

    def load_file(self, file_path):
        """Load file from Cloud Storage."""
        storage_client = storage.Client()
        bucket_name, blob_name = parse_gs_url(file_path)
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        return blob.download_as_text()
```

#### 5.2.3 Tool Registration Pattern

**Pattern**: Each agent registers Cloud Functions as tools for task execution.

**Example: PM Agent Tool**

```python
# Cloud Function: create-prd
def create_prd(request):
    """
    Cloud Function to create PRD from template.
    Called as a tool by PM agent.
    """
    data = request.get_json()
    project_id = data['project_id']
    mode = data['mode']
    template_type = data.get('template_type', 'prd-tmpl')

    # Load template from Cloud Storage
    template = load_template(f"{template_type}.yaml")

    # Render template (interactive or YOLO mode)
    if mode == 'interactive':
        # Elicit information from user
        prd = render_template_interactive(template, project_id)
    else:
        # Fast-track mode (minimal interaction)
        prd = render_template_yolo(template, project_id)

    # Save PRD to Cloud Storage
    artifact_path = save_artifact(project_id, 'prd', prd)

    # Save metadata to Firestore
    save_artifact_metadata(project_id, {
        'type': 'prd',
        'path': artifact_path,
        'created_by': 'pm-agent',
        'created_at': datetime.utcnow()
    })

    return {
        'status': 'success',
        'artifact_path': artifact_path,
        'message': f'PRD created successfully in {mode} mode'
    }
```

### 5.3 Agent Configuration for All 10 Agents

#### 5.3.1 Analyst (Mary) - Research & Discovery

**Key Characteristics**:
- Curious, empathetic, methodical
- Brainstorming facilitation
- Market research and competitive analysis
- Project brief creation

**Tools**:
- `facilitate_brainstorming`: Structured brainstorming sessions
- `create_project_brief`: Document project vision and goals
- `deep_research`: Generate comprehensive research prompts
- `document_project`: Brownfield project documentation

**Always-Loaded Files**:
- `brainstorming-techniques.md`
- `elicitation-methods.md`

#### 5.3.2 PM (John) - Product Strategy

**Key Characteristics**:
- Investigative, analytical, user-focused
- PRD creation (interactive and YOLO modes)
- Brownfield epic/story generation
- Course correction

**Tools**:
- `create_prd`: PRD creation from template
- `shard_prd`: Break down PRD into epics/stories
- `brownfield_create_epic`: Epic from existing codebase
- `brownfield_create_story`: Story from existing code

**Always-Loaded Files**:
- `technical-preferences.md`

#### 5.3.3 UX Expert (Sally) - User Experience

**Key Characteristics**:
- Creative, user-centric, design-focused
- Front-end specifications
- AI UI prompt generation (v0, Lovable)
- Component design

**Tools**:
- `create_frontend_spec`: Front-end specification from template
- `generate_ai_ui_prompt`: v0/Lovable prompts for UI generation

**Always-Loaded Files**:
- `technical-preferences.md`

#### 5.3.4 Architect (Winston) - System Design

**Key Characteristics**:
- Holistic, strategic, pragmatic
- System architecture design
- Technology selection
- Infrastructure planning

**Tools**:
- `create_architecture`: Architecture document from template
- `deep_research`: Technology research
- `document_project`: Brownfield architecture documentation

**Always-Loaded Files**:
- `technical-preferences.md`

#### 5.3.5 PO (Sarah) - Validation & Process

**Key Characteristics**:
- Methodical, quality-focused, process-oriented
- Master checklist validation
- Document sharding orchestration
- Story validation

**Tools**:
- `execute_checklist`: Systematic validation with checklist
- `shard_doc`: Document sharding (PRD/architecture)
- `validate_next_story`: Pre-implementation story validation

**Always-Loaded Files**:
- `po-master-checklist.md`

#### 5.3.6 SM (Bob) - Story Creation

**Key Characteristics**:
- Detail-oriented, structured, context-aware
- Story drafting from epics
- Architecture context extraction
- Epic sequencing

**Tools**:
- `create_next_story`: 6-step story creation workflow
- `execute_checklist`: Story draft checklist validation

**Always-Loaded Files**:
- `story-tmpl.yaml`
- `story-draft-checklist.md`

#### 5.3.7 Dev (James) - Implementation

**Key Characteristics**:
- Pragmatic, test-driven, quality-focused
- Story implementation
- Regression validation
- Code quality

**Tools**:
- `execute_checklist`: Story DoD checklist validation
- `apply_qa_fixes`: Deterministic QA fix application
- `validate_next_story`: Pre-implementation validation

**Always-Loaded Files**:
- `story-dod-checklist.md`
- Project-specific dev files (configured in core-config)

#### 5.3.8 QA (Quinn) - Test Architect

**Key Characteristics**:
- Analytical, thorough, risk-focused
- Risk profiling
- Test design
- Requirements traceability
- NFR assessment
- Comprehensive review with refactoring authority

**Tools**:
- `risk_profile`: Probability × impact risk assessment
- `test_design`: Test scenario generation
- `trace_requirements`: Requirements-to-test mapping
- `nfr_assess`: Non-functional requirements validation
- `review_story`: Comprehensive review with gate decision
- `qa_gate`: Gate decision and documentation

**Always-Loaded Files**:
- `test-levels-framework.md`
- `test-priorities-matrix.md`

#### 5.3.9 BMad-Master - Universal Executor

**Key Characteristics**:
- Versatile, knowledgeable, task-focused
- No persona transformation (stays as BMad-Master)
- KB Mode toggle for knowledge base access
- Multi-domain task execution

**Tools**:
- All tasks available (not agent-specific)
- `kb_mode_interact`: Knowledge base navigation and Q&A

**Always-Loaded Files**:
- None (loads based on task)

**Special Feature: KB Mode**
- Toggle KB mode on/off
- Semantic search over knowledge base
- Provide grounded, cited responses

#### 5.3.10 BMad-Orchestrator - Web Platform Agent

**Key Characteristics**:
- Adaptive, coordinating, context-heavy
- Agent morphing (routes to appropriate agents)
- Team coordination in web environments
- Workflow orchestration

**Tools**:
- `execute_team_bundle`: Run multi-agent workflows
- `invoke_agent`: Delegate to specific agent
- All agent tools available (for routing)

**Always-Loaded Files**:
- None (context managed per morphed agent)

**Special Feature: Agent Morphing**
- Routes requests to appropriate static agents
- Maintains team bundle workflow logic
- Coordinates multi-agent handoffs

### 5.4 Agent Deployment Architecture

```
Vertex AI Agent Builder
├── analyst-agent
│   ├── model: gemini-2.0-flash-001
│   ├── tools: [facilitate_brainstorming, create_project_brief, ...]
│   └── context: brainstorming-techniques.md, elicitation-methods.md
├── pm-agent
│   ├── model: gemini-2.0-flash-001
│   ├── tools: [create_prd, shard_prd, brownfield_create_epic, ...]
│   └── context: technical-preferences.md
├── ux-expert-agent
│   ├── model: gemini-2.0-flash-001
│   ├── tools: [create_frontend_spec, generate_ai_ui_prompt]
│   └── context: technical-preferences.md
├── architect-agent
│   ├── model: gemini-2.0-flash-001
│   ├── tools: [create_architecture, deep_research, document_project]
│   └── context: technical-preferences.md
├── po-agent
│   ├── model: gemini-2.0-flash-001
│   ├── tools: [execute_checklist, shard_doc, validate_next_story]
│   └── context: po-master-checklist.md
├── sm-agent
│   ├── model: gemini-2.0-flash-001
│   ├── tools: [create_next_story, execute_checklist]
│   └── context: story-tmpl.yaml, story-draft-checklist.md
├── dev-agent
│   ├── model: gemini-2.0-flash-001
│   ├── tools: [execute_checklist, apply_qa_fixes, validate_next_story]
│   └── context: story-dod-checklist.md, {devLoadAlwaysFiles}
├── qa-agent
│   ├── model: gemini-2.0-flash-001 (or Pro for complex analysis)
│   ├── tools: [risk_profile, test_design, trace_requirements, nfr_assess, review_story, qa_gate]
│   └── context: test-levels-framework.md, test-priorities-matrix.md
├── bmad-master-agent
│   ├── model: gemini-2.0-flash-001
│   ├── tools: [all tasks, kb_mode_interact]
│   ├── context: (dynamic based on task)
│   └── rag: Vertex AI Search (KB Mode)
└── bmad-orchestrator-agent
    ├── model: gemini-2.0-flash-001
    ├── tools: [execute_team_bundle, invoke_agent, all agent tools]
    └── context: (dynamic based on morphed agent)
```

---

## 6. Workflow Orchestration

### 6.1 Overview

BMad workflows fall into three categories:
1. **Simple Orchestration**: Team bundles (6 workflows) coordinating multiple agents sequentially
2. **Complex Reasoning Workflows**: Multi-step workflows with decision logic (8 workflows)
3. **Simple Tasks**: Single-step operations executed as Cloud Functions (15+ tasks)

### 6.2 Team Bundle Orchestration (Cloud Workflows)

**Purpose**: Coordinate multi-agent workflows for planning phase (greenfield and brownfield projects).

**Workflows**:
- Greenfield: fullstack, service, ui
- Brownfield: fullstack, service, ui

**Implementation**: Cloud Workflows (declarative YAML) + Orchestration Service (coordination logic)

**Example: Greenfield Fullstack Workflow**

```yaml
# Cloud Workflow Definition
main:
  params: [project_id, user_context]
  steps:
    - init:
        assign:
          - workflow_id: ${sys.get_env("GOOGLE_CLOUD_WORKFLOW_EXECUTION_ID")}
          - status: "running"

    - step_1_analyst:
        call: http.post
        args:
          url: https://bmad-agent-service-xxx.run.app/v1/agents/analyst/invoke
          auth:
            type: OIDC
          body:
            project_id: ${project_id}
            task: "create_project_brief"
            context: ${user_context}
        result: project_brief

    - validate_project_brief:
        switch:
          - condition: ${project_brief.status == "success"}
            next: step_2_pm
        next: workflow_failed

    - step_2_pm:
        call: http.post
        args:
          url: https://bmad-agent-service-xxx.run.app/v1/agents/pm/invoke
          body:
            project_id: ${project_id}
            task: "create_prd"
            mode: "interactive"
            context: ${project_brief.artifact_path}
        result: prd

    - step_3_ux_expert:
        call: http.post
        args:
          url: https://bmad-agent-service-xxx.run.app/v1/agents/ux-expert/invoke
          body:
            project_id: ${project_id}
            task: "create_frontend_spec"
            context: ${prd.artifact_path}
        result: frontend_spec

    - step_4_architect:
        call: http.post
        args:
          url: https://bmad-agent-service-xxx.run.app/v1/agents/architect/invoke
          body:
            project_id: ${project_id}
            task: "create_architecture"
            template_type: "fullstack-architecture-tmpl"
            context:
              - ${prd.artifact_path}
              - ${frontend_spec.artifact_path}
        result: architecture

    - step_5_po_validate:
        call: http.post
        args:
          url: https://bmad-agent-service-xxx.run.app/v1/agents/po/invoke
          body:
            project_id: ${project_id}
            task: "execute_checklist"
            checklist: "po-master-checklist"
            artifacts:
              - ${prd.artifact_path}
              - ${architecture.artifact_path}
        result: validation

    - validate_po_checklist:
        switch:
          - condition: ${validation.status == "pass"}
            next: step_6_po_shard
        next: workflow_failed

    - step_6_po_shard:
        call: http.post
        args:
          url: https://bmad-agent-service-xxx.run.app/v1/agents/po/invoke
          body:
            project_id: ${project_id}
            task: "shard_doc"
            documents:
              - ${prd.artifact_path}
              - ${architecture.artifact_path}
        result: sharding

    - complete:
        return:
          status: "complete"
          message: "Greenfield fullstack workflow completed successfully"
          artifacts:
            project_brief: ${project_brief.artifact_path}
            prd: ${prd.artifact_path}
            frontend_spec: ${frontend_spec.artifact_path}
            architecture: ${architecture.artifact_path}
          sharding_complete: true
          ready_for_development: true

    - workflow_failed:
        return:
          status: "failed"
          message: "Workflow validation failed"
```

### 6.3 Workflow Implementation Strategy: Google ADK + Reasoning Engine

**BMad uses a hybrid approach** combining Google ADK's WorkflowAgent for simple orchestration with Vertex AI Reasoning Engine for complex decision logic.

#### 6.3.1 Simple Workflows: Google ADK WorkflowAgent

For straightforward sequential, parallel, or loop patterns, use Google ADK's built-in WorkflowAgent:

```python
# Google ADK Sequential Workflow Example
from google_adk import WorkflowAgent, Tool, Session

class SimpleSequentialWorkflow(WorkflowAgent):
    """
    Google ADK Workflow Agent for simple linear processes.
    Example: Create PRD → Review PRD → Create Architecture
    """

    def __init__(self):
        super().__init__(workflow_type='sequential')

        # Define tools (steps) in sequence
        self.tools = [
            Tool(name="create_prd", function=self.create_prd_step),
            Tool(name="review_prd", function=self.review_prd_step),
            Tool(name="create_architecture", function=self.create_architecture_step)
        ]

    def create_prd_step(self, context: dict) -> dict:
        """Step 1: Invoke PM agent to create PRD"""
        # Call Vertex AI Agent Engine API to invoke PM agent
        pass

    def review_prd_step(self, context: dict) -> dict:
        """Step 2: Invoke PO agent to review PRD"""
        pass

    def create_architecture_step(self, context: dict) -> dict:
        """Step 3: Invoke Architect agent"""
        pass

# Deploy to Vertex AI Agent Engine
workflow_agent = SimpleSequentialWorkflow()
# Google ADK handles state management, error recovery, monitoring
```

**When to use Google ADK WorkflowAgent:**
- ✅ Linear sequences without complex branching
- ✅ Parallel agent execution (use `workflow_type='parallel'`)
- ✅ Simple loops with basic exit conditions
- ✅ Agent-to-agent handoffs without decision logic

#### 6.3.2 Complex Workflows: Vertex AI Reasoning Engine

For workflows requiring multi-step decision logic, dynamic branching, and complex state management, use Vertex AI Reasoning Engine:

**Purpose**: Execute multi-step workflows with decision logic, state management, and resumability.

**Complex Workflows** (require Reasoning Engine):
1. `create-next-story`: 6-step story creation with conditional logic
2. `review-story`: Comprehensive QA review with branching
3. `risk-profile`: Risk assessment with probability×impact scoring
4. `test-design`: Test scenario generation with coverage analysis
5. `apply-qa-fixes`: Deterministic fix application with validation
6. `validate-next-story`: Pre-implementation validation with multi-criteria checks
7. `execute-checklist`: Systematic checklist validation with pass/fail logic
8. `shard-doc`: Document sharding with complexity assessment

**When to use Vertex AI Reasoning Engine:**
- ✅ Multi-step decision trees
- ✅ State-dependent branching
- ✅ Complex scoring/assessment algorithms
- ✅ Workflows requiring LLM-driven decisions at each step

**Example: create-next-story Workflow (Reasoning Engine)**

```python
from google.cloud.aiplatform import reasoning_engines
from google.cloud import firestore, storage

class CreateNextStoryWorkflow:
    """
    Reasoning Engine workflow for create-next-story.
    Implements 6-step sequential process.
    """

    def __init__(self, project_id: str):
        self.project_id = project_id
        self.firestore_client = firestore.Client()
        self.storage_client = storage.Client()
        self.state = {}

    def execute(self, epic_id: str) -> dict:
        """
        Main workflow execution.
        Each step persists state to Firestore for resumability.
        """

        # Step 0: Load core configuration
        self.state['step'] = 0
        config = self.load_core_config()
        self.save_state()

        # Step 1: Identify next story
        self.state['step'] = 1
        next_story_info = self.identify_next_story(epic_id, config)
        if not next_story_info:
            return {"status": "complete", "message": "All stories complete"}
        self.save_state()

        # Step 2: Gather story requirements
        self.state['step'] = 2
        requirements = self.gather_requirements(next_story_info, config)
        self.save_state()

        # Step 3: Gather architecture context
        self.state['step'] = 3
        arch_context = self.gather_architecture_context(
            next_story_info, config
        )
        self.save_state()

        # Step 4: Verify project structure
        self.state['step'] = 4
        structure_notes = self.verify_project_structure(
            next_story_info, config
        )
        self.save_state()

        # Step 5: Populate story template
        self.state['step'] = 5
        story = self.populate_story_template(
            next_story_info, requirements, arch_context,
            structure_notes, config
        )
        self.save_state()

        # Step 6: Execute draft checklist
        self.state['step'] = 6
        checklist_results = self.execute_draft_checklist(story)
        self.save_state()

        return {
            "status": "success",
            "story": story,
            "checklist_results": checklist_results
        }

    def load_core_config(self) -> dict:
        """Step 0: Load core-config.yaml equivalent from Firestore."""
        config_ref = self.firestore_client.collection('projects').document(
            self.project_id
        ).collection('config').document('core-config')

        config_doc = config_ref.get()
        return config_doc.to_dict()

    def identify_next_story(self, epic_id: str, config: dict) -> dict:
        """
        Step 1: Identify next story to create.
        Query Firestore for stories in epic, find next unwritten story.
        """
        # Query epic document for story list
        epic_ref = self.firestore_client.collection('projects').document(
            self.project_id
        ).collection('epics').document(epic_id)

        epic_doc = epic_ref.get()
        epic_data = epic_doc.to_dict()

        # Get list of existing stories
        stories_ref = self.firestore_client.collection('projects').document(
            self.project_id
        ).collection('stories')

        existing_stories = stories_ref.where(
            'epic_id', '==', epic_id
        ).stream()

        existing_story_ids = [s.id for s in existing_stories]

        # Find next story from epic that doesn't exist
        for story_def in epic_data['stories']:
            story_id = f"{epic_id}.{story_def['number']}"
            if story_id not in existing_story_ids:
                return {
                    'story_id': story_id,
                    'epic_id': epic_id,
                    'story_number': story_def['number'],
                    'title': story_def['title'],
                    'story_type': story_def['type']  # backend, frontend, fullstack
                }

        return None  # All stories complete

    def gather_requirements(self, story_info: dict, config: dict) -> dict:
        """
        Step 2: Gather requirements from sharded epic.
        Load epic requirements relevant to this story.
        """
        epic_path = config['epicLocation'].format(
            epic_id=story_info['epic_id']
        )

        # Load epic requirements from Cloud Storage
        bucket_name, blob_name = parse_gs_url(epic_path)
        bucket = self.storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        epic_content = blob.download_as_text()

        # Extract requirements for this story (sections citing story number)
        requirements = extract_story_requirements(
            epic_content, story_info['story_number']
        )

        return {
            'functional_requirements': requirements['functional'],
            'user_stories': requirements['user_stories'],
            'acceptance_criteria': requirements['acceptance_criteria'],
            'source_citations': requirements['citations']
        }

    def gather_architecture_context(
        self, story_info: dict, config: dict
    ) -> dict:
        """
        Step 3: Gather architecture context based on story type.
        Load relevant architecture sections.
        """
        story_type = story_info['story_type']
        arch_path = config['architectureLocation']

        # Check if architecture is sharded (v4+) or monolithic
        arch_is_sharded = config.get('architectureVersion', 3) >= 4

        if arch_is_sharded:
            # Load specific architecture sections based on story type
            if story_type == 'backend':
                sections = ['data-model', 'api-design', 'backend-services']
            elif story_type == 'frontend':
                sections = ['frontend-architecture', 'ui-components', 'state-management']
            else:  # fullstack
                sections = ['data-model', 'api-design', 'backend-services',
                           'frontend-architecture', 'ui-components']

            arch_context = {}
            for section in sections:
                section_path = f"{arch_path}/{section}.md"
                content = self.load_cloud_storage_file(section_path)
                arch_context[section] = content

        else:
            # Load monolithic architecture
            arch_content = self.load_cloud_storage_file(arch_path)
            arch_context = {'full_architecture': arch_content}

        return arch_context

    def verify_project_structure(
        self, story_info: dict, config: dict
    ) -> str:
        """
        Step 4: Verify project structure alignment.
        Check if actual project structure matches architecture.
        """
        # This would typically call a Cloud Function that:
        # 1. Clones/accesses the repository
        # 2. Verifies directory structure
        # 3. Checks for key files
        # 4. Returns notes on any mismatches

        # For ADK implementation, this could be a tool/function call
        verification_result = call_cloud_function(
            'verify-project-structure',
            {
                'project_id': self.project_id,
                'story_type': story_info['story_type']
            }
        )

        return verification_result['notes']

    def populate_story_template(
        self,
        story_info: dict,
        requirements: dict,
        arch_context: dict,
        structure_notes: str,
        config: dict
    ) -> dict:
        """
        Step 5: Populate story template with gathered information.
        """
        # Load story template
        template = self.load_cloud_storage_file(
            'gs://bmad-templates/story-tmpl.yaml'
        )

        # Populate template with SM agent
        story_content = call_agent(
            'sm-agent',
            {
                'task': 'populate_story_template',
                'template': template,
                'story_info': story_info,
                'requirements': requirements,
                'architecture_context': arch_context,
                'structure_notes': structure_notes
            }
        )

        # Save story to Firestore + Cloud Storage
        story_doc = {
            'story_id': story_info['story_id'],
            'epic_id': story_info['epic_id'],
            'title': story_info['title'],
            'status': 'draft',
            'story_type': story_info['story_type'],
            'created_at': firestore.SERVER_TIMESTAMP,
            'created_by': 'sm-agent',
            'content_path': f"gs://bmad-artifacts/{self.project_id}/stories/{story_info['story_id']}.md"
        }

        # Save to Firestore
        self.firestore_client.collection('projects').document(
            self.project_id
        ).collection('stories').document(
            story_info['story_id']
        ).set(story_doc)

        # Save content to Cloud Storage
        save_to_cloud_storage(
            story_doc['content_path'],
            story_content
        )

        return story_doc

    def execute_draft_checklist(self, story: dict) -> dict:
        """
        Step 6: Execute story-draft-checklist validation.
        """
        checklist_results = call_agent(
            'sm-agent',
            {
                'task': 'execute_checklist',
                'checklist': 'story-draft-checklist',
                'artifact': story['content_path']
            }
        )

        return checklist_results

    def save_state(self):
        """Persist workflow state to Firestore for resumability."""
        workflow_ref = self.firestore_client.collection('workflows').document(
            f"create-next-story-{self.project_id}-{int(time.time())}"
        )

        workflow_ref.set({
            'workflow_type': 'create-next-story',
            'project_id': self.project_id,
            'current_step': self.state['step'],
            'state': self.state,
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)

    def load_cloud_storage_file(self, gs_path: str) -> str:
        """Helper to load file from Cloud Storage."""
        bucket_name, blob_name = parse_gs_url(gs_path)
        bucket = self.storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        return blob.download_as_text()


# Deploy as Reasoning Engine
reasoning_engine = reasoning_engines.ReasoningEngine.create(
    CreateNextStoryWorkflow,
    requirements=[
        "google-cloud-firestore",
        "google-cloud-storage",
        "google-cloud-aiplatform"
    ],
    display_name="create-next-story-workflow"
)
```

### 6.4 Simple Tasks (Cloud Functions)

**Purpose**: Execute stateless, single-step operations.

**Examples**:
- Template rendering
- File validation
- Data transformation
- Utility operations

**Implementation**: Cloud Functions (2nd gen)

**Example: Template Rendering Function**

```python
from flask import Request, jsonify
from google.cloud import storage
import yaml

def render_template(request: Request):
    """
    Cloud Function to render YAML templates.
    """
    data = request.get_json()
    template_name = data['template_name']
    template_data = data['data']
    mode = data.get('mode', 'interactive')

    # Load template from Cloud Storage
    storage_client = storage.Client()
    bucket = storage_client.bucket('bmad-templates')
    blob = bucket.blob(f"templates/{template_name}.yaml")
    template_content = blob.download_as_text()
    template = yaml.safe_load(template_content)

    # Render template
    if mode == 'interactive':
        # Elicit missing information (would involve back-and-forth)
        rendered = render_interactive(template, template_data)
    else:
        # YOLO mode: use provided data only
        rendered = render_yolo(template, template_data)

    return jsonify({
        'status': 'success',
        'rendered_content': rendered
    })
```

### 6.5 Workflow State Management

**Challenge**: Workflows must be resumable, trackable, and auditable.

**Solution**: Firestore workflow state collection

**Schema**:
```javascript
/workflows/{workflow_id}
  - workflow_type: "create-next-story" | "review-story" | ...
  - project_id: "project-123"
  - status: "running" | "paused" | "complete" | "failed"
  - current_step: 3
  - total_steps: 6
  - state: { /* workflow-specific state */ }
  - created_at: Timestamp
  - updated_at: Timestamp
  - created_by: "user-id" | "agent-id"
  - error: { /* error details if failed */ }
```

**Resume Logic**:
```python
def resume_workflow(workflow_id: str):
    """Resume a paused or failed workflow from last successful step."""
    workflow_ref = firestore_client.collection('workflows').document(workflow_id)
    workflow_doc = workflow_ref.get()
    workflow_data = workflow_doc.to_dict()

    # Instantiate workflow class
    workflow_class = get_workflow_class(workflow_data['workflow_type'])
    workflow_instance = workflow_class(workflow_data['project_id'])

    # Restore state
    workflow_instance.state = workflow_data['state']

    # Resume from current step
    result = workflow_instance.resume_from_step(workflow_data['current_step'])

    return result
```

### 6.6 Error Handling and Retry Logic

**Patterns**:

1. **Exponential Backoff**: Retry with increasing delays
2. **Circuit Breaker**: Fail fast if service is down
3. **Graceful Degradation**: Fallback to simpler logic
4. **User Escalation**: Prompt user for input when stuck

**Example**:
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def call_agent_with_retry(agent_id: str, request: dict):
    """Call agent with automatic retry logic."""
    try:
        response = vertex_ai_client.invoke_agent(agent_id, request)
        return response
    except Exception as e:
        logger.error(f"Agent call failed: {e}")
        # Will retry up to 3 times with exponential backoff
        raise
```

---

## 7. Data Storage Strategy

### 7.1 Storage Architecture Overview

BMad ADK uses a **hybrid storage approach**:
- **Firestore**: Structured, queryable data (metadata, state, gates, stories)
- **Cloud Storage**: Unstructured, large documents (artifacts, templates, KB)
- **Vertex AI Search**: Indexed knowledge base for semantic search (RAG)

### 7.2 Firestore Schema Design

#### 7.2.1 Projects Collection

```javascript
/projects/{project_id}
  - name: "My Project"
  - description: "Project description"
  - project_type: "greenfield" | "brownfield"
  - workflow_type: "fullstack" | "service" | "ui"
  - status: "planning" | "development" | "complete"
  - created_at: Timestamp
  - updated_at: Timestamp
  - created_by: "user-id"

  // Core configuration (core-config.yaml equivalent)
  - config:
      - projectRoot: "/workspace/my-project"
      - devStoryLocation: "docs/stories"
      - epicLocation: "docs/prd/{epic_id}"
      - architectureLocation: "docs/architecture"
      - architectureVersion: 4
      - devLoadAlwaysFiles: ["docs/technical-preferences.md"]
      // ... all core-config fields

  // Subcollections
  /stories/{story_id}        // Story documents
  /artifacts/{artifact_id}    // Artifact metadata
  /gates/{gate_id}            // QA gate decisions
  /sessions/{session_id}      // Agent sessions
```

#### 7.2.2 Stories Collection

```javascript
/projects/{project_id}/stories/{story_id}
  - story_id: "1.1"
  - epic_id: "1"
  - title: "User authentication"
  - status: "draft" | "approved" | "in_progress" | "review" | "done"
  - story_type: "backend" | "frontend" | "fullstack"
  - priority: "P0" | "P1" | "P2"
  - created_at: Timestamp
  - updated_at: Timestamp
  - created_by: "sm-agent"

  // Story content reference
  - content_path: "gs://bmad-artifacts/{project_id}/stories/{story_id}.md"

  // Tasks
  - tasks: [
      { description: "Implement user model", status: "pending" },
      { description: "Create auth endpoint", status: "pending" }
    ]

  // Dev Agent Record
  - dev_notes: {
      - started_at: Timestamp
      - completed_at: Timestamp
      - implementation_notes: "Used JWT for tokens..."
      - test_results: "All tests passing"
    }

  // QA Results
  - qa_results: {
      - reviewed_at: Timestamp
      - reviewed_by: "qa-agent"
      - gate_id: "1.1-user-auth-gate"
      - decision: "pass" | "concerns" | "fail" | "waived"
    }

  // Change Log
  - change_log: [
      {
        date: Timestamp,
        agent: "sm-agent",
        action: "Created story",
        details: "..."
      },
      {
        date: Timestamp,
        agent: "dev-agent",
        action: "Implemented story",
        details: "..."
      }
    ]
```

#### 7.2.3 Gates Collection

```javascript
/projects/{project_id}/gates/{gate_id}
  - gate_id: "1.1-user-auth-20251014"
  - story_id: "1.1"
  - decision: "pass" | "concerns" | "fail" | "waived"
  - rationale: "Story meets all acceptance criteria..."
  - created_at: Timestamp
  - created_by: "qa-agent"

  // Risk assessment reference
  - risk_assessment_path: "gs://bmad-artifacts/{project_id}/qa/assessments/{story_id}-risk-{date}.md"

  // Test design reference
  - test_design_path: "gs://bmad-artifacts/{project_id}/qa/assessments/{story_id}-test-design-{date}.md"

  // Requirements traceability reference
  - traceability_path: "gs://bmad-artifacts/{project_id}/qa/assessments/{story_id}-traceability-{date}.md"

  // NFR assessment reference (if applicable)
  - nfr_assessment_path: "gs://bmad-artifacts/{project_id}/qa/assessments/{story_id}-nfr-{date}.md"

  // Concerns (if decision == "concerns")
  - concerns: [
      { category: "implementation", description: "Error handling incomplete" },
      { category: "testing", description: "Edge cases not covered" }
    ]

  // Waiver justification (if decision == "waived")
  - waiver_justification: "Story is throwaway prototype, will be rewritten"
```

#### 7.2.4 Artifacts Collection

```javascript
/projects/{project_id}/artifacts/{artifact_id}
  - artifact_id: "prd-20251014"
  - type: "project-brief" | "prd" | "architecture" | "frontend-spec" | ...
  - version: 1
  - created_at: Timestamp
  - updated_at: Timestamp
  - created_by: "pm-agent"

  // Content reference
  - content_path: "gs://bmad-artifacts/{project_id}/{type}/{artifact_id}.md"

  // Ownership (section-level permissions)
  - ownership: {
      - owner: "pm-agent"
      - owner_sections: ["Requirements", "User Stories"]
      - editor_sections: ["Project Overview", "Timeline"]
      - editors: ["po-agent", "architect"]
    }

  // Versioning (subcollection for history)
  /versions/{version_id}
    - version: 2
    - content_path: "gs://bmad-artifacts/{project_id}/{type}/{artifact_id}-v2.md"
    - changed_by: "pm-agent"
    - changed_at: Timestamp
    - change_summary: "Updated success criteria"
```

#### 7.2.5 Sessions Collection

```javascript
/projects/{project_id}/sessions/{session_id}
  - session_id: "session-abc123"
  - agent_id: "pm-agent"
  - user_id: "user-123"
  - started_at: Timestamp
  - last_activity_at: Timestamp
  - expires_at: Timestamp (TTL)

  // Conversation context
  - context: {
      - conversation_history: [
        { role: "user", content: "Create a PRD for my SaaS app" },
        { role: "agent", content: "I'd love to help. What problem does your app solve?" },
        // ... conversation continues
      ]
      - loaded_files: ["gs://bmad-data/technical-preferences.md"]
      - current_task: "create_prd"
      - task_state: { /* task-specific state */ }
    }
```

#### 7.2.6 Workflows Collection

```javascript
/workflows/{workflow_id}
  - workflow_id: "create-next-story-project-123-1697290000"
  - workflow_type: "create-next-story"
  - project_id: "project-123"
  - status: "running" | "paused" | "complete" | "failed"
  - current_step: 3
  - total_steps: 6
  - created_at: Timestamp
  - updated_at: Timestamp
  - created_by: "user-123"

  // Workflow state (for resumability)
  - state: {
      - story_info: { story_id: "1.2", epic_id: "1", ... }
      - requirements: { /* gathered requirements */ }
      - arch_context: { /* gathered architecture */ }
      // ... step-specific state
    }

  // Error information (if failed)
  - error: {
      - step: 4
      - error_type: "ValidationError"
      - message: "Project structure mismatch detected"
      - stack_trace: "..."
    }
```

### 7.3 Cloud Storage Bucket Organization

#### 7.3.1 Bucket Structure

```
bmad-templates/
├── templates/
│   ├── project-brief-tmpl.yaml
│   ├── prd-tmpl.yaml
│   ├── brownfield-prd-tmpl.yaml
│   ├── architecture-tmpl.yaml
│   ├── fullstack-architecture-tmpl.yaml
│   ├── front-end-spec-tmpl.yaml
│   ├── story-tmpl.yaml
│   ├── qa-gate-tmpl.yaml
│   └── ...

bmad-data/
├── checklists/
│   ├── po-master-checklist.md
│   ├── story-draft-checklist.md
│   ├── story-dod-checklist.md
│   ├── pm-checklist.md
│   ├── architect-checklist.md
│   └── change-checklist.md
├── frameworks/
│   ├── test-levels-framework.md
│   └── test-priorities-matrix.md
├── knowledge/
│   ├── technical-preferences.md
│   ├── brainstorming-techniques.md
│   └── elicitation-methods.md
└── tasks/
    ├── create-next-story.md (for reference, not execution)
    ├── review-story.md
    └── ... (all task documentation)

bmad-kb/
├── bmad-methodology.md
├── agent-roles.md
├── workflow-guides.md
├── quality-gates.md
└── ... (knowledge base articles)

bmad-artifacts/
├── {project_id}/
│   ├── project-brief.md
│   ├── prd.md or prd/ (sharded)
│   ├── architecture.md or architecture/ (sharded)
│   ├── frontend-spec.md
│   ├── stories/
│   │   ├── 1.1.user-auth.md
│   │   ├── 1.2.password-reset.md
│   │   └── ...
│   └── qa/
│       └── assessments/
│           ├── 1.1-risk-20251014.md
│           ├── 1.1-test-design-20251014.md
│           ├── 1.1-traceability-20251014.md
│           └── ...
```

#### 7.3.2 Access Control

**IAM Roles**:
- `bmad-artifacts` bucket:
  - Users: Read/Write their own project files
  - Agents: Read/Write via service account
- `bmad-templates` bucket:
  - Users: Read-only
  - Agents: Read-only
- `bmad-data` bucket:
  - Users: Read-only
  - Agents: Read-only
- `bmad-kb` bucket:
  - Users: Read-only
  - Agents: Read-only (indexed by Vertex AI Search)

**Signed URLs**: For temporary, limited access (e.g., IDE file sync)

### 7.4 Versioning Strategy

#### 7.4.1 Cloud Storage Versioning

**Enable object versioning** on all buckets:
- Allows rollback to previous versions
- Preserves history for audit trail
- Automatic versioning (no manual tracking)

**Lifecycle Policies**:
- Delete versions older than 90 days (configurable)
- Archive old versions to Nearline/Coldline storage for cost savings

#### 7.4.2 Firestore Versioning

**Subcollections for History**:
```javascript
/projects/{project_id}/artifacts/{artifact_id}/versions/{version_id}
```

**Change Tracking**:
- Every update creates new version document
- Preserves who changed what and when
- Allows comparison between versions

### 7.5 Backup and Recovery

**Automated Backups**:
1. **Firestore**: Enable automated backups (daily)
2. **Cloud Storage**: Object versioning + lifecycle policies
3. **Export**: Weekly export to BigQuery for analytics

**Recovery Procedures**:
1. **Point-in-Time Recovery**: Restore Firestore to specific timestamp
2. **Object Recovery**: Restore specific file version from Cloud Storage
3. **Full Project Recovery**: Restore all artifacts and metadata for a project

---

*[Sections 8-12 continue with API Gateway Design, Security, Scalability, Cost Optimization, and Migration Approach...]*

---

## 13. Appendices

### 13.1 Glossary

#### Google Cloud & ADK Terms
- **Google ADK**: Google's Agent Development Kit - Open-source Python/Java framework for building AI agents (`pip install google-adk`). Official Google framework, NOT a generic term. Documentation: https://google.github.io/adk-docs/
- **google-adk**: Python package name for Google's Agent Development Kit
- **Vertex AI**: Google Cloud's AI/ML platform - Managed infrastructure for training and deploying models
- **Vertex AI Agent Builder**: UI-based tool for configuring agents without code - Can import Google ADK agent definitions
- **Vertex AI Agent Engine**: Managed service for deploying and running Google ADK agents at scale in production
- **Reasoning Engine**: Vertex AI service for complex multi-step workflows with decision logic and state management
- **GCP**: Google Cloud Platform
- **Firestore**: NoSQL document database (Cloud Firestore)
- **Cloud Storage**: Object storage service (Google Cloud Storage)
- **Cloud Functions**: Serverless functions (Google Cloud Functions)
- **Cloud Run**: Serverless containers (Google Cloud Run)
- **Cloud Workflows**: Orchestration service for multi-step processes

#### BMad Framework Terms
- **BMad**: Business Methodology for Agile Development - AI-driven development framework with 10 specialized agents
- **BMad Core v4**: Current file-based implementation of BMad framework
- **Greenfield**: New project with no existing codebase
- **Brownfield**: Existing project with existing codebase requiring enhancement/documentation
- **Gate**: QA quality gate decision (PASS/CONCERNS/FAIL/WAIVED)
- **Epic**: Collection of related user stories
- **Story**: User story or development task
- **YOLO Mode**: Fast-track mode with minimal interaction (rapid generation)

#### BMad Agents
- **Analyst (Mary)**: Research & discovery specialist
- **PM (John)**: Product Manager - Product strategy and PRD creation
- **UX Expert (Sally)**: User experience specialist
- **Architect (Mike)**: Technical architecture and system design
- **PO (Sarah)**: Product Owner - Validation & process management
- **SM (Bob)**: Scrum Master - Story creation and refinement
- **Dev (Kyle)**: Developer - Implementation specialist
- **QA (Quinn)**: Quality Assurance - Testing and validation
- **BMad-Master (Claude)**: Universal executor - KB mode and command routing
- **BMad-Orchestrator**: Web platform agent with morphing capabilities

#### Document & Workflow Terms
- **PRD**: Product Requirements Document
- **DoD**: Definition of Done
- **NFR**: Non-Functional Requirements
- **RAG**: Retrieval Augmented Generation
- **KB Mode**: Knowledge Base consultation mode (BMad-Master feature)
- **Template**: YAML-based document template for standardized output
- **Checklist**: Validation framework with pass/fail criteria
- **Elicitation**: Interactive question-asking process to gather requirements

#### Technical Terms
- **Tool**: Function that an agent can call (Google ADK concept)
- **Session**: Conversation state and context management (Google ADK concept)
- **Memory**: Persistent storage for agent learning and context (Google ADK concept)
- **Callback**: Event hook for monitoring and observability (Google ADK concept)
- **WorkflowAgent**: Google ADK agent type for orchestrating multi-step processes (sequential/parallel/loop)

### 13.2 Related Documents

- **Task 6.2**: [Agent Configuration Specifications](agent-configurations/)
- **Task 6.3**: [Reasoning Engine Workflow Implementations](reasoning-engine-workflows/)
- **Task 6.4**: [API Specifications](api-specifications.md)
- **Task 6.5**: [Storage Schema Design](storage-schema.md)
- **Task 6.6**: [Deployment Guide](deployment-guide.md)
- **Task 6.7**: [Migration Strategy](migration-strategy.md)
- **Task 6.8**: [Infrastructure as Code](infrastructure-as-code/)

### 13.3 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-14 | Claude Code (AI Agent) | Initial architecture design document |
| 1.1 | 2025-10-15 | Claude Code (AI Agent) | Added Google ADK clarification: Section 2.3.1 (Understanding Google ADK), updated all agent/workflow examples with Google ADK patterns, enhanced glossary with Google ADK vs Vertex AI distinctions, added framework comparison table |

### 13.4 Document Status

**Status**: Complete - Enhanced with Google ADK Specifics
**Last Updated**: 2025-10-15
**Review Status**: Pending review
**Approval Status**: Pending approval

---

**End of Architecture Design Document**
