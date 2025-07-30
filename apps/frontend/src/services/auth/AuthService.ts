import {
  CommonResponseSchema,
  GetUserResponseSchema,
  LoginResponseSchema,
  type RegisterRequestBody,
} from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { ApiClient, apiClient } from "@/lib/api/client"

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
    return ApiClient.throwIfError(response)
  },
  /**
   * Register user with email and password
   *
   * @param email The email of the user
   * @param password The password of the user
   * @param emailVerificationCode The email verification code of the user
   * @returns The user token if registration is successful
   */
  register: async (email: string, password: string, emailVerificationCode: string) => {
    const response = await apiClient.post(
      "/api/auth/register",
      { email, password, emailVerificationCode } satisfies RegisterRequestBody,
      CommonResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Send email verification code to user's email
   *
   * @param email The email of the user
   * @returns The response from the backend
   */
  sendEmailVerificationCode: async (email: string) => {
    const response = await apiClient.post(
      "/api/auth/verification-code",
      { email },
      CommonResponseSchema,
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Gets user information from a JWT token by making a request to the backend.
   *
   * @param token The JWT token to get user info for.
   * @returns The user information or null if token is invalid.
   */
  getUserFromToken: async (token: string) => {
    const response = await apiClient.get("/api/me", GetUserResponseSchema, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return ApiClient.throwIfError(response)
  },
  /**
   * Update the current user's profile
   *
   * @param data The user data to update (self-editable fields only)
   * @param token The user's authentication token
   * @returns The updated user
   */
  patchMe: async (data: Partial<User>, token: string) => {
    const response = await apiClient.patch("/api/me", data, GetUserResponseSchema, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return ApiClient.throwIfError(response)
  },
} as const

export default AuthService
