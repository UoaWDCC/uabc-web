import { AUTH_COOKIE_NAME } from "@repo/shared"
import { MEMBER_USER_UID, memberUserMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { adminToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/admin/users/[id]/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()

  describe("GET", () => {
    it("should return all bookings for a specific user", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const booking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: memberUserMock,
      })
      const booking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: memberUserMock,
      })

      const response = await GET(
        createMockNextRequest(`/api/admin/users/${MEMBER_USER_UID}/bookings`),
        {
          params: Promise.resolve({ id: MEMBER_USER_UID }),
        },
      )
      const json = await response.json()

      expect(response.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(expect.arrayContaining([booking1, booking2]))
    })

    it("should return empty if there are no bookings for the specific user", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const response = await GET(
        createMockNextRequest(`/api/admin/users/${MEMBER_USER_UID}/bookings`),
        {
          params: Promise.resolve({ id: MEMBER_USER_UID }),
        },
      )
      const json = await response.json()

      expect(response.status).toBe(StatusCodes.OK)
      expect(json.data).toStrictEqual([])
    })

    it("should return 500 and manage any unexpected errors ", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      vi.spyOn(BookingDataService.prototype, "getAllBookingsByUserId").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const response = await GET(
        createMockNextRequest("/api/admin/users/placeholder-id/bookings"),
        {
          params: Promise.resolve({ id: "placeholder-id" }),
        },
      )
      const json = await response.json()

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
