import { Weekday } from "../types"

/**
 * Maps JavaScript's Date.getDay() result (0-6) to Weekday enum values
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export const WEEKDAY_MAP: Record<number, Weekday> = {
  0: Weekday.sunday,
  1: Weekday.monday,
  2: Weekday.tuesday,
  3: Weekday.wednesday,
  4: Weekday.thursday,
  5: Weekday.friday,
  6: Weekday.saturday,
} as const

/**
 * Converts JavaScript's Date.getDay() result to Weekday enum
 * @param dayIndex The result from Date.getDay() (0-6)
 * @returns Corresponding Weekday enum value
 */
export const getWeekdayFromDayIndex = (dayIndex: number): Weekday => {
  return WEEKDAY_MAP[dayIndex]
}
