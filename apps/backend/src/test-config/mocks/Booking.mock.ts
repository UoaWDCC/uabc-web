import type { Booking } from "@/payload-types"
import type { CreateBookingData } from "@/types/collections"
import { gameSessionMock } from "./GameSession.mock"
import { userMock } from "./User.mock"

export const bookingCreateMock: CreateBookingData = {
  user: userMock,
  gameSession: gameSessionMock,
  playerLevel: "beginner",
}

export const bookingCreateMock2: CreateBookingData = {
  user: userMock,
  gameSession: gameSessionMock,
  playerLevel: "advanced",
}

export const bookingMock: Booking = {
  id: "ccaf8f75ceb9f059773d4774",
  user: userMock,
  gameSession: gameSessionMock,
  playerLevel: "beginner",
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}
