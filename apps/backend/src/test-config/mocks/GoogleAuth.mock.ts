import type { UserInfoResponse } from "@repo/shared"
import { NextRequest } from "next/server"

// Mock Next Request
export function createMockNextRequest(url: string) {
  return new NextRequest(new URL(url, "http://localhost:3000"))
}

const googleAuthScopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
] // cannot be imported from business-layer/security/google.ts or test fails due to hoisting of vi.mock over imports

// Mock Google user response
export const googleUserMock: UserInfoResponse = {
  sub: "111111111111111111111",
  email: "straight.zhao@example.com",
  given_name: "straight",
  family_name: "zhao",
  name: "straight zhao",
  picture: "https://example.com/avatar.jpg",
  email_verified: true,
  hd: "example.com",
}

export const tokensMock = {
  access_token: "mock_access_token",
  expiry_date: Date.now() + 3600 * 1000, // 1 hour
  id_token: "mock_id_token",
}

// URL param mocks
export const CODE_MOCK = "mock_code"
export const STATE_MOCK = "mock_state"
export const SCOPES = encodeURIComponent(googleAuthScopes.join(" "))

// JWT token secret mock
export const JWT_SECRET_MOCK = "mock_jwt_secret"
