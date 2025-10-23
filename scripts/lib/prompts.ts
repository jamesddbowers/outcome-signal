/**
 * CLI Prompts
 *
 * Interactive prompts for test data setup and teardown scripts.
 */

import { select, input, confirm } from '@inquirer/prompts';
import type { TestScenario } from './test-data-templates';
import { SCENARIOS } from './test-data-templates';

/**
 * Prompts user to select a test scenario
 */
export async function promptScenario(): Promise<TestScenario> {
  const scenarioChoices = Object.entries(SCENARIOS).map(([key, config]) => ({
    name: `${config.name} - ${config.description}`,
    value: key as TestScenario,
    description: config.description,
  }));

  return await select<TestScenario>({
    message: 'Select test scenario:',
    choices: scenarioChoices,
  });
}

/**
 * Prompts user to enter Clerk user ID
 */
export async function promptClerkUserId(): Promise<string> {
  return await input({
    message: 'Enter Clerk User ID:',
    validate: (value: string): boolean | string => {
      if (!value || value.trim().length === 0) {
        return 'Clerk User ID is required';
      }
      if (!value.startsWith('user_')) {
        return 'Clerk User ID should start with "user_"';
      }
      return true;
    },
  });
}

export interface UserSummary {
  userId: string;
  clerkUserId: string;
  email: string;
  tier: string;
  status: string;
  daysRemaining: number | null;
}

/**
 * Prompts user to select a user for teardown
 */
export async function promptUserForTeardown(users: UserSummary[]): Promise<string | null> {
  if (users.length === 0) {
    console.log('\nNo test users found in database.');
    return null;
  }

  const userChoices = users.map((user) => {
    let displayText = `${user.email} (${user.tier})`;
    if (user.tier === 'trial' && user.daysRemaining !== null) {
      if (user.daysRemaining > 0) {
        displayText += ` - ${user.daysRemaining} days remaining`;
      } else {
        displayText += ` - Expired`;
      }
    }
    return {
      name: displayText,
      value: user.userId,
      description: `Clerk ID: ${user.clerkUserId}`,
    };
  });

  userChoices.push({
    name: '[Cancel]',
    value: 'cancel',
    description: 'Exit without deleting',
  });

  const selected = await select({
    message: 'Select user to teardown:',
    choices: userChoices,
  });

  return selected === 'cancel' ? null : selected;
}

/**
 * Prompts user to confirm deletion
 */
export async function promptConfirmDeletion(email: string): Promise<boolean> {
  return await confirm({
    message: `Confirm deletion of ALL data for ${email}?`,
    default: false,
  });
}
