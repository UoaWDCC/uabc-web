import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { RegisterSection } from "@/components/client/auth/RegisterSection"

export const metadata: Metadata = {
  title: "Register",
  description: "Register an account",
}

export default function Login() {
  return (
    <VStack alignItems="center" layerStyle="wrapper">
      <Suspense>
        <RegisterSection />
      </Suspense>
    </VStack>
  )
}
