import Link from 'next/link'
import { Center, Link as UILink, Text, VStack } from '@yamada-ui/react'

import { BreakLine } from '@/components/auth/BreakLine'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'

export const metadata = {
  title: 'Forgot Password - UABC Booking Portal',
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
            href="/auth/login?open=true"
            color={['tertiary', 'white']}
            fontWeight="bold"
          >
            Login
          </UILink>
        </Text>
      </Center>
    </VStack>
  )
}
