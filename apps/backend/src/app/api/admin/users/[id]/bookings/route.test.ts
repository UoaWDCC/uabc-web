import { AUTH_COOKIE_NAME } from "@repo/shared"
import { CASUAL_USER_UID, MEMBER_USER_UID, memberUserMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/admin/users/[id]/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()

  describe("GET", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await GET(
        createMockNextRequest(`/api/admin/users/${CASUAL_USER_UID}/bookings`),
        {
          params: Promise.resolve({ id: CASUAL_USER_UID }),
        },
      )

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await response.json()
      expect(json).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const response = await GET(
        createMockNextRequest(`/api/admin/users/${MEMBER_USER_UID}/bookings`),
        {
          params: Promise.resolve({ id: MEMBER_USER_UID }),
        },
      )

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await response.json()
      expect(json).toStrictEqual({ error: "No scope" })
    })

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

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
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

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
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

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
