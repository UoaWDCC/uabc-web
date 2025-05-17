import type { GameSessionSchedule } from "@/payload-types"
import type { CreateGameSessionScheduleData } from "@/types/collections"

export const gameSessionScheduleMock: GameSessionSchedule = {
  id: "8f3a2b1c4d5e6f7a8b9c0d1e",
  startTime: new Date(2025, 0, 1, 10, 0).toISOString(),
  endTime: new Date(2025, 0, 1, 12, 0).toISOString(),
  capacity: 60,
  casualCapacity: 5,
  semester: "6f7a8b9c0d1e8f3a2b1c4d5e",
  createdAt: new Date(2025, 0, 1).toISOString(),
  updatedAt: new Date(2025, 0, 1).toISOString(),
}

export const gameSessionScheduleCreateMock: CreateGameSessionScheduleData = {
  startTime: new Date(2025, 0, 1, 12, 0).toISOString(),
  endTime: new Date(2025, 0, 1, 14, 0).toISOString(),
  capacity: 60,
  casualCapacity: 5,
  semester: "6f7a8b9c0d1e8f3a2b1c4d5e",
}
