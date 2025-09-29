import { format } from "date-fns"
import type { Semester } from "../payload-types"
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
 * Formats a date string or Date object into the format "Day, Xth of Month"
 * Uses date-fns format with 'do' token for industry-standard ordinal formatting
 *
 * @param date The date to format (string or Date object)
 * @returns Formatted date string
 */
export function formatDateWithOrdinal(date: string | Date): string {
  return format(new Date(date), "eeee, do 'of' MMMM")
}

/**
 * Calculates the open date for a session based on the start time, open day, and open time.
 *
 * @param semester The {@link Semester} object containing booking open day and time
 * @param startTime The start time
 * @returns The calculated booking open date
 */
export function getGameSessionOpenDay(semester: Semester, startTime: Date): Date {
  const { bookingOpenDay, bookingOpenTime } = semester

  const openDate = new Date(startTime)
  const openTime = new Date(bookingOpenTime)

  const dayIndex = startTime.getUTCDay()
  const day = Object.values(Weekday)[dayIndex]
  let daysDifference = getDaysBetweenWeekdays(bookingOpenDay as Weekday, day)

  // If the session is on the same day as bookingOpenDay, check the time
  if (daysDifference === 0) {
    // Compare the time of startTime and bookingOpenTime (UTC)
    const startMinutes = startTime.getUTCHours() * 60 + startTime.getUTCMinutes()
    const openMinutes = openTime.getUTCHours() * 60 + openTime.getUTCMinutes()
    if (startMinutes < openMinutes) {
      // If the session starts before the open time on the same day, subtract a week
      daysDifference = 7
    }
  }

  openDate.setUTCDate(startTime.getUTCDate() - daysDifference)
  openDate.setUTCHours(
    openTime.getUTCHours(),
    openTime.getUTCMinutes(),
    openTime.getUTCSeconds(),
    0,
  )

  return openDate
}

/**
 * Formats a date-like value into a stable YYYY-MM-DD key (UTC-safe).
 */
export function getISODateKey(dateLike: string | number | Date): string {
  return format(new Date(dateLike), "yyyy-MM-dd")
}
