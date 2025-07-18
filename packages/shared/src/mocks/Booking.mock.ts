import type { Booking } from "../payload-types"
import { gameSessionMock } from "./GameSession.mock"
import { casualUserMock } from "./User.mock"

export const bookingsMock: Booking[] = [
  {
    id: "ccaf8f75ceb9f059773d4774",
    user: casualUserMock,
    gameSession: gameSessionMock,
    playerLevel: "beginner",
    updatedAt: new Date(2025, 0, 1).toISOString(),
    createdAt: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: "ccaf8f75ceb9f059773d4775",
    user: casualUserMock,
    gameSession: gameSessionMock,
    playerLevel: "beginner",
    updatedAt: new Date(2025, 0, 1).toISOString(),
    createdAt: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: "ccaf8f75ceb9f059773d4776",
    user: casualUserMock,
    gameSession: gameSessionMock,
    playerLevel: "beginner",
    updatedAt: new Date(2025, 0, 1).toISOString(),
    createdAt: new Date(2025, 0, 1).toISOString(),
  },
]
