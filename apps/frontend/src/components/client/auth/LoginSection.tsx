"use client"

import type { LoginFormData, LoginResponse } from "@repo/shared"
import { LoginPanel } from "@repo/ui/components/Generic"
import { useAuthNavigation } from "@repo/ui/hooks"
import { Container, useNotice } from "@yamada-ui/react"
import { useAuth } from "@/context/AuthContext"

export const LoginSection = () => {
  const { login } = useAuth()
  const notice = useNotice()

  const { navigateToReturnUrl } = useAuthNavigation({
    defaultRedirectUrl: "/profile",
    autoRedirect: false,
  })

  const handleLogin = async (data: LoginFormData): Promise<LoginResponse> => {
    try {
      const response = await login.mutateAsync(data)

      if (response.data) {
        notice({
          title: "Login successful",
          description: "You are now logged in",
          status: "success",
        })

        // Navigate to return URL or default profile page
        navigateToReturnUrl()
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
