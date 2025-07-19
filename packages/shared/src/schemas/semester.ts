import { z } from "zod"
import { Weekday } from "../enums"
import type { Semester } from "../payload-types"
import type { CreateSemesterData, EditSemesterData } from "../types"

export const SemesterSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  breakStart: z.string(),
  breakEnd: z.string(),
  bookingOpenDay: z.nativeEnum(Weekday),
  bookingOpenTime: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<Semester>

export const CreateSemesterRequestSchema = z.object({
  name: z.string(),
  startDate: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endDate: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  breakStart: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  breakEnd: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  bookingOpenDay: z.nativeEnum(Weekday),
  bookingOpenTime: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
}) satisfies z.ZodType<CreateSemesterData>

export const UpdateSemesterRequestSchema =
  CreateSemesterRequestSchema.partial() satisfies z.ZodType<EditSemesterData>

export const GetSemesterResponseSchema = z.object({
  data: SemesterSchema,
})

export const GetSemestersResponseSchema = z.object({
  data: z.array(SemesterSchema),
})
