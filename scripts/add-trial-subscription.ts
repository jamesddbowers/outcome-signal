/**
 * Quick script to add trial subscription for a specific user
 */

import { createAdminClient } from './lib/supabase-admin';

async function addTrialSubscription() {
  const clerkUserId = 'user_34QDtahTbQTokIX0JuMSvwEh2TI';

  const supabase = createAdminClient();

  // Get user by Clerk ID
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (userError || !user) {
    console.error('User not found:', userError);
    process.exit(1);
  }

  console.log(`Found user: ${user.email} (${user.id})`);

  // Check if subscription already exists
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (existingSub) {
    console.log('Subscription already exists!');
    console.log(existingSub);
    process.exit(0);
  }

  // Create trial subscription
  const trialLimits = { initiativesLimit: 1, creditsLimit: 0 }; // Trial tier limits
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: user.id,
      tier: 'trial',
      status: 'active',
      trial_ends_at: trialEndsAt.toISOString(),
      current_period_start: now.toISOString(),
      current_period_end: trialEndsAt.toISOString(),
      stripe_subscription_id: null,
      stripe_customer_id: null,
    })
    .select()
    .single();

  if (subError) {
    console.error('Error creating subscription:', subError);
    process.exit(1);
  }

  console.log('✅ Trial subscription created!');
  console.log(subscription);

  // Create usage tracking
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { error: usageError } = await supabase
    .from('usage_tracking')
    .insert({
      user_id: user.id,
      month: currentMonth,
      credits_used: 0,
      credits_limit: trialLimits.creditsLimit,
      initiatives_count: 0,
      initiatives_limit: trialLimits.initiativesLimit,
    });

  if (usageError) {
    console.error('Error creating usage tracking:', usageError);
    process.exit(1);
  }

  console.log('✅ Usage tracking created!');
  console.log('Trial expires:', trialEndsAt.toISOString());
}

addTrialSubscription().catch(console.error);
