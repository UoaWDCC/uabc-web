"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type LoginDetails, LoginDetailsSchema } from "@repo/shared/schemas"
import { Button, Heading, IconButton, InputType, TextInput } from "@repo/ui/components/Primitive"
import { AppleIcon, LockIcon, MailIcon } from "@yamada-ui/lucide"
import {
  Box,
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
import type { MouseEventHandler } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { GoogleLogo, UabcLogo } from "../../Icon"

/**
 * Props for {@link LoginPanel} component
 */
export interface LoginPanelProps {
  /**
   * Submit handler called when user submits the LoginPanel form.
   */
  onSubmit?: SubmitHandler<LoginDetails>
  /**
   * Handler called when user selects the Google icon button.
   *
   * TODO: change as necessary when implementing handler function.
   */
  onClickGoogle?: MouseEventHandler<HTMLButtonElement>
}

/**
 * Login panel component for both mobile and desktop screens.
 *
 * @param props LoginPanel component props
 * @returns A login panel component
 */
export const LoginPanel = memo(({ onSubmit, onClickGoogle }: LoginPanelProps) => {
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
      p={{ base: "md", lg: "lg" }}
      w={{ base: "full", md: "md" }}
    >
      <Center>
        {/* TODO: replace with correct logo */}
        <UabcLogo />
      </Center>

      <Center display={{ base: "none", md: "block" }} textAlign="center">
        <VStack>
          <Heading.h2>Welcome back</Heading.h2>
          <Text>Please enter your details to sign in</Text>
        </VStack>
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
      <HStack color="gray.100">
        <Checkbox label="Remember me" textAlign="start" />
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
          colorScheme="secondary"
          fullRounded
          onClick={onClickGoogle}
          variant="gradient"
        >
          <GoogleLogo fontSize="2xl" />
        </IconButton>
        {/* TODO: implement Apple auth or remove Apple icon button */}
        <IconButton
          aria-label="Apple"
          colorScheme="secondary"
          disabled
          fullRounded
          onClick={onClickGoogle}
          variant="gradient"
        >
          <AppleIcon fontSize="2xl" />
        </IconButton>
      </Center>

      <Center textAlign="center">
        <Text color="muted">
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
