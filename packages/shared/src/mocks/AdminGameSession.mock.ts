import { GameSessionStatus, Weekday } from "../types/enums"
import type { AdminGameSession } from "../types/game-session"

export const adminGameSessionBaseMock: AdminGameSession = {
  id: "session-123",
  day: Weekday.tuesday,
  status: GameSessionStatus.ONGOING,
  startTime: "2025-01-21T19:30:00Z",
  endTime: "2025-01-21T22:00:00Z",
  name: "UoA Rec Centre",
  location: "17 Symonds Street",
  attendees: 39,
  capacity: 40,
  casualAttendees: 5,
  casualCapacity: 10,
  openTime: "2025-01-21T18:30:00Z",
  semester: "semester-123",
  updatedAt: "2025-01-21T00:00:00Z",
  createdAt: "2025-01-21T00:00:00Z",
}

export const adminGameSessionUpcomingMock: AdminGameSession = {
  ...adminGameSessionBaseMock,
  status: GameSessionStatus.UPCOMING,
  attendees: 25,
}

export const adminGameSessionPastMock: AdminGameSession = {
  ...adminGameSessionBaseMock,
  status: GameSessionStatus.PAST,
  attendees: 40,
}

export const adminGameSessionLowAttendanceMock: AdminGameSession = {
  ...adminGameSessionBaseMock,
  attendees: 15,
}

export const adminGameSessionFullCapacityMock: AdminGameSession = {
  ...adminGameSessionBaseMock,
  attendees: 40,
}
