"use client"

import { MembershipType, PlayLevel, Popup } from "@repo/shared"
import type { SelectACourtNextData, SessionItem } from "@repo/ui/components/Composite"
import { BookingConfirmation, SelectACourt } from "@repo/ui/components/Composite"
import { BookACourt } from "@repo/ui/components/Generic"
import { Button } from "@repo/ui/components/Primitive"
import { usePopupState } from "@repo/ui/hooks"
import { CircleAlertIcon } from "@yamada-ui/lucide"
import { EmptyState } from "@yamada-ui/react"
import NextLink from "next/link"
import { parseAsStringEnum, useQueryState } from "nuqs"
import { type FC, useReducer } from "react"
import type { AuthContextValueWithUser } from "@/context/RoleWrappers"

type BookFlowProps = {
  auth: AuthContextValueWithUser
}

type BookingFlowState = {
  step: "play-level" | "select-court" | "confirmation"
  playLevel: PlayLevel | ""
  bookingTimes: string[]
  selectedSessions: SessionItem[]
}

type BookingFlowAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_PLAY_LEVEL"; payload: PlayLevel }
  | { type: "SET_BOOKING_TIMES"; payload: SelectACourtNextData }
  | { type: "RESET" }

const bookings: SessionItem[] = [
  {
    label: "Monday, 12th May",
    memberAttendees: "32/35",
    casualAttendees: "4/5",
    value: "monday-session",
    addon: "ABA",
    description: "5:00 - 7:00 pm",
  },
  {
    label: "Wednesday, 14th May",
    memberAttendees: "28/35",
    casualAttendees: "2/5",
    value: "wednesday-session",
    addon: "UoA Rec",
    description: "7:30 - 9:30 pm",
  },
  {
    label: "Thursday, 15th May",
    memberAttendees: "25/30",
    casualAttendees: "3/5",
    value: "thursday-session",
    addon: "Kings School",
    description: "7:30 - 10:00 pm",
  },
  {
    label: "Friday, 16th May",
    memberAttendees: "30/35",
    casualAttendees: "1/5",
    value: "friday-session",
    addon: "UoA Rec Centre",
    description: "7:30 - 9:30 pm",
  },
  {
    label: "Saturday, 17th May",
    memberAttendees: "20/25",
    casualAttendees: "2/3",
    value: "saturday-session",
    addon: "ABA",
    description: "4:00 - 6:00 pm",
  },
]

const initialState: BookingFlowState = {
  step: "play-level",
  playLevel: "",
  bookingTimes: [],
  selectedSessions: [],
}

const bookingFlowReducer = (
  state: BookingFlowState,
  action: BookingFlowAction,
): BookingFlowState => {
  switch (action.type) {
    case "NEXT_STEP":
      switch (state.step) {
        case "play-level":
          return { ...state, step: "select-court" }
        case "select-court":
          return { ...state, step: "confirmation" }
        default:
          return state
      }
    case "PREV_STEP":
      switch (state.step) {
        case "select-court":
          return { ...state, step: "play-level", playLevel: "" }
        case "confirmation":
          return { ...state, step: "select-court", bookingTimes: [], selectedSessions: [] }
        default:
          return state
      }
    case "SET_PLAY_LEVEL":
      return { ...state, playLevel: action.payload }
    case "SET_BOOKING_TIMES": {
      const selectedSessions = action.payload.bookingTimes
        .map((bookingTime) => bookings.find((booking) => booking.value === bookingTime))
        .filter((session): session is SessionItem => session !== undefined)
      return {
        ...state,
        bookingTimes: action.payload.bookingTimes,
        selectedSessions,
      }
    }
    case "RESET":
      return initialState
    default:
      return state
  }
}

export const BookFlow: FC<BookFlowProps> = ({ auth }) => {
  const remainingSessions = auth.user.remainingSessions ?? 0
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
  }

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  if (!bookings.length) {
    return (
      <EmptyState
        description="There are no bookings available at the moment."
        indicator={<CircleAlertIcon />}
        title="No bookings found"
      >
        <Button as={NextLink} href="/profile">
          Go back to profile
        </Button>
      </EmptyState>
    )
  }

  if (remainingSessions === 0) {
    return (
      <EmptyState
        description="You have no remaining sessions."
        indicator={<CircleAlertIcon />}
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
      {state.step === "play-level" && <BookACourt onSelect={handlePlayLevelSelect} />}
      {state.step === "select-court" && (
        <SelectACourt
          membershipType={auth.user.role as MembershipType}
          onBack={handleBack}
          onNext={handleSelectCourt}
          remainingSessions={remainingSessions}
          sessions={bookings}
        />
      )}
      {state.step === "confirmation" && state.selectedSessions.length > 0 && (
        <BookingConfirmation
          bookingData={state.selectedSessions.map((session) => ({
            date: session.label,
            time: session.description,
            location: session.addon,
            attendees:
              auth.user.role === MembershipType.member
                ? session.memberAttendees
                : session.casualAttendees,
            sessionsLeft: remainingSessions,
          }))}
          membershipType={auth.user.role as MembershipType}
          onBack={handleBack}
          onConfirm={handleConfirmBooking}
        />
      )}
    </>
  )
}
