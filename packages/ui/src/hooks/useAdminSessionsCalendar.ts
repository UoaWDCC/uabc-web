import type { AdminGameSession } from "@repo/shared"
import { getISODateKey } from "@repo/shared"
import { useCallback, useMemo } from "react"

export interface UseAdminSessionsCalendarProps {
  gameSessions?: AdminGameSession[]
}

export interface UseAdminSessionsCalendarReturn {
  sessionsByDate: Map<string, AdminGameSession[]>
  getSessionsForDate: (date: Date) => AdminGameSession[]
  isDateActive: (date: Date) => boolean
  getTotalAttendeesForDate: (date: Date) => number
  getTotalCapacityForDate: (date: Date) => number
}

/**
 * Custom hook for managing admin sessions calendar logic
 *
 * Provides utilities for organizing game sessions by date, checking date activity,
 * and calculating total attendees for specific dates.
 *
 * @param gameSessions Array of game sessions to organize
 * @returns Object containing calendar utilities and computed values
 *
 * @example
 * ```tsx
 * const { sessionsByDate, isDateActive, getTotalAttendeesForDate } = useAdminSessionsCalendar({
 *   gameSessions: sessions
 * })
 * ```
 */
export const useAdminSessionsCalendar = ({
  gameSessions = [],
}: UseAdminSessionsCalendarProps): UseAdminSessionsCalendarReturn => {
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, AdminGameSession[]>()
    for (const session of gameSessions) {
      const dateString = getISODateKey(session.startTime)
      const existingSessions = map.get(dateString) || []
      existingSessions.push(session)
      map.set(dateString, existingSessions)
    }
    return map
  }, [gameSessions])

  const getSessionsForDate = useCallback(
    (date: Date) => {
      if (Number.isNaN(date.getTime())) {
        return []
      }
      const dateString = getISODateKey(date)
      return sessionsByDate.get(dateString) || []
    },
    [sessionsByDate],
  )

  const isDateActive = useCallback(
    (date: Date) => {
      return getSessionsForDate(date).length > 0
    },
    [getSessionsForDate],
  )

  const getTotalAttendeesForDate = useCallback(
    (date: Date) => {
      const sessions = getSessionsForDate(date)
      return sessions.reduce((sum, session) => sum + session.attendees, 0)
    },
    [getSessionsForDate],
  )

  const getTotalCapacityForDate = useCallback(
    (date: Date) => {
      const sessions = getSessionsForDate(date)
      return sessions.reduce((sum, session) => sum + session.capacity, 0)
    },
    [getSessionsForDate],
  )

  return {
    sessionsByDate,
    getSessionsForDate,
    isDateActive,
    getTotalAttendeesForDate,
    getTotalCapacityForDate,
  }
}
