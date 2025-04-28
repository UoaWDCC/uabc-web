import type { Booking } from "@/payload-types"
import type { CreateBookingData } from "@/types/collections"
import { gameSessionMock } from "./GameSession.mock"
import { userMock } from "./User.mock"

export const bookingCreateMock: CreateBookingData = {
  user: userMock,
  gameSession: gameSessionMock,
  playerLevel: "beginner",
}

export const bookingMock: Booking = {
  id: "uabcisareallycoolclub",
  user: userMock,
  gameSession: gameSessionMock,
  playerLevel: "beginner",
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}
