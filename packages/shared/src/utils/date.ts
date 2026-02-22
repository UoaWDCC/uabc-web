import { format } from "date-fns"
import { getWeekdayFromDayIndex } from "../constants"
import type { Semester } from "../payload-types"
import { Weekday } from "../types"
import { dayjs } from "./dayjs"

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
  const day = getWeekdayFromDayIndex(dayIndex)
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

/**
 * Checks if two dates represent the same day (ignoring time).
 * Uses UTC-safe comparison to avoid timezone issues.
 *
 * @param date1 First date to compare
 * @param date2 Second date to compare
 * @returns True if both dates represent the same day, false otherwise
 */
export function isSameDate(date1: string | number | Date, date2: string | number | Date): boolean {
  return getISODateKey(date1) === getISODateKey(date2)
}

/**
 * Formats a time string to a localized time format
 *
 * Converts ISO time strings to a user-friendly 12-hour format
 * with hour and minute display.
 *
 * @param timeString The ISO time string to format
 * @returns Formatted time string in 12-hour format
 *
 * @example
 * ```ts
 * formatTime("2025-01-21T19:30:00Z") // Returns: "7:30 PM"
 * formatTime("2025-01-21T22:00:00Z") // Returns: "10:00 PM"
 * ```
 */
export function formatTime(timeString: string): string {
  return dayjs.utc(timeString).format("h:mm A")
}

/**
 * Formats a date to a localized date format
 *
 * Converts a Date object to a user-friendly format with weekday,
 * day, month, and year display.
 *
 * @param date The Date object to format
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date("2025-01-21T19:30:00Z")) // Returns: "Tuesday, 21/01/25"
 * ```
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}

/**
 * Formats a Date object to YYYY-MM-DD string with timezone support
 *
 * Converts a Date object to ISO date format string using New Zealand timezone
 *
 * @param date The Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 *
 * @example
 * ```ts
 * formatDateToISOString(new Date("2025-01-21T19:30:00Z")) // Returns: "2025-01-22"
 * ```
 */
export function formatDateToISOString(date: Date): string {
  return dayjs.tz(date, "Pacific/Auckland").format("YYYY-MM-DD")
}

/**
 * Parses a date string in YYYY-MM-DD format to Date object with timezone support
 *
 * Converts a date string to Date object using New Zealand timezone
 *
 * @param dateString The date string in YYYY-MM-DD format
 * @returns Date object or undefined if parsing fails
 *
 * @example
 * ```ts
 * parseISOStringToDate("2025-01-21") // Returns: Date object
 * ```
 */
export function parseISOStringToDate(dateString: string): Date | undefined {
  if (!dateString) {
    return undefined
  }
  return dayjs.tz(dateString, "YYYY-MM-DD", "Pacific/Auckland").toDate()
}

/**
 * Formats a date to YYYY-MM-DD string without timezone conversion
 *
 * Converts a Date object to ISO date format string without timezone handling
 *
 * @param date The Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 *
 * @example
 * ```ts
 * formatDateToString(new Date("2025-01-21T19:30:00Z")) // Returns: "2025-01-21"
 * ```
 */
export function formatDateToString(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD")
}
