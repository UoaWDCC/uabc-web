import { AUTH_COOKIE_NAME, type UpdateGameSessionScheduleData } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { payload } from "@/data-layer/adapters/Payload"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { DELETE, GET, PATCH } from "./route"

describe("/api/admin/game-session-schedules/[id]", async () => {
  const gameSessionDataService = new GameSessionDataService()
  const cookieStore = await cookies()

  describe("GET", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should fetch gameSessionSchedule if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: newGameSessionSchedule.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toStrictEqual(newGameSessionSchedule)
    })

    it("should return 404 if gameSessionSchedule is non-existent", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: "non-existent" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await GET(createMockNextRequest(), {
        params: Promise.reject(new Error("Param parsing failed")),
      })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })

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

    it("should update the game session schedule if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const updateGameSessionSchedule: UpdateGameSessionScheduleData = { capacity: 100 }

      const res = await PATCH(createMockNextRequest("", "PATCH", updateGameSessionSchedule), {
        params: Promise.resolve({ id: newGameSessionSchedule.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const fetchedGameSessionSchedule = await gameSessionDataService.getGameSessionScheduleById(
        newGameSessionSchedule.id,
      )
      expect(fetchedGameSessionSchedule.capacity).toBe(updateGameSessionSchedule.capacity)
    })

    it("should return 400 if request body is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(
        createMockNextRequest("", "PATCH", {
          day: "invalid",
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

    it("should return 400 if invalid date is provided", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(
        createMockNextRequest("", "PATCH", {
          startTime: "invalid-date",
        }),
        {
          params: Promise.resolve({ id: "some-id" }),
        },
      )

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.startTime[0]).toEqual(
        "Invalid date format, should be in ISO 8601 format",
      )
    })

    it("should return 404 if game session schedule is not found", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(createMockNextRequest("", "PATCH", {}), {
        params: Promise.resolve({ id: "invalid-id" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual("Game session schedule not found")
    })

    it("should return 500 for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(GameSessionDataService.prototype, "updateGameSessionSchedule").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const res = await PATCH(createMockNextRequest("", "PATCH", gameSessionScheduleCreateMock), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })

  describe("DELETE", () => {
    const bookingDataService = new BookingDataService()
    const gameSessionDataService = new GameSessionDataService()

    it("should delete game session schedule and its game session and bookings when delateRelatedDocs is true", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const newGameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        gameSessionSchedule: newGameSessionSchedule,
      })
      const booking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: newGameSession,
      })
      const booking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: newGameSession,
      })

      const res = await DELETE(
        createMockNextRequest("/api/admin/game-session-schedules?delateRelatedDocs=true", "DELETE"),
        {
          params: Promise.resolve({
            id: newGameSessionSchedule.id,
          }),
        },
      )

      expect(res.status).toBe(StatusCodes.NO_CONTENT)

      await expect(
        gameSessionDataService.getGameSessionScheduleById(newGameSessionSchedule.id),
      ).rejects.toThrow("Not Found")
      await expect(gameSessionDataService.getGameSessionById(newGameSession.id)).rejects.toThrow(
        "Not Found",
      )
      await expect(bookingDataService.getBookingById(booking1.id)).rejects.toThrow("Not Found")
      await expect(bookingDataService.getBookingById(booking2.id)).rejects.toThrow("Not Found")
    })

    it.for([
      // Test case 1: Explicit false boolean parameter
      "/api/admin/game-session-schedules?delateRelatedDocs=false",
      // Test case 2: Flag parameter without value (equivalent to true in query params)
      "/api/admin/game-session-schedules?delateRelatedDocs",
      // Test case 3: Unrelated query parameter (testing irrelevant params)
      "/api/admin/game-session-schedules?straightZhao",
      // Test case 4: Base URL with no query parameters
      "/api/admin/game-session-schedules",
    ] as const)(
      "should default to not delete related game session and bookings when cascade is false or not specified",
      async (route) => {
        cookieStore.set(AUTH_COOKIE_NAME, adminToken)

        const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
          gameSessionScheduleCreateMock,
        )
        const newGameSession = await gameSessionDataService.createGameSession({
          ...gameSessionCreateMock,
          gameSessionSchedule: newGameSessionSchedule,
        })
        const booking1 = await bookingDataService.createBooking({
          ...bookingCreateMock,
          gameSession: newGameSession,
        })
        const booking2 = await bookingDataService.createBooking({
          ...bookingCreateMock,
          gameSession: newGameSession,
        })

        const res = await DELETE(createMockNextRequest(route, "DELETE"), {
          params: Promise.resolve({
            id: newGameSessionSchedule.id,
          }),
        })

        expect(res.status).toBe(StatusCodes.NO_CONTENT)

        await expect(
          gameSessionDataService.getGameSessionScheduleById(newGameSessionSchedule.id),
        ).rejects.toThrow("Not Found")
        expect(await gameSessionDataService.getGameSessionById(newGameSession.id)).toBeDefined()
        expect(await bookingDataService.getBookingById(booking1.id)).toBeDefined()
        expect(await bookingDataService.getBookingById(booking2.id)).toBeDefined()
      },
    )

    it("should rollback transaction if error occurs during deleteRelatedDocs and return 500", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const newGameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        gameSessionSchedule: newGameSessionSchedule,
      })
      const booking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: newGameSession,
      })

      const mockDeleteBookings = vi
        .spyOn(GameSessionDataService.prototype, "deleteGameSessionSchedule")
        .mockRejectedValueOnce(new Error("Delete failed"))

      const res = await DELETE(
        createMockNextRequest("/api/admin/game-session-schedules?cascade=true", "DELETE"),
        {
          params: Promise.resolve({
            id: newGameSessionSchedule.id,
          }),
        },
      )

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(await res.json()).toStrictEqual({
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      })

      // Verify game session schedule, game session and booking still exist (transaction rolled back)
      expect(
        await gameSessionDataService.getGameSessionScheduleById(newGameSessionSchedule.id),
      ).toBeDefined()
      expect(await gameSessionDataService.getGameSessionById(newGameSession.id)).toBeDefined()
      expect(await bookingDataService.getBookingById(booking.id)).toBeDefined()

      mockDeleteBookings.mockRestore()
    })

    it("should handle transaction management correctly", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      // In a test environment beginTransaction does not return a transaction ID
      vi.spyOn(payload.db, "beginTransaction").mockResolvedValue("transaction-id")
      vi.spyOn(payload.db, "commitTransaction").mockResolvedValue(undefined)
      vi.spyOn(payload.db, "rollbackTransaction").mockResolvedValue(undefined)

      // Spy on transaction methods
      const beginTransactionSpy = vi.spyOn(payload.db, "beginTransaction")
      const commitTransactionSpy = vi.spyOn(payload.db, "commitTransaction")
      const rollbackTransactionSpy = vi.spyOn(payload.db, "rollbackTransaction")

      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const newGameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        gameSessionSchedule: newGameSessionSchedule,
      })
      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: newGameSession,
      })

      const res = await DELETE(
        createMockNextRequest("/api/admin/game-session-schedules?cascade=true", "DELETE"),
        {
          params: Promise.resolve({
            id: newGameSessionSchedule.id,
          }),
        },
      )

      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      expect(beginTransactionSpy).toHaveBeenCalled()
      expect(commitTransactionSpy).toHaveBeenCalled()
      expect(rollbackTransactionSpy).not.toHaveBeenCalled()

      beginTransactionSpy.mockRestore()
      commitTransactionSpy.mockRestore()
      rollbackTransactionSpy.mockRestore()
    })

    it("should return 404 if game session schedule is not found", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await DELETE(
        createMockNextRequest("/api/admin/game-session-schedules?deleteRelatedDocs=true", "DELETE"),
        {
          params: Promise.resolve({ id: "invalid-id" }),
        },
      )

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual("Game session schedule not found")
    })
  })
})
