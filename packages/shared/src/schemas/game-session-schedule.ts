import z from "zod"
import type { GameSessionSchedule as GameSessionScheduleType } from "../payload-types"
import type { CreateGameSessionScheduleData, UpdateGameSessionScheduleData } from "../types"
import { WeekdayZodEnum } from "../types"
import { PaginationDataSchema } from "./query"
import { SemesterSchema } from "./semester"

export const CreateGameSchedulePopUpFormDataSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    location: z.string().min(1, "Location is required"),
    day: WeekdayZodEnum,
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
    casualCapacity: z.coerce.number().int().min(1, "Casual capacity must be at least 1"),
  })
  .refine(
    ({ startTime, endTime }) => {
      if (!startTime || !endTime) {
        return true
      }
      return endTime > startTime
    },
    { message: "End time must be after start time", path: ["endTime"] },
  )

export type CreateGameSchedulePopUpFormValues = z.infer<
  typeof CreateGameSchedulePopUpFormDataSchema
>

export const GameSessionScheduleSchema = z.object({
  id: z.string(),
  semester: z.union([z.string(), SemesterSchema]),
  // Payload generates a hard coded weekdays, the `satisfies` operator is used to ensure the type matches
  day: WeekdayZodEnum,
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

export const GetGameSessionSchedulesBySemesterResponseSchema = z.object({
  data: z.array(GameSessionScheduleSchema),
})

export const UpdateGameSessionScheduleRequestSchema =
  CreateGameSessionScheduleRequestSchema.partial() satisfies z.ZodType<UpdateGameSessionScheduleData>
