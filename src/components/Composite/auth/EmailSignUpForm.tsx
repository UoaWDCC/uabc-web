'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useValidateEmailMutation } from '@/hooks/mutations/registration'
import { Button } from '../../Generic/ui/button'
import { useToast } from '../../Generic/ui/use-toast'
import { TextInput } from '../TextInput'
import { OTPFormAlertDialog } from './OTPFormAlertDialog'
import { emailSchema, passwordSchema } from './formSchema'

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const EmailSignUpForm = () => {
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)

  const [formData, setFormData] = useState<z.infer<typeof formSchema>>({
    email: '',
    password: '',
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
        if (e.message === '400') {
          setError('email', {
            type: 'manual',
            message: 'Email already in use',
          })
        } else {
          toast({
            title: 'Uh oh! Something went wrong',
            description: 'An error occurred while creating your account. Please try again.',
            variant: 'destructive',
          })
        }
      },
    })
  }

  const handleSuccessfulSignUp = async () => {
    throw new Error('Sign up not implemented')
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <span className="text-center text-foreground">Create an Account</span>
          <TextInput
            autoFocus
            label="Email"
            type="email"
            isError={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('email')}
          />
          <TextInput
            label="Password"
            type="password"
            isError={!!errors.password}
            errorMessage={errors.password?.message}
            {...register('password')}
          />
          <Button large type="submit" disabled={isPending}>
            Sign Up with Email
          </Button>
        </div>
      </form>
      <OTPFormAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccessfulSignUp}
        email={formData.email}
        password={formData.password}
      />
    </>
  )
}
