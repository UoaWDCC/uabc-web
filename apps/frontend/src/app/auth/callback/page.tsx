"use client"

import { Center, Loading, Text, useNotice, VStack } from "@yamada-ui/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { useAuth } from "@/context/AuthContext"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { googleCallback } = useAuth()
  const notice = useNotice()
  const [hasProcessed, setHasProcessed] = useState(false)

  const token = searchParams.get("token")

  const handleAuthCallback = useCallback(async () => {
    if (hasProcessed || googleCallback.isPending) {
      return
    }

    try {
      if (!token) {
        notice({
          title: "Authentication error",
          description: "No authentication token found",
          status: "error",
        })
        router.push("/auth/login")
        return
      }

      setHasProcessed(true)

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.delete("token")
        window.history.replaceState({}, "", url.toString())
      }

      const result = await googleCallback.mutateAsync(token)

      if (result.data) {
        notice({
          title: "Login successful",
          description: "Welcome!",
          status: "success",
        })
        router.push("/profile")
      } else {
        notice({
          title: "Authentication failed",
          description: result.error || "Failed to authenticate with Google",
          status: "error",
        })
        router.push("/auth/login")
      }
    } catch {
      router.push("/auth/login")
    }
  }, [token, hasProcessed, googleCallback, notice, router])

  useEffect(() => {
    handleAuthCallback()
  }, [handleAuthCallback])

  // const handleLogin = async (data: LoginFormData): Promise<LoginResponse> => {
  //   try {
  //     const response = await login.mutateAsync(data)

  //     if (response.data) {
  //       notice({
  //         title: "Login successful",
  //         description: "You are now logged in",
  //         status: "success",
  //       })
  //       router.push("/profile")
  //       return response
  //     }
  //     const errorMessage = response.error || "Login failed"
  //     notice({
  //       title: "Login failed",
  //       description: errorMessage,
  //       status: "error",
  //     })
  //     return { error: errorMessage }
  //   } catch (error) {
  //     return {
  //       error: error instanceof Error ? error.message : "Login failed",
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (!isLoading && !isPending && user) {
  //     router.push("/profile")
  //   }
  // }, [isLoading, isPending, user, router])

  return (
    <Center as={VStack} gap="lg" layerStyle="container">
      <Loading fontSize="5xl" />
      <Text>Redirecting...</Text>
    </Center>
  )
}
