import { MS_PER_DAY } from "../constants"
import type { Semester } from "../payload-types"

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

export const semesterMockBookingNotOpen: Semester = {
  ...semesterMock,
  bookingOpenDay: "sunday",
  bookingOpenTime: new Date(Date.now() + MS_PER_DAY).toISOString(),
}
