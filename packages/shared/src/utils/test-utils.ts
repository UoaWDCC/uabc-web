import type { AdminGameSession } from "@repo/shared"
import { GameSessionStatus, getWeekdayFromDayIndex, Weekday } from "@repo/shared"
import { adminGameSessionBaseMock } from "@repo/shared/mocks"

/**
 * Creates a date relative to today
 * @param daysFromNow Number of days from today (positive for future, negative for past)
 * @returns Date object
 */
export const createRelativeDate = (daysFromNow: number): Date => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + daysFromNow)
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
  startTime.setUTCHours(startHour, 30, 0, 0)
  const endTime = new Date(date)
  endTime.setUTCHours(endHour, 0, 0, 0)
  const openTime = new Date(date)
  openTime.setUTCHours(startHour - 1, 0, 0, 0)

  // Determine day of week
  const dayOfWeek = date.getUTCDay()

  return {
    ...adminGameSessionBaseMock,
    id: `session-${daysFromNow}`,
    day: getWeekdayFromDayIndex(dayOfWeek),
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

/**
 * Creates a test admin session with specific date and configuration
 * @param id Unique identifier for the session
 * @param date Specific date for the session
 * @param status Session status
 * @param attendees Number of attendees
 * @returns AdminGameSession object for testing
 */
export const createTestAdminSession = (
  id: string,
  date: Date,
  status: GameSessionStatus = GameSessionStatus.UPCOMING,
  attendees = 25,
): AdminGameSession => {
  const startTime = new Date(date)
  startTime.setUTCHours(19, 30, 0, 0)
  const endTime = new Date(date)
  endTime.setUTCHours(22, 0, 0, 0)

  return {
    ...adminGameSessionBaseMock,
    id,
    day: Weekday.tuesday,
    status,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    attendees,
    capacity: 40,
    location: "Test Location",
    name: "Test Session",
  }
}
