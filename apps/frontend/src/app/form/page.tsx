"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AutoCompleteType, Heading, InputType, TextInput } from "@repo/ui/components/Primitive"
import { Button, Container, FormControl, useNotice, VStack } from "@yamada-ui/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// THIS SCHEMA IN A REAL APP SHOULD BE IN SHARED FOLDER.
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
        <FormControl errorMessage={errors.name?.message} invalid={!!errors.name} label="Name">
          <TextInput placeholder="Badminton Club" {...register("name")} />
        </FormControl>
        <FormControl errorMessage={errors.email?.message} invalid={!!errors.email} label="Email">
          <TextInput
            autoComplete={AutoCompleteType.Email}
            placeholder="test@example.com"
            type={InputType.Email}
            {...register("email")}
          />
        </FormControl>
        <FormControl
          errorMessage={errors.password?.message}
          invalid={!!errors.password}
          label="Password"
        >
          <TextInput
            autoComplete={AutoCompleteType.CurrentPassword}
            placeholder="Enter your password"
            type={InputType.Password}
            {...register("password")}
          />
        </FormControl>
        <FormControl errorMessage={errors.age?.message} invalid={!!errors.age} label="Age">
          <TextInput placeholder="20" type={InputType.Number} {...register("age")} />
        </FormControl>

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
