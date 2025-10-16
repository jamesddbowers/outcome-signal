# Epic 9: Monitoring, Analytics & Launch Prep

**Goal:** Set up error tracking, logging, usage analytics, conversion funnels, and launch readiness checklist.

**Priority:** P1 (Should-Have)
**Dependencies:** All prior epics (monitors entire system)
**Estimated Effort:** 2-3 weeks

## Story 9.1: Integrate Sentry for Error Tracking
**As a** developer
**I want** to track frontend and backend errors
**So that** we can fix bugs quickly

**Acceptance Criteria:**
- Sentry project created for OutcomeSignal
- Frontend integration:
  - Sentry SDK initialized in Next.js (`_app.tsx`)
  - Captures unhandled errors, promise rejections, React errors
  - Source maps uploaded for readable stack traces
- Backend integration:
  - Sentry SDK initialized in FastAPI (via middleware)
  - Captures API errors, agent workflow failures
- Alerts configured for high-error-rate (>10 errors/hour)

**Technical Notes:**
- Use Sentry's Next.js SDK: `@sentry/nextjs`
- Store Sentry DSN in environment variable
- Tag errors with `environment` (dev/staging/prod)

---

## Story 9.2: Set Up Application Logging (Cloud Logging)
**As a** developer
**I want** structured logging for all services
**So that** we can debug issues and monitor system health

**Acceptance Criteria:**
- Frontend: Log critical user actions (signup, subscription, document approval) to Vercel logs
- Backend: Log all API requests, agent invocations, workflow steps to Google Cloud Logging
- Logging levels: DEBUG, INFO, WARN, ERROR
- Structured logs with metadata:
  - `user_id`, `initiative_id`, `document_id`, `timestamp`, `message`, `level`
- Log retention: 30 days (configurable)

**Technical Notes:**
- Use `winston` or `pino` for structured logging (Node.js)
- Use `logging` library for Python (FastAPI)
- Search logs via GCP Logs Explorer

---

## Story 9.3: Implement Usage Analytics (Posthog or Mixpanel)
**As a** PM
**I want** to track user behavior and engagement
**So that** I can optimize conversion and retention

**Acceptance Criteria:**
- Analytics tool selected (Posthog or Mixpanel)
- Track key events:
  - **Signup funnel:** Page view → Signup click → Account created
  - **Onboarding:** First Initiative created → First Brief generated → First Brief approved
  - **Conversion funnel:** Trial started → Paywall shown → Checkout initiated → Subscription active
  - **Engagement:** Documents generated/month, credits used, Initiatives created
- Dashboards for:
  - Signup → Trial → Paid conversion rate
  - Time to first value (signup → first approved document)
  - Retention (DAU, WAU, MAU)

**Technical Notes:**
- Use Posthog (open-source, self-hosted option) or Mixpanel (SaaS)
- Install SDK in frontend and backend
- Define events in `events.ts` constants file for consistency

---

## Story 9.4: Build Conversion Funnel Dashboard
**As a** PM
**I want** to visualize the trial-to-paid conversion funnel
**So that** I can identify drop-off points

**Acceptance Criteria:**
- Dashboard shows:
  - Step 1: Signups (100%)
  - Step 2: First Initiative created (X%)
  - Step 3: First Brief approved (X%)
  - Step 4: Paywall shown (X%)
  - Step 5: Checkout initiated (X%)
  - Step 6: Subscription active (X%)
- Identify biggest drop-off (e.g., Brief approved → Paywall shown)
- Track conversion rate by source (organic, referral, paid ads)

**Technical Notes:**
- Use analytics tool's funnel feature (Posthog/Mixpanel built-in)
- Target overall conversion: 20-30% trial → paid (industry benchmark for SaaS)

---

## Story 9.5: Set Up Uptime Monitoring (Vercel Analytics + UptimeRobot)
**As a** operations
**I want** to monitor uptime and performance
**So that** we can detect outages quickly

**Acceptance Criteria:**
- UptimeRobot (or similar) pings:
  - Frontend: `https://outcomesignal.com` (every 5 minutes)
  - Backend API: `https://api.outcomesignal.com/health` (every 5 minutes)
- Vercel Analytics enabled for:
  - Core Web Vitals (LCP, FID, CLS)
  - Page load times
  - Edge function performance
- Alerts configured:
  - Downtime > 5 minutes → PagerDuty/Slack
  - Error rate > 5% → Slack

**Technical Notes:**
- Create `/health` endpoint in FastAPI (returns 200 OK with system status)
- UptimeRobot free tier supports 50 monitors

---

## Story 9.6: Create Launch Readiness Checklist
**As a** PM
**I want** a comprehensive pre-launch checklist
**So that** we ensure quality and readiness

**Acceptance Criteria:**
- Checklist document (Notion or GitHub) covering:
  - **Functionality:** All P0 stories completed and tested
  - **Performance:** NFR1-4 validated (response times, render times)
  - **Security:** Clerk auth tested, Supabase RLS enabled, HTTPS enforced
  - **Billing:** Stripe webhooks tested, subscription flows validated
  - **Compliance:** Terms of Service, Privacy Policy published
  - **Monitoring:** Sentry, logging, analytics verified
  - **Documentation:** User onboarding guide, help center articles
  - **Marketing:** Landing page live, signup flow tested
  - **Support:** Support email configured (support@outcomesignal.com)
- Go/No-Go meeting before launch (all checklist items complete)

**Technical Notes:**
- Use Linear or Notion for checklist tracking
- Assign owners for each checklist category

---

## Story 9.7: Conduct End-to-End Launch Simulation
**As a** QA
**I want** to simulate a full user journey in production-like environment
**So that** we validate the entire system works end-to-end

**Acceptance Criteria:**
- Staging environment configured (mirrors production)
- Test scenario:
  1. Signup (email/password + Google OAuth)
  2. Create Initiative
  3. Generate Brief (trial user, first document)
  4. Approve Brief
  5. Attempt to generate PRD → Paywall triggers
  6. Complete Stripe Checkout (test mode)
  7. Generate PRD, Architecture, Security, QA (paid user)
  8. Export documents (single and bulk ZIP)
  9. Revise PRD (credit deduction)
  10. Create 2nd Initiative (Starter tier limit: 3/mo)
- All steps logged, monitored, and succeed without errors

**Technical Notes:**
- Use Stripe test mode for payment simulation
- Record session with screen recording for documentation
- Invite 3-5 design partners for beta testing (collect feedback)

---
