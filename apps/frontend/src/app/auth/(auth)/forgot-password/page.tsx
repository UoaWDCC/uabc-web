import { Center, Text, Link as UILink, VStack } from "@yamada-ui/react"
import Link from "next/link"

import { BreakLine } from "@/components/Composite/auth/BreakLine"
import { ForgotPasswordForm } from "@/components/Composite/auth/ForgotPasswordForm"
import { GoogleLoginButton } from "@/components/Composite/auth/GoogleLoginButton"

export const metadata = {
  title: "Forgot Password - UABC Booking Portal",
}

export default async function ForgotPasswordPage() {
  return (
    <VStack>
      <ForgotPasswordForm />

      <BreakLine label="OR" />

      <GoogleLoginButton />

      <Center fontSize="xs">
        <Text color="tertiary">
          Back to&nbsp;
          <UILink
            as={Link}
            color={["tertiary", "white"]}
            fontWeight="bold"
            href="/auth/login?open=true"
          >
            Login
          </UILink>
        </Text>
      </Center>
    </VStack>
  )
}
