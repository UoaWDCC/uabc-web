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

  return (
    <Center as={VStack} gap="lg" layerStyle="container">
      <Loading fontSize="5xl" />
      <Text>Redirecting...</Text>
    </Center>
  )
}
