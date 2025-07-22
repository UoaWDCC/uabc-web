import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { LoginSection } from "@/components/client/auth/LoginSection"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function Login() {
  return (
    <AuthWrapper fallbackUrl="/profile" scopes={["admin", "casual", "member"]}>
      <VStack as="main">
        <LoginSection />
      </VStack>
    </AuthWrapper>
  )
}
