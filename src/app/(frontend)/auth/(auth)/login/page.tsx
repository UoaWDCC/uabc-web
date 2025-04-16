'use client'

import { Suspense } from 'react'
import Link from 'next/link'

import { BreakLine } from '@/components/auth/BreakLine'
import { EmailLoginForm } from '@/components/auth/EmailLoginForm'
import { GoogleSignIn } from '@/components/auth/GoogleLoginButton'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const verifyToken = async () => {
      const { code, state } = router.query

      if (!code || !state) {
        // display auth error msg in page
        return console.error('Missing code or state in callback URL')
      }

      try {
        const response = await fetch(`/api/auth/google/callback?code=${code}&state=${state}`)
        const res = await response.json()

        if (!res.token) {
          // display auth error msg in page
          return console.error('Missing token in response')
        }

        router.push('/')
      } catch (error) {
        // display auth error msg in page
        console.error('Error during authentication:', error)
      }
    }

    verifyToken()
  }, [router])

  return (
    <div className="mt-8 flex w-full flex-col gap-4">
      <Suspense>
        <EmailLoginForm />
      </Suspense>
      <BreakLine label="or" />
      <GoogleSignIn className="w-full" />
      <p className="mt-2 text-center text-xs text-tertiary">
        <Link className="text-left font-bold underline" href="/auth/signup">
          Create Account
        </Link>
        <span className="pointer-events-none mx-1">|</span>
        <Link className="text-right font-bold underline" href="/auth/forgot-password">
          Forgot Password?
        </Link>
      </p>
    </div>
  )
}
