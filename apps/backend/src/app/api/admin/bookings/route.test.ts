import { AUTH_COOKIE_NAME } from "@repo/shared"
import { adminUserMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/admin/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()

  describe("GET", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await GET(createMockNextRequest("/api/admin/bookings"))

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await response.json()
      expect(json).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const response = await GET(createMockNextRequest("/api/admin/bookings"))

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await response.json()
      expect(json).toStrictEqual({ error: "No scope" })
    })

    it("should return all bookings for the current user if the query type is all", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const booking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: adminUserMock,
      })
      const booking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: adminUserMock,
      })

      const response = await GET(createMockNextRequest("/api/admin/bookings"))

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toEqual(expect.arrayContaining([booking1, booking2]))
    })

    it("should return empty if there are no bookings", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const response = await GET(createMockNextRequest("/api/admin/bookings"))

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toStrictEqual([])
    })

    it("should return all future bookings for the current user if query type is set to future", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const pastGameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        startTime: new Date(2020, 0, 1).toISOString(),
        endTime: new Date(2020, 0, 1).toISOString(),
      })
      const futureGameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })

      const bookingsToCreate = [
        ...Array.from({ length: 15 }, (_, _i) => ({
          ...bookingCreateMock,
          user: adminUserMock,
          gameSession: pastGameSession,
        })),
        {
          ...bookingCreateMock,
          user: adminUserMock,
          gameSession: futureGameSession,
        },
      ]
      await Promise.all(bookingsToCreate.map((u) => bookingDataService.createBooking(u)))

      const req = createMockNextRequest("/api/admin/bookings?type=future")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.length).toBe(1)
      expect(json.data[0].gameSession.id).toBe(futureGameSession.id)
      expect(Date.parse(json.data[0].gameSession.startTime)).toBeGreaterThan(Date.now())
    })

    it("should throw 400 if the type query is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const response = await GET(createMockNextRequest("/api/admin/bookings?type=invalid_query"))

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await response.json()
      expect(json.error).toBe("Invalid query parameters")
    })

    it("should return 500 and handle unexpected errors", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const mockGetBookings = vi
        .spyOn(BookingDataService.prototype, "getAllBookingsByUserId")
        .mockRejectedValueOnce(new Error("Database error"))

      const response = await GET(createMockNextRequest("/api/admin/bookings"))

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(mockGetBookings).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
      mockGetBookings.mockRestore()
    })
  })
})
