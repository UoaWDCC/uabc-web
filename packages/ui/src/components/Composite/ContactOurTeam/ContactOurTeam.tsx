"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type ContactFormData, ContactFormDataSchema, type ContactInfo } from "@repo/shared"
import {
  AutoCompleteType,
  Button,
  Heading,
  InputType,
  TextInput,
} from "@repo/ui/components/Primitive"
import { useMutation } from "@tanstack/react-query"
import { PhoneIcon } from "@yamada-ui/lucide"
import {
  FormControl,
  HStack,
  Icon,
  Link,
  memo,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@yamada-ui/react"
import NextLink from "next/link"
import { type SubmitHandler, useForm } from "react-hook-form"
import type { SocialLink } from "../Footer/constants"
import { FooterSocialLinks } from "../Footer/FooterSocialLinks"

/**
 * Props for {@link ContactOurTeam} component
 */
export interface ContactOurTeamProps {
  /**
   * Submit handler called when user submits the contact form.
   */
  onSubmit?: (data: ContactFormData) => Promise<void>
  /**
   * Whether the form is in a loading state
   */
  isLoading?: boolean
  /**
   * Array of social media links to display
   */
  socialLinks: SocialLink[]
  /**
   * Contact information for different categories
   */
  contactInfo?: ContactInfo
}

/**
 * Contact our team component with left info section and right form section.
 * Displays contact information and provides a form for users to reach out.
 *
 * @param props ContactOurTeam component props
 * @returns A contact our team component
 */
export const ContactOurTeam = memo(
  ({
    onSubmit,
    isLoading,
    socialLinks,
    contactInfo = {
      generalEmail: "badminton.au@gmail.com",
      bookingsEmail: "badminton.au@gmail.com",
      phoneNumber: "000-000-000",
      bookingsDescription:
        "Guest bookings, date changes, any clarification about your stay at the lodge",
    },
  }: ContactOurTeamProps) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<ContactFormData>({
      resolver: zodResolver(ContactFormDataSchema),
    })

    const mutation = useMutation({
      mutationFn: async (data: ContactFormData) => {
        await onSubmit?.(data)
      },
      onSuccess: () => {
        reset()
      },
    })

    const handleFormSubmit: SubmitHandler<ContactFormData> = async (data) => {
      await mutation.mutateAsync(data)
    }

    const isFormLoading = isLoading ?? isSubmitting ?? mutation.isPending

    return (
      <Stack flexDirection={{ base: "column", lg: "row" }} gap="xl" maxW="7xl" w="full">
        {/* Left Info Section */}
        <VStack flex="1" gap="lg">
          <VStack gap="md">
            <Heading.h1
              bgClip="text"
              bgGradient="linear(to-r, blue.500, purple.500)"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="semibold"
              lineHeight="tight"
            >
              Contact our team
            </Heading.h1>
            <Text color="gray.200" fontSize="lg">
              Let's help you with your problem
            </Text>
          </VStack>

          {/* Contact Information */}
          <VStack gap="md">
            <HStack gap="sm">
              <Icon as={PhoneIcon} color="white" fontSize="lg" />
              <Text color="white" fontSize="md">
                {contactInfo.phoneNumber}
              </Text>
            </HStack>

            <FooterSocialLinks
              iconButtonProps={{
                colorScheme: "secondary",
                size: "md",
              }}
              iconProps={{
                color: "white",
                fontSize: "lg",
              }}
              links={socialLinks}
            />
          </VStack>

          {/* Contact Categories */}
          <VStack gap="lg" w="full">
            <VStack gap="md">
              <Heading.h2 color="gray.100" fontSize="2xl" fontWeight="semibold">
                General Inquiries
              </Heading.h2>
              <Link
                as={NextLink}
                color="primary"
                fontSize="lg"
                fontWeight="medium"
                href={`mailto:${contactInfo.generalEmail}`}
              >
                {contactInfo.generalEmail}
              </Link>
            </VStack>

            <VStack gap="md">
              <Heading.h2 color="gray.100" fontSize="2xl" fontWeight="semibold">
                Bookings
              </Heading.h2>
              <Text color="gray.100" fontSize="lg" fontWeight="medium">
                {contactInfo.bookingsDescription}
              </Text>
              <Link
                as={NextLink}
                color="primary"
                fontSize="lg"
                fontWeight="medium"
                href={`mailto:${contactInfo.bookingsEmail}`}
              >
                {contactInfo.bookingsEmail}
              </Link>
            </VStack>
          </VStack>
        </VStack>

        {/* Right Form Section */}
        <VStack
          as="form"
          bg={["secondary.50", "secondary.900"]}
          flex="1"
          gap="lg"
          layerStyle="gradientBorder"
          onSubmit={handleSubmit(handleFormSubmit)}
          p="xl"
          rounded="3xl"
          w="full"
        >
          <FormControl
            errorMessage={errors.firstName?.message}
            invalid={!!errors.firstName}
            label="First name"
            required
          >
            <TextInput
              autoComplete={AutoCompleteType.GivenName}
              data-testid="firstName"
              placeholder="First name"
              type={InputType.Text}
              {...register("firstName")}
            />
          </FormControl>

          <FormControl
            errorMessage={errors.lastName?.message}
            invalid={!!errors.lastName}
            label="Last name"
            required
          >
            <TextInput
              autoComplete={AutoCompleteType.FamilyName}
              data-testid="lastName"
              placeholder="Last name"
              type={InputType.Text}
              {...register("lastName")}
            />
          </FormControl>

          <FormControl
            errorMessage={errors.universityEmail?.message}
            invalid={!!errors.universityEmail}
            label="University email"
            required
          >
            <TextInput
              autoComplete={AutoCompleteType.Email}
              data-testid="universityEmail"
              placeholder="University email"
              type={InputType.Email}
              {...register("universityEmail")}
            />
          </FormControl>

          <FormControl
            errorMessage={errors.message?.message}
            invalid={!!errors.message}
            label="Message"
            required
          >
            <Textarea
              data-testid="message"
              minH="32"
              placeholder="Message"
              resize="vertical"
              variant="gradient"
              {...register("message")}
            />
          </FormControl>

          <Button
            colorScheme="secondary"
            loading={isFormLoading}
            loadingText="Submitting..."
            type="submit"
            w="full"
          >
            Submit
          </Button>
        </VStack>
      </Stack>
    )
  },
)

ContactOurTeam.displayName = "ContactOurTeam"
