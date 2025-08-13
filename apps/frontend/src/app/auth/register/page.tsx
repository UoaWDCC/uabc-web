import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { RegisterSection } from "@/components/client/auth/RegisterSection"

export const metadata: Metadata = {
  title: "Register",
  description: "Register an account",
}

export default function Register() {
  return (
    <VStack as="main">
      <RegisterSection />
    </VStack>
  )
}
