import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { DELETE } from "./route"

describe("/api/admin/bookings/[id]", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()

  describe("DELETE", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const booking = await bookingDataService.createBooking(bookingCreateMock)
      const response = await DELETE(
        createMockNextRequest(`/api/admin/bookings/${booking.id}`, "DELETE"),
        {
          params: Promise.resolve({ id: booking.id }),
        },
      )
      const json = await response.json()
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(json).toStrictEqual({ error: "No scope" })
    })
    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const booking = await bookingDataService.createBooking(bookingCreateMock)
      const response = await DELETE(
        createMockNextRequest(`/api/admin/bookings/${booking.id}`, "DELETE"),
        {
          params: Promise.resolve({ id: booking.id }),
        },
      )
      const json = await response.json()
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(json).toStrictEqual({ error: "No scope" })
    })

    it("should delete booking if user is an admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const booking = await bookingDataService.createBooking(bookingCreateMock)
      const response = await DELETE(
        createMockNextRequest(`/api/admin/bookings/${booking.id}`, "DELETE"),
        {
          params: Promise.resolve({ id: booking.id }),
        },
      )
      expect(response.status).toBe(StatusCodes.NO_CONTENT)
      await expect(bookingDataService.getBookingById(booking.id)).rejects.toThrow("Not Found")
    })

    it("should return 404 if booking is non existent", async () => {
      const response = await DELETE(
        createMockNextRequest("/api/admin/bookings/nonexistent-id", "DELETE"),
        {
          params: Promise.resolve({ id: "nonexistent-id" }),
        },
      )
      expect(response.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("should return 500 if internal server errors occur", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      vi.spyOn(BookingDataService.prototype, "deleteBooking").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const response = await DELETE(createMockNextRequest("/api/admin/bookings/placeholder-id"), {
        params: Promise.resolve({ id: "placeholder-id" }),
      })
      const json = await response.json()
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
