import { z } from "zod"
import { Weekday } from "../types"

export const UpdateSemesterRequestBody = z.object({
  name: z.string().optional(),
  startDate: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" })
    .optional(),
  endDate: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" })
    .optional(),
  breakStart: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" })
    .optional(),
  breakEnd: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" })
    .optional(),
  bookingOpenDay: z.nativeEnum(Weekday).optional(),
  bookingOpenTime: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" })
    .optional(),
})

export const CreateSemesterRequestBody = z.object({
  name: z.string(),
  startDate: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endDate: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  breakStart: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),

  breakEnd: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  bookingOpenDay: z.nativeEnum(Weekday),
  bookingOpenTime: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
})
