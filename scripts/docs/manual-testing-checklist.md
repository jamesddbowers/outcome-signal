# Manual E2E Testing Checklist

Comprehensive checklist for manually testing OutcomeSignal features using the test data setup scripts.

## Story 3.2: Trial Signup Flow

### Prerequisites
- [ ] Supabase instance running and accessible
- [ ] `apps/web/.env.local` configured with Supabase credentials
- [ ] Clerk account accessible
- [ ] Clerk webhook configured and working (auto-syncs users to Supabase)
- [ ] Local dev server running: `pnpm dev`

---

## Scenario A: New Trial User (Fresh Signup)

**Purpose:** Verify automatic trial provisioning on new user signup

### Setup

**Step 1: Create Clerk User**
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Create test user with email: `trial-fresh@example.com`
3. Copy the Clerk user ID (starts with `user_`)
4. **Wait 2-3 seconds** for webhook to sync user to Supabase

**Step 2: Verify Webhook Synced**
1. Open Supabase dashboard
2. Check `users` table for the `clerk_user_id`
3. Should see auto-created trial subscription in `subscriptions` table
4. Should see auto-created usage tracking in `usage_tracking` table

**Step 3: Run Setup Script**
```bash
pnpm test:setup
# Select: "New Trial User - Fresh trial user with no initiatives"
# Enter Clerk user ID (from Step 1)
```

**What the script does:**
- Looks up existing user (created by webhook)
- Cleans up auto-created subscription/usage tracking
- Creates new subscription/usage tracking based on scenario

### Test Steps

#### 1. Verify Database State (Supabase Dashboard)

**Users Table:**
- [ ] User record exists with correct `clerk_user_id`
- [ ] Email matches what you entered
- [ ] `created_at` is recent timestamp

**Subscriptions Table:**
- [ ] Subscription record exists for user
- [ ] `tier = 'trial'`
- [ ] `status = 'active'`
- [ ] `trial_ends_at` is ~7 days from now (verify timestamp)
- [ ] `current_period_start` is today's date
- [ ] `current_period_end` equals `trial_ends_at`
- [ ] `stripe_subscription_id` is NULL
- [ ] `stripe_customer_id` is NULL

**Usage Tracking Table:**
- [ ] Record exists for user
- [ ] `month` format is 'YYYY-MM' (current month)
- [ ] `credits_used = 0`
- [ ] `credits_limit = 0`
- [ ] `initiatives_count = 0`
- [ ] `initiatives_limit = 1`

#### 2. Verify Dashboard UI

**Navigation:**
- [ ] Sign in at http://localhost:3000/sign-in
- [ ] Clerk authentication succeeds
- [ ] Redirect to dashboard after login

**Trial Badge:**
- [ ] Badge appears in dashboard header (top-right area)
- [ ] Badge text shows "Trial: 6 days remaining" (or 7, depending on timing)
- [ ] Badge uses `outline` variant (not red/destructive)
- [ ] Badge is visible on all dashboard pages

**Dashboard State:**
- [ ] No initiatives shown (empty state)
- [ ] User can navigate freely
- [ ] No errors in browser console

#### 3. Test Idempotency (Optional)

**Webhook Simulation:**
- [ ] Trigger duplicate user.created webhook (via Clerk dashboard or API)
- [ ] No duplicate subscription created
- [ ] No duplicate usage_tracking created
- [ ] No errors logged
- [ ] Dashboard still works correctly

### Cleanup
```bash
pnpm test:teardown
# Select: trial-fresh@example.com
# Confirm deletion
# Manually delete user from Clerk dashboard
```

---

## Scenario B: Trial User with Sample Initiative

**Purpose:** Test trial user with full application data

### Setup

**Step 1: Create Clerk User**
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Create test user with email: `trial-with-data@example.com`
3. Copy the Clerk user ID (starts with `user_`)
4. **Wait 2-3 seconds** for webhook to sync user to Supabase

**Step 2: Run Setup Script**
```bash
pnpm test:setup
# Select: "Trial User with Sample Initiative"
# Enter Clerk user ID (from Step 1)
```

### Test Steps

#### 1. Verify Database State

**All checks from Scenario A, plus:**

**Initiatives Table:**
- [ ] 1 initiative exists for user
- [ ] Title: "AI-Powered Task Management System"
- [ ] `status = 'active'`
- [ ] `phase = 'development'`
- [ ] `phase_progress = 35`

**Documents Table:**
- [ ] 3 documents exist for initiative
- [ ] Document types: `brief`, `prd`, `architecture`
- [ ] All documents have `generated_by_agent = 'claude-agent'`
- [ ] Content is populated (not empty)

**Agent Conversations Table:**
- [ ] 1 conversation exists for initiative
- [ ] `messages` JSONB contains array of message objects
- [ ] Messages have correct structure (id, role, content, timestamp)

#### 2. Verify Dashboard UI

**Initiative List:**
- [ ] 1 initiative displayed in hierarchy panel
- [ ] Initiative title shows correctly
- [ ] Phase indicator shows "Development" with 35% progress
- [ ] Can expand/collapse initiative

**Document Viewing:**
- [ ] Can click on Brief document
- [ ] Document content displays in preview panel
- [ ] TipTap editor renders markdown correctly
- [ ] Can switch between documents (Brief → PRD → Architecture)

**Agent Chat:**
- [ ] Agent conversation panel shows on right
- [ ] Sample messages displayed correctly
- [ ] Message history is readable
- [ ] Can scroll through conversation

**Trial Badge:**
- [ ] Still displays "Trial: 6 days remaining"
- [ ] Badge remains visible on all pages

### Cleanup
```bash
pnpm test:teardown
# Select: trial-with-data@example.com
```

---

## Scenario C: Trial User Expiring Soon (1 Day Remaining)

**Purpose:** Verify warning badge styling when trial is about to expire

### Setup

**Step 1: Create Clerk User**
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Create test user with email: `trial-expiring@example.com`
3. Copy the Clerk user ID (starts with `user_`)
4. **Wait 2-3 seconds** for webhook to sync user to Supabase

**Step 2: Run Setup Script**
```bash
pnpm test:setup
# Select: "Trial User Expiring Soon (1 day)"
# Enter Clerk user ID (from Step 1)
```

### Test Steps

#### 1. Verify Database State

**Subscriptions Table:**
- [ ] `trial_ends_at` is tomorrow's date (~24 hours from now)
- [ ] `current_period_start` is 6 days ago
- [ ] `current_period_end` equals `trial_ends_at`
- [ ] `status = 'active'` (not expired yet)

#### 2. Verify Dashboard UI

**Trial Badge - WARNING STATE:**
- [ ] Badge displays "Trial: 1 day remaining"
- [ ] Badge uses `destructive` variant (red/warning color)
- [ ] Badge background is red or orange (not gray)
- [ ] Badge is prominently visible
- [ ] Text is legible against background

**Functionality:**
- [ ] User can still create initiatives (within limit)
- [ ] User can navigate all pages
- [ ] No blocking modals or warnings

### Cleanup
```bash
pnpm test:teardown
# Select: trial-expiring@example.com
```

---

## Scenario D: Expired Trial User

**Purpose:** Verify expired trial badge and potential access restrictions

### Setup

**Step 1: Create Clerk User**
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Create test user with email: `trial-expired@example.com`
3. Copy the Clerk user ID (starts with `user_`)
4. **Wait 2-3 seconds** for webhook to sync user to Supabase

**Step 2: Run Setup Script**
```bash
pnpm test:setup
# Select: "Expired Trial User"
# Enter Clerk user ID (from Step 1)
```

### Test Steps

#### 1. Verify Database State

**Subscriptions Table:**
- [ ] `trial_ends_at` is yesterday's date (in the past)
- [ ] `status = 'expired'`
- [ ] `current_period_end` is in the past

#### 2. Verify Dashboard UI

**Trial Badge - EXPIRED STATE:**
- [ ] Badge displays "Trial expired"
- [ ] Badge uses `destructive` variant (red)
- [ ] Badge is prominently visible

**Access Restrictions (Future Story):**
- [ ] Note: Access restrictions not yet implemented
- [ ] User can still navigate (for now)
- [ ] No upgrade prompts yet (future story)

### Cleanup
```bash
pnpm test:teardown
# Select: trial-expired@example.com
```

---

## Scenario E: Paid User (Professional Tier)

**Purpose:** Verify paid users don't see trial badge

### Setup

**Step 1: Create Clerk User**
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Create test user with email: `paid-pro@example.com`
3. Copy the Clerk user ID (starts with `user_`)
4. **Wait 2-3 seconds** for webhook to sync user to Supabase

**Step 2: Run Setup Script**
```bash
pnpm test:setup
# Select: "Paid User (Professional)"
# Enter Clerk user ID (from Step 1)
```

### Test Steps

#### 1. Verify Database State

**Subscriptions Table:**
- [ ] `tier = 'professional'`
- [ ] `status = 'active'`
- [ ] `trial_ends_at` is NULL
- [ ] `stripe_subscription_id` is set (mock value)
- [ ] `stripe_customer_id` is set (mock value)
- [ ] `current_period_end` is ~30 days from now

**Usage Tracking Table:**
- [ ] `credits_limit = 100`
- [ ] `credits_used = 15` (sample data)
- [ ] `initiatives_limit = -1` (unlimited)
- [ ] `initiatives_count = 1`

#### 2. Verify Dashboard UI

**No Trial Badge:**
- [ ] Trial badge does NOT appear in header
- [ ] Header area shows other elements normally
- [ ] No "trial" messaging anywhere

**Full Access:**
- [ ] User can create initiatives
- [ ] User has access to all document types
- [ ] Sample initiative and documents are visible

### Cleanup
```bash
pnpm test:teardown
# Select: paid-pro@example.com
```

---

## Cross-Scenario Tests

### Responsive Design
Test each scenario on multiple viewports:
- [ ] Desktop (1440px): Trial badge in header, all columns visible
- [ ] Tablet (768px): Trial badge in collapsed state, drawer navigation
- [ ] Mobile (375px): Trial badge in mobile header, tab navigation

### Browser Compatibility
Test on multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on macOS)

### Performance
- [ ] Dashboard loads in <2 seconds with sample data
- [ ] Badge displays immediately on page load
- [ ] No layout shift when badge renders

---

## Regression Tests

After completing Story 3.2, verify these existing features still work:

### Authentication (Story 1.3, 1.5)
- [ ] Clerk sign-up flow works
- [ ] Clerk sign-in flow works
- [ ] User sync to Supabase works
- [ ] Protected routes redirect to sign-in

### Dashboard Layout (Story 1.7, 2.1)
- [ ] Three-column workspace renders
- [ ] Left panel shows hierarchy
- [ ] Middle panel shows document preview
- [ ] Right panel shows agent chat

### Responsive Design (Story 2.6)
- [ ] Mobile tabs work
- [ ] Tablet drawer works
- [ ] Desktop columns work

### Phase Indicator (Story 2.5)
- [ ] Phase indicator displays in header
- [ ] Progress percentage shows correctly
- [ ] Phase changes update indicator

---

## Bug Reporting Template

If you find issues during testing, report using this template:

```markdown
**Scenario:** [Scenario name]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Steps to Reproduce:**
1.
2.
3.

**Screenshots:** [If applicable]
**Browser:** [Chrome 120, Firefox 121, etc.]
**Console Errors:** [Any errors in browser console]
```

---

## Notes

- **Timing Variance:** "6 days remaining" might show as "7 days" depending on when you run the test within the day
- **Clerk Cleanup:** Remember to delete test users from Clerk dashboard manually
- **Database State:** Use Supabase dashboard to verify actual data, not just UI
- **RLS Policies:** Scripts use service role key, but manual testing uses anon key (tests RLS)

---

## Success Criteria

Story 3.2 is complete when:
- [ ] All Scenario A-E tests pass
- [ ] Trial badge displays correctly for all trial states
- [ ] Paid users don't see trial badge
- [ ] No regressions in existing features
- [ ] Database migrations apply cleanly
- [ ] All automated tests pass (29 tests in Story 3.2)
