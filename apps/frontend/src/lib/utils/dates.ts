import type { NormalizedInterval, ParseOptions } from "date-fns"
import { format, interval, max, min, parse } from "date-fns"
import { fromZonedTime } from "date-fns-tz"

/**
 * Clamps the given intervals to the intersection of the two.
 *
 * @param {NormalizedInterval} interval1 The first interval to clamp
 * @param {NormalizedInterval} interval2 The second interval to clamp
 * @returns {NormalizedInterval} A new interval representing the intersection of the two input intervals
 * @example
 * const int1 = interval(new Date('2023-01-01'), new Date('2023-01-10'))
 * const int2 = interval(new Date('2023-01-05'), new Date('2023-01-15'))
 * const result = clampInterval(int1, int2)
 * // result will be an interval from 2023-01-05 to 2023-01-10
 */
export function clampInterval(interval1: NormalizedInterval, interval2: NormalizedInterval) {
  return interval(max([interval1.start, interval2.start]), min([interval1.end, interval2.end]))
}

/**
 * Parses a date string in New Zealand Standard Time (NZST)
 *
 * @param {string} dateStr The date string to parse
 * @param {string} formatStr The format of the input date string
 * @param {string | number | Date} referenceDate A reference date used for parsing
 * @param {ParseOptions} [options={}] Optional parsing options
 * @returns {Date} A parsed Date object in New Zealand Standard Time
 * @throws {Error} If the date string is invalid
 * @example
 * const date = nzstParse('2023-07-15', 'yyyy-MM-dd', new Date(), {})
 * // Returns a Date object in New Zealand Standard Time
 */
export function nzstParse(
  dateStr: string,
  formatStr: string,
  referenceDate: string | number | Date,
  options: ParseOptions = {},
) {
  const parsedDate = parse(dateStr, formatStr, referenceDate, options)

  // Check if the date is valid
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`)
  }

  // Explicitly set the time to midnight to avoid timezone shifts
  parsedDate.setHours(0, 0, 0, 0)

  return fromZonedTime(parsedDate, "Pacific/Auckland")
}

/**
 * Formats a date into a full, human-readable format
 *
 * @param {string | Date} date The date to format
 * @returns {string} The date formatted as "Tuesday 9th July 2024"
 * @example
 * const formattedDate = formatFullDate(new Date('2024-07-09'))
 * // Returns "Tuesday 9th July 2024"
 */
export function formatFullDate(date: string | Date) {
  const formatted = format(new Date(date), "eeee do MMMM yyyy")
  return formatted
}

/**
 * Converts a time from 24-hour (military) format to 12-hour format
 *
 * @param {string} militaryTime The time in 24-hour format (HH:mm, HHmm, or HH:mm:ss)
 * @returns {string} The time converted to 12-hour format with AM/PM indicator
 * @throws {Error} If the input time is not in a valid format
 * @example
 * const time12Hour = convertTo12HourFormat('14:30')
 * // Returns "2:30 PM"
 * const time12Hour2 = convertTo12HourFormat('09:15')
 * // Returns "9:15 AM"
 */
export function convertTo12HourFormat(militaryTime: string): string {
  // Validate time format
  const timeRegex = /^(\d{1,2}):?(\d{2})(?::(\d{2}))?$/
  const match = militaryTime.match(timeRegex)

  if (!match) {
    throw new Error(
      `Invalid time format: ${militaryTime}. Expected format: HH:mm or HHmm or HH:mm:ss`,
    )
  }

  const [, hours, minutes, seconds] = match
  const numHours = Number.parseInt(hours)
  const numMinutes = Number.parseInt(minutes)
  const numSeconds = seconds ? Number.parseInt(seconds) : 0

  // Validate hours
  if (numHours < 0 || numHours > 23) {
    throw new Error(`Invalid hours: ${hours}. Hours must be between 0 and 23.`)
  }

  // Validate minutes
  if (numMinutes < 0 || numMinutes > 59) {
    throw new Error(`Invalid minutes: ${minutes}. Minutes must be between 0 and 59.`)
  }

  // Validate seconds if provided
  if (seconds && (numSeconds < 0 || numSeconds > 59)) {
    throw new Error(`Invalid seconds: ${seconds}. Seconds must be between 0 and 59.`)
  }

  // Determine time format based on input
  const timeFormat = seconds ? "HH:mm:ss" : militaryTime.includes(":") ? "HH:mm" : "HHmm"

  return format(parse(militaryTime, timeFormat, new Date()), "h:mma")
}
