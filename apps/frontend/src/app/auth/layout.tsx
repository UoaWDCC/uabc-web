import type React from "react"
import { GuestOnly } from "@/context/RoleWrappers"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestOnly>{children}</GuestOnly>
}
