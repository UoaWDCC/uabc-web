import z from "zod"
import type { GameSessionSchedule as GameSessionScheduleType } from "../payload-types"
import {
  type CreateGameSessionScheduleData,
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
  data: z.object({
    docs: z.array(GameSessionScheduleSchema).optional().nullable(),
    totalDocs: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    page: z.number(),
    pagingCounter: z.number(),
    hasPrevPage: z.boolean(),
    hasNextPage: z.boolean(),
    prevPage: z.number().nullable(),
    nextPage: z.number().nullable(),
  }),
})

export const GetGameSessionScheduleResponseSchema = z.object({
  data: GameSessionScheduleSchema,
})

export const UpdateGameSessionScheduleRequestSchema =
  CreateGameSessionScheduleRequestSchema.partial() satisfies z.ZodType<UpdateGameSessionScheduleData>
