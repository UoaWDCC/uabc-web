import type { CreateBookingData } from "@repo/shared"
import type { Booking } from "@repo/shared/payload-types"
// import { casualUserMock } from "./User.mock"
import { casualUserMock } from "@repo/shared/test-config/mocks/User.mock"
import { gameSessionMock } from "./GameSession.mock"

export const bookingCreateMock: CreateBookingData = {
  user: casualUserMock,
  gameSession: gameSessionMock,
  playerLevel: "beginner",
}

export const bookingCreateMock2: CreateBookingData = {
  user: casualUserMock,
  gameSession: gameSessionMock,
  playerLevel: "advanced",
}

export const bookingMock: Booking = {
  id: "ccaf8f75ceb9f059773d4774",
  user: casualUserMock,
  gameSession: gameSessionMock,
  playerLevel: "beginner",
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}
