import Link from 'next/link'

import { BreakLine } from '@/components/Composite/auth/BreakLine'
import { EmailSignUpForm } from '@/components/Composite/auth/EmailSignUpForm'
import { GoogleLoginButton } from '@/components/Composite/auth/GoogleLoginButton'

export const metadata = {
  title: 'Sign Up - UABC Booking Portal',
}

export default async function SignUpPage() {
  return (
    <div className="mt-8 flex w-full flex-col gap-4">
      <EmailSignUpForm />
      <BreakLine label="or" />
      <GoogleLoginButton />
      <p className="mt-2 text-center text-xs text-tertiary dark:text-white">
        Already have an account?{' '}
        <Link className="font-bold underline" href="/auth/login?open=true">
          Log in
        </Link>
      </p>
    </div>
  )
}
