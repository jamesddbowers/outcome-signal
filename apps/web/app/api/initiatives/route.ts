/**
 * Initiatives API Route
 * Story 3.3: Enforce Trial Limits
 *
 * Handles initiative creation and retrieval with subscription limit enforcement
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { checkInitiativeLimit } from '@/lib/utils/subscription-limits';

/**
 * Zod schema for initiative creation
 */
const createInitiativeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
});

/**
 * GET /api/initiatives
 * Retrieves all initiatives for the authenticated user
 */
export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client since we're already authenticated via Clerk
    const supabase = createAdminClient();

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's initiatives
    const { data: initiatives, error: initiativesError } = await supabase
      .from('initiatives')
      .select('*')
      .eq('user_id', userData.id)
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (initiativesError) {
      console.error('Error fetching initiatives:', initiativesError);
      return NextResponse.json(
        { error: 'Failed to fetch initiatives' },
        { status: 500 }
      );
    }

    return NextResponse.json({ initiatives });
  } catch (error) {
    console.error('Unexpected error in GET /api/initiatives:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/initiatives
 * Creates a new initiative with subscription limit enforcement
 *
 * Enforces:
 * - Trial users: max 1 initiative
 * - Starter users: max 3 initiatives/month
 * - Professional/Enterprise: unlimited
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createInitiativeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { title, description } = validation.data;

    // CHECK SUBSCRIPTION LIMIT BEFORE CREATING
    const limitCheck = await checkInitiativeLimit(userId);

    if (!limitCheck.allowed) {
      console.log({
        event: 'initiative_limit_blocked',
        userId,
        tier: limitCheck.tier,
        reason: limitCheck.reason,
        currentCount: limitCheck.currentCount,
        limit: limitCheck.limit,
      });

      // Handle trial expiration separately
      if (limitCheck.reason === 'trial_expired') {
        return NextResponse.json(
          {
            error: 'TRIAL_EXPIRED',
            message: 'Your trial has expired. Upgrade to continue using OutcomeSignal.',
            tier: limitCheck.tier,
            status: 'expired',
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: 'INITIATIVE_LIMIT_REACHED',
          message:
            limitCheck.tier === 'trial'
              ? 'Trial users can only create 1 initiative. Upgrade to Starter for up to 3 initiatives/month.'
              : `You've reached your initiative limit for this month. Upgrade to Professional for unlimited initiatives.`,
          tier: limitCheck.tier,
          currentCount: limitCheck.currentCount,
          limit: limitCheck.limit,
        },
        { status: 403 }
      );
    }

    // Limit check passed - proceed with creation
    // Use admin client since we're already authenticated via Clerk
    const supabase = createAdminClient();

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create initiative
    const { data: initiative, error: createError } = await supabase
      .from('initiatives')
      .insert({
        user_id: userData.id,
        title,
        description: description || null,
        phase: 'planning',
        phase_progress: 0,
        status: 'active',
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating initiative:', createError);
      return NextResponse.json(
        { error: 'Failed to create initiative' },
        { status: 500 }
      );
    }

    // Update usage tracking - increment initiatives_count
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Type assertion needed until types are regenerated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: usageError } = await (supabase as any).rpc('increment_initiatives_count', {
      p_user_id: userData.id,
      p_month: currentMonth,
    });

    if (usageError) {
      console.error('Error updating usage tracking:', usageError);
      // Don't fail the request if usage tracking fails - initiative was created successfully
    }

    console.log({
      event: 'initiative_created',
      userId,
      initiativeId: initiative.id,
      tier: limitCheck.tier,
    });

    return NextResponse.json(
      { initiative },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/initiatives:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
