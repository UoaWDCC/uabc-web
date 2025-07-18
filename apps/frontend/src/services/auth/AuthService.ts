import { LoginResponseSchema } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
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
    const { data, error, status } = await apiClient.post(
      "api/auth/login",
      { email, password },
      LoginResponseSchema,
    )
    if (status !== StatusCodes.OK) throw error
    return data
  },
} as const

export default AuthService
