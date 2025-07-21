import { AUTH_COOKIE_NAME, type UpdateGameSessionScheduleData } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
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
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const res = await DELETE(createMockNextRequest("", "DELETE"), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await DELETE(createMockNextRequest("", "DELETE"), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should delete gameSessionSchedule if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )

      const res = await DELETE(createMockNextRequest("", "DELETE"), {
        params: Promise.resolve({ id: newGameSessionSchedule.id }),
      })

      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(
        gameSessionDataService.getGameSessionScheduleById(newGameSessionSchedule.id),
      ).rejects.toThrow(getReasonPhrase(StatusCodes.NOT_FOUND))
    })

    it("should return 404 if gameSessionSchedule is non-existent", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await DELETE(createMockNextRequest("", "DELETE"), {
        params: Promise.resolve({ id: "non-existent" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await DELETE(createMockNextRequest("", "DELETE"), {
        params: Promise.reject(new Error("Param parsing failed")),
      })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })
})
