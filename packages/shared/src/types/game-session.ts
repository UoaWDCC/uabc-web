import type z from "zod"
import type { GameSession } from "../payload-types"
import type {
  GameSessionScheduleSchema,
  GetAllGameSessionsResponseSchema,
  UpdateGameSessionRequestSchema,
} from "../schemas"

export type GameSessionSchedule = z.infer<typeof GameSessionScheduleSchema>
export type UpdateGameSessionRequest = z.infer<typeof UpdateGameSessionRequestSchema>
export type GetAllGameSessionsResponse = z.infer<typeof GetAllGameSessionsResponseSchema>

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

/**
 * Select item type for dropdown/select components
 */
export type SelectItem = {
  label: string
  value: string
}
