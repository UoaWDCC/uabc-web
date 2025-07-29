"use client"

import { Center, Loading, Text, useNotice, VStack } from "@yamada-ui/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import AuthService from "@/services/auth/AuthService"

export const CallbackSection = () => {
  const router = useRouter()
  const { setToken } = useAuth()
  const searchParams = useSearchParams()
  const notice = useNotice()
  const [hasProcessed, setHasProcessed] = useState(false)

  const token = searchParams.get("token")

  const handleAuthCallback = useCallback(async () => {
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

      // Clear the token from the URL to prevent storing it in the browser history
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.delete("token")
        window.history.replaceState({}, "", url.toString())
      }

      const response = await AuthService.getUserFromToken(token)

      if (response.data) {
        setToken(token)
        notice({
          title: "Login successful",
          description: "Welcome!",
          status: "success",
        })
        router.push("/profile")
      } else {
        router.push("/auth/login")
      }
    } catch {
      notice({
        title: "Authentication failed",
        description: "Failed to authenticate with Google",
        status: "error",
      })
      router.push("/auth/login")
    }
  }, [token, setToken, notice, router])

  useEffect(() => {
    if (!hasProcessed) {
      handleAuthCallback()
    }
  }, [handleAuthCallback, hasProcessed])

  return (
    <Center as={VStack} gap="lg" layerStyle="container">
      <Loading fontSize="5xl" />
      <Text>Redirecting...</Text>
    </Center>
  )
}
