import type { Authentication } from "@/payload-types"
import type { CreateAuthenticationData } from "@/types/collections"
import { userMock } from "./User.mock"

export const authenticationCreateMock: CreateAuthenticationData = {
  user: userMock,
  type: "oauth",
  provider: "google",
  providerAccountId: "someid",
  refreshToken: "someid",
  accessToken: "someid",
  expiresAt: 1688888888,
  tokenType: "Bearer",
  scope: "openid email profile",
}

export const authenticationMock: Authentication = {
  id: "60a4fa6ff8ba5b0a929c1142",
  user: userMock,
  type: "oauth",
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
