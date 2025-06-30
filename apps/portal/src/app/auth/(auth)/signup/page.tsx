import { Center, Text, Link as UILink, VStack } from "@yamada-ui/react"
import Link from "next/link"

import { BreakLine } from "@/components/Composite/auth/BreakLine"
import { EmailSignUpForm } from "@/components/Composite/auth/EmailSignUpForm"
import { GoogleLoginButton } from "@/components/Composite/auth/GoogleLoginButton"

export const metadata = {
  title: "Sign Up - UABC Booking Portal",
}

export default async function SignUpPage() {
  return (
    <VStack>
      <EmailSignUpForm />

      <BreakLine label="OR" />

      <GoogleLoginButton />

      <Center fontSize="xs">
        <Text color="tertiary">
          Already have an account?&nbsp;
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
