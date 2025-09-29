import { GameSessionStatus } from "@repo/shared"
import dayjs from "dayjs"

/**
 * Gets the color scheme for a game session status
 *
 * Maps each game session status to an appropriate color scheme
 * for UI components like tags and badges.
 *
 * @param status The game session status
 * @returns The color scheme string for the status
 *
 * @example
 * ```ts
 * getStatusColor(GameSessionStatus.ONGOING) // Returns: "green"
 * getStatusColor(GameSessionStatus.UPCOMING) // Returns: "blue"
 * getStatusColor(GameSessionStatus.PAST) // Returns: "gray"
 * ```
 */
export const getStatusColor = (status: GameSessionStatus): string => {
  switch (status) {
    case GameSessionStatus.ONGOING:
      return "green"
    case GameSessionStatus.UPCOMING:
      return "blue"
    case GameSessionStatus.PAST:
      return "gray"
    default:
      return "gray"
  }
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
export const formatTime = (timeString: string): string => {
  return dayjs(timeString).format("h:mm A")
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
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}
