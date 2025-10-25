/**
 * Integration Tests for Initiatives API Route
 * Story 3.3: Enforce Trial Limits
 *
 * Tests the POST /api/initiatives endpoint with subscription limit enforcement
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import * as subscriptionLimits from '@/lib/utils/subscription-limits';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock subscription limits module
vi.mock('@/lib/utils/subscription-limits', () => ({
  checkInitiativeLimit: vi.fn(),
}));

const mockAuth = vi.mocked(auth);
const mockCreateClient = vi.mocked(createClient);
const mockCheckInitiativeLimit = vi.mocked(subscriptionLimits.checkInitiativeLimit);

describe('POST /api/initiatives', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when user is not authenticated', async () => {
    // Mock unauthenticated user
    mockAuth.mockResolvedValue({ userId: null } as any);

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Initiative' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 when request body is invalid', async () => {
    // Mock authenticated user
    mockAuth.mockResolvedValue({ userId: 'clerk_user_123' } as any);

    // Mock limit check passes
    mockCheckInitiativeLimit.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({ title: '' }), // Invalid: empty title
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.message).toBe('Invalid request data');
  });

  it('should return 403 when initiative limit reached', async () => {
    // Mock authenticated user
    mockAuth.mockResolvedValue({ userId: 'clerk_user_123' } as any);

    // Mock limit check fails - user at limit
    mockCheckInitiativeLimit.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      currentCount: 1,
      limit: 1,
      tier: 'trial',
    });

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Initiative' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('INITIATIVE_LIMIT_REACHED');
    expect(data.tier).toBe('trial');
    expect(data.currentCount).toBe(1);
    expect(data.limit).toBe(1);
    expect(data.message).toContain('Trial users can only create 1 initiative');
  });

  it('should return 403 with different message for Starter tier at limit', async () => {
    // Mock authenticated user
    mockAuth.mockResolvedValue({ userId: 'clerk_user_123' } as any);

    // Mock limit check fails - Starter user at limit
    mockCheckInitiativeLimit.mockResolvedValue({
      allowed: false,
      reason: 'limit_reached',
      currentCount: 3,
      limit: 3,
      tier: 'starter',
    });

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Initiative' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('INITIATIVE_LIMIT_REACHED');
    expect(data.tier).toBe('starter');
    expect(data.message).toContain('Upgrade to Professional for unlimited initiatives');
  });

  it('should create initiative successfully when under limit', async () => {
    // Mock authenticated user
    mockAuth.mockResolvedValue({ userId: 'clerk_user_123' } as any);

    // Mock limit check passes
    mockCheckInitiativeLimit.mockResolvedValue({
      allowed: true,
      currentCount: 0,
      limit: 1,
      tier: 'trial',
    });

    // Mock Supabase client
    const mockClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      insert: vi.fn().mockReturnThis(),
      rpc: vi.fn(),
    };

    // Mock user lookup
    mockClient.single.mockResolvedValueOnce({
      data: { id: 'supabase_user_123' },
      error: null,
    });

    // Mock initiative creation
    mockClient.single.mockResolvedValueOnce({
      data: {
        id: 'initiative_123',
        title: 'Test Initiative',
        description: null,
        user_id: 'supabase_user_123',
        phase: 'planning',
        phase_progress: 0,
        status: 'active',
        created_at: new Date().toISOString(),
      },
      error: null,
    });

    // Mock RPC call for incrementing usage
    mockClient.rpc.mockResolvedValueOnce({ error: null });

    mockCreateClient.mockResolvedValue(mockClient as any);

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Initiative',
        description: 'Test Description',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.initiative).toBeDefined();
    expect(data.initiative.id).toBe('initiative_123');
    expect(data.initiative.title).toBe('Test Initiative');

    // Verify limit check was called
    expect(mockCheckInitiativeLimit).toHaveBeenCalledWith('clerk_user_123');

    // Verify RPC was called to increment usage
    expect(mockClient.rpc).toHaveBeenCalledWith('increment_initiatives_count', {
      p_user_id: 'supabase_user_123',
      p_month: expect.stringMatching(/^\d{4}-\d{2}$/),
    });
  });

  it('should return 404 when user not found in database', async () => {
    // Mock authenticated user
    mockAuth.mockResolvedValue({ userId: 'clerk_user_123' } as any);

    // Mock limit check passes
    mockCheckInitiativeLimit.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    // Mock Supabase client
    const mockClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    };

    // Mock user lookup fails
    mockClient.single.mockResolvedValueOnce({
      data: null,
      error: { message: 'User not found' },
    });

    mockCreateClient.mockResolvedValue(mockClient as any);

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Initiative' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('User not found');
  });

  it('should return 500 when initiative creation fails', async () => {
    // Mock authenticated user
    mockAuth.mockResolvedValue({ userId: 'clerk_user_123' } as any);

    // Mock limit check passes
    mockCheckInitiativeLimit.mockResolvedValue({
      allowed: true,
      tier: 'trial',
    });

    // Mock Supabase client
    const mockClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      insert: vi.fn().mockReturnThis(),
    };

    // Mock user lookup succeeds
    mockClient.single.mockResolvedValueOnce({
      data: { id: 'supabase_user_123' },
      error: null,
    });

    // Mock initiative creation fails
    mockClient.single.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
    });

    mockCreateClient.mockResolvedValue(mockClient as any);

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Initiative' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to create initiative');
  });

  it('should validate title length limits', async () => {
    // Mock authenticated user
    mockAuth.mockResolvedValue({ userId: 'clerk_user_123' } as any);

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({
        title: 'a'.repeat(201), // Over 200 character limit
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.details).toBeDefined();
  });

  it('should validate description length limits', async () => {
    // Mock authenticated user
    mockAuth.mockResolvedValue({ userId: 'clerk_user_123' } as any);

    const request = new NextRequest('http://localhost:3000/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Valid Title',
        description: 'a'.repeat(1001), // Over 1000 character limit
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.details).toBeDefined();
  });
});
