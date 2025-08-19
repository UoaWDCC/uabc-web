import { MAX_CASUAL_BOOKINGS, MAX_MEMBER_BOOKINGS, MembershipType } from "@repo/shared"
import { renderHook } from "@repo/ui/test-utils"
import { useBookingLimits } from "./useBookingLimits"

describe("useBookingLimits", () => {
  const memberUser = {
    role: MembershipType.member,
    remainingSessions: 5,
  }

  const casualUser = {
    role: MembershipType.casual,
    remainingSessions: 3,
  }

  const adminUser = {
    role: MembershipType.admin,
    remainingSessions: 10,
  }

  it("should calculate correct limits for member user", () => {
    const { result } = renderHook(() =>
      useBookingLimits({
        user: memberUser,
        selectedCount: 1,
      }),
    )

    expect(result.current.isMember).toBe(true)
    expect(result.current.maxBookings).toBe(2) // Math.min(5, MAX_MEMBER_BOOKINGS)
    expect(result.current.sessionsLeft).toBe(1)
    expect(result.current.totalSessionsLeft).toBe(4)
    expect(result.current.weeklyLimit).toBe(MAX_MEMBER_BOOKINGS)
    expect(result.current.sessionsLabel).toBe("1 / 2 this week • 4 total remaining")
  })

  it("should calculate correct limits for casual user", () => {
    const { result } = renderHook(() =>
      useBookingLimits({
        user: casualUser,
        selectedCount: 0,
      }),
    )

    expect(result.current.isMember).toBe(false)
    expect(result.current.maxBookings).toBe(1) // Math.min(3, MAX_CASUAL_BOOKINGS)
    expect(result.current.sessionsLeft).toBe(1)
    expect(result.current.totalSessionsLeft).toBe(3)
    expect(result.current.weeklyLimit).toBe(MAX_CASUAL_BOOKINGS)
    expect(result.current.sessionsLabel).toBe("1 / 1 this week • 3 total remaining")
  })

  it("should calculate correct limits for admin user", () => {
    const { result } = renderHook(() =>
      useBookingLimits({
        user: adminUser,
        selectedCount: 2,
      }),
    )

    expect(result.current.isMember).toBe(true)
    expect(result.current.maxBookings).toBe(2) // Math.min(10, MAX_MEMBER_BOOKINGS)
    expect(result.current.sessionsLeft).toBe(0)
    expect(result.current.totalSessionsLeft).toBe(8)
    expect(result.current.weeklyLimit).toBe(MAX_MEMBER_BOOKINGS)
    expect(result.current.sessionsLabel).toBe("0 / 2 this week • 8 total remaining")
  })

  it("should handle zero remaining sessions", () => {
    const { result } = renderHook(() =>
      useBookingLimits({
        user: { ...memberUser, remainingSessions: 0 },
        selectedCount: 0,
      }),
    )

    expect(result.current.maxBookings).toBe(0)
    expect(result.current.sessionsLeft).toBe(0)
    expect(result.current.totalSessionsLeft).toBe(0)
    expect(result.current.sessionsLabel).toBe("0 / 2 this week • 0 total remaining")
  })

  it("should handle null remaining sessions", () => {
    const { result } = renderHook(() =>
      useBookingLimits({
        user: { ...memberUser, remainingSessions: null },
        selectedCount: 0,
      }),
    )

    expect(result.current.maxBookings).toBe(0)
    expect(result.current.sessionsLeft).toBe(0)
    expect(result.current.totalSessionsLeft).toBe(0)
    expect(result.current.sessionsLabel).toBe("0 / 2 this week • 0 total remaining")
  })
})
