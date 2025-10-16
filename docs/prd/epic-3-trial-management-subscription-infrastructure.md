# Epic 3: Trial Management & Subscription Infrastructure

**Goal:** Implement 7-day trial with Brief-only limit, paywall modal, Stripe subscription flow, and usage tracking.

**Priority:** P0 (Must-Have)
**Dependencies:** Epic 1 (auth), Epic 2 (workspace UI for paywall modal)
**Estimated Effort:** 3-4 weeks

## Story 3.1: Create Subscription Tier Data Model
**As a** developer
**I want** a clear data model for subscription tiers
**So that** we can enforce tier-based limits consistently

**Acceptance Criteria:**
- Add `subscriptions` table to Supabase:
  - `id`, `user_id`, `tier` (enum: 'trial', 'starter', 'professional', 'enterprise'), `stripe_subscription_id`, `status` (active/canceled/expired), `trial_ends_at`, `current_period_end`, `created_at`, `updated_at`
- Add `usage_tracking` table:
  - `id`, `user_id`, `month` (YYYY-MM), `credits_used`, `credits_limit`, `initiatives_count`, `initiatives_limit`, `created_at`
- Seed default tier limits as constants:
  - Trial: 1 Initiative, Brief-only document, 7-day expiration, no export
  - Starter: 3 Initiatives/mo, 25 credits/mo, all 8 document types, export enabled
  - Professional: Unlimited Initiatives, 100 credits/mo, all features
  - Enterprise: Unlimited everything

**Technical Notes:**
- Use PostgreSQL enums for `tier` and `status` fields
- Index on `user_id` for fast lookups

---

## Story 3.2: Implement Trial Signup Flow (No Credit Card)
**As a** new user
**I want** to start a 7-day trial without entering payment info
**So that** I can evaluate OutcomeSignal risk-free

**Acceptance Criteria:**
- On first sign-up via Clerk, automatically create `subscriptions` record:
  - `tier: 'trial'`, `status: 'active'`, `trial_ends_at: now() + 7 days`
- Create `usage_tracking` record with trial limits
- Redirect to onboarding flow (optional, can be inline tutorial)
- Dashboard shows trial badge: "Trial: 6 days remaining"

**Technical Notes:**
- Trigger subscription creation in Clerk webhook (Story 1.5)
- Calculate days remaining: `trial_ends_at - now()`

---

## Story 3.3: Enforce Trial Limits (1 Initiative, Brief-Only)
**As a** system
**I want** to block trial users from exceeding limits
**So that** we can drive conversions to paid tiers

**Acceptance Criteria:**
- **Initiative Limit:**
  - Trial users can create max 1 Initiative
  - "Create Initiative" button disabled if limit reached
  - Hover tooltip: "Upgrade to Starter to create up to 3 Initiatives/month"
- **Document Limit:**
  - Trial users can only generate Brief document (first document in Planning phase)
  - Agent blocks PRD creation: "You've reached the trial limit. Upgrade to continue with PRD creation."
  - Shows paywall modal (Story 3.5)
- **Export Restriction:**
  - Export buttons hidden/disabled for trial users
  - Tooltip: "Export available on paid plans"

**Technical Notes:**
- Check limits before creation (frontend validation + backend enforcement)
- Query `usage_tracking` table for current counts

---

## Story 3.4: Track Trial Expiration and Auto-Expire
**As a** system
**I want** to automatically expire trials after 7 days
**So that** we enforce time-based limits

**Acceptance Criteria:**
- Daily cron job (or Supabase Edge Function) checks for expired trials
- Update `subscriptions.status` to 'expired' if `trial_ends_at < now()`
- Expired trial users:
  - Can view existing Initiatives (read-only)
  - Cannot create new Initiatives or documents
  - See paywall modal on login
- Email notification sent 1 day before expiration (optional, can defer)

**Technical Notes:**
- Use Supabase Edge Function with `cron` trigger: `0 0 * * *` (daily at midnight)
- Consider adding grace period (e.g., 24 hours post-expiration)

---

## Story 3.5: Build Paywall Modal with Tier Comparison
**As a** trial user who hit limits
**I want** to see pricing options in a modal
**So that** I can upgrade to continue using OutcomeSignal

**Acceptance Criteria:**
- Modal displays when:
  - Trial expires (on login)
  - User attempts to create 2nd Initiative
  - User attempts to generate 2nd document (non-Brief)
  - User attempts to export
- Modal content:
  - "Upgrade to Continue" headline
  - Tier comparison table (Starter $49/mo, Professional $149/mo, Enterprise $499/mo)
  - Feature highlights (Initiatives, credits, documents, export)
  - "Select Plan" buttons → Stripe Checkout
- Modal dismissible only if trial still valid (not expired)

**Technical Notes:**
- Use shadcn/ui Dialog component
- Pass `trigger_reason` to modal for analytics (e.g., "initiative_limit")

---

## Story 3.6: Integrate Stripe Checkout for Subscriptions
**As a** user
**I want** to purchase a subscription via Stripe
**So that** I can unlock paid features

**Acceptance Criteria:**
- "Select Plan" button redirects to Stripe Checkout (hosted page)
- Stripe Checkout configured with:
  - Monthly subscription products (Starter $49, Pro $149, Enterprise $499)
  - User email pre-filled from Clerk
  - Success URL: `/dashboard?checkout=success`
  - Cancel URL: `/dashboard?checkout=canceled`
- On successful payment, Stripe webhook updates Supabase `subscriptions` table:
  - `tier`, `stripe_subscription_id`, `status: 'active'`, `current_period_end`
- User redirected to dashboard with success message

**Technical Notes:**
- Create Stripe products and prices in Stripe Dashboard
- Store Stripe price IDs in environment variables
- Use Next.js API route for Checkout session creation: `/api/stripe/create-checkout-session`

---

## Story 3.7: Handle Stripe Webhooks for Subscription Events
**As a** system
**I want** to listen to Stripe webhooks for subscription changes
**So that** we can keep subscription status in sync

**Acceptance Criteria:**
- Stripe webhook endpoint: `/api/webhooks/stripe`
- Listen for events:
  - `checkout.session.completed` → Activate subscription
  - `invoice.payment_succeeded` → Extend `current_period_end`
  - `customer.subscription.deleted` → Cancel subscription (set `status: 'canceled'`)
  - `invoice.payment_failed` → Mark subscription `status: 'past_due'`
- Verify Stripe webhook signature for security
- Log all webhook events to Supabase for audit trail

**Technical Notes:**
- Use `stripe` Node.js library for webhook verification
- Store Stripe webhook secret in environment variable
- Idempotent processing (handle duplicate events gracefully)

---

## Story 3.8: Implement Usage Tracking (Credits and Initiatives)
**As a** system
**I want** to track monthly usage (credits, Initiatives)
**So that** we can enforce tier-based limits

**Acceptance Criteria:**
- Increment `usage_tracking.credits_used` on:
  - Document generation (1 credit)
  - Major document revision (1 credit)
- Increment `usage_tracking.initiatives_count` on Initiative creation
- Block actions if limits exceeded:
  - `credits_used >= credits_limit` → Show "Out of credits" modal with top-off option
  - `initiatives_count >= initiatives_limit` → Block Initiative creation
- Reset `usage_tracking` monthly (1st of month via cron job)

**Technical Notes:**
- Use PostgreSQL `ON CONFLICT` for upsert pattern
- Display usage in dashboard: "Credits: 12 / 25 used this month"

---
