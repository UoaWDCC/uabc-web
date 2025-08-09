"use client"
import type { MembershipType } from "@repo/shared"
import { useUpdateEffect } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { type ReactNode, useMemo } from "react"
import { type AuthContextValue, useAuth } from "./AuthContext"

export type AuthContextValueWithUser = AuthContextValue & {
  user: NonNullable<AuthContextValue["user"]>
}

export type RoleGuardProps = {
  /**
   * The scope of the role guard.
   * @example ["Member", "Casual"]
   * @example ["Admin"]
   * @example ["Member", "Casual", "Admin"]
   * @defaultValue ["Member", "Casual", "Admin"]
   */
  scope?: Array<`${MembershipType}`>
  /**
   * The children of the role guard.
   * @example <RoleGuard scope={["Member", "Casual"]}>
   *   {(auth) => <div>Hello {auth.user.name}</div>}
   * </RoleGuard>
   */
  children: (auth: AuthContextValueWithUser, loading?: ReactNode) => ReactNode
  /**
   * The fallback of the role guard.
   * @example <RoleGuard scope={["Member", "Casual"]}>
   *   {(auth) => <div>Hello {auth.user.name}</div>}
   * </RoleGuard>
   */
  fallback?: ReactNode
  /**
   * The loading of the role guard.
   */
  loading?: ReactNode
}

export const RoleGuard = ({
  scope = ["Member", "Casual", "Admin"],
  children,
  fallback = null,
  loading = null,
}: RoleGuardProps) => {
  const auth = useAuth()
  const scopeSet = useMemo(() => new Set(scope), [scope])

  if (auth.isLoading || !auth.isAvailable) {
    return loading
  }

  if (auth.token && auth.user && scopeSet.has(auth.user.role)) {
    return children(auth as AuthContextValueWithUser)
  }

  return fallback
}

export type GuestOnlyProps = {
  children: ReactNode
}

export const GuestOnly = ({ children }: GuestOnlyProps) => {
  const auth = useAuth()
  const router = useRouter()

  const shouldRedirect = useMemo(() => {
    return auth.isLoading || !auth.isAvailable || !auth.token || !auth.user
  }, [auth.isLoading, auth.isAvailable, auth.token, auth.user])

  useUpdateEffect(() => {
    if (shouldRedirect) {
      return
    }

    router.replace("/profile")
  }, [shouldRedirect, router])

  return children
}
