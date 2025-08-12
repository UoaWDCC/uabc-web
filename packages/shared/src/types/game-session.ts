import type z from "zod"
import type {
  GameSessionScheduleSchema,
  GetPaginatedGameSessionsResponseSchema,
  UpdateGameSessionRequestSchema,
} from "../schemas"

export type GameSessionSchedule = z.infer<typeof GameSessionScheduleSchema>
export type UpdateGameSessionRequest = z.infer<typeof UpdateGameSessionRequestSchema>
export type GetPaginatedGameSessionsResponse = z.infer<
  typeof GetPaginatedGameSessionsResponseSchema
>
