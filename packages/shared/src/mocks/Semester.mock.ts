import type { Semester } from "../payload-types"
import { Weekday } from "../types"

export const semesterMock: Semester = {
  id: "e0b2e0db3b65d10f864aeedb",
  name: "Semester 1 2025",
  startDate: new Date(Date.UTC(2025, 0, 1, 12, 0)).toISOString(),
  endDate: new Date(Date.UTC(2025, 0, 1, 14, 0)).toISOString(),
  breakStart: new Date(Date.UTC(2025, 0, 1, 15, 0)).toISOString(),
  breakEnd: new Date(Date.UTC(2025, 0, 1, 16, 0)).toISOString(),
  bookingOpenDay: Weekday.monday,
  bookingOpenTime: new Date(Date.UTC(1970, 0, 1, 12, 0)).toISOString(), // 12:00 UTC
  updatedAt: new Date(Date.UTC(2025, 0, 1)).toISOString(),
  createdAt: new Date(Date.UTC(2025, 0, 1)).toISOString(),
}

export const semesterMockBookingNotOpen: Semester = {
  ...semesterMock,
  bookingOpenDay: Weekday.saturday,
  bookingOpenTime: new Date(Date.UTC(1970, 0, 1, 0, 0, 0)).toISOString(), // 00:00 UTC
}
