# 8. Core Workflows

## 8.1 User Onboarding & First Initiative

### Overview
New users sign up without providing payment information and immediately receive a 7-day trial with access to create their first initiative.

### Workflow Steps

```
1. User signs up via Clerk authentication
   ↓
2. Clerk triggers user.created webhook → POST /api/webhooks/clerk
   ↓
3. Webhook handler (route.ts):
   - Verifies webhook signature (Svix)
   - Creates user record in Supabase users table
   - Calls createTrialSubscriptionForUser() utility
   ↓
4. Trial Subscription Creation (trial-subscription.ts):
   - Checks for existing subscription (idempotency)
   - Creates subscription record:
     * tier: 'trial'
     * status: 'active'
     * trial_ends_at: now + 7 days
     * current_period_end: trial_ends_at
   - Creates usage_tracking record:
     * credits_limit: 0 (Brief doesn't consume credits)
     * initiatives_limit: 1
     * month: current month (YYYY-MM format)
   ↓
5. User redirected to dashboard
   ↓
6. Dashboard layout fetches subscription via getUserSubscription()
   ↓
7. TrialBadge component displays "Trial: X days remaining"
   ↓
8. User creates first initiative → Navigate to workspace
```

### Timing
- Webhook processing: <500ms
- Trial duration: 7 days
- Badge update: Real-time on page load

### Error Handling
- Duplicate webhooks: Idempotent checks prevent duplicate subscriptions
- Race conditions: Server action includes retry logic (up to 10s)
- Missing user: Falls back to creating user from Clerk API if webhook hasn't run yet

### Files Involved
- `/app/api/webhooks/clerk/route.ts` - Webhook handler
- `/lib/utils/trial-subscription.ts` - Shared subscription creation logic
- `/lib/actions/subscription.ts` - Server action with race condition handling
- `/components/subscription/TrialBadge.tsx` - Trial status display
- `/lib/utils/subscription-helpers.ts` - Days remaining calculation

## 8.2 Generate PRD Document (Core Flow)

```
User: "Help me create a PRD"
→ API invokes Primary Agent
→ Agent asks 3-5 questions
→ User provides answers
→ API checks credits, triggers Reasoning Engine
→ Workflow executes 6 steps (15-25s)
→ Supabase Realtime broadcasts progress
→ Document saved, rendered in TipTap preview
```

**Timing:** 3-7 minutes total (including Q&A)

## 8.3 Document Approval & Next Steps

```
User reviews PRD → Clicks "Approve"
→ API updates status to "approved"
→ Initiative phase_progress updated
→ Agent suggests next documents (Architecture, UX)
```

## 8.4 Subscription Upgrade

```
User tries to create 2nd initiative (Trial limit: 1)
→ API returns 402 Payment Required
→ User clicks "Upgrade to Starter"
→ API creates Stripe Checkout Session
→ User completes payment
→ Stripe webhook updates Supabase
→ Credits and limits increased
```

## 8.5 Workflow Timing Summary

| Workflow | Time | Credits | NFR |
|----------|------|---------|-----|
| Document Generation | 15-25s (p95 <30s) | 1 credit | NFR1 |
| Document Revision | 8-15s | 0.5 credits | NFR1 |
| Chat Interaction | <2s | 0 credits | NFR4 |

---
