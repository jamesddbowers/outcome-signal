# E2E Test Data Management Scripts

Interactive CLI tools for setting up and tearing down test data for manual E2E testing of OutcomeSignal.

## Overview

These scripts help you:
- Create realistic test users with different subscription scenarios
- Set up sample initiatives, documents, and conversations
- Clean up test data after testing is complete
- Test the trial signup flow (Story 3.2) manually

## Prerequisites

- Node.js 18+ and pnpm installed
- Supabase instance running (local or hosted)
- Environment variables configured in `apps/web/.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `CLERK_WEBHOOK_SECRET`
- Clerk account for creating test users manually
- **Important:** User must already exist in Clerk (webhook auto-creates in Supabase)
- **Important:** Wait 2-3 seconds after creating Clerk user for webhook to sync

## Installation

Dependencies are already installed at the workspace root. If needed:

```bash
pnpm install
```

## Usage

### Setup Test Data

Configures test data for an existing Clerk user (webhook auto-syncs user to Supabase):

```bash
pnpm test:setup
```

**Interactive Prompts:**
1. Select test scenario (trial user, paid user, etc.)
2. Enter Clerk user ID (must already exist in Clerk)

**How It Works:**
1. Looks up existing user in Supabase (created by Clerk webhook)
2. Cleans up auto-created trial subscription/usage tracking
3. Creates new subscription/usage tracking based on selected scenario
4. Optionally adds sample initiatives, documents, conversations

**Example:**
```bash
$ pnpm test:setup

🚀 OutcomeSignal Test Data Setup

? Select test scenario:
❯ New Trial User - Fresh trial user with no initiatives (Story 3.2 - AC 1, 2, 4)
  Trial User with Sample Initiative - Trial user with 1 initiative, documents, and agent chat
  Trial User Expiring Soon (1 day) - Trial ending tomorrow - tests warning badge
  ...

? Enter Clerk User ID: user_2abc123xyz

⏳ Setting up test data...

  ✓ Found user: test@example.com (Test User)
  Cleaning up auto-created subscription...
  Cleaning up auto-created usage tracking...
  ✓ Creating subscription...
  ✓ Creating usage tracking record...

✅ Setup complete!

Summary:
  User:          test@example.com (Test User)
  Clerk ID:      user_2abc123xyz
  Supabase ID:   550e8400-e29b-41d4-a716-446655440001
  Subscription:  trial
  Trial Status:  6 days remaining

Next steps:
  1. Sign in at http://localhost:3000/sign-in
  2. Navigate to http://localhost:3000/dashboard
  3. Verify trial badge displays: "Trial: 6 days remaining"
```

### Teardown Test Data

Deletes all data for a selected test user:

```bash
pnpm test:teardown
```

**Interactive Prompts:**
1. Select user to teardown
2. Confirm deletion

**Example:**
```bash
$ pnpm test:teardown

🗑️  OutcomeSignal Test Data Teardown

Fetching users from database...

? Select user to teardown:
❯ test@example.com (trial) - 6 days remaining
  john@example.com (professional)
  [Cancel]

? Confirm deletion of ALL data for test@example.com? Yes

⏳ Deleting all data...

  ✓ Deleting workflow executions...
  ✓ Deleting agent conversations...
  ✓ Deleting documents...
  ✓ Deleting initiatives...
  ✓ Deleting usage tracking...
  ✓ Deleting subscriptions...
  ✓ Deleting user record...

✅ Teardown complete!

Deleted:
  - 1 user
  - 1 subscription(s)
  - 1 usage tracking record(s)
  - 0 initiative(s)
  - 0 document(s)
  - 0 agent conversation(s)
  - 0 workflow execution(s)

⚠️  Remember:
  Delete user from Clerk manually:
    Dashboard: https://dashboard.clerk.com
```

## Test Scenarios

### 1. New Trial User
**Purpose:** Test Story 3.2 - Fresh trial signup flow
**What's created:**
- Uses existing user from Clerk webhook
- Replaces auto-created trial subscription (7 days)
- Replaces auto-created usage tracking (1 initiative limit, 0 credits)

**Expected badge:** "Trial: 6 days remaining" (outline variant)

### 2. Trial User with Sample Initiative
**Purpose:** Test trial user with full data
**What's created:**
- Uses existing user from Clerk webhook
- Trial subscription + usage tracking
- 1 initiative: "AI-Powered Task Management System"
- 3 documents: Brief, PRD, Architecture
- Agent conversation with sample messages

**Use for:** Testing initiative browsing, document viewing, agent chat

### 3. Trial User Expiring Soon (1 day)
**Purpose:** Test warning badge styling (Story 3.2 - AC 4)
**What's created:**
- Uses existing user from Clerk webhook
- Trial subscription ending tomorrow
- Usage tracking

**Expected badge:** "Trial: 1 day remaining" (destructive/warning variant)

### 4. Expired Trial User
**Purpose:** Test expired trial state
**What's created:**
- Uses existing user from Clerk webhook
- Trial subscription ended yesterday (status: expired)
- Usage tracking

**Expected badge:** "Trial expired" (destructive variant)

### 5. Paid User (Professional)
**Purpose:** Test paid subscription state
**What's created:**
- Uses existing user from Clerk webhook
- Professional subscription (replaces trial)
- Sample initiative with documents
- Usage tracking (15/100 credits used)

**Expected badge:** None (only trial users show badge)

## Manual Testing Workflow

### For Story 3.2 (Trial Signup Flow)

1. **Create Clerk User:**
   - Go to Clerk Dashboard: https://dashboard.clerk.com
   - Create test user: trial-fresh@example.com
   - Copy user ID (starts with `user_`)
   - **Wait 2-3 seconds** for webhook to sync to Supabase

2. **Verify Webhook Synced:**
   - Open Supabase dashboard
   - Check `users` table for the clerk_user_id
   - Should see auto-created trial subscription + usage tracking

3. **Run Setup:**
   ```bash
   pnpm test:setup
   # Select: New Trial User
   # Enter Clerk user ID
   ```

4. **Test Dashboard:**
   - Sign in at http://localhost:3000/sign-in
   - Navigate to dashboard
   - Verify trial badge displays: "Trial: 6 days remaining"
   - Verify badge uses outline variant (not red)

5. **Test Supabase Data:**
   - Open Supabase dashboard
   - Verify `subscriptions` table:
     - `tier = 'trial'`
     - `status = 'active'`
     - `trial_ends_at` = 7 days from now
   - Verify `usage_tracking` table:
     - `credits_limit = 0`
     - `initiatives_limit = 1`

6. **Test Warning State:**
   ```bash
   pnpm test:setup
   # Select: Trial User Expiring Soon
   ```
   - Sign in and verify badge shows "Trial: 1 day remaining"
   - Verify badge uses destructive/red styling

7. **Cleanup:**
   ```bash
   pnpm test:teardown
   # Select user to delete
   # Manually delete from Clerk dashboard
   ```

## File Structure

```
scripts/
├── README.md                          # This file
├── test-setup.ts                      # Main setup script
├── test-teardown.ts                   # Main teardown script
├── lib/
│   ├── supabase-admin.ts             # Admin client with service role
│   ├── prompts.ts                    # Interactive CLI prompts
│   └── test-data-templates.ts        # Data generators per scenario
└── docs/
    └── manual-testing-checklist.md   # Detailed testing scenarios
```

## Data Deletion Order

Teardown deletes data in this order to respect foreign key constraints:

1. workflow_executions
2. agent_conversations
3. documents (references initiatives)
4. initiatives
5. usage_tracking
6. subscriptions
7. users

## Troubleshooting

### Environment Variables Not Found
**Error:** `NEXT_PUBLIC_SUPABASE_URL not found`
**Solution:** Ensure `apps/web/.env.local` exists and contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### User Not Found in Supabase
**Error:** `User with Clerk ID "user_..." not found in Supabase`

**Possible causes:**
1. Clerk webhook hasn't fired yet (wait a few seconds and try again)
2. User doesn't exist in Clerk - create user in Clerk Dashboard first
3. Webhook is misconfigured or failing
4. Clerk user ID is incorrect

**Solution:**
- Wait 2-3 seconds after creating Clerk user for webhook to sync
- Check Clerk Dashboard > Webhooks > Recent Deliveries for webhook status
- Verify user exists in Supabase `users` table
- Ensure `CLERK_WEBHOOK_SECRET` is configured correctly in `apps/web/.env.local`

### Cannot Delete User from Clerk
**Note:** These scripts only manage Supabase data. You must manually delete users from the Clerk dashboard at https://dashboard.clerk.com

### RLS Policy Errors
**Error:** `new row violates row-level security policy`
**Solution:** These scripts use the service role key which bypasses RLS. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly (not the anon key).

## Best Practices

1. **Always teardown after testing** - Prevents database clutter
2. **Use descriptive emails** - Makes it easy to identify test users (e.g., `trial-test-1@example.com`)
3. **Test multiple scenarios** - Don't just test the happy path
4. **Verify in Supabase dashboard** - Check actual database state, not just UI
5. **Delete from Clerk** - Remember to clean up Clerk users manually

## See Also

- [Manual Testing Checklist](./docs/manual-testing-checklist.md) - Detailed testing scenarios
- [Story 3.2](../docs/stories/3.2.story.md) - Trial signup flow requirements
- [Subscription Data Model](../docs/stories/3.1.story.md) - Database schema details
