import type { CollectionSlug } from "payload"

import AuthService from "@/business-layer/services/AuthService"
import { payload } from "@/data-layer/adapters/Payload"
import {
  adminUserMock,
  casualUserMock,
  memberUserMock,
} from "../../../../packages/shared/src/test-config/mocks/User.mock"
import { clearCollection } from "./backend-utils"
import { JWT_SECRET_MOCK } from "./mocks/GoogleAuth.mock"

let cookies: Record<string, string> = {}
let headers: Record<string, string> = {}

let casualToken: string
let memberToken: string
let adminToken: string

const authService = new AuthService()

beforeEach(async () => {
  process.env.JWT_SECRET = JWT_SECRET_MOCK

  vi.mock("next/headers", () => ({
    cookies: vi.fn(() => ({
      set: vi.fn().mockImplementation((key: string, value: string, _cookie) => {
        cookies[key] = value
      }),
      get: vi.fn().mockImplementation((key: string) => {
        return { value: cookies[key] }
      }),
      delete: vi.fn().mockImplementation((key: string) => {
        delete cookies[key]
      }),
    })),
    headers: vi.fn(() => ({
      get: vi.fn().mockImplementation((key: string): string => {
        return headers[key]
      }),
    })),
  }))

  const usersToCreate = [casualUserMock, memberUserMock, adminUserMock]
  await Promise.all(
    usersToCreate.map((user) =>
      payload.create({
        collection: "user",
        data: user,
      }),
    ),
  )
  casualToken = authService.signJWT({ user: casualUserMock })
  memberToken = authService.signJWT({ user: memberUserMock })
  adminToken = authService.signJWT({ user: adminUserMock })
})

afterEach(async () => {
  for (const slug of Object.keys(payload.collections)) {
    await clearCollection(payload, slug as CollectionSlug)
  }
  cookies = {}
  headers = {}
})

/**
 * Exported tokens are used for tests that require authentication.
 *
 * @example
 * describe("Some test", () => {
 *   const cookieStore = await cookies()
 *   it("should do something with casual user", async () => {
 *     cookieStore.set(AUTH_COOKIE_NAME, casualToken)
 *     const response = await GET()
 *   })
 * })
 */
export { casualToken, memberToken, adminToken }
