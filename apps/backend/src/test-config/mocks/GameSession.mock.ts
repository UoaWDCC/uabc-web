import type { CreateGameSessionData } from "@repo/shared"
import type { GameSession } from "@repo/shared/payload-types"
import { semesterMock } from "./Semester.mock"

export const gameSessionCreateMock: CreateGameSessionData = {
  semester: semesterMock,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  openTime: new Date().toISOString(),
  capacity: 10,
  casualCapacity: 8,
}

export const oneOffGameSessionCreateMock: CreateGameSessionData = {
  semester: semesterMock,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  openTime: new Date().toISOString(),
  capacity: 10,
  casualCapacity: 8,
  location: "240 Straight Zhao St",
  name: "Straight Zhao Venue",
}

export const gameSessionMock: GameSession = {
  id: "87efbe48887bc7ae09e305ed",
  semester: semesterMock,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  openTime: new Date().toISOString(),
  capacity: 10,
  casualCapacity: 8,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}
