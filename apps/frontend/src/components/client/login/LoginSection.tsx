"use client"

import type { LoginFormData, LoginResponse } from "@repo/shared"
import { LoginPanel } from "@repo/ui/components/Generic"
import { useQueryClient } from "@tanstack/react-query"
import { useNotice } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export const LoginSection = () => {
  const { login } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const notice = useNotice()

  const handleLogin = async (data: LoginFormData): Promise<LoginResponse> => {
    try {
      const response = await login.mutateAsync(data)

      if (response.data) {
        notice({
          title: "Login successful",
          description: "You are now logged in",
          status: "success",
        })
        await queryClient.prefetchQuery({ queryKey: ["auth", "me"] })
        router.push("/user")
      } else {
        notice({
          title: "Login failed",
          description: response.error,
          status: "error",
        })
      }
      return response
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  return (
    <LoginPanel
      errorMessage={login.error ? login.error.message : undefined}
      googleHref={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
      isLoading={login.isPending}
      onSubmit={handleLogin}
    />
  )
}
