"use client"

import type { LoginFormData } from "@repo/shared"
import { AUTH_COOKIE_NAME } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import {
  type UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useNotice } from "@yamada-ui/react"
import { createContext, type ReactNode, useContext } from "react"
import type { ApiResponse } from "@/lib/api/client"
import { useLocalStorage } from "@/lib/storage"
import AuthService from "@/services/auth/AuthService"

type AuthState = {
  user: User | null
  isLoading: boolean
  isPending: boolean
  error: string | null
}

type AuthActions = {
  login: UseMutationResult<
    ApiResponse<{
      message?: string | undefined
      data?: string | undefined
      error?: string | undefined
    }>,
    Error,
    {
      email: string
      password: string
      rememberMe: boolean
    },
    unknown
  >
  emailVerificationCode: UseMutationResult<
    ApiResponse<{
      error?: string | undefined
      message?: string | undefined
    }>,
    Error,
    string,
    unknown
  >
}

type AuthContextValue = AuthState & AuthActions

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Authentication context provider that manages user authentication state
 * and provides login/logout functionality using React Query for data fetching
 * and mutations.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { value: token, setValue: setToken } = useLocalStorage<string>(AUTH_COOKIE_NAME)
  const queryClient = useQueryClient()
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
      return await AuthService.getUserFromToken(token)
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  const login = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      return await AuthService.login(credentials.email, credentials.password)
    },
    onSuccess: async (data) => {
      if (data.success && data.data?.data) {
        setToken(data.data.data)
        queryClient.removeQueries({ queryKey: ["auth", "me"] })
      } else {
        throw new Error(data.success ? data.data?.error : data.error?.message || "Login failed")
      }
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
    onSuccess: async (data) => {
      if (data.success) {
        notice({
          title: "Email Verification Code Sent",
          description: "Please check your email for the verification code.",
          status: "success",
        })
      } else {
        throw new Error(data.error ? data.error?.message : "Email Verification Code Failed")
      }
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
  }

  const authActions: AuthActions = {
    login,
    emailVerificationCode,
  }

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
