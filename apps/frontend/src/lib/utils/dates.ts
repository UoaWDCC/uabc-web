import type { NormalizedInterval, ParseOptions } from "date-fns"
import { format, interval, max, min, parse } from "date-fns"
import { fromZonedTime } from "date-fns-tz"

/**
 * Clamps the given intervals to the intersection of the two.
 */
export function clampInterval(interval1: NormalizedInterval, interval2: NormalizedInterval) {
  return interval(max([interval1.start, interval2.start]), min([interval1.end, interval2.end]))
}

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

  return fromZonedTime(parsedDate, "Pacific/Auckland")
}

/**
 * Formats date as Tuesday 9th July 2024
 */
export function formatFullDate(date: string | Date) {
  const formatted = format(new Date(date), "eeee do MMMM yyyy")
  return formatted
}

/**
 * Converts from military Time to 12-hour format
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
