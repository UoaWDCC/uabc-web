import { GameSessionStatus } from "@repo/shared"

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
