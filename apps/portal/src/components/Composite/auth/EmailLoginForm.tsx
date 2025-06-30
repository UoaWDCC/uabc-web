"use client"

import { Heading } from "@repo/ui/components/Heading"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { Button, VStack } from "@yamada-ui/react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { emailSchema } from "./formSchema"

interface SignUpFormData {
  email: string
  password: string
}

export const EmailLoginForm = () => {
  const searchParams = useSearchParams()

  const [open, setOpen] = useState<boolean>(searchParams.get("open") === "true")
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>()

  const onSubmit = async (formData: SignUpFormData) => {
    setButtonDisabled(true)

    // Check if email and password are valid
    if (
      formData.email === "" ||
      formData.password === "" ||
      !emailSchema.safeParse(formData.email)
    ) {
      throw new Error("Invalid email or password")
    }

    throw new Error("AUTH NOT IMPLEMENTED YET!")
  }

  function openEmailLogin() {
    setOpen(true)
  }

  return (
    <VStack>
      {/* Button to open the form on mobile view */}
      <Button
        colorScheme="primary"
        display={{ base: !open ? "grid" : "none", lg: "none" }}
        onClick={openEmailLogin}
      >
        Login with Email
      </Button>

      {/* Form, hidden on mobile view by default and shown only when open */}
      <VStack
        as="form"
        display={{ base: open ? "flex" : "none", lg: "flex" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading.h2 textAlign="center">Login to your account</Heading.h2>

        <TextInput
          autoFocus
          errorMessage={errors.email?.message}
          isError={!!errors.email}
          label="Email"
          type={InputType.Email}
          {...register("email")}
        />
        <TextInput
          errorMessage={errors.email?.message}
          isError={!!errors.email}
          label="Password"
          type={InputType.Password}
          {...register("password")}
        />

        <Button colorScheme="primary" disabled={buttonDisabled} type="submit">
          Login with Email
        </Button>
      </VStack>
    </VStack>
  )
}
