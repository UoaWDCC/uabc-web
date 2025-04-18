import Link from 'next/link'

import { BreakLine } from '@/components/Composite/auth/BreakLine'
import { ForgotPasswordForm } from '@/components/Composite/auth/ForgotPasswordForm'
import { GoogleLoginButton } from '@/components/Composite/auth/GoogleLoginButton'

export const metadata = {
  title: 'Forgot Password - UABC Booking Portal',
}

export default async function ForgotPasswordPage() {
  return (
    <div className="mt-8 flex w-full flex-col gap-4">
      <ForgotPasswordForm />
      <BreakLine label="or" />
      <GoogleLoginButton />
      <p className="mt-2 text-center text-xs text-tertiary dark:text-white">
        Back to{' '}
        <Link className="font-bold underline" href="/auth/login?open=true">
          Login
        </Link>
      </p>
    </div>
  )
}
