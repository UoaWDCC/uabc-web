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
    return { data: response?.data, message: response?.message, error: response?.error }
  } catch (error) {
    return { error: String(error) }
  }
}
