import type { SessionItem } from "@repo/shared"
import type { GameSession } from "@repo/shared/payload-types"

/**
 * Maps {@link GameSession} documents to UI-friendly {@link SessionItem}s.
 *
 * Times are formatted to HH:mm and date is set from the session's start time.
 */
export const mapGameSessionsToSessionItems = (sessions: GameSession[]): SessionItem[] => {
  return sessions.map((session) => {
    const start = new Date(session.startTime)
    const end = new Date(session.endTime)

    const startTime = start.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const endTime = end.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    return {
      id: session.id,
      name: session.name ?? undefined,
      location: session.location ?? undefined,
      startTime,
      endTime,
      capacity: session.capacity,
      casualCapacity: session.casualCapacity,
      attendees: 0,
      casualAttendees: 0,
      date: session.startTime,
      disabled: false,
    }
  })
}
