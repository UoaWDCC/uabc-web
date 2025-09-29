import type { AdminGameSession } from "@repo/shared"
import { GameSessionStatus, Weekday } from "@repo/shared"
import { adminGameSessionBaseMock } from "@repo/shared/mocks"

/**
 * Creates a date relative to today
 * @param daysFromNow Number of days from today (positive for future, negative for past)
 * @returns Date object
 */
export const createRelativeDate = (daysFromNow: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date
}

/**
 * Creates a game session with relative dates
 * @param daysFromNow Number of days from today
 * @param attendees Number of attendees
 * @param status Session status
 * @param startHour Hour to start the session (24-hour format)
 * @param endHour Hour to end the session (24-hour format)
 * @returns AdminGameSession object
 */
export const createGameSession = (
  daysFromNow: number,
  attendees = 25,
  status: GameSessionStatus = GameSessionStatus.UPCOMING,
  startHour = 19,
  endHour = 22,
): AdminGameSession => {
  const date = createRelativeDate(daysFromNow)
  const startTime = new Date(date)
  startTime.setHours(startHour, 30, 0, 0)
  const endTime = new Date(date)
  endTime.setHours(endHour, 0, 0, 0)
  const openTime = new Date(date)
  openTime.setHours(startHour - 1, 0, 0, 0)

  // Determine day of week
  const dayOfWeek = date.getDay()
  const weekdayMap: Record<number, Weekday> = {
    0: Weekday.sunday,
    1: Weekday.monday,
    2: Weekday.tuesday,
    3: Weekday.wednesday,
    4: Weekday.thursday,
    5: Weekday.friday,
    6: Weekday.saturday,
  }

  return {
    ...adminGameSessionBaseMock,
    id: `session-${daysFromNow}`,
    day: weekdayMap[dayOfWeek],
    status,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    openTime: openTime.toISOString(),
    attendees,
    casualAttendees: Math.floor(attendees * 0.2),
    casualCapacity: 10,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}

/**
 * Creates multiple game sessions for testing
 * @param sessionConfigs Array of session configurations
 * @returns Array of AdminGameSession objects
 */
export const createGameSessions = (
  sessionConfigs: Array<{
    daysFromNow: number
    attendees?: number
    status?: GameSessionStatus
    startHour?: number
    endHour?: number
  }>,
): AdminGameSession[] => {
  return sessionConfigs.map((config) =>
    createGameSession(
      config.daysFromNow,
      config.attendees,
      config.status,
      config.startHour,
      config.endHour,
    ),
  )
}

/**
 * Creates a current session (typically ongoing or recent)
 * @param daysFromNow Number of days from today (usually 0 for today, -1 for yesterday)
 * @param attendees Number of attendees
 * @param status Session status
 * @returns AdminGameSession object representing current session
 */
export const createCurrentSession = (
  daysFromNow = 0,
  attendees = 35,
  status: GameSessionStatus = GameSessionStatus.ONGOING,
): AdminGameSession => {
  return createGameSession(daysFromNow, attendees, status)
}
