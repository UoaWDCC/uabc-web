"use client"

import { LoginPanel } from "@repo/ui/components/Generic"
import { Container } from "@yamada-ui/react"
import { handleLogin } from "@/services/auth/AuthHandlers"

export default function LoginInner() {
  return (
    <Container as="main" centerContent>
      <LoginPanel
        googleHref={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
        onSubmit={handleLogin}
      />
    </Container>
  )
}
