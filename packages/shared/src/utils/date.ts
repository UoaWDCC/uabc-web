import { Weekday } from "../types"

/**
 * Returns the number of days from fromDay to the next occurrence of toDay.
 *
 * @param fromDay The current day of the week
 * @param toDay The target day of the week
 * @returns Number of days until the next occurrence of the target day
 */
export function getDaysBetweenWeekdays(fromDay: Weekday, toDay: Weekday): number {
  const fromDayIndex = Object.values(Weekday).indexOf(fromDay)
  const toDayIndex = Object.values(Weekday).indexOf(toDay)
  return (toDayIndex - fromDayIndex + 7) % 7
}

/**
 * Calculates the open date for a session based on the start time, open day, and open time.
 *
 * @param startTime The start time
 * @param openDay The day of the week it opens
 * @param openTime The time of day it opens
 * @returns The calculated booking open date
 */
export function calculateOpenDate(startTime: Date, openDay: Weekday, openTime: Date): Date {
  const openDate = new Date(startTime)
  const dayIndex = startTime.getDay()
  const day = Object.values(Weekday)[dayIndex] as Weekday
  const daysToSubtract = getDaysBetweenWeekdays(openDay, day)

  openDate.setDate(startTime.getDate() - daysToSubtract)
  openDate.setHours(openTime.getHours(), openTime.getMinutes(), openTime.getSeconds(), 0)

  return openDate
}
