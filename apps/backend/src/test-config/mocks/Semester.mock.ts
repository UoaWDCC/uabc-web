import type { Semester } from "@/payload-types"
import type { CreateSemesterData } from "@/types/collections"

export const semesterCreateMock: CreateSemesterData = {
  name: "Semester 1 2025",
  startDate: "2025-03-03T00:00:00.000+13:00",
  endDate: "2025-06-30T00:00:00.000+12:00",
  breakStart: "2025-04-14T00:00:00.000+12:00",
  breakEnd: "2025-04-25T00:00:00.000+12:00",
  bookingOpenDay: "monday",
  bookingOpenTime: "1970-01-01T00:00:00.000+00:00",
}

export const semesterMock: Semester = {
  id: "carrotsaregudforeyesight",
  name: "Semester 1 2025",
  startDate: "2025-03-03T00:00:00.000+13:00",
  endDate: "2025-06-30T00:00:00.000+12:00",
  breakStart: "2025-04-14T00:00:00.000+12:00",
  breakEnd: "2025-04-25T00:00:00.000+12:00",
  bookingOpenDay: "tuesday",
  bookingOpenTime: "1970-01-01T00:00:00.000+00:00",
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}
