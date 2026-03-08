import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/me/bookings/remaining", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()
  const semesterDataService = new SemesterDataService()

  beforeEach(async () => {
    const currentDate = new Date()
    const startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
    const endDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // 1 day from now

    await semesterDataService.createSemester({
      ...semesterCreateMock,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
  })

  describe("GET", () => {
    it("should return 1 remaining session for a casual user with no bookings this week", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await GET(createMockNextRequest("/api/me/bookings/remaining"))

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data.remainingSessions).toBe(1)
    })

    it("should return 0 remaining sessions for a casual user with a booking this week", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const now = new Date()
      const gameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      })

      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession,
      })

      const response = await GET(createMockNextRequest("/api/me/bookings/remaining"))

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data.remainingSessions).toBe(0)
    })

    it("should return remaining sessions from user object for a member user", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const response = await GET(createMockNextRequest("/api/me/bookings/remaining"))

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(typeof json.data.remainingSessions).toBe("number")
    })

    it("should return 500 and handle unexpected errors", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const mockGetCurrentSemester = vi
        .spyOn(SemesterDataService.prototype, "getCurrentSemester")
        .mockRejectedValueOnce(new Error("Database error"))

      const response = await GET(createMockNextRequest("/api/me/bookings/remaining"))

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(mockGetCurrentSemester).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
      mockGetCurrentSemester.mockRestore()
    })
  })
})
