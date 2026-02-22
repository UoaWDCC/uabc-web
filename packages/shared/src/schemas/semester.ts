import { z } from "zod"
import type { Semester } from "../payload-types"
import { type CreateSemesterData, type EditSemesterData, WeekdayZodEnum } from "../types"

export const SemesterInfoPopUpSchema = z.object({
  bookingOpenDay: z.enum(
    ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    { errorMap: () => ({ message: "Please select a day" }) },
  ),
  bookingOpenTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:mm)"),
})

export const SemesterSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  breakStart: z.string(),
  breakEnd: z.string(),
  // Payload generates a hard coded weekdays, the `satisfies` operator is used to ensure the type matches
  bookingOpenDay: WeekdayZodEnum,
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
  bookingOpenDay: WeekdayZodEnum,
  bookingOpenTime: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
}) satisfies z.ZodType<CreateSemesterData>

export const UpdateSemesterRequestSchema =
  CreateSemesterRequestSchema.partial() satisfies z.ZodType<EditSemesterData>

export const GetSemesterResponseSchema = z.object({
  data: SemesterSchema,
})

export const GetAllSemestersResponseSchema = z.object({
  data: z.array(SemesterSchema),
})

export const GetCurrentSemesterResponseSchema = z.object({
  data: SemesterSchema,
})

export const SemesterNamePopUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
})

export const SemesterDatePopUpSchema = z.object({
  startDate: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endDate: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
})
