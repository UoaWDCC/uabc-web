import type z from "zod"
import type { GameSessionScheduleSchema, UpdateGameSessionRequestSchema } from "../schemas"

export type GameSessionSchedule = z.infer<typeof GameSessionScheduleSchema>
export type UpdateGameSessionRequest = z.infer<typeof UpdateGameSessionRequestSchema>
