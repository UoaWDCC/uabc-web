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
   * The number of sessions currently selected in the form.
   */
  selectedCount: number
  /**
   * The number of sessions already booked this week.
   */
  alreadyBookedCount?: number
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
   * Maximum bookings allowed for the user type (how many MORE can be selected).
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
 *   user: { role: MembershipType.member, remainingSessions: 5 },
 *   selectedCount: 1, // currently selecting 1
 *   alreadyBookedCount: 1, // already booked 1 this week
 * })
 * // limits.sessionsLabel = "0 / 2 this week • 4 total remaining"
 */
export const useBookingLimits = ({
  user,
  selectedCount,
  alreadyBookedCount = 0,
}: UseBookingLimitsOptions): UseBookingLimitsReturn => {
  const isMember = useMemo(
    () => user.role === MembershipType.member || user.role === MembershipType.admin,
    [user.role],
  )

  const weeklyUsed = useMemo(
    () => alreadyBookedCount + selectedCount,
    [alreadyBookedCount, selectedCount],
  )

  const weeklyLimit = isMember ? MAX_MEMBER_BOOKINGS : MAX_CASUAL_BOOKINGS

  const sessionsLeft = useMemo(
    () => Math.max(0, weeklyLimit - weeklyUsed),
    [weeklyLimit, weeklyUsed],
  )

  const totalSessionsLeft = useMemo(
    () => Math.max(0, (user.remainingSessions ?? 0) - selectedCount),
    [user.remainingSessions, selectedCount],
  )

  const maxBookings = useMemo(
    () => Math.min(sessionsLeft, totalSessionsLeft),
    [sessionsLeft, totalSessionsLeft],
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
