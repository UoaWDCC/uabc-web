import { AUTH_COOKIE_NAME } from "@repo/shared"
import { gameSessionMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("api/admin/game-sessions/[id]/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()

  describe("GET", () => {
    it("return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await GET(createMockNextRequest("", "GET"), {
        params: Promise.resolve({ id: "test" }),
      })

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await response.json()
      expect(json).toStrictEqual({ error: "No scope" })
    })

    it("return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const response = await GET(createMockNextRequest("", "GET"), {
        params: Promise.resolve({ id: "test" }),
      })

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await response.json()
      expect(json).toStrictEqual({ error: "No scope" })
    })

    it("return all bookings for a certain GameSession if user is an admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const booking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSessionMock,
      })
      const booking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSessionMock,
      })

      const response = await GET(createMockNextRequest("", "GET"), {
        params: Promise.resolve({ id: gameSessionMock.id }),
      })

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toEqual(expect.arrayContaining([booking1, booking2]))
    })

    it("return empty if no bookings for a certain GameSession", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const response = await GET(createMockNextRequest("", "GET"), {
        params: Promise.resolve({ id: "no-bookings-id" }),
      })

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toStrictEqual([])
    })

    it("return 500 if any internal server errors occur", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      vi.spyOn(BookingDataService.prototype, "getBookingsBySessionId").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const response = await GET(createMockNextRequest("", "GET"), {
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
