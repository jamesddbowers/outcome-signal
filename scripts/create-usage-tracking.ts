import { createAdminClient } from './lib/supabase-admin';

async function createUsageTracking() {
  const clerkUserId = 'user_34QPdXPcsKRLAHwzWCBWNrG8DDq';
  const supabase = createAdminClient();

  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log(`Found user ID: ${user.id}`);

  // Check if usage tracking already exists
  const { data: existing } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (existing) {
    console.log('✅ Usage tracking already exists:', existing);
    return;
  }

  // Create usage tracking
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { data: tracking, error } = await supabase
    .from('usage_tracking')
    .insert({
      user_id: user.id,
      month: currentMonth,
      credits_used: 0,
      credits_limit: 0,      // Trial tier: no AI credits
      initiatives_count: 0,
      initiatives_limit: 1,  // Trial tier: 1 initiative
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating usage tracking:', error);
  } else {
    console.log('✅ Usage tracking created:', tracking);
  }
}

createUsageTracking();
