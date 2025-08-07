import { PlayLevel } from "@repo/shared"
import type { SelectACourtNextData, SessionItem } from "@repo/ui/components/Composite"
import { createBookingFlowReducer, initialState } from "./bookingFlowReducer"

const mockBookings: SessionItem[] = [
  {
    date: "Monday, 12th May",
    attendees: 32,
    casualAttendees: 4,
    id: "monday-session",
    name: "ABA",
    location: "ABA Location",
    startTime: "17:00",
    endTime: "19:00",
    capacity: 35,
    casualCapacity: 5,
  },
]

const mockSelectACourtData: SelectACourtNextData = {
  bookingTimes: ["monday-session"],
}

describe("bookingFlowReducer", () => {
  const bookingFlowReducer = createBookingFlowReducer(mockBookings)

  it("should handle NEXT_STEP action from play-level to select-court", () => {
    const action = { type: "NEXT_STEP" as const }
    const newState = bookingFlowReducer(initialState, action)

    expect(newState.step).toBe("select-court")
    expect(newState.playLevel).toBe("")
  })

  it("should handle NEXT_STEP action from select-court to confirmation", () => {
    const state = { ...initialState, step: "select-court" as const }
    const action = { type: "NEXT_STEP" as const }
    const newState = bookingFlowReducer(state, action)

    expect(newState.step).toBe("confirmation")
  })

  it("should handle NEXT_STEP action from confirmation (no change)", () => {
    const state = { ...initialState, step: "confirmation" as const }
    const action = { type: "NEXT_STEP" as const }
    const newState = bookingFlowReducer(state, action)

    expect(newState.step).toBe("confirmation")
  })

  it("should handle PREV_STEP action from select-court to play-level", () => {
    const state = { ...initialState, step: "select-court" as const, playLevel: PlayLevel.beginner }
    const action = { type: "PREV_STEP" as const }
    const newState = bookingFlowReducer(state, action)

    expect(newState.step).toBe("play-level")
    expect(newState.playLevel).toBe("")
  })

  it("should handle PREV_STEP action from confirmation to select-court", () => {
    const state = {
      ...initialState,
      step: "confirmation" as const,
      bookingTimes: ["session-1"],
      selectedSessions: mockBookings,
    }
    const action = { type: "PREV_STEP" as const }
    const newState = bookingFlowReducer(state, action)

    expect(newState.step).toBe("select-court")
    expect(newState.bookingTimes).toEqual(["session-1"])
    expect(newState.selectedSessions).toEqual(mockBookings)
  })

  it("should handle PREV_STEP action from play-level (no change)", () => {
    const action = { type: "PREV_STEP" as const }
    const newState = bookingFlowReducer(initialState, action)

    expect(newState.step).toBe("play-level")
  })

  it("should handle SET_PLAY_LEVEL action", () => {
    const action = { type: "SET_PLAY_LEVEL" as const, payload: PlayLevel.beginner }
    const newState = bookingFlowReducer(initialState, action)

    expect(newState.playLevel).toBe(PlayLevel.beginner)
  })

  it("should handle SET_BOOKING_TIMES action", () => {
    const action = {
      type: "SET_BOOKING_TIMES" as const,
      payload: mockSelectACourtData,
    }
    const newState = bookingFlowReducer(initialState, action)

    expect(newState.bookingTimes).toEqual(["monday-session"])
    expect(newState.selectedSessions).toHaveLength(1)
    expect(newState.selectedSessions[0]).toEqual(mockBookings[0])
  })

  it("should handle SET_BOOKING_TIMES action with non-existent booking", () => {
    const action = {
      type: "SET_BOOKING_TIMES" as const,
      payload: { bookingTimes: ["non-existent-session"] },
    }
    const newState = bookingFlowReducer(initialState, action)

    expect(newState.bookingTimes).toEqual(["non-existent-session"])
    expect(newState.selectedSessions).toEqual([])
  })

  it("should handle RESET action", () => {
    const state = {
      step: "confirmation" as const,
      playLevel: PlayLevel.beginner,
      bookingTimes: ["session-1"],
      selectedSessions: mockBookings,
    }
    const action = { type: "RESET" as const }
    const newState = bookingFlowReducer(state, action)

    expect(newState).toEqual(initialState)
  })

  it("should handle unknown action type", () => {
    const action = { type: "UNKNOWN" as never }
    const newState = bookingFlowReducer(initialState, action)

    expect(newState).toEqual(initialState)
  })

  it("should handle multiple actions in sequence", () => {
    let state = initialState

    // SET_PLAY_LEVEL
    state = bookingFlowReducer(state, { type: "SET_PLAY_LEVEL", payload: PlayLevel.beginner })
    expect(state.playLevel).toBe(PlayLevel.beginner)

    // NEXT_STEP
    state = bookingFlowReducer(state, { type: "NEXT_STEP" })
    expect(state.step).toBe("select-court")

    // SET_BOOKING_TIMES
    state = bookingFlowReducer(state, { type: "SET_BOOKING_TIMES", payload: mockSelectACourtData })
    expect(state.bookingTimes).toEqual(["monday-session"])
    expect(state.selectedSessions).toHaveLength(1)

    // NEXT_STEP
    state = bookingFlowReducer(state, { type: "NEXT_STEP" })
    expect(state.step).toBe("confirmation")

    // PREV_STEP
    state = bookingFlowReducer(state, { type: "PREV_STEP" })
    expect(state.step).toBe("select-court")
    expect(state.bookingTimes).toEqual(["monday-session"])
    expect(state.selectedSessions).toHaveLength(1)

    // PREV_STEP
    state = bookingFlowReducer(state, { type: "PREV_STEP" })
    expect(state.step).toBe("play-level")
    expect(state.playLevel).toBe("")
  })
})
