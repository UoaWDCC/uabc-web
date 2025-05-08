"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useResetPasswordMutation } from "@/hooks/mutations/reset-password"
import { Heading } from "@repo/ui/components/Heading"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { Button, Text, VStack, useNotice } from "@yamada-ui/react"
import { passwordSchema } from "./formSchema"

const formSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const notice = useNotice()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate, isPending } = useResetPasswordMutation(token)

  const onSubmit = async ({ newPassword }: z.infer<typeof formSchema>) => {
    mutate(newPassword, {
      onSuccess: () => {
        notice({
          title: "Success!",
          description: "Your password has been reset successfully.",
        })
        router.push("/auth/login")
      },
      onError: (e) => {
        const code = e.message

        if (code === "TOO_MANY_REQUESTS") {
          notice({
            title: "Too many requests",
            description: "You have made too many requests. Please try again later.",
            status: "error",
          })
        } else if (code === "INVALID_CODE") {
          notice({
            title: "Invalid or expired token",
            description:
              "The reset token is invalid or has expired. Please request a new password reset.",
            status: "error",
            // TODO: add action button to notice (or choose alternative solution)
          })
        } else {
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred during the password reset process.",
            status: "error",
          })
        }
      },
    })
  }

  return (
    <VStack>
      <Heading.h2 textAlign="center">Reset Password</Heading.h2>
      <Text>
        Enter your new password below. Make sure it is strong and unique to keep your account
        secure.
      </Text>
      <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          autoFocus
          errorMessage={errors.newPassword?.message}
          isError={!!errors.newPassword}
          label="New Password"
          type={InputType.Password}
          {...register("newPassword")}
        />
        <TextInput
          errorMessage={errors.confirmPassword?.message}
          isError={!!errors.confirmPassword}
          label="Confirm Password"
          type={InputType.Password}
          {...register("confirmPassword")}
        />
        <Button colorScheme="primary" disabled={isPending} type="submit">
          Reset Password
        </Button>
      </VStack>
    </VStack>
  )
}
