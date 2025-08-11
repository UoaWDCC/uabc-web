import type { GameSession } from "../payload-types"
import { gameSessionScheduleMock } from "./gameSessionSchedule.mock"
import { semesterMock, semesterMockBookingNotOpen } from "./Semester.mock"

export const gameSessionMock: GameSession = {
  id: "87efbe48887bc7ae09e305ed",
  semester: semesterMock,
  startTime: new Date(Date.UTC(2025, 6, 19, 9, 0, 0)).toISOString(),
  endTime: new Date(Date.UTC(2025, 6, 19, 11, 0, 0)).toISOString(),
  openTime: new Date(Date.UTC(2025, 6, 19, 8, 0, 0)).toISOString(),
  gameSessionSchedule: gameSessionScheduleMock,
  capacity: 10,
  casualCapacity: 8,
  updatedAt: new Date(Date.UTC(2025, 0, 1)).toISOString(),
  createdAt: new Date(Date.UTC(2025, 0, 1)).toISOString(),
}

export const gameSessionMockBookingNotOpen: GameSession = {
  ...gameSessionMock,
  semester: semesterMockBookingNotOpen,
  startTime: new Date(Date.UTC(2025, 6, 21, 9, 0, 0)).toISOString(), // Monday July 21, 2025 at 9am UTC
  endTime: new Date(Date.UTC(2025, 6, 21, 11, 0, 0)).toISOString(), // Monday July 21, 2025 at 11am UTC
  openTime: new Date(Date.UTC(2025, 6, 21, 8, 0, 0)).toISOString(),
}
