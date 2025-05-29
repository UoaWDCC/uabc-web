import type { User } from "@/payload-types"

export const AUTH_COOKIE_NAME = "auth_token"

export interface JWTEncryptedUser {
  user: User
  accessToken?: string
}
