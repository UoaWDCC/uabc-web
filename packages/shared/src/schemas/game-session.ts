import z from "zod"
import type { GameSession, GameSessionSchedule as GameSessionScheduleType } from "../payload-types"
import {
  type CreateGameSessionData,
  type CreateGameSessionScheduleData,
  type UpdateGameSessionData,
  type UpdateGameSessionScheduleData,
  Weekday,
} from "../types"
import { SemesterSchema } from "./semester"

export const GameSessionScheduleSchema = z.object({
  id: z.string(),
  semester: z.union([z.string(), SemesterSchema]),
  day: z.nativeEnum(Weekday),
  name: z.string(),
  location: z.string(),
  startTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  capacity: z.number(),
  casualCapacity: z.number(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<GameSessionScheduleType>

export const CreateGameSessionScheduleRequestSchema = GameSessionScheduleSchema.omit({
  updatedAt: true,
  createdAt: true,
  id: true,
}) satisfies z.ZodType<CreateGameSessionScheduleData>

export const GetAllGameSessionSchedulesResponseSchema = z.object({
  data: z.array(GameSessionScheduleSchema),
})

export const GetGameSessionScheduleResponseSchema = z.object({
  data: GameSessionScheduleSchema,
})

export const UpdateGameSessionScheduleRequestSchema =
  CreateGameSessionScheduleRequestSchema.partial() satisfies z.ZodType<UpdateGameSessionScheduleData>

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
