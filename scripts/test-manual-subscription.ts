import { createAdminClient } from './lib/supabase-admin';

async function testSubscriptionCreation() {
  const userId = 'e7e1ac01-08fa-4ff9-9a6c-f8a9d99b7cca'; // From check-user output
  const supabase = createAdminClient();

  // Check if subscription exists
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    console.log('Subscription already exists:', existing);
    return;
  }

  // Create subscription
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: newSub, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      tier: 'trial',
      status: 'active',
      trial_ends_at: trialEndsAt.toISOString(),
      current_period_start: now.toISOString(),
      current_period_end: trialEndsAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription:', error);
  } else {
    console.log('✅ Subscription created:', newSub);
  }
}

testSubscriptionCreation();
