import type { PlayLevel } from "@repo/shared"
import type { SelectACourtNextData, SessionItem } from "@repo/ui/components/Composite"

export type BookingFlowState = {
  step: "play-level" | "select-court" | "confirmation"
  playLevel: PlayLevel | ""
  bookingTimes: string[]
  selectedSessions: SessionItem[]
}

export type BookingFlowAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_PLAY_LEVEL"; payload: PlayLevel }
  | { type: "SET_BOOKING_TIMES"; payload: SelectACourtNextData }
  | { type: "RESET" }

export const initialState: BookingFlowState = {
  step: "play-level",
  playLevel: "",
  bookingTimes: [],
  selectedSessions: [],
}

export const createBookingFlowReducer =
  (bookings: SessionItem[]) =>
  (state: BookingFlowState, action: BookingFlowAction): BookingFlowState => {
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
            return { ...state, step: "select-court" }
          default:
            return state
        }
      case "SET_PLAY_LEVEL":
        return { ...state, playLevel: action.payload }
      case "SET_BOOKING_TIMES": {
        const selectedSessions = action.payload.bookingTimes
          .map((bookingTime) => bookings.find((booking) => booking.id === bookingTime))
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
