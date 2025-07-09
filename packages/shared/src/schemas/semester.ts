import { Weekday } from "@repo/shared"
import { z } from "zod"
import type { Semester } from "../payload-types"

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

export const GetSemesterResponseSchema = z.object({
  data: SemesterSchema,
})

export const GetSemestersResponseSchema = z.object({
  data: z.array(SemesterSchema),
})
