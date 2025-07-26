"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type RegisterFormData, RegisterFormDataSchema } from "@repo/shared"
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
  FormControl,
  memo,
  noop,
  Text,
  Tooltip,
  Link as UILink,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { type SubmitHandler, useForm } from "react-hook-form"
import { GoogleLogo, UabcLogo } from "../../Icon"

/**
 * Props for {@link RegisterPanel} component
 */
export interface RegisterPanelProps {
  /**
   * Submit handler called when user submits the RegisterPanel form.
   */
  onSubmit?: SubmitHandler<RegisterFormData>
  /**
   * Href for the google icon button.
   */
  googleHref?: string
}

/**
 * Register panel component for both mobile and desktop screens.
 *
 * @param props RegisterPanel component props
 * @returns A register panel component
 */
export const RegisterPanel = memo(({ onSubmit, googleHref }: RegisterPanelProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormDataSchema),
  })

  return (
    <VStack
      as="form"
      bg="gray.900"
      layerStyle="gradientBorder"
      maxW="lg"
      onSubmit={handleSubmit(onSubmit ?? noop)}
      p="lg"
      rounded="3xl"
      w="full"
    >
      <Center>
        {/* TODO: replace with correct logo */}
        <UabcLogo />
      </Center>

      <Center textAlign="center">
        <VStack>
          <Heading.h2>Welcome to UABC</Heading.h2>
          <Text>Please enter your details to register</Text>
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
          autoComplete={AutoCompleteType.NewPassword}
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
          autoComplete={AutoCompleteType.NewPassword}
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

      <Center>
        <ButtonGroup gap="sm">
          <IconButton
            aria-label="Google"
            as={Link}
            colorScheme="secondary"
            fullRounded
            href={googleHref}
            variant="gradient"
          >
            <GoogleLogo fontSize="2xl" />
          </IconButton>
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
          Already have an account?&nbsp;
          <UILink
            _hover={{ color: "white" }}
            as={Link}
            color="gray.100"
            href="/auth/login"
            textDecoration="underline"
          >
            Login
          </UILink>
        </Text>
      </Center>
    </VStack>
  )
})

RegisterPanel.displayName = "RegisterPanel"
