import { format } from "date-fns"
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
  const dayIndex = startTime.getUTCDay()
  const day = Object.values(Weekday)[dayIndex] as Weekday
  const daysToSubtract = getDaysBetweenWeekdays(openDay, day)

  openDate.setUTCDate(startTime.getUTCDate() - daysToSubtract)
  openDate.setUTCHours(
    openTime.getUTCHours(),
    openTime.getUTCMinutes(),
    openTime.getUTCSeconds(),
    0,
  )

  return openDate
}

/**
 * Formats a date string or Date object into the format "Day, Xth of Month"
 * Uses date-fns format with 'do' token for industry-standard ordinal formatting
 *
 * @param date The date to format (string or Date object)
 * @returns Formatted date string
 */
export function formatDateWithOrdinal(date: string | Date): string {
  const dateObj = new Date(date)
  const dayOfWeek = format(dateObj, "eeee")
  const dayWithSuffix = format(dateObj, "do")
  const month = format(dateObj, "MMMM")

  return `${dayOfWeek}, ${dayWithSuffix} of ${month}`
}
