import { LoginPanel } from "@repo/ui/components/Generic"
import type { Metadata } from "next"
import { handleLogin } from "@/services/auth/AuthHandlers"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function Login() {
  return (
    <LoginPanel
      googleHref={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
      onSubmit={handleLogin}
    />
  )
}
