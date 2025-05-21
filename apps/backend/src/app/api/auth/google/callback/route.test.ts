import dotenv from "dotenv"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

import {
  CODE_MOCK,
  INVALID_CODE_MOCK,
  INVALID_USER_CODE_MOCK,
  SCOPES,
  STATE_MOCK,
  createMockNextRequest,
  googleUserMock,
  invalidUserTokenMock,
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
      getToken: vi.fn().mockImplementation((code: string) => {
        if (code === CODE_MOCK) {
          return {
            tokens: tokensMock,
          }
        }
        if (code === INVALID_USER_CODE_MOCK) {
          return {
            tokens: invalidUserTokenMock,
          }
        }
        return {
          tokens: null,
        }
      }),
    },
  }
})

import { GET as callback } from "@/app/api/auth/google/callback/route"
import UserDataService from "@/data-layer/services/UserDataService"
import { cookies } from "next/headers"

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

  it("returns JWT token on success auth", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    cookieStore.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(json.token).toBeDefined()

    const decoded = jwt.verify(json.token, process.env.JWT_SECRET)
    const userMock = await userDataService.getUserByEmail(googleUserMock.email)
    expect(decoded).toMatchObject({
      profile: userMock,
      accessToken: tokensMock.access_token,
    })
  })

  it("returns 400 if state does not match", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=wrong_state&scope=${SCOPES}`,
    )
    cookieStore.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toMatch(/state/i)
  })

  it("returns 400 if code is missing", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    cookieStore.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toMatch("No code provided")
  })

  it("returns 400 if scope is missing", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}`,
    )
    cookieStore.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toMatch("No scope or invalid scopes provided")
  })

  it("returns 400 if scope is invalid", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=invalid_scope`,
    )
    cookieStore.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toMatch(/scope/i)
  })

  it("returns 500 if token response is invalid", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${INVALID_CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    cookieStore.set("state", STATE_MOCK)

    const response = await callback(req)
    // const json = await response.json()

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  it("returns 500 if google user info response is invalid", async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${INVALID_USER_CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES}`,
    )
    cookieStore.set("state", STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(json.error).toBeDefined()
  })
})
