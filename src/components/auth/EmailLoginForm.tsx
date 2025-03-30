'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { TextInput } from '../TextInput'
import { Button } from '../ui/button'
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
    <div className="flex flex-col gap-4">
      {/* Button to open the form on mobile view */}
      {!open && (
        <Button
          large
          onClick={openEmailLogin}
          className="lg:hidden" // Show only on mobile view
        >
          Login with Email
        </Button>
      )}

      {/* Form, hidden on mobile view by default and shown only when open */}
      <div className={cn({ block: open, hidden: !open }, 'lg:block')}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <span className="text-center text-foreground">Login to your account</span>
          <TextInput
            autoFocus
            className="text-foreground"
            label="Email"
            type="email"
            isError={!!errors.email}
            {...register('email')}
          />
          <TextInput
            className="text-foreground"
            label="Password"
            type="password"
            isError={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('password')}
          />
          <Button large type="submit" disabled={buttonDisabled}>
            Login with Email
          </Button>
        </form>
      </div>
    </div>
  )
}
