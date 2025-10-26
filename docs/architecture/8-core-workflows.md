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

## 8.4 Initiative Limit Enforcement

### Overview
Users are limited in the number of initiatives they can create based on their subscription tier. The system enforces these limits both at the UI level (disabled button) and at the API level (403 error).

### Subscription Tier Limits
- **Trial**: 1 initiative (total)
- **Starter**: 3 initiatives per month
- **Professional**: Unlimited
- **Enterprise**: Unlimited

### Workflow Steps

```
1. User navigates to dashboard
   ↓
2. CreateInitiativeButton component mounts
   ↓
3. Component calls checkCanCreateInitiative() server action
   ↓
4. Server Action Flow (checkCanCreateInitiative):
   - Get userId from Clerk auth
   - Call checkInitiativeLimit(userId)
   ↓
5. Limit Check Logic (checkInitiativeLimit):
   a. Get user's Supabase ID from Clerk ID
   b. Query subscriptions table → get user's tier
   c. Query usage_tracking table → get current month's initiatives_count
   d. Get tier limits from getTierLimits(tier)
   e. Compare:
      • If initiativesLimit === -1: ALLOW (unlimited)
      • If initiatives_count < initiativesLimit: ALLOW
      • Otherwise: BLOCK (limit reached)
   ↓
6. UI Response:
   - If ALLOWED: Button enabled, "Create Initiative" text
   - If BLOCKED: Button disabled, tooltip shows upgrade message
     * Trial: "Upgrade to Starter to create up to 3 Initiatives/month"
     * Starter: "Upgrade to Professional for unlimited Initiatives"
```

### API-Level Enforcement

When user attempts to create initiative via POST /api/initiatives:

```
1. POST /api/initiatives called
   ↓
2. Validate authentication (Clerk)
   ↓
3. Validate request body (Zod schema)
   ↓
4. Check subscription limit (checkInitiativeLimit)
   ↓
5. If limit reached:
   - Return 403 Forbidden
   - Response body:
     {
       "error": "INITIATIVE_LIMIT_REACHED",
       "message": "Trial users can only create 1 initiative...",
       "tier": "trial",
       "currentCount": 1,
       "limit": 1
     }
   - Log event: 'initiative_limit_blocked'
   ↓
6. If under limit:
   - Create initiative in initiatives table
   - Increment usage_tracking.initiatives_count
   - Return 201 Created with initiative data
   - Log event: 'initiative_created'
```

### Usage Tracking Updates

After successful initiative creation:

```
1. Calculate current month (YYYY-MM format)
   ↓
2. Call increment_initiatives_count() RPC function
   ↓
3. PostgreSQL Function:
   - Atomically increment initiatives_count
   - Handle missing usage_tracking record (auto-create)
   - Ensure thread-safety with row-level locking
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INITIATIVE_LIMIT_REACHED` | 403 | User has reached initiative limit for their tier |
| `VALIDATION_ERROR` | 400 | Invalid request body (title/description) |
| `Unauthorized` | 401 | User not authenticated |
| `User not found` | 404 | User record not found in database |

### Timing
- Limit check (UI): <200ms
- Initiative creation (under limit): <500ms
- Limit rejection: <100ms (fast fail)

### Files Involved
- **UI Components:**
  - `/components/hierarchy/CreateInitiativeButton.tsx` - Button with limit check
  - `/app/dashboard/page.tsx` - Uses CreateInitiativeButton

- **Server Actions:**
  - `/lib/actions/initiatives.ts` - checkCanCreateInitiative()

- **API Routes:**
  - `/app/api/initiatives/route.ts` - POST handler with limit enforcement

- **Utilities:**
  - `/lib/utils/subscription-limits.ts` - Limit checking functions
    - `checkInitiativeLimit()`
    - `checkDocumentGenerationLimit()` (future)
    - `checkExportLimit()` (future)

- **Database:**
  - `/supabase/migrations/20251023145601_add_increment_initiatives_count_function.sql` - RPC function

### Testing
- **Unit Tests:** `/lib/utils/__tests__/subscription-limits.test.ts`
- **Integration Tests:** `/app/api/initiatives/__tests__/route.test.ts`
- **Component Tests:** `/components/hierarchy/__tests__/CreateInitiativeButton.test.tsx`

## 8.5 Subscription Upgrade

```
User tries to create 2nd initiative (Trial limit: 1)
→ UI shows disabled button with tooltip
→ User clicks tooltip "Upgrade to Starter"
→ Redirected to upgrade flow
→ API creates Stripe Checkout Session
→ User completes payment
→ Stripe webhook updates Supabase
→ Credits and limits increased
→ User can now create up to 3 initiatives/month
```

## 8.5A Paywall Modal and Upgrade Flow

### Overview
When users hit subscription limits or their trial expires, they see a comprehensive paywall modal with full tier comparison and upgrade options.

### Workflow Steps

```
1. Trigger Event Occurs:
   - Trial expires (auto-shown on dashboard login)
   - User attempts to create initiative beyond limit
   - User attempts to generate non-Brief document
   - User attempts to export document (future)
   ↓
2. Paywall Modal Displayed:
   - Full tier comparison table shown
   - Three paid tiers: Starter ($49/mo), Professional ($149/mo), Enterprise ($499/mo)
   - Feature comparison: Initiatives, AI Credits, Document Types, Export
   - Professional tier highlighted with "Most Popular" badge
   - Responsive layout (grid on desktop, stacked cards on mobile)
   ↓
3. User Selects Plan:
   - Click "Select Plan" button for desired tier
   - Analytics event tracked: trackPlanSelected(tier, trigger_reason)
   - Currently logs to console (Story 3.6 will add Stripe integration)
   ↓
4. Modal Dismissal:
   - If trial active: "Maybe Later" button available
   - If trial expired: Modal cannot be dismissed (canDismiss: false)
   - On dismiss: trackPaywallDismissed(trigger_reason)
```

### Trigger Points

**1. Trial Expiration (Dashboard)**
- Location: `/app/dashboard/page.tsx`
- When: `checkSubscriptionAccess()` returns `isExpired: true`
- Behavior: Modal auto-shows, non-dismissible
- Trigger reason: `trial_expired`

**2. Initiative Limit Reached**
- Location: `/components/hierarchy/CreateInitiativeButton.tsx`
- When: User clicks Create Initiative at limit
- Behavior: Modal shown on click, dismissible if trial active
- Trigger reason: `initiative_limit`

**3. Document Generation Limit** (Future)
- Trigger reason: `document_limit`

**4. Export Limit** (Future)
- Trigger reason: `export_limit`

### Tier Comparison Structure

| Feature | Trial | Starter | Professional | Enterprise |
|---------|-------|---------|--------------|------------|
| **Price** | Free 7 days | $49/mo | $149/mo | $499/mo |
| **Initiatives** | 1 | 3/month | Unlimited | Unlimited |
| **AI Credits** | 0 (Brief only) | 25/month | 100/month | Unlimited |
| **Document Types** | Brief only | All 8 types | All 8 types | All 8 types |
| **Export** | ✗ | ✓ | ✓ | ✓ |
| **Support** | Community | Email | Priority Email | Dedicated |

### Analytics Events

All paywall interactions are tracked for analytics:

```typescript
// When modal is shown
trackPaywallShown(trigger_reason: PaywallTriggerReason): void

// When modal is dismissed (if dismissible)
trackPaywallDismissed(trigger_reason: PaywallTriggerReason): void

// When user selects a plan
trackPlanSelected(tier: SubscriptionTier, trigger_reason: PaywallTriggerReason): void
```

Events include:
- Timestamp (ISO 8601)
- Trigger reason
- Selected tier (for plan selection)

### Component Architecture

**PaywallModal Component:**
- Path: `/components/subscription/PaywallModal.tsx`
- Props: `isOpen`, `onClose`, `trigger_reason`, `canDismiss`, `onSelectPlan`
- Features:
  - Dynamic title/description based on trigger reason
  - Embedded TierComparisonTable
  - Conditional dismiss button
  - Prevents ESC/click-outside when `canDismiss: false`

**TierComparisonTable Component:**
- Path: `/components/subscription/TierComparisonTable.tsx`
- Props: `onSelectPlan`, `highlightTier` (defaults to 'professional')
- Features:
  - Displays Starter, Professional, Enterprise tiers
  - Responsive grid layout (3 columns → 2 columns → stacked)
  - "Most Popular" badge on Professional tier
  - Visual highlighting for recommended tier
  - Touch-friendly buttons (min 44px height)

### Implementation Files

**Created:**
- `/components/subscription/TierComparisonTable.tsx` - Tier comparison component
- `/lib/analytics/paywall-events.ts` - Analytics event tracking
- `/components/subscription/__tests__/PaywallModal.test.tsx` - Unit tests
- `/components/subscription/__tests__/TierComparisonTable.test.tsx` - Unit tests

**Updated:**
- `/components/subscription/PaywallModal.tsx` - Enhanced with full tier comparison
- `/lib/constants/subscription-tiers.ts` - Added pricing fields
- `/components/hierarchy/CreateInitiativeButton.tsx` - Added paywall trigger

### Future Enhancements (Story 3.6)

The `onSelectPlan` callback currently logs to console. Story 3.6 will:
- Replace placeholder with Stripe Checkout redirect
- Navigate to `/api/stripe/create-checkout-session?tier=${tier}`
- Complete payment flow with Stripe

## 8.6 Workflow Timing Summary

| Workflow | Time | Credits | NFR |
|----------|------|---------|-----|
| Document Generation | 15-25s (p95 <30s) | 1 credit | NFR1 |
| Document Revision | 8-15s | 0.5 credits | NFR1 |
| Chat Interaction | <2s | 0 credits | NFR4 |

---
