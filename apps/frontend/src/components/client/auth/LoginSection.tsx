"use client"

import type { LoginFormData, LoginResponse } from "@repo/shared"
import { LoginPanel } from "@repo/ui/components/Generic"
import { Container, useNotice } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

export const LoginSection = () => {
  const { login, isLoading, isPending, user } = useAuth()
  const router = useRouter()
  const notice = useNotice()

  // useEffect is necessary here to ensure navigation (router.push) only occurs after render,
  // not during render. React does not allow side effects like navigation during render phase.
  // This follows React and Next.js best practices for safe, predictable navigation after login.
  useEffect(() => {
    if (!isLoading && !isPending && user) {
      router.push("/profile")
    }
  }, [isLoading, isPending, user, router])

  const handleLogin = async (data: LoginFormData): Promise<LoginResponse> => {
    try {
      const response = await login.mutateAsync(data)

      if (response.data) {
        notice({
          title: "Login successful",
          description: "You are now logged in",
          status: "success",
        })
        router.push("/profile")
        return response
      }
      const errorMessage = response.error || "Login failed"
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
    <Container centerContent layerStyle="container">
      <LoginPanel
        errorMessage={login.error ? login.error.message : undefined}
        googleHref={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
        isLoading={login.isPending}
        onSubmit={handleLogin}
      />
    </Container>
  )
}
