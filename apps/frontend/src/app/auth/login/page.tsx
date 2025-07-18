import type { Metadata } from "next"
import LoginInner from "./LoginInner"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function Login() {
  return <LoginInner />
}
