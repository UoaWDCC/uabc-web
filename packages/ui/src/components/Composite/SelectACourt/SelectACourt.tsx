"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { SessionItem } from "@repo/shared"
import {
  formatDateWithOrdinal,
  MembershipType,
  type SelectACourtFormData,
  SelectACourtFormDataSchema,
} from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { type BookingTimeItem, BookingTimesCardGroup } from "@repo/ui/components/Generic"
import { ShuttleIcon, UabcLogo } from "@repo/ui/components/Icon"
import { Button, Heading, IconButton, IconWithText } from "@repo/ui/components/Primitive"
import { useBookingLimits } from "@repo/ui/hooks"
import { ArrowLeftIcon, ArrowRightIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Grid,
  GridItem,
  Text,
  VStack,
} from "@yamada-ui/react"
import { memo, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"

export type SelectACourtNextData = {
  bookingTimes: string[]
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
  /**
   * The number of already booked sessions by the user.
   */
  numberBookedSessions?: number
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
    numberBookedSessions = 0,
  }) => {
    const { control, handleSubmit, watch } = useForm<SelectACourtFormData>({
      defaultValues: { bookingTimes: initialBookingTimes },
      resolver: zodResolver(SelectACourtFormDataSchema),
    })

    const selectedSessions = watch("bookingTimes") || []

    const { isMember, maxBookings, sessionsLabel } = useBookingLimits({
      user,
      selectedCount: selectedSessions.length,
      alreadyBookedCount: numberBookedSessions,
    })

    const [weeklyText, totalText] = useMemo(() => {
      const [weekly, total] = sessionsLabel.split(" • ")
      return [weekly ?? sessionsLabel, total ?? ""]
    }, [sessionsLabel])

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
        const wouldExceedLimit = !isSelected && maxBookings === 0
        const capReached = wouldExceedLimit || isCapacityReached

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
        <CardHeader pt="0" w="full">
          <Grid
            alignItems="center"
            flexDirection={{ base: "column", sm: "row" }}
            gap={{ base: "sm", md: "0" }}
            gridTemplateColumns="1fr auto 1fr"
            justifyContent="space-between"
            w="full"
          >
            <GridItem>
              <IconButton
                aria-label="Back"
                color={["black", "white"]}
                icon={<ArrowLeftIcon />}
                onClick={onBack}
                size={{ base: "md", md: "lg" }}
                variant="ghost"
              />
            </GridItem>

            <GridItem>
              <Heading.h2
                color={{ base: "primary", md: "white" }}
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                fontWeight={{ base: "semibold", md: "medium" }}
                order={{ base: 2, sm: 1 }}
                textAlign="center"
              >
                {title}
              </Heading.h2>
            </GridItem>
            <GridItem />
          </Grid>
        </CardHeader>

        <CardBody position="relative" w="full">
          <Center
            alignItems="center"
            display={{ base: "none", md: "flex" }}
            filter="blur(10px) brightness(0.5)"
            inset="0"
            justifyContent="center"
            pointerEvents="none"
            position="absolute"
            userSelect="none"
            zIndex={-1}
          >
            <UabcLogo boxSize={{ base: "sm", xl: "md" }} opacity={0.5} />
          </Center>

          <VStack gap="md" w="full">
            <Center display={{ base: "none", md: "flex" }}>
              <IconWithText icon={<ShuttleIcon />} label={sessionsLabel} />
            </Center>
            <Grid
              display={{ base: "grid", md: "none" }}
              gap="sm"
              gridTemplateColumns="1fr auto 1fr"
              w="full"
            >
              <GridItem as={Center}>
                <ShuttleIcon />
              </GridItem>
              <GridItem>
                <Grid
                  gap="sm"
                  gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  textAlign={{ base: "center", md: "left" }}
                >
                  <GridItem>
                    <Text>{weeklyText}</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{totalText}</Text>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem />
            </Grid>

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
