"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { BookingTimesCardGroup } from "@repo/ui/components/Generic"
import { AutoCompleteType, Heading, InputType, TextInput } from "@repo/ui/components/Primitive"
import { Button, Container, FormControl, useNotice, VStack } from "@yamada-ui/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// THIS SCHEMA IN A REAL APP SHOULD BE IN SHARED FOLDER.
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bookingTimes: z.array(z.string()).min(1, "Please select at least one booking time"),
})

type FormValues = z.infer<typeof formSchema>

// Sample booking times data
const bookingTimesData = [
  {
    label: "Tuesday, 12th May",
    value: "booking-123",
    addon: "UoA Hiwa Center",
    description: "7:30 - 10:00 PM",
  },
  {
    label: "Friday, 15th May",
    value: "booking-101",
    addon: "UoA Sports Complex",
    description: "5:00 - 7:00 PM",
    disabled: true,
  },
  {
    label: "Saturday, 16th May",
    value: "booking-202",
    addon: "UoA Sports Complex",
    description: "9:00 - 11:30 AM",
  },
]

export default function Form2Page() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingTimes: [],
    },
  })

  const notice = useNotice()

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(data)
    notice({
      title: "Booking form submitted!",
      description: `Name: ${data.name}\nEmail: ${data.email}\nSelected bookings: ${data.bookingTimes.length}`,
      status: "success",
    })
  }

  return (
    <Container as="main" centerContent>
      <Heading.h1>Booking Times Form</Heading.h1>
      <VStack as="form" maxW="4xl" onSubmit={handleSubmit(onSubmit)}>
        <FormControl errorMessage={errors.name?.message} invalid={!!errors.name} label="Name">
          <TextInput placeholder="Your Name" {...register("name")} />
        </FormControl>

        <FormControl errorMessage={errors.email?.message} invalid={!!errors.email} label="Email">
          <TextInput
            autoComplete={AutoCompleteType.Email}
            placeholder="test@example.com"
            type={InputType.Email}
            {...register("email")}
          />
        </FormControl>

        <BookingTimesCardGroup
          control={control}
          errorMessage={errors.bookingTimes?.message}
          isError={!!errors.bookingTimes}
          items={bookingTimesData}
          name="bookingTimes"
        />

        <Button
          colorScheme="primary"
          isLoading={isSubmitting}
          loadingText="Submitting..."
          type="submit"
        >
          Submit Booking
        </Button>
      </VStack>
    </Container>
  )
}
