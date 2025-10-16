# BMad Framework - API Specifications

**Document Version**: 1.0
**Created**: 2025-10-15
**Last Updated**: 2025-10-15
**Status**: Complete
**Framework**: BMad Core v4 → Google ADK + Vertex AI
**API Version**: v1

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [API Overview](#2-api-overview)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Agent API](#4-agent-api)
5. [Workflow API](#5-workflow-api)
6. [Artifact API](#6-artifact-api)
7. [Project API](#7-project-api)
8. [Configuration API](#8-configuration-api)
9. [Template API](#9-template-api)
10. [State Management API](#10-state-management-api)
11. [Knowledge Base (KB) Mode API](#11-knowledge-base-kb-mode-api)
12. [Team Bundle API](#12-team-bundle-api)
13. [Common Schemas](#13-common-schemas)
14. [Error Handling](#14-error-handling)
15. [Rate Limiting & Quotas](#15-rate-limiting--quotas)
16. [OpenAPI 3.0 Specification](#16-openapi-30-specification)

---

## 1. Executive Summary

### 1.1 Purpose

This document provides comprehensive REST API specifications for the BMad framework implemented on Google Cloud Platform using Google ADK. The API enables programmatic access to all BMad capabilities including agent invocation, workflow orchestration, artifact management, and knowledge base access.

### 1.2 API Design Principles

- **RESTful**: Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **Stateless**: Each request contains all necessary context
- **JSON-First**: All request/response bodies use JSON format
- **Idempotent**: Safe retry behavior with idempotency keys
- **Versioned**: API version in URL path (e.g., `/v1/`)
- **Paginated**: List operations support cursor-based pagination
- **Filtered**: Query parameters for filtering and sorting
- **Secure**: OAuth 2.0 authentication with scope-based authorization

### 1.3 Base URL

```
Production:  https://bmad-api.example.com/v1
Staging:     https://bmad-api-staging.example.com/v1
Development: https://bmad-api-dev.example.com/v1
```

### 1.4 API Categories

| Category | Endpoints | Purpose |
|----------|-----------|---------|
| **Agent API** | `/agents/*` | Invoke agents, check status, manage sessions |
| **Workflow API** | `/workflows/*` | Start workflows, resume, monitor progress |
| **Artifact API** | `/artifacts/*` | Create, read, update, version documents |
| **Project API** | `/projects/*` | Manage projects, configurations, state |
| **Configuration API** | `/config/*` | Get/update core-config settings |
| **Template API** | `/templates/*` | List, render, validate templates |
| **State API** | `/state/*` | Save/load workflow and agent state |
| **KB Mode API** | `/kb/*` | Query knowledge base, navigate topics |
| **Team Bundle API** | `/bundles/*` | Load/configure team bundle settings |

### 1.5 Key Features

**Agent Invocation**
- Synchronous and asynchronous agent calls
- Session management for multi-turn conversations
- Command-based interface matching BMad's command system
- Tool execution tracking and monitoring

**Workflow Orchestration**
- Start complex multi-step workflows
- Resume workflows from checkpoints
- Monitor workflow progress in real-time
- Cancel long-running workflows

**Artifact Management**
- CRUD operations for all BMad documents (PRDs, stories, gates, etc.)
- Version history and rollback
- Document sharding and assembly
- Section-based permissions

**State Persistence**
- Save/restore agent state
- Workflow checkpoint management
- Session context preservation
- Cross-agent state sharing

### 1.6 Supported Client Types

- **Web UI**: React/Vue/Angular applications
- **IDE Plugins**: VSCode, IntelliJ, etc.
- **CLI Tools**: Command-line interfaces
- **CI/CD Pipelines**: Automated workflows
- **Custom Integrations**: Third-party systems

---

## 2. API Overview

### 2.1 Request Format

All API requests must include:

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <access_token>
X-Request-ID: <unique-request-id>  (optional, for tracing)
X-Idempotency-Key: <idempotency-key>  (optional, for POST/PUT/PATCH)
```

**URL Structure:**
```
https://{host}/v1/{resource}/{id}/{action}?{query_params}
```

**Example:**
```http
POST /v1/agents/pm/invoke
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

{
  "project_id": "proj_abc123",
  "command": "create-prd",
  "parameters": {
    "mode": "interactive",
    "template": "prd-tmpl"
  },
  "session_id": "sess_xyz789"
}
```

### 2.2 Response Format

**Success Response (2xx):**
```json
{
  "status": "success",
  "data": {
    // Response data specific to endpoint
  },
  "metadata": {
    "request_id": "req_123abc",
    "timestamp": "2025-10-15T14:30:00Z",
    "api_version": "v1"
  }
}
```

**Error Response (4xx/5xx):**
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid parameter: project_id is required",
    "details": {
      "field": "project_id",
      "constraint": "required"
    }
  },
  "metadata": {
    "request_id": "req_123abc",
    "timestamp": "2025-10-15T14:30:00Z",
    "api_version": "v1"
  }
}
```

### 2.3 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | Successful GET/PUT/PATCH/DELETE request |
| **201** | Created | Successful POST request creating a resource |
| **202** | Accepted | Async operation accepted, processing continues |
| **204** | No Content | Successful DELETE with no response body |
| **400** | Bad Request | Invalid request parameters or body |
| **401** | Unauthorized | Missing or invalid authentication token |
| **403** | Forbidden | Authenticated but insufficient permissions |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Resource state conflict (e.g., already exists) |
| **422** | Unprocessable Entity | Valid syntax but semantic errors |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server-side error |
| **503** | Service Unavailable | Service temporarily unavailable |

### 2.4 Pagination

List endpoints support cursor-based pagination:

**Request:**
```http
GET /v1/artifacts?project_id=proj_abc123&page_size=20&page_token=eyJvZmZzZXQi...
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "items": [...],
    "pagination": {
      "page_size": 20,
      "next_page_token": "eyJvZmZzZXQiOjIwfQ==",
      "has_more": true,
      "total_count": 157
    }
  }
}
```

### 2.5 Filtering & Sorting

**Filtering:**
```http
GET /v1/artifacts?project_id=proj_abc123&type=story&status=in_progress
```

**Sorting:**
```http
GET /v1/artifacts?project_id=proj_abc123&sort_by=created_at&sort_order=desc
```

**Multiple Filters:**
```http
GET /v1/stories?epic=epic1&status=draft,approved&assigned_to=dev
```

### 2.6 Async Operations

Long-running operations return 202 Accepted with operation tracking:

**Request:**
```http
POST /v1/workflows/create-next-story/start
```

**Response (202 Accepted):**
```json
{
  "status": "accepted",
  "data": {
    "operation_id": "op_xyz789",
    "workflow_id": "wf_abc123",
    "status": "running",
    "status_url": "/v1/workflows/wf_abc123/status",
    "estimated_completion": "2025-10-15T14:35:00Z"
  }
}
```

**Check Status:**
```http
GET /v1/workflows/wf_abc123/status
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "workflow_id": "wf_abc123",
    "status": "completed",
    "progress": 100,
    "current_step": "step_6_checklist",
    "result": {
      "story": {...},
      "checklist_results": {...}
    }
  }
}
```

---

## 3. Authentication & Authorization

### 3.1 Authentication Methods

**OAuth 2.0 Bearer Token** (Primary)
```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

**Service Account Key** (Service-to-Service)
```http
Authorization: Bearer $(gcloud auth application-default print-access-token)
```

**API Key** (Read-Only, Limited Access)
```http
X-API-Key: bmad_live_sk_abc123xyz...
```

### 3.2 OAuth 2.0 Flows

**Authorization Code Flow** (Web/Mobile Apps)
```
1. User → Authorization Server: GET /oauth/authorize
2. User authenticates and grants consent
3. Authorization Server → App: Redirect with code
4. App → Token Server: POST /oauth/token with code
5. Token Server → App: access_token + refresh_token
```

**Client Credentials Flow** (Machine-to-Machine)
```
1. App → Token Server: POST /oauth/token
   {
     "grant_type": "client_credentials",
     "client_id": "...",
     "client_secret": "...",
     "scope": "bmad.agents.invoke bmad.artifacts.read"
   }
2. Token Server → App: access_token
```

### 3.3 Scopes

| Scope | Description | Required For |
|-------|-------------|--------------|
| **bmad.agents.invoke** | Invoke any agent | Agent API |
| **bmad.agents.read** | Read agent status, logs | Agent status checks |
| **bmad.workflows.manage** | Start/stop workflows | Workflow API |
| **bmad.artifacts.read** | Read artifacts | Artifact read operations |
| **bmad.artifacts.write** | Create/update artifacts | Artifact write operations |
| **bmad.projects.manage** | Create/update projects | Project management |
| **bmad.config.read** | Read configuration | Config read operations |
| **bmad.config.write** | Update configuration | Config write operations |
| **bmad.kb.query** | Query knowledge base | KB Mode operations |
| **bmad.admin** | Full admin access | All operations |

**Scope Combinations:**
```json
{
  "scope": "bmad.agents.invoke bmad.artifacts.write bmad.workflows.manage"
}
```

### 3.4 Authorization Model

**Role-Based Access Control (RBAC)**

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Admin** | Full access to all resources | System administrators |
| **Project Owner** | Full access within project | Project leads |
| **Developer** | Invoke agents, read/write artifacts | Development team |
| **Viewer** | Read-only access | Stakeholders, auditors |
| **Agent** | Specific agent invocation only | Automated workflows |

**Resource-Level Permissions:**
```json
{
  "project_id": "proj_abc123",
  "permissions": {
    "agents": ["pm", "dev", "qa"],
    "artifacts": {
      "read": ["*"],
      "write": ["stories", "gates"],
      "delete": []
    }
  }
}
```

### 3.5 Token Management

**Access Token Lifetime:** 1 hour
**Refresh Token Lifetime:** 30 days

**Token Refresh:**
```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=eyJhbGci...&client_id=...&client_secret=...
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJSUzI1NiIs...",
  "scope": "bmad.agents.invoke bmad.artifacts.write"
}
```

### 3.6 Security Best Practices

1. **Use HTTPS Only**: All API calls must use TLS 1.2+
2. **Rotate Tokens**: Refresh tokens before expiration
3. **Store Securely**: Use secure storage for tokens (e.g., Secret Manager)
4. **Least Privilege**: Request minimum required scopes
5. **Validate Tokens**: Server-side token validation on every request
6. **Audit Logging**: Log all authentication events
7. **IP Allowlisting**: Restrict access by IP range (optional)
8. **Rate Limiting**: Enforce per-user and per-client rate limits

---

## 4. Agent API

### 4.1 Overview

The Agent API enables invocation of BMad's 10 specialized agents, session management, and agent status monitoring.

**Base Path:** `/v1/agents`

**Supported Agents:**
- `analyst` - Mary (Research & Discovery)
- `pm` - John (Product Strategy)
- `ux-expert` - Sally (User Experience)
- `architect` - Winston (System Design)
- `po` - Sarah (Validation & Process)
- `sm` - Bob (Story Creation)
- `dev` - James (Implementation)
- `qa` - Quinn (Test Architect)
- `bmad-master` - Universal Executor
- `bmad-orchestrator` - Web Platform Agent

### 4.2 Invoke Agent

**Endpoint:** `POST /v1/agents/{agent_id}/invoke`

**Description:** Invoke an agent to execute a command or handle a natural language request.

**Path Parameters:**
- `agent_id` (string, required): Agent identifier (e.g., "pm", "dev", "qa")

**Request Body:**
```json
{
  "project_id": "proj_abc123",
  "command": "create-prd",
  "parameters": {
    "mode": "interactive",
    "template": "prd-tmpl"
  },
  "session_id": "sess_xyz789",
  "context": {
    "previous_artifacts": ["docs/project-brief.md"],
    "user_preferences": {...}
  },
  "sync": false
}
```

**Request Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project_id` | string | Yes | Project identifier |
| `command` | string | Conditional | Specific command to execute (e.g., "create-prd", "create-next-story") |
| `message` | string | Conditional | Natural language request (if no command specified) |
| `parameters` | object | No | Command-specific parameters |
| `session_id` | string | No | Session ID for multi-turn conversations (created if not provided) |
| `context` | object | No | Additional context for agent execution |
| `sync` | boolean | No | If true, wait for completion; if false, return immediately (default: false) |

**Response (202 Accepted - Async):**
```json
{
  "status": "accepted",
  "data": {
    "invocation_id": "inv_abc123",
    "agent_id": "pm",
    "session_id": "sess_xyz789",
    "status": "processing",
    "status_url": "/v1/agents/pm/invocations/inv_abc123",
    "estimated_completion": "2025-10-15T14:35:00Z"
  },
  "metadata": {
    "request_id": "req_123abc",
    "timestamp": "2025-10-15T14:30:00Z"
  }
}
```

**Response (200 OK - Sync):**
```json
{
  "status": "success",
  "data": {
    "invocation_id": "inv_abc123",
    "agent_id": "pm",
    "session_id": "sess_xyz789",
    "result": {
      "artifacts_created": [
        {
          "artifact_id": "art_xyz789",
          "type": "prd",
          "path": "docs/prd/index.md",
          "url": "/v1/artifacts/art_xyz789"
        }
      ],
      "message": "PRD created successfully. Ready for PO validation.",
      "next_steps": [
        "Review PRD sections",
        "Hand off to PO for validation",
        "Prepare for architecture phase"
      ]
    },
    "execution_time_ms": 15234
  }
}
```

**Example - Invoke PM Agent:**
```bash
curl -X POST https://bmad-api.example.com/v1/agents/pm/invoke \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj_abc123",
    "command": "create-prd",
    "parameters": {
      "mode": "interactive",
      "template": "prd-tmpl"
    },
    "session_id": "sess_xyz789"
  }'
```

### 4.3 Get Invocation Status

**Endpoint:** `GET /v1/agents/{agent_id}/invocations/{invocation_id}`

**Description:** Check the status of an async agent invocation.

**Path Parameters:**
- `agent_id` (string, required): Agent identifier
- `invocation_id` (string, required): Invocation identifier

**Response (200 OK - Processing):**
```json
{
  "status": "success",
  "data": {
    "invocation_id": "inv_abc123",
    "agent_id": "pm",
    "status": "processing",
    "progress": 45,
    "current_step": "Eliciting MVP scope",
    "started_at": "2025-10-15T14:30:00Z",
    "estimated_completion": "2025-10-15T14:35:00Z"
  }
}
```

**Response (200 OK - Completed):**
```json
{
  "status": "success",
  "data": {
    "invocation_id": "inv_abc123",
    "agent_id": "pm",
    "status": "completed",
    "progress": 100,
    "result": {
      "artifacts_created": [...],
      "message": "PRD created successfully."
    },
    "started_at": "2025-10-15T14:30:00Z",
    "completed_at": "2025-10-15T14:34:23Z",
    "execution_time_ms": 263000
  }
}
```

**Status Values:**
- `queued` - Invocation queued, not yet started
- `processing` - Agent is actively working
- `waiting_input` - Agent needs user input to continue
- `completed` - Invocation completed successfully
- `failed` - Invocation failed with error
- `cancelled` - Invocation cancelled by user

### 4.4 Cancel Invocation

**Endpoint:** `POST /v1/agents/{agent_id}/invocations/{invocation_id}/cancel`

**Description:** Cancel a running agent invocation.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "invocation_id": "inv_abc123",
    "status": "cancelled",
    "cancelled_at": "2025-10-15T14:32:15Z"
  }
}
```

### 4.5 List Agents

**Endpoint:** `GET /v1/agents`

**Description:** List all available agents with their capabilities.

**Query Parameters:**
- `operational_mode` (string, optional): Filter by mode (e.g., "greenfield_planning", "brownfield_enhancement")
- `include_tools` (boolean, optional): Include tool definitions (default: false)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "agents": [
      {
        "agent_id": "pm",
        "name": "John",
        "display_name": "John - Product Manager",
        "icon": "📋",
        "description": "Investigative Product Strategist & Market-Savvy PM",
        "operational_modes": [
          "greenfield_planning",
          "brownfield_enhancement",
          "course_correction"
        ],
        "commands": [
          {
            "command": "create-prd",
            "description": "Create Product Requirements Document",
            "parameters": ["mode", "template"]
          },
          {
            "command": "shard-prd",
            "description": "Shard PRD into epics and stories"
          }
        ],
        "endpoint": "/v1/agents/pm/invoke"
      }
      // ... other agents
    ]
  }
}
```

### 4.6 Get Agent Details

**Endpoint:** `GET /v1/agents/{agent_id}`

**Description:** Get detailed information about a specific agent.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "agent_id": "qa",
    "name": "Quinn",
    "display_name": "Quinn - Test Architect",
    "icon": "🔍",
    "description": "Meticulous Quality Architect & Risk-Aware Test Strategist",
    "version": "1.0.0",
    "model": {
      "model_id": "gemini-2.0-flash-001",
      "temperature": 0.5
    },
    "commands": [
      {
        "command": "review-story",
        "description": "Comprehensive story review with gate decision",
        "parameters": {
          "story_path": {
            "type": "string",
            "required": true,
            "description": "Path to story file"
          },
          "depth": {
            "type": "string",
            "required": false,
            "default": "standard",
            "enum": ["standard", "deep"]
          }
        }
      }
      // ... other commands
    ],
    "operational_modes": ["development_cycle", "mid_dev_checks"],
    "capabilities": {
      "active_refactoring": true,
      "gate_decisions": true,
      "risk_assessment": true
    },
    "resources": {
      "tasks": ["review-story.md", "risk-profile.md", "test-design.md"],
      "checklists": ["story-dod-checklist.md", "gate-checklist.md"],
      "kb_mode_enabled": true
    }
  }
}
```

### 4.7 List Agent Sessions

**Endpoint:** `GET /v1/agents/{agent_id}/sessions`

**Description:** List all active sessions for an agent.

**Query Parameters:**
- `project_id` (string, optional): Filter by project
- `status` (string, optional): Filter by status (active, expired)
- `page_size` (integer, optional): Number of results per page (default: 20)
- `page_token` (string, optional): Pagination token

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "sessions": [
      {
        "session_id": "sess_xyz789",
        "agent_id": "pm",
        "project_id": "proj_abc123",
        "status": "active",
        "created_at": "2025-10-15T14:00:00Z",
        "last_activity": "2025-10-15T14:30:00Z",
        "expires_at": "2025-10-15T15:00:00Z",
        "message_count": 12
      }
      // ... more sessions
    ],
    "pagination": {
      "page_size": 20,
      "next_page_token": null,
      "has_more": false
    }
  }
}
```

### 4.8 Get Session Details

**Endpoint:** `GET /v1/agents/{agent_id}/sessions/{session_id}`

**Description:** Get detailed information about a session.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "session_id": "sess_xyz789",
    "agent_id": "pm",
    "project_id": "proj_abc123",
    "status": "active",
    "context": {
      "current_task": "create-prd",
      "completed_sections": ["executive_summary", "goals"],
      "pending_sections": ["mvp_scope", "success_metrics"]
    },
    "conversation_history": [
      {
        "timestamp": "2025-10-15T14:00:00Z",
        "role": "user",
        "content": "Create a PRD for a task management app"
      },
      {
        "timestamp": "2025-10-15T14:00:05Z",
        "role": "assistant",
        "content": "I'll help you create a comprehensive PRD..."
      }
      // ... more messages
    ],
    "created_at": "2025-10-15T14:00:00Z",
    "expires_at": "2025-10-15T15:00:00Z"
  }
}
```

### 4.9 Delete Session

**Endpoint:** `DELETE /v1/agents/{agent_id}/sessions/{session_id}`

**Description:** Delete a session and clear its context.

**Response (204 No Content)**

---

## 5. Workflow API

### 5.1 Overview

The Workflow API manages complex multi-step workflows implemented as Reasoning Engine workflows. These workflows orchestrate multiple agents and tasks to achieve higher-level objectives.

**Base Path:** `/v1/workflows`

**Available Workflows:**
- `create-next-story` - 6-step story creation workflow (SM agent)
- `review-story` - Comprehensive QA review workflow (QA agent)
- `risk-profile` - Risk assessment workflow (QA agent)
- `test-design` - Test scenario generation workflow (QA agent)
- `apply-qa-fixes` - Deterministic QA fix application (Dev agent)
- `validate-next-story` - Pre-implementation validation (PO agent)
- `execute-checklist` - Generic checklist execution (multiple agents)
- `shard-doc` - Document sharding workflow (PM/Architect agents)

### 5.2 Start Workflow

**Endpoint:** `POST /v1/workflows/{workflow_name}/start`

**Description:** Start a new workflow execution.

**Path Parameters:**
- `workflow_name` (string, required): Workflow identifier (e.g., "create-next-story")

**Request Body:**
```json
{
  "project_id": "proj_abc123",
  "parameters": {
    "epic": "epic1",
    "story_number": 2
  },
  "context": {
    "user_id": "user_123",
    "source": "ide_plugin"
  },
  "resumable": true
}
```

**Request Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project_id` | string | Yes | Project identifier |
| `parameters` | object | Yes | Workflow-specific input parameters |
| `context` | object | No | Additional execution context |
| `resumable` | boolean | No | Enable resumability (default: true) |

**Response (202 Accepted):**
```json
{
  "status": "accepted",
  "data": {
    "workflow_id": "wf_abc123",
    "workflow_name": "create-next-story",
    "status": "running",
    "progress": 0,
    "current_step": "step_0_load_config",
    "started_at": "2025-10-15T14:30:00Z",
    "estimated_completion": "2025-10-15T14:35:00Z",
    "status_url": "/v1/workflows/wf_abc123"
  }
}
```

**Example - Start create-next-story Workflow:**
```bash
curl -X POST https://bmad-api.example.com/v1/workflows/create-next-story/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj_abc123",
    "parameters": {
      "epic": "epic1",
      "story_number": 2
    }
  }'
```

### 5.3 Get Workflow Status

**Endpoint:** `GET /v1/workflows/{workflow_id}`

**Description:** Get the current status and progress of a workflow execution.

**Path Parameters:**
- `workflow_id` (string, required): Workflow execution identifier

**Response (200 OK - Running):**
```json
{
  "status": "success",
  "data": {
    "workflow_id": "wf_abc123",
    "workflow_name": "create-next-story",
    "project_id": "proj_abc123",
    "status": "running",
    "progress": 50,
    "current_step": "step_3_architecture_context",
    "steps": [
      {
        "step_id": "step_0_load_config",
        "name": "Load Configuration",
        "status": "completed",
        "started_at": "2025-10-15T14:30:00Z",
        "completed_at": "2025-10-15T14:30:02Z"
      },
      {
        "step_id": "step_1_identify_story",
        "name": "Identify Next Story",
        "status": "completed",
        "started_at": "2025-10-15T14:30:02Z",
        "completed_at": "2025-10-15T14:30:45Z"
      },
      {
        "step_id": "step_3_architecture_context",
        "name": "Gather Architecture Context",
        "status": "running",
        "started_at": "2025-10-15T14:31:30Z"
      }
      // ... more steps
    ],
    "started_at": "2025-10-15T14:30:00Z",
    "estimated_completion": "2025-10-15T14:35:00Z"
  }
}
```

**Response (200 OK - Completed):**
```json
{
  "status": "success",
  "data": {
    "workflow_id": "wf_abc123",
    "workflow_name": "create-next-story",
    "status": "completed",
    "progress": 100,
    "result": {
      "story": {
        "story_id": "epic1.2",
        "title": "Implement user authentication",
        "path": "docs/stories/epic1.2-user-authentication.md",
        "artifact_id": "art_xyz789"
      },
      "checklist_results": {
        "passed": 12,
        "failed": 0,
        "warnings": 2
      }
    },
    "steps": [
      // ... all steps with completed status
    ],
    "started_at": "2025-10-15T14:30:00Z",
    "completed_at": "2025-10-15T14:34:23Z",
    "execution_time_ms": 263000
  }
}
```

**Status Values:**
- `queued` - Workflow queued, not yet started
- `running` - Workflow is actively executing
- `paused` - Workflow paused (waiting for user input or approval)
- `completed` - Workflow completed successfully
- `failed` - Workflow failed with error
- `cancelled` - Workflow cancelled by user

### 5.4 Resume Workflow

**Endpoint:** `POST /v1/workflows/{workflow_id}/resume`

**Description:** Resume a paused workflow (e.g., after providing required input).

**Request Body:**
```json
{
  "resume_data": {
    "user_approval": true,
    "additional_context": "Proceed with story creation"
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "workflow_id": "wf_abc123",
    "status": "running",
    "resumed_at": "2025-10-15T14:35:00Z"
  }
}
```

### 5.5 Cancel Workflow

**Endpoint:** `POST /v1/workflows/{workflow_id}/cancel`

**Description:** Cancel a running or paused workflow.

**Request Body (Optional):**
```json
{
  "reason": "Requirements changed, no longer needed"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "workflow_id": "wf_abc123",
    "status": "cancelled",
    "cancelled_at": "2025-10-15T14:32:00Z",
    "partial_results": {
      "completed_steps": 3,
      "total_steps": 6
    }
  }
}
```

### 5.6 List Workflows

**Endpoint:** `GET /v1/workflows`

**Description:** List available workflow types.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "workflows": [
      {
        "workflow_name": "create-next-story",
        "display_name": "Create Next Story",
        "description": "6-step sequential workflow for story creation",
        "agent": "sm",
        "complexity": "high",
        "steps": 6,
        "estimated_duration_ms": 180000,
        "parameters": [
          {
            "name": "epic",
            "type": "string",
            "required": false,
            "description": "Epic identifier (auto-detected if not provided)"
          }
        ]
      }
      // ... more workflows
    ]
  }
}
```

### 5.7 List Workflow Executions

**Endpoint:** `GET /v1/workflows/executions`

**Description:** List workflow execution history.

**Query Parameters:**
- `project_id` (string, optional): Filter by project
- `workflow_name` (string, optional): Filter by workflow type
- `status` (string, optional): Filter by status
- `from_date` (string, optional): Filter by start date (ISO 8601)
- `to_date` (string, optional): Filter by end date (ISO 8601)
- `page_size` (integer, optional): Results per page (default: 20)
- `page_token` (string, optional): Pagination token

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "executions": [
      {
        "workflow_id": "wf_abc123",
        "workflow_name": "create-next-story",
        "project_id": "proj_abc123",
        "status": "completed",
        "started_at": "2025-10-15T14:30:00Z",
        "completed_at": "2025-10-15T14:34:23Z",
        "duration_ms": 263000
      }
      // ... more executions
    ],
    "pagination": {
      "page_size": 20,
      "next_page_token": "eyJvZmZzZXQi...",
      "has_more": true,
      "total_count": 157
    }
  }
}
```

### 5.8 Get Workflow Logs

**Endpoint:** `GET /v1/workflows/{workflow_id}/logs`

**Description:** Get execution logs for a workflow.

**Query Parameters:**
- `level` (string, optional): Filter by log level (DEBUG, INFO, WARN, ERROR)
- `limit` (integer, optional): Max number of log entries (default: 100)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "workflow_id": "wf_abc123",
    "logs": [
      {
        "timestamp": "2025-10-15T14:30:00.123Z",
        "level": "INFO",
        "step": "step_0_load_config",
        "message": "Loading core configuration for project proj_abc123"
      },
      {
        "timestamp": "2025-10-15T14:30:02.456Z",
        "level": "INFO",
        "step": "step_1_identify_story",
        "message": "Identified next story: epic1.2"
      }
      // ... more logs
    ]
  }
}
```

---

## 6. Artifact API

### 6.1 Overview

The Artifact API manages BMad documents and artifacts including PRDs, architectures, stories, gates, checklists, and other generated documents.

**Base Path:** `/v1/artifacts`

**Artifact Types:**
- `project-brief` - Initial project definition
- `prd` - Product Requirements Document
- `architecture` - System architecture document
- `story` - User story
- `gate` - QA gate decision
- `risk-assessment` - Risk profile
- `test-design` - Test strategy
- `checklist-result` - Checklist execution result

### 6.2 Create Artifact

**Endpoint:** `POST /v1/artifacts`

**Description:** Create a new artifact.

**Request Body:**
```json
{
  "project_id": "proj_abc123",
  "type": "story",
  "name": "User Authentication",
  "path": "docs/stories/epic1.2-user-authentication.md",
  "content": "# Story: User Authentication\n\n## Overview\n...",
  "metadata": {
    "epic": "epic1",
    "story_number": 2,
    "assigned_to": "dev",
    "status": "draft"
  },
  "created_by": "sm"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "artifact_id": "art_xyz789",
    "project_id": "proj_abc123",
    "type": "story",
    "name": "User Authentication",
    "path": "docs/stories/epic1.2-user-authentication.md",
    "version": 1,
    "created_by": "sm",
    "created_at": "2025-10-15T14:30:00Z",
    "url": "/v1/artifacts/art_xyz789"
  }
}
```

### 6.3 Get Artifact

**Endpoint:** `GET /v1/artifacts/{artifact_id}`

**Description:** Retrieve an artifact by ID.

**Query Parameters:**
- `version` (integer, optional): Specific version to retrieve (default: latest)
- `include_content` (boolean, optional): Include full content (default: true)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "artifact_id": "art_xyz789",
    "project_id": "proj_abc123",
    "type": "story",
    "name": "User Authentication",
    "path": "docs/stories/epic1.2-user-authentication.md",
    "content": "# Story: User Authentication\n\n## Overview\n...",
    "metadata": {
      "epic": "epic1",
      "story_number": 2,
      "assigned_to": "dev",
      "status": "in_progress"
    },
    "version": 3,
    "created_by": "sm",
    "created_at": "2025-10-15T14:30:00Z",
    "updated_by": "dev",
    "updated_at": "2025-10-15T16:45:00Z",
    "permissions": {
      "owner": "sm",
      "editors": ["dev", "qa"],
      "readers": ["*"]
    }
  }
}
```

### 6.4 Update Artifact

**Endpoint:** `PUT /v1/artifacts/{artifact_id}`

**Description:** Update an artifact (creates new version).

**Request Body:**
```json
{
  "content": "# Story: User Authentication\n\n## Overview\nUpdated content...",
  "metadata": {
    "status": "in_progress",
    "progress": 50
  },
  "updated_by": "dev",
  "change_summary": "Implemented OAuth2 authentication flow"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "artifact_id": "art_xyz789",
    "version": 4,
    "updated_at": "2025-10-15T17:00:00Z",
    "updated_by": "dev"
  }
}
```

### 6.5 Patch Artifact

**Endpoint:** `PATCH /v1/artifacts/{artifact_id}`

**Description:** Partially update artifact metadata (no version change for metadata-only updates).

**Request Body:**
```json
{
  "metadata": {
    "status": "review",
    "reviewed_by": "qa"
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "artifact_id": "art_xyz789",
    "version": 4,
    "updated_at": "2025-10-15T17:05:00Z"
  }
}
```

### 6.6 Delete Artifact

**Endpoint:** `DELETE /v1/artifacts/{artifact_id}`

**Description:** Delete an artifact (soft delete, maintains version history).

**Query Parameters:**
- `hard_delete` (boolean, optional): Permanently delete (default: false)

**Response (204 No Content)**

### 6.7 List Artifacts

**Endpoint:** `GET /v1/artifacts`

**Description:** List artifacts with filtering and pagination.

**Query Parameters:**
- `project_id` (string, required): Project identifier
- `type` (string, optional): Filter by type (comma-separated for multiple)
- `status` (string, optional): Filter by status
- `created_by` (string, optional): Filter by creator
- `from_date` (string, optional): Filter by creation date
- `search` (string, optional): Full-text search
- `sort_by` (string, optional): Sort field (default: created_at)
- `sort_order` (string, optional): asc or desc (default: desc)
- `page_size` (integer, optional): Results per page (default: 20)
- `page_token` (string, optional): Pagination token

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "artifacts": [
      {
        "artifact_id": "art_xyz789",
        "type": "story",
        "name": "User Authentication",
        "path": "docs/stories/epic1.2-user-authentication.md",
        "metadata": {
          "status": "in_progress"
        },
        "version": 4,
        "created_at": "2025-10-15T14:30:00Z",
        "updated_at": "2025-10-15T17:00:00Z"
      }
      // ... more artifacts
    ],
    "pagination": {
      "page_size": 20,
      "next_page_token": "eyJvZmZzZXQi...",
      "has_more": true,
      "total_count": 87
    }
  }
}
```

### 6.8 Get Artifact Versions

**Endpoint:** `GET /v1/artifacts/{artifact_id}/versions`

**Description:** List all versions of an artifact.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "artifact_id": "art_xyz789",
    "versions": [
      {
        "version": 4,
        "updated_by": "dev",
        "updated_at": "2025-10-15T17:00:00Z",
        "change_summary": "Implemented OAuth2 authentication flow",
        "size_bytes": 12543
      },
      {
        "version": 3,
        "updated_by": "sm",
        "updated_at": "2025-10-15T15:30:00Z",
        "change_summary": "Added acceptance criteria",
        "size_bytes": 9876
      }
      // ... more versions
    ]
  }
}
```

### 6.9 Restore Artifact Version

**Endpoint:** `POST /v1/artifacts/{artifact_id}/versions/{version}/restore`

**Description:** Restore a previous version (creates new version with restored content).

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "artifact_id": "art_xyz789",
    "version": 5,
    "restored_from_version": 3,
    "restored_at": "2025-10-15T17:10:00Z"
  }
}
```

### 6.10 Get Artifact Content

**Endpoint:** `GET /v1/artifacts/{artifact_id}/content`

**Description:** Get raw artifact content (useful for large artifacts).

**Query Parameters:**
- `version` (integer, optional): Specific version (default: latest)
- `format` (string, optional): Response format (json, markdown, yaml) (default: markdown)

**Response (200 OK):**
```
Content-Type: text/markdown

# Story: User Authentication

## Overview
This story implements user authentication using OAuth2...

## Acceptance Criteria
- [ ] Users can sign in with email/password
- [ ] OAuth2 flow implemented
...
```

### 6.11 Search Artifacts

**Endpoint:** `POST /v1/artifacts/search`

**Description:** Advanced artifact search with full-text and metadata filtering.

**Request Body:**
```json
{
  "project_id": "proj_abc123",
  "query": "authentication OAuth2",
  "filters": {
    "type": ["story", "prd"],
    "status": ["in_progress", "review"],
    "created_after": "2025-10-01T00:00:00Z"
  },
  "sort_by": "relevance",
  "page_size": 20
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "artifact_id": "art_xyz789",
        "type": "story",
        "name": "User Authentication",
        "relevance_score": 0.95,
        "highlights": [
          "...implements user <em>authentication</em> using <em>OAuth2</em>...",
          "...<em>OAuth2</em> flow implemented..."
        ],
        "url": "/v1/artifacts/art_xyz789"
      }
      // ... more results
    ],
    "pagination": {
      "page_size": 20,
      "next_page_token": null,
      "has_more": false,
      "total_count": 3
    }
  }
}
```

---

## 7. Project API

### 7.1 Overview

The Project API manages BMad projects, configurations, and project-level state.

**Base Path:** `/v1/projects`

### 7.2 Create Project

**Endpoint:** `POST /v1/projects`

**Description:** Create a new BMad project.

**Request Body:**
```json
{
  "name": "Task Management App",
  "description": "Mobile-first task management application",
  "type": "greenfield_fullstack",
  "config": {
    "dev_load_always_files": [
      "docs/technical-preferences.md",
      "docs/architecture/index.md"
    ],
    "quality_gates_enabled": true,
    "auto_shard_threshold": 10000
  },
  "metadata": {
    "owner": "user_123",
    "team": "team_alpha",
    "tags": ["mobile", "productivity"]
  }
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "project_id": "proj_abc123",
    "name": "Task Management App",
    "type": "greenfield_fullstack",
    "status": "planning",
    "created_at": "2025-10-15T14:00:00Z",
    "url": "/v1/projects/proj_abc123"
  }
}
```

### 7.3 Get Project

**Endpoint:** `GET /v1/projects/{project_id}`

**Description:** Get project details.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "project_id": "proj_abc123",
    "name": "Task Management App",
    "description": "Mobile-first task management application",
    "type": "greenfield_fullstack",
    "status": "development",
    "config": {
      "dev_load_always_files": [...],
      "quality_gates_enabled": true,
      "auto_shard_threshold": 10000
    },
    "metadata": {
      "owner": "user_123",
      "team": "team_alpha"
    },
    "statistics": {
      "artifacts_count": 87,
      "stories_completed": 12,
      "stories_in_progress": 3,
      "gates_passed": 10,
      "gates_with_concerns": 2
    },
    "created_at": "2025-10-15T14:00:00Z",
    "updated_at": "2025-10-15T17:00:00Z"
  }
}
```

### 7.4 Update Project

**Endpoint:** `PUT /v1/projects/{project_id}`

**Description:** Update project configuration.

**Request Body:**
```json
{
  "config": {
    "quality_gates_enabled": false,
    "auto_shard_threshold": 15000
  },
  "metadata": {
    "tags": ["mobile", "productivity", "mvp"]
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "project_id": "proj_abc123",
    "updated_at": "2025-10-15T17:30:00Z"
  }
}
```

### 7.5 Delete Project

**Endpoint:** `DELETE /v1/projects/{project_id}`

**Description:** Delete a project and all associated artifacts.

**Query Parameters:**
- `confirm` (boolean, required): Must be true to confirm deletion

**Response (204 No Content)**

### 7.6 List Projects

**Endpoint:** `GET /v1/projects`

**Description:** List all projects.

**Query Parameters:**
- `type` (string, optional): Filter by project type
- `status` (string, optional): Filter by status
- `owner` (string, optional): Filter by owner
- `team` (string, optional): Filter by team
- `page_size` (integer, optional): Results per page (default: 20)
- `page_token` (string, optional): Pagination token

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "projects": [
      {
        "project_id": "proj_abc123",
        "name": "Task Management App",
        "type": "greenfield_fullstack",
        "status": "development",
        "created_at": "2025-10-15T14:00:00Z"
      }
      // ... more projects
    ],
    "pagination": {
      "page_size": 20,
      "next_page_token": null,
      "has_more": false,
      "total_count": 5
    }
  }
}
```

### 7.7 Get Project Statistics

**Endpoint:** `GET /v1/projects/{project_id}/statistics`

**Description:** Get detailed project statistics.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "project_id": "proj_abc123",
    "artifacts": {
      "total": 87,
      "by_type": {
        "prd": 1,
        "architecture": 1,
        "story": 45,
        "gate": 15,
        "test-design": 15
      }
    },
    "stories": {
      "total": 45,
      "by_status": {
        "draft": 10,
        "approved": 5,
        "in_progress": 3,
        "review": 2,
        "done": 25
      }
    },
    "gates": {
      "total": 15,
      "by_decision": {
        "pass": 10,
        "concerns": 3,
        "fail": 1,
        "waived": 1
      }
    },
    "workflows": {
      "total_executions": 67,
      "by_type": {
        "create-next-story": 45,
        "review-story": 15,
        "risk-profile": 7
      }
    },
    "updated_at": "2025-10-15T17:30:00Z"
  }
}
```

---

## 8. Configuration API

### 8.1 Overview

The Configuration API manages project-level and system-level configuration settings (equivalent to `core-config.yaml`).

**Base Path:** `/v1/config`

### 8.2 Get Configuration

**Endpoint:** `GET /v1/config/{project_id}`

**Description:** Get project configuration.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "project_id": "proj_abc123",
    "config": {
      "paths": {
        "docs": "docs/",
        "project_brief": "docs/project-brief.md",
        "prd": "docs/prd/",
        "architecture": "docs/architecture/",
        "stories": "docs/stories/",
        "gates": "docs/gates/"
      },
      "dev_load_always_files": [
        "docs/technical-preferences.md",
        "docs/architecture/index.md"
      ],
      "quality": {
        "gates_enabled": true,
        "auto_review_threshold": "medium",
        "checklist_enforcement": "strict"
      },
      "sharding": {
        "auto_shard": true,
        "threshold_lines": 10000,
        "prd_strategy": "epic_based",
        "architecture_strategy": "concern_based"
      },
      "workflow": {
        "auto_validate_stories": true,
        "require_po_approval": true,
        "parallel_story_development": false
      }
    },
    "updated_at": "2025-10-15T14:00:00Z"
  }
}
```

### 8.3 Update Configuration

**Endpoint:** `PUT /v1/config/{project_id}`

**Description:** Update project configuration.

**Request Body:**
```json
{
  "config": {
    "quality": {
      "gates_enabled": false
    },
    "workflow": {
      "auto_validate_stories": false
    }
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "project_id": "proj_abc123",
    "updated_at": "2025-10-15T17:45:00Z"
  }
}
```

### 8.4 Reset Configuration

**Endpoint:** `POST /v1/config/{project_id}/reset`

**Description:** Reset configuration to defaults.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "project_id": "proj_abc123",
    "reset_at": "2025-10-15T17:50:00Z"
  }
}
```

---

## 9. Template API

### 9.1 Overview

The Template API manages BMad templates for PRDs, architectures, stories, and other documents.

**Base Path:** `/v1/templates`

### 9.2 List Templates

**Endpoint:** `GET /v1/templates`

**Description:** List all available templates.

**Query Parameters:**
- `category` (string, optional): Filter by category (planning, architecture, development)
- `agent` (string, optional): Filter by agent (pm, architect, sm)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "templates": [
      {
        "template_id": "prd-tmpl",
        "name": "Product Requirements Document",
        "description": "Comprehensive PRD template for greenfield projects",
        "category": "planning",
        "agent": "pm",
        "version": "1.0.0",
        "sections": 15,
        "output_format": "markdown"
      }
      // ... more templates
    ]
  }
}
```

### 9.3 Get Template

**Endpoint:** `GET /v1/templates/{template_id}`

**Description:** Get template definition.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "template_id": "prd-tmpl",
    "name": "Product Requirements Document",
    "version": "1.0.0",
    "category": "planning",
    "agent": "pm",
    "workflow": {
      "mode": "interactive",
      "elicitation": "section_by_section"
    },
    "sections": [
      {
        "id": "executive_summary",
        "title": "Executive Summary",
        "type": "text",
        "required": true,
        "elicit": true,
        "instructions": "Provide a concise overview..."
      }
      // ... more sections
    ],
    "permissions": {
      "owner": "pm",
      "editors": ["pm"],
      "readers": ["*"]
    }
  }
}
```

### 9.4 Render Template

**Endpoint:** `POST /v1/templates/{template_id}/render`

**Description:** Render a template with provided data.

**Request Body:**
```json
{
  "project_id": "proj_abc123",
  "data": {
    "executive_summary": "This project aims to...",
    "product_vision": "To become the leading...",
    "goals": [
      "Increase user engagement by 50%",
      "Launch MVP in 3 months"
    ]
  },
  "format": "markdown"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "template_id": "prd-tmpl",
    "rendered_content": "# Product Requirements Document\n\n## Executive Summary\n\nThis project aims to...\n\n## Product Vision\n\nTo become the leading...",
    "missing_required_fields": ["mvp_scope", "success_metrics"],
    "completion_percentage": 40
  }
}
```

### 9.5 Validate Template Data

**Endpoint:** `POST /v1/templates/{template_id}/validate`

**Description:** Validate template data without rendering.

**Request Body:**
```json
{
  "data": {
    "executive_summary": "This project aims to...",
    "product_vision": "To become the leading..."
  }
}
```

**Response (200 OK - Valid):**
```json
{
  "status": "success",
  "data": {
    "valid": true,
    "completion_percentage": 40,
    "missing_required_fields": ["mvp_scope", "success_metrics"],
    "warnings": [
      "Section 'competitive_analysis' is recommended but not provided"
    ]
  }
}
```

---

## 10. State Management API

### 10.1 Overview

The State Management API handles persistence of workflow state, agent context, and session data.

**Base Path:** `/v1/state`

### 10.2 Save State

**Endpoint:** `POST /v1/state`

**Description:** Save workflow or agent state.

**Request Body:**
```json
{
  "state_type": "workflow",
  "state_id": "wf_abc123",
  "project_id": "proj_abc123",
  "state_data": {
    "current_step": "step_3_architecture_context",
    "completed_steps": ["step_0", "step_1", "step_2"],
    "intermediate_results": {...}
  },
  "ttl_seconds": 86400
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "state_id": "wf_abc123",
    "saved_at": "2025-10-15T14:30:00Z",
    "expires_at": "2025-10-16T14:30:00Z"
  }
}
```

### 10.3 Load State

**Endpoint:** `GET /v1/state/{state_id}`

**Description:** Load saved state.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "state_id": "wf_abc123",
    "state_type": "workflow",
    "project_id": "proj_abc123",
    "state_data": {
      "current_step": "step_3_architecture_context",
      "completed_steps": ["step_0", "step_1", "step_2"],
      "intermediate_results": {...}
    },
    "saved_at": "2025-10-15T14:30:00Z",
    "expires_at": "2025-10-16T14:30:00Z"
  }
}
```

### 10.4 Delete State

**Endpoint:** `DELETE /v1/state/{state_id}`

**Description:** Delete saved state.

**Response (204 No Content)**

---

## 11. Knowledge Base (KB) Mode API

### 11.1 Overview

The KB Mode API provides access to BMad's knowledge base for learning about the framework, best practices, and methodology guidance.

**Base Path:** `/v1/kb`

### 11.2 Query Knowledge Base

**Endpoint:** `POST /v1/kb/query`

**Description:** Query the knowledge base using natural language.

**Request Body:**
```json
{
  "query": "How do I create a PRD for a brownfield project?",
  "max_results": 5,
  "include_context": true
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "query": "How do I create a PRD for a brownfield project?",
    "results": [
      {
        "document_id": "kb_brownfield_prd",
        "title": "Brownfield PRD Creation",
        "content": "For brownfield projects, use the brownfield-prd-tmpl template...",
        "relevance_score": 0.95,
        "url": "/v1/kb/documents/kb_brownfield_prd"
      }
      // ... more results
    ]
  }
}
```

### 11.3 Get KB Document

**Endpoint:** `GET /v1/kb/documents/{document_id}`

**Description:** Get a specific KB document.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "document_id": "kb_brownfield_prd",
    "title": "Brownfield PRD Creation",
    "category": "product_management",
    "content": "...",
    "related_documents": ["kb_prd_template", "kb_course_correction"],
    "updated_at": "2025-10-15T12:00:00Z"
  }
}
```

### 11.4 List KB Topics

**Endpoint:** `GET /v1/kb/topics`

**Description:** List all knowledge base topics.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "topics": [
      {
        "topic_id": "product_management",
        "name": "Product Management",
        "document_count": 15,
        "subtopics": ["prd_creation", "feature_prioritization"]
      }
      // ... more topics
    ]
  }
}
```

---

## 12. Team Bundle API

### 12.1 Overview

The Team Bundle API manages team bundle configurations for the BMad-Orchestrator agent.

**Base Path:** `/v1/bundles`

### 12.2 List Team Bundles

**Endpoint:** `GET /v1/bundles`

**Description:** List available team bundles.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "bundles": [
      {
        "bundle_id": "greenfield_planning_team",
        "name": "Greenfield Planning Team",
        "description": "Team for greenfield project planning phase",
        "agents": ["analyst", "pm", "ux-expert", "architect", "po"],
        "workflow": "greenfield_fullstack"
      }
      // ... more bundles
    ]
  }
}
```

### 12.3 Load Team Bundle

**Endpoint:** `POST /v1/bundles/{bundle_id}/load`

**Description:** Load a team bundle into the orchestrator.

**Request Body:**
```json
{
  "project_id": "proj_abc123",
  "orchestrator_session_id": "sess_orch_123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "bundle_id": "greenfield_planning_team",
    "loaded_agents": ["analyst", "pm", "ux-expert", "architect", "po"],
    "loaded_at": "2025-10-15T14:00:00Z"
  }
}
```

---

## 13. Common Schemas

### 13.1 Agent Schema

```json
{
  "agent_id": "string",
  "name": "string",
  "display_name": "string",
  "icon": "string",
  "description": "string",
  "version": "string",
  "operational_modes": ["string"],
  "commands": [
    {
      "command": "string",
      "description": "string",
      "parameters": ["string"]
    }
  ]
}
```

### 13.2 Artifact Schema

```json
{
  "artifact_id": "string",
  "project_id": "string",
  "type": "string",
  "name": "string",
  "path": "string",
  "content": "string",
  "metadata": {},
  "version": "integer",
  "created_by": "string",
  "created_at": "string (ISO 8601)",
  "updated_by": "string",
  "updated_at": "string (ISO 8601)",
  "permissions": {
    "owner": "string",
    "editors": ["string"],
    "readers": ["string"]
  }
}
```

### 13.3 Workflow Execution Schema

```json
{
  "workflow_id": "string",
  "workflow_name": "string",
  "project_id": "string",
  "status": "string",
  "progress": "integer (0-100)",
  "current_step": "string",
  "steps": [
    {
      "step_id": "string",
      "name": "string",
      "status": "string",
      "started_at": "string (ISO 8601)",
      "completed_at": "string (ISO 8601)"
    }
  ],
  "result": {},
  "started_at": "string (ISO 8601)",
  "completed_at": "string (ISO 8601)",
  "execution_time_ms": "integer"
}
```

### 13.4 Pagination Schema

```json
{
  "page_size": "integer",
  "next_page_token": "string",
  "has_more": "boolean",
  "total_count": "integer"
}
```

### 13.5 Error Schema

```json
{
  "code": "string",
  "message": "string",
  "details": {},
  "trace_id": "string"
}
```

---

## 14. Error Handling

### 14.1 Error Response Format

All error responses follow this structure:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "parameter_name",
      "constraint": "validation_rule"
    },
    "trace_id": "trace_abc123"
  },
  "metadata": {
    "request_id": "req_123abc",
    "timestamp": "2025-10-15T14:30:00Z",
    "api_version": "v1"
  }
}
```

### 14.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request syntax |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `MISSING_PARAMETER` | 400 | Required parameter not provided |
| `INVALID_PARAMETER` | 400 | Parameter value invalid |
| `AUTHENTICATION_REQUIRED` | 401 | No authentication token provided |
| `INVALID_TOKEN` | 401 | Authentication token invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource does not exist |
| `AGENT_NOT_FOUND` | 404 | Agent ID not recognized |
| `WORKFLOW_NOT_FOUND` | 404 | Workflow ID not recognized |
| `ARTIFACT_NOT_FOUND` | 404 | Artifact ID not found |
| `PROJECT_NOT_FOUND` | 404 | Project ID not found |
| `RESOURCE_ALREADY_EXISTS` | 409 | Resource with same ID already exists |
| `STATE_CONFLICT` | 409 | Resource in conflicting state |
| `VALIDATION_FAILED` | 422 | Semantic validation failed |
| `WORKFLOW_EXECUTION_ERROR` | 422 | Workflow execution failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `TIMEOUT` | 504 | Request timeout |

### 14.3 Error Handling Best Practices

**Client-Side:**
1. Always check HTTP status code first
2. Parse error response to get error code and details
3. Handle common errors gracefully (404, 401, 403)
4. Implement retry logic with exponential backoff for 5xx errors
5. Log trace_id for debugging

**Example Error Handling (JavaScript):**
```javascript
async function invokeAgent(agentId, request) {
  try {
    const response = await fetch(`/v1/agents/${agentId}/invoke`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();

      switch (error.error.code) {
        case 'AUTHENTICATION_REQUIRED':
        case 'INVALID_TOKEN':
          // Refresh token and retry
          await refreshToken();
          return invokeAgent(agentId, request);

        case 'RATE_LIMIT_EXCEEDED':
          // Exponential backoff
          await sleep(1000);
          return invokeAgent(agentId, request);

        case 'AGENT_NOT_FOUND':
          throw new Error(`Invalid agent: ${agentId}`);

        default:
          console.error('API Error:', error);
          throw new Error(error.error.message);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

---

## 15. Rate Limiting & Quotas

### 15.1 Rate Limit Policy

**Per-User Limits:**
- Agent invocations: 100 requests/minute
- Workflow executions: 50 requests/minute
- Artifact operations: 200 requests/minute
- KB queries: 100 requests/minute
- All other endpoints: 500 requests/minute

**Per-Client Limits:**
- Total requests: 1000 requests/minute

### 15.2 Rate Limit Headers

All responses include rate limit headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1697382000
```

### 15.3 Rate Limit Exceeded Response

**Response (429 Too Many Requests):**
```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 30 seconds.",
    "details": {
      "limit": 100,
      "window": 60,
      "retry_after": 30
    }
  }
}
```

**Headers:**
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1697382030
Retry-After: 30
```

### 15.4 Quota Management

**Enterprise Plans:**
- Custom rate limits
- Higher quotas for agent invocations and workflow executions
- Priority processing
- Dedicated support

Contact sales for enterprise quota increases.

---

## 16. OpenAPI 3.0 Specification

### 16.1 Complete OpenAPI Specification

Below is the complete OpenAPI 3.0 specification for the BMad API:

```yaml
openapi: 3.0.3
info:
  title: BMad Framework API
  description: |
    RESTful API for the BMad (Business Methodology for Agile Development) framework
    implemented using Google ADK and Vertex AI.

    This API provides programmatic access to all BMad capabilities including:
    - Agent invocation (10 specialized AI agents)
    - Workflow orchestration (8 complex multi-step workflows)
    - Artifact management (PRDs, stories, gates, etc.)
    - Knowledge base access (KB Mode)
    - Project and configuration management
  version: 1.0.0
  contact:
    name: BMad API Support
    email: api-support@bmad.example.com
    url: https://bmad.example.com/support
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html

servers:
  - url: https://bmad-api.example.com/v1
    description: Production server
  - url: https://bmad-api-staging.example.com/v1
    description: Staging server
  - url: https://bmad-api-dev.example.com/v1
    description: Development server

security:
  - BearerAuth: []
  - ApiKeyAuth: []

tags:
  - name: Agents
    description: Agent invocation and session management
  - name: Workflows
    description: Multi-step workflow orchestration
  - name: Artifacts
    description: Document and artifact management
  - name: Projects
    description: Project management
  - name: Configuration
    description: Configuration management
  - name: Templates
    description: Template management
  - name: State
    description: State persistence
  - name: Knowledge Base
    description: KB Mode access
  - name: Team Bundles
    description: Team bundle management

paths:
  # ============================================================================
  # AGENT API
  # ============================================================================

  /agents:
    get:
      tags: [Agents]
      summary: List all agents
      description: Get a list of all available BMad agents
      operationId: listAgents
      parameters:
        - name: operational_mode
          in: query
          description: Filter by operational mode
          schema:
            type: string
        - name: include_tools
          in: query
          description: Include tool definitions
          schema:
            type: boolean
            default: false
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentListResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '500':
          $ref: '#/components/responses/InternalServerError'

  /agents/{agentId}:
    get:
      tags: [Agents]
      summary: Get agent details
      description: Get detailed information about a specific agent
      operationId: getAgent
      parameters:
        - $ref: '#/components/parameters/AgentId'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentDetailResponse'
        '404':
          $ref: '#/components/responses/NotFoundError'

  /agents/{agentId}/invoke:
    post:
      tags: [Agents]
      summary: Invoke agent
      description: Invoke an agent to execute a command or handle a request
      operationId: invokeAgent
      parameters:
        - $ref: '#/components/parameters/AgentId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AgentInvocationRequest'
      responses:
        '200':
          description: Synchronous invocation completed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentInvocationSyncResponse'
        '202':
          description: Asynchronous invocation accepted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentInvocationAsyncResponse'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '404':
          $ref: '#/components/responses/NotFoundError'

  /agents/{agentId}/invocations/{invocationId}:
    get:
      tags: [Agents]
      summary: Get invocation status
      description: Check the status of an async agent invocation
      operationId: getInvocationStatus
      parameters:
        - $ref: '#/components/parameters/AgentId'
        - $ref: '#/components/parameters/InvocationId'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InvocationStatusResponse'

  /agents/{agentId}/invocations/{invocationId}/cancel:
    post:
      tags: [Agents]
      summary: Cancel invocation
      description: Cancel a running agent invocation
      operationId: cancelInvocation
      parameters:
        - $ref: '#/components/parameters/AgentId'
        - $ref: '#/components/parameters/InvocationId'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CancelInvocationResponse'

  # ============================================================================
  # WORKFLOW API
  # ============================================================================

  /workflows:
    get:
      tags: [Workflows]
      summary: List workflows
      description: List all available workflow types
      operationId: listWorkflows
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkflowListResponse'

  /workflows/{workflowName}/start:
    post:
      tags: [Workflows]
      summary: Start workflow
      description: Start a new workflow execution
      operationId: startWorkflow
      parameters:
        - $ref: '#/components/parameters/WorkflowName'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StartWorkflowRequest'
      responses:
        '202':
          description: Workflow started
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkflowStartResponse'

  /workflows/{workflowId}:
    get:
      tags: [Workflows]
      summary: Get workflow status
      description: Get the current status of a workflow execution
      operationId: getWorkflowStatus
      parameters:
        - $ref: '#/components/parameters/WorkflowId'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkflowStatusResponse'

  /workflows/{workflowId}/resume:
    post:
      tags: [Workflows]
      summary: Resume workflow
      description: Resume a paused workflow
      operationId: resumeWorkflow
      parameters:
        - $ref: '#/components/parameters/WorkflowId'
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ResumeWorkflowRequest'
      responses:
        '200':
          description: Workflow resumed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResumeWorkflowResponse'

  /workflows/{workflowId}/cancel:
    post:
      tags: [Workflows]
      summary: Cancel workflow
      description: Cancel a running or paused workflow
      operationId: cancelWorkflow
      parameters:
        - $ref: '#/components/parameters/WorkflowId'
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CancelWorkflowRequest'
      responses:
        '200':
          description: Workflow cancelled
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CancelWorkflowResponse'

  # ============================================================================
  # ARTIFACT API
  # ============================================================================

  /artifacts:
    get:
      tags: [Artifacts]
      summary: List artifacts
      description: List artifacts with filtering and pagination
      operationId: listArtifacts
      parameters:
        - $ref: '#/components/parameters/ProjectIdQuery'
        - name: type
          in: query
          description: Filter by artifact type
          schema:
            type: string
        - name: status
          in: query
          description: Filter by status
          schema:
            type: string
        - $ref: '#/components/parameters/PageSize'
        - $ref: '#/components/parameters/PageToken'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ArtifactListResponse'

    post:
      tags: [Artifacts]
      summary: Create artifact
      description: Create a new artifact
      operationId: createArtifact
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateArtifactRequest'
      responses:
        '201':
          description: Artifact created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ArtifactResponse'

  /artifacts/{artifactId}:
    get:
      tags: [Artifacts]
      summary: Get artifact
      description: Retrieve an artifact by ID
      operationId: getArtifact
      parameters:
        - $ref: '#/components/parameters/ArtifactId'
        - name: version
          in: query
          description: Specific version to retrieve
          schema:
            type: integer
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ArtifactDetailResponse'

    put:
      tags: [Artifacts]
      summary: Update artifact
      description: Update an artifact (creates new version)
      operationId: updateArtifact
      parameters:
        - $ref: '#/components/parameters/ArtifactId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateArtifactRequest'
      responses:
        '200':
          description: Artifact updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ArtifactUpdateResponse'

    delete:
      tags: [Artifacts]
      summary: Delete artifact
      description: Delete an artifact
      operationId: deleteArtifact
      parameters:
        - $ref: '#/components/parameters/ArtifactId'
        - name: hard_delete
          in: query
          description: Permanently delete
          schema:
            type: boolean
            default: false
      responses:
        '204':
          description: Artifact deleted

  # ============================================================================
  # PROJECT API
  # ============================================================================

  /projects:
    get:
      tags: [Projects]
      summary: List projects
      description: List all projects
      operationId: listProjects
      parameters:
        - name: type
          in: query
          description: Filter by project type
          schema:
            type: string
        - name: status
          in: query
          description: Filter by status
          schema:
            type: string
        - $ref: '#/components/parameters/PageSize'
        - $ref: '#/components/parameters/PageToken'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectListResponse'

    post:
      tags: [Projects]
      summary: Create project
      description: Create a new BMad project
      operationId: createProject
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateProjectRequest'
      responses:
        '201':
          description: Project created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectResponse'

  /projects/{projectId}:
    get:
      tags: [Projects]
      summary: Get project
      description: Get project details
      operationId: getProject
      parameters:
        - $ref: '#/components/parameters/ProjectId'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectDetailResponse'

    put:
      tags: [Projects]
      summary: Update project
      description: Update project configuration
      operationId: updateProject
      parameters:
        - $ref: '#/components/parameters/ProjectId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateProjectRequest'
      responses:
        '200':
          description: Project updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectUpdateResponse'

    delete:
      tags: [Projects]
      summary: Delete project
      description: Delete a project and all associated artifacts
      operationId: deleteProject
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - name: confirm
          in: query
          required: true
          description: Must be true to confirm deletion
          schema:
            type: boolean
      responses:
        '204':
          description: Project deleted

  # ============================================================================
  # TEMPLATE API
  # ============================================================================

  /templates:
    get:
      tags: [Templates]
      summary: List templates
      description: List all available templates
      operationId: listTemplates
      parameters:
        - name: category
          in: query
          description: Filter by category
          schema:
            type: string
        - name: agent
          in: query
          description: Filter by agent
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TemplateListResponse'

  /templates/{templateId}:
    get:
      tags: [Templates]
      summary: Get template
      description: Get template definition
      operationId: getTemplate
      parameters:
        - $ref: '#/components/parameters/TemplateId'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TemplateDetailResponse'

  /templates/{templateId}/render:
    post:
      tags: [Templates]
      summary: Render template
      description: Render a template with provided data
      operationId: renderTemplate
      parameters:
        - $ref: '#/components/parameters/TemplateId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RenderTemplateRequest'
      responses:
        '200':
          description: Template rendered
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RenderTemplateResponse'

  # ============================================================================
  # KB MODE API
  # ============================================================================

  /kb/query:
    post:
      tags: [Knowledge Base]
      summary: Query knowledge base
      description: Query the knowledge base using natural language
      operationId: queryKnowledgeBase
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/KBQueryRequest'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/KBQueryResponse'

  /kb/documents/{documentId}:
    get:
      tags: [Knowledge Base]
      summary: Get KB document
      description: Get a specific knowledge base document
      operationId: getKBDocument
      parameters:
        - name: documentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/KBDocumentResponse'

# ==============================================================================
# COMPONENTS
# ==============================================================================

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: OAuth 2.0 access token

    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for read-only access

  parameters:
    AgentId:
      name: agentId
      in: path
      required: true
      description: Agent identifier
      schema:
        type: string
        enum: [analyst, pm, ux-expert, architect, po, sm, dev, qa, bmad-master, bmad-orchestrator]

    InvocationId:
      name: invocationId
      in: path
      required: true
      description: Invocation identifier
      schema:
        type: string

    WorkflowName:
      name: workflowName
      in: path
      required: true
      description: Workflow name
      schema:
        type: string
        enum: [create-next-story, review-story, risk-profile, test-design, apply-qa-fixes, validate-next-story, execute-checklist, shard-doc]

    WorkflowId:
      name: workflowId
      in: path
      required: true
      description: Workflow execution identifier
      schema:
        type: string

    ArtifactId:
      name: artifactId
      in: path
      required: true
      description: Artifact identifier
      schema:
        type: string

    ProjectId:
      name: projectId
      in: path
      required: true
      description: Project identifier
      schema:
        type: string

    ProjectIdQuery:
      name: project_id
      in: query
      required: true
      description: Project identifier
      schema:
        type: string

    TemplateId:
      name: templateId
      in: path
      required: true
      description: Template identifier
      schema:
        type: string

    PageSize:
      name: page_size
      in: query
      description: Number of results per page
      schema:
        type: integer
        default: 20
        minimum: 1
        maximum: 100

    PageToken:
      name: page_token
      in: query
      description: Pagination token
      schema:
        type: string

  schemas:
    # ========================================================================
    # AGENT SCHEMAS
    # ========================================================================

    AgentInvocationRequest:
      type: object
      required: [project_id]
      properties:
        project_id:
          type: string
          description: Project identifier
        command:
          type: string
          description: Specific command to execute
        message:
          type: string
          description: Natural language request
        parameters:
          type: object
          description: Command-specific parameters
        session_id:
          type: string
          description: Session ID for multi-turn conversations
        context:
          type: object
          description: Additional execution context
        sync:
          type: boolean
          default: false
          description: Wait for completion if true

    AgentInvocationSyncResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            invocation_id:
              type: string
            agent_id:
              type: string
            session_id:
              type: string
            result:
              type: object
            execution_time_ms:
              type: integer

    AgentInvocationAsyncResponse:
      type: object
      properties:
        status:
          type: string
          enum: [accepted]
        data:
          type: object
          properties:
            invocation_id:
              type: string
            agent_id:
              type: string
            session_id:
              type: string
            status:
              type: string
              enum: [processing]
            status_url:
              type: string
            estimated_completion:
              type: string
              format: date-time

    InvocationStatusResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            invocation_id:
              type: string
            agent_id:
              type: string
            status:
              type: string
              enum: [queued, processing, waiting_input, completed, failed, cancelled]
            progress:
              type: integer
              minimum: 0
              maximum: 100
            result:
              type: object

    AgentListResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            agents:
              type: array
              items:
                $ref: '#/components/schemas/Agent'

    AgentDetailResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          $ref: '#/components/schemas/AgentDetail'

    Agent:
      type: object
      properties:
        agent_id:
          type: string
        name:
          type: string
        display_name:
          type: string
        icon:
          type: string
        description:
          type: string
        operational_modes:
          type: array
          items:
            type: string
        commands:
          type: array
          items:
            type: object
            properties:
              command:
                type: string
              description:
                type: string

    AgentDetail:
      allOf:
        - $ref: '#/components/schemas/Agent'
        - type: object
          properties:
            version:
              type: string
            model:
              type: object
            capabilities:
              type: object
            resources:
              type: object

    CancelInvocationResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            invocation_id:
              type: string
            status:
              type: string
              enum: [cancelled]
            cancelled_at:
              type: string
              format: date-time

    # ========================================================================
    # WORKFLOW SCHEMAS
    # ========================================================================

    StartWorkflowRequest:
      type: object
      required: [project_id, parameters]
      properties:
        project_id:
          type: string
        parameters:
          type: object
        context:
          type: object
        resumable:
          type: boolean
          default: true

    WorkflowStartResponse:
      type: object
      properties:
        status:
          type: string
          enum: [accepted]
        data:
          type: object
          properties:
            workflow_id:
              type: string
            workflow_name:
              type: string
            status:
              type: string
              enum: [running]
            progress:
              type: integer
            current_step:
              type: string
            started_at:
              type: string
              format: date-time
            status_url:
              type: string

    WorkflowStatusResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            workflow_id:
              type: string
            workflow_name:
              type: string
            status:
              type: string
              enum: [queued, running, paused, completed, failed, cancelled]
            progress:
              type: integer
            current_step:
              type: string
            steps:
              type: array
              items:
                type: object
            result:
              type: object

    WorkflowListResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            workflows:
              type: array
              items:
                type: object
                properties:
                  workflow_name:
                    type: string
                  display_name:
                    type: string
                  description:
                    type: string
                  agent:
                    type: string

    ResumeWorkflowRequest:
      type: object
      properties:
        resume_data:
          type: object

    ResumeWorkflowResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            workflow_id:
              type: string
            status:
              type: string
              enum: [running]
            resumed_at:
              type: string
              format: date-time

    CancelWorkflowRequest:
      type: object
      properties:
        reason:
          type: string

    CancelWorkflowResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            workflow_id:
              type: string
            status:
              type: string
              enum: [cancelled]
            cancelled_at:
              type: string
              format: date-time

    # ========================================================================
    # ARTIFACT SCHEMAS
    # ========================================================================

    CreateArtifactRequest:
      type: object
      required: [project_id, type, name, path, content]
      properties:
        project_id:
          type: string
        type:
          type: string
        name:
          type: string
        path:
          type: string
        content:
          type: string
        metadata:
          type: object
        created_by:
          type: string

    ArtifactResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            artifact_id:
              type: string
            project_id:
              type: string
            type:
              type: string
            name:
              type: string
            path:
              type: string
            version:
              type: integer
            created_by:
              type: string
            created_at:
              type: string
              format: date-time
            url:
              type: string

    ArtifactDetailResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          $ref: '#/components/schemas/ArtifactDetail'

    ArtifactDetail:
      type: object
      properties:
        artifact_id:
          type: string
        project_id:
          type: string
        type:
          type: string
        name:
          type: string
        path:
          type: string
        content:
          type: string
        metadata:
          type: object
        version:
          type: integer
        created_by:
          type: string
        created_at:
          type: string
          format: date-time
        updated_by:
          type: string
        updated_at:
          type: string
          format: date-time
        permissions:
          type: object

    UpdateArtifactRequest:
      type: object
      properties:
        content:
          type: string
        metadata:
          type: object
        updated_by:
          type: string
        change_summary:
          type: string

    ArtifactUpdateResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            artifact_id:
              type: string
            version:
              type: integer
            updated_at:
              type: string
              format: date-time

    ArtifactListResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            artifacts:
              type: array
              items:
                $ref: '#/components/schemas/ArtifactSummary'
            pagination:
              $ref: '#/components/schemas/Pagination'

    ArtifactSummary:
      type: object
      properties:
        artifact_id:
          type: string
        type:
          type: string
        name:
          type: string
        path:
          type: string
        metadata:
          type: object
        version:
          type: integer
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    # ========================================================================
    # PROJECT SCHEMAS
    # ========================================================================

    CreateProjectRequest:
      type: object
      required: [name, type]
      properties:
        name:
          type: string
        description:
          type: string
        type:
          type: string
          enum: [greenfield_fullstack, greenfield_service, greenfield_ui, brownfield_fullstack, brownfield_service, brownfield_ui]
        config:
          type: object
        metadata:
          type: object

    ProjectResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            project_id:
              type: string
            name:
              type: string
            type:
              type: string
            status:
              type: string
            created_at:
              type: string
              format: date-time
            url:
              type: string

    ProjectDetailResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          $ref: '#/components/schemas/ProjectDetail'

    ProjectDetail:
      type: object
      properties:
        project_id:
          type: string
        name:
          type: string
        description:
          type: string
        type:
          type: string
        status:
          type: string
        config:
          type: object
        metadata:
          type: object
        statistics:
          type: object
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    UpdateProjectRequest:
      type: object
      properties:
        config:
          type: object
        metadata:
          type: object

    ProjectUpdateResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            project_id:
              type: string
            updated_at:
              type: string
              format: date-time

    ProjectListResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            projects:
              type: array
              items:
                $ref: '#/components/schemas/ProjectSummary'
            pagination:
              $ref: '#/components/schemas/Pagination'

    ProjectSummary:
      type: object
      properties:
        project_id:
          type: string
        name:
          type: string
        type:
          type: string
        status:
          type: string
        created_at:
          type: string
          format: date-time

    # ========================================================================
    # TEMPLATE SCHEMAS
    # ========================================================================

    TemplateListResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            templates:
              type: array
              items:
                $ref: '#/components/schemas/TemplateSummary'

    TemplateSummary:
      type: object
      properties:
        template_id:
          type: string
        name:
          type: string
        description:
          type: string
        category:
          type: string
        agent:
          type: string
        version:
          type: string

    TemplateDetailResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          $ref: '#/components/schemas/TemplateDetail'

    TemplateDetail:
      type: object
      properties:
        template_id:
          type: string
        name:
          type: string
        version:
          type: string
        category:
          type: string
        agent:
          type: string
        workflow:
          type: object
        sections:
          type: array
          items:
            type: object
        permissions:
          type: object

    RenderTemplateRequest:
      type: object
      required: [project_id, data]
      properties:
        project_id:
          type: string
        data:
          type: object
        format:
          type: string
          enum: [markdown, json, yaml]
          default: markdown

    RenderTemplateResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            template_id:
              type: string
            rendered_content:
              type: string
            missing_required_fields:
              type: array
              items:
                type: string
            completion_percentage:
              type: integer

    # ========================================================================
    # KB MODE SCHEMAS
    # ========================================================================

    KBQueryRequest:
      type: object
      required: [query]
      properties:
        query:
          type: string
        max_results:
          type: integer
          default: 5
        include_context:
          type: boolean
          default: true

    KBQueryResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            query:
              type: string
            results:
              type: array
              items:
                type: object
                properties:
                  document_id:
                    type: string
                  title:
                    type: string
                  content:
                    type: string
                  relevance_score:
                    type: number
                  url:
                    type: string

    KBDocumentResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            document_id:
              type: string
            title:
              type: string
            category:
              type: string
            content:
              type: string
            related_documents:
              type: array
              items:
                type: string

    # ========================================================================
    # COMMON SCHEMAS
    # ========================================================================

    Pagination:
      type: object
      properties:
        page_size:
          type: integer
        next_page_token:
          type: string
          nullable: true
        has_more:
          type: boolean
        total_count:
          type: integer

    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
        trace_id:
          type: string

    ErrorResponse:
      type: object
      properties:
        status:
          type: string
          enum: [error]
        error:
          $ref: '#/components/schemas/Error'
        metadata:
          type: object

  responses:
    BadRequestError:
      description: Bad Request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

    UnauthorizedError:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

    NotFoundError:
      description: Not Found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

    InternalServerError:
      description: Internal Server Error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
```

---

## Document Metadata

**Document Version**: 1.0
**Created**: 2025-10-15
**Last Updated**: 2025-10-15
**Status**: Complete
**Author**: Claude Code (AI Agent)
**Project**: BMad Framework Reverse Engineering for Google ADK
**Phase**: Phase 6 - Task 6.4 (API Specifications)

**Related Documents**:
- [Architecture Design](architecture-design.md)
- [Agent Configurations](agent-configurations/)
- [Reasoning Engine Workflows](reasoning-engine-workflows/)
- [Agent Analysis Documents](../analysis/agents/)
- [Task Analysis Documents](../analysis/tasks/)

**References**:
- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Google Cloud API Design Guide](https://cloud.google.com/apis/design)
- [REST API Best Practices](https://restfulapi.net/)
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)

---

**End of API Specifications Document**
