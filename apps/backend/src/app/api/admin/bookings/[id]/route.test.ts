import { AUTH_COOKIE_NAME, type EditBookingData, PlayLevel } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { DELETE, PATCH } from "./route"

describe("/api/admin/bookings/[id]", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()

  describe("PATCH", () => {
    it("should return 401 if user is casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const res = await PATCH(createMockNextRequest("", "PATCH", {}), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await PATCH(createMockNextRequest("", "PATCH", {}), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should update the booking if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newBooking = await bookingDataService.createBooking(bookingCreateMock)
      const updateBooking: EditBookingData = { playerLevel: PlayLevel.BEGINNER }

      const res = await PATCH(createMockNextRequest("", "PATCH", updateBooking), {
        params: Promise.resolve({ id: newBooking.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const fetchedBooking = await bookingDataService.getBookingById(newBooking.id)
      expect(fetchedBooking.playerLevel).toBe(updateBooking.playerLevel)
    })

    it("should return 400 if request body is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(
        createMockNextRequest("", "PATCH", {
          playerLevel: "invalid",
        }),
        {
          params: Promise.resolve({ id: "some-id" }),
        },
      )

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toBe("Invalid request body")
      expect(json.details).toBeDefined()
    })

    it("should return 404 if booking is not found", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(createMockNextRequest("", "PATCH", {}), {
        params: Promise.resolve({ id: "invalid-id" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual("Booking not found")
    })

    it("should return 500 for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(BookingDataService.prototype, "updateBooking").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const res = await PATCH(createMockNextRequest("", "PATCH", bookingCreateMock), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })

  describe("DELETE", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await DELETE(createMockNextRequest("", "DELETE"), {
        params: Promise.resolve({ id: "test" }),
      })

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await response.json()
      expect(json).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const response = await DELETE(createMockNextRequest("", "DELETE"), {
        params: Promise.resolve({ id: "test" }),
      })

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await response.json()
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
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

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

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
