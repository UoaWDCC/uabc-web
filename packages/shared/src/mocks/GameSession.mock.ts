import type { GameSession } from "../payload-types"
import { gameSessionScheduleMock } from "./gameSessionSchedule.mock"
import { semesterMock } from "./Semester.mock"

export const gameSessionMock: GameSession = {
  id: "87efbe48887bc7ae09e305ed",
  semester: semesterMock,
  startTime: new Date(2025, 6, 19, 9, 0, 0).toISOString(),
  endTime: new Date(2025, 6, 19, 11, 0, 0).toISOString(),
  gameSessionSchedule: gameSessionScheduleMock,
  capacity: 10,
  casualCapacity: 8,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}
