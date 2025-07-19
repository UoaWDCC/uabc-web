"use client"

import type { LoginFormData } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import {
  type UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { createContext, type ReactNode, useContext, useSyncExternalStore } from "react"
import { tokenStore } from "@/lib/token-store"
import AuthService from "@/services/auth/AuthService"

type AuthState = {
  user: User | null
  isLoading: boolean
  isPending: boolean
  error: string | null
}

type AuthActions = {
  login: UseMutationResult<
    {
      message?: string | undefined
      data?: string | undefined
      error?: string | undefined
    },
    Error,
    LoginFormData,
    unknown
  >
  logout: UseMutationResult<void, Error, void, unknown>
}

type AuthContextValue = AuthState & AuthActions

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Authentication context provider that manages user authentication state
 * and provides login/logout functionality using React Query for data fetching
 * and mutations.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = useSyncExternalStore(tokenStore.subscribe, tokenStore.getSnapshot, () => null)
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null, Error>({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<User | null> => {
      if (!token) {
        return null
      }
      return await AuthService.getUserFromToken(token)
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    enabled: !!token,
  })

  const login = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      return await AuthService.login(credentials.email, credentials.password)
    },
    onSuccess: async (data) => {
      if (data.data) {
        tokenStore.setToken(data.data)
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      } else {
        throw new Error(data.error || "Login failed")
      }
    },
    onError: (error) => {
      console.error("Login error:", error)
    },
  })

  const logout = useMutation({
    mutationFn: async () => {
      return await AuthService.logout()
    },
    onSuccess: async () => {
      tokenStore.setToken(null)
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
    onError: (error) => {
      console.error("Logout error:", error)
    },
  })

  const authState: AuthState = {
    user: user ?? null,
    isLoading: typeof window === "undefined" || (isLoading && !!token),
    isPending: login.isPending || logout.isPending,
    error: error ? error.message : null,
  }

  const authActions: AuthActions = {
    login,
    logout,
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
