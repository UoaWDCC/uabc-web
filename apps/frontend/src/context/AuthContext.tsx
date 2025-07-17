"use client"

import type { User } from "@repo/shared/payload-types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, type ReactNode, useCallback, useContext } from "react"
import AuthService from "@/services/auth/AuthService"

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  loginLoading: boolean
  logoutLoading: boolean
  loginError: string | null
  logoutError: string | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery<User | null, Error>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      return await AuthService.getMe()
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const {
    mutateAsync: login,
    isLoading: loginLoading,
    error: loginErrorObj,
  } = useMutation<void, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      await AuthService.login(email, password)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  const {
    mutateAsync: logout,
    isLoading: logoutLoading,
    error: logoutErrorObj,
  } = useMutation<void, Error>({
    mutationFn: async () => {
      await AuthService.logout()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  const loginHandler = useCallback(
    async (email: string, password: string) => {
      await login({ email, password })
    },
    [login],
  )

  const logoutHandler = useCallback(async () => {
    await logout()
  }, [logout])

  const refresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        loading: isLoading,
        error: error ? error.message : null,
        login: loginHandler,
        logout: logoutHandler,
        refresh,
        loginLoading,
        logoutLoading,
        loginError: loginErrorObj ? loginErrorObj.message : null,
        logoutError: logoutErrorObj ? logoutErrorObj.message : null,
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
