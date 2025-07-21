"use client"

import { BookingTimesCardGroup } from "@repo/ui/components/Generic"
import { ShuttleIcon } from "@repo/ui/components/Icon"
import { Button, Heading, IconWithText } from "@repo/ui/components/Primitive"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import { Card, CardBody, CardHeader, Center, HStack, IconButton } from "@yamada-ui/react"
import { memo, useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"

/**
 * The type of user variant for the booking session.
 */
type Variant = "member" | "casual"

/**
 * Represents a single booking session item.
 */
interface SessionItem {
  /**
   * The display label for the session (e.g., "Monday, 12th May").
   */
  label: string
  /**
   * The number of member attendees in format "current/max" (e.g., "32/35").
   */
  memberAttendees: string
  /**
   * The number of casual attendees in format "current/max" (e.g., "4/5").
   */
  casualAttendees: string
  /**
   * The unique identifier for the session.
   */
  value: string
  /**
   * The location or venue name for the session.
   */
  addon: string
  /**
   * The time description for the session (e.g., "7:30 - 10pm").
   */
  description: string
  /**
   * Whether the session is disabled for selection.
   */
  disabled?: boolean
}

/**
 * Props for the SelectACourt component.
 */
export interface SelectACourtProps {
  /**
   * The user variant type that determines selection behavior.
   * - "member": Can select up to 2 sessions
   * - "casual": Can select only 1 session
   *
   * @default "member"
   */
  variant?: Variant

  /**
   * Callback function triggered when sessions are selected or deselected.
   *
   * @param value - The selected session value(s). For members: string[], for casual: string | undefined
   */
  onSelect?: (value: string | string[] | undefined) => void

  /**
   * Array of available booking sessions to display.
   *
   * @default []
   */
  sessions?: SessionItem[]

  /**
   * The title displayed in the component header.
   *
   * @default "Select a court"
   */
  title?: string

  /**
   * Callback function triggered when the back button is clicked.
   * Used for navigation to the previous step in multi-step forms.
   */
  onBack?: () => void

  /**
   * Callback function triggered when the next button is clicked.
   * Used for navigation to the next step in multi-step forms.
   *
   * @param data - The form data including selected sessions
   */
  onNext?: (data: any) => void
}

/**
 * SelectACourt component for choosing booking sessions in a multi-step form flow.
 *
 * This component provides a card-based interface for selecting available booking sessions.
 * It supports both member and casual user types with different selection limits and
 * integrates with React Hook Form for form state management.
 *
 * @param props SelectACourt component properties
 * @returns A session selection component
 *
 * @example
 * // Basic usage with member variant
 * <SelectACourt
 *   variant="member"
 *   sessions={[
 *     {
 *       label: "Monday, 12th May",
 *       memberAttendees: "32/35",
 *       casualAttendees: "4/5",
 *       value: "booking-123",
 *       addon: "UoA Hiwa Center",
 *       description: "7:30 - 10pm"
 *     }
 *   ]}
 *   onSelect={(value) => console.log("Selected:", value)}
 * />
 *
 * @example
 * // Multi-step form integration
 * <SelectACourt
 *   variant="casual"
 *   title="Choose Your Session"
 *   sessions={availableSessions}
 *   onBack={() => setCurrentStep(currentStep - 1)}
 *   onNext={(data) => {
 *     setFormData(data)
 *     setCurrentStep(currentStep + 1)
 *   }}
 *   onSelect={(value) => setSelectedSessions(value)}
 * />
 *
 * @example
 * // With custom session data
 * const customSessions = [
 *   {
 *     label: "Wednesday, 14th May",
 *     memberAttendees: "28/35",
 *     casualAttendees: "2/5",
 *     value: "wed-session",
 *     addon: "Kings School",
 *     description: "7:30 - 10:00 pm",
 *     disabled: false
 *   }
 * ]
 *
 * <SelectACourt
 *   sessions={customSessions}
 *   onSelect={handleSessionSelection}
 * />
 */
export const SelectACourt = memo<SelectACourtProps>(
  ({ variant = "member", onSelect, sessions = [], title = "Select a court", onBack, onNext }) => {
    const isMember = variant === "member"
    const max = isMember ? 2 : 1

    const {
      control,
      setValue,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm({
      defaultValues: {
        bookingTimes: isMember ? [] : "",
      },
    })

    const watched = useWatch({ control, name: "bookingTimes" })

    const selectionArray: string[] = isMember
      ? (watched as string[])
      : watched
        ? [watched as string]
        : []

    useEffect(() => {
      if (isMember && watched.length > max) {
        setValue("bookingTimes", watched.slice(0, max), { shouldDirty: true })
      }
    }, [watched, isMember, max, setValue])

    useEffect(() => {
      onSelect?.(selectionArray)
    }, [selectionArray, onSelect])

    const processedSessions = useMemo(
      () =>
        sessions.map((s) => {
          const selected = selectionArray.includes(s.value)
          const capReached = selectionArray.length >= max
          return {
            ...s,
            memberAttendees: isMember ? s.memberAttendees : undefined,
            casualAttendees: isMember ? s.casualAttendees : undefined,
            disabled: s.disabled || (isMember ? capReached && !selected : !!watched && !selected),
          }
        }),
      [sessions, selectionArray, max, isMember, watched],
    )

    const handleNext = (data: any) => {
      if (onNext) {
        onNext(data)
      } else {
        console.log("Next step with data:", data)
      }
    }

    return (
      <Card
        alignItems="center"
        backdropBlur="15px"
        backdropFilter="auto"
        bg={["secondary.50", "secondary.800"]}
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap="md"
        justifyContent="center"
        layerStyle="gradientBorder"
        px={{ base: "md", md: "xl" }}
        py="lg"
        rounded="3xl"
      >
        <CardHeader pt="0" w="full">
          <HStack alignItems="center" display="grid" gridTemplateColumns="1fr auto 1fr" w="full">
            <IconButton
              aria-label="Back"
              icon={<ArrowLeftIcon />}
              justifySelf="start"
              onClick={onBack}
              size="lg"
              variant="ghost"
            />

            <Heading.h2
              color={{ base: "primary", md: "white" }}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight={{ base: "semibold", md: "medium" }}
              textAlign="center"
            >
              {title}
            </Heading.h2>

            <IconWithText
              icon={<ShuttleIcon />}
              justifySelf="end"
              label={`Sessions Left: ${max - selectionArray.length}`}
            />
          </HStack>
        </CardHeader>
        <CardBody p="0" w="full">
          <form onSubmit={handleSubmit(handleNext)} style={{ width: "100%" }}>
            <BookingTimesCardGroup
              control={control}
              display="grid"
              gap={{ base: "sm", md: "md" }}
              gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
              items={processedSessions} // Use the computed sessions from useMemo
              name="bookingTimes"
            />
            <Center mt="md" py="md" w="full">
              <Button
                colorScheme="primary"
                endIcon={<ArrowRightIcon />}
                isDisabled={selectionArray.length === 0}
                isLoading={isSubmitting}
                size="lg"
                type="submit"
              >
                Next
              </Button>
            </Center>
          </form>
        </CardBody>
      </Card>
    )
  },
)

SelectACourt.displayName = "SelectACourt"
