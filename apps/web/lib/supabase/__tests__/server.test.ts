import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createAdminClient } from '../server'

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}))

describe('Supabase Server Client', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('createAdminClient', () => {
    it('creates admin client with valid environment variables', () => {
      const client = createAdminClient()
      expect(client).toBeDefined()
      expect(client).toHaveProperty('from')
      expect(client).toHaveProperty('auth')
    })

    it('throws error with missing NEXT_PUBLIC_SUPABASE_URL', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      expect(() => createAdminClient()).toThrow('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
    })

    it('throws error with missing SUPABASE_SERVICE_ROLE_KEY', () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      expect(() => createAdminClient()).toThrow('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
    })

    it('returns admin client with expected methods', () => {
      const client = createAdminClient()
      expect(client).toHaveProperty('from')
      expect(client).toHaveProperty('auth')
      expect(client).toHaveProperty('storage')
      expect(client).toHaveProperty('rpc')
    })
  })
})
