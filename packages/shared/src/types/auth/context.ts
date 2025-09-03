import type { User } from "@repo/shared/payload-types"
import type { UseMutationResult } from "@tanstack/react-query"

export type AuthState = {
  user: User | null
  isLoading: boolean
  isPending: boolean
  error: string | null
  token: string | null
  isAvailable: boolean
}

export type AuthActions = {
  login: UseMutationResult<
    {
      data?: string | undefined
      error?: string | undefined
      message?: string | undefined
    },
    Error,
    {
      email: string
      password: string
      rememberMe: boolean
    },
    unknown
  >
  emailVerificationCode: UseMutationResult<
    {
      error?: string | undefined
      message?: string | undefined
    },
    Error,
    string,
    unknown
  >
  register: UseMutationResult<
    {
      message?: string | undefined
      error?: string | undefined
    },
    Error,
    {
      email: string
      password: string
      emailVerificationCode: string
    },
    unknown
  >
  setToken: (token: string | null) => void
  logout: () => void
}

export type AuthContextValue = AuthState & AuthActions

export type AuthContextValueWithUser = AuthContextValue & {
  user: NonNullable<AuthContextValue["user"]>
}
