import dotenv from "dotenv"
import { StatusCodes } from "http-status-codes"
import AuthService from "@/business-layer/services/AuthService"

import {
  CODE_MOCK,
  googleUserMock,
  INVALID_CODE_MOCK,
  INVALID_USER_CODE_MOCK,
  SCOPES,
  STATE_MOCK,
  tokensMock,
} from "@/test-config/mocks/GoogleAuth.mock"

dotenv.config()

vi.mock("@/business-layer/provider/google", async () => {
  const actual = await vi.importActual<typeof import("@/business-layer/provider/google")>(
    "@/business-layer/provider/google",
  )
  return {
    ...actual,
    oauth2Client: {
      getToken: vi.fn().mockImplementation((code: string) => {
        switch (code) {
          case CODE_MOCK:
            return {
              tokens: tokensMock,
            }
          case INVALID_CODE_MOCK:
            return {
              tokens: null,
            }
          default:
            return {
              tokens: null,
            }
        }
      }),
    },
  }
})

import { JWTEncryptedUserSchema } from "@repo/shared"
import { cookies } from "next/headers"
import { NotFound } from "payload"
import { GET as callback } from "@/app/api/auth/google/callback/route"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"

vi.mock("@/data-layer/services/AuthDataService", () => {
  const actual = vi.importActual<typeof import("@/data-layer/services/AuthDataService")>(
    "@/data-layer/services/AuthDataService",
  )
  return {
    ...actual,
    default: vi.fn().mockImplementation(() => ({
      createAuth: vi.fn().mockResolvedValue(googleUserMock),
      getAuthByEmail: vi.fn().mockResolvedValue(googleUserMock),
      updateAuth: vi.fn().mockResolvedValue(googleUserMock),
    })),
  }
})

describe("GET /api/auth/google/callback", async () => {
  const cookieStore = await cookies()
  const userDataService = new UserDataService()

  beforeAll(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init: { headers: Record<string, string> }) => {
        const authHeader: string = init.headers.Authorization
        if (authHeader === `Bearer ${tokensMock.access_token}`) {
          return { json: () => Promise.resolve(googleUserMock) }
        }
        return { json: () => Promise.resolve() }
      }),
    )
  })

  it("redirects user and sets JWT token as query parameter on success auth", async () => {
    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    const response = await callback(req)

    expect(response.status).toBe(StatusCodes.TEMPORARY_REDIRECT)

    const location = response.headers.get("location")
    expect(location).toBeDefined()

    if (location) {
      const redirectUrl = new URL(location)
      expect(redirectUrl.pathname).toBe("/auth/callback")
      expect(redirectUrl.searchParams.get("token")).toBeDefined()

      const token = redirectUrl.searchParams.get("token")
      const authService = new AuthService()
      const data = authService.getData(token as string, JWTEncryptedUserSchema)

      const userMock = await userDataService.getUserByEmail(
        googleUserMock.email ?? "straight.zhao@example.com",
      )
      const { remainingSessions: _omit, ...userMockWithoutSessions } = userMock
      expect(data).toMatchObject({
        user: userMockWithoutSessions,
        accessToken: tokensMock.access_token,
      })
    }
  })

  it("creates a new authentication document for the user when auth document can't be found", async () => {
    vi.mocked(AuthDataService).mockImplementationOnce(() => ({
      getAuthByEmail: vi
        .fn()
        .mockRejectedValue(
          new NotFound(
            () => `Authentication with the email: ${googleUserMock.email} was not found`,
          ),
        ),
      createAuth: vi.fn().mockResolvedValue(googleUserMock),
      updateAuth: vi.fn().mockResolvedValue(googleUserMock),
    }))

    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )

    const response = await callback(req)
    expect(response.status).toBe(StatusCodes.TEMPORARY_REDIRECT)

    const location = response.headers.get("location")
    expect(location).toBeDefined()

    if (location) {
      const redirectUrl = new URL(location)
      expect(redirectUrl.pathname).toBe("/auth/callback")
      expect(redirectUrl.searchParams.get("token")).toBeDefined()

      const token = redirectUrl.searchParams.get("token")
      const authService = new AuthService()
      const data = authService.getData(token as string, JWTEncryptedUserSchema)

      const userMock = await userDataService.getUserByEmail(
        googleUserMock.email ?? "straight.zhao@example.com",
      )
      const { remainingSessions: _omit, ...userMockWithoutSessions } = userMock
      expect(data).toMatchObject({
        user: userMockWithoutSessions,
        accessToken: tokensMock.access_token,
      })
    }
  })

  it("returns 400 if state does not match", async () => {
    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=wrong_state&scope=${SCOPES}`,
    )
    const response = await callback(req)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    const json = await response.json()
    expect(json.error).toMatch(/state/i)
  })

  it("returns 400 if code is missing", async () => {
    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    const response = await callback(req)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    const json = await response.json()
    expect(json.error).toMatch("No code provided")
  })

  it("returns 400 if scope is missing", async () => {
    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}`,
    )
    const response = await callback(req)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    const json = await response.json()
    expect(json.error).toMatch("No scope or invalid scopes provided")
  })

  it("returns 400 if scope is invalid", async () => {
    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=invalid_scope`,
    )
    const response = await callback(req)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    const json = await response.json()
    expect(json.error).toMatch(/scope/i)
  })

  it("returns 500 if token response is invalid", async () => {
    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${INVALID_CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    const response = await callback(req)

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    const json = await response.json()
    expect(json.error).toBe("Error invalid google auth")
  })

  it("returns 500 if google user info response is invalid", async () => {
    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${INVALID_USER_CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    const response = await callback(req)

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    const json = await response.json()
    expect(json.error).toBeDefined()
  })

  it("returns 500 if response can't be parsed", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve("Invalid JSON"),
      ok: true,
      status: 200,
    })
    vi.stubGlobal("fetch", mockFetch)

    cookieStore.set("state", STATE_MOCK)

    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    const response = await callback(req)

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    const json = await response.json()
    expect(json.error).toBe("Error parsing user info response")
  })
})
