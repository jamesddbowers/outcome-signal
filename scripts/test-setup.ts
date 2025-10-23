#!/usr/bin/env tsx
/**
 * Test Data Setup Script
 *
 * Interactive CLI tool to set up test data for manual E2E testing.
 * Looks up existing user (created by Clerk webhook), then sets up
 * subscription, initiatives, and documents based on selected scenario.
 *
 * Usage: pnpm test:setup
 */

import chalk from 'chalk';
import { createAdminClient } from './lib/supabase-admin';
import { promptScenario, promptClerkUserId } from './lib/prompts';
import {
  SCENARIOS,
  generateSubscription,
  generateUsageTracking,
  generateInitiative,
  generateDocuments,
  generateConversation,
} from './lib/test-data-templates';
import type { TestScenario } from './lib/test-data-templates';

interface SetupResult {
  userId: string;
  clerkUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  subscriptionId: string;
  tier: string;
  daysRemaining: number | null;
  initiativeId?: string;
  documentsCount: number;
  conversationId?: string;
}

async function setupTestData(): Promise<void> {
  console.log(chalk.bold.cyan('\n🚀 OutcomeSignal Test Data Setup\n'));

  try {
    // Prompt for scenario
    const scenario = await promptScenario();
    const scenarioConfig = SCENARIOS[scenario];

    console.log(chalk.gray(`\nSelected: ${scenarioConfig.name}`));
    console.log(chalk.gray(`${scenarioConfig.description}\n`));

    // Prompt for Clerk user ID
    const clerkUserId = await promptClerkUserId();

    console.log(chalk.yellow('\n⏳ Setting up test data...\n'));

    // Create Supabase admin client
    const supabase = createAdminClient();

    // Step 1: Lookup existing user (created by Clerk webhook)
    console.log(chalk.gray('  Looking up user in Supabase...'));
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (userError || !user) {
      throw new Error(
        `User with Clerk ID "${clerkUserId}" not found in Supabase.\n\n` +
          `Possible causes:\n` +
          `  1. Clerk webhook hasn't fired yet (wait a few seconds and try again)\n` +
          `  2. User doesn't exist in Clerk - create user in Clerk Dashboard first\n` +
          `  3. Webhook is misconfigured or failing\n` +
          `  4. Clerk user ID is incorrect\n\n` +
          `To troubleshoot:\n` +
          `  - Check Clerk Dashboard > Webhooks > Recent Deliveries\n` +
          `  - Verify user exists in Supabase users table\n` +
          `  - Ensure CLERK_WEBHOOK_SECRET is configured correctly`
      );
    }

    console.log(
      chalk.green(
        `  ✓ Found user: ${user.email} (${user.first_name || 'No first name'} ${user.last_name || 'No last name'})`
      )
    );

    const result: SetupResult = {
      userId: user.id,
      clerkUserId: user.clerk_user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      subscriptionId: '',
      tier: '',
      daysRemaining: null,
      documentsCount: 0,
    };

    // Step 2: Clean up auto-created subscription (from webhook)
    console.log(chalk.gray('  Cleaning up auto-created subscription...'));
    await supabase.from('subscriptions').delete().eq('user_id', user.id);

    // Step 3: Clean up auto-created usage tracking (from webhook)
    console.log(chalk.gray('  Cleaning up auto-created usage tracking...'));
    await supabase.from('usage_tracking').delete().eq('user_id', user.id);

    // Step 4: Check for existing initiatives (warn user)
    const { data: existingInitiatives } = await supabase
      .from('initiatives')
      .select('id')
      .eq('user_id', user.id);

    if (existingInitiatives && existingInitiatives.length > 0) {
      console.log(
        chalk.yellow(
          `  ⚠️  User has ${existingInitiatives.length} existing initiative(s). ` +
            `These will NOT be deleted.`
        )
      );
    }

    // Step 5: Create subscription based on scenario
    console.log(chalk.gray('  ✓ Creating subscription...'));
    const subscriptionData = generateSubscription(user.id, scenario);
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (subscriptionError) {
      throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
    }

    result.subscriptionId = subscription.id;
    result.tier = subscription.tier;

    // Calculate days remaining for trial
    if (subscription.tier === 'trial' && subscription.trial_ends_at) {
      const now = new Date();
      const trialEnd = new Date(subscription.trial_ends_at);
      const diffMs = trialEnd.getTime() - now.getTime();
      result.daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    // Step 6: Create usage tracking
    console.log(chalk.gray('  ✓ Creating usage tracking record...'));
    const usageData = generateUsageTracking(user.id, scenario);
    const { error: usageError } = await supabase.from('usage_tracking').insert(usageData);

    if (usageError) {
      throw new Error(`Failed to create usage tracking: ${usageError.message}`);
    }

    // Step 7: Create initiative (if configured)
    if (scenarioConfig.includeInitiative) {
      console.log(chalk.gray('  ✓ Creating sample initiative...'));
      const initiativeData = generateInitiative(user.id);
      const { data: initiative, error: initiativeError } = await supabase
        .from('initiatives')
        .insert(initiativeData)
        .select()
        .single();

      if (initiativeError) {
        throw new Error(`Failed to create initiative: ${initiativeError.message}`);
      }

      result.initiativeId = initiative.id;

      // Step 8: Create documents (if configured)
      if (scenarioConfig.includeDocuments) {
        console.log(chalk.gray('  ✓ Creating documents (brief, PRD, architecture)...'));
        const documentsData = generateDocuments(initiative.id);
        const { error: documentsError } = await supabase.from('documents').insert(documentsData);

        if (documentsError) {
          throw new Error(`Failed to create documents: ${documentsError.message}`);
        }

        result.documentsCount = documentsData.length;
      }

      // Step 9: Create agent conversation (if configured)
      if (scenarioConfig.includeConversation) {
        console.log(chalk.gray('  ✓ Creating agent conversation...'));
        const conversationData = generateConversation(initiative.id, user.id);
        const { data: conversation, error: conversationError } = await supabase
          .from('agent_conversations')
          .insert(conversationData)
          .select()
          .single();

        if (conversationError) {
          throw new Error(`Failed to create conversation: ${conversationError.message}`);
        }

        result.conversationId = conversation.id;
      }
    }

    // Display summary
    console.log(chalk.bold.green('\n✅ Setup complete!\n'));
    console.log(chalk.bold('Summary:'));
    const userName = [result.firstName, result.lastName].filter(Boolean).join(' ') || 'No name';
    console.log(chalk.gray(`  User:          ${result.email} (${userName})`));
    console.log(chalk.gray(`  Clerk ID:      ${result.clerkUserId}`));
    console.log(chalk.gray(`  Supabase ID:   ${result.userId}`));
    console.log(chalk.gray(`  Subscription:  ${result.tier}`));

    if (result.tier === 'trial' && result.daysRemaining !== null) {
      if (result.daysRemaining > 0) {
        console.log(chalk.gray(`  Trial Status:  ${result.daysRemaining} days remaining`));
      } else {
        console.log(chalk.gray(`  Trial Status:  Expired`));
      }
    }

    if (result.initiativeId) {
      console.log(chalk.gray(`  Initiatives:   1`));
      console.log(chalk.gray(`  Documents:     ${result.documentsCount}`));
    }

    console.log(chalk.bold('\nNext steps:'));
    console.log(chalk.cyan('  1. Sign in at http://localhost:3000/sign-in'));
    console.log(chalk.cyan('  2. Navigate to http://localhost:3000/dashboard'));

    if (result.tier === 'trial') {
      const expectedBadge =
        result.daysRemaining !== null && result.daysRemaining > 0
          ? `"Trial: ${result.daysRemaining} days remaining"`
          : '"Trial expired"';
      console.log(chalk.cyan(`  3. Verify trial badge displays: ${expectedBadge}`));
    }

    console.log('');
  } catch (error) {
    console.error(chalk.bold.red('\n❌ Setup failed:\n'));
    if (error instanceof Error) {
      console.error(chalk.red(`  ${error.message}\n`));
    } else {
      console.error(chalk.red(`  ${String(error)}\n`));
    }
    process.exit(1);
  }
}

// Run the setup
setupTestData();
