import type { CreateAuthenticationData } from "@repo/shared"
import type { Authentication } from "@repo/shared/payload-types"
import { casualUserMock } from "./User.mock"

export const EMAIL_MOCK = "straight.zhao@example.com"
export const PASSWORD_MOCK = "str@!ghtZh@069"
export const HASHED_PASSWORD_MOCK = "hashedPassword"

export const CASUAL_JWT_MOCK = "casual_JWT_token"
export const MEMBER_JWT_MOCK = "member_JWT_token"
export const ADMIN_JWT_MOCK = "admin_JWT_token"

interface MockPaginatedDocs<T> {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  page: number
  pagingCounter: number
  totalDocs: number
  totalPages: number
}

export const mockPaginatedDocs = <T>(docs: T[]): MockPaginatedDocs<T> => ({
  docs,
  totalDocs: docs.length,
  limit: 10,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
})

export const standardAuthCreateMock: CreateAuthenticationData = {
  user: casualUserMock,
  email: "straight.zhao@example.com",
  password: HASHED_PASSWORD_MOCK,
}

export const standardAuthMock: Authentication = {
  id: "60a4fa6ff8ba5b0a929c1142",
  user: casualUserMock,
  email: EMAIL_MOCK,
  password: HASHED_PASSWORD_MOCK,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const googleAuthCreateMock: CreateAuthenticationData = {
  user: casualUserMock,
  email: EMAIL_MOCK,
  provider: "google",
  providerAccountId: "someid",
  refreshToken: "someid",
  accessToken: "someid",
  expiresAt: 1688888888,
  tokenType: "Bearer",
  scope: "openid email profile",
}

export const googleAuthMock: Authentication = {
  id: "60a4fa6ff8ba5b0a929c1142",
  user: casualUserMock,
  email: EMAIL_MOCK,
  provider: "google",
  providerAccountId: "someid",
  refreshToken: "someid",
  accessToken: "someid",
  expiresAt: 1688888888,
  tokenType: "Bearer",
  scope: "openid email profile",
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}
