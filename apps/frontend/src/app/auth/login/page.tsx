"use client"
import { LoginPanel } from "@repo/ui/components/Generic"
import { Container } from "@yamada-ui/react"
import { handleLogin } from "@/services/auth/AuthHandlers"

// export const metadata: Metadata = {
//   title: "Login",
//   description: "Login to your account",
// }

export default function login() {
  return (
    <Container as="main" centerContent>
      <LoginPanel
        onClickGoogle={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
        onSubmit={handleLogin}
      />
    </Container>
  )
}
