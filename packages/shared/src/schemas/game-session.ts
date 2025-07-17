import z from "zod"
import type { GameSession } from "../payload-types"
import type { CreateGameSessionData, UpdateGameSessionData } from "../types"
import { GameSessionScheduleSchema } from "./game-session-schedule"
import { SemesterSchema } from "./semester"

export const GameSessionSchema = z.object({
  id: z.string(),
  gameSessionSchedule: z.union([z.string(), z.null(), GameSessionScheduleSchema]),
  semester: z.union([z.string(), SemesterSchema]),
  startTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  capacity: z.number(),
  casualCapacity: z.number(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<GameSession>

export const CreateGameSessionRequestSchema = GameSessionSchema.omit({
  updatedAt: true,
  createdAt: true,
  id: true,
}) satisfies z.ZodType<CreateGameSessionData>

export const UpdateGameSessionRequestSchema =
  CreateGameSessionRequestSchema.partial() satisfies z.ZodType<UpdateGameSessionData>

export const GetGameSessionResponseSchema = z.object({
  data: GameSessionSchema,
})
