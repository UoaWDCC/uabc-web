import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginSection } from "@/components/client/auth/LoginSection"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function Login() {
  return (
    <VStack as="main">
      <Suspense>
        <LoginSection />
      </Suspense>
    </VStack>
  )
}
