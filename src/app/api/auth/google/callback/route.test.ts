import { redirect } from 'next/navigation'
import { authenticationMock } from 'tests/mocks/Authentication.mock'
import { userMock } from 'tests/mocks/User.mock'

import {
  CODE_MOCK,
  JWT_SECRET_MOCK,
  JWT_TOKEN_MOCK,
  SCOPES,
  STATE_MOCK,
  createMockNextRequest,
  googleUserMock,
  tokensMock,
} from 'tests/mocks/GoogleAuth.mock'

vi.mock('@/business-layer/security/google', async () => {
  const actual = await vi.importActual<typeof import('@/business-layer/security/google')>(
    '@/business-layer/security/google',
  )

  return {
    ...actual,
    oauth2Client: {
      getToken: vi.fn().mockResolvedValue({
        tokens: tokensMock,
      }),
    },
  }
})

vi.mock('@/collections/services/UserService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getUserByEmail: vi.fn().mockResolvedValue(userMock),
      createUser: vi.fn().mockResolvedValue(userMock),
    })),
  }
})

vi.mock('@/collections/services/AuthService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      createAuth: vi.fn().mockResolvedValue(authenticationMock),
    })),
  }
})

const cookieStoreMock = {
  get: vi.fn((key: string) => ({ value: key === 'state' ? STATE_MOCK : undefined })),
  set: vi.fn(),
  delete: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: () => cookieStoreMock,
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('jsonwebtoken', async () => {
  const actual = await vi.importActual<typeof import('jsonwebtoken')>('jsonwebtoken')

  return {
    ...actual,
    sign: vi.fn().mockReturnValue(JWT_TOKEN_MOCK),
  }
})

let callback: typeof import('@/app/api/auth/google/callback/route').GET

const JWT_SECRET = process.env.JWT_SECRET

describe('GET /api/auth/google/callback', () => {
  beforeAll(async () => {
    callback = (await import('@/app/api/auth/google/callback/route')).GET

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: vi.fn().mockResolvedValue(googleUserMock),
    } as unknown as Response)

    process.env.JWT_SECRET = JWT_SECRET_MOCK
  })

  afterEach(() => vi.restoreAllMocks())
  afterAll(() => (process.env.JWT_SECRET = JWT_SECRET))

  it('redirects user on success auth', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    req.cookies.set('state', STATE_MOCK)

    await callback(req)

    expect(redirect).toHaveBeenCalled()

    expect(cookieStoreMock.set).toHaveBeenCalled()
    const [key, token, options] = cookieStoreMock.set.mock.calls[0]

    expect(key).toBe('auth_token')
    expect(token).toBe(JWT_TOKEN_MOCK)
    expect(options).toMatchObject({
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
    })
  })

  it('returns 400 if state does not match', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=wrong_state&scope=${SCOPES}`,
    )
    req.cookies.set('state', STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toMatch(/state/i)
  })

  it('returns 400 if code is missing', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    req.cookies.set('state', STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toMatch(/code/i)
  })
})
