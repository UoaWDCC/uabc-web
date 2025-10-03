import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { casualToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/me/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()

  describe("GET", () => {
    it("should return all bookings for the current user if no query type is set", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const booking1 = await bookingDataService.createBooking(bookingCreateMock)
      const booking2 = await bookingDataService.createBooking(bookingCreateMock)

      const response = await GET(createMockNextRequest("/api/me/bookings"))

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toEqual(expect.arrayContaining([booking1, booking2]))
    })

    it("should return empty if there are no bookings", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await GET(createMockNextRequest("/api/me/bookings"))

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toStrictEqual([])
    })

    it("should return all future bookings for the current user if query type is set to future", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

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

      const pastBookingsToCreate = Array.from({ length: 2 }, (_, _i) => ({
        ...bookingCreateMock,
        gameSession: pastGameSession,
      }))
      await Promise.all(pastBookingsToCreate.map((u) => bookingDataService.createBooking(u)))

      const futureBookingToCreate = {
        ...bookingCreateMock,
        gameSession: futureGameSession,
      }
      const futureBooking = await bookingDataService.createBooking(futureBookingToCreate)

      const req = createMockNextRequest("/api/me/bookings?type=future")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.length).toBe(1)
      expect(json.data[0]).toStrictEqual(futureBooking)
      expect(Date.parse(json.data[0].gameSession.startTime)).toBeGreaterThan(Date.now())
    })

    it("should throw 400 if the type query is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await GET(createMockNextRequest("/api/me/bookings?type=invalid_query"))

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await response.json()
      expect(json.error).toBe("Invalid query parameters")
    })

    it("should return 500 and handle unexpected errors", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const mockGetBookings = vi
        .spyOn(BookingDataService.prototype, "getAllBookingsByUserId")
        .mockRejectedValueOnce(new Error("Database error"))

      const response = await GET(createMockNextRequest("/api/me/bookings"))

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
