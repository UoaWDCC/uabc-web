"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { PlayLevel } from "@/types/types"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import {
  Button,
  Card,
  CardBody,
  Fieldset,
  HStack,
  Heading,
  SegmentedControl,
  SegmentedControlButton,
  Spacer,
  Text,
  VStack,
} from "@yamada-ui/react"

interface ClientAccountFormProps {
  firstName: string
  lastName: string
  email: string
  playLevel: PlayLevel
  selectedLevel?: PlayLevel
  member: boolean
}

const formSchema = z.object({
  firstName: z.string().min(1, "Field is required"),
  lastName: z.string().min(1, "Field is required"),
  playLevel: z.union([z.literal("beginner"), z.literal("intermediate"), z.literal("advanced")]),
})

export default function ClientAccountForm({
  firstName: initialFirstName,
  lastName: initialLastName,
  email: initialEmail,
  playLevel: initialPlayLevel,
}: ClientAccountFormProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      playLevel: initialPlayLevel,
    },
  })

  const [email] = useState(initialEmail)

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle save functionality
    console.log("Saving user data:", data)
  }

  return (
    <VStack alignItems="center">
      {/* Profile Settings Tab */}

      <Card maxW="460px" variant="outline" w="full">
        <CardBody>
          <Heading as="h2" fontSize="lg" fontWeight="bold">
            Full Name
          </Heading>
          <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="First Name"
              type={InputType.Text}
              {...register("firstName")}
              errorMessage={errors.firstName?.message}
              isError={!!errors.firstName?.message}
            />
            <TextInput
              label="Last Name"
              type={InputType.Text}
              {...register("lastName")}
              errorMessage={errors.lastName?.message}
              isError={!!errors.lastName?.message}
            />

            {/* Play Level Selector */}
            <Heading as="h2" fontSize="lg" fontWeight="bold">
              Play Level
            </Heading>
            <Fieldset
              errorMessage={errors.playLevel ? errors.playLevel.message : undefined}
              invalid={!!errors.playLevel}
              w="full"
            >
              <Controller
                control={control}
                name="playLevel"
                render={({ field }) => (
                  <SegmentedControl
                    {...field}
                    bg="white"
                    borderColor="tertiary"
                    borderWidth="1px"
                    colorScheme="primary"
                    variant="basic"
                    w="full"
                  >
                    {Object.values(PlayLevel).map((level) => (
                      <SegmentedControlButton
                        h="12"
                        key={level}
                        textTransform="capitalize"
                        value={level}
                      >
                        {level}
                      </SegmentedControlButton>
                    ))}
                  </SegmentedControl>
                )}
                rules={{ required: { value: true, message: "Play level is required." } }}
              />
            </Fieldset>

            <Button colorScheme="primary" disabled={!isDirty} type="submit" w="fit-content">
              Save Changes
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {/* Email Address Tab */}
      <Card maxW="460px" variant="outline" w="full">
        <CardBody>
          <Heading as="h2" fontSize="lg" fontWeight="bold">
            Email Address
          </Heading>
          <HStack w="full">
            <Text>{email}</Text>
            <Spacer />
            <Button variant="outline" w="fit-content">
              Change Email
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Password Tab */}
      <Card maxW="460px" variant="outline" w="full">
        <CardBody>
          <Heading as="h2" fontSize="lg" fontWeight="bold">
            Password
          </Heading>
          <Button colorScheme="destructive" variant="solid">
            Change Password
          </Button>
        </CardBody>
      </Card>
    </VStack>
  )
}
