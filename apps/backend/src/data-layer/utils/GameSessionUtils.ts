import {
  GameBookingStrategy,
  isGameSessionScheduleObject,
  isUserObject,
  MembershipType,
} from "@repo/shared"
import type { Booking, GameSession } from "@repo/shared/payload-types"
import type BookingDataService from "@/data-layer/services/BookingDataService"
import type SemesterDataService from "@/data-layer/services/SemesterDataService"

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

export const getRemainingSessions = async (
  user: Pick<
    { id: string; role: string; remainingSessions?: number | null },
    "id" | "role" | "remainingSessions"
  >,
  semesterDataService: SemesterDataService,
  bookingDataService: BookingDataService,
): Promise<number> => {
  const strategy: GameBookingStrategy =
    user.role === "casual" ? GameBookingStrategy.CASUAL : GameBookingStrategy.MEMBER

  switch (strategy) {
    case GameBookingStrategy.CASUAL: {
      const currentSemester = await semesterDataService.getCurrentSemester()
      const upcomingBookings = await bookingDataService.getAllCurrentWeekBookingsByUserId(
        user.id,
        currentSemester,
      )
      if (upcomingBookings.length > 0) {
        return 0
      }
      return 1
    }
    case GameBookingStrategy.MEMBER: {
      return user.remainingSessions ?? 0
    }
  }
}
