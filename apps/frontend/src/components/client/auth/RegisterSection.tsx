"use client"

import { Popup, type RegisterFormData } from "@repo/shared"
import {
  CodeVerificationPopup,
  type CodeVerificationPopupData,
} from "@repo/ui/components/Composite"
import { RegisterPanel } from "@repo/ui/components/Generic"
import { usePopupState } from "@repo/ui/hooks"
import { Container, useNotice } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

export const RegisterSection = () => {
  const { emailVerificationCode, register } = useAuth()
  const router = useRouter()
  const { isOpen, open } = usePopupState({
    popupId: Popup.CODE_VERIFICATION,
    initialValue: "",
  })
  const notice = useNotice()
  const [formData, setFormData] = useState<RegisterFormData>()

  const handleSendVerificationCode = async (data: RegisterFormData) => {
    setFormData(data)
    try {
      const response = await emailVerificationCode.mutateAsync(data.email)
      if (response.success) {
        notice({
          title: "Email verification code sent",
          description: `Please check your inbox for ${data.email}`,
          status: "success",
        })
        open()
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  const handleRegister = async (data: CodeVerificationPopupData) => {
    try {
      const response = await register.mutateAsync({
        email: formData?.email || "",
        password: formData?.password || "",
        emailVerificationCode: data.pinInput,
      })
      if (response.success) {
        notice({
          title: "Registration successful",
          description: "Redirecting to login now",
          status: "success",
        })
        router.push("/auth/login")
        return true
      }
      return false
    } catch {
      return false
    }
  }

  return (
    <Container centerContent layerStyle="container">
      <CodeVerificationPopup
        message="Please enter the code sent to your email"
        onSubmit={handleRegister}
        open={isOpen}
        title="Verify Your Email"
      />
      <RegisterPanel onSubmit={handleSendVerificationCode} />
    </Container>
  )
}
