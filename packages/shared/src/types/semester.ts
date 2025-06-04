import { z } from "zod"

export const CreateSemesterRequestBody = z.object({
  name: z.string(),
  startDate: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  endDate: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  breakStart: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  breakEnd: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  bookingOpenDay: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  bookingOpenTime: z
    .string()
    .datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
})
