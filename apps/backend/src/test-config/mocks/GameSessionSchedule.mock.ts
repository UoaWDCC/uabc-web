import { type CreateGameSessionScheduleData, Weekday } from "@repo/shared"
import type { GameSessionSchedule } from "@repo/shared/payload-types"

export const gameSessionScheduleMock: GameSessionSchedule = {
  id: "8f3a2b1c4d5e6f7a8b9c0d1e",
  name: "UoA Rec Center",
  location: "17 Symonds Street",
  day: Weekday.MONDAY,
  startTime: new Date(2025, 0, 1, 10, 0).toISOString(),
  endTime: new Date(2025, 0, 1, 12, 0).toISOString(),
  capacity: 60,
  casualCapacity: 5,
  semester: "6f7a8b9c0d1e8f3a2b1c4d5e",
  createdAt: new Date(2025, 0, 1).toISOString(),
  updatedAt: new Date(2025, 0, 1).toISOString(),
}

export const gameSessionScheduleCreateMock: CreateGameSessionScheduleData = {
  day: Weekday.MONDAY,
  name: "UoA Rec Center Create Mock",
  location: "17 Symonds Street Create Mock",
  startTime: new Date(2025, 0, 1, 12, 0).toISOString(),
  endTime: new Date(2025, 0, 1, 14, 0).toISOString(),
  capacity: 60,
  casualCapacity: 5,
  semester: "6f7a8b9c0d1e8f3a2b1c4d5e",
}
