import { MembershipType } from "@repo/shared"
import type { Booking, GameSession, GameSessionSchedule, User } from "@repo/shared/payload-types"

/**
 * Type guard to check if a value is a User object with required properties
 *
 * @param user - The value to check
 * @returns True if the value is a User object, false otherwise
 */
export const isUserObject = (user: User | string | null | undefined): user is User => {
  return !!user && typeof user === "object"
}

/**
 * Type guard to check if a value is a GameSessionSchedule object with required properties
 *
 * @param schedule - The value to check
 * @returns True if the value is a GameSessionSchedule object, false otherwise
 */
export const isGameSessionScheduleObject = (
  schedule: GameSessionSchedule | string | null | undefined,
): schedule is GameSessionSchedule => {
  return !!schedule && typeof schedule === "object"
}

/**
 * Extract session properties with fallback logic from GameSession
 *
 * Prioritizes properties from the gameSessionSchedule if available,
 * otherwise falls back to the session's direct properties
 *
 * @param session - The GameSession object to extract properties from
 * @returns Object containing location and name properties
 */
export const getSessionProperties = (session: GameSession) => {
  const schedule = session.gameSessionSchedule
  if (isGameSessionScheduleObject(schedule)) {
    return {
      location: schedule.location,
      name: schedule.name,
    }
  }
  return {
    location: session.location,
    name: session.name,
  }
}

/**
 * Efficiently count attendees and casual attendees for each game session
 *
 * @param bookings - Array of booking records to process
 * @returns Map of session IDs to their attendee and casual attendee counts
 */
export const countAttendees = (bookings: Booking[]) => {
  const counts = new Map<string, { attendees: number; casualAttendees: number }>()

  for (const booking of bookings) {
    const sessionId =
      typeof booking.gameSession === "object" ? booking.gameSession.id : booking.gameSession

    if (!counts.has(sessionId)) {
      counts.set(sessionId, { attendees: 0, casualAttendees: 0 })
    }

    const sessionCounts = counts.get(sessionId)
    if (!sessionCounts) {
      continue
    }

    const user = booking.user

    if (!isUserObject(user)) {
      throw new Error(
        `Invalid user object in booking ${booking.id}: expected User object but got ${typeof user}`,
      )
    }

    if (user.role === MembershipType.casual) {
      sessionCounts.casualAttendees++
    } else {
      sessionCounts.attendees++
    }
  }

  return counts
}
