import type z from "zod"
import type { GameSession } from "../payload-types"
import type {
  GameSessionScheduleSchema,
  GameSessionWithCapacityStatusSchema,
  GetAllGameSessionsBySemesterResponseSchema,
  GetGameSessionsWithCapacityStatusResponseSchema,
  GetPaginatedGameSessionsResponseSchema,
  UpdateGameSessionRequestSchema,
} from "../schemas"

export type GameSessionSchedule = z.infer<typeof GameSessionScheduleSchema>
export type UpdateGameSessionRequest = z.infer<typeof UpdateGameSessionRequestSchema>
export type GetPaginatedGameSessionsResponse = z.infer<
  typeof GetPaginatedGameSessionsResponseSchema
>
export type GetAllGameSessionsBySemesterResponse = z.infer<
  typeof GetAllGameSessionsBySemesterResponseSchema
>
export type GameSessionWithCapacityStatus = z.infer<typeof GameSessionWithCapacityStatusSchema>
export type GetGameSessionsWithCapacityStatusResponse = z.infer<
  typeof GetGameSessionsWithCapacityStatusResponseSchema
>

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
