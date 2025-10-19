import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

describe('POST /api/chat/send', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

    const request = new NextRequest('http://localhost/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        initiativeId: 'init-123',
        content: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 if initiativeId is missing', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as Awaited<ReturnType<typeof auth>>);

    const request = new NextRequest('http://localhost/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        content: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });

  it('returns 400 if content is missing', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as Awaited<ReturnType<typeof auth>>);

    const request = new NextRequest('http://localhost/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        initiativeId: 'init-123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });

  it('creates new conversation when none exists', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'clerk-user-123' } as Awaited<ReturnType<typeof auth>>);

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === 'users') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'db-user-123' },
                  error: null,
                }),
              })),
            })),
          };
        }
        if (table === 'agent_conversations') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  single: vi.fn().mockResolvedValue({
                    data: null,
                    error: { code: 'PGRST116' },
                  }),
                })),
              })),
            })),
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: 'conv-123',
                    initiative_id: 'init-123',
                    user_id: 'db-user-123',
                    messages: [{ id: 'msg-1', role: 'user', content: 'Test', timestamp: expect.any(String) }],
                  },
                  error: null,
                }),
              })),
            })),
          };
        }
        return {};
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as Awaited<ReturnType<typeof createClient>>);

    const request = new NextRequest('http://localhost/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        initiativeId: 'init-123',
        content: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message.content).toBe('Test message');
    expect(data.message.role).toBe('user');
    expect(data.conversationId).toBe('conv-123');
  });

  it('appends message to existing conversation', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'clerk-user-123' } as Awaited<ReturnType<typeof auth>>);

    const existingMessages = [
      { id: 'msg-1', role: 'user', content: 'Hello', timestamp: '2025-01-01T00:00:00Z' },
    ];

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === 'users') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'db-user-123' },
                  error: null,
                }),
              })),
            })),
          };
        }
        if (table === 'agent_conversations') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  single: vi.fn().mockResolvedValue({
                    data: {
                      id: 'conv-123',
                      messages: existingMessages,
                    },
                    error: null,
                  }),
                })),
              })),
            })),
            update: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                error: null,
              }),
            })),
          };
        }
        return {};
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as Awaited<ReturnType<typeof createClient>>);

    const request = new NextRequest('http://localhost/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        initiativeId: 'init-123',
        content: 'New message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message.content).toBe('New message');
    expect(data.conversationId).toBe('conv-123');
  });

  it('returns 404 if user not found in database', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'clerk-user-123' } as Awaited<ReturnType<typeof auth>>);

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'User not found' },
            }),
          })),
        })),
      })),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as Awaited<ReturnType<typeof createClient>>);

    const request = new NextRequest('http://localhost/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        initiativeId: 'init-123',
        content: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });
});
