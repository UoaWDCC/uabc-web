import { Weekday } from "../types"

/**
 * Returns the number of days from fromDay to the next occurrence of toDay.
 * @param fromDay The current day of the week
 * @param toDay The target day of the week
 * @returns Number of days until the next occurrence of the target day
 */
export function getDaysUntilNextDayOfWeekEnum(fromDay: Weekday, toDay: Weekday): number {
  const fromDayIndex = Object.values(Weekday).indexOf(fromDay)
  const toDayIndex = Object.values(Weekday).indexOf(toDay)
  return (toDayIndex - fromDayIndex + 7) % 7
}
