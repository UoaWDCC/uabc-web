"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Heading } from "@repo/ui/components/Heading"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { Button, Text, Link as UILink, useNotice, VStack } from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useForgotPasswordMutation } from "@/hooks/mutations/forgot-password"

const formSchema = z.object({
  email: z.string().email(),
})

export const ForgotPasswordForm = () => {
  console.log("rerender")

  const notice = useNotice()

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate, isPending } = useForgotPasswordMutation()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutate(data.email, {
      onSuccess: () => {
        setIsSubmitted(true)
      },
      onError: (e) => {
        if (e.message === "TOO_MANY_REQUESTS") {
          notice({
            title: "Too many requests",
            description: "You have made too many password reset requests. Please try again later.",
            status: "error",
          })
        } else {
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while processing your request. Please try again.",
            status: "error",
          })
        }
      },
    })
  }

  return (
    <VStack>
      <Heading.h2 textAlign="center">Forgot Password?</Heading.h2>
      {!isSubmitted ? (
        <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            autoFocus
            errorMessage={errors.email?.message}
            isError={!!errors.email}
            label="Email"
            type={InputType.Email}
            {...register("email")}
          />
          <Button colorScheme="primary" disabled={isPending} type="submit">
            Send Reset Link
          </Button>
        </VStack>
      ) : (
        <VStack>
          <Text>
            We&apos;ve emailed a password reset link to{" "}
            <Text as="span" fontWeight="bold">
              {getValues("email")}
            </Text>
            . Please check your inbox and follow the instructions to reset your password.
          </Text>
          <Text>
            If you did not receive an email, please sign up for an account{" "}
            <UILink as={Link} color="primary" fontWeight="bold" href="/auth/signup">
              here
            </UILink>
            .
          </Text>
          <Button as={Link} colorScheme="primary" href="/auth/login?open=true">
            Back to Login
          </Button>
        </VStack>
      )}
    </VStack>
  )
}
