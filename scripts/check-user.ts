import { createAdminClient } from './lib/supabase-admin';

async function checkUser() {
  const clerkUserId = 'user_34QMenlXqxXD0RXJnI0PDWaQsgz';
  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  console.log('User:', user);

  if (user) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    console.log('Subscriptions:', sub);
  }
}

checkUser();
