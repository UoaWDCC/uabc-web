import { Center, HStack, Separator, Link as UILink, VStack } from "@yamada-ui/react"
import Link from "next/link"
import { Suspense } from "react"

import { BreakLine } from "@/components/Composite/auth/BreakLine"
import { EmailLoginForm } from "@/components/Composite/auth/EmailLoginForm"
import { GoogleLoginButton } from "@/components/Composite/auth/GoogleLoginButton"

export const metadata = {
  title: "Login - UABC Booking Portal",
}

export default function LoginPage() {
  return (
    <VStack>
      <Suspense>
        <EmailLoginForm />
      </Suspense>

      <BreakLine label="OR" />

      <GoogleLoginButton />

      <Center fontSize="xs">
        <HStack gap={2} separator={<Separator height="8xs" orientation="vertical" />}>
          <UILink as={Link} color="tertiary" fontWeight="bold" href="/auth/signup">
            Create Account
          </UILink>
          <UILink as={Link} color="tertiary" fontWeight="bold" href="/auth/forgot-password">
            Forgot Password?
          </UILink>
        </HStack>
      </Center>
    </VStack>
  )
}
