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

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isPending: boolean
  error: string | null
  login: UseMutationResult<
    {
      message?: string | undefined
      data?: string | undefined
      error?: string | undefined
    },
    Error,
    {
      email: string
      password: string
      rememberMe: boolean
    },
    unknown
  >
  logout: UseMutationResult<void, Error, void, unknown>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = useSyncExternalStore(tokenStore.subscribe, tokenStore.getSnapshot, () => null)
  const setToken = tokenStore.setToken

  const queryClient = useQueryClient()

  const { data, isLoading, error, isPending } = useQuery<User | null, Error>({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<User | null> => {
      if (token) {
        return await AuthService.getUserFromToken(token)
      }
      return null
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    enabled: !!token,
  })

  const login = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) => {
      return await AuthService.login(email, password)
    },
    onSuccess: async (data) => {
      if (data.data) {
        setToken(data.data)
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      } else {
        throw new Error(data.error)
      }
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const logout = useMutation({
    mutationFn: async () => {
      return await AuthService.logout()
    },
    onSuccess: async () => {
      setToken(null)
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const isActuallyLoading = isLoading && !!token
  const isActuallyPending = isPending && !!token

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        isLoading: isActuallyLoading,
        isPending: isActuallyPending,
        error: error ? error.message : null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
