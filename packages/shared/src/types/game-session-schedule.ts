import type z from "zod"
import type {
  CreateGameSessionScheduleRequestSchema,
  UpdateGameSessionScheduleRequestSchema,
} from "../schemas"

export type CreateGameSessionScheduleRequest = z.infer<
  typeof CreateGameSessionScheduleRequestSchema
>
export type UpdateGameSessionScheduleRequest = z.infer<
  typeof UpdateGameSessionScheduleRequestSchema
>
