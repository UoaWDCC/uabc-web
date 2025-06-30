"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Heading } from "@repo/ui/components/Heading"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { Button, useNotice, VStack } from "@yamada-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useValidateEmailMutation } from "@/hooks/mutations/registration"
import { emailSchema, passwordSchema } from "./formSchema"
import { OTPFormAlertDialog } from "./OTPFormAlertDialog"

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const EmailSignUpForm = () => {
  const notice = useNotice()

  const [dialogOpen, setDialogOpen] = useState(false)

  const [formData, setFormData] = useState<z.infer<typeof formSchema>>({
    email: "",
    password: "",
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate, isPending } = useValidateEmailMutation()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutate(data.email, {
      onSuccess: () => {
        setDialogOpen(true)
        setFormData(data)
      },
      onError: (e) => {
        if (e.message === "400") {
          setError("email", {
            type: "manual",
            message: "Email already in use",
          })
        } else {
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while creating your account. Please try again.",
            status: "error",
          })
        }
      },
    })
  }

  const handleSuccessfulSignUp = async () => {
    throw new Error("Sign up not implemented")
  }

  return (
    <>
      <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
        <Heading.h2 textAlign="center">Create an Account</Heading.h2>

        <TextInput
          autoFocus
          errorMessage={errors.email?.message}
          isError={!!errors.email}
          label="Email"
          type={InputType.Email}
          {...register("email")}
        />
        <TextInput
          errorMessage={errors.password?.message}
          isError={!!errors.password}
          label="Password"
          type={InputType.Password}
          {...register("password")}
        />

        <Button colorScheme="primary" disabled={isPending} type="submit">
          Sign Up with Email
        </Button>
      </VStack>

      <OTPFormAlertDialog
        email={formData.email}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccessfulSignUp}
        open={dialogOpen}
        password={formData.password}
      />
    </>
  )
}
