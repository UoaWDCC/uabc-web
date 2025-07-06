import { z } from "zod"
import type { CreateSemesterData, EditSemesterData } from "./collections"
import { Weekday } from "./enums"

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
