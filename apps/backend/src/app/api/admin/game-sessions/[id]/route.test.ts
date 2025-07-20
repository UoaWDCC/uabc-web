import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import {
  gameSessionCreateMock,
  gameSessionWithScheduleCreateMock,
} from "@/test-config/mocks/GameSession.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { DELETE, PATCH } from "./route"

describe("/api/admin/game-sessions/[id]", async () => {
  const gameSessionDataService = new GameSessionDataService()
  const bookingDataService = new BookingDataService()
  const cookieStore = await cookies()

  describe("DELETE", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const res = await DELETE(createMockNextRequest("/api/admin/game-sessions", "DELETE"), {
        params: Promise.resolve({ id: newGameSession.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const res = await DELETE(createMockNextRequest("/api/admin/game-sessions", "DELETE"), {
        params: Promise.resolve({ id: newGameSession.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should delete gameSession if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newGameSession = await gameSessionDataService.createGameSession(
        gameSessionWithScheduleCreateMock,
      )
      const newGameSessionSchedule = newGameSession.gameSessionSchedule
      expect(newGameSessionSchedule).toBeDefined()
      const res = await DELETE(createMockNextRequest("/api/admin/game-sessions", "DELETE"), {
        params: Promise.resolve({ id: newGameSession.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)

      if (newGameSessionSchedule) {
        await expect(
          gameSessionDataService.getGameSessionScheduleById(
            typeof newGameSessionSchedule === "string"
              ? newGameSessionSchedule
              : newGameSessionSchedule.id,
          ),
        ).rejects.toThrow("Not Found")
      }
      await expect(gameSessionDataService.getGameSessionById(newGameSession.id)).rejects.toThrow(
        "Not Found",
      )
      expect(await bookingDataService.getBookingsBySessionId(newGameSession.id)).toEqual([])
    })

    it("should return 404 if gameSession is non-existent", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE(createMockNextRequest("/api/admin/game-sessions", "DELETE"), {
        params: Promise.resolve({ id: "non-existent" }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE(createMockNextRequest("/api/admin/game-sessions", "DELETE"), {
        params: Promise.reject(new Error("Param parsing failed")),
      })
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual("Internal Server Error")
    })
  })

  describe("PATCH", () => {
    it("should return a 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const res = await PATCH(createMockNextRequest("/api/admin/game-sessions", "PATCH"), {
        params: Promise.resolve({ id: "test" }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const res = await PATCH(createMockNextRequest("/api/admin/game-sessions", "PATCH"), {
        params: Promise.resolve({ id: "test" }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should update game session if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const updateGameSession = { capacity: 6 }
      const res = await PATCH(
        createMockNextRequest("/api/admin/game-sessions", "PATCH", updateGameSession),
        {
          params: Promise.resolve({ id: newGameSession.id }),
        },
      )
      expect(res.status).toBe(StatusCodes.OK)
      const fetchedUpdatedGameSession = await gameSessionDataService.getGameSessionById(
        newGameSession.id,
      )
      expect(fetchedUpdatedGameSession.capacity).toEqual(updateGameSession.capacity)
    })

    it("should return 400 when invalid request body", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const res = await PATCH(
        createMockNextRequest("/api/admin/game-sessions", "PATCH", {
          ...gameSessionCreateMock,
          capacity: "invalid",
        }),
        { params: Promise.resolve({ id: newGameSession.id }) },
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.capacity[0]).toEqual("Expected number, received string")
    })

    it("should return a 404 error if the game session does not exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(
        createMockNextRequest("/api/admin/game-sessions", "PATCH", { capacity: 5 }),
        {
          params: Promise.resolve({ id: "does not exist" }),
        },
      )
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual("Game session not found")
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(
        createMockNextRequest("/api/admin/game-sessions", "PATCH", { capacity: "test" }),
        {
          params: Promise.reject(new Error("Param parsing failed")),
        },
      )
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual("Internal Server Error")
    })
  })
})
