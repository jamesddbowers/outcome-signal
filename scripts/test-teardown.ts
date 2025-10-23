#!/usr/bin/env tsx
/**
 * Test Data Teardown Script
 *
 * Interactive CLI tool to tear down test data after manual E2E testing.
 * Deletes all user-related data in correct cascade order.
 *
 * Usage: pnpm test:teardown
 */

import chalk from 'chalk';
import { createAdminClient } from './lib/supabase-admin';
import { promptUserForTeardown, promptConfirmDeletion, type UserSummary } from './lib/prompts';

interface TeardownResult {
  workflowExecutions: number;
  agentConversations: number;
  documents: number;
  initiatives: number;
  usageTracking: number;
  subscriptions: number;
  users: number;
}

/**
 * Fetches all users from database for selection
 */
async function fetchUsers(): Promise<UserSummary[]> {
  const supabase = createAdminClient();

  const { data: usersWithSubscriptions, error } = await supabase
    .from('users')
    .select(`
      id,
      clerk_user_id,
      email,
      subscriptions (
        tier,
        status,
        trial_ends_at
      )
    `);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return (usersWithSubscriptions || []).map((user: any) => {
    const subscription = user.subscriptions?.[0];
    let daysRemaining: number | null = null;

    if (subscription?.tier === 'trial' && subscription.trial_ends_at) {
      const now = new Date();
      const trialEnd = new Date(subscription.trial_ends_at);
      const diffMs = trialEnd.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    return {
      userId: user.id,
      clerkUserId: user.clerk_user_id,
      email: user.email,
      tier: subscription?.tier || 'none',
      status: subscription?.status || 'none',
      daysRemaining,
    };
  });
}

/**
 * Deletes all data for a specific user
 */
async function teardownUser(userId: string): Promise<TeardownResult> {
  const supabase = createAdminClient();
  const result: TeardownResult = {
    workflowExecutions: 0,
    agentConversations: 0,
    documents: 0,
    initiatives: 0,
    usageTracking: 0,
    subscriptions: 0,
    users: 0,
  };

  // Step 1: Delete workflow executions
  console.log(chalk.gray('  ✓ Deleting workflow executions...'));
  const { error: workflowError, count: workflowCount } = await supabase
    .from('workflow_executions')
    .delete()
    .eq('user_id', userId)
    .select('*', { count: 'exact', head: true });

  if (workflowError) {
    throw new Error(`Failed to delete workflow executions: ${workflowError.message}`);
  }
  result.workflowExecutions = workflowCount || 0;

  // Step 2: Delete agent conversations
  console.log(chalk.gray('  ✓ Deleting agent conversations...'));
  const { error: conversationsError, count: conversationsCount } = await supabase
    .from('agent_conversations')
    .delete()
    .eq('user_id', userId)
    .select('*', { count: 'exact', head: true });

  if (conversationsError) {
    throw new Error(`Failed to delete agent conversations: ${conversationsError.message}`);
  }
  result.agentConversations = conversationsCount || 0;

  // Step 3: Get initiative IDs for this user
  const { data: initiatives, error: initiativesQueryError } = await supabase
    .from('initiatives')
    .select('id')
    .eq('user_id', userId);

  if (initiativesQueryError) {
    throw new Error(`Failed to query initiatives: ${initiativesQueryError.message}`);
  }

  const initiativeIds = (initiatives || []).map((i: any) => i.id);

  // Step 4: Delete documents (cascades from initiatives)
  if (initiativeIds.length > 0) {
    console.log(chalk.gray('  ✓ Deleting documents...'));
    const { error: documentsError, count: documentsCount } = await supabase
      .from('documents')
      .delete()
      .in('initiative_id', initiativeIds)
      .select('*', { count: 'exact', head: true });

    if (documentsError) {
      throw new Error(`Failed to delete documents: ${documentsError.message}`);
    }
    result.documents = documentsCount || 0;
  }

  // Step 5: Delete initiatives
  console.log(chalk.gray('  ✓ Deleting initiatives...'));
  const { error: initiativesError, count: initiativesCount } = await supabase
    .from('initiatives')
    .delete()
    .eq('user_id', userId)
    .select('*', { count: 'exact', head: true });

  if (initiativesError) {
    throw new Error(`Failed to delete initiatives: ${initiativesError.message}`);
  }
  result.initiatives = initiativesCount || 0;

  // Step 6: Delete usage tracking
  console.log(chalk.gray('  ✓ Deleting usage tracking...'));
  const { error: usageError, count: usageCount } = await supabase
    .from('usage_tracking')
    .delete()
    .eq('user_id', userId)
    .select('*', { count: 'exact', head: true });

  if (usageError) {
    throw new Error(`Failed to delete usage tracking: ${usageError.message}`);
  }
  result.usageTracking = usageCount || 0;

  // Step 7: Delete subscriptions
  console.log(chalk.gray('  ✓ Deleting subscriptions...'));
  const { error: subscriptionsError, count: subscriptionsCount } = await supabase
    .from('subscriptions')
    .delete()
    .eq('user_id', userId)
    .select('*', { count: 'exact', head: true });

  if (subscriptionsError) {
    throw new Error(`Failed to delete subscriptions: ${subscriptionsError.message}`);
  }
  result.subscriptions = subscriptionsCount || 0;

  // Step 8: Delete user record
  console.log(chalk.gray('  ✓ Deleting user record...'));
  const { error: userError, count: userCount } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)
    .select('*', { count: 'exact', head: true });

  if (userError) {
    throw new Error(`Failed to delete user: ${userError.message}`);
  }
  result.users = userCount || 0;

  return result;
}

async function teardownTestData(): Promise<void> {
  console.log(chalk.bold.cyan('\n🗑️  OutcomeSignal Test Data Teardown\n'));

  try {
    // Fetch all users
    console.log(chalk.yellow('Fetching users from database...\n'));
    const users = await fetchUsers();

    // Prompt for user selection
    const selectedUserId = await promptUserForTeardown(users);

    if (!selectedUserId) {
      console.log(chalk.gray('\nTeardown cancelled.\n'));
      process.exit(0);
    }

    // Find selected user details
    const selectedUser = users.find((u) => u.userId === selectedUserId);
    if (!selectedUser) {
      throw new Error('Selected user not found');
    }

    // Confirm deletion
    const confirmed = await promptConfirmDeletion(selectedUser.email);

    if (!confirmed) {
      console.log(chalk.gray('\nTeardown cancelled.\n'));
      process.exit(0);
    }

    // Perform teardown
    console.log(chalk.yellow('\n⏳ Deleting all data...\n'));
    const result = await teardownUser(selectedUserId);

    // Display summary
    console.log(chalk.bold.green('\n✅ Teardown complete!\n'));
    console.log(chalk.bold('Deleted:'));
    console.log(chalk.gray(`  - ${result.users} user`));
    console.log(chalk.gray(`  - ${result.subscriptions} subscription(s)`));
    console.log(chalk.gray(`  - ${result.usageTracking} usage tracking record(s)`));
    console.log(chalk.gray(`  - ${result.initiatives} initiative(s)`));
    console.log(chalk.gray(`  - ${result.documents} document(s)`));
    console.log(chalk.gray(`  - ${result.agentConversations} agent conversation(s)`));
    console.log(chalk.gray(`  - ${result.workflowExecutions} workflow execution(s)`));

    console.log(chalk.bold.yellow('\n⚠️  Remember:'));
    console.log(chalk.yellow('  Delete user from Clerk manually:'));
    console.log(chalk.cyan('    Dashboard: https://dashboard.clerk.com\n'));
  } catch (error) {
    console.error(chalk.bold.red('\n❌ Teardown failed:\n'));
    if (error instanceof Error) {
      console.error(chalk.red(`  ${error.message}\n`));
    } else {
      console.error(chalk.red(`  ${String(error)}\n`));
    }
    process.exit(1);
  }
}

// Run the teardown
teardownTestData();
