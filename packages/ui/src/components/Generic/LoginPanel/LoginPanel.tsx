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
      bgColor="secondary.800"
      borderRadius="3xl"
      borderWidth="medium"
      onSubmit={handleSubmit(onSubmit ?? noop)}
      p="md"
      w="md"
    >
      <UabcLogo />
      <Heading.h2 display={{ base: "none", md: "block" }} textAlign="center">
        Welcome back
      </Heading.h2>
      <Text display={{ base: "none", md: "block" }} textAlign="center">
        Please enter your details to sign in
      </Text>
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
        <Checkbox label="Remember me" />
        <Spacer />
        <UILink as={Link} href="/auth/forgot-password" textColor="white">
          Forgot Password?
        </UILink>
      </HStack>
      <Button colorScheme="primary" loading={isSubmitting} type="submit">
        Sign In
      </Button>
      <span>or separator goes here</span>
      <span>Google and Apple icons go here</span>
      <Center>
        <Text color="gray.100" justifyItems="center">
          Don't have an account?&nbsp;
          <UILink as={Link} color="gray.100" fontWeight="bold" href="/auth/login?open=true">
            Create Account
          </UILink>
        </Text>
      </Center>

      {/* <Grid gap="md" templateColumns={{ base: "1fr", md: "1fr 1fr auto" }}>
          <GridItem minW={0}>
            <Select
              data-testid="location-and-time"
              errorMessage={errors.locationAndTimeId?.message}
              icon={<CalendarClockIcon fontSize={24} />}
              isError={!!errors.locationAndTimeId}
              items={locationAndTimeOptions}
              label="Location & Time"
              registration={register("locationAndTimeId")}
              stylised
            />
          </GridItem>
          <GridItem minW={0}>
            <Select
              data-testid="skill-level"
              errorMessage={errors.skillLevel?.message}
              icon={<CircleGaugeIcon fontSize={24} />}
              isError={!!errors.skillLevel}
              items={skillLevelOptions}
              label="Skill Level"
              registration={register("skillLevel")}
              stylised
            />
          </GridItem>
          <GridItem w="full">
            <Button
              colorScheme="primary"
              loading={isSubmitting}
              size="lg"
              type="submit"
              variant="gradient"
              w="full"
            >
              {submitLabel}
            </Button>
          </GridItem>
        </Grid> */}
    </VStack>
  )
})

LoginPanel.displayName = "LoginPanel"
