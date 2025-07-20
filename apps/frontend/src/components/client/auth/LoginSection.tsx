"use client"

import type { LoginFormData, LoginResponse } from "@repo/shared"
import { LoginPanel } from "@repo/ui/components/Generic"
import { useNotice } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export const LoginSection = () => {
  const { login } = useAuth()
  const router = useRouter()
  const notice = useNotice()

  const handleLogin = async (data: LoginFormData): Promise<LoginResponse> => {
    try {
      const response = await login.mutateAsync(data)

      if (response.success && response.data?.data) {
        notice({
          title: "Login successful",
          description: "You are now logged in",
          status: "success",
        })
        router.push("/profile")
        return response.data
      }
      const errorMessage = response.success
        ? response.data?.error
        : response.error?.message || "Login failed"
      notice({
        title: "Login failed",
        description: errorMessage,
        status: "error",
      })
      return { error: errorMessage }
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
