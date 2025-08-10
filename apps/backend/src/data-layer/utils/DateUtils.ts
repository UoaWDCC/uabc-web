import { type GameSessionSchedule, getDaysBetweenWeekdays, Weekday } from "@repo/shared"
import type { Semester } from "@repo/shared/payload-types"

/**
 * Returns the valid dates for game session date time for the semester
 *
 * @param day The target day for every week of the semester
 * @param semester The {@link Semester} for finding valid dates
 * @returns An array of {@link Date} valid dates that excludes dates break dates
 */
export function getWeeklySessionDates(day: Weekday, semester: Semester): Date[] {
  const dates: Date[] = []

  const semesterStart = new Date(semester.startDate)
  const semesterEnd = new Date(semester.endDate)
  const breakStart = new Date(semester.breakStart)
  const breakEnd = new Date(semester.breakEnd)

  const sessionDate = new Date(semesterStart)
  const dayOffSet = getDaysBetweenWeekdays(Object.values(Weekday)[sessionDate.getDay()], day)
  sessionDate.setDate(sessionDate.getDate() + dayOffSet)

  while (sessionDate <= semesterEnd) {
    if (sessionDate < breakStart || sessionDate > breakEnd) {
      dates.push(new Date(sessionDate))
    }
    sessionDate.setDate(sessionDate.getDate() + 7)
  }

  return dates
}

/**
 * Creates the game session time from game session schedule schedule time and valid date
 *
 * @param schedule The game session schedule for the time of the game session
 * @param date The date of the game session
 * @returns Both startTime and endTime of the game session
 */
export function createGameSessionTimes(schedule: GameSessionSchedule, date: Date) {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  const start = new Date(schedule.startTime)
  const end = new Date(schedule.endTime)

  start.setUTCFullYear(year, month, day)
  end.setUTCFullYear(year, month, day)

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  }
}
