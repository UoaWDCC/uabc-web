"use client"

import { QueryProvider, UIProvider } from "@repo/ui/components/Provider"
import type { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <UIProvider>{children}</UIProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
