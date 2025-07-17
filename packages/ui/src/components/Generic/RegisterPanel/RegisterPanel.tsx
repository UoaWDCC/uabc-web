"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type RegisterPanelDetails, RegisterPanelDetailsSchema } from "@repo/shared/schemas"
import { Button, Heading, IconButton, InputType, TextInput } from "@repo/ui/components/Primitive"
import { AppleIcon, LockIcon, MailIcon } from "@yamada-ui/lucide"
import {
  Box,
  Center,
  FormControl,
  memo,
  noop,
  Text,
  Link as UILink,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import type { MouseEventHandler } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { GoogleLogo, UabcLogo } from "../../Icon"

/**
 * Props for {@link RegisterPanel} component
 */
export interface RegisterPanelProps {
  /**
   * Submit handler called when user submits the RegisterPanel form.
   */
  onSubmit?: SubmitHandler<RegisterPanelDetails>
  /**
   * Handler called when user selects the Google icon button.
   *
   * TODO: change as necessary when implementing handler function.
   */
  onClickGoogle?: MouseEventHandler<HTMLButtonElement>
}

/**
 * Register panel component for both mobile and desktop screens.
 *
 * @param props RegisterPanel component props
 * @returns A register panel component
 */
export const RegisterPanel = memo(({ onSubmit, onClickGoogle }: RegisterPanelProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPanelDetails>({
    resolver: zodResolver(RegisterPanelDetailsSchema),
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
      <Center py={{ base: "md", md: "unset" }}>
        {/* TODO: replace with correct logo */}
        <UabcLogo />
      </Center>

      <Center display={{ base: "none", md: "block" }} textAlign="center">
        <VStack>
          <Heading.h2>Welcome to UABC</Heading.h2>
          <Text>Please enter your details to register</Text>
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
      <FormControl
        errorMessage={errors.confirmPassword?.message}
        invalid={!!errors.confirmPassword}
      >
        <TextInput
          data-testid="confirm-password"
          placeholder="Confirm Password"
          startElement={<LockIcon />}
          type={InputType.Password}
          {...register("confirmPassword")}
        />
      </FormControl>
      <Button colorScheme="primary" loading={isSubmitting} type="submit">
        Register
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
          data-testid="google-logo"
          fullRounded
          onClick={onClickGoogle ?? noop}
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

      <Center color="gray.100" fontSize="sm" textAlign="center">
        <Text>
          Already have an account?&nbsp;
          <UILink
            _hover={{ color: "white" }}
            as={Link}
            color="gray.100"
            href="/auth/signin"
            textDecoration="underline"
          >
            Sign in
          </UILink>
        </Text>
      </Center>
    </VStack>
  )
})

RegisterPanel.displayName = "RegisterPanel"
