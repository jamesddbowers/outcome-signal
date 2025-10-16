# Epic 8: LLM A/B Testing & Optimization

**Goal:** Implement A/B testing framework for Gemini 2.5 Pro vs Claude Sonnet 4.5, track quality/cost/performance metrics, and select primary LLM based on decision matrix.

**Priority:** P1 (Should-Have)
**Dependencies:** Epic 5 (agent orchestration to test)
**Estimated Effort:** 2-3 weeks

## Story 8.1: Implement LLM Provider Abstraction Layer
**As a** developer
**I want** a unified interface for multiple LLM providers
**So that** we can easily swap between Gemini and Claude

**Acceptance Criteria:**
- Create `LLMProvider` abstract class with methods:
  - `generate(prompt, system_prompt, temperature, max_tokens)` → returns completion
  - `stream(prompt, system_prompt)` → returns streaming iterator
- Implement concrete classes:
  - `GeminiProvider` (uses Google AI Studio SDK)
  - `ClaudeProvider` (uses Anthropic SDK)
- Configuration via environment variable: `PRIMARY_LLM_PROVIDER=gemini|claude`
- Agents use LLMProvider interface (no direct SDK calls)

**Technical Notes:**
- Use factory pattern for provider instantiation
- Store API keys in environment variables (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`)

---

## Story 8.2: Implement A/B Testing Assignment Logic
**As a** system
**I want** to randomly assign users to LLM variants
**So that** we can compare performance with statistical significance

**Acceptance Criteria:**
- On first document generation, assign user to variant:
  - 50% Gemini 2.5 Pro
  - 50% Claude Sonnet 4.5
- Store assignment in `users` table: `ab_test_variant` (gemini|claude)
- Assignment persists for user's lifetime (no mid-test switching)
- Admin override available for testing: `FORCE_LLM_VARIANT=gemini|claude`

**Technical Notes:**
- Use deterministic hashing (user_id % 2) for reproducibility
- Design partners (first 10-20 users) can opt into specific variant for feedback

---

## Story 8.3: Track Quality Metrics (Approval Rate)
**As a** system
**I want** to track document approval rate by LLM variant
**So that** we can measure quality

**Acceptance Criteria:**
- Add `llm_metrics` table:
  - `id`, `user_id`, `variant` (gemini|claude), `document_id`, `document_type`, `approved` (boolean), `revision_count`, `approval_time_seconds`, `created_at`
- On document approval/rejection, log metrics:
  - Approval: `approved: true`, `revision_count: N`, `approval_time_seconds: X`
  - Rejection: `approved: false`, `revision_count: N+1`
- Calculate approval rate: `(approved_count / total_count) * 100%` per variant
- Target: 80%+ approval rate

**Technical Notes:**
- Approval rate = first draft approved without major revisions
- Track `revision_count` to measure iteration needed

---

## Story 8.4: Track Cost Metrics (LLM API Costs)
**As a** system
**I want** to track LLM API costs per document
**So that** we can measure unit economics

**Acceptance Criteria:**
- Add `cost_per_document` field to `llm_metrics` table
- Calculate cost per document:
  - Gemini 2.5 Pro: (input_tokens * $0.00125 / 1K) + (output_tokens * $0.005 / 1K)
  - Claude Sonnet 4.5: (input_tokens * $0.003 / 1K) + (output_tokens * $0.015 / 1K)
- Track token usage via LLM provider API response (`usage.input_tokens`, `usage.output_tokens`)
- Calculate average cost per variant
- Target: <$0.10 per document

**Technical Notes:**
- Token counts returned by both Gemini and Claude APIs
- Store pricing as constants (update if providers change pricing)

---

## Story 8.5: Track Performance Metrics (Response Time)
**As a** system
**I want** to track LLM response time per document
**So that** we can measure user experience

**Acceptance Criteria:**
- Add `response_time_ms` field to `llm_metrics` table
- Measure time from API request to completion (excluding network latency)
- Track percentiles:
  - p50 (median)
  - p95 (95th percentile)
  - p99 (99th percentile)
- Target: <30s for p95 response time

**Technical Notes:**
- Use high-resolution timer (`performance.now()` in Node.js)
- Exclude streaming time (measure full completion time)

---

## Story 8.6: Build A/B Test Decision Dashboard and Select Primary LLM
**As a** PM
**I want** a dashboard comparing LLM variants
**So that** I can make data-driven decision on primary LLM

**Acceptance Criteria:**
- Admin dashboard (internal only) shows:
  - Approval rate by variant (Gemini vs Claude)
  - Average cost per document by variant
  - p95 response time by variant
  - Sample size (documents generated per variant)
- Decision matrix (weighted scoring):
  - Quality: 40% (approval rate)
  - Cost: 40% (cost per document)
  - Performance: 20% (p95 response time)
- After 100+ documents per variant (minimum for statistical significance):
  - Calculate weighted scores
  - Select winner
  - Update `PRIMARY_LLM_PROVIDER` environment variable
- Document decision in PRD change log

**Technical Notes:**
- Use SQL queries to aggregate metrics from `llm_metrics` table
- Dashboard can be simple (Next.js admin page, protected route)
- Target completion: End of Month 2 (design partner phase)

---
