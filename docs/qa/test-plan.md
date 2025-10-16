# OutcomeSignal - Comprehensive Test Plan

**Document Version:** 1.0
**Created:** 2025-10-16
**Last Updated:** 2025-10-16
**Status:** Final - Ready for Implementation
**Author:** Quinn (Test Architect & Quality Advisor)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Risk Assessment Matrix](#2-risk-assessment-matrix)
3. [High-Risk Areas & Test Architecture](#3-high-risk-areas--test-architecture)
4. [Test Strategy](#4-test-strategy)
5. [Test Infrastructure Setup](#5-test-infrastructure-setup)
6. [Critical Test Suites](#6-critical-test-suites)
7. [NFR Validation Scenarios](#7-nfr-validation-scenarios)
8. [Test Coverage Targets](#8-test-coverage-targets)
9. [CI/CD Integration](#9-cicd-integration)
10. [Monitoring & Alerting Strategy](#10-monitoring--alerting-strategy)
11. [Test Data Management](#11-test-data-management)
12. [Implementation Roadmap](#12-implementation-roadmap)

---

## 1. Executive Summary

### 1.1 Purpose

This test plan provides comprehensive quality assurance guidance for **OutcomeSignal**, a greenfield AI-powered planning platform. Given the architecture's complexity (Next.js fullstack + Google Vertex AI + Supabase), this plan emphasizes **early test architecture** to prevent costly defects in production.

### 1.2 Quality Objectives

| Objective | Target | Measurement |
|-----------|--------|-------------|
| **System Reliability** | 99% uptime (NFR7) | Sentry uptime monitoring |
| **Performance** | <30s document generation p95 (NFR1) | Performance tests, production metrics |
| **Security** | Zero multi-tenant data leaks | RLS audit suite, penetration tests |
| **User Satisfaction** | 80%+ document approval rate | Product analytics tracking |
| **Code Quality** | >80% test coverage | Vitest coverage reports |

### 1.3 Key Findings - High-Risk Areas

This analysis identified **8 high-risk areas** requiring immediate test architecture focus:

1. **🔴 CRITICAL:** AI Workflow State Management (Vertex AI + Supabase)
2. **🔴 CRITICAL:** Real-Time Synchronization (Supabase Realtime WebSocket)
3. **🔴 CRITICAL:** Multi-Tenant Data Isolation (Row-Level Security)
4. **🟠 HIGH:** Subscription Billing & Credit Enforcement (Stripe + tier limits)
5. **🟠 HIGH:** LLM Output Quality (Gemini vs Claude A/B testing)
6. **🟠 HIGH:** API Route Performance (Vercel serverless timeout management)
7. **🟡 MODERATE:** ADK Agent Deployment & Invocation (TypeScript ↔ Python contracts)
8. **🟡 MODERATE:** Three-Column Workspace Responsiveness (Desktop → Mobile)

**Recommendation:** Implement security and workflow state tests **BEFORE** writing production code.

---

## 2. Risk Assessment Matrix

### 2.1 Comprehensive Risk Analysis

| Risk Area | Probability | Impact | Risk Score | Test Priority | Mitigation Strategy |
|-----------|-------------|--------|------------|---------------|---------------------|
| **AI Workflow State Consistency** | High | Severe | 🔴 **9/10** | **1** | Chaos testing, checkpoint-resume, idempotency |
| **Realtime Sync (WebSocket)** | Medium | Severe | 🔴 **8/10** | **2** | Race condition tests, reconnection logic, message ordering |
| **Multi-Tenant Data Isolation (RLS)** | Low | Catastrophic | 🔴 **8/10** | **3** | RLS audit suite, penetration tests, JWT validation |
| **Billing & Credit Enforcement** | Medium | High | 🟠 **7/10** | **4** | Atomic transactions, webhook replay tests, race conditions |
| **LLM Output Quality & Validation** | Medium | High | 🟠 **7/10** | **5** | Schema validation, golden dataset regression tests |
| **API Performance & Timeouts** | High | Medium | 🟠 **6/10** | **6** | Load testing, timeout management, circuit breakers |
| **ADK Agent Deployment** | Medium | Medium | 🟡 **5/10** | **7** | Contract tests, version compatibility, health checks |
| **UI Responsiveness** | High | Low | 🟡 **4/10** | **8** | Visual regression, performance profiling, viewport tests |

### 2.2 Risk Scoring Methodology

- **Probability:** Low (1-3), Medium (4-6), High (7-10)
- **Impact:** Low (1-3), Medium (4-6), High (7-8), Severe (9), Catastrophic (10)
- **Risk Score:** Probability × Impact / 10 (rounded)

---

## 3. High-Risk Areas & Test Architecture

### 3.1 TIER 1 - CRITICAL RISKS

#### 3.1.1 AI Workflow State Management

**Risk Description:**
- Document generation workflows run 15-30s across platform boundaries (Vercel API Routes → Vertex AI Reasoning Engine)
- State persistence in Supabase during long-running workflows
- Multiple failure points: API timeout (60s), Vertex AI failures, network partitions, database errors
- Critical user impact: Lost credits, partial documents, corrupted state

**Test Architecture Requirements:**

**A. Chaos Engineering Tests**
```typescript
// tests/workflows/chaos.test.ts
describe('Workflow Chaos Engineering', () => {
  it('should handle Vertex AI timeout gracefully', async () => {
    // Mock Vertex AI to timeout after 55s (approaching 60s limit)
    vi.mocked(vertexAI.runWorkflow).mockImplementation(() =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new TimeoutError('Execution timeout')), 55000)
      )
    );

    const workflowId = await triggerDocumentGeneration({
      initiative_id: testInitiativeId,
      document_type: 'prd',
    });

    // Wait for timeout handling
    await waitForWorkflowStatus(workflowId, 'failed', { timeout: 65000 });

    // VERIFY: No partial document created
    const documents = await getDocuments(testInitiativeId);
    expect(documents).toHaveLength(0);

    // VERIFY: Credits not deducted
    const usage = await getUsage(testUserId);
    expect(usage.credits_used).toBe(0);

    // VERIFY: Workflow marked as failed with proper error message
    const workflow = await getWorkflowExecution(workflowId);
    expect(workflow.status).toBe('failed');
    expect(workflow.error).toContain('timeout');
  });

  it('should handle network partition mid-workflow', async () => {
    let stepCount = 0;
    vi.mocked(vertexAI.runWorkflow).mockImplementation(async () => {
      stepCount++;
      if (stepCount === 3) {
        throw new NetworkError('Connection lost to Vertex AI');
      }
      return { status: 'step_completed', step: stepCount };
    });

    const workflowId = await triggerDocumentGeneration({ ... });

    // Workflow fails at step 3
    await waitForWorkflowStatus(workflowId, 'failed');

    // VERIFY: Workflow state shows last successful step
    const workflow = await getWorkflowExecution(workflowId);
    expect(workflow.current_step).toBe('Step 2 completed');
  });

  it('should handle Supabase database unavailability during workflow', async () => {
    // Simulate Supabase connection failure during state update
    let updateAttempts = 0;
    vi.spyOn(supabase, 'from').mockImplementation((table) => {
      updateAttempts++;
      if (table === 'workflow_executions' && updateAttempts === 2) {
        throw new DatabaseError('Connection pool exhausted');
      }
      return originalSupabase.from(table);
    });

    const workflowId = await triggerDocumentGeneration({ ... });

    // Workflow should retry database updates with exponential backoff
    await waitForWorkflowStatus(workflowId, 'completed', { timeout: 40000 });

    // VERIFY: State eventually consistent despite transient failure
    const workflow = await getWorkflowExecution(workflowId);
    expect(workflow.status).toBe('completed');
  });
});
```

**B. Checkpoint & Resume Tests**
```typescript
describe('Workflow Checkpoint & Resume', () => {
  it('should resume workflow from last checkpoint after failure', async () => {
    const completedSteps: string[] = [];

    vi.mocked(vertexAI.executeWorkflowStep).mockImplementation(async (step) => {
      // Simulate failure at step 4 of 6
      if (step.step_number === 4 && completedSteps.length === 3) {
        throw new Error('Transient failure');
      }
      completedSteps.push(step.name);
      return { status: 'success', output: { ... } };
    });

    const workflowId = await triggerDocumentGeneration({ ... });

    // Initial execution fails at step 4
    await waitForWorkflowStatus(workflowId, 'failed');
    expect(completedSteps).toEqual(['step1', 'step2', 'step3']);

    // Trigger retry/resume
    await retryWorkflow(workflowId);

    // VERIFY: Steps 1-3 skipped, execution resumes at step 4
    await waitForWorkflowStatus(workflowId, 'completed');
    expect(completedSteps).toEqual([
      'step1', 'step2', 'step3', // Initial attempt
      'step4', 'step5', 'step6'  // Resume (steps 1-3 NOT re-executed)
    ]);
  });

  it('should save checkpoints to Supabase after each workflow step', async () => {
    const workflowId = await triggerDocumentGeneration({ ... });

    // Wait for workflow to complete
    await waitForWorkflowStatus(workflowId, 'completed');

    // VERIFY: Progress updates were incremental (not just 0% → 100%)
    const progressHistory = await getWorkflowProgressHistory(workflowId);
    expect(progressHistory.map(h => h.progress)).toEqual([
      0, 17, 33, 50, 67, 83, 100 // 6 steps = ~17% each
    ]);
  });
});
```

**C. Idempotency Tests**
```typescript
describe('Workflow Idempotency', () => {
  it('should prevent duplicate document creation on retry', async () => {
    // Create workflow
    const workflowId = await triggerDocumentGeneration({ ... });
    await waitForWorkflowStatus(workflowId, 'completed');

    // Retry same workflow (e.g., user clicks "Regenerate" button twice)
    await retryWorkflow(workflowId);
    await retryWorkflow(workflowId);

    // VERIFY: Only 1 document created (idempotency key prevents duplicates)
    const documents = await getDocuments(testInitiativeId);
    expect(documents).toHaveLength(1);
    expect(documents[0].version).toBe(1);
  });

  it('should handle duplicate webhook calls from Vertex AI', async () => {
    // Simulate Vertex AI sending workflow completion webhook twice
    const payload = {
      workflow_id: 'wf_test123',
      status: 'completed',
      result: { document_id: 'doc_abc' },
    };

    // Send webhook twice
    await fetch('/api/webhooks/vertex-ai', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'X-Webhook-Signature': signPayload(payload) },
    });

    await fetch('/api/webhooks/vertex-ai', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'X-Webhook-Signature': signPayload(payload) },
    });

    // VERIFY: Workflow updated only once (idempotency)
    const workflow = await getWorkflowExecution('wf_test123');
    expect(workflow.status).toBe('completed');

    const documents = await getDocuments(workflow.initiative_id);
    expect(documents).toHaveLength(1); // No duplicate documents
  });
});
```

---

#### 3.1.2 Real-Time Synchronization (Supabase Realtime)

**Risk Description:**
- Three-column workspace relies on live WebSocket updates for workflow progress (0% → 100%)
- Message ordering critical: Client must see progress updates in sequence
- Connection drops on mobile/unstable networks
- Future: Multiple clients viewing same initiative simultaneously (collaboration)

**Test Architecture Requirements:**

**A. Race Condition Tests**
```typescript
describe('Realtime Race Conditions', () => {
  it('should handle multiple clients updating same document simultaneously', async () => {
    // Create 2 WebSocket clients for same initiative
    const clientA = createSupabaseClient(userToken);
    const clientB = createSupabaseClient(userToken);

    const clientAUpdates: any[] = [];
    const clientBUpdates: any[] = [];

    clientA.channel(`initiative:${initiativeId}`)
      .on('postgres_changes', { ... }, (payload) => clientAUpdates.push(payload))
      .subscribe();

    clientB.channel(`initiative:${initiativeId}`)
      .on('postgres_changes', { ... }, (payload) => clientBUpdates.push(payload))
      .subscribe();

    // Trigger document generation (broadcasts progress updates)
    await triggerDocumentGeneration({ ... });

    // Wait for workflow completion
    await waitFor(() => clientAUpdates.length > 5, { timeout: 40000 });

    // VERIFY: Both clients received same updates
    expect(clientAUpdates.length).toBe(clientBUpdates.length);
    expect(clientAUpdates.map(u => u.new.progress))
      .toEqual(clientBUpdates.map(u => u.new.progress));
  });

  it('should maintain message ordering for progress updates', async () => {
    const client = createSupabaseClient(userToken);
    const progressUpdates: number[] = [];

    client.channel(`workflow:${workflowId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'workflow_executions' },
        (payload) => progressUpdates.push(payload.new.progress)
      )
      .subscribe();

    await triggerDocumentGeneration({ ... });

    await waitFor(() => progressUpdates.includes(100), { timeout: 40000 });

    // VERIFY: Progress updates arrived in ascending order (no out-of-order delivery)
    const sortedUpdates = [...progressUpdates].sort((a, b) => a - b);
    expect(progressUpdates).toEqual(sortedUpdates);
  });
});
```

**B. Reconnection Tests**
```typescript
describe('Realtime Reconnection Handling', () => {
  it('should receive missed updates after WebSocket reconnection', async () => {
    const client = createSupabaseClient(userToken);
    const updates: any[] = [];

    const channel = client.channel(`workflow:${workflowId}`)
      .on('postgres_changes', { ... }, (payload) => updates.push(payload))
      .subscribe();

    // Trigger workflow
    const workflowId = await triggerDocumentGeneration({ ... });

    // Wait until workflow reaches 40% progress
    await waitFor(() => updates.some(u => u.new.progress >= 40), { timeout: 15000 });

    // Simulate network disconnect
    await client.removeChannel(channel);

    // Wait 5 seconds (workflow continues on backend)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Reconnect
    const reconnectedChannel = client.channel(`workflow:${workflowId}`)
      .on('postgres_changes', { ... }, (payload) => updates.push(payload))
      .subscribe();

    // VERIFY: Client receives final state (100% completion) after reconnect
    await waitFor(() => updates.some(u => u.new.progress === 100), { timeout: 30000 });

    const finalUpdate = updates[updates.length - 1];
    expect(finalUpdate.new.status).toBe('completed');
    expect(finalUpdate.new.progress).toBe(100);
  });

  it('should display cached state while reconnecting', async () => {
    // Client-side logic test: UI should show last known state during reconnect
    const { container } = render(<WorkflowProgressPanel workflowId={workflowId} />);

    // Initial connection, workflow at 60%
    await waitFor(() => screen.getByText('Progress: 60%'));

    // Simulate WebSocket disconnect
    act(() => {
      mockSupabaseClient.removeAllChannels();
    });

    // VERIFY: UI still shows 60% (cached state)
    expect(screen.getByText('Progress: 60%')).toBeInTheDocument();
    expect(screen.getByText('Reconnecting...')).toBeInTheDocument();
  });
});
```

**C. Load Tests - Concurrent WebSocket Connections**
```typescript
describe('Realtime Load Testing', () => {
  it('should handle 100 concurrent WebSocket connections per initiative', async () => {
    const clients = Array.from({ length: 100 }, () =>
      createSupabaseClient(generateTestUserToken())
    );

    const subscriptionPromises = clients.map(client =>
      client.channel(`initiative:${initiativeId}`)
        .on('postgres_changes', { ... }, () => {})
        .subscribe()
    );

    await Promise.all(subscriptionPromises);

    // Trigger update that broadcasts to all 100 clients
    await updateInitiative(initiativeId, { phase_progress: 50 });

    // VERIFY: All clients subscribed successfully (no connection limit errors)
    const statuses = await Promise.all(
      clients.map(c => c.channel(`initiative:${initiativeId}`).subscribe())
    );
    expect(statuses.every(s => s === 'SUBSCRIBED')).toBe(true);

    // Cleanup
    await Promise.all(clients.map(c => c.removeAllChannels()));
  });
});
```

---

#### 3.1.3 Multi-Tenant Data Isolation (Row-Level Security)

**Risk Description:**
- RLS policies are the **ONLY** enforcement layer for data isolation (no application-layer checks)
- Security vulnerability: User A could theoretically access User B's initiatives/documents
- Complex RLS policies across 10+ tables with foreign key relationships
- Clerk JWT → Supabase user_id mapping must be bulletproof
- **Catastrophic impact** if breached: GDPR violations, customer trust loss

**Test Architecture Requirements:**

**A. RLS Policy Audit Suite**
```typescript
describe('Row-Level Security - Multi-Tenant Isolation', () => {
  let userAToken: string;
  let userBToken: string;
  let userAInitiative: Initiative;
  let userADocument: Document;

  beforeEach(async () => {
    // Create two separate users via Clerk
    const userA = await createTestUser('userA@test.com');
    const userB = await createTestUser('userB@test.com');

    userAToken = userA.clerkToken;
    userBToken = userB.clerkToken;

    // User A creates data
    userAInitiative = await createInitiative(userAToken, {
      title: 'User A Secret Project'
    });

    userADocument = await createDocument(userAToken, {
      initiative_id: userAInitiative.id,
      type: 'prd',
      content: 'Confidential content',
    });
  });

  describe('Initiatives Table', () => {
    it('should prevent User B from reading User A initiative', async () => {
      const response = await fetch(`/api/initiatives/${userAInitiative.id}`, {
        headers: { Authorization: `Bearer ${userBToken}` },
      });

      expect(response.status).toBe(403);
      expect(await response.json()).toMatchObject({
        error: 'forbidden',
        message: 'You do not have access to this initiative',
      });
    });

    it('should prevent User B from listing User A initiatives', async () => {
      const response = await fetch('/api/initiatives', {
        headers: { Authorization: `Bearer ${userBToken}` },
      });

      const data = await response.json();
      expect(data.data).toHaveLength(0); // User B has no initiatives
    });

    it('should prevent User B from updating User A initiative', async () => {
      const response = await fetch(`/api/initiatives/${userAInitiative.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${userBToken}` },
        body: JSON.stringify({ title: 'Hacked!' }),
      });

      expect(response.status).toBe(403);

      // VERIFY: Data not modified
      const initiative = await getInitiative(userAToken, userAInitiative.id);
      expect(initiative.title).toBe('User A Secret Project');
    });

    it('should prevent User B from deleting User A initiative', async () => {
      const response = await fetch(`/api/initiatives/${userAInitiative.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userBToken}` },
      });

      expect(response.status).toBe(403);

      // VERIFY: Initiative still exists
      const initiative = await getInitiative(userAToken, userAInitiative.id);
      expect(initiative).toBeDefined();
    });
  });

  describe('Documents Table', () => {
    it('should prevent User B from reading User A document', async () => {
      const response = await fetch(`/api/documents/${userADocument.id}`, {
        headers: { Authorization: `Bearer ${userBToken}` },
      });

      expect(response.status).toBe(403);
    });

    it('should prevent User B from querying User A documents via initiative', async () => {
      const response = await fetch(
        `/api/initiatives/${userAInitiative.id}/documents`,
        { headers: { Authorization: `Bearer ${userBToken}` } }
      );

      expect(response.status).toBe(403);
    });
  });

  describe('Workflow Executions Table', () => {
    it('should prevent User B from viewing User A workflow status', async () => {
      // User A triggers workflow
      const workflow = await triggerDocumentGeneration(userAToken, {
        initiative_id: userAInitiative.id,
        document_type: 'prd',
      });

      // User B attempts to access workflow status
      const response = await fetch(`/api/workflows/${workflow.id}/status`, {
        headers: { Authorization: `Bearer ${userBToken}` },
      });

      expect(response.status).toBe(403);
    });
  });

  describe('Agent Conversations Table', () => {
    it('should prevent User B from reading User A chat history', async () => {
      // User A has agent conversation
      const conversation = await createAgentConversation(userAToken, {
        initiative_id: userAInitiative.id,
        messages: [{ role: 'user', content: 'Confidential question' }],
      });

      // User B attempts to access
      const response = await fetch(`/api/conversations/${conversation.id}`, {
        headers: { Authorization: `Bearer ${userBToken}` },
      });

      expect(response.status).toBe(403);
    });
  });
});
```

**B. JWT Token Validation Tests**
```typescript
describe('Clerk JWT → Supabase User Mapping', () => {
  it('should reject requests with invalid JWT signature', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';

    const response = await fetch('/api/initiatives', {
      headers: { Authorization: `Bearer ${invalidToken}` },
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      error: 'unauthorized',
      message: 'Invalid authentication token',
    });
  });

  it('should reject expired JWT tokens', async () => {
    const expiredToken = generateExpiredClerkToken(testUserId, {
      expiresAt: Date.now() - 3600000, // 1 hour ago
    });

    const response = await fetch('/api/initiatives', {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      error: 'token_expired',
    });
  });

  it('should map Clerk user_id to Supabase user correctly', async () => {
    const clerkUserId = 'user_clerk123';
    const clerkToken = generateClerkToken(clerkUserId);

    // Create initiative with Clerk token
    const initiative = await createInitiative(clerkToken, { title: 'Test' });

    // VERIFY: Initiative linked to correct Supabase user
    const supabaseUser = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    expect(initiative.user_id).toBe(supabaseUser.data.id);
  });
});
```

**C. Penetration Tests (Negative Testing)**
```typescript
describe('Security Penetration Tests', () => {
  it('should prevent direct Supabase query bypass of RLS', async () => {
    // Attempt to bypass API and query Supabase directly
    const maliciousClient = createSupabaseClient(userBToken);

    const { data, error } = await maliciousClient
      .from('initiatives')
      .select('*')
      .eq('id', userAInitiative.id)
      .single();

    // VERIFY: RLS blocks query (no data returned)
    expect(error).toBeDefined();
    expect(error.code).toBe('PGRST116'); // Row-level security violation
    expect(data).toBeNull();
  });

  it('should prevent UUID enumeration attacks', async () => {
    // Attacker tries to guess UUIDs to access other users' data
    const randomUUIDs = Array.from({ length: 100 }, () => generateRandomUUID());

    const responses = await Promise.all(
      randomUUIDs.map(uuid =>
        fetch(`/api/initiatives/${uuid}`, {
          headers: { Authorization: `Bearer ${userBToken}` },
        })
      )
    );

    // VERIFY: All requests return 403 or 404 (never 200)
    const statusCodes = responses.map(r => r.status);
    expect(statusCodes.every(code => code === 403 || code === 404)).toBe(true);
  });

  it('should prevent SQL injection in initiative title', async () => {
    const maliciousTitle = "'; DROP TABLE initiatives; --";

    const initiative = await createInitiative(userAToken, {
      title: maliciousTitle
    });

    // VERIFY: Title stored as plain text (Supabase parameterized queries)
    expect(initiative.title).toBe(maliciousTitle);

    // VERIFY: Initiatives table still exists
    const initiatives = await fetch('/api/initiatives', {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    expect(initiatives.status).toBe(200);
  });
});
```

**D. Automated RLS Policy Audits**
```typescript
// Automated test generator for all tables
const TABLES_WITH_RLS = [
  'initiatives',
  'documents',
  'document_versions',
  'epics',
  'agent_conversations',
  'workflow_executions',
  'usage_tracking',
];

describe('RLS Policy Audit - All Tables', () => {
  TABLES_WITH_RLS.forEach(table => {
    describe(`${table} table`, () => {
      it(`should have RLS enabled on ${table}`, async () => {
        const { data } = await supabaseAdmin.rpc('check_rls_enabled', {
          table_name: table
        });
        expect(data).toBe(true);
      });

      it(`should have SELECT policy on ${table}`, async () => {
        const { data } = await supabaseAdmin.rpc('list_policies', {
          table_name: table
        });
        expect(data.some(p => p.cmd === 'SELECT')).toBe(true);
      });

      it(`should have INSERT policy on ${table}`, async () => {
        const { data } = await supabaseAdmin.rpc('list_policies', {
          table_name: table
        });
        expect(data.some(p => p.cmd === 'INSERT')).toBe(true);
      });
    });
  });
});
```

---

### 3.2 TIER 2 - HIGH-IMPACT BUSINESS RISKS

#### 3.2.1 Subscription Billing & Credit Enforcement

**Risk Description:**
- Revenue-critical: Tier limits must be strictly enforced (Trial: 5 credits, Starter: 25, Professional: 100)
- Race conditions: User triggers multiple workflows simultaneously with limited credits
- Stripe webhook timing: User upgrades mid-workflow
- Webhook failures/duplicates could desync billing state
- Credit deduction timing: Before or after workflow completion?

**Test Architecture Requirements:**

**A. Credit Enforcement Tests**
```typescript
describe('Credit Enforcement', () => {
  it('should prevent document generation when credits exhausted', async () => {
    // User on Trial tier (5 credits max), already used 5
    await setMonthlyUsage(testUserId, {
      credits_used: 5,
      month: '2025-10'
    });

    const response = await fetch('/api/workflows/generate-document', {
      method: 'POST',
      headers: { Authorization: `Bearer ${testUserToken}` },
      body: JSON.stringify({
        initiative_id: testInitiativeId,
        document_type: 'prd'
      }),
    });

    expect(response.status).toBe(402); // Payment Required
    expect(await response.json()).toMatchObject({
      error: 'credit_limit_exceeded',
      current_usage: 5,
      tier_limit: 5,
      upgrade_url: '/settings/billing',
    });
  });

  it('should allow document generation with available credits', async () => {
    // User on Starter tier (25 credits), used 10
    await setSubscription(testUserId, { tier: 'starter' });
    await setMonthlyUsage(testUserId, { credits_used: 10 });

    const response = await fetch('/api/workflows/generate-document', {
      method: 'POST',
      headers: { Authorization: `Bearer ${testUserToken}` },
      body: JSON.stringify({ document_type: 'prd', ... }),
    });

    expect(response.status).toBe(202); // Accepted

    // VERIFY: Credit deducted immediately (not waiting for completion)
    const usage = await getMonthlyUsage(testUserId);
    expect(usage.credits_used).toBe(11);
  });

  it('should rollback credit on workflow failure', async () => {
    await setSubscription(testUserId, { tier: 'starter' });
    await setMonthlyUsage(testUserId, { credits_used: 10 });

    // Mock Vertex AI to fail immediately
    vi.mocked(vertexAI.runWorkflow).mockRejectedValue(
      new Error('Vertex AI service unavailable')
    );

    const workflowId = await triggerDocumentGeneration({ ... });
    await waitForWorkflowStatus(workflowId, 'failed');

    // VERIFY: Credit refunded
    const usage = await getMonthlyUsage(testUserId);
    expect(usage.credits_used).toBe(10); // Back to original
  });
});
```

**B. Race Condition Tests**
```typescript
describe('Credit Race Conditions', () => {
  it('should handle 2 workflows triggered simultaneously with 1 credit remaining', async () => {
    await setSubscription(testUserId, { tier: 'trial' }); // 5 credits max
    await setMonthlyUsage(testUserId, { credits_used: 4 }); // 1 credit left

    // Trigger 2 workflows simultaneously
    const [result1, result2] = await Promise.allSettled([
      triggerDocumentGeneration({
        initiative_id: initiativeId1,
        document_type: 'prd'
      }),
      triggerDocumentGeneration({
        initiative_id: initiativeId2,
        document_type: 'architecture'
      }),
    ]);

    // VERIFY: One succeeds, one fails with 402
    expect([result1.status, result2.status].sort()).toEqual([
      'fulfilled',
      'rejected',
    ]);

    if (result2.status === 'rejected') {
      expect(result2.reason.statusCode).toBe(402);
    }

    // VERIFY: Only 1 credit deducted (atomic transaction)
    const usage = await getMonthlyUsage(testUserId);
    expect(usage.credits_used).toBe(5);
  });

  it('should use atomic database transaction for credit check + deduction', async () => {
    // Spy on database queries
    const queries: string[] = [];
    vi.spyOn(supabase, 'rpc').mockImplementation(async (fn, params) => {
      queries.push(fn);
      return originalSupabase.rpc(fn, params);
    });

    await triggerDocumentGeneration({ ... });

    // VERIFY: Credit check and deduction in single transaction
    expect(queries).toContain('check_and_deduct_credit_atomic');
  });
});
```

**C. Stripe Webhook Tests**
```typescript
describe('Stripe Webhook Integration', () => {
  it('should update subscription on customer.subscription.created', async () => {
    const stripePayload = {
      type: 'customer.subscription.created',
      data: {
        object: {
          id: 'sub_test123',
          customer: testStripeCustomerId,
          items: {
            data: [{ price: { id: 'price_starter' } }],
          },
          current_period_start: 1700000000,
          current_period_end: 1702592000,
        },
      },
    };

    const response = await fetch('/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(stripePayload),
      headers: {
        'stripe-signature': signStripeWebhook(stripePayload),
      },
    });

    expect(response.status).toBe(200);

    // VERIFY: Subscription updated in Supabase
    const subscription = await getSubscription(testUserId);
    expect(subscription.tier).toBe('starter');
    expect(subscription.stripe_subscription_id).toBe('sub_test123');
  });

  it('should handle webhook replay (duplicate events)', async () => {
    const payload = {
      type: 'customer.subscription.created',
      data: { object: { id: 'sub_test123', ... } },
    };

    // Send webhook twice with same idempotency key
    const idempotencyKey = 'evt_test123';

    await fetch('/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'stripe-signature': signStripeWebhook(payload),
        'idempotency-key': idempotencyKey,
      },
    });

    await fetch('/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'stripe-signature': signStripeWebhook(payload),
        'idempotency-key': idempotencyKey,
      },
    });

    // VERIFY: Only 1 subscription created
    const subscriptions = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', 'sub_test123');

    expect(subscriptions.data).toHaveLength(1);
  });

  it('should upgrade user mid-workflow and allow continuation', async () => {
    // User on Trial (5 credits), used 4, starts workflow
    await setSubscription(testUserId, { tier: 'trial' });
    await setMonthlyUsage(testUserId, { credits_used: 4 });

    const workflowId = await triggerDocumentGeneration({ ... });

    // Mid-workflow, user upgrades to Starter (25 credits)
    await simulateStripeWebhook({
      type: 'customer.subscription.updated',
      data: { object: { id: testSubscriptionId, items: { data: [{ price: { id: 'price_starter' } }] } } },
    });

    // VERIFY: Workflow completes successfully
    await waitForWorkflowStatus(workflowId, 'completed');

    const subscription = await getSubscription(testUserId);
    expect(subscription.tier).toBe('starter');
  });

  it('should handle payment failure and downgrade user', async () => {
    await setSubscription(testUserId, { tier: 'professional' });

    // Stripe sends payment failure webhook
    await simulateStripeWebhook({
      type: 'invoice.payment_failed',
      data: { object: { subscription: testSubscriptionId } },
    });

    // VERIFY: Subscription marked as past_due
    const subscription = await getSubscription(testUserId);
    expect(subscription.status).toBe('past_due');

    // VERIFY: User cannot trigger new workflows
    const response = await triggerDocumentGeneration({ ... });
    expect(response.statusCode).toBe(402);
  });
});
```

**D. Monthly Credit Reset Tests**
```typescript
describe('Monthly Credit Reset', () => {
  it('should reset credits on first of month', async () => {
    // User on Starter tier (25 credits), used 20 in October
    await setMonthlyUsage(testUserId, {
      credits_used: 20,
      month: '2025-10'
    });

    // Simulate date change to November 1st
    vi.setSystemTime(new Date('2025-11-01T00:00:00Z'));

    // User triggers document generation in November
    await triggerDocumentGeneration({ ... });

    // VERIFY: New usage record for November with 1 credit used
    const novemberUsage = await getMonthlyUsage(testUserId, '2025-11');
    expect(novemberUsage.credits_used).toBe(1);

    // VERIFY: October usage unchanged (historical record)
    const octoberUsage = await getMonthlyUsage(testUserId, '2025-10');
    expect(octoberUsage.credits_used).toBe(20);
  });
});
```

---

#### 3.2.2 LLM Output Quality & Validation

**Risk Description:**
- LLM non-determinism: Same input may produce different outputs
- Template compliance: Generated documents must match YAML schemas (e.g., PRD template)
- A/B testing: Gemini 2.5 Pro vs Claude Sonnet 4.5 output format consistency
- Malformed markdown breaks TipTap rendering in UI
- User approval rate = 80% success metric (business KPI)

**Test Architecture Requirements:**

**A. Schema Validation Tests**
```typescript
import { z } from 'zod';

// Define expected PRD structure
const prdSchema = z.object({
  'Executive Summary': z.string().min(100),
  'Problem Statement': z.string().min(50),
  'Requirements': z.array(z.object({
    id: z.string().regex(/^REQ-\d+$/),
    description: z.string().min(20),
    priority: z.enum(['P0', 'P1', 'P2', 'P3']),
  })).min(5),
  'Success Metrics': z.array(z.object({
    metric: z.string(),
    target: z.string(),
  })).min(3),
  'Technical Constraints': z.string(),
});

describe('LLM Output Schema Validation', () => {
  it('should generate PRD matching template schema', async () => {
    const document = await generateDocument({
      type: 'prd',
      userInputs: { projectDescription: 'E-commerce platform' },
    });

    // Parse markdown into sections
    const sections = parseMarkdownSections(document.content);

    // VERIFY: All required sections present
    const validation = prdSchema.safeParse(sections);
    expect(validation.success).toBe(true);

    if (!validation.success) {
      console.error('Schema validation errors:', validation.error.errors);
    }
  });

  it('should generate Architecture doc with required sections', async () => {
    const architectureSchema = z.object({
      'High Level Architecture': z.string().min(200),
      'Tech Stack': z.array(z.object({
        category: z.string(),
        technology: z.string(),
        rationale: z.string(),
      })).min(10),
      'Data Models': z.array(z.object({
        name: z.string(),
        fields: z.array(z.any()),
      })).min(5),
      'API Specification': z.string().min(500),
    });

    const document = await generateDocument({ type: 'architecture', ... });
    const sections = parseMarkdownSections(document.content);

    expect(architectureSchema.safeParse(sections).success).toBe(true);
  });
});
```

**B. LLM Regression Tests (Golden Dataset)**
```typescript
describe('LLM Regression Tests - Golden Dataset', () => {
  // 20 curated prompts with known "good" outputs
  const goldenPrompts = [
    {
      id: 'prd-ecommerce',
      type: 'prd',
      userInputs: {
        projectDescription: 'B2B e-commerce platform for wholesale distributors',
        targetAudience: 'Wholesale buyers and sales reps',
        keyFeatures: 'Product catalog, bulk ordering, custom pricing',
      },
      expectedSections: [
        'Executive Summary',
        'Problem Statement',
        'Requirements',
        'Success Metrics',
      ],
    },
    {
      id: 'architecture-saas',
      type: 'architecture',
      userInputs: {
        projectDescription: 'Multi-tenant SaaS CRM',
        techStack: 'Next.js, PostgreSQL, AWS',
      },
      expectedSections: [
        'High Level Architecture',
        'Tech Stack',
        'Data Models',
      ],
    },
    // ... 18 more golden prompts
  ];

  goldenPrompts.forEach(({ id, type, userInputs, expectedSections }) => {
    it(`should generate valid ${type} for "${id}"`, async () => {
      const document = await generateDocument({ type, userInputs });
      const sections = parseMarkdownSections(document.content);

      // VERIFY: All expected sections present
      expectedSections.forEach(section => {
        expect(sections).toHaveProperty(section);
        expect(sections[section]).toBeTruthy();
      });

      // Save output for manual review (snapshot testing)
      expect(document.content).toMatchSnapshot(id);
    }, 60000); // 60s timeout for LLM calls
  });
});
```

**C. Cross-Model Consistency Tests (A/B Testing)**
```typescript
describe('Gemini vs Claude Output Consistency', () => {
  it('should produce structurally similar PRD from both models', async () => {
    const userInputs = {
      projectDescription: 'Customer support ticketing system',
    };

    // Generate with Gemini 2.5 Pro
    const geminiDoc = await generateDocument({
      type: 'prd',
      userInputs,
      llmModel: 'gemini-2.5-pro',
    });

    // Generate with Claude Sonnet 4.5
    const claudeDoc = await generateDocument({
      type: 'prd',
      userInputs,
      llmModel: 'claude-sonnet-4.5',
    });

    const geminiSections = parseMarkdownSections(geminiDoc.content);
    const claudeSections = parseMarkdownSections(claudeDoc.content);

    // VERIFY: Both outputs have same section structure
    expect(Object.keys(geminiSections).sort()).toEqual(
      Object.keys(claudeSections).sort()
    );

    // VERIFY: Both pass schema validation
    expect(prdSchema.safeParse(geminiSections).success).toBe(true);
    expect(prdSchema.safeParse(claudeSections).success).toBe(true);
  }, 90000); // 90s timeout for 2 LLM calls
});
```

**D. Markdown Rendering Tests**
```typescript
describe('TipTap Markdown Rendering', () => {
  it('should render generated PRD without errors', async () => {
    const document = await generateDocument({ type: 'prd', ... });

    const { container } = render(
      <TipTapEditor content={document.content} readOnly />
    );

    // VERIFY: No rendering errors
    expect(screen.queryByText('Failed to render document')).not.toBeInTheDocument();

    // VERIFY: Headings rendered correctly
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h2')).toBeInTheDocument();

    // VERIFY: Code blocks rendered (if present)
    const codeBlocks = container.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      expect(block.textContent).toBeTruthy();
    });
  });

  it('should handle malformed markdown gracefully', async () => {
    const malformedMarkdown = `
      # Heading

      This is a paragraph with **unclosed bold

      - List item 1
      - List item 2
        - Nested item [missing closing bracket
    `;

    const { container } = render(
      <TipTapEditor content={malformedMarkdown} readOnly />
    );

    // VERIFY: Editor doesn't crash
    expect(container.querySelector('.ProseMirror')).toBeInTheDocument();
  });
});
```

**E. Approval Rate Tracking**
```typescript
describe('User Approval Rate Tracking', () => {
  it('should track document approval vs regeneration', async () => {
    // Generate document
    const document = await generateDocument({ type: 'prd', ... });

    // User clicks "Approve"
    await fetch(`/api/documents/${document.id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    // VERIFY: Approval tracked in analytics
    const analytics = await getAnalytics(testUserId);
    expect(analytics.documents_approved).toBe(1);
    expect(analytics.approval_rate).toBe(1.0); // 100% (1 approved, 0 rejected)
  });

  it('should track regeneration requests', async () => {
    const document = await generateDocument({ type: 'prd', ... });

    // User clicks "Regenerate"
    await fetch(`/api/documents/${document.id}/regenerate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    // VERIFY: Regeneration tracked
    const analytics = await getAnalytics(testUserId);
    expect(analytics.documents_regenerated).toBe(1);
    expect(analytics.approval_rate).toBeLessThan(1.0);
  });

  it('should alert when approval rate drops below 80%', async () => {
    // Simulate 100 document generations with 75% approval
    for (let i = 0; i < 75; i++) {
      await approveDocument(generateTestDocument());
    }
    for (let i = 0; i < 25; i++) {
      await regenerateDocument(generateTestDocument());
    }

    // VERIFY: Alert sent to monitoring
    const alerts = await getSentryAlerts();
    expect(alerts).toContainEqual(
      expect.objectContaining({
        message: 'Document approval rate below 80%',
        level: 'warning',
        tags: { approval_rate: 0.75 },
      })
    );
  });
});
```

---

#### 3.2.3 API Route Performance & Timeout Management

**Risk Description:**
- Vercel serverless timeout: 60s (Pro plan) - hard limit
- Document generation: 15-25s p95 (NFR1) leaves only 35s buffer
- Cold starts: API Routes may take 500ms-2s to initialize
- Cross-region latency: Vercel us-east-1 ↔ Vertex AI us-central1 (~50ms RTT)
- N+1 query problem: Multiple database queries per API route

**Test Architecture Requirements:**

**A. Performance Tests**
```typescript
describe('API Route Performance', () => {
  it('should respond to GET /api/initiatives within 500ms', async () => {
    const start = Date.now();

    const response = await fetch('/api/initiatives', {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
    expect(response.status).toBe(200);
  });

  it('should generate document within 30s (p95 NFR1)', async () => {
    const timings: number[] = [];

    // Run 100 generations
    for (let i = 0; i < 100; i++) {
      const start = Date.now();
      await generateDocument({ type: 'prd', ... });
      timings.push(Date.now() - start);
    }

    // Calculate p95
    const sorted = timings.sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index];

    expect(p95).toBeLessThan(30_000); // 30 seconds

    console.log('Performance metrics:', {
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95,
      p99: sorted[Math.floor(sorted.length * 0.99)],
    });
  }, 3_600_000); // 1 hour timeout for 100 runs
});
```

**B. Timeout Handling Tests**
```typescript
describe('Timeout Management', () => {
  it('should timeout Vertex AI call after 50s and return error', async () => {
    // Mock Vertex AI to delay 55s (exceeds safe timeout)
    vi.mocked(vertexAI.runWorkflow).mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 55000))
    );

    const start = Date.now();
    const response = await fetch('/api/workflows/generate-document', {
      method: 'POST',
      headers: { Authorization: `Bearer ${testUserToken}` },
      body: JSON.stringify({ document_type: 'prd', ... }),
    });
    const duration = Date.now() - start;

    // VERIFY: API Route returns before 60s Vercel timeout
    expect(duration).toBeLessThan(55_000);
    expect(response.status).toBe(504); // Gateway Timeout

    const data = await response.json();
    expect(data.error).toBe('workflow_timeout');
  }, 60000);

  it('should use exponential backoff for Vertex AI retries', async () => {
    let attempts = 0;
    const attemptTimings: number[] = [];

    vi.mocked(vertexAI.invokeAgent).mockImplementation(async () => {
      attemptTimings.push(Date.now());
      attempts++;
      if (attempts < 3) {
        throw new Error('Transient failure');
      }
      return { response: 'Success' };
    });

    const start = Date.now();
    await invokeAgentWithRetry({ agentId: 'test-agent', ... });
    const duration = Date.now() - start;

    // VERIFY: 3 attempts made (initial + 2 retries)
    expect(attempts).toBe(3);

    // VERIFY: Exponential backoff (1s, 2s between retries)
    const delay1 = attemptTimings[1] - attemptTimings[0];
    const delay2 = attemptTimings[2] - attemptTimings[1];

    expect(delay1).toBeGreaterThanOrEqual(1000);
    expect(delay1).toBeLessThan(1500);
    expect(delay2).toBeGreaterThanOrEqual(2000);
    expect(delay2).toBeLessThan(2500);
  });
});
```

**C. N+1 Query Detection**
```typescript
describe('Database Query Optimization', () => {
  it('should fetch initiative with documents in single query (no N+1)', async () => {
    // Create initiative with 10 documents
    const initiative = await createInitiative(testUserToken, { title: 'Test' });
    for (let i = 0; i < 10; i++) {
      await createDocument(testUserToken, { initiative_id: initiative.id, ... });
    }

    // Spy on Supabase queries
    const queries: string[] = [];
    vi.spyOn(supabase, 'from').mockImplementation((table) => {
      queries.push(table);
      return originalSupabase.from(table);
    });

    // Fetch initiative with documents
    await fetch(`/api/initiatives/${initiative.id}?include=documents`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    // VERIFY: Only 2 queries (1 for initiative, 1 for all documents)
    // NOT 11 queries (1 + 10 individual document queries)
    expect(queries.filter(t => t === 'initiatives')).toHaveLength(1);
    expect(queries.filter(t => t === 'documents')).toHaveLength(1);
  });
});
```

**D. Cold Start Tests**
```typescript
describe('API Route Cold Starts', () => {
  it('should initialize API Route within 2s on cold start', async () => {
    // Simulate cold start by clearing module cache
    vi.resetModules();

    const start = Date.now();

    // First request after cold start
    const response = await fetch('/api/initiatives', {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    const duration = Date.now() - start;

    // VERIFY: Cold start + response < 2s
    expect(duration).toBeLessThan(2000);
    expect(response.status).toBe(200);
  });
});
```

---

### 3.3 TIER 3 - MODERATE RISKS

#### 3.3.1 ADK Agent Deployment & Invocation

**Risk Description:**
- 7 separate Python ADK agents deployed independently to Vertex AI Agent Engine
- Contract mismatch: API Routes expect agent response schema v2, but agent deployed v1
- Deployment pipeline failure could leave agents unavailable
- TypeScript ↔ Python type conversion issues

**Test Architecture Requirements:**

**A. Contract Tests**
```typescript
describe('ADK Agent Contracts', () => {
  const AGENTS = [
    'discovery-agent',
    'requirements-agent',
    'design-agent',
    'architecture-agent',
    'quality-agent',
    'validation-agent',
    'planning-agent',
  ];

  AGENTS.forEach(agentId => {
    it(`should invoke ${agentId} and receive valid response`, async () => {
      const response = await vertexAI.invokeAgent({
        agentId,
        input: 'Test query',
      });

      // VERIFY: Response matches expected schema
      expect(response).toMatchObject({
        agent_id: agentId,
        response: expect.any(String),
        metadata: expect.objectContaining({
          model: expect.any(String),
          tokens_used: expect.any(Number),
        }),
      });
    });

    it(`should handle ${agentId} errors gracefully`, async () => {
      // Mock agent to return error
      vi.mocked(vertexAI.invokeAgent).mockRejectedValue(
        new Error('Agent execution failed')
      );

      await expect(
        invokeAgentWithRetry({ agentId, input: 'Test' })
      ).rejects.toThrow('Agent execution failed');
    });
  });
});
```

**B. Version Compatibility Tests**
```typescript
describe('Agent Version Compatibility', () => {
  it('should detect agent version mismatch', async () => {
    // API expects agent response schema v2
    const expectedSchemaVersion = 2;

    const response = await vertexAI.invokeAgent({
      agentId: 'discovery-agent',
      input: 'Test',
    });

    // VERIFY: Agent returns compatible schema version
    expect(response.schema_version).toBe(expectedSchemaVersion);
  });
});
```

**C. Health Check Tests**
```typescript
describe('Agent Health Checks', () => {
  it('should verify all agents are deployed and healthy', async () => {
    const response = await fetch('/api/agents/health');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.agents).toHaveLength(7);

    data.agents.forEach(agent => {
      expect(agent.status).toBe('healthy');
    });
  });
});
```

---

#### 3.3.2 Three-Column Workspace Responsiveness

**Risk Description:**
- Desktop-first design (≥1440px) with responsive breakpoints
- Large documents (5,000+ lines of markdown) in TipTap editor
- Real-time chat updates while scrolling document
- Mobile: Single column with swipe navigation complexity

**Test Architecture Requirements:**

**A. Visual Regression Tests**
```typescript
describe('Workspace Visual Regression', () => {
  it('should render three columns at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/initiatives/${testInitiativeId}`);

    // Take screenshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot('workspace-desktop-1440px');

    // VERIFY: All 3 columns visible
    expect(await page.locator('.left-panel').isVisible()).toBe(true);
    expect(await page.locator('.middle-panel').isVisible()).toBe(true);
    expect(await page.locator('.right-panel').isVisible()).toBe(true);
  });

  it('should collapse left panel on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`/initiatives/${testInitiativeId}`);

    // VERIFY: Left panel collapsed
    expect(await page.locator('.left-panel').isVisible()).toBe(false);
    expect(await page.locator('.middle-panel').isVisible()).toBe(true);
    expect(await page.locator('.right-panel').isVisible()).toBe(true);
  });

  it('should show single column on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/initiatives/${testInitiativeId}`);

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot('workspace-mobile-375px');
  });
});
```

**B. Performance Tests (Large Documents)**
```typescript
describe('Workspace Performance - Large Documents', () => {
  it('should render 5000-line PRD without lag', async ({ page }) => {
    // Create document with 5000 lines of markdown
    const largeDocument = generateLargeMarkdown(5000);
    await createDocument(testUserToken, {
      initiative_id: testInitiativeId,
      content: largeDocument,
    });

    await page.goto(`/initiatives/${testInitiativeId}`);

    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        LCP: nav.largestContentfulPaint,
        FID: nav.firstInputDelay,
        TTI: nav.domInteractive,
      };
    });

    // VERIFY: Performance targets met (NFR1)
    expect(metrics.LCP).toBeLessThan(2500); // <2.5s
    expect(metrics.TTI).toBeLessThan(3500); // <3.5s
  });

  it('should maintain 60fps while scrolling large document', async ({ page }) => {
    const largeDocument = generateLargeMarkdown(5000);
    await createDocument(testUserToken, { content: largeDocument, ... });

    await page.goto(`/initiatives/${testInitiativeId}`);

    // Measure FPS during scroll
    const fps = await page.evaluate(() => {
      return new Promise(resolve => {
        let frameCount = 0;
        const startTime = performance.now();

        function countFrames() {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve(frameCount);
          }
        }

        requestAnimationFrame(countFrames);

        // Scroll document
        document.querySelector('.middle-panel').scrollBy(0, 1000);
      });
    });

    // VERIFY: Smooth scrolling (50+ fps acceptable)
    expect(fps).toBeGreaterThan(50);
  });
});
```

---

## 4. Test Strategy

### 4.1 Testing Pyramid

```
        /\
       /  \      E2E Tests (10 critical flows)
      /    \     - User signup → document generation → approval
     /______\    - Subscription upgrade flow
    /        \   Integration Tests (50+ API routes)
   /          \  - All API endpoints
  /____________\ - Vertex AI SDK integration
 /              \ Unit Tests (200+ components/utils)
/________________\ - React components
                   - Utility functions
                   - Validation schemas
```

### 4.2 Test Coverage by Layer

| Layer | Test Types | Coverage Target | Tools |
|-------|-----------|-----------------|-------|
| **Unit** | Component tests, utility functions | >80% code coverage | Vitest, React Testing Library |
| **Integration** | API Route tests, database queries | 100% of API routes | Vitest, Supabase test client |
| **E2E** | Critical user flows | 10 key scenarios | Playwright |
| **Security** | RLS policies, penetration tests | 100% of tables | Custom scripts, Supabase RPC |
| **Performance** | Load tests, NFR validation | NFR1, NFR4, NFR7 | k6, Lighthouse, Playwright |

### 4.3 Test Execution Strategy

**Pre-commit:**
- Unit tests (fast)
- Linting (ESLint, Prettier)

**Pre-push:**
- Integration tests
- Security tests (RLS policies)

**CI/CD Pipeline:**
- All unit + integration + security tests
- E2E tests (critical flows only)
- Performance smoke tests

**Nightly:**
- Full E2E suite
- Load tests (100+ concurrent users)
- Visual regression tests

**Pre-release:**
- Complete test suite
- Extended load tests (500+ concurrent users)
- Manual exploratory testing

---

## 5. Test Infrastructure Setup

### 5.1 Package Installation

```bash
# Core testing framework
pnpm add -D vitest @vitest/ui @vitest/coverage-v8

# React component testing
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E testing
pnpm add -D playwright @playwright/test

# API mocking
pnpm add -D msw

# Visual regression
pnpm add -D playwright-image-snapshot

# Load testing
pnpm add -D k6

# Test utilities
pnpm add -D faker @faker-js/faker
```

### 5.2 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### 5.3 Test Setup File

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Setup MSW server
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-clerk-key';
```

### 5.4 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.5 Test Database Setup (Supabase)

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Initialize Supabase locally
supabase init

# Start local Supabase (PostgreSQL + Realtime + Storage)
supabase start

# Apply migrations
supabase db reset

# Generate TypeScript types from schema
supabase gen types typescript --local > packages/types/supabase.ts
```

```typescript
// tests/utils/supabase-test-client.ts
import { createClient } from '@supabase/supabase-js';

export function createTestSupabaseClient(token?: string) {
  return createClient(
    'http://localhost:54321',
    'test-anon-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        ...(token && {
          headers: { Authorization: `Bearer ${token}` },
        }),
      },
    }
  );
}
```

### 5.6 Test Fixtures & Factories

```typescript
// tests/fixtures/user.factory.ts
import { faker } from '@faker-js/faker';

export function createUserFixture(overrides = {}) {
  return {
    id: faker.string.uuid(),
    clerk_user_id: `user_${faker.string.alphanumeric(16)}`,
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    avatar_url: faker.image.avatar(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function createInitiativeFixture(overrides = {}) {
  return {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraph(),
    status: 'active',
    phase: 'planning',
    phase_progress: faker.number.int({ min: 0, max: 100 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  };
}
```

---

## 6. Critical Test Suites

### 6.1 Security Test Suite Structure

```
tests/
├── security/
│   ├── rls-policies.test.ts           # Multi-tenant isolation
│   ├── authentication.test.ts         # Clerk JWT validation
│   ├── authorization.test.ts          # Resource ownership
│   ├── penetration.test.ts            # Negative tests
│   └── encryption.test.ts             # Data at rest/transit
```

### 6.2 Workflow Test Suite Structure

```
tests/
├── workflows/
│   ├── chaos.test.ts                  # Chaos engineering
│   ├── checkpoints.test.ts            # Resume from failure
│   ├── idempotency.test.ts            # Prevent duplicates
│   ├── state-consistency.test.ts      # Supabase state management
│   └── performance.test.ts            # <30s NFR validation
```

### 6.3 Integration Test Suite Structure

```
tests/
├── api/
│   ├── initiatives.test.ts            # CRUD operations
│   ├── documents.test.ts              # Document generation
│   ├── workflows.test.ts              # Workflow triggers
│   ├── agents.test.ts                 # ADK agent invocation
│   ├── webhooks/
│   │   ├── stripe.test.ts             # Billing webhooks
│   │   ├── clerk.test.ts              # User sync
│   │   └── vertex-ai.test.ts          # Workflow completion
│   └── billing/
│       ├── credits.test.ts            # Credit enforcement
│       └── subscriptions.test.ts      # Tier limits
```

### 6.4 E2E Test Suite Structure

```
tests/
├── e2e/
│   ├── user-onboarding.spec.ts        # Signup → first initiative
│   ├── document-generation.spec.ts    # Complete PRD flow
│   ├── subscription-upgrade.spec.ts   # Trial → Starter
│   ├── collaboration.spec.ts          # Multi-user (Phase 2)
│   └── error-scenarios.spec.ts        # Timeout, network errors
```

---

## 7. NFR Validation Scenarios

### 7.1 NFR1: Performance

**Target:** Page load <2s on 3G, document generation <30s (p95)

```typescript
describe('NFR1: Performance', () => {
  it('should load workspace in <2s on 3G network', async ({ page }) => {
    await page.emulateNetworkConditions({
      downloadThroughput: 1.5 * 1024 * 1024 / 8,
      uploadThroughput: 750 * 1024 / 8,
      latency: 100,
    });

    const start = Date.now();
    await page.goto('/initiatives/test-id');
    await page.waitForSelector('.workspace-shell');
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(2000);
  });

  it('should generate document in <30s (p95)', async () => {
    // See section 3.2.3 for full implementation
  });
});
```

### 7.2 NFR4: Real-time Updates <1s Latency

```typescript
describe('NFR4: Real-time Latency', () => {
  it('should broadcast workflow progress within 1s', async () => {
    const client = createSupabaseClient(userToken);
    const updates: any[] = [];

    client.channel(`workflow:${workflowId}`)
      .on('postgres_changes', { ... }, (payload) => {
        updates.push({ timestamp: Date.now(), payload });
      })
      .subscribe();

    const updateTime = Date.now();
    await updateWorkflowProgress(workflowId, { progress: 50 });

    await waitFor(() => updates.length > 0, { timeout: 2000 });

    const latency = updates[0].timestamp - updateTime;
    expect(latency).toBeLessThan(1000);
  });
});
```

### 7.3 NFR7: Availability (99% Uptime)

```typescript
describe('NFR7: Circuit Breaker & Graceful Degradation', () => {
  it('should retry Vertex AI calls with exponential backoff', async () => {
    // See section 3.2.3 for implementation
  });

  it('should serve cached responses when Supabase unavailable', async () => {
    vi.mocked(supabase.from).mockImplementation(() => {
      throw new ConnectionError('Database unavailable');
    });

    const response = await fetch('/api/initiatives/test-id', {
      headers: { Authorization: `Bearer ${testToken}` },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Cache')).toBe('HIT');
  });
});
```

### 7.4 NFR10-12: Security

```typescript
describe('NFR10-12: Security', () => {
  it('should enforce HTTPS in production', async () => {
    process.env.NODE_ENV = 'production';

    const response = await fetch('http://outcomesignal.app/api/initiatives');

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toMatch(/^https:/);
  });

  it('should encrypt sensitive data at rest', async () => {
    // See section 3.1.3 for implementation
  });
});
```

---

## 8. Test Coverage Targets

### 8.1 Coverage by Test Type

| Test Type | Target | Measurement |
|-----------|--------|-------------|
| **Unit Tests** | >80% code coverage | Vitest coverage report |
| **Integration Tests** | 100% API routes | Manual checklist |
| **E2E Tests** | 10 critical flows | Playwright test count |
| **Security Tests** | 100% RLS policies | Automated audit script |
| **Performance Tests** | All NFRs validated | Custom performance suite |

### 8.2 Coverage Enforcement

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --coverage",
    "test:integration": "vitest run tests/api",
    "test:e2e": "playwright test",
    "test:security": "vitest run tests/security",
    "test:ci": "pnpm test:unit && pnpm test:integration && pnpm test:security && pnpm test:e2e"
  }
}
```

**Coverage Gates:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      // Fail build if coverage below threshold
      all: true,
    },
  },
});
```

---

## 9. CI/CD Integration

### 9.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests with coverage
        run: pnpm test:unit

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: supabase/postgres:15.1.0.117
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run Supabase migrations
        run: |
          npx supabase db reset
          npx supabase db push

      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4

      - name: Install dependencies
        run: pnpm install

      - name: Run security tests (RLS policies)
        run: pnpm test:security

      - name: Run SAST (Static Application Security Testing)
        run: npx eslint . --ext .ts,.tsx --max-warnings 0

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  performance-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4

      - name: Install dependencies
        run: pnpm install

      - name: Run performance tests
        run: pnpm test:performance

      - name: Upload performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: performance-results/
```

### 9.2 Pre-commit Hooks

```json
// package.json
{
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "vitest related --run"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged
```

```bash
# .husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm test:integration
pnpm test:security
```

---

## 10. Monitoring & Alerting Strategy

### 10.1 Production Quality Metrics

**Instrument key metrics in production:**

```typescript
// lib/monitoring/metrics.ts
import * as Sentry from '@sentry/nextjs';

export function trackWorkflowMetrics(workflow: WorkflowExecution) {
  // Track workflow duration
  Sentry.metrics.distribution(
    'workflow.generation_time_ms',
    workflow.generation_time_ms,
    {
      tags: {
        document_type: workflow.document_type,
        llm_model: workflow.llm_model,
        status: workflow.status,
      },
    }
  );

  // Track workflow failures
  if (workflow.status === 'failed') {
    Sentry.metrics.increment('workflow.failed', 1, {
      tags: {
        error_type: workflow.error_type,
        document_type: workflow.document_type,
      },
    });
  }
}

export function trackRealtimeLatency(latencyMs: number, eventType: string) {
  Sentry.metrics.gauge('realtime.latency_ms', latencyMs, {
    tags: { event_type: eventType },
  });
}

export function trackApprovalRate(approved: boolean, documentType: string) {
  Sentry.metrics.increment(
    approved ? 'document.approved' : 'document.regenerated',
    1,
    { tags: { document_type: documentType } }
  );
}
```

### 10.2 Sentry Integration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance monitoring
  tracesSampleRate: 0.1,

  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Custom integrations
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/outcomesignal\.app/,
      ],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

### 10.3 Alert Rules

**Critical Alerts (PagerDuty/Slack):**

| Metric | Threshold | Action |
|--------|-----------|--------|
| **Document generation p95** | >35s | Alert: Approaching timeout limit |
| **RLS policy violation** | Any occurrence | Alert: Potential security breach |
| **Workflow failure rate** | >5% | Alert: System degradation |
| **API error rate** | >1% | Alert: Service issues |
| **Uptime** | <99% | Alert: Availability breach |

**Warning Alerts (Slack only):**

| Metric | Threshold | Action |
|--------|-----------|--------|
| **Real-time latency** | >2s | Warn: Degraded UX |
| **LLM output validation failures** | >10% | Warn: Quality issue |
| **Document approval rate** | <80% | Warn: User satisfaction low |
| **Credit enforcement errors** | Any occurrence | Warn: Revenue impact |

**Sentry Alert Configuration:**

```javascript
// Sentry dashboard → Alerts
{
  "name": "Document Generation Timeout Warning",
  "conditions": [
    {
      "metric": "workflow.generation_time_ms",
      "aggregation": "p95",
      "threshold": 35000,
      "timeWindow": "5m"
    }
  ],
  "actions": [
    { "type": "slack", "channel": "#alerts-critical" },
    { "type": "pagerduty", "service": "outcomesignal-backend" }
  ]
}
```

### 10.4 Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const checks = await Promise.allSettled([
    checkSupabase(),
    checkVertexAI(),
    checkStripe(),
  ]);

  const healthy = checks.every(c => c.status === 'fulfilled');

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'degraded',
      checks: {
        supabase: checks[0].status === 'fulfilled' ? 'ok' : 'down',
        vertexAI: checks[1].status === 'fulfilled' ? 'ok' : 'down',
        stripe: checks[2].status === 'fulfilled' ? 'ok' : 'down',
      },
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}

async function checkSupabase() {
  const { error } = await supabase.from('users').select('id').limit(1);
  if (error) throw error;
}

async function checkVertexAI() {
  // Ping Vertex AI Agent Engine
  await vertexAI.listAgents();
}

async function checkStripe() {
  // Verify Stripe API connectivity
  await stripe.products.list({ limit: 1 });
}
```

---

## 11. Test Data Management

### 11.1 Test Data Strategy

**Principles:**
- Use factories for dynamic test data (Faker.js)
- Use fixtures for static/golden test data
- Isolate test data per test (no shared state)
- Clean up test data after each test

### 11.2 Factory Functions

```typescript
// tests/factories/index.ts
import { faker } from '@faker-js/faker';

export const factories = {
  user: (overrides = {}) => ({
    id: faker.string.uuid(),
    clerk_user_id: `user_${faker.string.alphanumeric(16)}`,
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    ...overrides,
  }),

  initiative: (overrides = {}) => ({
    id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraph(),
    status: 'active',
    phase: 'planning',
    ...overrides,
  }),

  document: (overrides = {}) => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['prd', 'architecture', 'ux_overview']),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(10),
    status: 'draft',
    ...overrides,
  }),
};
```

### 11.3 Golden Dataset (LLM Regression Testing)

```typescript
// tests/fixtures/golden-prompts.ts
export const goldenPrompts = [
  {
    id: 'prd-ecommerce-wholesale',
    type: 'prd',
    userInputs: {
      projectDescription: 'B2B e-commerce platform for wholesale distributors',
      targetAudience: 'Wholesale buyers and sales representatives',
      keyFeatures: 'Product catalog, bulk ordering, tiered pricing, order history',
    },
    expectedOutput: {
      sections: [
        'Executive Summary',
        'Problem Statement',
        'Requirements',
        'Success Metrics',
      ],
      minWordCount: 2000,
    },
  },
  // ... 19 more golden prompts
];
```

### 11.4 Database Seeding

```typescript
// tests/utils/seed-database.ts
export async function seedTestDatabase() {
  // Create test users
  const users = await Promise.all([
    createUser(factories.user({ email: 'testA@example.com' })),
    createUser(factories.user({ email: 'testB@example.com' })),
  ]);

  // Create test initiatives
  for (const user of users) {
    await createInitiative(factories.initiative({ user_id: user.id }));
  }

  return { users };
}

export async function cleanupTestDatabase() {
  // Delete all test data (cascade deletes handle related records)
  await supabaseAdmin.from('users').delete().like('email', '%@example.com');
}
```

---

## 12. Implementation Roadmap

### 12.1 Week 1: Foundation

**Goal:** Set up test infrastructure and security tests

**Tasks:**
- [ ] Install testing dependencies (Vitest, Playwright, MSW)
- [ ] Configure Vitest and Playwright
- [ ] Set up local Supabase instance for testing
- [ ] Create test fixtures and factories
- [ ] **Write RLS policy audit suite** (CRITICAL - before any code)
- [ ] Write JWT authentication tests
- [ ] Configure CI/CD pipeline (GitHub Actions)

**Deliverables:**
- Test infrastructure functional
- Security test suite passing
- CI/CD pipeline green

---

### 12.2 Week 2: Workflow & Integration Tests

**Goal:** Test AI workflow state management and API routes

**Tasks:**
- [ ] Write workflow chaos engineering tests
- [ ] Write checkpoint & resume tests
- [ ] Write idempotency tests
- [ ] Write API route integration tests (initiatives, documents, workflows)
- [ ] Write credit enforcement tests
- [ ] Write Stripe webhook tests

**Deliverables:**
- Workflow test suite complete
- Integration test coverage >50% of API routes

---

### 12.3 Week 3: E2E & Performance Tests

**Goal:** Critical user flows and NFR validation

**Tasks:**
- [ ] Write 10 critical E2E flows (Playwright)
- [ ] Write performance tests (NFR1: <30s document generation)
- [ ] Write real-time latency tests (NFR4: <1s)
- [ ] Write load tests (100 concurrent users)
- [ ] Set up visual regression testing

**Deliverables:**
- E2E test suite passing
- Performance baselines established

---

### 12.4 Week 4: Monitoring & Documentation

**Goal:** Production monitoring and test documentation

**Tasks:**
- [ ] Integrate Sentry for production monitoring
- [ ] Configure alert rules (critical + warning)
- [ ] Create health check endpoint
- [ ] Document test strategy (this document)
- [ ] Train team on test execution
- [ ] Create runbook for test failures

**Deliverables:**
- Monitoring dashboards live
- Test documentation complete
- Team trained

---

### 12.5 Ongoing: Continuous Improvement

**Monthly:**
- Review test coverage reports
- Update golden dataset with new prompts
- Analyze test failure patterns
- Optimize slow tests

**Quarterly:**
- Security penetration testing (external audit)
- Load testing at scale (500+ users)
- Review and update NFR targets
- Evaluate new testing tools

---

## Conclusion

This comprehensive test plan provides **early test architecture guidance** for OutcomeSignal, focusing on the **8 highest-risk areas** identified through architectural analysis.

### Key Recommendations

1. **Write security tests FIRST** - RLS policies are too critical to retrofit
2. **Implement chaos testing** - Workflow state management is complex
3. **Test billing atomically** - Revenue-critical credit enforcement
4. **Validate LLM outputs** - Schema validation prevents broken UX
5. **Monitor production metrics** - Early detection of quality degradation

### Success Metrics

By following this test plan, OutcomeSignal should achieve:
- ✅ **Zero multi-tenant data leaks** (RLS audit suite)
- ✅ **99% uptime** (circuit breakers, health checks)
- ✅ **<30s document generation p95** (performance tests)
- ✅ **80%+ document approval rate** (LLM regression tests)
- ✅ **>80% code coverage** (unit + integration tests)

### Next Steps

1. **Review this test plan** with engineering team
2. **Prioritize Week 1 tasks** (security tests are blocking)
3. **Allocate 25% of development time** to testing (industry best practice)
4. **Integrate test results** into sprint retrospectives

---

**Document Status:** ✅ Complete and ready for implementation

🧪 **Prepared by Quinn (Test Architect & Quality Advisor)**
Powered by BMAD™ Core

---

## Appendix

### A. Test Execution Commands

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:e2e            # E2E tests only
pnpm test:security       # Security tests only
pnpm test:performance    # Performance tests only

# Run tests with coverage
pnpm test:unit --coverage

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test tests/security/rls-policies.test.ts

# Run tests matching pattern
pnpm test --grep "workflow"

# Run E2E tests in headed mode (see browser)
pnpm exec playwright test --headed

# Generate E2E test report
pnpm exec playwright show-report
```

### B. Useful Testing Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)

### C. Contact

For questions about this test plan:
- **Quinn (QA Agent):** Use `*help` to see available commands
- **Test Plan Updates:** Submit PR to update this document
- **Test Failures:** Check runbook in [docs/qa/runbook.md](runbook.md)
