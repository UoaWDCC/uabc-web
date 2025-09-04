import { adminGameSessionBaseMock } from "@repo/shared/mocks"
import { renderHook } from "@repo/ui/test-utils"
import { useAdminSessionsCalendar } from "./useAdminSessionsCalendar"

describe("useAdminSessionsCalendar", () => {
  const mockSessions = [
    {
      ...adminGameSessionBaseMock,
      id: "session-1",
      startTime: "2025-01-21T19:30:00Z",
      attendees: 20,
    },
    {
      ...adminGameSessionBaseMock,
      id: "session-2",
      startTime: "2025-01-21T14:00:00Z",
      attendees: 15,
    },
    {
      ...adminGameSessionBaseMock,
      id: "session-3",
      startTime: "2025-01-22T19:30:00Z",
      attendees: 30,
    },
  ]

  it("should return empty map and functions when no sessions provided", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({}))

    expect(result.current.sessionsByDate.size).toBe(0)
    expect(result.current.getSessionsForDate(new Date("2025-01-21"))).toEqual([])
    expect(result.current.isDateActive(new Date("2025-01-21"))).toBe(false)
    expect(result.current.getTotalAttendeesForDate(new Date("2025-01-21"))).toBe(0)
  })

  it("should organize sessions by date correctly", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({ gameSessions: mockSessions }))

    const sessionsByDate = result.current.sessionsByDate
    expect(sessionsByDate.size).toBe(2)
    expect(sessionsByDate.get("2025-01-21")).toHaveLength(2)
    expect(sessionsByDate.get("2025-01-22")).toHaveLength(1)
  })

  it("should get sessions for a specific date", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({ gameSessions: mockSessions }))

    const sessionsForDate = result.current.getSessionsForDate(new Date("2025-01-21"))
    expect(sessionsForDate).toHaveLength(2)
    expect(sessionsForDate[0].id).toBe("session-1")
    expect(sessionsForDate[1].id).toBe("session-2")
  })

  it("should return empty array for dates with no sessions", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({ gameSessions: mockSessions }))

    const sessionsForDate = result.current.getSessionsForDate(new Date("2025-01-23"))
    expect(sessionsForDate).toEqual([])
  })

  it("should correctly identify active dates", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({ gameSessions: mockSessions }))

    expect(result.current.isDateActive(new Date("2025-01-21"))).toBe(true)
    expect(result.current.isDateActive(new Date("2025-01-22"))).toBe(true)
    expect(result.current.isDateActive(new Date("2025-01-23"))).toBe(false)
  })

  it("should calculate total attendees for a date with multiple sessions", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({ gameSessions: mockSessions }))

    const totalAttendees = result.current.getTotalAttendeesForDate(new Date("2025-01-21"))
    expect(totalAttendees).toBe(35) // 20 + 15
  })

  it("should calculate total attendees for a date with single session", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({ gameSessions: mockSessions }))

    const totalAttendees = result.current.getTotalAttendeesForDate(new Date("2025-01-22"))
    expect(totalAttendees).toBe(30)
  })

  it("should return 0 attendees for dates with no sessions", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({ gameSessions: mockSessions }))

    const totalAttendees = result.current.getTotalAttendeesForDate(new Date("2025-01-23"))
    expect(totalAttendees).toBe(0)
  })

  it("should handle sessions with same date but different times", () => {
    const sessionsWithSameDate = [
      {
        ...adminGameSessionBaseMock,
        id: "session-1",
        startTime: "2025-01-21T10:00:00Z",
        attendees: 10,
      },
      {
        ...adminGameSessionBaseMock,
        id: "session-2",
        startTime: "2025-01-21T15:00:00Z",
        attendees: 20,
      },
      {
        ...adminGameSessionBaseMock,
        id: "session-3",
        startTime: "2025-01-21T20:00:00Z",
        attendees: 30,
      },
    ]

    const { result } = renderHook(() =>
      useAdminSessionsCalendar({ gameSessions: sessionsWithSameDate }),
    )

    const sessionsForDate = result.current.getSessionsForDate(new Date("2025-01-21"))
    expect(sessionsForDate).toHaveLength(3)
    expect(result.current.getTotalAttendeesForDate(new Date("2025-01-21"))).toBe(60)
  })

  it("should memoize results and not recreate functions unnecessarily", () => {
    const { result, rerender } = renderHook(
      ({ gameSessions }) => useAdminSessionsCalendar({ gameSessions }),
      { initialProps: { gameSessions: mockSessions } },
    )

    const firstResult = result.current

    rerender({ gameSessions: mockSessions })

    expect(result.current.getSessionsForDate).toBe(firstResult.getSessionsForDate)
    expect(result.current.isDateActive).toBe(firstResult.isDateActive)
    expect(result.current.getTotalAttendeesForDate).toBe(firstResult.getTotalAttendeesForDate)
  })

  it("should update when gameSessions change", () => {
    const { result, rerender } = renderHook(
      ({ gameSessions }) => useAdminSessionsCalendar({ gameSessions }),
      { initialProps: { gameSessions: [] } },
    )

    expect(result.current.sessionsByDate.size).toBe(0)

    rerender({ gameSessions: mockSessions })

    expect(result.current.sessionsByDate.size).toBe(2)
    expect(result.current.isDateActive(new Date("2025-01-21"))).toBe(true)
  })

  it("should handle edge case with invalid dates", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar({ gameSessions: mockSessions }))

    const invalidDate = new Date("invalid")
    expect(result.current.getSessionsForDate(invalidDate)).toEqual([])
    expect(result.current.isDateActive(invalidDate)).toBe(false)
    expect(result.current.getTotalAttendeesForDate(invalidDate)).toBe(0)
  })
})
