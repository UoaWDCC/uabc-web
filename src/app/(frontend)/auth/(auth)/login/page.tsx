import { Suspense } from 'react'
import Link from 'next/link'

import { BreakLine } from '@/components/auth/BreakLine'
import { EmailLoginForm } from '@/components/auth/EmailLoginForm'
import { GoogleSignIn } from '@/components/auth/GoogleLoginButton'
import { Center, HStack, Separator, Link as UILink, VStack } from '@yamada-ui/react'

export const metadata = {
  title: 'Login - UABC Booking Portal',
}

export default async function LoginPage() {
  return (
    <VStack>
      <Suspense>
        <EmailLoginForm />
      </Suspense>
      <BreakLine label="or" />
      <GoogleSignIn />
      <Center fontSize="x-small">
        <HStack gap={2} separator={<Separator orientation="vertical" height="8xs" />}>
          <UILink as={Link} href="/auth/signup" color="tertiary" fontWeight="bold">
            Create Account
          </UILink>

          <UILink as={Link} href="/auth/forgot-password" color="tertiary" fontWeight="bold">
            Forgot Password?
          </UILink>
        </HStack>
      </Center>
    </VStack>
  )
}
