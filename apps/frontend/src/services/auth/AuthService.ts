import { GetUserResponseSchema, LoginResponseSchema } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { StatusCodes } from "http-status-codes"
import { z } from "zod"
import { apiClient } from "@/lib/api/client"

/**
 * Frontend Authentication Service
 *
 * IMPORTANT: This service follows security best practices by NEVER decoding JWT tokens
 * on the frontend. Instead, it makes authenticated requests to the backend API endpoints
 * which handle JWT verification securely on the server side.
 *
 * Security Benefits:
 * - JWT_SECRET is never exposed to the client
 * - Token validation happens on the server
 * - Prevents token tampering attacks
 * - Follows the principle of least privilege
 */
const AuthService = {
  /**
   * Fetches the current authenticated user from the backend.
   *
   * This method makes a request to /api/me which:
   * 1. Extracts the JWT token from httpOnly cookies
   * 2. Verifies the token on the server using JWT_SECRET
   * 3. Returns the user data if valid, or null if invalid/expired
   *
   * @returns The current user or null if not authenticated.
   *
   * @example
   * ```typescript
   * const user = await AuthService.getMe()
   * if (user) {
   *   console.log(`Welcome, ${user.firstName}!`)
   * } else {
   *   console.log('Not authenticated')
   * }
   * ```
   */
  getMe: async (): Promise<User | null> => {
    const { data, status } = await apiClient.get("/api/me", GetUserResponseSchema)
    if (status !== StatusCodes.OK) return null
    return data?.data ?? null
  },

  /**
   * Logs in a user with email and password.
   *
   * This method:
   * 1. Sends credentials to the backend
   * 2. Backend validates credentials and creates a JWT
   * 3. JWT is stored in httpOnly cookies by the backend
   * 4. Returns the login response
   *
   * @param email The user's email.
   * @param password The user's password.
   * @returns The login response containing the JWT token.
   *
   * @example
   * ```typescript
   * try {
   *   const response = await AuthService.login("user@example.com", "password123")
   *   console.log("Login successful!")
   * } catch (error) {
   *   console.error("Login failed:", error.message)
   * }
   * ```
   */
  login: async (email: string, password: string) => {
    const { data, status, error } = await apiClient.post(
      "/api/auth/login",
      { email, password },
      LoginResponseSchema,
    )

    if (status !== StatusCodes.CREATED || !data || error || data.error) {
      throw new Error(error?.message || data?.error || "Login failed")
    }
    return data
  },

  /**
   * Logs out the current user.
   *
   * This method clears the authentication cookie on the backend.
   *
   * @example
   * ```typescript
   * try {
   *   await AuthService.logout()
   *   console.log("Logged out successfully")
   * } catch (error) {
   *   console.error("Logout failed:", error.message)
   * }
   * ```
   */
  logout: async () => {
    const { status, error } = await apiClient.post("/api/auth/logout", {}, z.object({}))
    if (status !== StatusCodes.OK) {
      throw new Error(error?.message || "Logout failed")
    }
  },

  /**
   * Gets user information from a JWT token by making a request to the backend.
   *
   * @param token The JWT token to get user info for.
   * @returns The user information or null if token is invalid.
   */
  getUserFromToken: async (token: string): Promise<User | null> => {
    try {
      const { data, status, error } = await apiClient.get("/api/me", GetUserResponseSchema, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (status !== StatusCodes.OK || !data || error) return null
      return data.data ?? null
    } catch (error) {
      console.error("getUserFromToken error:", error)
      return null
    }
  },
} as const

export default AuthService
