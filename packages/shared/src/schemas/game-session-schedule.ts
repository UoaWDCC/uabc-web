import z from "zod"
import type { GameSessionSchedule as GameSessionScheduleType } from "../payload-types"
import type { CreateGameSessionScheduleData, UpdateGameSessionScheduleData } from "../types"
import { PaginationDataSchema } from "./query"
import { SemesterSchema } from "./semester"

export const GameSessionScheduleSchema = z.object({
  id: z.string(),
  semester: z.union([z.string(), SemesterSchema]),
  // Payload generates a hard coded weekdays, the `satisfies` operator is used to ensure the type matches
  day: z.enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
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
  data: PaginationDataSchema.extend({
    docs: z.array(GameSessionScheduleSchema),
  }),
})

export const GetGameSessionScheduleResponseSchema = z.object({
  data: GameSessionScheduleSchema,
})

export const UpdateGameSessionScheduleRequestSchema =
  CreateGameSessionScheduleRequestSchema.partial() satisfies z.ZodType<UpdateGameSessionScheduleData>
