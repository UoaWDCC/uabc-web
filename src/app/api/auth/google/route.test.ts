import type { Mock } from 'vitest'

import { SCOPES, STATE_MOCK } from '@/test-config/mocks/GoogleAuth.mock'
import { GET } from './route'

import { redirect } from 'next/navigation'

// Mock cookies
vi.mock('next/headers', () => ({
  cookies: () => ({
    set: vi.fn(),
  }),
}))

// Mock redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('GET /api/auth/google', () => {
  beforeAll(() => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(STATE_MOCK)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('redirects to Google OAuth URL with state', async () => {
    await GET()

    expect(redirect).toHaveBeenCalled()
    const redirectUrl = (redirect as unknown as Mock).mock.calls[0][0]
    expect(redirectUrl).toContain('https://accounts.google.com/o/oauth2/v2/auth')
    expect(redirectUrl).toContain(`state=${STATE_MOCK}`)
    expect(redirectUrl).toContain(`scope=${SCOPES}`)
  })
})
