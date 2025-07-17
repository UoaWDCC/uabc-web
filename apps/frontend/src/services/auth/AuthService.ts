import { UserSchema } from "@repo/shared/schemas/auth"
import { StatusCodes } from "http-status-codes"
import { apiClient } from "@/lib/api/client"

const AuthService = {
  /**
   * Fetches the current authenticated user.
   *
   * @returns The current user or null if not authenticated.
   */
  getMe: async () => {
    const { data, status } = await apiClient.get("/api/me", UserSchema)
    if (status !== StatusCodes.OK) return null
    return data
  },
  /**
   * Logs in a user with email and password.
   *
   * @param email The user's email.
   * @param password The user's password.
   * @returns The authenticated user.
   */
  login: async (email: string, password: string) => {
    const { data, status, error } = await apiClient.post(
      "/api/auth/login",
      { email, password },
      UserSchema,
    )
    if (status !== StatusCodes.CREATED) throw error || new Error("Login failed")
    return data
  },
  /**
   * Logs out the current user.
   *
   * @returns void
   */
  logout: async () => {
    const { status, error } = await apiClient.post("/api/auth/logout", undefined, undefined)
    if (status !== StatusCodes.OK) throw error || new Error("Logout failed")
  },
} as const

export default AuthService
