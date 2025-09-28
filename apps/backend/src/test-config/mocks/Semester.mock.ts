import { type CreateSemesterData, Weekday } from "@repo/shared"
import type { Semester } from "@repo/shared/payload-types"

export const semesterCreateMock: CreateSemesterData = {
  name: "Semester 1 2025",
  startDate: new Date(2025, 0, 1, 12, 0).toISOString(),
  endDate: new Date(2025, 0, 1, 14, 0).toISOString(),
  breakStart: new Date(2025, 0, 1, 15, 0).toISOString(),
  breakEnd: new Date(2025, 0, 1, 16, 0).toISOString(),
  bookingOpenDay: Weekday.monday,
  bookingOpenTime: new Date(1970, 0, 1, 12, 0).toISOString(), // 12pm
}

export const semesterMock: Semester = {
  id: "e0b2e0db3b65d10f864aeedb",
  name: "Semester 1 2025",
  startDate: new Date(2025, 0, 1, 12, 0).toISOString(),
  endDate: new Date(2025, 0, 1, 14, 0).toISOString(),
  breakStart: new Date(2025, 0, 1, 15, 0).toISOString(),
  breakEnd: new Date(2025, 0, 1, 16, 0).toISOString(),
  bookingOpenDay: Weekday.monday,
  bookingOpenTime: new Date(1970, 0, 1, 12, 0).toISOString(), // 12pm
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const semesterCascadeCreateMock: CreateSemesterData = {
  name: "Semester 1 2025",
  startDate: new Date(2025, 2, 3, 12, 0).toISOString(),
  endDate: new Date(2025, 5, 30, 14, 0).toISOString(),
  breakStart: new Date(2025, 3, 14, 15, 0).toISOString(),
  breakEnd: new Date(2025, 3, 25, 12, 0).toISOString(),
  bookingOpenDay: "monday",
  bookingOpenTime: new Date(1970, 0, 1, 12, 0).toISOString(), // 12m
}
