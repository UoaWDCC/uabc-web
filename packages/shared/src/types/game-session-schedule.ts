import type z from "zod"
import type {
  CreateGameSessionScheduleRequestSchema,
  GetAllGameSessionSchedulesResponseSchema,
  UpdateGameSessionScheduleRequestSchema,
} from "../schemas"

export type CreateGameSessionScheduleRequest = z.infer<
  typeof CreateGameSessionScheduleRequestSchema
>
export type UpdateGameSessionScheduleRequest = z.infer<
  typeof UpdateGameSessionScheduleRequestSchema
>
export type GetAllGameSessionSchedulesResponse = z.infer<
  typeof GetAllGameSessionSchedulesResponseSchema
>
