"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  formatDateWithOrdinal,
  MembershipType,
  type SelectACourtFormData,
  SelectACourtFormDataSchema,
} from "@repo/shared"
import type { GameSession, User } from "@repo/shared/payload-types"
import { type BookingTimeItem, BookingTimesCardGroup } from "@repo/ui/components/Generic"
import { ShuttleIcon, UabcLogo } from "@repo/ui/components/Icon"
import { Button, Heading, IconButton, IconWithText } from "@repo/ui/components/Primitive"
import { useBookingLimits } from "@repo/ui/hooks"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  HStack,
  VStack,
} from "@yamada-ui/react"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { memo, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Pacific/Auckland")

export type SelectACourtNextData = {
  bookingTimes: string[]
}

export type SessionItem = Pick<
  GameSession,
  "name" | "location" | "startTime" | "endTime" | "capacity" | "casualCapacity" | "id"
> & {
  disabled?: boolean
  attendees: number
  casualAttendees: number
  date: string
}

/**
 * The props for the SelectACourt component.
 */
export interface SelectACourtProps {
  /**
   * The user object.
   */
  user: Pick<User, "remainingSessions" | "role">
  /**
   * Callback function triggered when the user selects a session.
   *
   * @param value - The selected session value.
   */
  onSelect?: (value: string[] | undefined) => void
  /**
   * The sessions to display.
   */
  sessions?: SessionItem[]
  /**
   * The title of the component.
   */
  title?: string
  /**
   * Callback function triggered when the user goes back.
   */
  onBack?: () => void
  /**
   * Callback function triggered when the next button is clicked.
   * Used for navigation to the next step in multi-step forms.
   *
   * @param data - The form data including selected sessions
   */
  onNext?: (data: { bookingTimes: string[] }) => void
  /**
   * The initially selected booking times.
   */
  initialBookingTimes?: string[]
}

export const SelectACourt = memo<SelectACourtProps>(
  ({
    user,
    onSelect,
    sessions = [],
    title = "Select a court",
    onBack,
    onNext,
    initialBookingTimes = [],
  }) => {
    const { control, handleSubmit, watch } = useForm<SelectACourtFormData>({
      defaultValues: { bookingTimes: initialBookingTimes },
      resolver: zodResolver(SelectACourtFormDataSchema),
    })

    const selectedSessions = watch("bookingTimes") || []

    const { isMember, maxBookings, sessionsLabel } = useBookingLimits({
      user,
      selectedCount: selectedSessions.length,
    })

    const onSubmit = useCallback(
      (data: SelectACourtFormData) => {
        const bookingTimes = isMember ? data.bookingTimes : data.bookingTimes.slice(-1)
        onNext?.({ bookingTimes })
        window.scrollTo({ top: 0, behavior: "smooth" })
      },
      [isMember, onNext],
    )

    const processedSessions: BookingTimeItem[] = useMemo(() => {
      return sessions.map((session) => {
        const isSelected = selectedSessions.includes(session.id)
        const isCapacityReached =
          user.role === MembershipType.casual
            ? session.casualAttendees >= session.casualCapacity
            : session.attendees >= session.capacity
        const capReached = selectedSessions.length >= maxBookings || isCapacityReached

        return {
          value: session.id,
          memberAttendees: `${session.attendees} / ${session.capacity}`,
          casualAttendees: `${session.casualAttendees} / ${session.casualCapacity}`,
          disabled: isSelected ? false : session.disabled || capReached,
          addon: session.name ?? undefined,
          description: session.location ?? undefined,
          label: formatDateWithOrdinal(session.date),
        }
      })
    }, [sessions, selectedSessions, maxBookings, user.role])

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
        flex={1}
        gap="md"
        justifyContent="center"
        layerStyle="gradientBorder"
        onSubmit={handleSubmit(onSubmit)}
        position="relative"
        px={{ base: "md", md: "xl" }}
        py="lg"
        rounded="3xl"
        w="full"
      >
        <CardHeader pt="0" px="0" w="full">
          <HStack
            alignItems="center"
            display={{ base: "flex", md: "grid" }}
            flexDirection={{ base: "column", sm: "row" }}
            gap={{ base: "sm", md: "0" }}
            gridTemplateColumns={{ md: "1fr auto 1fr" }}
            justifyContent="space-between"
            w="full"
          >
            <IconButton
              aria-label="Back"
              color={["black", "white"]}
              icon={<ArrowLeftIcon />}
              left={{ base: "md", md: "0" }}
              onClick={onBack}
              position={{ base: "absolute", md: "relative" }}
              size={{ base: "md", md: "lg" }}
              top={{ base: "md", md: "0" }}
              variant="ghost"
            />

            <Heading.h2
              color={{ base: "primary", md: "white" }}
              fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              fontWeight={{ base: "semibold", md: "medium" }}
              order={{ base: 2, sm: 1 }}
              textAlign="center"
            >
              {title}
            </Heading.h2>

            <Box order={{ base: 3, sm: 2 }} />
          </HStack>
        </CardHeader>

        <CardBody position="relative" w="full">
          <Center
            alignItems="center"
            display={{ base: "none", md: "flex" }}
            filter="blur(10px) brightness(0.5)"
            inset="0"
            justifyContent="center"
            position="absolute"
            userSelect="none"
            zIndex={0}
          >
            <UabcLogo boxSize={{ base: "sm", xl: "md" }} opacity={0.5} />
          </Center>

          <VStack gap="md" w="full">
            <Center>
              <IconWithText icon={<ShuttleIcon />} label={sessionsLabel} textWrap="balance" />
            </Center>

            <BookingTimesCardGroup
              control={control}
              display="grid"
              gap={{ base: "sm", md: "md" }}
              gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
              items={processedSessions}
              name="bookingTimes"
              onChange={handleSessionChange}
            />
          </VStack>
        </CardBody>

        <CardFooter>
          <Center w="full">
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
