import type { Semester } from "@repo/shared/payload-types"
import { z } from "zod"
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
}) satisfies z.ZodType<Omit<Semester, "id" | "createdAt" | "updatedAt">>
