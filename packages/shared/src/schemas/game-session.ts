import z from "zod"
import type { GameSessionSchedule } from "@/payload-types"
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
  startTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  capacity: z.number(),
  casualCapacity: z.number(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<GameSessionSchedule>

export const CreateGameSessionScheduleRequestSchema = z.object({
  semester: z.union([z.string(), SemesterSchema]),
  day: z.nativeEnum(Weekday),
  startTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endTime: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  capacity: z.number(),
  casualCapacity: z.number(),
}) satisfies z.ZodType<CreateGameSessionScheduleData>

export const UpdateGameSessionScheduleRequestSchema =
  CreateGameSessionScheduleRequestSchema.partial() satisfies z.ZodType<UpdateGameSessionScheduleData>
