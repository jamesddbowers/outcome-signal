import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createClient } from '../client'

describe('Supabase Client (Browser)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('creates client with valid environment variables', () => {
    const client = createClient()
    expect(client).toBeDefined()
    expect(client).toHaveProperty('from')
    expect(client).toHaveProperty('auth')
  })

  it('throws error with missing NEXT_PUBLIC_SUPABASE_URL', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    expect(() => createClient()).toThrow('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  })

  it('throws error with missing NEXT_PUBLIC_SUPABASE_ANON_KEY', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(() => createClient()).toThrow('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  it('returns a Supabase client with expected methods', () => {
    const client = createClient()
    expect(client).toHaveProperty('from')
    expect(client).toHaveProperty('auth')
    expect(client).toHaveProperty('storage')
    expect(client).toHaveProperty('rpc')
  })
})
