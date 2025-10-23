import { createAdminClient } from './lib/supabase-admin';

async function checkUsageTracking() {
  const supabase = createAdminClient();

  // Try to query usage_tracking table
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ Error querying usage_tracking:', error.message);
    console.log('Table may not exist or has different name');
  } else {
    console.log('✅ usage_tracking table exists!');
    console.log('Sample data:', data);
  }

  // Also check for the specific user
  const userId = 'user_34QPdXPcsKRLAHwzWCBWNrG8DDq';

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (user) {
    const { data: tracking } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id);

    console.log(`\nUsage tracking for ${userId}:`, tracking);
  }
}

checkUsageTracking();
