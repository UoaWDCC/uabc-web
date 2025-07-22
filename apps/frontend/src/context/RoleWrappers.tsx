"use client"
import { MembershipType } from "@repo/shared"
import type { ReactNode } from "react"
import { type AuthContextValue, useAuth } from "./AuthContext"

export type RoleWrapperProps = {
  children: (auth: AuthContextValue, loading?: ReactNode) => ReactNode
  fallback?: ReactNode
  loading?: ReactNode
}

export const Authenticated = ({ children, fallback = null, loading = null }: RoleWrapperProps) => {
  const auth = useAuth()
  if (auth.isLoading || !auth.isAvailable) {
    return children(auth, loading)
  }
  if (auth.user) {
    return children(auth)
  }
  return fallback
}

export const UnAuthenticated = ({
  children,
  fallback = null,
  loading = null,
}: RoleWrapperProps) => {
  const auth = useAuth()
  if (auth.isLoading || !auth.isAvailable) {
    return children(auth, loading)
  }
  if (!auth.user) {
    return children(auth)
  }
  return fallback
}

export const Admin = ({ children, fallback = null, loading = null }: RoleWrapperProps) => {
  const auth = useAuth()
  if (auth.isLoading || !auth.isAvailable) {
    return children(auth, loading)
  }
  if (auth.user && auth.user.role === MembershipType.admin) {
    return children(auth)
  }
  return fallback
}

export const Member = ({ children, fallback = null, loading = null }: RoleWrapperProps) => {
  const auth = useAuth()
  if (auth.isLoading || !auth.isAvailable) {
    return children(auth, loading)
  }
  if (auth.user && auth.user.role === MembershipType.member) {
    return children(auth)
  }
  return fallback
}

export const Casual = ({ children, fallback = null, loading = null }: RoleWrapperProps) => {
  const auth = useAuth()
  if (auth.isLoading || !auth.isAvailable) {
    return children(auth, loading)
  }
  if (auth.user && auth.user.role === MembershipType.casual) {
    return children(auth)
  }
  return fallback
}
