"use client"

import { type MembershipType, PlayLevel, Popup } from "@repo/shared"
import type { SelectACourtNextData, SessionItem } from "@repo/ui/components/Composite"
import { BookingConfirmation, SelectACourt } from "@repo/ui/components/Composite"
import { BookACourt } from "@repo/ui/components/Generic"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { usePopupState } from "@repo/ui/hooks"
import { CircleAlertIcon } from "@yamada-ui/lucide"
import { EmptyState, VStack } from "@yamada-ui/react"
import NextLink from "next/link"
import { parseAsStringEnum, useQueryState } from "nuqs"
import { type FC, useReducer } from "react"
import type { AuthContextValueWithUser } from "@/context/RoleWrappers"
import { createBookingFlowReducer, initialState } from "./bookingFlowReducer"

/**
 * Props for the BookFlow component.
 */
type BookFlowProps = {
  /**
   * The authentication context value with user.
   */
  auth: AuthContextValueWithUser
}

/**
 * TODO: Mock bookings data - this should be moved to a proper data source
 */
const bookings: SessionItem[] = [
  {
    id: "monday-session",
    name: "ABA",
    location: "ABA Location",
    startTime: "17:00",
    endTime: "19:00",
    capacity: 35,
    casualCapacity: 5,
    attendees: 35,
    casualAttendees: 5,
    date: "2025-01-01",
  },
  {
    id: "wednesday-session",
    name: "UoA Rec Centre",
    location: "17 Symonds Street",
    startTime: "19:30",
    endTime: "21:30",
    capacity: 35,
    casualCapacity: 5,
    attendees: 20,
    casualAttendees: 1,
    date: "2025-01-03",
  },
  {
    id: "thursday-session",
    name: "Kings School",
    location: "Kings School Location",
    startTime: "19:30",
    endTime: "22:00",
    capacity: 30,
    casualCapacity: 5,
    attendees: 26,
    casualAttendees: 3,
    date: "2025-01-04",
  },
  {
    id: "friday-session",
    name: "UoA Rec Centre",
    location: "17 Symonds Street",
    startTime: "19:30",
    endTime: "21:30",
    capacity: 35,
    casualCapacity: 5,
    attendees: 35,
    casualAttendees: 5,
    date: "2025-01-05",
  },
  {
    id: "saturday-session",
    name: "ABA",
    location: "ABA Location",
    startTime: "16:00",
    endTime: "18:00",
    capacity: 25,
    casualCapacity: 3,
    attendees: 15,
    casualAttendees: 2,
    date: "2025-01-06",
  },
]

/**
 * The main component for the booking flow.
 */
export const BookFlow: FC<BookFlowProps> = ({ auth }) => {
  const bookingFlowReducer = createBookingFlowReducer(bookings)
  const [state, dispatch] = useReducer(bookingFlowReducer, initialState)
  const [, setPlayLevel] = useQueryState(
    "playLevel",
    parseAsStringEnum<PlayLevel>(Object.values(PlayLevel)),
  )

  const { open: openBookingConfirmedPopup } = usePopupState({
    popupId: Popup.BOOKING_CONFIRMED,
    initialValue: auth.user.role as MembershipType,
  })

  const handlePlayLevelSelect = (level: PlayLevel) => {
    dispatch({ type: "SET_PLAY_LEVEL", payload: level })
    setPlayLevel(level)
    dispatch({ type: "NEXT_STEP" })
  }

  const handleSelectCourt = (data: SelectACourtNextData) => {
    dispatch({ type: "SET_BOOKING_TIMES", payload: data })
    dispatch({ type: "NEXT_STEP" })
  }

  const handleConfirmBooking = () => {
    openBookingConfirmedPopup()
    dispatch({ type: "RESET" })
  }

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  if (!bookings.length) {
    return (
      <EmptyState
        description="There are no bookings available at the moment."
        indicator={<CircleAlertIcon />}
        placeSelf="center"
        title="No bookings found"
      >
        <Button as={NextLink} href="/profile">
          Go back to profile
        </Button>
      </EmptyState>
    )
  }

  if (auth.user.remainingSessions === 0) {
    return (
      <EmptyState
        description="You have no remaining sessions."
        indicator={<CircleAlertIcon />}
        placeSelf="center"
        title="No remaining sessions"
      >
        <Button as={NextLink} href="/profile">
          Go back to profile
        </Button>
      </EmptyState>
    )
  }

  return (
    <>
      {state.step === "play-level" ? (
        <VStack flex={1} gap="lg" textAlign="center">
          <Heading.h2 fontSize="3xl">Book a court</Heading.h2>
          <BookACourt onSelect={handlePlayLevelSelect} />
        </VStack>
      ) : state.step === "select-court" ? (
        <SelectACourt
          initialBookingTimes={state.bookingTimes}
          onBack={handleBack}
          onNext={handleSelectCourt}
          sessions={bookings}
          user={auth.user}
        />
      ) : state.step === "confirmation" ? (
        <BookingConfirmation
          bookingData={state.selectedSessions ?? []}
          onBack={handleBack}
          onConfirm={handleConfirmBooking}
          user={auth.user}
        />
      ) : null}
    </>
  )
}
