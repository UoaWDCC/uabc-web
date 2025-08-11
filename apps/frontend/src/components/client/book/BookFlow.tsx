"use client"

import { type MembershipType, mockSessions, PlayLevel, Popup, type SessionItem } from "@repo/shared"
import type { SelectACourtNextData } from "@repo/ui/components/Composite"
import { BookingConfirmation, SelectACourt } from "@repo/ui/components/Composite"
import { BookACourt } from "@repo/ui/components/Generic"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { usePopupState, useQuickBookProcessor } from "@repo/ui/hooks"
import { CircleAlertIcon } from "@yamada-ui/lucide"
import { EmptyState, VStack } from "@yamada-ui/react"
import NextLink from "next/link"
import { parseAsStringEnum, useQueryState } from "nuqs"
import { type FC, useEffect, useReducer, useRef } from "react"
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
  /**
   * Sessions to drive the booking flow. Defaults to shared mockSessions.
   */
  sessions?: SessionItem[]
}

/**
 * The main component for the booking flow.
 */
export const BookFlow: FC<BookFlowProps> = ({ auth, sessions = mockSessions }) => {
  const bookingFlowReducer = createBookingFlowReducer(sessions)
  const [state, dispatch] = useReducer(bookingFlowReducer, initialState)
  const hasProcessedQuickBook = useRef(false)

  const { open: openBookingConfirmedPopup } = usePopupState({
    popupId: Popup.BOOKING_CONFIRMED,
    initialValue: auth.user.role as MembershipType,
  })

  // Process quick book data using the dedicated hook
  const { isProcessing, processQuickBookData, saveCurrentBookingState } = useQuickBookProcessor({
    sessions,
    currentStep: state.step,
    dispatch,
    user: auth.user,
  })

  // Process quick book data only on initial load, not when navigating back
  useEffect(() => {
    if (isProcessing && !hasProcessedQuickBook.current) {
      hasProcessedQuickBook.current = true
      processQuickBookData()
    }
  }, [isProcessing, processQuickBookData])

  const [, setPlayLevelQuery] = useQueryState(
    "playLevel",
    parseAsStringEnum<PlayLevel>(Object.values(PlayLevel)),
  )

  const handlePlayLevelSelect = (level: PlayLevel) => {
    dispatch({ type: "SET_PLAY_LEVEL", payload: level })
    setPlayLevelQuery(level)
    dispatch({ type: "NEXT_STEP" })
  }

  const handleSelectCourt = (data: SelectACourtNextData) => {
    dispatch({ type: "SET_BOOKING_TIMES", payload: data })
    // Save current booking state before moving to next step
    saveCurrentBookingState(state.playLevel as PlayLevel, data.bookingTimes)
    dispatch({ type: "NEXT_STEP" })
  }

  const handleConfirmBooking = () => {
    openBookingConfirmedPopup()
    dispatch({ type: "RESET" })
  }

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  if (!sessions.length) {
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
          sessions={sessions}
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
