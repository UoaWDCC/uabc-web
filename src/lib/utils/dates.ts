import type { NormalizedInterval, ParseOptions } from 'date-fns'
import { format, interval, max, min, parse } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'

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
  return fromZonedTime(parse(dateStr, formatStr, referenceDate, options), 'Pacific/Auckland')
}

/**
 * Formats date as Tuesday 9th July 2024
 */
export function formatFullDate(date: string | Date) {
  try {
    const formatted = format(new Date(date), 'eeee do MMMM yyyy')
    if (date === formatted) return date
    return formatted
  } catch (error) {
    console.error('Error formatting date:', date, error)
    return date
  }
}

/**
 * Converts from military Time to 12-hour format
 */
export function convertTo12HourFormat(militaryTime: string): string {
  try {
    if (!militaryTime || typeof militaryTime !== 'string') {
      return militaryTime
    }

    // Validate time format and ranges
    const parts = militaryTime.split(':')
    if (militaryTime.includes(':')) {
      const [hours, minutes, seconds] = parts
      const numHours = parseInt(hours)
      const numMinutes = parseInt(minutes)
      const numSeconds = seconds ? parseInt(seconds) : 0

      if (
        isNaN(numHours) ||
        numHours < 0 ||
        numHours > 23 ||
        isNaN(numMinutes) ||
        numMinutes < 0 ||
        numMinutes > 59 ||
        (seconds && (isNaN(numSeconds) || numSeconds < 0 || numSeconds > 59))
      ) {
        return militaryTime
      }
    } else {
      if (!/^([01]?[0-9]|2[0-3])[0-5][0-9]$/.test(militaryTime)) {
        return militaryTime
      }
    }

    // Handle time format without seconds
    const timeFormat = militaryTime.includes(':')
      ? militaryTime.split(':').length === 3
        ? 'HH:mm:ss'
        : 'HH:mm'
      : 'HHmm'

    return format(parse(militaryTime, timeFormat, new Date()), 'h:mma')
  } catch (error) {
    console.error('Error converting time:', militaryTime, error)
    return militaryTime
  }
}
