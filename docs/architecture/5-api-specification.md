# 5. API Specification

## 5.1 API Base URL

- **Production:** `https://outcomesignal.app/api`
- **Development:** `http://localhost:3000/api`
- **Staging:** `https://staging.outcomesignal.app/api`

## 5.2 Authentication

All API endpoints require Clerk JWT tokens:

```
Authorization: Bearer <clerk_jwt_token>
```

## 5.3 API Endpoint Groups

1. **Initiatives** - `/api/v1/initiatives`
2. **Documents** - `/api/v1/documents`
3. **Workflows** - `/api/v1/workflows`
4. **Agents** - `/api/v1/agents`
5. **Conversations** - `/api/v1/conversations`
6. **Subscriptions** - `/api/v1/subscriptions`
7. **Usage** - `/api/v1/usage`
8. **Webhooks** - `/api/v1/webhooks`

## 5.4 Example API Routes

**POST /api/initiatives** - Create Initiative
```typescript
// Request
{
  "title": "Customer Portal MVP",
  "description": "Internal customer portal..."
}

// Response (201 Created)
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Customer Portal MVP",
    "status": "active",
    "phase": "planning",
    ...
  }
}
```

**POST /api/workflows/generate-document** - Trigger Document Generation
```typescript
// Request
{
  "initiative_id": "550e8400...",
  "document_type": "prd",
  "user_inputs": { ... }
}

// Response (202 Accepted)
{
  "data": {
    "workflow_id": "wf_abc123",
    "status": "running",
    "progress": 0,
    "estimated_completion_seconds": 20
  }
}
```

**GET /api/workflows/{workflowId}/status** - Poll Workflow Status
```typescript
// Response (200 OK)
{
  "data": {
    "id": "wf_abc123",
    "status": "running",
    "progress": 65,
    "current_step": "Step 4: Populating PRD template"
  }
}
```

See full document for complete API specification with all endpoints, request/response formats, and error codes.

---
