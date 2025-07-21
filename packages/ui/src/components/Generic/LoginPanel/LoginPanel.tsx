"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type LoginFormData, LoginFormDataSchema, type LoginResponse } from "@repo/shared"
import {
  AutoCompleteType,
  Button,
  Heading,
  IconButton,
  InputType,
  TextInput,
} from "@repo/ui/components/Primitive"
import { AppleIcon, LockIcon, MailIcon } from "@yamada-ui/lucide"
import {
  Box,
  ButtonGroup,
  Center,
  Checkbox,
  FormControl,
  HStack,
  memo,
  Spacer,
  Text,
  Tooltip,
  Link as UILink,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { GoogleLogo, UabcLogo } from "../../Icon"

/**
 * Props for {@link LoginPanel} component
 */
export interface LoginPanelProps {
  /**
   * Error message to display.
   */
  errorMessage?: string
  /**
   * Submit handler called when user submits the LoginPanel form.
   */
  onSubmit?: (args: LoginFormData) => Promise<LoginResponse>
  /**
   * Href for the google icon button.
   */
  googleHref: string
  /**
   * External loading state. If provided, overrides internal form submission state.
   */
  isLoading?: boolean
}

/**
 * Login panel component for both mobile and desktop screens.
 *
 * @param props LoginPanel component props
 * @returns A login panel component
 */
export const LoginPanel = memo(({ errorMessage, onSubmit, isLoading }: LoginPanelProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormDataSchema),
  })

  const handleLogin = async (data: LoginFormData) => {
    await onSubmit?.(data)
  }

  const isButtonLoading = isLoading ?? isSubmitting

  return (
    <VStack
      //_before={{
      //content: '""',
      //position: "fixed",
      //inset: 0,
      //bg: "gray.900",
      //zIndex: -1,
      //}}
      as="form"
      bg="gray.900"
      layerStyle="gradientBorder"
      onSubmit={handleSubmit(handleLogin)}
      px={{ base: "md", lg: "lg" }}
      py={{ base: "md", lg: "lg" }}
      rounded="3xl"
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
          autoComplete={AutoCompleteType.Email}
          data-testid="email"
          placeholder="Email Address"
          startElement={<MailIcon />}
          type={InputType.Email}
          {...register("email")}
        />
      </FormControl>
      <FormControl errorMessage={errors.password?.message} invalid={!!errors.password}>
        <TextInput
          autoComplete={AutoCompleteType.CurrentPassword}
          data-testid="password"
          placeholder="Password"
          startElement={<LockIcon />}
          type={InputType.Password}
          {...register("password")}
        />
      </FormControl>
      {errorMessage && <Text color={["danger.500", "danger.400"]}>{errorMessage}</Text>}
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
      <Button colorScheme="primary" loading={isButtonLoading} type="submit">
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

      <Center>
        <ButtonGroup gap="sm">
          <Tooltip label="Not ready yet" placement="top">
            <IconButton
              aria-label="Google"
              colorScheme="secondary"
              disabled
              fullRounded
              variant="gradient"
            >
              <GoogleLogo fontSize="2xl" />
            </IconButton>
          </Tooltip>
          <Tooltip label="Not ready yet" placement="top">
            {/* TODO: implement Apple auth or remove Apple icon button */}
            <IconButton
              aria-label="Apple"
              colorScheme="secondary"
              disabled
              fullRounded
              variant="gradient"
            >
              <AppleIcon fontSize="2xl" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </Center>

      <Center color="gray.100" fontSize="sm" textAlign="center">
        <Text>
          Don't have an account?&nbsp;
          <UILink
            _hover={{ color: "white" }}
            as={Link}
            color="gray.100"
            href="/auth/register"
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
