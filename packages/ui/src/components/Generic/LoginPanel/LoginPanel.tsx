"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type LoginForm, LoginFormSchema, type LoginResponse } from "@repo/shared"
import { Button, Heading, IconButton, InputType, TextInput } from "@repo/ui/components/Primitive"
import { AppleIcon, LockIcon, MailIcon } from "@yamada-ui/lucide"
import {
  Box,
  Center,
  Checkbox,
  FormControl,
  HStack,
  memo,
  Spacer,
  Text,
  Link as UILink,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { GoogleLogo, UabcLogo } from "../../Icon"

/**
 * Props for {@link LoginPanel} component
 */
export interface LoginPanelProps {
  /**
   * Submit handler called when user submits the LoginPanel form.
   */
  onSubmit?: (args: LoginForm) => Promise<LoginResponse>
  /**
   * Href for the google icon button.
   */
  googleHref: string
}

/**
 * Login panel component for both mobile and desktop screens.
 *
 * @param props LoginPanel component props
 * @returns A login panel component
 */
export const LoginPanel = memo(({ onSubmit, googleHref }: LoginPanelProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
  })

  const [error, setError] = useState("")

  const handleLogin = async (data: LoginForm) => {
    const submitData = await onSubmit?.(data)
    console.log(submitData)
    setError(submitData?.error || "")
  }

  return (
    <VStack
      as="form"
      bgColor="secondary.900"
      borderRadius={{ base: undefined, md: "3xl" }}
      layerStyle={{ base: undefined, md: "gradientBorder" }}
      onSubmit={handleSubmit(handleLogin)}
      p={{ base: "md", lg: "lg" }}
      w={{ base: "full", md: "md" }}
    >
      <Center py={{ base: "md", md: "unset" }}>
        {/* TODO: replace with correct logo */}
        <UabcLogo />
      </Center>

      <Center display={{ base: "none", md: "block" }} textAlign="center">
        <VStack>
          <Heading.h2>Welcome back</Heading.h2>
          <Text>Please enter your details to sign in</Text>
        </VStack>
      </Center>

      <FormControl errorMessage={errors.email?.message} invalid={!!errors.email}>
        <TextInput
          data-testid="email"
          placeholder="Email Address"
          startElement={<MailIcon />}
          type={InputType.Email}
          {...register("email")}
        />
      </FormControl>
      <FormControl errorMessage={errors.password?.message} invalid={!!errors.password}>
        <TextInput
          data-testid="password"
          placeholder="Password"
          startElement={<LockIcon />}
          type={InputType.Password}
          {...register("password")}
        />
      </FormControl>
      {error && <Text color={["danger.500", "danger.400"]}>{error}</Text>}
      <HStack color="gray.100" fontSize="sm">
        <Checkbox label="Remember me" size="sm" textAlign="start" {...register("rememberMe")} />
        <Spacer />
        <UILink
          _hover={{ color: "white" }}
          as={Link}
          color="gray.100"
          href="/auth/forgot-password"
          textDecoration="underline"
        >
          Forgot Password?
        </UILink>
      </HStack>
      <Button colorScheme="primary" loading={isSubmitting} type="submit">
        Sign In
      </Button>

      <Center position="relative">
        <Text
          bg="secondary.900"
          color="muted"
          display="inline-block"
          fontSize="xs"
          px="md"
          textTransform="uppercase"
          z={1}
        >
          or
        </Text>
        <Box
          color="white"
          layerStyle="fadeFromMiddle"
          left="0"
          position="absolute"
          right="0"
          w="full"
        />
      </Center>

      <Center gap={4}>
        <IconButton
          aria-label="Google"
          as="a"
          colorScheme="secondary"
          data-testid="google-logo"
          fullRounded
          href={googleHref}
          variant="gradient"
        >
          <GoogleLogo fontSize="2xl" />
        </IconButton>
        {/* TODO: implement Apple auth or remove Apple icon button */}
        <IconButton
          aria-label="Apple"
          as="a"
          colorScheme="secondary"
          disabled
          fullRounded
          variant="gradient"
        >
          <AppleIcon fontSize="2xl" />
        </IconButton>
      </Center>

      <Center color="gray.100" fontSize="sm" textAlign="center">
        <Text>
          Don't have an account?&nbsp;
          <UILink
            _hover={{ color: "white" }}
            as={Link}
            color="gray.100"
            href="/auth/signup"
            textDecoration="underline"
          >
            Create Account
          </UILink>
        </Text>
      </Center>
    </VStack>
  )
})

LoginPanel.displayName = "LoginPanel"
