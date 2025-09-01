import type z from "zod"
import type { GameSession } from "../payload-types"
import type {
  GameSessionScheduleSchema,
  GameSessionWithCountsSchema,
  GetAllGameSessionsBySemesterResponseSchema,
  GetCurrentGameSessionsResponseSchema,
  GetPaginatedGameSessionsResponseSchema,
  UpdateGameSessionRequestSchema,
} from "../schemas"
import type { GameSessionStatus } from "./enums"

export type GameSessionSchedule = z.infer<typeof GameSessionScheduleSchema>
export type UpdateGameSessionRequest = z.infer<typeof UpdateGameSessionRequestSchema>
export type GetPaginatedGameSessionsResponse = z.infer<
  typeof GetPaginatedGameSessionsResponseSchema
>
export type GetAllGameSessionsBySemesterResponse = z.infer<
  typeof GetAllGameSessionsBySemesterResponseSchema
>

export type GetCurrentGameSessionsResponse = z.infer<typeof GetCurrentGameSessionsResponseSchema>

/**
 * Game session with attendee counts for admin use
 */
export type GameSessionWithCounts = z.infer<typeof GameSessionWithCountsSchema>

/**
 * Admin game session type with additional UI properties
 */
export type AdminGameSession = GameSessionWithCounts & {
  /**
   * The day of the week for the game session
   */
  day: string
  /**
   * The status of the game session
   */
  status: GameSessionStatus
}

/**
 * Session item type for UI components
 *
 * This type represents a session item that can be used in UI components
 * for displaying and selecting sessions. It extends the base GameSession
 * with additional UI-specific properties.
 */
export type SessionItem = Pick<
  GameSession,
  "name" | "location" | "startTime" | "endTime" | "capacity" | "casualCapacity" | "id"
> & {
  disabled?: boolean
  attendees: number
  casualAttendees: number
  date: string
}
