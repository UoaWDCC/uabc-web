import type { CollectionSlug } from "payload"

import AuthService from "@/business-layer/services/AuthService"
import { payload } from "@/data-layer/adapters/Payload"
import UserDataService from "@/data-layer/services/UserDataService"
import { clearCollection } from "./backend-utils"
import { JWT_SECRET_MOCK } from "./mocks/GoogleAuth.mock"
import { adminUserMock, casualUserMock, memberUserMock } from "./mocks/User.mock"

let cookies: Record<string, string> = {}
let headers: Record<string, string> = {}

let casualToken: string
let memberToken: string
let adminToken: string

const userDataService = new UserDataService()
const authService = new AuthService()

beforeEach(async () => {
  process.env.JWT_SECRET = JWT_SECRET_MOCK

  // vi.mock("@/business-layer/services/AuthService", async () => {
  //   return {
  //     default: {
  //       signJWT: vi.fn().mockImplementation((payload: JWTEncryptedUser, _options) => {
  //         if (payload.user.email === adminUserMock.email) return ADMIN_JWT_MOCK
  //         if (payload.user.email === memberUserMock.email) return MEMBER_JWT_MOCK
  //         if (payload.user.email === casualUserMock.email) return CASUAL_JWT_MOCK
  //         return JWT_TOKEN_MOCK
  //       }),
  //       decodeJWT: vi.fn().mockImplementation((token): JwtPayload | string => {
  //         if (token === ADMIN_JWT_MOCK) return { user: adminUserMock }
  //         if (token === MEMBER_JWT_MOCK) return { user: memberUserMock }
  //         if (token === CASUAL_JWT_MOCK) return { user: casualUserMock }
  //         return {}
  //       }),
  //       getData: vi
  //         .fn()
  //         .mockImplementation(
  //           <T extends z.ZodTypeAny>(token: string, schema: T): z.infer<T> | undefined => {
  //             if (token === ADMIN_JWT_MOCK) return { user: adminUserMock }
  //             if (token === MEMBER_JWT_MOCK) return { user: memberUserMock }
  //             if (token === CASUAL_JWT_MOCK) return { user: casualUserMock }
  //           },
  //         ),
  //     },
  //   }
  // })

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
  for (const user of usersToCreate) {
    await userDataService.createUser(user)
  }

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

export { casualToken, memberToken, adminToken }
