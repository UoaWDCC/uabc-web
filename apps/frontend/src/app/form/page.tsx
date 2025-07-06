"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AutoCompleteType, Heading, InputType, TextInput } from "@repo/ui/components/Primitive"
import { Button, Container, useNotice, VStack } from "@yamada-ui/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.coerce.number().min(18, "You must be at least 18 years old"),
})

type FormValues = z.infer<typeof formSchema>

export default function FormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const notice = useNotice()

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(data)
    notice({
      title: "Form submitted!",
      description: `Name: ${data.name}\nEmail: ${data.email}\nPassword: ${data.password}\nAge: ${data.age}`,
      status: "success",
    })
  }

  return (
    <Container as="main" centerContent>
      <Heading.h1>Form Example</Heading.h1>
      <VStack as="form" maxW="3xl" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          errorMessage={errors.name?.message}
          isError={!!errors.name}
          label="Name"
          placeholder="Badminton Club"
          registration={register("name")}
        />
        <TextInput
          autoComplete={AutoCompleteType.Email}
          errorMessage={errors.email?.message}
          isError={!!errors.email}
          label="Email"
          placeholder="test@example.com"
          registration={register("email")}
          type={InputType.Email}
        />
        <TextInput
          autoComplete={AutoCompleteType.CurrentPassword}
          errorMessage={errors.password?.message}
          isError={!!errors.password}
          label="Password"
          placeholder="Enter your password"
          registration={register("password")}
          type={InputType.Password}
        />
        <TextInput
          errorMessage={errors.age?.message}
          isError={!!errors.age}
          label="Age"
          placeholder="20"
          registration={register("age")}
          type={InputType.Number}
        />

        <Button
          colorScheme="primary"
          isLoading={isSubmitting}
          loadingText="Submitting..."
          type="submit"
        >
          Submit
        </Button>
      </VStack>
    </Container>
  )
}
