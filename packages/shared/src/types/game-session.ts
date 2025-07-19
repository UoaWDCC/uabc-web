import type z from "zod"
import type {
  GameSessionScheduleSchema,
  GetAllGameSessionsResponseSchema,
  UpdateGameSessionRequestSchema,
} from "../schemas"

export type GameSessionSchedule = z.infer<typeof GameSessionScheduleSchema>
export type UpdateGameSessionRequest = z.infer<typeof UpdateGameSessionRequestSchema>
export type GetAllGameSessionsResponse = z.infer<typeof GetAllGameSessionsResponseSchema>
