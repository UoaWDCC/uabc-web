import type { LoginDetails } from "@repo/shared"
import AuthService from "./AuthService"

/**
 * Authentication request response
 */
export type AuthResponse = {
  /**
   * The authentication token.
   */
  token?: string
  /**
   * The error message.
   */
  error?: string
}

/**
 * Handles the login process by calling the AuthService.login method.
 *
 * @param data The login details.
 * @returns The authentication response.
 */
export async function handleLogin(data: LoginDetails): Promise<AuthResponse> {
  try {
    const response = await AuthService.login(data.email, data.password)
    return { token: response?.data }
  } catch (error) {
    return { error: error as string }
  }
}
