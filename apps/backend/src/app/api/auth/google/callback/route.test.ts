import dotenv from "dotenv"

import { googleAuthMock } from "@/test-config/mocks/Authentication.mock"
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
  const actual = await vi.importActual<typeof import("@/business-layer/provider/google")>(
    "@/business-layer/provider/google",
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

vi.mock("@/data-layer/services/userDataService", () => ({
  default: vi.fn().mockImplementation(() => ({
    getUserByEmail: vi.fn().mockResolvedValue(userMock),
    createUser: vi.fn().mockResolvedValue(userMock),
  })),
}))

vi.mock("@/data-layer/services/AuthDataService", () => ({
  default: vi.fn().mockImplementation(() => ({
    createAuth: vi.fn().mockResolvedValue(googleAuthMock),
  })),
}))

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: (key: string) => (key === "state" ? { value: STATE_MOCK } : undefined),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))

import { GET as callback } from "@/app/api/auth/google/callback/route"
import { AUTH_COOKIE_NAME } from "@repo/shared"

describe("GET /api/auth/google/callback", () => {
  beforeAll(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: vi.fn().mockResolvedValue(googleUserMock),
    } as unknown as Response)

    process.env.JWT_SECRET = JWT_SECRET_MOCK
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("redirects user on successful auth", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )

    const res = await callback(req)

    expect(res.status).toBe(307) // redirect
    expect(res.headers.get("location")).toBe("http://localhost:3000/onboarding/name")

    const setCookie = res.headers.get("set-cookie")
    expect(setCookie).toContain(`${AUTH_COOKIE_NAME}=`)
    expect(setCookie).toContain("HttpOnly")
  })

  it("returns 400 if state does not match", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=wrong_state&scope=${SCOPES}`,
    )

    const res = await callback(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/state/i)
  })

  it("returns 400 if code is missing", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?state=${STATE_MOCK}&scope=${SCOPES}`,
    )

    const res = await callback(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/code/i)
  })
})
