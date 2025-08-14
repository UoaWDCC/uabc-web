import z from "zod"
import type { GameSession } from "../payload-types"
import type { CreateGameSessionData, UpdateGameSessionData } from "../types"
import { GameSessionScheduleSchema } from "./game-session-schedule"
import { PaginationDataSchema } from "./query"
import { SemesterSchema } from "./semester"

export const GameSessionSchema = z.object({
  id: z.string(),
  gameSessionSchedule: z.union([z.string(), GameSessionScheduleSchema]).nullable().optional(),
  semester: z.union([z.string(), SemesterSchema]),
  openTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  startTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  name: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  capacity: z.number(),
  casualCapacity: z.number(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<GameSession>

export const CreateGameSessionRequestSchema = GameSessionSchema.omit({
  updatedAt: true,
  createdAt: true,
  id: true,
  openTime: true,
}) satisfies z.ZodType<Omit<CreateGameSessionData, "openTime">>

export const UpdateGameSessionRequestSchema =
  CreateGameSessionRequestSchema.partial() satisfies z.ZodType<UpdateGameSessionData>

export const GetGameSessionResponseSchema = z.object({
  data: GameSessionSchema,
})

export const GetPaginatedGameSessionsResponseSchema = z.object({
  data: PaginationDataSchema.extend({
    docs: z.array(GameSessionSchema),
  }),
})

export const GetAllGameSessionsBySemesterResponseSchema = z.object({
  data: z.array(GameSessionSchema),
})
