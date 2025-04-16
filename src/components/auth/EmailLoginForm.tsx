'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button, Heading, VStack } from '@yamada-ui/react'

import { TextInput } from '../TextInput'
import { emailSchema } from './formSchema'

interface SignUpFormData {
  email: string
  password: string
}

export const EmailLoginForm = () => {
  const searchParams = useSearchParams()

  const [open, setOpen] = useState<boolean>(searchParams.get('open') === 'true')
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
      formData.email === '' ||
      formData.password === '' ||
      !emailSchema.safeParse(formData.email)
    ) {
      throw new Error('Invalid email or password')
    }

    throw new Error('AUTH NOT IMPLEMENTED YET!')
  }

  function openEmailLogin() {
    setOpen(true)
  }

  return (
    <VStack>
      {/* Button to open the form on mobile view */}
      <Button
        onClick={openEmailLogin}
        colorScheme="primary"
        display={{ base: !open ? 'grid' : 'none', lg: 'none' }}
      >
        Login with Email
      </Button>

      {/* Form, hidden on mobile view by default and shown only when open */}
      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        display={{ base: open ? 'flex' : 'none', lg: 'flex' }}
      >
        <Heading as="h2" fontSize="2xl" textAlign="center">
          Login to your account
        </Heading>

        <TextInput
          autoFocus
          label="Email"
          type="email"
          isError={!!errors.email}
          {...register('email')}
        />
        <TextInput
          label="Password"
          type="password"
          isError={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('password')}
        />

        <Button type="submit" disabled={buttonDisabled} colorScheme="primary">
          Login with Email
        </Button>
      </VStack>
    </VStack>
  )
}
