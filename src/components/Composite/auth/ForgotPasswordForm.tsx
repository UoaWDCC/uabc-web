'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Text, Link as UILink, VStack } from '@yamada-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/Generic/Button'
import { Heading } from '@/components/Generic/Heading'
import { TextInput } from '@/components/Generic/TextInput'
import { useToast } from '@/components/Generic/ui/use-toast'
import { useForgotPasswordMutation } from '@/hooks/mutations/forgot-password'

const formSchema = z.object({
  email: z.string().email(),
})

export const ForgotPasswordForm = () => {
  console.log('rerender')
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate, isPending } = useForgotPasswordMutation()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutate(data.email, {
      onSuccess: () => {
        setIsSubmitted(true)
      },
      onError: (e) => {
        if (e.message === 'TOO_MANY_REQUESTS') {
          toast({
            title: 'Too many requests',
            description: 'You have made too many password reset requests. Please try again later.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Uh oh! Something went wrong',
            description: 'An error occurred while processing your request. Please try again.',
            variant: 'destructive',
          })
        }
      },
    })
  }

  return (
    <VStack>
      <Heading.h2 textAlign="center">Forgot Password?</Heading.h2>
      {!isSubmitted ? (
        <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            autoFocus
            label="Email"
            type="email"
            isError={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" disabled={isPending}>
            Send Reset Link
          </Button>
        </VStack>
      ) : (
        <VStack>
          <Text>
            We&apos;ve emailed a password reset link to{' '}
            <Text as="span" fontWeight="bold">
              {getValues('email')}
            </Text>
            . Please check your inbox and follow the instructions to reset your password.
          </Text>
          <Text>
            If you did not receive an email, please sign up for an account{' '}
            <UILink as={Link} href="/auth/signup" color="primary" fontWeight="bold">
              here
            </UILink>
            .
          </Text>
          <Button onClick={() => router.push('/auth/login?open=true')} colorScheme="primary">
            Back to Login
          </Button>
        </VStack>
      )}
    </VStack>
  )
}
