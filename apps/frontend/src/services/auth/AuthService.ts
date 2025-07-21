import {
  CommonResponse,
  GetUserResponseSchema,
  LoginResponseSchema,
  type RegisterRequestBody,
} from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { apiClient } from "@/lib/api/client"

const AuthService = {
  /**
   * Login user with email and password
   *
   * @param email The email of the user
   * @param password The password of the user
   * @returns The user token if login is successful
   */
  login: async (email: string, password: string) => {
    const response = await apiClient.post(
      "/api/auth/login",
      { email, password },
      LoginResponseSchema,
    )
    return response
  },
  register: async (email: string, password: string, emailVerificationCode: string) => {
    const response = await apiClient.post(
      "/api/auth/register",
      { email, password, emailVerificationCode } satisfies RegisterRequestBody,
      CommonResponse,
    )
    return response
  },

  /**
   * Gets user information from a JWT token by making a request to the backend.
   *
   * @param token The JWT token to get user info for.
   * @returns The user information or null if token is invalid.
   */
  getUserFromToken: async (token: string): Promise<User | null> => {
    try {
      const response = await apiClient.get("/api/me", GetUserResponseSchema, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.success ? response.data.data : null
    } catch (_) {
      return null
    }
  },
} as const

export default AuthService
