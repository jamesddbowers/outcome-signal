import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// TypeScript types for Clerk webhook events
interface ClerkUserCreatedEvent {
  type: 'user.created';
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    created_at: number;
  };
}

interface ClerkWebhookEvent {
  type: string;
  data: unknown;
}

export async function POST(request: Request): Promise<Response> {
  // Extract webhook signature headers
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // Check for required headers
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('Missing required svix headers');
    return new Response('Missing required webhook headers', { status: 400 });
  }

  // Read raw request body for signature verification
  const body = await request.text();

  // Verify webhook signature
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  let event: ClerkWebhookEvent;

  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new Response('Invalid webhook signature', { status: 401 });
  }

  // Only process user.created events
  if (event.type !== 'user.created') {
    return new Response('Event type not supported', { status: 200 });
  }

  // Type guard and validate user.created event data
  const userCreatedEvent = event as ClerkUserCreatedEvent;
  const { id, email_addresses, first_name, last_name, image_url } = userCreatedEvent.data;

  // Validate required fields
  if (!id) {
    console.error('Missing Clerk user ID in webhook payload');
    return new Response('Invalid webhook payload: missing user ID', { status: 400 });
  }

  if (!email_addresses || email_addresses.length === 0) {
    console.error('Missing email addresses in webhook payload');
    return new Response('Invalid webhook payload: missing email address', { status: 400 });
  }

  const primaryEmail = email_addresses[0].email_address;
  if (!primaryEmail) {
    console.error('Primary email address is empty');
    return new Response('Invalid webhook payload: empty email address', { status: 400 });
  }

  // Create Supabase admin client (bypasses RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Prepare user data for insertion
  const userData = {
    clerk_user_id: id,
    email: primaryEmail,
    first_name: first_name || null,
    last_name: last_name || null,
    avatar_url: image_url || null,
  };

  try {
    // Attempt to insert user record
    const { data: insertedUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (insertError) {
      // Handle duplicate user (unique constraint violation)
      if (insertError.code === '23505') {
        console.log(`Duplicate user detected for clerk_user_id: ${id}`);

        // Query existing user record
        const { data: existingUser, error: queryError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('clerk_user_id', id)
          .single();

        if (queryError) {
          console.error('Error querying existing user:', queryError);
          return new Response('Error checking duplicate user', { status: 500 });
        }

        // Compare existing data with webhook data
        const dataMatches =
          existingUser.email === userData.email &&
          existingUser.first_name === userData.first_name &&
          existingUser.last_name === userData.last_name &&
          existingUser.avatar_url === userData.avatar_url;

        if (dataMatches) {
          console.log(`User already exists with matching data: ${id}`);
          return new Response('User already exists (idempotent)', { status: 200 });
        }

        // Update existing record if data differs
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            avatar_url: userData.avatar_url,
          })
          .eq('clerk_user_id', id);

        if (updateError) {
          console.error('Error updating existing user:', updateError);
          return new Response('Error updating user', { status: 500 });
        }

        console.log(`Updated existing user with new data: ${id}`);
        return new Response('User updated successfully', { status: 200 });
      }

      // Other database errors
      console.error('Error inserting user into Supabase:', insertError);
      return new Response('Database error', { status: 500 });
    }

    console.log(`User created successfully: ${insertedUser.id} (clerk_user_id: ${id})`);
    return new Response('User created successfully', { status: 200 });
  } catch (error) {
    console.error('Unexpected error processing webhook:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
