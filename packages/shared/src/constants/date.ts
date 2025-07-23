export const MS_PER_DAY = 1000 * 60 * 60 * 24

export const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]
