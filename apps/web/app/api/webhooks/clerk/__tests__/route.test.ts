import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

// Mock svix Webhook
vi.mock('svix', () => ({
  Webhook: vi.fn(),
}));

import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';

describe('POST /api/webhooks/clerk', () => {
  const mockHeaders = new Map<string, string>();
  const mockSupabaseClient = {
    from: vi.fn(),
  };
  const mockWebhookVerify = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default environment variables
    process.env.CLERK_WEBHOOK_SECRET = 'test_webhook_secret';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_role_key';

    // Mock headers
    mockHeaders.clear();
    mockHeaders.set('svix-id', 'msg_123');
    mockHeaders.set('svix-timestamp', '1234567890');
    mockHeaders.set('svix-signature', 'valid-signature');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(headers).mockResolvedValue(mockHeaders as any);

    // Mock Supabase client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);

    // Mock svix Webhook
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(Webhook).mockImplementation(() => ({
      verify: mockWebhookVerify,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Signature Verification', () => {
    it('should return 400 if svix-id header is missing', async () => {
      mockHeaders.delete('svix-id');

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toContain('Missing required webhook headers');
    });

    it('should return 400 if svix-timestamp header is missing', async () => {
      mockHeaders.delete('svix-timestamp');

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should return 400 if svix-signature header is missing', async () => {
      mockHeaders.delete('svix-signature');

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should return 401 if signature verification fails', async () => {
      mockWebhookVerify.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toContain('Invalid webhook signature');
    });

    it('should return 500 if CLERK_WEBHOOK_SECRET is not configured', async () => {
      delete process.env.CLERK_WEBHOOK_SECRET;

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain('Webhook secret not configured');
    });
  });

  describe('Event Type Handling', () => {
    it('should return 200 for non-user.created event types', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.updated',
        data: {},
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.updated' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toContain('Event type not supported');
    });
  });

  describe('Payload Validation', () => {
    it('should return 400 if user ID is missing', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: '',
          email_addresses: [{ email_address: 'test@example.com' }],
        },
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toContain('missing user ID');
    });

    it('should return 400 if email_addresses is empty', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [],
        },
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toContain('missing email address');
    });

    it('should return 400 if primary email is empty', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: '' }],
        },
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toContain('empty email address');
    });
  });

  describe('Successful User Creation', () => {
    it('should create user record on valid user.created event', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: 'test@example.com', id: 'email_1' }],
          first_name: 'Test',
          last_name: 'User',
          image_url: 'https://example.com/avatar.jpg',
          created_at: 1234567890,
        },
      });

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'uuid-123', clerk_user_id: 'user_123' },
            error: null,
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toContain('User created successfully');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
      expect(mockInsert).toHaveBeenCalledWith({
        clerk_user_id: 'user_123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        avatar_url: 'https://example.com/avatar.jpg',
      });
    });

    it('should handle null optional fields', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: 'test@example.com', id: 'email_1' }],
          first_name: null,
          last_name: null,
          image_url: null,
          created_at: 1234567890,
        },
      });

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'uuid-123', clerk_user_id: 'user_123' },
            error: null,
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      expect(mockInsert).toHaveBeenCalledWith({
        clerk_user_id: 'user_123',
        email: 'test@example.com',
        first_name: null,
        last_name: null,
        avatar_url: null,
      });
    });
  });

  describe('Idempotent Duplicate Handling', () => {
    it('should return 200 when duplicate user with matching data exists', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: 'test@example.com', id: 'email_1' }],
          first_name: 'Test',
          last_name: 'User',
          image_url: 'https://example.com/avatar.jpg',
          created_at: 1234567890,
        },
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'uuid-123',
              clerk_user_id: 'user_123',
              email: 'test@example.com',
              first_name: 'Test',
              last_name: 'User',
              avatar_url: 'https://example.com/avatar.jpg',
            },
            error: null,
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: '23505', message: 'duplicate key' },
            }),
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValueOnce({
        select: mockSelect,
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toContain('User already exists (idempotent)');
    });

    it('should update user when duplicate exists with different data', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: 'newemail@example.com', id: 'email_1' }],
          first_name: 'Updated',
          last_name: 'Name',
          image_url: 'https://example.com/newavatar.jpg',
          created_at: 1234567890,
        },
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });

      mockSupabaseClient.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: '23505', message: 'duplicate key' },
            }),
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'uuid-123',
                clerk_user_id: 'user_123',
                email: 'oldemail@example.com',
                first_name: 'Old',
                last_name: 'Name',
                avatar_url: 'https://example.com/oldavatar.jpg',
              },
              error: null,
            }),
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValueOnce({
        update: mockUpdate,
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toContain('User updated successfully');

      expect(mockUpdate).toHaveBeenCalledWith({
        email: 'newemail@example.com',
        first_name: 'Updated',
        last_name: 'Name',
        avatar_url: 'https://example.com/newavatar.jpg',
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 500 on unexpected Supabase error', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: 'test@example.com', id: 'email_1' }],
          first_name: 'Test',
          last_name: 'User',
          image_url: null,
          created_at: 1234567890,
        },
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'UNKNOWN_ERROR', message: 'Database connection failed' },
            }),
          }),
        }),
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain('Database error');
    });

    it('should return 500 on unexpected error', async () => {
      mockWebhookVerify.mockReturnValue({
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: 'test@example.com', id: 'email_1' }],
          first_name: 'Test',
          last_name: 'User',
          image_url: null,
          created_at: 1234567890,
        },
      });

      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const request = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain('Internal server error');
    });
  });
});
