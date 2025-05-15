import type { CreateAuthenticationData } from "@repo/shared"
import type { Authentication } from "@repo/shared/payload-types"
import { userMock } from "./User.mock"

export const emailMock = "straight.zhao@example.com"
export const passwordMock = "str@!ghtZh@069"
export const hashedPasswordMock = "hashedPassword"

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
  user: userMock,
  email: "straight.zhao@example.com",
  password: hashedPasswordMock,
}

export const standardAuthMock: Authentication = {
  id: "60a4fa6ff8ba5b0a929c1142",
  user: userMock,
  email: emailMock,
  password: hashedPasswordMock,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const googleAuthCreateMock: CreateAuthenticationData = {
  user: userMock,
  email: emailMock,
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
  user: userMock,
  email: emailMock,
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
