import { MAX_CASUAL_BOOKINGS, MAX_MEMBER_BOOKINGS, MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { useMemo } from "react"

/**
 * Options for the useBookingLimits hook.
 */
interface UseBookingLimitsOptions {
  /**
   * The user object containing role and remaining sessions.
   */
  user: Pick<User, "remainingSessions" | "role">
  /**
   * The number of selected/booked sessions.
   */
  selectedCount: number
}

/**
 * Return type for useBookingLimits hook.
 */
interface UseBookingLimitsReturn {
  /**
   * Whether the user is a member (not casual).
   */
  isMember: boolean
  /**
   * Maximum bookings allowed for the user type.
   */
  maxBookings: number
  /**
   * Sessions left within the weekly limit.
   */
  sessionsLeft: number
  /**
   * Total sessions remaining.
   */
  totalSessionsLeft: number
  /**
   * Weekly booking limit for the user type.
   */
  weeklyLimit: number
  /**
   * Formatted sessions label showing weekly and total limits.
   */
  sessionsLabel: string
}

/**
 * Hook for calculating booking limits and session availability.
 *
 * @param options Configuration options for the hook.
 * @returns Object containing booking limit calculations and formatted labels.
 *
 * @example
 * const limits = useBookingLimits({
 *   user: { role: MembershipType.MEMBER, remainingSessions: 5 },
 *   selectedCount: 2,
 * })
 * // limits.sessionsLabel = "1 / 2 this week • 3 total remaining"
 */
export const useBookingLimits = ({
  user,
  selectedCount,
}: UseBookingLimitsOptions): UseBookingLimitsReturn => {
  const isMember = useMemo(
    () => user.role === MembershipType.MEMBER || user.role === MembershipType.ADMIN,
    [user.role],
  )

  const maxBookings = useMemo(
    () =>
      Math.min(user.remainingSessions ?? 0, isMember ? MAX_MEMBER_BOOKINGS : MAX_CASUAL_BOOKINGS),
    [isMember, user.remainingSessions],
  )

  const sessionsLeft = useMemo(() => maxBookings - selectedCount, [maxBookings, selectedCount])

  const totalSessionsLeft = useMemo(
    () => (user.remainingSessions ?? 0) - selectedCount,
    [user.remainingSessions, selectedCount],
  )

  const weeklyLimit = useMemo(
    () => (isMember ? MAX_MEMBER_BOOKINGS : MAX_CASUAL_BOOKINGS),
    [isMember],
  )

  const sessionsLabel = useMemo(() => {
    const weeklyText = `${sessionsLeft} / ${weeklyLimit} this week`
    const totalText = `${totalSessionsLeft} total remaining`
    return `${weeklyText} • ${totalText}`
  }, [sessionsLeft, weeklyLimit, totalSessionsLeft])

  return {
    isMember,
    maxBookings,
    sessionsLeft,
    totalSessionsLeft,
    weeklyLimit,
    sessionsLabel,
  }
}
