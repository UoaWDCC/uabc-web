"use client"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useAuth } from "@/context/AuthContext"

export interface AuthWrapperProps {
  children: ReactNode
  scopes?: string[]
  fallbackUrl?: string
}

export const AuthWrapper = ({
  children,
  scopes,
  fallbackUrl = "/auth/login",
}: AuthWrapperProps) => {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  if (user && scopes?.includes(user.role)) return <>{children}</>
  router.push(fallbackUrl)
  return null
}
