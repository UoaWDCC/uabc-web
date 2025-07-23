/**
 * Returns the number of days from fromDayIndex to the next occurrence of toDayIndex.
 * @param fromDayIndex The current day index (0 = Sunday, 6 = Saturday)
 * @param toDayIndex The target day index (0 = Sunday, 6 = Saturday)
 * @returns Number of days until the next occurrence of the target day
 */
export function getDaysUntilNextDayOfWeek(fromDayIndex: number, toDayIndex: number): number {
  return (toDayIndex - fromDayIndex + 7) % 7
}
