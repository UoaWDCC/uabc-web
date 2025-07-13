"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type LoginDetails, LoginDetailsSchema } from "@repo/shared/schemas"
import { Button, Heading, InputType, TextInput } from "@repo/ui/components/Primitive"
import { LockIcon, MailIcon } from "@yamada-ui/lucide"
import {
  Center,
  Checkbox,
  HStack,
  memo,
  noop,
  Spacer,
  Text,
  Link as UILink,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { type SubmitHandler, useForm } from "react-hook-form"
import { UabcLogo } from "../../Icon"
import { BreakLine } from "../../Primitive/BreakLine"

/**
 * Props for {@link LoginPanel} component
 */
export interface LoginPanelProps {
  /**
   * Submit handler called when user submits the LoginPanel form.
   */
  onSubmit?: SubmitHandler<LoginDetails>
}

/**
 * Login panel component for both mobile and desktop screens.
 *
 * @param props LoginPanel component props
 * @returns A login panel component
 */
export const LoginPanel = memo(({ onSubmit }: LoginPanelProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDetails>({
    resolver: zodResolver(LoginDetailsSchema),
  })

  return (
    <VStack
      as="form"
      bgColor="secondary.900"
      borderRadius={{ base: undefined, md: "3xl" }}
      layerStyle={{ base: undefined, md: "gradientBorder" }}
      onSubmit={handleSubmit(onSubmit ?? noop)}
      p="md"
      w={{ base: "full", md: "md" }}
    >
      <Center>
        <UabcLogo />
      </Center>

      <Center display={{ base: "none", md: "block" }} textAlign="center">
        <Heading.h2>Welcome back</Heading.h2>
        <Text>Please enter your details to sign in</Text>
      </Center>

      <TextInput
        data-testid="email"
        errorMessage={errors.email?.message}
        isError={!!errors.email}
        placeholder="Email Address"
        registration={register("email")}
        startIcon={<MailIcon />}
        type={InputType.Email}
      />
      <TextInput
        data-testid="password"
        errorMessage={errors.password?.message}
        isError={!!errors.password}
        placeholder="Password"
        registration={register("password")}
        startIcon={<LockIcon />}
        type={InputType.Password}
      />
      <HStack>
        <Checkbox label="Remember me" textAlign="start" />
        <Spacer />
        <UILink as={Link} href="/auth/forgot-password" textAlign="end" textColor="white">
          Forgot Password?
        </UILink>
      </HStack>
      <Button colorScheme="primary" loading={isSubmitting} type="submit">
        Sign In
      </Button>

      <BreakLine
        label="or"
        separatorProps1={{ border: 0, layerStyle: "fadeLeft" }}
        separatorProps2={{ border: 0, layerStyle: "fadeRight" }}
      />

      <span>Google and Apple icons go here</span>
      <Center textAlign="center">
        <Text color="gray.100">
          Don't have an account?&nbsp;
          <UILink as={Link} color="gray.100" fontWeight="bold" href="/auth/login">
            Create Account
          </UILink>
        </Text>
      </Center>
    </VStack>
  )
})

LoginPanel.displayName = "LoginPanel"
