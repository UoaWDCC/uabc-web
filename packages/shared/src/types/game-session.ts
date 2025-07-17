import type z from "zod"
import type {
  CreateGameSessionScheduleRequestSchema,
  GameSessionScheduleSchema,
  UpdateGameSessionScheduleRequestSchema,
} from "../schemas"

export type GameSessionSchedule = z.infer<typeof GameSessionScheduleSchema>
export type CreateGameSessionScheduleRequest = z.infer<
  typeof CreateGameSessionScheduleRequestSchema
>
export type UpdateGameSessionScheduleRequest = z.infer<
  typeof UpdateGameSessionScheduleRequestSchema
>
