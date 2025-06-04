import type { CreateSemesterData } from "@repo/shared"
import type { Semester } from "@repo/shared/payload-types"
import { z } from "zod"

export const semesterCreateMock: CreateSemesterData = {
  name: "Semester 1 2025",
  startDate: new Date(2025, 0, 1, 12, 0).toISOString(),
  endDate: new Date(2025, 0, 1, 14, 0).toISOString(),
  breakStart: new Date(2025, 0, 1, 15, 0).toISOString(),
  breakEnd: new Date(2025, 0, 1, 16, 0).toISOString(),
  bookingOpenDay: "monday",
  bookingOpenTime: new Date(2025, 0, 1, 12, 0).toISOString(),
}

export const semesterMock: Semester = {
  id: "e0b2e0db3b65d10f864aeedb",
  name: "Semester 1 2025",
  startDate: new Date(2025, 0, 1, 12, 0).toISOString(),
  endDate: new Date(2025, 0, 1, 14, 0).toISOString(),
  breakStart: new Date(2025, 0, 1, 15, 0).toISOString(),
  breakEnd: new Date(2025, 0, 1, 16, 0).toISOString(),
  bookingOpenDay: "monday",
  bookingOpenTime: new Date(2025, 0, 1, 12, 0).toISOString(),
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

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
