import { AUTH_COOKIE_NAME } from "@repo/shared"
import { casualUserMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { casualToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/me/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()

  describe("GET", () => {
    it("should return all bookings for the current user", async () => {
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
