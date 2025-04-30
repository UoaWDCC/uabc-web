import { z } from "zod"
import { Weekday } from "../types"

export const UpdateSemesterRequestBody = z.object({
  name: z.string().optional(),
  startDate: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true })
    .optional(),
  endDate: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true })
    .optional(),
  breakStart: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true })
    .optional(),
  breakEnd: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true })
    .optional(),
  bookingOpenDay: z.nativeEnum(Weekday).optional(),
  bookingOpenTime: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true })
    .optional(),
})

export const CreateSemesterRequestBody = z.object({
  name: z.string(),
  startDate: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true }),
  endDate: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true }),
  breakStart: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true }),

  breakEnd: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true }),
  bookingOpenDay: z.nativeEnum(Weekday),
  bookingOpenTime: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format", offset: true }),
})
