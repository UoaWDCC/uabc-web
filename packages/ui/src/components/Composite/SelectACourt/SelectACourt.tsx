"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  MAX_CASUAL_BOOKINGS,
  MAX_MEMBER_BOOKINGS,
  MembershipType,
  type SelectACourtFormData,
  SelectACourtFormDataSchema,
} from "@repo/shared"
import { BookingTimesCardGroup } from "@repo/ui/components/Generic"
import { ShuttleIcon } from "@repo/ui/components/Icon"
import { Button, Heading, IconWithText } from "@repo/ui/components/Primitive"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  HStack,
  IconButton,
} from "@yamada-ui/react"
import { memo, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"

export type SelectACourtNextData = {
  bookingTimes: string[]
}

export interface SessionItem {
  label: string
  memberAttendees: string
  casualAttendees: string
  value: string
  addon: string
  description: string
  disabled?: boolean
}

/**
 * The props for the SelectACourt component.
 */
export interface SelectACourtProps {
  /**
   * The membership type of the user.
   */
  membershipType?: MembershipType
  onSelect?: (value: string[] | undefined) => void
  sessions?: SessionItem[]
  title?: string
  onBack?: () => void
  /**
   * Callback function triggered when the next button is clicked.
   * Used for navigation to the next step in multi-step forms.
   *
   * @param data - The form data including selected sessions
   */
  onNext?: (data: { bookingTimes: string[] }) => void
}

export const SelectACourt = memo<SelectACourtProps>(
  ({ membershipType, onSelect, sessions = [], title = "Select a court", onBack, onNext }) => {
    const isMember = useMemo(
      () => membershipType === MembershipType.member || membershipType === MembershipType.admin,
      [membershipType],
    )

    const maxBookings = useMemo(
      () => (isMember ? MAX_MEMBER_BOOKINGS : MAX_CASUAL_BOOKINGS),
      [isMember],
    )

    const { control, handleSubmit, watch } = useForm<SelectACourtFormData>({
      defaultValues: { bookingTimes: [] },
      resolver: zodResolver(SelectACourtFormDataSchema),
    })

    const selectedSessions = watch("bookingTimes") || []
    const sessionsLeft = useMemo(
      () => maxBookings - selectedSessions.length,
      [maxBookings, selectedSessions.length],
    )

    const onSubmit = useCallback(
      (data: SelectACourtFormData) => {
        const bookingTimes = isMember ? data.bookingTimes : data.bookingTimes.slice(-1)
        onNext?.({ bookingTimes })
      },
      [isMember, onNext],
    )

    const processedSessions = useMemo(() => {
      return sessions.map((session) => {
        const isSelected = selectedSessions.includes(session.value)
        const capReached = selectedSessions.length >= maxBookings

        return {
          ...session,
          memberAttendees: isMember ? session.memberAttendees : undefined,
          casualAttendees: isMember ? session.casualAttendees : undefined,
          disabled: isSelected ? false : session.disabled || capReached,
        }
      })
    }, [sessions, selectedSessions, maxBookings, isMember])

    const handleSessionChange = useCallback(
      (newSelection: string[]) => {
        if (isMember) {
          const validSelection = newSelection.slice(0, maxBookings)
          onSelect?.(validSelection)
          return validSelection
        }

        const singleSelection = newSelection.slice(-1)
        onSelect?.(singleSelection)
        return singleSelection
      },
      [isMember, maxBookings, onSelect],
    )

    return (
      <Card
        alignItems="center"
        as="form"
        backdropBlur="15px"
        backdropFilter="auto"
        bg={["secondary.50", "secondary.800"]}
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap="md"
        justifyContent="center"
        layerStyle="gradientBorder"
        onSubmit={handleSubmit(onSubmit)}
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
              label={`Sessions Left: ${sessionsLeft}`}
            />
          </HStack>
        </CardHeader>

        <CardBody p="0" w="full">
          <BookingTimesCardGroup
            control={control}
            display="grid"
            gap={{ base: "sm", md: "md" }}
            gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
            items={processedSessions}
            name="bookingTimes"
            onChange={handleSessionChange}
          />
        </CardBody>

        <CardFooter>
          <Center mt="md" py="md" w="full">
            <Button
              colorScheme="primary"
              disabled={selectedSessions.length === 0}
              endIcon={<ArrowRightIcon />}
              size="lg"
              type="submit"
            >
              Next
            </Button>
          </Center>
        </CardFooter>
      </Card>
    )
  },
)

SelectACourt.displayName = "SelectACourt"
