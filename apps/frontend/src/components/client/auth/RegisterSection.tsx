"use client"

import type { RegisterFormData } from "@repo/shared/types"
import { RegisterPanel } from "@repo/ui/components/Generic"
import { useNotice } from "@yamada-ui/react"
import { useAuth } from "@/context/AuthContext"

export const RegisterSection = () => {
  const { emailVerificationCode } = useAuth()
  const notice = useNotice()

  const handleSendVerificationCode = async (data: RegisterFormData) => {
    try {
      const response = await emailVerificationCode.mutateAsync(data.email)
      if (response.success) {
        notice({
          title: "Email verification code sent",
          description: `Please check your inbox for ${data.email}`,
          status: "success",
        })
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  return <RegisterPanel onSubmit={handleSendVerificationCode} />
}
