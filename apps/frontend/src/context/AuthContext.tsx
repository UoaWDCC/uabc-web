"use client"

import type { LoginFormData, RegisterRequestBody } from "@repo/shared"
import { AUTH_COOKIE_NAME } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { useLocalStorage } from "@repo/ui/hooks"
import { type UseMutationResult, useMutation, useQuery } from "@tanstack/react-query"
import { useNotice, useUpdateEffect } from "@yamada-ui/react"
import { createContext, type ReactNode, useContext } from "react"
import AuthService from "@/services/auth/AuthService"

type AuthState = {
  user: User | null
  isLoading: boolean
  isPending: boolean
  error: string | null
  token: string | null
  isAvailable: boolean
}

type AuthActions = {
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
}

export type AuthContextValue = AuthState & AuthActions

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Authentication context provider that manages user authentication state
 * and provides login/logout functionality using React Query for data fetching
 * and mutations.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    value: token,
    setValue: setToken,
    isAvailable,
  } = useLocalStorage<string>(AUTH_COOKIE_NAME)
  const notice = useNotice()

  const {
    data: user,
    isLoading,
    isPending,
    error,
  } = useQuery<User | null, Error>({
    queryKey: ["auth", "me", token],
    queryFn: async (): Promise<User | null> => {
      if (!token) {
        return null
      }
      const response = await AuthService.getUserFromToken(token)
      return response.data
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: isAvailable && !!token,
  })

  const login = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await AuthService.login(credentials.email, credentials.password)
      if (response.data) {
        setToken(response.data)
      }
      return response
    },
    onError: (error) => {
      notice({
        title: "Login failed",
        description: error.message,
        status: "error",
      })
    },
  })

  const emailVerificationCode = useMutation({
    mutationFn: async (email: string) => {
      return await AuthService.sendEmailVerificationCode(email)
    },
    onError: (error) => {
      notice({
        title: "Email Verification Code Failed",
        description: error.message,
        status: "error",
      })
    },
  })

  const register = useMutation({
    mutationFn: async (data: RegisterRequestBody) => {
      return await AuthService.register(data.email, data.password, data.emailVerificationCode)
    },
    onError: (error) => {
      notice({
        title: "Email Verification Code Failed",
        description: error.message,
        status: "error",
      })
    },
  })

  const authState: AuthState = {
    user: user ?? null,
    isLoading: isLoading || login.isPending,
    isPending: isPending || login.isPending,
    error: error ? error.message : null,
    token: token ?? null,
    isAvailable,
  }

  const authActions: AuthActions = {
    login,
    emailVerificationCode,
    register,
  }

  useUpdateEffect(() => {
    if (!isLoading && token && !user && isAvailable) {
      setToken(null)
    }
  }, [isLoading, token, user, setToken, isAvailable])

  return (
    <AuthContext.Provider value={{ ...authState, ...authActions }}>{children}</AuthContext.Provider>
  )
}

/**
 * Hook to access authentication context
 * @returns Authentication context value with user state and login/logout actions
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
