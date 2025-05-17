import type { GameSession } from "@/payload-types"
import type { CreateGameSessionData } from "@/types/collections"
import { semesterMock } from "./Semester.mock"

export const gameSessionCreateMock: CreateGameSessionData = {
  semester: semesterMock,
  startTime: "2025-04-28T07:00:00.000+12:00",
  endTime: "2025-04-28T09:00:00.000+12:00",
  capacity: 10,
  casualCapacity: 8,
}

export const gameSessionMock: GameSession = {
  id: "87efbe48887bc7ae09e305ed",
  semester: semesterMock,
  startTime: "2025-04-28T7:00:00.000+12:00",
  endTime: "2025-04-28T9:00:00.000+12:00",
  capacity: 10,
  casualCapacity: 8,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}
