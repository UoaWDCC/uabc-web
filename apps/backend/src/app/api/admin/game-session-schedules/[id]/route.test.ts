import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { DELETE } from "./route"

const baseRoute = "/api/admin/game-session-schedules"

describe(`${baseRoute}/[id]`, async () => {
  const gameSessionDataService = new GameSessionDataService()
  const cookieStore = await cookies()

  describe("DELETE", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
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
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: newGameSessionSchedule.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(
        gameSessionDataService.getGameSessionScheduleById(newGameSessionSchedule.id),
      ).rejects.toThrow(getReasonPhrase(StatusCodes.NOT_FOUND))
    })

    it("should return 404 if gameSessionSchedule is non-existent", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: "non-existent" }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.reject(new Error("Param parsing failed")),
      })
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })
})
