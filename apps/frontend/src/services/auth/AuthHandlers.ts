"use client"

import type { LoginFormData, LoginResponse } from "@repo/shared"
import AuthService from "./AuthService"

/**
 * Handles the login process by calling the AuthService.login method.
 *
 * @param data The login details.
 * @returns The authentication response.
 */
export async function handleLogin(loginDetails: LoginFormData): Promise<LoginResponse> {
  try {
    const response = await AuthService.login(loginDetails.email, loginDetails.password)
    if (!response.success) {
      return { error: response.error.message }
    }
    return {
      data: response.data.data,
      message: response.data.message,
      error: response.data.error,
    }
  } catch (error) {
    return { error: String(error) }
  }
}
