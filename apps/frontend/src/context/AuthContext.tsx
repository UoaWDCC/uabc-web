"use client"

import type { LoginFormData, RegisterRequestBody } from "@repo/shared"
import { AUTH_COOKIE_NAME } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import type { AuthActions, AuthContextValue, AuthState } from "@repo/shared/types/auth"
import { noticeOptions } from "@repo/theme"
import { useLocalStorage } from "@repo/ui/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNotice } from "@yamada-ui/react"
import { StatusCodes } from "http-status-codes"
import { createContext, type ReactNode, useCallback, useContext } from "react"
import { ApiClientError } from "@/lib/api/ApiClientError"
import { QueryKeys } from "@/services"
import AuthService from "@/services/auth/AuthService"

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
  const notice = useNotice(noticeOptions)
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    isPending,
    error,
  } = useQuery<User | null, Error, User | null>({
    queryKey: [QueryKeys.AUTH, QueryKeys.ME],
    queryFn: async (): Promise<User | null> => {
      if (!token) {
        return null
      }
      try {
        const response = await AuthService.getUserInfo(token)
        return response.data
      } catch (err) {
        if (err instanceof ApiClientError && err.status === StatusCodes.UNAUTHORIZED) {
          setToken(null)
          return null
        }
        throw err
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: isAvailable && !!token,
  })

  const login = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      // Remove queries and reset token to avoid potential conflicts during login
      setToken(null)
      queryClient.cancelQueries({ queryKey: [QueryKeys.AUTH, QueryKeys.ME] })
      queryClient.removeQueries({ queryKey: [QueryKeys.AUTH, QueryKeys.ME] })

      const response = await AuthService.login(credentials.email, credentials.password)

      return response
    },
    onSettled: (response) => {
      if (response?.data) {
        setToken(response?.data)
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

  const logout = useCallback(() => {
    setToken(null)
    queryClient.cancelQueries({ queryKey: [QueryKeys.AUTH, QueryKeys.ME] })
    queryClient.removeQueries({ queryKey: [QueryKeys.AUTH, QueryKeys.ME] })

    notice({
      title: "Logged out",
      description: "You have been logged out successfully.",
      status: "success",
    })
  }, [setToken, notice, queryClient])

  const authState: AuthState = {
    user: token ? (user ?? null) : null,
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
    setToken,
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
