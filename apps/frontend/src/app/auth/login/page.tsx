import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { LoginSection } from "@/components/client/auth/LoginSection"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function Login() {
  return (
    <VStack alignItems="center" layerStyle="wrapper">
      <LoginSection />
    </VStack>
  )
}
