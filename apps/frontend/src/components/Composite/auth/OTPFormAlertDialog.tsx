"use client"

import type { AlertDialogProps } from "@radix-ui/react-alert-dialog"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useRegisterMutation, useResendCodeMutation } from "@/hooks/mutations/registration"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../Generic/ui/alert-dialog"
import { Button } from "../../Generic/ui/button"
import { useToast } from "../../Generic/ui/use-toast"

interface OTPFormAlertDialogProps extends AlertDialogProps {
  email: string
  password: string
  onSuccess: () => void
}

export function OTPFormAlertDialog({
  email,
  password,
  onSuccess,
  ...props
}: OTPFormAlertDialogProps) {
  const { toast } = useToast()
  const { handleSubmit } = useForm()

  const [verificationCode, setVerificationCode] = useState("")

  const { mutate: resendCode, isPending: isResendingCode } = useResendCodeMutation()

  const { mutate, isError: isRegisterError } = useRegisterMutation()

  const onSubmit = () => {
    mutate(
      { email, password, token: verificationCode },
      {
        onSuccess,
      },
    )
  }

  function handleResendCodeClick() {
    resendCode(email, {
      onSuccess: () => {
        toast({
          title: "Code Resent",
          description: `We've resent the verification code to ${email}.`,
        })
      },
      onError: (error) => {
        toast({
          title: "Failed to Resend Code",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Verification Code</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the verification code we sent to <strong>{email}</strong>. This code will expire
            in 3 minutes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextInput
              autoFocus
              errorMessage={"Invalid code. Please double check and try again."}
              isError={isRegisterError}
              label="Verification Code"
              onChange={(e) => setVerificationCode(e.target.value)}
              type={InputType.Text}
              value={verificationCode}
            />
          </div>
          <Button disabled={!verificationCode} type="submit">
            Next
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="p-0"
            disabled={isResendingCode}
            onClick={handleResendCodeClick}
            type="button"
            variant="link"
          >
            Resend Code
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
