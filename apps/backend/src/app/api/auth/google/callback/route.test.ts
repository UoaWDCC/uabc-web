import dotenv from "dotenv"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

import { authenticationMock } from "@/test-config/mocks/Authentication.mock"
import { userMock } from "@/test-config/mocks/User.mock"

import {
  CODE_MOCK,
  JWT_SECRET_MOCK,
  SCOPES,
  STATE_MOCK,
  createMockNextRequest,
  googleUserMock,
  tokensMock,
} from "@/test-config/mocks/GoogleAuth.mock"

dotenv.config()

vi.mock("@/business-layer/security/google", async () => {
  const actual = await vi.importActual<typeof import("@/business-layer/security/google")>(
    "@/business-layer/security/google",
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

vi.mock("@/data-layer/services/UserDataService", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getUserByEmail: vi.fn().mockResolvedValue(userMock),
      createUser: vi.fn().mockResolvedValue(userMock),
    })),
  }
})

vi.mock("@/data-layer/services/AuthDataService", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      createAuth: vi.fn().mockResolvedValue(authenticationMock),
    })),
  }
})

import { GET as callback } from "@/app/api/auth/google/callback/route"

const JWT_SECRET = process.env.JWT_SECRET

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: (key: string) => ({ value: key === "state" ? STATE_MOCK : undefined }),
    delete: vi.fn(),
  }),
}))

describe("GET /api/auth/google/callback", () => {
  beforeAll(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: vi.fn().mockResolvedValue(googleUserMock),
    } as unknown as Response)

    process.env.JWT_SECRET = JWT_SECRET_MOCK
  })

  afterEach(() => vi.restoreAllMocks())

  it("returns JWT token on success auth", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    req.cookies.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(json.token).toBeDefined()

    const decoded = jwt.verify(json.token, process.env.JWT_SECRET)

    expect(decoded).toMatchObject({
      profile: userMock,
      accessToken: tokensMock.access_token,
    })
  })

  it("returns 400 if state does not match", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=wrong_state&scope=${SCOPES}}`,
    )
    req.cookies.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toMatch(/state/i)
  })

  it("returns 400 if code is missing", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    req.cookies.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toMatch(/code/i)
  })

  it("returns 400 if scope is missing", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}`,
    )
    req.cookies.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toMatch(/scope/i)
  })

  it("returns 400 if scope is invalid", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=invalid_scope`,
    )
    req.cookies.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toMatch(/scope/i)
  })

  it("returns 500 if user info response is invalid", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    req.cookies.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(json.error).toBeDefined()
  })

  afterAll(() => {
    const originalJwtSecret = JWT_SECRET
    process.env.JWT_SECRET = originalJwtSecret
  })
})
