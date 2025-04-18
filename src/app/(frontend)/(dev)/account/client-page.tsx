'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { TextInput } from '@/components/Composite/TextInput'
import { PlayLevel } from '@/types/types'
import {
  Button,
  Card,
  CardBody,
  Fieldset,
  HStack,
  SegmentedControl,
  SegmentedControlButton,
  Spacer,
  Text,
  VStack,
} from '@yamada-ui/react'
import { Heading } from '@/components/Generic/Heading'

interface ClientAccountFormProps {
  firstName: string
  lastName: string
  email: string
  playLevel: PlayLevel
  selectedLevel?: PlayLevel
  member: boolean
}

const formSchema = z.object({
  firstName: z.string().min(1, 'Field is required'),
  lastName: z.string().min(1, 'Field is required'),
  playLevel: z.union([z.literal('beginner'), z.literal('intermediate'), z.literal('advanced')]),
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
    console.log('Saving user data:', data)
  }

  return (
    <VStack alignItems="center">
      {/* Profile Settings Tab */}

      <Card maxW="460px" w="full" variant="outline">
        <CardBody>
          <Heading as="h2" fontSize="lg" fontWeight="bold">
            Full Name
          </Heading>
          <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="First Name"
              type="text"
              {...register('firstName')}
              isError={!!errors.firstName?.message}
              errorMessage={errors.firstName?.message}
            />
            <TextInput
              label="Last Name"
              type="text"
              {...register('lastName')}
              isError={!!errors.lastName?.message}
              errorMessage={errors.lastName?.message}
            />

            {/* Play Level Selector */}
            <Heading as="h2" fontSize="lg" fontWeight="bold">
              Play Level
            </Heading>
            <Fieldset
              invalid={!!errors.playLevel}
              errorMessage={errors.playLevel ? errors.playLevel.message : undefined}
              w="full"
            >
              <Controller
                name="playLevel"
                control={control}
                rules={{ required: { value: true, message: 'Play level is required.' } }}
                render={({ field }) => (
                  <SegmentedControl
                    {...field}
                    variant="basic"
                    colorScheme="primary"
                    bg="white"
                    borderWidth="1px"
                    borderColor="tertiary"
                    w="full"
                  >
                    {Object.values(PlayLevel).map((level) => (
                      <SegmentedControlButton
                        key={level}
                        value={level}
                        h="12"
                        textTransform="capitalize"
                      >
                        {level}
                      </SegmentedControlButton>
                    ))}
                  </SegmentedControl>
                )}
              />
            </Fieldset>

            <Button type="submit" colorScheme="primary" disabled={!isDirty} w="fit-content">
              Save Changes
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {/* Email Address Tab */}
      <Card maxW="460px" w="full" variant="outline">
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
      <Card maxW="460px" w="full" variant="outline">
        <CardBody>
          <Heading as="h2" fontSize="lg" fontWeight="bold">
            Password
          </Heading>
          <Button variant="solid" colorScheme="destructive">
            Change Password
          </Button>
        </CardBody>
      </Card>
    </VStack>
  )
}
