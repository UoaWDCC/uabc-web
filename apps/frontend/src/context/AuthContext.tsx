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
      console.error("Login error:", error)
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
