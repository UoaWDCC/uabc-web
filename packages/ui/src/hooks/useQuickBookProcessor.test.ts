import { MembershipType, PlayLevel } from "@repo/shared"
import type { SessionItem } from "@repo/ui/components/Composite"
import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useQuickBookProcessor } from "./useQuickBookProcessor"

// Mock the dependencies
vi.mock("./storage/quickBookStorage", () => ({
  useQuickBookStorage: vi.fn(),
}))

vi.mock("nuqs", () => ({
  useQueryState: vi.fn(() => [null, vi.fn()]),
  parseAsStringEnum: vi.fn(),
}))

const mockUseQuickBookStorage = vi.mocked(
  await import("./storage/quickBookStorage"),
).useQuickBookStorage
const mockUseQueryState = vi.mocked(await import("nuqs")).useQueryState

describe("useQuickBookProcessor", () => {
  const mockDispatch = vi.fn()
  const mockSetPlayLevel = vi.fn()
  const mockClearQuickBookData = vi.fn()
  const mockSetQuickBookData = vi.fn()

  const sessions: SessionItem[] = [
    {
      id: "session-1",
      name: "Session 1",
      location: "Location 1",
      startTime: "19:30",
      endTime: "22:00",
      capacity: 35,
      casualCapacity: 5,
      attendees: 20,
      casualAttendees: 2,
      date: "2025-01-07",
    },
    {
      id: "session-2",
      name: "Session 2",
      location: "Location 2",
      startTime: "17:00",
      endTime: "19:00",
      capacity: 30,
      casualCapacity: 3,
      attendees: 25,
      casualAttendees: 1,
      date: "2025-01-08",
    },
  ]

  const mockUser = { role: MembershipType.member }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseQueryState.mockReturnValue([null, mockSetPlayLevel])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should return hasValidData as false when no quick book data is available", () => {
    mockUseQuickBookStorage.mockReturnValue({
      value: null,
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: false,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    expect(result.current.hasValidData).toBe(false)
    expect(result.current.validationReason).toBe("no-data")
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockSetPlayLevel).not.toHaveBeenCalled()
    expect(mockClearQuickBookData).not.toHaveBeenCalled()
  })

  it("should return hasValidData as false when not on play-level step", () => {
    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "session-1",
          skillLevel: PlayLevel.beginner,
        },
        timestamp: new Date().toISOString(),
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "select-court",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    expect(result.current.hasValidData).toBe(true)
    expect(result.current.isProcessing).toBe(false) // Not processing because not on play-level step
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockSetPlayLevel).not.toHaveBeenCalled()
  })

  it("should clear expired quick book data and return hasValidData as false", () => {
    const oldTimestamp = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() // 25 hours ago

    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "session-1",
          skillLevel: PlayLevel.beginner,
        },
        timestamp: oldTimestamp,
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    expect(result.current.hasValidData).toBe(false)
    expect(result.current.validationReason).toBe("expired")

    // Process should clear expired data
    act(() => {
      const success = result.current.processQuickBookData()
      expect(success).toBe(false)
    })

    expect(mockClearQuickBookData).toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockSetPlayLevel).not.toHaveBeenCalled()
  })

  it("should clear data when session no longer exists and return hasValidData as false", () => {
    const recentTimestamp = new Date().toISOString()

    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "non-existent-session",
          skillLevel: PlayLevel.beginner,
        },
        timestamp: recentTimestamp,
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    expect(result.current.hasValidData).toBe(false)
    expect(result.current.validationReason).toBe("session-not-found")

    // Process should clear invalid data
    act(() => {
      const success = result.current.processQuickBookData()
      expect(success).toBe(false)
    })

    expect(mockClearQuickBookData).toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockSetPlayLevel).not.toHaveBeenCalled()
  })

  it("should clear data when session is full and return hasValidData as false", () => {
    const recentTimestamp = new Date().toISOString()

    // Create a session that is full for members
    const fullSessions: SessionItem[] = [
      {
        id: "session-1",
        name: "Session 1",
        location: "Location 1",
        startTime: "19:30",
        endTime: "22:00",
        capacity: 35,
        casualCapacity: 5,
        attendees: 35, // Full for members
        casualAttendees: 2,
        date: "2025-01-07",
      },
    ]

    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "session-1",
          skillLevel: PlayLevel.beginner,
        },
        timestamp: recentTimestamp,
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions: fullSessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser, // Member user
      }),
    )

    expect(result.current.hasValidData).toBe(false)
    expect(result.current.validationReason).toBe("session-full")

    // Process should clear invalid data
    act(() => {
      const success = result.current.processQuickBookData()
      expect(success).toBe(false)
    })

    expect(mockClearQuickBookData).toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockSetPlayLevel).not.toHaveBeenCalled()
  })

  it("should not clear data when session is full for casual users but member capacity is available", () => {
    const recentTimestamp = new Date().toISOString()

    // Create a session that is full for casual users but not for members
    const mixedCapacitySessions: SessionItem[] = [
      {
        id: "session-1",
        name: "Session 1",
        location: "Location 1",
        startTime: "19:30",
        endTime: "22:00",
        capacity: 35,
        casualCapacity: 5,
        attendees: 20, // Not full for members
        casualAttendees: 5, // Full for casual users
        date: "2025-01-07",
      },
    ]

    const casualUser = { role: MembershipType.casual }

    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "session-1",
          skillLevel: PlayLevel.beginner,
        },
        timestamp: recentTimestamp,
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions: mixedCapacitySessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: casualUser,
      }),
    )

    expect(result.current.hasValidData).toBe(false)
    expect(result.current.validationReason).toBe("session-full")

    // Process should clear invalid data
    act(() => {
      const success = result.current.processQuickBookData()
      expect(success).toBe(false)
    })

    expect(mockClearQuickBookData).toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockSetPlayLevel).not.toHaveBeenCalled()
  })

  it("should process valid quick book data and auto-populate form", () => {
    const recentTimestamp = new Date().toISOString()

    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "session-1",
          skillLevel: PlayLevel.intermediate,
        },
        timestamp: recentTimestamp,
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    expect(result.current.hasValidData).toBe(true)
    expect(result.current.validationReason).toBe("valid")
    expect(result.current.isProcessing).toBe(true)

    // Process the data
    act(() => {
      const success = result.current.processQuickBookData()
      expect(success).toBe(true)
    })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_PLAY_LEVEL",
      payload: PlayLevel.intermediate,
    })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_BOOKING_TIMES",
      payload: {
        bookingTimes: ["session-1"],
      },
    })

    expect(mockDispatch).toHaveBeenCalledWith({ type: "NEXT_STEP" })
    expect(mockSetPlayLevel).toHaveBeenCalledWith(PlayLevel.intermediate)
    expect(mockClearQuickBookData).toHaveBeenCalled()
  })

  it("should return correct processing state", () => {
    const recentTimestamp = new Date().toISOString()

    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "session-1",
          skillLevel: PlayLevel.beginner,
        },
        timestamp: recentTimestamp,
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    expect(result.current.hasValidData).toBe(true)
    expect(result.current.isProcessing).toBe(true)
    expect(result.current.validationReason).toBe("valid")
    expect(typeof result.current.processQuickBookData).toBe("function")
    expect(typeof result.current.clearQuickBookData).toBe("function")
    expect(result.current.quickBookData).toBeDefined()
  })

  it("should allow custom max age configuration", () => {
    const oldTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago

    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "session-1",
          skillLevel: PlayLevel.beginner,
        },
        timestamp: oldTimestamp,
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    // Set max age to 1 hour (should expire the 2-hour-old data)
    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
        maxAge: 60 * 60 * 1000, // 1 hour
      }),
    )

    expect(result.current.hasValidData).toBe(false)
    expect(result.current.validationReason).toBe("expired")

    act(() => {
      const success = result.current.processQuickBookData()
      expect(success).toBe(false)
    })

    expect(mockClearQuickBookData).toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it("should allow manual processing via processQuickBookData", () => {
    const recentTimestamp = new Date().toISOString()

    mockUseQuickBookStorage.mockReturnValue({
      value: {
        formData: {
          locationAndTimeId: "session-1",
          skillLevel: PlayLevel.advanced,
        },
        timestamp: recentTimestamp,
      },
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: true,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "select-court", // Not on play-level step
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    expect(result.current.hasValidData).toBe(true)
    expect(result.current.isProcessing).toBe(false) // Not processing because not on play-level step

    // Manual processing should work regardless of current step
    act(() => {
      const success = result.current.processQuickBookData()
      expect(success).toBe(true)
    })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_PLAY_LEVEL",
      payload: PlayLevel.advanced,
    })
    expect(mockClearQuickBookData).toHaveBeenCalled()
  })

  it("should not clear data for no-data reason", () => {
    mockUseQuickBookStorage.mockReturnValue({
      value: null,
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: false,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    act(() => {
      const success = result.current.processQuickBookData()
      expect(success).toBe(false)
    })

    // Should not clear data when there's no data to begin with
    expect(mockClearQuickBookData).not.toHaveBeenCalled()
  })

  it("should save current booking state when saveCurrentBookingState is called", () => {
    mockUseQuickBookStorage.mockReturnValue({
      value: null,
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: false,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    act(() => {
      result.current.saveCurrentBookingState(PlayLevel.intermediate, ["session-1"])
    })

    expect(mockSetQuickBookData).toHaveBeenCalledWith({
      formData: {
        locationAndTimeId: "session-1",
        skillLevel: PlayLevel.intermediate,
      },
      timestamp: expect.any(String),
    })
  })

  it("should not save booking state when no booking times are provided", () => {
    mockUseQuickBookStorage.mockReturnValue({
      value: null,
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: false,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    act(() => {
      result.current.saveCurrentBookingState(PlayLevel.intermediate, [])
    })

    expect(mockSetQuickBookData).not.toHaveBeenCalled()
  })

  it("should not save booking state when session is not found", () => {
    mockUseQuickBookStorage.mockReturnValue({
      value: null,
      setValue: mockSetQuickBookData,
      removeValue: mockClearQuickBookData,
      isValid: false,
      isAvailable: true,
    })

    const { result } = renderHook(() =>
      useQuickBookProcessor({
        sessions,
        currentStep: "play-level",
        dispatch: mockDispatch,
        user: mockUser,
      }),
    )

    act(() => {
      result.current.saveCurrentBookingState(PlayLevel.intermediate, ["non-existent-session"])
    })

    expect(mockSetQuickBookData).not.toHaveBeenCalled()
  })
})
