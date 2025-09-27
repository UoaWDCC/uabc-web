import { AUTH_COOKIE_NAME } from "@repo/shared"
import { casualUserMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock, futureBookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { futureGameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { casualToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/me/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()

  describe("GET", () => {
    it("should return all bookings for the current user if the query type is all", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const booking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })
      const booking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })

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

      const { id } = await gameSessionDataService.createGameSession(futureGameSessionCreateMock)
      console.log(await gameSessionDataService.getGameSessionById(id))

      const bookingsToCreate = [
        ...Array.from({ length: 15 }, (_, _i) => ({
          ...bookingCreateMock,
        })),
        {
          ...futureBookingCreateMock,
          gameSession: id,
        },
      ]
      await Promise.all(bookingsToCreate.map((u) => bookingDataService.createBooking(u)))

      const req = createMockNextRequest("/api/me/bookings?type=future")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.length).toBe(1)
      expect(json.data[0].gameSession).toBe(id)
      expect(new Date(json.data[0].startTime).getTime()).toBeGreaterThan(Date.now())
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
